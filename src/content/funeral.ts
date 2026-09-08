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
  key: 'service-of-song' | 'lying-in-state' | 'funeral-service' | 'interment';
  title: string;
  date: string;
  dateLabel: string;
  /** ISO with offset — the real instant. Null when only the order in the day
   *  is known and not the hour, which must not be guessed. */
  startsAt: string | null;
  timeLabel: string;
  summary: string;
  icon: IconName;
  /** Whether this one is carried on the livestream. All three are. */
  streamed: boolean;
};

export const funeralEvents: FuneralEvent[] = [
  {
    key: 'service-of-song',
    title: 'Service of Song',
    date: '2026-10-15',
    dateLabel: 'Thursday, 15 October 2026',
    startsAt: '2026-10-15T16:00:00+01:00',
    timeLabel: '4:00 PM',
    summary:
      'An evening of hymns, scripture and remembrance, in the tradition he kept all his life.',
    icon: 'mic',
    streamed: true,
  },
  {
    key: 'lying-in-state',
    title: 'Lying in State',
    date: '2026-10-16',
    dateLabel: 'Friday, 16 October 2026',
    startsAt: '2026-10-16T08:00:00+01:00',
    timeLabel: '8:00 AM',
    summary:
      'An hour to pay respects before the service, for those who wish to come early.',
    icon: 'candle',
    streamed: true,
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
    streamed: true,
  },
  {
    key: 'interment',
    title: 'Interment',
    date: '2026-10-16',
    dateLabel: 'Friday, 16 October 2026',
    // No hour has been given, only that it follows the service.
    startsAt: null,
    timeLabel: 'Follows the Funeral Service',
    summary: 'The burial, immediately following the funeral service.',
    icon: 'seed',
    streamed: false,
  },
];

/** "Thursday 15 October at 4:00 PM" — the year is dropped because every one of
 *  these is 2026 and the surrounding copy already says so. */
export function shortWhen(e: FuneralEvent) {
  const day = e.dateLabel.replace(/,/, '').replace(/ \d{4}$/, '');
  return e.startsAt ? `${day} at ${e.timeLabel}` : `${day}, ${e.timeLabel.toLowerCase()}`;
}

/** The whole schedule in one sentence, for share text and meta descriptions.
 *  Derived, so the prose cannot drift from the times above the way it did when
 *  each mention was typed by hand. */
export function scheduleSentence(opts: { zone?: boolean; events?: FuneralEvent[] } = {}) {
  const z = opts.zone ? ' WAT' : '';
  return (opts.events ?? funeralEvents)
    .map((e) => {
      const day = e.dateLabel.replace(/,/, '').replace(/ \d{4}$/, '');
      // An event with no hour is placed by what it follows, not by a clock.
      return e.startsAt
        ? `${e.title}, ${day} at ${e.timeLabel}${z}`
        : `${e.title}, ${e.timeLabel.toLowerCase()}`;
    })
    .join('; ');
}

/** The ones that are broadcast — the livestream page speaks only for these.
 *  Narrowed so a timeless event can never reach the timezone conversion. */
export const streamedEvents = funeralEvents.filter(
  (e): e is FuneralEvent & { startsAt: string } => e.streamed && e.startsAt !== null,
);

export const venue = {
  name: 'Apostolic Faith Church',
  street: '111 Agbo-Oba Street',
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
    'A link will be published on this page before the services begin. All three are '
    + 'expected to be streamed for family and friends who cannot travel to Ilorin.',
  /** The funeral service falls at 5:00 am in North America, so the recording
   *  matters as much as the live stream for a family spread across Canada. */
  recordingNote:
    'A recording will be posted here afterwards, so anyone who cannot watch '
    + 'live — or for whom the hour is difficult — can still take part in their own time.',
  /** Set once the recording is up; the page then links it instead of promising it. */
  recordingUrl: null as string | null,
};

export const funeralIntro = {
  eyebrow: 'Funeral Arrangements',
  title: 'Celebration of a Life Well Lived',
  lede:
    'The family of Rev. Paul Kadir Shidali invites you to join them in giving thanks for his life. '
    + 'All three will be held at the Apostolic Faith Church in Ilorin.',
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
