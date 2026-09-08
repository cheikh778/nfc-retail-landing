'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import type { LandingContent } from '@/content/types';
import { VisibilityGauge } from './VisibilityGauge';

interface Props {
  journey: LandingContent['journey'];
  gauge: LandingContent['hero']['gauge'];
}

/**
 * "Votre marketing piloté" — score gauge on top, then an accordion of the 4
 * steps: opening a card reveals its illustrative photo in the panel beside it,
 * so the space around the block is always filled (cf. the reference video).
 */
export function MarketingOrbit({ journey, gauge }: Props) {
  const [open, setOpen] = useState(0);

  return (
    <div className="morbit">
      <h2 className="morbit__title">{journey.title}</h2>
      <p className="morbit__subtitle">{journey.subtitle}</p>

      <VisibilityGauge gauge={gauge} />
      <p className="morbit__caption">{gauge.caption}</p>

      <div className="morbit__panel">
        <ol className="morbit__list">
          {journey.steps.map((step, i) => {
            const isOpen = i === open;
            return (
              <li key={step.label} className={`morbit__item${isOpen ? ' is-open' : ''}`}>
                <button
                  type="button"
                  className="morbit__itembtn"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(i)}
                >
                  <span className="morbit__num">{i + 1}</span>
                  <span className="morbit__label">{step.label}</span>
                  {isOpen ? (
                    <ArrowUpRight className="morbit__icon" aria-hidden />
                  ) : (
                    <ChevronRight className="morbit__icon" aria-hidden />
                  )}
                </button>
                <p className="morbit__detail" hidden={!isOpen}>
                  {step.detail}
                </p>
              </li>
            );
          })}
        </ol>

        <div className="morbit__visual">
          {journey.steps.map((step, i) => (
            <Image
              key={step.image}
              src={step.image}
              alt={step.imageAlt}
              width={1000}
              height={760}
              className={`morbit__img${i === open ? ' is-shown' : ''}`}
              sizes="(min-width: 1024px) 460px, 90vw"
              priority={i === 0}
            />
          ))}
        </div>
      </div>

      <p className="morbit__outcome">{journey.outcome}</p>
    </div>
  );
}
