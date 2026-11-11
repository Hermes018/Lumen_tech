# Marketing and segment gap-fill: international market and Bangladesh gaps (as of 2026-11-07)

Scope: fills gaps in bd_segments_marketing.md. About 30 tool calls used (slightly over the 25 budget). Many items are thin; "Gaps" lists what was not found. Third-party summaries are flagged.

## A1. Largest IELTS/PTE/DET source countries and volume data

### Takeaway
No audited global or per-country test-taker counts are public. The best public signal is direction: IDP language-testing volume fell 8% in FY26 and India collapsed (-50% FY25, -27% H1 FY26). Ex-India volumes were roughly flat. IDP expects a further 20-30% fall in its overall market volume planning for FY27.

### Cited Findings
- IDP FY26 (year to 30 June 2026): Language Testing volume fell 8% YoY and yield rose 7%. The release gives no absolute count, no country commentary, and does not name visa caps (it cites "policy settings" reducing student mobility). — [IDP FY26 release](https://careers.idp.com/news/fy26research)
- IDP cut its IELTS venues from about 1,500 to under 600 and moved to third-party delivery. IELTS is recognised by more than 13,500 organisations. FY27: IDP expects Language Testing yield to grow mid-single-digit, and its volume planning assumes a 20-30% decline in market volume versus FY26. — [IDP FY26 release](https://careers.idp.com/news/fy26research)
- IDP FY25 English Language Testing volume was 1,293,800, down 18% from 1,584,100 (covers all test types, not only IELTS). British Council reported 2.3M IELTS tests in the 12 months to 31 March 2025. The periods overlap, so the figures cannot be added. — [Lingobright summary (secondary, dated 13 Aug 2026)](https://www.lingobright.com/statistics/ielts-test-taker-statistics-worldwide-and-by-country/), which cites the BC Annual Report 2024-25 and IDP FY25 results presentation
- IDP IELTS volumes by market: India -50% in FY25 and -27% in H1 FY26; ex-India +2% in FY25 and +1% in H1 FY26. FY25 growth markets: Australia, Canada, Vietnam, Kazakhstan, Uzbekistan. H1 FY26: Canada, Australia, Indonesia, Kazakhstan, Thailand. British Council cited weaker Sub-Saharan Africa and South Asia, offset by China growth. IDP linked India's drop to a 29% fall in Indian study-visa applications to Australia, the UK and Canada. — same Lingobright page (secondary)
- IDP FY26 results also covered by The Motley Fool AU, Quartr, FNArena and PIE News. Not fetched; headlines indicate a steep profit drop and a share price fall of about 24% on results day. — [Fool.com.au](https://www.fool.com.au/2026/08/20/idp-education-posts-steep-fy26-profit-drop-but-stays-on-transformation-track/), [PIE News](https://thepienews.com/idp-warns-of-further-student-volume-drops-as-revenue-plummets/) (headlines only)

### Inferences
- The student-visa-driven test market is shrinking, so a platform should not assume a growing IELTS-for-study pool in India/Nepal/Bangladesh. Migration (Canada PR, Australia skilled), health professionals, and non-study uses are more resilient.
- A shrinking test market plus IDP moving to third-party venue delivery suggests more test-centre availability gaps and room for prep brands to position around "any test: IELTS, PTE, DET, OET, CELPIP".

### Gaps
- No per-country IELTS/PTE/DET test-taker numbers (IELTS.org test-statistics page exists but was not read). Nothing found for Nigeria, Pakistan, Nepal, Philippines, Vietnam, Iran, Brazil or Gulf expat volumes. Nothing on PTE or DET volumes (Pearson/Duolingo reports not searched).

## A2. How international test-prep brands acquire customers

### Takeaway
Only Reddit rules were verified. r/IELTS is hostile to paid-service promotion. No usable published SEO volumes, CPCs, affiliate rates, Discord, TikTok or ASO data were obtained.

### Cited Findings
- r/IELTS rules (moderator post, Aug 2024; verify current): links to paid services are allowed only if they lead to British Council or IDP services or to services pinned by moderators. Badged teachers may share their own guides or articles but "not paid services". Teachers looking for students may not post. Unofficial guides, articles or videos are allowed only from well-known sites. Unofficial or experimental AI tools may not be promoted. Requests for DMs are removed except in study-partner posts. Claiming to be an examiner or teacher without proof, or usernames implying official sources, bring a ban. Spam leads to an immediate ban. — [r/IELTS rules mirror](https://axebps-redlib.hf.space/r/IELTS/comments/1etuoi6/rielts_community_rules) (a Redlib mirror of a moderator post; confirm on reddit.com)
- Generic Reddit self-promotion guidance exists (e.g. the 90/10 contribution norm). Not verified here. — [Redship](https://redship.io/blog/reddit-self-promotion-rules-2026) (vendor blog, weak)
- SEO-tool pages for IELTS sites exist (Ahrefs `ahrefs.com/websites/ielts.org`, Semrush site overviews) but the figures were not retrieved; no published volumes for "ielts mock test", "ielts writing task 2 band 9 sample" or "gre practice test" were confirmed.

### Inferences
- Reddit is a trust/credibility channel, not an acquisition channel. The viable approach is free official-aligned help and a "badged teacher" profile, with no paid links in r/IELTS.
- IDP/BC resource links being privileged on r/IELTS means the platform should avoid positioning as "official".

### Gaps
- Not found: YouTube teacher channel sizes (E2Language, IELTS Liz, IELTS Advantage), keyword volumes, CPCs, affiliate rates, Discord communities, TikTok/Reels norms, ASO keyword data (AppGoblin pages for IELTS apps exist but were not read). Needs Ahrefs/Semrush free tools or YouTube pages directly.

## A3. Purchasing-power pricing

### Takeaway
Paddle supports per-country price overrides and automatic currency conversion. Coursera has launched India-specific region-aligned pricing, with up to 60% lower prices in India. Stripe, Udemy and Duolingo specifics were not confirmed.

### Cited Findings
- Paddle: two mechanisms, (1) automatic currency conversion of the base price, and (2) country-specific pricing via `unit_price_overrides` (country code plus custom amount and currency, even a different currency). Checkout priority is country override, then auto-converted price, then base price. Location is geolocated; customers can change country and see that country's prices. API updates must resend the full override list. — [Paddle developer docs](https://developer.paddle.com/build/products/offer-localized-pricing/)
- Stripe has `localize prices` docs and an "adaptive pricing" feature (currency conversion, not PPP discounting); not read. — [Stripe docs](https://docs.stripe.com/payments/checkout/localize-prices) (search listing only)
- Coursera announced region-aligned pricing for India on 9 Sept 2025: up to 60% lower than before. Specializations/Professional Certificates from INR 1,699/month, Coursera Plus INR 2,099/month or INR 13,999/year, individual course INR 2,699. The rollout is described as more than 100 countries, with no country list. — [CXOToday (press-release based)](https://cxotoday.com/media-coverage/coursera-introduces-region-aligned-pricing-to-make-learning-up-to-60-more-affordable-in-india/)
- Udemy has published global/international pricing pages (Jan 2022 update, Feb 2024 deals program) but the details were not read. — [Udemy instructor update](https://teach.udemy.com/january-2022-global-pricing-update/) (listing only)

### Inferences
- Ahead-of-checkout geo-pricing (BD tier vs. India/Pakistan/Nepal tier vs. high-income tier) is technically straightforward on Paddle. Abuse (VPN) risk is a known trade-off; not researched here.

### Gaps
- Duolingo regional pricing not found. No published tier ratios from Udemy. No Paddle fee schedule or Bangladesh payout support checked (important: Paddle merchant-of-record eligibility for a Bangladesh-based seller was not verified).

## B4. 10 Minute School playbook

### Takeaway
Almost nothing citable on the playbook was obtained. Founder, dates and investor facts only.

### Cited Findings
- Founded 2015 by Ayman Sadiq; website launched 17 May 2015; YouTube channel from August 2015, starting with short maths and English video lessons. Robi was an official sponsor. Seed funding in 2022 included Sequoia Capital. Subscriber and follower counts are not given. — [Wikipedia](https://en.wikipedia.org/wiki/10_Minute_School) (Wikipedia gives no figures; verify Sequoia round elsewhere)
- Third-party stat sites exist for Ayman Sadiq's channel (vidanalyze, Social Blade, Favikon) but counts were not retrieved. — [VidAnalyze](https://vidanalyze.com/channel/aymansadiq)

### Gaps
- Subscriber/follower counts, content style, free-funnel mechanics, Robi/Grameenphone zero-rated access terms, revenue: not found. Recommend direct checks of the YouTube/Facebook pages and the Future Startup/TBS profiles.

## B5. Creator costs and Facebook IELTS groups

### Takeaway
Not found.

### Gaps
- No published BD influencer rate cards and no Facebook IELTS group sizes found (not searched with dedicated queries due to budget). Treat any figures from agency blogs as weak.

## B6. Offline channels

### Takeaway
UDCs exist but are weakened, so they suit low-tech assisted sales only as a pilot. BMET TTC network offers Japanese language at 53 centres. Probashi Kallyan Bank launched a Tk10 lakh collateral-free language-course loan on 31 March 2026 for study-abroad language training (Japan, Korea, China, Germany).

### Cited Findings
- UDCs: a TBS article (7 Oct 2024) cites 5,591 UDCs; Local Government Division said it had no updated figure on how many are operational. Services include birth/death registration, exam results, online university admissions, mobile banking, computer training, job information, visa application and tracking, and printing. The centres are said to have shrunk mainly to birth/death certificates, equipment is about 14 years old, demand has fallen, and some entrepreneurs say workload has roughly halved. Each UDC launched 11 Nov 2010 with two entrepreneurs (one male, one female). — [TBS News](https://www.tbsnews.net/node/960076)
- A2i / Sublime plan for 50,000 digital centres (Daily Star headline; not read) — [Daily Star](https://www.thedailystar.net/business/organisation-news/news/a2i-sublime-set-50000-digital-centres-3543891)
- BMET: Japanese language training is offered at 53 Technical Training Centres, 15 of them with hybrid (online) training; more than 200 private language institutes operate nationwide; 95 recruiting agencies are authorised by Japan. Japan targets 820,000 SSW workers across 16 sectors by March 2029, and experts think Bangladesh could supply up to 40%. About 4,000 Bangladeshi students went to Japan on student visas in 2025 with a 2026 target of 10,000. — [TBS News](https://www.tbsnews.net/bangladesh/bangladesh-prepares-send-manpower-japan-under-ssw-category-1423636) (undated in fetch; likely 2025)
- Probashi Kallyan Bank "Loan for Language Education and Special Skills for Overseas Employment" (announced 31 March 2026): up to Tk10 lakh, no collateral, 11% a year, up to 3 years' repayment; applicants must be under 40, hold an offer letter from a school in the destination country and show basic proficiency (Japan N5 or Korea TOPIK Level 3); the loan is paid to the institution. This is for courses abroad, not for prep platforms. — [TBS Graduates](https://tbsgraduates.net/?p=29481)

### Inferences
- The PKB loan cannot be used to pay a domestic online prep platform, per the stated purpose (tuition paid to an offer-letter institution abroad). Pre-departure prep is not covered.
- Segment (c) acquisition via UDCs is plausible for assisted onboarding, but UDC quality is declining, so it is a low-confidence channel.

### Gaps
- BMET total TTC count (the 53 is only Japanese-language centres); Korean/Arabic course availability at TTCs; BRAC Migration Programme; a2i official UDC current count and any 2025-26 data.

## B7. Destination-language tests for low-income migrants

### Takeaway
Korea's EPS-TOPIK is a short, norm-referenced MCQ test run through BOESL, and Bangladesh has filled only a small share of its quota. Japan relies on JFT-Basic/JLPT (details not verified in this pass).

### Cited Findings
- EPS-TOPIK: 50 minutes (25 listening + 25 reading), 40 questions (20 each), 100 marks. Norm-referenced: minimum 60/100 for manufacturing and 45/100 for other industries, with passing places filled in score order up to the round's intake. Fee USD 28 or local equivalent. A pass is valid for 2 years. Registration is individual and in person through the national sending agency; for Bangladesh that is BOESL. HRD Korea provides self-study booklets with audio. — [SeoulStart guide (third-party, not official)](https://seoulstart.com/guides/eps-topik-registration-guide); confirm on HRD Korea / boesl.gov.bd
- Korea quota for Bangladesh: 39,255 slots over 5 years, with job orders for 17,247 and 14,829 sent (about 37%). Per year (sent vs quota): 2025 1,244 by September vs 10,300; 2024 2,779 vs 11,700; 2023 4,804 vs 10,200; 2022 5,891 vs 5,941; 2021 111 vs 1,114. After the language test come a skill test and medical test; a rostered worker who does not travel within two years must retake tests. BOESL, the only state-owned recruiter, sends candidate lists via HRD Korea, and Korean employers choose from three profiles. BOESL hoped to send 4,000 in 2025. — [Bonik Barta](https://en.bonikbarta.com/bangladesh/pkKgcbRkEm2eZOVa) (article date not given in fetch; data to Sept 2025)
- BMET says a mandatory language test applies to Korea, Japan and Hong Kong — already in the first-pass note ([Financial Express](https://today.thefinancialexpress.com.bd/print/third-language-push-aims-to-boost-global-job-prospects-1772215386)).

### Inferences
- The demand signal for Korea is volatile: the test pool is large but placements are demand-limited (employer job orders), so claims like "pass EPS-TOPIK = job in Korea" would be misleading.
- Free HRD Korea materials set a price ceiling for EPS-TOPIK prep.

### Gaps
- Next EPS-TOPIK round dates and Bangladesh round schedule; JFT-Basic/JLPT N4 details for SSW (Bangladesh-specific test dates, fees); Gulf language rules; Romania/Croatia/Europe work-permit language requirements. Not found.

## B8. Language requirements for middle-aged skilled/family applicants

### Takeaway
Canada FSW needs CLB 7 (IELTS General 6.0 each band); CEC depends on TEER. UK skilled B2 is in force since 8 Jan 2026, while UK family-route increases remain partly proposed. NMC detail was only partly verifiable.

### Cited Findings
- Canada Express Entry: accepted English tests are CELPIP-General, IELTS General Training and PTE Core. IELTS Academic is not accepted. CLB 7 equals CELPIP 7, IELTS 6.0 each, PTE Core 60 (reading/listening), 69 (writing), 68 (speaking). FSW needs CLB 7 in all four abilities; CEC CLB 7 for TEER 0/1 and CLB 5 for TEER 2/3; FST CLB 5 speaking/listening and 4 reading/writing. Results valid under 2 years. Citizenship needs CLB 4 speaking and listening for ages 18-54. — [Immigration2Canada (third-party; check IRCC)](https://www.immigration2canada.com/ircc-language-requirements-update-2026/amp/)
- UK: B2 for new Skilled Worker, Scale-up and HPI applicants from 8 Jan 2026; B1 still applies to extensions of visas granted before then. The white paper proposed English for adult dependants (A1 on entry, rising to A2, then B2), but the source says it is unclear which parts are in force as of mid-2026. Settlement B2 from March 2027 is described inconsistently ("announced" vs "enacted"). — [Tarve (law-firm blog, internally inconsistent dates; verify on gov.uk)](https://tarve.co.uk/blog/uk-immigration-rule-changes-march-2026)
- NMC: accepts Academic IELTS and OET. The 2022 blog says the per-skill required scores are unchanged (6.5 IELTS or C+/300 OET per domain, with the overall IELTS 7.0 not confirmed in this page), and from January 2023 candidates may combine two tests with minimums of writing 6 (IELTS) / C (OET) and the other three at 6.5 / C+, with the second test within 12 months. — [NMC blog (18 Oct 2022, archived)](https://www.nmc.org.uk/news/news-and-updates/blog-were-making-changes-to-our-english-language-requirements/). The NMC later published a statement on proposed changes (not read).
- IDP Bangladesh sells IELTS Life Skills A1/B1 (from first-pass note).

### Inferences
- Because Canada accepts IELTS General Training, CELPIP and PTE Core, the platform's Canada track should be test-agnostic, with CLB 7 as the target.
- Australia was not researched.

### Gaps
- CELPIP availability in Bangladesh not confirmed (CELPIP site result not fetched). Australia Competent English and PTE acceptance, NZ, spouse-visa levels in force, Life Skills status, current NMC scores (a later change is possible), OET availability in Bangladesh: not verified.

## B9. Seasonality in Bangladesh

### Takeaway
Exam calendar is shifting: SSC 2027 runs 7 Jan - 6 Feb 2027 and HSC 2027 runs 6 June - 13 July 2027, which pushes HSC results later in 2027 than the usual cycle. Ramadan/Eid 2027 dates were not verified.

### Cited Findings
- SSC 2027: 7 Jan to 6 Feb 2027 (before Ramadan). HSC 2027: 6 June to 13 July 2027. Results currently take about two months after exams end, which the government aims to shorten. The aim is to align with university admissions. The 2026 HSC exams were scheduled to begin 2 July 2026. — [Financial Express](https://thefinancialexpress.com.bd/national/ssc-exams-in-january-hsc-in-june-from-2027)
- A Prothom Alo piece says the government weighed a March SSC schedule instead of January (unread). — [Prothom Alo](https://en.prothomalo.com/youth/education/edmbn1nbqa)

### Inferences
- If the 2027 plan holds, HSC results would be around September 2027 (exam end 13 July plus about two months), which affects Sept/Jan intake timing. This is my arithmetic, not a published date.
- For 2027, Ramadan is expected to begin in early-to-mid February with Eid-ul-Fitr in early March (astronomical estimate from general knowledge, unverified; SSC finishing 6 Feb is described as "before Ramadan"). Confirm via a calendar source.

### Gaps
- HSC 2026 results date and the 2026-27 public university admission test dates; Eid-ul-Adha 2027 date; study-abroad intake campaign timing in Bangladesh.
