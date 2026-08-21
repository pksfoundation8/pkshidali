import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/primitives/SectionHeading';
import { IconCircle } from '@/components/primitives/IconCircle';
import { Icon } from '@/components/primitives/Icon';
import { CelestialBackdrop, PortraitBurst, Hill, hasHeroSky } from './CelestialBackdrop';
import { site, rolesVocation, rolesFamily } from '@/config/site';
import { archiveTiles, involveCards, heroCopy, signatureQuote } from '@/content/home';
import { getPillars, getPrograms, getMilestones, getFeaturedTributes, getSettings } from '@/lib/content';

/* ── hero ─────────────────────────────────────────────────────────── */
export function Hero() {
  return (
    <section className="hero2">
      <CelestialBackdrop sky />
      {!hasHeroSky && <Hill />}
      <Container className="in">
        <div>
          <p className="eb rise">{heroCopy.eyebrow}</p>
          <h1 className="rise" style={{ animationDelay: '.1s' }}>
            <span>{heroCopy.namePre}</span>{' '}
            <span className="g">{heroCopy.nameGold}</span>{' '}
            <span>{heroCopy.namePost}</span>
          </h1>
          <div className="hrule rise" style={{ animationDelay: '.15s' }} aria-hidden="true">
            <span className="a" /><span className="d">&#10022;</span><span className="b" />
          </div>
          <p className="lede rise" style={{ animationDelay: '.2s' }}>{heroCopy.lede}</p>
          <div className="acts rise" style={{ animationDelay: '.3s' }}>
            <Link href="/legacy" className="btn btn-gold">
              <Icon n="book" s={15} />Explore His Legacy<Icon n="arrow" s={15} />
            </Link>
            <Link href="/tributes" className="btn btn-ghost">
              <Icon n="chat" s={15} />Read Tributes
            </Link>
            <Link href="/give" className="btn btn-light">
              <Icon n="heart" s={15} />Support the Foundation
            </Link>
          </div>
        </div>

        <div className="pwrap rise" style={{ animationDelay: '.18s' }}>
          <PortraitBurst />
          <span className="pglow" aria-hidden="true" />
          <div className="pframe">
            <Image src="/portrait-cut.webp" alt={site.subject.name} width={620} height={780}
              priority sizes="(max-width: 1023px) 270px, 330px" />
          </div>
          <div className="pdates">
            <p className="k">Forever in our hearts</p>
            <p className="d">{site.subject.bornLabel} &mdash; {site.subject.diedLabel}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ── roles strip ──────────────────────────────────────────────────── */
export function RolesBar() {
  return (
    <div className="roles">
      <Container>
        <ul>
          {rolesVocation.map(([icon, label]) => (
            <li key={label}><Icon n={icon} s={17} /><span>{label}</span></li>
          ))}
          <li className="gap" aria-hidden="true" />
          {rolesFamily.map(([icon, label]) => (
            <li key={label}><Icon n={icon} s={17} /><span>{label}</span></li>
          ))}
        </ul>
      </Container>
    </div>
  );
}

/* ── pillars + programs ───────────────────────────────────────────── */
export async function PillarsAndPrograms() {
  const [pillars, programs] = await Promise.all([getPillars(), getPrograms()]);
  return (
    <section className="band">
      <Container className="duo">
        <div>
          <SectionHeading>Legacy Pillars</SectionHeading>
          <ul className="pill6">
            {pillars.map((p) => (
              <li key={p.slug}>
                <Link href={`/legacy/${p.slug}`} className="pmini">
                  <IconCircle n={p.icon} />
                  <b>{p.title}</b>
                  <small>{p.blurb}</small>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <SectionHeading>Programs &amp; Initiatives</SectionHeading>
          <ul className="prog5">
            {programs.map((p) => (
              <li key={p.slug}>
                <Link href={`/programs/${p.slug}`} className="p5">
                  <IconCircle n={p.icon} size="sm" tone={p.olive ? 'olive' : 'gold'} />
                  <b>{p.title}</b>
                  <small>{p.summary}</small>
                  <span className="lm">Learn more &rarr;</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

/* ── quote strip ──────────────────────────────────────────────────── */
export async function QuoteStrip() {
  const settings = await getSettings();
  return (
    <section className="quote2">
      <span className="qbase" aria-hidden="true" />
      <CelestialBackdrop even />
      <Container className="in">
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          <span className="qm" aria-hidden="true">&ldquo;</span>
          <p className="qt">{signatureQuote}</p>
        </div>
        {/* DECISION 1 — attribution is a single constant in config/site.ts */}
        <p className="att"><span className="ln" aria-hidden="true" />{settings.quoteAttribution}</p>
      </Container>
    </section>
  );
}

/* ── tributes + timeline ──────────────────────────────────────────── */
function initials(name: string) {
  const clean = name.replace(/\[.*?\]/g, '').trim().split(/\s+/).slice(0, 2);
  return clean.map((w) => w[0] ?? '').join('').toUpperCase() || '\u2726';
}

export async function TributesAndTimeline() {
  const [featuredTributes, milestones] = await Promise.all([getFeaturedTributes(), getMilestones()]);
  return (
    <section className="band">
      <Container className="duo">
        <div>
          <SectionHeading>Lives He Touched</SectionHeading>
          <ul className="tmini">
            {featuredTributes.map((t) => (
              <li key={t.id}>
                <Link href={`/tributes/${t.id}`} className="tm">
                  <span className="mono" aria-hidden="true">{initials(t.name)}</span>
                  <span>
                    <q>{t.body.length > 96 ? `${t.body.slice(0, 96).trimEnd()}\u2026` : t.body}</q>
                    <span className="nm">{t.name}</span>
                    <span className="rl">{t.relationship}</span>
                    <span className="stars" aria-hidden="true">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 11, marginTop: 22 }}>
            <Link href="/tributes" className="btn btn-solid">Read more tributes</Link>
            <Link href="/tributes/share" className="btn btn-outline">
              <Icon n="plus" s={15} />Share your story
            </Link>
          </div>
        </div>

        <div>
          <SectionHeading>His Life in Timeline</SectionHeading>
          <ol className="tl6">
            <span className="rail" aria-hidden="true" />
            {milestones.map((m) => (
              <li key={m.title} className="t6">
                <span className="nd"><Icon n={m.icon} s={21} /></span>
                <b>{m.title}</b>
                <small>{m.summary}</small>
              </li>
            ))}
          </ol>
          <Link href="/his-life" className="tlink" style={{ marginTop: 24 }}>
            See the full story<Icon n="arrow" s={14} />
          </Link>
        </div>
      </Container>
    </section>
  );
}

/* ── archive + get involved ───────────────────────────────────────── */
export function ArchiveAndInvolve() {
  return (
    <section className="band paper">
      <Container className="duo arch">
        <div>
          <SectionHeading>Legacy Archive &amp; Resources</SectionHeading>
          <ul className="arch5">
            {archiveTiles.map((a) => (
              <li key={a.title}>
                <Link href={a.href} className="a5">
                  {/* Real digitised material replaces the engraved tile in Phase 3. */}
                  <span className="th"><Icon n={a.icon} s={34} /></span>
                  <span className="mt">
                    <b>{a.title}</b>
                    <small>{a.summary}</small>
                    <span className="ex">Explore &rarr;</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <SectionHeading>Get Involved</SectionHeading>
          <ul className="gi">
            {involveCards.map((c) => (
              <li key={c.title} className="gic">
                <IconCircle n={c.icon} size="sm" style={{ color: c.colour, borderColor: c.colour }} />
                <b>{c.title}</b>
                <small>{c.summary}</small>
                <Link href={c.href} className="gib" style={{ background: c.colour }}>{c.cta}</Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}

/* ── closing CTA ──────────────────────────────────────────────────── */
export function BuildLegacy() {
  return (
    <section className="build">
      <Container className="in">
        <span className="orn" aria-hidden="true"><Icon n="seed" s={72} /></span>
        <div>
          <h2>Help <span className="g">Build the Legacy</span></h2>
          <p>
            Your support continues the mission and vision of {site.subject.name} &mdash; empowering
            lives, advancing education and building people, one generation at a time.
          </p>
        </div>
        <div className="acts">
          <Link href="/give" className="btn btn-gold"><Icon n="heart" s={16} />Donate now</Link>
          <Link href="/get-involved" className="btn btn-light">
            Other ways to give<Icon n="arrow" s={15} />
          </Link>
        </div>
      </Container>
    </section>
  );
}
