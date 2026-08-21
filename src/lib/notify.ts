import 'server-only';
import { site } from '@/config/site';

/**
 * Moderator notification.
 *
 * Uses Resend's HTTP API — no SDK, so there is nothing to keep updated. When
 * RESEND_API_KEY or MODERATOR_NOTIFY_EMAIL is unset this logs and returns
 * false; a notification failure must never fail the submission, because the
 * tribute is already safely stored as pending.
 */
export async function notifyModerator(tribute: {
  name: string; relationship: string; title?: string; body: string;
}): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.MODERATOR_NOTIFY_EMAIL;
  const from = process.env.NOTIFY_FROM_EMAIL ?? `noreply@${site.domain}`;

  if (!key || !to) {
    console.info('[notify] moderator email not configured; tribute is pending in the studio');
    return false;
  }

  const preview = tribute.body.length > 400 ? `${tribute.body.slice(0, 400)}…` : tribute.body;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to,
        subject: `New tribute awaiting review — ${tribute.name}`,
        text: [
          `A tribute has been submitted and is waiting for review.`,
          ``,
          `From:         ${tribute.name}`,
          `Relationship: ${tribute.relationship}`,
          tribute.title ? `Title:        ${tribute.title}` : null,
          ``,
          preview,
          ``,
          `Review it: ${site.url}/studio/structure/tribute`,
          ``,
          `Nothing is published until someone approves it.`,
        ].filter(Boolean).join('\n'),
      }),
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.error('[notify] provider rejected the email', res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error('[notify] could not send moderator email', err);
    return false;
  }
}
