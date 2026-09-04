import { track } from '../../lib/tracking';
import type { LandingContent } from '../../content/types';
import styles from './Header.module.css';

interface HeaderProps {
  content: LandingContent['header'];
}

export function Header({ content }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <a href="#top" className={styles.logoLink} aria-label={content.logoAlt}>
          <img src={content.logoSrc} alt={content.logoAlt} className={styles.logo} width={150} height={28} />
        </a>

        <a href={content.anchorHref} className={styles.anchor}>
          {content.anchorLabel}
        </a>

        <a
          href={content.ctaHref}
          className={`btn btn-primary ${styles.cta}`}
          onClick={() => track('cta_click', { location: 'header' })}
        >
          {content.ctaLabel}
        </a>
      </div>
    </header>
  );
}
