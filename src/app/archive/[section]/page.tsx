import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { PageBanner } from '@/components/layout/PageBanner';
import { IconCircle } from '@/components/primitives/IconCircle';
import { Icon } from '@/components/primitives/Icon';
import { archiveSections } from '@/content/pages';
import { getArchiveRecords } from '@/lib/content';

export function generateStaticParams() {
  return archiveSections.map((s) => ({ section: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const s = archiveSections.find((x) => x.slug === section);
  return s ? { title: s.title, description: s.intro } : {};
}

export default async function ArchiveSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const s = archiveSections.find((x) => x.slug === section);
  if (!s) notFound();

  const records = await getArchiveRecords(s.slug);

  return (
    <>
      <PageBanner eyebrow="Legacy Archive" title={s.title} intro={s.intro} />
      <section className="pad">
        <Container>
          <Link href="/archive" className="crumb" style={{ color: 'var(--gold-700)' }}>
            <Icon n="back" s={14} />Whole archive
          </Link>

          {records.every((r) => r.sample) && (
            <div className="note" style={{ marginTop: 24, maxWidth: 760 }}>
              <Icon n="info" s={18} />
              <span>
                Every record below is a placeholder showing the shape of a catalogue entry.
                Digitisation of real material begins in Phase 3.
              </span>
            </div>
          )}

          <ul className="arch" style={{ marginTop: 28 }}>
            {records.map((r) => (
              <li key={r.id} className={`aitem${r.image ? ' has-thumb' : ''}`}>
                {r.image ? (
                  <a className="athumb" href={r.image.url} target="_blank" rel="noopener noreferrer"
                    aria-label={`View ${r.title} at full size`}>
                    <Image src={r.image.url} alt={r.title}
                      width={r.image.width} height={r.image.height}
                      sizes="(max-width: 767px) 100vw, 220px"
                      placeholder={r.image.lqip ? 'blur' : 'empty'}
                      blurDataURL={r.image.lqip} />
                  </a>
                ) : (
                  <IconCircle n={s.icon} size="sm" />
                )}
                <div>
                  {r.sample && <span className="badge sample">Sample</span>}
                  <h3 style={{ marginTop: 8 }}>{r.title}</h3>
                  <p className="meta">{r.meta}</p>
                  <p>{r.desc}</p>
                </div>
              </li>
            ))}
          </ul>

          <div style={{ maxWidth: 760, marginTop: 48 }}>
            <h2 className="title" style={{ fontSize: 26 }}>What each entry must carry</h2>
            <p className="lead" style={{ marginTop: 12 }}>
              Recording this consistently is what makes the collection searchable in twenty years
              rather than a folder of untitled files.
            </p>
            <ul style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {s.fields.map((f) => (
                <li key={f} style={{ display: 'flex', gap: 12, fontSize: 15.5, lineHeight: 1.7, color: 'var(--ink-muted)' }}>
                  <span style={{ color: 'var(--gold-500)', flex: 'none' }}><Icon n="check" s={18} /></span>{f}
                </li>
              ))}
            </ul>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 40 }}>
              <Link href="/contact" className="btn btn-solid">Contribute material</Link>
              <Link href="/archive" className="btn btn-outline">Other sections<Icon n="arrow" s={15} /></Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
