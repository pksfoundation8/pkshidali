# Phase 3 — tribute intake, hardening and the public archive

## The tributes index

`/tributes` is a real page now, not a stub. The server sends only published
tributes; `TributeBrowser` filters client-side over that already-safe set, so no
amount of interaction can surface something unapproved. Filter chips only appear
for relationships that actually have entries, and the "What Rev. Shidali taught
me" wall builds itself from the one-sentence field on each submission.

## Order of defence on `POST /api/tributes`

| # | Layer | Behaviour |
|---|---|---|
| 1 | Rate limit | 3 submissions per IP per hour → `429` with `Retry-After` |
| 2 | Honeypot | Hidden `website` field → `202`, accepted silently |
| 3 | Turnstile | Verified when configured; **fails closed** on error |
| 4 | Validation | Server-side, independent of the client → `422` with per-field errors |
| 5 | Assets | Size and MIME checked before anything touches Sanity |
| 6 | Persist | Created at `status: 'pending'` — the only publication gate |
| 7 | Notify | Best effort; a failed email never fails the submission |

### Verified

```
rate limit    201, 201, 201, 429, 429
honeypot      202 {"ok":true}
bad file type 422 {"errors":{"photo":"Photograph is not a supported format."}}
bad video url 422 {"errors":{"videoUrl":"Video links must start with http:// or https://"}}
no CMS        201 {"ok":true,"status":"pending","persisted":false}
crawl         34 routes, 0 dead links
```

The honeypot returns `202` rather than an error on purpose: a bot should learn
nothing from the response about why it was dropped.

## Uploads

Photographs (8MB, JPEG/PNG/WebP/HEIC) and audio (20MB, MP3/M4A/WAV/OGG/WebM)
upload to Sanity assets. Video is a **link field**, not an upload — pushing a
several-hundred-megabyte file through a serverless route handler is the wrong
shape, and YouTube, Vimeo or Drive already solve it. If the foundation later
wants first-party video, Mux direct uploads are the route.

Audio matters more than it looks. Elderly former students and colleagues often
will not type six paragraphs but will happily talk for three minutes into a
phone, and their actual voices become part of the record.

**If an upload fails the tribute is still created**, with a note added to
`moderatorNotes` telling the moderator to ask the contributor to resend. Losing
someone's words because their photograph failed would be the worse outcome.

## Two limitations, stated plainly

**The rate limiter is in-process.** It works on a single instance and resets on
deploy. On serverless each instance keeps its own counter, so the effective limit
is (3 × instances). That still brakes a naive flood but is not a real defence.
`src/lib/rate-limit.ts` deliberately mirrors the `@upstash/ratelimit` interface,
so moving to Redis is a one-file change. **Do it before the site is publicised.**

**Turnstile is off until configured.** With no `TURNSTILE_SECRET_KEY` the verifier
returns true, so the form stays usable during family review. The honeypot and rate
limit still apply. Once a key is set, verification fails closed — an unverifiable
submission is rejected rather than waved through.

## Configuration

```bash
TURNSTILE_SECRET_KEY=          # Cloudflare → Turnstile → add site
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
RESEND_API_KEY=                # or swap notify.ts for another provider
MODERATOR_NOTIFY_EMAIL=        # where the queue alert goes
NOTIFY_FROM_EMAIL=             # must be a verified sending domain
```

All optional. Unset, submissions are still stored as pending and visible in the
studio queue — the email is a convenience, not the record.

## Still outstanding

- Redis-backed rate limiting (above)
- Transcripts for submitted audio: the schema has the field and the archive
  search will need it, but nothing generates them yet
- Bulk import of the 2026 homegoing tributes
- Audio playback on the public tribute page (the file is stored; the player is
  not built)
