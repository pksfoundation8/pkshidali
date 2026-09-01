import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { site } from '@/config/site';
import { venue } from '@/content/funeral';

/**
 * The funeral announcement card.
 *
 * Centred and portrait-forward, in the manner of a printed memorial notice:
 * his face first, then his name, then the arrangements. This link is forwarded
 * into WhatsApp groups by people who add no context of their own, so the card
 * carries the essentials — who, when, where — without needing to be opened.
 */

export const runtime = 'nodejs';
export const alt = `Funeral arrangements for ${site.subject.name}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const GOLD = '#c49a45';
const GOLD_LIGHT = '#e3c77e';
const IVORY = '#faf8f1';

export default async function Image() {
  let portrait = '';
  try {
    const file = await readFile(join(process.cwd(), 'public', 'portrait-og.png'));
    portrait = `data:image/png;base64,${file.toString('base64')}`;
  } catch {
    /* card still renders without it */
  }

  const bornYear = site.subject.born.slice(0, 4);
  const diedYear = site.subject.died.slice(0, 4);

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', position: 'relative',
        background: 'linear-gradient(160deg, #051d35 0%, #082a4a 52%, #0e3d68 100%)',
        color: IVORY, fontFamily: 'sans-serif', padding: '26px 0',
      }}>
        {/* gold hairline frame */}
        <div style={{
          position: 'absolute', top: 22, left: 22, right: 22, bottom: 22,
          border: `1px solid ${GOLD}55`, display: 'flex',
        }} />

        <div style={{
          fontSize: 19, letterSpacing: 6, textTransform: 'uppercase',
          color: GOLD, display: 'flex',
        }}>
          Celebration of a Life Well Lived
        </div>

        {portrait && (
          <div style={{ display: 'flex', marginTop: 6 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={portrait} alt="" width={262} height={230} />
          </div>
        )}

        <div style={{
          marginTop: 2, fontSize: 46, fontWeight: 700, letterSpacing: -0.5, display: 'flex',
        }}>
          {site.subject.name}
        </div>

        <div style={{
          marginTop: 8, fontSize: 23, letterSpacing: 3, color: GOLD_LIGHT, display: 'flex',
        }}>
          {bornYear} — {diedYear}
        </div>

        {/* rule with a centred diamond, the site's signature device.
            Drawn as a rotated square: Satori's default font has no ✦ glyph
            and would render a tofu box. */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 20 }}>
          <div style={{ width: 120, height: 1, background: `${GOLD}66`, display: 'flex' }} />
          <div style={{
            width: 7, height: 7, background: GOLD, transform: 'rotate(45deg)', display: 'flex',
          }} />
          <div style={{ width: 120, height: 1, background: `${GOLD}66`, display: 'flex' }} />
        </div>

        <div style={{
          marginTop: 18, fontSize: 17, letterSpacing: 5, textTransform: 'uppercase',
          color: GOLD, display: 'flex',
        }}>
          Funeral Arrangements
        </div>

        <div style={{
          marginTop: 8, fontSize: 40, fontWeight: 700, letterSpacing: 1, display: 'flex',
        }}>
          15–16 October 2026
        </div>

        <div style={{
          marginTop: 12, fontSize: 21, letterSpacing: 2,
          color: 'rgba(250,248,241,0.82)', display: 'flex',
        }}>
          {venue.city} · {venue.country}
        </div>

        <div style={{
          marginTop: 18, fontSize: 18, letterSpacing: 3, color: GOLD_LIGHT, display: 'flex',
        }}>
          {site.domain}
        </div>
      </div>
    ),
    size,
  );
}
