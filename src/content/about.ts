import type { IconName } from '@/components/primitives/Icon';

/**
 * About-page content.
 *
 * The hard part of this page is honesty. The foundation is new: there is no
 * registration number yet, no published board, no annual report. Writing
 * around that would produce the tone of an established institution and would
 * be false. So the transparency section states the real status of each
 * commitment instead, and the page says plainly what stage this is at.
 */

export const thesis = {
  heading: 'Not a memorial. An institution.',
  body: [
    'A memorial records that someone lived. This foundation exists to demonstrate that what he lived for is still being carried forward.',
    'He was, above everything else, a builder of people. As a teacher he built minds. As a headmaster he built students and institutions. As a pastor he built believers. As a father and grandfather he built a family that has now outlived him.',
    'That gives the organisation a working theory of change, and it is the sentence the whole foundation rests on:',
  ],
  pullQuote:
    'When you build people, they build families. Strong families build communities. Strong communities build generations.',
};

export type Value = { icon: IconName; title: string; body: string };

export const values: Value[] = [
  { icon: 'shield', title: 'Say the true thing',
    body: 'Including when it is inconvenient. If a programme is not running, this site says so. If a gift is not tax-receiptable, we say that before you give, not after.' },
  { icon: 'users', title: 'Build people, not monuments',
    body: 'Every pound and naira should end up in a person — a student, a teacher, a mentee — rather than in commemoration of the man himself.' },
  { icon: 'seed', title: 'Depth before breadth',
    body: 'Five programmes run properly beat twenty announced. Growth follows capacity, not ambition.' },
  { icon: 'family', title: 'With, not for',
    body: 'Community projects are chosen in consultation with the communities they serve. He never assumed he knew better than the people in front of him.' },
];

export type Commitment = {
  title: string;
  detail: string;
  status: 'live' | 'progress' | 'pending';
  statusLabel: string;
};

/**
 * The transparency ledger. Status is deliberately visible and unflattering
 * where it should be — a young foundation earns trust by being accurate about
 * its stage, not by looking finished.
 */
export const commitments: Commitment[] = [
  { title: 'Legal registration', status: 'progress', statusLabel: 'In progress',
    detail: 'Incorporation with the Corporate Affairs Commission is underway. The registration number will be published here and in the footer once issued.' },
  { title: 'Board of trustees', status: 'progress', statusLabel: 'Being formed',
    detail: 'Names, roles and any conflicts of interest will be published in full. Family membership of the board will be stated rather than obscured.' },
  { title: 'Constitution and bylaws', status: 'pending', statusLabel: 'Not yet drafted',
    detail: 'A plain-language summary will sit alongside the full document.' },
  { title: 'Child safeguarding policy', status: 'pending', statusLabel: 'Required before placement',
    detail: 'Must be approved by qualified counsel. No volunteer works with a child until it exists and checks are complete.' },
  { title: 'Privacy policy', status: 'pending', statusLabel: 'Required before launch',
    detail: 'Must address the Nigeria Data Protection Act 2023 and the cross-border transfer of contributor data from Canada, the US and the UK.' },
  { title: 'Donation policy', status: 'pending', statusLabel: 'Required before first gift',
    detail: 'Including a plain statement that gifts from outside Nigeria are not tax-receiptable, and why.' },
  { title: 'Annual report and accounts', status: 'pending', statusLabel: 'From first full year',
    detail: 'Income, programme expenditure and administrative ratio, in naira with major-currency equivalents.' },
  { title: 'Independent audit', status: 'pending', statusLabel: 'As the organisation matures',
    detail: 'Introduced once annual income justifies the cost. Until then, accounts are published unaudited and labelled as such.' },
];

export const stage = {
  heading: 'Where this actually stands',
  body: [
    'The foundation was formed in 2026, following his passing in August of that year. It is at the beginning, not the middle.',
    'Two of the five programmes are running. Registration is in progress. The board is being formed. The archive holds almost nothing yet, because digitising a life takes longer than building a website.',
    'We would rather you knew that before you gave your money or your time. The alternative — a site that reads as though the institution already exists — would be a poor way to honour a man remembered for insisting on honesty.',
  ],
};

export const funding = {
  heading: 'Where the money goes',
  body: 'Gifts are designated to one of six funds, and the foundation reports against them. Administrative cost is kept low by design: for now the work is done by family and volunteers, not salaried staff. When that changes, the ratio will be published rather than absorbed quietly.',
};
