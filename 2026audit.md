# The Retro Circuit 2026 Audit Report

This report outlines 20 exhaustive audits designed to ensure The Retro Circuit remains a secure, high-performing, and engaging platform.

## 1. Performance & Architecture

### 1.1 Bundle Size & Dependencies
- **Why it matters:** Heavy JavaScript bundles slow down the initial load time, heavily impacting mobile users and Core Web Vitals.
- **How it works:** The audit checks `package.json` for unused or bloated libraries and ensures Next.js tree-shaking is properly removing dead code.
- **Where it is located:** `package.json`, `pnpm-lock.yaml`, and component imports across `app/` and `components/`.
- **Who is impacted:** Users on slower network connections; Developer experience (build times).

### 1.2 Caching Strategy Alignment
- **Why it matters:** Over-fetching database data drains Supabase resources, while under-fetching delivers stale data to the user.
- **How it works:** Validates that `export const revalidate` rules explicitly follow the constraints defined in `docs/CURRENTCACHE.md`.
- **Where it is located:** Server components in `app/`, specifically `page.tsx` files.
- **Who is impacted:** End users (page speed), Database infrastructure (Supabase costs).

### 1.3 Image Optimization Check
- **Why it matters:** Raw images are massive. However, Vercel's automatic image optimization is disabled globally to avoid expensive transformation limits.
- **How it works:** Checks the codebase and Supabase storage to ensure all graphical assets are manually converted to lightweight `.webp` formats.
- **Where it is located:** `next.config.mjs` (`unoptimized: true`) and image upload utilities in `components/ui/ImageUpload.tsx`.
- **Who is impacted:** End users (bandwidth usage and visual load speed).

### 1.4 Supabase Query Efficiency
- **Why it matters:** Deep relational queries `select('*, table(*)')` can easily trigger N+1 query problems, exposing massive payload sizes to the frontend.
- **How it works:** Traces data fetching routes and server actions to ensure `select()` clauses restrict fields to only what is necessary for the UI.
- **Where it is located:** Server Actions (`app/actions/`) and direct component queries.
- **Who is impacted:** Platform scaling and overall API latency.

### 1.5 React Re-render & State Stability
- **Why it matters:** Using unstable identifiers (like `[initialData]` object references) in `useEffect` dependency arrays can cause Admin forms to wipe out unsaved user input unexpectedly when parent components re-render.
- **How it works:** Scans `useEffect` dependencies ensuring stable primitives like `initialData?.id` are used instead of full objects.
- **Where it is located:** Admin components in `components/admin/` (e.g., `ConsoleForm.tsx`, `VariantForm.tsx`).
- **Who is impacted:** Admin/Product Managers (prevents data loss and frustration).

## 2. SEO & Discoverability

### 2.1 Metadata & Canonical Links
- **Why it matters:** Without precise metadata, search engines will construct poor snippets, destroying Click-Through Rates (CTR).
- **How it works:** Validates the implementation of `generateMetadata` to prevent double titling (using `{ absolute: '...' }`) and ensure canonicals avoid duplicate content penalties.
- **Where it is located:** `app/layout.tsx` (default config), `config/site.ts`, and individual page headers.
- **Who is impacted:** Marketing team (organic traffic acquisition).

### 2.2 Structured Data Validation (JSON-LD)
- **Why it matters:** JSON-LD allows Google to understand entities (like "Consoles" or "Manufacturers") directly, enabling rich product snippets in search results.
- **How it works:** Audits the injection of `<script type="application/ld+json">` schemas to ensure valid schema.org mappings.
- **Where it is located:** Injected via `dangerouslySetInnerHTML` inside `app/layout.tsx`, `app/news/page.tsx`, and detail pages.
- **Who is impacted:** SEO visibility and search engine bots.

### 2.3 OpenGraph Generation
- **Why it matters:** When users share a link on Discord, X (Twitter), or Reddit, the OpenGraph image acts as the free billboard.
- **How it works:** Reviews dynamic image generation leveraging `next/og`, ensuring the edge runtime is disabled to prevent font-fetch instability.
- **Where it is located:** `app/consoles/[slug]/opengraph-image.tsx` and static fallback `/og-v2.png`.
- **Who is impacted:** Social media audiences and user shareability.

### 2.4 Crawling Rules
- **Why it matters:** Indexing admin or API routes wastes crawl budget and leaks internal routing structures to the public internet.
- **How it works:** Audits the output of the dynamic robots configuration to verify `Disallow` rules for protected namespaces.
- **Where it is located:** `app/robots.ts` and `app/sitemap.ts`.
- **Who is impacted:** Search Engine Crawlers (Googlebot, Bingbot).

### 2.5 IndexNow & Redirects
- **Why it matters:** Search engines can take weeks to notice new content. IndexNow forces an immediate crawl, vital for timely news releases.
- **How it works:** Confirms that publishing actions ping the IndexNow API and that legacy routes (e.g., `.html` files) correctly 301 redirect.
- **Where it is located:** `lib/indexnow.ts`, `app/actions/news.ts`, and `next.config.mjs`.
- **Who is impacted:** Fast-paced organic traffic (News/Rumors readers).

## 3. Security & Data

### 3.1 Supabase Row Level Security (RLS)
- **Why it matters:** The database is exposed directly to the internet. Without RLS, malicious actors could delete or corrupt the entire catalog.
- **How it works:** Inspects PostgreSQL policies ensuring only verified `admin` roles via `auth.uid()` can execute INSERT/UPDATE/DELETE.
- **Where it is located:** Supabase dashboard and migration files (`supabase/migrations/`).
- **Who is impacted:** The core integrity of the business data.

### 3.2 Form Payload Sanitization
- **Why it matters:** Submitting deeply nested joined data objects back to Supabase `update()` triggers silent database errors because those keys don't exist as columns.
- **How it works:** Audits server actions to ensure strict destructuring and removal of related fields before committing writes to the database.
- **Where it is located:** `app/actions/consoles.ts`, `app/actions/roadmap.ts`.
- **Who is impacted:** Admin users (prevents frustrating silent save failures).

### 3.3 Rate Limiting
- **Why it matters:** Unchecked API endpoints are highly vulnerable to scraping, DDoS attacks, and spam form submissions.
- **How it works:** Reviews Upstash Redis integration parsing `x-forwarded-for` headers to correctly track IP limits and degrade gracefully if Redis fails.
- **Where it is located:** `middleware.ts` and `lib/rate-limit.ts`.
- **Who is impacted:** Server infrastructure (protects against abuse) and end users (protects service uptime).

### 3.4 Protected Route Gating
- **Why it matters:** Exposing the `/admin` UI to unauthorized users is an immediate security breach.
- **How it works:** Confirms the Next.js middleware intercepts route requests, checks the Supabase session, and forces redirects to `/login` for unauthenticated requests.
- **Where it is located:** `middleware.ts`.
- **Who is impacted:** System Administrators and unauthorized actors.

### 3.5 Content Security & Headers
- **Why it matters:** Cross-Site Scripting (XSS) and Clickjacking can compromise user sessions.
- **How it works:** Audits the HTTP response headers (CSP, X-Frame-Options, Permissions-Policy) strictly enforced at the Edge.
- **Where it is located:** `middleware.ts`.
- **Who is impacted:** End user browser security.

## 4. Accessibility & UI (Swiss Design System)

### 4.1 Color Contrast & Theming
- **Why it matters:** The Swiss Industrial theme relies heavily on stark contrasts. Poor contrast makes the site unusable for visually impaired users.
- **How it works:** Validates contrast ratios of the primary zinc backgrounds against text and accent colors (Orange, Sky, Rose) in `.dark` mode.
- **Where it is located:** `app/globals.css`, `tailwind.config.js`.
- **Who is impacted:** Visually impaired users and overall aesthetic clarity.

### 4.2 Semantic HTML & ARIA
- **Why it matters:** Screen readers rely heavily on native HTML semantics (`<main>`, `<nav>`) and ARIA labels to navigate interfaces.
- **How it works:** Audits interactive elements (like custom Markdown renderers or modal close buttons) to ensure proper `aria-label` tags exist.
- **Where it is located:** Widespread across UI components (`components/ui/`, `components/roadmap/`).
- **Who is impacted:** Users relying on assistive technologies (Screen Readers).

### 4.3 Keyboard Navigation
- **Why it matters:** Power users and motor-impaired users rely strictly on keyboard controls.
- **How it works:** Ensures modals trap focus properly, that `Escape` keys close overlays, and that elements utilize proper `tabIndex` rules.
- **Where it is located:** `components/console/swiss/SwissModal.tsx` and custom inputs.
- **Who is impacted:** Power users, motor-impaired users.

### 4.4 Touch Targets & Layout
- **Why it matters:** Mobile screens are small; "fat finger" clicks lead to high bounce rates if links are too small.
- **How it works:** Confirms that hit-boxes use full-box models (`w-full h-full`) expanding beyond textual boundaries.
- **Where it is located:** `components/layout/MobileTopBar.tsx`, `components/layout/DesktopHeader.tsx`.
- **Who is impacted:** Mobile users.

## 5. Marketing & Retention (Fun / Growth)

### 5.1 Interactive Engagement (VS Arena)
- **Why it matters:** Static databases are boring. The VS Arena turns specifications into a head-to-head game, driving massive user time-on-site.
- **How it works:** Audits the UI pathways (like the QuickCompare module on the Home page) that funnel users directly into color-coded (Cyan/Orange) Arena matchups.
- **Where it is located:** `app/arena/`, `components/arena/`, and Home page QuickCompare.
- **Who is impacted:** Core users (gamifies the research process).

### 5.2 Value Proposition & Visual Brand Identity
- **Why it matters:** A strong brand creates cult-like loyalty. "The Retro Circuit" relies on its "Pre-Alpha/Industrial" aesthetic to stand out from generic wikis.
- **How it works:** Audits typography (`Press Start 2P`, `JetBrains Mono`), specialized terminology ("Fabricators", "Uplink Established"), and UI layouts to ensure strict brand compliance.
- **Where it is located:** `app/layout.tsx`, `config/site.ts`, `components/console/swiss/`.
- **Who is impacted:** The target audience (creates deep immersion and trust).

### 5.3 Return Triggers (News & Roadmap)
- **Why it matters:** Users need a reason to come back after they've bought a console.
- **How it works:** Audits the visibility and implementation of the active Roadmap (Upcoming/Changelog tabs) and the "Transmission Feed" (News/Rumors) to ensure they hook users into the development lifecycle.
- **Where it is located:** `app/roadmap/`, `app/news/`, and their respective Admin actions.
- **Who is impacted:** Returning users, community engagement metrics.

## 6. Code Quality

### 6.1 TypeScript Type Safety
- **Why it matters:** Loose types lead to runtime crashes. Standardized variants ensure UI consistency.
- **How it works:** Audits components like `SwissButton` to enforce strict variant rules (e.g., rejecting 'outline' or 'ghost') and reducing the usage of `any` casting in critical paths.
- **Where it is located:** `components/ui/`, `lib/types/`, and server actions.
- **Who is impacted:** Engineering team (prevents regressions and speeds up development).
