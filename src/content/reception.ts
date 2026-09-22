/**
 * The funeral reception.
 *
 * Unlike the services, this one is by invitation: each guest comes at the
 * invitation of a member of the family, and is admitted on a code issued when
 * they register. The eight names below are the only valid hosts, so a
 * registration cannot be filed against someone who is not hosting.
 */

export const receptionHosts = [
  'Lami',
  'Emmanuel',
  'Samuel',
  'Taiye',
  'Kehinde',
  'Helen',
  'Gloria',
  'David',
] as const;

export type ReceptionHost = (typeof receptionHosts)[number];

export const receptionEvent = {
  title: 'Funeral Reception',
  date: '2026-10-16',
  dateLabel: 'Friday, 16 October 2026',
  startsAt: '2026-10-16T15:00:00+01:00',
  timeLabel: '3:00 PM',
  /** Set this and the page stops saying "to be confirmed". */
  venue: 'Royal Vic Rock Hotel & Event Center' as string | null,
  venueNote: 'Gaa-Odota, Off Hajj Camp Road, Ilorin, Kwara State',
  intro:
    'The reception following the funeral service is by invitation. If one of the '
    + 'family has invited you, register below and an admission code will be issued '
    + 'to you for the door.',
};

/**
 * Admission codes.
 *
 * Deliberately short enough to read aloud over a bad phone line and type at a
 * door, with the ambiguous characters removed — no O/0, no I/1/L — because
 * these get handwritten and misread otherwise.
 */
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export function makeReceptionCode(): string {
  let body = '';
  for (let i = 0; i < 5; i += 1) {
    body += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return `PKS-${body}`;
}
