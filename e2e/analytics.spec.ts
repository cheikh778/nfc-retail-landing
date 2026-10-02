import { expect, test, type Page } from '@playwright/test';
import { fillLeadForm, LANDING, MERCI_RE, stubLeadApi } from './helpers';

async function events(page: Page) {
  return page.evaluate(() => window.dataLayer
    .filter((entry) => (entry as { event?: string }).event)
    .map((entry) => entry as { event: string; element_id?: string; page_path?: string }));
}

test.beforeEach(async ({ page }) => {
  // Verify the real gtag command queue while preventing any test traffic to Google.
  await page.route('https://www.googletagmanager.com/gtag/js**', (route) =>
    route.fulfill({ contentType: 'application/javascript', body: '/* GA stub */' }));
});

test('late consent sends one pageview, tracks the submit CTA, and rejection stops tracking', async ({ page }) => {
  let scripts = 0;
  page.on('request', (request) => {
    if (request.url().includes('googletagmanager.com/gtag/js')) scripts++;
  });
  await page.goto(`${LANDING}?email=private@example.com#private`);
  await expect(page.getByTestId('consent-accept')).toBeVisible();
  expect(await events(page)).toHaveLength(0);
  expect(scripts).toBe(0);
  await page.getByRole('button', { name: 'Gérer les cookies' }).click();
  await expect(page.getByTestId('consent-reject')).toBeFocused();
  await page.getByTestId('consent-accept').click();
  await expect.poll(() => scripts).toBe(1);
  expect((await events(page)).filter((event) => event.event === 'page_view')).toHaveLength(1);
  await page.getByTestId('lead-submit').click();
  expect(await events(page)).toEqual(expect.arrayContaining([
    expect.objectContaining({ event: 'cta_click', element_id: 'lead_submit' }),
    expect.objectContaining({ event: 'form_validation_error' }),
  ]));
  const queue = await page.evaluate(() => JSON.stringify(window.dataLayer));
  expect(queue).not.toContain('private@example.com');
  await page.getByRole('button', { name: 'Gérer les cookies' }).click();
  await expect(page.getByTestId('consent-reject')).toBeFocused();
  await page.getByTestId('consent-reject').click();
  await expect(page.getByRole('button', { name: 'Gérer les cookies' })).toBeFocused();
  const count = (await events(page)).length;
  await page.getByTestId('lead-submit').click();
  expect(await events(page)).toHaveLength(count);
  expect(await page.evaluate(() => window['ga-disable-G-TEST12345'])).toBe(true);
});

test('acceptance from another tab also starts form impressions', async ({ page, context }) => {
  await page.goto(LANDING);
  await expect(page.getByTestId('consent-accept')).toBeVisible();
  const second = await context.newPage();
  await second.route('https://www.googletagmanager.com/gtag/js**', (route) =>
    route.fulfill({ contentType: 'application/javascript', body: '/* GA stub */' }));
  await second.goto(LANDING);
  await expect(second.getByTestId('consent-accept')).toBeVisible();
  await page.getByTestId('consent-accept').click();
  await expect(second.getByTestId('consent-accept')).toBeHidden();
  await second.locator('#leadForm').scrollIntoViewIfNeeded();
  await expect.poll(async () => (await events(second)).some((event) => event.event === 'form_view')).toBe(true);
  await second.close();
});

test('only successful API acceptance creates a lead; refreshing confirmation does not duplicate it', async ({ page }) => {
  await stubLeadApi(page);
  await page.goto(LANDING);
  await page.getByTestId('consent-accept').click();
  await fillLeadForm(page);
  await page.getByTestId('lead-submit').click();
  await expect(page).toHaveURL(MERCI_RE);
  await expect.poll(async () => (await events(page)).filter((event) => event.event === 'page_view').length).toBe(2);
  expect((await events(page)).filter((event) => event.event === 'generate_lead')).toHaveLength(1);
  const serialized = await page.evaluate(() => JSON.stringify(window.dataLayer));
  expect(serialized).not.toContain('Camille');
  expect(serialized).not.toContain('camille.moreau@gmail.com');
  await page.reload();
  await expect.poll(async () => (await events(page)).filter((event) => event.event === 'page_view').length).toBe(1);
  expect((await events(page)).filter((event) => event.event === 'generate_lead')).toHaveLength(0);
});

test('API failure records an error and no completed lead', async ({ page }) => {
  await stubLeadApi(page, 500);
  await page.goto(LANDING);
  await page.getByTestId('consent-accept').click();
  await fillLeadForm(page);
  await page.getByTestId('lead-submit').click();
  await expect(page.getByTestId('submit-error')).toBeVisible();
  expect(await events(page)).toEqual(expect.arrayContaining([expect.objectContaining({ event: 'form_submit_error' })]));
  expect((await events(page)).filter((event) => event.event === 'generate_lead' || event.event === 'form_complete')).toHaveLength(0);
});
