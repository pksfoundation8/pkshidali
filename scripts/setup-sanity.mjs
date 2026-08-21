/**
 * One-command Sanity provisioning.
 *
 *   1. npx sanity login          (opens the browser — the only manual step)
 *   2. npm run setup:sanity
 *
 * Creates the project, the production dataset, CORS entries for the studio,
 * an Editor API token for /api/tributes, generates the revalidate secret, and
 * writes everything into .env. Refuses to overwrite an existing project id
 * unless --force is passed.
 *
 * After it runs: restart the dev server (or set the same variables on the
 * production host) and open /studio.
 */
import { randomBytes } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const API = 'https://api.sanity.io/v2021-06-07';
const PROJECT_NAME = 'PK Shidali Foundation';
const CORS_ORIGINS = [
  'http://localhost:3000',
  'https://pkshidali.org',
  'https://www.pkshidali.org',
];

const force = process.argv.includes('--force');

function fail(msg) {
  console.error(`\n  ✗ ${msg}\n`);
  process.exit(1);
}

// ── 1. auth token from the logged-in CLI ─────────────────────────────
function getAuthToken() {
  if (process.env.SANITY_AUTH_TOKEN) return process.env.SANITY_AUTH_TOKEN;
  const cfgPath =
    process.env.SANITY_CLI_CONFIG_PATH || join(homedir(), '.config', 'sanity', 'config.json');
  try {
    const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));
    if (cfg.authToken) return cfg.authToken;
  } catch {
    /* fall through */
  }
  fail('Not logged in to Sanity. Run:  npx sanity login   then re-run this script.');
}

async function api(method, path, token, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  if (!res.ok) {
    throw new Error(`${method} ${path} → ${res.status}: ${json.message ?? text.slice(0, 200)}`);
  }
  return json;
}

// ── 2. env file helpers ──────────────────────────────────────────────
const ENV_PATH = join(root, '.env');

function readEnv() {
  if (!existsSync(ENV_PATH)) return {};
  const out = {};
  for (const line of readFileSync(ENV_PATH, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) out[m[1]] = m[2];
  }
  return out;
}

function writeEnv(values) {
  // Start from .env.example so comments and structure are preserved,
  // then substitute the values we now know.
  let text = readFileSync(join(root, '.env.example'), 'utf8');
  for (const [key, value] of Object.entries(values)) {
    const re = new RegExp(`^${key}=.*$`, 'm');
    text = re.test(text) ? text.replace(re, `${key}=${value}`) : `${text}\n${key}=${value}`;
  }
  writeFileSync(ENV_PATH, text, 'utf8');
}

// ── 3. provision ─────────────────────────────────────────────────────
const existing = readEnv();
if (existing.NEXT_PUBLIC_SANITY_PROJECT_ID && !force) {
  fail(
    `.env already has NEXT_PUBLIC_SANITY_PROJECT_ID=${existing.NEXT_PUBLIC_SANITY_PROJECT_ID}.\n` +
    '    Re-run with --force to provision a fresh project and rewrite .env.',
  );
}

const token = getAuthToken();
console.log('\n  Sanity provisioning\n  ───────────────────');

const project = await api('POST', '/projects', token, { displayName: PROJECT_NAME });
console.log(`  ✓ project created            ${project.id}`);

await api('PUT', `/projects/${project.id}/datasets/production`, token, { aclMode: 'public' });
console.log('  ✓ dataset created            production');

for (const origin of CORS_ORIGINS) {
  try {
    await api('POST', `/projects/${project.id}/cors`, token, { origin, allowCredentials: true });
    console.log(`  ✓ CORS origin added          ${origin}`);
  } catch (err) {
    console.log(`  – CORS origin skipped        ${origin} (${err.message})`);
  }
}

const writeToken = await api('POST', `/projects/${project.id}/tokens`, token, {
  label: 'site-write',
  roleName: 'editor',
});
console.log('  ✓ editor API token created   site-write');

const revalidateSecret = randomBytes(24).toString('hex');

writeEnv({
  NEXT_PUBLIC_SANITY_PROJECT_ID: project.id,
  NEXT_PUBLIC_SANITY_DATASET: 'production',
  SANITY_API_WRITE_TOKEN: writeToken.key,
  SANITY_REVALIDATE_SECRET: revalidateSecret,
});
console.log('  ✓ .env written\n');

console.log(`  Next steps
  ──────────
  1. Restart the dev server, then open http://localhost:3000/studio
     and sign in — the tribute queue and all content types are ready.
  2. On the production host, set the same four variables from .env.
  3. In https://www.sanity.io/manage/project/${project.id}/api
     add a webhook: URL  https://pkshidali.org/api/revalidate
                    secret  ${revalidateSecret}
     so studio publishes refresh the site instantly.
  4. .env holds live credentials — it stays gitignored. Keep it that way.
`);
