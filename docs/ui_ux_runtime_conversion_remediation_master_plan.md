# Master Plan: Institutional Design Overhaul, Universal Bilingual Engine, Official Exam Guides & Cloud Cutover (Milestones M2.6 $\rightarrow$ M5)

**Status:** Active Master Blueprint (Neurosurgical Specification)  
**Target Environment:** Fedora 44 KDE Plasma (8 GB RAM Ceiling, `NODE_OPTIONS="--max-old-space-size=2048"`)  
**Design Benchmarks:** [ETS GRE (`gre.org`)](https://www.gre.org/), [British Council Take IELTS (`takeielts.britishcouncil.org`)](https://takeielts.britishcouncil.org/), [IDP IELTS (`ielts.idp.com`)](https://ielts.idp.com/)

---

## 1. Forensic Root-Cause Diagnosis (From Latest Browser Screenshots)

Inspecting your latest screenshots (`localhost:3000/bn`, `/gre`, `/pricing`, `/sign-in`, `/bn/sign-up`, `/bn/courses`) reveals **4 core structural problems**:

### Problem A: Fake/Partial Bilingual Support (`EN / বাংলা` Only Works on the Navbar & Homepage Hero)
* **Evidence in Screenshots:**
  * In `image_3b8142.png`, the browser URL is **`localhost:3000/bn/sign-up`** and the `বাংলা` pill is active, yet the entire page is in English (`Create your Lumen Academy account`, `Precision Diagnostics & Active Recall...`).
  * In `image_3b2f64.png`, the browser URL is **`localhost:3000/bn/courses`** and the navbar is in Bengali (`কোর্সসমূহ`), yet the entire body is in English (`Choose Your Preparation Track`, `GRE General Test Prep`...).
  * In `image_3b8539.png`, the GRE practice question (`Let x be an integer...`) has no Bengali translation when the user is in Bengali mode.
* **Root Cause:** `Gemini 3.8 Flash` took a shortcut in Phase P2.2—it wired `LocaleSwitcher.tsx` to change the URL prefix to `/bn/...`, and translated *only* the navbar and homepage hero, while leaving hardcoded English strings inside `/courses`, `/gre`, `/ielts`, `/pricing`, `/help`, `/sign-in`, `/sign-up`, `/checkout`, and the question bank!

### Problem B: "AI-Generated SaaS" Clutter vs. Real Institutional Design (`gre.org` / British Council / IDP)
* **Evidence in Screenshots:**
  1. **Dark-Mode Cyber Grid Wallpaper (`image_3b885e.png`, `image_3b857a.png`, `image_3b84ff.png`):** The dark navy background with visible square grid lines (`bg-[linear-gradient(...)]`), sparkle emojis (`✨`), and glowing neon-bordered pills is the #1 giveaway of an AI-generated template.
  2. **17-Pill Visual Clutter on `/pricing` (`image_3b84ff.png`):** Stacking a top sparkle badge + 3 metric pills + 4 region pills + 3 track pills + a floating dark box with 6 colorful payment pills (`bKash`, `Nagad`, `Rocket`, `Visa`, `SSLCommerz`, `Mushak 6.3`) creates visual chaos. Furthermore, `BangladeshPaymentTrustBar` was rendered **twice** on the same page (once in the hero and once above the footer in `image_3b84a3.png`)!
  3. **Developer Jargon & Competitor Name-Dropping (`image_3b857a.png`, `image_3b81b5.png`, `image_3b2f64.png`):** Real institutions like ETS, British Council, and IDP never write `"✨ Magoosh + GregMat + Brilliant Parity Suite"`, `"Seeded Live Demo"`, `"Rasch 1PL IRT"`, or `"30% fewer flashcard repetitions than legacy SM-2"` on student-facing pages. That reads like internal engineering notes rather than an authoritative test-prep academy.

### Problem C: Missing "What is GRE / IELTS & How the Real Exam Works" Guides
* **Customer Reality:** First-time test takers in Bangladesh visiting `/gre`, `/ielts`, or `/courses` need a crystal-clear, authoritative explanation of **how the real exam works** (sections, exact timing, question types, score scales, computer-delivered interface rules, and Academic vs. General Training differences) before they understand *why* they need our adaptive mocks and courses.

### Problem D: Question Bank & Dynamic Translation Architecture (Google Translate API + Pre-Compiled Cache)
* **Engineering Question:** *Can we use a Google Translate API or automated translation layer so questions and pages work in Bengali (and any future language) without manual hardcoding?*
* **Neurosurgical Solution:** **Yes—via a Two-Tier LaTeX-Safe Translation Engine (`packages/core/src/i18n/translator.ts`)**:
  1. **Why not raw client-side Google Translate widget alone?** Raw Google Translate breaks KaTeX math (`$x^2 = 16$` gets mangled into broken spans) and mistranslates exam terms (like translating *"Quantitative Comparison"* or *"True / False / Not Given"* into confusing literal phrases).
  2. **The Production Architecture:**
     * **LaTeX-Safe Translation Pipeline (`translateWithMathMask`):** Extracts all `$...$` and `$$...$$` math blocks into placeholders (`__MATH_0__`), translates the text via **Google Translate API (`translate.googleapis.com` / Cloud Translate v2)** or **Gemini Batch Translator**, and restores the exact KaTeX formulas untouched.
     * **Bilingual Question Schema (`en` + `bn`):** Every question in the diagnostic and sampler renders in **Bengali (`bn`)** when the user is on `/bn/*` (with a 1-click **"Show Original English Exam Text / ইংরেজি মূল প্রশ্ন দেখুন"** toggle, because the real ETS GRE and IDP/British Council IELTS exams are administered in English, so students need both Bengali conceptual clarity and English exam familiarity!).

---

## 2. Official Design System Specification (ETS `gre.org` + British Council + IDP Cues)

To make Lumen Academy look 100% human-designed, institutional, and trustworthy, we enforce the **Institutional Daylight Design System**:

| Design Element | ❌ Banned "AI Template" Pattern | ✅ Official ETS / British Council / IDP Standard |
| :--- | :--- | :--- |
| **Hero Backgrounds** | Dark cyber grids (`bg-slate-950` with square grid lines) and glowing radial blurs. | **Clean Daylight Editorial Split** (`#FFFFFF` and warm alabaster `#F4F6F9`) or **Solid Flat Institutional Navy (`#001E42` / `#002B49`)** with crisp white typography and zero grid lines. |
| **Color Palette** | Neon cyan/purple/emerald glowing pills on black backgrounds. | • **Core Brand (British Council Navy):** `#001E42` (Primary text/headers) & `#005EB8` (Action Blue)<br>• **GRE Track (ETS Academic Teal/Navy):** `#003057` & `#006699` on `#F2F7FA` surface<br>• **IELTS Track (British Council / IDP Crimson & Deep Teal):** `#C8102E` (IELTS accent) & `#005A70` on `#F7F9FA` surface |
| **Badges & Pills** | Emoji-stuffed pills (`✨ Next-Gen...`, `🎯 130-170...`), >3 pills per section. | **Maximum 1 clean uppercase typographic kicking label** per section (e.g., `OFFICIAL EXAM STRUCTURE` or `GRE® GENERAL TEST PREP`) with zero sparkle emojis. |
| **Copywriting Tone** | Tech-stack bragging (`Magoosh + GregMat + Brilliant Parity`, `Rasch 1PL`, `SM-2`, `Seeded Live Demo`). | **Clear Academic & Outcome Language** (`Computer-Delivered Mock Tests`, `Section-Adaptive Practice`, `Official Band 0–9 Scoring Criteria`, `Interactive Practice Question`). |
| **Payment Trust Strip** | 6 neon-colored bordered pills inside a dark rounded box repeated twice per page. | **Single, understated Footer & Checkout Trust Row** using clean, uniform neutral badges (`bKash`, `Nagad`, `Visa`, `Mastercard`, `SSLCommerz`, `15% VAT Invoice Included`). |
| **Sign-In / Sign-Up** | Floating dark card on left with fake-looking tech metrics (`30% fewer flashcard repetitions than SM-2`). | **Clean Institutional Split Screen:** Left column features a calm `#001E42` academic panel explaining what is included in a free student account (Free Diagnostic, Study Planner, Score Tracker); Right column is a crisp, fully localized (`en`/`bn`) authentication form. |

---

## 3. Phased Execution Roadmap (Milestones M2.6 $\rightarrow$ M5)

### MILESTONE M2.6: Universal Bilingual (`EN / বাংলা`) Engine, Institutional Redesign & Official Exam Guides

#### Phase P2.6.1: Universal Bilingual Dictionary & LaTeX-Safe Question Translator (Zero Hardcoded English)
* **Subphase P2.6.1a — LaTeX-Safe Translation Service (`packages/core/src/i18n/translator.ts`):**
  * Build `translateTextPreservingMath(text, targetLocale)` that masks `$...$` / `$$...$$` expressions, supports live Google Translate API (`GOOGLE_TRANSLATE_API_KEY` or `translate.googleapis.com` fallback) + deterministic dictionary lookup, and exposes a CLI script (`tooling/translate-sync.mjs`) to auto-translate any missing keys or questions into Bengali (`bn`) and future languages.
* **Subphase P2.6.1b — 100% Page & Component Localization (`apps/web/src/i18n/`):**
  * Expand `en.json` and `bn.json` and wire **every single page** to render in Bengali when `locale === 'bn'`:
    1. `/bn/courses` (`apps/web/app/[locale]/(marketing)/courses/page.tsx`)
    2. `/bn/gre` (`apps/web/app/[locale]/(marketing)/gre/page.tsx`)
    3. `/bn/ielts` (`apps/web/app/[locale]/(marketing)/ielts/page.tsx`)
    4. `/bn/pricing` (`apps/web/app/[locale]/(marketing)/pricing/page.tsx`)
    5. `/bn/help` (`apps/web/app/[locale]/(marketing)/help/page.tsx`)
    6. `/bn/sign-in` & `/bn/sign-up` (`sign-in/page.tsx`, `sign-up/page.tsx`, `AuthForm.tsx`)
    7. `/bn/checkout` (`checkout/page.tsx`)
    8. `/bn/for-institutions` & `/bn/legal/*`
* **Subphase P2.6.1c — Bilingual Exam Questions, Hints & Explanations (`/bn/gre` & `/bn/exam/diagnostic`):**
  * Add complete Bengali translations (`stemBn`, `quantityABn`, `quantityBBn`, `choicesBn`, `hintsBn`, `trapExplanationBn`) to all diagnostic and live sampler questions.
  * When `locale === 'bn'`, display the question stem, choices, hints, and trap explanations in **Bengali** (with KaTeX math `$x^2 = 16$` intact!) plus a clean toggle button (` মূল ইংরেজি প্রশ্ন দেখুন / Show Original English`) so learners can cross-reference official English test phrasing.
* **Subphase P2.6.1d — Automated Anti-Hardcoding Test Gate (`packages/core/src/__tests__/i18n-pages-coverage.test.ts`):**
  * Write a strict Vitest test that scans `apps/web/app/[locale]/` and fails if `/courses`, `/gre`, `/ielts`, `/pricing`, `/sign-in`, `/sign-up`, `/help`, or `/checkout` contain hardcoded English headings instead of locale-resolved strings.

#### Phase P2.6.2: ETS / British Council / IDP Institutional Redesign (De-Clutter & De-AI)
* **Subphase P2.6.2a — Strip Dark Cyber Grids, Emoji Pills & Jargon:**
  * Remove the square grid background pattern (`bg-[linear-gradient(...)]`), remove all `✨` / `🎯` emojis from badges, remove `"Magoosh + GregMat + Brilliant Parity Suite"`, `"Seeded Live Demo"`, `"Rasch 1PL IRT"`, and `"SM-2"` jargon across all public pages.
  * Remove the duplicate `BangladeshPaymentTrustBar` from inside the hero banners of `/` and `/pricing` so it only appears once as a clean, understated institutional trust bar in the layout footer/checkout.
* **Subphase P2.6.2b — Redesign `/`, `/courses`, `/pricing`, `/help`, `/sign-in`, `/sign-up`:**
  * Apply the **British Council / ETS Daylight Editorial System**:
    * Clean white & warm stone (`bg-slate-50`) sections with solid `#001E42` navy institutional headers, structured 2-column hero layouts, and clear typographic hierarchy.
    * On `/pricing`, reduce the 17 pills to **2 clean segmented controls** (1: Exam Track `GRE | IELTS Academic | IELTS GT`; 2: Currency `BDT (৳) | USD ($)`), and align all pricing card heights cleanly (`flex flex-col justify-between h-full`).

#### Phase P2.6.3: Official "What is GRE / IELTS & How the Real Exam Works" Interactive Guides
* **Subphase P2.6.3a — "How the GRE® General Test Works" Section on `/gre` (Modeled on `gre.org`):**
  * Add a structured, bilingual (`en`/`bn`) guide covering:
    1. **At-a-Glance Exam Blueprint:** Total time (`1 hr 58 mins`), 3 measures (`Analytical Writing`, `Verbal Reasoning`, `Quantitative Reasoning`), score scale (`260–340 Total`, `130–170` per section, `0–6` AWA).
    2. **Section-by-Section Timing & Question Count Table:**
       * *Analytical Writing:* 1 section • 1 "Analyze an Issue" essay • 30 minutes.
       * *Verbal Reasoning:* Section 1 (12 Qs, 18 mins) + Section 2 (15 Qs, 23 mins) • Reading Comprehension, Text Completion (1–3 blanks), Sentence Equivalence.
       * *Quantitative Reasoning:* Section 1 (12 Qs, 21 mins) + Section 2 (15 Qs, 26 mins) • Quantitative Comparison, Multiple-Choice (Single & Multiple Answer), Numeric Entry • On-screen calculator provided.
    3. **How Multi-Stage Section-Adaptive Routing Works:** Visual step-by-step explanation of how your accuracy in Section 1 selects the difficulty tier of Section 2 and determines your 130–170 score ceiling.
* **Subphase P2.6.3b — "How the IELTS™ Exam Works" Section on `/ielts` (Modeled on `takeielts.britishcouncil.org` & `ielts.idp.com`):**
  * Add a structured, bilingual (`en`/`bn`) guide covering:
    1. **Academic vs. General Training Selector:** Clear side-by-side comparison of **IELTS Academic** (for UK/US/Canada/Australia/Europe university admissions & medical/engineering registration) vs. **IELTS General Training** (for skilled migration, PR, Express Entry, and work visas).
    2. **The 4 Test Papers (Total Time: ~2 hrs 45 mins):**
       * *Listening (30 mins • 4 Parts • 40 Questions):* Played once only; covers everyday conversations to academic lectures.
       * *Reading (60 mins • 3 Passages • 40 Questions):* True/False/Not Given, Matching Headings, Summary Completion, Multiple Choice (no extra transfer time in Computer-Delivered IELTS).
       * *Writing (60 mins • 2 Tasks):* Task 1 (20 mins, $\ge 150$ words: Chart/Graph/Process report for Academic; Formal/Semi-formal Letter for GT) + Task 2 (40 mins, $\ge 250$ words: Discursive Essay carrying **2x weight**).
       * *Speaking (11–14 mins • 3 Parts):* Face-to-face / recorded interview: Part 1 Familiar Topics (4–5 mins), Part 2 Cue Card Long Turn (1 min prep + 2 mins speaking), Part 3 Two-Way Abstract Discussion (4–5 mins).
    3. **How IELTS Band Scores (0–9) & CEFR Mapping Work:** Interactive table showing how raw Listening/Reading scores out of 40 map to Bands 5.0–9.0 and how the 4 skill bands average and round to the nearest 0.5 Band.
* **Subphase P2.6.3c — "Which Exam Do I Need? (GRE vs. IELTS Guide)" on `/courses`:**
  * Add a clear comparison table helping Bangladeshi students understand whether they need **IELTS only** (UK/Australia/Europe/Canada coursework Master's or PR), **GRE + IELTS** (US Master's/PhD & STEM fellowships/TAships), or **IELTS General Training** (Immigration).

#### Phase P2.6.4: Two-Key Visual, Translation & Anti-Jargon Audit (`Claude Sonnet 5.5 Low` / `Argon Low`)
* Verify 0 hardcoded English pages in `/bn/*`, 0 dark grid backgrounds, 0 competitor name-drops (`Magoosh`, `GregMat`), and 100% test pass.

---

### MILESTONES M3, M4 & M5 (Subsequent Backend, Content Scraper & Production Rollout)

Once Milestone M2.6 is complete and verified in your browser:
* **Milestone M3 (Cloud Cutover):** Live Neon Postgres migration (`db:push`), Cloudflare R2 presigned audio uploads, Deepgram Nova-3 STT, and Inngest background jobs.
* **Milestone M4 (Automated Content Scraper & Isomorphic Question Factory):** Build `tooling/content-pipeline/` to scrape public syllabi/lexicons and transform raw ETS/Pearson/Cambridge practice PDFs into 300+ original, copyright-clean GRE items and 6 full IELTS mocks with bilingual (`en`/`bn`) explanations.
* **Milestone M5 (Playwright Full E2E Matrix & Vercel Production Launch):** Run the 6-flow desktop/mobile Playwright suite and deploy to Vercel + Neon Singapore (`ap-southeast-1`).

---

## 4. Model Selection & Token-Efficiency Matrix

| Phase | Recommended Model | Effort | Why This Model Is Best & Prevents Shortcuts |
| :--- | :--- | :--- | :--- |
| **Phase P2.6.1** (Universal Bilingual Engine + Question Translations + `/bn` Page Wiring) | **`Gemini 3.8 Flash`** *or* **`Gemini 4 Argon`** | **High / Medium** | High-volume bilingual dictionary (`en`/`bn`) generation and prop wiring across 10 pages, enforced by a strict `i18n-pages-coverage.test.ts` gate so the model cannot skip any page. |
| **Phase P2.6.2 & P2.6.3** (ETS / British Council / IDP Redesign + Official GRE/IELTS Exam Guides) | **`Gemini 4 Argon`** *or* **`Claude Sonnet 5.5`** | **Medium** | Superior editorial taste, clean institutional typography, and accurate ETS/IDP exam structure tables without AI-template clichés. |
| **Phase P2.6.4** (Two-Key Audit of Bilingual Parity & Design Cleanliness) | **`Claude Sonnet 5.5`** *or* **`Gemini 4 Argon`** | **Low** | Fast, low-token verification that `/bn/sign-in`, `/bn/sign-up`, `/bn/courses`, `/bn/gre`, `/bn/ielts`, and `/bn/pricing` translate 100% of their content. |