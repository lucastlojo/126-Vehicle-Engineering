import { chromium } from 'playwright';

const rawUrl = process.argv.slice(2).find((arg) => arg !== '--');
if (!rawUrl) {
  console.error('Usage: pnpm verify:staging -- http://127.0.0.1:4173/');
  console.error('   or: pnpm verify:staging -- https://OWNER.github.io/REPOSITORY/');
  process.exit(2);
}

const base = new URL(rawUrl);
if (!['https:', 'http:'].includes(base.protocol)) throw new Error('Expected an HTTP(S) preview URL.');
base.pathname = `${base.pathname.replace(/\/+$/, '')}/`;
base.search = '';
base.hash = '';
const pages = [
  { path: '/', heading: '#home-title' },
  { path: '/products/ram-1500-etorque-mgu-rebuild-kit/', heading: 'main h1' },
];
const widths = [320, 390, 719, 721, 879, 881, 1280];
const failures = [];
let checks = 0;

function check(ok, message) {
  checks += 1;
  if (!ok) failures.push(message);
}

const browser = await chromium.launch({ headless: true });
try {
  for (const { path, heading } of pages) {
    for (const width of widths) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        deviceScaleFactor: width <= 390 ? 2 : 1,
        isMobile: width <= 390,
        hasTouch: width <= 390,
      });
      const page = await context.newPage();
      const badAssets = [];
      page.on('response', (response) => {
        if (new URL(response.url()).origin === base.origin && response.status() >= 400 && ['image', 'stylesheet', 'script', 'font'].includes(response.request().resourceType())) {
          badAssets.push(`${response.status()} ${response.url()}`);
        }
      });
      page.on('requestfailed', (request) => {
        if (new URL(request.url()).origin === base.origin && ['image', 'stylesheet', 'script', 'font'].includes(request.resourceType())) {
          badAssets.push(`${request.failure()?.errorText || 'failed'} ${request.url()}`);
        }
      });
      try {
        const url = new URL(path.replace(/^\/+/, ''), base);
        const response = await page.goto(url.href, { waitUntil: 'load', timeout: 30000 });
        check(response?.status() === 200, `${path} @ ${width}px: HTTP ${response?.status() ?? 'no response'}`);
        const robots = await page.locator('meta[name="robots"]').getAttribute('content');
        check(robots?.includes('noindex'), `${path} @ ${width}px: missing noindex robots meta tag`);
        check(await page.locator(heading).isVisible(), `${path} @ ${width}px: heading not visible (possible protection/login page)`);
        const viewport = await page.evaluate((basePath) => ({
          declared: !!document.querySelector('meta[name="viewport"][content*="width=device-width"]'),
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          images: [...document.images].map((img) => ({ src: img.currentSrc || img.src, ok: img.complete && img.naturalWidth > 0 })),
          linksOutsideBase: [...document.querySelectorAll('a[href]')]
            .map((link) => link.href)
            .filter((href) => href.startsWith(location.origin + '/') && !new URL(href).pathname.startsWith(basePath)),
        }), base.pathname);
        check(viewport.declared, `${path} @ ${width}px: missing device-width viewport meta tag`);
        check(viewport.scrollWidth <= viewport.clientWidth + 2, `${path} @ ${width}px: horizontal overflow ${viewport.scrollWidth}px > ${viewport.clientWidth}px`);
        check(viewport.linksOutsideBase.length === 0, `${path} @ ${width}px: links escape Pages base: ${viewport.linksOutsideBase.join(', ')}`);
        for (const img of viewport.images) check(img.ok, `${path} @ ${width}px: broken image ${img.src}`);
        check(badAssets.length === 0, `${path} @ ${width}px: failed assets ${badAssets.join(', ')}`);

        const nav = await page.locator('.desktop-nav').evaluate((el) => getComputedStyle(el).display);
        const menu = await page.locator('.menu-toggle').evaluate((el) => getComputedStyle(el).display);
        check(width <= 880 ? nav === 'none' && menu !== 'none' : nav !== 'none' && menu === 'none',
          `${path} @ ${width}px: navigation breakpoint failed (desktop=${nav}, menu=${menu})`);

        if (path === '/') {
          check(await page.locator('.fitment-search select').count() === 3, `${path} @ ${width}px: Year/Make/Model fields missing`);
          const columns = await page.locator('.fitment-search__fields').evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
          check(width <= 720 ? columns === 2 : columns === 4, `${path} @ ${width}px: fitment grid has ${columns} columns`);
        } else {
          const layout = await page.locator('.product-layout').evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
          const mobileBar = await page.locator('.mobile-purchase-bar').evaluate((el) => getComputedStyle(el).display);
          const sticky = await page.locator('.purchase-column').evaluate((el) => getComputedStyle(el).position);
          check(width <= 720 ? layout === 1 && mobileBar !== 'none' : layout === 2 && mobileBar === 'none',
            `${path} @ ${width}px: product layout breakpoint failed (columns=${layout}, mobile bar=${mobileBar})`);
          check(width <= 720 ? sticky !== 'sticky' : sticky === 'sticky', `${path} @ ${width}px: purchase panel position is ${sticky}`);
        }
        console.log(`✓ ${path} ${width}px`);
      } catch (error) {
        failures.push(`${path} @ ${width}px: ${error.message}`);
      } finally {
        await context.close();
      }
    }
  }
} finally {
  await browser.close();
}

console.log(`\n${checks} checks, ${failures.length} failures`);
for (const failure of failures) console.error(`✗ ${failure}`);
if (failures.length) process.exitCode = 1;
