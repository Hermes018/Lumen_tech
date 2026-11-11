# 30 — Finance, Tax & Payouts Operations

> Status: draft v1, 2026-11-07. Resolves audit findings **GA-008** (creator/grader payouts), **GA-011** (reconciliation, close, VAT/Mushak, repatriation), the finance half of **GA-025** (chargebacks) and the reconciliation gap in `06` (`reconcile-payments` only handles pending payments).
> Conforms to `00-DECISIONS.md` (D4 `finance` role, D5 commerce, D10 tiers, D12 C19 creator pay, C13 Progress Promise, C16 regions). Extends `10-PAYMENTS-VIDEO-INTEGRATIONS.md` §2.7, §2.8, §5.5–5.6, §6 and `05-DATABASE.md` §4.8 (commerce tables). Where a number conflicts, `00` wins, then `05`, then this file.
> Author stance: fintech-ops controller. This is an **operating manual draft, not tax or legal advice**.

## 0. Reading rules

**Every tax, legal, regulatory or accounting-standard figure in this document is a planning placeholder. Each one carries the tag `[VERIFY-CA]` = "verify with a chartered accountant (and, where marked, the authorised-dealer bank or NBR/Bangladesh Bank text) before relying on it".** Tags used:

| Tag | Meaning |
|---|---|
| `[V]` | Appears in the repo research notes (`payments_video_security_compliance.md`: Finance Act 2026 via PwC, Bangladesh Bank FEPD circular of 30 Jul 2026, SSLCommerz pricing page). Still `[VERIFY-CA]` before filing anything. |
| `[U]` | Not found in any note; background knowledge or a design assumption. |
| `[P]` | Planning default chosen here; change freely. |
| `[VERIFY-CA]` | Must be confirmed by the accountant. Never ship a fixed rate or deadline into code as a constant: every tax rate, threshold and deadline lives in `app_setting` / `finance_setting` and is changed by finance, not by a deploy. |

Money conventions follow `05` §1: `amount_minor bigint` + `currency char(3)`; BDT poisha, USD cents; percentages in `*_bps`; fiscal year **1 July to 30 June** `[VERIFY-CA]`, stored as the start year (`05` `invoice_counter.fiscal_year`). All calendar days and cut-offs are **Asia/Dhaka**.

### 0.1 Principles

1. **The database ledger is the book of first entry for sales; the accountant's system (Tally / Xero / Zoho Books `[U]`) is the book of record.** P1 does not try to be an accounting package. It produces correct, immutable journals and monthly exports; the accountant imports or re-keys summaries.
2. **Every money movement has exactly one source row** (`order`, `payment`, `refund`, `settlement_line`, `payout_statement`) and produces balanced journal entries. No journal without a source reference.
3. **Append-only.** Corrections are reversing entries, never edits (mirrors `audit_log` D7).
4. **Four eyes** on money leaving the business: refunds above threshold (`10` §2.8), payouts (this doc §10), manual journals, period close.
5. **Reconcile in tiers**: system integrity (daily) → provider ↔ system (daily/weekly) → provider ↔ bank (weekly/monthly) → ledger ↔ accountant (monthly).
6. **Do not collect what you cannot account for.** Launch gate (§17): live SSLCommerz keys are not issued to production until the accountant signs the invoice template and VAT position.

---

## 1. Operating model and roles

| Role / person | Does | Tooling |
|---|---|---|
| `finance` (platform role, D4; 2FA mandatory) | Daily checks, uploads settlement files, prepares payouts, refunds up to threshold, month-end pack | `/finance/**` console (D2 `(staff)` group) |
| `admin` / `super_admin` | Second approver for refunds > threshold, payout approval, period close sign-off | `/admin/**` |
| Founder | Final owner of tax filings, bank mandates | bank portal (not shared) |
| External chartered accountant (CA) | CoA, tax position, VAT returns, income-tax returns, audit-ready books | Shared drive + monthly pack |
| Bookkeeper (part-time, Year 1) `[P]` | Imports monthly pack, bank feeds, payable runs | Accounting software |
| `support` | Never touches money; raises `finance_alert` tickets with order numbers | Helpdesk (27) |

Segregation rule: the person who **prepares** a payout run is not the person who **approves** it; the approver is not the payee. With a one-person founder team in the first months, the CA or a second director is the approver of last resort (bank mandate requires two signatures/OTPs for transfers above `[P]` BDT 50,000).

---

## 2. Chart of accounts (sketch)

Numbering: 1xxx assets, 2xxx liabilities, 3xxx equity, 4xxx revenue, 5xxx cost of revenue, 6xxx operating expense, 7xxx other. Names are English; the accountant may localise or renumber. Accounts marked **(S)** are system accounts that the platform posts to automatically (§4); the rest are posted by the accountant/bookkeeper.

### 2.1 Assets

| Code | Account | Notes |
|---|---|---|
| 1010 | Bank — operating BDT (main) | Receives SSLCommerz settlements, bKash/Nagad settlements |
| 1020 | Bank — FX / ERQ account USD `[VERIFY-CA]` | Receives Paddle/Payoneer payouts; retention quota §12 |
| 1030 | Bank — payouts BDT (optional sub-account) | Funded monthly for creator/grader payouts |
| 1110 | **Gateway clearing — SSLCommerz (S)** | Debit on `payment.succeeded` (gross); credit on settlement (net + fee) |
| 1120 | **Gateway clearing — bKash direct (S)** | P2 |
| 1130 | **Gateway clearing — Nagad direct (S)** | P2 |
| 1140 | **MoR receivable — Paddle (S)** | Debit on sale (gross of Paddle fee, ex-tax per accountant decision §3.6); credit on payout |
| 1150 | MoR receivable — Stripe (foreign entity, if used) | Intercompany treatment if a US LLC is used `[VERIFY-CA]` |
| 1160 | Wallet balance — Payoneer `[U]` | If used as withdrawal rail |
| 1210 | Unmatched receipts — suspense (S) | Settlement lines with no order; target balance 0 at close |
| 1220 | Instalment receivable (S) | bKash instalments for Live/Mentor (D10), see §3.7 |
| 1230 | Prepaid expenses | Annual SaaS (Vercel, Neon), domain |
| 1240 | VAT input credit `[VERIFY-CA]` | Only if registered and input credit allowed on the supply type |
| 1250 | Advance income tax / tax deducted at source on our receipts `[VERIFY-CA]` | If gateway/MFS withholds tax on settlements |
| 1310 | Capitalised content (video/curriculum) | Only if the CA elects capitalisation of work-for-hire assets; otherwise expense (§3.9) |
| 1410 | Equipment | Laptops etc. |

### 2.2 Liabilities

| Code | Account | Notes |
|---|---|---|
| 2010 | Accounts payable — vendors | |
| 2020 | **Payouts payable — creators/graders/item writers (S)** | Accrued at statement approval; cleared on payment |
| 2030 | Royalties accrued (not yet statemented) (S) | Monthly accrual from net sales (§10.3) |
| 2110 | **Deferred revenue — courses & passes (S)** | Straight-line schedules (§3.2) |
| 2120 | **Deferred revenue — mock packs / test passes (S)** | Until mock consumed or entitlement expires |
| 2130 | **Deferred revenue — AI credits (S)** | Until consumed/expired |
| 2140 | **Deferred revenue — Live / Mentor (S)** | Ratable over term / sessions |
| 2150 | Deferred revenue — books/physical (S) | Until delivery |
| 2160 | Customer credits and gift balances | Support-granted store credit, if any |
| 2210 | **VAT payable (output) (S)** | 15/115 of inclusive BD sales `[V]` `[VERIFY-CA]` — liability at tax point, not at revenue recognition (§8.2) |
| 2220 | VAT payable — reverse charge on imported services `[V]` | 15% on foreign SaaS/AI spend, deposited at remittance |
| 2230 | Turnover tax payable `[VERIFY-CA]` | Only if turnover-tax regime applies (§8.5) |
| 2240 | Tax deducted at source — payable to NBR (S) | On contractor/royalty payouts (§9) |
| 2250 | VAT deducted at source (VDS) payable `[VERIFY-CA]` | If we are a designated withholding entity |
| 2310 | Refunds payable | Approved but unpaid refunds |
| 2320 | Chargeback/dispute reserve (S) | Held amounts under dispute |
| 2330 | Provision — Progress Promise (re-enrolment) | Estimated cost of free re-enrolments (§3.8) |
| 2410 | Accrued expenses | |
| 2510 | Loans / shareholder loans | |

### 2.3 Equity

3010 Share capital · 3020 Retained earnings · 3030 Current-year result.

### 2.4 Revenue (all net of VAT, net of discounts)

| Code | Account |
|---|---|
| 4010 | Course revenue — BD (recorded ratably) |
| 4020 | Pass revenue — BD |
| 4030 | Mock/test pack revenue — BD |
| 4040 | AI credit revenue — BD (consumption + breakage) |
| 4050 | Live batch & Mentor revenue — BD |
| 4060 | Books & physical goods — BD |
| 4070 | B2B / institution seat revenue |
| 4110 | International revenue — via MoR (Paddle/Stripe) (gross ex-tax, §3.6) |
| 4210 | Admissions / counselling services (21) |
| 4310 | Breakage (expired unused credits/mocks) |
| 4910 | **Contra: discounts and coupons** (if gross presentation chosen; else net) |
| 4920 | **Contra: refunds and credit notes** |
| 4930 | **Contra: scholarships (access programme)** |

### 2.5 Cost of revenue (5xxx) — variable cost that scales with sales

| Code | Account |
|---|---|
| 5010 | Payment gateway fees — SSLCommerz (2.5% `[V]` + VAT/other charges on fee `[U]`) |
| 5020 | Payment gateway fees — bKash/Nagad direct |
| 5030 | MoR fees — Paddle (≈5% + $0.50 `[U]`) / Stripe |
| 5110 | **AI inference — LLM** (Anthropic/Gemini) — from `evaluation_result.cost_micros` |
| 5120 | **AI inference — speech-to-text** (Deepgram/Whisper) |
| 5210 | Video delivery & storage (Bunny, R2) |
| 5310 | Instructor royalties (10% of net on own course, D12 C19) |
| 5320 | Grader / rater fees (human review, §10) |
| 5330 | Live class delivery (Zoom, instructor session fees) |
| 5410 | Chargebacks and disputes (lost) |
| 5510 | Printing and shipping (books) |
| 5610 | Scholarship cost memo — **off-ledger** (see §3.10; zero-value accounts have no entry) |

### 2.6 Operating expense (6xxx) and other (7xxx)

6010 Salaries & benefits · 6020 Contractors — content production (work-for-hire per asset, D12 C19) · 6030 Contractors — engineering/design · 6040 Marketing (paid) · 6045 Affiliate commissions · 6050 Gold-set/rater programme (31) · 6110 Hosting & SaaS (Vercel, Neon, Sentry, PostHog) · 6120 Legal & professional (CA, lawyer) · 6130 Bank charges · 6140 Telecom/SMS OTP · 6150 Rent/co-working · 6160 Foreign remittance charges · 6170 Reverse-charge VAT not creditable `[VERIFY-CA]` · 6910 Depreciation · 7010 FX gain/loss (realised) · 7020 FX gain/loss (unrealised, month-end revaluation of USD balances) · 7030 Interest · 7110 Income tax expense `[VERIFY-CA]`.

### 2.7 Dimensions (tags on every journal line)

`product_kind` (D5 enum), `sku`, `region` (`BD`/`A`/`B`/`C`), `provider`, `exam` (`ielts_academic`, `ielts_gt`, `gre`, …), `tier` (`free/core/plus/live/mentor/pass`), `course_id`, `instructor_profile_id` (royalty base), `cohort_id`, `org_id`, `campaign`/`coupon_id`/`affiliate_id`. Dimensions are columns on `ledger_entry` (§15), not separate accounts, so the CoA stays short.

---

## 3. Revenue recognition policy (draft for CA approval)

The platform sells access to a service over time, consumable credits, and some one-off deliverables. Bangladesh follows IFRS-based standards (BFRS/IFRS 15 principles `[VERIFY-CA]`). Draft policy below; the **accountant must confirm each row, especially whether a simpler "recognise on activation" policy is acceptable for a small private company** (the tax authority may also look at invoice/cash date, which is separate from book revenue, §8.2).

### 3.1 Summary table

| Product (D5) | Performance obligation | Recognition | Deferred account | Trigger data |
|---|---|---|---|---|
| `course` Core/Plus (access 6 months, D10) | Stand-ready access to content + practice bank + allowance | **Straight-line, daily, over `entitlement.starts_at → ends_at`** | 2110 | `entitlement` row |
| `pass` 1/3/6/12 months | Stand-ready all-access | Straight-line over pass period; international auto-renewal each period separately | 2110 | `entitlement` |
| `bundle` | Multiple items | Allocate transaction price across components by relative standalone selling price (price book, 17); then each component's rule | per component | `order_item.product_snapshot.grants` |
| `test_pack` (N mocks) | Each mock sat | **On mock consumption** (`entitlement_use` row, per distinct form); unused remainder at entitlement expiry = breakage | 2120 | `entitlement_use`, expiry |
| `ai_credits` (standalone SKU) | Each evaluation | **On consumption** (`ai_credit_ledger.reason='consume'`); unused at credit expiry = breakage; failed jobs (`refund_return`) reverse the recognition | 2130 | `ai_credit_ledger` |
| Allowance credits **inside** a tier/pass | Part of the access promise | Not separately recognised (immaterial) — price is allocated entirely to access (§3.4); **CA to confirm** | n/a | n/a |
| `live_batch` (12-wk or 4-wk crash) | Cohort classes + feedback | Straight-line over batch start→end (or per session delivered when attendance data exists, P2) | 2140 | `cohort` dates |
| Mentor 1:1 | Named-mentor sessions + access | Ratable over term; when sessions are prepaid in fixed number, recognise per session delivered `[P]` | 2140 | session log (18) |
| Human review pack (add-on) | Each review | On `evaluation_result(source='human')` completion; expiry = breakage | 2130 | `evaluation_request` |
| Books / printed bundles (P2) | Delivery of goods | On delivery (courier proof), COGS at same time | 2150 | shipment status |
| `org_seat_pack` (B2B) | Seat access for period | Straight-line over seat period; unused seats are not refunded (per contract) | 2110 | `seat_allocation`, `entitlement` |
| Admissions services (21) | Per milestone / session | On delivery of milestone | 2140 | counsellor log |
| International sale via MoR | Same obligations as above | Same rules, measured on the amount Lumen is entitled to (§3.6) | per type | Paddle webhooks |

### 3.2 Straight-line schedules

At `fulfilOrder` (the single choke point, `10` §2.6) the platform creates one `revenue_schedule` row per recognisable order line with: `net_recognisable_minor` (after VAT, after discounts), `start_date`, `end_date`, `method` (`straight_line_daily` | `on_consumption` | `on_delivery`), `currency`, `fx_rate_at_sale`. A nightly Inngest job `recogniseRevenue` (Asia/Dhaka 02:30) posts journals:

```
Dr 2110 Deferred revenue — courses & passes     X
  Cr 4010/4020 Revenue                                X       (daily slice = net / days in period)
```

Rules:
- Slice = `net_recognisable_minor / total_days`; the last day takes the rounding remainder.
- Stacked entitlements (extension rows, `05` entitlement doc) are separate schedules; no re-forecasting.
- **Early revocation** (fraud, chargeback lost, refund): stop schedule, release unrecognised deferred balance against the refund/credit note (§11).
- **Support extension (≤ 7 days, D4)** is a goodwill extension: no new schedule, the existing schedule is not stretched (immaterial). Longer extensions requested as goodwill by admin create a note, not revenue.
- Refund-window caution: D5 allows refunds within 7 days if < 20% consumed. The straight-line method recognises ~4% in the first week of a 6-month course, so refund reversals are small. `[VERIFY-CA]` whether the CA prefers to delay recognition until day 8.

### 3.3 Consumption-based (mocks, credits)

`recogniseConsumption` runs hourly: for each new `entitlement_use` (mock started) or `ai_credit_ledger` consume row, release `unit_value_minor` from deferred to revenue. `unit_value_minor` = relative standalone selling price per unit at sale, stored on `revenue_schedule.unit_value_minor`. Credits are pooled (`ai_credit_ledger` is per user, not per purchase): consumption is allocated **FIFO to purchased credits first, bonus/free credits carry zero deferred value** `[P]`.

**Breakage.** Today D5 states no expiry for credits. Unlimited-life credits leave a permanent liability and a shadow obligation. **Decision required (OQ-F1):** credits and mock packs expire 12 months after purchase `[P]` (Terms must say so — coordinate with 26; consumer-protection treatment `[VERIFY-CA]` / lawyer). Breakage is recognised at expiry (account 4310) on a daily sweep `expireCredits`. Until the decision is made, finance reports the liability and recognises breakage **never** (conservative).

### 3.4 Allowances inside tiers

Core/Plus/Live tiers include AI allowances and mocks in the price (D10). Allocating price to each component adds bookkeeping without changing the monthly total materially. Draft policy: **treat tier allowances as part of the access service and recognise ratably** (single performance obligation: access + usage up to caps). Pass allowances (6 writing + 2 speaking per month, no rollover `[02 §7.2]`) are covered identically. The standalone-price SKUs (`ai_credits`, `test_pack`) are consumption-based. `[VERIFY-CA]` — if the CA requires a split, `revenue_schedule` already supports multi-line allocations per `order_item`.

### 3.5 Discounts, coupons, affiliates

- **Coupon/campaign discount**: reduces the transaction price. Revenue is recognised **net of discount**; the discount never appears as marketing expense. `order.discount_minor` and `order_item.discount_minor` are the source. Presentation: net (default). Gross + contra 4910 is available if the CA prefers.
- **Affiliate commission** (P2): an expense (6045) accrued when the order is paid, reversed on refund within the hold window. Not a reduction of revenue (the affiliate is a vendor). Whether to capitalise as contract-acquisition cost: practical expedient = expense immediately where amortisation period ≤ 12 months `[VERIFY-CA]`.
- **Free trials / free tier**: no revenue, no journal. Cost of free AI shows up in 5110 (it is real COGS; track "free-tier AI cost" as a KPI, §14).
- **Compare-at price (D12 C14)** is display only; no accounting effect.

### 3.6 International (MoR) sales

Lumen is **not** the seller of record when Paddle is MoR (Paddle resells and remits consumer tax) `[V]`. Accounting options, **to be decided by the CA once the Paddle contract and entity are known**:

| Option | Revenue = | Fee treatment | Comment |
|---|---|---|---|
| A (default draft) | Customer price excl. tax (gross of Paddle fee) | Paddle fee to 5030 | Shows true gross margin; requires MoR statement to split fee |
| B | Net payout from Paddle | No fee line | Simpler; understates gross sales |

Order-time journal: `Dr 1140 MoR receivable (net payout expected) + 5030 fee / Cr 2110… (deferred)`; consumer tax collected by MoR never touches our books. Payout day: `Dr 1020 Bank USD / Cr 1140`. FX: the deferred balance is a non-monetary liability fixed at the sale-date rate; the receivable is monetary and revalued at month-end (7020) and realised at receipt (7010) `[VERIFY-CA]`. Store `fx_rate` at sale from the Bangladesh Bank/own-bank rate `[P]` (a daily `fx_rate` table; source and rule to be set by CA).

If Stripe via a foreign (e.g. US LLC) entity is used instead, the structure becomes intercompany: the foreign entity is the seller; Lumen BD earns a service/licence fee. That requires transfer-pricing and BB treatment advice **before** being implemented `[VERIFY-CA]`.

### 3.7 Instalments (D10 Live/Mentor, 2–3 parts via bKash)

Revenue follows delivery as in §3.1 irrespective of cash. Journal on first instalment: `Dr Clearing + Dr 1220 Instalment receivable (remaining instalments) / Cr Deferred revenue + VAT payable`. **Policy decisions needed (cross-ref GA-002, doc 26):** access gating on missed instalment (recommend: Live access paused after 7 days overdue; no refund of paid instalments for consumed time), collection method (bKash tokenised agreement P2 vs manual link P1), bad-debt writeoff after 90 days `[P]`. VAT point-of-tax on instalments `[VERIFY-CA]` — if VAT is due on invoice issue, a single invoice for the full amount with an instalment schedule appended creates VAT liability on cash not yet received; the CA must choose between single invoice and invoice-per-instalment.

### 3.8 Progress Promise (Mentor, D12 C13)

The promise is free re-enrolment (no cash). It is a conditional obligation, not a refund. Draft treatment: recognise a **provision (2330)** equal to `expected_claim_rate × marginal cost of re-enrolment` (marginal cost ≈ delivery + AI + grader time; not list price). Planning `expected_claim_rate = 15%` `[P]`, refreshed quarterly from `guarantee_claim` data (05). When a claim is approved, a zero-price order (`source='promo'`, reason `progress_promise`) is created and the provision is released against its marginal cost. `[VERIFY-CA]` whether the promise instead requires deferring part of the original price as a separate performance obligation.

### 3.9 Content production cost (work-for-hire, D12 C19)

Per-asset payments to contractors (video, item writing, lesson writing) are **expensed** (6020) in P1 `[P]`; capitalisation as an intangible asset is a CA/auditor decision, relevant mainly if investors want EBITDA presented gross of content spend. Keep per-asset `payout_statement_line.asset_ref` (course_id / question set / lesson) so that capitalisation can be applied retroactively without re-collecting data.

### 3.10 Scholarships and access programme (D10)

| Case | Accounting |
|---|---|
| 100% scholarship (free access) | No revenue, no invoice, no VAT. Entitlement `source='promo'`/`free` with `scholarship_id`; reported in the **access programme report** at list value (off-ledger memo, not a journal) |
| 50–99% scholarship | Order at the discounted price; revenue net; discount is a price reduction (not marketing); VAT on the discounted amount |
| Donor/partner-funded (NGO, UDC, TTC codes) | If the partner pays Lumen: revenue (B2B, 4070) with partner invoice; learner entitlement `source='org_seat'`/`promo` |
| Lumen-funded cohort | Memo only; may be tracked as marketing/CSR budget for management reporting |
| Verified-need evidence | Stored under `scholarship_award` (new, §15.5); no document images in the finance console |

Cap and approval: `scholarship_budget_minor` per quarter `[P]`, enforced by the service; each award approved by `admin` + logged. Tax: whether free supplies trigger deemed-supply VAT `[VERIFY-CA]` (generally gifts of services could be deemed supply in some regimes).

---

## 4. Automated journal postings (what the platform writes)

All postings are produced by `packages/core/src/finance/posting.ts` in the **same DB transaction** as the business event and carry `source_type`/`source_id` (idempotency key = `source_type:source_id:posting_kind`).

| Event | Journal (BD, VAT-inclusive 15% `[V]`) |
|---|---|
| `payment.succeeded`, order total T incl. VAT | `Dr 1110 Clearing T / Cr 2110 Deferred (T×100/115) / Cr 2210 VAT payable (T×15/115)` |
| Daily recognition | `Dr 2110 / Cr 4010…` (§3.2) |
| Settlement line (gross G, fee F, net N=G−F) | `Dr 1010 Bank N + Dr 5010 Fee F / Cr 1110 Clearing G` |
| Settlement receipt with withheld tax W `[VERIFY-CA]` | `Dr 1250 W` added to the debit side |
| Refund approved A (full) | `Dr 4920 contra (or 2110 for unrecognised part) + Dr 2210 VAT (A×15/115) / Cr 2310 Refunds payable A` |
| Refund paid | `Dr 2310 / Cr 1010 or 1110` (via gateway clearing if deducted from settlement) |
| Credit note issued | Mirrors refund journal; carries `invoice_id` (credit note number, Mushak 6.7 `[U]`) |
| Chargeback received | `Dr 2320 Reserve / Cr 1110` ; lost: `Dr 5410 + 2210 portion / Cr 2320` |
| AI evaluation completed | `Dr 5110/5120 AI cost (cost_micros) / Cr 2410 Accrued expenses` (monthly true-up vs vendor invoices) |
| Payout statement approved | `Dr 5310/5320/6020 / Cr 2020 Payouts payable + Cr 2240 TDS payable` |
| Payout paid | `Dr 2020 / Cr 1030 Bank` |
| Expiry of credits | `Dr 2130 / Cr 4310` |

Rounding: VAT extracted from an inclusive price is `round(T×1500/11500)` poisha (half-up) per line; the line sum may differ from the invoice total by ≤ 1 poisha, absorbed in revenue. Invoice and journal use the **same function** (`vatFromInclusive`) to avoid drift.

---

## 5. Reconciliation procedures

### 5.1 Tier model

| Tier | Compares | Cadence | Owner | Output |
|---|---|---|---|---|
| T0 Integrity | `order` ↔ `payment` ↔ `entitlement` ↔ `invoice` ↔ `ledger` inside our DB | Continuous (5-min job) + daily report 08:00 | System → `finance` | `reconciliation_run(kind='integrity')` |
| T1 Provider status | Our `payment` vs provider query API / dashboard transactions of previous day | Daily | `finance` | `reconciliation_run(kind='provider_daily')` |
| T2 Settlement | `payment` vs provider settlement report | Weekly (per provider calendar) | `finance` | `settlement_report` + run |
| T3 Bank | Settlement report net ↔ bank statement credit | Weekly with T2, closed monthly | `finance` | `reconciliation_run(kind='bank')` |
| T4 Ledger vs accountant | Monthly pack ↔ accounting software trial balance | Monthly | CA / bookkeeper | sign-off memo |

### 5.2 Daily (every day incl. weekends; weekends automated, human by next working day) — 15 minutes

1. **Open the finance daily digest** (email 08:00 Asia/Dhaka + `/finance` dashboard). It lists counts and value of: orders `paid` yesterday; payments `pending` > 15 min; `risk_hold`; failed; refunds in queue; `finance_alert` items.
2. **T0 integrity SQL checks** (each returns rows only when something is wrong; saved as `reconciliation_check` definitions):
   - C1 *Paid, not fulfilled*: `payment.status='succeeded'` AND (order not `paid` OR no entitlement/credit grant for each `order_item`).
   - C2 *Fulfilled, not paid*: entitlements/credits with `source='purchase'` whose `order_item.order` has no `succeeded` payment (or whose payment amount < order total).
   - C3 *Order paid without invoice* (BD series) after 5 min.
   - C4 *Amount/currency mismatch* `payment.amount_minor ≠ order.total_minor`.
   - C5 *Duplicate payments*: ≥ 2 `succeeded` payments for one order, or ≥ 2 orders by same user for the same SKU within 24 h with both paid.
   - C6 *Journal imbalance*: `SUM(debit) ≠ SUM(credit)` per `journal_id` (must be impossible; alert as critical).
   - C7 *Ledger vs order*: sum of postings to 1110 on day D equals sum of `payment.amount_minor` succeeded on day D (per currency).
   - C8 *Credit ledger*: `ai_credit_balance.balance ≠ ledger running sum` for any user.
   - C9 *Stale IPN signal*: share of payments resolved by `reconciled_via_query` (rising = IPN delivery problem, `10` §2.7).
3. **T1 provider status**: pull yesterday's transactions from SSLCommerz (merchant panel export or the transaction-query API `[V]`): count and gross by status. Compare to our `payment` counts for status `succeeded`. Differences go to §6.
4. **Risk queue**: review `risk_hold` payments (SSLCommerz `risk_level`, `10` F-PAY-11) within 24 h: release, refund or request ID.
5. **Refund queue**: items in `manual_required` / `manual_pending` (SSLCommerz panel refunds) completed and bank reference recorded.
6. Sign-off: click **Daily check complete** in the console (writes `reconciliation_run` with `approved_by`). If two consecutive days unsigned, alert `admin`.

### 5.3 Weekly (Sunday–Thursday week in Bangladesh; run Monday morning `[P]`) — 1–2 hours

1. **SSLCommerz settlement reconciliation (T2).** Download settlement/statement report from the merchant panel `[U — exact report names and API availability unknown; BDGF found only third-party "5–7 business days" claim]`. Upload CSV in `/finance/settlements/new` (parser mapping stored in `settlement_parser_profile`, so layout changes are config). The `settlementReconcile` job:
   - matches each line by `bank_tran_id` / `tran_id` to `payment.provider_txn_id` / `merchant_ref`;
   - checks gross equals `payment.amount_minor`; computes fee % and compares with contract (2.5% `[V]` for bKash/Nagad/Rocket/Visa/MC, 3.5% AMEX; tolerance ±0.05 pt, plus VAT-on-fee amount `[U]`);
   - checks settled date within expected window (5–7 business days `[U]`);
   - lists **unmatched on either side** and **settlement older than 10 business days** (aging bucket 0–7, 8–14, 15+).
2. Post settlement journals (§4) when the file is accepted (`settlement_report.status='posted'`). Import is idempotent by `(provider, report_period, file_sha256)`.
3. **Open items review:** all `reconciliation_item` rows in `open` older than 3 days get an owner and a next action; > 14 days escalate to `admin`.
4. **Refund and chargeback review** (§11).
5. **bKash/Nagad direct (P2).** bKash merchant portal statement vs `payment.provider='bkash'`: match on `trxID`; fee ≈ 1.85% / Nagad ≈ 1.30% `[U — directory numbers, §3.6 of 10]`; settlement frequency per merchant agreement `[U]`. Same upload/match flow with another parser profile.
6. **Paddle (MoR) weekly:** download transactions and payouts report; match each `txn_…` to our order (Paddle webhooks should have created the order, `10` §2.10); check fee total ≈ 5% + $0.50/txn `[U]`; check tax collected is excluded from our revenue; list refunds/chargebacks; list balance not yet paid out. 
7. **Bank (T3) weekly:** import statement (CSV/PDF → manual rows P1, bank feed P2) and match credits to settlement report nets. Differences > BDT 100 or 0.5% are items.

### 5.4 Monthly (business day 1–5 after month end) — see close checklist §7

Three-way match per provider: **orders (our paid total) ↔ provider settlement reports (gross, fee, net) ↔ bank credits**. Clearing accounts (1110/1120/1130/1140) must be zero or equal to the explained, aged "in transit" amount (payments succeeded in the last 7 business days that are not yet settled). Anything older is written to suspense (1210) with a documented reason.

### 5.5 Matching tolerances

| Item | Tolerance | If exceeded |
|---|---|---|
| Per-transaction gross | 0 (exact, minor units) | Item `amount_mismatch` |
| Fee % | ±0.05 pt of contracted rate | Item `fee_variance`; ask provider |
| Per-settlement net vs bank credit | BDT 100 | Item `bank_variance` |
| Daily provider count vs ours | 0 | Item per difference |
| FX on USD payouts | ±0.5% vs reference rate | Note; FX loss to 7010 |

---

## 6. Discrepancy handling

Every discrepancy becomes a `reconciliation_item` (§15.3) with `kind`, `severity`, `owner`, `due_at`, `resolution`, and links to `order_id`/`payment_id`/`settlement_line_id`. Resolution actions are finance-console buttons that call existing services (never raw SQL).

| Case | Detection | Likely cause | Action | SLA | Accounting |
|---|---|---|---|---|---|
| **Paid-not-fulfilled** (customer charged, no access) | C1 / provider says VALID, our order `pending`/`expired` | IPN lost, validation API failure, order expired during payment, deploy during webhook | Query provider (`val_id` → validation API); if valid and amount/currency match call `fulfilOrder` (idempotent). If order expired >30 min before payment, still fulfil if price unchanged; else refund. Notify user; support macro | 4 h business; 24 h hard | Normal posting once fulfilled; if refunded: refund journal |
| **Fulfilled-not-paid** (access without verified money) | C2 | Bug in fulfilment, manual grant misclassified, forged IPN accepted | **Severity high.** Freeze entitlement if `source='purchase'` and no payment; investigate audit log; if legit (bank transfer) record `payment.provider='manual'` with proof and finance approval; else revoke with notice | Same day | Reverse revenue schedule; if customer paid elsewhere post to suspense 1210 |
| **Duplicate payment, same order** | C5 | User paid twice (double tab, retry after timeout) | Keep first; refund second in full via provider (fees on refund not returned by gateway `[U]` → expense) | 2 business days | Refund journal; fee loss to 5010 |
| **Duplicate purchase, same SKU, two orders** | C5 | Impatient user re-buys | Support contacts user; refund the later order if no consumption; else stack entitlement (entitlements stack, D5) with consent | 2 business days | Standard |
| **IPN replays/duplicates** | webhook idempotency hits | Provider retries | None (expected). Alert only if replay count per payment > 10 | n/a | none |
| **Underpayment / amount mismatch** | C4 / validation API | Wrong amount from gateway or tampered request | Do not fulfil; refund or ask to pay balance | Same day | Suspense until resolved |
| **Settlement short/over (fee or tax variance)** | T2 | Fee tier, VAT on fee, chargeback netting | Ask provider with transaction list; accept variance < tolerance | 5 days | Fee variance to 5010 |
| **Settlement line with no order** | T2 unmatched provider | Test/other-merchant txn, order deleted, wrong merchant ID | Investigate; if ours and unfulfilled treat as paid-not-fulfilled; if unknown hold in 1210 and ask provider | 5 days | Suspense 1210 |
| **Our payment never settled** | aging > 10 business days | Provider hold, risk review, refund already netted | Raise provider ticket with list | 5 days | Stays in clearing; aged report |
| **Refund not visible at provider / bank** | refund `processing` > 5 days | SSLCommerz IP not whitelisted (`10` §3.9), provider delay | Chase; manual panel refund | 3 days | Refunds payable stays open |
| **Chargeback / dispute** | Paddle webhook or SSLCommerz notice/bank advice | Card fraud, "product not received" | See §11.3 | Provider deadline (often 7–14 days `[U]`) | 2320 reserve |
| **Bank credit unknown** | T3 unmatched bank | Direct bKash/bank transfer by a learner/org, creator refund | Contact sender; treat as payment (manual order) or return | 3 days | Suspense |
| **MoR payout mismatch (USD)** | T2 Paddle | Fees, refunds, FX deduction | Reconcile Paddle balance statement line by line | 5 days | 1140 vs 1020 |
| **Order paid, invoice missing** | C3 | Counter or PDF job failed | Re-run `generateInvoice`; gapless counter must not skip (use `voided` placeholder if a number was consumed and lost) | 1 day | none |

Escalation: any single item ≥ BDT 50,000 `[P]` or any unexplained difference ≥ 0.5% of month sales → founder + CA.

---

## 7. Month-end close checklist

Target: close by **business day 7**; VAT return and TDS deposit deadlines are fixed by law, so close must finish well ahead of them `[VERIFY-CA deadlines, §8.4]`. Each step has an owner (F = finance, A = admin, CA) and evidence stored in `/finance/close/YYYY-MM`.

| # | Step | Owner | Evidence |
|---|---|---|---|
| 1 | Freeze month: stop new manual journals in that period except via `adjustment` (period status `closing`) | F | `finance_period.status` |
| 2 | All 31/30 daily checks signed; open `reconciliation_item` list reviewed | F | run ids |
| 3 | Settlement reports uploaded and posted for all providers up to month end | F | `settlement_report` ids |
| 4 | Bank statements imported (all accounts); three-way match per provider complete (§5.4) | F | bank rec report |
| 5 | Clearing accounts (1110–1140) reconciled; > 7-business-day items moved to suspense or explained | F | aged clearing report |
| 6 | Suspense 1210 cleared or explained | F | |
| 7 | Revenue recognition run complete for last day; deferred revenue roll-forward (opening + billings − recognised − refunds − breakage = closing) agrees to 2110–2150 | F | roll-forward CSV |
| 8 | Breakage sweep (credits/mocks expired this month) posted | F | |
| 9 | AI cost accrual: `Σ cost_micros` vs vendor invoices (Anthropic, Deepgram, Google) — true-up journal for difference; FX at month-end | F | vendor statements |
| 10 | Foreign SaaS/AI payments list; reverse-charge VAT computed and tracked `[V]` `[VERIFY-CA]` | F/CA | RC schedule |
| 11 | Refunds and credit notes for the month: counts/value; credit notes match refunds; VAT reversed | F | refund export |
| 12 | Chargebacks reserve review | F | |
| 13 | Royalties and rater/grader fees accrued; payout statements generated for the month (§10) | F | statements |
| 14 | TDS/withholding computed on approved payouts; challan prepared (§9) | F/CA | |
| 15 | Instalment receivables aged; overdue actions taken | F | |
| 16 | Provision for Progress Promise updated | F | |
| 17 | FX revaluation of USD balances and receivables (7020) | CA | |
| 18 | Monthly export pack (§13.1) generated: sales register, VAT support, settlement, refunds, payouts, deferred revenue, bank | F | `/finance/exports` |
| 19 | Pack sent to CA; CA returns trial balance and queries within 3 business days `[P]` | CA | email |
| 20 | VAT return prepared / reviewed (§8.4) | CA + F | draft return |
| 21 | Management reports (§14) snapshot saved; variance commentary | F | |
| 22 | Admin signs "period closed"; `finance_period.status='closed'`, `closed_by`, `closed_at`; later corrections need `adjustment` journal in the open period | A | |

Quarterly additions: bad-debt review, chargeback rate review, SSLCommerz rate/contract review, royalty rate audit against contracts, access-programme budget report. Annually: audit/AGM prep, Form/returns per CA, reconcile 6-year retention archive.

---

## 8. VAT / Mushak operations `[VERIFY-CA]` throughout

> Research context: PwC Finance Act 2026 summary reports **startup supplies VAT-exempt from 1 Jul 2026 with a nine-year growth period; quarterly VAT returns default; 4% turnover tax continues; BDT 3M turnover-tax enlistment threshold; BIN/enlistment mandatory for bank accounts, MFS merchant accounts and trade-licence renewal; imported services at 15% reverse charge** `[V]`. No separate education-services VAT change was found. **Whether Lumen (a) qualifies as a "startup", (b) is an exempt educational supplier, (c) must charge 15%, or (d) is on turnover tax is unknown and must be answered in writing by the CA before launch.** The base case in `02` §8.1 assumes 15% VAT-inclusive prices (A18). Treat any exemption as upside.

### 8.1 Registration and identifiers

- Obtain **BIN** (Business Identification Number) and/or enlistment, TIN, trade licence, DBID `[U]` before opening the merchant bank account and applying to SSLCommerz (see `10` §3.7 onboarding list). Private-limited-company route is recommended in `02` §12.1.
- Store in `finance_setting`: `seller_legal_name`, `seller_bin`, `seller_tin`, `seller_address`, `vat_regime` (`standard_15` | `startup_exempt` | `turnover_tax`), `vat_regime_valid_from`, `exemption_certificate_ref`. Changing regime applies from a date, never retroactively (invoice `tax_mode` frozen per invoice, `10` §6.1).
- Make VAT regime a **per-product** attribute (`product.vat_class`: `standard`, `exempt`, `zero_rated_export`) so that a future partial exemption (e.g., education-only products exempt, books taxable) needs no code change.

### 8.2 Tax point vs revenue recognition

Accounting revenue is deferred (§3), but VAT/Mushak is normally due on the supply/invoice/payment event, not on deferred recognition `[VERIFY-CA]`. Therefore **VAT payable (2210) is credited at payment**, and the VAT return uses the `sales_register` (invoice dates), not recognised revenue. Month-end reports must show both bases: *invoiced/billed* (VAT basis) and *recognised* (accounting basis).

### 8.3 Mushak-6.3 invoice (field checklist; template switchable without code)

`10` §6.1 has the field set. Use the table below as the **accountant checklist** during the template sign-off gate (§17). Field names are from `10` and common NBR practice `[U]`; none is confirmed.

| Field | In schema? | Check with CA |
|---|---|---|
| Form name/number ("Mushak-6.3" / "Tax Invoice") and challan number | `number`, `series` | Exact heading text; whether serial must be NBR-prescribed |
| Seller name, address, BIN | `seller_snapshot` | BIN formatting |
| Buyer name, address, BIN/NID (B2B) | `buyer_snapshot` | When BIN is mandatory (e.g., above threshold) |
| Date **and time** of issue; supply date | `issued_at`, `supply_date` | |
| Goods/service description and HS/service code | `lines` description; code placeholder | Code for e-learning / information services |
| Quantity, unit price (excl. VAT), supplementary duty, VAT rate, VAT amount, total | `lines`, `tax_rate_bp` | Whether total must show VAT-exclusive & inclusive |
| Place of supply, delivery | `place_of_supply` | |
| Payment method | `payment.method` | |
| Exempt legend (if `tax_mode='exempt'`) | `exemption_legend` | Exact statutory wording |
| Language | EN+BN | Whether Bangla required |
| E-invoicing / EFD / SDC requirement | n/a | Whether an e-invoice or fiscal device is required for online sales `[U]` |
| Credit note (Mushak-6.7 `[U]`) / debit note (6.8 `[U]`) | `invoice.kind='credit_note'` | Mandatory content of credit note |
| Retention & submission | `pdf_r2_key`, sha256 | Retention years |

Operating rules: gapless numbering per (fiscal year, kind) (`05` `invoice_counter`; `10` §6.3); void keeps number; every BD paid order gets an invoice within 5 min (check C3). For MoR orders invoice is a **mirror** record, not a Mushak invoice `[U: confirm with Paddle and CA]`.

### 8.4 Return filing cadence (placeholders)

| Obligation | Default draft | Source | Action |
|---|---|---|---|
| VAT return (Mushak-9.1 `[U]`) | **Quarterly** (Finance Act 2026 default `[V]`); monthly if the CA says so | PwC | Prepare from `vat_return_support` export; CA files via NBR portal; calendar reminder T-7/T-2 |
| VAT payment | With return / by due date (via treasury challan) | `[U]` | Finance prepares challan figure; founder pays from bank |
| Nil return | Still required | `[U]` | Calendar even if exempt |
| TDS/withholding deposit and certificate | Within deadline after month end `[VERIFY-CA]` | §9 | Challan + certificate to payee |
| Reverse-charge VAT on imports | Deposited by bank at remittance `[V]` | PwC | Keep bank advice as evidence; reconcile to RC schedule |
| Corporate income tax return | Annual, with accounts `[VERIFY-CA]` | | CA |

Data pack for CA each period: `sales_register`, `vat_return_support` (month, VAT collected, exempt sales, credit-note VAT, net payable), refund/credit-note list, purchases list with BIN (input VAT claims `[VERIFY-CA]`), payouts with TDS.

### 8.5 Turnover tax note

Finance Act 2026 reportedly keeps **4% turnover tax** with a **BDT 3M threshold** for enlistment `[V]`. Turnover tax and standard VAT are generally alternative regimes (a business above the VAT threshold or voluntarily registered pays VAT, not turnover tax) `[VERIFY-CA]`. The model must be able to run either: store both rate settings; the P&L shows tax as 2210 under VAT, 2230 under turnover tax. If turnover tax applies, the 15% extraction in prices (D5 VAT-inclusive display) must change to "tax included in price at 4%?" — a pricing question for the CA to settle before the price book (17) is frozen. Also confirm: does turnover tax apply on **gross receipts including deferred revenue** (cash/invoice basis) or on recognised revenue?

### 8.6 Startup exemption check (action list for the CA meeting)

1. Does Lumen meet the startup definition under Finance Act 2026 (registration with the designated authority, age, size)? Certificate/ID needed? `[V]` unconfirmed.
2. Does exemption cover all supplies or only some? Does it cover imported-service reverse charge (no per `[V]`)?
3. Can input VAT be reclaimed while exempt (usually not)?
4. Must exempt invoices still be issued in Mushak form with a legend?
5. Interaction with SSLCommerz/MoR agreements (gateway may charge VAT on fees regardless).
6. Price consequence: if exempt, BD prices stay VAT-inclusive for P1 and Lumen keeps the 13% uplift (15/115), per `02` upside +15% BD revenue. **Do not advertise "VAT exempt" or change prices until confirmed.**

### 8.7 Foreign tools and AI spend

15% reverse-charge VAT on imported services is a **real cost** not modelled in `02` (§8.1) `[V]`. Finance keeps a monthly `foreign_vendor_payment` schedule (Anthropic, Google, Deepgram, Vercel, Neon, Cloudflare, Bunny, Resend, PostHog, Sentry): amount, date, payment method, VAT deposited, bank advice reference. Update `02` §11 COGS by ≈ +15% on those lines `[VERIFY-CA]`. Payment method (international card vs remittance) is covered in §12.

---

## 9. Withholding tax and contractor payments `[VERIFY-CA]`

> No withholding rates are in the research notes (GA-008: grep found nothing). The rows below are **structure**, not rates. Every `rate` cell is a `finance_setting` value that the CA fills in; engineering ships with **0 and a hard stop**: payout approval is blocked until a rate (even 0) is set for the payee's category.

| Payee category | Typical payment | Withholding concept (verify) | Planning placeholder | Documents |
|---|---|---|---|---|
| Individual contractor — content (per asset) | Video/lesson/question-set fee | Tax deducted at source on professional/technical/consultancy fees under the Income Tax Act 2023 `[U]` | `rate_bps = 1000` (10%) `[P — verify]` | Contract (IP assignment), TIN, NID copy |
| Lead instructor royalty (10% of net, D12) | Royalty on course sales | Royalty withholding `[U]` | `1000` `[P — verify]` | Royalty schedule in contract |
| Grader / rater (per item or hourly) | Per rating | Fee/commission/service withholding `[U]` | `[P — verify]` | TIN if available |
| Payee without TIN | Any | Higher rate typically applies `[U]` | CA to specify | Collect TIN at onboarding; rate is higher without it |
| Company/agency vendor | Invoice | Source tax on supplies/services `[U]` + VDS `[U]` | CA | BIN, VAT invoice |
| Foreign individual/company | Remittance abroad | Withholding on payments to non-residents + reverse-charge VAT on imported service `[V]` | CA | Foreign contractor agreement; BB/ADS remittance docs |
| Salaried staff | Payroll | Payroll withholding | CA | |

Operating rules:
- Payee onboarding collects: legal name, NID, TIN (if any), payout method (bank / bKash), mobile number, address, nationality/tax residency, signed contract. Stored in `payee_profile` (§15.4) with encryption for NID/account numbers (D7 PII rule).
- Deduct at **payment or accrual per the rule** the CA specifies; the statement displays gross, withholding, net. Withheld amount sits in 2240 until the **challan deposit** by the deadline `[VERIFY-CA]`, then a **withholding certificate** is issued to the payee (PDF from `payout_statement`).
- Annual payee summary (for payees' own returns) generated from statements.
- **Misclassification guard** (employee vs contractor): long-term exclusive, hours-controlled grader/instructor engagements are reviewed by the CA/lawyer; labour-law implications are out of scope here (26).
- Where the platform pays graders who are also instructors, statements are separate by engagement type (conflict control, GA-024).

---

## 10. Creator, grader and item-writer payout process

Scope per D12 C19: P1 content is **work-for-hire** contractors paid per asset **plus optional lead-instructor royalty (default 10% of net on their course)**. Payouts are **manual monthly** (finance role, bank/bKash, withholding per accountant) in P1–P2. Automated marketplace payouts (revenue-share SaaS flow, `payout`/`payout_line` in 05, `computeInstructorPayouts` in 06) stay P3.

### 10.1 Engagement types

| Type | Who | Pay basis | Approval of work | Tax treatment | Contract artefacts |
|---|---|---|---|---|---|
| `salaried` | Employees | Payroll | n/a | Payroll (outside this doc) | Employment contract |
| `asset_fee` | Video/lesson/item writers | Fixed fee per accepted asset (rate card by asset type) | Editor acceptance in Studio (`content_editor`) | §9 contractor | Work-for-hire + IP assignment, originality warranty (03) |
| `royalty` | Lead instructor (optional) | 10% of **net royalty base** on own course (D12) | Automatic from sales | §9 royalty | Royalty schedule |
| `grader_item` | Graders (7.10) | Per completed review (writing/speaking, rate card) | Auto on `evaluation_result` complete + QC | §9 | Grader agreement + NDA |
| `rater_item` | Gold-set raters (31) | Per rating, per task family | Accepted if QC pass | §9 | Rater agreement + NDA |
| `hourly` | Training sessions, standardisation | Hours × rate | Lead approves | §9 | |
| `bonus` | Quality/SLA bonus | Discretionary | Admin | §9 | |

`02` §8.4 used **12%** royalty on courses *and passes*; D12 C19 locks **10% on their course**. This doc follows D12. **Open question OQ-F2:** whether pass revenue (all-access) allocates any royalty to lead instructors; default P1 = **no royalty on passes, mock packs, AI credits** (those are Lumen-owned/work-for-hire). Update `02` §8.4/A14 accordingly (margin improves ≈ 2 pts on courses, ≈ 12 pts on passes).

### 10.2 Royalty base ("net")

`royalty_base = order_item.total_minor − VAT − gateway fee (actual provider_fee_minor, pro-rata) − refunds − chargebacks lost`, **in BDT, per course line**. For bundles/passes containing a course, base is allocated by price-book SSP only if the contract says so (default P1: bundles containing the course allocate by the course's list share). International (MoR): net of MoR fee and consumer tax (from payout statement). `[P]` Define "net" once in the royalty schedule and in this section; changing it requires a contract amendment.

Hold period: royalty accrues on payment but becomes **payable** after **14 days** (7-day refund window + 7 days buffer) and only if not refunded `[P]`. Refunds after payout produce a negative line in the next statement (clawback), capped at the payee's next payable (carried forward if larger).

### 10.3 Monthly payout cycle (calendar `[P]`)

| Day (Asia/Dhaka) | Step | Owner |
|---|---|---|
| Month-end +1 | `generatePayoutStatements(period)` job creates `payout_statement` drafts for every active payee with accruals or approved work in the period | System |
| +2 | Finance reviews drafts: anomalies (>30% change vs 3-month average, new payees, negative balances, missing TIN/method), fixes `payee_profile` | `finance` |
| +3 | Sends statements to payees (PDF, EN/BN) for **dispute window of 3 business days**; disputes handled via support ticket linked to statement | `finance` |
| +6 | Finance locks statements (`status='approved_pending'`); generates payout batch file | `finance` |
| +7 | **Approval**: second person (`admin`/`super_admin`) reviews batch totals and exceptions, approves with **step-up 2FA** (TOTP/passkey re-auth ≤ 5 min old, D4/D7) | `admin` |
| +8 | Disbursement (bank BEFTN/EFT file or bKash disbursement; see 10.5) by the person holding bank mandate | Founder / bank signatories |
| +9 | Finance marks batch `paid` with bank/bKash reference per line; failed lines → `failed` and retried next day; emails payment confirmation + withholding certificate when deposited | `finance` |
| By TDS deadline | Deposit withheld tax challan; attach evidence | Founder/CA `[VERIFY-CA]` |

Cut-off: statements cover completed calendar months; work accepted or evaluation completed up to 23:59 on the last day.

### 10.4 Statements (what the payee sees)

`payout_statement` PDF/portal (`/studio/earnings` for `instructor`; email PDF for graders/raters/writers): payee, period, engagement lines (asset fees with asset refs; royalty lines per course: units, net base, rate, amount; grader lines: items completed with request ids but **no learner identity**), gross, withholding (rate and category), adjustments/clawbacks, **net payable**, payout method and masked account, statement number, signed hash. Statement is immutable once approved; corrections are adjustment lines on the next statement.

### 10.5 Disbursement methods (P1–P2)

| Method | When | Controls |
|---|---|---|
| Bank transfer (BEFTN/EFT or RTGS for large) `[U]` | Default for ≥ BDT 10,000 `[P]` | Payee-name match to NID name; batch file approved by two bank signatories; bank reference stored |
| bKash/Nagad **business** disbursement `[VERIFY-CA/provider]` | Small recurring (graders/raters) | Use merchant/corporate disbursement product if available; **never founders' personal wallets** (commingling, no audit trail) |
| Manual wallet send-money | Last resort | Dual approval; screenshot of trxID attached; limit per transaction `[P]` BDT 25,000; cash-out fee borne by payee unless contract says otherwise |
| International (foreign contractors) | Rare | Remittance through authorised dealer; requires contract, FX documentation, reverse-charge/withholding per §12 |

Bangladesh mobile-wallet transaction limits and merchant/disbursement eligibility are provider-specific `[U]`; verify at onboarding.

### 10.6 Controls and records

- Maker–checker: the preparer cannot approve (`CHECK (approved_by <> prepared_by)` in schema; service-level).
- Payee bank/bKash details changes: re-verification by call-back to the number on contract; 7-day cooling before first payout to changed details; audit-logged.
- **Records (retain 6 years `[P]/[VERIFY-CA]`)**: contract, TIN/NID copy (encrypted), statements, approval log (who, when, 2FA method), bank file and confirmation, TDS challan, withholding certificate.
- Minimum payout `[P]` BDT 500 (below carries forward). Currency BDT. Exceptional USD payees handled manually.
- Audit log events: `payout.statement.generate`, `.approve`, `.pay`, `.fail`, `payee.details.change`.
- Fraud checks: payee ≠ duplicate NID/bank account across profiles; grader paid for items they also bought as learner is flagged; royalties on own purchases excluded (payee's own `user_id` orders removed from base).

### 10.7 Scaling plan

P1: CSV export + manual disbursement (this section). P2: bank-file generator per BEFTN spec `[U]`, bKash disbursement API if eligible, payee self-service tax docs. P3: marketplace payouts (05 `payout`, `payout_line`, 06 service) — the `payout_statement` model is the superset; migrate `payout` into it.

---

## 11. Refunds, credit notes and chargebacks

### 11.1 Policy recap (D5, 10 §2.8)

7 days and < 20% consumed; no refunds on consumed AI credits; certificates revoked on refund; refunds above `REFUND_APPROVAL_THRESHOLD_BDT` (default 5,000 `[P]`) need a second approver. Support may approve pre-approved cases up to the threshold; finance executes.

### 11.2 Refund accounting

1. Refund `succeeded` (provider confirms or finance marks manual completion with bank reference).
2. Journal: reverse **unrecognised** revenue from deferred (2110…), reverse **recognised** part against contra 4920, reverse VAT via credit note (`vat = amount × 15/115` or per original invoice).
3. **Credit note** (`invoice.kind='credit_note'`, own gapless number, linked `relatedInvoiceId`) issued in the **period of the refund**, referencing the original invoice (original period may already be filed `[VERIFY-CA]` for the VAT adjustment mechanism).
4. Entitlement/credit policy (`10` §7.5) revokes access; revenue schedule stopped; royalty clawback line created (§10.2).
5. **Gateway fee on refunded transactions is typically not returned** `[U]`: expense 5010; report "fee leakage on refunds" monthly.
6. Partial refunds: schedule reduced proportionally; credit note for amount.
7. **Cross-period**: a refund in March for a February sale posts in March (no restating February); the monthly pack shows it as "prior-period refund".
8. **Refund by method**: SSLCommerz refunds via API from a registered fixed IP, else panel + manual (`10` §3.9); bKash refunds per bKash API `[U]`; Paddle/Stripe via API; goodwill refunds beyond policy require `refund:override_policy` + reason.
9. **Cash-flow note**: refunds are paid out of operating bank; if the settlement for the original sale hasn't arrived, the refund can be netted by the provider.

### 11.3 Chargebacks and disputes

Applies to cards (SSLCommerz acquirer disputes, Paddle/Stripe disputes).
- Intake: Paddle/Stripe webhook (`payment.status='disputed'`, GA-025) and SSLCommerz/acquirer notice (email, panel) → `chargeback_case` task in finance queue within 1 h of receipt. Provider deadlines are short `[U]`.
- **Evidence pack** (export built by NEW-FIN-14): order and payment records, IP/device, entitlement grant time, content access logs (lessons watched, mocks sat), AI evaluations used, watermark logs, support correspondence, refund-policy acceptance at checkout (consent record), invoice.
- Decision rule `[P]`: if the learner consumed >20% or evaluations → contest; if unused and within 7 days → accept and refund (cheaper than fee/penalty) and revoke access.
- Accounting: reserve in 2320 while open; won → release; lost → 5410 + reverse revenue and VAT via credit note; **dispute fee** (Paddle/Stripe/bank fee) → 5410. Track **chargeback rate** (disputes / transactions, rolling 90 days) with alert at 0.5% `[P]` (card networks penalise high rates `[U]`).
- Account actions after loss: suspend user's purchase ability for 12 months `[P]`; flag device/phone (09 fraud rules).

---

## 12. Foreign remittance and Bangladesh Bank rules `[VERIFY-CA]`

> Source: BB FEPD circular of **30 July 2026** (consolidated export-trade FX rules, valid one year) and Daily Star 22 Jul 2026 freelancer easing, read partially (first 100k of 188k characters) `[V]`. **This is a summary, not legal advice** (`10` §5.6). Confirm with the CA and the authorised-dealer (AD) bank.

### 12.1 Inbound — service-export proceeds (international sales via MoR)

| Topic | Draft rule from notes `[V]` | Operating procedure |
|---|---|---|
| Channel | Internet acquiring, licensed PSPs/OPGSPs, digital wallets, marketplaces for service income; proceeds must come via a bank/AD | Paddle pays to a BD bank (SWIFT) or to Payoneer → bank/bKash; **decide the channel with AD bank before applying to Paddle** (entity type, eligibility unconfirmed `[U]`) |
| Repatriation deadline | Within **4 months** of export/service | `export_receipt` record has `service_date` (sale date) and `repatriation_due = +4 months`; weekly alert for receipts > 3 months old unreceived |
| OPGSP cap | Up to USD 10,000 per transaction | Courses are far below; B2B/org USD invoices may exceed → split or use bank wire |
| Form-C / declaration | Service inflows without Form-C up to USD 20,000 | Track per-receipt amounts; above → Form-C process via AD |
| Retention (ERQ) | Freelancers: up to 50% ICT / 30% other (22 Jul easing) — **whether a company may retain, and how much, must be checked** | Account 1020; parameter `erq_retention_bps`; CA decides what is converted to BDT and when |
| Evidence | Electronic evidence (platform statements, emails) accepted | Keep MoR payout statements, transaction exports, bank advices, SWIFT messages ≥ 6 years `[P]` |
| FX rate | Bank's buying rate on credit | Use actual credited BDT; difference to booking rate → 7010 |

Procedure per Paddle payout: (1) payout notification; (2) bank advice of credit; (3) match payout statement lines to orders; (4) create `export_receipt` (USD amount, payout ref, bank ref, BDT credited, date, purpose code per bank `[U]`); (5) store AD bank documents; (6) export `export_receipts_fx` monthly (exists in `10` §6.7).

Learners in Bangladesh paying through the **international** rail in USD (e.g., foreign card): flag in reports; tax and FX treatment may differ from export `[VERIFY-CA]`.

If Stripe via a **foreign entity** is chosen: the foreign entity's income is outside BB export rules, but dividends/service fees upstream to Lumen BD and Lumen BD's own sales to the foreign entity are cross-border and need transfer-pricing and BB treatment advice before the first dollar `[VERIFY-CA]`.

### 12.2 Outbound — paying foreign vendors

| Topic | Procedure |
|---|---|
| Payment method | International-use cards / virtual dollar cards under the AD bank's business endorsement limits `[VERIFY-CA/bank]`; for larger or recurring vendors use bank remittance with invoice |
| Reverse-charge VAT | 15% on imported services deposited by bank at remittance `[V]`; record in 2220 / RC schedule; whether creditable `[VERIFY-CA]` |
| Withholding on remittance | Tax on payments to non-residents `[VERIFY-CA]` |
| Evidence | Invoice, contract/ToS, bank advice, VAT challan |
| Spend control | Monthly foreign-spend budget (AI APIs are variable): alert at 80% of cap; consider pre-paid API credits timed to remittance |

### 12.3 Founder checklist for the AD bank meeting

1. Account types allowed (current, ERQ, FC) for a private limited company.
2. Which MoR/PSP receipts qualify as export proceeds and the documentation per inflow.
3. Retention percentage for a **company** service exporter; conversion deadlines.
4. Form-C thresholds and process; purpose codes.
5. Outbound payment channels for SaaS/AI vendors, annual limits, endorsements.
6. Any restriction on Payoneer→bKash for company funds.

---

## 13. Financial reports

### 13.1 Monthly export pack (to CA and board) — `/finance/exports` (`finance:export`, audited)

Existing in `10` §6.7: `sales_register`, `vat_return_support`, `payments_settlement`, `refunds`, `export_receipts_fx`. Add:

| Export | Content |
|---|---|
| `journal_entries` | All ledger entries with source refs and dimensions (CA imports summarised by account) |
| `trial_balance` | By account, period, currency |
| `deferred_revenue_rollforward` | Opening, billings, recognised, refunds, breakage, closing by product kind |
| `revenue_by_dimension` | By SKU/exam/tier/region/provider/cohort |
| `reconciliation_summary` | Per provider: orders, settlement, bank, open items, aging |
| `payout_register` | Statements, withholding, status, bank refs |
| `ai_cost_register` | Daily `cost_micros` by provider/model/feature vs credits consumed |
| `foreign_vendor_payments` | For reverse-charge VAT |
| `access_programme_report` | Scholarships/partner codes: count, list value, funded by |
| `invoices_and_credit_notes` | Number continuity check (gaps explained) |

All exports: UTF-8 BOM, formula-injection guard, signed link, audit log (D7).

### 13.2 Dashboards (`/finance` console)

| Dashboard | Metrics (definition) |
|---|---|
| **Cash** | Bank balances by account (manual entry weekly P1, feed P2); cash in transit (clearing balances); next 30-day payables (payouts, tax, vendors) |
| **Billings vs revenue** | Billings (invoice basis net of VAT) vs recognised revenue; ratio |
| **Deferred revenue** | Balance by product kind; waterfall; expected recognition next 1/3/6/12 months (from schedules) |
| **MRR-equivalent for passes** | `MRR-eq = Σ over active pass/course entitlements (net recognisable ÷ months in term)` — i.e., the monthly recognised run-rate from active schedules; split BD/Intl; **new, expansion (upgrade), renewal, churn (pass expired not renewed within 30 days), refunds**. For BD prepaid passes (no auto-renew, D5) "churn" = expiry without renewal; international auto-renew reports true recurring MRR. Annualised = ×12 (ARR-eq). Not GAAP revenue; label as management metric |
| **Unit economics** | Gross margin by SKU (revenue − gateway − MoR − royalty − AI − video); AI cost per credit (alert > $0.12, 07 §7.8); free-tier AI cost per active free user |
| **Payments health** | Success rate by provider/method, IPN vs query reconciliation share, fee % effective, settlement lag (days), unmatched value |
| **Refunds & disputes** | Refund rate (value & count, by reason, by tier), chargeback rate, fee leakage |
| **Burn and runway** | Net burn = cash out − cash in (excl. financing) 3-month average; **runway = cash balance ÷ net burn**; gross burn; payroll share; runway under three scenarios (base, −30% revenue, +AI cost) consistent with `02` §11 |
| **Liabilities** | Payouts payable, TDS payable, VAT payable (output − input), reverse-charge payable, Progress Promise provision, instalment receivable aging |
| **Access programme** | Scholarship spend vs budget, partner-funded share |

Targets/alerts: clearing > 10 business days unsettled; deferred revenue vs expected from `entitlement` (control total must tie within 0.1%); runway < 6 months → founder alert.

---

## 14. Month/quarter calendar (summary)

| When | Task |
|---|---|
| Daily | §5.2 checks, risk queue, refund queue |
| Weekly (Mon) | Settlements (T2) + bank import (T3), open items, chargebacks |
| Month +1…+7 | Close checklist §7 |
| Month +3 `[P]` | Payout cycle days +1…+9 (§10.3) |
| Per CA | VAT return (quarterly default `[V]`; confirm), TDS deposit, certificates |
| Quarterly | Provision, rates, fee contract review, access-programme budget, bad debts |
| Annually | Financial statements, tax returns, ERQ/FX reconciliation, retention archive, CA rate-card refresh, update `02` assumptions |

---

## 15. Data model additions (Drizzle sketches, per `05` conventions)

> Conventions: snake_case singular tables, `pk()` UUIDv7, `amountMinor()` bigint minor units, `currencyCol()`, `tstz`, `timestamps()`; FK columns lead an index (CI test `db-fk-indexed`); closed sets are pg enums; no RLS (authorization in services); finance tables are written only by `packages/core/src/finance` and the least-privilege DB role `finance_writer`; `ledger_*` tables are **append-only** (trigger blocks UPDATE/DELETE, like `audit_log`). File would be `packages/db/src/schema/finance.ts`, imported after `commerce` and `evaluation`. Not compiled in the authoring sandbox; run `pnpm --filter @lumen/db typecheck` first.

### 15.1 Ledger

```ts
// packages/db/src/schema/finance.ts
export const ledgerAccountTypeEnum = pgEnum('ledger_account_type', ['asset', 'liability', 'equity', 'revenue', 'cost_of_revenue', 'expense', 'other']);
export const journalStatusEnum = pgEnum('journal_status', ['posted', 'reversed']);
export const periodStatusEnum = pgEnum('finance_period_status', ['open', 'closing', 'closed']);

export const ledgerAccount = pgTable('ledger_account', {
  id: pk(),
  code: text('code').notNull(),                         // '1110', '2110', '4010'
  name: text('name').notNull(),
  type: ledgerAccountTypeEnum('type').notNull(),
  isSystem: boolean('is_system').notNull().default(false), // posted by the platform
  currency: char('currency', { length: 3 }),            // null = any
  active: boolean('active').notNull().default(true),
  ...timestamps(),
}, (t) => [uniqueIndex('ledger_account_code_uq').on(t.code)]);

export const financePeriod = pgTable('finance_period', {
  id: pk(),
  periodStart: date('period_start', { mode: 'string' }).notNull(),   // first day of month (Asia/Dhaka)
  periodEnd: date('period_end', { mode: 'string' }).notNull(),
  status: periodStatusEnum('status').notNull().default('open'),
  closedBy: uuid('closed_by').references(() => user.id, { onDelete: 'restrict' }),
  closedAt: tstz('closed_at'),
  checklist: jsonb('checklist').$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),
  checklistSchemaVersion: schemaVersionCol('checklist_schema_version'),
  ...timestamps(),
}, (t) => [
  uniqueIndex('finance_period_start_uq').on(t.periodStart),
  index('finance_period_closed_by_idx').on(t.closedBy),
]);

/** One balanced business event. */
export const ledgerJournal = pgTable('ledger_journal', {
  id: pk(),
  number: text('number').notNull(),                     // 'JV-2026-11-000123' gapless per month not required; unique
  postedAt: tstz('posted_at').notNull().defaultNow(),
  accountingDate: date('accounting_date', { mode: 'string' }).notNull(), // Asia/Dhaka date; must be in an open period
  periodId: uuid('period_id').notNull().references(() => financePeriod.id, { onDelete: 'restrict' }),
  sourceType: text('source_type').notNull(),            // 'payment','refund','settlement_line','payout_statement','revenue_schedule','manual','ai_cost'
  sourceId: text('source_id').notNull(),
  postingKind: text('posting_kind').notNull(),
  idempotencyKey: text('idempotency_key').notNull(),    // `${sourceType}:${sourceId}:${postingKind}`
  status: journalStatusEnum('status').notNull().default('posted'),
  reversesJournalId: uuid('reverses_journal_id').references((): AnyPgColumn => ledgerJournal.id, { onDelete: 'restrict' }),
  memo: text('memo'),
  createdBy: uuid('created_by').references(() => user.id, { onDelete: 'set null' }), // null = system
  approvedBy: uuid('approved_by').references(() => user.id, { onDelete: 'set null' }), // manual journals need approver != creator
}, (t) => [
  uniqueIndex('ledger_journal_number_uq').on(t.number),
  uniqueIndex('ledger_journal_idem_uq').on(t.idempotencyKey),
  index('ledger_journal_period_idx').on(t.periodId, t.accountingDate),
  index('ledger_journal_source_idx').on(t.sourceType, t.sourceId),
  index('ledger_journal_reverses_idx').on(t.reversesJournalId),
  index('ledger_journal_created_by_idx').on(t.createdBy),
  index('ledger_journal_approved_by_idx').on(t.approvedBy),
  check('ledger_journal_manual_chk', sql`${t.sourceType} <> 'manual' or (${t.approvedBy} is not null and ${t.approvedBy} <> ${t.createdBy})`),
]);

export const ledgerEntry = pgTable('ledger_entry', {
  id: bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  journalId: uuid('journal_id').notNull().references(() => ledgerJournal.id, { onDelete: 'restrict' }),
  accountId: uuid('account_id').notNull().references(() => ledgerAccount.id, { onDelete: 'restrict' }),
  debitMinor: amountMinor('debit_minor').notNull().default(0),
  creditMinor: amountMinor('credit_minor').notNull().default(0),
  currency: currencyCol().notNull(),
  fxRate: numeric('fx_rate', { precision: 18, scale: 8 }),            // to BDT at transaction date; null for BDT
  baseDebitMinor: amountMinor('base_debit_minor').notNull().default(0),  // BDT-equivalent
  baseCreditMinor: amountMinor('base_credit_minor').notNull().default(0),
  // dimensions (see §2.7)
  productKind: productKindEnum('product_kind'),
  productId: uuid('product_id').references(() => product.id, { onDelete: 'restrict' }),
  orderId: uuid('order_id').references(() => order.id, { onDelete: 'restrict' }),
  orderItemId: uuid('order_item_id').references(() => orderItem.id, { onDelete: 'restrict' }),
  provider: paymentProviderEnum('provider'),
  region: text('region'),                                              // 'BD' | 'A' | 'B' | 'C'
  exam: text('exam'),
  tier: text('tier'),
  orgId: uuid('org_id').references(() => organization.id, { onDelete: 'restrict' }),
  payeeId: uuid('payee_id'),                                           // FK to payee_profile, set in migration to avoid cycle
}, (t) => [
  index('ledger_entry_journal_idx').on(t.journalId),
  index('ledger_entry_account_idx').on(t.accountId, t.id),
  index('ledger_entry_order_idx').on(t.orderId),
  index('ledger_entry_order_item_idx').on(t.orderItemId),
  index('ledger_entry_product_idx').on(t.productId),
  index('ledger_entry_org_idx').on(t.orgId),
  check('ledger_entry_side_chk', sql`(${t.debitMinor} = 0) <> (${t.creditMinor} = 0) and ${t.debitMinor} >= 0 and ${t.creditMinor} >= 0`),
]);
// Custom SQL (05 §5): deferred constraint trigger asserting SUM(base_debit)=SUM(base_credit) and SUM(debit)=SUM(credit) per (journal, currency);
// BEFORE UPDATE/DELETE trigger raises on ledger_journal/ledger_entry; trigger rejects posting into a 'closed' period.

export const revenueSchedule = pgTable('revenue_schedule', {
  id: pk(),
  orderItemId: uuid('order_item_id').notNull().references(() => orderItem.id, { onDelete: 'restrict' }),
  entitlementId: uuid('entitlement_id').references(() => entitlement.id, { onDelete: 'restrict' }),
  method: text('method').notNull(),                     // 'straight_line_daily' | 'on_consumption' | 'on_delivery'
  deferredAccountId: uuid('deferred_account_id').notNull().references(() => ledgerAccount.id, { onDelete: 'restrict' }),
  revenueAccountId: uuid('revenue_account_id').notNull().references(() => ledgerAccount.id, { onDelete: 'restrict' }),
  currency: currencyCol().notNull(),
  netRecognisableMinor: amountMinor('net_recognisable_minor').notNull(),
  recognisedMinor: amountMinor('recognised_minor').notNull().default(0),
  unitValueMinor: amountMinor('unit_value_minor'),      // for on_consumption
  unitsTotal: integer('units_total'),
  unitsConsumed: integer('units_consumed').notNull().default(0),
  startDate: date('start_date', { mode: 'string' }),
  endDate: date('end_date', { mode: 'string' }),
  lastRecognisedThrough: date('last_recognised_through', { mode: 'string' }),
  status: text('status').notNull().default('active'),   // active | completed | stopped
  ...timestamps(),
}, (t) => [
  uniqueIndex('revenue_schedule_item_ent_uq').on(t.orderItemId, t.entitlementId),
  index('revenue_schedule_active_idx').on(t.status, t.endDate).where(sql`${t.status} = 'active'`),
  index('revenue_schedule_entitlement_idx').on(t.entitlementId),
  index('revenue_schedule_deferred_idx').on(t.deferredAccountId),
  index('revenue_schedule_revenue_idx').on(t.revenueAccountId),
  check('revenue_schedule_bounds_chk', sql`${t.recognisedMinor} >= 0 and ${t.recognisedMinor} <= ${t.netRecognisableMinor}`),
]);
```

### 15.2 Settlement and reconciliation

```ts
export const settlementReportStatusEnum = pgEnum('settlement_report_status', ['uploaded', 'parsed', 'matched', 'posted', 'rejected']);
export const reconRunKindEnum = pgEnum('reconciliation_run_kind', ['integrity', 'provider_daily', 'settlement', 'bank', 'month_end']);
export const reconItemKindEnum = pgEnum('reconciliation_item_kind', [
  'paid_not_fulfilled', 'fulfilled_not_paid', 'duplicate_payment', 'duplicate_purchase', 'amount_mismatch',
  'fee_variance', 'settlement_unmatched_provider', 'settlement_unmatched_system', 'bank_unmatched', 'unsettled_aged',
  'refund_stuck', 'chargeback', 'missing_invoice', 'journal_imbalance', 'credit_balance_drift', 'other']);
export const reconItemStatusEnum = pgEnum('reconciliation_item_status', ['open', 'investigating', 'resolved', 'written_off']);

export const settlementReport = pgTable('settlement_report', {
  id: pk(),
  provider: paymentProviderEnum('provider').notNull(),
  periodStart: date('period_start', { mode: 'string' }).notNull(),
  periodEnd: date('period_end', { mode: 'string' }).notNull(),
  currency: currencyCol().notNull(),
  fileR2Key: text('file_r2_key').notNull(),                       // private-uploads/settlements/...
  fileSha256: char('file_sha256', { length: 64 }).notNull(),
  parserProfile: text('parser_profile').notNull(),                // config key for column mapping
  grossMinor: amountMinor('gross_minor'),
  feeMinor: amountMinor('fee_minor'),
  withheldTaxMinor: amountMinor('withheld_tax_minor'),
  netMinor: amountMinor('net_minor'),
  expectedBankCreditMinor: amountMinor('expected_bank_credit_minor'),
  bankCreditMinor: amountMinor('bank_credit_minor'),
  bankReference: text('bank_reference'),
  bankCreditDate: date('bank_credit_date', { mode: 'string' }),
  status: settlementReportStatusEnum('status').notNull().default('uploaded'),
  uploadedBy: uuid('uploaded_by').notNull().references(() => user.id, { onDelete: 'restrict' }),
  postedJournalId: uuid('posted_journal_id').references(() => ledgerJournal.id, { onDelete: 'set null' }),
  ...timestamps(),
}, (t) => [
  uniqueIndex('settlement_report_file_uq').on(t.provider, t.fileSha256),
  index('settlement_report_period_idx').on(t.provider, t.periodStart),
  index('settlement_report_uploaded_by_idx').on(t.uploadedBy),
  index('settlement_report_journal_idx').on(t.postedJournalId),
]);

export const settlementLine = pgTable('settlement_line', {
  id: pk(),
  settlementReportId: uuid('settlement_report_id').notNull().references(() => settlementReport.id, { onDelete: 'cascade' }),
  providerTxnId: text('provider_txn_id'),                         // bank_tran_id / trxID / Paddle txn_
  merchantRef: text('merchant_ref'),                              // tran_id
  txnType: text('txn_type').notNull(),                            // 'sale' | 'refund' | 'chargeback' | 'fee' | 'adjustment'
  grossMinor: amountMinor('gross_minor').notNull(),
  feeMinor: amountMinor('fee_minor').notNull().default(0),
  taxOnFeeMinor: amountMinor('tax_on_fee_minor').notNull().default(0),
  netMinor: amountMinor('net_minor').notNull(),
  currency: currencyCol().notNull(),
  txnAt: tstz('txn_at'),
  settledOn: date('settled_on', { mode: 'string' }),
  paymentId: uuid('payment_id').references(() => payment.id, { onDelete: 'set null' }),
  refundId: uuid('refund_id').references(() => refund.id, { onDelete: 'set null' }),
  matchStatus: text('match_status').notNull().default('unmatched'), // matched | unmatched | variance
  raw: jsonb('raw').$type<Record<string, unknown>>().notNull(),
  rawSchemaVersion: schemaVersionCol('raw_schema_version'),
}, (t) => [
  index('settlement_line_report_idx').on(t.settlementReportId),
  index('settlement_line_payment_idx').on(t.paymentId),
  index('settlement_line_refund_idx').on(t.refundId),
  index('settlement_line_txn_idx').on(t.providerTxnId),
  index('settlement_line_unmatched_idx').on(t.settlementReportId).where(sql`${t.matchStatus} <> 'matched'`),
]);

export const reconciliationRun = pgTable('reconciliation_run', {
  id: pk(),
  kind: reconRunKindEnum('kind').notNull(),
  provider: paymentProviderEnum('provider'),
  businessDate: date('business_date', { mode: 'string' }).notNull(),
  settlementReportId: uuid('settlement_report_id').references(() => settlementReport.id, { onDelete: 'set null' }),
  startedAt: tstz('started_at').notNull().defaultNow(),
  finishedAt: tstz('finished_at'),
  summary: jsonb('summary').$type<Record<string, unknown>>().notNull().default(sql`'{}'::jsonb`),   // counts/values per check
  summarySchemaVersion: schemaVersionCol('summary_schema_version'),
  openItems: integer('open_items').notNull().default(0),
  signedOffBy: uuid('signed_off_by').references(() => user.id, { onDelete: 'restrict' }),
  signedOffAt: tstz('signed_off_at'),
}, (t) => [
  uniqueIndex('reconciliation_run_uq').on(t.kind, t.provider, t.businessDate),
  index('reconciliation_run_signoff_idx').on(t.signedOffBy),
  index('reconciliation_run_report_idx').on(t.settlementReportId),
]);

export const reconciliationItem = pgTable('reconciliation_item', {
  id: pk(),
  runId: uuid('run_id').notNull().references(() => reconciliationRun.id, { onDelete: 'cascade' }),
  kind: reconItemKindEnum('kind').notNull(),
  severity: text('severity').notNull().default('medium'),         // low | medium | high | critical
  status: reconItemStatusEnum('status').notNull().default('open'),
  orderId: uuid('order_id').references(() => order.id, { onDelete: 'set null' }),
  paymentId: uuid('payment_id').references(() => payment.id, { onDelete: 'set null' }),
  settlementLineId: uuid('settlement_line_id').references(() => settlementLine.id, { onDelete: 'set null' }),
  amountMinor: amountMinor('amount_minor'),
  currency: currencyCol(),
  ownerUserId: uuid('owner_user_id').references(() => user.id, { onDelete: 'set null' }),
  dueAt: tstz('due_at'),
  resolution: text('resolution'),
  resolvedBy: uuid('resolved_by').references(() => user.id, { onDelete: 'set null' }),
  resolvedAt: tstz('resolved_at'),
  dedupeKey: text('dedupe_key').notNull(),                         // e.g. `${kind}:${paymentId}`
  ...timestamps(),
}, (t) => [
  uniqueIndex('reconciliation_item_dedupe_uq').on(t.dedupeKey).where(sql`${t.status} in ('open','investigating')`),
  index('reconciliation_item_run_idx').on(t.runId),
  index('reconciliation_item_open_idx').on(t.status, t.dueAt).where(sql`${t.status} in ('open','investigating')`),
  index('reconciliation_item_order_idx').on(t.orderId),
  index('reconciliation_item_payment_idx').on(t.paymentId),
  index('reconciliation_item_line_idx').on(t.settlementLineId),
  index('reconciliation_item_owner_idx').on(t.ownerUserId),
  index('reconciliation_item_resolver_idx').on(t.resolvedBy),
]);

export const exportReceipt = pgTable('export_receipt', {          // Bangladesh Bank evidence (§12.1)
  id: pk(),
  provider: paymentProviderEnum('provider').notNull(),
  payoutRef: text('payout_ref').notNull(),
  serviceDateFrom: date('service_date_from', { mode: 'string' }).notNull(),
  serviceDateTo: date('service_date_to', { mode: 'string' }).notNull(),
  repatriationDue: date('repatriation_due', { mode: 'string' }).notNull(),   // earliest service date + 4 months [VERIFY-CA]
  foreignAmountMinor: amountMinor('foreign_amount_minor').notNull(),
  foreignCurrency: currencyCol('foreign_currency').notNull(),
  bdtCreditedMinor: amountMinor('bdt_credited_minor'),
  bankReference: text('bank_reference'),
  receivedOn: date('received_on', { mode: 'string' }),
  adDocsR2Key: text('ad_docs_r2_key'),
  ...timestamps(),
}, (t) => [uniqueIndex('export_receipt_payout_uq').on(t.provider, t.payoutRef)]);
```

### 15.3 Payees and payouts

```ts
export const engagementTypeEnum = pgEnum('engagement_type', ['asset_fee', 'royalty', 'grader_item', 'rater_item', 'hourly', 'bonus', 'other']);
export const payoutMethodEnum = pgEnum('payout_method', ['bank', 'bkash', 'nagad', 'foreign_remittance']);
export const payoutStatementStatusEnum = pgEnum('payout_statement_status', ['draft', 'sent_for_review', 'disputed', 'approved_pending', 'approved', 'paid', 'failed', 'void']);

export const payeeProfile = pgTable('payee_profile', {
  id: pk(),
  userId: uuid('user_id').references(() => user.id, { onDelete: 'restrict' }),   // null for external vendors
  legalName: text('legal_name').notNull(),
  taxCategory: text('tax_category').notNull(),                     // key into finance_setting withholding matrix
  tinEnc: text('tin_enc'),                                         // encrypted (D7), nullable
  nidEnc: text('nid_enc'),
  residency: char('residency', { length: 2 }).notNull().default('BD'),
  method: payoutMethodEnum('method').notNull(),
  accountEnc: text('account_enc').notNull(),                       // bank acct/IBAN or bKash number, encrypted
  accountMask: text('account_mask').notNull(),
  detailsVerifiedAt: tstz('details_verified_at'),
  detailsChangedAt: tstz('details_changed_at'),
  contractMediaId: uuid('contract_media_id').references(() => mediaAsset.id, { onDelete: 'set null' }),
  active: boolean('active').notNull().default(true),
  ...timestamps(),
}, (t) => [
  uniqueIndex('payee_user_uq').on(t.userId).where(sql`${t.userId} is not null`),
  index('payee_contract_idx').on(t.contractMediaId),
]);

export const payoutStatement = pgTable('payout_statement', {
  id: pk(),
  number: text('number').notNull(),                                // 'PS-2026-11-0042'
  payeeId: uuid('payee_id').notNull().references(() => payeeProfile.id, { onDelete: 'restrict' }),
  periodStart: date('period_start', { mode: 'string' }).notNull(),
  periodEnd: date('period_end', { mode: 'string' }).notNull(),
  currency: currencyCol().notNull().default('BDT'),
  grossMinor: amountMinor('gross_minor').notNull(),
  adjustmentsMinor: amountMinor('adjustments_minor').notNull().default(0),   // clawbacks, carry-forward (negative)
  withholdingBps: smallint('withholding_bps').notNull(),
  withholdingMinor: amountMinor('withholding_minor').notNull(),
  netMinor: amountMinor('net_minor').notNull(),
  status: payoutStatementStatusEnum('status').notNull().default('draft'),
  preparedBy: uuid('prepared_by').notNull().references(() => user.id, { onDelete: 'restrict' }),
  approvedBy: uuid('approved_by').references(() => user.id, { onDelete: 'restrict' }),
  approvalTwoFaMethod: text('approval_two_fa_method'),            // 'totp' | 'passkey'; step-up at approval
  approvedAt: tstz('approved_at'),
  paidAt: tstz('paid_at'),
  paymentReference: text('payment_reference'),                     // bank ref / bKash trxID
  batchId: uuid('batch_id'),
  pdfR2Key: text('pdf_r2_key'),
  pdfSha256: char('pdf_sha256', { length: 64 }),
  journalId: uuid('journal_id').references(() => ledgerJournal.id, { onDelete: 'set null' }),
  tdsChallanRef: text('tds_challan_ref'),
  ...timestamps(),
}, (t) => [
  uniqueIndex('payout_statement_number_uq').on(t.number),
  uniqueIndex('payout_statement_period_uq').on(t.payeeId, t.periodStart, t.periodEnd, t.currency),
  index('payout_statement_status_idx').on(t.status, t.periodEnd),
  index('payout_statement_prepared_idx').on(t.preparedBy),
  index('payout_statement_approved_idx').on(t.approvedBy),
  index('payout_statement_journal_idx').on(t.journalId),
  index('payout_statement_batch_idx').on(t.batchId),
  check('payout_statement_net_chk', sql`${t.netMinor} = ${t.grossMinor} + ${t.adjustmentsMinor} - ${t.withholdingMinor}`),
  check('payout_statement_four_eyes_chk', sql`${t.approvedBy} is null or ${t.approvedBy} <> ${t.preparedBy}`),
]);

export const payoutStatementLine = pgTable('payout_statement_line', {
  id: pk(),
  statementId: uuid('statement_id').notNull().references(() => payoutStatement.id, { onDelete: 'cascade' }),
  engagement: engagementTypeEnum('engagement').notNull(),
  description: text('description').notNull(),
  quantity: integer('quantity').notNull().default(1),
  rateMinor: amountMinor('rate_minor'),                            // per-asset / per-item rate
  baseMinor: amountMinor('base_minor'),                            // royalty base
  shareBps: smallint('share_bps'),                                 // 1000 = 10% (D12)
  amountMinor: amountMinor().notNull(),                            // negative for clawbacks
  courseId: uuid('course_id').references(() => course.id, { onDelete: 'restrict' }),
  orderItemId: uuid('order_item_id').references(() => orderItem.id, { onDelete: 'restrict' }),
  evaluationRequestId: uuid('evaluation_request_id').references(() => evaluationRequest.id, { onDelete: 'restrict' }),
  assetRef: text('asset_ref'),                                     // lesson/question-set id for capitalisation (§3.9)
}, (t) => [
  index('payout_line_statement_idx').on(t.statementId),
  index('payout_line_course_idx2').on(t.courseId),
  index('payout_line_item_idx2').on(t.orderItemId),
  index('payout_line_eval_idx').on(t.evaluationRequestId),
  uniqueIndex('payout_line_order_item_uq').on(t.statementId, t.orderItemId).where(sql`${t.orderItemId} is not null`),
]);

export const financeSetting = pgTable('finance_setting', {          // rates/thresholds; never constants in code
  key: text('key').primaryKey(),                                   // 'vat.regime', 'tds.professional_bps', 'refund.approval_threshold_bdt', ...
  value: jsonb('value').$type<unknown>().notNull(),
  validFrom: date('valid_from', { mode: 'string' }).notNull(),
  verifiedByCaOn: date('verified_by_ca_on', { mode: 'string' }),   // null = unverified: UI shows a warning; payout approval blocks on unverified rates
  updatedBy: uuid('updated_by').references(() => user.id, { onDelete: 'set null' }),
  updatedAt: tstz('updated_at').notNull().defaultNow(),
}, (t) => [index('finance_setting_updated_by_idx').on(t.updatedBy)]);
```

### 15.4 Others (short)

- `fx_rate(date, from_ccy, to_ccy, rate, source)` — daily reference rate, manually loaded P1.
- `chargeback_case(payment_id, provider_case_id, opened_at, respond_by, status, evidence_r2_key, outcome, fee_minor)`.
- `foreign_vendor_payment(vendor, invoice_ref, amount_minor, currency, paid_on, rc_vat_minor, bank_advice_r2_key)`.
- `scholarship_award(user_id, product_id, discount_bps, kind, funded_by, approved_by, evidence_note, budget_period)`.
- `product.vat_class` enum column (§8.1) and `order_item.recognition_method` text (default per `product_kind`).
- `invoice` additions per §8.3 (`series`, `exemption_legend`, `issued_at` time component) — reconcile with the divergent column sets in `05` and `10` §6.1 (05 wins on names).
- `audit_log.action` values: `finance.period.close`, `finance.journal.manual`, `finance.settlement.upload|post`, `finance.recon.signoff`, `payout.*`, `payee.details.change`, `chargeback.*`, `finance.setting.change`.
- Permissions (`packages/auth/src/permissions.ts`): `ledger:read`, `ledger:post_manual`, `period:close` (admin), `settlement:upload`, `reconciliation:resolve`, `payout:prepare`, `payout:approve` (admin, step-up 2FA), `payee:manage`, `finance_setting:write` (admin), `chargeback:manage`.

### 15.5 Constraints to test

Journal balance trigger; closed-period immutability; four-eyes check; idempotent repost (same source twice → one journal); deferred roll-forward invariant; amount rounding of `vatFromInclusive`; settlement import idempotent by file hash; royalty base never includes payee's own orders.

---

## 16. Finance console screens (`/finance/**`, role `finance`)

Daily digest · Orders & payments (filter by mismatch) · Reconciliation (runs, items, upload) · Settlements · Bank import · Refunds queue · Chargebacks · Payees · Payout statements and batches · Revenue & deferred · VAT/Mushak (invoice register, return support) · Foreign payments & export receipts · Period close · Settings (finance_setting with "verified by CA on" column). All pages: PII masked unless `pii:read`; every export audited; read-only for `support`.

---

## 17. Accountant sign-off gate before launch

Production SSLCommerz/Paddle live credentials, public price book and payout of any creator are blocked until **all** items are signed in `docs/launch-gates/finance-signoff.md` (owner: founder + CA). Gate is linked to the business-readiness checklist (GA-061).

| # | Item | Evidence |
|---|---|---|
| G1 | Legal entity, BIN/enlistment, TIN, trade licence, DBID in hand | copies |
| G2 | VAT position decided in writing: standard 15% / startup exempt / turnover tax; effective date; interaction with education | CA letter |
| G3 | Invoice/Mushak template signed (fields §8.3, numbering, Bangla/English, credit note, e-invoicing/EFD requirement answered) | signed template PDF |
| G4 | Chart of accounts and revenue-recognition policy (§2, §3) approved, incl. instalments and Progress Promise | CA memo |
| G5 | Withholding matrix filled (rates, categories, TIN-less rate, deposit deadlines) and loaded in `finance_setting` with `verified_by_ca_on` | matrix |
| G6 | Return calendar (VAT, TDS, income tax) set with owners | calendar |
| G7 | MoR/Stripe structure decided; entity and bank route confirmed with AD bank; revenue presentation (A/B §3.6) | AD bank + CA notes |
| G8 | Repatriation, retention, Form-C rules confirmed for a company | AD bank letter |
| G9 | Refund/credit-note/chargeback treatment and VAT adjustment mechanics confirmed | CA memo |
| G10 | Credits/mock expiry (breakage) decided and in Terms (OQ-F1) | lawyer + CA |
| G11 | Contractor templates (work-for-hire, royalty schedule, grader/rater) reviewed by lawyer; payee onboarding docs defined | templates |
| G12 | Dry run: 20 test orders (BD, intl sandbox), 2 refunds, 1 chargeback simulation, settlement file import, month-end pack → CA reviews outputs and agrees they are importable | dry-run report |
| G13 | Bank mandates: two-signatory control for payouts; payout account separation | bank letter |
| G14 | Access programme budget and VAT treatment of free access confirmed | CA memo |

CA's sign-off is a **fee-bearing engagement** (budget in `02`: add BDT 15–30k/month retainer plus BDT 50–100k setup `[P — get quotes]`).

---

## 18. Backlog tasks (`NEW-FIN-xx`) — to be merged into `12-BUILD-PLAN-AGENTS.md`

> **Final IDs: see 12 Appendix G.** The `NEW-*` IDs in this list are source IDs only; PROGRESS.md and the build loop use the final P0/P1/P2/P3 IDs (or `BG-xx` human gates) given there. Do not rewrite this list.

Phase tags follow D1. Owner models per D9. "Verify" = acceptance requires CA-confirmed value.

| ID | Phase | Task | Owner | Depends | Acceptance / verification |
|---|---|---|---|---|---|
| NEW-FIN-01 | P0/P1 | Engage chartered accountant; deliver CoA, rev-rec policy, VAT position (G1–G9) | founder | — | Signed gate items G1–G9 stored |
| NEW-FIN-02 | P1 | Schema `finance.ts`: ledger_account, financePeriod, ledger_journal/entry (append-only triggers), revenue_schedule | sonnet | P1-31 | Balance and closed-period trigger tests; fk-index test passes |
| NEW-FIN-03 | P1 | Seed CoA (§2) and `finance_setting` defaults (all unverified) | haiku | NEW-FIN-02 | Seed idempotent; unverified flag visible |
| NEW-FIN-04 | P1 | Posting service: order paid, settlement, refund, credit note, chargeback, AI cost, payouts (§4) | opus | NEW-FIN-02, P1-32 | Each event yields balanced journal; replays create no duplicates; VAT extraction unit-tested (rounding) |
| NEW-FIN-05 | P1 | `recogniseRevenue` and `recogniseConsumption` jobs + deferred roll-forward report | sonnet | NEW-FIN-04 | Roll-forward ties to entitlement control total within 0.1% in test data |
| NEW-FIN-06 | P1 | T0 integrity checks C1–C9 + daily digest email + sign-off | sonnet | NEW-FIN-04 | Seeded faults detected; digest lists counts |
| NEW-FIN-07 | P1 | Settlement upload/parse/match for SSLCommerz; parser profiles as config; aging report | sonnet | NEW-FIN-02 | Fixture file with unmatched/variance rows produces correct items; re-upload idempotent |
| NEW-FIN-08 | P1 | Reconciliation item queue UI + resolution actions (fulfil, refund, suspense, write-off) | sonnet | NEW-FIN-06/07 | Actions audited; paid-not-fulfilled resolved via `fulfilOrder` |
| NEW-FIN-09 | P1 | Update P1-36 acceptance: invoice per §8.3 checklist, credit notes, `vat_return_support`, exports in §13.1 | sonnet | P1-36, NEW-FIN-01 | CA approves sample outputs (G3) |
| NEW-FIN-10 | P1 | Payee onboarding (`payee_profile`, encrypted details, contract upload, call-back verification flow) | sonnet | NEW-FIN-02, 05 PII rules | Details encrypted; change triggers 7-day cooling; audit events |
| NEW-FIN-11 | P1 | Payout statement generation (asset fees, royalty 10%, grader/rater items), PDF EN/BN, dispute window, batch CSV, two-person approval with step-up 2FA | opus | NEW-FIN-10, P1-30 | Four-eyes constraint tested; approval blocked when withholding rate unverified; statement hides learner identity |
| NEW-FIN-12 | P1 | Royalty accrual with 14-day hold and clawbacks; excludes payee's own purchases | sonnet | NEW-FIN-11 | Refund after payout yields negative line next statement |
| NEW-FIN-13 | P1 | Refund accounting integration: contra/deferred reversal, credit note, VAT reversal, fee leakage report | sonnet | NEW-FIN-04 | Cross-period refund test |
| NEW-FIN-14 | P1 | Chargeback case tracker + evidence pack export | sonnet | NEW-FIN-02, GA-025 | Pack contains logs and consent; deadline alerts |
| NEW-FIN-15 | P1 | Finance dashboards (§13.2) v1 (cash entry manual, deferred, billings vs revenue, payments health, refunds, burn/runway) | sonnet | NEW-FIN-05 | Numbers tie to exports |
| NEW-FIN-16 | P1 | Month-end close workflow (checklist state in `finance_period`), period lock | sonnet | NEW-FIN-06/07/05 | Closed period rejects postings; reopen needs `super_admin` + reason |
| NEW-FIN-17 | P1 | Paddle (or Stripe) payout import + `export_receipt` with 4-month alerts | sonnet | NEW-FIN-07, P1-3x intl | Alert on > 3-month-old unreceived; export includes AD docs link |
| NEW-FIN-18 | P1 | Foreign vendor payment schedule + reverse-charge calc | haiku | NEW-FIN-02 | Report ties to bank advice |
| NEW-FIN-19 | P1 | `vat_class` per product, regime setting with effective dates; invoice `tax_mode` selection | sonnet | NEW-FIN-01 | Switching regime changes only future invoices |
| NEW-FIN-20 | P1 | Bank statement import (CSV) and three-way match | sonnet | NEW-FIN-07 | Bank variance items generated |
| NEW-FIN-21 | P1 | Pre-launch finance dry run (G12) | opus | all above | Dry-run report accepted by CA |
| NEW-FIN-22 | P2 | bKash/Nagad direct statement parsers + disbursement API payouts (if eligible) | sonnet | P2 direct gateways | Fixture tests |
| NEW-FIN-23 | P2 | Instalment receivable tracking, dunning, access pause | sonnet | D10 instalments | Overdue handling per policy |
| NEW-FIN-24 | P2 | Affiliate commission accrual and payouts | sonnet | P2-06 | Reversed on refund within hold |
| NEW-FIN-25 | P2 | Scholarship awards + access-programme report + budget guard | sonnet | NEW-FIN-02 | Budget exceeded blocks new awards |
| NEW-FIN-26 | P2 | B2B invoicing (BIN, PO, terms), seat refund rules | sonnet | org accounts | Invoice shows BIN; AR aging |
| NEW-FIN-27 | P2 | Breakage sweep (once OQ-F1 decided) | haiku | NEW-FIN-05 | Expired credits post to 4310 |
| NEW-FIN-28 | P2 | Bank feed/API integration; accounting-software export (CSV/journal import format agreed with CA) | sonnet | NEW-FIN-20 | CA imports without manual fixes |
| NEW-FIN-29 | P3 | Marketplace payouts automation merged with `payout`/`payout_line` | opus | P3-02 | Migration from `payout_statement` lossless |
| NEW-FIN-30 | P1 | Progress Promise provision computation and claim integration | haiku | guarantee_claim | Provision report quarterly |
| NEW-FIN-31 | P1 | Update `02` §8.4/A14 (12% → 10% on own course only), §8.1 (reverse-charge cost), §11 (CA retainer), §10.4 (finance part-time) | haiku | — | Docs changed; D12 referenced |

### Open questions

| ID | Question | Needed by |
|---|---|---|
| OQ-F1 | Do credits/mocks expire (12 months?) and does Terms say so? | Before price book freeze / G10 |
| OQ-F2 | Royalty on passes/bundles — none in P1? | Before instructor contracts |
| OQ-F3 | Revenue timing: straight-line from day 1 vs after refund window? | CA, G4 |
| OQ-F4 | MoR revenue presentation (gross vs net) and entity (Paddle vs Stripe via foreign entity) | G7 |
| OQ-F5 | Which VAT regime applies; are prices still VAT-inclusive? | G2, before 17 freeze |
| OQ-F6 | Disbursement channel for small payouts (bKash business product eligibility) | NEW-FIN-11 |
| OQ-F7 | Instalment access gating on missed payment and VAT point of tax | Doc 26 + CA |

### Cross-doc changes required

- `00` D12 C19: add reference to this doc for payout cycle and withholding.
- `02` §8.1 (reverse-charge VAT cost), §8.4 (royalty 10%), §10.4 (CA retainer), §11.4 (use of funds).
- `05`: add finance tables (§15) to §4.8/§11; reconcile `invoice` columns with `10` §6.1; `payout` (P3) superseded by `payout_statement` as superset.
- `06`: `reconcile-payments` description; new services under `core/finance`.
- `10`: §2.7 settlement job → T2 procedures here; §6 → G3 gate; §5.6 → §12.
- `12`: add NEW-FIN tasks; P1-36 acceptance.
- `11`: business readiness checklist (G1–G14).
