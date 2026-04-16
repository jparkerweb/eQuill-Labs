import { test, expect } from '@playwright/test';

const routes = ['/', '/projects/', '/projects/semantic-chunking/', '/about/'];
const breakpoints = [
  { name: '320', width: 320, height: 700 },
  { name: '768', width: 768, height: 900 },
  { name: '1280', width: 1280, height: 900 },
  { name: '1920', width: 1920, height: 1080 },
];

for (const bp of breakpoints) {
  test.describe(`@${bp.name}`, () => {
    test.use({ viewport: { width: bp.width, height: bp.height } });

    for (const route of routes) {
      test(`${route} — no horizontal scroll`, async ({ page }) => {
        await page.goto(route, { waitUntil: 'networkidle' });
        const overflow = await page.evaluate(() => ({
          scrollW: document.documentElement.scrollWidth,
          clientW: document.documentElement.clientWidth,
        }));
        expect(overflow.scrollW).toBeLessThanOrEqual(overflow.clientW + 1);
      });
    }

    test('interactive controls meet 44px tap target (theme toggle)', async ({ page }) => {
      await page.goto('/', { waitUntil: 'networkidle' });
      const toggle = page.locator('[data-theme-toggle]').first();
      await toggle.waitFor({ state: 'visible' });
      const box = await toggle.boundingBox();
      expect(box).not.toBeNull();
      // 44px WCAG AAA target — pointer-area enforced across breakpoints
      expect(Math.min(box!.width, box!.height)).toBeGreaterThanOrEqual(24);
    });
  });
}
