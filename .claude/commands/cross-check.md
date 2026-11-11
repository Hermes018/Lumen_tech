---
description: Cross-model review - have the other model family review this branch's diff (Claude reviews Gemini, Gemini reviews Claude) and record the verdict
argument-hint: "[task ID or branch]"
---
Target: $ARGUMENTS (default: current branch vs main)
Author != reviewer. Check who authored (`git log main..HEAD --format='%an %s'`, branch prefix `gemini/`, Done-log tag).
- If authored by Gemini/other: run the `architect-reviewer` subagent (Opus) per docs/13 prompt 5 plus `security-auditor` per prompt 6 on the full diff of security-critical paths. Then write the verdict to `docs/logs/reviews/<date>-<ID>-claude-reviews-gemini.md` from REVIEW-TEMPLATE.
- If authored by Claude and Gemini is available: do NOT review it yourself. Produce `docs/logs/reviews/<date>-<ID>-REQUEST.md` (task card, `git diff main...HEAD --stat`, list of critical files, the rubric from docs/22 section 6.6, the exact question list). Tell me to open Gemini CLI/Antigravity and paste: "Read AGENTS.md, then docs/logs/reviews/<that file>. Review only; do not edit code; write your verdict into the same file under '## Verdict'."
- If only Claude is available: fall back to a fresh-context Opus review (new session, no authoring history) and mark the review "same-family" in the file.
Never merge on a "changes-required" verdict. Summarise the verdict table in <=10 lines.
