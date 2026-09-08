'use client';

import { useState } from 'react';
import { Field } from '@/components/forms/Field';
import { Turnstile } from '@/components/tributes/Turnstile';
import { Icon } from '@/components/primitives/Icon';
import { receptionHosts } from '@/content/reception';

const BLANK = { name: '', email: '', phone: '', host: '', guests: '1', message: '', website: '' };

export function ReceptionForm() {
  const [f, setF] = useState(BLANK);
  const [token, setToken] = useState<string | null>(null);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'failed'>('idle');
  const [failMsg, setFailMsg] = useState('');
  const [issued, setIssued] = useState<{ code: string; emailed: boolean } | null>(null);
  const [copied, setCopied] = useState(false);

  const set = (k: keyof typeof BLANK) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setF({ ...f, [k]: e.target.value });

  const submit = async () => {
    const e: Record<string, string> = {};
    if (!f.name.trim()) e.name = 'Please tell us your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
      e.email = 'A working email address, please — the code is sent there.';
    }
    if (!f.host) e.host = 'Please choose who invited you.';
    setErrs(e);
    if (Object.keys(e).length) {
      document.querySelector('.rsvp .field.bad')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setState('sending'); setFailMsg('');
    try {
      const res = await fetch('/api/reception', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...f, guests: Number(f.guests), turnstileToken: token }),
      });
      const payload = await res.json().catch(() => ({}));
      if (res.ok) {
        setIssued({ code: payload.code, emailed: Boolean(payload.emailed) });
        setState('done');
        return;
      }
      if (payload.errors) { setErrs(payload.errors); setState('idle'); return; }
      setFailMsg(payload.error ?? 'That did not send. Please try again shortly.');
      setState('failed');
    } catch {
      setFailMsg('We could not reach the server. Please check your connection and try again.');
      setState('failed');
    }
  };

  /* The code is shown here as well as emailed. If the email never arrives the
     guest still has what the door asks for. */
  if (state === 'done' && issued) {
    return (
      <div className="panel rsvp-done">
        <span className="ring"><Icon n="check" s={26} /></span>
        <h3>You are registered</h3>
        <p>This is your admission code. Please keep it — you will be asked for it at the door.</p>

        <p className="adm-code" aria-label={`Your admission code is ${issued.code.split('').join(' ')}`}>
          {issued.code}
        </p>

        <div className="adm-acts">
          <button type="button" className="btn btn-outline"
            onClick={async () => {
              try { await navigator.clipboard.writeText(issued.code); setCopied(true); setTimeout(() => setCopied(false), 2500); }
              catch { /* clipboard blocked — the code is on screen anyway */ }
            }}>
            <Icon n={copied ? 'check' : 'link'} s={16} />{copied ? 'Copied' : 'Copy code'}
          </button>
        </div>

        <p className="adm-note">
          {issued.emailed
            ? <>A copy has been sent to <b>{f.email}</b>. If it does not arrive, check your spam folder — the code above is the same one.</>
            : <><b>Write this code down now.</b> We could not email a copy, so this screen is the only place it appears.</>}
        </p>

        <button type="button" className="btn btn-outline" style={{ marginTop: 6 }}
          onClick={() => { setF(BLANK); setErrs({}); setIssued(null); setState('idle'); }}>
          Register someone else
        </button>
      </div>
    );
  }

  return (
    <div className="panel rsvp" id="register">
      <h3>Register for the reception</h3>
      <p className="rsvp-lede">
        Tell us who invited you and we will issue your admission code straight away.
      </p>

      <div className="grid2">
        <Field label="Full name" htmlFor="x-name" required error={errs.name}>
          <input id="x-name" value={f.name} onChange={set('name')} autoComplete="name" />
        </Field>
        <Field label="Email address" htmlFor="x-email" required error={errs.email}
          hint="Your code is sent here.">
          <input id="x-email" type="email" value={f.email} onChange={set('email')} autoComplete="email" />
        </Field>
      </div>

      <div className="grid2">
        <Field label="Whose guest are you?" htmlFor="x-host" required error={errs.host}
          hint="The member of the family who invited you.">
          <select id="x-host" value={f.host} onChange={set('host')}>
            <option value="">Please choose&hellip;</option>
            {receptionHosts.map((h) => <option key={h} value={h}>{h}</option>)}
          </select>
        </Field>
        <Field label="How many attending?" htmlFor="x-guests" hint="Including yourself.">
          <input id="x-guests" type="number" min={1} max={20} value={f.guests} onChange={set('guests')} />
        </Field>
      </div>

      <Field label="Phone" htmlFor="x-phone" hint="In case the family needs to reach you about the venue.">
        <input id="x-phone" value={f.phone} onChange={set('phone')} autoComplete="tel" placeholder="+234…" />
      </Field>

      <Field label="Message to the family" htmlFor="x-msg">
        <textarea id="x-msg" value={f.message} onChange={set('message')}
          placeholder="Optional — dietary needs, access requirements, or anything the family should know." />
      </Field>

      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
        <label htmlFor="x-website">Website</label>
        <input id="x-website" tabIndex={-1} autoComplete="off" value={f.website} onChange={set('website')} />
      </div>

      <Turnstile onToken={setToken} />

      {state === 'failed' && failMsg && (
        <p className="err" style={{ marginTop: 16 }}><Icon n="info" s={14} />{failMsg}</p>
      )}

      <button type="button" className="btn btn-solid" style={{ marginTop: 20 }}
        onClick={submit} disabled={state === 'sending'}>
        {state === 'sending' ? 'Registering…' : <>Register and get my code<Icon n="arrow" s={15} /></>}
      </button>
    </div>
  );
}
