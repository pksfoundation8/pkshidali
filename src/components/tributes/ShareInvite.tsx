'use client';

import { useState } from 'react';
import { Icon } from '@/components/primitives/Icon';
import type { IconName } from '@/components/primitives/Icon';
import { site } from '@/config/site';

/**
 * The ask, made forwardable.
 *
 * Most people who knew him will never search for this site — they will be sent
 * it by someone. WhatsApp leads because that is how this community actually
 * shares, and the prewritten message carries the request so the sender does not
 * have to compose one.
 *
 * Defaults invite a tribute; the funeral pages pass their own copy.
 */

const TRIBUTE_URL = `${site.url}/tributes`;
const TRIBUTE_MESSAGE =
  'Rev. Paul Kadir Shidali — teacher, headmaster, pastor and writer. His family ' +
  'is gathering memories from everyone whose life he touched. If he taught you, ' +
  'pastored you or prayed for you, please add yours:';

export function ShareInvite({
  url = TRIBUTE_URL,
  message = TRIBUTE_MESSAGE,
  heading = 'Know someone who knew him?',
  body = (
    <>
      Most of the people whose lives he touched will never find this site on their
      own. Send it to one person who remembers him &mdash; a former student, a church
      member, a colleague. One message can preserve a memory for generations.
    </>
  ),
  subject = 'A tribute to Rev. Paul Kadir Shidali',
}: {
  url?: string; message?: string; heading?: string;
  body?: React.ReactNode; subject?: string;
} = {}) {
  const [copied, setCopied] = useState(false);
  const URL = url;
  const MESSAGE = message;

  const links: { key: string; label: string; icon: IconName; href: string }[] = [
    { key: 'wa', label: 'WhatsApp', icon: 'wa',
      href: `https://wa.me/?text=${encodeURIComponent(`${MESSAGE} ${URL}`)}` },
    { key: 'fb', label: 'Facebook', icon: 'fb',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(URL)}` },
    { key: 'x', label: 'X', icon: 'send',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(MESSAGE)}&url=${encodeURIComponent(URL)}` },
    { key: 'mail', label: 'Email', icon: 'mail',
      href: `mailto:?subject=${encodeURIComponent('A tribute to Rev. Paul Kadir Shidali')}&body=${encodeURIComponent(`${MESSAGE}\n\n${URL}`)}` },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${MESSAGE} ${URL}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard blocked — the share links still work */
    }
  };

  return (
    <section className="invite" aria-labelledby="invite-h">
      <div className="invite-copy">
        <h3 id="invite-h">{heading}</h3>
        <p>{body}</p>
      </div>

      <ul className="invite-links">
        {links.map((l) => (
          <li key={l.key}>
            <a href={l.href} target="_blank" rel="noopener noreferrer">
              <Icon n={l.icon} s={18} />
              <span>{l.label}</span>
            </a>
          </li>
        ))}
        <li>
          <button type="button" onClick={copy}>
            <Icon n={copied ? 'check' : 'link'} s={18} />
            <span>{copied ? 'Copied' : 'Copy link'}</span>
          </button>
        </li>
      </ul>
    </section>
  );
}
