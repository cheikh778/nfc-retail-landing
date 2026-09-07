import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import type { LandingContent } from '@/content/types';
import { PATHS } from '@/lib/paths';
import type { FieldErrorCode } from '@/lib/validation';
import { Honeypot } from '@/components/form/Honeypot';
import { TextField } from '@/components/form/TextField';
import type { useLeadForm } from '@/hooks/useLeadForm';
import { StepProgress } from './StepProgress';

interface Props {
  content: LandingContent['modal'];
  form: ReturnType<typeof useLeadForm>;
}

export function LeadModalStep2({ content, form }: Props) {
  const errorText = (code?: FieldErrorCode): string | undefined => {
    if (!code) return undefined;
    if (code === 'invalid_email') return content.errors.email;
    if (code === 'invalid_phone') return content.errors.phone;
    if (code === 'invalid_website') return content.errors.website;
    return content.errors.required;
  };

  return (
    <form onSubmit={form.submitStep2} noValidate className="space-y-4" data-testid="lead-form-step-2">
      <button
        type="button"
        onClick={form.goBackToStep1}
        data-testid="step-2-back"
        className="inline-flex items-center gap-1 text-[13.5px] font-semibold text-muted transition-colors hover:text-navy"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {content.step2.backLabel}
      </button>

      <StepProgress step={2} label={content.stepIndicator(2)} />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label={content.step2.firstNameLabel}
          placeholder={content.step2.firstNamePlaceholder}
          required
          autoComplete="given-name"
          testId="field-first-name"
          value={form.step2.firstName}
          error={errorText(form.step2Errors.firstName)}
          onChange={(e) => form.updateStep2('firstName', e.target.value)}
        />
        <TextField
          label={content.step2.lastNameLabel}
          placeholder={content.step2.lastNamePlaceholder}
          required
          autoComplete="family-name"
          testId="field-last-name"
          value={form.step2.lastName}
          error={errorText(form.step2Errors.lastName)}
          onChange={(e) => form.updateStep2('lastName', e.target.value)}
        />
      </div>

      <TextField
        label={content.step2.phoneLabel}
        placeholder={content.step2.phonePlaceholder}
        required
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        testId="field-phone"
        value={form.step2.phone}
        error={errorText(form.step2Errors.phone)}
        onChange={(e) => form.updateStep2('phone', e.target.value)}
      />
      <TextField
        label={content.step2.emailLabel}
        placeholder={content.step2.emailPlaceholder}
        required
        type="email"
        inputMode="email"
        autoComplete="email"
        testId="field-email"
        value={form.step2.email}
        error={errorText(form.step2Errors.email)}
        onChange={(e) => form.updateStep2('email', e.target.value)}
      />
      <TextField
        label={content.step2.websiteLabel}
        hint={content.step2.websiteOptionalHint}
        placeholder={content.step2.websitePlaceholder}
        type="text"
        inputMode="url"
        autoComplete="url"
        testId="field-website"
        value={form.step2.website}
        error={errorText(form.step2Errors.website)}
        onChange={(e) => form.updateStep2('website', e.target.value)}
      />

      <Honeypot value={form.step2.companyWebsiteHp} onChange={(v) => form.updateStep2('companyWebsiteHp', v)} />

      <label className="flex items-start gap-3 text-[13px] leading-relaxed text-muted">
        <input
          type="checkbox"
          data-testid="field-consent"
          checked={form.consent}
          onChange={(e) => form.toggleConsent(e.target.checked)}
          aria-invalid={form.consentError || undefined}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-field-border text-flame focus:ring-flame"
        />
        <span>
          {content.consent.before}
          <a
            href={PATHS.politiqueConfidentialite}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-navy underline underline-offset-2 hover:text-flame"
          >
            {content.consent.linkLabel}
          </a>
          {content.consent.after}
        </span>
      </label>
      {form.consentError && (
        <p role="alert" data-testid="consent-error" className="text-xs font-semibold text-destructive">
          {content.consent.error}
        </p>
      )}

      {form.submitError && (
        <p role="alert" data-testid="submit-error" className="text-xs font-semibold text-destructive">
          {content.submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={form.submitting || !form.consent}
        data-testid="step-2-submit"
        className="relative inline-flex w-full items-center justify-center rounded-full bg-flame py-[18px] pl-6 pr-14 text-[14.5px] font-bold uppercase tracking-[0.02em] text-white shadow-[0_16px_28px_-14px_rgba(226,69,44,0.6)] transition-transform duration-200 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-70"
      >
        {form.submitting ? '…' : content.step2.ctaLabel}
        <span className="absolute right-1.5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white">
          <ArrowUpRight className="h-4 w-4 text-flame" aria-hidden />
        </span>
      </button>
    </form>
  );
}
