import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { PageBanner } from '@/components/layout/PageBanner';
import { Icon } from '@/components/primitives/Icon';
import { policies } from '@/content/pages';

export function generateStaticParams() {
  return policies.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = policies.find((x) => x.slug === slug);
  return p ? { title: p.title, description: p.intro, robots: { index: false } } : {};
}

/**
 * Policies are legal documents and this software does not draft them.
 * Each page publishes the outline of what the policy must cover, so the
 * foundation and its counsel can see exactly what is outstanding.
 */
export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = policies.find((x) => x.slug === slug);
  if (!p) notFound();

  return (
    <>
      <PageBanner eyebrow="Policy" title={p.title} intro={p.intro} />
      <section className="pad">
        <Container>
          <div style={{ maxWidth: 760 }}>
            <div className="note">
              <Icon n="info" s={18} />
              <span>
                <strong>Not yet published.</strong> This is a legal document and must be drafted and
                approved by the foundation and its counsel — not generated. {p.urgency} What follows
                is the outline of what it needs to cover.
              </span>
            </div>

            {p.sections.map((sec) => (
              <div key={sec.heading} style={{ marginTop: 40 }}>
                <h2 className="title" style={{ fontSize: 26 }}>{sec.heading}</h2>
                <ul style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {sec.points.map((pt) => (
                    <li key={pt} style={{ display: 'flex', gap: 12, fontSize: 15.5, lineHeight: 1.7, color: 'var(--ink-muted)' }}>
                      <span style={{ color: 'var(--gold-500)', flex: 'none' }}><Icon n="check" s={18} /></span>{pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 44 }}>
              <Link href="/contact" className="btn btn-solid">Contact the foundation</Link>
              <Link href="/" className="btn btn-outline">Back to home</Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
