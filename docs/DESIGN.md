# THE RETRO CIRCUIT // DESIGN SYSTEM

> **Philosophy:** "Swiss Industrial"
> Form follows function. The design is characterized by extreme minimalism, strict grid systems, high-contrast typography, and a rejection of decorative "gamer" aesthetics.

---

## 01. CORE PRINCIPLES

1.  **DENSITY OVER DECORATION**: Screen real estate is valuable. Prioritize information density, especially on mobile.
2.  **GRID IS GOD**: Layouts must adhere to strict vertical and horizontal alignment.
3.  **TYPE AS UI**: Typography is the primary visual element. Use weight, size, and font family to create hierarchy, not decoration.
4.  **SIGNAL COLORS**: Use color sparingly and semantically to denote status or section identity.

---

## 02. TYPOGRAPHY

The system uses three distinct typefaces to separate function:

### [A] HEADINGS // `Press Start 2P`
*   **Usage**: Major section headers, Hero titles, "Digital" artifacts.
*   **ClassName**: `font-pixel`
*   **Characteristics**: Uppercase, pixelated, retro.

### [B] DATA & LABELS // `JetBrains Mono`
*   **Usage**: Specifications, metadata, technical labels, navigation items, buttons.
*   **ClassName**: `font-mono`
*   **Characteristics**: Monospaced, technical, precise.

### [C] BODY & READING // `Inter`
*   **Usage**: Long-form text (About, Privacy), dense tables, user reviews.
*   **ClassName**: `font-sans`
*   **Characteristics**: Clean, legible, neutral.

---

## 03. COLOR PALETTE

### BACKGROUNDS
*   **Void**: `#000000` (Main background)
*   **Surface**: `bg-white/[0.02]` (Cards, panels)
*   **Border**: `border-white/10` (Subtle dividers)

### TEXT
*   **Primary**: `text-white` (100% opacity)
*   **Secondary**: `text-zinc-400` (Low contrast metadata)
*   **Muted**: `text-zinc-600` (Disabled states)

### SIGNAL COLORS (ACCENTS)
Used to identify specific sections or states.

*   **ORANGE / AMBER** (`text-orange-500`):
    *   **Context**: `/about` page, Warnings, "Beta" tags.
    *   **Meaning**: Construction, Industrial, Attention.

*   **CYAN / SKY** (`text-cyan-500`):
    *   **Context**: `/privacy` page, Technical specs, Info.
    *   **Meaning**: Data, Cold, Neutral.

*   **ROSE / RED** (`text-rose-500`):
    *   **Context**: `/terms` page, Errors, "Critical" status, Deletion.
    *   **Meaning**: Danger, Legal, Stop.

*   **VIOLET / PURPLE** (`text-violet-500`):
    *   **Context**: `/credits` page, Brand Identity, Primary Actions (Buttons), Active States.
    *   **Meaning**: The Retro Circuit Brand, Magic, creative.

---

## 04. COMPONENT GUIDELINES

### BUTTONS
*   **Style**: Rectangular or minimal rounded corners (`rounded-sm` or `rounded-md`).
*   **Typography**: `font-mono` or `font-pixel`.
*   **States**: High contrast hover states (e.g., White text on Black -> Black text on White).

### CARDS
*   **Style**: Flat, 1px border. No shadows.
*   **Hover**: Subtle brightness increase (`bg-white/[0.04]`).

### NAVIGATION
*   **Mobile**: Bottom pill (`rounded-full`) is the *only* exception to the "no rounded" rule, for ergonomic floating interaction.
*   **Desktop**: Strict top bar, tabular alignment.

---

## 05. ANTI-PATTERNS (STRICTLY PROHIBITED)

*   ❌ **Neon Glows**: No CSS `box-shadow` or `text-shadow` simulating neon lights.
*   ❌ **Heavy Rounding**: Avoid `rounded-xl` or `rounded-2xl` unless absolutely necessary for a specific UI pattern (like the bottom nav).
*   ❌ **Gradient Text**: Use solid colors. Exception: The brand name "THE CIRCUIT" in the hero.
*   ❌ **Skeuomorphism**: No realistic buttons, bevels, or textures.
*   ❌ **Gamery Aesthetics**: Avoid "aggressive" shapes, jagged edges, or "distressed" textures.
