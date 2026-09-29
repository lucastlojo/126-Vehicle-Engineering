import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const base = new URL(process.argv.slice(2).find((arg) => arg !== '--') || 'http://127.0.0.1:4173/');
base.pathname = base.pathname.replace(/\/*$/, '/');
const browser = await chromium.launch();
let checks = 0;
const check = (value, message) => { assert.ok(value, message); checks++; };
try {
  for (const width of [390, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(base.href);
    await page.getByLabel('Year', { exact: true }).selectOption('2021');
    await page.getByLabel('Make', { exact: true }).selectOption('Ram');
    await page.getByLabel('Model / engine', { exact: true }).selectOption('1500 eTorque 5.7L');
    await page.getByRole('button', { name: 'Find your fix', exact: true }).click();
    await page.waitForURL('**/products/ram-1500-etorque-mgu-rebuild-kit/?**');
    check(new URL(page.url()).searchParams.get('year') === '2021', 'Home search preserves year');
    await page.getByLabel('Year', { exact: true }).selectOption('2021');
    await page.getByRole('button', { name: 'Check fitment', exact: true }).click();
    await page.getByText('Vehicle match confirmed', { exact: true }).waitFor();
    check((await page.locator('.fitment-result').innerText()).includes('actual fault'), 'Vehicle match keeps inspection caveat');

    await page.getByLabel('Unit number').fill('wrong-reference');
    check(await page.locator('.fitment-result').getByText('Check your vehicle', { exact: true }).isVisible(), 'Editing resets fitment status');
    await page.getByRole('button', { name: 'Check fitment', exact: true }).click();
    await page.getByText('Unit number needs review', { exact: true }).waitFor();
    check(await page.locator('.ve-fitment-badge--review').isVisible(), 'Unknown unit requires review');
    await page.getByLabel('Unit number').fill('68623194ac');
    await page.getByRole('button', { name: 'Check fitment', exact: true }).click();
    await page.getByText('Vehicle + unit number match', { exact: true }).waitFor();
    check(await page.locator('.ve-fitment-badge--confirmed').isVisible(), 'Known unit matches case-insensitively');
    await page.getByLabel('Year', { exact: true }).selectOption('2018');
    await page.getByRole('button', { name: 'Check fitment', exact: true }).click();
    await page.getByText('Vehicle match not confirmed', { exact: true }).waitFor();
    check(await page.locator('.ve-fitment-badge--unconfirmed').isVisible(), 'Out-of-range year is rejected');
    await page.getByLabel('Make', { exact: true }).selectOption('Tesla');
    check(await page.getByLabel('Model / engine', { exact: true }).inputValue() === '', 'Make change clears model');

    await page.getByRole('button', { name: 'Show Unit check', exact: true }).click();
    check((await page.locator('.product-gallery__stage > img').getAttribute('src')).endsWith('fitment-dark.svg'), 'Gallery changes to unit diagram');
    await page.getByRole('button', { name: 'Enlarge technical illustration' }).click();
    const zoom = page.getByRole('dialog', { name: 'Enlarged technical illustration' });
    await zoom.waitFor();
    check(await zoom.isVisible(), 'Gallery opens modal');
    await page.keyboard.press('Escape');
    check(!(await zoom.isVisible()), 'Escape dismisses gallery');
    check(await page.getByRole('button', { name: 'Enlarge technical illustration' }).evaluate((el) => el === document.activeElement), 'Gallery restores keyboard focus');

    const purchase = width <= 720 ? '.mobile-purchase-bar button' : '.purchase-card__add';
    await page.locator(purchase).click();
    const cart = page.getByRole('dialog', { name: 'Your cart', exact: true });
    await cart.waitFor();
    check((await cart.innerText()).includes('$520 USD'), 'Cart displays kit subtotal');
    check((await cart.getByRole('link', { name: 'Continue to purchase' }).getAttribute('href')).startsWith('https://126veng.com/'), 'Purchase handoff uses official site');
    await page.getByRole('button', { name: 'Close cart', exact: true }).click();
    await page.reload();
    await page.getByRole('button', { name: 'Open cart, 1 items' }).waitFor();
    check(await page.getByRole('button', { name: 'Open cart, 1 items' }).isVisible(), 'Cart survives reload');
    await page.getByRole('button', { name: 'Open cart, 1 items' }).click();
    await cart.getByRole('button', { name: 'Remove', exact: true }).click();
    check((await cart.innerText()).includes('Your cart is empty'), 'Remove clears cart');
    await page.keyboard.press('Escape');

    await page.goto(base.href);
    if (width <= 720) {
      await page.getByRole('button', { name: 'Open menu', exact: true }).click();
      const navigation = page.getByRole('navigation', { name: 'Mobile navigation' });
      check(await navigation.isVisible(), 'Mobile menu opens');
      await navigation.getByRole('link', { name: 'Repair resources' }).click();
      check(!(await navigation.isVisible()), 'Anchor navigation closes mobile menu');
    } else {
      await page.locator('.nav-dropdown summary').filter({ hasText: 'Shop by vehicle' }).click();
      check(await page.locator('.nav-dropdown').filter({ hasText: 'Shop by vehicle' }).evaluate((el) => el.open), 'Desktop dropdown opens');
      await page.keyboard.press('Escape');
      check(await page.locator('.nav-dropdown').filter({ hasText: 'Shop by vehicle' }).evaluate((el) => !el.open), 'Escape closes desktop dropdown');
    }
    check(await page.locator('.hero__visual > img').evaluate((el) => getComputedStyle(el).animationName === 'none'), 'Reduced motion respected');
    check(errors.length === 0, 'No JavaScript errors: ' + errors.join(', '));
    console.log('Interaction checks passed at ' + width + 'px');
    await context.close();
  }
} finally {
  await browser.close();
}
console.log(checks + ' interaction checks passed.');
