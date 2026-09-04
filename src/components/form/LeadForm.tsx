import { useLeadForm } from '../../hooks/useLeadForm';
import type { LandingContent } from '../../content/types';
import type { FieldErrorCode } from '../../lib/validation';
import { FormProgress } from './FormProgress';
import { Honeypot } from './fields/Honeypot';
import { TextField } from './fields/TextField';
import styles from './LeadForm.module.css';

interface LeadFormProps {
  content: LandingContent['form'];
}

export function LeadForm({ content }: LeadFormProps) {
  const form = useLeadForm();

  const errorMessage = (code?: FieldErrorCode): string | undefined => {
    if (!code) return undefined;
    if (code === 'invalid_email') return content.errors.email;
    if (code === 'invalid_phone') return content.errors.phone;
    if (code === 'invalid_website') return content.errors.website;
    return content.errors.required;
  };

  return (
    <section id={content.anchorId} className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.card}>
          <div className={styles.head}>
            <h2 className={styles.title}>{content.title}</h2>
            <p className={styles.subtitle}>{content.subtitle}</p>
          </div>

          <FormProgress step={form.step} label={content.stepIndicator(form.step)} />

          {form.step === 1 ? (
            <form onSubmit={form.submitStep1} noValidate className={styles.form} data-testid="lead-form-step-1">
              <h3 className={styles.stepTitle}>{content.step1.title}</h3>

              <TextField
                label={content.step1.establishmentLabel}
                required
                autoComplete="organization"
                testId="field-establishment-name"
                value={form.step1.establishmentName}
                error={errorMessage(form.step1Errors.establishmentName)}
                onChange={(event) => form.updateStep1('establishmentName', event.target.value)}
              />
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

              <button type="submit" className="btn btn-primary btn-lg btn-block" data-testid="step-1-submit">
                {content.step1.ctaLabel}
              </button>
            </form>
          ) : (
            <form onSubmit={form.submitStep2} noValidate className={styles.form} data-testid="lead-form-step-2">
              <h3 className={styles.stepTitle}>{content.step2.title}</h3>

              <div className={styles.row}>
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

              <Honeypot
                value={form.step2.companyWebsiteHp}
                onChange={(value) => form.updateStep2('companyWebsiteHp', value)}
              />

              {form.submitError && (
                <p role="alert" className={styles.submitError} data-testid="submit-error">
                  {content.submitError}
                </p>
              )}

              <div className={styles.actions}>
                <button
                  type="button"
                  onClick={form.goBackToStep1}
                  className={`btn btn-secondary ${styles.backBtn}`}
                  data-testid="step-2-back"
                >
                  {content.step2.backLabel}
                </button>
                <button
                  type="submit"
                  className={`btn btn-primary btn-lg btn-block ${styles.submitBtn}`}
                  disabled={form.submitting}
                  data-testid="step-2-submit"
                >
                  {form.submitting ? '…' : content.step2.ctaLabel}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
