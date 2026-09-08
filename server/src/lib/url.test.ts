import { describe, expect, it } from 'vitest';
import { normalizeWebsiteUrl } from './url.js';

describe('normalizeWebsiteUrl', () => {
  it('returns an empty string for empty input', () => {
    expect(normalizeWebsiteUrl('')).toBe('');
  });

  it('adds https:// when missing', () => {
    expect(normalizeWebsiteUrl('example.fr')).toBe('https://example.fr/');
  });

  it('rejects implausible or unsafe input', () => {
    expect(normalizeWebsiteUrl('not a url')).toBeNull();
    expect(normalizeWebsiteUrl('javascript:alert(1)')).toBeNull();
  });
});
