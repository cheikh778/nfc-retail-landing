import { expect, test } from '@playwright/test';
import { completeLeadForm, LANDING, MERCI_RE, stubLeadApi } from './helpers';

test('UTM params from the landing URL are attached to the submitted lead', async ({ page }) => {
  const getBody = await stubLeadApi(page);

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
  const getBody = await stubLeadApi(page);

  await page.goto(`${LANDING}?utm_source=google&utm_medium=cpc`);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  await page.goto(LANDING);
  await completeLeadForm(page);
  await expect(page).toHaveURL(MERCI_RE);
  const payload = JSON.parse(getBody()!);
  expect(payload.attribution.utm_source).toBe('google');
  expect(payload.attribution.utm_medium).toBe('cpc');
});

for (const scenario of [
  { query: '?gclid=Google-Case%2BClick', expected: { utm_source: 'google', utm_medium: 'cpc', gclid: 'Google-Case+Click' } },
  { query: '?wbraid=Google-iOS-Click', expected: { utm_source: 'google', utm_medium: 'cpc', wbraid: 'Google-iOS-Click' } },
  { query: '?utm_source=partenaire&utm_medium=sponsorship&utm_campaign=France%20%26%20caf%C3%A9s', expected: { utm_source: 'partenaire', utm_medium: 'sponsorship', utm_campaign: 'France & cafés' } },
  { query: '', expected: { utm_source: 'direct', utm_medium: '(none)', utm_campaign: null } },
]) {
  test(`submits the resolved attribution for ${scenario.query || 'direct access'}`, async ({ page }) => {
    const getBody = await stubLeadApi(page);
    await page.goto(`${LANDING}${scenario.query}`);
    await completeLeadForm(page);
    await expect(page).toHaveURL(MERCI_RE);
    expect(JSON.parse(getBody()!).attribution).toMatchObject(scenario.expected);
  });
}

test('captures a new campaign inserted after mounting, instead of reusing the old source', async ({ page }) => {
  const getBody = await stubLeadApi(page);
  await page.goto(`${LANDING}?utm_source=google&utm_medium=cpc&utm_campaign=old&gclid=old-click`);
  await page.waitForFunction(() => JSON.parse(sessionStorage.getItem('nfcr_attribution_last') || 'null')?.utm_source === 'google');
  await page.evaluate(() => history.replaceState(null, '', '?utm_source=chatgpt&utm_medium=ads&utm_campaign=new'));
  await completeLeadForm(page);
  await expect(page).toHaveURL(MERCI_RE);
  expect(JSON.parse(getBody()!).attribution).toMatchObject({ utm_source: 'chatgpt', utm_medium: 'ads', utm_campaign: 'new', gclid: null });
});

test('captures a ChatGPT referrer without UTMs', async ({ page }) => {
  const getBody = await stubLeadApi(page);
  await page.goto(LANDING, { referer: 'https://chatgpt.com/' });
  await completeLeadForm(page);
  await expect(page).toHaveURL(MERCI_RE);
  expect(JSON.parse(getBody()!).attribution).toMatchObject({ utm_source: 'chatgpt.com', utm_medium: 'referral' });
});

test('retains attribution through internal navigation with blocked browser storage', async ({ page }) => {
  const getBody = await stubLeadApi(page);
  await page.addInitScript(() => {
    for (const storage of ['sessionStorage', 'localStorage']) {
      Object.defineProperty(window, storage, { configurable: true, get() { throw new Error('Storage blocked'); } });
    }
  });
  await page.goto(`${LANDING}?utm_source=chatgpt&utm_medium=ads&utm_campaign=storage_blocked`);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.evaluate(() => history.replaceState(history.state, '', location.pathname));
  await completeLeadForm(page);
  await expect(page).toHaveURL(MERCI_RE);
  expect(JSON.parse(getBody()!).attribution).toMatchObject({ utm_source: 'chatgpt', utm_medium: 'ads', utm_campaign: 'storage_blocked' });
});

test('retains campaign attribution arriving through another Next page', async ({ page }) => {
  const getBody = await stubLeadApi(page);
  await page.goto('/fr/mentions-legales/?utm_source=newsletter&utm_medium=email&utm_campaign=entry_legal');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.goto(LANDING);
  await completeLeadForm(page);
  await expect(page).toHaveURL(MERCI_RE);
  expect(JSON.parse(getBody()!).attribution).toMatchObject({ utm_source: 'newsletter', utm_medium: 'email', utm_campaign: 'entry_legal' });
});

test('captures a query-only campaign before navigating to the landing without parameters', async ({ page }) => {
  const getBody = await stubLeadApi(page);
  await page.goto('/fr/mentions-legales/');
  await page.waitForFunction(() => sessionStorage.getItem('nfcr_attribution_last'));
  await page.evaluate(() => history.replaceState(null, '', '?utm_source=newsletter&utm_medium=email&utm_campaign=query_only'));
  await page.waitForFunction(() => JSON.parse(sessionStorage.getItem('nfcr_attribution_last') || 'null')?.utm_source === 'newsletter');
  await page.goto(LANDING);
  await completeLeadForm(page);
  await expect(page).toHaveURL(MERCI_RE);
  expect(JSON.parse(getBody()!).attribution).toMatchObject({ utm_source: 'newsletter', utm_medium: 'email', utm_campaign: 'query_only' });
});

test('a new organic visit replaces the previous Google Ads click from the same referrer', async ({ page }) => {
  const getBody = await stubLeadApi(page);
  await page.goto(`${LANDING}?utm_source=google&utm_medium=cpc&gclid=old-click`, { referer: 'https://www.google.com/' });
  await page.waitForFunction(() => JSON.parse(sessionStorage.getItem('nfcr_attribution_last') || 'null')?.gclid === 'old-click');
  await page.goto(LANDING, { referer: 'https://www.google.com/' });
  await completeLeadForm(page);
  await expect(page).toHaveURL(MERCI_RE);
  expect(JSON.parse(getBody()!).attribution).toMatchObject({ utm_source: 'google', utm_medium: 'organic', gclid: null });
});

test('refusing Google Analytics does not lose the submitted lead attribution', async ({ page }) => {
  const getBody = await stubLeadApi(page);
  await page.goto(`${LANDING}?utm_source=google&utm_medium=cpc&utm_campaign=ga_refused`);
  await page.getByTestId('consent-reject').click();
  await completeLeadForm(page);
  await expect(page).toHaveURL(MERCI_RE);
  expect(JSON.parse(getBody()!).attribution).toMatchObject({ utm_source: 'google', utm_medium: 'cpc', utm_campaign: 'ga_refused' });
});
