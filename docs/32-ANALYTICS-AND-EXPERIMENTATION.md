# 32 — Analytics and Experimentation

> Status: draft v1, 2026-11-07. Owner: product-analytics lead (with `eng-platform` for instrumentation). Resolves **GA-015**, **GA-042**, **GA-043** from `25-GAP-AUDIT.md` and expands `11-DEVOPS-OBSERVABILITY.md` §5.4 (taxonomy) and `P1-44`.
> Precedence: `00-DECISIONS.md` wins; `11` §5.4 is the **base taxonomy** and this document extends it without renaming any event it already defines.
> Tags: **[U]** unverified, **[V]** verify against current vendor docs, **[A]** assumption, **[LEGAL]** counsel needed.

## 0. Scope and conformance

### 0.1 What this document defines

1. The measurement plan: north-star metric, KPI tree, KPI dictionary (definition, formula, source, owner, cadence) mapped to `02` §14 targets.
2. Event taxonomy v1: names, required properties, PII rules, identity, client vs server emission, consent behaviour.
3. Dashboards and the weekly business review.
4. Experimentation framework on PostHog feature flags/experiments, including what may and may not be tested, and the pricing-test protocol that preserves "price shown = price charged".
5. AI-scoring quality analytics.
6. Data warehouse path, retention and deletion.
7. Backlog (`NEW-ANL-xx`).

### 0.2 Conformance table

| Source | Rule used here |
|---|---|
| `00` D3 | PostHog (EU or US cloud), **cookie-consent gated**; Sentry for errors (not product analytics); Neon Postgres is the system of record. |
| `00` D5, D12 C14, C16 | Prices in minor units; one price book per region per time; `compare_at_minor` only if actually charged for >= 28 of the last 90 days; region from billing country. |
| `00` D6 | Server owns exam state; scores are "estimated". |
| `00` D7 | Under-18: no marketing; PII minimised. |
| `00` D10 | Free = 2 credits + 1/month; tier names Free/Core/Plus/Live/Mentor. |
| `00` D12 C1/C22 | One `ai_credit` pool: writing 1, speaking part 1, full speaking test 2, AWA 1. |
| `11` §5.4 | Event name `snake_case`, `<object>_<past_tense_verb>`, singular object, <= 3 words; properties `snake_case`; money minor units; durations ms; no free text/email/phone/essay/audio; `track<E>()` typed from `packages/core/src/analytics/events.ts`; server-emit money and exam state; replay only on `(marketing)`. |
| `02` §14 | North star: weekly active learners who complete >= 1 timed practice; KPI table and targets; hiring/spend gates. |
| `02` L7, `08` §pricing rules, `05` `price`/`compareAtMinor` | Price test must not show two prices to one user and must never fake a "was" price (§9). |
| `06` §7.1 | Domain events `domain.past_tense`; analytics consumers `analytics.track`, `analytics.identify`, `analytics.track-purchase`. |
| `29` | Message events `message_*` (§5.10) are server-side, template-level only. |
| `09` §13.4, §13.7, §13.9 | Consent, retention, DSAR; PostHog person deletion on erasure. |

### 0.3 Conflicts and decisions made here

| # | Conflict / gap | Decision | Doc to update |
|---|---|---|---|
| Y1 | The brief asks for `object_action` naming; `11` §5.4 says `<object>_<past_tense_verb>`. | They are the same rule (`order_paid`, `lesson_completed`). Past tense is mandatory (events record facts). Domain events (`order.paid`) map to analytics events by a fixed table (§5.12). | none |
| Y2 | `11` §5.4: `distinct_id` = user UUID after consent. The brief requires user-id hashing. | `distinct_id = analytics_id(user_id)`, a keyed hash (HMAC-SHA256 with `ANALYTICS_ID_KEY`, first 32 hex chars), **never the database UUID** (§6.3). Same id used in warehouse. Changes `11` §5.4 identity bullet. | `11` §5.4, `04` env table |
| Y3 | `11` §5.4 events `attempt_started.mode` uses `full | section | practice` while `05` `attempt_mode` is `exam | practice`. | Keep both: `mode` in `{exam, practice}` (DB truth) plus `scope` in `{full, section}`. `11`'s `mode` values become `scope` + `mode`. "Timed practice" (north star) = `mode = exam`. | `11` §5.4 |
| Y4 | `11` §5.4 sends "cookieless server-side critical business events (order paid)" pre-consent; GA-042 says the decision is missing. | Decided in §8.3: three consent tiers; Tier 0 is aggregate and non-identifying; money and exam KPIs are read from Postgres views, not from consent-dependent PostHog events. | `11` §5.4 |
| Y5 | `02` L7 plans "Price test A: IELTS Complete BDT 3,990 vs 3,490" without assignment design. | Replaced by the protocol in §9.4 (time-split with price lock + Van Westendorp), which also forbids strike-through during a test. | `02` L7 |
| Y6 | `11` retention "PostHog 12 months" vs experiment analysis needing longer horizons (90-day paid conversion). | Keep 12 months raw in PostHog; nightly **aggregate snapshots** and **cohort tables** in Postgres/warehouse keep derived metrics for the plan horizon (§12). | none |
| Y7 | `07` says `evaluation.quality-sample` sends 5% of AI results to human QA; no analytics definition. | Defined in §10.2 (agreement monitoring) with the SQL. | `07` §7.9 cross-reference |

## 1. Principles

1. **Postgres is the source of truth for money, access and exam outcomes.** PostHog is for behaviour and experiments. Any metric that drives a hiring or spend gate (`02` §14) has a SQL definition against Postgres views that does not depend on consent, ad blockers or event delivery.
2. **Measure decisions, not vanity.** Every event exists to support a named metric, funnel, or experiment (§5 table has a "used by" column). Unused events are removed in the quarterly taxonomy review.
3. **No PII in analytics.** No email, phone, name, essay, audio, free text, payment instrument data, IP address, or user-agent string stored in event properties (§5.2, §6.3).
4. **Privacy-first defaults.** Consent before client tracking; under-18 users get reduced tracking (§8.4); session replay only on public marketing pages.
5. **One definition per metric.** The KPI dictionary (§2.3) is the only place a metric is defined. Dashboards cite it by id (`K-xx`).
6. **Honest statistics.** Small-n reality (47,500 sign-ups in Year 1 base case, `02`): pre-register one primary metric, run to a planned sample, no peeking decisions, report intervals not just p-values (§9.5).
7. **Experiments never change what a user is owed.** Prices shown equal prices charged; refund terms, exam integrity, score outputs and legal text are not experimental surfaces (§9.3).

## 2. North star and KPI tree

### 2.1 North-star metric

**Weekly Active Timed Learners (WATL)** = distinct learners with at least one **timed practice** (`attempt_submitted` with `mode='exam'`, i.e. a section or full mock under server-held deadlines, D6) in the ISO week (Mon-Sun, `Asia/Dhaka`). This is the metric in `02` §14 ("weekly active learners who complete at least one timed practice") made precise.

Why it is a good north star: it measures the core value (practice under exam conditions), correlates with paying (`02` §14), is hard to inflate (needs an actual submitted exam-mode attempt), and every team can move it. **Companion metric:** *Weekly timed practices per active learner* (depth). **Guardrails:** exam reliability, AI quality, refund rate, complaint rate (§2.4).

Internal/test accounts, staff, and impersonation sessions are excluded (`is_internal = false`).

### 2.2 KPI tree

```
North star: Weekly Active Timed Learners (WATL)
│
├─ Reach          visitors → diagnostic starts → diagnostic completes → sign-ups
├─ Activation     sign-up → first timed attempt / diagnostic ≤ 7 days (target 35%)
│     └─ drivers: onboarding completion, exam date set, first lesson, first AI eval
├─ Engagement     timed practices / learner / week; lessons completed; AI evaluations; streak days (P2)
│     └─ drivers: plan adherence, reminders opt-in, live attendance
├─ Monetisation   sign-up → paid ≤ 90 days (target 4% base, gate 3%); ARPPU; mix by tier/region
│     └─ drivers: pricing views, checkout starts, payment success rate by method, abandoned-checkout recovery
├─ Retention      D7/D30 return; pass renewal rate; cohort revenue retention
├─ Outcomes/Trust AI-score agreement, NPS, completion, support first response, refund rate
└─ Efficiency     blended CAC, CAC payback, gross margin (AI + SMS + video COGS)
```

### 2.3 KPI dictionary

Columns: `K-id`; **definition** (what is counted); **formula**; **source** (events/tables); **PostHog insight / SQL view**; **owner** (accountable role); **cadence**; **target** (`02` §14 or `20` §6.1 or stated as [A]). Windows are in `Asia/Dhaka` calendar time unless stated. Cohorts are by sign-up week.

| K-id | KPI | Definition and formula | Source | Insight / view | Owner | Cadence | Target |
|---|---|---|---|---|---|---|---|
| K-01 | **WATL** (north star) | Distinct `user_id` with >= 1 `test_attempt` where `mode='exam'`, `submitted_at` in week, role includes `student`, not internal | `test_attempt` (DB truth); event `attempt_submitted` (cross-check) | view `analytics.v_watl_weekly`; PostHog trend "WATL" (unique users, `attempt_submitted` where `timed=true`) | product lead | weekly | track; growth target set at launch from first 4 weeks |
| K-02 | Activation rate | % of sign-ups (cohort week) with a first `attempt_submitted` (exam mode) **or** `diagnostic_completed` within 7 days of `signup_completed` | `user.created_at`, `test_attempt`, diagnostic attempts | view `analytics.v_activation_cohort`; PostHog funnel `signup_completed → (attempt_submitted OR diagnostic_completed)` 7-day window | product lead | weekly | **35%** (`02` §14) |
| K-03 | Visitor → diagnostic start | % of unique marketing visitors (consented sessions) with `diagnostic_started` | PostHog (consent-biased) | funnel `page_viewed → diagnostic_started` | growth lead | weekly | 12% [A, `20` §6.1] |
| K-04 | Diagnostic completion | `diagnostic_completed` / `diagnostic_started` | DB (diagnostic attempts) | view `analytics.v_diagnostic_funnel` | product lead | weekly | 60% [A] |
| K-05 | Diagnostic → sign-up | Diagnostic completers who sign up within 24 h (guest session linked to user, §7.2) | DB link table (`attempt.user_id` set at sign-up) | same view | growth lead | weekly | 55% [A] |
| K-06 | Sign-up → first full mock ≤ 7 d | `signup_completed` cohort with `attempt_submitted` where `scope='full'`, `mode='exam'` | DB | view | product lead | weekly | 35% [A] (`20` §6.1) |
| K-07 | Paid conversion (90-day) | % of a sign-up cohort with >= 1 `order` in status `paid`/`partially_refunded`/`refunded`-with-`paid_at` within 90 days of sign-up. Reported also at 7/30 days; **cohort must be >= 90 days old to be final** | `user`, `order` | view `analytics.v_paid_conversion_cohort` | founder / growth | monthly (weekly provisional) | **4% base; gate >= 3%** (`02` §14) |
| K-08 | Paid conversion by entry path | K-07 split by first-touch channel group, locale, diagnostic done Y/N, tier first bought | `user_attribution` (§6.4), `order_item` | PostHog breakdown + SQL | growth | monthly | track |
| K-09 | Revenue (net) | Sum of `order.total_minor` for paid orders minus refunds, minus VAT/provider fees where known, in BDT-equivalent at the monthly rate stored in `fx_rate_monthly` (A1 `1 USD = BDT 120` planning) | `order`, `refund`, `payment` | view `analytics.v_revenue_daily` | finance | daily/weekly/monthly | >= BDT 1M/month for 2 months = hiring gate (`02` §14) |
| K-10 | Blended CAC | Paid marketing spend (all paid channels) / new paying customers (first paid order in period); spend from `marketing_spend` (manual weekly CSV import by growth, §6.4) | `marketing_spend`, `order` | view `analytics.v_cac` | growth lead | weekly/monthly | **<= BDT 1,800** (`02` §14) |
| K-11 | CAC payback | Months until cumulative contribution of a first-purchase cohort >= CAC; contribution = net revenue - COGS (AI, SMS, video, gateway fees) | `order`, `evaluation_result.cost_micros`, `notification_dispatch.cost_minor`, gateway fees | view `analytics.v_cac_payback` | finance | monthly | within first purchase (`02` §14) |
| K-12 | Refund rate | Refunded orders / paid orders, by **order month** (also report 7-day-policy refunds separately); excludes chargebacks (tracked separately K-12b) | `refund`, `order` | view `analytics.v_refund_rate` | finance | weekly/monthly | **< 5%** (`02` §14) |
| K-13 | Payment success rate | `payment.status='succeeded'` / payments initiated, by provider and method, excluding user-cancelled | `payment` | PostHog dashboard (`payment_*`) + view | finance / eng | daily | alert if < 85% for any method over 1 h [A] |
| K-14 | **AI-score agreement** | % of AI band estimates within **0.5 band** of the adjudicated human/certified rater on the sample; also QWK and mean signed error | `evaluation_result` (ai vs human), QA sample, gold set (§10) | view `analytics.v_ai_agreement` | academic lead | weekly + per release | **>= 80%** (`02` §14; validation set >= 200 essays) |
| K-15 | Course completion | % of enrolments with `course_progress.progress_pct >= 80` within 180 days (Core access window) | `course_progress`, `enrollment` | view `analytics.v_completion` | academic lead | monthly | **>= 50%** (`02` §14) |
| K-16 | NPS | Promoters (9-10) minus detractors (0-6) of `nps_submitted`, quarterly, with response rate; segmented paid vs free | `nps_response` (stored in DB), `nps_submitted` | view + PostHog | product lead | quarterly | **>= 40** (`02` §14) |
| K-17 | Support first response | Median time from ticket created to first agent reply, business-hours-adjusted | helpdesk export (P1) / `support_ticket` (P2) | view `analytics.v_support_sla` | support lead | daily | **< 4 h** (`02` §14) |
| K-18 | Revenue mix | Share of net revenue by B2C self-paced / Live+Mentor / B2B / international | `order_item`, `product`, `order.org_id`, billing country | view | founder | monthly | track |
| K-19 | Gross margin | (Net revenue - COGS) / net revenue; COGS = AI + STT + SMS + video + gateway fees | as K-11 | view | finance | monthly | **>= 72%** (`02` §14) |
| K-20 | Streak adoption (P2) | % of weekly active learners who met their weekly study-day target | `streak`, `study_plan` | PostHog | product lead | monthly | track; do not over-invest (`02` §14) |
| K-21 | D7 / D30 return | % of sign-up cohort with any `session_started` (authenticated) on day 7 and day 30 (+/- 1 day window) | PostHog (consent) + DB `session` | retention table | product lead | weekly | D7 >= 30% [A] |
| K-22 | Pass renewal rate | Of passes expiring in a month, % with another paid pass/course within 14 days after expiry | `entitlement`, `order` | view `analytics.v_renewal` | founder | monthly | track |
| K-23 | Free-to-paid time | Median days from sign-up to first paid order | `user`, `order` | view | growth | monthly | track |
| K-24 | Time to first value | Median minutes from `signup_completed` to first `lesson_completed` / `attempt_submitted` / `evaluation_completed` | server events | PostHog | product | weekly | track |
| K-25 | Exam reliability (guardrail) | Autosave success >= 99.95% (SLO in `11` §5.6); voided/interrupted attempts per 1,000 attempts | server logs + `attempt_*` | Better Stack/PostHog | eng lead | daily | `11` SLO |
| K-26 | AI cost per evaluation | `cost_micros` average by kind; vs planning values writing ~ $0.06, full speaking test ~ $0.20 (D12 C9) | `evaluation_result` | view | eng/finance | weekly | within +25% of plan |
| K-27 | Message health | Hard-bounce < 2%, complaint < 0.1%, unsubscribe < 0.5%/send; SMS delivery >= 97% | `email_log`, `notification_dispatch` | view | lifecycle | weekly | see `29` §9 |
| K-28 | Live attendance (P1 pilot / P2) | Attended minutes / scheduled minutes for enrolled learners, plus % with attendance >= 80% (completion rule, `18`) | attendance table or ops sheet import (P1) | view | ops | per cohort | >= 80% rule |
| K-29 | Community/Q&A response (P2) | Median time to first staff/peer answer on course Q&A | `thread`, `answer` | view | academic | monthly | [A] <= 24 h |
| K-30 | Scholarship/access reach | Share of paid-equivalent enrolments via access programme; completion rate of scholarship cohort | `entitlement.source` | view | founder | quarterly | track |

### 2.4 Guardrail metrics (apply to every experiment and release)

| Guardrail | Definition | Non-inferiority margin (experiment fails if breached) |
|---|---|---|
| G-01 Exam reliability | K-25 autosave success; interrupted attempts per 1,000 | no worsening beyond 0.05 pp / +1 per 1,000 |
| G-02 AI agreement | K-14 on shadow/canary sample | not below 80% and not worse than control by > 2 pp |
| G-03 Refund rate | K-12 within 30 days for exposed purchasers | not worse than +1 pp |
| G-04 Payment success | K-13 | not worse than -1 pp |
| G-05 Support load | tickets per 100 active users | not worse than +10% relative |
| G-06 Message complaints | unsubscribe or complaint per send | not above 0.5% / 0.1% |
| G-07 Page performance | LCP/INP p75 (BD, 4G) per `11` | LCP < 2.5 s maintained |
| G-08 Accessibility | axe violations in changed screens | zero new serious/critical |
| G-09 North star | WATL per exposed user | not worse than -2% relative (unless experiment targets monetisation with explicit sign-off) |

### 2.5 SQL examples (reference implementations; reconcile column names with `05` at build)

All live in the `analytics` schema as views owned by a migration (NEW-ANL-04), read via a read-only role `lumen_readonly` (SELECT on `analytics.*` only, no base-table access). Examples below use the names in `05`; adjust the few columns marked `/* ? */`.

```sql
-- K-01 WATL (weekly, Asia/Dhaka)
create or replace view analytics.v_watl_weekly as
select date_trunc('week', ta.submitted_at at time zone 'Asia/Dhaka')::date as week_start,
       count(distinct ta.user_id)                                           as watl,
       count(*)                                                             as timed_attempts,
       round(count(*)::numeric / nullif(count(distinct ta.user_id), 0), 2)  as attempts_per_learner
from test_attempt ta
join "user" u on u.id = ta.user_id and not coalesce(u.banned, false)
where ta.mode = 'exam' and ta.status in ('submitted','scored','expired') and ta.submitted_at is not null
  and not exists (select 1 from analytics.internal_user iu where iu.user_id = ta.user_id)
group by 1;

-- K-02 Activation (7-day) by sign-up week
create or replace view analytics.v_activation_cohort as
with s as (
  select u.id user_id, u.created_at, date_trunc('week', u.created_at at time zone 'Asia/Dhaka')::date as cohort_week
  from "user" u
  where not exists (select 1 from analytics.internal_user iu where iu.user_id = u.id)
)
select s.cohort_week,
       count(*)                                              as signups,
       count(*) filter (where exists (
         select 1 from test_attempt ta
         where ta.user_id = s.user_id and ta.status in ('submitted','scored','expired')
           and ta.submitted_at <= s.created_at + interval '7 days'
       ))                                                    as activated,
       round(100.0 * count(*) filter (where exists (
         select 1 from test_attempt ta
         where ta.user_id = s.user_id and ta.status in ('submitted','scored','expired')
           and ta.submitted_at <= s.created_at + interval '7 days')) / nullif(count(*),0), 1) as activation_pct
from s group by 1;

-- K-07 Paid conversion within 90 days (final only when cohort is >= 90 days old)
create or replace view analytics.v_paid_conversion_cohort as
with s as (select id user_id, created_at, date_trunc('week', created_at at time zone 'Asia/Dhaka')::date cohort_week from "user")
select s.cohort_week, count(*) signups,
       count(*) filter (where exists (select 1 from "order" o
            where o.user_id = s.user_id and o.paid_at is not null
              and o.paid_at <= s.created_at + interval '90 days')) as paid_90d,
       (s.cohort_week + 90) <= current_date as is_final
from s group by s.cohort_week;

-- K-12 Refund rate by order month
create or replace view analytics.v_refund_rate as
select date_trunc('month', o.paid_at)::date as month,
       count(*) filter (where o.paid_at is not null)                                         as paid_orders,
       count(distinct r.order_id) filter (where r.status = 'succeeded')                      as refunded_orders,
       round(100.0 * count(distinct r.order_id) filter (where r.status = 'succeeded')
             / nullif(count(*) filter (where o.paid_at is not null), 0), 2)                  as refund_rate_pct
from "order" o left join refund r on r.order_id = o.id
where o.paid_at is not null group by 1;

-- K-14 AI-score agreement (human QA sample and human reviews), by task family
create or replace view analytics.v_ai_agreement as
select er.rubric_key,
       date_trunc('week', hr.created_at)::date                                  as week_start,
       count(*)                                                                 as n,
       round(100.0 * avg((abs(ar.overall_band - hr.overall_band) <= 0.5)::int), 1) as within_half_band_pct,
       round(avg(ar.overall_band - hr.overall_band), 2)                         as mean_signed_error,   -- + = AI generous
       round(avg(abs(ar.overall_band - hr.overall_band)), 2)                    as mae
from evaluation_request er
join evaluation_result ar on ar.evaluation_request_id = er.id and ar.source = 'ai'
join evaluation_result hr on hr.evaluation_request_id = er.id and hr.source = 'human'
where ar.overall_band is not null and hr.overall_band is not null
group by 1, 2;
```

Notes: QWK is computed in the monitoring job (§10.2) because it needs the full confusion matrix; K-14's public figure is always the **gold-set** result (`07` §7.9 requires >= 200 labelled responses per task family, QWK >= 0.80 between raters), and the production view is a drift monitor, not the marketing claim. Human QA rows from the 5% sample use `source='human'` with a `qa_sample` flag (NEW-ANL-18) so that learner-requested reviews and QA are distinguishable (learner-requested reviews are a biased sample).

### 2.6 Owners (RACI-lite)

| Role | Accountable for |
|---|---|
| Founder | North star, K-07, K-09, K-18, K-22 hiring/spend gates |
| Growth lead | K-03, K-05, K-08, K-10, acquisition dashboards, experiment backlog for marketing |
| Product lead | K-01, K-02, K-06, K-16, K-21, K-24, activation/learning experiments |
| Academic lead | K-14, K-15, item/AI quality dashboards |
| Finance | K-09, K-11, K-12, K-13, K-19 |
| Support lead | K-17, support dashboard |
| Lifecycle lead | K-27, message experiments (`29`) |
| Ops (live) | K-28 |
| Eng lead | K-25, K-26, tracking plan integrity, PostHog availability |
| Privacy owner | consent, retention, DSAR in analytics |

Until the team exists (`02` §10.4), the founder holds all roles; the table fixes *who decides* when hires happen.

## 3. Tooling and data flow

```
Browser (consent) ──posthog-js──────────────┐
Server actions / route handlers / Inngest ──posthog-node (batched, flushAt, shutdown)──► PostHog (Cloud, region per D3)
Stripe/Paddle/SSLCommerz webhooks ──► Postgres ──► outbox ──► Inngest `analytics.track*` ──┘
Postgres (Neon) ──read-only role `lumen_readonly` + `analytics` schema views──► PostHog data warehouse (Postgres source) [V] or Metabase (OSS)
PostHog ──batch export (later)──► BigQuery / ClickHouse (optional, §11)
Marketing spend (weekly CSV) ──► `marketing_spend` table
```

- PostHog project per environment: `prod` and `staging`/`preview` (never share keys; previews send to `staging`; `is_internal` property set for staff).
- Client init in `apps/web/lib/analytics/client.ts` after consent; reverse proxy at `/ingest` (Next rewrites) to reduce ad-block loss and keep first-party [V] (rate limited; do not forward cookies other than the PostHog ones).
- Server: `track()` in `packages/core/src/analytics` (typed). Calls are fire-and-forget with a short timeout; failures never fail a request; events flush in `waitUntil`/after() style hooks so serverless functions do not drop them [V Next 16 API].
- Domain events -> analytics: `analytics.track` consumers (`06` §7.1) map outbox events to taxonomy events using the table in §5.12, so the same fact is emitted once, from the server, with the same idempotency key (`$insert_id = dedupeKey`) -> PostHog de-duplicates.

## 4. Principles for client vs server emission

| Emit from | When | Why | Examples |
|---|---|---|---|
| **Server** (mandatory) | money, entitlement, exam state, AI evaluation lifecycle, auth lifecycle, notification lifecycle, anything a KPI gate depends on | Cannot be blocked, spoofed or lost to tab closes; has access to authoritative state | `signup_completed`, `order_paid`, `attempt_submitted`, `evaluation_completed`, `message_sent` |
| **Client** | UI interaction and rendering facts the server cannot see | Needs DOM/viewport/performance | `page_viewed`, `cta_clicked`, `video_stalled`, `web_vital_reported`, `autosave_failed` |
| **Both (paired)** | funnels where client intent precedes server confirmation | Measures UI drop-off vs failure | `checkout_started` (server, when the order is created) preceded by `pricing_viewed` (client) |

Rules: (1) purchases and refunds are **never** client-emitted; (2) client events must never be the numerator of a KPI in §2.3 (only denominators or diagnostic breakdowns); (3) a client event that mirrors a server event uses a different name (`signup_started` vs `signup_completed`), never the same one; (4) server events carry `source: 'server'`, client events `source: 'client'` (super property).

## 5. Event taxonomy v1

### 5.1 Naming and structure

- `snake_case`, `<object>_<past_tense_verb>`, singular object, max 3 words (`11` §5.4). Allowed verbs: `viewed, clicked, started, completed, submitted, abandoned, requested, failed, paid, issued, sent, delivered, opened, granted, revoked, changed, played, stalled, reported, shown, dismissed, enabled, disabled, linked`. Anything else needs a taxonomy PR.
- Object vocabulary (nouns) is shared with the schema: `page, cta, signup, login, diagnostic, onboarding, lesson, video, practice, question, attempt, section, evaluation, plan, streak, vocab, mistake, pricing, checkout, payment, order, refund, entitlement, certificate, class, recording, ticket, nps, message, notification, consent, export, deletion, org, seat, guardian, experiment`.
- Property names: `snake_case`; ids end in `_id`; booleans `is_`/`has_`; counts `_count`; durations `_ms`; money `_minor` with `currency`; timestamps are PostHog's `timestamp` (never custom epoch fields unless a past event is backfilled: `occurred_at`).
- Enumerated values are lowercase `snake_case` strings from a closed set declared in `events.ts`; **no free text from users**; max string length 64 for enums, 128 for ids.
- Versioning: each event has `event_version` (int) in the typed map; adding an optional property = same version; renaming/removing/changing meaning = new version with both emitted for 30 days, dashboards migrated, old removed. Never reuse a name with a different meaning.
- Source of truth: `packages/core/src/analytics/events.ts` (typed `EventMap`), generating (a) `track()` types, (b) this document's tables (`docs/generated/event-catalogue.md`), (c) the Zod validators used in tests, (d) the PostHog tracking-plan import [V]. CI fails if an event is emitted that is not in the map or a required property is missing.

### 5.2 Common properties

**Super properties** (set once per session/client; server adds them on every server event):

| Property | Type | Values / source | Required |
|---|---|---|---|
| `source` | enum | `client`, `server`, `job` | yes |
| `app_env` | enum | `prod`, `staging`, `preview`, `dev` | yes |
| `release` | string | git SHA short | yes |
| `locale` | enum | `en`, `bn` (UI locale) | yes |
| `country` | string(2) | Cloudflare `cf-ipcountry` (coarse, no IP stored) | yes |
| `device_type` | enum | `mobile`, `tablet`, `desktop` | client |
| `role` | enum | active role from switcher (`guest, student, guardian, instructor, grader, content_editor, support, finance, counsellor, org_admin, admin, super_admin`) | yes (`guest` if unauth) |
| `plan_tier` | enum | `none, free, core, plus, live, mentor, pass, org` (highest active entitlement) | server |
| `region` | enum | `BD, A, B, C` (price region, D12 C16) | server for commerce |
| `age_band` | enum | from `user_profile.age_band` -> coarse `minor`, `adult` only in events (not the fine band) | server |
| `is_internal` | bool | staff/test accounts; excluded from KPI views | yes |
| `consent_tier` | enum | `essential`, `analytics`, `none` (§8) | yes |
| `event_version` | int | per event | yes |
| `$insert_id` | string | idempotency (server events): `${event}:${entityId}[:${slot}]` | server |

**Never in any event:** email, phone, name, address, IP, full user-agent, essay or answer text, audio, transcript, free-text feedback, support ticket text, coupon code text (use `coupon_id`), payment instrument identifiers, OTP, tokens, URLs with query strings containing tokens (strip query keys except allow-listed `utm_*`), `order.number` is allowed as `order_id` (opaque), full DOB. Page URLs are sent as `route` pattern (`/app/learn/[course]/[lesson]`) plus allow-listed ids, never raw path parameters of user content.

### 5.3 PII rules in practice

1. **Allow-list, not block-list:** `track()` rejects any property not declared for that event (typecheck + runtime strip in production and Sentry warning).
2. **Scrubber:** same regexes as Sentry `scrubEvent` (`11` §5.3) run on all string properties (emails, BD phones, URLs with tokens) as a defence-in-depth; hits are dropped and logged `analytics.pii_dropped` (count only).
3. **PostHog settings:** `ip: false` (discard IP) [V], `person_profiles: 'identified_only'`, `autocapture: false` (or limited to `data-track` attributes), `mask_all_text` for replay, `capture_pageview: false` (we send `page_viewed` ourselves), `disable_session_recording` outside `(marketing)`.
4. **Person properties** (set on identify, stored in PostHog): `role_set`, `locale`, `country`, `signup_week`, `signup_method`, `plan_tier`, `age_band_coarse`, `first_touch_channel`, `exam_goal` (enum: `ielts_academic, ielts_gt, gre, pte, det, english_foundation, other`), `target_band_bucket`. No name/email/phone.
5. **Test:** a CI test emits every event with fixtures containing email/phone-like strings and asserts they are removed or rejected.

### 5.4 Acquisition and marketing (client unless noted)

| Event | Side | Required props | Optional props | Used by |
|---|---|---|---|---|
| `page_viewed` (11) | client | `route_group`, `route`, `referrer_host` | `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `click_id_present` (bool) | K-03, acquisition dash |
| `cta_clicked` (11) | client | `cta_id`, `placement` | `variant` (experiment) | funnels, experiments |
| `tool_used` | client | `tool` (`band_calculator, clb_converter, gpa_converter, word_counter, which_test_quiz, ...`) | `result_bucket` | acquisition, SEO |
| `quiz_completed` | server | `quiz` (`which_test`), `recommended_test` (enum) | - | K-03 |
| `lead_captured` | server | `source` (`quiz, newsletter, webinar, tool`), `consent_marketing` (bool) | - | CRM, `29` N-WIN-06 |
| `pricing_viewed` (11) | client | `currency`, `region`, `locale` | `price_set_id` (experiment §9.4) | monetisation funnel |
| `tier_compared` | client | `product_type`, `tier_a`, `tier_b` | - | pricing UX |
| `search_performed` | client | `scope` (`catalogue, help`), `results_count` | no query text | catalogue UX |

### 5.5 Auth, onboarding, diagnostic

| Event | Side | Required props | Optional props | Used by |
|---|---|---|---|---|
| `signup_started` (11) | client | `method` (`google, email_otp, phone_otp`) | `entry` (`diagnostic_results, pricing, navbar, ...`) | funnel |
| `signup_completed` (11) | server | `method`, `age_band` (coarse), `locale`, `entry` | `has_diagnostic` (bool), `referral` (bool), `first_touch_channel` | K-02, K-07 cohort |
| `login_completed` | server | `method`, `is_new_device` (bool) | `second_factor` (`none, totp, passkey`) | security, K-21 |
| `login_failed` | server | `method`, `reason_code` (`otp_wrong, otp_expired, rate_limited, banned`) | - | security |
| `otp_requested` | server | `channel` (`email, sms`) | `provider` | SMS cost, abuse |
| `otp_verified` | server | `channel`, `attempts_n` | `latency_ms` | OTP funnel |
| `consent_changed` | server | `kind` (`analytics_cookies, marketing, ai_processing, recording_retention, sms_service, whatsapp_messages`), `status` | `source` | privacy |
| `onboarding_started` / `onboarding_step_completed` / `onboarding_completed` | server | `step` (`goal, exam, level, date, time_budget, guardian`) | `skipped` (bool) | activation |
| `diagnostic_started` (11) | server | `track` | `guest` (bool) | K-03/04 |
| `diagnostic_completed` (11) | server | `track`, `duration_ms`, `estimated_band_bucket` | `guest` | K-04 |
| `diagnostic_result_viewed` (11) | client | `track`, `gated` | - | K-05 |
| `diagnostic_linked` | server | `track`, `link_latency_ms` | - | identity stitching (§7.2), K-05 |
| `plan_generated` | server | `plan_kind` (`rolling_4w, dated`), `weeks` | - | activation |
| `plan_task_completed` (P1 NBA list) | server | `task_kind`, `source` (`nba, plan`) | - | plan adherence |

### 5.6 Learning

| Event | Side | Required props | Optional props | Used by |
|---|---|---|---|---|
| `lesson_started` (11) | client | `course_id`, `lesson_id`, `lesson_type` | - | engagement |
| `lesson_completed` (11) | server | `course_id`, `lesson_id`, `watch_pct` | `duration_ms` | K-15, K-24 |
| `video_played` (11) / `video_stalled` (11) | client | per 11 | `network_type` | video QoE (`10`) |
| `practice_started` | server | `session_id`, `kind` (`topic, mistakes, vocab, custom`), `skill_id`, `question_count` | - | engagement |
| `practice_completed` | server | `session_id`, `answered_count`, `correct_pct_bucket`, `duration_ms` | - | engagement, mastery |
| `question_answered` | server (batched via attempt autosave; **not** per-click) | aggregated in `attempt_submitted`/`practice_completed`, no per-question event to protect volume | - | n/a |
| `mistake_resolved` | server | `skill_id`, `question_kind` | - | mistake notebook |
| `vocab_session_completed` | server | `cards_count`, `due_count`, `duration_ms` | - | F-VOC |
| `bookmark_added` / `note_added` | client | `target_kind` | - | engagement signal ("log cheap engagement signals from day one", `02` §14) |
| `lecture_dropped` | client | `lesson_id`, `position_pct_bucket` | - | content quality (dropped/bookmarked lectures, `02` §14) |
| `certificate_issued` | server | `course_id` | - | K-15 |
| `streak_extended` / `streak_broken` (11) | server | `length` | - | K-20 (P2) |
| `goal_set` | server | `goal_kind` (`exam_date, target_band, weekly_minutes`) | `exam_date_bucket_weeks` | planning |

### 5.7 Exam engine and AI evaluation

| Event | Side | Required props | Optional props | Used by |
|---|---|---|---|---|
| `attempt_started` (11, amended Y3) | server | `attempt_id`, `test_id`, `track`, `mode` (`exam, practice`), `scope` (`full, section`), `resumed` | `accommodation_multiplier_bucket` (`none, 1_25, 1_5, 2_0`) | engagement |
| `section_started` / `section_submitted` (11) | server | `attempt_id`, `section_type`, `time_used_ms` | `auto_submitted` | exam funnel |
| `attempt_submitted` (11) | server | `attempt_id`, `track`, `mode`, `scope`, `timed` (= `mode==='exam'`), `duration_ms`, `answered_pct` | `first_attempt` (bool: user's first ever) | **K-01, K-02, K-06** |
| `attempt_scored` | server | `attempt_id`, `track`, `overall_band_bucket` (0.5-wide), `form_version_id` | - | learning dash |
| `attempt_abandoned` (11) | server (cron) | `attempt_id`, `last_section`, `idle_ms` | - | reliability |
| `attempt_interrupted` | server | `attempt_id`, `reason` (`heartbeat_lost, voided, reissued`) | - | K-25, GA-007 |
| `autosave_failed` (11) | client | `attempt_id`, `http_status`, `retry_n` | - | reliability |
| `evaluation_requested` (11) | server | `evaluation_id`, `kind`, `credits_used`, `mode` (`ai, ai_then_human, human`) | `from_attempt` (bool) | engagement, paywall |
| `evaluation_completed` (11) | server | `evaluation_id`, `kind`, `latency_ms`, `provider`, `cost_usd_micros` | `prompt_version`, `model_id`, `source` (`ai, human`), `band_bucket`, `word_count_bucket` | K-14, K-26 |
| `evaluation_failed` (11) | server | `evaluation_id`, `kind`, `stage`, `error_code` | `credit_reversed` (bool) | reliability |
| `evaluation_viewed` | client | `evaluation_id`, `kind`, `time_to_view_ms` | - | engagement |
| `evaluation_rated` | client | `evaluation_id`, `rating` (`helpful, not_helpful`) | `reason` (enum: `too_high, too_low, unclear, wrong_language, other`) | perceived accuracy |
| `evaluation_disputed` | server | `evaluation_id`, `kind`, `reason` (enum), `consented_to_calibration` (bool) | - | AI dispute rate |
| `human_review_requested` | server | `evaluation_id`, `kind`, `credits_used` | - | human-review capacity |
| `grader_override_applied` | server | `evaluation_id`, `delta_band_bucket` (`-1.0..+1.0`), `rubric_key` | - | AI quality (grader side; no grader id in analytics, only bucketed `grader_pool` size) |
| `credit_balance_changed` | server | `delta`, `reason` (`signup_grant, monthly_grant, purchase, spend, reversal, adjustment`) | `balance_after_bucket` | paywall |
| `paywall_shown` | client | `trigger` (`second_mock, second_ai_eval, locked_lesson, credits_zero, plan_locked`), `product_type_offered` | `variant` | K-07 drivers (`02` §9.1) |
| `paywall_dismissed` | client | `trigger` | - | paywall UX |

### 5.8 Monetisation and billing (all server, from webhook-verified state)

| Event | Required props | Optional props | Notes |
|---|---|---|---|
| `checkout_started` (11) | `order_id`, `product_type`, `product_id`, `currency`, `amount_minor`, `coupon_applied`, `region` | `price_set_id`, `tier`, `payer_is_guardian` | Emitted when the order is created (Buy now P1) |
| `payment_method_selected` (11) | `order_id`, `provider`, `channel` | - | |
| `payment_initiated` | `order_id`, `provider` | - | |
| `payment_failed` (11) | `order_id`, `provider`, `reason_code` | `channel` | |
| `payment_verifying` | `order_id`, `provider`, `wait_ms` | - | maps `payment.verifying`; feeds "debited-no-access" monitoring |
| `payment_reconciled` | `order_id`, `provider`, `delay_ms`, `path` (`ipn_late, reconcile_job, manual`) | - | `29` N-COM-06/07 |
| `order_paid` (11) | `order_id`, `product_type`, `currency`, `amount_minor`, `provider`, `first_purchase` | `region`, `tier`, `coupon_id`, `price_set_id`, `days_since_signup`, `entry_diagnostic` | Webhook-verified only; emitted by `analytics.track-purchase` |
| `order_abandoned` | `order_id`, `age_ms` | `step_reached` | Derived from `order.expired` |
| `coupon_applied` / `coupon_rejected` | `coupon_id`, `reason_code` | - | no coupon text |
| `refund_requested` | `order_id`, `within_policy`, `consumed_pct_bucket` | - | |
| `refund_issued` (11) | `order_id`, `amount_minor`, `reason` (enum) | `provider` | |
| `entitlement_granted` | `entitlement_id`, `scope`, `source` (`purchase, org_seat, scholarship, support, coupon`), `ends_in_days` | - | |
| `renewal_reminder_sent` / `pass_renewed` (11) | `days_before_expiry` | `channel` | also recorded as `message_sent` |
| `pass_expired` | `entitlement_id`, `had_renewal_reminder` | - | K-22 |
| `instalment_paid` / `instalment_missed` (P2) | `plan_id`, `index`, `of` | - | |
| `subscription_changed` (intl, P2) | `action` (`created, renewed, cancelled, payment_failed`), `interval` | - | from Paddle/Stripe webhooks |
| `scholarship_decided` | `decision` (`approved, declined`), `discount_bucket` | - | access programme |
| `referral_rewarded` (P2) | `reward_kind` | - | |

Purchase identity: `order_paid` is attributed to the user's `distinct_id` (hashed) when consent tier is `analytics`; otherwise it is Tier 0 (§8.3). The **warehouse view** `analytics.v_revenue_daily` is the revenue source of truth regardless.

### 5.9 Live classes, community, support, org, guardian

| Event | Side | Required props | Optional | Used by |
|---|---|---|---|---|
| `class_scheduled` | server | `session_id`, `batch_id`, `slot` (`apac, emea, americas`) | - | live dash |
| `class_joined` | server | `session_id`, `late_ms` | `device_type` | K-28 |
| `class_left` | server | `session_id`, `attended_ms` | - | K-28 |
| `recording_played` | client | `session_id`, `watched_pct_bucket` | - | catch-up credit (`18`) |
| `attendance_threshold_crossed` | server | `batch_id`, `threshold` (`80`), `direction` | - | completion cert |
| `speaking_club_booked` / `speaking_club_missed` | server | `club_id` | - | `18` |
| `thread_created` / `answer_posted` (P2) | server | `course_id`, `is_staff` | no text | K-29 |
| `ticket_created` / `ticket_resolved` | server (helpdesk webhook) | `category` (enum list from `27`), `channel`, `first_response_ms` (on resolve) | `csat` (1-5) | K-17 |
| `help_article_viewed` | client | `article_id`, `from_error_code` | - | deflection |
| `nps_submitted` (11) | client -> server write | `score`, `segment` (`free, paid`) | `comment_present` (bool; comment itself stays in DB, not analytics) | K-16 |
| `org_member_invited` / `org_member_joined` / `org_assignment_created` | server | `org_id_hash`, `count` | - | B2B |
| `guardian_link_changed` | server | `status` | - | family |
| `report_exported` | server | `report_kind`, `rows_bucket` | - | B2B usage |

### 5.10 Messaging events (server only; align with `29`)

| Event | Required props | Notes |
|---|---|---|
| `message_sent` | `template_id`, `catalogue_id`, `channel`, `class` (`T,S,P,M`), `locale` | from `notification_dispatch` rows with `status='sent'` |
| `message_skipped` | same + `reason` (`preference_off, paused, cap, quiet_hours, no_consent, minor, suppressed`) | measures cap pressure; sampled 10% for `reason='cap'` |
| `message_delivered` / `message_bounced` / `message_complained` | `template_id`, `channel` | from provider webhooks |
| `message_clicked` | `template_id`, `link_kind` | from Resend click events (marketing/notification only; off for S/OTP) |
| `message_unsubscribed` | `template_id`, `scope` | one-click and page |
| `notification_opened` | client: `catalogue_id`, `channel` (`in_app, push`) | in-app bell opens and push taps |

Attribution to downstream outcomes uses `utm_campaign=<template_id>` on landing (client `page_viewed`) and a 7-day server-side window from `message_clicked` to the outcome event.

### 5.11 Privacy, experiments, reliability

| Event | Side | Required props |
|---|---|---|
| `export_requested` / `export_completed` | server | `duration_ms` (completed) |
| `deletion_requested` / `deletion_cancelled` / `deletion_completed` | server | `days_to_cancel` (cancelled) - **after `deletion_requested` no further tracking of the user** (R-DELETED); `deletion_completed` is an aggregate Tier 0 event (no id) |
| `experiment_exposed` | client/server | `experiment_key`, `variant`, `surface` - emitted once per user per experiment (PostHog's `$feature_flag_called` is the backup) |
| `experiment_goal_reached` | server | `experiment_key`, `variant`, `goal` (only for custom goals not already events) |
| `web_vital_reported` (11) | client | `name`, `value`, `rating`, `route_group`, `country` |
| `error_boundary_shown` | client | `route_group`, `error_code` (no message text) |
| `feature_flag_evaluated` | server | `flag_key`, `value` (sampled 1%; ops flags from `feature_flag` table) |

### 5.12 Domain event to analytics event map (server pipeline)

| Domain event (`06` §7.1) | Analytics event | Consumer |
|---|---|---|
| `user.signed_up` | `signup_completed` | `analytics.track` |
| `user.onboarded` | `onboarding_completed` | `analytics.track` |
| `order.created` | `checkout_started` | `analytics.track` |
| `payment.initiated` / `payment.failed` | `payment_initiated` / `payment_failed` | `analytics.track` |
| `order.paid` | `order_paid` | `analytics.track-purchase` |
| `order.expired` | `order_abandoned` | `analytics.track` |
| `entitlement.granted` / `entitlement.expired` | `entitlement_granted` / `pass_expired` | `analytics.track` |
| `refund.requested` / `refund.succeeded` | `refund_requested` / `refund_issued` | `analytics.track` |
| `attempt.started` | `attempt_started` | `analytics.track` |
| `attempt.section_submitted` | `section_submitted` | `analytics.track` |
| `attempt.submitted` | `attempt_submitted` | `analytics.track` |
| `attempt.scored` | `attempt_scored` | `analytics.track` |
| `evaluation.requested` / `completed` / `failed` | `evaluation_requested` / `completed` / `failed` | `analytics.track` |
| `evaluation.overridden` | `grader_override_applied` | `analytics.track` |
| `credits.adjusted` | `credit_balance_changed` | `analytics.track` |
| `lesson.completed` | `lesson_completed` | `analytics.track` |
| `streak.updated` | `streak_extended` / `streak_broken` | `analytics.track` |
| `enrollment.created` | `course_enrolled` | `analytics.track` |
| `org.member_invited` / `org.member_joined` | `org_member_invited` / `org_member_joined` | `analytics.track` |
| `user.profile_updated` | (identify only) | `analytics.identify` |
| `privacy.*` | `export_*` / `deletion_*` | `analytics.track` |
| `consent.recorded` | `consent_changed` | `analytics.track` |

Payloads carry ids only; the mapper loads minimal enrichments (tier, region) from the DB, never from client input.

## 6. Identity, hashing and attribution

### 6.1 Identifiers

| Id | Where | Notes |
|---|---|---|
| `distinct_id` (identified) | PostHog | `analytics_id(user_id)` = first 32 hex of HMAC-SHA256(`ANALYTICS_ID_KEY`, `user:<uuid>`). Same function in TypeScript and as a Postgres SQL function `analytics.analytics_id(uuid)` (for warehouse joins) using `pgcrypto` HMAC with the key supplied as a session setting by the read-only analytics role (key not stored in the DB; NEW-ANL-05). |
| `distinct_id` (anonymous) | PostHog | PostHog-generated UUID in a first-party cookie (`ph_*`), exists only after analytics consent. |
| `diagnostic_session_id` | first-party **strictly-necessary** cookie (`__Host-diag`, opaque random, 7 days) | Needed to run the guest diagnostic and to attach results at sign-up; **not** an analytics id; not sent to PostHog as `distinct_id`. |
| `order_id`, `attempt_id`, `evaluation_id`, `entitlement_id` | event properties | Opaque public ids (not sequential integers; order public id per `10` §2.4). |
| `org_id_hash` | event property | Same HMAC pattern with an `org:` prefix. |
| Group analytics | PostHog groups | `organization` group keyed by `org_id_hash` (for B2B usage dashboards), `cohort` (P2). No PII in group properties. |

Why hash: keeps the analytics store un-joinable to the production DB by anyone without the key (vendor breach, analyst export), and lets us honour deletion by recomputing the id (`DELETE person`) without keeping a mapping table.

Key management: `ANALYTICS_ID_KEY` is a secret in the env table (`04`/`10` Appendix), rotation requires re-identify and is **not planned** (version prefix `v1` stored in person property `aid_v` if a rotation is ever needed).

### 6.2 Identify / reset rules

1. `identify(analytics_id)` is called client-side **only** after sign-in **and** analytics consent; server events always carry the hashed id regardless of the client (server events for users without analytics consent are Tier 0, §8.3).
2. Person properties are set by server `analytics.identify` on `user.profile_updated` and role/tier changes (not by the client).
3. On sign-out: `posthog.reset()` clears the identified state so a **shared computer** (internet cafe, family PC, BD coaching-centre labs) never merges two people. The "this is a shared device" checkbox on sign-in sets `analytics_opt_out_for_session` (no identify).
4. Role switcher: `role` super property updates (`registerSuper`), no re-identify.
5. Impersonation (support read-only): all analytics suppressed for the session (`is_impersonation` cookie flag -> `posthog.opt_out_capturing()`; server drops events with that session).
6. Guardian acting for a student: events are attributed to the **guardian's** id with `acting_for` omitted; the student's data is not duplicated into the guardian's person profile.
7. Staff/test: `is_internal=true` super property; internal people are also listed in `analytics.internal_user` (DB) and filtered in every view and insight (PostHog "internal and test users" filter).

### 6.3 Attribution (first touch / last touch)

- On first consented page view we store `first_touch` (`utm_*`, `referrer_host`, landing `route`, `click_id_present`) in a first-party cookie (30 days) and copy to person properties at identify. At sign-up the server also receives it in the sign-up request and writes `user_attribution(user_id, first_touch jsonb, signup_at)` **only if** the user consented to analytics (else `channel='unknown'`) so non-consenting users are not profiled.
- Ad-platform click ids (`fbclid`, `gclid`) are not stored in PostHog. Server-side conversion APIs (Meta CAPI, Google Ads) are **P2** and consent-gated.
- Offline/organic (SEO, YouTube) attribution is directional only. Paid channels: weekly `marketing_spend` import (channel, campaign, spend_minor, currency, impressions, clicks) by growth; CAC (K-10) uses the DB, not PostHog.

## 7. Identity stitching: anonymous diagnostic to sign-up

### 7.1 Problem

The diagnostic is available to guests; results are gated behind sign-up (`03` AC). The funnel visitor -> diagnostic -> sign-up -> paid must hold even when the visitor never consented to analytics and when they switch devices between the diagnostic and sign-up.

### 7.2 Design

1. **Guest start:** server creates `test_attempt` with `user_id = null`, `guest_token_hash` (random 256-bit token hashed with SHA-256), cookie `__Host-diag` holds the token (HttpOnly, Secure, SameSite=Lax; strictly necessary). Server emits `diagnostic_started` with `consent_tier` of the visitor. If the visitor has analytics consent, the PostHog anonymous id is attached to the attempt (`attempt.ph_anon_id`, stored hashed) for later merge; otherwise not.
2. **Completion:** `diagnostic_completed` emitted; results page shows a gate "Sign up to see your results".
3. **Sign-up:** after Better Auth `user.create.after`, `linkGuestDiagnostic(userId, token)` sets `test_attempt.user_id`, clears the guest token, writes `diagnostic_linked` (`link_latency_ms` = signup time - completion time) and `signup_completed {has_diagnostic: true}` (same request, server side).
4. **PostHog merge (consented only):** the client calls `posthog.identify(analytics_id)` after sign-in, merging the anonymous id into the person (PostHog merges an anonymous id into an identified id once; never merges two identified ids) [V]. If the sign-up happens on a different device, there is no browser-level merge; the funnel is still complete in the DB (K-05 uses the DB link), and the PostHog funnel is flagged "device-bound".
5. **Non-consenting visitor:** no PostHog identity at all; the system still measures diagnostic starts, completions, and sign-up linkage through server events/DB (K-04, K-05, K-02).
6. **Abuse/edge cases:** multiple guest diagnostics from one token link only the latest attempt (the earlier ones are kept as anonymous aggregates); a token is single-use; expired guest attempts (> 7 days) are deleted per retention; if a user signs in to an existing account, the guest attempt is offered to link ("Save this result?") and only linked on confirmation.
7. **Verification tests:** E2E: guest completes diagnostic -> signs up with Google -> `diagnostic_linked` exists exactly once, `signup_completed.has_diagnostic=true`, results visible, no results payload before auth (matches `03` AC).

### 7.3 Cross-domain and cross-device notes

- Marketing site and app share one registrable domain, so cookies are shared; the `/verify/[code]` page and external pages are not instrumented beyond `page_viewed`.
- Payments leave the site (SSLCommerz hosted checkout); `order_paid` is server-side from the verified webhook, and `/checkout/return` is just `page_viewed` + `checkout_returned` (client) with `order_id`. Gateway round trip never depends on client cookies.
- Email/SMS click -> landing keeps `utm_*`; the app strips `utm_*` after storing first-touch.

## 8. Consent and privacy behaviour

### 8.1 Consent categories (banner spec lives in `08`/`26`)

| Category | Controls | Default (BD) | Default (EU/UK/other) |
|---|---|---|---|
| Strictly necessary | session, CSRF, diagnostic token, consent record, locale, Turnstile | on | on |
| Analytics (`analytics_cookies` consent kind) | PostHog client SDK, first-party anon id, experiments needing client assignment, session replay (marketing routes) | **off until accepted** (D3: "cookie-consent gated") | off until accepted (explicit) |
| Marketing | ad pixels (P2) | off | off |

Consent is stored in `consent_record(kind='analytics_cookies')` (existing enum) for signed-in users and in a first-party cookie for guests; the server reads the cookie on every request to set `consent_tier`.

### 8.2 What each tier may send

| Tier | Condition | Client SDK | Server events | Identifiers |
|---|---|---|---|---|
| **0 - Essential aggregate** | no analytics consent (or declined/withdrawn) | **not loaded** | only the allow-listed business-integrity events below, with `$process_person_profile=false` | none: `distinct_id` is a constant bucket per day (`agg:<yyyymmdd>`), no user, no device, no IP, no UTM |
| **1 - Analytics** | consent granted | loaded (autocapture off), identify after sign-in | all server events with hashed user id | hashed user id, anonymous cookie id |
| **2 - Replay (marketing pages only)** | consent granted and route in `(marketing)` | replay with `maskAllInputs`, `maskAllText` for forms | n/a | session id only |

Tier 0 allow-list (aggregate counts for reliability and finance sanity, not behaviour analysis): `order_paid` (`product_type, currency, amount_minor, provider, region`), `payment_failed`, `refund_issued`, `signup_completed` (`method`, `locale` only), `diagnostic_completed` (`track`), `attempt_submitted` (`mode, scope`), `evaluation_completed/failed` (`kind, latency_ms, provider, cost_usd_micros`), `autosave_failed` is client so **not** sent without consent (reliability is also measured server-side), `message_bounced/complained`. Basis: operating and securing the service and financial integrity, not behavioural profiling; **[LEGAL]** confirm for PDPO, and GDPR/ePrivacy for EU/UK (no storage/access on the device, no identifiers). If counsel disagrees, Tier 0 collapses to "no PostHog events", and all gates use the Postgres views (which is already the rule in §1).

### 8.3 Decision record (resolves GA-042)

1. Funnel under-counting from consent is accepted for **behavioural** PostHog funnels and is **measured**: the consent rate (`consent_tier='analytics'` share of sessions, from a Tier 0 `consent_changed` aggregate) is shown on every behavioural dashboard, and conversion metrics that matter (K-02, K-04..K-07, K-09, K-12) are computed in Postgres.
2. Never extrapolate consented-only funnels to totals without the consent-rate caveat; the weekly review shows both.
3. Tier 0 events are enough to detect payment/exam/AI outages even for non-consenting traffic (alerting also exists in Sentry/Better Stack per `11`).

### 8.4 Minors and sensitive contexts

- Under-18 (self-declared `age_band` minor, D7): no marketing analytics, no ad pixels, no replay (replay is marketing-only anyway), client SDK requires **guardian-consented** analytics (the guardian consent flow includes the analytics toggle) - default off; server events about a minor are Tier 0 unless the guardian consented. Experiments exclude minors from monetisation and message experiments (§9.3).
- No analytics in `(exam)` beyond the specified server events and `autosave_failed`; no keystroke or answer-content capture; **never** replay on exam, auth, checkout, learner, studio, grader, staff, org or admin (`11` §5.4).
- Accommodation data (`accommodation_multiplier`) is health-adjacent: only bucketed in `attempt_started` and excluded from any person property.

### 8.5 Consent withdrawal and DSAR

- Withdrawal: `posthog.opt_out_capturing()`, cookies cleared, server stops sending Tier 1 events within one request, the user's already-collected events remain until retention or DSAR.
- DSAR/erasure (`09` §13.9): job `analytics.delete-person` calls the PostHog delete-person API with `analytics_id(user_id)` [V], deletes `user_attribution` row, removes the user from warehouse exports (tombstone list applied on every export/refresh). `deletion_requested` stops tracking immediately (R-DELETED).
- Export (access request): PostHog person events can be exported by `analytics_id` [V]; included in the DSAR ZIP as `analytics_events.json` (properties only).

## 9. Experimentation framework

### 9.1 Tools and flag taxonomy

| Flag kind | Tool | Owner | Example | Lifetime |
|---|---|---|---|---|
| **Ops flag** (kill switch, rollout) | `feature_flag` table (`05`, D12 C10) + `/admin/feature-flags` | eng | `SMS_OTP_ENABLED`, `speaking.azure_pa` | long-lived, reviewed quarterly |
| **Release flag** (progressive rollout, canary) | PostHog flag (percentage / cohort) | eng | `new_exam_navigator` | <= 30 days then removed |
| **Experiment flag** | PostHog **Experiments** (multivariate flag + metrics) | metric owner | `exp_onboarding_goal_first` | <= 60 days; analysed and closed |
| **Permission/entitlement** | Entitlements (D5), **never** feature flags | commerce | | n/a |

`05` states "experiments live in PostHog"; ops flags stay in Postgres. A flag may never carry authorisation (server checks entitlements and roles in `packages/core`).

### 9.2 Assignment mechanics

1. **Unit of randomisation:** the *user* once identified (`analytics_id`); for pre-sign-up marketing pages, the *anonymous visitor* (PostHog anon id) **only with analytics consent**; non-consenting visitors always receive control and are excluded from analysis (they do not carry an experiment id).
2. **Stickiness:** variant is a deterministic hash of `(flag_key, distinct_id)` computed by PostHog; identified users are evaluated server-side with `distinct_id = analytics_id` so the variant is identical on every device; anonymous-to-identified transitions keep the identified result (PostHog flag "persist across authentication" option [V]); experiments that must not change on sign-up are restricted to post-sign-up surfaces.
3. **Server-side evaluation** (local evaluation with flag definitions cached 60 s [V]) for anything that changes server-rendered HTML or business logic, avoiding flicker and leakage; client evaluation only for client-only UI.
4. **Exposure logging:** `experiment_exposed` is sent at the moment the variant is actually *shown* (not at flag evaluation), once per user/experiment, so analysis uses real exposure.
5. **Mutual exclusion:** experiments touching the same surface share a *layer* (PostHog "exclusion" via a holdout/bucket property [V]) or are scheduled serially; max 3 concurrent experiments per funnel stage.
6. **Global holdout:** 5% of eligible users are held out of **all** lifecycle message experiments and nudge experiments for 90 days to measure the total value of messaging (`29`).
7. **Assignment ledger:** nightly job copies `(experiment_key, analytics_id, variant, first_exposed_at)` into `analytics.experiment_exposure` (Postgres) for audit and for price-lock checks (§9.4). The ledger stores hashed ids only.

### 9.3 What may and may not be A/B tested

| Category | Allowed? | Conditions |
|---|---|---|
| Marketing page copy, layout, imagery, CTA wording, order of sections, social proof (real, verified) | Yes | Accessibility pass; Bangla and English variants tested separately (language is a stratification factor) |
| Onboarding steps, defaults, ordering, wizard length | Yes | Guardrails G-01, G-09; minors allowed for UX if no monetisation/marketing elements |
| Dashboard layout, "next best action" ranking, empty states | Yes | |
| Study plan UI and explanation copy | Yes | Not the plan's pedagogical content correctness |
| Reminder timing, channel mix, subject lines, preheaders, send time (inside quiet hours and caps), digest format, email sequence length | Yes | `29` caps and quiet hours are *constraints*, never experiment variables; minors only on non-marketing; T and S message **content** may be tested only for clarity (not for urgency/persuasion) |
| Paywall *placement and framing* (e.g. show upsell after 2nd vs 3rd mock) | Yes, with founder sign-off | Changes what free users get; limited to <= 4 weeks; G-03/G-05 apply; the free allowance in D10/D12 (2 credits + 1/month; 1 sectional mock) is a promise and **cannot be reduced for any variant** |
| Checkout UI (layout, trust badges, payment method order, copy) | Yes | Payment methods offered and the price/total shown are identical across variants; no dark patterns (no pre-ticked add-ons, no countdowns) |
| **Prices / discounts** | Only via the protocol in §9.4 | Never two prices for the same user |
| Strike-through "was" prices | **No** during any price test, and otherwise only per D12 C14 (28 of the last 90 days) | Enforced in service |
| Coupon and referral reward size | Yes, as a time/cohort test with locked terms (like prices) | Reward promised at issue time is honoured |
| Exam rules (timers, grace, autosave cadence, adaptivity routing, scoring tables) | **No** | D6 invariants; integrity; shadow-evaluate offline only |
| AI scoring prompts, rubrics, model/provider | **Not as a user-randomised experiment on the score shown.** Allowed as: offline gold-set comparison, then **shadow mode** (scored but not shown), then **canary** with sign-off where agreement is monitored (§10.4); users never get two different scores for one submission | G-02 mandatory |
| Refund policy, guarantee terms, legal text, consent banner choices, privacy copy | **No** | Compliance; banner changes need counsel review (no prominence tests that nudge consent) |
| Security controls (OTP TTL/length, rate limits, 2FA requirements, session lifetimes) | **No** | D7/D12 |
| Content correctness (answer keys, lesson content) | **No** | Corrections are releases, not tests (GA-044) |
| Accessibility features | **No** removal tests | Only additive variants |
| Anything for under-18 involving marketing, pricing or persuasion | **No** | D7 |
| Support SLAs and escalation | Internal process pilots only, not user-randomised | |

Review gate: every experiment has a one-page brief (hypothesis, primary metric, MDE, guardrails, sample size, duration, exposure %, allowed surface per table above, rollback). A second person (founder until the team grows) signs it before launch (NEW-ANL-12).

### 9.4 Pricing experiments - protocol that preserves "price shown = price charged"

**Rules (binding; cited by `08` pricing rules and `02` L7):**

1. **R-P1 One price per user per product at a time.** A user who has seen a price for a product is bound to it for **30 days** or until it ends in the user's favour (price lock, below). Two different prices are never shown to the same user, on any device, page, email, notification, checkout or invoice.
2. **R-P2 Shown = charged.** The quote at checkout uses the `price` row (`price_book`, `valid_from/valid_to`) that was displayed; the server stores `price_lock` and uses it for pricing and the order snapshot. No client-side price math (`08`).
3. **R-P3 Best price honoured.** If a user was exposed to price A and later the active price becomes lower (B < A) they pay B; if it becomes higher they keep A until the lock expires. A user never pays more than the lowest price they have been shown within the lock window.
4. **R-P4 No fake anchors.** `compare_at_minor` is null for products under test; no countdown timers; no "only N left" (D12 C14, `08`).
5. **R-P5 Vulnerable segments excluded:** minors, scholarship/access-programme recipients, org contracts, coupons/partner codes (their price books are separate), and **Region A** consumers (EU/UK personalised-pricing disclosure and consumer-law exposure; **[LEGAL]**). First tests run in **BD** and Region C only.
6. **R-P6 Disclosure.** Terms and the pricing page footer state "Prices may change over time and campaign prices apply while they last"; the privacy policy covers pricing analytics. **[LEGAL]**
7. **R-P7 Cap the delta:** variant prices within +/-15% of the control price (a larger swing is a repositioning decision, not a test).
8. **R-P8 Pre-registered and reversible:** brief approved, end date fixed, kill switch (set `valid_to` on the test price book rows); on end, locks run out naturally.

**Allowed designs (choose one; never concurrent random split of the same market):**

| Design | How | When | Assignment/consistency |
|---|---|---|---|
| **A. Time-split (ABAB blocks)** | Alternate price A and B in fixed blocks (e.g. 14 days each, A-B-A-B) for one market/product, same channels/spend, announced end dates; price is the same for everyone at a given time | Single-market BD tests (the L7 case: IELTS Complete BDT 3,990 vs 3,490) | Price is a function of time only, so every visitor sees one price; locks handle users who straddle a switch. Analyse with **revenue per visitor and per sign-up** by block, diff-in-diff against a control product or the prior-year seasonality proxy; check traffic mix balance (channel, device, exam-season weeks) |
| **B. Geo-split** | Different price books across *comparable* markets (e.g. two Region B countries, or two non-adjacent Region C countries), billing country determines region (D12 C16) | International tests; needs similar markets | Consistent by billing country, not IP alone; exclude BD/Region A from arbitrage-prone pairs (Region C price must stay >= BD effective price per `20` §5 conflict note) |
| **C. Cohort split with price lock** | Users whose first pricing-page view falls in sign-up week W get price set S(W); store `price_lock(user, product, price_id, locked_at, expires_at)`; rotate sets weekly | When time-split sample is too thin; lower-risk elasticity read | The lock guarantees consistency; because **concurrent users in the same market can see different prices** this design carries the highest consumer-fairness risk: allowed only after counsel sign-off and only within R-P3 and R-P7; must not be used in Region A |
| **D. Survey-based (no live price variation)** | **Van Westendorp Price Sensitivity Meter** (4 questions: too cheap, cheap/bargain, getting expensive, too expensive) and optionally Gabor-Granger on a sample of free-tier users and non-buyers; also conjoint-lite (choose tier at price) | Before any live test and for new products | In-app/email survey to consented users; n >= 150 per segment [A] (BD and international separately; Bangla and English instruments); results give the acceptable price range and optimal price point; report intersection points with bootstrap CIs |

Procedure for L7: (1) run Design D (Van Westendorp, BD students segment) in weeks 1-2 to bound the range; (2) run Design A with price A = 3,990 and B = 3,490 as two 2-week blocks each (8 weeks), no strike-through, same ad spend and channel mix, guardrails G-03/G-04; (3) decide on revenue per visitor and contribution margin (not conversion alone), because a lower price must raise volume enough to beat margin loss (AI/SMS/video COGS); (4) lock the winner as the new default price row and end test rows.

**Implementation requirements** (NEW-ANL-14, -15):
- `price.priceBook` values `exp-<key>-<variant>` for test sets; the active set for a request is resolved by `resolvePriceSet(user|visitor, product, region, now)`: lock -> else time/cohort/geo rule -> else `default`.
- New table `price_lock` (below) and `experiment_exposure`; cache keys for prices include `price_set_id` (the audit GA-043 "price-cache keys per variant") and revalidation tags per set; ISR/static pricing pages must not cache a price that is user-specific: when a test is active the pricing page is rendered dynamically or from a per-set cache keyed by the lock cookie.
- Emitted analytics: `pricing_viewed.price_set_id`, `checkout_started.price_set_id`, `order_paid.price_set_id`; never the price in free text, only `amount_minor` + `price_set_id`.
- E2E tests: (1) user sees price in pricing page, goes to checkout, pays: invoice and order equal displayed price; (2) switch the active set mid-session: the user keeps the locked price; (3) lower price later: user gets the lower; (4) two devices: same user same price; (5) strike-through never rendered during a test; (6) Region A and minors never receive a variant.

```ts
// packages/db/src/schema/analytics.ts (new, follows 05 conventions)
export const priceLock = pgTable('price_lock', {
  id: pk(),
  userId: uuid('user_id').references(() => user.id, { onDelete: 'cascade' }),            // null for pre-signup visitor locks
  visitorHash: char('visitor_hash', { length: 64 }),                                    // HMAC of strictly-necessary pricing cookie id; null once linked to user
  productId: uuid('product_id').notNull().references(() => product.id, { onDelete: 'cascade' }),
  priceId: uuid('price_id').notNull().references(() => price.id, { onDelete: 'restrict' }),
  experimentKey: text('experiment_key'),
  lockedAt: tstz('locked_at').notNull().defaultNow(),
  expiresAt: tstz('expires_at').notNull(),                                              // locked_at + 30 days
  ...timestamps(),
}, (t) => [
  uniqueIndex('price_lock_user_product_uq').on(t.userId, t.productId, t.lockedAt),   // 'one ACTIVE lock per user+product' is enforced in the service inside a transaction (Postgres cannot use now() in an index predicate)
  index('price_lock_visitor_idx').on(t.visitorHash, t.productId),
  index('price_lock_price_idx').on(t.priceId),
  check('price_lock_subject_chk', sql`${t.userId} is not null or ${t.visitorHash} is not null`),
]);
```

Note: "one active lock per user and product" is a transactional service rule (Postgres rejects `now()` in index predicates); NEW-ANL-14 acceptance covers the race.

The pricing-cookie for visitor locks is **strictly necessary** (it protects the "price shown = price charged" promise) and contains only a random id; it is not used for analytics.

### 9.5 Statistics rules of thumb

Scale reality (`02`: ~47,500 sign-ups in Year 1 base case; ~4% pay) means most tests must target **upstream, higher-base-rate metrics** (activation, first lesson, exam date set, reminder opt-in, click-through) and avoid purchase as the primary metric unless the effect is large.

1. **Sample size per arm for a conversion metric** (two-sided alpha 0.05, power 80%): `n ≈ 16 * p * (1 - p) / d^2`, where `p` is the baseline and `d` the absolute minimum detectable effect (MDE). Worked examples:

| Metric | Baseline p | MDE d (abs) | n per arm | Total for 2 arms | At ~900 sign-ups/week (Y1 base ~47.5k/yr) |
|---|---|---|---|---|---|
| Activation (K-02) | 0.35 | +3.0 pp | 16 x 0.35 x 0.65 / 0.0009 = **~4,050** | ~8,100 | ~9 weeks |
| Activation | 0.35 | +5.0 pp | ~1,456 | ~2,900 | ~3.2 weeks |
| Diagnostic start rate (page-level) | 0.12 | +1.5 pp | 16 x 0.12 x 0.88 / 0.000225 = **~7,500** | ~15,000 visitors | depends on traffic (days to weeks) |
| Paid conversion (K-07, 90 d) | 0.04 | +1.0 pp | 16 x 0.04 x 0.96 / 0.0001 = **~6,144** | ~12,300 sign-ups | ~14 weeks **plus 90 days** to observe the outcome |
| Email click rate | 0.05 | +1.0 pp | ~7,600 | ~15,200 sends | per campaign list size |

2. **Minimum detectable effect first:** write the MDE in the brief and cut the test if the required sample would take > 6 weeks (exceptions: price tests, which run on revenue per visitor with time blocks).
3. **Duration:** at least **two full weekly cycles** (BD usage is weekly-patterned and event-driven: exam dates, results days, salary/cash-flow periods, Eid and holidays); do not start across a known disruption (Eid, major exam dates, exam-event "mock test day" deploy freezes `11`); do not stop early because a dashboard turned green.
4. **One primary metric, <= 2 secondary, guardrails (§2.4):** no multiple-metric fishing. For > 2 variants use Holm correction or a prior-defined winner rule.
5. **Frequentist vs Bayesian:** PostHog Experiments defaults to Bayesian "chance to win" [V]; we adopt: ship when chance-to-win >= 95% on the primary **and** the planned sample/duration is reached **and** guardrails are non-inferior; "no significant difference" is a valid outcome (ship the cheaper/simpler variant). Report the effect with a 95% credible/confidence interval.
6. **Peeking:** allowed for guardrails and sample-ratio-mismatch checks only; decisions at the planned end.
7. **Sample-ratio mismatch (SRM):** chi-square on exposure counts per variant; p < 0.001 -> invalid, investigate (flag evaluation, consent differences, caching).
8. **CUPED / covariates** (optional later): use pre-period activity to reduce variance; not required at launch.
9. **Novelty/primacy:** for UI changes, compare week 1 vs week 2 effect; require stability.
10. **Segment analysis:** locale (bn/en), device, new vs returning are pre-declared slices; others are exploratory and labelled so. Never publish a segment win from a null overall without replication.
11. **Learner-outcome experiments** (e.g. study-plan variants vs mock score gain) need an ethics note: no variant may knowingly disadvantage learners' preparation; prefer opt-in studies and publish limitations. Band improvement cannot be a marketing claim from experiments without a methodology note (`02` AI trust rules).
12. **Record-keeping:** every experiment closes with a decision record in `docs/experiments/<key>.md` (hypothesis, design, result, decision, follow-up), indexed in the weekly review.

### 9.6 Flag and experiment lifecycle

`proposed -> brief approved -> built behind flag (0%) -> internal QA (staff only) -> ramp (5% -> 50% -> 100% of eligible) -> measurement window -> decision -> rollout winner via code change (flag removed) or revert -> cleanup PR within 14 days -> decision record`. Stale-flag lint: CI warns for experiment flags older than 60 days and fails at 90 days unless an owner extends with a reason. A flag's code paths must both be covered by tests.

## 10. AI-scoring quality analytics

### 10.1 What we are protecting

IDP advises against LLM grading, competitors publish no validation and tend to skew generous at high bands (`07` §7.1, `02` risk table). Our differentiator is **measured, published agreement with certified raters**, so quality monitoring is a product requirement, not a nice-to-have. K-14 target: >= 80% within 0.5 band (`02` §14).

### 10.2 Signals

| Signal | Definition | Source | Cadence |
|---|---|---|---|
| **Gold-set agreement (offline)** | On the frozen gold set (>= 200 adjudicated responses per task family, `07` §7.9): within-0.5 rate, QWK, MAE, mean signed error by band bucket; per prompt/model/rubric version | eval harness `packages/ai` (CI nightly on prompt change, weekly otherwise) | per change + weekly |
| **Production QA sample agreement** | The 5% of completed AI evaluations sent to human QA (`evaluation.quality-sample`, `06`) scored blind by a grader; metrics as above on the sample; report n and 95% CI (Wilson for the within-0.5 rate) | `evaluation_result` (ai vs human, `qa_sample=true`) | weekly |
| **Human-review delta** | For learner-requested human reviews (biased sample): distribution of (human - AI) | `evaluation_result` | weekly, labelled biased |
| **Grader override rate** | % of AI results overridden by graders and mean override magnitude | `grader_override_applied` | weekly |
| **Dispute rate** | `evaluation_disputed` / `evaluation_completed` by kind, and % upheld after review | events + DB | weekly |
| **Perceived accuracy** | `evaluation_rated` helpful share and reasons (`too_high`, `too_low`, ...) | events | weekly |
| **Band distribution drift** | Population stability index (PSI) of AI overall band distribution vs the baseline month and vs the human-scored distribution; mean band by task | `evaluation_result` | weekly; alert PSI > 0.2 |
| **Generosity at high bands** | Mean signed error for bands >= 7.0 (documented industry skew); alert if > +0.25 | gold + QA | weekly |
| **Test-retest stability** | Re-score 30 fixed canary essays/recordings daily at temperature settings used in prod; SD of overall band per item; alert if mean SD > 0.25 band | `packages/ai` canary job | daily |
| **Structural failure rate** | % of runs failing zod validation, needing repair, falling back to the secondary model, or hitting guardrails | `evaluation_failed`, adapter metrics | daily |
| **Latency and cost** | p50/p95 `latency_ms`; `cost_usd_micros` per kind vs planning ($0.06 writing, $0.20 full speaking test, D12 C9) | `evaluation_completed` | daily |
| **Language quality** | `bn` feedback helpfulness and `wrong_language` rate; exam quotes remain English | events | weekly |
| **Fairness slices** | Agreement and error by task family, **locale of feedback**, word-count bucket, ASR confidence bucket (speaking), and (where users opt in via the outcomes survey) self-reported L1/background - used for monitoring only, never for scoring | gold + QA | monthly |

### 10.3 Alerts and actions

| Condition | Severity | Action |
|---|---|---|
| Gold-set within-0.5 < 80% for any task family on a candidate prompt/model | blocker | Do not release; revert change |
| Production QA within-0.5 (rolling 200) < 80%, or lower bound of 95% CI < 75% | P2 | Academic lead investigates, consider switching badge to "beta" for that task (`31`), re-calibration |
| Mean signed error outside +/-0.25, or PSI > 0.2 | P2 | Drift investigation; pin model version; compare provider change logs |
| Dispute upheld rate > 20% in a week | P2 | Review rubric/prompt; sample reviews |
| Test-retest SD > 0.25 | P2 | Lower temperature/ensemble; recheck prompt |
| Structural failure > 2% in 1 h | P1 | Fallback provider switch (`LLM_PROVIDER_FALLBACK`), alert |
| Cost per eval > +25% of plan for 7 days | P3 | Review prompt length/model choice |

### 10.4 Release process for prompt/model changes (replaces user-randomised A/B on scores)

1. Offline gold-set evaluation passes (agreement >= control, non-inferior within a 2 pp margin, no worse bias at high bands).
2. **Shadow mode:** new version scores a copy in production (not shown) for >= 500 submissions per task family; compare to production version and to QA samples.
3. **Canary (optional):** 5% of new submissions get the new version (each submission has exactly one score; assignment sticky by `evaluation_id` hash); monitored for 7 days with G-02; roll forward only if non-inferior.
4. Record `prompt_version`, `model_id`, `rubric_version` in every result (already in `evaluation_result`) and in `evaluation_completed` events so every dashboard can slice by version.
5. The public accuracy page (`07` §7.9) is updated from the **gold set** only, with date, n and method; production QA numbers are monitoring.

### 10.5 Privacy for AI analytics

Essay text, transcripts and audio never enter PostHog. Calibration data use (disputes, gold set) requires the explicit `ai_processing`/calibration consent (`05` consent kinds; audio retention rule D12 C6). Analytics contain only bands (bucketed), ids (hashed), versions and counts.

## 11. Dashboards and the weekly business review

Each dashboard has an owner, an audience, and its metric definitions reference the KPI dictionary (§2.3). **P1 launch set** = dashboards 1-8 (the six in `11` §5.4 plus Support and Founder weekly); the rest follow in P2.

| # | Dashboard | Audience / owner | Key metrics and definitions | Source |
|---|---|---|---|---|
| 1 | **Acquisition** | growth | Sessions (consented) by channel group; visitor -> diagnostic start (K-03); tool usage (`tool_used`); sign-up rate by landing route/locale; CPL/CAC by channel (K-10, spend import); organic vs paid split; consent rate caveat | PostHog + `marketing_spend` + DB |
| 2 | **Activation** | product | Sign-up -> diagnostic/mock within 7 days (K-02); time to first value (K-24); onboarding step funnel; exam-date-set rate; first AI evaluation within 7 days; activation by entry path, locale, device | Postgres views + PostHog funnels |
| 3 | **Learning and engagement** | product / academic | WATL (K-01) and attempts per learner; lessons completed/learner/week; practice sessions; mistake-notebook resolutions; vocab sessions; plan adherence; completion (K-15); mastery changes by skill; lecture drop-off; D7/D30 return (K-21) | views + PostHog |
| 4 | **Exam reliability and integrity** | eng | Autosave success (K-25), attempt abandonment, interrupted/voided per 1,000, section expiry rates, timer-drift alarms, `autosave_failed` by network/device, p95 submit latency | server events, logs, Better Stack |
| 5 | **AI evaluation quality and cost** | academic / eng | K-14 by task family/version; within-0.5, QWK, signed error; PSI; dispute and override rates; helpfulness; latency p50/p95; failure/fallback rate; cost per eval (K-26); credits spend per learner | views + eval harness export |
| 6 | **Revenue and monetisation** | finance / founder | Net revenue (K-09), orders, AOV, paid conversion (K-07/K-08), payment success by provider/method (K-13), pricing -> checkout -> paid funnel (BD vs international), refund rate (K-12), revenue mix (K-18), gross margin (K-19), CAC (K-10), payback (K-11), renewal (K-22), coupon use, price-set breakdowns (experiments) | Postgres views + PostHog funnel |
| 7 | **Support and trust** | support | First response (K-17), resolution time, tickets per 100 active users, top categories (money deducted, OTP not received, mic permission, exam crashed), CSAT, "debited-no-access" open items and age (`payment_verifying -> reconciled`), NPS (K-16), help-article deflection | helpdesk export + events |
| 8 | **Founder weekly** | founder | One page: WATL trend, sign-ups, activation, paid conversion (provisional by cohort), revenue, refunds, CAC by channel, AI agreement, exam reliability, support SLA, top 3 experiments, cash gates progress (`02` §14) | all |
| 9 | **Messaging health** (P1 light) | lifecycle | K-27: sends/deliveries/bounces/complaints/unsubs per template; cap drops; SMS delivery/cost by operator; sequence conversion (onboarding D14 outcomes, abandoned checkout recovery) | `notification_dispatch`, `email_log`, events |
| 10 | **Live classes** (P1 pilot light; P2 full) | ops | Enrolled vs attended, on-time join, minutes watched, attendance >= 80% share (K-28), recording watch-through, make-up credits, speaking club no-shows, NPS per cohort, mentor load | attendance import / events |
| 11 | **Org / B2B** (P2) | account manager | Seats used, active members, assignments completion, cohort WATL, report exports, renewal risk (inactivity), usage by cohort | views + groups |
| 12 | **Content and item quality** (academic, from `07`) | academic | Item difficulty/discrimination, flagged items, report inbox, answer-key corrections, stale courses | item stats + events |
| 13 | **Experiments** | product / growth | Running experiments, exposure counts, SRM status, primary/guardrail status, pending decisions, results log | PostHog + `experiment_exposure` |
| 14 | **Web vitals and QoE** | eng | LCP/INP/CLS/TTFB by country (BD filter) and route group; video TTFF/stall rate by network | `web_vital_reported`, video events |

**Weekly business review (WBR) template** (30 minutes, Monday, owner: founder/product lead; document `docs/wbr/YYYY-WW.md`):

1. Scorecard (numbers only, last 8 weeks sparkline): WATL, sign-ups, activation (cohort-final vs provisional), paid conversion (cohorts with 7/30/90-day read), net revenue, refunds, CAC (blended + by channel), AI agreement, autosave success, support first response, complaint rate.
2. Gates: `02` §14 hiring/spend gates progress (conversion >= 3%, CAC <= BDT 1,800, refund < 5%, net revenue >= BDT 1M/month x 2).
3. Funnel diagnosis: the single worst-moving step this week, with segment cut and hypothesis.
4. Experiments: launched, concluded (decision), blocked.
5. Quality and risk: AI drift alerts, exam incidents, payment anomalies, privacy requests/SLA.
6. Customer voice: top 5 support themes, NPS comments (read verbatim from DB, not analytics).
7. Decisions and owners for next week (max 5).

Data hygiene rules for dashboards: always show denominator and date range; label provisional cohorts; separate BD/international; exclude internal users; consent-biased PostHog funnels carry the consent-rate banner (§8.3).

## 12. Data warehouse path, retention and deletion

### 12.1 Staged architecture

| Stage | Trigger | Setup |
|---|---|---|
| **S0 (launch)** | < ~5M events/month, one analyst | PostHog Cloud + `analytics` schema views in Neon via read-only role; PostHog data warehouse Postgres source [V] or Metabase OSS for finance/academic SQL dashboards; weekly CSV exports for spend |
| **S1** | Need cross-source joins (ad platforms, helpdesk, payments settlement), SQL on all events, or PostHog query limits | PostHog **batch exports** to **BigQuery** (`asia-southeast1`/Singapore) or S3/R2 + ClickHouse [V]; nightly Neon logical export of `analytics.*` tables (hashed ids only); dbt (OSS) models for marts (`fct_orders`, `fct_attempts`, `dim_user_hashed`) |
| **S2** | Data science needs (predictors, churn), > 50M events/month | Dedicated ClickHouse (self-hosted on Hetzner or ClickHouse Cloud) or stay on BigQuery; optional PostHog self-host is *not* recommended at this team size (ops burden) |

Data minimisation rules at every stage: only hashed ids; the mapping `analytics_id <-> user_id` is **computed** (HMAC) and requires the key, so it is not stored in the warehouse; no free text columns; access by role with audit; warehouse region and processor entries added to `docs/processors.md` (`09` §13.8) with DPAs (PostHog, Google Cloud if BigQuery).

### 12.2 Retention

| Data | Where | Retention | Notes |
|---|---|---|---|
| Raw events | PostHog | **12 months** (`11` §5.1); configure project data retention accordingly [V plan limit] | Longer-horizon KPIs use aggregates below |
| Session replay (marketing routes only) | PostHog | 30 days [A] | masked; sample 10% |
| Aggregate daily snapshots (counts by dimension, no ids) | Postgres `analytics.*_daily` + warehouse | Plan horizon (5 years) | Written nightly from views; allows 90-day-conversion history beyond 12 months |
| Cohort tables (hashed id, cohort week, conversion flags) | Postgres/warehouse | While the user exists; hashed rows removed on erasure | |
| `user_attribution` | Postgres | with user | removed on erasure |
| Experiment exposure ledger | Postgres | 24 months | hashed ids; deleted on erasure |
| `price_lock` | Postgres | expiry + 12 months for dispute evidence | user id nulled on erasure |
| Tier 0 aggregate events | PostHog | 12 months | no identifiers |
| `notification_dispatch` | Postgres | 13 months | per `29` |
| Item/AI evaluation analytics (versions, bands, costs) | `evaluation_result` | per `05`/`07` (audio 90 days; text per policy) | analytics reference ids only |
| DSAR export | generated | 24 h link (`09`) | |

### 12.3 Erasure and consent end-to-end

`privacy.deletion_requested` -> stop tracking; at execution `analytics.delete-person` (PostHog delete API by `analytics_id`), delete rows with `user_id`, tombstone the hashed id in the warehouse refresh list, aggregates stay (non-identifying). Backups: tombstone list re-applied on restore (`09` §13.9). Test quarterly with a synthetic user (extend the DSAR test): the PostHog person must be gone and no event with that id re-appears.

## 13. Instrumentation quality assurance

1. **Tracking plan as code:** `events.ts` + generated catalogue; PR template checks "metric/decision this event supports".
2. **Unit tests:** typed `track` rejects undeclared props; PII fixtures stripped; enum values validated.
3. **Contract test for server events:** each domain-event consumer emits the expected analytics event with the right idempotency key and exactly once on replay.
4. **E2E (Playwright):** with PostHog mocked at `/ingest`, assert expected events and properties for: guest diagnostic -> signup (stitching), Buy now -> `order_paid` after webhook, exam start/submit, AI evaluation, consent decline (no client SDK, Tier 0 only), minor account, consent withdrawal.
5. **Data tests (SQL):** nightly checks: no negative durations, no `order_paid` without matching `order.status='paid'`, event volume anomalies (> 3 sigma day-over-day), unknown event names (should be 0), PII regex scan on a sample of recent events (alerts on any hit), `$insert_id` duplicate rate.
6. **Reconciliation:** daily compare of PostHog `order_paid` (consented) with DB paid orders; ratio is the **consent coverage** for purchases; alert if the ratio drops sharply (tracking outage).
7. **Release health:** `release` property lets us diff funnels before/after deploys; experiment SRM checks daily.
8. **Quarterly taxonomy review:** remove events with no consumer, merge near-duplicates, verify naming; owner: product-analytics lead.

## 14. Backlog tasks (NEW-ANL-xx)

> **Final IDs: see 12 Appendix F.** The `NEW-*` IDs in this list are source IDs only; PROGRESS.md and the build loop use the final P0/P1/P2/P3 IDs (or `BG-xx` human gates) given there. Do not rewrite this list.

Format as in `12` §11 (ID, title, phase, owner model per D9, dependencies, acceptance). `P1-44` ("PostHog events and funnels") is **superseded in scope** by NEW-ANL-01..09; `P0-41` (PostHog setup) is a dependency.

| ID | Title | Phase | Owner | Depends | Acceptance criteria |
|---|---|---|---|---|---|
| NEW-ANL-01 | Typed event map `packages/core/src/analytics/events.ts` with required/optional props, enums, versions; generator for `docs/generated/event-catalogue.md` | P0 | sonnet | P0-41 | Undeclared event/prop fails typecheck; catalogue regenerates in CI; all events in §5 present |
| NEW-ANL-02 | `track()` server/client wrappers: allow-list, PII scrubber, `$insert_id`, async flush, `consent_tier`, super properties | P0 | sonnet | NEW-ANL-01 | PII fixtures stripped; server flush in serverless works (test); drops logged `analytics.pii_dropped` |
| NEW-ANL-03 | `analytics_id()` HMAC function (TS + SQL), `ANALYTICS_ID_KEY` env, identify/reset rules, shared-device flag | P0 | sonnet | NEW-ANL-02 | Same id from TS and SQL for fixtures; reset on sign-out tested; no raw UUID ever sent (test greps payloads) |
| NEW-ANL-04 | `analytics` schema + read-only role `lumen_readonly`; views K-01, K-02, K-04..K-07, K-09, K-12, K-13, K-15, K-17..K-19, K-22..K-24 (§2.5) + `internal_user` table | P1 | sonnet | `05` tables | Views return fixture-expected numbers in tests; role cannot read base tables |
| NEW-ANL-05 | Consent tiers: Tier 0 allow-list, SDK gating, consent-rate aggregate, withdrawal behaviour, minors rule | P1 | sonnet | P1-42 (cookie consent) | E2E: decline -> no client SDK, only Tier 0 server events; accept -> identified events; minor default off |
| NEW-ANL-06 | Domain-event mappers (`analytics.track`, `track-purchase`, `identify`) per §5.12 with idempotency | P1 | sonnet | NEW-ANL-02, `06` events | Replay of outbox events yields one analytics event each; `order_paid` only from verified `order.paid` |
| NEW-ANL-07 | Client instrumentation: `page_viewed`, `cta_clicked`, `pricing_viewed`, `paywall_*`, `web_vital_reported`, `autosave_failed`; `/ingest` proxy | P1 | sonnet | NEW-ANL-05 | Events appear in staging PostHog with required props; ad-block fallback verified; no autocapture |
| NEW-ANL-08 | Guest diagnostic stitching (`__Host-diag`, `linkGuestDiagnostic`, `diagnostic_linked`) | P1 | sonnet | `03` diag AC, NEW-ANL-06 | E2E §7.2.7 passes incl. cross-device case in DB; no result payload before auth |
| NEW-ANL-09 | Launch dashboards 1-8 in PostHog/Metabase with definitions text and owners; WBR template doc | P1 | haiku draft + human review | NEW-ANL-04, 06, 07 | Every tile cites a K-id; internal users excluded; consent caveat banner present |
| NEW-ANL-10 | `marketing_spend` table + weekly CSV import page (growth) and CAC view | P1 | sonnet | NEW-ANL-04 | Import validates currency/channel; K-10 reproduces a hand-computed sample |
| NEW-ANL-11 | Nightly data tests (§13.5) and PostHog-vs-DB purchase reconciliation alert | P1 | sonnet | NEW-ANL-06 | Alerts fire on injected anomalies; PII scan finds seeded email |
| NEW-ANL-12 | Experiment framework: PostHog experiment wiring, server-side flag evaluation helper, `experiment_exposed`, SRM check job, brief template + registry `docs/experiments/` | P1 | sonnet | NEW-ANL-07 | Sticky variant across devices for signed-in user (E2E); non-consenting visitor gets control and no exposure event; SRM job flags a seeded imbalance |
| NEW-ANL-13 | Message analytics: `message_*` events from `notification_dispatch`/webhooks; click attribution window; messaging dashboard (9) | P1 | sonnet | NEW-NOTIF-04 (`29`) | Counts match ledger; no address/phone in events |
| NEW-ANL-14 | Price-experiment engine: `price_lock`, `resolvePriceSet`, price-set cache keys/tags, strike-through ban during tests, Region A/minor exclusion | P1 gate (before L7) | sonnet + founder review | `05` price tables, `08` rules | E2E R-P1..R-P5 scenarios (§9.4) pass; invoice equals displayed price; lock logic transaction-safe (no `now()` index predicate) |
| NEW-ANL-15 | Pricing research kit: Van Westendorp survey (bn/en), analysis notebook/SQL, consent text | P1 | haiku draft + human | NEW-ANL-12 | Survey instrument reviewed by native reviewer; analysis reproduces PSM intersections from sample data |
| NEW-ANL-16 | Counsel review pack: consent tiers, Tier 0 basis, pricing tests (R-P5/P6), DSAR for analytics | P1 gate | founder + counsel | NEW-ANL-05, 14 | Written sign-off recorded in `docs/legal/` before first price test and before relying on Tier 0 |
| NEW-ANL-17 | DSAR/erasure for analytics: `analytics.delete-person`, export of person events, warehouse tombstones, quarterly test | P1 | sonnet | `09` DSAR job | Synthetic user purge verified; export contains properties only |
| NEW-ANL-18 | AI quality analytics: `qa_sample` flag, `v_ai_agreement`, QWK/Wilson CI job, drift (PSI), test-retest canary, alerts (§10.3), dashboard 5 | P1 | sonnet | `07` §7.9 harness | Alert test: injected bias triggers P2; CI reports on gold set; versions sliceable |
| NEW-ANL-19 | Shadow/canary scoring mode for prompt/model releases (assignment by `evaluation_id`, no dual scores shown) | P1 | sonnet | NEW-ANL-18 | A submission always has exactly one displayed score; shadow results stored for comparison |
| NEW-ANL-20 | Live-class analytics (attendance import in P1 pilot; events in P2) + dashboard 10 | P1/P2 | sonnet | `18`, ops sheet | Attendance >= 80% share matches ops sheet within 1% |
| NEW-ANL-21 | Support analytics: helpdesk webhook -> `ticket_*` events, SLA view, "debited-no-access" aging view | P1 | sonnet | GA-003 decision | K-17 view matches helpdesk export sample |
| NEW-ANL-22 | Org/B2B and guardian analytics (groups, usage, report exports) | P2 | sonnet | P2 org features | Group analytics by `org_id_hash`; no member PII |
| NEW-ANL-23 | Server-side ad conversions (Meta CAPI / Google) behind consent and flag | P2 | sonnet | NEW-ANL-05 | Only consented, hashed-per-vendor-spec identifiers; flag-controlled |
| NEW-ANL-24 | Warehouse stage S1: PostHog batch export -> BigQuery (or R2/ClickHouse), dbt marts, tombstone refresh | P2 | sonnet | trigger criteria §12.1 | Marts rebuild nightly; hashed ids only; erasure tombstones applied in a test |
| NEW-ANL-25 | Quarterly taxonomy review process and stale-flag lint | P1 | haiku | NEW-ANL-01, 12 | CI warns > 60 d, fails > 90 d for experiment flags; review checklist doc |
| NEW-ANL-26 | Fix doc conflicts Y1-Y7 (edit `11` §5.4 identity and attempt `mode/scope`, `02` L7, `07` §7.9 pointer, change-log line in `00`) | P0 | haiku | none | Greps pass; `00` change-log updated |

## 15. Open questions

1. Is the Tier 0 aggregate basis acceptable under PDPO and under GDPR/ePrivacy for EU/UK visitors, or should EU/UK be fully opt-in with no server aggregates? **[LEGAL]**
2. PostHog region (EU vs US cloud) and whether the PostHog Postgres data-warehouse source is available on the chosen plan [V]; otherwise Metabase for SQL dashboards.
3. Cohort price tests (Design C) are the fairest read of elasticity but the riskiest for fairness; default stance here is "time-split plus survey first". Founder decision whether Design C is ever allowed in BD.
4. Whether to send hashed identifiers to ad platforms (P2) at all, given minors and the consent model.
5. Whether human QA sampling can reach statistical power (about 200 samples per task family per quarter at 5% sampling needs about 4,000 completed evaluations per family per quarter); otherwise raise the QA rate for the first 90 days.
6. Do we publish live production agreement (not only the gold set) on the accuracy page, and at what cadence?
