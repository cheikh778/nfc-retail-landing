import { beforeEach, describe, expect, it } from 'vitest';
import { captureAttribution, getStoredAttribution } from '@/lib/utm';

function setUrl(path: string): void {
  window.history.pushState({}, '', path);
}

beforeEach(() => {
  sessionStorage.clear();
  localStorage.clear();
  setUrl('/fr/visibilite');
});

describe('captureAttribution', () => {
  it('reads UTM params from the URL', () => {
    setUrl('/fr/visibilite?utm_source=chatgpt&utm_medium=ads&utm_campaign=fr_visibilite&utm_content=annonce_01');
    const attribution = captureAttribution();
    expect(attribution.utm_source).toBe('chatgpt');
    expect(attribution.utm_medium).toBe('ads');
    expect(attribution.utm_campaign).toBe('fr_visibilite');
    expect(attribution.utm_content).toBe('annonce_01');
  });

  it('defaults missing params to null rather than throwing', () => {
    const attribution = captureAttribution();
    expect(attribution.utm_source).toBeNull();
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
});
