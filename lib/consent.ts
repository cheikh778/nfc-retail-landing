export type ConsentStatus = 'accepted' | 'rejected' | 'unset';

export const CONSENT_KEY = 'nfcr_consent_analytics';
export const CONSENT_CHANGE_EVENT = 'nfcr:consent-change';
export const CONSENT_REOPEN_EVENT = 'nfcr:consent-reopen';
let memoryConsent: ConsentStatus = 'unset';
let memoryOnly = false;

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === CONSENT_KEY || event.key === null) {
      memoryOnly = false;
      memoryConsent = 'unset';
    }
  });
}

/** Lets a "Gérer les cookies" control reopen the banner on demand. */
export function reopenConsentBanner(): void {
  window.dispatchEvent(new CustomEvent(CONSENT_REOPEN_EVENT));
}

export function getConsent(): ConsentStatus {
  if (memoryOnly) return memoryConsent;
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    if (value === 'accepted' || value === 'rejected') return value;
  } catch {
    return memoryConsent;
  }
  return 'unset';
}

export function setConsent(status: 'accepted' | 'rejected'): void {
  memoryConsent = status;
  try {
    localStorage.setItem(CONSENT_KEY, status);
    memoryOnly = false;
  } catch {
    // Reads may still work while writes fail (quota); honor this tab's latest choice.
    memoryOnly = true;
  }
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: status }));
}
