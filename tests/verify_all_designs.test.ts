import { test, expect } from '@playwright/test';

test('capture landing page designs', async ({ page }) => {
  // Go to home page
  await page.goto('http://localhost:3000');
  test.setTimeout(120000);

  // Verify Design Switcher exists
  await expect(page.locator('button:has-text("DEV_TOOLS: LANDING")')).toBeVisible({ timeout: 60000 });

  const designs = [
    'dashboard', 'apple-dark', 'apple-light', 'gsm', 'win95',
    'bento', 'brutalist', 'magazine', 'timeline', 'terminal',
    'hero', 'marketing'
  ];

  for (const design of designs) {
    // Force state and reload
    await page.evaluate((d) => {
        localStorage.setItem('retro_landing_design', d);
    }, design);

    await page.reload();
    // Wait for the specific component to be likely visible or just wait for network idle
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Give it a moment to settle

    // Screenshot
    await page.screenshot({ path: `verification/landing_${design}.png`, fullPage: true });
  }
});
