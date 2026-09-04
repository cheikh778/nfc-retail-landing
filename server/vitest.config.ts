import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    env: {
      NODE_ENV: 'test',
      CSRF_SECRET: 'test-only-secret-not-for-production-0123456789',
      LEAD_STORE_PATH: './data/test-leads.jsonl',
      ALLOWED_ORIGIN: 'http://localhost:5173',
      CRM_SOURCE: 'test-source',
      CRM_API_URL: '',
      CRM_API_KEY: '',
    },
  },
});
