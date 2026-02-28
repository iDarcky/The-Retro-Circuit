# Design Audit

This audit evaluates the current state of UI components across the application against the established "Swiss Design" methodology.

## Key Principles of Swiss Design (System Console)
1. **High Contrast:** Pure black (`bg-bg-primary`) and pure white text (`text-text-primary`) with vibrant highlight colors (Violet, Cyan, Orange).
2. **Sharp Edges:** Minimal to no rounded corners (`rounded-none` or `rounded-sm`).
3. **No Shadows/Glows:** Flat design, relying on borders and solid background fills for depth and interaction states.
4. **Dense Typography:** Systematic use of `.font-pixel` for headings, `.font-sans` for body UI, and `.font-mono` for data/metrics.

---

## Findings & Inconsistencies

### 1. Typography
* **Consistency:** Excellent. The scale relies appropriately on `.font-pixel`, `.font-sans`, and `.font-mono`.
* **Inconsistencies:** Some auxiliary pages still use generic tailwind tracking and leading that overrides the tight, dense default required for the Swiss look.

### 2. Buttons
* **Standard `Button` Component:**
  * The standard button component often employs rounded corners and softer hover states (like opacity shifts) that conflict with the brutalist Swiss approach.
* **`SwissButton` Component:**
  * Matches the aesthetic perfectly with sharp edges, solid borders, and high-contrast hover states.
  * **Recommendation:** Standardize all buttons across the application to utilize the `SwissButton` pattern or refactor the standard `Button` to mirror `SwissButton`'s styling.

### 3. Badges (`TechBadge`)
* **Consistency:** Generally good. Most badges use solid borders (`border-white/10`) and flat backgrounds.
* **Inconsistencies:** Some variations might introduce slight border radii or softer background colors instead of strict high-contrast mono or solid brand colors.

### 4. Interactive Components
* **`SwissDropdown`:**
  * Fits the design system beautifully with its solid trigger, borderless menu integration, and thick `border-l-4` violet highlight for selected items. No shadows are used, aligning with the rules.
* **`RetroStatusBar`:**
  * Strong adherence to the pixel-art/retro aesthetic, though slightly diverges from pure Swiss minimalism, it fits the overall system theme well.


### 5. Missing / Future Components
To fully realize the Swiss Design methodology across the entire application, several standard interactive components still need to be designed and implemented:

* **Number Stepper / Adjuster:**
  * **Current:** We use standard HTML number inputs.
  * **Swiss Target:** A flat, high-contrast input group. A central text field for the number flanked by square, borderless `+` and `-` buttons. The container should have a solid `border-white/20` and an active focus state of a thick `border-violet-500`.
* **Toggle Switches / Checkboxes:**
  * **Current:** We use browser-default checkboxes or generic Tailwind toggles (e.g., in Admin forms).
  * **Swiss Target:** For checkboxes: A sharp `w-4 h-4` square (`rounded-none`) with a solid border that fills with a vibrant brand color (Cyan/Orange/Violet) when checked, containing a blocky pixelated checkmark. For toggles: A strict rectangular track (`rounded-none`) with a square thumb, avoiding soft pill shapes.
* **Text Inputs / Textareas:**
  * **Current:** Inputs in `AdminInput` or Auth forms might have soft borders or generic focus rings.
  * **Swiss Target:** Strict `rounded-none` containers. A solid dark background (`bg-white/5`), a sharp bottom border or full thin border (`border-white/10`), and a dense, mono-spaced font for input text. Focus states should rely on solid, thick high-contrast borders (e.g., `focus:border-l-4 focus:border-violet-500`).
* **Modal Dialogs:**
  * **Current:** Often employ `rounded-md` or `rounded-lg` with deep drop shadows.
  * **Swiss Target:** A sharp, borderless rectangle that heavily dims the background (high-contrast overlay). No rounded corners, no box shadows—just a thick colored border (e.g., `border-t-4 border-orange-500`) and a strict typographic grid inside.
* **Alerts / Toasts:**
  * **Current:** Generic notification bubbles.
  * **Swiss Target:** "System Notification" style blocks. Dense, flat rectangles anchored rigidly to the bottom right or top of the screen.

---

## Action Items
- [ ] Migrate all standard `Button` instances to `SwissButton` or update the `Button` base styles to remove border radii and shadows.
- [ ] Audit auxiliary pages for generic typography utility classes that break the dense Swiss scale.
- [ ] Ensure all input fields and forms (like those in Admin) adopt the strict, flat, bordered styling of the `SwissDropdown`.

### Pending Components for Swiss Methodology

**The old `Button` component is currently still used in the following locations:**
* **Admin Dashboard:**
  * `components/admin/ConsoleIndexClient.tsx`
  * `components/admin/ManufacturerForm.tsx`
  * `components/admin/EmulationForm.tsx`
  * `components/admin/VariantForm.tsx`
  * `components/admin/AdminConsoleEditorClient.tsx`
  * `components/admin/ConsoleForm.tsx`
  * `components/admin/FabricatorClient.tsx`
  * `components/admin/ReleaseForm.tsx`
  * `components/admin/RoadmapClient.tsx`
  * `components/admin/SettingsForm.tsx`

*Goal*: Over time, refactor these routes to utilize `SwissButton` or globally update `Button` styles to match the Swiss aesthetic.
