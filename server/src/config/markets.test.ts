import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const CRM_ENV_KEYS = [
  'CRM_API_URL',
  'CRM_API_KEY',
  'CRM_PIPELINE',
  'CRM_SOURCE',
  'CRM_FR_API_URL',
  'CRM_FR_API_KEY',
  'CRM_MA_API_URL',
  'CRM_MA_API_KEY',
  'CRM_SN_API_URL',
  'CRM_SN_API_KEY',
];

let savedEnv: Record<string, string | undefined>;

beforeEach(() => {
  savedEnv = Object.fromEntries(CRM_ENV_KEYS.map((key) => [key, process.env[key]]));
  for (const key of CRM_ENV_KEYS) delete process.env[key];
  vi.resetModules();
});

afterEach(() => {
  for (const key of CRM_ENV_KEYS) {
    if (savedEnv[key] === undefined) delete process.env[key];
    else process.env[key] = savedEnv[key];
  }
});

describe('isSupportedMarket', () => {
  it('accepts fr/ma/sn and rejects anything else', async () => {
    const { isSupportedMarket } = await import('./markets.js');
    expect(isSupportedMarket('fr')).toBe(true);
    expect(isSupportedMarket('ma')).toBe(true);
    expect(isSupportedMarket('sn')).toBe(true);
    expect(isSupportedMarket('xx')).toBe(false);
    expect(isSupportedMarket('')).toBe(false);
  });
});

describe('MARKET_CRM_CONFIG', () => {
  it('is unconfigured for every market by default', async () => {
    const { MARKET_CRM_CONFIG, isMarketCrmConfigured } = await import('./markets.js');
    expect(isMarketCrmConfigured('fr')).toBe(false);
    expect(isMarketCrmConfigured('ma')).toBe(false);
    expect(MARKET_CRM_CONFIG.sn.source).toBe('nfc-retail-landing-sn');
  });

  it('reads market-prefixed env vars', async () => {
    process.env.CRM_MA_API_URL = 'https://crm-ma.example.com/leads';
    process.env.CRM_MA_API_KEY = 'ma-secret';

    const { MARKET_CRM_CONFIG, isMarketCrmConfigured } = await import('./markets.js');
    expect(isMarketCrmConfigured('ma')).toBe(true);
    expect(MARKET_CRM_CONFIG.ma.apiUrl).toBe('https://crm-ma.example.com/leads');
    expect(isMarketCrmConfigured('fr')).toBe(false);
    expect(isMarketCrmConfigured('sn')).toBe(false);
  });

  it('falls back to the legacy unprefixed CRM_* vars for fr only', async () => {
    process.env.CRM_API_URL = 'https://legacy-crm.example.com/leads';
    process.env.CRM_API_KEY = 'legacy-secret';

    const { MARKET_CRM_CONFIG, isMarketCrmConfigured } = await import('./markets.js');
    expect(isMarketCrmConfigured('fr')).toBe(true);
    expect(MARKET_CRM_CONFIG.fr.apiUrl).toBe('https://legacy-crm.example.com/leads');
    expect(isMarketCrmConfigured('ma')).toBe(false);
  });

  it('prefers CRM_FR_* over the legacy alias when both are set', async () => {
    process.env.CRM_API_URL = 'https://legacy-crm.example.com/leads';
    process.env.CRM_FR_API_URL = 'https://crm-fr.example.com/leads';

    const { MARKET_CRM_CONFIG } = await import('./markets.js');
    expect(MARKET_CRM_CONFIG.fr.apiUrl).toBe('https://crm-fr.example.com/leads');
  });
});
