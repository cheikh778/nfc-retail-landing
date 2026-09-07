import { defineConfig, devices } from '@playwright/test';

/**
 * E2E runs against `next dev`. The lead API is external (Symfony, separate
 * repo), so specs stub it with `page.route()` — NEXT_PUBLIC_API_BASE_URL just
 * needs to be a well-formed absolute URL for the client to build the request.
 *
 * In the sandboxed dev environment, set PLAYWRIGHT_CHROMIUM_PATH to the
 * pre-installed browser; real machines/CI leave it unset.
 */
const PORT = Number(process.env.E2E_PORT) || 3100;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  fullyParallel: false,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
    reducedMotion: 'reduce',
    ...devices['Desktop Chrome'],
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined,
      args: process.env.PLAYWRIGHT_CHROMIUM_PATH ? ['--no-sandbox'] : [],
    },
  },
  webServer: {
    command: `npm run dev -- --port ${PORT}`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    env: {
      NEXT_PUBLIC_API_BASE_URL: 'http://localhost:9', // stubbed by page.route in specs
    },
  },
});
