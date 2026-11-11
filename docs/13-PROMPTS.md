# 13 — Prompt Library (copy-paste)

> Conforms to `docs/00-DECISIONS.md` and `docs/12-BUILD-PLAN-AGENTS.md`. Placeholders in `<angle brackets>`. Every prompt forbids scope creep and demands verification output. Claude Code users can run the slash-command equivalents (`.claude/commands/`); Gemini users paste the prompts.
> Shortcuts: 1 kickoff · 2 next task · 3 dispatch · 4 self-review · 5 Opus diff review · 6 security review · 7 UI polish · 8 bug fix · 9 handoff to Gemini · 10 Gemini resume · 11 Claude returns · 12 explain to founder · 13 checkpoint (any tool) · 14 cross-check review (Gemini reviews Claude) · 15 spec-only test writer. Process detail: `docs/22-ENGINEERING-GUARDRAILS.md`.

## 1. Session kickoff (Claude, lead / Opus)

```text
You are the LEAD (Opus) for the Lumen Academy build. Do not write bulk feature code; plan, write task cards, dispatch subagents, review diffs.

Read, in this order and nothing else yet:
1. CLAUDE.md (already loaded)
2. docs/00-DECISIONS.md (fully) - single source of truth; never contradict it
3. docs/12-BUILD-PLAN-AGENTS.md sections 2-5 and 7 (routing, token rules, task card, loop, Definition of Done)
4. docs/PROGRESS.md

Then reply in <=120 words: current phase, first unblocked task ID, which subagent will own it, and any item in "Decisions needing the founder" that blocks it.
Rules: no code changes yet; no new dependencies; no tasks outside docs/PROGRESS.md; ask me only if a decision is missing from 00-DECISIONS.md.
```

## 2. "Next task" prompt (lead)

```text
Run the loop in docs/12-BUILD-PLAN-AGENTS.md section 5.
1. Read docs/PROGRESS.md. Pick the FIRST unchecked task whose depends_on are all ticked. If "Current task" is already filled, continue that one instead.
2. Read only the doc sections it needs (use `grep -n "^#" <file>` then a line range). Never cat whole docs.
3. Write the full task card (id, title, phase, owner_model, depends_on, read, touch, do, acceptance, verify, out_of_scope) into "Current task" in docs/PROGRESS.md. Acceptance criteria must each be testable. If information is missing, add a row to "Decisions needing the founder" and stop.
4. Create branch task/<ID>-<slug>.
5. Dispatch the subagent named in docs/12 section 2 using the template in docs/13-PROMPTS.md section 3.
6. When it returns, review per section 5 step 7 (Opus architect-reviewer if the touch list hits a security-critical path), commit with a conventional message, tick PROGRESS.md.
Forbidden: working on more than one task, editing files outside the card's touch list, skipping `pnpm verify`.
Report: task ID, summary <=100 words, last 15 lines of verify output, next task ID.
```

## 3. Subagent dispatch template (lead -> subagent)

```text
Use the <subagent-name> subagent.

TASK CARD
id: <ID>
title: <title>
phase: <P0..P3>
read: <exact doc sections, e.g. docs/00-DECISIONS.md#D6 ; docs/07-TEST-ENGINE.md#Attempt lifecycle>
touch: <globs - the ONLY files you may create or modify>
do:
  - <step 1>
  - <step 2>
acceptance:
  - <testable criterion 1>
  - <testable criterion 2>
verify: pnpm verify  (+ <extra command if any>)
out_of_scope: <explicit list>

INSTRUCTIONS
- Read only the sections in `read`. Do not explore the repo beyond `touch` and direct imports.
- Write tests first for logic; implement; run `pnpm verify`; fix until green (max 3 attempts, then stop and report the failure tail).
- Do not add dependencies, change config, or edit files outside `touch`. If the card is ambiguous or blocked, return a QUESTION instead of guessing.
- Run the self-check checklist(s) for your area from docs/12 section 6.
RETURN FORMAT (strict):
1) Summary <=150 words  2) Files changed (list)  3) Last 15 lines of `pnpm verify`  4) Checklist result: "passed" or the failed items  5) Open questions / follow-up tasks
```

## 4. Self-review prompt (subagent, before reporting)

```text
Before you report, review your own diff: `git diff --stat` then `git diff` for files you changed (do not re-read files in full).
Check each and fix what fails:
1. Every acceptance criterion in the card has a test or command output - list them.
2. Only files in `touch` changed (`git diff --name-only`).
3. No `any`, no unexplained `@ts-ignore`/`!`, no TODO without task ID, no console.log, no commented-out code.
4. zod validation at every boundary; authorization via assertCan in packages/core with allow+deny tests; no secrets; `server-only` on server modules.
5. Money in minor units; timers/prices/scores computed server-side.
6. UI: states (empty/loading/error), keyboard, a11y, tokens only, en + bn keys.
7. Relevant checklist in docs/12 section 6.1-6.4.
Run `pnpm verify` again after fixes. Report using the strict return format. If anything remains unfixed, say so plainly - never claim green without output.
```

## 5. Opus diff-review prompt (architect-reviewer)

```text
Use the architect-reviewer subagent (Opus). Review task <ID> on branch <branch>.
Inputs: docs/00-DECISIONS.md (D2,D4,D6,D7), the task card in docs/PROGRESS.md, and `git diff main...HEAD` (start with --stat; read full diffs only for security-critical paths listed in docs/12 section 2.1).
Judge, in order: (1) correctness vs acceptance criteria; (2) authorization & tenant/ownership checks in packages/core; (3) server-authoritative rules (price, deadline, score, entitlement); (4) webhook/idempotency/race conditions; (5) schema/migration safety; (6) boundary validation and error handling; (7) module boundaries (domains talk through index.ts only; no React/Next in packages/core); (8) test quality (would the tests fail if the code were wrong?); (9) scope creep.
Output: VERDICT approve | changes-required; blocking findings as `file:line - problem - fix`; non-blocking notes (<=5). <=250 words total. Do not edit code. Do not re-run the full suite unless a finding depends on it; run `pnpm verify` once if not already shown.
```

## 6. Security review prompt (security-auditor, escalating to Opus)

```text
Use the security-auditor subagent on <diff range | path>. Read-only.
Baseline: docs/00-DECISIONS.md D7, docs/09-SECURITY-AUTH-COMPLIANCE.md (sections matching the area), and docs/12 section 6.2.
Hunt for: broken access control/IDOR, missing assertCan, trust of client time/price/score, webhook forgery/replay, SSRF in fetches, unsafe uploads, XSS (dangerouslySetInnerHTML, Tiptap render), CSRF/open redirect, injection (SQL, prompt injection into LLM graders), secrets in code/logs/client bundle, weak rate limits/OTP flow, user enumeration, insecure cookies/session lifetimes, PII in logs/analytics, risky or unpinned dependencies.
For each finding: severity (critical/high/medium/low), `file:line`, exploit in one sentence, minimal fix. Cite the checklist item.
Escalate every high/critical to the architect-reviewer subagent for a verdict. <=300 words. No code edits. If nothing found, say what you checked.
```

## 7. UI polish pass prompt (ui-polisher)

```text
Use the ui-polisher subagent on <routes/components>. Goal: remove the "vibe-coded" look WITHOUT changing behaviour or data logic.
Read: docs/00-DECISIONS.md#D8, docs/08-UI-UX-DESIGN-SYSTEM.md (tokens, components, the page inventory entry for these pages), docs/12 section 6.1.
Do: audit against every item of checklist 6.1 using the running app at 360/768/1024/1440 px in light+dark and en+bn (Playwright screenshots saved under /tmp, not committed). Fix spacing, hierarchy, states (empty/loading/error), focus rings, motion, copy, contrast. Use only tokens and packages/ui components; add a token/component only if the design doc lacks it (then update that doc via docs-scribe note).
Forbidden: new dependencies, new colours, gradients, emoji icons, layout rewrites beyond the listed files, API or schema changes.
Verify: `pnpm verify` + `pnpm test:e2e -g <flow>` + axe 0 serious/critical.
Return: <=150-word summary, before/after bullets per page, files changed, verify tail, checklist result.
```

## 8. Bug-fix prompt (reproduce -> failing test -> fix)

```text
Use the qa-engineer subagent first, then the owning engineer subagent.
Bug: <observed vs expected; URL/steps; env; error text>.
Steps (do not skip or reorder):
1. REPRODUCE: find the smallest reproduction (script, unit test, or Playwright). Report the exact failing output. If it cannot be reproduced in 2 attempts, stop and return what you tried.
2. FAILING TEST: add a test that fails for the right reason; run it and paste the failure.
3. ROOT CAUSE: one paragraph; identify the layer (validation, authz, query, race, UI state). Read only the files in the stack trace and their direct imports.
4. FIX: smallest change. No refactors, renames or drive-by cleanups. Touch only files needed; list them.
5. VERIFY: the new test passes; `pnpm verify` green; run adjacent tests of the module.
6. If the bug touches a security-critical path (docs/12 section 2.1) request architect-reviewer review before commit.
Commit: `fix(<scope>): <summary> (<task or issue ID>)`. Return: summary <=150 words, failing->passing evidence, files changed, verify tail. If no task ID exists, add one under "Parking lot" in docs/PROGRESS.md and tell the lead.
```

## 9. Handoff-to-Gemini prompt (Claude, when limits approach)

```text
Prepare a handoff to Gemini now. Do not start new work.
1. Finish or revert the current atomic step; commit WIP as `wip(<scope>): <what> (<ID>) [handoff]`; working tree must be clean (`git status --short` empty); push the branch.
2. Update docs/PROGRESS.md: accurate ticks, "Current task" with the full card and status.
3. Overwrite docs/HANDOFF.md using its template: branch, last SHA, done, remaining numbered steps, exact next command, decisions + reasons, known failures, <=5 files to read first, files not to touch, security-critical files touched (needs Opus review).
4. Run `pnpm verify` and paste the last 10 lines into HANDOFF.md.
5. Reply with: the branch name, the SHA, and this one-liner for the founder to paste into Gemini: "Read AGENTS.md, then docs/PROGRESS.md, then docs/HANDOFF.md and follow the Gemini resume procedure."
Forbidden: new features, refactors, editing 00-DECISIONS.md.
```

## 10. Gemini resume prompt (Gemini CLI / Antigravity)

```text
You are continuing a build started by another AI agent. Follow these steps exactly.
1. Read AGENTS.md fully. Then docs/PROGRESS.md. Then docs/HANDOFF.md. Read nothing else until the task card's `read` list says so. docs/00-DECISIONS.md wins any conflict - never contradict it.
2. `git fetch && git switch <branch from HANDOFF.md>`; `git pull`. Run `pnpm install` then `pnpm verify`; append the result to HANDOFF.md "Resume log".
3. Continue the "Remaining steps" in order, one at a time. After each step: run the relevant tests, then `pnpm verify`, then commit (conventional commit, include the task ID).
4. Work only inside the card's `touch` globs. No new dependencies. No changes to docs/00-DECISIONS.md. If something is unclear or blocked, add a row under "Decisions needing the founder" in docs/PROGRESS.md and move to the next unblocked task.
5. Security-critical paths (AGENTS.md list): implement exactly to the card, then mark the task `needs-opus-review` in HANDOFF.md; do not tick it as fully done.
6. Before stopping, or after each completed task: tick PROGRESS.md, update the Done log (tag `(gemini)`), update HANDOFF.md.
Report after each task in <=100 words with the last 10 lines of `pnpm verify`. Never claim a command passed without showing its output.
```

## 11. Claude-returns-after-Gemini review prompt

```text
You are the LEAD (Opus). Gemini worked while Claude was unavailable. Audit before continuing.
1. Read docs/HANDOFF.md and `git log main..HEAD --oneline --stat` (stat only).
2. Run `pnpm install && pnpm verify && pnpm test:e2e`; paste tails.
3. Use the architect-reviewer subagent on full diffs of every security-critical path touched (docs/12 section 2.1) and on every task marked needs-opus-review. Use the security-auditor subagent on the combined diff.
4. Sample-review non-critical diffs for: scope creep outside `touch`, new dependencies (`git diff main...HEAD -- '**/package.json' pnpm-lock.yaml`), `any`/ts-ignore/TODO without ID, secrets, doc contradictions with 00-DECISIONS.
5. Fix small issues yourself via the proper subagent; open follow-up tasks (ID + `a/b` suffix) for the rest in docs/PROGRESS.md.
6. Fill HANDOFF.md "Return review"; only then tick tasks that pass docs/12 section 7 gates, merge, and run /clear.
Output: verdict per task (accept / fix / redo) in a table, <=200 words. Do not start new tasks until this is done.
```

## 12. "Explain this code to me" (for the founder)

```text
Explain <file path | function | PR | concept> to me. I am the founder, technically curious but not a full-time engineer.
Read only what is needed (the file(s) named, their direct imports, and docs/00-DECISIONS.md if architecture is involved).
Format:
1. In one sentence: what it does and why the product needs it.
2. How it works in 5-8 plain-language steps, naming real functions/files (path:line).
3. What can go wrong (security, money, exam fairness) and which test or check protects it.
4. One analogy.
5. "Questions to ask the next reviewer": 3 bullets.
Rules: no jargon without a 5-word gloss; no code longer than 10 lines; do not modify any file; if the code contradicts docs/00-DECISIONS.md, say so clearly.
```

## 13. Checkpoint (any tool; Gemini has no slash commands)

```text
Checkpoint now. Do not start new work.
1. `git branch --show-current` (never on main) and `git status --short` (no .env*, no secrets).
2. `git add -A && git commit -m "wip(<scope>): <what> (<ID>) [checkpoint]"` if there are changes.
3. `git pull --rebase` then `git push -u origin HEAD`. If offline, say "NOT PUSHED".
4. Append to the active docs/logs/sessions file under "Next step": the exact next command; add <=3 decision bullets.
5. Refresh Branch / Last commit / Remaining steps in docs/HANDOFF.md.
Reply in <=6 lines: branch, SHA, pushed yes/no, verify result (or "not run"), next step. Never claim pushed without command output.
```

## 14. Cross-check review (Gemini or Claude reviewing the other's work)

```text
You are a REVIEWER, not the author. Read AGENTS.md, then the request file docs/logs/reviews/<date>-<ID>-REQUEST.md. Review only; do not edit code.
Use the rubric in docs/logs/reviews template (9 criteria, 0/1/2). Start with `git diff main...HEAD --stat`; read full diffs only for the critical files listed. Re-run at least one claimed command and show the output.
Write the result under "## Verdict" in the same file: approve | changes-required, blocking findings as `file:line - problem - fix`, <=5 non-blocking notes. <=300 words. Do not trust the author's summary; trust code, tests and command output.
```

## 15. Spec-only test writer (adversarial tests, critical domains)

```text
Use the qa-engineer subagent in an isolated worktree. You are given ONLY: the acceptance criteria, the doc section, and the public interface (index.ts signatures + zod schemas) for task <ID>. You must NOT read the implementation.
Write failing tests (Vitest; fake clock; table-driven where possible) covering: each acceptance criterion, boundary values, abuse cases (docs/22 section 6.5), and idempotency/race cases. Commit them on task/<ID>-spec-tests. Run them and paste the red output.
If the spec is ambiguous, list the ambiguity as a QUESTION instead of choosing. Return: summary <=150 words, test file list, red output tail, questions.
```

## 16. Content production batch (docs/16; drafts only, human-reviewed, never auto-published)

```text
Use the content pipeline (task P1-62 in docs/12 P1.2; tool `tooling/content/`). Batch: <exam> <skill> <item type> x <N>, wave <n>, spec file docs/content/specs/<file>.
Read only: docs/16-CONTENT-SOURCING-AND-PRODUCTION.md sections 3-4 and 10 (item specs, AI-assisted pipeline, import formats) and the spec file. Do not read or quote any official/third-party exam material.
1. For every item produce a fact ledger entry first (source, licence kind, retrieval date) or mark the stimulus "original"; no scraped or paraphrased copyrighted text. Unknown licence = stop and list as a QUESTION.
2. Draft with Sonnet via the Batch API (variants with Haiku). Run similarity/dedupe against the bank and the batch; drop or flag matches above the threshold in the spec.
3. Emit ImportBundleV2 (docs/16 section 10) with a `provenance` block per item/stimulus/audio; run `tooling/validate-import`; file name `import_<exam>_<skill>_<yyyymmdd>_<writer>.json`.
4. Import through Studio dry-run, then as DRAFTS only. Never publish, never set status other than draft; publishing needs a content_editor and a provenance record (task P1-58).
5. Bangla text only in `explanation_bn` or locale variants and flagged for native review; use the `i18n/glossary.csv` terms.
Return (<=150 words): counts created / flagged / dropped, validator tail, open licence questions, next batch suggestion. Mock-library target: >= 5 full mocks per exam at launch, 10 by about day 120 (D10); update the library counter data only after editor approval.
```

## 17. Price-book seeding (docs/17 is canonical)

```text
Task P1-70 (P1.6). Read only docs/17-PRICING-MASTER.md section 13 (SEED block), sections 2.1-2.2 (prices, perk matrix) and docs/00-DECISIONS.md D5, D10, D12 C14/C16/C25.
1. Never hand-type or "fix" a price. The only input is the SEED YAML in 17 section 13; if it disagrees with 17 sections 2-9 or with D12, stop and report the row (17 wins on price, 00 wins on rules).
2. Run `pnpm db:seed:prices --dry-run`; paste the diff. Check: amounts are integer minor units; region C >= BD converted at the seed FX (C25), B about 1.5x C, A about 2.5x C; allowances per tier equal 17 section 2.2 (credits 10/40, GRE 6/20; daily AI ceilings 1/3/4/6; tutor 10/30/150 per day); P2/P3 products are seeded inactive.
3. Apply only after the dry-run diff is approved by the lead; re-run to prove idempotency (second run = no changes). Never run against production without the founder's explicit go.
4. Run the region-resolver and pricing-page tests; the page must show "<N> mocks now, 10 by <date>" from data.
Return: product count by tier/region, dry-run summary, idempotency proof, any 17 vs 00 conflict found.
```

## 18. Legal page implementation (docs/26) - never publish drafts without counsel sign-off

```text
Tasks P1-118 / P1-120 / P1-119 (P1.9). Read only docs/26-LEGAL-AND-POLICY-DRAFTS.md sections named in the card and docs/00-DECISIONS.md D12 C6, C7, C13b, C31.
HARD RULES
- The drafts in docs/26 are drafts. Implement the pipeline (MDX, routes, versioning, acceptance logging, banner) but publish no policy text to a production build unless `docs/legal/signoffs/LEG-<kind>-<version>.md` exists with counsel name, scope, content hash and gate-owner approval. Without it the page renders a noindex "draft" banner and `legal:verify` fails the production build.
- Trademark notices: use the D12 C31 strings verbatim (GRE/TOEFL, IELTS, PTE/DET/Common App). Do not paraphrase.
- Facts to keep consistent: deletion grace 14 days, speaking audio 90 days, OTP 5 min / email link 60 min, refund 7 days under 20% consumed and <= 1 full mock, helpdesk Chatwoot.
- Bangla versions are drafted only from counsel-approved English and need native legal-translator sign-off recorded; the Bangla page always links the signed English version.
- Never write "guaranteed band/score/admission"; run the copy lint.
Return: files changed, `legal:verify` output tail, list of pages still lacking sign-off (expected until BG-01 completes).
```

## 19. Founder daily routine (the whole day in three commands)

```text
Morning (Claude Code, Opus):  /session-start
  -> reads SessionStart output (branch, sync state, current task, last "Next step"), HANDOFF.md baton, creates today's session log.
Work loop (repeat):  /next-task
  -> picks the first unchecked task whose deps are ticked (skips BG-xx human gates), writes the card, dispatches the subagent, reviews, you read the verify tail, it commits + pushes + ticks PROGRESS.md; then /clear.
  Every ~30 min or after each green verify: commit + push. At >= 70% of the 5-hour window: /checkpoint. At >= 85%: /handoff (Gemini continues with Prompt 10).
Evening:  /checkpoint, then /session-end (log "Next step", refresh HANDOFF.md, push).
Friday (15 min): /status; compare against the next milestone gate (M0-M3) in docs/PROGRESS.md "Milestone gates"; write the weekly progress log; tick any BG-xx gate you completed (counsel, accountant, SSLCommerz, Meta verification); move a gate date if a buffer was used (docs/24 section 8).
Rules: you only decide items in "Decisions needing the founder"; never approve a task without the verify output; never skip /clear between tasks; no legal text goes live without a sign-off file.
```
