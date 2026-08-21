'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Field } from './Field';
import { Turnstile } from '@/components/tributes/Turnstile';
import { Icon } from '@/components/primitives/Icon';
import { contactSubjects } from '@/content/forms';

const BLANK = { name: '', email: '', subject: '', message: '', website: '' };

export function ContactForm({ initialSubject = '' }: { initialSubject?: string }) {
  const [f, setF] = useState({ ...BLANK, subject: initialSubject });
  const [token, setToken] = useState<string | null>(null);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [delivered, setDelivered] = useState(true);
  const [failMsg, setFailMsg] = useState('');

  const set = (k: keyof typeof BLANK) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setF({ ...f, [k]: e.target.value });

  const submit = async () => {
    setState('sending'); setFailMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, turnstileToken: token }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) { setDelivered(data.delivered !== false); setState('sent'); return; }
      if (data.errors) {
        setErrs(data.errors); setState('idle');
        document.querySelector('.field.bad')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      setFailMsg(data.error ?? 'That did not send. Please try again shortly.');
      setState('failed');
    } catch {
      setFailMsg('We could not reach the server. Please try again, or email the foundation directly.');
      setState('failed');
    }
  };

  if (state === 'sent') {
    return (
      <div className="panel">
        <span className="ring"><Icon n="check" s={26} /></span>
        <h2 style={{ marginTop: 20, fontSize: 28 }}>Message received</h2>
        <p className="lead" style={{ marginTop: 14 }}>
          {delivered
            ? <>Someone from the foundation will reply to {f.email}.</>
            : <>Your message reached the site, but email delivery is not switched on yet, so it may
              not have reached anyone. If it is urgent, please contact the family directly.</>}
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 26 }}>
          <Link href="/" className="btn btn-solid">Back to home</Link>
          <button type="button" className="btn btn-outline"
            onClick={() => { setF(BLANK); setErrs({}); setState('idle'); }}>
            Send another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="grid2">
        <Field label="Name" htmlFor="c-name" required error={errs.name}>
          <input id="c-name" value={f.name} onChange={set('name')} autoComplete="name" />
        </Field>
        <Field label="Email" htmlFor="c-email" required error={errs.email}>
          <input id="c-email" type="email" value={f.email} onChange={set('email')}
            autoComplete="email" placeholder="you@example.com" />
        </Field>
      </div>

      <Field label="Subject" htmlFor="c-subject" required error={errs.subject}>
        <select id="c-subject" value={f.subject} onChange={set('subject')}>
          <option value="">Choose one…</option>
          {contactSubjects.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </Field>

      <Field label="Message" htmlFor="c-message" required error={errs.message}>
        <textarea id="c-message" value={f.message} onChange={set('message')} style={{ minHeight: 150 }} />
      </Field>

      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
        <label htmlFor="c-website">Website</label>
        <input id="c-website" tabIndex={-1} autoComplete="off" value={f.website} onChange={set('website')} />
      </div>

      <Turnstile onToken={setToken} />

      {state === 'failed' && failMsg && (
        <p className="err" style={{ marginTop: 18 }}><Icon n="info" s={14} />{failMsg}</p>
      )}

      <button type="button" className="btn btn-solid" disabled={state === 'sending'}
        style={{ marginTop: 26, width: '100%' }} onClick={submit}>
        {state === 'sending' ? 'Sending…' : 'Send message'}
      </button>
    </div>
  );
}
