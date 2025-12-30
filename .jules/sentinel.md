## 2024-05-23 - Critical Security Gap: Disabled Middleware

**Vulnerability:** The application's `middleware.ts` was renamed to `proxy.ts`, causing Next.js to ignore it completely. This disabled global security headers (X-Frame-Options, etc.), global authentication redirects, and Supabase session refreshing logic.

**Learning:** Renaming a critical infrastructure file like `middleware.ts` to silence a warning (or based on a misunderstanding of a warning) silently disables all security logic contained within it. The codebase had extensive auth logic that was simply dead code.

**Prevention:**
1. Never rename standard Next.js files (`middleware.ts`, `page.tsx`) without understanding the lifecycle implications.
2. Verify security headers are present in the running application as part of the CI/CD pipeline.
3. Use automated tests to verify that `middleware` is active (e.g., by checking for a custom header it sets).
