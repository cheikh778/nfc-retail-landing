import type { LandingContent } from '@/content/types';
import { VisibilityGauge } from './VisibilityGauge';

interface Props {
  journey: LandingContent['journey'];
  gauge: LandingContent['hero']['gauge'];
}

function Step({ n, label, detail }: { n: number; label: string; detail: string }) {
  return (
    <li className="morbit__step">
      <span className="morbit__step-index">{n}</span>
      <span className="morbit__step-label">{label}</span>
      <span className="morbit__step-detail">{detail}</span>
    </li>
  );
}

/**
 * "Votre marketing piloté" folded around the score gauge — the 4 steps fill the
 * space that flanked the gauge, so the hero has no dead zone. Stacks on mobile.
 */
export function MarketingOrbit({ journey, gauge }: Props) {
  const [s1, s2, s3, s4] = journey.steps;

  return (
    <div className="morbit">
      <h2 className="morbit__title">{journey.title}</h2>
      <p className="morbit__subtitle">{journey.subtitle}</p>

      <div className="morbit__grid">
        <ol className="morbit__col morbit__col--left">
          <Step n={1} label={s1.label} detail={s1.detail} />
          <Step n={2} label={s2.label} detail={s2.detail} />
        </ol>

        <div className="morbit__center">
          <VisibilityGauge gauge={gauge} />
          <p className="morbit__caption">{gauge.caption}</p>
        </div>

        <ol className="morbit__col morbit__col--right">
          <Step n={3} label={s3.label} detail={s3.detail} />
          <Step n={4} label={s4.label} detail={s4.detail} />
        </ol>
      </div>

      <p className="morbit__outcome">{journey.outcome}</p>
    </div>
  );
}
