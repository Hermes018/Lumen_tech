# LUMEN ACADEMY — MASTER UI/UX OVERHAUL RUNBOOK (BATCHES P0 -> P9)

**File Location:** `/home/ayra/Lumen_tech/Lumen_tech/docs/lumen_ui_overhaul_master_runbook.md`  
**Companion References:** `docs/LUMEN-DESIGN-STRATEGY.md` & `docs/LUMEN-FAILURE-MODES-AND-VERIFICATION.md`  
**Target Environment:** Fedora Linux (8 GB RAM Ceiling — Always prefix Node/pnpm commands with `NODE_OPTIONS="--max-old-space-size=2048"`)  
**Git Author:** `Ayman Rahman <aymanrahman30@gmail.com>` (Local commits only — **NEVER** run `git push`)

---

## 0. INTERACTIVE CLI EXECUTION PROTOCOL (READ FIRST — MANDATORY FOR AGENT)

You are operating in **Interactive Single-Batch Mode**. You MUST obey these 5 execution laws on every turn:

1. **ONE BATCH PER TURN (STRICT STOP-GATE):**
   * Batches `P0` through `P5` are already completed and committed.
   * Execute **ONLY** the specific batch requested by the user (`BATCH P6`, `BATCH P7`, `BATCH P8`, or `BATCH P9`), or the next uncompleted batch in sequence `P6` -> `P7` -> `P8` -> `P9` when the user says `"continue"` or `"next"`.
   * **NEVER** chain two batches together in a single turn.
2. **NO IMPROVISATION / ZERO GUESSING:**
   * Every CSS variable, hex code, image URL, prop, file path, and layout rule is explicitly specified below. Do not invent props, do not add extra cards or pill badges, and do not modify files outside the batch's **Allowed Files** list.
   * Never hardcode the literal string `"Lumen Academy"` in `.ts` or `.tsx` files—always import `{ brand } from '@lumen/config'` and use `brand.name` so `brand-sweep.test.ts` passes.
3. **PROTECTED i18n FILES (NEVER MODIFY):**
   * The Bengali switcher and translation pipeline are working and locked. You must **NEVER** modify:
     * `apps/web/app/[locale]/_components/LocaleSwitcher.tsx`
     * `apps/web/app/[locale]/_components/LocaleLink.tsx`
     * `apps/web/app/[locale]/_components/TranslatedText.tsx`
     * `apps/web/app/api/translate/route.ts`
4. **MANDATORY RECEIPTS BEFORE STOPPING:**
   * A batch is NOT complete until you run its verification commands and paste the raw output of:
     1. `pnpm design:lint`
     2. `NODE_OPTIONS="--max-old-space-size=2048" pnpm --filter @lumen/core exec vitest run src/__tests__/brand-sweep.test.ts src/__tests__/i18n-pages-coverage.test.ts src/__tests__/ui-primitives-caps.test.ts`
     3. `cd apps/web && NODE_OPTIONS="--max-old-space-size=2048" pnpm exec tsc --noEmit --incremental`
     4. `git status -sb` and `git diff --stat HEAD~1`
5. **END-OF-BATCH HALT MESSAGE:**
   * After committing the completed batch locally to `main`, end your response with:
     > **`BATCH <ID> COMPLETE AND COMMITTED. Waiting for your instruction: reply "continue" to run Batch <NEXT_ID>, or tell me any adjustments you want first.`**

---

## 1. COMPLETED FOUNDATION SUMMARY (BATCHES P0 -> P5)

* **P0–P5 Status:** Completed on `main` (`2be300f` -> `0c2fb7a`).
* **What Exists:** `AGENTS.md`, `.claude/skills/institutional-ui/SKILL.md`, `apps/web/app/tokens.css`, `apps/web/src/components/ui/primitives.tsx`, `apps/web/src/components/ui/HeaderFooter.tsx`, `apps/web/src/content/media.ts`, `apps/web/src/content/nav.ts`, `apps/web/src/content/marketing.ts`, `tooling/design-lint.mjs`, and `tooling/design-shots.mjs`.

---

## 2. FORENSIC DIAGNOSIS OF THE 5 VISUAL DEFECTS FIXED IN BATCHES P6 -> P9

1. **Defect 1 — Broken Black Image Boxes (`PlaceholderImage` / `media.ts`):**
   * **Root Cause:** `media.ts` used unencoded `#` hex characters inside `data:image/svg+xml;utf8,...` strings. Browsers treat `#` as a URL fragment identifier and truncate the SVG before the `fill` attribute, causing `<rect width="100%" height="100%" />` to render with SVG's default `#000000` solid black fill!
   * **Fix (Batch P6):** Replace broken data-URI strings with verified open-source student/academic photography from `images.unsplash.com` (`<img>` with `loading="lazy"` / `eager`), ensure `apps/web/next.config.ts` CSP `img-src` allows `https://images.unsplash.com`, and render a rich inline React JSX SVG warm crimson/orange editorial illustration underneath as a fallback—never a `data:image/svg+xml` string and never a black rectangle.
2. **Defect 2 — Dark Unreadable Hero Text on Crimson & Brand Heroes (`/pricing`, `/ielts`):**
   * **Root Cause:** `.lumen-h1` and `.lumen-body` in `apps/web/app/tokens.css` hardcode `color: var(--brand-ink)` and `color: var(--text)`, overriding Tailwind's `text-white` inside dark/crimson `HeroBand` sections.
   * **Fix (Batch P6):** Add `.lumen-hero-inverse .lumen-h1, .lumen-hero-inverse .lumen-h2, .lumen-hero-inverse .lumen-h3 { color: #FFFFFF !important; }` and `.lumen-hero-inverse .lumen-body { color: rgba(255, 255, 255, 0.92) !important; }` in `tokens.css` and apply `lumen-hero-inverse` whenever `HeroBand` has `tone="brand"` or `tone="crimson"`.
3. **Defect 3 — Cold Purple Palette vs. Requested IELTS Warm Red, Orange & Translucent Backdrops:**
   * **Fix (Batch P6):** Update `apps/web/app/tokens.css` to a cohesive **Warm IELTS Crimson, Sunset Orange & Translucent Rose/Peach Backdrop** palette:
     * `--bg`: `#FFFFFF` (Pure Daylight White)
     * `--bg-warm`: `#FFF5F2` (Light Translucent Warm Rose-Peach Hero Backdrop)
     * `--bg-tint`: `#FEF0EB` (Light Translucent Coral-Alabaster Alternating Band)
     * `--surface-translucent`: `rgba(255, 243, 238, 0.86)` (Translucent Warm Backdrop for panels/notices)
     * `--brand`: `#C8102E` (Institutional IELTS Crimson Red)
     * `--brand-deep`: `#231116` (Deep Warm Espresso-Aubergine for MainNav, SubBar & Footer)
     * `--brand-ink`: `#1E0F13` (Deep Warm Charcoal-Espresso for headings)
     * `--text`: `#4A3339` (Warm Umber-Slate body text, $\ge 7.5:1$ contrast)
     * `--link`: `#B80D27` (Deep Crimson underlined action links)
     * `--accent`: `#FF5A26` (Vibrant Warm Orange / Coral for TopRibbon, geometric photo L-bars, and step highlights)
     * `--crimson`: `#D90429` (Vivid Crimson for `StepRow` numeral squares and hero bands)
     * `--terracotta`: `#E04F26` (Warm Terracotta-Orange for dashed arrows and outline accents)
     * `--soft-btn`: `#FFE2D6` (Soft Warm Peach-Orange button fill with `--brand-ink` text)
     * `--hairline`: `#F2D6CE` (Warm Rose-Sand structural hairline divider)
4. **Defect 4 — AI Rainbow Pill Box in `BangladeshPaymentTrustBar.tsx`:**
   * **Root Cause:** `BangladeshPaymentTrustBar.tsx` still renders a dark `rounded-2xl` box with 6 neon pink/orange/purple/blue/green `rounded-full` pills.
   * **Fix (Batch P7):** Rewrite `BangladeshPaymentTrustBar.tsx` into a flat, borderless institutional typographic ledger (`border-t border-b`, zero `rounded-full` pills, zero rainbow borders) that blends naturally into both the footer and checkout.
5. **Defect 5 — `/sign-in`, `/sign-up`, and `/exam/diagnostic` Still Look Like Disconnected AI Templates:**
   * **Root Cause:** `(auth)` pages still have fake unverified stats (`+11.4 Pts`, `78%`), a fake testimonial (`Farhan T., BUET`), `ALL-CAPS` eyebrows, and translucent rounded boxes; `/exam/diagnostic` still has 5 `rounded-full` header pills, `rounded-2xl` floating cards, and 3 nested dashed hint boxes.
   * **Fix (Batches P8 & P9):** Rebuild `/sign-in`, `/sign-up`, and `/exam/diagnostic` using the exact same tokens (`tokens.css`), sharp `4px` (`rounded-[4px]`) geometry, `<LumenSparkMotif />`, open-source photography with geometric L-bar framing, and flat hairline dividers.

---

## 3. SEQUENTIAL EXECUTION BATCHES (P6 -> P9)

---

### BATCH P6: Warm Crimson/Orange/Translucent Palette (`tokens.css`), Hero Contrast Fix & Open-Source Photography (`media.ts` + `primitives.tsx`)

* **Recommended Model:** `Gemini 4 Hydrogen (Medium)` or `Gemini 4 Argon (Medium)`
* **Objective:** Update `tokens.css` to the warm IELTS red/orange/translucent palette, fix the dark-on-dark hero text bug, allow `images.unsplash.com` in `next.config.ts`, and fix the broken black images in `media.ts` and `primitives.tsx` using real open-source photography + safe JSX graphic backdrops.
* **Allowed Files to Edit:**
  * `apps/web/app/tokens.css`
  * `apps/web/next.config.ts`
  * `apps/web/src/content/media.ts`
  * `apps/web/src/components/ui/primitives.tsx`
  * `apps/web/src/components/ui/HeaderFooter.tsx` (only if needed to reference `--brand-deep` for the main nav/footer bar so crimson/orange accents pop)

#### Step P6.1: Update `apps/web/app/tokens.css` (Warm Crimson, Orange & Translucent Backdrops + Inverse Hero Fix)
Replace `apps/web/app/tokens.css` with:
```css
:root {
  color-scheme: light;
  --bg: #FFFFFF;
  --bg-warm: #FFF5F2;
  --bg-tint: #FEF0EB;
  --surface-translucent: rgba(255, 243, 238, 0.86);
  --brand: #C8102E;
  --brand-deep: #231116;
  --brand-ink: #1E0F13;
  --text: #4A3339;
  --link: #B80D27;
  --accent: #FF5A26;
  --crimson: #D90429;
  --terracotta: #E04F26;
  --soft-btn: #FFE2D6;
  --focus: #D90429;
  --hairline: #F2D6CE;
  --shadow-hard: 6px 6px 0px #231116;
}

.lumen-h1 {
  font-size: clamp(2.25rem, 3.8vw, 3.25rem);
  line-height: 1.12;
  font-weight: 800;
  color: var(--brand-ink);
  letter-spacing: -0.02em;
}

.lumen-h2 {
  font-size: clamp(1.75rem, 2.6vw, 2.25rem);
  line-height: 1.2;
  font-weight: 800;
  color: var(--brand-ink);
  letter-spacing: -0.015em;
}

.lumen-h3 {
  font-size: 1.25rem;
  line-height: 1.3;
  font-weight: 700;
  color: var(--brand-ink);
}

.lumen-body {
  font-size: 1.0625rem;
  line-height: 1.65;
  color: var(--text);
  max-width: 65ch;
}

/* High-contrast white typography inside crimson/deep-brand heroes & bands */
.lumen-hero-inverse .lumen-h1,
.lumen-hero-inverse .lumen-h2,
.lumen-hero-inverse .lumen-h3 {
  color: #FFFFFF !important;
}

.lumen-hero-inverse .lumen-body {
  color: rgba(255, 245, 242, 0.94) !important;
}

:lang(bn) .lumen-h1,
:lang(bn) .lumen-h2,
:lang(bn) .lumen-h3,
:lang(bn) .lumen-body {
  line-height: 1.75;
  letter-spacing: 0 !important;
  text-transform: none !important;
}
```

#### Step P6.2: Ensure `https://images.unsplash.com` Is Permitted in `apps/web/next.config.ts`
In `apps/web/next.config.ts`:
1. Ensure `images.remotePatterns` includes `{ protocol: 'https', hostname: 'images.unsplash.com' }`.
2. In the Content-Security-Policy header (`img-src`), ensure `https://images.unsplash.com` is present alongside `'self' data: blob:`.

#### Step P6.3: Replace Broken SVG Data URIs in `apps/web/src/content/media.ts` with Open-Source Photography URLs
Update `MEDIA_SLOTS` in `apps/web/src/content/media.ts` so every slot uses a verified, high-availability open-source student/university photograph from Unsplash (`auto=format&fit=crop&w=1000&q=80`), plus a warm fallback gradient (`themeColor`):
* `hero-home`: `'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80'` (University scholars studying together in daylight)
* `hero-gre`: `'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=80'` (Graduate quantitative & analytical test preparation)
* `hero-ielts`: `'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80'` (Student practicing computer-delivered IELTS with headphones)
* `hero-courses`: `'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80'` (Collaborative seminar & structured curriculum study)
* `hero-pricing`: `'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1000&q=80'` (Transparent planning and academic investment)
* `hero-help`: `'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1000&q=80'` (Dedicated student support & guidance team)
* `track-gre`: `'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80'` (STEM & business graduate school preparation)
* `track-ielts-ac`: `'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80'` (University campus graduation & international study)
* `track-ielts-gt`: `'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'` (Global career & skilled migration pathways)
* `dest-usa`: `'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=800&q=80'` (United States university & skyline)
* `dest-uk`: `'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80'` (United Kingdom Westminster & academic heritage)
* `dest-canada`: `'https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=800&q=80'` (Canada Toronto skyline & campus life)
* `dest-australia`: `'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80'` (Australia Sydney harbor & university precinct)
* `split-diagnostic`: `'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80'` (Student taking timed computer-based diagnostic)
* `mega-courses`: `'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80'` (Focused mentor-guided exam preparation)

#### Step P6.4: Upgrade `<PlaceholderImage />` and `<HeroBand />` in `apps/web/src/components/ui/primitives.tsx`
1. In `<PlaceholderImage />`:
   * Render a warm translucent crimson/orange architectural backdrop (`bg-[var(--bg-tint)] relative overflow-hidden`) with a subtle geometric warm-orange/crimson SVG pattern underneath, and an `<img src={slotData.src} alt={...} className="relative z-10 h-full w-full object-cover" loading="lazy" />` on top. That way, real open-source photographs render crisply, and even before loading, the backdrop is warm rose/orange—**never a solid black rectangle**!
2. In `<HeroBand />`:
   * When `tone === 'crimson'` or `tone === 'brand'`, add the `lumen-hero-inverse` class to the hero section wrapper so `.lumen-h1` and `.lumen-body` render in crisp `#FFFFFF` white!
   * When `tone === 'warm'` (default), use a layered warm translucent backdrop (`bg-[var(--bg-warm)]` with a soft translucent radial glow of `--crimson` at 6% and `--accent` orange at 8% opacity) and frame the right-hand photograph with **IELTS-style geometric offset blocks in Warm Crimson (`var(--brand)`) and Sunset Orange (`var(--accent)`)** + 4 translucent crimson/orange circles in the upper-right corner!
3. In `HeaderFooter.tsx` and `<SubBar />` / `<CtaBand />`:
   * Use `bg-[var(--brand-deep)]` (`#231116`) for the main navigation bar, sub-bar, and footer, with `bg-[var(--brand)]` (`#C8102E` crimson) and `bg-[var(--accent)]` (`#FF5A26` warm orange) accents so the entire site shares the warm red/orange IELTS visual harmony.

#### Step P6.5: Verify, Commit & Halt
1. Run `pnpm design:lint`, `NODE_OPTIONS="--max-old-space-size=2048" pnpm --filter @lumen/core exec vitest run src/__tests__/brand-sweep.test.ts src/__tests__/i18n-pages-coverage.test.ts src/__tests__/ui-primitives-caps.test.ts`, and `cd apps/web && NODE_OPTIONS="--max-old-space-size=2048" pnpm exec tsc --noEmit --incremental`.
2. Commit to `main` and **HALT** with verification receipts.

---

### BATCH P7: De-AI `BangladeshPaymentTrustBar.tsx` (Eliminate Dark Bubble & Rainbow Pills)

* **Recommended Model:** `Gemini 4 Hydrogen (Low/Medium)`
* **Objective:** Rewrite `apps/web/app/[locale]/_components/BangladeshPaymentTrustBar.tsx` to eliminate the dark floating bubble box and neon rainbow pills (`bKash` pink pill, `Nagad` orange pill, `Rocket` purple pill, `Visa` blue pill, `SSLCommerz` green pill), replacing them with a clean, flat institutional typographic bar that matches the rest of the website.
* **Allowed Files to Edit:**
  * `apps/web/app/[locale]/_components/BangladeshPaymentTrustBar.tsx`
  * `apps/web/src/components/ui/HeaderFooter.tsx` (if props/styling on `BangladeshPaymentTrustBar` in the footer need adjustment)

#### Step P7.1: Rewrite `apps/web/app/[locale]/_components/BangladeshPaymentTrustBar.tsx`
1. **Zero `rounded-full` pills, zero `rounded-2xl` dark boxes, zero neon rainbow colors (`pink-500`, `amber-500`, `purple-500`, `blue-500`, `emerald-500`).**
2. Support an optional `variant?: 'footer' | 'light'` prop (auto-detecting or defaulting cleanly):
   * In the footer (or dark background): renders a flat, full-width horizontal strip (`border-t border-b border-white/15 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-white/85`).
   * On light pages (`/checkout`): renders a flat horizontal strip (`border-t border-b border-[var(--hairline)] bg-[var(--bg-warm)] px-5 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-[var(--text)]`).
3. Left side: simple lock SVG icon in `var(--accent)` + bold label (`Accepted Bangladesh & International Payment Methods` / `গ্রহণযোগ্য বাংলাদেশ ও আন্তর্জাতিক পেমেন্ট মাধ্যম`).
4. Right side: clean typographic payment items separated by subtle vertical hairlines (`divide-x divide-current/20`):
   * `bKash (0% Split-Pay)`
   * `Nagad`
   * `Rocket`
   * `Visa / Mastercard`
   * `SSLCommerz Verified`
   * `Mushak 6.3 VAT Invoice`
   *(Fully localized in English and Bengali, zero pill borders, zero background bubbles!)*

#### Step P7.2: Verify, Commit & Halt
1. Run `pnpm design:lint`, `NODE_OPTIONS="--max-old-space-size=2048" pnpm --filter @lumen/core exec vitest run src/__tests__/brand-sweep.test.ts src/__tests__/i18n-pages-coverage.test.ts src/__tests__/ui-primitives-caps.test.ts`, and `cd apps/web && NODE_OPTIONS="--max-old-space-size=2048" pnpm exec tsc --noEmit --incremental`.
2. Commit to `main` and **HALT** with verification receipts.

---

### BATCH P8: Overhaul `/sign-in` & `/sign-up` Into the Institutional Design Language (Zero Fake Stats, Zero Bubbles)

* **Recommended Model:** `Gemini 4 Hydrogen (Medium)`
* **Objective:** Rebuild `apps/web/app/[locale]/(auth)/_components/AuthForm.tsx`, `sign-in/page.tsx`, and `sign-up/page.tsx` so `/sign-in` and `/sign-up` obey Constitution Laws 2, 3, 4, 6, and 9 and match the warm IELTS crimson/orange/translucent design language.
* **Allowed Files to Edit:**
  * `apps/web/app/[locale]/(auth)/_components/AuthForm.tsx`
  * `apps/web/app/[locale]/(auth)/sign-in/page.tsx`
  * `apps/web/app/[locale]/(auth)/sign-up/page.tsx`
  * `apps/web/app/[locale]/(auth)/layout.tsx`

#### Step P8.1: Eliminate All AI-Template & Constitution Violations on `/sign-in` & `/sign-up`
1. **Delete Fake Stats & Fake Testimonials (Law 9):** Remove `"GRE +11.4 Pts Median Gain"`, `"IELTS Band 7.5+ Achieved by 78%"`, and the invented `"Farhan T., BUET Graduate"` testimonial quote in both English and Bengali.
2. **Delete Uppercase Eyebrows & Rounded Pill Badges (Laws 2 & 3):** Remove `"CALIBRATED FOR 330+..."`, `"LUMEN ACADEMY ACCOUNT PORTAL"`, `"ETS / IELTS OFFICIAL FORMAT"`, and all `rounded-xl` / `rounded-2xl` / `rounded-full` boxes.
3. **New Institutional Auth Layout (`AuthForm.tsx`):**
   * **Top Institutional Bar (`bg-[var(--brand-deep)] text-white h-16 px-6 border-b-4 border-[var(--brand)] flex items-center justify-between`):**
     * Left: `<LocaleLink>` back to `/` with the 3-ray `<LumenSparkMotif />` and `{brand.name}`.
     * Right: `<LocaleSwitcher />` (untouched) + link to `Help Center` (`/help`).
   * **Main Split Stage (`min-h-[calc(100dvh-4rem)] grid grid-cols-1 lg:grid-cols-12 bg-[var(--bg)]`):**
     * **Left 6 Columns (`lg:col-span-6 bg-[var(--bg-warm)] px-8 py-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[var(--hairline)]`):**
       * Top editorial block: `<LumenSparkMotif />` + `.lumen-h1` heading ($\le 10$ words: `"One Account for GRE® and IELTS™ Preparation"` / `"জিআরই এবং আইইএলটিএস প্রস্তুতির জন্য একটি অ্যাকাউন্ট"`) + `.lumen-body` ($\le 30$ words).
       * Middle visual: Sharp `0px`-radius `<PlaceholderImage slot="hero-home" aspect="16:10" />` framed on the bottom-left and bottom-right by `14px` solid geometric L-bars in `var(--brand)` (`#C8102E` crimson) and `var(--accent)` (`#FF5A26` warm orange).
       * Bottom verified facts row (3 borderless columns separated by `divide-x divide-[var(--hairline)] pt-6`):
         * `1h 58m` — Adaptive GRE Format
         * `4 Skills` — Computer-Delivered IELTS
         * `15% VAT` — Official Mushak 6.3 Invoice
     * **Right 6 Columns (`lg:col-span-6 bg-[var(--bg)] px-6 py-12 sm:px-12 lg:p-16 flex flex-col justify-center`):**
       * Max-width `420px` centered container, **zero outer card border, zero drop shadow**:
       * `<LumenSparkMotif />` + `.lumen-h2` (`Sign in to continue` / `Create your account`) + short 1-line subtitle.
       * Sharp `rounded-[4px]` Google OAuth button (`border border-[var(--brand-ink)] bg-white text-[var(--brand-ink)] font-semibold h-12`).
       * Clean horizontal hairline divider (`or continue with one-time code`).
       * Flat underline tab switcher (`border-b border-[var(--hairline)]` with active tab `border-b-3 border-[var(--brand)] text-[var(--brand)] font-bold`): `Email code` | `Bangladesh mobile (+880)`.
       * Sharp `rounded-[4px]` input field (`border border-[#B8A3A8] focus:border-[var(--brand)] h-12 px-4`) + solid crimson submit button (`bg-[var(--brand)] hover:bg-[#A50B24] text-white font-semibold h-12 rounded-[4px]`).
       * Clean native `<details className="border-t border-[var(--hairline)] pt-4 text-sm">` disclosure for `Staff & Instructor Passkey / 2FA` (closed by default, zero bordered bubble!).
       * Bottom underlined link switching between `/sign-in` and `/sign-up` via `<LocaleLink>`.

#### Step P8.2: Verify, Commit & Halt
1. Run `pnpm design:lint`, `NODE_OPTIONS="--max-old-space-size=2048" pnpm --filter @lumen/core exec vitest run src/__tests__/brand-sweep.test.ts src/__tests__/i18n-pages-coverage.test.ts src/__tests__/ui-primitives-caps.test.ts`, and `cd apps/web && NODE_OPTIONS="--max-old-space-size=2048" pnpm exec tsc --noEmit --incremental`.
2. Commit to `main` and **HALT** with verification receipts.

---

### BATCH P9: Overhaul `/exam/diagnostic` Into the Warm Institutional Design Language & Lock Global Audit

* **Recommended Model:** `Gemini 4 Hydrogen (Medium)`
* **Objective:** Overhaul `apps/web/app/[locale]/(exam)/exam/diagnostic/page.tsx` so the diagnostic test workbench matches the warm crimson/orange/charcoal institutional aesthetic (zero `rounded-full` header pills, zero `rounded-2xl` floating bubbles, zero nested hint boxes), and update `tooling/design-lint.mjs` + `tooling/design-shots.mjs` to enforce these rules across Auth, Diagnostic, and Trust Bar.
* **Allowed Files to Edit:**
  * `apps/web/app/[locale]/(exam)/exam/diagnostic/page.tsx`
  * `tooling/design-lint.mjs`
  * `tooling/design-shots.mjs`
  * `docs/HANDOFF.md`
  * `docs/MISTAKE-LEDGER.md`

#### Step P9.1: Restyle `/exam/diagnostic` (`apps/web/app/[locale]/(exam)/exam/diagnostic/page.tsx`)
Keep all 8 questions, math rendering (`<MathText />`), bilingual translation (`<TranslatedText />`), calculator, scratchpad, and scoring logic 100% intact, while transforming the visual chrome to match the new design system:
1. **Top Institutional Assessment Bar (`bg-[var(--brand-deep)] text-white h-16 px-4 sm:px-8 border-b-4 border-[var(--brand)] sticky top-0 z-30`):**
   * **Zero `rounded-full` pills!**
   * Left: `<LocaleLink>` logo (`LumenSparkMotif` + `{brand.name}`) + vertical hairline divider + bold title (`GRE® Express Diagnostic`) + rectangular progress indicator (`Question 1 of 8` with a flat `4px`-tall `bg-[var(--accent)]` warm orange progress bar).
   * Right: `<LocaleSwitcher />` (untouched) + sharp `rounded-[4px]` rectangular Calculator button (`border border-white/25 bg-white/10 px-3.5 py-1.5 text-xs font-semibold`) + rectangular monospace timer (`bg-[#14090C] border border-white/20 px-3.5 py-1.5 rounded-[4px] font-mono text-sm text-[#FFB499]`).
2. **Main Assessment Stage (`bg-[var(--bg-warm)] min-h-[calc(100dvh-4rem)] py-8 px-4 sm:px-6 lg:px-8`):**
   * Container: `max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start`.
   * **Left 8 Columns (`lg:col-span-8 bg-white border border-[var(--hairline)] rounded-none` — Sharp Exam Sheet, Zero Drop Shadow, Zero `rounded-2xl`):**
     * Top Sheet Strip (`border-b border-[var(--hairline)] bg-[var(--bg-tint)] px-6 py-3 flex items-center justify-between`):
       * Left: Bold crimson text label (`Quantitative Reasoning · Quantitative Comparison` — sentence case, NOT a dark rounded pill!).
       * Right: Rectangular `rounded-[4px]` `Flag for Review` toggle button.
     * Question Body (`p-6 sm:p-10`):
       * Large `.lumen-h3` / `text-xl sm:text-2xl` question stem.
       * Quantitative Comparison table (`grid grid-cols-2 divide-x divide-[var(--hairline)] border border-[var(--hairline)] my-6`) with `bg-[var(--bg-warm)] border-b border-[var(--hairline)] py-2.5 text-center text-xs font-bold text-[var(--brand-ink)]` column headers and `py-8 text-center text-2xl font-semibold` cells.
       * Answer Choices A–D: Flat architectural rows (`w-full text-left p-4 border border-[var(--hairline)] rounded-[4px] transition-colors`)—when selected, highlighted with `border-[var(--brand)] bg-[var(--bg-warm)]` and a solid `bg-[var(--brand)] text-white` square `[A]`–`[D]` keycap.
     * Bottom Sheet Action Bar (`border-t border-[var(--hairline)] px-6 py-4 flex items-center justify-between bg-white`):
       * Underlined `← Previous` button on left, `X / 8 Answered` status in center, and solid crimson `bg-[var(--brand)] text-white px-6 py-2.5 rounded-[4px] font-semibold` `Next Question →` button on right.
   * **Right 4 Columns (`lg:col-span-4 bg-white border border-[var(--hairline)] rounded-none` — Unified Companion Panel):**
     * Top Question Palette (`p-5 border-b border-[var(--hairline)]`):
       * Sentence-case heading (`Question Navigator (1–8)`) + 8 crisp square buttons (`h-9 w-9 rounded-[4px] font-mono text-sm font-bold`) using `bg-[var(--brand)] text-white` for current, `bg-[var(--bg-tint)] text-[var(--brand-ink)] border border-[var(--brand)]` for answered, and `var(--accent)` dot for flagged.
     * Flat Underline Tab Bar (`border-b border-[var(--hairline)] flex`):
       * `Hints (6)` | `Scratchpad` | `Formulas` (active tab uses `border-b-3 border-[var(--brand)] text-[var(--brand)] font-bold`).
     * De-Nested Hints List (`divide-y divide-[var(--hairline)]`):
       * Render Tier 1, Tier 2, and Tier 3 hints as **flat vertical rows separated by a single hairline (`py-3.5`)**—zero rounded boxes inside boxes! Unlock button at bottom is a crisp `w-full bg-[var(--brand-deep)] text-white py-2.5 rounded-[4px] text-sm font-semibold` button.

#### Step P9.2: Expand `tooling/design-lint.mjs` & `tooling/design-shots.mjs`
1. In `tooling/design-lint.mjs`, add checks verifying that:
   * `BangladeshPaymentTrustBar.tsx`, `AuthForm.tsx`, and `diagnostic/page.tsx` contain **zero `rounded-full`**, **zero `rounded-2xl`**, and **zero `rounded-3xl`** classes.
   * `AuthForm.tsx` contains zero fake testimonial strings (`Farhan T.`) or unverified gain claims (`+11.4`).
2. Append the 5 caught issues from Batches P6–P9 into `docs/MISTAKE-LEDGER.md` and update `docs/HANDOFF.md`.

#### Step P9.3: Verify, Commit & Halt
1. Run `pnpm design:lint`, `pnpm design:shots`, `NODE_OPTIONS="--max-old-space-size=2048" pnpm --filter @lumen/core exec vitest run src/__tests__/brand-sweep.test.ts src/__tests__/i18n-pages-coverage.test.ts src/__tests__/ui-primitives-caps.test.ts`, and `cd apps/web && NODE_OPTIONS="--max-old-space-size=2048" pnpm exec tsc --noEmit --incremental`.
2. Commit to `main` and print the final verification summary.