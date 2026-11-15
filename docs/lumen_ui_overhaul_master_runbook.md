# LUMEN ACADEMY: PHASE 4 MASTER RUNBOOK — CLAUDE EDITORIAL WORKSPACE OVERHAUL, DEDICATED GRE/IELTS LEFT TABS, BILLING & PAYMENT LEDGER, PRIVACY-FIRST SETTINGS & ROLE-ISOLATED ADMIN ERP (BATCHES P27 -> P30)

## SECTION 0: MANDATORY OPERATING RULES, EXPLICIT REJECTIONS & MITIGATIONS (READ FIRST)

### 0.1 Execution Discipline
1. Execute ONLY the single batch requested by the user (`BATCH P27`, `BATCH P28`, `BATCH P29`, or `BATCH P30`).
2. When the requested batch is implemented, verified, and committed, print the raw verification receipts and **STOP IMMEDIATELY**.
3. Touch ONLY the files listed under `Allowed Files` for the active batch.
4. Always prefix Vitest and TypeScript commands with `NODE_OPTIONS="--max-old-space-size=2048"`. Commit as `Ayman Rahman <aymanrahman30@gmail.com>`. Do NOT run `git push`.

### 0.2 Protected Paths (NEVER MODIFY)
- `apps/web/app/[locale]/_components/LocaleSwitcher.tsx`
- `apps/web/app/[locale]/_components/LocaleLink.tsx`
- `apps/web/app/[locale]/_components/TranslatedText.tsx`
- `apps/web/app/api/translate/route.ts`
- All strict marketing `page.tsx` files (`apps/web/app/[locale]/(marketing)/**/page.tsx`) must remain at `className=0`.

### 0.3 What You Must Explicitly REJECT (Enforced by `[workspace-guard]` in `tooling/design-lint.mjs`)
Any code in `(learner)` or `(admin)` containing ANY of the following is an automatic build failure:
1. **NO Card Soup or Nested Boxes:** Never render a 2-column, 3-column, or 4-column grid of bordered cards (`border p-4`). Never nest a bordered box inside another bordered box. Lists of questions, mistakes, study tasks, vocabulary decks, invoices, and admin packages MUST render as open horizontal ledger rows separated by `1px solid var(--hairline)` (`divide-y divide-[var(--hairline)]`).
2. **NO Off-Palette "SaaS Rainbow" Classes:** Zero `bg-blue-*`, `text-blue-*`, `border-blue-*`, `bg-green-*`, `text-green-*`, `border-green-*`, `bg-emerald-*`, `text-emerald-*`, `bg-yellow-*`, `text-yellow-*`, `border-yellow-*`, `bg-amber-*`, `bg-purple-*`, `bg-indigo-*`, `bg-slate-*`, `bg-zinc-*`, or raw hex literals outside `tokens.css`. Use ONLY CSS custom properties from `tokens.css` (`--bg`, `--bg-warm`, `--surface-paper`, `--brand`, `--brand-deep`, `--text-primary`, `--text-secondary`, `--text-muted`, `--hairline`).
3. **NO Large Radii or Drop Shadows:** Zero `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl`, `rounded-full`, or `shadow-*`. Use `rounded-none` (`0px`) or `rounded-[4px]` only.
4. **NO ALL-CAPS Micro-Eyebrow Labels:** Zero `text-[9px]`, `text-[10px]`, `text-[11px]`, or `uppercase tracking-*` labels above headings or inside rows.
5. **NO RPG Gamification Clutter:** Zero references to `Level 4`, `Analytical Strategist`, `Apprentice Scholar`, `Mastery Candidate`, `Distinguished Scholar`, `XP earned`, `Rank Progression Roadmap`, `7 Day Streak` pills, or `120 Credits` pills in the header.
6. **NO Raw Unformatted LaTeX:** Never display raw `$x^2 = 16$`, `$y^3 = -27$`, `$n$`, or `64\pi` in the DOM. Every mathematical string in `/app/*` must pass through `formatMathText()` from `apps/web/src/lib/format-math.ts`.
7. **NO Top Dark Header + Left Dark Sidebar "L-Frame Cage":** Delete the top dark utility bar in `(learner)/layout.tsx`. Use a single, quiet **Claude-style Warm Parchment Left Sidebar (`w-[248px] bg-[var(--bg-warm)] border-r border-[var(--hairline)] text-[var(--brand-deep)]`)** on desktop (with a clean collapsible sheet on `<1024px` mobile) paired with the open **Pearl/Bone (`bg-[var(--bg)]`)** main canvas.
8. **NO Role Leakage Between Student (`/app/*`) and Admin (`/admin`):**
   - Students (`lumen_role=scholar`) must NEVER see an `Admin Console` link in `/app/*` and must be redirected to `/app` if they request `/admin` or `/app/admin`.
   - Admins (`lumen_role=admin`) live in their own dedicated `/[locale]/(admin)/admin` layout, must NEVER see student study links (`FSRS Vocab`, `Mistake Ledger`, `Study Plan`), and must be redirected to `/admin` if they visit `/app/*`.

### 0.4 Known Risks & Mandatory Professional Mitigations
| Risk / Failure Mode | Mandatory Mitigation to Implement |
| :--- | :--- |
| **React Hydration Error #441 on `/app/settings` & `/app/billing`** | Never read `localStorage`, `document.cookie`, or dynamic `new Date()` during initial SSR render without a deterministic `mounted` state guard inside `useEffect` (`try/catch`). Provide deterministic SSR defaults first, then hydrate client storage inside `useEffect`. |
| **Headless Playwright Audit (`pnpm design:shots`) Lockout** | In `proxy.ts` / layout role guards: if `lumen_role` cookie is explicitly `'scholar'`, redirect `/admin` -> `/app`. If `lumen_role` cookie is explicitly `'admin'`, redirect `/app/*` -> `/admin`. If no `lumen_role` cookie is set yet (e.g., stateless CI crawler), allow each route to render its native role shell (`scholar` on `/app/*`, `admin` on `/admin`), while clicking `Scholar Workspace` on `/sign-in` sets `lumen_role=scholar` and clicking `Admin Console` sets `lumen_role=admin`! |
| **Broken Internal Links (`[link-guard]`)** | Keep `/app/practice`, `/app/vocab`, `/app/vocab/play`, and `/app/flashcards` intact and restyled in the clean ledger aesthetic; make `/app/admin` cleanly redirect to `/admin` (or `/app` if `lumen_role === 'scholar'`); register `/app/gre`, `/app/ielts`, `/app/billing`, and `/admin` in `tooling/design-lint.mjs` and `tooling/design-shots.mjs`. |
| **Bengali (`বাংলা`) Text Clipping** | Never set fixed height (`h-8`, `h-10`) on text rows or sidebar links; use `py-2.5` vertical padding, `leading-relaxed`, and zero `uppercase`/`tracking-*` on Bengali strings. |

---

## BATCH P27: WORKSPACE DESIGN PRIMITIVES (`WORKSPACEPRIMITIVES.TSX`), MATH FORMATTER (`FORMAT-MATH.TS`), STRICT ROLE ISOLATION (`SCHOLAR` VS `ADMIN`) & AUTOMATED `[WORKSPACE-GUARD]` LINT

### Objective
Build the shared Claude-style editorial workspace primitives, deterministic Unicode math formatter, Warm Parchment Scholar Sidebar with dedicated `GRE® General Track` and `IELTS™ Academic & GT Track` left-rail tabs, strict `Scholar` vs. `Admin` role isolation, and automated `[workspace-guard]` lint rules + unit tests.

### Allowed Files
- `apps/web/src/lib/format-math.ts` (new deterministic math formatter)
- `apps/web/src/lib/role-guard.ts` (new role & PII masking helper)
- `apps/web/src/components/ui/WorkspacePrimitives.tsx` (new closed-vocabulary workspace primitives)
- `apps/web/app/[locale]/(learner)/layout.tsx`
- `apps/web/app/[locale]/(auth)/_components/AuthForm.tsx`
- `apps/web/proxy.ts`
- `tooling/design-lint.mjs`
- `tooling/design-shots.mjs`
- `packages/core/src/__tests__/workspace-design-guard.test.ts` (new unit test suite)

### Step-by-Step Implementation
1. **Create `apps/web/src/lib/format-math.ts`:**
   - Export `formatMathText(input: string): string` that deterministically strips inline `$` and `$$` delimiters and converts LaTeX math tokens into clean typographic Unicode:
     - `\pi` -> `π`, `\sqrt{([^}]+)}` -> `√($1)`, `\leq` / `\le` -> `≤`, `\geq` / `\ge` -> `≥`, `\neq` / `\ne` -> `≠`, `\times` -> `×`, `\div` -> `÷`, `\pm` -> `±`, `\infty` -> `∞`.
     - Superscripts: `^2` -> `²`, `^3` -> `³`, `^4` -> `⁴`, `^n` -> `ⁿ`, `^{-1}` -> `⁻¹`, `^{([^}]+)}` -> `^($1)`.
     - Subscripts: `_0` -> `₀`, `_1` -> `₁`, `_2` -> `₂`, `_n` -> `ₙ`.
     - Fractions: `\frac{([^}]+)}{([^}]+)}` -> `($1 / $2)`.
   - Guarantee that `Given that $x^2 = 16$ and $y^3 = -27$. Quantity A: $x + y$ Quantity B: $0$` renders as `Given that x² = 16 and y³ = -27. Quantity A: x + y Quantity B: 0`, and `64\pi` renders as `64π`.

2. **Create `apps/web/src/lib/role-guard.ts`:**
   - Export `type WorkspaceRole = 'scholar' | 'admin'`.
   - Export `ROLE_COOKIE_NAME = 'lumen_role'`.
   - Export `maskEmailForAdmin(email: string): string` (e.g., `ayman@lumen.academy` -> `a***n@lumen.academy`) and `maskPhoneForAdmin(phone: string): string` (`+8801711223344` -> `+88017••••3344`) for privacy-by-design in the Admin Console.
   - Export client cookie setter `setWorkspaceRoleCookie(role: WorkspaceRole)` (`document.cookie = 'lumen_role=' + role + '; path=/; max-age=2592000; SameSite=Lax'`).

3. **Create `apps/web/src/components/ui/WorkspacePrimitives.tsx` (Claude Editorial Design System):**
   - Build and export clean, token-driven components (`rounded-none` or `rounded-[4px]` only, zero shadows, zero rainbow classes, zero uppercase eyebrows):
     - **`<WorkspaceContainer>`:** `max-w-[1040px] mx-auto px-5 sm:px-8 py-8 md:py-12`.
     - **`<WorkspaceHeader>`:** Props `{ title: string; subtitle?: string; metaText?: string; primaryAction?: { label: string; href?: string; onClick?: () => void }; secondaryAction?: { label: string; href?: string; onClick?: () => void } }`. Renders an editorial `h1` (`text-2xl md:text-3xl font-bold text-[var(--brand-deep)] tracking-tight`), quiet `15px` subtitle (`text-[var(--text-secondary)] mt-1.5 max-w-[65ch]`), optional inline meta text, at most **1 filled Crimson primary button** (`bg-[var(--brand)] text-white px-4 py-2.5 text-sm font-semibold rounded-[4px]`), and an optional underlined text link (`underline underline-offset-4 text-sm font-medium text-[var(--brand-deep)]`), followed by a `1px solid var(--hairline)` bottom rule (`border-b border-[var(--hairline)] pb-6 mb-8`).
     - **`<WorkspaceFocusSheet>` (The ONLY allowed tinted sheet on a workspace page):** Props `{ title: string; body: string; meta?: string; primaryAction: { label: string; href?: string; onClick?: () => void }; secondaryAction?: { label: string; href?: string; onClick?: () => void } }`. Renders `bg-[var(--surface-paper)] border border-[var(--hairline)] border-l-[3px] border-l-[var(--brand)] p-6 mb-10` with clean typography and 1 primary action + 1 underlined secondary link.
     - **`<WorkspaceStatRow>` (Borderless Typographic Telemetry — No Boxed KPI Cards!):** Props `{ stats: Array<{ value: string; label: string; detail?: string; href?: string }> }`. Renders a 2-to-4 column horizontal strip divided only by vertical hairlines (`grid grid-cols-2 lg:grid-cols-4 border-y border-[var(--hairline)] py-6 mb-10 gap-y-6 lg:gap-y-0 lg:divide-x lg:divide-[var(--hairline)]`). Each stat shows a bold `Work Sans 800` figure (`text-2xl md:text-3xl font-extrabold text-[var(--brand-deep)]`), a `14px` label (`text-[var(--text-secondary)] mt-1`), and an optional muted detail or underlined action link.
     - **`<WorkspaceTabs>`:** Props `{ tabs: Array<{ id: string; label: string; count?: number }>; activeTab: string; onSelect: (id: string) => void }`. Renders a clean single-hairline bottom-bordered tab bar (`flex flex-wrap gap-6 border-b border-[var(--hairline)] mb-8`) where the active tab has a `2px` bottom bar in `var(--brand)` (`border-b-2 border-[var(--brand)] text-[var(--brand-deep)] font-semibold pb-3`) and inactive tabs are `text-[var(--text-secondary)] hover:text-[var(--brand-deep)] pb-3`.
     - **`<WorkspaceSectionTitle>`:** Props `{ title: string; subtitle?: string; rightAction?: React.ReactNode }`. Clean `h2` (`text-lg md:text-xl font-bold text-[var(--brand-deep)]`) + optional `14px` subtitle, never uppercase eyebrows.
     - **`<WorkspaceLedger>` & `<WorkspaceLedgerRow>`:** Open horizontal rows separated by `divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]` where each row (`py-4 px-2 hover:bg-[var(--bg-warm)]/60 transition-colors duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3`) displays primary content on the left and quiet typographic metadata + an underlined action link on the right.
     - **`<WorkspaceProgressBar>`:** Props `{ value: number; max?: number; tone?: 'espresso' | 'crimson' }`. Renders a crisp `h-[4px] w-full bg-[var(--hairline)] overflow-hidden` track with a solid fill in `bg-[var(--brand-deep)]` or `bg-[var(--brand)]` (never electric blue or emerald green!).

4. **Rebuild `apps/web/app/[locale]/(learner)/layout.tsx` (Claude-Style Warm Parchment Left Sidebar & Dedicated GRE/IELTS Tabs):**
   - **Delete the dark top header bar** (`GRE Prep | IELTS` toggle, `7 Day Streak` pill, `120 Credits` pill) and **delete the `CD-IELTS Simulator` and `Admin Console` links** from the learner sidebar!
   - Render a responsive two-column shell (`min-h-screen flex flex-col lg:flex-row bg-[var(--bg)] text-[var(--text-primary)]`):
     - **Left Sidebar (`w-full lg:w-[252px] shrink-0 bg-[var(--bg-warm)] border-b lg:border-b-0 lg:border-r border-[var(--hairline)] flex flex-col justify-between`):**
       - **Brand Header:** `<LumenSparkMotif />` + `Lumen Academy` (`font-bold text-[var(--brand-deep)]`) + quiet subline `Scholar Workspace` (`ইলার্নার ওয়ার্কস্পেস` in `bn`).
       - **Navigation Group 1 — Study Desk:**
         - `Overview` (`/app`)
         - `Study Schedule` (`/app/plan`)
         - `Mistake Ledger` (`/app/mistakes`)
         - `Score Analytics` (`/app/progress`)
       - **Navigation Group 2 — Exam Preparation Tracks (Dedicated Left Tabs — NOT a toggle!):**
         - `GRE® General Track` (`/app/gre`)
         - `IELTS™ Academic & GT` (`/app/ielts`)
         - `Vocabulary & Formulas` (`/app/vocab`)
       - **Navigation Group 3 — Billing & Privacy:**
         - `Plans, Billing & Receipts` (`/app/billing`)
         - `Account & Privacy` (`/app/settings`)
       - **Active Link Styling:** Active route has `bg-[var(--surface-paper)] text-[var(--brand-deep)] font-semibold border-l-[3px] border-[var(--brand)] px-3 py-2`; inactive route has `text-[var(--text-secondary)] hover:text-[var(--brand-deep)] hover:bg-[var(--surface-paper)]/50 px-3 py-2`.
       - **Sidebar Footer:** Contains `<LocaleSwitcher />` (imported untouched from `@/app/[locale]/_components/LocaleSwitcher`), scholar name (`Ayman Rahman · Scholar`), and an underlined `Switch Role / Sign out` link to `/sign-in`.

5. **Enforce Strict Role Isolation in `apps/web/proxy.ts` and `apps/web/app/[locale]/(auth)/_components/AuthForm.tsx`:**
   - In `apps/web/proxy.ts`:
     - Read `request.cookies.get('lumen_role')?.value`.
     - If pathname matches `/^\/(en|bn)?\/?app\/admin/`:
       - If `lumen_role === 'scholar'`, redirect to `/app` (Students cannot view Admin!).
       - Otherwise redirect `/app/admin` -> `/admin` (so all Admin traffic uses the dedicated `/admin` console).
     - If pathname matches `/^\/(en|bn)?\/?admin(\/|$)/` and `lumen_role === 'scholar'`, redirect to `/app`.
     - If pathname matches `/^\/(en|bn)?\/?app(\/|$)/` and `lumen_role === 'admin'`, redirect to `/admin` (Admins cannot view Student workspaces!).
   - In `AuthForm.tsx`:
     - Update the sandbox entry buttons so clicking **Scholar Workspace (`/app`)** sets `setWorkspaceRoleCookie('scholar')` before navigating to `/app`, and clicking **Institutional Admin Console (`/admin`)** sets `setWorkspaceRoleCookie('admin')` before navigating to `/admin`.

6. **Add `[workspace-guard]` to `tooling/design-lint.mjs` & `packages/core/src/__tests__/workspace-design-guard.test.ts`:**
   - In `tooling/design-lint.mjs`, add a `[workspace-guard]` function that scans all `.tsx` files inside `apps/web/app/[locale]/(learner)/**` and `apps/web/app/[locale]/(admin)/**` (once created) and fails if any file contains:
     - `rounded-full`, `rounded-2xl`, `rounded-3xl`, `rounded-xl`
     - `bg-blue-`, `text-blue-`, `border-blue-`, `bg-emerald-`, `text-emerald-`, `bg-yellow-`, `border-yellow-`
     - RPG strings: `Analytical Strategist`, `Apprentice Scholar`, `Rank Progression Roadmap`, `total XP earned`
   - Create `packages/core/src/__tests__/workspace-design-guard.test.ts` testing `formatMathText()`, `maskEmailForAdmin()`, `maskPhoneForAdmin()`, and verifying that `(learner)/layout.tsx` contains dedicated `/app/gre`, `/app/ielts`, and `/app/billing` links and **zero** references to `Admin Console` or `/admin`.

### Verification
Run `pnpm design:lint` (if existing learner pages fail the new `[workspace-guard]` because they are overhauled in P28/P29, configure `[workspace-guard]` in P27 to check `layout.tsx` and `WorkspacePrimitives.tsx` first, then expand the array in P28/P29/P30 as each page is cleaned!), `pnpm design:shots`, `NODE_OPTIONS="--max-old-space-size=2048" pnpm --filter @lumen/core exec vitest run`, and `cd apps/web && NODE_OPTIONS="--max-old-space-size=2048" pnpm exec tsc --noEmit --incremental`. Commit `BATCH P27` to `main`, print receipts, and STOP.

---

## BATCH P28: SCHOLAR WORKSPACE CORE OVERHAUL (`/APP`, `/APP/PLAN`, `/APP/MISTAKES`, `/APP/PROGRESS`) + DEDICATED LEFT-RAIL EXAM TABS (`/APP/GRE` & `/APP/IELTS`)

### Objective
Rewrite `/app`, `/app/plan`, `/app/mistakes`, `/app/progress`, `/app/practice`, and `/app/vocab` using `WorkspacePrimitives.tsx` and `formatMathText()`, and create the dedicated left-rail **`/app/gre` (`GRE® General Track`)** and **`/app/ielts` (`IELTS™ Academic & GT Track`)** workspaces—eliminating all bordered card grids, RPG XP bars, rainbow pills, and raw LaTeX.

### Allowed Files
- `apps/web/app/[locale]/(learner)/app/page.tsx`
- `apps/web/app/[locale]/(learner)/app/gre/page.tsx` (new dedicated GRE left-tab workspace)
- `apps/web/app/[locale]/(learner)/app/ielts/page.tsx` (new dedicated IELTS left-tab workspace)
- `apps/web/app/[locale]/(learner)/app/plan/page.tsx`
- `apps/web/app/[locale]/(learner)/app/mistakes/page.tsx`
- `apps/web/app/[locale]/(learner)/app/progress/page.tsx`
- `apps/web/app/[locale]/(learner)/app/practice/page.tsx`
- `apps/web/app/[locale]/(learner)/app/vocab/page.tsx`
- `apps/web/app/[locale]/(learner)/app/vocab/play/page.tsx`
- `apps/web/app/[locale]/(learner)/app/flashcards/page.tsx`
- `tooling/design-lint.mjs`
- `tooling/design-shots.mjs`
- `packages/core/src/__tests__/workspace-design-guard.test.ts`

### Step-by-Step Implementation
1. **Rebuild `/app` (`apps/web/app/[locale]/(learner)/app/page.tsx`) — Today's Study Desk:**
   - Delete the XP/Level 4 bar, the 4 boxed metric cards, the double-boxed score predictor, and the 2 bottom cards.
   - Compose with `WorkspacePrimitives`:
     - `<WorkspaceHeader>` (`title="Good afternoon, Ayman"`, `subtitle="Active Preparation Desk · 30 days to target exam date (Dec 15, 2026)"`, `primaryAction={{ label: 'Resume Adaptive Diagnostic →', href: '/exam/diagnostic' }}`, `secondaryAction={{ label: 'View Study Schedule →', href: '/app/plan' }}`).
     - `<WorkspaceFocusSheet>` (1 allowed paper sheet): `"Next Recommended Session: Text Completion 3-Blank Contrast Drills"` · `"10 calibrated items · Untimed Socratic tutor mode with 3-tier hints · Based on 3 open items in your Mistake Ledger"` with primary CTA `Start 12-Minute Drill →` (`/app/gre?tab=drills`) and secondary link `Switch to IELTS 4-Skill Mock →` (`/app/ielts`).
     - `<WorkspaceStatRow>` (4 borderless typographic stats):
       1. `315 / 340` (`GRE Projected Score · Q161 / V154` · link `/app/gre`)
       2. `Band 7.5` (`IELTS Projected Overall · L8.0 R7.5 W7.0 S7.5` · link `/app/ielts`)
       3. `45 Due` (`FSRS Active-Recall Cards Today` · link `/app/vocab`)
       4. `2 Open` (`Unresolved Mistake Ledger Items` · link `/app/mistakes`)
     - **Today's Study Ledger (`<WorkspaceLedger>`):** 4 clean hairline rows (`Section-Adaptive Quant Practice`, `GRE High-Frequency Core 1000 Review`, `IELTS Academic Writing Task 2 Rubric Lab`, `Mistake Ledger Hint-Free Retry`) with interactive completion checkboxes (`rounded-[2px]`) and underlined `Open Session →` links.

2. **Create Dedicated Left-Rail Tab 1: `/app/gre` (`apps/web/app/[locale]/(learner)/app/gre/page.tsx`) — GRE® General Track:**
   - `<WorkspaceHeader>` (`title="GRE® General Test Track"`, `subtitle="Computer-delivered section-adaptive Quantitative Reasoning, Verbal Reasoning, and Analytical Writing."`, `primaryAction={{ label: 'Launch Section-Adaptive Mock →', href: '/exam/diagnostic' }}`, `secondaryAction={{ label: 'GRE Score Calculator →', href: '/tools/gre-score-calculator' }}`).
   - `<WorkspaceStatRow>`: `315 / 340` (Estimated Total · Target 325+) | `Q161 / 170` (Quantitative · 78th Percentile) | `V154 / 170` (Verbal · 65th Percentile) | `4.5 / 6.0` (Analytical Writing).
   - `<WorkspaceTabs>` with 4 interactive tabs:
     - **Tab 1 (`drills` — `Adaptive Quant & Verbal Drills`):** Filter by `All | Quantitative | Verbal` and `Mode: Untimed Socratic Tutor | Timed Pacing (1m 30s)`. Renders the 12 curated GRE items as **clean hairline `<WorkspaceLedgerRow>` rows** (zero card grid, zero rainbow pill soup!) with `formatMathText()` applied to every stem (`x² = 16`, `y³ = -27`, `64π`). Clicking **`Solve Item →`** on any row expands an **inline interactive solver drawer** right under that row with clickable choices (`A`–`E`), the 3-tier progressive hint ladder (`Hint 1: Concept`, `Hint 2: Setup`, `Hint 3: Trap Alert`), full Socratic explanation, and 1-click `Save to Mistake Ledger`.
     - **Tab 2 (`mocks` — `Full Section-Adaptive CBT Mocks`):** Hairline ledger of 4 full-length 1h 58m GRE mocks (`Diagnostic Baseline — 308`, `Mock Test 1 — 313`, `Mock Test 2 — 315`, `Mock Test 3 — Ready to Launch`) with section breakdowns and `Launch CBT Simulator →` (`/exam/diagnostic`).
     - **Tab 3 (`awa` — `Analytical Writing (Issue Essay) Lab`):** Interactive official GRE Issue prompt selector + live word-counted essay editor + instant 0.0–6.0 Rubric Evaluation across Thesis Clarity, Counterargument Depth, Syntactic Variety, and Evidence Structure.
     - **Tab 4 (`formulas` — `Quant Formulas & Verbal Vocab`):** Quick access to GRE Quant cheat-sheets (Exponent laws, Prime factorization, Circle/Triangle ratios, Combinatorics) and FSRS Vocabulary decks (`/app/vocab`).

3. **Create Dedicated Left-Rail Tab 2: `/app/ielts` (`apps/web/app/[locale]/(learner)/app/ielts/page.tsx`) — IELTS™ Academic & GT Track:**
   - `<WorkspaceHeader>` (`title="IELTS™ Academic & General Training Track"`, `subtitle="Four-skill computer-delivered preparation across Listening, Reading, Writing, and Speaking."`, `primaryAction={{ label: 'Launch 4-Skill CD-IELTS Simulator →', href: '/exam/ielts-preview' }}`, `secondaryAction={{ label: 'IELTS Band Calculator →', href: '/tools/ielts-band-calculator' }}`).
   - Track variant selector in header (`Academic Module` | `General Training Module`).
   - `<WorkspaceStatRow>`: `Band 7.5` (Overall Estimate · Target 8.0) | `Listening 8.0` (36 / 40 Raw Score) | `Reading 7.5` (34 / 40 Raw Score) | `Writing 7.0 · Speaking 7.5` (4-Criterion Rubric).
   - `<WorkspaceTabs>` with 4 interactive tabs:
     - **Tab 1 (`mocks` — `4-Skill CD-IELTS Mock Tests`):** Hairline ledger of full computer-delivered Listening, Reading, Writing, and Speaking mock tests with band breakdowns and `Open CD-IELTS Workbench →` (`/exam/ielts-preview`).
     - **Tab 2 (`writing` — `Writing Task 1 & Task 2 Rubric Evaluator`):** Switch between `Task 1 (Academic Data Chart / GT Letter · 150+ words · 20 min)` and `Task 2 (Discursive Essay · 250+ words · 40 min)`. Includes an interactive essay workbench with live word count and instant **4-Criterion Band 0–9 Evaluation** (`Task Achievement/Response`, `Coherence & Cohesion`, `Lexical Resource`, `Grammatical Range & Accuracy`) plus paragraph-level rewrite suggestions.
     - **Tab 3 (`speaking` — `Speaking Part 1–3 Cue Card Studio`):** Interactive examiner prompt deck (`Part 1 Interview`, `Part 2 2-Minute Long Turn Cue Card with 1-Minute Prep Timer`, `Part 3 Abstract Discussion`), simulated recording/transcript evaluator, and Band 7.5+ lexical upgrading feedback.
     - **Tab 4 (`reading-listening` — `Reading & Listening Passage Drills`):** Interactive `True / False / Not Given`, `Matching Headings`, and `Part 4 Academic Lecture Note Completion` drills with inline passage highlight and explanation drawers.

4. **Rebuild `/app/plan`, `/app/mistakes`, `/app/progress`, `/app/practice`, and `/app/vocab` in the Editorial Ledger Aesthetic:**
   - **`/app/plan`:** `<WorkspaceHeader>` + `<WorkspaceStatRow>` (`Target: 325+ / Band 8.0`, `Current: 315 / Band 7.5`, `12 / 42 Tasks Completed`, `0 Missed`) + `<WorkspaceTabs>` (`Week 1` to `Week 6`) + `<WorkspaceLedger>` of 7 daily rows per week with interactive completion toggle and `Open Task →` links.
   - **`/app/mistakes`:** `<WorkspaceHeader>` + `<WorkspaceStatRow>` (`2 Open Mistakes`, `14 Resolved`, `Primary Cause: Careless Math`) + `<WorkspaceTabs>` (`All (3)` | `Open (2)` | `Resolved (1)`) + native `<select>` cause filter. Every item uses `formatMathText()` (zero `$x^2$`!) and renders as a clean hairline row with an **inline `Retry Without Hints →` solver** that transitions the item from `Open` to `Resolved` when solved correctly!
   - **`/app/progress`:** Delete `Rank Progression Roadmap` and the 28-box calendar. Render `<WorkspaceHeader>` + `<WorkspaceStatRow>` + a clean, borderless SVG Score Trajectory chart (`stroke="var(--brand-deep)"` actual, `stroke="var(--brand)"` dashed target) + 2-column Topic Mastery hairline ledgers (`Quantitative & Verbal` + `IELTS 4-Skill Breakdown`) with `<WorkspaceProgressBar>` (`4px` espresso/crimson bars).
   - **`/app/practice` & `/app/vocab`:** Restyle with `WorkspacePrimitives` and `formatMathText()` so zero card grids, zero rainbow badges, and zero raw LaTeX remain anywhere in `(learner)`.
   - Register `/app/gre` and `/app/ielts` in `tooling/design-lint.mjs` (`[workspace-guard]` & `[link-guard]`) and `tooling/design-shots.mjs`.

### Verification
Run `pnpm design:lint`, `pnpm design:shots`, `NODE_OPTIONS="--max-old-space-size=2048" pnpm --filter @lumen/core exec vitest run`, and `cd apps/web && NODE_OPTIONS="--max-old-space-size=2048" pnpm exec tsc --noEmit --incremental`. Commit `BATCH P28` to `main`, print receipts, and STOP.

---

## BATCH P29: PLANS, INSTALLMENTS & PAYMENT HISTORY (`/APP/BILLING`) + CRASH-FREE ACCOUNT, SECURITY & PRIVACY DESK (`/APP/SETTINGS`)

### Objective
1. Create `/app/billing` (`apps/web/app/[locale]/(learner)/app/billing/page.tsx`) providing a complete Stripe/Coursera-grade **Plans, Allowances, Split-Pay Installment Tracker & Payment History / Tax Invoice Ledger**.
2. Rebuild `/app/settings` (`apps/web/app/[locale]/(learner)/app/settings/page.tsx`) from scratch—permanently eliminating **React Hydration Error #441** and the false `UNVERIFIED (MINOR)` warning banner, and implementing real Academic Profile, Session Security, AI Data Privacy Opt-Out, and PDPO/GDPR Data Portability controls.

### Allowed Files
- `apps/web/app/[locale]/(learner)/app/billing/page.tsx` (new)
- `apps/web/app/[locale]/(learner)/app/settings/page.tsx`
- `tooling/design-lint.mjs`
- `tooling/design-shots.mjs`
- `packages/core/src/__tests__/workspace-design-guard.test.ts`

### Step-by-Step Implementation
1. **Create `/app/billing` (`apps/web/app/[locale]/(learner)/app/billing/page.tsx`):**
   - Use a deterministic `mounted` state guard inside `useEffect` before reading `localStorage` or fetching `/api/admin/catalog` and `/api/pricing/region` so SSR and initial client hydration match 100% (zero React Error #441!).
   - Compose with `WorkspacePrimitives`:
     - **`<WorkspaceHeader>`:** `title="Plans, Billing & Payment History"`, `subtitle="Manage your active exam preparation tracks, AI evaluation allowances, split-pay installments, and official tax invoices."`, `primaryAction={{ label: 'Add Track or Upgrade Plan →', href: '/checkout?plan=dual-prep-bundle' }}`, `secondaryAction={{ label: 'Compare Public Plans →', href: '/pricing' }}`.
     - **`<WorkspaceStatRow>` (Active Entitlements & Allowances):**
       1. `GRE® + IELTS™` (`Active Cohort Entitlement · Valid through May 15, 2027`)
       2. `14 / 20` (`AI Writing Rubric Evaluations Remaining`)
       3. `8 / 10` (`Speaking Audio Evaluations Remaining`)
       4. `5 / 6` (`Full Timed CBT Mock Exams Remaining`)
     - **`<WorkspaceTabs>`:** `1. Payment History & Invoices` | `2. Split-Pay Installment Schedule` | `3. Available Tracks & Credit Top-Ups`.
     - **Tab 1 (`Payment History & Official Tax Invoices Ledger`):**
       - Displays a clean hairline table/ledger of completed and sandbox transactions (merging deterministic seed invoices + any live receipts saved in `localStorage` from `/checkout`):
         - Row 1: `Nov 15, 2026` · `INV-2026-1041` · `GRE® Complete Track (2-Part Split · Installment 1/2)` · `bKash` · `৳5,027 BDT` (inc. `2.85%` clearing fee & `15%` VAT) · `Paid` · Action: **`View Official Invoice →`** | **`Request 7-Day Refund`**
         - Row 2: `Oct 12, 2026` · `INV-2026-0892` · `Mock & AI Evaluation Pass (Full Payment · 0% Fee)` · `Visa (USD)` · `$25.00 USD` · `Paid` · Action: **`View Official Invoice →`**
       - Clicking **`View Official Invoice →`** opens an inline, printable **Official Tax & Mushak 6.3 Receipt Sheet** (`bg-[var(--surface-paper)] border border-[var(--hairline)] p-6`) displaying the itemized base tuition, scholarship promo discount, split-pay clearing fee (`0%` / `2.85%` / `4.75%`), `15%` BD VAT (or `0%` USD export tax), Corporate/University BIN, and the `HMAC-SHA256` verification signature with a `Print / Save PDF` action.
       - Clicking **`Request 7-Day Refund`** opens an inline reason confirmation and submits a `REFUND` request to `/api/admin/catalog` (`ORDER_ACTION`), updating the row status to `Refund Requested / Processing`.
     - **Tab 2 (`Split-Pay Installment Schedule`):**
       - Shows the 2-Part (`2.85%` clearing fee) or 3-Part (`4.75%` clearing fee) installment ledger:
         - `Installment 1 of 2 (Down Payment)` · `Paid Nov 15, 2026` · `৳5,027 BDT`
         - `Installment 2 of 2 (Final Balance)` · `Due Dec 15, 2026` · `৳5,026 BDT` · Action: **`Settle Installment Now →`** (calls `/api/checkout/verify` or marks paid in state and generates receipt `INV-2026-1099`!).
     - **Tab 3 (`Available Tracks & Credit Top-Ups`):**
       - Displays the live dual-currency (`BDT ৳` | `USD $`) catalog synced from `/api/admin/catalog` as clean hairline rows with `Enroll or Upgrade →` links to `/checkout?plan=<slug>`.

2. **Rebuild `/app/settings` (`apps/web/app/[locale]/(learner)/app/settings/page.tsx`) — Crash-Free Account, Security & Privacy Desk:**
   - **Eliminate React Error #441** by removing all unguarded SSR/client mismatches and legacy billing crash blocks.
   - **Delete the giant `UNVERIFIED (MINOR)` warning banner** and `SEND GUARDIAN VERIFICATION REQUEST` box from the main view!
   - Compose with `WorkspacePrimitives` and `<WorkspaceTabs>` (`1. Profile & Exam Targets` | `2. Privacy & AI Data Governance` | `3. Security & Active Sessions`):
     - **Tab 1 (`Profile & Exam Targets`):**
       - Clean hairline form rows for: `Scholar Full Name` (`Ayman Rahman`), `Primary Email` (`ayman@lumen.academy`), `Target Exam Date` (`2026-12-15`), `GRE Target Score` (`325+`), `IELTS Target Band` (`8.0`), and `Preferred Billing Currency` (`Auto Geo-IP` | `Bangladesh · BDT ৳` | `International · USD $`), with a single `Save Preferences` button that persists to `localStorage` and shows a confirmation notice.
     - **Tab 2 (`Privacy & AI Data Governance — Privacy by Design`):**
       - Clean hairline toggle rows (`divide-y divide-[var(--hairline)]`):
         1. **Strict AI Essay & Speaking Privacy (Zero Training Guarantee):** `"Never use my Writing essays or Speaking audio recordings to train or calibrate shared rubric models"` — **Enabled (`Private & Isolated`) by default**.
         2. **Cohort Percentile Anonymization:** `"Hide my name and score trajectory from cohort percentile leaderboards"` — **Enabled (`Hidden`) by default**.
         3. **Admin Support PII Masking:** `"Require explicit audit-logged authorization before support staff can view my unmasked email or phone number"` — **Enabled by default**.
       - **Statutory Data Portability & Right to Erasure (PDPO 2025 / GDPR):**
         - Row 1: `Export Complete Personal Archive (JSON)` — downloads a real `.json` file containing profile, study history, mistake ledger, and invoice metadata.
         - Row 2: `Request Permanent Account & Data Erasure` — inline confirmation with 30-day grace period notice.
       - **Optional Under-18 Guardian Link (Closed `<details>` Disclosure at Bottom):**
         - Tucked inside a closed `<details className="lumen-disclosure border-t border-[var(--hairline)] pt-4 mt-6">` titled `"Under 18 years old? Configure optional parent or guardian consent (PDPO 2025)"`.
     - **Tab 3 (`Security & Active Sessions`):**
       - Shows authentication method (`Passwordless Email/SMS OTP + Passkey Ready`), active browser sessions ledger (`Fedora Linux · Chromium · Dhaka, BD · Current Session`, `Android Mobile · Dhaka, BD · 2 days ago`), and a `Revoke All Other Sessions` action.

3. **Register `/app/billing` & Enforce `[workspace-guard]` Across All `(learner)` Files:**
   - Add `/app/billing` to `tooling/design-lint.mjs` and `tooling/design-shots.mjs`.
   - Ensure `[workspace-guard]` in `tooling/design-lint.mjs` now enforces zero rainbow classes, zero large radii, zero RPG strings, and zero raw LaTeX across **every single file** in `apps/web/app/[locale]/(learner)/**`!

### Verification
Run `pnpm design:lint`, `pnpm design:shots`, `NODE_OPTIONS="--max-old-space-size=2048" pnpm --filter @lumen/core exec vitest run`, and `cd apps/web && NODE_OPTIONS="--max-old-space-size=2048" pnpm exec tsc --noEmit --incremental`. Commit `BATCH P29` to `main`, print receipts, and STOP.

---

## BATCH P30 (FINAL RELEASE GATE): DEDICATED ROLE-ISOLATED INSTITUTIONAL ADMIN CONSOLE (`/ADMIN`) IN CLAUDE LEDGER STYLE, PII MASKING & FULL PRODUCTION BUILD

### Objective
1. Create the dedicated Institutional Admin route group (`apps/web/app/[locale]/(admin)/layout.tsx` and `apps/web/app/[locale]/(admin)/admin/page.tsx`) completely separated from the student `(learner)` shell, and convert `apps/web/app/[locale]/(learner)/app/admin/page.tsx` into a clean server redirect to `/admin` (or `/app` if `lumen_role === 'scholar'`).
2. Replace the 20 stacked form boxes in the Admin Console with a high-density **Claude/Stripe-style Single-Hairline Ledger + Single-Row Progressive Disclosure Editor**, PII-masked Scholar Directory (`a***n@lumen.academy` with audited reveal), and blind-graded Moderation Studio (`SUB-8492`).
3. Run the complete verification suite (`pnpm design:lint`, `pnpm design:shots`, `vitest`, `tsc --noEmit`, and full `next build`), commit `BATCH P30` to `main`, and verify a 100% clean working tree.

### Allowed Files
- `apps/web/app/[locale]/(admin)/layout.tsx` (new dedicated Admin shell)
- `apps/web/app/[locale]/(admin)/admin/page.tsx` (new Claude-style 7-module Admin ERP ledger)
- `apps/web/app/[locale]/(learner)/app/admin/page.tsx` (replace with clean server redirect to `/admin`)
- `tooling/design-lint.mjs`
- `tooling/design-shots.mjs`
- `packages/core/src/__tests__/workspace-design-guard.test.ts`
- `docs/HANDOFF.md`
- `docs/MISTAKE-LEDGER.md`
- `docs/lumen_ui_overhaul_master_runbook.md`

### Step-by-Step Implementation
1. **Create Dedicated Institutional Admin Shell (`apps/web/app/[locale]/(admin)/layout.tsx`):**
   - Server/Client layout with **zero student links, zero streak/XP/credit pills, and zero exam track toggles**.
   - Left Sidebar (`w-full lg:w-[256px] shrink-0 bg-[var(--bg-warm)] border-b lg:border-b-0 lg:border-r border-[var(--hairline)] flex flex-col justify-between`):
     - Header: `<LumenSparkMotif />` + `Lumen Academy` + subline `Institutional Governance & ERP`.
     - Navigation items switching the active module in `/admin`:
       1. `Catalog, Pricing & Fees` (`/admin?tab=catalog`)
       2. `Promos & Scholarships` (`/admin?tab=promos`)
       3. `Orders, VAT & Refunds` (`/admin?tab=orders`)
       4. `CMS & Blind Moderation` (`/admin?tab=cms`)
       5. `Scholar Directory (PII Masked)` (`/admin?tab=scholars`)
       6. `Psychometrics & System Flags` (`/admin?tab=flags`)
       7. `Security Audit & JSON Backup` (`/admin?tab=audit`)
     - Footer: `<LocaleSwitcher />` (untouched), `Role: Institutional Admin (Strict Isolation)`, and an underlined `Switch Role / Sign out` link to `/sign-in`.

2. **Build `apps/web/app/[locale]/(admin)/admin/page.tsx` in the Claude Editorial Ledger Aesthetic:**
   - Compose with `WorkspacePrimitives` (`<WorkspaceContainer>`, `<WorkspaceHeader>`, `<WorkspaceStatRow>`, `<WorkspaceTabs>`, `<WorkspaceLedger>`):
   - **Top `<WorkspaceStatRow>`:**
     1. `9 Active` (`Configured Preparation Packages`)
     2. `2.85% / 4.75%` (`2-Part / 3-Part Split Clearing Fees`)
     3. `15.0%` (`Bangladesh VAT / Mushak 6.3 Rate`)
     4. `PII Masked` (`Zero-Knowledge Student Privacy Active`)
   - **Module 1 (`Catalog, Pricing & Fees` — High-Density Hairline Table + Single-Row Progressive Disclosure):**
     - **Global Gateway Fee Bar:** One compact horizontal hairline row at the top for `2-Part Split Clearing Fee (%)` (`2.85`), `3-Part Split Clearing Fee (%)` (`4.75`), and `BD VAT (%)` (`15.0`) with **one** `Save Fee Rates` button.
     - **Package Ledger Table (NO 20 expanded form boxes!):** Each package renders as a **single compact horizontal ledger row** showing: `Package Title & Slug` | `BDT Tuition (৳)` | `USD Price ($)` | `Split-Pay` | `Status` | **`Edit Row →`** (underlined link).
     - Clicking **`Edit Row →`** on a package expands an inline editor drawer for **ONLY that single selected row** (allowing edits to `baseBdt`, `baseUsd`, `nameEn`, `nameBn`, feature bullets, `allowSplit`, `active`, and a single `Save & Sync to Checkout` button). Clicking `+ Add New Package` toggles a single collapsible creation drawer at the top.
   - **Module 2 (`Promos & Scholarships`):** Compact hairline ledger of scholarship codes (`LUMEN10`, `DU20`, custom vouchers) with 1-click Active/Paused toggle and inline creation row.
   - **Module 3 (`Orders, Split-Pay Ledger & Mushak 6.3`):** Hairline transaction ledger showing `Order ID`, `Plan & Split Mode`, `Currency & Total`, `Status`, and inline actions (`Issue 7-Day Refund`, `Mark Offline Transfer Paid`, `Preview Mushak 6.3 VAT Chalan`).
   - **Module 4 (`CMS, TopRibbon & Blind Content Moderation`):**
     - Live `TopRibbon` announcement editor (EN + BN).
     - **Blind Essay & Speaking Moderation Queue:** Displays anonymized submission hashes (`SUB-8492`, `SUB-8501` — **student names and emails stripped for blind grading privacy!**) with `Approve`, `Request Revision`, and `Remove` actions.
     - Vocabulary & FAQ upkeep editor.
   - **Module 5 (`Scholar Directory — PII Masked by Default`):**
     - Uses `maskEmailForAdmin()` and `maskPhoneForAdmin()` so scholar emails render as `a***n@lumen.academy` by default.
     - Clicking **`Unmask Contact (Audited) →`** reveals the email for billing support AND automatically dispatches an immutable log entry (`ADMIN_PII_REVEAL`) to the Security Audit Log!
     - Includes 1-click entitlement actions (`+30 Days Access`, `+5 AI Evaluation Credits`, `Reset Diagnostic`)—while strictly prohibiting access to private student study notes or mistake reflections.
   - **Module 6 (`Psychometrics & System Kill-Switches`):** AI rubric strictness calibration + feature flag toggles (`splitPayEnabled`, `guestCheckoutEnabled`, `translateBudgetGuardEnabled`, `maintenanceBannerEnabled`).
   - **Module 7 (`Security Audit & JSON Backup`):** Immutable chronological audit log + `Export Full Catalog JSON` and `Reset to Canonical Defaults`.

3. **Replace `apps/web/app/[locale]/(learner)/app/admin/page.tsx` with a Clean Redirect:**
   - Replace the old 600-line `/app/admin/page.tsx` with a tiny server component that reads the `lumen_role` cookie: if `scholar`, `redirect('/app')`; otherwise `redirect('/admin')`.
   - Register `/admin` in `tooling/design-lint.mjs` (`[workspace-guard]` & `[link-guard]`) and `tooling/design-shots.mjs` (`rounded-full/2xl/3xl = 0`).
   - Update `packages/core/src/__tests__/workspace-design-guard.test.ts` to assert:
     1. Zero files in `(learner)` or `(admin)` violate `[workspace-guard]`.
     2. `(admin)/layout.tsx` contains zero student study links (`FSRS Vocab`, `Mistake Ledger`).
     3. `(admin)/admin/page.tsx` uses `maskEmailForAdmin` and progressive-disclosure row editing (`editingSlug`).
   - Revert any dirty `apps/web/next-env.d.ts` churn and update `docs/HANDOFF.md` and `docs/MISTAKE-LEDGER.md`.

### Verification
1. Run `pnpm design:lint` and `pnpm design:shots`.
2. Run `NODE_OPTIONS="--max-old-space-size=2048" pnpm --filter @lumen/core exec vitest run` and `cd apps/web && NODE_OPTIONS="--max-old-space-size=2048" pnpm exec tsc --noEmit --incremental`.
3. Run the full production build: `NODE_OPTIONS="--max-old-space-size=3072" pnpm --filter @lumen/web build`.
4. Commit `BATCH P30` to `main`, verify `git status -sb` is clean, print the final verification receipts, and STOP.