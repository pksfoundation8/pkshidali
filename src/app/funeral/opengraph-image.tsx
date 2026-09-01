import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { site } from '@/config/site';
import { funeralEvents, venue } from '@/content/funeral';

/**
 * The funeral announcement card.
 *
 * This link will be forwarded into WhatsApp groups by people who will not add
 * any context of their own, so the card has to carry the whole notice: whose
 * services, which days, what times, and where.
 */

export const runtime = 'nodejs';
export const alt = `Funeral arrangements for ${site.subject.name}`;
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

  const row = (label: string, when: string) => (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 10 }}>
      <div style={{ fontSize: 25, fontWeight: 700, color: '#faf8f1', display: 'flex' }}>{label}</div>
      <div style={{ fontSize: 23, color: '#e3c77e', display: 'flex' }}>{when}</div>
    </div>
  );

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
              Funeral Arrangements
            </div>
          </div>

          <div style={{
            marginTop: 18, fontSize: 52, fontWeight: 700, lineHeight: 1.05, display: 'flex',
          }}>
            {site.subject.name}
          </div>
          <div style={{ marginTop: 8, fontSize: 20, color: 'rgba(250,248,241,0.7)', display: 'flex' }}>
            {site.subject.bornLabel} — {site.subject.diedLabel}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 22 }}>
            {row(funeralEvents[0].title, 'Thu 15 Oct · 5:00 PM')}
            {row(funeralEvents[1].title, 'Fri 16 Oct · 10:00 AM')}
          </div>

          <div style={{
            marginTop: 18, fontSize: 20, color: 'rgba(250,248,241,0.82)', display: 'flex',
          }}>
            {venue.name}, {venue.city}
          </div>

          <div style={{
            marginTop: 24, display: 'flex', alignItems: 'center', alignSelf: 'flex-start',
            padding: '12px 26px', borderRadius: 999,
            background: '#c49a45', color: '#051d35',
            fontSize: 20, fontWeight: 700, letterSpacing: 2,
          }}>
            DETAILS &amp; RSVP
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
