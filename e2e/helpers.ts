import type { Page } from '@playwright/test';

export const LANDING = '/fr/visibilite/';
export const MERCI_RE = /\/fr\/visibilite\/merci\/?$/;
/** Client builds `${NEXT_PUBLIC_API_BASE_URL}/api/fr/visibilite/lead` — see lib/api.ts. */
export const LEAD_URL_GLOB = '**/fr/visibilite/lead';
/** The CSRF handshake the client does before every POST (lib/api.ts). */
export const CSRF_URL_GLOB = '**/api/csrf-token';

export const VALID_STEP1 = {
  establishment: 'Boulangerie Saint-Antoine',
  city: 'Lyon',
  activity: 'Boulangerie',
};

export const VALID_STEP2 = {
  firstName: 'Camille',
  lastName: 'Moreau',
  phone: '06 74 32 19 85',
  email: 'camille.moreau@gmail.com',
  website: 'boulangerie-saint-antoine.fr',
};

/** Intercept the external lead API (CSRF handshake + POST). Returns a getter for the captured POST body. */
export async function stubLeadApi(page: Page, status = 204): Promise<() => string | null> {
  let body: string | null = null;
  await page.route(CSRF_URL_GLOB, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: { 'set-cookie': 'nfcr.csrf=test; Path=/' },
      body: JSON.stringify({ csrfToken: 'e2e-test-token' }),
    });
  });
  await page.route(LEAD_URL_GLOB, async (route) => {
    if (route.request().method() === 'POST') body = route.request().postData();
    await route.fulfill({ status, contentType: 'application/json', body: '{}' });
  });
  return () => body;
}

export async function dismissConsentBanner(page: Page): Promise<void> {
  const accept = page.getByTestId('consent-accept');
  if (await accept.isVisible().catch(() => false)) await accept.click();
}

export async function openModal(page: Page): Promise<void> {
  await page.getByTestId('hero-cta').click();
  await page.getByTestId('lead-form-step-1').waitFor({ state: 'visible' });
}

export async function fillStep1(page: Page, data = VALID_STEP1): Promise<void> {
  await page.getByTestId('field-establishment-name').fill(data.establishment);
  await page.getByTestId('field-city').fill(data.city);
  await page.getByTestId('field-activity').fill(data.activity);
}

export async function submitStep1(page: Page): Promise<void> {
  await page.getByTestId('step-1-submit').click();
  await page.getByTestId('lead-form-step-2').waitFor({ state: 'visible' });
}

/** The consent box is unchecked by default and gates the submit button. */
export async function acceptConsent(page: Page): Promise<void> {
  await page.getByTestId('field-consent').check();
}

export async function fillStep2(page: Page, data = VALID_STEP2): Promise<void> {
  await page.getByTestId('field-first-name').fill(data.firstName);
  await page.getByTestId('field-last-name').fill(data.lastName);
  await page.getByTestId('field-phone').fill(data.phone);
  await page.getByTestId('field-email').fill(data.email);
  if (data.website) await page.getByTestId('field-website').fill(data.website);
  await acceptConsent(page);
}

/** Full happy path: fresh landing → CTA → step 1 → step 2 → submit. */
export async function completeLeadForm(page: Page): Promise<void> {
  await dismissConsentBanner(page);
  await openModal(page);
  await fillStep1(page);
  await submitStep1(page);
  await fillStep2(page);
  await page.getByTestId('step-2-submit').click();
}
