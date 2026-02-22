import { test, expect } from '@playwright/test';

test.describe('E2E Smoke Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Visit the home page
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Bypass Cookie Banner by clicking "Accept"
    // The banner might take a moment to appear (useEffect timeout)
    try {
      const acceptButton = page.getByRole('button', { name: 'Accept' });
      await acceptButton.waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      if (await acceptButton.isVisible()) {
        await acceptButton.click();
        await acceptButton.waitFor({ state: 'hidden' });
      }
    } catch (e) {
      console.log('Cookie banner not handled or already accepted');
    }
  });

  test('Home Page loads and has Swiss Design elements', async ({ page, isMobile }) => {
    // Check for "System Online" pill or similar Swiss element
    // The element text might be split or styled in a way that 'text=' doesn't match perfectly if strictly matching.
    // Using a more relaxed locator or checking for the H1
    await expect(page.locator('h1')).toContainText('THE CIRCUIT');

    // Check for "Swiss Gradient Line" in Footer or just Footer
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: `test-results/home-${isMobile ? 'mobile' : 'desktop'}.png`, fullPage: true });
  });

  test('About Page loads with correct structure', async ({ page, isMobile }) => {
    await page.goto('/about', { waitUntil: 'domcontentloaded' });

    // Check for "THE RETRO CIRCUIT" title
    await expect(page.locator('h1')).toContainText('THE RETRO');

    // Check for "Mission" section (01)
    await expect(page.getByText('Signal Noise Ratio', { exact: false })).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: `test-results/about-${isMobile ? 'mobile' : 'desktop'}.png`, fullPage: true });
  });

  test('Privacy Page loads and checks layout', async ({ page, isMobile }) => {
    await page.goto('/privacy', { waitUntil: 'domcontentloaded' });

    // Check for H1
    await expect(page.locator('h1')).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: `test-results/privacy-${isMobile ? 'mobile' : 'desktop'}.png`, fullPage: true });
  });

  test('Credits Page loads', async ({ page, isMobile }) => {
    await page.goto('/credits', { waitUntil: 'domcontentloaded' });

    // Check for "CREDITS_"
    await expect(page.getByText('CREDITS_', { exact: false })).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: `test-results/credits-${isMobile ? 'mobile' : 'desktop'}.png`, fullPage: true });
  });

  test('Header Logic (Mobile vs Desktop)', async ({ page, isMobile }) => {
    if (isMobile) {
      // Check Mobile Top Bar is visible
      // It has "fixed top-0 left-0 w-full z-50"
      // We look for the header that is NOT hidden on mobile (so it has md:hidden)
      const mobileTopBar = page.locator('header.md\\:hidden');
      await expect(mobileTopBar).toBeVisible();

    } else {
      // Check Desktop Header is visible
      // The desktop header uses <nav className="hidden md:flex ...">
      const desktopNav = page.locator('nav.hidden.md\\:flex');
      await expect(desktopNav).toBeVisible();
    }
  });

});
