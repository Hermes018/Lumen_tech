# HANDOFF - Claude <-> Gemini baton

> Overwrite this file at every handoff (`/handoff` or Prompt 9 in `docs/13-PROMPTS.md`). Keep it under 80 lines. State only; no essays.
> Read order for the receiving agent: `AGENTS.md` -> `docs/PROGRESS.md` -> this file. Read nothing else until the task card says so.

## Baton

- From: gemini (Gemini 4 Argon Medium)   To: next agent / founder review   Date/time (UTC): 2026-11-14 10:11:00
- Reason: Phase M2.7-B & M2.7-C complete & merged to `main` (ETS / British Council / IDP editorial design, asymmetric 12-column split heroes with student photography posters, full-viewport 12-column `/exam/diagnostic` workbench, and full-bleed 50/50 `/sign-in` & `/sign-up` screens).
- Branch: main                      Last commit SHA: (merged `task/M2-7-B-institutional-posters-diagnostic-and-auth`)
- Device (hostname) / session log path: docs/ui_ux_runtime_conversion_remediation_master_plan.md
- Pushed to origin? No (Founder pushes directly from Konsole per strict rule)
- Working tree clean? yes
- Task: Phase M2.7-B & M2.7-C (True ETS / British Council / IDP Editorial Design, Student Posters, Full-Screen Diagnostic Workbench & 50/50 Split Auth) - status: complete
- Milestone gate in progress: Milestone M2.7 / M3 Preflight Remediation
- Tests passing: `brand-sweep.test.ts` 5/5 green, `i18n-pages-coverage.test.ts` 14/14 green (19/19 tests passing)
- TypeScript Typecheck: `@lumen/web` 0 errors (`tsc --noEmit --incremental`)
- Needs two-key review: `apps/web/next.config.ts` (added `images.remotePatterns` and CSP `img-src` allowlist for `https://images.unsplash.com`).

## Done so far (Phase M2.7-B & M2.7-C)

1. **Open-Source Student Photography & AI Pill Badge Ban:**
   - Configured `images.remotePatterns` and CSP `img-src` in `apps/web/next.config.ts` for `https://images.unsplash.com`.
   - Stripped all centered AI prompt-leak pill badges across `/`, `/gre`, `/ielts`, `/courses`, `/pricing`, and `/help` (`"British Emerald & Teal"`, `"Free Band Utility"`, `"No Account Needed To Start"`, `"Next-Gen GRE & IELTS..."`, `"Verified Historical Pricing"`) and replaced them with left-aligned `border-l-4 border-[#E4002B] pl-3 text-xs font-bold uppercase tracking-widest` editorial kickers above left-aligned `text-3xl lg:text-5xl` headings.
2. **Asymmetric 12-Column Split Heroes & Student Posters (`/`, `/gre`, `/ielts`, `/help`):**
   - Rebuilt `/`, `/gre`, `/ielts`, and `/help` heroes into `max-w-7xl` 12-column asymmetric split layouts (`lg:col-span-7` editorial copy + `lg:col-span-5` high-res student photography posters with offset `#E4002B` / `#00A896` / `#007791` geometric backdrops and floating GRE 332 / IELTS Band 8.0 / Section-Adaptive Routing / 4-Skill Band Breakdown cards).
3. **Full-Viewport (`/exam/diagnostic`) Interactive Assessment Workbench:**
   - Overhauled `apps/web/app/[locale]/(exam)/exam/diagnostic/page.tsx` with a sticky `h-16 bg-[#001E42]` top bar (progress bar, `<LocaleSwitcher />`, EN/BN stem toggle, calculator toggle, countdown timer) and a `max-w-7xl` 12-column workbench (`lg:col-span-8` elevated exam sheet with `text-xl sm:text-2xl` stems, `p-6 sm:p-8` QC boxes, and `[A]`–`[D]` keycap option buttons + `lg:col-span-4` sidebar with 1–8 Navigator Palette, Flag for Review, 3-Tier Hint Ladder with `6 / 6 Hints Remaining` badge, and Scratchpad / GRE Math Reference tabs).
4. **Full-Bleed 50/50 Edge-to-Edge Split Screen Auth (`/sign-in`, `/sign-up`, `AuthForm.tsx`):**
   - Rebuilt `(auth)/layout.tsx`, `sign-in/page.tsx`, `sign-up/page.tsx`, and `AuthForm.tsx` into a `min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-white` 50/50 split screen with a full-bleed student photograph, gradient overlay, outcome cards (`GRE® +11.4 Pts Median Gain`, `IELTS™ Band 7.5+ Achieved by 78%`), and glassmorphic BUET scholar testimonial on the left 6 columns, and a centered `max-w-md` form with `h-12 text-base` controls on the right 6 columns.

## Remaining steps (numbered, in order)

1. Founder review and push from Konsole.
