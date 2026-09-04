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

export interface CRMLeadRecord {
  id: string;
  establishmentName: string;
  city: string;
  activity: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  website: string;
  attribution: AttributionData;
  receivedAt: string;
}

export type LeadStatus = 'sent' | 'pending';

export interface StoredLead extends CRMLeadRecord {
  status: LeadStatus;
}
