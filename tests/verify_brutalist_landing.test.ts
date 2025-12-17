import { test, expect } from '@playwright/test';

test('capture new brutalist design', async ({ page }) => {
  // Go to home page
  await page.goto('http://localhost:3000');
  test.setTimeout(120000);

  // Verify Brutalist Elements
  // 1. Sticky Nav (Brutalist Style)
  await expect(page.locator('nav').first()).toBeVisible();

  // Update verification for new header structure
  // Logo is now "RETRO_CIRCUIT" on one line
  await expect(page.locator('span:has-text("RETRO_CIRCUIT")').first()).toBeVisible();

  // 2. Hero Text
  await expect(page.locator('h1').filter({ hasText: 'HARDWARE' })).toBeVisible();

  // 3. Stats Block
  await expect(page.locator('text=CPU ARCHITECTURE')).toBeVisible();

  // 4. Marquee Footer (Now at Top)
  const marquee = page.locator('.animate-marquee');
  await expect(marquee).toBeVisible();
  await expect(marquee).toHaveText(/SYSTEM ONLINE/);

  // Screenshot
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: `verification/final_brutalist_landing.png`, fullPage: true });
});
