import { expect, test } from '@playwright/test';
import {
  acceptConsent,
  dismissConsentBanner,
  fillStep1,
  LANDING,
  MERCI_RE,
  openModal,
  stubLeadApi,
  submitStep1,
} from './helpers';

test('step 1 shows required-field errors and clears them once corrected', async ({ page }) => {
  await page.goto(LANDING);
  await dismissConsentBanner(page);
  await openModal(page);

  await page.getByTestId('step-1-submit').click();
  await expect(page.getByTestId('field-establishment-name')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByTestId('field-city')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByTestId('field-activity')).toHaveAttribute('aria-invalid', 'true');

  await fillStep1(page);
  await expect(page.getByTestId('field-establishment-name')).not.toHaveAttribute('aria-invalid', 'true');

  await submitStep1(page);
  await expect(page.getByTestId('lead-form-step-2')).toBeVisible();
});

test('step 2 rejects an invalid email and phone, then succeeds once fixed', async ({ page }) => {
  stubLeadApi(page);
  await page.goto(LANDING);
  await dismissConsentBanner(page);
  await openModal(page);
  await fillStep1(page);
  await submitStep1(page);

  await page.getByTestId('field-first-name').fill('Camille');
  await page.getByTestId('field-last-name').fill('Moreau');
  await page.getByTestId('field-phone').fill('abc');
  await page.getByTestId('field-email').fill('not-an-email');
  await acceptConsent(page);
  await page.getByTestId('step-2-submit').click();

  await expect(page.getByTestId('field-phone')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByTestId('field-email')).toHaveAttribute('aria-invalid', 'true');

  await page.getByTestId('field-phone').fill('0674321985');
  await page.getByTestId('field-email').fill('camille.moreau@gmail.com');
  await page.getByTestId('step-2-submit').click();

  await expect(page).toHaveURL(MERCI_RE);
});

test('submit stays blocked until the consent box is ticked', async ({ page }) => {
  stubLeadApi(page);
  await page.goto(LANDING);
  await dismissConsentBanner(page);
  await openModal(page);
  await fillStep1(page);
  await submitStep1(page);

  await page.getByTestId('field-first-name').fill('Camille');
  await page.getByTestId('field-last-name').fill('Moreau');
  await page.getByTestId('field-phone').fill('0674321985');
  await page.getByTestId('field-email').fill('camille.moreau@gmail.com');

  await expect(page.getByTestId('step-2-submit')).toBeDisabled();
  await acceptConsent(page);
  await expect(page.getByTestId('step-2-submit')).toBeEnabled();
  await page.getByTestId('step-2-submit').click();
  await expect(page).toHaveURL(MERCI_RE);
});

test('an implausible website is rejected while the field stays optional', async ({ page }) => {
  stubLeadApi(page);
  await page.goto(LANDING);
  await dismissConsentBanner(page);
  await openModal(page);
  await fillStep1(page);
  await submitStep1(page);

  await page.getByTestId('field-first-name').fill('Camille');
  await page.getByTestId('field-last-name').fill('Moreau');
  await page.getByTestId('field-phone').fill('0674321985');
  await page.getByTestId('field-email').fill('camille.moreau@gmail.com');
  await page.getByTestId('field-website').fill('not a url');
  await acceptConsent(page);
  await page.getByTestId('step-2-submit').click();
  await expect(page.getByTestId('field-website')).toHaveAttribute('aria-invalid', 'true');

  await page.getByTestId('field-website').fill('');
  await page.getByTestId('step-2-submit').click();
  await expect(page).toHaveURL(MERCI_RE);
});

test('a failing API surfaces the retry message and stays on the form', async ({ page }) => {
  stubLeadApi(page, 500);
  await page.goto(LANDING);
  await dismissConsentBanner(page);
  await openModal(page);
  await fillStep1(page);
  await submitStep1(page);
  await page.getByTestId('field-first-name').fill('Camille');
  await page.getByTestId('field-last-name').fill('Moreau');
  await page.getByTestId('field-phone').fill('0674321985');
  await page.getByTestId('field-email').fill('camille.moreau@gmail.com');
  await acceptConsent(page);
  await page.getByTestId('step-2-submit').click();

  await expect(page.getByTestId('submit-error')).toBeVisible();
  await expect(page).toHaveURL(/\/fr\/visibilite\/?$/);
});
