# September Playbook

Reference doc for the September search push. Written 2026-08-26 from Google Search
Console (6-month export + 1–23 Aug), Vercel Analytics, and the live database.
**Updated 2026-08-27** after the v3/v4 import, the merge to `main` and the Vercel
production-branch fix. Catalogue counts and the gaps list are current as of then; the
search metrics are still the 1–23 Aug snapshot.

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

**Catalogue as of 2026-08-27:** 457 consoles (70 published, 387 draft), 513 variants,
240 input profiles, 1,332 review/vendor links. The constraint has moved: it is no longer
missing data, it is missing images.

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

### Week 1 — ship and import ✅ DONE 2026-08-27, ahead of September
- [x] Import v3 + v4 — 513 variants, 240 input profiles, 1,332 review/vendor links
- [x] Merge to `main` (22 commits)
- [x] **Vercel production branch fixed** — it pointed at a `production` branch that no
      longer exists, so every push to `main` built as a *preview*. The live site had been
      serving a stale deployment and nothing shipped, silently. Now set to `main`.
- [x] Sitemap resubmitted in Search Console

The deploy misconfiguration was the real Week 1 blocker, not the import. Worth remembering
as a failure mode: a green build is not the same as a live deploy.

Publishing now updates the sitemap by itself — `updateConsole` calls
`revalidateConsoleSurfaces()`, which revalidates `/sitemap.xml` and pings IndexNow. The
sitemap only needs submitting once.

### Week 2 — the six devices
- [ ] One good image each for the six above
- [ ] **Give all six a buy path** at `/admin/buy-links`. Not ASINs: of 238 consoles with
      vendor links only 33 reach Amazon, behind AliExpress (82), other retailers (82),
      brand-direct (68) and crowdfunding (51). All six of these devices currently have
      *no buy path at all* — as do 63 of the 70 published consoles.
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
- [ ] Backfill the last 27 `soc` values by hand (486 of 513 are filled)

---

## Revenue — 3 affiliate sales by year end

**The blocker is not traffic — it is that most pages have nothing to click.**
**63 of 70 published consoles have no buy path at all**: no ASIN, no vendor link.

An earlier draft of this doc called the ASIN backfill the top revenue task. That was
wrong, and the channel data says so. Grouping the 1,332 imported vendor links:

| Channel | Consoles |
|---|---|
| AliExpress | 82 |
| Other retailers | 82 |
| Brand direct | 68 |
| Crowdfunding | 51 |
| **Amazon** | **33** |
| eBay | 23 |

Amazon is the second-smallest channel. Most of these devices are never sold there —
the Retroid Pocket 6 among them — so an Amazon search for one returns unrelated
products. That was the live behaviour until 2026-08-27; `BuySection` now prefers a real
vendor and only falls back to a search when nothing else is known.

Priority order:
1. **A buy path on the published 70** — `/admin/buy-links`, sorted worst-first. This is
   the only revenue work that touches current traffic.
2. **Investigate the AliExpress affiliate programme.** It covers the largest channel
   here; Amazon Associates may simply be the wrong primary programme for this category.
3. ASINs where a device genuinely is on Amazon.

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

**The 1,332 imported vendor links are stored raw and carry no tag** — only
`lib/affiliate.ts` applies `theretrocircu-20`. Nothing rendered them at all until
2026-08-27; `components/console/ConsoleLinks.tsx` now does, rebuilding every Amazon URL
through `getBuyUrl` (ASIN extracted from `/dp/` when present, tagged search otherwise).
**Any future surface that renders these rows must do the same** — printing `link.url`
directly sends the visitor to Amazon untagged.

**The source spreadsheet's links pointed at other people's affiliate accounts.** On
import they carried an Amazon `tag=retrodeadfred-20`, `s.click.aliexpress` shortlinks,
Impact Radius `irclickid` on Best Buy (`loc=Retro Game Corps`), Banggood `custlinkid`
and shop `aff=` codes. Left in, every one of those clicks would have paid a competitor.
The tracking was stripped and the bare product URLs kept — **re-check this on any future
import**, since the sheets are maintained by someone else.

---

## Known data gaps (verified 2026-08-27, post-import)

**386 of 387 drafts have no image.** This is now the single biggest blocker — the
catalogue went 212 → 457 consoles, but only **70 are published**. Specs, buttons,
emulation grades and buy links are all in place for the rest; they cannot go live
without a picture. Everything else on this list is smaller than this one.

**22 consoles still have no variant** — they appear in neither spreadsheet, so the
import could not fill them (18 draft, 4 archived): the Anbernic RG-351/RG-405 line,
`anbernic-rg-rotate`, 1UP (3), 8BCraft (2), Acer Nitro Blaze (2), and the four Ayn Loki models.

**9 published consoles have no description.**

**`performance_grade` may be on the wrong scale.** 25 devices scored above their own
denominator (`5.5/5`) because the converter assumes the sheet rates out of 5. They are
clamped to `5/5` so nothing impossible renders — **check the source sheet and rescale.**
The source `.xlsx` files are no longer in the working directory; they need re-uploading
to verify.

**27 of 513 variants still need `soc` by hand** — the ones where `cpu_model` is empty or
holds a bare CPU core ("Cortex-A7", "Tensilica LX6") rather than a chipset. Down from 273.

**The `_tech` input columns are empty** — `dpad_tech`, `face_button_tech`, `bumper_tech`,
`trigger_tech` want membrane/microswitch/hall, which the spreadsheet does not record.
Only `stick_tech` is populated.

~~**`rg-rotate`** missing its brand prefix~~ — renamed to `anbernic-rg-rotate` while still
a draft, so no live URL broke and no redirect entry was needed. Every slug now carries its
brand prefix.

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
