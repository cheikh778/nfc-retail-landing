import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { track } from '@/lib/tracking';
import { setConsent } from '@/lib/consent';

beforeEach(() => {
  window.dataLayer = [];
  localStorage.clear();
  window.history.replaceState({}, '', '/fr/visibilite');
  setConsent('accepted');
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('track', () => {
  it('pushes the event and params onto window.dataLayer', () => {
    track('cta_click', { location: 'hero' });
    expect(window.dataLayer).toEqual([expect.objectContaining({ event: 'cta_click', location: 'hero', page_path: '/fr/visibilite' })]);
  });

  it('exposes window.NFCTracking.track as the same bridge (brief §41)', () => {
    window.NFCTracking.track('landing_view');
    expect(window.dataLayer).toEqual([expect.objectContaining({ event: 'landing_view' })]);
  });

  it('refuses to send params that look like PII', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    track('form_complete', { email: 'camille.moreau@gmail.com' });
    expect(window.dataLayer).toEqual([]);
    expect(warnSpy).toHaveBeenCalled();
  });

  it('blocks events before consent and after rejection without replaying them', () => {
    localStorage.clear();
    track('cta_click', { location: 'hero' });
    setConsent('rejected');
    window.NFCTracking.track('landing_view');
    expect(window.dataLayer).toEqual([]);
    setConsent('accepted');
    expect(window.dataLayer).toEqual([]);
  });

  it('protects the public bridge from personal data and unknown events', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    window.NFCTracking.track('generate_lead', { first_name: 'Camille' });
    window.NFCTracking.track('camille@example.com');
    expect(window.dataLayer).toEqual([]);
  });

  it('discards free text, nested objects and caller overrides of page context', () => {
    window.history.replaceState({}, '', '/fr/visibilite?email=camille@example.com#private');
    track('cta_click', {
      location: 'lead_form', element_id: 'camille_moreau',
      label: 'Camille Moreau', contact: { email: 'camille@example.com' },
      page_location: 'https://example.com?secret=token',
    });
    expect(window.dataLayer).toEqual([{
      event: 'cta_click', location: 'lead_form', page_path: '/fr/visibilite',
      page_location: `${window.location.origin}/fr/visibilite`,
      page_title: 'Diagnostic de visibilité — NFC Retail', page_referrer: '',
    }]);
  });

  it('keeps only bounded numeric metrics', () => {
    track('scroll_depth', { percent_scrolled: 90, invalid_field_count: 42 });
    expect(window.dataLayer[0]).toMatchObject({ percent_scrolled: 90 });
    expect(window.dataLayer[0]).not.toHaveProperty('invalid_field_count');
  });

  it('blocks PII in production as well as development', () => {
    vi.stubEnv('NODE_ENV', 'production');
    track('generate_lead', { phone: '0674321985' });
    expect(window.dataLayer).toEqual([]);
    vi.unstubAllEnvs();
  });
});
