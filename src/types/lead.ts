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
  gclid: string | null;
  fbclid: string | null;
  msclkid: string | null;
  landing_page: string;
  landing_path: string;
  referrer: string;
  landing_timestamp: string;
}

export interface LeadSubmissionPayload extends LeadFormData {
  attribution: AttributionData;
  /** Client-side render timestamp, used server-side as a time-trap anti-spam signal. */
  formRenderedAt: string;
}
