import 'server-only';

/**
 * Minimal Vercel KV / Upstash Redis client over the REST API — no SDK.
 * Configured when KV_REST_API_URL + KV_REST_API_TOKEN are set (Vercel's KV
 * integration injects both; the Upstash names are accepted as aliases).
 */

const KV_URL = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

export const kvConfigured = Boolean(KV_URL && KV_TOKEN);

type Cmd = (string | number)[];
type Reply<T> = { result?: T; error?: string };

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${KV_URL}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_TOKEN}`, 'content-type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`KV request failed: HTTP ${res.status}`);
  return (await res.json()) as T;
}

/** Run one command, e.g. kvCommand(['INCR', 'key']). */
export async function kvCommand<T = unknown>(command: Cmd): Promise<T> {
  const json = await post<Reply<T>>('', command);
  if (json.error) throw new Error(`KV ${command[0]} failed: ${json.error}`);
  return json.result as T;
}

/** Run several commands in one round trip; results come back in order. */
export async function kvPipeline<T extends unknown[] = unknown[]>(commands: Cmd[]): Promise<T> {
  const json = await post<Reply<unknown>[]>('/pipeline', commands);
  return json.map((r, i) => {
    if (r.error) throw new Error(`KV ${commands[i][0]} failed: ${r.error}`);
    return r.result;
  }) as T;
}
