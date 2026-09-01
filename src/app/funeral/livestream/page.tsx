import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { PageBanner } from '@/components/layout/PageBanner';
import { Icon } from '@/components/primitives/Icon';
import { ShareInvite } from '@/components/tributes/ShareInvite';
import { funeralEvents, venue, livestream, zoneTimes } from '@/content/funeral';
import { site } from '@/config/site';

const shareAsk =
  `Watch the services for ${site.subject.name} from anywhere. Service of Song, Thursday 15 October `
  + 'at 5:00 PM WAT, and Funeral Service, Friday 16 October at 10:00 AM WAT.';

const FUNERAL_CARD_ALT =
  'Celebration of a Life Well Lived — Rev. Paul Kadir Shidali, December 4, 1933 to August 16, 2026. Funeral arrangements, 15–16 October 2026, Ilorin, Nigeria.';

export const metadata = {
  title: 'Livestream',
  description: shareAsk,
  openGraph: {
    title: `Watch the services | ${site.subject.name}`,
    description: shareAsk,
    url: `${site.url}/funeral/livestream`,
    type: 'article',
    siteName: site.name,
    locale: 'en_NG',
    // The family's own announcement card, used for both funeral pages.
    images: [{ url: '/og-funeral.jpg', width: 1200, height: 630, type: 'image/jpeg', alt: FUNERAL_CARD_ALT }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Watch the services',
    description: shareAsk,
    images: [{ url: '/og-funeral.jpg', alt: FUNERAL_CARD_ALT }],
  },
  // Shares arrive carrying ?fbclid= and ?utm_source=; without this each
  // variant counts as a separate page.
  alternates: { canonical: `${site.url}/funeral/livestream` },
};

/* The same two services as /funeral, described here as watchable online.
   The virtual location is this page: that is genuinely where the stream will
   be reachable, whether or not the provider link is set yet. */
function broadcastJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': funeralEvents.map((e) => ({
      '@type': 'Event',
      name: `${e.title} — ${site.subject.name}`,
      startDate: e.startsAt,
      eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      description: e.summary,
      location: [
        {
          '@type': 'VirtualLocation',
          url: livestream.url ?? `${site.url}/funeral/livestream`,
        },
        {
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
      ],
      organizer: { '@type': 'Organization', name: site.name, url: site.url },
    })),
  };
}

export default function LivestreamPage() {
  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(broadcastJsonLd()) }} />

      <PageBanner
        eyebrow="Livestream"
        title="Watch From Anywhere"
        intro={
          'His family and the people he taught are spread across several countries. '
          + 'Both services will be streamed so distance need not keep anyone away.'
        }
      />

      <section className="pad">
        <Container>
          <div className="memcard slim">
            <div className="mem-por">
              <Image src="/portrait-v5.webp" unoptimized alt={site.subject.name}
                width={950} height={835} priority sizes="(max-width: 767px) 200px, 250px" />
            </div>
            <div className="mem-text">
              <p className="mem-k">In loving memory</p>
              <h2>{site.subject.name}</h2>
              <p className="mem-dates">{site.subject.bornLabel} &mdash; {site.subject.diedLabel}</p>
            </div>
          </div>

          {/* the link, or an honest statement that there is not one yet */}
          <div className={`stream${livestream.url ? ' live' : ''}`}>
            {livestream.url ? (
              <>
                <h2>The stream is available</h2>
                <p>Both services will be broadcast here at the times below.</p>
                <a href={livestream.url} target="_blank" rel="noopener noreferrer"
                  className="btn btn-gold" style={{ marginTop: 18 }}>
                  <Icon n="video" s={16} />Open the livestream
                  {livestream.platform ? ` on ${livestream.platform}` : ''}
                </a>
              </>
            ) : (
              <>
                <span className="ring"><Icon n="video" s={26} /></span>
                <h2>The link is not published yet</h2>
                <p>{livestream.note}</p>
                <p className="stream-sub">
                  Bookmark this page &mdash; the link will appear here, and nowhere else the
                  family has to remember to update.
                </p>
              </>
            )}
          </div>

          {/* times where people actually are */}
          <h2 className="zones-h">Service times in your part of the world</h2>
          <div className="zones">
            {funeralEvents.map((e) => (
              <div key={e.key} className="zone-card">
                <p className="z-title">{e.title}</p>
                <p className="z-date">{e.dateLabel}</p>
                <ul>
                  {zoneTimes(e.startsAt).map(([label, time]) => (
                    <li key={label}>
                      <span className="z-place">{label}</span>
                      <span className="z-time">{time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="zones-note">
            <Icon n="info" s={15} />
            Times are calculated from West Africa Time (UTC+1) and account for daylight saving
            where it applies in October.
          </p>

          {/* the funeral service lands before dawn in North America, so say plainly
              that watching later is a real option rather than a consolation */}
          <div className="recording">
            <span className="ring sm"><Icon n="video" s={18} /></span>
            <div>
              <h3>{livestream.recordingUrl ? 'Watch the recording' : 'A recording will follow'}</h3>
              <p>{livestream.recordingNote}</p>
              {livestream.recordingUrl && (
                <a href={livestream.recordingUrl} target="_blank" rel="noopener noreferrer"
                  className="btn btn-outline" style={{ marginTop: 14, padding: '10px 18px' }}>
                  <Icon n="video" s={15} />Open the recording
                </a>
              )}
            </div>
          </div>

          <ShareInvite
            url={`${site.url}/funeral/livestream`}
            subject={`Watch the services — ${site.subject.name}`}
            heading="Send this to someone who cannot travel"
            body={
              <>
                Distance should not keep anyone away. Pass this on to family and friends
                abroad &mdash; the service times are shown in their own timezone, and a
                recording will follow for anyone who cannot watch live.
              </>
            }
            message={
              `Both services for ${site.subject.name} will be streamed from Ilorin. `
              + 'Service of Song, Thursday 15 October at 5:00 PM WAT, and the Funeral Service, '
              + 'Friday 16 October at 10:00 AM WAT. Times in your timezone, and the watch link:'
            }
          />

          {/* the same announcement the funeral page offers — someone who lands
              here first should not have to go looking for it */}
          <div className="cards-dl">
            <div>
              <h3>Announcement card</h3>
              <p>
                Save and post the announcement to WhatsApp Status, Instagram or
                Facebook. Each is sized for where it is going.
              </p>
            </div>
            <div className="dl-links">
              <a href="/og-funeral.jpg" download>
                <Icon n="photo" s={16} /><span>Post &amp; link<small>1200 × 630</small></span>
              </a>
              <a href="/share-square.jpg" download>
                <Icon n="photo" s={16} /><span>Square<small>1080 × 1080</small></span>
              </a>
              <a href="/share-story.jpg" download>
                <Icon n="photo" s={16} /><span>Status / Story<small>1080 × 1920</small></span>
              </a>
            </div>
          </div>

          <div className="stream-foot">
            <div>
              <h3>Attending in person instead?</h3>
              <p>
                Both services are at {venue.name}, {venue.street}, {venue.city}.
                The family would be glad to know you are coming.
              </p>
            </div>
            <Link href="/funeral#rsvp" className="btn btn-solid">
              <Icon n="check" s={16} />Funeral details &amp; RSVP
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
