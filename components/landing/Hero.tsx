import { BarChart3, MapPin, Star, Users } from 'lucide-react';
import type { LandingContent } from '@/content/types';
import { DiscoveryScene } from './DiscoveryScene';
import { LeadForm } from './LeadForm';

interface HeroProps {
  content: LandingContent['hero'];
  form: LandingContent['form'];
}

const BENEFIT_ICONS = [
  { Icon: MapPin, cls: 'bi-pin' },
  { Icon: Star, cls: 'bi-star' },
  { Icon: BarChart3, cls: 'bi-bars' },
  { Icon: Users, cls: 'bi-people' },
];

export function Hero({ content, form }: HeroProps) {
  return (
    <main id="top" className="hero">
      <div className="hero__photo" aria-hidden />

      <section className="hero-copy">
        <span className="eyebrow">{content.eyebrow}</span>
        <h1>
          {content.h1Line1}
          <br />
          <strong>{content.h1Line2}</strong>
        </h1>

        <p className="lead">
          Sur{' '}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="lead-logo" src="/assets/landing/fr/google-g.svg" alt="Google" />
          . Sur{' '}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="lead-logo" src="/assets/landing/fr/chatgpt.svg" alt="ChatGPT" />
          et sur les autres moteurs IA.
        </p>

        <p className="sublead">{content.sublead}</p>

        <div className="benefits">
          {content.benefits.map((benefit, i) => {
            const { Icon, cls } = BENEFIT_ICONS[i] ?? BENEFIT_ICONS[0];
            return (
              <article key={benefit.title}>
                <span className={`benefit-icon ${cls}`} aria-hidden>
                  <Icon strokeWidth={2.4} />
                </span>
                <div>
                  <b>{benefit.title}</b>
                  <small>{benefit.sub}</small>
                </div>
              </article>
            );
          })}
        </div>

        <DiscoveryScene scribbles={content.scribbles} />
      </section>

      <LeadForm content={form} />
    </main>
  );
}
