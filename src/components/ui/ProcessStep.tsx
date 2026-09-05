import { Reveal } from './Reveal';

interface ProcessStepProps {
  index: string;
  title: string;
  description?: string;
  delay?: number;
  last?: boolean;
}

export function ProcessStep({ index, title, description, delay = 0, last = false }: ProcessStepProps) {
  return (
    <Reveal delay={delay} className="group relative flex gap-5 lg:block">
      <div className="flex flex-col items-center lg:hidden" aria-hidden>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-card font-display text-xs font-700 text-flame shadow-soft transition-colors duration-300 group-hover:border-flame/50">
          {index}
        </span>
        {!last ? <span className="mt-1 w-px flex-1 bg-gradient-to-b from-border to-transparent" /> : null}
      </div>

      <div className="hidden items-center gap-3 lg:flex" aria-hidden>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-card font-display text-xs font-700 text-flame shadow-soft transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-flame/50">
          {index}
        </span>
        {!last ? (
          <span className="relative h-px flex-1 overflow-hidden bg-border/70">
            <span className="absolute inset-y-0 left-0 w-0 bg-flame/60 transition-all duration-500 group-hover:w-full" />
          </span>
        ) : null}
      </div>

      <div className="pb-10 transition-transform duration-300 group-hover:-translate-y-0.5 lg:pb-0 lg:pt-7">
        <h3 className="font-display text-base font-700 tracking-tight text-navy sm:text-lg">{title}</h3>
        {description ? <p className="mt-2 max-w-[17rem] text-sm leading-relaxed text-muted-foreground">{description}</p> : null}
      </div>
    </Reveal>
  );
}
