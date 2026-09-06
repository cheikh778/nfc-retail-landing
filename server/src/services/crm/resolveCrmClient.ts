import { MARKET_CRM_CONFIG, type MarketCode } from '../../config/markets.js';
import type { CrmClient } from './CrmClient.js';
import { HttpCrmClient } from './HttpCrmClient.js';
import { UnconfiguredCrmClient } from './UnconfiguredCrmClient.js';

const clientCache = new Map<string, CrmClient>();

/** One CrmClient per market, built lazily from MARKET_CRM_CONFIG and cached. */
export function resolveCrmClient(market: MarketCode): CrmClient {
  const cached = clientCache.get(market);
  if (cached) return cached;

  const config = MARKET_CRM_CONFIG[market];
  const client: CrmClient =
    config.apiUrl && config.apiKey
      ? new HttpCrmClient({
          apiUrl: config.apiUrl,
          apiKey: config.apiKey,
          locale: config.locale,
          offerCode: config.offerCode,
        })
      : new UnconfiguredCrmClient();

  clientCache.set(market, client);
  return client;
}
