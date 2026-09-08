'use client';

import { ArrowUpRight } from 'lucide-react';
import { track } from '@/lib/tracking';
import type { LandingContent } from '@/content/types';
import { CursorGrid } from './CursorGrid';
import { MarketingOrbit } from './MarketingOrbit';
import { OrbitField } from './OrbitField';

interface HeroProps {
  content: LandingContent['hero'];
  journey: LandingContent['journey'];
  onOpenModal: () => void;
}

/** Splits the h1 so the highlighted word gets the flame colour + a hand-drawn underline. */
function HeroTitle({ text, highlight }: { text: string; highlight: string }) {
  const index = text.toLowerCase().indexOf(highlight.toLowerCase());
  if (index === -1) return <>{text}</>;
  const before = text.slice(0, index);
  const match = text.slice(index, index + highlight.length);
  const after = text.slice(index + highlight.length);
  return (
    <>
      {before}
      <span className="relative whitespace-nowrap text-flame">
        {match}
        <svg
          aria-hidden
          viewBox="0 0 220 12"
          preserveAspectRatio="none"
          className="absolute -bottom-1.5 left-0 h-[0.5em] w-full text-flame/55"
        >
          <path d="M3 9 Q110 1 217 8" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </svg>
      </span>
      {after}
    </>
  );
}

export function Hero({ content, journey, onOpenModal }: HeroProps) {
  const openFromHero = () => {
    track('cta_click', { location: 'hero' });
    onOpenModal();
  };

  return (
    <section className="hero relative overflow-hidden">
      <OrbitField />
      <CursorGrid />

      <div className="hero-inner">
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {content.chips.map((chip) => (
            <span
              key={chip}
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-card px-3.5 py-1.5 text-[12.5px] font-semibold text-muted shadow-[var(--shadow-chip)]"
            >
              {chip}
            </span>
          ))}
        </div>

        <h1 className="mt-3 text-balance font-display text-[1.9rem] font-bold leading-[1.08] tracking-[-0.025em] text-navy sm:text-[2.35rem] lg:text-[2.7rem]">
          <HeroTitle text={content.h1} highlight={content.h1Highlight} />
        </h1>

        <p className="mx-auto mt-2.5 max-w-[600px] text-[14.5px] font-semibold leading-snug text-navy sm:text-[16px]">
          {content.subtitle}
        </p>
        <p className="mx-auto mt-1.5 max-w-[540px] text-[13px] font-normal leading-relaxed text-muted">
          {content.body}
        </p>

        <div className="hero-cta-row">
          <button type="button" onClick={openFromHero} data-testid="hero-cta" className="hero-cta-button">
            {content.ctaPrimaryLabel}
            <span className="hero-cta-button__icon">
              <ArrowUpRight className="h-4 w-4 text-flame" aria-hidden />
            </span>
          </button>
          <ul className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[12.5px] text-muted-soft">
            {content.reassurance.map((item, i) => (
              <li key={item} className="inline-flex items-center gap-2">
                {i > 0 && <span aria-hidden className="opacity-60">•</span>}
                {item}
              </li>
            ))}
          </ul>
        </div>

        <MarketingOrbit journey={journey} gauge={content.gauge} />
      </div>
    </section>
  );
}
