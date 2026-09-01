import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { PageBanner } from '@/components/layout/PageBanner';
import { Icon } from '@/components/primitives/Icon';
import { getPublishedTributes, getTribute } from '@/lib/content';

export async function generateStaticParams() {
  return (await getPublishedTributes()).map((t) => ({ id: t.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTribute(id);
  return t ? { title: t.title ?? 'A memory' } : {};
}

export default async function TributePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTribute(id);
  if (!t) notFound();

  /* Neighbours in the published order, so someone reading through the archive
     on a phone can move to the next memory without going back to the list and
     finding their place again. */
  const all = await getPublishedTributes();
  const i = all.findIndex((x) => x.id === id);
  const prev = i > 0 ? all[i - 1] : null;
  const next = i >= 0 && i < all.length - 1 ? all[i + 1] : null;

  return (
    <>
      <PageBanner eyebrow="Tribute" title={t.title ?? 'A memory'} />
      <section className="pad">
        <Container>
          <div className="tribute-read">
            <Link href="/tributes" className="crumb" style={{ color: 'var(--gold-700)' }}>
              <Icon n="back" s={14} />All tributes
            </Link>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 24 }}>
              <span className="badge live">{t.relationship}</span>
              {t.sample && <span className="badge sample">Sample record</span>}
            </div>

            <blockquote>
              <Icon n="quote" s={34} style={{ color: 'rgba(196,154,69,.7)' }} />
              <p>{t.body}</p>
            </blockquote>

            {t.taught && (
              <p className="taught-line big">&ldquo;He taught me {t.taught}.&rdquo;</p>
            )}

            {t.videoUrl && (
              <a href={t.videoUrl} target="_blank" rel="noopener noreferrer"
                className="btn btn-outline" style={{ marginTop: 26 }}>
                <Icon n="video" s={16} />Watch the video tribute
              </a>
            )}

            <div style={{ marginTop: 34, paddingTop: 22, borderTop: '1px solid var(--line)' }}>
              <p style={{ fontSize: 17, fontWeight: 600 }}>{t.name}</p>
              <p style={{ marginTop: 5, fontSize: 14, color: 'var(--ink-muted)' }}>
                {[t.relationship, t.years, t.location].filter(Boolean).join(' · ')}
              </p>
            </div>

            {/* move through the archive without losing your place */}
            {(prev || next) && (
              <nav className="tnav" aria-label="More tributes">
                {prev ? (
                  <Link href={`/tributes/${prev.id}`} className="tnav-link prev">
                    <Icon n="back" s={15} />
                    <span>
                      <small>Previous</small>
                      {prev.title ?? prev.name}
                    </span>
                  </Link>
                ) : <span />}
                {next && (
                  <Link href={`/tributes/${next.id}`} className="tnav-link next">
                    <span>
                      <small>Next</small>
                      {next.title ?? next.name}
                    </span>
                    <Icon n="arrow" s={15} />
                  </Link>
                )}
              </nav>
            )}

            <div className="read-acts">
              <Link href="/tributes" className="btn btn-solid">
                <Icon n="back" s={16} />All tributes
              </Link>
              <Link href="/tributes/share" className="btn btn-outline">
                <Icon n="plus" s={16} />Add your own
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
