import Link from 'next/link';
import { Icon } from '@/components/primitives/Icon';
import { funeralEvents } from '@/content/funeral';

/**
 * Funeral announcement bar.
 *
 * Sits above the header on every page because the services are the most
 * time-critical thing on the site right now, and the nav is already at the
 * eight-item ceiling. Hides itself once the last service has passed, so it
 * cannot become a stale banner nobody remembered to remove.
 */
export function AnnounceBar() {
  const last = funeralEvents[funeralEvents.length - 1];
  if (Date.now() > new Date(`${last.date}T23:59:59Z`).getTime()) return null;

  return (
    <div className="announce">
      <Link href="/funeral">
        <Icon n="cross" s={14} />
        <span className="a-main">Funeral arrangements &mdash; 15 &amp; 16 October 2026, Ilorin</span>
        <span className="a-cta">Details &amp; RSVP<Icon n="arrow" s={13} /></span>
      </Link>
    </div>
  );
}
