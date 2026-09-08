import { Router } from 'express';
import { createLeadController } from '../controllers/leadController.js';
import type { Logger } from '../lib/logger.js';
import { requireSupportedMarket } from '../middleware/market.js';
import { csrfTokenRateLimiter, leadRateLimiter } from '../middleware/rateLimit.js';
import { doubleCsrfProtection, generateCsrfToken } from '../middleware/csrf.js';
import type { LeadService } from '../services/LeadService.js';

export function createApiRouter(leadService: LeadService, log: Logger): Router {
  const router = Router();

  router.get('/health', (_req, res) => {
    res.status(200).json({ ok: true });
  });

  router.get('/csrf-token', csrfTokenRateLimiter, (req, res) => {
    const csrfToken = generateCsrfToken(req, res);
    res.status(200).json({ csrfToken });
  });

  // :market (fr, ma, sn, ...) picks the CRM — see config/markets.ts.
  router.post(
    '/:market/visibilite/lead',
    requireSupportedMarket,
    leadRateLimiter,
    doubleCsrfProtection,
    createLeadController(leadService, log),
  );

  return router;
}
