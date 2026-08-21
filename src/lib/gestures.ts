import { promises as fs } from 'fs';
import { join } from 'path';

/**
 * Collective remembrance gestures — candles lit, flowers, doves, hearts.
 *
 * Production: Vercel KV / Upstash Redis over its REST API (no SDK needed),
 * selected automatically when KV_REST_API_URL + KV_REST_API_TOKEN are set.
 * Increments are atomic (INCR), so concurrent taps can't lose a count.
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

// ── KV (Upstash REST) ─────────────────────────────────────────────────
const KV_URL = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

/** Which backend is active — surfaced so ops can confirm the deploy is sane. */
export const gesturesStore: 'kv' | 'file' = KV_URL && KV_TOKEN ? 'kv' : 'file';

const key = (k: GestureKind) => `pks:gesture:${k}`;

async function kv<T = unknown>(command: (string | number)[]): Promise<T> {
  const res = await fetch(KV_URL as string, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_TOKEN}`, 'content-type': 'application/json' },
    body: JSON.stringify(command),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`KV ${command[0]} failed: HTTP ${res.status}`);
  const json = (await res.json()) as { result?: T; error?: string };
  if (json.error) throw new Error(`KV ${command[0]} failed: ${json.error}`);
  return json.result as T;
}

async function kvRead(): Promise<GestureCounts> {
  const values = await kv<(string | null)[]>(['MGET', ...GESTURE_KINDS.map(key)]);
  const out = { ...ZERO };
  GESTURE_KINDS.forEach((k, i) => { out[k] = Number(values[i] ?? 0); });
  return out;
}

async function kvAdd(kind: GestureKind): Promise<GestureCounts> {
  await kv<number>(['INCR', key(kind)]);
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
