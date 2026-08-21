'use client';

import { useMemo, useState } from 'react';
import { Icon } from '@/components/primitives/Icon';
import {
  currencies, funds, frequencies, receipting, providerFor,
  type CurrencyCode, type Frequency,
} from '@/content/giving';

function format(amount: number, code: CurrencyCode) {
  const c = currencies.find((x) => x.code === code)!;
  return `${c.symbol}${amount.toLocaleString()}`;
}

export function DonationBuilder() {
  const [code, setCode] = useState<CurrencyCode>('NGN');
  const [fund, setFund] = useState('general');
  const [freq, setFreq] = useState<Frequency>('monthly');
  const [preset, setPreset] = useState<number | null>(null);
  const [custom, setCustom] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'unavailable' | 'failed'>('idle');
  const [message, setMessage] = useState('');

  const currency = currencies.find((c) => c.code === code)!;
  const fundTitle = funds.find((f) => f.slug === fund)!.title;
  const freqLabel = frequencies.find((f) => f.value === freq)!.label;
  const receipt = receipting[code];

  // Reset the amount when currency changes — ₦25,000 and CA$25,000 are not
  // the same suggestion, and carrying one across is a way to take too much.
  const amount = useMemo(() => {
    if (custom !== '') return Math.max(0, Number(custom) || 0);
    return preset ?? currency.presets[1];
  }, [custom, preset, currency]);

  const annualised = freq === 'monthly' ? amount * 12 : amount;

  const switchCurrency = (next: CurrencyCode) => {
    setCode(next);
    setPreset(null);
    setCustom('');
    setState('idle');
  };

  const proceed = async () => {
    setState('sending');
    setMessage('');
    try {
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currency: code, fund, frequency: freq, amount }),
      });
      const data = await res.json();

      if (res.ok && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }
      if (res.status === 503) {
        setState('unavailable');
        setMessage(data.error ?? '');
        return;
      }
      setState('failed');
      setMessage(data.error ?? 'Something went wrong. Please try again shortly.');
    } catch {
      setState('failed');
      setMessage('We could not reach the payment provider. Please try again shortly.');
    }
  };

  return (
    <div className="give">
      <div>
        {/* 1 ── currency first: it changes the amounts, the fees and the receipt */}
        <h2 style={{ fontSize: 26 }}>1. Choose a currency</h2>
        <p className="lead" style={{ marginTop: 10, fontSize: 14.5 }}>
          Giving in naira costs the foundation the least. If you are outside Nigeria, choose your
          own currency — your card is far more likely to go through.
        </p>
        <ul className="chips" style={{ marginTop: 18 }}>
          {currencies.map((c) => (
            <li key={c.code}>
              <button type="button" className={`chip${code === c.code ? ' on' : ''}`}
                onClick={() => switchCurrency(c.code)} aria-pressed={code === c.code}>
                {c.symbol} {c.code}
              </button>
            </li>
          ))}
        </ul>
        <p className="hint" style={{ marginTop: 12 }}>{currency.feeNote}</p>

        {/* 2 ── fund */}
        <h2 style={{ fontSize: 26, marginTop: 42 }}>2. Choose a fund</h2>
        <div className="opts">
          {funds.map((f) => (
            <button key={f.slug} type="button" className={`opt${fund === f.slug ? ' on' : ''}`}
              onClick={() => setFund(f.slug)} aria-pressed={fund === f.slug}>
              <span className="ring sm" style={{ width: 34, height: 34 }}>
                <Icon n={fund === f.slug ? 'check' : 'heart'} s={15} />
              </span>
              <span><b>{f.title}</b><small>{f.summary}</small></span>
            </button>
          ))}
        </div>

        {/* 3 ── frequency */}
        <h2 style={{ fontSize: 26, marginTop: 42 }}>3. Choose a frequency</h2>
        <div className="opts" style={{ gridTemplateColumns: '1fr' }}>
          {frequencies.map((f) => (
            <button key={f.value} type="button" className={`opt${freq === f.value ? ' on' : ''}`}
              onClick={() => setFreq(f.value)} aria-pressed={freq === f.value}>
              <span className="ring sm" style={{ width: 34, height: 34 }}>
                <Icon n={freq === f.value ? 'check' : 'star'} s={15} />
              </span>
              <span><b>{f.label}</b><small>{f.note}</small></span>
            </button>
          ))}
        </div>

        {/* 4 ── amount */}
        <h2 style={{ fontSize: 26, marginTop: 42 }}>4. Choose an amount</h2>
        <div className="amts">
          {currency.presets.map((a) => (
            <button key={a} type="button"
              className={`amt${custom === '' && amount === a ? ' on' : ''}`}
              onClick={() => { setPreset(a); setCustom(''); }}>
              {format(a, code)}
            </button>
          ))}
        </div>
        <div className="field" style={{ maxWidth: 300 }}>
          <label htmlFor="custom">Or enter another amount ({currency.symbol})</label>
          <input id="custom" type="number" min="1" inputMode="decimal" value={custom}
            onChange={(e) => setCustom(e.target.value)} placeholder="Custom amount" />
        </div>

        {/* Receipting: said up front, not buried after the gift */}
        <div className="note" style={{ marginTop: 32 }}>
          <Icon n="info" s={18} />
          <span>
            <strong>{receipt.receiptable ? 'Acknowledgement' : 'No tax receipt for this currency.'}</strong>{' '}
            {receipt.note}
          </span>
        </div>
      </div>

      <aside className="summary">
        <h3>Your gift</h3>
        <dl>
          <div className="row"><dt>Fund</dt><dd>{fundTitle}</dd></div>
          <div className="row"><dt>Frequency</dt><dd>{freqLabel}</dd></div>
          <div className="row"><dt>Currency</dt><dd>{currency.label}</dd></div>
          {freq === 'monthly' && (
            <div className="row"><dt>Per year</dt><dd>{format(annualised, code)}</dd></div>
          )}
          {freq === 'monthly' && (
            <div className="row"><dt>Recognition</dt><dd style={{ color: 'var(--gold-300)' }}>Legacy Partner</dd></div>
          )}
          <div className="row">
            <dt>Tax receipt</dt>
            <dd>{receipt.receiptable ? 'Acknowledgement issued' : 'Not available'}</dd>
          </div>
        </dl>

        <div className="tot">
          <span>{freq === 'once' ? 'Total' : `Per ${freq === 'monthly' ? 'month' : 'year'}`}</span>
          <b>{format(amount, code)}</b>
        </div>

        <button type="button" className="btn btn-gold" style={{ width: '100%', marginTop: 24 }}
          disabled={amount <= 0 || state === 'sending'} onClick={proceed}>
          <Icon n="heart" s={16} />
          {state === 'sending' ? 'Opening checkout…' : 'Continue to payment'}
        </button>

        {(state === 'unavailable' || state === 'failed') && (
          <p style={{ marginTop: 14, fontSize: 12.5, lineHeight: 1.7, color: 'var(--gold-300)' }}>
            {message}
          </p>
        )}

        <p style={{ marginTop: 16, fontSize: 12, lineHeight: 1.65, color: 'rgba(250,248,241,.6)' }}>
          Payment is completed on {providerFor(code) === 'paystack' ? 'Paystack' : 'Flutterwave'}&rsquo;s
          own secure checkout. Card details never touch this site.
        </p>
      </aside>
    </div>
  );
}
