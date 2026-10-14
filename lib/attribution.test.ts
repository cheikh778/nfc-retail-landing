import { describe, expect, it } from 'vitest';
import type { AttributionData } from '@/types/lead';
import { normalizeAttribution } from './attribution';

function input(overrides: Partial<AttributionData> = {}): AttributionData {
  return {
    utm_source: null, utm_medium: null, utm_campaign: null, utm_content: null, utm_term: null,
    gclid: null, gbraid: null, wbraid: null, fbclid: null, msclkid: null,
    landing_page: 'https://nfcretail.com/fr/visibilite/', landing_path: '/fr/visibilite/',
    referrer: '', landing_timestamp: '2026-10-14T12:00:00.000Z', ...overrides,
  };
}

describe('lead attribution policy', () => {
  it.each(['google', 'chatgpt', 'chatgpt.com', 'linkedin', 'newsletter', 'partenaire-inconnu'])('preserves any explicit source: %s', (source) => {
    expect(normalizeAttribution(input({ utm_source: source, utm_medium: 'ads', gclid: 'click' }))).toMatchObject({
      utm_source: source, utm_medium: 'ads', gclid: 'click',
    });
  });

  it.each(['gclid', 'gbraid', 'wbraid'] as const)('identifies Google Ads from %s without UTMs', (key) => {
    expect(normalizeAttribution(input({ [key]: 'Google-CaSe-sensitive' }))).toMatchObject({
      utm_source: 'google', utm_medium: 'cpc', [key]: 'Google-CaSe-sensitive',
    });
  });

  it('recovers missing fields from the entry URL, including encoded and uppercase parameters', () => {
    expect(normalizeAttribution(input({ landing_page: 'https://nfcretail.com/fr/visibilite/?UTM_SOURCE=&UTM_SOURCE=chatgpt.com&utm_medium=paid_social&utm_campaign=France%20%26%20caf%C3%A9s&gclid=Case%2BId' }))).toMatchObject({
      utm_source: 'chatgpt.com', utm_medium: 'paid_social', utm_campaign: 'France & cafés', gclid: 'Case+Id',
    });
  });

  it.each([
    ['https://chatgpt.com/c/example', 'chatgpt.com', 'referral'],
    ['https://www.google.fr/search?q=example', 'google', 'organic'],
    ['https://www.bing.com/search', 'bing', 'organic'],
    ['https://partenaire.example/campaign', 'partenaire.example', 'referral'],
    ['https://google.evil.example/', 'google.evil.example', 'referral'],
  ])('uses the external referrer %s', (referrer, source, medium) => {
    expect(normalizeAttribution(input({ referrer }))).toMatchObject({ utm_source: source, utm_medium: medium });
  });

  it.each(['', 'https://nfcretail.com/fr/', 'https://www.nfcretail.com/', 'https://api.nfcretail.com/', 'not-a-url'])('labels a visit without acquisition evidence as direct: %s', (referrer) => {
    expect(normalizeAttribution(input({ referrer }))).toMatchObject({ utm_source: 'direct', utm_medium: '(none)', utm_campaign: null });
  });

  it('does not invent a source for an incomplete campaign', () => {
    expect(normalizeAttribution(input({ utm_campaign: 'campagne_sans_source' }))).toMatchObject({ utm_source: 'unknown', utm_medium: '(unknown)' });
  });

  it('does not invent a paid medium for a source-only URL', () => {
    expect(normalizeAttribution(input({ utm_source: 'chatgpt.com' }))).toMatchObject({ utm_source: 'chatgpt.com', utm_medium: '(unknown)' });
  });

  it('recognizes Microsoft clicks and does not classify every Facebook click as an ad', () => {
    expect(normalizeAttribution(input({ msclkid: 'ms-click' }))).toMatchObject({ utm_source: 'bing', utm_medium: 'cpc', msclkid: 'ms-click' });
    expect(normalizeAttribution(input({ fbclid: 'fb-click' }))).toMatchObject({ utm_source: 'facebook', utm_medium: 'social', fbclid: 'fb-click' });
  });

  it('normalizes blanks and placeholder values without trusting malformed URLs', () => {
    expect(normalizeAttribution(input({ utm_source: '  null ', utm_medium: '  ', gclid: '', landing_page: 'not-a-url' }))).toMatchObject({ utm_source: 'direct', utm_medium: '(none)', gclid: null });
  });

  it('bounds legacy metadata and inferred sources consistently on repeated normalization', () => {
    const result = normalizeAttribution(input({
      landing_page: 'https://nfcretail.com/fr/visibilite/?unused=' + 'x'.repeat(2100),
      landing_path: '/' + 'x'.repeat(550),
      referrer: 'https://' + 'x'.repeat(550) + '.example/' + 'x'.repeat(2100),
    }));
    expect(result.landing_page).toHaveLength(2000);
    expect(result.landing_path).toHaveLength(500);
    expect(result.referrer).toHaveLength(2000);
    expect(result.utm_source).toHaveLength(500);
    expect(normalizeAttribution(result)).toEqual(result);
  });
});
