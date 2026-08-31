'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Icon } from '@/components/primitives/Icon';
import type { IconName } from '@/components/primitives/Icon';
import type { GestureKind } from '@/lib/gestures';

const OPTIONS: { kind: Exclude<GestureKind, 'candle'>; icon: IconName; label: string }[] = [
  { kind: 'flowers', icon: 'seed', label: 'Send Flowers' },
  { kind: 'dove', icon: 'send', label: 'Send a Dove' },
  { kind: 'heart', icon: 'heart', label: 'Leave a Heart' },
];

/**
 * Symbolic tributes — one tap each per device (localStorage flag), collective
 * counts from /api/gestures. Companion to the candle card.
 */
export function SymbolicTribute() {
  const [counts, setCounts] = useState<Record<string, number> | null>(null);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [available, setAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    const flags: Record<string, boolean> = {};
    OPTIONS.forEach((o) => { flags[o.kind] = localStorage.getItem(`pks-lit-${o.kind}`) === '1'; });
    setDone(flags);
    fetch('/api/gestures')
      .then((r) => (r.ok ? r.json() : null))
      .then((c) => {
        if (!c) return;
        setCounts(c);
        setAvailable(c.available !== false);
      })
      .catch(() => {});
  }, []);

  const send = async (kind: string) => {
    if (done[kind] || busy) return;
    setBusy(kind);
    try {
      const res = await fetch('/api/gestures', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ kind }),
      });
      if (res.ok) {
        setCounts(await res.json());
        setDone((d) => ({ ...d, [kind]: true }));
        localStorage.setItem(`pks-lit-${kind}`, '1');
      }
    } catch {
      /* next tap retries */
    } finally {
      setBusy(null);
    }
  };

  if (available === false) return null;

  return (
    <div className="panel symb" aria-label="Leave a symbolic tribute">
      <h3>Leave a Symbolic Tribute</h3>
      <ul>
        {OPTIONS.map((o) => (
          <li key={o.kind}>
            <button type="button" onClick={() => send(o.kind)}
              disabled={done[o.kind] || busy === o.kind}
              className={done[o.kind] ? 'on' : ''}>
              <span className="ring sm"><Icon n={o.icon} s={18} /></span>
              {o.label}
              <b className="ct">{counts ? counts[o.kind] : '—'}</b>
            </button>
          </li>
        ))}
      </ul>
      <Link href="/tributes" className="tlink" style={{ marginTop: 14 }}>
        View all tributes<Icon n="arrow" s={13} />
      </Link>
    </div>
  );
}
