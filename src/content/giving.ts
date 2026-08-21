/**
 * Giving configuration for a Nigerian foundation with a global donor base.
 *
 * Two facts drive everything here:
 *
 *   1. The foundation is registered in Nigeria. Naira is the home currency and
 *      Nigerian donors should never be pushed through a foreign card rail —
 *      local cards, bank transfer and USSD are cheaper and far more likely to
 *      succeed.
 *
 *   2. A large share of donors will be diaspora, particularly in Canada.
 *      International cards cost roughly 3.8–4.8% versus about 1.5% locally, so
 *      currency and provider are chosen per donor rather than site-wide.
 */

export type CurrencyCode = 'NGN' | 'CAD' | 'USD' | 'GBP';

export type Currency = {
  code: CurrencyCode;
  symbol: string;
  label: string;
  /** Suggested amounts, ordered low to high. */
  presets: number[];
  /** Rough per-transaction cost, shown for transparency, not billed by us. */
  feeNote: string;
};

export const currencies: Currency[] = [
  {
    code: 'NGN', symbol: '₦', label: 'Nigerian Naira',
    presets: [5000, 10000, 25000, 50000, 100000],
    feeNote: 'Local cards, bank transfer and USSD. Lowest processing cost.',
  },
  {
    code: 'CAD', symbol: 'CA$', label: 'Canadian Dollar',
    presets: [25, 50, 100, 250, 500],
    feeNote: 'International card. Processing cost is higher than local giving.',
  },
  {
    code: 'USD', symbol: 'US$', label: 'US Dollar',
    presets: [25, 50, 100, 250, 500],
    feeNote: 'International card. Processing cost is higher than local giving.',
  },
  {
    code: 'GBP', symbol: '£', label: 'Pound Sterling',
    presets: [20, 40, 80, 200, 400],
    feeNote: 'International card. Processing cost is higher than local giving.',
  },
];

export type Fund = { slug: string; title: string; summary: string };

export const funds: Fund[] = [
  { slug: 'general', title: 'General Foundation Fund',
    summary: 'Directed where the need is greatest. The most useful gift.' },
  { slug: 'scholarship', title: 'Scholarship Fund',
    summary: 'Tuition, examination fees and supplies for named students.' },
  { slug: 'education', title: 'Education Fund',
    summary: 'Teacher development and school support.' },
  { slug: 'community', title: 'Community Outreach',
    summary: 'Elder care, family support and local projects.' },
  { slug: 'ministry', title: 'Ministry & Discipleship',
    summary: 'Bible study, prayer and pastoral development.' },
  { slug: 'archive', title: 'Legacy Archive',
    summary: 'Digitising sermons, photographs and documents before they are lost.' },
];

export type Frequency = 'once' | 'monthly' | 'annual';

export const frequencies: { value: Frequency; label: string; note: string }[] = [
  { value: 'once', label: 'One-time gift', note: 'A single contribution.' },
  { value: 'monthly', label: 'Monthly', note: 'Recurring donors become Legacy Partners.' },
  { value: 'annual', label: 'Annual', note: 'Once a year, on a date you choose.' },
];

/**
 * Tax receipting — stated plainly rather than left for a donor to discover.
 *
 * A Nigerian entity cannot issue a Canadian official donation receipt. Under
 * the Income Tax Act only a "qualified donee" may, and the foreign-charity
 * route requires having received a gift from the Government of Canada for
 * disaster relief, urgent humanitarian aid, or activities in Canada's national
 * interest — not a realistic path for a family foundation. The honest options
 * are a separate Canadian registered charity, or partnering with an existing
 * one. Until then, Canadian gifts are simply not receiptable.
 *
 * This is general information, not tax advice. Confirm with a Canadian
 * charity lawyer before publishing anything different.
 */
export const receipting: Record<string, { receiptable: boolean; note: string }> = {
  NGN: {
    receiptable: true,
    note: 'You will receive an acknowledgement from the foundation. Nigerian tax treatment of your gift depends on the foundation\u2019s registration status — confirm with your own adviser.',
  },
  CAD: {
    receiptable: false,
    note: 'The foundation is registered in Nigeria and cannot issue a Canadian tax receipt. Your gift is warmly received and fully acknowledged, but it will not reduce your Canadian tax. A Canadian giving route is being explored.',
  },
  USD: {
    receiptable: false,
    note: 'The foundation is registered in Nigeria and is not a US 501(c)(3), so gifts are not deductible on a US return. Your gift is warmly received and fully acknowledged.',
  },
  GBP: {
    receiptable: false,
    note: 'The foundation is registered in Nigeria, so Gift Aid does not apply. Your gift is warmly received and fully acknowledged.',
  },
};

/**
 * Provider routing.
 *
 * Naira → Paystack. Strongest Nigerian domestic coverage, lowest local fees,
 * and the fee cap makes it cheaper than the alternative on larger naira gifts.
 *
 * Everything else → Flutterwave. Broader multi-currency support and better
 * settlement from Western markets, which is what the diaspora needs.
 *
 * Both are configured independently; if only one is set up, everything routes
 * to it. Fees change — verify current rates with the provider before quoting
 * them to donors.
 */
export function providerFor(currency: CurrencyCode): 'paystack' | 'flutterwave' {
  return currency === 'NGN' ? 'paystack' : 'flutterwave';
}
