import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { PageBanner } from '@/components/layout/PageBanner';
import { Icon } from '@/components/primitives/Icon';
import { IconCircle } from '@/components/primitives/IconCircle';
import { RsvpForm } from '@/components/funeral/RsvpForm';
import { ShareInvite } from '@/components/tributes/ShareInvite';
import { funeralEvents, venue, funeralIntro, reception, livestream } from '@/content/funeral';
import { site } from '@/config/site';

const shareAsk =
  `Funeral arrangements for ${site.subject.name}. Service of Song on Thursday 15 October at 5:00 PM `
  + `and Funeral Service on Friday 16 October at 10:00 AM, ${venue.name}, ${venue.city}. `
  + 'Please let the family know if you plan to attend.';

export const metadata = {
  title: 'Funeral Arrangements',
  description: shareAsk,
  openGraph: {
    title: `Funeral Arrangements | ${site.subject.name}`,
    description: shareAsk,
    url: `${site.url}/funeral`,
    type: 'article',
  },
  twitter: { card: 'summary_large_image', title: 'Funeral Arrangements', description: shareAsk },
};

function eventJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': funeralEvents.map((e) => ({
      '@type': 'Event',
      name: `${e.title} — ${site.subject.name}`,
      startDate: e.startsAt,
      eventAttendanceMode: livestream.url
        ? 'https://schema.org/MixedEventAttendanceMode'
        : 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: {
        '@type': 'Place',
        name: venue.name,
        address: {
          '@type': 'PostalAddress',
          streetAddress: venue.street,
          addressLocality: venue.city,
          addressRegion: venue.state,
          addressCountry: 'NG',
        },
      },
      description: e.summary,
      organizer: { '@type': 'Organization', name: site.name, url: site.url },
    })),
  };
}

export default function FuneralPage() {
  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd()) }} />

      <PageBanner eyebrow={funeralIntro.eyebrow} title={funeralIntro.title}
        intro={funeralIntro.lede} />

      <section className="pad">
        <Container>
          {/* memorial card — the man himself, before the arrangements */}
          <div className="memcard">
            <div className="mem-por">
              <Image src="/portrait-v5.webp" unoptimized alt={site.subject.name}
                width={950} height={835} priority sizes="(max-width: 767px) 240px, 300px" />
            </div>
            <div className="mem-text">
              <p className="mem-k">In loving memory</p>
              <h2>{site.subject.name}</h2>
              <p className="mem-dates">{site.subject.bornLabel} &mdash; {site.subject.diedLabel}</p>
              <p className="mem-creed">
                Teacher, headmaster, pastor, preacher, writer and prayer warrior.
                Husband, father and grandfather.
              </p>
            </div>
          </div>

          {/* the two services */}
          <ul className="events">
            {funeralEvents.map((e) => (
              <li key={e.key} className="event">
                <IconCircle n={e.icon} />
                <div>
                  <p className="ev-when">{e.dateLabel}</p>
                  <h2>{e.title}</h2>
                  <p className="ev-time"><Icon n="info" s={14} />{e.timeLabel} (WAT)</p>
                  <p className="ev-sum">{e.summary}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* venue */}
          <div className="venue">
            <div>
              <h3>Venue &mdash; both services</h3>
              <p className="v-name">{venue.name}</p>
              <address>
                {venue.street}<br />
                {venue.city}, {venue.state}<br />
                {venue.country}
              </address>
              <a className="tlink" href={`https://www.google.com/maps/search/?api=1&query=${venue.mapQuery}`}
                target="_blank" rel="noopener noreferrer">
                <Icon n="pin" s={15} />Open in Maps
              </a>
            </div>

            <div className="v-side">
              <div className="v-block">
                <h3>{reception.title}</h3>
                <p className="v-when">{reception.when}</p>
                <p className="v-venue">{reception.venue ?? 'Venue to be confirmed'}</p>
                <p className="v-note-sm">{reception.note}</p>
              </div>

              <div className="v-block">
                <h3>Watching from abroad</h3>
                <p className="v-note-sm">{livestream.note}</p>
                <Link href="/funeral/livestream" className="btn btn-outline"
                  style={{ marginTop: 12, padding: '10px 18px' }}>
                  <Icon n="video" s={15} />Livestream details
                </Link>
              </div>
            </div>
          </div>

          <ShareInvite
            url={`${site.url}/funeral`}
            subject={`Funeral arrangements — ${site.subject.name}`}
            heading="Help the family reach everyone"
            body={
              <>
                Many who knew him have not yet heard. Forward these arrangements to a former
                student, a church member, a colleague &mdash; anyone who would want to be there,
                or to know the services can be watched from abroad.
              </>
            }
            message={
              `Funeral arrangements for ${site.subject.name}. Service of Song on Thursday `
              + '15 October at 5:00 PM, and the Funeral Service on Friday 16 October at 10:00 AM, '
              + `at ${venue.name}, ${venue.street}, ${venue.city}. `
              + 'Details, livestream and RSVP:'
            }
          />

          <div className="rsvp-wrap">
            <RsvpForm />

            <aside className="rsvp-aside">
              <h3>Other ways to honour him</h3>
              <p>
                If you cannot travel, you are just as welcome to take part from wherever you are.
              </p>
              <ul>
                <li>
                  <Link href="/funeral/livestream" className="tlink">
                    <Icon n="video" s={15} />Watch the livestream
                  </Link>
                </li>
                <li>
                  <Link href="/tributes/share" className="tlink">
                    <Icon n="pen" s={15} />Share a tribute
                  </Link>
                </li>
                <li>
                  <Link href="/tributes" className="tlink">
                    <Icon n="candle" s={15} />Light a candle
                  </Link>
                </li>
                <li>
                  <Link href="/give" className="tlink">
                    <Icon n="heart" s={15} />Support his work
                  </Link>
                </li>
              </ul>
              <p className="aside-contact">
                Questions about arrangements?{' '}
                <Link href="/contact">Contact the family</Link>.
              </p>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
