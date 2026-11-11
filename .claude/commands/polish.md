---
description: UI polish pass using the ui-polisher subagent against the anti-vibe-coded checklist
argument-hint: "<routes or components, e.g. /pricing and PricingCard>"
---
Use the `ui-polisher` subagent on: $ARGUMENTS
Follow prompt 7 in docs/13-PROMPTS.md: audit against docs/12-BUILD-PLAN-AGENTS.md section 6.1 at 360/768/1024/1440 px, light+dark, en+bn; tokens and packages/ui only; no behaviour, API, schema or dependency changes.
Return its <=150-word summary, files changed, `pnpm verify` tail, and checklist result.
