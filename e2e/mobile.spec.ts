import { expect, test } from '@playwright/test';
import { completeLeadForm, dismissConsentBanner, LANDING, MERCI_RE, stubLeadApi } from './helpers';

test.use({ viewport: { width: 390, height: 844 } });

test('the full flow works on a mobile viewport with no horizontal overflow', async ({ page }) => {
  await stubLeadApi(page);
  await page.goto(LANDING);
  await dismissConsentBanner(page);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflow).toBe(false);

  await completeLeadForm(page);
  await expect(page).toHaveURL(MERCI_RE);
});

test('the mobile sticky CTA is shown and points at the lead form', async ({ page }) => {
  await page.goto(LANDING);
  await dismissConsentBanner(page);

  const cta = page.locator('.mobile-sticky-cta');
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute('href', '#diagnostic');
});
