/**
 * Multi-market routing. The country segment (/fr/, /ma/, /sn/) in the URL
 * decides content (content/index.ts) and, server-side, which CRM a lead
 * goes to (server/src/config/markets.ts) — this list must stay in sync with
 * SUPPORTED_MARKETS there. Only 'fr' has real content today; 'ma'/'sn' are
 * registered so the routes/CRM plumbing works the moment their content and
 * CRM are ready, with no code change here.
 */
export const SUPPORTED_MARKETS = ['fr', 'ma', 'sn'] as const;
export type MarketCode = (typeof SUPPORTED_MARKETS)[number];
export const DEFAULT_MARKET: MarketCode = 'fr';

export function isSupportedMarket(value: string | undefined): value is MarketCode {
  return !!value && (SUPPORTED_MARKETS as readonly string[]).includes(value);
}

/** Falls back to the default market for an unknown/missing URL segment rather than 404ing. */
export function normalizeMarket(value: string | undefined): MarketCode {
  return isSupportedMarket(value) ? value : DEFAULT_MARKET;
}

export const ROUTES = {
  visibilite: (market: string) => `/${market}/visibilite`,
  merci: (market: string) => `/${market}/visibilite/merci`,
  mentionsLegales: (market: string) => `/${market}/mentions-legales`,
  politiqueConfidentialite: (market: string) => `/${market}/politique-de-confidentialite`,
} as const;

export const MARKET_ROUTE_PATTERNS = {
  visibilite: '/:market/visibilite',
  merci: '/:market/visibilite/merci',
  mentionsLegales: '/:market/mentions-legales',
  politiqueConfidentialite: '/:market/politique-de-confidentialite',
} as const;
