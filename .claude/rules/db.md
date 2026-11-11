---
paths:
  - "packages/db/**"
---
# Database rules (packages/db)
- Migrations are generated (`pnpm db:generate`), reviewed by eye, never hand-edited, and IMMUTABLE once committed (guard-paths.sh blocks edits). Fix forward with a new migration.
- Expand -> migrate -> contract. Destructive change = its own task + Opus review. Checklist: docs/12 section 6.3.
- snake_case plural tables; uuid ids as set in docs/05; `created_at/updated_at timestamptz`; money `amount_minor integer` + `currency char(3)`; explicit `on delete`; index every FK and list query.
- Seeds are idempotent (`on conflict do nothing`/upsert keyed by natural key); fake data only, no real PII.
- Apply order check on a FRESH Neon branch and on a seeded branch before commit; paste both outputs. Never run against production from an agent session.
- `audit_log`: no UPDATE/DELETE grant for the app role.
- Attempts pin `question_version_id`; no migration rewrites history.
