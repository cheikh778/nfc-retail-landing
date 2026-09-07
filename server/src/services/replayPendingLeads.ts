import type { MarketCode } from '../config/markets.js';
import type { Logger } from '../lib/logger.js';
import { CrmNotConfiguredError, type CrmClient } from './crm/CrmClient.js';
import type { LeadStore } from './LeadStore.js';

export interface ReplaySummary {
  attempted: number;
  sent: number;
  stillPending: number;
}

/**
 * Re-sends every "pending" lead (stored while a market's CRM was unconfigured
 * or unreachable) through the CRM client for its market, and flips it to
 * "sent" on success. Safe to run repeatedly — leads already "sent" are left
 * untouched, and one lead's failure never affects the others. Run it once a
 * market's CRM_<CODE>_API_URL/_API_KEY are filled in (see the CLI in
 * scripts/replayPendingLeads.ts).
 */
export async function replayPendingLeads(
  store: LeadStore,
  resolveCrmClient: (market: MarketCode) => CrmClient,
  log: Logger,
): Promise<ReplaySummary> {
  const leads = await store.readAll();
  let sent = 0;
  let attempted = 0;

  const updated: typeof leads = [];
  for (const lead of leads) {
    if (lead.status !== 'pending') {
      updated.push(lead);
      continue;
    }

    attempted++;
    try {
      const crm = resolveCrmClient(lead.market as MarketCode);
      await crm.createLead(lead);
      sent++;
      log.info('lead_replay_succeeded', { leadId: lead.id, market: lead.market });
      updated.push({ ...lead, status: 'sent' });
    } catch (error) {
      if (!(error instanceof CrmNotConfiguredError)) {
        log.error('lead_replay_failed', { leadId: lead.id, market: lead.market, error: String(error) });
      }
      updated.push(lead);
    }
  }

  await store.rewriteAll(updated);
  return { attempted, sent, stillPending: attempted - sent };
}
