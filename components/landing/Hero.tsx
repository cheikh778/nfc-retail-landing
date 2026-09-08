'use client';

import { ArrowUpRight } from 'lucide-react';
import { track } from '@/lib/tracking';
import type { LandingContent } from '@/content/types';
import { CursorGrid } from './CursorGrid';
import { OrbitField } from './OrbitField';
import { ProductPreview } from './ProductPreview';

interface HeroProps {
  content: LandingContent['hero'];
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
          <path
            d="M3 9 Q110 1 217 8"
            stroke="currentColor"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {after}
    </>
  );
}

export function Hero({ content, onOpenModal }: HeroProps) {
  const openFromHero = () => {
    track('cta_click', { location: 'hero' });
    onOpenModal();
  };

  return (
    <section className="hero relative overflow-hidden">
      <CursorGrid />
      <div
        className="reveal relative z-10 mx-auto w-full max-w-[780px] px-5 text-center sm:px-6"
        style={{ paddingTop: 'var(--content-top)' }}
      >
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {content.chips.map((chip) => (
            <span
              key={chip}
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-card px-4 py-2 text-[13px] font-semibold text-muted shadow-[var(--shadow-chip)]"
            >
              {chip}
            </span>
          ))}
        </div>

        <h1 className="mt-6 text-balance font-display text-[2.35rem] font-bold leading-[1.06] tracking-[-0.025em] text-navy sm:text-[3.1rem] lg:text-[4.1rem]">
          <HeroTitle text={content.h1} highlight={content.h1Highlight} />
        </h1>

        <p className="mx-auto mt-6 max-w-[640px] text-lg font-semibold leading-snug text-navy sm:text-xl lg:text-[22px]">
          {content.subtitle}
        </p>

        <p className="mx-auto mt-4 max-w-[560px] text-[15px] font-normal leading-relaxed text-muted sm:text-base">
          {content.body}
        </p>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={openFromHero}
            data-testid="hero-cta"
            className="group relative inline-flex w-full items-center justify-center rounded-full bg-flame py-[18px] pl-7 pr-16 text-[13px] font-bold uppercase tracking-[0.02em] text-white shadow-[var(--shadow-glow-flame)] transition-transform duration-200 hover:-translate-y-0.5 sm:w-auto"
          >
            {content.ctaPrimaryLabel}
            <span className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-white">
              <ArrowUpRight className="h-4 w-4 text-flame" aria-hidden />
            </span>
          </button>
        </div>

        <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[12.5px] text-muted-soft">
          {content.reassurance.map((item, i) => (
            <li key={item} className="inline-flex items-center gap-2">
              {i > 0 && <span aria-hidden className="opacity-60">•</span>}
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="hero-visual">
        <OrbitField />
        <ProductPreview content={content.preview} />
      </div>
    </section>
  );
}
