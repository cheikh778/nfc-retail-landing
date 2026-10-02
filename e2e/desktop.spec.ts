import { expect, test, type Page } from '@playwright/test';
import { fillLeadForm, LANDING, stubLeadApi } from './helpers';

async function expectFitsViewport(page: Page) {
  await expect.poll(() => page.evaluate(() => {
    const root = document.documentElement;
    return root.scrollHeight <= root.clientHeight && root.scrollWidth <= root.clientWidth;
  })).toBe(true);

  // A page with hidden overflow could pass the size check while clipping controls.
  const outside = await page.locator('.topbar, .hero h1, .lead-card, .lead-card input:not([type="checkbox"]):not([name="company_website"]), .lead-card button, .trustbar').evaluateAll((elements) =>
    elements.filter((element) => {
      const bounds = element.getBoundingClientRect();
      return bounds.top < -1 || bounds.left < -1 || bounds.bottom > window.innerHeight + 1 || bounds.right > window.innerWidth + 1;
    }).map((element) => element.tagName + '.' + element.className));
  expect(outside).toEqual([]);
}

for (const [width, height] of [
  [2560, 1440], [1920, 1080], [1440, 900], [1536, 730],
  [1366, 650], [1280, 620], [1280, 560], [1024, 600], [901, 600],
]) {
  test(`landing and form errors fit ${width}×${height} without scrolling`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await stubLeadApi(page, 500);
    await page.goto(LANDING);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.locator('footer')).toHaveCount(0);
    await expect(page.getByTestId('consent-reject')).toBeVisible();
    await expectFitsViewport(page);
    await page.getByTestId('consent-reject').click();
    await expectFitsViewport(page);

    await page.getByTestId('lead-submit').click();
    await expect(page.getByTestId('form-message')).not.toBeEmpty();
    await expectFitsViewport(page);

    await fillLeadForm(page);
    await page.getByTestId('lead-submit').click();
    await expect(page.getByTestId('submit-error')).not.toBeEmpty();
    await expectFitsViewport(page);
  });
}
