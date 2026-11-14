# HANDOFF - Claude <-> Gemini baton

> Overwrite this file at every handoff (`/handoff` or Prompt 9 in `docs/13-PROMPTS.md`). Keep it under 80 lines. State only; no essays.
> Read order for the receiving agent: `AGENTS.md` -> `docs/PROGRESS.md` -> this file. Read nothing else until the task card says so.

## Baton

- From: gemini (Gemini 4 Argon Medium)   To: next agent / founder review   Date/time (UTC): 2026-11-14 16:28:00
- Reason: Phase M2.8-B complete & merged to `main` (Institutional Swiss Grid redesign of `/`, `/courses`, `/gre`, `/ielts` & `/help`).
- Branch: main                      Last commit SHA: (see `git log -1` after M2.8-B merge)
- Device (hostname) / session log path: docs/logs/reviews/m2-7-redesign-signoff.md
- Pushed to origin? No (Founder pushes directly from Konsole per strict rule)
- Working tree clean? yes
- Task: Phase M2.8-B (Institutional Swiss Grid Redesign & Navigation Flow) - status: complete
- Milestone gate in progress: Milestone M2.8 / M3 Preflight Remediation
- Tests passing: `brand-sweep.test.ts` 5/5 green, `i18n-pages-coverage.test.ts` 14/14 green (19/19 tests passing)
- TypeScript Typecheck: `@lumen/web` 0 errors (`tsc --noEmit --incremental`)
- Needs two-key review: None (marketing UI & navigation layout only; zero security-critical paths touched).

## Done so far (Phase M2.8-A & M2.8-B)

1. **Global Anti-AI Swiss Grid Geometry (`/`, `/courses`, `/gre`, `/ielts`, `/help`):**
   - Removed all offset/tilted crimson & teal background rectangles behind student photographs and eliminated all floating overlay cards covering student faces.
   - Framed all hero portraits in sharp `rounded-md overflow-hidden border border-slate-700/60` containers with solid structural caption bars docked directly underneath.
   - Replaced `rounded-2xl`, `rounded-3xl`, and `rounded-full` capsules across `/`, `/courses`, `/gre`, `/ielts`, `/help`, `GreExamGuide.tsx`, `IeltsExamGuide.tsx`, `ExamChooserGuide.tsx`, and `live-gre-widget.tsx` with `rounded-md` corners and exposed hairline grids (`border border-slate-200 divide-y md:divide-y-0 md:divide-x divide-slate-200`).
2. **Homepage Immediate "Choose Your Exam" Fork & 1-2-3 Journey (`/`):**
   - Built a docked 2-track selector bar (`-mt-8 relative z-10`) splitting Path 01 (`GRE® General Test`) and Path 02 (`IELTS™ Academic & General`).
   - Replaced floating icon bubbles with a 3-column hairline progression (`Step 01: Baseline Diagnostic` -> `Step 02: Targeted Syllabus & Hint-Guided Practice` -> `Step 03: Full-Length Computer-Delivered Mocks & AI Rubric Grading`) plus a Flagship Programs & Syllabus Summary comparison table.
3. **6-Program Coursera / 10MS Syllabus Directory (`/courses`):**
   - Added `CoursesDirectoryClient.tsx` with interactive filter tabs (`All Programs (6)` | `GRE® Preparation` | `IELTS™ Academic & GT` | `Live Crash & Cohort Batches`) and 6 structured program rows showing duration badges, 4–5 concrete syllabus modules, assessment deliverables, and VAT-inclusive BDT pricing.
4. **Sticky Sub-Navbars on `/gre` & `/ielts`:**
   - Added `sticky top-0 z-20` 4-cell institutional jump-bars directly below the hero on `/gre` (`#how-gre-works`, `#live-practice`, `#curriculum`, `/pricing`) and `/ielts` (`#how-ielts-works`, `#simulator`, `#skills`, `/pricing`).

## Remaining steps (numbered, in order)

1. Founder review and push from Konsole.
