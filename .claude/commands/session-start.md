---
description: Start a work session - sync, read state, create the session log, restate the task contract
argument-hint: "[task ID, optional]"
---
Task hint: $ARGUMENTS
1. The SessionStart hook already printed branch/sync/task. If it warned BEHIND: `git pull --rebase` first. If dirty with unknown changes: show `git diff --stat`, ask me, do not discard anything.
2. Create the session log: next free `docs/logs/sessions/$(date -u +%F)-claude-<n>.md` from `docs-templates/logs/SESSION-TEMPLATE.md` (fill Goal, Device = hostname, Tool/model, Branch, Task IDs), then write its path to `docs/logs/sessions/.current`.
3. Read only: CLAUDE.md (loaded), `docs/PROGRESS.md` Current task, the last session log's "Next step", `docs/HANDOFF.md` if its Branch line is filled. Nothing else.
4. If no current task and no hint: run the /next-task logic. If a task is current: re-state its contract in <=8 lines (id, touch globs, acceptance, verify, out_of_scope) and the first action.
5. If the card's `touch` hits a security-critical path, write only those globs (one per line, `**` ok) to `.claude/allow-protected.local`; otherwise empty that file. (Gitignored; guard-paths.sh reads it.)
Reply <=10 lines. Do not edit code yet.
