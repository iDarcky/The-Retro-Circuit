import { test, expect } from "@playwright/test";

test("capture landing page designs", async ({ page }) => {
  test.setTimeout(120000);
  const designs = [
    "dashboard",
    "hero",
    "terminal",
    "marketing",
    "apple-dark",
    "apple-light",
    "gsm",
    "bento",
    "win95",
    "brutalist",
    "magazine",
    "timeline"
  ];

  await page.goto("http://localhost:3000");

  // Wait for at least one button to be present.
  await page.waitForSelector("button[title=\"Dashboard\"]");

  for (const design of designs) {
    console.log(`Switching to design: ${design}`);

    let label = "";
    switch(design) {
        case "dashboard": label = "Dashboard"; break;
        case "hero": label = "Clean Hero"; break;
        case "terminal": label = "Terminal"; break;
        case "marketing": label = "Marketing"; break;
        case "apple-dark": label = "Apple (Dark)"; break;
        case "apple-light": label = "Apple (Light)"; break;
        case "gsm": label = "GSM Arena"; break;
        case "bento": label = "Bento Grid"; break;
        case "win95": label = "Win 95"; break;
        case "brutalist": label = "Brutalist"; break;
        case "magazine": label = "90s Mag"; break;
        case "timeline": label = "Timeline"; break;
    }

    const button = page.locator(`button[title="${label}"]`);
    await button.click();

    // Wait for the design to render
    await page.waitForTimeout(1000);

    await page.screenshot({ path: `verification/${design}.png`, fullPage: true });
  }
});
