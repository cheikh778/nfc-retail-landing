import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const CRM_ENV_KEYS = ['CRM_FR_API_URL', 'CRM_FR_API_KEY', 'CRM_MA_API_URL', 'CRM_MA_API_KEY'];
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

describe('resolveCrmClient', () => {
  it('returns an UnconfiguredCrmClient for a market with no CRM env vars', async () => {
    const { resolveCrmClient } = await import('./resolveCrmClient.js');
    const { UnconfiguredCrmClient } = await import('./UnconfiguredCrmClient.js');
    expect(resolveCrmClient('sn')).toBeInstanceOf(UnconfiguredCrmClient);
  });

  it('returns an HttpCrmClient once a market has CRM env vars', async () => {
    process.env.CRM_MA_API_URL = 'https://crm-ma.example.com/leads';
    process.env.CRM_MA_API_KEY = 'ma-secret';

    const { resolveCrmClient } = await import('./resolveCrmClient.js');
    const { HttpCrmClient } = await import('./HttpCrmClient.js');
    expect(resolveCrmClient('ma')).toBeInstanceOf(HttpCrmClient);
  });

  it('resolves independently per market', async () => {
    process.env.CRM_FR_API_URL = 'https://crm-fr.example.com/leads';
    process.env.CRM_FR_API_KEY = 'fr-secret';

    const { resolveCrmClient } = await import('./resolveCrmClient.js');
    const { HttpCrmClient } = await import('./HttpCrmClient.js');
    const { UnconfiguredCrmClient } = await import('./UnconfiguredCrmClient.js');

    expect(resolveCrmClient('fr')).toBeInstanceOf(HttpCrmClient);
    expect(resolveCrmClient('sn')).toBeInstanceOf(UnconfiguredCrmClient);
  });

  it('caches the client instance per market', async () => {
    const { resolveCrmClient } = await import('./resolveCrmClient.js');
    expect(resolveCrmClient('fr')).toBe(resolveCrmClient('fr'));
  });
});
