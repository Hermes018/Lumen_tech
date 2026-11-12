# HANDOFF - Claude <-> Gemini baton

> Overwrite this file at every handoff (`/handoff` or Prompt 9 in `docs/13-PROMPTS.md`). Keep it under 80 lines. State only; no essays.
> Read order for the receiving agent: `AGENTS.md` -> `docs/PROGRESS.md` -> this file. Read nothing else until the task card says so.

## Baton

- From: gemini   To: claude | gemini   Date/time (UTC): 2026-11-12 13:20:00
- Reason: batch completed (P1-22, P1-23)
- Branch: main                      Last commit SHA: (see git log)
- Device (hostname) / session log path: docs/logs/sessions/2026-11-12-mock-exam-adaptive-ai-eval.md
- Pushed to origin? authorized (`ALLOW_GIT_PUSH=1`)   Usage at handoff (5h / weekly %): nominal
- Working tree clean? yes
- Task: P1-67 - Mistake Notebook (/app/mistakes) - status: ready
- Milestone gate in progress: M0 / M1 (GRE Adaptive Prototype & Magoosh Engine)
- Baseline `pnpm verify` at handoff: PASS (29/29 turbo tasks cached/green, build 100% green)

## Done so far (this batch)

1. P1-22: GRE section-level adaptive routing (`packages/core/src/exam/adaptive.ts`): Section 1 (12Q) -> Section 2 (15Q) routing to Easier/Standard/Harder panel with raw percentage & calibrated theta upgrade rules.
2. P1-23: Rasch 1PL EAP ability estimator & scaled scoring (`packages/core/src/exam/scoring.ts`): worked example verified (20/27 at b=0 -> Verbal 158 [154-161]). Complete CBT Exam Runner (`apps/web/app/[locale]/(exam)/exam/[attemptId]/ExamRunnerClient.tsx`) with timer, autosave, calculator, and 130-170 score report.
3. AI Evaluation Pipeline (`packages/ai/src/evaluation/awa.ts`): GRE AWA Analyze an Issue essay grading with Zod schema validation on 0.5 grid, PII redaction (email, phone, URL, ID, names), substring grounding verification, and deterministic length/off-topic rubric caps.

## Remaining steps (numbered, in order)

1. Switch to `task/P1-67-mistake-notebook`.
2. Implement Mistake Notebook domain service in `packages/core/src/exam/practice.ts` with Open and Resolved states.
3. Build `/app/mistakes` UI with taxonomy filters (Careless Math, Vocab Gap, Trap Answer, Misread Prompt).
4. Run `pnpm verify:fast`, merge to `main`, push to origin with `ALLOW_GIT_PUSH=1`.

## Exact next command / first action

`git switch -c task/P1-67-mistake-notebook`

## Decisions made (and why)

- Rasch 1PL EAP implementation uses 81-point Gauss-Hermite numerical quadrature grid `[-4, 4]` strictly adhering to `docs/07-TEST-ENGINE.md` §3.3.6.
- AWA AI Evaluation output is validated with Zod `.strict()` matching ETS 4-dimension criteria and 0.5 step grading.
- Next.js dynamic exam route `/[locale]/exam/[attemptId]` prerenders cleanly with interactive client runner and server actions.

## Known issues / failing tests

- None (all 29 tasks across 8 packages passing).

## Read first (max 5 paths or doc sections)

- `docs/07-TEST-ENGINE.md#§3.4`
- `docs/12-BUILD-PLAN-AGENTS.md#P1-67`
- `packages/core/src/exam/scoring.ts`
- `packages/core/src/exam/adaptive.ts`
- `packages/ai/src/evaluation/awa.ts`

## Do NOT touch

- `pnpm-lock.yaml`, `.env*`, `docs/00-DECISIONS.md`, committed DB migrations.

## Needs Opus review (security-critical paths touched)

- [ ] none (scoring math & adaptive routing fully verified with deterministic tests; authz unchanged).
