import { Reveal } from '../ui/Reveal';
import { track } from '../../lib/tracking';
import type { LandingContent } from '../../content/types';

interface FinalCtaProps {
  content: LandingContent['finalCta'];
}

export function FinalCta({ content }: FinalCtaProps) {
  return (
    <section className="relative overflow-hidden bg-navy py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full border border-primary-foreground/10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full border border-primary-foreground/10"
      />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full border border-flame/25" />
      <div aria-hidden className="pointer-events-none absolute left-1/3 top-0 h-64 w-64 rounded-full bg-flame/10 blur-3xl" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(oklch(0.99 0.005 60 / 0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(50rem 30rem at 50% 50%, black, transparent 80%)',
        }}
      />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
        <Reveal>
          <h2 className="text-balance font-display text-3xl font-700 leading-[1.1] text-primary-foreground sm:text-5xl">
            {content.title}
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-primary-foreground/75">{content.subtitle}</p>
        </Reveal>
        <Reveal delay={220}>
          <a
            href={content.ctaHref}
            onClick={() => track('cta_click', { location: 'final_cta' })}
            className="mt-10 inline-flex w-full items-center justify-center rounded-xl bg-flame px-8 py-4.5 text-sm font-700 uppercase tracking-wide text-primary-foreground shadow-glow-flame transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 sm:w-auto sm:px-10"
          >
            {content.ctaLabel}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
