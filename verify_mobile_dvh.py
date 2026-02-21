from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    # Mobile viewport
    context = browser.new_context(viewport={"width": 375, "height": 667})
    page = context.new_page()

    try:
        print("Navigating to home (Mobile View)...")
        page.goto("http://localhost:3000")

        # Verify Mobile Top Bar exists
        top_bar = page.locator("header.md\\:hidden")
        if not top_bar.is_visible():
            print("Mobile Top Bar not visible!")
            page.screenshot(path="verification_mobile_fail.png")
            return

        print("Mobile Top Bar found.")

        # Verify Main Layout Height
        # Check computed style for height
        layout_div = page.locator("#main-scroll-container").locator("..").locator("..") # Root
        # Actually easier to just find the root div with the class
        root_div = page.locator("div.h-\\[100dvh\\]")
        if root_div.count() > 0:
            print("SUCCESS: Root div has h-[100dvh] class.")
        else:
            print("FAILURE: Root div does NOT have h-[100dvh] class.")

        page.screenshot(path="verification_mobile_dvh.png")

    except Exception as e:
        print(f"Error: {e}")
        page.screenshot(path="verification_error.png")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
