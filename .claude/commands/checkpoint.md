---
description: Checkpoint now - WIP commit, session log line, HANDOFF refresh, push. Safe to run any time; use before risky steps, every ~30 min, and at limits or power cuts
argument-hint: "[short note, e.g. 'schema done, tests next']"
---
Note: $ARGUMENTS
Protocol (docs/22 section 7). Do NOT start new work. Be quiet; show only the final summary.
1. `git status -sb` and `git branch --show-current`. If on `main`, STOP and tell me (never commit on main).
2. If the tree has changes: `git add -A` (check `git status --short` shows no `.env*`, no `*.local`, no secrets), then commit: `wip(<scope>): <what> (<task-ID>) [checkpoint]` + the attribution trailer rules from the repo. If `pnpm verify` is cheap (<2 min) run `pnpm verify --silent 2>&1 | tail -n 15` and record the result; otherwise record "verify: not run".
3. `git pull --rebase` (if it conflicts: stop, report, do not resolve blindly), then `git push -u origin HEAD`. If offline, say so: the commit exists locally; push at next connection.
4. Append to the active session log (`docs/logs/sessions/.current`, else newest today) under "Next step": one line = exact next command/action. Add decisions made since last checkpoint (max 3 bullets).
5. Overwrite `docs/HANDOFF.md` ONLY if the context is >70% used or I said so; otherwise update only its "Branch / Last commit / Remaining steps" lines.
6. Update `docs/PROGRESS.md` "Current task" status line (not ticks - ticks need Definition of Done).
Reply (max 6 lines): branch, SHA, pushed yes/no, verify result, next step. Never claim pushed or green without command output.
