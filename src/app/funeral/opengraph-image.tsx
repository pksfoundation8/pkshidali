import { funeralCard, size, contentType } from '@/lib/og/funeral-card';
import { funeralEvents, venue, scheduleSentence } from '@/content/funeral';

export const runtime = 'nodejs';
export const alt =
  `Rev. Paul Kadir Shidali, December 4, 1933 to August 16, 2026. ${scheduleSentence()}, `
  + `at ${venue.name}, ${venue.city}.`;
export { size, contentType };

export default async function Image() {
  return funeralCard({
    eyebrow: 'Funeral Arrangements',
    rows: funeralEvents.map((e) => ({
      label: e.title,
      // "Thursday, 15 October 2026" is too long beside a title at this size,
      // and an event with no hour is placed by what it follows instead
      detail: e.startsAt
        ? `${e.dateLabel.replace(/^(\w{3})\w*,/, '$1')} · ${e.timeLabel}`
        : e.timeLabel,
    })),
    footnote: `${venue.name}, ${venue.street}, ${venue.city}`,
  });
}
