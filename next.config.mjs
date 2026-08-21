import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * The hero sky image is optional: heroes render public/hero-sky.jpg when it
 * exists and fall back to the CSS gradient sky when it does not. The check
 * lives here (Node context) because components cannot import node:fs.
 * Adding or removing the file takes effect on the next dev restart / build.
 */
const hasHeroSky = existsSync(join(process.cwd(), 'public', 'hero-sky.jpg'));

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { formats: ['image/avif', 'image/webp'] },
  env: { NEXT_PUBLIC_HERO_SKY: hasHeroSky ? '1' : '' },
};
export default nextConfig;
