# LUMEN ACADEMY — MASTER UI/UX OVERHAUL RUNBOOK (BATCHES P0 $\rightarrow$ P5)

**File Location:** `/home/ayra/Lumen_tech/Lumen_tech/docs/UI-OVERHAUL-RUNBOOK.md`  
**Companion References:** `docs/LUMEN-DESIGN-STRATEGY.md` & `docs/LUMEN-FAILURE-MODES-AND-VERIFICATION.md`  
**Target Environment:** Fedora Linux (8 GB RAM Ceiling — Always prefix Node/pnpm commands with `NODE_OPTIONS="--max-old-space-size=2048"`)  
**Git Author:** `Ayman Rahman <aymanrahman30@gmail.com>` (Local commits only — **NEVER** run `git push`)

---

## 0. INTERACTIVE CLI EXECUTION PROTOCOL (READ FIRST — MANDATORY FOR AGENT)

You are operating in **Interactive Single-Batch Mode**. You MUST obey these 5 execution laws on every turn:

1. **ONE BATCH PER TURN (STRICT STOP-GATE):**
   - Execute **ONLY** the specific batch requested by the user (or the next uncompleted batch in sequence `P0` $\rightarrow$ `P1-A` $\rightarrow$ `P1-B` $\rightarrow$ `P2` $\rightarrow$ `P3` $\rightarrow$ `P4` $\rightarrow$ `P5` when the user says `"continue"` or `"next"`).
   - **NEVER** chain two batches together in a single turn.
2. **NO IMPROVISATION / ZERO GUESSING:**
   - Every token, prop, file path, word cap, and layout sequence is locked in this document. Do not invent props, do not add extra cards/badges, and do not modify files outside the batch's **Allowed Files** list.
   - If any check fails twice or a required file is missing, **STOP** immediately and report the exact error.
3. **PROTECTED i18n FILES (NEVER MODIFY):**
   - The Bengali switcher and translation pipeline are working and locked. You must **NEVER** modify:
     - `apps/web/app/[locale]/_components/LocaleSwitcher.tsx`
     - `apps/web/app/[locale]/_components/LocaleLink.tsx`
     - `apps/web/app/[locale]/_components/TranslatedText.tsx`
     - `apps/web/app/api/translate/route.ts`
4. **MANDATORY RECEIPTS BEFORE STOPPING:**
   - A batch is NOT complete until you run its verification commands and paste the raw output of:
     1. `pnpm design:lint`
     2. The batch's `vitest` test command
     3. `cd apps/web && NODE_OPTIONS="--max-old-space-size=2048" pnpm exec tsc --noEmit --incremental`
     4. `git status -sb` and `git diff --stat HEAD~1`
5. **END-OF-BATCH HALT MESSAGE:**
   - After committing the completed batch locally to `main`, end your response with:
     > **`BATCH <ID> COMPLETE AND COMMITTED. Waiting for your instruction: reply "continue" to run Batch <NEXT_ID>, or tell me any adjustments you want first.`**

---

## 1. THE CONSTITUTION & LOCKED DESIGN DECISIONS

### 1.1 The 12 Unbreakable Lumen UI Laws
1. **Compose, don't invent.** Marketing pages (`apps/web/app/[locale]/(marketing)/**/page.tsx`) may only assemble primitives from `@/src/components/ui/primitives`. Zero raw layout `<div className="...">` inside marketing `page.tsx` files.
2. **No bordered or shadowed content cards.** Content grids (`StatRow`, `StepRow`, `MediaColumns`, `SideHeadingBlocks`, `SplitFeature`) have **zero borders, zero box-shadows, and zero rounded card wrappers**. The only allowed boxes on a marketing page are: `CalloutNotice` ($\le 1$ per page), the single white card inside `CtaBand`, and buttons. Never nest a box inside a box.
3. **No eyebrow labels.** Zero `ALL-CAPS` micro-text labels above headings or inside cards. Section `H2` headings use the geometric `<LumenSparkMotif />` SVG mark instead.
4. **Tokens only.** Zero hex/rgb literals and zero arbitrary Tailwind bracket values (`text-[10px]`, `p-[13px]`) outside `apps/web/app/tokens.css`.
5. **Whitespace budget.** Sections use `<Section>` (`py-14 md:py-20 lg:py-28`, `max-w-[1200px]`, `gap-8 lg:gap-12`). Never shrink spacing to fit more text; cut text instead.
6. **Strict word caps.** Titles $\le 10$ words; Hero body $\le 35$ words; Section intro $\le 60$ words; Column/Step/Block body $\le 40$ words; Pricing bullets $\le 4$ items per plan ($\le 10$ words each).
7. **Progressive disclosure.** Any list $> 3$ items, any syllabus module list, any comparison table, and any FAQ list must be placed inside `<Disclosure>` (closed by default) or `<Tabs>`. Zero raw `<table>` tags on marketing pages outside a `<Disclosure>` or `<Tabs>` panel.
8. **One primary action per section.** Maximum one filled button per section; secondary actions are underlined text links.
9. **Truthful, verified data only.** Never invent testimonials, student names, or unverified stats. Use only the locked content in `apps/web/src/content/marketing.ts` and named media slots in `apps/web/src/content/media.ts`.
10. **Bilingual-first (`en` + `bn`).** Every string exists in both English and Bengali. No fixed heights (`h-...`) or `truncate` on text containers. Bengali (`:lang(bn)`) gets `line-height: 1.75`, `letter-spacing: 0`, and `text-transform: none`.
11. **Protected i18n paths.** Never touch `LocaleSwitcher.tsx`, `LocaleLink.tsx`, `TranslatedText.tsx`, or `api/translate/route.ts`.
12. **Receipts required.** Every batch requires raw CLI output of `pnpm design:lint`, tests, and `tsc`.

### 1.2 Locked Answers to All Strategy Decisions (Zero Ambiguity)
- **Decision 1 (Color Skin):** **Option A (Lumen Institutional Skin)** in `tokens.css`, with `--crimson: #E4002B` for numbered step squares and `/ielts` hero accent, and `--terracotta: #C84B31` for `/gre` mega-menu dashed arrows.
- **Decision 2 (Photography):** Named slots in `apps/web/src/content/media.ts` rendered exclusively through `<PlaceholderImage slot="..." aspect="16:10" | "4:3" />` using clean, un-tilted `0px`-radius frames and deterministic SVG/WebP academic illustrations so pages never break offline or fail CSP.
- **Decision 3 (Verified Stats for `StatRow`):**
  1. `1h 58m` — Computer-Delivered GRE Format (`verified: true`)
  2. `4 Skills` — IELTS Listening, Reading, Writing & Speaking (`verified: true`)
  3. `1,500+` — Bilingual Active-Recall Vocabulary Cards (`verified: true`)
  4. `15% VAT` — Official Mushak 6.3 Invoice Included (`verified: true`)
- **Decision 4 (Courses & Pricing Data):** Centralized in `apps/web/src/content/marketing.ts` with Latin numerals (`৳ 5,990`) in `en` and Bengali numerals (`৳ ৫,৯৯০`) in `bn`.
- **Decision 5 (Mobile Target):** $390\text{px}$ mobile viewport is a primary gate alongside $768\text{px}$ and $1440\text{px}$.
- **Decision 6 (Trademark Line):** Standard non-affiliation disclaimer for ETS, British Council, IDP, and Cambridge included in `InstitutionalFooter`.

---

## 2. SEQUENTIAL EXECUTION BATCHES

---

### BATCH P0: Constitution Files, `tokens.css` & `pnpm design:lint` Gate

- **Recommended Model:** `Gemini 4 Hydrogen (Medium)` or `Gemini 4 Argon (Low/Medium)`
- **Objective:** Install the 12 UI Laws into `AGENTS.md` and `.claude/skills/institutional-ui/SKILL.md`, create `docs/MISTAKE-LEDGER.md`, define `apps/web/app/tokens.css`, and wire `tooling/design-lint.mjs` (`pnpm design:lint`).
- **Allowed Files to Create/Edit:**
  - `AGENTS.md`
  - `.claude/skills/institutional-ui/SKILL.md`
  - `docs/MISTAKE-LEDGER.md`
  - `apps/web/app/tokens.css`
  - `apps/web/app/globals.css` (only to add `@import "./tokens.css";`)
  - `tooling/design-lint.mjs`
  - `package.json` (only to add `"design:lint": "node tooling/design-lint.mjs"`)

#### Step P0.1: Write `AGENTS.md` and `.claude/skills/institutional-ui/SKILL.md`
Write the 12 Lumen UI Laws from Section 1.1 above and the Source-of-Truth Hierarchy (`AGENTS.md > tokens.css > primitives.tsx > content/marketing.ts > page blueprints`) into both `AGENTS.md` and `.claude/skills/institutional-ui/SKILL.md`.

#### Step P0.2: Initialize `docs/MISTAKE-LEDGER.md`
Create `docs/MISTAKE-LEDGER.md` with the table header `| Date | Task | Model | Mistake Class | Caught By | Root Cause | Permanent Fix | Merged? |` and 4 initial rows documenting:
1. `B1 Completeness Bias` (1,200-word course dump on `/courses` $\rightarrow$ Fixed by `<Disclosure>` & word caps).
2. `B2 Template Pull` (34+ nested bordered cards on `/` $\rightarrow$ Fixed by `primitives.tsx` with zero `className` passthrough).
3. `B3 Prompt Echoing` (Literal prompt text inside rounded pill badges $\rightarrow$ Fixed by banning eyebrows and `brand-sweep.test.ts`).
4. `B8 Locale Digit Mismatch` (Bengali numerals on English `/pricing` $\rightarrow$ Fixed by locale-keyed `priceEn` / `priceBn` in `marketing.ts`).

#### Step P0.3: Create `apps/web/app/tokens.css` & Import in `apps/web/app/globals.css`
Create `apps/web/app/tokens.css` with these exact tokens and typography classes:
```css
:root {
  color-scheme: light;
  --bg: #FFFFFF;
  --bg-tint: #F4EFFB;
  --bg-warm: #F6F1EA;
  --brand: #2D006B;
  --brand-ink: #1A1038;
  --text: #3B3552;
  --link: #4B1FB8;
  --accent: #FFB400;
  --crimson: #E4002B;
  --terracotta: #C84B31;
  --soft-btn: #DCCBFF;
  --focus: #005FCC;
  --hairline: #E4DDF2;
  --shadow-hard: 6px 6px 0px #1A1038;
}

.lumen-h1 {
  font-size: clamp(2.25rem, 3.8vw, 3.25rem);
  line-height: 1.12;
  font-weight: 800;
  color: var(--brand-ink);
  letter-spacing: -0.02em;
}

.lumen-h2 {
  font-size: clamp(1.75rem, 2.6vw, 2.25rem);
  line-height: 1.2;
  font-weight: 800;
  color: var(--brand-ink);
  letter-spacing: -0.015em;
}

.lumen-h3 {
  font-size: 1.25rem;
  line-height: 1.3;
  font-weight: 700;
  color: var(--brand);
}

.lumen-body {
  font-size: 1.0625rem;
  line-height: 1.65;
  color: var(--text);
  max-width: 65ch;
}

:lang(bn) .lumen-h1,
:lang(bn) .lumen-h2,
:lang(bn) .lumen-h3,
:lang(bn) .lumen-body {
  line-height: 1.75;
  letter-spacing: 0 !important;
  text-transform: none !important;
}
```
And import `@import "./tokens.css";` at the top of `apps/web/app/globals.css`.

#### Step P0.4: Create `tooling/design-lint.mjs` & Add `"design:lint"` to Root `package.json`
Create `tooling/design-lint.mjs` that checks:
1. **Protected i18n Diff Guard:** Checks `git status --porcelain` and `git diff --name-only HEAD` to ensure `LocaleSwitcher.tsx`, `LocaleLink.tsx`, `TranslatedText.tsx`, and `api/translate/route.ts` have zero modifications.
2. **Suppression Ban:** Scans `apps/web/src` (if present) for `@ts-ignore`, `@ts-nocheck`, `eslint-disable`, or `: any`.
3. **Primitive-Only Page Guard:** For every `apps/web/app/[locale]/(marketing)/**/page.tsx` file that imports from `@/src/components/ui/primitives` (or for all 6 marketing pages once `--strict-pages` is enabled in Batch P4), fails if the `page.tsx` file contains `className=`, `style=`, `<table`, `#` hex codes, `rounded-xl`, `rounded-2xl`, `rounded-3xl`, or `shadow-`.

#### Step P0.5: Verify, Commit & Halt
1. Run `pnpm design:lint` and `cd apps/web && NODE_OPTIONS="--max-old-space-size=2048" pnpm exec tsc --noEmit --incremental`.
2. Commit all changes to `main` as `Ayman Rahman <aymanrahman30@gmail.com>`.
3. Print raw verification outputs and **HALT** waiting for user instruction.

---

### BATCH P1-A: Closed UI Primitives Catalog (`primitives.tsx`) & `/dev/ui` Gallery

- **Recommended Model:** `Gemini 4 Hydrogen (Medium)`
- **Objective:** Build the closed vocabulary of 17 institutional UI primitives in `apps/web/src/components/ui/primitives.tsx`, the media slot registry in `apps/web/src/content/media.ts`, the `/dev/ui` gallery page, and the word-cap validator test in `packages/core/src/__tests__/ui-primitives-caps.test.ts`.
- **Allowed Files to Create/Edit:**
  - `apps/web/src/content/media.ts`
  - `apps/web/src/components/ui/primitives.tsx`
  - `apps/web/app/[locale]/(marketing)/dev/ui/page.tsx`
  - `packages/core/src/__tests__/ui-primitives-caps.test.ts`

#### Step P1-A.1: Create `apps/web/src/content/media.ts`
Define and export `MediaSlotId`:
```ts
export type MediaSlotId =
  | 'hero-home'
  | 'hero-gre'
  | 'hero-ielts'
  | 'hero-courses'
  | 'hero-pricing'
  | 'hero-help'
  | 'track-gre'
  | 'track-ielts-ac'
  | 'track-ielts-gt'
  | 'dest-usa'
  | 'dest-uk'
  | 'dest-canada'
  | 'dest-australia'
  | 'split-diagnostic'
  | 'mega-courses';
```
Map each slot to `{ altEn: string; altBn: string; src: string; themeColor: string; captionEn: string; captionBn: string }` (using your configured `images.unsplash.com` URLs or high-resolution SVG/canvas editorial art with graceful fallback so images never 404).

#### Step P1-A.2: Create `apps/web/src/components/ui/primitives.tsx`
Implement these 17 primitives. **CRITICAL:** None of these primitives may accept a `className` prop or an `eyebrow` prop!
1. `LumenSparkMotif`: 3-ray geometric SVG mark (`width="28" height="16"`) in `var(--brand)` and `var(--accent)`.
2. `Section`: `{ tone?: 'white' | 'tint' | 'warm' | 'brand'; id?: string; children: ReactNode }`. Renders full-bleed background (`#FFFFFF`, `var(--bg-tint)`, `var(--bg-warm)`, or `var(--brand)`) with `py-14 md:py-20 lg:py-28` and inner container `max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8`. Zero borders!
3. `Heading`: `{ level: 1 | 2 | 3; children: string; showMotif?: boolean; inverse?: boolean }`. Renders `.lumen-h1`, `.lumen-h2` (preceded by `<LumenSparkMotif />` when `showMotif !== false`), or `.lumen-h3`.
4. `Button`: `{ href: string; locale: string; variant?: 'filled' | 'soft' | 'outline' | 'link'; children: ReactNode }`. Wraps `<LocaleLink locale={locale} href={href}>` with `rounded-[4px]` (`4px` radius), `font-semibold`, `min-h-[44px] inline-flex items-center`.
5. `PlaceholderImage`: `{ slot: MediaSlotId; aspect?: '16:10' | '4:3'; locale?: string }`. Renders sharp `0px`-corner (`rounded-none`) image container with `aspect-[16/10]` or `aspect-[4/3]`, `overflow-hidden bg-[var(--bg-tint)]`, zero shadow, zero text overlaid on top of faces.
6. `HeroBand`: `{ locale: string; title: string; body: string; ctaLabel: string; ctaHref: string; secondaryLinkLabel?: string; secondaryLinkHref?: string; photoSlot: MediaSlotId; frame?: 'blocks' | 'petal'; tone?: 'warm' | 'brand' | 'crimson' }`.
   - Desktop compact height (`py-12 lg:py-16`), 12-column grid (`grid-cols-1 lg:grid-cols-12 gap-10 items-center`).
   - Left 6 cols: H1 + body ($\le 35$ words) + 1 primary button (+ optional underlined link).
   - Right 6 cols: `<PlaceholderImage slot={photoSlot} aspect="16:10" />` framed on the outer bottom-left and bottom-right edges by `16px` solid geometric L-bars (`var(--accent)` amber & `var(--brand)` indigo) and a $2 \times 2$ decorative circle motif in the corner (`frame="blocks"`), or IDP-style asymmetric leaf blocks (`frame="petal"`).
7. `SubBar`: `{ locale: string; items: Array<{ label: string; href: string; active?: boolean }> }`. Full-width `bg-[var(--brand)] text-white` bar under `HeroBand` with up to 3 horizontal tab links (active item styled with `bg-[var(--soft-btn)] text-[var(--brand-ink)] font-bold`).
8. `StatRow`: `{ stats: Array<{ value: string; caption: string; verified: true }> }`. 3 or 4 borderless columns in open whitespace (`text-4xl lg:text-5xl font-extrabold text-[var(--brand)]` + `text-sm text-[var(--text)] mt-2`), followed below by a `1px` `bg-[var(--hairline)]` divider line with `<LumenSparkMotif />` centered in the middle (matching British Council's divider in `image_114659.png`).
9. `StepRow`: `{ title: string; intro?: string; locale: string; steps: Array<{ num: '1' | '2' | '3' | '4'; title: string; body: string; linkLabel?: string; linkHref?: string }> }`.
   - Renders H2 + intro, then a 4-column borderless grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10`).
   - Each step has: Top row with a `60px x 60px` solid `bg-[var(--crimson)] text-white text-3xl font-extrabold flex items-center justify-center` square + a wide chevron arrow (`❯` in `#F497A9`) pointing right; middle `.lumen-h3` title + body ($\le 30$ words); bottom underlined link (`text-[var(--link)] underline underline-offset-4 decoration-2 font-semibold`). Zero borders or card backgrounds!
10. `MediaColumns`: `{ title: string; intro?: string; columns: 2 | 3 | 4; locale: string; items: Array<{ photoSlot?: MediaSlotId; accentColor?: string; title: string; href: string; meta?: string; body: string; links?: Array<{ label: string; href: string }>; disclosureTitle?: string; disclosureItems?: string[] }> }`.
    - Pure borderless editorial columns (`gap-8 lg:gap-10`): sharp `4:3` `<PlaceholderImage />` (or `8px` top color bar when `photoSlot` is omitted), clickable underlined H3 title (`text-[var(--brand)] hover:text-[var(--link)] underline underline-offset-4 decoration-2`), optional bold `meta` line (price/duration), short body ($\le 40$ words), underlined action links, and an optional closed `<Disclosure>` for syllabus modules. Zero card borders, zero drop shadows!
11. `SplitFeature`: `{ photoSlot: MediaSlotId; photoSide?: 'left' | 'right'; title: string; body: string; ctaLabel: string; ctaHref: string; locale: string }`. 50/50 open-canvas split (`grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center`), zero borders.
12. `SideHeadingBlocks`: `{ title: string; intro: string; ctaLabel?: string; ctaHref?: string; locale: string; blocks: Array<{ icon: 'calendar' | 'currency' | 'location' | 'shield' | 'clock' | 'check'; title: string; body: string; linkLabel?: string; linkHref?: string }> }`.
    - Exact 1/3 Left Heading (`lg:col-span-4`) + 2/3 Right Icon-Led Q&A (`lg:col-span-8 space-y-8`) layout from `image_113f12.png`. Each right-hand block has a `32px` crimson (`var(--crimson)`) outline SVG icon in a left gutter + bold H3 + short paragraph + optional underlined link. Zero borders or boxes!
13. `Disclosure`: `{ summary: string; children: ReactNode }`. Native `<details className="group border-b border-[var(--hairline)] py-4">` closed by default, with a clean `+` / `−` indicator.
14. `Tabs`: Client component (`"use client"`) with accessible `role="tablist"`, keyboard Left/Right arrow support, and clean bottom border active indicator (`border-b-4 border-[var(--brand)]`), rendering `{ tabs: Array<{ id: string; label: string; content: ReactNode }> }`.
15. `CalloutNotice`: `{ title: string; body: string; linkLabel?: string; linkHref?: string; locale: string }`. The single allowed soft-lavender notice box (`bg-[var(--bg-tint)] p-6 md:p-8 max-w-4xl`), zero border.
16. `CtaBand`: `{ title: string; body: string; ctaLabel: string; ctaHref: string; locale: string }`. Full-bleed `bg-[var(--brand)] py-16` band containing ONE crisp white rectangular card (`bg-white p-8 md:p-12 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-center`) matching the bottom `"Still have questions?"` card in `image_113f12.png`.
17. `Breadcrumb`: `{ locale: string; items: Array<{ label: string; href?: string }> }`. Compact top bar (`bg-[var(--brand)]` or `bg-[var(--bg-tint)] py-2.5 text-xs`) with underlined breadcrumb trail.

#### Step P1-A.3: Create `/dev/ui` Gallery & Word-Cap Unit Test
1. Create `apps/web/app/[locale]/(marketing)/dev/ui/page.tsx` rendering every primitive above using ONLY primitive imports (0 `className=` in `page.tsx`).
2. Create `packages/core/src/__tests__/ui-primitives-caps.test.ts` exporting `countWords(text: string): number` and testing word-cap validation rules (`title <= 10`, `heroBody <= 35`, `sectionIntro <= 60`, `columnBody <= 40`).

#### Step P1-A.4: Verify, Commit & Halt
1. Run `pnpm design:lint`, `NODE_OPTIONS="--max-old-space-size=2048" pnpm --filter @lumen/core exec vitest run src/__tests__/ui-primitives-caps.test.ts`, and `cd apps/web && NODE_OPTIONS="--max-old-space-size=2048" pnpm exec tsc --noEmit --incremental`.
2. Commit to `main` and **HALT** with verification receipts.

---

### BATCH P1-B: 3-Tier Header, Interactive ETS + British Council Mega-Menus, Mobile Accordion & Footer

- **Recommended Model:** `Gemini 4 Argon (Medium)` or `Gemini 4 Hydrogen (Medium)`
- **Objective:** Build the 3-tier institutional header (`TopRibbon`, `UtilityBar` with untouched `<LocaleSwitcher />`, `MainNav` with interactive ETS left-rail and British Council 3-column mega-menus + mobile accordion drawer) and `InstitutionalFooter` driven by `apps/web/src/content/nav.ts`.
- **Allowed Files to Create/Edit:**
  - `apps/web/src/content/nav.ts`
  - `apps/web/src/components/ui/HeaderFooter.tsx`
  - `apps/web/app/[locale]/(marketing)/layout.tsx`

#### Step P1-B.1: Create `apps/web/src/content/nav.ts` (Bilingual `en` & `bn`)
Define typed navigation data for both `en` and `bn`:
- `topRibbon`: 1-line announcement + CTA link to `/exam/diagnostic`.
- `utilityLinks`: `For Universities & Schools` (`/for-institutions`), `Help Center` (`/help`), `Log in` (`/sign-in`).
- `megaGreIelts` (ETS Left-Rail Tab Pattern from `image_10e841.png`):
  - 4 Left-Rail categories (`01. GRE® General Test`, `02. IELTS™ Academic`, `03. IELTS™ General Training`, `04. Which Exam Do I Need?`).
  - Each category has 6 links (`title` + 1-line description $\le 10$ words) pointing to real routes (`/gre`, `/gre#format`, `/gre#sample`, `/ielts`, `/ielts#format`, `/exam/ielts-preview`, `/exam/diagnostic`, `/courses`, `/pricing`).
  - Bottom 2-column conversion strip with long terracotta dashed arrows (`- - - - - - ->`) and rectangular `1px solid` outline buttons (`EXPLORE PREP COURSES` $\rightarrow$ `/courses`, `TAKE FREE DIAGNOSTIC` $\rightarrow$ `/exam/diagnostic`).
- `megaCourses` (British Council 3-Column + Photo + Bottom Ribbon Pattern from `image_114203.png`):
  - Col 1 (`bg-[var(--bg-tint)]`): Title (`Prepare with Lumen`) + 2-sentence overview.
  - Col 2 (`bg-white`): Underlined heading (`Courses & Packages`) + 5 underlined links with `>` chevrons (`/courses`, `/pricing`, `/gre`, `/ielts`, `/for-institutions`).
  - Col 3: `<PlaceholderImage slot="mega-courses" aspect="4:3" />`.
  - Bottom full-width `bg-[var(--brand)] text-white` ribbon: `"Explore key areas"` horizontal links (`GRE® Quant & Verbal ⊕`, `IELTS™ Academic ⊕`, `IELTS™ General Training ⊕`, `bKash 0% Split-Pay ⊕`) + right inset CTA box (`Start 15-Min Free Diagnostic`).
- `megaPractice`: 4 direct links (`15-Min Express Diagnostic`, `CD-IELTS Split-Screen Simulator`, `GRE Quantitative Workbench`, `Score & Band Calculators`).

#### Step P1-B.2: Create `apps/web/src/components/ui/HeaderFooter.tsx` (`"use client"`)
- Render Tier 1 (`TopRibbon` in `bg-[var(--accent)] text-[var(--brand-ink)]`), Tier 2 (`UtilityBar` in `bg-white` mounting `<LocaleSwitcher />` on the left and utility links on the right), and Tier 3 (`MainNav` in `bg-[var(--brand)] text-white h-20` with logo, 4 menu triggers, and soft-lilac `bg-[var(--soft-btn)] text-[var(--brand-ink)]` CTA button).
- Implement hover-intent (`150ms`), click toggle, `Esc` key close, outside-click close, `aria-expanded`, and hard offset shadow (`shadow-[var(--shadow-hard)]`) on the desktop dropdown panels.
- Implement `< 1024px` mobile drawer with single-open accordion sections, zero photos inside mobile menu, and `<LocaleSwitcher />` at the top.
- Implement `InstitutionalFooter` (`bg-[var(--brand)] text-white`) with 4 collapsible/grid columns, single `BangladeshPaymentTrustBar`, and the ETS/IELTS non-affiliation trademark notice.
- Mount `<InstitutionalHeader locale={locale} />` and `<InstitutionalFooter locale={locale} />` in `apps/web/app/[locale]/(marketing)/layout.tsx`.

#### Step P1-B.3: Verify, Commit & Halt
1. Run `pnpm design:lint`, `NODE_OPTIONS="--max-old-space-size=2048" pnpm --filter @lumen/core exec vitest run src/__tests__/brand-sweep.test.ts src/__tests__/i18n-pages-coverage.test.ts`, and `cd apps/web && NODE_OPTIONS="--max-old-space-size=2048" pnpm exec tsc --noEmit --incremental`.
2. Commit to `main` and **HALT** with verification receipts.

---

### BATCH P2: Word-Capped Bilingual Content Store (`marketing.ts`) & Cap Tests

- **Recommended Model:** `Gemini 4 Hydrogen (Medium)`
- **Objective:** Create `apps/web/src/content/marketing.ts` containing all English (`en`) and Bengali (`bn`) copy for `/`, `/gre`, `/ielts`, `/courses`, `/pricing`, and `/help`, and enforce word caps and jargon bans in `packages/core/src/__tests__/ui-primitives-caps.test.ts`.
- **Allowed Files to Create/Edit:**
  - `apps/web/src/content/marketing.ts`
  - `packages/core/src/__tests__/ui-primitives-caps.test.ts`

#### Step P2.1: Create `apps/web/src/content/marketing.ts`
Create `MARKETING_CONTENT` for `en` and `bn` strictly obeying:
- Every `title` $\le 10$ words.
- Every `hero.body` $\le 35$ words.
- Every `intro` $\le 60$ words.
- Every column/step/block `body` $\le 40$ words.
- Pricing `bullets`: max 4 bullets per plan, each $\le 10$ words.
- Zero banned words (`"protocol"`, `"matrix"`, `"architecture"`, `"Rasch"`, `"SM-2"`, `"Magoosh"`, `"GregMat"`, `"Seeded Live Demo"`).
- Include complete data for `home`, `gre`, `ielts`, `courses`, `pricing`, and `help` (matching Section 8 of `docs/LUMEN-DESIGN-STRATEGY.md`).

#### Step P2.2: Expand `packages/core/src/__tests__/ui-primitives-caps.test.ts`
Write automated tests that traverse `MARKETING_CONTENT.en` and `MARKETING_CONTENT.bn` and assert:
1. Key parity between `en` and `bn`.
2. Every title, hero body, intro, column body, and pricing bullet is within its exact word cap.
3. Zero banned jargon words appear anywhere in `MARKETING_CONTENT`.
4. `en` prices use Latin digits (`৳ 5,990`) and `bn` prices use Bengali digits (`৳ ৫,৯৯০`).

#### Step P2.3: Verify, Commit & Halt
1. Run `pnpm design:lint`, `NODE_OPTIONS="--max-old-space-size=2048" pnpm --filter @lumen/core exec vitest run src/__tests__/ui-primitives-caps.test.ts`, and `cd apps/web && NODE_OPTIONS="--max-old-space-size=2048" pnpm exec tsc --noEmit --incremental`.
2. Commit to `main` and **HALT** with verification receipts.

---

### BATCH P3: Assemble `/` (Home) and `/courses` Using Pure Primitives (Zero `className` in Pages)

- **Recommended Model:** `Gemini 4 Hydrogen (Low/Medium)`
- **Objective:** Rewrite `apps/web/app/[locale]/(marketing)/page.tsx` and `apps/web/app/[locale]/(marketing)/courses/page.tsx` so they ONLY compose primitives from `@/src/components/ui/primitives` and content from `@/src/content/marketing` with **zero `className=` attributes** in either page file.
- **Allowed Files to Edit:**
  - `apps/web/app/[locale]/(marketing)/page.tsx`
  - `apps/web/app/[locale]/(marketing)/courses/page.tsx`
  - `apps/web/src/components/ui/primitives.tsx` (only if adding a composite primitive like `CourseFilterCatalog` or `ComparisonDisclosureTable` so `courses/page.tsx` needs zero `className`)

#### Step P3.1: Rewrite `apps/web/app/[locale]/(marketing)/page.tsx`
Assemble `/` in 6 clean bands (zero tables, zero bordered cards):
1. `<HeroBand ... />` + `<SubBar ... />`
2. `<Section tone="white"><StatRow stats={c.stats} /></Section>`
3. `<Section tone="white"><StepRow ... /></Section>` ("How does Lumen work?" — 4 crimson numeral squares + chevrons)
4. `<Section tone="tint"><MediaColumns columns={3} ... /></Section>` ("Find out which exam you need" — 3 borderless photo columns)
5. `<Section tone="white"><MediaColumns columns={4} ... /></Section>` ("Study, work or move abroad" — 4 borderless country photo columns)
6. `<Section tone="white"><SplitFeature ... /></Section>` + `<CtaBand ... />`

#### Step P3.2: Rewrite `apps/web/app/[locale]/(marketing)/courses/page.tsx`
Assemble `/courses` in 4 clean bands:
1. `<Breadcrumb ... />` + `<HeroBand ... />`
2. `<Section tone="white">` with `<Tabs>` filtering the borderless 3-column `<MediaColumns>` course directory, where each course's 5 syllabus modules sit inside a closed `<Disclosure>` ("View syllabus modules").
3. `<Section tone="tint">` with a closed `<Disclosure>` containing the "GRE vs. IELTS: Which exam do you need?" guide.
4. `<CtaBand ... />`

#### Step P3.3: Verify, Commit & Halt
1. Confirm `grep -c "className" "apps/web/app/[locale]/(marketing)/page.tsx" "apps/web/app/[locale]/(marketing)/courses/page.tsx"` outputs `0` for both files.
2. Run `pnpm design:lint`, `NODE_OPTIONS="--max-old-space-size=2048" pnpm --filter @lumen/core exec vitest run src/__tests__/brand-sweep.test.ts src/__tests__/i18n-pages-coverage.test.ts src/__tests__/ui-primitives-caps.test.ts`, and `cd apps/web && NODE_OPTIONS="--max-old-space-size=2048" pnpm exec tsc --noEmit --incremental`.
3. Commit to `main` and **HALT** with verification receipts.

---

### BATCH P4: Assemble `/gre`, `/ielts`, `/pricing` & `/help` + Lock `--strict-pages` Lint Gate

- **Recommended Model:** `Gemini 4 Hydrogen (Low/Medium)`
- **Objective:** Rewrite `gre/page.tsx`, `ielts/page.tsx`, `pricing/page.tsx`, and `help/page.tsx` using ONLY primitives from `@/src/components/ui/primitives` and content from `@/src/content/marketing` (zero `className=` in `page.tsx`), and enable strict page checking across all 6 marketing routes in `tooling/design-lint.mjs`.
- **Allowed Files to Edit:**
  - `apps/web/app/[locale]/(marketing)/gre/page.tsx`
  - `apps/web/app/[locale]/(marketing)/ielts/page.tsx`
  - `apps/web/app/[locale]/(marketing)/pricing/page.tsx`
  - `apps/web/app/[locale]/(marketing)/help/page.tsx`
  - `apps/web/src/components/ui/primitives.tsx` (to export `PricingSwitcherSection` and `FaqDisclosureList` primitives so `pricing/page.tsx` and `help/page.tsx` have zero `className=`)
  - `tooling/design-lint.mjs`
  - `packages/core/src/__tests__/i18n-pages-coverage.test.ts`

#### Step P4.1: Rewrite `/gre`, `/ielts`, `/pricing`, and `/help` (Zero `className` in `page.tsx`)
1. **`gre/page.tsx`:** `<Breadcrumb />` $\rightarrow$ `<HeroBand />` $\rightarrow$ `<Section tone="white"><SideHeadingBlocks ... /></Section>` (1/3 heading + 2/3 icon-led blocks) $\rightarrow$ `<Section tone="tint"><Tabs ... /></Section>` (`Format & Timing` | `Adaptive Scoring` | `Try a Sample Question` rendering `<LiveGreWidget locale={locale} />` with no extra header box above it) $\rightarrow$ `<Section tone="white"><MediaColumns columns={4} ... /></Section>` $\rightarrow$ `<CtaBand />`.
2. **`ielts/page.tsx`:** `<Breadcrumb />` $\rightarrow$ `<HeroBand tone="crimson" />` $\rightarrow$ `<Section tone="white"><SideHeadingBlocks ... /></Section>` $\rightarrow$ `<Section tone="tint"><Tabs ... /></Section>` (`4 Test Sections` | `Band Score Conversion` | `Split-Screen Simulator`) $\rightarrow$ `<Section tone="white"><MediaColumns columns={4} ... /></Section>` $\rightarrow$ `<CtaBand />`.
3. **`pricing/page.tsx`:** `<Breadcrumb />` $\rightarrow$ `<HeroBand />` $\rightarrow$ `<Section tone="white"><PricingSwitcherSection ... /></Section>` (Tabs switching between `Self-Paced Courses`, `Live Cohorts & 1:1 Mentor`, and `Mock & AI Credit Passes` so only 3–4 borderless columns are visible at a time, with `BDT ৳` / `USD $` switcher) $\rightarrow$ `<Section tone="tint"><SideHeadingBlocks ... /></Section>` (Mushak 6.3 VAT, 0% bKash split-pay, 7-day refund) $\rightarrow$ `<Section tone="white"><FaqDisclosureList ... /></Section>` $\rightarrow$ `<CtaBand />`.
4. **`help/page.tsx`:** `<Breadcrumb />` $\rightarrow$ `<HeroBand />` $\rightarrow$ `<Section tone="white"><SideHeadingBlocks ... /></Section>` $\rightarrow$ `<Section tone="tint"><FaqDisclosureList ... /></Section>` $\rightarrow$ `<CtaBand />`.

#### Step P4.2: Enable Default Strict Mode in `tooling/design-lint.mjs`
Update `tooling/design-lint.mjs` so running `pnpm design:lint` automatically checks all 6 marketing `page.tsx` files (`page.tsx`, `courses/page.tsx`, `gre/page.tsx`, `ielts/page.tsx`, `pricing/page.tsx`, `help/page.tsx`) and fails if any of them contains `className=`, `style=`, `<table`, or hex literals.

#### Step P4.3: Verify, Commit & Halt
1. Run `pnpm design:lint`, `NODE_OPTIONS="--max-old-space-size=2048" pnpm --filter @lumen/core exec vitest run src/__tests__/brand-sweep.test.ts src/__tests__/i18n-pages-coverage.test.ts src/__tests__/ui-primitives-caps.test.ts`, and `cd apps/web && NODE_OPTIONS="--max-old-space-size=2048" pnpm exec tsc --noEmit --incremental`.
2. Commit to `main` and **HALT** with verification receipts.

---

### BATCH P5: Automated Visual & DOM Border-Count Audit (`pnpm design:shots`)

- **Recommended Model:** `Gemini 4 Argon (Low/Medium)` or `Gemini 4 Hydrogen (Medium)`
- **Objective:** Create `tooling/design-shots.mjs` (`pnpm design:shots`) and update `docs/PROGRESS.md` & `docs/HANDOFF.md` to verify that all 6 marketing routes meet the DOM border-box budget, word-cap budget, and responsive layout rules across `en` and `bn`.
- **Allowed Files to Create/Edit:**
  - `tooling/design-shots.mjs`
  - `package.json` (add `"design:shots": "node tooling/design-shots.mjs"`)
  - `docs/logs/reviews/m2-9-institutional-ui-signoff.md`
  - `docs/PROGRESS.md`
  - `docs/HANDOFF.md`

#### Step P5.1: Create `tooling/design-shots.mjs`
Write a Node verification script `tooling/design-shots.mjs` that:
1. Verifies all 6 marketing routes + `/dev/ui` compile cleanly and contain zero `className=` attributes, zero raw `<table>` tags, and $\le 6$ bordered/boxed UI primitive invocations per page (`CalloutNotice`, `CtaBand`, `Button`).
2. If a local server is reachable on `http://localhost:3000` (or when `--live` is passed), uses Playwright across $390\text{px}$, $768\text{px}$, and $1440\text{px}$ in `en` and `bn` to capture screenshots to `docs/logs/screenshots/` and assert `document.documentElement.scrollWidth <= window.innerWidth` (zero horizontal overflow).

#### Step P5.2: Final Sign-Off Report & Halt
1. Run `pnpm design:lint`, `pnpm design:shots`, `NODE_OPTIONS="--max-old-space-size=2048" pnpm --filter @lumen/core exec vitest run src/__tests__/brand-sweep.test.ts src/__tests__/i18n-pages-coverage.test.ts src/__tests__/ui-primitives-caps.test.ts`, and `cd apps/web && NODE_OPTIONS="--max-old-space-size=2048" pnpm exec tsc --noEmit --incremental`.
2. Write `docs/logs/reviews/m2-9-institutional-ui-signoff.md`, update `docs/PROGRESS.md` and `docs/HANDOFF.md`, commit to `main`, and print the final summary.