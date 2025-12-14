## 2024-05-23 - Custom Interactive Elements Trap
**Learning:** Custom file upload dropzones implemented as `div`s are often invisible to keyboard users. Even with `onClick`, they lack `tabIndex` and keyboard event handlers.
**Action:** Always wrap custom interactive areas with `role="button"`, `tabIndex={0}`, and handle `onKeyDown` (Enter/Space) to mirror click behavior. Ensure visible focus indicators are added.
