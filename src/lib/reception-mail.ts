import 'server-only';
import { site } from '@/config/site';
import { receptionEvent } from '@/content/reception';

/**
 * Sends a guest their admission code.
 *
 * Unlike the enquiry helper this writes to the guest, not to the family, so a
 * failure here is a failure the guest experiences. The caller must show the
 * code on screen regardless of what this returns — an admission code that
 * exists only in an email nobody received is worse than useless at a door.
 */
export async function sendReceptionCode(
  to: string, name: string, code: string, host: string,
): Promise<{ delivered: boolean }> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.NOTIFY_FROM_EMAIL ?? `noreply@${site.domain}`;
  if (!key) {
    console.info('[reception] code issued but email is not configured', { to, code });
    return { delivered: false };
  }

  const where = receptionEvent.venue ?? 'The venue will be confirmed before the date';
  const text = [
    `Dear ${name},`,
    '',
    `You are invited to the reception following the funeral service for ${site.subject.name},`,
    `at the invitation of ${host}.`,
    '',
    `    Admission code:  ${code}`,
    '',
    `${receptionEvent.dateLabel}, ${receptionEvent.timeLabel}`,
    where,
    '',
    'Please keep this code — you will be asked for it at the door. If the venue is',
    `still to be confirmed, it will be published at ${site.url}/funeral/reception.`,
    '',
    'With thanks,',
    site.name,
  ].join('\n');

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from, to,
        subject: `Your reception admission code — ${code}`,
        text,
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error('[reception] provider rejected the email', res.status, await res.text());
      return { delivered: false };
    }
    return { delivered: true };
  } catch (err) {
    console.error('[reception] could not send the code', err);
    return { delivered: false };
  }
}
