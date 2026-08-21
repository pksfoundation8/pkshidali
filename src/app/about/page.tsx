import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { PageBanner } from '@/components/layout/PageBanner';
import { SectionHeading } from '@/components/primitives/SectionHeading';
import { IconCircle } from '@/components/primitives/IconCircle';
import { Icon } from '@/components/primitives/Icon';
import { thesis, values, commitments, stage, funding } from '@/content/about';
import { site } from '@/config/site';

export const metadata = {
  title: 'About the Foundation',
  description:
    'The PK Shidali Foundation: building people, continuing a legacy, transforming generations. Mission, governance and transparency.',
};

export default function AboutPage() {
  return (
    <>
      <PageBanner eyebrow="About" title="The PK Shidali Foundation"
        intro={site.tagline} />

      {/* ── thesis ─────────────────────────────────────────── */}
      <section className="pad">
        <Container>
          <div style={{ maxWidth: 780 }}>
            <h2 className="title">{thesis.heading}</h2>
            <div className="prose">
              {thesis.body.map((p) => <p key={p}>{p}</p>)}
            </div>
            <p className="pull">{thesis.pullQuote}</p>
          </div>
        </Container>
      </section>

      {/* ── where this actually stands ─────────────────────── */}
      <section className="band paper">
        <Container>
          <div style={{ maxWidth: 780 }}>
            <h2 className="title">{stage.heading}</h2>
            <div className="prose">
              {stage.body.map((p) => <p key={p}>{p}</p>)}
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 30 }}>
              <Link href="/programs" className="btn btn-outline">
                See which programmes are running<Icon n="arrow" s={15} />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ── values ─────────────────────────────────────────── */}
      <section className="band">
        <Container>
          <SectionHeading>How we intend to work</SectionHeading>
          <ul className="vgrid">
            {values.map((v) => (
              <li key={v.title} className="vcard">
                <IconCircle n={v.icon} size="sm" />
                <div>
                  <h3>{v.title}</h3>
                  <p>{v.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* ── transparency ledger ────────────────────────────── */}
      <section className="band paper">
        <Container>
          <div style={{ maxWidth: 780 }}>
            <h2 className="title">Governance and transparency</h2>
            <p className="lead" style={{ marginTop: 14 }}>
              Credibility is earned by disclosure, not assertion. Below is every governance
              commitment the foundation has made, with its real status. Nothing here is marked
              complete until it is.
            </p>
          </div>

          <ul className="ledger">
            {commitments.map((c) => (
              <li key={c.title}>
                <h3>{c.title}</h3>
                <span className={`st ${c.status}`}>
                  <Icon n={c.status === 'live' ? 'check' : c.status === 'progress' ? 'star' : 'info'} s={11} />
                  {c.statusLabel}
                </span>
                <p>{c.detail}</p>
              </li>
            ))}
          </ul>

          <div style={{ maxWidth: 780, marginTop: 40 }}>
            <h2 className="title" style={{ fontSize: 26 }}>{funding.heading}</h2>
            <p className="lead" style={{ marginTop: 14 }}>{funding.body}</p>
          </div>
        </Container>
      </section>

      {/* ── cta ────────────────────────────────────────────── */}
      <section className="cta">
        <Container className="cta-in">
          <div style={{ maxWidth: '36rem' }}>
            <h2 className="title">Questions before you commit?</h2>
            <p className="lead" style={{ marginTop: 16 }}>
              Ask them. A foundation that cannot answer plainly at this stage would not deserve
              your money or your time.
            </p>
          </div>
          <div className="cta-act">
            <Link href="/contact" className="btn btn-solid">Contact the foundation</Link>
            <Link href="/his-life" className="btn btn-outline">Read his story<Icon n="arrow" s={15} /></Link>
          </div>
        </Container>
      </section>
    </>
  );
}
