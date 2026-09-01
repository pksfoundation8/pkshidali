import { funeralCard, size, contentType } from '@/lib/og/funeral-card';
import { funeralEvents, venue } from '@/content/funeral';

export const runtime = 'nodejs';
export const alt =
  'Watch the services for Rev. Paul Kadir Shidali from anywhere. Service of Song '
  + 'Thursday 15 October at 5:00 PM WAT and Funeral Service Friday 16 October at '
  + '10:00 AM WAT, streamed from Ilorin.';
export { size, contentType };

export default async function Image() {
  return funeralCard({
    eyebrow: 'Watch From Anywhere',
    rows: funeralEvents.map((e) => ({
      label: e.title,
      detail: `${e.dateLabel.replace(/^(\w{3})\w*,/, '$1')} · ${e.timeLabel} WAT`,
    })),
    footnote: `Both services streamed live from ${venue.city}`,
  });
}
