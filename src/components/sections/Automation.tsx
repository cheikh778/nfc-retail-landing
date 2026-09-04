import { ArrowRightIcon, CheckIcon, RepeatIcon, SearchIcon, SparklesIcon, TrendingUpIcon } from '../icons';
import type { LandingContent } from '../../content/types';
import styles from './Automation.module.css';

const PIPELINE_HINTS: Record<string, string> = {
  COLLECTER: 'Données & signaux',
  ANALYSER: 'Visibilité & avis',
  AGIR: 'Réponses & campagnes',
  MESURER: 'Résultats',
};

const PIPELINE_ICONS = [SearchIcon, SparklesIcon, RepeatIcon, TrendingUpIcon];

interface AutomationProps {
  content: LandingContent['automation'];
}

export function Automation({ content }: AutomationProps) {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head centered">
          <span className="eyebrow">{content.eyebrow}</span>
          <h2 className="section-title">{content.title}</h2>
          <p className="section-subtitle">{content.body}</p>
        </div>

        <ul className={styles.flows}>
          {content.flows.map((flow) => (
            <li key={flow.from} className={styles.flowRow}>
              <div className={styles.flowText}>
                <span className={styles.flowFrom}>{flow.from}</span>
                <ArrowRightIcon className={styles.flowArrow} />
                <span className={styles.flowTo}>{flow.to}</span>
              </div>
              <span className={styles.flowCheck}>
                <CheckIcon />
              </span>
            </li>
          ))}
        </ul>

        <div className={styles.pipeline}>
          {content.pipeline.map((step, index) => {
            const Icon = PIPELINE_ICONS[index] ?? SparklesIcon;
            return (
              <div key={step} className={styles.pipelineStep}>
                <span className={styles.pipelineIcon}>
                  <Icon />
                </span>
                <div>
                  <p className={styles.pipelineLabel}>{step}</p>
                  {PIPELINE_HINTS[step] && <p className={styles.pipelineHint}>{PIPELINE_HINTS[step]}</p>}
                </div>
                {index < content.pipeline.length - 1 && (
                  <ArrowRightIcon className={styles.pipelineConnector} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
