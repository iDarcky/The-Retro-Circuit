# System Architecture Map

This document provides a high-level overview of the application's architecture, organized by functional module.

## 01. Core Configuration & Root
Configuration files that define the build, routing, and deployment environment.

- **`next.config.mjs`**: Next.js configuration, including image domain whitelisting (`supabase.co`) and redirects.
- **`proxy.ts`**: Replaces the standard `middleware.ts` for Next.js 14+. Handles Supabase session management via `@supabase/ssr` to ensure secure routing and data access.
- **`vercel.json`**: Vercel-specific configuration, primarily used for handling legacy redirects (e.g., mapping old `.html` paths to new routes).
- **`tailwind.config.js`**: Defines the "Cyberpunk Terminal" design system, including custom fonts (`pixel`, `tech`, `mono`), colors, and animations.
- **`SystemMap.tsx`**: (Currently Empty) Placeholder for future system mapping logic or documentation.

## 02. Application Router (`app/`)
The routing structure, leveraging Next.js 14 App Router and Server Components.

### Features
- **`consoles/`**: The "Console Vault". Displays lists of handhelds and detailed specs for individual devices.
    - `[slug]/`: Dynamic route for specific console details.
    - `brand/[name]/`: Brand-specific filtered views.
- **`fabricators/`**: Manufacturer database. Lists companies and their associated hardware lineages.
- **`arena/`**: The Comparison Engine.
    - `[versus]/`: Handles dynamic "Head-to-Head" comparisons (e.g., `/arena/retroid-pocket-4-pro-vs-odin-2`).
- **`admin/`**: The "Terminal" backend for data management. Protected by Role-Based Access Control (RBAC).
- **`finder/`**: The interactive "Perfect Console Finder" quiz. Uses a state-machine approach to recommend devices.
- **`news/`**: (Coming Soon) Placeholder for the news feed feature.
- **`credits/`**: Acknowledgements page.

### Global Logic
- **`layout.tsx`**: The Root Layout. wraps the application in the `MainLayout` shell and initializes global contexts (Sound, Search).
- **`global-error.tsx`**: Custom "Blue Screen of Death" / System Halt error page.
- **`sitemap.ts` / `robots.ts`**: SEO utilities for search engine indexing.

## 03. Component Library (`components/`)
Reusable UI elements, organized by feature scope.

### Feature Components
- **`admin/`**: Form components for creating/editing Consoles, Variants, and Manufacturers. Includes complex inputs like `AdminEditTrigger` and `VariantForm`.
- **`arena/`**: Comparison-specific UI, including the `ConsoleSearch` dropdown and `ComparisonRow` logic.
- **`console/`**:
    - `ConsoleVaultClient.tsx`: Client-side grid for filtering and displaying consoles.
    - `ConsoleDetailView.tsx`: The rich detail view for a single product.
    - `EmulationGrid.tsx`: Visual matrix of performance ratings (NES, SNES, PS2, etc.).
- **`finder/`**: Quiz UI components (`QuizQuestion`) and the results display engine (`FinderResults`).
- **`landing/`**: Homepage sections, including the "Hero" and "New in the Vault" marquee.

### Core UI & Layout
- **`layout/`**: The application shell structure.
    - `MainLayout.tsx`: Handles the responsive flexbox structure (Sidebar/Header/Content).
    - `DesktopHeader.tsx` / `MobileTopBar.tsx`: Responsive navigation bars.
- **`ui/`**: Atomic design elements.
    - `RetroStatusBar.tsx`: The breadcrumb/status bar visible on most pages.
    - `RetroLoader.tsx`: Custom CRT-style loading animation.
    - `specs/`: Standardized components for displaying technical specifications (`SpecCard`, `TechBadge`).

## 04. Library & Logic (`lib/`)
The backend logic, data access layer, and shared utilities.

### Data Access (`lib/api/`)
- **`consoles.ts`**: Fetches console data, handling the complex joins between Consoles -> Variants -> Emulation Profiles.
- **`manufacturers.ts`**: Fetches company profiles and linked devices.
- **`latest.ts`**: Retrieves the newest additions for the homepage.
- **`search.ts`**: Global search logic.

### Business Logic
- **`finder/scoring.ts`**: The algorithm for the "Perfect Console Finder". weighted scoring system based on user answers.
- **`compare.ts`**: Logic for normalizing and diffing specifications between two devices.
- **`supabase/`**:
    - `server.ts`: Secure client for Server Components (cookies).
    - `client.ts`: Browser client for client-side interactions.
    - `singleton.ts`: Shared instance to prevent connection leaks.

### Configuration & Types
- **`config/constants.ts`**: System-wide constants (e.g., form field definitions).
- **`schemas/validation.ts`**: Zod schemas for strict data validation on Admin forms.
- **`types/domain.ts`**: TypeScript interfaces mirroring the Supabase database schema.

## 05. Assets & Static Data
- **`public/`**: Static assets (images, fonts, favicons).
- **`data/`**: Hardcoded static data (e.g., avatar lists, static dropdown options) used to populate UI elements before API data is available.
