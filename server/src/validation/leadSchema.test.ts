import { describe, expect, it } from 'vitest';
import { leadSchema } from './leadSchema.js';

const attribution = {
  utm_source: null,
  utm_medium: null,
  utm_campaign: null,
  utm_content: null,
  utm_term: null,
  gclid: null,
  gbraid: null,
  wbraid: null,
  fbclid: null,
  msclkid: null,
  landing_page: 'https://nfcretail.com/fr/visibilite',
  landing_path: '/fr/visibilite',
  referrer: '',
  landing_timestamp: new Date().toISOString(),
};

const consent = {
  noticeVersion: '2026-09-01',
  marketingConsent: true,
  marketingConsentAt: new Date().toISOString(),
};

const validPayload = {
  submissionId: '01991ad8-6682-7ab1-b840-f42c3ce971de',
  consent,
  establishmentName: 'Boulangerie Saint-Antoine',
  city: 'Lyon',
  activity: 'Boulangerie',
  firstName: 'Camille',
  lastName: 'Moreau',
  phone: '0674321985',
  email: 'camille.moreau@gmail.com',
  website: '',
  companyWebsiteHp: '',
  formRenderedAt: new Date().toISOString(),
  attribution,
};

describe('leadSchema', () => {
  it('accepts a complete, valid payload', () => {
    expect(leadSchema.safeParse(validPayload).success).toBe(true);
  });

  it('rejects a missing required field', () => {
    const { establishmentName: _drop, ...rest } = validPayload;
    expect(leadSchema.safeParse(rest).success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const result = leadSchema.safeParse({ ...validPayload, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('defaults website and honeypot to an empty string when omitted', () => {
    const { website: _w, companyWebsiteHp: _h, ...rest } = validPayload;
    const result = leadSchema.safeParse(rest);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.website).toBe('');
      expect(result.data.companyWebsiteHp).toBe('');
    }
  });

  it('rejects a payload missing attribution', () => {
    const { attribution: _a, ...rest } = validPayload;
    expect(leadSchema.safeParse(rest).success).toBe(false);
  });

  it('rejects a payload missing consent', () => {
    const { consent: _c, ...rest } = validPayload;
    expect(leadSchema.safeParse(rest).success).toBe(false);
  });

  it('rejects a submissionId that violates the Idempotency-Key charset/length', () => {
    expect(leadSchema.safeParse({ ...validPayload, submissionId: 'too/short!' }).success).toBe(false);
    expect(leadSchema.safeParse({ ...validPayload, submissionId: 'short' }).success).toBe(false);
  });

  it('accepts marketingConsent:false at the schema level (the controller enforces true)', () => {
    const result = leadSchema.safeParse({
      ...validPayload,
      consent: { ...consent, marketingConsent: false },
    });
    expect(result.success).toBe(true);
  });
});
