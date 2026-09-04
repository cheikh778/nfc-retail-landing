import { describe, expect, it } from 'vitest';
import { leadSchema } from './leadSchema.js';

const attribution = {
  utm_source: null,
  utm_medium: null,
  utm_campaign: null,
  utm_content: null,
  gclid: null,
  fbclid: null,
  msclkid: null,
  landing_page: 'https://nfcretail.com/fr/visibilite',
  landing_path: '/fr/visibilite',
  referrer: '',
  landing_timestamp: new Date().toISOString(),
};

const validPayload = {
  establishmentName: 'Boulangerie du Coin',
  city: 'Lyon',
  activity: 'Boulangerie',
  firstName: 'Jean',
  lastName: 'Dupont',
  phone: '0601020304',
  email: 'jean@example.com',
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
});
