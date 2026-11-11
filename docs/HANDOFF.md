# HANDOFF - Claude <-> Gemini baton

> Overwrite this file at every handoff (`/handoff` or Prompt 9 in `docs/13-PROMPTS.md`). Keep it under 80 lines. State only; no essays.
> Read order for the receiving agent: `AGENTS.md` -> `docs/PROGRESS.md` -> this file. Read nothing else until the task card says so.

## Baton

- From: claude | gemini   To: gemini | claude   Date/time (UTC):
- Reason: usage limit | planned switch | outage
- Branch:                      Last commit SHA:
- Device (hostname) / session log path:
- Pushed to origin? yes/no (must be yes)   Usage at handoff (5h / weekly %):
- Working tree clean? yes/no (must be yes; WIP committed with `[handoff]`)
- Task: ID - title - status (in progress / blocked / ready for review)
- Milestone gate in progress (docs/PROGRESS.md "Milestone gates"): M0 | M1 | M2 | M3; open `BG-xx` human gates that block this task (if any):
- Baseline `pnpm verify` at handoff: PASS | FAIL (paste last 10 lines if FAIL)

## Done so far (this task)

1.

## Remaining steps (numbered, in order)

1.
2.

## Exact next command / first action

`...`

## Decisions made (and why)

-

## Known issues / failing tests

-

## Read first (max 5 paths or doc sections)

-

## Do NOT touch

-

## Resume protocol (receiving agent, in order)
`git fetch && git switch <branch> && git pull --rebase` -> `git status -sb && git log -5 --oneline` -> `pnpm install --frozen-lockfile` -> `pnpm verify:fast` -> create session log (`/session-start`, or copy docs/logs template) -> continue first remaining step. Never `/rewind` to undo code; use git.

## Needs Opus review (security-critical paths touched)

- [ ] none   - or list files:

## Resume log (receiving agent appends)

| Time | Agent | Action | verify result |
|---|---|---|---|
| | | | |

## Return review (Claude fills after Gemini work)

- Reviewed commits:
- architect-reviewer verdict:
- security-auditor verdict:
- Follow-up tasks created:
