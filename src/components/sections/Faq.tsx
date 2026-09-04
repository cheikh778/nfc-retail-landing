import { ChevronDownIcon } from '../icons';
import type { LandingContent } from '../../content/types';
import styles from './Faq.module.css';

interface FaqProps {
  content: LandingContent['faq'];
}

export function Faq({ content }: FaqProps) {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head centered">
          <span className="eyebrow">{content.eyebrow}</span>
          <h2 className="section-title">{content.title}</h2>
          <p className="section-subtitle">{content.subtitle}</p>
        </div>

        <div className={styles.list}>
          {content.items.map((item, index) => (
            <details key={item.question} className={styles.item} open={index === 0}>
              <summary className={styles.question}>
                <span>{item.question}</span>
                <ChevronDownIcon className={styles.chevron} />
              </summary>
              <p className={styles.answer}>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
