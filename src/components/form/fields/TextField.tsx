import { useId, type InputHTMLAttributes } from 'react';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  error?: string;
  hint?: string;
  /** Stable hook for E2E tests — see e2e/README.md. */
  testId?: string;
}

const inputClass =
  'w-full rounded-xl border border-input bg-card px-4 py-3.5 text-sm font-medium text-navy placeholder:text-muted-foreground/70 outline-none transition-all duration-200 focus:border-flame focus:ring-4 focus:ring-flame/15';

const labelClass = 'mb-1.5 block text-xs font-700 uppercase tracking-[0.12em] text-navy';

export function TextField({ label, error, hint, required, className, testId, ...inputProps }: TextFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className={labelClass}>
        {label}
        {required && (
          <span className="text-flame" aria-hidden="true">
            {' *'}
          </span>
        )}
        {hint && (
          <span id={hintId} className="ml-2 font-500 normal-case tracking-normal text-muted-foreground">
            {hint}
          </span>
        )}
      </label>
      <input
        id={id}
        data-testid={testId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`${inputClass} ${error ? 'border-destructive focus:border-destructive focus:ring-destructive/15' : ''}`}
        {...inputProps}
      />
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-xs font-600 text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
