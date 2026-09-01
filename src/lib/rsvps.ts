import { promises as fs } from 'fs';
import { join } from 'path';

/**
 * Local fallback store for funeral RSVPs, mirroring lib/local-tributes.
 * Used only when no CMS is configured and the filesystem is writable, so it
 * never runs on Vercel. Sanity is the real store.
 */

export type StoredRsvp = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  attending: string[];
  guests: number;
  travellingFrom?: string;
  relationship?: string;
  message?: string;
  submittedAt: string;
};

const DIR = join(process.cwd(), '.data');
const FILE = join(DIR, 'rsvps.json');

export const rsvpFileWritable = !process.env.VERCEL && !process.env.AWS_LAMBDA_FUNCTION_NAME;

async function readAll(): Promise<StoredRsvp[]> {
  try {
    const parsed = JSON.parse(await fs.readFile(FILE, 'utf8'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Serialised so two simultaneous RSVPs cannot lose one to a read-modify-write race. */
let writeQueue: Promise<unknown> = Promise.resolve();

export function addLocalRsvp(r: StoredRsvp): Promise<void> {
  const run = writeQueue.then(async () => {
    const all = await readAll();
    all.unshift(r);
    await fs.mkdir(DIR, { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(all, null, 2), 'utf8');
  });
  writeQueue = run.catch(() => {});
  return run;
}
