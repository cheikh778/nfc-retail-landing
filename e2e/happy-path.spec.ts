import { expect, test } from '@playwright/test';
import { completeLeadForm, LANDING, LEAD_URL_GLOB, MERCI_RE, stubLeadApi } from './helpers';

test('visitor completes the lead form and reaches the confirmation page', async ({ page }) => {
  const getBody = await stubLeadApi(page);
  let leadStatus: number | null = null;
  page.on('response', (res) => {
    if (res.url().match(/\/fr\/visibilite\/lead$/)) leadStatus = res.status();
  });

  await page.goto(LANDING);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('vous cherchent déjà.');

  await completeLeadForm(page);

  await expect(page).toHaveURL(MERCI_RE);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Merci Camille, votre demande a bien été reçue.');
  expect(leadStatus).toBe(204);
  expect(getBody()).not.toBeNull();
});

test('the honeypot silently short-circuits to the confirmation without calling the API', async ({ page }) => {
  let called = false;
  await page.route(LEAD_URL_GLOB, async (route) => {
    called = true;
    await route.fulfill({ status: 204, body: '{}' });
  });

  await page.goto(LANDING);
  await page.getByTestId('consent-accept').click();
  await page.getByTestId('field-establishment-name').fill('Spam Co');
  await page.getByTestId('field-city').fill('Lyon');
  await page.getByTestId('field-first-name').fill('Bot');
  await page.getByTestId('field-last-name').fill('Net');
  await page.getByTestId('field-email').fill('bot@example.com');
  await page.getByTestId('field-phone').fill('0600000000');
  await page.locator('#company_website').fill('http://spam.example');
  await page.getByTestId('field-consent').check();
  await page.getByTestId('lead-submit').click();

  await expect(page).toHaveURL(MERCI_RE);
  expect(called).toBe(false);
});
