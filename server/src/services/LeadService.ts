import { randomUUID } from 'node:crypto';
import type { MarketCode } from '../config/markets.js';
import type { Logger } from '../lib/logger.js';
import type { CRMLeadRecord, LeadStatus } from '../types/lead.js';
import { CrmNotConfiguredError, type CrmClient } from './crm/CrmClient.js';
import type { LeadStore } from './LeadStore.js';

type NewLead = Omit<CRMLeadRecord, 'id' | 'receivedAt' | 'market'>;

/**
 * Orchestrates a validated lead: resolve the CRM for its market, try it, and
 * whether it succeeds or not, keep a local record. Brief's multi-market
 * requirement lives entirely in `resolveCrmClient` (injected) — this class
 * doesn't know or care how many markets/CRMs exist.
 */
export class LeadService {
  constructor(
    private readonly resolveCrmClient: (market: MarketCode) => CrmClient,
    private readonly store: LeadStore,
    private readonly log: Logger,
  ) {}

  async submit(market: MarketCode, input: NewLead): Promise<{ id: string; status: LeadStatus }> {
    const record: CRMLeadRecord = {
      ...input,
      market,
      id: randomUUID(),
      receivedAt: new Date().toISOString(),
    };

    let status: LeadStatus;
    try {
      const crm = this.resolveCrmClient(market);
      await crm.createLead(record);
      status = 'sent';
    } catch (error) {
      if (error instanceof CrmNotConfiguredError) {
        this.log.warn('crm_not_configured_lead_stored_pending', { leadId: record.id, market });
      } else {
        this.log.error('crm_create_lead_failed', { leadId: record.id, market, error: String(error) });
      }
      status = 'pending';
    }

    await this.store.save({ ...record, status });
    return { id: record.id, status };
  }
}
