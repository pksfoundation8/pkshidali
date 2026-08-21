'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { Field } from '@/components/forms/Field';
import { Turnstile } from '@/components/tributes/Turnstile';
import { Icon } from '@/components/primitives/Icon';
import { relationships } from '@/content/home';

const BLANK = {
  name: '', email: '', relationship: '', years: '', location: '',
  title: '', taught: '', body: '', website: '',
};

const ACCEPT = 'image/jpeg,image/png,image/webp,image/heic,audio/*,video/mp4';

/**
 * The sidebar form. Deliberately shorter than /tributes/share — the full page
 * stays available for anyone who wants room to write, and is linked below.
 */
export function ShareSidebar() {
  const [f, setF] = useState(BLANK);
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'failed'>('idle');
  const [failMsg, setFailMsg] = useState('');
  const [over, setOver] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const set = (k: keyof typeof BLANK) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setF({ ...f, [k]: e.target.value });

  const submit = async () => {
    const e: Record<string, string> = {};
    if (!f.name.trim()) e.name = 'Required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'A valid email, please.';
    if (!f.relationship) e.relationship = 'Choose how you knew him.';
    if (!f.title.trim()) e.title = 'Give your tribute a title.';
    if (f.body.trim().length < 40) e.body = `${40 - f.body.trim().length} more characters, please.`;
    if (!consent) e.consent = 'We cannot publish without permission.';
    setErrs(e);
    if (Object.keys(e).length) {
      document.querySelector('.sform .field.bad, .sform .check.bad')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setState('sending'); setFailMsg('');
    const data = new FormData();
    Object.entries(f).forEach(([k, v]) => data.append(k, v));
    // One checkbox covers both consents here; the full form separates them.
    data.append('permissionPublish', 'true');
    data.append('permissionArchive', 'true');
    if (token) data.append('turnstileToken', token);
    if (file) data.append(file.type.startsWith('image/') ? 'photo' : 'audio', file);

    try {
      const res = await fetch('/api/tributes', { method: 'POST', body: data });
      if (res.ok) { setState('done'); return; }
      const payload = await res.json().catch(() => ({}));
      if (payload.errors) { setErrs(payload.errors); setState('idle'); return; }
      setFailMsg(payload.error ?? 'That did not send. Please try again shortly.');
      setState('failed');
    } catch {
      setFailMsg('We could not reach the server. Please try again shortly.');
      setState('failed');
    }
  };

  if (state === 'done') {
    return (
      <div className="sform">
        <span className="ring"><Icon n="check" s={24} /></span>
        <h2 style={{ marginTop: 16, fontSize: 24 }}>Published — thank you</h2>
        <p className="lead" style={{ marginTop: 12, fontSize: 14 }}>
          Your tribute is now live on this page — reload to see it. The family may reach you
          at {f.email} if anything needs clarifying.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
          <button type="button" className="btn btn-gold" style={{ width: '100%' }}
            onClick={() => window.location.assign('/tributes')}>
            See it on the wall
          </button>
          <button type="button" className="btn btn-outline" style={{ width: '100%' }}
            onClick={() => { setF(BLANK); setFile(null); setConsent(false); setErrs({}); setState('idle'); }}>
            Share another memory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sform">
      <div className="head">
        <span className="ring sm" style={{ width: 40, height: 40 }}><Icon n="quote" s={18} /></span>
        <div>
          <h2>Share your memory</h2>
          <p>Your story helps keep his legacy alive for generations to come.</p>
        </div>
      </div>

      <div className="grid2">
        <Field label="Full name" htmlFor="s-name" required error={errs.name}>
          <input id="s-name" value={f.name} onChange={set('name')} autoComplete="name" />
        </Field>
        <Field label="Email address" htmlFor="s-email" required error={errs.email}>
          <input id="s-email" type="email" value={f.email} onChange={set('email')} autoComplete="email" />
        </Field>
      </div>

      <div className="grid2">
        <Field label="Relationship to Rev. Shidali" htmlFor="s-rel" required error={errs.relationship}>
          <select id="s-rel" value={f.relationship} onChange={set('relationship')}>
            <option value="">Select relationship</option>
            {relationships.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Years known" htmlFor="s-years">
          <input id="s-years" value={f.years} onChange={set('years')} placeholder="e.g. 1978 – 1982" />
        </Field>
      </div>

      <Field label="Location (city, country)" htmlFor="s-loc">
        <input id="s-loc" value={f.location} onChange={set('location')} placeholder="e.g. Ilorin, Nigeria" />
      </Field>

      <Field label="Tribute title" htmlFor="s-title" required error={errs.title}>
        <input id="s-title" value={f.title} onChange={set('title')} placeholder="Give your tribute a title" />
      </Field>

      <Field label="He taught me…" htmlFor="s-taught">
        <input id="s-taught" value={f.taught} onChange={set('taught')}
          placeholder="discipline / to pray / humility" />
      </Field>

      <Field label="Your tribute" htmlFor="s-body" required error={errs.body}>
        <textarea id="s-body" value={f.body} onChange={set('body')}
          placeholder="Share your memory, experience, or how his life impacted you…" />
      </Field>

      <div className="field">
        <label>Upload photo / audio / video <span style={{ color: 'var(--ink-muted)' }}>(optional)</span></label>
        <div className={`drop${over ? ' over' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setOver(true); }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault(); setOver(false);
            const dropped = e.dataTransfer.files?.[0];
            if (dropped) setFile(dropped);
          }}>
          {file ? (
            <>
              <span className="picked"><Icon n="check" s={14} />{file.name}</span>
              <button type="button" className="cta" onClick={() => setFile(null)}>Remove</button>
            </>
          ) : (
            <>
              <Icon n="photo" s={24} style={{ color: 'rgba(138,106,34,.6)' }} />
              <span className="types">Drag and drop a file here, or</span>
              <button type="button" className="cta" onClick={() => input.current?.click()}>Choose file</button>
              <span className="types">JPG, PNG, MP3, M4A — up to 20MB</span>
            </>
          )}
          <input ref={input} type="file" accept={ACCEPT} hidden
            onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </div>
        {errs.photo && <span className="err"><Icon n="info" s={13} />{errs.photo}</span>}
        {errs.audio && <span className="err"><Icon n="info" s={13} />{errs.audio}</span>}
      </div>

      <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
        <label htmlFor="s-website">Website</label>
        <input id="s-website" tabIndex={-1} autoComplete="off" value={f.website} onChange={set('website')} />
      </div>

      <label className={`check${errs.consent ? ' bad' : ''}`}>
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>
          I give permission for my story to be published on pkshidali.org and preserved
          permanently in the Legacy Archive.
        </span>
      </label>
      {errs.consent && <span className="err" style={{ marginTop: 6 }}><Icon n="info" s={13} />{errs.consent}</span>}

      <Turnstile onToken={setToken} />

      {state === 'failed' && failMsg && (
        <p className="err" style={{ marginTop: 14 }}><Icon n="info" s={13} />{failMsg}</p>
      )}

      <button type="button" className="btn btn-gold" disabled={state === 'sending'}
        style={{ marginTop: 18, width: '100%' }} onClick={submit}>
        <Icon n="heart" s={15} />
        {state === 'sending' ? 'Sending…' : 'Add my story to his legacy'}
      </button>

      <p className="thanks">Thank you for being part of his lasting legacy.</p>
      <p className="thanks" style={{ marginTop: 6 }}>
        <Link href="/tributes/share" style={{ color: 'var(--gold-700)', textDecoration: 'underline' }}>
          Need more room to write?
        </Link>
      </p>
    </div>
  );
}
