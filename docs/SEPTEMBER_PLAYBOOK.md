# September Playbook

*Rewritten 2026-09-02 (evening); search figures replaced 2026-09-03 with the full-month
August GSC exports. Every number below was queried from the live database, read from
Vercel's runtime errors, or taken from a GSC CSV — none are carried over or projected.*

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

**Search, full August 2026** — the September benchmark. Read from the five GSC exports
(Chart, Pages, Queries, Countries, Search appearance), not estimated:

| Metric | Aug 2026 |
|---|---|
| Clicks | **143** |
| Impressions | **1,153** |
| CTR | 12.40% |
| Average position | ~14.4 (impression-weighted over the Pages export) |
| Days with any click | 31 |

An earlier draft used a 1–23 Aug partial (128 / 995) and projected 173 for the month.
The real month came in at **143** — the projection was 21% high because clicks *fell*
through August rather than holding: 13 on 1 Aug, 2–3 a day by mid-month.

The 12.40% CTR is an artefact. **Three brand queries produced 84 of the 143 clicks
(59%)**, all on the homepage. Non-brand clicks for the whole month: **59**.

### Where the clicks come from — August only

| Page type | Pages | Clicks | Impressions | CTR | Avg position |
|---|---|---|---|---|---|
| Homepage | 1 | **132** | 299 | 44.15% | **5.5** |
| Arena (`/x-vs-y`) | 11 | 7 | 333 | 2.10% | **13.5** |
| Fabricators | 4 | 2 | 85 | 2.35% | 15.3 |
| Console detail | 9 | **1** | **437** | **0.23%** | **18.2** |
| Console index | 1 | 1 | 69 | 1.45% | 31.7 |
| Other | 2 | 0 | 20 | 0% | 16.8 |

(The previous version of this table mixed a six-month window with a partial-August one —
the 6,774 console-detail impressions in it were a multi-month total, not a monthly rate.
August's real console-detail impressions were 437.)

### What August actually says

**1. The problem is position, not the snippet.** This corrects the previous draft. Line
up CTR against position and almost every page is earning what its rank is worth:
`/consoles/retroid-pocket-6` sits at position **35.13** and gets 0.79%, which is normal
for position 35. Console pages convert at 0.23% because they average position **18.2** —
page two. Rewriting titles does not fix page two.

**2. But there is a real snippet failure, and it is narrow.** A handful of pages rank on
page one and still take zero clicks:

| Page / query | Impressions | Position | Clicks |
|---|---|---|---|
| `/consoles/anbernic-rg-ds` | 173 | 15.46 | **0** |
| "rg ds specs" | 36 | 9.97 | **0** |
| "anbernic rg ds specs" | 21 | 9.81 | **0** |
| "kinhank k59 specs" | 10 | 9.00 | **0** |
| "ayaneo pocket s vs odin 3" | 18 | 7.06 | **0** |

Position 7–10 with zero clicks across 85 impressions is not a ranking problem. That is
where the title/description rewrite (commit `50a8877`) applies — to five queries, not to
the whole catalogue. Measure it on exactly these rows in September.

**3. Arena pages out-rank console pages: 13.5 vs 18.2.** They also convert nine times
better. The best page on the site after the homepage is
`/arena/ayaneo-pocket-vert-vs-analogue-pocket` — 5 clicks, 9.26% CTR, position **5.8**.
Comparison pages rank because nobody else builds them; spec sheets compete with the
manufacturer, Amazon and every review site at once. **This is the strongest signal in the
whole export and it points at the 134 configuration-comparison URLs, not at images.**

**4. Only two pages earned a first impression all month.** The index is not growing. That
is a crawl/indexation problem, and it is what "publish by demand" below is for.

**5. Search appearance is thin.** One rich-result type registered — Product snippets:
129 impressions, 1 click, position 30.27. No FAQ, no breadcrumbs, no review snippets.

**6. Audience:** US 99 clicks / 396 impressions / 25% CTR / position 10.15; Canada 16;
UK 4. **Mobile 101, desktop 40, tablet 2 — 71% mobile.** The US ranks eight positions
better than the site average, so US-intent content compounds fastest.

### The six devices that matter

76% of non-brand demand (impressions below are the six-month totals, not August).
**All six are now published with an image** — that half of Week 2 is done.

| Device | Impressions (6mo) | Clicks | Description | Buy path |
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

## The September target, set against the real August

- August actual: **143 clicks — 84 brand, 59 non-brand**
- Doubling the total means 286. Brand demand is fixed by how many people type "retro
  circuit", so all of it would have to come from non-brand: 202, a **3.4×**.

That is not achievable in 30 days. Set the goal on the half that can move:

| Target | Aug actual | Sep goal |
|---|---|---|
| Non-brand clicks | 59 | **90+** |
| Console-detail avg position | 18.2 | **sub-15** |
| Arena clicks | 7 | **20+** |
| Pages with a first impression | 2 | **+25** |
| Zero-click page-one queries | 5 | **0** |

Non-brand is what compounds. Brand clicks plateau; content clicks don't.

---

## What the constraint actually is

Not images. The earlier drafts of this document led with "370 of 372 drafts have no
image" as the single biggest blocker, and August does not support that. Publishing 370
more spec sheets adds 370 more pages of the type that averages **position 18.2 and a
0.23% CTR**. Volume of a page type that does not rank is not a growth plan.

What August supports instead, in order:

1. **Comparison pages rank and spec sheets don't** (13.5 vs 18.2, 2.10% vs 0.23%). The
   134 configuration-comparison URLs already mintable from fully-slugged variants are the
   highest-yield inventory on the site and cost nothing to source.
2. **Indexation is stalled** — 2 first impressions in 31 days. The routing fix is
   directly upstream of this: pages that 500 on regeneration do not get indexed.
3. **Five page-one queries take zero clicks.** Snippet work, precisely scoped.
4. **Images matter for the devices with proven demand**, publish-by-demand, not as a
   370-item backlog. Ten images against ten high-impression drafts is worth more than
   fifty chosen alphabetically.

Images remain a real gap — 370 drafts cannot go live without one. They are just not the
lever that moves search in September.
---

## Revised plan

### Now — get the fix live and confirm recovery

- [ ] **Merge the working branch to `main` and deploy.** 22 commits, including the
      routing fix. Production is still `main` @ 09:31 on 2 Sep, which contains the bug.
      Nothing below is measurable until this ships — August is the benchmark, and
      September only differs from it if the fix is live.
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

### Next — the 134 comparison URLs, because comparisons are what rank

August settles this: arena pages average position **13.5** and 2.10% CTR against console
detail's **18.2** and 0.23%. All 40 published multi-variant consoles are already fully
slugged, which mints **134 comparison URLs nobody else has**, at zero sourcing cost.

- [ ] Confirm all 134 are in `lib/arena/pairs.ts` and therefore prebuilt and in the sitemap
- [ ] Link them from the parent console page — an orphan URL is not an indexed URL
- [ ] Fix the five zero-click page-one queries listed above and re-measure those exact rows

The lever is not adding slugs — the 353 unslugged variants are all on drafts and sit
behind the image gap. It is making sure the pages that already exist are linked,
prebuilt and submitted.

### Then — publish by demand, not alphabetically

- [ ] Source images for the **10 devices with the highest impressions among the drafts**.
      Ten images is ten new pages that already have proven demand, which beats fifty
      chosen at random.
- [ ] Publish them, confirm they reach the sitemap within a day

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

**370 of 372 drafts have no image.** A real gap — a draft cannot publish without one —
but not the growth constraint. See "What the constraint actually is" above: the page type
they would add averages position 18.2. Source images by demand, not by backlog.

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
