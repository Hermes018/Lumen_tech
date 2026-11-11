---
paths:
  - "packages/core/**"
  - "packages/auth/**"
---
# Core domain rules (packages/core, packages/auth)
- NO React, NO Next imports. Each domain is `src/<domain>/index.ts` = only public surface; cross-domain imports go through it.
- Every exported service calls `assertCan(actor, 'resource:action', resource)` first, with ownership/org checks. Tests: allow + deny (wrong role, wrong owner, wrong org, 2FA-missing for D4 roles).
- zod at every boundary; return explicit DTOs (no raw DB rows); explicit column selects.
- Server authoritative: price, entitlement, deadline, score, adaptive routing. Clock is injected (`Clock` interface) so tests use a fake clock.
- Money = integer minor units + ISO currency. Idempotency keys on every mutation reachable from webhooks/jobs.
- `import 'server-only'` in server modules; env only via `packages/config/env.ts`; no PII/secrets in logs.
- These paths are security-critical (docs/12 section 2.1): two-key rule applies (docs/22 section 6.2); changes need `.claude/allow-protected.local` entries.
- Unit-test first; table-driven tests for permissions; property tests for scoring tables where useful.
