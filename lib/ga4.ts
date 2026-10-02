import { getAnalyticsPage } from './analytics-context';
import { getConsent, type ConsentStatus } from './consent';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

let loadedId: string | undefined;

const DENIED_CONSENT = {
  analytics_storage: 'denied', ad_storage: 'denied',
  ad_user_data: 'denied', ad_personalization: 'denied',
};

function clearAnalyticsCookies(): void {
  const domains = window.location.hostname.split('.');
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.trim().split('=')[0];
    if (!/^_ga(?:_|$)/.test(name)) continue;
    const expiry = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
    document.cookie = expiry;
    // GA may set cookies on either this host or a parent domain.
    for (let i = 0; i < domains.length - 1; i++) {
      document.cookie = `${expiry}; domain=${domains.slice(i).join('.')}`;
    }
  }
}

/** Basic consent mode: no Google script or requests before analytics is accepted. */
export function loadGA4(measurementId: string): void {
  if (typeof window === 'undefined' || getConsent() !== 'accepted' || !/^G-[A-Z0-9]+$/.test(measurementId)) return;
  window[`ga-disable-${measurementId}`] = false;
  if (loadedId) {
    window.gtag?.('consent', 'update', { ...DENIED_CONSENT, analytics_storage: 'granted' });
    return;
  }
  loadedId = measurementId;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // Google's queue expects the native arguments object.
    window.dataLayer.push(arguments);
  };
  window.gtag('consent', 'default', DENIED_CONSENT);
  window.gtag('consent', 'update', { ...DENIED_CONSENT, analytics_storage: 'granted' });
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    ...getAnalyticsPage(),
  });
  const script = document.createElement('script');
  script.id = 'nfcr-ga4';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  script.onerror = () => {
    loadedId = undefined;
    script.remove();
  };
  document.head.appendChild(script);
}

export function updateGA4Consent(status: ConsentStatus, measurementId: string): void {
  if (status === 'accepted') {
    loadGA4(measurementId);
    return;
  }
  // Opt out before updating consent to also stop automatic GA events.
  window[`ga-disable-${measurementId}`] = true;
  if (loadedId) window.gtag?.('consent', 'update', DENIED_CONSENT);
  clearAnalyticsCookies();
}

export function isGA4Loaded(): boolean {
  return !!loadedId;
}

export function sendGA4Event(eventName: string, params: Record<string, unknown> = {}): void {
  if (!loadedId || !window.gtag || getConsent() !== 'accepted' || window[`ga-disable-${loadedId}`]) return;
  window.gtag('set', getAnalyticsPage());
  window.gtag('event', eventName, { ...params, send_to: loadedId });
}
