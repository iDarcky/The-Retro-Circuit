# THE RETRO CIRCUIT — Claude Context

## Project Overview
Retro handheld gaming device comparison engine. Solo PM project, shipped via AI agents.
Pre-alpha v0.5.5 · 212 consoles (66 published, ~140 draft) · 273 variants · 50 brands · Live at theretrocircuit.com

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
- **Buttons:** `SwissButton` always — `Button` is deprecated (still exists in admin, don't add new instances)
- **Dropdowns:** `SwissDropdown`
- **Modals:** `SwissModal` (hard-edged, thick borders, no shadows)
- **Admin forms:** `AdminInput` is the base input component

### Supabase clients
- `lib/supabase/server.ts` — server-side (cookie-aware)
- `lib/supabase/client.ts` — client-side auth
- `lib/supabase/anon.ts` — anonymous public queries
- `lib/supabase/admin.ts` — admin-privileged operations

---

## Data Architecture
- `Manufacturer` → many `Consoles` → many `Console_Variants` → `Emulation_Profiles`
- Server actions: `app/actions/` (consoles.ts, manufacturers.ts, search.ts, etc.)
- Supabase returns 1:1 relations as arrays — normalization helpers unwrap them (see `app/actions/consoles.ts`)
- Specs live on the **variant**, not the console. `device_category` (`emulation` | `pc_gaming` | `fpga` | `legacy`) separates Android/Chinese handhelds from OEM devices and PC handhelds.
- Structured platform fields on `console_variants`: `os_family` (enum), `os_version`, `soc`, `cpu_arch` (enum), `vulkan_support`, `gpu_driver`, `benchmark_score`. Free-text `os` / `cpu_architecture` are kept as display strings — **filter on the structured columns**, the free text has typos (`"Andorid 13"`).
- `emulation_profiles` rows are created by a **DB trigger** when a variant is inserted. Data-modifying CTEs can't see the trigger's row (same snapshot) — write emulation data in a **separate statement**.

## Rendering (keep compute low)
- Public pages are static/SSG with `revalidate = false` (on-demand only). There is no time-based ISR.
- Cacheability is decided by the Supabase client: `anon.ts` is SSG-safe; `server.ts` reads cookies and **forces the route dynamic**. Never import the server client into a public page.
- Only `/admin/*`, `/profile`, `/unsubscribe` should be dynamic (`ƒ`). Verify with the `pnpm build` route table.
- Middleware is scoped to `/admin`, `/profile`, `/login`, `/design`. Security headers + CSP are set in `next.config.mjs` `headers()` so they still apply everywhere.

## Bulk data import
- `scripts/import-consoles.ts` — JSON → consoles/variants/emulation (validates first, `--dry-run`, imports as **draft**).
- `scripts/xlsx-to-import-json.py` / `-v2.py` — spreadsheet converters. Read the emulation column mapping from the sheet's own headers/cell comments; sheet layouts differ between versions. Excel silently turns aspect ratios like `16:9` into times (`16:09:00`).

---

## Key Docs
| File | Purpose |
|------|---------|
| `DESIGNAUDIT.md` | UI inconsistency tracker vs Swiss system |
| `FINDERIDEAS.md` | Finder feature backlog |
| `docs/DESIGN.md` | Full design system spec |
| `docs/CLAUDEAUDIT.md` | 18KB product/code audit (March 2026) |
| `docs/PENDING_FEATURES.md` | Prioritized feature backlog |
| `docs/ROUTES.md` | Route documentation with payloads |
| `lib/bestof/collections.ts` | "Best Of" buying guides — filter+rank functions over live data, drive `/best/*` |

---

## Auth & Security
- Middleware protects `/admin` (role check) and `/profile` (auth required)
- Admin writes protected at DB level via RLS policies
- Rate limiting: 300 req/min via Upstash Redis — **only on the matched (auth-gated) routes**, not public pages
- Security headers + CSP are applied globally in `next.config.mjs` `headers()`

---

## Known Issues / Active TODOs
- `Button` still used in most admin components — being phased out for `SwissButton`
- **~140 imported consoles sit in `draft`; almost all lack an image**, which blocks publishing. Use the admin index gap filters (READY / NO IMAGE / NO VARIANT / NO PRICE) to find work.
- Only ~13 of 273 variants have an `amazon_asin`; the rest fall back to affiliate *search* links, which convert worse. Backfilling ASINs is the top revenue task.
- Consoles have no written intro / "system analysis". Spec-derived summaries can be generated from the emulation matrix; **opinionated copy must be human-written** — do not mass-generate device reviews.
- `eslint-config-next` pinned at 14 (v16 needs an ESLint 9 flat-config migration).

---

## HARD RULES — NEVER CHANGE
- **Affiliate tag is `theretrocircu-20`** — never alter this string. Build links via `lib/affiliate.ts`.
- **`images.unoptimized: true` in `next.config.mjs`** — intentional, do not remove
- **80+ redirect entries in `next.config.mjs`** — never delete any existing redirect
- **Always back up Supabase before any database migration**
- **Public pages must use `fetchPublicManufacturers()`**, not `fetchManufacturers()` — the latter includes brands whose consoles are all drafts and would render empty brand pages. Admin correctly uses the unfiltered version.
