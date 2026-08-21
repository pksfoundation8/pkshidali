import 'server-only';
import { createClient, type SanityClient } from '@sanity/client';
import { projectId, dataset, apiVersion, isSanityConfigured } from './env';

/**
 * `server-only` makes an accidental client import a build error rather than a
 * 60kB regression on every page. Uses @sanity/client directly — importing the
 * client from `next-sanity` drags studio code into the browser bundle.
 */

let cached: SanityClient | null = null;

/** Read client. Returns null when no project is configured. */
export function getClient(): SanityClient | null {
  if (!isSanityConfigured) return null;
  cached ??= createClient({
    projectId, dataset, apiVersion,
    useCdn: process.env.NODE_ENV === 'production',
    perspective: 'published',
  });
  return cached;
}

/**
 * Write client for tribute intake. Requires SANITY_API_WRITE_TOKEN, which is
 * server-only and must never be exposed to the browser.
 */
export function getWriteClient(): SanityClient | null {
  const token = process.env.SANITY_API_WRITE_TOKEN;
  if (!isSanityConfigured || !token) return null;
  return createClient({ projectId, dataset, apiVersion, useCdn: false, token });
}

/**
 * Fetch with cache tags so /api/revalidate can invalidate precisely.
 * Any failure returns null and the caller falls back to seed data — a CMS
 * outage should degrade the site, not take it down.
 */
export async function sanityFetch<T>(
  query: string,
  tags: string[],
  params: Record<string, unknown> = {},
): Promise<T | null> {
  const client = getClient();
  if (!client) return null;
  try {
    // Cast: @sanity/client types the third argument without Next's `next`
    // cache options, which Next reads off the underlying fetch call.
    const options = { next: { tags, revalidate: 3600 } } as Record<string, unknown>;
    return (await client.fetch(query, params, options)) as T;
  } catch (err) {
    console.error('[sanity] fetch failed, falling back to seed content', err);
    return null;
  }
}
