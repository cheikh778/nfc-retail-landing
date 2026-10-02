import { useCallback, useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { getContent } from '@/content';
import { submitLead } from '@/lib/api';
import { PATHS } from '@/lib/paths';
import { normalizePhone } from '@/lib/phone';
import { track } from '@/lib/tracking';
import { validateLead, type FieldErrorCode, type LeadFields } from '@/lib/validation';

/** RFC4122 v4 UUID — used as the CRM idempotency key for one submission. */
function newSubmissionId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `sub-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  }
}

const EMPTY: LeadFields = {
  establishmentName: '',
  city: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
};

/** Key the /merci page reads once to greet the visitor, then clears. */
export const MERCI_CONTEXT_KEY = 'nfcr_merci_ctx';

type Errors = Partial<Record<keyof LeadFields, FieldErrorCode>>;

function goToMerci(firstName: string, establishmentName: string): void {
  try {
    sessionStorage.setItem(MERCI_CONTEXT_KEY, JSON.stringify({ firstName, establishmentName }));
  } catch {
    // Best-effort greeting only.
  }
}

/**
 * Single-step lead form (the poster form). Collects establishment + city +
 * contact, then POSTs the lead and routes to /merci. Consent is implicit —
 * submitting the form is the opt-in (an "En envoyant… vous acceptez" line +
 * a hidden pre-checked checkbox sit next to the button); `marketingConsent`
 * is always sent as true. The submission id is stable for the form's lifetime
 * so a retry after a failed submit is de-duplicated by the CRM.
 */
export function useLeadForm() {
  const router = useRouter();
  const [values, setValues] = useState<LeadFields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [honeypot, setHoneypotState] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const hasStarted = useRef(false);
  const formRenderedAt = useRef(new Date().toISOString());
  const submissionId = useRef(newSubmissionId());
  const submitInFlight = useRef(false);

  const markStarted = useCallback(() => {
    if (!hasStarted.current) {
      hasStarted.current = true;
      track('form_start', { form_id: 'visibility_diagnostic' });
    }
  }, []);

  const updateField = useCallback(
    (field: keyof LeadFields, value: string) => {
      markStarted();
      setValues((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    [markStarted],
  );

  const setHoneypot = useCallback(
    (value: string) => {
      markStarted();
      setHoneypotState(value);
    },
    [markStarted],
  );

  const submit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      if (submitInFlight.current) return;

      if (honeypot.trim()) {
        // Honeypot triggered: behave as a normal success without ever calling the API.
        goToMerci(values.firstName, values.establishmentName);
        router.push(PATHS.merci);
        return;
      }

      const nextErrors = validateLead(values);
      setErrors(nextErrors);
      const invalidCount = Object.keys(nextErrors).length;
      if (invalidCount > 0) {
        track('form_validation_error', { form_id: 'visibility_diagnostic', invalid_field_count: invalidCount });
        return;
      }

      submitInFlight.current = true;
      setSubmitting(true);
      setSubmitError(false);
      let captured = false;
      try {
        track('form_submit', { form_id: 'visibility_diagnostic' });
        await submitLead(
          {
            ...values,
            activity: '',
            website: '',
            companyWebsiteHp: '',
            phone: normalizePhone(values.phone),
          },
          {
            formRenderedAt: formRenderedAt.current,
            submissionId: submissionId.current,
            consent: {
              noticeVersion: getContent().privacy.noticeVersion,
              marketingConsent: true,
              marketingConsentAt: new Date().toISOString(),
            },
          },
        );
        captured = true;
        track('form_complete', { form_id: 'visibility_diagnostic' });
        track('generate_lead', { form_id: 'visibility_diagnostic', method: 'visibility_diagnostic' });
        goToMerci(values.firstName, values.establishmentName);
        router.push(PATHS.merci);
      } catch {
        track('form_submit_error', { form_id: 'visibility_diagnostic', error_type: 'submission_failed' });
        setSubmitError(true);
      } finally {
        // Navigation is asynchronous: keep a captured lead locked until unmount.
        if (!captured) {
          submitInFlight.current = false;
          setSubmitting(false);
        }
      }
    },
    [values, honeypot, router],
  );

  return {
    values,
    errors,
    honeypot,
    submitting,
    submitError,
    updateField,
    setHoneypot,
    submit,
  };
}
