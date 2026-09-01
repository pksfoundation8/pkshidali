import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { site } from '@/config/site';
import { venue } from '@/content/funeral';

/**
 * The livestream card.
 *
 * Same centred memorial composition as the funeral card, so a reader who sees
 * both in a chat recognises them as one notice — the difference is the ask:
 * this one tells someone abroad they can take part without travelling.
 */

export const runtime = 'nodejs';
export const alt = `Watch the services for ${site.subject.name}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const GOLD = '#c49a45';
const GOLD_LIGHT = '#e3c77e';
const IVORY = '#faf8f1';

export default async function Image() {
  const load = async (file: string, mime: string) => {
    try {
      const buf = await readFile(join(process.cwd(), 'public', file));
      return `data:${mime};base64,${buf.toString('base64')}`;
    } catch {
      return '';                      // card still renders without it
    }
  };
  const [portrait, sky] = await Promise.all([
    load('portrait-og.png', 'image/png'),
    load('hero-sky-v2.jpg', 'image/jpeg'),
  ]);

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
        {/* the hero sky, as it appears on the site */}
        {sky && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={sky} alt="" width={1200} height={630}
            style={{ position: 'absolute', top: 0, left: 0, objectFit: 'cover' }} />
        )}

        {/* his portrait, set into that sky rather than floating on flat navy */}
        {portrait && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={portrait} alt="" width={300} height={263}
            style={{ position: 'absolute', top: 52, left: 450 }} />
        )}

        {/* light where the sky should breathe, heavy only under the text */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: 1200, height: 630, display: 'flex',
          background:
            'linear-gradient(180deg, rgba(5,29,53,0.38) 0%, rgba(5,29,53,0.12) 30%, '
            + 'rgba(5,29,53,0.62) 52%, rgba(5,29,53,0.90) 72%, rgba(5,29,53,0.96) 100%)',
        }} />

        <div style={{
          position: 'absolute', top: 22, left: 22, right: 22, bottom: 22,
          border: `1px solid ${GOLD}55`, display: 'flex',
        }} />

        <div style={{
          fontSize: 19, letterSpacing: 6, textTransform: 'uppercase',
          color: GOLD, display: 'flex',
        }}>
          Watch From Anywhere
        </div>

        {/* space reserved for the portrait behind */}
        <div style={{ display: 'flex', height: 244 }} />

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

        {/* drawn rather than the ✦ character, which Satori's font cannot render */}
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
          Both Services Streamed Live
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
          From {venue.city} · Recording to follow
        </div>

        <div style={{
          marginTop: 18, fontSize: 18, letterSpacing: 3, color: GOLD_LIGHT, display: 'flex',
        }}>
          {site.domain}/funeral/livestream
        </div>
      </div>
    ),
    size,
  );
}
