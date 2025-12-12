## 2024-05-23 - Security Headers & Logging
**Vulnerability:** Missing standard security headers (X-Frame-Options, X-Content-Type-Options, etc.) and logging of sensitive user PII (email).
**Learning:** Default Next.js setup does not include these headers automatically. Middleware is a good place to add them globally. Logging emails in production logs can violate privacy standards.
**Prevention:** Use a standard security headers middleware and sanitize logs.
