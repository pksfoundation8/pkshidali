import { pillar } from './pillar';
import { program } from './program';
import { milestone } from './milestone';
import { tribute } from './tribute';
import { mediaAsset } from './mediaAsset';
import { sermon } from './sermon';
import { person } from './person';
import { page } from './page';
import { siteSettings } from './siteSettings';
import { rsvp } from './rsvp';
import { receptionGuest } from './receptionGuest';

/** The nine document types from the development plan, plus funeral RSVPs and
 *  reception guests. */
export const schemaTypes = [
  pillar, program, milestone, tribute, mediaAsset, sermon, person, page, siteSettings, rsvp,
  receptionGuest,
];
