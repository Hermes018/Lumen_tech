---
description: Prepare a clean Claude -> Gemini handoff (commit WIP, update PROGRESS.md and HANDOFF.md)
argument-hint: "[reason, e.g. usage limit]"
---
Reason: $ARGUMENTS
Execute prompt 9 from docs/13-PROMPTS.md exactly: finish or revert the current atomic step, commit WIP as `wip(scope): what (ID) [handoff]`, clean tree, push; update docs/PROGRESS.md; overwrite docs/HANDOFF.md from its template; run `pnpm verify` and paste the last 10 lines into it.
End with the branch, the SHA, and the one-line resume instruction for Gemini ("Read AGENTS.md, then docs/PROGRESS.md, then docs/HANDOFF.md and follow the Gemini resume procedure"). No new work.
