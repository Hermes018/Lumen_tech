---
description: Resume after a break or after Gemini worked: audit, then continue the loop
argument-hint: "[optional note]"
---
Note: $ARGUMENTS
1. Read docs/HANDOFF.md and docs/PROGRESS.md; `git log main..HEAD --oneline --stat`.
2. If any commits came from Gemini, run prompt 11 in docs/13-PROMPTS.md (verify, architect-reviewer on critical paths, security-auditor on combined diff) before anything else.
3. If the tree is dirty or `pnpm verify` fails, stop and report. Otherwise fill HANDOFF.md "Return review", then continue with /next-task logic (docs/12 section 5).
