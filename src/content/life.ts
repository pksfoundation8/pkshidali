import type { IconName } from '@/components/primitives/Icon';

/**
 * The biography.
 *
 * This is the family's to write, and nobody else's. Inventing dates, schools
 * or congregations for a real man would be the single worst thing this
 * codebase could do — a plausible fabrication is harder to correct later than
 * an obvious gap.
 *
 * So each section carries the questions needed to write it. Until the family's
 * text arrives, the page works as the gathering worksheet; afterwards it
 * becomes the container for what they wrote. `body` stays empty until then.
 */

export type LifeSection = {
  slug: string;
  title: string;
  standfirst: string;
  /** What to collect. Shown until `body` is filled in the CMS. */
  prompts: string[];
  body?: string[];
};

export const lifeSections: LifeSection[] = [
  {
    slug: 'early-years', title: 'Early Years',
    standfirst: 'Birth, upbringing, and the household that formed him.',
    prompts: [
      'Where and into what circumstances was he born on 4 December 1933?',
      'Who raised him, and what did that household value?',
      'What was his own schooling like, and who paid for it?',
      'What was happening around him — locally and nationally — as he grew up?',
    ],
  },
  {
    slug: 'the-teacher', title: 'The Teacher',
    standfirst: 'The classroom years, and what students carried out of them.',
    prompts: [
      'Which schools, and in what years?',
      'What subjects did he teach?',
      'How did students describe his classroom — then, and decades later?',
      'What did he do with a student who was struggling?',
    ],
  },
  {
    slug: 'the-headmaster', title: 'The Headmaster',
    standfirst: 'Schools led or founded, and what changed under him.',
    prompts: [
      'Which schools did he lead or found, and when?',
      'What was the school like before, and after?',
      'What standards did he insist on, and what did he refuse to compromise?',
      'Are appointment letters, records or photographs preserved?',
    ],
  },
  {
    slug: 'the-pastor', title: 'The Pastor',
    standfirst: 'Congregations served and believers shepherded.',
    prompts: [
      'Which congregations did he serve, and over what period?',
      'When was he ordained, and by whom?',
      'What did he build that outlasted his tenure?',
      'Who did he train and send out?',
    ],
  },
  {
    slug: 'the-preacher', title: 'The Preacher',
    standfirst: 'What he preached, and how it landed.',
    prompts: [
      'What did he preach about most often?',
      'Are there recordings, notes or outlines?',
      'How would someone describe hearing him for the first time?',
      'Which sermon do people still bring up?',
    ],
  },
  {
    slug: 'the-bible-student', title: 'The Bible Student',
    standfirst: 'A lifetime in the text itself.',
    prompts: [
      'What did his study habits look like — when, where, for how long?',
      'Are his annotated Bibles preserved, and where?',
      'Which passages did he return to?',
      'Did he keep notebooks or commentaries of his own?',
    ],
  },
  {
    slug: 'the-prayer-warrior', title: 'The Prayer Warrior',
    standfirst: 'The least visible part of his work, and by many accounts the largest.',
    prompts: [
      'When and where did he pray?',
      'Who did he pray for, and did they know?',
      'What did family members overhear through a door?',
      'Did anyone ever tell him what his prayers had meant?',
    ],
  },
  {
    slug: 'husband-and-father', title: 'Husband & Father',
    standfirst: 'The household where his convictions had to hold first.',
    prompts: [
      'When did he marry, and to whom? How did they meet?',
      'What was the household like day to day?',
      'What did each of the seven children learn from him?',
      'Where did he and his wife differ, and how did they handle it?',
    ],
  },
  {
    slug: 'grandfather', title: 'Grandfather',
    standfirst: 'A different man, by most accounts, in the last chapters.',
    prompts: [
      'How was he different as a grandfather than as a father?',
      'What do the grandchildren remember specifically?',
      'What did he pass down deliberately, and what by accident?',
    ],
  },
  {
    slug: 'courage-and-conviction', title: 'Courage & Conviction',
    standfirst: 'The moments that cost him something.',
    prompts: [
      'When did he stand at real cost?',
      'What did he refuse to do?',
      'Who witnessed it, and can they tell it?',
    ],
  },
  {
    slug: 'character', title: 'Character',
    standfirst: 'The qualities people name before they name achievements.',
    prompts: [
      'Which qualities do people name unprompted?',
      'What stories illustrate them rather than assert them?',
      'Where did he fall short? An honest portrait is a more useful inheritance than a flawless one.',
    ],
  },
  {
    slug: 'final-chapter', title: 'His Final Chapter',
    standfirst: 'The later years and his passing in August 2026.',
    prompts: [
      'How were his later years spent?',
      'What did he say near the end that should be recorded?',
      'How does the family want this told — and how much of it is public?',
    ],
  },
  {
    slug: 'legacy-continues', title: 'The Legacy Continues',
    standfirst: 'Why a foundation rather than a headstone.',
    prompts: [
      'What did the family decide to build, and why?',
      'Why a foundation rather than a memorial?',
      'What does success look like in twenty years?',
    ],
  },
];

export const characterTraits: { icon: IconName; label: string }[] = [
  { icon: 'heart', label: 'Caring' },
  { icon: 'family', label: 'Loving' },
  { icon: 'prayer', label: 'Humble' },
  { icon: 'users', label: 'Respectful' },
  { icon: 'shield', label: 'Courageous' },
  { icon: 'star', label: 'Dedicated' },
  { icon: 'cross', label: 'Faithful' },
  { icon: 'cap', label: 'Disciplined' },
];

export const lifeIntro = {
  roles: [
    'Teacher', 'Headmaster', 'Pastor', 'Preacher', 'Prayer Warrior',
    'Bible Student', 'Husband', 'Father', 'Grandfather',
  ],
  note:
    'The biography below is written by his family, not by anyone else. Until their account is complete, each section shows the questions it needs answered — so this page serves as the gathering worksheet as well as the eventual home for the writing.',
};
