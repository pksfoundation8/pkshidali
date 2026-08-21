/**
 * Atmosphere drawn in SVG and CSS, with an optional photographic sky.
 * Heroes that pass `sky` render public/hero-sky.jpg beneath the stars and
 * scrim when the file exists (plan §0.5 permits imagery as abstract
 * atmosphere behind text). Presence is detected in next.config.mjs and
 * exposed as NEXT_PUBLIC_HERO_SKY; until the approved image is added the
 * gradient base renders alone — nothing 404s and nothing breaks.
 */

// Fixed positions so server and client markup match. No randomness.
const STARS: [number, number, number][] = [
  [4,12,1.1],[9,31,.7],[13,8,.9],[17,46,.6],[21,19,1.3],[26,63,.8],[30,5,.7],[34,38,1],
  [39,71,.6],[43,15,.9],[47,52,1.2],[52,27,.7],[56,9,1],[61,44,.8],[65,68,.6],[69,22,1.1],
  [73,55,.9],[78,13,.7],[82,37,1.2],[86,60,.8],[90,18,1],[94,42,.7],[97,7,.9],[7,57,.6],
  [24,84,.7],[45,88,.6],[59,79,.8],[71,91,.6],[88,76,.7],[15,73,.9],
];

/** True when public/hero-sky.jpg is present (detected in next.config.mjs).
 *  Heroes use it to skip the SVG hill — the photo carries its own cross. */
export const hasHeroSky = process.env.NEXT_PUBLIC_HERO_SKY === '1';

export function CelestialBackdrop({ even = false, sky = false }: { even?: boolean; sky?: boolean }) {
  const hasSky = sky && hasHeroSky;
  return (
    <div className="bd" aria-hidden="true">
      <div className="bd-base" />
      {hasSky && <div className="bd-sky" />}
      {hasSky && <div className="bd-victory" />}
      <svg className="bd-stars" viewBox="0 0 100 100" preserveAspectRatio="none">
        {STARS.map(([x, y, r], i) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r * 0.16} fill="var(--gold-300)"
            style={{ animationDelay: `${(i % 7) * 0.7}s` }} />
        ))}
      </svg>
      <div className="bd-hor" />
      <div className={`bd-scrim${even ? ' even' : ''}`} />
    </div>
  );
}

/** Sunburst rendered inside the portrait wrapper so it always stays aligned. */
export function PortraitBurst() {
  const rays = [];
  for (let i = 0; i < 44; i++) {
    const a = (i / 44) * Math.PI * 2;
    rays.push(
      <line key={i} x1={Math.cos(a) * 11} y1={Math.sin(a) * 11}
        x2={Math.cos(a) * 100} y2={Math.sin(a) * 100} />
    );
  }
  return (
    <svg className="pburst" viewBox="-100 -100 200 200" aria-hidden="true">
      <g stroke="var(--gold-300)" strokeWidth=".38">{rays}</g>
      {[24, 40, 58, 78].map((r) => (
        <circle key={r} r={r} fill="none" stroke="var(--gold-300)" strokeWidth=".3" opacity=".45" />
      ))}
    </svg>
  );
}

/** Cross on a hill, far right of the hero. */
export function Hill() {
  return (
    <svg className="hill" viewBox="0 0 520 240" aria-hidden="true">
      <path d="M0 240 C110 208 168 150 260 138 C352 126 420 186 520 168 L520 240Z" fill="rgba(5,29,53,.55)" />
      <circle cx="256" cy="96" r="72" fill="rgba(227,199,126,.10)" />
      <path d="M256 138 V58 M236 80 h40" stroke="rgba(227,199,126,.85)" strokeWidth="7"
        strokeLinecap="round" fill="none" />
    </svg>
  );
}
