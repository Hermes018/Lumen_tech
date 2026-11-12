# PROGRESS - Live Tracker

> Source of truth for "what next". Update after every task (agents) - founder only edits the Decisions block answers.
> Task IDs, owners and dependencies mirror `docs/12-BUILD-PLAN-AGENTS.md` section 11 (acceptance criteria are there); same IDs, same order. Format: `- [ ] ID | title | owner | deps`. Milestones M0-M3 from `docs/24-TIMELINE.md` are listed under "Milestone gates"; human-owned gates are `BG-xx` (not picked by `/next-task`).
> Milestone hierarchy (P0.1 ... P3.5) and gates: `docs/22-ENGINEERING-GUARDRAILS.md` section 1. Pre-written cards: `docs/cards/<ID>.md`. Append-only edits to tick/Done-log rows (fewer merge conflicts across devices).
> Rule: pick the **first unchecked task whose deps are all ticked**. Tick only after the Definition of Done (12 section 7) is met.

## Status

- Date updated: 2026-11-12
- Active tool: 3.8 Flash (High) / Antigravity
- Active device: Laptop (Intel Core i5-1135G7, 8GB DDR4, NVIDIA MX330, Dual-Boot Win11 / Fedora 44)
- Current milestone: P0 Foundation & M0 Clickable Prototype (P0-12 to P0-16 completed); next delivery gate: M0 (GRE Priority)
- Last session log: docs/logs/sessions/2026-11-12-data-auth-rbac-gre-seed.md
- Active branch: main
- Last green `pnpm verify`: P0-12, P0-13, P0-14, P0-15, P0-16, P0-22 (29 tasks in turbo pipeline green)
- Phase in progress: P0 / P1-prep

## Current task

```yaml
id: P1-19-20-21
title: "Interactive GRE Practice & Magoosh/Brilliant Engine (Hint Ladder, Trap Diagnostics UI, Socratic Solver, Predict-First & 4-Mode FSRS Player)"
status: ready
branch: task/P1-19-gre-practice-engine
owner_model: "3.8-flash"
subagent: frontend-engineer
depends_on: [P0-12, P0-13-14, P0-15-16]
read:
  - "docs/00-DECISIONS.md#D13"
  - "docs/03-PRODUCT-SPEC.md#§11"
  - "docs/07-TEST-ENGINE.md#§1-§3"
  - "docs/34-AI-LEARNING-FEATURES.md#§1-§4"
touch:
  - packages/core/src/exam/practice.ts
  - packages/core/src/exam/fsrs.ts
  - packages/core/src/exam/index.ts
  - packages/core/src/__tests__/practice.test.ts
  - packages/core/src/__tests__/fsrs.test.ts
  - apps/web/app/[locale]/(learner)/app/practice/page.tsx
  - apps/web/app/[locale]/(learner)/app/practice/[sessionId]/page.tsx
  - apps/web/app/[locale]/(learner)/app/vocab/page.tsx
do:
  - Implement practice session runner in packages/core/src/exam/practice.ts (timed vs untimed tutor mode, hint budget tracking, second-chance scoring, error log tagging)
  - Implement FSRS v4 algorithm scheduler in packages/core/src/exam/fsrs.ts (spaced repetition interval calculations for flip, cloze, se_pair_drill, and quant_formula)
  - Build interactive UI in apps/web for Hint Ladder (3 progressive tiers), Trap Diagnostics Drawer, Socratic Step-by-Step Solver, Predict-First choice blurring, and on-screen 4-function GRE calculator with Transfer Display
  - Build 4-mode FSRS vocab flashcard player with Bangla audio/text glosses and keyboard shortcuts (1: Again, 2: Hard, 3: Good, 4: Easy)
acceptance:
  - "Interactive GRE practice session loads sample questions from seed pack"
  - "Hint ladder reveals Tier 1, 2, and 3 with budget deductions"
  - "Trap diagnostics render explaining why each incorrect choice is a distractor"
  - "FSRS card state transitions calculate correct next due dates"
  - "pnpm verify:fast is 100% green"
verify: "pnpm turbo run build typecheck lint test --concurrency=2"
verify_ladder: L0
reviewer: "Sonnet 5.5 (high)"
out_of_scope:
  - "Live speech recording for speaking drills (P2)"
notes: "Zero local Docker containers. Real-time client state with server-authoritative submission."
```

## Decisions needing the founder

| # | Date | Question | Options / recommendation | Blocks task | ANSWER |
|---|---|---|---|---|---|
| 1 | 2026-11-11 | Brand name final? (`packages/config/brand.ts`) | Keep "Lumen Academy" placeholder until domain chosen | none | **LOCKED:** Keep `Lumen Academy` placeholder in `packages/config/brand.ts` |
| 2 | 2026-11-11 | Which BD SMS gateway (SSL Wireless / Alpha SMS / BulkSMSBD)? | `SmsProvider` interface + console/DB stub for dev (unblocks P0-18) | P0-18 | **LOCKED:** `SmsProvider` interface + console/DB stub for dev |
| 3 | 2026-11-11 | Paddle onboarding outcome (else Stripe via foreign entity) | `PaymentProvider` interface + SSLCommerz sandbox & Paddle sandbox stubs | P1-35 | **LOCKED:** `PaymentProvider` interface + SSLCommerz & Paddle sandbox stubs |
| 4 | 2026-11-11 | Do AI credits and mocks expire with the product (12 months?) and do Terms say so? (30 OQ-F1) | Tie to access duration in 17 §2.2 | P1-70 | Tie to access duration in 17 §2.2 |
| 5 | 2026-11-11 | Which VAT regime applies; do prices stay VAT-inclusive? (30 OQ-F5, accountant BG-02) | Keep VAT-inclusive display; regime is effective-dated | P1-69 | Keep VAT-inclusive display |
| 6 | 2026-11-11 | First Bangla editor and rate (33 §8.1); native legal translator (26) | Founder at first, freelance editor before launch | P0-64 | Founder at first, freelance editor before launch |

## Milestone gates (docs/24-TIMELINE.md)

A gate is reached when every task in its list is ticked. Lists are the dependency closure of the gate-defining tasks, grouped by first gate; each task also carries its gate in `docs/12` section 11.

- **M0 Clickable prototype (GRE Priority)** - target Fri 27 Nov 2026 (earliest 20 Nov). Gate-defining tasks: P0-16, P0-17, P0-30, P0-35, P0-28, P1-19, P1-20, P1-21, P1-26, P1-66. Showcases one GRE Quant + Verbal mini-sectional in the real GRE exam shell (on-screen 4-function calculator with transfer-display, TC/SE/QC/Numeric Entry items, strikethrough option eliminator, server timer, 10s autosave), one Magoosh-style custom practice session with explanations + FSRS Vocab deck preview, and one GRE AWA Issue AI evaluation.
- **M1 Internal alpha (GRE Core + Magoosh Engine)** - target Fri 8 Jan 2027 (earliest 18 Dec). Gate-defining tasks (added to the previous gate): P1-22, P1-23, P1-37, P1-09, P1-32, P1-33, P1-39, P1-30, P1-15, P1-16, P1-17, P1-18, P1-27. Full GRE section-level adaptive engine, Magoosh practice & pacing analytics, GRE Vocab Pro (FSRS), plus IELTS runners and sandbox checkout.
- **M2 Closed pilot** - target Mon 1 Mar 2027 (earliest 1 Feb). Gate-defining tasks (added to the previous gate): P1-36, P1-35, P1-24, P1-41, P1-42, P1-53, P1-52, P1-118, P1-119, P1-104, P1-105, P1-106, P1-107, P1-72, P1-71, P1-75, P1-167, P1-165, P1-166, P1-100, P1-101, P1-189, P1-64, P1-92, P1-113, P1-70, P1-61.
- **M3 Public launch (P1 complete)** - target Mon 3 May 2027 (earliest 1 Apr). Gate-defining tasks: P1-54.
- **M4 P2 Growth** (Sep 2027) and **M5 P3 Expansion** (Q2 2028): P2 and P3 sections below; start only after P1-54.

## Business readiness gates (human-owned; docs/12 section 11, BG-xx)

- [ ] BG-01 | Engage counsel A/B/C and send 26 as the brief; schedule reviews; sign-off records per policy
- [ ] BG-02 | Engage chartered accountant: CoA, revenue-recognition policy, VAT position, gate items G1-G9; invoice template signed before live SSLCommerz
- [ ] BG-03 | Sign off helpdesk choice (Chatwoot Cloud vs self-host); workspace, domain mail routing, 2FA, agent accounts, labels, inbox per channel
- [ ] BG-04 | Start Meta Business verification, WhatsApp Cloud API number and templates, Messenger page connection (lead time weeks)
- [ ] BG-05 | Appoint safeguarding DSL and deputy; training pack, register, tabletop (counsel input)
- [ ] BG-06 | Law-enforcement request SOP approved and on-call lawyer named
- [ ] BG-07 | Approve AI calibration Phase A budget (BDT 0.74M) and name the Assessment lead
- [ ] BG-08 | Run Phase A rating programme: commission 470 items, rate and adjudicate (human QWK >= 0.80 per family)
- [ ] BG-09 | Submit footer/start/score layouts to ETS and check IELTS owners' trademark guidance
- [ ] BG-10 | Finalise creator/grader agreement templates with counsel (IP assignment, takedown warranty)
- [ ] BG-11 | Counsel sign-off packs: notification consent and SMS/WhatsApp rules; analytics consent tiers and pricing tests
- [ ] BG-12 | Founder DNS actions for email streams (SPF/DKIM/DMARC) and SMS sender-ID masking
- [ ] BG-13 | Business registration: trade licence, TIN, BIN, bank account; SSLCommerz live onboarding; Google OAuth brand verification
- [ ] BG-14 | Content readiness: >= 5 full mocks per exam at launch (10 by ~day 120, D10), beta gold set collected, Bangla editor and native legal-translator engaged
- [ ] BG-15 | Phase B rating waves and accent expansion (post-launch)
- [ ] BG-16 | Founder/legal decisions on open flags: Chatwoot data-region and agent PII (S3), instalment default policy (L-07), support credit caps (S4)

## Backlog

Order below = order in `docs/12` section 11 (verified by script). Headings carry the `docs/22` milestone and the delivery gates it feeds.

### P0 - Foundation

#### P0.1 Repo & tooling (gate: M0, M1)

- [x] P0-45 | Install agent guardrail hooks (`.claude/hooks/*`, settings, rules, commands) + self-test (docs/22 §11.4) | 3.8-flash | deps: -
- [x] P0-46 | Logs scaffolding: `docs/logs/{sessions,progress,errors,decisions,reviews,incidents}`, templates, root CHANGELOG, `.gitignore` entries, `docs/approved-deps.txt`, CLAUDE/AGENTS/GEMINI "Never" drift check | argon | deps: -
- [x] P0-51 | mise + corepack pinning: `mise.toml`/`.tool-versions`, `.nvmrc`, `packageManager`, `engines`, README setup | 3.8-flash | deps: -
- [x] P0-01 | Monorepo scaffold: pnpm workspaces + Turborepo + package skeletons per D2 | argon | deps: P0-45, P0-46, P0-51
- [x] P0-02 | Shared TS/ESLint (flat)/Prettier presets in packages/config | 3.8-flash | deps: P0-01
- [x] P0-03 | Root `pnpm verify` pipeline + pnpm minimumReleaseAge >= 3 days | 3.8-flash | deps: P0-02
- [ ] P0-50 | lefthook: pre-commit lint-staged + gitleaks, commit-msg check, pre-push `pnpm verify:fast`; add `verify:fast` script | 3.8-flash | deps: P0-03
- [ ] P0-47 | `tooling/filemap.ts` + `pnpm filemap` (+ `--check`) + `tooling/ctxpack.sh` + `docs/ARCHITECTURE-MAP.md` stub | 3.8-flash | deps: P0-01
- [ ] P0-08 | GitHub Actions CI: typecheck, lint, test, build on PR | 3.8-flash | deps: P0-03
- [ ] P0-09 | Security CI: Gitleaks, OSV-Scanner, CodeQL, Renovate config | 3.8-flash | deps: P0-08
- [ ] P0-10 | Vitest + Playwright + axe-core harness and shared fixtures | 3.8-flash | deps: P0-04
- [ ] P0-49 | k6 skeleton `tooling/k6/`: smoke, exam-start-storm, autosave-soak, checkout-spike, `targets.json` allowlist | 3.8-flash | deps: P0-04
- [ ] P0-52 | Solo-safe branch protection ruleset (0 required approvals while one human, required checks, no bypass) + `.gitattributes` (`* text=auto eol=lf`) + env patterns in `.gitignore`; amend 11 §1.2 | argon | deps: P0-03
- [ ] P0-53 | Doc consistency sweep: apply 26 §19.6 X1-X13, 29 X1-X10, 32 Y1-Y7, 27 §21.2 and 16 R6 to 02/03/05/06/07/09/10/11; add dated change-log lines in 00 (founder approves any D-level change) | 3.8-flash | deps: -
- [ ] P0-54 | Apply requested cross-doc edits from 16, 30, 31, 33, 34 (FIN-31, AIOPS-26, AI-57, AI-93, I18N 16.2, 16 R2-R5/R7-R10, 26-19 sitemap routes) + `tooling/doc-lint.ts` | argon | deps: P0-53
- [ ] P0-55 | Traceability checks: `tooling/trace.ts` (every P1 feature ID in 03 has a backlog reference, GA-004) and `tooling/backlog-check.ts` (12 §11 vs PROGRESS.md: same IDs in the same order, deps exist, graph acyclic, owners valid) | 3.8-flash | deps: P0-47
- [ ] P0-56 | Founder-blockers lead-time reminders, `docs/ops/launch-evidence.md` skeleton and 'rotate a leaked secret' runbook stub | argon | deps: -

#### P0.2 App skeleton, env & data (gate: M0, M1)

- [x] P0-04 | apps/web: Next.js 16 + React 19 App Router skeleton | 3.8-flash | deps: P0-02
- [x] P0-05 | Tailwind v4 wiring with CSS-variable token layer | 3.8-flash | deps: P0-04
- [x] P0-06 | Initialise shadcn/ui into packages/ui (Radix, Lucide) and consume from apps/web | 3.8-flash | deps: P0-05
- [x] P0-07 | packages/config: brand.ts + zod-validated env.ts + .env.example | 3.8-flash | deps: P0-02
- [ ] P0-11 | Vercel project (sin1/bom1), preview deploys, Neon branch-per-PR workflow | 3.8-flash | deps: P0-08, P0-07
- [x] P0-12 | packages/db: Drizzle + drizzle-kit, Neon driver, `db:generate`/`db:migrate` scripts | 3.8-flash | deps: P0-07
- [x] P0-13 | Base schema via Better Auth generator (user, session, account, verification) + audit_log table | 3.8-flash | deps: P0-12
- [x] P0-14 | Schema: roles, user_roles, organizations, memberships (additive roles per D4) | 3.8-flash | deps: P0-13
- [ ] P0-57 | `env.ts` cross-field validation (DB_DRIVER vs host; SSLCZ_IS_LIVE iff production; no fake providers or Turnstile test keys in production) + `env:example` generator with drift test; settle env-name drift (docs/28 §18.2: 10 wins) | 3.8-flash | deps: P0-07
- [ ] P0-58 | Smoke scripts `tooling/scripts/smoke/*` + `pnpm smoke:*` and `smoke:all` (PASS/FAIL/SKIP table, never prints secrets, refuses prod without flag) | 3.8-flash | deps: P0-07
- [ ] P0-59 | Staging smoke job `smoke-staging.yml` after deploy; gates `db-migrate-prod.yml` | 3.8-flash | deps: P0-58, P0-11
- [ ] P0-60 | `packages/config/legal.ts` (entity, addresses, role mailboxes, grievance officer) read by legal pages and emails | argon | deps: P0-07

#### P0.3 Design system & shell (gate: M0, M1)

- [x] P0-26 | Design tokens: colour (one accent), type scale, 8-pt spacing, radius, shadow, motion, light/dark | 3.8-flash | deps: P0-06
- [x] P0-27 | Core component set restyled to Lumen tokens (button, input, select, dialog, sheet, toast, tabs, table, form, skeleton) | 3.8-flash | deps: P0-26
- [x] P0-28 | Layout shell: frosted nav, footer, locale switcher, theme toggle, skip-link | 3.8-flash | deps: P0-27
- [x] P0-29 | next-intl (en, bn), Bangla fonts, locale routing, string extraction convention | sonnet | deps: P0-04
- [ ] P0-48 | Visual-regression baseline in CI Linux: Playwright `visual` project, pinned container, `update-visuals` workflow | sonnet | deps: P0-10, P0-28
- [ ] P0-61 | i18n structure and routing: namespace-split `messages/<locale>/<ns>.json` + generator, `localePrefix: as-needed`, `localeDetection: false`, endonym switcher, dismissible suggestion banner, typed message keys, runtime `i18n.missing` report | sonnet | deps: P0-29
- [ ] P0-62 | Format module (numbers, money, dates, lists; explicit numberingSystem; `nfExam()` hard-Latin; BDT lakh grouping) + ESLint rules banning literal strings and `Intl`/`toLocaleString`/`next/link` outside it | sonnet | deps: P0-29
- [ ] P0-63 | `pnpm i18n:check` implementing R1-R13 + `i18n:sort`/`i18n:prune` + status files; wired into `pnpm verify` | sonnet | deps: P0-61
- [ ] P0-64 | Bangla glossary `i18n/glossary.csv` (~150 terms, locked/do_not_use) + translation workflow (ROSTER.md, labels, CODEOWNERS for `messages/bn/**`, PR template, 'Report a translation issue' link) | haiku | deps: P0-29

#### P0.4 Identity & access (gate: M0, M1)

- [x] P0-15 | packages/auth: Better Auth core, Drizzle adapter, hardened cookies and session lifetimes | 3.8-flash | deps: P0-13
- [x] P0-16 | Google OAuth sign-in + canonical pricing & GRE seeds | 3.8-flash | deps: P0-15
- [ ] P0-17 | Email OTP + magic link via Resend/React Email | sonnet | deps: P0-15
- [ ] P0-18 | SmsProvider interface + one BD gateway adapter + phone OTP login | sonnet | deps: P0-15
- [ ] P0-19 | Cloudflare Turnstile + per-IP/per-user rate limits on signup/OTP/contact | sonnet | deps: P0-15
- [ ] P0-20 | Passkeys (WebAuthn) enrol + sign-in | sonnet | deps: P0-15
- [ ] P0-21 | TOTP 2FA + enforced 2FA for grader-and-above, instructor and org_admin (D4) | sonnet | deps: P0-20
- [x] P0-22 | Permission map (`resource:action`) + `assertCan` policy engine with ownership/org checks | 3.8-flash | deps: P0-14
- [ ] P0-23 | Role grant/revoke service (admin cannot grant admin/super_admin) + session rotation on change | sonnet | deps: P0-22
- [ ] P0-24 | Audit-log service (append-only) wired to role, impersonation, export, refund hooks | sonnet | deps: P0-22
- [ ] P0-25 | Security headers: CSP with nonces, HSTS preload, frame/referrer/permissions policies | sonnet | deps: P0-04
- [ ] P0-30 | Auth UI: sign-in, sign-up, OTP, passkey, 2FA, recovery pages | sonnet | deps: P0-18, P0-20, P0-21, P0-28
- [ ] P0-31 | Account settings: profile, age band, guardian-consent flag, sessions list, language | sonnet | deps: P0-30
- [ ] P0-65 | `RATE_LIMIT_BACKEND=postgres/redis` switch (fail closed only when backend reachable; production forces redis) | sonnet | deps: P0-19, P0-57

#### P0.5 Marketing, catalogue & CMS (gate: M0, M1)

- [ ] P0-32 | Marketing pages: home, about, pricing placeholder, contact (Turnstile) | sonnet | deps: P0-28
- [ ] P0-33 | Marketing copy en + bn drafts | haiku | deps: P0-32, P0-29
- [ ] P0-34 | Schema: categories, tags, courses, modules, lessons, course_versions | sonnet | deps: P0-14
- [ ] P0-35 | Catalogue service + list/detail pages + pg_trgm search | sonnet | deps: P0-34, P0-32
- [ ] P0-36 | CMS course editor with Tiptap (KaTeX, Shiki, images) | sonnet | deps: P0-34, P0-27
- [ ] P0-37 | Draft -> review -> published workflow + editor review queue | sonnet | deps: P0-36, P0-22
- [ ] P0-38 | R2 presigned upload service, media library, MIME/size validation | sonnet | deps: P0-07, P0-22
- [ ] P0-39 | Admin shell + user search + role management UI (masked PII for support) | sonnet | deps: P0-23, P0-27
- [ ] P0-40 | Seed: categories, sample courses, demo users per role | haiku | deps: P0-35
- [ ] P0-66 | Dev ergonomics: packages consumed from source (one `pnpm dev` process tree) and `db:seed` prints a dev-login table (role, email, password hint), refusing production | sonnet | deps: P0-40, P0-04
- [ ] P0-67 | Optional local stack: `docker-compose.yml` (postgres:17, mailpit, optional minio) + README snippet + `DB_DRIVER=pg` CI job | sonnet | deps: P0-57, P0-12

#### P0.6 Observability, SEO & phase exit (gate: M1)

- [ ] P0-41 | Sentry (PII scrub) + PostHog (consent-gated) + structured logger | sonnet | deps: P0-04
- [ ] P0-42 | SEO base: metadata API, sitemap, robots, OG images, hreflang | sonnet | deps: P0-35, P0-29
- [ ] P0-68 | i18n e2e suite: hreflang (R16), 320 px overflow sweep, `/bn` visual baselines, axe on `/bn`, Bangla font-fallback screenshots without webfonts (Android/Windows) | sonnet | deps: P0-42, P0-48, P0-61
- [ ] P0-69 | Typed notification catalogue `packages/core/src/notifications/catalogue.ts` + generated `docs/generated/notification-templates.md` + event-coverage check `tooling/trace-notifications.ts` | sonnet | deps: P0-17
- [ ] P0-70 | Analytics foundation: typed event map + generated catalogue, `track()` server/client wrappers (allow-list, PII scrubber, `$insert_id`, consent_tier), `analytics_id()` HMAC (TS + SQL) with identify/reset rules | sonnet | deps: P0-41
- [ ] P0-71 | Rater programme packs: job ad, rater agreement/NDA/participant-consent templates, training modules M1-M6, 12 anchors per family, 40-item qualification set | opus | deps: -
- [ ] P0-43 | P0 security & architecture review (auth, RBAC, headers) | opus | deps: P0-23, P0-25, P0-31, P0-37
- [ ] P0-44 | README, CONTRIBUTING and CHANGELOG bootstrap | haiku | deps: P0-43

### P1 - MVP (launch)

#### P1.1 Learning delivery (gate: M1, M2, M3)

- [ ] P1-01 | Schema: enrollments, lesson_progress, notes, bookmarks | sonnet | deps: P0-34
- [ ] P1-02 | Learning service: enroll (free), progress, resume, completion rules | sonnet | deps: P1-01
- [ ] P1-03 | Bunny Stream: upload (TUS), encode webhook, status via Inngest | sonnet | deps: P0-38
- [ ] P1-04 | Token-authenticated playback + dynamic visible watermark overlay | sonnet | deps: P1-03
- [ ] P1-05 | Lesson player UI: video, text, resources, notes, next/prev, progress | sonnet | deps: P1-02, P1-04
- [ ] P1-06 | Downloadable resources via short-lived R2 signed URLs | sonnet | deps: P1-02
- [ ] P1-57 | Per-user PDF stamping job for downloadable resources (buyer email + order id on every page, 5 downloads, short-lived R2 URL) | sonnet | deps: P1-06

#### P1.2 Question bank, content provenance & authoring (gate: M0, M1, M2, M3)

- [ ] P1-07 | Schema: questions, question_versions, passages, audio_assets, question_sets, tags | sonnet | deps: P0-14
- [ ] P1-08 | Question-bank services + authoring permissions (instructor own, editor all) | sonnet | deps: P1-07
- [ ] P1-09 | Question authoring UI for all types (MCQ, multi, numeric, matching, completion, QC, passage-based, essay prompt) | sonnet | deps: P1-08, P0-36
- [ ] P1-10 | Bulk import (CSV/JSON) with row-level validation report | sonnet | deps: P1-08
- [ ] P1-58 | `content_provenance` table + Studio provenance panel + publish gate (no provenance record = cannot publish) + tag kinds topic/cefr/subtype | sonnet | deps: P1-07
- [ ] P1-59 | `ImportBundleV2` (with provenance), CSV templates, local `tooling/validate-import` using the server zod schema, file-naming and mixed-provenance split rules | sonnet | deps: P1-10, P1-58
- [ ] P1-60 | Studio audio QA: LUFS, true peak (-1 dBTP), noise floor (< -60 dBFS), clipping and silence checks before an audio asset can be attached | sonnet | deps: P1-07
- [ ] P1-61 | Test-form builder/assembler + `assertPublishable` UI + unscored pilot (field-test) item flag + 'beta' form label | sonnet | deps: P1-09, P1-11
- [ ] P1-62 | Content drafting pipeline scripts `tooling/content/` (spec -> Batch-API draft -> similarity/dedupe vs bank -> ImportBundleV2 with provenance -> human review gate) | sonnet | deps: P1-59
- [ ] P1-63 | Error reports from learners (F-ERR-01..03) + editor inbox `/editor/reports` | sonnet | deps: P1-08

#### P1.3 Test-engine core, disruption & accommodations (gate: M0, M2, M3)

- [ ] P1-11 | Schema: tests, test_sections, test_attempts, attempt_sections, attempt_answers, scores | sonnet | deps: P1-07
- [ ] P1-12 | Attempt engine core: start/resume, server deadlines, autosave, grace, submit | opus | deps: P1-11
- [ ] P1-13 | Objective scoring + conversion tables (IELTS raw to band, GRE scaled) as data | sonnet | deps: P1-12
- [ ] P1-14 | CBT shell UI: timer, navigator, flag, review screen, offline-tolerant autosave | sonnet | deps: P1-12, P0-27
- [ ] P1-55 | Exam offline queue: IndexedDB outbox (`idb`, db `lumen-exam`), clientSeq/epoch, backoff replay; exam mode replays only within the 30 s grace, practice mode any time (D6) | sonnet | deps: P1-12, P1-14
- [ ] P1-64 | Exam-disruption handling (C30): 'I lost connection' self-serve void once per attempt (connection loss > 2 min, exam mode), support `credit_mock`/`grant_resit`, `attempt:void` request, bulk re-issue admin job, all audited | sonnet | deps: P1-12, P1-55
- [ ] P1-65 | Accommodations (C18): support-granted extra time 1.25x/1.5x/2.0x via ticket, evidence bucket, `accommodation_multiplier` applied to server deadlines, expiry | sonnet | deps: P1-12, P1-103

#### P1.4 Exam runners, results & practice (GRE First & Magoosh Engine) (gate: M0, M1, M2, M3)

- [ ] P1-19 | GRE Verbal runner (RC, text completion 1/2/3-blank, sentence equivalence, strikethrough, Choice Hider 'Predict First' toggle, inline word click-to-deck) | 3.8-flash | deps: P1-14, P1-13
- [ ] P1-20 | GRE Quant runner (MCQ, multi, numeric entry, QC) + on-screen 4-function calculator with transfer + FROZEN plug-in numbers checklist badge | 3.8-flash | deps: P1-14, P1-13
- [ ] P1-21 | GRE Analytical Writing (AWA) runner (30-min Analyze an Issue) | 3.8-flash | deps: P1-14
- [ ] P1-22 | GRE section-level adaptive routing (Verbal 12Q->15Q, Quant 12Q->15Q second-section difficulty) | sonnet | deps: P1-19, P1-20
- [ ] P1-66 | Magoosh Practice & Tutor sessions `/app/practice`: custom quiz builder (topic/difficulty/mode), session player, progressive 3-tier hints (concept nudge, setup, bridge), second-chance retry with distractor trap diagnostics ('Why Choice [X] is a Trap'), Socratic micro-step walkthroughs ('Walk Me Through It'), personal notes | 3.8-flash | deps: P1-14, P1-13
- [ ] P1-23 | Results and review UI: score report, explanations, time per question, pacing tracker, GRE score predictor (130-170) | 3.8-flash | deps: P1-13, P1-19, P1-20
- [ ] P1-67 | Mistake notebook `/app/mistakes` fed by attempts and practice quizzes (states Open/Resolved) | 3.8-flash | deps: P1-23
- [ ] P1-15 | IELTS Listening runner (single-play audio, sections, answer types) | 3.8-flash | deps: P1-14, P1-13
- [ ] P1-16 | IELTS Reading runner (split pane, highlight, notes, 3 passages) | 3.8-flash | deps: P1-14, P1-13
- [ ] P1-17 | IELTS Writing runner (Task 1/2, word counter, autosave) | 3.8-flash | deps: P1-14
- [ ] P1-18 | IELTS Speaking runner (mic check, recording, parts 1-3, upload to R2) | 3.8-flash | deps: P1-14, P0-38
- [ ] P1-24 | Free diagnostic test for guests with results gated behind sign-up | 3.8-flash | deps: P1-23, P0-30
- [ ] P1-68 | Item statistics and retirement job (07 §8.6): p-values, discrimination, exposure, retire/flag rules | 3.8-flash | deps: P1-23

#### P1.5 AI evaluation (core) (gate: M0, M1, M2)

- [ ] P1-25 | packages/ai: LLM adapter (Claude primary, Gemini fallback), zod-validated JSON, cost logging | sonnet | deps: P0-07
- [ ] P1-56 | Deepgram Nova-3 SttProvider adapter (Speaking default, word timestamps) + `whisper-1` fallback adapter (`timestamp_granularities=word`) + fake | sonnet | deps: P1-25
- [ ] P1-26 | AI writing evaluation: IELTS T1/T2 four criteria + GRE AWA 0-6, prompt templates | sonnet | deps: P1-25, P1-17, P1-21
- [ ] P1-27 | STT adapter + AI speaking evaluation pipeline (Inngest) | sonnet | deps: P1-25, P1-18, P1-56
- [ ] P1-28 | AI evaluation harness: golden set, calibration report, regression gate | opus | deps: P1-26
- [ ] P1-29 | AI credits ledger, per-user limits, abuse rate limits | sonnet | deps: P1-26
- [ ] P1-30 | Human grader queue + override with rationale (2FA role) | sonnet | deps: P1-26, P0-21

#### P1.6 Commerce, pricing model & entitlements (gate: M1, M2, M3)

- [ ] P1-31 | Schema: products, prices (BDT/USD minor units), orders, order_items, payments, entitlements | sonnet | deps: P0-14
- [ ] P1-34 | Entitlement service + access guards for course, test, AI credits, pass | opus | deps: P1-31
- [ ] P1-32 | PaymentProvider interface + SSLCommerz init, IPN, Order Validation API | opus | deps: P1-31
- [ ] P1-35 | Paddle adapter for international payments behind feature flag | sonnet | deps: P1-34
- [ ] P1-33 | Checkout UI, order status page, receipt PDF/email | sonnet | deps: P1-32
- [ ] P1-36 | Refunds + finance console (orders, refunds, revenue, VAT export) | sonnet | deps: P1-34, P0-24
- [ ] P1-69 | Commerce-model schema extension (GA-001): `product_kind` += physical_book/service/human_review_credits, family x tier fields, region price rows (BD/A/B/C), allowances, passes, add-ons, `compare_at_minor` rule (C14), `vat_class` per product with effective-dated regime | sonnet | deps: P1-31
- [ ] P1-70 | Price-book seed loader: parse the 17 §13 `SEED` YAML block into idempotent upserts; validates C25 floor (C >= BD in USD, B~1.5xC, A~2.5xC), minor units, allowances; dry-run diff | sonnet | deps: P1-69
- [ ] P1-71 | Regional price resolution (billing country via MoR, IP as hint only; BD always BDT via SSLCommerz) + pricing page VAT-inclusive display and 'N mocks now, 10 by <date>' library counter | sonnet | deps: P1-70, P1-35
- [ ] P1-72 | Tier allowances to entitlements: `ai_credit` grants per product (Core 10, Plus 40, GRE 6/20), monthly pass refill (10 credits + 2 mocks, no rollover), daily AI ceilings (Free 1, Core 3, Pass 4, Plus+ 6), mock counts, tutor/coach meter caps read from the price book | opus | deps: P1-70, P1-34, P1-29
- [ ] P1-73 | `human_review_credits` counters (essay reviews, speaking mocks, 1:1 sessions; never converted to credits) with redemption into the grader queue and expiry | sonnet | deps: P1-72, P1-30
- [ ] P1-74 | Admin manual entitlement grant (scholarship / partner / pilot cohort) with required reason, source=`grant`, audit row, quota counters (P1 stop-gap until P2 scholarship workflow) | sonnet | deps: P1-34, P1-39
- [ ] P1-75 | 7-day Plus trial (no card): `trial_grant`, entitlement `source='trial'`, bonus credits (capped, 17: 5 credits total), expiry job, CTA/checklist/reminders, one per phone/device | sonnet | deps: P1-72, P0-18
- [ ] P1-76 | Fraud rules and review queue: checkout velocity and card-testing, refund-abuse flags, coupon/referral holds, trial farming (email/phone canonicalisation, device/ASN velocity), risk-hold review UI in `/support` | sonnet | deps: P1-32, P1-75
- [ ] P1-77 | Checkout consent UI: refund pre-check copy, intl waiver, SMS consent checkbox, order summary from price snapshot | sonnet | deps: P1-33
- [ ] P1-78 | Self-serve 7-day refund (C13b/C28): eligibility service (max of lessons %, credits %, mocks % < 20% and <= 1 full mock), `/orders` meter UI, refund automation with finance safeguards | sonnet | deps: P1-36, P1-72
- [ ] P1-79 | Chargeback/dispute case tracker + evidence-pack export (access logs, watermark logs, IP, consent), Paddle `adjustment` handling, SSLCommerz dispute workflow, deadline alerts | sonnet | deps: P1-32, P1-35
- [ ] P1-80 | `guarantee_claim` model + single eligibility evaluator (Target Promise on Plus, Progress Promise on Mentor) + Promise tracker UI + quarterly provision report | sonnet | deps: P1-72, P1-70
- [ ] P1-81 | Guarantee claim flow: official TRF upload (private, deleted at 30 days), review queue, approval, extension/re-enrol grant exactly once, appeals | sonnet | deps: P1-80
- [ ] P1-82 | P1.1-P1.6 exit review: learning delivery, bank, engine, runners, AI evaluation core and commerce meet the 22 §1.2 exit criteria (two-key approvals recorded) | opus | deps: P1-05, P1-57, P1-60, P1-61, P1-62, P1-63, P1-64, P1-65, P1-16, P1-22, P1-24, P1-66, P1-67, P1-68, P1-27, P1-28, P1-71, P1-73, P1-74, P1-76, P1-77, P1-78, P1-79, P1-81

#### P1.7 Dashboards, learner features, comms & content (gate: M1, M2, M3)

- [ ] P1-37 | Learner dashboard (continue, tests, scores trend, credits, plan) | sonnet | deps: P1-23, P1-02
- [ ] P1-38 | Instructor dashboard (courses, Q&A stub, analytics, earnings stub) | sonnet | deps: P0-37
- [ ] P1-39 | Admin console: orders, users, moderation, audit viewer, read-only impersonation with reason | sonnet | deps: P1-36, P0-39
- [ ] P1-40 | Transactional email base: React Email layout, three streams, plain-text alt, en/bn render harness (template sets are owned by the docs/29 tasks in P1.11) | sonnet | deps: P0-17
- [ ] P1-41 | Entitlement expiry reminders T-30/T-7/T-1 and expired notice (docs/29 scope; supersedes earlier T-7/T-1 scope) | sonnet | deps: P1-34, P1-164
- [ ] P1-42 | Legal page shells, footer links and trademark notices (C31 verbatim); real content only from counsel-signed MDX (docs/26) | haiku | deps: P0-32
- [ ] P1-43 | SEO: IELTS/GRE landing pages, structured data (Course, FAQ), blog scaffold | sonnet | deps: P0-42
- [ ] P1-44 | Analytics instrumentation: domain-event mappers and client events per docs/32 §5 (supersedes earlier scope) | sonnet | deps: P0-41, P0-70, P1-119
- [ ] P1-45 | Seed IELTS/GRE course skeletons and original sample questions | haiku | deps: P1-09, P0-40, P1-58
- [ ] P1-83 | Haiku batch translation runner `tooling/scripts/i18n-draft.ts` (glossary + translation memory, idempotent, per-item output files, created/skipped/failed report) | sonnet | deps: P0-64
- [ ] P1-46 | Bangla string extraction and draft translations for P1 UI | haiku | deps: P0-29, P0-64, P0-63, P1-83
- [ ] P1-84 | Onboarding wizard at `/onboarding` (goal, exam date, target, level, under-18 guardian-consent path, language) | sonnet | deps: P0-31, P0-30
- [ ] P1-85 | Generated read-only study plan from onboarding + diagnostic (C5) at `/app/plan` | sonnet | deps: P1-84, P1-13
- [ ] P1-86 | Next-best-action hero from the rule table with 'Why this?' disclosure (true triggering signal; never shown to under-18) | sonnet | deps: P1-37, P1-85
- [ ] P1-87 | In-app notification inbox/bell UI over `notification` table | sonnet | deps: P1-164
- [ ] P1-88 | Reviews and ratings (F-REV) with moderation hooks | sonnet | deps: P1-02
- [ ] P1-89 | Certificates (C4): PDF generation and public `/verify/[code]` page (>= 128-bit code, never the UUID) | sonnet | deps: P1-02, P1-34
- [ ] P1-90 | Feature-flag admin UI `/admin/feature-flags` over `feature_flag` + seed registry for 34 §12 keys + `isEnabled` helper; flips audited | sonnet | deps: P0-39
- [ ] P1-91 | Help centre CMS (`/help`): articles, categories, error-code to article map with CI check, FAQ JSON-LD | sonnet | deps: P0-36, P0-35
- [ ] P1-92 | Write and verify the help-article inventory (71 articles, en/bn) in the CMS | haiku | deps: P1-91, P0-64
- [ ] P1-93 | `/guarantee` marketing page (en/bn) with scenarios, conditions one tap away and a legal-review hook | haiku | deps: P1-80, P1-123
- [ ] P1-94 | `/tools/*` public calculators (band/raw converters, GRE score tools) with 'estimated' labels | sonnet | deps: P0-32
- [ ] P1-95 | Free 'Which test do I need?' quiz (IELTS Academic/GT/Life Skills, PTE, DET, TOEFL, EPS-TOPIK, JFT-Basic, none) with recommendation page | sonnet | deps: P0-32
- [ ] P1-96 | English Foundation track (A0 to B1, Bangla-medium) course skeleton, micro-price SKUs and lesson stubs | haiku | deps: P1-70, P1-97
- [ ] P1-97 | Lesson localisation fields: course 'Instruction language' and 'Captions available' badges; publish validator for 'Bangla-ready' | sonnet | deps: P0-36
- [ ] P1-98 | PWA + data saver: manifest, service worker (scope excludes `/exam` and `/api`), install prompt, storage manager and `navigator.storage.persist()`, offline articles/practice/flashcard decks with idempotent sync, low-bandwidth mode, supported-devices matrix | sonnet | deps: P1-05, P1-129
- [ ] P1-99 | Brand kit export: slide-deck theme tokens (Slides/Figma) and print stylesheet token set | haiku | deps: P0-26
- [ ] P1-100 | Live pilot ops tooling (D1): batch/session admin form, entitled-only join links in `/app/plan`, `.ics` feed, reminders T-24h/T-1h/T-15m with cancel supersede, attendance CSV import (Zoom report), ops-sheet export | sonnet | deps: P1-34, P1-164
- [ ] P1-101 | Zoom `recording.completed` webhook -> Inngest -> Bunny (token-auth, watermarked) -> session recording ref; failure alerts | sonnet | deps: P1-03, P1-100
- [ ] P1-102 | P1.7 exit review: dashboards, learner features, comms and content streams meet the 22 §1.2 exit criteria | opus | deps: P1-38, P1-39, P1-40, P1-41, P1-42, P1-43, P1-44, P1-45, P1-46, P1-86, P1-87, P1-88, P1-89, P1-90, P1-92, P1-93, P1-94, P1-95, P1-96, P1-98, P1-99, P1-101

#### P1.9 Support, trust & legal operations (gate: M2, M3)

- [ ] P1-103 | Support/trust migration: `support_ticket`, `ticket_message`, `macro`, `csat_response`, `dispute`, `moderation_case`, `enforcement_action`, `user_profile.support_level` + enums | sonnet | deps: P0-14
- [ ] P1-104 | Chatwoot Cloud integration (C29): identity HMAC, create-conversation API, signed idempotent webhook ingest, tier/priority attributes, status mirror into in-app inbox (< 30 s), `ticket_*` analytics events, helpdesk-domain DKIM | sonnet | deps: P1-103, P1-164
- [ ] P1-105 | SLA engine: BD business-hours calendar, due time by tier x priority, pause/resume, Inngest alerts, breach flags | sonnet | deps: P1-103, P1-104
- [ ] P1-106 | `/app/support` and guest `/contact` ticket form (Turnstile), ticket list/status, error-code to article links | sonnet | deps: P1-104, P1-91
- [ ] P1-107 | Support console (`/support/**`): masked lookup panel for Chatwoot, 'trace watermark code', extension caps (14 d/90 d), `pii:reveal` rate alerts, support permission strings/levels with four-eyes | sonnet | deps: P1-104, P0-22
- [ ] P1-108 | Load the 30+5 support macros (en/bn) into `macro` and sync to Chatwoot; native-speaker review gate | haiku | deps: P1-103, P0-64
- [ ] P1-109 | Trust and safety runbooks pack: moderation policy and FB/Discord runbook, enforcement ladder policy, leak-response runbook, law-enforcement SOP, safeguarding register and reporting form templates, staff 2FA recovery SOP, support training and QA scorecard | haiku | deps: P1-103
- [ ] P1-110 | Piracy response tooling: minimal `enforcement_action` (warn/limit/suspend, notices), abuse-score job from `playback_session`/devices, evidence bucket with hash log, takedown templates, copyright complaint form | sonnet | deps: P1-107, P1-04
- [ ] P1-111 | Staff 2FA recovery: two-person reset flow and quarterly access-review report | sonnet | deps: P0-21, P0-24
- [ ] P1-112 | DSAR operations: helpdesk export/delete connector, 3-day ack / 30-day clock dashboard, `analytics.delete-person` with warehouse tombstones, quarterly synthetic test | sonnet | deps: P1-104, P1-53, P0-70
- [ ] P1-113 | Status page (Better Stack): components, bilingual incident templates, in-app banner integration | haiku | deps: P0-11
- [ ] P1-114 | CSAT 24 h after resolve: storage, webhook, dashboard | sonnet | deps: P1-103, P1-104
- [ ] P1-115 | Support/Trust dashboards and weekly review template | sonnet | deps: P1-105, P1-114
- [ ] P1-116 | Legal migration: `policy_version`, `cookie_consent_event`, `creator_agreement`, enum/column additions (26 §19.3); update 05 | sonnet | deps: P0-14
- [ ] P1-117 | Acceptance-logging service + sign-up/checkout/exam-start/live hooks + re-accept gate on material changes | sonnet | deps: P1-116
- [ ] P1-118 | Legal MDX pipeline: `/legal/*` routes (terms, privacy, refund, cookies, AI scoring, trademark, processors, history/versions), `legal:verify` CI, publish only with a sign-off record | sonnet | deps: P1-116, P1-42
- [ ] P1-119 | Consent management: cookie banner (equal-prominence buttons, bn/en, re-open link), cookie inventory generator, consent events, Tier 0 allow-list, SDK gating, withdrawal behaviour, minors default off | sonnet | deps: P1-116, P0-70, P0-41
- [ ] P1-120 | Bangla drafts of legal pages from counsel-approved English only; native legal-translator review recorded | haiku | deps: P1-118, P0-64
- [ ] P1-121 | `docs/processors.md` + public processors page + new-vendor checklist (helpdesk, WhatsApp, Zoom, STT, LLM) | haiku | deps: P1-118
- [ ] P1-122 | DPIA (AI scoring, minors' voice, tab-switch logs, tutor/notebook) + transfer assessments | opus | deps: P1-116
- [ ] P1-123 | Copy lint for blocked phrases ('guaranteed band/score/admission', fake 'was' price) across marketing, pricing, estimate UI and `/guarantee` | sonnet | deps: P0-32
- [ ] P1-124 | `/security` page, `security.txt` and renewal reminder | haiku | deps: P0-32
- [ ] P1-125 | `/accessibility` statement (dated conformance) + accommodation request page + external audit decision | haiku | deps: P0-32, P1-65
- [ ] P1-126 | P1.9 exit review: support, trust and legal operations (incl. sign-off records and BG-01/03/04/05/06/09/10/11) | opus | deps: P1-106, P1-108, P1-109, P1-110, P1-111, P1-112, P1-113, P1-115, P1-117, P1-119, P1-120, P1-121, P1-122, P1-123, P1-124, P1-125

#### P1.10 AI learning features & learner study tools (gate: M3)

- [ ] P1-127 | SRS tables `srs_deck`, `srs_card`, `srs_user_card`, `srs_review_log`, `srs_user_settings` + seed pipeline from editor CSV (1,150 cards) | sonnet | deps: P0-14
- [ ] P1-128 | FSRS scheduler package shared client/server (`ts-fsrs`, licence re-verified) with SM-2 fallback flag and offline-replay fixtures (C26) | sonnet | deps: P1-127
- [ ] P1-129 | Vocabulary review UI `/app/vocab` (F-VOC): 4 active-recall card modes (Classic FSRS Flip, Cloze Context, Sentence Equivalence Pair Drill 15s speed mode, Quant Formula & Trap Deck), interval buttons (Again/Hard/Good/Easy), keyboard shortcuts, smart error-log queue ('Queue for Vocab Review'), data saver, en/bn | sonnet | deps: P1-128
- [ ] P1-130 | Deck audio pipeline (TTS at authoring, R2 cache, IPA/audio QA checklist) | sonnet | deps: P1-127, P1-144
- [ ] P1-131 | pgvector + `content_chunk` + HNSW + fk-index CI checks, embedding adapter, Bangla/English retrieval benchmark (200 pairs) and model-choice ADR | sonnet | deps: P0-12
- [ ] P1-132 | Chunker and `rag.reindex` Inngest job on `content.published` (video windows with `start_ms`, articles, explanations, vocab) | sonnet | deps: P1-131
- [ ] P1-133 | Ask Lumen tutor service (`packages/core/src/tutor`): entitlement-filtered retrieval, prompts + zod output, band-claim filter, quote cap, link allowlist, validators | sonnet | deps: P1-132, P1-25
- [ ] P1-134 | `/api/tutor/stream` SSE route, daily fair-use meters (`ai_fair_use_counter`), exam-attempt gate, minors gate (guardian consent) and retention job (30 d minors / 180 d others) with DSAR wiring | sonnet | deps: P1-133, P1-72
- [ ] P1-135 | Tutor UI: lesson side panel, `/app/ask`, citation chips deep-linking to timestamp, en/bn copy, a11y | sonnet | deps: P1-134
- [ ] P1-136 | `pnpm eval:tutor` harness: groundedness, injection (>= 150), exam-leak refusal, hint-leak, Bangla rubric, latency | sonnet | deps: P1-133
- [ ] P1-137 | `score_prediction` + `official_score_report` tables and snapshot writer (<= 1/day/skill) | sonnet | deps: P1-13
- [ ] P1-138 | Weighted-EAP estimator reusing `eapTheta`, L/R band mapping via `score_conversion`, W/S aggregation, IELTS overall range via Monte Carlo + rounding rules, GRE V/Q path-aware | sonnet | deps: P1-137, P1-22
- [ ] P1-139 | Estimate UI (`/app/progress/estimate`): range, confidence badge, drivers, labels, bn copy, trademark footer | sonnet | deps: P1-138, P1-123
- [ ] P1-140 | `study_asset` + `study_asset_progress` tables, `/editor/study-assets` review UI, stale detection | sonnet | deps: P0-36
- [ ] P1-141 | Study-asset generator pipeline (Sonnet batch) + grounding checker + verifier for guides, FAQs and quizzes | sonnet | deps: P1-140, P1-132
- [ ] P1-142 | Lesson quiz player (Got it / Missed it, retry missed, mistake-notebook feed) | sonnet | deps: P1-141, P1-67
- [ ] P1-143 | Study guide/FAQ renderer + watermarked PDF export | sonnet | deps: P1-141, P1-57
- [ ] P1-144 | TTS vendor spike: EN + BN quality, SSML lexicon, licence-clause capture, cost per 10 min (ADR) | sonnet | deps: P1-25
- [ ] P1-145 | Writing/Speaking Coach UX on stored evaluations: highlight renderer with offset validation, rewrite panel + diff, vocabulary-upgrade add-to-deck | sonnet | deps: P1-26, P1-129
- [ ] P1-146 | P1.10 exit review: AI learning features meet cost, grounding and labelling gates | opus | deps: P1-130, P1-135, P1-136, P1-139, P1-142, P1-143, P1-145

#### P1.11 Finance, analytics & lifecycle messaging (gate: M2, M3, post-M3 (P1 stream))

- [ ] P1-147 | Finance schema `finance.ts` (ledger_account, finance_period, ledger_journal/entry append-only triggers, revenue_schedule) + seed chart of accounts and `finance_setting` defaults (flagged unverified) | sonnet | deps: P1-31
- [ ] P1-148 | Posting service: order paid, settlement, refund (contra/deferred reversal, credit note, VAT reversal, fee leakage), chargeback, AI cost, payouts | opus | deps: P1-147, P1-32
- [ ] P1-149 | `recogniseRevenue` and `recogniseConsumption` jobs + deferred roll-forward report | sonnet | deps: P1-148
- [ ] P1-150 | T0 integrity checks C1-C9 + daily digest email + sign-off | sonnet | deps: P1-148
- [ ] P1-151 | Settlement upload/parse/match for SSLCommerz (parser profiles as config), bank-statement CSV import and three-way match, aging report | sonnet | deps: P1-147
- [ ] P1-152 | Reconciliation item queue UI + resolution actions (fulfil, refund, suspense, write-off) | sonnet | deps: P1-150, P1-151
- [ ] P1-153 | Month-end close workflow (checklist in `finance_period`) and period lock | sonnet | deps: P1-150, P1-151, P1-149
- [ ] P1-154 | Finance dashboards v1 (deferred revenue, billings vs revenue, payments health, refunds, burn/runway) | sonnet | deps: P1-149
- [ ] P1-155 | Foreign flows: Paddle/Stripe payout import, `export_receipt` with 4-month alerts, foreign vendor payment schedule and reverse-charge calc | sonnet | deps: P1-151, P1-35
- [ ] P1-156 | Payee onboarding: `payee_profile`, encrypted details, creator/grader agreement acceptance and PDF storage, call-back verification, 7-day cooling on detail change | sonnet | deps: P1-147, P1-116
- [ ] P1-157 | Payout statements (asset fees, 10% royalty on own course, grader/rater items), PDF en/bn, dispute window, batch CSV, two-person approval with step-up 2FA; royalty accrual with 14-day hold and clawbacks | opus | deps: P1-156, P1-30
- [ ] P1-158 | `analytics` schema + read-only role `analytics_ro` + KPI views (K-01.. per 32 §2.5) + `internal_user` table | sonnet | deps: P0-14, P0-70
- [ ] P1-159 | `marketing_spend` table + weekly CSV import page + CAC view | sonnet | deps: P1-158
- [ ] P1-160 | Nightly data tests and PostHog-vs-DB purchase reconciliation alert | sonnet | deps: P1-44
- [ ] P1-161 | Experiment framework: PostHog experiments, server-side flag evaluation helper, `experiment_exposed`, SRM check job, brief template and registry, quarterly taxonomy review + stale-flag lint | sonnet | deps: P1-44, P1-119
- [ ] P1-162 | Message analytics: `message_*` events from `notification_dispatch`/webhooks, click attribution window, messaging dashboard | sonnet | deps: P1-164, P1-44
- [ ] P1-163 | Launch dashboards 1-8 in PostHog/Metabase with definitions and owners + WBR template | haiku | deps: P1-158, P1-44
- [ ] P1-164 | Notification dispatcher `notifications.dispatch` (decision order 29 §2.5) + ledger migration (`notification_dispatch`, `notification_setting`, enums) | sonnet | deps: P0-17, P0-69
- [ ] P1-165 | Auth and security templates N-AUTH-01..16 en/bn incl. plain text; Better Auth hooks and `auth.*` events | sonnet | deps: P1-164
- [ ] P1-166 | Preference centre `/app/settings/notifications`, one-click unsubscribe API, token page, consent sync with `marketing_opt_in` | sonnet | deps: P1-164
- [ ] P1-167 | Commerce templates N-COM (receipt, payment states, refund states, reconciliation notices) en/bn + `payment.reconcile_delayed` support hook | sonnet | deps: P1-34, P1-164
- [ ] P1-168 | SMS stack: segment calculator, template register with change control (CI blocks edits to registered strings without version bump), DLR webhook, operator failover, spend alarm; OTP SMS English-by-default policy | sonnet | deps: P0-18, P1-164
- [ ] P1-169 | Lifecycle engine: `lifecycle_enrolment` state machine, onboarding N-ONB-01..14, abandoned-checkout and win-back (M class) with sunset after 90 days | sonnet | deps: P1-164, P1-119
- [ ] P1-170 | Deliverability: DNS for three streams, DMARC rollout, Postmaster Tools, warm-up governor, bounce/complaint webhook to `contact_suppression` | sonnet | deps: P0-17
- [ ] P1-171 | Evaluation/results templates N-EVL-01..11 (incl. rescore broadcast) and staff/creator alerts N-STF-01..12 (grader SLA warning at 36 h of 48 h, digests, role-changed mail) | sonnet | deps: P1-164, P1-26
- [ ] P1-172 | Privacy templates N-PRV-01..11 and job hooks (export ready, deletion scheduled/reminders/cancelled/completed, policy update) | sonnet | deps: P1-164, P1-53
- [ ] P1-173 | Learning nudges, weekly progress digest (facts builder, deterministic email for Free) and exam countdown crons with cap class `nudge` and reminder-time settings | sonnet | deps: P1-164, P1-37
- [ ] P1-174 | Bangla copy pass for all T/S templates then P, glossary-driven, reviewer sign-off file per template | haiku | deps: P0-64, P1-165, P1-167
- [ ] P1-175 | Price-experiment engine: `price_lock`, `resolvePriceSet`, cache tags, strike-through ban during tests, Region A/minor exclusion (post-launch, before first price test) | sonnet | deps: P1-71, P1-161
- [ ] P1-176 | Pricing research kit: Van Westendorp survey (bn/en), analysis notebook/SQL, consent text (post-launch) | haiku | deps: P1-161
- [ ] P1-177 | P1.11 exit review: finance, analytics and messaging readiness (accountant gates G1-G9, consent tiers, deliverability) | opus | deps: P1-152, P1-153, P1-154, P1-155, P1-157, P1-159, P1-160, P1-161, P1-162, P1-163, P1-166, P1-168, P1-169, P1-170, P1-171, P1-172, P1-173, P1-174

#### P1.12 AI evaluation operations & calibration (gate: M2, M3)

- [ ] P1-178 | `ai-ops.ts` schema (rating_assignment, eval_run, model_release, ai_dispute..) + enum/permission additions | sonnet | deps: P1-26
- [ ] P1-179 | Rating tool: assignment modes, blind enforcement, seeded anchors, workload caps, incomplete-block assigner | sonnet | deps: P1-178, P1-30
- [ ] P1-180 | Adjudication view, rater analytics (QWK, bias, speed) and payment-lines hook to payouts | sonnet | deps: P1-179, P1-157
- [ ] P1-181 | Streamed audio player with watermark, no download and word-level transcript highlight | sonnet | deps: P1-179
- [ ] P1-182 | Research-use consent: `research_use` kind, en/bn copy, withdrawal flow, minors exclusion | sonnet | deps: P1-178, P1-117
- [ ] P1-183 | Gold-set ingestion: commissioned collection form, redaction pipeline, dedup, `author_hash`, split assignment (no author in both splits) | sonnet | deps: P1-178
- [ ] P1-184 | Harness v2 on P1-28: MAE, within-0.5, exact, QWK, bias, bootstrap CIs, subgroup slices, verdict logic, report generator, `eval_run` persistence | opus | deps: P1-28, P1-178
- [ ] P1-185 | Safety/injection, Bangla/Banglish, length and template suites | sonnet | deps: P1-184
- [ ] P1-186 | Calibration map fit and versioning per (model, family), dev-only enforcement | sonnet | deps: P1-184
- [ ] P1-187 | Model registry (`model_release`), pin flags, rollback command, live uniqueness | sonnet | deps: P1-178
- [ ] P1-188 | Production monitors (nightly canary, weekly PSI, `qa_sample`, `v_ai_agreement`, QWK/Wilson CI, cost/credit alerts), audit sampling job and `/admin/ai-monitor` dashboard incl. AI usage panels | sonnet | deps: P1-187, P1-179
- [ ] P1-189 | Beta presentation: badge, widened range, copy, per-family flag; beta gate checks L1-L6 | sonnet | deps: P1-184, P1-186
- [ ] P1-190 | `/accuracy` methodology page generated from `eval_run` JSON + claims register | sonnet | deps: P1-184
- [ ] P1-191 | Dispute flow: result-page button, triage rules, free-limit logic, `ai_dispute`, SLA timers, grader routing, second review, learner notifications, gold-candidate hook | sonnet | deps: P1-178, P1-30, P1-103
- [ ] P1-192 | AI cost controls: `pricing.ts` with CI recompute test, per-user/global caps, spend budget and degrade levels, result/STT cache, similarity throttle, prompt caching and batch API wiring | sonnet | deps: P1-26
- [ ] P1-193 | Equivalence tooling (paired bootstrap, non-inferiority) + shadow/canary scorer (one displayed score per submission) | opus | deps: P1-184, P1-187
- [ ] P1-194 | Gemini fallback qualification: own gate run, queue-and-retry until passed, monthly failover drill | sonnet | deps: P1-193
- [ ] P1-195 | Retention jobs: speaking audio 90 days (C6) with consented extension, audit purge, withdrawal deletion | sonnet | deps: P1-182
- [ ] P1-196 | AI feedback language policy: `evaluation_result.locale`, 'Explain in Bangla' toggle, Bangla test-set hooks | sonnet | deps: P1-26, P1-184
- [ ] P1-197 | Grader programme ops: qualification test, QWK-based probation, rate card, workload caps, availability, no-show reassignment, quality dashboard | sonnet | deps: P1-179, P1-30
- [ ] P1-198 | P1.12 exit review: AI evaluation operations (gold set, calibration, monitors, beta gate) | opus | deps: P1-180, P1-181, P1-183, P1-185, P1-188, P1-189, P1-190, P1-191, P1-192, P1-194, P1-195, P1-196, P1-197

#### P1.8 Hardening & launch (gate: M2, M3)

- [ ] P1-47 | E2E suites: signup -> purchase -> learn -> test -> result (+ mobile viewport) | sonnet | deps: P1-33, P1-23, P1-05
- [ ] P1-48 | Accessibility audit (axe + manual keyboard/screen-reader pass) and fixes | sonnet | deps: P1-47
- [ ] P1-49 | UI polish pass on top 10 pages against polish checklist | sonnet | deps: P1-47
- [ ] P1-50 | Security hardening: dependency audit, rate-limit review, authz sweep, secrets scan, final review | opus | deps: P1-47, P1-43
- [ ] P1-51 | Load test (k6): 1,000 concurrent attempts, autosave, checkout (scripts from P0-49) | sonnet | deps: P1-47, P0-49
- [ ] P1-52 | Backups, PITR, monthly restore drill, runbooks and alerts | sonnet | deps: P0-11
- [ ] P1-53 | Data export and account deletion flows | sonnet | deps: P0-31, P0-24
- [ ] P1-199 | Pre-launch finance dry run (gate G12): full month on sandbox data, accountant accepts the report | opus | deps: P1-153, P1-154, P1-36
- [ ] P1-200 | Launch drills: payment-pending/no-access simulation, OTP failure, exam outage bulk re-issue, refund end-to-end, DSAR synthetic, Zoom pilot day | opus | deps: P1-105, P1-107, P1-167, P1-64, P1-78, P1-112, P1-79, P1-100
- [ ] P1-54 | Launch checklist, status page content, go-live and business-readiness gates (BG-01..BG-14 ticked) | opus | deps: P1-19, P1-20, P1-21, P1-22, P1-48, P1-49, P1-50, P1-51, P1-52, P1-53, P1-55, P1-56, P1-82, P1-102, P1-126, P1-146, P1-177, P1-198, P1-199, P1-200

### P2 - Growth

#### P2.1 Live learning (gate: M4)

- [ ] P2-01 | Live batches: schema, scheduling, enrolment | sonnet | deps: P1-34
- [ ] P2-02 | Embedded YouTube Live (unlisted)/Zoom session pages + reminders | sonnet | deps: P2-01
- [ ] P2-17 | Live attendance auto-tracking (Zoom participant webhooks, YouTube heartbeat), intervention rules (missed 3 / < 60%), homework tracking, live-class analytics events and dashboard 10 | sonnet | deps: P2-01, P2-02, P1-100
- [ ] P2-18 | Accommodation self-serve request form (C18 P2) with evidence upload and support review | sonnet | deps: P1-65

#### P2.2 Engagement & community (gate: M4)

- [ ] P2-03 | Study plans: target score/date to weekly schedule | sonnet | deps: P1-37
- [ ] P2-04 | Streaks + XP + badges (restrained, no dark patterns) | sonnet | deps: P1-37
- [ ] P2-05 | Community Q&A per course with moderation | sonnet | deps: P1-39
- [ ] P2-19 | In-app moderation tooling: `moderation_case`, `/admin/moderation` queue, auto-flag lists (en/bn/Banglish) | sonnet | deps: P2-05, P1-103
- [ ] P2-20 | Plan-edit chat: constraint-parse prompt + zod + diff UI; adaptive rescheduling and calendar sync handled by P2-03 | sonnet | deps: P2-03, P1-133
- [ ] P2-21 | Quarterly NPS survey storage and dashboard | sonnet | deps: P1-114

#### P2.3 Growth monetisation & access programme (gate: M4)

- [ ] P2-06 | Coupons and campaign pricing | sonnet | deps: P1-36
- [ ] P2-07 | Affiliate/referral tracking and payouts report | sonnet | deps: P2-06
- [ ] P2-13 | bKash Tokenized Checkout direct integration | sonnet | deps: P1-32
- [ ] P2-14 | International auto-renew subscriptions (Paddle/Stripe) + dunning emails | sonnet | deps: P1-35
- [ ] P2-22 | bKash instalments (2-3 parts, Live/Mentor) with default grace then access pause, receivable tracking, dunning and instalment templates N-COM-16..18 | sonnet | deps: P2-13, P1-34, P1-167
- [ ] P2-23 | Scholarship workflow: application, evidence upload, need score, 50/75/100% awards, quota (<= 8%) and Access Fund budget guard, activation rule, abuse controls, transparency report | sonnet | deps: P1-74, P2-06
- [ ] P2-24 | Partner codes (UDC, NGO, TTC, university): partner dashboard, allow-listed products, caps and expiry, UDC commission accrual after refund window | sonnet | deps: P2-06, P2-07
- [ ] P2-25 | Multi-item `/cart` and bundle checkout (C24) | sonnet | deps: P1-33
- [ ] P2-26 | Physical books and COD: `physical_book` products, address book, Steadfast courier, COD handling and returns, watermarked PDF e-books, delivery fee rules | sonnet | deps: P1-69, P1-33, P1-57
- [ ] P2-27 | bKash/Nagad direct statement parsers and disbursement-API payouts (if eligible) | sonnet | deps: P2-13, P1-151
- [ ] P2-28 | Breakage sweep for expired credits (after OQ-F1 decision) | haiku | deps: P1-149
- [ ] P2-29 | Bank feed/API integration and accounting-software export format agreed with CA | sonnet | deps: P1-151
- [ ] P2-30 | Refund and claim dashboards (finance + admin) with alert at refund rate > 12% | haiku | deps: P1-78, P1-81

#### P2.4 Institutions & guardians (gate: M4)

- [ ] P2-08 | Institution accounts: org seats, cohorts, invitations | sonnet | deps: P0-14, P1-34
- [ ] P2-09 | Org analytics and assignments (courses/tests) | sonnet | deps: P2-08
- [ ] P2-10 | Guardian linking (student consent) + read-only parent view + pay-for-student | sonnet | deps: P1-37
- [ ] P2-31 | B2B invoicing (BIN, PO, credit terms), seat refund rules, coaching-centre bulk import template, offboarding/data return | sonnet | deps: P2-08, P1-148
- [ ] P2-32 | Guardian, org and subscription notification templates and jobs | sonnet | deps: P2-10, P2-08, P1-164
- [ ] P2-33 | Org/B2B and guardian analytics (groups by `org_id_hash`, usage, report exports) | sonnet | deps: P2-09, P1-158

#### P2.5 New exams, courses & pronunciation (gate: M4)

- [ ] P2-11 | PTE Academic module (item types, scoring tables) | sonnet | deps: P1-13
- [ ] P2-12 | Duolingo English Test practice module | sonnet | deps: P1-13
- [ ] P2-15 | Optional pronunciation scoring (Azure Pronunciation Assessment) | sonnet | deps: P1-27
- [ ] P2-34 | IELTS Life Skills A1/B1 module (config + content skeleton) on the exam-agnostic type registry | sonnet | deps: P1-13
- [ ] P2-35 | Spoken English track (course skeleton, AI conversation practice) incl. workplace variant | sonnet | deps: P1-26
- [ ] P2-36 | Pronunciation drills v1 (Deepgram proxy) then v2 (Azure PA) with Bangla-speaker error library and honest labels | sonnet | deps: P2-15
- [ ] P2-37 | Paraphrase trainer and extra rewrites (`coach_action` meter, `copied_words_ratio` in code) | sonnet | deps: P1-145
- [ ] P2-38 | Speaking partner (turn-based): session service, STT/LLM/TTS loop, summary, 'Score this session', credits (3 per 10-min session) | sonnet | deps: P1-27, P1-144, P1-72

#### P2.6 Admissions tools (Common App) (gate: M4)

- [ ] P2-39 | Admissions schema per 21 §6.3 (admissions_plan, college + requirements, college_target, application, task/deadline, activities, recommenders, essay_workspace, scholarship) + `adm.*` SKUs in price book | sonnet | deps: P1-69, P0-14
- [ ] P2-40 | College data curation tool and ~150 verified colleges seed with `verified_at` and stale-requirement alerts | haiku | deps: P2-39
- [ ] P2-41 | Deadline and document tracker, activities builder and recommender tracker with Inngest reminders | sonnet | deps: P2-39, P1-164
- [ ] P2-42 | Essay workspace with AI feedback (feedback only, never writing) and integrity red-team suite | sonnet | deps: P2-39, P1-25
- [ ] P2-43 | Scholarship finder (8 starter scholarships) and admissions dashboard widgets + webinars | sonnet | deps: P2-39
- [ ] P2-44 | P2b: UCAS question feedback, Germany/Canada/Australia checklists, SOP/CV reviewer, financial-aid estimator | sonnet | deps: P2-42
- [ ] P2-45 | `counsellor` role surface: `(counsellor)` routes, assigned-student policy in `assertCan`, 2FA enforced, Guided tier human-review workflow (2 reviews) | opus | deps: P2-44, P0-22

#### P2.7 AI learning (growth) (gate: M4)

- [ ] P2-46 | Auto-card drafting (Haiku) + editor approval queue + leech mnemonic suggestions | sonnet | deps: P1-129, P1-145
- [ ] P2-47 | FSRS parameter optimiser Inngest job with guardrails (>= 1,000 reviews) | sonnet | deps: P1-128
- [ ] P2-48 | AI narration + numeric validator + fallback for reports and estimates; guardian copy | sonnet | deps: P1-139, P1-173
- [ ] P2-49 | Post-exam report capture, TRF upload and verification queue, calibration jobs, `/accuracy` score-estimate section and drift alerts | sonnet | deps: P1-138, P1-81, P1-190
- [ ] P2-50 | Audio Overviews: pipeline (script, verify, TTS, loudness, VTT/chapters, R2) with 5-episode EN pilot; Listen UI with transcript sync, chapters, offline and low-data variant, Media Session | sonnet | deps: P1-144, P1-141
- [ ] P2-51 | Bangla audio set (native script, back-translation verifier, BN editor sign-off) and mind-map generator/viewer | sonnet | deps: P2-50
- [ ] P2-52 | 'Pause and ask' bridge from player to Ask Lumen with chapter context | sonnet | deps: P2-50, P1-134
- [ ] P2-53 | My notebook: tables, upload scanning, text-layer ingest, per-user index, deletion jobs, notebook chat + Audio Overview (5 credits), ToS/consent, DPIA update | sonnet | deps: P1-131, P2-50, P1-122

#### P2.8 Operations growth (messaging, analytics, support, AI ops) (gate: M4)

- [ ] P2-54 | Web push (PWA): opt-in, quiet hours, 1 nudge/day, 410 cleanup, no PII in payload | sonnet | deps: P1-98, P1-173
- [ ] P2-55 | WhatsApp Business adapter, opt-in flow, template submission pack, STOP handling | sonnet | deps: P1-168
- [ ] P2-56 | Template health dashboard and weekly report | sonnet | deps: P1-164, P1-158
- [ ] P2-57 | Server-side ad conversions (Meta CAPI / Google) behind consent and flag | sonnet | deps: P1-119
- [ ] P2-58 | Warehouse stage S1: PostHog batch export to BigQuery (or R2/ClickHouse), dbt marts, tombstone refresh | sonnet | deps: P1-158
- [ ] P2-59 | Enforcement ladder full: abuse-score tuning, user notices, appeals UI | sonnet | deps: P1-110
- [ ] P2-60 | P2 gate review: native ticketing vs Chatwoot decision memo | opus | deps: P1-115
- [ ] P2-61 | Remove Beta per family via CI rule once Phase B gates pass; publish update; grader capacity model and hiring triggers | sonnet | deps: P1-190, P1-188
- [ ] P2-62 | Tolgee/Weblate evaluation spike (1 day) at 2,500 strings or second translator | sonnet | deps: P0-63

#### P2.9 Phase review (gate: M4)

- [ ] P2-16 | P2 security and performance review | opus | deps: P2-13, P2-14, P2-08

### P3 - Expansion

#### P3.1 Marketplace (gate: M5)

- [ ] P3-01 | Marketplace schema: instructor profiles, KYC status, revenue-share rules | sonnet | deps: P2-16
- [ ] P3-02 | Revenue-share ledger and payout runs | opus | deps: P3-01
- [ ] P3-03 | Instructor onboarding + application review | sonnet | deps: P3-01

#### P3.2 API, search & mobile (gate: M5)

- [ ] P3-04 | Public API: Hono at /api/v1 with OpenAPI from zod | sonnet | deps: P1-34
- [ ] P3-09 | Meilisearch for catalogue/question search | sonnet | deps: P1-43
- [ ] P3-10 | Expo mobile app (learner features) against /api/v1 | sonnet | deps: P3-04

#### P3.3 Tech & university tracks (gate: M5)

- [ ] P3-05 | Tech tracks content model (Python, ML, AI, Databases, Networking) | sonnet | deps: P1-01
- [ ] P3-06 | University course packs (BD CSE syllabus) and semester bundles | sonnet | deps: P3-05
- [ ] P3-07 | In-browser code notebooks (sandboxed execution) | opus | deps: P3-05
- [ ] P3-08 | Auto-graded coding exercises | sonnet | deps: P3-07

#### P3.4 Live, media & new tests (gate: M5)

- [ ] P3-11 | LiveKit in-house live classes | sonnet | deps: P2-02
- [ ] P3-12 | DRM evaluation (Widevine/FairPlay) if piracy material | opus | deps: P1-04
- [ ] P3-14 | TOEFL iBT 2026 module and course packaging | sonnet | deps: P1-13
- [ ] P3-15 | Work-Abroad language tracks: Korean EPS-TOPIK and Japanese JFT-Basic | sonnet | deps: P3-05
- [ ] P3-16 | Optional OET / SAT / GMAT prep modules (go/no-go memo first) | sonnet | deps: P1-13
- [ ] P3-17 | Open Badges 3.0 and LinkedIn deep-link polish for certificates | haiku | deps: P1-89
- [ ] P3-18 | QTI 3.0 export of the question bank (exporter only, pure function) | sonnet | deps: P1-07
- [ ] P3-19 | Duplex speaking-partner spike (token minting, streaming STT/LLM/TTS, host choice) | opus | deps: P2-38
- [ ] P3-20 | Visual overview feasibility memo with cost | opus | deps: P2-50
- [ ] P3-21 | NBA ML-ranker prerequisites: impression logging, holdout, offline replay (analysis only) | opus | deps: P1-86
- [ ] P3-22 | Yearly locked-test refresh job, rater re-certification and prompt retirement | sonnet | deps: P2-61

#### P3.5 Admissions (counsellor tier) & phase review (gate: M5)

- [ ] P3-23 | Counsellor tier: session packages, session notes, counsellor assignment | sonnet | deps: P2-45
- [ ] P3-24 | AI interview and visa-interview prep | sonnet | deps: P2-42
- [ ] P3-25 | B2B school dashboards for admissions (org) | sonnet | deps: P2-41, P2-08
- [ ] P3-13 | P3 security, scale and cost review | opus | deps: P3-02, P3-07, P3-10

## Done log

| Date | Task | Commit | Tool/model | Notes |
|---|---|---|---|---|
| 2026-11-11 | P0-51 | bootstrap | 3.8-flash | Pinned node 22.20.0, pnpm 9.15.0, .npmrc 3-day age guard |
| 2026-11-11 | P0-45 | bootstrap | 3.8-flash | POSIX hook compliance verified; git push block guard active |
| 2026-11-11 | P0-46 | bootstrap | argon | Scaffolded docs/logs tree, CHANGELOG.md, and FILEMAP.md |
| 2026-11-11 | P0-01 | e4e66bb | argon | Monorepo scaffold: 8 packages, turbo --concurrency=2, memory runner |
| 2026-11-11 | P0-02 | 383ba2c | 3.8-flash | Shared TS strict, ESLint flat config, Prettier presets in packages/config |
| 2026-11-11 | P0-03 | 0f06a74 | 3.8-flash | Brand identity (brand.ts), Zod-validated env.ts, and root .env.example |
| 2026-11-11 | P0-04 | 1943891 | 3.8-flash | apps/web Next.js 16 + React 19 App Router skeleton with 8GB RAM protections |
| 2026-11-11 | P0-05 | a40eb35 | 3.8-flash | Tailwind CSS v4 + Lumen design system tokens & GRE themes |
| 2026-11-11 | P0-06 | e34e600 | 3.8-flash | Core UI primitives in packages/ui with Vitest unit tests |
| 2026-11-11 | P0-09 | 18fc0a5 | 3.8-flash | Canonical App Shells (Marketing, Learner, GRE CBT Exam) |
| 2026-11-11 | P0-10 | fb14ae5 | 3.8-flash | next-intl localization (en/bn) + Bangla digits/currency utilities |
| 2026-11-12 | P0-12 | 6c386cd | 3.8-flash | Drizzle ORM + Neon driver, D13 pedagogy schema (hints, traps, Socratic steps), and FSRS vocab decks |
| 2026-11-12 | P0-13-14 | e089c3c | 3.8-flash | Better Auth server/client, 11 additive roles, mandatory 2FA, assertCan policy engine |
| 2026-11-12 | P0-15-16 | 22a01a4 | 3.8-flash | Canonical price book seed (147 products) & original GRE Magoosh-parity demo pack (12 questions + 30 vocab) |

## Parking lot (not scheduled, add a task ID before work)

- (empty)
