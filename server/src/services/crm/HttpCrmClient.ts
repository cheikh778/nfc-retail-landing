import type { CRMLeadRecord } from '../../types/lead.js';
import type { CrmClient } from './CrmClient.js';

interface HttpCrmClientConfig {
  apiUrl: string;
  apiKey: string;
  pipeline?: string;
  source: string;
}

/**
 * Generic HTTP CRM client (brief §15: "ne pas inventer l'API CRM"). The
 * request shape below is a reasonable placeholder — a bearer-authenticated
 * JSON POST — not a real integration with any specific CRM. Once the target
 * CRM and its actual API contract are known, adapt the request here; nothing
 * else in the app needs to change since callers only depend on CrmClient.
 */
export class HttpCrmClient implements CrmClient {
  constructor(private readonly config: HttpCrmClientConfig) {}

  async createLead(lead: CRMLeadRecord): Promise<void> {
    const response = await fetch(this.config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        source: this.config.source,
        pipeline: this.config.pipeline,
        lead,
      }),
    });

    if (!response.ok) {
      throw new Error(`CRM request failed with status ${response.status}`);
    }
  }
}
