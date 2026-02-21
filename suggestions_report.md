# SUGGESTIONS & IMPLEMENTATION REPORT

This document details the *Why*, *How*, and *Where* for every recommendation in the Audit Report.

---

## 1. Product Manager (Roadmap)

### 1.1 "Can It Play...?" Search Logic
*   **Why:** Casual users search for outcomes ("play God of War"), not specs ("Unisoc T618"). Current search only indexes names.
*   **How:** Modify the Supabase query to join `emulation_profiles`. Create a search index that maps keywords (e.g., "GC", "GameCube", "Dolphin") to the `gamecube_state` column.
*   **Where:** `lib/api/consoles.ts` (backend query), `components/arena/ConsoleSearch.tsx` (frontend filter logic).

### 1.2 Price History / Tracking
*   **Why:** Handheld prices drop fast. Users hesitate to buy without knowing if it's a "good deal".
*   **How:** Create a `price_history` table (`console_id`, `price`, `date`, `vendor`). Display a Sparkline chart showing the 6-month trend.
*   **Where:** Database (Supabase SQL Editor), `components/console/PriceChart.tsx` (New Component), `app/consoles/[slug]/page.tsx`.

### 1.3 "VS" Mode Expansion (3+ Devices)
*   **Why:** Enthusiasts often cross-shop a "High/Mid/Low" trio (e.g., Steam Deck vs Odin 2 vs RP4 Pro). 2-way limit is restrictive.
*   **How:** Refactor `QuickCompare` to use a `selectedConsoles` array (state) instead of fixed `p1`/`p2`. Update the `/arena/[slugs]` route to handle `...slugs` catch-all.
*   **Where:** `components/landing/QuickCompare.tsx`, `app/arena/page.tsx`, `lib/utils/compare.ts`.

### 1.4 User Reviews & Ratings
*   **Why:** "Paper specs" don't tell the whole story (e.g., bad ergonomics, poor screen QC).
*   **How:** Add `reviews` table. Implement a "Star Rating" UI component. Calculate average score in `getConsoleBySlug`.
*   **Where:** `components/console/UserReviews.tsx` (New), `lib/types/domain.ts`.

### 1.5 "Starter Packs" / Guides
*   **Why:** High return rate on devices because users can't set them up. Reduces "buyer's remorse".
*   **How:** Add a `guide_url` field to `consoles` table. Render a "Setup Guide" button in the `ActionCard` area if the link exists.
*   **Where:** `components/console/ConsoleDetailView.tsx` (Hero Section), `lib/types/domain.ts`.

### 1.6 News Integration
*   **Why:** The homepage is static. News drives repeat traffic and improves SEO freshness.
*   **How:** Create a `posts` table. Implement a CMS interface in `/admin/news`. Render top 3 posts in a "Transmission Log" section on home.
*   **Where:** `app/news/page.tsx`, `components/landing/NewsFeed.tsx` (New), `app/admin/news/page.tsx` (New).

### 1.7 Social Sharing Cards (Dynamic OG)
*   **Why:** When users share a comparison, the image should show *those specific consoles* to increase click-through rate from Twitter/Discord.
*   **How:** Use `@vercel/og`. Create an API route `api/og?c1=deck&c2=ally` that generates an image on the fly using the console images.
*   **Where:** `app/api/og/route.tsx` (New), `app/arena/page.tsx` (Metadata `openGraph.images`).

### 1.8 "Notify Me" Feature
*   **Why:** Captures intent for unreleased devices (high hype cycle). Builds an email list.
*   **How:** Add a "Notify when Released" button for `status: draft/review`. Save email to `interested_users` table.
*   **Where:** `components/console/ConsoleDetailView.tsx` (Status Badge area), `lib/api/marketing.ts` (New).

---

## 2. Developer (Code & Security)

### 2.1 CRITICAL: Middleware Auth Bypass
*   **Why:** `middleware.ts` currently allows full access if `supabaseUrl` includes "placeholder". If this leaks to prod, auth is dead.
*   **How:** Remove the `isPlaceholder` check entirely or wrap it strictly in `if (process.env.NODE_ENV === 'development')`.
*   **Where:** `middleware.ts` (Line 15-18).

### 2.2 CSRF Protection / Admin Verification
*   **Why:** A malicious user could theoretically POST to `updateConsole` if they guess the ID, relying only on client-side checks.
*   **How:** Ensure Supabase RLS (Row Level Security) policies for `consoles` table explicitly allow `UPDATE` *only* for `auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')`.
*   **Where:** Supabase Dashboard (SQL Editor / Auth Policies).

### 2.3 Race Conditions (Promise.race)
*   **Why:** The 10s timeout in `ConsoleForm` is a hack. It leaves the request hanging in the background.
*   **How:** Use `AbortController`. Pass `signal` to the fetch/Supabase client (if supported) or handle the cleanup logic properly.
*   **Where:** `components/admin/ConsoleForm.tsx` (handleSubmit).

### 2.4 Type Safety (FormData)
*   **Why:** `formData: any` invites bugs (e.g., typos like `releaseDate` vs `release_date`).
*   **How:** Define `interface ConsoleFormData` that strictly matches the DB schema. Use `Zod` to infer the type.
*   **Where:** `components/admin/ConsoleForm.tsx`, `lib/schemas/console.ts`.

### 2.5 Image Optimization
*   **Why:** `FeaturedConsoles` loads images with generic sizes. LCP (Largest Contentful Paint) suffers.
*   **How:** Update `sizes` prop to be specific: `sizes="(max-width: 768px) 50vw, (max-width: 1200px) 20vw, 15vw"`.
*   **Where:** `components/landing/FeaturedConsoles.tsx` (Image component).

### 2.6 Dead Code Removal
*   **Why:** `lib/utils.ts` is empty but imported. Increases mental overhead.
*   **How:** Delete the file and check for any imports (e.g., `cn` utility) that might be missing or misplaced.
*   **Where:** `lib/utils.ts`.

### 2.7 Linting Strictness
*   **Why:** `exhaustive-deps` as 'warn' allows bugs where `useEffect` runs with stale closures.
*   **How:** Change rule to `"error"` in `eslint.config.mjs`. Fix the resulting build errors (usually by wrapping functions in `useCallback`).
*   **Where:** `eslint.config.mjs`.

### 2.8 Server Actions Migration
*   **Why:** Client-side API calls expose internal logic. Server Actions are more secure and type-safe.
*   **How:** Move `addConsole`, `updateConsole` to `app/actions/console.ts` with `use server` directive.
*   **Where:** `components/admin/ConsoleForm.tsx`, `app/actions/console.ts`.

---

## 3. UI/UX Designer

### 3.1 Text Legibility (Mobile)
*   **Why:** `text-[10px]` is unreadable for users with mild visual impairments or on high-DPI small screens.
*   **How:** Find/Replace `text-[10px]` with `text-xs` (12px) in mobile-specific components.
*   **Where:** `components/layout/MobileTopBar.tsx`, `components/landing/LandingPage.tsx` (System Online pill).

### 3.2 Touch Targets
*   **Why:** 24px icons are hard to tap. Frustrates mobile users.
*   **How:** Wrap icons in a `<div className="p-2">` or set `min-w-[44px] min-h-[44px]` on the button itself.
*   **Where:** `components/layout/MobileTopBar.tsx`.

### 3.3 Search "No Results" State
*   **Why:** Typing "Switch 2" and seeing nothing happens looks like a bug.
*   **How:** Render a specific UI block when `filtered.length === 0` that says "System Not Found" with a "Request This Device" link.
*   **Where:** `components/arena/ConsoleSearch.tsx`.

### 3.4 Swiss Grid Consistency
*   **Why:** "Swiss Design" relies on mathematical grids. Random `gap-4` vs `gap-6` breaks the rhythm.
*   **How:** Define a spacing scale constant (e.g., `gap-grid = 24px`). Enforce it across all grid containers.
*   **Where:** `components/landing/FeaturedConsoles.tsx`, `components/console/ConsoleVaultClient.tsx`.

### 3.5 "VS" Visual Anchor
*   **Why:** The current small circle gets lost. The "Fight" concept needs energy.
*   **How:** Replace the icon with a larger, glitch-styled "VS" graphic or typography (`font-pixel`).
*   **Where:** `components/landing/QuickCompare.tsx`.

### 3.6 Empty States (System Offline)
*   **Why:** A blank table is ugly. "System Offline" is immersive.
*   **How:** Create a reusable `<EmptyState title="NO SIGNAL" />` component with scanlines/static effect.
*   **Where:** `components/ui/EmptyState.tsx` (New), `components/console/ConsoleDetailView.tsx`.

### 3.7 Motion Reduction
*   **Why:** Marquees cause motion sickness.
*   **How:** Add `motion-reduce:animate-none` to `tailwind.config.js` or specific class strings.
*   **Where:** `components/landing/LandingPage.tsx` (Marquee text), `tailwind.config.js`.

---

## 4. Sales & Monetization

### 4.1 Affiliate Integration
*   **Why:** This is the primary revenue stream.
*   **How:** Add `affiliate_amazon`, `affiliate_aliexpress` columns to DB. Create a `BuyButton` component that checks these fields and renders the button.
*   **Where:** `components/console/BuyButton.tsx` (New), `app/consoles/[slug]/page.tsx`.

### 4.2 "Pro" Membership
*   **Why:** Recurring revenue.
*   **How:** Create a Stripe Checkout flow. Gate the "Export PDF" button behind a `user.subscription === 'pro'` check.
*   **Where:** `app/api/checkout/route.ts`, `components/layout/UserMenu.tsx`.

### 4.3 Sponsored Spots
*   **Why:** Brands will pay for visibility.
*   **How:** Add `is_sponsored` boolean to `consoles` table. In `fetchLatestConsoles`, always unshift sponsored items to index 0.
*   **Where:** `lib/api/latest.ts`.

### 4.4 Merch Store
*   **Why:** Brand loyalty + revenue.
*   **How:** Link to an external Shopify/Teespring store in the Nav/Footer. Don't build e-commerce from scratch yet.
*   **Where:** `components/layout/Footer.tsx`, `components/layout/Navbar.tsx`.

### 4.5 Data Licensing API
*   **Why:** B2B revenue.
*   **How:** Create an API route `/api/v1/specs/[id]` protected by an API Key (Supabase Auth). Sell keys.
*   **Where:** `app/api/v1/specs/[id]/route.ts`.

### 4.6 Accessory Cross-Sell
*   **Why:** High margin. "You bought the console, now protect it."
*   **How:** Add an `accessories` array field (JSONB) to `consoles`. Render a "Recommended Loadout" section.
*   **Where:** `components/console/ConsoleDetailView.tsx`.

### 4.7 Email Capture
*   **Why:** Own the audience.
*   **How:** Add a simple form (Input + Subscribe Button) to the Footer or Manifesto page. Send to Mailchimp/Resend.
*   **Where:** `components/layout/NewsletterForm.tsx` (New), `components/landing/LandingPage.tsx`.

---

## 5. Users (Casual vs. Enthusiast)

### 5.1 Playability First
*   **Why:** Casuals leave if they have to scroll past "CPU Clock" to find "Can it play Mario?".
*   **How:** Move `PlayabilityMatrix` component to the top of the detail view (below Hero) on Mobile only (`order-last md:order-first`).
*   **Where:** `components/console/ConsoleDetailView.tsx`.

### 5.2 "Simple Mode" Toggle
*   **Why:** Reduces cognitive load.
*   **How:** Context state `useMode`. If `simple`, hide `Clock Speed`, `Process Node`, `TDP`. Show only `Screen Size`, `Battery Life`, `Playable Systems`.
*   **Where:** `components/context/ViewModeContext.tsx`, `components/console/SpecGrid.tsx`.

### 5.3 Shareable Comparisons
*   **Why:** Social currency.
*   **How:** Parse URL query params `/arena?c1=deck&c2=ally`. On load, pre-fill the `QuickCompare` state.
*   **Where:** `app/arena/page.tsx` (`useSearchParams`).

### 5.4 Visual Size Comparison
*   **Why:** "198mm" is abstract.
*   **How:** Render a static SVG outline of a credit card or iPhone 15 next to the console outline (using `width_mm` to scale).
*   **Where:** `components/arena/SizeComparator.tsx` (New).

### 5.5 Real World Battery
*   **Why:** "5000mAh" means nothing if the chip is inefficient.
*   **How:** Backend calculation: `battery_wh / tdp_wattage = approx_hours`. Display "Est. 3-5 Hours".
*   **Where:** `components/console/BatteryGauge.tsx` (New), `lib/utils/calculations.ts`.

### 5.6 Dark Mode Default
*   **Why:** It's a "Cyberpunk" site. Light mode might look broken if not tested.
*   **How:** Hardcode `class="dark"` in `layout.tsx` (already done). Ensure no accidental white backgrounds exist in `globals.css`.
*   **Where:** `app/layout.tsx`.

---

## 6. SEO

### 6.1 Dynamic Metadata
*   **Why:** Google sees "Retro Circuit" for every page.
*   **How:** Export `generateMetadata({ params })` in the console page. Fetch console name. Return `{ title: "${console.name} Specs & Price" }`.
*   **Where:** `app/consoles/[slug]/page.tsx`.

### 6.2 JSON-LD Product Schema
*   **Why:** Rich Snippets (Price, Star Rating in search results).
*   **How:** Inject a `<script type="application/ld+json">` with `{ "@type": "Product", "name": console.name ... }`.
*   **Where:** `app/consoles/[slug]/page.tsx`.

### 6.3 Sitemap Priorities
*   **Why:** Tell Google what matters.
*   **How:** In `sitemap.ts`, set `priority: 1.0` for `published` consoles released in the last 6 months.
*   **Where:** `app/sitemap.ts`.

### 6.4 Internal Linking
*   **Why:** Spreads "link juice".
*   **How:** Add a "Similar Consoles" section at the bottom of `ConsoleDetailView` linking to 3 other devices with similar tags/price.
*   **Where:** `components/console/RelatedConsoles.tsx` (New).

### 6.5 Alt Text Strategy
*   **Why:** Accessibility + Image Search SEO.
*   **How:** Append descriptors: `alt={`${console.name} Handheld Console - Front View`}`.
*   **Where:** `components/landing/FeaturedConsoles.tsx`.

### 6.6 Canonical URLs
*   **Why:** Prevent duplicate content penalties (www vs non-www).
*   **How:** In `metadataBase` (layout.tsx), ensure the URL is the production domain.
*   **Where:** `app/layout.tsx`.

### 6.7 Core Web Vitals (LCP)
*   **Why:** Speed = Ranking.
*   **How:** The Hero image is large. Ensure it's preloaded and uses `priority` (already done, but verify format is AVIF/WebP).
*   **Where:** `components/landing/LandingPage.tsx` (`<Image priority />`).

---

## 7. Accessibility (A11y)

### 7.1 Keyboard Navigation
*   **Why:** Power users and disabled users rely on it.
*   **How:** In `ConsoleSearch`, handle `onKeyDown`. If `ArrowDown`, change active index state. If `Enter`, select active.
*   **Where:** `components/arena/ConsoleSearch.tsx`.

### 7.2 Color Contrast
*   **Why:** Grey-on-Black is hard to read.
*   **How:** Use a contrast checker. Darken the background of tooltips or lighten the `text-zinc-500` to `text-zinc-400`.
*   **Where:** `styles/globals.css` (Colors), `tailwind.config.js`.

### 7.3 ARIA Labels
*   **Why:** Screen readers need to know what "ArrowRight" icon does.
*   **How:** Add `aria-label="Next Page"` or `aria-label="Compare Consoles"` to icon-only buttons.
*   **Where:** `components/landing/QuickCompare.tsx`, `components/layout/MobileTopBar.tsx`.

### 7.4 Visible Focus
*   **Why:** You can't navigate if you can't see where you are.
*   **How:** Add `focus-visible:ring-2 focus-visible:ring-violet-500` to all interactive elements.
*   **Where:** Global CSS or specific component classes.

---

## 8. DevOps / SRE

### 8.1 Sentry Integration
*   **Why:** You need to know when users crash.
*   **How:** `npx @sentry/wizard@latest -i nextjs`. Wrap `next.config.mjs`.
*   **Where:** `sentry.client.config.ts`, `sentry.server.config.ts`.

### 8.2 Database Backups (PITR)
*   **Why:** Accidental `DELETE FROM consoles` without `WHERE` clause.
*   **How:** Enable Point-in-Time Recovery in Supabase Dashboard (Pro Plan feature).
*   **Where:** Supabase Dashboard -> Database -> Backups.

### 8.3 CI/CD Pipeline Checks
*   **Why:** Prevent bad code from reaching prod.
*   **How:** Add a `.github/workflows/ci.yml` file that runs `pnpm lint` and `pnpm build` on every PR.
*   **Where:** `.github/workflows/ci.yml` (New).

### 8.4 Env Var Validation
*   **Why:** Fail fast if keys are missing.
*   **How:** Create `env.mjs` using `t3-env` or `zod`. Import env vars from there, not `process.env`.
*   **Where:** `env.mjs` (New), `next.config.mjs`.

### 8.5 On-Demand Revalidation
*   **Why:** 60s wait is annoying for editors.
*   **How:** Add an API route `/api/revalidate?secret=...`. Call it from the Admin "Save" function.
*   **Where:** `app/api/revalidate/route.ts`, `components/admin/ConsoleForm.tsx`.

---

## 9. Content Strategy

### 9.1 "Best Of" Lists
*   **Why:** High volume keywords ("Best Retro Handheld 2024").
*   **How:** Create a static page `/best-retro-handhelds` that queries the top rated items.
*   **Where:** `app/(content)/best-retro-handhelds/page.tsx` (New).

### 9.2 YouTube Embeds
*   **Why:** Keeps users on page longer.
*   **How:** Add `video_review_url` to DB. Use `lite-youtube-embed` package for performance.
*   **Where:** `components/console/MediaGallery.tsx` (New).

### 9.3 Public Changelog
*   **Why:** Shows the project is alive.
*   **How:** Simple markdown file rendered at `/changelog`.
*   **Where:** `app/changelog/page.tsx`.

---

## 10. Community

### 10.1 "Verified Owner" Badge
*   **Why:** Trust.
*   **How:** Users upload a photo of the device with a handwritten note (username). Admin approves.
*   **Where:** `app/profile/page.tsx`.

### 10.2 User Photos ("Battlestations")
*   **Why:** Visual variety.
*   **How:** Add `user_images` table. Allow upload in `ConsoleDetailView` (if logged in).
*   **Where:** `components/console/CommunityGallery.tsx` (New).

### 10.3 Report Error
*   **Why:** Crowdsourced QA.
*   **How:** Simple modal form sending a row to `data_corrections` table.
*   **Where:** `components/console/SpecGrid.tsx` (Footer).

### 10.4 Discord Widget
*   **Why:** Funnel users to community.
*   **How:** Use the standard Discord HTML widget or just a dynamic member count API.
*   **Where:** `components/layout/Footer.tsx`.

---

## 11. Legal

### 11.1 Affiliate Disclosure
*   **Why:** FTC requirement.
*   **How:** Add a global footer text: "Retro Circuit is a participant in the Amazon Services LLC Associates Program..."
*   **Where:** `components/layout/Footer.tsx`.

### 11.2 Cookie Consent
*   **Why:** GDPR/CCPA.
*   **How:** Use a library like `react-cookie-consent`. "We use cookies for analytics."
*   **Where:** `app/layout.tsx`.

### 11.3 Liability Disclaimer
*   **Why:** Protect against lawsuits if a user bricks their device.
*   **How:** Add to `/terms`: "Information provided 'as is'. We are not responsible for hardware damage..."
*   **Where:** `app/terms/page.tsx`.

---

## 12. Mobile

### 12.1 PWA (Install Prompt)
*   **Why:** Retention.
*   **How:** Listen for `beforeinstallprompt` event. Show a custom "Install App" button.
*   **Where:** `components/layout/InstallPrompt.tsx` (New).

### 12.2 Swipe Gestures
*   **Why:** Native feel.
*   **How:** Use `react-swipeable` or `framer-motion` drag gestures on the image gallery.
*   **Where:** `components/console/ImageGallery.tsx`.

### 12.3 Haptic Feedback
*   **Why:** Tactile satisfaction.
*   **How:** `if (navigator.vibrate) navigator.vibrate(50);` on button clicks.
*   **Where:** `lib/hooks/useHaptic.ts` (New).

### 12.4 Viewport Meta
*   **Why:** iOS keyboard breaks layout.
*   **How:** `interactive-widget=resizes-content` in metadata.
*   **Where:** `app/layout.tsx`.
