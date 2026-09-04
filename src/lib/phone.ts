/**
 * Reasonable validation for French phone numbers, with a lenient fallback
 * for international numbers. Deliberately not a strict/paranoid regex —
 * the brief asks not to over-restrict this field.
 */
export function isValidPhone(raw: string): boolean {
  const digits = raw.trim().replace(/[\s.\-()]/g, '');
  if (!digits) return false;
  if (/^0[1-9]\d{8}$/.test(digits)) return true;
  if (/^(\+33|0033)[1-9]\d{8}$/.test(digits)) return true;
  return /^\+?\d{8,15}$/.test(digits);
}

/** Normalizes to a consistent, readable format without over-engineering. */
export function normalizePhone(raw: string): string {
  return raw.trim().replace(/[\s.\-()]/g, ' ').replace(/\s+/g, ' ').trim();
}
