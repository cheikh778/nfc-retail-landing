export interface LeadStep1 {
  establishmentName: string;
  city: string;
  activity: string;
}

export interface LeadStep2 {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  website: string;
  /** Honeypot field — must stay empty. Real users never see or fill it. */
  companyWebsiteHp: string;
}

export type LeadFormData = LeadStep1 & LeadStep2;

export interface AttributionData {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  gclid: string | null;
  gbraid: string | null;
  wbraid: string | null;
  fbclid: string | null;
  msclkid: string | null;
  landing_page: string;
  landing_path: string;
  referrer: string;
  landing_timestamp: string;
}

export interface ConsentData {
  /** Version of the privacy notice displayed to the visitor. */
  noticeVersion: string;
  marketingConsent: boolean;
  /** ISO timestamp of the moment the box was ticked. */
  marketingConsentAt: string;
}

export interface LeadSubmissionPayload extends LeadFormData {
  /** Stable per form submission, reused on retry — the CRM idempotency key. */
  submissionId: string;
  attribution: AttributionData;
  consent: ConsentData;
  /** Client-side render timestamp, used server-side as a time-trap anti-spam signal. */
  formRenderedAt: string;
}
