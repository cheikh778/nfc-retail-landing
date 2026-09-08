import type { AttributionData, CRMLeadRecord } from '../../types/lead.js';
import { CrmConflictError, CrmRequestError, type CrmClient } from './CrmClient.js';

export interface HttpCrmClientConfig {
  apiUrl: string;
  apiKey: string;
  /** `locale` field of the payload, e.g. "fr-FR". */
  locale: string;
  /** `offer_code` field of the payload, e.g. "visibilite". */
  offerCode: string;
  /** Per-attempt timeout in ms. Default 10s. */
  timeoutMs?: number;
  /** Transient-failure retries (network error / timeout / 5xx). Default 2. */
  maxRetries?: number;
  /** Injectable for tests. Defaults to the global fetch. */
  fetchImpl?: typeof fetch;
}

const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_MAX_RETRIES = 2;
const RETRY_BASE_DELAY_MS = 500;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * CRM "LeadInbound" client — implements the interface contract for
 * POST https://up.moncrm.io/api/v1/leads (see the DOCX):
 *
 *  - Bearer auth, key read from the environment, never sent to the browser.
 *  - `Idempotency-Key` = the lead's `submissionId`; the exact same request is
 *    re-sent with the same key on transient failures so the CRM de-duplicates.
 *  - `market_code` is deliberately NOT sent: this endpoint is France-only.
 *  - 200 / 201 → success. 409 → CrmConflictError. 4xx → non-retryable
 *    CrmRequestError. 5xx / timeout / network error → retried, then a
 *    retryable CrmRequestError. Callers keep the lead locally on any throw.
 */
export class HttpCrmClient implements CrmClient {
  private readonly timeoutMs: number;
  private readonly maxRetries: number;
  private readonly fetchImpl: typeof fetch;

  constructor(private readonly config: HttpCrmClientConfig) {
    this.timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.maxRetries = config.maxRetries ?? DEFAULT_MAX_RETRIES;
    this.fetchImpl = config.fetchImpl ?? fetch;
  }

  async createLead(lead: CRMLeadRecord): Promise<void> {
    const body = JSON.stringify(this.buildPayload(lead));

    let lastError: CrmRequestError | undefined;
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      if (attempt > 0) await wait(RETRY_BASE_DELAY_MS * 2 ** (attempt - 1));

      try {
        await this.sendOnce(lead.submissionId, body);
        return;
      } catch (error) {
        if (error instanceof CrmRequestError && !error.retryable) throw error;
        lastError =
          error instanceof CrmRequestError
            ? error
            : new CrmRequestError(`CRM request failed: ${String(error)}`, null, true);
      }
    }

    throw lastError ?? new CrmRequestError('CRM request failed after retries', null, true);
  }

  private async sendOnce(idempotencyKey: string, body: string): Promise<void> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    let response: Response;
    try {
      response = await this.fetchImpl(this.config.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.apiKey}`,
          'Idempotency-Key': idempotencyKey,
        },
        body,
        signal: controller.signal,
      });
    } catch (error) {
      // AbortError (timeout) and network errors are both transient.
      throw new CrmRequestError(`CRM request transport error: ${String(error)}`, null, true);
    } finally {
      clearTimeout(timer);
    }

    if (response.ok) return; // 200 (already received) or 201 (created)

    if (response.status === 409) throw new CrmConflictError();

    const retryable = response.status >= 500;
    throw new CrmRequestError(
      `CRM responded ${response.status}`,
      response.status,
      retryable,
    );
  }

  private buildPayload(lead: CRMLeadRecord) {
    return {
      submission_id: lead.submissionId,
      locale: this.config.locale,
      offer_code: this.config.offerCode,
      contact: {
        first_name: lead.firstName,
        last_name: lead.lastName,
        email: lead.email || undefined,
        phone: lead.phone || undefined,
      },
      company: {
        name: lead.establishmentName,
        website: lead.website || undefined,
        city: lead.city || undefined,
      },
      request: {
        interests: [lead.activity].filter(Boolean),
      },
      attribution: buildAttribution(lead.attribution),
      privacy: {
        notice_version: lead.consent.noticeVersion,
        marketing_consent: lead.consent.marketingConsent,
        marketing_consent_at: lead.consent.marketingConsentAt,
      },
      submitted_at: lead.receivedAt,
    };
  }
}

function buildAttribution(attribution: AttributionData) {
  return {
    entry_url: attribution.landing_page || undefined,
    referrer: attribution.referrer || undefined,
    utm_source: attribution.utm_source ?? undefined,
    utm_medium: attribution.utm_medium ?? undefined,
    utm_campaign: attribution.utm_campaign ?? undefined,
    utm_content: attribution.utm_content ?? undefined,
    utm_term: attribution.utm_term ?? undefined,
    gclid: attribution.gclid ?? undefined,
    gbraid: attribution.gbraid ?? undefined,
    wbraid: attribution.wbraid ?? undefined,
  };
}
