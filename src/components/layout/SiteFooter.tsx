import Link from 'next/link';
import { Container } from './Container';
import { Brandmark } from './Brandmark';
import { Icon } from '@/components/primitives/Icon';
import { NewsletterForm } from './NewsletterForm';
import { site, footerNav, policyNav } from '@/config/site';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="st">
      <Container className="fg">
        <div>
          <Brandmark />
          <div className="creed">
            {site.footerCreed.map((line) => <p key={line}>{line}</p>)}
          </div>
        </div>

        <nav aria-label="Footer">
          <h3>Quick Links</h3>
          <div className="fl2">
            {footerNav.map((item) => (
              <Link key={item.label} href={item.href}>
                <span className="c" aria-hidden="true">&rsaquo;</span>{item.label}
              </Link>
            ))}
          </div>
        </nav>

        <div>
          <h3>Contact Us</h3>
          <ul className="fc">
            <li><Icon n="pin" s={17} /><span>{site.contact.address.join(', ')}</span></li>
            <li><Icon n="phone" s={17} />
              <a href={`tel:${site.contact.phone.replace(/\s/g, '')}`}>{site.contact.phone}</a></li>
            <li><Icon n="mail" s={17} />
              <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a></li>
            <li><Icon n="globe" s={17} /><span>www.{site.domain}</span></li>
          </ul>
        </div>

        <div>
          <h3>Stay Connected</h3>
          <p style={{ marginTop: 10, fontSize: 13.5, lineHeight: 1.7 }}>
            Subscribe for updates, stories and opportunities to get involved.
          </p>
          <NewsletterForm />

          <ul className="socials">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href}><span className="sr">{s.label}</span><Icon n={s.icon} s={16} /></a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Scripture for Our Journey</h3>
          <blockquote className="verse">
            <p>{site.scripture.text}</p>
            <p className="ref">&mdash; {site.scripture.reference}</p>
          </blockquote>
        </div>
      </Container>

      <div className="fb">
        <Container className="fb-in">
          <p>&copy; {year} {site.name}. All rights reserved.</p>
          <ul style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px 20px' }}>
            {policyNav.map((p) => <li key={p.href}><Link href={p.href}>{p.label}</Link></li>)}
          </ul>
          <p style={{ color: 'rgba(196,154,69,.8)' }}>Built on faith. Driven by love. Sustained by prayer.</p>
        </Container>
      </div>
    </footer>
  );
}
