# Route Architecture & SEO Configuration

This document outlines the current state of public-facing routes in The Retro Circuit application, detailing their URL paths, current SEO metadata (Title, Description, Header), and actionable suggestions for improving search engine visibility.

---

## Static Routes

### 1. Home / Landing Page
*   **Path:** `/`
*   **Current H1:** "THE RETRO CIRCUIT"
*   **Current Title:** `The Retro Circuit | Ultimate Retro Console Comparisons & Specs` (from `siteConfig.name` / `app/layout.tsx`)
*   **Current Description:** `The hub for retro handheld consoles. Compare specs, find your perfect device with The Finder, and go head-to-head in Arena VS.`
*   **SEO Suggestions:**
    *   **Title Optimization:** Good current title. Consider adding year to show freshness: `The Retro Circuit | Ultimate Retro Console Database 2025`
    *   **Description Optimization:** Make it slightly more actionable: `Discover your perfect retro handheld console. Compare in-depth specs, analyze emulation performance, and match head-to-head in the Arena.`
    *   **OpenGraph:** Ensure a high-quality global fallback image is explicitly defined in `app/layout.tsx` metadata.

### 2. Console Vault
*   **Path:** `/consoles`
*   **Current H1:** "Console Vault"
*   **Current Title:** `Console Vault | All Retro Handhelds | The Retro Circuit`
*   **Current Description:** `Browse, filter, and sort every retro handheld console in the database. [X] consoles, [Y] hardware variants.` (Dynamic counts)
*   **SEO Suggestions:**
    *   **Title Optimization:** Very strong.
    *   **Description Optimization:** Current description is excellent because it features dynamic metrics that update as the database grows, showing authority.
    *   **Canonical:** Add explicit canonical tag pointing to `https://theretrocircuit.com/consoles`.

### 3. Fabricators (Manufacturers)
*   **Path:** `/fabricators`
*   **Current H1:** "Manufacturers"
*   **Current Title:** `Fabricators | Retro Handheld Manufacturers | The Retro Circuit`
*   **Current Description:** `Browse all retro handheld manufacturers and modders. Explore their full device catalogues and specs.`
*   **SEO Suggestions:**
    *   **Title Optimization:** "Fabricators" might not be as widely searched as "Manufacturers" or "Brands". Suggestion: `Retro Handheld Manufacturers & Brands | The Retro Circuit`
    *   **Description Optimization:** `Discover the creators behind your favorite retro handhelds. Browse full device catalogs, specifications, and history from top manufacturers.`
    *   **Canonical:** Add canonical link.

### 4. News / Transmission Feed
*   **Path:** `/news`
*   **Current H1:** "Transmission Feed"
*   **Current Title:** `Transmission Feed | The Retro Circuit`
*   **Current Description:** `Latest hardware signals, reviews, and news from the retro handheld sector. Direct updates from the control center.`
*   **SEO Suggestions:**
    *   **Title Optimization:** "Transmission Feed" is thematic but poor for SEO. Suggestion: `Retro Handheld News & Hardware Reviews | The Retro Circuit`
    *   **Description Optimization:** Strong, but ensure keywords like "emulation handhelds" are included naturally.

### 5. The Finder
*   **Path:** `/finder`
*   **Current H1:** "FINDER_"
*   **Current Title:** `Handheld Finder | The Retro Circuit`
*   **Current Description:** `Test page for iterating on the new Finder algorithm.`
*   **SEO Suggestions:**
    *   **Title Optimization:** Expand to target user intent. Suggestion: `Find the Best Retro Handheld for You | The Retro Circuit Quiz`
    *   **Description Optimization:** Replace the current placeholder description immediately. Suggestion: `Not sure which retro handheld to buy? Answer a few quick questions about your budget and emulation needs, and we'll match you with the perfect device.`
    *   **Robots:** Depending on the state of the feature, make sure this isn't blocked by robots.txt if it's ready to be indexed.

### 6. Roadmap
*   **Path:** `/roadmap`
*   **Current H1:** "System Roadmap"
*   **Current Title:** `Project Roadmap | The Retro Circuit`
*   **Current Description:** `Track our progress as we build the ultimate handheld gaming database. See what features are coming next.`
*   **SEO Suggestions:**
    *   **Title Optimization:** `Development Roadmap & Feature Updates | The Retro Circuit`
    *   **Description Optimization:** The current description is solid.

### 7. About
*   **Path:** `/about`
*   **Current H1:** "Project Origin"
*   **Current Title:** `About | The Retro Circuit`
*   **Current Description:** `The story behind The Retro Circuit. Why it was built, what it stands for, and where it's going.`
*   **SEO Suggestions:**
    *   **Title Optimization:** `About Us | The Retro Circuit Database`
    *   **Description Optimization:** Good as is.

### 8. Credits
*   **Path:** `/credits`
*   **Current H1:** "System Credits"
*   **Current Title:** `Credits | The Retro Circuit`
*   **Current Description:** (Missing)
*   **SEO Suggestions:**
    *   **Title Optimization:** Leave as is.
    *   **Description Optimization:** Add description: `Acknowledgments and credits for the open-source tools, data, and contributors powering The Retro Circuit.`
    *   **Robots:** Consider `noindex, follow` if this page offers low SEO value compared to content pages.

### 9. Terms of Service
*   **Path:** `/terms`
*   **Current H1:** "Terms of Service"
*   **Current Title:** `Terms of Service | The Retro Circuit`
*   **Current Description:** (Missing)
*   **SEO Suggestions:**
    *   **Title Optimization:** Good.
    *   **Description Optimization:** Add description: `Terms of Service and usage conditions for The Retro Circuit database and applications.`
    *   **Robots:** Ensure `noindex, follow` is set as this is legal boilerplate.

### 10. Privacy Policy
*   **Path:** `/privacy`
*   **Current H1:** "Privacy Policy"
*   **Current Title:** `Privacy Policy | The Retro Circuit`
*   **Current Description:** (Missing)
*   **SEO Suggestions:**
    *   **Title Optimization:** Good.
    *   **Description Optimization:** Add description: `Privacy Policy detailing data handling and user privacy practices at The Retro Circuit.`
    *   **Robots:** Ensure `noindex, follow` is set.

---

## Dynamic Routes

### 11. Console Detail Page
*   **Path:** `/consoles/[slug]`
*   **Current H1:** Not explicitly defined as a single `<h1>` tag in standard layout, uses dynamic components (`TechnicalReference`, `GlanceComparison`, etc).
*   **Current Title (Dynamic):** `[Manufacturer Name] [Console Name] Specs, Price & Variants | The Retro Circuit`
*   **Current Description (Dynamic):** Extracted from technical specifications (e.g., screen size, resolution, CPU).
*   **OpenGraph:** Dynamically generated at `/consoles/[slug]/opengraph-image`.
*   **SEO Suggestions:**
    *   **H1 Tag:** Ensure the primary visual name of the console at the top of the page is wrapped in an `<h1>` tag for semantic structure.
    *   **Schema Markup:** Expand current JSON-LD product schema to include AggregateRating (if applicable in the future) and clearer Offer structures based on `price_launch_usd`.
    *   **Canonical:** Ensure canonical strictly points to the `[slug]` to avoid duplicate content from the `[manufacturer]-[slug]` legacy patterns.
    *   **Title Optimization:** Very strong currently.

### 12. Fabricator (Manufacturer) Detail Page
*   **Path:** `/fabricators/[slug]`
*   **Current H1:** `[Manufacturer Name]`
*   **Current Title (Dynamic):** `[Manufacturer Name] Handheld History | The Retro Circuit`
*   **Current Description (Dynamic):** `Explore the complete hardware archive of [Manufacturer Name].`
*   **SEO Suggestions:**
    *   **Title Optimization:** Consider adding keywords: `[Manufacturer Name] Retro Handhelds & Consoles List | The Retro Circuit`
    *   **Description Optimization:** `View the complete catalog of retro handhelds by [Manufacturer Name]. Compare specs, prices, and release dates across their entire hardware lineup.`
    *   **Schema Markup:** Implement `Organization` or `Brand` JSON-LD schema on these pages.

### 13. Arena (Comparison) Page
*   **Path:** `/arena/[[...versus]]`
*   **Current H1:** Player 1 vs Player 2 headers in the Arena interface.
*   **Current Title (Dynamic):**
    *   No selection: `Arena VS | Compare Any Two Handhelds | The Retro Circuit`
    *   With selection: `[Console 1 Name] vs [Console 2 Name] | The Retro Circuit`
*   **Current Description (Dynamic):**
    *   No selection: `Pick any two retro handhelds and compare them head-to-head. Specs, performance, price, and emulation targets.`
    *   With selection: `Head-to-head spec comparison: [Console 1 Name] vs [Console 2 Name]. Performance, price, and emulation targets.`
*   **SEO Suggestions:**
    *   **Canonical Implementation:** The current setup alphabetically sorts the slugs for the canonical URL (e.g., `/arena/a-vs-b` is canonical for both `a-vs-b` and `b-vs-a`). This is **excellent** and prevents massive duplicate content issues.
    *   **Title Optimization:** Good, but consider adding intent keywords: `[Console 1] vs [Console 2] Specs & Emulation Comparison | The Retro Circuit`
    *   **Description Optimization:** Strong current description.
    *   **OpenGraph:** Consider creating a dynamic OpenGraph image route for comparisons (e.g., splitting the image 50/50 between the two consoles) to make social sharing of matchups highly engaging.
