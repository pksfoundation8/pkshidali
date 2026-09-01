import type { IconName } from '@/components/primitives/Icon';

/**
 * Funeral arrangements.
 *
 * `startsAt` carries the true instant (West Africa Time, UTC+1, no DST) so the
 * page can render the same moment in the diaspora's timezones and emit correct
 * Event structured data. `timeLabel` is what a reader sees.
 *
 * Anything still unsettled keeps the bracketed placeholder convention used
 * elsewhere on the site rather than a plausible invention.
 */

export type FuneralEvent = {
  key: 'service-of-song' | 'funeral-service';
  title: string;
  date: string;
  dateLabel: string;
  startsAt: string;        // ISO with offset — the real instant
  timeLabel: string;
  summary: string;
  icon: IconName;
};

export const funeralEvents: FuneralEvent[] = [
  {
    key: 'service-of-song',
    title: 'Service of Song',
    date: '2026-10-15',
    dateLabel: 'Thursday, 15 October 2026',
    startsAt: '2026-10-15T17:00:00+01:00',
    timeLabel: '5:00 PM',
    summary:
      'An evening of hymns, scripture and remembrance, in the tradition he kept all his life.',
    icon: 'mic',
  },
  {
    key: 'funeral-service',
    title: 'Funeral Service',
    date: '2026-10-16',
    dateLabel: 'Friday, 16 October 2026',
    startsAt: '2026-10-16T10:00:00+01:00',
    timeLabel: '10:00 AM',
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

/** Reception follows the funeral service. Venue not yet settled. */
export const reception = {
  title: 'Reception',
  when: 'Following the Funeral Service on Friday, 16 October',
  venue: null as string | null,   // set this and the page stops saying "to be confirmed"
  note:
    'The family will share the reception venue here once it is confirmed. If you are travelling '
    + 'from outside Ilorin, please check this page again nearer the date.',
};

/** Timezones the family and congregation are actually spread across. */
export const watchZones: [string, string][] = [
  ['Ilorin / Lagos', 'Africa/Lagos'],
  ['London', 'Europe/London'],
  ['Toronto', 'America/Toronto'],
  ['New York', 'America/New_York'],
];

export const livestream = {
  /** Set to the watch URL once the family has it; until then the page says so. */
  url: null as string | null,
  platform: null as string | null,
  note:
    'A link will be published on this page before the services begin. Both services are '
    + 'expected to be streamed for family and friends who cannot travel to Ilorin.',
};

export const funeralIntro = {
  eyebrow: 'Funeral Arrangements',
  title: 'Celebration of a Life Well Lived',
  lede:
    'The family of Rev. Paul Kadir Shidali invites you to join them in giving thanks for his life. '
    + 'Both services will be held at the Apostolic Faith Church in Ilorin.',
  note:
    'If you plan to attend, please let the family know using the form below. It helps them prepare '
    + 'seating and hospitality, and it is the only reason we ask.',
};

export const rsvpEventOptions = funeralEvents.map((e) => ({ key: e.key, label: e.title }));

/** Same instant, rendered where the people watching actually are. */
export function zoneTimes(startsAt: string) {
  const d = new Date(startsAt);
  return watchZones.map(([label, tz]) => [
    label,
    new Intl.DateTimeFormat('en-GB', {
      timeZone: tz, weekday: 'short', hour: 'numeric', minute: '2-digit', hour12: true,
    }).format(d),
  ] as [string, string]);
}
