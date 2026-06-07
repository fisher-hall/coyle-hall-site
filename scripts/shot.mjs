// Screenshot helper for visual-parity checks during the UI migration.
// Usage: node scripts/shot.mjs <outDir>
// Captures every key page in light/dark x mobile/desktop into <outDir>.
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';

const outDir = process.argv[2] || '/tmp/coyle-shots';
const base = 'http://127.0.0.1:1313';

const pages = [
  ['home', '/'],
  ['incoming-students', '/incoming-students/'],
  ['history', '/history/'],
  ['building', '/building/'],
  ['faith', '/faith/'],
  ['location', '/location/'],
  ['traditions', '/traditions/'],
  ['regatta', '/regatta/'],
  ['car-smash', '/car-smash/'],
  ['ironra', '/current/ironra/'],
  ['president', '/hall-gov/president/'],
];

const matrices = [
  ['desktop', { width: 1440, height: 900 }],
  ['mobile', { width: 390, height: 844 }],
];
const themes = ['light', 'dark'];

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome' });

for (const [vpName, viewport] of matrices) {
  for (const theme of themes) {
    const ctx = await browser.newContext({
      viewport,
      deviceScaleFactor: 1,
      colorScheme: theme === 'dark' ? 'dark' : 'light',
    });
    const page = await ctx.newPage();
    for (const [name, path] of pages) {
      try {
        await page.goto(base + path, { waitUntil: 'networkidle', timeout: 30000 });
        // Force the theme class the site uses for dark mode.
        await page.evaluate((t) => {
          document.documentElement.classList.toggle('dark', t === 'dark');
        }, theme);
        // Scroll through the page to trigger IntersectionObserver fade-ins and
        // lazy images, then force any remaining fade-in-sections visible so the
        // full-page screenshot shows the fully-revealed state a user sees.
        await page.evaluate(async () => {
          const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
          const step = Math.floor(window.innerHeight * 0.8);
          for (let y = 0; y < document.body.scrollHeight; y += step) {
            window.scrollTo(0, y);
            await sleep(120);
          }
          window.scrollTo(0, 0);
          document.querySelectorAll('.fade-in-section').forEach((el) => {
            el.classList.add('visible');
            el.classList.remove('fade-ready');
          });
        });
        await page.waitForTimeout(900); // let waves/fade-in settle
        const file = `${outDir}/${name}__${vpName}__${theme}.png`;
        await page.screenshot({ path: file, fullPage: true });
        console.log('ok  ', file);
      } catch (e) {
        console.log('FAIL', name, vpName, theme, e.message);
      }
    }
    await ctx.close();
  }
}

await browser.close();
console.log('done ->', outDir);
