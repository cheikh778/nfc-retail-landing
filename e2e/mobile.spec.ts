import { expect, test } from '@playwright/test';
import { completeLeadForm, dismissConsentBanner } from './helpers';

// Brief §44 scenario 4: mobile → navigation → CTA → formulaire → succès.
// A plain viewport override (rather than a full device-emulation preset) — see
// e2e/README.md for why full mobile emulation isn't used in this environment.
test.use({ viewport: { width: 390, height: 844 } });

test('the full flow works on a mobile viewport, with no horizontal overflow', async ({ page }) => {
  await page.goto('/fr/visibilite');
  await dismissConsentBanner(page);

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);

  await page.getByTestId('hero-cta').click();
  await completeLeadForm(page);
  await expect(page).toHaveURL(/\/fr\/visibilite\/merci$/);
});

test('the sticky CTA bar shows while scrolling and hides once the form is in view', async ({ page }) => {
  await page.goto('/fr/visibilite');
  await dismissConsentBanner(page);

  // The bar stays mounted at all times and toggles via aria-hidden + a transform
  // (brief §27's "disparaître" is about not competing with the form, not unmounting),
  // so we assert on aria-hidden rather than raw visibility.
  await page.evaluate(() => window.scrollBy(0, 900));
  await expect(page.getByTestId('sticky-cta')).toHaveAttribute('aria-hidden', 'false');

  await page.getByTestId('lead-form-step-1').scrollIntoViewIfNeeded();
  await expect(page.getByTestId('sticky-cta')).toHaveAttribute('aria-hidden', 'true');
});
