# 20 — International Marketing Playbook (English-only): Lumen Academy (placeholder brand)

> Status: draft v1, 2026-11-07. Counterpart of `19-MARKETING-BANGLADESH.md` (final; the §10 mirror table cites 19's real section numbers, and 19 §10 cites this doc's real sections).
> Conforms to `00-DECISIONS.md` (D2 locales/hreflang, D3 Paddle-first MoR, D5 international auto-renew, D6 "estimated" labels, D10 tiers + PPP regions A/B/C). Prices are **not** defined here: canonical prices live in `17-PRICING-MASTER.md` (v1, final: tier matrix §2.1, passes §5, B2B §9, student/PPP §8, referrals §11). Where this doc quotes a dollar figure it is copied from 17 and marked "17 §x"; the earlier 02 §7.2 USD book is superseded. "Complete" is retired and means **Core** (D10 naming note); the buyable unit is *family × tier*, e.g. "IELTS Academic — Core". Tier names: Free / Core / Plus / Live / Mentor.
> Evidence tags: **[V]** verified in a research note or a source fetched while writing; **[S]** secondary/weak source; **[A]** assumption (my estimate, to be tested); **[U]** unverified, check before relying. Weak facts are flagged inline and collected in section 11 (§11).

---

## 0. Executive summary

1. **The test-for-study pool is shrinking; do not build the plan on IELTS-for-students growth.** IDP Language Testing volume fell 8% in FY26 and IDP's own planning assumes a further 20–30% fall in market volume for FY27 **[V: IDP FY26 release, via marketing_international_gapfill.md §A1]**. India fell about 50% in FY25 **[S: Lingobright summary]**. Plan for a smaller, more fragmented, more test-agnostic market.
2. **Position as "the most honest, most faithful mock-test platform"**: interface-faithful CBT mocks, published AI-scoring accuracy against certified-examiner marks, one honest price list, no guaranteed-score claims. This is a gap in the market: most AI IELTS apps publish no accuracy evidence and several have hidden or inconsistent pricing **[V: global_test_prep_competitors.md §3, §6]**.
3. **Organic-first.** Cold paid acquisition does not pay back at list prices in region A (see §8.3 arithmetic); it can work only on a free-diagnostic offer in region C/B via Meta/YouTube, and for retargeting. Core engines: SEO (free tools + programmatic pages with quality guardrails), a teacher-led English YouTube channel, creators/affiliates, and B2B (schools, recruiters, pre-sessional programmes).
4. **Resilient demand pockets** (migration points-tested routes to Canada/Australia, nursing/OET/IELTS, Gulf expats, spouse/family routes, GRE for Europe/Asia/US grad study) matter more than the headline student-visa market.
5. **Pricing:** 17 sets the USD book per region (IELTS Academic Core A $89 / B $49 / C $34; Plus $149 / $89 / $59). Regions are price overrides via Paddle (country-level `unit_price_overrides`) **[V: Paddle docs]**. The earlier BD-vs-Region-C conflict is **resolved by D12 C25**: region C is always >= the BD price converted at BDT 120 per USD (BDT 3,990 = $33.25 < $34), B ≈ 1.5× C, A ≈ 2.5× C (§5.2).
6. **Budget:** small, staged, gated (§8). Year-1 international paid-media test ≈ $12k **[A]**, mostly region B/C and retargeting; the rest is time, content and variable commissions.

---

## 1. Market reality and target-country priority

### 1.1 What the evidence says

| Signal | Evidence | Tag | So what |
|---|---|---|---|
| IDP Language Testing volume −8% in FY26 (year to 30 Jun 2026); yield +7% | IDP FY26 release | V | Fewer test-takers; incumbents monetising harder per head |
| IDP FY27 planning assumes −20% to −30% market volume vs FY26 | same | V (company planning assumption, not a forecast of record) | Do not assume volume growth; unit economics must survive a 30% smaller funnel |
| IDP cut IELTS venues from ~1,500 to <600, moving to third-party delivery | same | V | Test-centre scarcity creates "any test, any format" demand and anxiety |
| IDP FY25 English Language Testing volume 1,293,800 (−18% from 1,584,100); covers all test types | Lingobright summary of IDP results | S | Direction only |
| British Council: 2.3M IELTS tests in 12 months to 31 Mar 2025 (periods overlap with IDP; cannot be added) | Lingobright citing BC annual report | S | Order of magnitude of the IELTS universe |
| India −50% FY25, −27% H1 FY26; ex-India +2% FY25, +1% H1 FY26 | Lingobright citing IDP | S | The collapse is India-centred (study-visa applications to AU/UK/CA fell 29% per the same source), not global |
| Growth markets FY25: Australia, Canada, Vietnam, Kazakhstan, Uzbekistan; H1 FY26: Canada, Australia, Indonesia, Kazakhstan, Thailand. British Council: weaker Sub-Saharan Africa and South Asia, China growth | same | S | Vietnam/Indonesia/Thailand are real growth signals; Africa/South Asia soft |
| Canada Express Entry: CLB 7 for FSW (= IELTS **General Training** 6.0 each band, CELPIP 7, PTE Core 60/60/69/68); IELTS Academic not accepted | Immigration2Canada | S (verify on IRCC) | A test-agnostic Canada track |
| UK Skilled Worker (incl. Health and Care) B2 for first applications from 8 Jan 2026; overseas care-worker recruitment closed 22 Jul 2025 | Gherson / Davidson Morris | S (law-firm pages; verify gov.uk) | UK care-worker pitch is dead; B2 raises the bar for remaining skilled routes |
| UK dependants/settlement English thresholds: partly proposed, sources inconsistent | Tarve | S, weak | Do **not** state family-route levels in copy until verified on gov.uk |
| NMC accepts Academic IELTS and OET; two-test combination allowed since Jan 2023 (writing 6.0 / C, others 6.5 / C+) | NMC blog Oct 2022 | S (2022; later change possible, verify) | Nursing is a live, test-specific niche |
| Fraud environment in South Asia (fake IELTS papers, "leaked" papers, consultancy scams) | Dhaka Tribune, Financial Express, TBS headlines | S (headlines only) | "Original content, no leaks" is a trust asset, esp. region C |

**Missing data (do not invent):** no per-country IELTS/PTE/DET test-taker counts for Pakistan, Nepal, Nigeria, Philippines, Vietnam, Gulf, etc.; no PTE/DET volume figures; no keyword volumes or CPCs. Section 8 schedules a one-week data sprint (Ahrefs/Semrush free tools, Google Keyword Planner, IELTS.org statistics page, Pearson/Duolingo reports) before committing money.

### 1.2 Strategic consequences

1. **Test-agnostic, not IELTS-only.** Launch assets are IELTS Academic/GT and GRE (P1). PTE and DET arrive in P2; from day one the *site* answers "which test should I take" (comparison guides, "accepted by" checkers) so we capture demand that migrates between tests. TOEFL is later (not researched; **[U]**).
2. **Follow resilient intent, not volume.** Migration (Canada CLB 7, Australia skilled), nursing, Gulf-based professionals, spouse/family routes, and students to Europe/Asia/US (GRE) are less sensitive to Anglosphere student-visa caps than the "IELTS for UK/AU/CA study" pool.
3. **Rely on the shrinking-centre dynamic.** Fewer centres and more third-party delivery (IDP) means computer-delivered format familiarity and "book early" guidance are useful content.
4. **Plan for volatility.** Treat any single-country channel as perishable; keep a rolling "country scorecard" (§8.5) and reallocate quarterly.

### 1.3 Target-country priority list

Scoring: demand resilience (R), reachability in English (E), willingness/ability to pay at Region B/C prices (P), payment/MoR feasibility (M), competitive intensity (C, lower is better). H/M/L are my judgements **[A]**, not measured. Region = D10 PPP region.

| Tier | Country | Region | Rationale | R | E | P | M | Main segments | Risks / flags |
|---|---|---|---|---|---|---|---|---|---|
| **1 — launch focus** | **Pakistan** | C | Large English-literate young population, heavy IELTS/PTE/GRE use for Gulf, UK, Canada, US; cultural and time-zone proximity to Bangladesh playbook (shared Urdu/Bangla diaspora media). **[A]** | M | H | L–M | M | Students, skilled migrants, nurses | Payment methods (cards limited, many pay via local wallets/bank); verify Paddle coverage; political/currency volatility |
| | **Nepal** | C | Large study-abroad outflow to Australia, Canada, UK, Japan; heavy coaching-centre culture; English-medium schools. **[A]** | M | H | L | M | Students, agents/consultancies | Student-visa dependent (exposed to the same caps that hit India); agents dominate; small absolute size |
| | **Sri Lanka** | C | High English literacy, strong nursing/skilled outflow, IELTS/OET demand. **[A]** | M | H | M | M | Nurses, skilled migrants, students | Small market; post-crisis emigration spike may fade **[U]** |
| | **Nigeria** | C | Large English-speaking population; heavy UK/Canada/US outflow incl. nurses and students; mobile-first. **[A]** | M | H | L–M | L–M | Students, nurses, skilled migrants | Card acceptance/forex limits; fraud; British Council reports weaker Sub-Saharan Africa volumes **[S]**; UK care-visa closure hit demand |
| | **Philippines** | C | Nurses (NMC/OET/IELTS), seafarers/OFWs, Gulf/Canada/Australia routes; English-native audience. **[A]** | H | H | M | M | Nurses and health professionals, skilled migrants | Strong local competitors; wallet-heavy payments (GCash, Maya) likely not available via MoR **[U]** |
| | **Vietnam** | C/B | Named an IELTS growth market in FY25 **[S]**; large student outflow; Prep (competitor) is Vietnam-origin (see competitor note) and strong locally | H | M | M | M | Students | English-only site is a handicap; local incumbents; consider a later Vietnamese landing layer (out of scope per "English-only") |
| **2 — test and learn** | **Gulf expat communities (UAE, Saudi, Qatar, Kuwait, Oman, Bahrain)** | A (per D10) | Large South-Asian/Filipino/African expat workforce; **high ability to pay**, English-first, migration onward to Canada/Australia/UK, spouse routes, nurses. **[A]** | H | H | H | H | Skilled migrants, nurses, family-visa | Paddle lists UAE with USD, tax-inclusive **[V]**; target by diaspora identity not by country (e.g. "Pakistani nurse in Dubai"); consumer-protection and ad rules differ |
| | **Ghana, Kenya** | C | English-speaking, nurse/skilled/student outflow; mobile money culture. **[A]** | M | H | L | L–M | Nurses, students | Smaller markets; mobile-money not supported by MoR **[U]** |
| | **Indian diaspora outside India (Canada, UK, UAE, Singapore, Australia)** | A | Reachable in English, high ability to pay, family/spouse and skilled routes (Canada CLB 7, UK B2); avoids the India-resident volume collapse. **[A]** | M | H | H | H | Skilled migrants, family-visa | Targeting by ethnicity in ads is restricted by platform policy; target by interest/language/behaviour, not protected attributes (see §9) |
| | **UK/Canada-based migrants (family routes, status changes)** | A | Spouse/dependant English thresholds, settlement B2 changes, CLB for PR/citizenship | M–H | H | H | H | Family-visa applicants, skilled migrants | UK rule detail unverified **[S]**: copy must send users to gov.uk for thresholds |
| **3 — opportunistic / later** | India (resident) | B/C | Volume collapsed (−50% FY25) **[S]** but still the largest pool; Coursera cut India prices up to 60% **[S]**, signalling price sensitivity | L–M | H | L | M | GRE, general | Highly competitive; GRE-first only; do not spend until organic proof |
| | Malaysia, Türkiye, Latin America (Brazil, Mexico, Colombia) | B | Upper-middle-income; PTE/IELTS/TOEFL for study and relocation. **[A]** | M | L–M (English-only is a handicap) | M–H | H (Pix/other methods exist in Paddle list **[V]**) | Students, professionals | Needs local-language content to win; defer |
| | Indonesia, Thailand, Kazakhstan, Uzbekistan | B/C | IELTS growth markets H1 FY26 **[S]** | H | L–M | M | M | Students | English-only limits reach; test only through SEO and YouTube English audience |
| | China, Iran | — | Large test-taker pools **[S]** | — | — | — | — | — | **Out of scope:** sanctions/payments (Iran), language/regulatory (China). Paddle blocks unsupported/sanctioned countries **[V]** |

**Assumption flag:** this table is a hypothesis list. The 1-week data sprint (§8) replaces the H/M/L columns with measured search-volume, YouTube-audience and CPC data before spend is committed.

---

## 2. Positioning and brand (English)

### 2.1 Positioning statement

> For people preparing for IELTS, GRE and other English-proficiency or admissions tests, Lumen Academy is the practice platform that is **most faithful to the real test and most honest about your score**: computer-delivered mocks that behave like the real interface, AI feedback whose accuracy we publish, and one price list with no fake discounts.

Brand traits (aligned to D8): calm, precise, generous. Never hype-driven, never "guaranteed band" language.

### 2.2 Message pillars

| # | Pillar | Proof we must have before using it | Example copy |
|---|---|---|---|
| 1 | **Faithful mocks** | Test-engine fidelity audit (07): section timers server-side (D6), CBT layout, GRE section-level adaptivity, original (never scraped) content | "Practice in an interface that behaves like test day: same timing rules, same section flow. Original questions, never leaked papers." |
| 2 | **Honest AI scoring** | Published validation page: agreement with certified examiner marks (exact / within 0.5 band, by criterion), sample size, known weak spots (unconventional essays, accents). Target: publish by launch week 2 (02 §9.3 L2) | "Our AI estimates your band. Here is how close it gets to certified examiners, where it's weaker, and why you should treat it as an estimate." |
| 3 | **Transparent pricing** | One price list, no struck-through "was" prices (02 §7.1 #4), published refund rule (7 days if <20% consumed) | "One price. No countdown timers. No fake 70% off." |
| 4 | **Original content, no leaks** | Content provenance policy (content_sources_production) | "Every question is written or licensed by us. We don't sell 'leaked' papers, and we'll tell you if anyone does." |
| 5 | **Any test, any route** | PTE/DET (P2), CLB/B2 guides | "IELTS, PTE or Duolingo? Check what your university or visa accepts, then practise for the one you choose." |

### 2.3 Competitor value comparison (for messaging, not for ads naming competitors without legal review)

| Competitor | What they sell (Nov 2026 per notes) | Where Lumen can credibly differ | Caution |
|---|---|---|---|
| Magoosh (GRE, plus others) | GRE Premium $149 (1 mo) / $179 (6 mo) / $219 with admissions; 7-day money-back; score-improvement guarantee with 4 conditions **[V via Katalyst/Magoosh]** | GRE Core at $149 (A) / $89 (B) / $59 (C) for 6 months and GRE Plus $199 / $119 / $79 (17 §2.1), with AI-scored AWA, a 7-day no-questions money-back on every self-paced product (D12 C13b) and a **Plus Target Promise** (free 3-month extension if the target is not met, conditions published; never a cash score guarantee). Magoosh's headline guarantee is the closest competitor offer, so our guarantee page must be as plain as theirs | Magoosh is highly trusted (reported Trustpilot 4.8/5, 600+ reviews, competitor-cited **[S]**); don't attack, compare facts only |
| E2Language | ~$69 (90 days) to $359 (365 days) IELTS Academic; video lessons + live classes + graded mocks **[S: learnenglish.life]** | Cheaper entry, AI feedback on demand, published accuracy | E2Language is a teacher-brand (Jay-style personal channel); we cannot out-teach a personality with a faceless brand: we need our own teacher persona (§5.2) |
| Prep (prepedu) | Free = 1 Speaking + 1 Writing/month with AI feedback; paid tiers by credits; US$7M Series A Jan 2026, 1M+ learners, 21 countries, IELTS/TOEIC **[V: release; amounts not captured]** | All four skills + GRE under one subscription, English-first accuracy transparency | Well-funded, Asia-strong: avoid head-on fights in Vietnam; they say their scores are for tracking, not prediction **[V]** |
| PrepEx / Stimuler / TestGlider / IELTSpeaking / Cathoven | $1.99/week to $29.99/month AI IELTS apps; no accuracy evidence; hidden/inconsistent in-app prices **[V: AI Tools Bakery]** | Publish accuracy; one price list | Cheap-subscription band is crowded; price is not our wedge, trust is |
| British Council IELTS Ready / Premium | Free Mini Mock + 2 full mocks; Premium free only if you book with BC **[V]** | Available to anyone, any test centre; AI feedback beyond BC's | Official-brand free offer sets expectations; don't position as "official" |
| ETS ScoreItNow | $20 for two GRE AWA topics, e-rater scored **[V]** | Our AWA evaluation bundled in GRE Core (6 AWA credits) / GRE Plus (20) and sold as credit packs (10 credits $11.99 A / $7.99 B / $4.99 C, 17 §4; GRE AWA Coaching course $34 / $19.99 / $12.99) | Be precise: ETS uses automated scoring too |

### 2.4 Published AI-scoring accuracy: how to make it credible

- **What to publish:** per-criterion and overall agreement between our AI score and the mean of ≥2 certified human raters; share within 0.5 band, exact match share, bias direction (over/under-scoring at high bands, because public data show competitors overscore at the high end **[S]**), sample size, rater qualifications, test-set date, and known failure modes.
- **What not to publish:** anything we cannot back. Competitor claims range from 98% within 0.5 band (Cathoven, own page) down to 75–80% for AI tools generally, and 50% for an open model **[S: AI Tools Bakery]**; our number must come from our own labelled set.
- **Labelling:** all scores "estimated" (D6); a visible "limits of AI scoring" box. Note IDP states official Writing/Speaking are human-marked and advises against LLM grading **[S]**; we answer with transparency and an optional human review (Plus/Live tiers), not by denying the point.
- **Dependency:** needs the first ~100–300 labelled essays (02 §9.3 L10 calibration). **If the data is not ready, do not launch the claim**; launch with "validation in progress, here's the protocol" instead. [A]

### 2.5 Trademark-safe naming (see §9)
Never use IELTS, GRE, TOEFL, PTE, Duolingo, OET, CELPIP as brand, domain, handle or **ad keywords**. Nominative use in page copy only, with disclaimer.

---

## 3. Segment playbooks

Common rules: free diagnostic first; estimated band shown only after sign-up; no guaranteed-score or guaranteed-visa language; refund terms visible; under-18s get no marketing (D7).

### 3.1 Students (undergraduate / postgraduate applicants; IELTS Academic, PTE, DET, GRE)

| Item | Playbook |
|---|---|
| **Needs** | Target band/score by deadline; test-date logistics; speaking/writing feedback; proof the mock matches the real test; budget (test fee is already $200+ in many countries; BD fee BDT 31,100 per IDP page **[V]**) |
| **Offer** | Free tier (diagnostic, 1 sectional mock, 1 AI writing eval/month, D10) → Core (17 §2.1: IELTS Academic $89 A / $49 B / $34 C; GT $79 / $49 / $29.99) → Plus (AI coach, 2 human essay reviews, weekly live Q&A; $149 / $89 / $59) → pass for multi-test learners (3-month $59 / $39 / $24.99). Deadline-driven "intake sprint" bundles (8-week plans) |
| **Channels** | SEO (band calculators, Task 2 samples), YouTube (teacher persona), Reddit/Quora value-first, TikTok/Reels, student creators/affiliates, university pre-sessional partnerships, Discord study rooms |
| **Hook content** | "Is your Task 2 a 6.5 or a 7?" (free scored sample), "Which test does my university accept?", test-day checklists |
| **KPIs** | Free-diagnostic completion rate; sign-up → first full mock (activation, target 35% [A]); first AI eval within 7 days; sign-up → paid in 30 days (target 3%, from 02 A9 [A]); 30-day refund rate (<6% [A]) |
| **Risks** | Student-visa policy shocks (see §1); minors (no marketing under 18) |

### 3.2 Skilled migrants (Canada Express Entry, Australia skilled, UK Skilled Worker, NZ)

| Item | Playbook |
|---|---|
| **Needs** | A specific threshold, fast: Canada CLB 7 (IELTS GT 6.0 each; CELPIP 7; PTE Core) **[S]**; UK B2 for new Skilled Worker applications from 8 Jan 2026 **[S]**; speaking and writing are the typical gaps; tight timelines; often working full-time (evenings/weekends); wants a retake strategy |
| **Offer** | Test-agnostic "CLB 7 Track" and "B2 Track" built on IELTS GT/PTE Core-style mocks; IELTS Writing + Speaking Mastery bundle (17 §3.1: $59 A / $39 B / $24.99 C) emphasised; 3-month pass; 4-week crash plan |
| **Channels** | SEO on "CLB to IELTS score", "IELTS General Training sample letter", YouTube explainers, diaspora communities (Facebook/WhatsApp groups in permitted ways), immigration-consultant partnerships (RCIC / MARA / OISC-regulated advisers), email lifecycle |
| **Guardrails** | Always link to IRCC / gov.uk / Home Affairs for thresholds; never advise on eligibility or visa strategy (unauthorised practice of immigration advice, see §9) |
| **KPIs** | Calculator → sign-up conversion; mock completions per week; "target-met" self-reported rate (survey, not a guarantee); referral rate from consultant partners |

### 3.3 Nurses and health professionals (NMC/OET/IELTS; Philippines, Nigeria, Ghana, Sri Lanka, India diaspora, Gulf)

| Item | Playbook |
|---|---|
| **Needs** | Meet regulator score profile (NMC: IELTS Academic 6.5 per skill with writing 6.0 in the combined option **[S, 2022: verify]**; OET C+/B per sub-test depending on regulator); healthcare-specific writing (referral letters) and role-play speaking |
| **Offer** | Phase 1: IELTS Academic with healthcare vocabulary/speaking contexts; Phase 2 (P2+): **OET track** (subject to licensing/permissions **[U]**: OET is owned by Cambridge Boxhill Language Assessment; check trademark and content rules before building) |
| **Channels** | Nurse-led YouTube/TikTok creators, nursing-school and recruiter partnerships, Facebook/LinkedIn nurse groups (follow group rules), SEO for "NMC IELTS requirements" |
| **KPIs** | Recruiter-partner seat sales; completion rates for 4-week plan; speaking-test uptake |
| **Risk** | Regulator rules change; always cite the regulator page and date |

### 3.4 Family-visa applicants (UK partner/parent routes, Canada spousal, Australia partner)

| Item | Playbook |
|---|---|
| **Needs** | Lower-level (A1–B1) or CLB 4–5 tests; older learners, lower digital literacy, often female and home-based; high anxiety about test failure |
| **Offer** | "First-time test taker" low-pressure course; low-level speaking drill; family co-pay (guardian role, D4); regional pricing. **Do not sell until the test names/levels are verified**: UK family-route English thresholds are inconsistently reported in our sources **[S]**; IELTS Life Skills A1/B1 is sold in Bangladesh (BDT 24,750 **[V: IDP BD]**) but status in UK rules post-2026 is **[U]** |
| **Channels** | UK/Canada diaspora community pages and creators, charities/settlement organisations (partner, not pay), SEO for "A1 speaking test practice" |
| **KPIs** | Completion of the first speaking drill; support contact rate (expected high); NPS |
| **Priority** | P2. Build content only after verifying thresholds with gov.uk/IRCC primary pages |

### 3.5 GRE aspirants

| Item | Playbook |
|---|---|
| **Needs** | Quant/Verbal practice that mirrors section-level adaptivity; AWA feedback; vocab; competitive prices (GregMat $11.99/mo, Magoosh $179/6 mo, TTP $499/6 mo, ScoreItNow $20 per 2 essays **[V]**) |
| **Offer** | GRE Core $149 A / $89 B / $59 C (17 §2.1); Verbal/Quant boosters ($59 / $39 / $24.99 each); AWA credits; free diagnostic and vocab decks |
| **Channels** | SEO (vocab lists, "GRE score to percentile", AWA samples), YouTube (strategy and problem walkthroughs), r/GRE (check rules separately **[U]**), GregMat-style free-resources funnel, university-club partnerships, affiliates |
| **KPIs** | Diagnostic → sign-up; AWA submissions; 6-month course purchase conversion; cross-sell to Pass |
| **Note** | GRE demand is tied to grad admissions in US/Canada/Europe/Asia; India resident pool is price-sensitive (Coursera India −60% signal **[S]**) |

### 3.6 Institutions and agents (language schools, coaching centres, nursing recruiters, universities' pre-sessional programmes, study-abroad agents)

| Item | Playbook |
|---|---|
| **Needs** | Custom/mock content upload, cohort analytics, proctoring-lite, white-label-ish reporting; affordable per-seat; trust (agents want leads, schools want completion) |
| **Offer** | B2B seat packs per 17 §9 (3-month seat, 25-49 seats: $29.99 A / $17.99 B / $11.99 C; 12-month seat 25-49: $89 / $49 / $34; larger bands lower); minimum 25 seats; pilots with 3 institutions; agent referral (non-exclusive, disclosed commission, no under-18 data sharing; 02 §7.4 #4 rules) |
| **Channels** | Direct outreach (LinkedIn, email), webinars for teachers, conferences (later), pilot-to-case-study loop |
| **KPIs** | Pilots started; pilot → paid conversion (>30% [A]); seats active; cohort completion; expansion revenue |
| **Caveat** | Magoosh institutional starts at ten accounts and lacks custom mock upload/proctoring (competitor-written **[S]**); verify before using this in sales copy |

---

## 4. Channels

### 4.1 SEO (primary engine)

**Principles:** build useful free tools first; programmatic pages only where each page has unique, accurate value; hreflang correct; E-E-A-T through named teacher bylines and examiner-credentialled reviewers.

**Keyword clusters (English).** Volumes/CPCs are **unmeasured**; clusters are hypotheses.

| Cluster | Example queries | Page type | Intent / funnel |
|---|---|---|---|
| Mock tests | "ielts mock test online free", "ielts computer delivered practice test", "gre practice test free", "pte mock test" | Landing + free sample test | High commercial; competes with British Council, IDP, ETS POWERPREP |
| Band / score calculators | "ielts band score calculator", "ielts reading band score table", "gre score to percentile", "clb to ielts" | Interactive tool (`/tools/*`, D2) | Top-funnel; link magnet |
| Writing | "ielts writing task 2 band 9 sample essay", "ielts task 1 bar chart sample", "gre issue essay examples" | Sample + examiner-style annotation + "get your essay scored" | Mid-funnel |
| Speaking | "ielts speaking part 2 topics [season]", "ielts speaking sample band 7" | Topic pages + AI practice | Mid-funnel; seasonal topic lists are a known user need |
| Question types | "ielts matching headings tips", "gre text completion strategies" | Question-type guides | Informational |
| Test & route logic | "ielts vs pte vs duolingo for canada", "which english test for uk b2", "does australia accept duolingo" | Comparison + decision tool | Test-agnostic differentiator |
| Registration / logistics | "ielts test dates [country]", "ielts fee in [country]" | Country pages | High intent, but must stay accurate and dated |
| Nurses | "nmc ielts score", "oet vs ielts for nurses" | Regulator guide | Niche, high value |

**Programmatic SEO with quality guardrails** (generate pages per question type × skill × topic × country, only when all gates pass):

1. **Unique value gate:** every programmatic page contains a working element (an interactive question set, a scored sample, or a calculator), not just rephrased text.
2. **Human review gate:** an editor/teacher signs off each *template* and spot-checks ≥10% of generated pages monthly; pages carry "reviewed by [name], [credentials], [date]".
3. **Accuracy gate:** any factual claim about test rules, fees, or visa thresholds is sourced to the primary body (IDP/BC/IRCC/gov.uk/NMC) with "last checked" date and an automated stale-page alert (>90 days).
4. **Thin/duplicate gate:** noindex until a page meets a minimum content and uniqueness score; cap launches (e.g. ≤50 new programmatic URLs/week [A]) and monitor indexation/quality in Search Console. Google's spam policies target scaled low-value content **[U: re-read current policy before launch]**.
5. **No scraped or leaked content** (D6); no "recent exam questions" that imply leaked material.
6. **Cannibalisation control:** one canonical page per intent; internal linking from hubs.

**hreflang with the Bangla site (D2).** Locale prefix `as-needed`: English at root, Bangla under `/bn/…`.
- Every public page with a Bangla counterpart carries reciprocal `hreflang="en"` and `hreflang="bn"` plus `x-default` pointing to English root.
- International English pages are **not** a translation of Bangladesh pages: BD-specific pages (bKash, BDT, local scholarships) live under `/bn/` or a `bd` content group and are **not** cross-linked as alternates of the global pages. Use `en` (global) with optional `en-BD` only if a BD-targeted English page exists; avoid duplicate-content collisions by giving BD-specific English pages distinct content and canonical.
- Do **not** auto-redirect by IP/browser language (crawlers and users get stuck); show a dismissible locale suggestion banner instead.
- Pricing pages: one URL, price rendered per region from server-side geolocation; keep structured data price in USD for Region A default, as crawlers see US. Note possible cloaking concerns: show the same *page content* to crawlers and users with only the price figure localised (document this with SEO review) **[U]**.

**KPIs:** indexed pages, non-brand clicks, top-3 keyword count, tool-completion rate, sign-up conversion per tool, organic share of customers (target ≥60% from 02 A10 [A]).

### 4.2 YouTube (English channel, teacher persona)

- **Why:** free teacher-led channels are the category's trust engine (IELTS Liz, E2Language, GregMat) **[V/S]**; our brand is faceless unless we create a persona.
- **Persona:** one named lead teacher (ex-examiner/certified instructor if possible; **never claim examiner status without proof**: r/IELTS bans unproven examiner claims **[S]**), supported by 2–3 guest teachers/nurse-specialists. Lead teacher has contract, bio, and verified credentials. [A]
- **Format mix:** (1) "Band 6 → 7" essay rewrites using our AI feedback screen (shows the product honestly, including where AI is wrong); (2) test-day walkthroughs of our CBT interface; (3) 20-minute strategy lessons per question type; (4) GRE problem walkthroughs; (5) live Q&A.
- **Cadence:** 2 long-form + 3 shorts/week by month 3 [A]; playlists by test/skill; chapters and transcripts feed SEO.
- **Funnel mechanics:** every video ends with a free resource (diagnostic, calculator), not a sales pitch; pinned comment + description link with UTM; community tab polls feed content planning.
- **Governance:** YouTube channel can be shared between BD (Bangla) and international (English) teams but should be **two channels** (separate audiences, algorithm signals). Link via about-page only.
- **KPIs:** watch-hours, subscribers, click-through to diagnostic, subscribers → sign-ups, video → paid attribution via UTM (indicative).
- **Benchmarks not found:** channel sizes of E2Language, IELTS Liz, IELTS Advantage not retrieved **[V: gap in A2]**; check YouTube directly in the data sprint.

### 4.3 Reddit, Discord, Quora (value-first; rule-bound)

| Platform | Rules / facts | Playbook |
|---|---|---|
| **r/IELTS** | Links to paid services allowed only if they lead to BC/IDP services or mod-pinned services; badged teachers may share their own guides/articles "but not paid services"; teachers seeking students may not post; unofficial AI tools may not be promoted; DM requests removed; claiming examiner/teacher status without proof = ban; spam = immediate ban **[S: Aug 2024 mirror of mod post; confirm on reddit.com]** | **No promotion, no product links, no founder-account posting about the product.** Staff answer questions as individuals with transparent disclosure only if mods permit; otherwise stay out. Value comes indirectly: free tools and YouTube get discussed by users organically. Contact mods for guidance on a "verified teacher" badge and pinned-resource eligibility (do not pay for it). |
| r/GRE, r/ApplyingToCollege, r/StudyAbroad, r/nursing(UK/PH) | **Rules not researched [U]** | Read each sidebar; assume no promotion. Participate under 90/10 norm **[S: generic vendor blog]** |
| **Discord** | Not researched | Run our own server: study rooms, daily speaking partner matching, weekly doubt sessions (mirror of BD Facebook-group tactic). Moderate for scams and "leaked paper" requests |
| **Quora** | Not researched | Answer high-intent questions with substance; disclose affiliation; link to free tools only when directly relevant; Quora's traffic is a minor SEO/brand lever [A] |

**KPIs:** helpful-answer upvotes, brand mentions (unsolicited), referral traffic from non-promotional links, zero moderator actions (hard target).

### 4.4 TikTok and Instagram Reels / YouTube Shorts

- Format: 30–60 s micro-lessons (e.g. "one word to fix in your Task 2"), speaking-part-2 prompts with a timer, "AI vs examiner" score reveals (with consent), study-abroad day-in-the-life by creators.
- Compliance: no leaked-paper claims; no "guaranteed 7.0"; disclose paid/affiliate relationships on-platform and in captions (§9).
- Role: awareness and retargeting audience building, not direct conversion. KPIs: view-through to profile click, saves, retargeting pool size.
- Evidence gap: no TikTok/Reels norms for test prep were found in research **[V: gap]**; treat as an experiment (E7 in §8.4).

### 4.5 Partnerships and affiliates

| Partner type | Mechanism | Commission / terms (assumptions) |
|---|---|---|
| **Individual teachers / tutors** | Referral link + free teacher account to use mocks with students; "teacher dashboard" on B2B path | 20–30% of first-year net revenue for a 12-month cookie/attribution window **[A]**; paid after refund window clears |
| **YouTubers / creators** | Unique code (10% learner discount only if a normal public promo; no fake "was" price) and link | 20–30% revenue share, or flat fee for large creators; creator contract with FTC-style disclosure clause **[A]** |
| **Study-abroad agents / consultancies** | Non-exclusive; agent portal; seat packs | Rev share 15–25% [A]; disclosed commissions; no under-18 data; vet for visa-refusal histories (02 §7.4 #4) |
| **Review/affiliate content sites** (Katalyst Prep, EdisonOS style) | Standard affiliate | 25–30% first sale [A]; they have commercial incentives (EdisonOS competes with Magoosh) **[V]**, so treat as visibility channel and not neutral validation |
| **Nursing recruiters** | Seat packs; co-branded "NMC-ready" plan | Per-seat price, not commission |
| **Universities** | Pre-sessional / foundation programme licences | Contract, annual |

Affiliate platform: Paddle does not natively offer affiliate management in the way Stripe does not either **[U]**; use a dedicated tool (e.g. Rewardful/FirstPromoter-class) or the P2 coupon/affiliate module (D1) **[U: verify Paddle compatibility]**. Commission rates above are **assumptions**; no published benchmark was found in research (A2 gap).

### 4.6 App stores (P3)
Native apps arrive in P3 (Expo, D1). ASO plan then: keywords without trademarks; screenshots showing exam-faithful UI; transparent pricing in listing (competitors are criticised for inconsistent in-app prices **[V]**); Apple/Google IAP fees to be modelled (30%/15% **[U]**) since MoR checkout via web is the margin-preferred route. Until P3, ship a **PWA** with install prompt.

### 4.7 Paid search / social

**Geo order (cost efficiency):** retargeting everywhere first; cold prospecting in **Region C/B on Meta/YouTube/TikTok** (cheap clicks) toward the free diagnostic; **Google Search in Region A only on bottom-funnel, non-trademark queries**, because list-price payback is poor (see arithmetic).

**CPC assumptions (all [A], unmeasured; replace with Keyword Planner/Meta Ads Manager data in the sprint):**

| Platform / region | Assumed CPC | Assumed click → diagnostic start | Diagnostic start → paid (30 days) |
|---|---|---|---|
| Meta, Region C (PK/NP/LK/NG/PH) | $0.05–0.15 | 12–18% | 2–4% |
| Meta, Region B | $0.10–0.30 | 10–15% | 2–4% |
| Meta / YouTube, Region A (diaspora) | $0.40–1.00 | 8–12% | 3–5% |
| Google Search, Region A (non-trademark: "english test for canada pr", "clb 7 practice") | $1.50–4.00 | 15–25% | 3–5% |
| Google Search, Region C | $0.15–0.60 | 15–25% | 2–4% |

**Payback arithmetic (illustrative [A]):**
- First-order contribution on IELTS Academic Core, Region A: **$89 price → $72.1 contribution (81%)** after the MoR fee (~5% + $0.50 **[U: unverified, 10-payments note]**), AI/video/royalty and mock costs (17 §2.3 international table). Allowable paid CAC at 60% of contribution (same rule as 02 §8.5) ≈ **$43**.
- Region C Meta: CPC $0.10 ÷ (15% start × 3% paid) = **$22 per customer**; at the 17 Region C price (IELTS Academic Core $34) contribution is **$25.0 (74%)** ⇒ allowable CAC ≈ **$15**. **Cold Region C paid acquisition is therefore still loss-making at the assumed funnel (about $22 vs $15) unless CPC ≤ ~$0.07 or click-to-paid conversion >4.5%**; Plus ($59 C, $33.5 contribution) improves it but is a harder first sale. Retargeting and lookalikes of payers (02 §8.5 rule) are the only paid use at scale.
- Google Search Region A: CPC $2.50 ÷ (20% × 4%) = **$312** per customer vs allowable ≈ $43 (Core) or ≈ $66 (Plus, $110.5 contribution). **Not viable** for Core; marginal for Plus and clearly viable only for Live/Mentor (A $299 / $399; $200 / $250 contribution) or B2B.

**Conclusion:** paid media is a measurement tool (find which messages convert) and a retargeting engine, not the main growth driver. Hard stop: pause any cohort whose blended CAC exceeds 60% of contribution after 3 weeks and 100 clicks per ad set.

### 4.8 Email lifecycle
Resend (D3). Sequences in §7. Consent per §9. Sender domain with SPF/DKIM/DMARC; list hygiene; plain-text alternatives; one-click unsubscribe.

### 4.9 PR
Low-cost PR angles: (1) published AI-scoring accuracy report (newsworthy given weak industry transparency); (2) "State of the English test market" data note (with IDP/BC public data only); (3) fraud awareness ("how to spot fake IELTS papers"). Target ed-tech press (PIE News covers IDP **[S]**), migration/nursing outlets, student-mobility newsletters. Avoid unverified claims.

### 4.10 B2B

| Target | Offer | Approach |
|---|---|---|
| Language schools / coaching centres | Seat packs with custom mock upload, cohort analytics (P2) | Pilot: free seats for feedback in return for case study; 25-seat minimum (17 §9 band) |
| Nursing recruiters / healthcare staffing | "NMC-ready" cohort programme | Per-seat; co-marketing to candidate pools; follow data protection (§9) |
| Universities' pre-sessional/foundation programmes | Diagnostic + progress dashboards + embedded mocks | Procurement is slow; use pilot with 1–2 programmes in Region B/A; LTI/SSO integration is not in current scope **[U]** |
| Study-abroad agents | Referral/affiliate (see 4.5) | Vetted partners only |

KPIs: pilots, pilot → paid, ARR from B2B (plan lists B2B as P2).

---

## 5. Pricing and localisation

### 5.1 Mechanism
- **Provider:** Paddle (MoR) per D3, behind `PaymentProvider`. Paddle supports country-specific price overrides through `unit_price_overrides` (country code + custom amount + currency); checkout priority is country override → auto-converted price → base price; location is geolocated and customers may change country and see that country's prices; API updates must resend the full override list **[V: Paddle docs]**.
- **Implementation:** each product's Paddle Price carries: base USD (Region A), overrides per country for B and C (USD or local currency). Region membership is a table in `packages/config` (country → region) generating the override list, so a region change is a config change.
- **Stripe fallback:** Stripe "Adaptive Pricing" converts currency; it is **not** PPP discounting. The Stripe docs page fetched while writing was an index only, so details (fees, subscription support, supported countries) are **[U]**. PPP on Stripe would require separate Price objects per currency/region. If Stripe-via-US-entity replaces Paddle, tax becomes a separate project (10-payments §2.9 **[V per grep]**).
- **Eligibility caveat:** Paddle lists Bangladesh as a supported country for selling (USD, tax-inclusive) but the page does not address seller/payout eligibility; whether a BD-registered entity can onboard is **[U]** (decision D3 already conditions on this). Everything in this section assumes Paddle onboarding succeeds.

### 5.2 Region structure and price indices (canonical = 17; rule = D12 C25)

| Region | Countries (D10) | Rule (D12 C25) | IELTS Academic Core | IELTS Academic Plus | GRE Core |
|---|---|---|---|---|---|
| A | US, UK, EU, Canada, Australia, NZ, Gulf (Singapore, Japan, Korea, Hong Kong default here, 17 header) | ≈ 2.5 × C | $89 | $149 | $149 |
| B | Upper-middle-income: Malaysia, Türkiye, Latin America, etc. | ≈ 1.5 × C | $49 | $89 | $89 |
| C | South Asia ex-Bangladesh, Africa, SE Asia ex-Malaysia/Singapore | **>= BD price converted to USD** (BDT ÷ 120), snapped to the USD ladder | $34 | $59 | $59 |
| BD | Bangladesh (BDT via SSLCommerz) | BDT book, VAT-inclusive | BDT 3,990 | BDT 6,490 | BDT 5,990 |

Reference signal: Coursera cut India prices up to 60% for region-aligned pricing, launched Sept 2025 **[S: press-release based]**. No published tier ratios for Udemy/Duolingo found **[V: gap]**.

**Region C >= BD rule (D12 C25) — conflict resolved.** The earlier concern (a USD checkout cheaper than the BD checkout) is closed mechanically in 17: every Region C price is the lowest charm price >= BD price ÷ 120 (IELTS Academic Core BDT 3,990 ÷ 120 = $33.25 → **$34**; Plus BDT 6,490 → $54.08 → **$59**), so a non-BD buyer never pays less than a Bangladeshi buyer and switching country to "game" a lower price is pointless. BD residents always see BDT. Passes follow the same rule (3-month: BDT 2,990 = $24.92 → C **$24.99**, B $39, A $59). Full price book: 17 §2.1 and §5.

Reference signal: Coursera cut India prices up to 60% for region-aligned pricing, launched Sept 2025 **[S: press-release based]**. No published tier ratios for Udemy/Duolingo found **[V: gap]**.

### 5.3 Currency display and tax
- Show local currency where Paddle provides conversion (display only; settlement in USD/payout currency) and fall back to USD; **tax-inclusive display** where Paddle's country table says inclusive (UAE and BD both inclusive per docs **[V]**; others not checked **[U]**).
- MoR handles VAT/GST/sales-tax collection and remittance (10-payments: for MoR "tax is computed and collected by the MoR" **[V]**). Our `order.tax_minor` is overwritten by the provider's tax.
- The marketing copy never says "plus tax" for countries where inclusive pricing applies; the checkout shows the final amount.

### 5.4 Anti-arbitrage (proportionate)
Goal: stop bulk abuse, not punish honest learners.
1. **Billing-country evidence:** price is determined by Paddle's geolocation + customer-chosen country; require billing country match with card country where Paddle exposes it **[U]**.
2. **Soft friction:** show a notice when IP country ≠ selected pricing country; do not hard-block VPN users.
3. **Entitlement-bound pricing:** a Region C-priced subscription can be used anywhere (we don't geofence learning), but renewal price stays at the purchase region unless the user updates country (with re-verification).
4. **Anomaly rules:** flag accounts with many Region-C purchases from Region-A IPs, shared accounts, chargeback patterns. Rate limits already in D3/D7.
5. **Proof-based student/need discounts:** SheerID-style or institutional email verification **[U: vendor not evaluated]**; scholarship requests (BD access programme analogue) manual review.
6. **Accept leakage:** some arbitrage is the price of reach; track "Region C purchases from Region A IPs" as a KPI (target <3% of Region C revenue [A]).

### 5.5 Student discounts
- Verified students (institutional `.edu`/`.ac.*` email or ID): **20% off Core/Plus/passes** via the MoR (17 §8), not stackable with PPP or promos; no fake "was" prices (02 §7.1 #4). Educators get a free teacher account, not a discount code.

### 5.6 Payment methods by region
Paddle currently lists: cards, Apple Pay, Google Pay (not in IN/TR), PayPal, bank transfer (invoices), Alipay, WeChat Pay, UPI, Pix, iDEAL, Bancontact, BLIK, MB WAY, KakaoPay/Naver Pay/Payco/Samsung Pay/Korean cards; Paddle shows methods by transaction currency, customer location and device; only cards are saveable for future purchases **[V: Paddle payment-methods page]**. The page gives **no country/currency matrix** for the regional methods, so what is available in Pakistan, Nepal, Nigeria, Ghana, Kenya, Philippines or Vietnam is **[U]**; confirm via Paddle sales/support during onboarding.

| Region / country | Expected workable methods **[A until confirmed]** | Gap |
|---|---|---|
| A | Cards, Apple/Google Pay, PayPal | None |
| B (Brazil, Türkiye, Malaysia) | Cards; Pix (Brazil) listed by Paddle **[V as a method; country scope U]** | Local wallets/bank transfer **[U]** |
| C (Pakistan, Nepal, Sri Lanka, Nigeria, Ghana, Kenya, Philippines, Vietnam) | Cards (international-enabled), PayPal where available | **Mobile wallets (JazzCash/Easypaisa, GCash/Maya, M-Pesa, eSewa/Khalti, MoMo/VNPay) are not listed by Paddle** **[V by omission]**; card penetration is low in several of these markets (general knowledge, **[U]**) → expect conversion drag |

**Mitigations:** (1) ask Paddle about local-payment roadmap for priority countries; (2) evaluate a second regional PSP (e.g. Flutterwave/Paystack for Nigeria/Ghana/Kenya, Razorpay/others for South Asia) — **many such PSPs need a local/foreign entity and are outside the MoR**, creating tax duties **[U]**; do not add until Region C demand is proven; (3) in-product guidance on getting a virtual dollar card; (4) manual/invoice route for B2B and institutions via bank transfer.

---

## 6. Funnel and lifecycle (English)

### 6.1 Funnel
`Discovery (SEO/YouTube/creators) → free tool or diagnostic (no sign-up for the test, sign-up for results) → account (Google/email OTP; phone OTP optional outside BD) → first mock completed (activation) → first AI evaluation → paywall at second full mock or second AI evaluation (02 §9.1) → purchase → habit loop (study plan, streak) → renewal/upsell/referral`

Target ratios **[A]** (replace with measured): visitor → diagnostic start 12%; start → completion 60%; completion → sign-up 55%; sign-up → first full mock in 7 days 35%; sign-up → paid in 30 days 3–4%.

### 6.2 Lifecycle sequences (all consent-gated, see §9)

| Sequence | Trigger | Emails (cadence) | Goal |
|---|---|---|---|
| **Welcome / activation** | Sign-up | D0 welcome + "start your diagnostic"; D1 "how to read your estimated band"; D3 "your first full mock, 3 tips"; D6 "what the AI got right/wrong (our accuracy page)"; D10 "pick your path" | First mock + first AI eval |
| **Diagnostic follow-up** | Diagnostic done, no purchase | D0 results + plan; D2 weak-skill drill; D5 social proof (verified outcomes, not guarantees); D9 offer: Core vs Pass explained plainly | Convert |
| **Test-date countdown** | User sets test date | T-60/-30/-14/-7/-2/-0 guidance (pacing, rest, checklist); T+1 "how did it go?" survey; T+14 "retake plan" | Engagement, referral, data on outcomes |
| **Abandoned checkout** | Checkout start w/o payment | 1 h reminder; 24 h "questions?"; 72 h FAQ (refund rule). **No fake urgency** | Recover |
| **Win-back** | 30/60 days inactive | One useful content item; then sunset | Reactivate |
| **Renewal** | Auto-renew products | **T-7 notice** (D5/F-PAY-08 default; 29 X5), receipt; easy cancel; extra T-14 / T-3 notices only per region if counsel requires (config); Paddle's own notices are never suppressed | Compliance and trust (see §9 on auto-renew rules) |
| **Referral** | After first high score / completed course | "Give one free AI evaluation, get one" (02 §9.2 #4) | Organic loop |
| **Post-test outcomes** | T+7 survey | Collect self-reported result (opt-in) to calibrate predictor and testimonials with permission | Proof assets |

### 6.3 Time-zone-aware live classes (link to 18 — Live classes, P2)
- Offer 3 recurring slots per cohort, rotating to serve **APAC/South Asia (e.g. 19:00 PKT/BDT)**, **Gulf/Africa/Europe (e.g. 19:00 GST/WAT)**, **Americas (e.g. 19:00 ET)** **[A]**; recordings within 2 hours.
- All times shown in the user's detected time zone with explicit UTC offset; calendar (.ics) attachments with time zone; DST-safe (store UTC + IANA zone).
- Region pricing is independent of class time; pick by convenience.
- Small-group speaking clubs: match by time zone and level.
- Cross-reference to `18-LIVE-CLASSES.md` for scheduler specifics (international window: 8 paid learners then merge, 18 §1.6; Live tier ships as manually-run Zoom pilot cohorts in P1, in-app scheduling P2, D1; Plus weekly live group Q&A runs on Zoom from P1, D12 C20); this doc only sets marketing requirements.

### 6.4 Support hours
- Phase 1 (launch to month 6): async email/in-app, first response <12 h [A], with named 7-day coverage handled by staggered shifts across BD (UTC+6) plus a part-time agent in Europe/Africa/Americas time zones **[A]**; status page (Better Stack, D3).
- Live chat during overlapping peaks (Gulf evening/BD morning) as capacity allows.
- Support macros for the top issues: scoring disputes, refund requests (7 days / <20% consumed, D5), payment method not accepted, VPN/region mismatch, certificate verification.
- Refund and chargeback processing via Paddle (MoR handles disputes; follow Paddle's rules **[U]**).
- KPIs: first-response time, resolution time, CSAT, refund rate, scoring-dispute rate.

---

## 7. Content calendar (global intakes and test peaks)

### 7.1 Intake and deadline map (general knowledge; verify each year)

| Destination | Main intakes | Application / test-ready windows **[A]** |
|---|---|---|
| US | Fall (Aug/Sep), Spring (Jan) | GRE ready by Sep–Nov for Fall deadlines (Dec–Jan); Common App (21) deadlines Nov 1 EA/ED, Jan 1 RD **[U: verify yearly]** |
| UK | Sep main, Jan smaller | UCAS Jan 14-ish; postgraduate rolling; English test needed by confirmation / CAS stage |
| Canada | Sep, Jan, May | Express Entry year-round (CLB 7); study permit timelines |
| Australia | **Feb/Mar and Jul** main; Nov smaller | Applications 3–5 months prior; test results needed for CoE |
| NZ | Feb, Jul | Similar to Australia |
| Europe/Asia | Sep (and Feb in some) | Varies |
| Skilled migration | Rolling | Express Entry draws are unpredictable; content pegged to rule changes (e.g. UK B2 from 8 Jan 2026 **[S]**) |

### 7.2 Annual rhythm **[A: demand shape hypotheses, to be validated against search trends]**

| Month | Theme | Content / campaign |
|---|---|---|
| Jan | New-year resolutions; Feb/Mar Australia intake prep; UK/Canada deadlines | "30-day plan" campaign; "Which test for Feb intake?" |
| Feb–Mar | Test-date peak (pre-Spring/Summer apps); Ramadan period 2027 (early–mid Feb to early Mar, **[U]**; adjust schedule for Muslim-majority audiences — lighter evening content) | Ramadan-aware live-class timing; speaking-topic pack update |
| Apr–May | Australian Jul intake applications; US results season | Crash plans; GRE summer-start campaign |
| Jun–Jul | GRE peak for Fall/Winter applicants; Jul intake rush | GRE 8-week plan; "last-minute" truthful scarcity (test slots) |
| Aug–Sep | Sep intake starts; new academic year; speaking-topic season update (IELTS speaking topics change in Jan–Apr, May–Aug, Sep–Dec cycles, widely reported by teachers; **[U] verify**) | "Back to study" campaign; new speaking pack |
| Oct–Nov | Early-action/ED prep (Common App); GRE for Jan-Feb deadlines | Admissions bridge to 21; GRE Verbal vocab push |
| Dec | Year-end, Jan 1 deadlines; holiday lull | Gift credits (honest pricing; no fake sales); content batching |

**Launch timing note (02 §9.3):** public launch ≈ April 2027 [A17]; international pricing live around launch week L9 (~June 2027). That puts the first *international* campaign in the **Jul–Sep 2027 window (Sep intake / GRE peak / Australian Jul intake tail)**: the strongest early window; Jan 2028 is the second.

### 7.3 Test-date peaks
Official IELTS/PTE/DET dates vary by country and were **not** researched (IELTS.org test-date pages not read). Build per-country test-date pages only from primary sources with "last checked" dates. Until then, content calendars are keyed to intakes, not specific test dates.

---

## 8. Budget, KPIs and experiments

### 8.1 Year-1 international budget (organic-first) **[A]**

Year 1 = launch (≈ Apr 2027, A17) + 12 months. USD; reconcile to 02 §11 marketing line (BDT 2.4M Year-1 paid ≈ $20k total; international test spend must come out of, or be added to, that line **[U: decision needed]**).

| Line | Year-1 amount | Notes |
|---|---|---|
| Paid media (test + retargeting) | **$12,000** | Staged: $1.5k data/ads test months 1–2; scale only on gate pass |
| Creator / affiliate commissions | Variable (target ≤ 25% of attributed revenue) | Not prepaid; flat fees ≤ $3,000 total for 3–5 micro-creator trials |
| SEO tools (Ahrefs/Semrush lite, Search Console, schema) | $1,800 | |
| Content production (freelance editors, examiner reviewers, designers) | $9,000 | Teacher persona + reviewers; YouTube production equipment $1,500 once |
| Email/CRM, affiliate software | $1,200 | Resend + affiliate tool |
| Data-sprint & accuracy study (examiner raters honoraria) | $3,000 | Pays for ~150–300 double-marked essays [A]; **gates pillar 2** |
| PR / events (webinars, conference passes) | $1,500 | |
| Contingency | $2,000 | |
| **Total (excluding salaries)** | **≈ $30,500** (≈ BDT 3.7M at 120) | Paid media = ~39% |

### 8.2 Top-line targets (Year 1, base case) **[A]**
International revenue is not separately modelled in 02 (it targets ~50 international customers by week L9). Proposed Year-1 international targets (to be added to 02 §11 on reconciliation): 1,200 paying customers (≈ 20–25% of the 02 base-case total 1,900 BD customers' scale, i.e. modest), blended CAC ≤ $15, organic ≥ 60% of customers (02 A10; per the D10 change log, **referral and partner customers count as organic**, i.e. non-paid-media), refund rate ≤ 6%, B2B pilots 5, pilot → paid ≥ 30%.

### 8.3 KPI tree

| Layer | KPI | Target (A) |
|---|---|---|
| Acquisition | Organic sessions; non-brand clicks; YouTube subscribers; tool completions | Set after sprint baseline |
| Activation | Diagnostic completion; sign-up → first full mock in 7 days | 60%; 35% |
| Conversion | Sign-up → paid (30 d); AI-eval → paid | 3–4%; track |
| Revenue | ARPU by region; Pass share; refund rate; renewal rate | Track; renewal baseline from L12 test |
| Efficiency | Blended CAC; paid CAC by region; payback | ≤ $15; ≤ 60% of contribution |
| Trust | AI-accuracy page visits; NPS; scoring-dispute rate; Trustpilot rating | NPS ≥ 40 [A]; Trustpilot ≥ 4.3 once ≥ 50 reviews |
| Channel health | Reddit mod actions (target 0); affiliate fraud rate; spam complaints (<0.1%) | |
| Compliance | Consent coverage; unsubscribe latency; ad disapprovals | 100%; <24 h; <2% |

### 8.4 Experiments roadmap

| # | Experiment | Hypothesis | Window | Success gate | Budget |
|---|---|---|---|---|---|
| E0 | **Data sprint** (keywords, CPC, YouTube channel sizes, test-date pages, Paddle country coverage) | Priority list changes after measurement | Pre-launch, 1 week | Replace [A] cells in §1.3, §4.7 | $0–300 |
| E1 | Free band calculators + CLB converter | Tools earn links and sign-ups | Launch +0–6 wk | ≥ 8% visitor → sign-up | Content only |
| E2 | Programmatic pages (question-type × skill) pilot, 100 pages | Quality-gated pages index and convert | +4–12 wk | ≥ 70% indexed, ≥ 0.5% → sign-up | Dev + review |
| E3 | YouTube: 10 videos, 2 formats (essay rewrite vs strategy) | Rewrite format has higher click-through | +0–10 wk | CTR to diagnostic ≥ 1.5% | Production |
| E4 | Meta cold, Region C, free-diagnostic offer, 3 countries | CPL < $1.00, sign-up → paid ≥ 3% | +6–12 wk | Blended CAC ≤ allowable (see §4.7) | $2,500 |
| E5 | Retargeting free-tier non-purchasers (all regions) | CAC ≤ $15 | +6 wk | CAC ≤ $15 | $2,500 |
| E6 | Gulf expat creators (3 micro-creators, trial codes) | Region A pricing + high intent gives best revenue per click | +8–16 wk | Revenue/commission ≥ 3× fee | $2,000 |
| E7 | TikTok/Reels organic (30 posts) | Retargeting pool growth, not direct sales | +0–12 wk | ≥ 5k pool | Content |
| E8 | PPP price test: Region C index 50 vs 65 | Higher index doesn't lose revenue | +10–20 wk | Revenue per visitor higher | None (Paddle overrides) |
| E9 | Nurse track micro-pilot (Philippines/Nigeria) with 1 recruiter | Per-seat B2B works | +12–24 wk | 1 signed pilot | Sales time |
| E10 | AI-accuracy report PR push | Earns coverage and links | Launch +2–4 wk | ≥ 3 earned mentions | $500 |
| E11 | Affiliate programme beta (20 teachers) | ≥ 20% of sales via affiliates by month 6 | +8–24 wk | Commission ≤ 25% of attributed revenue | Variable |

### 8.5 Country scorecard (quarterly)
For each Tier 1–2 country: sessions, sign-ups, paid, ARPU, CAC, refund, support load, payment-failure rate. Promote/demote tiers by threshold: if paid conversion < 1% after 500 sign-ups or payment failure > 15%, pause paid spend and investigate payment methods before blaming content.

---

## 9. Compliance (international marketing)

> Not legal advice. Items marked **[U]** need counsel. Also see `09-SECURITY-AUTH-COMPLIANCE.md`.

### 9.1 Email and data consent
| Law | Rule of thumb for Lumen | Action |
|---|---|---|
| **GDPR / UK GDPR + PECR / ePrivacy** | Lawful basis for marketing: explicit opt-in consent for EU/UK B2C email (PECR "soft opt-in" is narrow and applies to existing customers' similar products **[U]**); right to withdraw; record consent (timestamp, source, text); data subject rights (access/delete, matches D4 export/delete). Transfers from EU/UK to US/Singapore need a mechanism (SCCs/IDTA/DPF) **[U]** | Region-aware consent banner; double opt-in for non-customers in EU/UK; DPA with Resend, PostHog, Paddle; DPIA for AI scoring of essays (personal data in prompts) |
| **CAN-SPAM (US)** | Opt-out model, but requires: truthful headers/subject, physical postal address, working unsubscribe honoured within 10 business days **[U: verify current rule]** | Footer template, address, 1-click unsubscribe |
| **CASL (Canada)** | Express or implied consent; strict records **[U]** | Opt-in for Canadian users; implied consent only under narrow conditions |
| **Australia Spam Act, NZ UEMA** | Consent required, identification, unsubscribe | Same opt-in approach |
| **Gulf/others (UAE PDPL, Saudi PDPL, Nigeria NDPA, Pakistan, Philippines DPA)** | Various consent/transfer rules **[U]** | Default to opt-in consent globally; legal review for Tier 1–2 launch countries |
| **Minors** | Under-18 gets no marketing (D7); under-16/13 rules (COPPA, GDPR-K) **[U]** | Age band at sign-up; block marketing consent |

Global default: **opt-in consent for all marketing email, everywhere** (simplest to run).

### 9.2 Cookies and tracking
- Cookie-consent banner (granular) for EU/UK/other opt-in regions; PostHog and ad pixels load only after consent (D3 says PostHog is "cookie-consent gated"). Use server-side events cautiously (consent still applies). Consent Mode v2 for Google Ads in EEA **[U]**. Conversion APIs hash data; respect opt-outs.
- Privacy policy lists AI processors, essay retention periods and training use (default: **no training on user essays without explicit opt-in**).

### 9.3 Advertising standards
- **No guaranteed scores, bands, admissions or visas.** No "get 7.0 in 30 days". Outcome statements only as verified, dated, sample-sized aggregates ("Of 212 learners who reported a result between X and Y, 61% improved by 0.5+ band; self-reported") with disclaimers. Benchmarks: UK ASA/CAP code, FTC Act (testimonials and endorsements guides), EU Unfair Commercial Practices Directive, Australian Consumer Law ("misleading or deceptive conduct") **[U: apply each]**.
- **Estimated scores:** label "estimated" wherever shown (D6).
- **Pricing:** no fake "was" prices; no countdown timers that reset; show tax-inclusive price where required. Auto-renew: clear disclosure, reminder before renewal, easy online cancel (FTC "click-to-cancel" rule status in the US and EU/UK consumer rules **[U]**; check current status).
- **Endorsements/affiliates:** clear disclosure (#ad, "I earn a commission"); affiliate contracts forbid false claims; monitor.
- **Immigration advice:** do not give visa eligibility advice (risk of unauthorised practice in UK OISC, Canada ICCRC/CICC, Australia MARA, etc. **[U]**); link to official pages; label CLB/B2 conversion tools "informational".
- **Testimonials:** written consent, verified scores (02 §9.3 L10), no fabricated reviews (platform bans and consumer-law violations).
- **Targeting:** do not target ads by ethnicity/religion; use language, interests, location, behaviour; platform policies restrict sensitive-category targeting **[U: check each platform]**.

### 9.4 Trademarks and test-owner wording
- **Canonical notices (D12 C31, used verbatim in 03 §9.4, 07, 08, 26):** GRE/TOEFL — "GRE® and TOEFL® are registered trademarks of ETS. This product is not endorsed or approved by ETS." IELTS (verify with counsel) — "IELTS is a registered trademark of the University of Cambridge, the British Council and IDP Education Australia. This site and its products are not approved or endorsed by them." PTE / DET / Common App — "[Mark] is a trademark of its owner; we are not affiliated with or endorsed by it." Marketing copy uses the nominative form ("GRE® test") and links to the footer notice; confirm against ETS's trademark guidelines at launch.
- **IELTS (British Council, IDP, Cambridge University Press & Assessment), PTE (Pearson), Duolingo English Test, OET, CELPIP:** policies not retrieved **[V: 02 §9.4 says IELTS/PTE/DET policies not retrieved]**. Default for any mark not listed in C31: "[Mark] is a trademark of its owner; we are not affiliated with or endorsed by it"; no logos; no look-alike branding; "official" is banned in our copy except when quoting official sources.
- **Ad keywords:** per 02 §9.4, **no test marks in ad keywords**. Note: bidding on a competitor's/owner's trademark as a keyword is allowed in some jurisdictions and prohibited by some platforms/countries and by 02 policy; we follow our policy (do not bid on marks). Ad **copy** referencing "IELTS practice" may trigger trademark complaints in Google Ads; appeals process and generic alternatives ("English test practice") prepared **[U]**.
- **Competitor names:** no unfair comparative advertising; claims must be substantiated and current; legal review of comparison pages (EU/UK comparative-advertising rules).

### 9.5 Platform policies
- **Google Ads:** the Google Ads policy centre page fetched while writing shows no education/immigration-specific restriction; the related policies are Misrepresentation (deceptive claims, offers not actually available, unrealistic financial-gain claims) and Enabling Dishonest Behavior (prohibits "academic cheating services") **[V: support.google.com/adspolicy/answer/6008942]**. Search results also showed a new "government documents and services" authorisation requirement (starting Oct 5, 2026 per a trade article) **[S: techwyse; headline only, not read]**: check whether visa-adjacent pages ("CLB calculator", "UK visa English requirement") could fall inside it. Education-specific ad policy (e.g. educational services) and immigration-related restrictions were **not verified**.
- **Meta:** personalised-advertising restrictions; special ad category rules do not cover education, but "financial/employment/housing" do **[U]**; avoid "before/after" claims.
- **TikTok, YouTube:** disclosure toggles for branded content; community guidelines against misleading outcome claims **[U]**.
- **App stores (P3):** subscription disclosure rules, review incentive bans.
- **Reddit:** per-subreddit rules (§4.3). Violations = bans; treat as a hard stop.

### 9.6 Other
- Affiliate/partner data sharing only with explicit consent (02 §7.4 #4); DPAs with partners.
- Records: consent logs, ad claim substantiation file, testimonial releases (retain ≥ 3 years [A]).
- Accessibility (WCAG 2.2 AA, D8) applies to landing pages (legal exposure in the US/EU/UK).
- Sanctions/export: Paddle blocks unsupported/sanctioned countries **[V]**; geoblock accordingly and do not run ads there.

---

## 10. Mirror table: Bangladesh tactic ↔ international counterpart

> Left column cites the **real section numbers of `19-MARKETING-BANGLADESH.md`** (final); 19 §10 holds the reverse table citing this doc's sections. Update both together if either is renumbered.

| 19 section / BD tactic | International counterpart (this doc) | Key difference |
|---|---|---|
| 19 §1.3 positioning and §1.4 honesty pillars ("trusted, fraud-free prep") | §2 "most honest, most faithful mock-test platform", published AI accuracy | BD stresses fraud/leak environment and fair pricing; international adds transparent AI validation vs competitors with none |
| 19 §2.a-§2.f segment playbooks (university students, HSC/parents, 35-55 migrants, rural/low-income, professionals, institutions) | §3 segment playbooks (students, skilled migrants, nurses, family-visa, GRE, institutions/agents) | BD adds low-income Gulf/Asia labour migrants needing destination-language tests (EPS-TOPIK/JFT-Basic); international has no such segment (those tests are outside current scope) |
| 19 §3.2 Facebook page/groups/Live, community | §4.3 Reddit/Discord/Quora + owned Discord | Facebook groups are the BD community engine; internationally Reddit is rule-bound (r/IELTS bans paid promotion) so Discord and owned channels replace group seeding |
| 19 §3.1 YouTube, §3.3 TikTok/Reels (10MS playbook) | §4.2 English YouTube (teacher persona) + §4.4 Shorts/TikTok | Separate English channel; teacher persona replaces national-brand founder presence |
| 19 §3.6 Bangla SEO and §3.7 free tools | §4.1 English SEO clusters + programmatic pages + hreflang | Separate keyword universe; hreflang between `en` root and `/bn/…`; BD-specific pages not shared |
| 19 §3.11 creator partnerships (and §3.10 campus ambassadors) | §4.5 creators, teachers, review sites (affiliate) | Revenue-share affiliate with disclosure; no BD rate cards existed either (gap) |
| 19 §2.f institutions and §3.14 coaching-centre partnerships (B2B seats) | §4.10 B2B: language schools, nursing recruiters, universities' pre-sessional | Different buyer set; recruiters and universities add procurement and data-protection duties |
| 19 §2.d and §3.14 offline channels (UDC, BMET TTC, Probashi Kallyan Bank) | §3.6/§4.10 institutional partners; diaspora organisations; settlement charities | No equivalent state network; low-confidence UDC channel replaced by partner organisations |
| 19 §2.d payment behaviour and §3.14 (banks/MFS): bKash/Nagad/SSLCommerz, instalments (17 §7) | §5.6 Paddle (cards, PayPal, Apple/Google Pay, regional methods listed), Region C wallets unsupported | MoR checkout, auto-renew subscriptions (D5), no instalments; wallet gap in Pakistan/Nepal/Africa/Philippines/Vietnam |
| 19 §2.d and 17 §8: pricing in BDT with scholarships/access programme | §5 PPP regions A/B/C via Paddle overrides; verified-student discount; manual scholarship review | One USD book with regional overrides; **price-book conflict BD vs Region C to resolve in 17** |
| 19 §3.4 WhatsApp, §3.8 email/SMS, §5.2 lifecycle (BD promo SMS rules) | §6 email lifecycle (+ WhatsApp optional in Gulf/PK/NG, consent-gated **[U]**) | Email-first; SMS only for OTP (D3); CAN-SPAM/GDPR/CASL replace BTRC/NDNC rules |
| 19 §4.2-§4.3 calendar and seasonality: HSC/SSC results, Ramadan/Eid | §7 intakes (Sep/Jan; AU Feb/Jul), GRE peaks, Ramadan-aware timing | BD cycle is exam-calendar-driven; international is intake- and deadline-driven |
| 19 §2.a/§2.b Live-tier offers and 18 (Zoom pilot P1): live batches in BD time | §6.3 time-zone-aware slots, recordings | Three time-zone bands; DST-safe scheduling |
| 19 §3.4 and §9.2 support in Bangla via WhatsApp (SLA <4 h; 27) | §6.4 English async-first, staggered coverage | Fewer language/channel needs, more time-zone coverage |
| 19 §6.1-§6.5 trust and safety marketing; fraud messaging (fake IELTS papers, scams) | §2.2 pillar 4 "no leaks", PR on fraud awareness (§4.9) | Same trust asset, lower salience in region A, high in region C |
| 19 §7.3-§7.4 paid media: retargeting + lookalikes only (CAC cap BDT 1,400) | §4.7 geo-ordered paid; cold only in Region C/B with free-diagnostic, retargeting elsewhere; CAC cap ~$43 (Region A, Core; 60% of 17 §2.3 contribution) | Same discipline; labelled CPC assumptions |
| 19 §3.9 referral programme (double-sided BDT 200 credit, 17 §11) | §6.2 referral sequence + §4.5 affiliates | Add partner-affiliate layer |
| 19 §8 compliance: Digital Commerce Guidelines 2021, BTRC SMS, PDPO | §9 GDPR/UK GDPR/CAN-SPAM/CASL, cookie consent, ad standards, trademarks, platform policies | Multi-jurisdiction, consent-first default |
| 19 §4.4 launch/90-day plan and §7.5 KPI dashboard (02 §9.3) | §8 international KPIs and experiment roadmap | International test starts ~L9 (June 2027) and follows organic proof |
| 19 §7.3 customer mix: "organic and partner-led" ≥ 60% | §8.2 organic ≥ 60% | Same definition in both markets (D10 change log): referral and partner customers count as organic; paid media and creator fees do not |

---

## 11. Weak facts and open items (consolidated)

**Weak / secondary sources used (verify before external use):**
1. IDP/BC volume and country-trend numbers (Lingobright summary; only the IDP FY26 release is primary). India −50% FY25 / −27% H1 FY26 and growth-market lists are secondary.
2. Canada CLB/IELTS equivalence (Immigration2Canada); UK B2 date and care-worker closure (law-firm pages); UK dependant/settlement English rules (Tarve, internally inconsistent); NMC scores (2022 blog; later changes possible).
3. r/IELTS rules (Redlib mirror of an Aug 2024 mod post).
4. Competitor prices from aggregators dated Oct–Nov 2026 (Katalyst, EdisonOS: EdisonOS competes with Magoosh), E2Language price range from a review site, AI-app accuracy numbers from one blog (AI Tools Bakery).
5. Coursera India −60% (press-release-based).
6. Paddle fee (~5% + $0.50) unverified; Paddle BD-seller onboarding unverified; Paddle's per-country payment-method matrix not published on the page read; Paddle supported-country status for PK/NP/LK/NG/GH/KE/PH/VN not checked (only BD and AE seen).
7. Stripe Adaptive Pricing details (page index only), Google Ads education/immigration policy (not found; government-document authorisation update seen as headline only).
8. All CPC, conversion, affiliate commission, budget and KPI targets are **assumptions**.
9. No audited per-country IELTS/PTE/DET volumes (Nigeria, Pakistan, Nepal, Philippines, Gulf); no PTE/DET volumes; no YouTube channel sizes.
10. Ramadan 2027 dates, speaking-topic cycle months, Common App deadlines, Australian/UK intake dates: general knowledge, unverified.

**Decisions needed from the founder / other docs:**
- 17: **Resolved** — BD vs Region C conflict closed by D12 C25; B/C prices and international B2B seat pricing are set in 17 §2.1 and §9. Remaining: verify the Paddle per-country override list and the [A] regional defaults (Singapore/Japan/Korea/Hong Kong in A).
- 02 §11: reconcile international budget and targets with the BD-centred financial model.
- 07/13: confirm accuracy-study protocol and when the published validation can be shipped (gates pillar 2).
- 10: confirm Paddle onboarding for a BD entity; if Stripe-via-entity is needed, rework tax and PPP approach.
- 18: live-class slot policy by time zone (18 now exists; confirm the three-band rotation in §6.3 against 18 §1.6).
- 19: mirror table section names aligned (this doc's §10 now cites 19's real sections).
- Legal: opinion on trademark disclaimers per test owner, immigration-advice boundaries, auto-renew/cancellation rules by jurisdiction.
