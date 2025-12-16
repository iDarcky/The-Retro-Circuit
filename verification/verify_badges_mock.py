
from playwright.sync_api import Page, expect, sync_playwright

def test_console_badge(page: Page):
    # Navigate to the console vault
    page.goto("http://localhost:3000/console")

    # Wait for content to load
    page.wait_for_selector("text=CONSOLE VAULT")

    # Since fetching from the fake Supabase URL fails, we can fulfill the request manually
    # instead of fetching and modifying.

    def handle_route(route):
        # Construct a fake response
        fake_consoles = [
            {
                "id": "test-id",
                "name": "Test Console",
                "slug": "test-console",
                "form_factor": "Horizontal",
                "chassis_features": "DUAL SCREEN",
                "manufacturer_id": "man-id",
                "manufacturer": {"name": "Test Man", "id": "man-id"},
                "variants": [],
                "release_year": 2024,
                "image_url": None
            }
        ]
        route.fulfill(json=fake_consoles)

    # Intercept Supabase calls
    page.route("**/rest/v1/consoles?*", handle_route)

    # Reload to trigger the fetch again with interception
    page.reload()

    # Wait for the badge to appear
    # The text 'DUAL SCREEN' should appear
    expect(page.get_by_text("DUAL SCREEN")).to_be_visible()

    # Take screenshot of the list view
    page.screenshot(path="verification/console_vault_badge.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_console_badge(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
