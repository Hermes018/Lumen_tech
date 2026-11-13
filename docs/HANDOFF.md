# HANDOFF - Claude <-> Gemini baton

> Overwrite this file at every handoff (`/handoff` or Prompt 9 in `docs/13-PROMPTS.md`). Keep it under 80 lines. State only; no essays.
> Read order for the receiving agent: `AGENTS.md` -> `docs/PROGRESS.md` -> this file. Read nothing else until the task card says so.

## Baton

- From: gemini (Argon Low/Med)   To: gemini (3.8 Flash High)   Date/time (UTC): 2026-11-13 05:00:00
- Reason: Stage 3A (Branches 1 & 2) complete & merged to `main`; pausing at mandatory model switch gate for Stage 3B
- Branch: main                      Last commit SHA: c49ba7e
- Device (hostname) / session log path: docs/logs/reviews/opus-audit-and-action-plan.md
- Pushed to origin? Local commits on `main`   Usage at handoff: Stage 3A complete
- Working tree clean? yes
- Task: Stage 3B (Auth UI pages, Dual-mode repository adapter P1-33, Brand sweep) - status: ready
- Milestone gate in progress: M1 Internal Alpha (GRE Core + Magoosh Engine)
- Baseline `pnpm verify:fast` at handoff: PASS (30/30 turbo tasks green, 179 core tests + 16 auth tests passing)

## Done so far (Stage 3A: Branches 1 & 2)

1. Branch 1 (`task/P1-32-security-and-session-guard` -> merged to `main`):
   - Implemented `requireServerActor(options?: { requireTwoFactor?: boolean })` and `getServerActor()` in `packages/auth/src/server.ts` (re-exported via `@lumen/auth` and `@lumen/core`), with deterministic `__setTestServerActor` hook restricted strictly to `NODE_ENV === 'test'`.
   - Enforced mandatory D4 2FA (`requiresTwoFactor`) for `instructor`, `grader`, `content_editor`, `support`, `finance`, `org_admin`, `admin`, and `super_admin`.
   - Remediated SSLCommerz IPN webhook (`apps/web/app/api/webhooks/sslcommerz/route.ts` & `packages/core/src/commerce/sslcommerz.ts`): enforced `localVerifySign` hash check, secondary Order Validation API check, exact `amount_minor` + currency match, and `tran_id` idempotency guard.
   - Enforced Inngest signing-key header verification in `apps/web/app/api/inngest/route.ts`.
   - Hardened all 9 Server Action modules (`checkout`, `exam`, `mistakes`, `practice`, `grader`, `studio`, `study-plan`, `tutor`, `analytics`) with `requireServerActor()`, `assertCan()`, and strict Zod `.parse()` validation (`grader.ts` and `studio.ts` enforce `{ requireTwoFactor: true }`).
   - Added `isMistakeRetry: true` and strict IRT calibration / item-rest exclusion in `mistakes.ts`, `adaptive.ts`, `scoring.ts`, and `statistics.ts`.
   - Added unit tests in `packages/auth/src/__tests__/auth.test.ts` and `packages/core/src/__tests__/security-remediation.test.ts`.
2. Branch 2 (`task/P1-34-147-ledger-and-refunds` -> merged to `main`):
   - Implemented server-authoritative append-only entitlement & credit ledger in `packages/core/src/commerce/entitlements.ts` (`P1-34`): D12 C1 credit costs (`1/1/2/1`), daily evaluation ceilings (`Free=1`, `Core=3`, `Pass=4`, `Plus/Live/Mentor=6`), `assertHasEntitlement`, `consumeAiCredit`, and `consumeMockAttempt`.
   - Implemented Finance Refund & 15% BD VAT Engine in `packages/core/src/commerce/refunds.ts` (`P1-147`): 7-day window (`< 20%` content AND `<= 1` full mock; `72h` for 1-month pass; `before_class_3` for Live; `before_class_2` for Crash), non-refundable consumed AI credit deduction, automatic `revokeCertificate`, and integer minor-unit 15% BD VAT breakdown (`net_minor`, `vat_minor`, `gross_minor`).
   - Added 12 exhaustive unit tests in `packages/core/src/__tests__/entitlements-refunds.test.ts` (including Rasch EAP, FSRS, and 28-of-90-day `compare_at` invariants).

## Remaining steps (numbered, in order)

1. Run `/clear` and switch model to `Gemini 3.8 Flash (High)` for Stage 3B.
2. Execute Stage 3B tasks per `docs/logs/reviews/opus-audit-and-action-plan.md` (P1-33 dual-mode repository wiring, Auth UI pages, Brand sweep).

## Exact next command / first action

`git status -sb`

## Decisions made (and why)

- `requireServerActor` rejects unauthenticated calls and enforces D4 2FA in both the session resolver and `assertCan` (defence in depth).
- Append-only ledger entries are frozen and keyed by unique `idempotencyKey` to prevent double-spend race conditions.
- Consumed AI credits are never refunded (`refundableMinor = amountPaidMinor - deductedCreditValueMinor`), and `executeRefund` automatically revokes course certificates.

## Known issues / failing tests

- None (`pnpm verify:fast` 30/30 tasks green).

## Read first (max 5 paths or doc sections)

- `docs/logs/reviews/opus-audit-and-action-plan.md`
- `packages/auth/src/server.ts`
- `packages/core/src/commerce/entitlements.ts`
- `packages/core/src/commerce/refunds.ts`
- `packages/core/src/__tests__/entitlements-refunds.test.ts`

## Do NOT touch

- `pnpm-lock.yaml`, `.env*`, `docs/00-DECISIONS.md`, committed DB migrations.

## Needs two-key review (security-critical paths touched)

- [ ] `packages/auth/src/server.ts` (`requireServerActor`, D4 2FA guard - Sonnet 5.5 / Opus Low-Med review)
- [ ] `apps/web/app/api/webhooks/sslcommerz/route.ts` & `packages/core/src/commerce/sslcommerz.ts` (IPN signature + secondary validation + idempotency)
- [ ] `apps/web/app/api/inngest/route.ts` (Inngest signing key verification)
- [ ] `packages/core/src/commerce/entitlements.ts` & `packages/core/src/commerce/refunds.ts` (append-only credit ledger, refund deductions, 15% BD VAT)
