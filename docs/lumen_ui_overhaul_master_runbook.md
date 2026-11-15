# LUMEN ACADEMY: PHASE 5 MASTER RUNBOOK — ARCHITECTURAL DATA TABLES, 24 UNIQUE WEBP PHOTOGRAPHS, MONKEYTYPE CD-IELTS TYPING ENGINE & 5-ROLE RBAC WORKFORCE PORTALS (BATCHES P31 -> P34)

## SECTION 0: MANDATORY OPERATING RULES, EXPLICIT REJECTIONS & SECURITY MITIGATIONS (READ FIRST)

### 0.1 Execution Discipline
1. Execute ONLY the single batch requested by the user (`BATCH P31`, `BATCH P32`, `BATCH P33`, or `BATCH P34`).
2. When the requested batch is implemented, verified, and committed, print the raw verification receipts and **STOP IMMEDIATELY**.
3. Touch ONLY the files listed under `Allowed Files` for the active batch.
4. Always prefix Vitest and TypeScript commands with `NODE_OPTIONS="--max-old-space-size=2048"`. Commit as `Ayman Rahman <aymanrahman30@gmail.com>`. Do NOT run `git push`.

### 0.2 Protected Paths (NEVER MODIFY)
- `apps/web/app/[locale]/_components/LocaleSwitcher.tsx`
- `apps/web/app/[locale]/_components/LocaleLink.tsx`
- `apps/web/app/[locale]/_components/TranslatedText.tsx`
- `apps/web/app/api/translate/route.ts`
- All strict marketing `page.tsx` files (`apps/web/app/[locale]/(marketing)/**/page.tsx`, excluding `/tools/*`) must remain at `className=0` and `<table>=0` outside `<Disclosure>`.

### 0.3 What You Must Explicitly REJECT (Enforced by `pnpm design:lint` & Vitest)
1. **NO Borderless Ragged Text Lists Masquerading as Tables in Dashboards:** All multi-column tabular data in `/app/*`, `/evaluator`, `/instructor`, `/auditor`, and `/admin` MUST use `<WorkspaceDataTable>` from `WorkspacePrimitives.tsx` with a `1px solid var(--hairline)` outer frame, a tinted `<thead className="bg-[var(--bg-warm)] border-b border-[var(--hairline)]">` column header bar, semantic `<th scope="row">` row headers with a right hairline divider, vertical cell dividers (`divide-x divide-[var(--hairline)]`), and `tabular-nums` alignment.
2. **NO Wrapped Stat Numerals or Stacked Duplicate Spark Motifs on `/`:** Stat values in `<StatRow>` must never wrap onto two lines (`whitespace-nowrap`, `<= 6 chars`). Never render two `<LumenSparkMotif />` icons immediately adjacent to each other.
3. **NO Duplicate Photography Files or Reused Marketing Photo Slots:** Every `.webp` file in `MEDIA_MANIFEST` must have a 100% unique SHA-256 buffer on disk, and `/`, `/gre`, `/ielts`, `/courses`, `/pricing`, `/for-institutions`, and `/help` must use distinct `photoSlot` keys.
4. **NO `<textarea>` Shortcut in the Typing Engine:** `<TypingPracticeEngine />` must implement Monkeytype's `#wordsWrapper` -> `.word` -> `<span data-letter>` + smooth gliding `#caret` architecture with `c/i/e/m` character states, previous-word error backspace recovery, `Tab + Enter` instant restart, focus-mode chrome dimming, and per-second SVG telemetry.
5. **NO Off-Palette "SaaS Rainbow" Classes, Large Radii, Shadows, RPG Clutter, or Raw LaTeX:** `[workspace-guard]` enforces zero `rounded-md/lg/xl/2xl/3xl/full`, zero `shadow-*`, zero `bg-blue-*/green-*/emerald-*/yellow-*/slate-*/zinc-*`, zero `text-[9px]/text-[10px]/text-[11px] uppercase`, zero RPG XP strings, and zero unformatted `$x^2$` LaTeX across all 5 role portals (`/app`, `/evaluator`, `/instructor`, `/auditor`, `/admin`) and `/tools/ielts-typing-test`.
6. **NO Unauthenticated or Cross-Role Privilege Escalation:** Enforce both route-level isolation (`resolveRoleRedirect` in `proxy.ts`) AND action-level API RBAC (`enforceRoleActionPermission` in `/api/admin/catalog`) across all 5 roles (`scholar`, `evaluator`, `instructor`, `auditor`, `admin`).

---

## BATCH P31: HOMEPAGE STATROW ALIGNMENT (`40+`), ARCHITECTURAL `<WORKSPACEDATATABLE>` UPGRADE ACROSS `/APP` & `/ADMIN`, AND 24 UNIQUE SHA-256 VERIFIED WEBP PHOTOGRAPHS (`[ASSET-GUARD]`)

### Objective
1. Fix the wrapped `"40+ Rubrics"` stat numeral and duplicate `<LumenSparkMotif />` on `/`.
2. Build `<WorkspaceDataTable>` in `WorkspacePrimitives.tsx` (with tinted column headers, `<th scope="row">` row headers, vertical cell hairlines, and `tabular-nums` alignment) and upgrade all tabular views across `/admin` and `/app/*`.
3. Expand `apps/web/src/content/media.ts` and `apps/web/public/images/*.webp` to **24 unique `.webp` photographs** (`<= 120KB` heroes/splits, `<= 60KB` columns) so every marketing page uses distinct imagery, verified by a SHA-256 file-uniqueness check in `tooling/design-lint.mjs` and `ui-primitives-caps.test.ts`.

### Allowed Files
- `apps/web/app/tokens.css`
- `apps/web/src/components/ui/primitives.tsx`
- `apps/web/src/components/ui/WorkspacePrimitives.tsx`
- `apps/web/src/content/marketing.ts`
- `apps/web/src/content/media.ts`
- `apps/web/public/images/*.webp`
- `apps/web/app/[locale]/(admin)/admin/page.tsx`
- `apps/web/app/[locale]/(learner)/app/page.tsx`
- `apps/web/app/[locale]/(learner)/app/gre/page.tsx`
- `apps/web/app/[locale]/(learner)/app/ielts/page.tsx`
- `apps/web/app/[locale]/(learner)/app/plan/page.tsx`
- `apps/web/app/[locale]/(learner)/app/mistakes/page.tsx`
- `apps/web/app/[locale]/(learner)/app/progress/page.tsx`
- `apps/web/app/[locale]/(learner)/app/billing/page.tsx`
- `apps/web/app/[locale]/(learner)/app/vocab/page.tsx`
- `tooling/design-lint.mjs`
- `packages/core/src/__tests__/ui-primitives-caps.test.ts`

### Step-by-Step Implementation
1. **Fix Homepage `StatRow` Alignment & Duplicate Spark Motif (`tokens.css`, `primitives.tsx`, `marketing.ts`):**
   - In `apps/web/src/content/marketing.ts`: Change the 4th homepage `StatRow` item from `value: '40+ Rubrics'` to `value: '40+'` (EN) and `value: '৪০+'` (BN), with `caption: 'Calibrated Writing & Speaking Rubrics'` (EN) / `'মানসম্মত রাইটিং ও স্পিকিং রুব্রিক'` (BN) (`<= 6 chars`, matching `1h 58m`, `4 Skills`, `1,500+`).
   - In `apps/web/app/tokens.css` and `apps/web/src/components/ui/primitives.tsx`: Add `whitespace-nowrap` and `leading-none` to `.lumen-stat-value` inside `<StatRow>` and align all 4 stat columns so every stat numeral sits on the exact same horizontal baseline and never wraps onto 2 lines.
   - In `apps/web/src/components/ui/primitives.tsx`: Remove the redundant `<LumenSparkMotif />` from `<StepRow>` (or suppress it when `<StatRow>` already renders the divider motif above it) so two spark motifs never stack vertically on `/`.

2. **Build `<WorkspaceDataTable>` in `apps/web/src/components/ui/WorkspacePrimitives.tsx` & Upgrade All `/admin` and `/app/*` Tables:**
   - Export `<WorkspaceDataTable>` (and `WorkspaceTableColumn`, `WorkspaceTableRow` types) from `WorkspacePrimitives.tsx`:
     - Props: `{ columns: Array<{ key: string; header: string; align?: 'left' | 'right' | 'center'; widthClass?: string }>; rows: Array<{ id: string; rowHeader: React.ReactNode; rowSubheader?: string; cells: Record<string, React.ReactNode>; expandedContent?: React.ReactNode }>; emptyMessage?: string; caption?: string }`.
     - Renders `div className="border border-[var(--hairline)] rounded-[4px] overflow-x-auto bg-[var(--surface-paper)] mb-8"`:
       - `<table className="w-full border-collapse text-left">`:
         - `<thead className="bg-[var(--bg-warm)] border-b border-[var(--hairline)]">` with `<tr className="divide-x divide-[var(--hairline)]">`, where each `<th scope="col">` has `px-4 py-3 text-xs font-semibold text-[var(--brand-deep)] tracking-normal`.
         - `<tbody className="divide-y divide-[var(--hairline)]">`, where each `<tr>` has `divide-x divide-[var(--hairline)] even:bg-[var(--bg)]/45 hover:bg-[var(--bg-warm)]/65 transition-colors duration-150`:
           - First cell (`columns[0]`) is a semantic Row Header `<th scope="row" className="px-4 py-3.5 font-semibold text-sm text-[var(--brand-deep)] bg-[var(--bg)]/35 align-middle">` (rendering `row.rowHeader` and optional `row.rowSubheader` in `block text-xs font-normal text-[var(--text-muted)] mt-0.5`).
           - Remaining cells (`columns.slice(1)`) are `<td className="px-4 py-3.5 text-sm text-[var(--text-primary)] tabular-nums align-middle">` (respecting `align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'`).
         - When `row.expandedContent` is truthy, renders `<tr className="bg-[var(--bg-warm)]/40 border-t border-[var(--hairline)]"><td colSpan={columns.length} className="p-5">{row.expandedContent}</td></tr>`.
   - Upgrade `/admin` (`apps/web/app/[locale]/(admin)/admin/page.tsx`) to use `<WorkspaceDataTable>` across all modules (`Catalog & Dual-Currency Price Matrix`, `Promos & Scholarships`, `Orders, Split-Pay & Mushak 6.3`, `Blind Content Moderation`, `Scholar Directory — PII Masked`, and `Security Audit Ledger`).
   - Upgrade `/app` (Today's Study Checklist), `/app/gre` (Adaptive Drills table + CBT Mocks table), `/app/ielts` (CD-IELTS Mocks table + Passage Drills table), `/app/plan` (7-Day Weekly Milestone table), `/app/mistakes` (Mistake Remediation table), `/app/progress` (Quantitative, Verbal & IELTS Skill Mastery tables), `/app/billing` (Payment History & Invoices table + Split-Pay Schedule table), and `/app/vocab` (Curated Vocabulary Decks table) to use `<WorkspaceDataTable>`.

3. **24 Unique Self-Hosted WebP Photographs & SHA-256 Uniqueness Guard (`media.ts`, `marketing.ts`, `public/images/*.webp`, `design-lint.mjs`, `ui-primitives-caps.test.ts`):**
   - Expand `PhotoSlot` and `MEDIA_MANIFEST` in `apps/web/src/content/media.ts` to **24 distinct slots**:
     - Existing 15 slots: `hero-home`, `hero-gre`, `hero-ielts`, `hero-courses`, `hero-pricing`, `hero-institutions`, `hero-help`, `split-diagnostic`, `col-gre-general`, `col-ielts-academic`, `col-ielts-gt`, `col-self-paced`, `col-live-cohort`, `col-mock-pass`, `nav-editorial`.
     - New 9 slots: `split-gre-adaptive`, `split-gre-hints`, `split-ielts-cbt`, `split-ielts-rubric`, `col-gre-quant`, `col-gre-verbal`, `col-ielts-writing`, `col-ielts-speaking`, `col-inst-cohort`.
   - Update `marketing.ts` (`en` and `bn`) so `/gre`, `/ielts`, and `/for-institutions` reference these dedicated slots instead of reusing `split-diagnostic`, `col-gre-general`, or `col-ielts-academic`.
   - Ensure every one of the 24 `/images/<slot>.webp` files in `apps/web/public/images/` is a valid, distinct `.webp` image (`hero/split <= 120KB`, `col <= 60KB`) with a **unique SHA-256 digest** (if any existing `.webp` files on disk are byte-identical copies or if new slots are added, generate/encode distinct visual WebP variations using `sharp`, `cwebp`, `ffmpeg`, `python3` PIL, or distinct valid WebP image buffers so every file is visually and cryptographically unique).
   - Update `[asset-guard]` in `tooling/design-lint.mjs` and `packages/core/src/__tests__/ui-primitives-caps.test.ts` to compute `crypto.createHash('sha256')` over all 24 `.webp` files in `MEDIA_MANIFEST` and fail if any two slots share the same SHA-256 hash!

### Verification
Run `pnpm design:lint`, `pnpm design:shots`, `NODE_OPTIONS="--max-old-space-size=2048" pnpm --filter @lumen/core exec vitest run`, and `cd apps/web && NODE_OPTIONS="--max-old-space-size=2048" pnpm exec tsc --noEmit --incremental`. Commit `BATCH P31` to `main`, print receipts, and STOP.

---

## BATCH P32: MONKEYTYPE-ARCHITECTURE CD-IELTS & GRE TYPING SPEED & ACCURACY STUDIO (`/APP/TYPING` & `/TOOLS/IELTS-TYPING-TEST`)

### Objective
Build the Monkeytype-architecture CD-IELTS & GRE Typing Speed & Accuracy Studio (`<TypingPracticeEngine />`) modeled on `monkeytypegame/monkeytype` (`#testConfig`, `#wordsWrapper`, `.word`, `<span data-letter>`, smooth `#caret`, `c/i/e/m` character states, previous-word error backspace recovery, `Tab + Enter` instant restart, per-second dual-axis SVG chart, and `Practice Missed Words Only`) in Lumen's editorial design language, and wire it into `/app/typing`, `/app/ielts`, `/tools/ielts-typing-test`, and the IELTS/Dual-Prep package catalog.

### Allowed Files
- `apps/web/src/content/typing-corpora.ts` (new curated CD-IELTS & GRE typing corpora + pure telemetry math)
- `apps/web/src/components/typing/TypingPracticeEngine.tsx` (new Monkeytype-architecture interactive engine)
- `apps/web/app/[locale]/(learner)/app/typing/page.tsx` (new Scholar Typing Studio page)
- `apps/web/app/[locale]/(learner)/layout.tsx` (add `CD-IELTS Typing Studio` `/app/typing` under Exam Preparation Tracks)
- `apps/web/app/[locale]/(learner)/app/ielts/page.tsx` (link/surface CD-IELTS Typing Studio)
- `apps/web/app/[locale]/(marketing)/tools/ielts-typing-test/page.tsx` (new public interactive tool route)
- `apps/web/src/content/nav.ts` (add IELTS Typing Speed Test to Practice Tests mega-menu & footer)
- `apps/web/src/content/marketing.ts` (include CD-IELTS Typing Studio in IELTS & Dual-Prep course features)
- `apps/web/src/lib/security/payment-guard.ts` (include CD-IELTS Typing Studio in IELTS plan feature bullets)
- `apps/web/app/sitemap.ts` (register `/tools/ielts-typing-test`)
- `tooling/design-lint.mjs`
- `tooling/design-shots.mjs`
- `packages/core/src/__tests__/typing-engine.test.ts` (new unit test suite)

### Step-by-Step Implementation
1. **Create Curated Exam Typing Corpora & Monkeytype Telemetry Math (`apps/web/src/content/typing-corpora.ts`):**
   - Export `TYPING_CORPORA` with 4 exam-authentic categories (each containing multiple rich passages and high-yield academic vocabulary):
     1. `ielts-task2-band8`: Band 8.5 Academic/GT Task 2 discursive essay paragraphs (cohesive devices, subordinate clauses, formal academic register).
     2. `ielts-task1-data`: Academic Task 1 data-report prose with statistical comparisons (`47.8%`, `1995–2025`, `threefold`), fractions, and trend verbs (`outpaced`, `plateaued`, `conversely`).
     3. `ielts-listening-spelling`: High-risk CD-IELTS Listening Part 1–4 spelling trap words (`accommodation`, `millennium`, `questionnaire`, `entrepreneur`, `mediterranean`, `colleague`, `curriculum`, `hierarchy`, `archaeology`, `meteorology`).
     4. `gre-awa-issue`: GRE Analytical Writing Issue essay prose with dense counterarguments and qualifiers.
   - Export pure Monkeytype telemetry functions:
     - `calculateNetWpm(correctChars: number, elapsedSeconds: number): number` -> `Math.max(0, Math.round((correctChars / 5) / (elapsedSeconds / 60)))`
     - `calculateRawWpm(allTypedChars: number, elapsedSeconds: number): number` -> `Math.max(0, Math.round((allTypedChars / 5) / (elapsedSeconds / 60)))`
     - `calculateAccuracy(correctKeystrokes: number, totalKeystrokes: number): number` -> `totalKeystrokes > 0 ? Number(((correctKeystrokes / totalKeystrokes) * 100).toFixed(1)) : 100`
     - `calculateConsistency(perSecondRawWpm: number[]): number` -> coefficient-of-variation consistency score mapped to `0–100%` (returns `100` for perfectly steady pacing).
     - `evaluateIeltsTypingReadiness(netWpm: number, accuracy: number)`: calculates the exact minutes required to type 400 words (150w Task 1 + 250w Task 2) at `netWpm` and returns a structured Band readiness verdict.

2. **Build `<TypingPracticeEngine />` (`apps/web/src/components/typing/TypingPracticeEngine.tsx`) Following `monkeytypegame/monkeytype`:**
   - Strictly use Lumen tokens (`--bg`, `--bg-warm`, `--surface-paper`, `--brand-deep`, `--brand`, `--text-secondary`, `--text-muted`, `--hairline`) and `rounded-[4px]` geometry (zero `rounded-full/xl/2xl/3xl`, zero shadows, zero blue/green/yellow classes!).
   - **Monkeytype `#testConfig` Bar (`bg-[var(--bg-warm)] border border-[var(--hairline)] rounded-[4px] px-4 py-2.5 mb-6 flex flex-wrap items-center justify-between gap-4`):**
     - Group 1 (Modifiers): Toggle buttons for `punctuation`, `numbers`, `strict exam mode` (disables backspace into completed correct words), and `caret: line | block | underline`.
     - Group 2 (Mode): `time` | `words` | `exam-corpus`.
     - Group 3 (Sub-Options): `15s · 30s · 60s · 120s` (when `time`), `25 · 50 · 150 (Task 1) · 250 (Task 2)` (when `words`), or the 4 `TYPING_CORPORA` presets.
   - **Monkeytype `#liveStatsMini` & Focus-Dimming:**
     - Large tabular numerals (`text-2xl md:text-3xl font-extrabold text-[var(--brand-deep)] tabular-nums`) showing live countdown/word counter, live Net WPM, and live Accuracy %.
     - While `isTyping` is active, `#testConfig` smoothly dims to `opacity-40 transition-opacity duration-200` (`focusMode`).
   - **Monkeytype `#wordsWrapper`, `.word`, `<span data-letter>`, and Gliding `#caret`:**
     - Hidden `<input id="wordsInput" type="text" autoComplete="off" autoCapitalize="off" autoCorrect="off" spellCheck={false} />` focused automatically on click or keydown.
     - If input loses focus for `> 1500ms` while a test is in progress, display a subtle centered overlay (`bg-[var(--surface-paper)]/90 border border-[var(--hairline)] px-4 py-2 text-sm font-semibold text-[var(--brand-deep)]`): `"Out of focus — Click or press any key to resume"`.
     - Render each word as `<span data-word-index={wIdx} className="inline-block mr-3 mb-2">` and each character as `<span data-letter-index={cIdx}>`:
       - **Character States (`c / i / e / m`):**
         - Untyped: `text-[var(--text-muted)] opacity-50`
         - Correct (`c`): `text-[var(--brand-deep)]`
         - Incorrect (`i`): `text-[var(--brand)] underline decoration-[var(--brand)] decoration-2`
         - Extra characters typed beyond word length (`e`): `<span data-extra="true" className="text-[var(--brand)] opacity-80 line-through">`
         - Missed characters skipped by early spacebar (`m`): `text-[var(--text-muted)] underline decoration-dotted decoration-[var(--brand)]`
       - **Smooth Gliding Caret (`#caret`):** Positioned dynamically at the active word/character coordinates (`transition: transform 85ms cubic-bezier(0.22, 1, 0.36, 1)`), supporting `line` (`w-[2.5px] bg-[var(--brand)]`), `block` (`bg-[var(--brand)]/25`), and `underline` (`h-[2.5px] bottom-0 bg-[var(--brand)]`).
       - **Previous-Word Error Backspace Recovery:** Pressing `Backspace` at character index `0` of word `wIdx > 0` jumps back into word `wIdx - 1` if word `wIdx - 1` had any incorrect or missed characters!
       - **Instant Restart Keybind:** Pressing `Tab` then `Enter` (or `Escape`) resets the timer, reshuffles/reseeds the corpus, and places the caret at word `0`, char `0` in `<16ms`.
   - **Monkeytype `#result` Telemetry View (plus a `Preview Sample Telemetry` toggle so users/auditors can inspect the full chart immediately):**
     - `<WorkspaceStatRow>` with 4 metrics: `Net WPM`, `Accuracy %`, `Characters (c/i/e/m)` + `Consistency %`, and `CD-IELTS 400-Word Time`.
     - **Second-by-Second Dual-Axis SVG Graph:** Plots `Net WPM` (solid `--brand-deep` path), `Raw WPM` (dashed `--text-muted` path), and `Errors` (filled `--brand` crimson dots) across every second of the test.
     - **Mistyped Words & History `<WorkspaceDataTable>`:** Lists every mistyped word (`Word (Row Header)` | `Your Input` | `Character Delta` | `Remediation Action`) + a **`Practice Missed Words Only →`** button that launches a custom drill with only the missed words!

3. **Wire Routes, Sidebar, Public Tool & Unit Tests:**
   - Create `apps/web/app/[locale]/(learner)/app/typing/page.tsx` and add `CD-IELTS Typing Studio` (`/app/typing`) to `(learner)/layout.tsx`.
   - Surface a quick launch link to `/app/typing` inside `apps/web/app/[locale]/(learner)/app/ielts/page.tsx`.
   - Create `apps/web/app/[locale]/(marketing)/tools/ielts-typing-test/page.tsx`, add `/tools/ielts-typing-test` to `nav.ts`, `sitemap.ts`, `tooling/design-lint.mjs`, and `tooling/design-shots.mjs`, and add CD-IELTS Typing Studio to IELTS package features in `marketing.ts` and `payment-guard.ts`.
   - Create `packages/core/src/__tests__/typing-engine.test.ts` testing WPM, raw WPM, accuracy, `c/i/e/m` character math, consistency, and readiness verdicts.

### Verification
Run `pnpm design:lint`, `pnpm design:shots`, `NODE_OPTIONS="--max-old-space-size=2048" pnpm --filter @lumen/core exec vitest run`, and `cd apps/web && NODE_OPTIONS="--max-old-space-size=2048" pnpm exec tsc --noEmit --incremental`. Commit `BATCH P32` to `main`, print receipts, and STOP.

---

## BATCH P33: 5-ROLE ENTERPRISE RBAC ARCHITECTURE — BLIND EVALUATOR PORTAL (`/EVALUATOR`), FACULTY INSTRUCTOR STUDIO (`/INSTRUCTOR`) & PSYCHOMETRIC/COMPLIANCE AUDITOR CONSOLE (`/AUDITOR`)

### Objective
Upgrade the role-security layer (`role-guard.ts`, `policy.ts`, `proxy.ts`, `/api/admin/catalog`, and `AuthForm.tsx`) to enforce **5 strictly isolated roles (`scholar`, `evaluator`, `instructor`, `auditor`, `admin`)** with endpoint-level RBAC permission checks (`ROLE_PERMISSION_MATRIX`), and build the dedicated Claude-styled portals for **Certified Human Evaluators (`/evaluator`)**, **Faculty Instructors (`/instructor`)**, and **Psychometric & Compliance Auditors (`/auditor`)** using `<WorkspaceDataTable>`.

### Allowed Files
- `apps/web/src/lib/role-guard.ts`
- `apps/web/src/lib/security/policy.ts`
- `apps/web/src/lib/security/payment-guard.ts`
- `apps/web/app/api/admin/catalog/route.ts`
- `apps/web/proxy.ts`
- `apps/web/app/[locale]/(auth)/_components/AuthForm.tsx`
- `apps/web/app/[locale]/(evaluator)/layout.tsx` (new)
- `apps/web/app/[locale]/(evaluator)/evaluator/page.tsx` (new)
- `apps/web/app/[locale]/(instructor)/layout.tsx` (new)
- `apps/web/app/[locale]/(instructor)/instructor/page.tsx` (new)
- `apps/web/app/[locale]/(auditor)/layout.tsx` (new)
- `apps/web/app/[locale]/(auditor)/auditor/page.tsx` (new)
- `tooling/design-lint.mjs`
- `tooling/design-shots.mjs`
- `packages/core/src/__tests__/workspace-design-guard.test.ts`

### Step-by-Step Implementation
1. **5-Role Isolation & Endpoint RBAC Matrix (`role-guard.ts`, `policy.ts`, `proxy.ts`, `/api/admin/catalog/route.ts`):**
   - In `apps/web/src/lib/role-guard.ts`:
     - Update `export type WorkspaceRole = 'scholar' | 'evaluator' | 'instructor' | 'auditor' | 'admin'`.
     - Export `ROLE_HOME_PATHS: Record<WorkspaceRole, string> = { scholar: '/app', evaluator: '/evaluator', instructor: '/instructor', auditor: '/auditor', admin: '/admin' }`.
     - Export `ROLE_PERMISSION_MATRIX: Record<WorkspaceRole, readonly string[]>` mapping each role to its permitted mutation actions:
       - `scholar`: `['SCHOLAR_REQUEST_REFUND']`
       - `evaluator`: `['EVALUATOR_SUBMIT_GRADE', 'CMS_UPDATE']`
       - `instructor`: `['INSTRUCTOR_SUBMIT_ITEM', 'INSTRUCTOR_RESOLVE_DOUBT', 'INSTRUCTOR_UPDATE_COHORT']`
       - `auditor`: `['AUDITOR_ADJUDICATE_IRR', 'AUDITOR_CERTIFY_ITEM', 'AUDITOR_VERIFY_CHAIN']`
       - `admin`: `['UPDATE_PLAN', 'ADD_PLAN', 'UPDATE_FEES', 'UPSERT_PROMO', 'TOGGLE_PROMO', 'ORDER_ACTION', 'CMS_UPDATE', 'SCHOLAR_ACTION', 'TOGGLE_FLAG', 'PSYCHOMETRIC_UPDATE', 'PII_REVEAL', 'RESET_DEFAULTS', 'EVALUATOR_SUBMIT_GRADE', 'INSTRUCTOR_SUBMIT_ITEM', 'AUDITOR_ADJUDICATE_IRR', 'AUDITOR_CERTIFY_ITEM']`
     - Export `canRolePerformAction(role: WorkspaceRole, action: string): boolean` and `resolveRoleRedirect(role: WorkspaceRole | null, pathname: string): string | null`:
       - If `role` is set (`scholar`, `evaluator`, `instructor`, `auditor`, `admin`) and `pathname` enters any of the OTHER 4 role prefixes (`/app`, `/evaluator`, `/instructor`, `/auditor`, `/admin`), return `ROLE_HOME_PATHS[role]` (preserving `/bn` prefix when present).
       - If `role` is `null` (stateless CI crawler), allow each route to render its native shell (except `/app/admin` -> `/admin`).
   - Wire `resolveRoleRedirect` into `apps/web/proxy.ts`.
   - In `apps/web/app/api/admin/catalog/route.ts`:
     - Read caller role from `request.cookies.get('lumen_role')?.value` or optional `x-lumen-role` header (defaulting to `'admin'` when unset so existing unit/admin callers work, but strictly enforcing `canRolePerformAction(callerRole, body.action)` whenever a non-admin role is present, returning HTTP `403` with `{ error: 'RBAC_FORBIDDEN_ROLE_ACTION' }` if unauthorized!).
     - Add support in `payment-guard.ts` and `/api/admin/catalog/route.ts` for `EVALUATOR_SUBMIT_GRADE`, `INSTRUCTOR_SUBMIT_ITEM`, `AUDITOR_ADJUDICATE_IRR`, and `AUDITOR_CERTIFY_ITEM`, logging every action to `auditLog`.
   - In `apps/web/app/[locale]/(auth)/_components/AuthForm.tsx`:
     - Render all 5 role sandbox entry buttons (`Scholar Workspace /app`, `Certified Evaluator Desk /evaluator`, `Faculty Instructor Studio /instructor`, `Psychometric & QA Auditor /auditor`, `Institutional Admin ERP /admin`), calling `setWorkspaceRoleCookie(role)` on click.

2. **Build Portal 2: Certified Human Evaluator & Checker Desk (`(evaluator)/layout.tsx` & `(evaluator)/evaluator/page.tsx`):**
   - Warm Parchment Left Sidebar (`Lumen Academy · Certified Evaluator Desk`, Role: `Blind Rubric Evaluator · Zero-PII Mode`).
   - Composed with `WorkspacePrimitives` and `<WorkspaceDataTable>` across 3 modules:
     - **Tab 1 (`queue` — `Blind SLA Grading Queue`):** `<WorkspaceDataTable>` of anonymized submissions (`SUB-8492 · IELTS Academic Task 2`, `SUB-8501 · GRE Issue Essay`, `SUB-8514 · IELTS Speaking Part 2`, `SUB-8529 · IELTS GT Task 1`) with columns `Anonymous Hash (Row Header)` | `Exam & Task` | `Word Count & Typing WPM` | `AI Pre-Score` | `SLA Countdown` | `Action (Grade Blind →)`. Zero student names/emails/phones!
     - **Tab 2 (`workbench` — `Split-Screen Blind Rubric Workbench`):**
       - Left panel: Submission text/transcript (`SUB-8492`), word count (`278 words`), scholar CD-IELTS typing telemetry (`58 WPM · 96.8% accuracy`), and clickable inline rubric tags (`[Cohesion Gap]`, `[Lexical Upgrade]`, `[Task Achievement]`, `[Grammar Agreement]`).
       - Right panel: 4-Criterion `4.0–9.0` (0.5 step) Band Sliders (`Task Response`, `Coherence & Cohesion`, `Lexical Resource`, `Grammatical Range & Accuracy`), live computed Overall Band, examiner written feedback box, and **`Submit Final Blind Evaluation`** button (calls `POST /api/admin/catalog` with `EVALUATOR_SUBMIT_GRADE`).
     - **Tab 3 (`payouts` — `Evaluator SLA & Piece-Rate Payout Ledger`):** `<WorkspaceStatRow>` + `<WorkspaceDataTable>` of batch evaluations, SLA compliance %, inter-rater reliability %, and BDT/USD contractor payouts.

3. **Build Portal 3: Faculty & Cohort Instructor Studio (`(instructor)/layout.tsx` & `(instructor)/instructor/page.tsx`):**
   - Warm Parchment Left Sidebar (`Lumen Academy · Faculty Teaching Studio`, Role: `Lead Cohort Instructor`).
   - Composed with `WorkspacePrimitives` and `<WorkspaceDataTable>` across 4 modules:
     - **Tab 1 (`cohorts` — `Live Cohort Schedule & Attendance Table`):** `<WorkspaceDataTable>` of active cohorts (`GRE Quant Evening Batch 14`, `CD-IELTS Band 7.5+ Intensive`, `GRE Verbal & AWA Weekend Seminar`) with expandable syllabus/homework notes editor.
     - **Tab 2 (`telemetry` — `Aggregate Cohort Diagnostic Weakness Table`):** `<WorkspaceDataTable>` of cohort-wide trap accuracy (`3-Blank Text Completion Contrast Traps · 54%`, `Quant Comparison Negative Exponents · 61%`, `IELTS Reading True/False/Not Given · 64%`) with 1-click `Assign Cohort Drill`.
     - **Tab 3 (`authoring` — `Question Bank, 3-Tier Hints & Typing Corpus Authoring`):** Interactive authoring workbench with live `formatMathText()` preview (`$x^2 - y^2 = 24$` -> `x² - y² = 24`), 3-tier hint fields, and `<WorkspaceDataTable>` of authored items submitted to the Auditor QA Queue (`INSTRUCTOR_SUBMIT_ITEM`).
     - **Tab 4 (`doubts` — `Scholar Academic Doubt Escalations`):** `<WorkspaceDataTable>` of anonymized item doubt threads (`Q-GRE-104`, `Q-IELTS-209`) with inline Socratic faculty response composer.

4. **Build Portal 4: Psychometric, Rubric & Compliance Auditor Console (`(auditor)/layout.tsx` & `(auditor)/auditor/page.tsx`):**
   - Warm Parchment Left Sidebar (`Lumen Academy · Psychometric & Compliance Audit`, Role: `Independent QA Auditor`).
   - Composed with `WorkspacePrimitives` and `<WorkspaceDataTable>` across 3 modules:
     - **Tab 1 (`irr` — `Inter-Rater Reliability (IRR) & Grading Drift Adjudication`):** `<WorkspaceDataTable>` comparing `AI Pre-Score` vs. `Human Evaluator Band` on `SUB-8492`, `SUB-8501`, `SUB-8514`, flagging any delta `>= 1.0 Band` (`Drift Flagged`) with an inline **Third-Marker Adjudication Drawer** (`AUDITOR_ADJUDICATE_IRR`).
     - **Tab 2 (`item-qa` — `Curriculum & Item-Bank Psychometric QA Gate`):** `<WorkspaceDataTable>` of instructor-authored items showing `Item ID (Row Header)` | `Formatted Stem Preview` | `Difficulty (p-value)` | `Discrimination (r_pb)` | `QA Status` | `Action (Certify & Publish | Return for Revision)` (`AUDITOR_CERTIFY_ITEM`).
     - **Tab 3 (`compliance` — `Immutable Security, PII Reveal & Refund Audit Table`):** Read-only `<WorkspaceDataTable>` of all platform security events (`ADMIN_PII_REVEAL`, price mutations, refunds, rubric calibrations) + 1-click `Verify Cryptographic Chain & Export Audit Report (JSON)`.

### Verification
Run `pnpm design:lint`, `pnpm design:shots`, `NODE_OPTIONS="--max-old-space-size=2048" pnpm --filter @lumen/core exec vitest run`, and `cd apps/web && NODE_OPTIONS="--max-old-space-size=2048" pnpm exec tsc --noEmit --incremental`. Commit `BATCH P33` to `main`, print receipts, and STOP.

---

## BATCH P34 (FINAL RELEASE GATE): FULL 5-ROLE, TYPING STUDIO, DATA TABLE & UNIQUE ASSET PRODUCTION BUILD SIGN-OFF

### Objective
Verify that all 5 role portals (`/app`, `/evaluator`, `/instructor`, `/auditor`, `/admin`), the Monkeytype CD-IELTS Typing Studio (`/app/typing` & `/tools/ielts-typing-test`), `<WorkspaceDataTable>`, the homepage `40+` `StatRow` alignment, and the 24 unique SHA-256 verified `.webp` photographs pass every static, unit, TypeScript, and full `next build` production gate with a 100% clean working tree.

### Allowed Files
- `tooling/design-lint.mjs`
- `tooling/design-shots.mjs`
- `packages/core/src/__tests__/workspace-design-guard.test.ts`
- `docs/HANDOFF.md`
- `docs/MISTAKE-LEDGER.md`
- `docs/lumen_ui_overhaul_master_runbook.md`

### Step-by-Step Implementation
1. Ensure `/app/typing`, `/tools/ielts-typing-test`, `(evaluator)/layout.tsx`, `/evaluator`, `(instructor)/layout.tsx`, `/instructor`, `(auditor)/layout.tsx`, and `/auditor` are all registered and passing in `tooling/design-lint.mjs` (`[surface-guard]`, `[workspace-guard]`, `[link-guard]`, `[asset-guard]`) and `tooling/design-shots.mjs`.
2. Expand `packages/core/src/__tests__/workspace-design-guard.test.ts` to assert:
   - `ROLE_PERMISSION_MATRIX` and `canRolePerformAction` enforce strict RBAC across all 5 roles (`scholar`, `evaluator`, `instructor`, `auditor`, `admin`).
   - `resolveRoleRedirect` isolates all 5 role portals cleanly.
   - `<WorkspaceDataTable>` is used across `/admin`, `/evaluator`, `/instructor`, `/auditor`, and `/app/*`.
   - `/evaluator` contains zero student PII.
   - All 24 `.webp` files in `MEDIA_MANIFEST` have unique SHA-256 hashes.
3. Revert any dirty `apps/web/next-env.d.ts` churn and update `docs/HANDOFF.md` and `docs/MISTAKE-LEDGER.md` with Phase 5 (`P31`–`P34`) verification receipts.
4. Run `pnpm design:lint`, `pnpm design:shots`, `NODE_OPTIONS="--max-old-space-size=2048" pnpm --filter @lumen/core exec vitest run`, `cd apps/web && NODE_OPTIONS="--max-old-space-size=2048" pnpm exec tsc --noEmit --incremental`, and `NODE_OPTIONS="--max-old-space-size=3072" pnpm --filter @lumen/web build`.
5. Commit `BATCH P34` to `main`, verify `git status -sb` is clean, print the final verification receipts, and STOP.