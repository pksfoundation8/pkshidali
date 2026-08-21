/** Option lists shared between the forms and their API routes, so the two
 *  can never drift out of agreement about what is valid. */

export const contactSubjects = [
  'General enquiry',
  'Giving and tax receipts',
  'Scholarships',
  'Volunteering or mentoring',
  'Partnership',
  'Contributing to the archive',
  'Media',
];

export const volunteerAreas = [
  'Mentoring students',
  'Tutoring',
  'Teacher training',
  'Community outreach',
  'Archive digitisation',
  'Events',
  'Photography or video',
  'Administration',
  'Fundraising',
  'Professional or legal advice',
];

/**
 * Roles that bring an adult into contact with children.
 *
 * Selecting one of these makes the safeguarding acknowledgement mandatory —
 * enforced on the server, not just in the browser. Getting this list right
 * matters more than any other line in this file.
 */
export const workingWithChildren = [
  'Mentoring students',
  'Tutoring',
  'Teacher training',
  'Community outreach',
  'Events',
];

export const availabilityOptions = [
  'A few hours a month',
  'Weekly',
  'Weekends only',
  'Seasonal or project-based',
  'Remote only',
];

export const connectionOptions = [
  'Former student',
  'Church member',
  'Colleague',
  'Family',
  'Friend of the family',
  'Community member',
  'I did not know him personally',
];
