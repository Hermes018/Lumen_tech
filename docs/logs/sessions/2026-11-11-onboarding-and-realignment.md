# Session 2026-11-11 Onboarding and Architectural Realignment

- **Lead Engineer:** 3.8 Flash (High) / Antigravity
- **Founder:** Ayman Rahman (`Hermes018`, `aymanrahman30@gmail.com`)
- **Status:** Initial onboarding complete; architectural realignment executed and locked.

---

## 1. Recorded Hardware & Dual-Boot OS Matrix

- **Machine:** Laptop with Intel Core i5-1135G7 (4C/8T), 8 GB DDR4 RAM, NVIDIA GeForce MX330 (2 GB VRAM), dual-SSD storage.
- **Dual-Boot Environment:**
  - OS 1: Windows 11 (Git Bash / WSL2 / PowerShell).
  - OS 2: Fedora 44 KDE Plasma (native bash, systemd, zram/swap).
- **8 GB RAM Survival Rules (Non-Negotiables):**
  - Node Memory Cap: `NODE_OPTIONS="--max-old-space-size=2048"` (2 GB max).
  - Concurrency Cap: `turbo run ... --concurrency=2`, Vitest `--pool=forks --maxWorkers=2 --no-file-parallelism`, `tsc --noEmit --incremental`, Next.js build/dev limited to <= 2 worker threads, no concurrent dev and build.
  - Zero Local Containers: NEVER run Docker Desktop, Podman, local Postgres, or local Redis. DB is strictly cloud Neon Postgres; rate-limit is Upstash Redis / DB fallback.
  - No Local Playwright/Browser Swarms: E2E and Lighthouse run in GitHub Actions CI. Local runs L0 + L1.
- **Dual-Boot OS-Baton Protocol:**
  - `git commit` locally -> `git push` (when authorized) -> boot other OS -> `git pull --rebase` -> `pnpm install --prefer-offline`.
  - Hooks use POSIX `#!/usr/bin/env sh` with zero macOS-specific flags.

---

## 2. Realigned Model Routing (Google AI Pro Limits)

- **3.8 Flash (high | med | low) — Daily Lead & Primary Builder (90%+ of work):**
  - High: Daily Lead Orchestrator, planning, task cards, complex features, Drizzle schemas, Exam Shell, Magoosh practice.
  - Med: Standard features (frontend, backend, db, qa, ui).
  - Low: Fast exploration, Tier B/C indexing, pre-commit checks.
- **Argon (high | med | low) — Mechanical & Volume Workhorse:**
  - High: Standard CRUD routes, UI scaffolding from tokens, Vitest unit test suites, seed scripts, Zod schemas.
  - Med: `i18n-copywriter` (Bangla/English), `seed-data-maker` (GRE vocab decks), `docs-scribe` (logs, PROGRESS, FILEMAP).
  - Low: `lint-fixer`, formatting, boilerplate files, git hook checks, directory scaffolding.
- **Sonnet 5.5 (high | med) — Specialist Escalation & Two-Key Reviewer:**
  - Med: Complex algorithmic tasks (fails twice on Flash), intricate GRE section adaptivity, RBAC assertCan, webhook signature verification.
  - High: Default Two-Key Reviewer (`architect-reviewer`, `security-auditor`) for auth, payments, DB migrations, scoring PRs.
- **Opus 5.5 (high only) — Break-Glass / Milestone Sign-Off Only (<2% of tasks):**
  - Strictly locked. Requires explicit Founder permission for P0 security/data bugs or Milestone M0-M3 final gate sign-off (<250 lines diff).
- **Quiet Output Rule:** All test/lint/build commands pipe to log files and print exit code + first 25 error lines.

---

## 3. Product Strategic Priority — GRE-First & Magoosh Parity (M0/M1)

- **GRE CBT Mock & Practice Engine (docs/07 & docs/15):**
  - Section-level adaptivity: Verbal (12Q/18m -> 15Q/23m) and Quant (12Q/21m -> 15Q/26m).
  - Exact Question Types: Text Completion (1/2/3-blank no partial credit), Sentence Equivalence (2 of 6 no partial credit), Reading Comprehension (single, multi, select-in-passage); Quantitative Comparison, Numeric Entry (single & fraction), Multiple-Choice; AWA 30-min "Analyze an Issue" essay with AI eval.
  - GRE Exam Shell Tools: On-screen 4-function calculator with transfer-display (Quant), mark/flag, review screen, strikethrough option eliminator, server timer, 10s autosave.
- **Magoosh-Style Practice & Smart Learning (docs/03 & docs/34):**
  - Custom Practice Sessions: Filter by topic, difficulty (Easy/Medium/Hard/Very Hard), and mode (Timed vs Untimed/Tutor).
  - Rich Explanations: Written step-by-step, video explanation embed slot, AI Tutor contextual drawer ("Ask about this question"), personal notes.
  - Pacing Tracker & Score Predictor: Time-per-question vs target, accuracy by topic, estimated GRE Verbal & Quant score predictor (130-170).
  - GRE Vocab Pro (FSRS): Spaced-repetition decks (Common, Basic, Advanced) with mnemonics, example sentences, mastery states.

---

## 4. Locked P0 Defaults (Zero Tasks Blocked)

- **Brand placeholder:** `Lumen Academy` in `packages/config/brand.ts`.
- **SMS Gateway:** `SmsProvider` interface + console/DB stub for development.
- **Payments:** `PaymentProvider` interface + SSLCommerz sandbox & Paddle sandbox stubs.

---

## 5. Tier B Mental Index (docs 01–34)

| Doc | Purpose | Key Anchors |
|---|---|---|
| **01-COMPETITOR-TEARDOWN** | Teardown of 27 global and local ed-tech platforms | §1 Matrix, §3 Magoosh, §5 10MS, §9 Gaps |
| **02-BUSINESS-PLAN** | Market sizing, unit economics, projections, funding, risks | §2 Market, §6 Tiers, §10 Budget, §14 KPIs |
| **03-PRODUCT-SPEC** | Personas, journeys, sitemap, full feature specifications | §2 Sitemap, §5 Exam shell, §6 Dashboards, §11 Magoosh practice |
| **04-ARCHITECTURE** | Monorepo layout, domains, rendering/caching lifecycle | §1 Monorepo tree, §3 Domains, §6 Caching, §9 Env |
| **05-DATABASE** | Canonical Drizzle schema (188 tables), ERDs, integrity, PII | §2 Auth/users, §4 Attempts, §5 Questions, §7 Commerce |
| **06-API-AND-SERVICES** | Service pattern, server actions, endpoints, permission matrix | §1 assertCan, §3 Service catalogue, §7 Events |
| **07-TEST-ENGINE** | CBT engine, question types, scoring, adaptivity, AI eval | §2 IELTS/GRE blueprints, §3 Question types, §5 Adaptivity, §7 Scoring |
| **08-UI-UX-DESIGN-SYSTEM** | Tokens, components, page layouts, motion, design checklist | §2 Tokens, §4 Core components, §7 Exam shell UI |
| **09-SECURITY-AUTH-COMPLIANCE** | Threat model, Better Auth, RBAC, ASVS L2, CSP, AI safety | §2 Auth & 2FA, §4 RBAC assertCan, §7 CSP |
| **10-PAYMENTS-VIDEO-INTEGRATIONS** | SSLCommerz, Paddle, Bunny Stream, R2, email/SMS, env vars | §2 SSLCommerz, §4 Paddle, §6 Bunny, §15 Env vars |
| **11-DEVOPS-OBSERVABILITY** | CI/CD pipelines, migrations, Sentry, Axiom, launch checklist | §1 CI/CD, §3 Migrations, §6 Monitoring, §10 Launch |
| **12-BUILD-PLAN-AGENTS** | Routing, task cards, DoD, handoff, 358-task backlog | §2 Routing, §6 Checklists, §7 DoD, §11 Backlog |
| **13-PROMPTS** | 19 ready-to-use prompts for orchestration, review, handoff | §1 Kickoff, §3 Dispatch, §10 Gemini resume, §13 Checkpoint |
| **14-CURRICULUM-IELTS** | Complete IELTS syllabus by skill, tier maps, study plans | §2 Syllabus, §4 Tier maps, §7 Lesson outlines |
| **15-CURRICULUM-GRE-AND-OTHER-TESTS** | GRE, PTE, DET, TOEFL, tech tracks, university packs | §1 GRE syllabus, §2 Quant/Verbal taxonomy, §5 Vocabulary |
| **16-CONTENT-SOURCING-AND-PRODUCTION** | Licensing, item writing, AI pipeline, audio/video standards | §2 Licensing, §4 Item writing, §7 Audio specs |
| **17-PRICING-MASTER** | Canonical prices, tiers, perks, add-ons, YAML price book | §2 Pricing tiers, §6 Regional matrix, §13 SEED block |
| **18-LIVE-CLASSES** | Zoom pilot cohorts P1, in-app P2, teachers, scheduling | §2 Zoom pilot, §5 Session plans, §8 Ops |
| **19-MARKETING-BANGLADESH** | BD student segments, Bangla messaging, channels, budget | §2 Segments, §5 Channels, §8 Calendar |
| **20-MARKETING-INTERNATIONAL** | International target regions, PPP pricing, SEO | §2 Regions, §5 Acquisition, §8 Mirror table |
| **21-ADMISSIONS-COMMON-APP** | Common App admissions tools, counsellor role | §2 Offerings, §4 Counsellor workflow, §7 Ethics |
| **22-ENGINEERING-GUARDRAILS** | Guardrails, model costs, verification ladder, git, 8GB caps | §1 Milestones, §2 Routing, §5 Ladder, §8 Git, §10 8GB RAM |
| **23-DESIGN-RESEARCH-PLAYBOOK** | Ethical teardowns, motion tokens, micro-interactions | §2 Principles, §5 Motion catalogue, §10 Teardown template |
| **24-TIMELINE** | M0–M5 milestones, Gantt, first 4 weeks, critical path | §1 Headlines, §2 Gantt, §5 Week-by-week |
| **25-GAP-AUDIT** | Independent audit report, GA resolutions | §2 Audit findings, §7 Resolutions |
| **26-LEGAL-AND-POLICY-DRAFTS** | Terms, Privacy Policy, refund policy, IP terms | §2 Terms, §4 Privacy, §6 Refunds (counsel review required) |
| **27-SUPPORT-AND-TRUST-OPERATIONS** | Helpdesk (Chatwoot), SLAs, macros, safeguarding | §2 SLAs, §4 Chatwoot, §7 Safeguarding |
| **28-FOUNDER-SETUP-AND-ENVIRONMENTS** | Dual-boot setup, accounts order, .env.example, 8GB caps | §1 Map, §8 Accounts order, §9 .env.example, §16 8GB caps |
| **29-NOTIFICATIONS-AND-LIFECYCLE-MESSAGING** | 146 message catalogue, SMS/WhatsApp/email triggers | §2 Channels, §4 Catalogue, §8 Templates |
| **30-FINANCE-TAX-AND-PAYOUTS-OPS** | Revenue recognition, VAT/Mushak, reconciliation | §2 VAT position, §4 Payouts, §7 CA gate |
| **31-AI-EVALUATION-OPERATIONS** | Raters, gold sets, eval harness, calibration, QWK | §2 Gold set, §4 Calibration harness, §7 Metrics |
| **32-ANALYTICS-AND-EXPERIMENTATION** | Event taxonomy, PostHog, KPI dictionary | §2 Taxonomy, §5 PostHog, §8 Experiments |
| **33-I18N-AND-BANGLA-LOCALISATION-WORKFLOW** | next-intl, Bangla typography, translation workflow | §2 next-intl, §5 Bangla rules, §8 Glossary |
| **34-AI-LEARNING-FEATURES** | AI tutor, FSRS flashcards, score predictor, pacing | §2 AI Tutor, §4 FSRS Vocab, §6 Pacing/Predictor |

---

## 6. Commit Summary

Phase 1 through Phase 5 changes staged and committed locally under Founder git identity. Next step is Phase 6 execution.
