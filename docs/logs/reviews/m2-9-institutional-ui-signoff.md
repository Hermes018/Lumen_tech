# M2-9 Institutional UI Overhaul Sign-Off (Batches P0 -> P14)

- **Date:** 2026-11-15
- **Branch:** `main`
- **Scope:** Complete institutional UI/UX overhaul across all marketing routes (`/`, `/courses`, `/gre`, `/ielts`, `/pricing`, `/help`, `/dev/ui`, `/for-institutions`, `/tools/*`), auth (`/sign-in`, `/sign-up`), checkout (`/checkout`), exam simulators (`/exam/diagnostic`, `/exam/ielts-preview`), and learner workspace (`(learner)/layout.tsx` & `/app/*`), governed by `AGENTS.md` Section 12 (12 Lumen UI Laws) and `docs/lumen_ui_overhaul_master_runbook.md`.

## Verification Receipts (Batch P14 Final Sign-Off)

- `pnpm design:lint`: `design:lint PASSED (i18n guard: 4 files clean; suppression scan: 8 files clean; primitive-only pages checked: 8 [strict-pages]; surface-guard: 20 files clean; link-guard: 227 hrefs -> 15 routes verified)`
- `pnpm design:shots`: `design:shots passed.` (7 marketing routes: `className=0`, `<table>=0`, boxed primitives `<= 3/6`; 20 workbench/checkout/tools/learner surfaces: `rounded-full/2xl/3xl=0`; live Playwright pass skipped because `http://localhost:3000` was not running).
- `vitest`: `3 passed (3)` test files, `29 passed (29)` tests (`brand-sweep.test.ts` 5/5, `i18n-pages-coverage.test.ts` 14/14, `ui-primitives-caps.test.ts` 10/10 including internal route integrity check).
- `tsc --noEmit --incremental`: `@lumen/web` passed cleanly (exit 0).

## Completed Overhaul Sequence (P10 -> P14)

- **P10 (`cd0b27f`):** Pearl/Bone stationery canvas (`tokens.css` & surface paper hierarchy).
- **P11 (`f42b228`):** Unified `/checkout`, `/for-institutions`, `/tools/gre-score-calculator`, `/tools/ielts-band-calculator`, and `live-gre-widget.tsx`.
- **P12 (`83abfd3`):** Overhauled CD-IELTS split-screen simulator (`/exam/ielts-preview`).
- **P13 (`a37353f`):** Unified `(learner)` layout and `/app/*` workspace (`/app`, `/app/vocab`, `/app/vocab/play`, `/app/flashcards`, `/app/practice`, `/app/mistakes`, `/app/progress`, `/app/plan`, `/app/settings`).
- **P14:** Added automated `[link-guard]` in `tooling/design-lint.mjs`, expanded `[surface-guard]` across 20 unified files, updated `tooling/design-shots.mjs` with actual `/app/*` routes, and added `MARKETING_CONTENT` + `NAV_DATA` route resolution test in `ui-primitives-caps.test.ts`.
