import { chromium } from 'playwright-core';

const url = process.argv[2] || 'http://localhost:5190/fr/visibilite';
const outDir = '/tmp/claude-1000/-home-cheikh-Dev-nfc-retail-landing/c2816344-c66d-48cc-81f8-9aaa56094dfe/scratchpad/shots';

const browser = await chromium.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 375, height: 812 }, reducedMotion: 'reduce', deviceScaleFactor: 2 });
await page.goto(url, { waitUntil: 'networkidle' });
const acceptBtn = page.getByTestId('consent-accept');
if (await acceptBtn.isVisible().catch(() => false)) await acceptBtn.click();
await page.waitForTimeout(300);

const sections = [
  { id: 'top', name: 'm-hero' },
  { id: 'promesse', name: 'm-journey' },
  { id: 'produit', name: 'm-product' },
  { id: 'automation', name: 'm-automation' },
  { id: 'diagnostic', name: 'm-form' },
];

for (const s of sections) {
  await page.evaluate((id) => {
    document.getElementById(id).scrollIntoView({ block: 'start' });
  }, s.id);
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${outDir}/section-${s.name}.png` });
  console.log('saved', s.name);
}

await page.evaluate(() => {
  const sections = document.querySelectorAll('main > section');
  sections[sections.length - 1].scrollIntoView({ block: 'start' });
});
await page.waitForTimeout(200);
await page.screenshot({ path: `${outDir}/section-m-finalcta.png` });
console.log('saved m-finalcta');

// open mobile nav menu
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(200);
await page.click('button[aria-label="Ouvrir le menu"]');
await page.waitForTimeout(200);
await page.screenshot({ path: `${outDir}/section-m-nav-open.png` });
console.log('saved m-nav-open');

await browser.close();
