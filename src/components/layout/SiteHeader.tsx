'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Brandmark } from './Brandmark';
import { Container } from './Container';
import { Icon } from '@/components/primitives/Icon';
import { primaryNav, secondaryNav } from '@/config/site';

/**
 * Eight primary items (plan §0.3); the bar is visible from 1024px and
 * collapses to the drawer below that. The drawer appends secondaryNav
 * (Stories, Get Involved, Contact, Share a Tribute).
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Every public page opens on a dark celestial band, so the bar floats
  // transparent at the top and turns solid navy on scroll or when the drawer
  // is open. /styleguide is the one light-topped page.
  const clear = pathname !== '/styleguide' && !scrolled && !open;

  return (
    <header className={clear ? 'hdr2 clear' : 'hdr2'}>
      <Container className="bar2">
        <Brandmark />

        <nav className="nav2" aria-label="Primary">
          {primaryNav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={active ? 'on' : ''}
                aria-current={active ? 'page' : undefined}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/archive" className="icobtn" title="Search the archive">
            <span className="sr">Search the archive</span>
            <Icon n="search" s={17} />
          </Link>

          <Link href="/give" className="give-btn">
            <Icon n="heart" s={15} />Donate
          </Link>

          <button type="button" className="burger" onClick={() => setOpen((v) => !v)}
            aria-expanded={open} aria-controls="mobile-nav">
            <span className="sr">{open ? 'Close menu' : 'Open menu'}</span>
            <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke="currentColor"
              strokeWidth={1.6} strokeLinecap="round" aria-hidden="true">
              {open
                ? <><path d="M6 6l12 12" /><path d="M18 6L6 18" /></>
                : <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>}
            </svg>
          </button>
        </div>
      </Container>

      <div id="mobile-nav" className="drawer" hidden={!open}>
        <Container>
          <div style={{ paddingTop: 4, paddingBottom: 20 }}>
            {primaryNav.map((item) => (
              <Link key={item.href} href={item.href} className={item.href === '/give' ? 'gold' : ''}>
                {item.label}
              </Link>
            ))}
            {secondaryNav.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </header>
  );
}
