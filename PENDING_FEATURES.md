# Pending Features Backlog

This document organizes all pending features, improvements, and ideas into functional categories, prioritized by impact.

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
- [ ] **"Highlight Differences" Toggle**: A control to only show rows where specs differ, with color-coding (Green/Red) for better/worse stats.
- [ ] **Shareable Comparison URLs**: Generate permalinks like `/arena?c1=deck&c2=ally` that pre-fill the comparison state for easy sharing.

### 🟢 Nice to Have
- [ ] **Visual Size Comparison**: Render a static SVG outline of a common object (Credit Card, iPhone) next to the console outline using `width_mm`.
- [ ] **Export as Image/PDF**: Allow users to download the comparison card for offline sharing.
- [ ] **"Glitch" Effects**: Add a CSS glitch effect to the "VS" circle on hover.

---

## 3. Monetization & Growth
*Focus: Revenue generation and user retention.*

### 🔴 Critical
- [ ] **Affiliate Integration**: Add `affiliate_amazon` and `affiliate_aliexpress` columns to the DB and implement a high-contrast `BuyButton` component.

### 🟡 Must Have
- [ ] **Price History & Tracking**: Create a `price_history` table and display a Sparkline chart (6-month trend) with a "Best Time to Buy" indicator.
- [ ] **Email Capture System**: Add "Notify when Released" buttons and "Price Drop Alerts" to capture user emails (Mailchimp/Resend integration).
- [ ] **Legal Disclosures**: Add "Amazon Associate" and other affiliate disclosures to the Footer.

### 🟢 Nice to Have
- [ ] **Pro / Premium Membership**: Stripe integration for an ad-free experience, unlimited comparisons, and advanced price alerts.
- [ ] **Sponsored Spots**: Logic to pin sponsored devices to the top of lists with an `is_sponsored` flag.
- [ ] **Merch Store Link**: Link to an external store (Shopify/Teespring) in the Nav/Footer.

---

## 4. Content & SEO
*Focus: Organic traffic and authority.*

### 🔴 Critical
- [ ] **Dynamic Metadata & JSON-LD**: Implement `generateMetadata` for console pages to create unique titles/descriptions. Inject `Product` Schema for Google Rich Snippets.
- [ ] **Sitemap Priorities**: Update `sitemap.ts` to prioritize published/new consoles (`priority: 1.0`).

### 🟡 Must Have
- [ ] **"Best Of" Static Pages**: Create high-value SEO landing pages like "Best Handhelds under $200", "Best for PS2 Emulation".
- [ ] **System Analysis (SEO Spine)**: Ensure every console page has an 80-120 word unique description covering use-case, strengths, and limitations.
- [ ] **Internal Linking**: Add a "Similar Consoles" section at the bottom of Detail Views to spread link equity.

### 🟢 Nice to Have
- [ ] **Public Changelog**: A `/changelog` page to show active development and build trust.
- [ ] **News / Blog Section**: A simple CMS for "Latest Intel" articles and news updates.
- [ ] **Social Sharing Cards (OG)**: Use `@vercel/og` to generate dynamic images for comparison pages (e.g., showing both consoles in the preview image).

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
