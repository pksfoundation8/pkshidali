'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Container } from '@/components/layout/Container';
import { PageBanner } from '@/components/layout/PageBanner';
import { Icon } from '@/components/primitives/Icon';

/**
 * Errors explain what happened and how to proceed. They do not apologise in a
 * human voice, and they never leave someone stranded — particularly on a page
 * where they may have been part-way through writing a tribute.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[app] unhandled error', error);
  }, [error]);

  return (
    <>
      <PageBanner eyebrow="Error" title="Something went wrong on our side"
        intro="This is not your doing. Trying again usually resolves it." />
      <section className="pad">
        <Container>
          <div style={{ maxWidth: 640 }}>
            <div className="note">
              <Icon n="info" s={18} />
              <span>
                If you were part-way through writing a tribute, use your browser&rsquo;s back
                button first — your text may still be in the form.
              </span>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 30 }}>
              <button type="button" className="btn btn-solid" onClick={reset}>Try again</button>
              <Link href="/" className="btn btn-outline">Back to home</Link>
              <Link href="/contact" className="btn btn-outline">Report it</Link>
            </div>

            {error.digest && (
              <p style={{ marginTop: 26, fontSize: 12.5, color: 'var(--ink-muted)' }}>
                Reference for the foundation: <code>{error.digest}</code>
              </p>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
