import type { AttributionData } from '../types/lead';

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
const CLICK_ID_KEYS = ['gclid', 'fbclid', 'msclkid'] as const;

const SESSION_KEY = 'nfcr_attribution_last';
const FIRST_TOUCH_KEY = 'nfcr_attribution_first';

function safeGetJSON<T>(storage: Storage, key: string): T | null {
  try {
    const raw = storage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function safeSetJSON(storage: Storage, key: string, value: unknown): void {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable (private mode, quota, disabled) — attribution is
    // best-effort only, never block the page for it.
  }
}

function readCurrentAttribution(): AttributionData {
  const params = new URLSearchParams(window.location.search);
  const get = (key: string) => params.get(key);

  return {
    utm_source: get('utm_source'),
    utm_medium: get('utm_medium'),
    utm_campaign: get('utm_campaign'),
    utm_content: get('utm_content'),
    utm_term: get('utm_term'),
    gclid: get('gclid'),
    fbclid: get('fbclid'),
    msclkid: get('msclkid'),
    landing_page: window.location.href,
    landing_path: window.location.pathname,
    referrer: document.referrer || '',
    landing_timestamp: new Date().toISOString(),
  };
}

function hasTrackingParams(): boolean {
  const params = new URLSearchParams(window.location.search);
  return [...UTM_KEYS, ...CLICK_ID_KEYS].some((key) => params.has(key) && params.get(key));
}

/**
 * Call once on app mount. Captures UTM/click-id params from the URL and
 * persists them for the rest of the visit (sessionStorage, per brief §17),
 * without dropping params a user arrived with earlier in the session.
 * Also snapshots a first-touch record in localStorage (never overwritten)
 * so first/last touch can be told apart later (brief §20) even though only
 * last-touch ships in the lead payload for V1 (brief §16).
 */
export function captureAttribution(): AttributionData {
  const current = readCurrentAttribution();
  const stored = safeGetJSON<AttributionData>(sessionStorage, SESSION_KEY);

  const attribution = hasTrackingParams() || !stored ? current : stored;
  safeSetJSON(sessionStorage, SESSION_KEY, attribution);

  if (!safeGetJSON<AttributionData>(localStorage, FIRST_TOUCH_KEY)) {
    safeSetJSON(localStorage, FIRST_TOUCH_KEY, current);
  }

  return attribution;
}

export function getStoredAttribution(): AttributionData | null {
  return safeGetJSON<AttributionData>(sessionStorage, SESSION_KEY);
}
