import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { site } from '@/config/site';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s | ${site.name}` },
  description: `Continuing the legacy of ${site.subject.name}: a life devoted to God and dedicated to building people through faith, education, leadership, prayer and service.`,
  openGraph: { type: 'website', siteName: site.name, url: site.url },
};

/** Person + Organization structured data — this is how the archive gets found. */
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      name: site.subject.name,
      birthDate: site.subject.born,
      deathDate: site.subject.died,
      jobTitle: ['Teacher', 'Headmaster', 'Pastor'],
    },
    {
      '@type': 'Organization',
      name: site.name,
      url: site.url,
      slogan: site.tagline,
      email: site.contact.email,
      telephone: site.contact.phone,
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      {/*
        .pks scopes the whole design system — see globals.css

        suppressHydrationWarning: password managers, translators and similar
        browser extensions inject classes and attributes onto <body> before
        React hydrates, which React reports as a server/client mismatch. It is
        the extension, not the markup. This suppresses the warning on this one
        element only — it does not affect any child.
      */}
      <body className="pks" suppressHydrationWarning>
        <a href="#main" className="skip">Skip to content</a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
