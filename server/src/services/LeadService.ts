import { randomUUID } from 'node:crypto';
import type { Logger } from '../lib/logger.js';
import type { CRMLeadRecord, LeadStatus } from '../types/lead.js';
import { CrmNotConfiguredError, type CrmClient } from './crm/CrmClient.js';
import type { LeadStore } from './LeadStore.js';

type NewLead = Omit<CRMLeadRecord, 'id' | 'receivedAt'>;

/**
 * Orchestrates a validated lead: try the CRM, and whether it succeeds or
 * not, keep a local record. Brief §15/§34 flow — the controller never talks
 * to the CRM or the store directly.
 */
export class LeadService {
  constructor(
    private readonly crm: CrmClient,
    private readonly store: LeadStore,
    private readonly log: Logger,
  ) {}

  async submit(input: NewLead): Promise<{ id: string; status: LeadStatus }> {
    const record: CRMLeadRecord = {
      ...input,
      id: randomUUID(),
      receivedAt: new Date().toISOString(),
    };

    let status: LeadStatus;
    try {
      await this.crm.createLead(record);
      status = 'sent';
    } catch (error) {
      if (error instanceof CrmNotConfiguredError) {
        this.log.warn('crm_not_configured_lead_stored_pending', { leadId: record.id });
      } else {
        this.log.error('crm_create_lead_failed', { leadId: record.id, error: String(error) });
      }
      status = 'pending';
    }

    await this.store.save({ ...record, status });
    return { id: record.id, status };
  }
}
