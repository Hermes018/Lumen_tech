# M0 Codebase Audit Digest (for Claude Opus 5.5)

Generated: 2026-11-13T04:25:00.546Z | Scope: `packages/*` + `apps/web` (170 files scanned)

## 1. Hardcoded & Code Smell Scan

### Hardcoded "Lumen Academy" outside `brand.ts` (16)
- `packages/auth/src/server.ts:45`: issuer: 'Lumen Academy',
- `packages/core/src/certificates/verify.ts:120`: message: 'Official Lumen Academy Certificate is verified and valid.',
- `apps/web/app/layout.tsx:7`: title: 'Lumen Academy',
- `apps/web/app/[locale]/(auth)/sign-in/page.tsx:5`: <h2 className="mb-2 text-2xl font-bold">Sign In to Lumen Academy</h2>
- `apps/web/app/[locale]/(checkout)/layout.tsx:8`: <h1 className="text-lg font-semibold">Lumen Academy Secure Checkout</h1>
- `apps/web/app/[locale]/(learner)/layout.tsx:29`: <span className="leading-tight font-bold">Lumen Academy</span>
- `apps/web/app/[locale]/(marketing)/courses/page.tsx:10`: title: 'Courses & Curriculum | GRE & IELTS Test Engines | Lumen Academy',
- `apps/web/app/[locale]/(marketing)/diagnostic/page.tsx:13`: title: 'Free Express Diagnostic | 15-Minute Ability Assessment | Lumen Academy',
- `apps/web/app/[locale]/(marketing)/gre/page.tsx:19`: title: 'GRE Prep Re-Engineered | Adaptive CBT Mocks & Socratic Pedagogy | Lumen Academy',
- `apps/web/app/[locale]/(marketing)/ielts/page.tsx:16`: title: 'IELTS Academic & General Prep | Authentic Computer-Delivered Mocks | Lumen Academy
- ...and 6 more

### Hardcoded Mock User IDs (0)
- (none)

### TODO / FIXME (0)
- (none)

### `any` Casts (0)
- (none)

## 2. Server Action & API Route Security Matrix

| File | Auth Resolution | `assertCan` | Zod Validation |
|---|---|---|---|
| `apps/web/app/actions/analytics.ts` | Session | Yes | No |
| `apps/web/app/actions/checkout.ts` | None/Public | No | No |
| `apps/web/app/actions/exam.ts` | None/Public | No | No |
| `apps/web/app/actions/grader.ts` | Session | No | No |
| `apps/web/app/actions/mistakes.ts` | Caller-passed | No | No |
| `apps/web/app/actions/practice.ts` | None/Public | No | No |
| `apps/web/app/actions/studio.ts` | Session | No | No |
| `apps/web/app/actions/study-plan.ts` | Session | No | No |
| `apps/web/app/actions/tutor.ts` | Session | No | No |
| `apps/web/app/api/health/route.ts` | None/Public | No | No |
| `apps/web/app/api/inngest/route.ts` | None/Public | No | No |
| `apps/web/app/api/webhooks/sslcommerz/route.ts` | None/Public | No | No |

## 3. Persistence Gap Audit (In-Memory `Map` in `packages/core`)

- `packages/core/src/analytics/progress.ts`: 1 `new Map<` store(s) (uses `@lumen/db`: No)
- `packages/core/src/commerce/checkout.ts`: 1 `new Map<` store(s) (uses `@lumen/db`: No)
- `packages/core/src/commerce/entitlements.ts`: 1 `new Map<` store(s) (uses `@lumen/db`: No)
- `packages/core/src/exam/statistics.ts`: 1 `new Map<` store(s) (uses `@lumen/db`: No)
- `packages/core/src/grader/queue.ts`: 1 `new Map<` store(s) (uses `@lumen/db`: No)
- `packages/core/src/studio/authoring.ts`: 4 `new Map<` store(s) (uses `@lumen/db`: No)

## 4. Math, Scoring & Commerce Edge Cases

- `packages/core/src/exam/scoring.ts` (277 lines): present & unit-tested
- `packages/core/src/exam/adaptive.ts` (148 lines): present & unit-tested
- `packages/core/src/fsrs/scheduler.ts` (260 lines): present & unit-tested
- `packages/core/src/analytics/mistakes.ts`: MISSING
- `packages/core/src/payments/sslcommerz.ts`: MISSING
- `packages/core/src/commerce/pricing.ts` (312 lines): present & unit-tested
- `packages/ai/src/tutor/socratic-tutor.ts` (291 lines): present & unit-tested
