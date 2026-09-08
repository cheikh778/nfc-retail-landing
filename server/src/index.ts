import { createApp } from './app.js';
import { env } from './config/env.js';
import { isMarketCrmConfigured, SUPPORTED_MARKETS } from './config/markets.js';
import { logger } from './lib/logger.js';
import { resolveCrmClient } from './services/crm/resolveCrmClient.js';
import { LeadService } from './services/LeadService.js';
import { LeadStore } from './services/LeadStore.js';

for (const market of SUPPORTED_MARKETS) {
  if (!isMarketCrmConfigured(market)) {
    logger.warn('crm_not_configured_leads_will_be_stored_locally_only', { market });
  }
}

const leadStore = new LeadStore(env.LEAD_STORE_PATH);
const leadService = new LeadService(resolveCrmClient, leadStore, logger);

const app = createApp(leadService);

app.listen(env.PORT, () => {
  logger.info('server_listening', { port: env.PORT, env: env.NODE_ENV, markets: SUPPORTED_MARKETS.join(',') });
});
