import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { addLocalTribute } from '@/lib/local-tributes';
import { getWriteClient } from '@/lib/sanity/client';
import { rateLimit, clientKey } from '@/lib/rate-limit';
import { verifyTurnstile } from '@/lib/turnstile';
import { notifyModerator } from '@/lib/notify';

/**
 * Tribute intake.
 *
 * Order of defence:
 *   1. rate limit      — 3 submissions per IP per hour
 *   2. honeypot        — accepted silently so a bot learns nothing
 *   3. Turnstile       — verified when configured, fails closed
 *   4. validation      — server-side, independent of the client
 *   5. asset upload    — size and type checked before touching Sanity
 *   6. create          — AUTO-APPROVED for now: submissions go straight to
 *                        status "published". When the family's moderation
 *                        workflow goes live, set SUBMISSION_STATUS back to
 *                        'pending' so a human becomes the publication gate.
 *   7. notify          — best effort; never fails the submission
 *
 * Accepts multipart/form-data (the site form, which may carry files) or JSON.
 */

export const runtime = 'nodejs';

/** Auto-approve for launch; flip to 'pending' once moderators are active. */
const SUBMISSION_STATUS = 'published';

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 3;

const MAX_PHOTO_BYTES = 8 * 1024 * 1024;
const MAX_AUDIO_BYTES = 20 * 1024 * 1024;
const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
const AUDIO_TYPES = [
  'audio/mpeg', 'audio/mp4', 'audio/m4a', 'audio/x-m4a',
  'audio/wav', 'audio/webm', 'audio/ogg',
];

type Fields = Record<string, string>;

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
const bool = (v: unknown) => v === true || v === 'true' || v === 'on';

function validate(t: {
  name: string; email: string; relationship: string; body: string;
  permissionPublish: boolean; permissionArchive: boolean;
}) {
  const errors: Record<string, string> = {};
  if (!t.name) errors.name = 'Name is required.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t.email)) errors.email = 'A valid email is required.';
  if (!t.relationship) errors.relationship = 'Relationship is required.';
  if (t.body.length < 40) errors.body = 'Tribute must be at least 40 characters.';
  if (!t.permissionPublish) errors.permissionPublish = 'Publication consent is required.';
  if (!t.permissionArchive) errors.permissionArchive = 'Archive consent is required.';
  return errors;
}

function checkFile(file: File, maxBytes: number, types: string[], label: string) {
  if (file.size > maxBytes) {
    return `${label} is too large. The limit is ${Math.round(maxBytes / 1024 / 1024)}MB.`;
  }
  if (file.type && !types.includes(file.type)) {
    return `${label} is not a supported format.`;
  }
  return null;
}

export async function POST(req: Request) {
  const ip = clientKey(req);

  // 1 ── rate limit
  const limit = rateLimit(`tribute:${ip}`, MAX_PER_WINDOW, WINDOW_MS);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'You have submitted several tributes recently. Please try again a little later.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    );
  }

  // ── parse
  let fields: Fields = {};
  let photo: File | null = null;
  let audio: File | null = null;

  const contentType = req.headers.get('content-type') ?? '';
  try {
    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData();
      for (const [key, value] of form.entries()) {
        if (value instanceof File) {
          if (value.size === 0) continue;
          if (key === 'photo') photo = value;
          if (key === 'audio') audio = value;
        } else {
          fields[key] = value;
        }
      }
    } else {
      const json = (await req.json()) as Record<string, unknown>;
      fields = Object.fromEntries(
        Object.entries(json).map(([k, v]) => [k, typeof v === 'boolean' ? String(v) : str(v)]),
      );
    }
  } catch {
    return NextResponse.json({ error: 'Malformed request body.' }, { status: 400 });
  }

  // 2 ── honeypot. Accept silently; a bot should learn nothing from the reply.
  if (str(fields.website)) {
    return NextResponse.json({ ok: true }, { status: 202 });
  }

  // 3 ── Turnstile
  const passed = await verifyTurnstile(fields.turnstileToken ?? null, ip);
  if (!passed) {
    return NextResponse.json(
      { error: 'We could not verify that you are human. Please reload the page and try again.' },
      { status: 403 },
    );
  }

  // 4 ── validation
  const tribute = {
    name: str(fields.name),
    email: str(fields.email),
    relationship: str(fields.relationship),
    years: str(fields.years),
    location: str(fields.location),
    title: str(fields.title),
    taught: str(fields.taught),
    body: str(fields.body),
    videoUrl: str(fields.videoUrl),
    permissionPublish: bool(fields.permissionPublish),
    permissionArchive: bool(fields.permissionArchive),
  };

  const errors = validate(tribute);

  if (photo) {
    const err = checkFile(photo, MAX_PHOTO_BYTES, PHOTO_TYPES, 'Photograph');
    if (err) errors.photo = err;
  }
  if (audio) {
    const err = checkFile(audio, MAX_AUDIO_BYTES, AUDIO_TYPES, 'Audio recording');
    if (err) errors.audio = err;
  }
  if (tribute.videoUrl && !/^https?:\/\//i.test(tribute.videoUrl)) {
    errors.videoUrl = 'Video links must start with http:// or https://';
  }

  if (Object.keys(errors).length) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  const submittedAt = new Date().toISOString();
  const client = getWriteClient();

  if (!client) {
    // No CMS yet: persist to the local file store so the auto-approved
    // tribute actually appears on the site. Uploaded files are not kept in
    // this fallback — only the CMS path stores media.
    try {
      await addLocalTribute({
        id: `l${Date.now().toString(36)}`,
        name: tribute.name,
        email: tribute.email,
        relationship: tribute.relationship,
        years: tribute.years || undefined,
        location: tribute.location || undefined,
        title: tribute.title || undefined,
        taught: tribute.taught || undefined,
        body: tribute.body,
        hasAudio: audio ? true : undefined,
        hasVideo: tribute.videoUrl ? true : undefined,
        videoUrl: tribute.videoUrl || undefined,
        submittedAt,
      });
    } catch (err) {
      console.error('[tribute] local store write failed', err);
      return NextResponse.json(
        { error: 'We could not save your tribute. Please try again shortly.' },
        { status: 503 },
      );
    }
    revalidatePath('/tributes');
    revalidatePath('/');
    return NextResponse.json({ ok: true, status: SUBMISSION_STATUS, persisted: true }, { status: 201 });
  }

  // 5 ── upload assets. A failed upload must not lose the words, so the tribute
  // is created either way and the failure is recorded for the moderator.
  const assetNotes: string[] = [];
  let photoRef: string | null = null;
  let audioRef: string | null = null;

  if (photo) {
    try {
      const asset = await client.assets.upload('image', Buffer.from(await photo.arrayBuffer()), {
        filename: photo.name,
      });
      photoRef = asset._id;
    } catch (err) {
      console.error('[tribute] photo upload failed', err);
      assetNotes.push('A photograph was submitted but failed to upload. Ask the contributor to resend it.');
    }
  }

  if (audio) {
    try {
      const asset = await client.assets.upload('file', Buffer.from(await audio.arrayBuffer()), {
        filename: audio.name,
      });
      audioRef = asset._id;
    } catch (err) {
      console.error('[tribute] audio upload failed', err);
      assetNotes.push('An audio recording was submitted but failed to upload. Ask the contributor to resend it.');
    }
  }

  // 6 ── create (auto-approved for now; see SUBMISSION_STATUS above)
  try {
    await client.create({
      _type: 'tribute',
      name: tribute.name,
      email: tribute.email,
      relationship: tribute.relationship,
      years: tribute.years,
      location: tribute.location,
      title: tribute.title,
      taught: tribute.taught,
      body: tribute.body,
      videoUrl: tribute.videoUrl || undefined,
      ...(photoRef ? { photo: { _type: 'image', asset: { _type: 'reference', _ref: photoRef } } } : {}),
      ...(audioRef ? { audioFile: { _type: 'file', asset: { _type: 'reference', _ref: audioRef } } } : {}),
      status: SUBMISSION_STATUS,
      featured: false,
      submittedAt,
      permissionPublish: tribute.permissionPublish,
      permissionArchive: tribute.permissionArchive,
      // Immutable consent record: what they actually wrote and agreed to.
      // Moderators may correct `body`; this stays untouched.
      rawSubmission: tribute.body,
      moderatorNotes: assetNotes.join('\n') || undefined,
    });
  } catch (err) {
    console.error('[tribute] could not persist submission', err);
    return NextResponse.json(
      { error: 'We could not save your tribute. Please try again shortly.' },
      { status: 503 },
    );
  }

  // Auto-published tributes must appear without waiting for a rebuild.
  revalidatePath('/tributes');
  revalidatePath('/');

  // 7 ── notify. Best effort: the tribute is already safe.
  await notifyModerator(tribute);

  return NextResponse.json({ ok: true, status: SUBMISSION_STATUS, persisted: true }, { status: 201 });
}
