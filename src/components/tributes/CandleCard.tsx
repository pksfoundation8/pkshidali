'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/primitives/Icon';

/**
 * Light a candle in his honour. The tally is collective, served by
 * /api/gestures; a localStorage flag keeps it to one candle per device.
 * The count shown is always the real one — never seeded.
 */
export function CandleCard() {
  const [count, setCount] = useState<number | null>(null);
  const [lit, setLit] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setLit(localStorage.getItem('pks-lit-candle') === '1');
    fetch('/api/gestures')
      .then((r) => (r.ok ? r.json() : null))
      .then((c) => c && setCount(c.candle))
      .catch(() => {});
  }, []);

  const light = async () => {
    if (lit || busy) return;
    setBusy(true);
    try {
      const res = await fetch('/api/gestures', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ kind: 'candle' }),
      });
      if (res.ok) {
        const c = await res.json();
        setCount(c.candle);
        setLit(true);
        localStorage.setItem('pks-lit-candle', '1');
      }
    } catch {
      /* leave the button usable; the next tap can retry */
    } finally {
      setBusy(false);
    }
  };

  return (
    <aside className="panel candle-card" aria-label="Light a candle">
      <span className="ring sm" aria-hidden="true"><Icon n="candle" s={20} /></span>
      <h3>Light a Candle</h3>
      <p>Light a candle in honour of Rev. Paul Kadir Shidali.</p>
      <p className="count">
        <b>{count ?? '—'}</b> {count === 1 ? 'candle lit' : 'candles lit'}
      </p>
      <button type="button" className="btn btn-gold" onClick={light} disabled={lit || busy}
        style={{ width: '100%' }}>
        <Icon n="candle" s={15} />{lit ? 'Candle lit — thank you' : 'Light a candle'}
      </button>
    </aside>
  );
}
