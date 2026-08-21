import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { PageBanner } from '@/components/layout/PageBanner';
import { IconCircle } from '@/components/primitives/IconCircle';
import { Icon } from '@/components/primitives/Icon';
import { getPrograms, getProgram } from '@/lib/content';

export async function generateStaticParams() {
  return (await getPrograms()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProgram(slug);
  return p ? { title: p.title, description: p.summary } : {};
}

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProgram(slug);
  if (!p) notFound();

  return (
    <>
      <PageBanner eyebrow="Program" title={p.title} intro={p.summary} />
      <section className="pad">
        <Container>
          <div style={{ maxWidth: 760 }}>
            <Link href="/programs" className="crumb" style={{ color: 'var(--gold-700)' }}>
              <Icon n="back" s={14} />All programs
            </Link>

            <div style={{ marginTop: 26, display: 'flex', alignItems: 'center', gap: 16 }}>
              <IconCircle n={p.icon} tone={p.olive ? 'olive' : 'gold'} />
              <span className={`badge ${p.status === 'Active' ? 'live' : 'pending'}`}>{p.status}</span>
            </div>

            <div className="prose">{p.body.map((t) => <p key={t}>{t}</p>)}</div>

            <h2 className="title" style={{ marginTop: 42, fontSize: 26 }}>Focus areas</h2>
            <ul style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {p.focus.map((x) => (
                <li key={x} style={{ display: 'flex', gap: 12, fontSize: 15.5, lineHeight: 1.7, color: 'var(--ink-muted)' }}>
                  <span style={{ color: 'var(--gold-500)', flex: 'none' }}><Icon n="check" s={18} /></span>{x}
                </li>
              ))}
            </ul>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 44 }}>
              <Link href="/give" className="btn btn-solid"><Icon n="heart" s={16} />Fund this programme</Link>
              <Link href="/get-involved" className="btn btn-outline">Volunteer<Icon n="arrow" s={15} /></Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
