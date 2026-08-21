# Installing the site on your computer

Roughly ten minutes, most of it waiting for `npm install`.

---

## 1. Install Node.js

The site needs **Node.js 18.17 or newer**. Node 20 or 22 (both LTS) are the safe
choices.

Download the **LTS** installer from [nodejs.org](https://nodejs.org) and run it.
On macOS you can instead use `brew install node`.

Check it worked — open Terminal (macOS) or PowerShell (Windows) and run:

```bash
node -v      # should print v18.17.0 or higher
npm -v
```

If `node` is not recognised, close and reopen the terminal window. The installer
only updates the PATH for new windows.

---

## 2. Unzip the project

Unzip `pkshidali-website.zip` somewhere you will find it again — `Documents`
or `Sites` is fine. Avoid a folder synced by Dropbox or OneDrive; those slow the
dev server down noticeably and sometimes corrupt `node_modules`.

Then move into the folder:

```bash
cd path/to/pkshidali
```

On macOS you can type `cd ` (with the space) and drag the folder onto the
terminal window to fill in the path.

---

## 3. Install the dependencies

```bash
npm install
```

**This takes 3–6 minutes and downloads about 1 GB.** Most of that is the Sanity
Studio. It only happens once.

You will see warnings about deprecated packages and a vulnerability count. Both
are normal for a project of this size and neither blocks anything. Do **not** run
`npm audit fix --force` — it will try to upgrade Sanity to a version requiring
React 19 and break the build.

---

## 4. Start it

```bash
npm run dev
```

Then open **http://localhost:3000**.

Leave the terminal window open — that is the server. `Ctrl+C` stops it.

Edit any file under `src/` and the browser updates by itself.

---

## What works immediately

Everything except payments. All 34 pages, the tribute forms, the contact and
volunteer forms, the filters, the donation builder — all of it runs with no
configuration at all, on the seed content in `src/content/`.

Form submissions are **validated and accepted but not stored**, because no CMS or
email provider is connected. The API says so honestly in its response rather than
pretending. `/studio` shows a setup panel explaining how to connect one.

---

## Building the production version

```bash
npm run build     # compiles and pre-renders every page
npm start         # serves the built site on http://localhost:3000
```

`npm run build` is also the fastest way to check you have not broken anything —
it type-checks the whole project.

---

## Common problems

**`command not found: npm`**
Node did not install, or the terminal is stale. Reopen the terminal; if it still
fails, reinstall Node.

**`EACCES` or permission errors during install**
You are probably in a protected folder. Move the project to your home directory.
Never fix this with `sudo npm install`.

**Port 3000 already in use**
Something else is running there. Use `npm run dev -- -p 3001`.

**Fonts look wrong / everything is Times New Roman**
The typefaces load from Google Fonts, so the first load needs an internet
connection. After that the browser caches them.

**The install fails with a dependency conflict**
Delete `node_modules` and `package-lock.json`, then run `npm install` again. If
it persists, `npm install --legacy-peer-deps`.

---

## When you are ready to go further

- **`CMS.md`** — connect Sanity so the family can edit content and moderate tributes
- **`GLOBAL.md`** — payment providers, currencies, and the cross-border receipting position
- **`PHASE3.md`** — spam protection and the moderator notification email
- **`.env.example`** — every setting, each optional; copy it to `.env.local` to begin

## Putting it online

The project is a standard Next.js app. The simplest route is
[Vercel](https://vercel.com): push the folder to a GitHub repository, import it,
and add any environment variables in the dashboard. No configuration changes are
needed.

---

## Version note

Every dependency in `package.json` is pinned to an exact version — no `^`, no
`~`. That is deliberate.

An earlier build of this project shipped on Next 14. Running `npm audit fix
--force` upgraded it to Next 16, which **silently broke every detail page**:
`/legacy/faith`, `/programs/scholars`, every tribute page and every policy page
returned 404. The build still passed, so nothing announced the failure.

The cause: from Next 15 onward, `params` in a dynamic route is a Promise. Reading
`params.slug` synchronously returns `undefined`, the lookup misses, and the page
falls through to `notFound()`. The code now awaits `params` throughout and the
project targets Next 16 and React 19 properly.

**Do not run `npm audit fix --force`.** If you want to upgrade, do it
deliberately, then run `npm run build` *and* click through a detail page —
a green build is not sufficient evidence that routing still works.

Requires **Node 20.9 or newer** (declared in `engines`).
