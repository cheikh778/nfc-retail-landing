import { describe, expect, it } from 'vitest';
import { isSupportedMarket, normalizeMarket, ROUTES } from './routes';

describe('isSupportedMarket', () => {
  it('accepts fr/ma/sn', () => {
    expect(isSupportedMarket('fr')).toBe(true);
    expect(isSupportedMarket('ma')).toBe(true);
    expect(isSupportedMarket('sn')).toBe(true);
  });

  it('rejects unknown or missing values', () => {
    expect(isSupportedMarket('xx')).toBe(false);
    expect(isSupportedMarket('')).toBe(false);
    expect(isSupportedMarket(undefined)).toBe(false);
  });
});

describe('normalizeMarket', () => {
  it('passes through a supported market', () => {
    expect(normalizeMarket('ma')).toBe('ma');
  });

  it('falls back to fr for anything unsupported or missing, rather than breaking the page', () => {
    expect(normalizeMarket('xx')).toBe('fr');
    expect(normalizeMarket(undefined)).toBe('fr');
  });
});

describe('ROUTES', () => {
  it('builds market-scoped paths', () => {
    expect(ROUTES.visibilite('ma')).toBe('/ma/visibilite');
    expect(ROUTES.merci('sn')).toBe('/sn/visibilite/merci');
    expect(ROUTES.mentionsLegales('fr')).toBe('/fr/mentions-legales');
  });
});
