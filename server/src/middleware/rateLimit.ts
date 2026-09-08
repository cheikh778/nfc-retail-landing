import type { Request } from 'express';
import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

/**
 * In production this API sits behind Cloudflare, which sends the real visitor
 * IP in `CF-Connecting-IP`. `app.set('trust proxy', 1)` only unwraps one hop,
 * so prefer the Cloudflare header when it is present and fall back to the
 * (IPv6-normalised) socket/proxy IP otherwise.
 */
function clientKey(req: Request): string {
  const cf = req.headers['cf-connecting-ip'];
  if (typeof cf === 'string' && cf.length > 0) return `cf:${cf}`;
  return ipKeyGenerator(req.ip ?? '0.0.0.0');
}

/** Generous enough for a real visitor retrying after a typo, tight enough to blunt scripted abuse. */
export const leadRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: clientKey,
  message: { error: 'too_many_requests' },
});

export const csrfTokenRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: clientKey,
  message: { error: 'too_many_requests' },
});
