'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Icon } from '@/components/primitives/Icon';
import { tributeFilters } from '@/content/tribute-filters';
import { wallMessages } from '@/content/home';
import type { Tribute } from '@/content/home';

const PAGE = 6;

/** Monogram rather than a photograph. Real contributor photos replace these
 *  as they are submitted; stock faces of people who never knew him would
 *  undermine the one thing this archive is for. */
function initials(name: string) {
  const parts = name.replace(/\[.*?\]/g, '').trim().split(/\s+/).slice(0, 2);
  return parts.map((w) => w[0] ?? '').join('').toUpperCase() || '✦';
}

function trim(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}

export function TributesExplorer({ tributes }: { tributes: Tribute[] }) {
  const [active, setActive] = useState('all');
  const [shown, setShown] = useState(PAGE);
  const [slide, setSlide] = useState(0);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<'recent' | 'name'>('recent');

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    tributeFilters.forEach((f) => { c[f.key] = tributes.filter(f.match).length; });
    return c;
  }, [tributes]);

  // Every number here is derived from the actual dataset — the strip grows as
  // real tributes arrive, and never shows a count the archive cannot back up.
  const stats = useMemo(() => ([
    { n: tributes.length, label: tributes.length === 1 ? 'Tribute' : 'Tributes', icon: 'quote' as const },
    { n: tributes.filter((t) => t.hasAudio).length, label: 'Audio', icon: 'audio' as const },
    { n: tributes.filter((t) => t.hasVideo).length, label: 'Video', icon: 'video' as const },
    { n: wallMessages.length, label: 'Wall notes', icon: 'chat' as const },
  ]), [tributes]);

  const filter = tributeFilters.find((f) => f.key === active)!;
  const matching = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const hit = (t: Tribute) => !needle ||
      [t.name, t.body, t.title, t.relationship].filter(Boolean)
        .some((s) => (s as string).toLowerCase().includes(needle));
    const list = tributes.filter((t) => filter.match(t) && hit(t));
    return sort === 'name'
      ? [...list].sort((a, b) => a.name.localeCompare(b.name))
      : list;
  }, [tributes, filter, q, sort]);

  // Featured rotates within the current filter, so the highlight always
  // belongs to what the visitor is actually looking at.
  const featured = matching.filter((t) => t.featured);
  const carousel = featured.length ? featured : matching.slice(0, 1);
  const current = carousel[Math.min(slide, carousel.length - 1)];
  const rest = matching.filter((t) => t.id !== current?.id);
  const visible = rest.slice(0, shown);

  const choose = (key: string) => { setActive(key); setShown(PAGE); setSlide(0); };

  return (
    <>
      <ul className="tfilters" role="group" aria-label="Filter tributes">
        {tributeFilters.filter((f) => !['audio', 'video'].includes(f.key)).map((f) => (
          <li key={f.key}>
            <button type="button" className={`tfilter${active === f.key ? ' on' : ''}`}
              onClick={() => choose(f.key)} aria-pressed={active === f.key}>
              <Icon n={f.icon} s={16} />
              {f.label}
              <span className="n">{counts[f.key] ?? 0}</span>
            </button>
          </li>
        ))}
        {/* media filters stack in their own group at the rail's end */}
        <li className="mediagroup">
          {tributeFilters.filter((f) => ['audio', 'video'].includes(f.key)).map((f) => (
            <button key={f.key} type="button" className={`tfilter${active === f.key ? ' on' : ''}`}
              onClick={() => choose(f.key)} aria-pressed={active === f.key}>
              <Icon n={f.icon} s={15} />
              {f.label}
              <span className="n">{counts[f.key] ?? 0}</span>
            </button>
          ))}
        </li>
      </ul>

      <div className="ttools">
        <div className="search sm">
          <Icon n="search" s={16} />
          <label htmlFor="tq" className="sr">Search tributes</label>
          <input id="tq" type="search" placeholder="Search tributes&hellip;" value={q}
            onChange={(e) => { setQ(e.target.value); setShown(PAGE); setSlide(0); }} />
        </div>
        <label className="sr" htmlFor="tsort">Sort tributes</label>
        <select id="tsort" className="tsort" value={sort}
          onChange={(e) => setSort(e.target.value as 'recent' | 'name')}>
          <option value="recent">Most recent</option>
          <option value="name">By name</option>
        </select>
        <dl className="tstats" aria-label="Archive counts">
          {stats.map((s) => (
            <div key={s.label}>
              <dt><Icon n={s.icon} s={14} />{s.label}</dt>
              <dd>{s.n}</dd>
            </div>
          ))}
        </dl>
      </div>

      {matching.length === 0 ? (
        <div className="empty">
          <p style={{ fontFamily: 'var(--display)', fontSize: 24, color: 'var(--navy-800)' }}>
            Nothing here yet
          </p>
          <p className="lead" style={{ marginTop: 10 }}>
            {q.trim()
              ? <>No tributes match &ldquo;{q.trim()}&rdquo;.</>
              : <>No tributes under &ldquo;{filter.label}&rdquo;. Yours could be the first.</>}
          </p>
        </div>
      ) : (
        <div className="tcols">
          {/* featured */}
          <section aria-label="Featured tribute">
            <h2 className="colhead">Featured tribute</h2>
            {current && (
              <>
                <article className="feat">
                  <span className="tag"><Icon n="star" s={11} />Featured tribute</span>
                  <div className="row">
                    <div className="who-col">
                      <span className="avatar lg" aria-hidden="true">{initials(current.name)}</span>
                      <p className="nm">{current.name}</p>
                      <p className="rl">{current.relationship}</p>
                      {current.years && <p className="yrs">{current.years}</p>}
                    </div>
                    <div>
                      <span className="qm" aria-hidden="true">&ldquo;</span>
                      <q>{trim(current.body, 190)}</q>
                      <div style={{ marginTop: 16 }}>
                        <Link href={`/tributes/${current.id}`} className="tlink">
                          Read full story<Icon n="arrow" s={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>

                {carousel.length > 1 && (
                  <div className="dots">
                    {carousel.map((t, i) => (
                      <button key={t.id} type="button" className={`dot${i === slide ? ' on' : ''}`}
                        onClick={() => setSlide(i)} aria-label={`Featured tribute ${i + 1}`}
                        aria-current={i === slide} />
                    ))}
                  </div>
                )}
              </>
            )}
          </section>

          {/* latest */}
          <section aria-label="Latest tributes">
            <h2 className="colhead">Latest tributes</h2>
            {visible.length === 0 ? (
              <p className="lead" style={{ marginTop: 14, fontSize: 14 }}>
                This is the only one so far.
              </p>
            ) : (
              <ul className="lgrid">
                {visible.map((t) => (
                  <li key={t.id}>
                    <Link href={`/tributes/${t.id}`} className="lcard">
                      {(t.hasAudio || t.hasVideo) && (
                        <span className="corner" title={t.hasVideo ? 'Video tribute' : 'Audio tribute'}>
                          <Icon n={t.hasVideo ? 'video' : 'audio'} s={13} />
                        </span>
                      )}
                      <div className="head">
                        <span className="avatar sm" aria-hidden="true">{initials(t.name)}</span>
                        <span>
                          <span className="nm">{t.name}</span>
                          <span className="rl">{t.relationship}</span>
                        </span>
                      </div>
                      <q>{trim(t.body, 108)}</q>
                      <span className="go">View story<Icon n="arrow" s={13} /></span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {rest.length > shown && (
              <div className="loadmore">
                <button type="button" className="btn btn-solid" onClick={() => setShown(rest.length)}>
                  View all tributes
                  <span aria-hidden="true" style={{ transform: 'rotate(90deg)', display: 'inline-flex' }}>
                    <Icon n="arrow" s={14} />
                  </span>
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
