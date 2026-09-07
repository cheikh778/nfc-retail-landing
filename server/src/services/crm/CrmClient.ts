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

/**
 * The CRM answered with a non-success HTTP status. `status` is the HTTP code,
 * `retryable` is true only for transient failures (timeouts, network errors,
 * 5xx) where re-sending the exact same request with the same Idempotency-Key
 * is safe and expected.
 */
export class CrmRequestError extends Error {
  constructor(
    message: string,
    readonly status: number | null,
    readonly retryable: boolean,
  ) {
    super(message);
    this.name = 'CrmRequestError';
  }
}

/**
 * 409 from the CRM: the same submission id was reused with a different body.
 * Never retryable — it means a client bug (a stale/duplicated submission id),
 * not a transient failure. The lead is still kept locally as "pending".
 */
export class CrmConflictError extends CrmRequestError {
  constructor(message = 'CRM returned 409 Conflict (submission id reused with different data).') {
    super(message, 409, false);
    this.name = 'CrmConflictError';
  }
}
