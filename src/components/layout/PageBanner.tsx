import { Container } from './Container';
import { CelestialBackdrop } from '@/components/home/CelestialBackdrop';

/** Inner-page banner. Pass `sky` for the photographic sky and the
 *  courage-and-victory motion used on the main heroes. */
export function PageBanner({ eyebrow, title, intro, sky = false }: {
  eyebrow?: string; title: string; intro?: string; sky?: boolean;
}) {
  return (
    <section className={sky ? 'pbanner sky' : 'pbanner'}>
      <CelestialBackdrop even sky={sky} />
      <Container className="in">
        {eyebrow && <span className="crumb" style={{ cursor: 'default' }}>&#10022; {eyebrow}</span>}
        <h1>{title}</h1>
        <div className="hrule" aria-hidden="true">
          <span className="a" /><span className="d">&#10022;</span><span className="b" />
        </div>
        {intro && <p>{intro}</p>}
      </Container>
    </section>
  );
}
