import { funeralCard, size, contentType } from '@/lib/og/funeral-card';
import { streamedEvents, venue, scheduleSentence } from '@/content/funeral';

export const runtime = 'nodejs';
export const alt =
  `Watch the services for Rev. Paul Kadir Shidali from anywhere. ${scheduleSentence({ zone: true, events: streamedEvents })}, `
  + `streamed from ${venue.city}.`;
export { size, contentType };

export default async function Image() {
  return funeralCard({
    eyebrow: 'Watch From Anywhere',
    rows: streamedEvents.map((e) => ({
      label: e.title,
      detail: `${e.dateLabel.replace(/^(\w{3})\w*,/, '$1')} · ${e.timeLabel} WAT`,
    })),
    footnote: `Both services streamed live from ${venue.city}`,
  });
}
