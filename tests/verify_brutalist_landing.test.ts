import { test, expect } from '@playwright/test';

test('capture new brutalist design', async ({ page }) => {
  // Go to home page
  await page.goto('http://localhost:3000');
  test.setTimeout(120000);

  // Verify Brutalist Elements
  // 1. Sticky Nav (Brutalist Style)
  await expect(page.locator('nav').first()).toBeVisible();
  await expect(page.locator('span:has-text("RETRO CIRCUIT_")').first()).toBeVisible();

  // 2. Hero Text (Swiss Style Layout)
  await expect(page.locator('h1').filter({ hasText: 'DATA' })).toBeVisible();
  await expect(page.locator('h1').filter({ hasText: 'BASE' })).toBeVisible();

  // 3. Grid Blocks
  await expect(page.locator('h3:has-text("VS MODE")')).toBeVisible();
  await expect(page.locator('h3:has-text("NEWS")')).toBeVisible();
  await expect(page.locator('h3:has-text("JOIN THE CIRCUIT")')).toBeVisible();

  // 4. Marquee Footer (Now at Top)
  const marquee = page.locator('.animate-marquee');
  await expect(marquee).toBeVisible();
  await expect(marquee).toHaveText(/SYSTEM ONLINE/);

  // Screenshot
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `verification/final_brutalist_landing.png`, fullPage: true });
});
