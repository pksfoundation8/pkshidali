import { revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

/**
 * Sanity webhook target. Publishing a document invalidates only the cache tag
 * for its type, so a tribute going live does not rebuild the whole site.
 *
 * Configure in Sanity: Manage → API → Webhooks
 *   URL     https://pkshidali.org/api/revalidate
 *   Trigger create, update, delete
 *   Secret  SANITY_REVALIDATE_SECRET
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Revalidation secret not configured.' }, { status: 500 });
  }

  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string }>(req, secret);

    if (!isValidSignature) {
      return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 });
    }
    if (!body?._type) {
      return NextResponse.json({ error: 'Payload is missing _type.' }, { status: 400 });
    }

    // Next 16 requires an explicit cache profile alongside the tag.
    revalidateTag(body._type, 'max');
    return NextResponse.json({ revalidated: true, tag: body._type, at: Date.now() });
  } catch (err) {
    console.error('[revalidate] failed', err);
    return NextResponse.json({ error: 'Revalidation failed.' }, { status: 500 });
  }
}
