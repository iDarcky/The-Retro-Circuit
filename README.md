# THE RETRO CIRCUIT
### The Golden Age of Gaming Hardware. Declassified.

```text
 _______ _          _____      _              _____ _                 _ _
|__   __| |        |  __ \    | |            / ____(_)               (_) |
   | |  | |__   ___| |__) |___| |_ _ __ ___ | |     _ _ __ ___ _   _ _| |_
   | |  | '_ \ / _ \  _  // _ \ __| '__/ _ \| |    | | '__/ __| | | | | __|
   | |  | | | |  __/ | \ \  __/ |_| | | (_) | |____| | | | (__| |_| | | |_
   |_|  |_| |_|\___|_|  \_\___|\__|_|  \___/ \_____|_|_|  \___|\__,_|_|\__|

  >> STATUS: ONLINE
  >> SYSTEM: NEXT.JS 16 // SUPABASE // TAILWIND // SWISS INDUSTRIAL
```

## 01. THE MISSION

**The Problem: Signal Noise**
The modern retro handheld market is a labyrinth of confusing naming conventions and fragmented specifications. A device like the "Retroid Pocket 4" isn't a single entity—it's a spectrum of SKUs, each with different RAM configurations, chipsets, and price points. For the enthusiast, distinguishing the "Base" from the "Pro" or the "Plus" is a manual, error-prone process.

**The Solution: Precision Engineering**
The Retro Circuit is a specialized comparison engine designed to bring order to this chaos. We treat gaming hardware with the rigorous precision of a technical datasheet. By implementing a structured, relational database that maps base hardware to specific performance variants, we provide the community with the definitive "GSMArena" for the handheld revolution.

**The Design: Swiss Industrial**
We reject the cluttered, neon-soaked "gamer" aesthetic common in this space. Instead, we adhere to a strict "Swiss Industrial" design philosophy: form follows function. Our interface prioritizes information density, legibility, and high-contrast typography (Inter, JetBrains Mono, Press Start 2P) over decoration. Every pixel serves a purpose.

> See [docs/DESIGN.md](docs/DESIGN.md) for the full Design System specification.

---

## 02. SYSTEM ARCHITECTURE

This platform is built on a modern, high-performance stack designed for scalability and speed. The architecture enforces strict type safety and relational data integrity.

### CORE
*   **Framework:** Next.js 16 (App Router)
*   **Language:** TypeScript (Strict Mode)
*   **State:** React Server Components (RSC) for optimized data fetching, React 19 Actions for mutations.
*   **Package Manager:** `pnpm`

### VISUAL INTERFACE
*   **Design System:** Tailwind CSS with custom configuration.
*   **Typography:** A functional triad of `Inter` (Body), `JetBrains Mono` (Data), and `Press Start 2P` (Headings).
*   **Theme:** Dark Mode Default ("Void" background with high-contrast signal colors).

### DATA LAYER
*   **Database:** Supabase (PostgreSQL)
*   **Schema:** Advanced Relational Design (One-to-Many Relationships for Manufacturers -> Consoles -> Variants).
*   **Security:** Row Level Security (RLS) policies for admin-only write access.

### INFRASTRUCTURE
*   **Hosting:** Vercel (Edge Network)
*   **Analytics:** Vercel Analytics (GDPR Compliant via Consent Mode)
*   **CI/CD:** Automated Preview & Production Deployments

---

## 03. KEY MODULES

### [A] THE ARCHIVE (CONSOLES & VARIANTS)
The core database. This module maps hardware lineage with precision:
*   **Manufacturers:** Corporate entities (e.g., Ayn, Retroid, Anbernic).
*   **Consoles:** The parent device definition (e.g., "Retroid Pocket 4").
*   **Variants:** The specific SKU execution (e.g., "Retroid Pocket 4 Pro - 8GB RAM"). This allows us to track performance differences within the same product line.

### [B] THE ARENA (VS MODE)
A dedicated comparison engine located at `/arena`.
*   **Side-by-Side:** Select any two devices to compare their specifications directly.
*   **Dynamic Analysis:** The system automatically highlights differences in critical specs (CPU, RAM, Screen, Battery).
*   **Shareable State:** Comparison states are URL-addressable for easy sharing.

### [C] THE FINDER (SEARCH & DISCOVERY)
An intelligent search interface located at `/finder`.
*   **Quiz Mode:** A guided wizard to help users find their perfect device based on budget, form factor, and desired emulation target (e.g., "I want to play PS2 under $200").
*   **Global Search:** Instant access to any console or manufacturer in the database.

### [D] THE COMMAND CENTER (ADMIN)
A restricted-access dashboard for platform operators (`/admin`).
*   **Data Management:** Full CRUD operations for Manufacturers, Consoles, and Variants.
*   **Roadmap Control:** Manage the public roadmap items and changelogs.
*   **Signal Management:** Control news feeds and featured devices.
*   **Security:** Protected by strict Role-Based Access Control (RBAC).

---

## 04. DEVELOPMENT

### PREREQUISITES
*   Node.js 20+
*   pnpm

### SETUP

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-org/retro-circuit.git
    cd retro-circuit
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Environment Variables:**
    Create a `.env.local` file in the root directory:
    ```bash
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Run the development server:**
    ```bash
    pnpm dev
    ```

---

## 05. ROADMAP

We maintain a transparent development process.

*   **Public Roadmap:** [docs/ROADMAP.md](docs/ROADMAP.md) - Our 40-day launch plan.
*   **Feature Backlog:** [docs/PENDING_FEATURES.md](docs/PENDING_FEATURES.md) - Prioritized list of upcoming capabilities.
*   **Design System:** [docs/DESIGN.md](docs/DESIGN.md) - The visual language of the project.

---

*End of Transmission.*
