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

/** Consent captured from the mandatory, unchecked-by-default form checkbox. */
export interface ConsentData {
  /** Version of the privacy notice actually shown to the visitor. */
  noticeVersion: string;
  /** Always true by the time a lead is submitted — the controller rejects false. */
  marketingConsent: boolean;
  /** ISO timestamp of the moment the visitor ticked the box. */
  marketingConsentAt: string;
}

export interface CRMLeadRecord {
  id: string;
  /**
   * Idempotency key for the CRM call — generated client-side, one per form
   * submission, reused verbatim on every retry so the CRM de-duplicates.
   */
  submissionId: string;
  /** Market/country code the lead came in through (fr, ma, sn, ...) — decides which CRM receives it. */
  market: string;
  establishmentName: string;
  city: string;
  activity: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  website: string;
  attribution: AttributionData;
  consent: ConsentData;
  receivedAt: string;
}

export type LeadStatus = 'sent' | 'pending';

export interface StoredLead extends CRMLeadRecord {
  status: LeadStatus;
}
