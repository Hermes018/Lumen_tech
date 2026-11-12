# HANDOFF - Claude <-> Gemini baton

> Overwrite this file at every handoff (`/handoff` or Prompt 9 in `docs/13-PROMPTS.md`). Keep it under 80 lines. State only; no essays.
> Read order for the receiving agent: `AGENTS.md` -> `docs/PROGRESS.md` -> this file. Read nothing else until the task card says so.

## Baton

- From: gemini   To: claude | gemini   Date/time (UTC): 2026-11-12 10:45:00
- Reason: batch completed (P1-19, P1-20, P1-21)
- Branch: main                      Last commit SHA: (see git log)
- Device (hostname) / session log path: docs/logs/sessions/2026-11-12-gre-practice-engine-batch.md
- Pushed to origin? paused per founder instruction   Usage at handoff (5h / weekly %): nominal
- Working tree clean? yes
- Task: P1-22-23 - Mock Exam Engine & AI Evaluation Pipeline - status: ready
- Milestone gate in progress: M0 (GRE Priority Clickable Prototype)
- Baseline `pnpm verify` at handoff: PASS (29/29 turbo tasks cached/green, build 100% green)

## Done so far (this batch)

1. P1-19: FSRS v4.5 active-recall math in `packages/core/src/fsrs`, practice session state reducers (hints, mastery, second-chance, Socratic micro-steps) in `packages/core/src/exam/practice.ts`, unit tests passing (49/49).
2. P1-20: Interactive GRE pedagogy components in `packages/ui/src/components/gre`: `GreCalculator`, `HintLadder`, `TrapDiagnostic`, `SocraticStepper`, `VerbalDeconstructor`. Component tests passing (11/11).
3. P1-21: Learner Practice Dashboard (`/app/practice`), Active Practice runner (`/app/practice/[sessionId]`), 4-mode FSRS vocab player (`/app/vocab/play`). Next.js 16 build passing with 28 prerendered/SSG routes.

## Remaining steps (numbered, in order)

1. Switch to `task/P1-22-23-adaptive-exam-ai-eval`.
2. Implement GRE section-level adaptive routing (12Q -> 15Q) and scaled score estimation in `packages/core/src/exam`.
3. Wire AI evaluation adapter in `packages/ai` for GRE AWA Issue essay grading.
4. Run `pnpm verify:fast` and merge to `main`.

## Exact next command / first action

`git switch -c task/P1-22-23-adaptive-exam-ai-eval`

## Decisions made (and why)

- Implemented pure TypeScript FSRS v4.5 scheduler (DSR model) with 0 external dependencies to strictly preserve lockfile immutability.
- Added `<React.Suspense>` boundary around `useSearchParams()` in `/app/vocab/play` to satisfy Next.js static prerendering requirements.
- Standardized `packages/core` tsconfig moduleResolution to `Bundler` matching `packages/ui` so Next.js Turbopack seamlessly transpiles workspace packages.

## Known issues / failing tests

- None (all 29 tasks across 8 packages passing).

## Read first (max 5 paths or doc sections)

- `docs/07-TEST-ENGINE.md#§3-§4,§7`
- `docs/34-AI-LEARNING-FEATURES.md#§1,§6`
- `packages/core/src/exam/practice.ts`
- `packages/ui/src/components/gre/index.ts`

## Do NOT touch

- `pnpm-lock.yaml`, `.env*`, `docs/00-DECISIONS.md`, committed DB migrations.

## Needs Opus review (security-critical paths touched)

- [ ] none (pure pedagogical UI and client/core state runners).
