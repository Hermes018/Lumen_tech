# 02 — Business Plan: Lumen Academy (placeholder brand)

> Status: v1, 2026-11-07. Conforms to `00-DECISIONS.md` (D1 phases, D5 commerce model, D6 test-engine invariants). Companion to `01-COMPETITOR-TEARDOWN.md`.
> **How to read the numbers.** Facts come from the research notes and carry inline tags *(source: file.md — origin)*. Anything else is labelled **Assumption (A#)** and collected in the register in §16. Single-source or aggregator figures are marked **(weak)**. The financial model is a planning tool, not a forecast. Currency: BDT unless stated. **Planning FX: 1 USD = BDT 120 (A1; the notes contain no FX rate, so verify and update).**

---

## 1. Executive summary

**What.** Lumen Academy sells IELTS and GRE preparation plus a faithful computer-based mock-test platform with AI-estimated Writing, Speaking and AWA scores. It is Bangladesh-first (BDT, bKash/Nagad through SSLCommerz, Bangla and English UI) and sells internationally in USD. Later phases add PTE and Duolingo English Test (DET) (P2), then spoken English, tech tracks, Bangladeshi university course packs and an instructor marketplace (P3), with live batches and B2B licences from P2 (D1).

**Why now.**
- Computer-based IELTS is now the only format in Bangladesh: the paper test ended after 31 Jan 2026 *(source: exam_specifications_gapfill.md §4 — IDP Bangladesh)*. A learner's real exam is on a screen with a highlighter, notepad, split-screen and on-screen timer, so interface-faithful practice matters.
- The exam is expensive: **BDT 31,100** for IELTS on Computer; BDT 18,600 for a one-skill retake *(source: exam_specifications.md §3 — IDP Bangladesh)*. Offline prep costs BDT 9,500 to 15,000 (Mentors' and 10MS) *(source: south_asia_edtech.md §2)*. A prep product at BDT 2,000 to 4,000 is a small fraction of the exam fee.
- AI scoring for IELTS exists but trust is the gap: competitors publish little validation, and IDP warns against LLM grading *(source: global_test_prep_competitors.md §3)*.

**Business model.** Freemium funnel from free diagnostics and YouTube/Facebook content, into per-course purchases, mock packs, AI credits and 1/3/6/12-month passes. Live batches and institution seat packs from P2. Marketplace revenue share from P3. No in-product ads.

**Headline plan (base case, all assumption-driven; see §11).**

| | Year 1 | Year 2 | Year 3 |
|---|---|---|---|
| Paying customers (B2C, excl. live/B2B seats) | 1,900 | 4,600 | 11,300 |
| Gross billings (BDT M) | 6.6 | 25.2 | 68.8 |
| Net revenue after VAT (BDT M) | 5.8 | 22.4 | 61.5 |
| Gross margin | 72% | 77% | 78% |
| Operating result (BDT M) | -5.6 | -2.6 | +10.5 |
| Break-even month (base / bear / bull) | 21 / 31 / 10 | | |
| Peak cumulative cash need incl. pre-launch (BDT M) | about 11.8 (base) | | |

**Funding ask / runway.** Base case needs about BDT 13.6M (about $113k) to reach break-even once the AI-scoring calibration programme is funded properly (BDT 11.8M original plan, less the BDT 0.18M validation line, plus the phased BDT 1.93M budget in `31`), plus a 25% buffer, so **BDT 14M to 17M (about $115k to $141k)** (§11.4). The bear case needs BDT 20M unless hiring is gated; the plan therefore hires by KPI gates (§9, §14).

**Three things that must be true.**
1. Organic and free-content channels deliver at least about 60% of customers, because cold paid acquisition loses money on a single course purchase (§8).
2. AI scores earn trust: a published validation with at least 80% agreement within 0.5 band against certified examiners (A-target; competitors' self-reported figures are 70% to 79%).
3. VAT, gateway onboarding and the Bangladesh Bank repatriation rules are resolved early (§12).

---

## 2. Problem

| Who | Problem | Evidence |
|---|---|---|
| IELTS taker (study/migration) | Offline coaching is BDT 9,500 to 15,000 on top of a BDT 31,100 exam; mocks are scarce and not exam-faithful; Writing/Speaking feedback is slow and expensive. | Mentors', 10MS, IDP *(south_asia_edtech.md; exam_specifications.md)* |
| GRE aspirant | Western GRE prep is priced at $149 to $600+ (Magoosh $149 to $219; TTP $449 to $499), unaffordable in BDT; free ETS tests lack scored essay feedback beyond $20 per two essays. | global_test_prep_competitors.md §1 (L) |
| University student | Tech skills and CSE course content are in English-only global platforms or expensive bootcamps (Ostad about Tk 6,000 per course; Bohubrihi BDT 12,000+). | south_asia_edtech.md §2 |
| Working professional | Needs flexible upskilling and IELTS for migration; recorded courses show low completion (Programming Hero 33%). | south_asia_edtech.md §2 |
| Coaching centre / institution | Lacks a mock-test and analytics tool; Magoosh's institutional offer has no custom mock upload or proctoring (competitor-written). | global_test_prep_competitors.md §2 (L) |
| International learner | Pays $12 to $219 depending on tier; AI IELTS apps have hidden pricing and no accuracy evidence. | global_test_prep_competitors.md §1, §3, §6 |

**Demand risk (important).** Outbound demand is shifting. US F-1: 73% of Bangladeshi applicants refused in 2025, new Bangladeshi students down 69% in Sept 2025 vs Sept 2024. Australia: 51% of offshore Bangladeshi applicants refused in Feb 2026, though new Bangladeshi students rose about 33% from 2024 to 2025. Several UK universities have halted Bangladeshi admissions (headlines). *(source: bangladesh_market_gapfill.md §7 — ICEF Monitor June 2026; Ittefaq; Bonik Barta)*. This hurts GRE (US-heavy) most, and IELTS less because it also serves UK, Canada, Australia and migration. The plan therefore treats GRE as a secondary line and builds PTE/DET (P2) and tech/university tracks (P3) as hedges.

## 3. Solution

- **Faithful CBT mock engine** (D6): server-held section deadlines, autosave every 10 s, resumable on any device, versioned questions. IELTS is linear; GRE has section-level adaptivity. IELTS UI features follow IDP's documented list: highlighter, notepad, auto-save, adjustable text size, split-screen Reading, on-screen timer, flag, navigation *(source: exam_specifications_gapfill.md §4)*.
- **AI Writing, Speaking and AWA evaluation**: LLM scoring against the public band descriptors, per-criterion bands, inline feedback; speech-to-text for Speaking. Always labelled "estimated".
- **Courses**: video lessons, question banks, flashcards, study plans (P2).
- **Dashboard**: Khan-style skill levels and course mastery % *(source: ux_dashboards_video_gapfill.md §1)*, a transparent score predictor that is calibrated over time from self-reported exam results.
- **Bangla-supported UI**, BDT pricing, bKash/Nagad, WhatsApp/Messenger support.

## 4. Value proposition by segment

| Segment | Value proposition | Lead product | Phase |
|---|---|---|---|
| BD IELTS takers (study/migration) | "Practise on the same kind of screen as your exam, get your four-skill band estimate in minutes, for the price of a 1-month textbook habit." | IELTS Academic/GT Core and Plus, mock packs, AI credits | P1 |
| GRE aspirants | Full GRE prep with adaptive-section mocks at a fraction of Western prices. | GRE Core and Plus, Verbal/Quant/AWA boosters | P1 |
| University students | Bangla-friendly course packs aligned to local CSE syllabi plus Python/SQL/ML tracks. | University course packs, tech tracks | P3 |
| Working professionals | IELTS/PTE for migration and affordable tech upskilling; pass with monthly AI allowance. | Passes, tech tracks | P1/P3 |
| Coaching centres / institutions | Seat packs, cohort analytics, custom mock uploads, white-label-lite. | B2B seat packs | P2 |
| International learners | Cheap, AI-scored IELTS and GRE with transparent pricing; one pass for both. | USD passes via Paddle/Stripe | P1 |

---

## 5. Market sizing (TAM / SAM / SOM)

**Hard data from the notes**
- Bangladesh: 176M population, 57.8% rural, median age 26.0; **82.8M internet users (47.0% penetration, Oct 2025)**; 186M cellular connections. Ad reach: Facebook 64.0M, TikTok 56.2M (18+), YouTube 49.8M, Messenger 35.0M. These are ad-audience figures, not MAUs. *(source: bangladesh_market_gapfill.md §6 — DataReportal)*
- **About 60,000 to 70,000** Bangladeshis study abroad each year (undated Daily Star supplement; **order of magnitude only**): Australia about 10,000; US 9,000 to 10,000; UK about 4,500; Canada about 4,000; Malaysia about 4,000; nearly 20,000 Europe and Asia combined. *(source: bangladesh_market_gapfill.md §7)*
- No IELTS or GRE test-taker count for Bangladesh was found. Everything between "outbound students" and "prep learners" is therefore assumption.

**Calculation (transparent)**

| Step | Value | Basis |
|---|---|---|
| Outbound students per year (midpoint of 60k to 70k) | 65,000 | notes (weak, undated) |
| Prep multiple: people who prepare per person who eventually leaves | x 3.0 | **A2** (refusals, drop-outs, multiple attempts) |
| Migration / professional uplift | x 1.3 | **A3** |
| **IELTS-type prep learners per year** | **about 253,500, round to 250,000** | 65,000 x 3.0 x 1.3 |
| Willingness to spend per learner on prep | BDT 10,000 | **A4**: low end of the BDT 9,500 to 15,000 offline band |
| **TAM, IELTS** | **BDT 2.5B (about $20.8M)** | 250,000 x 10,000 |
| GRE takers per year | 7,000 | **A5** (about 40% of US-bound plus part of Europe; no data) |
| GRE prep learners (x 2.0) | 14,000 | **A5** |
| TAM, GRE (x BDT 8,000) | BDT 112M (about $0.9M) | **A5** |
| PTE/DET prep learners (15% of IELTS learners) | 37,500 | **A6** |
| TAM, PTE/DET (x BDT 5,000), P2 | BDT 188M (about $1.6M) | **A6** |
| **TAM, Bangladesh test prep** | **BDT 2.8B (about $23M)** | sum |
| University / skills (P3) | **Not sized** | no data in notes; collect UGC/BTEB enrolment figures before quoting |

| SAM (serviceable at Lumen's price points) | Learners | ARPU | Value |
|---|---|---|---|
| IELTS learners reachable and willing to buy online (50% of 250,000; **A7**, proxy for 47% internet penetration) | 125,000 | BDT 4,500 | BDT 562M |
| GRE learners (60% of 14,000; **A7**) | 8,400 | BDT 6,000 | BDT 50M |
| **SAM (P1 scope)** | **133,400 learners** | | **BDT 613M (about $5.1M)** |

| SOM (base case) | B2C customers (BD IELTS+GRE) | Share of SAM learners | BD B2C gross billings | Share of SAM value |
|---|---|---|---|---|
| Year 1 | 1,800 | 1.3% | BDT 5.9M | 1.0% |
| Year 2 | 4,000 | 3.0% | BDT 15.2M | 2.5% |
| Year 3 | 6,500 | 4.9% | BDT 27.3M | 4.5% |

**Reading the result.** The Bangladeshi test-prep market in this analysis is **small in dollar terms** (about $23M TAM, about $5M SAM). A solo or small team can build a good business inside it, but venture-scale growth requires international sales, B2B, PTE/DET and tech tracks. Year 3 total billings of BDT 68.8M (about $0.57M) are about 11% of the P1 SAM value, of which only BDT 27.3M (4.5% of SAM) is BD IELTS/GRE B2C; the rest is international, B2B, live and P3 lines outside the SAM definition. Competitors' sizes are not comparable (10MS claims 3.2M MAU, weak source).

**Demand shock sensitivity.** If outbound demand fell 30% (A-sensitivity), base Year 3 BD B2C billings would fall from BDT 27.3M to BDT 19.1M, a gross-margin loss of about BDT 6M. The bear scenario in §11 bakes in a bigger shock. **IDP volume outlook (D11):** IDP reported Language Testing volume -8% in FY26 and plans for a 20-30% market fall in FY27, so the planning case for IELTS-only demand in FY27 is -20% to -30%; the portfolio hedge (test-agnostic positioning, Foundation, PTE/DET, Work-Abroad tracks) is in §13.

---

## 6. Product and catalogue roadmap

Aligned to D1. Formats: **V** video, **Q** question bank, **M** mock tests, **AI** AI-scored practice, **F** flashcards, **L** live.

### P0 Foundation (pre-launch)
Auth, marketing site, catalogue, CMS. Free diagnostics built here.

### P1 MVP launch

| Product | Formats | Notes |
|---|---|---|
| Free diagnostic tests (IELTS 25-minute Express Mock, GRE section test) | M | lead magnet; results gated behind sign-up (D4 `guest`) |
| IELTS Academic Core / Plus ("Complete" retired, D10) | V Q M AI F | allowances per `17` (Core 4 mocks and 10 credits; Plus 10 mocks, i.e. 5 at launch and 10 by 2027-08-15, and 40 credits) |
| IELTS General Training Core / Plus | V Q M AI F | GT Reading and Writing differ from Academic *(exam_specifications_gapfill.md §4)* |
| IELTS skill boosters (Reading, Listening, Writing, Speaking) | V Q | separate band tables for Listening, Academic Reading and GT Reading (editable data) |
| Writing and Speaking AI Coaching | AI | credit-based; feedback lessons |
| Mock test packs (3, 5, 10) | M | test packs per D5 |
| GRE Core / Plus | V Q M AI | section-adaptive mocks (D6); Verbal 2 sections 12Q/18 min and 15Q/23 min; Quant 12Q/21 min and 15Q/26 min; one 30-min Issue essay *(exam_specifications.md §1)* |
| GRE Verbal / Quant / AWA boosters | V Q AI | |
| Vocabulary flashcards (app-like) | F | spaced repetition; Duolingo's half-life regression cut error nearly in half vs Leitner on 12M+ sessions *(global_learning_platforms.md §3)*; FSRS from the start (D12 C26), no Leitner stage |
| Passes (1/3/6/12 months) | all | D5 |

### P2 Growth
Live batches (YouTube Live/Zoom), study plans, streaks/XP, community Q&A, coupons/affiliates, institution accounts, parent view, PTE (22 task types; humans double-mark 7) and DET (adaptive, single item stream).

### P3 Expansion
Spoken English; Python; ML; Deep Learning; GenAI; SQL and Databases; Networking (CCNA-style); BD university CSE course packs; instructor marketplace; in-browser code notebooks (Coursera Labs include Jupyter and VS Code, a precedent for embedding labs *(global_learning_platforms.md §3)*); Expo mobile app; LiveKit live.

**Exam-format risk.** Treat exam facts as config with a "last verified" date. TOEFL moved to an adaptive 1 to 6 format on 21 Jan 2026 (ETS: Reading 50 items/about 30 min; Listening 47/about 29; Writing 12/about 23; Speaking 11/about 8) and GRE fee became $249 from 1 Aug 2026 *(exam_specifications_gapfill.md §1, §7)*. GRE essay count changed in Sept 2023 (one essay). Exam-spec items still marked UNVERIFIED in the notes (GRE question-type inventory, IELTS Listening table) must be confirmed before building.

---

## 7. Monetization model and pricing

### 7.1 Principles
1. Freemium funnel; paywall at depth (full mocks, AI credits, courses), not at sign-up.
2. Entitlements only (D5): `course`, `bundle`, `test_pack`, `ai_credits`, `pass`, `live_batch`, `org_seat_pack`.
3. BD passes are **prepaid** (no auto-renew, reminders at T-7/T-1); international auto-renews via Paddle/Stripe.
4. One honest price list: no fake "was" prices (Pearson's $237.94 struck-through Gold is the anti-pattern).
5. **Never ads in-product.** (Duolingo's Energy refill via rewarded ad is a model we do not copy.)
6. Refunds: 7 days if less than 20% consumed; no refunds on consumed AI credits (D5). Revoke certificates on refund (Coursera policy).

### 7.2 Price book summary (canonical prices: `17-PRICING-MASTER.md`)

> **The canonical price book is `17-PRICING-MASTER.md`** (tier matrix, standalone courses, add-ons, passes, books, live classes, access programme, B2B, admissions, promotions, refunds, YAML seed). This table is a summary for the plan; if it disagrees with 17, 17 wins. BDT prices are VAT-inclusive; USD is for regions A / B / C (D12 C25: C >= BD price in USD, B ~ 1.5 x C, A ~ 2.5 x C).

| Product | BDT | USD A / B / C | Includes / terms (full detail in 17) |
|---|---|---|---|
| Free tier | 0 | 0 | diagnostic, sample lessons, 1 sectional mock, core flashcards, AI Tutor 10 msgs/day; **2 AI credits at sign-up + 1 per month** (D12 C1); 7-day Plus trial, no card |
| IELTS Academic **Core** (replaces "Complete") | **3,990** | $89 / $49 / $34 | 6 months, recorded course, full bank, 4 full mocks, 10 AI credits, certificate |
| IELTS General Training Core | **3,490** | $79 / $49 / $29.99 | as above |
| IELTS **Plus** (Academic or GT) | **6,490** | $149 / $89 / $59 | Core + 10 mocks (5 at launch, 10 by ~day 120), 40 credits, study plan, weekly live Q&A, 2 human essay reviews, Target Promise |
| IELTS **Live** tier (regular 12-week) / Crash (4-week) | **13,990** / 9,990 (GT 12,990 / 9,490) | $299 / $179 / $119 / $229 / $129 / $89 | Plus + 36 live sessions (16 crash), 4 human essay reviews, 2 human speaking mocks, speaking club, batch chat; min 30 seats |
| IELTS **Mentor** | **19,990** (GT 18,990) | $399 / $249 / $169 | Live + 3 x 45-min 1:1, 6 human essay reviews, 3 human speaking mocks, 4 h support, Progress Promise |
| GRE **Core** / Plus / Live / Mentor | **5,990** / 8,490 / 12,990 / 19,990 | Core $149 / $89 / $59 | 6 months, 4 section-adaptive mocks, 6 AWA credits (Plus: 10 mocks, 20 AWA, 2 human AWA reviews) |
| Skill courses (Writing, Speaking, L&R) | 1,990 / 1,990 / 1,490 | $49 / $24.99 / $17.99 for Writing Mastery | credits and video per 17 §3 |
| GRE Verbal / Quant boosters; AWA coaching | 2,490 each; 1,490 | $59 / $39 / $24.99 | |
| Mock pack: 3 / 5 / 10 | 690 / 990 / 1,690 | $14.99 / $24.99 / $39 (A) | full CBT mocks; W/S AI scoring inside each mock |
| AI credit packs: 10 / 30 / 75 | 590 / 1,490 / 2,990 | $11.99 / $34 / $59 (A) | one pool: writing task 1, speaking part 1, full speaking test 2, AWA 1 (replaces separate writing/speaking packs) |
| Human essay review: 1 / 5 / 10 | 790 / 3,490 / 6,490 | | 72 h SLA |
| **Pass 1 / 3 / 6 / 12 months** | **1,190 / 2,990 / 4,490 / 6,990** (unchanged) | $24.99 / $59 / $99 / $149 (A) | per 30 days: 2 full mocks + 10 credits; no live, no human reviews, no certificate |
| IELTS Live Batch 12 weeks (standalone) | **9,990** | $229 / $129 / $89 | 36 sessions (18-LIVE-CLASSES L1), min 30 seats |
| GRE Live Batch 8 weeks | 8,990 | $199 / $119 / $79 | 24 sessions, min 30 seats |
| B2B seat pack, 3 months (P2) | 1,400 per seat (25-49 seats; tiers down to 950) | $29.99 / $17.99 / $11.99 | custom mock upload, cohort analytics |
| B2B seat, 12 months (P2) | 3,600 per seat (25-49; down to 1,500) | $89 / $49 / $34 | |
| Tech track (P3) | 2,490 to 4,490 | $59 / $39 / $24.99 (Python/SQL) | Python, SQL 2,490; Networking 2,990; GenAI 3,490; ML 3,990; Deep Learning 4,490; Tech Pass 12 months 5,990; university pack 990 per course / 2,490 per semester |
| English Foundation levels (Bangla-medium) | 299 / 499 / 699 / 999 (track 1,990) | | micro-priced access track (D10) |

**Packaging rule (anti-cannibalisation, kept).** A 3-month pass must cost at least ~75% of a Core course (2,990 vs 3,990 = 75%), otherwise passes wipe out course sales. Courses are the *structured path* (sequence, certificate, study plan, 6-month access); passes are *breadth* with no certificate, live or human review. §11 is driven by blended ARPU, not list prices, so it is unaffected. Re-test the ladder in the first 90 days (17 §12).

**Changes against v1 of this table (explained in 17):** IELTS/GRE "Complete" became **Core**; USD prices follow D12 C25 (the old A prices $39/$59/$19.99/$49/$129 were replaced); one AI credit pool replaces separate writing/speaking packs; Live batch moved to 36 sessions at BDT 9,990 (was 24 classes at BDT 8,900 in A20 and §8.4/§11); the 17 margin model uses a 10% lead-instructor royalty (D12 C19) against the 12% in A14, and counts AI Tutor, mock scoring and human-review costs, so §8.4 contribution figures are directionally right but 17 §2.3 is the reference.

**Tier-mix / ARPU note (§11 unchanged).** A first-order BD B2C mix of Core 42% (IELTS Academic 26 / GT 8 / GRE 8), Plus 6%, passes 25% (1m 7 / 3m 12 / 6m 4 / 12m 2), standalone/mock series 17% and Foundation/Spoken 10% gives a blended first purchase of **about BDT 3,360** against §11's Year-1 BD B2C ARPU of 3,300 (+2%), so the §11 ARPU path (3,300 / 3,800 / 4,200) stays as is; Live-tier, Mentor and Live-batch sales are separate revenue lines and, at BDT 9,990 per batch seat, add about +12% to the §11 Year 2-3 live-batch line (not changed here).

### 7.3 Pricing rationale vs competitors

| Anchor (source) | Price | Lumen comparison |
|---|---|---|
| IELTS on Computer exam (IDP) | BDT 31,100 | Core = 12.8% of exam fee; Live tier = 45% |
| Mentors' IELTS Regular / Crash (H) | BDT 13,800 / 9,500 | Live tier 13,990 is level with Regular (adds AI + human feedback); Crash tier 9,990 / standalone crash 7,490; 3-month pass (2,990) = 22% / 31% |
| 10MS English Centre IELTS Regular (H, 2024) | BDT 15,000 | standalone live batch (9,990) = 67% of it; Live tier = 93%; 3-month pass = 20% |
| Mentors' Basic Package (H) | BDT 19,900 | Mentor 19,990 (1:1 + Progress Promise) |
| Bohubrihi subscription (Oct 2023) | 6 months BDT 12,000; 1 year 18,000 | 12-month pass 6,990 is narrower but far cheaper |
| Ostad (2023) / Programming Hero (2021) | about Tk 6,000 / Tk 5,500 | tech tracks at BDT 2,490 to 4,490 undercut |
| Magoosh GRE (L) | $149 to $219 | GRE Core A $149 (B $89 / C $59); BDT 5,990 local |
| Magoosh IELTS Premium (weak) | 6 months $129 | IELTS Core A $89, Plus A $149 (adds human reviews and weekly live Q&A) |
| GregMat Plus | $11.99/month | intl pass A $24.99/month includes IELTS+GRE and an AI allowance |
| PTE bundles (Pearson) | $59.99 / $89.99 / $119.99 | intl mock pack (5) A $19.99 |

**Caveats.** The 10MS online IELTS price is not known (page text did not show it). Verify before finalising the live batch price. Prices are tested in the first 90 days (17 §12).

### 7.4 Revenue lines beyond B2C

1. **Live batches (P2).** Cheaper than offline centres, positioned as a hybrid (recorded + 36 live sessions + Q&A, `17`/`18`). Benchmarks: 10MS Live Batch 36 live classes over 12 weeks; Mentors' 3.5 months.
2. **B2B seat licences (P2).** Coaching centres and universities. Magoosh's institutional offer starts at ten accounts and lacks custom mock upload and proctoring (competitor-written); Lumen offers 25-seat packs with custom mocks. Coursera sells to Business, Campus and Government with 1,700+ enterprise customers *(global_learning_platforms.md §4)*.
3. **Instructor marketplace (P3).** Benchmark: Udemy pays instructors **37% of net** on organic sales and **97%** on instructor-referred sales, with Quality Review Team approval and minimums of 30 minutes of video, 5 lectures, 720p *(global_learning_platforms.md §1)*. Policy may have changed after the Coursera merger; verify. **Lumen proposal (A22):** 50% to the instructor on platform-sourced sales and 90% on instructor-referred sales, both on net-of-gateway amounts, with the same quality checklist. Model uses a 45% blended platform share.
4. **Study-abroad referrals (P2/P3).** Benchmark: Leverage Edu earns about 70% of revenue from university commissions (Rs 120.6 crore of Rs 173 crore) and Yocket charges universities $10,000 to $100,000/year (2020). Lumen's rule set, because of conflict-of-interest and PDPO consent risks:
   - disclose every commission;
   - recommend on fit, never on payout;
   - share student data only with explicit, withdrawable consent (PDPO);
   - no referrals for under-18s;
   - vet partners (high visa-refusal histories are a reputational risk);
   - Bangladeshi regulation of recruitment agents was **not researched**; take legal advice first.
   
   Not in base-case revenue.
5. **AI credits.** Pure margin line (§8).

---

## 8. Unit economics

### 8.1 Per-transaction costs

| Item | Value | Source / status |
|---|---|---|
| SSLCommerz fee | **2.5%** on bKash/Nagad/Rocket/Visa/Mastercard; 3.5% AMEX; **BDT 25,500 one-time setup** | SSLCommerz pricing page (H) *(bangladesh_market_gapfill.md §1)* |
| SSLCommerz settlement | 5 to 7 business days | third-party directory (weak) |
| Direct wallets (P2) | bKash about 1.85%, Nagad about 1.30% | directory (weak); verify with providers |
| Merchant of record for intl | Paddle about 5% + $0.50 | **background knowledge, unverified** in notes (A) |
| VAT on BD sales | Educational/IT service treatment unconfirmed. PwC reports startups' supplies VAT-exempt from 1 Jul 2026; imported services stay under 15% reverse charge | PwC Finance Act 2026 summary. **Verify with a tax adviser.** Brochure of 10MS shows 15% VAT included in fees. Base case assumes **15% VAT-inclusive prices** (A18); exemption is upside (+15% of BD revenue). |
| Turnover tax | 4% continues; BDT 3M enlistment threshold; BIN/enlistment mandatory for bank accounts, MFS merchant accounts and trade-licence renewal | PwC |
| Foreign SaaS/AI spend | 15% reverse-charge VAT deposited at remittance (cost unless creditable) | PwC; **not modelled**; roughly +15% on foreign tools and AI API spend |

### 8.2 AI evaluation cost per item (estimate)

**Assumption A12:** Sonnet-class model $3 per million input tokens, $15 per million output; Haiku-class $1 / $5 (background knowledge, **not in the notes; verify current pricing**). Speech-to-text: **Deepgram Nova-3** at **about $0.0077/minute** (D3 Speaking default; returns word-level timestamps; verify current pricing). Fallback `whisper-1` with word timestamps costs about $0.006/minute (verify).

| Item | Tokens / minutes | Cost per run | Budget used |
|---|---|---|---|
| Writing Task 2 or AWA essay, one Sonnet pass | about 2,500 in + 1,200 out | $0.0075 + $0.018 = $0.0255 | |
| Two-pass scoring (consistency) | x 2 | about $0.051 | |
| Haiku feedback pass | about 2,500 in + 800 out | $0.0065 | |
| **Writing evaluation, all-in** | | about $0.058 | **$0.06 = BDT 7 (A13)** |
| Full Speaking test (about 14 min audio) | STT 14 x $0.0077 = $0.108 | | |
| Speaking scoring, one pass | about 5,000 in + 1,500 out | $0.015 + $0.0225 = $0.0375 | |
| Two-pass speaking scoring | | about $0.075 (STT $0.108 + $0.075 = about $0.183) | |
| **Speaking evaluation, all-in** | | about $0.183 | **$0.22 = BDT 26 (A13)** at BDT 120/USD, incl. about 20% retry overhead |

**Reading.** AI cost per credit is under BDT 20, against a retail price of BDT 59 per writing credit (590/10): about **88% gross margin before gateway fees**. AI is cheap; the risk is volume abuse and free-tier leakage, so credits are capped per pass. Duolingo's AI rollout cost about 0.9 point of gross margin, a reminder to meter AI *(global_learning_platforms.md §4)*. Human grader overrides (D4 `grader`) are costed separately: assume BDT 250 to 300 per essay (A), so a human-graded add-on would sell at about BDT 499 for roughly 45% margin (P2).

### 8.3 Video and delivery cost
- 1 hour of 720p at about 1.5 Mbps is about 0.68 GB. At Bunny Asia $0.03/GB that is **about $0.02 per viewer-hour (about BDT 2.4)**; Mux Plus 720p about $0.048, Cloudflare Stream about $0.06. *(source: payments_video_security_compliance.md §3 — Bunny, Mux and Cloudflare pricing pages; inference)*
- A 40-hour course watched fully costs about BDT 98 in delivery. Storage is negligible at this scale.
- Bunny MediaCage DRM is $99/month + $0.003 to $0.005 per licence; defer until piracy is material (D3). Use token-signed URLs and a dynamic visible watermark first *(ux_dashboards_video_gapfill.md §5)*.
- Live (P3): LiveKit Ship $50/month includes 150,000 WebRTC minutes and 1,000 concurrent participants; a 100-student hour is 6,000 participant-minutes. Bandwidth overage ($0.12/GB) is the more likely cost *(inference in the notes)*.

### 8.4 Contribution margin by product (VAT applies; A18)

Inputs: gateway 2.5% of gross; lead-instructor royalty 10% of net on their own course only (A14, D12 C19/C32; no royalty on passes, mock packs or AI credits; `30` §10); delivery and AI as above.

| Product | Gross | Net of 15% VAT | Gateway | Royalty / content | Delivery + AI | **Contribution** | % of gross |
|---|---|---|---|---|---|---|---|
| IELTS Academic Core | 3,990 | 3,470 | 100 | 347 | 108 | **2,915** | 73% |
| Mock pack (5) | 990 | 861 | 25 | 69 (8%) | 80 | **687** | 69% |
| AI writing credits (10) | 590 | 513 | 15 | 0 | 84 | **414** | 70% |
| AI speaking credits (5) | 590 | 513 | 15 | 0 | 156 | **342** | 58% |
| Pass, 3 months | 2,990 | 2,600 | 75 | 0 (no royalty on passes) | 398 | **2,127** | 71% |
| Live batch 12 weeks (36 sessions), 30 seats (minimum) | 9,990 | 8,687 | 250 | 3,000 (instructor 2,500 x 36 sessions = 90,000, A20) + 1,200 (TA 36,000) = 4,200 | 150 | **4,087** | 41% |
| Live batch, 40 seats (target) | 9,990 | 8,687 | 250 | 2,250 + 900 = 3,150 | 150 | **5,137** | 51% |
| B2B seat pack, 3 months | 1,400 | 1,217 | 14 (bank) | 97 (8% sales) | 398 | **708** | 51% |
| Intl IELTS Academic Core, Region A ($89) | $89 | n/a (MoR) | $4.95 | $8.40 | $3.55 | **$72.1** | 81% |
| Intl GRE Core, Region A ($149) | $149 | n/a | $7.95 | $14.10 | $2.65 | **$124.3** | 83% |

Per-line figures here are first-order and now use the 10% own-course royalty (the royalty-free pass row rises from 61% to 71%); the reference is `17` §2.3, which also counts AI Tutor, mock scoring and human-review costs (IELTS Academic Core BDT 2,593 contribution, `17`). Prices are those of `17`. Pass usage cost assumes the full monthly allowance (6 writing + 2 speaking) used for 3 months, x1.2 retry overhead, plus video. Heavy users therefore cap out at the allowance rather than becoming loss-making. **Live batches break even on contribution only above about 15 seats** (at 15 seats instructor cost is about BDT 4,000 per seat), so the batch minimum is 30 seats (Crash 15, women-only 20; pilot exception in `18`) with break-even at about 16 seats on the BDT 126,000 fixed batch cost (36 x BDT 2,500 + BDT 36,000 TA; `17` §7).

### 8.5 CAC, LTV and payback

**CAC inputs (weak, single source).** Meta CPM in BDT: broad cold 40 to 90; interest cold 60 to 150; lookalike 90 to 180; retargeting 120 to 250. Education cost per lead BDT 40 to 150 after 4 to 6 weeks of optimisation *(source: bangladesh_market_gapfill.md §6 — practitioner blog, Jan 2026)*. A lead is not a customer: **lead-to-paid conversion is not sourced (A9: 2% to 5%; base 3%)**.

| CPL (BDT) | 2% | 3% | 5% |
|---|---|---|---|
| 40 | 2,000 | 1,333 | 800 |
| 90 | 4,500 | **3,000** | 1,800 |
| 150 | 7,500 | 5,000 | 3,000 |

(Paid CAC in BDT = CPL / lead-to-paid conversion.)

**LTV (12-month, contribution).** Year-1 BD ARPU BDT 3,300 gross: net of VAT 2,870, gateway 83, royalty 344, variable cost 130 gives **about BDT 2,313** (BDT 2,691 if VAT-exempt). First-order contribution on a BDT 3,990 course: **BDT 2,854**.

**Rule.** Cold paid CAC of BDT 3,000 loses about BDT 690 per customer within 12 months. Allowable paid CAC is about **BDT 1,400** (60% of contribution), which means CPL of BDT 40 with 3%+ conversion, or CPL of BDT 90 with 5%+ conversion (retargeting and warm audiences). Use paid media to retarget free-tier users and lookalikes of payers, never to buy cold traffic at scale.

**Blended CAC in the plan** (paid marketing / all paying customers): Year 1 BDT 2.4M / 1,900 = **BDT 1,263**; Year 2 BDT 7.0M / 4,600 = BDT 1,522; Year 3 BDT 14.0M / 11,300 = BDT 1,239. Contribution-to-CAC ratio about 1.8x, 1.5x, 1.9x. That only holds if organic and referral channels deliver at least about 60% of customers (an implicit target; assumption **A10**). **CAC payback** on first order is within the first purchase when blended CAC is under BDT 2,800.

Content production (YouTube) sits in the content budget, not in CAC. If it were allocated to CAC, Year 1 blended CAC would rise to about BDT 2,200.

---

## 9. Go-to-market

### 9.1 Funnel
Free content (YouTube, Facebook, TikTok) → free diagnostic / band-score calculator / vocab list (SEO) → sign-up (phone OTP, Google) → first mock completed (activation) → first AI evaluation → paywall at second full mock or second AI evaluation → purchase → community and referral.

### 9.2 Channels
1. **YouTube / Facebook / TikTok free content** (the 10MS playbook: free Facebook page 2014, YouTube 2015). Reach: Facebook 64.0M, YouTube 49.8M (+11.7% YoY), TikTok 56.2M (+27% YoY) *(DataReportal)*. TikTok and YouTube are growing faster than Facebook (inference).
2. **SEO**: IELTS band-score calculators (using the raw-to-band tables: IDP Academic Reading 30 to 32 = 7.0 etc.), free mock tests, GRE/IELTS vocabulary lists, "estimated band" tools.
3. **Community**: Facebook groups and Discord; weekly doubt-solving (10MS runs weekly Zoom doubt sessions and a support group).
4. **Referral programme** (P2 coupons/affiliates): double-sided credit (e.g. one free AI evaluation each, A).
5. **Partnerships**: coaching centres (B2B seats), university clubs, study-abroad consultancies (non-exclusive, with the ethics rules in §7.4).
6. **Paid media**: retargeting and lookalikes only (§8.5).

### 9.3 First 90 days after public launch (public launch ~3 May 2027 after a Zoom pilot cohort ~1 Mar 2027, per `24`; A17)

| Week | Milestone | Metric / gate |
|---|---|---|
| L1 | Public launch; launch offer is honest (founding-learner price lock, no fake discount); first 5 YouTube videos live | 500 sign-ups; payments end-to-end test with 10 real orders |
| L2 | Publish AI-scoring methodology and validation summary; collect first 100 NPS responses | validation page live |
| L3 | Free "Band Score Calculator" and vocab pages indexed | 1,500 cumulative sign-ups |
| L4 | Referral link live; WhatsApp support SLA tested | first-response under 4 hours (A) |
| L5 | First retargeting campaign (free-tier non-purchasers) | CPL <= BDT 90; CAC <= BDT 1,800 |
| L6 | Pilot with 3 coaching centres (free seats in return for feedback) | 150 pilot learners |
| L7 | Price test A: IELTS Academic Core BDT 3,990 vs 3,490, run as a time-split with price lock, never two prices to one user (`32` §9, GA-015) | conversion delta measured |
| L8 | Mid-point review: paid conversion, refund rate, AI complaints | decision gate: continue paid spend if blended CAC <= BDT 1,800 |
| L9 | GRE content push (Verbal/Quant free diagnostic); intl pricing live | 50 intl customers |
| L10 | First "student results" posts, with permission and verified scores | 20 submitted exam results (calibrates predictor) |
| L11 | Live Q&A event (YouTube Live) as a paid-batch preview | 300 attendees |
| L12 | Pass renewal reminders (T-7) tested; second price test | renewal rate baseline |
| L13 | 90-day review: KPIs vs plan; decide hiring gate | see §14 |

Base-case Year 1 quarterly customers (cumulative): Q1 152, Q2 475, Q3 1,045, Q4 1,900.

### 9.4 Brand and trademark behaviour in marketing
No ETS, IELTS or other test marks in brand, domain, handles or **ad keywords**; use nominative phrasing ("practice for the GRE® test") plus the required disclaimer *(exam_specifications_gapfill.md §6)*. IELTS, PTE and DET policies were not retrieved; take a lawyer's view before launching.

---

## 10. Operations

### 10.1 Content production pipeline
Syllabus map → item spec (task type, difficulty tag, skill tag) → draft by instructor/item writer → peer and editor review → listening audio recording (own voice actors) → pilot with beta learners → psychometric tagging (difficulty from live data) → publish as a versioned question (D6). **Original content only; never copy official past papers.**

| Role | Task | Cost basis (A) |
|---|---|---|
| Instructors (part-time, royalty or fee) | video lessons, live classes | work-for-hire fee per asset plus an optional 10% lead-instructor royalty on their own course only (D12 C19/C32) |
| Content editor (D4 `content_editor`) | review and publish | salaried |
| Item writers | mocks, question bank | per-item fee |
| Human graders (D4 `grader`) | override AI bands with rationale; validation set | per task |

**Year 1 content budget BDT 1.8M (A16):** video production 0.8M; item writing and review 0.5M; listening audio 0.2M; certified-examiner validation 0.2M; Bangla UI and translation 0.1M.
**AI scoring calibration (replaces the earlier BDT 0.18M validation line; GA-006, `31`):** the 200 essays + 60 recordings plan was under-budgeted roughly 5 to 10x against `07` §7.9 (at least 200 to 400 double-rated responses per task family, 25+ accents, a third adjudicator, yearly refresh). The budget is now **about BDT 1.93M, phased**: **Phase A BDT 0.74M pre-launch (Jan to Mar 2027)** and **Phase B BDT 1.19M** after launch, plus about **BDT 0.7M a year** ongoing from Year 2 (refresh, new accents, new task types). Publish agreement within 0.5 band and known weak spots (competitor tests found AI weakest on Task Response and unusual accents).

### 10.2 Quality assurance
Udemy-style publishing checklist for instructors: at least 30 minutes of video, at least 5 lectures, 720p or 1080p, synced stereo audio, course page with description over 200 words *(global_learning_platforms.md §1)*. Test engine: automated e2e on timers, autosave and resume (D6); band tables flagged "approximate" and kept as editable data.

### 10.3 Customer support
WhatsApp and Messenger plus a help centre; hours 9:00 to 23:00 (A), first-response SLA 4 hours (A). Benchmarks: 10MS 24/7 hotline 16910; Programming Hero replies within 24 hours. Refund workflow through the SSLCommerz Refund API (requires the merchant's public IP to be registered) *(bangladesh_market_gapfill.md §1)*.

### 10.4 Team plan and salaries
**All salaries are Assumption A15** (no salary data in the notes); monthly BDT, rounded.

| Phase | Roles (monthly BDT) | Monthly payroll |
|---|---|---|
| Pre-launch (months -5 to 0) | Founder 40k; full-stack engineer 85k; academic lead 60k; content/video editor 35k; rater coordinator (part-time, `31`) 20k | about 240k |
| Year 1 | + support exec 25k; growth marketer 40k; lead rater (part-time, `31`) 25k. Part-time instructors and graders on fees; finance part-time and CA retainer BDT 15-30k a month per `30` | about 340k incl. 5% burden (BDT 4.1M/year) |
| Year 2 | + second engineer 75k; B2B sales exec 45k + commission; second support exec 25k; GRE lead 55k; two item writers/QA 60k; data/ops 40k | about 570k (BDT 6.8M/year) |
| Year 3 | + mobile (Expo) and platform engineers; tech-track leads; partnerships manager; finance/compliance; customer success | about 1.08M (BDT 13.0M/year) |

Hiring is gated by KPIs (§14): no Year 2 hires until paid conversion is at least 3% and monthly net revenue exceeds BDT 1M for two months (A).

---

## 11. Financial projections (3 years)

### 11.1 Assumptions that drive the model (all A)
- **Customers and ARPU (base).** BD IELTS/GRE B2C customers per year: 1,800 / 4,000 / 6,500, with gross ARPU BDT 3,300 / 3,800 / 4,200 (includes repeat purchases). International customers 100 / 600 / 1,800 at $55 / $55 / $60. Live-batch seats 0 / 300 / 900 at BDT 9,990 (36 sessions; was 8,900 and 24 classes; `17`). Live seats in Year 2-3 therefore carry about +12% revenue against the figures in §11.2-11.3, which are left unchanged as a conservative case. B2B: 0 / 20 / 60 institutions with 80 / 100 seats and 1.5 seat packs a year at BDT 1,400. Tech/university customers (P3) 0 / 0 / 3,000 at BDT 2,200. Marketplace GMV BDT 3M in Year 3 at a 45% platform share.
- **Conversion.** Implied registered users assume 4% of sign-ups pay (A8). This gives 47,500 / 115,000 / 282,500 sign-ups, which include free-tool and SEO users beyond the SAM definition.
- **VAT.** Prices are VAT-inclusive and 15% VAT is deducted in the base case (A18); the startup exemption is shown as a sensitivity.
- **COGS** = SSLCommerz 2.5% of BD billings + 5% + $0.50 MoR on international + 10% lead-instructor royalty on net revenue of royalty-bearing courses only (A14; no royalty on passes, packs or credits; the 12% earlier figure is superseded) + BDT 130 variable cost per paying customer + BDT 10 per registered user (free-tier AI/OTP).
- **Opex (BDT M)**: payroll 3.6 / 6.8 / 13.0; paid marketing 2.4 / 7.0 / 14.0; content 1.8 / 3.0 / 5.0; tools and infrastructure 0.7 / 1.2 / 2.2; G&A, legal, accounting, workspace 1.3 / 1.8 / 3.0. Total 9.8 / 19.8 / 37.2. Pre-launch spend 2.2 (setup, team for 5 months, content, tools; A23).
- Foreign-service reverse-charge VAT is not modelled (up to about +15% on foreign SaaS/AI spend).
- Break-even month is computed from monthly gross profit, interpolated linearly between annual run-rates, against monthly opex (stepped by year).

### 11.2 Base case, Year 1 by quarter (BDT M)

| | Q1 | Q2 | Q3 | Q4 | Year 1 |
|---|---|---|---|---|---|
| Registered users (new, implied) | 3,800 | 8,075 | 14,250 | 21,375 | 47,500 |
| Paying customers (new) | 152 | 323 | 570 | 855 | 1,900 |
| Gross billings | 0.53 | 1.12 | 1.98 | 2.97 | 6.60 |
| Net revenue (after VAT) | 0.47 | 0.99 | 1.75 | 2.62 | 5.83 |
| COGS | 0.13 | 0.27 | 0.48 | 0.72 | 1.61 |
| Gross profit | 0.34 | 0.72 | 1.27 | 1.90 | 4.22 |
| Opex | 1.90 | 2.30 | 2.70 | 2.90 | 9.80 |
| **Operating result (burn)** | **-1.56** | **-1.58** | **-1.43** | **-1.00** | **-5.58** |

Quarter shares of Year 1 revenue are 8% / 17% / 30% / 45% (A, ramp).

### 11.3 Three-year summary, three scenarios (BDT M unless noted)

**Scenario definitions.** *Bear:* 55% of base customers, ARPU x 0.85, marketing x 1.2, hiring freeze (opex x 1.0 / 0.7 / 0.6). *Bull:* 150% of base customers, ARPU x 1.08, reinvestment (opex x 1.05 / 1.25 / 1.4).

| | **Base Y1** | **Base Y2** | **Base Y3** | **Bear Y1** | **Bear Y2** | **Bear Y3** | **Bull Y1** | **Bull Y2** | **Bull Y3** |
|---|---|---|---|---|---|---|---|---|---|
| Paying customers | 1,900 | 4,600 | 11,300 | 1,045 | 2,530 | 6,215 | 2,850 | 6,900 | 16,950 |
| Implied registered users (4%) | 47,500 | 115,000 | 282,500 | 26,125 | 63,250 | 155,375 | 71,250 | 172,500 | 423,750 |
| Gross billings | 6.60 | 25.19 | 68.82 | 3.09 | 12.27 | 33.99 | 10.69 | 40.08 | 108.85 |
| Net revenue | 5.83 | 22.42 | 61.53 | 2.72 | 10.91 | 30.34 | 9.44 | 35.69 | 97.39 |
| COGS | 1.61 | 5.20 | 13.83 | 0.81 | 2.64 | 7.06 | 2.52 | 8.12 | 21.54 |
| Gross profit | 4.22 | 17.22 | 47.70 | 1.91 | 8.27 | 23.28 | 6.92 | 27.57 | 75.86 |
| Gross margin | 72.4% | 76.8% | 77.5% | 70.2% | 75.8% | 76.7% | 73.3% | 77.2% | 77.9% |
| Opex | 9.80 | 19.80 | 37.20 | 10.28 | 14.84 | 24.00 | 10.29 | 24.75 | 52.08 |
| **Operating result** | **-5.58** | **-2.58** | **+10.50** | -8.37 | -6.57 | -0.72 | -3.37 | +2.82 | +23.78 |
| Cumulative (post-launch) | -5.58 | -8.16 | +2.34 | -8.37 | -14.94 | -15.66 | -3.37 | -0.55 | +23.23 |
| Break-even month (monthly model) | **21** | | | **31** | | | **10** | | |
| Peak cumulative burn, post-launch (BDT M) | 9.61 | | | 17.94 | | | 5.53 | | |
| Peak burn + pre-launch 2.2 (BDT M) | **11.8 (about $98k)** | | | 20.1 (about $168k) | | | 7.7 (about $64k) | | |

Revenue mix, base (gross billings, BDT M): Year 1: BD B2C 5.94, international 0.66. Year 2: BD B2C 15.20, international 3.96, live batches 2.67, B2B 3.36. Year 3: BD B2C 27.30, international 12.96, live 8.01, B2B 12.60, tech/university 6.60, marketplace 1.35.

ARPU (gross billings / paying customers): Year 1 about BDT 3,470; Year 2 about 5,480; Year 3 about 6,090. (Includes live and B2B billings in the numerator; paying customers exclude B2B seat holders, so blended ARPU is overstated. Use the BD B2C ARPU of 3,300 / 3,800 / 4,200 for pricing decisions.)

**VAT sensitivity (base).** If the startup VAT exemption applies from 1 Jul 2026: Year 1 operating result -4.90, Year 2 -0.15, Year 3 +16.92, break-even month **19**, peak burn BDT 7.44M (before pre-launch).

**Sanity checks.**
- Year 3 base needs 4.9% of the SAM learner pool and about 283,000 registrations, which is big for a solo-founder venture. 10MS claims 3.2M MAU (weak), so the funnel is not impossible, but the plan relies on the free-content engine working. The bear case (about 2.7% of SAM) is the more prudent budget.
- The model does not include a founder salary above BDT 40k, a retained VAT liability audit, or foreign exchange loss.
- International billings (Year 3 BDT 13.0M, about $108k) are modest: 1,800 customers at $60. International sales are an option, not the core.

### 11.4 Funding and use of funds
Base case need was BDT 11.8M. Adjustments: minus BDT 0.18M (old validation line) plus **BDT 1.93M AI-calibration budget** (`31`: Phase A BDT 0.74M pre-launch, Jan to Mar 2027, funded from tranche 1; Phase B BDT 1.19M in Year 1) gives **BDT 13.55M**; plus the 25% buffer = **about BDT 16.9M (about $141k)**. The 10% royalty (was 12%) and the BDT 9,990 batch price modestly lower COGS and raise live revenue; those gains are not booked here. Not yet in the base case and to be added when quoted: reverse-charge VAT on imported services and the CA retainer (`30`). Suggested staging: tranche 1 BDT 7M (pre-launch, including calibration Phase A, to month 4 post-launch); tranche 2 released on KPI gates (§14). Use of funds: payroll 45%, paid marketing and content 35%, tools/infra 8%, legal and G&A 12% (A).

---

## 12. Legal and compliance

### 12.1 Business registration and tax
| Option | Pros | Cons / requirements |
|---|---|---|
| Sole proprietorship | Cheap, fast; SSLCommerz accepts it: trade licence, bank account + cheque leaf, signatory NID, TIN, DBID, signed Merchant Enrollment Form, undertaking | Unlimited liability; weaker for investors and marketplace contracts |
| Partnership | Shared founders | Same liability issues |
| **Private Limited Company** (recommended, A) | Limited liability, investor-ready, marketplace contracts | Additional SSLCommerz documents: incorporation certificate, MOA/AOA, Form XII, **BIN/VAT certificate**, TIN, DBID |

*(source: payments_video_security_compliance.md §1 — SSLCommerz onboarding)*

- **BIN/enlistment** is mandatory for bank accounts, MFS merchant accounts and trade-licence renewal; turnover tax 4% continues; BDT 3M turnover threshold; startups reported VAT-exempt from 1 Jul 2026 with a nine-year growth period *(PwC Finance Act 2026)*. **Verify with a tax adviser** whether Lumen qualifies and whether e-learning is exempt, 5% or 15%.
- **Export of services (international sales).** Bangladesh Bank FEPD circular of 30 July 2026: service export proceeds can come via licensed PSPs/OPGSPs and digital wallets; repatriation within four months; OPGSP receipts up to $10,000 per transaction; service inflows without Form-C up to $20,000 *(first 100k of 188k characters read)*. The 22 July 2026 freelancer easing (retain up to 50% ICT, 30% other) is for freelancers; a company must check its own treatment.
- **Foreign payments.** Stripe and PayPal do not serve Bangladesh-registered businesses; Paddle lists Bangladesh as a price-conversion country but seller eligibility is unconfirmed; Lemon Squeezy supports bank payouts to Bangladesh (secondary source) *(payments_video_security_compliance.md §2)*. D3 plan: Paddle first, otherwise Stripe via a foreign entity.
- Foreign VAT: Paddle as merchant of record handles destination taxes (verify).

### 12.2 Trademarks and content
- **ETS:** required notice "[mark] is a registered trademark of ETS. This product is not endorsed or approved by ETS."; no ETS marks in company, product, domain, handles, trademark filings or advertising keywords; no logos; no full test names in plural/possessive; submit materials to trademarks@ets.org (about 10 business days) *(exam_specifications_gapfill.md §6)*.
- **IELTS, PTE, DET policies:** not retrieved; assume equivalent rules. IELTS is owned by the British Council, IDP and Cambridge University Press & Assessment (background knowledge).
- **Original content only:** no scraping, no official past papers, no leaked questions. Licensed content only with written permission. Every band and score is labelled "estimated" (D6).
- Brand "Lumen Academy" is a placeholder: run a trademark search (Bangladesh and target markets) before spending on brand assets.

### 12.3 Data protection
- **Bangladesh PDPO 2025**, approved by cabinet 9 Oct 2025 and amended by an Ordinance gazetted 5 Feb 2026: applies to foreign entities handling Bangladeshi data; consent must be informed, explicit, specific and withdrawable; parental consent for children; **profiling, behavioural tracking and targeted ads aimed at minors prohibited**; breach reporting to the National Data Governance Authority; cross-border transfer needs "equivalent protection" (undefined); fines up to **5% of annual turnover**; localisation limited to critical sectors per TBS, but a DigiBangla headline reports a local-storage mandate (**unresolved**); commencement date unconfirmed *(payments_video_security_compliance.md §6)*.
- **Design now for:** age gate with guardian-consent flow (D7), no marketing to under-18s, consent logs, breach process, data-transfer assessment for foreign processors (video CDN, MoR, analytics, AI APIs), hosting student PII in a Singapore region or a Bangladesh replica as a hedge.
- **GDPR** for EU users (applies when targeting EU residents, Art. 3(2); **background knowledge, not researched**) and cookie consent for PostHog.

### 12.4 Refunds and terms
Refund policy: 7 days if under 20% consumed; no refunds on consumed AI credits (D5); certificates revoked on refund. Compare 10MS: 48-hour request window, not refundable after more than 5 premium videos or a certificate, refunds returned in 7 to 14 working days. Terms of service, privacy policy, acceptable-use policy and instructor agreement are needed for Google OAuth production verification (home page and privacy policy on an owned domain) *(payments_video_security_compliance.md §5)*.

---

## 13. Risks and mitigations

| Risk | Likelihood / impact | Evidence | Mitigation |
|---|---|---|---|
| Visa and policy shocks cut outbound demand | High / High | US refusals 73%, new BD students -69%; Australia 51% refusal (Feb 2026) | Diversify to PTE/DET, migration, Germany/Malaysia pathways, tech tracks and B2B; keep fixed costs low; gate hiring |
| IELTS volume decline (IDP Language Testing volume -8% in FY26; IDP plans for a 20-30% market fall in FY27) | High / High | IDP outlook (D11; `marketing_international_gapfill.md`) | **D11 hedge:** test-agnostic positioning ("pass the English test your goal needs"), English Foundation and the "Which test do I need?" quiz in P1, PTE and DET in P2, Work-Abroad language tracks (EPS-TOPIK, JFT-Basic) in P2/P3, exam-agnostic engine. Planning case: IELTS demand -20% to -30% in FY27, which lands on SAM in §5 and the bear case in §11 |
| Exam-owner (IDP/British Council/ETS) trademark or takedown request | Medium / High | Nominative-use position only (C31) | Canonical disclaimer text; no exam-owner logos; takedown runbook with a lawyer on call; owner: founder |
| Payment gateway suspension or outage | Medium / High | Single aggregator at launch | Backup aggregator (EPS/aamarPay) applied for in the first 30 days; settlement monitoring (`30`); owner: finance |
| Single LLM provider outage or price change | Medium / Medium | One primary model | Fallback provider (Gemini) via the provider abstraction; cached results; owner: engineering |
| Meta ad account ban (primary paid channel) | Medium / High | Account-level risk | Second ad account via a business manager, owned email/WhatsApp/SEO list; owner: growth |
| SMS/OTP delivery failure at launch | Medium / Medium | Local operator filtering | Two SMS gateways plus email OTP fallback; owner: engineering |
| Regulatory change (VAT, data protection) | Medium / Medium | Finance Act 2026 changes | Adviser consult each quarter; price VAT-inclusive; owner: finance |
| AI scores not trusted | Medium / High | IDP advises against LLM grading; peers' self-tests 70% to 79% within 0.5 band | Publish validation; "estimated" labels; human override option; track AI-score agreement as a KPI |
| Content piracy | High / Medium | Learnyst-style leaks widely cited; no BD data | Token URLs, dynamic watermark, device limits; DRM only when material |
| Price war / free competitors | High / Medium | Free IELTS Liz, BC IELTS Ready, ETS tests; AI apps from $1.99/week | Compete on fidelity, validation, bundle (IELTS+GRE), B2B |
| Platform dependence on Facebook/YouTube | Medium / High | 10MS grew on both; algorithm change risk | Own email/SMS/WhatsApp list, SEO, community |
| Payment gateway onboarding delays | Medium / High | Needs trade licence, TIN, BIN for Ltd, MEF; BDT 25,500 setup | Start applications in the first 30 days; keep a second aggregator (EPS, aamarPay) as backup |
| VAT and tax uncertainty | Medium / Medium | Startup exemption reported, e-learning treatment unconfirmed | Early adviser consult; price VAT-inclusive; model both |
| Founder bandwidth / key person | High / High | 10MS 2024 shock; solo-founder load | Hire academic lead and engineer first; document processes; D9 AI-assisted build |
| Political/funding shocks | Medium / High | 10MS halts Aug 2024; Startup Bangladesh cancellation | Digital-first cost base; no offline lease commitments |
| Free-tier AI abuse | Medium / Medium | Credits-based tiers (Prep) | Per-user and per-IP rate limits, Turnstile, no rollover credits |
| Data-protection fines | Low / High | Up to 5% of turnover | Consent logs, minors flow, DPO, retention limits |
| Trademark complaint | Medium / High | ETS rules; IELTS/PTE unread | Neutral brand; disclaimers; lawyer review before launch |
| Debt-funded growth | Low / High | BYJU'S, Unacademy | No debt-financed acquisitions; equity or revenue only |
| AI calibration under-budget or rater shortage | Medium / High | GA-006: earlier plan funded BDT 0.18M, `31` needs ~1.93M | Phased budget in §10.1/§11.4, rater coordinator and lead rater hired; AI scores shown as "estimated" until Phase A passes the QWK gate | 
| Heavy-user cost on passes | Medium / Low | Allowance model | Monthly caps, no rollover |

---

## 14. KPIs and dashboard

**KPI definitions, formulas, events, owners and cadence live in `32` (KPI dictionary; GA-015); the table below is the targets view.**

**North-star metric:** weekly active learners who complete at least one timed practice (section or full mock). It captures the product's core value (practising under exam conditions) and correlates with paying.

| KPI | Definition | Target (A) | Source / benchmark |
|---|---|---|---|
| Activation | % of new sign-ups completing a first mock (or diagnostic) within 7 days | 35% | |
| Weekly active learners | learners with at least 1 timed practice per week | track vs North Star | |
| Paid conversion | % of sign-ups paying within 90 days | 4% base; hiring gate at 3% | |
| Blended CAC | paid marketing / new paying customers | <= BDT 1,800 | model BDT 1,263 |
| CAC payback | months to recover CAC from contribution | within first purchase | |
| Refund rate | refunds / orders (7-day money-back, C13) | < 5% | |
| AI-score agreement | % of AI band estimates within 0.5 band of certified examiners (validation set >= 200 essays) | >= 80% | peers' self-reported 70% to 79% |
| Course completion | % reaching 80% of lessons | >= 50% | Programming Hero 33% |
| NPS | quarterly | >= 40 | |
| Support first response | median | < 4 hours | |
| Revenue mix | B2C / live / B2B / intl | track | |
| Gross margin | net revenue minus COGS | >= 72% | model |
| Streak adoption (P2) | weekly study-day target met | track | modest gains in RCT evidence; do not over-invest |

**Dashboards.** Founder weekly (sign-ups, activation, conversion, revenue, refunds, CAC by channel); academic (item difficulty, flagged items, AI disagreements); finance (orders, VAT export, gateway settlement lag 5 to 7 business days, refunds) - roles per D4 `finance`. Log cheap engagement signals from day one: dropped and bookmarked lectures (Udemy instructor dashboard model).

**Hiring and spend gates.** Release tranche 2 funding and Year 2 hires when: paid conversion >= 3%, blended CAC <= BDT 1,800, refund rate < 5%, and net revenue >= BDT 1M/month for two consecutive months (A).

---

## 15. Action plan and decision checklist for the founder

### 15.1 First 30 / 60 / 90 days (from 2026-11-07)

| Window | Actions | Output |
|---|---|---|
| **Days 1 to 30 (to about 7 Dec 2026)** | Decide company form (Private Limited recommended) and brand; trademark search; lawyer and tax adviser consult (VAT status, export proceeds); start trade licence / TIN / BIN / bank account; begin SSLCommerz application; confirm 10MS online IELTS prices and Mentors'/BC Bangladesh prices manually; hire engineer and academic lead; lock P0 backlog; set up YouTube channel and Facebook page; draft 20 IELTS lesson outlines | Entity in progress; decisions logged in `00-DECISIONS.md` |
| **Days 31 to 60 (to about 6 Jan 2027)** | P0 complete (auth, catalogue, CMS); payments in sandbox; first 20 hours of IELTS video and 300 items; AI prompt harness and a 50-essay pilot set; publish first 10 YouTube videos; start waitlist | Waitlist 1,000 (A); sandbox payments working |
| **Days 61 to 90 (to about 7 Feb 2027)** | Closed beta of the P1 mock engine with about 50 learners; start the 200-essay certified-examiner validation; apply for Paddle; draft refund policy, terms, privacy policy; select 3 pilot coaching centres | Beta feedback; validation in progress |
| Days 91 to 150 | Finish P1; Zoom pilot cohort ~1 Mar 2027 and public launch ~3 May 2027 per `24` (A17); then the 13-week plan in §9.3 | Launch |

### 15.2 Decision checklist
- [ ] Which product did you mean by "collegeapp"?
- [ ] Launch scope: IELTS only, or IELTS + GRE? (GRE TAM is about 4% of the IELTS TAM and exposed to US refusals.)
- [ ] Company form and registered name; brand and domain cleared of ETS/IELTS marks.
- [ ] Tax adviser: is Lumen a qualifying startup for VAT exemption? Is e-learning exempt, 5% or 15%? How are imported services (Vercel, Neon, AI APIs) treated?
- [ ] Gateway: SSLCommerz first (2.5%, setup BDT 25,500); backup aggregator; direct bKash later.
- [ ] International: Paddle eligibility for a Bangladesh company vs a foreign entity route (D3).
- [ ] Funding source: self, angel, grant, or revenue-funded; amount BDT 12M to 15M.
- [ ] Confirm price points (§7.2) after checking live competitor pages; set first price tests.
- [ ] AI vendor prices and a human-grader policy (who validates the AI?).
- [ ] Hiring order: engineer, academic lead, content editor, support, marketer.
- [ ] Hosting of student data: Singapore region vs Bangladesh replica given PDPO uncertainty.
- [ ] Referral/affiliate ethics policy before any study-abroad partner outreach.

---

## 16. Assumption register and open data gaps

| ID | Assumption | Used in | How to replace |
|---|---|---|---|
| A1 | 1 USD = BDT 120 | all conversions | current Bangladesh Bank rate |
| A2 | 3 preparers per eventual outbound student | TAM | survey; IDP/BC volumes |
| A3 | +30% migration/professional uplift | TAM | same |
| A4 | BDT 10,000 spend per IELTS learner | TAM | competitor price checks |
| A5 | 7,000 GRE takers per year; 2x prep multiple; BDT 8,000 | TAM | ETS/agent data |
| A6 | PTE/DET learners = 15% of IELTS learners at BDT 5,000 | TAM | test-owner data |
| A7 | 50% (IELTS) / 60% (GRE) reachable online | SAM | web analytics |
| A8 | 4% of registered users pay | projections | measure from beta |
| A9 | Lead-to-paid 2% to 5% (3% base) | CAC | measure from ads |
| A10 | At least 60% of customers organic/referral | CAC | measure |
| A11 | Customer and ARPU paths (§11.1) | projections | measure |
| A12 | Sonnet-class $3/$15 and Haiku-class $1/$5 per M tokens | AI cost | provider price pages |
| A13 | $0.06 per essay, $0.22 per speaking test (BDT 7 and 26) | AI cost | measure |
| A14 | 10% lead-instructor royalty on net of their own course only (D12 C19/C32); earlier 12% superseded | COGS | contracts |
| A15 | Salaries (§10.4) | opex | market quotes |
| A16 | Opex lines (§11.1) | opex | bottom-up budget |
| A17 | Pilot ~1 Mar 2027; public launch ~3 May 2027 (`24`) | timeline | build plan |
| A18 | Prices VAT-inclusive; 15% VAT deducted in base case | revenue | tax adviser |
| A19 | Variable cost BDT 130 per paying customer + BDT 10 per registered user | COGS | measure |
| A20 | Live batch: 36 sessions at BDT 9,990, instructor BDT 2,500 per session, TA BDT 36,000 per batch, fixed cost BDT 126,000, minimum 30 seats (`17`) | live margin | quotes |
| A21 | B2B seats 80 to 100 per institution, 1.5 packs per year | B2B | pilots |
| A22 | Marketplace split 50% / 90% instructor; 45% blended platform share | marketplace | contracts |
| A23 | Pre-launch spend BDT 2.2M | funding | budget |

**Data the notes do not contain** (so the plan does not state them): any IELTS/GRE test-taker count for Bangladesh; 10MS online IELTS prices and current user numbers; Bangladeshi university/CSE enrolment; verified CAC and conversion benchmarks (the CPM/CPL source is a single practitioner blog, internally inconsistent about its "mid-2026" label); SMS OTP cost; salary data; competitor revenues; Paddle/Lemon Squeezy fees; regulation of study-abroad agent commissions; whether e-learning is exempt from VAT.
