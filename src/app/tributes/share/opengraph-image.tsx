import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { site } from '@/config/site';

/**
 * The tributes share card.
 *
 * This is the link that gets forwarded into WhatsApp groups, and its whole job
 * is to ask for something: a memory, from someone who knew him. The site card
 * introduces the man; this one makes the request, so the ask survives being
 * pasted somewhere with no other context.
 */

export const runtime = 'nodejs';
export const alt = `Share your memory of ${site.subject.name}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  let portrait = '';
  try {
    const file = await readFile(join(process.cwd(), 'public', 'portrait-og.png'));
    portrait = `data:image/png;base64,${file.toString('base64')}`;
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
              fontSize: 18, letterSpacing: 6, textTransform: 'uppercase',
              color: '#c49a45', display: 'flex',
            }}>
              In memory of
            </div>
          </div>

          <div style={{
            marginTop: 24, fontSize: 68, fontWeight: 700, lineHeight: 1.05, display: 'flex',
          }}>
            <span style={{ color: '#c49a45' }}>Did he</span>
          </div>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, display: 'flex' }}>
            touch your life?
          </div>

          <div style={{
            marginTop: 24, fontSize: 26, lineHeight: 1.45, color: 'rgba(250,248,241,0.88)',
            maxWidth: 540, display: 'flex',
          }}>
            {site.subject.name} — teacher, headmaster, pastor, writer.
            If you knew him, your memory belongs in his archive.
          </div>

          <div style={{
            marginTop: 30, display: 'flex', alignItems: 'center', alignSelf: 'flex-start',
            padding: '13px 26px', borderRadius: 999,
            background: '#c49a45', color: '#051d35',
            fontSize: 21, fontWeight: 700, letterSpacing: 2,
          }}>
            LEAVE A TRIBUTE
          </div>
        </div>

        {portrait && (
          <div style={{ display: 'flex', alignItems: 'center', paddingRight: 56 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={portrait} alt="" width={400} height={351} />
          </div>
        )}
      </div>
    ),
    size,
  );
}
