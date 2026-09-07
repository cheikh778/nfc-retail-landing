import { chromium } from 'playwright-core';

const url = process.argv[2] || 'http://localhost:5190/fr/visibilite';
const outDir = '/tmp/claude-1000/-home-cheikh-Dev-nfc-retail-landing/c2816344-c66d-48cc-81f8-9aaa56094dfe/scratchpad/shots';

const browser = await chromium.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1400 }, reducedMotion: 'reduce' });
await page.goto(url, { waitUntil: 'networkidle' });
const acceptBtn = page.getByTestId('consent-accept');
if (await acceptBtn.isVisible().catch(() => false)) await acceptBtn.click();
await page.waitForTimeout(300);

// measure section boundaries
const rects = await page.evaluate(() => {
  const ids = ['top', 'promesse', 'produit', 'automation', 'diagnostic'];
  return ids.map((id) => {
    const el = document.getElementById(id);
    if (!el) return { id, missing: true };
    const r = el.getBoundingClientRect();
    return { id, top: Math.round(r.top + window.scrollY), height: Math.round(r.height) };
  });
});
console.log(JSON.stringify(rects, null, 2));

await page.screenshot({ path: `${outDir}/hero-to-journey.png`, clip: { x: 0, y: 700, width: 1440, height: 900 } });
await browser.close();
