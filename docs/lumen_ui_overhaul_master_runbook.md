# LUMEN ACADEMY — MASTER UI/UX, PERFORMANCE & CYBERSECURITY RUNBOOK (BATCHES P0 -> P22)

**File Location:** `/home/ayra/Lumen_tech/Lumen_tech/docs/lumen_ui_overhaul_master_runbook.md`  
**Companion References:** `docs/LUMEN-DESIGN-STRATEGY.md` & `docs/LUMEN-FAILURE-MODES-AND-VERIFICATION.md`  
**Target Environment:** Fedora Linux (8 GB RAM Ceiling — Always prefix Node/pnpm commands with `NODE_OPTIONS="--max-old-space-size=2048"`)  
**Git Author:** `Ayman Rahman <aymanrahman30@gmail.com>` (Local commits only — **NEVER** run `git push`)

---

## 0. INTERACTIVE CLI EXECUTION PROTOCOL (READ FIRST — MANDATORY FOR AGENT)

You are operating in **Interactive Single-Batch Mode**. You MUST obey these 5 execution laws on every turn:

1. **ONE BATCH PER TURN (STRICT STOP-GATE):**
   - Batches `P0` through `P16` are already completed and committed on `main` (`2be300f` -> `7b382df`).
   - Execute **ONLY** the specific batch requested by the user (`BATCH P17`, `BATCH P18`, `BATCH P19`, `BATCH P20`, `BATCH P21`, or `BATCH P22`), or the next uncompleted batch in sequence `P17` -> `P18` -> `P19` -> `P20` -> `P21` -> `P22` when the user says `"continue"` or `"next"`.
   - **NEVER** chain two batches together in a single turn.

2. **NO IMPROVISATION / ZERO GUESSING / STRICT MARKETING PAGE GUARD:**
   - Every CSS variable, hex code, prop, file path, and security rule is explicitly specified below. Do not modify files outside the batch's **Allowed Files** list.
   - Never hardcode the literal string `"Lumen Academy"` in `.ts` or `.tsx` files—always import `{ brand } from '@lumen/config'` and use `brand.name` so `brand-sweep.test.ts` passes.
   - **CRITICAL MARKETING PAGE RULE:** In all `(marketing)/**/page.tsx` files (`/`, `/courses`, `/gre`, `/ielts`, `/pricing`, `/help`, `/for-institutions`, `/dev/ui`), **`className` count MUST remain `0`** and **`<table>` count outside `<Disclosure>` MUST remain `0`**. Compose strictly using primitives from `@/src/components/ui/primitives`.

3. **PROTECTED i18n FILES (NEVER MODIFY):**
   - You must **NEVER** modify:
     - `apps/web/app/[locale]/_components/LocaleSwitcher.tsx`
     - `apps/web/app/[locale]/_components/LocaleLink.tsx`
     - `apps/web/app/[locale]/_components/TranslatedText.tsx`
     - `apps/web/app/api/translate/route.ts`

4. **MANDATORY RECEIPTS BEFORE STOPPING:**
   - A batch is NOT complete until you run its verification commands and paste the raw output of:
     1. `pnpm design:lint`
     2. `pnpm design:shots`
     3. `NODE_OPTIONS="--max-old-space-size=2048" pnpm --filter @lumen/core exec vitest run`
     4. `cd apps/web && NODE_OPTIONS="--max-old-space-size=2048" pnpm exec tsc --noEmit --incremental`
     5. `git status -sb` and `git diff --stat HEAD~1`

5. **END-OF-BATCH HALT MESSAGE:**
   - After committing the completed batch locally to `main`, end your response with:
     > **`BATCH <ID> COMPLETE AND COMMITTED. Waiting for your instruction: reply "continue" to run Batch <NEXT_ID>, or tell me any adjustments you want first.`**

---

## 1. COMPLETED FOUNDATION SUMMARY (BATCHES P0 -> P16)

- **Batches P0–P9 (`2be300f` -> `10a3b4a`):** Established the 12 UI Laws, `tokens.css`, closed UI primitives (`primitives.tsx`), 3-tier `HeaderFooter.tsx`, bilingual `marketing.ts`, primitive-only marketing pages, warm IELTS Crimson (`#C8102E`) & Sunset Orange (`#FF5A26`) palette, flat `BangladeshPaymentTrustBar.tsx`, and overhauled `/sign-in`, `/sign-up`, and `/exam/diagnostic`.
- **Batches P10–P16 (`cd0b27f` -> `7b382df`):** Upgraded to the Pearl/Bone (`#FAF8F5`) and Crisp Alabaster (`#FDFCFA`) stationery canvas, unified `/checkout`, `/for-institutions`, `/tools/*`, `/exam/ielts-preview`, and `(learner)/app/*`, fixed `.lumen-locale-dark` / `.lumen-locale-light`, verified `144/144` live Playwright viewport checks (`overflow=0`), and added bilingual `not-found.tsx` (404) & `error.tsx` (500) pages.

---

## 2. PHASE 2 & PHASE 3 MASTER ROADMAP (BATCHES P17 -> P22)

| Batch | Scope | Target Routes & Modules | Recommended Model |
| :--- | :--- | :--- | :--- |
| **BATCH P17** | **Unblock `/checkout` Guest Access + 1-Click Demo Login + Admin Operations Console** | `middleware.ts`, `/checkout`, `AuthForm.tsx`, `(learner)/layout.tsx`, `/app/admin/page.tsx` | `Gemini 4 Hydrogen (Medium)` |
| **BATCH P18** | **Substantive Content & Progressive-Disclosure Polish on `/gre`, `/ielts`, `/courses`, `/pricing`** | `marketing.ts`, `primitives.tsx`, `/gre/page.tsx`, `/ielts/page.tsx`, `/courses/page.tsx`, `/pricing/page.tsx` | `Gemini 4 Hydrogen (Medium)` |
| **BATCH P19** | **Snappy Performance, Tactile Dropdown/Tab Micro-Animations & Fast Asset Pipeline** | `tokens.css`, `primitives.tsx`, `HeaderFooter.tsx`, `media.ts` | `Gemini 4 Hydrogen (Low/Med)` |
| **BATCH P20** | **Unbreakable Modular Cybersecurity & Payment Integrity Layer (OWASP / PCI-DSS SAQ-A)** | `src/lib/security/*`, `middleware.ts`, `next.config.ts`, `CheckoutClient.tsx`, `security-payment-guard.test.ts` | `Gemini 4 Hydrogen (Medium)` |
| **BATCH P21** | **Bilingual SEO, `sitemap.ts`, `robots.ts` & Canonical / `hreflang` Metadata** | `src/lib/seo.ts`, `sitemap.ts`, `robots.ts`, `(marketing)/**/page.tsx` | `Gemini 4 Hydrogen (Low/Med)` |
| **BATCH P22** | **Final Production Build Verification (`next build`), Security Audit & Release Lock** | `tooling/design-lint.mjs`, `tooling/design-shots.mjs`, `HANDOFF.md`, `MISTAKE-LEDGER.md` | `Gemini 4 Hydrogen (Medium)` |

---

## 3. STEP-BY-STEP EXECUTION BATCHES (P17 -> P22)

---

### BATCH P17: Unblock Public `/checkout` Access, Add 1-Click Demo Scholar/Admin Login & Build Admin Operations Console (`/app/admin`)

- **Recommended Model:** `Gemini 4 Hydrogen (Medium)`
- **Why This Batch Exists:**
  1. Currently, visiting `/checkout` without an active session cookie redirects the user to `/sign-in` (either in `apps/web/app/[locale]/(checkout)/checkout/page.tsx` or `middleware.ts`), preventing prospective students from inspecting the BDT Tuition Ledger, 0% bKash Split-Pay schedule, and 15% Mushak 6.3 VAT invoice before logging in.
  2. Prospective evaluators and the site owner need a **1-Click Instant Demo Access** bar on `/sign-in` (and unlocked guest/demo access to `/checkout`, `/app/*`, and `/app/admin`) so every student and admin dashboard can be inspected immediately in the browser without requiring external OTP email/SMS servers.
- **Allowed Files to Edit / Create:**
  - `apps/web/middleware.ts` (if present)
  - `apps/web/app/[locale]/(checkout)/checkout/page.tsx`
  - `apps/web/app/[locale]/(checkout)/checkout/CheckoutClient.tsx`
  - `apps/web/app/[locale]/(auth)/_components/AuthForm.tsx`
  - `apps/web/app/[locale]/(learner)/layout.tsx`
  - `apps/web/app/[locale]/(learner)/app/admin/page.tsx` (new or update)
  - `tooling/design-lint.mjs`
  - `tooling/design-shots.mjs`

#### Step P17.1: Make `/checkout` 100% Accessible to Guests & Logged-In Users Alike
1. Inspect `apps/web/app/[locale]/(checkout)/checkout/page.tsx` and `apps/web/middleware.ts`.
2. **Remove any forced `redirect('/sign-in')` on `/checkout`!** If `session` or `user` is `null` in `checkout/page.tsx`, pass a clean guest fallback profile (`user = null` or `{ id: 'guest-preview', email: '', name: 'Guest Scholar', role: 'guest' }`) into `<CheckoutClient />`.
3. In `CheckoutClient.tsx`:
   - When the user is a guest (`!user?.email`), display a clean, sharp `rounded-[4px]` **"Step 1: Scholar Account & Mushak 6.3 Billing Identity"** input row at the top of the left column (Full Name, Email Address, and Bangladesh Mobile `+8801XXXXXXXXX`) alongside a subtle link (`Already have an account? Sign in`).
   - Ensure plan switching (`Free Diagnostic`, `IELTS Complete`, `GRE Complete`, `Live Cohort + Mocks`), `0% bKash 2-Part / 3-Part Split-Pay` schedule calculation, payment method selection (`bKash`, `Nagad`, `Rocket`, `Visa / Mastercard`), and the **"Complete Verified BDT Enrollment / Preview Mushak 6.3 Receipt"** flow work 100% interactively without redirecting to `/sign-in`!

#### Step P17.2: Add 1-Click Demo Workspace Switcher on `/sign-in` (`AuthForm.tsx`)
1. In `apps/web/app/[locale]/(auth)/_components/AuthForm.tsx`, below the Staff/Instructor Passkey `<details>` disclosure, add a clean, hairline-bordered institutional **"Instant Workspace Preview (Demo Mode)"** block (`border-t border-[var(--hairline)] pt-5 mt-5`):
   - Heading (`text-xs font-semibold text-[var(--brand-ink)]`): `"Instant Sandbox Preview (No OTP Required)"` / `"তাৎক্ষণিক ডেমো প্রিভিউ (ওটিপি ছাড়াই)"`
   - 3 sharp `rounded-[4px]` quick-access links (`<LocaleLink>`):
     1. `href="/app"` -> `"Scholar Dashboard (/app)"`
     2. `href="/checkout?plan=gre-complete"` -> `"BDT Checkout & VAT Ledger (/checkout)"`
     3. `href="/app/admin"` -> `"Admin & Governance Console (/app/admin)"`
2. Also ensure `apps/web/app/[locale]/(learner)/layout.tsx` (and any page inside `(learner)/app/**`) does NOT hard-redirect to `/sign-in` when no database session cookie is present—instead, fall back gracefully to a verified Demo Scholar session (`Ayman R. • GRE & IELTS Cohort`) so `/app/*` and `/app/admin` always render in the browser.

#### Step P17.3: Create the Institutional Admin & Governance Console (`/app/admin/page.tsx`)
1. Create `apps/web/app/[locale]/(learner)/app/admin/page.tsx` using the Pearl/Bone (`--bg`), Crisp Alabaster (`--surface-paper`), Deep Espresso (`--brand-deep`), IELTS Crimson (`--brand`), and hairline (`--hairline`) stationery aesthetic (**zero `rounded-full`, `rounded-2xl`, `rounded-3xl`, or drop shadows**).
2. Include 4 interactive governance tabs (`rounded-[4px]` flat underline/segmented tabs):
   - **Tab 1: Cohort & Entitlement Ledger:** Live table/grid of active BDT enrollments, `0% bKash Split-Pay` installment statuses (`Installment 1/2 Paid`, `Completed`), and 1-click Mushak 6.3 VAT invoice verification.
   - **Tab 2: AI Writing & Speaking Grading Queue:** Queue of IELTS Task 2 & GRE AWA submissions showing automated 4-criterion band estimates (`Task Response`, `Coherence`, `Lexical Resource`, `Grammar`) with an interactive **"Approve Rubric Score / Override Band"** instructor action.
   - **Tab 3: Item Bank & Psychometrics:** Question calibration table (`GRE Quant Comparison`, `GRE Text Completion`, `CD-IELTS Reading`) showing difficulty parameters ($b$-parameter), discrimination index ($a$-parameter), and distractor-trap trigger rates.
   - **Tab 4: Security & Audit Log:** Live readout of SSLCommerz/bKash webhook signature checks, rate-limit status, and RBAC role enforcement.
3. Add a link to `/app/admin` (`Admin Console` / `অ্যাডমিন কনসোল`) in `apps/web/app/[locale]/(learner)/layout.tsx` navigation, and register `apps/web/app/[locale]/(learner)/app/admin/page.tsx` in `tooling/design-lint.mjs` (`SURFACE_GEOMETRY_FILES`) and `tooling/design-shots.mjs` (`WORKBENCH_SURFACES` + `LIVE_EXTRA_ROUTES`).

#### Step P17.4: Verify, Commit & Halt
1. Run `pnpm design:lint`, `pnpm design:shots`, `NODE_OPTIONS="--max-old-space-size=2048" pnpm --filter @lumen/core exec vitest run`, and `cd apps/web && NODE_OPTIONS="--max-old-space-size=2048" pnpm exec tsc --noEmit --incremental`.
2. Commit to `main` and **HALT** with verification receipts.

---

### BATCH P18: Substantive Content & Progressive-Disclosure Polish on Subpages (`/gre`, `/ielts`, `/courses`, `/pricing`)

- **Recommended Model:** `Gemini 4 Hydrogen (Medium)`
- **Why This Batch Exists:**
  - While `/gre` and `/ielts` are clean, their content currently feels too sparse because exam-specific substance (section-by-section question types, official scoring scales, band descriptors, and week-by-week preparation roadmaps) is missing.
  - Per **Constitution Law 6 & Law 7**, the top-level viewport must remain calm and uncluttered (`<= 40` words per column), while rich academic detail is revealed inside **Progressive Disclosure (`<Tabs>` and `<Disclosure>` accordions)** and **`<SideHeadingBlocks>`**!
- **Allowed Files to Edit:**
  - `apps/web/src/content/marketing.ts`
  - `apps/web/src/components/ui/primitives.tsx`
  - `apps/web/app/[locale]/(marketing)/gre/page.tsx`
  - `apps/web/app/[locale]/(marketing)/ielts/page.tsx`
  - `apps/web/app/[locale]/(marketing)/courses/page.tsx`
  - `apps/web/app/[locale]/(marketing)/pricing/page.tsx`
- **Strict Constraint:** Keep `className=0` and `<table>=0` in all `(marketing)/**/page.tsx` files! All styling and layout must live inside `primitives.tsx`, and all bilingual copy (`en` + `bn`) must live inside `marketing.ts` obeying word caps (`title <= 10w`, `column body <= 40w`, `intro <= 60w`).

#### Step P18.1: Enrich `/gre` (`marketing.ts` + `gre/page.tsx`)
In `apps/web/src/content/marketing.ts` and `apps/web/app/[locale]/(marketing)/gre/page.tsx`, ensure `/gre` renders a complete, authoritative 6-band ETS-track progression (using only closed primitives):
1. **`Breadcrumb` + `HeroBand` (`tone="warm"`, `frame="blocks"`):** Clear 1h 58m Computer-Delivered GRE General Test positioning + primary CTA to `/exam/diagnostic`.
2. **`StatRow`:** 4 verified official-format specifications (`1h 58m` Total Exam Duration, `130–170` Quantitative & Verbal Scale, `5` Timed Sections, `0–6` Analytical Writing Scale).
3. **`SideHeadingBlocks` ("Inside the 1h 58m Adaptive Format"):** 3 crisp blocks explaining Section-Level Adaptivity (how Section 1 performance routes you to a higher-scoring Section 2 panel), Quantitative Comparison & Data Interpretation, and Analytical Writing Issue Tasks.
4. **`Tabs` ("Official Structure, Scoring & Sample Question"):**
   - Tab 1 (`Format & Section Timing`): Clean `<Disclosure>` breakdown of Analytical Writing (1 task, 30m), Quantitative Reasoning (Sec 1: 12 Qs / 21m; Sec 2: 15 Qs / 26m), and Verbal Reasoning (Sec 1: 12 Qs / 18m; Sec 2: 15 Qs / 23m).
   - Tab 2 (`How Adaptive Scoring Works`): Explains raw-to-scaled conversion (`130–170` in 1-point increments), why careless root/sign traps in Section 1 cap your Section 2 ceiling, and links to `/tools/gre-score-calculator`.
   - Tab 3 (`Try a Live Quantitative Comparison Question`): Renders the interactive `<LiveGreWidget />`.
5. **`MediaColumns` ("Four Core Question Families You Will Master"):** Quantitative Comparison, Problem Solving & Data Analysis, Text Completion & Sentence Equivalence, and Analytical Writing Issue Essay (each with photo slot, title link, and `<= 35w` explanation).
6. **New Progressive-Disclosure Section (`Section tone="tint"` + `Heading` + `Disclosure` list):** `"8-Week GRE Preparation Roadmap & FAQ"` — 4 expandable `<Disclosure>` accordions (`Weeks 1–2: Quantitative Foundations & Root/Sign Trap Elimination`, `Weeks 3–4: Text Completion, Sentence Equivalence & FSRS Vocabulary`, `Weeks 5–6: Section-Adaptive Pacing & Calculator Efficiency`, `Weeks 7–8: Full-Length 1h 58m CBT Mocks & Error-Log Forensics`) so serious applicants get concrete syllabus substance on demand!
7. **`CtaBand`:** Direct call to action to start the 15-minute baseline diagnostic (`/exam/diagnostic`).

#### Step P18.2: Enrich `/ielts` (`marketing.ts` + `ielts/page.tsx`)
In `apps/web/src/content/marketing.ts` and `apps/web/app/[locale]/(marketing)/ielts/page.tsx`, ensure `/ielts` renders a complete, authoritative 6-band British-Council-grade progression:
1. **`Breadcrumb` + `HeroBand` (`tone="crimson"`, `frame="petal"`):** Computer-Delivered IELTS Academic & General Training preparation + primary CTA to `/exam/ielts-preview`.
2. **`StatRow`:** 4 verified CD-IELTS format facts (`2h 45m` Core Listening, Reading & Writing, `Band 0–9` Half-Band Reporting Scale, `4 Skills` Assessed, `3` Reading Passages / `40` Questions).
3. **`SideHeadingBlocks` ("Computer-Delivered IELTS at a Glance"):** 3 blocks covering Split-Screen Reading & Highlighting, Single-Play Listening Audio & Note Completion, and 4-Criterion Writing & Speaking Evaluation.
4. **`Tabs` ("Paper Breakdown, Band Descriptors & Academic vs. General Training"):**
   - Tab 1 (`Section Timing & Question Types`): `<Disclosure>` items for Listening (30m + 2m review, 4 parts, 40 questions), Reading (60m, 3 passages, 40 questions—True/False/Not Given, Matching Headings, Summary Completion), Writing (60m: Task 1 150w / 20m + Task 2 250w / 40m), and Speaking (11–14m: Part 1 Interview, Part 2 Cue Card, Part 3 Discussion).
   - Tab 2 (`How Band 7.0–8.5 Is Scored`): Explains the 4 official criteria (`Task Achievement / Response`, `Coherence & Cohesion`, `Lexical Resource`, `Grammatical Range & Accuracy`) and links to `/tools/ielts-band-calculator`.
   - Tab 3 (`Academic vs. General Training`): Explains the exact difference in Reading passages and Writing Task 1 (Academic data/chart report vs. General Training formal/semi-formal letter).
5. **`MediaColumns` ("Train Every IELTS Skill in Official-Format Workbenches"):** Listening, Reading, Writing, and Speaking columns linking to `/exam/ielts-preview` and `/courses`.
6. **New Progressive-Disclosure Section (`Section tone="tint"` + `Heading` + `Disclosure` list):** `"6-Week Band 7.5+ Preparation Plan & Common Questions"` — 4 expandable `<Disclosure>` accordions (`Weeks 1–2: Split-Pane Reading Speed & True/False/Not Given Logic`, `Weeks 3–4: Writing Task 1 Data Synthesis & Task 2 Essay Structure`, `Week 5: Listening Distractor Tracking & Part 2 Cue-Card Fluency`, `Week 6: Full Timed CD-IELTS Mock Exams & Rubric Calibration`).
7. **`CtaBand`:** Direct call to launch `/exam/ielts-preview` or `/exam/diagnostic`.

#### Step P18.3: Enrich `/courses` and `/pricing` Progressive Disclosures
1. Ensure every course on `/courses` includes a rich expandable `<Disclosure>` syllabus (`Module 1` through `Module 4` with concrete lesson topics and mock counts) in `marketing.ts`.
2. Ensure `/pricing` includes expandable `<Disclosure>` FAQs covering `15% Mushak 6.3 VAT Invoice`, `0% bKash 2-Part & 3-Part Split-Pay Schedule`, `7-Day Fair Refund Window`, and `Switching Between Self-Paced and Live Cohorts`.

#### Step P18.4: Verify, Commit & Halt
1. Run `pnpm design:lint`, `pnpm design:shots`, `NODE_OPTIONS="--max-old-space-size=2048" pnpm --filter @lumen/core exec vitest run`, and `cd apps/web && NODE_OPTIONS="--max-old-space-size=2048" pnpm exec tsc --noEmit --incremental`.
2. Commit to `main` and **HALT** with verification receipts.

---

### BATCH P19: Snappy Performance, Tactile Institutional Micro-Animations & Fast Asset Pipeline

- **Recommended Model:** `Gemini 4 Hydrogen (Low)` or `Gemini 4 Hydrogen (Medium)`
- **Objective:** Make the entire website feel **instant, snappy, and tactile** by engineering hardware-accelerated CSS micro-animations (`180ms cubic-bezier(0.16, 1, 0.3, 1)`, respecting `prefers-reduced-motion`) for the MegaMenu dropdowns, mobile accordion drawer, `<Tabs>` panel switches, `<Disclosure>` accordions, and buttons, plus eager viewport link prefetching and instant image decoding.
- **Allowed Files to Edit:**
  - `apps/web/app/tokens.css`
  - `apps/web/src/components/ui/primitives.tsx`
  - `apps/web/src/components/ui/HeaderFooter.tsx`
  - `apps/web/src/content/media.ts`

#### Step P19.1: Add Tactile Institutional Motion Utilities in `apps/web/app/tokens.css`
Add hardware-accelerated (`transform`, `opacity`) motion keyframes and classes to `apps/web/app/tokens.css`:
```css
@keyframes lumenDropdownEnter {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes lumenTabFadeEnter {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.lumen-anim-dropdown {
  animation: lumenDropdownEnter 180ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  will-change: transform, opacity;
}

.lumen-anim-panel {
  animation: lumenTabFadeEnter 180ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
  will-change: transform, opacity;
}

.lumen-interactive-btn {
  transition: transform 140ms cubic-bezier(0.16, 1, 0.3, 1),
              background-color 140ms ease-out,
              border-color 140ms ease-out,
              color 140ms ease-out;
}
.lumen-interactive-btn:active:not(:disabled) {
  transform: translateY(1px);
}

/* Smooth Disclosure (<details>) content reveal */
details.lumen-disclosure > summary {
  transition: background-color 150ms ease-out, color 150ms ease-out;
}
details.lumen-disclosure[open] > div {
  animation: lumenTabFadeEnter 180ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@media (prefers-reduced-motion: reduce) {
  .lumen-anim-dropdown,
  .lumen-anim-panel,
  details.lumen-disclosure[open] > div {
    animation: none !important;
  }
  .lumen-interactive-btn,
  details.lumen-disclosure > summary {
    transition: none !important;
  }
}
```

#### Step P19.2: Wire Snappy Motion & Prefetching into `HeaderFooter.tsx` and `primitives.tsx`
1. In `apps/web/src/components/ui/HeaderFooter.tsx`:
   - Add `lumen-anim-dropdown` to the desktop MegaMenu dropdown panel container and mobile drawer so opening any dropdown feels fluid and anchored to the header bar.
   - Add smooth `transition-transform duration-200` rotation to the chevron icons (`rotate-180` when open).
   - Add smooth left-rail tab hover/focus transitions (`transition-colors duration-150`) inside the `"GRE & IELTS"` mega-menu.
2. In `apps/web/src/components/ui/primitives.tsx`:
   - Add `lumen-interactive-btn` to `<Button>`.
   - Add `lumen-anim-panel` keyed by the active tab index on `<Tabs>` content panels so switching tabs cross-fades and glides smoothly.
   - Add `lumen-disclosure` to `<Disclosure>` (`<details>`) so opening any syllabus or FAQ item animates smoothly.
   - In `<PlaceholderImage>`: add `decoding="async"` and `loading={priority ? "eager" : "lazy"}` (setting `priority` / `fetchPriority="high"` automatically when `slot.startsWith('hero-')`) so hero photography paints immediately while below-the-fold images never block the main thread.

#### Step P19.3: Verify, Commit & Halt
1. Run `pnpm design:lint`, `pnpm design:shots`, `NODE_OPTIONS="--max-old-space-size=2048" pnpm --filter @lumen/core exec vitest run`, and `cd apps/web && NODE_OPTIONS="--max-old-space-size=2048" pnpm exec tsc --noEmit --incremental`.
2. Commit to `main` and **HALT** with verification receipts.

---

### BATCH P20: Unbreakable Modular Cybersecurity & Payment Integrity Architecture (OWASP ASVS + PCI-DSS SAQ-A)

- **Recommended Model:** `Gemini 4 Hydrogen (Medium)`
- **Why This Batch Exists:**
  - The user requires **industry-standard, unbreakable security** across the payment pipeline (`/checkout`, BDT split-pay, SSLCommerz/bKash webhooks) and dashboards (`/app`, `/app/admin`), built inside a **modular, single-source-of-truth security directory (`apps/web/src/lib/security/`)** so security policies, prices, rate limits, and headers can be updated or patched in one place later on.
- **Allowed Files to Edit / Create:**
  - `apps/web/src/lib/security/policy.ts` (new — Central Security Policy & Rate-Limit Registry)
  - `apps/web/src/lib/security/payment-guard.ts` (new — Server-Side Canonical BDT Price Ledger, HMAC-SHA256 Webhook Verifier, Idempotency & Replay Guard)
  - `apps/web/src/lib/security/redirect-guard.ts` (new — Open-Redirect & CSRF Origin Validator)
  - `apps/web/app/api/checkout/verify/route.ts` (new — Hardened Payment Initiation & Verification Endpoint)
  - `apps/web/app/[locale]/(checkout)/checkout/CheckoutClient.tsx`
  - `apps/web/next.config.ts`
  - `packages/core/src/__tests__/security-payment-guard.test.ts` (new — Automated Security & Anti-Tampering Test Suite)
- **Forbidden Paths:** Do NOT touch `LocaleSwitcher.tsx`, `LocaleLink.tsx`, `TranslatedText.tsx`, or `apps/web/app/api/translate/route.ts`.

#### Step P20.1: Create the Central Security Policy Registry (`apps/web/src/lib/security/policy.ts`)
Create a strongly typed, single-file security configuration module so future updates only require editing `policy.ts`:
- **`SECURITY_POLICY`**:
  - `allowedRedirectPrefixes`: `['/en', '/bn', '/app', '/checkout', '/exam', '/courses', '/gre', '/ielts', '/pricing', '/help']`
  - `rateLimits`: `{ checkoutPerMinute: 10, authOtpPerMinute: 5, translatePerMinute: 60 }`
  - `webhookReplayWindowSeconds`: `300` (5-minute maximum clock skew for HMAC-signed payment webhooks)
  - `maxPayloadBytes`: `16384` (16 KB max JSON body on checkout/auth endpoints)
  - `roles`: `['guest', 'learner', 'instructor', 'admin'] as const`

#### Step P20.2: Create the Payment Integrity & Anti-Tampering Engine (`apps/web/src/lib/security/payment-guard.ts`)
Implement 4 industry-standard payment protections (PCI-DSS SAQ-A & OWASP API Security Top 10):
1. **Immutable Server-Side Price & VAT Ledger (`CANONICAL_BDT_PLANS`)**:
   - Define the exact BDT prices (`free-diagnostic: 0`, `ielts-complete: 4990`, `gre-complete: 5990`, `live-cohort: 12990`, plus aliases `gre-core`, `gre-plus`, `gre-live`, `all-access`).
   - Export `computeCanonicalOrder(planId: string, splitParts: 1 | 2 | 3)`:
     - Rejects unknown `planId` or unauthorized `splitParts` (only plans `>= 4990` BDT allow 2-part or 3-part split-pay).
     - Computes exact `totalBdt`, `baseTuitionBdt`, included `vat15Bdt` ($\text{round}(\text{totalBdt} \times \frac{15}{115})$), and `installmentSchedule` on the server.
     - **Anti-Tampering Check (`verifyClientAmountNotTampered`)**: If a client request passes a `clientSubmittedTotalBdt` that differs by even `1 BDT` from `CANONICAL_BDT_PLANS[planId].totalBdt`, throw a `SECURITY_PRICE_TAMPER_DETECTED` error and block the transaction!
2. **Cryptographic Idempotency & Replay Guard (`verifyIdempotencyAndTimestamp`)**:
   - Validates that every payment request carries a valid `idempotencyKey` (`^[a-zA-Z0-9_-]{16,64}$`) and a `timestampMs` within $\pm 300\text{s}$ of server time.
3. **HMAC-SHA256 Webhook Signature Verification (`verifyWebhookHmacSignature`)**:
   - Uses Node's `crypto.createHmac('sha256', secret)` and **constant-time comparison (`crypto.timingSafeEqual`)** to verify SSLCommerz / bKash webhook payloads so forged payment callbacks are mathematically impossible.

#### Step P20.3: Create Open-Redirect & CSRF Guard (`apps/web/src/lib/security/redirect-guard.ts`)
1. Export `sanitizeInternalRedirect(rawUrl: string | null | undefined, fallback = '/app'): string`:
   - Blocks protocol-relative URLs (`//evil.com`), external schemes (`http:`, `https:`, `javascript:`, `data:`), backslash tricks (`/\evil.com`), and any path not starting with a single `/`.
2. Export `verifySameOriginCsrf(requestHeaders: { origin?: string | null; host?: string | null }): boolean`:
   - Verifies that state-changing `POST` requests originate from the same host.

#### Step P20.4: Wire `/api/checkout/verify/route.ts`, `CheckoutClient.tsx` & `next.config.ts` Headers
1. Create `apps/web/app/api/checkout/verify/route.ts` (`POST`):
   - Enforces `verifySameOriginCsrf`, rate limiting, `computeCanonicalOrder`, and `verifyClientAmountNotTampered`, returning a signed Mushak 6.3 VAT invoice payload and verified transaction receipt ID.
2. Wire `CheckoutClient.tsx` to validate orders through the canonical ledger and display a `"PCI-DSS SAQ-A & HMAC-SHA256 Price-Lock Verified"` status in the receipt view.
3. Verify `apps/web/next.config.ts` response headers include `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy: camera=(), microphone=(self), geolocation=()`.
4. Create `packages/core/src/__tests__/security-payment-guard.test.ts` with unit tests proving:
   - Client price tampering (`4990` changed to `100`) is rejected with `SECURITY_PRICE_TAMPER_DETECTED`.
   - Expired timestamps (`> 300s` old) and replayed idempotency keys are rejected.
   - Forged webhook HMAC signatures fail `timingSafeEqual` verification.
   - Open-redirect payloads (`https://evil.com`, `//evil.com`, `javascript:alert(1)`) are neutralized to `/app`.

#### Step P20.5: Verify, Commit & Halt
1. Run `pnpm design:lint`, `pnpm design:shots`, `NODE_OPTIONS="--max-old-space-size=2048" pnpm --filter @lumen/core exec vitest run`, and `cd apps/web && NODE_OPTIONS="--max-old-space-size=2048" pnpm exec tsc --noEmit --incremental`.
2. Commit to `main` and **HALT** with verification receipts.

---

### BATCH P21: Bilingual SEO, `sitemap.ts`, `robots.ts` & Canonical / `hreflang` Metadata

- **Recommended Model:** `Gemini 4 Hydrogen (Low)` or `Gemini 4 Hydrogen (Medium)`
- **Objective:** Implement `apps/web/src/lib/seo.ts`, `apps/web/app/sitemap.ts`, `apps/web/app/robots.ts`, and `generateMetadata` across the server marketing routes (`/`, `/courses`, `/gre`, `/ielts`, `/pricing`, `/help`, `/for-institutions`) with `en` and `bn` `hreflang` alternates (`className=0` strictly preserved).
- **Allowed Files to Edit / Create:**
  - `apps/web/src/lib/seo.ts`
  - `apps/web/app/sitemap.ts`
  - `apps/web/app/robots.ts`
  - `apps/web/app/[locale]/(marketing)/page.tsx`
  - `apps/web/app/[locale]/(marketing)/courses/page.tsx`
  - `apps/web/app/[locale]/(marketing)/gre/page.tsx`
  - `apps/web/app/[locale]/(marketing)/ielts/page.tsx`
  - `apps/web/app/[locale]/(marketing)/pricing/page.tsx`
  - `apps/web/app/[locale]/(marketing)/help/page.tsx`
  - `apps/web/app/[locale]/(marketing)/for-institutions/page.tsx`
  - `packages/core/src/__tests__/ui-primitives-caps.test.ts`

#### Step P21.1: Implement `seo.ts`, `sitemap.ts`, `robots.ts` & `generateMetadata`
1. Create `apps/web/src/lib/seo.ts` exporting `SITE_URL` and `buildLocalizedMetadata({ locale, pathname, titleEn, titleBn, descriptionEn, descriptionBn })` with `alternates.canonical` and `alternates.languages` (`en`, `bn`, `x-default`).
2. Create `apps/web/app/sitemap.ts` and `apps/web/app/robots.ts` covering all public routes in both `en` and `bn`.
3. Add `generateMetadata` to `/`, `/courses`, `/gre`, `/ielts`, `/pricing`, `/help`, and `/for-institutions` without adding any `className` or JSX divs.
4. Add unit test assertions in `packages/core/src/__tests__/ui-primitives-caps.test.ts`.

#### Step P21.2: Verify, Commit & Halt
1. Run `pnpm design:lint`, `pnpm design:shots`, `NODE_OPTIONS="--max-old-space-size=2048" pnpm --filter @lumen/core exec vitest run`, and `cd apps/web && NODE_OPTIONS="--max-old-space-size=2048" pnpm exec tsc --noEmit --incremental`.
2. Commit to `main` and **HALT** with verification receipts.

---

### BATCH P22: Final Production Readiness Audit, Documentation Sign-Off & Release Lock

- **Recommended Model:** `Gemini 4 Hydrogen (Medium)`
- **Objective:** Lock all new routes (`/app/admin`, `not-found.tsx`, `error.tsx`, `src/lib/security/*`, `src/lib/seo.ts`) into `tooling/design-lint.mjs` and `tooling/design-shots.mjs`, revert any `next-env.d.ts` churn, update `docs/MISTAKE-LEDGER.md` and `docs/HANDOFF.md`, and run the complete verification suite.
- **Allowed Files to Edit:**
  - `tooling/design-lint.mjs`
  - `tooling/design-shots.mjs`
  - `docs/MISTAKE-LEDGER.md`
  - `docs/HANDOFF.md`
  - `docs/logs/reviews/m2-9-institutional-ui-signoff.md`

#### Step P22.1: Lock Security & SEO Guards into `tooling/design-lint.mjs`
1. In `tooling/design-lint.mjs`:
   - Verify `[surface-guard]` checks `/app/admin/page.tsx`, `not-found.tsx`, and `error.tsx` for zero `rounded-full`, `rounded-2xl`, and `rounded-3xl` classes.
   - Add a `[security-guard]` check verifying that `apps/web/src/lib/security/policy.ts`, `payment-guard.ts`, and `redirect-guard.ts` exist and contain `timingSafeEqual` and `SECURITY_PRICE_TAMPER_DETECTED`.
2. Run all checks (`pnpm design:lint`, `pnpm design:shots`, `vitest`, `tsc --noEmit`), update `docs/HANDOFF.md` and `docs/MISTAKE-LEDGER.md`, commit to `main`, and print the final Phase 2–3 sign-off summary.

**P15 -> P22 Final Sign-Off Receipts (2026-11-15):**
- `pnpm design:lint`: PASSED (`asset-guard: 15 local WebP assets verified`, `link-guard: 231 hrefs -> 17 routes verified`, `surface-guard: 21 files clean`).
- `pnpm design:shots`: PASSED (`7` marketing routes + `21` workbench/learner surfaces `rounded-full/2xl/3xl=0`).
- `@lumen/core` Vitest: `30 passed (30)`, `327 passed (327)`.
- `@lumen/web` TypeScript: `0` errors (`tsc --noEmit --incremental`).
- `@lumen/web` Production Build: PASSED (`93/93` static pages generated).