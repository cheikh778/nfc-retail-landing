import { chromium } from 'playwright-core';

const url = process.argv[2] || 'http://localhost:5190/fr/visibilite';
const outDir = '/tmp/claude-1000/-home-cheikh-Dev-nfc-retail-landing/c2816344-c66d-48cc-81f8-9aaa56094dfe/scratchpad/shots';

const browser = await chromium.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce', deviceScaleFactor: 1.5 });
await page.goto(url, { waitUntil: 'networkidle' });
const acceptBtn = page.getByTestId('consent-accept');
if (await acceptBtn.isVisible().catch(() => false)) await acceptBtn.click();
await page.waitForTimeout(300);

const sections = [
  { id: 'top', name: 'hero' },
  { id: 'promesse', name: 'journey' },
  { id: 'produit', name: 'product' },
  { id: 'automation', name: 'automation' },
  { id: 'diagnostic', name: 'form' },
];

async function shootElement(selectorFn, name) {
  await page.evaluate(selectorFn);
  await page.waitForTimeout(200);
  const rect = await page.evaluate(selectorFn.toString().includes('return') ? selectorFn : selectorFn);
  await page.screenshot({ path: `${outDir}/section-${name}.png` });
  console.log('saved', name);
}

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
await page.screenshot({ path: `${outDir}/section-finalcta.png` });
console.log('saved finalcta');

await browser.close();
