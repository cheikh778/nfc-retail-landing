import { useState } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { track } from '../../lib/tracking';
import { ChatIcon, EyeIcon, MegaphoneIcon, SparklesIcon, StarIcon, UsersIcon } from '../icons';
import type { LandingContent } from '../../content/types';
import styles from './Hero.module.css';

const CARD_ICONS: Record<string, typeof EyeIcon> = {
  Visibilité: EyeIcon,
  'Avis clients': StarIcon,
  Réputation: ChatIcon,
  Campagnes: MegaphoneIcon,
  Acquisition: UsersIcon,
};

interface HeroProps {
  content: LandingContent['hero'];
}

function DashboardVisual({ visual }: { visual: LandingContent['hero']['visual'] }) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const primarySrc = isDesktop ? visual.desktopSrc : visual.mobileSrc;
  const fallbackSrc = isDesktop ? visual.desktopPlaceholderSrc : visual.mobilePlaceholderSrc;
  // Remembers which primarySrc failed, so flipping breakpoints (a new primarySrc) retries the real asset.
  const [erroredSrc, setErroredSrc] = useState<string | null>(null);
  const src = erroredSrc === primarySrc ? fallbackSrc : primarySrc;

  return (
    <div className={styles.visualWrap}>
      <div className={styles.deviceCard}>
        <img
          src={src}
          alt={visual.alt}
          className={styles.deviceImage}
          loading="eager"
          onError={() => setErroredSrc(primarySrc)}
        />
      </div>

      <ul className={styles.floatingCards} aria-hidden="true">
        {visual.cards.map((card, index) => {
          const Icon = CARD_ICONS[card.label] ?? SparklesIcon;
          return (
            <li key={card.label} className={styles.floatingCard} data-index={index}>
              <Icon className={styles.floatingIcon} />
              <span>{card.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Hero({ content }: HeroProps) {
  return (
    <section id="top" className={styles.hero}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.content}>
          <h1 className={styles.h1}>{content.h1}</h1>
          <p className={styles.h2}>{content.h2}</p>
          <p className={styles.body}>{content.body}</p>

          <div className={styles.ctaRow}>
            <a
              href={content.ctaHref}
              className={`btn btn-primary btn-lg ${styles.cta}`}
              data-testid="hero-cta"
              onClick={() => track('cta_click', { location: 'hero' })}
            >
              {content.ctaLabel}
            </a>
          </div>

          <p className={styles.reassurance}>{content.reassurance}</p>
        </div>

        <div className={styles.visualCol}>
          <DashboardVisual visual={content.visual} />
        </div>
      </div>
    </section>
  );
}
