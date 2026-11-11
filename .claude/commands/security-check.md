---
description: Read-only security review of a diff or path; escalates high/critical findings to Opus
argument-hint: "[git range or path, default main...HEAD]"
---
Scope: $ARGUMENTS (default: `main...HEAD`).
Use the `security-auditor` subagent with prompt 6 in docs/13-PROMPTS.md and checklist docs/12-BUILD-PLAN-AGENTS.md section 6.2. For every high or critical finding, call the `architect-reviewer` subagent for a verdict. Output a findings table (severity, file:line, issue, fix) and a clear block/allow recommendation. No code edits.
