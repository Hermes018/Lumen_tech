---
description: Opus diff review of the current branch (architect-reviewer), plus security-auditor on critical paths
argument-hint: "[task ID or branch; default current branch]"
---
Review target: $ARGUMENTS (default: current branch vs main).
1. `git diff main...HEAD --stat`. List which files hit the security-critical paths in docs/12-BUILD-PLAN-AGENTS.md section 2.1.
2. Use the `architect-reviewer` subagent with prompt 5 from docs/13-PROMPTS.md, giving it the task card from docs/PROGRESS.md and the diff range. For Gemini-authored commits (branch `gemini/` or `(gemini)` in Done log) also run `security-auditor` on the full diff (prompt 6) and follow prompt 11.
3. Show the verdict table: task, verdict (approve/changes-required), blocking findings. Do not edit code yourself unless I ask.
