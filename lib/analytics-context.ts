import { PATHS } from './paths';

const PAGE_TITLES: Record<string, string> = {
  [PATHS.visibilite]: 'Diagnostic de visibilité — NFC Retail',
  [PATHS.merci]: 'Confirmation de demande — NFC Retail',
  [PATHS.mentionsLegales]: 'Mentions légales — NFC Retail',
  [PATHS.politiqueConfidentialite]: 'Politique de confidentialité — NFC Retail',
};

/** Only known routes reach GA: query strings, fragments and arbitrary paths may contain PII. */
export function getAnalyticsPage() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  const pagePath = Object.hasOwn(PAGE_TITLES, path) ? path : '/404';
  let referrer = '';
  try {
    referrer = document.referrer ? new URL(document.referrer).origin : '';
  } catch {
    // Invalid referrers have no useful attribution value.
  }
  return {
    page_path: pagePath,
    page_location: `${window.location.origin}${pagePath}`,
    page_title: PAGE_TITLES[pagePath] ?? 'Page introuvable — NFC Retail',
    page_referrer: referrer,
  };
}
