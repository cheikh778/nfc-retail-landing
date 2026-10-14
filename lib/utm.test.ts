import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let captureAttribution: typeof import('./utm').captureAttribution;
let getStoredAttribution: typeof import('./utm').getStoredAttribution;

function setUrl(path: string): void {
  window.history.pushState({}, '', path);
}

beforeEach(async () => {
  vi.resetModules();
  ({ captureAttribution, getStoredAttribution } = await import('./utm'));
  sessionStorage.clear();
  localStorage.clear();
  setUrl('/fr/visibilite');
});

afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers(); });

describe('captureAttribution', () => {
  it('reads UTM params from the URL', () => {
    setUrl('/fr/visibilite?utm_source=chatgpt&utm_medium=ads&utm_campaign=fr_visibilite&utm_content=annonce_01');
    const attribution = captureAttribution();
    expect(attribution.utm_source).toBe('chatgpt');
    expect(attribution.utm_medium).toBe('ads');
    expect(attribution.utm_campaign).toBe('fr_visibilite');
    expect(attribution.utm_content).toBe('annonce_01');
  });

  it('records direct access when the source is not transmitted', () => {
    const attribution = captureAttribution();
    expect(attribution.utm_source).toBe('direct');
    expect(attribution.gclid).toBeNull();
  });

  it('persists attribution in sessionStorage for the rest of the visit', () => {
    setUrl('/fr/visibilite?utm_source=chatgpt');
    captureAttribution();
    expect(getStoredAttribution()?.utm_source).toBe('chatgpt');
  });

  it('keeps the session attribution when a later page has no UTM params', () => {
    setUrl('/fr/visibilite?utm_source=chatgpt&utm_medium=ads');
    captureAttribution();

    setUrl('/fr/visibilite');
    const second = captureAttribution();
    expect(second.utm_source).toBe('chatgpt');
    expect(second.utm_medium).toBe('ads');
  });

  it('refreshes the session attribution when new UTM params arrive', () => {
    setUrl('/fr/visibilite?utm_source=chatgpt');
    captureAttribution();

    setUrl('/fr/visibilite?utm_source=google&utm_medium=cpc');
    const second = captureAttribution();
    expect(second.utm_source).toBe('google');
    expect(second.utm_medium).toBe('cpc');
  });

  it('captures gclid/fbclid/msclkid click ids', () => {
    setUrl('/fr/visibilite?gclid=abc123');
    expect(captureAttribution().gclid).toBe('abc123');
  });

  it('keeps campaign attribution in memory when storage is blocked', () => {
    vi.spyOn(window, 'sessionStorage', 'get').mockImplementation(() => { throw new Error('blocked'); });
    vi.spyOn(window, 'localStorage', 'get').mockImplementation(() => { throw new Error('blocked'); });
    setUrl('/fr/visibilite?utm_source=chatgpt&utm_medium=ads');
    expect(captureAttribution().utm_source).toBe('chatgpt');
    setUrl('/fr/visibilite');
    expect(captureAttribution().utm_source).toBe('chatgpt');
    expect(getStoredAttribution()?.utm_medium).toBe('ads');
  });

  it('discards malformed stored objects instead of sending null or incorrect types', () => {
    sessionStorage.setItem('nfcr_attribution_last', JSON.stringify({ utm_source: 42 }));
    expect(captureAttribution().utm_source).toBe('direct');
  });

  it('does not let empty tracking parameters replace a known campaign', () => {
    setUrl('/fr/visibilite?utm_source=google&utm_medium=cpc');
    captureAttribution();
    setUrl('/fr/visibilite?utm_source=%20%20&gclid=');
    expect(captureAttribution().utm_source).toBe('google');
  });

  it('does not combine fields from different campaigns', () => {
    setUrl('/fr/visibilite?utm_source=google&utm_medium=cpc&utm_campaign=old&gclid=old-click');
    captureAttribution();
    setUrl('/fr/visibilite?utm_source=chatgpt');
    expect(captureAttribution()).toMatchObject({ utm_source: 'chatgpt', utm_medium: '(unknown)', utm_campaign: null, gclid: null });
  });

  it('does not replace the entry timestamp when capturing the same campaign again', () => {
    vi.useFakeTimers();
    setUrl('/fr/visibilite?utm_source=google');
    const first = captureAttribution();
    vi.advanceTimersByTime(60000);
    expect(captureAttribution().landing_timestamp).toBe(first.landing_timestamp);
  });

  it('uses the latest in-memory campaign if a storage write fails over an older record', () => {
    setUrl('/fr/visibilite?utm_source=google');
    captureAttribution();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota'); });
    setUrl('/fr/visibilite?utm_source=chatgpt&utm_medium=ads');
    captureAttribution();
    setUrl('/fr/visibilite');
    expect(captureAttribution().utm_source).toBe('chatgpt');
  });

  it('recognizes a new document referred by the same search engine as a new organic visit', async () => {
    vi.spyOn(document, 'referrer', 'get').mockReturnValue('https://www.google.com/');
    setUrl('/fr/visibilite?utm_source=google&utm_medium=cpc&gclid=old-click');
    captureAttribution();
    setUrl('/fr/visibilite');
    vi.resetModules();
    const newDocument = await import('./utm');
    expect(newDocument.captureAttribution()).toMatchObject({ utm_source: 'google', utm_medium: 'organic', gclid: null });
  });
});
