import type { CRMLeadRecord } from '../../types/lead.js';
import { CrmNotConfiguredError, type CrmClient } from './CrmClient.js';

/**
 * Used until CRM_API_URL/CRM_API_KEY are set (brief §15: "ne pas bloquer le
 * développement frontend"). Always fails so LeadService falls back to
 * storing the lead locally with status "pending" instead of silently
 * pretending it was delivered somewhere.
 */
export class UnconfiguredCrmClient implements CrmClient {
  async createLead(_lead: CRMLeadRecord): Promise<void> {
    throw new CrmNotConfiguredError();
  }
}
