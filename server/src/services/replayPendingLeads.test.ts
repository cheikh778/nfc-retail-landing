import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { logger } from '../lib/logger.js';
import type { CRMLeadRecord, StoredLead } from '../types/lead.js';
import { CrmNotConfiguredError, type CrmClient } from './crm/CrmClient.js';
import { LeadStore } from './LeadStore.js';
import { replayPendingLeads } from './replayPendingLeads.js';

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

function makeLead(overrides: Partial<StoredLead>): StoredLead {
  return {
    id: 'lead-1',
    submissionId: '01991ad8-6682-7ab1-b840-f42c3ce971de',
    market: 'fr',
    establishmentName: 'Boulangerie du Coin',
    city: 'Lyon',
    activity: 'Boulangerie',
    firstName: 'Jean',
    lastName: 'Dupont',
    phone: '0601020304',
    email: 'jean@example.com',
    website: '',
    attribution,
    consent,
    receivedAt: new Date().toISOString(),
    status: 'pending',
    ...overrides,
  };
}

let dir: string;
let storePath: string;
let store: LeadStore;

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'nfcr-replay-'));
  storePath = join(dir, 'leads.jsonl');
  store = new LeadStore(storePath);
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
});

describe('replayPendingLeads', () => {
  it('sends every pending lead and flips it to "sent"', async () => {
    await store.save(makeLead({ id: 'a' }));
    await store.save(makeLead({ id: 'b' }));
    const crm = new FakeCrmClient('succeed');

    const summary = await replayPendingLeads(store, () => crm, logger);

    expect(summary).toEqual({ attempted: 2, sent: 2, stillPending: 0 });
    expect(crm.calls.map((lead) => lead.id)).toEqual(['a', 'b']);
    const stored = await store.readAll();
    expect(stored.every((lead) => lead.status === 'sent')).toBe(true);
  });

  it('leaves already-sent leads untouched and does not resend them', async () => {
    await store.save(makeLead({ id: 'already-sent', status: 'sent' }));
    const crm = new FakeCrmClient('succeed');

    const summary = await replayPendingLeads(store, () => crm, logger);

    expect(summary).toEqual({ attempted: 0, sent: 0, stillPending: 0 });
    expect(crm.calls).toHaveLength(0);
  });

  it('keeps a lead "pending" and keeps the others intact when the CRM is still unconfigured', async () => {
    await store.save(makeLead({ id: 'a' }));
    const crm = new FakeCrmClient('unconfigured');

    const summary = await replayPendingLeads(store, () => crm, logger);

    expect(summary).toEqual({ attempted: 1, sent: 0, stillPending: 1 });
    const stored = await store.readAll();
    expect(stored[0].status).toBe('pending');
  });

  it("does not let one lead's CRM failure block the others", async () => {
    await store.save(makeLead({ id: 'ok', market: 'fr' }));
    await store.save(makeLead({ id: 'down', market: 'ma' }));
    const crmFr = new FakeCrmClient('succeed');
    const crmMa = new FakeCrmClient('fail');

    const summary = await replayPendingLeads(store, (market) => (market === 'fr' ? crmFr : crmMa), logger);

    expect(summary).toEqual({ attempted: 2, sent: 1, stillPending: 1 });
    const stored = await store.readAll();
    expect(stored.find((lead) => lead.id === 'ok')?.status).toBe('sent');
    expect(stored.find((lead) => lead.id === 'down')?.status).toBe('pending');
  });

  it('is a no-op on an empty store', async () => {
    const summary = await replayPendingLeads(store, () => new FakeCrmClient('succeed'), logger);
    expect(summary).toEqual({ attempted: 0, sent: 0, stillPending: 0 });
  });
});
