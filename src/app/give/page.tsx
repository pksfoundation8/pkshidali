import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { PageBanner } from '@/components/layout/PageBanner';
import { Icon } from '@/components/primitives/Icon';
import { DonationBuilder } from '@/components/give/DonationBuilder';
import { site } from '@/config/site';

export const metadata = {
  title: 'Support the Foundation',
  description: site.donationsEnabled
    ? 'Give in naira, Canadian dollars, US dollars or pounds. Choose the fund and how often you would like to give.'
    : 'Giving is not open yet. The foundation is completing its registration and donation policy first.',
  // Nothing here to index while the page cannot accept a gift.
  robots: site.donationsEnabled ? undefined : { index: false, follow: true },
};

/**
 * Shown while site.donationsEnabled is false. It states the position plainly
 * instead of collecting money the foundation cannot yet lawfully receipt, and
 * points at the things people can actually do today.
 */
function GivingClosed() {
  return (
    <div className="panel" style={{ maxWidth: 760 }}>
      <span className="ring"><Icon n="info" s={26} /></span>
      <h2 style={{ marginTop: 18, fontSize: 27 }}>Giving is not open yet</h2>
      <p className="lead" style={{ marginTop: 14 }}>
        The foundation is completing its registration with the Corporate Affairs Commission,
        and its donation and refund policies must be published before it accepts a single
        gift. Until both are done, there is no way to give here — and we would rather say so
        than take money we cannot yet account for properly.
      </p>
      <p className="lead" style={{ marginTop: 14 }}>
        This page will open when that work is finished. Nothing is being collected in the
        meantime, and no payment details are requested anywhere on this site.
      </p>

      <h3 style={{ marginTop: 30, fontFamily: 'var(--display)', fontSize: 21 }}>
        What helps right now
      </h3>
      <ul style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <li><Link href="/tributes/share" className="tlink">
          <Icon n="pen" s={15} />Share a tribute — the archive is built from these
        </Link></li>
        <li><Link href="/get-involved" className="tlink">
          <Icon n="users" s={15} />Volunteer, mentor or offer professional advice
        </Link></li>
        <li><Link href="/contact" className="tlink">
          <Icon n="mail" s={15} />Talk to the family about supporting the work
        </Link></li>
      </ul>

      <p className="lead" style={{ marginTop: 22, fontSize: 14 }}>
        A young foundation needs legal, accounting and safeguarding help more than it needs
        money. If you can offer any of that, the family would be glad to hear from you.
      </p>
    </div>
  );
}

export default function GivePage() {
  return (
    <>
      <PageBanner
        eyebrow="Give"
        title="Support the Foundation"
        intro={site.donationsEnabled
          ? 'He spent his life building people. Choose where your support goes, in the currency that suits you.'
          : 'Giving is not open yet. Here is exactly where that stands, and how you can help in the meantime.'}
      />

      <section className="pad">
        <Container>
          {site.donationsEnabled ? <DonationBuilder /> : <GivingClosed />}

          {site.donationsEnabled && (
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
          )}
        </Container>
      </section>
    </>
  );
}
