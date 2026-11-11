---
description: Pick the next unblocked task from docs/PROGRESS.md, write its task card, dispatch the right subagent
argument-hint: "[optional task ID to force, e.g. P1-12]"
---
Run the loop in docs/12-BUILD-PLAN-AGENTS.md section 5 (lead role).
Forced task (if any): $ARGUMENTS

1. Read docs/PROGRESS.md only. If "Current task" is filled, continue it. Else pick $ARGUMENTS if given and its deps are ticked, otherwise the first unchecked task whose deps are all ticked. Ignore `BG-xx` lines (human-owned business gates); if a task's acceptance needs a BG gate, add it to "Decisions needing the founder" and take the next unblocked task.
2. Get its acceptance criterion from docs/12-BUILD-PLAN-AGENTS.md section 11 (grep the ID). Read only the doc sections the task needs (`grep -n "^#"` then a line range).
3. If `docs/cards/<ID>.md` exists, use it (verify it still matches PROGRESS and 12). Otherwise write the full task card into "Current task" in docs/PROGRESS.md. Missing info -> add to "Decisions needing the founder" and stop.
4. `git fetch && git switch -c task/<ID>-<slug> origin/main` (or `git pull --rebase` if the branch exists). Write ONLY the card's `touch` globs that hit security-critical paths (docs/12 section 2.1) into `.claude/allow-protected.local` (empty the file otherwise); the PreToolUse guard reads it.
5. Dispatch the subagent from docs/12 section 2 with the card (template: docs/13-PROMPTS.md section 3).
5b. Task cards must now also list: `verify_ladder` level (docs/22 section 5) and `reviewer` (who is NOT the author).
6. Review the result (architect-reviewer for security-critical paths), commit conventionally, tick PROGRESS.md, then tell me to /clear.
Never work on more than one task; never edit outside the card's touch list.
