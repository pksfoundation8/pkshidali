import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { PageBanner } from '@/components/layout/PageBanner';
import { Icon } from '@/components/primitives/Icon';
import { funeralEvents, venue, livestream, zoneTimes } from '@/content/funeral';
import { site } from '@/config/site';

const shareAsk =
  `Watch the services for ${site.subject.name} from anywhere. Service of Song, Thursday 15 October `
  + 'at 5:00 PM WAT, and Funeral Service, Friday 16 October at 10:00 AM WAT.';

export const metadata = {
  title: 'Livestream',
  description: shareAsk,
  openGraph: {
    title: `Watch the services | ${site.subject.name}`,
    description: shareAsk,
    url: `${site.url}/funeral/livestream`,
    type: 'article',
  },
  twitter: { card: 'summary_large_image', title: 'Watch the services', description: shareAsk },
};

export default function LivestreamPage() {
  return (
    <>
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
