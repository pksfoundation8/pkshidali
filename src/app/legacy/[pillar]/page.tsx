import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { PageBanner } from '@/components/layout/PageBanner';
import { IconCircle } from '@/components/primitives/IconCircle';
import { Icon } from '@/components/primitives/Icon';
import { getPillars } from '@/lib/content';
import { GiveLink } from '@/components/give/GiveLink';

export async function generateStaticParams() {
  return (await getPillars()).map((p) => ({ pillar: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ pillar: string }> }) {
  const { pillar } = await params;
  const p = (await getPillars()).find((x) => x.slug === pillar);
  return p ? { title: p.title, description: p.tagline } : {};
}

export default async function PillarPage({ params }: { params: Promise<{ pillar: string }> }) {
  const { pillar } = await params;
  const pillars = await getPillars();
  const i = pillars.findIndex((x) => x.slug === pillar);
  if (i === -1) notFound();

  const p = pillars[i];
  const next = pillars[(i + 1) % pillars.length];

  return (
    <>
      <PageBanner eyebrow="Legacy Pillar" title={p.title} intro={p.tagline} />
      <section className="pad">
        <Container>
          <div style={{ maxWidth: 760 }}>
            <Link href="/legacy" className="crumb" style={{ color: 'var(--gold-700)' }}>
              <Icon n="back" s={14} />All pillars
            </Link>

            <div style={{ marginTop: 26 }}><IconCircle n={p.icon} /></div>

            <div className="prose">
              {p.body.map((t) => <p key={t}>{t}</p>)}
            </div>

            <h2 className="title" style={{ marginTop: 42, fontSize: 26 }}>
              How the foundation carries it
            </h2>
            <ul style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {p.practices.map((x) => (
                <li key={x} style={{ display: 'flex', gap: 12, fontSize: 15.5, lineHeight: 1.7, color: 'var(--ink-muted)' }}>
                  <span style={{ color: 'var(--gold-500)', flex: 'none' }}><Icon n="check" s={18} /></span>{x}
                </li>
              ))}
            </ul>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 44 }}>
              <Link href={`/legacy/${next.slug}`} className="btn btn-outline">
                Next: {next.title}<Icon n="arrow" s={15} />
              </Link>
              <GiveLink className="btn btn-solid"><Icon n="heart" s={16} />Support this work</GiveLink>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
