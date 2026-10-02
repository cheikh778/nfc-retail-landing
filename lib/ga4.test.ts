import { beforeEach, describe, expect, it, vi } from 'vitest';

const ID = 'G-TEST12345';

function commands(): unknown[][] {
  return window.dataLayer.map((entry) => Array.from(entry as ArrayLike<unknown>));
}

beforeEach(() => {
  vi.resetModules();
  localStorage.clear();
  window.dataLayer = [];
  delete window.gtag;
  delete window[`ga-disable-${ID}`];
  document.getElementById('nfcr-ga4')?.remove();
  window.history.replaceState({}, '', '/fr/visibilite?email=private@example.com');
});

describe('GA4 consent and initialization', () => {
  it('does not load Google before acceptance or for invalid IDs', async () => {
    const { loadGA4 } = await import('./ga4');
    const { setConsent } = await import('./consent');
    loadGA4(ID);
    setConsent('rejected');
    loadGA4(ID);
    setConsent('accepted');
    loadGA4('invalid');
    expect(window.dataLayer).toEqual([]);
    expect(document.getElementById('nfcr-ga4')).toBeNull();
  });

  it('loads once, uses Google arguments commands and disables automatic pageviews and advertising', async () => {
    const { loadGA4 } = await import('./ga4');
    const { setConsent } = await import('./consent');
    setConsent('accepted');
    loadGA4(ID);
    loadGA4(ID);
    expect(document.querySelectorAll('#nfcr-ga4')).toHaveLength(1);
    expect(commands().filter((command) => command[0] === 'config')).toEqual([[
      'config', ID, expect.objectContaining({
        send_page_view: false, allow_google_signals: false,
        allow_ad_personalization_signals: false,
        page_location: `${window.location.origin}/fr/visibilite`,
      }),
    ]]);
    expect(commands()[0]).toEqual(['consent', 'default', expect.objectContaining({ ad_user_data: 'denied' })]);
  });

  it('stops sending and clears analytics cookies on revocation, then can resume', async () => {
    const { updateGA4Consent, sendGA4Event } = await import('./ga4');
    const { setConsent } = await import('./consent');
    setConsent('accepted');
    updateGA4Consent('accepted', ID);
    sendGA4Event('page_view');
    document.cookie = '_ga=test; path=/';
    document.cookie = '_ga_TEST12345=session; path=/';
    document.cookie = 'functional=keep; path=/';
    setConsent('rejected');
    updateGA4Consent('rejected', ID);
    expect(window[`ga-disable-${ID}`]).toBe(true);
    expect(document.cookie).not.toMatch(/_ga/);
    expect(document.cookie).toContain('functional=keep');
    sendGA4Event('generate_lead');
    expect(commands().filter((command) => command[0] === 'event')).toHaveLength(1);
    setConsent('accepted');
    updateGA4Consent('accepted', ID);
    sendGA4Event('cta_click');
    expect(window[`ga-disable-${ID}`]).toBe(false);
    expect(commands().filter((command) => command[0] === 'event')).toHaveLength(2);
    expect(document.querySelectorAll('#nfcr-ga4')).toHaveLength(1);
  });
});
