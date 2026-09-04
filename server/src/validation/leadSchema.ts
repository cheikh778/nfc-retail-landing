import { z } from 'zod';

const attributionSchema = z.object({
  utm_source: z.string().nullable(),
  utm_medium: z.string().nullable(),
  utm_campaign: z.string().nullable(),
  utm_content: z.string().nullable(),
  utm_term: z.string().nullable(),
  gclid: z.string().nullable(),
  fbclid: z.string().nullable(),
  msclkid: z.string().nullable(),
  landing_page: z.string().max(2000),
  landing_path: z.string().max(500),
  referrer: z.string().max(2000),
  landing_timestamp: z.string(),
});

export const leadSchema = z.object({
  establishmentName: z.string().trim().min(1).max(200),
  city: z.string().trim().min(1).max(120),
  activity: z.string().trim().min(1).max(120),
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  phone: z.string().trim().min(1).max(40),
  email: z.string().trim().email().max(200),
  website: z.string().trim().max(300).optional().default(''),
  companyWebsiteHp: z.string().max(300).optional().default(''),
  formRenderedAt: z.string(),
  attribution: attributionSchema,
});

export type LeadInput = z.infer<typeof leadSchema>;
