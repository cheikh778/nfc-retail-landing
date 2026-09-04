import rateLimit from 'express-rate-limit';

/** Generous enough for a real visitor retrying after a typo, tight enough to blunt scripted abuse. */
export const leadRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'too_many_requests' },
});

export const csrfTokenRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'too_many_requests' },
});
