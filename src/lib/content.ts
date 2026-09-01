import { sanityFetch } from './sanity/client';
import { isSanityConfigured } from './sanity/env';
import {
  pillarsQuery, programsQuery, milestonesQuery,
  featuredTributesQuery, publishedTributesQuery, tributeByIdQuery,
  archiveSectionQuery, siteSettingsQuery,
} from './sanity/queries';
import {
  pillars as seedPillars, programs as seedPrograms, milestones as seedMilestones,
  featuredTributes as seedTributes,
  type Pillar, type Program, type Milestone, type Tribute,
} from '@/content/home';
import { archiveSections as seedSections, type ArchiveRecord } from '@/content/pages';
import { readLocalTributes } from './local-tributes';
import { site } from '@/config/site';

/**
 * The single seam between the CMS and the site.
 *
 * Every page reads through these getters. When NEXT_PUBLIC_SANITY_PROJECT_ID
 * is set they return Sanity data; otherwise — or if Sanity errors — they return
 * the typed seed content in src/content/. That means:
 *
 *   · the site builds and runs with no CMS at all
 *   · a CMS outage degrades the site instead of breaking it
 *   · Phase 2 is a data-source swap, exactly as the plan promised
 *
 * `usingCms()` lets the UI say honestly which source it is reading.
 */

export function usingCms() {
  return isSanityConfigured;
}

export async function getPillars(): Promise<Pillar[]> {
  const data = await sanityFetch<Pillar[]>(pillarsQuery, ['pillar']);
  return data?.length ? data : seedPillars;
}

export async function getPillar(slug: string): Promise<Pillar | undefined> {
  return (await getPillars()).find((p) => p.slug === slug);
}

export async function getPrograms(): Promise<Program[]> {
  const data = await sanityFetch<Program[]>(programsQuery, ['program']);
  return data?.length ? data : seedPrograms;
}

export async function getProgram(slug: string): Promise<Program | undefined> {
  return (await getPrograms()).find((p) => p.slug === slug);
}

export async function getMilestones(): Promise<Milestone[]> {
  const data = await sanityFetch<Milestone[]>(milestonesQuery, ['milestone']);
  return data?.length ? data : seedMilestones;
}

/** Homepage — up to four, flagged `featured` in the studio. */
export async function getFeaturedTributes(): Promise<Tribute[]> {
  const data = await sanityFetch<Tribute[]>(featuredTributesQuery, ['tribute']);
  if (data?.length) return data;
  // Fall back to any published tributes before resorting to the sample set.
  const published = await sanityFetch<Tribute[]>(publishedTributesQuery, ['tribute']);
  return published?.length ? published.slice(0, 4) : seedTributes;
}

export async function getPublishedTributes(): Promise<Tribute[]> {
  const data = await sanityFetch<Tribute[]>(publishedTributesQuery, ['tribute']);
  if (data?.length) return data;
  // No CMS: real submissions from the local store come first, then samples.
  const local = await readLocalTributes();
  return [...local, ...seedTributes];
}

export async function getTribute(id: string): Promise<Tribute | undefined> {
  const data = await sanityFetch<Tribute | null>(tributeByIdQuery, ['tribute'], { id });
  if (data) return data;
  return (await getPublishedTributes()).find((t) => t.id === id);
}

export async function getArchiveRecords(section: string): Promise<ArchiveRecord[]> {
  type Row = {
    id: string; title: string; type: string; date?: string; dateUncertain?: boolean;
    description?: string; imageUrl?: string; imageW?: number; imageH?: number;
    lqip?: string; fileUrl?: string;
  };
  const data = await sanityFetch<Row[]>(archiveSectionQuery, ['mediaAsset'], { section });
  if (data?.length) {
    return data.map((r) => ({
      id: r.id,
      title: r.title,
      meta: [r.type, r.date ? `${r.dateUncertain ? 'c. ' : ''}${r.date}` : 'Undated']
        .filter(Boolean).join(' · '),
      desc: r.description ?? '',
      image: r.imageUrl && r.imageW && r.imageH
        ? { url: r.imageUrl, width: r.imageW, height: r.imageH, lqip: r.lqip }
        : undefined,
      fileUrl: r.fileUrl,
    }));
  }
  return seedSections.find((s) => s.slug === section)?.records ?? [];
}

type Settings = {
  address?: string[]; phone?: string; email?: string;
  quoteAttribution?: string; scriptureText?: string; scriptureReference?: string;
};

/** Merges CMS settings over the config defaults, field by field. */
export async function getSettings() {
  const data = await sanityFetch<Settings | null>(siteSettingsQuery, ['siteSettings']);
  return {
    address: data?.address?.length ? data.address : site.contact.address,
    phone: data?.phone || site.contact.phone,
    email: data?.email || site.contact.email,
    quoteAttribution: data?.quoteAttribution || site.quoteAttribution,
    scriptureText: data?.scriptureText || site.scripture.text,
    scriptureReference: data?.scriptureReference || site.scripture.reference,
  };
}
