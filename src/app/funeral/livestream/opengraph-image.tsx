import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { site } from '@/config/site';

/**
 * The livestream card. Its job is to tell someone abroad, at a glance, that
 * they can take part without travelling — and when.
 */

export const runtime = 'nodejs';
export const alt = `Watch the services for ${site.subject.name}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  let portrait = '';
  try {
    const file = await readFile(join(process.cwd(), 'public', 'portrait-og.png'));
    portrait = `data:image/png;base64,${file.toString('base64')}`;
  } catch {
    /* card still renders without it */
  }

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', position: 'relative',
        background: 'linear-gradient(115deg, #051d35 0%, #082a4a 48%, #0e3d68 100%)',
        color: '#faf8f1', fontFamily: 'sans-serif',
      }}>
        <div style={{
          position: 'absolute', top: 26, left: 26, right: 26, bottom: 26,
          border: '1px solid rgba(196,154,69,0.55)', display: 'flex',
        }} />

        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '0 60px', flex: 1,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 1, background: '#c49a45', display: 'flex' }} />
            <div style={{
              fontSize: 17, letterSpacing: 5, textTransform: 'uppercase',
              color: '#c49a45', display: 'flex',
            }}>
              Livestream
            </div>
          </div>

          <div style={{ marginTop: 20, fontSize: 62, fontWeight: 700, lineHeight: 1.05, display: 'flex' }}>
            <span style={{ color: '#c49a45' }}>Watch from</span>
          </div>
          <div style={{ fontSize: 62, fontWeight: 700, lineHeight: 1.05, display: 'flex' }}>
            anywhere
          </div>

          <div style={{
            marginTop: 20, fontSize: 23, lineHeight: 1.45, color: 'rgba(250,248,241,0.86)',
            maxWidth: 520, display: 'flex',
          }}>
            Both services for {site.subject.name}, streamed from Ilorin — with a recording
            afterwards for those who cannot watch live.
          </div>

          <div style={{
            marginTop: 24, display: 'flex', alignItems: 'center', alignSelf: 'flex-start',
            padding: '12px 26px', borderRadius: 999,
            background: '#c49a45', color: '#051d35',
            fontSize: 20, fontWeight: 700, letterSpacing: 2,
          }}>
            15 &amp; 16 OCTOBER 2026
          </div>
        </div>

        {portrait && (
          <div style={{ display: 'flex', alignItems: 'center', paddingRight: 50 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={portrait} alt="" width={370} height={325} />
          </div>
        )}
      </div>
    ),
    size,
  );
}
