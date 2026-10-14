import type { AttributionData } from '@/types/lead';

export const TRACKING_KEYS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid',
] as const;

export type ResolvedAttribution = AttributionData & { utm_source: string; utm_medium: string };

/** Bounds match the API schema. Preserve case-sensitive click IDs and campaign labels. */
export function cleanTrackingValue(value: string | null | undefined): string | null {
  const text = value?.trim();
  return text && !/^(null|undefined|\(not set\))$/i.test(text) ? text.slice(0, 500) : null;
}

function httpUrl(value: string): URL | null {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url : null;
  } catch {
    return null;
  }
}

export function readTrackingParams(url: string): Partial<Record<typeof TRACKING_KEYS[number], string>> {
  const values: Partial<Record<typeof TRACKING_KEYS[number], string>> = {};
  const parsed = httpUrl(url);
  if (!parsed) return values;
  for (const [name, raw] of parsed.searchParams) {
    const key = TRACKING_KEYS.find((candidate) => candidate === name.toLowerCase());
    const value = cleanTrackingValue(raw);
    if (key && value && !values[key]) values[key] = value;
  }
  return values;
}

function canonicalHost(hostname: string): string {
  return hostname.toLowerCase().replace(/^www\./, '');
}

export function externalReferrer(attribution: AttributionData): string | null {
  const referrer = httpUrl(attribution.referrer);
  if (!referrer) return null;
  const host = canonicalHost(referrer.hostname);
  const entry = httpUrl(attribution.landing_page);
  if (host === canonicalHost(entry?.hostname ?? '') || host === 'nfcretail.com' || host.endsWith('.nfcretail.com')) return null;
  return host;
}

function referralChannel(host: string): { source: string; medium: string } {
  if (/^(?:[a-z0-9-]+\.)?google\.(?:[a-z]{2,3}|(?:com|co)\.[a-z]{2})$/.test(host)) {
    return { source: 'google', medium: 'organic' };
  }
  if (host === 'bing.com' || host.endsWith('.bing.com')) return { source: 'bing', medium: 'organic' };
  return { source: host, medium: 'referral' };
}

/**
 * Used by the browser and mirrored in nfcretail-api/src/lib/attribution.ts.
 * Explicit UTMs win, then click IDs, then external referrer, then direct access.
 * Missing campaign/content/term stay null: no invented campaign information.
 */
export function normalizeAttribution(input: AttributionData): ResolvedAttribution {
  const attribution = {
    ...input,
    landing_page: input.landing_page.slice(0, 2000),
    landing_path: input.landing_path.slice(0, 500),
    referrer: input.referrer.slice(0, 2000),
  };
  const params = readTrackingParams(input.landing_page);
  for (const key of TRACKING_KEYS) attribution[key] = cleanTrackingValue(input[key]) ?? params[key] ?? null;

  let inferred: { source: string; medium: string } | null = null;
  if (attribution.gclid || attribution.gbraid || attribution.wbraid) inferred = { source: 'google', medium: 'cpc' };
  else if (attribution.msclkid) inferred = { source: 'bing', medium: 'cpc' };
  else if (attribution.fbclid) inferred = { source: 'facebook', medium: 'social' };
  else {
    const host = externalReferrer(attribution);
    if (host) inferred = referralChannel(host);
  }

  const hasUtm = TRACKING_KEYS.slice(0, 5).some((key) => attribution[key]);
  const source = attribution.utm_source ?? cleanTrackingValue(inferred?.source) ?? (hasUtm ? 'unknown' : 'direct');
  // Do not attach an unrelated referrer's medium to an explicit campaign source.
  const medium = attribution.utm_medium
    ?? (inferred && (!attribution.utm_source || attribution.utm_source === inferred.source) ? inferred.medium : null)
    ?? (hasUtm ? '(unknown)' : '(none)');
  return { ...attribution, utm_source: source, utm_medium: medium };
}
