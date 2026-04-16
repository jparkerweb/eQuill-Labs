import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = [
  '/',
  '/projects/',
  '/projects/semantic-chunking/',
  '/about/',
];

for (const route of routes) {
  test(`${route} has no a11y violations`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'networkidle' });
    await page.locator('h1').first().waitFor({ state: 'visible' });
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
}
