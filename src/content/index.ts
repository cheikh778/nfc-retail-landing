import { fr } from './fr';
import type { LandingContent } from './types';

/**
 * Only 'fr' ships in V1. Future markets (ma-fr, ma-ar, sn-fr, sn-wo) register
 * here once their content file exists — components never need to change.
 */
const CONTENT_BY_MARKET: Record<string, LandingContent> = {
  fr,
};

export function getContent(market: string = 'fr'): LandingContent {
  return CONTENT_BY_MARKET[market] ?? fr;
}

export type { LandingContent } from './types';
