---
description: Close the session - finalize the session log, rollup tokens/cost, update PROGRESS, push, then tell me to /clear
argument-hint: "[outcome note]"
---
Note: $ARGUMENTS
1. If code changed and the task is not verified-done: run `/checkpoint` logic (WIP commit + push) instead of ticking anything.
2. Finalize the session log (`.current`): fill Tasks touched, Decisions, Commands that mattered (max 8), Verify results (paste last lines), Tokens/cost (from `/usage` if I pasted it; else "unknown"), Errors (link ERR-IDs), Next step (exact command). Keep it under 60 lines. Delegate wording to `docs-scribe` (Haiku) if >30 lines of git history must be summarised: give it `git log --oneline <range>` and `git diff --stat`, not whole diffs.
3. Update `docs/PROGRESS.md`: Status block (date, tool, branch, last green SHA); tick tasks only if Definition of Done v2 (docs/22 section 12) is met; add Done-log rows.
4. If a new decision is architecture-level, create `docs/logs/decisions/ADR-NNNN-<slug>.md` from the template (promote to 00-DECISIONS only via the founder).
5. `git add -A && git commit -m "docs(logs): session <file> (<IDs>)" && git pull --rebase && git push`.
6. Remove `docs/logs/sessions/.current`. End with: "Safe to /clear. Next: <exact command>".
