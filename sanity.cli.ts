import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { defineCliConfig } from 'sanity/cli';

/**
 * CLI config so `npx sanity dataset export`, `documents`, etc. target the
 * right project. The CLI does not load Next's .env, so we read it directly.
 */
function envValue(key: string): string {
  if (process.env[key]) return process.env[key] as string;
  try {
    const m = readFileSync(join(process.cwd(), '.env'), 'utf8')
      .match(new RegExp(`^${key}=(.*)$`, 'm'));
    return m?.[1]?.trim() ?? '';
  } catch {
    return '';
  }
}

export default defineCliConfig({
  api: {
    projectId: envValue('NEXT_PUBLIC_SANITY_PROJECT_ID'),
    dataset: envValue('NEXT_PUBLIC_SANITY_DATASET') || 'production',
  },
});
