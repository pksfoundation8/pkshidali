import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { site } from '@/config/site';

/**
 * Share card for the funeral pages.
 *
 * Same construction as the site card: warm near-black ground, light gathering
 * behind the portrait, cream serif over gold small caps. The family's printed
 * announcement stays available as a download on the pages themselves — this is
 * the link preview, which needs his face to be recognisable at the size a
 * WhatsApp thread renders it.
 */

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

export type CardRow = { label: string; detail: string };

export async function funeralCard({
  eyebrow, rows, footnote,
}: { eyebrow: string; rows: CardRow[]; footnote: string }) {
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
        <div style={{
          position: 'absolute', top: 0, left: 0, width: 1200, height: 630, display: 'flex',
          background:
            'radial-gradient(58% 82% at 74% 44%, rgba(150,110,55,0.55) 0%, '
            + 'rgba(60,42,22,0.30) 42%, rgba(13,9,6,0) 72%)',
        }} />

        {portrait && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={portrait} alt="" width={470} height={412}
            style={{ position: 'absolute', top: 132, left: 700 }} />
        )}

        <div style={{
          position: 'absolute', top: 0, left: 0, width: 1200, height: 630, display: 'flex',
          background: 'linear-gradient(90deg, rgba(13,9,6,0.94) 0%, rgba(13,9,6,0.80) 44%, rgba(13,9,6,0) 70%)',
        }} />

        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '0 0 0 68px', width: 700, position: 'relative',
        }}>
          <div style={{ fontSize: 25, letterSpacing: 2, color: GOLD_SOFT, display: 'flex' }}>
            {eyebrow}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
            <div style={{ width: 78, height: 1, background: `${GOLD}88`, display: 'flex' }} />
            <div style={{ width: 6, height: 6, background: GOLD, transform: 'rotate(45deg)', display: 'flex' }} />
            <div style={{ width: 78, height: 1, background: `${GOLD}88`, display: 'flex' }} />
          </div>

          <div style={{ marginTop: 12, fontSize: 58, fontWeight: 700, lineHeight: 1.04, display: 'flex' }}>
            Rev. Paul Kadir
          </div>
          <div style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.04, display: 'flex' }}>
            Shidali
          </div>

          <div style={{ marginTop: 10, fontSize: 23, color: GOLD_SOFT, display: 'flex' }}>
            {site.subject.bornLabel} — {site.subject.diedLabel}
          </div>

          {/* the two services, which is what a reader needs from this card */}
          <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 9 }}>
            {rows.map((r) => (
              <div key={r.label} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <div style={{ width: 5, height: 5, background: GOLD, transform: 'rotate(45deg)', display: 'flex' }} />
                <div style={{ fontSize: 25, fontWeight: 600, display: 'flex' }}>{r.label}</div>
                <div style={{ fontSize: 23, color: 'rgba(240,230,214,0.80)', display: 'flex' }}>
                  {r.detail}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 18, fontSize: 22, color: 'rgba(240,230,214,0.78)', display: 'flex',
          }}>
            {footnote}
          </div>

          <div style={{ marginTop: 18, fontSize: 20, letterSpacing: 3, color: GOLD_SOFT, display: 'flex' }}>
            {site.domain}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
