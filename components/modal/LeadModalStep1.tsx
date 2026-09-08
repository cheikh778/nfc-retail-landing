import { ArrowUpRight } from 'lucide-react';
import type { LandingContent } from '@/content/types';
import type { FieldErrorCode } from '@/lib/validation';
import { TextField } from '@/components/form/TextField';
import type { useLeadForm } from '@/hooks/useLeadForm';
import { StepProgress } from './StepProgress';

interface Props {
  content: LandingContent['modal'];
  form: ReturnType<typeof useLeadForm>;
}

export function LeadModalStep1({ content, form }: Props) {
  const errorText = (code?: FieldErrorCode) => {
    if (!code) return undefined;
    return content.errors.required;
  };

  return (
    <form onSubmit={form.submitStep1} noValidate className="space-y-5" data-testid="lead-form-step-1">
      <StepProgress step={1} label={content.stepIndicator(1)} />

      <TextField
        label={content.step1.establishmentLabel}
        placeholder={content.step1.establishmentPlaceholder}
        required
        autoComplete="organization"
        testId="field-establishment-name"
        value={form.step1.establishmentName}
        error={errorText(form.step1Errors.establishmentName)}
        onChange={(e) => form.updateStep1('establishmentName', e.target.value)}
      />
      <TextField
        label={content.step1.cityLabel}
        placeholder={content.step1.cityPlaceholder}
        required
        autoComplete="address-level2"
        testId="field-city"
        value={form.step1.city}
        error={errorText(form.step1Errors.city)}
        onChange={(e) => form.updateStep1('city', e.target.value)}
      />
      <TextField
        label={content.step1.activityLabel}
        placeholder={content.step1.activityPlaceholder}
        required
        testId="field-activity"
        value={form.step1.activity}
        error={errorText(form.step1Errors.activity)}
        onChange={(e) => form.updateStep1('activity', e.target.value)}
      />

      <button
        type="submit"
        data-testid="step-1-submit"
        className="group relative inline-flex w-full items-center justify-center rounded-full bg-flame py-[18px] pl-6 pr-14 text-[14.5px] font-bold uppercase tracking-[0.02em] text-white shadow-[0_16px_28px_-14px_rgba(226,69,44,0.6)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_36px_-14px_rgba(226,69,44,0.7)] active:translate-y-0 active:scale-[0.99]"
      >
        {content.step1.ctaLabel}
        <span className="absolute right-1.5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white transition-transform duration-200 group-hover:translate-x-0.5 group-hover:rotate-6">
          <ArrowUpRight className="h-4 w-4 text-flame" aria-hidden />
        </span>
      </button>
    </form>
  );
}
