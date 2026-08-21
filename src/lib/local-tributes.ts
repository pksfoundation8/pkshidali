import { promises as fs } from 'fs';
import { join } from 'path';
import type { Tribute } from '@/content/home';

/**
 * Phase-1 fallback store: tributes persist to .data/tributes.json when no
 * CMS is configured, so an auto-approved submission appears on the site
 * immediately instead of vanishing into a server log.
 *
 * Server-side only. The file is gitignored because it holds contributor
 * emails. On serverless hosting the filesystem is ephemeral — configure
 * Sanity before production; this store is for local/dev and single-server
 * setups.
 */

const DIR = join(process.cwd(), '.data');
const FILE = join(DIR, 'tributes.json');

type StoredTribute = Tribute & { email?: string; submittedAt?: string };

async function readAll(): Promise<StoredTribute[]> {
  try {
    const parsed = JSON.parse(await fs.readFile(FILE, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Public shape only — the email never leaves the server. */
export async function readLocalTributes(): Promise<Tribute[]> {
  return (await readAll()).map(({ email: _email, ...pub }) => pub);
}

/** Writes are serialised so two simultaneous submissions cannot lose one to a
 *  read-modify-write race on the file. */
let writeQueue: Promise<unknown> = Promise.resolve();

export function addLocalTribute(t: StoredTribute): Promise<void> {
  const run = writeQueue.then(async () => {
    const all = await readAll();
    all.unshift(t);
    await fs.mkdir(DIR, { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(all, null, 2), 'utf8');
  });
  writeQueue = run.catch(() => {});
  return run;
}
