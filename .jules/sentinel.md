## 2024-05-23 - Missing Security Headers & Memory Discrepancy
**Vulnerability:** Critical security headers (X-Frame-Options, X-Content-Type-Options, etc.) were completely missing from `middleware.ts`, despite project memory asserting they were "explicitly injected".
**Learning:** Never trust "memory" or documentation about security controls without code verification. The assumption of safety led to a vulnerability persistence.
**Prevention:** Always verify security controls (headers, auth checks) by inspecting the actual code or running a live scan, regardless of what documentation claims.
