import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLeadForm } from '../../hooks/useLeadForm';
import type { LandingContent } from '../../content/types';
import { ROUTES, type MarketCode } from '../../lib/routes';
import type { FieldErrorCode } from '../../lib/validation';
import { Reveal } from '../ui/Reveal';
import { FormProgress } from './FormProgress';
import { Honeypot } from './fields/Honeypot';
import { TextField } from './fields/TextField';

interface LeadFormProps {
  content: LandingContent['form'];
  market: MarketCode;
}

export function LeadForm({ content, market }: LeadFormProps) {
  const form = useLeadForm(market);

  const errorMessage = (code?: FieldErrorCode): string | undefined => {
    if (!code) return undefined;
    if (code === 'invalid_email') return content.errors.email;
    if (code === 'invalid_phone') return content.errors.phone;
    if (code === 'invalid_website') return content.errors.website;
    return content.errors.required;
  };

  return (
    <section id={content.anchorId} className="relative overflow-hidden bg-cream py-24 sm:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(45rem 24rem at 50% 0%, oklch(0.33 0.075 264 / 0.06), transparent 65%)' }}
      />
      <div className="relative mx-auto max-w-[88rem] px-5 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <h2 className="text-balance text-3xl font-700 leading-[1.1] text-navy sm:text-4xl lg:text-[2.85rem]">
            {content.title}
          </h2>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{content.subtitle}</p>
        </div>

        <div className="mx-auto mt-12 max-w-xl">
          <Reveal>
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
              <FormProgress
                step={form.step}
                label={content.stepIndicator(form.step)}
                labels={['Votre établissement', 'Coordonnées']}
              />

              <div className="p-6 sm:p-8">
                {form.step === 1 ? (
                  <form
                    onSubmit={form.submitStep1}
                    noValidate
                    className="space-y-5"
                    data-testid="lead-form-step-1"
                  >
                    <h3 className="font-display text-lg font-700 text-navy">{content.step1.title}</h3>

                    <TextField
                      label={content.step1.establishmentLabel}
                      required
                      autoComplete="organization"
                      testId="field-establishment-name"
                      value={form.step1.establishmentName}
                      error={errorMessage(form.step1Errors.establishmentName)}
                      onChange={(event) => form.updateStep1('establishmentName', event.target.value)}
                    />
                    <div className="grid gap-5 sm:grid-cols-2">
                      <TextField
                        label={content.step1.cityLabel}
                        required
                        autoComplete="address-level2"
                        testId="field-city"
                        value={form.step1.city}
                        error={errorMessage(form.step1Errors.city)}
                        onChange={(event) => form.updateStep1('city', event.target.value)}
                      />
                      <TextField
                        label={content.step1.activityLabel}
                        required
                        testId="field-activity"
                        value={form.step1.activity}
                        error={errorMessage(form.step1Errors.activity)}
                        onChange={(event) => form.updateStep1('activity', event.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      data-testid="step-1-submit"
                      className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-flame px-6 py-4 text-sm font-700 uppercase tracking-wide text-primary-foreground shadow-glow-flame transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105"
                    >
                      {content.step1.ctaLabel}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                    </button>
                  </form>
                ) : null}

                {form.step === 2 ? (
                  <form
                    onSubmit={form.submitStep2}
                    noValidate
                    className="space-y-5"
                    data-testid="lead-form-step-2"
                  >
                    <h3 className="font-display text-lg font-700 text-navy">{content.step2.title}</h3>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <TextField
                        label={content.step2.firstNameLabel}
                        required
                        autoComplete="given-name"
                        testId="field-first-name"
                        value={form.step2.firstName}
                        error={errorMessage(form.step2Errors.firstName)}
                        onChange={(event) => form.updateStep2('firstName', event.target.value)}
                      />
                      <TextField
                        label={content.step2.lastNameLabel}
                        required
                        autoComplete="family-name"
                        testId="field-last-name"
                        value={form.step2.lastName}
                        error={errorMessage(form.step2Errors.lastName)}
                        onChange={(event) => form.updateStep2('lastName', event.target.value)}
                      />
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <TextField
                        label={content.step2.phoneLabel}
                        required
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        testId="field-phone"
                        value={form.step2.phone}
                        error={errorMessage(form.step2Errors.phone)}
                        onChange={(event) => form.updateStep2('phone', event.target.value)}
                      />
                      <TextField
                        label={content.step2.emailLabel}
                        required
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        testId="field-email"
                        value={form.step2.email}
                        error={errorMessage(form.step2Errors.email)}
                        onChange={(event) => form.updateStep2('email', event.target.value)}
                      />
                    </div>
                    <TextField
                      label={content.step2.websiteLabel}
                      hint={content.step2.websiteOptionalHint}
                      type="text"
                      inputMode="url"
                      autoComplete="url"
                      placeholder="monsite.fr"
                      testId="field-website"
                      value={form.step2.website}
                      error={errorMessage(form.step2Errors.website)}
                      onChange={(event) => form.updateStep2('website', event.target.value)}
                    />

                    <Honeypot value={form.step2.companyWebsiteHp} onChange={(value) => form.updateStep2('companyWebsiteHp', value)} />

                    <div>
                      <label className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                        <input
                          type="checkbox"
                          data-testid="field-consent"
                          checked={form.consent}
                          onChange={(event) => form.toggleConsent(event.target.checked)}
                          aria-invalid={form.consentError || undefined}
                          className="mt-0.5 h-4 w-4 shrink-0 rounded border-border text-flame focus:ring-flame"
                        />
                        <span>
                          {content.consent.before}
                          <Link
                            to={ROUTES.politiqueConfidentialite(market)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-600 text-navy underline underline-offset-2 hover:text-flame"
                          >
                            {content.consent.linkLabel}
                          </Link>
                          {content.consent.after}
                        </span>
                      </label>
                      {form.consentError && (
                        <p role="alert" data-testid="consent-error" className="mt-1.5 text-xs font-600 text-destructive">
                          {content.consent.error}
                        </p>
                      )}
                    </div>

                    {form.submitError && (
                      <p role="alert" data-testid="submit-error" className="text-xs font-600 text-destructive">
                        {content.submitError}
                      </p>
                    )}

                    <div className="flex flex-col-reverse gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={form.goBackToStep1}
                        data-testid="step-2-back"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-5 py-4 text-sm font-700 text-navy transition-colors duration-200 hover:bg-muted"
                      >
                        <ArrowLeft className="h-4 w-4" aria-hidden />
                        {content.step2.backLabel}
                      </button>
                      <button
                        type="submit"
                        disabled={form.submitting || !form.consent}
                        data-testid="step-2-submit"
                        className="group inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-flame px-6 py-4 text-sm font-700 uppercase tracking-wide text-primary-foreground shadow-glow-flame transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 disabled:pointer-events-none disabled:opacity-70"
                      >
                        {form.submitting ? '…' : content.step2.ctaLabel}
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                      </button>
                    </div>
                  </form>
                ) : null}
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <ul className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] font-medium text-muted-foreground">
              {['Audit gratuit', 'Sans engagement', 'Analyse personnalisée'].map((item) => (
                <li key={item} className="inline-flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-flame" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
