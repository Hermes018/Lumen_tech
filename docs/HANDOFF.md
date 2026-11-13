# HANDOFF - Claude <-> Gemini baton

> Overwrite this file at every handoff (`/handoff` or Prompt 9 in `docs/13-PROMPTS.md`). Keep it under 80 lines. State only; no essays.
> Read order for the receiving agent: `AGENTS.md` -> `docs/PROGRESS.md` -> this file. Read nothing else until the task card says so.

## Baton

- From: gemini (Gemini 4 Hydrogen Med)   To: next agent / founder review   Date/time (UTC): 2026-11-13 06:20:00
- Reason: Stage 3C (Branch 4: Hardcoded Brand Sweep, Auth/Onboarding, Orders & Self-Serve Refund UI) complete, merged to `main`, and pushed to `origin/main`
- Branch: main                      Last commit SHA: 631c008 (merged to main)
- Device (hostname) / session log path: docs/logs/sessions/2026-11-13-gemini-stage3c.md
- Pushed to origin? Yes (`origin/main`)
- Working tree clean? yes
- Task: Stage 3C (`P1-32` UI & brand sweep) - status: complete
- Milestone gate in progress: M1 Internal Alpha (GRE Core + Magoosh Engine)
- Baseline `pnpm verify:fast`: PASS (30/30 turbo tasks green; `@lumen/core` 180 tests, `@lumen/db` 26, `@lumen/ai` 18, `@lumen/ui` 17, `@lumen/auth` 16)
- Baseline `pnpm --filter @lumen/web build`: PASS (65/65 static pages + all dynamic routes green)

## Done so far (Stages 3A, 3B, 3C)

1. Stage 3A: P0 Security remediation (`P1-32` backend), `requireServerActor()` + D4 2FA, SSLCommerz IPN + validation, append-only credit ledger (`P1-34`), refund & 15% BD VAT engine (`P1-147`).
2. Stage 3B (`P1-33`): Dual-Mode Drizzle & In-Memory Repository Adapter Layer in `packages/db/src/repositories/`.
3. Stage 3C (`task/P1-32-ui-and-brand-sweep` -> merged to `main`):
   - Eliminated all 16 hardcoded `"Lumen Academy"` strings across `packages/` and `apps/web/` in favor of `brand.name` from `@lumen/config`.
   - Added `packages/core/src/__tests__/brand-sweep.test.ts` asserting zero hardcoded `"Lumen Academy"` strings outside `packages/config/src/brand.ts`; verified `audit-digest.md` reports `0` hits.
   - Built `apps/web/app/[locale]/(auth)/sign-in/page.tsx`, `sign-up/page.tsx`, and `onboarding/page.tsx` (Google OAuth, Email OTP, Phone OTP stub, D4 2FA prompt, guest diagnostic token claim, 2 free AI credits).
   - Built `apps/web/app/[locale]/(checkout)/orders/page.tsx` and `apps/web/app/[locale]/(learner)/app/settings/page.tsx` (active entitlements, AI credit & mock balances, Mushak 6.3 / 15% BD VAT receipt breakdown, 1-click self-serve refund request wired to `refunds.ts`).
   - Added `export const dynamic = 'force-dynamic'` to authenticated route group layouts so `next build` succeeds cleanly.

## Remaining steps (numbered, in order)

1. Run two-key review (Sonnet 5.5 or Opus Low/Med) on security-critical paths listed below.
2. Continue next unchecked M1 task in `docs/PROGRESS.md`.

## Exact next command / first action

`git status -sb`

## Decisions made (and why)

- Authenticated route group layouts (`(learner)`, `(studio)`, `(grader)`, `(admin)`, `(staff)`, `(org)`) export `dynamic = 'force-dynamic'` so Next.js 16 production build does not attempt static prerendering of session-protected pages.
- Self-serve refund requests in `apps/web/app/actions/checkout.ts` evaluate eligibility via `evaluateRefundEligibility` (`refunds.ts`) and record an append-only audit event while preserving `executeRefund`'s finance+2FA gate (`order:refund`).

## Known issues / failing tests

- None (`pnpm verify:fast` 30/30 green, `@lumen/web build` green).

## Read first (max 5 paths or doc sections)

- `docs/logs/reviews/opus-audit-and-action-plan.md`
- `docs/PROGRESS.md`

## Do NOT touch

- `pnpm-lock.yaml`, `.env*`, `docs/00-DECISIONS.md`, committed DB migrations in `packages/db/drizzle/`.

## Needs two-key review (security-critical paths touched)

- [ ] `packages/auth/src/server.ts` (`requireServerActor`, D4 2FA guard)
- [ ] `apps/web/app/api/webhooks/sslcommerz/route.ts` & `packages/core/src/commerce/sslcommerz.ts` (IPN signature + secondary validation + idempotency)
- [ ] `packages/core/src/commerce/entitlements.ts` & `packages/core/src/commerce/refunds.ts` (append-only credit ledger, refund deductions, 15% BD VAT)
- [ ] `packages/db/src/repositories/**` (dual-mode persistence adapter layer)
