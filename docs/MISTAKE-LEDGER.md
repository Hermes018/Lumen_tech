# Lumen UI/UX Mistake Ledger

| Date | Task | Model | Mistake Class | Caught By | Root Cause | Permanent Fix | Merged? |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 2026-11-15 | UI-P0 | Baseline Audit | B1 Completeness Bias | Design Review | 1,200-word course dump on `/courses` | Fixed by `<Disclosure>` & word caps in `marketing.ts` and `ui-primitives-caps.test.ts` | Yes |
| 2026-11-15 | UI-P0 | Baseline Audit | B2 Template Pull | Design Review | 34+ nested bordered cards on `/` | Fixed by `primitives.tsx` with zero `className` passthrough and borderless grids | Yes |
| 2026-11-15 | UI-P0 | Baseline Audit | B3 Prompt Echoing | Design Review | Literal prompt text inside rounded pill badges | Fixed by banning eyebrows and `brand-sweep.test.ts` | Yes |
| 2026-11-15 | UI-P0 | Baseline Audit | B8 Locale Digit Mismatch | QA / Locale Audit | Bengali numerals on English `/pricing` | Fixed by locale-keyed `priceEn` / `priceBn` in `marketing.ts` | Yes |
