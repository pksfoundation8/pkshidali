import 'server-only';
import { kvConfigured, kvPipeline } from './kv';

/**
 * Fixed-window rate limiter.
 *
 * Production: Vercel KV / Upstash Redis — one pipelined round trip per check
 * (INCR, PEXPIRE NX, PTTL), shared across every serverless instance, so the
 * limit is the limit. If KV errors, the check FAILS OPEN with a logged error:
 * a storage outage must not block tributes, and Turnstile + the honeypot
 * still stand behind it.
 *
 * Local/dev fallback: an in-process map, which is per instance and resets on
 * restart — adequate for development only.
 */

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  /** Seconds until the window resets. */
  retryAfter: number;
};

export const rateLimitStore: 'kv' | 'memory' = kvConfigured ? 'kv' : 'memory';

// ── KV ────────────────────────────────────────────────────────────────
async function kvLimit(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
  const k = `pks:rl:${key}`;
  const [count, , ttl] = await kvPipeline<[number, unknown, number]>([
    ['INCR', k],
    ['PEXPIRE', k, windowMs, 'NX'],
    ['PTTL', k],
  ]);
  const retryAfter = Math.max(1, Math.ceil((ttl > 0 ? ttl : windowMs) / 1000));
  if (count > limit) return { ok: false, remaining: 0, retryAfter };
  return { ok: true, remaining: limit - count, retryAfter: 0 };
}

// ── memory fallback ───────────────────────────────────────────────────
type Hit = { count: number; resetAt: number };
const buckets = new Map<string, Hit>();

/** Stops the map growing without bound on a long-lived instance. */
function sweep(now: number) {
  if (buckets.size < 5000) return;
  for (const [key, hit] of buckets) if (hit.resetAt <= now) buckets.delete(key);
}

function memoryLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  sweep(now);
  const hit = buckets.get(key);
  if (!hit || hit.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfter: 0 };
  }
  hit.count += 1;
  const retryAfter = Math.ceil((hit.resetAt - now) / 1000);
  if (hit.count > limit) return { ok: false, remaining: 0, retryAfter };
  return { ok: true, remaining: limit - hit.count, retryAfter };
}

// ── public API ────────────────────────────────────────────────────────
export async function rateLimit(key: string, limit: number, windowMs: number): Promise<RateLimitResult> {
  if (rateLimitStore === 'memory') return memoryLimit(key, limit, windowMs);
  try {
    return await kvLimit(key, limit, windowMs);
  } catch (err) {
    console.error('[rate-limit] KV unavailable, failing open', err);
    return { ok: true, remaining: limit, retryAfter: 0 };
  }
}

/**
 * Best-effort client identity. Behind a proxy the leftmost x-forwarded-for
 * entry is client-supplied and spoofable — on Vercel and Cloudflare the
 * platform headers below are trustworthy, so they are preferred.
 */
export function clientKey(req: Request): string {
  const h = req.headers;
  const ip =
    h.get('cf-connecting-ip') ??
    h.get('x-real-ip') ??
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown';
  return ip;
}
