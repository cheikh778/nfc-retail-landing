import { Eyebrow } from '../Eyebrow';
import { MapPinIcon, MegaphoneIcon, RepeatIcon, StarIcon, TrendingUpIcon } from '../icons';
import type { LandingContent } from '../../content/types';
import styles from './Journey.module.css';

const STEP_ICONS = [MapPinIcon, StarIcon, MegaphoneIcon, RepeatIcon, TrendingUpIcon];

interface JourneyProps {
  content: LandingContent['journey'];
}

export function Journey({ content }: JourneyProps) {
  return (
    <section id="parcours" className="section">
      <div className="container">
        <div className={`dark-card-section ${styles.panel}`}>
          <div className="section-head split">
            <div className="section-head-titleblock">
              <Eyebrow dark>{content.eyebrow}</Eyebrow>
              <h2 className="section-title">{content.title}</h2>
            </div>
            <p className="section-subtitle">{content.subtitle}</p>
          </div>

          <ol className={styles.grid}>
            {content.steps.map((step, index) => {
              const Icon = STEP_ICONS[index] ?? StarIcon;
              return (
                <li key={step.label} className={`card-glass ${styles.card}`}>
                  <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
                  <Icon className={styles.icon} />
                  <h3 className={styles.label}>{step.label}</h3>
                  {step.description && <p className={styles.description}>{step.description}</p>}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
