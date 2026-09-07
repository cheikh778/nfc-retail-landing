import type { Page } from '@playwright/test';

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

export async function dismissConsentBanner(page: Page): Promise<void> {
  const acceptButton = page.getByTestId('consent-accept');
  if (await acceptButton.isVisible().catch(() => false)) {
    await acceptButton.click();
  }
}

export async function fillStep1(page: Page, data: typeof VALID_STEP1 = VALID_STEP1): Promise<void> {
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

export async function fillStep2(page: Page, data: typeof VALID_STEP2 = VALID_STEP2): Promise<void> {
  await page.getByTestId('field-first-name').fill(data.firstName);
  await page.getByTestId('field-last-name').fill(data.lastName);
  await page.getByTestId('field-phone').fill(data.phone);
  await page.getByTestId('field-email').fill(data.email);
  if (data.website) await page.getByTestId('field-website').fill(data.website);
  await acceptConsent(page);
}

export async function submitStep2(page: Page): Promise<void> {
  await page.getByTestId('step-2-submit').click();
}

/** Full happy path from a fresh landing to the confirmation page. */
export async function completeLeadForm(page: Page): Promise<void> {
  await dismissConsentBanner(page);
  await page.getByTestId('hero-cta').click();
  await fillStep1(page);
  await submitStep1(page);
  await fillStep2(page);
  await submitStep2(page);
}
