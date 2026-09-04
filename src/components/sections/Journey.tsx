import { MapPinIcon, MegaphoneIcon, RepeatIcon, StarIcon, TrendingUpIcon } from '../icons';
import type { LandingContent } from '../../content/types';
import styles from './Journey.module.css';

const STEP_ICONS = [MapPinIcon, StarIcon, MegaphoneIcon, RepeatIcon, TrendingUpIcon];

interface JourneyProps {
  content: LandingContent['journey'];
}

export function Journey({ content }: JourneyProps) {
  return (
    <section id="parcours" className={`section dark-section ${styles.journey}`}>
      <div className="container">
        <div className="section-head centered">
          <span className="eyebrow eyebrow-dark">{content.eyebrow}</span>
          <h2 className="section-title">{content.title}</h2>
          <p className="section-subtitle">{content.subtitle}</p>
        </div>

        <ol className={styles.grid}>
          {content.steps.map((step, index) => {
            const Icon = STEP_ICONS[index] ?? StarIcon;
            return (
              <li key={step.label} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
                  <Icon className={styles.icon} />
                </div>
                <h3 className={styles.label}>{step.label}</h3>
                {step.description && <p className={styles.description}>{step.description}</p>}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
