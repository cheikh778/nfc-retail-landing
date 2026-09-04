import { describe, expect, it } from 'vitest';
import { isValidPhone, normalizePhone } from './phone';

describe('isValidPhone', () => {
  it('accepts French mobile numbers in common formats', () => {
    expect(isValidPhone('0601020304')).toBe(true);
    expect(isValidPhone('06 01 02 03 04')).toBe(true);
    expect(isValidPhone('06.01.02.03.04')).toBe(true);
    expect(isValidPhone('+33601020304')).toBe(true);
    expect(isValidPhone('+33 6 01 02 03 04')).toBe(true);
    expect(isValidPhone('0033601020304')).toBe(true);
  });

  it('accepts plausible international numbers as a lenient fallback', () => {
    expect(isValidPhone('+14155552671')).toBe(true);
  });

  it('rejects empty, too short, or non-numeric input', () => {
    expect(isValidPhone('')).toBe(false);
    expect(isValidPhone('   ')).toBe(false);
    expect(isValidPhone('123')).toBe(false);
    expect(isValidPhone('not a phone number')).toBe(false);
  });
});

describe('normalizePhone', () => {
  it('collapses separators to single spaces', () => {
    expect(normalizePhone('06.01-02 03(04)')).toBe('06 01 02 03 04');
  });
});
