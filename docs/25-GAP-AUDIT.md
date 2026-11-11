# 25 — Independent Gap Audit (principal review)

> Reviewer stance: CTO + product + operations. Scope: `README.md`, `00`–`13`, `PROGRESS.md`, `HANDOFF.md`, `build-kit/`. Not reviewed as gaps (being written in parallel): 14 IELTS curriculum, 15 GRE/other curriculum, 16 content sourcing, 17 pricing master, 18 live classes, 19 marketing BD, 20 marketing intl, 21 admissions/Common App, 22 engineering guardrails, 23 design research, 24 timeline. Where an existing doc must link to them, that is listed in section 5.
> Method: outlines + targeted reads and keyword sweeps across all files (no full read of the 19k-line corpus). Absence claims below were verified with grep across `docs/` and `build-kit/`; "not found" means no hit, not "unlikely".
> Date: 2026-11-07. Severity scale: **Critical** = build/launch blocked or money/legal/exam-integrity exposure; **High** = will cause rework or a visible launch defect; **Medium** = quality/operability debt; **Low** = polish.

---

## 1. Summary — top 15 gaps by severity

| Rank | ID | Sev | One-line |
|---|---|---|---|
| 1 | GA-001 | Critical | D10 tier framework (Free/Core/Plus/Live/Mentor, regions A/B/C, instalments, scholarships, partner codes, human-review packs) exists only in `00`; absent from `03`, `05`, `06`, `08`, `12`. `product_kind` enum cannot even represent the products. |
| 2 | GA-002 | Critical | Legal content is a checklist, not text. `P1-42` builds Terms/Privacy/Refund/AI-scoring/Trademark pages with no drafts and no lawyer-review gate or owner. |
| 3 | GA-003 | Critical | Support desk is specified (F-SUP-04, SLA timers, macros, CSAT) but has **no table in 05, no service in 06, no backlog task, no helpdesk tool decision**. |
| 4 | GA-004 | Critical | At least 14 P1-tagged features in `03` have no task in `12` (vocab/SRS, onboarding wizard, practice sessions, mistake notebook, error reports, in-app notifications, reviews, PWA, feature-flag admin UI, test-form builder, help centre, certificates, accommodations, `/tools/*`). The rule "nothing is built that is not a task" means they will not be built. |
| 5 | GA-005 | Critical | Beginner environment setup is not executable: local Docker Postgres vs required `neon-serverless` WebSocket driver is unresolved; `.claude/settings.json` denies `Read(./.env.*)` which blocks `.env.example`; no prerequisites/OS guide. |
| 6 | GA-006 | Critical | AI-scoring calibration is under-budgeted ~5–10x and has no rater programme: `07` §7.9 needs ≥200–400 double-rated responses per 5 task families + 25 accents; `02` §10.2 funds 200 essays + 60 recordings (BDT 0.18M). |
| 7 | GA-007 | High | No exam-disruption policy (BD power cuts / ISP drops / device crash): D6 gives a 30 s grace only; no void/credit/re-sit rule, no learner UX, no support tool beyond `grantAccommodation`. Accommodation workflow (07 OQ-2) still undecided and phase-conflicted. |
| 8 | GA-008 | High | Instructor / grader / item-writer contracts, pay, payout and withholding-tax handling missing; payouts are P3 but `02` books a 12% royalty from Year 1 and graders must be paid in P1. |
| 9 | GA-009 | High | No notification/lifecycle catalogue (event → channel → template → timing → opt-out class). `10` §11.1 lists 13 templates; missing onboarding/abandoned-checkout/security/test-reminder/dunning/org/deletion/export mails; `P1-40` covers 5. |
| 10 | GA-010 | High | Phase contradictions: certificates P2 in `03` but sold in Core/Complete at P1; study plan P1 in `03` but P2 in D1/`12`; Plus tier "weekly live Q&A" vs live classes P2; Free tier "community" vs community P2. |
| 11 | GA-011 | High | Finance operations missing: gateway settlement reconciliation vs bank/MFS, month-end close, Mushak/VAT filing cadence, Paddle/Stripe payout to a BD bank and repatriation, accountant sign-off gate. All Mushak fields are `[U]`. |
| 12 | GA-012 | High | Free-tier AI allowance has four different values across `00`, `02`, `07`, `09`; AI cost per evaluation has three different values across `02`, `04`, `07`; speaking credit unit differs between `02` and `07`. |
| 13 | GA-013 | High | Retention/deletion contradictions: speaking audio 90 d (`09`) vs 180 d (`05`, `07`); deletion grace 14 d (`03`) vs 7 d (`09`). Privacy policy will state one. |
| 14 | GA-014 | High | Score guarantee / Mentor "free re-enrol if target not met" (D10) contradicts `03` §11 Q4 "Do not offer at launch" and has no terms, eligibility proof, or data model. |
| 15 | GA-015 | High | KPIs in `02` §14 are not mapped to PostHog events, dashboards or owners; event taxonomy is "to be catalogued" in `P1-44`; A/B pricing test (`02` L7) conflicts with the "price shown = checkout price, one price list" rule and has no assignment/consistency design. |

---

## 2. Full findings table

Owner-doc legend: existing = `0x`/`1x`; NEW-x = proposed in section 4; `14`–`24` are the parallel docs.

### 2.1 Product completeness

| ID | Sev | Area | Finding (file:section) | Why it matters | Recommended fix | Owner |
|---|---|---|---|---|---|---|
| GA-001 | Critical | Commerce model | `00` D10 defines tiers, Plus/Live/Mentor perks, add-ons (human review packs, single speaking mock, printed books), 3 PPP regions, bKash instalments, verified-need scholarships, partner codes, English Foundation track. `05` §4 `productKindEnum` = `['course','bundle','test_pack','ai_credits','pass','live_batch','org_seat_pack']` (05:525); `price.currency` comment `'BDT' \| 'USD'` only (05:1784); no region/tier/instalment/scholarship/partner-code entity in 05; grep for "instal", "partner code", "English Foundation", "regional pric" = 0 hits in 05/06/12. `02` §7.2 still has a single USD book and no Plus/Live/Mentor. | Checkout, entitlements, refunds and the pricing page cannot implement the business model; agents will invent schema. | In `17` define a **tier → entitlement bundle** matrix and region price books; then add to `05`: `product_kind` += `human_review_pack`, `speaking_mock`, `physical_good`; `price_region`, `tier` attribute on product, `installment_plan`/`installment`, `scholarship_application`, `partner_code`. Add `06` services + `12` tasks (P1 vs P2 explicit). Update `02` §7 as pointer only. | 17 → 05, 06, 03, 08, 12 |
| GA-002 | Critical | Legal | `03` sitemap lists `/legal/terms|privacy|refund-policy|cookies|trademark-notice|ai-scoring-policy` (03:171); `09` §13.5 is a checklist; `P1-42` = "Legal pages + cookie consent". No drafted text, no per-clause decisions (governing law, arbitration, AI-score disclaimer, minors, instalment default, guarantee terms, DMCA/takedown), no lawyer-review gate task. | Legal copy written by an agent without a template becomes the shipped policy; refund/AI/trademark claims are the highest-liability text. | Create `26` with bilingual drafts + decision list + "lawyer review" gate task before P1-54. Add accessibility statement, cookie policy table (cookie inventory), sub-processor page (`docs/processors.md`, referenced in 09:1245 but absent). | NEW-26 + 09, 12 |
| GA-003 | Critical | Support ops | `03` F-SUP-04 (tickets, SLA timers, macros en/bn, CSAT), `/support/tickets`, `/app/support`; `02` §10.3 4 h first response. `05`/`06`: grep "ticket" = 0 schema/service hits (only unrelated). No `support_ticket`, `ticket_message`, `macro`, `csat` tables; no tool decision (build vs Chatwoot/Crisp/Freshdesk/Help Scout); `P1-54` only says "support macros". | Launch day failure mode: money-deducted-no-access tickets arrive by WhatsApp with nowhere to be tracked; SLA measure impossible. | Decide build-vs-buy in `27` (recommended: buy/open-source helpdesk for P1, integrate order/user lookup via signed deep links; build native tickets only P2). If build: add tables, service, tasks. Define categories, priority, SLA tiers, escalation ladder, macros list, WhatsApp handling (P2 in D3 but `02` L4 uses WhatsApp in P1). | NEW-27 + 05, 06, 12 |
| GA-004 | Critical | Backlog coverage | Spec'd P1 items without a task in `12` §11 (grep of titles): F-VOC-* vocabulary SRS (03:499–508, `/app/vocab`); F-ONB-01..06 goal wizard + under-18 consent path (the only onboarding task is P0-31 settings); `/app/practice` custom quiz + session player + history; mistake notebook (`/app/mistakes`); F-ERR-01..03 error reports + editor inbox (`/editor/reports`); in-app notification inbox/bell (table exists 05:2860, no UI task); reviews/ratings (F-REV); PWA manifest/service worker (03 §8.4 marked P1); F-ADM-03 flag admin UI (`/admin/feature-flags`); test-form builder/assembler + `assertPublishable` UI (07 §8.2/8.4 — P1-09 is questions only); help centre CMS F-CMS-04; certificates F-CERT-01 (see GA-010); `/tools/*` calculators (03:156–161 P1); item statistics/retirement (07 §8.6); org invite acceptance emails; low-bandwidth mode F-LOWBW. | The loop says "Pick the first unchecked task… Nothing is built that is not a task" (12 §1, PROGRESS header). Launch will ship without core learner features. | Run a feature→task traceability pass: for every `F-*` with P1, ensure ≥1 task ID; add a CI check (`tooling/trace.ts`) that fails if a P1 feature ID has no backlog reference (03 Appendix A/B already hint at this mapping). Add ~15–20 tasks. Also add tasks for runbooks (`docs/runbooks/`), `docs/processors.md`, status-page content. | 12, 03, PROGRESS |
| GA-010 | High | Phase consistency | See contradictions C4, C5, C20, C21. Certificates: F-CERT-01 `P2` (03:586) yet D10 Core "certificate" and `02` §7.2 course positioned with certificate, `10` §13 specs issuance; no backlog task in any phase for F-CERT-01..04. Study plan: F-PLAN-01 `P1 ◆` and F-ONB-02 vs D1 P2 "study plans" and `12` P2-03. | Marketing promises features the phase plan does not deliver. | Decide per feature in `00` D1 (edit first), then propagate; add change-log line. | 00 → 03, 12, 02, 17 |
| GA-016 | Medium | Help centre / FAQ | F-CMS-04 help centre P1 (03:780) and `/help` route exist; content is not authored or scoped: no article list (payment failed, OTP not received, refund, exam crashed, mic permission, band score meaning), no ownership. FAQ copy for JSON-LD `FAQPage` (F-CAT-04) not planned. | Support deflection is the cheapest SLA lever; empty help centre at launch. | Add article inventory (~40 articles en/bn) to `27`; Haiku task to draft, support to verify; link each error state in the app to an article ID. | NEW-27, 16, 12 |
| GA-017 | Medium | SEO | Base is solid (sitemap, hreflang, JSON-LD, AC-IA-02, P0-42, P1-43). Missing: schema-per-page-type matrix (Course, Product/Offer, FAQ, Article, VideoObject, BreadcrumbList, Organization, EducationalOccupationalCredential), sitemap index split by locale/type with `lastmod`, Bangla-specific SEO (title length, transliteration queries, `bn` canonical rules), programmatic landing pages policy (score-target, country pages for 20), redirect/URL-change policy, Search Console/Bing setup, Core Web Vitals field monitoring, robots rules for `/exam/*`, `/verify/*`, staging `noindex`. | Organic is the cheapest BD acquisition channel (02 §9); SEO retrofits are costly. | Add SEO technical spec as a section of `03` §2.3 or into `19`/`20` with a checklist; add Lighthouse CI SEO assertions. | 03, 19, 20 |
| GA-018 | Medium | Blog / CMS | F-CMS-02/03 exist; no editorial calendar owner, no author profile/E-E-A-T rules, no content licensing review in blog flow, no preview/scheduled-publish test, RSS (`/feed.xml`) only listed. | Thin content/AI-content risk; trademark mistakes ("IELTS" in URLs is allowed nominatively but not brand/domain). | Covered partly by `16`/`19`; add publishing checklist (trademark, sources, update dates) to `03` §9. | 16, 19, 03 |
| GA-019 | Medium | Cookie banner / consent | `09` §13.4, `10` §14 specify PostHog gating; no UI spec for the banner (categories, first-layer buttons equal prominence, Bangla copy, re-open link, storage of `consent_record`, geo behaviour BD vs EU/UK). No cookie inventory. | EU/UK users are targeted (02); non-compliant banner is the most common GDPR enforcement item. | Add component spec to `08` + inventory table in `26`; task in `12` (merge into P1-42). | 08, NEW-26 |
| GA-020 | Medium | Accessibility statement | Mentioned (08:2182, 03 A-15) but no content/owner; no accommodations request page for learners. | WCAG claims need a dated conformance statement. | Draft in `26`; link to GA-007 accommodations flow. | NEW-26 |
| GA-021 | Medium | Refund UI | F-PAY-09 + AC exist. Missing: partial-refund UI for bundles/passes, refund of instalments (GA-001), refund to bKash/Nagad timing copy (`10` marks ETA `[U]`), SSLCommerz refund is partly manual (02:366) — no finance SOP; learner-facing status page for refund states. | Refunds are the top dispute generator in BD ed-tech. | SOP in `NEW-30`; copy in `26`; add refund timeline states to `08` Orders page. | NEW-30, 08 |
| GA-022 | Medium | Onboarding emails | Only `welcome` template (10:§11.1). No D0/D1/D3/D7 sequence for free users, no diagnostic follow-up, no abandoned-cart, no win-back, no exam-date countdown, no post-purchase "how to start". | Free→paid funnel (02 §9.1) depends on lifecycle mail; none designed. | See GA-009 / `NEW-29`. | NEW-29 |
| GA-023 | Low | Error pages | `global-error.tsx`, `not-found.tsx` listed (04:156); 06 error code table; no designed 403/429/maintenance/offline pages in `08` with Bangla copy. | Visible polish and support deflection. | Add 5 pages to `08` §states + copy. | 08 |

### 2.2 Operations

| ID | Sev | Area | Finding | Why it matters | Fix | Owner |
|---|---|---|---|---|---|---|
| GA-008 | High | Instructor / grader contracts & payouts | Contracts: only "Instructor agreement requires warranty of originality and indemnity" (03:1439). Payout and royalty: `02` §8.4/§11 deduct **12% instructor/item royalty from Year 1** (A14); `05` `revenue_share_bps default 0 // P3` (05:1047); `06` `computeInstructorPayouts` (P3); `P3-02`. So P1/P2 instructors, item writers and **graders** have no payment mechanism; "rate set by finance" (07:§7.8). No KYC, no TIN/withholding (grep "TDS|withholding" only 05 twice, unrelated), no per-piece vs royalty options, no IP assignment/licence terms, no payout method (bKash/bank), no tax forms for foreign instructors. | Paying people off-platform without records breaks audit and royalty accounting; IP ownership of course videos is the most valuable asset. | In `NEW-30`: engagement types (salaried / per-item / royalty / hourly grader), contract templates (IP assignment, takedown warranty, non-compete scope, exclusivity), onboarding checklist, payout calendar, BD AIT/TDS rates `[LEGAL]`, minimum viable manual payout export from `finance` console in P1 (CSV + `payout` rows) rather than waiting for P3. | NEW-30, 16, 05, 06 |
| GA-024 | High | Grader operations | Workflow and SLA exist (07 §7.10). Missing: recruitment pipeline, qualification test, training on rubric, pay rate card, workload caps, fatigue rules, availability calendar, no-show escalation, replacement of graders in-flight, confidentiality agreement, access revocation, quality dashboards owner (`admin`/`content_editor`?), handling of graders who are also instructors (conflict). 02 §10.4 has no grader headcount. | 48 h SLA (07) and "2 human essay reviews" in Plus tier (D10) require a trained pool; a queue without graders = refunds. | `NEW-27` grader section: pool size model (reviews/day by tier forecast), QWK-based onboarding/probation, rates, SLA breach compensation. Add to 02 team plan. | NEW-27, 02 |
| GA-007 | High | Exam disruption & accommodations | D6: server deadline, 30 s grace, exam-mode offline replay only within grace. Nothing defines what happens when a learner loses power/internet for minutes (common in BD load-shedding), browser crashes, or the audio stalls: `extra_seconds` mentions "pause shifts, audio-stall credit" (07:1770) but no rule when each applies; no "interrupted attempt" statuses beyond `expired`; no learner UX ("report a technical problem"), no policy (re-sit credit? void and refund the mock? partial score?), no support tool to void/reset an attempt (`grantAccommodation` only extends time ≤3600 s). 07 OQ-2 accommodation workflow still open; F-MOCK-09 is P2 (03:437) while `06` ships `grantAccommodation` to support in P1 (06:1153); multipliers differ (1.25/1.5/2 in 03; 1.00–3.00 in 07; seconds ≤3600 in 06). | Exam-integrity decisions made ad hoc by support become inconsistent and abusable; BD connectivity makes this a launch-week certainty. | Add `exam-disruption policy` to `07` §5.8 + `27`: auto-detected disconnect log → learner banner → "Technical problem" ticket category → support actions (`void_attempt`, `grant_resit`, `credit_mock`) with audit; once-per-pack limits; proof for accommodations (org vs individual); unify multiplier set; set phase to P1 for minimal path. Add Playwright scenarios (offline 2 min, crash resume). | 07, 03, 06, NEW-27 |
| GA-025 | High | Fraud & chargebacks | F-PAY-11 risk hold (SSLCommerz `risk_level`), SMS pumping controls, referral self-referral note. Missing: card-testing velocity rules on `/checkout` (per-IP/per-card), policy for stolen-card MoR disputes (Paddle) and card disputes via SSLCommerz, coupon/free-trial farming (AI credits per phone/device in 09:10.2 is OK), chargeback evidence pack (access logs, watermark logs, IP), dispute SLA, fraud review queue UI. | Revenue clawback and account bans; MoR disputes have short response windows. | Add "payments risk playbook" to `NEW-30`; rules table + queue spec in `03` F-FIN; evidence export task. | NEW-30, 10, 03 |
| GA-026 | Medium | Account sharing & piracy ops | Concurrent session/watermark specs exist (09 §9, 10 §8). Missing: what support does on detection (warn → limit → suspend), thresholds, appeals, privacy review of device fingerprinting under PDPO/GDPR, takedown of leaked recordings (Telegram/Facebook groups) — a major BD reality. | Without a response ladder detection signals go unused. | Add enforcement ladder + leak-response runbook to `27`; legal basis note in `26`. | NEW-27, 09 |
| GA-027 | Medium | Content moderation | Reviews/Q&A/community moderation is P2 features (F-COM-03, F-REV-02) with `/admin/moderation` listed P1 (03:312). Missing: moderation policy (what is removed), response times, escalation for abuse/self-harm/minors, language coverage (Bangla slang/Banglish), ownership; user-generated essays and photos in tickets also need rules. | Under-18 audience (D7) raises duty of care. | Policy + SLA in `27`; keep tooling P2 but publish rules at launch. | NEW-27 |
| GA-028 | Medium | Instructor onboarding | Journey exists (03:1197) but no instructor handbook: recording standards (belongs in `16`), rubric for lesson quality, review turnaround SLA for editors, feedback loop, analytics visibility. | Content quality is the product. | Cross-reference `16`; add editor SLA (e.g., 3 business days) to 03 §3.21. | 16, 03 |
| GA-029 | Medium | Team/hiring | 02 §10.4 salaries are assumptions; no role definitions/job descriptions, no hiring trigger → role mapping other than KPIs, no bus-factor plan (founder-only on-call, 11 §7), no contractor engagement template, no security-clearance for staff with PII (background, device policy, offboarding). | One person is the single point of failure for payments/DB. | Add org chart + staff access policy (least privilege matrix by role, offboarding checklist) to `NEW-27`/`NEW-30`; cross-link `24`. | NEW-27, 02, 24 |
| GA-011 | High | Finance reconciliation & tax | `reconcile-payments` job reconciles only pending payments (06:1093). Missing: daily/weekly settlement match (gateway statements vs bank vs `payment`), fee/VAT-on-fee capture (10:832 marks as `[U]`), month-end close, VAT return cadence & Mushak 6.3 export fields all `[U]` (10 §6.1), turnover-tax enlistment, Paddle/Stripe payouts into a BD account and Bangladesh Bank rules (10:1167 only a note), FX gain/loss, refunds in different period, accountant hand-off pack, who signs. No task in `12` other than P1-36 "VAT export". | A launch without an accountant-validated invoice format risks NBR penalties; reconciliation gaps = silent revenue leakage. | `NEW-30`: month-end checklist, report definitions (`finance` console), data dictionary for accountant, gate task "accountant signs invoice template" before live SSLCommerz. Update P1-36 acceptance criteria. | NEW-30, 10, 12 |
| GA-030 | Medium | Org / B2B ops | P2 org accounts exist; missing contract/invoice flow (BIN/TIN invoice, PO, credit terms), onboarding of coaching centres, bulk import template, offboarding/data return, per-seat refund policy. | B2B is the revenue stabiliser (02 §7.4). | Short B2B ops section in `17`/`NEW-30`. | 17, NEW-30 |
| GA-031 | Low | Customer comms channels | WhatsApp support is used in plan (02 L4) while D3 lists WhatsApp Business as P2 (10 §11.3). Facebook group "not an official support channel" (03:1361). | Channel ambiguity creates unlogged support. | Decide in `27`: P1 WhatsApp = ticket intake via shared inbox. | NEW-27 |

### 2.3 Engineering

| ID | Sev | Area | Finding | Why it matters | Fix | Owner |
|---|---|---|---|---|---|---|
| GA-005 | Critical | Local environment | (a) `04` §9 local = Docker Postgres 17 (04:640) but runtime driver = `@neondatabase/serverless` Pool over WebSocket (04:539, 05:3345); a plain Postgres has no Neon WS proxy. No `neonConfig.wsProxy`/driver-switch (grep "wsproxy|neonConfig" = 0). (b) `build-kit/.claude/settings.json` `deny` includes `Read(./.env.*)`, which also blocks `.env.example` that `P0-07` must create and agents must read. (c) README "Start building in 15 minutes" assumes installed: Node (version unstated; `.nvmrc` referenced in CI but its value is not specified in 04/11), Corepack/pnpm 10, Docker, git, GitHub CLI, Claude Code; no OS-specific steps, no troubleshooting, no "first run" success check (`pnpm dev` → what URL, which seeded login). (d) Inngest Dev Server, Mailpit, Stripe/Paddle/SSLCommerz sandbox webhooks tunnelling (ngrok/cloudflared) for local IPN not documented. | First 3 tasks (P0-01..P0-12) would stall; a non-engineer founder cannot unblock. | Create `NEW-28` (prereqs, versions, copy-paste commands, `.env` bootstrapping, tunnel for IPN, expected outputs, top-15 errors). Specify `db` client factory: `drizzle-orm/node-postgres` when `DATABASE_URL` host is local, `neon-serverless` otherwise (or run `ghcr.io/timowilhelm/local-neon-http-proxy`); add test. Change deny to `Read(./.env)` + `Read(./.env.local)` + `Read(./.env.production*)` and explicitly allow `.env.example`. Pin `.nvmrc` value in `04`. | NEW-28, 04, 05, build-kit |
| GA-032 | High | Seed data / fixtures | Seed plan is thorough (05 §9.2). Gaps: seeded mock "ielts-ac-mock-001" depends on licensed/original content — placeholder band tables flagged `draft` (05:3353) but no rule that **production seed must fail** if `score_conversion` rows are still `draft`; seed passwords as `Dev!Passw0rd-<role>` (05:3355) — ensure `dev`-only; no anonymised-prod-snapshot policy for debugging. | A draft conversion table in production produces wrong band reports under the "Estimated" label of a paid product. | Add publish-gate: `assertPublishable` rejects forms whose conversion table status ≠ `verified`; seed runner guard. | 05, 07 |
| GA-033 | High | Feature flags | Two layers (04:§8.4) and 05 `feature_flag` table vs 04 text `system_setting` table (contradiction C10). F-ADM-03 UI has no task. Flag lint ("past removal date fails weekly lint") has no task. PostHog flags are consent-gated for the client but server flags need a stable identifier for logged-out users. | Kill switches are the launch safety net (11 §11); ambiguity guarantees a divergent implementation. | Fix naming in 04; add tasks (flag service, admin UI, lint). Document anonymous bucketing (cookieless hash) and cache TTLs once. | 04, 05, 12 |
| GA-034 | High | i18n workflow | `P0-29` string extraction convention, `P1-46` Haiku drafts Bangla. Missing: translation source-of-truth (JSON per namespace), ICU plural/gender rules for Bangla, glossary (e.g., "band", "mock", "credit" terms), native-speaker review gate, missing-key CI check, untranslated fallback behaviour, Bangla for AI feedback (is feedback in Bangla? `07` §7.7), Bangla for legal pages (lawyer), date/number formats (03 L-05 covers digits). No translation memory. | Machine-translated Bangla UI undermines Bangladesh-first trust; exam terms must be consistent. | `NEW-33` (or section in `08` §Bangla): glossary of ~150 terms, workflow, CI checks `i18n:check`, review roster. | NEW-33 |
| GA-035 | High | Mobile/PWA/offline | 03 §8.4 PWA P1 (manifest, service worker, offline articles/practice/flashcards, install prompt) — no backlog task (GA-004). Conflict potential: service worker caching vs CSP nonces and per-request nonce HTML (09 §5); background sync for flashcards vs exam outbox (`lumen-exam` IndexedDB) — scope rules between them unspecified; iOS Safari storage eviction for IndexedDB (7-day) affects offline exam queue and audio chunks; no policy for exam on mobile (screen ≥1024×600 recommended in 07:1970 vs BD majority-phone users). | Most BD learners are on phones; exam-mode viewport policy decides a large share of mock usage. | Add "mobile & PWA" spec: supported devices matrix for exam vs practice, SW scope exclusions (`/exam`, `/api`), storage persistence request (`navigator.storage.persist()`), iOS caveats. Add task. | 08, 07, 12 |
| GA-036 | Medium | Email deliverability | Good (SPF/DKIM/DMARC, split subdomains, bounce webhook) in 10 §11.1. Missing: BD-ISP/Gmail-specific considerations, Bangla subject line encoding test, warm-up schedule numbers, suppression-list table in 05 (`email_log` only), complaint-rate thresholds, seed-list inbox testing before launch. | OTP/receipt emails not arriving = support load. | Add thresholds + warm-up plan to 10; `email_suppression` table. | 10, 05 |
| GA-037 | Medium | File uploads | R2 presigned uploads (P0-38), MIME/size validation. Antivirus appears twice (09) but there is no mechanism/task (ClamAV on a worker? Cloudflare?); image re-encode (strip EXIF), PDF handling for support attachments, speaking audio max size/duration enforcement server-side after upload, orphan cleanup job. | Support-ticket attachments and org CSV imports are classic abuse vectors. | Add upload pipeline spec (quarantine bucket → scan → promote) to 10 §10; task. | 10, 12 |
| GA-038 | Medium | Search | pg_trgm + FTS (P0-35). Bangla FTS configuration (no Bengali text-search dictionary in Postgres; `simple` + trigram) and search relevance tests not specified; Meilisearch P3. | Bangla course/topic search is expected. | Add note + test set to 03 F-SRCH. | 03, 05 |
| GA-039 | Medium | Performance on BD networks | Budgets in 11 §8; k6 plan. Missing: real-device lab targets (low-end Android on 3G/4G), field RUM thresholds per region, image/video default quality policy (480p mobile default appears only in 04:726 note), exam shell bundle budget separate from marketing. | Lab Lighthouse ≠ BD field reality. | Add Android mid/low device test matrix, Chrome UX Report monitoring, to 11 §8. | 11 |
| GA-040 | Medium | Incident response | 11 §7 on-call = founders; status page templates under `docs/runbooks/` (not created); naming mismatch (C15). No severity matrix for exam-in-progress incidents (freeze timers? extend all active attempts?). | An outage during a scheduled mock event is an integrity incident. | Add "global exam incident" procedure: broadcast banner, bulk `time_extended`, post-mortem template; create `docs/runbooks/` skeleton in P0-44. | 11, 07 |
| GA-041 | Medium | Data migrations (content) | DB migrations covered (11 §4). Not covered: content migration — importing existing recorded lessons from partners, existing students/coaching-centre rosters, question banks from Word/Excel (P1-10 has CSV/JSON only), YouTube→Bunny re-hosting, redirects from old URLs. | Q7 (03) assumes partners' existing recordings. | Add importer inventory to `16`. | 16, 12 |
| GA-042 | Medium | Analytics events & KPIs | See GA-015. Also: PostHog consent-gated means funnel under-counts; server-side "essential" analytics (aggregate, cookieless) decision missing; event property PII rules exist. | Business decisions on partial data. | `NEW-32`. | NEW-32 |
| GA-043 | Medium | A/B tests | `02` L7 price test; `08` rule "no fake was price… displayed price equals checkout price"; 05 `compareAtMinor` strike-through field. Experiments need sticky assignment, price-cache keys per variant, legal view (consumer law), analytics (sample size), and an explicit exemption in 08. | A price test implemented without sticky assignment leaks different prices to the same user. | Spec in `NEW-32`; remove or constrain `compareAtMinor` (see C14). | NEW-32, 08, 05 |
| GA-044 | Medium | Admin tooling | F-ADM-01..07 are detailed; but no task for "danger zone" bulk ops with typed confirm, no "support: reset attempt / void", no content-correction broadcast to affected attempts when an answer key changes (F-ERR-02 mentions impact preview; rescore job and learner notification not specified), no impersonation banner e2e. | Re-scoring after a bad answer key is a trust event. | Add rescore runbook + notification template. | 07, 03, 12 |
| GA-045 | Medium | Rate limits | Policy scattered: D7 generic; 09 §?; 07 §7.11 "10 evaluation requests/hour/user, 2 concurrent"; 09 §10.2 "daily ceiling (5 writing, 3 speaking)". See C17. No single table of limits by route class. | Divergent limits and unlimited-cost endpoints. | One `rate-limits.ts` source + table in 09. | 09 |
| GA-046 | Low | Docs hygiene | README says "~127-task backlog"; 12 says 129 (C2). `PROGRESS.md` Status block has `Date updated: YYYY-MM-DD` placeholder (acceptable) but "Decisions" block has only examples; `docs/processors.md`, `docs/runbooks/`, `docs/ops` don't exist. | Agents search for non-existent files. | Create stubs in P0-44; fix counts via script. | 12, README |

### 2.4 Security & compliance

| ID | Sev | Area | Finding | Why it matters | Fix | Owner |
|---|---|---|---|---|---|---|
| GA-013 | High | Retention/deletion | Audio retention: `05` "Audio: 180 days" (05:2371), `07` §7.11 "audio retention 180 days", `09` §13.7 "90 days by default" (09:1235) and 09:1000. Deletion: `03` F-ACC-06 "14-day grace", `09` §13.9 "7-day cooling-off". Essay retention not stated in 05/09 together. | Published privacy policy will promise one; jobs implement another. | Choose values (recommend 90 d audio, 14-day deletion grace), edit in `00` as D11 "data lifecycle", fix 05/07/09/03. | 00 → 05, 07, 09, 03 |
| GA-047 | High | Compliance — minors | D7 self-declared age band + guardian flow; F-ONB-06 under-18 purchase needs guardian consent. Missing: how guardian consent is verified (email/OTP only?), whether minors' voice recordings (biometric-adjacent per 05:3278) may be sent to US STT vendors, parental access/deletion rights, school-age marketing ban enforcement in ad pixels. | Voice data of minors is the most sensitive data processed; PDPO child-data rules referenced but unresolved (README item 4). | Add "minor data handling" subsection to 09 §13.6 with decision: block speaking-AI for under-16 or require verified guardian consent; document in processor register. | 09, NEW-26 |
| GA-048 | High | PDPO / cross-border | 09 §13.1 and 13.8 list processors (US LLM/STT) but "transfer assessment" and legal basis are `[B]`/`[LEGAL]`; 03 Q14 open; no DPIA for AI scoring; no DSAR SLA numbers. | Cross-border transfer of learner essays/audio is the core data flow. | Make the lawyer review (GA-002) include DPIA + transfer clauses; add DSAR SLA (e.g., 30 days) to 09. | NEW-26, 09 |
| GA-049 | Medium | Secrets & 2FA operational | 2FA mandatory for instructors/org_admins (D4) — instructors in BD may lack authenticator apps; SMS 2FA excluded as sole factor (09 S SIM swap); recovery procedure for lost authenticator for staff (support cannot reset 2FA of staff?) not specified. | Lock-out of graders/instructors stalls the SLA queue. | Define staff 2FA recovery (backup codes at enrolment, two-person admin reset, ID check). | 09 |
| GA-050 | Medium | `.claude/settings.json` | Allows `git push`, `git checkout`, `git commit` with no branch constraint; relies on GitHub branch protection (11 §1) — not enforced by the kit. Allows `Bash(pnpm install:*)` while `minimumReleaseAge` is the only supply-chain control; `pnpm --filter:*` permits arbitrary scripts. `deny` lacks `Read(./.claude/settings.local.json)`, `~/.aws`, `~/.ssh`, `Bash(git push origin main:*)`. No hook blocking edits to `docs/00-DECISIONS.md` or applied migrations. | AI agents with push rights can bypass CI intent. | Add deny for push to `main`/`master`, `Edit` of applied migration files, `.github/workflows` changes require review rule; document recommended branch protection settings in `NEW-28`. | build-kit, 11 |
| GA-051 | Medium | Exam content security | 09 §7 / 07 §9 cover keys and exposure; missing: handling of leaked mocks (Telegram), watermarked PDFs of explanations, per-learner randomisation of form order, test-bank rotation cadence, honour-code acceptance record before exam. | Mock integrity is the product's credibility. | Add leak response to GA-026 runbook; honour-code consent stored on `attempt_session`. | 07, NEW-27 |
| GA-052 | Low | Supply chain / AI-built code | Renovate + OSV + CodeQL good. Missing: policy on LLM-suggested dependencies ("slopsquatting" — hallucinated package names), `pnpm dlx`/postinstall script allowlist (`onlyBuiltDependencies` mentioned?) | Real attack path for AI-built repos. | Add rule to AGENTS.md: new dependency requires lead approval + registry existence/age check; verify `onlyBuiltDependencies`. | build-kit, 11 |

### 2.5 AI evaluation quality & calibration operations

| ID | Sev | Area | Finding | Why it matters | Fix | Owner |
|---|---|---|---|---|---|---|
| GA-006 | Critical | Gold set budget & rater programme | `07` §7.9: ≥200 (target 400) human-scored responses per task family (IELTS T1 Academic, T1 GT, T2, GRE AWA, Speaking) = 1,000–2,000 items, 2 independent certified raters each, 3rd adjudicator, ≥40% Bangladeshi learners, ≥25 accents, QWK ≥0.80 among raters, yearly refresh. `02` §10.2 / A-register: "200 essays x 2 certified examiners x BDT 300 = 120,000, plus 60 speaking recordings x 2 x BDT 500 = 60,000, so about BDT 0.18M" (02:360). Gap factor ≈ 5–10x plus adjudication, refresh, monthly 2% audit (07 §7.9), 5% double-marking (07 §7.10), grader pool. Also "certified examiners" availability in BD unverified; consent flow for using learner submissions as gold data not built (needs `research_consent`). | Without gold data the release gates (within-0.5 ≥80% etc.) cannot be measured, so the "Estimated" AI score cannot be published responsibly; the plan's headline differentiator is unfunded. | Re-budget in `02` (+ `16`): rater sourcing, rates, timeline, and a *minimum launch gate* (e.g., 150 writing T2 + 60 speaking + beta label) with explicit "beta" labelling already allowed in 07. Add task for `research_consent` and gold-set tooling (P1-28 only says "golden set, calibration report"). | NEW-31, 02, 16, 12 |
| GA-053 | High | Calibration ops cadence | Nightly canary, weekly PSI, monthly audit are specified — no owner/role, dashboard route (F-ADM-06 AI monitor is P1 but no task), alert routing, decision rights to roll back a model, runbook for provider model deprecation, prompt/rubric version approval workflow (who approves, review by certified examiner), regression budget for fallback Gemini (labelled? where shown). | Detected drift with no owner = silent score inflation (the exact failure in competitors the doc cites). | `NEW-31`: RACI, rollback procedure, versioning policy; add admin AI-monitor task. | NEW-31, 12 |
| GA-054 | High | Score messaging & disputes | 07 §7.7 learner view; 09 §10.4 human review path. Missing: dispute workflow SLAs vs 07's grader SLA (48 h) vs "free once/month for disputes" cost impact, bounds on repeated disputes, how an overridden band changes dashboards/streaks/predictions (F-MAST-04 estimated score) and whether certificate/plan depends on it. | Perceived unfairness drives refunds/bad reviews. | Add dispute decision table to 07 §7.10 and 17 allowance. | 07, 17 |
| GA-012 | High | AI economics consistency | See C1, C9, C17, C22. Credit unit: `02` sells "AI speaking credits (5 full tests) 590" while `07` charges speaking full test = 2 credits and writing = 1 credit from one pool; `07` floor price $0.33/credit vs `02` BDT 59 (~$0.49) writing but speaking effective BDT 118 for ~$0.19 COGS (OK) — fine, but the *credit model* (one pool vs two products) differs. | Pricing page and `ai_credit_ledger` must agree on unit. | Single credit definition in `17` + `07` §7.8 + `05` ledger `reason`. | 17, 07, 02 |
| GA-055 | Medium | Prompt safety for Bangla/Banglish | Prompt-injection defenses (09 §10.1) are English-centric; Bangla/Banglish essays: STT for Bangla-accented English is covered but code-switched text, Unicode normalisation of Bengali conjuncts, essay length limits (chars vs words for Bangla script) not mentioned. | False flags or bypass. | Add test cases to eval harness. | 07, 09 |
| GA-056 | Medium | Human review capacity vs promise | D10 Plus: "2 human essay reviews"; Live: human speaking mock feedback; Mentor expanded — each 10–15 min grader time (07 §7.8, $1–2). No capacity forecast against tier sales. | Overselling human review breaks SLA. | Add capacity model to `17`/`NEW-27`. | 17, NEW-27 |

### 2.6 Test-engine edge cases

| ID | Sev | Area | Finding | Why it matters | Fix | Owner |
|---|---|---|---|---|---|---|
| GA-057 | Medium | Edge cases not specified | Strong coverage of timer, resume, clock skew, multi-tab (07 §5.5–5.8). Not found: (a) daylight-saving/timezone irrelevant for server timers but `Asia/Dhaka` vs intl users for scheduled mocks; (b) device switching mid-Listening audio position (once-only audio: resume position rule); (c) screen-reader users on Listening; (d) copy/paste/translation extensions in Writing; (e) extremely long answers/emoji/Bengali text in Writing word counter (word counting rules for Bangla script); (f) browser back/forward and refresh in Speaking mid-recording; (g) concurrent attempt on same pack when entitlement expires mid-test; (h) entitlement revoked (refund) during an attempt; (i) test form retired/corrected while attempt in progress (pinned versions OK) but result re-score after F-ERR-02; (j) mock event with simultaneous start (thundering herd). | These are the support tickets of week 1. | Add "edge-case register" with expected behaviour and Playwright scenario IDs to `07` §10.3. | 07 |
| GA-058 | Low | Practice vs exam mode | Distinction clear (07 §6.10). No rule preventing exam-mode answers being viewed after attempt for reuse by others (review mode leaks) beyond watermark; fine. | — | Optional: review-mode throttle. | 07 |

### 2.7 Product/business risk & metrics

| ID | Sev | Area | Finding | Why it matters | Fix | Owner |
|---|---|---|---|---|---|---|
| GA-014 | High | Score guarantee | D10 Mentor: "free re-enrol if target not met (strict terms)". `03` §11 Q4: "Do not offer at launch; revisit after…" (03:1532). No eligibility rules, no verification of exam result (upload scorecard?), no liability cap, no accounting for provision (deferred revenue). | Largest single refund/legal exposure in the plan. | Decide in `17`/`00`: either remove from launch tier or write terms + data model (`guarantee_claim`). | 17, 00, NEW-26 |
| GA-015 | High | Metrics | `02` §14 KPIs (paid conversion, blended CAC, refund rate, AI complaints) not mapped to events or dashboards; 11 §5 SLOs are technical only; no weekly business review template; no North-Star metric defined for product (e.g., weekly active mock takers). | Hiring gates in 02 (conversion ≥3%) require measurable definitions. | `NEW-32`: KPI dictionary (definition, formula, source table/event, owner, cadence). | NEW-32, 02, 11 |
| GA-059 | Medium | Risk register | 02 §13 risks exist; missing: exam-owner (IDP/BC/ETS) trademark/takedown response, outbound-demand shock (02 acknowledges), payment gateway outage/suspension, key-person risk, single-LLM-provider outage (fallback Gemini OK), Meta ad account ban (primary channel), SIM/OTP delivery failure at launch (gateway), regulatory change (VAT). | — | Add scenario triggers + owner + pre-agreed response (a short table) in 02 §13. | 02 |
| GA-060 | Medium | Cost model coherence | `04` §12 infra cost (e.g., Bunny $0.03/GB; AI $0.073 blended) vs `02` §8 and `07` §7.8 per-eval costs differ (C9). The founder funding ask (02 §11.4) depends on one of them. | Spreadsheet-level inconsistency undermines investor material. | Single `packages/ai/src/pricing.ts` + one assumptions table referenced by all. | 02, 04, 07 |
| GA-061 | Medium | Launch readiness gates | P1 → launch needs P1-50..56 (12:192) but not: legal review (GA-002), accountant sign-off (GA-011), gold-set gate (GA-006), content readiness (number of published mocks, lessons — belongs to `16`/`24`), SMS sender-ID approval, SSLCommerz live approval. | Technical-complete ≠ launch-ready. | Add "business readiness checklist" to 11 §11 with owners and dates. | 11, 24 |
| GA-062 | Low | Naming placeholder | "Lumen Academy" appears across docs/code; D2 says only `brand.ts`; build-kit uses `lumen` as package/db/cookie prefix (e.g., `__Host-lumen`, DB `lumen_dev`, IndexedDB `lumen-exam`) — rename later touches cookies/storage keys (forces logout). | Cheap to fix now. | Make prefixes derive from `brand.slug`. | 00, 09, 07 |

---

## 3. Contradictions found (exact quotes + locations)

| # | Topic | Statement A | Statement B | Resolution proposal |
|---|---|---|---|---|
| C1 | Free-tier AI allowance | `00` D10 Free: "…vocab decks, community, **1 AI writing eval / month**" | `02` §7.2: "1 AI writing evaluation **at sign-up + 1 per month**"; `07` §7.8: "Free allowance: **2 credits on sign-up + 1 / month**"; `09` §10.2: "free tier: **1 writing/day**" | One value in `17`; reference only. |
| C2 | Backlog size | `README.md` table row 12: "**~127-task backlog**" | `12` §11 heading: "Phased backlog (**129 tasks**: haiku 6, opus 14, sonnet 109)" and `PROGRESS.md` has 129 items | Fix README (script count). |
| C3 | Onboarding route | `00` D2 `(auth)`: "`/sign-in`, `/sign-up`, **`/onboarding`**"; `06` §route table and `08` same | `03` §2.3: "**`/app/onboarding`** \| P1 \| Goal wizard (F-ONB-01)" | Choose D2 (`/onboarding`), edit `03`. |
| C4 | Certificates phase | `03` F-CERT-01 phase column "**P2 ◆**" (03:586); `03` verification page "`/verify/[code]` \| **P2**" | `00` D10 Core "Always includes… **certificate**"; `02` §7.2 / §6 P1 "Complete" courses; `02` §7.3 "certificate" in structured path; `10` §13 specified as P1 integration | Move certificates to P1 (and add task) or strip from Core/Complete copy. |
| C5 | Study plan phase | `00` D1 P2: "**study plans**, streaks/XP…" and `12` P2-03 "Study plans" | `03` F-PLAN-01 "Plan view (read-only)… **P1 ◆**" and F-ONB-02 plan generation; `03` persona must-haves list F-PLAN-* ; `12` P1-37 dashboard "plan" | Define P1 = read-only generated plan; keep scheduling P2 in D1 text. |
| C6 | Speaking audio retention | `05` §retention: "**Audio: 180 days** after completion" (05:2371); `07` §7.11 "audio retention **180 days**" | `09` §13.7: "Speaking audio \| **90 days** by default"; `09` §10.3 "default **90 days** unless dispute open" | 90 days; edit 05/07. |
| C7 | Account deletion grace | `03` F-ACC-06 "**14-day grace** (cancel by signing in)" | `09` §13.9: "user confirms (step-up + **7-day cooling-off**, cancellable)" | Pick one (recommend 14). |
| C8 | OTP/verification TTL | `09` §2.1 `emailOTP({ otpLength: 6, expiresIn: **300**…})` (5 min); `emailVerification … expiresIn: 60*60` (60 min) | `10` §11.1 `otp_code`: "6-digit, **10 min**"; `verify_email`: "expires **15 min**" | Align templates to 09 config values. |
| C9 | AI cost per evaluation | `02` §8.2: writing "**about $0.058**… $0.06 = BDT 7", speaking "**about $0.183**" | `04` §12: writing "**about $0.04**", speaking "**about $0.15**", blended "$0.073"; `07` §7.8: Task 2 "**~ $0.084**", Speaking "**~ $0.19**" | Single pricing table in code; docs reference. |
| C10 | Ops flag storage | `04` §8.4: "a **`system_setting` table** (key, jsonb value, updated_by, audit)" | `05` §feature_flag: "`feature_flag` — Ops kill-switches" (05:1561, 1615); `system_setting` has 0 schema hits in 05 | Use `feature_flag` in 04. |
| C11 | Certificate route param | `00` D2 `(marketing)`: "`/verify/[certId]`" | `03` §2.3: "`/verify/[code]`"; `03` F-CERT-02 "unguessable code (≥128-bit)" | Use `[code]` (not an enumerable ID); edit D2. |
| C12 | Stale open question | `README.md` "Things you need to decide" #1 "**'collegeapp'**: we couldn't identify it…"; `03` §11 Q1 "**What does 'collegeapp' mean?**" | `00` Change Log: "Founder confirmed 'collegeapp' = **Common App**" | Remove from README/03 Q1; link `21`. |
| C13 | Score guarantee | `00` D10 Mentor: "**free re-enrol if target not met** (strict terms)" | `03` §11 Q4: "**Score guarantee?**… Do **not** offer at launch" | Decide; see GA-014. |
| C14 | "Was" price | `08` §pricing: "**no fake 'was ৳9,999' anchor**"; `02` §7.1 "**No fake 'was' prices**" | `05` `price.compareAtMinor … // strike-through "was" price (display only)` (05:1786) | Constrain field to genuine prior-price (≥28-day) or remove. |
| C15 | Runbook filenames | `09` §11: "`docs/runbooks/rotate-secrets.md`" | `11` §7: "`docs/runbooks/secret-rotation.md`"; `docs/runbooks/` and `docs/processors.md` do not exist | One filename; create stubs. |
| C16 | International pricing structure | `00` D10: "3 purchasing-power regions (A…, B…, C…)" | `02` §7.2 international price book: single USD price per product ("IELTS Academic/GT Complete \| 39"); `05` `price` has no region | Region price books in `17`; `05` change. |
| C17 | AI request limits | `07` §7.11: "**10 evaluation requests/hour/user, 2 concurrent**" | `09` §10.2: "paid: … daily ceiling (**5 writing, 3 speaking**)" and "Inngest concurrency limit per user (**1**)" | One table. |
| C18 | Accommodations | `03` F-MOCK-09 "(1.25×/1.5×/2×)… \| **P2**" | `06` `grantAccommodation` "extraSeconds ≤ 3600, multiplier?" shipped to `/support/**` (P1); `07` "`accommodation_multiplier` (1.00-3.00)"; `07` OQ-2 "needs a product decision" | Decide set + phase. |
| C19 | Royalty vs payouts | `02` §8.4: "instructor/item royalty **12% of net (A14)** on courses and passes" (Year 1 margins) | `05`: "`revenueShareBps … default(0) // P3 marketplace; 0 = salaried/in-house`"; `06`: payouts "(P3)" | Year-1 contribution margin is overstated/understated depending on engagement model; see GA-008. |
| C20 | Live Q&A in Plus | `00` D10 Plus: "**weekly live group Q&A**" | `00` D1: P1 "**Live classes in-house**… not yet"; P2 live batches | Plus at P1 launch cannot include live Q&A; stage tier perks by phase in `17`. |
| C21 | Free tier "community" | `00` D10 Free "…community…" | `00` D1/`03` F-COM-02 community = P2 | Same as C20. |
| C22 | AI speaking credit unit | `02` §7.2: "AI speaking credits (**5 full tests**) 590" and "AI writing credits (10) 590" as separate products | `07` §7.8: "Speaking full test = **2** credits… writing = 1" from one `ai_credit_ledger` | Single pool in `17`. |
| C23 | Multipliers / accommodation unit | `03` F-MOCK-09: 1.25/1.5/2× | `06` extraSeconds ≤ 3600; `07` 1.00–3.00 | Included in C18. |
| C24 | Cart phase | `00` D2 `(checkout)`: "`/cart`, `/checkout`…" (unqualified) | `03` §2.3: "`/cart` \| **P2** \| …(P1: single-item 'Buy now' skips cart)" | Annotate D2 table. |

---

## 4. Proposed new documents (beyond the parallel 14–24 set)

Numbering continues from 25. Each should be bilingual-aware, include acceptance criteria and backlog task IDs, and be linked from `README.md` and `12` §11.

### 26 — LEGAL-AND-POLICY-DRAFTS
1. Decision list for counsel (governing law, jurisdiction, liability caps, auto-renew disclosures, minors, instalment default, AI-score disclaimer, guarantee wording)
2. Terms of Service (en/bn draft), Privacy Policy, Cookie Policy + cookie inventory table, Refund Policy, AI Scoring Policy, Trademark Notice, Acceptable Use, Instructor Agreement, Org/B2B Agreement, DMCA/takedown notice
3. Accessibility statement
4. Sub-processor register template (`docs/processors.md`), DPIA for AI scoring, cross-border transfer clauses
5. Lawyer-review gate task and sign-off record

### 27 — SUPPORT-AND-TRUST-OPERATIONS
1. Helpdesk decision (buy vs build), categories, priorities, SLA ladder, macros inventory, CSAT
2. Help-centre article inventory (~40) with owners
3. Exam disruption policy and support actions (void, re-sit credit, accommodations with proof rules)
4. Grader programme: sizing, recruitment, qualification, pay, probation by QWK, workload caps
5. Moderation policy; account-sharing/leak enforcement ladder; fraud queue
6. Staff access policy (least privilege matrix, 2FA recovery, offboarding)
7. Weekly ops cadence and dashboards

### 28 — FOUNDER-SETUP-AND-ENVIRONMENTS
1. Prerequisites (OS, Node/pnpm versions, Docker, git, GitHub, Claude Code/Gemini install), copy-paste commands with expected output
2. Repo bootstrap, `.env` handling (and the `.env.example` permission fix), local DB driver switch, Mailpit, Inngest Dev Server, webhook tunnels for IPN
3. Account-opening order and lead times (SSLCommerz, SMS sender ID, Paddle) with a tracking table
4. Branch protection, secrets, Vercel/Neon wiring screenshots-as-text
5. Top-20 errors and fixes; "known good first run" checklist

### 29 — NOTIFICATIONS-AND-LIFECYCLE-MESSAGING
1. Event → category → channel → template → timing → quiet hours (Asia/Dhaka) → suppression matrix (all F-* events)
2. Free-user nurture, post-diagnostic, abandoned checkout, renewal/dunning, win-back, exam-date countdown, security alerts, org/guardian mails, deletion/export mails
3. SMS/WhatsApp template register (approved wording)
4. Frequency caps, unsubscribe classes, bilingual copy store

### 30 — FINANCE-TAX-AND-PAYOUTS-OPS
1. Daily/weekly/monthly finance cadence, settlement reconciliation procedures per provider
2. VAT/Mushak/turnover-tax calendar, accountant data pack, invoice-template sign-off
3. International payouts, FX and repatriation procedure
4. Instructor/grader/item-writer engagement types, payout runs (manual CSV in P1), withholding tax `[LEGAL]`
5. Refund SOP, chargeback playbook and evidence pack, risk-hold queue rules
6. B2B invoicing

### 31 — AI-EVALUATION-OPERATIONS
1. Gold-set production plan and budget (rater sourcing, rates, consent), minimum launch gate and "beta" labelling rules
2. RACI for prompt/rubric/model changes; rollback and provider-deprecation runbooks
3. Dispute handling decision table; human-review capacity model by tier
4. Bangla/Banglish test sets; accuracy page update process

### 32 — ANALYTICS-AND-EXPERIMENTATION
1. KPI dictionary (definition, formula, event/table source, owner, cadence) mapped to `02` §14
2. Event taxonomy v1 (names, properties, PII rules, consent behaviour, server-side essential events)
3. Dashboards/funnels list; weekly business review template
4. Experiment protocol (sticky assignment, sample size, price-test legality), flag lifecycle

### 33 — I18N-AND-BANGLA-LOCALISATION-WORKFLOW
1. File structure, key naming, ICU plural rules for Bangla, missing-key CI
2. Glossary (~150 terms) and tone guide; Banglish policy
3. Translator/reviewer roster and QA checklist; legal/medical-style text rules; AI-feedback language policy
4. Number/date/currency rules (ties to 03 L-05)

(Optional 34 — `RUNBOOKS-INDEX`: stub files for R1–R12 from `11` §5, secret-rotation, breach, status templates, global exam incident; or fold into P0-44.)

---

## 5. Cross-link obligations for existing docs (due to parallel docs 14–24)

| Existing doc | Must link to | Where |
|---|---|---|
| `README.md` | 14–24 and 25–33 | Read-in-order table; "decide/verify" list (remove "collegeapp") |
| `00-DECISIONS.md` | 17 (already), 18, 21, 22, 24 | D1 phase table notes; D10 pointer; new Change Log lines; D11 data lifecycle |
| `02-BUSINESS-PLAN.md` | 17 (§7), 19/20 (§9), 16 (§10.1, §10.2), 24 (§15 and timeline A17), 18 | Replace price book with pointer; fix C9/C19 |
| `03-PRODUCT-SPEC.md` | 14/15 (§7 course catalogue), 18 (F-LIVE), 21 (Q1 → resolved; admissions features), 17, 16 (§9 content standards), 23 | §7, §9, §11 |
| `04-ARCHITECTURE.md` | 22 (conventions/§8), 18 (§9 live) | §8, §11 |
| `05-DATABASE.md` | 17 (new product kinds/regions), 18, 21 (application entities) | §2.x, §4 |
| `06-API-AND-SERVICES.md` | 17, 18, 21 | service tables |
| `08-UI-UX-DESIGN-SYSTEM.md` | 23 (design cues, animation) | §0, motion section |
| `10-PAYMENTS-VIDEO-INTEGRATIONS.md` | 16 (video production standards), 17, 18 (§9 live) | §8, §9 |
| `11-DEVOPS-OBSERVABILITY.md` | 22 (logging/model routing/multi-device), 24 | §5, §11 |
| `12-BUILD-PLAN-AGENTS.md` | 22 (guardrails: context retention, resume, model routing costs) — §2/§3/§9; 24 (timeline); new tasks for 14–21 content/ops | §2, §3, §11 |
| `13-PROMPTS.md`, `PROGRESS.md`, `HANDOFF.md`, `build-kit/*` | 22 (file maps, logs, resume protocol) | CLAUDE.md/AGENTS.md "read order" |

---

## 6. Dimension coverage check (explicit)

| Dimension | Verdict | Notes (IDs) |
|---|---|---|
| Help centre / FAQ | Partial | route + feature only (GA-016) |
| Onboarding emails | Gap | GA-022, GA-009 |
| Refunds UI | Mostly specified | partial/instalment/timing gaps (GA-021) |
| Legal pages content / terms / privacy drafts | Gap | GA-002 |
| Cookie banner | Partial | GA-019 |
| Accessibility statement | Partial | GA-020 |
| SEO (sitemap, schema, hreflang) | Strong base | GA-017 |
| Blog/CMS | Partial | GA-018 |
| Notifications | Schema only | GA-009 |
| Support tooling & SLAs | Gap | GA-003 |
| Content moderation | Partial (P2) | GA-027 |
| Grader operations | Workflow only | GA-024 |
| Instructor onboarding/contracts/payout tax | Gap | GA-008, GA-028 |
| Finance reconciliation, VAT/Mushak | Gap / all `[U]` | GA-011 |
| Fraud/chargebacks | Partial | GA-025 |
| Abuse/account sharing | Detection only | GA-026 |
| Beginner env setup | Gap (blocking) | GA-005 |
| Seed data | Good | GA-032 |
| Feature flags | Good, contradictory | GA-033 |
| i18n workflow | Gap | GA-034 |
| Mobile/PWA/offline | Spec without tasks | GA-035 |
| Email deliverability | Good | GA-036 |
| File uploads | Partial | GA-037 |
| Search | Partial | GA-038 |
| Performance | Good | GA-039 |
| Backups | Good | (RPO/RTO consistent: PITR ≤15 min RPO, 4 h RTO) |
| Incident response | Good for infra | GA-040 |
| Data migrations | DB yes, content no | GA-041 |
| Analytics events | Gap | GA-015, GA-042 |
| A/B tests | Gap | GA-043 |
| Admin tooling | Good spec | GA-044 |
| Error pages | Partial | GA-023 |
| Rate limits | Scattered | GA-045 |
| Security & compliance | Strong; minors/cross-border open | GA-047–052 |
| AI evaluation quality & calibration ops | Strong design, unfunded/unowned | GA-006, 053–056 |
| Test-engine edge cases | Strong; list in GA-057 | GA-007, 057 |
| Team/hiring | Assumptions only | GA-029 |
| Risk | Present | GA-059 |
| Metrics | Gap | GA-015 |
| Internal consistency | 24 contradictions | section 3 |

---

## 7. Resolution status (lead, 2026-11-07, after final fix pass)

- **All 24 contradictions (C1–C24)** are resolved by binding rows in `00-DECISIONS.md` D12 (plus C25–C36 added during the pass) and applied by four parallel fix passes. The pass owners were 05; 04/06/07/09/10/11; 01/02/03/08/14/15/18/19/20; and 12/13/PROGRESS/16/21–34/build-kit.
- **Top-15 gaps**:
  - GA-001: tiers modelled in 05/06/12/17.
  - GA-002: legal drafts in 26, with the lawyer gate BG.
  - GA-003: support desk in 27, plus tables and tasks.
  - GA-004: every P1 feature now maps to a task (P0-55 traceability check).
  - GA-005: setup in 28, Neon default, `.env.example` readable.
  - GA-006: calibration in 31, BDT ~1.93M in 02.
  - GA-007: disruption flow (D12) in 06/07.
  - GA-008: creator pay in D12 C19/C32 and 30.
  - GA-009: catalogue in 29.
  - GA-010: phases (D12 C4/C5/C20/C21).
  - GA-011: finance ops in 30.
  - GA-012: single credit pool (C1/C9).
  - GA-013: retention (C6/C7/C35).
  - GA-014: guarantees (C13/C13b).
  - GA-015: analytics in 32.
- **Residuals** are tracked as backlog tasks **P0-53 / P0-54**, the doc-consistency sweep and `tooling/doc-lint.ts`:
  - `fx_rate` and `foreign_vendor_payment` schema (30);
  - 21 admissions pack types vs D5 `service` (map in the seed loader like 17's `d5_extension`);
  - pgvector `halfvec` and Drizzle version confirmation;
  - 26 X4/X5/L-09 retention items (counsel + accountant: BG gates);
  - IELTS trademark wording (counsel).
- Backlog after integration: **358 agent tasks** (P0 71 · P1 200 · P2 62 · P3 25) plus **16 human gates (BG-01…16)**, verified identical between `12` and `PROGRESS.md` by script.
