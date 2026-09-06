import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { logger } from '../lib/logger.js';
import type { CRMLeadRecord } from '../types/lead.js';
import { CrmNotConfiguredError, type CrmClient } from './crm/CrmClient.js';
import { LeadService } from './LeadService.js';
import { LeadStore } from './LeadStore.js';

class FakeCrmClient implements CrmClient {
  calls: CRMLeadRecord[] = [];
  constructor(private readonly behavior: 'succeed' | 'unconfigured' | 'fail') {}

  async createLead(lead: CRMLeadRecord): Promise<void> {
    this.calls.push(lead);
    if (this.behavior === 'succeed') return;
    if (this.behavior === 'unconfigured') throw new CrmNotConfiguredError();
    throw new Error('CRM is down');
  }
}

const attribution = {
  utm_source: 'chatgpt',
  utm_medium: 'ads',
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

const newLead = {
  submissionId: '01991ad8-6682-7ab1-b840-f42c3ce971de',
  consent: {
    noticeVersion: '2026-09-01',
    marketingConsent: true,
    marketingConsentAt: new Date().toISOString(),
  },
  establishmentName: 'Boulangerie du Coin',
  city: 'Lyon',
  activity: 'Boulangerie',
  firstName: 'Jean',
  lastName: 'Dupont',
  phone: '0601020304',
  email: 'jean@example.com',
  website: '',
  attribution,
};

let dir: string;
let storePath: string;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'nfcr-leadservice-'));
  storePath = join(dir, 'leads.jsonl');
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe('LeadService', () => {
  it('marks the lead "sent" and persists it when the CRM accepts it', async () => {
    const crm = new FakeCrmClient('succeed');
    const service = new LeadService(() => crm, new LeadStore(storePath), logger);

    const result = await service.submit('fr', newLead);

    expect(result.status).toBe('sent');
    expect(crm.calls).toHaveLength(1);
    const stored = JSON.parse((await readFile(storePath, 'utf8')).trim());
    expect(stored.status).toBe('sent');
    expect(stored.id).toBe(result.id);
    expect(stored.market).toBe('fr');
  });

  it('falls back to "pending" without losing the lead when the CRM is not configured', async () => {
    const crm = new FakeCrmClient('unconfigured');
    const service = new LeadService(() => crm, new LeadStore(storePath), logger);

    const result = await service.submit('fr', newLead);

    expect(result.status).toBe('pending');
    const stored = JSON.parse((await readFile(storePath, 'utf8')).trim());
    expect(stored.status).toBe('pending');
    expect(stored.establishmentName).toBe('Boulangerie du Coin');
  });

  it('falls back to "pending" without losing the lead when the CRM call fails', async () => {
    const crm = new FakeCrmClient('fail');
    const service = new LeadService(() => crm, new LeadStore(storePath), logger);

    const result = await service.submit('fr', newLead);

    expect(result.status).toBe('pending');
    const stored = JSON.parse((await readFile(storePath, 'utf8')).trim());
    expect(stored.status).toBe('pending');
  });

  it('gives every lead a unique id and receivedAt timestamp', async () => {
    const service = new LeadService(() => new FakeCrmClient('succeed'), new LeadStore(storePath), logger);
    const first = await service.submit('fr', newLead);
    const second = await service.submit('fr', newLead);
    expect(first.id).not.toBe(second.id);
  });

  it('resolves a different CRM client per market and records the market on the stored lead', async () => {
    const crmFr = new FakeCrmClient('succeed');
    const crmMa = new FakeCrmClient('succeed');
    const service = new LeadService(
      (market) => (market === 'fr' ? crmFr : crmMa),
      new LeadStore(storePath),
      logger,
    );

    await service.submit('fr', newLead);
    await service.submit('ma', newLead);

    expect(crmFr.calls).toHaveLength(1);
    expect(crmMa.calls).toHaveLength(1);
    const stored = (await readFile(storePath, 'utf8'))
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line));
    expect(stored.map((lead) => lead.market)).toEqual(['fr', 'ma']);
  });
});
