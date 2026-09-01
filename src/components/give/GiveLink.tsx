import Link from 'next/link';
import type { ReactNode } from 'react';
import { site } from '@/config/site';

/**
 * A link to /give that disappears entirely while giving is switched off.
 *
 * Every donation call to action on the site goes through this, so the whole
 * set is governed by site.donationsEnabled rather than by remembering to edit
 * a dozen pages. Asking for money the foundation cannot yet lawfully receipt
 * would be worse than asking for nothing.
 */
export function GiveLink({ className, style, children }: {
  className?: string; style?: React.CSSProperties; children: ReactNode;
}) {
  if (!site.donationsEnabled) return null;
  return <Link href="/give" className={className} style={style}>{children}</Link>;
}
