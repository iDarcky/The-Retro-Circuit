# September Playbook

Reference doc for the September search push. Written 2026-08-26 from Google Search
Console (6-month export + 1–23 Aug), Vercel Analytics, and the live database.

Companion pages (same content, nicer to read):
- Runbook: https://claude.ai/code/artifact/5244fe2b-4528-4217-9fa9-77cc08dff3cb
- Playbook: https://claude.ai/code/artifact/945647ec-50b9-43e1-80ed-895d2e1049fd

---

## Where we actually are

| Metric | Value (1–23 Aug) |
|---|---|
| Clicks | 128 |
| Impressions | 995 |
| CTR | 12.9% |
| Average position | 14.9 |

The 12.9% CTR is misleading. Over six months **96% of clicks came from four brand
queries** ("retro circuits", "retrocircuits", "retro circuit", "retro circuits games").
Strip those out and the whole content-driven performance is **~17 clicks/month**.

Average position 14.9 is the honest number: page two.

### Where the clicks come from

| Page type | Pages | Clicks | Impressions | CTR |
|---|---|---|---|---|
| Homepage (brand) | 1 | 509 | 1,399 | 36.4% |
| Arena (`/x-vs-y`) | 15 | 44 | 1,537 | 2.86% |
| Console detail | 39 | 5 | 6,774 | **0.07%** |
| Fabricators | 8 | 6 | 252 | 2.38% |

Console pages absorb 64% of impressions and convert at 0.07%. Arena pages are 4% of
impressions and produce 70% of non-homepage clicks. **Comparisons rank; spec sheets
don't.**

### The six devices that matter

76% of all non-brand search demand, producing 3 clicks between them:

| Device | Impressions | Clicks | Avg position | Has ASIN? |
|---|---|---|---|---|
| Ayn Thor | 899 | 0 | 15.4 | ❌ 0 of 4 variants |
| Retroid Pocket 6 | 718 | 2 | 27.8 | ❌ 0 of 4 |
| Anbernic RG DS | 279 | 1 | 16.6 | ❌ 0 of 1 |
| Retroid Pocket 5 | 216 | 0 | 24.2 | ✅ 1 of 1 |
| Retroid Pocket G2 | 146 | 0 | 13.3 | ❌ 0 of 1 |
| Powkiddy RGB30 | 98 | 0 | 11.5 | ❌ 0 of 1 |

---

## The honest math on "double in September"

- August projected full month: **173 clicks**
- Of which brand: ~155. Of which everything else: **~17**
- Doubling the total = 345 clicks
- Brand demand is fixed, so non-brand would have to reach **~190 — 11× current**

11× in 30 days is not achievable. Set the goal on the half that can move:

| Target | From | To |
|---|---|---|
| Non-brand clicks | 17 | **35+** |
| Pages indexed (93 stuck) | — | **+60** |
| Average position | 14.9 | **sub-12** |
| Total clicks | 173 | ~190 (+10%) |

Doubling non-brand is what compounds. Brand clicks plateau; content clicks don't.

---

## Weekly plan

### Week 1 (1–7 Sep) — ship and import
- [ ] Merge and deploy branch `claude/google-search-console-access-fl4qme`
- [ ] `npx tsx scripts/import-consoles.ts v3_import.json` then `v4_import.json`
- [ ] Resubmit sitemap in Search Console
- [ ] Fix the 12 consoles with no variant (list below)

Until the deploy lands, publishing a console still fails to update the sitemap, so
every other week's work stays invisible to Google.

### Week 2 (8–14 Sep) — the six devices
- [ ] One good image each for the six above
- [ ] **Add Amazon ASINs to all six** (see Revenue below — this is the revenue blocker)
- [ ] Write the missing description for Retroid Pocket G2 (146 impressions, empty field)
- [ ] Publish, then confirm they appear in the sitemap within a day

### Week 3 (15–21 Sep) — comparison pages
- [ ] ~25 arena pages from pairs the query data names
- [ ] `generateStaticParams` on `/arena/[[...versus]]` so they exist before first request
- [ ] Add them to the sitemap; link them from each console page

Pairs people actually search: `odin 2 mini vs odin 3`, `ayaneo pocket s vs odin 3`,
`retroid pocket 2 vs 2 plus`, `retroid pocket mini v1 vs v2`,
`ayn odin 3 vs ayn odin 2 portal`, `ayaneo pocket s2 vs odin 3`.

### Week 4 (22–30 Sep) — measure, then widen
- [ ] Coverage: has "Discovered — currently not indexed" fallen from 58?
- [ ] Non-brand clicks vs the 17 baseline
- [ ] Publish 10–15 more consoles, chosen by search demand not alphabetically
- [ ] Backfill `soc` on existing variants (currently 0 of 136 filled)

---

## Revenue — 3 affiliate sales by year end

**The blocker is not traffic, it's that the buy button is a search link.**

Only 13 of 273 variants have an `amazon_asin`. Of the six devices carrying 76% of
demand, exactly one has an ASIN. Everyone else lands on `getAmazonSearchUrl()` — a
search results page. Amazon only pays on a qualifying sale, and search links convert
far worse than direct product links.

Priority order:
1. **ASINs on the six devices** — highest-demand pages, cheapest fix
2. Then the next ~20 by search demand
3. Only then worry about traffic volume

**Two things to verify in the Associates dashboard:**
- Amazon withdraws an application that hasn't produced **3 qualifying sales within
  180 days**. Check the real status before assuming.
- If the account closed, reapplying gives a **new tracking ID**. That breaks the hard
  rule in CLAUDE.md (`theretrocircu-20` never changes). It is one line in
  `lib/affiliate.ts`, but the rule and this doc both need updating.

**Affiliate click tracking currently does nothing.** `AffiliateLink` calls
`track('affiliate_click', …)` from `@vercel/analytics`, but custom events require a
Vercel **Pro** plan — the dashboard says so explicitly. On Hobby those calls are
discarded, so there is no measurement of how many people click buy. Either upgrade or
add a lightweight own-side counter.

---

## Known data gaps (verified 2026-08-26)

**12 consoles with no variant** — render an empty spec table:

`anbernic-rg-350p`, `anbernic-rg-351m`, `anbernic-rg-351mp`, `anbernic-rg-351p`,
`anbernic-rg-351v`, `anbernic-rg-405m`, `anbernic-rg-405v`, `rg-rotate` (draft)
`ayn-loki`, `ayn-loki-max`, `ayn-loki-mini-pro`, `ayn-loki-zero` (archived)

**2 published consoles with no default variant** — the page shows whichever variant
the DB returns first: `ayaneo-pocket-evo`, `valve-steam-deck`

**6 variants with no emulation profile** — blank emulation matrix:
`analogue-pocket` (Base, published), `valve-steam-deck` (OLED, published),
`asus-rog-ally` (Base, Z1 Extreme — archived), `nintendo-switch` (V2, OLED — archived)

**`soc` is 0 of 136 filled.** CLAUDE.md says to filter on the structured column; it is
empty, so those filters do nothing. The chipset data is in free-text `cpu_model`.

**`rg-rotate`** is the only slug missing its brand prefix. Rename while still a draft.

---

## Also queued

- **Arena rework before Finder.** Arena is the only thing ranking; treat its rebuild as
  an SEO project (more crawlable URLs), not a redesign. Finder gets 12 impressions —
  redesigning it will not move traffic.
- **Game-based search** (from `docs/PENDING_FEATURES.md`, marked Critical): indexing
  `emulation_profiles` so people can search "can X run GameCube". This matches real
  query intent and nothing else on the site serves it.
- **IndexNow is not a Google strategy.** Google does not consume it. Referrers: google
  87, bing 7. It is already wired; leave it and do not invest further.
- **`images.unoptimized` and `revalidate = false` should both stay.** Vercel Hobby and
  Supabase Free have no transformation service, and stored images average 31 KB. The
  5.9 MB homepage hero was the whole problem and it is fixed.
