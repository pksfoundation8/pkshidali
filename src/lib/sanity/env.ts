export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-10-01';

/**
 * The site must build and run with no Sanity project at all.
 * When this is false every getter in src/lib/content.ts falls back to the
 * typed seed data in src/content/, so the family can review the site before
 * the CMS exists and the build never depends on a network call.
 */
export const isSanityConfigured = projectId.length > 0;
