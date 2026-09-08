/**
 * Authoritative server-side phone check — mirrors client/src/lib/phone.ts.
 * Never trust the browser (brief §13): this is what actually decides.
 */
export function isValidPhone(raw: string): boolean {
  const digits = raw.trim().replace(/[\s.\-()]/g, '');
  if (!digits) return false;
  if (/^0[1-9]\d{8}$/.test(digits)) return true;
  if (/^(\+33|0033)[1-9]\d{8}$/.test(digits)) return true;
  return /^\+?\d{8,15}$/.test(digits);
}

export function normalizePhone(raw: string): string {
  return raw.trim().replace(/[\s.\-()]/g, ' ').replace(/\s+/g, ' ').trim();
}
