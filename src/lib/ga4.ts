declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

let loaded = false;

/**
 * Loads gtag.js and wires it to the shared dataLayer. Only called after
 * analytics consent is granted (brief §37) and only if an ID is configured
 * (VITE_GA4_MEASUREMENT_ID) — no ID is hardcoded here.
 */
export function loadGA4(measurementId: string): void {
  if (loaded || !measurementId) return;
  loaded = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, { anonymize_ip: true });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.appendChild(script);
}

export function isGA4Loaded(): boolean {
  return loaded;
}

/** Forwards an app tracking event to GA4 as a real `gtag('event', ...)` call. No-ops until GA4 is loaded. */
export function sendGA4Event(eventName: string, params: Record<string, unknown> = {}): void {
  if (!loaded || !window.gtag) return;
  window.gtag('event', eventName, params);
}
