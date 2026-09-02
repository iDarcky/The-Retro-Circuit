# Pending Features Backlog

This document organizes all pending features, improvements, and ideas into functional categories, prioritized by impact.

**Last reconciled against the codebase 2026-09-02.** Shipped items are struck through with
a one-line note rather than deleted, so the same feature does not get proposed twice.

**Priorities:**
1.  🔴 **Critical** (Immediate value, fixes broken things, or primary missing features)
2.  🟡 **Must Have** (Core value proposition, revenue drivers, significant UX improvements)
3.  🟢 **Nice to Have** (Polish, "Wow" factor, long-term goals)

---

## 1. Search & Discovery
*Focus: Helping users find the right device efficiently.*

### 🔴 Critical
- [ ] **Game-Based Search Engine**: Index `emulation_profiles` to allow searching by games ("God of War", "Pokemon Emerald") and systems ("PS2", "GameCube"). *Currently missing 60-80% of user intent.*
- [ ] **"No Results" Empty State**: Design a helpful component for when search yields no results (e.g., "System Not Found", "Request This Device" link) instead of a blank screen.

### 🟡 Must Have
- [ ] **Advanced Filters**: Implement filters for Price Range ($0-$800), Manufacturer, CPU Generation, RAM (4GB, 8GB, etc.), OS (Android, Linux, Windows), and Release Year.
- [ ] **Smart Sorting**: Add sort options for Price (Low/High), Performance (Benchmark Score), Newest First, and Most Compared.
- [ ] **Keyboard Navigation**: Implement `ArrowDown` / `Enter` support in the search dropdown for power users.

### 🟢 Nice to Have
- [ ] **"Simple Mode" Toggle**: A context toggle to hide technical specs (Clock Speed, TDP) for casual users, showing only "Playable Systems", Screen Size, and Battery.
- [ ] **"Finder" to Email Capture**: At the end of a search/finder result, offer to email updates when better options release.

---

## 2. Core Comparison Engine (VS Mode)
*Focus: The "Arena" experience and decision-making tools.*

### 🔴 Critical
- [ ] **3+ Device Comparison**: Expand `/arena` to support side-by-side comparison of 3-4 devices (currently limited to 2). Update routing to `/arena/[...slugs]`.

### 🟡 Must Have
- [ ] **"Highlight Differences" Toggle**: A control to only show rows where specs differ, with color-coding (Green/Red) for better/worse stats. *Partly done: `VariantGuide` on the console page already shows only the rows that differ between configurations. The Arena itself still shows everything.*
- [x] ~~**Shareable Comparison URLs**~~ — shipped as path segments, not query params: `/arena/[a]-vs-[b]`, alphabetically canonicalised. A variant-level form `console~variant` addresses one configuration. 551 pairs prebuilt (`lib/arena/pairs.ts`), the rest render on demand.

### 🟢 Nice to Have
- [ ] **Visual Size Comparison**: Render a static SVG outline of a common object (Credit Card, iPhone) next to the console outline using `width_mm`.
- [ ] **Export as Image/PDF**: Allow users to download the comparison card for offline sharing.
- [ ] **"Glitch" Effects**: Add a CSS glitch effect to the "VS" circle on hover.

---

## 3. Monetization & Growth
*Focus: Revenue generation and user retention.*

### 🔴 Critical
- [x] ~~**Affiliate Integration**~~ — done differently and better: no per-row affiliate columns, because a stored tagged URL rots and can be pasted with someone else's tag. `lib/affiliate.ts` is the single place the `theretrocircu-20` tag is applied, and `pickBuyTarget` chooses a real vendor listing over an Amazon search. **AliExpress has no programme wired up yet** and it is the largest channel in the data — see the playbook.
- [ ] **Approved buy paths on the published catalogue**: 52 of 78 published consoles have no ASIN and no approved vendor link, so their buy button falls back to an Amazon search for a device Amazon often does not stock. `/admin/buy-links` and `/admin/links` are the two tools; this is data work now, not code.

### 🟡 Must Have
- [ ] **Price History & Tracking**: Create a `price_history` table and display a Sparkline chart (6-month trend) with a "Best Time to Buy" indicator.
- [ ] **Email Capture System**: Add "Notify when Released" buttons and "Price Drop Alerts" to capture user emails (Mailchimp/Resend integration).
- [x] ~~**Legal Disclosures**~~ — `AffiliateDisclosure` on the console page plus a footer line.

### 🟢 Nice to Have
- [ ] **Pro / Premium Membership**: Stripe integration for an ad-free experience, unlimited comparisons, and advanced price alerts.
- [ ] **Sponsored Spots**: Logic to pin sponsored devices to the top of lists with an `is_sponsored` flag.
- [ ] **Merch Store Link**: Link to an external store (Shopify/Teespring) in the Nav/Footer.

---

## 4. Content & SEO
*Focus: Organic traffic and authority.*

### 🔴 Critical
- [x] ~~**Dynamic Metadata & JSON-LD**~~ — `Product` + `AggregateOffer` + `BreadcrumbList`. `availability` comes from `release_status`; deriving it from ASIN presence had been marking 64 released consoles `Discontinued`. Never add a self-assigned `aggregateRating`.
- [ ] **Sitemap Priorities**: Update `sitemap.ts` to prioritize published/new consoles (`priority: 1.0`). *Arena, facet and best-of URLs are now all in the sitemap; the priorities are still flat.*

### 🟡 Must Have
- [x] ~~**"Best Of" Static Pages**~~ — `/best/[slug]`, 8 guides driven by filter+rank functions over live data (`lib/bestof/collections.ts`), so they re-rank themselves as the catalogue changes.
- [ ] **System Analysis (SEO Spine)**: 10 published consoles still have no description. `buildSummary` in `lib/scoring/verdict.ts` drafts the factual half from the emulation matrix — **the opinionated half must be human-written**, do not mass-generate device reviews.
- [x] ~~**Internal Linking**~~ — "Similar hardware" and "How it stands" are one section at the bottom of every console page, plus per-step configuration comparison links and facet pages.
- [ ] **Facet pages beyond chip/os/vendor**: price band and screen size are the obvious next two (`lib/config/facets.ts` takes a new entry with a column and two label functions).

### 🟢 Nice to Have
- [ ] **Public Changelog**: A `/changelog` page to show active development and build trust.
- [ ] **News / Blog Section**: A simple CMS for "Latest Intel" articles and news updates.
- [x] ~~**Social Sharing Cards (OG)**~~ for console pages — `/consoles/[slug]/opengraph-image`, prerendered. *Still to do: the Arena equivalent, splitting the card between the two devices.*
- [ ] **JPEG derivative on upload**: Satori cannot decode WebP and the uploader writes WebP, so OG cards currently fall back to a typographic layout instead of showing the device.

---

## 5. Community & Engagement
*Focus: User contributions and social proof.*

### 🟡 Must Have
- [ ] **User Reviews & Ratings**: Database table for `reviews`. UI for Star Ratings and short comments.
- [ ] **Community Playability Voting**: Allow logged-in users to vote on game performance ("Playable", "Struggles", "No-Go").

### 🟢 Nice to Have
- [ ] **"Battlestations" Gallery**: Allow users to upload photos of their setups/devices.
- [ ] **"Verified Owner" Badges**: Verification system for users who prove ownership.
- [ ] **Discord Widget**: A live community widget in the footer.
- [ ] **Shareable "Hot Take" Cards**: One-click generation of "Steam Deck > Ally" images for social media.

---

## 6. UI/UX & Design
*Focus: Usability, accessibility, and the "Swiss" aesthetic.*

### 🔴 Critical
- [ ] **Mobile Usability Fixes**: Increase mobile text size from `10px` to `12px`. Ensure touch targets are at least 44x44px.
- [ ] **Viewport Management**: Add `interactive-widget=resizes-content` to `layout.tsx` to fix iOS keyboard layout shifts.
- [ ] **Dark Mode Integrity**: Ensure `class="dark"` is enforced and no white flashes occur on load.

### 🟡 Must Have
- [ ] **Loading States**: Implement Skeleton screens for all data-fetching components to improve perceived performance.
- [ ] **Focus States**: Ensure visible focus rings (`ring-violet-500`) for keyboard navigation accessibility.
- [ ] **Real-World Battery Gauge**: Display "Est. 3-5 Hours" based on `battery_wh / tdp` calculation, not just mAh.

### 🟢 Nice to Have
- [ ] **Haptics**: Add `navigator.vibrate` to key interactions (like the "Fight" button).
- [ ] **"Swiss Design" Polish**: Standardize all grid gaps and strictly enforce the design system (squares, minimal borders).
- [ ] **Custom Scrollbars**: Style WebKit scrollbars to match the dark theme.

---

## 7. Technical & Infrastructure
*Focus: Stability, security, and performance.*

### 🔴 Critical
- [ ] **Security: Middleware Auth Bypass**: Fix the `isPlaceholder` logic in `middleware.ts` to prevent unauthorized access.
- [ ] **Security: RLS Policies**: Verify Row Level Security policies to ensure only admins can modify `consoles` data.

### 🟡 Must Have
- [ ] **Performance: Image Optimization**: Audit `FeaturedConsoles` and others to use proper `sizes` props and AVIF/WebP formats.
- [ ] **Error Monitoring**: Integrate Sentry for client/server error tracking.
- [ ] **Database Backups**: Enable Point-in-Time Recovery (PITR) in Supabase.
- [ ] **Type Safety**: Strictly define `ConsoleFormData` with Zod to match the DB schema and avoid `any` types.

### 🟢 Nice to Have
- [ ] **CI/CD Pipeline**: Set up GitHub Actions for automated linting and build verification.
- [ ] **Server Actions Migration**: Move `addConsole`/`updateConsole` logic to Server Actions for better security and type safety.
- [ ] **Dead Code Removal**: Cleanup unused files like `lib/utils.ts` if confirmed empty.

---

## 8. Agent Recommendations
*Focus: Security, modern web standards (PWA), and developer experience.*

### 🔴 Critical
- [ ] **Rate Limiting (API Protection)**: Implement `upstash/ratelimit` or similar on search and form endpoints to prevent abuse and DoS.
- [ ] **Liability Disclaimer Page**: Create a clear Terms/Disclaimer page stating "The Retro Circuit is not responsible for hardware damage from overclocking/modding".

### 🟡 Must Have
- [ ] **PWA & Install Prompt**: Add `manifest.json` and `ios-pwa-splash` to allow users to "Install" the site as an app. This aligns with the "Launcher" vision.
- [ ] **Environment Variable Validation**: Use `t3-env` or `zod` to fail the build immediately if `NEXT_PUBLIC_SUPABASE_URL` or other keys are missing.
- [ ] **Command Palette (`Cmd+K`)**: Implement a global command menu for power users to navigate Consoles, VS Mode, and Settings instantly.

### 🟢 Nice to Have
- [ ] **Internationalization (i18n) Readiness**: Scaffold the project with `next-intl` to support future Brazilian/SEA markets without a full rewrite.
- [ ] **Living Design System**: Create a hidden `/design` route that displays all buttons, badges, and typestyles to ensure "Swiss" consistency.

---

## 9. Finder Engine
*Merged from the former `FINDERIDEAS.md`. Scoring behaviour itself is documented in
`docs/FINDER_RESULTS.md`.*

### 🟡 Must Have
- [ ] **Absolute dealbreakers**: the quiz treats almost everything as a weighting multiplier. Add a "must-have" step (HDMI out, hall-effect sticks) that drops non-matching consoles to a `0.0` tier-fit rather than merely down-weighting them.
- [ ] **Contradiction catching**: a user can pick "Modern PC Gaming (Steam)" then "Under $60" and get a confusing 8-bit result. Warn between questions instead of silently rescoring.
- [ ] **"Why we picked this" explainer**: replace "95% match" with a sentence naming the specific reason, drawn from the score matrix.

### 🟢 Nice to Have
- [ ] **Aspect-ratio preference**: ask which systems they will actually play, then boost consoles whose `aspect_ratio` genuinely suits them — 1:1 is superb for Pico-8 and poor for PSP.
- [ ] **Feedback loop**: track which recommendation people actually click. If the engine ranks Odin 2 first but users pick the Retroid, the value multiplier for that persona is wrong.

---

## 10. Accessibility
*From the March 2026 parallel audit — the only role the main audit did not cover.*

### 🟡 Must Have
- [ ] **Keyboard navigation**: the `ConsoleSearch` dropdown cannot be driven by keyboard. Arrow keys to move, Enter to select.
- [ ] **Visible focus ring**: `outline-none` in `ConsoleSearch` removes the native ring without replacing it.
- [ ] **Screen-reader labels**: icon-only buttons (VS, social) need `aria-label`.

### 🟢 Nice to Have
- [ ] **Contrast pass**: `text-zinc-500` on black is borderline for WCAG AA.
- [ ] **Reduced motion**: wrap marquee and pulse animations in `prefers-reduced-motion`.

---

## 11. Legal, Mobile & Operations
*Also from the March 2026 parallel audit. Items already shipped are omitted — the affiliate
disclosure, terms page and rate limiting all exist now.*

### 🟡 Must Have
- [ ] **Cookie consent**: required before AdSense, and before analytics in the EU.
- [ ] **Image rights**: confirm console images are press-kit or fair use; add a takedown contact.
- [ ] **Error monitoring**: no Sentry or equivalent — client-side crashes in the Arena and Finder are currently invisible.
- [ ] **Verify Supabase PITR** is enabled on production.

### 🟢 Nice to Have
- [ ] **Install prompt** for Android (the manifest already exists).
- [ ] **Swipe between consoles** in the Arena on touch devices.
- [ ] **Report an error** button on every spec sheet — enthusiasts genuinely enjoy correcting data, and it is free QA.
- [ ] **Save-Data awareness**: serve lower-resolution images when `navigator.connection.saveData` is set.
