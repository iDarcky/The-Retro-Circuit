# Caching & Revalidation Implementation Plan
> For Jules · The Retro Circuit · March 2026
> Goal: eliminate unnecessary Supabase hits by caching all public pages forever and revalidating on-demand when data changes in the admin panel.

---

## Context

You previously audited all routes in this project and produced a caching report. This is the implementation plan based on that audit. The guiding principle is:

- Pages where **I change the data** → `revalidate = false` + `revalidatePath` fired from the relevant admin Server Action
- Pages where **user behaviour drives infinite combinations** → `revalidate = 3600`
- Pages that **never change** → fully static, leave as-is

`app/actions/revalidate.ts` already exists in the project. Use it.

---

## Task 1 — Fix `/roadmap` (HIGHEST PRIORITY)

**Problem:** `app/roadmap/page.tsx` has `export const dynamic = 'force-dynamic'`. This runs a full Supabase query for every single public visitor on every page load. It is the biggest CPU waste in the project.

**Root cause:** The page checks server-side auth to determine if the user is an admin, so it can show draft roadmap items. This one auth check forces the entire page dynamic.

**Fix:**
1. Remove `export const dynamic = 'force-dynamic'` from `app/roadmap/page.tsx`
2. Set `export const revalidate = false`
3. Remove the server-side admin/auth check from the page server component
4. Create a new Client Component (e.g. `AdminRoadmapDrafts`) that:
   - Runs client-side only
   - Checks if a user is logged in via the Supabase client
   - If logged in and admin, fetches draft items from Supabase client-side
   - If not logged in, renders nothing
5. Embed that Client Component into the page so public visitors get a fully static page and only admins trigger a DB call

**Acceptance criteria:** The `/roadmap` page builds statically. A logged-out user visiting `/roadmap` should result in zero Supabase calls.

---

## Task 2 — Fix `/privacy` (SECOND PRIORITY)

**Problem:** `app/privacy/page.tsx` is running as full SSR (Fully Dynamic). A privacy policy page has no reason to be dynamic.

**Fix:**
1. Identify what is forcing this page dynamic — likely a `cookies()`, `headers()`, or `searchParams` call somewhere in the page or its layout chain
2. Remove or isolate whatever is causing it
3. If the page calls `getSystemVersion`, either remove that call or move it so it doesn't force the page dynamic
4. Ensure the page builds as fully static with no `revalidate` needed

**Acceptance criteria:** `/privacy` builds statically at deploy time with no Supabase calls at runtime.

---

## Task 3 — Audit `/fabricators/[slug]` layout chain

**Problem:** `app/fabricators/[slug]/page.tsx` has `revalidate = 3600` set, but the audit flagged it may be force-dynamic due to layout pollution (cookies or auth checks in a parent layout).

**Fix:**
1. Trace the full layout chain for this route
2. Identify if any parent layout is importing `cookies()`, `headers()`, or auth checks that force all child routes dynamic
3. If so, isolate those checks so they don't bleed into public-facing pages
4. Confirm the page is actually running as ISR and that `revalidate` is being respected

**Acceptance criteria:** Confirm in Vercel logs or Next.js build output that `/fabricators/[slug]` is ISR, not SSR.

---

## Task 4 — Update revalidate values across public pages

For each file below, update the `revalidate` export to the value specified. No other logic changes needed for these.

| File | Change |
|---|---|
| `app/page.tsx` | `revalidate = 60` → `revalidate = false` |
| `app/consoles/page.tsx` | `revalidate = 60` → `revalidate = false` |
| `app/fabricators/page.tsx` | `revalidate = 600` → `revalidate = false` |
| `app/news/page.tsx` | `revalidate = 300` → `revalidate = false` |
| `app/about/page.tsx` | No revalidate set → add `export const revalidate = false` |
| `app/credits/page.tsx` | No revalidate set → add `export const revalidate = false` |
| `app/consoles/brand/[name]/page.tsx` | No revalidate set → add `export const revalidate = false` |
| `app/arena/[[...versus]]/page.tsx` | No revalidate set → add `export const revalidate = 3600` |

---

## Task 5 — Wire `revalidatePath` into all admin Server Actions

This is the core of the implementation. Every time I save data in the admin panel, the relevant public pages must be invalidated so they rebuild on next request.

Use the existing `app/actions/revalidate.ts`. For each admin action listed below, call `revalidatePath` (or `revalidateTag` if tags are already in use) **after** the Supabase write succeeds.

### Console actions (create, update, delete)
```ts
revalidatePath('/consoles')
revalidatePath(`/consoles/${slug}`)
revalidatePath('/')
revalidatePath('/about')
```

### Variant actions (create, update, delete)
```ts
revalidatePath(`/consoles/${consoleSlug}`)
// Note: Arena VS combinations are infinite so we rely on revalidate = 3600 for those
```

### Fabricator actions (create, update, delete)
```ts
revalidatePath('/fabricators')
revalidatePath(`/fabricators/${slug}`)
revalidatePath(`/consoles/brand/${name}`)
```

### Roadmap item actions (create, update, publish, delete)
```ts
revalidatePath('/roadmap')
revalidatePath('/')
```

### Signal / news / review actions (create, update, publish, delete)
```ts
revalidatePath('/news')
```

### System version update
```ts
revalidatePath('/credits')
revalidatePath('/about')
```

**Important:** Only fire revalidation after a confirmed successful write. Do not revalidate on validation errors or failed saves.

---

## Task 6 — Add `generateStaticParams` to console and fabricator detail pages

**Why:** Currently, when a new console is added and a user visits its page for the first time, Next.js has to build it on-demand (cold start). `generateStaticParams` pre-builds all known pages at deploy time.

### `app/consoles/[slug]/page.tsx`
```ts
export async function generateStaticParams() {
  const consoles = await getAllConsoles() // use existing fetch wrapper
  return consoles.map((c) => ({ slug: c.slug }))
}
```

### `app/fabricators/[slug]/page.tsx`
```ts
export async function generateStaticParams() {
  const fabricators = await getAllFabricators() // use existing fetch wrapper
  return fabricators.map((f) => ({ slug: f.slug }))
}
```

New consoles or fabricators added after a deploy will still be built on first request via ISR — `generateStaticParams` just ensures existing ones are pre-built.

---

## Acceptance Criteria — Full Implementation

- [ ] `/roadmap` is static for logged-out users, zero Supabase calls on public load
- [ ] `/privacy` builds statically at deploy time
- [ ] `/fabricators/[slug]` confirmed as ISR, not SSR
- [ ] All pages in Task 4 have correct revalidate values
- [ ] Every admin save action fires the correct `revalidatePath` calls
- [ ] `generateStaticParams` added to console and fabricator detail pages
- [ ] No regressions on admin pages (all admin routes remain fully dynamic)
- [ ] Verified in Vercel dashboard: CPU time on `/consoles/[slug]` and `/` drops significantly after first cache warm

---

## What NOT to change

- All `app/admin/*` pages — must stay fully dynamic, auth-gated
- `app/profile/page.tsx` — authenticated, per-user, must stay dynamic
- `app/login/page.tsx` — client-side auth, leave as-is
- `app/terms/page.tsx`, `app/design/page.tsx`, `app/finder/page.tsx` — already perfectly static
