import { expect, test } from '@playwright/test';
import { dismissConsentBanner, fillLeadForm, LANDING, MERCI_RE, stubLeadApi } from './helpers';

test('required fields are flagged and clear once corrected', async ({ page }) => {
  await page.goto(LANDING);
  await dismissConsentBanner(page);

  await page.getByTestId('lead-submit').click();
  await expect(page.getByTestId('field-establishment-name')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByTestId('field-city')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByTestId('form-message')).toBeVisible();

  await fillLeadForm(page);
  await expect(page.getByTestId('field-establishment-name')).not.toHaveAttribute('aria-invalid', 'true');
});

test('an invalid email and phone are rejected, then succeed once fixed', async ({ page }) => {
  await stubLeadApi(page);
  await page.goto(LANDING);
  await dismissConsentBanner(page);

  await fillLeadForm(page, {
    establishment: 'Boulangerie Saint-Antoine',
    city: 'Lyon',
    firstName: 'Camille',
    lastName: 'Moreau',
    phone: 'abc',
    email: 'not-an-email',
  });
  await page.getByTestId('lead-submit').click();

  await expect(page.getByTestId('field-phone')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByTestId('field-email')).toHaveAttribute('aria-invalid', 'true');

  await page.getByTestId('field-phone').fill('0674321985');
  await page.getByTestId('field-email').fill('camille.moreau@gmail.com');
  await page.getByTestId('lead-submit').click();

  await expect(page).toHaveURL(MERCI_RE);
});

test('consent is implicit — a valid form submits with no checkbox to tick', async ({ page }) => {
  const getBody = await stubLeadApi(page);
  await page.goto(LANDING);
  await dismissConsentBanner(page);

  await expect(page.getByTestId('field-consent')).toBeHidden();

  await fillLeadForm(page);
  await page.getByTestId('lead-submit').click();
  await expect(page).toHaveURL(MERCI_RE);

  const payload = JSON.parse(getBody()!);
  expect(payload.consent.marketingConsent).toBe(true);
});

test('a failing API surfaces the retry message and stays on the form', async ({ page }) => {
  await stubLeadApi(page, 500);
  await page.goto(LANDING);
  await dismissConsentBanner(page);
  await fillLeadForm(page);
  await page.getByTestId('lead-submit').click();

  await expect(page.getByTestId('submit-error')).toBeVisible();
  await expect(page).toHaveURL(/\/fr\/visibilite\/?$/);
});
