import { NextResponse } from 'next/server';
import { rateLimit, clientKey } from '@/lib/rate-limit';
import { verifyTurnstile } from '@/lib/turnstile';
import { sendEnquiry } from '@/lib/enquiry';
import { volunteerAreas, availabilityOptions, workingWithChildren } from '@/content/forms';

export const runtime = 'nodejs';

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

export async function POST(req: Request) {
  const ip = clientKey(req);
  const limit = await rateLimit(`volunteer:${ip}`, 5, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'You have submitted several applications recently. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    );
  }

  let data: Record<string, unknown>;
  try {
    data = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Malformed request body.' }, { status: 400 });
  }

  if (str(data.website)) return NextResponse.json({ ok: true }, { status: 202 });

  if (!(await verifyTurnstile(str(data.turnstileToken) || null, ip))) {
    return NextResponse.json(
      { error: 'We could not verify that you are human. Please reload the page and try again.' },
      { status: 403 },
    );
  }

  const f = {
    name: str(data.name),
    email: str(data.email),
    phone: str(data.phone),
    location: str(data.location),
    area: str(data.area),
    availability: str(data.availability),
    connection: str(data.connection),
    message: str(data.message),
    safeguardingAck: data.safeguardingAck === true || data.safeguardingAck === 'true',
  };

  const errors: Record<string, string> = {};
  if (!f.name) errors.name = 'Please tell us your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) errors.email = 'A working email address, please.';
  if (!f.area || !volunteerAreas.includes(f.area)) errors.area = 'Choose where you would like to help.';
  if (f.availability && !availabilityOptions.includes(f.availability)) {
    errors.availability = 'Choose one of the listed options.';
  }

  // Safeguarding: anything involving children requires explicit acknowledgement
  // of the check up front. This is the one consent the form will not proceed
  // without, because a placement decision later depends on it.
  const childFacing = workingWithChildren.includes(f.area);
  if (childFacing && !f.safeguardingAck) {
    errors.safeguardingAck =
      'This role involves working with children, so we need your agreement to a safeguarding check.';
  }

  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 422 });

  const { delivered } = await sendEnquiry(
    'volunteer',
    `Volunteer application — ${f.name} (${f.area})`,
    [
      ['Name', f.name],
      ['Email', f.email],
      ['Phone', f.phone || '—'],
      ['Location', f.location || '—'],
      ['Area', f.area],
      ['Availability', f.availability || '—'],
      ['Knew him as', f.connection || '—'],
      ['Child-facing', childFacing ? 'YES — safeguarding check required' : 'No'],
      ['Safeguarding agreed', f.safeguardingAck ? 'Yes' : 'n/a'],
    ],
    f.message || '(no additional message)',
    f.email,
  );

  return NextResponse.json({ ok: true, delivered, childFacing }, { status: 200 });
}
