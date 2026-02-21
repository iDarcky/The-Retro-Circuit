## 2025-01-01 - Keyboard Accessibility in Dropzones
**Learning:** Custom file upload dropzones often lack basic keyboard accessibility (tab focus, Enter/Space handlers) because they rely on 'hidden' inputs and click handlers on divs.
**Action:** Always add tabIndex={0}, role='button', and specific onKeyDown handlers to custom interactive elements that wrap hidden native inputs.
