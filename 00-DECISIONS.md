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
| **P1 – MVP (launch)** | IELTS (Academic + GT) & GRE courses, lesson player, question bank, **full CBT mock-test engine**, AI Writing/Speaking/AWA evaluation, SSLCommerz checkout, learner dashboard, instructor/editor CMS, admin console | Live classes in-house, mobile apps |
| **P2 – Growth** | Live batches (scheduled classes via embedded YouTube Live/Zoom), study plans, streaks/XP, community Q&A, coupons/affiliates, institution (B2B) accounts, parent view, PTE + Duolingo English Test | Native apps |
| **P3 – Expansion** | Instructor marketplace (revenue share), tech tracks (Python, ML, AI, Databases, Networking), university course packs (BD CSE syllabus), in-browser code notebooks, Expo mobile app, LiveKit in-house live | — |

## D2. Architecture style

- **Modular monolith** in a **pnpm + Turborepo monorepo**. No microservices. Every domain is a folder in `packages/core/src/<domain>` with a public `index.ts`; domains talk only through those exports.
- One deployable web app (`apps/web`, Next.js) + one background-jobs runtime (Inngest functions served from `apps/web/app/api/inngest`).
- Server is authoritative for: auth, permissions, prices, entitlements, test timers, scoring.

**Canonical route groups (`apps/web/app/[locale]/…`)** — every doc and agent uses exactly these:

| Route group | URL prefix | Shell | Who |
|---|---|---|---|
| `(marketing)` | `/`, `/ielts`, `/gre`, `/courses`, `/pricing`, `/blog`, `/tools/*`, `/verify/[certId]`, legal | Marketing | Public |
| `(auth)` | `/sign-in`, `/sign-up`, `/onboarding` | Marketing (minimal) | Public / partial |
| `(checkout)` | `/cart`, `/checkout`, `/checkout/return`, `/orders` | Marketing (minimal) | Signed-in |
| `(learner)` | `/app` (role-aware dashboard), `/app/learn/[course]/[lesson]`, `/app/practice`, `/app/tests`, `/app/vocab`, `/app/plan`, `/app/progress`, `/app/settings` | App | `student`, `guardian` (read-only views) |
| `(exam)` | `/exam/[attemptId]` | Full-screen exam shell | Signed-in + entitlement (diagnostic: guest) |
| `(studio)` | `/studio/**` | App | `instructor` (own), `content_editor`+ (all) |
| `(grader)` | `/grader/**` | App | `grader` |
| `(staff)` | `/editor/**`, `/support/**`, `/finance/**` | App | `content_editor`, `support`, `finance` |
| `(org)` | `/org/[orgSlug]/**` | App | `org_admin` of that org |
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
| `org_admin` | Institution (coaching centre, university) admin | Manage seats/members/cohorts within own org, assign courses & tests, org analytics |
| `admin` | Platform operations | Everything above except role grants to `admin`/`super_admin`, secrets, and destructive bulk ops |
| `super_admin` | Founder(s) only (≤ 2 people) | All, incl. role management. **Mandatory passkey or TOTP 2FA.** |

Rules: every staff role (`grader`+) **and** `instructor` and `org_admin` require 2FA (passkey or TOTP). Authorization is checked in **`packages/core` service functions** (`assertCan(actor, 'course:update', course)`), never only in UI or route middleware. Ownership/tenant checks (instructor owns course; org_admin's `orgId` matches) are part of the policy.

## D5. Commerce model

- **Products**: `course`, `bundle`, `test_pack` (N mock tests), `ai_credits` (N evaluations), `pass` (time-boxed all-access: 1/3/6/12 months), `live_batch` (P2), `org_seat_pack` (B2B).
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

## D9. AI build orchestration

- **Opus = lead** (planning, architecture, cross-domain review, final security review, merging).
- **Sonnet = implementer** (feature code, schema, tests, integrations).
- **Haiku = utility** (copy, i18n strings, seed data, docs, simple refactors, lint fixes, changelog).
- **Gemini** = continuation agent when Claude limits are hit; reads `AGENTS.md` + `docs/PROGRESS.md` and continues from the next unchecked task.
- Every task has ID, owner model, inputs, acceptance criteria and a verification command. Nothing is "done" until `pnpm verify` passes. Details in `12-BUILD-PLAN-AGENTS.md`.

---

## Change Log
- 2026-11-07 — Initial decisions locked.
- 2026-11-07 — D4: mandatory 2FA extended to `instructor` (payouts) and `org_admin` (manages many users), per security review.
- 2026-11-07 — D3: Speaking STT default switched to Deepgram Nova-3 (word timestamps); gpt-4o-mini-transcribe demoted.
- 2026-11-07 — D3 additions (optional, swappable): Better Stack (uptime/status page) and Axiom (log drain) per 11-DEVOPS; exam autosave uses route handlers, not server actions.
- 2026-11-07 — D3: rate-limit store = Upstash Redis with Postgres fallback (aligns 09 and 10).
- 2026-11-07 — D6: offline replay rule (exam mode grace-only; practice mode unrestricted) — resolves 07 OQ-1. 05 gains `attempt_session`, `attempt_annotation`, `item_exposure`, IRT columns on `question_stat` (from 07).
- 2026-11-07 — D2: canonical route groups locked (table above, from 03-PRODUCT-SPEC). Supersedes `(learn)`, `(test)`, `(dashboard)` names used in early drafts. Locale prefix `as-needed` (supersedes "always prefixed").
