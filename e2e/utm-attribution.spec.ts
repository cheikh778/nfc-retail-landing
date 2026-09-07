import { expect, test } from '@playwright/test';
import { completeLeadForm, LANDING, MERCI_RE, stubLeadApi } from './helpers';

test('UTM params from the landing URL are attached to the submitted lead', async ({ page }) => {
  const getBody = stubLeadApi(page);

  await page.goto(`${LANDING}?utm_source=chatgpt&utm_medium=ads&utm_campaign=fr_visibilite&utm_content=annonce_01`);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  await completeLeadForm(page);
  await expect(page).toHaveURL(MERCI_RE);

  const payload = JSON.parse(getBody()!);
  expect(payload.attribution).toMatchObject({
    utm_source: 'chatgpt',
    utm_medium: 'ads',
    utm_campaign: 'fr_visibilite',
    utm_content: 'annonce_01',
  });
  expect(payload.attribution.landing_path).toBe('/fr/visibilite/');
  expect(payload.submissionId).toBeTruthy();
  expect(payload.consent.marketingConsent).toBe(true);
});

test('UTM params survive a param-less revisit before submission (sessionStorage)', async ({ page }) => {
  await page.goto(`${LANDING}?utm_source=google&utm_medium=cpc`);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  await page.goto(LANDING);
  const getBody = stubLeadApi(page);

  await completeLeadForm(page);
  const payload = JSON.parse(getBody()!);
  expect(payload.attribution.utm_source).toBe('google');
  expect(payload.attribution.utm_medium).toBe('cpc');
});
