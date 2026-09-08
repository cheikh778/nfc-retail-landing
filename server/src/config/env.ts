import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  ALLOWED_ORIGIN: z.string().default('http://localhost:5173'),
  CSRF_SECRET: z.string().min(16, 'must be at least 16 characters'),
  LEAD_STORE_PATH: z.string().default('./data/leads.jsonl'),
  LEAD_NOTIFICATION_EMAIL: z.union([z.string().email(), z.literal('')]).optional(),
});

// Per-market CRM_<CODE>_API_URL / _API_KEY / _PIPELINE / _SOURCE (and the
// legacy unprefixed CRM_* alias for "fr") are read directly from
// process.env in config/markets.ts, not validated here — the set of markets
// is configurable, so its env vars aren't a fixed, enumerable schema shape.

function loadEnv() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('Invalid environment configuration:');
    for (const issue of parsed.error.issues) {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    }
    console.error('\nCopy server/.env.example to server/.env and fill in the required values.');
    process.exit(1);
  }
  return parsed.data;
}

export const env = loadEnv();
