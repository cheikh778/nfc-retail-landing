import { getAnalyticsPage } from './analytics-context';
import { getConsent } from './consent';
import { sendGA4Event } from './ga4';

const EVENT_NAMES = [
  'page_view', 'landing_view', 'confirmation_view', 'cta_click', 'button_click', 'link_click',
  'scroll_depth', 'form_view', 'form_start', 'form_submit', 'form_validation_error',
  'form_submit_error', 'form_complete', 'generate_lead',
] as const;
export type TrackEventName = (typeof EVENT_NAMES)[number];

declare global {
  interface Window {
    dataLayer: unknown[];
    NFCTracking: { track: (eventName: string, params?: Record<string, unknown>) => void };
  }
}

const IDENTIFIERS: Record<string, readonly string[]> = {
  location: ['hero', 'header', 'footer', 'lead_form', 'mobile_sticky', 'confirmation'],
  element_id: ['skip_to_content', 'diagnostic_cta', 'brand_home', 'contact', 'legal_notice', 'privacy_policy', 'manage_cookies', 'back_home', 'lead_submit'],
  element_type: ['button', 'link'],
  form_id: ['visibility_diagnostic'],
  error_type: ['submission_failed'],
  method: ['visibility_diagnostic'],
};
const NUMBER_LIMITS: Record<string, number> = { percent_scrolled: 100, invalid_field_count: 6 };
const PII_KEY_PATTERN = /email|phone|first.?name|last.?name|full.?name|^name$|establishment|city/i;

function dispatchTrack(eventName: string, params: Record<string, unknown> = {}): void {
  if (getConsent() !== 'accepted' || !EVENT_NAMES.includes(eventName as TrackEventName)) return;
  // This applies to production and to the public NFCTracking bridge too.
  if (Object.keys(params).some((key) => PII_KEY_PATTERN.test(key))) {
    if (process.env.NODE_ENV !== 'production') console.warn('[NFCTracking] Event blocked: personal data parameter.');
    return;
  }
  const safeParams: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(params)) {
    if (Object.hasOwn(IDENTIFIERS, key) && typeof value === 'string' && IDENTIFIERS[key].includes(value)) {
      safeParams[key] = value;
    } else if (Object.hasOwn(NUMBER_LIMITS, key) && typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= NUMBER_LIMITS[key]) {
      safeParams[key] = value;
    }
  }
  const payload = { ...safeParams, ...getAnalyticsPage() };
  window.dataLayer.push({ event: eventName, ...payload });
  sendGA4Event(eventName, payload);
}

function ensureTrackingBridge(): void {
  window.dataLayer = window.dataLayer || [];
  window.NFCTracking = { track: dispatchTrack };
}

if (typeof window !== 'undefined') ensureTrackingBridge();

export function track(eventName: TrackEventName, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return;
  ensureTrackingBridge();
  dispatchTrack(eventName, params);
}
