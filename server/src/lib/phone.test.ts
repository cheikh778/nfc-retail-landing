import { describe, expect, it } from 'vitest';
import { isValidPhone, normalizePhone } from './phone.js';

describe('isValidPhone', () => {
  it('accepts French numbers in common formats', () => {
    expect(isValidPhone('0601020304')).toBe(true);
    expect(isValidPhone('06 01 02 03 04')).toBe(true);
    expect(isValidPhone('+33601020304')).toBe(true);
  });

  it('rejects empty or clearly invalid input', () => {
    expect(isValidPhone('')).toBe(false);
    expect(isValidPhone('abc')).toBe(false);
  });
});

describe('normalizePhone', () => {
  it('collapses separators to single spaces', () => {
    expect(normalizePhone('06.01-02 03(04)')).toBe('06 01 02 03 04');
  });
});
