import { useCallback, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { getContent } from '../content';
import { submitLead } from '../lib/api';
import { normalizePhone } from '../lib/phone';
import { ROUTES, type MarketCode } from '../lib/routes';
import { track } from '../lib/tracking';
import { normalizeWebsiteUrl } from '../lib/url';
import { validateStep1, validateStep2, type FieldErrorCode } from '../lib/validation';
import type { LeadStep1, LeadStep2 } from '../types/lead';

/** RFC4122 v4 UUID — used as the CRM idempotency key for one submission. */
function newSubmissionId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `sub-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  }
}

const EMPTY_STEP1: LeadStep1 = { establishmentName: '', city: '', activity: '' };
const EMPTY_STEP2: LeadStep2 = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  website: '',
  companyWebsiteHp: '',
};

type Step1Errors = Partial<Record<keyof LeadStep1, FieldErrorCode>>;
type Step2Errors = Partial<Record<keyof Omit<LeadStep2, 'companyWebsiteHp'>, FieldErrorCode>>;

export function useLeadForm(market: MarketCode) {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [step1, setStep1] = useState<LeadStep1>(EMPTY_STEP1);
  const [step2, setStep2] = useState<LeadStep2>(EMPTY_STEP2);
  const [step1Errors, setStep1Errors] = useState<Step1Errors>({});
  const [step2Errors, setStep2Errors] = useState<Step2Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);

  const hasStarted = useRef(false);
  const formRenderedAt = useRef(new Date().toISOString());
  // One idempotency key for the whole lifetime of this form — reused as-is if
  // the visitor retries after a failed submit, so the CRM de-duplicates.
  const submissionId = useRef(newSubmissionId());

  const markStarted = useCallback(() => {
    if (!hasStarted.current) {
      hasStarted.current = true;
      track('form_start');
    }
  }, []);

  const updateStep1 = useCallback(
    (field: keyof LeadStep1, value: string) => {
      markStarted();
      setStep1((prev) => ({ ...prev, [field]: value }));
      setStep1Errors((prev) => ({ ...prev, [field]: undefined }));
    },
    [markStarted],
  );

  const updateStep2 = useCallback(
    (field: keyof LeadStep2, value: string) => {
      markStarted();
      setStep2((prev) => ({ ...prev, [field]: value }));
      if (field !== 'companyWebsiteHp') {
        setStep2Errors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [markStarted],
  );

  const toggleConsent = useCallback((value: boolean) => {
    markStarted();
    setConsent(value);
    if (value) setConsentError(false);
  }, [markStarted]);

  const goBackToStep1 = useCallback(() => setStep(1), []);

  const submitStep1 = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      const errors = validateStep1(step1);
      setStep1Errors(errors);
      if (Object.keys(errors).length > 0) return;
      track('form_step_1_complete');
      setStep(2);
      track('form_step_2_view');
    },
    [step1],
  );

  const submitStep2 = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      if (step2.companyWebsiteHp.trim()) {
        // Honeypot triggered: behave as a normal success without ever calling the API.
        navigate(ROUTES.merci(market));
        return;
      }

      const errors = validateStep2(step2);
      setStep2Errors(errors);
      if (Object.keys(errors).length > 0) return;

      // Consent is mandatory — never call the API without it (brief / CRM contract).
      if (!consent) {
        setConsentError(true);
        return;
      }

      setSubmitting(true);
      setSubmitError(false);
      try {
        track('form_complete');
        await submitLead(
          market,
          {
            ...step1,
            ...step2,
            phone: normalizePhone(step2.phone),
            website: normalizeWebsiteUrl(step2.website) ?? '',
          },
          {
            formRenderedAt: formRenderedAt.current,
            submissionId: submissionId.current,
            consent: {
              noticeVersion: getContent(market).privacy.noticeVersion,
              marketingConsent: true,
              marketingConsentAt: new Date().toISOString(),
            },
          },
        );
        track('generate_lead');
        navigate(ROUTES.merci(market), {
          state: { firstName: step2.firstName, establishmentName: step1.establishmentName },
        });
      } catch {
        setSubmitError(true);
      } finally {
        setSubmitting(false);
      }
    },
    [step1, step2, consent, navigate, market],
  );

  return {
    step,
    step1,
    step2,
    step1Errors,
    step2Errors,
    submitting,
    submitError,
    consent,
    consentError,
    updateStep1,
    updateStep2,
    toggleConsent,
    goBackToStep1,
    submitStep1,
    submitStep2,
  };
}
