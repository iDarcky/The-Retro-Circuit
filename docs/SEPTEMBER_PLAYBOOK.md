# September Playbook

*Rewritten 2026-09-02 (evening). Every number below was queried from the live database
or read from Vercel's runtime errors on the day, not carried over from the last draft.*

---

## Read this first: the site was erroring for 42 hours

Vercel's runtime error log for this project shows one error group:

```
Error: You cannot use different slug names for the same dynamic path ('facet' !== 'slug')
count = 550   users = 66   first = 2026-09-01 20:17   last = 2026-09-02 14:23
routes = /  ·  /consoles  ·  /arena  ·  /fabricators  ·  /consoles/<slug>  ·  …
```

`app/consoles/[slug]` and `app/consoles/[facet]/[value]` are two dynamic segments with
different names at the same position, which Next.js forbids. It resolves at **request**
time, not build time, so `next build` stayed green throughout and nothing surfaced it.

Three consequences that reshape this document:

1. **September traffic data is contaminated.** Any GSC or Vercel reading covering
   1–2 Sep reflects a site returning 500s on its main templates. Do not treat it as a
   signal about content, indexing or CTR.
2. **Indexing may have gone backwards.** Google re-crawling a 500 repeatedly will drop
   pages. The 93-stuck-pages figure from August is now a floor, not a baseline.
3. **The first task is not growth, it is confirming recovery.** Fixed on the working
   branch; not yet in production.

**Everything else in this plan is downstream of getting that deployed and verified.**

---

## Where we actually are

**Catalogue, 2026-09-02:**

| | |
|---|---|
| Consoles | 462 — **85 published**, 372 draft |
| Variants | 519 — 166 with a slug, 50 with an ASIN |
| Links | 1,334 imported — **4 approved** |
| Drafts with no image | **370 of 372** |
| Published with no description | 9 |
| Published, sellable, no buy path | **41** |

**Search, 1–23 Aug** (the last uncontaminated window):

| Metric | Value |
|---|---|
| Clicks | 128 |
| Impressions | 995 |
| CTR | 12.9% |
| Average position | 14.9 |

The 12.9% CTR is misleading. Over six months **96% of clicks came from four brand
queries**. Strip those and content-driven performance is **~17 clicks/month**. Average
position 14.9 is the honest number: page two.

### Where the clicks come from

| Page type | Pages | Clicks | Impressions | CTR |
|---|---|---|---|---|
| Homepage (brand) | 1 | 509 | 1,399 | 36.4% |
| Arena (`/x-vs-y`) | 15 | 44 | 1,537 | 2.86% |
| Console detail | 39 | 5 | 6,774 | **0.07%** |
| Fabricators | 8 | 6 | 252 | 2.38% |

Console pages absorb 64% of impressions and convert at 0.07%. Arena pages are 4% of
impressions and produce 70% of non-homepage clicks. **Comparisons rank; spec sheets
don't.** This is still the most useful sentence in the document.

### The six devices that matter

76% of all non-brand demand. **All six are now published with an image** — that half of
Week 2 is done.

| Device | Impressions | Clicks | Description | Buy path |
|---|---|---|---|---|
| Ayn Thor | 899 | 0 | ✅ | ❌ |
| Retroid Pocket 6 | 718 | 2 | ✅ | ✅ ASIN |
| Anbernic RG DS | 279 | 1 | ✅ | ❌ |
| Retroid Pocket 5 | 216 | 0 | ✅ | ✅ ASIN |
| Retroid Pocket G2 | 146 | 0 | ❌ | ❌ |
| Powkiddy RGB30 | 98 | 0 | ✅ | ❌ |

**What is left on the six is one description and four buy paths.** That is an evening,
not a week — and it now happens inside the console editor rather than a separate screen.

---

## The honest math on "double in September"

- August projected full month: **173 clicks** — ~155 brand, **~17 everything else**
- Doubling the total = 345. Brand demand is fixed, so non-brand would need **~190: 11×**

11× in 30 days is not achievable, and two days of the month have now been spent serving
500s. Set the goal on the half that can move, and reset the clock:

| Target | From | To | By |
|---|---|---|---|
| Non-brand clicks | 17 | **30+** | 30 Sep |
| Pages indexed | 93 stuck | **+40** | 30 Sep |
| Average position | 14.9 | **sub-13** | 30 Sep |

Lower than the last draft's targets, deliberately. Two days of downtime mid-month, and
recovery from a crawl error is not instant.

---

## The constraint has not moved

**370 of 372 drafts have no image.** Specs, buttons, emulation grades and links are in
place for them; they cannot go live without a picture. Everything else on the gap list
is smaller than this one, and it is the reason the catalogue is 85 pages rather than 400.

It is also not a code problem, which is why five sessions of engineering have not
touched it. No amount of admin polish substitutes for sourcing images.

---

## Revised plan

### Now — get the fix live and confirm recovery

- [ ] **Merge the working branch to `main` and deploy.** 18 commits, including the
      routing fix. Production is still `main` @ 09:31 on 2 Sep, which contains the bug.
- [ ] Confirm `/consoles`, `/`, `/arena`, `/fabricators` and a console page all return
      200 in production
- [ ] Confirm search returns results — it was failing because the pages hosting it were
      erroring, not because of the search itself
- [ ] GSC → Pages → check "Server error (5xx)" and request re-indexing on the templates
- [ ] Only then look at any traffic number

### This week — finish the six, then widen the buy path

- [ ] Write the Retroid Pocket G2 description (146 impressions, empty field)
- [ ] Buy paths for Thor, RG DS, RGB30, G2 — in the console editor's **Buy path** tab
- [ ] Work the remaining 41 in `/admin/revenue` → "No buy path", worst-first
- [ ] Approve the 24 imported links that sit on published consoles (4 done, from 1,334)

### Next — publish by demand, not alphabetically

- [ ] Source images for the **10 devices with the highest impressions among the drafts**.
      Ten images is ten new pages that already have proven demand, which beats fifty
      chosen at random.
- [ ] Publish them, confirm they reach the sitemap within a day

### Then — the lever that is actually free

**Configuration comparison pages.** All 40 published multi-variant consoles are already
fully slugged, and that mints **134 comparison URLs nobody else has**. This is a
correction to the last draft, which called variant slugs "the next indexability lever":
they are not, because the 353 unslugged variants are all on drafts and therefore sit
behind the image constraint like everything else.

The lever is not adding slugs — it is making sure the 134 pages that already exist are
linked, prebuilt and submitted. Arena pages are the one page type here that converts.

---

## Revenue — 3 affiliate sales by year end

**The blocker is not traffic — most pages have nothing to click.** 41 published,
sellable consoles have no buy path: no ASIN, no approved vendor link.

That number was 52 in the last draft. It is 41 because discontinued devices are now
excluded — a device that is no longer sold has nothing to sell, so a missing buy path is
the correct state, not a task. Eleven of the fifty-two were discontinued.

Grouping the 1,334 imported vendor links by channel:

| Channel | Consoles |
|---|---|
| AliExpress | 82 |
| Other retailers | 82 |
| Brand direct | 68 |
| Crowdfunding | 51 |
| **Amazon** | **33** |
| eBay | 23 |

Amazon is the second-smallest channel. Most of these devices are never sold there — the
Retroid Pocket 6 among them — so an Amazon search returns unrelated products.

Priority order:
1. **A buy path on the 41.** The only revenue work that touches current traffic.
2. **Investigate the AliExpress affiliate programme.** It covers the largest channel;
   Amazon Associates may be the wrong primary programme for this category.
3. ASINs where a device genuinely is on Amazon.

**Verify in the Associates dashboard:** Amazon withdraws an application that has not
produced **3 qualifying sales within 180 days**. Check the real status before assuming.

---

## Known data gaps (verified 2026-09-02)

**370 of 372 drafts have no image.** The single biggest blocker. Unchanged.

**22 consoles have no variant** — absent from both spreadsheets, so the import could not
fill them: the Anbernic RG-351/RG-405 line, `anbernic-rg-rotate`, 1UP (3), 8BCraft (2),
Acer Nitro Blaze (2), the four Ayn Loki models.

**9 published consoles have no description.** Publishing without one is fine — the page
carries a Circuit Score, a spec-derived summary, playability tiers and the full reference
table. `buildSummary` drafts the factual half; the opinionated half stays human-written.

**Two data bugs found while auditing, both live:**
- `Steam Deck` has a variant named **"OLED"** whose specs are `IPS LCD`, 7", 512 GB — a
  mislabelled duplicate of "LCD + 512". `Steam Deck OLED` exists separately with correct
  7.4" OLED specs. Both published, so the site shows a Steam Deck configuration called
  OLED that is the LCD.
- One published console has `device_category` = `"PC Gamimg Handheld"` — free text where
  an enum value belongs. Nothing filters on it, but the finder special-cases `pc_gaming`.

**Four published Steam Deck variants have a system-button list misfiled in `haptics`**
(`'Steam, Quick Access, View, Menu, Volume +/-'`) and a null `system_button_set`. That
string is the only copy, so the pending column drop would delete it.

**`performance_grade` may be on the wrong scale.** 25 devices scored above their own
denominator (`5.5/5`), clamped to `5/5` so nothing impossible renders. The source `.xlsx`
is not in the repo and never has been; it needs re-uploading to verify.

**27 of 519 variants still need `soc` by hand** — where `cpu_model` is empty or holds a
bare core ("Cortex-A7") rather than a chipset. Down from 273.

**`model_no` is not searchable.** 163 variants carry one and the search function never
looks at it. A migration is written and recorded but **not applied**.

**The `_tech` input columns are empty** — `dpad_tech`, `face_button_tech`, `bumper_tech`,
`trigger_tech` want membrane/microswitch/hall, which the spreadsheet does not record.
Only `stick_tech` is populated.

---

## Waiting on a decision

These are blocked on something only the owner can do, not on engineering time.

| Item | Needs |
|---|---|
| Drop the 14 legacy input columns | A Supabase backup, then the Steam Deck button repair, then the migration |
| Make `model_no` searchable | Go-ahead to apply `20260902150000_search_model_no.sql` |
| Fix the Steam Deck "OLED" variant | A decision: delete it, or rename it to what it is |
| Fix `"PC Gamimg Handheld"` | One-row update to a valid enum value |

---

## Lessons worth keeping

- **A green build is not a working site.** The routing conflict threw 550 errors across
  the whole catalogue for 42 hours while every local `next build` passed. Build-time
  checks do not catch request-time routing errors. **When something is reported broken,
  read the runtime logs before reading the code** — two rounds of reasoning about
  deployments and caches were spent on a question Vercel's error page answered directly.
- **A green local build is not a green deploy, and a passing sandbox test is not a
  passing test.** The OG work took production down: `Circuit Score{reach ? …}` is two
  JSX children and Satori demands an explicit `display`. The sandbox test passed because
  the proxy blocks Supabase, so every card fell back to the name-only branch.
- **Silent failure is worse than loud failure.** Search "did not work" for an unknowable
  reason because every error path returned an empty array indistinguishable from "no
  results". Three separate swallowed errors. It now says which it is.
- **Counters that disagree are worse than no counter.** "78 ready to publish" was 77
  already-published consoles plus 2 real ones, because the index counted "has no gaps"
  while the dashboard counted "is a draft with no gaps". Two screens, one label, a
  fortyfold difference.
- **`window.scrollY` is dead code inside a scroll container.** `MainLayout` scrolls an
  inner div. `lib/hooks/useScrollRoot.ts` finds the real scroller.

---

## Standing decisions

- **IndexNow is not a Google strategy.** Google does not consume it. Referrers: google
  87, bing 7. Wired already; leave it, invest nothing further.
- **`images.unoptimized` and `revalidate = false` both stay.** Vercel Hobby and Supabase
  Free have no transformation service, and stored images average 31 KB.
- **The Finder does not need redesigning.** 12 impressions. Redesigning it will not move
  traffic; it is not the constraint and has never been.
- **Game-based search** (`docs/PENDING_FEATURES.md`, marked Critical) — indexing
  `emulation_profiles` so people can search "can X run GameCube". This matches real query
  intent and nothing else on the site serves it. It is the strongest *new* page type
  available, and unlike the image backlog it is engineering work that can start today.
  Worth scoping once the catalogue is stable.
