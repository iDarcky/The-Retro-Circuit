# Technical Manual: The Retro Circuit

## 1. System Overview
**The Retro Circuit** is a high-performance, data-driven platform dedicated to cataloging and comparing handheld gaming consoles. It serves as a "Wikipedia for Handhelds" with deep technical specifications and real-world emulation performance metrics.

### Core Architecture
- **Frontend:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Custom Retro/Cyberpunk Theme)
- **Backend/Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (SSR Integration)
- **Deployment:** Vercel (Recommended)

---

## 2. Tech Stack & Dependencies

### Framework
- **Next.js 14:** Utilizes the App Router for nested layouts and React Server Components (RSC) for optimal performance.
- **React 18:** Functional components with extensive use of Hooks.

### State Management & Data Fetching
- **Server Components:** Primary method for data fetching to reduce client bundle size and improve SEO.
- **Supabase Client:** Singleton pattern used for client-side interactions (Auth, real-time updates).
- **Zod:** Runtime schema validation for all data ingress/egress.

### UI/UX
- **Tailwind CSS:** Utility-first styling.
- **Headless UI / Radix UI:** Accessible primitive components (if applicable).
- **Framer Motion:** (Potential future use for animations, currently CSS transitions).
- **Lucide React:** Iconography.

---

## 3. Database Schema
The database is normalized to handle the complex relationships between manufacturers, console families, specific hardware variants, and their emulation capabilities.

### Core Tables

#### `manufacturers`
Entities that create the hardware (e.g., Nintendo, Sony, Ayaneo).
- `id` (UUID, PK)
- `name` (Text)
- `slug` (Text, Unique)
- `description` (Text)
- `country` (Text)
- `founded_year` (Int)
- `website` (Text)
- `key_franchises` (Text)
- `image_url` (Text)

#### `consoles`
The abstract family or model line (e.g., "Game Boy Advance", "Steam Deck").
- `id` (UUID, PK)
- `manufacturer_id` (UUID, FK -> manufacturers)
- `name` (Text)
- `slug` (Text, Unique)
- `description` (Text)
- `form_factor` (Text)
- `release_year` (Int)
- `generation` (Text)
- `device_category` (Enum: 'emulation', 'pc_gaming', 'fpga', 'legacy')

#### `console_variants`
The specific hardware SKU with concrete specs (e.g., "GBA SP AGS-101", "Steam Deck OLED 1TB").
- `id` (UUID, PK)
- `console_id` (UUID, FK -> consoles)
- `variant_name` (Text)
- `slug` (Text, Unique)
- `is_default` (Boolean) - *Determines the representative model for the family.*
- **Specs Columns:** ~50 columns covering CPU, GPU, RAM, Screen, Battery, I/O, Dimensions, etc. (See `lib/types/domain.ts` for full list).

#### `emulation_profiles`
Performance data for a specific variant running various legacy systems.
- `id` (UUID, PK)
- `variant_id` (UUID, FK -> console_variants)
- `ps2_state`, `gamecube_state`, `wii_state`, `switch_state`, etc. (Text/Enum)
- `summary_text` (Text)
- `last_verified` (Date)

### User & Content Tables
- `user_profiles`: Extends Supabase Auth users with roles (Admin/User) and avatars.
- `user_collections`: Tracks 'OWN' vs 'WANT' lists for users.
- `news_items`: Blog/News content.
- `games`: "Game of the Week" and other highlighted software titles.

---

## 4. Key Code Patterns

### Data Fetching Strategy
We prioritize **Server-Side Rendering (SSR)** and **Static Site Generation (SSG)** via ISR (Incremental Static Regeneration).
- **Path:** `lib/api/` contains all Supabase queries.
- **Pattern:** Functions like `fetchAllConsoles()` accept an optional `SupabaseClient` to allow context switching between Server (Cookie-based) and Client (Local Storage) auth.

### Validation
All external data and form inputs are validated using **Zod** schemas located in `lib/schemas/validation.ts`.
- **Strict Typing:** TypeScript interfaces in `lib/types/domain.ts` mirror the Database Schema but are often inferred or validated against Zod schemas to ensure type safety at runtime.

### Admin Portal
Located at `/app/admin`.
- **Dynamic Forms:** Uses a configuration-driven approach (`lib/config/constants.ts`) to render massive forms for Console/Variant entry without repeating JSX.
- **Authentication:** Middleware-protected routes ensure only users with `role: 'admin'` can access these pages.

---

## 5. Directory Structure
```
.
├── app/                 # Next.js App Router (Pages, Layouts, API Routes)
├── components/          # React Components
│   ├── console/         # Console-specific UI (Cards, grids, details)
│   ├── ui/              # Reusable UI elements (Buttons, Inputs)
├── lib/                 # Core Logic
│   ├── api/             # Database access functions
│   ├── config/          # Constants and static config
│   ├── schemas/         # Zod validation schemas
│   ├── supabase/        # Supabase client setup
│   └── types/           # TypeScript interfaces
├── public/              # Static assets (images, fonts)
└── styles/              # CSS & Tailwind configuration
```

## 6. Development Workflow
1.  **Environment:** Requires `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2.  **Linting:** ESLint is configured, but currently set to `ignoreDuringBuilds` in production to allow for rapid iteration.
3.  **Testing:** Manual verification + Playwright (scripts in `verification/`).

## 7. Security
- **Middleware:** `middleware.ts` handles session refreshment and route protection.
- **RLS (Row Level Security):** Supabase database policies restrict write access to Admins, while keeping read access public for core content.
