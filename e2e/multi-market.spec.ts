import { expect, test } from '@playwright/test';
import { completeLeadForm } from './helpers';

// The country segment in the URL must reach the matching API route so the
// server can route the lead to the right CRM (server/src/config/markets.ts).
test('a market other than fr renders and submits against its own API route', async ({ page }) => {
  let leadRequestUrl: string | null = null;
  page.on('request', (req) => {
    if (req.url().includes('/api/') && req.url().includes('/visibilite/lead') && req.method() === 'POST') {
      leadRequestUrl = req.url();
    }
  });

  await page.goto('/ma/visibilite');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  await completeLeadForm(page);

  await expect(page).toHaveURL(/\/ma\/visibilite\/merci$/);
  expect(leadRequestUrl).toContain('/api/ma/visibilite/lead');
});

test('an unsupported market code still renders (falls back to fr content) instead of breaking', async ({ page }) => {
  await page.goto('/xx/visibilite');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Vos futurs clients vous trouvent-ils vraiment ?');
});
