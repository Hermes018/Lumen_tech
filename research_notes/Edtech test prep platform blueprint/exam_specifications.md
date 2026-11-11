# Exam Specifications: IELTS, GRE General, PTE Academic, TOEFL iBT, Duolingo English Test, GMAT Focus (as of Nov 2026)

Research limits: several official pages (ets.org GRE/TOEFL content-structure, mba.com format pages, jamboree) failed to fetch or were gated. Many findings below come from secondary sources and are flagged. Items marked UNVERIFIED are background knowledge, not sourced here, and must be checked against official pages before the engine is built.

## 1. Exact timing and question counts per section (per exam)

### Takeaway
GRE (shortened 2023), GMAT Focus and legacy IELTS counts are well supported. The new TOEFL (Jan 2026) is adaptive and shorter, with a 1-6 scale, but I could not retrieve per-section item counts or timings. PTE now has 22 task types. DET task names are confirmed, durations are not.

### Cited Findings

**GRE General (post-23 Sept 2023)**
- About 1 h 58 min total, no scheduled break. Five sections: Analytical Writing first (one "Analyze an Issue" essay, 30 min, scored 0-6), then the other four in any order — [Test-Guide](https://www.test-guide.com/what-is-the-gre.html)
- Verbal: 2 sections, 12 questions/18 min and 15 questions/23 min. Quant: 2 sections, 12 questions/21 min and 15 questions/26 min — [Test-Guide](https://www.test-guide.com/what-is-the-gre.html)
- Approx. composition: Verbal = ~7 Text Completion, ~6 Sentence Equivalence, ~14 Reading Comprehension. Quant = ~10 Quantitative Comparison, ~13 Problem Solving, ~4 Data Interpretation — [Test-Guide](https://www.test-guide.com/what-is-the-gre.html)
- Section-level adaptive: first V and Q sections are average difficulty; the second depends on first-section performance — [Test-Guide](https://www.test-guide.com/what-is-the-gre.html)
- V and Q scaled 130-170, no overall score. Fee $220. Retake every 21 days, max 5 per 12 months — [Test-Guide](https://www.test-guide.com/what-is-the-gre.html)

**GMAT Focus**
- 3 sections, 64 questions, 2 h 15 min. Verbal 23 Qs/45 min (Reading Comprehension + Critical Reasoning only; Sentence Correction removed). Quant 21 Qs/45 min (Problem Solving only; no Data Sufficiency in Quant). Data Insights 20 Qs/45 min (Data Sufficiency, Table Analysis, Multi-Source Reasoning, Graphics Interpretation, Two-Part Analysis); calculator only in Data Insights — [Magoosh](https://magoosh.com/gmat/gmat-focus-edition-the-key-changes/)
- Total 205-805 in 10-point steps; each section 60-90; no AWA or IR score — [Magoosh](https://magoosh.com/gmat/gmat-focus-edition-the-key-changes/)
- Review/edit: up to 3 answer changes per section while time remains, plus bookmark/flag — [Magoosh](https://magoosh.com/gmat/gmat-focus-edition-the-key-changes/)
- mba.com overview confirms "three test sections" but the page fetched lacked detail — [mba.com](https://www.mba.com/exams/gmat-exam/about)

**TOEFL iBT, effective 21 Jan 2026**
- Reading and Listening are adaptive and adjust to the learner's level — [ETS](https://www.ets.org/toefl/teachers-advisors-agents/ibt/teaching/upcoming-updates-jan-2026.html); [ApplyBoard](https://assist.applyboard.com/hc/en-us/articles/42516862433805)
- Multistage adaptive Reading/Listening with fewer items; new "complete the words" Reading task (paragraph with ten incomplete words, first 2-3 letters given); new "listen and repeat" Speaking task (sentences of 6-19 syllables, about 3.5 min); section order Reading, Listening, Writing, Speaking; total estimated 67-85 min; Speaking scored by humans plus AI — [Sabanci Univ.](https://sl.sabanciuniv.edu/en/node/795)
- Score: 1-6 in half-point steps per section, overall = mean of four sections rounded to nearest half band. A 0-120 score is also reported for two years after Jan 2026; maps to CEFR — [ETS China](https://www.ets.org/toefl/china/toefl/content-structure.html); [ApplyBoard](https://assist.applyboard.com/hc/en-us/articles/42516862433805)
- SUPERSEDED format (until Jan 2026), about 2 h: Reading 2 passages x 10 Qs/35 min; Listening 3 lectures x 6 Qs + 2 conversations x 5 Qs/36 min; Speaking 4 tasks/16 min; Writing integrated 20 min + academic discussion 10 min; each section 0-30, total 0-120 — [ETS China](https://www.ets.org/toefl/china/toefl/content-structure.html)

**PTE Academic (2025 update)**
- 22 question types: original 20 plus 2 new Speaking tasks, "Respond to a Situation" and "Summarize Group Discussion". Original timings unchanged; some tasks have more items; average duration still about 2 hours — [Pearson PTE](https://www.pearsonpte.com/articles/pte-changes-2025-everything-you-need-to-know/)
- Score report: Overall, Reading, Listening, Speaking, Writing, 10-90 scale — [Pearson PTE](https://www.pearsonpte.com/articles/pte-changes-2025-everything-you-need-to-know/)
- AI scores all responses; humans double-mark 7 types: Describe Image, Retell Lecture, Summarize Written Text, Write Essay, Summarize Spoken Text, Summarize Group Discussion, Respond to a Situation. Pronunciation and oral fluency are AI-only — [Pearson PTE](https://www.pearsonpte.com/articles/pte-changes-2025-everything-you-need-to-know/)

**Duolingo English Test**
- Question types named in the official guide: Read and Select, Listen and Type, Read Aloud, Write About the Photo, Interactive Reading, Interactive Listening, Writing Sample, Speaking Sample, Fill in the Blanks, Video Interview. Results in about 2 days — [Duolingo](https://englishtest.duolingo.com/guide)

**IELTS (format as reported by a secondary source, not verified against ielts.org)**
- About 2 h 45 min. Listening 40 Qs, 4 parts, audio played once, 10 min transfer (paper). Reading 40 Qs, 3 passages, 60 min. Writing 60 min (Task 1 min 150 words ~20 min; Task 2 min 250 words ~40 min, double weight). Speaking 11-14 min, 3 parts (cue card with 1 min prep) — [iWorld Learning](https://www.iworldlearning.com/article/9nPo0999.html)
- Overall band = mean of four skills; .25 rounds up to next half band, .75 up to next whole band; Writing and Speaking each scored on four equally weighted criteria — [iWorld Learning](https://www.iworldlearning.com/article/9nPo0999.html)

### Inferences
- GRE data model: sections (Verbal1, Verbal2, Quant1, Quant2) need a difficulty tier on section 2 (e.g., easy/medium/hard); section 1 is fixed medium.
- TOEFL needs a multistage router: stage-1 module then stage-2 module chosen by performance, for Reading and Listening only.
- Existing "2 h" TOEFL practice material is superseded; a new engine should use the 67-85 min model.

### Gaps
- New TOEFL per-section item counts, timing and full task-type names (official page not retrievable). UNVERIFIED background knowledge only: Reading = Complete the Words, Read in a Daily Life, Read an Academic Passage; Listening = Listen and Choose a Response, Conversation, Announcement, Academic Talk; Writing = Build a Sentence, Write an Email, Write for an Academic Discussion; Speaking = Listen and Repeat, Take an Interview. Verify at ets.org.
- PTE per-section question counts/timings for the 22 types; DET per-type durations (about 1 hour total, UNVERIFIED), score range 10-160 and subscores (UNVERIFIED).
- GRE question-type inventory beyond what is in the brief (Text Completion 1-3 blanks, Sentence Equivalence, select-in-passage, multiple-answer, Numeric Entry incl. fractions) was not confirmed on ets.org.
- IELTS Listening part timings (30 min computer), per-task-type lists and official computer-delivered UI features were not verified.

## 2. Scoring tables and official raw-to-band conversions

### Takeaway
IELTS does not publish official raw-to-band tables in a fixed form; the widely used Listening/Academic Reading table below comes from a secondary source. General Training Reading is more lenient but I found no sourced table.

### Cited Findings
- Listening (out of 40): 39-40 = 9.0; 37-38 = 8.5; 35-36 = 8.0; 32-34 = 7.5; 30-31 = 7.0; 26-29 = 6.5; 23-25 = 6.0; 18-22 = 5.5; 16-17 = 5.0. Source says Academic Reading matches this table (note: this is the source's claim; real Academic Reading thresholds are commonly published slightly lower, UNVERIFIED) — [Yocket](https://prep.yocket.com/ielts/ielts-band-score-chart)
- General Training Reading converts more leniently (lower raw for same band); no table in source — [Yocket](https://prep.yocket.com/ielts/ielts-band-score-chart)
- IELTS band descriptors: 9 Expert, 8 Very Good, 7 Good, 6 Competent, 5 Modest, 4 Limited, 3 Extremely Limited, 2 Intermittent, 1 Non-User, 0 Did not attempt — [Yocket](https://prep.yocket.com/ielts/ielts-band-score-chart)
- Writing criteria (secondary, brief-confirmed): Task Achievement/Response, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy; Speaking: Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, Pronunciation; equally weighted — [iWorld Learning](https://www.iworldlearning.com/article/9nPo0999.html)
- GRE: V/Q 130-170, AWA 0-6 — [Test-Guide](https://www.test-guide.com/what-is-the-gre.html); GMAT Focus 205-805 / sections 60-90 — [Magoosh](https://magoosh.com/gmat/gmat-focus-edition-the-key-changes/); PTE 10-90 — [Pearson PTE](https://www.pearsonpte.com/articles/pte-changes-2025-everything-you-need-to-know/); TOEFL 1-6 (+0-120 for two years) — [ETS China](https://www.ets.org/toefl/china/toefl/content-structure.html)

### Inferences
- Practice tests should label IELTS band output as an "estimate" and store the conversion table as editable data, keyed by module (Listening, Academic Reading, GT Reading), since the real test form's conversion varies.

### Gaps
- Official GT Reading table and lower bands (below 5.0) of Listening; official writing/speaking band descriptor text (public version on ielts.org not fetched); GRE scaled-score conversion (form-specific, not published as a fixed table).

## 3. Fees (Bangladesh, BDT and USD) and booking bodies

### Takeaway
IDP Bangladesh publishes IELTS fees in BDT. GRE USD fee is $220 (confirmed); BDT fees and fees for the other exams were not found.

### Cited Findings
- IDP Bangladesh (BDT): IELTS on Computer 31,100; UKVI 34,850; Life Skills (A1/B1) 24,750; One Skill Retake 18,600; UKVI One Skill Retake 20,900; Enquiry on Results 10,500; same at all cities; no paper fee listed — [IDP Bangladesh](https://ielts.idp.com/bangladesh/about/ielts-exam-fee)
- GRE $220 standard — [Test-Guide](https://www.test-guide.com/what-is-the-gre.html)
- IELTS booking bodies named in the brief: IDP and British Council. Only IDP was verified here.

### Inferences
- Store fees as dated, per-region config with a "last verified" field; the IDP page may lag currency changes.

### Gaps
- British Council Bangladesh IELTS fee; BDT fees for GRE, TOEFL, PTE, DET, GMAT; USD fees for all but GRE. Not retrieved.

## 4. Recent format changes (flag as superseded vs current)

### Takeaway
Current: GRE shortened Sept 2023 (~1 h 58 min); GMAT Focus replaces classic GMAT; TOEFL changed 21 Jan 2026; PTE added 2 tasks in 2025; IELTS moving fully to computer with one-skill retake.

### Cited Findings
- GRE: current ~1h58 format post-23 Sept 2023; the old ~3h45 format (two essays) is superseded — [Test-Guide](https://www.test-guide.com/what-is-the-gre.html) (old length is UNVERIFIED background)
- GMAT Focus removed Sentence Correction and AWA/IR scores — [Magoosh](https://magoosh.com/gmat/gmat-focus-edition-the-key-changes/)
- TOEFL: adaptive, 1-6 scale, from Jan 2026 — see section 1
- PTE: two new Speaking tasks, 22 types — see section 1
- IELTS (UNVERIFIED by an official source; secondary article): paper-based testing phased out with final paper date 27 June 2026 in most markets; one-skill retake within 60 days (select centres); Task Response capped at 4.0 for template-based writing; Video Call Speaking at some centres; fewer Matching Headings, more Matching Sentence Endings — [iWorld Learning](https://www.iworldlearning.com/article/9nPo0999.html)
- IDP lists One Skill Retake as a fee item in Bangladesh — [IDP Bangladesh](https://ielts.idp.com/bangladesh/about/ielts-exam-fee)

### Inferences
- Build the IELTS engine computer-first only; paper-style transfer time is irrelevant to computer delivery.

### Gaps
- Official ielts.org confirmation of 2025-2026 changes; DET 2025-26 changes; GMAT 2026 changes.

## 5. Computer-delivered UI features

### Takeaway
Only GMAT Focus and GRE-related items are partly confirmed; most UI feature lists are unverified.

### Cited Findings
- GMAT Focus: calculator only in Data Insights; flag questions; change up to 3 answers per section — [Magoosh](https://magoosh.com/gmat/gmat-focus-edition-the-key-changes/)
- IELTS computer: results in 1-5 days, flexible dates; Video Call Speaking at some centres — [iWorld Learning](https://www.iworldlearning.com/article/9nPo0999.html)

### Inferences
- From the brief (UNVERIFIED): IELTS highlight/notes/flag/word count/navigation bar; GRE mark & review, review screen, on-screen calculator in Quant. Implement as feature flags per exam.

### Gaps
- Official lists of UI tools for each exam; PTE/DET/TOEFL interface behaviour.

## 6. Licensing, trademark and copyright limits

### Takeaway
No sourced guidance found. I did not retrieve any official trademark or content-use policy.

### Cited Findings
- None retrieved.

### Inferences
- Safe practice (general reasoning, not legal advice): write original questions; never reproduce official past papers; use names only nominatively with a disclaimer such as "not affiliated with or endorsed by the test owner"; consult counsel and the owners' terms (IELTS is jointly owned by British Council, IDP IELTS and Cambridge University Press & Assessment; GRE/TOEFL by ETS; PTE by Pearson; GMAT by GMAC; DET by Duolingo — ownership UNVERIFIED here).

### Gaps
- All official trademark/usage policies (ielts.org, ets.org, pearsonpte.com, mba.com, Duolingo). Needs a follow-up fetch or legal review.
