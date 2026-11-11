# 14 — IELTS Curriculum (canonical)

> **Status:** v1.0, 2026-11-07. Owner: Curriculum lead. **This document is canonical for all IELTS and English-language curriculum.** It extends and replaces `03-PRODUCT-SPEC.md` §7.1 (IELTS catalogue); where the two differ, this file wins for curriculum, and `00-DECISIONS.md` (D1, D5, D6, D10) wins over both.
> Brand name "Lumen Academy" is a placeholder (set once in `packages/config/brand.ts`). Official test names are used only nominatively with the disclaimer in 03 §9.4.
> **Naming (D10, resolved):** the earlier label "Complete" is **retired** and means the **Core** tier of a course family. This document describes the *full course body* of each family (`ielts-academic`, `ielts-gt`); the buyable unit is **family × tier** (e.g. "IELTS Academic - Plus", SKU `ielts-academic-plus`, 17 §2.1/§13). Every tier allowance below (credits, mocks, human reviews, live sessions, 1:1 sessions, access days) is copied from `17-PRICING-MASTER.md` §2.2 and must match it exactly; if they differ, 17 wins.
> **Pointers (do not duplicate here):** content sourcing, recording standards, voice talent, TTS policy and production waves → `16-CONTENT-SOURCING-AND-PRODUCTION.md`; every price, credit bundle and guarantee legal term → `17-PRICING-MASTER.md`; live-class operations, timetables, teacher ratios → `18-LIVE-CLASSES.md`; marketing and campaign copy → `19`/`20`; question-type registry, scoring tables, AI rubrics → `07-TEST-ENGINE.md`.
> **Verification flag:** exam facts that could not be verified against ielts.org / the official handbook are marked **(verify)**. Facts sourced from the research notes are traceable to `research_notes/Edtech test prep platform blueprint/exam_specifications*.md`.

## Table of contents
1. Curriculum principles
2. Learner pathways and placement
3. Skill curricula (3.1 Listening, 3.2 Reading, 3.3 Writing, 3.4 Speaking)
4. Foundation strands (grammar, vocabulary, pronunciation)
5. Tier-by-tier material map and outcome promises
6. Materials list per course
7. Study plans
8. Assessment and progress model
9. Course catalogue (IELTS and English-language)
10. Bangladesh version versus International version
11. Quality bar and review checklist
Appendices: A. ID scheme and conventions; B. Open questions and verify list; C. Change log

---

## 1. Curriculum principles

### 1.1 Backward design from band targets

Every lesson exists to move a measurable behaviour that the IELTS band descriptors reward. Design order is fixed:

1. **Outcome** — the target band per skill (e.g. 6.5 overall, no skill below 6.0) and the evidence the exam collects (raw score for L/R; four criteria for W/S).
2. **Evidence** — what a learner must be able to *do* repeatedly under exam conditions (learning objectives, §3, written as `LO-<skill>-<band>-<n>` with a numeric threshold).
3. **Practice** — item banks and tasks that elicit that evidence (§3 practice tables), stored in the 07 registry types.
4. **Instruction** — only then, the minimum video/worked example needed to make practice productive.

Rules that follow from this:
- A lesson with no linked learning objective (LO) and no linked practice set does not ship.
- Teach-the-test-format is limited to what the learner needs to act on (Module 0 and the first unit of each skill). The rest is skill-building.
- Practice outweighs instruction: across the full course (Core and above), **practice and feedback capacity ≥ 1× video time by design (lesson sets + hub bank + mocks), and the weekly planner targets ≥ 1.5 : 1 practice-to-video time** (§9.1 shows the actual ratio).
- All band statements are **estimates** (D6). We never write "you will score 7".

### 1.2 CEFR ↔ IELTS band map (approximate)

IELTS bands are not a CEFR-aligned certificate; the table is the widely used *approximate* correspondence and is used for placement language, course labels and Foundation-to-IELTS bridging only (verify against the current ielts.org / Cambridge linking statement before using in marketing).

| IELTS band | IELTS descriptor | Approx. CEFR | Lumen pathway label | Typical learner |
|---|---|---|---|---|
| 9.0 | Expert | C2 | — | Near-native |
| 8.0 – 8.5 | Very good | C1 upper – C2 | Advanced (stretch) | Postgraduate/medical registration targets |
| 7.0 – 7.5 | Good | C1 | Advanced target | Competitive universities, some professional bodies |
| 5.5 – 6.5 | Competent | B2 | Core target | Most UG/PG admissions, many migration routes |
| 4.0 – 5.0 | Modest – Limited | B1 | Core entry | Many Bangladesh HSC/Honours graduates |
| 3.0 – 3.5 | Extremely limited | A2 (approx.; not reliably reported by IELTS below 4.0) | English Foundation | Can handle routine, simple exchanges |
| ≤ 2.5 | Intermittent – Non-user | A0 – A1 | English Foundation (start) | Beginners |

Guided-learning-hour benchmark (Cambridge English publishes cumulative estimates of roughly A2 ≈ 180–200 h, B1 ≈ 350–400 h, B2 ≈ 500–600 h, C1 ≈ 700–800 h **(verify)**). We use it only to size Foundation and the "hours per band" rule of thumb in §2.4.

### 1.3 Skills × criteria matrix

"Where taught" and "where evidenced" make the curriculum auditable: every criterion must have at least one teaching unit, one practice set, one assessment and one feedback source.

| Skill | Scored on | Criterion / sub-skill | Taught in | Practised in | Assessed by | Feedback source |
|---|---|---|---|---|---|---|
| Listening | Raw /40 → band (07 §3.2) | Detail & spelling | L1.3, L2 | Form/note/table sets | Part sets, sectionals A–D, mocks | Instant auto-score + explanation |
| | | Prediction & signposting | L1.2 | Signpost drills | Part sets | Instant + error taxonomy |
| | | Following opinion / attitude | L4.1 | Speaker-match sets | Part 3 sets | Instant |
| | | Maps, plans, diagrams | L3.1, L5.2 | Map/plan sets | Part 2 sets | Instant |
| | | Distractor handling | L2.3, L4.2 | MCQ sets | Part 3 sets | Instant + distractor tags |
| | | Accent and pace tolerance | L6.1 | Accent ladder | Mocks (mixed accents) | Instant |
| Reading | Raw /40 → band (separate Academic/GT tables, 07) | Skim / scan / map | R1 | Speed drills | Timed passages | Instant |
| | | Paraphrase recognition | R2 | Paraphrase drills | All sets (tagged) | Instant + paraphrase tag |
| | | Logic of TFNG/YNNG | R3 | TFNG/YNNG sets | Timed passages | Instant + error taxonomy |
| | | Matching tasks | R3.3, R4 | Matching sets | Timed passages | Instant |
| | | Completion accuracy | R5 | Completion sets | Timed passages | Instant (spelling/limit flags) |
| | | Time management | R7 | Timed passages | Sectionals, mocks | Pace chart |
| Writing | Four criteria, equal weight; T2 counts double | Task Achievement (T1) / Task Response (T2) | W2, W4, W5, W8 | Prompts | AI + human graders | AI report; human review |
| | | Coherence & Cohesion | W4.3 | Cohesion clinic | Same | Same |
| | | Lexical Resource | W6.1 | Collocation workshop | Same | Same |
| | | Grammatical Range & Accuracy | W6.2, G strand | Accuracy clinic | Same | Same |
| Speaking | Four criteria, equal weight | Fluency & Coherence | S2–S4, S6 | Recorded drills | AI mock + human mock | AI report; human interview |
| | | Lexical Resource | S6.2, V strand | Topic labs | Same | Same |
| | | Grammatical Range & Accuracy | S6.2, G strand | Accuracy clinic | Same | Same |
| | | Pronunciation | S5 | Minimal-pair + shadowing | Same (+ optional Azure P2) | Same |

Criterion names follow the public descriptors as used in 07 §7.3 (TA/TR naming for Task 1/Task 2 is widely used **(verify)**). Descriptor text is paraphrased, never copied.

### 1.4 Spaced practice and interleaving

| Mechanism | Rule | Implementation |
|---|---|---|
| **Spaced retrieval** | Every new objective is re-tested at +1, +3, +7, +14, +30 days. A miss resets to +1. | Review queue (03 F-MAST / F-VOC); items tagged to LOs |
| **Spaced vocabulary** | Cards use spaced-repetition scheduling; 10–15 new cards/day cap; daily review cap 80 | 03 §3.8 `F-VOC` |
| **Blocked → interleaved** | A question type is taught *blocked* (one type per set) for its unit, then appears *interleaved* in mixed passages/parts from the next unit onward. ≥ 30% of any practice session after Week 2 draws on earlier units | "Mixed practice" generator uses mastery gaps |
| **Retrieval before re-teaching** | Re-watching a lesson is offered only after a failed retest, not before | Lesson player nudge |
| **Desirable difficulty** | Timed practice from the first week; untimed only for first exposure | Mode flags in 07 (practice vs exam) |
| **Error log** | Each wrong answer carries an error tag (e.g. `paraphrase_miss`, `word_limit`, `distractor_correction`, `tfng_ng_vs_f`). Weekly digest lists the top 3 tags | `attempt_response` tags; digest in 03 §5.2 |

### 1.5 Feedback loops

Three nested loops, each with a clear owner and latency:

| Loop | Latency | Who/what | Learner action |
|---|---|---|---|
| **Item loop** | Instant | Auto-score with explanation and distractor note (L/R) | Read explanation; tag "I understand" or "Re-queue" |
| **Task loop** | AI: minutes. Human: 72 h SLA (24 h with the priority-grading add-on; SLA in 17/18) | AI evaluation (Writing/Speaking, 07 §7); human grader override with rationale (D4) | Rewrite using feedback (Writing W7.1); re-record weakest answer |
| **Programme loop** | Weekly | Plan engine + mentor (Live/Mentor) reviewing trends: mastery map, error tags, band trajectory | Plan adjusts; mentor sets 3 priorities |

Rules: no feedback is given without a next action. Every AI Writing report ends with exactly **one rewrite task** and **three study-queue items**. AI feedback is labelled estimated and states confidence; reports on memorised-looking text are flagged (see §3.3 policy).

### 1.6 Bangla-medium scaffolding

**Language policy.** Instruction language for BD courses is Bangla-English mix: concepts and strategies explained in Bangla, exam language, task rubrics and all practice items in English, with English captions on every video (03 §7). The Bangla share of spoken instruction falls as proficiency rises:

| Level | Bangla share of instruction | Written support |
|---|---|---|
| English Foundation F1–F4 (A0–A1) | 70–80% | Bangla gloss on every new word; Bangla instructions |
| Foundation F5–F8 (A2) | 50–60% | Bangla gloss on request (tap) |
| Foundation F9–F12 (B1) / Core entry | 35–45% | Bangla only for strategy and grammar explanation |
| Core pathway | 25–35% | Bangla summary card per lesson |
| Advanced pathway | 10–15% | English-first; Bangla "quick note" only on error-prone points |

**Contrastive grammar and sound notes.** Each of these is a 90-second "Bangla bridge" card attached to the relevant lesson (and printed in the Grammar book). They explain *why* the error happens (L1 transfer) and give a 3-step fix. This table is the master list; every item has an owning lesson and a "spot-the-error" deck (§4.2, deck `ERR-BN`).

| # | Area | Bangla feature (L1 transfer) | Typical learner error | Fix taught | Lesson |
|---|---|---|---|---|---|
| 1 | Articles | No a/an/the; uses classifiers and numeral-one (একটা, একজন) and context | "I have car." "The education is important." | Countable test → a/an; specific/known → the; generic plural/uncountable → zero article | G8, W6.2 |
| 2 | Copula | Present-tense copula often omitted ("সে ডাক্তার") | "He doctor." "She very smart." | Every sentence needs a finite verb: be + complement | G2 |
| 3 | Tense / aspect | No present perfect form; simple past/present used with time words | "I am living here since 2010." "I have seen him yesterday." | Present perfect for unfinished/result; *since/for*; never with finished-time adverbs | G5, G26 |
| 4 | Subject–verb agreement | Bangla verbs agree with person/honorific, not number | "People is…", "Many student has…", "He go" | Spot the head noun; add -s to singular verbs; "people/police" plural | G18 |
| 5 | Prepositions | Postpositions (-এ, -তে, -কে, -র সাথে); one-to-one mapping fails | "discuss about", "married with", "depend of", "enter into", "return back" | Verb+preposition collocation cards; "no preposition" list | G13, G14 |
| 6 | Plurals / countability | Number word + singular noun (দুইটা বই); mass nouns differ | "two book", "informations", "advices", "equipments" | Uncountable list (information, advice, equipment, research, furniture, knowledge…) | G7 |
| 7 | Word order | SOV; question marker কি | "What you want?", "Why he left?" | Auxiliary + subject inversion; do-support | G1, G16 |
| 8 | Pronoun gender | Gender-neutral সে | he/she confusion | Pronoun tracking in paragraphs | G10 |
| 9 | Relative clauses | Correlatives (যে… সে…) and pre-nominal modifiers | "The man who he came…" (resumptive pronoun) | Pronoun is replaced by who/which/that | G20 |
| 10 | Reported speech | Direct quotation common | Tense not shifted, "He said me" | Backshift rule + *say/tell* | G23 |
| 11 | Comparison | Ablative "-র চেয়ে" | "more better", "more cheaper" | One comparative marker | G12 |
| 12 | /v/ – /w/ – /b/ | No /v/ or /w/ (ভ is aspirated /bʱ/; ও/ভ interchange) | "vine/wine", "very/berry" | Lip-teeth contact for /v/; rounded lips for /w/; minimal pairs | S5.1 |
| 13 | /z/ – /dʒ/ and /s/ – /ʃ/ | জ is /dʒ/; স and শ often merge to /ʃ/ | "zoo → joo", "see → she" | Voicing buzz drill; tongue-tip placement | S5.1 |
| 14 | /θ/ /ð/ and /f/ | Replaced by dental stops /t̪ʰ/ /d̪/; ফ is /pʰ/ | "think → tink", "fan → phan" | Tongue-between-teeth drills; /f/ lip-teeth | S5.1 |
| 15 | Clusters and epenthesis | Initial clusters broken by vowel ("iskul") | "istation", "isport" | Cluster building; syllable-count check | S5.2 |
| 16 | Word stress & rhythm | Bangla: word/phrase-initial stress, syllable-timed feel | Flat stress: "phoTOgraph" misplaced; no weak forms | Stress rules, content/function words, shadowing | S5.2, S5.3 |
| 17 | Intonation | Different rise/fall patterns for questions | Unintentionally flat or "bored" tone | Fall/rise/emphasis drills | S5.3 |

Pronunciation policy: **we teach intelligibility, not accent change.** Retroflex /t, d/ and other South Asian features are not marked as errors unless they cause misunderstanding; teachers and AI prompts must never describe an accent as "wrong". (Aligned with the Pronunciation criterion's focus on features and intelligibility.)

**Bangla glossary.** A fixed glossary of ~150 course terms (overview, paraphrase, distractor, cohesion, collocation, thesis, topic sentence…) with Bangla rendering and English term in brackets is maintained in the CMS (`glossary_term`), reviewed by two Bangla editors, and used consistently in videos, PDFs and AI feedback translations. Numerals in Bangla UI follow 08/i18n rules; exam tasks always use English numerals.

### 1.7 The English-only international variant

Same learning objectives, same unit IDs, same item banks and same assessments; different *wrapper*:

| Element | Bangladesh version | International version |
|---|---|---|
| Course codes | `ielts-academic` (bn locale) | Same slug; locale `en`; "International" edition flag on the course |
| Language of instruction | Bangla-English mix (§1.6) | English only; speech rate 130–145 wpm; plain English, idioms glossed; captions in English; auto-translated captions optional later |
| Examples & context | Bangladesh-relevant (HSC, Dhaka traffic, bKash, Eid) mixed with global | **Culturally neutral** — global cities, international students, workplaces, no BD-specific references; avoids religious, political and food-specific assumptions |
| Contrastive notes | Bangla bridge cards | Generic "Common learner errors" cards (articles, tense, prepositions, pronunciation) with an L1 selector (Arabic, Hindi/Urdu, Chinese, Spanish, Bangla, Vietnamese, Tagalog, Nepali) added in waves; not blocking launch |
| Teacher persona | Bangladeshi bilingual teachers (accent: clear BD/International English) | International-English-accent teachers (neutral, clearly paced) |
| Listening practice audio | Identical audio set (accents mix §6.3) | Identical |
| Placement diagnostic | Bangla UI available | English UI |
| Pricing | BDT price book (17) | USD, 3 purchasing-power regions (D10) |
| Compliance | BD consumer norms, bKash | Paddle/Stripe merchant of record; GDPR/CCPA (09) |

Production rule: each Bangla-first lesson script is written **concept-first in English** (the "master script"), then localised to Bangla (instruction layer only) so that International edition is a recording of the master script, not a translation of the Bangla. This cuts the cost of the international twin to ≈ 35–45% of a new build **(estimate; costing in 16)**.

### 1.8 Exam format snapshot used by this curriculum

All content is built for the **computer-delivered** IELTS (paper ended in Bangladesh after 31 Jan 2026 per IDP Bangladesh; see exam_specifications_gapfill §4). Engine behaviours are in 07 §1.2–1.3.

| Component | Academic | General Training | Source/verification |
|---|---|---|---|
| Listening | ~30 min audio, 40 Qs, 4 parts, audio played once | Same | IELTS.org (timings); part layout in 07 **(verify)** |
| Reading | 60 min, 40 Qs, 3 long texts | 60 min, 40 Qs, 3 sections (short factual / workplace / long text) | IELTS.org/IDP; GT section layout **(verify)** |
| Writing | 60 min: Task 1 ≥150 words (~20 min, describe visual); Task 2 ≥250 words (~40 min, essay, counts double) | Task 1 letter ≥150 words; Task 2 essay | IELTS.org; word minimums and weighting from secondary source **(verify)** |
| Speaking | 11–14 min, 3 parts (P1 ~4–5 min, P2 1 min prep + 1–2 min talk, P3 ~4–5 min) | Same | Total from IELTS.org; part timings **(verify)** |
| Computer tools | Highlighter (R, L-question text), notepad, flag, text size, split screen (R), timer, auto-save | Same | IDP Bangladesh feature list |
| Band calculation | Mean of four skills, rounded to nearest half band (.25 up, .75 up) | Same | Secondary source **(verify)** |
| Reading raw → band | Academic and GT tables differ; GT is more lenient | See 07 §3.2 (IDP tables; "approximate") | IDP |
| Task Response penalty for templates | Reported: template-based Task 2 responses capped | Same | Secondary source **(verify)**; the curriculum policy (§3.3.5) assumes the risk is real |
| One Skill Retake / UKVI | Available at participating centres; UKVI variants exist | Same | IDP/British Council |

If an item here changes, update this table, 07's blueprint data and the affected lessons (impact list generated from LO tags).

---

## 2. Learner pathways and placement

### 2.1 Diagnostic design

Two diagnostics feed placement (both built on the 07 engine; guests may take the short one, per D4; results are gated behind sign-up, per 03 §6.1):

| Diagnostic | Length | Who | Content | Output |
|---|---|---|---|---|
| **Quick placement** (`diag-quick`) | ~20 min | Guests and all new learners | 12 grammar/vocabulary items (gap-fill, error-spotting; the "bridge test"), 8 listening items (Part 1 style), 8 reading items (one short text) | Foundation / Core / Advanced recommendation; estimated L/R band **range** (e.g. 5.0–6.0) |
| **Full diagnostic** (`diag-full`, M0 lesson) | ~45 min active (+ 1 recorded speaking sample) | Signed-in learners before purchase or at M0 | Listening 20 items (2 parts), Reading 20 items (1 passage + 1 mixed set), Writing: one 150-word Task 1/GT letter *or* Task 2 mini-essay (25 min, AI evaluated), Speaking: 3-minute recorded sample (Part 1 + short Part 2) | Per-skill band estimates **with confidence**, error-tag profile, recommended pathway, tentative weeks-to-target |

Quick placement is deliberately short; it must not claim a band, only a range. Full diagnostic W/S estimates are low confidence (single sample) and are shown as ranges; they get recalibrated after the first human-reviewed submissions.

### 2.2 Placement rules

| Signal (full or quick) | Rule | Pathway |
|---|---|---|
| Bridge test < 40% **or** L/R estimate < 4.0 **or** unable to write a connected 80-word paragraph | → **English Foundation** (Bangla-medium for BD; "English Foundations" for international), starting module by bridge-test score: < 15% F1; 15–30% F3; 30–45% F5; 45–60% F8; 60–70% F10 | English Foundation |
| L/R 4.0–5.5, bridge test 40–75%, W/S estimate 4.0–5.5, target ≤ 6.5 | → **IELTS Core Pathway** (Academic or GT) | Core |
| L/R ≥ 6.0 with W or S ≥ 5.5, target ≥ 7.0 | → **Advanced Pathway** (Accelerator + Writing/Speaking Mastery, mocks) | Advanced |
| Exam in ≤ 28 days **and** gap to target ≤ 1.0 band (overall estimate) | → **Fast-track Crash Course** (4-week) | Fast-track |
| Exam in ≤ 28 days **and** gap to target > 1.0 band | Honest advice screen: recommend postponing the exam, offer Core path plus a "skill-lift" Crash variant, never promise the target | Fast-track (warned) |
| Target ≥ 7.5 and entry ≤ 5.5 | Show realistic timeline (≥ 2 bands = roughly 300–400 guided hours, §2.4) | Core → Advanced sequence |
| Purpose = UK family/settlement visa, speaking & listening only | → **IELTS Life Skills** (§2.5) | Life Skills |
| Purpose = everyday/workplace English, no exam | → **Spoken English** (§9) | Spoken |

Learners can override the recommendation once; the override is logged and the first-week "check-in" tests the placement (if week-1 mastery on the first two units is < 40% or > 90%, the plan offers a one-click move up/down).

### 2.3 Pathway map

| Pathway | Entry | Target | Typical duration | Primary courses | Key checkpoints |
|---|---|---|---|---|---|
| **English Foundation** | A0 – A2 / low B1 (est. IELTS < 4.0) | B1 (≈ 4.5) and a decision point | 6–9 months at 5–6 h/week (self-paced); 16-week Sprint for A2/B1 entrants | English Foundation (bn) / English Foundations (intl); Spoken English | End of F4, F8, F12 level tests; Foundation certificate |
| **IELTS Core** | ≈ 4.5 – 5.5 | 6.0 – 6.5 | 12 weeks regular; 8 weeks if ≥ 5.5 and full-time | IELTS Academic or GT (+ Mock Series) | Diagnostic, Sectionals A–D, Mocks 1–4 |
| **IELTS Advanced** | 6.0 – 6.5 | 7.0 – 8.0+ | 8–12 weeks | Listening & Reading Accelerator, Writing Mastery, Speaking Mastery, Mock Series | Skill gap analysis, mocks 5–10 |
| **Fast-track crash** | Any, exam ≤ 4 weeks | Polish; ≤ 0.5 band typical lift | 4 weeks | IELTS Crash Course (Academic or GT) | Day 1 diagnostic, Mock days 8, 15, 22, 27 |
| **Life Skills** | A1 / A2 / B1 speaking & listening | Pass at level | 2–5 weeks | IELTS Life Skills | Practice speaking tests |

Academic versus General Training split: Listening and Speaking content is identical in both courses. Reading, Writing Task 1 and the passage/text bank differ. The Academic and GT courses share ≈ 90% of lessons by count (L, S, G, V, Z, W1, W4–W7 and the R1–R7 skills; only the passage banks, R8, and Writing Task 1 differ). The decision helper (M0.4) asks purpose (university → Academic; migration/work → GT), institution requirement, and shows the effect on prep.

### 2.4 Hours per band jump (rule of thumb)

> **Estimate, not a promise.** A widely quoted rule of thumb is ~150–200 *guided* learning hours per whole-band improvement in the B1–B2 range; the range stretches at higher bands and varies greatly with individual practice habits. "Guided hours" = lesson time + practice with feedback. Independent study (reading, listening, conversation) is additional and recommended at 1 : 1.

| Jump | Guided hours (est.) | Independent hours (rec.) | Typical calendar (working adult ~8–10 h/week) | Typical calendar (full-time ~25–30 h/week) |
|---|---|---|---|---|
| A2/B1 → ≈ 4.5 (Foundation) | 150–200 | 100–150 | 20–24 weeks | 8–10 weeks |
| 4.5 → 5.5 | 150–200 | 100–150 | 16–20 weeks | 6–8 weeks |
| 5.5 → 6.5 | 150–200 | 100–150 | 16–20 weeks | 6–8 weeks |
| 6.5 → 7.5 | 180–250 | 150+ | 20–26 weeks | 8–10 weeks |
| 7.5 → 8.5 | 250+; consider specialist tutoring | — | — | — |
| Same-band consolidation (e.g. 6.0 → 6.5 in one skill) | 40–80 | 40–60 | 4–8 weeks | 2–3 weeks |

Consequences for product honesty:
- The 12-week regular plan (§7.3) delivers ≈ 150–200 guided hours for a full-time or high-commitment learner; a working adult at 8–10 h/week needs 16–20 weeks for a full band.
- The 4-week Crash plan is a *polish* (typical honest outcome ≤ 0.5 band) — marketing may not describe it as a full-band jump.
- The planner (03 §3.12) uses these ranges to show "weeks to target" with an explicit uncertainty band.

### 2.5 IELTS Life Skills (UK family/settlement), separate short course

| Item | Detail | Verification |
|---|---|---|
| Test | IELTS Life Skills tests **speaking and listening only**, at CEFR **A1, A2 and B1**, taken as a short interview with another candidate and an examiner, ~16–22 min depending on level | Level and format from IELTS.org/UKVI pages **(verify)**; IDP Bangladesh lists "Life Skills (A1/B1)" at BDT 24,750 *(exam_specifications.md §3)*; A2 availability by centre **(verify)** |
| Requirement | Which level a given UK visa route requires changes with Home Office rules; UK policy has been changing | **Do not state which level a route needs.** Link to GOV.UK and ask the learner to confirm; legal/marketing review before launch (19/20) |
| Course design | Two SKUs (A1; B1) and an A2 bridge module; scope: listening to short exchanges, speaking about familiar topics, short interactive tasks with a partner | Content: §9 C8 |
| Pathway | Learners who also need a full IELTS should do Foundation + Core instead; Life Skills is *not* an IELTS Academic/GT preparation | |

### 2.6 Re-assessment points

- After M0 (diagnostic), after every sectional test, after every full mock.
- A "path change" prompt appears when two consecutive full mocks are ≥ 0.5 above the current course's target (move to Advanced) or ≥ 0.5 below target at week 8 of a 12-week plan (extend plan / book extra feedback).

---

## 3. Skill curricula

### 3.0 Conventions used in every skill section

**Hierarchy:** Course → Module → Unit → Lesson. IDs: `L2.1.3` = Listening module 2, unit 1, lesson 3 (Appendix A). Strand lessons (Grammar `G`, Vocabulary `V`) and course lessons (`M0`, `Z`) follow the same scheme.

**Lesson types**

| Code | Type | Format | Typical length |
|---|---|---|---|
| **VC** | Video concept | Teacher video, Bangla/English per edition, with English captions; 1 concept, ≤ 14 min; downloadable summary card | 8–14 min |
| **WE** | Worked example | Teacher solves/annotates a real task live; learner pauses to predict | 11–25 min |
| **GP** | Guided practice | Interactive practice set(s), untimed or loosely timed, hints on, instant feedback (practice mode, 07 §6.10) | 10–40 min |
| **TP** | Timed practice | Exam-conditions set/section/task; hints off; server-held timer (D6) | 15–165 min |
| **RV** | Review | Short review video or error-log session built from the learner's own tagged errors | 8–40 min |

**Objective notation:** `LO-<skill>-<band>-<n>` (e.g. `LO-L-6-2`). Thresholds are *mastery* thresholds on practice evidence, not predictions of the exam result. Raw-to-band references use the editable, approximate tables in 07 §3.2 (IDP-sourced; "approximate").

**Assessment cadence (all skills):**

| Assessment | Where | Format | Pass / mastery rule |
|---|---|---|---|
| Unit quiz | End of each unit | 6–8 auto-scored items (or a 1-paragraph self-check for W/S) | ≥ 75% to mark the unit complete; < 50% triggers the review lesson |
| Module checkpoint | End of each module | 15–20 mixed items or one timed task | Sets module mastery level (§8) |
| Sectional test | After L6, R7, Z | Full 40-question section in exam mode | Gives skill band estimate (07 §3.2) |
| Full mock | Z, Mock Series | L+R+W+S in exam mode | Gives overall estimate; drives readiness (§8) |

---

### 3.1 Listening

**Goal.** Reliably extract and write down specific information from four recordings heard once, in five major accents, with accurate spelling, within word limits, while managing attention across 30 minutes of audio. The test is identical in Academic and General Training.

#### 3.1.1 Learning objectives by band level

| Band zone | ID | Measurable objective (mastery evidence) |
|---|---|---|
| **→ 5.0** | LO-L-5-1 | Complete Part 1 form/note questions with ≥ 70% accuracy on untimed sets of 10 |
| | LO-L-5-2 | Write numbers, dates, times and prices from audio with ≥ 90% accuracy; spell 30 common names/places from letter names with ≥ 90% accuracy |
| | LO-L-5-3 | Predict the type of missing word (name, number, noun, adjective) before audio in ≥ 80% of items |
| **→ 6.0** | LO-L-6-1 | Answer Part 2 map/plan questions with ≥ 70% accuracy using direction/position language |
| | LO-L-6-2 | Identify the paraphrased correct option and reject distractors in Part 3 MCQ with ≥ 70% accuracy (tagged items) |
| | LO-L-6-3 | Follow self-correction ("sorry, I mean…") and choose the *final* answer in ≥ 75% of Part 1 correction items |
| | LO-L-6-4 | Score ≥ 23/40 (≈ Band 6.0, estimate) on two consecutive sectional tests, with ≤ 3 spelling or word-limit losses per test |
| **→ 6.5** | LO-L-65-1 | Score ≥ 26/40 (≈ Band 6.5, estimate) on two consecutive sectional tests or mocks |
| | LO-L-65-2 | Complete Part 3 matching/sentence-ending items at ≥ 70% with ≤ 1 speaker-attribution error per part |
| **→ 7.0** | LO-L-7-1 | Complete Part 4 note/summary items at ≥ 75% on lectures at ≥ 150 wpm |
| | LO-L-7-2 | Score ≥ 70% in each of the five accent sets, with no accent set more than 10 points below the best |
| | LO-L-7-3 | Score ≥ 30/40 (≈ Band 7.0, estimate) on two consecutive sectionals; ≤ 2 spelling/word-limit losses |
| **→ 8.0+** | LO-L-8-1 | Score ≥ 35/40 (≈ Band 8.0, estimate) on two consecutive sectionals; ≥ 80% on Part 3/4 distractor-tagged items |
| | LO-L-8-2 | Recover within one question after a missed answer (no more than 1 consecutive miss in 80% of parts) |

#### 3.1.2 Syllabus: modules, units, lessons

*6 module(s), 17 units, **72 lessons** (VC 22, WE 21, GP 16, TP 7, RV 6); video (VC+WE+RV) ≈ **9.9 h**; guided/timed practice in lessons ≈ 7.5 h.*


**L1 — Orientation and core listening skills**

| Unit | ID | Type | Lesson | Min |
|---|---|---|---|---|
| L1.1 Know the test | L1.1.1 | VC | How IELTS Listening works: 4 parts, 40 questions, audio played once | 10 |
|  | L1.1.2 | VC | Computer-delivered Listening: notes, flagging, review time | 8 |
|  | L1.1.3 | WE | Reading a question group: word limits and instructions | 12 |
|  | L1.1.4 | GP | Interface rehearsal in practice mode (untimed) | 12 |
| L1.2 Prediction and active listening | L1.2.1 | VC | Predict before you listen: grammar, topic, number, name | 11 |
|  | L1.2.2 | WE | Prediction on a form: three worked sets | 14 |
|  | L1.2.3 | VC | Signpost language: sequencing, contrast, correction | 12 |
|  | L1.2.4 | GP | Spot the signposts: guided audio drill | 18 |
| L1.3 Notes, numbers and spelling | L1.3.1 | VC | Letter names and trap pairs (A/E/I, G/J, B/V, M/N) | 10 |
|  | L1.3.2 | WE | Numbers, dates, times, prices and phone numbers | 12 |
|  | L1.3.3 | GP | Dictation drill: names, numbers, postcodes | 18 |
|  | L1.3.4 | RV | Your top-10 listening spelling errors and the error log | 9 |

**L2 — Part 1: everyday conversations**

| Unit | ID | Type | Lesson | Min |
|---|---|---|---|---|
| L2.1 Form and note completion | L2.1.1 | VC | Part 1 profile: situations, speakers, traps | 10 |
|  | L2.1.2 | WE | Form completion worked set (booking) | 14 |
|  | L2.1.3 | WE | Note completion worked set (enquiry) | 14 |
|  | L2.1.4 | GP | Form completion practice sets 1-4 | 20 |
|  | L2.1.5 | GP | Note completion practice sets 1-4 | 20 |
| L2.2 Table, sentence completion and short answer | L2.2.1 | VC | Table completion: reading the columns as a map | 10 |
|  | L2.2.2 | WE | Sentence completion: grammar fit and word limits | 13 |
|  | L2.2.3 | WE | Short-answer questions: question words and limits | 12 |
|  | L2.2.4 | GP | Table and sentence completion sets | 20 |
| L2.3 Part 1 stamina | L2.3.1 | VC | Self-correction and distractors in Part 1 | 11 |
|  | L2.3.2 | WE | Distractor walk-through (three audio extracts) | 14 |
|  | L2.3.3 | TP | Timed Part 1 (10 questions) x3 | 15 |
|  | L2.3.4 | RV | Part 1 review: error patterns | 10 |

**L3 — Part 2: monologues, maps and plans**

| Unit | ID | Type | Lesson | Min |
|---|---|---|---|---|
| L3.1 Maps and plans | L3.1.1 | VC | Orientation language: directions, positions, landmarks | 12 |
|  | L3.1.2 | GP | Sixty-second map preview technique | 10 |
|  | L3.1.3 | WE | Map labelling worked example (town map) | 14 |
|  | L3.1.4 | WE | Plan labelling worked example (floor/site plan) | 14 |
|  | L3.1.5 | GP | Map and plan practice sets 1-5 | 22 |
| L3.2 Multiple choice and matching in Part 2 | L3.2.1 | VC | MCQ in Part 2: paraphrase and distractors | 11 |
|  | L3.2.2 | VC | Choose TWO or THREE: handling multi-answer MCQ | 9 |
|  | L3.2.3 | WE | Matching features (people, places, services) | 13 |
|  | L3.2.4 | GP | Matching and MCQ sets 1-4 | 20 |
| L3.3 Public information talks | L3.3.1 | VC | Part 2 talk structure: announcements, tours, services | 10 |
|  | L3.3.2 | WE | Following a tour or process while taking notes | 13 |
|  | L3.3.3 | TP | Timed Part 2 (10 questions) x3 | 15 |
|  | L3.3.4 | RV | Part 2 review: what you missed and why | 10 |

**L4 — Part 3: academic discussions**

| Unit | ID | Type | Lesson | Min |
|---|---|---|---|---|
| L4.1 Opinion and attitude | L4.1.1 | VC | Part 3 profile: tutor-student talk, 2-4 speakers | 10 |
|  | L4.1.2 | VC | Opinion, attitude, agreement and disagreement language | 12 |
|  | L4.1.3 | WE | Who said what: speaker-tracking techniques | 14 |
|  | L4.1.4 | GP | Speaker-matching practice sets 1-4 | 20 |
| L4.2 MCQ, multi-select and sentence endings | L4.2.1 | VC | Part 3 MCQ distractors: the four paraphrase traps | 12 |
|  | L4.2.2 | WE | MCQ elimination using audio landmarks | 14 |
|  | L4.2.3 | WE | Matching sentence endings by grammar then meaning | 13 |
|  | L4.2.4 | GP | MCQ and sentence-ending sets 1-5 | 22 |
| L4.3 Summary, flow-chart and table | L4.3.1 | VC | Flow-chart and process: sequence words | 10 |
|  | L4.3.2 | WE | Summary completion with and without a word bank | 14 |
|  | L4.3.3 | GP | Flow-chart and summary sets 1-4 | 20 |
|  | L4.3.4 | TP | Timed Part 3 (10 questions) x3 | 15 |
|  | L4.3.5 | RV | Part 3 review | 10 |

**L5 — Part 4: academic lectures**

| Unit | ID | Type | Lesson | Min |
|---|---|---|---|---|
| L5.1 Lecture structure and note-taking | L5.1.1 | VC | Part 4 profile: academic monologue, no pauses | 10 |
|  | L5.1.2 | VC | Lecture structure: intro, signposts, examples, summary | 12 |
|  | L5.1.3 | WE | Note-taking shorthand for lectures (live demo) | 14 |
|  | L5.1.4 | GP | Lecture note-taking drills 1-4 | 20 |
| L5.2 Completion under pressure | L5.2.1 | VC | Note and summary completion: keywords and synonyms | 12 |
|  | L5.2.2 | WE | Summary completion: two-lecture worked set | 15 |
|  | L5.2.3 | WE | Diagram and table completion in lectures | 13 |
|  | L5.2.4 | GP | Part 4 completion sets 1-5 | 22 |
| L5.3 Part 4 stamina | L5.3.1 | VC | Staying with the lecture: recovering after a missed answer | 10 |
|  | L5.3.2 | TP | Timed Part 4 (10 questions) x3 | 15 |
|  | L5.3.3 | TP | Parts 3 and 4 back-to-back (20 questions) | 20 |
|  | L5.3.4 | RV | Part 4 review and error-log update | 10 |

**L6 — Accents, speed and the full section**

| Unit | ID | Type | Lesson | Min |
|---|---|---|---|---|
| L6.1 Accents and speed | L6.1.1 | VC | British, Australian, NZ, North American and Canadian: what changes | 12 |
|  | L6.1.2 | GP | Accent ear-training: same script, five accents | 18 |
|  | L6.1.3 | WE | Fast speech: weak forms, linking, reductions | 13 |
|  | L6.1.4 | GP | Speed ladder: shadow-listening from slow to exam pace | 15 |
| L6.2 Full-section skills | L6.2.1 | VC | Managing 40 questions: attention, recovery, checking | 10 |
|  | L6.2.2 | WE | Full Listening section walk-through (annotated) | 25 |
|  | L6.2.3 | TP | Sectional Listening Test A (40 questions) | 35 |
|  | L6.2.4 | TP | Sectional Listening Test B (40 questions) | 35 |
|  | L6.2.5 | RV | Sectional A and B review: error taxonomy | 15 |

#### 3.1.3 Practice sets per question type (07 registry names)

Item counts are the **full-spec** bank (Wave 2 in 16); Wave 1 (P1 launch) ships ≥ 60% of each row and always all four mocks. "Lesson sets" are sets linked from GP lessons; "Hub sets" are the extra "more like this" sets in `/app/practice`.

| Type | Lesson sets | Hub sets | Items per set | Items |
|---|---|---|---|---|
| `ielts.form_completion` | 4 | 4 | 6 | 48 |
| `ielts.note_completion` | 6 | 4 | 6 | 60 |
| `ielts.table_completion` | 3 | 5 | 6 | 48 |
| `ielts.sentence_completion` | 3 | 5 | 5 | 40 |
| `ielts.short_answer` | 2 | 4 | 5 | 30 |
| `ielts.mcq_single` | 5 | 5 | 5 | 50 |
| `ielts.mcq_multi` | 3 | 3 | 4 | 24 |
| `ielts.map_label` | 5 | 3 | 5 | 40 |
| `ielts.match_features` | 4 | 4 | 5 | 40 |
| `ielts.match_sentence_endings` | 2 | 2 | 5 | 20 |
| `ielts.summary_completion` | 3 | 3 | 6 | 36 |
| `ielts.flow_chart_completion` | 2 | 2 | 5 | 20 |
| `ielts.diagram_label_completion` | 2 | 2 | 5 | 20 |
| **Type drills subtotal** | | | | **476** |
| Full-part sets (Parts 1-4, 6 each = 24 parts x 10 items) | | | 10 | 240 |
| Sectional tests A-D (4 x 40) | | | 40 | 160 |
| Dictation, letter-name, number and spelling micro-drills | | | | 300 |
| **Listening practice total (excl. mocks)** | | | | **1176** |
| Mocks 1-4 (Listening section, 4 x 40) | | | | 160 (separate) |

Audio for the bank is specified in §6.3. Every item carries tags: `type`, `part`, `accent`, `wpm_band`, `trap` (correction / paraphrase / distractor / spelling / number / map), `ltarget` (band zone). The practice hub filters by those tags.

#### 3.1.4 Strategies per question type

| Type (07) | Part(s) | Before audio (preview time) | While listening | Check / copy-in | Typical trap |
|---|---|---|---|---|---|
| `ielts.form_completion` | 1 | Predict word class; underline the field labels | Write the answer when you hear the label's signal; expect correction | Spelling, capital letters, word limit; names spelt out letter by letter | "No, sorry, it's 15 — one-five" correction |
| `ielts.note_completion` | 1, 4 | Read heading and bullet order; predict content | Follow note order (audio follows it) | Word limit, singular/plural, "AND/OR A NUMBER" rule | Synonym replaces the written key word |
| `ielts.table_completion` | 1, 3, 4 | Read column headers; decide row-by-row logic | Listen for category switches (price → time → place) | Units and symbols | Two numbers for one cell |
| `ielts.sentence_completion` | 1–4 | Predict grammar (noun/verb/adj) from the sentence | Match the question's key word to its paraphrase | Grammar of full sentence | Right word, wrong form |
| `ielts.short_answer` | 1–4 | Underline question words (what/where/how many) | Keep answer ≤ word limit | Over-limit answers score 0 (07 §2.3.1) | Extra word breaks limit |
| `ielts.mcq_single` | 2–4 | Read stem + options; mark key nouns | Wait for the *final* statement; eliminate | Option letter only | Mentioned but rejected options |
| `ielts.mcq_multi` | 2–4 | Note "choose TWO/THREE"; each = separate marks | Tick as each is confirmed; do not guess early | Exactly the number requested (UI enforces) | Third plausible option |
| `ielts.map_label` | 2 | 60-second map preview: find "You are here", entrance, compass, landmarks; name route | Track the speaker's route step by step; mark each label as the speaker moves | Letter only; check direction (left/right relative to whom) | Speaker's vantage point changes |
| `ielts.diagram_label_completion` | 2, 4 | Understand the process/structure; predict word class | Follow parts in order | Spelling | Technical terms |
| `ielts.match_features` | 2, 3 | Read categories (A–E) and items | Mark the speaker/idea each time a category word is heard | Each letter once or reused per instruction | Opinion changes mid-conversation |
| `ielts.match_sentence_endings` | 3 | Read starters; guess grammar of endings | Match by meaning after grammar elimination | No leftover grammar mismatch | Two endings fit grammatically |
| `ielts.summary_completion` | 3, 4 | Read the whole summary; predict missing ideas | Answers are in the same order as questions | Word limit; word bank form | Word-bank distractors |
| `ielts.flow_chart_completion` | 3 | Understand sequence; predict verbs/nouns | Listen for sequencers (first, after that, finally) | Order logic | "Before" vs "after" reversals |

**Cross-type techniques taught (L1, L2.3, L6):**
- *Prediction and preview:* use the preview time to mark key words, guess word class and note numbers.
- *Signpost language:* sequencers, contrast (however/actually), correction ("no, not …"), emphasis, topic closing ("so that's…").
- *Spelling of names and numbers:* letter-name drills (A/E/I, G/J, B/V, M/N), double letters ("double-L"), "oh/zero", UK vs US number conventions, date formats, phone grouping; dictation drills with error log. For Bangla speakers, particular traps: /v/–/w/–/b/ confusion when hearing letters (V vs B vs W), "fifteen/fifty", "thirteen/thirty".
- *Map/plan orientation:* identify entrance, compass, landmarks; relational language (opposite, next to, beyond, at the end of); track the speaker's route; label as you move.
- *Never leave a blank:* no negative marking.
- *Transfer:* in the computer test answers are typed in directly; practice mode trains directly-typed answers with word-count nudges (07 §6.4).

#### 3.1.5 Common mistakes (tagged in the error log)

| Tag | Mistake | Remedy |
|---|---|---|
| `spell_name` | Mis-spelling names from letter names; B/V/W errors | Letter-name drills; error log deck |
| `number_slip` | 13/30, 15/50, decimal and phone grouping | Stress-pair drills (L1.3) |
| `word_limit` | More words than allowed; numbers where words expected | Limit-check habit; checklist |
| `correction_miss` | Writing first value, ignoring correction | L2.3 distractor lesson |
| `paraphrase_miss` | Looking for the written word, not its synonym | Paraphrase mapping (R2 cross-use) |
| `lost_place` | Losing the question order after a miss | Recovery drill (L5.3, L6.2) |
| `plural_s` | Missing -s/-es on answers | G7 and answer-form check |
| `accent_gap` | Poor accuracy on one accent | Accent ladder (L6.1) |

#### 3.1.6 Assessments and feedback touchpoints

| Level | What | Rule |
|---|---|---|
| Unit quiz | 8 items after each unit | ≥ 75% = unit complete |
| Part sets | 10-item part (timed) | Tracked by part and trap tag |
| Sectional A–D | 40 items, exam mode | Band estimate; two consecutive ≥ target → "Listening: exam-ready" flag |
| Full mocks | Mock 1–4 in course; up to 10 with Plus/Series | Cadence in §7 |

| Touchpoint | Auto | AI | Human |
|---|---|---|---|
| Item explanation + distractor note | Yes | — | — |
| Error-tag digest (weekly) | Yes | Summary text | Live/Mentor: mentor reviews weekly |
| Dictation/spelling coaching | Yes | AI suggests the 10 weakest letter pairs | — |
| Sectional review | Review video (RV) | AI paragraph on patterns | Live: live "mock debrief" session; Mentor: 1:1 debrief |

---

### 3.2 Reading

**Goal.** Locate, understand and verify information in three long texts in 60 minutes, handling eleven question types, paraphrase and a rising difficulty gradient. Academic and General Training share skills but differ in text types, timing strategy and raw-to-band conversion (GT is more lenient; separate tables in 07 §3.2).

#### 3.2.1 Learning objectives by band level

| Band zone | ID | Measurable objective |
|---|---|---|
| **→ 5.0** | LO-R-5-1 | Complete Passage-1-level tasks (completion, MCQ) at ≥ 70% accuracy in ≤ 20 min |
| | LO-R-5-2 | Identify the paragraph that contains a stated idea (matching information) at ≥ 60% accuracy |
| | LO-R-5-3 | Use skimming to state the main idea of a paragraph in ≤ 12 words, ≥ 70% agreement with key |
| **→ 6.0** | LO-R-6-1 | Distinguish TRUE/FALSE/NOT GIVEN with ≥ 65% accuracy on tagged items (NG vs F confusion < 25% of errors) |
| | LO-R-6-2 | Match headings to paragraphs at ≥ 65% accuracy |
| | LO-R-6-3 | Recognise paraphrase in ≥ 75% of paraphrase-tagged drills (synonym, word class, structure, negation, summary) |
| | LO-R-6-4 | Score ≥ 23/40 (Academic, ≈ 6.0 estimate) in 60 minutes on two consecutive sectionals; GT ≥ 30/40 |
| **→ 6.5** | LO-R-65-1 | Score ≥ 27/40 (Academic ≈ 6.5) or ≥ 32/40 (GT ≈ 6.5) in 60 minutes, twice running |
| | LO-R-65-2 | Complete all three passages with ≥ 3 minutes remaining in 60% of timed attempts |
| **→ 7.0** | LO-R-7-1 | Score ≥ 30/40 (Academic ≈ 7.0) or ≥ 34/40 (GT) in 60 minutes on two consecutive sectionals |
| | LO-R-7-2 | YNNG accuracy ≥ 70% on writer's-view items; multi-answer MCQ accuracy ≥ 65% |
| | LO-R-7-3 | Passage 3 accuracy ≥ 65% in ≤ 22 minutes |
| **→ 8.0+** | LO-R-8-1 | Score ≥ 35/40 (Academic ≈ 8.0) in 60 minutes twice; ≤ 1 spelling/word-limit loss per test |
| | LO-R-8-2 | TFNG/YNNG ≥ 85%; headings/feature matching ≥ 80% |

(Raw thresholds are approximate and taken from the IDP tables in `exam_specifications_gapfill.md` §4; they live as editable data in 07.)

#### 3.2.2 Syllabus: modules, units, lessons

*7 module(s), 18 units, **72 lessons** (VC 22, WE 19, GP 16, TP 7, RV 8); video (VC+WE+RV) ≈ **10.5 h**; guided/timed practice in lessons ≈ 9.2 h.*


**R1 — Orientation and core reading skills**

| Unit | ID | Type | Lesson | Min |
|---|---|---|---|---|
| R1.1 Know the test | R1.1.1 | VC | IELTS Reading: 3 texts, 40 questions, 60 minutes | 10 |
|  | R1.1.2 | VC | The 11 question types in one map | 12 |
|  | R1.1.3 | GP | Interface rehearsal: highlight, notes, split screen | 12 |
| R1.2 Skimming and scanning | R1.2.1 | VC | Skimming: title, first sentences, topic sentences | 12 |
|  | R1.2.2 | WE | Skim a passage in two minutes: worked examples | 14 |
|  | R1.2.3 | VC | Scanning for names, numbers, dates and capitalised terms | 10 |
|  | R1.2.4 | GP | Skim-and-scan speed drills 1-5 | 20 |
| R1.3 Paragraph logic | R1.3.1 | VC | Paragraph anatomy: topic sentence, support, example, contrast | 11 |
|  | R1.3.2 | WE | Mapping a passage with margin summaries | 14 |
|  | R1.3.3 | GP | Paragraph-mapping practice (four passages) | 25 |
|  | R1.3.4 | RV | Baseline timed passage and time log | 10 |

**R2 — Paraphrase and vocabulary-in-context engine**

| Unit | ID | Type | Lesson | Min |
|---|---|---|---|---|
| R2.1 Paraphrase recognition | R2.1.1 | VC | Five paraphrase moves: synonym, word class, structure, negation, summary | 13 |
|  | R2.1.2 | WE | Paraphrase hunting at sentence level | 14 |
|  | R2.1.3 | GP | Paraphrase matching drills 1-6 | 18 |
|  | R2.1.4 | RV | Paraphrase error log | 8 |
| R2.2 Unknown words | R2.2.1 | VC | Guessing meaning from context, affixes and word families | 12 |
|  | R2.2.2 | WE | Academic vocabulary in context: three passages | 14 |
|  | R2.2.3 | GP | Context-clue drills | 15 |
|  | R2.2.4 | TP | Paraphrase and context mini-test (15 minutes) | 15 |

**R3 — Information-check types: TFNG, YNNG, matching information**

| Unit | ID | Type | Lesson | Min |
|---|---|---|---|---|
| R3.1 True / False / Not Given | R3.1.1 | VC | TFNG logic: what TRUE, FALSE and NOT GIVEN really mean | 13 |
|  | R3.1.2 | WE | TFNG worked set 1: FALSE versus NOT GIVEN | 15 |
|  | R3.1.3 | WE | TFNG worked set 2: absolutes, qualifiers, tense | 15 |
|  | R3.1.4 | GP | TFNG practice sets 1-8 | 25 |
| R3.2 Yes / No / Not Given | R3.2.1 | VC | YNNG: writer's views versus facts; hedging and modality | 13 |
|  | R3.2.2 | WE | YNNG worked set: spotting opinion language | 15 |
|  | R3.2.3 | GP | YNNG practice sets 1-6 | 25 |
|  | R3.2.4 | RV | TFNG/YNNG error taxonomy review | 10 |
| R3.3 Matching information | R3.3.1 | VC | Matching information to paragraphs: locate by idea, not word | 12 |
|  | R3.3.2 | WE | Matching information worked set (7 items) | 15 |
|  | R3.3.3 | GP | Matching information sets 1-5 | 22 |
|  | R3.3.4 | TP | Timed mixed information-check passage x2 | 20 |

**R4 — Matching headings, features and sentence endings**

| Unit | ID | Type | Lesson | Min |
|---|---|---|---|---|
| R4.1 Matching headings | R4.1.1 | VC | Headings: main idea versus detail versus distractor | 13 |
|  | R4.1.2 | WE | Headings worked set: eliminate, then confirm | 15 |
|  | R4.1.3 | GP | Headings sets 1-6 | 22 |
|  | R4.1.4 | RV | Headings review: why the traps work | 8 |
| R4.2 Matching features | R4.2.1 | VC | Matching features: names, theories, dates; scanning order | 12 |
|  | R4.2.2 | WE | Matching features worked set | 14 |
|  | R4.2.3 | GP | Matching features sets 1-5 | 20 |
| R4.3 Matching sentence endings | R4.3.1 | VC | Sentence endings: grammar first, then meaning | 11 |
|  | R4.3.2 | WE | Sentence endings worked set | 14 |
|  | R4.3.3 | GP | Sentence-ending sets 1-4 | 18 |
|  | R4.3.4 | TP | Timed matching-types passage x2 | 20 |

**R5 — Completion types and short answers**

| Unit | ID | Type | Lesson | Min |
|---|---|---|---|---|
| R5.1 Sentence completion and short answer | R5.1.1 | VC | Sentence completion: word limit, grammar fit, singular/plural | 12 |
|  | R5.1.2 | WE | Sentence completion worked set | 14 |
|  | R5.1.3 | VC | Short-answer questions: question words and word-limit rules | 10 |
|  | R5.1.4 | GP | Sentence and short-answer sets 1-6 | 22 |
| R5.2 Summary, note, table and flow-chart | R5.2.1 | VC | Summary completion: with and without a word bank | 13 |
|  | R5.2.2 | WE | Summary completion worked sets | 15 |
|  | R5.2.3 | VC | Note, table and flow-chart completion: locate the zone | 12 |
|  | R5.2.4 | WE | Table and flow-chart worked set | 14 |
|  | R5.2.5 | GP | Summary/note/table/flow-chart sets 1-8 | 25 |
| R5.3 Diagram labels and review | R5.3.1 | VC | Diagram label completion: read text and visual together | 11 |
|  | R5.3.2 | WE | Diagram label worked set | 13 |
|  | R5.3.3 | GP | Diagram label sets 1-4 | 18 |
|  | R5.3.4 | TP | Timed completion-types passage x2 | 20 |
|  | R5.3.5 | RV | Completion error review: spelling, word limit, form | 9 |

**R6 — Multiple choice and passage-level reading**

| Unit | ID | Type | Lesson | Min |
|---|---|---|---|---|
| R6.1 Multiple choice | R6.1.1 | VC | MCQ: stem first, elimination, distractor types | 12 |
|  | R6.1.2 | WE | MCQ single and multi-answer worked set | 15 |
|  | R6.1.3 | GP | MCQ sets 1-6 | 22 |
| R6.2 Arguments and the hardest passage | R6.2.1 | VC | Reading arguments: claim, evidence, counter-claim, conclusion | 13 |
|  | R6.2.2 | WE | Passage 3 walk-through: mapping a dense argument | 18 |
|  | R6.2.3 | VC | Abstract nouns and nominalisation: reading for gist under pressure | 12 |
|  | R6.2.4 | GP | Passage 3 skills sets 1-4 (long, abstract passages) | 28 |
|  | R6.2.5 | RV | Passage 3 timing review | 8 |

**R7 — Time budgeting and the full section**

| Unit | ID | Type | Lesson | Min |
|---|---|---|---|---|
| R7.1 Time strategy | R7.1.1 | VC | The 60-minute plan: pacing, when to skip, when to guess | 11 |
|  | R7.1.2 | WE | Three-passage time plan with checkpoints | 14 |
|  | R7.1.3 | TP | Timed single passage (20 minutes) x4 | 20 |
| R7.2 Full section | R7.2.1 | WE | Full Reading section walk-through (annotated) | 25 |
|  | R7.2.2 | TP | Sectional Reading Test 1 | 60 |
|  | R7.2.3 | RV | Sectional 1 review | 15 |
|  | R7.2.4 | TP | Sectional Reading Test 2 | 60 |
|  | R7.2.5 | RV | Sectional 2 review | 15 |

**General Training add-on module (GT only; in Academic it is not shown).** GT uses R1–R7 above with GT passage banks, plus R8:

*1 module(s), 3 units, **13 lessons** (VC 5, WE 3, GP 3, TP 1, RV 1); video (VC+WE+RV) ≈ **1.8 h**; guided/timed practice in lessons ≈ 2.1 h.*


**R8 — General Training Reading: three sections**

| Unit | ID | Type | Lesson | Min |
|---|---|---|---|---|
| R8.1 Section 1: everyday texts | R8.1.1 | VC | GT Reading structure: three sections, text types | 10 |
|  | R8.1.2 | VC | Section 1: adverts, notices, timetables, brochures | 12 |
|  | R8.1.3 | WE | Scanning short factual texts at speed | 14 |
|  | R8.1.4 | GP | Section 1 sets 1-6 | 20 |
| R8.2 Section 2: workplace texts | R8.2.1 | VC | Workplace texts: job adverts, contracts, policies, training | 12 |
|  | R8.2.2 | WE | Section 2 worked set: handbook and policy language | 14 |
|  | R8.2.3 | GP | Section 2 sets 1-6 | 22 |
|  | R8.2.4 | RV | Sections 1-2 review: banking time | 8 |
| R8.3 Section 3: the long text | R8.3.1 | VC | Section 3: descriptive and discursive magazine-style texts | 12 |
|  | R8.3.2 | WE | Section 3 worked set | 15 |
|  | R8.3.3 | GP | Section 3 sets 1-4 | 25 |
|  | R8.3.4 | VC | GT timing: bank time in Sections 1-2, spend it in Section 3 | 10 |
|  | R8.3.5 | TP | GT sectional Reading test | 60 |

#### 3.2.3 Practice sets per question type

| Type | Lesson sets | Hub sets | Items per set | Items |
|---|---|---|---|---|
| `ielts.tfng` | 8 | 6 | 6 | 84 |
| `ielts.ynng` | 6 | 4 | 6 | 60 |
| `ielts.match_information` | 5 | 4 | 6 | 54 |
| `ielts.match_headings` | 6 | 4 | 6 | 60 |
| `ielts.match_features` | 5 | 3 | 5 | 40 |
| `ielts.match_sentence_endings` | 4 | 3 | 5 | 35 |
| `ielts.sentence_completion` | 3 | 4 | 5 | 35 |
| `ielts.short_answer` | 3 | 3 | 4 | 24 |
| `ielts.summary_completion` | 4 | 4 | 5 | 40 |
| `ielts.note_completion` | 2 | 3 | 5 | 25 |
| `ielts.table_completion` | 2 | 3 | 5 | 25 |
| `ielts.flow_chart_completion` | 2 | 2 | 5 | 20 |
| `ielts.diagram_label_completion` | 4 | 2 | 5 | 30 |
| `ielts.mcq_single` | 3 | 4 | 4 | 28 |
| `ielts.mcq_multi` | 3 | 3 | 4 | 24 |
| **Type drills subtotal** | | | | **584** |
| Micro-drills: scanning 5 sets x 10; paraphrase 6 x 10; context clues 4 x 10 | | | | 150 |
| Timed full-passage bank (36 passages x 13 items) | | | 13 | 468 |
| Passage 3 skills sets (4 x 14) | | | 14 | 56 |
| Sectional tests 1, 2 and D (3 x 40) | | | 40 | 120 |
| **Academic Reading practice total (excl. mocks)** | | | | **1378** |
| Mocks 1-4 (Reading section, 4 x 40) | | | | 160 (separate) |
| *GT Reading bank (R drills reused + GT section sets: S1 14x7, S2 14x6, S3 8x13 = 286; 8 full 40-question GT sets = 320; GT sectionals 2 x 40 = 80)* | | | | *1420* |

Passage specs: §6.4. All items tagged `type`, `passage_level` (1–3), `genre`, `paraphrase_move`, `trap`, `band_zone`. TFNG and YNNG items carry a rationale line quoting the decisive sentence (paraphrase, not copy, of source text; sources original per 16).

#### 3.2.4 Strategies per question type

| Type (07) | Locate | Decide | Time (typical) | Trap |
|---|---|---|---|---|
| `ielts.tfng` | Find the statement's key idea by scanning for synonyms | TRUE = the text agrees; FALSE = the text contradicts; NOT GIVEN = the text does not say. Check qualifiers (all/some/never), tense, comparison | 1 min per item | Over-using background knowledge; confusing NG with F |
| `ielts.ynng` | Identify opinion language (believes, claims, doubtful) | YES = writer's view agrees; NO = contradicts; NG = no clear view. Facts ≠ views | 1–1.5 min | Treating a reported view as the writer's |
| `ielts.match_headings` | Read headings first; mark main idea of each paragraph by topic sentence | Eliminate headings that match only a detail; check heading covers the whole paragraph | 5–7 min for 6 | Heading matching one sentence; unused extra headings |
| `ielts.match_information` | Locate by *idea*, not word; paragraph labels | Paragraph may repeat across items | 1.5 min per item | Same word in wrong paragraph |
| `ielts.match_features` | Scan for names/dates/theories; list order | Same letter may be reused | 1 min per item | Attribution of opinion to wrong person |
| `ielts.match_sentence_endings` | Read the stem; test each ending for grammar then meaning | One extra ending | 1 min per item | Grammar fits two endings |
| `ielts.sentence_completion` | Find sentence in text via key word; the answer follows or precedes | Copy words from text; ≤ limit | 1 min | Over limit; wrong form |
| `ielts.summary_completion` | Locate the summary's section of text; read around blanks | With a bank: part of speech; without a bank: copy from text | 5 min per summary | Word-bank near-synonyms |
| `ielts.note_completion` / `table_completion` / `flow_chart_completion` | Identify the zone (paragraph range) from heading/row labels | Read the zone slowly | 1 min per item | Wrong zone |
| `ielts.diagram_label_completion` | Read both visual and text | Copy label words | 1 min | Visual ≠ text order |
| `ielts.short_answer` | Question word → text zone | Copy ≤ limit | 1 min | Plural vs singular |
| `ielts.mcq_single` / `mcq_multi` | Stem first; locate; read option by option | Eliminate; for multi-answer each is separate | 1.5 min | Distractors reuse text words |

**Cross-type techniques**
- *Skimming and scanning* (R1.2): 2-minute survey per passage; scanning for capitals/numbers.
- *Time budgeting* (R7): the standard plan is 20 min per passage on the Academic test; recommended starting split **17 / 20 / 23** (easy to hard) with checkpoints at 17, 37, and 57 minutes, then 3 minutes to transfer/check. GT: bank time in Sections 1 and 2, spend it in Section 3. (Advice, not rule — individuals may vary.)
- *Paraphrase recognition* (R2): five moves — synonym, word class change, structure change (active/passive; clause reorder), negation ("not many" = "few"), summary (several sentences → one idea).
- *TFNG vs YNNG logic* (R3): TFNG tests facts; YNNG tests the writer's claims/opinion. "NOT GIVEN" means unverifiable from the text, never "I think it is false".
- *Vocabulary in context* (R2.2): word families, affix, context clues; ignore unknown words that are not in the answer zone.

#### 3.2.5 Common mistakes

| Tag | Mistake | Remedy |
|---|---|---|
| `tfng_ng_vs_f` | Marking NG as FALSE (or the reverse) | R3.1 decision tree; contradiction test |
| `word_limit` | Over the limit; articles added | Limit-check ritual |
| `qualifier_miss` | Ignoring "some/all/often/may" | Highlight qualifiers |
| `paraphrase_miss` | Searching for exact words | R2.1 moves |
| `zone_error` | Answering from the wrong paragraph | Paragraph map |
| `time_sink` | > 25 min on one passage | Checkpoint rule; "skip and return" |
| `heading_detail_trap` | Choosing a heading that fits one detail | Heading-vs-detail test |
| `spelling_copy` | Mis-copying the text word | Copy-letter-by-letter check |
| `speed_pattern` | Reading every word of Passage 1 slowly | Skim first |

#### 3.2.6 Assessments and feedback touchpoints

| Level | What | Rule |
|---|---|---|
| Unit quiz | 8 items | ≥ 75% = complete |
| Timed single passage | 13–14 items, 20 min | Pace chart per passage |
| Sectional 1, 2, D | 40 items, 60 min | Band estimate (separate tables Academic/GT) |
| Full mocks | 4 in-course; up to 10 with Plus/Series | §7 cadence |

| Touchpoint | Auto | AI | Human |
|---|---|---|---|
| Item rationale | Yes (decisive sentence + paraphrase tag) | — | — |
| Pace chart | Yes (time per passage/type) | Written advice | — |
| Weakness plan | Yes | AI proposes next 3 sets | Live/Mentor: weekly review |
| Passage-3 clinic | — | — | Plus: weekly live Q&A; Live: dedicated session; Mentor: 1:1 |

---

### 3.3 Writing

**Goal.** Produce, in 60 minutes, two well-organised, fully developed and accurate responses: Academic Task 1 (describe a visual) or GT Task 1 (letter), and Task 2 (essay). Task 2 counts about twice as much as Task 1. Four equally weighted criteria: Task Achievement/Response, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy.

#### 3.3.1 Learning objectives by band level

| Band zone | ID | Measurable objective (evidence = AI/human-graded submissions + checklists) |
|---|---|---|
| **→ 5.0** | LO-W-5-1 | Write a complete Task 1 (≥ 150 words) covering the main features in ≤ 25 min with an overview present in ≥ 70% of attempts |
| | LO-W-5-2 | Write a Task 2 of ≥ 250 words that states a position and has 2 body paragraphs in ≤ 45 min |
| | LO-W-5-3 | Sentence-level error rate ≤ 1 error per 2 sentences on the Accuracy Clinic checks |
| **→ 6.0** | LO-W-6-1 | Task 1: clear overview, selected key features, accurate figures in ≥ 80% of submissions (checklist) |
| | LO-W-6-2 | Task 2: position clear throughout; every body paragraph has a main idea + extension + example; 4 of 5 checklist points on 3 consecutive essays |
| | LO-W-6-3 | Use ≥ 6 complex-sentence forms accurately (relative, conditional, concessive, participial, passive, noun clause) across a task, with ≥ 50% of sentences error-free |
| | LO-W-6-4 | Estimated band ≥ 6.0 on each of the four criteria in two consecutive timed AI/human evaluations |
| **→ 6.5** | LO-W-65-1 | Paragraph-level cohesion without connector over-use (≤ 1 mechanical connector per 50 words); ≥ 60% error-free sentences |
| | LO-W-65-2 | Estimated 6.5 overall in two consecutive evaluations, at least one human-reviewed |
| **→ 7.0** | LO-W-7-1 | Task 2: fully addresses all parts; position developed and supported; ideas extended with precision |
| | LO-W-7-2 | Lexical Resource: ≥ 8 accurate less-common collocations per essay (not memorised); ≤ 2 spelling errors |
| | LO-W-7-3 | ≥ 70% error-free sentences; wide range of structures; ≥ 7.0 estimate twice, one human-reviewed |
| **→ 8.0+** | LO-W-8-1 | Flexible, precise language; skilful paragraphing; error-free sentences ≥ 85%; rare slips non-systematic |
| | LO-W-8-2 | Two consecutive human-reviewed ≥ 8.0 estimates, with no template-similarity flag |

#### 3.3.2 Syllabus: modules, units, lessons

**Academic Writing (Academic uses W1–W7; Writing Mastery adds W8 and W9).**

*7 module(s), 18 units, **82 lessons** (VC 33, WE 24, GP 14, TP 4, RV 7); video (VC+WE+RV) ≈ **13.9 h**; guided/timed practice in lessons ≈ 7.7 h.*


**W1 — Foundations: criteria and process**

| Unit | ID | Type | Lesson | Min |
|---|---|---|---|---|
| W1.1 Know the criteria | W1.1.1 | VC | The four criteria in plain language (task, coherence, lexis, grammar) | 14 |
|  | W1.1.2 | WE | Band 5, 6 and 7 samples side by side | 16 |
|  | W1.1.3 | VC | What examiners penalise: memorised language, under-length, off-topic | 12 |
|  | W1.1.4 | RV | Self-assess a sample against the criteria | 10 |
| W1.2 The 60-minute process | W1.2.1 | VC | The 20/40 split, planning and checking | 11 |
|  | W1.2.2 | VC | Planning in three minutes: idea, structure, sentence | 11 |
|  | W1.2.3 | GP | Timed planning drills (no writing) | 15 |
|  | W1.2.4 | WE | Proofreading routine: five passes in two minutes | 12 |

**W2 — Academic Task 1: core skills**

| Unit | ID | Type | Lesson | Min |
|---|---|---|---|---|
| W2.1 Task analysis and the overview | W2.1.1 | VC | Task 1 requirements: what the grader wants | 12 |
|  | W2.1.2 | WE | Reading a visual: trend, comparison, extremes | 14 |
|  | W2.1.3 | VC | Writing the overview: the most important paragraph | 14 |
|  | W2.1.4 | WE | Overview: weak, good and excellent versions | 14 |
|  | W2.1.5 | GP | Overview writing clinic 1-6 | 20 |
| W2.2 Selecting and grouping data | W2.2.1 | VC | Data selection: key features, not every number | 12 |
|  | W2.2.2 | WE | Grouping data into body paragraphs | 14 |
|  | W2.2.3 | GP | Select-and-group drills | 18 |
|  | W2.2.4 | TP | Timed Task 1 (20 minutes) with checklist | 20 |
| W2.3 The language of data | W2.3.1 | VC | Trend language: verbs, adverbs, nouns, prepositions of change | 14 |
|  | W2.3.2 | VC | Comparison language: comparatives, superlatives, proportions | 13 |
|  | W2.3.3 | WE | Accuracy with units, tenses and prepositions of number | 12 |
|  | W2.3.4 | GP | Data-language sentence builders | 20 |
|  | W2.3.5 | RV | Language clinic: before-and-after rewrite | 10 |

**W3 — Academic Task 1 by visual type**

| Unit | ID | Type | Lesson | Min |
|---|---|---|---|---|
| W3.1 Line graphs and bar charts | W3.1.1 | VC | Line graphs: multiple lines, periods, projections | 13 |
|  | W3.1.2 | WE | Line graph walk-through (Band 7) | 15 |
|  | W3.1.3 | VC | Bar charts, static and dynamic | 12 |
|  | W3.1.4 | WE | Bar chart walk-through | 15 |
|  | W3.1.5 | GP | Line and bar practice 1-6 with checklist | 25 |
| W3.2 Pie charts, tables and mixed charts | W3.2.1 | VC | Pie charts: proportions and change over time | 11 |
|  | W3.2.2 | WE | Table walk-through: finding the story | 14 |
|  | W3.2.3 | VC | Mixed charts: combining two visuals coherently | 12 |
|  | W3.2.4 | WE | Mixed-chart walk-through | 15 |
|  | W3.2.5 | GP | Pie/table/mixed practice 1-6 | 25 |
| W3.3 Processes and maps | W3.3.1 | VC | Process diagrams: passive voice and sequence language | 14 |
|  | W3.3.2 | WE | Process walk-through (natural and man-made) | 15 |
|  | W3.3.3 | VC | Maps: change over time and location language | 13 |
|  | W3.3.4 | WE | Map walk-through | 14 |
|  | W3.3.5 | TP | Timed mixed Task 1 set x3 with AI feedback | 20 |

**W4 — Task 2 foundations**

| Unit | ID | Type | Lesson | Min |
|---|---|---|---|---|
| W4.1 Task analysis and ideas | W4.1.1 | VC | Task 2 requirements: reading the question, spotting the type | 13 |
|  | W4.1.2 | WE | Question analysis: eight questions, eight types | 15 |
|  | W4.1.3 | VC | Idea generation: the five-lens method | 14 |
|  | W4.1.4 | GP | Idea-generation sprints from the topic bank | 18 |
| W4.2 Structure | W4.2.1 | VC | Essay architecture: introduction, position, body, conclusion | 14 |
|  | W4.2.2 | WE | Writing a clear position statement | 13 |
|  | W4.2.3 | VC | Paragraph structure: topic sentence, explanation, example, link | 13 |
|  | W4.2.4 | WE | Developing an idea: from one sentence to five | 14 |
|  | W4.2.5 | GP | Paragraph-building drills | 20 |
| W4.3 Cohesion and coherence | W4.3.1 | VC | Cohesion that works: reference, substitution, logical connectors | 14 |
|  | W4.3.2 | VC | Over-using connectors: what examiners actually see | 11 |
|  | W4.3.3 | WE | Fixing a cohesive but incoherent paragraph | 13 |
|  | W4.3.4 | GP | Cohesion and paragraphing clinic | 18 |
|  | W4.3.5 | RV | Task 2 foundation self-check | 10 |

**W5 — Task 2 essay types**

| Unit | ID | Type | Lesson | Min |
|---|---|---|---|---|
| W5.1 Opinion and discussion essays | W5.1.1 | VC | Opinion (agree/disagree) essays: structure and position | 13 |
|  | W5.1.2 | WE | Opinion essay at Band 6, 7 and 8 | 18 |
|  | W5.1.3 | VC | Discussion essays (both views plus opinion) | 13 |
|  | W5.1.4 | WE | Discussion essay at Band 6, 7 and 8 | 18 |
|  | W5.1.5 | GP | Opinion/discussion timed practice with AI feedback | 40 |
| W5.2 Problem-solution and advantages-disadvantages | W5.2.1 | VC | Problem-solution: causes, effects, solutions | 12 |
|  | W5.2.2 | WE | Problem-solution model walk-through | 16 |
|  | W5.2.3 | VC | Advantages-disadvantages and 'outweigh' questions | 12 |
|  | W5.2.4 | WE | Advantages-disadvantages model walk-through | 16 |
|  | W5.2.5 | GP | Practice with AI feedback | 40 |
| W5.3 Two-part, hybrid and unusual questions | W5.3.1 | VC | Two-part questions: answering both parts fully | 12 |
|  | W5.3.2 | WE | Two-part and hybrid question walk-through | 16 |
|  | W5.3.3 | VC | Abstract topics: finding ideas when you know nothing | 12 |
|  | W5.3.4 | TP | Full Task 2 under exam conditions x3 (40 minutes) | 40 |
|  | W5.3.5 | RV | Task 2 self-review against band descriptors | 12 |

**W6 — Lexical resource and grammatical range for writing**

| Unit | ID | Type | Lesson | Min |
|---|---|---|---|---|
| W6.1 Lexical resource | W6.1.1 | VC | Lexical Resource: precision and collocation, not 'big words' | 13 |
|  | W6.1.2 | WE | Upgrading a paragraph without memorised phrases | 14 |
|  | W6.1.3 | GP | Collocation and paraphrase workshop | 20 |
|  | W6.1.4 | VC | Spelling and word formation: the top-50 writing errors | 11 |
| W6.2 Grammatical range and accuracy | W6.2.1 | VC | Complex sentences: relative, conditional, concessive, participial | 14 |
|  | W6.2.2 | WE | Sentence combining: simple to complex | 14 |
|  | W6.2.3 | GP | Accuracy clinic: articles, tense, agreement, prepositions, plurals | 25 |
|  | W6.2.4 | RV | Punctuation and sentence boundaries: comma splices and fragments | 11 |

**W7 — Editing, timing and feedback loops**

| Unit | ID | Type | Lesson | Min |
|---|---|---|---|---|
| W7.1 Editing | W7.1.1 | VC | Reading AI feedback: turning comments into rewrites | 12 |
|  | W7.1.2 | WE | Draft, feedback, rewrite: a worked cycle | 15 |
|  | W7.1.3 | GP | Personal error log and rewrite sprint | 20 |
|  | W7.1.4 | RV | Human feedback: how to read a grader report | 10 |
| W7.2 Exam-day writing | W7.2.1 | VC | Task management: 20/40, word count, last-two-minutes check | 10 |
|  | W7.2.2 | VC | Computer-delivered writing: typing, word-count display, timer | 9 |
|  | W7.2.3 | TP | Full Writing section (60 minutes) x2 in exam mode | 60 |
|  | W7.2.4 | RV | Writing section review: band trajectory | 12 |

**GT Task 1 (letters) module — GT and Writing Mastery.**

*1 module(s), 3 units, **13 lessons** (VC 5, WE 4, GP 2, TP 1, RV 1); video (VC+WE+RV) ≈ **2.1 h**; guided/timed practice in lessons ≈ 1.1 h.*


**W8 — General Training Task 1: letters**

| Unit | ID | Type | Lesson | Min |
|---|---|---|---|---|
| W8.1 Letter foundations | W8.1.1 | VC | GT Task 1 requirements: three bullet points, tone and purpose | 12 |
|  | W8.1.2 | WE | Formal, semi-formal, informal: the register ladder | 14 |
|  | W8.1.3 | VC | Openings, closings and sign-offs by register | 11 |
|  | W8.1.4 | GP | Register-switch drills | 18 |
| W8.2 Letter purposes | W8.2.1 | VC | Request and enquiry letters | 11 |
|  | W8.2.2 | WE | Complaint letters: firm but polite | 14 |
|  | W8.2.3 | VC | Explanation, apology and thanks letters | 11 |
|  | W8.2.4 | WE | Invitation, recommendation and arrangement letters | 13 |
|  | W8.2.5 | GP | Letter practice with AI feedback x6 | 25 |
| W8.3 Bullet coverage, tone and timing | W8.3.1 | VC | Covering every bullet with detail in 150-180 words | 12 |
|  | W8.3.2 | WE | Letter models at Band 6, 7 and 8 | 18 |
|  | W8.3.3 | TP | Timed letters x4 (20 minutes) | 20 |
|  | W8.3.4 | RV | Tone and register review | 10 |

**Writing Mastery extension (Band 7 to 8) — Writing Mastery only.**

*1 module(s), 2 units, **8 lessons** (VC 3, WE 2, GP 1, TP 1, RV 1); video (VC+WE+RV) ≈ **1.4 h**; guided/timed practice in lessons ≈ 1.0 h.*


**W9 — Writing Mastery extension: Band 7 to 8**

| Unit | ID | Type | Lesson | Min |
|---|---|---|---|---|
| W9.1 Precision and flexibility | W9.1.1 | VC | What Band 8 looks like in each criterion | 14 |
|  | W9.1.2 | WE | Band 7 to Band 8 rewrite sessions x3 | 20 |
|  | W9.1.3 | VC | Less-common vocabulary: accuracy first | 12 |
|  | W9.1.4 | GP | Style and concision workshop | 20 |
| W9.2 Under pressure | W9.2.1 | WE | Advanced Task 1: complex and multi-visual data | 16 |
|  | W9.2.2 | VC | Nuanced positions and counter-arguments | 13 |
|  | W9.2.3 | TP | Advanced Task 2 timed set x4 | 40 |
|  | W9.2.4 | RV | Personal last-mile plan | 10 |

#### 3.3.3 Practice: prompt bank and tasks

| Bank | Count | Notes |
|---|---|---|
| Academic Task 1 prompts | 42 | 6 per visual type × 7 types (line, bar, pie, table, mixed, process, map); original data and diagrams |
| GT Task 1 letter prompts | 24 | 3 registers × 4 purposes × 2 variants; three bullet points each |
| Task 2 prompts | 100 | 10 topic areas × 5 essay types × 2 (see 4.2 topic list); tagged by type and topic |
| Annotated model answers (6/7/8) | 189 | §6.2: 21 Task 1 prompts × 3 bands + 12 letters × 3 + 30 Task 2 prompts × 3 |
| Timed full Writing sections | 2 in W7, 4 mocks, more via Mock Series | 60-min exam-mode writing |
| Own-prompt mode | Unlimited (credit-limited) | Lower confidence flag (03 F-AIW-01) |

Task 2 essay types in the bank use these labels (also the registry's `essayType` tag): `opinion`, `discussion`, `problem_solution`, `advantages_disadvantages`, `two_part`.

#### 3.3.4 Strategies

**Academic Task 1 — what to teach**

| Skill | Rule taught | Common trap |
|---|---|---|
| Task analysis | Identify what is shown (units, time frame, categories). Paraphrase the prompt into the introduction in one sentence. | Copying the prompt; omitting units/time |
| **Overview** | One distinct paragraph (2 sentences) stating the 2–3 most salient features without figures. Position: after the introduction, or as a separate paragraph before the details | No overview; overview mixed with detail; opinion/reasons |
| Data selection | Report key features and make comparisons; do not list all figures | Listing every number; missing the highest/lowest |
| Grouping | Group by trend, by category or by time; each body paragraph has a logical focus | Mechanical "first line… second line…" |
| Trend / comparison language | Verb + adverb, adjective + noun, prepositions (rose *to/by/from… to*), proportions (twice as many, a fraction), approximate language | Wrong prepositions with numbers; inconsistent tense |
| Process | Passive voice, sequence markers, cycle vs linear; stages not steps copied | Present perfect misuse; no overview |
| Map | Past/present/future comparison; location language; before/after | Describing each map separately only |
| Accuracy | Check units, tense, "the number of / the amount of", "the proportion of" | Misreading units; percentages vs actual figures |
| Length | 160–190 words in 20 min; underlength is penalised **(verify)** | 120 words; 260 words wasting time |
| Do not | Speculate on reasons, add personal opinion | |

**GT Task 1 — letters**

| Skill | Rule |
|---|---|
| Register | Formal ("Dear Sir or Madam…Yours faithfully"), semi-formal (name known: "Dear Ms Rahman…Yours sincerely"), informal ("Dear Sam… Best wishes"); tone must match the recipient and purpose |
| Purpose statement | State why you are writing in the first sentence |
| Bullets | Cover all three bullet points with a developed detail each (2–3 sentences) |
| Length/time | 160–190 words, 20 minutes |
| Language | Functional phrases (request, complain, apologise, invite) *taught as functions with variation*, not fixed sentences |
| Do not | Invent unnecessary stories; mix registers; write an address block if not needed |

**Task 2 — essay types and paragraph structures** (suggested word counts for a 260–290 word response in ~40 min)

| Type | Typical prompt | Introduction (35–45 w) | Body 1 (90–100 w) | Body 2 (90–100 w) | Conclusion (25–35 w) | Typical trap |
|---|---|---|---|---|---|---|
| **Opinion** (agree/disagree, to what extent) | "To what extent do you agree…" | Paraphrase + clear position | Main reason 1 + explanation + example | Main reason 2 (or concession + rebuttal) + explanation + example | Restate position + summary | Position changes mid-essay |
| **Discussion** (discuss both views, give your opinion) | "Discuss both views and give your opinion" | Paraphrase + outline of both views | View A + explanation + example | View B + explanation + example; **opinion stated** (intro/body/conclusion consistently) | Position + summary | No clear opinion |
| **Problem–solution** | "What problems… What solutions…" | Context + outline | Problems/causes (2) developed | Solutions that clearly link to the problems | Summary | Solutions not tied to problems |
| **Advantages–disadvantages** (incl. "outweigh") | "Do the advantages outweigh the disadvantages?" | Paraphrase + (for "outweigh") position | Advantages (1–2 developed) | Disadvantages (1–2 developed) | Weighted judgement | Equal list without judgement |
| **Two-part** | Two direct questions | Paraphrase + brief answer to each | Answer Q1 fully | Answer Q2 fully | Short synthesis (optional) | Answering only one part |
| *Hybrid/unusual* | Mixed forms | Identify the verbs in the prompt (discuss / evaluate / suggest) | Per part | Per part | | Writing a prepared essay on a similar topic |

**Cohesion and coherence:** clear central topic per paragraph; logical progression; referencing and substitution (this/these, such, the former); varied linking *with meaning*; paragraph breaks; avoid mechanical *Firstly/Secondly/Moreover* chains; connectors only where the logic needs them.

**Lexical resource:** topic-appropriate vocabulary, collocations, word-form control, paraphrase of the question; **precision over difficulty**; never insert idioms or "rare words" you cannot use accurately; spell accurately (tracked).

**Grammatical range and accuracy:** variety of sentence structures; accuracy is rewarded as much as range; focus on Bangla-speaker error clusters (articles, tense, agreement, prepositions, plurals; §1.6); punctuation and sentence boundaries.

**Word count:** tasks should reach at least the minimum (150/250, verify); aim ~170–190 for T1 and 260–300 for T2; the computer shows a live count in the exam shell (07 §6.5); do not pad.

#### 3.3.5 The memorised-template policy (applies to videos, model answers, AI feedback and live teaching)

Examiners are trained to penalise memorised or rehearsed language and template-based responses (the 2025–26 reports of a Task Response cap for template-based essays are secondary-sourced **(verify)**). Lumen therefore:

1. Teaches **moves and functions** (position, concession, exemplification), not fixed sentences to memorise.
2. Labels every model answer paragraph as *transferable move* or *topic-specific language*.
3. Provides at least **two structurally different** models per essay type and band to prevent single-template copying.
4. Runs the **template-similarity check** in the AI pipeline: n-gram overlap with a maintained corpus of known templates and the course's own models; flagged text is reported with an explicit warning ("This paragraph is very close to common templates; examiners may penalise it") and the Task Response estimate is capped for the report (rules in 07 §7.4.4).
5. Never provides "fill-in-the-blank essay" sheets, "magic phrase" lists or "guaranteed Band 7 template" materials in any tier or marketing.
6. Teaches paraphrasing the prompt without copying it (copied phrases do not count to the word count in the official marking convention **(verify)**).

#### 3.3.6 Common mistakes

| Tag | Mistake | Remedy |
|---|---|---|
| `no_overview` | T1 without overview | W2.1; overview clinic |
| `data_dump` | Listing all numbers | W2.2 |
| `wrong_tense_t1` | Tense inconsistent with time frame | W2.3.3 |
| `off_topic` / `partial_answer` | Not answering all parts | W4.1, W5.3 |
| `position_shift` | Contradictory stance | W4.2.2 |
| `memorised_template` | Template similarity | §3.3.5 |
| `connector_overuse` | Mechanical linking | W4.3.2 |
| `underdeveloped` | Idea without explanation/example | W4.2.4 |
| `article_error` / `agreement_error` / `preposition_error` / `plural_error` / `tense_error` | Bangla-speaker error clusters | G strand; W6.2 |
| `spelling` | Frequent spelling errors | W6.1.4; spelling deck |
| `underlength` | < minimum words | Pace drills |
| `register_mismatch` | GT letter tone error | W8.1 |

#### 3.3.7 Assessments and feedback touchpoints

| Level | What | Rule |
|---|---|---|
| Unit self-check | Checklist against criteria | Must be submitted to complete the unit |
| Module checkpoint | One timed task | AI evaluated |
| Capstone | 4 timed submissions with trend report (Writing Mastery M-capstone via W7/W9) | Compared to baseline |
| Full Writing section | 60 min × (2 in W7, + mocks) | Overall estimate |

| Touchpoint | AI (07 §7) | Human (grader, D4) |
|---|---|---|
| Per-criterion estimate + inline comments + one rewrite task | Every submission (credit-based) | — |
| Paragraph-level rewriting help (`coach_action` fair-use meter, never a fractional credit; D12 C27, 03 F-AIW-07) | On request; disabled in exam-mode review | — |
| Human essay review | — | Plus: 2; Live: 4; Crash: 2; Mentor: 6 (17 §2.2); 72 h SLA (24 h with the priority-grading add-on) |
| Human mock marking (full Writing section) | — | Live/Mentor |
| Calibration | AI vs human difference tracked per learner; shown as confidence | Grader override with rationale |

---

### 3.4 Speaking

**Goal.** Hold an 11–14 minute recorded or face-to-face interview in three parts, speaking fluently and coherently, with a flexible, precise vocabulary, a range of accurate grammar, and intelligible pronunciation. Four equally weighted criteria: Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, Pronunciation. The test is identical in Academic and GT.

#### 3.4.1 Learning objectives by band level

| Band zone | ID | Measurable objective (evidence = AI/human interview ratings + recorded metrics: speech rate, pause map, answer length) |
|---|---|---|
| **→ 5.0** | LO-S-5-1 | Part 1: answer ≥ 80% of questions with ≥ 2 sentences (answer + reason) |
| | LO-S-5-2 | Part 2: speak ≥ 1 min 15 s on a cue card with ≤ 4 long pauses (> 3 s) |
| | LO-S-5-3 | Pronunciation: ≥ 85% of target minimal pairs ( /v/-/w/, /z/-/dʒ/ ) distinguishable by listeners/AI in drills |
| **→ 6.0** | LO-S-6-1 | Part 1 answers average 2–3 sentences with a reason or example in ≥ 80% of answers |
| | LO-S-6-2 | Part 2: reach ≥ 1 min 45 s, covering all cue-card bullets, with a clear beginning, middle, end |
| | LO-S-6-3 | Part 3: give opinion + reason + example in ≥ 60% of answers |
| | LO-S-6-4 | Speech rate in the 110–160 words per minute range, self-corrections ≤ 3 per minute (estimate; AI metric) |
| | LO-S-6-5 | Estimated ≥ 6.0 on each criterion in two consecutive AI mock interviews |
| **→ 6.5** | LO-S-65-1 | Part 3: comparisons, speculation and evaluation in ≥ 70% of answers; use of ≥ 5 topic collocations per part |
| | LO-S-65-2 | Part 2: use of ≥ 2 tenses accurately (e.g. past narrative + present reflection) |
| | LO-S-65-3 | Estimated 6.5 overall with at least one human interview mock |
| **→ 7.0** | LO-S-7-1 | Speaks at length without noticeable effort; hesitation mostly content-related; ≥ 70% error-free clauses |
| | LO-S-7-2 | Uses a range of connectors and discourse markers with natural variation (no mechanical repetition) |
| | LO-S-7-3 | Pronunciation: stress and intonation used to convey meaning; L1 features do not impede understanding; ≥ 7.0 twice (one human) |
| **→ 8.0+** | LO-S-8-1 | Fluent with only occasional repetition or self-correction; precise, flexible vocabulary including natural idiom (used accurately) |
| | LO-S-8-2 | Human mock estimates ≥ 8.0 twice; pronunciation: easy to understand throughout |

#### 3.4.2 Syllabus: modules, units, lessons

**Core Speaking syllabus (Academic, GT, Speaking Mastery use S1–S7).**

*7 module(s), 16 units, **69 lessons** (VC 30, WE 14, GP 14, TP 4, RV 7); video (VC+WE+RV) ≈ **10.3 h**; guided/timed practice in lessons ≈ 5.5 h.*


**S1 — Format and criteria**

| Unit | ID | Type | Lesson | Min |
|---|---|---|---|---|
| S1.1 Know the test | S1.1.1 | VC | How Speaking works: 3 parts, 11-14 minutes, one examiner | 10 |
|  | S1.1.2 | VC | The four criteria: fluency, lexis, grammar, pronunciation | 14 |
|  | S1.1.3 | WE | Band 5, 6, 7 and 8 answers compared | 18 |
|  | S1.1.4 | GP | Record your baseline (AI feedback) | 15 |
|  | S1.1.5 | VC | Myths: accent, big words, memorised answers, invented stories | 10 |

**S2 — Part 1: the interview**

| Unit | ID | Type | Lesson | Min |
|---|---|---|---|---|
| S2.1 Answer structure | S2.1.1 | VC | Part 1 profile: topics, questions, timing | 9 |
|  | S2.1.2 | VC | Answer, reason, example: the three-sentence builder | 12 |
|  | S2.1.3 | WE | From short to developed: Band 5 to Band 7 answers | 14 |
|  | S2.1.4 | GP | Part 1 extension drills (home, work/study, hometown) | 18 |
| S2.2 Question forms and tenses | S2.2.1 | VC | Question forms: present, past, future, preference, frequency | 11 |
|  | S2.2.2 | WE | Tenses in Part 1: staying accurate while fluent | 13 |
|  | S2.2.3 | GP | Part 1 topic labs 1-6 with AI feedback | 25 |
| S2.3 Natural delivery | S2.3.1 | VC | Fillers that help and fillers that hurt | 10 |
|  | S2.3.2 | VC | Sounding natural: opinion, hedging, honest uncertainty | 11 |
|  | S2.3.3 | WE | When you don't know: rephrase, buy time, recover | 12 |
|  | S2.3.4 | GP | Part 1 mock interview (4 minutes) | 15 |
|  | S2.3.5 | RV | Part 1 review: transcript and pause map | 10 |

**S3 — Part 2: the long turn**

| Unit | ID | Type | Lesson | Min |
|---|---|---|---|---|
| S3.1 Cue-card planning | S3.1.1 | VC | Part 2 profile: cue card, 1 minute prep, 1-2 minute talk | 10 |
|  | S3.1.2 | VC | One-minute planning: keywords, not sentences | 13 |
|  | S3.1.3 | WE | Planning live: four cue cards, four plans | 16 |
|  | S3.1.4 | GP | Planning sprints (60 seconds, 20 cards) | 15 |
| S3.2 Storytelling | S3.2.1 | VC | Narrative structure: setting, event, feeling, reflection | 13 |
|  | S3.2.2 | WE | Describing a person, place, object or event: model talks | 16 |
|  | S3.2.3 | VC | Past, present and future in one talk: tense control | 12 |
|  | S3.2.4 | GP | Part 2 talks 1-10 (record and AI feedback) | 30 |
| S3.3 Keep going | S3.3.1 | VC | Filling two minutes: expansion tools and when to stop | 11 |
|  | S3.3.2 | WE | Recovering from a blank | 12 |
|  | S3.3.3 | GP | Rounding-off follow-up questions | 10 |
|  | S3.3.4 | TP | Timed Part 2 x3 (1 + 2 minutes) | 15 |
|  | S3.3.5 | RV | Part 2 review: coverage, pace, vocabulary | 10 |

**S4 — Part 3: the discussion**

| Unit | ID | Type | Lesson | Min |
|---|---|---|---|---|
| S4.1 Abstract reasoning | S4.1.1 | VC | Part 3 profile: abstract questions and how to extend | 10 |
|  | S4.1.2 | VC | Opinion, reason, example, other view: the ladder | 13 |
|  | S4.1.3 | WE | Answering 'why do you think...' with depth | 14 |
|  | S4.1.4 | GP | Part 3 reasoning drills | 20 |
| S4.2 Language functions | S4.2.1 | VC | Comparing past and present, young and old, countries | 12 |
|  | S4.2.2 | VC | Speculating and predicting: modals and conditionals | 12 |
|  | S4.2.3 | WE | Evaluating solutions, causes and effects aloud | 14 |
|  | S4.2.4 | GP | Part 3 function labs 1-6 with AI feedback | 25 |
| S4.3 Conversation skills | S4.3.1 | VC | Handling difficult or sensitive questions | 10 |
|  | S4.3.2 | VC | Clarifying and paraphrasing the examiner's question | 10 |
|  | S4.3.3 | TP | Timed Part 3 x3 (4-5 minutes) | 15 |
|  | S4.3.4 | RV | Part 3 review | 10 |

**S5 — Pronunciation for Bangla speakers**

| Unit | ID | Type | Lesson | Min |
|---|---|---|---|---|
| S5.1 Sounds that cost marks | S5.1.1 | VC | The pronunciation criterion: intelligibility, not accent | 12 |
|  | S5.1.2 | VC | /v/ versus /w/ versus /b/: minimal pairs and mouth position | 12 |
|  | S5.1.3 | VC | /z/ versus /dʒ/, and /s/ versus /ʃ/ | 12 |
|  | S5.1.4 | VC | /θ/, /ð/ and /f/ versus /pʰ/ | 12 |
|  | S5.1.5 | GP | Minimal-pair recording drills with AI pronunciation flags | 20 |
| S5.2 Word stress and rhythm | S5.2.1 | VC | Word stress: noun/verb pairs, suffix shifts, compounds | 14 |
|  | S5.2.2 | WE | Stress-timed English versus syllable-timed Bangla rhythm | 13 |
|  | S5.2.3 | GP | Stress marking and shadowing drills | 20 |
|  | S5.2.4 | VC | Initial clusters (st-, sp-, sk-) and final consonants | 11 |
| S5.3 Sentence level | S5.3.1 | VC | Chunking and pausing: thought groups | 12 |
|  | S5.3.2 | VC | Intonation: falling, rising, emphasis | 13 |
|  | S5.3.3 | WE | Connected speech: linking, weak forms, elision | 14 |
|  | S5.3.4 | GP | Shadowing an examiner-style interview | 20 |
|  | S5.3.5 | RV | Pronunciation self-check and progress map | 10 |

**S6 — Fluency, vocabulary and grammar for speaking**

| Unit | ID | Type | Lesson | Min |
|---|---|---|---|---|
| S6.1 Fluency | S6.1.1 | VC | Fluency without rushing: rate, pausing, self-repair | 12 |
|  | S6.1.2 | WE | Fluency drills: 4-3-2 technique and timed retelling | 14 |
|  | S6.1.3 | GP | Daily five-minute fluency routine (record) | 15 |
|  | S6.1.4 | RV | Fluency map from your own recording | 10 |
| S6.2 Vocabulary and grammar in speech | S6.2.1 | VC | Topic vocabulary for speaking: collocations over idioms | 12 |
|  | S6.2.2 | WE | Idioms: using them naturally or leaving them out | 11 |
|  | S6.2.3 | VC | Grammar in speech: tenses, conditionals, relative clauses | 13 |
|  | S6.2.4 | GP | Accuracy clinic: articles, agreement, prepositions in speech | 20 |

**S7 — Mock interviews and review**

| Unit | ID | Type | Lesson | Min |
|---|---|---|---|---|
| S7.1 Full interviews | S7.1.1 | WE | Examiner-style full mock walk-through (annotated) | 20 |
|  | S7.1.2 | TP | Full AI Speaking mock 1 | 15 |
|  | S7.1.3 | RV | Mock 1 review and action plan | 12 |
|  | S7.1.4 | TP | Full AI Speaking mock 2 | 15 |
|  | S7.1.5 | RV | Test-day speaking: in-person or video call, ID, nerves | 10 |

**Speaking Mastery extension (Band 7 to 8) — Speaking Mastery only.**

*1 module(s), 3 units, **10 lessons** (VC 3, WE 2, GP 2, TP 2, RV 1); video (VC+WE+RV) ≈ **1.3 h**; guided/timed practice in lessons ≈ 1.3 h.*


**S8 — Speaking Mastery extension: Band 7 to 8**

| Unit | ID | Type | Lesson | Min |
|---|---|---|---|---|
| S8.1 Precision and nuance | S8.1.1 | VC | What Band 8 sounds like | 12 |
|  | S8.1.2 | WE | Band 7 versus Band 8 answers in Part 2 | 16 |
|  | S8.1.3 | VC | Precision, nuance and natural idiom | 12 |
|  | S8.1.4 | GP | Lexical upgrade labs | 20 |
| S8.2 Prosody and shadowing | S8.2.1 | VC | Prosody: rhythm, pitch range, emphasis | 13 |
|  | S8.2.2 | GP | Shadowing 12 interview recordings | 30 |
|  | S8.2.3 | WE | Part 3 at Band 8: depth and concision | 15 |
| S8.3 Under pressure | S8.3.1 | TP | Full AI Speaking mock 3 | 15 |
|  | S8.3.2 | TP | Full AI Speaking mock 4 | 15 |
|  | S8.3.3 | RV | Final speaking action plan | 10 |

#### 3.4.3 Practice bank

| Bank | Count | Notes |
|---|---|---|
| Part 1 topics | 120 (each 6–8 questions, ≈ 800 questions) | Familiar topics: home, work/study, hometown, daily routine, food, transport, weather, shopping, hobbies, family, technology, etc.; the tag `frame` marks who/what/why/when forms |
| Cue cards (Part 2) | **180** | §6.5: 12 categories × 15; each with 3–4 bullet prompts and a "round-off" question |
| Part 3 question sets | 180 | One set of 4–6 abstract questions per cue card (linked), plus 20 standalone sets |
| Full AI mock interviews | 20 scripted mocks (Part 1 topic + card + Part 3 set) | 1 credit per part, 2 per full test (03 F-AIS-02) |
| Pronunciation drills | 160 minimal pairs, 60 stress drills, 40 shadowing clips | Recorded with AI flags (word-level timing from Deepgram, D3) |
| Chunking / fluency drills | 60 | 4-3-2 retell, speed rounds |

Recording and playback pipeline, silent-audio rules and AI limits are specified in 03 §3.7 and 07 §7; the curriculum rule is that a response < 20 s of speech in Part 2 is not scored for fluency (03 AC-AIS-04).

#### 3.4.4 Strategies

**Per part**

| Part | Time | Task | Core strategies | Traps |
|---|---|---|---|---|
| **1** | ~4–5 min | Familiar topics, short questions | Answer + reason + example (3 sentences); vary openings; use the question's tense; extend naturally; give personal, true answers | One-word answers; memorised paragraphs; going off-topic; invented stories that sound rehearsed |
| **2** | 1 min prep + 1–2 min talk (+ round-off) | Cue card monologue | *One-minute planning:* write 5–7 keywords (not sentences) in the order of bullets; choose a story you can tell with feeling; structure: setting – event – feelings – reflection/evaluation; use the last bullet (why/explain) as your closing | Stopping early (< 1 min); memorised topic stories; wasting prep on full sentences |
| **3** | ~4–5 min | Abstract discussion | Opinion – reason – example – other view ladder; comparison (then/now, young/old, countries), speculation ("would probably…"), evaluation ("on balance…") | Short personal answers; repeating Part 2; not buying time |

**Fluency techniques taught:** thought-group chunking; pausing at boundaries; speaking in sense groups; fillers that help ("let me think", "that's an interesting question") vs hurt ("uh… uh…"); rephrasing when stuck; self-repair that keeps rhythm; the 4-3-2 retelling drill; timed shadowing; daily 5-minute recorded routine; speaking rate target of 120–150 wpm for natural delivery (estimate).

**Extending answers (Part 1/3):** *Answer + Reason (because) + Example (for instance) + Contrast (although/whereas) + Result (so)*. A diagnostic metric tracks the share of answers with ≥ 2 extension moves.

**Pronunciation features** (S5): chunking and pausing; word stress (including noun/verb stress pairs and suffix shifts); sentence stress on content words; intonation (fall for statements, rise for lists/uncertainty); connected speech (linking, weak forms: *to, of, and, can*, elision); individual sounds that cause misunderstandings (/v/-/w/-/b/, /z/-/dʒ/, /θ/-/ð/-/f/, /s/-/ʃ/, clusters). Priority order: stress and chunking before individual sounds, then sounds that affect meaning.

**Cue-card planning protocol (taught and rehearsed 40+ times):** 0–10 s read card and choose story; 10–45 s write keywords per bullet; 45–60 s plan opening sentence and closing; talk. Practised with a hidden 60-second timer.

**Part 3 abstract-reasoning toolkit:** definitions → causes → effects → comparison → future → solution; opinion starters; softening ("In my view", "To some extent"); handling "I've never thought about it" with a recovery frame; clarifying the question.

**Memorisation policy:** Speaking training promotes *flexible phrasing*, not memorised monologues. Examiners are trained to detect rehearsed material; our AI flags near-verbatim reuse across attempts (low lexical variance, identical sentences across different prompts) and tells the learner.

#### 3.4.5 Common mistakes

| Tag | Mistake | Remedy |
|---|---|---|
| `short_answer` | Part 1 answers of 1–5 words | S2.1 |
| `rehearsed` | Same memorised sentences across topics | S1.1.5, memorisation policy |
| `long_pause` | Frequent > 3 s pauses | S6.1, chunk drills |
| `filler_overuse` | "Uh/um/like" overuse | S2.3 |
| `part2_short` | < 1 min | S3.3 |
| `tense_slip` | Past story in present | S3.2.3 |
| `vocab_repetition` | "very good/very bad" | S6.2, topic decks |
| `sound_vw` / `sound_zj` / `sound_th` / `stress_error` / `flat_intonation` | Pronunciation clusters | S5 |
| `topic_dodge` | Not answering the question | S4.3 |
| `silence_anxiety` | Freezing | S3.3.2 |

#### 3.4.6 Assessments and feedback touchpoints

| Level | What | Rule |
|---|---|---|
| Unit check | 1 recorded answer + AI feedback or self-assessment checklist | Required to complete unit |
| Module checkpoint | Part-specific timed recording | AI scored |
| Full mocks | S7 mocks 1–2 (full course, Core and above), 3–4 (Mastery) + all mock series | Band estimate per criterion with confidence |
| Human interview mock | Live/Mentor | 15-minute examiner-style interview by a trained rater |

| Touchpoint | AI | Human |
|---|---|---|
| Transcript + per-criterion estimate + pause map + pronunciation flags | Every recording | — |
| Targeted re-record task | Always one | — |
| Examiner-style speaking mock | — | Add-on (`human-speaking-mock-1/3`), Live (2 mocks), Crash (1), Mentor (3) |
| Small-group speaking club (45 min, ≤ 6 learners) | — | Live 6 slots, Crash 3, Mentor 6; Plus by pay-per-slot add-on |

---

## 4. Foundation strands running in parallel

Three strands run beside the four skills. In each full course (Core and above) they are delivered as short lessons (Grammar 36, Vocabulary 18 lessons) plus daily practice, spaced decks and "Bangla bridge" notes.

### 4.1 Grammar for IELTS (sequenced)

Sequence is by *error cost* in the IELTS criteria (Bangla-speaker error clusters first), then by structural range needed for Band 6.5+. Each topic = 1 VC lesson (≈ 11 min) + 1 mini-set (10–15 items) + spaced error cards. The sequence is also used by the planner to decide which G-lessons to schedule per week.

| Zone | ID | Topic | Mapped skills | Bangla bridge |
|---|---|---|---|---|
| Foundation (to ≈ 5.0) | G1 | Sentence patterns and word order (SVO vs Bangla SOV) | W S | #7 |
| Foundation (to ≈ 5.0) | G2 | Be, have, do and the missing copula | W S | #2 |
| Foundation (to ≈ 5.0) | G3 | Present simple and continuous | S W | — |
| Foundation (to ≈ 5.0) | G4 | Past simple and continuous | S W | — |
| Foundation (to ≈ 5.0) | G5 | Present perfect versus past simple | W S | #3 |
| Foundation (to ≈ 5.0) | G6 | Future forms | S W | — |
| Foundation (to ≈ 5.0) | G7 | Nouns: countable, uncountable, plurals | W L | #6 |
| Foundation (to ≈ 5.0) | G8 | Articles: a, an, the, zero | W | #1 |
| Foundation (to ≈ 5.0) | G9 | Determiners and quantifiers | W | — |
| Foundation (to ≈ 5.0) | G10 | Pronouns, gender and reference | W S | #8 |
| Foundation (to ≈ 5.0) | G11 | Adjectives, adverbs and order | W S | — |
| Foundation (to ≈ 5.0) | G12 | Comparatives and superlatives | W T1 | #11 |
| Foundation (to ≈ 5.0) | G13 | Prepositions of time, place and movement | W T1 | #5 |
| Foundation (to ≈ 5.0) | G14 | Dependent prepositions and prepositional collocations | W S R | #5 |
| Foundation (to ≈ 5.0) | G15 | Modal verbs: ability, obligation, possibility | W S | — |
| Foundation (to ≈ 5.0) | G16 | Question forms and do-support | S | #7 |
| Foundation (to ≈ 5.0) | G17 | Negatives and short answers | S | — |
| Foundation (to ≈ 5.0) | G18 | Subject-verb agreement | W S | #4 |
| Core (≈ 5.0 to 6.5) | G19 | Coordination, subordination and linking | W | — |
| Core (≈ 5.0 to 6.5) | G20 | Relative clauses (defining and non-defining) | W S | #9 |
| Core (≈ 5.0 to 6.5) | G21 | Conditionals 0, 1 and 2 | W S | — |
| Core (≈ 5.0 to 6.5) | G22 | Passive voice | W T1 | — |
| Core (≈ 5.0 to 6.5) | G23 | Reported speech and backshift | S R | #10 |
| Core (≈ 5.0 to 6.5) | G24 | Gerunds and infinitives | W S | — |
| Core (≈ 5.0 to 6.5) | G25 | Past perfect and narrative tenses | S | — |
| Core (≈ 5.0 to 6.5) | G26 | Perfect continuous and time expressions (for/since/ago) | W T1 | #3 |
| Core (≈ 5.0 to 6.5) | G27 | Comparison structures (the more..the more, as..as) | W | — |
| Core (≈ 5.0 to 6.5) | G28 | Punctuation: comma splices, run-ons, fragments | W | — |
| Core (≈ 5.0 to 6.5) | G29 | Linking adverbials and discourse markers | W S | — |
| Core (≈ 5.0 to 6.5) | G30 | Wishes, preferences and unreal past | S | — |
| Advanced (≈ 6.5 to 8) | G31 | Conditionals 3, mixed and inversion | W S | — |
| Advanced (≈ 6.5 to 8) | G32 | Participle clauses and reduced relatives | W | — |
| Advanced (≈ 6.5 to 8) | G33 | Cleft sentences and emphasis | W S | — |
| Advanced (≈ 6.5 to 8) | G34 | Nominalisation and academic style | W | — |
| Advanced (≈ 6.5 to 8) | G35 | Hedging, modality and stance | W S | — |
| Advanced (≈ 6.5 to 8) | G36 | Concession and contrast with fronting | W | — |

Grammar lessons are placed in time: Foundation-level G1–G18 in weeks 1–6 of a 12-week plan, G19–G30 in weeks 4–10, G31–G36 in weeks 8–12 (or the Advanced path). Mini-set mastery is checked through the spaced error deck, not only through quizzes.

### 4.2 Vocabulary

**Topic lexis.** 16 topic decks. The 10 exam-priority topics are marked ★.

| # | Deck (topic) | Typical IELTS contexts | Items |
|---|---|---|---|
| 1 | ★ Education | Task 2: university vs vocational, online learning; Speaking: school, study | 75 |
| 2 | ★ Environment | Task 2: climate, pollution, recycling; R passages | 75 |
| 3 | ★ Technology | Task 2: AI, social media, automation; Part 3 | 75 |
| 4 | ★ Health and medicine | Task 2: public health, diet, ageing; R/L Part 4 | 75 |
| 5 | ★ Work and careers | Task 2: remote work, unemployment; GT letters | 75 |
| 6 | ★ Urbanisation and housing | Task 1 maps; Task 2: city growth, transport | 75 |
| 7 | ★ Globalisation and migration | Task 2: cultural identity, brain drain | 75 |
| 8 | ★ Crime and law | Task 2: punishment vs prevention | 75 |
| 9 | ★ Media and advertising | Task 2: news, advertising, celebrity | 75 |
| 10 | ★ Family and relationships | Part 1/2/3 family topics; Task 2 child-rearing | 75 |
| 11 | Travel and tourism | Task 2: tourism impact; GT letters | 75 |
| 12 | Culture and heritage | Part 2 cards; Task 2: preservation | 75 |
| 13 | Science and research | Academic passages; Part 4 lectures | 75 |
| 14 | Government and society | Task 2: public spending, laws | 75 |
| 15 | Money and economy | Task 1 tables; Task 2: wealth, economy | 75 |
| 16 | Sport and leisure | Part 1/2; Task 2: sport and health | 75 |

**Deck specification (SRS = spaced repetition, scheduled by FSRS per D12 C26; 03 §3.8, 34 §3).**

| Deck family | Decks | Items per deck | Total items | Notes |
|---|---|---|---|---|
| Topic decks (16 topics) | 16 | 75 (≈ 50 words + 25 collocations/phrases) | 1,200 | Each item: word, meaning (EN + BN for BD edition), collocation, example sentence, audio |
| Academic Word List (Coxhead, 570 word families) | 10 (sublists 1–10) | 30–60 | 570 families (≈ 600 cards) | Word-family cards (verb/noun/adj/adv forms); AWL is a published list **(verify licence/usage)** |
| Collocation decks | 12 | 50 | 600 | verb+noun, adjective+noun, adverb+adjective, prepositional, delexical verbs (make/do/take/have) |
| Speaking phrase bank | 4 | 125 | 500 | Part 1 starters, hedges, extension phrases, Part 3 functional language |
| Writing function bank | 5 | 70–150 | 470 | Trend/process/map language (120), cohesive devices (80), letter functions by register (150), concession/contrast structures (60), hedging (60) |
| Phrasal verbs (high-frequency) | 3 | 50 | 150 | |
| Commonly confused words | 2 | 50 | 100 | affect/effect, principal/principle… |
| Spelling traps (listening/writing) | 3 | 50 | 150 | Names, numbers, silent letters, double consonants |
| "Spot the error" deck `ERR-BN` (Bangla-speaker errors) | 4 | 50 | 200 | Articles, agreement, prepositions, plurals/tenses |
| **Total** | **59** | | **≈ 3,940** | |

**Rules of use:** the learner's tier controls decks (Free: 3 topic decks + 1 AWL sublist; Core and above: all). New-card cap 15/day, review cap 80/day; "learned" = interval ≥ 21 days. Items are surfaced in lessons and practice via the `vocab_ref` tag so exposure is contextual. Recommended exposure: topic decks 1–3 weeks each; Education, Work, Environment, Technology, Health first (highest Task 2 coverage).

**Vocabulary strand lessons (V1–V18).** 16 topic lessons (one per deck, ≈ 12 min: how to learn the deck, ranked collocations, model sentences, usage warnings) plus V17 (AWL word families) and V18 (collocations).

### 4.3 Pronunciation

| Strand | Where | Content |
|---|---|---|
| Core course | S5 (14 lessons) | Intelligibility principle; /v/-/w/-/b/; /z/-/dʒ/, /s/-/ʃ/; /θ/-/ð/-/f/; word stress; rhythm; clusters; chunking; intonation; connected speech |
| Daily drills | `/app/practice` pronunciation lane | 5 minutes: 10 minimal pairs + 1 shadowing clip; AI flags |
| Spoken English / Foundation | F-modules | Phonics-to-sound mapping, syllables, stress, basic intonation |
| Listening link | L1.3, L6.1 | Same sounds trained as perception: letter names, accents |
| Optional P2 | Azure Pronunciation Assessment (D3) | Phoneme-level scoring for the 12 target sound contrasts |

---

## 5. Tier-by-tier material map and outcome promises

D10 fixes what each tier always includes and never includes. This section turns that into **exactly which lessons, sets, mocks, feedback, live sessions and downloadables** each tier unlocks in the exam courses (IELTS Academic and GT; the other courses follow in §9). Quantities are curriculum recommendations; **`17-PRICING-MASTER.md` is canonical for credit counts, validity periods and prices**, `18-LIVE-CLASSES.md` for session operations. Any difference is resolved in favour of 17/18.

Principle: **content is not withheld to create tiers.** Core already contains the entire recorded curriculum and practice bank. Higher tiers add mocks, feedback, structure and people.

### 5.1 Summary of what each tier adds

Allowances are 17 §2.2 (IELTS Academic and GT template; `ai_credit` = one pool, D12 C1: Writing task = 1 credit, one Speaking part = 1, full Speaking test = 2). Mock-embedded Writing/Speaking AI scoring does not draw credits.

| Capability | Free | Core | Plus | Live (12-wk) | Live Crash (4-wk) | Mentor |
|---|---|---|---|---|---|---|
| Recorded lessons | 12 samples | All | All | All + recordings of live sessions (batch end + 30 days) | All | All + recordings |
| Practice bank | 1 set per sample lesson | Full bank | Full bank | Full bank | Full bank | Full bank |
| Full mocks (exam mode, D6) | 0 (diagnostic + 1 sectional) | **4** | **10** (5 at launch, 10 by 2027-08-15) | 10 (4 as live-proctored cohort mocks) | 10 | 10 |
| `ai_credit` pool | 2 at sign-up + 1 per month (no rollover) | **10** | **40** (max 6 evaluations/day) | 40 | 40 | 40 |
| Human Writing reviews (72 h SLA) | — | — | **2** | **4** | **2** | **6** |
| Human Speaking mocks (12 min + 8 min feedback) | — | — | — | **2** | **1** | **3** |
| Live | — | — | Weekly group Q&A on Zoom (60 min, recorded) from P1 (D12 C20) | **36 sessions × 90 min** over 12 weeks (or 24 × 150 min weekend), 6 speaking-club slots | **16 × 90 min** over 4 weeks, 3 club slots | Live + 6 club slots |
| 1:1 sessions with a named mentor | — | — | — | — | — | **3 × 45 min** (more via add-on packs) |
| Study plan | Placement result | Generated, read-only (P1, D12 C5) | + adaptive rescheduling (P2) | Plan + teacher/attendance tracking | Same | Plan + mentor-adjusted weekly |
| Certificate | — | Yes (completion rule §8.5) | Yes | Yes | Yes | Yes |
| Access | Always | **183 days** | **183 days** | 365 days | 365 days | 365 days |
| Money-back / promise | — | 7-day no-questions money-back (D12 C13b) | 7-day money-back + **Target Promise** (free 3-month extension, no cash) | Full refund before class 3 | Before class 2 | **Progress Promise** (free re-enrolment, no cash) (§5.8) |

### 5.2 Listening

| Asset | Free | Core | Plus | Live | Mentor |
|---|---|---|---|---|---|
| Lessons | L1.1.1, L1.2.1, L2.1.2 | All 72 (L1–L6) | All | All | All |
| Practice sets | Form completion set 1, map set 1, MCQ set 1 | Full bank (§3.1.3); accent ladder; dictation drills | Same + personalised "weak-tag" sets | Same | Same |
| Sectional tests | 1 sectional (Listening *or* Reading, learner chooses) | A–D | A–D | A–D | A–D |
| Full mocks | — | Mocks 1–4 | Mocks 1–10 | Mocks 1–10 | Mocks 1–10 |
| AI | Instant scoring only | Auto + error-tag digest | + AI weekly pattern summary | Same | Same |
| Human | — | — | Weekly live Q&A | Live L/R strategy lab (12 × 90 min) and mock debrief | Live content + 1:1 debrief within the 3 × 45-min 1:1 sessions |
| Downloadables (watermarked PDF) | 1-page letter-names/numbers sheet, accent cheat-sheet | Listening Workbook (PDF), spelling traps list | + Mock review sheets | + Session slides | + Personal error report |

### 5.3 Reading

| Asset | Free | Core | Plus | Live | Mentor |
|---|---|---|---|---|---|
| Lessons | R1.1.1, R1.2.1, R3.1.1 | R1–R7 (72); + R8 for GT | Same | Same | Same |
| Practice sets | TFNG set 1, headings set 1, completion set 1 | Full bank; pace chart | + weak-tag sets | Same | Same |
| Sectional tests | (shared with Listening: one free sectional) | Sectionals 1, 2, D | Same | Same | Same |
| Full mocks | — | 1–4 | 1–10 | 1–10 | 1–10 |
| AI | Instant | Auto + pace chart | + weekly summary | Same | Same |
| Human | — | — | Weekly live Q&A | Live R lab, Passage-3 clinic | Live content + 1:1 (3 × 45 min) |
| Downloadables | Skimming/scanning cheat-sheet, TFNG decision tree | Reading Workbook (PDF) | + mock review sheets | + slides | + personal report |

### 5.4 Writing

| Asset | Free | Core | Plus | Live | Mentor |
|---|---|---|---|---|---|
| Lessons | W1.1.1, W2.1.3 (overview), W4.2.1 | W1–W7 (Academic) or W1, W4–W8 (GT) | Same | Same | Same |
| Practice | 1 Task 1 + 1 Task 2 prompt | Full prompt bank (42 + 24 + 100); unlimited self-practice | Same | Same | Same |
| Model answers (Band 6/7/8, commented) | 1 Band-7 pair | All 189 (PDF + online) | Same | Same | Same |
| AI evaluation (1 credit per task) | 2 credits at sign-up + 1 / month (shared pool) | From the 10-credit pool | From the 40-credit pool (max 6 evaluations/day) | 40-credit pool | 40-credit pool |
| Human review (72 h SLA; 24 h with priority add-on) | — | — | 2 essays (one T1/GT, one T2) | 4 essays (2 T1/letters + 2 T2) | 6 essays (3 T1/letters + 3 T2) |
| Live | — | — | Weekly Q&A | Weekly 90-min writing workshop (12 × 90, within the 36 sessions) | Workshop + 1:1 |
| Downloadables | Task 2 structure sheet; band descriptors in plain language | Writing Handbook (PDF), Writing Model Answers (PDF) | + feedback tracker | + workshop packs | + personal writing portfolio |

### 5.5 Speaking

| Asset | Free | Core | Plus | Live | Mentor |
|---|---|---|---|---|---|
| Lessons | S1.1.1, S2.1.2, S3.1.2 | S1–S7 (69) | Same | Same | Same |
| Practice | 10 Part 1 topics, 10 cue cards (self-record, model audio) | Full bank: 120 topics, 180 cards, 180 Part 3 sets, drills | Same | Same | Same |
| AI (credits: one Part = 1, full test = 2) | Diagnostic recording only | From the 10-credit pool | From the 40-credit pool | 40-credit pool | 40-credit pool |
| Human | — | — | Weekly live Q&A; speaking club by pay-per-slot add-on | **2** examiner-style mocks (12 min + 8 min feedback, written report) + **6** speaking-club slots (45 min, ≤ 6 learners) | **3** mocks + 6 club slots + 1:1 pronunciation clinic inside the 3 × 45-min sessions |
| Downloadables | Cue-card starter pack (10 cards), pronunciation contrast sheet | Speaking Handbook (PDF), Cue-card Deck (PDF, 180 cards), Pronunciation workbook | + feedback tracker | + club packs | + personal pronunciation plan |
| Printed | — | Optional (bundle, §6.6) | Optional | Included in Live bundle (§6.6) | Included |

### 5.6 Foundation strands, mocks and cross-cutting items

| Asset | Free | Core | Plus | Live | Mentor |
|---|---|---|---|---|---|
| Grammar G1–G36 + mini-sets | G1–G3 | All | All | All | All |
| Vocabulary decks | 3 topic decks + AWL sublist 1 | All 59 decks | All | All | All |
| Placement/diagnostic | Quick + full | Same | Same | Same | Same |
| Study plan | Placement result, "next best action" | Generated, read-only plan (P1) | Adaptive plan (P2, 03 §3.9) | Plan + teacher tracking | Plan + mentor edits |
| Mock Series access | — | Purchasable add-on (mock packs x3/x5/x10, Mock Series) | Mocks 5–10 included (10 total; 5 available at launch) | Same | 10 total |
| Community Q&A | Read + post | Yes | Yes | Yes + batch chat | Yes + mentor chat |
| Certificate | — | Yes | Yes | Yes | Yes |
| Support first response (17 §2.2) | Community | 48 h | 24 h | 12 h (batch chat 4 h in class hours) | 4 h (09:00–23:00 BST) |

### 5.7 Live batch curriculum map (12-week regular; details of operations in 18)

3 sessions per week × 90 minutes = 36 sessions (≈ 54 live hours). Each week has one **Skills Lab** (L/R), one **Writing Workshop**, one **Speaking & Pronunciation Lab**. Weeks 4, 8 and 12 swap the Skills Lab for a **mock debrief**.

| Week | Skills Lab (L/R) | Writing Workshop | Speaking & Pronunciation Lab | Mock / checkpoint |
|---|---|---|---|---|
| 1 | Test overview, prediction, skimming | Criteria & task analysis | Format, baseline recording | Full diagnostic (M0) |
| 2 | Part 1 + TFNG basics | Task 1 overview | Part 1 extension | |
| 3 | Part 2 maps + matching information | Task 1 data language | Sounds /v/-/w/ and stress | |
| 4 | **Mock 1 debrief** (L/R) | Task 1 processes/maps | Part 2 planning | Mock 1 |
| 5 | Part 3 + YNNG | Task 2 foundations | Part 2 storytelling | |
| 6 | Headings + matching | Opinion/discussion essays | Part 3 reasoning | |
| 7 | Part 4 + completion types | Problem-solution/adv–disadv | Fluency and chunking | |
| 8 | **Mock 2 debrief** | Cohesion & editing | Mid-course speaking mock (human) | Mock 2 |
| 9 | Distractors & paraphrase | Lexical resource | Part 3 depth | |
| 10 | Passage 3 + stamina | Task 2 under time | Pronunciation clinic | |
| 11 | Accents & speed | Full writing section | Human speaking mock 2 | Mock 3 |
| 12 | **Mock 3/4 debrief** & exam-day | Final writing review | Human speaking mock 3 | Mock 4 |

Crash batch (4 weeks): **16 sessions × 90 min (4/week, 18 L2; 17 §2.2)** following §7.1; one human speaking mock (Week 3) and 2 human essay reviews, per 17.

### 5.8 Outcome promises (what each tier can honestly say)

**No tier promises a band score.** All band numbers are estimates (D6). Outcome statements below are the only claims allowed in product pages; marketing (19/20) must quote them verbatim or more conservatively. Any outcome statistic (e.g. "learners improved by X") may be published only from verified self-reported official results (03 F-MAST-06) with n ≥ 200, method note and date.

| Tier | Honest promise | Must not say |
|---|---|---|
| **Free** | "Find out where you are: an estimated band range, your biggest gaps, and a sample of how we teach." | "Free IELTS course", "guaranteed estimate" |
| **Core** | "A complete structured course with exam-style practice on a computer-delivered test screen, four full mocks, and an estimated band across all four skills." | "You will reach Band X", "official-level accuracy" |
| **Plus** | "Everything in Core, with an adaptive plan, ten full mocks (five at launch), a larger AI allowance for Writing and Speaking, weekly live Q&A, two human-reviewed essays that show how your AI estimates compare with a trained marker, and the Target Promise: a free 3-month extension if you meet the conditions and miss your target." | "AI equals an examiner", "guaranteed band", "money back if you miss your band" |
| **Live** | "A guided 12-week (or 4-week) cohort with a teacher, deadlines, weekly speaking practice and human feedback on your Writing and Speaking." | "Guaranteed improvement", unrealistic band-jump claims |
| **Mentor** | "A named mentor, three 1:1 sessions, a personal plan reviewed every week, six human-reviewed essays and three speaking mocks, and the Progress Promise: a free re-enrolment in the next Live batch if you meet all programme conditions and do not reach your target in your official test." | "Band guarantee", "money back if you miss your band", "unconditional" |

**Progress Promise (Mentor) and Target Promise (Plus): curriculum-level outline; the binding terms are 17 §2.2a (D12 C13/C13b) and these numbers must not be loosened or tightened here.** Core and Plus also carry the 7-day no-questions money-back (< 20% consumed and ≤ 1 full mock); that is a refund policy, not a score guarantee.

| Item | Rule |
|---|---|
| Eligibility screen at purchase | Full diagnostic taken; target agreed at enrolment must be ≤ diagnostic + 1.5 bands (17 §2.2a); no skill gap > 2.0 (curriculum screen); target declared in writing before the programme starts |
| Learner must | **Progress Promise (Mentor):** attend ≥ 80% of live sessions; submit all homework; take ≥ 4 full mocks in exam mode. **Target Promise (Plus):** take ≥ 4 full mocks and complete ≥ 70% of the study plan. Both: follow the plan; the curriculum recommends but does not require more practice than these thresholds |
| Official test | Official test sat within 60 days after course end (Plus: after access end); official Test Report Form uploaded; claim within 30 days of the result (17 §2.2a) |
| Remedy | Mentor: **one free re-enrolment into the next Live batch**; Plus: **one free 3-month extension** (video + library; credits not refilled). Not a refund; not transferable; not applicable if conditions are not met; modelled as `guarantee_claim` (05) |
| Honesty guards | Ineligible learners are told why and offered Live or Plus instead; the guarantee page lists conditions in plain Bangla/English; counts of claims honoured are tracked and reported internally monthly |

---

## 6. Materials list per course

### 6.1 Video, interactive, and PDF inventory (IELTS Academic; other courses are listed in §9)

| Material | Count / spec | Notes |
|---|---|---|
| Video lessons | 282 videos, ≈ 60 h | VC, WE, RV types; HLS via Bunny Stream with dynamic watermark (D3); captions EN; Bangla captions for BD edition |
| Interactive practice sets | ≈ 180 sets | GP and TP lessons + hub sets |
| Practice items (L+R, excl. mocks) | 2,554 (+ 320 in 4 mocks) | §3.1.3 / §3.2.3 |
| Writing prompts | 42 Task 1 + 100 Task 2 | + 24 letters in GT |
| Speaking prompts | 120 Part 1 topics, 180 cue cards, 180 Part 3 sets | §6.5 |
| Spaced-repetition items | ≈ 3,940 | §4.2 |
| Mocks | 4 full + 4 sectional | + Mock Series |
| PDFs (watermarked with learner email/ID) | 10 titles | §6.7 |
| Printed bundles | 3 | §6.6 |

### 6.2 Writing model answers (bands 6, 7, 8) with examiner-style commentary

| Pool | Prompts | Bands | Models | Commentary per model |
|---|---|---|---|---|
| Academic Task 1 | 21 (3 per visual type × 7) | 6, 7, 8 | 63 | Criterion-by-criterion notes (TA, CC, LR, GRA), annotated highlights, "what lifts it to the next band", word count |
| GT letters | 12 (3 registers × 4 purposes) | 6, 7, 8 | 36 | Same + register/tone note |
| Task 2 | 30 (6 per essay type × 5) | 6, 7, 8 | 90 | Same + position/development analysis |
| **Total** | **63** | | **189** | |

Standards: models are **written by trained writers, verified by two raters, and calibrated against the AI rubric** (07 §7.3; band assignment within ±0.5 across raters); never copied from published books; for each Band 6/7/8 trio the topic is identical; Band 6 models contain realistic, specific errors flagged in the commentary; every model displays "Model answer — estimated band" and a "Do not memorise" banner (§3.3.5). The Band-8 versions use natural, topic-appropriate language, not showy vocabulary.

### 6.3 Listening audio set specification

| Spec | Value |
|---|---|
| Parts | 24 practice parts (6 per Part 1–4) + 16 sectional parts (A–D) + 16 mock parts (Mocks 1–4) = 56 full parts in the full course (Core and above); Mock Series adds 10 Academic mocks × 4 = 40 parts (+ GT) |
| Drill clips | ≈ 60 short clips (1–3 min), reused across 476 type-drill items |
| Dictation/spelling micro-drills | 300 items |
| Accent mix (per part, by total running time) | British 30%, Australian 20%, North American 20%, New Zealand 15%, Canadian 15% (targets; at least 3 accents in any full mock) |
| Speaker mix | ≈ 50/50 male/female; adult age range; Part 3 includes 3–4 speakers ≈ 40% of the time |
| Speed (words per minute; estimates, measured automatically) | Part 1: 135–150; Part 2: 140–155; Part 3: 145–165; Part 4: 150–165. Foundation drills: 110–125. Stretch drills: up to 175. Inter-sentence pauses natural, not exaggerated |
| Level of noise | Clean studio for mocks; mild ambient noise in some drills (rooms, streets) — labelled |
| Length per full part | ≈ 5–8 min audio (≈ 30 min total for 4 parts) |
| Played | Once in exam mode; replay allowed in untimed practice |
| Production | Human voice artists for mocks and sectionals; synthetic voices only where policy in 16 permits (drills, Foundation), never in mocks; recording standards, loudness and file specs in 16 |
| Transcripts | Available after submission; highlighted answer location and paraphrase map |
| Content | Original scripts; settings avoid copying published tests (16) |

### 6.4 Reading passage bank

| Spec | Academic | General Training |
|---|---|---|
| Passage length | **700–900 words** per passage (engine allows 650–1000; Passage 3 may reach 900–1000) | Section 1: 2–3 short texts (≈ 150–400 words each); Section 2: 2 texts (≈ 300–450 words each); Section 3: 1 long text (≈ 700–900 words) |
| Passages in the full course | 36 practice + 9 sectional + 12 mock = **57** | S1 texts 42, S2 texts 28, S3 texts 20 in practice; + sectional and mock sets |
| Passages in Mock Series (Academic) | 10 mocks × 3 = 30 | 5 mocks × (S1–S3) |
| Genres (target share) | Natural science 20%, social science 20%, history/archaeology 12%, technology 12%, environment/ecology 12%, health/medicine 8%, arts/culture/linguistics 8%, business/economics 8% | Adverts, notices, timetables, brochures, policies, job descriptions, workplace guidelines; magazine-style and descriptive/discursive texts |
| Text types | Argumentative 40%, descriptive 30%, historical/narrative 15%, process/explanatory 15% | |
| Readability | Flesch–Kincaid grade ≈ 11–15 (Passage 1 ≈ 11–12; Passage 3 ≈ 14–15); AWL density 8–12% in Passage 3 | Plain to moderate |
| Question types per passage | ≥ 2 types per passage; each Academic mock covers ≥ 8 of 11 families across the test | |
| Visuals | ≥ 1 diagram/table/graph per test (supports `diagram_label_completion`) | |
| Authorship | Original texts commissioned; fact-checked; not scraped (D6); no copyrighted excerpts; glossary for technical terms where the real test uses it | |

### 6.5 Speaking cue-card bank (180 cards)

12 categories × 15 cards. Each card has: title, 3–4 bullets, a "round-off" question, 3 model talks (Band 6 / 7 / 8 transcripts, in the PDF), a linked Part 3 set, and tags (tense profile, topic, difficulty).

| # | Category | Example topics (illustrative) | Cards |
|---|---|---|---|
| 1 | People | A teacher who influenced you; a family elder; a successful person; a neighbour; a friend you admire | 15 |
| 2 | Places | A place you want to visit; a quiet place; a historical building; a place you go to relax | 15 |
| 3 | Objects | A gift you gave/received; a piece of technology you use daily; something old you own | 15 |
| 4 | Events | A wedding; a festival; a sports match; a time you were late; a celebration | 15 |
| 5 | Experiences | A time you helped someone; a difficult decision; a journey; learning a skill | 15 |
| 6 | Activities and hobbies | A hobby; a sport; a creative activity; a weekend routine; a game | 15 |
| 7 | Media and arts | A film; a book; a song; a TV programme; a photograph; an advert | 15 |
| 8 | Nature and environment | A park; an animal; a natural place; weather; a plant; water or rivers | 15 |
| 9 | Education and work | A subject you enjoyed; a job you would like; an ability at work; a teacher; a school event | 15 |
| 10 | Technology and communication | An app; a website; a time technology failed; online shopping; a video call | 15 |
| 11 | Health and lifestyle | A healthy habit; a doctor visit; food; sleep; a time you were tired; an exercise | 15 |
| 12 | Situations and abstract qualities | A time you were patient; a rule you disagree with; a time you changed your mind; something you spent money on | 15 |
| | **Total** | | **180** |

Tense profile target: ≈ 55% past-narrative, 25% present-descriptive, 20% mixed/future. Cards are original and avoid reproducing recalled real-exam cards (16 policy; "recalled questions" are never used).

### 6.6 Printed book bundles (which PDFs become printed books)

Printed books come only from content we own and have QA-ed; no Cambridge/IELTS-partner text is reproduced (16 §1; IELTS.org copyright statement permits personal, non-commercial use only). Prices, shipping and print vendor in 16/17.

| Printed title | Source PDF | Approx. pages | Language | Used in |
|---|---|---|---|---|
| **Listening & Reading Workbook** | Listening Workbook + Reading Workbook | ≈ 380 | EN with BN strategy notes (BD) / EN (intl) | Core-Print, Full-Print |
| **Writing Handbook & Model Answers** | Writing Handbook + Model Answers (189 models) | ≈ 420 | Same | Full-Print, Live-Print |
| **Speaking Handbook** | Speaking Handbook + Pronunciation workbook | ≈ 220 | Same | Full-Print, Live-Print |
| **Cue-Card Deck (boxed)** | Cue-card Deck (180 cards) | 180 cards | EN | Full-Print, Live-Print |
| **Vocabulary Book** | Vocabulary Book (topic decks + AWL + collocations) | ≈ 260 | EN + BN gloss (BD) | Core-Print, Full-Print |
| **Grammar for IELTS** | Grammar Book (36 topics + Bangla bridge cards) | ≈ 240 | BN-EN (BD) / EN | Full-Print |

| Bundle | Contents | Included in |
|---|---|---|
| **Core-Print** | Listening & Reading Workbook + Vocabulary Book | Add-on to Core/Plus |
| **Full-Print** | All six titles | Add-on; included free with the BD Live and Mentor tiers (as in the Bangladesh competitor pattern of a free hardcopy, 10MS) subject to 17 |
| **Live-Print** | Writing Handbook, Speaking Handbook, Cue-Card Deck | Live tier |
| **Foundation-Print** | English Foundation Student Book (3 volumes) | Foundation add-on |

### 6.7 PDF inventory (all watermarked per learner; low-bandwidth friendly)

| # | Title | Course(s) | Pages | Tier |
|---|---|---|---|---|
| 1 | Listening Workbook | Academic/GT course (Core and above), Accelerator | ≈ 190 | Core+ |
| 2 | Reading Workbook (Academic or GT edition) | Core and above, Accelerator | ≈ 190 | Core+ |
| 3 | Writing Handbook | Core and above, Writing Mastery | ≈ 160 | Core+ |
| 4 | Writing Model Answers (189) | Writing Mastery, Core and above | ≈ 260 | Core+ |
| 5 | Speaking Handbook | Core and above, Speaking Mastery | ≈ 140 | Core+ |
| 6 | Cue-Card Deck (180) | Core and above, Speaking Mastery | 180 cards | Core+ |
| 7 | Pronunciation Workbook (Bangla bridge) | Core and above, Speaking Mastery | ≈ 80 | Core+ |
| 8 | Vocabulary Book | Core and above | ≈ 260 | Core+ |
| 9 | Grammar for IELTS | Core and above | ≈ 240 | Core+ |
| 10 | Mock review sheets (per mock) | Core and above, Mock Series | 4–6 each | Core+/Plus |
| — | Free cheat-sheets (8 × 1 page) | Free | 8 | Free |

---

## 7. Study plans

Plans are generated by the planner (03 §3.9/§3.12) from these templates; the numbers below are the template defaults. **Hours are guided + practice hours**, not including optional independent immersion (reading, podcasts, conversation), which is recommended on top. Two learner profiles:

| Profile | Typical availability | Weekday | Weekend |
|---|---|---|---|
| **Working adult** | evenings, shared time | 1.5–2.5 h | 3–5 h per day |
| **Full-time student / between jobs** | most of the day | 3–5 h | 4–6 h |

Rule applied by the planner: **sessions are 25–90 minutes**, each ending with an error-log entry; no more than 3 consecutive hours of one skill; Writing and Speaking feedback is reviewed the day after submission; one rest day per week outside the Crash plan.

### 7.1 Four-week Crash plan (exam in ≤ 28 days; Academic or GT)

For learners within ≈ 1.0 band of target. Honest framing: it is a *polish*, not a band-jump; typical outcome ≤ 0.5 band. Total ≈ **131 h (full-time)** or **≈ 78 h (working adult)**. Lesson subset: lessons flagged ★ in the CMS (about 100 of the 371 in the full course; see §9 C6); everything else is available as reference.

| Day | Content | Full-time h | Working adult h |
|---|---|---|---|
| **Week 1 – Diagnose and fix the basics** | | | |
| Mon | Full diagnostic (M0), plan, test overview; Listening L1 | 5 | 2.5 |
| Tue | Listening Part 1–2 (L2 ★, L3 ★); spelling and numbers; vocabulary V1 | 5 | 2.5 |
| Wed | Reading R1–R2 ★ (skim/scan/paraphrase); TFNG basics | 5 | 2.5 |
| Thu | Writing W1 ★ + Task 1 overview (W2.1) / GT letter register (W8.1); 1 AI Writing | 5 | 2.5 |
| Fri | Speaking S1–S2 ★; baseline recording; Part 1 labs | 5 | 2.5 |
| Sat | Sectional Listening A + Sectional Reading 1; review | 6 | 5 |
| Sun | **Mock 1** (L, R, W, S) + review video | 6 | 5 |
| **Week 2 – Question types and Task 2** | | | |
| Mon | Listening Part 3 (L4 ★); MCQ and matching | 5 | 2.5 |
| Tue | Reading R3 ★ (TFNG/YNNG/matching information) | 5 | 2.5 |
| Wed | Reading R4 ★ + R5 ★ (headings; completion) | 5 | 2.5 |
| Thu | Writing Task 2 W4 ★ (analysis, structure); 1 AI Task 2 | 5 | 2.5 |
| Fri | Speaking Part 2 (S3 ★); cue-card planning; AI Part 2 | 5 | 2.5 |
| Sat | Sectional Listening B + Reading 2; error-log clinic | 6 | 5 |
| Sun | **Mock 2** + review | 6 | 5 |
| **Week 3 – Timing, range, accuracy** | | | |
| Mon | Listening Part 4 (L5 ★), lecture notes; accents (L6.1) | 5 | 2.5 |
| Tue | Reading Passage 3 and timing (R6 ★, R7 ★) | 5 | 2.5 |
| Wed | Writing Task 2 essay types (W5 ★); 2 AI essays | 5 | 2.5 |
| Thu | Task 1 by type (W3 ★) / GT letters; grammar accuracy (G-priority set) | 5 | 2.5 |
| Fri | Speaking Part 3 (S4 ★); pronunciation S5 ★ | 5 | 2.5 |
| Sat | Targeted weak-tag sets + human speaking mock (Live) / AI speaking mock | 6 | 5 |
| Sun | **Mock 3 (this is T-7 for a 28-day exam)** + review | 6 | 5 |
| **Week 4 – Polish and taper** | | | |
| Mon | Weak-tag sets (L/R); 1 AI Writing task; review model answers | 5 | 2.5 |
| Tue | Timed Writing section (60 min); AI feedback; fix error-log items | 5 | 2.5 |
| Wed | Speaking mock (full, AI or human); pronunciation focus | 4 | 2 |
| Thu | Light mixed practice 90 min; vocabulary review | 3 | 1.5 |
| Fri | Cheat-sheets 60 min; exam logistics; early night | 2 | 1 |
| Sat | 30 min warm-up listening/reading; ID, route, device check | 1 | 0.5 |
| Sun | **Exam day** | — | — |
| **Total** | | **≈ 131 h** | **≈ 78 h** |

Gate at purchase: learners whose placement gap is > 1.0 band are shown the honest-advice screen (§2.2) before being sold the Crash Course.

### 7.2 Eight-week plan (entry ≈ 5.5, target ≈ 6.5)

| Profile | Hours per week | Total |
|---|---|---|
| Working adult | ≈ 12 h (weekdays 1.25 h × 5 + Sat 3 h + Sun 3 h) | ≈ 96 h |
| Full-time | ≈ 22 h (3 h × 5 + 4 + 3) | ≈ 176 h |

| Wk | Listening | Reading | Writing | Speaking | Strands | Mocks/checks |
|---|---|---|---|---|---|---|
| 1 | L1, L2 | R1, R2 | W1, W2.1 | S1, S2 | G1–G6, V1–V2 | Full diagnostic |
| 2 | L3 | R3 | W2.2–2.3 | S3 | G7–G12, V3 | Sectional drills |
| 3 | L4 | R4 | W3, W4 | S4, S5.1 | G13–G18, V4 | **Mock 1** |
| 4 | L5 | R5 | W5.1 | S5.2 | G19–G24, V5 | Sectionals 1/A |
| 5 | L6.1 | R6 | W5.2–5.3 | S5.3, S6 | G25–G30, V6–V7 | **Mock 2** |
| 6 | Weak-tag sets | R7.1 | W6 | S7 (mock 1) | G31–G36 (Adv.) / review | Sectionals 2/B |
| 7 | L6.2 | R7.2 | W7 | S7 (mock 2) | V8–V10 | **Mock 3** |
| 8 | Taper + remediation | Taper | Taper | Taper | SRS only | **Mock 4 at T-7**, then taper |

### 7.3 Twelve-week regular plan (entry ≈ 4.5–5.5, target ≈ 6.0–6.5)

| Profile | Hours per week | Total (≈) | Expectation |
|---|---|---|---|
| Working adult | 10–12 h | 120–144 h | At the low end of the 150–200 h per band rule; gains typically ≈ 0.5 band unless the learner extends to 16 weeks or adds independent hours |
| Full-time | 18–22 h | 216–264 h | Covers a full band of guided hours with room for remediation |

The Live batch (3 × 90-min sessions per week, §5.7) is mapped onto this plan.

| Wk | Listening | Reading | Writing | Speaking | Strands | Mocks / checks |
|---|---|---|---|---|---|---|
| 1 | M0, L1 | R1 | W1 | S1 | G1–G6, V1 | Full diagnostic |
| 2 | L2 | R2 | W2.1–2.2 | S2 | G7–G12, V2 | Plus: baseline mock |
| 3 | L3 | R3 | W2.3 | S3.1–3.2 | G13–G18, V3 | |
| 4 | L4 | R4 | W3.1–3.2 | S3.3, S5.1 | G19–G22, V4 | **Mock 1** |
| 5 | L5 | R5 | W3.3 | S4 | G23–G26, V5 | Plus: **Mock 2** |
| 6 | L6.1 | R6 | W4 | S5.2 | G27–G30, V6 | Sectionals 1 / A |
| 7 | Remediation (weak tags) | R7.1 | W5.1 | S5.3, S6 | G31–G33, V7 | **Mock 2/3** |
| 8 | L6.2 (Sect. B) | R7.2 (Sect. 2) | W5.2–5.3 | S7 | G34–G36, V8 | Mid-course human review (Live/Mentor) |
| 9 | Part 3–4 distractors | Passage 3 | W6 | S8 (Mastery) / review | V9–V10 | **Mock 4/5** |
| 10 | Mixed sets | Mixed sets | W7 | Speaking mocks | V11–V12 | **Mock 6** |
| 11 | Targeted | Targeted | Full writing sections | Human mock | V13–V16 | **Mock 7/8** |
| 12 | Taper | Taper | Taper | Taper | SRS only | Final **mock at T-7**, then taper |

Mock counts by tier: Core uses its four in-course mocks at weeks 4, 7, 10 and 12 (T-7). Plus (10 mocks) follows the table; Live/Mentor add batch/extra mocks. Working adults on Plus should choose 6–7 of the 10 (not all) to protect review time.

### 7.4 Sixteen-week Foundation → IELTS plan (entry ≈ 4.0–4.5 or B1-borderline)

Weeks 1–4: **Foundation Bridge** (English Foundation modules F9–F12, B1 consolidation; Bangla-medium or international edition). Weeks 5–16: the 12-week regular plan above (Week 5 = plan Week 1).

| Profile | Weeks 1–4 | Weeks 5–16 | Total |
|---|---|---|---|
| Working adult | 8–10 h/wk (≈ 36 h) | 10–12 h/wk | ≈ 160–180 h |
| Full-time | 18 h/wk (≈ 72 h) | 18–22 h/wk | ≈ 290–340 h |

| Wk | Focus |
|---|---|
| 1 | F9 Experiences and narratives; present perfect; reading short texts; diagnostic re-check |
| 2 | F10 Opinions and reasons; connectors; listening to conversations |
| 3 | F11 Texts and talks; academic word list sublist 1–2; note-taking |
| 4 | F12 Writing and speaking bridge to IELTS; level test (gate: ≥ 70% to continue; else repeat F11–F12) |
| 5–16 | 12-week plan (§7.3) |

### 7.5 Mock schedule and taper (all plans)

**Mock rules.** Full mocks are taken in exam mode (server timer, D6), ideally at the learner's exam time of day, never within 48 hours of the exam, and at least 5 days apart. The final full mock is at **T-7**. Every mock is followed within 24 h by its review (video + tag report).

| Window | Rule |
|---|---|
| T-28 to T-15 | Full practice load; mocks every 5–7 days; remediation of top-3 tags |
| T-14 to T-8 | Mocks every 4–5 days (Plus/Live) or every 7 days (Core); 1 AI Writing + 1 AI Speaking per week |
| **T-7** | **Last full mock**; calibrate readiness (§8.5) |
| T-6 to T-4 | Error-log review; timed single tasks (1 passage, 1 Listening part, 1 Task 1, 1 Task 2); no new content; vocabulary review only |
| T-3 | 60–90 min light practice; speaking warm-up (20 min) |
| T-2 | 60 min cheat-sheet review; logistics (ID, location, device); early sleep |
| T-1 | ≤ 30 min review; no new tasks; rest |
| T-0 | 10-minute English warm-up; arrive early |

**Weekly templates (working adult, 12 h/week).** Mon/Wed: 90 min (25 SRS + 20 lesson + 35 practice + 10 error log); Tue/Thu: 90 min (Writing or Speaking task); Fri: 60 min review; Sat: 3 h (sectional or mock); Sun: 3 h (feedback review + rewrite + speaking).

---

## 8. Assessment and progress model

Dashboards, F-MAST features and the mastery map are specified in 03 §3.10/§5.2; band-estimate methods in 07 §3 and §7. This section fixes the **curricular rules** those systems implement.

### 8.1 Mastery levels (per question type, per criterion, per skill)

| Level | Name | Objective skills (L/R question types, per type) | Subjective skills (W/S criteria vs the learner's target) |
|---|---|---|---|
| 0 | Not started | No timed attempt | No evaluated submission |
| 1 | Learning | < 50% over the last 2 timed sets (≥ 10 items) | Criterion estimate ≥ 1.0 below target |
| 2 | Developing | 50–69% | 0.5–0.99 below target |
| 3 | Proficient | 70–84% | Within 0.49 of target |
| 4 | Mastered | ≥ 85% on ≥ 3 timed sets across ≥ 14 days **and** passes the +14-day retest | At or above target in 2 consecutive evaluations (≥ 1 human-reviewed for the final level) |

Skill mastery = weighted mean of its question-type levels (weights = share of the exam's questions of that type in the blueprint, 07) or the mean of its four criteria. Mastery decays one level if a type is not practised for 30 days (spaced retrieval, §1.4). Mastery is a *learning* indicator and not the band estimate.

### 8.2 Band estimate methodology (pointer)

- **Listening / Reading:** raw score → band through the editable conversion tables, separate for Listening, Academic Reading and GT Reading (07 §3.2; IDP-derived, labelled approximate and "Estimated band").
- **Writing / Speaking:** AI evaluation against paraphrased public descriptors with per-criterion bands and confidence; human grader overrides (07 §7). Single-sample estimates always show a range.
- **Overall:** mean of four skills rounded to the nearest half band (IELTS rule; verify), labelled "estimated"; when W/S are AI-only the overall carries a confidence note.
- **Calibration:** self-reported official results (03 F-MAST-06) feed bias monitoring; we publish internal accuracy (MAE vs official) quarterly and never promise accuracy to learners.

### 8.3 Exit criteria per module

A module is *complete* when: all unit quizzes ≥ 75% (or submitted for W/S), the module checkpoint passes the rule below, and ≥ 80% of error-log items from that module were reviewed.

| Module(s) | Checkpoint | Pass rule |
|---|---|---|
| M0 | Diagnostic + plan created | Completed |
| L1 | Dictation set (30 items) | ≥ 85% on numbers/letters |
| L2–L5 | Timed 10-item part set (mixed types) | ≥ 70% (≥ 60% for Foundation-stage learners) |
| L6 | Sectionals A and B | Estimated band recorded; ≥ target − 1.0 to proceed to mocks |
| R1–R2 | Skim/paraphrase test (15 items, 15 min) | ≥ 70% |
| R3–R6 | Timed 13-item passage (20 min) per module | ≥ 65% (types of that module) |
| R7 | Sectional 1 and 2 | Estimated band recorded; time-management flag if > 62 min or ≥ 3 unanswered |
| R8 (GT) | GT sectional | As R7 |
| W1 | Criteria quiz + one baseline task | Submitted |
| W2, W3 | Timed Task 1 (20 min), AI-evaluated | Estimated ≥ target − 0.5 for TA or a specific rewrite completed |
| W4, W5 | Timed Task 2 (40 min), AI-evaluated | Same rule per criterion |
| W6 | Accuracy clinic and two rewrites | ≥ 60% error-free sentences |
| W7 | Two full Writing sections | Estimated band recorded |
| W8 (GT) | 4 timed letters | Tone/register checklist ≥ 80% |
| S1–S4 | Timed recordings per part, AI-evaluated | Estimated ≥ target − 0.5 on Fluency; 4/5 checklist points |
| S5 | Minimal-pair set and shadowing | ≥ 85% pair discrimination; AI intelligibility flag clear |
| S6–S7 | Full AI mocks | Estimated band recorded |
| G strand | Mini-set + spaced error deck | ≥ 80% on mini-set; error deck "learned" ≥ 60% |
| V strand | Deck mastery | ≥ 60% items "learned" in the active deck family |
| Z | Mocks 1–4 | Completed in exam mode |

### 8.4 Readiness indicator ("exam-ready")

The dashboard readiness light uses full mocks taken in **exam mode** (server-timed, D6). Learners set an overall target and an optional per-skill minimum (default: target − 0.5 per skill, or the institution's stated minimum).

| Status | Rule |
|---|---|
| **Exam-ready (green)** | The **last 2 full mocks** (≥ 5 days apart; at least one within 14 days of the exam) each meet the **overall target** and **every per-skill minimum**, with Writing and Speaking estimates carrying at least "medium" confidence |
| **Provisionally exam-ready (green, caution)** | Same numbers, but Writing/Speaking rely only on AI estimates, with no human-reviewed submission in the last 3 weeks; the UI advises a human review before booking |
| **Close (amber)** | One of the last 2 mocks meets the target, or both are within 0.5 of target |
| **Not yet (red)** | Otherwise |

Always shown with: "Estimated. Real exam results can differ. This indicator is not a guarantee." The rule is deliberately conservative; it is never used in marketing as "ready for Band X".

### 8.5 Certificate (completion) rule

A Lumen completion certificate (not an IELTS result; verifiable at `/verify/[code]`, 03 F-CERT) requires: ≥ 80% of lessons completed, all module checkpoints attempted, ≥ 2 full mocks attempted in exam mode, and no integrity flags. Certificates are revoked on refund (02 §7).

---

## 9. Course catalogue (IELTS and English-language)

Phase placement (D1 catalogue phase map, now binding): **P1** — IELTS Academic and GT (4 full mocks in Core), Writing Mastery, Speaking Mastery, Listening & Reading Accelerator, IELTS Crash Course (manual Zoom pilot), Mock Test Series, English Foundation. **P2** — Life Skills A1/B1, Spoken English, PTE, DET, Admissions tools. **P3** — TOEFL 2026, tech tracks, university packs, Work-Abroad tracks, optional OET/SAT/GMAT. (Resolves OQ-1.) International twins ship with their Bangladesh counterparts (D10).

### 9.1 Master table

Numbers marked ≈ are computed from the syllabus tables in §3 (video hours = sum of VC/WE/RV minutes; lessons include all lesson types). "Practice items" = L/R questions excluding mocks. Slugs follow 03 §7. "Wave 1" = P1 launch minimum (see §9.12).

| # | Course (slug) | Audience | Entry level | Duration | Modules | Lessons | Video hours | Practice items | Mocks | Tiers |
|---|---|---|---|---|---|---|---|---|---|---|
| C1 | **IELTS Academic** (`ielts-academic`) | University/professional applicants | Est. 4.5–5.5 (B1+), target 6.0–7.5 | 12 wks regular (8–16) | 31 | 371 | ≈ 60 | 2,554 (+ 142 Writing prompts, 480 Speaking prompts) | 4 full + 4 sectional | Free, Core, Plus, Live, Mentor |
| C2 | **IELTS General Training** (`ielts-gt`) | Migration/work/secondary-study applicants | Est. 4.5–5.5, target 6.0–7.0 | 12 wks (8–16) | 31 | 368 | ≈ 59 | 2,596 (+ 124 Writing prompts, 480 Speaking) | 4 full + 4 sectional | Free, Core, Plus, Live, Mentor |
| C3 | **IELTS Writing Mastery** (`ielts-writing-mastery`) | Writing stuck at 5.5–6.5; Academic and GT | Writing est. ≥ 5.0 | 6–8 wks | 11 | 123 | ≈ 21.2 | 166 Writing prompts; 189 annotated models | 2 Writing sections + capstone | Free, Core, Plus, Live (6-wk cohort) |
| C4 | **IELTS Speaking Mastery** (`ielts-speaking-mastery`) | Fluency and pronunciation gaps | Speaking est. ≥ 4.5 | 6 wks | 8 | 79 | ≈ 11.7 | 120 + 180 + 180 Speaking prompts; 260 drills | 4 AI mocks | Free, Core, Plus, Live (6-wk cohort) |
| C5 | **IELTS Listening & Reading Accelerator** (`ielts-lr-accelerator`) | Writing/Speaking ok, L/R stuck at 6.0–7.0 | Est. L/R ≥ 5.5 | 4–6 wks | 8 | 64 | ≈ 12.0 | ≈ 1,400 L/R (remix) | 4 L+R mocks + 6 sectionals | Free, Core, Plus, Live |
| C6 | **IELTS Crash Course, 4 weeks** (`ielts-crash-academic`, `ielts-crash-gt`) | Exam ≤ 28 days; gap ≤ 1.0 band | Est. within 1.0 of target | 4 wks | 4 weekly modules (24 day-units) | 100 | ≈ 24 | ≈ 900 L/R (curated) | 3 full + 4 sectional | Free, Core, Plus, Live (crash batch); Mentor without guarantee |
| C7 | **IELTS Mock Test Series** (`ielts-mock-series`; replaces "Mock Test Pack") | Exam-proximate practice, any course | Any (est. ≥ 4.5) | Flexible | — | 10 + 10 + 20 review videos | ≈ 8 (review videos) | 10 Academic + 5 GT full mocks (≥ 5 per exam at launch, 10 by ~day 120; Mock Series of 20 by ~day 270 per 17 §3.1); 20 L-only + 20 R-only sectionals | as listed | Add-on `test_pack`; Free sample; included counts in Plus/Live/Mentor |
| C8 | **IELTS Life Skills A1 / A2 / B1** (`ielts-life-skills-a1`, `-a2`, `-b1`) | UK family/settlement visa applicants (speaking & listening) | A0–A2 / A2–B1 | 2–5 wks | 4 / 5 / 6 | 28 / 36 / 48 | ≈ 5 / 7 / 9 | 150 / 220 / 300 | 4 / 6 / 8 speaking-listening mocks | Free, Core, Plus (AI speaking), Live (small group) |
| C9 | **English Foundation** (`english-foundation-bn`) / **English Foundations** (`english-foundations`) | Beginners to B1 learners; Bangla-medium / international | A0–A2 (est. IELTS < 4.0) | 24–30 wks self-paced (16-wk Sprint for A2/B1 entrants) | 12 | 288 | ≈ 25 | ≈ 3,500 auto-scored items; 200 AI speaking prompts | 3 level tests + bridge test | Free, Core, Plus, Live (cohort) |
| C10 | **Spoken English: everyday & workplace** (`spoken-english`, `spoken-english-intl`) | Working adults, job seekers, students | A2+ (CEFR) | 12 wks | 10 | 160 | ≈ 26 | ≈ 1,800 items; 240 AI speaking prompts | 2 speaking level tests | Free, Core, Plus, Live (batch) |

Prerequisites: C1/C2 none (placement recommended); C3/C4/C5 recommend Core pathway entry level or completion of the matching C1/C2 skill modules; C6 requires diagnostic; C7 none; C8 none; C9 none; C10 recommends English Foundation F8 or A2 placement.

Practice ratio check (Academic): practice capacity (in-lesson Writing/Speaking/diagnostic practice plus the L/R bank at ≈ 0.75 min per Listening item and ≈ 1.5 min per Reading item, plus four full mocks) is about 74 h versus 60 h of video, ratio ≈ 1.2 : 1. This meets the ≥ 1 : 1 design floor in §1.1; the planner raises the working ratio to ≥ 1.5 : 1 by scheduling rewrites, re-attempts, SRS and extra hub sets.

### 9.2 C1 IELTS Academic: composition

| Part | Modules | Lessons | Video h |
|---|---|---|---|
| Start here | M0 | 6 | 0.9 |
| Listening | L1–L6 | 72 | 9.9 |
| Academic Reading | R1–R7 | 72 | 10.5 |
| Academic Writing | W1–W7 | 82 | 13.9 |
| Speaking | S1–S7 | 69 | 10.3 |
| Grammar strand | G1–G36 | 36 | 6.6 |
| Vocabulary strand | V1–V18 | 18 | 3.6 |
| Mocks and sprint | Z | 16 | 4.1 |
| **Total** | **31 modules** | **371** | **≈ 60 h** |

Outcome objectives: see LO tables in §3.1–3.4 for the band zones; the course target is stated as "prepare you to attempt Band 6.5–7.0 targets with exam-faithful practice", not "reach".

### 9.3 C2 IELTS General Training: composition

Differences from C1: Reading adds R8 (GT sections) and uses GT passage banks; Writing replaces W2–W3 (Academic Task 1) with W8 (letters). Listening, Speaking, strands and mocks are identical (GT mocks use GT Reading and Writing).

| Part | Modules | Lessons | Video h |
|---|---|---|---|
| Start here | M0 | 6 | 0.9 |
| Listening | L1–L6 | 72 | 9.9 |
| GT Reading | R1–R8 | 85 | 12.3 |
| GT Writing | W1, W4–W8 | 66 | 11.2 |
| Speaking | S1–S7 | 69 | 10.3 |
| Grammar / Vocabulary | G1–G36, V1–V18 | 54 | 10.2 |
| Mocks and sprint | Z | 16 | 4.1 |
| **Total** | **31 modules** | **368** | **≈ 59 h** |

### 9.4 C3 IELTS Writing Mastery

Modules: W1–W9 plus targeted strand lessons G19–G36 (18) and V17–V18. Capstone: 4 timed submissions with a trend report (W7.2, W9.2). Included credits per 17 §3.1 (12 `ai_credit`, writing evaluations); tier details in §5.4. Outcome objectives: LO-W-6-x to LO-W-8-x. Prerequisite: Writing est. ≥ 5.0 or completion of W1–W4 of C1/C2.

### 9.5 C4 IELTS Speaking Mastery

Modules: S1–S8 (79 lessons). Pronunciation S5 is the flagship (Bangla-speaker bridge in BD edition; generic common-errors cards in the international edition). 20 scripted AI mock interviews; 4 recorded AI mocks included in the lessons; Live variant adds the weekly speaking club. Outcome objectives: LO-S-5-x to LO-S-8-x.

### 9.6 C5 IELTS Listening & Reading Accelerator

Fast-lane course that **reuses** 40 of the canonical L/R lessons (flagged ★A) and adds 24 new "error-elimination" labs.

| Module | Title | Source units | Lessons | Focus |
|---|---|---|---|---|
| A1 | Diagnose and target | New | 6 | L/R error taxonomy report; target raw scores (e.g. 6.5 → 26/40 L, 27/40 Academic R) |
| A2 | Listening: Part 1–2 error elimination | L1.3, L2.3, L3.1 | 8 | Spelling, correction, maps |
| A3 | Listening: Part 3–4 distractors | L4.2, L5.2, L6.1 | 8 | Paraphrase, speaker tracking, accents |
| A4 | Reading: information-check types | R2, R3 | 9 | Paraphrase, TFNG/YNNG, matching information |
| A5 | Reading: matching and headings | R4 | 7 | Headings, features, endings |
| A6 | Reading: completion and MCQ | R5, R6 | 8 | Word limits, summaries, multi-answer |
| A7 | Speed, stamina and accents | L6, R7 | 8 | 17/20/23 timing, 40-question attention |
| A8 | Mocks and sprint | Z subset | 10 | 4 L+R mocks, 6 sectionals |

Outcome objectives: LO-L-65-x, LO-L-7-x, LO-R-65-x, LO-R-7-x. Prerequisite: est. L/R ≥ 5.5 recommended.

### 9.7 C6 IELTS Crash Course (4 weeks)

Day-by-day plan in §7.1: 4 weekly modules (Diagnose and fix basics; Question types and Task 2; Timing, range, accuracy; Polish and taper), 24 study day-units, ≈ 100 lessons drawn from canonical lessons flagged ★ plus 4 new capstone lessons, 3 full mocks (days 7, 14, 21) and 4 sectional tests. Academic and GT variants. Live crash batch: 16 sessions × 90 min (17 §2.2; 18 L2). Outcome: "structured final preparation and an honest readiness estimate". Prerequisite: diagnostic gap ≤ 1.0 band.

### 9.8 C7 IELTS Mock Test Series

| Component | Academic | GT | Launch (P1) | By P2 |
|---|---|---|---|---|
| Full mocks (L+R+W+S, 07 blueprint) | 20 (Series; 10 by ~day 120) | 20 (Series) | ≥ 5 per exam | 10 per exam by ~day 120; 20 by ~day 270 |
| Listening-only sectionals | 20 | (shared) | 8 | 20 |
| Reading-only sectionals | 20 | 10 | 8 | 20 + 10 |
| Review videos | 20 | 10 | per mock | per mock |
| AI scoring | Writing and Speaking AI scoring is included inside each mock and does not draw credits (17 §2.2); mock packs `mock-pack-3/5/10` and the Series are sold only up to the mocks that exist | | | |

Each mock includes answer explanations, tagged error report, estimated band (approximate tables), and a review sheet PDF. Test series scheduling ("Test of the week", P2) per 03.

### 9.9 C8 IELTS Life Skills

| Level | Modules | Lessons | Module list |
|---|---|---|---|
| **A1** | 4 | 28 | LS-A1.1 Introduce yourself and others; LS-A1.2 Daily life, places, numbers; LS-A1.3 Listening to simple information (names, times, directions); LS-A1.4 Speaking test practice |
| **A2** | 5 | 36 | Adds: routines/plans, past events, requests and invitations, short paired conversation |
| **B1** | 6 | 48 | Adds: opinions/reasons, comparing, giving advice, extended description, paired discussion, listening to announcements and conversations |

Exam-style: paired speaking practice (partner matching in the live club or a trained partner bot with a human option); examiner-style timing; model transcripts. Content explicitly avoids stating which visa requires which level (§2.5).

### 9.10 C9 English Foundation (Bangla-medium) and English Foundations (international)

12 modules, 4 units each, 6 lessons per unit = 288 lessons; each unit ends with a unit test; level tests after F4, F8 and F12. About 160 hours of structured study content (video ≈ 25 h; interactive practice and speaking tasks the rest); CEFR guided-hour benchmarks imply more total exposure for A0 → B1 than the course alone provides, so the course promises *progress and readiness to start IELTS Core*, not "B1 in X months" for beginners.

| Module | Level | Theme / function | Core grammar | Skills output |
|---|---|---|---|---|
| F1 | A0 | Sounds, alphabet, greetings, numbers | be, pronouns | Spell name; greet; count |
| F2 | A1 | Personal info, family, objects | have, a/an/the, plurals | Short introductions |
| F3 | A1 | Daily routines, time, places | Present simple | Describe a day |
| F4 | A1 | Food, shopping, directions | Imperatives, can, prepositions | Ask and give simple info — **Level test 1** |
| F5 | A2 | Past events, travel | Past simple | Tell a short story |
| F6 | A2 | Plans, needs, health | Future, modals | Make plans, appointments |
| F7 | A2 | Describing, comparing, opinions | Comparatives, adjectives | Compare two things |
| F8 | A2 | Services, work, phone calls | Present perfect (intro), questions | Basic emails/messages — **Level test 2** |
| F9 | B1 | Experiences and narratives | Present perfect vs past | Longer narratives |
| F10 | B1 | Opinions, reasons, discussions | Connectors, conditionals 1 | Give opinions with reasons |
| F11 | B1 | Texts and talks | Relative clauses, passive intro | Read short articles; listen to talks; notes |
| F12 | B1+ | Writing and speaking bridge to IELTS | Mixed review | IELTS Part 1 style answers; 150-word paragraph — **Level test 3 / bridge test** |

Bangla-medium edition: Bangla explanations (§1.6 ratios), Bangla-English bilingual vocabulary, BD-relevant contexts. International twin: English-only, picture-supported, culturally neutral contexts, same units and tests. Bangla-medium F1–F4 are priced as micro-courses (17, "access programme").

### 9.11 C10 Spoken English: everyday and workplace

| Strand | Modules | Content |
|---|---|---|
| Everyday | SE1 Meeting people; SE2 Daily life; SE3 Shopping and services; SE4 Travel and directions; SE5 Opinions and conversations | Functions, role-plays, AI conversation partner |
| Workplace | SE6 Interviews and introductions; SE7 Meetings and updates; SE8 Phone and email-to-speech; SE9 Presentations; SE10 Negotiating and problem-solving | Workplace dialogues, voice-note tasks, 4 recorded speaking projects |

Pronunciation lane, 240 AI speaking prompts (credit-based), 2 speaking level tests (CEFR-aligned A2+ → B1/B2). Not IELTS preparation; bridges into IELTS Speaking Mastery.

### 9.12 Production waves (pointer to 16)

| Wave | Contents | Gate |
|---|---|---|
| **Wave 1 (P1 launch)** | C1 and C2 with all lessons in §3 for the four skills, strands and Z; ≥ 60% of every item bank; all four mocks (Academic) and four (GT); C3, C4 (core S/W modules); Mock Series 6 + 3 | Editorial QA §11; 55 h video minimum met (03 §7); sampling audit of items |
| **Wave 2 (P2)** | Remaining 40% of banks; C5, C6, C7 expansion to 10 + 5; Life Skills; Foundation F1–F6 + F7–F12; international twins of Wave 1 courses | Wave-1 outcome data and complaint rate review |
| **Wave 3 (P3)** | Spoken English; Writing/Speaking Mastery extensions W9/S8 (if not in Wave 1); additional L1-specific "common errors" cards | Demand and budget |

---

## 10. Bangladesh version versus International version

Every Bangla-first course has an English-only international counterpart with the **same unit IDs, objectives, item banks and assessments** (D10). Differences are only in the wrapper listed in §1.7. Pricing lives in 17 (BDT price book vs USD with regions A/B/C); marketing in 19/20.

| Course | BD edition (slug) | International edition (slug) | Language of instruction | Examples and contexts | Teacher persona | Pricing | Marketing |
|---|---|---|---|---|---|---|---|
| C1 Academic | `ielts-academic` (locale `bn`) | `ielts-academic` (locale `en`, edition `intl`) | BD: Bangla-English mix, ratio §1.6 (25–35% Bangla). Intl: English only, 130–145 wpm | BD: HSC/Honours, study-abroad from BD, Dhaka/Chattogram contexts mixed with global. Intl: global cities, international campuses, neutral workplaces | BD: bilingual Bangladeshi IELTS teachers. Intl: international-English teachers with examiner-style training | 17 §BD price book / §USD regions | 19 BD segments; 20 global |
| C2 GT | `ielts-gt` | same slug, intl edition | Same | BD: Gulf/UK/Canada/Australia migration, work-visa letters. Intl: neutral migration and workplace contexts | Same | 17 | 19/20 |
| C3 Writing Mastery | `ielts-writing-mastery` | same | Same | BD: BD-relevant Task 2 topics included; Intl: neutral topics (all topics culturally safe) | Writing specialist with examiner background | 17 | 19/20 |
| C4 Speaking Mastery | `ielts-speaking-mastery` | same | Same; pronunciation uses Bangla bridge (BD) vs generic contrasts (Intl) | BD: topics include local festivals and food as options; Intl: neutral + global | Pronunciation-specialist teacher; accent-neutral for Intl | 17 | 19/20 |
| C5 L&R Accelerator | `ielts-lr-accelerator` | same | Same | Same audio set | Same | 17 | 19/20 |
| C6 Crash Course | `ielts-crash-academic`, `-gt` | same | Same | Same | Same | 17 | 19 "exam in 4 weeks" campaigns; 20 global |
| C7 Mock Test Series | `ielts-mock-series` | same | UI Bangla/English; content English | Contexts neutral | Review videos bilingual (BD) / English (Intl) | 17 | 19/20 |
| C8 Life Skills | `ielts-life-skills-*` | same | BD: Bangla-English (heavier Bangla at A1); Intl: English with simple language | BD: UK-bound family contexts; Intl: neutral | Friendly, slow, simple language | 17 | Careful claims (no visa level statements) |
| C9 Foundation | `english-foundation-bn` | `english-foundations` | BD: Bangla-medium (70–80% → 35–45%); Intl: English-only, picture-supported | BD contexts; Intl neutral | Bangla-speaking teacher / international plain-English teacher | 17 micro-price; scholarship/access (D10) | 19 access programme |
| C10 Spoken English | `spoken-english` | `spoken-english-intl` | BD: Bangla-English mix; Intl: English-only | BD workplace and daily life; Intl neutral workplace | Corporate trainer persona | 17 | 19/20 |

Operational rules:
- A single content record serves both editions; locale decides captions, glossary, bridge cards and example set (`locale_variant` blocks in the CMS).
- Translating a BD lesson into English is prohibited as a shortcut: the English master script is written first (§1.7).
- Reviewers: each edition has its own language reviewer (Bangla editor; English-international editor) before publication.

---

## 11. Quality bar and review checklist for curriculum content

### 11.1 Standards

1. **Original content only.** No Cambridge/IELTS-partner, British Council, IDP or competitor text, audio or visuals; no "recalled" exam questions; sources and licences per 16 and 03 §9.1.
2. **Exam-faithful.** Item formats match the registry (07 §2.3) and the computer-delivered format; question wording, instructions and word limits mimic the real test without copying.
3. **Calibrated.** Difficulty tags assigned by two trained raters; items pass a pilot (≥ 30 learner responses, point-biserial ≥ 0.15 target) before being used in mocks; mock forms are balanced by type and difficulty (07 §4.5 pool rules for assembling forms).
4. **Honest about bands.** Every band number is labelled estimate; no guarantees; outcome claims limited to §5.8.
5. **No templates.** Writing/Speaking materials follow §3.3.5.
6. **L1-aware.** Bangla bridge notes are accurate, not stereotyping; pronunciation guidance is about intelligibility, not accent shaming.
7. **Accessible.** WCAG 2.2 AA; captions on every video; transcripts for all audio after submission; no colour-only cues; low-bandwidth variants (03 §8.2–8.3).
8. **Inclusive and neutral.** No political, sectarian or gendered stereotypes; topics sensitive for exam context (e.g. religion) used carefully and balanced.
9. **Consistent terminology.** Glossary enforced; official names used nominatively with disclaimer (03 §9.4).

### 11.2 Review workflow

| Stage | Owner | Output |
|---|---|---|
| 1. Brief (LO, band zone, type, tag) | Curriculum lead | Brief in CMS |
| 2. Draft | Instructor/item writer | Script/item set (draft) |
| 3. Content review | Second trained teacher | Accuracy, level, bias, language check (checklist below) |
| 4. Psychometric review (items) | Assessment lead | Difficulty, key check, distractor quality |
| 5. Language review (edition) | Bangla editor / International English editor | Edition sign-off |
| 6. Production QA | Production lead (16) | Audio/video specs, captions, watermark |
| 7. Pilot | Ops | Small cohort or beta users |
| 8. Publish | content_editor (03 §9.3) | Published version; change log |
| 9. Monitor | Analytics | Item stats (07), error reports (03 F-ERR), review at 90 days |

### 11.3 Review checklist (every lesson/item set)

**A. Objectives and structure**
- [ ] Linked to ≥ 1 LO with a measurable threshold; band zone assigned
- [ ] Lesson type and length within the §3.0 ranges; one concept per VC
- [ ] Sequence respects prerequisites; interleaving tags present
- [ ] Practice set linked; error tags defined

**B. Accuracy**
- [ ] Exam facts match §1.8 (or marked verify); no invented rules
- [ ] Strategy advice is robust to all test forms (no "tricks")
- [ ] Answers keyed and double-checked by a second person; explanations quote the decisive evidence
- [ ] Grammar/vocabulary points checked in a trusted reference

**C. Language**
- [ ] CEFR level of instruction appropriate (vocabulary list check)
- [ ] Bangla edition: terminology from the glossary; natural Bangla; English exam terms retained
- [ ] International edition: no idioms in instruction, no cultural assumptions, accent-neutral delivery
- [ ] Captions accurate to script

**D. Fairness**
- [ ] No cultural, gender, religious or political bias; examples varied
- [ ] Accents represented per §6.3; pace in range
- [ ] Accessibility checks passed (captions, transcripts, contrast)

**E. Originality and rights**
- [ ] Originality scan clean; provenance recorded (16)
- [ ] Images/audio licensed; voice talent contracts on file

**F. Feedback and honesty**
- [ ] Feedback is actionable (one next step)
- [ ] Band language labelled "estimated"; no guarantee wording
- [ ] Memorised-template risk checked (Writing/Speaking models)

**G. Production**
- [ ] Loudness, audio, resolution per 16
- [ ] Watermark and DRM settings (10) tested
- [ ] Bangla font rendering tested on low-end Android

### 11.4 Quality metrics (tracked per course)

| Metric | Target |
|---|---|
| Item error rate (reported errors per 1,000 attempts) | < 0.5 after 90 days |
| Item discrimination (point-biserial) | ≥ 0.15 for mock items; items below 0.10 are reviewed |
| Lesson completion | ≥ 70% of started lessons |
| Unit quiz first-attempt pass | 55–80% (outside this band: difficulty review) |
| Learner-rated helpfulness (lesson) | ≥ 4.3 / 5 |
| AI vs human band difference (Writing/Speaking) | MAE ≤ 0.5 band; flagged otherwise (07 §7) |
| Mock band estimate vs official result (self-reported, n ≥ 200) | MAE reported internally; target ≤ 0.5 |
| Template-similarity flags per 100 essays | Trend down over time |
| Course completion (Core) | ≥ 35% (benchmark in `tiers_live_books.md`; stretch ≥ 50% for Live) |

---

## Appendix A — ID scheme and conventions

| Element | Pattern | Example |
|---|---|---|
| Module | Skill letter + number | `L2`, `R4`, `W5`, `S3`, `Z`, `M0`, `F9` |
| Unit | `<module>.<n>` | `L2.1` |
| Lesson | `<module>.<unit>.<n>` | `L2.1.3` |
| Strand lesson | `G1`–`G36`, `V1`–`V18` | `G8` |
| Learning objective | `LO-<skill>-<band>-<n>` | `LO-R-65-1` (band 6.5 written 65) |
| Error tag | snake_case | `tfng_ng_vs_f` |
| Star flags | ★ = Crash subset; ★A = Accelerator reuse | CMS `lesson.flags` |
| Question types | `ielts.*` registry names from 07 §2.3 | `ielts.map_label` |

## Appendix B — Open questions and verify list

| # | Item | Needed by |
|---|---|---|
| OQ-1 | **Closed:** D1 catalogue phase map now places Foundation, Accelerator, Crash (Zoom pilot) in P1; Life Skills, Spoken English in P2 | – |
| OQ-2 | **Closed:** credits per tier and validity are 17 §2.2 (Core 10, Plus/Live/Mentor 40; 183 / 365 days); the earlier curriculum recommendation is superseded | – |
| OQ-3 | GT mocks in Core: D10 says 4 full mocks for all exam courses; 03 §7 said 3 for GT. This document uses 4 | Product |
| OQ-4 | Verify against the official IELTS handbook: Listening part layout, GT Reading section structure, Speaking part timings, minimum word counts and penalties, Task Response template cap, rounding rules, Life Skills formats/levels offered in Bangladesh | Content lead before launch |
| OQ-5 | Cambridge guided-learning-hours table; CEFR–IELTS correspondence wording for public use | Marketing/legal |
| OQ-6 | AWL (Coxhead 2000) usage terms for decks | Legal |
| OQ-7 | Whether human-voice recording is mandatory for all drills or synthetic voice is acceptable outside mocks | 16 |
| OQ-8 | Progress Promise / Target Promise legal wording (thresholds are final in 17 §2.2a; GA-014) | Legal |
| OQ-9 | UK English requirement for visa routes changes; confirm approach with legal before selling Life Skills | Legal |
| OQ-10 | "Spoken English" name and BD competitor positioning | Marketing |

## Appendix C — Change log
- 2026-11-07 — Consolidation: "Complete" retired (= Core); tier allowances, access days, guarantees and phase map aligned to 17 / D1 / D12.
- 2026-11-07 — v1.0 created. Supersedes 03 §7.1 for IELTS; adds Foundation, Life Skills, Spoken English, Accelerator, Crash.
