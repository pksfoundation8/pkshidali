import type { MetadataRoute } from 'next';
import { site } from '@/config/site';
import { getPillars, getPrograms, getPublishedTributes } from '@/lib/content';
import { archiveSections, policies } from '@/content/pages';

/** Every indexable route. Policies are excluded — they are not published yet. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [pillars, programs, tributes] = await Promise.all([getPillars(), getPrograms(), getPublishedTributes()]);
  const paths = [
    '/', '/about', '/his-life', '/legacy', '/tributes', '/tributes/share',
    '/programs', '/stories', '/get-involved', '/give', '/contact', '/archive',
    ...pillars.map((p) => `/legacy/${p.slug}`),
    ...programs.map((p) => `/programs/${p.slug}`),
    ...tributes.map((t) => `/tributes/${t.id}`),
    ...archiveSections.map((s) => `/archive/${s.slug}`),
  ];

  return paths.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : path.split('/').length > 2 ? 0.5 : 0.8,
  }));
}

// Referenced so the policy import is not unused once policies go live.
export const draftPolicyCount = policies.length;
