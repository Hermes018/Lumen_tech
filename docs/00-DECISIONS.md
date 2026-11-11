# 00 — Locked Decisions (Architecture Decision Record)

> **This file is the single source of truth.** Every other doc, every agent and every prompt MUST conform to it.
> If a doc disagrees with this file, this file wins. Changing a decision = edit this file first, add a dated line to the Change Log at the bottom, then update dependent docs.

Working brand name: **Lumen Academy** (placeholder — set once in `packages/config/brand.ts`; never hard-code the name elsewhere).
Market: **Bangladesh-first** (Bangla + English UI, BDT pricing, bKash/Nagad), sells internationally (USD) from day one.
Date locked: 2026-11-07.

---

## D1. Product scope by phase

| Phase | Ships | Not yet |
|---|---|---|
| **P0 – Foundation** | Repo, design system, auth (Google + email OTP + phone OTP), RBAC, marketing site, catalogue, CMS for courses | Payments |
| **P1 – MVP (launch)** | IELTS (Academic + GT) & GRE courses, lesson player, question bank, **full CBT mock-test engine**, AI Writing/Speaking/AWA evaluation, SSLCommerz checkout, learner dashboard, instructor/editor CMS, admin console, English Foundation, "Which test do I need?" quiz, **Live tier as manually-run Zoom pilot cohorts** (enrolment + entitlement in-app; scheduling/attendance by ops; recordings → Bunny) | Live classes in-house, mobile apps |
| **P2 – Growth** | Live batches (scheduled classes via embedded YouTube Live/Zoom), study plans, streaks/XP, community Q&A, coupons/affiliates, institution (B2B) accounts, parent view, PTE + Duolingo English Test, Spoken English, Admissions (Common App) tools | Native apps |
| **P3 – Expansion** | Instructor marketplace (revenue share), tech tracks (Python, ML, AI, Databases, Networking), university course packs (BD CSE syllabus), in-browser code notebooks, Expo mobile app, LiveKit in-house live, Work-Abroad language tracks (EPS-TOPIK, JFT-Basic), optional OET / SAT prep | — |

**Catalogue phase map (from 14/15):** P1 — IELTS Academic, IELTS GT (4 full mocks each in Core), IELTS Writing Mastery, Speaking Mastery, L&R Accelerator, IELTS Crash Course (Zoom pilot), Mock Test Series, English Foundation, GRE (Verbal/Quant/AWA/Vocab). P2 — IELTS Life Skills A1/B1, Spoken English, PTE, DET, Admissions tools. P3 — TOEFL 2026, tech tracks, university packs, Work-Abroad tracks, optional OET/SAT/GMAT.

**Strategic Build Priority (M0 & M1) — GRE-First & Magoosh-Parity Core:**
While the platform architecture remains strictly multi-exam (GRE + IELTS), our immediate build priority for M0 (Clickable Prototype) and M1 (Alpha) is the GRE Suite & Magoosh-style Learning Engine:
1. **GRE CBT Mock & Practice Engine (docs/07 & docs/15):**
   - Section-Level Adaptivity: Verbal (Section 1: 12Q/18m -> Section 2: 15Q/23m Easy/Med/Hard routing) & Quant (Section 1: 12Q/21m -> Section 2: 15Q/26m).
   - Exact Question Types: Text Completion (1/2/3-blank, no partial credit), Sentence Equivalence (pick 2 of 6, no partial credit), Reading Comprehension (single, multi-select, select-in-passage); Quantitative Comparison (A/B/C/D), Numeric Entry (single box & fraction two-box), Multiple-Choice (single & multi-select); AWA 30-min "Analyze an Issue" essay with AI evaluation.
   - GRE Exam Shell Tools: On-screen 4-function calculator with transfer-display (Quant only), mark/flag for review, question review screen, strikethrough option eliminator, server-authoritative section timer, 10s autosave.
2. **Magoosh-Style Practice & Smart Learning Features (docs/03 & docs/34):**
   - Custom Practice Sessions: Filter by topic, difficulty (Easy/Medium/Hard/Very Hard), and mode (Timed vs Untimed/Tutor).
   - Rich Explanations: Written step-by-step explanation, video explanation embed slot, AI Tutor contextual drawer ("Ask about this question"), personal notes.
   - Analytics & Pacing Tracker: Time-per-question vs target pace, topic accuracy, estimated GRE Verbal & Quant (130–170) score predictor.
   - GRE Vocab Pro (FSRS Flashcards): Spaced-repetition decks (Common, Basic, Advanced) with mnemonics, example sentences, and mastery states (New -> Learning -> Reviewing -> Mastered).

## D2. Architecture style

- **Modular monolith** in a **pnpm + Turborepo monorepo**. No microservices. Every domain is a folder in `packages/core/src/<domain>` with a public `index.ts`; domains talk only through those exports.
- One deployable web app (`apps/web`, Next.js) + one background-jobs runtime (Inngest functions served from `apps/web/app/api/inngest`).
- Server is authoritative for: auth, permissions, prices, entitlements, test timers, scoring.

**Canonical route groups (`apps/web/app/[locale]/…`)** — every doc and agent uses exactly these:

| Route group | URL prefix | Shell | Who |
|---|---|---|---|
| `(marketing)` | `/`, `/ielts`, `/gre`, `/courses`, `/pricing`, `/blog`, `/tools/*`, `/verify/[code]`, `/help`, `/status`, `/changelog`, `/accessibility`, legal | Marketing | Public |
| `(auth)` | `/sign-in`, `/sign-up`, `/onboarding` | Marketing (minimal) | Public / partial |
| `(checkout)` | `/cart` (P2; P1 = Buy now), `/checkout`, `/checkout/return`, `/orders` | Marketing (minimal) | Signed-in |
| `(learner)` | `/app` (role-aware dashboard), `/app/learn/[course]/[lesson]`, `/app/practice`, `/app/tests`, `/app/vocab`, `/app/plan`, `/app/progress`, `/app/settings` | App | `student`, `guardian` (read-only views) |
| `(exam)` | `/exam/[attemptId]` | Full-screen exam shell | Signed-in + entitlement (diagnostic: guest) |
| `(studio)` | `/studio/**` | App | `instructor` (own), `content_editor`+ (all) |
| `(grader)` | `/grader/**` | App | `grader` |
| `(staff)` | `/editor/**`, `/support/**`, `/finance/**` | App | `content_editor`, `support`, `finance` |
| `(org)` | `/org/[orgSlug]/**` | App | `org_admin` of that org |
| `(counsellor)` | `/counsellor/**` (P2/P3) | App | `counsellor` |
| `(admin)` | `/admin/**` | App | `admin`, `super_admin` |
| — | `/api/webhooks/*`, `/api/inngest`, `/api/uploads/*`, `/api/exam/*`, `/api/v1/*` (P3) | — | Machine |

Locale: next-intl `localePrefix: 'as-needed'` — English at root, Bangla under `/bn/…`, `hreflang` on public pages.

```
repo/
  apps/web/                 Next.js 16 App Router (UI + server actions + route handlers)
  packages/core/            Domain logic (services, policies, zod schemas) — NO React, NO Next imports
  packages/db/              Drizzle schema, migrations, seed
  packages/auth/            Better Auth config + RBAC permission map
  packages/ui/              shadcn/ui-based design system (Lumen UI)
  packages/config/          brand.ts, env.ts (zod-validated), eslint/tsconfig presets
  packages/ai/              LLM + speech-to-text adapters, prompt templates, eval harness
  tooling/                  scripts, codemods
  docs/                     these documents
```

## D3. Stack (exact choices)

| Concern | Choice | Notes |
|---|---|---|
| Language | **TypeScript 5.x strict** everywhere | `noUncheckedIndexedAccess: true` |
| Web framework | **Next.js 16 (App Router), React 19** | Pin latest patched 16.x; subscribe to Next.js security releases. Never rely on `middleware/proxy` alone for auth (see D7). |
| Styling | **Tailwind CSS v4** + CSS variables tokens | |
| Components | **shadcn/ui** (Radix primitives) copied into `packages/ui`, restyled to Lumen tokens | MIT; no paid UI kits required |
| Motion | **Motion** (`motion/react`) | Respect `prefers-reduced-motion` |
| Icons | **Lucide** | SF Symbols are not licensed for web — do not use |
| Forms | react-hook-form + zod | Same zod schema validates server-side |
| Data fetching | React Server Components + server actions for web; TanStack Query only for client-heavy screens (test engine, dashboards) | |
| Public API (mobile/3rd-party, P3) | **Hono** mounted at `/api/v1/*` route handler, OpenAPI generated from zod | Same `packages/core` services |
| ORM | **Drizzle ORM** + drizzle-kit migrations | SQL-first, no codegen step, Better Auth adapter exists |
| Database | **PostgreSQL 17+** — **Neon** (Singapore `ap-southeast-1`) | Branch per PR preview. Fallback: Supabase Postgres (DB only) or self-hosted on Hetzner Singapore |
| Auth | **Better Auth** (MIT) | Google OAuth, email OTP/magic link, phone OTP (BD SMS gateway), passkeys, TOTP 2FA, admin plugin, organization plugin |
| Jobs / workflows | **Inngest** | AI grading, emails, video webhooks, entitlement expiry, reports. Fallback: pg-boss on a VPS worker |
| File storage | **Cloudflare R2** (S3 API, zero egress) | Presigned uploads only; private buckets |
| Video (VOD) | **Bunny Stream** (HLS, token-authenticated embed, Asia PoPs) | Dynamic visible watermark (user email/phone). DRM (Widevine/FairPlay) only if piracy becomes material |
| Live classes | P2: embedded **YouTube Live (unlisted)** or **Zoom**; P3: **LiveKit** | |
| Payments (BD) | **SSLCommerz** hosted checkout (bKash, Nagad, Rocket, cards) | Always validate via IPN + Order Validation API server-side. bKash Tokenized Checkout direct in P2 for lower fees |
| Payments (intl) | **Paddle** (merchant of record) if onboarding succeeds; else **Stripe via a foreign entity** (e.g., Stripe Atlas US LLC) | Abstracted behind `PaymentProvider` interface |
| Email | **Resend** (React Email templates); fallback Amazon SES | |
| SMS OTP | BD SMS gateway (SSL Wireless / Alpha SMS / BulkSMSBD) behind `SmsProvider` | Phone login is expected by BD users |
| Search | Postgres full-text + `pg_trgm` (P1); Meilisearch (P3) | |
| LLM | **Anthropic Claude** via `packages/ai` adapter: Haiku for cheap feedback/classification, Sonnet for band scoring; Gemini as hot fallback | Structured JSON output validated by zod |
| Speech-to-text | **Deepgram Nova-3** (default for Speaking — returns word-level timestamps needed for pause/fluency features) / OpenAI `whisper-1` with `timestamp_granularities=word` (fallback). `gpt-4o-mini-transcribe` only where timestamps are not needed (e.g., dictation/notes) — verify current timestamp support before relying on it | Pronunciation scoring: Azure Pronunciation Assessment (optional P2) |
| Rich text / lessons | **Tiptap** (JSON stored), KaTeX for math, Shiki for code | |
| i18n | **next-intl**, locales `en`, `bn` | Bangla font: Noto Sans Bengali / Hind Siliguri |
| Analytics | **PostHog** (product, funnels, flags) — EU or US cloud, cookie-consent gated | |
| Errors / APM | **Sentry** | Scrub PII |
| Rate limiting | **Upstash Redis** (serverless, sliding window via `@upstash/ratelimit`), Postgres-table fallback if Redis unavailable | Per IP + per user + per route class (see 09) |
| Bot protection | **Cloudflare Turnstile** on signup, OTP, checkout, contact | |
| Hosting | **Vercel Pro** (functions in `sin1`/`bom1`) + Cloudflare DNS/WAF in front | Vercel Hobby is non-commercial — do not launch on it. Budget fallback: Hetzner Singapore + Coolify |
| Testing | Vitest (unit), Playwright (e2e), axe-core (a11y), Lighthouse CI | |
| Lint/format | ESLint (flat config) + Prettier, `tsc --noEmit` | |
| CI/CD | GitHub Actions: typecheck → lint → test → build → e2e on preview; Gitleaks; OSV-Scanner; CodeQL; Renovate | pnpm `minimumReleaseAge` ≥ 3 days to blunt npm supply-chain worms |

## D4. Roles (RBAC + ownership checks)

Roles are **additive** (a user can hold several). Permissions are strings `resource:action` defined once in `packages/auth/src/permissions.ts`.

| Role | Who | Core abilities |
|---|---|---|
| `guest` | Not signed in | Browse catalogue, free lessons, free diagnostic test (results gated behind sign-up) |
| `student` | Default on sign-up | Enroll, learn, take tests, request AI evaluations (credit-limited), Q&A, reviews, own profile/data export/delete |
| `guardian` | Parent linked to a student (student consents) | Read-only progress, receipts, pay for a linked student |
| `instructor` | Approved teacher | Create/edit **own** courses & question sets as drafts, submit for review, answer Q&A in own courses, see own analytics/earnings |
| `grader` | Human evaluator / TA | Queue of writing/speaking submissions assigned to them; override AI band with rationale |
| `content_editor` | In-house editorial | Review & publish any course/question, manage taxonomy, SEO pages, blog |
| `support` | Support desk | Read user/order info (masked PII), resend receipts, extend access ≤ 7 days, impersonate **read-only** with reason (audited) |
| `finance` | Accounts | Orders, refunds, payouts, coupons, revenue reports, VAT exports |
| `counsellor` | Admissions counsellor (P2/P3, see 21) | Assigned students' application workspaces: essay **feedback** (never writing), college lists, deadlines, session notes; no access to payments or other students |
| `org_admin` | Institution (coaching centre, university) admin | Manage seats/members/cohorts within own org, assign courses & tests, org analytics |
| `admin` | Platform operations | Everything above except role grants to `admin`/`super_admin`, secrets, and destructive bulk ops |
| `super_admin` | Founder(s) only (≤ 2 people) | All, incl. role management. **Mandatory passkey or TOTP 2FA.** |

Rules: every staff role (`grader`+) **and** `instructor`, `org_admin` and `counsellor` require 2FA (passkey or TOTP). Authorization is checked in **`packages/core` service functions** (`assertCan(actor, 'course:update', course)`), never only in UI or route middleware. Ownership/tenant checks (instructor owns course; org_admin's `orgId` matches) are part of the policy.

## D5. Commerce model

- **Products**: `course`, `bundle`, `test_pack` (N mock tests), `ai_credits` (N evaluations), `pass` (time-boxed all-access: 1/3/6/12 months), `live_batch`, `org_seat_pack` (B2B), `human_review_credits` (essay reviews / speaking mocks / 1:1 sessions), `service` (admissions & counselling packages), `physical_book` (shipped; COD allowed; delivery per Digital Commerce Guidelines 2021).
- **Entitlements** are the only thing the app checks for access. Orders → Payments → Entitlements (with `starts_at`, `ends_at`, `source`).
- BD subscriptions are **prepaid passes** (no auto-renew; renewal reminders at T-7/T-1). International: auto-renew via Paddle/Stripe.
- Prices are stored in **minor units** (`amount_minor` integer) with ISO currency; BDT and USD price books.
- Refund policy: 7 days if < 20% consumed, no refunds on consumed AI credits.

## D6. Test engine invariants

- Server holds the **deadline** (`ends_at`) per section; the client timer is display-only. Answers autosave every 10 s and on every change (debounced 1 s); submission after deadline + 30 s grace is rejected.
- Attempts are resumable on any device.
- Offline replay: **exam mode** accepts queued responses only if received ≤ 30 s after the section deadline (the grace window) — no extended offline window, for integrity. **Practice mode** accepts offline replay at any time.
- Question content is versioned; an attempt pins `question_version_id`s so editing a question never changes past results.
- GRE uses **section-level adaptivity** (second Verbal/Quant section difficulty chosen from first-section performance). IELTS is linear.
- All band/score predictions are labelled **"estimated"**; official names used with trademark disclaimers; all question content is original or licensed — never scraped.

## D7. Security baseline (non-negotiable)

OWASP ASVS 5.0 **Level 2** target; OWASP Top 10 + API Top 10 covered in `09-SECURITY-AUTH-COMPLIANCE.md`. Highlights:
- Sessions: DB-backed, `__Secure-`/`__Host-` cookies, `HttpOnly`, `Secure`, `SameSite=Lax`, rotation on privilege change, 30-day idle / 90-day absolute for students, 12-hour for staff.
- Authorization in the data/service layer (CVE-2025-29927-class middleware bypasses must not matter).
- Strict CSP with nonces, HSTS preload, no inline secrets in client bundles (`server-only` imports), env validated with zod.
- Rate limits on auth, OTP, AI evaluation, checkout (per IP + per user).
- Payment pages are provider-hosted (PCI scope SAQ-A); webhooks verified by signature/validation API + idempotency keys.
- Audit log (append-only) for every staff action, role change, refund, impersonation, data export.
- PII minimisation; phone/email encrypted-at-rest columns where practical; daily backups + PITR; restore drill monthly.
- Minors: users self-declare age band; under-18 gets guardian-consent flow and no marketing.

## D8. Design language

**"Apple calm, Khan Academy generous."** System font stack (`-apple-system, BlinkMacSystemFont, "SF Pro Text"` → `Inter`), 8-pt grid, large confident display type, lots of whitespace, one accent colour, frosted translucent nav, soft depth instead of borders, 150–300 ms ease-out motion, light + dark mode, WCAG 2.2 AA. Details in `08-UI-UX-DESIGN-SYSTEM.md`. **No gradients-on-everything, no emoji icons, no stock "AI glow" — that is what looks vibe-coded.**

## D9. AI build orchestration (Google AI Pro subscription realigned)

- **3.8 Flash (low | med | high) = Daily Lead & Primary Builder (90%+ of work)**:
  - `3.8 Flash (high)`: Daily Lead Orchestrator (plans sub-steps, writes task cards, reviews diffs, builds complex frontend/backend features, Drizzle schemas, Exam Shell UI, and Magoosh practice flows).
  - `3.8 Flash (med)`: Standard feature implementation (`frontend-engineer`, `backend-engineer`, `db-engineer`, `qa-engineer`, `ui-polisher`).
  - `3.8 Flash (low)`: Fast exploration, Tier B/C doc indexing, pre-commit self-checks.
- **Argon (low | med | high) = Mechanical & Volume Workhorse**:
  - `Argon (high)`: Standard CRUD routes, UI component scaffolding from tokens, Vitest unit test suites, seed scripts, Zod schema wiring.
  - `Argon (med)`: `i18n-copywriter` (Bangla/English strings), `seed-data-maker` (GRE vocab decks, sample questions), `docs-scribe` (session logs, PROGRESS updates, FILEMAP).
  - `Argon (low)`: `lint-fixer`, formatting, boilerplate files, git hook checks, directory scaffolding.
- **Sonnet 5.5 (low | med | high) = Specialist Escalation & Critical Paths**:
  - `Sonnet 5.5 (med)`: Used only when 3.8 Flash (high) fails twice on a complex algorithmic task, OR for intricate GRE section-adaptive scoring (`test-engine-engineer`), RBAC `assertCan` policies, and payment webhook signature verification (`payments-integrator`).
  - `Sonnet 5.5 (high)`: Replaces Opus 5.5 as default Two-Key Reviewer (`architect-reviewer`, `security-auditor`) for auth, payments, DB migrations, and scoring PRs.
- **Opus 5.5 (high only) = Break-Glass / Milestone Sign-Off Only (<2% of tasks)**:
  - Strictly locked. Only invoke Opus 5.5 with explicit Founder permission if Sonnet 5.5 (high) fails twice on a P0 security/data-integrity bug, or for the final 1-time gate sign-off at Milestone M0/M1/M2/M3 on a compact diff (<250 lines).
- **Strict Escalation Ladder**:
  - Argon (low/med) fails once -> retry on Argon (high) or 3.8 Flash (med).
  - 3.8 Flash (med) fails once -> escalate to 3.8 Flash (high).
  - 3.8 Flash (high) fails twice -> escalate to Sonnet 5.5 (med).
  - Sonnet 5.5 (med/high) fails twice -> log to `docs/logs/errors/ERROR-LOG.md` and ask Founder before touching Opus 5.5.
- **Quiet Output Rule**: All test/lint/build commands must pipe output to a log file and print only the exit code and first 25 error lines so context windows stay tiny.

## D10. Course tier framework (applies to every exam course: IELTS Academic, IELTS GT, GRE, later PTE, DET, TOEFL)

| Tier | Positioning | Always includes | Never includes |
|---|---|---|---|
| **Free** | Try it, trust it | Diagnostic test, sample lessons, 1 sectional mock, vocab decks, community, 1 AI writing eval / month | Full mocks, human feedback |
| **Core** | Self-paced, recorded | Full recorded course, full practice bank, 4 full mocks, small AI allowance, certificate, 6-month access | Live classes, human feedback |
| **Plus** | Self-paced + AI coach | Core + 10 full mocks, large AI allowance (fair-use capped), personalised study plan, weekly live group Q&A, 2 human essay reviews | Live batch |
| **Live** | Cohort with teacher | Plus + live batch (regular 12-week **or** crash 4-week), human writing & speaking mock feedback, small-group speaking club, mentor group chat, attendance & homework tracking | 1:1 |
| **Mentor** | Premium 1:1 | Live + 1:1 sessions with a named mentor, expanded human reviews, free re-enrol if target not met (strict terms), priority support | — |

- Mock counts are *entitlements to the library as it grows*: launch with ≥5 full mocks per exam, reach 10 by ~day 120 (each GRE full mock ≈ 114 original items). Never sell a count the library can't yet serve — the pricing page shows "5 now, 10 by <date>".
- **Naming:** course families are named by exam ("IELTS Academic", "IELTS General Training", "GRE"…); the buyable unit is *family × tier* (e.g., "IELTS Academic — Plus"). The earlier label "Complete" = **Core** and is retired from UI copy.
- **Add-ons** (any tier): mock packs, AI credits, human review packs, single examiner-style speaking mock, printed book bundles, standalone crash course.
- **Passes** (all-access, D5) sit beside tiers and follow the packaging rule in 02 §7.2 (3-month pass ≥ ~75% of a Core course).
- **Access programme (Bangladesh)**: verified-need scholarships (50–100% off Core/Plus), Bangla-medium *English Foundation* track (A0→B1) at micro prices, bKash instalments (2–3 parts) for Live/Mentor, partner codes for Union Digital Centres / NGOs / TTCs.
- **International**: identical tiers in USD with 3 purchasing-power regions (A: US/UK/EU/CA/AU/NZ/Gulf; B: upper-middle-income e.g. Malaysia, Türkiye, Latin America; C: South Asia, Africa, SE Asia). Every Bangla-first asset has an English international counterpart.
- Canonical prices for every product live in `17-PRICING-MASTER.md`; 02 §7 points to it.

## D11. Portfolio hedge (IELTS volume risk)

IDP reported Language Testing volume −8% in FY26 and plans for a 20–30% market fall in FY27 (research: marketing_international_gapfill.md). Therefore:
- Positioning is **test-agnostic** ("pass the English test your goal needs"), never IELTS-only branding.
- **P1** adds *English Foundation* (Bangla-medium A0→B1) and a free **"Which test do I need?"** quiz (IELTS Academic/GT/Life Skills, PTE, DET, TOEFL, EPS-TOPIK, JFT-Basic, none).
- **P2** brings PTE + DET, Spoken English, Admissions (Common App) tools.
- **P2/P3** adds *Work-Abroad Language* tracks (Korean EPS-TOPIK, Japanese JFT-Basic) for the low-income migration segment, which mostly does not need IELTS.
- The engine and content model stay exam-agnostic (07 type registry) so a new test is content + config, not new code.

## D12. Resolutions of audit contradictions (25-GAP-AUDIT §3) — binding

| # | Topic | Resolution |
|---|---|---|
| C1/C22 | AI allowance & credit unit | **One `ai_credit` pool.** Writing task evaluation = 1 credit; one Speaking part = 1 credit; full Speaking test = 2 credits; GRE AWA = 1 credit. **Free tier: 2 credits at sign-up + 1 credit per calendar month** (no rollover). Paid allowances per tier in 17. |
| C3 | Onboarding route | `/onboarding` in `(auth)` (D2). Not `/app/onboarding`. |
| C4 | Certificates | **P1**: PDF certificate + public verification page. Open Badges 3.0 / LinkedIn deep-link polish in P3. |
| C5 | Study plan | **P1**: generated, read-only plan from onboarding (exam date, target, level). **P2**: adaptive rescheduling, calendar sync. |
| C6 | Speaking audio retention | **90 days** default; longer only with explicit consent (calibration set) or an open dispute. |
| C7 | Account deletion grace | **14 days**, cancellable by signing in; then hard delete/anonymise per 05 PII procedure. |
| C8 | OTP / verification TTL | Email/phone OTP: 6 digits, **5 min** TTL, 5 attempts. Email verification link: **60 min**. Templates use these values. |
| C9 | AI cost per evaluation | Single source of truth in code: `packages/ai/src/pricing.ts` (updated monthly from provider pages). Planning values for docs: **writing ≈ $0.06, full speaking test ≈ $0.20**. |
| C10 | Ops flags | `feature_flag` table (05). No `system_setting` table. |
| C11 | Certificate URL | `/verify/[code]` — unguessable ≥128-bit code, never the UUID. (D2 updated.) |
| C13/GA-014 | Guarantee | **Mentor only, from P1**: "Progress Promise" = free re-enrolment (no cash) if target not met, conditions: ≥80% attendance, all homework, ≥4 full mocks, official test within 60 days of course end, official TRF uploaded. Modelled as `guarantee_claim` (05). No guarantee on Free/Core/Plus/Live. |
| C13b | Money-back & score guarantees (founder request: match Magoosh) | **All self-paced digital products (Core, Plus, passes, standalone courses): 7-day no-questions-asked money-back** if < 20% of content consumed and ≤ 1 full mock taken (abuse cap; no reason required). **Plus: "Target Promise"** = free 3-month extension (no cash) if target not met, conditions: ≥ 4 full mocks + study-plan completion ≥ 70% + official test within 60 days of access end + TRF upload. **Mentor: "Progress Promise"** (free re-enrolment, conditions above). Never cash-back on score. Free trial = Free tier + 7-day Plus trial (no card; AI credits capped). |
| C25 | Regional price floor | International region C price must be **≥ the BD price converted to USD** (so non-BD buyers never pay less than Bangladeshi buyers); B ≈ 1.5× C; A ≈ 2.5× C (rounded to .99/.00). BD users always see BDT via SSLCommerz. |
| C26 | Spaced repetition | **FSRS** (open-source Free Spaced Repetition Scheduler) for all flashcards; SM-2 as fallback. Not Leitner. |
| C27 | AI chat & coaching metering | AI Tutor chat, paraphrase trainer, speaking partner and similar coaching use **daily fair-use meters** per tier (34/17), not credits. Credits (integer only) are for scored evaluations. A sentence/paragraph rewrite example is part of an evaluation, never a separate fractional charge. |
| C28 | Refund consumption measure | "< 20% consumed" = max(% lessons completed, % of included AI credits used, % of included mocks taken) < 20%, and ≤ 1 full mock taken. |
| C29 | Helpdesk | **Chatwoot Cloud** in P1 (email + WhatsApp/Messenger inbox) with our own SLA timers/tags synced via webhook; native in-app ticketing re-evaluated in P2 (27). |
| C30 | Attempt voiding | `voidSection`/`voidAttempt`: **self-serve once per attempt** under the GA-007 rule (connection loss > 2 min, exam mode), otherwise `support`/`admin` only, always audited (06/07). |
| C31 | Trademark notices (canonical text) | GRE/TOEFL: "GRE® and TOEFL® are registered trademarks of ETS. This product is not endorsed or approved by ETS." IELTS (verify with counsel): "IELTS is a registered trademark of the University of Cambridge, the British Council and IDP Education Australia. This site and its products are not approved or endorsed by them." PTE/DET/Common App: "[Mark] is a trademark of its owner; we are not affiliated with or endorsed by it." Used verbatim in 03, 07, 08, 26. |
| C32 | Royalty & batch price in plan | 02 uses **10% lead-instructor royalty on own course only** (not 12% on everything) and live batch **BDT 9,990**; calibration budget **BDT ~1.93M** phased (31). |
| C33 | Payout approval | Maker-checker: `finance` prepares payout statements, `admin` approves (2FA + audit); never the same person. |
| C34 | Moderation ownership | `support` owns the community/review/Q&A moderation queue; `content_editor` owns reports about lesson/question errors; safeguarding incidents escalate to `admin`. Assessment-lead duties map to `content_editor` (+ `admin` for publishing calibration results). |
| C35 | Record retention | Financial/tax records **10 years** (pending accountant confirmation); audit log 7 years; everything else per 05/09 schedule. |
| C36 | Remaining metering & trial | AI speaking partner and "My notebook" audio use **daily fair-use meters** (minutes/day per tier, 34/17), not credits (extends C27). 7-day Plus trial: **5 credits cap**, no card. bKash **instalments ship in P2** (P1: full payment; scholarships/partner codes manual via admin). |
| C14 | "Was" price | `compare_at_minor` allowed **only** if that price was actually charged for ≥ 28 consecutive days in the last 90; enforced in service; otherwise null. |
| C16 | Regional pricing | `price` rows carry `region` ∈ {`BD`,`A`,`B`,`C`}; region resolved from billing country (MoR) with IP as hint only. |
| C17 | AI request limits | Canonical table in 09: per user 10 evaluation requests/hour, 2 concurrent; daily ceiling Free 1, paid tiers per 17. |
| C18 | Accommodations | **P1**: support-granted extra time (1.25× / 1.5× / 2.0×) on documented request, stored as `accommodation_multiplier`. **P2**: self-serve request form. |
| C19/GA-008 | Creator pay | P1 content = **work-for-hire** contractors paid per asset + optional lead-instructor royalty (default 10% of net on their course). Payouts **manual monthly** (finance role, bank/bKash, withholding tax per accountant) in P1–P2; automated marketplace payouts P3. |
| C20/C21 | Plus live Q&A, Free community | Plus "weekly live group Q&A" runs on Zoom from P1 (same ops as Live pilot). Free-tier "community" in P1 = official moderated Facebook group/Discord; in-app community P2. |
| C24 | Cart | P1 = single-item **Buy now**; multi-item `/cart` in P2. |
| GA-005 | Local dev DB | Default: **Neon dev branch** per developer (no Docker; light on a fanless laptop). Optional local Postgres via OrbStack/Docker with `DB_DRIVER=pg`; `DB_DRIVER=neon` default. `.env.example` is readable by agents; real `.env*` are not. |
| GA-007 | Exam disruption | Server-side: attempt can be **paused by the system** on heartbeat loss in practice mode; in exam mode, a section interrupted by connection loss > 2 min may be **voided and re-issued once per attempt** via a self-serve "I lost connection" flow (logged, rate-limited), else support grants a credit. |

---

## Change Log
- 2026-11-07 — Initial decisions locked.
- 2026-11-07 — D4: mandatory 2FA extended to `instructor` (payouts) and `org_admin` (manages many users), per security review.
- 2026-11-07 — D3: Speaking STT default switched to Deepgram Nova-3 (word timestamps); gpt-4o-mini-transcribe demoted.
- 2026-11-07 — D3 additions (optional, swappable): Better Stack (uptime/status page) and Axiom (log drain) per 11-DEVOPS; exam autosave uses route handlers, not server actions.
- 2026-11-07 — Founder confirmed "collegeapp" = **Common App**. Admissions/application-support services added as a product line (see 21-ADMISSIONS-COMMON-APP.md).
- 2026-11-07 — D4/D2: new `counsellor` role (2FA required) and `(counsellor)` route group for admissions services (from 21).
- 2026-11-07 — D11 added: portfolio hedge (test-agnostic positioning, Work-Abroad language tracks) after IDP volume outlook.
- 2026-11-07 — D5: product kinds extended (`human_review_credits`, `service`, `physical_book`). 17-PRICING-MASTER is canonical: Mentor includes 3 × 1:1 sessions (add-on packs for more); standalone 12-week live batch BDT 9,990 (36 sessions).
- 2026-11-07 — D10 naming: family × tier; "Complete" = Core. D1: P2 adds Spoken English + Admissions tools; P3 adds Work-Abroad tracks, optional OET/SAT. Marketing: referral + partner customers count as organic (non-paid) for the ≥60% organic target.
- 2026-11-07 — D12 C13b/C25: Magoosh-style 7-day money-back for self-paced products, Plus "Target Promise" (extension), regional price floor; D2 adds /help /status /changelog /accessibility (from 23). AI learning features (Magoosh + NotebookLM-style) specified in 34-AI-LEARNING-FEATURES.md.
- 2026-11-07 — D12 added: binding resolutions of 24 audit contradictions (C1–C24, GA-005/007/008/014).
- 2026-11-07 — D1: Live tier ships in P1 as manually-run Zoom pilot cohorts; in-app scheduling/attendance in P2 (resolves 18 OQ-8).
- 2026-11-07 — D3: rate-limit store = Upstash Redis with Postgres fallback (aligns 09 and 10).
- 2026-11-07 — D6: offline replay rule (exam mode grace-only; practice mode unrestricted) — resolves 07 OQ-1. 05 gains `attempt_session`, `attempt_annotation`, `item_exposure`, IRT columns on `question_stat` (from 07).
- 2026-11-07 — D2: canonical route groups locked (table above, from 03-PRODUCT-SPEC). Supersedes `(learn)`, `(test)`, `(dashboard)` names used in early drafts. Locale prefix `as-needed` (supersedes "always prefixed").
- 2026-11-11 — Strategic Pivot (Founder Directive): GRE-First Magoosh-parity core prioritized for M0/M1 ahead of IELTS audio pipelines. Model routing realigned to 3.8 Flash & Argon primary, Sonnet 5.5 critical review, Opus 5.5 break-glass only. Hardware guardrails pinned to Intel i5-1135G7 8GB RAM dual-boot (Windows 11 / Fedora 44).
