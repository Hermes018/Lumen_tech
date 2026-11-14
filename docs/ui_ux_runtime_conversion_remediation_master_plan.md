# UI/UX, Runtime & Conversion Remediation Master Plan (Milestone M2.5 $\rightarrow$ M3)

**Status:** Active Remediation Blueprint  
**Target Environment:** Fedora 44 KDE Plasma / Windows 11 (8 GB RAM Ceiling, `NODE_OPTIONS="--max-old-space-size=2048"`)  
**Objective:** Eliminate every runtime error, raw LaTeX leak, broken link/toggle, layout overflow, and internal spec reference uncovered during live browser testing, while upgrading the visual identity and conversion architecture to match top-tier commercial leaders (**Magoosh, GregMat, 10 Minute School, Shikho**) across both **Mobile (`360px–767px`)** and **Desktop (`1024px–1920px+`)**.

---

## 1. Exhaustive Forensic Issue Map (12 Root-Cause Defects)

Every defect below was directly observed in live browser testing (`localhost:3000`) or traced from the component tree:

| ID | Severity | Surface / Route | Observed Defect | Root Cause |
| :--- | :--- | :--- | :--- | :--- |
| **BUG-01** | **P0 Blocker** | All Routes (`/pricing`, `/exam/*`, `/checkout`, `/help`, `/sign-in`) | Red Next.js Console Error overlay: `ERROR [Better Auth]: Drizzle schema mismatch — Missing tables: twoFactor; Missing columns: user.twoFactorEnabled, user.phoneNumber, user.phoneNumberVerified`. | `packages/db/src/schema/auth.ts` is missing the `twoFactor` table and the 3 plugin columns required by Better Auth's `twoFactor()` and `phoneNumber()` plugins at initialization. |
| **BUG-02** | **P0 Blocker** | `/exam/diagnostic`, `/gre`, `/app/practice` | Raw unrendered LaTeX strings shown to learners: `Let $x$ be an integer such that $x^2 = 16$`, `$x$`, `$0$`, and `($x = \pm 4$)`. | Question stems, Quantitative Comparison boxes, choice explanations, and hints render raw strings without a KaTeX (`katex`) math renderer. |
| **BUG-03** | **P0 Blocker** | `/exam/diagnostic`, `/exam/ielts-preview` | **Duplicate Stacked Exam Headers:** `(exam)/layout.tsx` renders a hardcoded GRE header (`Section 1 of 2 — Quantitative Reasoning | 34:52`) above the inner GRE Diagnostic bar AND above the IELTS simulator header! | `(exam)/layout.tsx` contains hardcoded GRE chrome instead of letting each specific exam runner mount its own single, authentic top bar. |
| **BUG-04** | **P0 Blocker** | `/exam/ielts-preview`, `/exam/ielts/[attemptId]` | **IELTS Split-Screen Horizontal Overflow & Left Dead Space:** 25% empty gray column on the left; right-hand Questions pane overflows off the right edge of the monitor, cutting off text (`...during pe`, `...approaching`). | Parent flex/grid container constrains width and applies bad horizontal margins instead of using a locked `w-full h-[100dvh] overflow-hidden` split pane on desktop and tabbed switcher on mobile. |
| **BUG-05** | **P0 Blocker** | Global Navbar (`EN / বাংলা` Toggle) | Clicking `EN / বাংলা` in the top navigation bar does nothing. | The toggle is a static button not wired to `next-intl` router navigation (`usePathname` / `useRouter`), and marketing pages contain hardcoded English JSX instead of translation dictionary lookups. |
| **BUG-06** | **P0 Blocker** | Global Footer & Marketing Bottom Links | Clicking **Grievance Officer**, **For Universities & Schools**, **Interactive Pedagogy**, or **FSRS Vocab Engine** in the footer either does nothing (plain text) or returns a **404 Not Found**. | Footer items in `(marketing)/layout.tsx` are either unlinked text or point to unbuilt routes (`/legal/grievance`, `/b2b`, `/vocab`, `/pedagogy`). |
| **BUG-07** | **P1 High** | `/pricing` & `/checkout` | Clicking **Add to Account** on add-on cards or selecting a plan on `/pricing` doesn't pre-populate `/checkout?plan=...`; `/checkout` form is squeezed into ~650px, truncating `EMAIL ADDRESS` (`aymanrahman30@`) and plan dropdown (`IELTS Academic Core — B[`). | Narrow container (`max-w-2xl` instead of `max-w-6xl`), cramped 2-col input sub-grid, and missing URL query-param (`?plan=`) state synchronization. |
| **BUG-08** | **P1 High** | `/checkout` | Shows `5% Educational VAT (Included): BDT 190.00`, contradicting the `15% VAT incl.` stated on `/pricing` and `/help`. | Hardcoded `0.05` tax display in `checkout/page.tsx` instead of calling the canonical 15% BD VAT calculator from `@lumen/core`. |
| **BUG-09** | **P1 High** | `/pricing`, `/checkout`, `/sign-in` | **Internal Blueprint Spec Leaks in Customer UI:** Badges display `(D12 C14)`, `Per D12 C14, compare_at prices...`, `(docs/00 §D5)`, `Staff / Instructor / Org Admin (D4)`, and hardcoded `support@lumenacademy.com`. | `Gemini 3.8 Flash` copied internal specification section numbers directly into public UI copy and hardcoded the support email. |
| **BUG-10** | **P1 High** | Mobile & Tablet Viewports (`360px–768px`) | Top navbar has 9 horizontal items with **no mobile hamburger menu drawer**; exam top bar overflows on phones; IELTS split-screen is unreadable on narrow screens. | Missing responsive breakpoints (`md:hidden` mobile drawer, compact exam toolbar, and mobile `Passage | Questions` tab bar). |
| **BUG-11** | **P1 High** | `/sign-in`, `/sign-up` | `Phone OTP` and `Passkey / 2FA` buttons on `/sign-in` lack complete interactive feedback/drawers, and the page is a sterile white box with zero trust signals. | Stubbed UI states and lack of a two-column conversion layout on auth screens. |
| **BUG-12** | **P1 High** | Global Visual Identity (`/`, `/gre`, `/ielts`, `/pricing`, `/help`) | **Wireframe Sterility:** 95% flat white background with thin gray borders. Lacks the color vibrancy, structured hero banners, payment trust badges (bKash/Nagad/SSLCommerz), and visual product hierarchy of **10 Minute School / Shikho / Magoosh**. | Over-minimalist Tailwind styling without track-specific color themes, dark navy hero bands, or visual social proof components. |

---

## 2. Industry-Standard Stack, Open-Source Libraries & Conversion Patterns

To fix these permanently without reinventing the wheel or writing fragile custom parsers, we will use standard production libraries and UX patterns:

1. **Mathematical Typesetting (`katex`):**
   - Install `katex` (MIT licensed, industry standard used by Khan Academy, Magoosh, and Notion).
   - Build a unified `<MathText text={...} />` component in `@lumen/ui` that parses inline `$...$` and display `$$...$$` blocks into crisp, accessible HTML+MathML with zero layout shift.
2. **Bilingual Typography (`Plus Jakarta Sans` + `Hind Siliguri` + `JetBrains Mono`):**
   - Load Google Fonts `Hind Siliguri` (the gold-standard Bangladeshi UI font used by 10 Minute School and Prothom Alo) alongside `Plus Jakarta Sans` and `Instrument Serif` so switching to `/bn` looks natively designed for Bangladesh.
3. **Color & Visual Hierarchy System (Anti-AI-Slop, High-Conversion EdTech):**
   - **Primary Brand Authority:** Deep Oxford Navy (`#0B132B` / `slate-950`) for hero banners, announcement bars, and CBT headers.
   - **Track 1 — GRE® General Test Theme:** Royal Indigo & Electric Cobalt (`#1E40AF` $\rightarrow$ `#3B82F6`, soft tint `#EFF6FF`) signaling analytical rigor.
   - **Track 2 — IELTS™ Academic & GT Theme:** British Emerald & Teal (`#065F46` $\rightarrow$ `#059669`, soft tint `#ECFDF5`) signaling fluency and global mobility.
   - **High-Intent Conversion Accents:** Warm Amber Gold (`#D97706` / `#F59E0B`) for "Most Popular", "Target Promise", and streak badges; recognizable **bKash Magenta (`#E2136E`)** and **Nagad Orange (`#F7941D`)** payment trust pills.
4. **Conversion Psychology & Product Placement (How 10MS, Shikho & Magoosh Convert Visitors):**
   - **Top Announcement & Cohort Ribbon:** A subtle, dismissible top bar highlighting live cohort dates, the free 15-minute diagnostic CTA, and 0% bKash split-pay.
   - **Interactive "Try Before You Sign Up" Above the Fold:** Keep the live GRE Quant & IELTS Reading mini-samplers interactive, with rendered KaTeX math and an instant **"Unlock Your Predicted Band / GRE Percentile $\rightarrow$ Free 15-Min Diagnostic"** trigger upon answering.
   - **Anchored Pricing Cards:** Visual distinction on the middle/recommended tier (**GRE Plus / IELTS Plus**) with a solid navy/indigo top ribbon, clear "Everything in Core, plus:" grouping, clickable **Add-On Pack cards** that pass `?plan=<slug>` directly into `/checkout`, and a **Payment Trust Strip** (SSLCommerz, bKash, Nagad, Visa, Mastercard, Mushak 6.3 VAT).

---

## 3. Model Selection & Token-Optimization Strategy

Because **`Gemini 3.8 Flash`** tends to take shortcuts when given too many tasks at once (hardcoding strings, leaving stub buttons, or leaking spec codes like `D12 C14`), we enforce a strict **Model-per-Role Split**:

| Phase / Subphase | Assigned Model & Effort | Why This Model Is Best & Most Cost-Effective |
| :--- | :--- | :--- |
| **Phase P2.1:** Runtime Auth Schema, KaTeX Math Engine, Exam Shell Layout & Missing Legal/Footer Pages | **`Gemini 4 Argon (Low)`** *(or `Gemini 3.8 Flash (High)` if saving Argon)* | Deterministic schema/layout fixes with strict file-level acceptance tests that forbid shortcuts. |
| **Phase P2.2:** Full Bilingual (`EN / বাংলা`) Switcher, Mobile Drawer, Pricing $\rightarrow$ Checkout Query Wiring & Spec-Leak Sweep | **`Gemini 3.8 Flash (High)`** | High-volume dictionary wiring (`en.json` / `bn.json`) and mechanical prop plumbing—ideal for burning the `GEMINI MODELS` bucket with a grep verification gate. |
| **Phase P2.3:** Visual Identity, Hero Banners, Split-Screen Auth & Mobile/Desktop Conversion Polish | **`Claude Sonnet 5.5 (Medium)`** *or* **`Gemini 4 Argon (Medium)`** | Frontend aesthetic polish, responsive flexbox/grid geometry, and persuasive conversion copy require higher taste and zero wireframe laziness. |
| **Phase P2.4:** Two-Key Audit + Automated Link/Route Crawler + Mobile/Desktop Playwright Verification | **`Claude Sonnet 5.5 (Low)`** | Fast, surgical verification that zero 404 links, zero `D12`/`D4` spec leaks, and zero horizontal scrollbars remain on `375px` mobile or `1440px` desktop. |

---

## 4. Phased Execution Roadmap (Phases $\rightarrow$ Subphases $\rightarrow$ Sub-Subphases)

### Milestone M2.5: Zero Runtime Errors, Zero Dead Links & Authentic CBT Geometry

#### Phase P2.1: Runtime Stability, KaTeX Math & Exam Viewport Geometry
* **Subphase P2.1.1 — Better Auth Drizzle Schema Synchronization (`BUG-01`)**
  * `P2.1.1a`: Add `twoFactor` table (`id`, `secret`, `backupCodes`, `userId`) to `packages/db/src/schema/auth.ts`.
  * `P2.1.1b`: Add `twoFactorEnabled` (`boolean`), `phoneNumber` (`text`), and `phoneNumberVerified` (`boolean`) columns to the `user` table in `packages/db/src/schema/auth.ts`.
  * `P2.1.1c`: Export and register the full schema map in `packages/auth/src/server.ts` so `ERROR [Better Auth]: Drizzle schema mismatch` disappears across all routes.
* **Subphase P2.1.2 — KaTeX Mathematical Rendering Engine (`BUG-02`)**
  * `P2.1.2a`: Install `katex` and `@types/katex` in `packages/ui` and `apps/web`, and import `katex/dist/katex.min.css` in `apps/web/app/layout.tsx`.
  * `P2.1.2b`: Build `<MathText content={string} />` in `packages/ui/src/components/math-text.tsx` supporting inline `$...$` and block `$$...$$` LaTeX expressions (`\pm`, `\frac`, `\sqrt`, exponents, inequalities).
  * `P2.1.2c`: Replace raw string outputs in `/exam/diagnostic`, `/gre` interactive sampler, Quantitative Comparison boxes, choice explanations, and 3-tier hints with `<MathText />`.
* **Subphase P2.1.3 — Unified Exam Chrome & IELTS Split-Screen Geometry (`BUG-03`, `BUG-04`)**
  * `P2.1.3a`: Strip the hardcoded `Section 1 of 2 — Quantitative Reasoning` header from `apps/web/app/[locale]/(exam)/layout.tsx` so `(exam)/layout.tsx` is a clean `min-h-[100dvh] w-full overflow-x-hidden` shell.
  * `P2.1.3b`: Fix `/exam/ielts-preview` and `/exam/ielts/[attemptId]` to span `100%` of viewport width (`w-full max-w-none m-0`) with zero dead left margin, proper `min-w-0 break-words` on question cards so text never clips on the right, and a **Mobile Tab Switcher (`Passage` | `Questions` | `Notepad`)** on screens `< 1024px`.
* **Subphase P2.1.4 — Eliminate All 404 Footer Links & Build Missing Routes (`BUG-06`)**
  * `P2.1.4a`: Build `/legal/grievance` (`apps/web/app/[locale]/(marketing)/legal/grievance/page.tsx`) displaying the statutory Bangladesh Digital Commerce / PDPO Grievance Officer contact, SLA escalation tiers, and ticket submission link.
  * `P2.1.4b`: Build `/for-institutions` (or `/b2b`) for Universities, Schools & Corporate cohorts with an interactive inquiry form.
  * `P2.1.4c`: Audit every `<Link>` in the global Navbar and Footer so `Terms of Service` $\rightarrow$ `/legal/terms`, `Privacy Policy` $\rightarrow$ `/legal/privacy`, `Refund Policy` $\rightarrow$ `/legal/refund-policy`, `Grievance Officer` $\rightarrow$ `/legal/grievance`, `FSRS Vocab Engine` $\rightarrow$ `/gre#vocab-engine`, `Interactive Pedagogy` $\rightarrow$ `/gre#pedagogy`, and `For Universities & Schools` $\rightarrow$ `/for-institutions`.

---

#### Phase P2.2: Working Bilingual (`EN / বাংলা`) Toggle, Spec-Leak Sweep & Checkout Flow
* **Subphase P2.2.1 — Interactive Language Switcher & Bengali Font (`BUG-05`)**
  * `P2.2.1a`: Load `Hind Siliguri` alongside `Plus Jakarta Sans` in `apps/web/app/layout.tsx`.
  * `P2.2.1b`: Build `<LocaleSwitcher />` Client Component in `apps/web/app/[locale]/_components/LocaleSwitcher.tsx` that reads `useLocale()` and `usePathname()`, toggles between English (`/path`) and Bengali (`/bn/path`), sets `NEXT_LOCALE`, and highlights the active language pill (`EN` vs `বাংলা`).
  * `P2.2.1c`: Wire navigation labels, hero headlines, pricing headers, and footer links to `en.json` and `bn.json` so clicking `বাংলা` visibly translates the interface immediately.
* **Subphase P2.2.2 — Customer-Facing Spec-Leak & Hardcoded String Sweep (`BUG-09`)**
  * `P2.2.2a`: Remove all occurrences of `(D12 C14)`, `Per D12 C14`, `compare_at`, `(docs/00 §D5)`, and `(D4)` from customer-facing JSX across `apps/web`.
  * `P2.2.2b`: Replace hardcoded `support@lumenacademy.com` in the footer with `brand.supportEmail` from `@lumen/config`.
  * `P2.2.2c`: Add an automated unit test in `packages/core/src/__tests__/brand-sweep.test.ts` that fails if any public page contains regex `/\b(D12|C14|C13b|docs\/00|compare_at)\b/`.
* **Subphase P2.2.3 — Spacious Checkout Layout, 15% VAT Fix & Plan/Add-On Query Wiring (`BUG-07`, `BUG-08`)**
  * `P2.2.3a`: Wire every pricing tier button and "Add to Account" add-on button on `/pricing` to `<Link href={`/checkout?plan=${planKey}`}>`.
  * `P2.2.3b`: Read `searchParams.plan` in `/checkout` to pre-select the exact course or add-on pack.
  * `P2.2.3c`: Expand `/checkout` from a cramped center box to a responsive `max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8` layout where Billing inputs never clip, and fix the VAT breakdown to display the statutory **15% BD VAT (Mushak 6.3 Included)**.

---

### Milestone M3: High-Conversion Visual Identity & Mobile/Desktop Parity

#### Phase P2.3: Visual Identity, Hero Banners & Mobile Responsiveness (`BUG-10`, `BUG-11`, `BUG-12`)
* **Subphase P2.3.1 — Responsive Mobile Navbar Drawer & Sticky Bottom CTA (`BUG-10`)**
  * `P2.3.1a`: Add a mobile hamburger trigger (`lg:hidden`) to the marketing header that opens a clean slide-over navigation sheet containing all track links, the `EN / বাংলা` switcher, and `Sign In` / `Get Started` buttons.
* **Subphase P2.3.2 — Rich Hero Banners, Color-Coded Track Themes & Trust Strips (`BUG-12`)**
  * `P2.3.2a`: Upgrade `/` (Home), `/gre`, `/ielts`, `/pricing`, and `/help` with deep Oxford Navy / Indigo / Emerald gradient-mesh hero banners, high-contrast stat callouts (`325+ GRE Target`, `Band 7.5–8.5 IELTS`, `15% Mushak 6.3 VAT Included`), and a **Bangladeshi Payment & Trust Strip** (`bKash`, `Nagad`, `Rocket`, `Visa`, `Mastercard`, `SSLCommerz Verified`).
  * `P2.3.2b`: Redesign `/sign-in` and `/sign-up` (`BUG-11`) into a split-screen layout on desktop (left panel: dark navy atmospheric showcase with live score analytics preview and testimonial; right panel: interactive Google OAuth + Email OTP + working Phone OTP input toggle + 2FA passkey flow).

#### Phase P2.4: Two-Key Audit & Mobile/Desktop Viewport Verification
* **Subphase P2.4.1 — Route, Link & Spec-Leak Audit (`Claude Sonnet 5.5 Low`)**
* **Subphase P2.4.2 — Playwright Desktop (`1440x900`) & Mobile (`375x812`) Viewport Tests**