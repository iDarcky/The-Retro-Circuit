import { test, expect } from "@playwright/test";

test("debug design switcher", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.screenshot({ path: "verification/debug_page_load.png" });

  // Dump page content to console to see what is rendered
  const content = await page.content();
  console.log(content);
});
