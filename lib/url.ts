const DOMAIN_RE = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/i;

/**
 * Normalizes an optional "website" field: accepts input with or without a
 * protocol, returns a clean absolute URL. Returns '' for an empty input
 * (field is optional) and null when the input isn't a plausible domain.
 */
export function normalizeWebsiteUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return '';

  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return null;
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
  if (!DOMAIN_RE.test(url.hostname)) return null;
  return url.toString();
}

export function isValidWebsite(raw: string): boolean {
  return normalizeWebsiteUrl(raw) !== null;
}
