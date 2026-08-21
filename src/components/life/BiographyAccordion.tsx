'use client';

import { useState } from 'react';
import { Icon } from '@/components/primitives/Icon';
import type { LifeSection } from '@/content/life';

export function BiographyAccordion({ sections }: { sections: LifeSection[] }) {
  const [open, setOpen] = useState<string | null>(sections[0]?.slug ?? null);

  return (
    <ol className="bio">
      {sections.map((s, i) => {
        const isOpen = open === s.slug;
        const written = Boolean(s.body?.length);
        return (
          <li key={s.slug} className="bsec" id={s.slug}>
            <h3>
              <button type="button" className="bhead" aria-expanded={isOpen}
                aria-controls={`panel-${s.slug}`}
                onClick={() => setOpen(isOpen ? null : s.slug)}>
                <span style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
                  <span className="num">{String(i + 1).padStart(2, '0')}</span>
                  <span>
                    <span className="bt">{s.title}</span>
                    <span className="bs">{s.standfirst}</span>
                  </span>
                </span>
                <span className="right">
                  {!written && <span className="badge pending">To be written</span>}
                  <span className={`tog${isOpen ? ' open' : ''}`}><Icon n="plus" s={20} /></span>
                </span>
              </button>
            </h3>

            {isOpen && (
              <div className="bbody" id={`panel-${s.slug}`}>
                {written ? (
                  <div className="prose">{s.body!.map((p) => <p key={p}>{p}</p>)}</div>
                ) : (
                  <div className="prompt">
                    <span className="k">To write this section, gather</span>
                    <ul>{s.prompts.map((q) => <li key={q}>{q}</li>)}</ul>
                  </div>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
