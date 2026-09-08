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

  const markStarted = useCallback(() => {
    if (!hasStarted.current) {
      hasStarted.current = true;
      track('form_start');
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

      if (honeypot.trim()) {
        // Honeypot triggered: behave as a normal success without ever calling the API.
        goToMerci(values.firstName, values.establishmentName);
        router.push(PATHS.merci);
        return;
      }

      const nextErrors = validateLead(values);
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) return;

      setSubmitting(true);
      setSubmitError(false);
      try {
        track('form_complete');
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
        track('generate_lead');
        goToMerci(values.firstName, values.establishmentName);
        router.push(PATHS.merci);
      } catch {
        setSubmitError(true);
      } finally {
        setSubmitting(false);
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
