# LUMEN ACADEMY — MILESTONE M2.7: ETS / BRITISH COUNCIL / IDP VISUAL OVERHAUL, FULL-BLEED DIAGNOSTIC & AUTH WORKBENCH, AND UNIVERSAL GOOGLE TRANSLATE / BILINGUAL ENGINE

## 1. Executive Objective
Eliminate all remnants of AI-template design ("centered pill badges + narrow floating boxes in empty white space"), fix every broken/unlinked Bengali navigation transition, wire a real Google Translate + LaTeX-Safe Bilingual Engine for all pages and questions, and redesign the Marketing, Diagnostic, and Authentication surfaces after **ETS (`gre.org`)**, **British Council (`takeielts.britishcouncil.org`)**, and **IDP (`ielts.idp.com`)**.

---

## 2. Phase & Subphase Architecture

### PHASE M2.7-A: Universal Locale-Preserving Routing & Google Translate + Math-Safe Bilingual Engine
- **Subphase M2.7-A.1 — Fix Hardcoded `href` Links Dropping `/bn` Across the Entire App:**
  - Create `<LocaleLink>` (or use `Link` from `apps/web/src/i18n/routing.ts`) and replace raw `next/link` usage across the Navbar, Mobile Drawer, Hero CTAs, Course Cards, Pricing CTAs, Auth links (`/sign-in` <-> `/sign-up`), and Footer so clicking any link while on `/bn/*` strictly stays on `/bn/*`.
  - Fix `LocaleSwitcher.tsx` so switching between `EN` and `বাংলা` updates the `NEXT_LOCALE` cookie AND navigates cleanly on every route (including `/sign-in`, `/sign-up`, `/exam/diagnostic`, `/exam/ielts-preview`, `/checkout`, `/courses`, `/gre`, `/ielts`, `/pricing`, `/help`).
- **Subphase M2.7-A.2 — Live Google Translate API Route + Auto-Translating Question/UI Hook (`/api/translate`):**
  - Create `apps/web/app/api/translate/route.ts` wrapping `translateText()` from `@lumen/core`:
    - Masks all KaTeX `$...$` and `$$...$$` math formulas before translation.
    - Queries the persistent dictionary cache first; on cache miss, calls the live Google Translate endpoint (`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=bn&dt=t&q=...` or Cloud API v2 if `GOOGLE_TRANSLATE_API_KEY` is set) so it works **100% free out-of-the-box without requiring a paid key**, and caches results in memory/disk.
  - Create `<TranslatedText>` / `useAutoTranslate(text, locale)` in `apps/web/app/[locale]/_components/TranslatedText.tsx` so any question stem, passage, hint, or dynamic string renders in Bengali automatically when `locale === 'bn'`.
- **Subphase M2.7-A.3 — Mount `<LocaleSwitcher />` Inside `/exam/diagnostic` & `/exam/ielts-preview` Top Bars:**
  - Add the `EN / বাংলা` switcher directly into the top header bar of `/exam/diagnostic` and `/exam/ielts-preview` so test-takers can toggle question & UI language anytime with 1 click.

---

### PHASE M2.7-B: Authentic ETS / British Council / IDP Editorial Redesign (Zero AI Pill Slop + Student Photography Posters)
- **Subphase M2.7-B.1 — Ban the "AI Pill Badge + Centered Dark Box" Pattern:**
  - Strip ALL rounded pill badges above section headings (including the leaked `"British Emerald & Teal Curriculum"`, `"Free Band Utility"`, `"Next-Gen GRE & IELTS..."`, `"No Account Needed To Start"`, `"Verified Historical Pricing"`).
  - Replace narrow centered headers with **Asymmetric 12-Column Editorial Split Heroes (`max-w-7xl mx-auto`)** modeled directly on `gre.org`, `takeielts.britishcouncil.org`, and `ielts.idp.com`:
    - **Left 7 Columns:** Bold left-aligned typography (`text-4xl lg:text-6xl font-bold tracking-tight`), solid 4px vertical accent bar (`border-l-4 border-[#E4002B]` for IELTS British Council crimson, `border-l-4 border-[#00A896]` for ETS teal), high-contrast CTAs, and quick-jump anchor tabs (`How the Exam Works` | `Interactive Practice` | `Study Plans` | `Course Packages`).
    - **Right 5 Columns (Visual Student Poster & Score Showcase):** Curated, high-resolution open-source student photography (`images.unsplash.com` university/library/test-prep portraits configured in `next.config.ts` `remotePatterns` + `img-src`) framed with IDP/British Council geometric offset color blocks and floating **Official Score Report Preview Cards** (`GRE 332 • Q169 V163` and `IELTS Overall Band 8.0 • L8.5 R8.5 W7.5 S7.5`).
- **Subphase M2.7-B.2 — Visual Richness, Colour Rhythm & Section Proportions (`max-w-7xl`):**
  - Expand cramped `max-w-4xl`/`max-w-5xl` sections to full `max-w-7xl` (`1280px`) across `/`, `/gre`, `/ielts`, `/courses`, `/pricing`, and `/help`.
  - Alternate background surfaces using authentic institutional palettes:
    - **Warm Editorial Alabaster (`#F8F7F4`)** for "How the Exam Works" guides.
    - **British Council Navy (`#001E42`) + Crimson (`#E4002B`)** for IELTS callout posters.
    - **ETS Deep Prussian (`#003057`) + Academic Cyan/Teal (`#007791`)** for GRE callout posters.
    - **IDP Warm Amber/Coral (`#FF5A36` / `#FFF5F2`)** for interactive diagnostic & band calculator banners.

---

### PHASE M2.7-C: Full-Viewport `/exam/diagnostic` Workbench & Full-Bleed 50/50 `/sign-in` + `/sign-up` Poster Layout
- **Subphase M2.7-C.1 — Redesign `/exam/diagnostic` Into an Enticing Full-Screen (`max-w-7xl`) 2-Column Interactive Workbench:**
  - Eliminate the tiny 640px box floating in white space:
  - **Top Institutional CBT Header (`h-16 bg-[#001E42] text-white px-6`):** Displays Lumen logo, `GRE® / IELTS™ Express Diagnostic`, visual progress bar (`Question 1 of 8`), live countdown timer, Calculator toggle, and `<LocaleSwitcher />` (`EN / বাংলা`).
  - **Left 8 Columns (`lg:col-span-8` — Large Interactive Question Canvas):**
    - Question stem rendered in crisp `text-xl lg:text-2xl leading-relaxed font-medium text-slate-900` with large KaTeX math.
    - Quantitative Comparison Quantity A & Quantity B cards scaled up (`p-8 bg-slate-50 border-2 border-slate-200 rounded-xl text-2xl`).
    - Large, interactive option buttons (`p-5 text-lg`) with `[A]`, `[B]`, `[C]`, `[D]` keyboard-shortcut badges, instant visual feedback states, and bilingual explanation cards.
  - **Right 4 Columns (`lg:col-span-4` — Live Diagnostic Companion & Scratchpad Sidebar):**
    - **1. Live Question Palette Grid (`1`–`8`):** Shows answered, current, and remaining items.
    - **2. Interactive 3-Tier Hint Ladder & Concept Cue Box:** Docked right beside the question so students are enticed to click and unlock step-by-step hints.
    - **3. Built-in Scratchpad & Quick Formula Reference Tab:** Allows students to jot down algebra notes or view common GRE geometry/exponent identities right on screen.
- **Subphase M2.7-C.2 — Redesign `/sign-in` & `/sign-up` Into a True Full-Bleed 50/50 Split Screen (`min-h-screen`):**
  - Eliminate the small floating card with huge white margins:
  - **Left 6 Columns (`lg:col-span-6 min-h-screen relative overflow-hidden bg-[#001E42]`):** Full-bleed edge-to-edge visual poster featuring a high-resolution student scholar photograph with a rich navy-to-teal duotone backdrop, bold editorial headline, verified scholar testimonial poster card, and zero `Rasch 1PL IRT` or `SM-2` jargon in either English or Bengali!
  - **Right 6 Columns (`lg:col-span-6 min-h-screen flex flex-col justify-between bg-white p-8 lg:p-16`):**
    - Top bar with `← Back to Home` (locale-aware) and `<LocaleSwitcher />` (`EN / বাংলা`).
    - Centered `max-w-md w-full mx-auto` form with large `text-3xl font-bold` heading, `h-12 text-base` Google & OTP buttons, clean `+880` phone / email inputs, and collapsible staff 2FA drawer.

---

### PHASE M2.7-D: Automated Two-Key Visual & i18n Audit
- Verify zero occurrences of `"British Emerald & Teal"`, `"Rasch 1PL IRT"`, or `"SM-2"` in any English or Bengali UI file.
- Verify zero raw `href="/..."` links that drop `/bn` on localized pages.
- Verify `/api/translate` and bilingual question rendering pass 100% of unit and typecheck gates.
