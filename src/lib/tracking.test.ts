import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { track } from './tracking';

beforeEach(() => {
  window.dataLayer = [];
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('track', () => {
  it('pushes the event and params onto window.dataLayer', () => {
    track('cta_click', { location: 'hero' });
    expect(window.dataLayer).toEqual([{ event: 'cta_click', location: 'hero' }]);
  });

  it('exposes window.NFCTracking.track as the same bridge (brief §41)', () => {
    window.NFCTracking.track('landing_view');
    expect(window.dataLayer).toEqual([{ event: 'landing_view' }]);
  });

  it('refuses to send params that look like PII', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    track('form_complete', { email: 'jean@example.com' });
    expect(window.dataLayer).toEqual([]);
    expect(warnSpy).toHaveBeenCalled();
  });
});
