import { describe, expect, it } from 'vitest';
import { isLikelySpam } from './antiSpam.js';

describe('isLikelySpam', () => {
  it('flags a filled honeypot', () => {
    expect(
      isLikelySpam({ companyWebsiteHp: 'http://spam.example', formRenderedAt: new Date().toISOString() }),
    ).toBe(true);
  });

  it('flags a submission faster than a human could plausibly fill the form', () => {
    expect(isLikelySpam({ companyWebsiteHp: '', formRenderedAt: new Date().toISOString() })).toBe(true);
  });

  it('does not flag a normal, empty honeypot submitted after a plausible delay', () => {
    const renderedAt = new Date(Date.now() - 5000).toISOString();
    expect(isLikelySpam({ companyWebsiteHp: '', formRenderedAt: renderedAt })).toBe(false);
  });

  it('does not treat a malformed timestamp as spam evidence by itself', () => {
    expect(isLikelySpam({ companyWebsiteHp: '', formRenderedAt: 'not-a-date' })).toBe(false);
  });
});
