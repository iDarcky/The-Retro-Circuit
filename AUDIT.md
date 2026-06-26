# THE RETRO CIRCUIT — Site Audit

*Multi-perspective audit: rendering/cost, security, performance, SEO, and UX/retention.*
*Pre-alpha v0.5.5 · Next.js 16 / React 19 / Supabase · Generated June 2026.*

This report is **advisory** — no source or config files were changed in producing it.
Recommendations are ordered by leverage: **compute/cost first** (your Fluid Compute pain),
then security, then performance, SEO, and retention. Each section ends with concrete file
references so any item can be picked up directly.

---

## 0. TL;DR — what the site needs to succeed

1. **Stop paying for compute you don't need.** Almost every request — including anonymous
   hits on static pages — currently runs a serverless function and a Supabase Auth
   network round-trip. Two targeted changes move the public site onto the CDN. *This is
   the Fluid Compute fix.* → §A
2. **Close the privilege gap.** Admin mutations rely on RLS alone (no in-code auth check),
   and three RLS policies let *any* logged-in user write. Defense-in-depth is missing. → §B
3. **Turn traffic into revenue and return visits.** Affiliate links are unwired and there's
   no email capture or funnel analytics — so there's no monetization and no retention loop. → §E
4. **Polish the fundamentals.** Font loading, oversized assets, thin/duplicate SEO
   metadata, and a11y gaps are all cheap wins once §A and §B land. → §C, §D

---

## A. Rendering, caching & the Fluid Compute problem  *(highest priority)*

### Root cause

Two things force nearly every request through a serverless function instead of being
served statically from the CDN:

**1. Middleware authenticates on every request.**
`middleware.ts` runs on all non-asset routes and calls `supabase.auth.getUser()` —
a network round-trip to Supabase Auth — for *every* request, including anonymous visitors
on fully-static pages (`middleware.ts:86`). On `/admin` and `/design` it does a second
query for the role check (`middleware.ts:116`). For a site that is ~95% public content,
this is the single biggest compute driver.

**2. Public pages render through the cookie-aware client.**
`lib/supabase/server.ts` (`createClient()`) calls `cookies()`. Reading cookies opts a
route into **dynamic SSR on every request**. Pages that only read *public* data still use
it — for example `/news` via `fetchAllNews/Reviews/Signals` (`app/news/page.tsx:24`) and
`/consoles`'s `generateMetadata` (`app/consoles/page.tsx:6`). The stateless client in
`lib/supabase/anon.ts` (`supabaseAnon`) does **not** touch cookies and is static/ISR-safe.
It's already used in several actions — just not consistently.

> **Myth busted:** `export const revalidate = false` is *not* the problem. In the App
> Router it means "cache indefinitely" (i.e. static) — which is exactly what you want.
> The dynamic behavior comes from the cookie-aware client and the middleware, not from
> the `revalidate` value.

### Per-page rendering strategy

| Route | Today | Target | Action |
|---|---|---|---|
| `/` | static (cached version) | **Static** | keep — `getSystemVersion()` already `unstable_cache`'d |
| `/consoles` | dynamic (createClient in metadata) | **Static / ISR** | switch `generateMetadata` to `supabaseAnon`; page body already uses anon |
| `/consoles/[slug]` | Static (`generateStaticParams`) | **Static** | keep |
| `/consoles/brand/[name]` | dynamic (createClient) | **Static / ISR** | switch to `supabaseAnon`; overlaps `/fabricators/[slug]` — consider redirect/dedupe |
| `/fabricators` | anon (static-capable) | **Static / ISR** | verify metadata path uses anon |
| `/fabricators/[slug]` | Static (`generateStaticParams`) | **Static** | keep; add `generateMetadata` (see §D) |
| `/news` | **dynamic** (createClient ×3) | **ISR ~300s + on-demand** | add a public-read variant on `supabaseAnon`; keep existing `revalidatePath('/news')` |
| `/roadmap` | anon (static-capable) | **Static / ISR** | confirm no cookie usage in the render path |
| `/about`, `/credits`, `/privacy`, `/terms` | static / cached | **Static** | keep |
| `/finder`, `/design` | client shells | **Static shell** | keep |
| `/arena/[[...versus]]` | `force-static` | **Static** | keep; consider client-side data fetch (per `docs/OPTIMIZATION_LOG.md`) |
| `/profile`, `/admin/*`, `/login`, `/unsubscribe` | dynamic | **Dynamic (SSR)** | correct — these are the only routes that legitimately need per-request compute |

### Recommended changes

1. **Gate middleware auth to routes that need it.** Only call `supabase.auth.getUser()`
   (and the role check) when the path starts with `/admin`, `/design`, `/profile`, or
   `/login`. Leave global rate-limiting where it is — the Redis call is cheap and you want
   it everywhere. This removes an auth round-trip from essentially all public traffic and
   is the **single biggest compute win**.
2. **Use `supabaseAnon` for every render-time public read.** Replace `createClient()`
   with `supabaseAnon` in: `app/consoles/page.tsx` metadata, `app/consoles/brand/[name]`,
   and the public read paths of `fetchAllNews` / `fetchAllReviews` / `fetchActiveSignals`.
   Where admin pages need to see *draft* rows, keep a separate `createClient()` fetch
   (published-only for the public page vs. all-statuses for admin).
3. **Cache hot public reads with tags.** Wrap `fetchManufacturers`, `fetchVaultConsoles`,
   and `fetchConsoleAndVariantCounts` in `unstable_cache` keyed with tags (e.g.
   `consoles`, `manufacturers`), and call `revalidateTag(...)` from the matching mutation
   actions (which already call `revalidatePath`). This deduplicates repeated queries and
   persists results across requests.
4. **Keep ISR windows modest** where content actually changes (`/news` ~300s); everything
   else can rely on the on-demand revalidation already wired into the mutation actions.

**Expected effect:** public traffic served from the CDN as static/ISR; middleware does
near-zero work for anonymous users; function invocations drop to admin/auth traffic plus
one render per ISR window. This directly addresses the Fluid Compute cost.

---

## B. Security  *(high-impact, low-risk hardening)*

| Issue | Severity | Where |
|---|---|---|
| Mutation server actions have **no in-code admin check** (rely on RLS only) | **High** | `app/actions/{news,signals,roadmap,reviews,consoles,manufacturers}.ts` |
| **Over-permissive RLS**: `news`/`reviews`/`signals` use `auth.role()='authenticated'` — any logged-in user can write | **High** | `supabase/migrations/2024060200000{0,1,2}_*.sql` |
| **Hardcoded IndexNow API key** committed to source | **Medium** | `lib/indexnow.ts:1` |
| **Newsletter signup unthrottled** (uses the service-role admin client) | **Medium** | `app/actions/subscribers.ts` |
| **Zod schemas defined but not enforced** server-side before writes | **Medium** | `lib/schemas/validation.ts` (unused in actions) |
| Supabase clients **fall back to placeholder env** instead of failing hard in prod | **Medium** | `lib/supabase/{server,anon,client,admin}.ts` |
| CSP allows `script-src 'unsafe-inline'` in production; no HSTS | **Low/Med** | `middleware.ts:150` |

**Fixes:**
- Add a guard to the top of every create/update/delete action — `getUser()` then
  `profiles.role === 'admin'`. The pattern already exists in
  `app/actions/revalidate.ts` (`purgeCache`); copy it.
- Rewrite the three loose RLS policies to the
  `auth.uid() IN (SELECT id FROM profiles WHERE role='admin')` form already used correctly
  by `consoles`, `roadmap`, and `releases`. **Back up Supabase before the migration**
  (per project HARD RULES).
- Move the IndexNow key to `process.env.INDEXNOW_API_KEY`.
- Reuse the IP rate-limit pattern from `app/actions/reviews.ts` / `search.ts` on
  `subscribeEmail`.
- `.parse()` action inputs against the existing Zod schemas before any DB write.

**Already sound (no action):** middleware admin role-gating logic, service-role key
isolation (server-only, never `NEXT_PUBLIC_`), the security-header set
(`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`,
CSP), and parameterized Supabase queries (no SQL injection surface).

---

## C. Performance

- **Fonts:** Press Start 2P, JetBrains Mono, and Share Tech Mono are declared without a
  `display` directive (`app/layout.tsx:15-33`), so they block rendering and cause layout
  shift. Add `display: 'swap'` (Inter already has it).
- **Images:** `images.unoptimized: true` is a **project HARD RULE — keep it.** Mitigate
  instead: ensure `sizes`/responsive props on every `next/image`, lazy-load
  below-the-fold imagery, and shrink the oversized files in `/public`
  (`gameboy_color.png` ~6.2MB, `brand-logo.png` ~1.5MB) — these dominate payload regardless
  of the optimizer setting.
- **Bundle:** 69 `'use client'` components and no analyzer in the build. Add
  `@next/bundle-analyzer` and review the largest (`FabricatorDetailClient` ~616 lines,
  `ConsoleVaultClient` ~455 lines) for server-component eligibility.
- **Loading UX:** only a single generic `RetroLoader`; add skeleton states for the
  `/consoles` grid and finder steps to improve perceived performance.

---

## D. SEO

- **Fabricator pages** (`app/fabricators/[slug]`) use the default title template — add a
  per-brand `generateMetadata` (e.g. "Anbernic Handhelds | The Retro Circuit").
- **Duplicate descriptions:** the ~66 console pages share a near-identical templated meta
  description; Google will ignore and self-generate snippets. Vary by spec.
- **News URLs are UUID-based** (`/news/[id]`) — no keyword signal. Migrate to slug-based
  URLs.
- **AI-crawler blocking:** `app/robots.ts` blocks GPTBot, AnthropicAI, Google-Extended,
  etc. — which keeps the site out of AI overviews. Confirm this is a deliberate strategic
  choice, not an accident.
- **Structured data is solid:** Website/Organization/Product JSON-LD is present and the
  `availability` field now derives from ASIN/release state rather than a hardcoded
  `InStock`.

---

## E. UX & Retention  *(where growth actually comes from)*

- **No revenue and no return loop.** Affiliate buy links are unwired (`[NO LIVE DATA
  FEEDS]`) and there's no email capture anywhere. These are the two highest-leverage gaps
  per `docs/CLAUDEAUDIT.md` and `docs/PENDING_FEATURES.md`. Add affiliate links + an email
  capture on the homepage and the Finder results screen.
- **No funnel analytics.** Vercel Analytics is wired but there are no custom events, so
  quiz completion, device clicks, and the quiz → compare → buy funnel are invisible. Add
  custom events.
- **Feature completeness:** the Finder still shows a "work in progress" banner; Arena is
  limited to 2 devices with no shareable URLs.
- **Accessibility:** 10px mobile text (raise to ≥12px), black-on-black fabricator logos,
  and partial `alt` coverage. Branded `error.tsx`/`not-found.tsx` are good; no error
  monitoring (e.g. Sentry) is in place.

---

## Prioritized roadmap

> **Status:** P0 (compute/rendering) and P1 (security hardening) were implemented on
> branch `claude/site-audit-performance-mvybyg`. The RLS policy fix is staged as a
> migration (`supabase/migrations/20260626000000_fix_rls_admin_policies.sql`) to be applied
> **after a database backup**, per project rules. P2/P3 remain open.

| Priority | Theme | Items |
|---|---|---|
| **P0** | **Compute / cost** *(the Fluid Compute fix)* | Gate middleware auth to protected routes · move render-time public reads to `supabaseAnon` · ISR + cache tags. *Biggest savings, lowest risk.* |
| **P1** | **Security** | Admin guards on mutations · fix 3 RLS policies · IndexNow key → env · rate-limit signup · enforce Zod |
| **P2** | **Revenue & retention** | Wire affiliate links · email capture on home + finder results · funnel analytics |
| **P3** | **Perf / SEO / a11y polish** | Font `display: swap` · bundle analyzer · fabricator metadata · unique descriptions · skeletons · mobile text size · logo contrast |

---

## Appendix — key files referenced

- Rendering/compute: `middleware.ts`, `lib/supabase/server.ts`, `lib/supabase/anon.ts`,
  `app/consoles/page.tsx`, `app/news/page.tsx`, `app/actions/{news,reviews,signals,manufacturers,consoles}.ts`
- Security: `app/actions/*`, `supabase/migrations/*.sql`, `lib/indexnow.ts`,
  `app/actions/subscribers.ts`, `lib/schemas/validation.ts`
- Performance/SEO/UX: `app/layout.tsx`, `app/fabricators/[slug]/page.tsx`,
  `app/sitemap.ts`, `app/robots.ts`, `next.config.mjs`, `public/`, `components/`
