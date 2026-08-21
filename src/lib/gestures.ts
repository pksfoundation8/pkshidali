import { promises as fs } from 'fs';
import { join } from 'path';
import { kvCommand, kvConfigured } from './kv';

/**
 * Collective remembrance gestures — candles lit, flowers, doves, hearts.
 *
 * Production: Vercel KV / Upstash Redis (see lib/kv.ts), selected
 * automatically when configured. Increments are atomic (INCR), so
 * concurrent taps cannot lose a count.
 *
 * Local/dev fallback: .data/gestures.json (gitignored). Vercel's filesystem
 * is read-only, so the file path is never used there — configure KV before
 * deploying or the gesture buttons will fail.
 *
 * Counts are real in both modes; nothing is seeded.
 */

export const GESTURE_KINDS = ['candle', 'flowers', 'dove', 'heart'] as const;
export type GestureKind = (typeof GESTURE_KINDS)[number];
export type GestureCounts = Record<GestureKind, number>;

const ZERO: GestureCounts = { candle: 0, flowers: 0, dove: 0, heart: 0 };

/** Which backend is active — surfaced so ops can confirm the deploy is sane. */
export const gesturesStore: 'kv' | 'file' = kvConfigured ? 'kv' : 'file';

// ── KV ────────────────────────────────────────────────────────────────
const key = (k: GestureKind) => `pks:gesture:${k}`;

async function kvRead(): Promise<GestureCounts> {
  const values = await kvCommand<(string | null)[]>(['MGET', ...GESTURE_KINDS.map(key)]);
  const out = { ...ZERO };
  GESTURE_KINDS.forEach((k, i) => { out[k] = Number(values[i] ?? 0); });
  return out;
}

async function kvAdd(kind: GestureKind): Promise<GestureCounts> {
  await kvCommand<number>(['INCR', key(kind)]);
  return kvRead();
}

// ── file fallback ─────────────────────────────────────────────────────
const DIR = join(process.cwd(), '.data');
const FILE = join(DIR, 'gestures.json');

async function fileRead(): Promise<GestureCounts> {
  try {
    const parsed = JSON.parse(await fs.readFile(FILE, 'utf8'));
    return { ...ZERO, ...parsed };
  } catch {
    return { ...ZERO };
  }
}

/** Writes are serialised — two simultaneous gestures were losing one update
 *  to a read-modify-write race on the file. */
let writeQueue: Promise<unknown> = Promise.resolve();

function fileAdd(kind: GestureKind): Promise<GestureCounts> {
  const run = writeQueue.then(async () => {
    const counts = await fileRead();
    counts[kind] += 1;
    await fs.mkdir(DIR, { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(counts, null, 2), 'utf8');
    return counts;
  });
  writeQueue = run.catch(() => {});
  return run;
}

// ── public API ────────────────────────────────────────────────────────
export function readGestures(): Promise<GestureCounts> {
  return gesturesStore === 'kv' ? kvRead() : fileRead();
}

export function addGesture(kind: GestureKind): Promise<GestureCounts> {
  return gesturesStore === 'kv' ? kvAdd(kind) : fileAdd(kind);
}
