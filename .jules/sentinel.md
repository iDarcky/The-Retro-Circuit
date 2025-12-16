## 2024-05-23 - Weak Input Validation Pattern
**Vulnerability:** Widespread use of `z.any().transform()` in Zod schemas (e.g., `lib/schemas/validation.ts`) bypasses Zod's type validation.
**Learning:** This pattern likely exists to handle loose form data coercion but negates the benefits of schema validation, allowing non-string inputs to be coerced unexpectedly (e.g., objects becoming `"[object Object]"`).
**Prevention:** Use `z.string()` or `z.coerce.string()` instead of `z.any()` to enforce proper type checking at the schema level.
