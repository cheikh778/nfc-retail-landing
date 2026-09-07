import type { ReactNode } from 'react';

interface FloatingCardProps {
  label: string;
  value: string;
  trend?: string;
  icon?: ReactNode;
  className?: string;
  float?: 'slow' | 'slower';
}

export function FloatingCard({ label, value, trend, icon, className = '', float = 'slow' }: FloatingCardProps) {
  return (
    <div className={`${float === 'slow' ? 'float-slow' : 'float-slower'} pointer-events-none absolute ${className}`}>
      <div className="rounded-2xl border border-border/80 bg-card/95 p-3 shadow-card backdrop-blur-sm sm:p-3.5">
        <div className="flex items-center gap-2.5">
          {icon ? (
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-flame-soft text-flame">
              {icon}
            </span>
          ) : null}
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
            <p className="font-display text-sm font-700 text-navy">{value}</p>
          </div>
          {trend ? (
            <span className="ml-1 shrink-0 rounded-md bg-flame-soft px-1.5 py-0.5 text-[10px] font-700 text-flame">
              {trend}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
