# THE RETRO CIRCUIT — Claude Context

## Project Overview
Retro handheld gaming device comparison engine. Solo PM project, shipped via AI agents.
Pre-alpha v0.5.5 · 462 consoles (78 published, 379 draft) · 517 variants · 99 brands · Live at theretrocircuit.com

---

## Tech Stack
- **Framework:** Next.js 16, React 19, TypeScript 5, App Router
- **Database:** Supabase (PostgreSQL + Auth + RLS)
- **Styling:** Tailwind CSS 3
- **Package manager:** pnpm
- **Hosting:** Vercel (Analytics + Speed Insights)
- **Email:** Resend
- **Rate limiting:** Upstash Redis (Vercel KV)
- **Validation:** Zod · **Icons:** lucide-react

## Commands
```bash
pnpm dev      # Dev server → localhost:3000
pnpm build    # Production build
pnpm lint     # ESLint
```

---

## Design System: "Vibrant Swiss" — NEVER VIOLATE

### Anti-patterns (strictly prohibited)
- No rounded corners — `rounded-none` or `rounded-sm` only. **Exception:** mobile bottom nav (`rounded-full`)
- No `box-shadow` or `text-shadow`
- No gradient text — solid only. **Exception:** hero brand name "THE CIRCUIT"
- No neon glows, no gamer/distressed aesthetics
- High contrast hover states (white-on-black → black-on-white)
- Flat cards: 1px border (`border-white/10`), no shadows, hover: `bg-white/[0.04]`

### Signal colors (semantic, use sparingly)
| Color | Token | Meaning |
|-------|-------|---------|
| Violet | `text-violet-500` | Brand, primary actions, active states |
| Cyan | `text-cyan-500` | Data, specs, technical info |
| Orange | `text-orange-500` | Warnings, attention, beta |
| Rose | `text-rose-500` | Errors, danger, deletion, legal |

### Typography
- `font-pixel` — Press Start 2P — major headings, hero, digital artifacts
- `font-mono` — JetBrains Mono — specs, metadata, labels, buttons, nav
- `font-sans` — Inter — body text, long-form, tables, reviews

---

## Component Conventions
- **Buttons:** `SwissButton` always — the deprecated `Button` has been removed
- **Dropdowns:** `SwissDropdown`
- **Modals:** `SwissModal` (hard-edged, thick borders, no shadows). Pass `fullScreen` for
  long data-entry forms — it also disables backdrop-click close so a stray click cannot
  discard a half-filled form
- **Admin forms:** `AdminInput` is the base input component

### Supabase clients
- `lib/supabase/server.ts` — server-side (cookie-aware) — **forces a route dynamic**
- `lib/supabase/client.ts` — client-side auth. Exports both `createClient()` and the
  shared `supabase` instance (the former `singleton.ts`, now folded in)
- `lib/supabase/anon.ts` — anonymous public queries, SSG-safe
- `lib/supabase/admin.ts` — admin-privileged operations

---

## Data Architecture
- `Manufacturer` → many `Consoles` → many `Console_Variants` → `Emulation_Profiles`
- Server actions: `app/actions/` (consoles.ts, manufacturers.ts, search.ts, etc.)
- Supabase returns 1:1 relations as arrays — normalization helpers unwrap them (see `app/actions/consoles.ts`)
- Specs live on the **variant**, not the console. `device_category` (`emulation` | `pc_gaming` | `fpga` | `legacy`) separates Android/Chinese handhelds from OEM devices and PC handhelds.
- Structured platform fields on `console_variants`: `os_family` (enum), `os_version`, `soc_vendor` / `soc_name` / `soc_gen`, `gpu_vendor` / `gpu_name`, `cpu_arch` (enum), `vulkan_support`, `gpu_driver`, `benchmark_score`. Free-text `os` / `cpu_architecture` / `soc` / `gpu_model` are kept as display strings — **filter on the structured columns**, the free text has typos (`"Andorid 13"`).
- More structured columns replaced imported free text (Aug 2026): `cooling_type` + `cooling_fan_count` + `cooling_*` booleans, `speaker_count` / `speaker_config` / `speaker_placement`, `charge_port*`, `expansion_slot_count` / `expansion_card_type` / `expansion_speed_class`, `lens_material` / `lens_laminated`. The originals (`cooling_solution`, `audio_speakers`, `microsd_type`, `screen_lens`) survive as fallbacks and are dropped by `20260828170000_drop_legacy_input_columns.sql.pending`.
- `cpu_clusters` is a jsonb array — `[{count, core, clock_mhz, uarch_year}]`, fastest first. Rendered one line per cluster. Compare generation before clock: 2 GHz Gen 8 beats 3 GHz Gen 1.
- **A new variant column must be added to `ConsoleVariantSchema` in `lib/schemas/validation.ts`.** `safeParse` strips anything the schema does not name, so a column missing from it can never be written by the admin form — five columns were silently unwritable this way.
- `emulation_profiles` rows are created by a **DB trigger** when a variant is inserted. Data-modifying CTEs can't see the trigger's row (same snapshot) — write emulation data in a **separate statement**.
- Input details live on `variant_input_profile`, not on the variant. `has_rumble` is its own tri-state column (`true` / `false` / unknown) — it used to share the legacy `haptics` field with gyro, which conflated two unrelated features. **Never coerce unknown to false** on these: use `safeTriBoolean` in `lib/schemas/validation.ts`, because `safeBoolean` would flatten 259 unknown rows into "no".
- `console_variants.slug` addresses one configuration (155 of 517 filled). It is what variant-level Arena URLs and the configuration comparison pages are built from; a variant with no slug simply is not addressable.
- `console_links.approved` defaults to **false**. All 1,332 imported rows are unapproved and render nowhere. Anything that surfaces a link — the console page, `pickBuyTarget`, a future widget — must filter on it. Greenlighting happens at `/admin/revenue`.

## Rendering (keep compute low)
- Public pages are static/SSG with `revalidate = false` (on-demand only). There is no time-based ISR.
- Cacheability is decided by the Supabase client: `anon.ts` is SSG-safe; `server.ts` reads cookies and **forces the route dynamic**. Never import the server client into a public page.
- Only `/admin/*`, `/profile`, `/unsubscribe` should be dynamic (`ƒ`). Verify with the `pnpm build` route table.
- Pages that enumerate the catalogue at build time (`/arena/[[...versus]]`, `/consoles/[facet]/[value]`, `/consoles/[slug]/opengraph-image`, `/best/[slug]`) use `generateStaticParams` with `dynamicParams` left on, so anything outside the prebuilt set still renders on demand rather than 404ing.
- The OG card renderer runs through Satori, which has two rules worth remembering: a `div` with more than one child needs an explicit `display`, and it **cannot decode WebP** (the uploader writes WebP, so `OG_RENDERABLE` filters those URLs out). The drawing lives in `lib/og/console-card.tsx` on purpose — it is a pure function so it can be exercised without a database.
- Middleware is scoped to `/admin`, `/profile`, `/login`, `/design`. Security headers + CSP are set in `next.config.mjs` `headers()` so they still apply everywhere.

## Bulk data import
- `scripts/import-consoles.ts` — JSON → consoles/variants/emulation (validates first, `--dry-run`, imports as **draft**).
- `scripts/xlsx-to-import-json.py` — the spreadsheet converter (this is the former `-v5`;
  v1–v4 were deleted, they read only ~30 of the 62 non-emulation columns and git has them).
  Usage: `python3 scripts/xlsx-to-import-json.py <source.xlsx> <out.json> [--category emulation|pc_gaming]`.
  Reads the emulation column mapping from the sheet's own headers/cell comments; sheet layouts
  differ between versions. Excel silently turns aspect ratios like `16:9` into times (`16:09:00`).

---

## Key Docs
`docs/README.md` is the index — start there. The set was consolidated 20 → 12 files on
2026-08-27; that file records what was removed and where its content went.

| File | Purpose |
|------|---------|
| `docs/SEPTEMBER_PLAYBOOK.md` | **The live plan.** Search data, weekly tasks, revenue blockers, verified data gaps |
| `docs/PENDING_FEATURES.md` | Prioritized feature backlog (now includes the Finder, accessibility and legal/mobile items) |
| `docs/DATA_MAPPING.md` | Spreadsheet → database column mapping, and the traps |
| `docs/ROUTES.md` | Route documentation with payloads |
| `docs/DESIGN.md` | Full design system spec — **in force** |
| `docs/BRAND.md` | Brand Guidelines v2.0.0 tokens — **not yet adopted**, conflicts with the hard rules below |
| `DESIGNAUDIT.md` | UI inconsistency tracker vs Swiss system |
| `docs/CLAUDEAUDIT.md` | Product/code audit (March 2026) — historical snapshot |
| `lib/bestof/collections.ts` | "Best Of" buying guides — filter+rank functions over live data, drive `/best/*` |
| `lib/scoring/circuit-score.ts` | The Circuit Score: reach 40 / polish 35 / feel 25, plus percentile banding |
| `lib/scoring/verdict.ts` | Spec-derived verdict, summary and tags. `noEmDash` is applied to everything it emits |
| `lib/arena/resolve.ts` | Arena URL grammar — `console~variant`, `-vs-`, and legacy-token fallback |
| `lib/arena/pairs.ts` | Which comparison pages get prebuilt, shared by the route and the sitemap |
| `lib/config/facets.ts` | `/consoles/chip\|os\|vendor/[value]` facet pages |
| `lib/config/sheet-order.ts` | The variant editor's spreadsheet-order layout (37 steps over 112 keys) |

---

## Auth & Security
- Middleware protects `/admin` (role check) and `/profile` (auth required)
- Admin writes protected at DB level via RLS policies
- Rate limiting: 300 req/min via Upstash Redis — **only on the matched (auth-gated) routes**, not public pages
- Security headers + CSP are applied globally in `next.config.mjs` `headers()`

---

## Known Issues / Active TODOs
- 14 legacy input columns on `console_variants` (`dpad_mechanism`, `thumbstick_*`, `trigger_mechanism`, `gyro`, …) are superseded by `variant_input_profile` and read by nothing. The drop is staged in `supabase/migrations/*.sql.pending` — back up first, then rename to `.sql`. `haptics` was pulled out of that drop: it held 226 real rows and became `has_rumble`.
- **378 of 379 drafts lack an image**, which blocks publishing — only 1 draft is currently publishable. This is the single biggest bottleneck; specs, buttons and emulation grades are already filled in. `/admin` counts the gaps and links into the filtered index (`?status=DRAFT&gap=NO_IMAGE`).
- 47 of 517 variants have an `amazon_asin`, and **52 of the 78 published consoles still have no buy path at all** (no ASIN, no approved vendor link). Amazon is not the main channel for these devices — see the playbook's channel table before assuming ASINs are the fix.
- **Nothing imported is publicly visible until approved.** 0 of 1,332 `console_links` rows are approved, so no console currently renders a "Reviews and retail" section. 24 of those rows sit on published consoles, which is the short list worth triaging first.
- `release_status` is flipped by hand from the `/admin` "Release date passed" panel, not automatically: public pages are `revalidate = false`, so a silent status change would not reach the site until a rebuild.
- The 1,332 imported `console_links` rows are **raw URLs and carry no affiliate tag** — only `lib/affiliate.ts` applies `theretrocircu-20`. Rendering a `kind='vendor'` Amazon link directly earns nothing; route it through `getBuyUrl`.
- 10 published consoles have no description. `buildSummary` in `lib/scoring/verdict.ts` drafts a spec-derived one from the emulation matrix, but **opinionated copy must be human-written** — do not mass-generate device reviews.
- 362 of 517 variants have no `slug`, so their configurations cannot be addressed or compared individually. Some existing slugs are also terse (`8128`, `161t`) and would read better as `8gb-128gb` — worth fixing before those URLs are indexed.
- The `supabase/migrations/` folder is a **record, not a runner**: migrations are applied through the Supabase MCP, and some file names drift from the applied version numbers. `supabase_migrations.schema_migrations` is the source of truth for what is actually applied.
- `eslint-config-next` pinned at 14 (v16 needs an ESLint 9 flat-config migration).

---

## HARD RULES — NEVER CHANGE
- **Affiliate tag is `theretrocircu-20`** — never alter this string. Build links via `lib/affiliate.ts`.
- **`images.unoptimized: true` in `next.config.mjs`** — intentional, do not remove
- **80+ redirect entries in `next.config.mjs`** — never delete any existing redirect
- **Always back up Supabase before any database migration**
- **Public pages must use `fetchPublicManufacturers()`**, not `fetchManufacturers()` — the latter includes brands whose consoles are all drafts and would render empty brand pages. Admin correctly uses the unfiltered version.
