import { reopenConsentBanner } from '../../lib/consent';
import type { LandingContent } from '../../content/types';
import styles from './Footer.module.css';

interface FooterProps {
  content: LandingContent['footer'];
  logoSrc: string;
}

export function Footer({ content, logoSrc }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <img src={logoSrc} alt={content.logoAlt} className={styles.logo} width={150} height={28} />
          <p className={styles.tagline}>{content.tagline}</p>
        </div>

        <nav className={styles.links} aria-label="Liens légaux">
          {content.legalLinks.map((link) => (
            <a key={link.href} href={link.href} className={styles.link}>
              {link.label}
            </a>
          ))}
          <button type="button" className={styles.link} onClick={reopenConsentBanner}>
            Gérer les cookies
          </button>
        </nav>

        <p className={styles.copyright}>{content.copyright}</p>
      </div>
    </footer>
  );
}
