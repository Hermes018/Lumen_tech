# HANDOFF - Claude <-> Gemini baton

> Overwrite this file at every handoff (`/handoff` or Prompt 9 in `docs/13-PROMPTS.md`). Keep it under 80 lines. State only; no essays.
> Read order for the receiving agent: `AGENTS.md` -> `docs/PROGRESS.md` -> this file. Read nothing else until the task card says so.

## Baton

- From: gemini   To: claude | gemini   Date/time (UTC): 2026-11-12 13:50:00
- Reason: batch completed (P1-67, P1-24)
- Branch: main                      Last commit SHA: (see git log)
- Device (hostname) / session log path: docs/logs/sessions/2026-11-12-mistake-notebook-and-commerce-batch.md
- Pushed to origin? authorized (`ALLOW_GIT_PUSH=1`)   Usage at handoff (5h / weekly %): nominal
- Working tree clean? yes
- Task: P1-68 - Item statistics & retirement job (or P1-25 packages/ai LLM adapter) - status: ready
- Milestone gate in progress: M0 / M1 (GRE Adaptive Prototype & Magoosh Engine + Commerce)
- Baseline `pnpm verify` at handoff: PASS (29/29 turbo tasks cached/green, build 100% green)

## Done so far (this batch)

1. P1-67: Mistake Notebook domain service (`packages/core/src/exam/mistakes.ts`): Open/Resolved states, D13 error taxonomy (careless_math, vocab_gap, concept_gap, trap_answer, misread_prompt, time_pressure), retry loop with hint-free resolution, and `exclude_from_irt: true` invariant. Full client UI at `/app/mistakes`.
2. P1-24 (P1-32/P1-33): Commerce & SSLCommerz pipeline:
   - Money arithmetic (`packages/core/src/commerce/money.ts`) with VAT-inclusive 5% breakdown.
   - Gateway adapter (`packages/core/src/commerce/sslcommerz.ts`): transaction ID <= 30 chars, localVerifySign cryptographic hash verification, and secondary Order Validation API check (`validationserverAPI.php`).
   - IPN webhook (`apps/web/app/api/webhooks/sslcommerz/route.ts`).
   - Order checkout actions & UI at `/checkout` and `/checkout/return`.
   - Entitlements engine (`packages/core/src/commerce/entitlements.ts`) activating course features immediately upon verified fulfillment.

## Remaining steps (numbered, in order)

1. Push `main` to `origin` with `ALLOW_GIT_PUSH=1 git push origin main`.
2. Pick next task card: `P1-68` (Item statistics and retirement job) or `P1-25` (packages/ai multi-provider LLM adapter).
3. Switch to task branch `gemini/<ID>-<slug>`.
4. Implement, verify with `pnpm verify:fast`, merge to `main`.

## Exact next command / first action

`ALLOW_GIT_PUSH=1 git push origin main`

## Decisions made (and why)

- SSLCommerz raw IPN is strictly unauthenticated until secondary order validation server call succeeds (`validationserverAPI.php`) per docs/10 §3.2.
- Mistake retries carry `exclude_from_irt: true` so repeated attempts do not distort IRT question item difficulty estimation.
- 5% educational VAT is included in retail BDT prices with breakdowns displayed at checkout and return.

## Known issues / failing tests

- None (all 29 tasks across 8 packages passing; 81 unit tests green in @lumen/core).

## Read first (max 5 paths or doc sections)

- `docs/10-PAYMENTS-VIDEO-INTEGRATIONS.md#§3`
- `docs/00-DECISIONS.md#D5`
- `packages/core/src/commerce/checkout.ts`
- `packages/core/src/commerce/sslcommerz.ts`
- `apps/web/app/[locale]/(checkout)/checkout/return/page.tsx`

## Do NOT touch

- `pnpm-lock.yaml`, `.env*`, `docs/00-DECISIONS.md`, committed DB migrations.

## Needs Opus review (security-critical paths touched)

- [ ] `packages/core/src/commerce/sslcommerz.ts` & `apps/web/app/api/webhooks/sslcommerz/route.ts` (Payment gateway & IPN validation - flagged for low/med review).
