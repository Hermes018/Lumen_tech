# 11 — DevOps, Observability, Reliability and Launch

> Conforms to `00-DECISIONS.md`. Architecture context: `04-ARCHITECTURE.md`. Companion docs: `22-ENGINEERING-GUARDRAILS.md` (agent routing, verification ladder, milestone gates), `28-FOUNDER-SETUP-AND-ENVIRONMENTS.md` (accounts, env matrix, smoke scripts, secret-rotation how-to), `29-NOTIFICATIONS-AND-LIFECYCLE-MESSAGING.md` (deliverability, suppression, quiet hours), `32-ANALYTICS-AND-EXPERIMENTATION.md` (event/KPI dictionary, consent tiers). Where 5.4 summarises analytics, 32 is authoritative.
> Operator model: **a solo founder plus AI agents**. Every process here is automated first, human second. Tool versions marked `verify` must be re-checked at build time; GitHub Action versions should be pinned to full commit SHAs by Renovate (`helpers:pinGitHubActionDigests`).

---

## 1. Git workflow

### 1.1 Trunk-based development
- Single long-lived branch: `main` (always deployable; protected). No `develop`.
- Short-lived branches (target < 1 day, hard limit 3 days): `feat/<scope>-<slug>`, `fix/…`, `chore/…`, `docs/…`. Agent branches: `agent/<task-id>-<slug>` (task IDs from `12-BUILD-PLAN-AGENTS.md`).
- Merge method: **squash merge only**; PR title becomes the commit message and MUST be a conventional commit.
- Incomplete features ship dark behind flags (`04` section 8.4).
- Release = every merge to `main` deploys to **staging** automatically; **production** is promoted manually (GitHub Environment `production` with required reviewer) after the staging smoke suite passes. Hotfix = same path, branch `fix/…`, expedited.

### 1.2 Branch protection (`main`)
- **Solo-founder ruleset (28 NEW-ENV-01; replaces "1 approving review", which a single maintainer cannot satisfy on their own PRs):** require a PR (no direct pushes to `main`), **0 required approving reviews while there is only one human maintainer**, **required status checks** `verify`, `e2e-preview`, `security / gitleaks`, `security / osv`, `codeql`, `commitlint` **plus the AI review check** (the `security-auditor`/review agent job must pass; its findings are blocking comments the founder resolves), linear history, signed commits recommended, conversation resolution required. CODEOWNERS entries stay (they document ownership and become enforceable review requirements automatically once a second maintainer exists: then set required approvals to 1 and enable "require review from Code Owners"). The ruleset JSON is committed under `.github/rulesets/main.json`; **no bypass actors** (administrators included), force-push and deletion blocked. The founder's own deliberate act is the production promotion approval (GitHub Environment `production` required reviewer), so a human gate remains before any release.
- Dismiss stale approvals on new commits (relevant once approvals are required). Disallow force-push and deletion. Include administrators. Agent branches may not push to `main` and may not edit `docs/00-DECISIONS.md`, applied migrations or `.github/workflows/` without the PR path above (GA-050).

### 1.3 Conventional commits
`type(scope): subject` — types: `feat fix perf refactor docs test build ci chore revert`. Scopes = domain names (`commerce`, `exam-engine`, …) or `web`, `ui`, `db`, `auth`, `ai`, `config`, `deps`. Breaking change: `!` or `BREAKING CHANGE:` footer. Enforced by commitlint on PR title and commits.

```js
// commitlint.config.mjs
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', [
      'identity','rbac','catalog','content','media','assessment','exam-engine','evaluation','commerce',
      'learning','community','notifications','organizations','analytics','audit',
      'web','ui','db','auth','ai','config','deps','ci','docs','tooling',
    ]],
    'subject-case': [2, 'never', ['upper-case', 'pascal-case', 'start-case']],
    'header-max-length': [2, 'always', 100],
  },
};
```

### 1.4 PR template — `.github/pull_request_template.md`

```markdown
## What and why
<!-- one paragraph; link task ID from docs/PROGRESS.md -->

## Type
- [ ] feat  - [ ] fix  - [ ] refactor  - [ ] perf  - [ ] docs/ci/chore

## Checklist (all must be ticked or marked N/A with reason)
- [ ] `pnpm verify` passes locally
- [ ] New/changed server entry point calls `assertCan` in the **service** (not only UI/proxy)
- [ ] Inputs validated with zod; outputs are DTOs (no raw rows)
- [ ] Mutations write `audit` rows for staff/financial/security actions
- [ ] No PII in logs/Sentry/PostHog events; no secrets in client bundle
- [ ] DB migration follows expand/contract (docs/11 section 4) and SQL was reviewed
- [ ] Cache tags revalidated for changed public data
- [ ] i18n: strings in `en.json` and `bn.json`; no hard-coded brand name
- [ ] a11y: keyboard + screen-reader path checked for new UI; axe test added/updated
- [ ] Tests added: unit (policy/service) and e2e if user-visible flow changed
- [ ] Docs updated (`docs/` and `docs/PROGRESS.md`)

## Risk and rollback
<!-- blast radius; how to roll back (revert / flag off / migration down plan) -->

## Screenshots / recordings (UI changes; light + dark, en + bn)
```

### 1.5 CODEOWNERS — `.github/CODEOWNERS`
Security-critical paths require review by the code owner (the founder, `@<founder-handle>`; a second maintainer is added when the team grows). Replace the placeholder handle once.

```
# default
*                                         @<founder-handle>

# authn / authz
/packages/auth/                           @<founder-handle>
/packages/core/src/rbac/                  @<founder-handle>
/packages/core/src/identity/              @<founder-handle>
/apps/web/proxy.ts                        @<founder-handle>
/apps/web/app/api/auth/                   @<founder-handle>

# money
/packages/core/src/commerce/              @<founder-handle>
/apps/web/app/api/webhooks/               @<founder-handle>

# exam integrity
/packages/core/src/exam-engine/           @<founder-handle>
/apps/web/app/api/exam/                   @<founder-handle>

# data and infra
/packages/db/migrations/                  @<founder-handle>
/packages/config/env.ts                   @<founder-handle>
/apps/web/next.config.ts                  @<founder-handle>
/.github/                                 @<founder-handle>
/pnpm-workspace.yaml                      @<founder-handle>
/renovate.json                            @<founder-handle>
/packages/core/src/audit/                 @<founder-handle>
/packages/core/src/finance/               @<founder-handle>   # settlements, ledger, payouts (30)
/packages/core/src/support/               @<founder-handle>   # PII reveal, enforcement, voids (27)
/packages/core/src/guarantee/             @<founder-handle>   # promises and money-back (D12 C13/C13b)
/packages/core/src/ai-learning/           @<founder-handle>   # RAG entitlement filter (34)
/packages/ai/src/rate-limits.ts           @<founder-handle>   # mirrors 09 canonical AI table
```

---

## 2. pnpm settings and supply-chain hygiene

pnpm 10.x (`verify` that the pinned version supports each key). Corepack pins the manager: `"packageManager": "pnpm@10.x.y"` in root `package.json`.

```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'tooling'

# Delay adoption of freshly published versions (minutes). 4320 = 3 days (D3 requires >= 3 days).
minimumReleaseAge: 4320
# Exceptions only for our own scoped packages and reviewed security fixes (list exact names).
minimumReleaseAgeExclude:
  - '@lumen/*'

# Dependency lifecycle scripts are DENIED by default; allow-list exactly what needs a build step.
onlyBuiltDependencies:
  - sharp
  - esbuild
  - '@sentry/cli'
  - unrs-resolver
  - msw            # only if used; remove otherwise

# Never allow others to run scripts, even if a dependency requests it.
ignoredBuiltDependencies: []

# Refuse downgrades of trust evidence (provenance/attestation) between versions (verify availability in pinned pnpm).
trustPolicy: no-downgrade

# Fail on peer mismatches rather than silently auto-installing.
autoInstallPeers: false
strictPeerDependencies: true

# Shared version catalog: single place to bump framework versions.
catalog:
  next: 16.x.y          # pin the exact latest patched 16.x at build time; see 04 section 10
  react: 19.x.y
  react-dom: 19.x.y
  typescript: 5.x.y
  zod: 4.x.y            # verify major used by chosen libs
  drizzle-orm: x.y.z
  drizzle-kit: x.y.z
```

Rules:
- CI uses `pnpm install --frozen-lockfile`. A lockfile change must come from a PR that touches `package.json`/catalog (CI checks `pnpm install --frozen-lockfile` succeeds and `git diff --exit-code pnpm-lock.yaml`).
- Adding a dependency requires, in the PR description: purpose, licence (MIT/Apache/BSD/ISC only), maintainers, weekly downloads, last publish date, and why not in-house. `license-checker --production --failOn 'AGPL-3.0;GPL-2.0;GPL-3.0;SSPL-1.0;BUSL-1.1'` runs in `verify`.
- No `postinstall` scripts from dependencies run unless allow-listed. Adding to `onlyBuiltDependencies` needs CODEOWNERS approval.
- Security release exception: a flagged advisory against Next.js, React, Better Auth, Drizzle or Sentry SDK may bypass `minimumReleaseAge` through a manual PR that adds a temporary `minimumReleaseAgeExclude` entry; remove it after 7 days.

---

## 3. GitHub Actions pipelines

Common conventions: `permissions: contents: read` at workflow top, grant extra per job; `concurrency` cancels superseded runs; `timeout-minutes` on every job; `actions/*` pinned by SHA (shown as tags below for readability); Node from `.nvmrc`; Turborepo cache via `actions/cache` or Vercel Remote Cache.

### 3.1 `ci.yml` — verify

```yaml
name: ci
on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  verify:
    name: verify
    runs-on: ubuntu-24.04
    timeout-minutes: 20
    services:
      postgres:
        image: postgres:17
        env: { POSTGRES_PASSWORD: postgres, POSTGRES_DB: lumen_test }
        ports: ['5432:5432']
        options: >-
          --health-cmd "pg_isready -U postgres" --health-interval 5s --health-timeout 5s --health-retries 10
    env:
      APP_ENV: local
      DATABASE_URL: postgres://postgres:postgres@localhost:5432/lumen_test
      DATABASE_URL_UNPOOLED: postgres://postgres:postgres@localhost:5432/lumen_test
      TURBO_TELEMETRY_DISABLED: '1'
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4          # reads packageManager from package.json
      - uses: actions/setup-node@v4
        with: { node-version-file: .nvmrc, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm env:example --check        # .env.example matches zod schema
      - run: pnpm typecheck                  # turbo run typecheck  (tsc --noEmit)
      - run: pnpm lint                       # eslint flat config + boundaries + dependency-cruiser + prettier --check
      - run: pnpm licenses:check
      - run: pnpm db:migrate:test            # apply all migrations to the CI Postgres
      - run: pnpm test                       # vitest unit + service tests (real Postgres)
      - run: pnpm build                      # turbo run build (next build with dummy env from .env.ci)
      - run: pnpm bundle:check               # enforces JS budgets from section 8.2 and secret-in-bundle grep
      - name: Upload coverage
        uses: actions/upload-artifact@v4
        with: { name: coverage, path: '**/coverage/lcov.info', if-no-files-found: ignore }

  commitlint:
    name: commitlint
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-24.04
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version-file: .nvmrc, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: echo "${{ github.event.pull_request.title }}" | pnpm commitlint
```

`pnpm verify` (local and agent definition of done, per D9) = `env:example --check && typecheck && lint && licenses:check && test && build && bundle:check`.

### 3.2 `e2e-preview.yml` — Playwright against the Vercel preview + Neon branch

```yaml
name: e2e-preview
on:
  pull_request:
    types: [opened, synchronize, reopened, closed]

permissions:
  contents: read
  pull-requests: write
  deployments: read

concurrency:
  group: e2e-${{ github.ref }}
  cancel-in-progress: true

jobs:
  neon-branch:
    if: github.event.action != 'closed'
    runs-on: ubuntu-24.04
    timeout-minutes: 10
    outputs:
      db_url: ${{ steps.branch.outputs.db_url_with_pooler }}
      db_url_unpooled: ${{ steps.branch.outputs.db_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version-file: .nvmrc, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - id: branch
        uses: neondatabase/create-branch-action@v6
        with:
          project_id: ${{ vars.NEON_PROJECT_ID }}
          parent_branch: staging
          branch_name: preview/pr-${{ github.event.number }}
          api_key: ${{ secrets.NEON_API_KEY }}
      - name: Apply migrations to the PR branch
        run: pnpm db:migrate
        env: { DATABASE_URL_UNPOOLED: '${{ steps.branch.outputs.db_url }}' }
      - name: Seed demo data
        run: pnpm db:seed --profile preview
        env: { DATABASE_URL_UNPOOLED: '${{ steps.branch.outputs.db_url }}', APP_ENV: preview }

  e2e:
    if: github.event.action != 'closed'
    needs: neon-branch
    runs-on: ubuntu-24.04
    timeout-minutes: 25
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version-file: .nvmrc, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - name: Deploy preview to Vercel with branch DB
        id: deploy
        run: |
          npx vercel@latest pull --yes --environment=preview --token=${{ secrets.VERCEL_TOKEN }}
          npx vercel@latest build --token=${{ secrets.VERCEL_TOKEN }}
          URL=$(npx vercel@latest deploy --prebuilt --token=${{ secrets.VERCEL_TOKEN }} \
                  --env DATABASE_URL="${{ needs.neon-branch.outputs.db_url }}" \
                  --env DATABASE_URL_UNPOOLED="${{ needs.neon-branch.outputs.db_url_unpooled }}")
          echo "url=$URL" >> "$GITHUB_OUTPUT"
      - run: pnpm exec playwright install --with-deps chromium webkit
      - run: pnpm e2e
        env:
          E2E_BASE_URL: ${{ steps.deploy.outputs.url }}
          VERCEL_AUTOMATION_BYPASS_SECRET: ${{ secrets.VERCEL_AUTOMATION_BYPASS_SECRET }}
      - name: A11y (axe) + Lighthouse CI
        run: pnpm a11y && pnpm lhci autorun
        env: { LHCI_BASE_URL: '${{ steps.deploy.outputs.url }}' }
      - uses: actions/upload-artifact@v4
        if: failure()
        with: { name: playwright-report, path: apps/web/playwright-report }

  cleanup:
    if: github.event.action == 'closed'
    runs-on: ubuntu-24.04
    steps:
      - uses: neondatabase/delete-branch-action@v3
        with:
          project_id: ${{ vars.NEON_PROJECT_ID }}
          branch: preview/pr-${{ github.event.number }}
          api_key: ${{ secrets.NEON_API_KEY }}
```

Notes: Preview deployments use sandbox provider keys only (`04` section 9). The Vercel Git integration is configured with "Ignored Build Step" disabled for previews so that the Action above is the only deploy path when e2e is needed; simpler alternative: keep Vercel's native previews and set `DATABASE_URL` through the Neon-Vercel integration, and have Playwright wait for the `deployment_status` event.

### 3.3 `security.yml` — secrets, dependencies, SAST

```yaml
name: security
on:
  pull_request:
  push:
    branches: [main]
  schedule:
    - cron: '17 3 * * *'      # nightly full scan

permissions:
  contents: read

jobs:
  gitleaks:
    name: security / gitleaks
    runs-on: ubuntu-24.04
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          # Gitleaks Action may need a licence key for organisation repos; a personal-account repo does not.
          GITLEAKS_LICENSE: ${{ secrets.GITLEAKS_LICENSE }}
          GITLEAKS_CONFIG: .gitleaks.toml

  osv:
    name: security / osv
    runs-on: ubuntu-24.04
    timeout-minutes: 10
    permissions:
      contents: read
      security-events: write
      actions: read
    steps:
      - uses: actions/checkout@v4
      # Reusable workflow from the OSV-Scanner project (pin to a release tag/SHA; verify current version)
      - uses: google/osv-scanner-action/osv-scanner-action@v2
        with:
          scan-args: |-
            --lockfile=pnpm-lock.yaml
            --recursive
            ./

  license-and-sbom:
    runs-on: ubuntu-24.04
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version-file: .nvmrc, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm licenses:check
      - run: pnpm dlx @cyclonedx/cdxgen -o sbom.cdx.json
      - uses: actions/upload-artifact@v4
        with: { name: sbom, path: sbom.cdx.json }
```

```yaml
# .github/workflows/codeql.yml
name: codeql
on:
  pull_request:
  push:
    branches: [main]
  schedule:
    - cron: '41 4 * * 1'

permissions:
  contents: read

jobs:
  codeql:
    name: codeql
    runs-on: ubuntu-24.04
    timeout-minutes: 30
    permissions:
      contents: read
      security-events: write
      actions: read
    steps:
      - uses: actions/checkout@v4
      - uses: github/codeql-action/init@v3
        with:
          languages: javascript-typescript
          queries: security-extended
      - uses: github/codeql-action/analyze@v3
        with: { category: '/language:javascript-typescript' }
```

`.gitleaks.toml` extends the default ruleset with custom rules for `re_[A-Za-z0-9]{20,}` (Resend), `sk-ant-…` (Anthropic), `BETTER_AUTH_SECRET=` and SSLCommerz store passwords; allow-lists only `.env.example` and test fixtures by path. Pre-commit (lefthook): `gitleaks protect --staged`, `prettier --check`, `eslint --cache` on staged files.

### 3.4 `renovate.json`

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:best-practices", "helpers:pinGitHubActionDigests", ":semanticCommits", ":dependencyDashboard"],
  "timezone": "Asia/Dhaka",
  "schedule": ["before 8am on monday"],
  "minimumReleaseAge": "3 days",
  "internalChecksFilter": "strict",
  "prConcurrentLimit": 5,
  "prHourlyLimit": 2,
  "rangeStrategy": "pin",
  "labels": ["deps"],
  "lockFileMaintenance": { "enabled": true, "schedule": ["before 8am on the first day of the month"] },
  "vulnerabilityAlerts": { "enabled": true, "minimumReleaseAge": null, "labels": ["security"], "schedule": ["at any time"] },
  "osvVulnerabilityAlerts": true,
  "packageRules": [
    { "matchManagers": ["github-actions"], "pinDigests": true, "automerge": false },
    { "matchPackageNames": ["next", "react", "react-dom", "eslint-config-next", "@next/*"], "groupName": "next+react", "automerge": false, "reviewers": ["<founder-handle>"], "labels": ["deps", "framework"] },
    { "matchPackageNames": ["better-auth", "@better-auth/*", "drizzle-orm", "drizzle-kit", "@sentry/*"], "automerge": false, "labels": ["deps", "critical-path"] },
    { "matchDepTypes": ["devDependencies"], "matchUpdateTypes": ["minor", "patch"], "automerge": true, "automergeType": "pr", "platformAutomerge": true },
    { "matchUpdateTypes": ["major"], "dependencyDashboardApproval": true, "automerge": false },
    { "matchPackageNames": ["postgres"], "matchManagers": ["docker-compose"], "allowedVersions": "17" }
  ]
}
```

The `vulnerabilityAlerts.minimumReleaseAge: null` lets security-fix PRs bypass the 3-day wait (they still need human merge, section 2). Dependency-alert PRs for Next.js are labelled `security` and trigger a notification (Renovate dashboard + GitHub mobile push).

### 3.5 Deploy and migration workflows

- **Staging**: Vercel Git integration deploys every `main` commit to the `lumen-staging` project. Workflow `db-migrate-staging` (on push to `main`, before deploy promotion) applies pending migrations to Neon `staging`.
- **Production**: `db-migrate-prod.yml` (manual `workflow_dispatch` + GitHub Environment `production` reviewer) runs: (1) create Neon backup branch `pre-migrate/<sha>` (instant, copy-on-write); (2) `pnpm db:migrate` against the production direct URL; (3) smoke `GET /api/health/ready`; (4) the Vercel production promotion step runs only after success.

```yaml
# .github/workflows/db-migrate-prod.yml
name: db-migrate-prod
on:
  workflow_dispatch:
    inputs:
      sha: { description: 'Commit SHA to migrate to (must be on main)', required: true }
permissions: { contents: read }
concurrency: { group: prod-migrate, cancel-in-progress: false }
jobs:
  migrate:
    runs-on: ubuntu-24.04
    timeout-minutes: 20
    environment: production            # required reviewer = founder
    steps:
      - uses: actions/checkout@v4
        with: { ref: '${{ inputs.sha }}' }
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version-file: .nvmrc, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - name: Safety branch (instant restore point)
        uses: neondatabase/create-branch-action@v6
        with:
          project_id: ${{ vars.NEON_PROJECT_ID }}
          parent_branch: main
          branch_name: pre-migrate/${{ inputs.sha }}
          api_key: ${{ secrets.NEON_API_KEY }}
      - name: Lint migrations for destructive statements
        run: pnpm db:migrations:lint      # section 4.2 guardrails
      - name: Apply migrations
        run: pnpm db:migrate
        env: { DATABASE_URL_UNPOOLED: '${{ secrets.PROD_DATABASE_URL_UNPOOLED }}' }
      - name: Post-migration smoke
        run: curl --fail --retry 5 --retry-delay 5 https://${{ vars.PROD_HOST }}/api/health/ready
```

---

## 4. Database migrations

### 4.1 Process
1. Edit Drizzle schema in `packages/db/src/schema/*.ts`.
2. `pnpm db:generate` (`drizzle-kit generate`) writes a numbered SQL file into `packages/db/migrations/` plus snapshot metadata. **Never** use `drizzle-kit push` outside local throwaway DBs.
3. **Review the SQL by hand**: no unexpected `DROP`, `ALTER COLUMN TYPE`, default rewrite on a large table, or lock-heavy statement. Add `-- migration-safety: expand|contract|data` header comment (required by the linter).
4. PR opens: CI creates the Neon branch from `staging`, applies migrations, runs tests/e2e on it (`e2e-preview.yml`).
5. Merge to `main`: migrations applied to `staging` automatically.
6. Production: `db-migrate-prod.yml` (manual, reviewer-gated) takes the safety branch, applies, smoke-tests; the app deploy is promoted afterwards.
7. Rollback: migrations are forward-only. A bad migration is handled by a corrective forward migration, or in a disaster by restoring from the `pre-migrate/<sha>` branch / PITR (section 12.2). Every PR that adds a migration states its rollback strategy.

### 4.2 Zero-downtime rules (expand / contract)
The app version N and N+1 run concurrently during a deploy (Vercel keeps old instances serving briefly). Therefore every migration must be compatible with both.

| Change | Safe sequence |
|---|---|
| Add column | Expand: add as `NULL` (or with a constant default, safe on PG 11+), deploy code that writes it; later backfill; later add `NOT NULL` via `CHECK … NOT VALID` then `VALIDATE CONSTRAINT`, then `SET NOT NULL` |
| Rename column/table | Expand: add new, dual-write in code, backfill in batches (Inngest job, 1k rows/batch); switch reads; Contract (separate release, >= 1 deploy later): drop old |
| Drop column/table | Release 1: stop reading/writing; Release 2 (>= 7 days later): `DROP` |
| Change type | New column + backfill + swap (as rename). Never `ALTER COLUMN TYPE` on tables over 100k rows in business hours |
| Add index | `CREATE INDEX CONCURRENTLY` (Drizzle: hand-edit SQL; cannot run inside a transaction, so isolate in its own migration file) |
| Add FK / unique | `ADD CONSTRAINT … NOT VALID` then `VALIDATE CONSTRAINT`; unique via a concurrently-built unique index then `ADD CONSTRAINT … USING INDEX` |
| Enum value | Prefer lookup tables or `text` + `CHECK`; adding enum values is allowed (`ADD VALUE`), removing is not |
| Big backfill | Never in a migration. Inngest job with batches, `statement_timeout` guard, resumable cursor |

Guardrails: `SET lock_timeout = '3s'; SET statement_timeout = '60s';` at the top of every migration (retry instead of queueing behind long locks). `pnpm db:migrations:lint` (script in `tooling/scripts`) fails on: `DROP TABLE|COLUMN` without `-- migration-safety: contract`, `ALTER COLUMN … TYPE`, `CREATE INDEX` without `CONCURRENTLY` on tables listed in `large-tables.json` (`attempt_answer`, `attempt_event`, `audit_log`, `payment_event`, `lesson_progress`), `NOT NULL` add without default or prior validation, `TRUNCATE`.

Append-only protections (`audit_log`): migration grants the app role only `INSERT, SELECT`; a trigger rejects `UPDATE`/`DELETE`. Migrations run under a separate owner role (`lumen_migrator`); the runtime uses `lumen_app` with DML only, no DDL.

---

## 5. Observability

### 5.1 Signals and tools

| Signal | Tool | Retention | Owner doc |
|---|---|---|---|
| Errors, performance traces, release health | Sentry | 90 days | section 5.2 |
| Structured logs | Vercel logs (7 days on plan) + drain to Better Stack Logs or Axiom (30 days) | 30 days | section 5.3 |
| Product analytics, funnels, session replay (marketing only), web vitals | PostHog | 12 months | section 5.4 |
| Uptime and status page | Better Stack Uptime (free tier is enough at launch; adds probes from multiple regions) | n/a | section 5.5 |
| Database | Neon console metrics + `pg_stat_statements` weekly review job | 7 to 30 days | section 5.6 |
| Job health | Inngest dashboard (failures, retries, latency) | per plan | section 5.6 |
| Cost | Monthly script reading Anthropic/OpenAI/Bunny usage APIs into `kpi_daily` | permanent | section 5.6 |

Better Stack and Axiom are additions not named in 00; they are replaceable vendors with no code coupling (log drain and HTTP checks only).

### 5.2 Sentry (`@sentry/nextjs`, `verify` current major)

```ts
// apps/web/instrumentation-client.ts
import * as Sentry from '@sentry/nextjs';
import { scrubEvent } from '@lumen/core/shared/sentry-scrub';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_APP_ENV,
  release: process.env.NEXT_PUBLIC_RELEASE,           // git SHA, set in CI
  sendDefaultPii: false,                              // never attach IP/cookies/user email
  tracesSampleRate: process.env.NEXT_PUBLIC_APP_ENV === 'production' ? 0.1 : 1.0,
  replaysSessionSampleRate: 0,                        // session replay lives in PostHog, marketing only
  replaysOnErrorSampleRate: 0,                        // OFF: exam shell and checkout contain sensitive content
  ignoreErrors: ['ResizeObserver loop limit exceeded', 'NetworkError when attempting to fetch resource'],
  denyUrls: [/extensions\//i, /^chrome:\/\//i],
  beforeSend: scrubEvent,
  beforeBreadcrumb(b) {
    if (b.category === 'console') return null;        // console may contain user text
    if (b.data?.url) b.data.url = stripQuery(b.data.url);
    return b;
  },
});
```

```ts
// packages/core/src/shared/sentry-scrub.ts
const SENSITIVE_KEYS = /pass(word)?|token|secret|authorization|cookie|set-cookie|otp|code|phone|mobile|email|name|address|nid|essay|answer|transcript|card|bkash|nagad|val_id|session/i;
const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const BD_PHONE = /(?:\+?88)?01[3-9]\d{8}/g;

export function scrubEvent<T extends import('@sentry/core').ErrorEvent>(event: T): T | null {
  if (event.request) { delete event.request.cookies; delete event.request.data; delete event.request.headers; event.request.query_string = undefined; }
  if (event.user) event.user = { id: event.user.id };            // UUID only
  walk(event, (k, v) => (SENSITIVE_KEYS.test(k) ? '[redacted]' : typeof v === 'string' ? v.replace(EMAIL, '[email]').replace(BD_PHONE, '[phone]') : v));
  return event;
}
```

Server config (`instrumentation.ts`): same `beforeSend`, `includeLocalVariables: false`, `tracesSampleRate: 0.1`, and tag every event with `requestId`, `route`, `action`, `domain`. Source maps uploaded in CI via `SENTRY_AUTH_TOKEN` and deleted from the public bundle (`sourcemaps.deleteSourcemapsAfterUpload: true`). Tunnel route `/monitoring` to avoid ad blockers (rate limited). Alert rules in section 5.7. Inngest functions report failures with `Sentry.captureException` plus `jobId`.

Quotas: set Sentry spike protection and a monthly cap; error budget for the Team plan is 50k errors/month (`verify`), so noisy errors are grouped/ignored rather than raising quota.

### 5.3 Structured logs
Conventions in `04` section 8.2. Operational additions:
- Drain Vercel logs to Better Stack/Axiom with source tags `env`, `region`. Saved queries: `level:error`, `errorCode:PAYMENT_*`, `action:exam.*`.
- Log-based metrics (computed in the log tool or PostHog): `autosave_ok`, `autosave_fail`, `webhook_rejected`, `ai_eval_failed`.
- Security events logged at `warn` with `event=security.*` (failed OTP bursts, signature failures, rate-limit hits, impersonation start/stop). These are also written to `audit_log` where staff are involved.

### 5.4 PostHog event taxonomy

Convention:
- Event name: `snake_case`, `<object>_<past_tense_verb>`, singular object, max 3 words. Examples: `signup_completed`, `checkout_started`.
- Properties: `snake_case`, typed, enumerated values lowercase, currency in ISO, money in **minor units**, durations in ms. No free text from users. No email, phone, name, essay or audio content.
- Identity: `distinct_id = analytics_id(user_id)` after consent, a **keyed hash** (HMAC-SHA256 with `ANALYTICS_ID_KEY`, first 32 hex chars) and **never the database UUID, email or phone** (32 Y2); the same id is used in the warehouse; anonymous before consent. `identify` only after sign-in. Super properties: `locale`, `app_env`, `release`, `country` (Cloudflare `cf-ipcountry`, coarse), `device_type`, `role`.
- Consent: PostHog loads only after analytics consent (cookie banner); until then only Tier-0 aggregate, non-identifying server-side counts are kept (32 section 8.3); money and exam KPIs are read from Postgres views, not from consent-dependent PostHog events (32 Y4). Under-18 users: analytics off. Session replay enabled on `(marketing)` routes only with `maskAllInputs`; **never** on `(exam)`, `(auth)`, `(checkout)`, `(learner)`, `(studio)`, `(grader)`, `(staff)`, `(org)` or `(admin)`.
- Source of truth: `packages/core/src/analytics/events.ts` exports a typed `track<E extends keyof EventMap>(event, props)`; an unlisted event name fails typecheck. Server-emitted events for money and exam state (they must not depend on ad blockers).

Core funnel events:

| Funnel | Event | Key properties | Emitted from |
|---|---|---|---|
| Acquisition | `page_viewed` | `route_group`, `locale`, `utm_source`, `utm_medium`, `utm_campaign`, `referrer_host` | client |
| Acquisition | `cta_clicked` | `cta_id`, `placement` | client |
| Activation | `signup_started` | `method` (google, email_otp, phone_otp) | client |
| Activation | `signup_completed` | `method`, `age_band`, `locale` | server |
| Activation | `diagnostic_started` | `track` (ielts_academic, ielts_gt, gre) | server |
| Activation | `diagnostic_completed` | `track`, `duration_ms`, `estimated_band_bucket` | server |
| Activation | `diagnostic_result_viewed` | `track`, `gated` (bool) | client |
| Engagement | `lesson_started` | `course_id`, `lesson_id`, `lesson_type` | client |
| Engagement | `lesson_completed` | `course_id`, `lesson_id`, `watch_pct` | server |
| Engagement | `video_played` | `lesson_id`, `quality`, `ttff_ms` | client |
| Engagement | `video_stalled` | `lesson_id`, `stall_ms`, `quality` | client |
| Exam | `attempt_started` | `test_id`, `track`, **`mode` (exam, practice)** = the DB `attempt_mode`, **`scope` (full, section)**, `resumed` (32 Y3: the earlier `mode` values full/section/practice are split into `scope` + `mode`; "timed practice" = `mode = exam`) | server |
| Exam | `section_started` / `section_submitted` | `attempt_id`, `section_type`, `time_used_ms`, `auto_submitted` | server |
| Exam | `attempt_submitted` | `attempt_id`, `duration_ms`, `answered_pct` | server |
| Exam | `attempt_abandoned` | `attempt_id`, `last_section`, `idle_ms` | server (cron) |
| Exam | `autosave_failed` | `attempt_id`, `http_status`, `retry_n` | client |
| Evaluation | `evaluation_requested` | `kind` (writing, speaking, awa), `credits_used` | server |
| Evaluation | `evaluation_completed` | `kind`, `latency_ms`, `provider`, `cost_usd_micros` | server |
| Evaluation | `evaluation_failed` | `kind`, `stage`, `error_code` | server |
| Monetisation | `pricing_viewed` | `currency`, `locale` | client |
| Monetisation | `checkout_started` | `product_type`, `product_id`, `currency`, `amount_minor`, `coupon_applied` | server |
| Monetisation | `payment_method_selected` | `provider`, `channel` (bkash, nagad, card, …) | server |
| Monetisation | `order_paid` | `order_id`, `product_type`, `currency`, `amount_minor`, `provider`, `first_purchase` | server (webhook-verified) |
| Monetisation | `payment_failed` | `provider`, `reason_code` | server |
| Monetisation | `refund_issued` | `order_id`, `amount_minor`, `reason` | server |
| Retention | `streak_extended` / `streak_broken` | `length` | server |
| Retention | `renewal_reminder_sent` / `pass_renewed` | `days_before_expiry` | server |
| Retention | `nps_submitted` | `score` | client |
| Reliability | `web_vital_reported` | `name` (LCP, INP, CLS, TTFB), `value`, `rating`, `route_group`, `country` | client (`web-vitals`) |

Further event families (support, finance, AI tutor, guarantee, lifecycle messaging) and the KPI tree/north-star are defined in 32; the 52 domain events added in 06 section 7.1 map to analytics events through the fixed table in 32 section 5.12. Dashboards to ship at launch: (1) Acquisition to activation funnel; (2) Diagnostic to checkout funnel with BD vs international split; (3) Payment success by provider/channel; (4) Exam reliability (autosave failure rate, abandonment); (5) AI evaluation latency, failure and cost; (6) Web vitals by country (Bangladesh filter) and route group.

### 5.5 Uptime checks and status page
Better Stack Uptime (or equivalent), probes from at least 3 regions including Asia (Singapore, Mumbai-region equivalents) at 1-minute intervals:

| Check | Target | Expect | Alert after |
|---|---|---|---|
| Home | `GET /bn` | 200, body contains brand marker, < 3 s | 2 consecutive failures |
| Catalogue | `GET /en/courses` | 200 | 2 |
| Auth session | `GET /api/auth/get-session` | 200 JSON | 2 |
| Readiness | `GET /api/health/ready` (checks DB `SELECT 1`, Inngest reachability flag, R2 head) | 200 | 2 |
| Inngest endpoint | `GET /api/inngest` introspection (signed) or Inngest dashboard heartbeat | 200 | 3 |
| Exam synthetic | Scheduled Playwright (every 15 min, GitHub Actions cron against production): sign in as synthetic student, start a 2-minute probe test, autosave 3 times, submit | all green | 1 failure (page) |
| Checkout synthetic | Sandbox-mode only in staging, every 6 h: create order, simulate IPN | green | 2 |
| TLS/domain | cert expiry < 14 days, domain expiry < 30 days | | warn |
| Heartbeats | Inngest cron pings Better Stack heartbeat URL every 5 min; nightly backup job pings daily heartbeat | | missed 2 |

Status page: `status.<domain>` hosted by the vendor on a **different provider and DNS zone dependency** from the app (so it survives app outage). Components: Website, Sign-in, Payments, Mock tests, AI evaluation, Video. Updates posted per section 11.

### 5.6 SLOs and error budgets

| SLO | Target | Measurement window | SLI definition | Error budget |
|---|---|---|---|---|
| Availability (web + API) | **99.9%** | 30 days rolling | Successful synthetic checks / total, plus 5xx ratio < 0.1% of requests | 43.8 min per 30.4-day month |
| **Exam autosave success** | **>= 99.95%** | 7 days rolling and per exam session | `autosave 2xx or 409-stale` / all autosave requests excluding client-offline; measured server-side AND by client `autosave_failed` events | 0.05% (5 failures per 10,000 saves) |
| Exam answer loss | 0 lost answers after an `applied`/`highestAppliedSeq` ack | per incident | Reconciliation job compares client final state hash vs server on submit | zero tolerance: any occurrence is SEV1 |
| Page TTFB, marketing/catalogue, Dhaka | p75 < 400 ms, **p95 < 800 ms** | 28 days, PostHog `web_vital_reported` TTFB, country = BD | RUM | alert if p95 > 1,000 ms for 1 h |
| Page TTFB, `/app/**` dashboard and lessons (dynamic), Dhaka | p95 < 1,200 ms | 28 days | RUM | |
| Autosave latency | p95 < 300 ms, p99 < 800 ms (server processing + network from Dhaka measured by RUM < 1,000 ms) | 7 days | handler duration histogram | |
| Test start (create/resume attempt) | p95 < 1,500 ms | 7 days | | |
| Checkout success (technical) | >= 99% of initiated sessions reach the provider page | 30 days | | |
| Payment fulfilment | 99.9% of verified payments grant entitlement within 60 s; 100% within 10 min | 30 days | `order.paid_at` to `entitlement.created_at` | |
| AI evaluation latency | writing p95 < 60 s, speaking p95 < 180 s | 7 days | | |
| AI evaluation success | >= 99% completed without manual action | 7 days | | |
| Email delivery (receipts/OTP) | OTP email p95 < 30 s; SMS OTP p95 < 20 s | 7 days | provider timestamps | |

Burn-rate policy: if >50% of the monthly availability or autosave budget is consumed in the first 10 days, freeze feature deploys (only reliability fixes) until the burn rate recovers. During scheduled exam events (marketing webinars, "mock test day") also freeze deploys 24 h prior.

### 5.7 Alerting and runbook

Channels: P1 (page) to the founder's phone via Better Stack call/SMS + Telegram/WhatsApp-capable push; P2 to Slack/Telegram channel and email; P3 weekly digest. A second contact (trusted friend/contractor) is added as escalation after 15 minutes without acknowledgement.

| Alert | Condition | Severity | First response |
|---|---|---|---|
| Site down | Home or ready check fails from 2+ regions for 2 min | P1 | Runbook R1 |
| Exam autosave degraded | autosave failure rate > 0.05% over 5 min, or any 5xx burst > 1% over 2 min | P1 | R2 |
| Payment webhook failing | webhook 5xx or Inngest `payment/event.received` failure count >= 3 in 10 min; or `payment.status=suspicious` | P1 | R3 |
| Orders paid but no entitlement | reconciliation query finds `order.paid` with no entitlement after 10 min | P1 | R3 |
| Error rate spike | Sentry: new issue with > 20 events in 5 min, or error rate > 2% | P2 (P1 if in exam or checkout routes) | R4 |
| DB saturation | Neon CPU > 80% for 10 min, or connections > 80% of limit | P2 | R5 |
| AI provider failing | `evaluation_failed` > 10% in 15 min, or provider 5xx | P2 | R6 (flip `ai.provider.primary`) |
| Queue backlog | Inngest oldest queued run > 10 min | P2 | R7 |
| Email/SMS provider | OTP delivery failure > 5% in 15 min | P2 | switch provider via `SMS_PROVIDER` / failover |
| Backup missed | nightly backup heartbeat missed | P2 (P1 after 2 nights) | R8 |
| Cert/domain expiry | < 14 days | P3 | renew |
| Security anomaly | burst of `security.*` events (signature failures, OTP brute force, admin login from new country) | P1 | section 10 + doc 09 |
| Budget | Anthropic/OpenAI spend > 150% of 7-day average | P2 | check abuse, lower caps |

Runbooks (each is a numbered checklist stored in `docs/runbooks/R<n>-*.md`; core steps):
- **R1 Site down**: (1) check status of Vercel, Cloudflare, Neon dashboards; (2) open the latest deployment, if a deploy within 30 min preceded the failure, **instant rollback** via Vercel (promote previous deployment); (3) if DB errors, check Neon status/branch, connection count; set `exam.new_attempts.disabled` flag if DB degraded; (4) if Cloudflare issue, switch the DNS record to "DNS only" (grey cloud) to bypass proxy; (5) post status page update within 10 min; (6) open incident record.
- **R2 Autosave degraded**: (1) `SELECT count(*) FROM pg_stat_activity` and slow queries; (2) check the last deploy diff for `exam-engine`; (3) scale Neon max CU up one step; (4) if rate limit misfire, relax per-IP rule (carrier-grade NAT in BD means many users share IPs; rate limits must key on user/attempt, not only IP); (5) clients retry from IndexedDB, so data is not lost while the server recovers; announce via banner (flag `banner.exam_degraded`).
- **R3 Payments**: (1) check Inngest function runs for failures, retry from dashboard (idempotent); (2) verify provider status page (SSLCommerz, Paddle); (3) run `pnpm ops:reconcile-payments --since 24h` which re-validates unfinished SSLCommerz transactions through the Validation API and grants missing entitlements; (4) notify affected users via support template; (5) never grant entitlements manually without the order id (support tool logs and audits).
- **R5 DB**: check long-running queries, kill offenders, add index if known, raise CU; consider disabling heavy reports (flag).
- **R6 AI**: set `ai.provider.primary=gemini`; if both fail, set `evaluation.queue.paused=true` (requests accepted, credits not debited until processing) and show banner; refunds happen automatically on terminal failure.
- **R8 Backup**: rerun workflow `db-backup`; verify R2 object size; if Neon PITR is healthy RPO is not at risk, but fix within 24 h.

---

## 6. Backups and disaster recovery

### 6.1 Layers

| Layer | Mechanism | Frequency | Retention | Protects against |
|---|---|---|---|---|
| L1 PITR | Neon point-in-time restore (history window per plan; set to the maximum available on the chosen plan, `verify`, historically 7 days on entry plans and up to 30 on higher plans) | continuous | plan window | bad deploy/migration, accidental deletion, app bug corrupting data |
| L2 Pre-migration branch | Neon branch `pre-migrate/<sha>` | each prod migration | delete after 14 days | migration mistakes |
| L3 Nightly logical dump | `pg_dump --format=custom` of production, `age`-encrypted, uploaded to **R2 bucket `lumen-backups`** | nightly 02:30 Asia/Dhaka | 35 daily + 12 monthly (R2 lifecycle rules) | Neon account/region loss, credential compromise, retention gap |
| L4 R2 content | R2 versioning not available as a recoverable replacement; keep source media originals in Bunny library + weekly `rclone sync` of private bucket to a second R2 account or Backblaze B2 | weekly | 8 weeks | accidental object deletion |
| L5 Config | Infra-as-code in repo; env var inventory exported (names only) to `docs/ops/env-inventory.md`; secrets in password manager with recovery kit | on change | n/a | lost laptop/account |

Backup bucket security: separate Cloudflare account (or at minimum separate API token) with **write-only** token used by CI (cannot delete); restore token is held offline by the founder. The `age` private key is stored in the password manager and a printed sealed copy; the public key is in the repo (`ops/backup.age.pub`). Test that the private key decrypts a recent dump during every drill.

### 6.2 Nightly dump workflow

```yaml
# .github/workflows/db-backup.yml
name: db-backup
on:
  schedule: [{ cron: '30 20 * * *' }]   # 20:30 UTC = 02:30 Asia/Dhaka
  workflow_dispatch:
permissions: { contents: read }
jobs:
  dump:
    runs-on: ubuntu-24.04
    timeout-minutes: 45
    environment: production-backup
    steps:
      - uses: actions/checkout@v4
      - name: Install PG 17 client and age
        run: |
          sudo install -d /usr/share/postgresql-common/pgdg
          sudo curl -fsSL -o /usr/share/postgresql-common/pgdg/apt.postgresql.org.asc https://www.postgresql.org/media/keys/ACCC4CF8.asc
          echo "deb [signed-by=/usr/share/postgresql-common/pgdg/apt.postgresql.org.asc] https://apt.postgresql.org/pub/repos/apt noble-pgdg main" | sudo tee /etc/apt/sources.list.d/pgdg.list
          sudo apt-get update && sudo apt-get install -y postgresql-client-17 age
      - name: Dump, encrypt, upload
        env:
          PGURL: ${{ secrets.PROD_DATABASE_URL_UNPOOLED }}          # read-only role `lumen_backup`
          AGE_RECIPIENT: ${{ vars.BACKUP_AGE_PUBLIC_KEY }}
          AWS_ACCESS_KEY_ID: ${{ secrets.BACKUP_R2_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.BACKUP_R2_SECRET }}
          R2_ENDPOINT: https://${{ vars.BACKUP_R2_ACCOUNT_ID }}.r2.cloudflarestorage.com
        run: |
          set -euo pipefail
          STAMP=$(date -u +%Y/%m/%d/%H%M)
          pg_dump "$PGURL" --format=custom --no-owner --no-privileges --compress=6 \
            | age -r "$AGE_RECIPIENT" > dump.pgc.age
          sha256sum dump.pgc.age | tee dump.sha256
          aws s3 cp dump.pgc.age "s3://lumen-backups/prod/${STAMP}/dump.pgc.age" --endpoint-url "$R2_ENDPOINT"
          aws s3 cp dump.sha256   "s3://lumen-backups/prod/${STAMP}/dump.sha256"   --endpoint-url "$R2_ENDPOINT"
          test "$(stat -c%s dump.pgc.age)" -gt 1000     # sanity size floor; tune to real size
      - name: Heartbeat
        run: curl -fsS "${{ secrets.BETTERSTACK_BACKUP_HEARTBEAT_URL }}"
```

### 6.3 RPO / RTO

| Scenario | RPO | RTO | Procedure |
|---|---|---|---|
| Bad deploy | 0 | 5 min | Vercel instant rollback (R1) |
| Bad migration / data corruption | <= 1 min (PITR) | 30 to 60 min | Restore Neon branch to timestamp, verify, repoint `DATABASE_URL` (or swap branch to primary) |
| Accidental table/row deletion | <= 1 min | 1 to 2 h | Branch at pre-delete time, `INSERT … SELECT` the rows back via postgres_fdw/dblink or dump/load of the affected tables |
| Neon region/account loss | <= 24 h (nightly dump) | **4 h** target (8 h worst case) | New Postgres (Neon different region, or Hetzner Singapore + Coolify), restore latest dump, redeploy, update env/DNS, run payment reconciliation to recover orders between dump and outage from SSLCommerz/Paddle records |
| Vercel outage | 0 | 4 h | Deploy the Docker image to Hetzner/Coolify (budget path in `04` section 12.2), DNS cutover via Cloudflare (TTL 60 s) |
| R2 object loss | <= 7 days | 24 h | `rclone` restore from secondary |
| Founder unavailable (account lockout) | n/a | 24 h | Break-glass: sealed recovery kit with a designated trusted person, 2FA recovery codes; documented in `docs/ops/break-glass.md` |

### 6.4 Monthly restore drill (first Saturday, timebox 90 min; record in `docs/ops/restore-drills.md`)
1. Pick the latest nightly object from R2 and a random older one (> 14 days).
2. Download, verify `sha256sum -c dump.sha256`.
3. Decrypt: `age -d -i <identity-file> dump.pgc.age > dump.pgc` (identity from password manager; shred after).
4. Create scratch DB: `createdb lumen_restore` on local Docker `postgres:17` (never on production).
5. `pg_restore --no-owner --dbname lumen_restore --jobs 4 dump.pgc`.
6. Run `pnpm ops:verify-restore` which checks: row counts within 1% of production counts for `user`, `order`, `entitlement`, `attempt`; latest `order.paid_at` within 26 h of now; FK integrity (`SELECT` orphan checks); `audit_log` hash chain verifies.
7. Boot the app against the restored DB (`pnpm dev` with `DATABASE_URL` set) and sign in as seeded synthetic user, open a past attempt result.
8. **PITR drill** (quarterly): create a Neon branch at "now minus 1 hour", verify a known row state, delete branch.
9. Record: duration (compare to RTO), problems, fixes. Failing a drill is a P2 incident.
10. Delete scratch DB and local dump (`shred -u`).

---

## 7. Incident response, on-call and status

### 7.1 Severity

| Sev | Definition | Examples | Response | Comms |
|---|---|---|---|---|
| SEV1 | Core service down, data loss/exposure, or active exam disrupted for many | site down, autosave failing, payments not fulfilling, suspected breach | Immediately, any hour (within 15 min) | Status page in 10 min, then every 30 min |
| SEV2 | Major feature degraded, workaround exists | AI evaluation down, video playback issues, OTP delays | Within 1 h in waking hours (07:00 to 23:00 Asia/Dhaka) | Status page |
| SEV3 | Minor/cosmetic, single-user | layout bug, one failed email | Next business day | none |

### 7.2 Solo-founder on-call model
- Waking-hours coverage with an explicit **quiet window 23:30 to 06:30 Asia/Dhaka**: only the SEV1 triggers listed in 5.7 page overnight (site down, autosave failure during a scheduled exam, payment fulfilment failure, security anomaly). Everything else waits until morning.
- Reduce pages by design: auto-rollback (Vercel instant rollback is one click; script `pnpm ops:rollback`), idempotent retries, automatic refunds of AI credits, client-side autosave queue, circuit breaker for AI providers, queue pause flag.
- **Scheduled exam events** (published "mock test day"): founder on duty for the window, deploy freeze 24 h before, synthetic checks every 5 min, pre-scaled Neon min CU, status page pre-notice.
- Escalation contact (trusted peer/contractor) with read-only dashboards access and the break-glass kit; hand-off notes template in `docs/runbooks/handoff.md`.
- Tooling: phone with Better Stack app + Vercel + Sentry + Neon apps; password manager emergency access; a hotspot/SIM for outages (Bangladesh power/ISP interruptions), and a documented secondary internet path.
- Support triage: `support` role members see incident banner with canned replies; support tickets from the first 15 minutes of an incident are tagged `incident-<id>`.

### 7.3 Incident procedure
1. **Detect/declare**: acknowledge page; create `docs/incidents/YYYY-MM-DD-<slug>.md` from template (timeline in UTC and Asia/Dhaka).
2. **Stabilise first**: rollback, flag off, pause queue, fail over. Diagnosis comes after impact stops.
3. **Communicate**: status page "Investigating" (within 10 min SEV1), then updates each 30 min; email affected users after resolution if data or payment was involved.
4. **Security incidents** (suspected data exposure): preserve logs, rotate secrets (`docs/runbooks/secret-rotation.md`), revoke sessions (`UPDATE session SET expires_at = now()`), consider legal notification duties (Bangladesh and GDPR/other jurisdictions where affected users reside; consult counsel); detailed in doc 09.
5. **Resolve**: confirm SLIs recovered for 30 min; close status.
6. **Post-incident review within 5 days** (blameless): timeline, root cause (5 whys), what worked, action items with owners/dates added to `docs/PROGRESS.md`. SEV1/SEV2 only. Update runbooks and add a regression test or alert.

**Global exam incident (GA-040, 07 section 5.8a).** If our outage hits an exam in progress (scheduled mock day or organic): (1) stabilise; (2) set the banner flag "exam incident" (in-app message on `(exam)` and the status page); (3) run the bulk script `ops:extend-active-attempts --minutes N --incident <id>` which writes `time_extended` events for every running section in the affected window (audited, one `attempt.time_extended` per attempt, learner notified); (4) for learners whose section expired during the outage, bulk `voidSection` with reissue under the incident id (does not consume the once-per-attempt self-serve void); (5) support macro for "my exam crashed" links the incident id; (6) post-incident review includes integrity impact (did anyone gain advantage). Deploy freeze applies 24 h before scheduled events (7.2).

Runbooks are one directory, `docs/runbooks/` (skeleton created in P0-44): `R1..R7-*.md` (5.7), `secret-rotation.md` (**the single canonical filename; D12/C15**, linked from 09 section 11.2 and 28), `breach.md`, `handoff.md`, `status-templates.md`, `exam-incident.md`, `rescore.md` (GA-044), `leak-response.md` (27, GA-026), `support-outage-drill.md`.

Status page copy templates live in `docs/runbooks/status-templates.md` (Investigating, Identified, Monitoring, Resolved) in English and Bangla.

---

## 8. Performance budgets

### 8.1 Core Web Vitals targets (field data, p75, mobile, Bangladesh)

| Metric | Target | Test condition |
|---|---|---|
| LCP | **< 2.5 s** on 4G in Dhaka | Lab: Lighthouse mobile with throttling "Slow 4G"-class profile (1.6 Mbps down, 150 ms RTT) and CPU 4x slowdown (mid-range Android such as Moto G Power). Field: PostHog `web_vital_reported` country=BD |
| INP | **< 200 ms** | Field; lab proxy: Playwright interaction timing on exam question switch < 100 ms |
| CLS | **< 0.1** | Reserve media dimensions, font-display swap with size-adjusted fallback (Bangla fonts) |
| TTFB | see SLO table 5.6 | |

### 8.2 JS and asset budgets (gzip/brotli transferred, first load per route, enforced by `pnpm bundle:check` reading `.next/app-build-manifest` / `next build` output and failing CI)

| Route group | Initial JS budget | Notes |
|---|---|---|
| `(marketing)` | **<= 120 KB** | Mostly RSC; no client state libs; Motion loaded only for components needing it |
| `(auth)` | <= 110 KB | Turnstile script is third-party, loaded on interaction/visible |
| `(learner)` lesson player (`/app/learn/**`) | <= 200 KB (excluding Bunny player iframe) | Player is iframe-isolated; Tiptap renderer is read-only (no editor) |
| `(exam)` shell (`/exam/[attemptId]`) | <= 260 KB for shell + engine; question renderers lazy-loaded per type; audio/recording code only for Listening/Speaking | Must work on 2 GB RAM phones |
| `(learner)` dashboard (`/app`) | <= 180 KB | Charts lazy-loaded |
| `(studio)` | <= 450 KB (Tiptap editor, tables) | Behind login; code-split from everything else |
| `(admin)` | <= 350 KB | |
| Any single third-party | PostHog, Sentry, Turnstile loaded after `requestIdleCallback`/consent; total third-party JS <= 100 KB on marketing | |

Other rules:
- Images: `next/image`, AVIF disabled until the pinned Next.js image advisories are clear (WebP default), explicit width/height, `sizes`, hero <= 150 KB, no image > 300 KB, `loading="lazy"` below the fold, `priority` only on the LCP image.
- Fonts: self-hosted (Inter variable, Noto Sans Bengali / Hind Siliguri subset to needed weights, `font-display: swap`, `unicode-range` split for Bangla; preload only the primary Latin and Bangla text weight; total font payload <= 150 KB for first view.
- Video: HLS adaptive; default start quality 480p on Save-Data / `effectiveType` 3g or lower; cap 720p in lessons, 1080p only for explicitly marked lessons; poster image <= 40 KB; preconnect to Bunny origin; no autoplay with sound; thumbnails via Bunny.
- Caching headers: `/_next/static/*` immutable one year; fonts immutable; exam section payload immutable by content hash.
- No layout-blocking third-party scripts; no synchronous `<script>` in head.
- Respect `prefers-reduced-motion` and `Save-Data`.

### 8.3 Lighthouse CI — `lighthouserc.json`

```json
{
  "ci": {
    "collect": {
      "url": ["/bn", "/en/courses", "/en/courses/ielts-academic", "/en/pricing", "/en/sign-in"],
      "numberOfRuns": 3,
      "settings": {
        "formFactor": "mobile",
        "throttling": { "rttMs": 150, "throughputKbps": 1638, "cpuSlowdownMultiplier": 4 },
        "screenEmulation": { "mobile": true, "width": 412, "height": 823, "deviceScaleFactor": 2.625, "disabled": false },
        "onlyCategories": ["performance", "accessibility", "best-practices", "seo"]
      }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.85 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 0.95 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "total-blocking-time": ["error", { "maxNumericValue": 300 }],
        "server-response-time": ["warn", { "maxNumericValue": 800 }],
        "total-byte-weight": ["warn", { "maxNumericValue": 1200000 }],
        "unused-javascript": ["warn", { "maxNumericValue": 60000 }],
        "uses-text-compression": "error",
        "uses-responsive-images": "warn"
      }
    },
    "upload": { "target": "temporary-public-storage" }
  }
}
```
Lighthouse runs its default mobile config with the explicit throttling block above (single source of truth). Preview URLs require the Vercel automation-bypass header via `extraHeaders`. Lab-only checks run on previews; production field data comes from RUM. Exam route (`/exam/...`) is covered by Playwright performance assertions (JS budget, interaction timings) because it needs auth state.

---

### 8.4 Real-device and field targets (GA-039)

Lab Lighthouse is necessary but not sufficient for Bangladesh. Test matrix before launch and quarterly: a low-end Android (2-3 GB RAM, Chrome, throttled 3G/4G profile), a mid Android, and iOS Safari; scenarios: marketing home, lesson player (480p default on mobile data, 720p max), exam shell with autosave over a flaky link, checkout return. Monitor field data with Chrome UX Report plus our own `web_vital_reported` RUM sliced by `country=BD`; the exam shell has its own bundle budget separate from marketing (8.2). Image/video default quality policy: 480p mobile default.

## 9. Load testing plan (k6)

Goal: prove the exam start storm and sustained autosave load before launch and before every scheduled "mock test day".

### 9.1 Scenario: 2,000 concurrent mock-test takers

Targets per D6: autosave every 10 s plus debounced change saves (<= 1 per second while the user is actively answering). Model per user: 1 heartbeat+autosave tick every 10 s, plus change saves averaging 0.2/s for active users. At 2,000 users: baseline about 200 req/s ticks plus about 400 req/s change saves = **about 600 req/s peak autosave**, plus start storm of 2,000 attempt starts in 2 minutes (about 17/s) each fetching a section payload.

Test environment: staging project with production-equivalent Neon compute (min CU set as production), sandbox providers, AI calls stubbed. Seed 2,500 synthetic students and a 150-question test (`pnpm db:seed --profile loadtest`). Pre-generate session cookies via an admin script into `loadtest/users.json` (never commit). Run from a Singapore-region runner (k6 Cloud or a Hetzner Singapore VM) AND from a Dhaka-connected machine for latency realism.

```js
// loadtest/exam-storm.js  — run: k6 run -e BASE_URL=https://staging.example.com loadtest/exam-storm.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import { Trend, Rate, Counter } from 'k6/metrics';
import exec from 'k6/execution';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

const users = new SharedArray('users', () => JSON.parse(open('./users.json'))); // [{ cookie, testFormCode }]
const BASE = __ENV.BASE_URL;

const autosaveDuration = new Trend('autosave_duration', true);
const startDuration = new Trend('attempt_start_duration', true);
const autosaveOk = new Rate('autosave_ok');
const lostAck = new Counter('autosave_lost_ack');

export const options = {
  scenarios: {
    exam_storm: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 2000 },    // start storm
        { duration: '20m', target: 2000 },   // steady exam (compressed 60-min section pattern)
        { duration: '3m', target: 0 },       // submit wave
      ],
      gracefulRampDown: '1m',
    },
  },
  thresholds: {
    autosave_ok: ['rate>=0.9995'],                         // SLO: 99.95%
    autosave_duration: ['p(95)<300', 'p(99)<800'],
    attempt_start_duration: ['p(95)<1500'],
    http_req_failed: ['rate<0.0005'],
    autosave_lost_ack: ['count==0'],
    checks: ['rate>0.999'],
  },
};

export default function () {
  const u = users[(exec.vu.idInTest - 1) % users.length];
  const headers = { Cookie: u.cookie, 'Content-Type': 'application/json' };

  // 1. start (or resume) attempt
  const t0 = Date.now();
  const start = http.post(`${BASE}/api/exam/attempts`, JSON.stringify({ testFormCode: u.testFormCode, mode: 'exam' }),
    { headers: { ...headers, 'Idempotency-Key': `${exec.vu.idInTest}-${exec.scenario.iterationInTest}` }, tags: { name: 'start' } });
  startDuration.add(Date.now() - t0);
  if (!check(start, { 'start 200/201': (r) => r.status === 200 || r.status === 201 })) return;
  const { attemptId } = start.json();
  const claim = http.post(`${BASE}/api/exam/attempts/${attemptId}/session`, JSON.stringify({ deviceId: `k6-${exec.vu.idInTest}` }), { headers, tags: { name: 'session' } });
  const epoch = claim.json('epoch');
  http.post(`${BASE}/api/exam/attempts/${attemptId}/sections/1/start`, '{}', { headers, tags: { name: 'section_start' } });
  const payload = http.get(`${BASE}/api/exam/attempts/${attemptId}/sections/1`, { headers, tags: { name: 'section_payload' } });
  const itemIds = payload.json('items').map((i) => i.itemId);

  // 2. answer loop for the compressed section: ticks every 10 s, change saves ~ every 4-8 s (headers carry X-Lumen-Client: exam-shell and Origin in the real script)
  let seq = 0;
  const endAt = Date.now() + 18 * 60 * 1000;
  while (Date.now() < endAt) {
    const burst = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < burst; i++) {
      seq += 1;
      const q = itemIds[Math.floor(Math.random() * itemIds.length)];
      const body = JSON.stringify({ sectionPosition: 1, epoch, batchId: uuidv4(), clientSentAt: new Date().toISOString(),
        changes: [{ itemId: q, seq, answer: { choice: 'ABCD'[seq % 4] }, flagged: false, timeSpentMs: 4000 }] });
      const t = Date.now();
      const res = http.put(`${BASE}/api/exam/attempts/${attemptId}/responses`, body, { headers, tags: { name: 'autosave' } });
      autosaveDuration.add(Date.now() - t);
      const ok = res.status === 200 && res.json('highestAppliedSeq') >= seq;   // 'stale' results also count as acked
      autosaveOk.add(ok);
      if (res.status === 200 && !ok && res.json('results.0.status') === 'applied') lostAck.add(1);
      sleep(1 + Math.random());
    }
    http.post(`${BASE}/api/exam/attempts/${attemptId}/heartbeat`, JSON.stringify({ sectionPosition: 1, epoch, visibility: 'visible', online: true, clientTime: new Date().toISOString(), lastSeq: seq }), { headers, tags: { name: 'heartbeat' } });
    sleep(6 + Math.random() * 4);
  }

  // 3. submit
  const sub = http.post(`${BASE}/api/exam/attempts/${attemptId}/sections/1/submit`, '{}', { headers, tags: { name: 'submit' } });
  check(sub, { 'submit 200': (r) => r.status === 200 });
}
```

Companion scenarios (separate files, run on a schedule before launch and monthly):
1. `browse-spike.js`: 5,000 VUs hitting cached marketing pages and catalogue (ramping-arrival-rate 300 rps) to confirm CDN and cache headers; threshold p95 < 800 ms, error rate < 0.1%.
2. `checkout-burst.js`: 100 concurrent checkout creations with sandbox SSLCommerz and simulated IPN replay (including duplicates) to confirm idempotency (exactly one entitlement per order).
3. `ai-queue.js`: 500 evaluation requests in 5 minutes with stubbed LLM latency 15 s; verify Inngest concurrency caps, credit ledger consistency, p95 queue wait < 120 s.
4. `soak.js`: 500 VUs for 4 hours to expose connection leaks.
5. `deadline-edge.js`: submit/autosave at `ends_at + 29 s` (accepted) and `+31 s` (rejected `409 exam/section-closed`), plus offline-replay cases (exam mode: replay within the 30 s grace accepted, after it rejected; practice mode: replay accepted at any time), validates D6 invariants.

Pass criteria: all thresholds green in 3 consecutive runs; Neon CPU peak < 70%, connections < 70% of the pooler limit; no Vercel function timeouts; Sentry no new unhandled errors; post-run integrity query: for every attempt, the highest acknowledged `seq` equals the stored `attempt_response.last_seq` (unpacked counter) for the answered item. Results saved to `docs/ops/loadtests/YYYY-MM-DD.md` with graphs. Tuning levers in order: index/query review, Neon CU, per-attempt rate limit, batching client saves, moving the autosave handler to a dedicated service (S3 in `04`).

Production safety: never run load tests against production except the synthetic probe. Announce to providers when stressing sandbox endpoints (SSLCommerz sandbox, Resend: use a sink domain).

---

## 10. Cloudflare and platform hardening (operational settings)

- DNS in Cloudflare; apex and `www` proxied (orange cloud) to Vercel. SSL mode **Full (strict)**. Always Use HTTPS. HSTS 6 months at first, then 1 year with preload after launch validation. Min TLS 1.2. Automatic HTTPS rewrites on. Brotli on. HTTP/3 on.
- Cache: bypass HTML (P1); cache static assets only (`/_next/static/*`, `/fonts/*`).
- WAF custom rules (order matters), expressions in Cloudflare syntax:

| # | Action | Expression (summary) | Purpose |
|---|---|---|---|
| 1 | Skip (allow) | `(http.request.uri.path matches "^/api/webhooks/(paddle|stripe|bunny|resend)")` AND source IP in provider allow-list where published; for SSLCommerz IPN allow only POST | Don't challenge providers |
| 2 | Block | `(http.request.uri.path contains "/.env" or contains "/.git" or contains "wp-admin" or contains "wp-login" or contains "phpmyadmin")` | Scanner noise |
| 3 | Managed Challenge | `(http.request.uri.path in {"/en/sign-in" "/bn/sign-in" "/en/sign-up" "/bn/sign-up"} and cf.threat_score gt 20)` plus Turnstile in-app | Credential stuffing |
| 4 | Block | `(http.request.uri.path wildcard "/api/auth/*" and http.request.method eq "POST" and cf.bot_management.score lt 5)` if Bot Management available; else rely on rate limit | |
| 5 | Challenge | `(http.request.uri.path wildcard "/admin*" and ip.geoip.country ne "BD" and not cf.client.bot)` or enforce Cloudflare Access (Zero Trust free tier) on `/admin` for staff emails | Admin exposure |
| 6 | Block | `(http.request.uri.query contains "<script" or contains "union select")` plus managed OWASP ruleset | Basic injection noise |

- Rate limiting rules (Cloudflare, in addition to app-level limits keyed by user/attempt; remember CGNAT in BD, so keep IP-level limits generous and combine with user-level in app):

| Path | Limit | Action |
|---|---|---|
| `POST /api/auth/*` (sign-in, OTP send/verify) | 20 req / 1 min / IP; app: 5 OTP sends / hour / phone and email | block 10 min |
| `PUT /api/exam/attempts/*/responses` | 300 req / 1 min / IP (CGNAT headroom); app: rate class `exam`, 120 req/min per attempt | managed challenge off (never challenge exam traffic), log only above limit then block at 1,000 |
| `POST /api/webhooks/*` | 120 req / 1 min / IP (except allow-listed) | block |
| Checkout creation | 10 / 10 min / IP, app: 5 / 10 min / user | challenge |
| AI evaluation request | app only: 10 / hour / user, daily cap by plan | |
| General `/api/*` | 600 / 1 min / IP | challenge |

- Cloudflare Turnstile: signup, OTP request, checkout, contact (D3). Server verifies token on every protected action.
- Email authentication: SPF, DKIM (Resend), DMARC `p=quarantine` then `reject` after 30 days of clean reports; separate sending subdomain `mail.<domain>`.

---

## 11. Launch checklist

Owners: F = founder, A = agent task. Each item has an evidence column to fill (screenshot, link, command output) in `docs/ops/launch-evidence.md`.

### 11.1 Domain, DNS, edge
- [ ] Domain registered with registrar 2FA and lock; auto-renew on; WHOIS privacy.
- [ ] Cloudflare zone active; nameservers changed; DNSSEC enabled (DS at registrar).
- [ ] Records: apex/`www` to Vercel (proxied), `staging` (restricted by Cloudflare Access), `status` (to status provider), `mail` (Resend), `docs` if any; TTL 300 except failover records (60).
- [ ] SSL Full (strict), HSTS configured, TLS min 1.2, security.txt at `/.well-known/security.txt`.
- [ ] WAF custom rules and managed rulesets enabled per section 10; rate limits created; verified with a test script (`curl` loops) that rules fire; webhook paths verified not challenged.
- [ ] Redirects: `www` to apex (or reverse) 301; trailing-slash policy; `http` to `https`.

### 11.2 Identity and OAuth
- [ ] Google Cloud project for production separate from dev; OAuth consent screen set to **In production**, app name/logo, authorised domains verified in Search Console, privacy policy and terms URLs live; scopes limited to `openid email profile` (non-sensitive, so brand verification only; allow lead time for review).
- [ ] Authorised redirect URI exactly `https://<domain>/api/auth/callback/google`; no wildcard; localhost URIs removed from prod client.
- [ ] Phone OTP: SMS gateway production account, **sender ID / masking registered** (BTRC/operator approval can take days), DLR webhook verified, fallback gateway keyed, balance alert set.
- [ ] Email: Resend domain verified (SPF/DKIM pass), DMARC set, bounce/complaint webhook active.
- [ ] Passkeys RP ID set to apex domain; TOTP enrolment tested; **all `grader`+ staff, `instructor`, `org_admin`, `counsellor` and `super_admin` accounts have 2FA (D4)**; OTP policy verified (6 digits, 5 min, 5 attempts; verification link 60 min, D12 C8); break-glass codes stored.
- [ ] Session lifetimes per D7 verified (30 d idle/90 d absolute student; 12 h staff).

### 11.3 Payments
- [ ] SSLCommerz **live** store ID/password in production env only; merchant onboarding docs approved; payment methods (bKash, Nagad, Rocket, cards) enabled and each verified with a real small transaction and refund.
- [ ] IPN URL registered in the SSLCommerz merchant panel; success/fail/cancel URLs set; IPN verified end-to-end (Validation API amount/currency/tran_id check); duplicate IPN replay yields one entitlement.
- [ ] Paddle (or Stripe via foreign entity) live account approved; webhook secret set; tax/VAT settings; test purchase + refund; products and price IDs mapped.
- [ ] Reconciliation job scheduled (hourly) and alert on mismatch.
- [ ] Refund workflow documented for `finance` role; policy text matches D5.
- [ ] Receipts/invoices numbering; BDT and USD price books published; rounding verified in minor units.

### 11.4 Legal and compliance
- [ ] Terms of Service, Privacy Policy, Refund Policy, Cookie Policy, Acceptable Use, Copyright/DMCA contact; Bangla and English; reviewed by counsel (Bangladesh Digital Security/Cyber Security legislation and personal data protection developments, GDPR for EU visitors, children's data under 18 with guardian flow).
- [ ] Trademark disclaimers rendered **verbatim from D12 C31** (GRE/TOEFL ETS string; IELTS string after counsel check; PTE/DET/Common App generic string) in every page footer, exam start screen and score report; all score labels read "estimated" (D6); `legal:verify` CI green (26 section 19).
- [ ] Cookie consent gating PostHog/non-essential scripts; consent record stored.
- [ ] Data export and account deletion tested end to end; data retention schedule documented.
- [ ] Content licensing evidence for all launch questions and videos recorded (original/licensed; no scraped content).
- [ ] Business registration/trade licence and tax registration in place for payment gateway and invoicing.

### 11.5 Reliability and operations
- [ ] Production Neon: PITR window at plan max, min compute set for exam hours, IP allow-list or SSL-only, `lumen_app` role has DML only, `lumen_backup` read-only role exists.
- [ ] `db-backup` workflow ran successfully >= 3 nights; **one full restore drill completed** (section 6.4) and timed.
- [ ] Sentry live with source maps, PII scrub unit-tested, alert rules created, test event received from prod.
- [ ] PostHog: consent-gated, funnels and dashboards in 5.4 built, web-vitals events flowing from a Dhaka device.
- [ ] Uptime checks, heartbeats, synthetic exam probe, status page live and subscribed by the founder; incident templates ready.
- [ ] Inngest production environment: signing key set, functions synced, concurrency caps, failure alerts.
- [ ] k6 exam-storm passed 3 consecutive times on staging; browse and checkout scenarios passed.
- [ ] Rate limits verified (app + Cloudflare); Turnstile active on signup, OTP, checkout, contact.
- [ ] Security: headers grade A (securityheaders.com or Mozilla Observatory), CSP report-only for 7 days then enforced, `pnpm audit`/OSV clean of high/critical, Next.js pinned to latest patched 16.x, dependency review done, secrets rotated since development, admin routes behind Access/2FA, pen-test checklist from doc 09 completed.
- [ ] Lighthouse CI thresholds green on production URLs; RUM baseline recorded.
- [ ] Feature flags: kill switches tested (`checkout.disabled`, `exam.new_attempts.disabled`, `ai.provider.primary`, queue pause).
- [ ] AI evaluation: cost caps and per-user quotas on, provider spending limits set in provider consoles, fallback tested, golden-set accuracy vs human band within tolerance (doc 07).
- [ ] Support: help centre, contact form (Turnstile), WhatsApp/phone number, canned replies for payment/OTP/exam issues; `support` accounts trained on masked-PII tools.
- [ ] Rollback rehearsal: instant rollback of a deployment executed once in staging and once in production (no-op change).
- [ ] Final go/no-go review against SLO dashboards, with a written launch note in `docs/PROGRESS.md`; deploy freeze 24 h around the announced launch hour; founder on duty.

### 11.5a Business-readiness gates (GA-061; technical-complete is not launch-ready)

Each gate has an owner and an evidence file in `docs/ops/launch-evidence.md`; production keys, the public price book and any creator payout stay blocked until the gate is green.

- [ ] **Legal gate (26, GA-002):** Terms, Privacy, Refund, Cookies, AI-scoring policy, Trademark notice, Accessibility statement drafted in en/bn, reviewed by a Bangladesh-qualified lawyer, sign-off files in `docs/legal/signoffs/`, `policy_version` rows `published`, `legal:verify` green (task NEW-26 gate before P1-54).
- [ ] **Finance sign-off gate (30 section 17, G1-G14, GA-011):** accountant-signed Mushak/invoice template, VAT position, chart of accounts, withholding matrix, repatriation route, 20-order dry run -> `docs/launch-gates/finance-signoff.md`.
- [ ] **Gold-set / AI accuracy gate (31 section 5, GA-006):** beta-level launch gate L1-L6 per task family; families that do not clear it launch feedback-only or human-review-only; `/accuracy` page live and honest.
- [ ] **Support readiness (27, NEW-SUP-29):** Chatwoot live with identity validation, macros en/bn QA'd, SLA timers, WhatsApp/Messenger intake verified (**Meta business verification has multi-week lead time - start in P0**), launch drills passed (payment-pending/no-access, OTP failure, exam outage bulk re-issue, refund end to end, DSAR synthetic).
- [ ] **Status page and incident readiness:** public status page (Better Stack or equivalent) on `status.` + `/status` mirror in `(marketing)`, templates in en/bn, global exam incident procedure rehearsed (7.3).
- [ ] **Comms deliverability (29):** SPF/DKIM/DMARC aligned, seed-list inbox test incl. Bangladeshi ISPs, SMS sender ID approved, operator delivery matrix measured.
- [ ] **Gateway approvals:** SSLCommerz live approval and Paddle/Stripe account approved (lead time weeks); bKash direct is P2.
- [ ] **Content readiness (16, 24):** minimum published mocks (>= 5 full mocks per exam with the "5 now, 10 by <date>" copy), lessons, question counts; every `score_conversion` row `verified` (production seed fails on `draft`, GA-032).
- [ ] **Policy tasks:** DPIA and processor register current (09 section 13.8), cookie inventory published, staff access review done, `docs/runbooks/` skeleton present.

### 11.6 Day-after-launch
- [ ] Review error budget burn, payment success rate by provider, autosave SLI, support inbox themes, AI cost per evaluation vs model in `04` section 12.1.
- [ ] Triage Sentry top 10; schedule fixes. Run first weekly dependency/security review.

---

## 12. Operations calendar (recurring)

| Cadence | Task | Automation |
|---|---|---|
| Daily | Review alerts digest, payment reconciliation report, AI spend vs cap | Inngest cron posts summary |
| Weekly | Renovate PRs (Monday), `pg_stat_statements` top 10 slow queries, Sentry triage, flags past removal date | Actions cron opens issue |
| Monthly | **Restore drill** (first Saturday), access review (roles, 2FA for staff, instructor, org_admin and counsellor), secret rotation check, cost review vs table in `04`, load test smoke | checklist issue auto-created |
| Quarterly | PITR drill, dependency major upgrades, k6 full soak, disaster tabletop (vendor outage), pen-test of auth/payment flows | |
| Before each exam event | Deploy freeze, scale Neon min CU, run exam-storm at event size, status pre-notice | |
