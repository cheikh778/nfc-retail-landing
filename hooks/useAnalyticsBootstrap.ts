import { useEffect } from 'react';
import { CONSENT_CHANGE_EVENT, getConsent, type ConsentStatus } from '@/lib/consent';
import { loadGA4 } from '@/lib/ga4';

const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

/** Loads GA4 only once analytics consent is granted, and reacts to later consent changes. */
export function useAnalyticsBootstrap(): void {
  useEffect(() => {
    if (!GA4_MEASUREMENT_ID) return;

    const maybeLoad = (status: ConsentStatus) => {
      if (status === 'accepted') loadGA4(GA4_MEASUREMENT_ID);
    };

    maybeLoad(getConsent());

    const onConsentChange = (event: Event) => {
      maybeLoad((event as CustomEvent<ConsentStatus>).detail);
    };
    window.addEventListener(CONSENT_CHANGE_EVENT, onConsentChange);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onConsentChange);
  }, []);
}
