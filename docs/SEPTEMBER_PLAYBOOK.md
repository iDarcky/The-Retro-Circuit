# September Playbook

*Rewritten 2026-09-02 (evening). Every number below was queried from the live database
or read from Vercel's runtime errors on the day, not carried over from the last draft.*

---

## Read this first: publishing was broken, but the site was not down

Vercel's production logs show **27 HTTP 500s in 48 hours**. Every one is a page Next had
to render *on demand*:

| Path | 500s |
|---|---|
| `/consoles/ayn-thor` | 4 |
| `/arena/…-vs-select` (three pairs) | 12 |
| `/consoles/sony-psp-3000`, `sony-psp-street`, `sony-playstation-vita-pch-1000` | 4 |
| `/consoles/konkr-pocket-block`, `one-netbook-onexplayer-3`, `trimui-brick-pro` | 3 |
| two more arena pairs | 4 |

The cause: `app/consoles/[slug]` and `app/consoles/[facet]/[value]` are two dynamic
segments with different names at the same position, which Next.js forbids. It resolves at
**request** time, so `next build` stayed green and prebuilt pages kept serving from cache
— which is why the site looked, and was, healthy to a visitor.

**What it broke is exactly the publishing loop.** Publish or edit a console →
`revalidatePath` marks its page stale → the next request must regenerate it → routing
conflict → 500 → the page never appears. Meanwhile `/consoles` serves the HTML built at
deploy time, showing the old catalogue. That is the whole "I published the PSP and it
won't appear anywhere" symptom, and `sony-psp-3000` and `sony-psp-street` are in the
error list by name.

Fixed on the working branch. Not yet in production.

**This is not a traffic-data problem.** 27 errors over two days on non-cached paths does
not move GSC numbers. An earlier version of this section claimed a 42-hour site-wide
outage contaminating September measurement; that came from reading a project-wide error
*occurrence* count (550, across preview deployments and internal RSC segment fetches) as
though it were user-facing production 500s. It was not. September targets below are
unchanged from the pre-outage plan.

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

11× in 30 days is not achievable. Set the goal on the half that can move:

| Target | From | To | By |
|---|---|---|---|
| Non-brand clicks | 17 | **35+** | 30 Sep |
| Pages indexed | 93 stuck | **+60** | 30 Sep |
| Average position | 14.9 | **sub-12** | 30 Sep |

Doubling non-brand is what compounds. Brand clicks plateau; content clicks don't.

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

- [ ] **Merge the working branch to `main` and deploy.** 20 commits, including the
      routing fix. Production is still `main` @ 09:31 on 2 Sep, which contains the bug.
- [ ] Confirm the six paths that were 500ing now return 200: `/consoles/ayn-thor`,
      `/consoles/konkr-pocket-block`, `/consoles/trimui-brick-pro`,
      `/consoles/one-netbook-onexplayer-3`, and two `…-vs-select` arena URLs
- [ ] Confirm search returns results. The backend was never broken — the RPC returns 16
      rows for "anbernic" as the anon role — so if it still fails, the new error state
      says whether it is Upstash or something else rather than showing "no results"
- [ ] Publish one draft end to end and confirm it reaches `/consoles`, its own page and
      the sitemap — this is the loop that was broken, so it is the loop to verify
- [ ] GSC → Pages → check "Server error (5xx)"; a handful of URLs may need re-indexing

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

- **A green build is not a working site.** The routing conflict never appeared in a
  `next build` because it resolves at request time. Build-time checks do not catch
  request-time routing errors. **When something is reported broken, read the runtime
  logs before reading the code** — two rounds of reasoning about deployments and caches
  were spent on a question the logs answered directly.
- **Read the number, not the headline.** Those logs then got over-read in the other
  direction: a project-wide error *occurrence* count of 550 became "the site was down
  for 42 hours" in the first draft of this document. Filtering to production 500s gave
  27, all on non-cached paths. The bug was real and the diagnosis was right; the blast
  radius was invented. Check which environment a metric covers before planning around it.
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
