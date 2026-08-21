import { Container } from '@/components/layout/Container';
import { SectionHeading } from '@/components/primitives/SectionHeading';
import { IconCircle } from '@/components/primitives/IconCircle';
import { Icon, iconNames } from '@/components/primitives/Icon';

export const metadata = { title: 'Styleguide', robots: { index: false, follow: false } };

const swatches = [
  ['--ivory', '#FAF8F1', 'Page background'],
  ['--paper', '#FFFFFF', 'Cards'],
  ['--navy-900', '#051D35', 'Footer, deepest field'],
  ['--navy-800', '#082A4A', 'Primary brand, buttons'],
  ['--navy-600', '#0E3D68', 'Hero + quote gradient'],
  ['--gold-500', '#C49A45', 'On navy only — 5.6:1'],
  ['--gold-300', '#E3C77E', 'Hairlines, script, focus ring'],
  ['--gold-700', '#8A6A22', 'Gold text on ivory — 4.9:1'],
  ['--olive', '#64713A', 'Education + community'],
  ['--purple', '#633B73', 'Legacy accent, sparing'],
  ['--ink', '#1C2430', 'Body copy'],
  ['--ink-muted', '#5A6472', 'Secondary copy'],
];

export default function Styleguide() {
  return (
    <>
      <section className="pad">
        <Container>
          <header style={{ maxWidth: 720 }}>
            <h1 className="title">Styleguide</h1>
            <p className="lead" style={{ marginTop: 12 }}>
              Internal reference, noindexed. Every token and primitive in the system, rendered
              once. If a component is not here, it does not exist yet.
            </p>
          </header>

          <div style={{ marginTop: 48 }}>
            <SectionHeading>Colour</SectionHeading>
            <ul className="cards" style={{ marginTop: 30 }}>
              {swatches.map(([name, hex, use]) => (
                <li key={name}>
                  <div style={{ background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-1)', overflow: 'hidden' }}>
                    <div style={{ height: 74, background: hex }} />
                    <div style={{ padding: 16 }}>
                      <p style={{ fontSize: 14, fontWeight: 600 }}>{name}</p>
                      <p style={{ fontSize: 12, color: 'var(--ink-muted)' }}>{hex}</p>
                      <p style={{ marginTop: 8, fontSize: 12, color: 'var(--ink-muted)' }}>{use}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="note" style={{ marginTop: 30, maxWidth: 780 }}>
              <Icon n="info" s={18} />
              <span>
                <strong>Contrast rule.</strong> The original mockup used{' '}
                <code>#C49A45</code> for &ldquo;Learn more&rdquo; links on ivory, which measures
                2.5:1 and fails AA. Use <code>--gold-700</code> for any gold text on a light
                surface. <code>--gold-500</code> is for gold on navy (5.6:1), icon strokes and
                rules only.
              </span>
            </div>
          </div>

          <div style={{ marginTop: 56 }}>
            <SectionHeading>Type</SectionHeading>
            <div style={{ marginTop: 30, padding: 32, background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-1)' }}>
              <p style={{ fontFamily: 'var(--display)', fontSize: 'clamp(2.5rem,6vw,4.5rem)', fontWeight: 600, lineHeight: 1 }}>
                Display
              </p>
              <p className="title" style={{ marginTop: 22 }}>Title — section headings</p>
              <p style={{ marginTop: 18, fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 'clamp(2.75rem,6vw,4.5rem)', color: 'var(--gold-700)', lineHeight: 1 }}>
                Hearts
              </p>
              <p style={{ marginTop: 22, fontSize: 11, fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--gold-700)' }}>
                Eyebrow — Inter 600, 0.18em
              </p>
              <p className="lead" style={{ marginTop: 18, maxWidth: '42rem' }}>
                Body — Inter 400 at 16px with 1.7 leading. This is the reading size for every long
                passage on the site, including the biography and tribute pages.
              </p>
            </div>
          </div>

          <div style={{ marginTop: 56 }}>
            <SectionHeading>Buttons</SectionHeading>
            <div style={{ marginTop: 30, display: 'flex', flexWrap: 'wrap', gap: 14, padding: 32, background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-1)' }}>
              <span className="btn btn-solid"><Icon n="heart" s={16} />Solid</span>
              <span className="btn btn-outline">Outline<Icon n="arrow" s={15} /></span>
              <span className="btn btn-gold"><Icon n="heart" s={16} />Gold</span>
            </div>
            <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 14, padding: 32, background: 'var(--navy-800)', borderRadius: 'var(--radius)' }}>
              <span className="btn btn-solid"><Icon n="heart" s={16} />Solid on navy</span>
              <span className="btn btn-light">Outline light<Icon n="arrow" s={15} /></span>
              <span className="btn btn-ghost"><Icon n="chat" s={15} />Ghost on navy</span>
            </div>
          </div>

          <div style={{ marginTop: 56 }}>
            <SectionHeading>Badges &amp; avatars</SectionHeading>
            <div style={{ marginTop: 30, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 14, padding: 32, background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-1)' }}>
              <span className="badge live">Published</span>
              <span className="badge pending">Pending review</span>
              <span className="badge sample">Sample</span>
              <span className="avatar sm">PS</span>
              <span className="avatar xs">JM</span>
              <IconCircle n="cross" />
              <IconCircle n="seed" size="sm" tone="olive" />
            </div>
          </div>

          <div style={{ marginTop: 56 }}>
            <SectionHeading>Icons</SectionHeading>
            <ul style={{ marginTop: 30, display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(96px,1fr))', gap: 12 }}>
              {iconNames.map((n) => (
                <li key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 14, background: 'var(--paper)', border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)' }}>
                  <Icon n={n} s={24} style={{ color: 'var(--gold-700)' }} />
                  <span style={{ fontSize: 11, color: 'var(--ink-muted)' }}>{n}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
    </>
  );
}
