# Review <date> - <task ID> - <author tool/model> reviewed by <reviewer tool/model>

- Branch/range: `git diff main...HEAD` @ <sha>   Reviewer same family as author? yes | no
- Critical paths touched: none | <list>   Two-key required? yes | no

## Verdict: approve | changes-required

## Rubric (score 0 = fail, 1 = partial, 2 = pass; any 0 on rows 1-4 blocks merge)
| # | Criterion | Score | Evidence (file:line / command output) |
|---|---|---|---|
| 1 | Meets each acceptance criterion with a test that would fail if the code were wrong | | |
| 2 | Authorization + ownership/tenant checks (allow AND deny tests) | | |
| 3 | Server-authoritative: price, deadline, score, entitlement | | |
| 4 | Security checklist (docs/12 6.2) + secrets/deps clean | | |
| 5 | Idempotency, races, error handling, failure modes | | |
| 6 | Migration safety (expand/migrate/contract) if any | | |
| 7 | Module boundaries; no scope creep beyond `touch` | | |
| 8 | UI/a11y/i18n states if any (6.1) | | |
| 9 | Claims verified (no "should work"): commands re-run by reviewer | | |

## Blocking findings
- `file:line` - problem - fix

## Non-blocking notes (max 5)
-

## Commands re-run by reviewer (with result)
-
