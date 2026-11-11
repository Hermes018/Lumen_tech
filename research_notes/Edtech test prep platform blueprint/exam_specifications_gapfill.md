# Exam Specifications Gap-Fill (IELTS, TOEFL iBT, PTE, DET, GRE, trademarks, fees) as of Nov 2026

Scope note: fills only gaps in exam_specifications.md. Many official pages failed to fetch (ets.org GRE content page, ets.org TOEFL .org page, ielts.org per-skill pages, Duolingo guide, Pearson PTE format page). Items labelled UNVERIFIED are background knowledge, not sourced in this pass. ~24 tool calls used.

## 1. TOEFL iBT (format from 21 Jan 2026): sections, tasks, counts, timings, adaptivity, scale

### Takeaway
Now officially confirmed on ETS: four sections in order Reading, Listening, Writing, Speaking; 50/47/12/11 items; about 30/29/23/8 min base time (about 90 min); adaptive; 1-6 scale in half points. ETS says allow "about two hours" in total, which conflicts with the earlier 67-85 min figure.

### Cited Findings
- Reading: 50 items, ~30 min; tasks Complete the Words, Read in Daily Life, Read an Academic Passage — [ETS (EU site)](https://www.eu.ets.org/toefl/score-users/ibt/about/content-structure.html); same table on [ETS](https://www.ets.org/toefl/ibt/about/content/)
- Listening: 47 items, ~29 min; tasks Listen and Choose a Response, Listen to a Conversation, Listen to an Announcement, Listen to an Academic Talk — [ETS (EU site)](https://www.eu.ets.org/toefl/score-users/ibt/about/content-structure.html)
- Writing: 12 items, ~23 min; tasks Build a Sentence, Write an Email, Write for an Academic Discussion — [ETS (EU site)](https://www.eu.ets.org/toefl/score-users/ibt/about/content-structure.html)
- Speaking: 11 items, ~8 min; tasks Listen and Repeat, Take an Interview — [ETS (EU site)](https://www.eu.ets.org/toefl/score-users/ibt/about/content-structure.html)
- Base times exclude directions; "about two hours" total; item counts/time can vary because the test adapts — [ETS (EU site)](https://www.eu.ets.org/toefl/score-users/ibt/about/content-structure.html)
- Score: four section scores plus overall, 1-6 in half-point steps; overall = mean of sections rounded to nearest half band; comparable 0-120 overall also given for two years after Jan 2026 — [ETS (EU site)](https://www.eu.ets.org/toefl/score-users/ibt/about/content-structure.html)
- Delivery: test centre or Home Edition with live human proctor — [ETS](https://www.ets.org/toefl/ibt/about/content/)
- Previously noted (first pass): Reading and Listening are adaptive (multistage); Speaking section order is last — [ETS](https://www.ets.org/toefl/teachers-advisors-agents/ibt/teaching/upcoming-updates-jan-2026.html)

### Inferences
- Sum of base times = 90 min; first pass's 67-85 min (Sabanci) likely excluded something or reflects fewer adaptive items. Use ETS's 90 min base plus directions/overhead in the engine; make per-section timers config data.
- Counts are "may vary", so store item count per module, not a fixed constant.

### Gaps
- Per-task item counts within each section, and which sections (beyond Reading/Listening) are adaptive per ETS, not retrieved. Task-level timings not retrieved.

## 2. PTE Academic: task list and timings

### Takeaway
22 scored task types across three parts, with sub-timings. Per-task question counts were not found on any fetched page.

### Cited Findings
- Part 1 Speaking & Writing (76-84 min, 9 types): Read Aloud (30-40 s prep); Repeat Sentence (3-9 s audio, 15 s answer); Describe Image (25 s prep, 40 s response); Retell Lecture (10 s prep, 40 s response); Answer Short Question (10 s); Summarize Group Discussion (10 s prep, 2 min response); Respond to a Situation (10 s prep, 40 s response); Summarize Written Text (10 min); Write Essay (20 min, 200-300 words) — [PrepEx](https://prepex.ai/pte/format) (third-party)
- Part 2 Reading (23-30 min, 5 types): Fill in the Blanks (Dropdown), Multiple Choice Multiple Answers, Reorder Paragraphs, Fill in the Blanks (Drag and Drop), Multiple Choice Single Answer — [PrepEx](https://prepex.ai/pte/format)
- Part 3 Listening (31-39 min, 8 types): Summarize Spoken Text (60-90 s audio, 10 min incl. audio), MC Multiple Answers (80-120 s audio), Fill in the Blanks type-in (30-60 s), Highlight Correct Summary (30-90 s), MC Single Answer (30-60 s), Select Missing Word (20-70 s), Highlight Incorrect Words (15-50 s), Write from Dictation (3-5 s) — [PrepEx](https://prepex.ai/pte/format)
- Personal Introduction is unscored — [PrepEx](https://prepex.ai/pte/format)
- Score scale 10-90 (already in first pass) — [Pearson PTE](https://www.pearsonpte.com/articles/pte-changes-2025-everything-you-need-to-know/)

### Inferences
- Part 2 timing here (23-30 min) is for the combined Reading part; Pearson-official count per type should be sourced before mimicking exactly.

### Gaps
- Per-type question counts (e.g. number of Read Aloud items); Pearson's official format page not fetched; PrepEx is a third-party prep site.

## 3. Duolingo English Test

### Takeaway
Duration, score range, adaptivity and subscores confirmed only via a secondary source; no official section breakdown retrieved beyond the 10 type names already in the first pass.

### Cited Findings
- About 1 hour, fully online; adapts difficulty in real time; score 10-160 in 5-point increments; four integrated subscores: Literacy, Comprehension, Conversation, Production; fee $70 USD; results ~2 days — [Cialfo](https://www.cialfo.co/blog/?p=1503) (secondary); results in 2 days also on [Duolingo](https://englishtest.duolingo.com/)

### Inferences
- Model DET as a single continuous adaptive item stream (computer-adaptive, item-level), not fixed sections.

### Gaps
- Official Duolingo page for duration/score range/section structure and item counts (fetched pages lacked it).

## 4. IELTS: structure, task types, band tables, rounding, UI, retake, 2025-26 changes

### Takeaway
Official/near-official facts retrieved: timings per skill, Reading 3 passages/40 Qs, full Reading task-type list, Academic and GT Reading raw-to-band tables (IDP), computer UI feature list, paper ending in Bangladesh on 31 Jan 2026. Listening part structure, Writing/Speaking part detail and official Listening table were not freshly verified.

### Cited Findings
- Academic timings: Listening ~30 min, Reading 60 min, Writing 60 min, Speaking 11-14 min, total 2 h 45; Listening and Speaking identical in Academic and GT, Reading and Writing differ; test centre or remote online (IELTS Online) — [IELTS.org](https://ielts.org/take-a-test/test-types/ielts-academic-test)
- Reading: three long texts, 40 questions, one mark each; types: multiple choice, identifying information, identifying writer's views/claims, matching headings, matching information, matching features, matching sentence endings, sentence completion, summary/note/table/flow-chart completion, diagram label completion, short answer — [IDP](https://ielts.idp.com/egypt/results/scores/reading)
- IDP Academic Reading raw-to-band: 39-40=9; 37-38=8.5; 35-36=8; 33-34=7.5; 30-32=7; 27-29=6.5; 23-26=6; 19-22=5.5; 15-18=5; 13-14=4.5; 10-12=4; 8-9=3.5; 6-7=3; 4-5=2.5 — [IDP](https://ielts.idp.com/egypt/results/scores/reading)
- IDP GT Reading raw-to-band: 40=9; 39=8.5; 37-38=8; 36=7.5; 34-35=7; 32-33=6.5; 30-31=6; 27-29=5.5; 23-26=5; 19-22=4.5; 15-18=4; 12-14=3.5; 9-11=3 — [IDP](https://ielts.idp.com/egypt/results/scores/reading)
- IDP notes these are average thresholds and vary slightly per test — [IDP](https://ielts.idp.com/egypt/results/scores/reading)
- CONTRADICTION with first pass: first-pass Yocket claim that Academic Reading matches the Listening table (e.g. 30-31=7.0 Listening) is inconsistent with IDP's Academic Reading (30-32=7.0, 33-34=7.5, 27-29=6.5); keep separate tables per module — [Yocket](https://prep.yocket.com/ielts/ielts-band-score-chart) vs [IDP](https://ielts.idp.com/egypt/results/scores/reading)
- Computer features (IDP): highlighter (Reading, Listening), digital notepad (Listening, Reading, Writing), auto-save, adjustable text size, split-screen question/passage in Reading, on-screen section timer, flag questions, navigation between questions/sections. Word count tool and contrast settings were not mentioned — [IDP Bangladesh](https://ielts.idp.com/bangladesh/about/news-and-articles/article-how-to-use-ielts-on-computer-features-to-your-advantage)
- One Skill Retake: available with IELTS on computer at participating centres — [British Council](https://takeielts.britishcouncil.org/take-ielts/book/ielts-on-computer); retake for Writing on Paper must be same module in same format — [The PIE News](https://thepienews.com/ielts-ends-paper-based-exams-amid-shift-in-test-formats/)
- Paper ending: IDP states "The IELTS on Paper test will no longer be offered in Bangladesh after 31st January 2026"; replaced by IELTS on Computer, results typically within 1 day — [IDP Bangladesh](https://ielts.idp.com/bangladesh/about/which-test-do-i-take/paper-based-ielts); a local blog says 1 Feb 2026 (secondary, minor date mismatch) — [Mentors Learning](https://mentorslearningml.blogspot.com/2026/01/official-update-paper-based-ielts-ends.html)
- Globally, IELTS moving to computer-delivered by mid-2026, market by market; "Writing on Paper" hybrid (listening/reading on computer, handwritten writing) in a small number of countries — [The PIE News](https://thepienews.com/ielts-ends-paper-based-exams-amid-shift-in-test-formats/)
- IELTS for UKVI fully computer-based in Bangladesh from 27 July (year per source URL; check) — [Daily Star](https://online-d11.thedailystar.net/news/bangladesh/education/news/ielts-ukvi-go-fully-computer-based-bangladesh-july-27-3919976)
- Retained from first pass (iWorld, secondary): Writing Task 1 min 150 words (~20 min), Task 2 min 250 words (~40 min, double weight); Speaking 3 parts; band rounding: average rounded to nearest half band (.25 up to .5, .75 up to next whole); criteria TA/TR, CC, LR, GRA; Speaking FC, LR, GRA, Pronunciation — [iWorld Learning](https://www.iworldlearning.com/article/9nPo0999.html)

### Inferences
- Engine UI flags for IELTS: highlight, notes, flag, text size, split-pane, timer, auto-save, nav bar; word-count display as optional (not evidenced here, though commonly shown on the Writing screen, UNVERIFIED).
- Store three separate conversion tables (Listening, Academic Reading, GT Reading) as editable data flagged "approximate".

### Gaps
- Official ielts.org Listening raw-to-band table (not retrieved; the Yocket table in the first pass is the only one and is secondary); Listening Parts 1-4 breakdown and task types; GT Reading section structure (Sections 1-3, 3 sections: social survival, workplace survival, general reading is UNVERIFIED background); Task 1 vs GT letter details; Speaking Part 1/2/3 timings (UNVERIFIED background: ~4-5 min, 3-4 min incl. 1 min prep + 1-2 min talk, 4-5 min); whether Task Achievement (Task 1) vs Task Response (Task 2) naming — widely used, UNVERIFIED here; official word-count and contrast features.

## 5. GRE General: question types, tools

### Takeaway
Official ets.org page could not be fetched; the inventory below is unverified background except the fee. Keep as a checklist for later verification.

### Cited Findings
- No new sourced GRE format facts retrieved this pass (ETS content-structure page failed).

### Inferences
- Plan data model per ETS-known formats (UNVERIFIED): Text Completion (1-3 blanks), Sentence Equivalence (pick 2), RC (single MC, multiple-answer, select-in-passage), QC, MC single and multi-answer, Numeric Entry (single box or fraction two boxes), Data Interpretation sets; on-screen calculator in Quant; Mark and Review screens; AWA 0-6 half-point steps (first pass confirms 0-6).

### Gaps
- Official confirmation of all of the above.

## 6. Trademark and copyright guidance

### Takeaway
ETS publishes explicit rules for third-party use of its marks (GRE, TOEFL); IELTS, PTE policies not retrieved.

### Cited Findings
- Required notice on materials, app opening screens and bottom of each web page: "[mark] is a registered trademark of ETS. This product is not endorsed or approved by ETS." (the page text uses TOEIC as the example; substitute GRE or TOEFL) — [ETS Trademarks](https://www.ets.org/legal/trademarks.html)
- Use registry symbol at first and most prominent use; your own brand must be prominent as source — [ETS Trademarks](https://www.ets.org/legal/trademarks.html)
- Do not use ETS marks in company/product/domain names, logos, social handles, trademark filings or advertising keywords — [ETS Trademarks](https://www.ets.org/legal/trademarks.html)
- Do not use ETS logos/graphics; do not use test long-form names; do not use marks in plural/possessive or alone (use as adjective + generic term, e.g. "GRE® test preparation"); no suggestion of endorsement — [ETS Trademarks](https://www.ets.org/legal/trademarks.html)
- Proposed materials may be submitted to trademarks@ets.org for review (~10 business days); ETS copyrighted material needs separate permission — [ETS Trademarks](https://www.ets.org/legal/trademarks.html)
- ETS licensing/permissions page exists — [ETS Licensing](https://www.ets.org/legal/permissions/licensing.html) (not fetched)

### Inferences
- A product named "GRE Mock Engine" or using a domain with "gre"/"toefl" would breach ETS rules; use a neutral brand with "Practice for the GRE® test" nominative phrasing plus disclaimer. Apply analogous caution to IELTS/PTE (policies not retrieved).

### Gaps
- IELTS (IDP/British Council/Cambridge), Pearson PTE, Duolingo trademark policies; copyright terms on IELTS/PTE official materials. Not legal advice.

## 7. Fees

### Takeaway
GRE fee is now $249 (ETS, effective 1 Aug 2026), superseding the $220 in the first pass. TOEFL, PTE and BC Bangladesh fees remain unverified.

### Cited Findings
- GRE General: $249 USD base (all areas except China); no Bangladesh-specific fee (falls under "all other areas"); reschedule $55; change test centre $55; effective Aug 1 2026, subject to change — [ETS GRE fees](https://www.ets.org/content/ets-org/ca/fr/gre/test-takers/general-test/register/fees.html)
- TOEFL iBT Bangladesh: approx. $185-$205 USD (third-party estimate, June 2026, "approximate") — [Gabble](https://gabble.ai/blog/toefl-exam-fees-by-country)
- DET: $70 USD — [Cialfo](https://www.cialfo.co/blog/?p=1503)
- IELTS Bangladesh BDT fees (IDP) remain as in first pass: 31,100 computer; 34,850 UKVI; 18,600 OSR — [IDP Bangladesh](https://ielts.idp.com/bangladesh/about/ielts-exam-fee)
- British Council Bangladesh IELTS fee: British Council page did not list fees; no BDT figure found — [British Council](https://takeielts.britishcouncil.org/take-ielts/book/ielts-on-computer)

### Inferences
- Fee config must be dated per region/body; the $220 GRE figure should be replaced.

### Gaps
- PTE Academic fee for Bangladesh (not on fetched page); official TOEFL fee for Bangladesh; British Council BDT fee; GRE BDT conversion.
