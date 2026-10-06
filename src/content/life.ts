import type { IconName } from '@/components/primitives/Icon';

/**
 * The biography.
 *
 * This is the family's account, supplied by them and reproduced as written.
 * Do not "improve" the dates or wording here without checking with the family —
 * a plausible correction to a real man's life is harder to undo than a gap.
 *
 * Text may use **double asterisks** for emphasis; see components/life/Blocks.
 */

/** A paragraph, an emphasised line, a short list, or a set of titled steps. */
export type Block =
  | string
  | { strong: string }
  | { list: string[] }
  | { steps: [title: string, text: string][] };

export type LifeSection = {
  slug: string;
  title: string;
  /** One line under the title. Optional — omit rather than invent one. */
  standfirst?: string;
  /** What to collect, for a section that has not been written yet. */
  prompts?: string[];
  body?: Block[];
};

export const lifeSections: LifeSection[] = [
  {
    slug: 'a-life-received', title: 'A Life Received',
    body: [
      'Paul Kadir Shidali was born on **December 4, 1933**, at **Emi-Aguye in Bassa Division of Benue**, to **Aguye Shidali** and **Nashe Shidali**.',
      'He was born into a world very different from the one he would eventually leave behind. His lifetime would span more than nine decades of social, educational, religious, political, and technological change.',
      'The environment of his early years helped form qualities that would remain visible throughout his life: discipline, resilience, responsibility, respect for learning, and the ability to persevere through changing circumstances.',
      'Those early years were the beginning of a journey that would eventually take him from village life to the classroom, from public service to pastoral leadership, from a Muslim background to personal Christian faith, and from a small gathering in a rented living room to decades of ministry in the Apostolic Faith Church.',
    ],
  },
  {
    slug: 'a-life-formed-through-education', title: 'A Life Formed Through Education',
    body: [
      'Education became one of the earliest defining structures of his life.',
      'Between **1943 and 1949**, he attended primary school.',
      'He later pursued teacher training and, between **1962 and 1969**, obtained his **Grade III and Grade II Teaching Certificates**.',
      'His commitment to learning continued well into adulthood. In **1982**, he studied at the **University of Ilorin**, where he obtained an **Associate Certificate in Education**.',
      'For him, education was never only about acquiring certificates.',
      'Knowledge carried responsibility.',
      'What a person learned should improve not only the learner, but also the lives of others.',
      'That conviction would become visible in the career he chose.',
    ],
  },
  {
    slug: 'a-teacher-at-heart', title: 'A Teacher at Heart',
    body: [
      'In **1963**, Paul Kadir Shidali began his professional life as a **Primary School Teacher**.',
      'He taught in **Akabe, Jebba, and Ilorin**, serving as a classroom teacher until **1969**.',
      'Teaching was one of the important foundations of his life. It allowed him to contribute directly to the formation of children, combining instruction with discipline, guidance, and example.',
      'The role of teacher would remain part of his identity even after he moved into other responsibilities.',
      'Later, as a father, pastor, headmaster, and church leader, he continued doing essentially the same work at a deeper level:',
      { strong: 'helping people learn, grow, understand, and mature.' },
    ],
  },
  {
    slug: 'marriage-family-and-responsibility', title: 'Marriage, Family, and Responsibility',
    body: [
      'On **December 23, 1965**, Paul Kadir Shidali married his beloved wife, **Phebean Zuyali Shidali**, at **Akabe, Bassa Nge, Benue State, now Kogi State**.',
      'Their marriage became one of the central structures of his life.',
      'Together they were blessed with **seven children**, and in time, with grandchildren.',
      'Family was not merely something he belonged to. It was something he believed had to be built, nurtured, protected, and guided.',
      'As a husband and father, he understood responsibility broadly.',
      'It meant provision, but it also meant prayer.',
      'It meant discipline, but also encouragement.',
      'It meant teaching children how to live, but also challenging them to develop their own relationship with God.',
      "He consistently emphasized that his children should not depend only on another person's faith.",
      { list: [
        'They should learn to know God personally.',
        'They should pray.',
        "They should seek God's direction.",
        'They should live responsibly.',
        'They should understand that every life carries purpose.',
      ] },
      'For him, success without spiritual grounding was incomplete.',
      'He wanted his children to become responsible, educated, purposeful people—but above all, people who knew God for themselves.',
    ],
  },
  {
    slug: 'from-a-muslim-background-to-christian-faith', title: 'From a Muslim Background to Christian Faith',
    body: [
      "One of the most important dimensions of Paul Kadir Shidali's story was his spiritual journey.",
      'He came from a **Muslim background**.',
      'During an important period of his early life, he lived with his uncle, **Mr. Agbem**, whose influence exposed him to Christianity and contributed to his acceptance of Jesus Christ.',
      'That early influence became part of a longer spiritual journey.',
      'When he later came to **Jebba**, the search became personal.',
      'In **1970**, under the ministry of **Brother Joseph Adenola of blessed memory**, he experienced salvation.',
      'This became a defining turning point in his life.',
      'Christianity was no longer merely something he had encountered through another person’s influence.',
      'Faith became personal.',
      'His relationship with God became a governing principle that would increasingly shape his decisions, his family, his work, and eventually his entire vocation.',
      'His own spiritual journey helps explain why he later placed such emphasis on one message to his children and others:',
      { strong: 'Know God for yourself.' },
      'His life demonstrated that a person may inherit a starting point, but eventually must take personal responsibility for conviction, faith, and direction.',
    ],
  },
  {
    slug: 'public-service-and-growing-responsibility', title: 'Public Service and Growing Responsibility',
    body: [
      'In **1970**, his professional journey moved beyond classroom teaching when he began working with the **Kwara State Census Office**.',
      'He later served with the **Kwara State Ministry of Health**, and by **1976** was working as a **Supervising Officer**.',
      'These years expanded his experience beyond education and placed him within public administration and leadership.',
      'Yet at the same time, another area of his life was growing rapidly.',
      'His Christian faith was becoming ministry.',
      'And before long, professional security and spiritual responsibility would meet at a decisive crossroads.',
    ],
  },
  {
    slug: 'the-apostolic-faith-work-in-ilorin', title: 'The Beginning of the Apostolic Faith Work in Ilorin',
    body: [
      'The Apostolic Faith work in **Ilorin** began in a humble way in **January 1973**.',
      'The first meeting was held in the living room of Paul K. Shidali’s rented apartment on **Ibrahim Taiwo Road, Ilorin**.',
      'His wife and invited guests were present.',
      'There was no large auditorium.',
      'There was no established congregation.',
      'There was simply a home, a few people, faith, prayer, and willingness.',
      'As attendance increased, a simple building was acquired to provide more space.',
      'Between **January 1974 and May 1975**, the authorities of **Ilorin Local Government** approved the use of **United Primary School, Ibrahim Taiwo Road**, for religious activities.',
      'The congregation moved there, and the work continued to grow.',
      'Later in **1975**, the church moved to what became its permanent place of worship as the congregation increased.',
      'What began in a family living room had become an established work.',
      'This chapter of his life reveals one of the most enduring principles of his journey:',
      { strong: 'He was willing to begin small.' },
      'He did not wait for perfect conditions.',
      'He used what he had.',
      'He opened his home.',
      'He gave his time.',
      'He created room for something greater than himself to grow.',
    ],
  },
  {
    slug: 'a-costly-decision-of-faith', title: 'A Costly Decision of Faith',
    body: [
      'One of the clearest demonstrations of his conviction came in **1976**.',
      'At the time, he was working with the **Kwara State Ministry of Health** and was transferred to **Benue State**.',
      'The transfer presented him with a serious decision.',
      'Accepting it would mean leaving Ilorin at a critical stage in the development of the Apostolic Faith work.',
      'He chose instead to resign from the Ministry of Health so that he could remain in Ilorin and continue the pastoral responsibility he believed God had placed before him.',
      'This was not an easy or symbolic decision.',
      'It carried real financial implications.',
      'He left a government position that came with retirement benefits and accepted work in a private school without comparable retirement benefits.',
      'He did so trusting that God would provide for his needs.',
      'That decision became one of the clearest expressions of his faith.',
      'It showed that for him, conviction was not merely something spoken from a pulpit.',
      'Conviction had to become visible in choices.',
      'At a critical moment, he placed calling above professional security.',
    ],
  },
  {
    slug: 'return-to-education-and-school-leadership', title: 'Return to Education and School Leadership',
    body: [
      'Following his resignation from the Ministry of Health, he returned to education and served as **Headmaster of Chapel Primary School**.',
      'In this role, he carried responsibilities beyond classroom teaching.',
      'He was responsible for administration, discipline, teacher development, organization, and the education of the children entrusted to the school.',
      'His career therefore came full circle.',
      'He began as a teacher and later became a headmaster, carrying broader responsibility for both people and institution.',
      'He continued in professional service until his retirement in **1996**.',
      'Across the different stages of his working life—as teacher, public servant, supervising officer, and headmaster—the common thread was service and the development of others.',
    ],
  },
  {
    slug: 'part-time-pastor-and-growing-ministry-leadership', title: 'Part-Time Pastor and Growing Ministry Leadership',
    body: [
      'From **1973 to 1982**, Paul Kadir Shidali served as a **part-time pastor**, carrying ministry alongside his professional responsibilities.',
      'In **1982**, he began serving as **Assistant District Overseer**.',
      'His responsibility within the church continued to grow.',
      'In **1992**, he obtained his **ministerial credentials** in the Apostolic Faith Church.',
      'In **1995**, he was **ordained as a minister**.',
      'These milestones represented the formal recognition of a ministry that had already been developing over many years.',
      'He had opened his home for church meetings.',
      'He had served as a part-time pastor.',
      'He had helped nurture the Ilorin work through its early stages.',
      'He had accepted increasing leadership responsibility.',
      'By the time of his ordination, ministry was not new to him. It had already become deeply woven into his life.',
    ],
  },
  {
    slug: 'full-time-ministry', title: 'Full-Time Ministry',
    body: [
      'In **1996**, after retiring from professional service, Rev. Paul Kadir Shidali entered **full-time ministry with the Apostolic Faith Church**.',
      'From **1996 until 2022**, he devoted himself fully to Christian service.',
      'His ministry included pastoral leadership, teaching, prayer, spiritual guidance, counseling, encouragement, and the responsibilities entrusted to him within the church.',
      'His years of full-time ministry were therefore not the beginning of his service to God.',
      'They were the continuation and deepening of a journey that had already stretched across decades.',
      'The teacher had become pastor.',
      'The classroom had expanded into congregation.',
      'The discipline of education had become the discipline of spiritual formation.',
      'And the man who had once opened his living room for a handful of people had become a recognized minister and church leader.',
      'In **2022**, after decades of service, he retired from full-time ministry.',
    ],
  },
  {
    slug: 'a-life-that-became-wisdom', title: 'A Life That Became Wisdom',
    body: [
      'As Rev. Shidali grew older, his contribution gradually changed.',
      'The emphasis moved from building and leading toward guiding and transferring.',
      'By then, his life contained decades of accumulated experience:',
      { list: [
        'education', 'teaching', 'public service', 'marriage', 'fatherhood', 'ministry',
        'leadership', 'sacrifice', 'hardship', 'prayer', 'service',
      ] },
      'Experience gradually became wisdom.',
      'His children, grandchildren, relatives, church members, and others received different aspects of that inheritance.',
      { list: [
        'Some received his teaching.',
        'Some received his correction.',
        'Some received his prayers.',
        'Some received his counsel.',
        'Some learned from his discipline.',
        'Some witnessed his willingness to sacrifice.',
        'Some were influenced by his commitment to God.',
        'Some simply observed the way he lived.',
      ] },
      'Together, these became the deeper legacy of his life.',
    ],
  },
  {
    slug: 'what-he-placed-in-others', title: 'What He Placed in Others',
    body: [
      'The greatest inheritance Rev. Paul Kadir Shidali left cannot be measured only in possessions.',
      'Much of it lives inside people.',
      'Through his years as a teacher, he transferred knowledge.',
      'Through fatherhood, he transferred values.',
      'Through ministry, he transferred faith.',
      'Through sacrifice, he demonstrated conviction.',
      'Through old age, he transferred wisdom.',
      'He consistently emphasized:',
      { list: [
        'faith in God', 'prayer', 'obedience', 'education', 'discipline', 'family responsibility',
        'service', 'integrity', 'purpose', 'consciousness of eternity',
      ] },
      'This is why one of the most important questions his life leaves behind is not merely:',
      { strong: 'What did he leave us?' },
      'It is:',
      { strong: 'What did he leave within us?' },
      'And what will we do with it?',
    ],
  },
  {
    slug: 'the-final-mile', title: 'The Final Mile',
    body: [
      'In **early 2026**, his wife began to notice changes in his physical health.',
      'The family responded by providing medical attention and practical support.',
      'In **May 2026**, he experienced an illness that lasted for approximately three weeks and prevented him from attending church services.',
      'During this period, he repeatedly told his wife:',
      { strong: '“I am going home.”' },
      'At the time, she did not fully understand what he meant.',
      'He recovered, regained his strength, and returned to attending church services.',
      'Yet even after his recovery, he continued telling his wife that he wanted to go home.',
      'Only later, after his passing, did the family understand those words differently.',
      'In light of the faith that had governed his life, they came to see them as the words of a man who may have been preparing inwardly for the completion of his earthly journey and the hope of his eternal home with the Lord.',
    ],
  },
  {
    slug: 'august-3-2026', title: 'August 3, 2026 — A Final Written Scripture',
    body: [
      'On **August 3, 2026**, Rev. Paul Kadir Shidali wrote down the Bible reference **John 14:12**.',
      'This became the last Scripture reference he is known to have written.',
      'John 14:12 speaks about faith in Christ and the continuation of His works through those who believe.',
      'For the family, the reference carries special meaning.',
      'Rev. Shidali had spent much of his life teaching, serving, praying, leading, and passing faith to others.',
      'Now, near the end of his earthly journey, the Scripture he wrote pointed toward continuation.',
      'The worker would not always remain.',
      'But the work of God would continue.',
      'The teacher would eventually be silent.',
      'But what had been taught could continue through others.',
      'The father would eventually depart.',
      'But the faith, principles, and responsibility placed in the next generation could continue.',
      'Read within the wider context of **John 14**, the passage also gives the family deep Christian assurance.',
      'Jesus speaks in that chapter not only about works and faith, but about preparing a place and receiving His own.',
      'For the family, these promises reinforce the faith by which Papa lived:',
      { strong: 'his earthly assignment has been completed, and he has gone home to be with God.' },
      'The phrase he had repeatedly spoken—',
      { strong: '“I am going home”' },
      '—therefore took on a profound meaning after his passing.',
    ],
  },
  {
    slug: 'august-4-2026', title: 'August 4, 2026',
    body: [
      'On **August 4, 2026**, the day after writing John 14:12, he became ill after taking breakfast.',
      'Medical attention was provided.',
      'Those who were around him during this period remembered his gratitude.',
      'He thanked God.',
      'He also expressed appreciation to those who were caring for him.',
      'Even in physical weakness, gratitude remained part of his response.',
      'The family continued to support and care for him through the final days of his earthly life.',
    ],
  },
  {
    slug: 'august-16-2026', title: 'August 16, 2026 — An Earthly Journey Completed',
    body: [
      'On **August 16, 2026**, at approximately **3:05 p.m. in Ilorin, Nigeria**, Rev. Paul Kadir Shidali completed his earthly journey at the age of **92**.',
      'His passing closed a remarkable chapter that had begun in Emi-Aguye more than nine decades earlier.',
      'Between those two dates lay a lifetime of:',
      { list: [
        'learning', 'teaching', 'marriage', 'fatherhood', 'public service', 'salvation',
        'church planting', 'pastoral leadership', 'sacrifice', 'ministry', 'prayer', 'wisdom',
        'generational transfer',
      ] },
      'His death brought a real and painful separation to those who loved him.',
      'His familiar presence was gone.',
      'His voice could no longer be heard in the same way.',
      'The place he occupied in family life had changed permanently.',
      'Yet the Christian faith that governed his life gives his family a deeper assurance.',
      'His earthly work is complete.',
      'The journey he repeatedly described as “going home” has, in the family’s faith, reached its destination.',
      'He has gone to be with the Lord he served.',
    ],
  },
  {
    slug: 'his-light-continues', title: 'His Light Continues',
    body: [
      'The meaning of Rev. Paul Kadir Shidali’s life cannot be contained between **December 4, 1933 and August 16, 2026**.',
      'A life continues in many ways through what it deposits in others.',
      'His family remains.',
      'His seven children carry his story.',
      'His grandchildren inherit both the memory of the man and the responsibility of the values he tried to pass forward.',
      'Those he taught carry something of his knowledge.',
      'Those he led carry something of his example.',
      'Those he prayed for carry memories of his spiritual concern.',
      'The Apostolic Faith work in Ilorin remains part of the testimony of a man who once opened the living room of a rented apartment and made room for the work of God.',
      'His 1976 decision remains a testimony that faith sometimes requires sacrifice.',
      'His career remains a testimony to the power of education.',
      'His ministry remains a testimony to service.',
      'His final words remain a reminder that earthly life eventually reaches a horizon.',
      'And John 14:12 remains a challenge that the work must continue through those who remain.',
    ],
  },
  {
    slug: 'the-responsibility-now-belongs-to-us', title: 'The Responsibility Now Belongs to Us',
    body: [
      'For many years, Rev. Shidali carried responsibilities for his family, church, and community.',
      'Now those responsibilities have changed hands.',
      'The family must decide what to do with what he placed within them.',
      { list: [
        'Will prayer continue?',
        'Will faith remain personal?',
        'Will education continue to matter?',
        'Will family unity be protected?',
        'Will the next generation understand where it came from?',
        'Will service remain more important than status?',
        'Will conviction continue to shape decisions?',
        'Will his children and grandchildren know God for themselves?',
      ] },
      'These questions are now part of his legacy.',
      'To honor his life is therefore more than remembering him.',
      'It is to allow the best of what he represented to continue.',
    ],
  },
  {
    slug: 'his-life-in-perspective', title: 'His Life in Perspective',
    body: [
      'Rev. Paul Kadir Shidali’s journey can be summarized this way:',
      { steps: [
        ['Life Received', 'He was born into a family, community, and generation.'],
        ['Life Formed', 'Education, responsibility, and experience shaped him.'],
        ['Life Engaged', 'He worked as teacher, public servant, supervising officer, and headmaster.'],
        ['Life Joined', 'He married Phebean Zuyali Shidali and helped build a family across generations.'],
        ['Life Found', 'From a Muslim background, through spiritual influence and personal searching, he found salvation in Christ.'],
        ['Life Given', 'He opened his home, served as pastor, and helped build the Apostolic Faith work in Ilorin.'],
        ['Life Sacrificed', 'He gave up professional security when conviction required him to remain with the work he believed God had entrusted to him.'],
        ['Life Matured', 'He grew into pastoral leadership, received ministerial credentials, was ordained, and entered full-time ministry.'],
        ['Life Transferred', 'He passed faith, knowledge, values, prayer, and wisdom to others.'],
        ['Life Released', 'His final months revealed a man gradually approaching the end of his earthly journey.'],
        ['Light Continued', 'His physical presence ended, but the fruit of his life continues through those who remain.'],
      ] },
    ],
  },
];

/** Opening of the page, above the accordion. */
export const lifeIntro = {
  roles: [
    'Teacher', 'Headmaster', 'Pastor', 'Preacher', 'Writer', 'Prayer Warrior',
    'Bible Student', 'Husband', 'Father', 'Grandfather',
  ],
  opening: [
    'Rev. Paul Kadir Shidali lived a long and purposeful life shaped by education, responsibility, family, faith, sacrifice, ministry, and service to others.',
    'His story was not one of sudden prominence. It was a life built gradually—through learning, work, conviction, perseverance, and a willingness to serve faithfully with whatever was in his hands.',
    'He was a teacher before he became a pastor. He was a husband and father before he became a church leader. He knew public service, professional responsibility, sacrifice, uncertainty, and the demands of ministry. He spent decades building, teaching, praying, leading, and guiding others.',
    'By the time his earthly journey ended at the age of 92, his life had become more than a collection of dates and accomplishments. It had become an inheritance carried by his wife, children, grandchildren, church family, and the many people whose lives he touched.',
  ],
  patternLead: 'His journey can be understood through a simple pattern:',
  pattern: [
    'Life Received', 'Life Formed', 'Life Engaged', 'Life Found', 'Life Given',
    'Life Sacrificed', 'Life Matured', 'Life Transferred', 'Life Released', 'Light Continued',
  ],
};

/** Dated journey, shown below the accordion. */
export const lifeJourney: { when: string; what: string }[] = [
  { when: 'December 4, 1933', what: 'Born at Emi-Aguye, Bassa Division of Benue, to Aguye Shidali and Nashe Shidali.' },
  { when: '1943–1949', what: 'Attended primary school.' },
  { when: '1962–1969', what: 'Completed teacher training and obtained Grade III and Grade II Teaching Certificates.' },
  { when: '1963–1969', what: 'Worked as a Primary School Teacher in Akabe, Jebba, and Ilorin.' },
  { when: 'December 23, 1965', what: 'Married Phebean Zuyali Shidali at Akabe, Bassa Nge, Benue State, now Kogi State.' },
  { when: '1970', what: 'Experienced salvation at Jebba under the ministry of Brother Joseph Adenola.' },
  { when: '1970', what: 'Began public service with the Kwara State Census Office and later the Ministry of Health.' },
  { when: 'January 1973', what: 'The Apostolic Faith work in Ilorin began in his rented apartment on Ibrahim Taiwo Road.' },
  { when: '1973–1982', what: 'Served as a part-time Pastor.' },
  { when: 'January 1974–May 1975', what: 'The growing congregation worshipped at United Primary School, Ibrahim Taiwo Road, with approval from Ilorin Local Government.' },
  { when: '1975', what: 'The congregation moved to its permanent place of worship.' },
  { when: '1976', what: 'Resigned from the Kwara State Ministry of Health following a transfer to Benue State so that he could remain committed to the Apostolic Faith work in Ilorin.' },
  { when: '1976', what: 'Returned to education and served as Headmaster of Chapel Primary School.' },
  { when: '1982', what: 'Obtained an Associate Certificate in Education from the University of Ilorin.' },
  { when: '1982', what: 'Began serving as Assistant District Overseer.' },
  { when: '1992', what: 'Obtained ministerial credentials in the Apostolic Faith Church.' },
  { when: '1995', what: 'Ordained as a minister in the Apostolic Faith Church.' },
  { when: '1996', what: 'Retired from professional service and entered full-time ministry.' },
  { when: '1996–2022', what: 'Served in full-time Christian ministry with the Apostolic Faith Church.' },
  { when: '2022', what: 'Retired from full-time ministry.' },
  { when: 'Early 2026', what: 'Family began noticing changes in his physical health and provided ongoing care and medical support.' },
  { when: 'May 2026', what: 'Experienced an illness of approximately three weeks and began repeatedly saying, “I am going home.”' },
  { when: 'After May 2026', what: 'Recovered, returned to church services, and continued speaking about “going home.”' },
  { when: 'August 3, 2026', what: 'Wrote **John 14:12**, the last Scripture reference he is known to have written.' },
  { when: 'August 4, 2026', what: 'Became ill after breakfast; received medical attention and expressed gratitude to God and those caring for him.' },
  { when: 'August 16, 2026', what: 'Completed his earthly journey at the age of 92.' },
];

/** Closing of the page, below the journey. */
export const lifeClosing = {
  heading: 'A Life Received. A Life Given. A Legacy Continued.',
  body: [
    'Rev. Paul Kadir Shidali’s earthly journey is complete.',
    'But the questions his life leaves remain alive:',
    { list: [
      'What will we do with the faith he placed in us?',
      'What will we do with the wisdom he passed forward?',
      'What will we build with what we inherited?',
      'What will our own children receive because his life passed through ours?',
    ] },
    'His story reminds us that a meaningful life is not measured only by how long it lasts, but by what it gives, what it builds, what it transfers, and what continues because it was lived.',
  ] as Block[],
  benediction: [
    'His earthly assignment is complete.',
    'His legacy is now entrusted to those who remain.',
    'His light has not simply gone out.',
    'It has changed hands.',
  ],
};

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
