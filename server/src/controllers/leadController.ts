import type { Request, Response } from 'express';
import { isLikelySpam } from '../lib/antiSpam.js';
import type { Logger } from '../lib/logger.js';
import { normalizePhone, isValidPhone } from '../lib/phone.js';
import { normalizeWebsiteUrl } from '../lib/url.js';
import type { LeadService } from '../services/LeadService.js';
import { leadSchema } from '../validation/leadSchema.js';

export function createLeadController(leadService: LeadService, log: Logger) {
  return async function postLead(req: Request, res: Response): Promise<void> {
    const parsed = leadSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'invalid_input' });
      return;
    }
    const input = parsed.data;

    if (isLikelySpam(input)) {
      log.info('lead_rejected_as_spam');
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

    try {
      const result = await leadService.submit({
        establishmentName: input.establishmentName,
        city: input.city,
        activity: input.activity,
        firstName: input.firstName,
        lastName: input.lastName,
        phone,
        email: input.email,
        website,
        attribution: input.attribution,
      });
      res.status(200).json({ ok: true, status: result.status });
    } catch (error) {
      log.error('lead_submission_failed', { error: String(error) });
      res.status(500).json({ error: 'submission_failed' });
    }
  };
}
