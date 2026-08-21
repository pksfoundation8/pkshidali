import { Container } from '@/components/layout/Container';
import { PageBanner } from '@/components/layout/PageBanner';
import { Icon } from '@/components/primitives/Icon';
import { ContactForm } from '@/components/forms/ContactForm';
import { site } from '@/config/site';

export const metadata = {
  title: 'Contact',
  description: 'Enquiries about giving, scholarships, volunteering, partnership or the archive.',
};

export default function ContactPage() {
  return (
    <>
      <PageBanner eyebrow="Contact" title="Get in Touch"
        intro="Questions about giving, scholarships, volunteering, partnership or contributing to the archive." />

      <section className="pad">
        <Container>
          <div className="duo arch">
            <ContactForm />

            <div>
              <h2 className="title" style={{ fontSize: 26 }}>The foundation</h2>
              <ul className="fc" style={{ marginTop: 20, color: 'var(--ink-muted)' }}>
                <li>
                  <Icon n="pin" s={17} style={{ color: 'var(--gold-700)' }} />
                  <span>{site.contact.address.join(', ')}</span>
                </li>
                <li>
                  <Icon n="phone" s={17} style={{ color: 'var(--gold-700)' }} />
                  <a href={`tel:${site.contact.phone.replace(/\s/g, '')}`}>{site.contact.phone}</a>
                </li>
                <li>
                  <Icon n="mail" s={17} style={{ color: 'var(--gold-700)' }} />
                  <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
                </li>
              </ul>

              <div className="note" style={{ marginTop: 30 }}>
                <Icon n="info" s={18} />
                <span>
                  <strong>Giving from outside Nigeria?</strong> The foundation is registered in
                  Nigeria and cannot issue a Canadian, US or UK tax receipt. If that matters to
                  your giving, choose &ldquo;Giving and tax receipts&rdquo; above and we will tell
                  you honestly where that stands before you give.
                </span>
              </div>

              <div className="note" style={{ marginTop: 16 }}>
                <Icon n="info" s={18} />
                <span>
                  <strong>Have photographs, letters or recordings of him?</strong> These are the
                  most fragile part of the legacy and the first priority for digitising. Choose
                  &ldquo;Contributing to the archive&rdquo; and someone will arrange collection.
                </span>
              </div>

              <p className="lead" style={{ marginTop: 30, fontSize: 14 }}>
                Replies come from people, not a system, so please allow a few days.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
