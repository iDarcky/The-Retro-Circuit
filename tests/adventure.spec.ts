import { test, expect } from '@playwright/test';

test('adventure game basic flow', async ({ page }) => {
  await page.goto('/adventure');

  await expect(page.locator('h1')).toContainText('The Quest for the Lost Artifact');

  const logContainer = page.locator('.flex-1.overflow-y-auto');
  await expect(logContainer).toContainText('Welcome to the Text Adventure!');
  await expect(logContainer).toContainText('Start Room');

  const input = page.locator('input[type="text"]');

  await input.fill('look');
  await input.press('Enter');
  await expect(logContainer).toContainText('You are in a small, dimly lit room.');

  await input.fill('inventory');
  await input.press('Enter');
  await expect(logContainer).toContainText('You are not carrying anything.');

  await input.fill('take key');
  await input.press('Enter');
  await expect(logContainer).toContainText('You took the Rusty Key.');

  await input.fill('inventory');
  await input.press('Enter');
  await expect(logContainer).toContainText('You are carrying: Rusty Key');

  await input.fill('go north');
  await input.press('Enter');
  await expect(logContainer).toContainText('You go north.');
  await expect(logContainer).toContainText('Hallway');
});
