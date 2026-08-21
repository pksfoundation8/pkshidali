import type { IconName } from '@/components/primitives/Icon';
import type { Tribute } from './home';

/**
 * The filter rail groups several stored relationships under one label —
 * "Church & Ministry" covers both church members and ministers — and adds two
 * media filters. Keeping the predicates here means the labels and the matching
 * logic can never drift apart.
 */
export type TributeFilter = {
  key: string;
  label: string;
  icon: IconName;
  match: (t: Tribute) => boolean;
};

export const tributeFilters: TributeFilter[] = [
  { key: 'all', label: 'All', icon: 'star', match: () => true },
  { key: 'family', label: 'Family', icon: 'family',
    match: (t) => ['Family', 'Grandchild'].includes(t.relationship) },
  { key: 'students', label: 'Former Students', icon: 'cap',
    match: (t) => t.relationship === 'Former Student' },
  { key: 'church', label: 'Church & Ministry', icon: 'cross',
    match: (t) => ['Church Member', 'Pastor or Minister'].includes(t.relationship) },
  { key: 'colleagues', label: 'Friends & Colleagues', icon: 'users',
    match: (t) => ['Friend', 'Teacher or Colleague'].includes(t.relationship) },
  { key: 'community', label: 'Community', icon: 'hands',
    match: (t) => ['Community', 'Organisation'].includes(t.relationship) },
  { key: 'audio', label: 'Audio Tributes', icon: 'audio', match: (t) => t.hasAudio === true },
  { key: 'video', label: 'Video Tributes', icon: 'video', match: (t) => t.hasVideo === true },
];
