import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { PageBanner } from '@/components/layout/PageBanner';
import { Icon } from '@/components/primitives/Icon';
import { getPublishedTributes } from '@/lib/content';

export const metadata = {
  title: 'Stories & Impact',
  description:
    'What the work produces: students, families, congregations and communities changed because he lived.',
};

/**
 * Deliberately empty of impact stories.
 *
 * The programmes have no beneficiaries to report on yet. Publishing invented or
 * borrowed "impact" would be the least honest page on the site, and the exact
 * failure the About page promises not to commit. So this page states the
 * position, sets out the reporting standard, and points to the tributes, which
 * are real testimony.
 */
export default async function StoriesPage() {
  const tributes = await getPublishedTributes();

  return (
    <>
      <PageBanner eyebrow="Stories" title="Stories & Impact"
        intro="What the work produces: students, families, congregations and communities changed because he lived." />

      <section className="pad">
        <Container>
          <div style={{ maxWidth: 780 }}>
            <div className="note">
              <Icon n="info" s={18} />
              <span>
                <strong>There are no impact stories here yet, and that is accurate.</strong> The
                foundation&rsquo;s programmes are new and have not yet produced results worth
                reporting. This page stays empty until they do, rather than being filled with
                stock photographs and borrowed statistics.
              </span>
            </div>

            <h2 className="title" style={{ marginTop: 40 }}>What will be published here</h2>
            <ul style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                'Named scholars, with their consent, and what changed for them',
                'Teachers trained, and what they took back into their classrooms',
                'Mentoring pairs, and what came of them over a full year',
                'Community projects, with what was spent and what was delivered',
                'Annual Legacy Day, each August',
                'Foundation news and annual reports',
              ].map((x) => (
                <li key={x} style={{ display: 'flex', gap: 12, fontSize: 15.5, lineHeight: 1.7, color: 'var(--ink-muted)' }}>
                  <span style={{ color: 'var(--gold-500)', flex: 'none' }}><Icon n="check" s={18} /></span>{x}
                </li>
              ))}
            </ul>

            <h2 className="title" style={{ marginTop: 44, fontSize: 26 }}>The reporting standard</h2>
            <div className="prose">
              <p>
                Every story published here will name what was actually done, for whom, and at what
                cost. Numbers will be given in full rather than as the flattering fraction. Where a
                programme underperforms, that will be reported too.
              </p>
              <p>
                No photograph of a child will appear without the consent of that child&rsquo;s
                guardian, and no beneficiary will be identified where identification could harm them.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="band paper">
        <Container>
          <div style={{ maxWidth: 780 }}>
            <h2 className="title">In the meantime, there is real testimony</h2>
            <p className="lead" style={{ marginTop: 14 }}>
              {tributes.length > 0
                ? `${tributes.length} ${tributes.length === 1 ? 'tribute has' : 'tributes have'} been published from people whose lives he changed directly. That is the impact record that already exists — and the foundation exists to extend it.`
                : 'The tributes archive is where the impact record begins — testimony from people whose lives he changed directly.'}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 30 }}>
              <Link href="/tributes" className="btn btn-solid">Read the tributes<Icon n="arrow" s={15} /></Link>
              <Link href="/programs" className="btn btn-outline">See the programmes</Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
