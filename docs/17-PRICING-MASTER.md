# 17 — Pricing Master (canonical price book)

> Status: v1, 2026-11-07. **Single source of truth for every price, allowance, discount, refund and guarantee.** Every other doc points here; if a doc disagrees with this file on money, this file wins (it conforms to `00-DECISIONS.md` D5, D10, D11 and the binding D12 rows C1/C9/C13b/C14/C16/C17/C19/C20/C21/C24/C25). Changing a price = edit §13 YAML first, then the tables.
> Conventions: BDT prices are **VAT-inclusive** (15%, A18) and end in 90/990-style charm points; USD prices are what the learner pays before any merchant-of-record sales tax. Costs and margins use `02-BUSINESS-PLAN.md` §8 inputs (FX 120, gateway 2.5%, VAT 15%, Bunny video BDT 2.4/viewer-hour). Anything not verified is tagged **[A#]** and listed in §14. Planning FX: **1 USD = BDT 120 (A1)**.
> Regions (D10, D12 C16/C25): `BD` (BDT via SSLCommerz), `A` (US/UK/EU/CA/AU/NZ/Gulf; Singapore, Japan, Korea, Hong Kong default here too, **[A]**), `B` (upper-middle-income, e.g. Malaysia, Türkiye, Latin America), `C` (South Asia ex-Bangladesh, Africa, SE Asia ex-Malaysia/Singapore). Region is resolved from the **billing country** at the merchant of record; IP is only a hint. Bangladeshi residents always see BDT.
> **Regional rule (D12 C25), applied mechanically to every priced row:** `C` = lowest charm price **>=** (BD price / 120); `B` ~ 1.5 x C; `A` ~ 2.5 x C, snapped to the USD ladder (.99 below $30, whole numbers ending in 9 or 4 above). So a non-BD buyer never pays less than a Bangladeshi buyer. This **supersedes** the USD price points in 02 §7.2 (Core/passes moved up; see §5 for the pass reasoning).

---

## 1. Pricing principles

1. **Value ladder, each rung justified by a cost we actually carry.** Free (trust) -> Core (recorded path) -> Plus (AI coach + 2 human reviews + weekly live Q&A) -> Live (cohort, teachers, human speaking/writing feedback) -> Mentor (1:1 + Progress Promise). A rung may only be added to the price if it adds a cost or a verifiable outcome.
2. **Anchors (BD).** IELTS on Computer fee **BDT 31,100** *(IDP Bangladesh; research: bd_segments_marketing.md §4)*; offline coaching **BDT 9,500 (Mentors Crash) / 13,800 (Mentors Regular) / 15,000 (10MS English Centre, VAT-incl.) / 19,900 (Mentors Basic Package)** *(south_asia_edtech.md §1-2)*. Core = **12.8%** of the exam fee and Live (13,990) = **45%**; Live sits just under the 10MS centre fee (15,000) and about level with Mentors Regular (13,800) while including AI coaching and human feedback; Mentor (19,990) stays inside the Mentors Basic Package band (19,900).
3. **Honest pricing.** No fake strikethrough (Pearson's $237.94 "was" is the anti-pattern). A `compare_at` price may be shown **only** if that price was actually charged for >= 28 consecutive days in the last 90 (D12 C14; enforced in the pricing service, otherwise null). No resetting countdown timers. Discounts are real percentages off the list, and the list does not move during a promo.
4. **VAT-inclusive display in BD** (the 10MS brochure shows 15% VAT included). The cart and receipt show the VAT component separately; invoices carry BIN. If the startup VAT exemption (PwC, 1 Jul 2026) is confirmed, prices stay; the 15% becomes margin (02 §8.1).
5. **Charm and thresholds (BD).** Use x,990 above BDT 1,000; x,490 for small add-ons; x99/x49 below 1,000 (BDT 299/499/699/999 for English Foundation). Stay just under psychological thresholds: **5,000 (Core), 10,000 (standalone batch, Crash), 15,000 (Live), 20,000 (Mentor)**. Micro products stay <= BDT 999 (one-tap bKash without second thoughts). USD: .99 below $30, then 39/49/59/79/99/149/199/299/399.
6. **Packaging rule (02 §7.2, kept).** The 3-month pass must cost >= ~75% of Core (BDT 2,990 vs 3,990 = 75%) so passes do not erase course sales. Courses are the *structured path* (sequence, certificate, static study plan, Q&A access); passes are *breadth* (IELTS + GRE + later exams, practice allowance) with no certificate, no study plan, no live, no human review.
7. **No in-product ads, ever.** No rewarded-ad refills. Revenue = tiers, passes, add-ons, books, B2B, services.
8. **Human effort is priced per unit, AI per credit.** One `ai_credit` pool (D12 C1): writing task = 1 credit; one Speaking part = 1; full Speaking test = 2; GRE AWA = 1. Free = 2 credits at sign-up + 1 per calendar month, no rollover. Human reviews, human speaking mocks and 1:1 sessions are separate counters (never converted to credits).
9. **Allowances are fair-use, enforced server-side** (entitlements, D5). Limits table: per user 10 evaluation requests/hour and 2 concurrent (09, D12 C17). **Daily ceiling on AI evaluations:** Free 1, Core 3, Pass 4, Plus/Live/Mentor 6. AI Tutor message ceilings in §2.
10. **Margin discipline.** Every Core/Plus tier must clear **>= 45% contribution at 100% allowance use** (arithmetic in §2.3). Live/Mentor may be lower but must be positive at the **minimum batch size**. Passes, standalone and add-ons target >= 40% (human-delivered services have a stated floor).

---

## 2. Tier matrix per course

### 2.1 Prices (all tiers, every region)
Free is the same everywhere. "Live Crash" is the 4-week crash variant of the Live tier (`crash`). Prices for **PTE (P2), DET (P2), TOEFL (P3)** are provisional and re-run through §2.3 before launch.

**IELTS Academic** (P1)

| Tier | BDT (VAT-incl.) | USD region A | USD region B | USD region C |
|---|---:|---:|---:|---:|
| Free | 0 | 0 | 0 | 0 |
| Core | **3,990** | $89 | $49 | $34 |
| Plus | **6,490** | $149 | $89 | $59 |
| Live | **13,990** | $299 | $179 | $119 |
| Live Crash | **9,990** | $229 | $129 | $89 |
| Mentor | **19,990** | $399 | $249 | $169 |

**IELTS General Training** (P1)

| Tier | BDT (VAT-incl.) | USD region A | USD region B | USD region C |
|---|---:|---:|---:|---:|
| Free | 0 | 0 | 0 | 0 |
| Core | **3,490** | $79 | $49 | $29.99 |
| Plus | **6,490** | $149 | $89 | $59 |
| Live | **12,990** | $299 | $179 | $119 |
| Live Crash | **9,490** | $229 | $129 | $89 |
| Mentor | **18,990** | $399 | $249 | $169 |

**GRE** (P1)

| Tier | BDT (VAT-incl.) | USD region A | USD region B | USD region C |
|---|---:|---:|---:|---:|
| Free | 0 | 0 | 0 | 0 |
| Core | **5,990** | $149 | $89 | $59 |
| Plus | **8,490** | $199 | $119 | $79 |
| Live | **12,990** | $299 | $179 | $119 |
| Live Crash | **9,990** | $229 | $129 | $89 |
| Mentor | **19,990** | $399 | $249 | $169 |

**PTE Academic** (P2)

| Tier | BDT (VAT-incl.) | USD region A | USD region B | USD region C |
|---|---:|---:|---:|---:|
| Free | 0 | 0 | 0 | 0 |
| Core | **3,990** | $89 | $49 | $34 |
| Plus | **6,490** | $149 | $89 | $59 |
| Live | **13,990** | $299 | $179 | $119 |
| Live Crash | **9,990** | $229 | $129 | $89 |
| Mentor | **19,990** | $399 | $249 | $169 |

**TOEFL iBT** (P3)

| Tier | BDT (VAT-incl.) | USD region A | USD region B | USD region C |
|---|---:|---:|---:|---:|
| Free | 0 | 0 | 0 | 0 |
| Core | **3,990** | $89 | $49 | $34 |
| Plus | **6,490** | $149 | $89 | $59 |
| Live | **13,990** | $299 | $179 | $119 |
| Live Crash | **9,990** | $229 | $129 | $89 |
| Mentor | **19,990** | $399 | $249 | $169 |

**Duolingo English Test** (P2)

| Tier | BDT (VAT-incl.) | USD region A | USD region B | USD region C |
|---|---:|---:|---:|---:|
| Free | 0 | 0 | 0 | 0 |
| Core | **2,490** | $59 | $39 | $24.99 |
| Plus | **5,290** | $119 | $69 | $49 |
| Live | **9,990** | $229 | $129 | $89 |
| Live Crash | **6,990** | $149 | $89 | $59 |
| Mentor | **16,990** | $349 | $229 | $149 |

### 2.2 Perk matrix (template: IELTS Academic; deltas for other exams in 2.2b)

| Perk | Free | Core | Plus | Live (12-wk) | Live Crash (4-wk) | Mentor |
|---|---|---|---|---|---|---|
| Positioning | Try it, trust it | Self-paced, recorded | Self-paced + AI coach | Cohort with teacher | Cohort, 4 weeks | Premium 1:1 |
| Recorded lessons | 2 sample lessons per skill + vocab decks | 100% (~40 h video) | 100% | 100% | 100% | 100% |
| Practice bank | Free sample (~100 items) | Full bank | Full bank | Full bank | Full bank | Full bank |
| Full CBT mocks | Diagnostic + 1 sectional | 4 | 10 (**5 at launch, 10 by 2027-08-15**) | 10 (4 as live-proctored cohort mocks) | 10 | 10 |
| `ai_credit` pool (see 1.8) | 2 at sign-up + 1/month | 10 | 40 (max 6 evals/day) | 40 | 40 | 40 |
| Mock Writing/Speaking AI scoring | in sectional | included in each mock (does not draw credits) | same | same | same | same |
| AI Tutor (grounded in our lessons) | 10 msgs/day | 30 msgs/day | fair use 150/day | 150/day | 150/day | 150/day |
| Smart flashcards + SRS | Core decks | all decks | all | all | all | all |
| Score predictor ("estimated") | - | Yes | Yes | Yes | Yes | Yes |
| Audio lesson overviews (Bangla/English) — **ships P2** (34); included at no extra cost when released, never advertised before | - | - | Yes (P2) | Yes (P2) | Yes (P2) | Yes (P2) |
| Mind maps + auto study guides — **ships P2** (34) | - | - | Yes (P2) | Yes (P2) | Yes (P2) | Yes (P2) |
| Mobile PWA | Yes | Yes | Yes | Yes | Yes | Yes |
| Study plan (D12 C5) | - | Generated, read-only (P1) | + adaptive rescheduling (P2) | batch-calendar synced | batch-calendar synced | mentor-adjusted weekly |
| Human essay reviews (72 h SLA) | 0 | 0 | 2 | 4 | 2 | 6 |
| Human speaking mocks (12 min + 8 min feedback) | 0 | 0 | 0 | 2 | 1 | 3 |
| Live classes | 0 | 0 | Weekly live group Q&A, 60 min, on Zoom from P1 (recorded) | **36 sessions x 90 min** over 12 weeks (L1/L4) or 24 x 150 min weekend (L3) | 16 x 90 min over 4 weeks (L2) | same as Live |
| Speaking club (45 min, <= 6 learners) | - | - | pay-per-slot (add-on) | 6 slots | 3 slots | 6 slots |
| Mentor group chat | official FB group / Discord (P1) | - | - | Moderated batch chat, 12 h reply (09:00-23:00 BST) | same | batch chat + mentor DM |
| 1:1 sessions with a named mentor | - | - | - | - | - | **3 x 45 min** |
| Attendance + homework tracking | - | - | - | Yes | Yes | Yes |
| Certificate (PDF + public `/verify/[code]` page, D12 C4) | - | Yes | Yes | Yes | Yes | Yes |
| Access duration | Unlimited (free content) | 183 days | 183 days | 365 days (recordings: batch end + 30 days, per 18) | 365 days | 365 days |
| Extensions | - | +1 month 490, +3 months 1,190 | same | +3 months 1,490 | same | free 3 months if Progress Promise re-enrol |
| Support first response | Community | 48 h | 24 h | 12 h (batch chat 4 h in class hours) | same | **4 h** (09:00-23:00 BST) |
| Money-back (D12 C13b) | - | **7 days, no questions**, if < 20% consumed and <= 1 full mock | same | Full refund before class 3 starts | before class 2 starts | before class 3 starts or the first 1:1 session |
| Guarantee | - | none | **Target Promise**: free 3-month extension (no cash) if target not met; conditions below | none | none | **Progress Promise**: free re-enrol (no cash); conditions below |
| Free trial | **Free tier + 7-day Plus trial, no card** (phone-OTP verified, 1 per phone/device; 5 AI credits, 30 tutor msgs/day, no full mocks) | | | | | |

**2.2a Guarantee conditions (D12 C13b, binding; no cash score guarantees anywhere).**
- **Target Promise (Plus only):** >= 4 full mocks taken + study-plan completion >= 70% + official test sat within 60 days of access end + official TRF uploaded. Remedy: one free 3-month extension (video + library; credits not refilled). Planning claim rate 20% of buyers x BDT 150 = 30 reserve per Plus **[A17]**.
- **Progress Promise (Mentor only, from P1):** attendance >= 80% of live sessions, all homework submitted, >= 4 full mocks, official test within 60 days of course end, official TRF uploaded; target agreed at enrolment must be <= diagnostic + 1.5 bands. Remedy: **one** free re-enrolment into the next Live batch (no cash), claim within 30 days of the result. Modelled as `guarantee_claim` (05). Planning claim rate 10% x the Live marginal cost **[A18]**.
- Marketing may say "Progress Promise" and "Target Promise" only with a link to these terms; never "guaranteed band".

**2.2b Deltas by exam.**

| Item | IELTS Academic | IELTS GT | GRE | PTE (P2) | DET (P2) | TOEFL (P3) |
|---|---|---|---|---|---|---|
| Core: credits / mocks | 10 / 4 | 10 / 4 | 6 (AWA) / 4 section-adaptive | 10 / 4 | 8 / 4 | 10 / 4 |
| Plus: credits / mocks | 40 / 10 | 40 / 10 | 20 (AWA) / 10 | 34 / 10 | 24 / 10 | 34 / 10 |
| Live batch sessions (regular) | 36 x 90 min | 36 x 90 min | 24 (8 x 3; 52 h, L8) | 36 x 90 min | 12 (6 wk) | 36 x 90 min |
| Crash sessions | 16 | 16 | 12 | 16 | 8 | 16 |
| Speaking items | yes | yes | none: club replaced by 6 small-group **problem-solving clinics** (3 on crash); no human speaking mock | yes | yes | yes |
| Human reviews in Live | 4 essays + 2 speaking | same | 4 AWA | same | same | same |
| Video hours | 40 | 35 | 60 | 35 | 15 | 40 |
| Phase | P1 | P1 | P1 | P2 | P2 | P3 |
| Cohort at launch | Pilot batches run manually on Zoom (D12 C20, 18 §8.3); sell only what ops can staff | | | | | |

### 2.3 Contribution margin per tier (BD) — arithmetic

Inputs (all **[A]** unless 02/D12-sourced): gateway 2.5% of gross (02, verified); VAT 15% inclusive (A18); royalty/lead-instructor 10% of net on the recorded library (D12 C19; 02 used 12%, conservative; Live/Mentor pay royalty on the Plus-equivalent net only because live teachers are paid per session); video BDT 2.4/viewer-hour (02 §8.3); AI credit cost blended **BDT 9** (writing = $0.06 = BDT 7, one Speaking part = half of a $0.20 full test = BDT 12, 60/40 mix, D12 C9 planning values incl. Deepgram STT; stress case BDT 12 per credit); a mock's Writing T1+T2 plus a full Speaking test = BDT 36; **human reviewer all-in** BDT 300 per essay (18: 150-250 piece rate + QA sampling **[A8]**), BDT 450 per speaking mock (18: 300-450); weekly Q&A BDT 1,500 per 60 min / 150 learners x 26 weeks = BDT 250 per learner **[A14]**; AI Tutor BDT 0.25 per message (Haiku-class with prompt caching **[A15]**) at a planning P90 of 400 msgs (Core) / 1,000 msgs (Plus+) over the access period; auto study guides/mind maps/audio overviews are generated once per lesson and cached, BDT 30 per learner **[A16]**; speaking-club host BDT 750 per 45-min slot / 6 learners = BDT 125 per seat-slot; mentor session BDT 1,200 per 45 min; **Live batch fixed cost** (IELTS, 12 weeks): 36 sessions x BDT 2,500 blended lead/junior teacher pay incl. 0.5 h prep credit **[A12]** = 90,000 + one TA/moderator BDT 500/h x 54 h + chat moderation 9,000 = 36,000 -> **BDT 126,000 per batch** **[A13]**; Crash 16 x 2,500 + 15,000 = 55,000.

**Worked example.**

Gross 6,490 / 1.15 = **5,643** net of VAT; gateway 2.5% x 6,490 = 162; royalty 10% x 5,643 = 564.
Variable cost at full use: video 40 h x 2.4 = 96; AI credits 40 x 9 = 360; ten full mocks x 36 = 360; AI tutor 1,000 msgs x 0.25 = 250; Q&A share 250 + study features 30 + Target Promise reserve 30 = 310; two human essay reviews 2 x 300 = 600.
Total cost 1,976. Contribution = 5,643 - 162 - 564 - 1,976 = **2,941 = 45.3% of gross**.

**Live (IELTS Academic) at the 30-seat minimum:** net 12,165; gateway 350; royalty (on Plus-equivalent net) 564; batch fixed cost BDT 126,000 / 30 = 4,200 (36 sessions x BDT 2,500 = 90,000 + TA/moderation 36,000); human 4 essays x 300 + 2 speaking mocks x 450 = 2,100; club 6 x 125 = 750; remaining self-paced costs 1,216. Contribution **2,985 (21.3%)**. At 40 seats the batch cost falls to 3,150 per seat and contribution rises to **4,035**.

**IELTS Academic**

| Tier (seats) | Gross | Net of VAT | Gateway 2.5% | Royalty 10% | Video | AI credits | Mock AI | Q&A / club / tutor / features | Human | Live + 1:1 | Promise reserve | **Contribution** | **%** |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Core | 3,990 | 3,470 | 100 | 347 | 96 | 90 | 144 | 100 | 0 | 0 | 0 | **2,593** | **65.0%** |
| Plus | 6,490 | 5,643 | 162 | 564 | 96 | 360 | 360 | 560 | 600 | 0 | 0 | **2,941** | **45.3%** |
| Live (30 min) | 13,990 | 12,165 | 350 | 564 | 96 | 360 | 360 | 1,150 | 2,100 | 4,200 | 0 | **2,985** | **21.3%** |
| Live (40 target) | 13,990 | 12,165 | 350 | 564 | 96 | 360 | 360 | 1,150 | 2,100 | 3,150 | 0 | **4,035** | **28.8%** |
| Live Crash (15 min) | 9,990 | 8,687 | 250 | 564 | 96 | 360 | 360 | 715 | 1,050 | 3,667 | 0 | **1,625** | **16.3%** |
| Live Crash (25 target) | 9,990 | 8,687 | 250 | 564 | 96 | 360 | 360 | 715 | 1,050 | 2,200 | 0 | **3,092** | **30.9%** |
| Mentor (30 min) | 19,990 | 17,383 | 500 | 564 | 96 | 360 | 360 | 1,150 | 3,150 | 7,800 | 827 | **2,576** | **12.9%** |
| Mentor (40 target) | 19,990 | 17,383 | 500 | 564 | 96 | 360 | 360 | 1,150 | 3,150 | 6,750 | 722 | **3,731** | **18.7%** |

**IELTS General Training**

| Tier (seats) | Gross | Net of VAT | Gateway 2.5% | Royalty 10% | Video | AI credits | Mock AI | Q&A / club / tutor / features | Human | Live + 1:1 | Promise reserve | **Contribution** | **%** |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Core | 3,490 | 3,035 | 87 | 303 | 84 | 90 | 144 | 100 | 0 | 0 | 0 | **2,226** | **63.8%** |
| Plus | 6,490 | 5,643 | 162 | 564 | 84 | 360 | 360 | 560 | 600 | 0 | 0 | **2,953** | **45.5%** |
| Live (30 min) | 12,990 | 11,296 | 325 | 564 | 84 | 360 | 360 | 1,150 | 2,100 | 4,200 | 0 | **2,153** | **16.6%** |
| Live (40 target) | 12,990 | 11,296 | 325 | 564 | 84 | 360 | 360 | 1,150 | 2,100 | 3,150 | 0 | **3,203** | **24.7%** |
| Live Crash (15 min) | 9,490 | 8,252 | 237 | 564 | 84 | 360 | 360 | 715 | 1,050 | 3,667 | 0 | **1,215** | **12.8%** |
| Live Crash (25 target) | 9,490 | 8,252 | 237 | 564 | 84 | 360 | 360 | 715 | 1,050 | 2,200 | 0 | **2,682** | **28.3%** |
| Mentor (30 min) | 18,990 | 16,513 | 475 | 564 | 84 | 360 | 360 | 1,150 | 3,150 | 7,800 | 825 | **1,745** | **9.2%** |
| Mentor (40 target) | 18,990 | 16,513 | 475 | 564 | 84 | 360 | 360 | 1,150 | 3,150 | 6,750 | 720 | **2,900** | **15.3%** |

**GRE**

| Tier (seats) | Gross | Net of VAT | Gateway 2.5% | Royalty 10% | Video | AI credits | Mock AI | Q&A / club / tutor / features | Human | Live + 1:1 | Promise reserve | **Contribution** | **%** |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Core | 5,990 | 5,209 | 150 | 521 | 144 | 42 | 28 | 100 | 0 | 0 | 0 | **4,224** | **70.5%** |
| Plus | 8,490 | 7,383 | 212 | 738 | 144 | 140 | 70 | 560 | 600 | 0 | 0 | **4,918** | **57.9%** |
| Live (30 min) | 12,990 | 11,296 | 325 | 738 | 144 | 140 | 70 | 1,150 | 1,200 | 3,067 | 0 | **4,462** | **34.3%** |
| Live (40 target) | 12,990 | 11,296 | 325 | 738 | 144 | 140 | 70 | 1,150 | 1,200 | 2,300 | 0 | **5,229** | **40.3%** |
| Live Crash (15 min) | 9,990 | 8,687 | 250 | 738 | 144 | 140 | 70 | 715 | 600 | 2,667 | 0 | **3,363** | **33.7%** |
| Live Crash (25 target) | 9,990 | 8,687 | 250 | 738 | 144 | 140 | 70 | 715 | 600 | 1,600 | 0 | **4,430** | **44.3%** |
| Mentor (30 min) | 19,990 | 17,383 | 500 | 738 | 144 | 140 | 70 | 1,150 | 1,800 | 6,667 | 577 | **5,597** | **28.0%** |
| Mentor (40 target) | 19,990 | 17,383 | 500 | 738 | 144 | 140 | 70 | 1,150 | 1,800 | 5,900 | 500 | **6,440** | **32.2%** |

**PTE Academic**

| Tier (seats) | Gross | Net of VAT | Gateway 2.5% | Royalty 10% | Video | AI credits | Mock AI | Q&A / club / tutor / features | Human | Live + 1:1 | Promise reserve | **Contribution** | **%** |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Core | 3,990 | 3,470 | 100 | 347 | 84 | 90 | 168 | 100 | 0 | 0 | 0 | **2,581** | **64.7%** |
| Plus | 6,490 | 5,643 | 162 | 564 | 84 | 306 | 420 | 560 | 600 | 0 | 0 | **2,947** | **45.4%** |
| Live (30 min) | 13,990 | 12,165 | 350 | 564 | 84 | 306 | 420 | 1,150 | 2,100 | 4,200 | 0 | **2,991** | **21.4%** |
| Live (40 target) | 13,990 | 12,165 | 350 | 564 | 84 | 306 | 420 | 1,150 | 2,100 | 3,150 | 0 | **4,041** | **28.9%** |
| Live Crash (15 min) | 9,990 | 8,687 | 250 | 564 | 84 | 306 | 420 | 715 | 1,050 | 3,667 | 0 | **1,631** | **16.3%** |
| Live Crash (25 target) | 9,990 | 8,687 | 250 | 564 | 84 | 306 | 420 | 715 | 1,050 | 2,200 | 0 | **3,098** | **31.0%** |
| Mentor (30 min) | 19,990 | 17,383 | 500 | 564 | 84 | 306 | 420 | 1,150 | 3,150 | 7,800 | 826 | **2,583** | **12.9%** |
| Mentor (40 target) | 19,990 | 17,383 | 500 | 564 | 84 | 306 | 420 | 1,150 | 3,150 | 6,750 | 721 | **3,738** | **18.7%** |

**TOEFL iBT**

| Tier (seats) | Gross | Net of VAT | Gateway 2.5% | Royalty 10% | Video | AI credits | Mock AI | Q&A / club / tutor / features | Human | Live + 1:1 | Promise reserve | **Contribution** | **%** |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Core | 3,990 | 3,470 | 100 | 347 | 96 | 90 | 160 | 100 | 0 | 0 | 0 | **2,577** | **64.6%** |
| Plus | 6,490 | 5,643 | 162 | 564 | 96 | 306 | 400 | 560 | 600 | 0 | 0 | **2,955** | **45.5%** |
| Live (30 min) | 13,990 | 12,165 | 350 | 564 | 96 | 306 | 400 | 1,150 | 2,100 | 4,200 | 0 | **2,999** | **21.4%** |
| Live (40 target) | 13,990 | 12,165 | 350 | 564 | 96 | 306 | 400 | 1,150 | 2,100 | 3,150 | 0 | **4,049** | **28.9%** |
| Live Crash (15 min) | 9,990 | 8,687 | 250 | 564 | 96 | 306 | 400 | 715 | 1,050 | 3,667 | 0 | **1,639** | **16.4%** |
| Live Crash (25 target) | 9,990 | 8,687 | 250 | 564 | 96 | 306 | 400 | 715 | 1,050 | 2,200 | 0 | **3,106** | **31.1%** |
| Mentor (30 min) | 19,990 | 17,383 | 500 | 564 | 96 | 306 | 400 | 1,150 | 3,150 | 7,800 | 825 | **2,591** | **13.0%** |
| Mentor (40 target) | 19,990 | 17,383 | 500 | 564 | 96 | 306 | 400 | 1,150 | 3,150 | 6,750 | 720 | **3,746** | **18.7%** |

**Duolingo English Test**

| Tier (seats) | Gross | Net of VAT | Gateway 2.5% | Royalty 10% | Video | AI credits | Mock AI | Q&A / club / tutor / features | Human | Live + 1:1 | Promise reserve | **Contribution** | **%** |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Core | 2,490 | 2,165 | 62 | 217 | 36 | 72 | 80 | 100 | 0 | 0 | 0 | **1,598** | **64.2%** |
| Plus | 5,290 | 4,600 | 132 | 460 | 36 | 216 | 200 | 560 | 600 | 0 | 0 | **2,396** | **45.3%** |
| Live (30 min) | 9,990 | 8,687 | 250 | 460 | 36 | 216 | 200 | 1,150 | 2,100 | 1,400 | 0 | **2,875** | **28.8%** |
| Live (40 target) | 9,990 | 8,687 | 250 | 460 | 36 | 216 | 200 | 1,150 | 2,100 | 1,050 | 0 | **3,225** | **32.3%** |
| Live Crash (15 min) | 6,990 | 6,078 | 175 | 460 | 36 | 216 | 200 | 715 | 1,050 | 1,867 | 0 | **1,360** | **19.5%** |
| Live Crash (25 target) | 6,990 | 6,078 | 175 | 460 | 36 | 216 | 200 | 715 | 1,050 | 1,120 | 0 | **2,107** | **30.1%** |
| Mentor (30 min) | 16,990 | 14,774 | 425 | 460 | 36 | 216 | 200 | 1,150 | 3,150 | 5,000 | 510 | **3,627** | **21.3%** |
| Mentor (40 target) | 16,990 | 14,774 | 425 | 460 | 36 | 216 | 200 | 1,150 | 3,150 | 4,650 | 475 | **4,012** | **23.6%** |

Reading the tables: **Core clears 64-71% and Plus 45.3-45.5% (GRE Plus 58%) at 100% allowance use** (typical learners use 40-60% of AI allowances, so realised margins are higher). Plus is deliberately priced at the 45% line: if every one of its 40 credits were a Speaking part (stress case BDT 12 per credit) IELTS-family Plus falls to 43.5-44.0%, so the first-90-day review watches the writing/speaking mix of credit use (trigger: > 50% speaking -> trim the Plus pool to 36). Live and Mentor are deliberately thin per head but large in absolute BDT (a Live seat at 40 seats contributes ~BDT 4,000, 1.5x a Core sale); break-even seats: Live 18 (GT 20, GRE 13, DET 10), Crash 11-12, Mentor 20-22 (GRE 12); they are only run at >= 30 seats (Crash >= 15). PTE/TOEFL/DET rows are provisional.

**International (USD) contribution** — MoR fee 5% + $0.50 **[A4, unverified]**, royalty 10% of net-of-fee, same BDT-denominated delivery costs / 120, minimum batch sizes. Cell = price: contribution (margin on price).

| Exam / tier | Region A: price, margin | Region B: price, margin | Region C: price, margin |
|---|---|---|---|
| IELTS Academic Core | $89: $72.1 (81%) | $49: $37.9 (77%) | $34: $25.0 (74%) |
| IELTS Academic Plus | $149: $110.5 (74%) | $89: $59.2 (66%) | $59: $33.5 (57%) |
| IELTS Academic Live | $299: $200.6 (67%) | $179: $92.3 (52%) | $119: $38.1 (32%) |
| IELTS Academic Live Crash | $229: $150.9 (66%) | $129: $61.6 (48%) | $89: $26.4 (30%) |
| IELTS Academic Mentor | $399: $249.9 (63%) | $249: $113.1 (45%) | $169: $40.0 (24%) |
| IELTS General Training Core | $79: $63.6 (81%) | $49: $38.0 (77%) | $29.99: $21.7 (72%) |
| IELTS General Training Plus | $149: $110.6 (74%) | $89: $59.3 (67%) | $59: $33.6 (57%) |
| IELTS General Training Live | $299: $200.7 (67%) | $179: $92.4 (52%) | $119: $38.2 (32%) |
| IELTS General Training Live Crash | $229: $151.0 (66%) | $129: $61.7 (48%) | $89: $26.5 (30%) |
| IELTS General Training Mentor | $399: $250.0 (63%) | $249: $113.2 (45%) | $169: $40.1 (24%) |
| GRE Core | $149: $124.3 (83%) | $89: $73.0 (82%) | $59: $47.4 (80%) |
| GRE Plus | $199: $157.1 (79%) | $119: $88.7 (75%) | $79: $54.5 (69%) |
| GRE Live | $299: $216.6 (72%) | $179: $110.2 (62%) | $119: $57.0 (48%) |
| GRE Live Crash | $229: $162.1 (71%) | $129: $74.7 (58%) | $89: $40.5 (45%) |
| GRE Mentor | $399: $271.8 (68%) | $249: $136.9 (55%) | $169: $64.7 (38%) |
| PTE Academic Core | $89: $72.0 (81%) | $49: $37.8 (77%) | $34: $24.9 (73%) |
| PTE Academic Plus | $149: $110.5 (74%) | $89: $59.2 (67%) | $59: $33.6 (57%) |
| PTE Academic Live | $299: $200.6 (67%) | $179: $92.3 (52%) | $119: $38.2 (32%) |
| PTE Academic Live Crash | $229: $150.9 (66%) | $129: $61.6 (48%) | $89: $26.5 (30%) |
| PTE Academic Mentor | $399: $250.0 (63%) | $249: $113.2 (45%) | $169: $40.0 (24%) |
| TOEFL iBT Core | $89: $71.9 (81%) | $49: $37.7 (77%) | $34: $24.9 (73%) |
| TOEFL iBT Plus | $149: $110.6 (74%) | $89: $59.3 (67%) | $59: $33.6 (57%) |
| TOEFL iBT Live | $299: $200.7 (67%) | $179: $92.4 (52%) | $119: $38.2 (32%) |
| TOEFL iBT Live Crash | $229: $151.0 (66%) | $129: $61.7 (48%) | $89: $26.5 (30%) |
| TOEFL iBT Mentor | $399: $250.1 (63%) | $249: $113.3 (45%) | $169: $40.1 (24%) |
| Duolingo English Test Core | $59: $47.6 (81%) | $39: $30.5 (78%) | $24.99: $18.5 (74%) |
| Duolingo English Test Plus | $119: $87.9 (74%) | $69: $45.1 (65%) | $49: $28.0 (57%) |
| Duolingo English Test Live | $229: $163.3 (71%) | $129: $73.0 (57%) | $89: $36.9 (41%) |
| Duolingo English Test Live Crash | $149: $95.8 (64%) | $89: $43.5 (49%) | $59: $16.9 (29%) |
| Duolingo English Test Mentor | $349: $234.3 (67%) | $229: $125.0 (55%) | $149: $50.9 (34%) |

Region C Live/Mentor are the thin cells (Mentor C: 24%); that is intentional (D12 C25) and still positive at the 30-seat minimum.

**Free tier cost.** 2 credits at sign-up + 1/month + 10 tutor msgs/day cap + 3 sample hours of video: ~BDT 40 at sign-up and ~BDT 25/month while active (inside A19's BDT 10 per registered user only because most sign-ups are inactive; watch it in the first 90 days). **7-day Plus trial** costs <= BDT 100 worst case (5 credits 45 + 30 msgs x 7 x 0.25 = 52); count it as acquisition cost.

---

## 3. Standalone courses

Contribution = net of VAT - gateway - 10% royalty (5% on mock products, 0% on live batches whose teachers are paid per session) - variable cost; cost at full allowance use, live batches at the **target** seat count. All self-paced rows carry the 7-day money-back (D12 C13b). USD from the regional rule.


### 3.1 IELTS skill courses, crash, batch, mocks, Life Skills

| Product | BDT | A | B | C | Cost (BDT) | Contribution | % | Phase | Contents / note |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| IELTS Writing Mastery (`ielts-writing-mastery`) | **1,990** | $49 | $24.99 | $17.99 | 118 | 1,390 | 70% | P1 | 14 h video, 300+ prompts, 12 credits (writing evals) |
| IELTS Speaking Mastery (`ielts-speaking-mastery`) | **1,990** | $49 | $24.99 | $17.99 | 168 | 1,340 | 67% | P1 | 10 h video, cue-card bank, 12 credits (= 6 full speaking tests) |
| IELTS Listening & Reading Accelerator (`ielts-lr-accelerator`) | **1,490** | $34 | $19.99 | $12.99 | 29 | 1,100 | 74% | P1 | 12 h video, 20 auto-scored L/R sets |
| Writing + Speaking Mastery bundle (`ielts-writing-speaking-bundle`) | **2,990** | $59 | $39 | $24.99 | 286 | 1,980 | 66% | P1 | both courses, 24 credits total (saves 25% vs 3,980) |
| IELTS Crash Course (4-week live) (`ielts-crash-4w`) | **7,490** | $169 | $99 | $69 | 2,588 | 3,738 | 50% | P1 pilot / P2 | 16 sessions x 90 min (per 18 L2), 4 full mocks, 10 credits, min 15 seats (cap 25) |
| IELTS Mock Test Series (20 full mocks) (`ielts-mock-series`) | **2,990** | $59 | $39 | $24.99 | 720 | 1,675 | 56% | P1 | on sale from ~day 120 (10 live), all 20 by ~day 270; W/S scoring included; cohort percentile |
| IELTS Life Skills A1 (`ielts-life-skills-a1`) | **990** | $24.99 | $12.99 | $8.99 | 110 | 640 | 65% | P2 | 6 h video, 4 speaking-listening mocks (AI) |
| IELTS Life Skills B1 (`ielts-life-skills-b1`) | **1,490** | $34 | $19.99 | $12.99 | 163 | 966 | 65% | P2 | 8 h video, 6 speaking-listening mocks (AI) |
| IELTS Live Batch (12 weeks; regular, weekend or evening) (`ielts-live-batch-12w`) | **9,990** | $229 | $129 | $89 | 3,707 | 4,730 | 47% | P2 (pilot P1) | 36 sessions (per 18 L1; weekend 24 x 150 min), recordings batch+30d, 4 mocks, 10 credits, batch chat, min 30 seats (target 40) |

### 3.2 English Foundation (Bangla-medium, A0 -> B1; international counterpart is the English-medium edition)

| Product | BDT | A | B | C | Cost (BDT) | Contribution | % | Phase | Contents / note |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| English Foundation A0 (Bangla-medium) (`eng-found-a0`) | **299** | $7.99 | $4.99 | $2.99 | 74 | 152 | 51% | P1 | alphabet-to-sentences, 40 lessons, AI repeat-after-me drills |
| English Foundation A1 (`eng-found-a1`) | **499** | $11.99 | $7.99 | $4.99 | 109 | 269 | 54% | P1 | 48 lessons |
| English Foundation A2 (`eng-found-a2`) | **699** | $14.99 | $8.99 | $5.99 | 139 | 390 | 56% | P1 | 48 lessons + workplace phrases |
| English Foundation B1 (`eng-found-b1`) | **999** | $24.99 | $12.99 | $8.99 | 204 | 553 | 55% | P1 | 56 lessons + IELTS-readiness check |
| English Foundation full track A0-B1 (`eng-found-track`) | **1,990** | $49 | $24.99 | $17.99 | 527 | 981 | 49% | P1 | all four levels (separately 2,496; saves 20%) |

### 3.3 Spoken English

| Product | BDT | A | B | C | Cost (BDT) | Contribution | % | Phase | Contents / note |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Spoken English: Everyday (`spoken-english-everyday`) | **1,490** | $34 | $19.99 | $12.99 | 169 | 960 | 64% | P2 | 24 lessons, 20 AI conversation sessions (credits) |
| Spoken English: Workplace (`spoken-english-workplace`) | **2,490** | $59 | $39 | $24.99 | 248 | 1,638 | 66% | P2 | meetings, email, interviews; 30 AI role-plays |

### 3.4 GRE

| Product | BDT | A | B | C | Cost (BDT) | Contribution | % | Phase | Contents / note |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| GRE Verbal Booster (`gre-verbal-booster`) | **2,490** | $59 | $39 | $24.99 | 88 | 1,798 | 72% | P1 | 25 h video, 1,200 items |
| GRE Quant Booster (`gre-quant-booster`) | **2,490** | $59 | $39 | $24.99 | 72 | 1,814 | 73% | P1 | 30 h video, 1,500 items |
| GRE AWA Coaching (`gre-awa-coaching`) | **1,490** | $34 | $19.99 | $12.99 | 103 | 1,026 | 69% | P1 | 8 h video, 12 AWA evaluations (12 credits) |
| GRE Vocab Pro (`gre-vocab`) | **790** | $17.99 | $9.99 | $6.99 | 5 | 594 | 75% | P1 | 3,500 words, mnemonics, spaced repetition, offline PDF; free decks stay free |
| GRE Mock Test Series (8 section-adaptive) (`gre-mock-series`) | **1,990** | $49 | $24.99 | $17.99 | 56 | 1,538 | 77% | P1 | on sale at launch with 5, all 8 by ~day 120 |
| GRE Live Batch (8 weeks) (`gre-live-batch-8w`) | **8,990** | $199 | $119 | $79 | 2,644 | 4,949 | 55% | P2 | 24 sessions (per 18 L8), 4 mocks, min 30 seats (target 40) |

### 3.5 Later exams (PTE P2, DET P2, TOEFL P3)

| Product | BDT | A | B | C | Cost (BDT) | Contribution | % | Phase | Contents / note |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| PTE Speaking & Writing AI Coaching (`pte-sw-coaching`) | **1,990** | $49 | $24.99 | $17.99 | 132 | 1,376 | 69% | P2 | 12 credits |
| PTE Mock Series (10) (`pte-mock-series`) | **2,490** | $59 | $39 | $24.99 | 420 | 1,575 | 63% | P2 | 10 full mocks |
| DET Sprint (2-week) (`det-sprint`) | **1,490** | $34 | $19.99 | $12.99 | 162 | 967 | 65% | P2 | 10 adaptive practice tests |
| TOEFL Speaking & Writing AI Coaching (`toefl-sw-coaching`) | **1,990** | $49 | $24.99 | $17.99 | 132 | 1,376 | 69% | P3 | 12 credits |
| TOEFL Mock Series (10) (`toefl-mock-series`) | **2,490** | $59 | $39 | $24.99 | 400 | 1,595 | 64% | P3 | 10 full mocks |

### 3.6 Work-abroad language tracks (D11): EPS-TOPIK Korean, JFT-Basic Japanese (Bangla-medium)

| Product | BDT | A | B | C | Cost (BDT) | Contribution | % | Phase | Contents / note |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| EPS-TOPIK Starter (Hangul + survival Korean, Bangla-medium) (`eps-topik-starter`) | **990** | $24.99 | $12.99 | $8.99 | 54 | 696 | 70% | P2 | 10 h video |
| EPS-TOPIK Exam Prep (`eps-topik-prep`) | **1,990** | $49 | $24.99 | $17.99 | 78 | 1,430 | 72% | P2 | 20 h video, 8 CBT-style mocks (auto-scored) |
| EPS-TOPIK Complete (`eps-topik-complete`) | **2,490** | $59 | $39 | $24.99 | 132 | 1,754 | 70% | P2 | Starter + Prep (separately 2,980) |
| JFT-Basic Starter (kana + A1 Japanese) (`jft-basic-starter`) | **990** | $24.99 | $12.99 | $8.99 | 54 | 696 | 70% | P2 | 10 h video |
| JFT-Basic Exam Prep (`jft-basic-prep`) | **1,990** | $49 | $24.99 | $17.99 | 78 | 1,430 | 72% | P2 | 20 h video, 8 CBT-style mocks |
| JFT-Basic Complete (`jft-basic-complete`) | **2,490** | $59 | $39 | $24.99 | 132 | 1,754 | 70% | P2 | Starter + Prep (separately 2,980) |

### 3.7 Tech tracks and university packs (P3; unchanged from 02)

| Product | BDT | A | B | C | Cost (BDT) | Contribution | % | Phase | Contents / note |
|---|---:|---:|---:|---:|---:|---:|---:|---|---|
| Python / SQL track (`tech-python-sql`) | **2,490** | $59 | $39 | $24.99 | 132 | 1,754 | 70% | P3 | code notebooks (compute $0.02/h assumed) |
| Networking track (`tech-networking`) | **2,990** | $59 | $39 | $24.99 | 146 | 2,119 | 71% | P3 | code notebooks (compute $0.02/h assumed) |
| GenAI track (`tech-genai`) | **3,490** | $79 | $49 | $29.99 | 176 | 2,468 | 71% | P3 | code notebooks (compute $0.02/h assumed) |
| Machine Learning track (`tech-ml`) | **3,990** | $89 | $49 | $34 | 220 | 2,803 | 70% | P3 | code notebooks (compute $0.02/h assumed) |
| Deep Learning track (`tech-dl`) | **4,490** | $99 | $59 | $39 | 232 | 3,170 | 71% | P3 | code notebooks (compute $0.02/h assumed) |
| Tech Pass 12 months (`tech-pass-12m`) | **5,990** | $149 | $89 | $59 | 1,008 | 3,530 | 59% | P3 | all tech tracks |
| University course pack (per course; BD CSE syllabus) (`univ-course-pack`) | **990** | $24.99 | $12.99 | $8.99 | 29 | 721 | 73% | P3 | BD only |
| University semester pack (`univ-semester-pack`) | **2,490** | $59 | $39 | $24.99 | 72 | 1,814 | 73% | P3 | BD only |

Notes. (a) **IELTS Life Skills** is a speaking/listening test sold in Bangladesh at BDT 24,750 (IDP); whether the UK still accepts it for family routes after the 2026 changes is **unverified** (research gap) — keep the product P2 and re-verify before launch. (b) **Work-abroad tracks** are priced from BDT 990-2,490 because the segment is low-income (BMET: language test mandatory for Korea, Japan, Hong Kong); prices are hypotheses to test with 20 learner interviews; EPS-TOPIK/JFT-Basic mock content, official test fees and Bangladesh-Korea intake status are unverified. 50%-off partner codes apply (TTCs, BMET) — see §8. (c) **English Foundation** levels: 12-month access, first 3 lessons of every level free; full track 1,990 vs 2,496 bought level by level (a real saving). (d) **Mock Series (20)** goes on sale when 10 mocks are live (~day 120) and releases the rest by ~day 270; **Mock packs and series are capped to unreleased/unattempted mocks per exam (D12: >= 5 at launch, 10 by ~day 120)**; (e) Writing+Speaking Mastery bundle saves 25% vs the two courses (3,980). (f) Live batches: weekend (L3), evening (L4) and the optional women-only batch (L5) share the Regular price; see §7. (g) `univ-*` packs are BD-only (BD CSE syllabus).

---

## 4. Add-ons (any tier)

Add-on cost lines: AI credits at the stress BDT 12/credit; human pass-through at §2.3 rates. Human-delivered packs carry a stated floor (>= 24%, 1:1 packs) because they are upsells, not growth products.

| Add-on (`slug`) | BDT | A | B | C | Cost | Contribution | % | Note |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| AI credits x10 (`ai-credits-10`) | **590** | $11.99 | $7.99 | $4.99 | 120 | 378 | 64% | cost at stress 12/credit (all-speaking); writing-only 7 |
| AI credits x30 (`ai-credits-30`) | **1,490** | $34 | $19.99 | $12.99 | 360 | 898 | 60% |  |
| AI credits x75 (`ai-credits-75`) | **2,990** | $59 | $39 | $24.99 | 900 | 1,625 | 54% |  |
| Mock pack x3 (`mock-pack-3`) | **690** | $14.99 | $8.99 | $5.99 | 108 | 445 | 64% | W/S AI scoring inside |
| Mock pack x5 (`mock-pack-5`) | **990** | $24.99 | $12.99 | $8.99 | 180 | 613 | 62% |  |
| Mock pack x10 (sold once 10 mocks are live, ~day 120) (`mock-pack-10`) | **1,690** | $39 | $24.99 | $14.99 | 360 | 994 | 59% |  |
| Human essay review x1 (`human-essay-review-1`) | **790** | $17.99 | $9.99 | $6.99 | 300 | 367 | 46% | 72 h SLA; 300 = grader pay incl. QA sampling |
| Human essay review x5 (`human-essay-review-5`) | **3,490** | $79 | $49 | $29.99 | 1,500 | 1,448 | 41% | 698 each |
| Human essay review x10 (`human-essay-review-10`) | **6,490** | $149 | $89 | $59 | 3,000 | 2,481 | 38% | 649 each |
| Human speaking mock x1 (examiner-style, 12 min + 8 min feedback) (`human-speaking-mock-1`) | **1,290** | $29.99 | $17.99 | $11.99 | 450 | 639 | 50% |  |
| Human speaking mock x3 (`human-speaking-mock-3`) | **3,490** | $79 | $49 | $29.99 | 1,350 | 1,598 | 46% |  |
| 1:1 mentor session x1 (45 min) (`one-to-one-1`) | **2,490** | $59 | $39 | $24.99 | 1,200 | 903 | 36% | pass-through service |
| 1:1 mentor sessions x3 (`one-to-one-3`) | **6,490** | $149 | $89 | $59 | 3,600 | 1,881 | 29% |  |
| 1:1 mentor sessions x5 (`one-to-one-5`) | **9,990** | $229 | $129 | $89 | 6,000 | 2,437 | 24% |  |
| Speaking Club slot x1 (45 min, max 6) (`speaking-club-1`) | **390** | $9.99 | $5.99 | $3.99 | 167 | 162 | 42% | host 750 / 6 learners at 75% fill |
| Speaking Club slots x4 (`speaking-club-4`) | **1,290** | $29.99 | $17.99 | $11.99 | 668 | 421 | 33% |  |
| Course extension +1 month (Core/Plus) (`extension-1m`) | **490** | $11.99 | $7.99 | $4.99 | 30 | 384 | 78% | no new allowances; remaining credits stay |
| Course extension +3 months (Core/Plus) (`extension-3m`) | **1,190** | $24.99 | $14.99 | $9.99 | 75 | 930 | 78% |  |
| Extension +3 months (Live/Mentor) (`extension-live-3m`) | **1,490** | $34 | $19.99 | $12.99 | 75 | 1,183 | 79% | recordings + library only |
| Certificate digital re-issue (name change) (`certificate-digital-reissue`) | **99** | $2.99 | $1.99 | $0.99 | 5 | 79 | 79% | first PDF certificate is free (D12 C4) |
| Certificate printed (A4 matte, folder), BD only (`certificate-print`) | **349** | $7.99 | $4.99 | $2.99 | 195 | 100 | 29% | print 90 + courier 80 + handling 25 (A) |
| Priority grading x1 (24 h instead of 72 h) (`priority-grading-1`) | **250** | $7.99 | $4.99 | $2.99 | 100 | 111 | 44% | extra grader premium |
| Priority grading x5 (`priority-grading-5`) | **990** | $24.99 | $12.99 | $8.99 | 500 | 336 | 34% |  |

Rules. AI credit packs expire 12 months after purchase; unused credits refundable within 7 days, **consumed credits never** (D5). Human review packs: 12-month validity; if the SLA (72 h; 24 h with priority) is missed the credit is refunded automatically. Mock packs: validity 12 months; sizes limited to mocks that exist for that exam. Certificate: the first PDF is free; the printed copy is BD-only. Priority grading applies only to human reviews (AI is instant). **Plus members** buy human reviews at the pack price (no member discount; the discount is already in Plus).

---

## 5. Passes (all-access, 1 / 3 / 6 / 12 months)

**Prices BDT 1,190 / 2,990 / 4,490 / 6,990 are kept exactly as 02 §7.2.** USD moves to the D12 C25 rule (C >= BD price in USD, B ~1.5x C, A ~2.5x C): 02 had A $19.99 / $49 / $129; the rule gives the table below. The reason to change them: 02's $19.99/$49/$129 sat below the BD-equivalent for some regions and had no B/C tiers; the binding rule keeps BD as the floor, removes cross-region arbitrage, and orders A > B > C > BD-equivalent.

**Included:** all courses' recorded lessons and practice banks for IELTS Academic, IELTS GT and GRE (PTE/DET/TOEFL when launched), smart flashcards + SRS, score predictor, AI Tutor (30 msgs/day), PWA. **Per 30 days, no rollover: 2 full mocks + 10 `ai_credit` (6 writing evals + 2 full speaking tests)**, daily AI ceiling 4. **Excluded:** live classes and batches, human reviews, 1:1, certificates, personalised plan, weekly Q&A, books. Fair-use: 2 concurrent devices, 1 account per person (anomaly review above 3 devices), allowances reset on the purchase anniversary day, no resale. Money-back: 7 days if < 20% consumed and <= 1 full mock (the 1-month pass: 72 h). BD passes are prepaid with reminders at T-7/T-1; international passes auto-renew (Paddle/Stripe, D5) with the renewal price shown at checkout and a one-click cancel.

| Pass | BDT | A | B | C | Cost at 100% use (BDT) | Contribution | % at 100% use | % at 60% AI use |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 1 month | **1,190** | $24.99 | $14.99 | $9.99 | 222 | 680 | 57.1% | 62.6% |
| 3 month | **2,990** | $59 | $39 | $24.99 | 630 | 1,635 | 54.7% | 61.2% |
| 6 month | **4,490** | $99 | $59 | $39 | 1,212 | 2,190 | 48.8% | 57.4% |
| 12 month | **6,990** | $149 | $89 | $59 | 2,232 | 3,064 | 43.8% | 55.0% |

Contribution here includes video capped at the library actually watched (60/144/240/288 BDT), AI at the full 100% allowance, and mock scoring inside each mock. **The 12-month pass dips below 45% only at 100% allowance use** (43.8%); at the 60% utilisation observed for comparable AI-practice subscriptions **[A19, assumption]** it is 55%. Decision rule for the first-90-day review: if the 12-month pass's measured AI utilisation exceeds 75%, taper months 7-12 to 5 credits + 1 mock, or move the price to BDT 7,490. Packaging check: 3-month pass / Core = **74.9%** (>= ~75% rule).

---

## 6. Printed books and physical products

Print-cost assumptions **[A20, unverified; get 3 written quotes from Nilkhet/Fakirapool or Banglabazar presses before ordering]**: **offset** run 2,000 copies, B/W 70-80 gsm interior **BDT 0.60/page**, 250 gsm gloss cover with lamination BDT 12, perfect binding BDT 12, QC + poly-pack BDT 8; **digital** run 300 copies BDT 1.60/page, cover BDT 30, binding BDT 20, pack BDT 8. Add BDT 20 per copy for editing/typesetting amortisation and 10% lead-author royalty on net. VAT on printed books may be exempt in Bangladesh (unverified, **A21**): base case assumes 15% inclusive (conservative). Offset needs a 2,000-copy upfront outlay of ~BDT 0.4-0.5M per title; start with digital 300 and move to offset on the second print run.

**Delivery and COD.** Steadfast Courier charges a **1% cash-handling and risk charge on COD parcels, calculated after delivery charges; delivery charges are deducted from the COD amount; returns are not charged** *(Steadfast T&C; tiers_live_books.md §4)*. Base delivery rates are **not** in the research: planning **BDT 60 inside Dhaka, BDT 115 outside Dhaka for <= 1 kg [A22, verify at steadfast.com.bd/pricing]**. We charge the buyer a flat **BDT 70 inside Dhaka / BDT 130 outside** (the difference funds the 1% COD charge and failed-delivery returns); **free delivery on any order that includes a course or an order >= BDT 1,500**. SSLCommerz prepayment saves the COD charge and is nudged at checkout. Digital Commerce Guidelines 2021: delivery within 5 days (same city) / 10 days (other cities), price, delivery charge and return conditions displayed *(bd_segments_marketing.md §5)*.

**Channel.** Direct web store (our margin). **Rokomari/marketplaces** for discovery: commission assumed **40% of MRP [A23, unverified]**; Rokomari's customer-facing "15% off" is funded from its side. At 7-19% contribution the marketplace is a reach channel only; no title is sold below MRP on our own store.

| Book (`slug`) | Pages | Offset unit cost (2,000 run) | Digital unit cost (300 run) | MRP (BDT, VAT-incl.) | Contribution direct web (offset) | Contribution via Rokomari (40% commission) | PDF BDT / A / B / C |
|---|---:|---:|---:|---:|---:|---:|---|
| IELTS Academic Workbook (`ielts-academic-workbook`) | 320 | 224 | 570 | **790** | 355 (45%) | 127 (16%) | 390 / $9.99 / $5.99 / $3.99 |
| IELTS General Training Workbook (`ielts-gt-workbook`) | 280 | 200 | 506 | **690** | 303 (44%) | 104 (15%) | 349 / $7.99 / $4.99 / $2.99 |
| IELTS Writing Model Answers (Task 1 + 2) (`ielts-writing-model-answers`) | 200 | 152 | 378 | **490** | 199 (41%) | 58 (12%) | 249 / $7.99 / $4.99 / $2.99 |
| IELTS Speaking Cue-Card Book (QR audio) (`ielts-speaking-cue-cards`) | 160 | 128 | 314 | **390** | 147 (38%) | 35 (9%) | 199 / $4.99 / $2.99 / $1.99 |
| IELTS Vocabulary by Topic (`ielts-vocabulary`) | 240 | 176 | 442 | **490** | 175 (36%) | 34 (7%) | 249 / $7.99 / $4.99 / $2.99 |
| GRE Vocab and Quant Formula Book (`gre-vocab-quant-formula`) | 280 | 200 | 506 | **790** | 379 (48%) | 151 (19%) | 390 / $9.99 / $5.99 / $3.99 |
| IELTS Mock Test Booklets (4 L/R/W papers) (`ielts-mock-booklets`) | 240 | 176 | 442 | **590** | 251 (43%) | 81 (14%) | 299 / $7.99 / $4.99 / $2.99 |
| English Foundation Workbook A1-A2 (Bangla) (`eng-foundation-workbook-a1-a2`) | 160 | 128 | 314 | **290** | 72 (25%) | -12 (-4%) | 149 / $4.99 / $2.99 / $1.99 |

**Bundles and member prices.** *Core + printed Workbook* **4,590** (IELTS Academic) / 4,090 (GT) / 6,590 (GRE + Formula Book): the book effectively costs BDT 600 with any Core. *IELTS Academic Print Kit* (Workbook + Model Answers + Cue-Card + Vocabulary + Mock Booklets) **BDT 1,990** (sold separately 2,750; GT Kit 1,890 vs 2,650): digital cost ~BDT 1,000, contribution ~BDT 510 before free delivery, ~BDT 400 after — accepted as a bundle. Live/Mentor learners get **25% off any book** (a code, not a tier perk). English Foundation Workbook is sold direct only (negative via Rokomari).

**International.** **PDF only, watermarked** (buyer e-mail + order id on every page, 5 downloads, no printing rights stated in the licence), priced from a BD PDF reference by the regional rule (last column above). The same PDFs are also sold in BD at the BD reference price (e.g. Academic Workbook BDT 390 vs print 790). International shipping of Dhaka-printed books is **not offered** at launch (cost/customs). **Option, not committed:** print-on-demand through Amazon KDP — a typical 6x9 B/W paperback costs roughly $1.00 fixed + $0.012/page to print **[A24, unverified; use KDP's print-cost calculator]**, e.g. 320 pages ~ $4.84, so a $19.99 list nets ~$7.15 at the standard 60% royalty. Consider after 500 PDF sales.

---

## 7. Live classes pricing

Class design is in `18-LIVE-CLASSES.md` (L1-L10); this section sets prices and economics. 18 specifies **36 sessions** for the 12-week IELTS batch; 02's earlier "24 classes at BDT 8,900" is superseded (the batch is priced at BDT 9,990 to carry the extra sessions).

**Teacher pay models (BDT, [A12-A13], validate with 5-10 quotes as 18 §4.5 requires).** Lead teacher (IELTS 8.0+, certified) 1,500-3,000/h; junior 800-1,200/h; TA/moderator 400-600/h (18). Planning blend: **BDT 2,500 per 90-minute session including 0.5 h prep credit**; weekend 150-minute session BDT 3,750; speaking-club host 750 per 45 min; mentor 1,200 per 45 min; assessor 450 per speaking mock; writing marker 300 per essay all-in. **Model A (default, P1-P2): flat per session** (caps our downside). **Model B (star instructors, P2+):** 35% of net batch revenue with a floor of BDT 1,500 per session — at 40 seats x BDT 8,687 net = 347,480 -> BDT 121,618 for 36 sessions (BDT 3,378 per session), i.e. above Model A, justified only for teachers who fill their own batches (their audience is the acquisition channel). Lead-instructor royalty on *recorded* courses is the separate optional 10% (D12 C19).

**Batch economics.** Variable per seat = mocks + credits + video + AI tutor + study features; fixed = teachers + TA. Contribution is after VAT and gateway.

| Batch | List (BDT) | Fixed cost per batch | Variable per seat | Break-even seats | Seats shown: contribution per batch (per seat, %) |
|---|---:|---:|---:|---:|---|
| IELTS Regular / Evening 12 wk (L1/L4) | 9,990 | 126,000 | 557 | 16 | 30: 110,406 (3,680, 37%); 40: 189,208 (4,730, 47%); 50: 268,010 (5,360, 54%) |
| IELTS Weekend 12 wk (L3, 24 x 150 min) | 9,990 | 114,000 | 557 | 15 | 30: 122,406 (4,080, 41%); 40: 201,208 (5,030, 50%) |
| IELTS Crash 4 wk (L2) | 7,490 | 55,000 | 388 | 10 | 15: 34,067 (2,271, 30%); 25: 93,445 (3,738, 50%) |
| GRE Live 8 wk (L8) | 8,990 | 92,000 | 380 | 13 | 30: 124,379 (4,146, 46%); 40: 196,506 (4,913, 55%) |
| Women-only 12 wk (L5, cap 25) | 9,990 | 126,000 | 557 | 16 | 20: 31,604 (1,580, 16%); 25: 71,005 (2,840, 28%) |

**Minimum batch sizes.** Regular/Evening/Weekend/GRE **30 seats (cap 50; target 40)**; Crash **15 (cap 25)**; women-only **20 (cap 25)**; international window 8 paid learners then merge (18 §1.6). Decision rule: if a batch is below minimum **7 days before start**, merge it with an adjacent batch, or offer a full refund / free move to the next intake. The break-even points (16 / 15 / 10 / 13 seats) leave a ~50% cushion under the minimum.

**Formats and prices.** Regular 12-week (L1) **BDT 9,990**; Weekend (L3, 24 x 150 min, Fri/Sat) **9,990**; Evening (L4, after 8 PM, Sat/Mon/Wed 8:30-10 PM) **9,990** (no evening premium; the same price keeps the shop simple); Crash 4-week (L2) **7,490**; GRE 8-week (L8) **8,990**; Women-only (L5) **9,990**. International batches: same plan in each regional window, USD from the regional rule (IELTS regular A $229 / B $129 / C $89). The Live **tier** (13,990) is the same batch plus the Plus library, human feedback and club: buying Plus (6,490) + batch (9,990) separately would cost 16,480, so the tier is a real 15% bundle saving.

**Discounts.** *Early-bird:* 10% off when paid >= 21 days before start, first 30% of seats. *Group (3+ friends, one checkout):* 10% each for 3-4, 15% each for 5+. Early-bird and group **do not stack beyond the cap**: Regular/Weekend/Evening/GRE 20% total, Live tier 15%, Crash 10%, Mentor 10% (floors in §11). At 20% off, a Regular batch seat (7,992) still contributes ~BDT 2,000 at 30 seats.

**Corporate / institution batches.** Private cohort of up to 30 learners, minimum 12 sessions: **BDT 6,000 per 90-minute session** (VAT-inclusive; net 5,217; teacher 2,500 + TA 300 + 1% bank 52 -> ~BDT 2,365 contribution, ~39%) with the institution's schedule and a branded learner dashboard; extra materials at add-on prices. Corporate **English** (HR) is a per-employee subscription (§9).

**Recordings / access.** Live access for batch + 30 days of recordings (18), 365-day library access in the tier; standalone batch buyers get 12 months of the batch library.

**Instalments (D10: bKash 2-3 parts, Live/Mentor only).** No financing fee; the list price is the cash price.

| Product | Parts | Schedule | Access lock |
|---|---|---|---|
| Live 13,990 | 3 | 5,600 (day 0) + 4,200 (day 30) + 4,190 (day 60) | Unpaid 3 days after due date (grace) -> live-class and tier access paused; library stays; reactivation free within 14 days of paying, thereafter balance due or transfer |
| Live 13,990 | 2 | 8,400 (day 0) + 5,590 (day 30) | same |
| Mentor 19,990 | 3 | 8,000 + 6,000 + 5,990 (days 0/30/60) | same; 1:1 sessions are not booked while locked |
| Standalone batch 9,990 | 2 | 6,000 + 3,990 (day 30) | same |

First payment (40%) already covers delivery cost incurred by day 30 (one-third of the 36 sessions + variable cost ~BDT 2,000 per seat at 30 seats vs net receipt ~BDT 4,870). P1 uses SSLCommerz pay-links per part (bKash tokenised agreement auto-debit in P2). Refund after a lock: only amounts actually paid, per the refund rules in §11.

---

## 8. Access programme (Bangladesh) and international equivalent

**Need-based scholarship (D10: 50-100% off Core/Plus).**

| Item | Rule |
|---|---|
| Eligibility | Bangladeshi resident, 16+ (minors need guardian consent, D7). Household monthly income <= BDT 30,000 **[A25]** evidenced by **one** of: Union Parishad / UDC income or character certificate, NGO / TTC / school letter, BMET TTC enrolment slip, HSC/diploma student with a documented scholarship, national ID of guardian + utility proof. Plus a short statement of the target test |
| Discounts | **50%** (documented need), **75%** (partner-verified), **100%** (partner-nominated, e.g. NGO/UDC/TTC cohort or Access Fund sponsor). Applies to Core, Plus, passes and English Foundation. **Not** to Live/Mentor, books or services (instalments and partner codes cover them) |
| Quota | <= 8% of paid Core/Plus enrolments per quarter (about 150 seats in Year 1 at 1,900 customers) and a budget cap from the **Access Fund** (1.5% of net revenue + donor/CSR top-ups). Allocation by need score then date; waitlist |
| Cost | A 100% Core seat costs ~BDT 430 (video 96 + AI 90 + mocks 144 + tutor 100) -> ~BDT 64,000 for 150 seats = ~1% of Year-1 gross billings (6.6M) |
| Abuse controls | One scholarship per person (phone + NID/guardian ID + device), 12-month cool-down before reapplying; account is non-transferable and watermarked; **activation rule:** complete 3 lessons within 14 days or the seat returns to the pool; random audit of 10% of documents (UDC/NGO call-back); duplicate or forged proof = revoke + 12-month ban; coupon codes for scholarships are single-use and bound to the account; concurrent-session and device-fingerprint checks to detect resale |
| Access Fund transparency | Quarterly public count of seats granted, funded, and by category (no personal data) |

**bKash instalments.** §7 (Live/Mentor, 2-3 parts, lock on missed payment).

**Partner codes (UDCs, NGOs, TTCs, universities).** Each partner gets a dashboard code with allow-listed products, expiry and per-code caps. UDC entrepreneur: learner **25% off** Core/Foundation, entrepreneur **20% of net** as a commission after the refund window (the UDC helps with cash-to-bKash payment and device access); NGO / BMET TTC cohorts: **40-50% off** Foundation, EPS-TOPIK/JFT and Core, or sponsor-paid vouchers at 100%; universities: **15% off** Core/Plus/passes for students with a verified `.edu`/`.ac.bd` e-mail. Partner cohorts count against the scholarship quota only when 100% off.

**Women-in-migration and first-generation discounts.** Not offered as public gender-based or status-based price cuts at launch: a gender-based public price is a legal/reputational risk and the law has not been reviewed (**[A26] get a lawyer's view**). Instead: (1) women's migration cohorts come through NGO/TTC partner codes (above); (2) **first-generation learner** (no parent with a degree) self-declared 15% off Core/Plus, auditable, within the scholarship stacking cap; (3) the optional women-only batch (L5) is priced like Regular. Re-open after legal review.

**Student ID discount.** 15% off Core/Plus/passes for verified students (university e-mail domain, or student-ID photo + phone, re-verified yearly). Does not stack with scholarship or partner codes; stacks with launch/Eid promos only up to the §11 cap.

**International equivalent.** (1) PPP regions A/B/C by the C25 rule (the program itself). (2) **Student discount 20%** off Core/Plus/passes for verified `.edu`/`.ac.*` e-mails (via the merchant of record). (3) **Scholarship:** 100 seats per quarter at region-C Core/Plus for NGO-nominated refugee/low-income learners, funded from the same Access Fund. (4) Annual passes carry the longest-term discount (12-month pass = 6 x the monthly price vs 12). No further regional cuts: region C already sits at the BD price floor.

---

## 9. B2B

All B2B prices are **VAT-inclusive per seat** (as 02 §7.2, §8.4), invoiced on bank transfer/cheque (1% bank cost [A27], 8% sales commission). Seats get **half** the individual allowances above 100 seats (1 mock every 2 months, 2 writing evals + 0.5 full speaking test per month) and full allowances below. Includes custom mock upload, cohort analytics, org-admin console (D4 `org_admin`, 2FA). Mixed seat counts bill at the tier for the total purchased.

| Pack | Seats | BDT per seat (VAT-incl.) | A | B | C | Cost per seat | Contribution (after 1% bank, 8% sales) | % |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| 3-month seat | 25-49 | **1,400** | $29.99 | $17.99 | $11.99 | 387 | 721 | 51% |
| 3-month seat | 50-99 | **1,250** | $29.99 | $17.99 | $11.99 | 387 | 602 | 48% |
| 3-month seat (half allowances) | 100-249 | **1,100** | $24.99 | $14.99 | $9.99 | 276 | 594 | 54% |
| 3-month seat (half allowances) | 250+ (floor) | **950** | $19.99 | $11.99 | $7.99 | 276 | 476 | 50% |
| 12-month seat | 25-49 | **3,600** | $89 | $49 | $34 | 1,260 | 1,589 | 44% |
| 12-month seat | 50-99 | **3,200** | $79 | $49 | $29.99 | 1,260 | 1,272 | 40% |
| 12-month seat (half allowances) | 100-499 | **2,800** | $59 | $39 | $24.99 | 816 | 1,400 | 50% |
| 12-month seat (half allowances) | 500-1,999 (university) | **2,000** | $49 | $24.99 | $17.99 | 816 | 767 | 38% |
| 12-month seat (half allowances) | 2,000+ (floor) | **1,500** | $34 | $19.99 | $12.99 | 816 | 371 | 25% |

- **Coaching centres:** the 25-49 band; a centre selling to its own students should expect to resell at 2-3x (our brand stays hidden under white-label).
- **Universities:** 500+ seats at 2,000 (12 months) or **campus licences** by quote: floor BDT 1,500 per seat per year (25% contribution); tech/CSE packs add BDT 2,490 per student-semester (P3).
- **Corporate (HR) English:** **BDT 450 per employee per month**, annual contract, minimum 50 seats (Spoken English Workplace + 10 AI conversations/month + manager dashboard): cost ~BDT 102 (AI 70 + video 7 + tutor 25), contribution ~BDT 278 (62%). International: USD from the rule (A $9.99 / B $5.99 / C $3.99 per seat per month, min 25).
- **White-label mock tests (Mock Hub):** **setup BDT 75,000** one-time (branding, domain, import of <= 10 mocks), **BDT 15,000/month** platform fee (<= 300 active learners; +BDT 30 per extra learner), and per use: **BDT 40 per auto-scored L/R attempt, BDT 15 per AI writing eval, BDT 45 per AI speaking test** (AI cost 7 and 24 -> 53% / 47% margin on the AI items). Contract floor 12 months. Magoosh's institutional offer (ten accounts, no custom mocks/proctoring) is the competitor reference (02 §7.4).
- **International B2B:** the same bands in USD from the rule (3-month 25-49 seats A $29.99 / B $17.99 / C $11.99; 12-month A $89 / B $49 / C $34).

---

## 10. Admissions services (placeholders; scope in `21-ADMISSIONS-COMMON-APP.md`, SKUs `adm.*`)

**Rule: feedback, structure and review only — never ghostwriting.** No product writes or rewrites essay/SOP text for the student. Reviewer cost uses BDT 750-1,000 per hour by role **[A28]**; target >= 40% contribution; these are placeholders until 21 commits to counsellor capacity. 21's tier idea (DIY Plus) is the AI feature subscription already in Plus/pass; services below are human-delivered.

| Service (`slug`) | BDT | A | B | C | Reviewer time | Cost (BDT/h) | Contribution % |
|---|---:|---:|---:|---:|---|---:|---:|
| Common App essay feedback (1 essay, 2 rounds; feedback only) (`adm-essay-feedback`) | **2,990** | $59 | $39 | $24.99 | 80 min | 1,000 (750/h) | 51% |
| Essay Studio (3 essays, 2 rounds each) (`adm-essay-studio`) | **7,990** | $169 | $99 | $69 | 240 min | 3,000 (750/h) | 47% |
| College list builder (15 schools + 45-min consult) (`adm-college-list`) | **3,990** | $89 | $49 | $34 | 90 min | 1,500 (1000/h) | 47% |
| Full application review (activities, honors, additional info, consistency) (`adm-application-review`) | **5,490** | $119 | $69 | $49 | 150 min | 2,000 (800/h) | 48% |
| SOP review (1 draft, 2 rounds) (`adm-sop-review`) | **2,790** | $59 | $39 | $24.99 | 75 min | 1,000 (800/h) | 49% |
| CV / resume review (`adm-cv-review`) | **1,590** | $39 | $24.99 | $14.99 | 45 min | 600 (800/h) | 47% |
| SOP + CV review bundle (`adm-sop-cv`) | **3,990** | $89 | $49 | $34 | 120 min | 1,600 (800/h) | 44% |
| Scholarship guidance (shortlist, plan, 1 essay review) (`adm-scholarship-guidance`) | **3,790** | $89 | $49 | $34 | 100 min | 1,500 (900/h) | 45% |
| Interview prep (45-min mock + written feedback) (`adm-interview-prep`) | **2,790** | $59 | $39 | $24.99 | 75 min | 1,000 (800/h) | 49% |
| Apply Ready bundle (list + Essay Studio + full review + SOP) (`adm-apply-ready`) | **16,990** | $349 | $229 | $149 | 555 min | 7,215 (780/h) | 42% |

The *Apply Ready* bundle is 16,990 vs 20,260 bought separately (16% off, a real saving). Counsellor packages: unused sessions refundable at the per-session price minus the bundle discount (21).

---

## 11. Promotions, coupons, referrals, affiliates, refunds, guarantees

**Allowed promotions (max 4 sitewide per year, each <= 14 days, <= 20% off list; Black Friday intl <= 30% on annual passes).**

| Promo | Window | Scope | Depth |
|---|---|---|---|
| Launch (founding learners) | First 30 days, first 500 buyers | Core, Plus, passes | 20% (list stays the future list price; no "was") |
| Eid (Fitr or Adha) | 5-7 days around Eid | Core, passes, Foundation | up to 15% |
| Pohela Boishakh (14 April) | 3 days | Core, books, Foundation | 14% (a signature, not a trick) |
| Back-to-school / HSC results | January and result weeks | Core/Plus, Foundation, student discount stackable | up to 15% |
| Black Friday (international) | Fri-Mon | Intl passes and Core only | 25-30% annual pass, 20% Core |

**Never:** Mentor above 10%; countdown timers that reset; a "was" price that was not charged for >= 28 of the last 90 days (D12 C14); promos on admissions services except bundles.

**Coupon rules.** Server-validated codes (percent / fixed / free item) with: per-user single use, expiry, min cart, product allow-list, global cap; one coupon per order. **Stacking:** one price-reducing mechanism (coupon *or* campaign *or* partner code) plus at most one automatic discount (early-bird *or* group *or* bundle *or* student). Hard caps on total discount: Core 40%, Plus 30%, passes 30%, Live batch 20%, Live tier 15%, Crash 10%, Mentor 10%, books 25% (member). Scholarships replace other discounts. Referral credit pays after discounts and is not cash. Coupons never apply to B2B, admissions services, or add-ons already priced as packs. Price floors and contribution at floor:

| Product | List | Max total discount | Floor price | Contribution at floor (BDT, at min seats) |
|---|---:|---:|---:|---:|
| IELTS Academic Core | 3,990 | 40% | 2,394 | 1,384 (58%) |
| IELTS Academic Plus | 6,490 | 30% | 4,543 | 1,466 (32%) |
| IELTS Academic Live | 13,990 | 15% | 11,892 | 1,213 (10%) |
| IELTS Academic Live Crash | 9,990 | 10% | 8,991 | 781 (9%) |
| IELTS Academic Mentor | 19,990 | 10% | 17,991 | 888 (5%) |
| GRE Core | 5,990 | 40% | 3,594 | 2,409 (67%) |
| GRE Plus | 8,490 | 30% | 5,943 | 2,988 (50%) |
| Pass 1m | 1,190 | 30% | 833 | 409 (49%) |
| Pass 3m | 2,990 | 30% | 2,093 | 956 (46%) |
| Pass 6m | 4,490 | 30% | 3,143 | 1,169 (37%) |
| Pass 12m | 6,990 | 30% | 4,893 | 1,475 (30%) |

**Referral credits.** Referrer and referee each get **BDT 200 store credit** when the referee pays >= BDT 1,990 and the 7-day refund window has passed (international $5 / $5). Cap BDT 2,000 per referrer per year, credit expires in 12 months, not cash-redeemable, usable on any product except B2B. (BDT 400 per referral is well under the BDT 1,400 allowable paid CAC in 02 §8.5.)

**Affiliates / creators.** 15% of net (20% for creators above BDT 100k/month) on tracked first purchases of Core/Plus/passes/standalone, 10% on Live/Mentor, 30-day cookie, paid after the refund window, **manual monthly payouts** (finance role, bank/bKash, withholding tax per the accountant; D12 C19), no commission on self-referrals or coupon-site traffic; must disclose the relationship. P1 creator pay for content is **work-for-hire** per asset + optional lead-instructor royalty 10% (D12 C19).

**Refund policy by product type (D5 and D12 C13b; refunds go to the original method; gateway fee absorbed by us; SSLCommerz refunds can take 7-14 working days).**

| Product | Rule |
|---|---|
| Core, Plus, passes, standalone self-paced courses | **7 days, no questions asked** if < 20% of content consumed and <= 1 full mock taken; otherwise none. Consumed AI credits never refunded (their price is deducted if partially used). Certificate revoked on refund. 1-month pass: 72 hours |
| AI credit packs | Unused credits refundable within 7 days; consumed credits never |
| Mock packs / series | Unused packs refundable within 7 days; any mock started = non-refundable for that mock |
| Human review / speaking / 1:1 packs | Unused units refundable within 30 days at the per-unit price; consumed never; missed SLA = automatic credit back |
| Live batch (standalone) and Live tier | **Full refund before class 3 begins**; after that none, but a one-time free transfer to the next batch for documented medical/travel reasons. Teacher no-show: make-up within 7 days, otherwise refund pro-rata or extend (18) |
| Live Crash | Before class 2 begins |
| Mentor | Same as Live, or before the first 1:1 session, whichever is earlier |
| Printed books | Returnable within 7 days of delivery if unopened/unused; buyer pays return shipping unless the book is defective (Steadfast does not charge for returns on COD); return conditions displayed at checkout (Digital Commerce Guidelines) |
| PDF books | Non-refundable once downloaded; defective files replaced |
| Extensions, certificate reprints, priority grading | Non-refundable once applied |
| Admissions services | Full refund before work starts; 50% after start but before the first deliverable; none after delivery |
| B2B | Per contract; seats unused in the first 14 days refundable pro-rata |
| Free-trial conversion | Same 7-day rule from the paid purchase date |

**Guarantees.** Only: Plus **Target Promise** and Mentor **Progress Promise** (§2.2a). **No cash score guarantee on any product** (D12 C13b); no "guaranteed band" in any ad.

---

## 12. Price-testing plan (first 90 days after public launch, ≈ April 2027)

**Tool.** Pre-launch Van Westendorp (n >= 150 BD, >= 100 international from the waitlist: "too cheap / cheap / expensive / too expensive" for Core, Plus, Live, Mentor, 3-month pass) + a Gabor-Granger ladder for the 3-month pass; post-launch live tests by **stable-hash user splits on `/pricing`** (BD traffic is ad-driven and not geo-separable, so geo-splits are not used in BD; **time-splits** are used for international because Paddle/Stripe prices are per-country). No user sees two prices; a buyer is price-protected for 30 days (difference refunded on request).

| # | Test | Variants | Window | Primary metric | Guardrails |
|---|---|---|---|---|---|
| T1 | IELTS Academic Core | 3,490 / **3,990** / 4,490 | Days 1-30 | contribution per pricing-page visitor | refund rate, 30-day activation, Plus attach |
| T2 | 3-month pass | 2,490 / **2,990** | Days 1-30 | revenue per visitor + Core share | Core cannibalisation (Core share must not fall > 10 pts) |
| T3 | Live tier | 12,990 / **13,990** / 14,990 | Days 31-60 | seats filled per intake x contribution | min batch hit (30 seats), instalment take-up |
| T4 | 12-month pass | **6,990** / 7,490 | Days 31-60 | contribution at 100%/60% AI use | AI utilisation (>75% triggers the §5 rule) |
| T5 | AI credit pack (10) | 490 / **590** | Days 61-90 | attach rate | support load |
| T6 | Intl Core region A | $79 / **$89** / $99 | Days 1-90 time-split | conversion x price | refund, MoR fee |
| T7 | Plus 7-day trial vs none | trial / no trial | Days 1-45 | trial-to-paid, cost per paying customer | trial abuse (phone/device duplicates), cost <= BDT 100/trial |

**Sample size.** To see a 25% relative lift on a 3% pricing-page conversion at 80% power, alpha 0.05: n ~ 16 p(1-p)/d^2 = 16 x 0.03 x 0.97 / 0.0075^2 = **8,277 visitors per arm**; at ~1,900 paying customers in Year 1 that is only reachable for T1/T2/T6 in months 2-3, so T3/T4/T5 are read on sign-ups with **Bayesian** estimates and decided only on a >= 90% probability of higher contribution. **Success** = contribution per visitor +10% without a refund-rate increase above 2 points, no drop in Plus/Live attach, and a payback consistent with 02 §8.5 (allowable paid CAC ~BDT 1,400). Report weekly (14).

---

## 13. Machine-readable appendix (seed script input)

**Schema.** One list `products`. Each row: `slug` (unique), `kind` (D5: `course | bundle | test_pack | ai_credits | pass | live_batch | org_seat_pack`; **proposed D5 additions** flagged `d5_extension: true`: `physical_book`, `service`, plus human-delivered credits (stored as `ai_credits` with a `credit_type` in allowances until D5 is extended)), `tier` (`free|core|plus|live|crash|mentor`), `exam`, `phase`, `duration_days`, `prices.{BD|A|B|C}` = **`amount_minor`** (BDT poisha for `BD`, USD cents for `A/B/C`; `currency` is BDT for BD and USD otherwise), `allowances` (entitlement limits). `compare_at_minor` is never stored here (D12 C14). Price rows load into `price` with `region` in {BD,A,B,C} (D12 C16). Rows without a region key are not sold there. **Live-tier rows are `bundle` (course + live_batch entitlement).** Parse by extracting the fenced block between the two HTML comments named SEED:START and SEED:END (the last occurrence of each); each row is one-line flow YAML (valid JSON).

<!-- SEED:START -->
```yaml
version: 1
generated: 2026-11-07
fx_bdt_per_usd: 120
vat_bps: 1500
products:
  - {"slug": "ielts-academic-core", "kind": "course", "name": "IELTS Academic Core", "tier": "core", "exam": "ielts_academic", "phase": "P1", "duration_days": 183, "prices": {"BD": 399000, "A": 8900, "B": 4900, "C": 3400}, "allowances": {"ai_credits": 10, "full_mocks": 4, "ai_daily_cap": 3, "ai_tutor_msgs_per_day": 30, "smart_flashcards_srs": true, "mobile_pwa": true, "score_predictor": true, "study_plan": "static", "certificate": true, "money_back_days": 7}}
  - {"slug": "ielts-academic-plus", "kind": "course", "name": "IELTS Academic Plus", "tier": "plus", "exam": "ielts_academic", "phase": "P1", "duration_days": 183, "prices": {"BD": 649000, "A": 14900, "B": 8900, "C": 5900}, "allowances": {"ai_credits": 40, "full_mocks": 10, "human_essay_reviews": 2, "weekly_live_qa": true, "ai_daily_cap": 6, "ai_tutor_msgs_per_day": 150, "smart_flashcards_srs": true, "mobile_pwa": true, "score_predictor": true, "audio_overviews": true, "mind_maps_study_guides": true, "study_plan": "adaptive", "full_mocks_at_launch": 5, "full_mocks_target_date": "2027-08-15", "certificate": true, "money_back_days": 7, "target_promise": true}}
  - {"slug": "ielts-academic-live", "kind": "bundle", "name": "IELTS Academic Live", "tier": "live", "exam": "ielts_academic", "phase": "P1 pilot / P2 scale", "duration_days": 365, "prices": {"BD": 1399000, "A": 29900, "B": 17900, "C": 11900}, "allowances": {"ai_credits": 40, "full_mocks": 10, "human_essay_reviews": 4, "human_speaking_mocks": 2, "live_classes": 36, "speaking_club": 6, "ai_daily_cap": 6, "ai_tutor_msgs_per_day": 150, "smart_flashcards_srs": true, "mobile_pwa": true, "score_predictor": true, "audio_overviews": true, "mind_maps_study_guides": true, "study_plan": "adaptive", "full_mocks_at_launch": 5, "full_mocks_target_date": "2027-08-15", "certificate": true, "money_back_rule": "before_class_3"}}
  - {"slug": "ielts-academic-crash", "kind": "bundle", "name": "IELTS Academic Live Crash", "tier": "crash", "exam": "ielts_academic", "phase": "P1 pilot / P2 scale", "duration_days": 365, "prices": {"BD": 999000, "A": 22900, "B": 12900, "C": 8900}, "allowances": {"ai_credits": 40, "full_mocks": 10, "human_essay_reviews": 2, "human_speaking_mocks": 1, "live_classes": 16, "speaking_club": 3, "ai_daily_cap": 6, "ai_tutor_msgs_per_day": 150, "smart_flashcards_srs": true, "mobile_pwa": true, "score_predictor": true, "audio_overviews": true, "mind_maps_study_guides": true, "study_plan": "adaptive", "full_mocks_at_launch": 5, "full_mocks_target_date": "2027-08-15", "certificate": true, "money_back_rule": "before_class_3"}}
  - {"slug": "ielts-academic-mentor", "kind": "bundle", "name": "IELTS Academic Mentor", "tier": "mentor", "exam": "ielts_academic", "phase": "P1", "duration_days": 365, "prices": {"BD": 1999000, "A": 39900, "B": 24900, "C": 16900}, "allowances": {"ai_credits": 40, "full_mocks": 10, "human_essay_reviews": 6, "human_speaking_mocks": 3, "live_classes": 36, "speaking_club": 6, "one_to_one_45min": 3, "progress_promise": true, "ai_daily_cap": 6, "ai_tutor_msgs_per_day": 150, "smart_flashcards_srs": true, "mobile_pwa": true, "score_predictor": true, "audio_overviews": true, "mind_maps_study_guides": true, "study_plan": "adaptive", "full_mocks_at_launch": 5, "full_mocks_target_date": "2027-08-15", "certificate": true, "money_back_rule": "before_class_3"}}
  - {"slug": "ielts-gt-core", "kind": "course", "name": "IELTS General Training Core", "tier": "core", "exam": "ielts_gt", "phase": "P1", "duration_days": 183, "prices": {"BD": 349000, "A": 7900, "B": 4900, "C": 2999}, "allowances": {"ai_credits": 10, "full_mocks": 4, "ai_daily_cap": 3, "ai_tutor_msgs_per_day": 30, "smart_flashcards_srs": true, "mobile_pwa": true, "score_predictor": true, "study_plan": "static", "certificate": true, "money_back_days": 7}}
  - {"slug": "ielts-gt-plus", "kind": "course", "name": "IELTS General Training Plus", "tier": "plus", "exam": "ielts_gt", "phase": "P1", "duration_days": 183, "prices": {"BD": 649000, "A": 14900, "B": 8900, "C": 5900}, "allowances": {"ai_credits": 40, "full_mocks": 10, "human_essay_reviews": 2, "weekly_live_qa": true, "ai_daily_cap": 6, "ai_tutor_msgs_per_day": 150, "smart_flashcards_srs": true, "mobile_pwa": true, "score_predictor": true, "audio_overviews": true, "mind_maps_study_guides": true, "study_plan": "adaptive", "full_mocks_at_launch": 5, "full_mocks_target_date": "2027-08-15", "certificate": true, "money_back_days": 7, "target_promise": true}}
  - {"slug": "ielts-gt-live", "kind": "bundle", "name": "IELTS General Training Live", "tier": "live", "exam": "ielts_gt", "phase": "P1 pilot / P2 scale", "duration_days": 365, "prices": {"BD": 1299000, "A": 29900, "B": 17900, "C": 11900}, "allowances": {"ai_credits": 40, "full_mocks": 10, "human_essay_reviews": 4, "human_speaking_mocks": 2, "live_classes": 36, "speaking_club": 6, "ai_daily_cap": 6, "ai_tutor_msgs_per_day": 150, "smart_flashcards_srs": true, "mobile_pwa": true, "score_predictor": true, "audio_overviews": true, "mind_maps_study_guides": true, "study_plan": "adaptive", "full_mocks_at_launch": 5, "full_mocks_target_date": "2027-08-15", "certificate": true, "money_back_rule": "before_class_3"}}
  - {"slug": "ielts-gt-crash", "kind": "bundle", "name": "IELTS General Training Live Crash", "tier": "crash", "exam": "ielts_gt", "phase": "P1 pilot / P2 scale", "duration_days": 365, "prices": {"BD": 949000, "A": 22900, "B": 12900, "C": 8900}, "allowances": {"ai_credits": 40, "full_mocks": 10, "human_essay_reviews": 2, "human_speaking_mocks": 1, "live_classes": 16, "speaking_club": 3, "ai_daily_cap": 6, "ai_tutor_msgs_per_day": 150, "smart_flashcards_srs": true, "mobile_pwa": true, "score_predictor": true, "audio_overviews": true, "mind_maps_study_guides": true, "study_plan": "adaptive", "full_mocks_at_launch": 5, "full_mocks_target_date": "2027-08-15", "certificate": true, "money_back_rule": "before_class_3"}}
  - {"slug": "ielts-gt-mentor", "kind": "bundle", "name": "IELTS General Training Mentor", "tier": "mentor", "exam": "ielts_gt", "phase": "P1", "duration_days": 365, "prices": {"BD": 1899000, "A": 39900, "B": 24900, "C": 16900}, "allowances": {"ai_credits": 40, "full_mocks": 10, "human_essay_reviews": 6, "human_speaking_mocks": 3, "live_classes": 36, "speaking_club": 6, "one_to_one_45min": 3, "progress_promise": true, "ai_daily_cap": 6, "ai_tutor_msgs_per_day": 150, "smart_flashcards_srs": true, "mobile_pwa": true, "score_predictor": true, "audio_overviews": true, "mind_maps_study_guides": true, "study_plan": "adaptive", "full_mocks_at_launch": 5, "full_mocks_target_date": "2027-08-15", "certificate": true, "money_back_rule": "before_class_3"}}
  - {"slug": "gre-core", "kind": "course", "name": "GRE Core", "tier": "core", "exam": "gre", "phase": "P1", "duration_days": 183, "prices": {"BD": 599000, "A": 14900, "B": 8900, "C": 5900}, "allowances": {"ai_credits": 6, "full_mocks": 4, "ai_daily_cap": 3, "ai_tutor_msgs_per_day": 30, "smart_flashcards_srs": true, "mobile_pwa": true, "score_predictor": true, "study_plan": "static", "certificate": true, "money_back_days": 7}}
  - {"slug": "gre-plus", "kind": "course", "name": "GRE Plus", "tier": "plus", "exam": "gre", "phase": "P1", "duration_days": 183, "prices": {"BD": 849000, "A": 19900, "B": 11900, "C": 7900}, "allowances": {"ai_credits": 20, "full_mocks": 10, "human_essay_reviews": 2, "weekly_live_qa": true, "ai_daily_cap": 6, "ai_tutor_msgs_per_day": 150, "smart_flashcards_srs": true, "mobile_pwa": true, "score_predictor": true, "audio_overviews": true, "mind_maps_study_guides": true, "study_plan": "adaptive", "full_mocks_at_launch": 5, "full_mocks_target_date": "2027-08-15", "certificate": true, "money_back_days": 7, "target_promise": true}}
  - {"slug": "gre-live", "kind": "bundle", "name": "GRE Live", "tier": "live", "exam": "gre", "phase": "P1 pilot / P2 scale", "duration_days": 365, "prices": {"BD": 1299000, "A": 29900, "B": 17900, "C": 11900}, "allowances": {"ai_credits": 20, "full_mocks": 10, "human_essay_reviews": 4, "human_speaking_mocks": 0, "live_classes": 24, "ai_daily_cap": 6, "problem_clinic": 0, "ai_tutor_msgs_per_day": 150, "smart_flashcards_srs": true, "mobile_pwa": true, "score_predictor": true, "audio_overviews": true, "mind_maps_study_guides": true, "study_plan": "adaptive", "full_mocks_at_launch": 5, "full_mocks_target_date": "2027-08-15", "certificate": true, "money_back_rule": "before_class_3"}}
  - {"slug": "gre-crash", "kind": "bundle", "name": "GRE Live Crash", "tier": "crash", "exam": "gre", "phase": "P1 pilot / P2 scale", "duration_days": 365, "prices": {"BD": 999000, "A": 22900, "B": 12900, "C": 8900}, "allowances": {"ai_credits": 20, "full_mocks": 10, "human_essay_reviews": 2, "human_speaking_mocks": 0, "live_classes": 12, "ai_daily_cap": 6, "problem_clinic": 0, "ai_tutor_msgs_per_day": 150, "smart_flashcards_srs": true, "mobile_pwa": true, "score_predictor": true, "audio_overviews": true, "mind_maps_study_guides": true, "study_plan": "adaptive", "full_mocks_at_launch": 5, "full_mocks_target_date": "2027-08-15", "certificate": true, "money_back_rule": "before_class_3"}}
  - {"slug": "gre-mentor", "kind": "bundle", "name": "GRE Mentor", "tier": "mentor", "exam": "gre", "phase": "P1", "duration_days": 365, "prices": {"BD": 1999000, "A": 39900, "B": 24900, "C": 16900}, "allowances": {"ai_credits": 20, "full_mocks": 10, "human_essay_reviews": 6, "human_speaking_mocks": 0, "live_classes": 24, "one_to_one_45min": 3, "progress_promise": true, "ai_daily_cap": 6, "problem_clinic": 0, "ai_tutor_msgs_per_day": 150, "smart_flashcards_srs": true, "mobile_pwa": true, "score_predictor": true, "audio_overviews": true, "mind_maps_study_guides": true, "study_plan": "adaptive", "full_mocks_at_launch": 5, "full_mocks_target_date": "2027-08-15", "certificate": true, "money_back_rule": "before_class_3"}}
  - {"slug": "pte-core", "kind": "course", "name": "PTE Academic Core", "tier": "core", "exam": "pte", "phase": "P2", "duration_days": 183, "prices": {"BD": 399000, "A": 8900, "B": 4900, "C": 3400}, "allowances": {"ai_credits": 10, "full_mocks": 4, "ai_daily_cap": 3, "ai_tutor_msgs_per_day": 30, "smart_flashcards_srs": true, "mobile_pwa": true, "score_predictor": true, "study_plan": "static", "certificate": true, "money_back_days": 7}}
  - {"slug": "pte-plus", "kind": "course", "name": "PTE Academic Plus", "tier": "plus", "exam": "pte", "phase": "P2", "duration_days": 183, "prices": {"BD": 649000, "A": 14900, "B": 8900, "C": 5900}, "allowances": {"ai_credits": 34, "full_mocks": 10, "human_essay_reviews": 2, "weekly_live_qa": true, "ai_daily_cap": 6, "ai_tutor_msgs_per_day": 150, "smart_flashcards_srs": true, "mobile_pwa": true, "score_predictor": true, "audio_overviews": true, "mind_maps_study_guides": true, "study_plan": "adaptive", "full_mocks_at_launch": 5, "full_mocks_target_date": "2027-08-15", "certificate": true, "money_back_days": 7, "target_promise": true}}
  - {"slug": "pte-live", "kind": "bundle", "name": "PTE Academic Live", "tier": "live", "exam": "pte", "phase": "P2", "duration_days": 365, "prices": {"BD": 1399000, "A": 29900, "B": 17900, "C": 11900}, "allowances": {"ai_credits": 34, "full_mocks": 10, "human_essay_reviews": 4, "human_speaking_mocks": 2, "live_classes": 36, "speaking_club": 6, "ai_daily_cap": 6, "ai_tutor_msgs_per_day": 150, "smart_flashcards_srs": true, "mobile_pwa": true, "score_predictor": true, "audio_overviews": true, "mind_maps_study_guides": true, "study_plan": "adaptive", "full_mocks_at_launch": 5, "full_mocks_target_date": "2027-08-15", "certificate": true, "money_back_rule": "before_class_3"}}
  - {"slug": "pte-crash", "kind": "bundle", "name": "PTE Academic Live Crash", "tier": "crash", "exam": "pte", "phase": "P2", "duration_days": 365, "prices": {"BD": 999000, "A": 22900, "B": 12900, "C": 8900}, "allowances": {"ai_credits": 34, "full_mocks": 10, "human_essay_reviews": 2, "human_speaking_mocks": 1, "live_classes": 16, "speaking_club": 3, "ai_daily_cap": 6, "ai_tutor_msgs_per_day": 150, "smart_flashcards_srs": true, "mobile_pwa": true, "score_predictor": true, "audio_overviews": true, "mind_maps_study_guides": true, "study_plan": "adaptive", "full_mocks_at_launch": 5, "full_mocks_target_date": "2027-08-15", "certificate": true, "money_back_rule": "before_class_3"}}
  - {"slug": "pte-mentor", "kind": "bundle", "name": "PTE Academic Mentor", "tier": "mentor", "exam": "pte", "phase": "P2", "duration_days": 365, "prices": {"BD": 1999000, "A": 39900, "B": 24900, "C": 16900}, "allowances": {"ai_credits": 34, "full_mocks": 10, "human_essay_reviews": 6, "human_speaking_mocks": 3, "live_classes": 36, "speaking_club": 6, "one_to_one_45min": 3, "progress_promise": true, "ai_daily_cap": 6, "ai_tutor_msgs_per_day": 150, "smart_flashcards_srs": true, "mobile_pwa": true, "score_predictor": true, "audio_overviews": true, "mind_maps_study_guides": true, "study_plan": "adaptive", "full_mocks_at_launch": 5, "full_mocks_target_date": "2027-08-15", "certificate": true, "money_back_rule": "before_class_3"}}
  - {"slug": "toefl-core", "kind": "course", "name": "TOEFL iBT Core", "tier": "core", "exam": "toefl", "phase": "P3", "duration_days": 183, "prices": {"BD": 399000, "A": 8900, "B": 4900, "C": 3400}, "allowances": {"ai_credits": 10, "full_mocks": 4, "ai_daily_cap": 3, "ai_tutor_msgs_per_day": 30, "smart_flashcards_srs": true, "mobile_pwa": true, "score_predictor": true, "study_plan": "static", "certificate": true, "money_back_days": 7}}
  - {"slug": "toefl-plus", "kind": "course", "name": "TOEFL iBT Plus", "tier": "plus", "exam": "toefl", "phase": "P3", "duration_days": 183, "prices": {"BD": 649000, "A": 14900, "B": 8900, "C": 5900}, "allowances": {"ai_credits": 34, "full_mocks": 10, "human_essay_reviews": 2, "weekly_live_qa": true, "ai_daily_cap": 6, "ai_tutor_msgs_per_day": 150, "smart_flashcards_srs": true, "mobile_pwa": true, "score_predictor": true, "audio_overviews": true, "mind_maps_study_guides": true, "study_plan": "adaptive", "full_mocks_at_launch": 5, "full_mocks_target_date": "2027-08-15", "certificate": true, "money_back_days": 7, "target_promise": true}}
  - {"slug": "toefl-live", "kind": "bundle", "name": "TOEFL iBT Live", "tier": "live", "exam": "toefl", "phase": "P3", "duration_days": 365, "prices": {"BD": 1399000, "A": 29900, "B": 17900, "C": 11900}, "allowances": {"ai_credits": 34, "full_mocks": 10, "human_essay_reviews": 4, "human_speaking_mocks": 2, "live_classes": 36, "speaking_club": 6, "ai_daily_cap": 6, "ai_tutor_msgs_per_day": 150, "smart_flashcards_srs": true, "mobile_pwa": true, "score_predictor": true, "audio_overviews": true, "mind_maps_study_guides": true, "study_plan": "adaptive", "full_mocks_at_launch": 5, "full_mocks_target_date": "2027-08-15", "certificate": true, "money_back_rule": "before_class_3"}}
  - {"slug": "toefl-crash", "kind": "bundle", "name": "TOEFL iBT Live Crash", "tier": "crash", "exam": "toefl", "phase": "P3", "duration_days": 365, "prices": {"BD": 999000, "A": 22900, "B": 12900, "C": 8900}, "allowances": {"ai_credits": 34, "full_mocks": 10, "human_essay_reviews": 2, "human_speaking_mocks": 1, "live_classes": 16, "speaking_club": 3, "ai_daily_cap": 6, "ai_tutor_msgs_per_day": 150, "smart_flashcards_srs": true, "mobile_pwa": true, "score_predictor": true, "audio_overviews": true, "mind_maps_study_guides": true, "study_plan": "adaptive", "full_mocks_at_launch": 5, "full_mocks_target_date": "2027-08-15", "certificate": true, "money_back_rule": "before_class_3"}}
  - {"slug": "toefl-mentor", "kind": "bundle", "name": "TOEFL iBT Mentor", "tier": "mentor", "exam": "toefl", "phase": "P3", "duration_days": 365, "prices": {"BD": 1999000, "A": 39900, "B": 24900, "C": 16900}, "allowances": {"ai_credits": 34, "full_mocks": 10, "human_essay_reviews": 6, "human_speaking_mocks": 3, "live_classes": 36, "speaking_club": 6, "one_to_one_45min": 3, "progress_promise": true, "ai_daily_cap": 6, "ai_tutor_msgs_per_day": 150, "smart_flashcards_srs": true, "mobile_pwa": true, "score_predictor": true, "audio_overviews": true, "mind_maps_study_guides": true, "study_plan": "adaptive", "full_mocks_at_launch": 5, "full_mocks_target_date": "2027-08-15", "certificate": true, "money_back_rule": "before_class_3"}}
  - {"slug": "det-core", "kind": "course", "name": "Duolingo English Test Core", "tier": "core", "exam": "det", "phase": "P2", "duration_days": 183, "prices": {"BD": 249000, "A": 5900, "B": 3900, "C": 2499}, "allowances": {"ai_credits": 8, "full_mocks": 4, "ai_daily_cap": 3, "ai_tutor_msgs_per_day": 30, "smart_flashcards_srs": true, "mobile_pwa": true, "score_predictor": true, "study_plan": "static", "certificate": true, "money_back_days": 7}}
  - {"slug": "det-plus", "kind": "course", "name": "Duolingo English Test Plus", "tier": "plus", "exam": "det", "phase": "P2", "duration_days": 183, "prices": {"BD": 529000, "A": 11900, "B": 6900, "C": 4900}, "allowances": {"ai_credits": 24, "full_mocks": 10, "human_essay_reviews": 2, "weekly_live_qa": true, "ai_daily_cap": 6, "ai_tutor_msgs_per_day": 150, "smart_flashcards_srs": true, "mobile_pwa": true, "score_predictor": true, "audio_overviews": true, "mind_maps_study_guides": true, "study_plan": "adaptive", "full_mocks_at_launch": 5, "full_mocks_target_date": "2027-08-15", "certificate": true, "money_back_days": 7, "target_promise": true}}
  - {"slug": "det-live", "kind": "bundle", "name": "Duolingo English Test Live", "tier": "live", "exam": "det", "phase": "P2", "duration_days": 365, "prices": {"BD": 999000, "A": 22900, "B": 12900, "C": 8900}, "allowances": {"ai_credits": 24, "full_mocks": 10, "human_essay_reviews": 4, "human_speaking_mocks": 2, "live_classes": 12, "speaking_club": 6, "ai_daily_cap": 6, "ai_tutor_msgs_per_day": 150, "smart_flashcards_srs": true, "mobile_pwa": true, "score_predictor": true, "audio_overviews": true, "mind_maps_study_guides": true, "study_plan": "adaptive", "full_mocks_at_launch": 5, "full_mocks_target_date": "2027-08-15", "certificate": true, "money_back_rule": "before_class_3"}}
  - {"slug": "det-crash", "kind": "bundle", "name": "Duolingo English Test Live Crash", "tier": "crash", "exam": "det", "phase": "P2", "duration_days": 365, "prices": {"BD": 699000, "A": 14900, "B": 8900, "C": 5900}, "allowances": {"ai_credits": 24, "full_mocks": 10, "human_essay_reviews": 2, "human_speaking_mocks": 1, "live_classes": 8, "speaking_club": 3, "ai_daily_cap": 6, "ai_tutor_msgs_per_day": 150, "smart_flashcards_srs": true, "mobile_pwa": true, "score_predictor": true, "audio_overviews": true, "mind_maps_study_guides": true, "study_plan": "adaptive", "full_mocks_at_launch": 5, "full_mocks_target_date": "2027-08-15", "certificate": true, "money_back_rule": "before_class_3"}}
  - {"slug": "det-mentor", "kind": "bundle", "name": "Duolingo English Test Mentor", "tier": "mentor", "exam": "det", "phase": "P2", "duration_days": 365, "prices": {"BD": 1699000, "A": 34900, "B": 22900, "C": 14900}, "allowances": {"ai_credits": 24, "full_mocks": 10, "human_essay_reviews": 6, "human_speaking_mocks": 3, "live_classes": 12, "speaking_club": 6, "one_to_one_45min": 3, "progress_promise": true, "ai_daily_cap": 6, "ai_tutor_msgs_per_day": 150, "smart_flashcards_srs": true, "mobile_pwa": true, "score_predictor": true, "audio_overviews": true, "mind_maps_study_guides": true, "study_plan": "adaptive", "full_mocks_at_launch": 5, "full_mocks_target_date": "2027-08-15", "certificate": true, "money_back_rule": "before_class_3"}}
  - {"slug": "ielts-academic-free", "kind": "course", "name": "IELTS Academic Free", "tier": "free", "exam": "ielts_academic", "phase": "P1", "prices": {"BD": 0, "A": 0, "B": 0, "C": 0}, "allowances": {"ai_credits_signup": 2, "ai_credits_monthly": 1, "mocks_sectional": 1, "ai_daily_cap": 1, "ai_tutor_msgs_per_day": 10, "smart_flashcards_srs": true, "mobile_pwa": true, "plus_trial_days": 7, "plus_trial_ai_credits": 5, "community": "official_fb_group_discord"}}
  - {"slug": "ielts-gt-free", "kind": "course", "name": "IELTS General Training Free", "tier": "free", "exam": "ielts_gt", "phase": "P1", "prices": {"BD": 0, "A": 0, "B": 0, "C": 0}, "allowances": {"ai_credits_signup": 2, "ai_credits_monthly": 1, "mocks_sectional": 1, "ai_daily_cap": 1, "ai_tutor_msgs_per_day": 10, "smart_flashcards_srs": true, "mobile_pwa": true, "plus_trial_days": 7, "plus_trial_ai_credits": 5, "community": "official_fb_group_discord"}}
  - {"slug": "gre-free", "kind": "course", "name": "GRE Free", "tier": "free", "exam": "gre", "phase": "P1", "prices": {"BD": 0, "A": 0, "B": 0, "C": 0}, "allowances": {"ai_credits_signup": 2, "ai_credits_monthly": 1, "mocks_sectional": 1, "ai_daily_cap": 1, "ai_tutor_msgs_per_day": 10, "smart_flashcards_srs": true, "mobile_pwa": true, "plus_trial_days": 7, "plus_trial_ai_credits": 5, "community": "official_fb_group_discord"}}
  - {"slug": "pte-free", "kind": "course", "name": "PTE Academic Free", "tier": "free", "exam": "pte", "phase": "P2", "prices": {"BD": 0, "A": 0, "B": 0, "C": 0}, "allowances": {"ai_credits_signup": 2, "ai_credits_monthly": 1, "mocks_sectional": 1, "ai_daily_cap": 1, "ai_tutor_msgs_per_day": 10, "smart_flashcards_srs": true, "mobile_pwa": true, "plus_trial_days": 7, "plus_trial_ai_credits": 5, "community": "official_fb_group_discord"}}
  - {"slug": "det-free", "kind": "course", "name": "Duolingo English Test Free", "tier": "free", "exam": "det", "phase": "P2", "prices": {"BD": 0, "A": 0, "B": 0, "C": 0}, "allowances": {"ai_credits_signup": 2, "ai_credits_monthly": 1, "mocks_sectional": 1, "ai_daily_cap": 1, "ai_tutor_msgs_per_day": 10, "smart_flashcards_srs": true, "mobile_pwa": true, "plus_trial_days": 7, "plus_trial_ai_credits": 5, "community": "official_fb_group_discord"}}
  - {"slug": "toefl-free", "kind": "course", "name": "TOEFL iBT Free", "tier": "free", "exam": "toefl", "phase": "P3", "prices": {"BD": 0, "A": 0, "B": 0, "C": 0}, "allowances": {"ai_credits_signup": 2, "ai_credits_monthly": 1, "mocks_sectional": 1, "ai_daily_cap": 1, "ai_tutor_msgs_per_day": 10, "smart_flashcards_srs": true, "mobile_pwa": true, "plus_trial_days": 7, "plus_trial_ai_credits": 5, "community": "official_fb_group_discord"}}
  - {"slug": "pass-1m", "kind": "pass", "name": "All-access Pass 1 month", "phase": "P1", "duration_days": 30, "prices": {"BD": 119000, "A": 2499, "B": 1499, "C": 999}, "allowances": {"ai_credits_per_30d": 10, "full_mocks_per_30d": 2, "ai_daily_cap": 4, "concurrent_devices": 2, "rollover": false, "money_back_days": 7}}
  - {"slug": "pass-3m", "kind": "pass", "name": "All-access Pass 3 months", "phase": "P1", "duration_days": 90, "prices": {"BD": 299000, "A": 5900, "B": 3900, "C": 2499}, "allowances": {"ai_credits_per_30d": 10, "full_mocks_per_30d": 2, "ai_daily_cap": 4, "concurrent_devices": 2, "rollover": false, "money_back_days": 7}}
  - {"slug": "pass-6m", "kind": "pass", "name": "All-access Pass 6 months", "phase": "P1", "duration_days": 183, "prices": {"BD": 449000, "A": 9900, "B": 5900, "C": 3900}, "allowances": {"ai_credits_per_30d": 10, "full_mocks_per_30d": 2, "ai_daily_cap": 4, "concurrent_devices": 2, "rollover": false, "money_back_days": 7}}
  - {"slug": "pass-12m", "kind": "pass", "name": "All-access Pass 12 months", "phase": "P1", "duration_days": 365, "prices": {"BD": 699000, "A": 14900, "B": 8900, "C": 5900}, "allowances": {"ai_credits_per_30d": 10, "full_mocks_per_30d": 2, "ai_daily_cap": 4, "concurrent_devices": 2, "rollover": false, "money_back_days": 7}}
  - {"slug": "ielts-writing-mastery", "kind": "course", "name": "IELTS Writing Mastery", "phase": "P1", "duration_days": 183, "prices": {"BD": 199000, "A": 4900, "B": 2499, "C": 1799}, "allowances": {"ai_credits": 12, "money_back_days": 7}}
  - {"slug": "ielts-speaking-mastery", "kind": "course", "name": "IELTS Speaking Mastery", "phase": "P1", "duration_days": 183, "prices": {"BD": 199000, "A": 4900, "B": 2499, "C": 1799}, "allowances": {"ai_credits": 12, "money_back_days": 7}}
  - {"slug": "ielts-lr-accelerator", "kind": "course", "name": "IELTS Listening & Reading Accelerator", "phase": "P1", "duration_days": 183, "prices": {"BD": 149000, "A": 3400, "B": 1999, "C": 1299}, "allowances": {"money_back_days": 7}}
  - {"slug": "ielts-writing-speaking-bundle", "kind": "bundle", "name": "Writing + Speaking Mastery bundle", "phase": "P1", "duration_days": 183, "prices": {"BD": 299000, "A": 5900, "B": 3900, "C": 2499}, "allowances": {"ai_credits": 24}}
  - {"slug": "ielts-crash-4w", "kind": "live_batch", "name": "IELTS Crash Course (4-week live)", "phase": "P1 pilot / P2", "duration_days": 120, "prices": {"BD": 749000, "A": 16900, "B": 9900, "C": 6900}, "allowances": {"live_classes": 16, "full_mocks": 4, "ai_credits": 10}}
  - {"slug": "ielts-mock-series", "kind": "test_pack", "name": "IELTS Mock Test Series (20 full mocks)", "phase": "P1", "duration_days": 183, "prices": {"BD": 299000, "A": 5900, "B": 3900, "C": 2499}, "allowances": {"full_mocks": 20}}
  - {"slug": "ielts-life-skills-a1", "kind": "course", "name": "IELTS Life Skills A1", "phase": "P2", "duration_days": 183, "prices": {"BD": 99000, "A": 2499, "B": 1299, "C": 899}, "allowances": {"ai_credits": 8, "money_back_days": 7}}
  - {"slug": "ielts-life-skills-b1", "kind": "course", "name": "IELTS Life Skills B1", "phase": "P2", "duration_days": 183, "prices": {"BD": 149000, "A": 3400, "B": 1999, "C": 1299}, "allowances": {"ai_credits": 12, "money_back_days": 7}}
  - {"slug": "ielts-live-batch-12w", "kind": "live_batch", "name": "IELTS Live Batch (12 weeks; regular, weekend or evening)", "phase": "P2 (pilot P1)", "duration_days": 365, "prices": {"BD": 999000, "A": 22900, "B": 12900, "C": 8900}, "allowances": {"live_classes": 36, "full_mocks": 4, "ai_credits": 10}}
  - {"slug": "eng-found-a0", "kind": "course", "name": "English Foundation A0 (Bangla-medium)", "phase": "P1", "duration_days": 365, "prices": {"BD": 29900, "A": 799, "B": 499, "C": 299}, "allowances": {"ai_credits": 6, "money_back_days": 7}}
  - {"slug": "eng-found-a1", "kind": "course", "name": "English Foundation A1", "phase": "P1", "duration_days": 365, "prices": {"BD": 49900, "A": 1199, "B": 799, "C": 499}, "allowances": {"ai_credits": 8, "money_back_days": 7}}
  - {"slug": "eng-found-a2", "kind": "course", "name": "English Foundation A2", "phase": "P1", "duration_days": 365, "prices": {"BD": 69900, "A": 1499, "B": 899, "C": 599}, "allowances": {"ai_credits": 10, "money_back_days": 7}}
  - {"slug": "eng-found-b1", "kind": "course", "name": "English Foundation B1", "phase": "P1", "duration_days": 365, "prices": {"BD": 99900, "A": 2499, "B": 1299, "C": 899}, "allowances": {"ai_credits": 14, "money_back_days": 7}}
  - {"slug": "eng-found-track", "kind": "bundle", "name": "English Foundation full track A0-B1", "phase": "P1", "duration_days": 365, "prices": {"BD": 199000, "A": 4900, "B": 2499, "C": 1799}, "allowances": {"ai_credits": 38}}
  - {"slug": "spoken-english-everyday", "kind": "course", "name": "Spoken English: Everyday", "phase": "P2", "duration_days": 183, "prices": {"BD": 149000, "A": 3400, "B": 1999, "C": 1299}, "allowances": {"ai_credits": 20, "money_back_days": 7}}
  - {"slug": "spoken-english-workplace", "kind": "course", "name": "Spoken English: Workplace", "phase": "P2", "duration_days": 183, "prices": {"BD": 249000, "A": 5900, "B": 3900, "C": 2499}, "allowances": {"ai_credits": 30, "money_back_days": 7}}
  - {"slug": "gre-verbal-booster", "kind": "course", "name": "GRE Verbal Booster", "phase": "P1", "duration_days": 183, "prices": {"BD": 249000, "A": 5900, "B": 3900, "C": 2499}, "allowances": {"ai_credits": 0, "money_back_days": 7}}
  - {"slug": "gre-quant-booster", "kind": "course", "name": "GRE Quant Booster", "phase": "P1", "duration_days": 183, "prices": {"BD": 249000, "A": 5900, "B": 3900, "C": 2499}, "allowances": {"money_back_days": 7}}
  - {"slug": "gre-awa-coaching", "kind": "course", "name": "GRE AWA Coaching", "phase": "P1", "duration_days": 183, "prices": {"BD": 149000, "A": 3400, "B": 1999, "C": 1299}, "allowances": {"ai_credits": 12, "money_back_days": 7}}
  - {"slug": "gre-vocab", "kind": "course", "name": "GRE Vocab Pro", "phase": "P1", "duration_days": 365, "prices": {"BD": 79000, "A": 1799, "B": 999, "C": 699}, "allowances": {"money_back_days": 7}}
  - {"slug": "gre-mock-series", "kind": "test_pack", "name": "GRE Mock Test Series (8 section-adaptive)", "phase": "P1", "duration_days": 183, "prices": {"BD": 199000, "A": 4900, "B": 2499, "C": 1799}, "allowances": {"full_mocks": 8}}
  - {"slug": "gre-live-batch-8w", "kind": "live_batch", "name": "GRE Live Batch (8 weeks)", "phase": "P2", "duration_days": 365, "prices": {"BD": 899000, "A": 19900, "B": 11900, "C": 7900}, "allowances": {"live_classes": 24, "full_mocks": 4}}
  - {"slug": "pte-sw-coaching", "kind": "course", "name": "PTE Speaking & Writing AI Coaching", "phase": "P2", "duration_days": 183, "prices": {"BD": 199000, "A": 4900, "B": 2499, "C": 1799}, "allowances": {"ai_credits": 12, "money_back_days": 7}}
  - {"slug": "pte-mock-series", "kind": "test_pack", "name": "PTE Mock Series (10)", "phase": "P2", "duration_days": 183, "prices": {"BD": 249000, "A": 5900, "B": 3900, "C": 2499}, "allowances": {"full_mocks": 10}}
  - {"slug": "det-sprint", "kind": "course", "name": "DET Sprint (2-week)", "phase": "P2", "duration_days": 60, "prices": {"BD": 149000, "A": 3400, "B": 1999, "C": 1299}, "allowances": {"full_mocks": 10, "money_back_days": 7}}
  - {"slug": "toefl-sw-coaching", "kind": "course", "name": "TOEFL Speaking & Writing AI Coaching", "phase": "P3", "duration_days": 183, "prices": {"BD": 199000, "A": 4900, "B": 2499, "C": 1799}, "allowances": {"ai_credits": 12, "money_back_days": 7}}
  - {"slug": "toefl-mock-series", "kind": "test_pack", "name": "TOEFL Mock Series (10)", "phase": "P3", "duration_days": 183, "prices": {"BD": 249000, "A": 5900, "B": 3900, "C": 2499}, "allowances": {"full_mocks": 10}}
  - {"slug": "eps-topik-starter", "kind": "course", "name": "EPS-TOPIK Starter (Hangul + survival Korean, Bangla-medium)", "phase": "P2", "duration_days": 365, "prices": {"BD": 99000, "A": 2499, "B": 1299, "C": 899}, "allowances": {"ai_credits": 10, "money_back_days": 7}}
  - {"slug": "eps-topik-prep", "kind": "course", "name": "EPS-TOPIK Exam Prep", "phase": "P2", "duration_days": 365, "prices": {"BD": 199000, "A": 4900, "B": 2499, "C": 1799}, "allowances": {"full_mocks": 8, "money_back_days": 7}}
  - {"slug": "eps-topik-complete", "kind": "bundle", "name": "EPS-TOPIK Complete", "phase": "P2", "duration_days": 365, "prices": {"BD": 249000, "A": 5900, "B": 3900, "C": 2499}}
  - {"slug": "jft-basic-starter", "kind": "course", "name": "JFT-Basic Starter (kana + A1 Japanese)", "phase": "P2", "duration_days": 365, "prices": {"BD": 99000, "A": 2499, "B": 1299, "C": 899}, "allowances": {"money_back_days": 7}}
  - {"slug": "jft-basic-prep", "kind": "course", "name": "JFT-Basic Exam Prep", "phase": "P2", "duration_days": 365, "prices": {"BD": 199000, "A": 4900, "B": 2499, "C": 1799}, "allowances": {"full_mocks": 8, "money_back_days": 7}}
  - {"slug": "jft-basic-complete", "kind": "bundle", "name": "JFT-Basic Complete", "phase": "P2", "duration_days": 365, "prices": {"BD": 249000, "A": 5900, "B": 3900, "C": 2499}}
  - {"slug": "tech-python-sql", "kind": "course", "name": "Python / SQL track", "phase": "P3", "duration_days": 365, "prices": {"BD": 249000, "A": 5900, "B": 3900, "C": 2499}, "allowances": {"money_back_days": 7}}
  - {"slug": "tech-networking", "kind": "course", "name": "Networking track", "phase": "P3", "duration_days": 365, "prices": {"BD": 299000, "A": 5900, "B": 3900, "C": 2499}, "allowances": {"money_back_days": 7}}
  - {"slug": "tech-genai", "kind": "course", "name": "GenAI track", "phase": "P3", "duration_days": 365, "prices": {"BD": 349000, "A": 7900, "B": 4900, "C": 2999}, "allowances": {"money_back_days": 7}}
  - {"slug": "tech-ml", "kind": "course", "name": "Machine Learning track", "phase": "P3", "duration_days": 365, "prices": {"BD": 399000, "A": 8900, "B": 4900, "C": 3400}, "allowances": {"money_back_days": 7}}
  - {"slug": "tech-dl", "kind": "course", "name": "Deep Learning track", "phase": "P3", "duration_days": 365, "prices": {"BD": 449000, "A": 9900, "B": 5900, "C": 3900}, "allowances": {"money_back_days": 7}}
  - {"slug": "tech-pass-12m", "kind": "pass", "name": "Tech Pass 12 months", "phase": "P3", "duration_days": 365, "prices": {"BD": 599000, "A": 14900, "B": 8900, "C": 5900}, "allowances": {"money_back_days": 7}}
  - {"slug": "univ-course-pack", "kind": "course", "name": "University course pack (per course; BD CSE syllabus)", "phase": "P3", "duration_days": 120, "prices": {"BD": 99000}, "allowances": {"money_back_days": 7}}
  - {"slug": "univ-semester-pack", "kind": "bundle", "name": "University semester pack", "phase": "P3", "duration_days": 183, "prices": {"BD": 249000}}
  - {"slug": "ai-credits-10", "kind": "ai_credits", "name": "AI credits x10", "phase": "P1", "duration_days": 365, "prices": {"BD": 59000, "A": 1199, "B": 799, "C": 499}, "allowances": {"ai_credits": 10}}
  - {"slug": "ai-credits-30", "kind": "ai_credits", "name": "AI credits x30", "phase": "P1", "duration_days": 365, "prices": {"BD": 149000, "A": 3400, "B": 1999, "C": 1299}, "allowances": {"ai_credits": 30}}
  - {"slug": "ai-credits-75", "kind": "ai_credits", "name": "AI credits x75", "phase": "P1", "duration_days": 365, "prices": {"BD": 299000, "A": 5900, "B": 3900, "C": 2499}, "allowances": {"ai_credits": 75}}
  - {"slug": "mock-pack-3", "kind": "test_pack", "name": "Mock pack x3", "phase": "P1", "duration_days": 365, "prices": {"BD": 69000, "A": 1499, "B": 899, "C": 599}, "allowances": {"full_mocks": 3}}
  - {"slug": "mock-pack-5", "kind": "test_pack", "name": "Mock pack x5", "phase": "P1", "duration_days": 365, "prices": {"BD": 99000, "A": 2499, "B": 1299, "C": 899}, "allowances": {"full_mocks": 5}}
  - {"slug": "mock-pack-10", "kind": "test_pack", "name": "Mock pack x10 (sold once 10 mocks are live, ~day 120)", "phase": "P1", "duration_days": 365, "prices": {"BD": 169000, "A": 3900, "B": 2499, "C": 1499}, "allowances": {"full_mocks": 10}}
  - {"slug": "human-essay-review-1", "kind": "ai_credits", "name": "Human essay review x1", "phase": "P1", "duration_days": 365, "prices": {"BD": 79000, "A": 1799, "B": 999, "C": 699}, "allowances": {"human_essay_reviews": 1}, "d5_extension": true}
  - {"slug": "human-essay-review-5", "kind": "ai_credits", "name": "Human essay review x5", "phase": "P1", "duration_days": 365, "prices": {"BD": 349000, "A": 7900, "B": 4900, "C": 2999}, "allowances": {"human_essay_reviews": 5}, "d5_extension": true}
  - {"slug": "human-essay-review-10", "kind": "ai_credits", "name": "Human essay review x10", "phase": "P1", "duration_days": 365, "prices": {"BD": 649000, "A": 14900, "B": 8900, "C": 5900}, "allowances": {"human_essay_reviews": 10}, "d5_extension": true}
  - {"slug": "human-speaking-mock-1", "kind": "ai_credits", "name": "Human speaking mock x1 (examiner-style, 12 min + 8 min feedback)", "phase": "P1", "duration_days": 365, "prices": {"BD": 129000, "A": 2999, "B": 1799, "C": 1199}, "allowances": {"human_speaking_mocks": 1}, "d5_extension": true}
  - {"slug": "human-speaking-mock-3", "kind": "ai_credits", "name": "Human speaking mock x3", "phase": "P1", "duration_days": 365, "prices": {"BD": 349000, "A": 7900, "B": 4900, "C": 2999}, "allowances": {"human_speaking_mocks": 3}, "d5_extension": true}
  - {"slug": "one-to-one-1", "kind": "ai_credits", "name": "1:1 mentor session x1 (45 min)", "phase": "P1", "duration_days": 365, "prices": {"BD": 249000, "A": 5900, "B": 3900, "C": 2499}, "allowances": {"one_to_one_45min": 1}, "d5_extension": true}
  - {"slug": "one-to-one-3", "kind": "ai_credits", "name": "1:1 mentor sessions x3", "phase": "P1", "duration_days": 365, "prices": {"BD": 649000, "A": 14900, "B": 8900, "C": 5900}, "allowances": {"one_to_one_45min": 3}, "d5_extension": true}
  - {"slug": "one-to-one-5", "kind": "ai_credits", "name": "1:1 mentor sessions x5", "phase": "P1", "duration_days": 365, "prices": {"BD": 999000, "A": 22900, "B": 12900, "C": 8900}, "allowances": {"one_to_one_45min": 5}, "d5_extension": true}
  - {"slug": "speaking-club-1", "kind": "ai_credits", "name": "Speaking Club slot x1 (45 min, max 6)", "phase": "P1", "duration_days": 90, "prices": {"BD": 39000, "A": 999, "B": 599, "C": 399}, "allowances": {"speaking_club_slots": 1}, "d5_extension": true}
  - {"slug": "speaking-club-4", "kind": "ai_credits", "name": "Speaking Club slots x4", "phase": "P1", "duration_days": 120, "prices": {"BD": 129000, "A": 2999, "B": 1799, "C": 1199}, "allowances": {"speaking_club_slots": 4}, "d5_extension": true}
  - {"slug": "extension-1m", "kind": "ai_credits", "name": "Course extension +1 month (Core/Plus)", "phase": "P1", "prices": {"BD": 49000, "A": 1199, "B": 799, "C": 499}, "allowances": {"extend_days": 30}, "d5_extension": true}
  - {"slug": "extension-3m", "kind": "ai_credits", "name": "Course extension +3 months (Core/Plus)", "phase": "P1", "prices": {"BD": 119000, "A": 2499, "B": 1499, "C": 999}, "allowances": {"extend_days": 91}, "d5_extension": true}
  - {"slug": "extension-live-3m", "kind": "ai_credits", "name": "Extension +3 months (Live/Mentor)", "phase": "P1", "prices": {"BD": 149000, "A": 3400, "B": 1999, "C": 1299}, "allowances": {"extend_days": 91}, "d5_extension": true}
  - {"slug": "certificate-digital-reissue", "kind": "ai_credits", "name": "Certificate digital re-issue (name change)", "phase": "P1", "prices": {"BD": 9900, "A": 299, "B": 199, "C": 99}, "d5_extension": true}
  - {"slug": "certificate-print", "kind": "physical_book", "name": "Certificate printed (A4 matte, folder), BD only", "phase": "P1", "prices": {"BD": 34900}, "d5_extension": true}
  - {"slug": "priority-grading-1", "kind": "ai_credits", "name": "Priority grading x1 (24 h instead of 72 h)", "phase": "P1", "prices": {"BD": 25000, "A": 799, "B": 499, "C": 299}, "allowances": {"priority_reviews": 1}, "d5_extension": true}
  - {"slug": "priority-grading-5", "kind": "ai_credits", "name": "Priority grading x5", "phase": "P1", "prices": {"BD": 99000, "A": 2499, "B": 1299, "C": 899}, "allowances": {"priority_reviews": 5}, "d5_extension": true}
  - {"slug": "book-ielts-academic-workbook", "kind": "physical_book", "name": "IELTS Academic Workbook (print)", "phase": "P1", "prices": {"BD": 79000}, "allowances": {"pages": 320}, "d5_extension": true}
  - {"slug": "pdf-ielts-academic-workbook", "kind": "bundle", "name": "IELTS Academic Workbook (PDF, watermarked)", "phase": "P1", "prices": {"BD": 39000, "A": 999, "B": 599, "C": 399}, "allowances": {"pages": 320, "watermark": true, "downloads": 5}}
  - {"slug": "book-ielts-gt-workbook", "kind": "physical_book", "name": "IELTS General Training Workbook (print)", "phase": "P1", "prices": {"BD": 69000}, "allowances": {"pages": 280}, "d5_extension": true}
  - {"slug": "pdf-ielts-gt-workbook", "kind": "bundle", "name": "IELTS General Training Workbook (PDF, watermarked)", "phase": "P1", "prices": {"BD": 34900, "A": 799, "B": 499, "C": 299}, "allowances": {"pages": 280, "watermark": true, "downloads": 5}}
  - {"slug": "book-ielts-writing-model-answers", "kind": "physical_book", "name": "IELTS Writing Model Answers (Task 1 + 2) (print)", "phase": "P1", "prices": {"BD": 49000}, "allowances": {"pages": 200}, "d5_extension": true}
  - {"slug": "pdf-ielts-writing-model-answers", "kind": "bundle", "name": "IELTS Writing Model Answers (Task 1 + 2) (PDF, watermarked)", "phase": "P1", "prices": {"BD": 24900, "A": 799, "B": 499, "C": 299}, "allowances": {"pages": 200, "watermark": true, "downloads": 5}}
  - {"slug": "book-ielts-speaking-cue-cards", "kind": "physical_book", "name": "IELTS Speaking Cue-Card Book (QR audio) (print)", "phase": "P1", "prices": {"BD": 39000}, "allowances": {"pages": 160}, "d5_extension": true}
  - {"slug": "pdf-ielts-speaking-cue-cards", "kind": "bundle", "name": "IELTS Speaking Cue-Card Book (QR audio) (PDF, watermarked)", "phase": "P1", "prices": {"BD": 19900, "A": 499, "B": 299, "C": 199}, "allowances": {"pages": 160, "watermark": true, "downloads": 5}}
  - {"slug": "book-ielts-vocabulary", "kind": "physical_book", "name": "IELTS Vocabulary by Topic (print)", "phase": "P1", "prices": {"BD": 49000}, "allowances": {"pages": 240}, "d5_extension": true}
  - {"slug": "pdf-ielts-vocabulary", "kind": "bundle", "name": "IELTS Vocabulary by Topic (PDF, watermarked)", "phase": "P1", "prices": {"BD": 24900, "A": 799, "B": 499, "C": 299}, "allowances": {"pages": 240, "watermark": true, "downloads": 5}}
  - {"slug": "book-gre-vocab-quant-formula", "kind": "physical_book", "name": "GRE Vocab and Quant Formula Book (print)", "phase": "P1", "prices": {"BD": 79000}, "allowances": {"pages": 280}, "d5_extension": true}
  - {"slug": "pdf-gre-vocab-quant-formula", "kind": "bundle", "name": "GRE Vocab and Quant Formula Book (PDF, watermarked)", "phase": "P1", "prices": {"BD": 39000, "A": 999, "B": 599, "C": 399}, "allowances": {"pages": 280, "watermark": true, "downloads": 5}}
  - {"slug": "book-ielts-mock-booklets", "kind": "physical_book", "name": "IELTS Mock Test Booklets (4 L/R/W papers) (print)", "phase": "P1", "prices": {"BD": 59000}, "allowances": {"pages": 240}, "d5_extension": true}
  - {"slug": "pdf-ielts-mock-booklets", "kind": "bundle", "name": "IELTS Mock Test Booklets (4 L/R/W papers) (PDF, watermarked)", "phase": "P1", "prices": {"BD": 29900, "A": 799, "B": 499, "C": 299}, "allowances": {"pages": 240, "watermark": true, "downloads": 5}}
  - {"slug": "book-eng-foundation-workbook-a1-a2", "kind": "physical_book", "name": "English Foundation Workbook A1-A2 (Bangla) (print)", "phase": "P1", "prices": {"BD": 29000}, "allowances": {"pages": 160}, "d5_extension": true}
  - {"slug": "pdf-eng-foundation-workbook-a1-a2", "kind": "bundle", "name": "English Foundation Workbook A1-A2 (Bangla) (PDF, watermarked)", "phase": "P1", "prices": {"BD": 14900, "A": 499, "B": 299, "C": 199}, "allowances": {"pages": 160, "watermark": true, "downloads": 5}}
  - {"slug": "book-kit-ielts-academic", "kind": "bundle", "name": "IELTS Academic Print Kit (workbook, model answers, cue cards, vocabulary, mock booklets)", "phase": "P1", "prices": {"BD": 199000}, "d5_extension": true}
  - {"slug": "book-kit-ielts-gt", "kind": "bundle", "name": "IELTS GT Print Kit", "phase": "P1", "prices": {"BD": 189000}, "d5_extension": true}
  - {"slug": "b2b-seat-3m-25to49", "kind": "org_seat_pack", "name": "B2B 3-month seat (25-49 seats)", "phase": "P2", "duration_days": 90, "prices": {"BD": 140000, "A": 2999, "B": 1799, "C": 1199}, "allowances": {"min_seats": 25, "half_allowances": false}}
  - {"slug": "b2b-seat-3m-50to99", "kind": "org_seat_pack", "name": "B2B 3-month seat (50-99 seats)", "phase": "P2", "duration_days": 90, "prices": {"BD": 125000, "A": 2999, "B": 1799, "C": 1199}, "allowances": {"min_seats": 50, "half_allowances": false}}
  - {"slug": "b2b-seat-3m-100to249", "kind": "org_seat_pack", "name": "B2B 3-month seat (100-249 seats)", "phase": "P2", "duration_days": 90, "prices": {"BD": 110000, "A": 2499, "B": 1499, "C": 999}, "allowances": {"min_seats": 100, "half_allowances": true}}
  - {"slug": "b2b-seat-3m-250plus", "kind": "org_seat_pack", "name": "B2B 3-month seat (250+ (floor) seats)", "phase": "P2", "duration_days": 90, "prices": {"BD": 95000, "A": 1999, "B": 1199, "C": 799}, "allowances": {"min_seats": 250, "half_allowances": true}}
  - {"slug": "b2b-seat-12m-25to49", "kind": "org_seat_pack", "name": "B2B 12-month seat (25-49 seats)", "phase": "P2", "duration_days": 365, "prices": {"BD": 360000, "A": 8900, "B": 4900, "C": 3400}, "allowances": {"min_seats": 25, "half_allowances": false}}
  - {"slug": "b2b-seat-12m-50to99", "kind": "org_seat_pack", "name": "B2B 12-month seat (50-99 seats)", "phase": "P2", "duration_days": 365, "prices": {"BD": 320000, "A": 7900, "B": 4900, "C": 2999}, "allowances": {"min_seats": 50, "half_allowances": false}}
  - {"slug": "b2b-seat-12m-100to499", "kind": "org_seat_pack", "name": "B2B 12-month seat (100-499 seats)", "phase": "P2", "duration_days": 365, "prices": {"BD": 280000, "A": 5900, "B": 3900, "C": 2499}, "allowances": {"min_seats": 100, "half_allowances": true}}
  - {"slug": "b2b-seat-12m-500to1999", "kind": "org_seat_pack", "name": "B2B 12-month seat (500-1,999 (university) seats)", "phase": "P2", "duration_days": 365, "prices": {"BD": 200000, "A": 4900, "B": 2499, "C": 1799}, "allowances": {"min_seats": 500, "half_allowances": true}}
  - {"slug": "b2b-seat-12m-2000plus", "kind": "org_seat_pack", "name": "B2B 12-month seat (2,000+ (floor) seats)", "phase": "P2", "duration_days": 365, "prices": {"BD": 150000, "A": 3400, "B": 1999, "C": 1299}, "allowances": {"min_seats": 2000, "half_allowances": true}}
  - {"slug": "adm-essay-feedback", "kind": "service", "name": "Common App essay feedback (1 essay, 2 rounds; feedback only)", "phase": "P2", "duration_days": 365, "prices": {"BD": 299000, "A": 5900, "B": 3900, "C": 2499}, "d5_extension": true}
  - {"slug": "adm-essay-studio", "kind": "service", "name": "Essay Studio (3 essays, 2 rounds each)", "phase": "P2", "duration_days": 365, "prices": {"BD": 799000, "A": 16900, "B": 9900, "C": 6900}, "d5_extension": true}
  - {"slug": "adm-college-list", "kind": "service", "name": "College list builder (15 schools + 45-min consult)", "phase": "P2", "duration_days": 365, "prices": {"BD": 399000, "A": 8900, "B": 4900, "C": 3400}, "d5_extension": true}
  - {"slug": "adm-application-review", "kind": "service", "name": "Full application review (activities, honors, additional info, consistency)", "phase": "P2", "duration_days": 365, "prices": {"BD": 549000, "A": 11900, "B": 6900, "C": 4900}, "d5_extension": true}
  - {"slug": "adm-sop-review", "kind": "service", "name": "SOP review (1 draft, 2 rounds)", "phase": "P2", "duration_days": 365, "prices": {"BD": 279000, "A": 5900, "B": 3900, "C": 2499}, "d5_extension": true}
  - {"slug": "adm-cv-review", "kind": "service", "name": "CV / resume review", "phase": "P2", "duration_days": 365, "prices": {"BD": 159000, "A": 3900, "B": 2499, "C": 1499}, "d5_extension": true}
  - {"slug": "adm-sop-cv", "kind": "service", "name": "SOP + CV review bundle", "phase": "P2", "duration_days": 365, "prices": {"BD": 399000, "A": 8900, "B": 4900, "C": 3400}, "d5_extension": true}
  - {"slug": "adm-scholarship-guidance", "kind": "service", "name": "Scholarship guidance (shortlist, plan, 1 essay review)", "phase": "P2", "duration_days": 365, "prices": {"BD": 379000, "A": 8900, "B": 4900, "C": 3400}, "d5_extension": true}
  - {"slug": "adm-interview-prep", "kind": "service", "name": "Interview prep (45-min mock + written feedback)", "phase": "P2", "duration_days": 365, "prices": {"BD": 279000, "A": 5900, "B": 3900, "C": 2499}, "d5_extension": true}
  - {"slug": "adm-apply-ready", "kind": "service", "name": "Apply Ready bundle (list + Essay Studio + full review + SOP)", "phase": "P2", "duration_days": 365, "prices": {"BD": 1699000, "A": 34900, "B": 22900, "C": 14900}, "d5_extension": true}
  - {"slug": "b2b-corporate-english", "kind": "org_seat_pack", "name": "Corporate English per employee per month (min 50 seats, annual)", "phase": "P2", "duration_days": 30, "prices": {"BD": 45000, "A": 999, "B": 599, "C": 399}, "allowances": {"min_seats": 50, "billing": "monthly_annual_contract"}}
  - {"slug": "b2b-whitelabel-setup", "kind": "org_seat_pack", "name": "White-label Mock Hub setup (one-time, up to 10 imported mocks)", "phase": "P2", "prices": {"BD": 7500000, "A": 199900, "B": 99900, "C": 69900}, "allowances": {"one_time": true}}
  - {"slug": "b2b-whitelabel-monthly", "kind": "org_seat_pack", "name": "White-label Mock Hub platform fee per month (up to 300 active learners)", "phase": "P2", "duration_days": 30, "prices": {"BD": 1500000, "A": 29900, "B": 19900, "C": 12900}, "allowances": {"max_active_learners": 300}}
  - {"slug": "bundle-ielts-academic-core-workbook", "kind": "bundle", "name": "IELTS Academic Core + printed Workbook", "phase": "P1", "prices": {"BD": 459000}, "d5_extension": true}
  - {"slug": "bundle-ielts-gt-core-workbook", "kind": "bundle", "name": "IELTS GT Core + printed Workbook", "phase": "P1", "prices": {"BD": 409000}, "d5_extension": true}
  - {"slug": "bundle-gre-core-formula-book", "kind": "bundle", "name": "GRE Core + printed Vocab & Quant Formula Book", "phase": "P1", "prices": {"BD": 659000}, "d5_extension": true}
```
<!-- SEED:END -->

---

## 14. Assumption register and open items

| ID | Assumption | Status / how to replace |
|---|---|---|
| A1 / A18 | FX 120; BD prices VAT-inclusive 15% | 02; tax adviser |
| A4 | Merchant of record 5% + $0.50 | unverified; Paddle onboarding |
| A8 | Human essay review BDT 300 all-in (piece rate 150-250 per 18 + QA sampling) | quotes from 5-10 graders |
| A9 | Human speaking mock BDT 450; mentor session BDT 1,200 per 45 min; club host BDT 750 per 45 min | 18 §4.5 upper bounds; quotes |
| A12 | Teacher blend BDT 2,500 per 90-min session incl. prep credit (weekend 150-min: 3,750) | 18 §4.5; quotes |
| A13 | TA/moderator BDT 36,000 per 12-week batch (500/h x 54 h + 9,000 chat) | 18 |
| A14 | Weekly Q&A BDT 1,500 per 60 min, 150 learners per pool | ops |
| A15 | AI Tutor BDT 0.25/message; Core P90 400 msgs, Plus P90 1,000 msgs | measure; 34-AI-LEARNING-FEATURES |
| A16 | Study guides/mind maps/audio BDT 30 per learner (cached per lesson) | measure |
| A17 | Target Promise: 20% claims x BDT 150 | measure |
| A18 | Progress Promise: 10% claims x Live marginal cost | measure |
| A19 | AI allowance utilisation ~60% | measure in first 90 days |
| A20 | Print costs (offset 0.60/page, digital 1.60/page, covers, binding) | 3 written quotes |
| A21 | VAT on printed books (assumed 15%-inclusive; may be exempt) | tax adviser |
| A22 | Steadfast delivery BDT 60 Dhaka / 115 outside (1% COD verified) | steadfast.com.bd/pricing |
| A23 | Rokomari/marketplace commission 40% of MRP | partner terms |
| A24 | KDP print cost formula | KDP calculator |
| A25 | Scholarship income threshold BDT 30,000/month | pilot with 2 NGO partners |
| A26 | Legality of gender-/status-based public discounts | lawyer |
| A27 | B2B bank cost 1%, sales commission 8% | contracts |
| A28 | Admissions reviewer BDT 750-1,000/h | quotes |
| Resolved 2026-11-07 (00 D5 extended; 18 Mentor fixed to 3 × 1:1) | D5 lacked kinds for physical books, services and human-delivered credits (rows flagged `d5_extension`); 18 should say 3 x 45-min 1:1 in Mentor (not 6); 18 batch counts (36 sessions) are adopted here; 02 §11 Live seats at BDT 8,900 are now BDT 9,990 (upside, ARPU note in 02 §7.2). Competitors' current IELTS prices (10MS online, Mentors online) remain unverified. |
