import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().positive().default(3001),
  // Comma-separated allowlist of browser origins allowed to call this API with
  // credentials. Default is the Next dev server; production must set the real
  // apex (see the production guard below).
  ALLOWED_ORIGIN: z.string().default('http://localhost:3000'),
  CSRF_SECRET: z.string().min(24, 'must be at least 24 characters (use 64 hex — see .env.example)'),
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

  const data = parsed.data;

  if (data.NODE_ENV === 'production') {
    const origins = data.ALLOWED_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean);
    const problems: string[] = [];
    if (origins.length === 0) problems.push('ALLOWED_ORIGIN is empty — every browser request will be blocked by CORS.');
    if (origins.some((origin) => /^https?:\/\/(localhost|127\.0\.0\.1)/i.test(origin))) {
      problems.push('ALLOWED_ORIGIN still contains a localhost origin.');
    }
    if (origins.some((origin) => origin.startsWith('http://'))) {
      problems.push('ALLOWED_ORIGIN contains a non-HTTPS origin — the CSRF cookie is `secure` in production and will not be sent over http.');
    }
    if (problems.length > 0) {
      // Not fatal (a bad value should not take the whole API down), but loud.
      console.warn('Production env warnings:');
      for (const problem of problems) console.warn(`  - ${problem}`);
    }
  }

  return data;
}

export const env = loadEnv();
