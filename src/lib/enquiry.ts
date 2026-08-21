import 'server-only';
import { site } from '@/config/site';

/**
 * Shared intake for the contact and volunteer forms.
 *
 * Enquiries are not archival records the way tributes are, so they are not
 * stored as CMS documents — they are routed to a person. If no provider is
 * configured the enquiry is logged and the caller is told the truth, rather
 * than being shown a confirmation for a message nobody received.
 */

export type EnquiryKind = 'contact' | 'volunteer';

export async function sendEnquiry(
  kind: EnquiryKind,
  subject: string,
  lines: [string, string][],
  message: string,
  replyTo: string,
): Promise<{ delivered: boolean }> {
  const key = process.env.RESEND_API_KEY;
  const to = kind === 'volunteer'
    ? process.env.VOLUNTEER_NOTIFY_EMAIL ?? process.env.CONTACT_NOTIFY_EMAIL
    : process.env.CONTACT_NOTIFY_EMAIL;
  const from = process.env.NOTIFY_FROM_EMAIL ?? `noreply@${site.domain}`;

  const width = Math.max(...lines.map(([k]) => k.length));
  const body = [
    ...lines.map(([k, v]) => `${k.padEnd(width)}  ${v}`),
    '',
    message,
  ].join('\n');

  if (!key || !to) {
    console.info(`[${kind}] enquiry received (email not configured)`, { subject, replyTo });
    return { delivered: false };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, reply_to: replyTo, subject, text: body }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error(`[${kind}] provider rejected the email`, res.status, await res.text());
      return { delivered: false };
    }
    return { delivered: true };
  } catch (err) {
    console.error(`[${kind}] could not send enquiry`, err);
    return { delivered: false };
  }
}
