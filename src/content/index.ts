import { fr } from './fr';
import type { LandingContent } from './types';

/**
 * Only 'fr' ships in V1. 'ma' and 'sn' are routed and CRM-ready
 * (see lib/routes.ts / server/src/config/markets.ts) but fall back to 'fr'
 * content here until their own copy is ready — register `ma`/`sn` once a
 * content file for them exists; components never need to change.
 */
const CONTENT_BY_MARKET: Record<string, LandingContent> = {
  fr,
};

export function getContent(market: string = 'fr'): LandingContent {
  return CONTENT_BY_MARKET[market] ?? fr;
}

export type { LandingContent } from './types';
