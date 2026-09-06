import { expect, test } from '@playwright/test';
import { acceptConsent, dismissConsentBanner, fillStep1, submitStep1, submitStep2, VALID_STEP1 } from './helpers';

// Brief §44 scenario 3: formulaire invalide → erreurs → correction → succès.
test('step 1 shows required-field errors and clears them once corrected', async ({ page }) => {
  await page.goto('/fr/visibilite');
  await dismissConsentBanner(page);
  await page.getByTestId('hero-cta').click();

  await page.getByTestId('step-1-submit').click();
  await expect(page.getByTestId('field-establishment-name')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByTestId('field-city')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByTestId('field-activity')).toHaveAttribute('aria-invalid', 'true');

  await fillStep1(page, VALID_STEP1);
  await expect(page.getByTestId('field-establishment-name')).not.toHaveAttribute('aria-invalid', 'true');

  await submitStep1(page);
  await expect(page.getByTestId('lead-form-step-2')).toBeVisible();
});

test('step 2 rejects an invalid email and phone, then succeeds once fixed', async ({ page }) => {
  await page.goto('/fr/visibilite');
  await dismissConsentBanner(page);
  await page.getByTestId('hero-cta').click();
  await fillStep1(page);
  await submitStep1(page);

  await page.getByTestId('field-first-name').fill('Jean');
  await page.getByTestId('field-last-name').fill('Dupont');
  await page.getByTestId('field-phone').fill('abc');
  await page.getByTestId('field-email').fill('not-an-email');
  await acceptConsent(page);
  await page.getByTestId('step-2-submit').click();

  await expect(page.getByTestId('field-phone')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByTestId('field-email')).toHaveAttribute('aria-invalid', 'true');

  await page.getByTestId('field-phone').fill('0601020304');
  await page.getByTestId('field-email').fill('jean.dupont@example.com');
  await page.getByTestId('step-2-submit').click();

  await expect(page).toHaveURL(/\/fr\/visibilite\/merci$/);
});

test('an implausible website is rejected while leaving the field optional', async ({ page }) => {
  await page.goto('/fr/visibilite');
  await dismissConsentBanner(page);
  await page.getByTestId('hero-cta').click();
  await fillStep1(page);
  await submitStep1(page);

  await page.getByTestId('field-first-name').fill('Jean');
  await page.getByTestId('field-last-name').fill('Dupont');
  await page.getByTestId('field-phone').fill('0601020304');
  await page.getByTestId('field-email').fill('jean.dupont@example.com');
  await page.getByTestId('field-website').fill('not a url');
  await acceptConsent(page);
  await page.getByTestId('step-2-submit').click();
  await expect(page.getByTestId('field-website')).toHaveAttribute('aria-invalid', 'true');

  await page.getByTestId('field-website').fill('');
  await submitStep2(page);
  await expect(page).toHaveURL(/\/fr\/visibilite\/merci$/);
});
