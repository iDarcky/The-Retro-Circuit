# Homepage V1 Specifications

## 1. Low-Fidelity Layout Sketch

**Container:** `max-w-screen-2xl mx-auto` (Wide, generous horizontal space).
**Background:** Dark, subtle grid/CRT effects (global).

### Flow (Top to Bottom):

1.  **Welcome Micro Header (XS)**
    *   *Position:* Top-left (below global header).
    *   *Visual:* Small, low-contrast text block. `font-mono`.
    *   *Content:* Title, one sentence, status line.

2.  **Finder Hero (XL)**
    *   *Position:* Full width of container.
    *   *Visual:* High contrast (glow/border), most prominent section.
    *   *Elements:*
        *   Large Title "FINDER_".
        *   Subtext.
        *   **Primary CTA:** "START FINDER" (Large, glowing).
        *   **Hint:** "EST. TIME: ~2 MIN".

3.  **Database Module (L)**
    *   *Position:* Full width.
    *   *Visual:* Strong borders but "calmer" than Finder.
    *   *Elements:*
        *   Header "CONSOLE VAULT".
        *   **Primary CTA:** "BROWSE CONSOLES".
        *   **Secondary Link:** "BROWSE FABRICATORS".

4.  **VS Module (M)**
    *   *Position:* Full width.
    *   *Visual:* Medium weight.
    *   *Elements:*
        *   Header "QUICK COMPARE".
        *   **Widget:** Two dropdowns + "Compare" button (Inline).
        *   **Secondary CTA:** "ENTER ARENA".

5.  **Rails (S)**
    *   *Position:* Side-by-side columns (50% / 50% on Desktop).
    *   *Visual:* Quiet, card lists.
    *   *Left Rail:* "LATEST ADDED" (3 Cards: Image + Name + Date).
    *   *Right Rail:* "LATEST RELEASED" (3 Cards: Image + Name + Year).

6.  **Signals Teaser (XS)**
    *   *Position:* Full width or integrated into flow.
    *   *Visual:* Text-only or minimal.
    *   *Elements:* Header "SIGNALS", Title of latest post, "READ SIGNAL" link.

---

## 2. Copy

**1. Welcome Micro Header**
*   **Title:** WELCOME TO THE CIRCUIT
*   **Body:** A living archive of retro handhelds — plus tools to help you pick the right one.
*   **Status:** RC://ONLINE · ARCHIVE SYNCED · GUIDANCE AVAILABLE

**2. Finder Hero**
*   **Title:** FINDER_
*   **Subtext:** Identify the perfect handheld for your library and budget.
*   **CTA:** START FINDER
*   **Hint:** EST. TIME: ~2 MIN

**3. Database Module**
*   **Title:** CONSOLE VAULT
*   **CTA 1:** BROWSE CONSOLES
*   **CTA 2:** BROWSE FABRICATORS

**4. VS Module**
*   **Title:** QUICK COMPARE
*   **CTA:** ENTER ARENA

**5. Rails**
*   **Left Title:** LATEST ADDED
*   **Right Title:** LATEST RELEASED

**6. Signals**
*   **Header:** SIGNALS_
*   **Placeholder Title:** STATE OF THE ARCHIVE: 2025 ROADMAP
*   **Excerpt:** System upgrades initialized. New sorting algorithms and visualization modules coming online.
*   **Link:** READ SIGNAL

---

## 3. Responsive Behavior

*   **Mobile (< md):**
    *   Stack everything vertically.
    *   Rails become stacked (Latest Added first, then Latest Released).
    *   Padding reduced (`px-4`).
    *   Finder Hero remains the largest visual element.
*   **Desktop (>= md):**
    *   Use `max-w-screen-2xl`.
    *   Rails side-by-side (`grid-cols-2`).
    *   Generous whitespace.
    *   VS Module content inline.

---

## 4. Hierarchy Rules (Checklist)

*   [ ] Only **ONE** primary button above fold (Start Finder).
*   [ ] Finder = Hero (Glow/High Contrast).
*   [ ] Database = Strong/Calm.
*   [ ] VS = Medium.
*   [ ] Rails/Signals = Quiet.
*   [ ] Typography: `font-pixel` for major headings, `font-tech`/`font-mono` for rest.
