import type { Page } from '@playwright/test';

export const LANDING = '/fr/visibilite/';
export const MERCI_RE = /\/fr\/visibilite\/merci\/?$/;
/** Client builds `${NEXT_PUBLIC_API_BASE_URL}/api/fr/visibilite/lead` — see lib/api.ts. */
export const LEAD_URL_GLOB = '**/fr/visibilite/lead';
/** The CSRF handshake the client does before every POST (lib/api.ts). */
export const CSRF_URL_GLOB = '**/api/csrf-token';

export const VALID_LEAD = {
  establishment: 'Boulangerie Saint-Antoine',
  city: 'Lyon',
  firstName: 'Camille',
  lastName: 'Moreau',
  phone: '06 74 32 19 85',
  email: 'camille.moreau@gmail.com',
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

export async function fillLeadForm(page: Page, data = VALID_LEAD): Promise<void> {
  await page.getByTestId('field-establishment-name').fill(data.establishment);
  await page.getByTestId('field-city').fill(data.city);
  await page.getByTestId('field-first-name').fill(data.firstName);
  await page.getByTestId('field-last-name').fill(data.lastName);
  await page.getByTestId('field-email').fill(data.email);
  await page.getByTestId('field-phone').fill(data.phone);
}

/** The consent box is unchecked by default and gates the submit button. */
export async function acceptConsent(page: Page): Promise<void> {
  await page.getByTestId('field-consent').check();
}

export async function submitLeadForm(page: Page): Promise<void> {
  await page.getByTestId('lead-submit').click();
}

/** Full happy path: fresh landing → fill the single form → tick consent → submit. */
export async function completeLeadForm(page: Page): Promise<void> {
  await dismissConsentBanner(page);
  await fillLeadForm(page);
  await acceptConsent(page);
  await submitLeadForm(page);
}
