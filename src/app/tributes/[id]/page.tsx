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

  return (
    <>
      <PageBanner eyebrow="Tribute" title={t.title ?? 'A memory'} />
      <section className="pad">
        <Container>
          <div style={{ maxWidth: 700 }}>
            <Link href="/tributes" className="crumb" style={{ color: 'var(--gold-700)' }}>
              <Icon n="back" s={14} />All tributes
            </Link>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 24 }}>
              <span className="badge live">{t.relationship}</span>
              {t.sample && <span className="badge sample">Sample record</span>}
            </div>

            <blockquote style={{ marginTop: 26 }}>
              <Icon n="quote" s={38} style={{ color: 'rgba(196,154,69,.7)' }} />
              <p style={{ marginTop: 18, fontFamily: 'var(--display)', fontSize: 24, lineHeight: 1.55, color: 'var(--navy-800)' }}>
                {t.body}
              </p>
            </blockquote>

            {t.taught && (
              <p style={{ marginTop: 30, fontFamily: 'var(--display)', fontSize: 26, color: 'var(--gold-700)' }}>
                &ldquo;He taught me {t.taught}.&rdquo;
              </p>
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

            <Link href="/tributes/share" className="btn btn-outline" style={{ marginTop: 36 }}>
              <Icon n="plus" s={16} />Add your own
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
