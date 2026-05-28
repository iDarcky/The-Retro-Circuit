# THE RETRO CIRCUIT — Claude Context

## Project Overview
Retro handheld gaming device comparison engine. Solo PM project, shipped via AI agents.
Pre-alpha v0.5.5 · ~66 consoles · 136 variants · Live at theretrocircuit.com

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
- ISR on console and manufacturer pages
- Supabase returns 1:1 relations as arrays — normalization helpers unwrap them (see `app/actions/consoles.ts`)

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

---

## Auth & Security
- Middleware protects `/admin` (role check) and `/profile` (auth required)
- Admin writes protected at DB level via RLS policies
- Rate limiting: 300 req/min via Upstash Redis

---

## Known Issues / Active TODOs
- `Button` still used in most admin components — being phased out for `SwissButton`
- ~~Affiliate buy links show `[NO LIVE DATA FEEDS]`~~ → Fixed: fallback search links with affiliate tag now render when no ASIN is stored
- Fabricators page has invisible logos (black-on-black for some brands)
- Finder quiz is labelled "work in progress"

---

## HARD RULES — NEVER CHANGE
- **Affiliate tag is `theretrocircu-20`** — never alter this string
- **`images.unoptimized: true` in `next.config.mjs`** — intentional, do not remove
- **80+ redirect entries in `next.config.mjs`** — never delete any existing redirect
- **Always back up Supabase before any database migration**
