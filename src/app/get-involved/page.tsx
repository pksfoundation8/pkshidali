import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { PageBanner } from '@/components/layout/PageBanner';
import { SectionHeading } from '@/components/primitives/SectionHeading';
import { IconCircle } from '@/components/primitives/IconCircle';
import { Icon } from '@/components/primitives/Icon';
import { VolunteerForm } from '@/components/forms/VolunteerForm';

export const metadata = {
  title: 'Get Involved',
  description: 'Volunteer, mentor or partner with the PK Shidali Foundation.',
};

const WAYS = [
  { icon: 'users' as const, title: 'Mentor',
    body: 'Take one young person seriously for a year. It is the thing he did more than anything else, and the thing that needs the most hands.' },
  { icon: 'book' as const, title: 'Tutor or train teachers',
    body: 'Teach a subject, or help teachers learn to mentor and form character rather than only deliver a syllabus.' },
  { icon: 'doc' as const, title: 'Digitise the archive',
    body: 'Photographs, letters and recordings degrade. Scanning, cataloguing and transcribing can be done from anywhere in the world.' },
  { icon: 'hands' as const, title: 'Serve the community',
    body: 'Outreach, elder care and school projects, run with the communities they serve rather than for them.' },
  { icon: 'heart' as const, title: 'Partner',
    body: 'Schools, congregations and organisations that want to work alongside the foundation.' },
  { icon: 'shield' as const, title: 'Professional advice',
    body: 'Legal, accounting, safeguarding and charity governance. A young foundation needs this more than it needs money.' },
];

export default function GetInvolvedPage() {
  return (
    <>
      <PageBanner eyebrow="Get Involved" title="Volunteer, Mentor, Partner"
        intro="He built people one at a time. The work needs more hands than it needs money — and much of it can be done from anywhere." />

      <section className="pad">
        <Container>
          <SectionHeading>Ways to help</SectionHeading>
          <ul className="cards">
            {WAYS.map((w) => (
              <li key={w.title}>
                <div className="card" style={{ cursor: 'default' }}>
                  <IconCircle n={w.icon} />
                  <h3>{w.title}</h3>
                  <p>{w.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="band paper" id="apply">
        <Container>
          <div className="duo arch">
            <VolunteerForm />

            <div>
              <h2 className="title" style={{ fontSize: 26 }}>What happens next</h2>
              <ol style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  'Someone from the foundation reads your application and replies.',
                  'You have a conversation about where your time would count most.',
                  'For anything involving children: references and a safeguarding check.',
                  'Placement, with someone to report to and a clear ask.',
                ].map((s, i) => (
                  <li key={s} style={{ display: 'flex', gap: 14, fontSize: 15, lineHeight: 1.7, color: 'var(--ink-muted)' }}>
                    <span style={{ flex: 'none', fontFamily: 'var(--display)', fontSize: 20, fontWeight: 600, color: 'var(--gold-700)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>

              <div className="note" style={{ marginTop: 30 }}>
                <Icon n="shield" s={18} />
                <span>
                  <strong>Safeguarding is not a formality.</strong> Nobody is placed with a student
                  before checks and references are complete. The same standard applies to
                  volunteers overseas as to those in Nigeria.
                </span>
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 30 }}>
                <Link href="/give" className="btn btn-outline"><Icon n="heart" s={16} />Give instead</Link>
                <Link href="/contact" className="btn btn-outline">Ask a question</Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
