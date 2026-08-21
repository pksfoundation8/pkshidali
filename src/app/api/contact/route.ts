import { NextResponse } from 'next/server';
import { rateLimit, clientKey } from '@/lib/rate-limit';
import { verifyTurnstile } from '@/lib/turnstile';
import { sendEnquiry } from '@/lib/enquiry';
import { contactSubjects } from '@/content/forms';

export const runtime = 'nodejs';

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

export async function POST(req: Request) {
  const ip = clientKey(req);
  const limit = rateLimit(`contact:${ip}`, 5, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'You have sent several messages recently. Please try again a little later.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    );
  }

  let data: Record<string, unknown>;
  try {
    data = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Malformed request body.' }, { status: 400 });
  }

  // Honeypot — accepted silently.
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
    subject: str(data.subject),
    message: str(data.message),
  };

  const errors: Record<string, string> = {};
  if (!f.name) errors.name = 'Please tell us your name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) errors.email = 'A working email address, please.';
  if (!f.subject || !contactSubjects.includes(f.subject)) errors.subject = 'Please choose a subject.';
  if (f.message.length < 10) errors.message = 'A little more detail would help us reply properly.';
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 422 });

  const { delivered } = await sendEnquiry(
    'contact',
    `Website enquiry — ${f.subject}`,
    [['From', f.name], ['Email', f.email], ['Subject', f.subject]],
    f.message,
    f.email,
  );

  return NextResponse.json({ ok: true, delivered }, { status: 200 });
}
