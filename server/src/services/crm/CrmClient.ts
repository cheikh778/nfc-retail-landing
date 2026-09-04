import type { CRMLeadRecord } from '../../types/lead.js';

export interface CrmClient {
  createLead(lead: CRMLeadRecord): Promise<void>;
}

/** Thrown by UnconfiguredCrmClient — an expected state, not a real outage. */
export class CrmNotConfiguredError extends Error {
  constructor() {
    super('CRM is not configured (CRM_API_URL / CRM_API_KEY missing).');
    this.name = 'CrmNotConfiguredError';
  }
}
