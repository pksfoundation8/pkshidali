import type { ReactNode } from 'react';

/**
 * THE SIGNATURE ELEMENT — a left-aligned label with a gold hairline running
 * out to the right (v7; the left rule and diamond are retired in CSS but kept
 * in the markup so the treatment can be re-themed without touching pages).
 * There is deliberately no second heading treatment.
 */
export function SectionHeading({ children, dark = false, center = false }: {
  children: ReactNode; dark?: boolean; center?: boolean;
}) {
  return (
    <div className={`sh${dark ? ' dark' : ''}${center ? ' center' : ''}`}>
      <div className="rules">
        <span className="line l" />
        <h2>{children}</h2>
        <span className="line r" />
      </div>
      <span className="dia" aria-hidden="true">&#10022;</span>
    </div>
  );
}
