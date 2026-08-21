import Link from 'next/link';
import StudioClient from './StudioClient';
import { isSanityConfigured } from '@/lib/sanity/env';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Studio', robots: { index: false, follow: false } };

/**
 * The Studio, served at /studio — one URL and one login for the family.
 *
 * Without a project ID the Sanity Studio throws in the browser with a config
 * error and a blank page. Someone running this for the first time would have no
 * idea why, so we check first and show the setup steps instead.
 */
export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <div className="pks" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: 24 }}>
        <div className="container" style={{ maxWidth: 640 }}>
          <div className="panel">
            <span className="badge pending">Not configured</span>
            <h1 className="title" style={{ marginTop: 16, fontSize: 30 }}>
              The content studio is not connected yet
            </h1>
            <p className="lead" style={{ marginTop: 14 }}>
              The rest of the site works without it — every page is running on the seed content in{' '}
              <code>src/content/</code>. Connect a Sanity project when you are ready for the family
              to edit content themselves.
            </p>

            <ol style={{ marginTop: 26, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                ['Copy the environment file', 'cp .env.example .env.local'],
                ['Sign in to Sanity', 'npx sanity@latest login'],
                ['Create a project', 'npx sanity@latest projects create "PK Shidali Foundation"'],
                ['Paste the project ID into .env.local', 'NEXT_PUBLIC_SANITY_PROJECT_ID=…'],
                ['Restart the dev server', 'npm run dev'],
              ].map(([step, cmd], i) => (
                <li key={step} style={{ display: 'flex', gap: 14 }}>
                  <span style={{ flex: 'none', fontFamily: 'var(--display)', fontSize: 19, fontWeight: 600, color: 'var(--gold-700)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>
                    <span style={{ display: 'block', fontSize: 15, color: 'var(--ink)' }}>{step}</span>
                    <code style={{ display: 'block', marginTop: 5, padding: '7px 10px', fontSize: 12.5,
                      background: 'var(--ivory)', border: '1px solid var(--line-strong)',
                      borderRadius: 'var(--radius-sm)', overflowX: 'auto' }}>
                      {cmd}
                    </code>
                  </span>
                </li>
              ))}
            </ol>

            <p className="lead" style={{ marginTop: 24, fontSize: 14 }}>
              Full instructions, including the publish webhook, are in <code>CMS.md</code>.
            </p>

            <Link href="/" className="btn btn-solid" style={{ marginTop: 26 }}>Back to the site</Link>
          </div>
        </div>
      </div>
    );
  }

  return <StudioClient />;
}
