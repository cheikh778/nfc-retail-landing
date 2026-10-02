import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { CONSENT_CHANGE_EVENT, CONSENT_KEY, getConsent } from '@/lib/consent';
import { updateGA4Consent } from '@/lib/ga4';
import { PATHS } from '@/lib/paths';
import { track } from '@/lib/tracking';

const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID ?? '';

/** Runs once in the root layout, across full loads and Next client navigation. */
export function useAnalyticsBootstrap(): void {
  const pathname = usePathname();
  const lastPage = useRef<string | null>(null);
  useEffect(() => {
    const sync = () => {
      const status = getConsent();
      if (GA4_MEASUREMENT_ID) updateGA4Consent(status, GA4_MEASUREMENT_ID);
      if (status !== 'accepted') {
        lastPage.current = null;
        return;
      }
      const path = window.location.pathname.replace(/\/$/, '') || '/';
      if (path === '/' || lastPage.current === path) return;
      lastPage.current = path;
      track('page_view');
      if (path === PATHS.visibilite) track('landing_view');
      if (path === PATHS.merci) track('confirmation_view');
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === CONSENT_KEY || event.key === null) sync();
    };
    sync();
    window.addEventListener(CONSENT_CHANGE_EVENT, sync);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener(CONSENT_CHANGE_EVENT, sync);
      window.removeEventListener('storage', onStorage);
    };
  }, [pathname]);
}
