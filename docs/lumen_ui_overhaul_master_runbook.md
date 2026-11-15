# LUMEN ACADEMY: PHASE 6 MASTER RUNBOOK — CURRICULUM-ALIGNED IELTS TYPING MODES, 33-SLOT ZERO-REUSE PHOTOGRAPHY, CERTIFIED MULTI-ACCENT IELTS LISTENING AUDIO ENGINE, ENTERPRISE BANKING/TREASURY ACCOUNTING & UNIVERSAL PDF/XLSX/CSV REPORT GENERATOR (BATCHES P35 -> P38)

## SECTION 0: MANDATORY OPERATING RULES, EXPLICIT REJECTIONS & GUARDRAILS (READ FIRST)

### 0.1 Execution Discipline
1. Execute ONLY the batch or sequence of batches explicitly requested by the user (`BATCH P35`, `BATCH P36`, `BATCH P37`, or `BATCH P38`).
2. Never erase or truncate `docs/lumen_ui_overhaul_master_runbook.md`.
3. Touch ONLY the files listed under `Allowed Files` for the active batch.
4. Always prefix Vitest and TypeScript commands with `NODE_OPTIONS="--max-old-space-size=2048"`. Commit as `Ayman Rahman <aymanrahman30@gmail.com>`. Do NOT run `git push`.

### 0.2 Protected Paths (NEVER MODIFY)
- `apps/web/app/[locale]/_components/LocaleSwitcher.tsx`
- `apps/web/app/[locale]/_components/LocaleLink.tsx`
- `apps/web/app/[locale]/_components/TranslatedText.tsx`
- `apps/web/app/api/translate/route.ts`
- All strict marketing `page.tsx` files (`apps/web/app/[locale]/(marketing)/**/page.tsx`, excluding `/tools/*`) must remain at `className=0` and `<table>=0` outside `<Disclosure>`.

### 0.3 What You Must Explicitly REJECT (Enforced by `pnpm design:lint` & Vitest)
1. **NO Naive Random Punctuation Glued onto Function Words in Typing Corpora:** Never generate nonsense punctuation like `from the: pharmacy` or `subterranean; reservoirs`. When `@ punctuation` or `# numbers` is enabled in `typing-corpora.ts`, inject grammatically authentic academic punctuation (clause-level commas, `; however,`, `; consequently,`, parenthetical data `(47.8% in 2025)`, hyphenated compounds `socio-economic`) that mirrors official IELTS Band 8.5 and GRE AWA prose.
2. **NO Repeated or Visually Duplicate Marketing Images (`[slot-uniqueness-guard]`):** Every `photoSlot` in `marketing.ts` across `/`, `/gre`, `/ielts`, `/courses`, `/pricing`, `/for-institutions`, and `/help` must be 1-to-1 unique (used at most once across the entire site), and every `.webp` file in `MEDIA_MANIFEST` must have a unique SHA-256 hash and visually distinct editorial composition.
3. **NO Silent/Text-Only IELTS Listening Mocks:** Every IELTS Listening practice drill and mock in `/exam/ielts-preview` and `/app/ielts` MUST include the interactive `<IeltsListeningAudioEngine />` with playable 44.1kHz PCM `.wav` audio, multi-accent speaker cues (`British RP en-GB`, `Australian en-AU`, `North American en-US`), strict Play-Once Exam Mode lock, and post-submission Interactive Synchronized Transcript with distractor trap highlights.
4. **NO New External NPM Dependencies (Rule H1):** Implement the `.xlsx` (Excel SpreadsheetML / Office Open XML), `.csv`, and Printable A4/Letter PDF Report Engine in pure TypeScript (`apps/web/src/lib/export-reports.ts`) with zero external packages.
5. **NO Off-Palette "SaaS Rainbow" Classes, Large Radii, or Shadows:** `[workspace-guard]` and `[surface-guard]` strictly forbid `rounded-md/lg/xl/2xl/3xl/full`, `shadow-*`, `bg-blue-*/green-*/emerald-*/yellow-*/slate-*/zinc-*`, and `text-[9px]/text-[10px]/text-[11px] uppercase` across all typing, audio, banking, and report components.
6. **NO Borderless Ragged Lists for Financial Ledgers:** All banking accounts, monetary ledger rows, P&L statements, and tax registers MUST render inside `<WorkspaceDataTable>` from `WorkspacePrimitives.tsx` with tinted column headers, `<th scope="row">` row headers, vertical cell hairlines, and `tabular-nums` alignment.

---

## BATCH P35: CURRICULUM-ALIGNED IELTS & GRE TYPING STUDIO UPGRADE — GRAMMAR-AWARE PUNCTUATION FIX (`IMAGE_889480` FIX), AUDIO SPELLING DICTATION MODE, BAND 8.5 LEXICAL UPGRADE DRILL & TASK 1/2 RUBRIC PACING

### Objective
1. Fix `buildTypingWords()` in `apps/web/src/content/typing-corpora.ts` so `@ punctuation` and `# numbers` never attach random colons/semicolons onto prepositions or articles (fixing `from the: pharmacy` and `subterranean; reservoirs`), instead weaving authentic academic transitions (`; however,`, `; furthermore,`, `(47.8%)`, `state-of-the-art`).
2. Upgrade `<TypingPracticeEngine />` (`apps/web/src/components/typing/TypingPracticeEngine.tsx`) with **4 IELTS & GRE Curriculum Practice Drills**:
   - `Copy-Flow Benchmark` (Monkeytype classic gliding-caret speed & accuracy)
   - `Audio Spelling & Number Dictation` (visually masks target words `••••••` or plays spoken British/Australian audio cues for high-risk Listening Part 1–4 spelling/postcode/currency traps)
   - `Band 6.0 -> Band 8.5 Lexical Upgrade` (displays the Band 6.0 baseline prompt phrase above the word stream while the scholar types the Band 8.5 academic collocation upgrade)
   - `Task 1 (20m / 150w) & Task 2 (40m / 250w) Pacing & Paragraph Coach` (tracks live paragraph split milestones: `Introduction`, `Body Paragraph 1`, `Body Paragraph 2`, `Conclusion & Proofread Buffer`)

### Allowed Files
- `apps/web/src/content/typing-corpora.ts`
- `apps/web/src/components/typing/TypingPracticeEngine.tsx`
- `apps/web/app/[locale]/(learner)/app/typing/page.tsx`
- `apps/web/app/[locale]/(marketing)/tools/ielts-typing-test/page.tsx`
- `packages/core/src/__tests__/typing-engine.test.ts`

---

## BATCH P36: CERTIFIED BRITISH COUNCIL / IDP-FORMAT IELTS LISTENING AUDIO ENGINE (`<IELTSLISTENINGAUDIOENGINE />`) + 33-SLOT ZERO-REUSE & VISUALLY DISTINCT PHOTOGRAPHY OVERHAUL

### Objective
1. Eliminate all repeated or visually similar images across `/`, `/gre`, `/ielts`, `/courses`, `/pricing`, `/for-institutions`, and `/help` by expanding `MEDIA_MANIFEST` (`apps/web/src/content/media.ts`) to **33 unique, 1-to-1 context-specific `.webp` slots**, generating visually distinct, topic-relevant `.webp` images on disk, and enforcing a strict **Zero Slot Reuse Guard** (`every photoSlot in marketing.ts used at most once across all pages`) in `tooling/design-lint.mjs` and `ui-primitives-caps.test.ts`.
2. Build the certified-format CD-IELTS Listening Audio & Transcript Engine (`<IeltsListeningAudioEngine />`) with playable 44.1kHz PCM `.wav` audio synthesis + Multi-Accent (`en-GB` British RP, `en-AU` Australian, `en-US` North American) neural speech synthesis, Play-Once Strict Exam Mode lock, headphone check, and post-submission Interactive Synchronized Transcript (with highlighted distractor traps)—wired into `/exam/ielts-preview` and `/app/ielts`.

### Allowed Files
- `apps/web/src/content/media.ts`
- `apps/web/src/content/marketing.ts`
- `apps/web/public/images/*.webp`
- `apps/web/src/content/ielts-listening-scripts.ts`
- `apps/web/src/components/exam/IeltsListeningAudioEngine.tsx`
- `apps/web/app/[locale]/(exam)/exam/ielts-preview/page.tsx`
- `apps/web/app/[locale]/(learner)/app/ielts/page.tsx`
- `tooling/design-lint.mjs`
- `tooling/design-shots.mjs`
- `packages/core/src/__tests__/ui-primitives-caps.test.ts`
- `packages/core/src/__tests__/workspace-design-guard.test.ts`
- `packages/core/src/__tests__/ielts-scoring.test.ts`

### Verification Criteria for BATCH P36
1. Every `photoSlot` across `home`, `gre`, `ielts`, `courses`, `pricing`, `forInstitutions`, and `help` in `apps/web/src/content/marketing.ts` (`en` and `bn`) is 1-to-1 unique (zero repeated slots within `/gre`, within `/ielts`, within `/courses`, or across pages).
2. All 33 `.webp` files in `apps/web/public/images/` exist, obey size caps (`<= 120KB` hero/split, `<= 60KB` col), and have 100% unique SHA-256 digests and distinct visual compositions.
3. `apps/web/src/content/ielts-listening-scripts.ts` exports 4 authentic CD-IELTS Listening sections (`Part 1` `en-GB`, `Part 2` `en-AU`, `Part 3` `en-GB`/`en-US`, `Part 4` `en-GB`), distractor trap notes, and `buildDeterministicWavDataUri`.
4. `apps/web/src/components/exam/IeltsListeningAudioEngine.tsx` renders the 4-part selector, Strict Exam Mode (Play-Once Lock + Headphone Check) vs. Guided Practice Mode (`0.85x–1.25x` speed + click-any-sentence-to-seek), dual PCM WAV + `speechSynthesis` playback, and synchronized distractor-trap transcript, and is wired into `/exam/ielts-preview` and `/app/ielts`.

---

## BATCH P37: ENTERPRISE BANKING, DOUBLE-ENTRY FINANCIAL ACCOUNTING, EXPENSE/PAYOUT LEDGER & UNIVERSAL `.XLSX` / `PDF` / `.CSV` BUSINESS REPORT GENERATOR

### Objective
1. Create a zero-dependency **Universal Business Report & Workbook Engine (`apps/web/src/lib/export-reports.ts`)** that generates native **Multi-Worksheet Excel `.xlsx` / SpreadsheetML files**, **RFC-4180 `.csv` files**, and **Print-Perfect A4/Letter Institutional PDF Report Windows** (`@media print` with official letterhead, tabular accounting grids, signature blocks, and `HMAC-SHA256` verification hashes).
2. Expand `payment-guard.ts` and `/api/admin/catalog` with a complete **Banking, Treasury, Double-Entry Accounting, Expense, Payout & Tax Ledger** (tracking Bank/bKash/Nagad/Stripe settlement accounts, Purchases, Split-Pay Receivables, 7-Day Refunds, Evaluator/Faculty Payouts, Operating Expenses, NBR Mushak 6.3 VAT Payable, and Net P&L in `BDT ৳` & `USD $`).
3. Wire **1-Click `Export Excel (.xlsx)`**, **`Export CSV`**, and **`Print / Save Official PDF Report`** into `/admin`, `/app/billing`, `/app/progress`, `/evaluator`, `/instructor`, and `/auditor`.

### Allowed Files
- `apps/web/src/lib/export-reports.ts` (new universal PDF / Excel SpreadsheetML `.xlsx` / `.csv` generator)
- `apps/web/src/lib/security/payment-guard.ts`
- `apps/web/app/api/admin/catalog/route.ts`
- `apps/web/app/[locale]/(admin)/admin/page.tsx`
- `apps/web/app/[locale]/(learner)/app/billing/page.tsx`
- `apps/web/app/[locale]/(learner)/app/progress/page.tsx`
- `apps/web/app/[locale]/(evaluator)/evaluator/page.tsx`
- `apps/web/app/[locale]/(instructor)/instructor/page.tsx`
- `apps/web/app/[locale]/(auditor)/auditor/page.tsx`
- `packages/core/src/__tests__/security-payment-guard.test.ts`

### Step-by-Step Implementation
1. **Create `apps/web/src/lib/export-reports.ts` (Zero-Dependency Excel `.xlsx` SpreadsheetML, `.csv`, and Printable Institutional PDF Generator):**
   - Export types:
     - `ReportColumn = { key: string; header: string; align?: 'left' | 'right' | 'center' }`
     - `ReportSheet = { sheetName: string; title: string; subtitle?: string; summaryMetrics?: Array<{ label: string; value: string }>; columns: ReportColumn[]; rows: Array<Record<string, string | number>> }`
     - `InstitutionalReportPayload = { reportId: string; documentTitle: string; subtitle: string; organizationName?: string; generatedByRole: string; generatedAtIso: string; currencyNote?: string; verificationHash: string; sheets: ReportSheet[]; footerLegalNote?: string }`
   - Export pure functions (testable in Vitest without `window`):
     - `buildCsvString(sheet: ReportSheet): string`: RFC-4180 compliant CSV with UTF-8 BOM (`\uFEFF`) so Excel opens `৳` (BDT) and Bengali (`বাংলা`) characters cleanly without mojibake.
     - `buildExcelSpreadsheetXml(payload: InstitutionalReportPayload): string`: Generates a valid Microsoft Office Open XML SpreadsheetML (`<?xml version="1.0" encoding="UTF-8"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" ...>`) containing every worksheet in `payload.sheets` with styled header rows (`#F6F1EA` background, bold `#2A080E` text), summary KPI blocks, and typed numeric/currency cells.
     - `buildPrintableHtmlDocument(payload: InstitutionalReportPayload): string`: Generates a complete, self-contained HTML5 A4/Letter printable report document styled with Lumen Academy institutional typography, letterhead (`Lumen Academy · Institutional Financial & Academic Filing`), summary stat strip, bordered accounting tables, signature/stamp blocks (`Prepared By`, `Verified By Compliance Auditor`, `HMAC-SHA256 Verification Hash`), and `@media print` page-break rules.
   - Export browser trigger helpers:
     - `downloadCsvReport(payload: InstitutionalReportPayload, filenameBase: string)`
     - `downloadExcelReport(payload: InstitutionalReportPayload, filenameBase: string)` (downloads `.xls` / `.xlsx` SpreadsheetML workbook)
     - `openPrintablePdfReport(payload: InstitutionalReportPayload)`: Opens the printable report in a clean print window/iframe and triggers `window.print()` (with a fallback downloadable `.html` print sheet if popups are blocked).

2. **Expand `payment-guard.ts` & `/api/admin/catalog` with Complete Banking, Treasury, Expense & P&L Accounting:**
   - In `apps/web/src/lib/security/payment-guard.ts`, add to the runtime catalog state:
     - **`bankAccounts` (`Treasury & Gateway Settlement Accounts`):**
       1. `BANK-BDT-BRAC`: `BRAC Bank PLC — Corporate Operating A/C (BDT)` · Account `#1501-204982-001` · Balance `৳6,42,500`
       2. `WALLET-BDT-BKASH`: `bKash & Nagad Merchant Settlement Wallet (BDT)` · Merchant `#01711-889900` · Balance `৳1,84,220`
       3. `GATEWAY-BDT-SSL`: `SSLCommerz / Nexus Split-Pay Clearing Escrow (BDT)` · Balance `৳92,450`
       4. `BANK-USD-STRIPE`: `Stripe Global & Wise Institutional Treasury (USD)` · Account `acct_1LumenGlobal` · Balance `$4,860.00`
     - **`ledgerEntries` (`Double-Entry Monetary & Expense Ledger`):**
       - Categorized entries across `PURCHASE_FULL`, `PURCHASE_SPLIT_INSTALLMENT`, `RECEIVABLE_INSTALLMENT_DUE`, `REFUND_7DAY_POLICY`, `EXPENSE_EVALUATOR_PAYOUT`, `EXPENSE_FACULTY_PAYROLL`, `EXPENSE_CLOUD_AI_INFRA`, `EXPENSE_MARKETING`, `TAX_VAT_MUSHAK_63`:
         - Include realistic seed entries for student purchases (`INV-2026-1041`, `INV-2026-0892`), pending split-pay installments, a 7-day refund return, Human Evaluator batch payout (`PAY-EVAL-2026-11`), Faculty Cohort stipend (`PAY-FAC-2026-11`), Cloud/AI inference servers, and NBR VAT accrual.
     - **`computeFinancialSummary()`:** Pure helper computing live totals from `orders` + `ledgerEntries` + `bankAccounts`:
       - `grossRevenueBdt`, `grossRevenueUsd`, `gatewayClearingFeesBdt`, `refundsAndReturnsBdt`, `netRevenueBdt`, `vatPayableMushakBdt` (15%), `totalExpensesBdt` (Evaluator Payouts + Faculty + Infra + Marketing), `netOperatingProfitBdt`, `accountsReceivableSplitBdt` (unpaid 2nd/3rd installments), and `totalTreasuryCashBdt`.
     - Add `RECORD_LEDGER_ENTRY` (`type: 'EXPENSE' | 'PAYOUT' | 'REFUND' | 'BANK_TRANSFER' | 'PURCHASE'`, `category`, `description`, `amount`, `currency`, `accountId`, `referenceId`) to `payment-guard.ts` and `POST /api/admin/catalog`.

3. **Upgrade `/admin` (`apps/web/app/[locale]/(admin)/admin/page.tsx`) with the `Banking, Treasury, P&L & Reports` Studio:**
   - Add **`Banking, Treasury & P&L Reports`** (`tab=treasury`) to the Admin Console (`(admin)/admin/page.tsx`):
     - **Top Financial `<WorkspaceStatRow>`:**
       1. `Gross & Net Revenue` (`৳ / $`)
       2. `Split-Pay Receivables & Gateway Fees` (`2.85% / 4.75%`)
       3. `Operating Expenses, Payouts & Refunds` (`COGS + OPEX + Returns`)
       4. `Net Operating Profit & NBR VAT (Mushak 6.3)`
     - **Table 1: `Treasury & Gateway Settlement Accounts` (`<WorkspaceDataTable>`):** Shows BRAC Bank Corporate A/C, bKash/Nagad Merchant Wallet, SSLCommerz Split-Pay Escrow, and Stripe Global USD Treasury with live balances and reconciliation status.
     - **Table 2: `General Monetary Ledger — Purchases, Expenses, Payouts, Refunds & Returns` (`<WorkspaceDataTable>`):** Filterable by `All | Purchases & Inflows | Split-Pay Receivables | Refunds & Returns | Evaluator & Faculty Payouts | Operating Expenses | NBR VAT` + an inline **`+ Record Expense / Payout / Bank Entry`** drawer (`RECORD_LEDGER_ENTRY`).
     - **Universal Business Report Filing Bar (1-Click Export in `/admin`):**
       - Buttons to generate and download/print:
         1. **`Download Complete Financial Workbook (.xlsx — 6 Sheets)`** (`Summary P&L`, `Treasury Accounts`, `Purchases & Orders`, `Expenses & Payouts`, `Refunds & Returns`, `NBR Mushak 6.3 VAT Register`)
         2. **`Download Accounting Ledger (.csv)`**
         3. **`Print / Save Official P&L & Tax Report (PDF)`**

4. **Wire Printable PDF & Excel (`.xlsx` / `.csv`) Report Exports Across the Remaining 4 Portals:**
   - **Scholar (`/app/billing` & `/app/progress`):**
     - In `/app/billing`: Add **`Download Payment & Installment Statement (.xlsx)`** and **`Print Official Tax / Mushak 6.3 Invoice (PDF)`** (using `openPrintablePdfReport`).
     - In `/app/progress`: Add **`Print Official Score Readiness & Diagnostic Transcript (PDF)`** and **`Export Mastery Data (.csv)`**.
   - **Evaluator (`/evaluator`):**
     - In Tab 3 (`Payouts & SLA`): Add **`Print Monthly Evaluator Payout Remittance (PDF)`** and **`Export Graded Submissions & Earnings (.xlsx)`**.
   - **Instructor (`/instructor`):**
     - In Tab 1/2 (`Cohorts & Telemetry`): Add **`Print Cohort Diagnostic & Attendance Report (PDF)`** and **`Export Cohort Gradebook (.xlsx)`**.
   - **Auditor (`/auditor`):**
     - In Tab 3 (`Compliance & IRR`): Add **`Print Official Psychometric & Security Audit Filing (PDF)`** and **`Export Complete Audit & IRR Workbook (.xlsx)`**.
   - Add unit tests in `packages/core/src/__tests__/security-payment-guard.test.ts` testing `buildCsvString`, `buildExcelSpreadsheetXml`, `buildPrintableHtmlDocument`, `computeFinancialSummary`, and `RECORD_LEDGER_ENTRY`.

### Verification
Run `pnpm design:lint`, `pnpm design:shots`, `NODE_OPTIONS="--max-old-space-size=2048" pnpm --filter @lumen/core exec vitest run`, and `cd apps/web && NODE_OPTIONS="--max-old-space-size=2048" pnpm exec tsc --noEmit --incremental`. Commit `BATCH P37` to `main`, print receipts, and STOP.

---

## BATCH P38 (FINAL PRODUCTION RELEASE GATE): FULL END-TO-END VERIFICATION & PRODUCTION BUILD SIGN-OFF

### Objective
Verify that the upgraded IELTS/GRE Typing Studio (`BATCH P35`), the Certified Multi-Accent IELTS Listening Audio Engine & 33 Unique WebP Assets (`BATCH P36`), and the Enterprise Banking/Treasury & Universal PDF/XLSX Report Engine (`BATCH P37`) pass every static lint, design-shot, Vitest, TypeScript, and full `next build` gate with a 100% clean working tree.

### Allowed Files
- `apps/web/app/[locale]/(admin)/layout.tsx`
- `apps/web/src/lib/role-guard.ts`
- `tooling/design-lint.mjs`
- `tooling/design-shots.mjs`
- `packages/core/src/__tests__/workspace-design-guard.test.ts`
- `docs/HANDOFF.md`
- `docs/MISTAKE-LEDGER.md`
- `docs/lumen_ui_overhaul_master_runbook.md`

### Step-by-Step Implementation
1. Add the `Banking, Treasury & P&L` link (`/admin?tab=treasury`) to `apps/web/app/[locale]/(admin)/layout.tsx` and ensure `RECORD_LEDGER_ENTRY` is included in `ROLE_PERMISSION_MATRIX.admin` in `apps/web/src/lib/role-guard.ts`.
2. Ensure all new files (`export-reports.ts`, updated portals) are registered and passing in `tooling/design-lint.mjs` (`[surface-guard]`, `[workspace-guard]`, `[link-guard]`, `[asset-guard]`) and `tooling/design-shots.mjs`.
3. Add Phase 6 release-gate assertions in `packages/core/src/__tests__/workspace-design-guard.test.ts` verifying:
   - `IeltsListeningAudioEngine` is wired into `/exam/ielts-preview` and `/app/ielts` with zero forbidden classes.
   - `export-reports.ts` generates valid multi-sheet SpreadsheetML `.xlsx`, UTF-8 BOM `.csv`, and printable HTML5 PDF documents.
   - All 5 role portals (`/app`, `/evaluator`, `/instructor`, `/auditor`, `/admin`) include PDF/Excel report export capabilities.
4. Revert any dirty `apps/web/next-env.d.ts` churn and update `docs/HANDOFF.md` and `docs/MISTAKE-LEDGER.md` with Phase 6 (`P35`–`P38`) receipts.
5. Run `pnpm design:lint`, `pnpm design:shots`, `NODE_OPTIONS="--max-old-space-size=2048" pnpm --filter @lumen/core exec vitest run`, `cd apps/web && NODE_OPTIONS="--max-old-space-size=2048" pnpm exec tsc --noEmit --incremental`, and `NODE_OPTIONS="--max-old-space-size=3072" pnpm --filter @lumen/web build`.
6. Commit `BATCH P38` to `main`, verify `git status -sb` is clean, print the final verification receipts, and STOP.
