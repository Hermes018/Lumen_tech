<!-- @purpose Two-key review and sign-off report for Phase M2.7-A, M2.7-B & M2.7-C (i18n Links, Live Translate API, ETS/BC/IDP Editorial Heroes, Full-Screen Diagnostic Workbench & 50/50 Split Auth) -->
# Phase M2.7-D — Two-Key Verification Sign-Off (M2.7-A, M2.7-B & M2.7-C)

- **Date:** 2026-11-14
- **Reviewer:** Gemini 4 Argon (Low) — Two-Key Audit Gate
- **Branch:** `main`
- **Commits Verified:** `c80d8be` (`M2.7-A`) and `5146bab` (`M2.7-B & M2.7-C` / `93f6f01`)
- **Verdict:** **APPROVED (PASS — 0 Blockers, 19/19 Tests Green, 0 TypeScript Errors)**

---

## 1. Audit Checklist & Evidence

### 1.1 Locale-Preserving Navigation Links (`/bn` Prefix Persistence)
- **Check:** Confirm all navigation links on `/bn`, `/bn/gre`, `/bn/ielts`, `/bn/courses`, `/bn/pricing`, `/bn/sign-in`, and `/bn/sign-up` preserve the `/bn` prefix when clicked.
- **Evidence:**
  - `apps/web/app/[locale]/_components/LocaleLink.tsx` exports `withLocale(locale, path)` and `<LocaleLink>` wrapping `next/link` with `useLocale()` from `next-intl`.
  - Imported as `LocaleLink as Link` across `(marketing)/layout.tsx`, `MarketingMobileDrawer.tsx`, `(marketing)/page.tsx`, `gre/page.tsx`, `gre/live-gre-widget.tsx`, `ielts/page.tsx`, `courses/page.tsx`, `pricing/page.tsx`, `help/page.tsx`, `diagnostic/page.tsx`, `exam/diagnostic/page.tsx`, `exam/ielts-preview/IeltsSplitScreenClient.tsx`, and `(auth)/_components/AuthForm.tsx`.
- **Status:** PASS

### 1.2 Live Translation Endpoint & Exam Header `<LocaleSwitcher />`
- **Check:** Confirm `/api/translate` exists and `<LocaleSwitcher />` is mounted in the header of `/exam/diagnostic` and `/exam/ielts-preview`.
- **Evidence:**
  - `apps/web/app/api/translate/route.ts` implements `POST` with strict payload validation (`texts: string[]` 1..50, max 5000 chars), LRU-bounded in-memory cache (`MAX_CACHE_ENTRIES = 2000`), and LaTeX-safe `translateText` delegation from `@lumen/core`.
  - `apps/web/app/[locale]/(exam)/exam/diagnostic/page.tsx:899` mounts `<LocaleSwitcher />` in the sticky `h-16 bg-[#001E42]` top bar alongside the EN/BN stem toggle, calculator toggle, and timer.
  - `apps/web/app/[locale]/(exam)/exam/ielts-preview/IeltsSplitScreenClient.tsx:176` mounts `<LocaleSwitcher className="border-gray-700 bg-gray-800/80 text-gray-200" />` in the CBT header.
- **Status:** PASS

### 1.3 Asymmetric 12-Column Split Heroes, Student Photography Posters & Zero Leaked AI Pill Badges
- **Check:** Confirm `/`, `/gre`, `/ielts`, and `/help` use asymmetric 12-column split heroes (`max-w-7xl`) with student photography posters and zero leaked AI pill badges (`"British Emerald & Teal"`, `"Free Band Utility"`, `"No Account Needed To Start"`, etc.).
- **Evidence:**
  - `apps/web/app/[locale]/(marketing)/page.tsx:31-118`, `gre/page.tsx:40-148`, `ielts/page.tsx:37-145`, and `help/page.tsx:167-223` all render `max-w-7xl ... grid lg:grid-cols-12` with `lg:col-span-7` left-aligned editorial copy (`border-l-4 border-[#E4002B] pl-3` kickers) and `lg:col-span-5` student photography posters (`images.unsplash.com`).
  - `apps/web/next.config.ts:13,64-71` allowlists `https://images.unsplash.com` in both `images.remotePatterns` and CSP `img-src` (two-key reviewed and approved).
  - `packages/core/src/__tests__/brand-sweep.test.ts:130-161` enforces 0 occurrences of `"British Emerald & Teal"`, `"Free Band Utility"`, and `"No Account Needed To Start"` across all web UI and message files.
- **Status:** PASS

### 1.4 Full-Viewport `/exam/diagnostic` Workbench & 50/50 Split Screen Auth (`/sign-in`, `/sign-up`)
- **Check:** Confirm `/exam/diagnostic` uses the 12-column interactive workbench (`lg:col-span-8` large question canvas + `lg:col-span-4` navigator/hint/scratchpad sidebar) and `/sign-in` + `/sign-up` use a full-bleed `min-h-screen lg:grid-cols-12` 50/50 split screen.
- **Evidence:**
  - `apps/web/app/[locale]/(exam)/exam/diagnostic/page.tsx:956-1165` renders `max-w-7xl mx-auto ... grid grid-cols-1 lg:grid-cols-12 gap-8 items-start` with `lg:col-span-8` elevated question sheet and `lg:col-span-4` sidebar (Navigator 1–8, Flag for Review, 3-Tier Hint Ladder, Scratchpad/Math Reference).
  - `apps/web/app/[locale]/(auth)/_components/AuthForm.tsx:249` and `(auth)/layout.tsx` render a full-bleed `min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-white` 50/50 split screen (`lg:col-span-6` editorial student photography & outcome showcase + `lg:col-span-6` auth form).
- **Status:** PASS

---

## 2. Verification Output

### Vitest (`brand-sweep.test.ts` + `i18n-pages-coverage.test.ts`)
```text
 RUN  v5.1.0 /home/ayra/Lumen_tech/Lumen_tech/packages/core

 ✓ src/__tests__/brand-sweep.test.ts (5 tests) 95ms
 ✓ src/__tests__/i18n-pages-coverage.test.ts (14 tests) 78ms

 Test Files  2 passed (2)
      Tests  19 passed (19)
```

### TypeScript (`apps/web`)
```text
$ cd apps/web && NODE_OPTIONS="--max-old-space-size=2048" pnpm exec tsc --noEmit --incremental
(0 errors, exit code 0)
```
