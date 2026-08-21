import type { IconName } from '@/components/primitives/Icon';

/**
 * Phase 1 content. Shapes deliberately mirror the Sanity schemas in the
 * development plan, so Phase 2 is a data-source swap, not a rewrite.
 *
 * Detail copy describes the foundation's intent. It never invents
 * biographical facts — those wait for the family's own account.
 */

export type Pillar = {
  slug: string;
  title: string;
  tagline: string;
  blurb: string;
  icon: IconName;
  body: string[];
  practices: string[];
};

/** DECISION 4 — the draft's six pillars, including Character. */
export const pillars: Pillar[] = [
  {
    slug: 'faith',
    title: 'Faith',
    icon: 'cross',
    tagline: 'Know God. Walk faithfully.',
    blurb: 'A deep and unshakeable walk with God.',
    body: [
      'Faith was not a compartment of his life. By every account it was the frame everything else hung on — the classroom, the household, the pulpit and the quiet hours before dawn.',
      'The foundation carries this forward as practice rather than slogan: formation that treats belief as something lived, examined and handed on.',
    ],
    practices: [
      'Scripture study rooted in the text itself',
      'Formation that survives contact with real life',
      'Faith expressed through work, not apart from it',
    ],
  },
  {
    slug: 'education',
    title: 'Education',
    icon: 'book',
    tagline: 'Equip the mind. Expand possibility.',
    blurb: 'Equipping minds and shaping destinies.',
    body: [
      'He spent decades in classrooms and, later, at the head of schools. The conviction was plain: what a person learns changes what their life can hold.',
      'That belief is now a programme. Scholarships, supplies and tuition support go to students whose promise is real and whose means are not.',
    ],
    practices: [
      'Scholarships tied to promise and character',
      'Support that removes practical barriers',
      'Recognition of academic excellence',
    ],
  },
  {
    slug: 'character',
    title: 'Character',
    icon: 'shield',
    tagline: 'Build the person before the position.',
    blurb: 'Integrity, discipline and godly values.',
    body: [
      'The people who knew him tend to describe conduct before achievement — demanding about honesty, unimpressed by status.',
      'Character is a formal pillar because it is the thing most often left implicit, and therefore the thing most often lost between generations.',
    ],
    practices: [
      'Standards held consistently, not selectively',
      'Courage exercised at cost',
      'Humility that does not require diminishment',
    ],
  },
  {
    slug: 'leadership',
    title: 'Leadership',
    icon: 'users',
    tagline: 'Lead by serving and developing others.',
    blurb: 'Inspiring others to serve and lead with impact.',
    body: [
      'He led schools and congregations, but the record he left is mostly in people — those he trained, corrected, encouraged and sent out.',
      'The foundation treats leadership as something transferred rather than held.',
    ],
    practices: [
      'Mentoring relationships that outlast a programme',
      'Responsibility given before it feels earned',
      'Succession planned rather than improvised',
    ],
  },
  {
    slug: 'prayer',
    title: 'Prayer',
    icon: 'prayer',
    tagline: 'Stand in the gap.',
    blurb: 'A life anchored in prayer and dependence on God.',
    body: [
      'Those who lived near him remember the hours. Prayer was the least visible part of his work and, by many accounts, the largest.',
      'This pillar exists partly so that grandchildren and great-grandchildren can know a dimension of his life they may never have witnessed.',
    ],
    practices: [
      'Regular gatherings for intercession',
      'Prayer requests received and carried',
      'The discipline taught, not merely praised',
    ],
  },
  {
    slug: 'family-community',
    title: 'Family & Community',
    icon: 'family',
    tagline: 'Strengthen families. Build communities.',
    blurb: 'A devoted husband, father and builder of communities.',
    body: [
      'Seven children, and the generations that followed them. His household was the first place his convictions had to hold.',
      'When you build people, they build families. Strong families build communities. That sequence is the foundation\u2019s working theory of change.',
    ],
    practices: [
      'Support for vulnerable households',
      'Elder care and youth mentoring',
      'Community projects chosen with, not for, the community',
    ],
  },
];

export type Program = {
  slug: string;
  title: string;
  summary: string;
  icon: IconName;
  olive?: boolean;
  status: 'Active' | 'Flagship' | 'In development';
  body: string[];
  focus: string[];
};

export const programs: Program[] = [
  {
    slug: 'scholars',
    title: 'PK Shidali Scholars',
    icon: 'cap',
    olive: true,
    status: 'Flagship',
    summary: 'Scholarships and support for bright students to thrive and lead.',
    body: [
      'The signature programme. Support goes to students whose academic promise is demonstrable and whose circumstances would otherwise decide the outcome.',
      'Selection weighs character alongside results — a deliberate echo of how he assessed the students in front of him.',
    ],
    focus: [
      'Full and partial scholarships',
      'Tuition and examination fees',
      'Books, uniforms and supplies',
      'Academic excellence awards',
    ],
  },
  {
    slug: 'teacher-initiative',
    title: 'Shidali Teacher Initiative',
    icon: 'book',
    olive: true,
    status: 'In development',
    summary: 'Empowering teachers with training, resources and mentorship.',
    body: [
      'A teacher does not merely teach subjects. A teacher helps build people. That sentence is the whole programme.',
      'Because he spent most of his career as an educator, this has the clearest line back to his own practice — and the best chance of becoming something other institutions borrow.',
    ],
    focus: [
      'Mentoring practice',
      'Character formation in the classroom',
      'Identifying and developing potential',
      'Discipline without diminishment',
    ],
  },
  {
    slug: 'emerging-leaders',
    title: 'Emerging Leaders Program',
    icon: 'users',
    status: 'In development',
    summary: 'Developing young leaders of character and purpose.',
    body: [
      'A structured track that turns personal characteristics into a curriculum: integrity, courage, responsibility, communication, discipline and purpose.',
      'Participants are matched with mentors drawn from those he taught and those the foundation has since formed.',
    ],
    focus: [
      'Structured mentorship',
      'Public speaking and communication',
      'Service projects with real accountability',
      'Purpose and vocation',
    ],
  },
  {
    slug: 'faith-discipleship',
    title: 'Faith & Discipleship',
    icon: 'cross',
    status: 'Active',
    summary: 'Nurturing believers through Bible study, teaching and prayer.',
    body: [
      'Bible study, prayer, discipleship, marriage and family, and pastoral development — the areas in which he worked longest.',
      'Held in partnership with local congregations rather than in competition with them.',
    ],
    focus: [
      'Bible study groups',
      'Prayer gatherings',
      'Marriage and family teaching',
      'Pastoral development',
    ],
  },
  {
    slug: 'community-outreach',
    title: 'Community Outreach',
    icon: 'hands',
    olive: true,
    status: 'Active',
    summary: 'Serving communities with compassion and practical help.',
    body: [
      'This keeps the foundation from becoming purely commemorative or purely intellectual. It is the part that shows up.',
      'Projects are selected in consultation with the communities they serve, and reported on publicly.',
    ],
    focus: [
      'Education outreach',
      'Support for vulnerable families',
      'Elder care',
      'School improvement projects',
    ],
  },
];

export type Milestone = { icon: IconName; title: string; summary: string; open?: boolean };

export const milestones: Milestone[] = [
  { icon: 'seed', title: 'Early Life', summary: 'A foundation of faith and values.' },
  { icon: 'book', title: 'Teaching Career', summary: 'A passionate educator shaping young minds.' },
  { icon: 'cap', title: 'Headmaster & Founder', summary: 'Building institutions of excellence and discipline.' },
  { icon: 'cross', title: 'Pastoral Ministry', summary: 'Preaching the Gospel and shepherding God\u2019s people.' },
  { icon: 'family', title: 'Family Legacy', summary: 'A devoted husband, father and grandfather.' },
  { icon: 'star', title: 'The Legacy Continues', summary: 'Generations still being built.', open: true },
];

export type ArchiveTile = { icon: IconName; title: string; summary: string; href: string };

export const archiveTiles: ArchiveTile[] = [
  { icon: 'mic', title: 'Sermons', summary: 'Recorded messages of faith.', href: '/archive/sermons' },
  { icon: 'photo', title: 'Photo Gallery', summary: 'Moments that tell the story.', href: '/archive/photos' },
  { icon: 'doc', title: 'Documents', summary: 'Letters, writings, official records.', href: '/archive/documents' },
  { icon: 'book', title: 'Bible Notes', summary: 'Study notes and teachings.', href: '/archive/documents' },
  { icon: 'video', title: 'Tribute Videos', summary: 'Voices celebrating his life.', href: '/archive/video' },
];

export type InvolveCard = {
  icon: IconName; title: string; summary: string; cta: string; href: string; colour: string;
};

export const involveCards: InvolveCard[] = [
  { icon: 'hands', title: 'Volunteer', summary: 'Give your time and make a difference.',
    cta: 'Get involved', href: '/get-involved', colour: 'var(--olive)' },
  { icon: 'users', title: 'Mentor', summary: 'Guide and inspire the next generation.',
    cta: 'Become a mentor', href: '/get-involved', colour: 'var(--navy-800)' },
  { icon: 'heart', title: 'Partner', summary: 'Partner with us to expand the impact.',
    cta: 'Partner with us', href: '/contact', colour: 'var(--navy-600)' },
  { icon: 'star', title: 'Donate', summary: 'Your giving helps build the legacy.',
    cta: 'Donate now', href: '/give', colour: 'var(--purple)' },
];

export type Tribute = {
  id: string;
  name: string;
  relationship: string;
  body: string;
  sample?: boolean;
  title?: string;
  years?: string;
  location?: string;
  taught?: string;
  /** Marks a submission that arrived as audio or video, for the media filters. */
  hasAudio?: boolean;
  hasVideo?: boolean;
  /** External link (YouTube/Vimeo/Drive) rendered on the detail page. */
  videoUrl?: string;
  featured?: boolean;
};

/**
 * Legacy Wall messages: a lighter-weight contribution than a full tribute.
 * Same document type in the CMS, distinguished by `kind`, because a short
 * message still needs the same consent record and the same moderation gate.
 */
export type WallMessage = { id: string; name: string; body: string; sample?: boolean };

export const wallMessages: WallMessage[] = [
  { id: 'w1', sample: true, name: '[Sample] Esther W.',
    body: 'Placeholder text. Wall messages are one or two sentences — gratitude, remembrance, a line someone wants on the record.' },
  { id: 'w2', sample: true, name: '[Sample] James M.',
    body: 'Placeholder text. Shorter than a tribute, and easier to leave from a phone.' },
  { id: 'w3', sample: true, name: '[Sample] Naomi K.',
    body: 'Placeholder text. Still moderated, still consented to, still permanent.' },
];

/** Public domain, so it reproduces without licensing. */
export const wallScripture = {
  text: 'Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.',
  reference: 'Joshua 1:9 (KJV)',
};

/**
 * Fallback tributes, used only when the CMS returns nothing.
 *
 * Deliberately empty. The badged sample records that lived here were cleared
 * once real tributes existed in Sanity — fabricated testimony has no place on
 * a memorial, and an empty state is more honest than a plausible invention.
 * With this and the CMS both empty, /tributes renders its "Nothing here yet"
 * state, which is correct.
 */
export const featuredTributes: Tribute[] = [];

export const relationships = [
  'Family', 'Former Student', 'Teacher or Colleague', 'Church Member',
  'Pastor or Minister', 'Friend', 'Community', 'Grandchild',
];

export const heroCopy = {
  eyebrow: 'Continuing the Legacy of',
  /** Two stacked lines: line one ivory, line two gold (per the hero mockup). */
  nameLine1: 'Rev. Paul',
  nameLine2: 'Kadir Shidali',
  lede:
    'A life devoted to God and dedicated to building people through faith, education, leadership, prayer and service.',
};

export const signatureQuote =
  'The teacher has finished his lesson. The prayer warrior has finished his watch. But the seed remains, the faith continues, and God remains our Mighty Fortress.';
