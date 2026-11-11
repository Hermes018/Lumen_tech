---
description: Append a structured entry to docs/logs/errors/ERROR-LOG.md (append-only) after fixing a non-trivial bug or failure
argument-hint: "<one-line symptom>"
---
Symptom: $ARGUMENTS
1. Read only the last ~40 lines of `docs/logs/errors/ERROR-LOG.md` to get the next ID (`ERR-NNNN`). If the file does not exist, copy `docs-templates/logs/ERROR-LOG.md` first.
2. APPEND (never edit earlier entries) a block using the template fields: ID, date (UTC), task ID, symptom, exact error text (max 15 lines, no secrets/PII), root cause (one paragraph, layer: validation|authz|query|race|UI state|tooling|dependency|env), fix (files + commit SHA, or "pending"), prevention (test/lint rule/hook/doc added, or a new backlog ID in docs/PROGRESS.md "Parking lot").
3. If the prevention is a rule agents keep violating, propose (do not apply) a one-line addition to `.claude/rules/*.md` or CLAUDE.md and list it in the reply.
4. Commit: `docs(logs): ERR-NNNN <slug> (<task-ID>)`.
Reply in <=4 lines: ID, root cause, prevention. Evidence rule: every field must come from real output you saw; write "unknown" rather than guess.
