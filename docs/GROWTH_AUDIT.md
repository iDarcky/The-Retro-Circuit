# GROWTH AUDIT — The Retro Circuit

**Date:** 2026-05-06
**Stage:** Pre-alpha v0.5.5 · 66 consoles · 136 variants
**Horizon:** 1–3 months
**Primary goal:** Organic search traffic (Google/Bing + AI search + Reddit/YouTube)
**Persona:** Enthusiasts / collectors

This document is a prioritized, opinionated punch-list. It captures the highest-leverage improvements to grow traffic and revenue, ordered by impact ÷ effort. Each item has a clear acceptance criterion so it can be picked up directly.

---

## TL;DR — Top 10 in order

1. Unblock AI crawlers in `robots.txt`
2. Replace `[NO LIVE DATA FEEDS]` with smart Amazon-search fallback
3. Build admin ASIN discovery + paste tool
4. Migrate `/news/[uuid]` → `/news/[slug]` with 301s
5. Add unique meta descriptions + per-page OG images
6. Ship 5–10 curated head-to-head comparison pages
7. Add account-gated star ratings on console pages
8. Polish Finder: explainers, dealbreakers, shareable result cards
9. Fix dead/invisible fabricator logos
10. Re-evaluate `images.unoptimized: true` (separate ticket)

---

## P0 — Quick wins (ship in week 1)

### P0.1 — Unblock AI crawlers
**Why:** Pre-alpha sites cannot afford to opt out of Perplexity, ChatGPT Browse, Google AI Overview, or Claude. Current `robots.ts` blocks GPTBot, Claude-Web, AnthropicAI, Google-Extended.
**Action:** Remove the AI bot disallow rules. Keep `/admin`, `/api`, `/login`, `/profile`, `/design` blocked.
**Acceptance:** `curl https://theretrocircuit.com/robots.txt` shows GPTBot/Claude/Google-Extended allowed.
**Effort:** 15 min.

### P0.2 — Smart affiliate fallback
**Why:** Every console page with no ASIN currently shows `[NO LIVE DATA FEEDS]`, killing conversion on visitors with buying intent. Even before ASINs are populated, an Amazon search URL with the affiliate tag is materially better than a dead state.
**Action:** When `amazon_asin` is null, render a "Search on Amazon" CTA pointing to `https://www.amazon.com/s?k=<encoded device name>&tag=theretrocircu-20`. Keep the disclaimer.
**Acceptance:** Every console detail page has a working, tagged buy CTA.
**Effort:** ~1 hour.

### P0.3 — Unique meta descriptions
**Why:** Console pages share a templated description (`Full specs, variants, and pricing for [Manufacturer] [Name]…`). Google ignores duplicate descriptions; this hurts CTR.
**Action:** In `generateMetadata()` for console pages, compose the description from real specs (CPU, screen size, year, standout emulation tier). Cap at 155 chars.
**Acceptance:** 5 random console pages have distinct, spec-driven descriptions.
**Effort:** ~2 hours.

### P0.4 — Per-page OG images for news + comparisons
**Why:** Reddit/Discord/Twitter previews drive click-through. The console OG generator already exists; news + arena need it too.
**Action:** Add `opengraph-image.tsx` to `/news/[slug]` and `/arena` routes. Pull article hero / device thumbs into a Swiss-styled card.
**Acceptance:** Posting a news URL into Discord renders a unique branded card.
**Effort:** ~3 hours.

### P0.5 — Fix invisible fabricator logos
**Why:** Listed in `DESIGNAUDIT.md`. Black-on-black logos (Analogue) and missing assets (initials fallback) make the page feel broken.
**Action:** Audit `/fabricators`, replace black SVGs with light variants or add a background swatch behind dark logos.
**Acceptance:** Every brand on `/fabricators` renders a visible mark on the dark background.
**Effort:** ~2 hours.

---

## P1 — Affiliate revenue funnel (week 1–2)

### P1.1 — Admin ASIN discovery tool (manual search + paste)
**Why:** You confirmed affiliate revenue is the critical first lever and the operational mode is manual ASIN entry.
**Action:** New admin route `/admin/affiliate`. For each console without an ASIN:
- Show name, manufacturer, year, variants
- "Search Amazon" link that opens `amazon.com/s?k=<name>` in a new tab
- Paste field that accepts a full Amazon URL or raw ASIN
- Validates the 10-char ASIN format, persists to `consoles.amazon_asin`, refreshes the row
- Shows a coverage counter ("47 of 66 consoles tagged")
**Acceptance:** A non-developer can populate an ASIN from URL paste in <10 seconds per console.
**Effort:** ~1 day.

### P1.2 — Affiliate click tracking
**Why:** You can't optimize what you don't measure. Vercel Analytics already tracks pageviews; we need outbound-click events.
**Action:** Wrap `BuyButton` in a click handler that fires `va.track('affiliate_click', { console_slug, vendor })`. Add a small dashboard in `/admin/affiliate` showing top 20 clicked devices.
**Acceptance:** Dashboard shows non-zero clicks within a day of deploy.
**Effort:** ~3 hours.

### P1.3 — Disclosure compliance pass
**Why:** FTC requires conspicuous affiliate disclosure. Currently only the BuySection mentions it.
**Action:** Add a one-line affiliate disclosure to the global footer linking to `/about#affiliate`.
**Acceptance:** Disclosure visible on every page; legal copy on /about.
**Effort:** ~30 min.

---

## P2 — Editorial + SEO surface (week 2–4)

### P2.1 — Migrate news URLs from UUID to slug
**Why:** `/news/[uuid]` carries zero keyword signal. Slug-based URLs are a Google ranking factor and dramatically improve shareability.
**Action:**
- Add `slug` column to `news` table (unique). Backfill from titles via slugify.
- Switch route from `[id]` to `[slug]`; resolve UUIDs via 301 redirect.
- Update sitemap, internal links, OG canonical.
**Acceptance:** `/news/anbernic-rg40xx-review` works; `/news/<old-uuid>` 301s.
**Effort:** ~1 day (incl. data migration + redirect map).

### P2.2 — Curated comparison pages (5–10 hand-picked)
**Why:** Comparison queries are highest-intent SEO surface. We agreed on curated, not programmatic.
**Action:** Ship `/compare/[a]-vs-[b]` with these matchups (chosen for current search volume):
1. anbernic-rg40xx-h vs miyoo-mini-plus
2. steam-deck-oled vs rog-ally-x
3. retroid-pocket-5 vs anbernic-rg556
4. analogue-pocket vs miyoo-mini
5. ayn-odin-2 vs retroid-pocket-mini
6. powkiddy-rgb30 vs anbernic-rg35xx-h
7. anbernic-rg40xx-h vs anbernic-rg35xx-h
8. miyoo-mini-plus vs trimui-smart-pro

Each page: side-by-side spec table, emulation-tier verdict, "best for" callout, both buy CTAs, FAQ schema, internal links to each console page.
**Acceptance:** 8 pages live, indexed in sitemap, internally linked from both source console pages.
**Effort:** ~3 days (template + content per pair).

### P2.3 — Buying-guide hub at /best
**Why:** Aligns with "1–2 articles a month" content cadence and captures top-funnel queries.
**Action:** Curated landing pages — start with three:
- `/best/under-100`
- `/best/n64-emulation`
- `/best/clamshell-handhelds`

Pages pull from existing console DB with editorial intro, ranked picks with reasoning, buy CTAs.
**Acceptance:** 3 pages live, each with ≥800 words of unique copy + structured ItemList JSON-LD.
**Effort:** ~2 days for template + first 3 pages.

### P2.4 — Fix structured-data lies
**Why:** Every device's offers JSON-LD is hardcoded `availability: InStock`, including discontinued devices. Google penalizes structured-data spam.
**Action:** Drive availability from a real DB column (`status`: in_stock / discontinued / preorder / unknown). Omit `offers` block when ASIN missing.
**Acceptance:** Search Console structured-data report shows zero warnings on console pages.
**Effort:** ~3 hours.

### P2.5 — `noindex` legal pages
**Why:** `/terms` and `/privacy` in sitemap with priority 0.3 dilutes crawl budget.
**Action:** Remove from sitemap, add `robots: { index: false }` in their metadata.
**Acceptance:** Pages return `noindex` header; absent from sitemap.
**Effort:** 15 min.

---

## P3 — Engagement & retention (week 3–6)

### P3.1 — Account-gated star ratings on console pages
**Why:** You chose stars-only over written reviews. Aggregate ratings are unique on-page content (great for SEO), low moderation cost, and create return-visit reasons.
**Action:**
- New `console_ratings` table: `(user_id, console_id, stars 1-5, created_at)` with unique constraint.
- RLS: insert/update only own rows; read public.
- Console page shows aggregate (avg + count); logged-in users see their rating + can change it.
- Add `AggregateRating` JSON-LD to console pages once ≥5 ratings exist.
- Rate-limit submissions (1 per console per hour per user) via existing Upstash setup.
**Acceptance:** Logged-in user can rate; aggregate updates; AggregateRating appears in source.
**Effort:** ~2 days.

### P3.2 — Finder polish (you flagged this as core differentiator)
**Why:** Finder is the unique Discovery surface and currently labelled "WIP". Three changes from `FINDERIDEAS.md` deliver outsized impact:
- **Explainer summaries** on the result page ("We picked the Anbernic RG40XX-H because it maximizes your $150 budget while supporting up to PSP")
- **Dealbreaker step**: a "must-haves" page (HDMI out / Hall-effect sticks / clamshell / Wi-Fi)
- **Shareable result cards**: OG image renders the user's recommendation as a posterizable graphic with the Circuit watermark — drives Reddit/Discord shares
**Acceptance:** All three live; Finder result URL reposted in Discord renders the personalized OG image.
**Effort:** ~3 days.

### P3.3 — Email capture re-engagement
**Why:** `subscribers` table exists but no triggered flows. Every new subscriber is currently lost.
**Action:** Resend-powered welcome email + monthly digest of new devices + new comparison pages. Single template, plain Swiss style.
**Acceptance:** Monthly digest sends to all confirmed subscribers; click-through tracked.
**Effort:** ~1 day.

---

## P4 — Community + share leverage (week 4–8)

### P4.1 — Universal share button
**Action:** Floating share button on console / comparison / news / Finder result pages. Native `navigator.share` on mobile; copy-link + Twitter / Reddit / Discord intents on desktop. All share URLs include `?utm_source=share&utm_medium=<channel>`.
**Acceptance:** Share works on mobile + desktop; UTMs visible in Vercel Analytics.
**Effort:** ~4 hours.

### P4.2 — Reddit / Discord post toolkit (for you)
**Why:** You said you'll post organically. Make the artifacts easy to grab.
**Action:** Add a hidden `/admin/share-kit` page that renders pre-formatted reddit/discord post drafts for any console or comparison (title + summary + image + link). Speeds up your posting cadence to <2 minutes.
**Effort:** ~4 hours.

### P4.3 — Creator outreach landing
**Action:** `/press` page with brand assets (logos, screenshots, embedable comparison widgets), API/RSS for news, a contact form. Lowers friction for ETA Prime / RetroDodo / Retro Game Corps to cite us.
**Effort:** ~1 day.

---

## P5 — Performance + hygiene (separate decisions)

### P5.1 — Re-evaluate `images.unoptimized: true`
**Status:** flagged for joint discussion — CLAUDE.md marks it as a hard rule.
**What I'd want to know before flipping:** What forced the flag? (Vercel image-budget cost? Hosting constraint? CDN incompatibility?) Recommend: investigate root cause, then either (a) selectively enable for specific routes, or (b) keep the flag and add manual `loading="lazy"` + WebP source variants for top-traffic pages.
**Action:** Open a separate ticket; do not flip without your approval.

### P5.2 — Phase out deprecated `Button` component
**Why:** `DESIGNAUDIT.md` flags 12 admin locations still using it. Not a growth lever directly, but compounds into design coherence and reduces mental tax.
**Effort:** ~1 day (mechanical replacement).

### P5.3 — Remove `userScalable: false` from viewport
**Why:** WCAG 2.1 AA violation; can also cost you accessibility-conscious referrals + Lighthouse score.
**Effort:** 5 min.

---

## What I am NOT recommending (and why)

- **Programmatic SEO at scale.** You opted for curated only. Holding the line — programmatic comparison pages can trip Google's "thin content" filters on small domains and risk a manual action.
- **Written reviews / comments.** You chose stars-only. Avoids moderation overhead; we can revisit after stars prove engagement.
- **3+ device Arena.** Listed in PENDING_FEATURES but doesn't move organic-traffic needle. Defer until ratings + comparisons land.
- **PWA / app shell.** No clear ROI for an SEO-led growth phase.
- **Discord widget on site.** Common but visually noisy; doesn't fit Swiss aesthetic and barely converts. Skip.

---

## Suggested execution order

**Week 1**
- P0.1 unblock crawlers · P0.2 affiliate fallback · P0.3 meta descriptions · P0.5 fabricator logos · P2.5 noindex legal · P5.3 viewport fix

**Week 2**
- P1.1 ASIN tool · P1.2 click tracking · P1.3 disclosure · P0.4 OG images

**Week 3**
- P2.1 news slugs · P2.4 structured-data fix · P3.1 star ratings (start)

**Week 4**
- P2.2 first 4 comparison pages · P3.1 star ratings (ship) · P4.1 share button

**Week 5–6**
- P2.2 remaining comparisons · P2.3 buying-guide hub · P3.2 Finder polish

**Week 7–8**
- P3.3 email digest · P4.2 share-kit · P4.3 press page

---

## Open questions for follow-up

1. Do you have Resend templates already, or do we design from scratch for P3.3?
2. For P2.2/P2.3 editorial copy, is AI draft + your edit acceptable, or fully human?
3. For P5.1, who originally set `images.unoptimized: true` and is the reason documented anywhere?
4. Do you want a public "changelog" page so creators/redditors can track shipped features? (small lift, large credibility signal)
