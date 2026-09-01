'use client';

import { useState } from 'react';
import { Field } from '@/components/forms/Field';
import { Turnstile } from '@/components/tributes/Turnstile';
import { Icon } from '@/components/primitives/Icon';
import { rsvpEventOptions } from '@/content/funeral';

const BLANK = {
  name: '', email: '', phone: '', travellingFrom: '', relationship: '',
  message: '', guests: '1', website: '',
};

export function RsvpForm() {
  const [f, setF] = useState(BLANK);
  const [attending, setAttending] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'failed'>('idle');
  const [failMsg, setFailMsg] = useState('');

  const set = (k: keyof typeof BLANK) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setF({ ...f, [k]: e.target.value });

  const toggle = (key: string) =>
    setAttending((a) => (a.includes(key) ? a.filter((k) => k !== key) : [...a, key]));

  const submit = async () => {
    const e: Record<string, string> = {};
    if (!f.name.trim()) e.name = 'Please tell us your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'A working email address, please.';
    if (!attending.length) e.attending = 'Please choose at least one service.';
    setErrs(e);
    if (Object.keys(e).length) {
      document.querySelector('.rsvp .field.bad, .rsvp .evpick.bad')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setState('sending'); setFailMsg('');
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...f, guests: Number(f.guests), attending, turnstileToken: token }),
      });
      if (res.ok) { setState('done'); return; }
      const payload = await res.json().catch(() => ({}));
      if (payload.errors) { setErrs(payload.errors); setState('idle'); return; }
      setFailMsg(payload.error ?? 'That did not send. Please try again shortly.');
      setState('failed');
    } catch {
      setFailMsg('We could not reach the server. Please check your connection and try again.');
      setState('failed');
    }
  };

  if (state === 'done') {
    return (
      <div className="panel rsvp-done">
        <span className="ring"><Icon n="check" s={26} /></span>
        <h3>Thank you — your response is recorded</h3>
        <p>
          The family has your details and looks forward to seeing you. If your plans change,
          simply send the form again or contact the family directly.
        </p>
        <button type="button" className="btn btn-outline"
          onClick={() => { setF(BLANK); setAttending([]); setErrs({}); setState('idle'); }}>
          Respond for someone else
        </button>
      </div>
    );
  }

  return (
    <div className="panel rsvp" id="rsvp">
      <h3>Let the family know you are coming</h3>
      <p className="rsvp-lede">
        Attendance is not required to be welcome — this simply helps the family prepare
        seating and hospitality.
      </p>

      <fieldset className={`evpick${errs.attending ? ' bad' : ''}`}>
        <legend>Which will you attend?<span className="req">*</span></legend>
        {rsvpEventOptions.map((o) => (
          <label key={o.key} className={attending.includes(o.key) ? 'on' : ''}>
            <input type="checkbox" checked={attending.includes(o.key)}
              onChange={() => toggle(o.key)} />
            <span>{o.label}</span>
          </label>
        ))}
        {errs.attending && <span className="err"><Icon n="info" s={14} />{errs.attending}</span>}
      </fieldset>

      <div className="grid2">
        <Field label="Full name" htmlFor="r-name" required error={errs.name}>
          <input id="r-name" value={f.name} onChange={set('name')} autoComplete="name" />
        </Field>
        <Field label="Email address" htmlFor="r-email" required error={errs.email}
          hint="Used only if arrangements change.">
          <input id="r-email" type="email" value={f.email} onChange={set('email')} autoComplete="email" />
        </Field>
      </div>

      <div className="grid2">
        <Field label="Phone" htmlFor="r-phone">
          <input id="r-phone" value={f.phone} onChange={set('phone')} autoComplete="tel"
            placeholder="+234…" />
        </Field>
        <Field label="How many attending?" htmlFor="r-guests" hint="Including yourself.">
          <input id="r-guests" type="number" min={1} max={50} value={f.guests} onChange={set('guests')} />
        </Field>
      </div>

      <div className="grid2">
        <Field label="Travelling from" htmlFor="r-from">
          <input id="r-from" value={f.travellingFrom} onChange={set('travellingFrom')}
            placeholder="City, country" />
        </Field>
        <Field label="How did you know him?" htmlFor="r-rel">
          <input id="r-rel" value={f.relationship} onChange={set('relationship')}
            placeholder="Former student, church member…" />
        </Field>
      </div>

      <Field label="Message to the family" htmlFor="r-msg">
        <textarea id="r-msg" value={f.message} onChange={set('message')}
          placeholder="Optional — a word of comfort, or anything the family should know." />
      </Field>

      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
        <label htmlFor="r-website">Website</label>
        <input id="r-website" tabIndex={-1} autoComplete="off" value={f.website} onChange={set('website')} />
      </div>

      <Turnstile onToken={setToken} />

      {state === 'failed' && failMsg && (
        <p className="err" style={{ marginTop: 16 }}><Icon n="info" s={14} />{failMsg}</p>
      )}

      <button type="button" className="btn btn-gold" disabled={state === 'sending'}
        style={{ marginTop: 24, width: '100%' }} onClick={submit}>
        <Icon n="check" s={16} />{state === 'sending' ? 'Sending…' : 'Confirm attendance'}
      </button>
    </div>
  );
}
