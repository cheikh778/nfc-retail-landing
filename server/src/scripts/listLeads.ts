/**
 * Consult the local fallback store — the leads captured on the landing,
 * including the ones the CRM has not accepted yet (status "pending").
 *
 *   npm run leads:list                  # everything, oldest → newest
 *   npm run leads:list -- --pending     # only what still needs to reach the CRM
 *   npm run leads:list -- --since=2026-09-01
 *   npm run leads:list -- --market=fr --limit=20
 *   npm run leads:list -- --json        # raw JSONL, e.g. to pipe elsewhere
 *
 * This prints contact PII to stdout by design — run it on the server, over
 * SSH, not anywhere the output gets logged or shared.
 */
import { env } from '../config/env.js';
import { LeadStore } from '../services/LeadStore.js';
import type { LeadStatus, StoredLead } from '../types/lead.js';

interface Options {
  status?: LeadStatus;
  market?: string;
  since?: number;
  limit?: number;
  json: boolean;
}

function parseArgs(argv: string[]): Options {
  const options: Options = { json: false };
  for (const arg of argv) {
    if (arg === '--pending') options.status = 'pending';
    else if (arg === '--sent') options.status = 'sent';
    else if (arg === '--json') options.json = true;
    else if (arg.startsWith('--market=')) options.market = arg.slice('--market='.length).trim();
    else if (arg.startsWith('--limit=')) options.limit = Number.parseInt(arg.slice('--limit='.length), 10);
    else if (arg.startsWith('--since=')) {
      const raw = arg.slice('--since='.length).trim();
      const ms = Date.parse(raw);
      if (Number.isNaN(ms)) {
        console.error(`Ignoring --since: "${raw}" is not a date (use ISO 8601, e.g. 2026-09-01).`);
      } else {
        options.since = ms;
      }
    } else {
      console.error(`Ignoring unknown argument: ${arg}`);
    }
  }
  return options;
}

function matches(lead: StoredLead, options: Options): boolean {
  if (options.status && lead.status !== options.status) return false;
  if (options.market && lead.market !== options.market) return false;
  if (options.since !== undefined && Date.parse(lead.receivedAt) < options.since) return false;
  return true;
}

function formatLead(lead: StoredLead): string {
  const when = lead.receivedAt.replace('T', ' ').replace(/\.\d+Z$/, 'Z');
  const flag = lead.status === 'pending' ? '⏳ pending' : '✅ sent   ';
  const source =
    [lead.attribution.utm_source, lead.attribution.utm_medium].filter(Boolean).join('/') || '—';
  return [
    `${flag}  ${when}  [${lead.market}]  ${lead.id}`,
    `   ${lead.establishmentName} — ${lead.city} — ${lead.activity}`,
    `   ${lead.firstName} ${lead.lastName}  ·  ${lead.phone}  ·  ${lead.email}${lead.website ? `  ·  ${lead.website}` : ''}`,
    `   source: ${source}  ·  submissionId: ${lead.submissionId}`,
  ].join('\n');
}

const options = parseArgs(process.argv.slice(2));
const store = new LeadStore(env.LEAD_STORE_PATH);
const all = await store.readAll();

let leads = all.filter((lead) => matches(lead, options));
if (options.limit !== undefined && Number.isFinite(options.limit)) {
  leads = leads.slice(-Math.max(0, options.limit));
}

if (options.json) {
  for (const lead of leads) console.log(JSON.stringify(lead));
  process.exit(0);
}

if (leads.length === 0) {
  console.log(`No lead in ${env.LEAD_STORE_PATH} matches the filter.`);
  process.exit(0);
}

for (const lead of leads) {
  console.log(formatLead(lead));
  console.log();
}

const pending = all.filter((lead) => lead.status === 'pending').length;
const byMarket = all.reduce<Record<string, number>>((acc, lead) => {
  acc[lead.market] = (acc[lead.market] ?? 0) + 1;
  return acc;
}, {});

console.log('─'.repeat(60));
console.log(
  `${leads.length} shown · ${all.length} total in store · ${pending} pending · ` +
    `by market: ${Object.entries(byMarket).map(([m, n]) => `${m}:${n}`).join(' ') || '—'}`,
);
if (pending > 0) {
  console.log(`Run "npm run replay:leads" to push the ${pending} pending lead(s) to the CRM.`);
}
