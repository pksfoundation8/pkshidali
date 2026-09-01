import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { PageBanner } from '@/components/layout/PageBanner';
import { Icon } from '@/components/primitives/Icon';
import { site } from '@/config/site';

export const metadata = { title: 'Page not found' };

/** Renders inside the root layout, so a mistyped URL still lands somewhere
 *  that looks like the site rather than on Next's default page. */
export default function NotFound() {
  return (
    <>
      <PageBanner eyebrow="404" title="We could not find that page"
        intro="The link may be old, or mistyped. Nothing has been lost — here is where most people are going." />
      <section className="pad">
        <Container>
          <ul style={{ maxWidth: 640, display: 'grid', gap: 12 }}>
            {[
              ['/tributes', 'Lives He Touched', 'Tributes and testimonies'],
              ['/his-life', 'His Life', 'Biography and timeline'],
              ['/legacy', 'Legacy Pillars', 'The six principles'],
              ['/archive', 'The Legacy Archive', 'Sermons, photographs, documents'],
              ...(site.donationsEnabled
                ? [['/give', 'Support the Foundation', 'Give in naira or your own currency'] as const]
                : []),
            ].map(([href, title, desc]) => (
              <li key={href}>
                <Link href={href} className="aitem" style={{ width: '100%' }}>
                  <span className="ring sm"><Icon n="arrow" s={18} /></span>
                  <div>
                    <h3>{title}</h3>
                    <p>{desc}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 34 }}>
            <Link href="/" className="btn btn-solid">Back to home</Link>
            <Link href="/contact" className="btn btn-outline">Tell us about the broken link</Link>
          </div>
        </Container>
      </section>
    </>
  );
}
