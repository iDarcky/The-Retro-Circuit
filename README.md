# THE RETRO CIRCUIT
### The Golden Age of Gaming Hardware. Declassified.

```text
  _____      _              _____ _                 _ _   
 |  __ \    | |            / ____(_)               (_) |  
 | |__) |___| |_ _ __ ___ | |     _ _ __ ___ _   _ _| |_ 
 |  _  // _ \ __| '__/ _ \| |    | | '__/ __| | | | | __|
 | | \ \  __/ |_| | | (_) | |____| | | | (__| |_| | | |_ 
 |_|  \_\___|\__|_|  \___/ \_____|_|_|  \___|\__,_|_|\__|
                                                         
  >> STATUS: ONLINE
  >> SYSTEM: NEXT.JS 14 // SUPABASE // TAILWIND
```

## 01. THE MISSION

**The Problem: Signal Noise**
The modern retro handheld market is a labyrinth of confusing naming conventions and fragmented specifications. A device like the "Retroid Pocket 4" isn't a single entity—it's a spectrum of SKUs, each with different RAM configurations, chipsets, and price points. For the enthusiast, distinguishing the "Base" from the "Pro" or the "Plus" is a manual, error-prone process.

**The Solution: Precision Engineering**
The Retro Circuit is a specialized comparison engine designed to bring order to this chaos. We treat gaming hardware with the rigorous precision of a technical datasheet. By implementing a structured, relational database that maps base hardware to specific performance variants, we provide the community with the definitive "GSMArena" for the handheld revolution.

---

## 02. SYSTEM ARCHITECTURE

This platform is built on a modern, high-performance stack designed for scalability and speed. The architecture enforces strict type safety and relational data integrity.

### CORE
*   **Framework:** Next.js 14 (App Router)
*   **Language:** TypeScript (Strict Mode)
*   **State:** React Server Components (RSC) for optimized data fetching

### VISUAL INTERFACE
*   **Design System:** Tailwind CSS
*   **Aesthetic:** "Cyberpunk Terminal" — A custom-built UI language featuring CRT scanlines, neon-grid layouts, and diegetic sound effects.
*   **Motion:** CSS Keyframes & Native Transitions

### DATA LAYER
*   **Database:** Supabase (PostgreSQL)
*   **Schema:** Advanced Relational Design (One-to-Many Relationships for Manufacturers, Consoles, and Variant SKUs).
*   **Security:** Row Level Security (RLS) policies for admin-only write access.

### INFRASTRUCTURE
*   **Hosting:** Vercel (Edge Network)
*   **Analytics:** Vercel Analytics
*   **CI/CD:** Automated Preview & Production Deployments

---

## 03. KEY MODULES

### [A] THE FABRICATOR ARCHIVES
A comprehensive database of hardware manufacturers. This module links corporate entities (e.g., Ayn, Retroid, Anbernic) to their hardware lineage, preserving historical context and brand identity while powering the relational lookup engine.

### [B] THE VARIANT ENGINE
The heart of the application's data integrity. This custom logic layer handles the complexity of SKU differentiation. It allows a single "Parent Console" entry to spawn multiple "Child Variants," dynamically inheriting base specs (like OS or Input Layout) while overriding specific performance metrics (RAM, CPU Clock, Screen Resolution, Price) without data duplication.

### [C] ROOT TERMINAL
A diegetic, command-line inspired Admin Interface for managing the dataset. Protected by role-based authentication, this portal allows operators to inject new hardware data, manage news signals, and update the global "Game of the Week" algorithms without accessing the source code.

---

*End of Transmission.*
