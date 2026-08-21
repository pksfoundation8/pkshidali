import Link from 'next/link';
import { Icon } from '@/components/primitives/Icon';
import { wallMessages, wallScripture } from '@/content/home';

/**
 * A lighter contribution than a full tribute — one or two sentences, easy to
 * leave from a phone. Still moderated, still consented to, still permanent.
 */
export function LegacyWall() {
  return (
    <section className="wall" id="legacy-wall" aria-label="Legacy Wall">
      <div className="lead-col">
        <h3>Legacy Wall</h3>
        <p>Short messages of love, gratitude and remembrance from the community.</p>
        <Link href="/tributes/share" className="btn btn-solid"
          style={{ marginTop: 14, padding: '10px 18px' }}>
          Add a message
        </Link>
      </div>

      {wallMessages.slice(0, 3).map((m) => (
        <article key={m.id} className="wmsg">
          <q>{m.body}</q>
          <span className="nm">&mdash; {m.name}</span>
        </article>
      ))}

      <aside className="scrip">
        <span className="cross" aria-hidden="true"><Icon n="cross" s={92} /></span>
        <div>
          <p>{wallScripture.text}</p>
          <p className="ref">&mdash; {wallScripture.reference}</p>
        </div>
      </aside>
    </section>
  );
}
