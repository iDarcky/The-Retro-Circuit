# Optimization Log

## Vercel Fluid CPU & Rate Limiting Overhaul

**Date:** March 2026

### The Problem
The application was experiencing critically high usage of Vercel Fluid Compute limits, leading to potential exhaustion of the free tier. An audit of the Vercel dashboard revealed that heavy Next.js Server-Side Rendered (SSR) routes and Incremental Static Regeneration (ISR) routes were consuming up to 11 seconds of compute time per request, particularly on the Homepage (`/`), Console Vault (`/consoles`), and dynamic routes like `/consoles/[slug]`.

Additionally, uncaught malformed URLs were causing internal 500 errors by attempting to map null objects.

### The Solutions Implemented

#### 1. Caching Strategy Overhaul
Shifted the primary caching mechanism from time-based Incremental Static Regeneration (e.g., `revalidate = 60`) to an indefinite static cache (`revalidate = false`).
- **Impacted Routes:** `/`, `/consoles`, `/news`, `/fabricators`, `/fabricators/[slug]`, and `/consoles/[slug]`.
- **Reasoning:** Since the application content is exclusively managed via the Admin Dashboard, rebuilding heavy data-fetching pages every 60 seconds (when traffic hits) was a massive waste of compute.
- **New Flow:** Pages are built statically once. They are only rebuilt on-demand when an admin explicitly saves a change, triggering `revalidatePath` via a Server Action.

#### 2. Roadmap Page Refactor
- The `/roadmap` page was previously forced to dynamically render on every visit (`export const dynamic = 'force-dynamic'`) to check if the current user was an admin in order to display edit controls.
- **Fix:** Removed the dynamic export, allowing the public roadmap to be built completely statically. Created a new protected route at `/admin/roadmap` specifically for editing drafts.

#### 3. Global Rate Limiting Protection
- Implemented `@upstash/ratelimit` directly within `middleware.ts`.
- **Configuration:** 300 requests per minute per IP.
- **Reasoning:** Bot scrapers were hitting dynamic routes (like the infinite permutations of `/arena/[...versus]`), causing Vercel to spin up compute for every arbitrary combination. The new middleware intercepts excessive traffic at the Edge, returning a `429 Too Many Requests` response *before* any CPU-intensive rendering or database querying begins. Bypasses are in place for Next.js internal `_next` requests and static assets.

#### 4. Database Query Optimization & Error Handling
- The `resolveConsoleSlug` function in both the Arena and Console Detail pages was previously fetching the *entire* `consoles` database into application memory to find a matching slug.
- **Fix:** Refactored the logic to split incoming slugs (e.g., `anbernic-rg35xx`) and execute a precise database lookup (`eq('slug', ...)`).
- **Error Resolution:** Added strict null-safety and proper Next.js `notFound()` fallback logic to prevent 500 Server Errors when a user or bot accesses a malformed or non-existent URL.

### Future Recommendations
1. **Static OpenGraph Images:** Move away from `satori` dynamic OpenGraph generation (`opengraph-image.tsx`) to pre-rendered `.png` files stored in Supabase to further reduce edge compute.
2. **Client-Side Arena Data:** Fetch VS comparison data directly from the client's browser (via Supabase JS) rather than resolving comparisons via Next.js Server Components, removing Arena render load from Vercel entirely.
