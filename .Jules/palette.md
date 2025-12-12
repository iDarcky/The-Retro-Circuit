# Palette's Journal - Critical UX/A11y Learnings

## 2024-05-22 - Accessibility of Custom File Inputs
**Learning:** Custom file upload dropzones that hide the native input often forget keyboard accessibility. `onClick` on a `div` is not enough.
**Action:** Always add `role="button"`, `tabIndex={0}`, and `onKeyDown` (for Enter/Space) to the trigger element.
