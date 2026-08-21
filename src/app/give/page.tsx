import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { PageBanner } from '@/components/layout/PageBanner';
import { Icon } from '@/components/primitives/Icon';
import { DonationBuilder } from '@/components/give/DonationBuilder';

export const metadata = {
  title: 'Support the Foundation',
  description:
    'Give in naira, Canadian dollars, US dollars or pounds. Choose the fund and how often you would like to give.',
};

export default function GivePage() {
  return (
    <>
      <PageBanner
        eyebrow="Give"
        title="Support the Foundation"
        intro="He spent his life building people. Choose where your support goes, in the currency that suits you."
      />

      <section className="pad">
        <Container>
          <DonationBuilder />

          <div style={{ maxWidth: 760, marginTop: 56 }}>
            <h2 className="title" style={{ fontSize: 26 }}>Giving from outside Nigeria</h2>
            <p className="lead" style={{ marginTop: 14 }}>
              The foundation is registered in Nigeria, where the work happens. Gifts from Canada,
              the United States and the United Kingdom are welcome and are acknowledged in full,
              but a Nigerian entity cannot issue a tax receipt valid in those countries.
            </p>
            <p className="lead" style={{ marginTop: 14 }}>
              A separate Canadian giving route is being explored, since much of the family is
              there. If you need a receipt for tax purposes, please get in touch before giving
              and we will tell you honestly where that stands.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 30 }}>
              <Link href="/contact" className="btn btn-outline">
                Ask about giving<Icon n="arrow" s={15} />
              </Link>
              <Link href="/policies/donations" className="btn btn-outline">Donation policy</Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
