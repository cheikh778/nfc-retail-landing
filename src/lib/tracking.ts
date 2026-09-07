import { sendGA4Event } from './ga4';

export type TrackEventName =
  | 'landing_view'
  | 'cta_click'
  | 'form_start'
  | 'form_step_1_complete'
  | 'form_step_2_view'
  | 'form_complete'
  | 'generate_lead';

declare global {
  interface Window {
    /** GTM/gtag-style layer: entries are either event objects or gtag argument arrays. */
    dataLayer: unknown[];
    NFCTracking: {
      track: (eventName: string, params?: Record<string, unknown>) => void;
    };
  }
}

/** Params that must never reach analytics — brief §19/§41: no PII in dataLayer. */
const PII_KEY_PATTERN = /email|phone|firstname|lastname|full.?name|^name$/i;

function ensureTrackingBridge(): void {
  window.dataLayer = window.dataLayer || [];
  if (!window.NFCTracking) {
    window.NFCTracking = {
      track(eventName, params = {}) {
        window.dataLayer.push({ event: eventName, ...params });
      },
    };
  }
}

if (typeof window !== 'undefined') {
  ensureTrackingBridge();
}

export function track(eventName: TrackEventName, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return;

  if (import.meta.env.DEV) {
    const suspiciousKey = Object.keys(params).find((key) => PII_KEY_PATTERN.test(key));
    if (suspiciousKey) {
      console.warn(
        `[NFCTracking] Refusing to send "${suspiciousKey}" to analytics — looks like PII. ` +
          'Drop this field from the event params.',
      );
      return;
    }
  }

  ensureTrackingBridge();
  window.NFCTracking.track(eventName, params);
  sendGA4Event(eventName, params);
}
