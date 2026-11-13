# 12 — Build Plan & Agent Orchestration Manual

> Conforms to `docs/00-DECISIONS.md` (D1 phases, D2 layout, D3 stack, D4 roles, D9 orchestration). If this file disagrees, 00 wins.
> Audience: the founder and every AI agent (Claude Code, Gemini CLI / Google Antigravity, or any other). Prompts live in `docs/13-PROMPTS.md`. Project memory lives in `CLAUDE.md` / `AGENTS.md` / `GEMINI.md` at repo root (sources in `build-kit/`).
> Section references like `docs/07-TEST-ENGINE.md §Scoring` mean "the heading containing that word". If a heading is missing, `grep -n "^#" <file>` and pick the nearest; never load a whole doc.

> **Backlog consolidated (delivery lead, 2026-11-07):** section 11 now holds every task from docs 16-21 and 26-34 plus the 14 GA-004 gaps, grouped by the `docs/22` milestones and tagged with the `docs/24` gates (M0-M5). Source `NEW-*` IDs map to final IDs in Appendices A-M at the end of this file; human-owned prerequisites are `BG-xx` gates.

> **Extended by `docs/22-ENGINEERING-GUARDRAILS.md`** (hierarchy P0.1..P3.5, model/cost routing, context & compaction, verification ladder, two-key review, checkpoint/resume, git, logs, resource limits, DoD v2, stop rules). 12 keeps the task IDs; 22 wins on process detail where it is stricter.

## 1. Operating model in one page

1. The **backlog** (section 11) is the plan. `docs/PROGRESS.md` is the live tracker. Nothing is built that is not a task there.
2. The **lead session (Opus)** plans, writes task cards, reviews diffs on critical paths and merges. It does not write bulk feature code.
3. **Subagents (Sonnet / Haiku)** receive a task card, not the repo. They implement, run `pnpm verify`, self-check, and report in at most 150 words.
4. State lives in **files** (PROGRESS.md, HANDOFF.md, git history), never in chat memory. Any session or any tool can resume from them.
5. One task = one branch = one PR-sized commit series. Small, verified, reversible.

## 2. Model routing policy (8-Model Antigravity CLI 1.5.5 Matrix)

| Model in Antigravity CLI | Effort Tier | Assigned Role & Tasks in Lumen Academy |
|---|---|---|
| **`Orchestrator (Argon)`** | `Med` / `High` | **Autonomous Batch Dispatcher:** Multi-step task card execution, branch orchestration, and automated build/test loops (primary driver before Argon weekly reset). |
| **`Gemini 4 Argon`** | `Med` / `High` | **Frontier Full-Stack & Core Engine Builder:** Complex backend services, Drizzle DB persistence adapters, IRT/Rasch math, RBAC/entitlements, and executing Opus audit fix plans. |
| **`Gemini 4 Carbon`** | `Med` / `High` | **UI & Feature Workhorse:** Next.js 16 App Router pages, React 19 interactive components, Tailwind v4 styling, Studio/Admin consoles, and standard Vitest suites. |
| **`Gemini 4 Hydrogen`** | `Low` / `Med` | **Ultra-Fast Mechanical & Log Tier:** Pre-audit scanner scripts, `PROGRESS.md`/`HANDOFF.md`/session logs, lint/type fixes, i18n (`en`/`bn` dictionaries), and boilerplate. |
| **`Gemini 3.8 Flash`** | `Low` / `Med` / `High` | **Proven High-Speed Fallback Builder:** General full-stack implementation whenever Gemini 4 Argon/Carbon quota is conserved. |
| **`Claude Sonnet 5.5`** | `Low` / `Med` | **Surgical Specialist & Two-Key Reviewer:** Complex TypeScript generics, payment webhook cryptography, Better Auth edge cases, and L2 security diff reviews. |
| **`Claude Opus 5.5`** | `Low` / `Med` (**NEVER `High`**) | **Apex Principal Auditor (Break-Glass / Pre-Reset Audit):** Single-turn architectural, security, and math audits reading ONLY compact digest files (`<350 lines`) after `/clear`. |
| **`GPT-OSS 120B (Medium)`** | `Medium` (fixed) | **Off-Quota Bulk Content & Cross-Check Tier:** Bulk GRE vocab/question seed generation (`P0-16` / `P1-100+`), support macros (`docs/27`), legal page formatting, and independent `/cross-check` reviews. |

### 2.1 Escalation rules

| Trigger | Action |
|---|---|
| `Gemini 4 Hydrogen` fails once | Escalate to `Gemini 4 Carbon` or `Gemini 3.8 Flash` |
| `Gemini 4 Carbon` / `3.8 Flash` fails twice | Escalate to `Gemini 4 Argon` or `Claude Sonnet 5.5 (Med)` |
| Any task whose `touch` includes a **security-critical path** | Mandatory `Claude Sonnet 5.5` L2 diff review before commit |
| Pre-Reset / Break-Glass Audit | `Claude Opus 5.5` (`Low` or `Med` ONLY — **NEVER `High`**) reading ONLY compact `<350 line` digest after `/clear` |
| Task needs a stack/dependency/schema decision not in 00-DECISIONS | Stop. Add to PROGRESS.md "Decisions needing the founder". Do not guess |
| Quiet Output Rule | All test/lint/build commands must pipe output to a log file and print only exit code and first 25 error lines to keep context tiny |

**Security-critical paths** (glob list, reused by hooks/reviewers): `packages/auth/**`, `packages/core/src/{authz,entitlements,payments,orders,attempts,scoring,adaptive,audit,uploads}/**`, `apps/web/app/api/**/webhooks/**`, `apps/web/app/api/inngest/**`, `packages/db/migrations/**`, `apps/web/next.config.*`, CSP/header code, anything reading `process.env` directly.

### 2.2 Dispatch syntax (Claude Code)

Lead says: "Use the `backend-engineer` subagent to execute task card P1-02" and passes the card text. Subagents do not inherit chat context, so the card must be self-contained. Parallelise only tasks with disjoint `touch` globs and no `depends_on` link.

## 3. Token-optimisation rules

1. **CLAUDE.md stays under 120 lines.** It is loaded every turn; push detail into docs and load on demand.
2. **Load only the section needed.** Task cards list exact `read` sections. Use `grep -n "^#" docs/X.md` then read a line range. Never `cat` a whole doc.
3. **Subagents get a task card, not the repo.** The card names files to touch; the agent reads only those plus listed doc sections.
4. **`/clear` between tasks** in the lead session. State is in PROGRESS.md; re-entry is `/next-task`.
5. **Prefer diffs.** Review with `git diff main...HEAD --stat` then per-file diffs of critical files only. Never paste whole files into chat.
6. **No re-reading files just edited.** The edit tool already errors on failure; trust it and run `pnpm verify`.
7. **Cache research.** Store any external research (API shapes, pricing, gateway quirks) in `docs/research-cache/<topic>.md` with date and source URL; check there before browsing again.
8. **Batch small Haiku tasks.** One dispatch covering e.g. 10 string files, 5 seed files or all lint fixes in a package.
9. **Summaries capped at 150 words** from every subagent, plus files-changed list and verify tail (last 15 lines). No code echo.
10. **Quiet commands.** Use `pnpm verify --silent` style flags, `tail -n 40` on logs, `git diff --stat` before `git diff`.
11. **Right model, smallest context.** Do not use Opus for work in section 2 marked Sonnet/Haiku. Do not paste task history into subagent prompts.
12. **One concern per PR.** Mixed diffs balloon review cost.
13. **Context packs and compaction.** Cards list `path#Heading` + line range (`tooling/ctxpack.sh`); manual `/compact` with the preserve template at ~60% context; target working context <= 150K (22 §3).
14. **Generated-file hygiene.** Add lockfiles, migrations snapshots, `.next`, `dist` to `.claudeignore`/`.geminiignore` style ignore lists where the tool supports them; never ask an agent to read them.

## 4. Task-card format

Every task is executed from a card. The lead derives it from the backlog row (ID, title, owner, depends_on, acceptance) plus the fields below. Cards for the current task live in `docs/PROGRESS.md` under "Current task".

```yaml
id: P1-12
title: Attempt engine core - start/resume, server deadlines, autosave, grace, submit
phase: P1
owner_model: opus            # opus | sonnet | haiku ; subagent: test-engine-engineer + architect-reviewer review
depends_on: [P1-11]
read:                         # exact sections only
  - docs/00-DECISIONS.md#D6
  - docs/07-TEST-ENGINE.md#Attempt lifecycle
  - docs/05-DATABASE.md#test_attempts
touch:                        # allowed write set; anything else = out of scope
  - packages/core/src/attempts/**
  - packages/core/src/attempts/__tests__/**
  - apps/web/app/api/exam/**
do:
  - Implement startAttempt, resumeAttempt, saveAnswer, submitSection, submitAttempt in packages/core
  - Deadline is computed server-side; client time is never trusted
  - Autosave endpoint idempotent per (attempt_id, question_version_id, seq)
acceptance:
  - Submission > ends_at + 30 s is rejected (test)
  - Resume on second device returns same remaining time (test)
  - assertCan used for every exported function (test)
verify: pnpm verify && pnpm --filter @lumen/core test attempts
out_of_scope:
  - UI, scoring, adaptive routing (P1-14, P1-13, P1-22)
```

Rules: `touch` is a hard boundary; `read` is the only doc loading permitted; `acceptance` items each need a test or a command output; if the card is unclear the subagent returns a **question**, not a guess.

## 5. The loop

```
1. PICK      Lead reads docs/PROGRESS.md; chooses the first unchecked task whose depends_on are all checked.
2. CARD      Lead writes/validates the task card (section 4) into "Current task". Missing info -> Decisions block.
3. BRANCH    git switch -c task/<ID>-<slug>  (Gemini: gemini/<ID>-<slug>)
4. DISPATCH  Lead invokes the named subagent with the card. (No subagents available -> same agent works sequentially, AGENTS.md.)
5. BUILD     Subagent implements within `touch`, writes tests first for logic, runs `pnpm verify`.
6. SELF-CHECK Subagent runs its checklist (section 6) and reports: <=150-word summary, files changed, last 15 lines of verify.
7. REVIEW    Lead reviews `git diff main...HEAD`. Critical path -> architect-reviewer (Opus). Findings -> back to step 5 (max 2 rounds).
8. COMMIT    Conventional commit, one per logical change: `feat(core): attempt engine deadlines (P1-12)`; trailer rules in CLAUDE.md.
9. TICK      Tick the box in PROGRESS.md, move the card to "Done log" with commit SHA, clear "Current task".
10. CLEAR    /clear (Claude) or new session (Gemini). Repeat.
```

Parallel mode: the lead may run up to 3 subagents concurrently only if `touch` sets are disjoint and none depends on another. Merge in dependency order; re-run `pnpm verify` after each merge.

## 6. Self-check checklists

Subagents must paste the relevant checklist with each item marked `[x]` or `[-] n/a (reason)` in their report only if any item is `[ ]`/failed; otherwise state "checklists passed". The lead spot-checks.

### 6.1 UI polish checklist (anti "vibe-coded")

- [ ] Uses only tokens from `packages/ui` (colour, spacing on the 8-pt grid, radius, shadow, type scale). No arbitrary hex or `px` values in components.
- [ ] One accent colour; no gradients unless specified in `08-UI-UX-DESIGN-SYSTEM.md`; no emoji as icons (Lucide only); no glowing "AI" effects.
- [ ] Typographic hierarchy is clear: one display size per page, body 16 px min, line-length 60-75 ch, Bangla uses the Bangla font and larger line-height.
- [ ] Whitespace generous and consistent; sections separated by space, not boxes-in-boxes; soft shadows instead of borders where D8 says so.
- [ ] Every interactive element has hover, focus-visible, active, disabled and loading states; focus ring visible in light and dark.
- [ ] Every data view has designed **empty**, **loading (skeleton, no layout shift)**, **error (with retry)** and **partial** states.
- [ ] Motion 150-300 ms ease-out, purposeful only; `prefers-reduced-motion` honoured.
- [ ] Works at 360, 768, 1024, 1440 px; touch targets >= 44 px; no horizontal scroll; tables degrade to cards.
- [ ] Dark mode checked on this page; contrast AA (text 4.5:1, UI 3:1).
- [ ] Copy is human: specific verbs, no "Unleash/Elevate/Seamless", no lorem, no exclamation spam, English + Bangla keys present.
- [ ] Real data shapes tested (long names, Bangla text, 0 / 1 / 1000 items, large numbers in BDT with locale format).
- [ ] Images have dimensions, `alt`, next/image; no layout shift (CLS < 0.1).
- [ ] Axe check passes; keyboard-only walkthrough done; headings in order; form errors are announced and linked.

### 6.2 Security checklist

- [ ] Every new service function calls `assertCan(actor, 'resource:action', resource)` with ownership/org checks; a negative test exists per role boundary (IDOR attempt fails).
- [ ] All inputs at boundaries validated with zod (server side); outputs never leak fields not needed (select explicit columns).
- [ ] No secret, key or token in code, logs, client bundles, test fixtures or error messages; `server-only` imported in server modules; env read only via `packages/config/env.ts`.
- [ ] Webhooks: signature/validation API verified, amount+currency re-checked against the order, idempotency key stored, replay is a no-op.
- [ ] Uploads: presigned, MIME + size whitelist, private bucket, no user-controlled paths.
- [ ] Rate limit + Turnstile on auth/OTP/AI/checkout endpoints; lockout does not enable user enumeration.
- [ ] Prices, timers, entitlements, scores computed server-side only.
- [ ] State-changing GETs: none. CSRF safe (SameSite + origin check on actions). Open redirects: none.
- [ ] SQL only through Drizzle (no string-built SQL); no `dangerouslySetInnerHTML` except sanitised Tiptap render.
- [ ] Roles `grader`+, `instructor` and `org_admin` cannot act without satisfied 2FA (server-side, D4); new privileged routes are covered by the 2FA test.
- [ ] Staff-affecting action writes an audit-log row; PII masked in logs and for `support`.
- [ ] LLM calls: user text is delimited and treated as data; output validated by zod; no tool access; cost/rate capped.
- [ ] New dependency: approved in task card, pinned, license checked (no AGPL/GPL code copied), OSV clean.

### 6.3 DB migration checklist

- [ ] Generated with `pnpm db:generate`; SQL file reviewed by eye; no hand-edited snapshots.
- [ ] Naming: snake_case, plural tables, `id` uuid v7 (or as set in `05-DATABASE.md`), `created_at`/`updated_at` timestamptz.
- [ ] Money as `amount_minor integer` + `currency` char(3); never float.
- [ ] FKs with explicit `on delete`; unique constraints for business rules; check constraints for enums/ranges; indexes for every FK and each list query.
- [ ] Backwards-compatible (expand -> migrate -> contract). Destructive change = separate task + Opus review.
- [ ] Applies cleanly to an empty branch and to a branch with seed data; rollback/forward-fix plan written in the commit body.
- [ ] No PII added without noting it in `09-SECURITY-AUTH-COMPLIANCE.md` data inventory; sensitive columns encrypted where D7 requires.
- [ ] Seed script updated and idempotent; types exported from `packages/db`; Drizzle relations updated.
- [ ] Test attempts pin `question_version_id`; no migration rewrites historical results.

### 6.4 Test-engine / AI-evaluation checklist (added for P1)

- [ ] Deadline, grace (30 s), autosave cadence (10 s / 1 s debounce) match D6 and are tested with a fake clock.
- [ ] Scoring tables are data files with golden tests; every score shown carries the "estimated" label.
- [ ] AI output schema-validated; rubric/prompt version stored with each evaluation; golden-set regression gate passes.
- [ ] Question content provenance field is set (`original` | `licensed`); nothing scraped.

## 7. Definition of Done and quality gates

A task is **Done** only when all hold:

| Gate | Requirement | Command / evidence |
|---|---|---|
| G1 | `pnpm verify` green = typecheck + lint + unit tests + build | paste last 15 lines |
| G2 | Acceptance criteria each proven by a test or command output | listed in report |
| G3 | User-facing flow has a Playwright e2e covering the happy path + one failure path | `pnpm test:e2e -g <ID>` |
| G4 | Axe a11y check on every new/changed page: 0 serious/critical | in e2e |
| G5 | No `any`, no `@ts-ignore` (use `@ts-expect-error` with reason), no non-null `!` without comment | lint rule + grep |
| G6 | No `TODO`/`FIXME` without a task ID (`TODO(P1-33):`) | lint rule |
| G7 | No secrets committed; `.env*` untouched; Gitleaks clean | CI |
| G8 | Authorization enforced in `packages/core` with tests (allow + deny) for every new mutation/read of protected data | test names |
| G9 | Relevant checklist in section 6 completed | report line |
| G10 | Critical-path diff approved by `architect-reviewer` | review note in PR |
| G11 | Conventional commit, PROGRESS.md ticked, docs touched if behaviour/contract changed (docs-scribe batch OK) | git log |
| G12 | No new dependency unless the task card allows it | `git diff package.json` |

Definition of Done v2 (G13-G21: reviewer != author, pushed + CI green, logs updated, no unverified claims, visual/exam/perf gates) and phase gates are in `docs/22 §12`. Phase exit gates: P0 -> P1 requires P0-43 sign-off; P1 -> launch requires P1-50, P1-51, P1-52, P1-53, P1-55, P1-56, the stream exit reviews (P1.1-P1.12), the launch drills, the finance dry run, BG-01..BG-14 and P1-54 complete (its dependency list in section 11 is authoritative).

## 8. Failure handling and rollback

| Situation | Response |
|---|---|
| `pnpm verify` fails | Read only the failing tail; fix; max 3 attempts per subagent, then escalate (section 2.1) |
| Subagent edits outside `touch` | Revert those hunks (`git checkout -p`), re-dispatch with a reminder; repeated -> escalate |
| Flaky test | Quarantine with `test.fixme('P?-xx: reason')` plus a new backlog entry; never silently retry-until-green |
| Bad commit on task branch | `git revert <sha>`; never rewrite shared history; no force push (denied by settings) |
| Bad merge to `main` | Revert the merge commit; create a fix task; if production, redeploy previous Vercel deployment first |
| Bad migration | Forward-fix migration preferred; for a failed apply on a Neon branch, delete the branch and re-create from `main`; production relies on PITR only for data loss, with Opus approval |
| Context rot (agent loops, forgets rules) | Stop, update HANDOFF.md, `/clear`, restart with `/resume` |
| Conflicting docs | 00-DECISIONS wins; log the conflict under "Decisions needing the founder" |
| Provider outage (Anthropic/Gemini/etc.) | Hand off per section 9 or wait; do not downgrade quality gates |
| Secret leaked | Rotate immediately, purge from history is secondary; log incident in `docs/11-DEVOPS-OBSERVABILITY.md` runbook |

## 9. Claude -> Gemini handoff protocol

Triggered when Claude usage limits are hit (or by founder choice). Goal: Gemini continues with zero re-planning.

**Trigger thresholds:** `/checkpoint` at >= 70% of the 5-hour window, `/handoff` at ~85% (non-critical next task only; if reset is <= 30 min, wait). See `docs/22 §2.6, §7`.

**Claude side (before stopping, `/handoff`):**
1. Finish or stash the current atomic step; commit WIP on the task branch with message `wip(<scope>): <what> (P?-xx) [handoff]`. Never leave a dirty tree.
2. Update `docs/PROGRESS.md`: ticks accurate, "Current task" holds the full task card, plus a status line (`not started | in progress | blocked`).
3. Fill `docs/HANDOFF.md` (template in that file): branch, last commit SHA, what is done, what remains as numbered steps, exact next command, failing tests/known issues, decisions made, files to read first, files NOT to touch.
4. Push the branch. Tell the founder the one-line resume prompt (Prompt 10 in `docs/13-PROMPTS.md`).

**Gemini side (`GEMINI.md` -> `AGENTS.md`):**
1. Read `AGENTS.md`, then `docs/PROGRESS.md`, then `docs/HANDOFF.md`. Read nothing else until the card says so.
2. Check out the handoff branch; branch naming: continue on `task/<ID>-<slug>` if resuming mid-task, else create `gemini/<ID>-<slug>` for new tasks.
3. Run `pnpm verify` first to confirm baseline. Record the result in HANDOFF.md under "Resume log".
4. Work **sequentially**, one task at a time, same loop as section 5 (the agent plays implementer and self-reviewer). Do **not** start tasks owned by `opus` that touch security-critical paths unless the card was already written and the founder agrees; instead implement to the card, mark the PR `needs-opus-review` and continue with non-critical tasks.
5. Commit after each verified step with conventional commits prefixed by the branch convention; update PROGRESS.md "Done log" with `(gemini)` tag and HANDOFF.md "Resume log" at least every task.
6. When near limits or finished, rewrite HANDOFF.md again.

**Claude returns (`/review` then `/resume`):**
1. Pull; read HANDOFF.md and `git log main..HEAD --oneline`.
2. Review every commit tagged `gemini/` with `architect-reviewer`: full diff for security-critical paths, `--stat` + sampled files elsewhere. Run `pnpm verify` and `pnpm test:e2e` fresh.
3. Run `security-auditor` over the combined diff.
4. Fix or open follow-up tasks (IDs with `a/b` suffix); merge only when gates in section 7 pass. Record the review outcome in HANDOFF.md "Return review".
5. Resume the loop at step 1.

Tool differences to remember: Gemini has no named subagents or slash commands from `.claude/`; the equivalent prompts are in `docs/13-PROMPTS.md`. Verify context-file settings against the installed Gemini CLI version (`.gemini/settings.json`).

## 10. Reuse to save tokens (and what never to copy)

| Need | Reuse | Rule |
|---|---|---|
| Buttons, forms, dialogs, tables, sidebar, dashboard & auth layouts | **shadcn/ui** components and blocks | Copy into `packages/ui`, restyle to tokens (MIT) |
| Auth wiring, plugins (OTP, passkey, 2FA, admin, organization) | **Better Auth official docs/examples** | Follow docs exactly; Opus reviews deviations |
| Emails | **React Email** components/templates | Own branding via tokens |
| Rich text editor | **Tiptap** starter kit + official extensions | Store JSON; sanitise on render |
| Charts | shadcn charts (Recharts) | No extra chart lib |
| Drizzle patterns | Drizzle docs + Better Auth Drizzle adapter schema generator | Do not hand-write auth tables |
| Payments | SSLCommerz official sandbox docs; Paddle/Stripe docs & SDKs | Keep behind `PaymentProvider` |
| Test engine UX ideas | Study public CBT UX of official IELTS/GRE practice tools | Re-implement; never copy assets/questions |
| LMS structure ideas | Open-source LMSs such as Moodle, Open edX, Frappe LMS, Canvas (AGPL/GPL) | **Reference only. Never copy or paraphrase code** |

## 11. Phased backlog (358 tasks: haiku 30, opus 35, sonnet 293)

Owner = lead model of the task (see section 2 for the subagent). "Opus" rows are design/critical-path work done or reviewed by the lead; the implementing subagent is still named in the card. Dependencies prefixed with another phase are cross-phase. The same IDs, in the same order, appear as checkboxes in `docs/PROGRESS.md` (checked by script, see Appendix M). **Gate** = earliest delivery milestone from `docs/24-TIMELINE.md` whose dependency closure contains the task (M0 clickable prototype, M1 internal alpha, M2 closed pilot, M3 public launch, M4 P2 growth, M5 P3 expansion). Rows are grouped by the engineering milestones of `docs/22` §1 (P0.1 ... P3.5); **P1.9-P1.12 are parallel streams** added by the consolidation of docs 26-34 and must exit before P1-54. Human-owned prerequisites are not agent tasks: they are the `BG-xx` gates after P3. Where a source doc proposed a `NEW-*` task, Appendices A-K map it to its final ID.

### P0 - Foundation

#### P0.1 Repo & tooling (gate: M0, M1)

| ID | Title | Owner | Depends on | Acceptance criterion | Gate |
|---|---|---|---|---|---|
| P0-45 | Install agent guardrail hooks (`.claude/hooks/*`, settings, rules, commands) + self-test (docs/22 §11.4) | sonnet | - | Self-test: `.env`, 00-DECISIONS, committed migration, un-allowed `packages/auth` edit, `curl \| sh`, push to main, unapproved `pnpm add` all exit 2; `.env.example` and normal edits exit 0; `settings.json` valid JSON; SessionStart prints task + git state | M0 |
| P0-46 | Logs scaffolding: `docs/logs/{sessions,progress,errors,decisions,reviews,incidents}`, templates, root CHANGELOG, `.gitignore` entries, `docs/approved-deps.txt`, CLAUDE/AGENTS/GEMINI "Never" drift check | haiku | - | Tree exists with `.gitkeep`; ERROR-LOG.md seeded; `/session-start` creates a log from the template | M0 |
| P0-51 | mise + corepack pinning: `mise.toml`/`.tool-versions`, `.nvmrc`, `packageManager`, `engines`, README setup | sonnet | - | Fresh machine: `mise install && corepack enable && pnpm install --frozen-lockfile` yields identical versions (`node -v`, `pnpm -v` recorded); `.nvmrc` value pinned and read by CI | M0 |
| P0-01 | Monorepo scaffold: pnpm workspaces + Turborepo + package skeletons per D2 | sonnet | P0-45, P0-46, P0-51 | `pnpm install && pnpm turbo build` passes; folders match D2 layout | M0 |
| P0-02 | Shared TS/ESLint (flat)/Prettier presets in packages/config | sonnet | P0-01 | strict + noUncheckedIndexedAccess on; `pnpm lint` green in every package | M0 |
| P0-03 | Root `pnpm verify` pipeline + pnpm minimumReleaseAge >= 3 days | sonnet | P0-02 | `pnpm verify` runs typecheck, lint, test, build in Turbo order; fails on a seeded type error | M1 |
| P0-50 | lefthook: pre-commit lint-staged + gitleaks, commit-msg check, pre-push `pnpm verify:fast`; add `verify:fast` script | sonnet | P0-03 | Seeded secret blocked at commit; pre-commit < 10 s on a 5-file change; `--no-verify` documented as forbidden | M1 |
| P0-47 | `tooling/filemap.ts` + `pnpm filemap` (+ `--check`) + `tooling/ctxpack.sh` + `docs/ARCHITECTURE-MAP.md` stub | sonnet | P0-01 | FILEMAP lists every source file with purpose; MISSING list printed; `--check` fails when stale; CI runs it | M1 |
| P0-08 | GitHub Actions CI: typecheck, lint, test, build on PR | sonnet | P0-03 | PR shows required checks; cache hit on second run | M1 |
| P0-09 | Security CI: Gitleaks, OSV-Scanner, CodeQL, Renovate config | sonnet | P0-08 | Seeded fake secret is caught; Renovate respects release-age delay | M1 |
| P0-10 | Vitest + Playwright + axe-core harness and shared fixtures | sonnet | P0-04 | `pnpm test` and `pnpm test:e2e` run one smoke test each; axe helper fails on a seeded violation | M1 |
| P0-49 | k6 skeleton `tooling/k6/`: smoke, exam-start-storm, autosave-soak, checkout-spike, `targets.json` allowlist | sonnet | P0-04 | `k6 run tooling/k6/smoke.js` passes on a preview; script refuses non-allow-listed hosts (docs/22 §5.8) | M1 |
| P0-52 | Solo-safe branch protection ruleset (0 required approvals while one human, required checks, no bypass) + `.gitattributes` (`* text=auto eol=lf`) + env patterns in `.gitignore`; amend 11 §1.2 | haiku | P0-03 | Ruleset JSON committed under `.github/`; 11 §1.2 amended; CRLF file fails the lint check | M1 |
| P0-53 | Doc consistency sweep: apply 26 §19.6 X1-X13, 29 X1-X10, 32 Y1-Y7, 27 §21.2 and 16 R6 to 02/03/05/06/07/09/10/11; add dated change-log lines in 00 (founder approves any D-level change) | opus | - | Greps for 180-day audio, 7-day cooling-off, 12% royalty, 15-min OTP return nothing; 00 change log updated | M1 |
| P0-54 | Apply requested cross-doc edits from 16, 30, 31, 33, 34 (FIN-31, AIOPS-26, AI-57, AI-93, I18N 16.2, 16 R2-R5/R7-R10, 26-19 sitemap routes) + `tooling/doc-lint.ts` | haiku | P0-53 | Each listed doc edited with change-log line; `doc-lint` passes on C1-C32 canonical strings (C29, C30, C31, C6, C7) | M1 |
| P0-55 | Traceability checks: `tooling/trace.ts` (every P1 feature ID in 03 has a backlog reference, GA-004) and `tooling/backlog-check.ts` (12 §11 vs PROGRESS.md: same IDs in the same order, deps exist, graph acyclic, owners valid) | sonnet | P0-47 | CI fails on a seeded unreferenced F-* id and on a seeded ID mismatch; report lists coverage by phase | M1 |
| P0-56 | Founder-blockers lead-time reminders, `docs/ops/launch-evidence.md` skeleton and 'rotate a leaked secret' runbook stub | haiku | - | Files exist; BG table in PROGRESS.md linked from the Friday log template | M1 |

#### P0.2 App skeleton, env & data (gate: M0, M1)

| ID | Title | Owner | Depends on | Acceptance criterion | Gate |
|---|---|---|---|---|---|
| P0-04 | apps/web: Next.js 16 + React 19 App Router skeleton | sonnet | P0-02 | `pnpm dev` serves /; `pnpm build` green; Next pinned to patched 16.x | M0 |
| P0-05 | Tailwind v4 wiring with CSS-variable token layer | sonnet | P0-04 | Utility classes resolve to CSS variables; dark class toggles variable set | M0 |
| P0-06 | Initialise shadcn/ui into packages/ui (Radix, Lucide) and consume from apps/web | sonnet | P0-05 | `import { Button } from "@lumen/ui"` renders in apps/web; no component code duplicated in apps | M0 |
| P0-07 | packages/config: brand.ts + zod-validated env.ts + .env.example | sonnet | P0-02 | App refuses to boot with missing/invalid env; brand name referenced only via brand.ts (grep test) | M0 |
| P0-11 | Vercel project (sin1/bom1), preview deploys, Neon branch-per-PR workflow | sonnet | P0-08, P0-07 | PR comment links preview with its own DB branch; branch deleted on close | M1 |
| P0-12 | packages/db: Drizzle + drizzle-kit, Neon driver, `db:generate`/`db:migrate` scripts | sonnet | P0-07 | `pnpm db:migrate` applies cleanly to an empty Neon branch; idempotent re-run | M0 |
| P0-13 | Base schema via Better Auth generator (user, session, account, verification) + audit_log table | sonnet | P0-12 | Migration applied; audit_log has no UPDATE/DELETE grant for app role (documented + tested) | M0 |
| P0-14 | Schema: roles, user_roles, organizations, memberships (additive roles per D4) | sonnet | P0-13 | FK + unique constraints; seed creates all 11 D4 roles; migration checklist passed | M0 |
| P0-57 | `env.ts` cross-field validation (DB_DRIVER vs host; SSLCZ_IS_LIVE iff production; no fake providers or Turnstile test keys in production) + `env:example` generator with drift test; settle env-name drift (docs/28 §18.2: 10 wins) | sonnet | P0-07 | Unit test per rule; CI fails on `.env.example` drift; comments and phase tags preserved | M1 |
| P0-58 | Smoke scripts `tooling/scripts/smoke/*` + `pnpm smoke:*` and `smoke:all` (PASS/FAIL/SKIP table, never prints secrets, refuses prod without flag) | sonnet | P0-07 | `pnpm smoke:all` prints table in dev; refuses `APP_ENV=production` without `--i-know` | M1 |
| P0-59 | Staging smoke job `smoke-staging.yml` after deploy; gates `db-migrate-prod.yml` | sonnet | P0-58, P0-11 | Job posts the table to the commit; failing smoke blocks prod migrate | M1 |
| P0-60 | `packages/config/legal.ts` (entity, addresses, role mailboxes, grievance officer) read by legal pages and emails | haiku | P0-07 | No legal entity text hard-coded elsewhere (grep test); values marked `[VERIFY]` until BG-01 signs off | M1 |

#### P0.3 Design system & shell (gate: M0, M1)

| ID | Title | Owner | Depends on | Acceptance criterion | Gate |
|---|---|---|---|---|---|
| P0-26 | Design tokens: colour (one accent), type scale, 8-pt spacing, radius, shadow, motion, light/dark | sonnet | P0-06 | Tokens documented in Storybook-less `/design` route; contrast AA verified by `tooling/contrast-check.ts` (run in CI) | M0 |
| P0-27 | Core component set restyled to Lumen tokens (button, input, select, dialog, sheet, toast, tabs, table, form, skeleton) | sonnet | P0-26 | Each component has states (hover/focus/disabled/loading/error) + axe pass | M0 |
| P0-28 | Layout shell: frosted nav, footer, locale switcher, theme toggle, skip-link | sonnet | P0-27 | Keyboard nav complete; reduced-motion respected; mobile 360 px OK | M0 |
| P0-29 | next-intl (en, bn), Bangla fonts, locale routing, string extraction convention | sonnet | P0-04 | `/bn` renders Bangla font; missing-key lint fails CI; message layout and `pnpm i18n:check` in `verify` per P0-61/P0-63 | M1 |
| P0-48 | Visual-regression baseline in CI Linux: Playwright `visual` project, pinned container, `update-visuals` workflow | sonnet | P0-10, P0-28 | Baselines generated only in CI; a seeded 1-px change fails the PR; local runs skip the project (docs/22 §5.4) | M1 |
| P0-61 | i18n structure and routing: namespace-split `messages/<locale>/<ns>.json` + generator, `localePrefix: as-needed`, `localeDetection: false`, endonym switcher, dismissible suggestion banner, typed message keys, runtime `i18n.missing` report | sonnet | P0-29 | `/` is English for `Accept-Language: bn` with banner; `t('nope')` fails `tsc`; choice persists to `user_profile.locale` | M1 |
| P0-62 | Format module (numbers, money, dates, lists; explicit numberingSystem; `nfExam()` hard-Latin; BDT lakh grouping) + ESLint rules banning literal strings and `Intl`/`toLocaleString`/`next/link` outside it | sonnet | P0-29 | Snapshot tests (Latin default in `bn`, Asia/Dhaka, 12-hour); lint fails on seeded violations | M1 |
| P0-63 | `pnpm i18n:check` implementing R1-R13 + `i18n:sort`/`i18n:prune` + status files; wired into `pnpm verify` | sonnet | P0-61 | Each rule has a failing and a passing fixture; verify fails on a missing key | M1 |
| P0-64 | Bangla glossary `i18n/glossary.csv` (~150 terms, locked/do_not_use) + translation workflow (ROSTER.md, labels, CODEOWNERS for `messages/bn/**`, PR template, 'Report a translation issue' link) | haiku | P0-29 | 150 rows parsed by CI; editor sign-off recorded; CODEOWNERS valid; link on `/bn` footer | M1 |

#### P0.4 Identity & access (gate: M0, M1)

| ID | Title | Owner | Depends on | Acceptance criterion | Gate |
|---|---|---|---|---|---|
| P0-15 | packages/auth: Better Auth core, Drizzle adapter, hardened cookies and session lifetimes | sonnet | P0-13 | Cookies are `__Secure-`/`__Host-`, HttpOnly, SameSite=Lax; student 30d idle/90d abs, staff 12h (tests) | M0 |
| P0-16 | Google OAuth sign-in | sonnet | P0-15 | E2E: Google mock flow creates user with `student` role | M0 |
| P0-17 | Email OTP + magic link via Resend/React Email | sonnet | P0-15 | OTP expires, is single-use, attempt-limited (unit tests); email renders in dev preview | M0 |
| P0-18 | SmsProvider interface + one BD gateway adapter + phone OTP login | sonnet | P0-15 | Fake provider in tests; real adapter behind env flag; OTP rate limit tested | M0 |
| P0-19 | Cloudflare Turnstile + per-IP/per-user rate limits on signup/OTP/contact | sonnet | P0-15 | Request without valid Turnstile token rejected; 429 after threshold (tests); limiter = Upstash Redis slidingWindow per 09 §2.13 | M1 |
| P0-20 | Passkeys (WebAuthn) enrol + sign-in | sonnet | P0-15 | Register and authenticate with virtual authenticator in Playwright | M0 |
| P0-21 | TOTP 2FA + enforced 2FA for grader-and-above, instructor and org_admin (D4) | sonnet | P0-20 | Sign-in as grader+, instructor or org_admin without 2FA is blocked server-side (test per role); super_admin requires passkey or TOTP; backup codes work once | M0 |
| P0-22 | Permission map (`resource:action`) + `assertCan` policy engine with ownership/org checks | opus | P0-14 | Every D4 role covered by table-driven tests; deny-by-default proven | M1 |
| P0-23 | Role grant/revoke service (admin cannot grant admin/super_admin) + session rotation on change | sonnet | P0-22 | Escalation attempts rejected in tests; session rotated; audit row written | M1 |
| P0-24 | Audit-log service (append-only) wired to role, impersonation, export, refund hooks | sonnet | P0-22 | Helper `audit()` used by services; tampering test fails (no update path) | M1 |
| P0-25 | Security headers: CSP with nonces, HSTS preload, frame/referrer/permissions policies | sonnet | P0-04 | securityheaders-style check script returns A; app renders under strict CSP | M1 |
| P0-30 | Auth UI: sign-in, sign-up, OTP, passkey, 2FA, recovery pages | sonnet | P0-18, P0-20, P0-21, P0-28 | E2E covers each method; errors are accessible and non-enumerating | M0 |
| P0-31 | Account settings: profile, age band, guardian-consent flag, sessions list, language | sonnet | P0-30 | Under-18 declaration blocks marketing opt-in (test) | M1 |
| P0-65 | `RATE_LIMIT_BACKEND=postgres/redis` switch (fail closed only when backend reachable; production forces redis) | sonnet | P0-19, P0-57 | Local sign-in works with no Redis; production boot fails if backend is not redis (opus review) | M1 |

#### P0.5 Marketing, catalogue & CMS (gate: M0, M1)

| ID | Title | Owner | Depends on | Acceptance criterion | Gate |
|---|---|---|---|---|---|
| P0-32 | Marketing pages: home, about, pricing placeholder, contact (Turnstile) | sonnet | P0-28 | Lighthouse >= 95 perf/a11y/SEO on home | M0 |
| P0-33 | Marketing copy en + bn drafts | haiku | P0-32, P0-29 | No placeholder lorem; strings in message files; founder review flag noted | M1 |
| P0-34 | Schema: categories, tags, courses, modules, lessons, course_versions | sonnet | P0-14 | Lessons store Tiptap JSON; versioned publish snapshot; migration checklist passed | M0 |
| P0-35 | Catalogue service + list/detail pages + pg_trgm search | sonnet | P0-34, P0-32 | Typo-tolerant search test; only published courses visible to guest | M0 |
| P0-36 | CMS course editor with Tiptap (KaTeX, Shiki, images) | sonnet | P0-34, P0-27 | Instructor edits own course only (authz test); autosave drafts | M1 |
| P0-37 | Draft -> review -> published workflow + editor review queue | sonnet | P0-36, P0-22 | Instructor cannot publish; content_editor can; audit rows written | M1 |
| P0-38 | R2 presigned upload service, media library, MIME/size validation | sonnet | P0-07, P0-22 | Upload rejects disallowed MIME/size; objects private; URL expiry tested | M1 |
| P0-39 | Admin shell + user search + role management UI (masked PII for support) | sonnet | P0-23, P0-27 | Support sees masked phone/email; grant flow audited | M1 |
| P0-40 | Seed: categories, sample courses, demo users per role | haiku | P0-35 | `pnpm db:seed` idempotent; no real PII | M1 |
| P0-66 | Dev ergonomics: packages consumed from source (one `pnpm dev` process tree) and `db:seed` prints a dev-login table (role, email, password hint), refusing production | sonnet | P0-40, P0-04 | `pnpm dev` starts one tree; seed output verified in test; production seed refused | M1 |
| P0-67 | Optional local stack: `docker-compose.yml` (postgres:17, mailpit, optional minio) + README snippet + `DB_DRIVER=pg` CI job | sonnet | P0-57, P0-12 | `docker compose up -d` + `DB_DRIVER=pg pnpm db:migrate && pnpm test` green | M1 |

#### P0.6 Observability, SEO & phase exit (gate: M1)

| ID | Title | Owner | Depends on | Acceptance criterion | Gate |
|---|---|---|---|---|---|
| P0-41 | Sentry (PII scrub) + PostHog (consent-gated) + structured logger | sonnet | P0-04 | Events absent before consent (e2e); Sentry scrubs email/phone | M1 |
| P0-42 | SEO base: metadata API, sitemap, robots, OG images, hreflang | sonnet | P0-35, P0-29 | Sitemap lists published courses in both locales; `buildAlternates` helper and 404 for unpublished bn content (docs/33) | M1 |
| P0-68 | i18n e2e suite: hreflang (R16), 320 px overflow sweep, `/bn` visual baselines, axe on `/bn`, Bangla font-fallback screenshots without webfonts (Android/Windows) | sonnet | P0-42, P0-48, P0-61 | CI job `i18n-e2e` green; baselines approved; no tofu in screenshots | M1 |
| P0-69 | Typed notification catalogue `packages/core/src/notifications/catalogue.ts` + generated `docs/generated/notification-templates.md` + event-coverage check `tooling/trace-notifications.ts` | sonnet | P0-17 | CI fails if table and code diverge or a `06` §7.1 event is unmapped; every row has class, quiet mode, cap, owner | M1 |
| P0-70 | Analytics foundation: typed event map + generated catalogue, `track()` server/client wrappers (allow-list, PII scrubber, `$insert_id`, consent_tier), `analytics_id()` HMAC (TS + SQL) with identify/reset rules | sonnet | P0-41 | Undeclared event fails typecheck; PII fixtures stripped; same id from TS and SQL; no raw UUID in payloads (test greps) | M1 |
| P0-71 | Rater programme packs: job ad, rater agreement/NDA/participant-consent templates, training modules M1-M6, 12 anchors per family, 40-item qualification set | opus | - | Templates ready for counsel (BG-01); pilot reliability meets 31 §2.7 targets or packs revised | M1 |
| P0-43 | P0 security & architecture review (auth, RBAC, headers) | opus | P0-23, P0-25, P0-31, P0-37 | Findings logged; criticals fixed before P1 starts | M1 |
| P0-44 | README, CONTRIBUTING and CHANGELOG bootstrap | haiku | P0-43 | New-contributor setup works from README in <15 min | M1 |

### P1 - MVP (launch)

#### P1.1 Learning delivery (gate: M1, M2, M3)

| ID | Title | Owner | Depends on | Acceptance criterion | Gate |
|---|---|---|---|---|---|
| P1-01 | Schema: enrollments, lesson_progress, notes, bookmarks | sonnet | P0-34 | Unique (user, course); resume position stored; migration checklist passed | M1 |
| P1-02 | Learning service: enroll (free), progress, resume, completion rules | sonnet | P1-01 | Completion % computed server-side; authz tests (own data only) | M1 |
| P1-03 | Bunny Stream: upload (TUS), encode webhook, status via Inngest | sonnet | P0-38 | Webhook signature verified; idempotent replay; video reaches `ready` | M2 |
| P1-04 | Token-authenticated playback + dynamic visible watermark overlay | sonnet | P1-03 | Expired token fails; watermark shows masked user id; hotlink blocked | M3 |
| P1-05 | Lesson player UI: video, text, resources, notes, next/prev, progress | sonnet | P1-02, P1-04 | E2E complete a lesson; keyboard shortcuts; captions track supported | M3 |
| P1-06 | Downloadable resources via short-lived R2 signed URLs | sonnet | P1-02 | Non-entitled user denied; URL expires <= 5 min | M3 |
| P1-57 | Per-user PDF stamping job for downloadable resources (buyer email + order id on every page, 5 downloads, short-lived R2 URL) | sonnet | P1-06 | Stamped PDF carries buyer id on each page; 6th download denied; URL expires <= 5 min | M3 |

#### P1.2 Question bank, content provenance & authoring (gate: M0, M1, M2, M3)

| ID | Title | Owner | Depends on | Acceptance criterion | Gate |
|---|---|---|---|---|---|
| P1-07 | Schema: questions, question_versions, passages, audio_assets, question_sets, tags | sonnet | P0-14 | Attempt-pinning FK to question_version; versioning test; checklist passed | M0 |
| P1-08 | Question-bank services + authoring permissions (instructor own, editor all) | sonnet | P1-07 | authz table tests pass; edit creates new version never mutates old | M1 |
| P1-09 | Question authoring UI for all types (MCQ, multi, numeric, matching, completion, QC, passage-based, essay prompt) | sonnet | P1-08, P0-36 | Each type creates, previews and saves; zod validation shared server-side | M1 |
| P1-10 | Bulk import (CSV/JSON) with row-level validation report | sonnet | P1-08 | Invalid rows reported not imported; dry-run mode | M3 |
| P1-58 | `content_provenance` table + Studio provenance panel + publish gate (no provenance record = cannot publish) + tag kinds topic/cefr/subtype | sonnet | P1-07 | Publish blocked without provenance; every item/stimulus/audio/video has licence kind and source; migration checklist passed | M3 |
| P1-59 | `ImportBundleV2` (with provenance), CSV templates, local `tooling/validate-import` using the server zod schema, file-naming and mixed-provenance split rules | sonnet | P1-10, P1-58 | Invalid rows reported not imported; dry-run; local validator and server agree on fixtures; templates in `docs/content/templates/` | M3 |
| P1-60 | Studio audio QA: LUFS, true peak (-1 dBTP), noise floor (< -60 dBFS), clipping and silence checks before an audio asset can be attached | sonnet | P1-07 | Fixture clips with each defect are rejected with a clear message | M3 |
| P1-61 | Test-form builder/assembler + `assertPublishable` UI + unscored pilot (field-test) item flag + 'beta' form label | sonnet | P1-09, P1-11 | Form with an unpublishable item cannot publish; pilot items never score; form pins question versions | M2 |
| P1-62 | Content drafting pipeline scripts `tooling/content/` (spec -> Batch-API draft -> similarity/dedupe vs bank -> ImportBundleV2 with provenance -> human review gate) | sonnet | P1-59 | Dry run on 20 specs yields drafts with provenance; duplicates flagged; nothing auto-publishes | M3 |
| P1-63 | Error reports from learners (F-ERR-01..03) + editor inbox `/editor/reports` | sonnet | P1-08 | Report from item screen reaches inbox with attempt context; editor resolves and links the fixed version | M3 |

#### P1.3 Test-engine core, disruption & accommodations (gate: M0, M2, M3)

| ID | Title | Owner | Depends on | Acceptance criterion | Gate |
|---|---|---|---|---|---|
| P1-11 | Schema: tests, test_sections, test_attempts, attempt_sections, attempt_answers, scores | sonnet | P1-07 | `ends_at` stored per attempt section; unique one-active-attempt rule; checklist passed | M0 |
| P1-12 | Attempt engine core: start/resume, server deadlines, autosave, grace, submit | opus | P1-11 | Late submit >30 s rejected; resume on second device; concurrency tests green | M0 |
| P1-13 | Objective scoring + conversion tables (IELTS raw to band, GRE scaled) as data | sonnet | P1-12 | Golden-file tests per table; labelled "estimated" | M0 |
| P1-14 | CBT shell UI: timer, navigator, flag, review screen, offline-tolerant autosave | sonnet | P1-12, P0-27 | E2E: refresh mid-test restores state; timer driven by server time | M0 |
| P1-55 | Exam offline queue: IndexedDB outbox (`idb`, db `lumen-exam`), clientSeq/epoch, backoff replay; exam mode replays only within the 30 s grace, practice mode any time (D6) | sonnet | P1-12, P1-14 | Exam: queued answers received > 30 s after section deadline are rejected (test); practice: replay accepted at any time (test); superseded device never replays; reload restores outbox | M2 |
| P1-64 | Exam-disruption handling (C30): 'I lost connection' self-serve void once per attempt (connection loss > 2 min, exam mode), support `credit_mock`/`grant_resit`, `attempt:void` request, bulk re-issue admin job, all audited | sonnet | P1-12, P1-55 | Second self-serve void refused; support void audited; Playwright offline-2-min and crash-resume scenarios pass (Opus review) | M2 |
| P1-65 | Accommodations (C18): support-granted extra time 1.25x/1.5x/2.0x via ticket, evidence bucket, `accommodation_multiplier` applied to server deadlines, expiry | sonnet | P1-12, P1-103 | Multiplier changes `ends_at` server-side only; expired grant ignored; evidence private (Opus review) | M3 |

#### P1.4 Exam runners, results & practice (gate: M0, M1, M2, M3)

| ID | Title | Owner | Depends on | Acceptance criterion | Gate |
|---|---|---|---|---|---|
| P1-15 | IELTS Listening runner (single-play audio, sections, answer types) | sonnet | P1-14, P1-13 | E2E full practice section; audio cannot rewind per config | M1 |
| P1-16 | IELTS Reading runner (split pane, highlight, notes, 3 passages) | sonnet | P1-14, P1-13 | E2E 60-min flow; highlights persist on resume | M0 |
| P1-17 | IELTS Writing runner (Task 1/2, word counter, autosave) | sonnet | P1-14 | Word count live; draft survives crash; submission queues AI eval | M0 |
| P1-18 | IELTS Speaking runner (mic check, recording, parts 1-3, upload to R2) | sonnet | P1-14, P0-38 | Recording uploads via presigned URL; permission-denied path handled | M1 |
| P1-19 | GRE Verbal runner (RC, text completion, sentence equivalence) | sonnet | P1-14, P1-13 | All three types render and score; multi-select rule tested | M1 |
| P1-20 | GRE Quant runner (MCQ, multi, numeric entry, QC) + on-screen calculator | sonnet | P1-14, P1-13 | Fraction/decimal entry validated; calculator keyboard accessible | M3 |
| P1-21 | GRE Analytical Writing (AWA) runner | sonnet | P1-14 | 30-min server timer; autosave; queues AI eval | M0 |
| P1-22 | GRE section-level adaptive routing (V and Q second-section difficulty) | opus | P1-19, P1-20 | Deterministic routing tests; routing decision stored and non-client-forgeable | M3 |
| P1-23 | Results and review UI: score report, explanations, time per question, skill breakdown | sonnet | P1-13, P1-15, P1-19 | Pinned question versions shown; "estimated" label present | M1 |
| P1-24 | Free diagnostic test for guests with results gated behind sign-up | sonnet | P1-23, P0-30 | Guest answers carried into account after sign-up; no result leak pre-auth; `__Host-diag` stitching and `diagnostic_linked` event incl. cross-device case in DB (docs/32) | M2 |
| P1-66 | Practice sessions `/app/practice`: custom quiz builder, session player (practice-mode offline replay), history | sonnet | P1-14, P1-13 | Build quiz by skill/type, finish, see history; refresh restores session | M3 |
| P1-67 | Mistake notebook `/app/mistakes` fed by attempts and lesson quizzes (states Open/Resolved) | sonnet | P1-23 | Wrong answers appear once; resolve on correct retry; items excluded from IRT pool | M3 |
| P1-68 | Item statistics and retirement job (07 §8.6): p-values, discrimination, exposure, retire/flag rules | sonnet | P1-23 | Job flags a seeded bad item; retired items stay in past attempts | M3 |

#### P1.5 AI evaluation (core) (gate: M0, M1, M2)

| ID | Title | Owner | Depends on | Acceptance criterion | Gate |
|---|---|---|---|---|---|
| P1-25 | packages/ai: LLM adapter (Claude primary, Gemini fallback), zod-validated JSON, cost logging | sonnet | P0-07 | Fallback triggers on provider error (test); malformed JSON retried then fails safe | M0 |
| P1-56 | Deepgram Nova-3 SttProvider adapter (Speaking default, word timestamps) + `whisper-1` fallback adapter (`timestamp_granularities=word`) + fake | sonnet | P1-25 | Contract tests pass for all three adapters; word timestamps returned; fallback on Deepgram error (test); cost logged per minute; `STT_PROVIDER_PRIMARY=deepgram` default | M1 |
| P1-26 | AI writing evaluation: IELTS T1/T2 four criteria + GRE AWA 0-6, prompt templates | sonnet | P1-25, P1-17, P1-21 | Output schema valid; rubric version stored; injection-in-essay test passes | M0 |
| P1-27 | STT adapter + AI speaking evaluation pipeline (Inngest) | sonnet | P1-25, P1-18, P1-56 | Audio -> transcript -> criteria feedback; retries; PII-safe logs | M1 |
| P1-28 | AI evaluation harness: golden set, calibration report, regression gate | opus | P1-26 | CI fails if mean band drift > threshold vs human-labelled set | M2 |
| P1-29 | AI credits ledger, per-user limits, abuse rate limits | sonnet | P1-26 | Credit decrements atomically; no negative balance under concurrency test | M2 |
| P1-30 | Human grader queue + override with rationale (2FA role) | sonnet | P1-26, P0-21 | Grader sees only assigned items; override audited | M1 |

#### P1.6 Commerce, pricing model & entitlements (gate: M1, M2, M3)

| ID | Title | Owner | Depends on | Acceptance criterion | Gate |
|---|---|---|---|---|---|
| P1-31 | Schema: products, prices (BDT/USD minor units), orders, order_items, payments, entitlements | sonnet | P0-14 | Amounts integer minor units; entitlement has starts_at/ends_at/source; checklist passed | M1 |
| P1-34 | Entitlement service + access guards for course, test, AI credits, pass | opus | P1-31 | Single choke point used everywhere; expiry job; bypass attempts tested | M1 |
| P1-32 | PaymentProvider interface + SSLCommerz init, IPN, Order Validation API | opus | P1-31 | Forged IPN rejected; amount/currency re-verified server-side; replay idempotent | M1 |
| P1-35 | Paddle adapter for international payments behind feature flag | sonnet | P1-34 | Webhook verified; sandbox purchase yields entitlement | M2 |
| P1-33 | Checkout UI, order status page, receipt PDF/email | sonnet | P1-32 | E2E sandbox purchase grants entitlement; failed/cancelled paths covered | M1 |
| P1-36 | Refunds + finance console (orders, refunds, revenue, VAT export) | sonnet | P1-34, P0-24 | Policy rule (7d/<20%) enforced in service; audited; finance-only access; invoice per 30 §8.3 checklist, credit notes, `vat_return_support` and §13.1 exports; CA approves samples (G3) | M1 |
| P1-69 | Commerce-model schema extension (GA-001): `product_kind` += physical_book/service/human_review_credits, family x tier fields, region price rows (BD/A/B/C), allowances, passes, add-ons, `compare_at_minor` rule (C14), `vat_class` per product with effective-dated regime | sonnet | P1-31 | Migration checklist passed; compare_at rejected unless 28/90-day rule met; regime switch changes only future invoices | M2 |
| P1-70 | Price-book seed loader: parse the 17 §13 `SEED` YAML block into idempotent upserts; validates C25 floor (C >= BD in USD, B~1.5xC, A~2.5xC), minor units, allowances; dry-run diff | sonnet | P1-69 | `pnpm db:seed:prices --dry-run` prints diff; seeded prices equal 17 §2.1 tables; invalid fixture rejected | M2 |
| P1-71 | Regional price resolution (billing country via MoR, IP as hint only; BD always BDT via SSLCommerz) + pricing page VAT-inclusive display and 'N mocks now, 10 by <date>' library counter | sonnet | P1-70, P1-35 | Resolver tests for A/B/C/BD; pricing page shows library count from data; invoice equals displayed price | M2 |
| P1-72 | Tier allowances to entitlements: `ai_credit` grants per product (Core 10, Plus 40, GRE 6/20), monthly pass refill (10 credits + 2 mocks, no rollover), daily AI ceilings (Free 1, Core 3, Pass 4, Plus+ 6), mock counts, tutor/coach meter caps read from the price book | opus | P1-70, P1-34, P1-29 | Values equal 17 §2.2; refill idempotent; ceilings enforced server-side (two-key review) | M2 |
| P1-73 | `human_review_credits` counters (essay reviews, speaking mocks, 1:1 sessions; never converted to credits) with redemption into the grader queue and expiry | sonnet | P1-72, P1-30 | Redeem creates assignment; double-redeem rejected; expired credit unusable | M3 |
| P1-74 | Admin manual entitlement grant (scholarship / partner / pilot cohort) with required reason, source=`grant`, audit row, quota counters (P1 stop-gap until P2 scholarship workflow) | sonnet | P1-34, P1-39 | Grant needs reason and `finance` or `admin`; audited; quota counter blocks over-grant | M3 |
| P1-75 | 7-day Plus trial (no card): `trial_grant`, entitlement `source='trial'`, bonus credits (capped, 17: 5 credits total), expiry job, CTA/checklist/reminders, one per phone/device | sonnet | P1-72, P0-18 | Trial expires server-side; second attempt on same phone denied; no card field anywhere (e2e) | M2 |
| P1-76 | Fraud rules and review queue: checkout velocity and card-testing, refund-abuse flags, coupon/referral holds, trial farming (email/phone canonicalisation, device/ASN velocity), risk-hold review UI in `/support` | sonnet | P1-32, P1-75 | Fixtures for Gmail dot/plus variants; velocity limiter tests; queue actions audited | M3 |
| P1-77 | Checkout consent UI: refund pre-check copy, intl waiver, SMS consent checkbox, order summary from price snapshot | sonnet | P1-33 | Consent stored with order; amounts from snapshot only (e2e) | M3 |
| P1-78 | Self-serve 7-day refund (C13b/C28): eligibility service (max of lessons %, credits %, mocks % < 20% and <= 1 full mock), `/orders` meter UI, refund automation with finance safeguards | sonnet | P1-36, P1-72 | Boundary tests 19.9%/20%, 1 vs 2 mocks, day 7 vs 8; every refund audited (Opus review) | M3 |
| P1-79 | Chargeback/dispute case tracker + evidence-pack export (access logs, watermark logs, IP, consent), Paddle `adjustment` handling, SSLCommerz dispute workflow, deadline alerts | sonnet | P1-32, P1-35 | Pack lists required evidence; deadline alert fires in fake clock | M3 |
| P1-80 | `guarantee_claim` model + single eligibility evaluator (Target Promise on Plus, Progress Promise on Mentor) + Promise tracker UI + quarterly provision report | sonnet | P1-72, P1-70 | Tracker and evaluator share one function; conditions per D12 C13/C13b tested | M3 |
| P1-81 | Guarantee claim flow: official TRF upload (private, deleted at 30 days), review queue, approval, extension/re-enrol grant exactly once, appeals | sonnet | P1-80 | Extension entitlement created once (idempotent); TRF purged at 30 days (Opus security review) | M3 |
| P1-82 | P1.1-P1.6 exit review: learning delivery, bank, engine, runners, AI evaluation core and commerce meet the 22 §1.2 exit criteria (two-key approvals recorded) | opus | P1-05, P1-57, P1-60, P1-61, P1-62, P1-63, P1-64, P1-65, P1-16, P1-22, P1-24, P1-66, P1-67, P1-68, P1-27, P1-28, P1-71, P1-73, P1-74, P1-76, P1-77, P1-78, P1-79, P1-81 | Review logged in `docs/logs/reviews/`; two-key approvals present for P1-12/13/32/34/36/55; open findings ticketed | M3 |

#### P1.7 Dashboards, learner features, comms & content (gate: M1, M2, M3)

| ID | Title | Owner | Depends on | Acceptance criterion | Gate |
|---|---|---|---|---|---|
| P1-37 | Learner dashboard (continue, tests, scores trend, credits, plan) | sonnet | P1-23, P1-02 | Loads <1 s on seeded data; empty states designed | M1 |
| P1-38 | Instructor dashboard (courses, Q&A stub, analytics, earnings stub) | sonnet | P0-37 | Shows only own courses (authz test); instructor without 2FA is redirected to enrolment (D4) | M3 |
| P1-39 | Admin console: orders, users, moderation, audit viewer, read-only impersonation with reason | sonnet | P1-36, P0-39 | Impersonation cannot mutate (test); reason required and audited | M1 |
| P1-40 | Transactional email base: React Email layout, three streams, plain-text alt, en/bn render harness (template sets are owned by the docs/29 tasks in P1.11) | sonnet | P0-17 | Base layout renders en/bn with plain-text alt; template tasks plug in via the catalogue | M3 |
| P1-41 | Entitlement expiry reminders T-30/T-7/T-1 and expired notice (docs/29 scope; supersedes earlier T-7/T-1 scope) | sonnet | P1-34, P1-164 | Exactly-once per `entitlement_reminder`; skipped if a pass is queued; AC-PAY-05; honours unsubscribe and the minor no-marketing rule | M2 |
| P1-42 | Legal page shells, footer links and trademark notices (C31 verbatim); real content only from counsel-signed MDX (docs/26) | haiku | P0-32 | Pages linked in footer; trademark text equals D12 C31 verbatim; unsigned content renders a noindex draft banner | M2 |
| P1-43 | SEO: IELTS/GRE landing pages, structured data (Course, FAQ), blog scaffold | sonnet | P0-42 | Rich-results test passes; hreflang correct | M3 |
| P1-44 | Analytics instrumentation: domain-event mappers and client events per docs/32 §5 (supersedes earlier scope) | sonnet | P0-41, P0-70, P1-119 | Outbox replay yields one analytics event each; `order_paid` only from verified `order.paid`; staging PostHog shows required props; no autocapture | M3 |
| P1-45 | Seed IELTS/GRE course skeletons and original sample questions | haiku | P1-09, P0-40, P1-58 | Content marked original; no scraped text; lint check for provenance field; every seeded item has a provenance record | M3 |
| P1-83 | Haiku batch translation runner `tooling/scripts/i18n-draft.ts` (glossary + translation memory, idempotent, per-item output files, created/skipped/failed report) | sonnet | P0-64 | Re-run is a no-op; report shows created/skipped/failed counts | M3 |
| P1-46 | Bangla string extraction and draft translations for P1 UI | haiku | P0-29, P0-64, P0-63, P1-83 | 0 missing keys; strings flagged for native review; editor approval gate before `bn-approved` (docs/33) | M3 |
| P1-84 | Onboarding wizard at `/onboarding` (goal, exam date, target, level, under-18 guardian-consent path, language) | sonnet | P0-31, P0-30 | E2E for adult and minor paths; minor cannot opt into marketing | M3 |
| P1-85 | Generated read-only study plan from onboarding + diagnostic (C5) at `/app/plan` | sonnet | P1-84, P1-13 | Deterministic tests; same inputs give the same plan | M3 |
| P1-86 | Next-best-action hero from the rule table with 'Why this?' disclosure (true triggering signal; never shown to under-18) | sonnet | P1-37, P1-85 | Disclosure always cites a real signal; hidden for minors | M3 |
| P1-87 | In-app notification inbox/bell UI over `notification` table | sonnet | P1-164 | Unread count; mark read; keyboard and axe clean | M3 |
| P1-88 | Reviews and ratings (F-REV) with moderation hooks | sonnet | P1-02 | Only entitled learners can review; report/hide works | M3 |
| P1-89 | Certificates (C4): PDF generation and public `/verify/[code]` page (>= 128-bit code, never the UUID) | sonnet | P1-02, P1-34 | Valid code shows holder/course; unknown code 404; PDF stamped | M3 |
| P1-90 | Feature-flag admin UI `/admin/feature-flags` over `feature_flag` + seed registry for 34 §12 keys + `isEnabled` helper; flips audited | sonnet | P0-39 | Every registry key seeded; flip audited; non-admin denied | M3 |
| P1-91 | Help centre CMS (`/help`): articles, categories, error-code to article map with CI check, FAQ JSON-LD | sonnet | P0-36, P0-35 | Every app error code resolves to an article (CI); article editable by editor role | M2 |
| P1-92 | Write and verify the help-article inventory (71 articles, en/bn) in the CMS | haiku | P1-91, P0-64 | 71 articles published; support lead verification recorded; glossary terms used | M2 |
| P1-93 | `/guarantee` marketing page (en/bn) with scenarios, conditions one tap away and a legal-review hook | haiku | P1-80, P1-123 | Copy lint blocks 'guaranteed band'; conditions rendered from the same constants as the evaluator | M3 |
| P1-94 | `/tools/*` public calculators (band/raw converters, GRE score tools) with 'estimated' labels | sonnet | P0-32 | Golden tests per tool; labels present; Lighthouse >= 95 | M3 |
| P1-95 | Free 'Which test do I need?' quiz (IELTS Academic/GT/Life Skills, PTE, DET, TOEFL, EPS-TOPIK, JFT-Basic, none) with recommendation page | sonnet | P0-32 | Rule table covered by tests; result links to the right course page; no PII required | M3 |
| P1-96 | English Foundation track (A0 to B1, Bangla-medium) course skeleton, micro-price SKUs and lesson stubs | haiku | P1-70, P1-97 | Track visible in catalogue at BDT 299-999 SKUs; marked original | M3 |
| P1-97 | Lesson localisation fields: course 'Instruction language' and 'Captions available' badges; publish validator for 'Bangla-ready' | sonnet | P0-36 | Publish blocked when flagged Bangla-ready with missing `bn` | M3 |
| P1-98 | PWA + data saver: manifest, service worker (scope excludes `/exam` and `/api`), install prompt, storage manager and `navigator.storage.persist()`, offline articles/practice/flashcard decks with idempotent sync, low-bandwidth mode, supported-devices matrix | sonnet | P1-05, P1-129 | Lighthouse PWA pass; offline flashcard e2e (AC-VOC-03); no SW caching of exam routes | M3 |
| P1-99 | Brand kit export: slide-deck theme tokens (Slides/Figma) and print stylesheet token set | haiku | P0-26 | Files in `docs/brand/`; tokens match `packages/ui` | M3 |
| P1-100 | Live pilot ops tooling (D1): batch/session admin form, entitled-only join links in `/app/plan`, `.ics` feed, reminders T-24h/T-1h/T-15m with cancel supersede, attendance CSV import (Zoom report), ops-sheet export | sonnet | P1-34, P1-164 | Cancel supersedes pending reminders; DST-correct `.ics`; attendance matches ops sheet within 1% | M2 |
| P1-101 | Zoom `recording.completed` webhook -> Inngest -> Bunny (token-auth, watermarked) -> session recording ref; failure alerts | sonnet | P1-03, P1-100 | Signed webhook verified; idempotent; recording playable only to entitled learners | M2 |
| P1-102 | P1.7 exit review: dashboards, learner features, comms and content streams meet the 22 §1.2 exit criteria | opus | P1-38, P1-39, P1-40, P1-41, P1-42, P1-43, P1-44, P1-45, P1-46, P1-86, P1-87, P1-88, P1-89, P1-90, P1-92, P1-93, P1-94, P1-95, P1-96, P1-98, P1-99, P1-101 | Review logged in `docs/logs/reviews/`; each exit criterion evidenced; open findings ticketed | M3 |

#### P1.9 Support, trust & legal operations (gate: M2, M3)

| ID | Title | Owner | Depends on | Acceptance criterion | Gate |
|---|---|---|---|---|---|
| P1-103 | Support/trust migration: `support_ticket`, `ticket_message`, `macro`, `csat_response`, `dispute`, `moderation_case`, `enforcement_action`, `user_profile.support_level` + enums | sonnet | P0-14 | Migration checklist passed; fk-index test; PII columns encrypted where specified | M2 |
| P1-104 | Chatwoot Cloud integration (C29): identity HMAC, create-conversation API, signed idempotent webhook ingest, tier/priority attributes, status mirror into in-app inbox (< 30 s), `ticket_*` analytics events, helpdesk-domain DKIM | sonnet | P1-103, P1-164 | Webhook replay is a no-op; mirror latency < 30 s; helpdesk mail passes DMARC | M2 |
| P1-105 | SLA engine: BD business-hours calendar, due time by tier x priority, pause/resume, Inngest alerts, breach flags | sonnet | P1-103, P1-104 | Fixture tickets get correct due times across weekend/holiday; breach alert fires | M2 |
| P1-106 | `/app/support` and guest `/contact` ticket form (Turnstile), ticket list/status, error-code to article links | sonnet | P1-104, P1-91 | Guest and signed-in submit paths e2e; rate limited; axe clean | M2 |
| P1-107 | Support console (`/support/**`): masked lookup panel for Chatwoot, 'trace watermark code', extension caps (14 d/90 d), `pii:reveal` rate alerts, support permission strings/levels with four-eyes | sonnet | P1-104, P0-22 | Caps enforced in services; reveal logged and alerted; deny tests per level (Opus review) | M2 |
| P1-108 | Load the 30+5 support macros (en/bn) into `macro` and sync to Chatwoot; native-speaker review gate | haiku | P1-103, P0-64 | 35 macros loaded; Bangla reviewer sign-off per macro | M3 |
| P1-109 | Trust and safety runbooks pack: moderation policy and FB/Discord runbook, enforcement ladder policy, leak-response runbook, law-enforcement SOP, safeguarding register and reporting form templates, staff 2FA recovery SOP, support training and QA scorecard | haiku | P1-103 | Each runbook exists in `docs/runbooks/` with owner and review date; counsel items flagged | M3 |
| P1-110 | Piracy response tooling: minimal `enforcement_action` (warn/limit/suspend, notices), abuse-score job from `playback_session`/devices, evidence bucket with hash log, takedown templates, copyright complaint form | sonnet | P1-107, P1-04 | Seeded sharing pattern raises a flag; evidence hash verifiable; complaint form creates a ticket | M3 |
| P1-111 | Staff 2FA recovery: two-person reset flow and quarterly access-review report | sonnet | P0-21, P0-24 | Single admin cannot reset alone; report lists roles by user | M3 |
| P1-112 | DSAR operations: helpdesk export/delete connector, 3-day ack / 30-day clock dashboard, `analytics.delete-person` with warehouse tombstones, quarterly synthetic test | sonnet | P1-104, P1-53, P0-70 | Synthetic user purge verified end to end; analytics export contains properties only | M3 |
| P1-113 | Status page (Better Stack): components, bilingual incident templates, in-app banner integration | haiku | P0-11 | Incident template renders en/bn; banner toggled by flag | M2 |
| P1-114 | CSAT 24 h after resolve: storage, webhook, dashboard | sonnet | P1-103, P1-104 | CSAT recorded once per ticket; dashboard shows score by tier | M3 |
| P1-115 | Support/Trust dashboards and weekly review template | sonnet | P1-105, P1-114 | Tiles tied to SLA and CSAT views; weekly template in `docs/ops/` | M3 |
| P1-116 | Legal migration: `policy_version`, `cookie_consent_event`, `creator_agreement`, enum/column additions (26 §19.3); update 05 | sonnet | P0-14 | Migration checklist passed; versions immutable once published | M2 |
| P1-117 | Acceptance-logging service + sign-up/checkout/exam-start/live hooks + re-accept gate on material changes | sonnet | P1-116 | Acceptance row with version hash per hook; material change forces re-accept | M3 |
| P1-118 | Legal MDX pipeline: `/legal/*` routes (terms, privacy, refund, cookies, AI scoring, trademark, processors, history/versions), `legal:verify` CI, publish only with a sign-off record | sonnet | P1-116, P1-42 | CI fails when a page lacks `docs/legal/signoffs/` record; trademark text equals D12 C31 verbatim | M2 |
| P1-119 | Consent management: cookie banner (equal-prominence buttons, bn/en, re-open link), cookie inventory generator, consent events, Tier 0 allow-list, SDK gating, withdrawal behaviour, minors default off | sonnet | P1-116, P0-70, P0-41 | E2E: decline sends no client SDK, only Tier 0 server events; accept sends identified events; minor default off | M2 |
| P1-120 | Bangla drafts of legal pages from counsel-approved English only; native legal-translator review recorded | haiku | P1-118, P0-64 | Each bn page links the signed English version; reviewer sign-off per page | M3 |
| P1-121 | `docs/processors.md` + public processors page + new-vendor checklist (helpdesk, WhatsApp, Zoom, STT, LLM) | haiku | P1-118 | Every vendor in `env.ts` appears; checklist in PR template | M3 |
| P1-122 | DPIA (AI scoring, minors' voice, tab-switch logs, tutor/notebook) + transfer assessments | opus | P1-116 | DPIA stored in `docs/legal/`; counsel review recorded (BG-01) | M3 |
| P1-123 | Copy lint for blocked phrases ('guaranteed band/score/admission', fake 'was' price) across marketing, pricing, estimate UI and `/guarantee` | sonnet | P0-32 | Lint fails CI on seeded phrases; allow-list for quoted policy text | M3 |
| P1-124 | `/security` page, `security.txt` and renewal reminder | haiku | P0-32 | `/.well-known/security.txt` valid; reminder job scheduled | M3 |
| P1-125 | `/accessibility` statement (dated conformance) + accommodation request page + external audit decision | haiku | P0-32, P1-65 | Statement dated; request page opens a ticket | M3 |
| P1-126 | P1.9 exit review: support, trust and legal operations (incl. sign-off records and BG-01/03/04/05/06/09/10/11) | opus | P1-106, P1-108, P1-109, P1-110, P1-111, P1-112, P1-113, P1-115, P1-117, P1-119, P1-120, P1-121, P1-122, P1-123, P1-124, P1-125 | Review logged; sign-off records present for every published policy; support drills scheduled | M3 |

#### P1.10 AI learning features & learner study tools (gate: M3)

| ID | Title | Owner | Depends on | Acceptance criterion | Gate |
|---|---|---|---|---|---|
| P1-127 | SRS tables `srs_deck`, `srs_card`, `srs_user_card`, `srs_review_log`, `srs_user_settings` + seed pipeline from editor CSV (1,150 cards) | sonnet | P0-14 | fk-indexed; seed loads 1,150 cards | M3 |
| P1-128 | FSRS scheduler package shared client/server (`ts-fsrs`, licence re-verified) with SM-2 fallback flag and offline-replay fixtures (C26) | sonnet | P1-127 | 100% fixture pass; offline replay equals online result; defaults retention 0.90 | M3 |
| P1-129 | Vocabulary review UI `/app/vocab` (F-VOC): modes, interval buttons, keyboard, data saver, en/bn | sonnet | P1-128 | Playwright 20-card session; axe clean | M3 |
| P1-130 | Deck audio pipeline (TTS at authoring, R2 cache, IPA/audio QA checklist) | sonnet | P1-127, P1-144 | 100% of core cards have audio plus editor sign-off | M3 |
| P1-131 | pgvector + `content_chunk` + HNSW + fk-index CI checks, embedding adapter, Bangla/English retrieval benchmark (200 pairs) and model-choice ADR | sonnet | P0-12 | recall@6 >= 0.90 EN and BN; recall query < 50 ms p95; ADR committed | M3 |
| P1-132 | Chunker and `rag.reindex` Inngest job on `content.published` (video windows with `start_ms`, articles, explanations, vocab) | sonnet | P1-131 | Reindex idempotent; changed lesson only; fixtures pass | M3 |
| P1-133 | Ask Lumen tutor service (`packages/core/src/tutor`): entitlement-filtered retrieval, prompts + zod output, band-claim filter, quote cap, link allowlist, validators | sonnet | P1-132, P1-25 | Free user cannot retrieve paid chunk; unattempted answer not retrievable; 300-phrasing band filter passes | M3 |
| P1-134 | `/api/tutor/stream` SSE route, daily fair-use meters (`ai_fair_use_counter`), exam-attempt gate, minors gate (guardian consent) and retention job (30 d minors / 180 d others) with DSAR wiring | sonnet | P1-133, P1-72 | Open exam attempt -> 403; 11th Free message -> friendly wall; failure does not consume meter; under-18 w/o consent 403 | M3 |
| P1-135 | Tutor UI: lesson side panel, `/app/ask`, citation chips deep-linking to timestamp, en/bn copy, a11y | sonnet | P1-134 | Chip opens lesson at `t`; axe clean; bn strings present | M3 |
| P1-136 | `pnpm eval:tutor` harness: groundedness, injection (>= 150), exam-leak refusal, hint-leak, Bangla rubric, latency | sonnet | P1-133 | Gates met or feature ships labelled beta (Opus gate review) | M3 |
| P1-137 | `score_prediction` + `official_score_report` tables and snapshot writer (<= 1/day/skill) | sonnet | P1-13 | Snapshots reproducible from stored `inputs_digest` | M3 |
| P1-138 | Weighted-EAP estimator reusing `eapTheta`, L/R band mapping via `score_conversion`, W/S aggregation, IELTS overall range via Monte Carlo + rounding rules, GRE V/Q path-aware | sonnet | P1-137, P1-22 | Property tests (monotone, recency, exam-mode weight); 07 worked example (20/27 -> 158, 154-161) passes (Opus review) | M3 |
| P1-139 | Estimate UI (`/app/progress/estimate`): range, confidence badge, drivers, labels, bn copy, trademark footer | sonnet | P1-138, P1-123 | Forbidden-phrase lint passes; axe; screenshot tests | M3 |
| P1-140 | `study_asset` + `study_asset_progress` tables, `/editor/study-assets` review UI, stale detection | sonnet | P0-36 | Editing a published lesson marks dependent assets stale and re-queues | M3 |
| P1-141 | Study-asset generator pipeline (Sonnet batch) + grounding checker + verifier for guides, FAQs and quizzes | sonnet | P1-140, P1-132 | Unmapped sentences removed; 20-unit pilot passes editor checklist | M3 |
| P1-142 | Lesson quiz player (Got it / Missed it, retry missed, mistake-notebook feed) | sonnet | P1-141, P1-67 | E2E; quiz items excluded from IRT/predictor | M3 |
| P1-143 | Study guide/FAQ renderer + watermarked PDF export | sonnet | P1-141, P1-57 | Signed URL <= 5 min; 5/day limit enforced | M3 |
| P1-144 | TTS vendor spike: EN + BN quality, SSML lexicon, licence-clause capture, cost per 10 min (ADR) | sonnet | P1-25 | ADR with listening score >= 4/5 from 3 Bangla speakers; licence clause recorded | M3 |
| P1-145 | Writing/Speaking Coach UX on stored evaluations: highlight renderer with offset validation, rewrite panel + diff, vocabulary-upgrade add-to-deck | sonnet | P1-26, P1-129 | Invalid offsets dropped; no band numbers in rewrites (filter test); cards link to evaluation id | M3 |
| P1-146 | P1.10 exit review: AI learning features meet cost, grounding and labelling gates | opus | P1-130, P1-135, P1-136, P1-139, P1-142, P1-143, P1-145 | Review logged; tutor/estimate/study-asset gates met or features flagged beta; COGS within 34 §11 guardrails | M3 |

#### P1.11 Finance, analytics & lifecycle messaging (gate: M2, M3, post-M3 (P1 stream))

| ID | Title | Owner | Depends on | Acceptance criterion | Gate |
|---|---|---|---|---|---|
| P1-147 | Finance schema `finance.ts` (ledger_account, finance_period, ledger_journal/entry append-only triggers, revenue_schedule) + seed chart of accounts and `finance_setting` defaults (flagged unverified) | sonnet | P1-31 | Balance and closed-period trigger tests; seed idempotent; fk-index test | M3 |
| P1-148 | Posting service: order paid, settlement, refund (contra/deferred reversal, credit note, VAT reversal, fee leakage), chargeback, AI cost, payouts | opus | P1-147, P1-32 | Every event yields a balanced journal; replays create no duplicates; VAT rounding unit-tested | M3 |
| P1-149 | `recogniseRevenue` and `recogniseConsumption` jobs + deferred roll-forward report | sonnet | P1-148 | Roll-forward ties to entitlement control total within 0.1% | M3 |
| P1-150 | T0 integrity checks C1-C9 + daily digest email + sign-off | sonnet | P1-148 | Seeded faults detected; digest lists counts | M3 |
| P1-151 | Settlement upload/parse/match for SSLCommerz (parser profiles as config), bank-statement CSV import and three-way match, aging report | sonnet | P1-147 | Fixture with unmatched/variance rows yields correct items; re-upload idempotent | M3 |
| P1-152 | Reconciliation item queue UI + resolution actions (fulfil, refund, suspense, write-off) | sonnet | P1-150, P1-151 | Actions audited; paid-not-fulfilled resolves via `fulfilOrder` | M3 |
| P1-153 | Month-end close workflow (checklist in `finance_period`) and period lock | sonnet | P1-150, P1-151, P1-149 | Closed period rejects postings; reopen needs `super_admin` + reason | M3 |
| P1-154 | Finance dashboards v1 (deferred revenue, billings vs revenue, payments health, refunds, burn/runway) | sonnet | P1-149 | Numbers tie to exports | M3 |
| P1-155 | Foreign flows: Paddle/Stripe payout import, `export_receipt` with 4-month alerts, foreign vendor payment schedule and reverse-charge calc | sonnet | P1-151, P1-35 | Alert on > 3-month-old unreceived; report ties to bank advice | M3 |
| P1-156 | Payee onboarding: `payee_profile`, encrypted details, creator/grader agreement acceptance and PDF storage, call-back verification, 7-day cooling on detail change | sonnet | P1-147, P1-116 | Details encrypted; change triggers cooling; audit events | M3 |
| P1-157 | Payout statements (asset fees, 10% royalty on own course, grader/rater items), PDF en/bn, dispute window, batch CSV, two-person approval with step-up 2FA; royalty accrual with 14-day hold and clawbacks | opus | P1-156, P1-30 | Four-eyes tested; blocked when withholding rate unverified; refund after payout yields negative line | M3 |
| P1-158 | `analytics` schema + read-only role `analytics_ro` + KPI views (K-01.. per 32 §2.5) + `internal_user` table | sonnet | P0-14, P0-70 | Views return fixture-expected numbers; role cannot read base tables | M3 |
| P1-159 | `marketing_spend` table + weekly CSV import page + CAC view | sonnet | P1-158 | Import validates currency/channel; K-10 reproduces a hand-computed sample | M3 |
| P1-160 | Nightly data tests and PostHog-vs-DB purchase reconciliation alert | sonnet | P1-44 | Alerts fire on injected anomalies; PII scan finds seeded email | M3 |
| P1-161 | Experiment framework: PostHog experiments, server-side flag evaluation helper, `experiment_exposed`, SRM check job, brief template and registry, quarterly taxonomy review + stale-flag lint | sonnet | P1-44, P1-119 | Sticky variant across devices; non-consenting visitor gets control without exposure; SRM job flags seeded imbalance; stale flag lint (warn 60 d / fail 90 d) | M3 |
| P1-162 | Message analytics: `message_*` events from `notification_dispatch`/webhooks, click attribution window, messaging dashboard | sonnet | P1-164, P1-44 | Counts match ledger; no address or phone in events | M3 |
| P1-163 | Launch dashboards 1-8 in PostHog/Metabase with definitions and owners + WBR template | haiku | P1-158, P1-44 | Every tile cites a K-id; internal users excluded; consent caveat banner present | M3 |
| P1-164 | Notification dispatcher `notifications.dispatch` (decision order 29 §2.5) + ledger migration (`notification_dispatch`, `notification_setting`, enums) | sonnet | P0-17, P0-69 | Policy truth-table tests (>= 300 generated cases); AC-NOT-01/02 pass | M2 |
| P1-165 | Auth and security templates N-AUTH-01..16 en/bn incl. plain text; Better Auth hooks and `auth.*` events | sonnet | P1-164 | Snapshot + a11y tests; OTP link tracking off; OTP 5 min and link 60 min asserted | M2 |
| P1-166 | Preference centre `/app/settings/notifications`, one-click unsubscribe API, token page, consent sync with `marketing_opt_in` | sonnet | P1-164 | AC-PREF-01..05 pass; Playwright en/bn; axe clean | M2 |
| P1-167 | Commerce templates N-COM (receipt, payment states, refund states, reconciliation notices) en/bn + `payment.reconcile_delayed` support hook | sonnet | P1-34, P1-164 | E2E: Buy-now receipt, failed payment, refund, late IPN pending to reconciled; amounts from snapshot only | M2 |
| P1-168 | SMS stack: segment calculator, template register with change control (CI blocks edits to registered strings without version bump), DLR webhook, operator failover, spend alarm; OTP SMS English-by-default policy | sonnet | P0-18, P1-164 | Segment tests; failover test; alarm at 2x average; register CI check | M3 |
| P1-169 | Lifecycle engine: `lifecycle_enrolment` state machine, onboarding N-ONB-01..14, abandoned-checkout and win-back (M class) with sunset after 90 days | sonnet | P1-164, P1-119 | Exit on purchase; minors skip M; quiet-hours deferral; no M without consent | M3 |
| P1-170 | Deliverability: DNS for three streams, DMARC rollout, Postmaster Tools, warm-up governor, bounce/complaint webhook to `contact_suppression` | sonnet | P0-17 | DMARC aligned in test mails; suppression test; warm-up caps enforced (DNS by founder, BG-12) | M3 |
| P1-171 | Evaluation/results templates N-EVL-01..11 (incl. rescore broadcast) and staff/creator alerts N-STF-01..12 (grader SLA warning at 36 h of 48 h, digests, role-changed mail) | sonnet | P1-164, P1-26 | No essay text in any template (test); staff digest grouping test | M3 |
| P1-172 | Privacy templates N-PRV-01..11 and job hooks (export ready, deletion scheduled/reminders/cancelled/completed, policy update) | sonnet | P1-164, P1-53 | Day 0/7/13 fake-clock timeline; completion mail once, address not retained | M3 |
| P1-173 | Learning nudges, weekly progress digest (facts builder, deterministic email for Free) and exam countdown crons with cap class `nudge` and reminder-time settings | sonnet | P1-164, P1-37 | Never > 1/day, 4/week; never after 21:00 (20:00 minors); Sunday 18:00 local verified for BD and London | M3 |
| P1-174 | Bangla copy pass for all T/S templates then P, glossary-driven, reviewer sign-off file per template | haiku | P0-64, P1-165, P1-167 | Sign-off file per template; i18n parity CI green | M3 |
| P1-175 | Price-experiment engine: `price_lock`, `resolvePriceSet`, cache tags, strike-through ban during tests, Region A/minor exclusion (post-launch, before first price test) | sonnet | P1-71, P1-161 | E2E R-P1..R-P5 pass; invoice equals displayed price; lock logic transaction-safe | post-M3 (P1 stream) |
| P1-176 | Pricing research kit: Van Westendorp survey (bn/en), analysis notebook/SQL, consent text (post-launch) | haiku | P1-161 | Native review recorded; analysis reproduces PSM intersections on sample data | post-M3 (P1 stream) |
| P1-177 | P1.11 exit review: finance, analytics and messaging readiness (accountant gates G1-G9, consent tiers, deliverability) | opus | P1-152, P1-153, P1-154, P1-155, P1-157, P1-159, P1-160, P1-161, P1-162, P1-163, P1-166, P1-168, P1-169, P1-170, P1-171, P1-172, P1-173, P1-174 | Review logged; accountant sign-offs recorded (BG-02); no PII found by data tests | M3 |

#### P1.12 AI evaluation operations & calibration (gate: M2, M3)

| ID | Title | Owner | Depends on | Acceptance criterion | Gate |
|---|---|---|---|---|---|
| P1-178 | `ai-ops.ts` schema (rating_assignment, eval_run, model_release, ai_dispute..) + enum/permission additions | sonnet | P1-26 | Typecheck, fk-index test, split/locked CHECKs | M2 |
| P1-179 | Rating tool: assignment modes, blind enforcement, seeded anchors, workload caps, incomplete-block assigner | sonnet | P1-178, P1-30 | Blind test: no AI/other-rater leak; seeded items undetectable by UI | M3 |
| P1-180 | Adjudication view, rater analytics (QWK, bias, speed) and payment-lines hook to payouts | sonnet | P1-179, P1-157 | Metrics match a reference notebook | M3 |
| P1-181 | Streamed audio player with watermark, no download and word-level transcript highlight | sonnet | P1-179 | E2E: raw file not fetchable; watermark present | M3 |
| P1-182 | Research-use consent: `research_use` kind, en/bn copy, withdrawal flow, minors exclusion | sonnet | P1-178, P1-117 | Toggle gates gold-candidate flag; withdrawal deletes <= 30 days (job test) | M3 |
| P1-183 | Gold-set ingestion: commissioned collection form, redaction pipeline, dedup, `author_hash`, split assignment (no author in both splits) | sonnet | P1-178 | Split leakage test; redaction recall >= 98% on seeded PII set | M3 |
| P1-184 | Harness v2 on P1-28: MAE, within-0.5, exact, QWK, bias, bootstrap CIs, subgroup slices, verdict logic, report generator, `eval_run` persistence | opus | P1-28, P1-178 | Reproduces reference metrics on a toy dataset; CI blocks on regression thresholds | M2 |
| P1-185 | Safety/injection, Bangla/Banglish, length and template suites | sonnet | P1-184 | Suite runs in CI; known-bad prompts caught | M3 |
| P1-186 | Calibration map fit and versioning per (model, family), dev-only enforcement | sonnet | P1-184 | Locked set unreachable from fit code (test) | M2 |
| P1-187 | Model registry (`model_release`), pin flags, rollback command, live uniqueness | sonnet | P1-178 | Rollback < 5 min drill; unique-live constraint | M3 |
| P1-188 | Production monitors (nightly canary, weekly PSI, `qa_sample`, `v_ai_agreement`, QWK/Wilson CI, cost/credit alerts), audit sampling job and `/admin/ai-monitor` dashboard incl. AI usage panels | sonnet | P1-187, P1-179 | Synthetic drift and injected bias trigger alerts; sampling rates verified; panels per 31 §7.3 | M3 |
| P1-189 | Beta presentation: badge, widened range, copy, per-family flag; beta gate checks L1-L6 | sonnet | P1-184, P1-186 | Family without gate shows feedback-only | M2 |
| P1-190 | `/accuracy` methodology page generated from `eval_run` JSON + claims register | sonnet | P1-184 | Numbers generated; staleness banner works | M3 |
| P1-191 | Dispute flow: result-page button, triage rules, free-limit logic, `ai_dispute`, SLA timers, grader routing, second review, learner notifications, gold-candidate hook | sonnet | P1-178, P1-30, P1-103 | Decision-table cases tested; revised result becomes final | M3 |
| P1-192 | AI cost controls: `pricing.ts` with CI recompute test, per-user/global caps, spend budget and degrade levels, result/STT cache, similarity throttle, prompt caching and batch API wiring | sonnet | P1-26 | Test fails if constants drift; budget breach degrades free tier first; cache hit not re-billed | M3 |
| P1-193 | Equivalence tooling (paired bootstrap, non-inferiority) + shadow/canary scorer (one displayed score per submission) | opus | P1-184, P1-187 | Dry run on two configs gives expected verdict; shadow results stored not shown | M3 |
| P1-194 | Gemini fallback qualification: own gate run, queue-and-retry until passed, monthly failover drill | sonnet | P1-193 | Fallback blocked when unqualified; label shown when used | M3 |
| P1-195 | Retention jobs: speaking audio 90 days (C6) with consented extension, audit purge, withdrawal deletion | sonnet | P1-182 | Time-travel tests; 05/07 180-day text gone | M3 |
| P1-196 | AI feedback language policy: `evaluation_result.locale`, 'Explain in Bangla' toggle, Bangla test-set hooks | sonnet | P1-26, P1-184 | Toggle returns Bangla summary/tips only; eval set passes (Opus review) | M3 |
| P1-197 | Grader programme ops: qualification test, QWK-based probation, rate card, workload caps, availability, no-show reassignment, quality dashboard | sonnet | P1-179, P1-30 | Probation gate blocks unqualified grader; in-flight reassignment tested | M3 |
| P1-198 | P1.12 exit review: AI evaluation operations (gold set, calibration, monitors, beta gate) | opus | P1-180, P1-181, P1-183, P1-185, P1-188, P1-189, P1-190, P1-191, P1-192, P1-194, P1-195, P1-196, P1-197 | Review logged; beta gate L1-L6 evidenced per task family; rollback drill done | M3 |

#### P1.8 Hardening & launch (gate: M2, M3)

| ID | Title | Owner | Depends on | Acceptance criterion | Gate |
|---|---|---|---|---|---|
| P1-47 | E2E suites: signup -> purchase -> learn -> test -> result (+ mobile viewport) | sonnet | P1-33, P1-23, P1-05 | Playwright green on CI preview | M3 |
| P1-48 | Accessibility audit (axe + manual keyboard/screen-reader pass) and fixes | sonnet | P1-47 | 0 serious/critical axe issues on inventory pages | M3 |
| P1-49 | UI polish pass on top 10 pages against polish checklist | sonnet | P1-47 | Checklist in 12 §6.1 fully ticked in PR description | M3 |
| P1-50 | Security hardening: dependency audit, rate-limit review, authz sweep, secrets scan, final review | opus | P1-47, P1-43 | Signed-off report; zero open high/critical | M3 |
| P1-51 | Load test (k6): 1,000 concurrent attempts, autosave, checkout (scripts from P0-49) | sonnet | P1-47, P0-49 | p95 autosave < 300 ms; no deadline drift > 1 s; exam-start storm of 2,000 users meets docs/22 §5.8 thresholds | M3 |
| P1-52 | Backups, PITR, monthly restore drill, runbooks and alerts | sonnet | P0-11 | Restore into scratch branch succeeds and is documented | M2 |
| P1-53 | Data export and account deletion flows | sonnet | P0-31, P0-24 | Export includes all user data; delete anonymises and audits | M2 |
| P1-199 | Pre-launch finance dry run (gate G12): full month on sandbox data, accountant accepts the report | opus | P1-153, P1-154, P1-36 | Dry-run report accepted by CA (BG-02) | M3 |
| P1-200 | Launch drills: payment-pending/no-access simulation, OTP failure, exam outage bulk re-issue, refund end-to-end, DSAR synthetic, Zoom pilot day | opus | P1-105, P1-107, P1-167, P1-64, P1-78, P1-112, P1-79, P1-100 | Each drill logged in `docs/logs/reviews/` with pass/fail and fixes | M3 |
| P1-54 | Launch checklist, status page content, go-live and business-readiness gates (BG-01..BG-14 ticked) | opus | P1-19, P1-20, P1-21, P1-22, P1-48, P1-49, P1-50, P1-51, P1-52, P1-53, P1-55, P1-56, P1-82, P1-102, P1-126, P1-146, P1-177, P1-198, P1-199, P1-200 | All 11 §launch items ticked incl. legal sign-offs, support drills, finance dry run and BG gates; founder sign-off recorded in PROGRESS.md | M3 |

### P2 - Growth

#### P2.1 Live learning (gate: M4)

| ID | Title | Owner | Depends on | Acceptance criterion | Gate |
|---|---|---|---|---|---|
| P2-01 | Live batches: schema, scheduling, enrolment | sonnet | P1-34 | Batch has timezone-safe sessions; entitlement `live_batch` | M4 |
| P2-02 | Embedded YouTube Live (unlisted)/Zoom session pages + reminders | sonnet | P2-01 | Only entitled users get join link; reminders T-1h | M4 |
| P2-17 | Live attendance auto-tracking (Zoom participant webhooks, YouTube heartbeat), intervention rules (missed 3 / < 60%), homework tracking, live-class analytics events and dashboard 10 | sonnet | P2-01, P2-02, P1-100 | Attendance share matches ops sheet within 1%; rule triggers mentor task in fake clock | M4 |
| P2-18 | Accommodation self-serve request form (C18 P2) with evidence upload and support review | sonnet | P1-65 | Request creates ticket; approved multiplier applied; expiry job | M4 |

#### P2.2 Engagement & community (gate: M4)

| ID | Title | Owner | Depends on | Acceptance criterion | Gate |
|---|---|---|---|---|---|
| P2-03 | Study plans: target score/date to weekly schedule | sonnet | P1-37 | Plan regenerates on missed days; deterministic tests | M4 |
| P2-04 | Streaks + XP + badges (restrained, no dark patterns) | sonnet | P1-37 | Streak logic timezone-correct; opt-out available | M4 |
| P2-05 | Community Q&A per course with moderation | sonnet | P1-39 | Report/hide flow; instructor answers; rate limited | M4 |
| P2-19 | In-app moderation tooling: `moderation_case`, `/admin/moderation` queue, auto-flag lists (en/bn/Banglish) | sonnet | P2-05, P1-103 | Reported item reaches queue; Banglish fixtures flagged; actions audited | M4 |
| P2-20 | Plan-edit chat: constraint-parse prompt + zod + diff UI; adaptive rescheduling and calendar sync handled by P2-03 | sonnet | P2-03, P1-133 | Parse of 100 EN/BN utterances >= 95% exact; planner output unchanged by wording | M4 |
| P2-21 | Quarterly NPS survey storage and dashboard | sonnet | P1-114 | NPS stored per user per quarter; dashboard by tier | M4 |

#### P2.3 Growth monetisation & access programme (gate: M4)

| ID | Title | Owner | Depends on | Acceptance criterion | Gate |
|---|---|---|---|---|---|
| P2-06 | Coupons and campaign pricing | sonnet | P1-36 | Stacking rules tested; server-side price only | M4 |
| P2-07 | Affiliate/referral tracking and payouts report | sonnet | P2-06 | Attribution window tested; fraud flags; commission reversed on refund within hold | M4 |
| P2-13 | bKash Tokenized Checkout direct integration | sonnet | P1-32 | Sandbox payment + refund; fee comparison logged | M4 |
| P2-14 | International auto-renew subscriptions (Paddle/Stripe) + dunning emails | sonnet | P1-35 | Renewal/cancel/failed-payment webhooks handled idempotently | M4 |
| P2-22 | bKash instalments (2-3 parts, Live/Mentor) with default grace then access pause, receivable tracking, dunning and instalment templates N-COM-16..18 | sonnet | P2-13, P1-34, P1-167 | Overdue ladder with fake clock; refund of instalments handled; access paused not revoked | M4 |
| P2-23 | Scholarship workflow: application, evidence upload, need score, 50/75/100% awards, quota (<= 8%) and Access Fund budget guard, activation rule, abuse controls, transparency report | sonnet | P1-74, P2-06 | Budget exceeded blocks new awards; duplicate proof flagged; single-use bound codes | M4 |
| P2-24 | Partner codes (UDC, NGO, TTC, university): partner dashboard, allow-listed products, caps and expiry, UDC commission accrual after refund window | sonnet | P2-06, P2-07 | Caps enforced; commission reversed on refund within hold | M4 |
| P2-25 | Multi-item `/cart` and bundle checkout (C24) | sonnet | P1-33 | Mixed-region and mixed-kind cart rejected or split with clear copy; totals server-side | M4 |
| P2-26 | Physical books and COD: `physical_book` products, address book, Steadfast courier, COD handling and returns, watermarked PDF e-books, delivery fee rules | sonnet | P1-69, P1-33, P1-57 | COD order lifecycle e2e; PDF stamped with buyer id; no intl shipping | M4 |
| P2-27 | bKash/Nagad direct statement parsers and disbursement-API payouts (if eligible) | sonnet | P2-13, P1-151 | Fixture parsers match settlement samples | M4 |
| P2-28 | Breakage sweep for expired credits (after OQ-F1 decision) | haiku | P1-149 | Expired credits post to 4310 | M4 |
| P2-29 | Bank feed/API integration and accounting-software export format agreed with CA | sonnet | P1-151 | CA imports without manual fixes | M4 |
| P2-30 | Refund and claim dashboards (finance + admin) with alert at refund rate > 12% | haiku | P1-78, P1-81 | Alert fires on synthetic spike | M4 |

#### P2.4 Institutions & guardians (gate: M4)

| ID | Title | Owner | Depends on | Acceptance criterion | Gate |
|---|---|---|---|---|---|
| P2-08 | Institution accounts: org seats, cohorts, invitations | sonnet | P0-14, P1-34 | org_admin limited to own orgId (authz tests); org invite acceptance emails | M4 |
| P2-09 | Org analytics and assignments (courses/tests) | sonnet | P2-08 | Cohort report matches raw data in test | M4 |
| P2-10 | Guardian linking (student consent) + read-only parent view + pay-for-student | sonnet | P1-37 | Link needs student consent; revoke works; guardian report with consent screen and pause control | M4 |
| P2-31 | B2B invoicing (BIN, PO, credit terms), seat refund rules, coaching-centre bulk import template, offboarding/data return | sonnet | P2-08, P1-148 | Invoice shows BIN; AR aging; offboarding exports data | M4 |
| P2-32 | Guardian, org and subscription notification templates and jobs | sonnet | P2-10, P2-08, P1-164 | Guardian report only with granted link; templates en/bn | M4 |
| P2-33 | Org/B2B and guardian analytics (groups by `org_id_hash`, usage, report exports) | sonnet | P2-09, P1-158 | No member PII in group analytics | M4 |

#### P2.5 New exams, courses & pronunciation (gate: M4)

| ID | Title | Owner | Depends on | Acceptance criterion | Gate |
|---|---|---|---|---|---|
| P2-11 | PTE Academic module (item types, scoring tables) | sonnet | P1-13 | Reuses engine; new types render and score | M4 |
| P2-12 | Duolingo English Test practice module | sonnet | P1-13 | Adaptive item selection documented and tested | M4 |
| P2-15 | Optional pronunciation scoring (Azure Pronunciation Assessment) | sonnet | P1-27 | Behind flag; cost per attempt logged; included in the speaking gate evaluation (docs/31) | M4 |
| P2-34 | IELTS Life Skills A1/B1 module (config + content skeleton) on the exam-agnostic type registry | sonnet | P1-13 | New test = content + config only; golden scoring tests | M4 |
| P2-35 | Spoken English track (course skeleton, AI conversation practice) incl. workplace variant | sonnet | P1-26 | Track purchasable; AI practice metered per 17 | M4 |
| P2-36 | Pronunciation drills v1 (Deepgram proxy) then v2 (Azure PA) with Bangla-speaker error library and honest labels | sonnet | P2-15 | Per-word feedback; accent-fair wording reviewed | M4 |
| P2-37 | Paraphrase trainer and extra rewrites (`coach_action` meter, `copied_words_ratio` in code) | sonnet | P1-145 | 100-case check set passes; no band numbers | M4 |
| P2-38 | Speaking partner (turn-based): session service, STT/LLM/TTS loop, summary, 'Score this session', credits (3 per 10-min session) | sonnet | P1-27, P1-144, P1-72 | p95 round trip <= 5 s in staging; hard caps enforced (Opus review) | M4 |

#### P2.6 Admissions tools (Common App) (gate: M4)

| ID | Title | Owner | Depends on | Acceptance criterion | Gate |
|---|---|---|---|---|---|
| P2-39 | Admissions schema per 21 §6.3 (admissions_plan, college + requirements, college_target, application, task/deadline, activities, recommenders, essay_workspace, scholarship) + `adm.*` SKUs in price book | sonnet | P1-69, P0-14 | Migration checklist passed; SKUs seeded; roles unchanged until counsellor gate | M4 |
| P2-40 | College data curation tool and ~150 verified colleges seed with `verified_at` and stale-requirement alerts | haiku | P2-39 | Stale rate < 5%; every row has source URL | M4 |
| P2-41 | Deadline and document tracker, activities builder and recommender tracker with Inngest reminders | sonnet | P2-39, P1-164 | T-minus reminders in fake clock; 'what's missing' view | M4 |
| P2-42 | Essay workspace with AI feedback (feedback only, never writing) and integrity red-team suite | sonnet | P2-39, P1-25 | Red-team suite: rule-violating outputs < 1 per 1,000 (Opus security review) | M4 |
| P2-43 | Scholarship finder (8 starter scholarships) and admissions dashboard widgets + webinars | sonnet | P2-39 | Finder filters tested; widgets role-aware | M4 |
| P2-44 | P2b: UCAS question feedback, Germany/Canada/Australia checklists, SOP/CV reviewer, financial-aid estimator | sonnet | P2-42 | Checklists data-driven; reviewer flows audited | M4 |
| P2-45 | `counsellor` role surface: `(counsellor)` routes, assigned-student policy in `assertCan`, 2FA enforced, Guided tier human-review workflow (2 reviews) | opus | P2-44, P0-22 | Counsellor sees only assigned students (deny tests); no payments access | M4 |

#### P2.7 AI learning (growth) (gate: M4)

| ID | Title | Owner | Depends on | Acceptance criterion | Gate |
|---|---|---|---|---|---|
| P2-46 | Auto-card drafting (Haiku) + editor approval queue + leech mnemonic suggestions | sonnet | P1-129, P1-145 | Private cards pass schema/sanity; shared cards need approval | M4 |
| P2-47 | FSRS parameter optimiser Inngest job with guardrails (>= 1,000 reviews) | sonnet | P1-128 | Offline eval no worse than defaults else rollback | M4 |
| P2-48 | AI narration + numeric validator + fallback for reports and estimates; guardian copy | sonnet | P1-139, P1-173 | 200 adversarial narrations never alter numbers | M4 |
| P2-49 | Post-exam report capture, TRF upload and verification queue, calibration jobs, `/accuracy` score-estimate section and drift alerts | sonnet | P1-138, P1-81, P1-190 | Section renders only after Stage 1 threshold; Deming fit reproducible | M4 |
| P2-50 | Audio Overviews: pipeline (script, verify, TTS, loudness, VTT/chapters, R2) with 5-episode EN pilot; Listen UI with transcript sync, chapters, offline and low-data variant, Media Session | sonnet | P1-144, P1-141 | Episodes pass audio QA; offline playback e2e | M4 |
| P2-51 | Bangla audio set (native script, back-translation verifier, BN editor sign-off) and mind-map generator/viewer | sonnet | P2-50 | 100% BN episodes signed off; every mind-map node cites a chunk | M4 |
| P2-52 | 'Pause and ask' bridge from player to Ask Lumen with chapter context | sonnet | P2-50, P1-134 | Prefill contains chapter chunk ids; counts as `tutor_msg` | M4 |
| P2-53 | My notebook: tables, upload scanning, text-layer ingest, per-user index, deletion jobs, notebook chat + Audio Overview (5 credits), ToS/consent, DPIA update | sonnet | P1-131, P2-50, P1-122 | Delete removes chunks within 24 h; file-borne injection suite passes (Opus security review) | M4 |

#### P2.8 Operations growth (messaging, analytics, support, AI ops) (gate: M4)

| ID | Title | Owner | Depends on | Acceptance criterion | Gate |
|---|---|---|---|---|---|
| P2-54 | Web push (PWA): opt-in, quiet hours, 1 nudge/day, 410 cleanup, no PII in payload | sonnet | P1-98, P1-173 | Respects F-NOT-07 cap; iOS installed-PWA test | M4 |
| P2-55 | WhatsApp Business adapter, opt-in flow, template submission pack, STOP handling | sonnet | P1-168 | Sandbox send; STOP suppresses < 60 s; templates versioned | M4 |
| P2-56 | Template health dashboard and weekly report | sonnet | P1-164, P1-158 | Alert on complaint rate > 0.1% | M4 |
| P2-57 | Server-side ad conversions (Meta CAPI / Google) behind consent and flag | sonnet | P1-119 | Only consented, vendor-spec hashed identifiers | M4 |
| P2-58 | Warehouse stage S1: PostHog batch export to BigQuery (or R2/ClickHouse), dbt marts, tombstone refresh | sonnet | P1-158 | Marts rebuild nightly; erasure tombstones applied in test | M4 |
| P2-59 | Enforcement ladder full: abuse-score tuning, user notices, appeals UI | sonnet | P1-110 | Appeal flow audited; thresholds in config | M4 |
| P2-60 | P2 gate review: native ticketing vs Chatwoot decision memo | opus | P1-115 | ADR appended to 00 change log | M4 |
| P2-61 | Remove Beta per family via CI rule once Phase B gates pass; publish update; grader capacity model and hiring triggers | sonnet | P1-190, P1-188 | Gate evidence stored; page updated; capacity model computes required graders | M4 |
| P2-62 | Tolgee/Weblate evaluation spike (1 day) at 2,500 strings or second translator | sonnet | P0-63 | ADR with decision | M4 |

#### P2.9 Phase review (gate: M4)

| ID | Title | Owner | Depends on | Acceptance criterion | Gate |
|---|---|---|---|---|---|
| P2-16 | P2 security and performance review | opus | P2-13, P2-14, P2-08 | Report with zero open high findings | M4 |

### P3 - Expansion

#### P3.1 Marketplace (gate: M5)

| ID | Title | Owner | Depends on | Acceptance criterion | Gate |
|---|---|---|---|---|---|
| P3-01 | Marketplace schema: instructor profiles, KYC status, revenue-share rules | sonnet | P2-16 | Rules versioned; money in minor units | M5 |
| P3-02 | Revenue-share ledger and payout runs | opus | P3-01 | Ledger balances reconcile in property tests; finance approval required; `payout_statement` migrates losslessly into `payout`/`payout_line` | M5 |
| P3-03 | Instructor onboarding + application review | sonnet | P3-01 | Application -> approved grants `instructor` with audit | M5 |

#### P3.2 API, search & mobile (gate: M5)

| ID | Title | Owner | Depends on | Acceptance criterion | Gate |
|---|---|---|---|---|---|
| P3-04 | Public API: Hono at /api/v1 with OpenAPI from zod | sonnet | P1-34 | Same core services; OpenAPI validates; API-key + OAuth scopes | M5 |
| P3-09 | Meilisearch for catalogue/question search | sonnet | P1-43 | Index sync via Inngest; relevance tests | M5 |
| P3-10 | Expo mobile app (learner features) against /api/v1 | sonnet | P3-04 | Login, learn, take test offline-tolerant; store-ready build; native push via the same dispatcher; parity table for tutor, SRS sync, audio and estimates closed | M5 |

#### P3.3 Tech & university tracks (gate: M5)

| ID | Title | Owner | Depends on | Acceptance criterion | Gate |
|---|---|---|---|---|---|
| P3-05 | Tech tracks content model (Python, ML, AI, Databases, Networking) | sonnet | P1-01 | Tracks reuse course/lesson schema; prerequisites supported | M5 |
| P3-06 | University course packs (BD CSE syllabus) and semester bundles | sonnet | P3-05 | Pack = bundle product; org licensing works | M5 |
| P3-07 | In-browser code notebooks (sandboxed execution) | opus | P3-05 | Untrusted code isolated; resource limits tested | M5 |
| P3-08 | Auto-graded coding exercises | sonnet | P3-07 | Hidden tests run in sandbox; no network | M5 |

#### P3.4 Live, media & new tests (gate: M5)

| ID | Title | Owner | Depends on | Acceptance criterion | Gate |
|---|---|---|---|---|---|
| P3-11 | LiveKit in-house live classes | sonnet | P2-02 | Rooms authz'd by entitlement; recording to R2 | M5 |
| P3-12 | DRM evaluation (Widevine/FairPlay) if piracy material | opus | P1-04 | Decision memo appended to 00 change log | M5 |
| P3-14 | TOEFL iBT 2026 module and course packaging | sonnet | P1-13 | Item types and scoring tables as data with golden tests | M5 |
| P3-15 | Work-Abroad language tracks: Korean EPS-TOPIK and Japanese JFT-Basic | sonnet | P3-05 | Tracks purchasable via partner codes; Bangla-medium | M5 |
| P3-16 | Optional OET / SAT / GMAT prep modules (go/no-go memo first) | sonnet | P1-13 | Memo approved before build | M5 |
| P3-17 | Open Badges 3.0 and LinkedIn deep-link polish for certificates | haiku | P1-89 | Badge validates in an OB3 validator | M5 |
| P3-18 | QTI 3.0 export of the question bank (exporter only, pure function) | sonnet | P1-07 | 1EdTech validator passes on sample export | M5 |
| P3-19 | Duplex speaking-partner spike (token minting, streaming STT/LLM/TTS, host choice) | opus | P2-38 | End-of-speech to audio measured from a BD mobile network | M5 |
| P3-20 | Visual overview feasibility memo with cost | opus | P2-50 | Go/no-go recorded | M5 |
| P3-21 | NBA ML-ranker prerequisites: impression logging, holdout, offline replay (analysis only) | opus | P1-86 | Preconditions dashboard shows 03 §5.9 thresholds | M5 |
| P3-22 | Yearly locked-test refresh job, rater re-certification and prompt retirement | sonnet | P2-61 | Refresh >= 30% complete in test | M5 |

#### P3.5 Admissions (counsellor tier) & phase review (gate: M5)

| ID | Title | Owner | Depends on | Acceptance criterion | Gate |
|---|---|---|---|---|---|
| P3-23 | Counsellor tier: session packages, session notes, counsellor assignment | sonnet | P2-45 | Notes private to assigned counsellor; package utilisation tracked | M5 |
| P3-24 | AI interview and visa-interview prep | sonnet | P2-42 | Feedback only; honesty rules for visa messaging | M5 |
| P3-25 | B2B school dashboards for admissions (org) | sonnet | P2-41, P2-08 | org_admin sees own org only | M5 |
| P3-13 | P3 security, scale and cost review | opus | P3-02, P3-07, P3-10 | Zero open high findings; cost per active user reported | M5 |

### Business readiness gates (human-owned, not agent tasks)

Each gate has a named human owner and an evidence file in `docs/ops/launch-evidence.md`. `P1-54` (go-live) requires BG-01..BG-14 ticked; BG-15 is post-launch; BG-16 are founder decisions. Tracked as checkboxes in `docs/PROGRESS.md`.

| ID | Gate | Source |
|---|---|---|
| BG-01 | Engage counsel A/B/C and send 26 as the brief; schedule reviews; sign-off records per policy | NEW-26-01 |
| BG-02 | Engage chartered accountant: CoA, revenue-recognition policy, VAT position, gate items G1-G9; invoice template signed before live SSLCommerz | NEW-FIN-01 |
| BG-03 | Sign off helpdesk choice (Chatwoot Cloud vs self-host); workspace, domain mail routing, 2FA, agent accounts, labels, inbox per channel | NEW-SUP-01 |
| BG-04 | Start Meta Business verification, WhatsApp Cloud API number and templates, Messenger page connection (lead time weeks) | NEW-SUP-02 |
| BG-05 | Appoint safeguarding DSL and deputy; training pack, register, tabletop (counsel input) | NEW-SUP-23 |
| BG-06 | Law-enforcement request SOP approved and on-call lawyer named | NEW-SUP-24 |
| BG-07 | Approve AI calibration Phase A budget (BDT 0.74M) and name the Assessment lead | NEW-AIOPS-01 |
| BG-08 | Run Phase A rating programme: commission 470 items, rate and adjudicate (human QWK >= 0.80 per family) | NEW-AIOPS-10 |
| BG-09 | Submit footer/start/score layouts to ETS and check IELTS owners' trademark guidance | NEW-26-10 |
| BG-10 | Finalise creator/grader agreement templates with counsel (IP assignment, takedown warranty) | NEW-26-15 |
| BG-11 | Counsel sign-off packs: notification consent and SMS/WhatsApp rules; analytics consent tiers and pricing tests | NEW-NOTIF-28, NEW-ANL-16 |
| BG-12 | Founder DNS actions for email streams (SPF/DKIM/DMARC) and SMS sender-ID masking | NEW-NOTIF-12 |
| BG-13 | Business registration: trade licence, TIN, BIN, bank account; SSLCommerz live onboarding; Google OAuth brand verification | 24-§2 |
| BG-14 | Content readiness: >= 5 full mocks per exam at launch (10 by ~day 120, D10), beta gold set collected, Bangla editor and native legal-translator engaged | 16, 24-§2 |
| BG-15 | Phase B rating waves and accent expansion (post-launch) | NEW-AIOPS-27 |
| BG-16 | Founder/legal decisions on open flags: Chatwoot data-region and agent PII (S3), instalment default policy (L-07), support credit caps (S4) | 27-§21 |

### Sequencing notes

- P0-45, P0-46, P0-51 first (tooling before code), then P0-01 -> P0-04 serially; after P0-08, parallelise {auth chain P0-12..P0-24} with {design chain P0-26..P0-29} (disjoint `touch`).
- P1 critical path: P1-31/32/34 (money) and P1-11/12/13 (engine) gate everything user-visible; start them first. Next: the commerce-model extension (price schema -> price seed -> allowances) because 17 drives credits, mocks and meters for every later feature.
- P1.9-P1.12 are parallel streams (support/legal, AI learning, finance/analytics/messaging, AI-evaluation operations). Start the legal and finance engagement gates (BG-01, BG-02, BG-13) in week 1: lead times, not code, set M2.
- Content tasks (P1-45, P1-46, P0-33, help articles, macros, Bangla legal drafts, notification Bangla pass) run on Haiku any time their dependencies are ticked and are ideal for low-limit periods or Gemini sessions. Never publish legal text without counsel sign-off.
- P1-175 and P1-176 (P1.11) are post-launch streams; they do not gate P1-54.
- Do not start P2 before the P1-54 launch checklist is complete unless the founder explicitly reorders in PROGRESS.md.

## 12. Founder cheat sheet

| Want to | Do |
|---|---|
| Start a work session | Open Claude Code in repo, run `/next-task` |
| Check health | `/verify` |
| Switch to Gemini | `/handoff`, then paste Prompt 10 into Gemini |
| Come back to Claude | `/review` then `/resume` |
| Understand code | Prompt 12 in `docs/13-PROMPTS.md` |
| Decide a blocked item | Edit "Decisions needing the founder" in `docs/PROGRESS.md`, mark `ANSWER:` |

---

## Appendix: source NEW-* IDs to final IDs

Generated during the final consolidation (delivery lead). One final task may absorb several source tasks (merged); a source task may be absorbed into an existing task (extended: the existing row's title or acceptance was widened) or into a human-owned gate (`BG-xx`). Dedupe rule: one PR-sized deliverable, one ID. Unmapped source IDs: none (verified by script).

### Appendix A - docs/28 (Founder Setup And Environments)

| Source ID | Final ID | Final task (short title) | Note |
|---|---|---|---|
| NEW-ENV-01 | P0-52 | Solo-safe branch protection ruleset (0 required approvals while one human, re... | merged |
| NEW-ENV-02 | P0-51, P0-52 | mise + corepack pinning: `mise.toml`/`.tool-versions`, `.nvmrc`, `packageMana...; Solo-safe branch protection ruleset (0 required approvals while one human, re... | extends existing, merged |
| NEW-ENV-03 | P0-58 | Smoke scripts `tooling/scripts/smoke/*` + `pnpm smoke:*` and `smoke:all` (PAS... | direct |
| NEW-ENV-04 | P0-66 | Dev ergonomics: packages consumed from source (one `pnpm dev` process tree) a... | merged |
| NEW-ENV-05 | P0-65 | `RATE_LIMIT_BACKEND=postgres/redis` switch (fail closed only when backend rea... | direct |
| NEW-ENV-06 | P0-59 | Staging smoke job `smoke-staging.yml` after deploy; gates `db-migrate-prod.ym... | direct |
| NEW-ENV-07 | P0-57 | `env.ts` cross-field validation (DB_DRIVER vs host; SSLCZ_IS_LIVE iff product... | merged |
| NEW-ENV-08 | P0-66 | Dev ergonomics: packages consumed from source (one `pnpm dev` process tree) a... | merged |
| NEW-ENV-09 | P0-67 | Optional local stack: `docker-compose.yml` (postgres:17, mailpit, optional mi... | direct |
| NEW-ENV-10 | P0-57 | `env.ts` cross-field validation (DB_DRIVER vs host; SSLCZ_IS_LIVE iff product... | merged |
| NEW-ENV-11 | P0-56 | Founder-blockers lead-time reminders, `docs/ops/launch-evidence.md` skeleton... | merged |
| NEW-ENV-12 | P0-56 | Founder-blockers lead-time reminders, `docs/ops/launch-evidence.md` skeleton... | merged |

### Appendix B - docs/33 (I18N)

| Source ID | Final ID | Final task (short title) | Note |
|---|---|---|---|
| NEW-I18N-01 | P0-61 | i18n structure and routing: namespace-split `messages/<locale>/<ns>.json` + g... | merged |
| NEW-I18N-02 | P0-61 | i18n structure and routing: namespace-split `messages/<locale>/<ns>.json` + g... | merged |
| NEW-I18N-03 | P0-64 | Bangla glossary `i18n/glossary.csv` (~150 terms, locked/do_not_use) + transla... | merged |
| NEW-I18N-04 | P0-62 | Format module (numbers, money, dates, lists; explicit numberingSystem; `nfExa... | merged |
| NEW-I18N-05 | P0-62 | Format module (numbers, money, dates, lists; explicit numberingSystem; `nfExa... | merged |
| NEW-I18N-06 | P0-63 | `pnpm i18n:check` implementing R1-R13 + `i18n:sort`/`i18n:prune` + status fil... | direct |
| NEW-I18N-07 | P0-61 | i18n structure and routing: namespace-split `messages/<locale>/<ns>.json` + g... | merged |
| NEW-I18N-08 | P0-68 | i18n e2e suite: hreflang (R16), 320 px overflow sweep, `/bn` visual baselines... | merged |
| NEW-I18N-09 | P1-168 | SMS stack: segment calculator, template register with change control (CI bloc... | merged |
| NEW-I18N-10 | P0-42 | SEO base: metadata API, sitemap, robots, OG images, hreflang | extends existing |
| NEW-I18N-11 | P0-64 | Bangla glossary `i18n/glossary.csv` (~150 terms, locked/do_not_use) + transla... | merged |
| NEW-I18N-12 | P1-83 | Haiku batch translation runner `tooling/scripts/i18n-draft.ts` (glossary + tr... | direct |
| NEW-I18N-13 | P0-68 | i18n e2e suite: hreflang (R16), 320 px overflow sweep, `/bn` visual baselines... | merged |
| NEW-I18N-14 | P0-64 | Bangla glossary `i18n/glossary.csv` (~150 terms, locked/do_not_use) + transla... | merged |
| NEW-I18N-15 | P1-196 | AI feedback language policy: `evaluation_result.locale`, 'Explain in Bangla'... | direct |
| NEW-I18N-16 | P1-97 | Lesson localisation fields: course 'Instruction language' and 'Captions avail... | direct |
| NEW-I18N-17 | P2-62 | Tolgee/Weblate evaluation spike (1 day) at 2,500 strings or second translator | direct |

### Appendix C - docs/27 (Support)

| Source ID | Final ID | Final task (short title) | Note |
|---|---|---|---|
| NEW-SUP-01 | BG-03 | Sign off helpdesk choice (Chatwoot Cloud vs self-host); workspace, dom | human gate |
| NEW-SUP-02 | BG-04 | Start Meta Business verification, WhatsApp Cloud API number and templa | human gate |
| NEW-SUP-03 | P1-103 | Support/trust migration: `support_ticket`, `ticket_message`, `macro`, `csat_r... | direct |
| NEW-SUP-04 | P1-104 | Chatwoot Cloud integration (C29): identity HMAC, create-conversation API, sig... | merged |
| NEW-SUP-05 | P1-105 | SLA engine: BD business-hours calendar, due time by tier x priority, pause/re... | direct |
| NEW-SUP-06 | P1-106 | `/app/support` and guest `/contact` ticket form (Turnstile), ticket list/stat... | direct |
| NEW-SUP-07 | P1-107 | Support console (`/support/**`): masked lookup panel for Chatwoot, 'trace wat... | merged |
| NEW-SUP-08 | P1-64 | Exam-disruption handling (C30): 'I lost connection' self-serve void once per... | direct |
| NEW-SUP-09 | P1-191 | Dispute flow: result-page button, triage rules, free-limit logic, `ai_dispute... | merged |
| NEW-SUP-10 | P1-80 | `guarantee_claim` model + single eligibility evaluator (Target Promise on Plu... | merged |
| NEW-SUP-11 | P1-109, P2-19 | Trust and safety runbooks pack: moderation policy and FB/Discord runbook, enf...; In-app moderation tooling: `moderation_case`, `/admin/moderation` queue, auto... | merged |
| NEW-SUP-12 | P1-109, P1-110, P2-59 | Trust and safety runbooks pack: moderation policy and FB/Discord runbook, enf...; Piracy response tooling: minimal `enforcement_action` (warn/limit/suspend, no...; Enforcement ladder full: abuse-score tuning, user notices, appeals UI | merged |
| NEW-SUP-13 | P1-110 | Piracy response tooling: minimal `enforcement_action` (warn/limit/suspend, no... | merged |
| NEW-SUP-14 | P1-79 | Chargeback/dispute case tracker + evidence-pack export (access logs, watermar... | merged |
| NEW-SUP-15 | P1-76 | Fraud rules and review queue: checkout velocity and card-testing, refund-abus... | merged |
| NEW-SUP-16 | P1-112 | DSAR operations: helpdesk export/delete connector, 3-day ack / 30-day clock d... | merged |
| NEW-SUP-17 | P1-108 | Load the 30+5 support macros (en/bn) into `macro` and sync to Chatwoot; nativ... | direct |
| NEW-SUP-18 | P1-92 | Write and verify the help-article inventory (71 articles, en/bn) in the CMS | direct |
| NEW-SUP-19 | P1-113 | Status page (Better Stack): components, bilingual incident templates, in-app... | direct |
| NEW-SUP-20 | P1-114, P2-21 | CSAT 24 h after resolve: storage, webhook, dashboard; Quarterly NPS survey storage and dashboard | direct |
| NEW-SUP-21 | P1-115 | Support/Trust dashboards and weekly review template | direct |
| NEW-SUP-22 | P1-197 | Grader programme ops: qualification test, QWK-based probation, rate card, wor... | direct |
| NEW-SUP-23 | P1-109, BG-05 | Trust and safety runbooks pack: moderation policy and FB/Discord runbook, enf...; Appoint safeguarding DSL and deputy; training pack, register, tabletop | human gate, merged |
| NEW-SUP-24 | P1-109, BG-06 | Trust and safety runbooks pack: moderation policy and FB/Discord runbook, enf...; Law-enforcement request SOP approved and on-call lawyer named | human gate, merged |
| NEW-SUP-25 | P1-107 | Support console (`/support/**`): masked lookup panel for Chatwoot, 'trace wat... | merged |
| NEW-SUP-26 | P1-109 | Trust and safety runbooks pack: moderation policy and FB/Discord runbook, enf... | merged |
| NEW-SUP-27 | P1-65, P2-18 | Accommodations (C18): support-granted extra time 1.25x/1.5x/2.0x via ticket,...; Accommodation self-serve request form (C18 P2) with evidence upload and suppo... | direct |
| NEW-SUP-28 | P1-109, P1-111 | Trust and safety runbooks pack: moderation policy and FB/Discord runbook, enf...; Staff 2FA recovery: two-person reset flow and quarterly access-review report | merged |
| NEW-SUP-29 | P1-200 | Launch drills: payment-pending/no-access simulation, OTP failure, exam outage... | direct |
| NEW-SUP-30 | P2-60 | P2 gate review: native ticketing vs Chatwoot decision memo | direct |

### Appendix D - docs/26 (Legal)

| Source ID | Final ID | Final task (short title) | Note |
|---|---|---|---|
| NEW-26-01 | BG-01 | Engage counsel A/B/C and send 26 as the brief; schedule reviews; sign- | human gate |
| NEW-26-02 | P0-60 | `packages/config/legal.ts` (entity, addresses, role mailboxes, grievance offi... | direct |
| NEW-26-03 | P1-116 | Legal migration: `policy_version`, `cookie_consent_event`, `creator_agreement... | direct |
| NEW-26-04 | P1-117 | Acceptance-logging service + sign-up/checkout/exam-start/live hooks + re-acce... | direct |
| NEW-26-05 | P1-118 | Legal MDX pipeline: `/legal/*` routes (terms, privacy, refund, cookies, AI sc... | direct |
| NEW-26-06 | P1-119 | Consent management: cookie banner (equal-prominence buttons, bn/en, re-open l... | merged |
| NEW-26-07 | P1-120 | Bangla drafts of legal pages from counsel-approved English only; native legal... | direct |
| NEW-26-08 | P1-121 | `docs/processors.md` + public processors page + new-vendor checklist (helpdes... | direct |
| NEW-26-09 | P1-122 | DPIA (AI scoring, minors' voice, tab-switch logs, tutor/notebook) + transfer... | direct |
| NEW-26-10 | BG-09 | Submit footer/start/score layouts to ETS and check IELTS owners' trade | human gate |
| NEW-26-11 | P1-77 | Checkout consent UI: refund pre-check copy, intl waiver, SMS consent checkbox... | direct |
| NEW-26-12 | P1-123 | Copy lint for blocked phrases ('guaranteed band/score/admission', fake 'was'... | direct |
| NEW-26-13 | P1-124 | `/security` page, `security.txt` and renewal reminder | direct |
| NEW-26-14 | P1-125 | `/accessibility` statement (dated conformance) + accommodation request page +... | direct |
| NEW-26-15 | P1-156, BG-10 | Payee onboarding: `payee_profile`, encrypted details, creator/grader agreemen...; Finalise creator/grader agreement templates with counsel (IP assignmen | human gate, merged |
| NEW-26-16 | P1-110 | Piracy response tooling: minimal `enforcement_action` (warn/limit/suspend, no... | merged |
| NEW-26-17 | P1-54 | Launch checklist, status page content, go-live and business-readiness gates (... | extends existing |
| NEW-26-18 | P0-53 | Doc consistency sweep: apply 26 §19.6 X1-X13, 29 X1-X10, 32 Y1-Y7, 27 §21.2 a... | merged |
| NEW-26-19 | P0-54 | Apply requested cross-doc edits from 16, 30, 31, 33, 34 (FIN-31, AIOPS-26, AI... | merged |

### Appendix E - docs/29 (Notifications)

| Source ID | Final ID | Final task (short title) | Note |
|---|---|---|---|
| NEW-NOTIF-01 | P0-53 | Doc consistency sweep: apply 26 §19.6 X1-X13, 29 X1-X10, 32 Y1-Y7, 27 §21.2 a... | merged |
| NEW-NOTIF-02 | P0-69 | Typed notification catalogue `packages/core/src/notifications/catalogue.ts` +... | merged |
| NEW-NOTIF-03 | P0-69 | Typed notification catalogue `packages/core/src/notifications/catalogue.ts` +... | merged |
| NEW-NOTIF-04 | P1-164 | Notification dispatcher `notifications.dispatch` (decision order 29 §2.5) + l... | direct |
| NEW-NOTIF-05 | P1-165 | Auth and security templates N-AUTH-01..16 en/bn incl. plain text; Better Auth... | direct |
| NEW-NOTIF-06 | P1-166 | Preference centre `/app/settings/notifications`, one-click unsubscribe API, t... | direct |
| NEW-NOTIF-07 | P1-167 | Commerce templates N-COM (receipt, payment states, refund states, reconciliat... | merged |
| NEW-NOTIF-08 | P1-41 | Entitlement expiry reminders T-30/T-7/T-1 and expired notice (docs/29 scope;... | extends existing |
| NEW-NOTIF-09 | P1-167 | Commerce templates N-COM (receipt, payment states, refund states, reconciliat... | merged |
| NEW-NOTIF-10 | P1-168 | SMS stack: segment calculator, template register with change control (CI bloc... | merged |
| NEW-NOTIF-11 | P1-169 | Lifecycle engine: `lifecycle_enrolment` state machine, onboarding N-ONB-01..1... | merged |
| NEW-NOTIF-12 | P1-170, BG-12 | Deliverability: DNS for three streams, DMARC rollout, Postmaster Tools, warm-...; Founder DNS actions for email streams (SPF/DKIM/DMARC) and SMS sender- | human gate |
| NEW-NOTIF-13 | P1-171 | Evaluation/results templates N-EVL-01..11 (incl. rescore broadcast) and staff... | merged |
| NEW-NOTIF-14 | P1-172 | Privacy templates N-PRV-01..11 and job hooks (export ready, deletion schedule... | direct |
| NEW-NOTIF-15 | P1-173 | Learning nudges, weekly progress digest (facts builder, deterministic email f... | merged |
| NEW-NOTIF-16 | P1-173 | Learning nudges, weekly progress digest (facts builder, deterministic email f... | merged |
| NEW-NOTIF-17 | P1-169 | Lifecycle engine: `lifecycle_enrolment` state machine, onboarding N-ONB-01..1... | merged |
| NEW-NOTIF-18 | P1-168 | SMS stack: segment calculator, template register with change control (CI bloc... | merged |
| NEW-NOTIF-19 | P1-171 | Evaluation/results templates N-EVL-01..11 (incl. rescore broadcast) and staff... | merged |
| NEW-NOTIF-20 | P1-174 | Bangla copy pass for all T/S templates then P, glossary-driven, reviewer sign... | direct |
| NEW-NOTIF-21 | P1-104 | Chatwoot Cloud integration (C29): identity HMAC, create-conversation API, sig... | merged |
| NEW-NOTIF-22 | P1-100 | Live pilot ops tooling (D1): batch/session admin form, entitled-only join lin... | merged |
| NEW-NOTIF-23 | P2-22, P2-32 | bKash instalments (2-3 parts, Live/Mentor) with default grace then access pau...; Guardian, org and subscription notification templates and jobs | merged |
| NEW-NOTIF-24 | P2-55 | WhatsApp Business adapter, opt-in flow, template submission pack, STOP handli... | direct |
| NEW-NOTIF-25 | P2-54 | Web push (PWA): opt-in, quiet hours, 1 nudge/day, 410 cleanup, no PII in payl... | merged |
| NEW-NOTIF-26 | P2-56 | Template health dashboard and weekly report | direct |
| NEW-NOTIF-27 | P3-10 | Expo mobile app (learner features) against /api/v1 | extends existing |
| NEW-NOTIF-28 | BG-11 | Counsel sign-off packs: notification consent and SMS/WhatsApp rules; a | human gate |

### Appendix F - docs/32 (Analytics)

| Source ID | Final ID | Final task (short title) | Note |
|---|---|---|---|
| NEW-ANL-01 | P0-70 | Analytics foundation: typed event map + generated catalogue, `track()` server... | merged |
| NEW-ANL-02 | P0-70 | Analytics foundation: typed event map + generated catalogue, `track()` server... | merged |
| NEW-ANL-03 | P0-70 | Analytics foundation: typed event map + generated catalogue, `track()` server... | merged |
| NEW-ANL-04 | P1-158 | `analytics` schema + read-only role `analytics_ro` + KPI views (K-01.. per 32... | direct |
| NEW-ANL-05 | P1-119 | Consent management: cookie banner (equal-prominence buttons, bn/en, re-open l... | merged |
| NEW-ANL-06 | P1-44 | Analytics instrumentation: domain-event mappers and client events per docs/32... | extends existing |
| NEW-ANL-07 | P1-44 | Analytics instrumentation: domain-event mappers and client events per docs/32... | extends existing |
| NEW-ANL-08 | P1-24 | Free diagnostic test for guests with results gated behind sign-up | extends existing |
| NEW-ANL-09 | P1-163 | Launch dashboards 1-8 in PostHog/Metabase with definitions and owners + WBR t... | direct |
| NEW-ANL-10 | P1-159 | `marketing_spend` table + weekly CSV import page + CAC view | direct |
| NEW-ANL-11 | P1-160 | Nightly data tests and PostHog-vs-DB purchase reconciliation alert | direct |
| NEW-ANL-12 | P1-161 | Experiment framework: PostHog experiments, server-side flag evaluation helper... | merged |
| NEW-ANL-13 | P1-162 | Message analytics: `message_*` events from `notification_dispatch`/webhooks,... | direct |
| NEW-ANL-14 | P1-175 | Price-experiment engine: `price_lock`, `resolvePriceSet`, cache tags, strike-... | direct |
| NEW-ANL-15 | P1-176 | Pricing research kit: Van Westendorp survey (bn/en), analysis notebook/SQL, c... | direct |
| NEW-ANL-16 | BG-11 | Counsel sign-off packs: notification consent and SMS/WhatsApp rules; a | human gate |
| NEW-ANL-17 | P1-112 | DSAR operations: helpdesk export/delete connector, 3-day ack / 30-day clock d... | merged |
| NEW-ANL-18 | P1-188 | Production monitors (nightly canary, weekly PSI, `qa_sample`, `v_ai_agreement... | merged |
| NEW-ANL-19 | P1-193 | Equivalence tooling (paired bootstrap, non-inferiority) + shadow/canary score... | merged |
| NEW-ANL-20 | P1-100, P2-17 | Live pilot ops tooling (D1): batch/session admin form, entitled-only join lin...; Live attendance auto-tracking (Zoom participant webhooks, YouTube heartbeat),... | merged |
| NEW-ANL-21 | P1-104 | Chatwoot Cloud integration (C29): identity HMAC, create-conversation API, sig... | merged |
| NEW-ANL-22 | P2-33 | Org/B2B and guardian analytics (groups by `org_id_hash`, usage, report export... | direct |
| NEW-ANL-23 | P2-57 | Server-side ad conversions (Meta CAPI / Google) behind consent and flag | direct |
| NEW-ANL-24 | P2-58 | Warehouse stage S1: PostHog batch export to BigQuery (or R2/ClickHouse), dbt... | direct |
| NEW-ANL-25 | P1-161 | Experiment framework: PostHog experiments, server-side flag evaluation helper... | merged |
| NEW-ANL-26 | P0-53 | Doc consistency sweep: apply 26 §19.6 X1-X13, 29 X1-X10, 32 Y1-Y7, 27 §21.2 a... | merged |

### Appendix G - docs/30 (Finance)

| Source ID | Final ID | Final task (short title) | Note |
|---|---|---|---|
| NEW-FIN-01 | BG-02 | Engage chartered accountant: CoA, revenue-recognition policy, VAT posi | human gate |
| NEW-FIN-02 | P1-147 | Finance schema `finance.ts` (ledger_account, finance_period, ledger_journal/e... | merged |
| NEW-FIN-03 | P1-147 | Finance schema `finance.ts` (ledger_account, finance_period, ledger_journal/e... | merged |
| NEW-FIN-04 | P1-148 | Posting service: order paid, settlement, refund (contra/deferred reversal, cr... | merged |
| NEW-FIN-05 | P1-149 | `recogniseRevenue` and `recogniseConsumption` jobs + deferred roll-forward re... | direct |
| NEW-FIN-06 | P1-150 | T0 integrity checks C1-C9 + daily digest email + sign-off | direct |
| NEW-FIN-07 | P1-151 | Settlement upload/parse/match for SSLCommerz (parser profiles as config), ban... | merged |
| NEW-FIN-08 | P1-152 | Reconciliation item queue UI + resolution actions (fulfil, refund, suspense,... | direct |
| NEW-FIN-09 | P1-36 | Refunds + finance console (orders, refunds, revenue, VAT export) | extends existing |
| NEW-FIN-10 | P1-156 | Payee onboarding: `payee_profile`, encrypted details, creator/grader agreemen... | merged |
| NEW-FIN-11 | P1-157 | Payout statements (asset fees, 10% royalty on own course, grader/rater items)... | merged |
| NEW-FIN-12 | P1-157 | Payout statements (asset fees, 10% royalty on own course, grader/rater items)... | merged |
| NEW-FIN-13 | P1-148 | Posting service: order paid, settlement, refund (contra/deferred reversal, cr... | merged |
| NEW-FIN-14 | P1-79 | Chargeback/dispute case tracker + evidence-pack export (access logs, watermar... | merged |
| NEW-FIN-15 | P1-154 | Finance dashboards v1 (deferred revenue, billings vs revenue, payments health... | direct |
| NEW-FIN-16 | P1-153 | Month-end close workflow (checklist in `finance_period`) and period lock | direct |
| NEW-FIN-17 | P1-155 | Foreign flows: Paddle/Stripe payout import, `export_receipt` with 4-month ale... | merged |
| NEW-FIN-18 | P1-155 | Foreign flows: Paddle/Stripe payout import, `export_receipt` with 4-month ale... | merged |
| NEW-FIN-19 | P1-69 | Commerce-model schema extension (GA-001): `product_kind` += physical_book/ser... | direct |
| NEW-FIN-20 | P1-151 | Settlement upload/parse/match for SSLCommerz (parser profiles as config), ban... | merged |
| NEW-FIN-21 | P1-199 | Pre-launch finance dry run (gate G12): full month on sandbox data, accountant... | direct |
| NEW-FIN-22 | P2-27 | bKash/Nagad direct statement parsers and disbursement-API payouts (if eligibl... | direct |
| NEW-FIN-23 | P2-22 | bKash instalments (2-3 parts, Live/Mentor) with default grace then access pau... | merged |
| NEW-FIN-24 | P2-07 | Affiliate/referral tracking and payouts report | extends existing |
| NEW-FIN-25 | P2-23 | Scholarship workflow: application, evidence upload, need score, 50/75/100% aw... | direct |
| NEW-FIN-26 | P2-31 | B2B invoicing (BIN, PO, credit terms), seat refund rules, coaching-centre bul... | direct |
| NEW-FIN-27 | P2-28 | Breakage sweep for expired credits (after OQ-F1 decision) | direct |
| NEW-FIN-28 | P2-29 | Bank feed/API integration and accounting-software export format agreed with CA | direct |
| NEW-FIN-29 | P3-02 | Revenue-share ledger and payout runs | extends existing |
| NEW-FIN-30 | P1-80 | `guarantee_claim` model + single eligibility evaluator (Target Promise on Plu... | merged |
| NEW-FIN-31 | P0-54 | Apply requested cross-doc edits from 16, 30, 31, 33, 34 (FIN-31, AIOPS-26, AI... | merged |

### Appendix H - docs/31 (Ai Evaluation)

| Source ID | Final ID | Final task (short title) | Note |
|---|---|---|---|
| NEW-AIOPS-01 | BG-07 | Approve AI calibration Phase A budget (BDT 0.74M) and name the Assessm | human gate |
| NEW-AIOPS-02 | P0-71 | Rater programme packs: job ad, rater agreement/NDA/participant-consent templa... | merged |
| NEW-AIOPS-03 | P0-71 | Rater programme packs: job ad, rater agreement/NDA/participant-consent templa... | merged |
| NEW-AIOPS-04 | P1-178 | `ai-ops.ts` schema (rating_assignment, eval_run, model_release, ai_dispute..)... | direct |
| NEW-AIOPS-05 | P1-179 | Rating tool: assignment modes, blind enforcement, seeded anchors, workload ca... | direct |
| NEW-AIOPS-06 | P1-180 | Adjudication view, rater analytics (QWK, bias, speed) and payment-lines hook... | direct |
| NEW-AIOPS-07 | P1-181 | Streamed audio player with watermark, no download and word-level transcript h... | direct |
| NEW-AIOPS-08 | P1-182 | Research-use consent: `research_use` kind, en/bn copy, withdrawal flow, minor... | direct |
| NEW-AIOPS-09 | P1-183 | Gold-set ingestion: commissioned collection form, redaction pipeline, dedup,... | direct |
| NEW-AIOPS-10 | BG-08 | Run Phase A rating programme: commission 470 items, rate and adjudicat | human gate |
| NEW-AIOPS-11 | P1-184 | Harness v2 on P1-28: MAE, within-0.5, exact, QWK, bias, bootstrap CIs, subgro... | direct |
| NEW-AIOPS-12 | P1-185 | Safety/injection, Bangla/Banglish, length and template suites | direct |
| NEW-AIOPS-13 | P1-186 | Calibration map fit and versioning per (model, family), dev-only enforcement | direct |
| NEW-AIOPS-14 | P1-187 | Model registry (`model_release`), pin flags, rollback command, live uniqueness | direct |
| NEW-AIOPS-15 | P1-188 | Production monitors (nightly canary, weekly PSI, `qa_sample`, `v_ai_agreement... | merged |
| NEW-AIOPS-16 | P1-188 | Production monitors (nightly canary, weekly PSI, `qa_sample`, `v_ai_agreement... | merged |
| NEW-AIOPS-17 | P1-188 | Production monitors (nightly canary, weekly PSI, `qa_sample`, `v_ai_agreement... | merged |
| NEW-AIOPS-18 | P1-189 | Beta presentation: badge, widened range, copy, per-family flag; beta gate che... | direct |
| NEW-AIOPS-19 | P1-190 | `/accuracy` methodology page generated from `eval_run` JSON + claims register | direct |
| NEW-AIOPS-20 | P1-191 | Dispute flow: result-page button, triage rules, free-limit logic, `ai_dispute... | merged |
| NEW-AIOPS-21 | P1-192 | AI cost controls: `pricing.ts` with CI recompute test, per-user/global caps,... | merged |
| NEW-AIOPS-22 | P1-192 | AI cost controls: `pricing.ts` with CI recompute test, per-user/global caps,... | merged |
| NEW-AIOPS-23 | P1-193 | Equivalence tooling (paired bootstrap, non-inferiority) + shadow/canary score... | merged |
| NEW-AIOPS-24 | P1-194 | Gemini fallback qualification: own gate run, queue-and-retry until passed, mo... | direct |
| NEW-AIOPS-25 | P1-195 | Retention jobs: speaking audio 90 days (C6) with consented extension, audit p... | direct |
| NEW-AIOPS-26 | P0-54 | Apply requested cross-doc edits from 16, 30, 31, 33, 34 (FIN-31, AIOPS-26, AI... | merged |
| NEW-AIOPS-27 | BG-15 | Phase B rating waves and accent expansion (post-launch) | human gate |
| NEW-AIOPS-28 | P2-61 | Remove Beta per family via CI rule once Phase B gates pass; publish update; g... | merged |
| NEW-AIOPS-29 | P2-61 | Remove Beta per family via CI rule once Phase B gates pass; publish update; g... | merged |
| NEW-AIOPS-30 | P2-15 | Optional pronunciation scoring (Azure Pronunciation Assessment) | extends existing |
| NEW-AIOPS-31 | P3-22 | Yearly locked-test refresh job, rater re-certification and prompt retirement | direct |

### Appendix I - docs/34 (Ai Learning)

| Source ID | Final ID | Final task (short title) | Note |
|---|---|---|---|
| NEW-AI-01 | P1-131 | pgvector + `content_chunk` + HNSW + fk-index CI checks, embedding adapter, Ba... | merged |
| NEW-AI-02 | P1-131 | pgvector + `content_chunk` + HNSW + fk-index CI checks, embedding adapter, Ba... | merged |
| NEW-AI-03 | P1-132 | Chunker and `rag.reindex` Inngest job on `content.published` (video windows w... | direct |
| NEW-AI-04 | P1-133 | Ask Lumen tutor service (`packages/core/src/tutor`): entitlement-filtered ret... | merged |
| NEW-AI-05 | P1-134 | `/api/tutor/stream` SSE route, daily fair-use meters (`ai_fair_use_counter`),... | merged |
| NEW-AI-06 | P1-133 | Ask Lumen tutor service (`packages/core/src/tutor`): entitlement-filtered ret... | merged |
| NEW-AI-07 | P1-135 | Tutor UI: lesson side panel, `/app/ask`, citation chips deep-linking to times... | direct |
| NEW-AI-08 | P1-136 | `pnpm eval:tutor` harness: groundedness, injection (>= 150), exam-leak refusa... | direct |
| NEW-AI-09 | P1-134 | `/api/tutor/stream` SSE route, daily fair-use meters (`ai_fair_use_counter`),... | merged |
| NEW-AI-10 | P1-128 | FSRS scheduler package shared client/server (`ts-fsrs`, licence re-verified)... | merged |
| NEW-AI-11 | P1-127 | SRS tables `srs_deck`, `srs_card`, `srs_user_card`, `srs_review_log`, `srs_us... | direct |
| NEW-AI-12 | P1-128 | FSRS scheduler package shared client/server (`ts-fsrs`, licence re-verified)... | merged |
| NEW-AI-13 | P1-129 | Vocabulary review UI `/app/vocab` (F-VOC): modes, interval buttons, keyboard,... | direct |
| NEW-AI-14 | P1-130 | Deck audio pipeline (TTS at authoring, R2 cache, IPA/audio QA checklist) | direct |
| NEW-AI-15 | P1-98 | PWA + data saver: manifest, service worker (scope excludes `/exam` and `/api`... | merged |
| NEW-AI-16 | P2-46 | Auto-card drafting (Haiku) + editor approval queue + leech mnemonic suggestio... | direct |
| NEW-AI-17 | P2-47 | FSRS parameter optimiser Inngest job with guardrails (>= 1,000 reviews) | direct |
| NEW-AI-20 | P1-137 | `score_prediction` + `official_score_report` tables and snapshot writer (<= 1... | direct |
| NEW-AI-21 | P1-138 | Weighted-EAP estimator reusing `eapTheta`, L/R band mapping via `score_conver... | merged |
| NEW-AI-22 | P1-138 | Weighted-EAP estimator reusing `eapTheta`, L/R band mapping via `score_conver... | merged |
| NEW-AI-23 | P1-139 | Estimate UI (`/app/progress/estimate`): range, confidence badge, drivers, lab... | direct |
| NEW-AI-24 | P2-48 | AI narration + numeric validator + fallback for reports and estimates; guardi... | merged |
| NEW-AI-25 | P2-49 | Post-exam report capture, TRF upload and verification queue, calibration jobs... | merged |
| NEW-AI-26 | P2-49 | Post-exam report capture, TRF upload and verification queue, calibration jobs... | merged |
| NEW-AI-30 | P1-140 | `study_asset` + `study_asset_progress` tables, `/editor/study-assets` review... | direct |
| NEW-AI-31 | P1-141 | Study-asset generator pipeline (Sonnet batch) + grounding checker + verifier... | direct |
| NEW-AI-32 | P1-142 | Lesson quiz player (Got it / Missed it, retry missed, mistake-notebook feed) | direct |
| NEW-AI-33 | P1-143 | Study guide/FAQ renderer + watermarked PDF export | direct |
| NEW-AI-34 | P1-144 | TTS vendor spike: EN + BN quality, SSML lexicon, licence-clause capture, cost... | direct |
| NEW-AI-35 | P2-50 | Audio Overviews: pipeline (script, verify, TTS, loudness, VTT/chapters, R2) w... | merged |
| NEW-AI-36 | P2-50 | Audio Overviews: pipeline (script, verify, TTS, loudness, VTT/chapters, R2) w... | merged |
| NEW-AI-37 | P2-51 | Bangla audio set (native script, back-translation verifier, BN editor sign-of... | merged |
| NEW-AI-38 | P2-51 | Bangla audio set (native script, back-translation verifier, BN editor sign-of... | merged |
| NEW-AI-39 | P2-52 | 'Pause and ask' bridge from player to Ask Lumen with chapter context | direct |
| NEW-AI-40 | P2-53 | My notebook: tables, upload scanning, text-layer ingest, per-user index, dele... | merged |
| NEW-AI-41 | P2-53 | My notebook: tables, upload scanning, text-layer ingest, per-user index, dele... | merged |
| NEW-AI-42 | P3-20 | Visual overview feasibility memo with cost | direct |
| NEW-AI-50 | P1-145 | Writing/Speaking Coach UX on stored evaluations: highlight renderer with offs... | merged |
| NEW-AI-51 | P1-145, P2-37 | Writing/Speaking Coach UX on stored evaluations: highlight renderer with offs...; Paraphrase trainer and extra rewrites (`coach_action` meter, `copied_words_ra... | merged |
| NEW-AI-52 | P1-145 | Writing/Speaking Coach UX on stored evaluations: highlight renderer with offs... | merged |
| NEW-AI-53 | P2-37 | Paraphrase trainer and extra rewrites (`coach_action` meter, `copied_words_ra... | merged |
| NEW-AI-54 | P2-36 | Pronunciation drills v1 (Deepgram proxy) then v2 (Azure PA) with Bangla-speak... | direct |
| NEW-AI-55 | P2-38 | Speaking partner (turn-based): session service, STT/LLM/TTS loop, summary, 'S... | direct |
| NEW-AI-56 | P3-19 | Duplex speaking-partner spike (token minting, streaming STT/LLM/TTS, host cho... | direct |
| NEW-AI-57 | P0-54 | Apply requested cross-doc edits from 16, 30, 31, 33, 34 (FIN-31, AIOPS-26, AI... | merged |
| NEW-AI-60 | P2-20 | Plan-edit chat: constraint-parse prompt + zod + diff UI; adaptive reschedulin... | direct |
| NEW-AI-61 | P1-86 | Next-best-action hero from the rule table with 'Why this?' disclosure (true t... | direct |
| NEW-AI-62 | P1-173 | Learning nudges, weekly progress digest (facts builder, deterministic email f... | merged |
| NEW-AI-63 | P2-48 | AI narration + numeric validator + fallback for reports and estimates; guardi... | merged |
| NEW-AI-64 | P2-10 | Guardian linking (student consent) + read-only parent view + pay-for-student | extends existing |
| NEW-AI-65 | P3-21 | NBA ML-ranker prerequisites: impression logging, holdout, offline replay (ana... | direct |
| NEW-AI-70 | P1-75 | 7-day Plus trial (no card): `trial_grant`, entitlement `source='trial'`, bonu... | merged |
| NEW-AI-71 | P1-75 | 7-day Plus trial (no card): `trial_grant`, entitlement `source='trial'`, bonu... | merged |
| NEW-AI-72 | P1-76 | Fraud rules and review queue: checkout velocity and card-testing, refund-abus... | merged |
| NEW-AI-73 | P1-78 | Self-serve 7-day refund (C13b/C28): eligibility service (max of lessons %, cr... | direct |
| NEW-AI-74 | P1-93 | `/guarantee` marketing page (en/bn) with scenarios, conditions one tap away a... | direct |
| NEW-AI-75 | P1-80 | `guarantee_claim` model + single eligibility evaluator (Target Promise on Plu... | merged |
| NEW-AI-76 | P1-81 | Guarantee claim flow: official TRF upload (private, deleted at 30 days), revi... | direct |
| NEW-AI-77 | P2-30 | Refund and claim dashboards (finance + admin) with alert at refund rate > 12% | direct |
| NEW-AI-80 | P1-98 | PWA + data saver: manifest, service worker (scope excludes `/exam` and `/api`... | merged |
| NEW-AI-81 | P2-50 | Audio Overviews: pipeline (script, verify, TTS, loudness, VTT/chapters, R2) w... | merged |
| NEW-AI-82 | P2-54 | Web push (PWA): opt-in, quiet hours, 1 nudge/day, 410 cleanup, no PII in payl... | merged |
| NEW-AI-83 | P3-10 | Expo mobile app (learner features) against /api/v1 | extends existing |
| NEW-AI-90 | P1-192 | AI cost controls: `pricing.ts` with CI recompute test, per-user/global caps,... | merged |
| NEW-AI-91 | P1-188 | Production monitors (nightly canary, weekly PSI, `qa_sample`, `v_ai_agreement... | merged |
| NEW-AI-92 | P1-90 | Feature-flag admin UI `/admin/feature-flags` over `feature_flag` + seed regis... | direct |
| NEW-AI-93 | P0-54 | Apply requested cross-doc edits from 16, 30, 31, 33, 34 (FIN-31, AIOPS-26, AI... | merged |

### Appendix J - Tasks implied by other docs (16, 17, 18, 21, 24, 25, 00)

| Origin | Final ID(s) | Task (short title) |
|---|---|---|
| GA-004 | P0-55 | Traceability checks: `tooling/trace.ts` (every P1 feature ID in 03 has a back... |
| 16-R5 | P1-57 | Per-user PDF stamping job for downloadable resources (buyer email + order id... |
| 16-R1 | P1-58 | `content_provenance` table + Studio provenance panel + publish gate (no prove... |
| 16-R3, 16-§10 | P1-59 | `ImportBundleV2` (with provenance), CSV templates, local `tooling/validate-im... |
| 16-R4 | P1-60 | Studio audio QA: LUFS, true peak (-1 dBTP), noise floor (< -60 dBFS), clippin... |
| GA-004, 16-R2 | P1-61 | Test-form builder/assembler + `assertPublishable` UI + unscored pilot (field-... |
| 16-§4 | P1-62 | Content drafting pipeline scripts `tooling/content/` (spec -> Batch-API draft... |
| GA-004 | P1-63 | Error reports from learners (F-ERR-01..03) + editor inbox `/editor/reports` |
| GA-004 | P1-65 | Accommodations (C18): support-granted extra time 1.25x/1.5x/2.0x via ticket,... |
| GA-004 | P1-66 | Practice sessions `/app/practice`: custom quiz builder, session player (pract... |
| GA-004 | P1-67 | Mistake notebook `/app/mistakes` fed by attempts and lesson quizzes (states O... |
| GA-004 | P1-68 | Item statistics and retirement job (07 §8.6): p-values, discrimination, expos... |
| GA-001 | P1-69 | Commerce-model schema extension (GA-001): `product_kind` += physical_book/ser... |
| 17-§13 | P1-70 | Price-book seed loader: parse the 17 §13 `SEED` YAML block into idempotent up... |
| 17-§1, D10, C16 | P1-71 | Regional price resolution (billing country via MoR, IP as hint only; BD alway... |
| 17-§2.2 | P1-72 | Tier allowances to entitlements: `ai_credit` grants per product (Core 10, Plu... |
| D5, 17 | P1-73 | `human_review_credits` counters (essay reviews, speaking mocks, 1:1 sessions;... |
| D10, 17-§8 | P1-74 | Admin manual entitlement grant (scholarship / partner / pilot cohort) with re... |
| - | P1-82 | P1.1-P1.6 exit review: learning delivery, bank, engine, runners, AI evaluatio... |
| GA-004 | P1-84 | Onboarding wizard at `/onboarding` (goal, exam date, target, level, under-18... |
| GA-004, C5 | P1-85 | Generated read-only study plan from onboarding + diagnostic (C5) at `/app/pla... |
| GA-004 | P1-87 | In-app notification inbox/bell UI over `notification` table |
| GA-004 | P1-88 | Reviews and ratings (F-REV) with moderation hooks |
| GA-004, C4, C11 | P1-89 | Certificates (C4): PDF generation and public `/verify/[code]` page (>= 128-bi... |
| GA-004 | P1-90 | Feature-flag admin UI `/admin/feature-flags` over `feature_flag` + seed regis... |
| GA-004 | P1-91 | Help centre CMS (`/help`): articles, categories, error-code to article map wi... |
| GA-004 | P1-94 | `/tools/*` public calculators (band/raw converters, GRE score tools) with 'es... |
| D11 | P1-95 | Free 'Which test do I need?' quiz (IELTS Academic/GT/Life Skills, PTE, DET, T... |
| D1, D11 | P1-96 | English Foundation track (A0 to B1, Bangla-medium) course skeleton, micro-pri... |
| GA-035 | P1-98 | PWA + data saver: manifest, service worker (scope excludes `/exam` and `/api`... |
| 16-R7 | P1-99 | Brand kit export: slide-deck theme tokens (Slides/Figma) and print stylesheet... |
| 18-§8.3 | P1-100 | Live pilot ops tooling (D1): batch/session admin form, entitled-only join lin... |
| 18-§5 | P1-101 | Zoom `recording.completed` webhook -> Inngest -> Bunny (token-auth, watermark... |
| - | P1-102 | P1.7 exit review: dashboards, learner features, comms and content streams mee... |
| - | P1-126 | P1.9 exit review: support, trust and legal operations (incl. sign-off records... |
| GA-004 | P1-129 | Vocabulary review UI `/app/vocab` (F-VOC): modes, interval buttons, keyboard,... |
| - | P1-146 | P1.10 exit review: AI learning features meet cost, grounding and labelling ga... |
| - | P1-177 | P1.11 exit review: finance, analytics and messaging readiness (accountant gat... |
| - | P1-198 | P1.12 exit review: AI evaluation operations (gold set, calibration, monitors,... |
| 18-§5.6 | P2-17 | Live attendance auto-tracking (Zoom participant webhooks, YouTube heartbeat),... |
| 17-§8 | P2-23 | Scholarship workflow: application, evidence upload, need score, 50/75/100% aw... |
| 17-§8 | P2-24 | Partner codes (UDC, NGO, TTC, university): partner dashboard, allow-listed pr... |
| C24 | P2-25 | Multi-item `/cart` and bundle checkout (C24) |
| 17-§6 | P2-26 | Physical books and COD: `physical_book` products, address book, Steadfast cou... |
| GA-030 | P2-31 | B2B invoicing (BIN, PO, credit terms), seat refund rules, coaching-centre bul... |
| D1 | P2-34 | IELTS Life Skills A1/B1 module (config + content skeleton) on the exam-agnost... |
| D1, 17-§9 | P2-35 | Spoken English track (course skeleton, AI conversation practice) incl. workpl... |
| 21-§6.3 | P2-39 | Admissions schema per 21 §6.3 (admissions_plan, college + requirements, colle... |
| 21-§3.2 | P2-40 | College data curation tool and ~150 verified colleges seed with `verified_at`... |
| 21-§6.5 | P2-41 | Deadline and document tracker, activities builder and recommender tracker wit... |
| 21-§3.3, 21-§6.6 | P2-42 | Essay workspace with AI feedback (feedback only, never writing) and integrity... |
| 21-§3.5 | P2-43 | Scholarship finder (8 starter scholarships) and admissions dashboard widgets... |
| 21-§8 | P2-44 | P2b: UCAS question feedback, Germany/Canada/Australia checklists, SOP/CV revi... |
| D4, 21-§6.1 | P2-45 | `counsellor` role surface: `(counsellor)` routes, assigned-student policy in... |
| D1 | P3-14 | TOEFL iBT 2026 module and course packaging |
| D1, D11 | P3-15 | Work-Abroad language tracks: Korean EPS-TOPIK and Japanese JFT-Basic |
| D1 | P3-16 | Optional OET / SAT / GMAT prep modules (go/no-go memo first) |
| C4 | P3-17 | Open Badges 3.0 and LinkedIn deep-link polish for certificates |
| 16-§10.4 | P3-18 | QTI 3.0 export of the question bank (exporter only, pure function) |
| 21-§8 | P3-23 | Counsellor tier: session packages, session notes, counsellor assignment |
| 21-§3.6 | P3-24 | AI interview and visa-interview prep |
| 21-§8 | P3-25 | B2B school dashboards for admissions (org) |

Admissions (21 §8 phase plan) maps to the P2.6 and P3.5 sections; Zoom pilot ops (18 §8.3) to P1-100/P1-101 in P1.7 and in-app live to P2-01/P2-02/P2.1; price book, regional pricing, tier allowances, instalments, scholarships, partner codes and books/COD (17) to P1.6 and P2.3; the 14 GA-004 features with no task are P1.2-P1.10 rows tagged `GA-004` above.

### Appendix K - Business readiness gates

See the table after P3 in section 11. Source mapping: BG-01 <- NEW-26-01; BG-02 <- NEW-FIN-01; BG-03 <- NEW-SUP-01; BG-04 <- NEW-SUP-02; BG-05 <- NEW-SUP-23; BG-06 <- NEW-SUP-24; BG-07 <- NEW-AIOPS-01; BG-08 <- NEW-AIOPS-10; BG-09 <- NEW-26-10; BG-10 <- NEW-26-15; BG-11 <- NEW-NOTIF-28, NEW-ANL-16; BG-12 <- NEW-NOTIF-12; BG-13 <- 24-§2; BG-14 <- 16, 24-§2; BG-15 <- NEW-AIOPS-27; BG-16 <- 27-§21.

### Appendix L - Milestone gates (docs/24)

| Gate | Meaning | Target (realistic) | Gate-defining tasks | Tasks first needed (closure) |
|---|---|---|---|---|
| M0 | Clickable prototype | Fri 27 Nov 2026 (earliest 20 Nov) | P0-16, P0-17, P0-30, P0-35, P0-28, P1-16, P1-26 | 35 |
| M1 | Internal alpha | Fri 8 Jan 2027 (earliest 18 Dec) | P1-37, P1-15, P1-18, P1-23, P1-27, P1-09, P1-32, P1-33, P1-39, P1-30 (M1 also requires all P0) | 64 |
| M2 | Closed pilot | Mon 1 Mar 2027 (earliest 1 Feb) | P1-36, P1-35, P1-24, P1-41, P1-42, P1-53, P1-52, P1-118, P1-119, P1-104, P1-105, P1-106, P1-107, P1-72, P1-71, P1-75, P1-167, P1-165, P1-166, P1-100, P1-101, P1-189, P1-64, P1-92, P1-113, P1-70, P1-61 | 38 |
| M3 | Public launch (P1 complete) | Mon 3 May 2027 (earliest 1 Apr) | P1-54 | 132 |
| M4 | P2 Growth | Sep 2027 | P2 tasks | 62 |
| M5 | P3 Expansion | Q2 2028 | P3 tasks | 25 |
| post-M3 | P1 post-launch streams (P1-175, P1-176) | with first price test (about April 2027) | - | 2 |

### Appendix M - Counts and verification

| Phase | Existing | New | Total |
|---|---:|---:|---:|
| P0 | 51 | 20 | 71 |
| P1 | 56 | 144 | 200 |
| P2 | 16 | 46 | 62 |
| P3 | 13 | 12 | 25 |
| **All** | 136 | 222 | 358 |

Owner mix: haiku 30, opus 35, sonnet 293. Source `NEW-*` tasks mapped: 261 of 261. Verified at consolidation by script (and enforced from P0 by task P0-55: `tooling/backlog-check.ts`): parse the `| P?-NN |` rows of section 11 and the `- [ ] P?-NN` lines of `docs/PROGRESS.md`; the ID lists must be identical and in the same order, every `depends on` ID must exist and the graph must be acyclic.
