# PK Shidali Foundation — pkshidali.org

Next.js 14 (App Router) · TypeScript · Sanity CMS.
A Nigerian foundation with a global donor base, built for the family to run.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 34 routes, 0 dead links, ~95–100 kB First Load JS
```

---

## Every page is real

No placeholder routes remain. A crawl from `/` reports **zero dead links across 34 routes**.

| Route | What it is |
|---|---|
| `/` | Homepage — hero, roles strip, pillars, programmes, quote, tributes, timeline, archive, get involved |
| `/about` | Mission, theory of change, and the transparency ledger |
| `/his-life` | Thirteen biography sections, timeline, character |
| `/legacy` + `/legacy/[pillar]` | Six pillars, index and detail |
| `/programs` + `/programs/[slug]` | Five programmes, index and detail |
| `/tributes` | Filter rail, featured carousel, latest grid, Legacy Wall, share sidebar |
| `/tributes/[id]`, `/tributes/share` | Detail pages and the long-form submission form |
| `/archive` + `/archive/[section]` | Four archive sections with catalogue-field specs |
| `/stories` | Impact reporting — deliberately empty, see below |
| `/get-involved` | Ways to help, volunteer application with safeguarding gate |
| `/give` | Multi-currency donation builder |
| `/contact` | Enquiry form routed by subject |
| `/policies/[slug]` | Three policy outlines, noindexed |
| `/studio` | Sanity Studio, authenticated |
| `/styleguide` | Internal token and component reference, noindexed |

Plus `sitemap.xml`, `robots.txt`, a generated Open Graph share card, and styled
`not-found` / `error` pages.

---

## Four decisions that shaped this, worth knowing before changing anything

**1. No AI or stock imagery.** The hero atmosphere is SVG. Tribute avatars are
gold monograms. Archive tiles are engraved icons on navy. Nowhere does a stock
photograph of a person who never knew him appear on an archive whose entire value
is that it is true. Real photographs replace these as they are submitted.

**2. Nothing about his life is invented.** Pillar and programme copy describes
the *foundation's intent*. `/his-life` carries the questions each biography
section needs answered, not a fabricated account. A plausible invention is harder
to correct later than an obvious gap.

**3. The site states its own incompleteness.** `/about` has a transparency
ledger showing the real status of every governance commitment — most currently
read *Not yet drafted*. `/stories` is empty because the programmes have no
beneficiaries yet. `/give` tells donors outside Nigeria they get no tax receipt
*before* they give. A young foundation earns trust by being accurate about its
stage.

**4. Policies are not generated.** Privacy, safeguarding and donations publish an
outline of what each must cover and state plainly that they are unpublished.
A plausible-sounding privacy policy looks binding and isn't.

---

## Documentation

- **`CMS.md`** — Sanity setup, the nine schemas, the fallback design, and a
  bundle regression worth remembering
- **`PHASE3.md`** — tribute intake: seven layers of defence, uploads, and two
  limitations stated plainly
- **`GLOBAL.md`** — Nigeria registration, currency routing, and why a Nigerian
  foundation cannot issue Canadian tax receipts

---

## Architecture

`src/lib/content.ts` is the single seam between the CMS and the site. Every page
reads through its getters; with no Sanity project configured they return the
typed seed content in `src/content/`. The site builds and runs with no CMS at
all, and a CMS outage degrades it rather than taking it down.

Styling is a component-class design system in `globals.css`, scoped under `.pks`
(applied to `<body>`). Not Tailwind utilities — the arched portrait frame, masked
sunburst and wrapping roles rail read badly as utility strings, and this
guarantees parity with the approved design. Tailwind remains installed.

```
src/
  app/            34 routes, globals.css, sitemap, robots, og image, error pages
  config/site.ts  jurisdiction, nav, contact, quote attribution
  content/        seed data shaped like the CMS schemas
  components/
    layout/       Brandmark, Container, SiteHeader, SiteFooter, PageBanner
    primitives/   Icon, IconCircle, SectionHeading
    home/         HomeBands, CelestialBackdrop
    tributes/     TributesExplorer, ShareSidebar, LegacyWall, Turnstile
    forms/        ContactForm, VolunteerForm, Field
    give/         DonationBuilder
    life/         BiographyAccordion
  lib/            content adapter, sanity client, rate-limit, turnstile, notify
sanity/schemas/   nine document types
```

---

## Before launch

**Blocked on the foundation**

- CAC registration → merchant accounts → payment integration
- The Canadian entity question (see `GLOBAL.md`) — a board decision
- Policies drafted by counsel. **Safeguarding before any volunteer works with a child.**
- Registered address and phone — still `[Street address]` and `+234 800 000 0000`
- The biography, from the family
- A high-resolution original of the portrait (the current one was recovered from
  a mockup at 210px wide, and is arch-framed for that reason)

**Engineering**

- Redis-backed rate limiting — the current limiter is in-process and per-instance
- `next/font` instead of the CSS `@import` (blocked in the build sandbox; a
  five-line change locally)
- Payment provider handoff, webhooks, recurring plans, donation records
- A real Lighthouse run on a Nigerian mobile profile
- Transcripts for submitted audio; audio playback on tribute pages

**Review by the family**

- `src/content/forms.ts` → `workingWithChildren`. Which volunteer roles trigger a
  mandatory safeguarding check. Getting this wrong in the permissive direction is
  the mistake that matters most in this codebase.
- `src/config/site.ts` → `quoteAttribution`. The homepage pull quote is currently
  signed as his own words.
- The tone of `/about`, which is candid about how new the foundation is.
