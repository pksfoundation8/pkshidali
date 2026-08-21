import { promises as fs } from 'fs';
import { join } from 'path';

/**
 * Collective remembrance gestures — candles lit, flowers, doves, hearts.
 * Counts persist to .data/gestures.json (gitignored), same fallback pattern
 * as the local tribute store: real numbers, never seeded. On serverless
 * hosting the file is ephemeral; Phase 3 moves the tally into the CMS/DB.
 */

export const GESTURE_KINDS = ['candle', 'flowers', 'dove', 'heart'] as const;
export type GestureKind = (typeof GESTURE_KINDS)[number];
export type GestureCounts = Record<GestureKind, number>;

const DIR = join(process.cwd(), '.data');
const FILE = join(DIR, 'gestures.json');
const ZERO: GestureCounts = { candle: 0, flowers: 0, dove: 0, heart: 0 };

export async function readGestures(): Promise<GestureCounts> {
  try {
    const parsed = JSON.parse(await fs.readFile(FILE, 'utf8'));
    return { ...ZERO, ...parsed };
  } catch {
    return { ...ZERO };
  }
}

/** Writes are serialised through this queue — two simultaneous gestures were
 *  losing one update to a read-modify-write race on the file. */
let writeQueue: Promise<unknown> = Promise.resolve();

export function addGesture(kind: GestureKind): Promise<GestureCounts> {
  const run = writeQueue.then(async () => {
    const counts = await readGestures();
    counts[kind] += 1;
    await fs.mkdir(DIR, { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(counts, null, 2), 'utf8');
    return counts;
  });
  writeQueue = run.catch(() => {});
  return run;
}
