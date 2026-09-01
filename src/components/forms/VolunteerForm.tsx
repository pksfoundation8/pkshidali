'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Field } from './Field';
import { Turnstile } from '@/components/tributes/Turnstile';
import { Icon } from '@/components/primitives/Icon';
import {
  volunteerAreas, availabilityOptions, connectionOptions, workingWithChildren,
} from '@/content/forms';
import { GiveLink } from '@/components/give/GiveLink';

const BLANK = {
  name: '', email: '', phone: '', location: '', area: '',
  availability: '', connection: '', message: '', website: '',
};

export function VolunteerForm() {
  const [f, setF] = useState(BLANK);
  const [ack, setAck] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');
  const [result, setResult] = useState({ delivered: true, childFacing: false });
  const [failMsg, setFailMsg] = useState('');

  const set = (k: keyof typeof BLANK) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setF({ ...f, [k]: e.target.value });

  // Revealed as soon as a child-facing role is chosen, so nobody is surprised
  // by the requirement after they have written everything out.
  const childFacing = workingWithChildren.includes(f.area);

  const submit = async () => {
    setState('sending'); setFailMsg('');
    try {
      const res = await fetch('/api/volunteer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, safeguardingAck: ack, turnstileToken: token }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setResult({ delivered: data.delivered !== false, childFacing: data.childFacing === true });
        setState('sent');
        return;
      }
      if (data.errors) {
        setErrs(data.errors); setState('idle');
        document.querySelector('.field.bad, .check.bad')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
        <h2 style={{ marginTop: 20, fontSize: 28 }}>Application received</h2>
        <p className="lead" style={{ marginTop: 14 }}>
          {result.delivered
            ? <>Someone from the foundation will be in touch at {f.email} about {f.area.toLowerCase()}.</>
            : <>Your application reached the site, but email delivery is not switched on yet, so it may
              not have reached anyone. If it is urgent, please contact the family directly.</>}
        </p>
        {result.childFacing && (
          <p className="lead" style={{ marginTop: 14 }}>
            Because this role involves working with children, a safeguarding check is completed
            before any placement. Nobody is placed with a student before that is done.
          </p>
        )}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 26 }}>
          <Link href="/" className="btn btn-solid">Back to home</Link>
          <GiveLink className="btn btn-outline"><Icon n="heart" s={16} />Support the foundation</GiveLink>
        </div>
      </div>
    );
  }

  return (
    <div className="panel">
      <div className="grid2">
        <Field label="Full name" htmlFor="v-name" required error={errs.name}>
          <input id="v-name" value={f.name} onChange={set('name')} autoComplete="name" />
        </Field>
        <Field label="Email" htmlFor="v-email" required error={errs.email}>
          <input id="v-email" type="email" value={f.email} onChange={set('email')}
            autoComplete="email" placeholder="you@example.com" />
        </Field>
      </div>

      <div className="grid2">
        <Field label="Phone" htmlFor="v-phone" hint="Optional. Include the country code.">
          <input id="v-phone" value={f.phone} onChange={set('phone')}
            autoComplete="tel" placeholder="+234 …" />
        </Field>
        <Field label="Where are you based?" htmlFor="v-location"
          hint="Some roles can be done from anywhere.">
          <input id="v-location" value={f.location} onChange={set('location')} placeholder="City, country" />
        </Field>
      </div>

      <div className="grid2">
        <Field label="Where would you like to help?" htmlFor="v-area" required error={errs.area}>
          <select id="v-area" value={f.area} onChange={set('area')}>
            <option value="">Choose one…</option>
            {volunteerAreas.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </Field>
        <Field label="Availability" htmlFor="v-avail" error={errs.availability}>
          <select id="v-avail" value={f.availability} onChange={set('availability')}>
            <option value="">Choose one…</option>
            {availabilityOptions.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </Field>
      </div>

      <Field label="How did you know him?" htmlFor="v-conn"
        hint="Not required. Many volunteers never met him.">
        <select id="v-conn" value={f.connection} onChange={set('connection')}>
          <option value="">Choose one…</option>
          {connectionOptions.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>

      <Field label="Anything you would like us to know" htmlFor="v-msg">
        <textarea id="v-msg" value={f.message} onChange={set('message')} style={{ minHeight: 120 }}
          placeholder="Your background, or what you would like to contribute." />
      </Field>

      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
        <label htmlFor="v-website">Website</label>
        <input id="v-website" tabIndex={-1} autoComplete="off" value={f.website} onChange={set('website')} />
      </div>

      {childFacing && (
        <>
          <div className="note" style={{ marginTop: 26 }}>
            <Icon n="shield" s={18} />
            <span>
              <strong>This role involves working with children.</strong> The foundation completes a
              safeguarding check, takes references, and does not place anyone with a student until
              that is finished. It applies equally to volunteers overseas.
            </span>
          </div>

          <label className={`check${errs.safeguardingAck ? ' bad' : ''}`}>
            <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} />
            <span>
              I understand that a safeguarding check and references are required before placement,
              and I agree to complete them.
            </span>
          </label>
          {errs.safeguardingAck && (
            <span className="err" style={{ marginTop: 7 }}>
              <Icon n="info" s={14} />{errs.safeguardingAck}
            </span>
          )}
        </>
      )}

      <Turnstile onToken={setToken} />

      {state === 'failed' && failMsg && (
        <p className="err" style={{ marginTop: 18 }}><Icon n="info" s={14} />{failMsg}</p>
      )}

      <button type="button" className="btn btn-solid" disabled={state === 'sending'}
        style={{ marginTop: 26, width: '100%' }} onClick={submit}>
        {state === 'sending' ? 'Sending…' : 'Submit application'}
      </button>
    </div>
  );
}
