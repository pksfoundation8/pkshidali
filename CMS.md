# Content management (Sanity)

The Studio is mounted in-app at **`/studio`** — one URL, one login, no separate
deployment for the family to learn.

## Connecting a project

Two commands — the first opens the browser to sign in, the second provisions
everything (project, production dataset, CORS, an Editor write token, the
revalidate secret) and writes `.env`:

```bash
npx sanity login
npm run setup:sanity
```

Restart the dev server and open `/studio`. On the production host, set the
same four variables from `.env`.

Then in Sanity Manage → API → Webhooks, point `create/update/delete` at
`https://pkshidali.org/api/revalidate` with the secret from
`SANITY_REVALIDATE_SECRET` (the setup script prints the exact URL and value).
Publishing invalidates only that document type's cache tag, so a tribute going
live does not rebuild the whole site.

## The fallback is the point

`src/lib/content.ts` is the single seam between the CMS and the site. Every page
reads through its getters. With no project configured — or if Sanity errors —
they return the typed seed content in `src/content/`. So:

- the site builds and runs with **no CMS at all**
- a CMS outage degrades the site rather than taking it down
- `/tributes/share` still accepts submissions; without a write token it logs them
  and returns `persisted: false` rather than silently dropping them

Verified with the environment unset: 34 routes serve, zero dead links, seed copy
renders, intake returns `201 {"ok":true,"status":"pending","persisted":false}`.

## Schemas

Nine document types in `sanity/schemas/`: `pillar`, `program`, `milestone`,
`tribute`, `mediaAsset`, `sermon`, `person`, `page`, `siteSettings`.

The Studio sidebar opens on the tribute queue, split into Pending / Published /
Rejected, because that is the list needing daily attention.

Two rules are encoded in the `tribute` schema rather than left to convention:

1. **`status` is the only publication gate.** Every public query filters on
   `status == "published"`. *Current launch posture:* submissions are
   auto-approved — `SUBMISSION_STATUS` in `src/app/api/tributes/route.ts`
   creates them as `published`. Flip it back to `'pending'` to restore
   human moderation; the studio's Pending queue is already wired for it.
2. **`rawSubmission` is the consent record and is read-only.** Moderators correct
   `body`; the original wording survives underneath. `permissionPublish` and
   `permissionArchive` are read-only and validated — a tribute cannot be saved as
   publishable without both.

## A bundle regression worth remembering

Importing `createClient` from `next-sanity` pulled studio code into the browser
bundle and added roughly 60 kB to **every** page. The data client now uses
`@sanity/client` directly, and `src/lib/sanity/client.ts` starts with
`import 'server-only'` so an accidental client import fails the build instead of
quietly costing mobile users bandwidth.

Public routes: ~95–100 kB First Load JS. `/studio` is 1.5 MB, which is fine — it
is an authenticated admin tool and noindexed.

## Sanity version

Sanity 6 requires React 19; this project is Next 14 / React 18, so it is pinned to
the Sanity 3 line (`sanity@3.99.0`, `next-sanity@9.12.3`). Moving to Next 15 and
React 19 would allow Sanity 6, but that is a deliberate upgrade to schedule rather
than something to do by accident.

## Still outstanding for Phase 3

Turnstile on the submission form, rate limiting on `/api/tributes`, the moderator
notification email, and media uploads (photo, audio, video) on the public form.
