# The Retro Circuit — Full Product Audit (Claude)

**Date:** 7 March 2026  
**Stage:** Pre-Alpha 0.5.5  
**Site:** [theretrocircuit.com](https://theretrocircuit.com)  
**Context:** Solo PM, no engineering background, shipped entirely via AI agents. 66 consoles, 136 variants catalogued.

---

## 1. CEO / Founder — 5/10

### What is working
- The niche is real. The retro handheld market is exploding and genuinely confusing. Hundreds of devices from Chinese OEMs with overlapping model names, silent hardware revisions, and no standardised specs. There is a legitimate gap for a structured database.
- The positioning as "raw signal, no feelings, just data" is sharp and differentiated. You are not trying to be a reviewer. You are trying to be the PCPartPicker of retro handhelds. That is a defensible concept.
- Affiliate revenue via Amazon Associates is the correct first monetisation path given the product type.

### What is broken or missing
- **There is no business yet.** The affiliate pipeline is scaffolded (`amazon_asin` column exists, `BuySection` component exists) but the "Check Availability" button on every console detail page currently shows `[ NO LIVE DATA FEEDS ]`. This means every user who arrives with buying intent — your highest-value visitor — hits a dead end. You are spending effort on the database while the one feature that generates revenue is empty.
- **You have no audience capture.** No email list, no newsletter signup, no push notifications, no RSS feed. Every visitor who leaves is gone forever. You are building on rented land (Google organic) with no way to bring people back.
- **You are over-investing in depth, under-investing in breadth.** 136 variants across 66 consoles is impressive data work, but the site has zero editorial content. No "best of" lists, no buying guides, no news commentary. These are the pages that actually rank on Google and drive affiliate clicks.

### Fix first
**Ship a working "Buy Now" affiliate link for at least the top 20 consoles.** Nothing else matters if the revenue mechanism is broken. Even a hardcoded Amazon search URL (`amazon.com/s?k=Retroid+Pocket+5`) is better than `NO LIVE DATA FEEDS`.

---

## 2. Product Manager — 7/10

### What is working
- The information architecture is clean: Consoles (database), Fabricators (brands), Finder (quiz), Arena (compare). Four core jobs, four sections. Easy to reason about.
- The Finder quiz is a genuine product insight. Asking "What best describes you?" with archetypes like "Nostalgia Hunter" and "Performance Chaser" is exactly the right framing for overwhelmed buyers. Most competitor sites force you to know what you want before you start.
- `generateStaticParams` on console pages means they are statically generated at build time — fast loads, good for SEO. The slug resolution logic (`resolveConsoleSlug`) handles both legacy short slugs and new manufacturer-prefixed slugs gracefully.
- The variant system is well-modelled. One console → N variants, each with their own specs. This accurately reflects how products like the Miyoo Mini (V1/V2/V4) actually ship.

### What is broken or missing
- **The Finder is explicitly labelled "work in progress."** Your most differentiated feature has a warning banner telling users not to trust it. For a pre-alpha launch, this is acceptable. But it means your single strongest conversion tool is operating at reduced credibility.
- **The console detail page is dense but passive.** It presents 50+ spec fields across tech, playability, and buy sections — but offers no interpretation. A user sees "Allwinner A133 Plus" and "Helio G99" and has no idea what that means for their use case. There is no "what can this device actually play?" summary in plain language.
- **The "Emulation Tier" system (Tier 1–5) is opaque.** I see "TIER 5" on the KinHank K59 detail page with a `[DETAILS]` button, but the tier label on its own is meaningless to a first-time visitor. What is Tier 5? Better than Tier 3? In which direction?
- **The Arena comparison tool requires you to already know which two devices to compare.** If you don't know, you have to go back to the Finder or browse. There is no "suggest a comparison" entry point.

### Fix first
**Add a one-paragraph "What Can This Play?" plain-English summary to every console detail page**, derived from the emulation profile data you already have. Turn `ps1_state: 'perfect'` and `n64_state: 'playable'` into "Plays PS1 perfectly. N64 is playable with some frame drops. Don't expect PS2."

---

## 3. First-Time User — 7/10

### What is working
- I landed on the homepage and within 5 seconds I understood: this is a database of retro handhelds where I can browse, compare, and get recommendations. The hero copy is tight: "Explore detailed specifications, compare hardware, and find your perfect handheld."
- The "66 CONSOLES & 136 VARIANTS ARCHIVED" counter gives immediate credibility. This isn't a blog with five reviews — it's comprehensive.
- The navigation is minimal and scannable: Consoles, Fabricators, VS Mode, News. No dropdown menus, no hamburger hell.
- The "Finder" quiz is genuinely fun. The archetypes feel relatable and the step-by-step flow is not overwhelming.

### What is broken or missing
- **The pixel-art console images are a style choice that actively hurts usability.** When I'm considering spending $163 on a KinHank K59, I want to see what it actually looks like — the screen quality, the button layout, the build material. Pixel art renders make every device look like a retro sprite, which is charming but removes the visual information I need to make a buying decision.
- **The "SYSTEM ONLINE // PRE-ALPHA 0.5.5" badge and "DECRYPTING SIGNAL" loading text are alienating.** I came here to buy a Game Boy clone, not hack the Pentagon. The theming is fun for the builder but potentially confusing for a non-technical audience.
- **There is no obvious "Help me choose" CTA above the fold on mobile.** The Finder quiz is buried in the second section. The primary CTA is "Browse Consoles" which is the worst starting point for a confused buyer.

### Fix first
**Move the Finder CTA to equal visual prominence with "Browse Consoles" on the homepage hero.** The confused buyer who doesn't know what they want is your most valuable user — they're the ones who will use the Finder and end up clicking an affiliate link.

---

## 4. Marketing / Growth — 3/10

### What is working
- The site name and branding are memorable. "The Retro Circuit" with the flashing cursor is a strong identity.
- OpenGraph images and Twitter cards are properly configured. Sharing a console page on Twitter/Discord will look professional.
- The About/Manifesto page is surprisingly compelling. "In a sea of subjective noise, we provide the raw signal. No feelings. Just data." is a legitimate brand voice.

### What is broken or missing
- **Zero audience retention mechanisms.** No email signup, no newsletter, no "notify me when this drops" for upcoming devices, no saved comparisons, no wishlists. Every visit is a one-shot interaction.
- **Zero social proof.** No testimonials, no Reddit mentions, no user count, no "As seen on" bar. The About page links only to the founder's personal LinkedIn — not a brand social account.
- **Zero content marketing.** No blog, no guides, no "best retro handheld 2026" articles, no YouTube embeds, no community roundups. This is where 80% of your organic traffic will come from and it does not exist.
- **The site blocks all AI crawlers** (GPTBot, ChatGPT-User, AnthropicAI, Claude-Web, Google-Extended) via `robots.txt`. While this protects your data from being scraped for training, it also prevents AI-powered search tools (Perplexity, ChatGPT Browse, Google AI Overview) from surfacing your content. For a pre-alpha site desperate for traffic, this is a strategic error. You are trading theoretical IP protection for concrete discoverability.

### Fix first
**Add an email capture to the homepage and Finder results page.** Use "Get notified when new handhelds drop" as the hook. This is the single highest-leverage growth action at this stage. You need to own your audience before Google changes the algorithm.

---

## 5. UI / UX Designer — 8/10

### What is working
- The design system is remarkably consistent for a solo build. The dark theme with violet/cyan accents, monospaced type for data, and the corner-bracket button decoration create a coherent visual language across every page.
- The console vault grid is beautiful. The cards with colored manufacturer-tinted borders, pixel art images, and clean typography are genuinely premium-feeling.
- The Arena "Player 1 / Player 2" fighting-game metaphor is a brilliant UX decision. It makes comparison feel interactive rather than clinical.
- Responsive behaviour is solid. The nav collapses cleanly, cards reflow, and text remains readable on mobile viewports.
- The Finder quiz uses large, well-spaced touch targets with clear labels. No tiny radio buttons.

### What is broken or missing
- **Fabricators page has broken/invisible logos.** The Analogue logo is black-on-black (invisible against the dark background). At least two other fabricator tiles show only a single letter fallback ("K", "N") indicating missing image assets.
- **Four fonts are loaded** (`Press_Start_2P`, `JetBrains_Mono`, `Share_Tech_Mono`, `Inter`). The site actually uses these distinctly (pixel headings, mono data, sans body), so this is somewhat justified, but it's a ~200KB font payload. `Share_Tech_Mono` and `JetBrains_Mono` are doing similar jobs and one could be eliminated.
- **`userScalable: false` in the viewport config is an accessibility violation.** It prevents users from pinching to zoom on mobile, which WCAG 2.1 AA explicitly forbids. This is an instant fail if you ever need to pass an accessibility audit.
- **The console detail page has no product photography.** The image area shows a small pixel-art sprite centered in a massive empty black container. On desktop, this means roughly 500px of blank space surrounding a 200px sprite. It feels like a loading placeholder that never resolved.

### Fix first
**Remove `userScalable: false` from the viewport configuration.** It's a one-line change that removes an accessibility violation.

---

## 6. Developer / Code Quality — 6/10

### What is working
- **The architecture is sound.** Next.js App Router with server components, Supabase for data + auth, Upstash Redis for rate limiting, Vercel for deployment. These are all correct choices for this product. No over-engineering.
- **Security is taken seriously.** The middleware sets CSP headers, X-Frame-Options, X-Content-Type-Options, and Referrer-Policy. Rate limiting is configured with a sliding window (300 req/min) with smart bypass for static assets. Admin routes check `profiles.role = 'admin'` server-side. RLS is enabled on the consoles table. This is significantly better than most solo AI-built projects.
- **The slug redirect system is well-engineered.** `resolveConsoleSlug` tries an exact DB match, then falls back to a manufacturer-prefixed search. Combined with `next.config.mjs` permanent redirects, legacy URLs don't 404.
- **TypeScript typing is thorough.** `domain.ts` defines 313 lines of well-structured interfaces with proper enum types for input hardware profiles. This isn't `any`-typed spaghetti.
- **IndexNow integration** for proactive Bing/search engine notification on content changes shows SEO-conscious engineering.

### What is broken or missing
- **`resolveConsoleSlug` is an N+1 query bomb.** On cache miss (lines 36-51 of the console detail page), it fetches the entire console list, then iterates over it and makes *another* `fetchConsoleBySlug` call for the match. With 66 consoles, this means the worst case is 1 (list fetch) + 1 (detail fetch) = 2 DB calls, which is fine today. But the pattern of fetching all-then-filtering is architecturally fragile. This should be a single parameterised query.
- **80+ hardcoded redirects in `next.config.mjs`.** This file is 105 lines long, of which 85 are redirect objects. Every new console requires a manual redirect entry. This should be driven by a DB table or computed dynamically in middleware.
- **Version mismatch drift.** `config/site.ts` says `"Pre-Alpha 0.4.2"` but the live site and `layout.tsx` display `"Pre-Alpha 0.5.5"`. The footer version comes from a `getSystemVersion()` server action. This means `config/site.ts` is stale — it's not the source of truth for the version number, but it *claims* to be. This will cause bugs for anything that reads from `siteConfig.version`.
- **Orphaned scripts in the root directory.** `fix_syntax.js`, `fix_views.js`, `lint_fix.js`, and `patch.diff` are AI-generated fix scripts that were never cleaned up. These are not in `.gitignore` and are being tracked by git.
- **`images.unoptimized: true` in next.config.** This disables Next.js Image Optimization entirely. Every image is served at full size with no format conversion (WebP/AVIF), no responsive sizing, and no lazy loading optimisation. For a site with 66+ console images loaded from Supabase Storage, this is a meaningful performance hit.
- **The CSP allows `'unsafe-eval'` in production.** The comment says it's "required for Next.js dev" — but this CSP is applied unconditionally. In production, `unsafe-eval` is a security risk that should be removed.

### Fix first
**Enable Next.js Image Optimization** by removing `images.unoptimized: true`. This is a single-line config change that will dramatically improve page load performance across the entire site.

---

## 7. SEO Analyst — 7/10

### What is working
- **Technical SEO foundation is strong.** Dynamic `sitemap.ts` generates URLs for all consoles (with manufacturer-prefixed slugs), fabricators, news, and reviews. `robots.ts` correctly blocks `/admin/`, `/api/`, `/login/`, `/profile/`.
- **Canonical URLs are set correctly.** Console detail pages use `alternates.canonical` pointing to the manufacturer-prefixed URL. No duplicate content signal.
- **JSON-LD Product schema is implemented on every console detail page** with price, brand, availability, and URL. This is required for Google Product rich results.
- **WebSite and Organization structured data** are on the homepage with a `SearchAction` pointing to the Finder.
- **Permanent (301) redirects** exist for all legacy short slugs, preventing 404s and consolidating link equity.
- **OG images are dynamically generated** per console page using a cache-busting query param tied to `updated_at`.

### What is broken or missing
- **The JSON-LD `offers.availability` is hardcoded to `InStock` for every device.** This includes discontinued devices, unreleased devices, and devices you have no purchase link for. This is a structured data integrity issue that could lead to a manual action from Google if they flag it as misleading.
- **`/terms` and `/privacy` are in the sitemap with `priority: 0.3`.** The SEO audit checklist says these should be `noindex`, but they are not — they have no `robots: noindex` meta tag and are actively being submitted to Google for indexing. Pick one: either noindex them or keep them in the sitemap. Both is wasteful.
- **Console page descriptions are templated and identical in structure:** "Full specs, variants, and pricing for the [Manufacturer] [Name]. Compare emulation performance and find the right console." This means 66 pages with near-identical meta descriptions. Google will typically ignore these and generate its own snippets.
- **Fabricator pages are thin content.** A page like `/fabricators/anbernic` is a brand logo, a one-sentence description, and a grid of product cards. Google has historically penalised directory pages with minimal unique content.
- **News pages use UUID as the URL** (`/news/[uuid]`). This is not human-readable and provides zero keyword signal to search engines. Compare `/news/retroid-pocket-6-announced` vs `/news/3a87f991-3958-4d7c-9ae9-a2d722a6e6fb`.

### Fix first
**Fix the `InStock` availability lie.** Change the JSON-LD to conditionally output availability based on whether an `amazon_asin` or purchase URL actually exists. Use `https://schema.org/PreOrder` for unreleased devices and omit the offers block entirely for devices with no purchase link.

---

## Overall Score: 6/10

This is an unusually mature pre-alpha. The technical foundation, data model, and design system are all genuinely impressive for a solo non-engineer. But the product is currently a beautifully built library with no doors — users can browse but can't act. The absence of working affiliate links, email capture, and editorial content means the site generates zero revenue and retains zero users. The foundation is excellent; the go-to-market is nonexistent.

---

## Top 5 Prioritised Actions (By Impact)

| # | Perspective | Action | Why |
|---|-------------|--------|-----|
| 1 | **CEO** | Ship working affiliate/purchase links for top 20 consoles | Revenue = zero until someone can click "Buy." Even a basic Amazon search link unblocks the entire monetisation loop. |
| 2 | **Marketing** | Add email capture ("Get notified on new drops") on homepage + Finder results | Without this, every visitor is lost forever. This is the difference between a product and a page view. |
| 3 | **SEO** | Fix `InStock` availability on JSON-LD; actually make it conditional on purchase link existing | Claiming every device is in stock when you have no purchase link is structured data spam. Google will eventually catch it. |
| 4 | **PM** | Add plain-language emulation summaries ("What can this play?") to every console detail page | Your most valuable data (emulation profiles) is locked in a technical tier system nobody understands. A two-sentence summary converts browsers into buyers. |
| 5 | **Dev** | Enable Next.js Image Optimization (`images.unoptimized: true` → remove it) | One-line config change. Every page with console images will load faster, improving Core Web Vitals, SEO ranking, and user experience. |
