import type { AttributionData } from '@/types/lead';
import { externalReferrer, normalizeAttribution, readTrackingParams, TRACKING_KEYS, type ResolvedAttribution } from './attribution';

const SESSION_KEY = 'nfcr_attribution_last';
const FIRST_TOUCH_KEY = 'nfcr_attribution_first';
let memoryAttribution: ResolvedAttribution | null = null;
let memoryOnly = false;
let documentCaptured = false;

function isAttribution(value: unknown): value is AttributionData {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return ['landing_page', 'landing_path', 'referrer', 'landing_timestamp'].every((key) => typeof record[key] === 'string')
    && TRACKING_KEYS.every((key) => record[key] === null || typeof record[key] === 'string');
}

function readSession(): ResolvedAttribution | null {
  if (memoryOnly) return memoryAttribution;
  let raw: string | null;
  try {
    raw = window.sessionStorage.getItem(SESSION_KEY);
  } catch {
    return memoryAttribution;
  }
  if (!raw) return memoryOnly ? memoryAttribution : null;
  try {
    const value: unknown = JSON.parse(raw);
    return isAttribution(value) ? normalizeAttribution(value) : null;
  } catch {
    return null;
  }
}

function persist(attribution: ResolvedAttribution): void {
  memoryAttribution = attribution;
  try {
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(attribution));
    memoryOnly = false;
  } catch {
    // Even access to the storage getter can throw. Keep the current visit in memory.
    memoryOnly = true;
  }
  try {
    if (!window.localStorage.getItem(FIRST_TOUCH_KEY)) {
      window.localStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(attribution));
    }
  } catch {
    // First touch is best effort; submission uses the current visit, not this record.
  }
}

function readCurrentAttribution(): ResolvedAttribution {
  const params = readTrackingParams(window.location.href);
  return normalizeAttribution({
    utm_source: params.utm_source ?? null, utm_medium: params.utm_medium ?? null,
    utm_campaign: params.utm_campaign ?? null, utm_content: params.utm_content ?? null,
    utm_term: params.utm_term ?? null,
    gclid: params.gclid ?? null, gbraid: params.gbraid ?? null, wbraid: params.wbraid ?? null,
    fbclid: params.fbclid ?? null, msclkid: params.msclkid ?? null,
    landing_page: window.location.href.slice(0, 2000),
    landing_path: window.location.pathname.slice(0, 500),
    referrer: document.referrer.slice(0, 2000),
    landing_timestamp: new Date().toISOString(),
  });
}

/**
 * Preserve the last acquisition during internal navigation and direct revisits.
 * A new campaign replaces the complete attribution, never mixing old/new fields.
 * Capture both on arrival and immediately before submitting; GA consent is separate.
 */
export function captureAttribution(): ResolvedAttribution {
  const current = readCurrentAttribution();
  const stored = readSession();
  const firstCapture = !documentCaptured;
  documentCaptured = true;
  const hasTracking = Object.keys(readTrackingParams(window.location.href)).length > 0;
  // A real return from the same external site is still a new acquisition.
  // document.referrer stays unchanged during SPA navigation, so subsequent
  // captures of this document must preserve its original entry attribution.
  const newReferrer = firstCapture && !!externalReferrer(current);
  const sameEntry = !!stored && current.landing_page === stored.landing_page
    && TRACKING_KEYS.every((key) => current[key] === stored[key]);
  const attribution = stored && ((!firstCapture && sameEntry) || (!hasTracking && !newReferrer)) ? stored : current;
  persist(attribution);
  return attribution;
}

export function getStoredAttribution(): ResolvedAttribution | null {
  return readSession();
}
