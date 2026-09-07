import { Check, Star, TrendingUp } from 'lucide-react';
import { DashboardShot } from '../ui/DashboardShot';
import { FloatingCard } from '../ui/FloatingCard';
import { Reveal } from '../ui/Reveal';
import { track } from '../../lib/tracking';
import type { LandingContent } from '../../content/types';

interface HeroProps {
  content: LandingContent['hero'];
}

/** Splits the h1 around "vraiment" so that single word gets the flame underline, like the Lovable design. */
function HeroTitle({ text }: { text: string }) {
  const highlight = 'vraiment';
  const index = text.toLowerCase().indexOf(highlight);
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
          className="absolute -bottom-1 left-0 w-full text-flame/50"
          preserveAspectRatio="none"
        >
          <path d="M2 9 Q110 2 218 8" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      </span>
      {after}
    </>
  );
}

export function Hero({ content }: HeroProps) {
  return (
    <section id="top" className="relative overflow-hidden pb-20 pt-28 sm:pt-32 lg:pb-28 lg:pt-40">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(65rem 34rem at 72% -12%, oklch(0.33 0.075 264 / 0.06), transparent 62%)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            'linear-gradient(oklch(0.33 0.075 264 / 0.05) 1px, transparent 1px), linear-gradient(90deg, oklch(0.33 0.075 264 / 0.05) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(60rem 34rem at 50% 0%, black, transparent 72%)',
        }}
      />

      <div className="relative mx-auto grid max-w-[88rem] items-center gap-14 px-5 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:px-10 xl:gap-20">
        <div className="lg:max-w-[34rem]">
          <Reveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-navy shadow-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-flame pulse-dot" aria-hidden />
              Visibilité digitale pour commerces
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-7 text-balance font-display text-[2.6rem] font-700 leading-[1.04] tracking-tight text-navy sm:text-[3.5rem] lg:text-[4rem] xl:text-[4.4rem]">
              <HeroTitle text={content.h1} />
            </h1>
          </Reveal>

          <Reveal delay={150}>
            <p className="mt-7 max-w-[32rem] text-lg font-600 leading-snug text-navy/85 sm:text-xl">{content.h2}</p>
          </Reveal>

          <Reveal delay={210}>
            <p className="mt-4 max-w-[32rem] text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              {content.body}
            </p>
          </Reveal>

          <Reveal delay={280}>
            <a
              href={content.ctaHref}
              data-testid="hero-cta"
              onClick={() => track('cta_click', { location: 'hero' })}
              className="mt-9 inline-flex w-full items-center justify-center rounded-xl bg-flame px-7 py-4 text-[13px] font-700 uppercase tracking-[0.06em] text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow-flame focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-flame/30 active:translate-y-0 sm:w-auto"
            >
              {content.ctaLabel}
            </a>
            <ul className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] font-medium text-muted-foreground">
              {content.reassurance.map((item) => (
                <li key={item} className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-flame" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={180} className="relative">
          <div className="relative mx-auto max-w-2xl lg:max-w-none">
            <div aria-hidden className="absolute -inset-10 rounded-[2.5rem] bg-flame/[0.07] blur-3xl" />
            <DashboardShot src={content.visual.src} alt={content.visual.alt} />

            <FloatingCard
              label="Visibilité"
              value="Top 3 local"
              trend="+12 pts"
              icon={<TrendingUp className="h-3.5 w-3.5" aria-hidden />}
              className="hidden top-24 sm:block sm:-left-8"
            />
            <FloatingCard
              label="Avis clients"
              value="4,7 / 5"
              icon={<Star className="h-3.5 w-3.5" aria-hidden />}
              className="-bottom-5 right-2 hidden sm:block lg:-right-6"
              float="slower"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
