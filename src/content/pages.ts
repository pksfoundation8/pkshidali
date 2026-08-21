import type { IconName } from '@/components/primitives/Icon';

/** Archive sections. Records are sample catalogue entries until Phase 3 digitisation. */
export type ArchiveRecord = { id: string; title: string; meta: string; desc: string; sample?: boolean };

export type ArchiveSection = {
  slug: string;
  title: string;
  icon: IconName;
  intro: string;
  /** What a real catalogue entry in this section must carry. */
  fields: string[];
  records: ArchiveRecord[];
};

export const archiveSections: ArchiveSection[] = [
  {
    slug: 'sermons',
    title: 'Sermons & Teachings',
    icon: 'mic',
    intro:
      'Recorded messages, sermon notes and preaching material. Where a recording exists, a transcript is published alongside it — for accessibility, and because transcripts are what make the archive searchable.',
    fields: ['Date preached', 'Scripture reference', 'Audio file', 'Sermon notes (PDF)', 'Transcript', 'Topic tags'],
    records: [
      { id: 'sr1', sample: true, title: '[Sample] Sermon recording', meta: 'Audio · Undated',
        desc: 'Placeholder record showing the shape of a catalogue entry.' },
      { id: 'sr2', sample: true, title: '[Sample] Sermon notes', meta: 'Document · Undated',
        desc: 'Placeholder record. Scanned handwritten notes, indexed by scripture.' },
    ],
  },
  {
    slug: 'photos',
    title: 'Photograph Archive',
    icon: 'photo',
    intro:
      'School, church, family and community photographs, tagged by place and year where known. Where a date or location is uncertain, it is recorded as uncertain rather than guessed.',
    fields: ['Date or approximate year', 'Location', 'People identified', 'Original source', 'High-resolution scan'],
    records: [
      { id: 'ph1', sample: true, title: '[Sample] School photograph', meta: 'Photograph · Undated',
        desc: 'Placeholder record. Staff and student photographs by school and year.' },
      { id: 'ph2', sample: true, title: '[Sample] Church photograph', meta: 'Photograph · Undated',
        desc: 'Placeholder record. Congregation and ministry photographs.' },
      { id: 'ph3', sample: true, title: '[Sample] Family photograph', meta: 'Photograph · Undated',
        desc: 'Placeholder record. Household and generational photographs.' },
    ],
  },
  {
    slug: 'documents',
    title: 'Documents & Bible Notes',
    icon: 'doc',
    intro:
      'Letters, certificates, school records, appointment papers, his annotated Bibles — and his unpublished manuscripts, which the foundation is cataloguing for eventual publication. This is the material most at risk of loss, and the first priority for digitisation.',
    fields: ['Document type', 'Date', 'Issuing body or author', 'Condition', 'Scan and transcription'],
    records: [
      { id: 'dc1', sample: true, title: '[Sample] Handwritten Bible notes', meta: 'Document · Undated',
        desc: 'Placeholder record. Scanned pages catalogued by book and chapter.' },
      { id: 'dc2', sample: true, title: '[Sample] School records', meta: 'Document · Undated',
        desc: 'Placeholder record. Appointment letters, certificates, institutional papers.' },
      { id: 'dc3', sample: true, title: '[Sample] Homegoing tributes, 2026', meta: 'Document · Aug 2026',
        desc: 'Placeholder record. Digitised funeral tributes, preserved as a dated collection.' },
    ],
  },
  {
    slug: 'video',
    title: 'Legacy Voices',
    icon: 'video',
    intro:
      'Filmed testimonies, one to three minutes each. Every video is captioned. The standard opening question: when you hear his name, what do you remember?',
    fields: ['Contributor and relationship', 'Date recorded', 'Video file', 'Captions', 'Consent record'],
    records: [
      { id: 'vd1', sample: true, title: '[Sample] Legacy Voices interview', meta: 'Video · 2026',
        desc: 'Placeholder record. Short filmed testimony, captioned.' },
      { id: 'vd2', sample: true, title: '[Sample] Recorded audio tribute', meta: 'Audio · 2026',
        desc: 'Placeholder record. Two to five minute voice recording.' },
    ],
  },
];

/**
 * Policy pages.
 *
 * These are legal documents and this software does not write them. Each page
 * publishes the outline of what the policy must cover, so the foundation and
 * its counsel can see exactly what is outstanding. A safeguarding policy in
 * particular must be approved by someone qualified before any volunteer works
 * with a child.
 */
export type Policy = {
  slug: string;
  title: string;
  intro: string;
  urgency: string;
  sections: { heading: string; points: string[] }[];
};

export const policies: Policy[] = [
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    intro: 'How the foundation collects, stores, uses and deletes personal information, in Nigeria and for contributors abroad.',
    urgency: 'Required before any form on this site goes live. Must address the Nigeria Data Protection Act 2023 and cross-border transfer.',
    sections: [
      { heading: 'What is collected', points: [
        'Tribute submissions, including name, email and any uploaded media',
        'Volunteer and scholarship applications',
        'Newsletter subscriptions', 'Donation records held by the payment provider'] },
      { heading: 'How it is used and shared', points: [
        'Purpose limitation for each category of data',
        'Which third parties process data, and where they are located',
        'That email addresses attached to tributes are never published'] },
      { heading: 'Rights and retention', points: [
        'How long each category is kept, and why',
        'How to request access, correction or deletion',
        'The distinction between deleting an account and withdrawing an archived tribute',
        'Governing law: the Nigeria Data Protection Act 2023, and the obligations it places on a data controller',
        'Cross-border transfer: donor and contributor data from Canada, the US and the UK is processed outside those countries, which must be disclosed and lawfully based',
        'How Canadian contributors\u2019 PIPEDA expectations and UK/EU GDPR rights are honoured in practice'] },
    ],
  },
  {
    slug: 'safeguarding',
    title: 'Child Safeguarding Policy',
    intro: 'How the foundation protects children in its scholarship, mentoring and outreach work.',
    urgency: 'Must be approved by qualified counsel before any volunteer is placed with a minor.',
    sections: [
      { heading: 'Screening and placement', points: [
        'Background checks required before contact with children',
        'Reference requirements for mentors and tutors',
        'Induction and training before placement'] },
      { heading: 'Conduct', points: [
        'The two-adult rule and prohibitions on unsupervised one-to-one contact',
        'Permitted communication channels between adults and minors',
        'Photography and consent for images of children',
        'Behaviour that results in immediate removal'] },
      { heading: 'Reporting and response', points: [
        'Who the designated safeguarding lead is, and how to reach them',
        'How a concern is raised, recorded and escalated',
        'Reporting obligations under the Child Rights Act 2003 and its domestication in the states where the foundation operates',
        'How overseas volunteers and trustees are screened to the same standard',
        'Support offered to a child who discloses'] },
    ],
  },
  {
    slug: 'donations',
    title: 'Donation Policy',
    intro: 'How gifts are received, designated, acknowledged and reported, in Nigeria and abroad.',
    urgency: 'Required before the first live transaction. The cross-border receipting position must be stated explicitly.',
    sections: [
      { heading: 'Receiving gifts', points: [
        'Accepted methods and the payment provider used',
        'That card details are handled by the provider and never by the foundation',
        'Minimum amounts and currency'] },
      { heading: 'Designation and use', points: [
        'The six funds and what each covers',
        'What happens when a fund is over-subscribed',
        'Administrative cost ratio and how it is calculated',
        'Conditions under which a gift is declined'] },
      { heading: 'Acknowledgement and reporting', points: [
        'Nigerian receipting and the foundation\u2019s tax status once CAC registration completes',
        'A plain statement that gifts from Canada, the US and the UK are NOT tax-receiptable, and why',
        'Whether a Canadian giving route exists, and its current status',
        'Refund and recurring-gift cancellation terms',
        'Annual reporting of income and programme expenditure, in naira with major-currency equivalents',
        'Donor recognition, and how to give anonymously'] },
    ],
  },
];
