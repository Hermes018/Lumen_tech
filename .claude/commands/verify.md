---
description: Run pnpm verify and report only the failing tail; fix trivial failures via lint-fixer
argument-hint: "[optional package filter]"
---
Run `pnpm verify` $ARGUMENTS (use `pnpm --filter <pkg> ...` if a package is given).
Report: PASS/FAIL per stage (typecheck, lint, unit tests, build) and the last 15 lines of the first failing stage. Do not paste passing output.
If the only failures are lint/format, dispatch the `lint-fixer` subagent. Otherwise stop and list the failures; do not start fixing unless I ask. Max 150 words.
