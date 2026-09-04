import { track } from '../../lib/tracking';
import type { LandingContent } from '../../content/types';
import styles from './FinalCta.module.css';

interface FinalCtaProps {
  content: LandingContent['finalCta'];
}

export function FinalCta({ content }: FinalCtaProps) {
  return (
    <section className={`section dark-section ${styles.finalCta}`}>
      <div className={`container ${styles.inner}`}>
        <h2 className={styles.title}>{content.title}</h2>
        <p className={styles.subtitle}>{content.subtitle}</p>
        <a
          href={content.ctaHref}
          className="btn btn-primary btn-lg"
          onClick={() => track('cta_click', { location: 'final_cta' })}
        >
          {content.ctaLabel}
        </a>
      </div>
    </section>
  );
}
