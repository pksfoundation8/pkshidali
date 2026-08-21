import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/primitives/SectionHeading';
import { Icon } from '@/components/primitives/Icon';
import { CelestialBackdrop, Hill, hasHeroSky } from '@/components/home/CelestialBackdrop';
import { TributesExplorer } from '@/components/tributes/TributesExplorer';
import { ShareSidebar } from '@/components/tributes/ShareSidebar';
import { LegacyWall } from '@/components/tributes/LegacyWall';
import { CandleCard } from '@/components/tributes/CandleCard';
import { SymbolicTribute } from '@/components/tributes/SymbolicTribute';
import { getPublishedTributes, getMilestones } from '@/lib/content';
import { site } from '@/config/site';

export const metadata = {
  title: 'Lives He Touched',
  description:
    'Tributes and testimonies from family, students, church members, colleagues and community members whose lives were changed by Rev. Paul Kadir Shidali.',
};

const heroRoles = ['Husband', 'Father', 'Grandfather', 'Teacher', 'Pastor', 'Writer', 'Prayer Warrior'];

export default async function TributesPage() {
  const [tributes, milestones] = await Promise.all([getPublishedTributes(), getMilestones()]);
  const taught = tributes.filter((t) => t.taught);

  return (
    <>
      <section className="thero">
        <CelestialBackdrop even sky />
        {!hasHeroSky && <Hill />}
        <Container className="in">
          <div>
            <h1><span className="g">Lives</span> He Touched</h1>
            <p className="sub">Tributes &amp; Testimonies</p>
            <p className="lede">
              Every life has a story. Here we preserve the memories and testimonies of family,
              students, church members, colleagues and community members whose lives were
              transformed by {site.subject.name}.
            </p>
            <div className="acts">
              <Link href="/tributes/share" className="btn btn-gold">
                <Icon n="pen" s={15} />Share a Tribute
              </Link>
              <Link href="#legacy-wall" className="btn btn-light">
                <Icon n="book" s={15} />View Guestbook
              </Link>
              <Link href="/tributes/share" className="btn btn-light">
                <Icon n="upload" s={15} />Upload a Memory
              </Link>
            </div>
            <ul className="heroroles" aria-label="His roles">
              {heroRoles.map((r, i) => (
                <li key={r}>
                  {r}{i < heroRoles.length - 1 && <span aria-hidden="true">&middot;</span>}
                </li>
              ))}
            </ul>
          </div>
          <div className="por">
            <Image src="/portrait.jpg" alt={site.subject.name} width={520} height={587}
              sizes="(max-width: 1023px) 230px, 250px" />
          </div>
        </Container>
      </section>

      <section className="pad" style={{ paddingTop: 34 }}>
        <Container>
          <div className="tlayout">
            <div>
              <TributesExplorer tributes={tributes} />

              <div className="tpanels">
                <div className="tpanel">
                  <h3>Memory Gallery</h3>
                  <p>Explore photos, videos and documents from his life and ministry.</p>
                  <ul className="kinds">
                    <li><Icon n="photo" s={17} /><span>Photos</span></li>
                    <li><Icon n="video" s={17} /><span>Videos</span></li>
                    <li><Icon n="doc" s={17} /><span>Documents</span></li>
                  </ul>
                  <Link href="/archive" className="btn btn-outline">Explore gallery</Link>
                </div>

                <div className="tpanel">
                  <h3>What Rev. Shidali Taught Me</h3>
                  <ul className="taught mini">
                    {taught.slice(0, 4).map((t, i) => (
                      <li key={t.id}>
                        <Icon n={(['star', 'prayer', 'shield', 'heart'] as const)[i % 4]} s={15} />
                        He taught me {t.taught}.
                      </li>
                    ))}
                  </ul>
                  <Link href="/tributes/share" className="btn btn-outline">Share what he taught you</Link>
                </div>
              </div>

              <LegacyWall />
            </div>

            <aside className="tside">
              <ShareSidebar />
              <CandleCard />
              <SymbolicTribute />
            </aside>
          </div>
        </Container>
      </section>

      <section className="band paper">
        <Container>
          <SectionHeading center>Milestones of a Life Well Lived</SectionHeading>
          {/* Year ranges appear here once the family confirms them — the
              biography records no dates it cannot verify. */}
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
        </Container>
      </section>

      <section className="band">
        <Container className="trio">
          <div className="tpanel">
            <h3>Service &amp; Remembrance</h3>
            <p>Join us as we celebrate his life and legacy.</p>
            <p className="ev">
              <b>Celebration of Life</b>
              {/* Placeholder until the family confirms arrangements — same
                  convention as the [Street address] in the footer. */}
              <span>[Date and venue to be announced]</span>
              <span>Livestream details will be shared here.</span>
            </p>
            <Link href="/contact" className="btn btn-outline">Ask about the service</Link>
          </div>

          <div className="tpanel">
            <h3>Family Notes &amp; Acknowledgements</h3>
            <p className="fam">
              Our family is deeply grateful for the love, prayers and memories shared.
              Your tributes have been a source of comfort and strength.
            </p>
            <p className="sig">&mdash; The Shidali Family</p>
          </div>

          <div className="tpanel dark">
            <h3>Help Continue What He Started</h3>
            <p>
              Your support helps the {site.name} continue transforming lives through education,
              mentorship and community service.
            </p>
            <div className="acts">
              <Link href="/give" className="btn btn-gold">Support a student</Link>
              <Link href="/give" className="btn btn-ghost">Make a donation</Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
