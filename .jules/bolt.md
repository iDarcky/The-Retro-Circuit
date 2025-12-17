## 2024-05-23 - Over-fetching in List Views
**Learning:** Selecting `*` (all columns) in a list view, especially with nested relations like `variants`, causes massive payload bloat. The `fetchAllConsoles` function was fetching ~60 columns per row when only ~8 were needed.
**Action:** Always verify specific field requirements for list views and use explicit `.select('a, b, c')` instead of `*`.
