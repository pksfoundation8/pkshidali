import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { PageBanner } from '@/components/layout/PageBanner';
import { Icon } from '@/components/primitives/Icon';
import { IconCircle } from '@/components/primitives/IconCircle';
import { RsvpForm } from '@/components/funeral/RsvpForm';
import { funeralEvents, venue, funeralIntro } from '@/content/funeral';
import { site } from '@/config/site';

const shareAsk =
  `Funeral arrangements for ${site.subject.name}. Service of Song on Thursday 15 October and ` +
  `Funeral Service on Friday 16 October 2026, at ${venue.name}, ${venue.city}. ` +
  'Please let the family know if you plan to attend.';

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

/** Event structured data so the services surface correctly in search and chat previews. */
function eventJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': funeralEvents.map((e) => ({
      '@type': 'Event',
      name: `${e.title} — ${site.subject.name}`,
      startDate: e.date,
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
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
          {/* the two services */}
          <ul className="events">
            {funeralEvents.map((e) => (
              <li key={e.key} className="event">
                <IconCircle n={e.icon} />
                <div>
                  <p className="ev-when">{e.dateLabel}</p>
                  <h2>{e.title}</h2>
                  <p className="ev-time">
                    <Icon n="info" s={14} />
                    {e.time ?? 'Time to be confirmed'}
                  </p>
                  <p className="ev-sum">{e.summary}</p>
                </div>
              </li>
            ))}
          </ul>

          {/* venue */}
          <div className="venue">
            <div>
              <h3>Venue</h3>
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
            <div className="v-note">
              <Icon n="info" s={18} />
              <span>
                Both services are held at the same church. Service times will be confirmed here
                as soon as the family has finalised them &mdash; if you are travelling a long
                way, please check this page again nearer the date.
              </span>
            </div>
          </div>

          <div className="rsvp-wrap">
            <RsvpForm />

            <aside className="rsvp-aside">
              <h3>Other ways to honour him</h3>
              <p>
                If you cannot travel, you are just as welcome to take part from wherever you are.
              </p>
              <ul>
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
