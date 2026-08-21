import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/primitives/SectionHeading';
import { IconCircle } from '@/components/primitives/IconCircle';
import { Icon } from '@/components/primitives/Icon';
import { CelestialBackdrop, Hill, hasHeroSky } from '@/components/home/CelestialBackdrop';
import { BiographyAccordion } from '@/components/life/BiographyAccordion';
import { lifeSections, characterTraits, lifeIntro } from '@/content/life';
import { getMilestones } from '@/lib/content';
import { site } from '@/config/site';

export const metadata = {
  title: 'His Life',
  description:
    'The life of Rev. Paul Kadir Shidali: teacher, headmaster, pastor, preacher, prayer warrior, husband, father and grandfather.',
};

export default async function HisLifePage() {
  const milestones = await getMilestones();

  return (
    <>
      <section className="thero">
        <CelestialBackdrop even sky />
        {!hasHeroSky && <Hill />}
        <Container className="in">
          <div>
            <h1>Rev. Paul <span className="g">Kadir Shidali</span></h1>
            <p className="sub">{site.subject.bornLabel} &mdash; {site.subject.diedLabel}</p>
            <div className="hrule" aria-hidden="true">
              <span className="a" /><span className="d">&#10022;</span><span className="b" />
            </div>
            <div className="acts">
              <Link href="/tributes/share" className="btn btn-gold">
                <Icon n="pen" s={15} />Share a Memory
              </Link>
              <Link href="/tributes" className="btn btn-light">
                <Icon n="chat" s={15} />Read Tributes
              </Link>
              <Link href="/archive" className="btn btn-light">
                <Icon n="photo" s={15} />Explore the Archive
              </Link>
            </div>
            <ul className="heroroles" aria-label="His roles">
              {lifeIntro.roles.map((r, i, a) => (
                <li key={r}>
                  {r}{i < a.length - 1 && <span aria-hidden="true">&middot;</span>}
                </li>
              ))}
            </ul>
          </div>
          <div className="por">
            <Image src="/portrait-v3.webp" unoptimized alt={site.subject.name} width={620} height={780}
              priority sizes="(max-width: 1023px) 230px, 250px" />
          </div>
        </Container>
      </section>

      <section className="pad">
        <Container>
          <div style={{ maxWidth: 860 }}>
            <div className="note">
              <Icon n="info" s={18} />
              <span>{lifeIntro.note}</span>
            </div>
            <BiographyAccordion sections={lifeSections} />
          </div>
        </Container>
      </section>

      <section className="band paper">
        <Container>
          <SectionHeading center>A Life of Impact</SectionHeading>
          <ol className="tl6" style={{ marginTop: 40 }}>
            <span className="rail" aria-hidden="true" />
            {milestones.map((m) => (
              <li key={m.title} className="t6">
                <span className="nd"><Icon n={m.icon} s={21} /></span>
                <b>{m.title}</b>
                <small>{m.summary}</small>
              </li>
            ))}
          </ol>
          <p style={{ marginTop: 34, textAlign: 'center', fontSize: 14, fontStyle: 'italic', color: 'var(--ink-muted)' }}>
            The last date stays open on purpose. The story did not end in 2026.
          </p>
        </Container>
      </section>

      <section className="band">
        <Container>
          <SectionHeading>Character</SectionHeading>
          <p className="lead" style={{ textAlign: 'center', marginTop: 18, maxWidth: '40rem', marginInline: 'auto' }}>
            The words people reach for before they reach for his achievements.
          </p>
          <ul className="traits">
            {characterTraits.map((t) => (
              <li key={t.label} className="trait">
                <IconCircle n={t.icon} size="sm" />
                <b>{t.label}</b>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="cta">
        <Container className="cta-in">
          <div style={{ maxWidth: '36rem' }}>
            <h2 className="title">Can you fill in a gap?</h2>
            <p className="lead" style={{ marginTop: 16 }}>
              If you knew him, you hold part of this story. Photographs, dates, school records and
              memories are all wanted &mdash; especially from the years his children were too young
              to remember.
            </p>
          </div>
          <div className="cta-act">
            <Link href="/tributes/share" className="btn btn-solid"><Icon n="plus" s={16} />Share a memory</Link>
            <Link href="/contact" className="btn btn-outline">Contribute material</Link>
          </div>
        </Container>
      </section>
    </>
  );
}
