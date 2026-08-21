'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Container } from '@/components/layout/Container';
import { PageBanner } from '@/components/layout/PageBanner';
import { Icon } from '@/components/primitives/Icon';
import { relationships } from '@/content/home';
import { Turnstile } from '@/components/tributes/Turnstile';

type Form = {
  name: string; email: string; relationship: string; years: string;
  location: string; title: string; taught: string; body: string;
  permissionPublish: boolean; permissionArchive: boolean;
  videoUrl: string;
  /** Honeypot — real people leave this empty. */
  website: string;
};

const BLANK: Form = {
  name: '', email: '', relationship: '', years: '', location: '',
  title: '', taught: '', body: '', permissionPublish: false,
  permissionArchive: false, videoUrl: '', website: '',
};

function Field({ label, required, error, hint, children }: {
  label: string; required?: boolean; error?: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className={`field${error ? ' bad' : ''}`}>
      <label>{label}{required && <span className="req">*</span>}</label>
      {children}
      {hint && !error && <span className="hint">{hint}</span>}
      {error && <span className="err"><Icon n="info" s={14} />{error}</span>}
    </div>
  );
}

export default function ShareTributePage() {
  const [f, setF] = useState<Form>(BLANK);
  const [photo, setPhoto] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [failMsg, setFailMsg] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'failed'>('idle');

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: e.target instanceof HTMLInputElement && e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!f.name.trim()) e.name = 'Please give the name this tribute should be published under.';
    if (!f.email.trim()) e.email = 'We need an email in case the family has a question. It is never published.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'That does not look like a complete email address.';
    if (!f.relationship) e.relationship = 'Choose how you knew him.';
    if (f.body.trim().length < 40) e.body = `Please write a little more — ${40 - f.body.trim().length} characters to go.`;
    if (!f.permissionPublish) e.permissionPublish = 'We cannot publish a tribute without permission.';
    if (!f.permissionArchive) e.permissionArchive = 'We cannot archive a tribute without permission.';
    return e;
  };

  const submit = async () => {
    const e = validate();
    setErrs(e);
    if (Object.keys(e).length) {
      document.querySelector('.field.bad, .check.bad')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setState('sending');
    setFailMsg('');

    // Multipart because the submission may carry a photograph or a recording.
    const data = new FormData();
    Object.entries(f).forEach(([k, v]) => data.append(k, String(v)));
    if (token) data.append('turnstileToken', token);
    if (photo) data.append('photo', photo);
    if (audio) data.append('audio', audio);

    try {
      const res = await fetch('/api/tributes', { method: 'POST', body: data });
      if (res.ok) { setState('done'); return; }

      const payload = await res.json().catch(() => ({}));
      if (payload.errors) {
        setErrs(payload.errors);
        setState('idle');
        document.querySelector('.field.bad, .check.bad')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      setFailMsg(payload.error ?? 'That did not send. Please try again shortly.');
      setState('failed');
    } catch {
      setFailMsg('That did not send. Check your connection and try again, or email the foundation directly.');
      setState('failed');
    }
  };

  if (state === 'done') {
    return (
      <>
        <PageBanner eyebrow="Tributes" title="Thank you" intro="Your tribute has been received." />
        <section className="pad">
          <Container>
            <div className="panel" style={{ maxWidth: 640 }}>
              <span className="ring"><Icon n="check" s={26} /></span>
              <h2 style={{ marginTop: 20, fontSize: 28 }}>Submitted for review</h2>
              <p className="lead" style={{ marginTop: 14 }}>
                Nothing is published automatically. A family administrator will read your tribute,
                and you will hear from us at {f.email} once it is live.
              </p>
              <p className="lead" style={{ marginTop: 14 }}>
                The workflow is: submitted, reviewed, approved, published, archived. Your original
                wording is preserved even if minor corrections are made.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 28 }}>
                <Link href="/tributes" className="btn btn-solid">Back to tributes</Link>
                <button type="button" className="btn btn-outline"
                  onClick={() => {
                  setF(BLANK); setPhoto(null); setAudio(null);
                  setErrs({}); setFailMsg(''); setState('idle');
                }}>
                  Submit another
                </button>
              </div>
            </div>
          </Container>
        </section>
      </>
    );
  }

  return (
    <>
      <PageBanner eyebrow="Tributes" title="Share Your Memory"
        intro="His story belongs not only to his family, but to the many people he taught, pastored, prayed for, mentored and served. If his life touched yours, we would be honoured to preserve your story." />
      <section className="pad">
        <Container>
          <div style={{ maxWidth: 760 }}>
            <Link href="/tributes" className="crumb" style={{ color: 'var(--gold-700)' }}>
              <Icon n="back" s={14} />All tributes
            </Link>

            <div className="panel" style={{ marginTop: 24 }}>
              <div className="grid2">
                <Field label="Full name" required error={errs.name}>
                  <input value={f.name} onChange={set('name')} placeholder="As it should appear publicly" />
                </Field>
                <Field label="Email" required error={errs.email} hint="Never published or shared.">
                  <input type="email" value={f.email} onChange={set('email')} placeholder="you@example.com" />
                </Field>
              </div>

              <div className="grid2">
                <Field label="How did you know him?" required error={errs.relationship}>
                  <select value={f.relationship} onChange={set('relationship')}>
                    <option value="">Choose one…</option>
                    {relationships.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </Field>
                <Field label="Years or period known">
                  <input value={f.years} onChange={set('years')} placeholder="e.g. 1978 – 1982" />
                </Field>
              </div>

              <div className="grid2">
                <Field label="Location">
                  <input value={f.location} onChange={set('location')} placeholder="City, country" />
                </Field>
                <Field label="Tribute title">
                  <input value={f.title} onChange={set('title')} placeholder="A line that captures it" />
                </Field>
              </div>

              <Field label="Complete this sentence"
                hint="“Rev. Paul Kadir Shidali taught me ______.” A few words is enough.">
                <input value={f.taught} onChange={set('taught')} placeholder="discipline / to pray / to stand for truth" />
              </Field>

              <Field label="Your tribute" required error={errs.body}
                hint={`${f.body.trim().length} characters. Write as much as you like — the archive has no length limit.`}>
                <textarea value={f.body} onChange={set('body')}
                  placeholder="What do you remember? A moment, a lesson, something he said more than once, or what became of a seed he planted." />
              </Field>

              {/* Honeypot: hidden from people, irresistible to bots. */}
              <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px' }}>
                <label htmlFor="website">Website</label>
                <input id="website" tabIndex={-1} autoComplete="off"
                  value={f.website} onChange={set('website')} />
              </div>

              <div className="fset">
                <p className="lg">Photograph, recording or video</p>
                <p>
                  All optional. Some people say more in two minutes of speech than in two pages of
                  writing — if that is you, record it on your phone and attach it here.
                </p>

                <Field label="Photograph" error={errs.photo}
                  hint="A picture of you, or a historical photograph with him. JPEG, PNG or WebP, up to 8MB.">
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/heic"
                    onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} />
                </Field>

                <Field label="Audio tribute" error={errs.audio}
                  hint="Two to five minutes is plenty. MP3, M4A, WAV or OGG, up to 20MB.">
                  <input type="file" accept="audio/*"
                    onChange={(e) => setAudio(e.target.files?.[0] ?? null)} />
                </Field>

                <Field label="Video link" error={errs.videoUrl}
                  hint="Paste a YouTube, Vimeo or Drive link. Video files are too large to upload here.">
                  <input value={f.videoUrl} onChange={set('videoUrl')} placeholder="https://…" />
                </Field>
              </div>

              <label className={`check${errs.permissionPublish ? ' bad' : ''}`}>
                <input type="checkbox" checked={f.permissionPublish} onChange={set('permissionPublish')} />
                <span>I give permission for this tribute to be published on pkshidali.org, under my name as entered above.</span>
              </label>
              {errs.permissionPublish && (
                <span className="err" style={{ marginTop: 7 }}><Icon n="info" s={14} />{errs.permissionPublish}</span>
              )}

              <label className={`check${errs.permissionArchive ? ' bad' : ''}`}>
                <input type="checkbox" checked={f.permissionArchive} onChange={set('permissionArchive')} />
                <span>I give permission for it to be preserved permanently in the PK Shidali Legacy Archive.</span>
              </label>
              {errs.permissionArchive && (
                <span className="err" style={{ marginTop: 7 }}><Icon n="info" s={14} />{errs.permissionArchive}</span>
              )}

              <Turnstile onToken={setToken} />

              {state === 'failed' && failMsg && (
                <p className="err" style={{ marginTop: 18 }}>
                  <Icon n="info" s={14} />{failMsg}
                </p>
              )}

              <button type="button" className="btn btn-solid" disabled={state === 'sending'}
                style={{ marginTop: 30, width: '100%' }} onClick={submit}>
                {state === 'sending' ? 'Sending…' : 'Add my story to his legacy'}
              </button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
