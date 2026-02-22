# THE CIRCUIT: 40-DAY LAUNCH ROADMAP

This roadmap consolidates the audit findings into an actionable 40-day sprint plan. The goal is to elevate the platform from "Pre-Alpha" to a revenue-generating, community-ready "Version 1.0".

---

## 0. EXECUTIVE SUMMARY

### Biggest Missing Feature: **"Game-Based Search"**
*   **Problem:** Users search for *"Can it play God of War?"* or *"Pokemon Emerald"*. Currently, the search only understands *"Retroid Pocket 4"*. You are losing 60-80% of casual search intent.
*   **Fix:** Index the `emulation_profiles` table. When a user types "PS2", show consoles with `ps2_state = 'perfect'`.

### Biggest Easy Win: **SEO Metadata & JSON-LD**
*   **Problem:** Google sees "The Retro Circuit" for every page.
*   **Fix:** Dynamic metadata (`title: "Retroid Pocket 4 Specs"`) takes <2 hours to implement but instantly boosts organic traffic and click-through rates (CTR).

---

## PHASE 1: STABILITY & TRUST (DAYS 1-7)
*Focus: Fixing critical bugs, security holes, and mobile usability.*

### Day 1-2: Security & Architecture
- [ ] **CRITICAL:** Fix `middleware.ts` auth bypass. Remove the "placeholder" logic check.
- [ ] **Security:** Verify Row Level Security (RLS) policies for `consoles` table (prevent unauthorized edits).
- [ ] **Cleanup:** Remove unused `lib/utils.ts` and dead code.
- [ ] **Linting:** Set `exhaustive-deps` to "error" and fix the resulting build warnings.

### Day 3-4: Mobile Usability (The "Thumb" Test)
- [ ] **Text Size:** Bump all `text-[10px]` to `text-xs` (12px) in `MobileTopBar` and `LandingPage` pills.
- [ ] **Touch Targets:** Increase "Menu" and "Search" icon hit areas to 44x44px.
- [ ] **Viewport:** Add `interactive-widget=resizes-content` to `layout.tsx` to fix iOS keyboard layout shifts.

### Day 5-7: Core Search Fixes
- [ ] **Empty State:** Design a "No Results Found" component for `ConsoleSearch` (don't just show nothing).
- [ ] **Keyboard Nav:** Implement ArrowDown/Enter support in the search dropdown.
- [ ] **Focus States:** Add visible focus rings (`focus-visible:ring-violet-500`) for accessibility.

---

## PHASE 2: REVENUE & CORE FEATURES (DAYS 8-20)
*Focus: Monetization, "Game-Based Search", and comparing devices.*

### Day 8-10: The "Game Search" Engine
- [ ] **Backend:** Update `supabase/queries` to join `consoles` with `emulation_profiles`.
- [ ] **Frontend:** Update `ConsoleSearch` to accept a `type` filter (System vs. Console).
- [ ] **UI:** Display "Plays PS2 Perfectly" badge in the search result dropdown.

### Day 11-14: Affiliate Monetization
- [ ] **Database:** Add `affiliate_amazon` and `affiliate_aliexpress` columns.
- [ ] **UI:** Create a high-contrast `BuyButton` component in `ConsoleDetailView`.
- [ ] **Legal:** Add "Amazon Associate" disclosure to the Footer.

### Day 15-17: "VS" Mode Expansion
- [ ] **Routing:** Update `/arena/[...slugs]` to handle 3+ devices.
- [ ] **UI:** Refactor `QuickCompare` to support a 3rd "Player" slot on desktop.
- [ ] **Shareability:** Add a "Copy Link" button that generates the exact comparison URL.

### Day 18-20: SEO Overhaul
- [ ] **Dynamic Metadata:** Implement `generateMetadata` in `app/consoles/[slug]/page.tsx`.
- [ ] **Structured Data:** Inject `JSON-LD` Product Schema for Google Rich Snippets.
- [ ] **Sitemap:** Bump priority of "Published" consoles to `1.0`.

---

## PHASE 3: ENGAGEMENT & CONTENT (DAYS 21-30)
*Focus: Keeping users on the site longer.*

### Day 21-23: User Reviews (MVP)
- [ ] **Database:** Create `reviews` table (`console_id`, `rating`, `comment`).
- [ ] **UI:** Add a simple "Star Rating" component to `ConsoleDetailView`.
- [ ] **Submission:** Allow users to submit a rating (requires Auth).

### Day 24-26: News & Content
- [ ] **CMS:** Build a simple "Post Editor" in `/admin/news`.
- [ ] **Frontend:** Build the `/news` page and a "Latest Intel" widget on the Homepage.
- [ ] **Strategy:** Write 3 "Pillar" articles: "Best Under $100", "Steam Deck vs Ally", "Starter Guide".

### Day 27-30: Social Sharing (OG Images)
- [ ] **API:** Create `api/og` route using `@vercel/og`.
- [ ] **Design:** Create a template that dynamically renders two consoles facing off.
- [ ] **Testing:** Verify the cards look good on Twitter/Discord.

---

## PHASE 4: POLISH & LAUNCH (DAYS 31-40)
*Focus: Performance, Analytics, and "Wow" factor.*

### Day 31-33: Performance Tuning
- [ ] **Images:** Audit `FeaturedConsoles` images. Implement proper `sizes` prop.
- [ ] **Fonts:** Ensure `Inter` and `JetBrains Mono` are subsetted correctly.
- [ ] **Bundle:** Analyze build output. Lazy load heavy components (like the "Arena" charts).

### Day 34-36: The "Wow" Factor (Micro-Interactions)
- [ ] **Haptics:** Add `navigator.vibrate` to "Fight" buttons.
- [ ] **Sound:** (Optional) Re-introduce *very subtle* UI sounds (mute by default) for the "Cyberpunk" feel? (User previously removed audio, reconsider if high quality).
- [ ] **Glitch Effects:** Add a CSS glitch effect to the "VS" circle on hover.

### Day 37-39: Final QA & Analytics
- [ ] **Tracking:** Set up PostHog or plausible.io (privacy-friendly).
- [ ] **Error Monitoring:** Install Sentry.
- [ ] **Cross-Browser:** Test on Safari (iOS), Chrome (Android), and Firefox.

### Day 40: LAUNCH 🚀
- [ ] **Submission:** Submit sitemap to Google Search Console.
- [ ] **Social:** Announce on Reddit (r/SBCGaming), Discord, and Twitter.
- [ ] **Email:** Send "System Online" email to the waiting list.

---

## NITPICKS & "BIG PICTURE" IDEAS

### Small Nitpicks (The 1%)
1.  **Scrollbars:** Custom scrollbars in WebKit browsers (Chrome/Safari) to match the dark theme. The default white bar breaks immersion.
2.  **Selection Color:** Change `::selection` color to `bg-violet-500 text-white` (already in Tailwind, verify it works globally).
3.  **404 Page:** Make the 404 page a "Blue Screen of Death" or a "Connection Lost" terminal interface.
4.  **Favicon:** Ensure the favicon is visible in Dark Mode tabs (avoid black-on-black).

### Big Picture (Strategy)
1.  **"The Steam of Handhelds":** Become the *launcher*. In the future, could you distribute "Setup Scripts" that configure the device automatically?
2.  **Partnerships:** Reach out to Retro Game Corps or Taki Udon. Offer them a "Verified Reviewer" badge or a dedicated "Recommended by RGC" section.
3.  **Marketplace:** Eventually, allow users to sell used handhelds to each other (P2P).

---

## FUTURE AUDITS (Post-Launch)

1.  **Load Testing Audit:** Can the site handle the "Reddit Hug of Death"? (Use k6 or Artillery).
2.  **Legal Compliance Audit:** Detailed review of GDPR, CCPA, and Affiliate disclosures by a professional.
3.  **Localization Audit:** The handheld market is huge in Brazil and Southeast Asia. Is the UI ready for translation (i18n)?
