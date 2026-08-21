import type { IconName } from '@/components/primitives/Icon';

/**
 * Every open decision from the development plan lives here.
 * Resolving one should mean editing one line in this file.
 */

export const site = {
  name: 'PK Shidali Foundation',
  domain: 'pkshidali.org',
  url: 'https://pkshidali.org',
  tagline: 'Building People. Continuing a Legacy. Transforming Generations.',
  footerCreed: ['Building people.', 'Continuing a legacy.', 'Transforming generations.'],

  subject: {
    name: 'Rev. Paul Kadir Shidali',
    born: '1933-12-04',
    died: '2026-08-16',
    bornLabel: 'Dec. 4, 1933',
    diedLabel: 'Aug. 16, 2026',
  },

  // DECISION 2 — RESOLVED. The foundation is Nigerian; its reach is global,
  // with four of his children based in Canada.
  //
  // Street address and phone below are still placeholders — replace with the
  // registered address once CAC incorporation is complete.
  contact: {
    address: ['[Street address]', 'Nigeria'],
    phone: '+234 800 000 0000',
    email: 'info@pkshidali.org',
    countryLocked: true,
  },

  /** Home jurisdiction. Registration, safeguarding law and data law follow this. */
  jurisdiction: {
    country: 'Nigeria',
    countryCode: 'NG',
    timezone: 'Africa/Lagos',
    homeCurrency: 'NGN',
    /** Where the diaspora community sits. Drives currency defaults and copy. */
    diaspora: ['CA', 'US', 'GB'],
  },

  socials: [
    { label: 'Facebook', href: '#', icon: 'fb' as IconName },
    { label: 'Instagram', href: '#', icon: 'ig' as IconName },
    { label: 'YouTube', href: '#', icon: 'yt' as IconName },
    { label: 'LinkedIn', href: '#', icon: 'li' as IconName },
  ],

  // King James Version — public domain, so it reproduces without licensing.
  scripture: {
    text:
      'Well done, thou good and faithful servant: thou hast been faithful over a few things, I will make thee ruler over many things.',
    reference: 'Matthew 25:21 (KJV)',
  },

  // DECISION 1 — the v2 mockup signs the pull quote as his own words.
  // Change this one line to credit the Foundation instead.
  quoteAttribution: 'Rev. Paul Kadir Shidali',
};

/**
 * DECISION 3 — RESOLVED. Eight primary items, the plan's ceiling before the
 * bar wraps. Stories, Get Involved and Contact live in the footer (and the
 * mobile drawer's secondary group); Gallery/Sermons/Resources fold under Archive.
 */
export const primaryNav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'His Life', href: '/his-life' },
  { label: 'Legacy', href: '/legacy' },
  { label: 'Programs', href: '/programs' },
  { label: 'Tributes', href: '/tributes' },
  { label: 'Archive', href: '/archive' },
  { label: 'Give', href: '/give' },
];

/** Demoted from the primary bar; still reachable from the drawer and footer. */
export const secondaryNav = [
  { label: 'Stories', href: '/stories' },
  { label: 'Get Involved', href: '/get-involved' },
  { label: 'Contact', href: '/contact' },
  { label: 'Share a Tribute', href: '/tributes/share' },
];

export const footerNav = [
  { label: 'About', href: '/about' },
  { label: 'Get Involved', href: '/get-involved' },
  { label: 'His Life', href: '/his-life' },
  { label: 'Give', href: '/give' },
  { label: 'Legacy', href: '/legacy' },
  { label: 'Resources', href: '/archive' },
  { label: 'Tributes', href: '/tributes' },
  { label: 'Contact', href: '/contact' },
  { label: 'Programs', href: '/programs' },
  { label: 'Stories', href: '/stories' },
];

export const policyNav = [
  { label: 'Privacy', href: '/policies/privacy' },
  { label: 'Child Safeguarding', href: '/policies/safeguarding' },
  { label: 'Donation Policy', href: '/policies/donations' },
];

/** The roles strip beneath the hero. Two groups, split by a spacer. */
export const rolesVocation: [IconName, string][] = [
  ['book', 'Teacher'], ['cap', 'Headmaster'], ['users', 'Pastor'],
  ['mic', 'Preacher'], ['prayer', 'Prayer Warrior'], ['doc', 'Bible Student'],
];

export const rolesFamily: [IconName, string][] = [
  ['heart', 'Husband'], ['family', 'Father'], ['users', 'Grandfather'],
  ['cross', 'Servant of Christ'],
];
