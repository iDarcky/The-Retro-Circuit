## 2024-05-23 - Accessibility in Custom Form Controls
**Learning:** The custom checkbox implementation in the Admin panel relies solely on `div` with `onClick`, completely excluding keyboard users and screen readers. Additionally, standard inputs lack programmatic `htmlFor` association with their labels.
**Action:** Use native HTML elements or strict ARIA roles (`role="checkbox"`, `tabIndex`, `onKeyDown`) for custom controls. Ensure all inputs use `id` and `htmlFor` for label association.
