# Rendering Strategy Audit

## Route Inventory

| Route | Current Strategy | Proposed Strategy | Rationale |
| :--- | :--- | :--- | :--- |
| `/` (Home) | **SSR** (implied) | **ISR (60s)** | The home page is high-traffic but data-heavy (latest consoles, news). ISR allows fast initial load with periodic freshness without slamming the DB on every hit. Currently uses `revalidate = 60` export, so it is already effectively ISR. |
| `/about` | **Static** | **Static** | Pure content. No data fetching. Should be statically generated at build time. |
| `/privacy` | **Static** | **Static** | Pure content. |
| `/terms` | **Static** | **Static** | Pure content. |
| `/credits` | **Static** | **Static** | Pure content. |
| `/news` | **Static** (Placeholder) | **ISR (5m)** | Once implemented, news feeds change infrequently. 5-minute revalidation is sufficient. Currently static placeholder. |
| `/login` | **CSR** (`use client`) | **CSR** | Authentication is inherently client-side. Redirection logic relies on browser state. Keep as CSR. |
| `/profile` | **N/A** (New) | **CSR** | User profile data is private and dynamic. Requires client-side auth state. |
| `/finder` | **CSR** (`use client`) | **CSR** | Interactive quiz with complex state management. Best handled on client. |
| `/arena` | **CSR** (`use client`) | **CSR** | Complex interactive comparison tool with URL state sync. Requires client-side interactivity. |
| `/admin/*` | **CSR** (`use client`) | **CSR** | Secure, dynamic, low-traffic interface. Client-side fetching allows for better interactivity and live feedback (toasts, validation). |
| `/consoles` (Vault) | **SSR/Dynamic** | **ISR (60s)** | The main list is heavy. 60s revalidation balances freshness with performance. Currently uses `force-dynamic` which kills cache performance. |
| `/consoles/[slug]` | **SSR/Dynamic** | **ISR (On-Demand)** | Console details rarely change. Use ISR with a long revalidation time (e.g., 1 hour) or On-Demand Revalidation when updated via Admin. Currently dynamic. |
| `/fabricators` | **SSR/Dynamic** | **ISR (60s)** | Similar to Consoles list. List of manufacturers changes rarely. |
| `/fabricators/[slug]` | **SSR/Dynamic** | **ISR (On-Demand)** | Manufacturer details are stable. |

## Implementation Notes

1.  **Home Page**: Currently uses `export const revalidate = 60;`. This is correct for ISR.
2.  **Console Vault (`/consoles`)**: Currently uses `export const dynamic = 'force-dynamic'`. **Upgrade**: Change to `revalidate = 60` (or remove `force-dynamic` and rely on fetch caching) to enable ISR.
3.  **Console Details (`/consoles/[slug]`)**: Currently defaults to dynamic because of `searchParams` usage or lack of `generateStaticParams`. **Upgrade**: Implement `generateStaticParams` for top 50 consoles or allow ISR fallback.
4.  **Admin**: Keep as is. The `use client` with `useEffect` auth check is standard for this architecture (though Middleware protection is added for security).
5.  **Profile**: New page to be created as CSR.

## Middleware Strategy
- Implement `middleware.ts` to handle:
    - **Auth Guards**: Redirect `/profile` to `/login` if no session.
    - **Guest Guards**: Redirect `/login` to `/profile` if session exists.
    - **Admin Guards**: Keep existing logic for `/admin`.
