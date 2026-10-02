import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CONSENT_KEY, getConsent, setConsent } from './consent';

beforeEach(() => {
  localStorage.clear();
  window.dispatchEvent(new StorageEvent('storage', { key: CONSENT_KEY }));
});
afterEach(() => vi.restoreAllMocks());

describe('consent persistence', () => {
  it('honors rejection even if persistence fails and reads return an old acceptance', () => {
    setConsent('accepted');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota'); });
    setConsent('rejected');
    expect(localStorage.getItem(CONSENT_KEY)).toBe('accepted');
    expect(getConsent()).toBe('rejected');
  });

  it('honors acceptance in memory after a failed write, then synchronizes external changes', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('quota'); });
    setConsent('accepted');
    expect(getConsent()).toBe('accepted');
    window.dispatchEvent(new StorageEvent('storage', { key: CONSENT_KEY }));
    expect(getConsent()).toBe('unset');
  });
});
