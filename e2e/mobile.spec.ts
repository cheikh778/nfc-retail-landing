import { expect, test } from '@playwright/test';
import { completeLeadForm, dismissConsentBanner, LANDING, MERCI_RE, stubLeadApi } from './helpers';

test.use({ viewport: { width: 390, height: 844 } });

test('the full flow works on a mobile viewport with no horizontal overflow', async ({ page }) => {
  stubLeadApi(page);
  await page.goto(LANDING);
  await dismissConsentBanner(page);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);

  await completeLeadForm(page);
  await expect(page).toHaveURL(MERCI_RE);
});

test('the modal opens as a bottom sheet and closes on the overlay / Escape', async ({ page }) => {
  await page.goto(LANDING);
  await dismissConsentBanner(page);

  const modal = page.getByRole('dialog', { name: /Étape/ });
  await page.getByTestId('hero-cta').click();
  await expect(modal).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(modal).toBeHidden();
});
