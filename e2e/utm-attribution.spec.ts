import { expect, test } from '@playwright/test';
import { completeLeadForm } from './helpers';

// Brief §44 scenario 2: landing avec UTM → formulaire → les UTM arrivent avec le lead.
test('UTM params from the landing URL are attached to the submitted lead', async ({ page }) => {
  let leadRequestBody: string | null = null;
  page.on('request', (req) => {
    if (req.url().includes('/api/fr/visibilite/lead') && req.method() === 'POST') {
      leadRequestBody = req.postData();
    }
  });

  await page.goto(
    '/fr/visibilite?utm_source=chatgpt&utm_medium=ads&utm_campaign=fr_visibilite&utm_content=annonce_01',
  );
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  await completeLeadForm(page);
  await expect(page).toHaveURL(/\/fr\/visibilite\/merci$/);

  expect(leadRequestBody).not.toBeNull();
  const payload = JSON.parse(leadRequestBody!);
  expect(payload.attribution).toMatchObject({
    utm_source: 'chatgpt',
    utm_medium: 'ads',
    utm_campaign: 'fr_visibilite',
    utm_content: 'annonce_01',
  });
  expect(payload.attribution.landing_path).toBe('/fr/visibilite');
});

test('UTM params survive a reload before the form is submitted (sessionStorage persistence)', async ({ page }) => {
  await page.goto('/fr/visibilite?utm_source=google&utm_medium=cpc');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  // Revisit without UTM params — the session should still remember the original touch.
  await page.goto('/fr/visibilite');

  let leadRequestBody: string | null = null;
  page.on('request', (req) => {
    if (req.url().includes('/api/fr/visibilite/lead') && req.method() === 'POST') {
      leadRequestBody = req.postData();
    }
  });

  await completeLeadForm(page);
  const payload = JSON.parse(leadRequestBody!);
  expect(payload.attribution.utm_source).toBe('google');
  expect(payload.attribution.utm_medium).toBe('cpc');
});
