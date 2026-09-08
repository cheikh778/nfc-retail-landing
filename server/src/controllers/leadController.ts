import type { Request, Response } from 'express';
import type { MarketCode } from '../config/markets.js';
import { isLikelySpam } from '../lib/antiSpam.js';
import type { Logger } from '../lib/logger.js';
import { normalizePhone, isValidPhone } from '../lib/phone.js';
import { normalizeWebsiteUrl } from '../lib/url.js';
import type { LeadService } from '../services/LeadService.js';
import { leadSchema } from '../validation/leadSchema.js';

export function createLeadController(leadService: LeadService, log: Logger) {
  return async function postLead(req: Request, res: Response): Promise<void> {
    // requireSupportedMarket already ran, so this param is a known MarketCode.
    const market = req.params.market as MarketCode;

    const parsed = leadSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'invalid_input' });
      return;
    }
    const input = parsed.data;

    if (isLikelySpam(input)) {
      log.info('lead_rejected_as_spam', { market });
      // Behave exactly like a success response — never tip off the bot.
      res.status(200).json({ ok: true });
      return;
    }

    const phone = normalizePhone(input.phone);
    if (!isValidPhone(phone)) {
      res.status(400).json({ error: 'invalid_phone' });
      return;
    }

    const website = normalizeWebsiteUrl(input.website);
    if (website === null) {
      res.status(400).json({ error: 'invalid_website' });
      return;
    }

    // Consent is mandatory: no lead is ever forwarded to the CRM without it
    // (the client also blocks the submit button, this is the server-side guard).
    if (input.consent.marketingConsent !== true) {
      res.status(400).json({ error: 'consent_required' });
      return;
    }

    try {
      const result = await leadService.submit(market, {
        submissionId: input.submissionId,
        establishmentName: input.establishmentName,
        city: input.city,
        activity: input.activity,
        firstName: input.firstName,
        lastName: input.lastName,
        phone,
        email: input.email,
        website,
        attribution: input.attribution,
        consent: input.consent,
      });
      res.status(200).json({ ok: true, status: result.status });
    } catch (error) {
      log.error('lead_submission_failed', { market, error: String(error) });
      res.status(500).json({ error: 'submission_failed' });
    }
  };
}
