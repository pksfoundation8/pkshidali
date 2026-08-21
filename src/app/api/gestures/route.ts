import { NextResponse } from 'next/server';
import { readGestures, addGesture, GESTURE_KINDS, type GestureKind } from '@/lib/gestures';
import { rateLimit, clientKey } from '@/lib/rate-limit';

/** Remembrance gestures: GET returns the collective counts, POST records one.
 *  The client keeps a per-device "already done" flag; the rate limit here is
 *  the server-side backstop against scripted inflation. */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(await readGestures());
}

export async function POST(req: Request) {
  const ip = clientKey(req);
  const limit = await rateLimit(`gesture:${ip}`, 12, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many gestures from this connection. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    );
  }

  let kind: unknown;
  try {
    ({ kind } = (await req.json()) as { kind?: unknown });
  } catch {
    return NextResponse.json({ error: 'Malformed request body.' }, { status: 400 });
  }
  if (!GESTURE_KINDS.includes(kind as GestureKind)) {
    return NextResponse.json({ error: 'Unknown gesture.' }, { status: 400 });
  }

  try {
    return NextResponse.json(await addGesture(kind as GestureKind));
  } catch (err) {
    console.error('[gestures] write failed', err);
    return NextResponse.json({ error: 'Could not record that just now.' }, { status: 503 });
  }
}
