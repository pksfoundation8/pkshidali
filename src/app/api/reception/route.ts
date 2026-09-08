import { NextResponse } from 'next/server';
import { getWriteClient, getClient } from '@/lib/sanity/client';
import { rateLimit, clientKey } from '@/lib/rate-limit';
import { verifyTurnstile } from '@/lib/turnstile';
import { sendEnquiry } from '@/lib/enquiry';
import { sendReceptionCode } from '@/lib/reception-mail';
import { receptionHosts, makeReceptionCode } from '@/content/reception';

/**
 * Reception registration.
 *
 * Same order of defence as the RSVP route: rate limit, honeypot, Turnstile,
 * validation, then persist. Two things differ.
 *
 * The reception is by invitation, so `host` must be one of the family members
 * actually hosting — a registration filed against a name nobody recognises is
 * worth nothing at the door.
 *
 * And the guest is issued a code. It is returned in the response as well as
 * emailed, because a code that exists only in an email the guest never got
 * would leave them turned away at the door with no recourse.
 */

export const runtime = 'nodejs';

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 6;

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

/** Codes are read aloud and handwritten, so a collision must not happen twice
 *  in one guest list. Checked against what is stored rather than trusted to
 *  entropy alone. */
async function uniqueCode(): Promise<string> {
  const read = getClient();
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const code = makeReceptionCode();
    if (!read) return code;
    try {
      const taken = await read.fetch<boolean>(
        'count(*[_type == "receptionGuest" && code == $code]) > 0', { code },
      );
      if (!taken) return code;
    } catch (err) {
      // If the check itself fails, fall back to the generated code rather than
      // refusing the registration — a duplicate is recoverable, a lost guest is not.
      console.error('[reception] uniqueness check failed', err);
      return code;
    }
  }
  return makeReceptionCode();
}

export async function POST(req: Request) {
  const ip = clientKey(req);

  const limit = await rateLimit(`reception:${ip}`, MAX_PER_WINDOW, WINDOW_MS);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'You have sent several registrations recently. Please try again a little later.' },
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

  const guestsRaw = Number(data.guests);
  const f = {
    name: str(data.name),
    email: str(data.email),
    phone: str(data.phone),
    host: str(data.host),
    guests: Number.isFinite(guestsRaw) ? Math.min(Math.max(Math.trunc(guestsRaw), 1), 20) : 1,
    message: str(data.message),
  };

  const errors: Record<string, string> = {};
  if (!f.name) errors.name = 'Please tell us your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
    errors.email = 'A working email address, please — the code is sent there.';
  }
  if (!(receptionHosts as readonly string[]).includes(f.host)) {
    errors.host = 'Please choose who invited you.';
  }
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 422 });

  const code = await uniqueCode();
  const submittedAt = new Date().toISOString();
  const client = getWriteClient();

  if (!client) {
    // Nowhere to record it means nothing to check at the door, so do not hand
    // out a code that no list will back up.
    console.error('[reception] no CMS configured; registration refused');
    return NextResponse.json(
      { error: 'Reception registration is not switched on yet. Please contact the family directly.' },
      { status: 503 },
    );
  }

  const { delivered } = await sendReceptionCode(f.email, f.name, code, f.host).catch(
    () => ({ delivered: false }),
  );

  try {
    await client.create({ _type: 'receptionGuest', ...f, code, emailed: delivered, submittedAt });
  } catch (err) {
    console.error('[reception] could not persist', err);
    return NextResponse.json(
      { error: 'We could not save your registration. Please try again shortly.' },
      { status: 503 },
    );
  }

  // Best effort — the guest is already on the list, so a mail failure here
  // must not fail the registration.
  await sendEnquiry(
    'contact',
    `Reception registration — ${f.name} (guest of ${f.host})`,
    [
      ['Name', f.name], ['Email', f.email], ['Phone', f.phone || '—'],
      ['Guest of', f.host], ['Party size', String(f.guests)],
      ['Code', code], ['Code emailed', delivered ? 'yes' : 'NO — tell them the code'],
    ],
    f.message || '(no message)',
    f.email,
  ).catch(() => undefined);

  return NextResponse.json({ ok: true, code, emailed: delivered }, { status: 201 });
}
