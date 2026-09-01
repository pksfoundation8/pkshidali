import { funeralCard, size, contentType } from '@/lib/og/funeral-card';
import { funeralEvents, venue } from '@/content/funeral';

export const runtime = 'nodejs';
export const alt =
  'Rev. Paul Kadir Shidali, December 4, 1933 to August 16, 2026. Service of Song '
  + 'Thursday 15 October at 5:00 PM and Funeral Service Friday 16 October at 10:00 AM, '
  + 'Apostolic Faith Church, Ilorin.';
export { size, contentType };

export default async function Image() {
  return funeralCard({
    eyebrow: 'Funeral Arrangements',
    rows: funeralEvents.map((e) => ({
      label: e.title,
      // "Thursday, 15 October 2026" is too long beside a title at this size
      detail: `${e.dateLabel.replace(/^(\w{3})\w*,/, '$1')} · ${e.timeLabel}`,
    })),
    footnote: `${venue.name}, ${venue.street}, ${venue.city}`,
  });
}
