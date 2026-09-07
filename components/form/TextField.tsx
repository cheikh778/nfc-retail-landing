import { useId, type InputHTMLAttributes } from 'react';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  error?: string;
  hint?: string;
  /** Stable hook for E2E tests. */
  testId?: string;
}

const inputClass =
  'w-full rounded-[10px] border border-field-border bg-field px-3.5 py-3 text-sm text-navy placeholder:text-muted-soft outline-none transition-colors duration-150 focus:border-flame focus:ring-4 focus:ring-flame/15';

export function TextField({ label, error, hint, required, className, testId, ...inputProps }: TextFieldProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined;

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-navy-soft">
        {label}
        {required && (
          <span className="text-flame" aria-hidden="true">
            *
          </span>
        )}
        {hint && (
          <span id={hintId} className="rounded-full bg-[#f2f3f5] px-1.5 py-0.5 text-[10px] font-semibold text-muted-soft">
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
        <p id={errorId} role="alert" className="mt-1.5 text-xs font-semibold text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
