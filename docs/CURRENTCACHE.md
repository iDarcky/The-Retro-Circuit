# Route Caching Audit & Implementation Report

This document reflects the current Next.js caching and revalidation configuration for all routes in the application, updated after the optimization implementation.

## Guiding Principles
- **Admin Managed Content:** Pages driven by backend data use `revalidate = false` (indefinite cache) and rely on On-Demand Revalidation (`revalidatePath`) triggered by Admin Server Actions.
- **Infinite Permutations:** Pages driven by infinite combinations of data (e.g., VS Arena) use `revalidate = 3600` (1 hour ISR).
- **Static Content:** Pages that rarely or never change are fully static (`○`).
- **Admin / User Content:** Auth-gated or per-user views remain strictly Dynamic (SSR) (`ƒ`).

---

## Public Pages

| Route | Type | Revalidate | Fetching Supabase? | Notes |
| :--- | :---: | :---: | :---: | :--- |
| `/` (Home) | Static (`○`) | `false` | Yes (`releases`) | Caches indefinitely. Revalidated on release updates. |
| `/about` | Static (`○`) | `false` | Yes (`consoles`, `releases`) | Caches indefinitely. Revalidated on console/release updates. |
| `/credits` | Static (`○`) | `false` | Yes (`releases`) | Caches indefinitely. Revalidated on release updates. |
| `/terms` | Static (`○`) | `false` | No | Purely static content. |
| `/privacy` | Static (`○`) | `false` | Yes (`releases`) | *Fixed.* Previously Fully Dynamic due to layout pollution. Now fully static. |
| `/design` | Static (`○`) | `false` | No | Purely static component showcase. |
| `/finder` | Static (`○`) | `false` | No | Purely static quiz view. |
| `/login` | Static (`○`) | `false` | No | Auth check handled strictly client-side. |
| `/profile` | Dynamic (`ƒ`) | None | Yes (`profiles`) | Strictly dynamic for authenticated user sessions. |

## Content Pages

| Route | Type | Revalidate | Fetching Supabase? | Notes |
| :--- | :---: | :---: | :---: | :--- |
| `/consoles` | Static (`○`) | `false` | Yes (`consoles`, `manufacturer`) | *Optimized.* Changed from 60s ISR to indefinite. Revalidated on console/manufacturer updates. |
| `/consoles/[slug]` | Static (`○`) | `false` | Yes (Deep relations) | *Optimized.* Pre-built at deploy via `generateStaticParams`. Changed from 1h ISR to indefinite. Invalidated on save. |
| `/consoles/brand/[name]`| Static (`○`) | `false` | Yes (`manufacturer`) | Caches indefinitely. Revalidated on manufacturer updates. |
| `/fabricators` | Static (`○`) | `false` | Yes (`manufacturer`) | *Optimized.* Changed from 10m ISR to indefinite. Revalidated on manufacturer updates. |
| `/fabricators/[slug]` | Static (`○`) | `false` | Yes (`manufacturer`, `consoles`) | *Optimized.* Pre-built at deploy via `generateStaticParams`. Changed from 1h ISR to indefinite. |
| `/news` | Static (`○`) | `false` | Yes (`signals`, `news`, `reviews`)| *Optimized.* Changed from 5m ISR to indefinite. Revalidated via Server Actions when new items are published. |
| `/arena/[[...versus]]` | Dynamic/ISR| `3600` | Yes (`consoles`, `variants`) | Set to 1 hour ISR. Infinite URL combinations make static generation impossible. |
| `/roadmap` | Static (`○`) | `false` | Yes (`roadmap_features`) | *Fixed.* Removed `force-dynamic` (huge CPU drain). Now builds fully static. Admin drafts fetch moved to `/admin/roadmap`. |

## Admin Pages

*All Admin routes (`/admin/*`) remain strictly Dynamic (`ƒ`) and SSR due to authentication and role-based access control checking at the server level.*

- `/admin`
- `/admin/consoles`
- `/admin/consoles/[slug]`
- `/admin/fabricators`
- `/admin/news`
- `/admin/reviews`
- `/admin/signals`
- `/admin/roadmap`
- `/admin/broadcast`
- `/admin/preview/consoles/[slug]` (Uses `export const dynamic = 'force-dynamic'`)

---

## Server Action Invalidation Map

The following Server Actions have been updated to trigger `revalidatePath` upon successful database writes:

- **Consoles (`addConsole`, `updateConsole`, `deleteConsole`):**
  - `/consoles`
  - `/consoles/[slug]`
  - `/`
  - `/about`
- **Console Variants (`addConsoleVariant`, `updateConsoleVariant`):**
  - `/consoles/[parent-console-slug]`
- **Manufacturers/Fabricators (`addManufacturer`, `updateManufacturer`, `deleteManufacturer`):**
  - `/fabricators`
  - `/fabricators/[slug]`
  - `/consoles/brand/[slug]`
- **Roadmap & Releases (`createRoadmapItem`, `updateRoadmapItem`, `createRelease`, etc.):**
  - `/roadmap`
  - `/`
  - `/credits`
  - `/about`
- **News, Signals, Reviews:**
  - `/news`
  - `/admin/news`
