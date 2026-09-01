import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { site } from '@/config/site';

/**
 * The site share card.
 *
 * Matches the family's printed announcement: warm near-black ground, a glow
 * behind the portrait, cream serif over gold small caps. Cormorant Garamond is
 * read from public/fonts at render time — Satori's default face is a sans and
 * would break the resemblance entirely.
 */

export const runtime = 'nodejs';
export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const CREAM = '#f0e6d6';
const GOLD = '#c9a227';
const GOLD_SOFT = '#d8b96a';

async function asset(file: string) {
  try {
    return await readFile(join(process.cwd(), 'public', file));
  } catch {
    return null;
  }
}

export default async function Image() {
  const [portraitBuf, semi, bold] = await Promise.all([
    asset('portrait-og.png'),
    asset('fonts/CormorantGaramond-SemiBold.ttf'),
    asset('fonts/CormorantGaramond-Bold.ttf'),
  ]);
  const portrait = portraitBuf ? `data:image/png;base64,${portraitBuf.toString('base64')}` : '';

  const fonts = [
    semi && { name: 'Cormorant', data: semi, weight: 600 as const, style: 'normal' as const },
    bold && { name: 'Cormorant', data: bold, weight: 700 as const, style: 'normal' as const },
  ].filter(Boolean) as { name: string; data: Buffer; weight: 600 | 700; style: 'normal' }[];

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', position: 'relative',
        background: '#0d0906', color: CREAM, fontFamily: 'Cormorant, serif',
      }}>
        {/* warm light gathering behind him, as on the announcement */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: 1200, height: 630, display: 'flex',
          background:
            'radial-gradient(58% 82% at 74% 44%, rgba(150,110,55,0.55) 0%, '
            + 'rgba(60,42,22,0.30) 42%, rgba(13,9,6,0) 72%)',
        }} />

        {portrait && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={portrait} alt="" width={470} height={412}
            style={{ position: 'absolute', top: 118, left: 690 }} />
        )}

        {/* keeps the left column readable over the glow */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: 1200, height: 630, display: 'flex',
          background: 'linear-gradient(90deg, rgba(13,9,6,0.94) 0%, rgba(13,9,6,0.80) 42%, rgba(13,9,6,0) 68%)',
        }} />

        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '0 0 0 72px', width: 660, position: 'relative',
        }}>
          <div style={{ fontSize: 27, letterSpacing: 1, color: GOLD_SOFT, display: 'flex' }}>
            Continuing the Legacy of
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
            <div style={{ width: 90, height: 1, background: `${GOLD}88`, display: 'flex' }} />
            <div style={{ width: 6, height: 6, background: GOLD, transform: 'rotate(45deg)', display: 'flex' }} />
            <div style={{ width: 90, height: 1, background: `${GOLD}88`, display: 'flex' }} />
          </div>

          <div style={{
            marginTop: 14, fontSize: 74, fontWeight: 700, lineHeight: 1.04, display: 'flex',
          }}>
            Rev. Paul
          </div>
          <div style={{ fontSize: 74, fontWeight: 700, lineHeight: 1.04, display: 'flex' }}>
            Kadir Shidali
          </div>

          <div style={{ marginTop: 14, fontSize: 26, color: GOLD_SOFT, display: 'flex' }}>
            {site.subject.bornLabel} — {site.subject.diedLabel}
          </div>

          <div style={{
            marginTop: 20, fontSize: 25, lineHeight: 1.4, color: 'rgba(240,230,214,0.82)',
            maxWidth: 480, display: 'flex',
          }}>
            {site.tagline}
          </div>

          <div style={{
            marginTop: 24, fontSize: 21, letterSpacing: 3, color: GOLD_SOFT, display: 'flex',
          }}>
            {site.domain}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
