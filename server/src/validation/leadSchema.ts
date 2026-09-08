import { z } from 'zod';

const attributionSchema = z.object({
  utm_source: z.string().nullable(),
  utm_medium: z.string().nullable(),
  utm_campaign: z.string().nullable(),
  utm_content: z.string().nullable(),
  utm_term: z.string().nullable(),
  gclid: z.string().nullable(),
  gbraid: z.string().nullable(),
  wbraid: z.string().nullable(),
  fbclid: z.string().nullable(),
  msclkid: z.string().nullable(),
  landing_page: z.string().max(2000),
  landing_path: z.string().max(500),
  referrer: z.string().max(2000),
  landing_timestamp: z.string(),
});

const consentSchema = z.object({
  noticeVersion: z.string().trim().min(1).max(64),
  marketingConsent: z.boolean(),
  marketingConsentAt: z.string().datetime({ offset: true }),
});

// Matches the CRM's Idempotency-Key rule: 8–128 chars from letters, digits,
// '.', '_', ':' and '-'. A UUID fits comfortably.
const SUBMISSION_ID_RE = /^[A-Za-z0-9._:-]{8,128}$/;

export const leadSchema = z.object({
  submissionId: z.string().regex(SUBMISSION_ID_RE),
  establishmentName: z.string().trim().min(1).max(200),
  city: z.string().trim().min(1).max(120),
  // The France "visibilité" form (validated mock) does not ask for an activity;
  // it stays in the schema for other entry points / markets but is optional.
  activity: z.string().trim().max(120).optional().default(''),
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(1).max(40),
  email: z.string().trim().email().max(200),
  website: z.string().trim().max(300).optional().default(''),
  companyWebsiteHp: z.string().max(300).optional().default(''),
  formRenderedAt: z.string(),
  attribution: attributionSchema,
  consent: consentSchema,
});

export type LeadInput = z.infer<typeof leadSchema>;
