'use client';

import { useState } from 'react';
import { Icon } from '@/components/primitives/Icon';

/** Posts to /api/newsletter in Phase 4. Validates client-side today. */
export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState<string | null>(null);

  const submit = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMsg('Enter a valid email address.');
      return;
    }
    setEmail('');
    setMsg('Subscribed — thank you.');
  };

  return (
    <>
      <div className="sub">
        <label htmlFor="nl" className="sr">Email address</label>
        <input id="nl" type="email" value={email} placeholder="Enter your email"
          onChange={(e) => { setEmail(e.target.value); setMsg(null); }}
          onKeyDown={(e) => e.key === 'Enter' && submit()} />
        <button type="button" onClick={submit}>
          <span className="sr">Subscribe</span><Icon n="send" s={17} />
        </button>
      </div>
      {msg && (
        <p role="status" style={{ marginTop: 8, fontSize: 12.5, color: 'var(--gold-300)' }}>{msg}</p>
      )}
    </>
  );
}
