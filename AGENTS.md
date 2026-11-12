# AGENTS.md - Lumen Academy (tool-agnostic agent instructions)

For Gemini CLI, Google Antigravity, Codex or any coding agent. Claude Code reads `CLAUDE.md`; the rules are identical. You may not have subagents or slash commands: do the work **sequentially yourself**, playing implementer, then self-reviewer, then committer.

## 1. What this is
Lumen Academy (placeholder brand, defined only in `packages/config/brand.ts`) is a Bangladesh-first ed-tech platform: IELTS/GRE courses and a full computer-based mock-test engine; later PTE/DET, tech and university tracks. Modular monolith in a pnpm + Turborepo monorepo: Next.js 16 (React 19), TypeScript strict, Tailwind v4, shadcn/ui in `packages/ui`, Drizzle + Neon Postgres, Better Auth, Inngest, Bunny Stream, Cloudflare R2, SSLCommerz (BD) and Paddle/Stripe (intl), Resend, next-intl (en, bn).

## 2. Source of truth and reading discipline
- `docs/00-DECISIONS.md` wins every conflict. Do not contradict it, invent other technologies, or edit it.
- Plan/process: `docs/12-BUILD-PLAN-AGENTS.md`. Prompts: `docs/13-PROMPTS.md`. Tracker: `docs/PROGRESS.md`. Baton: `docs/HANDOFF.md`.
- Docs 01-11 are read **only by the sections named in the task card**: `grep -n "^#" docs/<file>`, then read the line range. Never load a whole doc. Do not scan the whole repo.

## Docs index (load by section only: `grep -n "^#" docs/<file>`, read a line range; never cat a doc)
- 00 decisions (law, D1-D12) | 01-11 teardown, business, product spec, architecture, DB, API, test engine, UI, security, payments/video, devops | 12 backlog + routing (Appendices A-M map NEW-* ids) | 13 prompts (16 content batch, 17 price seed, 18 legal pages, 19 daily routine)
- 14 IELTS curriculum | 15 GRE and other tests curriculum | 16 content sourcing, provenance, import formats | 17 pricing master (canonical prices, allowances, SEED block) | 18 live classes (Zoom pilot P1, in-app P2)
- 19 Bangladesh marketing | 20 international marketing | 21 admissions / Common App (P2/P3, counsellor role) | 22 engineering guardrails (hierarchy, verification ladder, stop rules)
- 23 design research playbook | 24 timeline and milestones M0-M5 | 25 gap audit (GA-xxx) | 26 legal drafts (never publish without counsel sign-off) | 27 support and trust ops (Chatwoot)
- 28 founder setup and environments | 29 notifications and lifecycle messaging | 30 finance, tax, payouts | 31 AI evaluation operations (gold set, calibration) | 32 analytics and experiments
- 33 i18n and Bangla workflow | 34 AI learning features (tutor, FSRS, predictor, meters) | PROGRESS.md tracker + milestone gates + BG human gates | HANDOFF.md baton

## 3. Repo map
```
apps/web/ (Next.js app, /api/inngest)   packages/core/ (domain logic, no React/Next, src/<domain>/index.ts public)
packages/db/ (Drizzle schema/migrations/seed)   packages/auth/ (Better Auth, permissions.ts)
packages/ui/ (design system)   packages/config/ (brand.ts, env.ts, presets)   packages/ai/ (LLM/STT adapters, evals)
tooling/ (scripts)   docs/ (specs, PROGRESS.md, HANDOFF.md)
```

## 4. Commands
`pnpm install` | `pnpm dev` | `pnpm verify` (typecheck + lint + unit tests + build) | `pnpm test` | `pnpm test:e2e` | `pnpm db:generate` | `pnpm db:migrate` | `pnpm db:seed` | `pnpm format`
Never claim a command passed without showing its output tail (last 10-15 lines).

## 5. The procedure (do this for every task)
1. Open `docs/PROGRESS.md`. If "Current task" is filled, continue it. Otherwise take the first unchecked backlog item whose deps are all ticked (ignore `BG-xx` human gates). Acceptance criteria for backlog IDs are in `docs/12-BUILD-PLAN-AGENTS.md` section 11.
2. Write the task card into "Current task" (id, title, read, touch, do, acceptance, verify, out_of_scope). Only edit files in `touch`.
3. `git switch -c task/<ID>-<slug>` (Gemini-originated work on a new task: `gemini/<ID>-<slug>`).
4. Write tests first for logic. Implement. Run `pnpm verify`. Fix until green (max 3 attempts; then stop, log the failure in HANDOFF.md, move on).
5. Self-review your diff (`git diff --stat`, then `git diff`): scope, `any`, TODOs, secrets, zod at boundaries, `assertCan` + allow/deny tests, server-authoritative rules, UI states, a11y, en/bn keys. Run the matching checklist in `docs/12-BUILD-PLAN-AGENTS.md` section 6.
6. Commit with a conventional message including the task ID, e.g. `feat(core): attempt deadlines (P1-12)`.
7. Tick the task in `docs/PROGRESS.md`, add a Done-log row (tag `(gemini)` or your tool name), clear "Current task". Start the next task with fresh context.
Do exactly the task. No refactors, renames, formatting sweeps or "while I'm here" changes.

## 6. Coding rules
- TS strict + `noUncheckedIndexedAccess`; no `any`, `@ts-ignore`, unexplained non-null `!`.
- zod validation at all boundaries (forms, server actions, route handlers, webhooks, env, LLM outputs).
- Authorization in `packages/core` service functions via `assertCan(actor, 'resource:action', resource)` including ownership/org checks; never rely on UI or middleware alone.
- Server decides prices, entitlements, test deadlines, scores. Money = integer `amount_minor` + ISO currency.
- Routes (`apps/web/app/[locale]/`, D2): `(marketing)`, `(auth)`, `(checkout)`, `(learner)` = `/app/**`, `(exam)` = `/exam/[attemptId]`, `(studio)`, `(grader)`, `(staff)` = `/editor` `/support` `/finance`, `(org)` = `/org/[orgSlug]`, `(counsellor)` = `/counsellor/**` (P2/P3), `(admin)`. Locale `as-needed`: English at root, Bangla under `/bn`. Never use `(learn)`, `(test)`, `(dashboard)` or `/dashboard`.
- 2FA (passkey or TOTP) is mandatory for `grader`+ staff, `instructor` and `org_admin` (D4), enforced server-side in `assertCan`/session, never UI-only. Speaking STT: Deepgram Nova-3 default, `whisper-1` (word timestamps) fallback, behind `SttProvider`.
- `import 'server-only'` in server modules; env only via `packages/config/env.ts`; never log PII or secrets.
- UI: only `packages/ui` components and tokens; empty/loading/error states; keyboard and axe clean; next-intl strings (en + bn); Lucide icons; no gradients, emoji icons or "AI glow".
- Domains communicate only through each domain's `index.ts`. No React/Next imports in `packages/core`.
- No new dependency unless the task card allows it. Prefer official shadcn / Better Auth / React Email / Tiptap patterns.
- `TODO(<task-id>):` only. Conventional commits. Tests: Vitest (logic), Playwright (flows), axe (a11y).

## 7. Security-critical paths (implement to the card, then flag `needs-opus-review`)
`packages/auth/**`; `packages/core/src/{authz,entitlements,payments,orders,attempts,scoring,adaptive,audit,uploads}/**`; `apps/web/app/api/**/webhooks/**`; `apps/web/app/api/inngest/**`; `packages/db/migrations/**`; `apps/web/next.config.*`; CSP/header code; any direct `process.env` use. When Gemini/other agents touch these, record the file list in `docs/HANDOFF.md` under "Needs two-key review" (Sonnet or Opus low/med; Opus high is banned) and do not mark the task fully done.

## 8. Quality gates (Definition of Done)
`pnpm verify` green; each acceptance criterion proven by test/output; Playwright e2e for user-facing flows; axe 0 serious/critical on new pages; no `any`; no TODO without ID; no secrets; authz allow+deny tests; no unapproved dependency; conventional commit; PROGRESS.md ticked.

## 9. PROGRESS.md and HANDOFF.md
- PROGRESS.md: tick only when done; keep "Current task" current; put founder questions in "Decisions needing the founder" (and continue with another unblocked task).
- HANDOFF.md: overwrite when stopping or near limits. Fill: branch, last SHA, clean tree (commit WIP as `wip(scope): ... [handoff]`), done, numbered remaining steps, exact next command, decisions, known failures, files to read first, files not to touch, security-critical files touched. Append to "Resume log" when you start and after each task.
- On resume: read AGENTS.md -> PROGRESS.md -> HANDOFF.md, `git switch` to the branch, `pnpm install && pnpm verify`, log the result, continue the first remaining step.

## 9b. Guardrails, checkpoints and multi-device (docs/22)
- Process detail: `docs/22-ENGINEERING-GUARDRAILS.md` (hierarchy P0.1..P3.5, verification ladder, review rules, git, logs, stop rules). Scoped rules: `.claude/rules/*.md` (frontend, core, db, exam, payments) apply to you too when you touch those paths, even without hook enforcement.
- Checkpoint (you have no slash commands): prompt 13 in `docs/13-PROMPTS.md`: WIP commit `wip(scope): what (ID) [checkpoint]`, `git pull --rebase`, `git push -u origin HEAD`, append "Next step" to the session log, refresh HANDOFF. Do it every <=30 min and before any risky step. Never rely on `/restore`/`/rewind` alone; git is the undo.
- Resume: `git fetch && git status -sb && git log -5 --oneline`, `git pull --rebase`, read HANDOFF.md, `pnpm install --frozen-lockfile`, `pnpm verify:fast`, continue the first remaining step.
- Multi-device & Dual-Boot (Win11 / Fedora 44): one device/OS per branch; `git pull --rebase` at session start; never copy `.env` or `node_modules` across OS; LF line endings enforced.
- 8 GB RAM Guardrails (Intel i5-1135G7, 8GB DDR4, NVIDIA MX330): `NODE_OPTIONS="--max-old-space-size=2048"`, `turbo --concurrency=2`, Vitest `--pool=forks --maxWorkers=2 --no-file-parallelism`, `tsc --noEmit --incremental`, zero local containers (no Docker/Podman, Neon + Upstash only), no local Playwright swarms (run L0/L1 locally, full E2E in CI). Dual-boot OS switch via git commit -> boot -> pull --rebase -> `pnpm install --prefer-offline`.
- You have no PreToolUse hooks: obey the protected paths yourself. Never edit `.env*` (except `.env.example`), `docs/00-DECISIONS.md`, `.claude/settings*.json`, `.claude/hooks/**`, `pnpm-lock.yaml`, committed migrations. Security-critical paths only if the card lists them. No new dependency unless it is in `docs/approved-deps.txt` (check existence/age/downloads first).
- Logs: create `docs/logs/sessions/YYYY-MM-DD-gemini-<n>.md` from `docs-templates/logs/SESSION-TEMPLATE.md`; append failures to `docs/logs/errors/ERROR-LOG.md` (append-only); decisions as ADR-lite. Every new file gets a one-line `@purpose` header.
- Evidence rule: no claim without `file:line` or pasted output; invented env vars/packages/APIs are forbidden. Author != reviewer: for cross-checks follow prompt 14. Stop and ask per docs/22 section 12.2.
- Visual snapshots: never update baselines locally; CI Linux only.

## 10. Never
Commit/print secrets or read real `.env*` (`.env.example` is fine); trust client time/price/score; skip `assertCan`; copy code from AGPL/GPL LMSs; copy or scrape exam content or competitor sites, decompile or paste third-party source (content is original or licensed; scores labelled "estimated"; trademark disclaimers); `rm -rf`, `git push --force`, `curl | sh`; modify `docs/00-DECISIONS.md`, CI, auth config, CSP or migrations unless the task says so; expand scope; mark done without verify output; hard-code the brand name.

## 11. Output style
Be terse. Report per task in <=100 words: what changed, files, verify tail, open questions. Show diffs or paths, not whole files.
