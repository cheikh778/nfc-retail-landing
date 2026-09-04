import { createApp } from './app.js';
import { crmConfigured, env } from './config/env.js';
import { logger } from './lib/logger.js';
import { HttpCrmClient } from './services/crm/HttpCrmClient.js';
import { UnconfiguredCrmClient } from './services/crm/UnconfiguredCrmClient.js';
import { LeadService } from './services/LeadService.js';
import { LeadStore } from './services/LeadStore.js';

const crmClient = crmConfigured
  ? new HttpCrmClient({
      apiUrl: env.CRM_API_URL!,
      apiKey: env.CRM_API_KEY!,
      pipeline: env.CRM_PIPELINE,
      source: env.CRM_SOURCE,
    })
  : new UnconfiguredCrmClient();

if (!crmConfigured) {
  logger.warn('crm_not_configured_leads_will_be_stored_locally_only');
}

const leadStore = new LeadStore(env.LEAD_STORE_PATH);
const leadService = new LeadService(crmClient, leadStore, logger);

const app = createApp(leadService);

app.listen(env.PORT, () => {
  logger.info('server_listening', { port: env.PORT, env: env.NODE_ENV });
});
