import { defineConfig, devices } from '@playwright/test';

/**
 * Requires server/.env to exist (copy from server/.env.example) so the API
 * can start — see README. In this sandboxed dev environment specifically,
 * set PLAYWRIGHT_CHROMIUM_PATH to the pre-installed browser instead of
 * downloading one; real machines/CI leave it unset and Playwright manages
 * its own browser normally.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  fullyParallel: false,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
    ...devices['Desktop Chrome'],
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined,
      // Chromium refuses to launch as root without this; only relevant in the
      // containerized sandbox, so it's tied to the same opt-in env var above.
      args: process.env.PLAYWRIGHT_CHROMIUM_PATH ? ['--no-sandbox'] : [],
    },
  },
  webServer: [
    {
      command: 'npm run dev:server',
      port: 3001,
      reuseExistingServer: true,
      timeout: 30_000,
    },
    {
      command: 'npm run dev',
      port: 5173,
      reuseExistingServer: true,
      timeout: 30_000,
    },
  ],
});
