import {
  Hero, RolesBar, PillarsAndPrograms, QuoteStrip,
  TributesAndTimeline, ArchiveAndInvolve, BuildLegacy,
} from '@/components/home/HomeBands';

/**
 * Band order follows the v2 mockup exactly. Content comes from
 * src/content/home.ts — swap that for a Sanity query in Phase 2 and
 * nothing below changes.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <RolesBar />
      <PillarsAndPrograms />
      <QuoteStrip />
      <TributesAndTimeline />
      <ArchiveAndInvolve />
      <BuildLegacy />
    </>
  );
}
