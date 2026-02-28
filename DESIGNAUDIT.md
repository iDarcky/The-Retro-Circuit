# Design Audit

This audit evaluates the current state of UI components across the application against the established **"Vibrant Swiss"** methodology—a blend of strict brutalist geometry with high-contrast, flat brand colors.

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
To fully realize the "Vibrant Swiss" aesthetic across the entire application, several standard interactive components still need to be designed and implemented:

* **Number Stepper / Adjuster:**
  * **Current:** We use standard HTML number inputs.
  * **Vibrant Swiss Target:** A flat, high-contrast input group. A central text field for the number flanked by strict 40x40 geometric square buttons. The container should have a solid `border-white/20`.
  * **Target Locations for Refactor:**
    * `components/console/ConsoleVaultClient.tsx` (Price filters)
    * `components/fabricator/FabricatorDetailClient.tsx` (Price/Year filters)
    * `components/admin/VariantForm.tsx`
    * `components/admin/ReviewManager.tsx`
* **Toggle Switches / Checkboxes:**
  * **Current:** We use browser-default checkboxes or generic Tailwind toggles (e.g., in Admin forms).
  * **Vibrant Swiss Target:** For checkboxes: A sharp square (`rounded-none`) with a solid border that fills with a vibrant brand color (Cyan/Orange/Violet) and a sharp SVG checkmark. For toggles: A strict rectangular track (`rounded-none`) with a square thumb.
  * **Target Locations for Refactor:**
    * `components/arena/ArenaComparisonClient.tsx` (Variant/Model toggles)
    * `app/arena/page.tsx` (Variant selection toggles)
    * `components/admin/ReleaseForm.tsx` (Published toggle)
* **Text Inputs / Textareas:**
  * **Current:** Inputs in `AdminInput` or Auth forms might have soft borders or generic focus rings.
  * **Vibrant Swiss Target:** Strict `rounded-none` flat containers. Clean typography, zero rounding, and thick solid bottom borders that activate with vibrant brand colors (Cyan, Orange, Violet) on focus.
  * **Target Locations for Refactor:**
    * `components/admin/AdminInput.tsx` (Base component handling all admin form fields)
    * `components/admin/ManufacturerForm.tsx`
    * `components/admin/VariantForm.tsx`
    * `components/admin/ConsoleForm.tsx`
    * `app/login/page.tsx`
    * `app/finder/page.tsx` (Search/Filter inputs)
* **Modal / Info Dialogs:**
  * **Current:** Often employ `rounded-md` or `rounded-lg` with deep drop shadows.
  * **Vibrant Swiss Target:** Hard-edged popovers anchored directly to a mathematical grid (`border-2 border-white/20`). No soft drop shadows; instead, strict typographic boundaries and thick colored edge-borders to signify intent.
* **Data Output / Loading Skeletons:**
  * **Current:** Generic notification bubbles or pulsing blobs for loading.
  * **Vibrant Swiss Target:** High-contrast block loading bars, rigid accordions (`+` / `-`), and stark box-based breadcrumbs (`Systems - Handhelds - Name`).

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

### Implementation Roadmap

To systematically execute the transition to the Vibrant Swiss aesthetic without causing massive layout breaks, follow this structured implementation sequence:

#### Phase 1: Universal Primitives (Global Impact)
1. **Buttons**: Continue the rollout of \`SwissButton\` across all \`Admin\` routes, ultimately deprecating the old \`Button\` component.
2. **Typography**: Ensure global headings use \`.font-pixel\` and standard data labels use \`.font-mono\`.
3. **Badges**: Transition the \`TechBadge\` component to the new high-contrast, border-heavy design.

#### Phase 2: Form Controls (Data Integrity)
1. **Text Inputs**: Refactor \`AdminInput\` to use the \`rounded-none\`, bottom-border focus logic. This will instantly upgrade all Admin forms, Login, and Finder inputs.
2. **Checkboxes & Toggles**: Create reusable \`SwissCheckbox\` and \`SwissToggle\` components based on the V2 proposals. Inject them into the Arena \`ComparisonRow\` and Admin \`ReleaseForm\`.
3. **Steppers**: Build the \`SwissStepper\` component and replace standard HTML number inputs in the Vault filters and Admin forms.

#### Phase 3: Layouts & Micro-Interactions (Polish)
1. **Breadcrumbs**: Standardize all path navigation to use the mono \`//\` separator pattern.
2. **Modals**: Strip rounded corners and box shadows from all `components/ui/Modal` instances, replacing them with thick border lines.
3. **Data Grids**: Transition floating UI elements (like User Avatars and metrics displays) into rigid, mathematically aligned grid blocks.
