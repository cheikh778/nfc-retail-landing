import { Eyebrow } from '../Eyebrow';
import type { LandingContent } from '../../content/types';
import styles from './Proof.module.css';

interface ProofProps {
  content: LandingContent['proof'];
}

/**
 * Brief §22: no invented figures/clients/testimonials, and placeholders for
 * items pending validation must never be visible in production. So this
 * section only renders in dev, as a layout preview for the team.
 */
export function Proof({ content }: ProofProps) {
  if (!import.meta.env.DEV) return null;

  return (
    <section className="section">
      <div className="container">
        <p className={styles.devBanner}>
          Aperçu développeur uniquement — masqué en production tant que ces éléments ne sont pas validés.
        </p>

        <div className="section-head centered">
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <h2 className="section-title">{content.title}</h2>
        </div>

        <div className={styles.grid}>
          {content.items.map((item) => (
            <div key={item.placeholder} className={styles.card}>
              <p className={styles.placeholder}>{item.placeholder}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
