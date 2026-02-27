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

## Action Items
- [ ] Migrate all standard `Button` instances to `SwissButton` or update the `Button` base styles to remove border radii and shadows.
- [ ] Audit auxiliary pages for generic typography utility classes that break the dense Swiss scale.
- [ ] Ensure all input fields and forms (like those in Admin) adopt the strict, flat, bordered styling of the `SwissDropdown`.
