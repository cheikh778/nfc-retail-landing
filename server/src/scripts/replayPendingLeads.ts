import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';
import { resolveCrmClient } from '../services/crm/resolveCrmClient.js';
import { LeadStore } from '../services/LeadStore.js';
import { replayPendingLeads } from '../services/replayPendingLeads.js';

const store = new LeadStore(env.LEAD_STORE_PATH);
const summary = await replayPendingLeads(store, resolveCrmClient, logger);

logger.info('lead_replay_done', { ...summary });
if (summary.stillPending > 0) {
  console.log(
    `${summary.stillPending}/${summary.attempted} lead(s) still pending — check CRM_<MARKET>_API_URL/_API_KEY, or see the lead_replay_failed lines above.`,
  );
}
