import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { PageBanner } from '@/components/layout/PageBanner';
import { Icon } from '@/components/primitives/Icon';
import { archiveSections } from '@/content/pages';

export const metadata = {
  title: 'The Legacy Archive',
  description: 'Photographs, sermons, Bible notes, documents, audio and video — the documentary record of his life.',
};

export default function ArchivePage() {
  return (
    <>
      <PageBanner eyebrow="Archive" title="The Legacy Archive"
        intro="Photographs, sermons, handwritten Bible notes, letters, certificates, school records and recordings. Over time this becomes the documentary record of a life." />

      <section className="pad">
        <Container>
          <div style={{ maxWidth: 760 }}>
            <p className="lead">
              This is the part of the site that will matter most in fifty years, and the part most
              at risk right now. Paper degrades, cassettes demagnetise, and the people who can
              identify a face in a photograph do not stay with us indefinitely.
            </p>
          </div>

          <ul className="tiles">
            {archiveSections.map((s) => (
              <li key={s.slug}>
                <Link href={`/archive/${s.slug}`} className="tile">
                  <span className="field" aria-hidden="true" />
                  <span className="glyph" aria-hidden="true"><Icon n={s.icon} s={54} /></span>
                  <span className="txt">
                    <b>{s.title}</b>
                    <small>{s.records.length} {s.records.length === 1 ? 'record' : 'records'}</small>
                  </span>
                  <span className="chev" aria-hidden="true"><Icon n="arrow" s={16} /></span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="note" style={{ maxWidth: 760, marginTop: 40 }}>
            <Icon n="info" s={18} />
            <span>
              Records currently shown are placeholders illustrating the shape of a catalogue entry.
              Digitisation of real material is the next priority, and it is work that can be done
              from anywhere in the world.
            </span>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 32 }}>
            <Link href="/contact" className="btn btn-solid">Contribute material</Link>
            <Link href="/get-involved" className="btn btn-outline">
              Help digitise it<Icon n="arrow" s={15} />
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
