# 01 — Competitor Teardown: Lumen Academy (placeholder brand)

> Status: v1, 2026-11-07. Conforms to `00-DECISIONS.md` (D1 phases, D5 commerce model).
> Every factual claim traces to the research notes in `research_notes/Edtech test prep platform blueprint/`. Inline tags look like *(source: file.md — origin)*. Dates and currencies are kept as the notes give them. Nothing here is invented: where the notes have no data the text says **n/v** (not verified) or **Assumption**.

## 0. Reader's guide

**Three polite corrections and one open question**

1. **"maagosh"** is **Magoosh** (magoosh.com), a US self-paced GRE/TOEFL/GMAT prep company. Profiled below.
2. **"Pearson IELTS"**: Pearson runs **PTE Academic**, a *competitor* to IELTS, not IELTS itself. IELTS is jointly owned by the British Council, IDP IELTS and Cambridge University Press & Assessment. *(source: global_test_prep_competitors.md §7 — Pearson article comparing the two tests; exam_specifications_gapfill.md §6 — ownership from background knowledge, UNVERIFIED in the notes)*. Pearson is profiled as "Pearson PTE". The IELTS-owner side is covered under British Council, IDP and Cambridge.
3. **"collegeapp"** *(update 2026-11-07: the founder confirmed this is **Common App**; see the addendum at the end of this file and `21-ADMISSIONS-COMMON-APP.md`. The paragraph below is kept as the original research record.)* could not be identified. The research found only tiny literal listings (a Crunchbase organisation "collegeapp", "collegeappz" on Gust, a GitHub Pages "The College App"), none of them a known test-taker platform. *(source: bangladesh_market_gapfill.md §5)*. **Please confirm which you meant.** Most likely candidates:
   - **Common App**: the US undergraduate application portal. Not researched in the notes; an application tool rather than test prep.
   - **Yocket**: study-abroad counselling plus prep. Profiled.
   - **Leverage Edu**: study-abroad counselling plus prep. Profiled.
   - **CollegeVine**: admissions advising. Not researched; it appears only as a gap in the notes.
   
   Yocket and Leverage Edu are the closest fit to "a successful test-taker platform", so they are the working interpretation here.

**Confidence tags used in profiles**
- **H** = vendor page, filing or official site in the notes.
- **M** = reputable press.
- **L** = aggregator, competitor-written review, practitioner blog or AI-generated wiki (e.g. Grokipedia).

**Note on "Weak/secondary" figures.** Katalyst Prep, EdisonOS and learnenglish.life are commercial review sites with possible affiliate incentives; EdisonOS competes with Magoosh. *(source: global_test_prep_competitors.md — method note)*. Their numbers are tagged L unless a vendor page confirms them.

---

## 1. Executive summary: what wins in this landscape

1. **Free-to-paid funnels beat cold selling.** 10 Minute School grew from a free Facebook page (2014) and YouTube (2015) into Bangladesh's largest ed-tech *(M/L: Grokipedia, medium confidence)*. IELTS Liz (free blog and YouTube) and GregMat (free resources, one free full-length test) are the global equivalents. ETS gives away two POWERPREP tests; the British Council gives away IELTS Ready.
2. **Test owners treat prep as a funnel to the exam fee, not a profit centre.** The British Council gives IELTS Ready Premium free *only* if you book its test. Pearson sells scored practice tests with heavy "was/now" anchoring ($119.99 Gold vs $237.94 struck through). ETS sells POWERPREP PLUS at $44.95 per test. Independents cannot win on "official"; they must win on price, depth, coaching and AI feedback.
3. **A tiered ladder with a clear price step wins.** 10MS offers IELTS recorded, then Live Batch, then Programme/English Centre (BDT 15,000 offline). GRE sells at $12 to $180 self-paced, $450 to $600 premium self-paced, and $900 to $5,000 live. Each rung has a defined buyer.
4. **Human help at low cost is part of the product.** 10MS uses a Facebook support group, weekly Zoom doubt-solving and a 24/7 hotline. Ostad pushes live learning explicitly to cut dropout. Programming Hero reported only 33% completion for a recorded web course. PhysicsWallah's offline arm is about 47% of revenue.
5. **Mock tests are the cheap-to-deliver, high-perceived-value asset.** 10MS ships 10 Reading and 10 Listening mocks with its recorded course; Mentors' sells 20 mocks in a BDT 13,800 course. Pearson, ETS and the British Council all lead their prep ladder with mocks.
6. **AI scoring is table stakes for IELTS apps, but trust is the open gap.** Almost every AI IELTS app maps an LLM to the public band descriptors and returns four criterion bands. Few publish validation. Reported accuracy points are mixed and mostly self-published: Band Score Checker's own test had 79% of Task 2 and 70% of Task 1 within half a band, and band 8.5 essays all scored 7. IDP says official Writing/Speaking is human-marked and advises against LLM grading. *(source: global_test_prep_competitors.md §3, AI Tools Bakery)*
7. **Debt-funded, CAC-heavy growth fails.** BYJU'S (insolvency from July 2024) and Unacademy (sold to upGrad for about $200M in shares, about 94% below its $3.4B 2021 peak) are the cautionary cases. Business Today's lesson: test prep has weak repeat purchase and high CAC. *(source: south_asia_edtech.md §3)*
8. **AI has a real margin cost.** Duolingo guided its Q4 gross margin to 72.0% from 72.9% in Q3, citing its AI rollout. Price AI features by credits. *(source: global_learning_platforms.md §4)*

---

## 2. Per-competitor profiles

Format per entry: **Offer** · **Pricing** · **Monetization** · **Channels** · **Content** · **Engine/dashboard** · **Strengths** · **Weaknesses** · **Copy** · **Avoid**. Fields marked *n/v* were not found in the notes.

### 2.1 Global test-prep

#### Magoosh (US) — confidence M/L
- **Offer:** self-paced online prep (GRE, TOEFL, GMAT; IELTS per background knowledge, unverified). 7-day free trial, free practice lesson, free GRE practice test.
- **Pricing (GRE, Katalyst Oct 21 to Nov 5, 2026, L; matches EdisonOS Oct 30, 2026):** Premium $149 (1 month, 6 practice tests); $179 (6 months); Premium + Admissions $219 (6 months). Magoosh's own page confirms a 7-day money-back guarantee, a score-increase guarantee, 1,000+ flashcards and daily study plans.
- **Monetization:** time-boxed subscriptions; score-increase guarantee with 4 conditions (a refund-control device); bulk pricing for institutes from ten accounts.
- **Channels:** content and SEO; n/v otherwise.
- **Content:** video lessons, question bank, flashcards, study schedules.
- **Engine/dashboard:** score predictor regresses practice performance (number and difficulty of questions answered) onto actual scores collected via post-exam surveys; most accurate with many answers. *(source: ux_dashboards_video_gapfill.md §1)*
- **Strengths:** Trustpilot 4.8/5 across 600+ reviews (cited by a competitor, EdisonOS); strong guarantee and trial.
- **Weaknesses:** some reviewers say questions are harder than the real exam or ambiguously worded; institutions get no custom-mock upload, no proctoring, Magoosh-branded UX (competitor-written, treat with caution).
- **Copy:** the score predictor idea (but start with a transparent heuristic, because Lumen has no labelled data at launch); 7-day money-back.
- **Avoid:** a 4-condition guarantee that reads as a trap; USD pricing as the main anchor for Bangladeshi buyers.

#### Manhattan Prep (US) — L (aggregator)
- **Offer:** GRE on-demand, live online and tutoring.
- **Pricing (Katalyst):** Interact GRE On Demand $299 (1 month) / $599 (6 months); live online GRE for MBA $1,999; private tutoring 10 hrs $2,900 (9 months, 325+ guarantee).
- **Monetization:** premium self-paced plus live and tutoring upsell with score guarantee.
- **Channels, content, engine:** n/v in notes.
- **Strengths:** premium brand positioning (inference). **Weaknesses:** price puts it out of reach of Bangladeshi learners. **Copy:** a tutoring tier with a score-guarantee as a later upsell. **Avoid:** copying the price points.

#### Kaplan (US) — L
- **Pricing (Katalyst; shown discounted from list):** On Demand $240 (1 month, no guarantee) / $480 (6 months); Live Online $880 (3 months; list $1,099); tutoring + live $2,000 to $2,800 (10 hrs, 325+ guarantee on premium).
- **Monetization:** ladder from self-paced to live to tutoring, discount-anchored. Other fields n/v.
- **Copy:** none specific. **Avoid:** permanent "was/now" discounting without a real list price (Lumen should price honestly; see §6).

#### The Princeton Review (US) — L
- **Pricing (Katalyst):** Self-Paced $499; GRE 10 Points+ $899; Fundamentals $1,199; 162+ course $2,399; 165+ tutoring $4,999 (32 hrs).
- **Monetization:** many tiers by target score and contact hours. Other fields n/v.
- **Copy:** target-score framing ("162+") as a product label for an advanced bundle. **Avoid:** tier sprawl for a small team.

#### Target Test Prep (TTP) (US) — L
- **Pricing (Katalyst):** $179/month (regular about $229); 4 months $449 (reg. $549); 6 months $499 (reg. $599); 6 months + live classes $1,299 (reg. $1,599); private tutoring 5 hrs $1,700; score-increase guarantee on subscription tiers.
- **Monetization:** time-boxed subscription plus live add-on. Other fields n/v.
- **Copy:** time-boxed passes that get cheaper per month with longer terms (D5 passes). **Avoid:** nothing specific.

#### GregMat (GRE; US/online) — L
- **Offer:** free resources including one full-length practice test (labelled beta), free study plan and vocab tool, weekly live events; paid plans add live classes.
- **Pricing:** GregMat Plus $11.99/month (new-subscriber price); Plus + PrepSwift $14.99/month (PrepSwift is a $3/month add-on of short review videos with quizzes); no guarantee. *(source: global_test_prep_competitors.md §1, Katalyst review)*
- **Monetization:** low monthly price, creator-led freemium. No revenue figures found.
- **Channels:** free site content; YouTube was not verified in the notes.
- **Strengths:** price floor for GRE in the independent segment. **Weaknesses:** no GRE essay grader mentioned in the review; no guarantee.
- **Copy:** free full-length test as the funnel; a cheap monthly price point. **Avoid:** a thin paid tier (Lumen needs an AI-scoring edge).

#### ETS official (GRE, TOEFL) — H
- **Offer:** POWERPREP Online Tests 1 and 2 free (Test 1 untimed, Test 2 timed; free tests give a summary report and Verbal/Quant answers); POWERPREP PLUS $44.95 per test (simulates the real GRE, instant scoring, detailed reports, explanations for all question types, free navigation within sections); Official Guide to the GRE 4th ed. $45; Super Power Pack $80; ScoreItNow! $20 for two GRE Analytical Writing topics, scored instantly by e-rater (automated only), with six bonus topics after submitting the first two, scored samples, diagnostic feedback and timed "Test Experience" or untimed mode.
- **GRE fee:** $249 from 1 Aug 2026 (supersedes $220); reschedule $55. *(source: exam_specifications_gapfill.md §7)*
- **Monetization:** funnel to the exam fee; per-test paid practice.
- **Strengths:** the real engine and real item style. **Weaknesses:** ScoreItNow is $10 per essay, e-rater only; ScoreItNow now sits on a dxrgroup.com domain (inference: operated by a third party). **Cannot be matched on "official".**
- **Copy:** free-untimed, free-timed, paid-with-explanations ladder for mocks; timed "Test Experience" vs untimed practice mode.
- **Trademark rules (H):** required notice on materials and each page ("[mark] is a registered trademark of ETS. This product is not endorsed or approved by ETS."); no ETS marks in company, product or domain names, handles, trademark filings or ad keywords; use the mark as an adjective ("GRE® test preparation"); submit materials to trademarks@ets.org (about 10 business days). *(source: exam_specifications_gapfill.md §6)*

#### British Council IELTS Ready — H
- **Offer:** free on sign-up: 50-minute Mini Mock with AI feedback and an estimated band, two full mocks with feedback and model answers, guided modules, podcasts, live webinars. **IELTS Ready Premium** is free *only* after booking an IELTS test with the British Council: 40 full practice tests with scores and model answers, 25-minute Express Mock across all four skills, optional AI feedback, self-study courses, webinars, personalised dashboard. Premium launched around July 2023.
- **Monetization:** exam-fee funnel. British Council paid live and online courses: price varies by country, not listed; Bangladesh BDT fee not found.
- **Strengths:** official brand; 40 tests is a very high mock count. **Weaknesses:** gated behind booking; Cambridge's Write & Improve is writing-only and gives a CEFR level, not a band.
- **Copy:** a 25-minute "Express Mock" (all four skills) and a 50-minute Mini Mock as lead magnets. **Avoid:** gating everything behind another purchase.

#### IDP (IELTS co-owner; Bangladesh) — H
- **Offer:** IELTS test delivery plus prep. IELTS fees in Bangladesh: IELTS on Computer **BDT 31,100**; UKVI BDT 34,850; Life Skills BDT 24,750; One Skill Retake BDT 18,600; UKVI One Skill Retake BDT 20,900; Enquiry on Results BDT 10,500. The paper test ended in Bangladesh after 31 Jan 2026. 0% EMI through 32+ banks (Daily Star supplement).
- **AI stance:** IDP says official Writing and Speaking are human-marked and advises against LLM grading. *(source: global_test_prep_competitors.md §3)*
- **IDP prep app contents and pricing:** not retrieved.
- **Implication:** a faithful *computer-based* mock is now the only IELTS format in Bangladesh, which makes interface fidelity more valuable. Own-brand AI scores must be labelled "estimated" (D6).

#### Pearson PTE (PTE Academic) — H
- **Offer:** Scored Practice Test $35.99 each (3 versions; 2 hours; same format and scoring engine as the real test; full score report). Bronze $59.99 (1 test + 7-day AI Practice); Silver $89.99 (2 tests + 1-month AI Practice + Official Guide eBook); Gold $119.99 (3 tests + AI Practice 1 month + eBook + Expert Self-Study Course, struck through from $237.94). AI Practice: 1,000+ questions, 15 full mocks, 20 sectional tests, instant scoring "built on official PTE scoring traits", AI tutor. Free "Smart Prep" in myPTE: study plan, 4 guided full tests, sectional tests, video courses.
- **Real test:** 22 task types after the 2025 update; AI scores everything and humans double-mark 7 types. *(source: exam_specifications.md §1)*
- **Copy:** good-better-best test bundles. **Avoid:** inflated "was" prices.

#### E2Language — L
- **Offer:** IELTS Academic adaptive video lessons + live online classes + graded mocks + performance reports, with a free tier.
- **Pricing:** roughly $69 (90 days) to $359 (365 days); "$" unspecified (learnenglish.life, seen 31 Oct 2026).
- **Monetization:** time-boxed access. Other fields n/v. **Copy:** 90/365-day terms (cf. D5 1/3/6/12-month passes).

#### Prep (prepedu; operates in 21 countries) — M (issuer-written release) / H (pricing page)
- **Offer:** AI-powered IELTS (and TOEIC) learning; Practice Lab: Free = 1 Speaking + 1 Writing test per month with AI feedback plus free Reading/Listening practice; Core = 8 + 8 per month; Premium = unlimited practice + full IELTS video course (Band 4.0 to 7.0+) + "Teacher Bee AI" tutor. Credits reset monthly, no auto-renew, cancel anytime. **Amounts not captured** ("Loading prices").
- **Funding:** US$7M Series A announced 8 Jan 2026 (Cercano Management Asia, Northstar Ventures, Saison Capital); claims 1M+ learners, 126 exclusive test sets, 100+ certified instructors and former examiners. Revenue undisclosed.
- **Engine/AI:** AI feedback on pronunciation, coherence, task response, grammar; goal-based study plans; says scores are for tracking progress, not predicting the exact test score. Web + iOS app.
- **Strengths:** credits-by-tier model; examiner-credentialed instructors. **Weaknesses:** n/v (price not captured). **Closest global analogue to Lumen's AI model.**
- **Copy:** monthly-credit freemium (maps to D5 `ai_credits`); "tracking, not predicting" disclaimer. **Avoid:** unknown.

#### Duolingo English Test (DET) — M
- **Offer:** official fee **$70** (a third-party voucher route at $60; two-test bundle $118); about one hour, at home, adaptive, AI-scored; results in 24 to 48 hours; score 10 to 160 in 5-point steps with four subscores (Literacy, Comprehension, Conversation, Production); valid 2 years; accepted by 6,000+ institutions. Free official practice test and Official Guide exist (details not captured).
- **Monetization:** the test is the product; prep is free. *(source: global_test_prep_competitors.md §1; exam_specifications_gapfill.md §3 — duration and score range from a secondary source)*
- **Implication:** a P2 target. Pricing DET prep above a few dollars is hard because the test owner gives practice away.

#### Other IELTS AI apps and free creators (context) — L
- PrepEx: $29.99/month or $59.99/quarter; free tier 2 saved submissions/day and 1 free diagnostic; comparisons to Band 5/7/9 samples.
- Stimuler from $1.99/week (monthly $9.99 to $12.99); TestGlider $5.99/5 days, $25.99/month; IELTSpeaking $9.99/week, $29.99/month, $99.99/year + $149.99 "one-time exam marking"; Cathoven $21/week, $67.50/month; Band Score Checker free 1/day, $7.99/month. (AI Tools Bakery, read Oct 18, 2026)
- Complaints: hidden or inconsistent pricing (Stimuler, IELTSpeaking), almost no published accuracy evidence, platform fragmentation, generous scoring at the high end.
- IELTS Liz (blog + YouTube, free); IELTS Advantage and IELTS Simon: no prices retrieved.

### 2.2 Bangladesh and South Asia

#### 10 Minute School (10MS; Dhaka) — M/L
- **Offer:** free Facebook page (mid-2014), YouTube (2015), website (May 2015); app; 60+ paid Skills programmes plus 30+ free courses; HSC batches; Spoken English; IELTS in three formats; e-books; "Study Abroad Complete Guideline"; 1:1 study-abroad support bundled in the IELTS Programme.
- **IELTS tiers (H, product pages):** *Recorded course*: 50 hours, 54 videos, 38 lecture sheets, 10 Reading + 10 Listening mocks in a computer-delivered style with instant results, 600+ vocab words, weekly live Zoom doubt-solving, Facebook support group, free hardcopy book, lifetime validity. *Live Batch*: 12 weeks, 36 live classes (50-min lecture + 30-min Q&A), 12 months validity, 8 Reading + 8 Listening tests, 2 full mocks, 1:1 mentor consultations. *Programme / English Centre*: 3 months live + 3 months ancillary, 31 live classes, 12 partial + 12 speaking + 12 full mocks, 6-month Language Club, 1:1 speaking pods, progress tracking. Online prices were not shown in fetched text.
- **Offline price (H, 2024 brochure):** IELTS Regular **BDT 15,000** (3 months, 3 days a week, 2 hours each); Spoken English Junior levels BDT 15,000 each; full 9-month programme BDT 40,000; all fees include 15% VAT; unlimited mocks, 1:1 speaking tests, free repeat if the target score is missed.
- **Monetization:** freemium; paid batches (BDT 500 to 2,000 per course, L/weakly sourced); YouTube ads and corporate/telecom sponsorship (L); bKash ran a payment campaign with 10MS in Oct 2025 (listing only).
- **Support/refund (H):** 24/7 hotline 16910; 48-hour refund request window; non-refundable once more than 5 premium videos are watched or a certificate is earned; e-books non-refundable; refunds in 7 to 14 working days.
- **Funding (L, Grokipedia, totals inconsistent):** $2M seed led by Sequoia (Surge) in Jan 2022; BDT 61 crore (about $5.5M) pre-Series A led by Conjunction Capital in Oct 2023. Claims 6.7M downloads, 3.2M MAU (2023), 52% rural/semi-urban, 34% female, 3.34M YouTube subscribers (June 2025): **unverified**.
- **2024 setbacks (M, TBS News):** Startup Bangladesh cancelled a Tk 5 crore investment proposal on 16 July 2024; 10MS halted all live, revision and offline English Centre classes indefinitely from 3 Aug 2024. No official reason stated; CEO had posted in solidarity with quota protesters. Whether classes resumed is **unknown**.
- **Strengths:** Bangla-first brand, funnel from free content to centre, strong support habits, computer-style mocks. **Weaknesses:** key-person and political exposure; offline centres suspended in 2024; AI scoring not evidenced for IELTS writing/speaking.
- **Copy:** the free-to-paid ladder; Facebook group + Zoom doubt-solving as cheap scalable human help. **Avoid:** dependence on one personality or one channel; refund terms so tight (48 hours) that they erode trust.

#### Shikho / Bohubrihi — M
- **Shikho:** launched Nov 2020 for SSC/HSC and admission prep; $4M + $1.3M seed (Aug 2021, Wavemaker Partners lead; total $5.3M, articles dated 29 Mar 2022); 350,000+ users across all 64 districts; paid subscribers average 68 minutes a day; animated Bangla video lessons, question bank with solutions, performance analytics, smart notes, live classes. Subscription prices not found; 2022 data.
- **Bohubrihi (acquired by Shikho, relaunched 2023):** Oct 2023 subscription: 6 months BDT 12,000; 1 year BDT 18,000 (was 24,000) plus 6 personal live sessions; 2 years BDT 24,000 plus 16 sessions; 40+ paid Foundation courses (software, data science, business, marketing, productivity, GRE and IELTS prep) and 5 Career Tracks of 4 to 6 months.
- **Strengths:** only evidenced BD *subscription* with bundled GRE/IELTS. **Weaknesses:** n/v; data is 2022 to 2023. **Copy:** a 6/12-month pass with live sessions as the premium tier. **Avoid:** headline discounts (24,000 to 18,000) that read as manufactured.

#### Ostad — M (Prothom Alo English, 19 Mar 2023)
- Founded Oct 2020 by five KUET graduates; live, task-based courses; average Tk 6,000 per course; 28 courses; about 400 to 450 students/month; 6,000+ completed, about 3,500 reportedly placed, about 60 hiring companies; live classes for 500 concurrent students (target 1,000). Funding: $25k angel, $12k angel (Dec 2021), $90k from SBK/Miyako/SOSV (Feb 2022), $150k from SOSV (Dec 2022).
- **Copy:** live plus tasks plus placement framing for P3 tech tracks; benchmark BDT 6,000 for a course. **Avoid:** relying on outdated 2023 numbers.

#### Programming Hero — M (TBS, July 2021)
- Web development course Tk 5,500 (Tk 1,000 pandemic discount); about 5,500 enrolled; **only 33% completed**; app downloaded about 1M times at 4.8 stars; support responses within 24 hours; interview-prep class; game-style mobile app.
- **Lesson:** recorded-course completion is the failure mode. **Copy:** 24-hour support SLA; game-style practice. **Avoid:** selling recorded content without milestones and live touchpoints.

#### Mentors' Education (Dhaka; British Council test-centre partner) — H
- On-campus fees (shown Nov 2026; discounts expire 15 Nov 2026): IELTS Regular **BDT 13,800** (3.5 months, 20 mocks); IELTS Crash **BDT 9,500** (1.5 months, 10 mocks); IELTS Basic Package BDT 19,900; PTE BDT 11,903; SAT BDT 13,973; Spoken English BDT 7,556; GED BDT 60,000. Online pricing not listed. Also an IELTS exam registration channel.
- **Implication:** the offline band is BDT 9,500 to 15,000, with bundles near BDT 20,000. A recorded and AI-assisted product can sit well below it.

### 2.3 India and study-abroad services

#### PhysicsWallah (PW) — M
- FY25 (DRHP): operating revenue Rs 2,887 crore (+49% from Rs 1,941 crore); online about Rs 1,404 crore, offline about Rs 1,352 crore (about 47% of revenue); offline ARPU Rs 40,405; positive EBITDA Rs 192.5 crore; 5,096 faculty. The source notes segment figures do not reconcile. IPO: Rs 3,820 crore DRHP; listed at a 33.94% premium (Rs 146); Rs 460 crore of proceeds for offline expansion (headlines).
- **Lesson:** the winner is hybrid online + offline with human faculty and positive EBITDA. **Copy:** a hybrid arc (recorded to live to centre partnerships). **Avoid:** n/v.

#### Unacademy — M
- Sold to upGrad for about $200M, all in upGrad shares, completed 1 Sep 2026; about 94% below its $3.4B 2021 peak. FY25 revenue fell 16% to Rs 702 crore, net loss Rs 435 crore. upGrad FY25 revenue Rs 1,569 crore, loss Rs 274 crore. Business Today: "education isn't software"; test prep lacks recurring customers and CAC stays high.

#### BYJU'S — M
- $22B peak valuation (2022); about $3B Aakash acquisition; $1.2B term loan (Nov 2021); delayed audits and auditor resignations; alleged $500M+ diverted funds; insolvency proceedings from July 2024. In May 2026 a Singapore court sentenced the founder to six months in jail for non-compliance with asset orders. Sources emphasise finance and governance, not sales practices (sales complaints not fetched).
- **Scaler:** headline only (FY25 revenue down to Rs 363 crore, losses cut 98%).

#### Leverage Edu — L/M (Indian Startup Times)
- FY25: revenue Rs 173 crore (+91%), net loss Rs 106 crore. Student placement (university commissions) Rs 120.6 crore (about 70%); "Fly" financial services (loans, forex, accommodation) Rs 29.7 crore; product sales (e.g. IELTS prep) Rs 21.2 crore; Rs 51.2 crore paid in agent commissions; 76% of revenue from India. About $70M raised: $6.5M Series A (Feb 2021), $22M Series B (2022), $40M Series C (Jul 2023, **led by ETS**). Agent-partner programme; AI-plus-human-agent model (headlines only).
- **Lesson:** counselling commissions fund the business, prep is a minor line (about 12%). **Copy:** referral-based revenue after trust is earned. **Avoid:** commission-driven recommendation bias; loss-making growth (net loss of Rs 106 crore on Rs 173 crore revenue).

#### Yocket — L (YourStory, March 2020; stale)
- Students use most services free; premium end-to-end help about $500 per student; universities pay $10,000 to $100,000 a year (quoted); loan/forex providers as add-ons. Claimed 360,000 registered students, 100+ university tie-ups, about $1M revenue at the time.
- **Copy:** free tools for students, with the business paid by the demand side (universities, lenders). **Avoid:** presenting a 2020 model as current.

### 2.4 Global learning platforms

#### Khan Academy — H
- Mastery model: Not Started / Attempted / Familiar / Proficient / Mastered; each skill worth 100 points (Familiar 50, Proficient 80, Mastered 100); course mastery % = share of skills at Proficient or Mastered; Mastered reachable only via Unit Test or Course Challenge; a Mastered skill drops to Familiar if a student scores under 70% on an exercise.
- **Khanmigo (AI tutor):** teachers free; learners and parents $4/month or $44/year; districts by quote with rostering and SSO. Parent plan shows interaction history and moderation alerts.
- **Engineering:** rewrite from a Python 2 monolith to about 26 Go services (project began March 2019).
- **Copy:** mastery levels and percentage for the learner dashboard; role-based AI pricing (free teachers). **Avoid:** copying its microservice architecture; D2 says modular monolith.

#### Coursera (+ Udemy merger) — H (10-K, FY2025)
- About 197M registered learners at 31 Dec 2025; about 49% of revenue outside the US; 1,700+ paid enterprise customers; 54.4M course enrollments in 2025 (+10%); 375+ creators, with creator pay moving to engagement-based in 2025 and a platform fee on creators from 2026.
- **Pricing (Nov 2026):** Coursera Plus $399/year list ($239.40 first-year promo ending Nov 30, 2026); monthly option with 7-day trial; individual courses/programs $49 to $79/month; 14-day money-back; **certificates earned in a refunded window are revoked.**
- **Merger:** signed Dec 17, 2025 (0.800 Coursera shares per Udemy share; Udemy a wholly owned subsidiary); a 3 June 2026 article says Udemy has joined Coursera, citing 95,000 content creators.
- **Udemy marketplace (pre-merger policy; verify post-merger):** instructors receive **37%** of Net Amount on organic sales and **97%** on instructor-coupon/referral sales; Apple/Google take 30% on app-store sales; Connect 1-1 sessions pay 80% to instructors. Minimum course: 30 minutes of video, 5 lectures, 720p or 1080p; Quality Review Team gate.
- **Copy:** revocable certificates on refund; Udemy's two-tier revenue share and quality checklist for P3 marketplace. **Avoid:** auto-renewal as the only BD option (see D5).

#### Duolingo (the app) — H (Q3 2026 shareholder letter)
- Q3 2026: DAUs 64.9M (+29%), MAUs 153.1M (+13%), paid subscribers 13.1M (+14%), revenue $309.0M (+14%), adjusted EBITDA margin 25.5%, gross margin 72.9%. FY2026 guidance: revenue $1,221M. AI Video Call becomes unlimited for Super subscribers; Max tier is being sunset.
- **Mechanics:** streak with up to 2 freezes (a second freeze raised relative DAU +0.38%); 7-day-streak learners 3.6x more likely to finish (correlational); 10 weekly league tiers; Energy replaced Hearts; half-life-regression spaced repetition (error nearly half that of Leitner on 12M+ sessions; A/B daily retention +9.5% practice, +12% overall activity).
- **Independent evidence (Peru RCT, ~60,000 students):** streaks raised the chance of connecting at least once by +2.8 pp, with modest, non-significant learning effects; personalised reminders did better at starting the habit. *(source: ux_dashboards_video_gapfill.md §6)*
- **Copy:** spaced-repetition for vocab/question bank; goal-based weekly streaks with a freeze. **Avoid:** punishing daily streaks for exam prep with fixed dates.

---

## 3. Comparison matrices

### 3.1 Pricing ladder: GRE (USD, pre-tax)

| Band | Product | Price | Notes / source |
|---|---|---|---|
| Free | ETS POWERPREP Online Tests 1 and 2 | $0 | Test 1 untimed, 2 timed (ETS, H) |
| Free | GregMat free tier | $0 | one free full-length test (beta) (L) |
| Free | Magoosh trial | 7 days | plus free practice test (H/L) |
| < $20/mo | GregMat Plus | $11.99/mo | new-subscriber price (L) |
| < $20/mo | GregMat Plus + PrepSwift | $14.99/mo | $3 add-on (L) |
| Cheap | ETS ScoreItNow | $20 for 2 essays | e-rater only (H) |
| Cheap | PrepScholar | $38 / 12 months | achievable $199/12 months; lifetime + essay grading $345 (L) |
| Cheap | ETS POWERPREP PLUS | $44.95 per test | (H) |
| Mid | Magoosh Premium | $149 (1 mo) / $179 (6 mo) / $219 (+Admissions, 6 mo) | (L) |
| Mid | TTP | $179/mo; $449 (4 mo); $499 (6 mo) | regular $229/$549/$599 (L) |
| Mid | Kaplan On Demand | $240 (1 mo) / $480 (6 mo) | (L) |
| Mid-high | Manhattan Prep On Demand | $299 (1 mo) / $599 (6 mo) | (L) |
| Mid-high | Princeton Review Self-Paced | $499 | (L) |
| Live | Kaplan Live Online | $880 (3 mo) | list $1,099 (L) |
| Live | Princeton Review 10 Points+ | $899 | (L) |
| Live | TTP 6 mo + live | $1,299 | regular $1,599 (L) |
| Live | Manhattan Prep live online (GRE for MBA) | $1,999 | (L) |
| Tutoring | TTP 5 hrs | $1,700 | (L) |
| Tutoring | Manhattan Prep 10 hrs | $2,900 | 325+ guarantee (L) |
| Tutoring | Princeton Review 165+ (32 hrs) | $4,999 | (L) |

### 3.2 Pricing ladder: IELTS and adjacent (BDT and USD)

| Product | Price | Format / note |
|---|---|---|
| **IELTS on Computer exam fee (IDP BD)** | **BDT 31,100** | reference cost the learner is preparing for; One Skill Retake BDT 18,600 (H) |
| British Council IELTS Ready | Free; Premium free with BC booking | (H) |
| Cambridge Write & Improve | £4.50/month per workbook | writing only (L) |
| Band Score Checker | Free 1/day; $7.99/month | (L) |
| Stimuler | from $1.99/week; $9.99 to $12.99/month | (L) |
| TestGlider | $5.99/5 days; $25.99/month | (L) |
| PrepEx | $29.99/month; $59.99/quarter | (L) |
| IELTSpeaking | $9.99/week; $29.99/month; $99.99/year; marking $149.99 | (L) |
| Cathoven | $21/week; $67.50/month | (L) |
| E2Language | about $69 (90 days) to $359 (365 days) | video + live + mocks (L) |
| Pearson PTE Scored Practice | $35.99 each; bundles $59.99 / $89.99 / $119.99 | PTE, not IELTS (H) |
| Duolingo English Test | $70 exam | practice free (M) |
| Ostad | about Tk 6,000 per course | tech skills, 2023 (M) |
| Programming Hero | Tk 5,500 | web dev, 2021 (M) |
| Mentors' IELTS Crash | **BDT 9,500** | offline, 1.5 months, 10 mocks (H) |
| Bohubrihi subscription | BDT 12,000 (6 mo) / 18,000 (1 yr) / 24,000 (2 yr) | Oct 2023 (M) |
| Mentors' IELTS Regular | **BDT 13,800** | offline, 3.5 months, 20 mocks (H) |
| **10MS English Centre IELTS Regular** | **BDT 15,000** | offline, 3 months, incl. 15% VAT, 2024 (H) |
| Mentors' IELTS Basic Package | BDT 19,900 | (H) |
| 10MS online IELTS (recorded / live) | **not found** | gap |

### 3.3 Monetization model matrix

| Player | Freemium | One-off course | Subscription / pass | Test packs / per-test | Live / tutoring | Guarantee | B2B / institution | Commission / other |
|---|---|---|---|---|---|---|---|---|
| Magoosh | trial + free test | – | yes (1 to 6 mo) | – | – | score-up (4 conditions) | bulk from 10 accts | – |
| Kaplan / Manhattan / PR / TTP | – | – | yes | – | yes | yes (premium) | n/v | – |
| GregMat | yes | – | yes (monthly) | – | live classes in plan | none | n/v | n/v |
| ETS | yes (2 tests) | guides | – | yes ($44.95) | – | – | – | exam fee |
| British Council | yes | – | – | – | paid courses | – | – | exam-fee funnel |
| Pearson PTE | yes (Smart Prep) | – | AI Practice (timed) | yes + bundles | – | – | – | exam fee |
| Prep | yes (credits) | – | tiered credit plans | – | – | – | n/v | – |
| DET | yes (practice) | – | – | – | – | – | – | exam fee |
| 10MS | yes | yes | – | – | batches + centres | repeat if target missed (centre) | n/v | YouTube ads, sponsors (L) |
| Bohubrihi | n/v | 40+ courses | yes (6/12/24 mo) | – | personal sessions | – | n/v | – |
| Ostad / Prog. Hero | n/v | yes | – | – | live (Ostad) | – | n/v | placement framing (Ostad) |
| Mentors' | – | – | – | – | offline | – | – | exam registration channel |
| PhysicsWallah | n/v | n/v | n/v | n/v | offline ~47% revenue | – | – | – |
| Leverage Edu | – | prep ~12% | – | – | – | – | – | university commissions ~70%; loans/forex |
| Yocket | yes (tools) | – | – | – | premium ~$500 | – | universities pay | loans/forex (2020) |
| Khan / Khanmigo | yes | – | $4/mo or $44/yr | – | – | – | districts | teachers free |
| Coursera | yes | – | Plus $399/yr | – | – | 14-day refund | 1,700+ enterprise | degrees (% of tuition) |
| Duolingo | yes | – | Super (13.1M subs) | – | – | – | n/v | ads (Energy refills) |

### 3.4 Content-format matrix

| Player | Recorded video | Live | Question bank | Full mocks | AI feedback | Flashcards / vocab | Books | Community | 1:1 human |
|---|---|---|---|---|---|---|---|---|---|
| Magoosh | yes | – | yes | yes (6 in Premium) | n/v | 1,000+ | – | n/v | – |
| GregMat | yes | yes | yes | 1 free | n/v | vocab tool | – | live events | – |
| ETS | – | – | yes | yes | e-rater (essays) | – | guides | – | – |
| British Council | modules | webinars | yes | 40 (Premium) | optional | – | – | – | – |
| Pearson PTE | courses | – | 1,000+ | 15 AI mocks + scored tests | yes | – | eBook | – | expert course |
| Prep | yes | – | yes | yes | yes | n/v | – | n/v | instructors |
| 10MS | yes | yes | yes | 10+10 (recorded course) | n/v | 600+ words | free hardcopy | FB group | 1:1 mentor / speaking |
| Mentors' | n/v | offline | n/v | 10 to 20 | – | – | n/v | – | offline |
| Bohubrihi | yes | sessions | n/v | n/v | n/v | – | – | n/v | live sessions |
| Khan | yes | – | yes | unit tests | Khanmigo | – | – | – | – |
| Duolingo | – | – | exercises | – | Video Call | spaced repetition | – | leagues | – |

### 3.5 Distribution-channel matrix

| Player | Free content (YouTube / blog) | Social groups | Search / SEO | App store | Partnerships | Notes |
|---|---|---|---|---|---|---|
| 10MS | Facebook, YouTube (3.34M subs, L) | support FB group | n/v | Google Play app | bKash campaign (Oct 2025) | free-to-paid funnel |
| IELTS Liz | blog + YouTube | n/v | strong (inferred) | – | – | free |
| GregMat | free resources | live events | n/v | app-less | – | YouTube unverified |
| British Council / IDP | – | – | – | – | 32+ banks 0% EMI (IDP) | exam-fee funnel |
| Prep | – | – | – | iOS app, web | 21 countries | funded ($7M Series A) |
| Leverage Edu | – | – | – | – | agent-partner programme | commission-driven |
| Yocket | free tools | – | – | – | universities | 2020 data |
| Review ecosystem | – | – | review sites (Katalyst, EdisonOS) | – | affiliate links not verified | influences GRE buyers |
| Programming Hero | – | – | – | app ~1M downloads | – | 2021 |

### 3.6 Feature matrix: engine and platform

| Player | Mock-engine fidelity | AI scoring | Live classes | Mobile app | Bangla support | Community |
|---|---|---|---|---|---|---|
| ETS POWERPREP | **Real GRE engine** (PLUS: free navigation within sections) | e-rater essays | – | n/v | – | – |
| Pearson PTE | Same format and scoring engine as real test | AI Practice | – | n/v | – | – |
| British Council | Mocks with model answers; Express Mock | optional AI + estimated band | webinars | n/v | – | – |
| Magoosh | n/v | n/v | – | n/v | – | n/v |
| GregMat | n/v | n/v | yes | app-less | – | live events |
| Prep | Strict timing mocks (reported) | yes | n/v | iOS + web | – | n/v |
| PrepEx etc. | Section-timed tests | yes (no validation) | – | web / iOS | – | – |
| 10MS | "Computer-delivered style" mocks | n/v | yes | yes | **yes** | FB group |
| Mentors' | n/v | – | offline | n/v | likely (inferred) | – |
| Shikho / Bohubrihi | n/v | n/v | yes | subscription app | **yes** (Bangla lessons) | n/v |
| Programming Hero | – | – | – | yes (~1M downloads) | n/v | – |
| Khan | – | Khanmigo | – | yes | – | – |
| Duolingo | – | Video Call | – | yes | – | leagues |

---

## 4. Lessons from failures and setbacks

| Case | What happened (source) | Lesson for Lumen |
|---|---|---|
| **BYJU'S** | $22B peak (2022), $1.2B term loan (Nov 2021), delayed audits, insolvency proceedings from July 2024, founder sentenced in May 2026 (Business Today) | No debt-funded acquisition sprees; clean books from day one; audited accounts. |
| **Unacademy** | Sold for about $200M in upGrad shares (1 Sep 2026), about 94% below peak; FY25 revenue down 16% (Business Today) | Test prep is not a naturally recurring business; CAC stays high. Plan for repeat product ladders and B2B. |
| **10MS 2024** | Startup Bangladesh cancelled a Tk 5 crore proposal (16 Jul 2024); live, revision and offline classes halted from 3 Aug 2024 (TBS) | Political and key-person shocks are real. Do not depend on one personality, one channel or one funder; keep recorded and digital products running when live operations stop. |
| **Programming Hero** | 33% completion on a recorded web course (TBS, 2021) | Offer live touchpoints, milestones and a 24-hour support SLA; track completion as a KPI. |
| **Scaler** | FY25 revenue fell to Rs 363 crore (headline only) | Do not use as evidence; flagged as unverified. |
| **Guarantee traps** | Magoosh has 4 and PrepScholar 6 refund conditions | If Lumen offers a guarantee, keep it simple. |
| **AI-app pricing opacity** | In-app prices differ from store descriptions (Stimuler, IELTSpeaking) | Publish prices and credit costs plainly. |
| **Shaky data** | Several 10MS figures come from an AI-generated wiki with flagged citations | Verify before quoting 10MS user counts in any investor material. |

---

## 5. Gaps in the research (do not paper over)

- No revenue, subscriber or conversion figures for Magoosh, GregMat, TTP, Kaplan, Princeton Review, E2Language or IELTS Liz.
- 10MS online IELTS prices, current (2026) user numbers, tech stack, payment gateway list and whether English Centres reopened after Aug 2024: not found.
- No screenshots or walkthroughs of any mock-test interface other than ETS POWERPREP's description; mark-for-review, navigator and review screens are unverified.
- IDP's own prep app, British Council Bangladesh prices, Udvash-Unmesh, Interactive Cares, Ghoori Learning and Saifurs: not researched.
- Post-merger Udemy instructor terms: not found; the 37% / 97% split should be re-checked before quoting it in investor material.
- Magoosh IELTS and TOEFL prices; Prep prices; IELTS Advantage and IELTS Simon products.
- Reddit, Trustpilot and Facebook complaint threads for most competitors were not read.

---

## 6. White space and differentiation for Lumen

| # | Opportunity | Evidence from the notes | How Lumen executes (phase) |
|---|---|---|---|
| 1 | **Faithful IELTS-on-computer simulator with a Bangla-supported UI.** The paper test ended in Bangladesh after 31 Jan 2026; computer is now the only format. IDP documents the computer features: highlighter, notepad, split-screen, on-screen timer, flag, navigation, auto-save, adjustable text. | 10MS mocks are "computer-delivered style"; no source shows a full feature-faithful engine with Bangla UI. | P1 test engine (D6): server-held deadlines, autosave, pinned question versions, per-module band tables as editable data. Bangla only in the shell and instructions, never in test content. |
| 2 | **Published AI-scoring accuracy.** | Competitors publish little or no validation; Band Score Checker's own test had 79% / 70% within 0.5 band; IDP warns against LLM grading. | Publish a validation page (agreement with certified examiner marks within 0.5 band, confidence range, known weaknesses such as Task Response and unusual accents). Label all bands "estimated" (D6). |
| 3 | **Honest, transparent pricing.** | Hidden/inconsistent in-app prices; permanent "was" prices; multi-condition guarantees. | One price list, no fake discounts, plain refund terms (D5: 7 days if under 20% consumed). |
| 4 | **Affordable BDT micro-transactions.** | Offline IELTS BDT 9,500 to 15,000; subscriptions BDT 12,000 to 24,000; IELTS exam BDT 31,100. | Test packs, AI credit packs and 1/3/6/12-month passes in BDT via SSLCommerz (bKash/Nagad). |
| 5 | **Study-abroad funnel.** | Leverage Edu earns about 70% of revenue from commissions; Yocket charges universities; 10MS bundles 1:1 study-abroad support. | P2/P3 ethical referral programme (see business plan §6), after trust is earned. |
| 6 | **Hybrid human help at low cost.** | 10MS FB group + Zoom; Ostad live; PhysicsWallah's offline arm. | Community Q&A, weekly doubt-solving, human grader override (D4 `grader`). |
| 7 | **Combined IELTS + GRE + later PTE/DET under one pass.** | Competitors specialise; AI IELTS apps do not cover GRE. | One `pass` entitlement (D5). |
| 8 | **B2B tools coaching centres lack.** | Magoosh institutional: no custom mocks, proctoring or deep reports (competitor-written). | P2 `org_admin`: upload custom mocks, cohort analytics, seat packs. |
| 9 | **Mastery-based dashboard.** | Khan's five-level model is fully documented; Magoosh's predictor needs labelled data. | Khan-style skill levels; a transparent heuristic predictor that gets calibrated from self-reported exam results. |
| 10 | **Revocable certificates and verification.** | Coursera revokes certificates on refund. | `/verify/[code]` page (P1, unguessable code, D12 C4/C11), LinkedIn Add-to-Profile URL (P3). |

**What not to do:** compete on "official" status (ETS, Pearson and the British Council own that); build a native app before the web engine is solid (D1); copy 10MS's offline footprint (capital-heavy, and suspended in 2024).

---

## 7. Questions for the founder

1. ~~Which product did you mean by "collegeapp"?~~ **Answered (2026-11-07): Common App** (00 change log; see Addendum A and `21`).
2. Is the first public launch IELTS-only, or IELTS plus GRE? (The business plan models both; GRE demand is smaller.)
3. Do you have a verified source for 10MS online IELTS prices? Please check their live pages; the research could not read them.

---

## Addendum A — Founder-supplied competitor data and Common App (consolidation, 2026-11-07)

> **Provenance.** Everything in the two tables below comes from a **founder-supplied comparison table (Nov 2026)** that was not in the research notes; it has **not** been independently verified against the vendors' live pages. Treat every figure as **L (low confidence)** until checked, and do not use any of it in public marketing without a fresh check of the vendor pages. Where it conflicts with the earlier Magoosh GRE figures above (which came from Katalyst/EdisonOS, Oct-Nov 2026), both are kept: the earlier figures are GRE, the founder table is IELTS. Source label used below: **"founder-supplied comparison table, Nov 2026"**.

### A.1 Magoosh IELTS — feature and price row (founder-supplied)

| Item | Magoosh IELTS (founder-supplied) | Lumen position (17 / 34 / D12) |
|---|---|---|
| Price | **$109 for 1 month; $129 for 6 months** (IELTS) | Core, region A, 6 months: $89 (IELTS Academic) / $79 (GT); Plus $149; passes 1 month $24.99 / 3 months $59 (17 §2.1, §5). Lumen's 6-month Core is below Magoosh's 6-month price; Plus is above it but adds human reviews and live Q&A |
| AI tutor | Yes | **Ask Lumen** (34 §2), source-grounded with citations; Free 10 / Core 30 / Plus+ 150 messages per day |
| Flashcards | Yes | FSRS flashcards (D12 C26; 34 §3) |
| Score predictor | Yes | "Estimated" predictor (34 §4), heuristic in P1, calibrated in P2 |
| Money-back guarantee | Yes (7-day money-back) | 7-day no-questions money-back on every self-paced product (D12 C13b; F-PAY-14) |
| "Hit-your-target" guarantee | Yes (conditional) | Plus **Target Promise** (free 3-month extension, no cash) and Mentor **Progress Promise** (free re-enrolment) (D12 C13b); never a cash score guarantee |
| Mobile app | Yes | PWA in P1; Expo app P3 (D1; 34 §9) |
| Free trial | Yes | Free tier + 7-day Plus trial, no card (17 §2.2) |

*Implication:* feature parity with Magoosh on the six items above is a stated founder goal and is specified in `34-AI-LEARNING-FEATURES.md`; the differentiators remain human review options, Bangla support, mock-test fidelity and published AI-accuracy (section 6).

### A.2 BestMyTest and E2Language — price rows (founder-supplied)

| Competitor | Price (founder-supplied) | Notes |
|---|---|---|
| **BestMyTest** | **$249 for 6 months** | Source: founder-supplied comparison table, Nov 2026. Product scope, AI features and refund terms **not read** (34 OQ-12). Not previously profiled in this file |
| **E2Language** | **$269 for 12 months** (per the founder's table) | Source: founder-supplied comparison table, Nov 2026. **Conflicts with the earlier E2Language range above** ("about $69 for 90 days to $359 for 365 days", learnenglish.life review site, L). The two are not necessarily incompatible (different plans), but the founder's figures should be confirmed on e2language.com before use |

*Implication:* at $249-$269 these two sit at the high end for self-paced-plus-live IELTS preparation; Lumen's Live tier in region A ($299 for 12 weeks with a teacher, 17 §2.1) is in the same band, and Core/Plus are well below it.

### A.3 Common App (now confirmed) — profile pointer

Common App (the Common Application) is the US undergraduate application portal and is **not a test-prep competitor**; it is the target system for Lumen's *Admissions & Applications* product line. Facts about how it works, its scale and what the product does and does not do (feedback and structure only, never ghostwriting; no Common App integration) are in `21-ADMISSIONS-COMMON-APP.md` §0-§1 and §3; services and prices are in `17-PRICING-MASTER.md` §10; the competitor set for that line (Yocket, Leverage Edu, CollegeVine, free-to-student agents) is profiled in 21 and in section 2.3 above. Trademark wording: "Common App is a trademark of its owner; we are not affiliated with or endorsed by it" (D12 C31).
