# LUMEN ACADEMY — MASTER UI/UX OVERHAUL RUNBOOK (BATCHES P0 -> P14)

**File Location:** `/home/ayra/Lumen_tech/Lumen_tech/docs/lumen_ui_overhaul_master_runbook.md`

**Companion References:** `docs/LUMEN-DESIGN-STRATEGY.md` & `docs/LUMEN-FAILURE-MODES-AND-VERIFICATION.md`

**Target Environment:** Fedora Linux (8 GB RAM Ceiling — Always prefix Node/pnpm commands with `NODE_OPTIONS="--max-old-space-size=2048"`)

**Git Author:** `Ayman Rahman <aymanrahman30@gmail.com>` (Local commits only — **NEVER** run `git push`)

## 0. INTERACTIVE CLI EXECUTION PROTOCOL (READ FIRST — MANDATORY FOR AGENT)

You are operating in **Interactive Single-Batch Mode**. You MUST obey these 5 execution laws on every turn:

1. **ONE BATCH PER TURN (STRICT STOP-GATE):**
   * Batches `P0` through `P9` are already completed and committed (`2be300f` -> `10a3b4a`).
   * Execute **ONLY** the specific batch requested by the user (`BATCH P10`, `BATCH P11`, `BATCH P12`, `BATCH P13`, or `BATCH P14`), or the next uncompleted batch in sequence `P10` -> `P11` -> `P12` -> `P13` -> `P14` when the user says `"continue"` or `"next"`.
   * **NEVER** chain two batches together in a single turn.

2. **NO IMPROVISATION / ZERO GUESSING / ZERO DEAD LINKS:**
   * Every CSS variable, hex code, prop, file path, and interactive handler is explicitly specified below. Do not invent props, do not add extra cards or pill badges, and do not modify files outside the batch's **Allowed Files** list.
   * Never hardcode the literal string `"Lumen Academy"` in `.ts` or `.tsx` files—always import `{ brand } from '@lumen/config'` and use `brand.name` so `brand-sweep.test.ts` passes.
   * **Functional Mandate:** Every button, tab, accordion, calculator input, simulator control, and checkout selector MUST work interactively with zero broken links (`404`) and zero unhandled runtime errors.

3. **PROTECTED i18n FILES (NEVER MODIFY):**
   * The Bengali switcher and translation pipeline are working and locked. You must **NEVER** modify:
     * `apps/web/app/[locale]/_components/LocaleSwitcher.tsx`
     * `apps/web/app/[locale]/_components/LocaleLink.tsx`
     * `apps/web/app/[locale]/_components/TranslatedText.tsx`
     * `apps/web/app/api/translate/route.ts`

4. **MANDATORY RECEIPTS BEFORE STOPPING:**
   * A batch is NOT complete until you run its verification commands and paste the raw output of:
     1. `pnpm design:lint`
     2. `pnpm design:shots`
     3. `NODE_OPTIONS="--max-old-space-size=2048" pnpm --filter @lumen/core exec vitest run src/__tests__/brand-sweep.test.ts src/__tests__/i18n-pages-coverage.test.ts src/__tests__/ui-primitives-caps.test.ts`
     4. `cd apps/web && NODE_OPTIONS="--max-old-space-size=2048" pnpm exec tsc --noEmit --incremental`
     5. `git status -sb` and `git diff --stat HEAD~1`

5. **END-OF-BATCH HALT MESSAGE:**
   * After committing the completed batch locally to `main`, end your response with:
     > **`BATCH <ID> COMPLETE AND COMMITTED. Waiting for your instruction: reply "continue" to run Batch <NEXT_ID>, or tell me any adjustments you want first.`**

---

## 1. COMPLETED FOUNDATION SUMMARY (BATCHES P0 -> P9)

* **P0–P5 Status:** Completed on `main` (`2be300f` -> `0c2fb7a`). Installed the 12 UI Laws, `tokens.css`, closed UI primitives (`primitives.tsx`), 3-tier `HeaderFooter.tsx`, `marketing.ts` bilingual store, primitive-only marketing pages (`/`, `/courses`, `/gre`, `/ielts`, `/pricing`, `/help`, `/dev/ui`), `tooling/design-lint.mjs`, and `tooling/design-shots.mjs`.
* **P6–P9 Status:** Completed on `main` (`e770cb6` -> `10a3b4a`). Applied the warm IELTS crimson (`#C8102E`) and sunset orange (`#FF5A26`) palette, replaced broken SVG data URIs with open-source Unsplash photography + JSX graphic backdrops, flattened `BangladeshPaymentTrustBar.tsx`, and overhauled `/sign-in`, `/sign-up`, and `/exam/diagnostic`.

---

## 2. SEQUENTIAL ROADMAP FOR BATCHES P10 -> P14 (ALL 3 OPTIONS IN ORDER)

| Batch | Scope | Target Routes & Components | Recommended Model |
| :--- | :--- | :--- | :--- |
| **BATCH P10** | **Bespoke Pearl/Bone Stationery Canvas Upgrade** | `tokens.css`, `primitives.tsx`, `HeaderFooter.tsx`, `AuthForm.tsx`, `diagnostic/page.tsx` | `Gemini 4 Hydrogen (Low/Med)` |
| **BATCH P11** | **Option 1A — Checkout, Institution Portal & Score Calculators** | `/checkout`, `/for-institutions`, `/tools/gre-score-calculator`, `/tools/ielts-band-calculator`, `live-gre-widget.tsx` | `Gemini 4 Hydrogen (Medium)` |
| **BATCH P12** | **Option 1B — CD-IELTS Split-Screen Simulator Overhaul** | `/exam/ielts-preview` (Reading Split-Pane, Highlighter, Listening Runner, Writing Word Counter, Speaking Timer) | `Gemini 4 Hydrogen (Medium)` |
| **BATCH P13** | **Option 3 — Unify Learner Workspace (`(learner)` / `/app/*`)** | `(learner)/layout.tsx`, `/app`, `/app/vocab`, `/app/vocab/play`, `/app/flashcards`, `/app/practice`, `/app/mistakes`, `/app/progress`, `/app/plan`, `/app/settings` | `Gemini 4 Hydrogen (Medium)` |
| **BATCH P14** | **Option 2 — Full-Site Link Integrity, E2E Functional & Visual Audit** | `tooling/design-lint.mjs`, `tooling/design-shots.mjs`, internal link crawler, 0-broken-route verification | `Gemini 4 Hydrogen (Medium)` |

---

## 3. STEP-BY-STEP EXECUTION BATCHES (P10 -> P14)

### BATCH P10: Bespoke Pearl / Bone Stationery Canvas Upgrade (`tokens.css` & Surface Paper Hierarchy)

* **Recommended Model:** `Gemini 4 Hydrogen (Low)` or `Gemini 4 Hydrogen (Medium)`
* **Objective:** Move away from harsh `#FFFFFF` white to a subtle, tactile **Pearl / Bone cotton-paper backdrop (`#FAF7F2`)** with **Crisp Alabaster elevated sheets (`#FDFCFB`)**, **Warm Eggshell hero stone (`#F3EDE2`)**, **Pale Rose-Champagne alternating bands (`#F6ECE8`)**, and **Warm Letterpress Hairline rules (`#E5DDD3`)** across all primitives and layouts.
* **Allowed Files to Edit:**
  * `apps/web/app/tokens.css`
  * `apps/web/src/components/ui/primitives.tsx`
  * `apps/web/src/components/ui/HeaderFooter.tsx`
  * `apps/web/app/[locale]/(auth)/_components/AuthForm.tsx`
  * `apps/web/app/[locale]/(exam)/exam/diagnostic/page.tsx`

#### Step P10.1: Update `apps/web/app/tokens.css` to the Pearl / Bone Stationery Palette
Update `:root` and `body` in `apps/web/app/tokens.css`:
```css
:root {
  color-scheme: light;
  --bg: #FAF7F2;              /* Subtle Pearl / Bone Cotton Paper Default Canvas */
  --surface-paper: #FDFCFB;   /* Crisp Alabaster Elevated Sheet (MegaMenu, UtilityBar, Exam Sheet, CtaBand Card) */
  --bg-warm: #F3EDE2;         /* Warm Eggshell / Silian Rail Hero & Editorial Backdrop */
  --bg-tint: #F6ECE8;         /* Pale Rose-Champagne Alternating Band & Notice Surface */
  --surface-translucent: rgba(250, 247, 242, 0.90);
  --brand: #C8102E;           /* Institutional IELTS Crimson Red */
  --brand-deep: #231116;      /* Deep Warm Espresso-Aubergine for MainNav, SubBar & Footer */
  --brand-ink: #1E0F13;       /* Deep Warm Charcoal-Espresso for Headings */
  --text: #4A3339;            /* Warm Umber-Slate Body Text (>= 7.5:1 contrast on #FAF7F2) */
  --link: #B80D27;            /* Deep Crimson Underlined Action Links */
  --accent: #FF5A26;          /* Vibrant Sunset Orange / Coral Accent */
  --crimson: #D90429;         /* Vivid Crimson Step Squares & Hero Bands */
  --terracotta: #E04F26;      /* Warm Terracotta-Orange Dashed Arrows & Accents */
  --soft-btn: #FFE2D6;        /* Soft Warm Peach-Orange Button Fill */
  --focus: #D90429;           /* Focus Ring */
  --hairline: #E5DDD3;        /* Warm Letterpress Stone Hairline Divider */
  --shadow-hard: 6px 6px 0px #231116;
}

html,
body {
  background-color: var(--bg);
  color: var(--text);
}
```

#### Step P10.2: Wire `var(--bg)` and `var(--surface-paper)` Cleanly
1. In `apps/web/src/components/ui/primitives.tsx`:
   * Ensure `<Section tone="white">` uses `bg-[var(--bg)]` (`#FAF7F2` pearl/bone) so the default page canvas is warm pearl/bone rather than sterile `#FFFFFF`.
   * Ensure the single elevated card inside `<CtaBand>` and interactive tab panels use `bg-[var(--surface-paper)]` (`#FDFCFB` crisp alabaster) with `border border-[var(--hairline)]`.
2. In `apps/web/src/components/ui/HeaderFooter.tsx`:
   * Ensure `UtilityBar` and open `MegaMenu` panels use `bg-[var(--surface-paper)]`.
3. In `apps/web/app/[locale]/(auth)/_components/AuthForm.tsx` and `apps/web/app/[locale]/(exam)/exam/diagnostic/page.tsx`:
   * Replace any remaining hardcoded `bg-white` on elevated sheets/inputs with `bg-[var(--surface-paper)]` so the pearl/alabaster paper hierarchy is 100% consistent.

#### Step P10.3: Verify, Commit & Halt
1. Run `pnpm design:lint`, `pnpm design:shots`, `NODE_OPTIONS="--max-old-space-size=2048" pnpm --filter @lumen/core exec vitest run src/__tests__/brand-sweep.test.ts src/__tests__/i18n-pages-coverage.test.ts src/__tests__/ui-primitives-caps.test.ts`, and `cd apps/web && NODE_OPTIONS="--max-old-space-size=2048" pnpm exec tsc --noEmit --incremental`.
2. Commit to `main` and **HALT** with verification receipts.

---

### BATCH P11: Option 1A — Unify Checkout (`/checkout`), Score Calculators (`/tools/*`), Institutional Portal (`/for-institutions`) & Live GRE Widget

* **Recommended Model:** `Gemini 4 Hydrogen (Medium)`
* **Objective:** Bring `/checkout`, `/for-institutions`, `/tools/gre-score-calculator`, `/tools/ielts-band-calculator`, and `live-gre-widget.tsx` into the exact same Pearl/Crimson/Orange institutional design system (zero `rounded-2xl`/`3xl`/`full` bubbles, zero dark glassmorphic cards, 100% working interactive calculators and checkout plan selector).
* **Allowed Files to Edit/Create:**
  * `apps/web/app/[locale]/(marketing)/checkout/page.tsx`
  * `apps/web/app/[locale]/(marketing)/for-institutions/page.tsx`
  * `apps/web/app/[locale]/(marketing)/tools/gre-score-calculator/page.tsx`
  * `apps/web/app/[locale]/(marketing)/tools/ielts-band-calculator/page.tsx`
  * `apps/web/app/[locale]/(marketing)/_components/live-gre-widget.tsx`
  * `apps/web/src/components/ui/primitives.tsx` (if adding clean composite wrappers so marketing pages remain 100% compliant with `design:lint`)

#### Step P11.1: Overhaul `live-gre-widget.tsx` (Embedded on `/gre` & `/courses`)
1. Remove all `rounded-2xl`, `rounded-3xl`, `rounded-full`, and nested dashed hint boxes inside `apps/web/app/[locale]/(marketing)/_components/live-gre-widget.tsx`.
2. Style the widget as a crisp `bg-[var(--surface-paper)] border border-[var(--hairline)] rounded-none` ETS assessment sheet with:
   * Top status strip (`bg-[var(--bg-tint)] border-b border-[var(--hairline)] px-6 py-3 flex items-center justify-between`).
   * Classic 2-column Quantitative Comparison table (`grid grid-cols-2 divide-x divide-[var(--hairline)] border border-[var(--hairline)] my-6`).
   * Rectangular `rounded-[4px]` answer choices `[A]`–`[D]` with instant interactive Distractor Trap Forensic feedback and a flat hairline-divided 3-tier progressive hint list.

#### Step P11.2: Overhaul `/checkout` (`apps/web/app/[locale]/(marketing)/checkout/page.tsx`)
1. Read `?plan=` query param (`gre-core`, `gre-plus`, `gre-live`, `ielts-complete`, `all-access`, etc.) and allow switching plans interactively on the page.
2. Style `/checkout` with the Pearl/Bone (`var(--bg)`) canvas and a clean 12-column architectural split (`lg:grid-cols-12 gap-10`):
   * **Left 7 Columns (`lg:col-span-7`):** Step 1: Plan & Schedule Selection (Full Payment vs. `0% bKash 2-Part / 3-Part Split-Pay` toggle on eligible plans); Step 2: Payment Method Selector (`bKash`, `Nagad`, `Rocket`, `Visa / Mastercard via SSLCommerz`) using sharp `rounded-[4px]` architectural radio rows (zero neon pills!).
   * **Right 5 Columns (`lg:col-span-5 bg-[var(--surface-paper)] border border-[var(--hairline)] p-6 sm:p-8`):** Transparent Order Ledger showing Subtotal, included `15% Mushak 6.3 VAT` breakdown (English digits in `en`, Bengali digits in `bn`), installment schedule dates if Split-Pay is selected, `<BangladeshPaymentTrustBar variant="light" locale={locale} />`, and a working interactive **"Proceed to Verified Checkout →"** flow (with instant demo entitlement activation / receipt preview so the user can test the complete purchase journey end-to-end!).

#### Step P11.3: Overhaul `/tools/gre-score-calculator` & `/tools/ielts-band-calculator` & `/for-institutions`
1. Ensure all three routes exist, compile cleanly, and use the Pearl/Crimson/Orange institutional design tokens (`var(--bg)`, `var(--surface-paper)`, `var(--bg-warm)`, `var(--brand)`, `var(--hairline)`, `rounded-[4px]`):
   * **GRE Raw-to-Scaled Score Calculator (`/tools/gre-score-calculator`):** Interactive sliders/inputs for Verbal Section 1 (0–12) & Section 2 (0–15) and Quant Section 1 (0–12) & Section 2 (0–15), computing real-time adaptive routing (`Easy` / `Medium` / `Hard` panel), Scaled Score (`260–340`), and Percentile Rank, with a direct CTA to `/exam/diagnostic`.
   * **IELTS 4-Skill Band Calculator (`/tools/ielts-band-calculator`):** Interactive inputs for Listening raw score (0–40), Reading raw score (0–40, Academic vs. General Training toggle), Writing Band (0.0–9.0), and Speaking Band (0.0–9.0), computing exact 0.5-rounded Overall Band Score and CEFR level (`B1`–`C2`), with a direct CTA to `/exam/ielts-preview`.
   * **Universities & Schools Portal (`/for-institutions`):** Clean institutional page using closed primitives (`Breadcrumb`, `HeroBand`, `StatRow`, `SideHeadingBlocks`, `CtaBand`) for university departments and partner schools.

#### Step P11.4: Verify, Commit & Halt
1. Run `pnpm design:lint`, `pnpm design:shots`, `NODE_OPTIONS="--max-old-space-size=2048" pnpm --filter @lumen/core exec vitest run src/__tests__/brand-sweep.test.ts src/__tests__/i18n-pages-coverage.test.ts src/__tests__/ui-primitives-caps.test.ts`, and `cd apps/web && NODE_OPTIONS="--max-old-space-size=2048" pnpm exec tsc --noEmit --incremental`.
2. Commit to `main` and **HALT** with verification receipts.

---

### BATCH P12: Option 1B — Overhaul CD-IELTS Split-Screen Simulator (`/exam/ielts-preview`)

* **Recommended Model:** `Gemini 4 Hydrogen (Medium)`
* **Objective:** Bring `/exam/ielts-preview` (`apps/web/app/[locale]/(exam)/exam/ielts-preview/page.tsx`) into the unified Pearl/Crimson/Espresso institutional CBT design language while ensuring all 4 interactive skill tabs (`Reading Split-Pane`, `Listening Audio Runner`, `Writing Task 2 Word-Counter & Rubric`, `Speaking Cue-Card Timer`) work smoothly in both `en` and `bn`.
* **Allowed Files to Edit:**
  * `apps/web/app/[locale]/(exam)/exam/ielts-preview/page.tsx`
  * `tooling/design-lint.mjs` (to add `ielts-preview/page.tsx` to `[surface-guard]`)
  * `tooling/design-shots.mjs` (to add `/exam/ielts-preview` to the static & live audit list)

#### Step P12.1: Restyle & Verify All Interactive Controls on `/exam/ielts-preview`
1. **Zero `rounded-full`, zero `rounded-2xl`, zero `rounded-3xl` bubbles!**
2. **Top Institutional CD-IELTS Header Bar (`bg-[var(--brand-deep)] text-white h-16 px-4 sm:px-8 border-b-4 border-[var(--brand)] flex items-center justify-between`):**
   * Left: `<LocaleLink>` back to `/ielts` with `<LumenSparkMotif inverse />` + `{brand.name}` + vertical hairline + `CD-IELTS™ Official-Format Workbench`.
   * Center/Right: 4 rectangular skill switcher buttons (`Listening`, `Reading`, `Writing`, `Speaking` in `rounded-[4px]`), `<LocaleSwitcher />` (untouched), and rectangular countdown timer.
3. **Interactive Split-Pane Workbench (`bg-[var(--bg-warm)] min-h-[calc(100dvh-8rem)]`):**
   * **Reading Tab:** Left pane (`bg-[var(--surface-paper)] border border-[var(--hairline)] p-6 sm:p-8`) with passage text and working **Yellow / Coral Text Highlighter buttons**; Right pane (`bg-[var(--surface-paper)] border border-[var(--hairline)] p-6 sm:p-8`) with interactive True / False / Not Given & Matching Heading questions and instant band explanation on check.
   * **Listening Tab:** Single-play simulated audio progress bar with play/pause control, transcript reveal toggle, and interactive completion items.
   * **Writing Tab:** Split screen with Task 2 prompt on left and live word-counting essay editor on right + 1-click **"Evaluate Sample Band Breakdown"** showing the 4-criterion rubric (`Task Response`, `Coherence & Cohesion`, `Lexical Resource`, `Grammatical Range`).
   * **Speaking Tab:** Part 2 Cue Card with working 1-minute prep timer / 2-minute speaking timer and band descriptor checklist.
4. **Bottom Question Palette Bar (`bg-[var(--brand-deep)] text-white h-14 px-6 border-t border-white/15 flex items-center justify-between`):**
   * Square `h-8 w-8 rounded-[4px]` question number buttons + `Submit & View Band Report` action.

#### Step P12.2: Verify, Commit & Halt
1. Run `pnpm design:lint`, `pnpm design:shots`, `NODE_OPTIONS="--max-old-space-size=2048" pnpm --filter @lumen/core exec vitest run src/__tests__/brand-sweep.test.ts src/__tests__/i18n-pages-coverage.test.ts src/__tests__/ui-primitives-caps.test.ts`, and `cd apps/web && NODE_OPTIONS="--max-old-space-size=2048" pnpm exec tsc --noEmit --incremental`.
2. Commit to `main` and **HALT** with verification receipts.

---

### BATCH P13: Option 3 — Unify Learner Workspace (`(learner)` / `/app/*`)

* **Recommended Model:** `Gemini 4 Hydrogen (Medium)`
* **Objective:** Bring the existing `(learner)` workspace routes (`(learner)/layout.tsx`, `/app`, `/app/vocab`, `/app/vocab/play`, `/app/flashcards`, `/app/practice`, `/app/mistakes`, `/app/progress`, `/app/plan`, `/app/settings`) into the Pearl/Bone (`--bg`), Alabaster (`--surface-paper`), Warm Eggshell (`--bg-warm`), Deep Espresso (`--brand-deep`), IELTS Crimson (`--brand`), and Hairline (`--hairline`) design language so every tool and workspace screen feels like one cohesive institutional stationery product and works interactively in `en` and `bn`.
* **Allowed Files to Edit:**
  * `apps/web/app/[locale]/(learner)/layout.tsx`
  * `apps/web/app/[locale]/(learner)/app/page.tsx`
  * `apps/web/app/[locale]/(learner)/app/vocab/page.tsx`
  * `apps/web/app/[locale]/(learner)/app/vocab/play/page.tsx`
  * `apps/web/app/[locale]/(learner)/app/flashcards/page.tsx`
  * `apps/web/app/[locale]/(learner)/app/practice/page.tsx`
  * `apps/web/app/[locale]/(learner)/app/mistakes/page.tsx`
  * `apps/web/app/[locale]/(learner)/app/progress/page.tsx`
  * `apps/web/app/[locale]/(learner)/app/plan/page.tsx`
  * `apps/web/app/[locale]/(learner)/app/settings/page.tsx`
  * `docs/lumen_ui_overhaul_master_runbook.md`

#### Step P13.1: Restyle `(learner)/layout.tsx` & Core Learner Screens
1. **Learner Workspace Shell (`(learner)/layout.tsx`):**
   * Sidebar & Top Header using `bg-[var(--brand-deep)] text-white` with `border-b-4 border-[var(--brand)]`, `<LumenSparkMotif inverse />`, `{brand.name}`, `<LocaleSwitcher />` (untouched), `<LocaleLink>` navigation, and crisp `rounded-[4px]` nav items (`Dashboard`, `Mastery & Analytics`, `Practice & Drills`, `FSRS Vocab`, `Mistake Notebook`, `Study Plan`, `Settings & Allowances`, `IELTS Simulator`).
   * Main canvas background set to `bg-[var(--bg)] text-[var(--text)]`.
2. **Eliminate Rounded Bubble Soup Across `/app/*`:**
   * Replace all `rounded-2xl`, `rounded-3xl`, `rounded-full` pill badges, and `shadow-lg`/`shadow-xl`/`shadow-sm` with crisp `rounded-none` or `rounded-[4px]` containers using `bg-[var(--surface-paper)] border border-[var(--hairline)]` and exposed hairline grids (`divide-y` / `divide-x divide-[var(--hairline)]`).
   * Keep all existing interactive state, FSRS flashcard flip & rating buttons on `/app/vocab/play` (`Again`, `Hard`, `Good`, `Easy`), practice launchers on `/app/practice`, mistake filters on `/app/mistakes`, study-plan toggles on `/app/plan`, and settings/allowance panels on `/app/settings` 100% functional in both `en` and `bn`.

#### Step P13.2: Verify, Commit & Halt
1. Run `pnpm design:lint`, `pnpm design:shots`, `NODE_OPTIONS="--max-old-space-size=2048" pnpm --filter @lumen/core exec vitest run src/__tests__/brand-sweep.test.ts src/__tests__/i18n-pages-coverage.test.ts src/__tests__/ui-primitives-caps.test.ts`, and `cd apps/web && NODE_OPTIONS="--max-old-space-size=2048" pnpm exec tsc --noEmit --incremental`.
2. Commit to `main` and **HALT** with verification receipts.

---

### BATCH P14: Option 2 — Full-Site Route, Link Integrity & Visual Sign-Off Audit (`pnpm design:lint` + `pnpm design:shots`)

* **Recommended Model:** `Gemini 4 Hydrogen (Medium)`
* **Objective:** Add an automated internal route & link integrity checker to `tooling/design-lint.mjs` so every `href` in `nav.ts`, `marketing.ts`, `HeaderFooter.tsx`, and `primitives.tsx` is verified to resolve to a real route in `apps/web/app/[locale]`, expand `[surface-guard]` to cover all newly unified routes, and record the final sign-off report.
* **Allowed Files to Edit:**
  * `tooling/design-lint.mjs`
  * `tooling/design-shots.mjs`
  * `packages/core/src/__tests__/ui-primitives-caps.test.ts`
  * `docs/MISTAKE-LEDGER.md`
  * `docs/HANDOFF.md`
  * `docs/logs/reviews/m2-9-institutional-ui-signoff.md`

#### Step P14.1: Add Automated Internal Route & Link Integrity Guard (`[link-guard]`)
1. In `tooling/design-lint.mjs`:
   * Extract all internal `/...` href paths from `apps/web/src/content/nav.ts` and `apps/web/src/content/marketing.ts`.
   * Verify that every path (stripping `#hash` and `?query`) resolves to an existing `page.tsx` under `apps/web/app/[locale]`! If any link points to a non-existent route, `pnpm design:lint` must fail with a clear error.
   * Expand `[surface-guard]` (`rounded-full`, `rounded-2xl`, `rounded-3xl` ban) to cover `BangladeshPaymentTrustBar.tsx`, `AuthForm.tsx`, `diagnostic/page.tsx`, `ielts-preview/page.tsx`, `live-gre-widget.tsx`, and `checkout/page.tsx`.
2. In `tooling/design-shots.mjs`:
   * Include `/checkout`, `/for-institutions`, `/tools/gre-score-calculator`, `/tools/ielts-band-calculator`, `/exam/ielts-preview`, `/dashboard`, and `/vocab` in the static & live Playwright verification matrix (`390px`, `768px`, `1440px` across `en` and `bn`).

#### Step P14.2: Final Verification, Documentation Update & Commit
1. Run:
   * `pnpm design:lint`
   * `pnpm design:shots`
   * `NODE_OPTIONS="--max-old-space-size=2048" pnpm --filter @lumen/core exec vitest run src/__tests__/brand-sweep.test.ts src/__tests__/i18n-pages-coverage.test.ts src/__tests__/ui-primitives-caps.test.ts`
   * `cd apps/web && NODE_OPTIONS="--max-old-space-size=2048" pnpm exec tsc --noEmit --incremental`
2. Update `docs/HANDOFF.md`, `docs/MISTAKE-LEDGER.md`, and `docs/logs/reviews/m2-9-institutional-ui-signoff.md` with the final P10–P14 sign-off metrics.
3. Commit to `main` and print the complete verification report.