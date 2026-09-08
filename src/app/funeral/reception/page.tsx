import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { PageBanner } from '@/components/layout/PageBanner';
import { Icon } from '@/components/primitives/Icon';
import { IconCircle } from '@/components/primitives/IconCircle';
import { ReceptionForm } from '@/components/funeral/ReceptionForm';
import { receptionEvent, receptionHosts } from '@/content/reception';
import { venue } from '@/content/funeral';
import { site } from '@/config/site';

export const metadata = {
  title: 'Reception — by invitation',
  description:
    `The reception following the funeral service for ${site.subject.name}, `
    + `${receptionEvent.dateLabel} at ${receptionEvent.timeLabel}. By invitation.`,
  alternates: { canonical: `${site.url}/funeral/reception` },
  /* An invitation-only page has no business in search results: it would draw
     people the family has not invited, and turning them away at a door is
     worse than never having been found. */
  robots: { index: false, follow: false },
};

export default function ReceptionPage() {
  return (
    <>
      <PageBanner
        eyebrow="By invitation"
        title="Funeral Reception"
        intro={receptionEvent.intro}
      />

      <section className="pad">
        <Container>
          <div className="memcard slim">
            <div className="mem-por">
              <Image src="/portrait-seated-v1.webp" unoptimized alt={site.subject.name}
                width={760} height={869} preload sizes="(max-width: 767px) 200px, 250px" />
            </div>
            <div className="mem-text">
              <p className="mem-k">In loving memory</p>
              <h2>{site.subject.name}</h2>
              <p className="mem-dates">{site.subject.bornLabel} &mdash; {site.subject.diedLabel}</p>
            </div>
          </div>

          <ul className="events" style={{ marginTop: 26 }}>
            <li className="event">
              <IconCircle n="heart" />
              <div>
                <p className="ev-when">{receptionEvent.dateLabel}</p>
                <h2>{receptionEvent.title}</h2>
                <p className="ev-time"><Icon n="info" s={14} />{receptionEvent.timeLabel} (WAT)</p>
                <p className="ev-sum">
                  Following the funeral service earlier that day at {venue.name}.
                </p>
              </div>
            </li>
            <li className="event">
              <IconCircle n="pin" />
              <div>
                <p className="ev-when">Venue</p>
                <h2>{receptionEvent.venue ?? 'To be confirmed'}</h2>
                <p className="ev-sum">{receptionEvent.venueNote}</p>
              </div>
            </li>
          </ul>

          <div className="note" style={{ marginTop: 26, maxWidth: 760 }}>
            <Icon n="info" s={18} />
            <span>
              The reception is hosted by {receptionHosts.slice(0, -1).join(', ')} and{' '}
              {receptionHosts[receptionHosts.length - 1]}. Please register under the name of
              whoever invited you &mdash; your code is issued against their list.
            </span>
          </div>

          <div style={{ marginTop: 30 }}>
            <ReceptionForm />
          </div>

          <div className="stream-foot" style={{ marginTop: 30 }}>
            <div>
              <h3>Attending the services as well?</h3>
              <p>
                The service of song, lying in state and funeral service are open to all,
                and are listed with times and an RSVP on the arrangements page.
              </p>
            </div>
            <Link href="/funeral" className="btn btn-solid">
              <Icon n="arrow" s={16} />Funeral arrangements
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
