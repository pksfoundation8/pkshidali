'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/primitives/Icon';

/**
 * Light a candle in his honour. Phase 1 counts on this device only
 * (localStorage); Phase 3 moves the tally server-side with the tribute
 * moderation backend so the number becomes collective. No seeded or
 * invented count — the figure shown is always real.
 */
export function CandleCard() {
  const [count, setCount] = useState<number | null>(null);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    setCount(Number(localStorage.getItem('pks-candles') ?? 0));
    setLit(localStorage.getItem('pks-candle-lit') === '1');
  }, []);

  const light = () => {
    if (lit || count === null) return;
    const n = count + 1;
    setCount(n);
    setLit(true);
    localStorage.setItem('pks-candles', String(n));
    localStorage.setItem('pks-candle-lit', '1');
  };

  return (
    <aside className="panel candle-card" aria-label="Light a candle">
      <span className="ring sm" aria-hidden="true"><Icon n="candle" s={20} /></span>
      <h3>Light a Candle</h3>
      <p>Light a candle in honour of Rev. Paul Kadir Shidali.</p>
      <p className="count">
        <b>{count ?? '—'}</b> {count === 1 ? 'candle' : 'candles'} lit on this device
      </p>
      <button type="button" className="btn btn-gold" onClick={light} disabled={lit}
        style={{ width: '100%' }}>
        <Icon n="candle" s={15} />{lit ? 'Candle lit — thank you' : 'Light a candle'}
      </button>
    </aside>
  );
}
