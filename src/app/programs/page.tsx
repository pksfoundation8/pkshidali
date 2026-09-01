import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { PageBanner } from '@/components/layout/PageBanner';
import { IconCircle } from '@/components/primitives/IconCircle';
import { Icon } from '@/components/primitives/Icon';
import { getPrograms } from '@/lib/content';
import { GiveLink } from '@/components/give/GiveLink';

export const metadata = {
  title: 'Programs & Initiatives',
  description: 'Five flagship initiatives carrying his work forward.',
};

export default async function ProgramsPage() {
  const programs = await getPrograms();
  const active = programs.filter((p) => p.status !== 'In development').length;

  return (
    <>
      <PageBanner eyebrow="Programs" title="Programs & Initiatives"
        intro="Five flagship initiatives rather than twenty. Each one turns something he practised into something the foundation does." />

      <section className="pad">
        <Container>
          <div style={{ maxWidth: 760 }}>
            <p className="lead">
              A new foundation that launches twenty programmes runs none of them well. These five
              were chosen because each has a direct line back to how he actually spent his life.
              {' '}<strong style={{ color: 'var(--ink)' }}>{active} of {programs.length}</strong> are
              running today; the rest are in development and will be marked as such until they are real.
            </p>
          </div>

          <ul className="cards">
            {programs.map((p) => (
              <li key={p.slug}>
                <Link href={`/programs/${p.slug}`} className="card row">
                  <IconCircle n={p.icon} tone={p.olive ? 'olive' : 'gold'} />
                  <span className={`badge ${p.status === 'In development' ? 'pending' : 'live'}`}>
                    {p.status}
                  </span>
                  <h3>{p.title}</h3>
                  <p>{p.summary}</p>
                  <span className="tlink">Learn more<Icon n="arrow" s={14} /></span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="cta">
        <Container className="cta-in">
          <div style={{ maxWidth: '36rem' }}>
            <h2 className="title">Fund one, or join one</h2>
            <p className="lead" style={{ marginTop: 16 }}>
              You can designate a gift to a single programme, or give your time to it instead.
            </p>
          </div>
          <div className="cta-act">
            <GiveLink className="btn btn-solid"><Icon n="heart" s={16} />Support a programme</GiveLink>
            <Link href="/get-involved" className="btn btn-outline">Volunteer<Icon n="arrow" s={15} /></Link>
          </div>
        </Container>
      </section>
    </>
  );
}
