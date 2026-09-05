import { Building2, Check, User } from 'lucide-react';

interface FormProgressProps {
  step: 1 | 2;
  label: string;
  labels: [string, string];
}

/** Icon stepper, ported from the Lovable LeadForm. `label` stays in the DOM (visually hidden) for screen readers and tests. */
export function FormProgress({ step, label, labels }: FormProgressProps) {
  const stages = [
    { n: 1, label: labels[0], icon: Building2 },
    { n: 2, label: labels[1], icon: User },
  ] as const;

  return (
    <div className="flex items-center gap-3 border-b border-border bg-cream px-6 py-4 sm:px-8" role="status">
      <span className="sr-only">{label}</span>
      {stages.map((s, i) => {
        const done = step > s.n;
        const current = step === s.n;
        return (
          <div key={s.n} className="flex flex-1 items-center gap-3">
            <span
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border text-xs font-700 transition-all duration-300 ${
                done
                  ? 'border-flame bg-flame text-primary-foreground'
                  : current
                    ? 'border-flame/50 bg-flame-soft text-flame'
                    : 'border-border bg-card text-muted-foreground'
              }`}
            >
              {done ? <Check className="h-4 w-4" aria-hidden /> : s.n}
            </span>
            <span className={`hidden text-xs font-600 sm:block ${step >= s.n ? 'text-navy' : 'text-muted-foreground'}`}>
              {s.label}
            </span>
            {i === 0 ? <span className="h-px flex-1 bg-border" aria-hidden /> : null}
          </div>
        );
      })}
    </div>
  );
}
