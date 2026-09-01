import { NextResponse } from 'next/server';
import { getWriteClient } from '@/lib/sanity/client';
import { addLocalRsvp, rsvpFileWritable } from '@/lib/rsvps';
import { rateLimit, clientKey } from '@/lib/rate-limit';
import { verifyTurnstile } from '@/lib/turnstile';
import { sendEnquiry } from '@/lib/enquiry';
import { rsvpEventOptions } from '@/content/funeral';

/**
 * Funeral RSVP intake.
 *
 * Same order of defence as the tribute route: rate limit, honeypot, Turnstile,
 * server-side validation, then persist. An RSVP is a headcount the family will
 * cater against, so it is stored rather than only emailed — and a submission is
 * never acknowledged unless it actually landed somewhere.
 */

export const runtime = 'nodejs';

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 6;
const VALID_EVENTS = rsvpEventOptions.map((e) => e.key as string);

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

export async function POST(req: Request) {
  const ip = clientKey(req);

  const limit = await rateLimit(`rsvp:${ip}`, MAX_PER_WINDOW, WINDOW_MS);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'You have sent several responses recently. Please try again a little later.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    );
  }

  let data: Record<string, unknown>;
  try {
    data = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Malformed request body.' }, { status: 400 });
  }

  // Honeypot: accepted silently so a bot learns nothing.
  if (str(data.website)) return NextResponse.json({ ok: true }, { status: 202 });

  if (!(await verifyTurnstile(str(data.turnstileToken) || null, ip))) {
    return NextResponse.json(
      { error: 'We could not verify that you are human. Please reload the page and try again.' },
      { status: 403 },
    );
  }

  const attending = Array.isArray(data.attending)
    ? (data.attending as unknown[]).map(str).filter((v) => VALID_EVENTS.includes(v))
    : [];
  const guestsRaw = Number(data.guests);
  const f = {
    name: str(data.name),
    email: str(data.email),
    phone: str(data.phone),
    attending,
    guests: Number.isFinite(guestsRaw) ? Math.min(Math.max(Math.trunc(guestsRaw), 1), 50) : 1,
    travellingFrom: str(data.travellingFrom),
    relationship: str(data.relationship),
    message: str(data.message),
  };

  const errors: Record<string, string> = {};
  if (!f.name) errors.name = 'Please tell us your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) errors.email = 'A working email address, please.';
  if (!f.attending.length) errors.attending = 'Please choose at least one service.';
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 422 });

  const submittedAt = new Date().toISOString();
  const client = getWriteClient();

  if (client) {
    try {
      await client.create({ _type: 'rsvp', ...f, submittedAt });
    } catch (err) {
      console.error('[rsvp] could not persist', err);
      return NextResponse.json(
        { error: 'We could not save your response. Please try again shortly.' },
        { status: 503 },
      );
    }
  } else if (rsvpFileWritable) {
    try {
      await addLocalRsvp({ id: `r${Date.now().toString(36)}`, ...f, submittedAt });
    } catch (err) {
      console.error('[rsvp] local store write failed', err);
      return NextResponse.json(
        { error: 'We could not save your response. Please try again shortly.' },
        { status: 503 },
      );
    }
  } else {
    // No CMS and nowhere to write: say so rather than show a false confirmation.
    console.error('[rsvp] no storage configured; submission refused');
    return NextResponse.json(
      { error: 'RSVPs are not switched on yet. Please contact the family directly.' },
      { status: 503 },
    );
  }

  // Best effort — the RSVP is already saved, so a mail failure must not fail it.
  const which = f.attending
    .map((k) => rsvpEventOptions.find((e) => e.key === k)?.label ?? k)
    .join(', ');
  await sendEnquiry(
    'contact',
    `Funeral RSVP — ${f.name} (${f.guests} attending)`,
    [
      ['Name', f.name], ['Email', f.email], ['Phone', f.phone || '—'],
      ['Attending', which], ['Party size', String(f.guests)],
      ['Travelling from', f.travellingFrom || '—'],
      ['Relationship', f.relationship || '—'],
    ],
    f.message || '(no message)',
    f.email,
  ).catch(() => undefined);

  return NextResponse.json({ ok: true, attending: f.attending, guests: f.guests }, { status: 201 });
}
