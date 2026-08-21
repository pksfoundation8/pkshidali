import 'server-only';

/**
 * Sliding-window rate limiter.
 *
 * LIMITATION, stated plainly: this lives in process memory. It works on a
 * single instance and resets on deploy. On serverless or multi-instance
 * hosting each instance keeps its own counter, so the effective limit is
 * (limit × instances). That is still a meaningful brake on a naive flood, but
 * it is not a real defence — move this to Upstash Redis before the site is
 * publicised. The interface below is deliberately the same shape as
 * @upstash/ratelimit so the swap is a one-file change.
 */

type Hit = { count: number; resetAt: number };

const buckets = new Map<string, Hit>();

/** Stops the map growing without bound on a long-lived instance. */
function sweep(now: number) {
  if (buckets.size < 5000) return;
  for (const [key, hit] of buckets) if (hit.resetAt <= now) buckets.delete(key);
}

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  /** Seconds until the window resets. */
  retryAfter: number;
};

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
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
