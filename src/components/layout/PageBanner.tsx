import { Container } from './Container';
import { CelestialBackdrop } from '@/components/home/CelestialBackdrop';

export function PageBanner({ eyebrow, title, intro }: {
  eyebrow?: string; title: string; intro?: string;
}) {
  return (
    <section className="pbanner">
      <CelestialBackdrop even />
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
