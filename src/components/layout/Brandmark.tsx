import Link from 'next/link';
import { site } from '@/config/site';

/** Monogram + wordmark, drawn in SVG so there is no logo file to chase. */
export function Brandmark() {
  return (
    <Link href="/" className="brand" aria-label={`${site.name} — home`}>
      <svg viewBox="0 0 44 44" width={42} height={42} aria-hidden="true" style={{ flex: 'none' }}>
        <path d="M22 3.5v9.5M17 7.4h10" stroke="var(--gold-500)" strokeWidth="1.7" strokeLinecap="round" />
        <text x="22" y="36" textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif"
          fontSize="19" fontWeight="700" letterSpacing="0.4">
          <tspan fill="#faf8f1">P</tspan>
          <tspan fill="var(--gold-300)">K</tspan>
          <tspan fill="var(--gold-500)">S</tspan>
        </text>
      </svg>
      <span className="w">
        <b>PK Shidali</b>
        <small>Foundation</small>
        <em>{site.domain}</em>
      </span>
    </Link>
  );
}
