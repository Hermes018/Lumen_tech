---
description: One-screen status - task, branch sync, verify state, usage, next step. Read-only
argument-hint: ""
---
Read-only. Collect and print in <=20 lines:
1. Current task id/title/status from `docs/PROGRESS.md` ("Current task" block only) and the next 2 unblocked backlog items.
2. `git status -sb`, `git log -3 --oneline`, `git fetch --quiet` then ahead/behind vs upstream and vs `origin/main`.
3. Last `pnpm verify` result recorded in PROGRESS.md "Status" (do not re-run unless I ask).
4. Newest session log path and its "Next step".
5. Usage: tell me to check `/usage` and `/status` (plan allocation); if I already pasted them, flag >=70% (consider /checkpoint) and >=85% (run /handoff).
6. Open founder decisions that block the current or next task.
No edits, no commits.
