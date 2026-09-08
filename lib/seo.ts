/**
 * Central SEO constants. `SITE_URL` is the production apex — the landing lives
 * under /fr/ because the Cloudflare Worker forwards /fr/* to this app and the
 * rest of nfcretail.com to WordPress (see deploy/DEPLOYMENT.md).
 */
export const SITE_URL = 'https://nfcretail.com';
export const SITE_NAME = 'NFC Retail';

export const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/assets/landing/fr/logo.png`,
  description:
    "NFC Retail pilote la visibilité, l'e-réputation et l'acquisition digitale des commerces de terrain.",
} as const;

export const WEBSITE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: 'fr-FR',
} as const;
