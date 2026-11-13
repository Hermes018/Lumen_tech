# HANDOFF - Claude <-> Gemini baton

> Overwrite this file at every handoff (`/handoff` or Prompt 9 in `docs/13-PROMPTS.md`). Keep it under 80 lines. State only; no essays.
> Read order for the receiving agent: `AGENTS.md` -> `docs/PROGRESS.md` -> this file. Read nothing else until the task card says so.

## Baton

- From: gemini (3.8 Flash High)   To: next model (Gemini 4 Hydrogen Med / 3.8 Flash Med)   Date/time (UTC): 2026-11-13 05:50:00
- Reason: Stage 3B (Branch 3: P1-33 Dual-Mode Repositories) complete & merged to `main`; pausing at mandatory model switch gate for Stage 3C
- Branch: main                      Last commit SHA: (main merge commit)
- Device (hostname) / session log path: docs/logs/reviews/opus-audit-and-action-plan.md
- Pushed to origin? Local commits on `main`   Usage at handoff: Stage 3B complete
- Working tree clean? yes
- Task: Stage 3C (P1-32 Auth UI pages & P1-8 Brand sweep / i18n) - status: ready
- Milestone gate in progress: M1 Internal Alpha (GRE Core + Magoosh Engine)
- Baseline `pnpm verify:fast` at handoff: PASS (30/30 turbo tasks green, 221 tests passing across db/core/auth/ui)

## Done so far (Stage 3A & Stage 3B)

1. Stage 3A: P0 Security remediation (`P1-32`), server session guard (`requireServerActor` + D4 2FA), SSLCommerz IPN verification & idempotency, append-only credit ledger (`P1-34`), refund & 15% BD VAT engine (`P1-147`).
2. Stage 3B (`task/P1-33-drizzle-repositories` -> merged to `main`):
   - Implemented Dual-Mode Repository Adapter Layer in `packages/db/src/repositories/`:
     - Interfaces: `OrderRepo`, `PaymentRepo`, `EntitlementRepo`, `LedgerRepo`, `GradingRepo`, `CourseRepo`, `QuestionRepo`, `ProgressRepo`, `QuestionStatRepo`, `MistakeRepo`, `PriceRepo`, `VocabCardRepo`, and `UnitOfWork` (`transaction<T>`).
     - Neon Serverless Drizzle implementation (`drizzle/*.ts`) querying Neon Postgres when `DATABASE_URL` is set.
     - Deterministic in-memory implementation (`memory/*.ts`) with transaction snapshot/rollback and unique constraint enforcement (`providerRef`, `idempotencyKey`).
     - Production fail-fast guard throwing fatal error if `NODE_ENV === 'production'` and `DATABASE_URL` is missing.
     - Added Drizzle schema tables in `schema/commerce.ts`, `schema/grading.ts`, `schema/mistakes.ts`, `schema/progress.ts`.
   - Wired repository persistence into `@lumen/core` and `@lumen/web`:
     - Replaced 6 in-memory Map stores: `commerce/checkout.ts`, `commerce/entitlements.ts`, `grader/queue.ts`, `studio/authoring.ts`, and `actions/mistakes.ts`.
   - Added repository contract tests in `packages/db/src/__tests__/repositories.test.ts` (7 passing tests).
   - All 30 turbo tasks green, 221 unit tests passing.

## Remaining steps (numbered, in order)

1. Run `/clear`, switch model to `Gemini 4 Hydrogen (Medium)` or `Gemini 3.8 Flash (Medium)`.
2. Execute Stage 3C tasks: Auth UI pages (login, register, verify, reset, 2FA prompt) + Brand sweep (D0 / brand.ts name & i18n keys).

## Exact next command / first action

`git status -sb`

## Decisions made (and why)

- Repositories fail fast at boot in production if `DATABASE_URL` is absent, preventing silent data loss in serverless environments.
- Memory UnitOfWork snapshots store state before running transactions and restores state on failure to guarantee atomic rollback in tests.
- Replaced in-memory Map stores across core domain services with transparent repository adapters preserving sync/async backward compatibility.

## Known issues / failing tests

- None (`pnpm verify:fast` 30/30 tasks green).

## Read first (max 5 paths or doc sections)

- `docs/logs/reviews/opus-audit-and-action-plan.md`
- `packages/db/src/repositories/index.ts`
- `packages/db/src/repositories/types.ts`
- `packages/core/src/commerce/checkout.ts`
- `packages/core/src/commerce/entitlements.ts`

## Do NOT touch

- `pnpm-lock.yaml`, `.env*`, `docs/00-DECISIONS.md`, committed DB migrations in `packages/db/drizzle/`.

## Needs two-key review (security-critical paths touched)

- [ ] `packages/auth/src/server.ts` (`requireServerActor`, D4 2FA guard)
- [ ] `apps/web/app/api/webhooks/sslcommerz/route.ts` & `packages/core/src/commerce/sslcommerz.ts` (IPN signature + secondary validation + idempotency)
- [ ] `packages/core/src/commerce/entitlements.ts` & `packages/core/src/commerce/refunds.ts` (append-only credit ledger, refund deductions, 15% BD VAT)
- [ ] `packages/db/src/repositories/**` (dual-mode persistence adapter layer)
