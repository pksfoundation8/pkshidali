import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { PageBanner } from '@/components/layout/PageBanner';
import { IconCircle } from '@/components/primitives/IconCircle';
import { Icon } from '@/components/primitives/Icon';
import { getPillars } from '@/lib/content';
import { GiveLink } from '@/components/give/GiveLink';

export const metadata = {
  title: 'Legacy Pillars',
  description: 'The six principles his life represented, and how the foundation carries them forward.',
};

export default async function LegacyPage() {
  const pillars = await getPillars();

  return (
    <>
      <PageBanner eyebrow="Legacy" title="Six Pillars"
        intro="The principles his life represented, stated plainly enough that they can be taught, measured and handed on." />

      <section className="pad">
        <Container>
          <div style={{ maxWidth: 760 }}>
            <p className="lead">
              A memorial records that someone lived. These six say what he lived <em>for</em> — and
              each one is attached to something the foundation actually does, so the values are
              testable rather than decorative.
            </p>
          </div>

          <ul className="cards">
            {pillars.map((p) => (
              <li key={p.slug}>
                <Link href={`/legacy/${p.slug}`} className="card">
                  <IconCircle n={p.icon} />
                  <h3>{p.title}</h3>
                  <p className="tag">{p.tagline}</p>
                  <p>{p.blurb}</p>
                  <span className="tlink">Read more<Icon n="arrow" s={14} /></span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="cta">
        <Container className="cta-in">
          <div style={{ maxWidth: '36rem' }}>
            <h2 className="title">From principle to practice</h2>
            <p className="lead" style={{ marginTop: 16 }}>
              Each pillar has a programme behind it. That is the difference between a foundation
              and a plaque.
            </p>
          </div>
          <div className="cta-act">
            <Link href="/programs" className="btn btn-solid">See the programmes<Icon n="arrow" s={15} /></Link>
            <GiveLink className="btn btn-outline"><Icon n="heart" s={16} />Support the work</GiveLink>
          </div>
        </Container>
      </section>
    </>
  );
}
