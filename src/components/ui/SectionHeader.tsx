import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: 'left' | 'center';
  tone?: 'dark' | 'light';
}

export function SectionHeader({ eyebrow, title, subtitle, align = 'center', tone = 'dark' }: SectionHeaderProps) {
  const alignment = align === 'center' ? 'text-center mx-auto items-center' : 'text-left items-start';
  const titleTone = tone === 'light' ? 'text-primary-foreground' : 'text-navy';
  const subTone = tone === 'light' ? 'text-primary-foreground/75' : 'text-muted-foreground';

  return (
    <Reveal className={`flex max-w-3xl flex-col gap-4 ${alignment}`}>
      {eyebrow ? (
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-flame">
          <span className="h-1.5 w-1.5 rounded-full bg-flame pulse-dot" aria-hidden />
          {eyebrow}
        </span>
      ) : null}
      <h2 className={`text-balance text-3xl font-700 leading-[1.1] sm:text-4xl lg:text-[2.85rem] ${titleTone}`}>
        {title}
      </h2>
      {subtitle ? <p className={`max-w-2xl text-base leading-relaxed sm:text-lg ${subTone}`}>{subtitle}</p> : null}
    </Reveal>
  );
}
