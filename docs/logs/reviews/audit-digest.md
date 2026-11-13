# M0 Codebase Audit Digest (for Claude Opus 5.5)

Generated: 2026-11-13T06:19:14.097Z | Scope: `packages/*` + `apps/web` (216 files scanned)

## 1. Hardcoded & Code Smell Scan

### Hardcoded "Lumen Academy" outside `brand.ts` (0)
- (none)

### Hardcoded Mock User IDs (0)
- (none)

### TODO / FIXME (0)
- (none)

### `any` Casts (0)
- (none)

## 2. Server Action & API Route Security Matrix

| File | Auth Resolution | `assertCan` | Zod Validation |
|---|---|---|---|
| `apps/web/app/actions/analytics.ts` | Caller-passed | Yes | Yes |
| `apps/web/app/actions/auth.ts` | Caller-passed | Yes | Yes |
| `apps/web/app/actions/checkout.ts` | Caller-passed | Yes | Yes |
| `apps/web/app/actions/exam.ts` | None/Public | Yes | Yes |
| `apps/web/app/actions/grader.ts` | None/Public | Yes | Yes |
| `apps/web/app/actions/mistakes.ts` | Caller-passed | Yes | Yes |
| `apps/web/app/actions/practice.ts` | Caller-passed | Yes | Yes |
| `apps/web/app/actions/studio.ts` | None/Public | Yes | Yes |
| `apps/web/app/actions/study-plan.ts` | Caller-passed | Yes | Yes |
| `apps/web/app/actions/tutor.ts` | Caller-passed | Yes | Yes |
| `apps/web/app/api/health/route.ts` | None/Public | No | No |
| `apps/web/app/api/inngest/route.ts` | None/Public | No | Yes |
| `apps/web/app/api/webhooks/sslcommerz/route.ts` | None/Public | No | Yes |

## 3. Persistence Gap Audit (In-Memory `Map` in `packages/core`)

- `packages/core/src/analytics/progress.ts`: 1 `new Map<` store(s) (uses `@lumen/db`: No)
- `packages/core/src/commerce/checkout.ts`: 2 `new Map<` store(s) (uses `@lumen/db`: Yes)
- `packages/core/src/commerce/entitlements.ts`: 4 `new Map<` store(s) (uses `@lumen/db`: Yes)
- `packages/core/src/commerce/refunds.ts`: 1 `new Map<` store(s) (uses `@lumen/db`: No)
- `packages/core/src/exam/statistics.ts`: 1 `new Map<` store(s) (uses `@lumen/db`: No)
- `packages/core/src/grader/queue.ts`: 1 `new Map<` store(s) (uses `@lumen/db`: Yes)
- `packages/core/src/studio/authoring.ts`: 4 `new Map<` store(s) (uses `@lumen/db`: Yes)

## 4. Math, Scoring & Commerce Edge Cases

- `packages/core/src/exam/scoring.ts` (280 lines): present & unit-tested
- `packages/core/src/exam/adaptive.ts` (189 lines): present & unit-tested
- `packages/core/src/fsrs/scheduler.ts` (260 lines): present & unit-tested
- `packages/core/src/analytics/mistakes.ts`: MISSING
- `packages/core/src/payments/sslcommerz.ts`: MISSING
- `packages/core/src/commerce/pricing.ts` (312 lines): present & unit-tested
- `packages/ai/src/tutor/socratic-tutor.ts` (291 lines): present & unit-tested
