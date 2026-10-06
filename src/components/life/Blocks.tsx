import { Fragment } from 'react';
import type { Block } from '@/content/life';

/** Renders `**bold**` spans inside a string. */
export function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split('**').map((part, i) =>
        i % 2 === 1 ? <strong key={i}>{part}</strong> : <Fragment key={i}>{part}</Fragment>,
      )}
    </>
  );
}

/** Renders biography content blocks. No client hooks, so it works in both server and client components. */
export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="prose">
      {blocks.map((b, i) => {
        if (typeof b === 'string') return <p key={i}><Inline text={b} /></p>;
        if ('strong' in b) return <p key={i} className="bstrong">{b.strong}</p>;
        if ('list' in b) {
          return (
            <ul key={i} className="blist">
              {b.list.map((item) => <li key={item}>{item}</li>)}
            </ul>
          );
        }
        return (
          <dl key={i} className="bsteps">
            {b.steps.map(([title, text]) => (
              <Fragment key={title}>
                <dt>{title}</dt>
                <dd>{text}</dd>
              </Fragment>
            ))}
          </dl>
        );
      })}
    </div>
  );
}
