export type ConsentStatus = 'accepted' | 'rejected' | 'unset';

const CONSENT_KEY = 'nfcr_consent_analytics';
export const CONSENT_CHANGE_EVENT = 'nfcr:consent-change';
export const CONSENT_REOPEN_EVENT = 'nfcr:consent-reopen';

/** Lets the footer's "Gérer les cookies" link reopen the banner on demand. */
export function reopenConsentBanner(): void {
  window.dispatchEvent(new CustomEvent(CONSENT_REOPEN_EVENT));
}

export function getConsent(): ConsentStatus {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    if (value === 'accepted' || value === 'rejected') return value;
  } catch {
    // Storage unavailable — treat as unset, banner will just show again.
  }
  return 'unset';
}

export function setConsent(status: 'accepted' | 'rejected'): void {
  try {
    localStorage.setItem(CONSENT_KEY, status);
  } catch {
    // Best-effort only.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: status }));
}
