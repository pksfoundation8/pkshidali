import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { site } from '@/config/site';

/**
 * The share card.
 *
 * This site will spread through WhatsApp groups and family chats far more than
 * through search. Without this, every one of those links renders as bare text.
 *
 * Deliberately built from shapes, rules and letterspacing rather than a display
 * serif: ImageResponse would need a font file fetched at render time, which
 * adds latency and a failure mode. The composition carries the identity instead.
 */

export const runtime = 'nodejs';
export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  let portrait = '';
  try {
    const file = await readFile(join(process.cwd(), 'public', 'portrait.jpg'));
    portrait = `data:image/jpeg;base64,${file.toString('base64')}`;
  } catch {
    // Card still renders without it.
  }

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', position: 'relative',
        background: 'linear-gradient(115deg, #051d35 0%, #082a4a 48%, #0e3d68 100%)',
        color: '#faf8f1', fontFamily: 'sans-serif',
      }}>
        {/* gold hairline frame */}
        <div style={{
          position: 'absolute', top: 26, left: 26, right: 26, bottom: 26,
          border: '1px solid rgba(196,154,69,0.55)', display: 'flex',
        }} />

        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '0 64px', flex: 1,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 1, background: '#c49a45', display: 'flex' }} />
            <div style={{
              fontSize: 19, letterSpacing: 6, textTransform: 'uppercase',
              color: '#c49a45', display: 'flex',
            }}>
              Continuing the Legacy of
            </div>
          </div>

          <div style={{
            marginTop: 22, fontSize: 74, fontWeight: 700, lineHeight: 1.02, display: 'flex',
          }}>
            <span style={{ color: '#c49a45' }}>Rev.&nbsp;Paul</span>
          </div>
          <div style={{ fontSize: 74, fontWeight: 700, lineHeight: 1.02, display: 'flex' }}>
            Kadir Shidali
          </div>

          <div style={{
            marginTop: 26, fontSize: 24, lineHeight: 1.5, color: 'rgba(250,248,241,0.85)',
            maxWidth: 560, display: 'flex',
          }}>
            {site.tagline}
          </div>

          <div style={{
            marginTop: 30, fontSize: 19, letterSpacing: 3, color: 'rgba(227,199,126,0.9)',
            display: 'flex',
          }}>
            {site.subject.bornLabel} — {site.subject.diedLabel}
          </div>
        </div>

        {portrait && (
          <div style={{ display: 'flex', alignItems: 'center', paddingRight: 70 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={portrait} alt="" width={272} height={307}
              style={{
                borderRadius: '150px 150px 8px 8px',
                border: '2px solid rgba(196,154,69,0.7)',
                objectFit: 'cover',
              }} />
          </div>
        )}
      </div>
    ),
    size,
  );
}
