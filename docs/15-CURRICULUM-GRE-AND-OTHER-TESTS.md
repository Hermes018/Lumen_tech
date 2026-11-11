# 15 — Curriculum: GRE, PTE, DET, TOEFL (2026), optional GMAT/SAT, Tech Tracks and BD University CSE Packs

> Status: draft v1 (2026-11-07). Conforms to `00-DECISIONS.md` (D1 phases, D6 test engine invariants, D10 tiers).
> Sibling docs: `14-CURRICULUM-IELTS.md` (IELTS, English Foundation, Spoken English — not repeated here), `16-CONTENT-SOURCING-AND-PRODUCTION.md` (sourcing, recording, authoring pipeline, licences), `17-PRICING-MASTER.md` (all prices; this doc contains **no prices**), `07-TEST-ENGINE.md` (blueprints, question type ids), `03-PRODUCT-SPEC.md` §7 (catalogue v1 that this doc expands).
> Brand: "Lumen Academy" is a placeholder (`packages/config/brand.ts`). Exam names (GRE®, TOEFL®, PTE Academic, Duolingo English Test, GMAT™, SAT®) are used only nominatively with the disclaimer in §0.4.
> Marker **(verify)** = exam fact not confirmed from an official page in our research (see `research_notes/.../exam_specifications*.md`); must be confirmed against the owner's current official page before the lesson, mock blueprint or marketing claim ships. Marker **(estimate)** = our own planning figure, not a guarantee.

---

## 0. Conventions

> **Naming and allowances (D10, resolved):** "Complete" is retired and means the **Core** tier of a course family; this doc describes full course bodies (`gre`, `pte-academic`, `det`, `toefl-ibt`), and the buyable unit is family × tier (e.g. "GRE - Plus", SKU `gre-plus`). Every tier allowance (credits, mocks, human reviews, 1:1 and live-session counts, access days) is copied from `17-PRICING-MASTER.md` §2.2/§2.2b and must match it exactly; 17 wins on any mismatch. SRS for all vocabulary decks is **FSRS** (D12 C26; SM-2 fallback only).

### 0.1 Phase map (from D1)

| Course family | Phase | Notes |
|---|---|---|
| GRE General (full course sold as Core / Plus / Live / Mentor; Verbal, Quant, AWA Coaching, Vocab) | **P1** | Launch product; section-adaptive mocks (D6) |
| PTE Academic, Duolingo English Test | **P2** | Needs AI speaking/writing scoring maturity from P1 (D11 hedge: ship alongside Spoken English and Admissions tools) |
| TOEFL iBT (2026 format) | **P3** (D1 catalogue phase map) | Multistage adaptive engine (07 §4.7) required first |
| GMAT Focus, SAT | **Optional (post-P2)** | Outline only; build only if demand data justifies |
| Tech tracks, BD university CSE packs | **P3** | Needs in-browser notebooks / code sandbox, certificates, Open Badges |

### 0.2 Units and formats

| Term | Meaning |
|---|---|
| Module → Unit → Lesson | Module = a skill block (3–8 units); Unit = 3–8 lessons ending in a mastery quiz; Lesson = one learning objective, 8–18 min video **or** 5–10 min article, followed by 4–12 practice items |
| Item | One scorable question (07 registry type), or a flashcard (counted separately) |
| PS / Q / M / AI / NB / L | Practice set / question-bank item / mock / AI-evaluated submission / notebook / live (as in 03 §7) |
| Mastery threshold | Default **80 %** on the unit quiz (15 items, untimed first, timed on retry) unless stated; below 60 % the player recommends the remedial lesson; 60–79 % allows continuing with a spaced-review flag |
| Hours | "Video h" = recorded runtime. "Learner h" = estimated total effort including practice and review **(estimate)** |
| Bloom verbs | Outcomes use: remember, understand, apply, analyse, evaluate, create |

### 0.3 Authoring rules (all courses)

1. **Original content only** (D6, 07 §9.4): never copy ETS, Pearson, Duolingo, GMAC, College Board, Cambridge or university papers; no "recalled" real questions; no scraped prompts. Topic *categories* may be described; each prompt, passage and item is written fresh.
2. **Reference ≠ reuse.** Open resources (§8.9) are *references* we cite and learn from; we do not paste or closely paraphrase text under NC or share-alike licences into paid material.
3. **Two editions of every asset (Bangladesh-first + English international)**: see §10. One content graph, two presentation layers; the English edition is not a machine-translation afterthought — scripts are written once in English, the Bangla edition is recorded/localised by a Bangla-fluent instructor from the same learning objectives.
4. **Math** in KaTeX, **code** in Shiki, every figure has alt text and a data table (WCAG 2.2 AA).
5. **Estimated scores** only: every predicted score is labelled "estimated" (D6) with a confidence band.
6. Item metadata (required for the adaptive engine, 07 §2/§4): `exam`, `type`, `topic`, `subtopic`, `difficulty_b` (editor estimate until IRT calibration), `target_seconds`, `skills[]`, `source = original`, `reviewer`, `version`.

### 0.4 Trademark disclaimer (required wording, per ETS rule in research)

> "GRE® and TOEFL® are registered trademarks of ETS. This product is not endorsed or approved by ETS." Equivalent non-affiliation lines for PTE Academic (Pearson), Duolingo English Test (Duolingo, Inc.), GMAT™ (GMAC), SAT® (College Board) **(verify each owner's trademark policy; only ETS's was retrieved)**. Use "GRE® test preparation" (adjective + generic noun); never put these marks in product, domain, handle or ad keywords; no owner logos; no long-form test names in marketing.

---

# PART A — GRE GENERAL (P1)

## 1. GRE General — complete curriculum

### 1.1 Current exam facts the curriculum is built on

| Fact | Value | Status |
|---|---|---|
| Total time | ~1 h 58 min, no scheduled break | Researched (Test-Guide); **(verify on ets.org)** |
| Sections | Analytical Writing (**one** "Analyze an Issue" task, 30 min), then 2 Verbal + 2 Quant sections | Researched; the Argument task was removed in the Sept 2023 shortening — **verify** before launch (03 §7.2 note) |
| Verbal | Section 1: 12 Q / 18 min; Section 2: 15 Q / 23 min | Researched |
| Quant | Section 1: 12 Q / 21 min; Section 2: 15 Q / 26 min | Researched |
| Per-question time | Verbal: **~1.5 min** (18/12 = 1.50; 23/15 = 1.53). Quant: **~1.75 min** (21/12 = 1.75; 26/15 = 1.73). The brief's "~1.5 min" holds for Verbal; Quant is slightly more generous | Derived |

> **GRE timing note (use this wording everywhere):** pace Verbal at about 1.5 minutes per question and **Quant at about 1.75 minutes per question** (21 min / 12 Q and 26 min / 15 Q). Item metadata `target_seconds`: Verbal 90, Quant 105. Lessons, study plans, marketing copy and the tutor must not say "1.5 minutes per question" for Quant.
| Composition | Verbal total ≈ 7 TC, 6 SE, 14 RC; Quant total ≈ 10 QC, 13 PS (incl. multi-answer/numeric entry), 4 DI | Researched (Test-Guide); per-section split is our allocation (07 §1.4) **(verify)** |
| Adaptivity | Section-level: Verbal-1 and Quant-1 are medium; Verbal-2 / Quant-2 difficulty depends on section-1 performance | Researched; engine = low/medium/high panels (07 §4) |
| Score scale | Verbal 130–170, Quant 130–170 (1-pt steps), AWA 0–6 (half-points); no combined official score — "total" in our product = V+Q (260–340), labelled as a convenience | Researched |
| Tools | On-screen calculator in Quant; mark & review; review screen; section order of V/Q not fixed | **(verify)** |
| Fee | USD 249 from 1 Aug 2026 (ETS fee page) | Researched; date-stamp in config |

### 1.2 Learner pathways by baseline and target

Entry: the **free diagnostic** (guest allowed, results gated behind sign-up): AWA micro-sample (10 min, optional), 12 V + 12 Q items, one adaptive step. Output: estimated V and Q (each ±4 points) and a pathway.

**Pathway selection (V+Q total scale 260–340):**

| Pathway | Diagnostic (est. V+Q) | Typical profile in Bangladesh **(estimate)** | Starts at | Prerequisite help |
|---|---|---|---|---|
| **A. Foundation** | < 295 | Strong school math, weak academic English; or rusty in both | Orientation → Vocab Tier 1 → Quant M1–M3 → Verbal M1–M2 | English Foundation (doc 14) recommended in parallel for 4–6 weeks if reading speed < 120 wpm on diagnostic passage |
| **B. Builder** | 295–304 | Quant 155+, Verbal 140–148 | Verbal-first plan; Quant maintenance | Vocab daily from day 1 |
| **C. Climber** | 305–314 | Solid Q (158–163), V 148–153 | Both sections, error-log driven | Mocks from week 2 |
| **D. Optimiser** | 315–324 | Balanced, chasing 320+ | Weakness drills + strategy refinement (adaptive timing, QC speed, RC inference) | Mocks every 7–10 days |
| **E. Elite** | ≥ 325 | Targets 330 | Hard-panel practice, error elimination, AWA 5+ | Only hard-tier items; advanced mocks |

**Target × baseline hours grid (total study hours, incl. practice, mocks and review) (estimate).** Planning heuristics, not promises; recalibrate from cohort data after the first 500 learners; always show a range.

| Baseline (V+Q) → Target ↓ | < 295 | 295–304 | 305–314 | 315–324 | ≥ 325 |
|---|---|---|---|---|---|
| **300** | 80–100 h | 30–50 h | – | – | – |
| **310** | 130–170 h | 80–110 h | 40–60 h | – | – |
| **320** | 190–250 h | 140–190 h | 90–130 h | 30–50 h | – |
| **330** | 260–330 h (low odds in 12 wk; flag honestly) | 200–260 h | 160–220 h | 100–150 h | 50–80 h |

**Target definitions (what the plan optimises):** 300 ≈ V150/Q150; 310 ≈ V155/Q155; 320 ≈ V160/Q160; 330 ≈ V165/Q165 (typical, not required; plans rebalance by the diagnostic gap). Honest-claims rule: pages never promise a score; they show "learners who completed ≥ X h and 6 mocks improved by median Y" only after we have the data.

**Pathway → course mapping:**

| Pathway | Primary product | Extras |
|---|---|---|
| A | GRE Core (or above) + GRE Vocab; Vocab Tier 1–2 before Verbal M3 | English Foundation; Plus recommended for AI AWA |
| B | GRE Verbal + GRE Vocab (or the full GRE course) | Quant refresh = Quant M1–M4 |
| C/D | GRE (Core and above) | Targeted module re-entry via "weak topic" queue |
| E | GRE Core+ (skip-ahead) or Mentor | Hard-panel practice sets; 1:1 for AWA 5.5+ |

### 1.3 Skills and objective taxonomy (shared by items and lessons)

| Area | Skill codes (used as `skills[]` in the item bank) |
|---|---|
| Verbal – vocabulary | `V-LEX-core`, `V-LEX-roots`, `V-LEX-context`, `V-LEX-confusable` |
| Verbal – sentence | `V-TC-1`, `V-TC-2`, `V-TC-3`, `V-SE`, `V-LOGIC-pivot`, `V-LOGIC-charge` |
| Verbal – reading | `V-RC-main`, `V-RC-detail`, `V-RC-infer`, `V-RC-tone`, `V-RC-function`, `V-RC-select`, `V-RC-multi`, `V-RC-argument` |
| Quant – arithmetic/algebra/geometry/data | `Q-ARI-*`, `Q-ALG-*`, `Q-GEO-*`, `Q-DAT-*` (stat, prob, count, graph) |
| Quant – format | `Q-QC`, `Q-NUM`, `Q-MULTI`, `Q-DI`, `Q-CALC`, `Q-EST` |
| AWA | `W-POS`, `W-REASON`, `W-EVID`, `W-ORG`, `W-LANG`, `W-MECH` |
| Test craft | `T-PACE`, `T-ADAPT`, `T-MARK`, `T-STAMINA` |

### 1.4 GRE Verbal

**Course: GRE Verbal (`gre-verbal`)** — 20 h video target (03 §7.2), 500 practice items + vocabulary decks.

#### 1.4.1 Vocabulary system (module V1)

| Component | Design |
|---|---|
| Core list | **~1,000 high-frequency GRE-register words** in 4 tiers (03 §7.2): Tier 1 ≈ 250, Tier 2 ≈ 350, Tier 3 ≈ 300, Tier 4 ≈ 100 challenging. Word *selection* is editorial (from frequency in academic prose + our own error data); **definitions, example sentences and groupings are original** — we do not copy any publisher's list order or glosses. |
| Roots | ~150 roots/prefixes/suffixes deck (e.g., *bene-*, *mal-*, *-phobe*, *pac-*) as a separate deck; each root links to 4–8 core words |
| Card fields | word · part of speech · concise sense(s) (max 2) · **charge** (+ / – / neutral) · synonym cluster (3–5) · original example sentence · common confusable · root/etymology note (optional) · EN edition: no gloss; BD edition: **Bangla gloss** + Bangla mnemonic where helpful |
| SRS algorithm | **FSRS** scheduler (D12 C26; open algorithm; SM-2 as the only fallback, not Leitner) — implemented in `/app/vocab` (F-VOC). Daily default **15 new + all due reviews** (cap 120/day); learners can pick 10/15/25. Rating buttons: Again/Hard/Good/Easy. Leech rule: 8 lapses → card flagged and gets an alternative mnemonic lesson. |
| Context practice | Every word appears in ≥ 3 original *context items* (cloze, TC fragment, SE pair) after it is "learned"; learning = seen in context, not definition-only |
| Clusters | Words taught by **cluster** (e.g., *obstinate / intransigent / tenacious*; *laud / extol / acclaim*) and by **contrast set** (*frugal / parsimonious / thrifty* — charge differs) |
| Confusables | 60 pairs (*e.g., / i.e.*-style academic confusions such as *disinterested / uninterested*, *censure / censor*) |
| Weekly cadence | 5 days new+review, 1 day review-only, 1 day weekly quiz (30 items from learned words) |
| Targets | Core 1,000 by week 10 at 15/day for 70 days **(estimate)**; accelerated plans use 25/day |
| Metrics | retention at 7/30 days; words learned; context-item accuracy vs flashcard accuracy (divergence flags "recognition without usage") |

Module V1 (Vocabulary system): **3 units, 14 lessons**.
| Unit | Lessons (count) | Content | Objective (measurable) |
|---|---|---|---|
| V1.1 How to learn words (5) | Why GRE vocab is contextual · SRS in 10 minutes · Charge & tone · Cluster learning · Using the Bangla/English glosses well | Method + app tour | Learner sets daily quota and completes 3 consecutive study days; can classify charge of 10 sample words with ≥ 80 % |
| V1.2 Roots, prefixes, suffixes (5) | Latin roots · Greek roots · Negation prefixes · Suffix families · Word-detective drill | 150-root deck | Infers meaning of 10 unseen words from morphology at ≥ 70 % |
| V1.3 Words in the wild (4) | Reading academic prose for new words · Building a personal deck (≤ 10 words/wk) · Confusables · Weekly review ritual | Reading habits | Adds and correctly defines 10 self-sourced words; weekly quiz ≥ 80 % |

#### 1.4.2 Sentence structure and logic (module V2) — **2 units, 8 lessons, 40 items**

| Unit | Lessons | Objective |
|---|---|---|
| V2.1 Parsing sentences (4) | Clauses & subordination · Reading long sentences (bracket the clauses) · Pronoun & reference · Parallelism and contrast structures | Paraphrases 10 complex sentences in ≤ 15 words with ≥ 80 % accuracy |
| V2.2 Logical signposts (4) | Pivot words (but, however, although, yet) · Support words (and, moreover, since, thus) · Negation & double negatives · Charge-tracking | Identifies pivot/support direction in 15 sentences at ≥ 90 % in ≤ 25 s each |

#### 1.4.3 Text Completion (module V3) — **3 units, 12 lessons, 90 items**

Strategy (taught as a repeatable 5-step routine, "P-P-C-T-C"):
1. **Predict** — cover the options; read the sentence; write a word or short phrase for each blank (in your head or on the scratchpad).
2. **Pivot** — mark pivot/support signals; decide whether the blank continues or reverses the clue.
3. **Charge** — assign + / – / neutral to each blank.
4. **Test** — eliminate options that contradict charge or fail the prediction; plug the survivors.
5. **Check** — re-read the full sentence with the final choice(s); for 2–3 blanks confirm the *pair/triple* is coherent (scoring is all-or-nothing in our engine and, per research, on the real test **(verify)**).

| Unit | Lessons | Items | Objective |
|---|---|---|---|
| V3.1 One-blank (4) | Clue-finding · Definition/restatement clues · Contrast clues · Cause–effect and example clues | 30 (5 options each) | ≥ 80 % in ≤ 75 s average |
| V3.2 Two-blank (4) | Solve the easier blank first · Dependent blanks · Tone consistency · When both blanks reverse (double pivot) | 35 (3 options per blank) | ≥ 75 % in ≤ 90 s average |
| V3.3 Three-blank & hard sentences (4) | Paragraph-length stems · Abstract vocabulary traps · Process of elimination under uncertainty · Timed mixed set | 25 | ≥ 70 % in ≤ 120 s average; learner writes a prediction before options in ≥ 90 % of logged attempts |

#### 1.4.4 Sentence Equivalence (module V4) — **2 units, 8 lessons, 70 items**

Strategy: SE = one blank, six options, pick **two** that produce sentences with the **same meaning**; both required.
- Predict first (same as TC).
- **Pair-check**: group the six options into synonym pairs *before* choosing. Typically two pairs are decoys (fit grammatically, not the meaning), one pair is correct, others are singletons. A strong single word with **no partner** is almost never correct.
- **Meaning-equivalence, not dictionary-synonymy**: pairs may differ in connotation but must yield near-identical sentences; test by swapping each into the sentence and paraphrasing.
- When stuck: eliminate the options with the wrong charge, then guess among pairs (no penalty for guessing).

| Unit | Lessons | Items | Objective |
|---|---|---|---|
| V4.1 Pair-check method (4) | Predict-then-pair · Spotting decoy pairs · Near-synonym nuance · Single strong word traps | 35 | ≥ 80 % at ≤ 65 s |
| V4.2 Vocabulary under pressure (4) | Tier 3–4 words in SE · Rare-word elimination by roots · Timed mixed TC/SE sets · SE error review | 35 | ≥ 75 % at ≤ 65 s; error-log shows < 20 % "vocabulary gap" errors by end of unit |

#### 1.4.5 Reading Comprehension (module V5) — **5 units, 24 lessons, 180 items (36 passages)**

Passage inventory: 36 original passages — 12 short (1 paragraph, 60–100 words), 18 medium (2–3 paragraphs, 150–300 words), 6 long (4+ paragraphs, 350–450 words) **(verify against the current official length distribution)**; topics: natural science, social science, humanities, business/policy; each passage tagged with structure type (argument, comparison, problem–solution, chronological, theory–critique).

Strategy pillars:
- **Passage mapping**: after reading, write a 5–8-word label per paragraph (what it *does*: "poses problem", "counterexample", "author's view"); one-line overall thesis; mark tone words.
- **Argument structure**: identify claim, evidence, assumptions, counter-claims, author vs cited views ("some scholars argue… but…" — whose view?).
- **Inference limits**: a valid inference is *strongly supported*, not merely possible; reject extreme words (*always, never, only*) unless the text uses them; ban outside knowledge; separate "stated" / "must follow" / "could be true".
- **Question families & tactics**: main idea · detail · inference · author's attitude/tone · function of sentence/paragraph · vocabulary in context · multiple-answer ("select all that apply" — judge each option independently; engine uses 3 options **(verify)**) · **select-in-passage** (click the sentence that does X; tactic: identify the function first, then scan sentence by sentence; engine pre-segments sentences).
- **Pace**: read once with a map (≈ 40 % of the time budget for the passage) then answer; revisit text for detail/function questions only.

| Unit | Lessons | Items | Objective |
|---|---|---|---|
| V5.1 Active reading and mapping (5) | Reading for structure · Paragraph labels · Thesis in 10 words · Tone & attitude words · Speed-building (wpm drills; target ≥ 200 wpm with 75 % comprehension) | 30 | Maps 6 passages with ≥ 80 % overlap with the editor map; reads ≥ 200 wpm **(estimate target)** |
| V5.2 Main idea, detail, function (5) | Main-idea traps (too narrow / too broad) · Detail look-ups · Function of a sentence · Function of a paragraph · Vocabulary in context | 40 | ≥ 80 % with ≤ 1.3 min/item on medium passages |
| V5.3 Inference and tone (5) | Strict inference · Extreme-word elimination · Author's attitude vs cited authors · Implication and application · "Could be true" vs "must be true" | 40 | ≥ 75 % inference accuracy; error log shows ≤ 25 % "over-inference" errors |
| V5.4 Multi-answer and select-in-passage (4) | Evaluating each option independently · Partial-credit trap (all-or-nothing) · Select-in-passage tactics · Sentence function drills | 35 | ≥ 70 % on multi-answer, ≥ 75 % on select-in-passage |
| V5.5 Long passages and mixed sets (5) | Long passage triage · Dense science passages (without domain knowledge) · Humanities & social-science rhetoric · Mixed set 1 (timed) · Mixed set 2 (timed) | 35 | Completes a 4-passage/14-item set in ≤ 21 min at ≥ 70 % |

#### 1.4.6 Critical reasoning / paragraph-argument questions (module V6) — **2 units, 8 lessons, 50 items**

The GRE's RC includes short *argument-style* passages (paragraph arguments) alongside prose; no stand-alone CR section as in GMAT. We teach the argument toolkit inside RC.

| Unit | Lessons | Items | Objective |
|---|---|---|---|
| V6.1 Anatomy of an argument (4) | Premise / conclusion / assumption · Gap-finding · Analogy and causal arguments · Statistical and sampling flaws | 25 | Labels premise, conclusion, key assumption in 12 arguments at ≥ 80 % |
| V6.2 Question tasks (4) | Strengthen/weaken · Identify the assumption · Role of a statement ("boldface-style") · Evaluate/resolve a paradox | 25 | ≥ 70 % at ≤ 1.5 min/item |

#### 1.4.7 Timed sectionals and adaptive pacing (module V7) — **1 unit, 6 lessons, ~70 items (timed drills; 4 half-length and 2 full-length Verbal sectionals)**

| Lessons | Objective |
|---|---|
| Section-1 strategy: accuracy first · Allocating 18 and 23 minutes · Mark-and-return protocol (one pass, flag ≤ 3) · Guess policy (no penalty — never leave blanks) · Verbal stamina · Post-sectional error-log review | Finishes 12 Q in 18 min and 15 Q in 23 min on ≥ 2 sectionals with ≥ 75 % on S1-type and ≥ 70 % on S2-type |

**Verbal module totals:** 7 modules · 18 units · **80 lessons** · ~20 h video · **~500 items** (V2 40 + V3 90 + V4 70 + V5 180 + V6 50 + V7 70) + 1,000 word cards + 150 root cards + ~180 context items (the context items live in vocabulary decks, not the 500).

### 1.5 GRE Quant

**Course: GRE Quant (`gre-quant`)** — 25 h video, 600 items. Math in KaTeX; on-screen calculator in practice (engine `calculator: 'basic_gre'`, 07 §1.4).

#### 1.5.1 Syllabus

| Module | Unit (lessons) | Topics | Items | Objective |
|---|---|---|---|---|
| **Q1 Arithmetic & number properties** (3 units, **14 lessons**, 100 items) | Q1.1 Integers & divisibility (5): odd/even, primes, factors/multiples, GCD/LCM, remainders · Q1.2 Fractions, decimals, number line (5): operations, comparing, absolute value, estimation · Q1.3 Sequences & properties (4): arithmetic/geometric sequences, consecutive integers, digit problems, patterns | | | ≥ 85 % unit quizzes; factorises integers < 200 in < 20 s |
| **Q2 Ratios, percent, exponents, roots** (3 units, **10 lessons**, 80 items) | Q2.1 Ratio, proportion, rate (4): ratios, variation, speed–time–distance, work rate · Q2.2 Percent (3): percent change, successive %, interest (simple/compound), mixtures · Q2.3 Exponents & roots (3): laws of exponents, radicals, scientific notation | | | ≥ 80 % in ≤ 90 s per PS item |
| **Q3 Algebra** (4 units, **16 lessons**, 110 items) | Q3.1 Linear equations & systems (4) · Q3.2 Quadratics (4): factoring, formula, completing the square, discriminant · Q3.3 Inequalities & absolute value (4) · Q3.4 Functions & coordinate geometry of lines (4): function notation, graphs, slope, intercepts, translations | | | Solves a 2-step algebra word problem in ≤ 90 s at ≥ 80 % |
| **Q4 Geometry** (4 units, **16 lessons**, 110 items) | Q4.1 Lines & angles (3): parallel lines, polygon angle sums · Q4.2 Triangles (5): Pythagorean, special right triangles (30-60-90, 45-45-90), similarity, area, triangle inequality · Q4.3 Quadrilaterals & circles (5): area/perimeter, circle arcs, sectors, chords, inscribed angles, tangents · Q4.4 Solids & coordinate geometry (3): volume/surface area, cylinder/cone/sphere formulas given as needed **(verify which formulas the exam supplies)**, distance/midpoint | | | ≥ 80 %; sketches a diagram for 100 % of geometry items with no figure |
| **Q5 Data analysis** (4 units, **16 lessons**, 100 items) | Q5.1 Descriptive statistics (5): mean, median, mode, range, quartiles/IQR, weighted average, **standard deviation** (concept: spread; compute for ≤ 5 values; effect of adding constants/scaling; compare spreads *without computing*), outliers · Q5.2 Distributions (3): **normal distribution** (symmetry, 68–95–99.7 approximations, z-scores, percentiles), skew · Q5.3 Probability (4): equally likely outcomes, complement, independent/dependent events, conditional, mutually exclusive, expected value (basic) · Q5.4 Counting & graphs (4): fundamental counting principle, permutations, combinations, Venn/set overlap, reading graphs (bar, line, pie, histogram, box plot, scatter, tables) | | | ≥ 75 % on probability/counting; compares two datasets' SD qualitatively with ≥ 85 % |
| **Q6 QC & Numeric Entry tactics** (2 units, **10 lessons**, 60 items) | Q6.1 Quantitative Comparison (6): compare, don't solve · plug-in numbers · ZONEF · simplify-both-sides · when D is possible · QC with figures · Q6.2 Numeric Entry & multi-answer (4): precision rules · fractions · rounding · "select all" logic | | | ≥ 80 % QC at ≤ 60 s average |
| **Q7 Speed, estimation, calculator** (1 unit, **6 lessons**, 20 items) | Estimation & benchmarks · Back-solving from options · Strategic guessing · Calculator discipline · Mental math patterns (squares, fractions-to-percent) · Pace checkpoints | | | Meets time targets in §1.5.4 |
| **Q8 Timed sectionals** (1 unit, **4 lessons**, 20 items + 2 sectional sets) | Section-1 strategy · Allocating 21 and 26 minutes · Skip-and-return protocol · Quant error-log review | | | 12 Q in 21 min and 15 Q in 26 min at ≥ 75 % / ≥ 70 % |

**Quant totals:** 8 modules · 22 units · **92 lessons** · ~25 h video · **600 items** (100+80+110+110+100+60+20+20).

#### 1.5.2 Quantitative Comparison strategies (taught in Q6.1)

Format reminder: two quantities, 4 fixed options — A greater, B greater, equal, cannot be determined (options never shuffled, 07 §2.4).

| Tactic | How it works | When it fails |
|---|---|---|
| Compare, don't solve | Reduce to a *difference* or *ratio*; never compute both fully if one comparison step decides | Over-simplifying invalid steps (multiplying by a variable of unknown sign) |
| Simplify both sides | Add/subtract/multiply by the same positive quantity | Sign unknown → inequality may flip |
| **Plug-in numbers + ZONEF** | Try the "interesting" number classes: **Z**ero, **O**ne, **N**egative, **E**xtreme (very large/small), **F**raction (between 0 and 1) — if two different values give different relationships, answer **D** | A passing set of tests proves nothing; you need a *consistent* result across all classes or a proof |
| Answer-D logic | D is only possible when a variable remains unconstrained; if both quantities are pure numbers, D is impossible | Forgetting that figures "not drawn to scale" may allow D |
| Figure caution | Use only given info, not appearance | – |
| Back-substitute from given info | Choose numbers that satisfy the "given information" box first | Using numbers that violate constraints |

#### 1.5.3 Numeric entry precision rules (taught in Q6.2; encoded in engine rational-equality scoring, 07 §2.4)

| Rule | Detail |
|---|---|
| Follow rounding instructions exactly | Round only at the last step; "nearest tenth" means one decimal place; the engine accepts a range for such items |
| Fractions | Two boxes (numerator/denominator); equivalent fractions score equal in our engine (0.5 = 1/2 = 2/4) — the real exam accepts equivalent forms **(verify; teach "reduce anyway")** |
| Decimals | Enter as many digits as the problem requires; no trailing text, no units, no commas; leading minus sign for negatives |
| Percent | Enter the number only (the unit label is shown beside the box), e.g., `25` not `25%` unless the box states otherwise |
| Don't mix | Do not enter a fraction in a single decimal box or vice versa; use the box type shown |
| Check magnitude | Re-read the question stem; verify units and whether answer should be an integer |
| Calculator transfer | Use the calculator's transfer-display feature if present **(verify)** to avoid typing errors |

#### 1.5.4 Calculator discipline and timing

| Topic | Rule |
|---|---|
| When to use | Long multiplication/division, decimals, square roots, percent chains; **not** for algebraic reasoning or anything solvable by simplification faster |
| Order of operations | The GRE on-screen calculator follows standard precedence **(verify)**; practise with parentheses; check intermediate results |
| Rounding | Keep full precision until the final step |
| Sanity check | Estimate first; compare to calculator result |
| Time budget | Average **~1.75 min**; QC target 1.0–1.25 min; PS 1.5–2.0; multi-answer 1.75; numeric entry 2.0; DI set (2–3 Q) 5.0 per set (hedged **(estimate)**) |
| Checkpoints | S1 (12 Q / 21 min): Q4 by 7:00, Q8 by 14:00; S2 (15 Q / 26 min): Q5 by 9:00, Q10 by 17:30 **(estimate)** |
| Skip rule | If no path in 30 s, flag and move on; return only if ≥ 2 min remain |

#### 1.5.5 Data interpretation sets

DI = a data stimulus (table/bar/line/pie/scatter/box plot; 1–3 exhibits) with 2–3 linked questions (07 `DataSetStimulus`). Skills: read axes and units, percent vs percent-point, percent of total, estimated values from graphs, mixing exhibits. Tactics: read the title/axes/units first; answer in the order that minimises re-reading; use "view as table" toggle (accessibility feature). Practice target: 40 DI sets across Q5.4 and Q7 (80–120 items inside the 600 total, tagged `Q-DI`).

### 1.6 Analytical Writing (AWA) — Issue task

**Fact check (verify):** Research confirms the current format has **one** task, "Analyze an Issue", 30 minutes, scored 0–6 in half-point steps. The older "Analyze an Argument" task was dropped in the Sept 2023 shortening. 03 §7.2 already flags this. Our curriculum, rubric (`gre_awa_v1`) and engine contain **Issue only**; add a pre-launch task to re-confirm on ets.org.

**Course: GRE AWA (`gre-awa`)** — 5 h video, **40 original Issue prompts**, **10 annotated model essays**, 10 AI evaluations (GRE AWA Coaching course = 12 credits per 17 §3.4; the Core pool is 6). **28 lessons.**

| Module | Lessons | Content | Objective |
|---|---|---|---|
| A1 Scoring and rubric (4 lessons) | What the 0–6 scale rewards · The five criteria (below) · Reading a 3 vs a 5 vs a 6 · Self-scoring with the rubric | Rubric paraphrased from public descriptors; no copied ETS text (research: rubric licensing not retrieved) | Scores 5 sample essays within ±0.5 of editor score on ≥ 4 |
| A2 Planning (4) | Decoding the prompt · Taking a position (and nuance) · Brainstorm 3 angles in 3 minutes · 8-minute outline | | Produces a complete outline in ≤ 8 min for 5 prompts |
| A3 Structure, reasoning, evidence (6) | Thesis · Developing a paragraph (claim → reason → example → link) · Choosing examples (history, science, policy, personal, hypothetical) · Counter-arguments and qualification · Introductions/conclusions · Coherence | | Each body paragraph has claim + reasoning + specific example (rubric-checked) |
| A4 Language and mechanics (4) | Precision & word choice · Sentence variety · Grammar traps for Bangla-speaking writers (articles, prepositions, tense) · Proofreading in 3 minutes | | ≤ 1 major grammar error per 100 words in timed essays |
| A5 Timed practice (6) | Six timed 30-min essays, each followed by AI feedback → revision lesson | | Reaches target score ± 0.5 on 2 consecutive essays |
| A6 Model essays (4) | Annotated 3 / 4 / 5 / 6 comparisons; "what moved this essay up a point" | | Identifies ≥ 3 differentiating features per pair |

**Issue essay approach:**

| Element | Guidance |
|---|---|
| Task | Present a claim and instructions (agree/disagree, extent, conditions); write a reasoned, developed response |
| Time plan (30 min) | 2 min decode · 5 min outline (position, 2–3 reasons, examples, counter) · 20 min write · 3 min proofread |
| Length | No official length target; aim for ~450–650 words typed in 20 min **(estimate)** |
| Structure | Intro (context, thesis with nuance) · 2–3 body paragraphs (each: reason + specific example + explicit link to thesis) · a paragraph or sentence-level counter-view with response · concise conclusion. **We teach a flexible framework, not a memorised template** — essays that are formulaic and generic score lower than specific, reasoned ones. |
| Examples | Specific and varied (historical events, scientific developments, policy cases, concrete scenarios); explained, not name-dropped; never fabricate statistics |
| Reasoning | Explain *why* and *under what conditions*; consider limits and exceptions; avoid absolute claims |
| Language | Clarity over decoration; correct but varied syntax; minor errors tolerated if meaning is clear |
| Typing | The real editor has basic cut/paste/undo, no spell-check **(verify)**; practise in a no-spellcheck editor |

**Scoring guide criteria (paraphrased; AI rubric `gre_awa_v1`, see 07 §7.3):**

| Criterion | What a strong response does | Score band signal |
|---|---|---|
| Position and task | Takes and sustains a clear position that addresses all parts of the instructions | 4: clear but unevenly addresses instructions; 6: insightful and fully responsive |
| Reasoning and development | Provides logically sound reasoning with depth, considers complexity | 3: thin or generic; 5–6: well-developed, nuanced |
| Evidence | Specific, relevant, convincing examples | 2: vague; 5–6: precise and persuasive |
| Organisation and coherence | Logical progression, clear transitions, focused paragraphs | 6: seamless |
| Language and mechanics | Fluent, varied, accurate; errors do not impede meaning | 6: virtually error-free |

AWA tier mapping (17 §2.2b): Free = 2 credits at sign-up + 1 per month; Core = 6 credits; Plus/Live/Mentor = 20 credits; human AWA reviews: Plus 2, Live 4, Crash 2, Mentor 6; Mentor also has 3 × 45-min 1:1 sessions (essay clinics happen inside them).

### 1.7 Section-adaptive test strategy (taught in module "Timed practice and pacing")

**Lessons (8):** (1) How section-level adaptivity works, (2) Why Section 1 matters, (3) Pacing S1 vs S2, (4) Mark-and-review without wasting time, (5) Reading the room — what difficulty signals mean (and why you can't know), (6) Stamina across 4 sections + AWA, (7) Test-day routine, (8) Handling panic / recovering after a bad section.

| Principle | Detail |
|---|---|
| Structure | S1 (12 Q, medium). Performance in S1 routes S2 to low/medium/high difficulty; S2 has 15 Q and a larger share of the score weight at high difficulty **(verify with ETS description: scoring uses both sections; harder S2 raises score ceiling)** |
| Implication | Accuracy in S1 matters disproportionately: **spend the full time budget on S1**, avoid careless errors, answer every question |
| Do not try to "read" difficulty | Learners misinterpret difficulty feel; the engine's hidden tier is not shown in exam mode (07 §4). Teach: "S2 felt hard" is *good news* statistically but not a certainty |
| No negative marking | Guess every unanswered item before time expires |
| Mark & review | Flag ≤ 3 items per section; use remaining time for flagged items; cannot return to earlier sections |
| Pacing | Never sacrifice more than 30 s above the average on one item; S2 pace slightly faster in Verbal (23/15) and Quant (26/15) |
| Mock realism | Full mocks use the same router (low/medium/high panels) and show "your S2 tier" **only on the post-test report** |

### 1.8 Mock cadence and error-log method

**Mock cadence by pathway (full mocks; Core has 4, Plus 10 — see §2):**

| Pathway/plan | Mocks | When |
|---|---|---|
| 4-week | 3 | Day 1 diagnostic (counts as 0), Week 1 end, Week 3 start, Week 4 mid |
| 8-week | 5 | Weeks 1, 3, 5, 7, 8 |
| 12-week | 6–7 | Weeks 2, 4, 6, 8, 10, 11, 12 |
| Always | 1 sectional pair per week between mocks | Alternate V pair and Q pair |
| Never | Two full mocks in 3 days (Core); recovery time for review ≥ 2× mock length |

Mock review protocol: (1) take under exam conditions (full-screen, timed); (2) next day review every error and every >1.5×-time item; (3) update error log; (4) write 3 "rules for next mock"; (5) Plus+ tiers: AI summary of recurrent mistakes.

**Error-log method** (feature `F-ERR`, learner-facing table in `/app/progress`; auto-populated, learner adds a reason):

| Field | Values |
|---|---|
| Item ref / skill code / source (practice, mock, sectional) | auto |
| Result | wrong / right-slow (>1.5× target) / guess-right |
| Error type | `knowledge gap` · `vocabulary gap` · `misread` · `calculation` · `strategy/trap` · `time pressure` · `careless` · `overthinking` |
| Root cause (1 line) | learner text |
| Fix | specific action (e.g., "add 5 words to deck", "redo Q4.2 lessons 3–4", "rule: always plug 0, 1, –1 on QC") |
| Re-attempt | auto-scheduled at +3 days and +14 days; closes when correct twice, in time |
| Review cadence | Weekly error review (30 min); monthly pattern review (error-type mix) |

Targets: unique-error recurrence < 15 % by week 6; "careless" share < 20 %.

### 1.9 Measurable objectives per unit (summary)

All unit objectives are listed in §1.4–§1.6 tables. Platform rule: each unit page shows its objective, mastery threshold and median time; a unit is "mastered" when the learner passes the unit quiz at the threshold within two attempts; "course complete" requires ≥ 85 % of units mastered and ≥ 4 mocks (Core) for the certificate (§9 certificate rules).

---

## 2. GRE tier-by-tier material map (D10)

Tier counts follow D10 and **17 §2.2/§2.2b (GRE column), which win on any mismatch**. `ai_credit` = one pool (D12 C1); GRE AWA evaluation = 1 credit. GRE has no Speaking section: the speaking club is replaced by small-group problem-solving clinics and there is no human speaking mock.

| Resource | **Free** | **Core** | **Plus** | **Live (8-wk)** | **Live Crash (4-wk)** | **Mentor** |
|---|---|---|---|---|---|---|
| Diagnostic | Yes (guest) | Yes + re-test | Yes + re-test | Yes | Yes | Yes |
| Recorded lessons | ~12 sample lessons (1–2 per module, ≈ 20 %, YouTube funnel overlap) | All **237** (full GRE course) / à-la-carte courses | All | All | All | All |
| Question bank | ~120 items (sampler) | **1,500** items | 1,500 + extra hard-tier panel (+300) | Plus | Plus | Plus |
| Vocabulary | Tier 1 (250 words) + roots sampler | All 1,000 words + roots | All | All | All | All |
| Full mocks (section-adaptive) | – (1 sectional pair) | **4** | **10** (5 at launch, 10 by 2027-08-15) | 10 | 10 | 10 |
| Sectional mocks | 1 | 8 | 20 | 20 | 20 | 20 |
| `ai_credit` pool (AWA evaluations) | 2 at sign-up + 1 / month | **6** | **20** (max 6 evaluations/day) | 20 | 20 | 20 |
| Human essay (AWA) reviews, 72 h SLA | – | – | **2** | **4** | **2** | **6** |
| Live classes | – | – | Weekly live group Q&A, 60 min, on Zoom from P1 (D12 C20) | **24 sessions** (8 × 3; 52 h; 18 L8) | **12 sessions** | Same as Live (24) |
| Problem-solving clinics (small group) | – | – | – | 6 | 3 | 6 |
| 1:1 sessions | – | – | – | – | – | **3 × 45 min** with named mentor (more via add-on packs) |
| Study plan | Generic | Template plans (4/8/12), generated read-only plan (P1) | Adaptive rescheduling (P2) | Cohort plan + homework tracker | Same | Mentor-customised |
| Community | Official moderated Facebook group / Discord (P1) | Same | Same + priority answers | Mentor group chat | Same | Priority |
| Certificate | – | Completion cert (PDF + `/verify/[code]`) | Same | Same + attendance | Same | Same |
| Access window | Unlimited free content | **183 days** | **183 days** | 365 days | 365 days | 365 days |
| Guarantee | – | 7-day money-back | 7-day money-back + Target Promise (free 3-month extension) | Refund before class 3 | Before class 2 | Progress Promise (free re-enrolment) |
| Phase | P1 | P1 | P1 | P1 pilot (manual Zoom) / P2 scale | P1 pilot / P2 | P1 |

**Notes / flags for pricing and ops:**
1. D10 says Plus has 10 full mocks; the course ships with **5 full adaptive mocks** at launch. Plan: author 5 for P1; ship Plus with "5 now, 10 by 2027-08-15" (D10/17 pattern) and state this honestly on the pricing page. Authoring cost per mock form ≈ **114 scored items** (12 + 12 medium S1 items; 3 × 15 verbal and 3 × 15 quant S2 difficulty panels) + 1 AWA prompt — a heavy item-bank need (10 mocks = 1,140 items), see 16.
2. Human essay reviews and 1:1 consume instructor/grader capacity (07 §7.10; role `grader`, 2FA); pricing must reflect per-review cost (17).
3. Add-ons (D10): mock packs, AI credits, human review packs available to any tier.

---

## 3. GRE study plans (4 / 8 / 12 weeks)

Hours are per week; "S" = full-time student, "WP" = working professional. All plans assume diagnostic on day 0, daily vocabulary (15–20 min counted inside hours), a weekly error-log review (30 min) and are **(estimate)** — tune with the target × baseline grid.

### 3.1 Plan overview

| Plan | Best for | S: hours/week → total | WP: hours/week → total | Mocks |
|---|---|---|---|---|
| **4 weeks** (intensive) | Baseline within ~10 points of target, or retake with prior prep | 25 → 100 h | 14 → ~56 h (weekday 1.5 h + weekend 4 h) | 3 full + 4 sectional |
| **8 weeks** (standard) | Gap 10–20 points, common | 15 → 120 h | 9 → ~72 h (weekday 1 h + weekend 4 h) | 5 full + 8 sectional |
| **12 weeks** (steady) | Gap 20+ points, Foundation pathway, busy professionals | 12 → 144 h | 7 → ~84 h (weekday 45 min + weekend 3.5 h) | 7 full + 12 sectional |

### 3.2 4-week plan (S 25 h/wk; WP 14 h/wk)

| Week | Verbal | Quant | AWA | Mock / review | S h | WP h |
|---|---|---|---|---|---|---|
| 1 | V1 (vocab tiers 1–2), V2, V3.1–3.2 | Q1–Q2 targeted (only weak topics from diagnostic), Q6.1 QC | A1–A2 (rubric + planning) | Diagnostic review; sectional pair end of week | 25 | 14 |
| 2 | V4, V5.1–5.2 | Q3 Algebra, Q4 Geometry (weak topics) | A3 + 1 timed essay (AI) | **Mock 1** (Sat), review (Sun) | 25 | 14 |
| 3 | V5.3–5.4, V6 | Q5 Data analysis, Q6.2, Q7 | A5 timed essay ×2 | **Mock 2** mid-week; sectionals | 25 | 14 |
| 4 | V7 timed sectionals, vocabulary review | Q8 timed sectionals, error-log drills | 1 timed essay | **Mock 3** (day 24), final-sprint plan, test-day routine | 25 | 14 |

### 3.3 8-week plan (S 15 h/wk; WP 9 h/wk)

| Week | Focus | Verbal | Quant | AWA | Mock |
|---|---|---|---|---|---|
| 1 | Orientation + foundations | V1 launch (15 words/day), V2 | Q1, Q2 | A1 | Diagnostic |
| 2 | Core skills | V3 TC | Q3 Algebra | A2 | Sectional (Q) |
| 3 | Core skills | V4 SE, vocab Tier 2 | Q4 Geometry | A3 + essay 1 | **Mock 1** |
| 4 | Reading | V5.1–5.2 | Q5.1–5.2 stats | essay 2 | Review + sectional (V) |
| 5 | Reading + data | V5.3–5.4, V6.1 | Q5.3–5.4, Q6 | A4 | **Mock 2** |
| 6 | Timed work | V6.2, V5.5 | Q7, DI sets | essay 3 | Sectional pair |
| 7 | Adaptive tactics | V7 sectionals, vocab Tier 3–4 | Q8 sectionals | essay 4 | **Mock 3** |
| 8 | Sprint | Weak-topic drills | Weak-topic drills | essay 5 | **Mock 4** (day -3), light review, test-day plan |

### 3.4 12-week plan (S 12 h/wk; WP 7 h/wk)

| Weeks | Focus | Verbal | Quant | AWA | Mocks |
|---|---|---|---|---|---|
| 1–2 | Foundation | V1 (build habit), V2 | Q1, Q2 | A1–A2 | Diagnostic; sectional (week 2 end) |
| 3–4 | Question types | V3, V4 | Q3 | A3 + essay 1 | **Mock 1** (week 4) |
| 5–6 | Reading, geometry | V5.1–5.3 | Q4 | essay 2 | **Mock 2** (week 6) |
| 7–8 | Data analysis + arguments | V5.4–5.5, V6 | Q5, Q6 | A4, essay 3 | **Mock 3** (week 8) |
| 9–10 | Timing | V7, vocab 1,000 complete | Q7, Q8 | essays 4–5 | **Mock 4** (week 10) |
| 11 | Targeted fixes | weak-topic queue | weak-topic queue | essay 6 | **Mock 5** |
| 12 | Taper | light review, error-log | light review | proofread drill | **Mock 6** (day -4); rest day before exam |

Professional adjustment rules: shift heavy mocks to weekends; use commute-time vocab; when a week is missed, the Plus personalised plan (P2) pushes content forward (never compresses mocks).

---

# PART B — OTHER ENGLISH-LANGUAGE TESTS

## 4. PTE Academic (P2)

### 4.1 Skills map

PTE Academic reports Overall, Listening, Reading, Speaking, Writing on a 10–90 scale (research: Pearson PTE). Beyond the four skills, scoring also yields *enabling skills* (grammar, oral fluency, pronunciation, spelling, vocabulary, written discourse) **(verify)**. Scoring is computer-based; humans double-mark seven task types (Describe Image, Retell Lecture, Summarize Written Text, Write Essay, Summarize Spoken Text, Summarize Group Discussion, Respond to a Situation); pronunciation and oral fluency are AI-only (research).

### 4.2 All 22 task types

Timings from research (PrepEx, third-party) — **(verify with Pearson; the research's Part 1 total of 76–84 min conflicts with Pearson's ~2 h overall; store timings as config)**. Skill credit: P = primary, S = secondary **(verify against Pearson's score guide)**. Reserved engine ids per 07 §2.6.

| # | Task (07 id) | Part | Timing (research) | Credits | Strategy summary |
|---|---|---|---|---|---|
| 1 | Read Aloud (`pte.read_aloud`) | Speaking & Writing | prep 30–40 s | Speaking P (oral fluency, pronunciation), Reading S | Preview text, mark pauses, steady pace; never stop to correct |
| 2 | Repeat Sentence (`pte.repeat_sentence`) | S&W | audio 3–9 s, answer 15 s | Speaking P, Listening S | Chunk-based memory; reproduce content words in order |
| 3 | Describe Image (`pte.describe_image`) | S&W | prep 25 s, speak 40 s | Speaking P (content, fluency, pronunciation) | Framework: intro → key features → comparison/trend → implication |
| 4 | Re-tell Lecture (`pte.retell_lecture`) | S&W | prep 10 s, speak 40 s | Speaking P, Listening S | Note keywords (topic, 3 key points, conclusion); paraphrase |
| 5 | Answer Short Question (`pte.answer_short_question`) | S&W | 10 s | Speaking S, Listening S (vocabulary) | One- or two-word answers; general knowledge/semantic |
| 6 | Summarize Group Discussion (`pte.summarize_group_discussion`) — **new 2025** | S&W | prep 10 s, speak 2 min | Speaking P, Listening S | Note speakers' positions; summary: topic, viewpoints, agreement/disagreement |
| 7 | Respond to a Situation (`pte.respond_to_situation`) — **new 2025** | S&W | prep 10 s, speak 40 s | Speaking P (appropriacy, content) | Identify audience/purpose; polite register; structured response |
| 8 | Summarize Written Text (`pte.summarize_written_text`) | S&W | 10 min | Reading S+Writing P | One sentence (5–75 words **verify**), main idea + support, grammar |
| 9 | Write Essay (`pte.write_essay`) | S&W | 20 min, 200–300 words | Writing P | Structured essay; address prompt; vocabulary & spelling accuracy |
| 10 | Reading & Writing: Fill in the Blanks (dropdown) (`pte.rw_fill_blanks_dropdown`) | Reading | – | Reading + Writing (integrated) | Collocation/grammar clues |
| 11 | MC Multiple Answers (Reading) (`pte.r_mc_multi`) | Reading | – | Reading | Negative marking likely **(verify)**; select only well-supported options |
| 12 | Re-order Paragraphs (`pte.reorder_paragraphs`) | Reading | – | Reading | Topic sentence, cohesive links; pairwise adjacent scoring (07) |
| 13 | Reading: Fill in the Blanks (drag) (`pte.r_fill_blanks_drag`) | Reading | – | Reading | Context first |
| 14 | MC Single Answer (Reading) (`pte.r_mc_single`) | Reading | – | Reading | Main idea/detail |
| 15 | Summarize Spoken Text (`pte.summarize_spoken_text`) | Listening | audio 60–90 s, 10 min total | Listening P, Writing S | 50–70 words **(verify)**, note-taking system |
| 16 | MC Multiple Answers (Listening) (`pte.l_mc_multi`) | Listening | audio 80–120 s | Listening | Negative marking likely **(verify)** |
| 17 | Fill in the Blanks (type-in) (`pte.l_fill_blanks_type`) | Listening | audio 30–60 s | Listening + Writing (spelling) | Type while listening; spelling counts |
| 18 | Highlight Correct Summary (`pte.highlight_correct_summary`) | Listening | audio 30–90 s | Listening + Reading | Match main idea; reject details-only options |
| 19 | MC Single Answer (Listening) (`pte.l_mc_single`) | Listening | audio 30–60 s | Listening | Gist/detail |
| 20 | Select Missing Word (`pte.select_missing_word`) | Listening | audio 20–70 s | Listening | Predict the final word/phrase |
| 21 | Highlight Incorrect Words (`pte.highlight_incorrect_words`) | Listening | audio 15–50 s | Listening + Reading | Follow transcript while listening; do not over-click (penalty) |
| 22 | Write from Dictation (`pte.write_from_dictation`) | Listening | audio 3–5 s | Listening + Writing (spelling) | Type full sentence; each correct word scores |

Unscored: **Personal Introduction** (recorded and sent to institutions) — practised in a no-score lesson.

**Integrated scoring takeaway (taught in module P1):** one response can feed two skills (e.g., Write from Dictation → Listening + Writing; Read Aloud → Speaking + Reading). So "weak Writing" may be fixed via Listening-linked typed tasks. The report maps each task's contribution **(verify mapping with Pearson's published score guide)**.

### 4.3 Strategy principles and caveats

| Topic | Guidance |
|---|---|
| AI-scored nature | PTE is largely machine-scored (content, form, development, grammar, vocabulary, spelling; oral fluency, pronunciation, content for speech). Learners should speak clearly, steadily, with natural rhythm; **fluency over fixing mistakes**; microphone check ritual; quiet room; consistent distance. |
| Templates | Common in test-prep culture, but **caveat**: memorised long templates risk irrelevance and may be flagged **(verify Pearson's current policy on templated/memorised responses)**. We teach *flexible frameworks* (skeletons with slots for content), not memorised paragraphs, and warn that sentence-level scripts must be adapted to the task. |
| Time | Short prep windows (10–40 s): train "note-in-5-seconds" systems; do not exceed the response window. |
| Typing | Fast, accurate typing (≥ 35 wpm) for written responses; spell-check not available **(verify)**. |
| Negative marking | Several MC/highlight tasks penalise wrong selections **(verify)**; teach selective answering. |

### 4.4 Syllabus — course: PTE Academic (`pte-academic`)

| Module | Units (lessons) | Content | Items |
|---|---|---|---|
| P0 Orientation | 1 unit (6) | Format, scoring, integrated skills, device and mic set-up, diagnostic (mini) | 40 |
| P1 Speaking I (Read Aloud, Repeat Sentence, Answer Short Question) | 3 units (14) | Pronunciation for Bangla speakers (stress, intonation, /θ ð v w/), chunking, memory | 320 |
| P2 Speaking II (Describe Image, Re-tell Lecture) | 2 units (14) | Image types (bar, line, pie, table, map, process, mixed); note-taking | 260 |
| P3 Speaking III (Summarize Group Discussion, Respond to a Situation) — new | 2 units (10) | Group-discussion notes; situational language (request, apology, advice, complaint) | 140 |
| P4 Writing (Summarize Written Text, Write Essay) | 2 units (14) | Sentence summary, essay frameworks, grammar, vocabulary | 160 |
| P5 Reading (5 types) | 5 units (20) | Reorder paragraphs, FIB, MC, vocabulary in context | 520 |
| P6 Listening (8 types) | 8 units (28) | Dictation, note-taking, highlight tasks, missing word | 600 |
| P7 Integrated mocks | 2 units (10) | Full mocks 1–10 (see tier); review videos | 10 mocks |

Totals: **8 modules · 25 units · 116 lessons · ~40 h video · ~2,040 items (rounded: 2,200 with bonus sets) · 10 full mocks (each ~2 h)**. Learner time **(estimate)**: 60–120 h depending on target (e.g., PTE 65 vs 79).

AI scoring: speaking and writing responses evaluated by our own pipeline (Deepgram word timestamps for fluency features, 07 §7.5; Azure pronunciation assessment optional P2). **Labelled "estimated"; not Pearson's scoring.**

### 4.5 PTE tiers (D10)

| Resource | Free | Core | Plus | Live | Mentor |
|---|---|---|---|---|---|
| Lessons | sample (3 task types) | all | all | all | all |
| Practice items | ~100 | ~2,200 | + extras | + | + |
| Full mocks | 0 (1 sectional) | **4** | **10** | 10 | 10 |
| `ai_credit` pool | 2 at sign-up + 1 / month | **10** | **34** | 34 | 34 |
| Human feedback (17 §2.2) | – | – | 2 essay reviews | 4 essays + 2 speaking mocks | 6 essays + 3 speaking mocks |
| Live | – | – | weekly Q&A (Zoom) | 36 sessions × 90 min (regular) / 16 (crash) | Live + **3 × 45-min 1:1** |

---

## 5. Duolingo English Test — DET (P2)

### 5.1 Facts (research; mostly secondary — **(verify all)**)

| Aspect | Value |
|---|---|
| Duration | About 1 hour, fully online, taken at home with proctoring |
| Score | 10–160 in 5-point steps |
| Subscores | Literacy, Comprehension, Conversation, Production |
| Adaptivity | Item-level computer-adaptive: difficulty adjusts in real time (engine `item_cat`, 07 §4.7) |
| Fee | USD 70 (Cialfo) **(verify)** |
| Results | ~2 days |
| Question types named in the official guide | Read and Select, Listen and Type, Read Aloud, Write About the Photo, Interactive Reading, Interactive Listening, Writing Sample, Speaking Sample, Fill in the Blanks, Video Interview |
| Ungraded | Writing Sample and Video Interview/Speaking Sample are sent to institutions (07 §2.6) |

Other task names learners may see (Speak About the Photo, Read-Then-Write, Read-Then-Speak, Listen-Then-Speak, Complete the Sentences, Complete the Passage, Highlight the Answer, Title the Passage, Listen and Respond, Summarize the Conversation) are **background knowledge, unverified**; the curriculum maps to skill families and not to a fixed list so it survives task rotations.

### 5.2 Subscore mapping and strategy

| Subscore | Tasks that feed it **(verify)** | Skills |
|---|---|---|
| Literacy | Read and Select, Fill in the Blanks, Write About the Photo, Writing | Reading + writing accuracy |
| Comprehension | Interactive Reading, Interactive Listening, Listen and Type | Understanding written/spoken English |
| Conversation | Interactive Listening, Speaking tasks | Listening-speaking integration |
| Production | Read Aloud, Write About the Photo, Speaking Sample | Output quality |

Strategy themes: speed and accuracy at word recognition (real vs fake words), C-test (fill-in) skill, timed typed dictation, brief speech and writing, adaptive "stay calm when it gets hard", proctoring rules (ID, room scan, no off-screen help), technology check. Practice approach: short daily items (20–30 min), weekly full timed simulation (1 h), AI feedback on production tasks, vocabulary frequency bands (GSL/AWL-style bands built from our own corpus lists, not copied).

### 5.3 Syllabus — course: DET (`det`)

| Module | Units (lessons) | Items |
|---|---|---|
| D0 Orientation & set-up | 1 (5) | 30 |
| D1 Vocabulary & word recognition (Read and Select, Fill in the Blanks) | 3 (12) | 400 |
| D2 Listening (Listen and Type, Interactive Listening) | 3 (12) | 300 |
| D3 Reading (Interactive Reading) | 2 (8) | 150 |
| D4 Speaking (Read Aloud, Speaking Sample, Video Interview) | 3 (12) | 160 |
| D5 Writing (Write About the Photo, Writing Sample) | 3 (11) | 100 |
| D6 Full simulations | 1 (4) | 8 simulations |

Totals: **6 modules (+ orientation) · 16 units · 64 lessons · ~14 h video · ~1,140 items (listed as 1,200 with bonus sets) · 8 full simulations (~1 h each)**; learner time **(estimate)** 20–50 h.

### 5.4 DET tiers

| Resource | Free | Core | Plus | Live | Mentor |
|---|---|---|---|---|---|
| Lessons | sample | all | all | all | all |
| Simulations (full mocks) | 1 sectional | **4** | **10** | 10 | 10 |
| `ai_credit` pool | 2 at sign-up + 1 / month | **8** | **24** | 24 | 24 |
| Human feedback (17 §2.2b) | – | – | 2 essay reviews | 4 essays + 2 speaking mocks | 6 essays + 3 speaking mocks |
| Live | – | – | weekly Q&A (Zoom) | 12-session (6-week) batch / 8-session crash | Live + **3 × 45-min 1:1** |

---

## 6. TOEFL iBT — 2026 format (later; after the multistage engine)

### 6.1 Format (ETS EU content-structure page, per gap-fill research; **verify all numbers; counts may vary because the test adapts**)

| Section (order) | Items | Base time | Tasks (ids per 07 §2.6) | Adaptive? |
|---|---|---|---|---|
| Reading | 50 | ~30 min | Complete the Words (`toefl.complete_the_words`), Read in Daily Life (`toefl.read_daily_life`), Read an Academic Passage (`toefl.read_academic_passage`) | Yes (multistage) |
| Listening | 47 | ~29 min | Listen and Choose a Response, Listen to a Conversation, Listen to an Announcement, Listen to an Academic Talk | Yes (multistage) |
| Writing | 12 | ~23 min | Build a Sentence, Write an Email, Write for an Academic Discussion | **(verify)** |
| Speaking | 11 | ~8 min | Listen and Repeat, Take an Interview | **(verify)** |

Base time totals about 90 minutes; ETS says allow ~2 hours. Scores: four section scores 1–6 in half-point steps; overall = mean of sections rounded to the nearest half band; a comparable 0–120 overall also reported for two years after Jan 2026. Home Edition with live proctor available. The superseded ~2-hour format (Reading 35 min, Integrated writing) must not be taught.

### 6.2 Syllabus outline — course: TOEFL iBT (`toefl-ibt`)

| Module | Content | Units/lessons | Items |
|---|---|---|---|
| T0 Orientation | New format, 1–6 scale, adaptive explanation, CEFR mapping, diagnostic | 1 / 6 | 40 |
| T1 Reading A: Complete the Words | Morphology, context cloze, spelling patterns (first 2–3 letters given) | 2 / 8 | 300 (paragraph sets) |
| T2 Reading B: Daily-life texts | Emails, notices, schedules, ads, inference | 2 / 8 | 200 |
| T3 Reading C: Academic passages | Main idea, detail, inference, rhetorical purpose, vocabulary | 3 / 14 | 260 |
| T4 Listening A: Choose a Response | Short pragmatic replies | 1 / 5 | 150 |
| T5 Listening B: Conversations & Announcements | Campus-life audio | 2 / 9 | 180 |
| T6 Listening C: Academic Talks | Lecture note-taking, organisation, attitude | 2 / 10 | 150 |
| T7 Writing A: Build a Sentence | Syntax assembling, word order, grammar | 2 / 8 | 280 |
| T8 Writing B: Write an Email | Register, purpose, tone, completeness | 2 / 8 | 40 prompts |
| T9 Writing C: Academic Discussion | Contribute to forum; stance + support | 2 / 8 | 40 prompts |
| T10 Speaking A: Listen and Repeat | Chunking, memory, intonation | 2 / 8 | 150 |
| T11 Speaking B: Take an Interview | Extended responses, organisation, fluency | 2 / 9 | 80 |
| T12 Adaptive strategy & mocks | Multistage routing, time, stamina; full mocks | 1 / 6 | 6 mocks |

Totals: **13 modules · 24 units · 107 lessons · ~30 h video · ~1,870 items · 6 full mocks**; learner time **(estimate)** 50–110 h. Tiers follow D10 and 17 §2.2b (Core 4 mocks and 10 credits, Plus 10 mocks and 34 credits, Live 36 sessions / crash 16, Mentor 3 × 45-min 1:1). Engine prerequisite: multistage router for R/L (07 §4.7). Stage content rule: each module authored at low/mid/high levels.

---

## 7. Optional later (outline only; build only if demand data supports)

### 7.1 GMAT Focus (optional)

Facts (Magoosh via research; **verify at mba.com**): 3 sections, 64 Q, 2 h 15 min; Quant 21 Q/45 min (Problem Solving only), Verbal 23 Q/45 min (Reading Comprehension + Critical Reasoning; no Sentence Correction), Data Insights 20 Q/45 min (Data Sufficiency, Table Analysis, Multi-Source Reasoning, Graphics Interpretation, Two-Part Analysis; calculator only here); score 205–805, sections 60–90; up to 3 answer edits per section.

| Outline module | Content |
|---|---|
| Quant | Arithmetic, algebra, word problems, number properties (no geometry-heavy), PS strategies |
| Verbal | RC, CR (assumption, strengthen/weaken, evaluate, inference) |
| Data Insights | DS logic, table/graph reading, multi-source, two-part |
| Mocks | Section-adaptive (question-level adaptive on the real test **verify**) — needs its own engine design |
Reuses GRE RC/arguments content; ~25 h video, ~1,000 items **(estimate)**. Tiers per D10. Trademark: "GMAT™".

### 7.2 SAT (optional)

Digital SAT outline **(verify)**: module-adaptive; Reading & Writing + Math; 1600 scale; ~2 h 14 min. Outline: R&W (vocabulary in context, text structure, cross-text connections, standard English conventions, transitions, expression of ideas), Math (algebra, advanced math, problem-solving & data analysis, geometry & trigonometry; calculator allowed throughout). Audience: Class 11–12 students applying to US colleges (links to Common App services doc 21). Needs multistage engine (shared with TOEFL).

---

# PART C — TECH TRACKS AND UNIVERSITY PACKS (P3)

## 8. Tech tracks

### 8.0 Shared design

| Aspect | Decision |
|---|---|
| Delivery | Standard course schema (03 §7.3): video + article + auto-graded coding exercises + in-browser notebooks (**NB**) + projects with rubric review + certificates + Open Badges 3.0 |
| Runtimes | **Python/data:** Pyodide (WASM CPython) via JupyterLite in the browser — NumPy, pandas, Matplotlib, SciPy and scikit-learn are available as Pyodide packages **(verify versions and bundle sizes)**; large downloads are lazy-loaded; offline-capable via PWA cache. **Deep Learning / GenAI:** PyTorch and LLM calls are not practical in Pyodide → hosted notebook workers (CPU-only containers for small models; GPU-free by design; pre-computed embeddings/model checkpoints; LLM calls via a **rate-limited proxy** using Lumen's API key, never learner keys in-browser). **SQL:** SQLite-WASM and PGlite (Postgres-in-WASM) in the browser **(verify licence & features)**. **C / C++ / Java:** hosted sandbox (Piston, MIT, or Judge0, GPL-3 — **verify licences and isolation (gVisor/Firecracker)**), CPU/time/memory limits, no network. **Networking labs:** no Cisco tools; use pcap viewers (Wireshark-style web viewer), our own subnet/route simulators, and optional containerlab/Mininet hosted labs. |
| Security | All code execution isolated; no outbound network; rate limits per user (D7 / 09); no learner code stored beyond submissions; AI-assisted hints limited by tier |
| Language | Bangla-English mix with English slides (03 §7.3); full English edition for international |
| Assessment pattern | Auto-graded exercises (per lesson) · unit quizzes · lab notebooks (auto + rubric) · mid-course practical · capstone (rubric, peer review Plus+, instructor review Live/Mentor) · final exam (proctored-lite, 60–90 min, optional) |
| Certificate (default) | ≥ 80 % of units mastered **and** ≥ 70 % average on graded labs **and** capstone rubric ≥ 70 % **and** final exam ≥ 60 %; identity-verified (account), unique ID at `/verify/[code]`; **no exam-body endorsement claims** (e.g., "Cisco" or "TensorFlow" certified) |
| Tiers (adapted from D10) | **Free:** Module 1 + sample labs; **Core:** full course, auto-graded labs, certificate; **Plus:** AI tutor/code-review fair-use, peer-reviewed capstone, weekly live Q&A; **Live:** cohort (P3 LiveKit), instructor code-review, deadlines; **Mentor:** 1:1 code review and career coaching. Live/Mentor offered only where an instructor is staffed. Prices in 17 |
| Learner hours | Planning estimates **(estimate)**; video typically 25–35 % of total |

### 8.1 Python for Data (`python-for-data`)

| Field | Detail |
|---|---|
| Audience | University students (any discipline), job seekers, analysts-to-be; BD fresh graduates |
| Prerequisites | None (basic computer literacy); recommended: English reading B1 |
| Learning outcomes (Bloom) | *Apply* Python syntax, control flow and functions; *use* lists/dicts/sets; *implement* data-cleaning pipelines with pandas; *analyse* tabular data with NumPy/pandas; *create* visualisations with Matplotlib/Seaborn; *evaluate* data quality; *communicate* an EDA story |
| Modules (lessons) | 1 Python basics: types, operators, I/O (8) · 2 Control flow & functions (8) · 3 Data structures: lists, tuples, dicts, sets, comprehension (8) · 4 Files, modules, errors, testing basics (6) · 5 NumPy (8) · 6 pandas I: indexing, selection, groupby (9) · 7 pandas II: cleaning, merging, time series (9) · 8 Visualisation (Matplotlib/Seaborn) (6) · 9 EDA project & storytelling (4) |
| Labs/projects | 9 notebooks (one per module) + 3 mini-projects (budget tracker; weather statistics; exam-results analysis) |
| Assessments | 70 auto-graded exercises per 10 lessons; quizzes; mid-course practical (module 5); final exam |
| Capstone | Analyse a Bangladesh public dataset (e.g., weather, exam statistics, air-quality, census-style tables) — data must be open-licensed; report notebook + 5-minute explainer; rubric: question clarity, cleaning rigour, visuals, insight, reproducibility |
| Certificate | Default (§8.0) |
| Size | **9 modules · 66 lessons · 18 h video · 520 items/exercises · 9 labs + capstone · 70–100 learner h (estimate)** |
| Tiers | Free: M1 + M2; Core/Plus/Live/Mentor as §8.0 |

### 8.2 Machine Learning Foundations (`ml-foundations`)

| Field | Detail |
|---|---|
| Audience | Students/graduates in CSE/EEE/maths/stats, data analysts moving into ML |
| Prerequisites | Python for Data (or equivalent), school algebra; basic calculus/linear algebra refreshed in M0 |
| Outcomes | *Explain* supervised/unsupervised learning; *apply* regression/classification; *evaluate* models (train/validation/test, cross-validation, metrics); *diagnose* bias/variance and leakage; *engineer* features and *build* pipelines; *compare* tree ensembles; *deploy* a model as a simple API; *critique* fairness/ethics issues |
| Modules (lessons) | 0 Math refresh: vectors, matrices, derivatives, probability (6) · 1 ML workflow & data splitting (6) · 2 Linear & logistic regression (9) · 3 Evaluation & validation (8) · 4 Trees, random forests, boosting (8) · 5 k-NN, SVM (conceptual), Naive Bayes (6) · 6 Clustering & dimensionality reduction (7) · 7 Feature engineering & pipelines (6) · 8 Model selection, tuning, interpretability (6) · 9 Deployment basics & ethics (6) |
| Labs/projects | 10 notebooks; 2 Kaggle-style problems on open data; capstone |
| Assessments | Auto-graded notebooks; model-evaluation quizzes; metric-interpretation exam; capstone defence (Live/Mentor) |
| Capstone | End-to-end tabular project (problem framing → data → baseline → improvement → evaluation → write-up → small API demo) |
| Size | **10 modules · 64 lessons · 20 h video · 420 items · 12 labs · 80–120 learner h (estimate)** |

### 8.3 Deep Learning (`deep-learning`)

| Field | Detail |
|---|---|
| Audience | Learners who finished ML Foundations; ML engineer aspirants (aligns with junior ML engineer roles: computer vision, workflow automation) |
| Prerequisites | ML Foundations; comfortable with Python, NumPy, basic linear algebra/calculus |
| Outcomes | *Derive* forward/backward pass for small nets; *implement* training loops; *tune* optimisers, regularisation, initialisation; *build* CNNs for images; *apply* transfer learning; *explain* RNN/LSTM/attention at concept level; *diagnose* training failures; *evaluate* results rigorously |
| Modules (lessons) | 1 Neural nets from scratch (NumPy) (8) · 2 Backprop & autodiff (6) · 3 Optimisation & regularisation (8) · 4 PyTorch fundamentals (7) · 5 CNNs & vision (9) · 6 Transfer learning & augmentation (6) · 7 Sequence models & attention (8) · 8 Training diagnostics, reproducibility (5) · 9 Responsible AI & deployment (5) |
| Labs | Hosted notebooks (CPU, small datasets, pre-trained checkpoints, fixed time/compute quotas); all tasks designed to run in ≤ 10 min CPU **(verify)**; optional bring-your-own-GPU notebook download |
| Capstone | Image **or** text classifier with error analysis and model card |
| Size | **9 modules · 62 lessons · 18 h video · 300 items · 10 labs · 80–110 learner h (estimate)** |

### 8.4 Generative AI & LLM Apps (`genai-llm-apps`)

| Field | Detail |
|---|---|
| Audience | Developers, analysts, students who want to build LLM-powered tools |
| Prerequisites | Python for Data (functions, JSON, HTTP basics) |
| Outcomes | *Explain* how LLMs work (tokens, context, sampling); *design* prompts and structured outputs; *build* embeddings + vector search; *implement* RAG; *construct* tool-calling agents; *evaluate* LLM apps (test sets, LLM-as-judge limits); *apply* safety, privacy and cost controls |
| Modules (lessons) | 1 LLM concepts (6) · 2 Prompting & structured output (JSON schemas) (8) · 3 Embeddings & vector search (7) · 4 RAG pipelines (chunking, retrieval, citation) (9) · 5 Tool use & agents (8) · 6 Evaluation & observability (7) · 7 Safety, privacy, prompt injection (6) · 8 Cost, latency, caching (4) · 9 Shipping a small app (5) |
| Labs | Hosted notebooks calling the course LLM proxy with per-learner token budgets; sample document corpora (open licensed or original); optionally local small models via WASM (verify) |
| Capstone | RAG chatbot over a document set (e.g., Bangladesh public-policy PDFs under open licence), with eval set and cited answers |
| Notes | Model/API names change fast: keep API-specific content in a "living appendix" refreshed quarterly; concepts stay evergreen |
| Size | **9 modules · 60 lessons · 16 h video · 280 items · 9 labs · 60–90 learner h (estimate)** |

### 8.5 SQL & Database Systems (`sql-database-systems`)

| Field | Detail |
|---|---|
| Audience | Students, analysts, backend aspirants |
| Prerequisites | None |
| Outcomes | *Write* SELECT queries with filters, joins, aggregates; *use* window functions and CTEs; *design* normalised schemas; *explain* indexes and query plans; *reason* about transactions and isolation; *compare* SQL and NoSQL trade-offs |
| Modules (lessons) | 1 Relational model & first queries (7) · 2 Filtering, sorting, aggregation (8) · 3 Joins & set operations (8) · 4 Subqueries, CTEs, window functions (9) · 5 DDL/DML, constraints (6) · 6 Schema design & normalisation (1NF–BCNF) (8) · 7 Indexes & query plans (6) · 8 Transactions & concurrency (6) · 9 NoSQL overview & polyglot (4) |
| Labs | In-browser SQLite/PGlite with datasets (e-commerce, library, university); auto-graded by result-set comparison and query-plan checks |
| Capstone | Design and query a small e-commerce DB (ERD → DDL → seed → 12 analytical queries → index recommendations) |
| Size | **9 modules · 62 lessons · 15 h video · 600 items · 9 labs · 50–80 learner h (estimate)** |

### 8.6 Computer Networking (`computer-networking-fundamentals`)

**Trademark caution:** "CCNA" and "Cisco" are Cisco Systems' marks. The course is **vendor-neutral** with topic coverage "comparable to common entry-level networking certification topic areas". Use no "CCNA" in the course name, URL or ads; if mentioned in marketing, use a nominative disclaimer ("not affiliated with or endorsed by Cisco") after legal review; do not reproduce exam dumps or Cisco curriculum; no IOS-specific simulator content (Cisco Packet Tracer licence disallows redistribution) — use generic CLI-style concepts and open tools.

| Field | Detail |
|---|---|
| Audience | CSE/ICT students, aspiring network technicians, IT support staff; BD ISP/telecom entry roles |
| Prerequisites | None |
| Outcomes | *Describe* OSI/TCP-IP layers; *calculate* IPv4 subnets (VLSM) and *interpret* IPv6 addressing; *explain* switching (VLANs, STP concepts) and routing (static, RIP/OSPF concepts); *analyse* packet traces for TCP/UDP/DNS/HTTP/TLS; *configure* a small network on paper/lab; *apply* basic network security (ACL concepts, NAT, VPN overview) |
| Modules (lessons) | 1 Networks & layered models (6) · 2 Physical & data link (Ethernet, ARP, Wi-Fi) (8) · 3 IPv4 addressing & subnetting (10) · 4 IPv6 basics (4) · 5 Switching & VLANs (6) · 6 Routing fundamentals (static, dynamic concepts) (8) · 7 Transport: TCP/UDP (7) · 8 Application services: DNS, DHCP, HTTP, TLS, email (8) · 9 Wireless & mobile (4) · 10 Network security basics (6) · 11 Troubleshooting & packet-trace labs (6) |
| Labs | Subnet calculators (auto-graded), pcap reading labs, topology design tasks in a custom in-browser simulator; optional hosted containerlab labs |
| Capstone | Design a small campus network (addressing plan, VLANs, routing, security) on paper + lab validation |
| Size | **11 modules · 73 lessons · 18 h video · 650 items · 12 labs · 70–100 learner h (estimate)** |

---

## 9. Bangladeshi university CSE packs (P3)

### 9.1 Principles

- Packs are **concept + exam-prep** companions to university courses; they are not substitutes for degrees. Built from original notes and practice sets; "past-pattern style" questions are original, written to resemble the *kind* of question asked (definition, derivation, trace, short coding, design) — **no copies of university question papers or textbooks**.
- Mapping tables: each pack lists typical topics common to BUET/DU/NSU/BRACU-style CSE curricula (public: lecture-based with mid + final; private: quizzes, assignments, mid, final, lab) and is verified by a faculty reviewer. **Do not use official course codes in marketing**; keep a private mapping (editor-only) keyed by generic pack topics → common topic names; confirm with faculty before claiming alignment with any named university. **No copyrighted syllabus text** is stored.
- Typical assessment pattern in the packs: concept quiz (per unit), mid-style mock (50–60 % of topics), final-style mock (all topics), lab/coding exercises.
- Credit norm (illustrative **(estimate)**): theory 3 credits + lab 1.5 credits; the pack time budget is sized for a 14-week semester.
- Language: Bangla-English mix (explanations in Bangla, terms in English); English international edition for diaspora/transfer students.

### 9.2 Pack catalogue

| Pack (slug) | Typical topics (generic) | Prereqs | Modules (lessons) | Lab/practice | Assessments | Size |
|---|---|---|---|---|---|---|
| **Structured Programming in C** (`cse-c-programming`) | Types, operators, control flow, functions, arrays, strings, pointers, structs, file I/O, dynamic memory, preprocessor | none | 1 Basics & I/O (8) · 2 Control (8) · 3 Functions & recursion (8) · 4 Arrays & strings (8) · 5 Pointers (10) · 6 Structs/unions/enums (6) · 7 Files (5) · 8 Dynamic memory (6) · 9 Debugging & style (4) | Hosted C sandbox (auto-graded stdin/stdout) ~180 programs | Unit quizzes, 2 mid-style, 1 final-style, output-trace sets | 63 lessons · 15 h · 550 items |
| **Data Structures & Algorithms** (`cse-dsa`) | Complexity (Big-O), arrays/lists, stacks/queues, trees (BST/AVL/heap), graphs (BFS/DFS/shortest paths/MST), hashing, sorting/searching, DP, greedy | C or Python | 1 Complexity (6) · 2 Arrays & linked lists (8) · 3 Stacks/queues (6) · 4 Trees (BST, balanced) (9) · 5 Heaps & priority queues (5) · 6 Hashing (5) · 7 Sorting & searching (8) · 8 Graph algorithms (10) · 9 Greedy (5) · 10 Dynamic programming (9) | Code in C++/Java/Python (hosted) ~160 problems; visualisers | Per-unit coding, mid/final mocks | 71 lessons · 19 h · 620 items |
| **OOP in Java / C++** (`cse-oop`) (two language editions) | Classes/objects, encapsulation, inheritance, polymorphism, abstract/interface, exceptions, generics/templates, STL/collections, intro design patterns | Structured Programming | 1 Classes & objects (8) · 2 Encapsulation & constructors (6) · 3 Inheritance (7) · 4 Polymorphism & virtual (7) · 5 Abstraction/interfaces (6) · 6 Exceptions (5) · 7 Generics/templates (6) · 8 Collections/STL (6) · 9 Design patterns (intro) (5) · 10 Mini-project (4) | Hosted Java/C++ sandbox ~140 exercises | Quizzes + project rubric + mid/final | 60 lessons · 15 h · 430 items |
| **DBMS** (`cse-dbms`) | ER modelling, relational model/algebra, SQL, normalisation, transactions, concurrency control, recovery, indexing, query processing | none | Shares content with SQL & Database Systems + adds 1 ER/EER (7) · 2 Relational algebra & calculus (6) · 3 SQL (reuse) · 4 Normalisation (reuse + decomposition proofs) (8) · 5 Transactions/ACID (6) · 6 Concurrency & recovery (8) · 7 Storage & indexing (B+ tree) (7) · 8 Query processing (5) | In-browser SQL sandbox | Mid/final-style sets (design + calculation questions) | 57 lessons · 14 h · 480 items |
| **Operating Systems** (`cse-os`) | Processes/threads, scheduling, synchronisation, deadlocks, memory management, virtual memory, file systems, I/O, security overview | C basics | 1 OS overview (5) · 2 Processes & threads (8) · 3 CPU scheduling (8) · 4 Synchronisation (9) · 5 Deadlocks (6) · 6 Memory management (7) · 7 Virtual memory (8) · 8 File systems (6) · 9 I/O & protection (5) | Scheduling/page-replacement simulators; short C labs (fork, pthreads) | Tracing/calculation sets, mid/final | 62 lessons · 15 h · 450 items |
| **Computer Networks** (`cse-networks`) | Layers, data link, IP/subnetting, routing, TCP, application protocols, security | none | Reuses Networking fundamentals; adds university-style numerical sets (throughput, CRC, sliding window, subnetting) (8 extra lessons) | Subnet/CRC/window calculators | Mid/final-style | 60 lessons · 14 h · 500 items |
| **Discrete Mathematics** (`cse-discrete-math`) | Logic, proofs, sets, relations, functions, counting, recurrence, graph theory, Boolean algebra | none | 1 Propositional/predicate logic (8) · 2 Proof techniques (7) · 3 Sets/relations/functions (8) · 4 Counting & pigeonhole (8) · 5 Recurrences (6) · 6 Graph theory & trees (9) · 7 Boolean algebra & logic gates (5) · 8 Number theory basics (5) | Proof-writing practice with feedback; Lean/solver-free | Proof rubrics + problem sets | 56 lessons · 14 h · 480 items |
| **Computer Architecture** (`cse-computer-architecture`) | Number systems, digital logic, ISA, MIPS/RISC-style assembly, datapath, pipelining, cache, memory hierarchy, I/O, performance | Discrete Math (logic) | 1 Data representation (6) · 2 Digital logic basics (6) · 3 ISA & assembly (RISC-style) (9) · 4 Datapath & control (8) · 5 Pipelining & hazards (8) · 6 Cache & memory hierarchy (8) · 7 I/O & buses (4) · 8 Performance metrics (4) | Assembly emulator in browser (original simulator) | Calculation (CPI, hit rates), tracing, mid/final | 53 lessons · 13 h · 420 items |

### 9.3 Tiers (packs)

| Tier | What it includes |
|---|---|
| Free | Unit 1 of each pack + sample quizzes |
| Core | Full pack, mid/final mocks, certificate of completion |
| Plus | AI tutor (fair-use), weekly Q&A, personalised revision schedule before exams |
| Live | Exam-sprint batch (2–3 weeks) with an instructor |
| Mentor | 1:1 doubt-clearing sessions |
| Institution (D5 `org_seat_pack`, P2/P3) | Bulk seats to private-university departments, cohort analytics via `/org/…` |

### 9.4 Open resources — allowed use as *references* (not as copied content)

**Rule: create original content; cite references.** Licences below are from background knowledge unless noted; **all marked "(verify)" must be rechecked with the resource's current licence page** before relying on them (research only confirmed CC BY-SA share-alike implications for Wikipedia and CC licences generally).

| Resource | Licence (as understood) | Can we copy/adapt into paid courses? | How we use it |
|---|---|---|---|
| MIT OpenCourseWare | CC BY-NC-SA 4.0 | **No** (NonCommercial + ShareAlike) | Reference for topic coverage; link; don't paste |
| Harvard CS50 materials | CC BY-NC-SA 4.0 (course content) | **No** for commercial content | Pedagogical reference; recommend as free supplement |
| Python documentation | PSF licence (docs); code samples under PSF/Zero-Clause BSD (verify) | Quoting small examples with attribution is generally ok (verify), not wholesale | Cite for API behaviour |
| NumPy / pandas / Matplotlib docs | BSD-3 / permissive (verify) | Permissive, attribution required; still avoid copy-paste | Cite for function behaviour |
| scikit-learn docs | BSD-3 licence for code; documentation licence permissive (verify) | Short quoted snippets with attribution; write our own examples | Cite for estimators and best practices |
| PyTorch docs | BSD-style licence (verify) | As above | Cite |
| PostgreSQL docs | PostgreSQL licence (permissive) | Attribution | Cite |
| SQLite docs | Public domain | Allowed | Cite |
| Wikipedia | CC BY-SA 4.0 | **Share-alike**: adapted text must be CC BY-SA → incompatible with all-rights-reserved paid content; research notes recommend writing fresh text from facts | Reference only; write original passages |
| OpenStax | CC BY 4.0 (most titles; verify per title) | Allowed with attribution (confirm per title) | Possible source of figures/examples with attribution |
| Open Data Structures, Dive into Deep Learning, other open textbooks | Mixed CC BY / CC BY-SA / CC BY-NC (verify each) | Only if licence permits commercial + share-alike requirements are acceptable | Reference; do not copy |
| RFCs (IETF) | IETF Trust legal provisions (verify) | Quoting allowed with conditions; no wholesale copying | Cite RFC numbers; summarise |
| Kaggle/UCI/Bangladesh open data | Dataset-specific licences | Check each (CC0/CC BY/ODbL etc.) | Use datasets for labs only with compatible licence |
| Exam syllabi/papers of universities | Copyright of university | **No copying** | Topic-level alignment only |

**Procedure (also in 16):** reference register in the CMS (`reference` table or content metadata): title, URL, licence, retrieved date, how used (inspiration / quoted ≤ N words / figure with attribution), reviewer sign-off. No lesson publishes without its reference list.

---

# PART D — CATALOGUE, VERSIONS, QA

## 10. Course catalogue entries (all courses in this document)

Counts consistent with the sections above; "Items" excludes full mocks; **(estimate)** where noted; prices in 17.

### 10.1 Exam courses

| Course (slug) | Audience | Entry level | Duration (suggested) | Modules | Lessons | Video h | Practice items | Mocks / projects | Outcomes (headline) | Tiers | Phase |
|---|---|---|---|---|---|---|---|---|---|---|---|
| GRE (`gre`) | MS/PhD applicants (BD + intl) | CEFR B1+ reading; school-level math | 4/8/12 weeks (100–330 h, see grid) | 9 | **237** | ~60 | **1,500** (+1,000 word cards) | 5 full adaptive mocks at launch (10 by 2027-08-15 for Plus and above; Core has 4) | Estimated V/Q gain, AWA ≥ 4 | F/C/P/L/M | P1 (Live/Mentor P2) |
| GRE Verbal (`gre-verbal`) | Verbal-weak learners | B1+ | 4–8 weeks | 7 | 80 | ~20 | 500 | 4 sectional pairs | Verbal band-gain, 1,000 words | F/C/P/L/M | P1 |
| GRE Quant (`gre-quant`) | Rusty-math learners | School math | 4–8 weeks | 8 | 92 | ~25 | 600 | 4 sectional pairs | Quant 155→165 range | F/C/P/L/M | P1 |
| GRE AWA (`gre-awa`) | All GRE takers | B1+ writing | 2–4 weeks | 6 | 28 | ~5 | 40 prompts, 10 model essays | 6 timed essays + AI | AWA 4.0 → 5.0 target | F/C/P/L/M | P1 |
| GRE Vocab (`gre-vocab`) | All GRE takers | B1 | 10 weeks (15 words/day) | 3 | 14 (+4 per tier quizzes) | ~2 | 1,000 words + 150 roots + ~180 context items + 60 confusable pairs | 10 weekly quizzes | Recall/recognise 1,000 words in context | F/C/P | P1 |
| PTE Academic (`pte-academic`) | Migration/study-abroad | CEFR B1 | 4–10 weeks | 8 | 116 | ~40 | ~2,040 (2,200 with bonus) | 10 full mocks | PTE 65 / 79 target ranges (est.) | F/C/P/L/M | P2 |
| DET (`det`) | University applicants | B1 | 2–6 weeks | 7 | 64 | ~14 | ~1,140 | 8 simulations | DET 105–130 target ranges (est.) | F/C/P/L/M | P2 |
| TOEFL iBT (`toefl-ibt`) | Study-abroad | B1–B2 | 6–10 weeks | 13 | 107 | ~30 | ~1,870 | 6 full mocks (multistage) | Section 4.0–5.5 target ranges (est.) | F/C/P/L/M | Later (P2-late) |
| GMAT Focus (`gmat-focus-complete`) — optional | MBA applicants | B2 | 8–12 weeks | 4 (outline) | ~120 | ~25 | ~1,000 | 4 mocks | – | F/C/P | Optional |
| SAT (`sat-digital`) — optional | Class 11–12 | B1 | 8–12 weeks | 6 (outline) | ~130 | ~28 | ~1,500 | 6 mocks | – | F/C/P | Optional |

### 10.2 Tech and university courses

| Course (slug) | Audience | Entry level | Duration | Modules | Lessons | Video h | Items | Projects | Outcomes (headline) | Tiers | Phase |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Python for Data | Students, analysts | None | 8–10 weeks | 9 | 66 | 18 | 520 | 9 labs + capstone | Apply, analyse, visualise | F/C/P/L/M | P3 |
| ML Foundations | CSE/stat students | Python for Data | 10–12 weeks | 10 | 64 | 20 | 420 | 12 labs + capstone | Build, evaluate ML pipelines | F/C/P/L/M | P3 |
| Deep Learning | ML aspirants | ML Foundations | 10–12 weeks | 9 | 62 | 18 | 300 | 10 labs + capstone | Implement CNNs, transfer learning | F/C/P/L/M | P3 |
| Generative AI & LLM Apps | Developers | Python | 8–10 weeks | 9 | 60 | 16 | 280 | 9 labs + capstone RAG app | Design, build, evaluate LLM apps | F/C/P/L/M | P3 |
| SQL & Database Systems | Students, analysts | None | 8 weeks | 9 | 62 | 15 | 600 | 9 labs + capstone | Query, design, tune | F/C/P/L/M | P3 |
| Computer Networking Fundamentals | ICT/CSE learners | None | 10–12 weeks | 11 | 73 | 18 | 650 | 12 labs + capstone | Subnet, route, analyse traffic | F/C/P/L/M | P3 |
| Pack: Structured Programming in C | 1st-year CSE | None | 14 weeks (semester) | 9 | 63 | 15 | 550 | 180 programs | Write/debug C programs | F/C/P/L/M | P3 |
| Pack: DSA | 2nd-year CSE | C/Python | 14 weeks | 10 | 71 | 19 | 620 | 160 problems | Analyse and implement DSA | F/C/P/L/M | P3 |
| Pack: OOP (Java/C++) | 2nd-year CSE | C basics | 14 weeks | 10 | 60 | 15 | 430 | project | Design OO systems | F/C/P/L/M | P3 |
| Pack: DBMS | 2nd/3rd-year CSE | none | 14 weeks | 8 | 57 | 14 | 480 | design project | Model, normalise, query | F/C/P/L/M | P3 |
| Pack: Operating Systems | 3rd-year CSE | C | 14 weeks | 9 | 62 | 15 | 450 | simulators | Explain/trace OS mechanisms | F/C/P/L/M | P3 |
| Pack: Computer Networks | 3rd-year CSE | none | 14 weeks | 9 (+extras) | 60 | 14 | 500 | calculators | Compute/analyse protocols | F/C/P/L/M | P3 |
| Pack: Discrete Mathematics | 1st/2nd-year CSE | none | 14 weeks | 8 | 56 | 14 | 480 | proof sets | Prove, count, model | F/C/P/L/M | P3 |
| Pack: Computer Architecture | 2nd/3rd-year CSE | Discrete logic | 14 weeks | 8 | 53 | 13 | 420 | assembly emulator | Analyse CPU design | F/C/P/L/M | P3 |

Notes: Free tier = first module(s) only; all courses have English international editions (§11). Phase is the earliest release; P2 courses depend on AI scoring maturity and (TOEFL) the multistage engine.

## 11. Bangladesh vs International version

| Course family | Instruction language | Examples/contexts | Delivery | Differences |
|---|---|---|---|---|
| GRE (all) | **BD:** Bangla-English mix (explain in Bangla, exam terms/English); English captions. **Intl:** full English | BD: Bangla glosses for vocab; AWA examples with BD/South Asia + global; Quant word problems with BDT, local contexts; **Intl:** USD/neutral contexts, US/UK/EU examples | BD: bKash/Nagad via SSLCommerz; Bangla UI; live classes in BDT-friendly timezones (BST evening). Intl: Paddle/Stripe, time-zone-agnostic recordings, 3 PPP regions (D10) | Same items and mocks; Bangla edition adds glossary layer |
| PTE / DET / TOEFL | BD: Bangla-English mix, pronunciation modules tailored to Bangla phonology; Intl: English with pronunciation modules for South Asian and general L1 groups | BD: Bangla L1 interference (articles, /v/-/w/, /θ/-/ð/); Intl: multi-L1 | Same | Task-type content shared |
| GMAT / SAT | Same split | – | – | – |
| Python/ML/DL/GenAI/SQL/Networking | BD: Bangla-English mix with English slides; Intl: English | BD datasets (weather, exams, transport) + global datasets; BD job-market framing (RMG/IT/outsourcing/freelance) | Same runtimes; Intl accessed by region | Dataset contexts differ |
| University CSE packs | BD: Bangla-English mix, aligned to BD university sequencing and assessment pattern (mid/final, semester timeline) | BD-style problems and terminology | BD only at launch | **Intl edition**: generic CS course companion in English, marketed to diaspora/other South Asian universities |
| Credentialing | Same certificate rules; verification page in EN and BN | | | |
| Pricing | See 17 (BDT price book vs USD price book) | | | |

Asset parity rule: no course launches in one edition without the other unless flagged "BD-only" in the catalogue record; Bangla scripts are produced from the same learning-objective sheet to keep QA parity. See 16 for recording/localisation workflow.

## 12. Curriculum QA checklist

### 12.1 Content correctness

- [ ] Exam facts match the current official page (record URL + retrieval date); every **(verify)** item resolved or removed before publish.
- [ ] GRE: Issue task only; times 18/23/21/26 min; adaptive structure described in neutral terms; scale 130–170 and AWA 0–6 correct; fee stated with effective date or omitted.
- [ ] PTE: 22 task types listed; integrated scoring mapping validated against Pearson's published score guide; negative-marking flags per task verified.
- [ ] TOEFL: 2026 format only (no superseded 2-hour format teaching); timings/items stored as config.
- [ ] DET: facts re-verified from official page; ungraded tasks flagged.
- [ ] Math items verified by a second solver (human or independent calculation); answer keys machine-checked (Numeric Entry equivalence).
- [ ] Vocabulary entries: sense, charge, example reviewed by two editors; example sentences original.
- [ ] RC passages: original, ≤ expected length, readability within band; each question has a textual justification note.
- [ ] Code courses: all code executed in the sandbox; versions pinned; deprecations reviewed quarterly.

### 12.2 Pedagogy

- [ ] Every lesson has an objective with a measurable verb and a matching practice item.
- [ ] Every unit has a mastery quiz at the stated threshold.
- [ ] Bloom spread: ≥ 30 % apply-or-higher items in each unit.
- [ ] Spaced review items inserted (+1, +7, +21 days).
- [ ] Time targets (≈ 1.5 min Verbal, ≈ 1.75 min Quant per question) reflected in timed item metadata (`target_seconds`: Verbal 90, Quant 105).
- [ ] Strategies taught with examples **and** counter-examples; no "universal tricks" claims.

### 12.3 Item quality (also 07 §8.3)

- [ ] Single correct answer (or exact required multi-select), plausible distractors.
- [ ] No cultural/regional bias (BD and international reviewers); no sensitive topics in passages.
- [ ] Difficulty estimates calibrated; panels (low/medium/high) pass simulation (07 §4.6).
- [ ] Exposure-limit metadata set; items retired per 07 §8.6.
- [ ] Originality check: plagiarism scan against public prep banks; no recalled real-test content.

### 12.4 Legal and licensing

- [ ] No copied text from ETS/Pearson/Duolingo/GMAC/College Board/Cambridge/universities; trademark notices (§0.4) on all public pages and apps.
- [ ] Reference register complete; no NC/SA licensed material embedded.
- [ ] Cisco/CCNA wording reviewed; no vendor dumps.
- [ ] Third-party audio/images licensed (16); AI-generated voices disclosed where required.

### 12.5 Accessibility and localisation

- [ ] Captions (EN, BN) on all video; transcripts; alt text; chart data tables (WCAG 2.2 AA).
- [ ] Bangla scripts and glosses reviewed by native instructor; KaTeX rendering in both locales; Bangla numerals only where intentional.
- [ ] Parity check between BD and Intl editions (learning objectives identical).

### 12.6 Platform integration

- [ ] Every item maps to a registered question type id (07 §2); blueprint totals unit-tested.
- [ ] Mock forms: S2 panels for V and Q authored (114 items/mock for GRE); simulation passed.
- [ ] Tier entitlements match §2 / 17; free-tier content flagged.
- [ ] Certificates and Open Badges criteria implemented and tested; `/verify/[code]` works.
- [ ] Scores labelled "estimated"; no guarantees in copy.

### 12.7 Open questions for the founder

1. Confirm 5 vs 10 GRE mocks at launch (D10 vs 03 §7.2).
2. PTE Part 1 timing contradiction and per-task counts: source from Pearson before blueprint build.
3. TOEFL adaptive details beyond Reading/Listening (verify).
4. Hosted code execution provider (Piston vs Judge0 vs managed) and compute budget for DL/GenAI notebooks.
5. Legal review of Cisco/CCNA mentions and each exam owner's trademark policy beyond ETS.
6. Which BD universities' faculty will review the CSE packs?
