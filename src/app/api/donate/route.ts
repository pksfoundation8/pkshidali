import { NextResponse } from 'next/server';
import { rateLimit, clientKey } from '@/lib/rate-limit';
import { currencies, funds, frequencies, providerFor, type CurrencyCode } from '@/content/giving';

/**
 * Donation initiation.
 *
 * This route never sees card details. It validates the request, then asks the
 * provider to create a hosted checkout and returns the URL to redirect to.
 * Naira routes to Paystack, everything else to Flutterwave.
 *
 * With no provider keys configured it returns 503 with a clear message, so the
 * page degrades honestly instead of pretending to take money.
 *
 * NOT YET BUILT, and required before going live:
 *   · webhook handlers to confirm payment (never trust the redirect)
 *   · recurring plan creation for monthly and annual gifts
 *   · a donation record written after webhook confirmation, storing only a
 *     provider reference — never card data
 */

export const runtime = 'nodejs';

type Body = {
  currency?: string; fund?: string; frequency?: string; amount?: number;
};

export async function POST(req: Request) {
  const limit = await rateLimit(`donate:${clientKey(req)}`, 12, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many attempts. Please wait a few minutes and try again.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: 'Malformed request body.' }, { status: 400 });
  }

  const currency = currencies.find((c) => c.code === body.currency);
  const fund = funds.find((f) => f.slug === body.fund);
  const frequency = frequencies.find((f) => f.value === body.frequency);
  const amount = Number(body.amount);

  if (!currency) return NextResponse.json({ error: 'Unsupported currency.' }, { status: 422 });
  if (!fund) return NextResponse.json({ error: 'Unknown fund.' }, { status: 422 });
  if (!frequency) return NextResponse.json({ error: 'Unknown frequency.' }, { status: 422 });
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: 'Enter an amount greater than zero.' }, { status: 422 });
  }

  const provider = providerFor(currency.code as CurrencyCode);
  const key = provider === 'paystack'
    ? process.env.PAYSTACK_SECRET_KEY
    : process.env.FLUTTERWAVE_SECRET_KEY;

  if (!key) {
    return NextResponse.json(
      {
        error:
          `Online giving in ${currency.code} is not switched on yet. Please contact the ` +
          `foundation and we will arrange your gift directly.`,
        provider,
      },
      { status: 503 },
    );
  }

  // Provider handoff goes here. Both expose a "create hosted checkout" call
  // that returns a URL; the amount must be sent in the provider's minor unit
  // for Paystack (kobo) and in major units for Flutterwave.
  return NextResponse.json(
    { error: 'Payment provider integration is not complete.', provider },
    { status: 503 },
  );
}
