import { chromium } from 'playwright-core';
import path from 'node:path';

const url = process.argv[2] || 'http://localhost:5173/fr/visibilite';
const outDir = process.argv[3] || '/tmp/claude-1000/-home-cheikh-Dev-nfc-retail-landing/c2816344-c66d-48cc-81f8-9aaa56094dfe/scratchpad/shots';
const sizes = {
  mobile: { width: 390, height: 844 },
  tablet: { width: 820, height: 1180 },
  desktop: { width: 1440, height: 900 },
};

const browser = await chromium.launch({ args: ['--no-sandbox'] });
for (const [name, viewport] of Object.entries(sizes)) {
  const page = await browser.newPage({ viewport, reducedMotion: 'reduce' });
  await page.goto(url, { waitUntil: 'networkidle' });
  const acceptBtn = page.getByTestId('consent-accept');
  if (await acceptBtn.isVisible().catch(() => false)) await acceptBtn.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, `${name}-full.png`), fullPage: true });
  console.log(`saved ${name}-full.png`);
  await page.close();
}
await browser.close();
