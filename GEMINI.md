# GEMINI.md - Lumen Academy (Gemini CLI / Google Antigravity)

<!-- Verify against the installed Gemini CLI / Antigravity version: Gemini CLI loads GEMINI.md by default, and `.gemini/settings.json` -> `context.fileName` (array) adds AGENTS.md. Settings keys and Antigravity rules locations change between releases; if AGENTS.md is not picked up, paste it manually at session start. JSON cannot hold comments, so this note lives here. -->

You are continuing a build orchestrated with Claude Code. Do this now:

1. Read `AGENTS.md` (all rules apply to you). Then `docs/PROGRESS.md`, then `docs/HANDOFF.md`. Read nothing else until the task card's `read` list tells you to.
2. `docs/00-DECISIONS.md` is the single source of truth; never contradict or edit it.
3. Follow the resume prompt in `docs/13-PROMPTS.md` section 10 and the procedure in `AGENTS.md` section 5.

## Guardrails you must follow (details: AGENTS.md section 9b, docs/22)
- Checkpoint every <=30 min (docs/13 prompt 13): WIP commit, `git pull --rebase`, `git push`, update the session log + HANDOFF. At the start: `git fetch && git status -sb`, then `git pull --rebase`.
- One device per branch; no `.env` copying; no baseline snapshot updates; no edits to protected paths (AGENTS.md 9b); no new dependencies not in `docs/approved-deps.txt`.
- Cross-model review: when asked to review Claude's PR, use prompt 14 and write the verdict into the request file; you are never the sole reviewer of critical paths.
- Log work in `docs/logs/sessions/` (tool name `gemini`); log failures in `docs/logs/errors/ERROR-LOG.md`.

## Gemini-specific tips
- No named subagents here: work sequentially; after implementing, switch hats and review your own diff against the checklist in `docs/12-BUILD-PLAN-AGENTS.md` section 6.
- Keep context small: read line ranges (`grep -n "^#" file` first), avoid dumping large files or lockfiles, start a fresh session after every task (state lives in PROGRESS.md / HANDOFF.md).
- Use `/compress` when context passes ~60%, `/memory show` to confirm AGENTS.md/GEMINI.md loaded, `/chat save <tag>` before long steps; enable checkpointing in settings if you want `/restore` (verify against installed version) - but git remains the real undo.
- Prefer exact shell commands over describing them; always show the tail of `pnpm verify`.
- Large-context temptation: do not load the whole repo or all docs "just in case". It costs time and causes drift from the task card.
- Do not run interactive commands or open long-lived dev servers without backgrounding them; stop them before finishing.
- Confirm the sandbox/approval mode before commands that write outside the repo; never disable safety prompts for `rm`, `git push --force`, or network downloads.
- Use plan-then-act: write a 5-line plan to PROGRESS.md "Current task > notes" for tasks touching more than 5 files.
- Antigravity: if it creates artifacts/browser recordings, keep them out of git (`/tmp`), and treat "agent manager" parallel agents as unsafe unless `touch` globs are disjoint.
- Branches: continue the handoff branch; new tasks use `gemini/<ID>-<slug>`. Security-critical paths: implement to the card and flag `needs-opus-review` in HANDOFF.md.
- Before limits end or work completes: rewrite `docs/HANDOFF.md`, tick PROGRESS.md, commit and push.
