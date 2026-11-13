# @purpose Opus 5.5 (Low) single-turn audit of M0 digest + remediation checklist + M1 backend specs (P1-32/33/34/147)

Source: `docs/logs/reviews/audit-digest.md` (2026-11-13) + `docs/00-DECISIONS.md`. No source files read.
**Caveat:** Math/logic items (Rasch EAP, adaptivity, FSRS, compare_at) were *not* code-inspected; they are listed as **verify-with-tests** items derived from D5/D6/D12 invariants. Implementers must confirm each against code before changing.

---

## 1. Ranked findings

### P0 — ship-blockers (security / money / integrity)
| # | File | Flaw | Rule broken |
|---|---|---|---|
| P0-1 | `apps/web/app/api/webhooks/sslcommerz/route.ts` | No validation evidence; `packages/core/src/payments/sslcommerz.ts` **MISSING** → IPN likely trusted as-is | D3/D7: IPN + Order Validation API + idempotency |
| P0-2 | `apps/web/app/actions/checkout.ts` | No session, no assertCan, no zod → anonymous order creation / client price trust risk | D2, D5, AGENTS §6 |
| P0-3 | `apps/web/app/actions/exam.ts` | No session/assertCan/zod → anyone can submit/score any attempt | D6, D4 |
| P0-4 | `apps/web/app/actions/mistakes.ts` | **Caller-passed** actor/userId → IDOR (read/write any user's notebook) | D7 |
| P0-5 | `packages/core/src/commerce/entitlements.ts` | In-memory `Map` → purchases/entitlements lost on restart/serverless cold start | D5 "entitlements are the only access check" |
| P0-6 | `packages/core/src/commerce/checkout.ts` | In-memory `Map` orders → paid orders lost, IPN can't match | D5 |
| P0-7 | `apps/web/app/api/inngest/route.ts` | Marked public; must rely on Inngest signing key (`serve()` with `signingKey`) | D7 webhooks verified |

### P1 — must fix in M1
| # | File | Flaw |
|---|---|---|
| P1-1 | `actions/practice.ts` | No session/zod; practice results unattributed or spoofable |
| P1-2 | `actions/grader.ts` | Session but **no assertCan** (`grading:review`, assignment ownership) + no 2FA check (D4) |
| P1-3 | `actions/studio.ts` | Session but no assertCan / ownership (instructor own vs editor all) + 2FA |
| P1-4 | `actions/study-plan.ts`, `actions/tutor.ts` | Session but no assertCan/zod; tutor has no daily fair-use meter (C27) |
| P1-5 | `actions/analytics.ts` | Has assertCan, missing zod |
| P1-6 | `core/src/grader/queue.ts`, `studio/authoring.ts` (4 Maps), `analytics/progress.ts`, `exam/statistics.ts` | In-memory state; grader overrides, drafts, progress, IRT item stats lost on restart |
| P1-7 | `core/src/analytics/mistakes.ts` **MISSING** | Mistake Notebook logic lives in action layer (violates D2 domain rule); IRT exclusion unverifiable |
| P1-8 | 16 hard-coded "Lumen Academy" (auth issuer, certificate verify msg, layouts, metadata titles, +6) | Brand rule D0/AGENTS §10 |
| P1-9 | `core/src/commerce/pricing.ts` | Verify `compare_at_minor` enforced (≥28 consecutive charged days in last 90, else null) from **persisted price history**, not in-memory |
| P1-10 | `core/src/exam/scoring.ts` / `adaptive.ts` / `fsrs/scheduler.ts` | Verify-with-tests (see §1.1) |

### 1.1 Math / state verification list (write failing tests first; fix only if they fail)
- **Rasch EAP (`scoring.ts`)**: prior N(0,1); quadrature ≥ 41 pts over [-4,4]; P = 1/(1+e^-(θ-b)); posterior uses log-likelihood sums (no underflow); all-correct / all-wrong returns finite θ; SE = sqrt(posterior var); scaled 130–170 clamped and integer; output labelled "estimated".
- **Adaptivity (`adaptive.ts`)**: Section-2 routing computed **server-side** from persisted Section-1 responses only; thresholds deterministic; Verbal 12Q/18m→15Q/23m, Quant 12Q/21m→15Q/26m; route stored on attempt (re-request can't re-roll); unanswered = wrong.
- **FSRS (`scheduler.ts`)**: stability > 0, difficulty clamped [1,10], retrievability in (0,1]; interval ≥ 1 day; `Again` resets to Learning; time from server clock, not client.
- **Mistake Notebook IRT exclusion**: retries from notebook/practice/hinted (D13) responses must **not** feed `question_stat` IRT calibration or exam θ; only first-exposure exam-mode responses count.
- **Deadlines (D6)**: submit rejected after `ends_at + 30s`; client time ignored.

---

## 2. File-by-file remediation checklist (mechanical)

### Auth / actions (depends on P1-32 `requireServerActor`)
- `apps/web/app/actions/mistakes.ts` → caller-passed userId → remove `userId`/`actor` params; `const actor = await requireServerActor()`; zod input; call `core/analytics/mistakes` service with `assertCan(actor,'mistake:read|write',{ownerId})`.
- `apps/web/app/actions/checkout.ts` → public, no price check → `requireServerActor()`; zod `{productId, region?}` only (never amount); price resolved by `core/commerce/pricing`; `assertCan(actor,'order:create')`; persist via repo (P1-33).
- `apps/web/app/actions/exam.ts` → public → **move autosave/submit to route handlers `/api/exam/*`** (D3 changelog); `requireServerActor()` (guest allowed only for diagnostic attempt with signed guest token); `assertCan(actor,'attempt:write',attempt)` ownership; zod; server deadline check.
- `apps/web/app/actions/practice.ts` → same pattern; `assertCan(actor,'practice:write')`.
- `apps/web/app/actions/grader.ts` → add `assertCan(actor,'grading:override',submission)` (assigned grader) + 2FA-enforced in resolver; zod; audit log on override.
- `apps/web/app/actions/studio.ts` → `assertCan(actor,'course:update',course)` (instructor owns / content_editor any); zod.
- `apps/web/app/actions/study-plan.ts`, `tutor.ts` → assertCan + zod; tutor: `consumeDailyMeter(actor,'tutor_chat')` (P1-34) before LLM call.
- `apps/web/app/actions/analytics.ts` → add zod schemas.
- `apps/web/app/api/webhooks/sslcommerz/route.ts` → create `packages/core/src/payments/sslcommerz.ts`: parse form body with zod → verify `verify_sign`/`verify_key` hash (md5 of sorted keys + md5(store_passwd)) → call Order Validation API (`val_id`) server-side → assert `amount`+`currency` equal stored order `amount_minor` → idempotency on `tran_id` (unique `payment_event`) → mark paid + grant entitlement in one transaction → audit. Return 200 only after persisted. Flag `needs-two-key-review`.
- `apps/web/app/api/inngest/route.ts` → ensure `serve({ client, functions, signingKey: env.INNGEST_SIGNING_KEY })` via `packages/config/env.ts` (verify key exists in `.env.example` first; do not invent).
- `apps/web/app/api/health/route.ts` → OK public; ensure it leaks no env/version secrets.

### Persistence (depends on P1-33)
- `core/src/commerce/entitlements.ts` → Map → `EntitlementRepo` (`entitlement` table).
- `core/src/commerce/checkout.ts` → Map → `OrderRepo` + `PaymentRepo`.
- `core/src/grader/queue.ts` → Map → `GradingRepo`.
- `core/src/studio/authoring.ts` (4 Maps) → `CourseRepo`, `QuestionRepo` (versioned, D6 pinning).
- `core/src/analytics/progress.ts` → `ProgressRepo`.
- `core/src/exam/statistics.ts` → `QuestionStatRepo` (IRT columns, 05).
- Each: inject repo via factory param `(deps: {repo})`; keep public `index.ts` signatures; unit tests use memory repo.

### Brand (Hydrogen/Flash task)
- All 16 hits → import `brand` from `@lumen/config/brand` (`brand.name`); metadata titles → `` `${t('title')} | ${brand.name}` `` with next-intl keys en+bn. Includes `packages/auth/src/server.ts:45` issuer (security path → two-key), `core/certificates/verify.ts:120` (message → i18n key returned, not literal).

### Domain gaps
- Create `packages/core/src/analytics/mistakes.ts` (+ `index.ts` export, tests): add/list/tag (D13 chips), review queue 1/3/7/21d, `excludeFromCalibration: true` on every notebook response.
- `core/src/commerce/pricing.ts` → `compareAtFor(priceId, now)` reads `price_history`; returns null unless ≥28 consecutive charged days within 90; test boundary 27/28 days.

---

## 3. M1 backend architecture specs

### P1-32 — `requireServerActor()` + auth pages
- **File:** `packages/auth/src/actor.ts` (`import 'server-only'`), re-exported from `@lumen/auth/server`.
- ```ts
  type Actor = { userId: string; roles: Role[]; orgIds: string[]; twoFactorVerified: boolean; sessionId: string; locale: 'en'|'bn' };
  getServerActor(): Promise<Actor | null>   // auth.api.getSession({ headers: await headers() })
  requireServerActor(opts?: { roles?: Role[]; allowGuest?: false }): Promise<Actor> // throws AuthError('UNAUTHENTICATED'|'FORBIDDEN'|'2FA_REQUIRED')
  ```
- Roles loaded from DB (not cookie claims); cache per request via React `cache()`.
- 2FA: if actor has any of `grader+, instructor, org_admin, counsellor` and `!twoFactorVerified` → `2FA_REQUIRED` (D4). Also enforced inside `assertCan` (defence in depth).
- Session TTLs per D7 (student 30d idle/90d abs; staff 12h); rotate on role change.
- Error mapping helper `toActionError()` → `{ ok:false, code }` for actions; 401/403 for route handlers.
- **Pages** `apps/web/app/[locale]/(auth)/sign-in|sign-up|onboarding/page.tsx`: packages/ui forms, react-hook-form + shared zod; Google, email OTP (6 digits/5 min/5 attempts, C8), phone OTP; Turnstile on sign-up/OTP; onboarding collects exam, date, target, level, age band (minor → guardian flow) → generates read-only study plan (C5) and grants 2 free credits (C1). en/bn strings, loading/error/empty states, axe clean.
- **Tests:** resolver returns null w/o cookie; forged userId param ignored; 2FA deny for grader; allow/deny per role; e2e sign-up→onboarding→/app.
- **Security path** → needs-two-key-review.

### P1-33 — Dual-mode repository adapter
- **Dir:** `packages/db/src/repositories/{types.ts, memory/*.ts, drizzle/*.ts, index.ts}`.
- Interfaces per aggregate (`OrderRepo`, `PaymentRepo`, `EntitlementRepo`, `LedgerRepo`, `GradingRepo`, `CourseRepo`, `QuestionRepo`, `ProgressRepo`, `QuestionStatRepo`, `MistakeRepo`, `PriceRepo`) + `UnitOfWork { transaction<T>(fn:(repos)=>Promise<T>) }`.
- `createRepositories()`: `env.DATABASE_URL` set → Drizzle (neon driver; `DB_DRIVER=pg` optional per GA-005); else **only if `NODE_ENV==='test'`** → memory. In production with no URL → throw at boot (never silently use memory).
- Memory impl implements same transaction semantics (snapshot/rollback) and unique constraints (e.g., `tran_id`, ledger idempotency key) so tests catch races.
- Shared contract test suite `repositories/__contract__/*.test.ts` run against memory (CI) and Drizzle (Neon branch, CI only).
- Money columns `amount_minor integer` + `currency char(3)`. No new migrations unless card lists them (protected).

### P1-34 — Server-authoritative entitlement ledger
- **File:** `packages/core/src/entitlements/ledger.ts` (security path).
- Append-only `entitlement_ledger(id, user_id, kind ∈ {ai_credit, mock_attempt}, delta int, reason, source_ref, idempotency_key UNIQUE, created_at)`; balance = SUM(delta) (optionally cached row with `SELECT … FOR UPDATE`).
- ```ts
  consumeAiCredit(actor, { evaluationType: 'writing_task'|'speaking_part'|'speaking_full'|'gre_awa', ref, idempotencyKey }): Promise<{ remaining:number }>
  // cost: 1/1/2/1 (C1); integers only
  consumeMockAttempt(actor, { examFamily, attemptId, idempotencyKey })
  consumeDailyMeter(actor, meter: 'tutor_chat'|'speaking_partner_min'|'notebook_audio_min', amount)
  refundCredit(...)  // only on system failure of evaluation
  ```
- Inside one transaction: assertCan → check active entitlement (`starts_at<=now<ends_at`, server clock) → balance ≥ cost → insert negative delta → return. Throws `INSUFFICIENT_CREDITS`, `DAILY_CAP_REACHED`, `RATE_LIMITED` (10/h, 2 concurrent; C17 via Upstash, PG fallback).
- Grants: signup +2, monthly +1 Free (no rollover — expire via Inngest monthly job), tier allowances read from pricing seed (doc 17), Plus trial cap 5 (C36). Daily caps from tier config, Free daily eval ceiling 1.
- Tests: double-spend with same idempotency key → one debit; concurrent consumes never negative; expired entitlement denied; cost table; deny other user's actor.

### P1-147 — Finance refund & VAT engine
- **File:** `packages/core/src/finance/refunds.ts` (+ `vat.ts`), security path.
- `evaluateRefundEligibility(orderId, now)` (pure + repo reads):
  - `withinWindow = now - paid_at <= 7d` (server time).
  - `consumedPct = max(lessonsCompleted/total, aiCreditsUsed/included, mocksTaken/included)` (C28); eligible iff `< 0.20` **and** `fullMocksTaken <= 1` **and** product is self-paced digital (C13b). Live/Mentor/service → manual policy path.
  - Returns `{ eligible, reasons[], refundableMinor }`; `refundableMinor = amount_minor − valueOf(consumed AI credits)` (D5: consumed credits non-refundable; standalone `ai_credits` products refund only unused integer credits pro-rata).
- `executeRefund(actor, orderId, reason)`: `assertCan(actor,'refund:create')` (finance, 2FA) → re-evaluate → provider refund (SSLCommerz refund API / Paddle) with idempotency → in one tx: order→`refunded`, entitlements `ends_at=now` with `source='refund'`, ledger zero-out remaining credits, **revoke certificates** (`certificate.revoked_at`, `/verify/[code]` shows revoked), audit log entry. Guarantee claims (C13) unaffected/blocked post-refund.
- **VAT:** `computeVat({amount_minor, currency, region, vatRateBps})` integer math, banker's-free floor rounding, rates from config (accountant-confirmed, doc 30) — never hard-coded; refunds create negative VAT lines; `exportVatReport(period)` CSV for finance. Records retained 10y (C35).
- Tests: day 7 vs day 8 boundary; 19.9% vs 20%; 2 mocks → ineligible; consumed credits deducted; certificate revoked; non-finance actor denied; double refund idempotent.

---

## 4. Execution order & routing
1. P1-32 (Argon Low) → 2. P1-33 (Argon) → 3. §2 persistence swaps (Flash High) → 4. §2 action rewires + SSLCommerz (Argon; Sonnet 5.5 two-key) → 5. P1-34 → 6. P1-147 → 7. Brand sweep + i18n (Hydrogen/Flash) → 8. §1.1 math tests (Flash High).
All security-path files → HANDOFF "Needs two-key review" (Sonnet 5.5 / Opus Low-Med).
