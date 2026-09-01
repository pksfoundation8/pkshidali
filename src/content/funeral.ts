import type { IconName } from '@/components/primitives/Icon';

/**
 * Funeral arrangements.
 *
 * Times are not yet confirmed, so they carry the same bracketed placeholder
 * convention used elsewhere on the site rather than a plausible invention —
 * a wrong time on a funeral announcement sends people to a locked church.
 * Fill `time` in below and the page updates everywhere it appears.
 */

export type FuneralEvent = {
  key: 'service-of-song' | 'funeral-service';
  title: string;
  date: string;          // ISO, for machine-readable markup
  dateLabel: string;
  time: string | null;   // null renders "Time to be confirmed"
  summary: string;
  icon: IconName;
};

export const funeralEvents: FuneralEvent[] = [
  {
    key: 'service-of-song',
    title: 'Service of Song',
    date: '2026-10-15',
    dateLabel: 'Thursday, 15 October 2026',
    time: null,
    summary:
      'An evening of hymns, scripture and remembrance, in the tradition he kept all his life.',
    icon: 'mic',
  },
  {
    key: 'funeral-service',
    title: 'Funeral Service',
    date: '2026-10-16',
    dateLabel: 'Friday, 16 October 2026',
    time: null,
    summary:
      'The service of committal, celebrating a life given to God and to the building of people.',
    icon: 'cross',
  },
];

export const venue = {
  name: 'Apostolic Faith Church',
  street: '111 Agbo Oba Street',
  city: 'Ilorin',
  state: 'Kwara State',
  country: 'Nigeria',
  get full() {
    return `${this.name}, ${this.street}, ${this.city}, ${this.state}, ${this.country}`;
  },
  get mapQuery() {
    return encodeURIComponent(`${this.name}, ${this.street}, ${this.city}, ${this.state}, ${this.country}`);
  },
};

export const funeralIntro = {
  eyebrow: 'Funeral Arrangements',
  title: 'Celebration of a Life Well Lived',
  lede:
    'The family of Rev. Paul Kadir Shidali invites you to join them in giving thanks for his life. ' +
    'Both services will be held at the Apostolic Faith Church in Ilorin.',
  note:
    'If you plan to attend, please let the family know using the form below. It helps them prepare ' +
    'seating and hospitality, and it is the only reason we ask.',
};

/** Which events an RSVP can name. Kept here so the form, the API and the CMS agree. */
export const rsvpEventOptions = funeralEvents.map((e) => ({ key: e.key, label: e.title }));
