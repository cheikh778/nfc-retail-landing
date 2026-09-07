import { ArrowRight, BarChart3, Database, LineChart, Sparkles } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { Reveal } from '../ui/Reveal';
import type { LandingContent } from '../../content/types';

interface AutomationProps {
  content: LandingContent['automation'];
}

const STAGE_ICONS = [Database, LineChart, Sparkles, BarChart3];
const STAGE_DESCRIPTIONS = [
  'Données clients et interactions',
  'Comprendre les comportements et opportunités',
  'Déclencher les bonnes actions marketing',
  'Analyser les résultats et optimiser',
];

export function Automation({ content }: AutomationProps) {
  return (
    <section id="automation" className="py-24 sm:py-32">
      <div className="mx-auto max-w-[88rem] px-5 sm:px-6 lg:px-10">
        <SectionHeader eyebrow={content.eyebrow} title={content.title} subtitle={content.body} />

        <div className="mt-14">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {content.pipeline.map((stage, i) => {
              const Icon = STAGE_ICONS[i] ?? Sparkles;
              return (
                <Reveal key={stage} delay={i * 100} className="relative">
                  <div className="group h-full rounded-2xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-flame-soft text-flame transition-colors duration-300 group-hover:bg-flame group-hover:text-primary-foreground">
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <h3 className="mt-4 font-display text-sm font-700 uppercase tracking-[0.14em] text-navy">
                      {stage}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{STAGE_DESCRIPTIONS[i]}</p>
                  </div>
                  {i < content.pipeline.length - 1 ? (
                    <ArrowRight
                      className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-flame lg:block"
                      aria-hidden
                    />
                  ) : null}
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={200} className="mt-8">
            <div className="rounded-2xl border border-border bg-cream p-6 sm:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Exemples d'automatisations progressives
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {content.flows.map((flow) => (
                  <div key={flow.from} className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3">
                    <span className="text-sm font-600 text-navy">{flow.from}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-flame" aria-hidden />
                    <span className="text-sm font-medium text-muted-foreground">{flow.to}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
