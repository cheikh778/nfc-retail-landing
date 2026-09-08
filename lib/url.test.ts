import { describe, expect, it } from 'vitest';
import { isValidWebsite, normalizeWebsiteUrl } from '@/lib/url';

describe('normalizeWebsiteUrl', () => {
  it('returns an empty string for empty input (field is optional)', () => {
    expect(normalizeWebsiteUrl('')).toBe('');
    expect(normalizeWebsiteUrl('   ')).toBe('');
  });

  it('adds https:// when no protocol is given', () => {
    expect(normalizeWebsiteUrl('example.fr')).toBe('https://example.fr/');
  });

  it('keeps an explicit protocol', () => {
    expect(normalizeWebsiteUrl('http://example.fr')).toBe('http://example.fr/');
    expect(normalizeWebsiteUrl('https://example.fr/path')).toBe('https://example.fr/path');
  });

  it('accepts subdomains and common TLD shapes', () => {
    expect(normalizeWebsiteUrl('www.boulangerie-lyon.fr')).toBe('https://www.boulangerie-lyon.fr/');
  });

  it('rejects implausible input', () => {
    expect(normalizeWebsiteUrl('not a url')).toBeNull();
    expect(normalizeWebsiteUrl('javascript:alert(1)')).toBeNull();
    expect(normalizeWebsiteUrl('ftp://example.fr')).toBeNull();
  });
});

describe('isValidWebsite', () => {
  it('mirrors normalizeWebsiteUrl validity', () => {
    expect(isValidWebsite('')).toBe(true);
    expect(isValidWebsite('example.fr')).toBe(true);
    expect(isValidWebsite('not a url')).toBe(false);
  });
});
