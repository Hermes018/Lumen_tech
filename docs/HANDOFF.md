# HANDOFF - Claude <-> Gemini baton

> Overwrite this file at every handoff (`/handoff` or Prompt 9 in `docs/13-PROMPTS.md`). Keep it under 80 lines. State only; no essays.
> Read order for the receiving agent: `AGENTS.md` -> `docs/PROGRESS.md` -> this file. Read nothing else until the task card says so.

## Baton

- From: gemini   To: claude | gemini   Date/time (UTC): 2026-11-13 10:05:00
- Reason: Autonomous Batch P1-29..P1-31 complete & Milestone M0 Clickable Prototype 100% Ready
- Branch: main                      Last commit SHA: a349ba9
- Device (hostname) / session log path: docs/logs/progress/2026-11-13-m0-prototype-readiness.md
- Pushed to origin? Yes (synced with origin/main)   Usage at handoff: nominal
- Working tree clean? yes
- Task: Next backlog task (e.g. P1-34 Entitlements or Content/Vocab Expansion) - status: ready
- Milestone gate in progress: M0 Complete -> M1 Internal Alpha (GRE Core + Magoosh Engine)
- Baseline `pnpm verify` at handoff: PASS (30/30 turbo tasks cached & green, 217 unit tests, 57 compiled routes)

## Done so far (this batch: P1-29, P1-30, P1-31)

1. P1-29: Flagship GRE/IELTS conversion pages & SEO tools:
   - Flagship `/gre`, `/ielts`, `/courses` showcases highlighting Magoosh + GregMat + Brilliant parity suite.
   - Live interactive GRE mini-widget directly on `/gre` (Quant QC with 3-tier Hint Ladder & Trap Diagnostics).
   - Interactive SEO lead magnets: `/tools/gre-score-calculator` and `/tools/ielts-band-calculator`.
2. P1-30: Honest pricing engine, regional PPP & coupon caps:
   - Domain service (`packages/core/src/commerce/pricing.ts`): regional PPP resolution (BD in BDT VAT-inclusive, A/B/C in USD).
   - D12 C14 honest `compare_at` validator requiring >= 28 consecutive days in past 90 days.
   - Coupon discount caps & anti-cannibalization invariant (3-month pass >= 74.9% of Core).
   - Interactive `/pricing` matrix with bKash 2/3-part installment breakdowns and checkout routing.
   - Unit tests in `packages/core/src/__tests__/pricing.test.ts`.
3. P1-31: Guest GRE Express Diagnostic & Public Certificate Verification:
   - Domain services: `packages/core/src/exam/diagnostic.ts` and `packages/core/src/certificates/verify.ts`.
   - Guest CBT runner (`/exam/diagnostic`, `/diagnostic`) with Rasch 1PL EAP scoring, trap diagnostics, and sign-up claim gate (`claimDiagnosticAttempt`).
   - Public certificate verification (`/verify/[certId]`) with refund revocation rules.
   - Unit tests in `packages/core/src/__tests__/diagnostic-and-certificates.test.ts`.
4. Milestone M0 Audit: Completed in `docs/logs/progress/2026-11-13-m0-prototype-readiness.md`.

## Remaining steps (numbered, in order)

1. Commit and push docs update (`docs/PROGRESS.md`, `docs/HANDOFF.md`, and `docs/logs/progress/2026-11-13-m0-prototype-readiness.md`).
2. Pick next backlog task from `docs/PROGRESS.md` (e.g. P1-34 Entitlement service or Content/Vocab expansion).
3. Switch to task branch `gemini/<ID>-<slug>` or `task/<ID>-<slug>`.
4. Implement, verify with `pnpm verify:fast`, merge to `main`.

## Exact next command / first action

`git status -sb`

## Decisions made (and why)

- D12 C14 honest pricing strictly prohibits fake strike-through discounts; `resolveCompareAtPrice` demands proof of >= 28 consecutive days at the higher price within the past 90 days.
- 3-month pass (`pass-3m`: BDT 2,990) maintains 74.94% of IELTS Core (BDT 3,990), strictly adhering to the >= 74.9% anti-cannibalization threshold.
- Guest diagnostics allow full 8-item CBT execution and initial Rasch scoring, but full breakdown and study plan generation require sign-up claim per D4.
- Certificate verification immediately reflects `REVOKED` if an enrollment is refunded.
- 8-Model Antigravity CLI 1.5.5 Matrix locked in `docs/00-DECISIONS.md#D9` (`Orchestrator (Argon)`, `Gemini 4 Argon`, `Gemini 4 Carbon`, `Gemini 4 Hydrogen`, `Gemini 3.8 Flash`, `Claude Sonnet 5.5`, `Claude Opus 5.5` [Low/Med only], `GPT-OSS 120B (Medium)`).

## Known issues / failing tests

- None (30/30 turbo tasks cached & green, 217 unit tests passing, 57 Next.js static routes compiled).

## Read first (max 5 paths or doc sections)

- `docs/00-DECISIONS.md#D2-D5`
- `docs/logs/progress/2026-11-13-m0-prototype-readiness.md`
- `packages/core/src/commerce/pricing.ts`
- `packages/core/src/exam/diagnostic.ts`
- `packages/core/src/certificates/verify.ts`

## Do NOT touch

- `pnpm-lock.yaml`, `.env*`, `docs/00-DECISIONS.md`, committed DB migrations.

## Needs Opus review (security-critical paths touched)

- [ ] `packages/core/src/commerce/pricing.ts` (pricing resolution, coupon caps, compare_at validator - low/med review).
- [ ] `packages/core/src/certificates/verify.ts` (certificate issuance & revocation rules - low/med review).
