/** @purpose Two-key architectural and UI/UX sign-off report for Phase P2.6.1–P2.6.3 (P2.6.4) */
# Phase 2.6 Institutional Design, Exam Guides & Universal Bilingual Coverage Sign-Off (`P2.6.4`)

- **Date:** 2026-11-14
- **Auditor:** `Gemini 4 Argon (Low)` (Two-Key Reviewer)
- **Commits Audited:** `bd58588` (`task/P2-6-1-universal-bilingual-pages-and-questions`), `94cc012` / `e766440` (`task/P2-6-2-institutional-design-and-exam-guides`)
- **Target Branch:** `main`
- **Verdict:** **PASS (SIGNED OFF)**

---

## 1. Audit Checklist & Verification

### Check 1: IELTS Guide Table vs. `@lumen/core` `ielts-scoring.ts` (`PASS — Inline Sync Applied`)
- **Files Inspected:** `apps/web/app/[locale]/(marketing)/_components/IeltsExamGuide.tsx`, `packages/core/src/exam/ielts-scoring.ts`
- **Findings:**
  - Verified raw-to-band thresholds against `ACADEMIC_READING_TABLE` (`39–40 = 9.0`, `37–38 = 8.5`, `35–36 = 8.0`, `33–34 = 7.5`, `30–32 = 7.0`, `27–29 = 6.5`, `23–26 = 6.0`, `19–22 = 5.5`, `15–18 = 5.0`) and `LISTENING_TABLE` (`39–40 = 9.0`, `37–38 = 8.5`, `35–36 = 8.0`, `32–34 = 7.5`, `30–31 = 7.0`, `26–29 = 6.5`, `23–25 = 6.0`, `18–22 = 5.5`, `16–17 = 5.0`).
  - Expanded `IeltsExamGuide.tsx` inline from its 4-row summary (`23/40`, `30/40`, `35/40`, `39/40`) to the full 9-band table (`5.0` through `9.0` in `0.5` increments) explicitly distinguishing Academic Reading vs. Listening raw score ranges to match `packages/core/src/exam/ielts-scoring.ts`.

### Check 2: Zero Cyber-Grids, Zero Sparkle Emojis & Single Payment Bar (`PASS`)
- **Files Inspected:** `apps/web/app/[locale]/(marketing)/**`, `apps/web/app/[locale]/(auth)/**`, `apps/web/messages/{en,bn}.json`
- **Findings:**
  - Confirmed zero `linear-gradient` grid backgrounds and zero `✨` / `🎯` emojis across `/`, `/gre`, `/ielts`, `/pricing`, `/help`, `/sign-in`, and `/sign-up`.
  - Confirmed `BangladeshPaymentTrustBar` is imported and rendered strictly once in `apps/web/app/[locale]/(marketing)/layout.tsx` (footer).

### Check 3: Full Bilingual Route & Question Coverage (`PASS`)
- **Files Inspected:** `packages/core/src/__tests__/brand-sweep.test.ts`, `packages/core/src/__tests__/i18n-pages-coverage.test.ts`
- **Findings:**
  - LaTeX-safe math masking (`maskMathTokens` / `unmaskMathTokens` / `translateText`) preserves inline `$...$` and block `$$...$$` tokens across Bengali translations.
  - All marketing, auth, checkout, and diagnostic exam routes pass bilingual EN/BN coverage assertions and competitor/brand-leak sweeps.

---

## 2. Verification Commands & Output

- `pnpm --filter @lumen/core exec vitest run src/__tests__/brand-sweep.test.ts src/__tests__/i18n-pages-coverage.test.ts` -> **2 test files passed, 17 tests passed (17)**
- `cd apps/web && pnpm exec tsc --noEmit --incremental` -> **0 errors**
