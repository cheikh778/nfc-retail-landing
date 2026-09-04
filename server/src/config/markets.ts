/**
 * Multi-market registry. The country segment in the URL (/fr/visibilite,
 * /ma/visibilite, /sn/visibilite, ...) is the single source of truth for
 * which CRM a lead goes to — this file is the "commun et configurable"
 * mechanism that maps a market code to its CRM settings without any
 * per-country code branching elsewhere in the app.
 *
 * Adding a market later is a config change, not a code change: add its code
 * below and set CRM_<CODE>_API_URL / _API_KEY (+ optionally _PIPELINE /
 * _SOURCE) in the environment. Nothing else needs to know it exists.
 */
export const SUPPORTED_MARKETS = ['fr', 'ma', 'sn'] as const;
export type MarketCode = (typeof SUPPORTED_MARKETS)[number];

export function isSupportedMarket(value: string): value is MarketCode {
  return (SUPPORTED_MARKETS as readonly string[]).includes(value);
}

export interface MarketCrmConfig {
  apiUrl?: string;
  apiKey?: string;
  pipeline?: string;
  source: string;
}

/**
 * CRM_API_URL / CRM_API_KEY / CRM_PIPELINE / CRM_SOURCE (no market prefix)
 * are kept as an alias for "fr" — the only market that existed before this
 * multi-market registry did, so existing deployments/.env files keep working.
 */
function readMarketCrmConfig(market: MarketCode): MarketCrmConfig {
  const prefix = `CRM_${market.toUpperCase()}_`;
  const isLegacyDefault = market === 'fr';

  const read = (suffix: string): string | undefined => {
    const scoped = process.env[`${prefix}${suffix}`];
    if (scoped) return scoped;
    if (isLegacyDefault) return process.env[`CRM_${suffix}`] || undefined;
    return undefined;
  };

  return {
    apiUrl: read('API_URL'),
    apiKey: read('API_KEY'),
    pipeline: read('PIPELINE'),
    source: read('SOURCE') || `nfc-retail-landing-${market}`,
  };
}

export const MARKET_CRM_CONFIG: Record<MarketCode, MarketCrmConfig> = Object.fromEntries(
  SUPPORTED_MARKETS.map((market) => [market, readMarketCrmConfig(market)]),
) as Record<MarketCode, MarketCrmConfig>;

export function isMarketCrmConfigured(market: MarketCode): boolean {
  const config = MARKET_CRM_CONFIG[market];
  return Boolean(config.apiUrl && config.apiKey);
}
