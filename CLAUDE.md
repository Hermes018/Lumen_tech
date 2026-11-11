# CLAUDE.md - Lumen Academy (placeholder brand; set only in packages/config/brand.ts)

Bangladesh-first ed-tech platform: IELTS/GRE courses + full computer-based mock-test engine (later PTE/DET, tech and university tracks). Modular monolith: Next.js 16 + React 19, TypeScript strict, Tailwind v4, shadcn in packages/ui, Drizzle + Neon Postgres, Better Auth, Inngest, Bunny Stream, SSLCommerz. Built almost entirely by AI agents, so rules below are strict and short.

## Source of truth
- `docs/00-DECISIONS.md` is law (stack, roles, phases, security). Never contradict it; if blocked, add a row to "Decisions needing the founder" in `docs/PROGRESS.md`.
- Plan and routing: `docs/12-BUILD-PLAN-AGENTS.md`. Prompts: `docs/13-PROMPTS.md`. Other docs 01-11 are loaded **by section only**, as listed in the task card (`grep -n "^#" file`, then read a range). Never cat a whole doc.

## Workflow (mandatory)
1. Always work from `docs/PROGRESS.md`: pick the first unchecked task with all deps ticked (ignore `BG-xx` human gates). No task, no work. Daily loop: `/session-start` -> `/next-task` repeat -> `/checkpoint` (13 prompt 19).
2. Lead writes the task card (id, owner, read, touch, do, acceptance, verify, out_of_scope); subagent receives only the card.
3. Implement -> `pnpm verify` -> self-check (docs/12 section 6) -> diff review -> conventional commit -> tick PROGRESS.md -> `/clear`.
4. One task per branch: `task/<ID>-<slug>`. Edit only files in the card's `touch` list.
5. Slash commands: `/session-start`, `/next-task`, `/verify`, `/review`, `/cross-check`, `/polish`, `/security-check`, `/checkpoint`, `/status`, `/log-error`, `/filemap`, `/stress-test`, `/session-end`, `/handoff`, `/resume`.
6. Process detail lives in `docs/22-ENGINEERING-GUARDRAILS.md` (read by section only). Scoped rules auto-load from `.claude/rules/` (frontend, core, db, exam, payments).

## Docs index (load by section only: `grep -n "^#" docs/<file>`, read a line range; never cat a doc)
- 00 decisions (law, D1-D12) | 01-11 teardown, business, product spec, architecture, DB, API, test engine, UI, security, payments/video, devops | 12 backlog + routing (Appendices A-M map NEW-* ids) | 13 prompts (16 content batch, 17 price seed, 18 legal pages, 19 daily routine)
- 14 IELTS curriculum | 15 GRE and other tests curriculum | 16 content sourcing, provenance, import formats | 17 pricing master (canonical prices, allowances, SEED block) | 18 live classes (Zoom pilot P1, in-app P2)
- 19 Bangladesh marketing | 20 international marketing | 21 admissions / Common App (P2/P3, counsellor role) | 22 engineering guardrails (hierarchy, verification ladder, stop rules)
- 23 design research playbook | 24 timeline and milestones M0-M5 | 25 gap audit (GA-xxx) | 26 legal drafts (never publish without counsel sign-off) | 27 support and trust ops (Chatwoot)
- 28 founder setup and environments | 29 notifications and lifecycle messaging | 30 finance, tax, payouts | 31 AI evaluation operations (gold set, calibration) | 32 analytics and experiments
- 33 i18n and Bangla workflow | 34 AI learning features (tutor, FSRS, predictor, meters) | PROGRESS.md tracker + milestone gates + BG human gates | HANDOFF.md baton

## Repo map
```
apps/web/        Next.js app (UI, server actions, route handlers, /api/inngest)
packages/core/   domain services/policies/zod (NO React, NO Next); src/<domain>/index.ts is the only public surface
packages/db/     Drizzle schema, migrations, seed
packages/auth/   Better Auth config, permissions.ts (resource:action)
packages/ui/     shadcn-based design system (tokens in CSS variables)
packages/config/ brand.ts, env.ts (zod), eslint/tsconfig presets
packages/ai/     LLM + STT adapters, prompt templates, eval harness
docs/            specs; PROGRESS.md (tracker), HANDOFF.md (baton)
```

## Commands
`pnpm dev` | `pnpm verify` (typecheck + lint + unit tests + build) | `pnpm test` | `pnpm test:e2e` | `pnpm db:generate` | `pnpm db:migrate` | `pnpm db:seed` | `pnpm lint --fix` | `pnpm format`
Nothing is done until `pnpm verify` is green and its output shown.

## Coding rules
- TypeScript strict + `noUncheckedIndexedAccess`. No `any`, no `@ts-ignore`, no unexplained `!`.
- zod at every boundary (forms, actions, route handlers, webhooks, env, LLM output). Share schemas client/server.
- Authorization lives in `packages/core`: `assertCan(actor, 'resource:action', resource)` in every service function, with allow + deny tests. UI/middleware checks are cosmetic only.
- Server is authoritative for price, entitlements, test deadlines, scores. Money = integer minor units + ISO currency.
- Routes (`apps/web/app/[locale]/`, D2): `(marketing)`, `(auth)`, `(checkout)`, `(learner)` = `/app/**`, `(exam)` = `/exam/[attemptId]`, `(studio)`, `(grader)`, `(staff)` = `/editor` `/support` `/finance`, `(org)` = `/org/[orgSlug]`, `(counsellor)` = `/counsellor/**` (P2/P3), `(admin)`. Locale `as-needed`: English at root, Bangla under `/bn`. Never use `(learn)`, `(test)`, `(dashboard)` or `/dashboard`.
- 2FA (passkey or TOTP) is mandatory for `grader`+ staff, `instructor` and `org_admin` (D4), enforced server-side in `assertCan`/session, never UI-only. Speaking STT: Deepgram Nova-3 default, `whisper-1` (word timestamps) fallback, behind `SttProvider`.
- Server modules import `server-only`; read env only through `packages/config/env.ts`.
- UI: tokens and `packages/ui` components only; every view has empty/loading/error states; keyboard + axe clean; en + bn strings via next-intl; Lucide icons; no gradients/emoji icons/"AI glow".
- No new dependencies without explicit approval in the task card. Prefer shadcn/Better Auth/React Email/Tiptap official patterns.
- `TODO` only as `TODO(<task-id>): ...`. Comments explain why, not what.
- Conventional commits: `feat|fix|chore|docs|test|refactor(scope): summary (P1-12)`. Small commits, no force push.
- Tests: Vitest for logic (tests first), Playwright for user flows, axe on new pages.

## Model routing (details: docs/12 section 2)
| Model | Subagents |
|---|---|
| Opus (lead) | `architect-reviewer`; plans, task cards, critical-path review, security sign-off |
| Sonnet | `backend-engineer`, `frontend-engineer`, `db-engineer`, `test-engine-engineer`, `payments-integrator`, `security-auditor`, `qa-engineer`, `ui-polisher` |
| Haiku | `i18n-copywriter`, `docs-scribe`, `seed-data-maker`, `lint-fixer` |
Escalate: Haiku fails twice -> Sonnet; Sonnet fails twice or touches a security-critical path -> Opus review. Subagents reply in <=150 words + files changed + last 15 lines of verify.

## Resilience, logs, multi-device (docs/22 sections 7-9)
- Commit WIP on the task branch at least every 30 min and after each green `pnpm verify:fast`; `git push` after every green `pnpm verify`. `/checkpoint` before risky steps and at >=70% plan usage; `/handoff` at ~85%.
- Never rely on `/rewind` (misses Bash/subagent edits, pnpm hard links): git is the undo.
- Resume: `git fetch && git status -sb && git log -5`, `git pull --rebase`, read the SessionStart output + last session log "Next step" + HANDOFF.md, `pnpm verify:fast`, continue.
- One device works on one branch at a time; always `git pull --rebase` at session start. Never copy `.env` between machines or into chat.
- Logs: session log in `docs/logs/sessions/`; non-trivial failures via `/log-error`; ADR-lite in `docs/logs/decisions/`; `docs/FILEMAP.md` is generated; give every new file a one-line `@purpose` header.
- Evidence rule: no claim without `file:line` or pasted command output. Unknown is a valid answer. Package/env/API names must exist (docs/10 section 15.3, installed types, `docs/approved-deps.txt`); never invent them.
- Reviewer is never the author; critical paths need the two-key rule (Opus architect-reviewer + auditor). Stop and ask the founder per docs/22 section 12.2.
- Hooks enforce: guard-paths (protected files), guard-bash (curl|sh, force/main push, unapproved deps). A BLOCKED message means stop and ask, not work around.
- Fan-less Mac: `turbo --concurrency=2`, one dev server, Playwright workers 2, no Docker Desktop (Neon dev branch), heavy jobs in CI. Visual snapshots only from CI Linux.

## Token discipline
Short answers; diffs not files; cards list line ranges (`tooling/ctxpack.sh`); manual `/compact` at ~60% with the preserve template (docs/22 3.3); working context <=150K; do not re-read files you just edited; batch small Haiku jobs; cache research in `docs/research-cache/`; `/clear` after each task.

## Never
- Never commit or print secrets; never read `.env*`; never hard-code the brand name or prices.
- Never trust client time/price/score; never skip `assertCan`; never put auth only in middleware.
- Never add dependencies, change CI/CD, auth config, CSP or migrations outside a task that says so.
- Never copy code from AGPL/GPL LMSs, scrape or copy exam content (IELTS/GRE/etc.) or competitor sites, decompile or paste third-party source; content must be original or licensed. Official exam names only with disclaimers; scores labelled "estimated".
- Never use `sudo`, `rm -rf`, `git push --force`, `git push origin main`, `--no-verify`, `curl | sh`, or edit `docs/00-DECISIONS.md` without founder approval + change-log line.
- Never expand scope, refactor unrelated code, or mark a task done without verify output.
- Never use Vercel Hobby for production, or SF Symbols on the web.
