# HANDOFF - Claude <-> Gemini baton

> Overwrite this file at every handoff (`/handoff` or Prompt 9 in `docs/13-PROMPTS.md`). Keep it under 80 lines. State only; no essays.
> Read order for the receiving agent: `AGENTS.md` -> `docs/PROGRESS.md` -> this file. Read nothing else until the task card says so.

## Baton

- From: gemini   To: claude | gemini   Date/time (UTC): 2026-11-12 17:15:00
- Reason: Autonomous Batch completed (P1-26, P1-27, P1-28)
- Branch: main                      Last commit SHA: 8ab19e9
- Device (hostname) / session log path: docs/logs/sessions/2026-11-12-studio-ai-tutor-grader-batch.md
- Pushed to origin? executing now (`ALLOW_GIT_PUSH=1`)   Usage at handoff: nominal
- Working tree clean? yes
- Task: Next backlog task (e.g. P1-15 IELTS Listening runner or P1-56 Deepgram STT adapter) - status: ready
- Milestone gate in progress: M0 / M1 (Internal Alpha)
- Baseline `pnpm verify` at handoff: PASS (30/30 turbo tasks cached/green, build 100% green)

## Done so far (this batch)

1. P1-26: Question Authoring Studio & Immutable Versioning (/studio, /studio/questions/new):
   - Domain service (`packages/core/src/studio/authoring.ts`): RBAC & mandatory 2FA enforcement via `assertCan`, D6 immutable versioning for published questions (incrementing `version_number` while pinning past attempts), and strict D13 interactive pedagogy validation (hints ladder, trap tags, Socratic steps, verbal deconstructor).
   - Studio UI: Question bank authoring table with status/flag filters and interactive multi-tab D13 question editor with live learner preview.
   - 13 comprehensive unit tests in `packages/core/src/__tests__/studio.test.ts`.
2. P1-27: Grounded GRE AI Tutor Drawer & Study Plan Engine (/app/plan):
   - Grounded AI Tutor (`packages/ai/src/tutor/socratic-tutor.ts`): daily tier quotas (Free 10, Core 30, Plus 150), PII redaction, Socratic spoiler guards protecting active answers, and grounded citations.
   - Study Plan Engine (`packages/core/src/analytics/study-plan.ts`): week-by-week schedule based on target exam date and weak topics, with one-click Adaptive Rescheduling for Plus/Live tiers.
   - UI: Slide-over "Ask AI Tutor" drawer in Practice Runner and full `/app/plan` view.
   - Unit tests in `packages/ai/src/__tests__/socratic-tutor.test.ts` and `packages/core/src/__tests__/study-plan.test.ts`.
3. P1-28: Human Grader Queue, AI Score Override & Append-Only Audit Log (/grader):
   - Domain service (`packages/core/src/grader/queue.ts`): queue assignment for `grader` role with 2FA, 4-dimension 0-6 rubric scoring (0.5 step), mandatory 20-char rationale for overrides, human-vs-AI agreement delta KPI tracking (target &ge; 80%), and append-only `audit_log` event protocol per D7.
   - UI: Split-pane Human Grader Workstation at `/grader` with live KPI header.
   - 9 unit tests in `packages/core/src/__tests__/grader.test.ts`.

## Remaining steps (numbered, in order)

1. Push `main` to `origin` with `$env:ALLOW_GIT_PUSH="1"; git push origin main`.
2. Pick next task card from `docs/PROGRESS.md` (e.g. P1-15 IELTS Listening runner or P1-56 Deepgram STT adapter).
3. Switch to task branch `gemini/<ID>-<slug>` or `task/<ID>-<slug>`.
4. Implement, verify with `pnpm verify:fast`, merge to `main`.

## Exact next command / first action

`$env:ALLOW_GIT_PUSH="1"; git push origin main`

## Decisions made (and why)

- D6 immutable versioning strictly preserves historical exam attempt integrity by minting fresh version records on published item edits while drafts mutate in place.
- Socratic spoiler guard enforces that active questions never disclose correct answer options or values before item submission.
- Grade overrides mandate at least 20 characters of justification and permanently append to the audit log per D7.

## Known issues / failing tests

- None (all 30 turbo tasks cached & green, 134 core tests passing, 18 ai tests passing, 17 ui tests passing).

## Read first (max 5 paths or doc sections)

- `docs/00-DECISIONS.md#D4-D7`
- `packages/core/src/studio/authoring.ts`
- `packages/ai/src/tutor/socratic-tutor.ts`
- `packages/core/src/grader/queue.ts`
- `apps/web/app/[locale]/(grader)/grader/page.tsx`

## Do NOT touch

- `pnpm-lock.yaml`, `.env*`, `docs/00-DECISIONS.md`, committed DB migrations.

## Needs Opus review (security-critical paths touched)

- [ ] `packages/core/src/studio/authoring.ts` & `packages/core/src/grader/queue.ts` (Staff RBAC & Audit log protocol - low/med review).
