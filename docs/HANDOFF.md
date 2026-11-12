# HANDOFF - Claude <-> Gemini baton

> Overwrite this file at every handoff (`/handoff` or Prompt 9 in `docs/13-PROMPTS.md`). Keep it under 80 lines. State only; no essays.
> Read order for the receiving agent: `AGENTS.md` -> `docs/PROGRESS.md` -> this file. Read nothing else until the task card says so.

## Baton

- From: gemini   To: claude | gemini   Date/time (UTC): 2026-11-12 15:52:00
- Reason: Founder Override batch completed (P1-25, P1-68)
- Branch: main                      Last commit SHA: (see git log)
- Device (hostname) / session log path: docs/logs/sessions/2026-11-12-learner-dashboard-and-item-stats-batch.md
- Pushed to origin? authorized (`ALLOW_GIT_PUSH=1`)   Usage at handoff (5h / weekly %): nominal
- Working tree clean? yes
- Task: Next backlog task (e.g. P1-15 IELTS Listening runner or P1-56 Deepgram STT adapter) - status: ready
- Milestone gate in progress: M0 / M1 (GRE Priority & Learner Analytics)
- Baseline `pnpm verify` at handoff: PASS (29/29 turbo tasks cached/green, build 100% green)

## Done so far (this batch)

1. P1-25: Learner Dashboard & Analytics UI:
   - Aggregation service (`packages/core/src/analytics/progress.ts`) with study streaks (consecutive active days, freeze tracking, 30-day calendar), Khan Academy style XP levels (10 tiers), and estimated GRE score predictor (strictly 130-170 bounds, section breakdown, target gap, confidence rating).
   - Reusable UI primitives (`packages/ui`): `StreakPill`, `LevelProgressBar`, `ScorePredictorChart` (accessible SVG, zero heavy dependencies).
   - Server action `apps/web/app/actions/analytics.ts` with `assertCan(actor, 'user:view_own')` security check.
   - Learner Dashboard at `/app` and full analytics & mastery view at `/app/progress`.
2. P1-68: Item Statistics & Retirement Engine (07 §8.6):
   - Math engine (`packages/core/src/exam/statistics.ts`): classical p-values, corrected item-rest point-biserial correlation ($r_{pbis}$), option-level distractor analysis, and exposure limits.
   - Flagging and retirement rules: too hard (<0.15), too easy (>0.95), weak discrimination (<0.15), key-suspected (negative $r_{pbis}$ or distractor beats key), over-exposed (>rMax), and auto-retirement for defective items.
   - Background job stub in `apps/web/app/api/inngest/route.ts` (`analytics.refresh-question-stats`).
   - 14 comprehensive unit tests in `packages/core/src/__tests__/statistics.test.ts`.

## Remaining steps (numbered, in order)

1. Push `main` to `origin` with `ALLOW_GIT_PUSH=1 git push origin main`.
2. Pick next task card from `docs/PROGRESS.md`.
3. Switch to task branch `gemini/<ID>-<slug>` or `task/<ID>-<slug>`.
4. Implement, verify with `pnpm verify:fast`, merge to `main`.

## Exact next command / first action

`ALLOW_GIT_PUSH=1 git push origin main`

## Decisions made (and why)

- Zero new dependencies: used lightweight, highly responsive, WCAG 2.2 AA accessible SVG components for score predictor and streak tracking.
- Classical psychometric formulas implemented with corrected item-rest calculations to prevent spurious inflation of item-total correlations.

## Known issues / failing tests

- None (all 29 tasks across 8 packages passing; 107 unit tests green in @lumen/core, 17 in @lumen/ui).

## Read first (max 5 paths or doc sections)

- `docs/07-TEST-ENGINE.md#§8.6`
- `docs/03-PRODUCT-SPEC.md#§5.2`
- `packages/core/src/analytics/progress.ts`
- `packages/core/src/exam/statistics.ts`
- `apps/web/app/[locale]/(learner)/app/page.tsx`

## Do NOT touch

- `pnpm-lock.yaml`, `.env*`, `docs/00-DECISIONS.md`, committed DB migrations.

## Needs Opus review (security-critical paths touched)

- [ ] `packages/core/src/commerce/sslcommerz.ts` & `apps/web/app/api/webhooks/sslcommerz/route.ts` (Payment gateway & IPN validation - flagged for low/med review).
