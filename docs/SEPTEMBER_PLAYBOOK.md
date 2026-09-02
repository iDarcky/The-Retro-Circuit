# September Playbook

Reference doc for the September search push. Written 2026-08-26 from Google Search
Console (6-month export + 1–23 Aug), Vercel Analytics, and the live database.
**Updated 2026-09-02** after the admin/console-page branch. Catalogue counts, the gaps
list and the shipped log are current as of then; the search metrics are still the
1–23 Aug snapshot and have not been re-pulled.

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

**Catalogue as of 2026-09-02:** 462 consoles (78 published, 379 draft), 517 variants,
1,332 review/vendor links (0 approved). The constraint has not moved: it is still images.
378 of the 379 drafts have none, and specs, buttons and emulation grades are already in
place for them.

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

## What shipped 27 Aug → 2 Sep

23 commits on `claude/admin-console-improvements-oew1x3`. Grouped by what it was for,
because the branch touched three separate problems.

### Indexability — the thing that compounds
- **459 Arena comparison pages + 92 configuration pages** prebuilt and in the sitemap,
  where there were previously zero prebuilt and one sitemap entry.
- **Facet pages** at `/consoles/chip|os|vendor/[value]` (`lib/config/facets.ts`), built
  from the structured columns. A facet needs at least 2 devices to exist, so no thin
  pages. These are the "Snapdragon 865 handhelds" queries the catalogue can answer and
  had no URL for.
- **OG cards** at `/consoles/[slug]/opengraph-image`. Every link to this site posted
  anywhere used to unfurl as a blank rectangle. Prerendered with the pages, so a broken
  card fails the build rather than a visitor. Satori cannot decode WebP and the uploader
  writes WebP, so photo-less cards fall back to a typographic layout — a WebP uploader
  that also emitted a JPEG derivative would fix that.
- **JSON-LD corrected.** It was marking 64 released consoles as `Discontinued`, because
  availability was derived from whether an ASIN existed rather than from `release_status`.
  That is a rich-result-eligibility bug, on the pages absorbing 64% of impressions.

### The console page
Rebuilt against the v6 mockup over several rounds: Circuit Score card, playability tiers,
tier comparison, a scrolling device header that survives an inner scroll container, one
accent colour, spec-derived summary and tags, smaller similar-console cards, mobile fold
reordered to breadcrumbs → name and tags → images, affiliate disclosure restored.

`VariantGuide` is the piece that matters commercially: for the 40 multi-variant published
consoles it shows only the specs that actually differ between configurations, what each
step costs, and links to the comparison page for each step. It deliberately does not pick
a winner — that is opinionated copy, and it has to be human-written.

### The admin
- **The editor save was broken for every variant** — a hand-written key list omitted
  `system_button_set`, so `safeParse` stripped it and the write failed. The list is now
  derived from the schema shape, which is the class of bug that cannot recur.
- **Rumble split from gyro.** They shared the legacy `haptics` field. `has_rumble` is
  tri-state on purpose: `safeBoolean` would have coerced 259 unknown rows to "no", which
  is a data loss disguised as a migration. Four mis-filed rows were rescued in the split.
- Field gaps closed from publishing by hand: multi-position charge ports, storage in MB
  (`512 MB` and `2 TB` were both unrepresentable), headphone jack position, GPU min/max
  clocks, swappable battery, dual boot as a second `os_family`, delete-variant.
- **A spreadsheet-order layout for the variant editor** (`lib/config/sheet-order.ts`):
  37 steps over 112 keys, matching the order fields are filled in the source sheet. The
  existing grouped layout is still there — this is a toggle, not a replacement.
- **`/admin/links`** — the approval gate described under Revenue.

### Lessons worth keeping
- **A green local build is not a green deploy, and a passing sandbox test is not a
  passing test.** The OG work took production down: `Circuit Score{reach ? …}` is two
  JSX children and Satori demands an explicit `display` for that. The sandbox test
  passed because the proxy blocks Supabase, so every card fell back to the name-only
  branch and the failing shapes never ran. The fix was to extract a pure renderer and
  assert six distinct shapes, not to re-read the code harder.
- **`window.scrollY` is dead code inside a scroll container.** `MainLayout` scrolls an
  inner div, so the sticky header never appeared and one "fix" made it worse before the
  cause was found. `lib/hooks/useScrollRoot.ts` finds the real scroller.

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

### Week 3 work — comparison pages ✅ DONE 2026-09-01, two weeks early
- [x] `generateStaticParams` on `/arena/[[...versus]]`. It had none: the page type
      producing 70% of non-brand clicks existed only *after* someone had already found
      it, and the sitemap listed the bare `/arena` hub and nothing else.
- [x] The pair list lives in `lib/arena/pairs.ts` and is read by both the route and the
      sitemap, so the two cannot drift. It builds **459 cross-device pages**, from five
      rules that each match a way people shop, not the 2,850-page cross product.
- [x] All six searched pairs are in the list explicitly and inserted first, so a growing
      catalogue can never push them past the cap.
- [x] Linked from each console page.

Pairs people actually search: `odin 2 mini vs odin 3`, `ayaneo pocket s vs odin 3`,
`retroid pocket 2 vs 2 plus`, `retroid pocket mini v1 vs v2`,
`ayn odin 3 vs ayn odin 2 portal`, `ayaneo pocket s2 vs odin 3`.

### The wedge — configuration comparisons ✅ SHIPPED 2026-09-01
Retro Catalog lists the base model, or the Pro if there is one, and cannot compare two
configurations of the same device. **40 of the 78 published consoles ship in more than
one configuration, and on every one of them the variant count equals the distinct price
count** — so the choice always costs money, and no page anywhere answers it.

`/arena/ayn-thor~8128-vs-ayn-thor~12256` now does. **92 configuration pages** are
prebuilt, ahead of the cross-device ones so they always survive the cap. The `~`
separator was chosen by querying the data, not by taste: it appears in zero slugs, while
`--` appears in three and a plain hyphen genuinely collides (`anbernic-rg-vita` + `pro`
is also a real console, `anbernic-rg-vita-pro`).

Blocked from going further by data, not code: **362 of 517 variants have no slug**, so
their configurations are not addressable. Some slugs that do exist are terse (`8128`,
`161t`) and would read better as `8gb-128gb` — worth renaming before they are indexed.

### Week 2 work — the six devices ⬅ STILL THE OPEN ONE
- [ ] One good image each for the six above
- [ ] **Give all six a buy path** at `/admin/buy-links`. Not ASINs: of 238 consoles with
      vendor links only 33 reach Amazon, behind AliExpress (82), other retailers (82),
      brand-direct (68) and crowdfunding (51). All six of these devices currently have
      *no buy path at all* — as do **52 of the 78 published consoles**.
- [ ] Write the missing description for Retroid Pocket G2 (146 impressions, empty field)
- [ ] Publish, then confirm they appear in the sitemap within a day

### Week 4 (22–30 Sep) — measure, then widen
- [ ] Coverage: has "Discovered — currently not indexed" fallen from 58?
- [ ] Non-brand clicks vs the 17 baseline
- [ ] Publish 10–15 more consoles, chosen by search demand not alphabetically
- [ ] Backfill the remaining `soc` values by hand

---

## Revenue — 3 affiliate sales by year end

**The blocker is not traffic — it is that most pages have nothing to click.**
**52 of the 78 published consoles have no buy path at all**: no ASIN, no approved vendor
link. 47 of 517 variants carry an ASIN, up from 13.

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
1. **A buy path on the published 78** — `/admin/buy-links`, sorted worst-first. This is
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
`lib/affiliate.ts` applies `theretrocircu-20`. `components/console/ConsoleLinks.tsx`
rebuilds every Amazon URL through `getBuyUrl` (ASIN extracted from `/dp/` when present,
tagged search otherwise). **Any future surface that renders these rows must do the same**
— printing `link.url` directly sends the visitor to Amazon untagged.

**None of those 1,332 rows is visible any more, and that is deliberate (2026-09-02).**
They were rendering on live product pages by inheritance: 821 video reviews pointing at
other people's channels, under our own "Reviews" heading, none of it chosen by anyone.
`console_links.approved` now defaults to false, so the whole "Reviews and retail" section
is absent from a console page until a link is greenlit at **`/admin/links`**, and appears
by itself once one is. The gate is enforced in three places, because any one alone would
leak: `ConsoleLinks` filters and returns null at zero, `ConsoleDetailView` guards the
section on approval rather than row count, and **`pickBuyTarget` ignores unapproved
vendor rows** so an unvetted sheet URL cannot become a device's buy button. Links typed
by hand in the admin insert as approved.

Only **24 of the 1,332 rows sit on a published console**, so restoring the useful ones on
live pages is a short session, not a slog. It is also the cheapest available step towards
priority 1 above: some of those 24 are real buy paths already in the database.

**The source spreadsheet's links pointed at other people's affiliate accounts.** On
import they carried an Amazon `tag=retrodeadfred-20`, `s.click.aliexpress` shortlinks,
Impact Radius `irclickid` on Best Buy (`loc=Retro Game Corps`), Banggood `custlinkid`
and shop `aff=` codes. Left in, every one of those clicks would have paid a competitor.
The tracking was stripped and the bare product URLs kept — **re-check this on any future
import**, since the sheets are maintained by someone else.

---

## Known data gaps (verified 2026-09-02)

**378 of 379 drafts have no image.** Still the single biggest blocker, and eight more
consoles published since 27 Aug has not changed its shape. Specs, buttons, emulation
grades and links are in place for the rest; they cannot go live without a picture.
Everything else on this list is smaller than this one.

**22 consoles still have no variant** — they appear in neither spreadsheet, so the
import could not fill them (18 draft, 4 archived): the Anbernic RG-351/RG-405 line,
`anbernic-rg-rotate`, 1UP (3), 8BCraft (2), Acer Nitro Blaze (2), and the four Ayn Loki models.

**10 published consoles have no description.** Publishing without one is fine — the page
is not thin without it, it carries a Circuit Score, a spec-derived summary, the playability
tiers and the full reference table. `buildSummary` in `lib/scoring/verdict.ts` drafts the
factual half from the emulation matrix; the opinionated half stays human-written.

**362 of 517 variants have no `slug`.** Configuration comparison pages can only be built
for a variant that has one, so this directly caps the one page type nobody else has.
39 of the 40 multi-variant published consoles are covered; the gap is in the drafts.

**0 of 1,332 `console_links` are approved**, so no console page renders a links section
at all. 24 of them are on published consoles — that is the triage list.

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

- ~~**Arena rework before Finder.**~~ Done: 551 prebuilt comparison URLs, and it was
  treated as an SEO project rather than a redesign. Finder still gets 12 impressions and
  redesigning it still will not move traffic.
- **Variant slugs are the next indexability lever, and they are data work, not code.**
  Every slug added to a multi-variant console mints comparison pages nobody else has.
- **Game-based search** (from `docs/PENDING_FEATURES.md`, marked Critical): indexing
  `emulation_profiles` so people can search "can X run GameCube". This matches real
  query intent and nothing else on the site serves it.
- **IndexNow is not a Google strategy.** Google does not consume it. Referrers: google
  87, bing 7. It is already wired; leave it and do not invest further.
- **`images.unoptimized` and `revalidate = false` should both stay.** Vercel Hobby and
  Supabase Free have no transformation service, and stored images average 31 KB. The
  5.9 MB homepage hero was the whole problem and it is fixed.
