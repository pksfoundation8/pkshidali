import 'server-only';

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export const turnstileConfigured = Boolean(process.env.TURNSTILE_SECRET_KEY);

/**
 * Verifies a Cloudflare Turnstile token.
 *
 * When no secret is configured this returns true — the site must remain
 * submittable during review, and the honeypot plus rate limit still apply.
 * Set TURNSTILE_SECRET_KEY before the site is publicised.
 */
export async function verifyTurnstile(token: string | null, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  try {
    const body = new URLSearchParams({ secret, response: token, remoteip: ip });
    const res = await fetch(VERIFY_URL, {
      method: 'POST',
      body,
      // Never let a slow challenge server hang the submission.
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error('[turnstile] verification failed', err);
    // Fail closed: an unverifiable submission is rejected, not waved through.
    return false;
  }
}
