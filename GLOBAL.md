# Nigeria-registered, globally supported

**Decision 2 is resolved.** The foundation is Nigerian. The work happens in
Nigeria, and registration, safeguarding law and data law follow from that. But a
large part of the donor base will be diaspora — four of his children are in
Canada — so currency, payment rail and receipting are decided **per donor**
rather than site-wide.

---

## The problem to solve before launch, not after

**A Nigerian foundation cannot issue a Canadian tax receipt.**

Under the Income Tax Act, only a *qualified donee* may issue an official donation
receipt. The foreign-charity route exists, but it requires the organisation to
have received a gift from the Government of Canada and to be doing disaster
relief, urgent humanitarian aid, or work in Canada's national interest — and even
then the status lasts 24 months. That is not a realistic path for a family
foundation.

The realistic options are:

1. **Say so plainly and accept it.** Many diaspora donors give to family causes
   without expecting a receipt. This is what the site does today.
2. **Register a Canadian entity** — a separate charity that grants funds to the
   Nigerian foundation under a written agreement, with the direction-and-control
   requirements that entails.
3. **Partner with an existing Canadian registered charity** willing to act as the
   receipting vehicle for this work.

Option 2 or 3 is a real project with real cost. It should be a deliberate
decision by the board, not something discovered by a donor at checkout.

The same logic applies to the US (no 501(c)(3), so not deductible) and the UK
(no Gift Aid).

*This is general information, not tax or legal advice. Confirm with a Canadian
charity lawyer before publishing anything different.*

### How the site handles it

`/give` states the position **before** the donor commits, not after. The summary
panel carries a "Tax receipt: Not available" row for CAD, USD and GBP, and a
note explains why in plain language. There is also a short section inviting
anyone who needs a receipt to make contact first.

Hiding this would produce exactly one outcome: a donor who feels misled by a
memorial foundation. That is not a trade worth making.

---

## Currency and provider routing

| Currency | Provider | Why |
|---|---|---|
| NGN | **Paystack** | Strongest Nigerian domestic coverage; local cards, bank transfer and USSD. Local fees run around 1.5% with a cap, so it is cheapest on larger naira gifts. |
| CAD / USD / GBP | **Flutterwave** | Broader multi-currency support and better settlement from Western markets — what the diaspora needs. |

International card fees run roughly 3.8–4.8% against about 1.5% locally, which
is why the currency chooser is **step one** on the Give page rather than an
afterthought. A Nigerian donor pushed onto a foreign rail pays more and is more
likely to have the card declined.

Presets are set per currency rather than converted: ₦5,000–₦100,000 against
CA$25–CA$500. Switching currency clears the amount, because carrying a figure
across is a way to accidentally ask someone for far too much.

*Fee figures were current in mid-2026 and change. Verify with the provider
before quoting them to donors.*

### Configuration

```bash
PAYSTACK_SECRET_KEY=            # naira
FLUTTERWAVE_SECRET_KEY=         # everything else
```

Unset, `/api/donate` returns `503` with a clear message and the Give page tells
the donor to contact the foundation directly. It never pretends to take money.

---

## Still to build before taking a payment

- **Provider handoff.** Both expose a create-hosted-checkout call returning a
  URL. Note the units differ: Paystack takes kobo (minor units), Flutterwave
  takes major units.
- **Webhooks.** Never trust the redirect. A donation is only confirmed by a
  verified webhook from the provider.
- **Recurring plans.** Monthly and annual gifts need provider-side plans, not
  repeated one-off charges.
- **Donation records.** Store a provider reference, fund, currency and amount.
  Never card data.
- **The donation policy** at `/policies/donations`, which must state the
  cross-border receipting position explicitly.

## Policy changes that follow from Nigeria

- **Privacy** now has to address the **Nigeria Data Protection Act 2023**, plus
  cross-border transfer — contributor and donor data from Canada, the US and the
  UK is processed outside those countries, which needs disclosure and a lawful
  basis. PIPEDA and UK GDPR expectations should be honoured in practice even
  where they do not strictly bind.
- **Safeguarding** now references the **Child Rights Act 2003** and its
  domestication in the states where the foundation operates, and must set out
  how overseas volunteers and trustees are screened to the same standard.

## Placeholders still outstanding

The registered street address and phone number in `src/config/site.ts` are
placeholders (`[Street address]`, `+234 800 000 0000`). Replace them once CAC
incorporation completes and there is a real registered address.
