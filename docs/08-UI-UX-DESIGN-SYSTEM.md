# 08 — UI/UX Design System & Specification ("Lumen UI")

> Status: v1.0 · 2026-11-07 · Owner: design lead · Conforms to `00-DECISIONS.md` (D2 routes, D3 stack, D4 roles, D6 test-engine invariants, D8 design language, D10 tier naming, D12 C13b/C14/C25/C31). If this file conflicts with 00, 00 wins. **Pricing UI shows only numbers from `17-PRICING-MASTER.md`** (tiers Free / Core / Plus / Live / Mentor; "Complete" is retired and means Core); this file never defines a price.
> Audience: AI coding agents (Sonnet implementers, `ui-polisher`) and human reviewers. Everything here is a **requirement** unless marked *(suggestion)*.
> Brand name is a placeholder: always read it from `packages/config/brand.ts`; never hard-code "Lumen Academy" in components, copy files or tests.
> Route names: the canonical route groups are locked in `00-DECISIONS.md` D2 — `(marketing) (auth) (checkout) (learner) (exam) (studio) (grader) (staff) (org) (admin)` — and fine-grained routes follow `03-PRODUCT-SPEC.md` / `07-TEST-ENGINE.md`. The old names `(learn)`, `(test)`, `(dashboard)` are superseded and must not appear. If a route is renamed upstream, update §5 here in the same PR.

**One-sentence brief:** *Apple calm, Khan Academy generous* — a quiet, precise interface with one blue accent, big confident type, soft depth instead of borders, and a lot of real content (courses, questions, scores) shown with real data.

## Contents

1. Design principles + anti-vibe-coded checklist
2. Design tokens (code)
3. Component library spec
4. Layout system
5. Page inventory + wireframes
6. Dynamic dashboards per role
7. Motion & interaction
8. Content design / microcopy
9. Accessibility (WCAG 2.2 AA)
10. Imagery, illustration, icons
11. Reuse plan (free/MIT) and restyling rules
12. Design QA checklist (`ui-polisher`)

---

## 1. Design principles

Seven principles. Each has a **Do** and a **Don't** an agent can test against.

| # | Principle | Do | Don't |
|---|---|---|---|
| P1 | **Calm by default** — one thing is loudest on any screen | One primary button per view/section. Use neutral surfaces; reserve the accent for the primary action, the current location, progress and links. Let whitespace separate groups (24–48 px) instead of boxes. | Put two filled-accent buttons side by side. Colour a whole card blue. Use more than one accent hue in a UI chrome. |
| P2 | **Precise, not decorative** — every pixel on the grid, every number aligned | 8-pt grid (4-pt half steps). Tabular numerals for every score, timer, price, count. Optically align icons with text baselines (icon box 20 px next to 17 px text, `-1px` nudge when needed). Same radius per component class. | Mix 6 px / 10 px / 14 px radii. Let a timer jitter because digits have different widths. Centre an icon "roughly". |
| P3 | **Generous, not empty** — Khan-style resource richness with Apple-style breathing room | Show real content early: course syllabi, sample questions, score reports, instructor names. Hierarchy comes from size/weight/colour of text, not from borders. Dense where users work (tables, question banks), airy where users decide (marketing, onboarding). | Hide the product behind abstract hero art. Fill a section with three icon cards because the layout "needs" it. Use density everywhere or nowhere. |
| P4 | **Depth is soft and meaningful** — elevation says "this floats above" | Hairline ring + 1–2 low-alpha shadows for cards; stronger shadow only for things that overlay (popover, dialog, sheet, palette). Frosted material only on nav bar, top bar, sheets, command palette. | Drop shadows >24 px blur on resting cards. Glassmorphism on cards, buttons, badges. Coloured/glowing shadows. |
| P5 | **Motion confirms, never entertains** — 150–300 ms, ease-out, purposeful | Animate state change (press, toggle, check, progress fill, sheet in/out). Respect `prefers-reduced-motion`. No motion inside the exam shell except timer warnings and essential transitions. | Parallax, floating blobs, looping background animation, confetti on routine events, bounce on page load. |
| P6 | **Trust through honesty** — scores, prices and claims are real and labelled | "Estimated band — not an official IELTS score" next to every AI/mock band. Show what is included in a price, in BDT first for `bn`/BD users. Real instructor names/photos, real course counts. State uncertainty (confidence range) where a prediction exists. | Fake testimonials, invented user counts, countdown timers that reset, "AI-powered" badges used as decoration, lorem ipsum, "John Doe". |
| P7 | **Bilingual and low-bandwidth native** — Bangla is not a translation afterthought | Every component tested with Bangla strings (longer, taller glyphs). Layouts survive +35 % text length. Pages work at 360 px and on a throttled 3G profile (LCP < 2.5 s on 4G Moto G-class). | Truncate Bangla with `line-clamp` that cuts matras. Mix English and Bangla in one label. Ship a 400 KB hero video on mobile. |

### 1.1 Anti-vibe-coded checklist (merge-blocking for UI PRs)

If any item is "no", the PR is not done. `ui-polisher` (see §12) runs this list first.

**Colour & surfaces**
- [ ] No gradient backgrounds on sections, cards, buttons or text. Only permitted gradients: (a) the video-player scrim (black 0→60 %), (b) skeleton shimmer, (c) the horizontal-scroll edge fade mask. Nothing purple-to-blue, ever.
- [ ] Exactly one accent hue (Lumen blue) in chrome. Semantic colours (success/warning/danger/info) appear only to convey status. Chart/band colours come from §2.1 tokens only.
- [ ] No raw hex, `rgb()`, `slate-*`, `gray-*`, `blue-500` etc. in app code. Tailwind's default palette is **disabled** (`--color-*: initial`), so such classes do not compile.
- [ ] Glass/blur only on the 4 sanctioned surfaces: marketing nav, app top bar (after scroll), sheets/drawers scrim chrome, command palette. Never on cards, never stacked glass-on-glass.
- [ ] Shadows come from `shadow-xs…xl` tokens. No `shadow-2xl`, no coloured shadows, no `blur > 24px` on resting elements.
- [ ] Borders are hairlines (`--line`) or none. Don't outline every card **and** shadow it **and** tint it.

**Layout & type**
- [ ] No "centred everything": body copy, forms, list rows, table cells, card text are left-aligned (right-aligned in RTL-agnostic numeric columns). Only hero headline blocks, empty states, pricing numerals and certificates may centre.
- [ ] No generic 3-column "icon in a coloured circle + title + two lines" grid. Feature sections must be one of: product screenshot + annotated copy, split row (media left/right alternating), numbered process, comparison table, or a real-content rail (courses, questions, scores).
- [ ] Only the type tokens in §2.3. No `text-[17px]`, no `text-lg`/`text-xl` (the default scale is disabled). No more than 4 type sizes visible in one component.
- [ ] Font weights 400/500/600/700 only. Display uses 700 with negative tracking; body 400.
- [ ] Spacing uses even multiples of 4 px; half-steps (4 px) only inside components. No `p-[13px]`, no `mt-7` (28 px is not on the grid: allowed values listed in §2.4).
- [ ] One radius per component class (§2.5). Nested radii obey inner = outer − padding.
- [ ] Optical alignment: icon + label vertically centred on the text x-height; first baselines of side-by-side blocks align; numerals tabular; headings use `text-wrap: balance`, paragraphs `text-wrap: pretty`.

**Content & imagery**
- [ ] No lorem ipsum, no "Feature One", no "John Doe", no "Acme". Seed data is plausible Bangladeshi names, real exam topics, real prices from the price book. Marketing screenshots show real UI with seeded realistic data (Rahim, Nusrat, Tahmid…), not placeholders.
- [ ] No emoji as icons or bullets (✨🚀📚). Emoji allowed only inside user-generated content. Flags in the language switcher are **not** used (use "EN" / "বাংলা" labels).
- [ ] Icons are Lucide only, one stroke width (1.5 px at 20/24 px), one size per context (§10.4). No filled/outline mixing in one row.
- [ ] No stock "AI brain/circuit/sparkle" art; no AI-generated faces. AI features are labelled in plain words ("AI feedback"), with one small neutral icon, no glow, no gradient, no sparkle.
- [ ] Copy follows §8: no hype ("revolutionary", "supercharge", "unlock your potential"), no exclamation marks except in rare success confirmations, no "Oops!".

**States & behaviour**
- [ ] Every data view has designed **empty, loading (skeleton), error (with retry), partial/degraded** states. Not just the happy path.
- [ ] Skeletons match the final layout's dimensions exactly (same row height, avatar size, text-line widths 60–100 %). **CLS ≤ 0.02** on every route. Images/video have explicit aspect-ratio. Web fonts use `size-adjust` fallbacks.
- [ ] Optimistic UI where safe (bookmark, flag question), spinners only for > 400 ms waits, and never a bare full-page spinner.
- [ ] Buttons keep their width when entering loading state. Forms keep their height when errors appear (reserved 20 px message line or inline message in a stable region).
- [ ] Hover effects exist only under `@media (hover: hover)`. Touch has pressed states instead.
- [ ] Focus ring visible on every interactive element; no `outline: none` without replacement.
- [ ] Dark mode is designed, not inverted: separate surface ladder, lower-chroma accent, shadows replaced with lighter surface + hairline.
- [ ] Bangla screenshots reviewed for every page (no clipped matras, no tofu, correct numerals policy).

---

## 2. Design tokens

All tokens live in **one file**: `packages/ui/src/styles/tokens.css`, imported by `apps/web/app/globals.css`. Components consume tokens via Tailwind utilities generated from `@theme`; never `var(--x)` inline in JSX except for dynamic values (chart series, per-course accent).

### 2.1 Colour

**Intent.** Neutral greys tuned to Apple's system greys (cool, very slightly blue-violet-free; `#1D1D1F` ink, `#F5F5F7` fill). Single accent **"Lumen blue"** `#0A5CC5` (deeper than Apple's `#0071E3`, so white text is 6.3:1 and it reads "academic", not "app store"). Dark mode accent lifts to `#5AAEFF` for text/icons and uses `#0A6FE0` for filled buttons (white text 4.8:1).

**Measured contrast (computed with WCAG 2.x relative luminance; re-verified by CI script `tooling/contrast-check.ts` — task P0-26):**

| Pair | Ratio | Use |
|---|---|---|
| `fg` #1D1D1F on `canvas` #FBFBFD | 16.3 : 1 | body text |
| `fg-2` #4A4A4F on `surface` #FFF | 8.8 : 1 | secondary text |
| `fg-3` #6E6E73 on `surface` #FFF / on `surface-2` #F5F5F7 | 5.1 / 4.7 : 1 | tertiary text, placeholders, captions (AA) |
| `fg-4` #AEAEB2 | 2.2 : 1 | **disabled / decorative only** — never information |
| `control-border` #8E8E93 on #FFF | 3.3 : 1 | input/checkbox boundaries (WCAG 1.4.11 ≥ 3:1) |
| `accent` #0A5CC5 on #FFF / white on accent | 6.3 : 1 | links, buttons |
| `success` #1F7A3A / `warning` #9A4A00 / `danger` #C4121F / `info` #0B6E8A on #FFF | 5.4 / 6.3 / 6.1 / 5.8 : 1 | status text, icons |
| same on their `-soft` tints | ≥ 4.8 : 1 | badges, alerts |
| Dark: `fg` #F5F5F7 on #0B0B0D | 18.1 : 1 | |
| Dark: `fg-2` #B0B0B5 / `fg-3` #8E8E93 on #1C1C1E | 7.9 / 5.2 : 1 | |
| Dark: accent #5AAEFF on #1C1C1E | 7.2 : 1 | |

#### Palette (raw scales — referenced only inside `tokens.css`)

| Scale | 0/25 | 50 | 100 | 150 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 850 | 900 | 950 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Neutral | `#FFFFFF`/`#FBFBFD` | `#F5F5F7` | `#EDEDF0` | `#E5E5EA` | `#D2D2D7` | `#AEAEB2` | `#8E8E93` | `#6E6E73` | `#4A4A4F` | `#3A3A3C` | `#2C2C2E` | `#1C1C1E` | `#1D1D1F` | `#0B0B0D` |

| Lumen blue | 50 | 100 | 200 | 300 | 400 | 500 | 600 (**light accent**) | 700 | 800 | 900 |
|---|---|---|---|---|---|---|---|---|---|---|
| | `#F0F6FE` | `#E3EEFC` | `#C7DCF8` | `#9CC1F0` | `#5AAEFF` (**dark accent text**) | `#2F7DE1` | `#0A5CC5` | `#084AA0` | `#063D85` | `#0A2F5E` |

#### Semantic colours

| Role | Light fg | Light soft bg | Dark fg | Dark soft bg | Solid fill (white text unless noted) |
|---|---|---|---|---|---|
| success | `#1F7A3A` | `#E7F5EB` | `#4CC36E` | `#12301C` | `#1F7A3A` |
| warning | `#9A4A00` | `#FFF3E0` | `#FFB340` | `#3A2606` | `#FFB340` with `#1D1D1F` text |
| danger | `#C4121F` | `#FDECEC` | `#FF6B6B` | `#3B1316` | `#C4121F` (dark: `#E5484D`) |
| info | `#0B6E8A` | `#E5F4F8` | `#5CC8E6` | `#0F2F38` | `#0B6E8A` |

#### Exam-specific colours

*Band tiers* (IELTS 0–9, half-bands; also reused for GRE 130–170 mapped to 5 tiers). **Single-hue sequential** so no band looks like "fail red"; the number is always printed, colour never carries meaning alone. Text/fill pairs all ≥ 5.8 : 1.

| Tier | IELTS band | Light bg / fg | Dark bg / fg |
|---|---|---|---|
| band-0 Emerging | 0 – 3.5 | `#E9EAEE` / `#3A3A3F` | `#2C2C2E` / `#D1D1D6` |
| band-1 Developing | 4 – 5 | `#D6E4F7` / `#0B3A73` | `#16365F` / `#CFE3FF` |
| band-2 Competent | 5.5 – 6.5 | `#A9C8F0` / `#0A2F5E` | `#1F5AA8` / `#E3EFFF` |
| band-3 Good | 7 – 7.5 | `#0A5CC5` / `#FFFFFF` | `#5AAEFF` / `#0B0B0D` |
| band-4 Expert | 8 – 9 | `#063D85` / `#FFFFFF` | `#A5D0FF` / `#0B0B0D` |

*Skill identity* (Listening/Reading/Writing/Speaking, Verbal/Quant/AWA) uses `--chart-1…4` below plus an always-present icon + label, so colour is never the only cue.

*Exam shell themes* (user-selectable inside the exam, remembered): `default` (white page, ink text), `soft` (`#FAF6EC` page, `#2B2A27` text), `contrast` (black page, `#FFE14D` text — contrast 14.5 : 1). The shell chrome is flat, no blur, no shadows beyond 1 px lines.

#### Chart palette (colour-blind safe)

Based on the **Okabe–Ito** set, individually tuned so every mark has ≥ 3 : 1 against its surface (WCAG 1.4.11), in light and dark. Rules for use are in §3.31. Always pair with direct labels, markers, or dash patterns; never rely on hue only.

| Token | Light | Dark | Okabe–Ito origin | Typical series |
|---|---|---|---|---|
| `chart-1` | `#0072B2` | `#4DA8E8` | blue | Listening / Verbal / "you" |
| `chart-2` | `#C77700` | `#F0A92B` | orange | Reading / Quant |
| `chart-3` | `#007A5A` | `#2DC49A` | bluish green | Writing / AWA / target |
| `chart-4` | `#C24E00` | `#F07A33` | vermillion | Speaking / errors |
| `chart-5` | `#3A9BD6` | `#7CC4F2` | sky blue | secondary comparison |
| `chart-6` | `#B8588A` | `#E08BB8` | reddish purple | tertiary |
| `chart-7` | `#8F7A00` | `#E3CF3A` | yellow (darkened) | tertiary |
| `chart-8` | `#6E6E73` | `#8E8E93` | grey | benchmark / "average learner" |

Never use more than 5 series in one chart; beyond that use small multiples or a table.

#### The CSS (copy verbatim)

```css
/* packages/ui/src/styles/tokens.css — Tailwind CSS v4 */
@import "tailwindcss";

/* Theme switching: next-themes with attribute="data-theme", defaultTheme="system", enableSystem */
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

/* ---------- 0. Remove Tailwind defaults so nothing "default" can leak in ---------- */
@theme {
  --color-*: initial;
  --text-*: initial;
  --shadow-*: initial;
  --radius-*: initial;
  --ease-*: initial;
  --breakpoint-*: initial;
  --font-*: initial;
  --blur-*: initial;
  --drop-shadow-*: initial;
  --inset-shadow-*: initial;
  --animate-*: initial;
}

/* ---------- 1. Static theme values (do not change with light/dark) ---------- */
@theme {
  /* Spacing: 4px base unit. Utilities p-1=4 p-2=8 p-3=12 p-4=16 p-6=24 p-8=32 … (see §2.4 for the allow-list) */
  --spacing: 0.25rem;

  /* Breakpoints (min-width) */
  --breakpoint-xs: 22.5rem;   /* 360  small phones */
  --breakpoint-sm: 40rem;     /* 640  large phones / landscape */
  --breakpoint-md: 48rem;     /* 768  tablets portrait */
  --breakpoint-lg: 64rem;     /* 1024 tablets landscape / small laptops */
  --breakpoint-xl: 80rem;     /* 1280 desktops */
  --breakpoint-2xl: 90rem;    /* 1440 large desktops */

  /* Font families — see §2.2 for how the CSS variables are produced by next/font */
  --font-sans: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display",
               var(--font-inter), Inter, var(--font-bn), "Noto Sans Bengali", "Hind Siliguri",
               system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-mono: ui-monospace, "SF Mono", var(--font-mono-next), "JetBrains Mono", Menlo, Consolas, monospace;

  /* Radii (§2.5) */
  --radius-xs: 4px;     /* tags, kbd, focus ring corners on tiny things */
  --radius-sm: 8px;     /* compact controls (32px high), chips, menu items */
  --radius-md: 12px;    /* default controls (40/48px), inputs, buttons */
  --radius-lg: 16px;    /* cards, popovers */
  --radius-xl: 24px;    /* hero media, sheets (top corners), large panels */
  --radius-2xl: 32px;   /* marketing feature panels only */
  --radius-full: 9999px;/* pills, avatars, switches, progress */

  /* Motion (§2.8) */
  --ease-standard: cubic-bezier(0.2, 0.8, 0.2, 1);    /* default, entering */
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);            /* leaving */
  --ease-emphasized: cubic-bezier(0.16, 1, 0.3, 1);   /* sheets, shared-element, expo-out */
  --ease-linear: linear;
  --duration-fast: 150ms;
  --duration-base: 200ms;
  --duration-slow: 300ms;
  --duration-slower: 500ms;

  /* z-index scale (§2.9) */
  --z-base: 0;
  --z-raised: 1;
  --z-sticky: 10;
  --z-nav: 20;
  --z-dropdown: 30;
  --z-overlay: 40;
  --z-modal: 50;
  --z-popover: 60;
  --z-toast: 70;
  --z-tooltip: 80;
  --z-exam-alert: 90;

  /* Containers */
  --container-prose: 42.5rem;   /* 680  lesson / blog text, ~65ch at 17px */
  --container-form: 25rem;      /* 400  auth + single-column forms */
  --container-content: 70rem;   /* 1120 marketing sections */
  --container-app: 75rem;       /* 1200 dashboard content */
  --container-wide: 80rem;      /* 1280 catalogue grids */
  --container-studio: 100rem;   /* 1600 studio/admin max */
}

/* ---------- 2. Type scale (Apple names). letter-spacing & line-height tuned per size ---------- */
/* --bn-track is 1 in Latin, 0 in Bangla (negative tracking breaks conjuncts). --bn-lh multiplies line-height in Bangla. */
:root { --bn-track: 1; --bn-lh: 1; --bn-size: 1; }
:lang(bn) { --bn-track: 0; --bn-lh: 1.2; --bn-size: 1.06; }

@theme inline {
  --text-display: clamp(2.5rem, 1.7rem + 3.2vw, 3.5rem);      /* 40→56 */
  --text-display--line-height: calc(1.07 * var(--bn-lh));
  --text-display--letter-spacing: calc(-0.025em * var(--bn-track));
  --text-display--font-weight: 700;

  --text-score: 4.5rem;                                        /* 72 band / score numeral */
  --text-score--line-height: 1;
  --text-score--letter-spacing: calc(-0.03em * var(--bn-track));
  --text-score--font-weight: 700;

  --text-title1: 2.5rem;                                       /* 40 / 44 */
  --text-title1--line-height: calc(1.1 * var(--bn-lh));
  --text-title1--letter-spacing: calc(-0.022em * var(--bn-track));
  --text-title1--font-weight: 600;

  --text-title2: 1.75rem;                                      /* 28 / 36 */
  --text-title2--line-height: calc(1.286 * var(--bn-lh));
  --text-title2--letter-spacing: calc(-0.019em * var(--bn-track));
  --text-title2--font-weight: 600;

  --text-title3: 1.375rem;                                     /* 22 / 28 */
  --text-title3--line-height: calc(1.273 * var(--bn-lh));
  --text-title3--letter-spacing: calc(-0.014em * var(--bn-track));
  --text-title3--font-weight: 600;

  --text-headline: 1.0625rem;                                  /* 17 / 24, 600 */
  --text-headline--line-height: calc(1.412 * var(--bn-lh));
  --text-headline--letter-spacing: calc(-0.01em * var(--bn-track));
  --text-headline--font-weight: 600;

  --text-body: 1.0625rem;                                      /* 17 / 24 (UI)  */
  --text-body--line-height: calc(1.412 * var(--bn-lh));
  --text-body--letter-spacing: calc(-0.01em * var(--bn-track));
  --text-body--font-weight: 400;

  --text-prose: 1.0625rem;                                     /* 17 / 28 (lessons, passages, articles) */
  --text-prose--line-height: calc(1.647 * var(--bn-lh));
  --text-prose--letter-spacing: calc(-0.008em * var(--bn-track));
  --text-prose--font-weight: 400;

  --text-callout: 1rem;                                        /* 16 / 24 — inputs, buttons (≥16px stops iOS zoom) */
  --text-callout--line-height: calc(1.5 * var(--bn-lh));
  --text-callout--letter-spacing: calc(-0.006em * var(--bn-track));
  --text-callout--font-weight: 400;

  --text-subheadline: 0.9375rem;                               /* 15 / 20 */
  --text-subheadline--line-height: calc(1.333 * var(--bn-lh));
  --text-subheadline--letter-spacing: calc(-0.004em * var(--bn-track));
  --text-subheadline--font-weight: 400;

  --text-footnote: 0.8125rem;                                  /* 13 / 20 */
  --text-footnote--line-height: calc(1.538 * var(--bn-lh));
  --text-footnote--letter-spacing: 0;
  --text-footnote--font-weight: 400;

  --text-caption: 0.75rem;                                     /* 12 / 16 — smallest allowed size */
  --text-caption--line-height: calc(1.333 * var(--bn-lh));
  --text-caption--letter-spacing: calc(0.01em * var(--bn-track));
  --text-caption--font-weight: 500;
}

/* ---------- 3. Light + dark semantic variables ---------- */
:root, [data-theme="light"] {
  color-scheme: light;

  --canvas:     #FBFBFD;  --surface:   #FFFFFF;  --surface-2: #F5F5F7;  --surface-3: #EDEDF0;
  --scrim:      rgb(0 0 0 / 0.40);
  --fg:         #1D1D1F;  --fg-2: #4A4A4F;  --fg-3: #6E6E73;  --fg-4: #AEAEB2;
  --line:       rgb(0 0 0 / 0.08);  --line-strong: rgb(0 0 0 / 0.16);  --control-border: #8E8E93;

  --accent: #0A5CC5;  --accent-hover: #084AA0;  --accent-pressed: #063D85;
  --accent-soft: #E8F1FD;  --accent-soft-fg: #0A5CC5;  --accent-fg: #FFFFFF;
  --focus: #0A5CC5;

  --success: #1F7A3A;  --success-soft: #E7F5EB;  --success-solid: #1F7A3A;  --success-solid-fg: #FFFFFF;
  --warning: #9A4A00;  --warning-soft: #FFF3E0;  --warning-solid: #FFB340;  --warning-solid-fg: #1D1D1F;
  --danger:  #C4121F;  --danger-soft:  #FDECEC;  --danger-solid:  #C4121F;  --danger-solid-fg:  #FFFFFF;
  --info:    #0B6E8A;  --info-soft:    #E5F4F8;  --info-solid:    #0B6E8A;  --info-solid-fg:    #FFFFFF;

  --band-0-bg: #E9EAEE; --band-0-fg: #3A3A3F;  --band-1-bg: #D6E4F7; --band-1-fg: #0B3A73;
  --band-2-bg: #A9C8F0; --band-2-fg: #0A2F5E;  --band-3-bg: #0A5CC5; --band-3-fg: #FFFFFF;
  --band-4-bg: #063D85; --band-4-fg: #FFFFFF;

  --chart-1: #0072B2; --chart-2: #C77700; --chart-3: #007A5A; --chart-4: #C24E00;
  --chart-5: #3A9BD6; --chart-6: #B8588A; --chart-7: #8F7A00; --chart-8: #6E6E73;
  --chart-grid: rgb(0 0 0 / 0.08);

  /* Elevation: hairline ring + low-alpha layered shadows */
  --sh-xs: 0 1px 1px rgb(0 0 0 / 0.04);
  --sh-sm: 0 0 0 1px rgb(0 0 0 / 0.05), 0 1px 2px rgb(0 0 0 / 0.04), 0 2px 8px -2px rgb(0 0 0 / 0.05);
  --sh-md: 0 0 0 1px rgb(0 0 0 / 0.06), 0 4px 8px -2px rgb(0 0 0 / 0.06), 0 12px 24px -8px rgb(0 0 0 / 0.10);
  --sh-lg: 0 0 0 1px rgb(0 0 0 / 0.06), 0 8px 16px -4px rgb(0 0 0 / 0.08), 0 24px 48px -12px rgb(0 0 0 / 0.18);
  --sh-xl: 0 0 0 1px rgb(0 0 0 / 0.06), 0 16px 32px -8px rgb(0 0 0 / 0.12), 0 40px 80px -20px rgb(0 0 0 / 0.28);
  --sh-inset: inset 0 0 0 1px rgb(0 0 0 / 0.06);

  /* Material (frosted) — §2.7 */
  --material-regular: rgb(251 251 253 / 0.72);
  --material-thick:   rgb(251 251 253 / 0.86);
  --material-line:    rgb(0 0 0 / 0.08);
}

[data-theme="dark"] {
  color-scheme: dark;

  --canvas:     #0B0B0D;  --surface:   #1C1C1E;  --surface-2: #232326;  --surface-3: #2C2C2E;
  --scrim:      rgb(0 0 0 / 0.60);
  --fg:         #F5F5F7;  --fg-2: #B0B0B5;  --fg-3: #8E8E93;  --fg-4: #58585D;
  --line:       rgb(255 255 255 / 0.10);  --line-strong: rgb(255 255 255 / 0.18);  --control-border: #6E6E73;

  --accent: #5AAEFF;  --accent-hover: #7CC0FF;  --accent-pressed: #9CCEFF;
  --accent-soft: #10243D;  --accent-soft-fg: #7CC0FF;  --accent-fg: #0B0B0D;
  --focus: #7CC0FF;

  --success: #4CC36E;  --success-soft: #12301C;  --success-solid: #2FA352;  --success-solid-fg: #0B0B0D;
  --warning: #FFB340;  --warning-soft: #3A2606;  --warning-solid: #FFB340;  --warning-solid-fg: #0B0B0D;
  --danger:  #FF6B6B;  --danger-soft:  #3B1316;  --danger-solid:  #E5484D;  --danger-solid-fg:  #FFFFFF;
  --info:    #5CC8E6;  --info-soft:    #0F2F38;  --info-solid:    #2B9DBB;  --info-solid-fg:    #0B0B0D;

  --band-0-bg: #2C2C2E; --band-0-fg: #D1D1D6;  --band-1-bg: #16365F; --band-1-fg: #CFE3FF;
  --band-2-bg: #1F5AA8; --band-2-fg: #E3EFFF;  --band-3-bg: #5AAEFF; --band-3-fg: #0B0B0D;
  --band-4-bg: #A5D0FF; --band-4-fg: #0B0B0D;

  --chart-1: #4DA8E8; --chart-2: #F0A92B; --chart-3: #2DC49A; --chart-4: #F07A33;
  --chart-5: #7CC4F2; --chart-6: #E08BB8; --chart-7: #E3CF3A; --chart-8: #8E8E93;
  --chart-grid: rgb(255 255 255 / 0.10);

  /* Dark elevation = lighter surface + hairline; shadows only add depth under overlays */
  --sh-xs: none;
  --sh-sm: 0 0 0 1px rgb(255 255 255 / 0.08);
  --sh-md: 0 0 0 1px rgb(255 255 255 / 0.10), 0 8px 24px -8px rgb(0 0 0 / 0.60);
  --sh-lg: 0 0 0 1px rgb(255 255 255 / 0.10), 0 16px 40px -12px rgb(0 0 0 / 0.70);
  --sh-xl: 0 0 0 1px rgb(255 255 255 / 0.12), 0 32px 80px -20px rgb(0 0 0 / 0.80);
  --sh-inset: inset 0 0 0 1px rgb(255 255 255 / 0.08);

  --material-regular: rgb(28 28 30 / 0.72);
  --material-thick:   rgb(28 28 30 / 0.88);
  --material-line:    rgb(255 255 255 / 0.10);
}

/* Exam-shell themes (set on the exam root: <div data-exam-theme="soft">) */
[data-exam-theme="soft"]     { --canvas: #FAF6EC; --surface: #FFFDF6; --surface-2: #F1EBDA; --fg: #2B2A27; --fg-2: #4F4C45; --line: rgb(43 42 39 / 0.14); }
[data-exam-theme="contrast"] { --canvas: #000000; --surface: #000000; --surface-2: #14140A; --fg: #FFE14D; --fg-2: #FFE14D; --fg-3: #E6CB45; --line: #FFE14D; --accent: #FFE14D; --accent-fg: #000000; --focus: #FFFFFF; }

/* ---------- 4. Bridge variables → Tailwind utilities ---------- */
@theme inline {
  --color-canvas: var(--canvas);   --color-surface: var(--surface);
  --color-surface-2: var(--surface-2);   --color-surface-3: var(--surface-3);
  --color-scrim: var(--scrim);
  --color-fg: var(--fg);   --color-fg-2: var(--fg-2);   --color-fg-3: var(--fg-3);   --color-fg-4: var(--fg-4);
  --color-line: var(--line);   --color-line-strong: var(--line-strong);   --color-control: var(--control-border);

  --color-accent: var(--accent);   --color-accent-hover: var(--accent-hover);   --color-accent-pressed: var(--accent-pressed);
  --color-accent-soft: var(--accent-soft);   --color-accent-soft-fg: var(--accent-soft-fg);   --color-accent-fg: var(--accent-fg);
  --color-focus: var(--focus);

  --color-success: var(--success);   --color-success-soft: var(--success-soft);   --color-success-solid: var(--success-solid);   --color-success-solid-fg: var(--success-solid-fg);
  --color-warning: var(--warning);   --color-warning-soft: var(--warning-soft);   --color-warning-solid: var(--warning-solid);   --color-warning-solid-fg: var(--warning-solid-fg);
  --color-danger:  var(--danger);    --color-danger-soft:  var(--danger-soft);    --color-danger-solid:  var(--danger-solid);    --color-danger-solid-fg:  var(--danger-solid-fg);
  --color-info:    var(--info);      --color-info-soft:    var(--info-soft);      --color-info-solid:    var(--info-solid);      --color-info-solid-fg:    var(--info-solid-fg);

  --color-band-0: var(--band-0-bg);  --color-band-0-fg: var(--band-0-fg);
  --color-band-1: var(--band-1-bg);  --color-band-1-fg: var(--band-1-fg);
  --color-band-2: var(--band-2-bg);  --color-band-2-fg: var(--band-2-fg);
  --color-band-3: var(--band-3-bg);  --color-band-3-fg: var(--band-3-fg);
  --color-band-4: var(--band-4-bg);  --color-band-4-fg: var(--band-4-fg);

  --color-chart-1: var(--chart-1); --color-chart-2: var(--chart-2); --color-chart-3: var(--chart-3); --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5); --color-chart-6: var(--chart-6); --color-chart-7: var(--chart-7); --color-chart-8: var(--chart-8);
  --color-chart-grid: var(--chart-grid);

  --shadow-xs: var(--sh-xs);  --shadow-sm: var(--sh-sm);  --shadow-md: var(--sh-md);
  --shadow-lg: var(--sh-lg);  --shadow-xl: var(--sh-xl);  --shadow-inset: var(--sh-inset);
}

/* ---------- 5. Base layer ---------- */
@layer base {
  html { font-family: var(--font-sans); background: var(--canvas); color: var(--fg);
         -webkit-text-size-adjust: 100%; text-rendering: optimizeLegibility;
         -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
         font-optical-sizing: auto; scroll-padding-top: 5rem; /* sticky nav never hides focus (WCAG 2.4.11) */ }
  body { font-size: var(--text-body); line-height: var(--text-body--line-height); letter-spacing: var(--text-body--letter-spacing); }
  h1, h2, h3 { text-wrap: balance; }  p, li { text-wrap: pretty; }
  ::selection { background: var(--accent-soft); color: var(--fg); }
  .tabular, [data-tabular] { font-variant-numeric: tabular-nums lining-nums; font-feature-settings: "tnum" 1; }

  /* Focus ring: two-tone so it is visible on any surface (canvas gap + focus colour) */
  :where(a, button, input, select, textarea, summary, [tabindex], [role="button"], [role="tab"], [role="option"]):focus-visible {
    outline: 2px solid var(--focus); outline-offset: 2px; border-radius: inherit;
    box-shadow: 0 0 0 2px var(--canvas);
  }
  :where(input, textarea, select):focus-visible { outline-offset: 0; }

  /* Bangla script adjustments (see §2.2.2) */
  :lang(bn) { font-size-adjust: none; }
  :lang(bn) body { font-size: calc(var(--text-body) * var(--bn-size)); }
  :lang(bn) em, :lang(bn) i { font-style: normal; font-weight: 600; }   /* no italics in Bangla */
  :lang(bn) h1, :lang(bn) h2, :lang(bn) h3 { font-weight: 600; }        /* 700 clogs conjuncts */
  :lang(bn) .line-clamp-1, :lang(bn) .line-clamp-2, :lang(bn) .line-clamp-3 { padding-block: 0.1em; } /* avoid clipping matras */

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important;
                              transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
  }
  @media (forced-colors: active) { :focus-visible { outline: 2px solid Highlight; } }
}

/* ---------- 6. Utilities ---------- */
@utility material-regular {
  background: var(--material-regular);
  -webkit-backdrop-filter: saturate(180%) blur(20px); backdrop-filter: saturate(180%) blur(20px);
  box-shadow: 0 1px 0 var(--material-line);
  @media (prefers-reduced-transparency: reduce) { background: var(--surface); -webkit-backdrop-filter: none; backdrop-filter: none; }
  @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) { background: var(--material-thick); }
}
@utility material-thick {
  background: var(--material-thick);
  -webkit-backdrop-filter: saturate(180%) blur(30px); backdrop-filter: saturate(180%) blur(30px);
  @media (prefers-reduced-transparency: reduce) { background: var(--surface); -webkit-backdrop-filter: none; backdrop-filter: none; }
}
@utility hit-44 { /* expands the tap area to 44×44 on coarse pointers without changing visual size */
  position: relative;
  @media (pointer: coarse) { &::after { content: ""; position: absolute; inset: 50% auto auto 50%; min-width: 44px; min-height: 44px; width: 100%; height: 100%; transform: translate(-50%, -50%); } }
}
@utility skeleton {
  background: linear-gradient(90deg, var(--surface-2) 0%, var(--surface-3) 50%, var(--surface-2) 100%);
  background-size: 200% 100%; animation: skeleton 1.4s var(--ease-linear) infinite; border-radius: var(--radius-sm);
  @media (prefers-reduced-motion: reduce) { animation: none; background: var(--surface-2); }
}
@keyframes skeleton { from { background-position: 200% 0; } to { background-position: -200% 0; } }
```

> The `skeleton` shimmer is one of only three sanctioned gradients (§1.1). Dark-mode `--fg-4` (#58585D) is also *decorative/disabled only*.

### 2.2 Typography

#### 2.2.1 Font stacks and loading

```
--font-sans: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display",
             Inter (self-hosted), "Noto Sans Bengali", "Hind Siliguri", system-ui, sans-serif
```

- **SF Pro is not licensed for webfont embedding.** It is used **only** when already installed — i.e. through the system keywords `-apple-system` / `BlinkMacSystemFont` on Apple devices. Never ship SF Pro `.woff2` files, never reference them in `@font-face`. (Apple's licence forbids it; note `"SF Pro Text"` / `"SF Pro Display"` named entries are included for macOS/iOS users who have them installed, and are harmless elsewhere.)
- **Inter Variable** is the cross-platform twin (Windows/Android — most of the Bangladeshi audience). Self-host via `next/font/google` (downloaded at build time, served from our origin, no Google request at runtime) with the `opsz` axis so display sizes get tighter shapes:

```ts
// apps/web/app/fonts.ts
import { Inter, Noto_Sans_Bengali, Hind_Siliguri, JetBrains_Mono } from "next/font/google";

export const inter = Inter({
  subsets: ["latin", "latin-ext"], variable: "--font-inter",
  axes: ["opsz"], display: "swap", adjustFontFallback: true,   // size-adjust fallback → no CLS
});
export const notoBengali = Noto_Sans_Bengali({
  subsets: ["bengali"], variable: "--font-bn", weight: ["400", "500", "600", "700"],
  display: "swap", adjustFontFallback: false, preload: false,    // only preloaded on the bn layout (see below)
});
export const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali"], variable: "--font-bn-alt", weight: ["400", "500", "600"],
  display: "swap", preload: false,
});
export const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-next", display: "swap", preload: false });
// In app/[locale]/layout.tsx: <html lang={locale} className={cn(inter.variable, notoBengali.variable, hindSiliguri.variable, jetbrainsMono.variable)}>
// For locale === "bn" additionally <link rel="preload"> the Noto Bengali 400 + 600 subsets (via notoBengali.preload = true in a bn-only fonts module).
```

- Font features: `font-optical-sizing: auto`; numerals everywhere in data UI use `font-variant-numeric: tabular-nums lining-nums` via `.tabular`. Never use a monospace font for timers/scores (looks like a terminal); tabular Inter/SF digits are sufficient. Mono is for code (Shiki) and IDs only.
- Weights used: 400 body, 500 labels/captions, 600 headings/buttons, 700 display & scores. Nothing lighter than 400.
- Minimum rendered size: 12 px (caption). Inputs ≥ 16 px.

#### 2.2.2 Bangla pairing and adjustments

| Aspect | Latin (en) | Bangla (bn) | Why |
|---|---|---|---|
| Primary face | SF Pro (Apple) / Inter | **Noto Sans Bengali** (variable weight, self-hosted); **Hind Siliguri** as secondary fallback | Noto's x-height and stroke contrast match Inter; Hind Siliguri is narrower and used if Noto fails to load or for dense tables on very small screens (`font-family: var(--font-bn-alt)` allowed there). |
| Mixed text | n/a | Latin proper nouns/numerals (IELTS, GRE, bKash, `7.5`) fall through to Inter/SF, Bangla glyphs to Noto: **stack order handles this per glyph** — keep Latin faces before Bangla ones in the stack | |
| Size | per scale | **×1.06** (`--bn-size`): body 18 px; Bengali glyphs look ~8 % smaller at equal size | |
| Line-height | 1.41 (body) | **×1.2**: body ≈ 1.7, headings ≈ 1.3–1.35, prose ≈ 2.0 | Matras (ি, ী, ু, ূ) and ref/য-ফলা stack above/below the line; tight leading collides lines |
| Letter-spacing | −0.01 em body, −0.025 em display | **0** everywhere | Negative tracking tears conjuncts (যুক্তাক্ষর) |
| Weight | up to 700 | **max 600 for headings**, 400/500 body | 700 fills counters in complex conjuncts at < 24 px |
| Emphasis | italic OK | **no italics** (no Bangla italic exists); use 600 weight or accent colour | Synthetic slant is illegible |
| Truncation | `line-clamp-n` | allow `line-clamp` only with `padding-block: 0.1em` (utility included); prefer wrapping to 2 lines and widening containers; never `text-overflow: ellipsis` on a single line for headings | Clipping descenders/matras changes meaning |
| Button / chip height | 40 / 28 | **44 / 32** (+4 px vertical) | Taller glyph envelope |
| Uppercase / small-caps | eyebrow labels may be uppercase | **never** (no case in Bangla); eyebrow = 13 px 600 `fg-3`, no transform | |
| Numerals | Latin digits | **Latin digits by default** in scores, prices, timers, exam shell, tables; optional user preference “বাংলা সংখ্যা” converts *prose/UI counts only* via `Intl.NumberFormat('bn-BD', {numberingSystem:'beng'})`; band scores, question numbers and exam content never convert | Official IELTS/GRE use Latin digits; avoids misreads of ৩/৪/৭ at speed |

Tested Bangla stress strings (use in Storybook-less `/design` route): `প্রতিযোগিতামূলক পরীক্ষার প্রস্তুতি`, `ক্ষুদ্র ঋণ ও বিনিয়োগ`, `স্বতঃস্ফূর্ত`, `শ্রেষ্ঠত্ব`, `দ্বিতীয় অধিবেশন`.

#### 2.2.3 Type scale (Apple naming)

Tailwind class = `text-<name>` (size + line-height + tracking + weight in one utility, because `--text-<name>--*` sub-properties are set above).

| Token (`text-*`) | px / rem | Line-height | Weight | Tracking | Use |
|---|---|---|---|---|---|
| `display` | 40 → 56 fluid / 2.5 → 3.5 | 1.07 (≈ 60 at 56) | 700 | −0.025 em | Marketing hero H1 only (one per page) |
| `score` | 72 / 4.5 | 1.0 | 700 | −0.03 em | Band/score numerals on results; always `.tabular` |
| `title1` | 40 / 2.5 | 1.10 (44) | 600 | −0.022 em | Page H1 in app (“Good evening, Nusrat”), section heroes |
| `title2` | 28 / 1.75 | 1.286 (36) | 600 | −0.019 em | Section H2, dialog titles in marketing |
| `title3` | 22 / 1.375 | 1.273 (28) | 600 | −0.014 em | Card titles (large), sidebar group headers on marketing, sheet titles |
| `headline` | 17 / 1.0625 | 1.412 (24) | 600 | −0.010 em | Row titles, card titles (default), table headers, buttons (lg) |
| `body` | 17 / 1.0625 | 1.412 (24) | 400 | −0.010 em | Default UI text |
| `prose` | 17 / 1.0625 | 1.647 (28) | 400 | −0.008 em | Lesson text, reading passages, articles (max 65 ch) |
| `callout` | 16 / 1 | 1.5 (24) | 400 | −0.006 em | Inputs, selects, buttons (md), menu items |
| `subheadline` | 15 / 0.9375 | 1.333 (20) | 400 | −0.004 em | Secondary text in cards, helper text, dense tables |
| `footnote` | 13 / 0.8125 | 1.538 (20) | 400 | 0 | Legal, timestamps, disclaimers, axis labels |
| `caption` | 12 / 0.75 | 1.333 (16) | 500 | +0.01 em | Badges, chart ticks, keyboard hints. **Floor — nothing smaller.** |

Density: `data-density="compact"` on `(studio)`/`(admin)` layouts swaps component text from `callout/body` → `subheadline`, row heights 48 → 40 px, control heights 40 → 32 px.

Heading hierarchy rule: one `h1` per page; do not skip levels; visual style (`text-title2`) is independent of semantic level.

### 2.3 Type scale

See **§2.2.3** (kept inside Typography so font stacks, Bangla rules and the scale stay together; the CSS tokens are in §2.1).

### 2.4 Spacing

**8-pt grid with 4-pt half-steps.** `--spacing: 4px`. Allowed utilities (anything else fails lint `lumen/spacing-scale`):

| Class suffix | px | Typical use |
|---|---|---|
| `1` | 4 | icon–text gap in badges, tight stacks |
| `2` | 8 | icon–label gap, chip padding-y, list item gaps |
| `3` | 12 | input padding-x, compact card padding |
| `4` | 16 | default card padding (mobile), control gaps |
| `5` | 20 | form field gap (label→input uses `2`; field→field uses `5`) |
| `6` | 24 | card padding (desktop), group gap |
| `8` | 32 | section inner gap, large card padding |
| `10` | 40 | page gutter (desktop) |
| `12` | 48 | gap between page sections in app |
| `16` | 64 | marketing section padding (mobile) |
| `20` | 80 | — |
| `24` | 96 | marketing section padding (desktop) |
| `32` | 128 | hero top/bottom (desktop) |

Banned: `0.5, 1.5, 2.5, 3.5, 7, 9, 11, 13+odd` and arbitrary `[..px]` spacing. Gutters: 16 (<640) / 24 (640–1023) / 32 (1024–1279) / 40 (≥1280). Component heights: 24 (xs tag), 32 (sm), 40 (md, default), 48 (lg, touch/marketing), 56 (exam toolbar buttons).

### 2.5 Radii

| Token | px | Applies to |
|---|---|---|
| `rounded-xs` | 4 | kbd, inline code, tiny tags, exam-shell buttons |
| `rounded-sm` | 8 | 32 px controls, menu items, chips, table cell highlights, tooltips |
| `rounded-md` | 12 | **default** buttons, inputs, selects, segmented control, tabs pill, toasts |
| `rounded-lg` | 16 | cards, popovers, dropdown content, alerts |
| `rounded-xl` | 24 | dialogs, sheets (top corners on mobile), hero screenshot frame |
| `rounded-2xl` | 32 | marketing feature panels only |
| `rounded-full` | ∞ | avatars, switch, progress bars, pills, badges with dot |

Nested rule: `inner radius = outer radius − padding` (a 16 px card with 8 px padding holds a 8 px image). Use `rounded-[inherit]` only for pseudo-element overlays.

### 2.6 Elevation

| Token | Light | Used for |
|---|---|---|
| `shadow-xs` | 1 px 4 % | pressed/segmented thumb, tiny affordances |
| `shadow-sm` | hairline + 1/2 px + 2/8 px, ≤ 5 % | **resting cards**, inputs on `surface-2` |
| `shadow-md` | hairline + 4/8 px + 12/24 px, ≤ 10 % | card hover (marketing course cards), dropdowns, popovers, toasts |
| `shadow-lg` | hairline + 8/16 + 24/48, ≤ 18 % | dialogs, sheets |
| `shadow-xl` | hairline + 16/32 + 40/80, ≤ 28 % | command palette, video-player menus |

Dark mode: `shadow-sm` is just a hairline (surface ladder does the work: canvas < surface < surface-2 < surface-3), `md+` add deep black shadow. A card on hover rises one rung (`sm → md`) over `--duration-base` — **never** translateY more than 2 px.

### 2.7 Blur / material tokens

| Utility | Recipe | Allowed on |
|---|---|---|
| `material-regular` | 72 % canvas + `saturate(180%) blur(20px)` + 1 px bottom hairline | Marketing sticky nav; app top bar once content scrolls under it; mobile bottom tab bar; sheet drag-header |
| `material-thick` | 86 % canvas + `blur(30px)` | Command palette backdrop panel; video-player control bar (dark variant) |
| scrim | `--scrim` (40 %/60 %) | Behind dialogs/sheets; **no blur** on scrim (battery + low-end Android perf) |

Fallbacks are built into the utility: `prefers-reduced-transparency: reduce` or no `backdrop-filter` support ⇒ opaque `surface`. On devices with `navigator.deviceMemory <= 2` add `data-perf="low"` on `<html>` and disable material blur (solid fills). Max one blurred layer in any viewport region.

### 2.8 Motion tokens

| Token | Value | Use |
|---|---|---|
| `duration-fast` | 150 ms | hover/press colour, toggle, tooltip, checkbox |
| `duration-base` | 200 ms | menu/popover open, tab indicator, card lift, toast in |
| `duration-slow` | 300 ms | dialog/sheet open, accordion, page transition |
| `duration-slower` | 500 ms | progress ring fill, score count-up, shared-element morph (max) |
| `ease-standard` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | default for all entering/changing |
| `ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | leaving (exits are ~25 % faster than enters) |
| `ease-emphasized` | `cubic-bezier(0.16, 1, 0.3, 1)` | sheets, shared-element, large-surface motion |

```ts
// packages/ui/src/motion.ts — Motion (motion/react) presets
import type { Transition, Variants } from "motion/react";

export const duration = { fast: 0.15, base: 0.2, slow: 0.3, slower: 0.5 } as const;
export const ease = {
  standard: [0.2, 0.8, 0.2, 1], exit: [0.4, 0, 1, 1], emphasized: [0.16, 1, 0.3, 1],
} as const;

export const spring = {
  /** buttons, toggles, switch thumb, segmented-control indicator */
  snappy:  { type: "spring", stiffness: 520, damping: 40, mass: 0.8 } satisfies Transition,
  /** cards, popovers, tab content, list reorder */
  smooth:  { type: "spring", stiffness: 300, damping: 32, mass: 1 } satisfies Transition,
  /** sheets, drawers, dialogs — no overshoot */
  sheet:   { type: "spring", stiffness: 380, damping: 40, mass: 1 } satisfies Transition,
  /** shared-element transitions, drag release */
  gentle:  { type: "spring", stiffness: 220, damping: 30, mass: 1 } satisfies Transition,
} as const; // damping ratio ≥ 1 for all: nothing bounces. Playfulness is not part of the brand.

export const fadeUp: Variants = {            // list items / cards entering (stagger ≤ 40ms, max 8 items)
  hidden: { opacity: 0, y: 8 },
  show:   { opacity: 1, y: 0, transition: { duration: duration.base, ease: ease.standard } },
};
export const press = { whileTap: { scale: 0.98 }, transition: spring.snappy };
// Root: <MotionConfig reducedMotion="user"> … </MotionConfig>  (transforms disabled, opacity kept)
```

### 2.9 z-index scale

| Token | Value | Layer |
|---|---|---|
| `z-base` / `z-raised` | 0 / 1 | content / hovered card |
| `z-sticky` | 10 | sticky table headers, in-page sub-nav |
| `z-nav` | 20 | marketing nav, app top bar, bottom tab bar, exam header |
| `z-dropdown` | 30 | selects, menus, comboboxes |
| `z-overlay` | 40 | scrim, sheet backdrop |
| `z-modal` | 50 | dialogs, sheets, drawers |
| `z-popover` | 60 | popovers over modals (date picker inside dialog) |
| `z-toast` | 70 | Sonner toasts |
| `z-tooltip` | 80 | tooltips |
| `z-exam-alert` | 90 | “5 minutes remaining”, forced-submit banner — always above everything |

Expose them as utilities in `tokens.css` (Tailwind v4 has no z-index theme namespace): `@utility z-nav { z-index: var(--z-nav); }`, and likewise `z-sticky`, `z-dropdown`, `z-overlay`, `z-modal`, `z-popover`, `z-toast`, `z-tooltip`, `z-exam-alert`. No numeric `z-[9999]`, no `z-50` (lint-banned).

### 2.10 Breakpoints

| Name | min-width | Layout implication |
|---|---|---|
| (base) | 0–359 | 320 px must still work (QA §12): single column, 16 px gutters, no horizontal scroll |
| `xs` | 360 | main design target for phones |
| `sm` | 640 | 2-col grids; sheets become centred dialogs from here |
| `md` | 768 | tablet portrait: sidebar becomes icon rail; 8-col grid |
| `lg` | 1024 | full sidebar; 12-col grid; two-pane lesson player |
| `xl` | 1280 | marketing max container; right rail on dashboards |
| `2xl` | 1440 | studio multi-pane layouts; no change to marketing |

Use container queries (`@container`, Tailwind `@sm:`) for widgets so a card responds to its slot, not the viewport.

### 2.11 Focus ring

2 px solid `--focus`, 2 px offset, plus a 2 px `--canvas` halo (two-tone ⇒ visible on accent buttons, images and dark surfaces). Inside inputs/segmented controls where offset would clip, use `outline-offset: 0` + inset ring. Never remove; `:focus-visible` only (no ring on mouse click). Contrast of ring vs adjacent colours ≥ 3 : 1 (WCAG 2.4.11/1.4.11). In `forced-colors` mode the system `Highlight` colour is used.

---

## 3. Component library spec

All components live in `packages/ui/src/components/<name>/` (shadcn-copied, then restyled). Exports through `packages/ui/src/index.ts`; apps never import `@radix-ui/*` directly. Domain components (question types, timer, band display) live in `packages/ui/src/exam/` and `packages/ui/src/learning/` and take **plain props only** (no data fetching, no `next/*` imports) so they are testable and reusable by the future Expo app's design reference.

### 3.0 Conventions

- **Format** per component: *Start from* (shadcn primitive/block) · *Anatomy* · *Variants* · *States* · *A11y* · *Notes*. “States” always includes keyboard focus, disabled, loading and error where relevant.
- **Variant API:** `class-variance-authority` with `variant`, `size`, `tone` props; no ad-hoc `className` colour overrides in app code (lint rule `lumen/no-colour-override`).
- **Interactive states (all controls):** rest → hover (`@media (hover:hover)` only; +4 % fg tint or one step in `accent-hover`) → pressed (`scale(.98)`, 100 ms, plus darker step) → focus-visible (ring §2.11) → disabled (`opacity .4`, `cursor: not-allowed`, `aria-disabled` rather than `disabled` when a tooltip must explain why) → loading (`aria-busy`, width locked).
- **Sizes:** `sm` 32 · `md` 40 (default) · `lg` 48. On `(pointer: coarse)` controls render at ≥ 44 px visual or use `hit-44`.
- **RTL/logical properties:** use `ms-*/me-*/ps-*/pe-*`, `start/end` — even though we ship LTR only, Arabic/Urdu expansion must not need a rewrite.
- **Sound:** none. No UI sounds anywhere except audio content in Listening/Speaking tests.

### 3.1 Button

*Start from:* shadcn `button` (Radix `Slot` for `asChild`).

| Variant | Look (light) | Use |
|---|---|---|
| `primary` | `accent` fill, `accent-fg` text, no border, no shadow | The one main action per view |
| `secondary` | `surface-3` fill, `fg` text | Alternative actions beside a primary |
| `tinted` | `accent-soft` fill, `accent-soft-fg` text | Medium-emphasis in-card actions (“Resume”) |
| `plain` | transparent, `accent` text, underline on hover (hover devices) | Tertiary / inline “See all” |
| `ghost` | transparent, `fg-2` text, `surface-2` fill on hover | Toolbars, icon buttons, table row actions |
| `destructive` | `danger-solid` fill / `danger-solid-fg` text | Irreversible (delete, cancel order) — always behind a confirm dialog |
| `outline` | `shadow-inset` hairline, `fg` text | On `surface-2` backgrounds or when two equal choices exist |
| `exam` | flat, 4 px radius, 1 px `line-strong`, `surface-2` fill, 56 px high | Exam shell only (Next, Back, Review, Submit) |

Sizes: `sm` 32 px (callout→subheadline text, 12 px x-padding), `md` 40 px (callout 600, 16 px padding), `lg` 48 px (headline 600, 24 px padding), `icon` square 40 (sm 32 / lg 48), radius `rounded-md` (sm → `rounded-sm`). Pills (`rounded-full`) only for marketing CTAs *(optional)*, never mixed with rectangular ones on one page.

```tsx
// packages/ui/src/components/button/button.tsx
const button = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold select-none " +
  "transition-[background-color,color,box-shadow,transform] duration-fast ease-standard " +
  "active:scale-[0.98] disabled:pointer-events-none aria-disabled:opacity-40 aria-disabled:pointer-events-none disabled:opacity-40 " +
  "[&_svg]:size-5 [&_svg]:shrink-0 hit-44",
  {
    variants: {
      variant: {
        primary: "bg-accent text-accent-fg hover:bg-accent-hover active:bg-accent-pressed",
        secondary: "bg-surface-3 text-fg hover:bg-line-strong/60",
        tinted: "bg-accent-soft text-accent-soft-fg hover:bg-accent-soft/70",
        plain: "text-accent px-1 hover:underline underline-offset-4",
        ghost: "text-fg-2 hover:bg-surface-2 hover:text-fg",
        destructive: "bg-danger-solid text-danger-solid-fg",
        outline: "shadow-inset text-fg hover:bg-surface-2",
        exam: "rounded-xs border border-line-strong bg-surface-2 text-fg h-14 px-6 hover:bg-surface-3 active:scale-100",
      },
      size: {
        sm: "h-8 px-3 rounded-sm text-subheadline",
        md: "h-10 px-4 rounded-md text-callout",
        lg: "h-12 px-6 rounded-md text-headline",
        icon: "size-10 rounded-md", "icon-sm": "size-8 rounded-sm", "icon-lg": "size-12 rounded-md",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  });
// Tailwind v4's `hover:` variant already applies only under @media (hover: hover) — keep it that way (do not override `hover` variant).
```

- **States:** loading replaces the leading icon with a 20 px spinner (ring, stroke 2, 700 ms linear), label stays, `aria-busy="true"`, click ignored; width preserved via `min-width` measured before swap. Success flash (optional, `Save` → `Saved`): label cross-fades with a check for 1.2 s then reverts.
- **A11y:** icon-only buttons require `aria-label` (lint). Toggle buttons use `aria-pressed`. Never use `<div onClick>`. Link-styled buttons that navigate are `<a>`/`Link`.
- **Don'ts:** gradient fills, glow, uppercase labels, trailing arrows on every CTA (only on forward navigation links like “Start free test →”, using Lucide `arrow-right` 20 px).

### 3.2 Input, Textarea, Select, Combobox

*Start from:* shadcn `input`, `textarea`, `select` (Radix Select), `combobox` (Popover + Command/cmdk), `form` (react-hook-form), `label`, `field` helpers.

- **Anatomy:** label (subheadline 500, above) · optional hint (footnote `fg-3`, below label) · control · helper/error line (footnote; reserved 20 px) · optional leading icon (20 px, `fg-3`) / trailing affordance (clear, show/hide).
- **Control:** 40 px (md) / 48 px (lg, auth + checkout), `callout` 16 px, `surface` fill, `shadow-inset` using `--control-border` (3.3 : 1), radius `rounded-md`. Focus: border becomes `accent` 2 px inset + ring. Textarea min 96 px, auto-grow.
- **Variants:** `default`, `search` (leading magnifier, clear button, `type=search`), `prefix` (country code “+880” segment — phone), `money` (৳ / $ prefix; `inputmode=decimal`).
- **States:** rest, hover (border `fg-3`), focus, filled, disabled (`surface-2`, no border), readonly (no border, selectable), error (border `danger`, icon `circle-alert`, message `danger`, `aria-invalid`, `aria-describedby`), success (only for async-validated fields like coupon/phone: check icon, `success`). Validation runs on blur + on submit, **never while typing for the first time**.
- **Select:** Radix Select on desktop, native `<select>` on touch (`@media (pointer: coarse)`) for better mobile pickers; list max-height 320; option 40 px; check icon on selected.
- **Combobox:** async options (university, institution, city), Bangla + English search, `aria-autocomplete="list"`, keyboard: ↓/↑ move, Enter select, Esc close, type-ahead. “Create ‘X’” as last option only where product allows.
- **Phone input (BD):** `+880` segment locked by default; accepts `01XXXXXXXXX` and `+8801…`; normalise to E.164; show operator-agnostic hint “11-digit mobile number, e.g. 01712 345678”.
- **A11y:** every input has a visible `<label>`; placeholder is *example*, never the label; autocomplete tokens (`email`, `tel`, `one-time-code`, `given-name`); error text associated; don't disable paste.

### 3.3 OTP input

*Start from:* `input-otp` (shadcn `input-otp`).
- **Anatomy:** 6 cells (email OTP) or 6/4 cells (SMS) each 48×56 px, `rounded-md`, `callout`→`title2` digit, gap 8 px, optional separator after cell 3; below: “Resend code in 0:42” (tabular, `footnote`) then button `plain` when expired; “Use a different number” link.
- **Behaviour:** single hidden `<input autocomplete="one-time-code" inputmode="numeric" pattern="\d*">` so SMS auto-fill and paste of the full code work; auto-submit on 6th digit; shake **not** used — error = border `danger` + message “That code isn't right. 2 attempts left.” (live region). Resend countdown from server `retryAfter`; Turnstile invisible challenge before resend.
- **A11y:** `role="group"` + `aria-label="6-digit code"`, caret visible, cells not individual tab stops.

### 3.4 Card

*Start from:* shadcn `card`.
- **Anatomy:** optional media (16:9 or 4:3, top, inherits radius) · header (eyebrow `footnote fg-3`, title `headline`/`title3`, optional action top-end) · body · footer (meta row or actions, separated by whitespace not a rule).
- **Variants:** `flat` (`surface`, `shadow-sm`) · `inset` (`surface-2`, no shadow — used inside other cards and on dashboards’ secondary widgets) · `interactive` (whole card is a link; hover lifts `sm → md`, never translate > 2 px; pressed `scale .99`) · `outline` (hairline only, for tables-in-cards) · `highlight` (`accent-soft`, one per page maximum, e.g. “Next best action”).
- Padding 16 mobile / 24 desktop (32 for marketing feature panels). Radius `rounded-lg`.
- **A11y:** an interactive card has exactly one link/focus target (stretched link pattern: `a::after {inset:0}`), nested buttons stay independently focusable and above (`relative z-raised`).

### 3.5 Sheet and Drawer

*Start from:* shadcn `sheet` (Radix Dialog) for side panels; **Vaul** `drawer` for mobile bottom sheets.
- **Desktop/tablet (≥ sm):** side sheet 400 / 480 / 640 px, from end edge, `rounded-s-xl`, `shadow-lg`, scrim 40 %. Use for: filters, notification centre, course outline in player, lesson notes, checkout cart, instructor quick-edit.
- **Mobile (< sm):** bottom sheet via Vaul with grabber (36×5 px `fg-4`, centered, 8 px top), detents `[0.5, 0.9]` or content height, `rounded-t-xl`, safe-area padding, drag-to-dismiss with velocity; header with title + `Done` plain button.
- **Material:** sheet header may use `material-regular` when content scrolls beneath; body is opaque `surface`.
- **Motion:** `spring.sheet`; reduced motion → 150 ms fade only.
- **A11y:** focus trapped, `Esc` closes, restores focus to trigger, `aria-labelledby` title; background `inert`; drag handle not the only way to close (explicit close button).

### 3.6 Dialog

*Start from:* shadcn `dialog` / `alert-dialog` (destructive confirmations).
- 480 px default, 640 px wide (forms), max-height 85 vh, content scrolls inside; header (`title3`) · body (`body`, fg-2) · footer buttons end-aligned (primary last in LTR). Radius `rounded-xl`, `shadow-lg`.
- **Rules:** use dialogs for confirmation and short forms only (≤ 4 fields). Long forms → page or sheet. **On mobile every dialog becomes a bottom sheet** (same content component, container switches at `sm`).
- **Alert dialog (destructive):** title states the consequence (“Delete this course?”), body states what is lost, button text repeats the verb (“Delete course”), default focus on **Cancel**.
- **Exam shell:** dialogs are modal, centred, no blur, no animation beyond 100 ms fade; used for “Submit section?” and “Leave test?”.

### 3.7 Tabs

*Start from:* shadcn `tabs`.
- **Anatomy:** tablist with 2 px `accent` underline indicator (sliding via `layoutId`, `spring.snappy`), tabs `subheadline`/`callout` 500, active `fg` + 600, inactive `fg-2`. Height 40. Hairline `line` under the list. Panels have `tabindex=0` if they contain no focusable child.
- **Overflow:** horizontal scroll with edge-fade mask, active tab auto-scrolled into view; never wrap to two rows.
- **Variants:** `underline` (default), `pill` (in toolbars: `surface-2` track with `surface` active thumb — this is the Segmented control, use that component instead).
- **A11y:** arrow keys move + activate (automatic activation, except in studio where tabs trigger heavy panels → manual), Home/End, `aria-controls`; tab counts are text inside the tab (“Reviews 128”).

### 3.8 Segmented control (Apple-style)

*Start from:* Radix `ToggleGroup` (type="single") styled; or `tabs` when it switches panels.
- **Anatomy:** track `surface-3`, `rounded-md`, 2 px inner padding, height 32/40; thumb `surface` + `shadow-xs` + `rounded-sm` slides between options (`layoutId`, `spring.snappy`); labels `subheadline` 500; equal-width segments by default. 2–4 options only (more → Select or Tabs).
- **Use:** billing period (1 / 3 / 6 / 12 months), currency (BDT / USD), chart range (7D / 30D / 90D), Academic / General Training, Listening speed. Must show a value-label for each (no icon-only).
- **A11y:** `role="radiogroup"`/`radio` semantics via ToggleGroup, arrow keys cycle, selected has `aria-checked`. Thumb colour change is not the sole cue: selected label is 600 weight.

### 3.9 Toast

*Start from:* **Sonner** via shadcn `sonner`.
- **Anatomy:** 360 px max, `surface` + `shadow-md`, `rounded-lg`, 16 px padding; leading 20 px status icon (tone colour), title (`subheadline` 600), optional description (`footnote fg-2`), optional single action (`plain` button), close on hover/focus. Position: bottom-center on mobile (above tab bar, safe-area), bottom-end on desktop. Duration 4 s (6 s with action; errors persist until dismissed).
- **Rules:** toasts confirm *completed* async actions (“Saved”, “Receipt sent to nusrat@…”). Errors that need a decision use inline alerts or dialogs, not toasts. Max 3 stacked. Never toast inside the exam shell except autosave failure (persistent banner instead — see 3.28).
- **A11y:** container `aria-live="polite"` (errors `assertive`), pause on hover/focus, `Esc` dismisses focused toast, action reachable by keyboard (F6 region jump documented).

### 3.10 Tooltip

*Start from:* shadcn `tooltip` (Radix).
- `rounded-sm`, `fg` background with `canvas` text (inverted), `caption`/`footnote`, max 240 px, delay 500 ms open / 0 close, 6 px offset. Shows on hover **and keyboard focus**. Content is supplementary (icon-button names, truncated text, keyboard shortcut chip `⌘K`). Never the only place for essential info (touch has no hover): use popover or inline text.
- **A11y:** trigger gets `aria-describedby`; icon buttons still require `aria-label`.

### 3.11 Progress — linear and ring

*Start from:* shadcn `progress` (Radix) for linear; custom SVG for ring.
- **Linear:** height 4 px (inline in lesson rows), 8 px (course header). Track `surface-3`, fill `accent`, `rounded-full`. Completed → fill `success`. Fill animates `duration-slower` ease-standard (on mount only from previous value, not from 0 on every render). Label to the side as tabular text (“62%”), not inside the bar.
- **Ring:** 48 / 72 / 120 px, stroke 6 / 8 / 10, round caps, rotates −90°, centre label tabular (`headline` / `title2`), track `surface-3`. Used for course completion, daily goal, section time elapsed. Optional segmented ring (4 arcs) for IELTS skill coverage with gaps of 4°.
- **Indeterminate:** only in upload/transcription steps; 1.2 s sweep; reduced-motion → static striped at 40 %.
- **A11y:** `role="progressbar"` with `aria-valuenow/min/max` and `aria-label` (“Course progress”); ring has `<title>`; announce milestones only (25/50/75/100 %) politely, not every tick.

### 3.12 Badge

*Start from:* shadcn `badge`.
- Height 24 (`caption` 500, 8 px x-padding, `rounded-full` for status, `rounded-xs` for count/tag). Variants: `neutral` (`surface-3`/`fg-2`), `accent`, `success`, `warning`, `danger`, `info` (each *-soft bg + tone fg + optional 8 px dot), `outline`, `band` (uses band tokens). Count badge (notifications) is a 18 px `danger-solid` circle with `caption` tabular (cap at 9+).
- **Use:** status (Published/Draft/In review), plan (Pass · 3 months), “Free”, “New”, level (Beginner). One badge per row/card unless they encode different dimensions.
- **A11y:** text always present (colour is not the cue); decorative dots `aria-hidden`.

### 3.13 Avatar

*Start from:* shadcn `avatar` (Radix).
- Sizes 24 / 32 / 40 / 56 / 96; circle; image `object-cover` with `loading=lazy`; fallback = initials on `surface-3` using `fg-2` (for Bangla names use the first Bangla letter cluster: `Intl.Segmenter` grapheme, not `[0]`). Presence/role dot only in studio. Stack (max 3 + “+12”) with 2 px `surface` ring overlap −8 px.
- Instructor avatars are real photos; no illustrated avatars for staff. Alt text = name; decorative when name displayed beside it.

### 3.14 Table and DataTable

*Start from:* shadcn `table` + `data-table` recipe (**TanStack Table v8**) + shadcn `dashboard-01` block’s table.
- **Anatomy:** toolbar (search · filter chips · column visibility · density toggle · export) · sticky header (`surface-2`, `footnote` 600 `fg-3`, bottom hairline) · rows (48 px default / 40 compact) · cell types (text, numeric right-aligned tabular, status badge, avatar+name, progress, relative date with absolute in tooltip, row actions `ghost icon` ⋯) · footer (selected count, pagination “1–25 of 1,284”, page-size select).
- **Behaviour:** server-side pagination/sort/filter via URL search params (shareable); keyboard row navigation (↑/↓), `Space` select, `Enter` open; multi-select shows a floating bulk-action bar (bottom, `shadow-lg`) replacing the toolbar; column resize optional; virtualised > 200 visible rows.
- **Zebra:** none; row separation = hairline `line`; hover `surface-2` (hover devices); selected `accent-soft`.
- **States:** loading = 8 skeleton rows with same column widths; empty = inline empty state (3.16) with clear-filters action; error = row-level message + retry; partial = “Showing cached data from 14:02 · Refresh”.
- **Mobile:** below `md` tables become **card lists** (each row = a 2–3-line card with primary cell as title, 2 key metrics, status badge, chevron). Never horizontal-scroll a whole data table on phones except in studio read-only “wide view” behind an explicit button.
- **A11y:** real `<table>`, `<th scope>`, `aria-sort`, caption (visually hidden), selection checkboxes labelled with the row name, focus management after sort/filter (announce “25 results” politely).

### 3.15 Command palette (⌘K / Ctrl K)

*Start from:* **cmdk** via shadcn `command` in a `dialog`.
- 640 px wide, top-third positioned, `material-thick` panel, `rounded-xl`, `shadow-xl`, input 56 px `title3`-sized text, results grouped (Pages, Courses, Lessons, Tests, Actions, Help) with 48 px rows (icon, title, secondary path, shortcut chip). Role-aware: staff see admin/studio actions; students see “Resume ‘IELTS Reading’”, “Start Mock Test 3”, “Open study planner”, “Switch language”.
- **Search:** debounced 150 ms to `/api/search` (pg_trgm + FTS) + local actions; recent items when empty. Supports Bangla queries and Banglish aliases (stored per entity). Shortcut chips use `kbd` (caption, `surface-3`, `rounded-xs`).
- **Entry points:** ⌘K / Ctrl K, `/` on pages without text input focus, search field in top bar (opens palette on mobile as full-screen sheet).
- **A11y:** combobox pattern, `aria-activedescendant`, results count in live region, `Esc` closes and returns focus. Disabled in the exam shell.

### 3.16 Empty state

*Start from:* shadcn `empty` pattern (custom).
- **Anatomy:** 48 px line illustration or 40 px Lucide in `surface-2` rounded-lg tile *(no circles)* · title (`headline`) · one-sentence explanation (`subheadline fg-2`, ≤ 2 lines) · primary action (+ optional secondary `plain`). Left-aligned inside tables/cards; centred only when it fills a whole page area.
- **Types:** first-use (“No mock tests taken yet” → “Take a diagnostic test”), no-results (“No lessons match ‘gerund’” → “Clear search”), no-permission, offline, error. Each has **real, specific copy** from §8; zero “Nothing to see here”.

### 3.17 Skeleton

*Start from:* shadcn `skeleton`, replaced with token-based `skeleton` utility (§2.1).
- Rule: one skeleton component **per real component** (`CourseCardSkeleton`, `LessonRowSkeleton`, `StatTileSkeleton`…) placed next to the real component and sharing its layout constants; line widths vary deterministically (100/86/62 %). Images reserve `aspect-ratio`. Show skeleton after 200 ms delay (avoids flash); keep ≥ 400 ms once shown. `aria-busy="true"` on region, skeleton children `aria-hidden`. Reduced motion: static `surface-2`.

### 3.18 Stat tile

*Start from:* shadcn `dashboard-01` block `section-cards` (restyled), `card`.
- **Anatomy:** label (`footnote fg-3`) · value (`title1`, 600, tabular) · delta chip (▲/▼ icon + “+0.5 band vs last mock”, `success`/`danger` only if direction is good/bad — for neutral metrics use `fg-2`) · optional 64×24 sparkline (single series `chart-1`, no axes) · footnote (“Based on 4 mock tests”).
- Sizes: S (1 col), M (2 col). Whole tile may link to detail. Value formats: band `6.5`, duration `4h 20m`, percentage `82%`; units outside the number in `fg-3` (`subheadline`).
- **States:** loading skeleton, empty (“—” with explanation, never `0` when it means *no data*), stale (clock icon + tooltip).
- **A11y:** one text string per tile via `aria-label`: “Average reading band, 6.5, up 0.5 since last mock”.

### 3.19 Course card

*Start from:* shadcn `card` (interactive).
- **Anatomy (catalogue, vertical):** thumbnail 16:9 (real photo or branded course cover — cover is a flat `surface-2` tile with title typography and a Lucide mark, never a gradient) · exam badge (IELTS / GRE) + level badge · title (`headline`, 2 lines) · instructor row (avatar 24 + name `footnote`) · meta row (lessons count · total hours · tests) · rating (★ replaced by Lucide `star` filled `warning`; value tabular; count `(1,284)` — only if ≥ 10 reviews) · price (BDT first: `৳1,990`, strike-through old price `fg-3` only if real discount; “Free” badge) · footer “Includes 2 mock tests” (`footnote`).
- **Variants:** `vertical` (grid), `horizontal` (search results, 160×90 thumb), `compact` (dashboard rail, no price), `enrolled` (replaces price with progress bar + “Resume · Lesson 14”), `featured` (2-col span, marketing only, screenshot-rich).
- **States:** default, hover (lift + thumbnail scale 1.02 in `duration-slow`, hover-devices only), loading skeleton, “Coming soon” (disabled CTA, “Notify me”), “Enrolled”, “Expired — renew”.
- **A11y:** link name = course title + exam (“IELTS Academic Reading Masterclass, IELTS”); price text includes currency in words for screen readers (`aria-label` “1,990 taka”).

### 3.20 Lesson row

*Start from:* shadcn `accordion` (for module groups) + custom row.
- **Anatomy (48/56 px):** status glyph 20 px (not started: empty ring; in progress: half ring; complete: filled `success` check; locked: `lock` `fg-3`; current: `play` in `accent`) · type icon (video/reading/quiz/practice/mock test) · title (`body`, 1 line → 2 on mobile) · meta (duration `footnote`, tabular) · trailing: “Free preview” badge / resume time / download (offline, P3).
- **Variants:** `outline` (course page: read-only, locked rows show lock + “Preview” if free), `player` (sidebar: current row `accent-soft` bg with 2 px start indicator), `compact`.
- **Module header:** accordion trigger with title, “6 lessons · 48 min · 2 of 6 done”, chevron rotating 90° in `duration-fast`.
- **A11y:** list semantics (`ul/li`), current has `aria-current="step"`, status in text (visually hidden “Completed”), accordion keyboard per APG.

### 3.21 Video player chrome

*Start from:* Bunny Stream embed/HLS via **Vidstack** (`@vidstack/react`, MIT) with fully custom controls *(suggestion; fallback hls.js + custom)*; transcript panel custom.
- **Anatomy:** 16:9 stage (`rounded-xl` outside fullscreen, `bg #000`) · poster · dynamic visible watermark (user email/phone, 12 % opacity, drifts every 60 s, never over captions area) · top scrim gradient (**sanctioned gradient**: black 0→55 %) with title + chapter · bottom control bar (`material-thick`, dark variant, `rounded-lg`, inset 12 px): play/pause, ±10 s, time `0:00 / 12:34` (tabular), seek bar (4→8 px on hover, chapter ticks, buffered, hover thumbnail), volume, captions (CC), speed, quality, theatre, fullscreen · side panel tabs (Outline · Transcript · Notes · Q&A · Resources).
- **Behaviour:** controls auto-hide after 2.5 s of inactivity while playing (never while paused or when focus is inside controls); resume from saved position (toast-free: show “Resumed at 4:12 · Start over” chip 4 s); speeds 0.5/0.75/1/1.25/1.5/1.75/2; captions en/bn with size & background options (persisted); transcript click-to-seek with current-sentence highlight and auto-scroll (pause auto-scroll when user scrolls); notes timestamped (button `N` / shortcut `N`, 1,000 chars); “mark complete” auto at 90 % watched, manually reversible; keyboard map: `Space/K` play, `J/L` ±10 s, `←/→` ±5 s, `↑/↓` volume, `M` mute, `C` captions, `F` fullscreen, `T` theatre, `<`/`>` speed, `0–9` jump to %.
- **States:** loading (poster + skeleton bar), buffering (16 px spinner centre, 300 ms delay), error (“This video couldn't load. Check your connection and try again.” + Retry + “Switch to 360p”), low-bandwidth (auto-cap to 480p with “Data saver on” chip; audio-only toggle for IELTS Listening lessons), token expired (silent refresh, else sign-in dialog), offline.
- **A11y:** all controls are buttons with names; slider uses `role=slider`; captions mandatory on every lesson before publish (studio gate); transcript always available; `prefers-reduced-motion` disables hover-thumbnail animation; PiP supported.

### 3.22 Question: MCQ (single and multi-select)

*Start from:* shadcn `radio-group` / `checkbox-group` restyled as full-width option tiles.
- **Anatomy:** stem (`prose`, with optional image/table/passage reference “Questions 1–5 refer to Passage 1”) · option tiles (min 48 px, 16 px padding, `rounded-md`, `shadow-inset`; letter chip A–E 24 px in `surface-3`; text `body`; selected = `accent-soft` bg + 2 px `accent` inset ring + filled radio/checkbox) · instruction line above (“Choose TWO letters, A–E.” `subheadline 600`) · optional flag toggle (`flag` icon) top-end.
- **Multi-select:** squares (checkbox glyph), counter “2 of 2 selected”, extra selection blocked with inline message — not silent.
- **Practice vs exam mode:** practice shows “Check” → correct/incorrect tile states (`success-soft` + check icon / `danger-soft` + x icon + explanation panel); exam shows none until review. Tile states must also differ by icon, not colour alone.
- **Strikethrough (GRE-style):** right-click/long-press option → strikethrough (`line-through`, `fg-3`) — client-only aid.
- **A11y:** `role=radiogroup`/`group` with `aria-labelledby` stem; keys: ↑/↓ move, Space select, letters A–E select directly (exam shell); hit area is the whole tile.

### 3.23 Question: True/False/Not Given and Yes/No/Not Given

*Start from:* Segmented control (3 equal segments) styled as `exam` variant, or three option tiles on narrow widths.
- **Anatomy:** statement number + statement (`prose`) · 3 choices labelled exactly `TRUE / FALSE / NOT GIVEN` (Reading) and `YES / NO / NOT GIVEN` (Reading opinion tasks) in the exam font; practice mode adds a ‘Why’ expander showing the evidence span highlighted in the passage.
- **Keyboard:** `T`/`F`/`N` (or `Y`/`N`/`G` for YNNG — `N` conflicts; for YNNG use `Y`, `N`, `G`) select; Tab moves to next statement.
- **A11y:** radiogroup per statement; label includes statement number (“Question 7: statement…”).

### 3.24 Question: Gap-fill input (with word-limit hint)

*Start from:* `input` (inline) with custom wrapper.
- **Anatomy:** inline blank within `prose` text (min 120 px, width grows to ≤ 240 px; 32 px high, bottom-border style `border-b-2 control`, `surface-2` fill; question number shown as small tabular `caption` chip left of the blank) · **word-limit hint** shown once above the group: “Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.” (`subheadline 600`) and per-blank live counter only in practice (“2/2 words”, turns `danger` when exceeded; **exam mode never blocks typing**, mirrors real test where over-limit is simply wrong).
- **Behaviour:** `autocomplete=off autocapitalize=off autocorrect=off spellcheck=false`; trim on blur; accepted-answer matching is server-side (case-insensitive, listed variants, British/American spelling lists); table / note / summary / flowchart / sentence-completion layouts all reuse the blank; Tab/Enter moves to next blank.
- **A11y:** each blank has `aria-label` “Answer to question 14”; the surrounding sentence is not duplicated in the label; hint linked with `aria-describedby`.

### 3.25 Question: Matching (drag-and-drop **with keyboard alternative**)

*Start from:* **dnd-kit** (`@dnd-kit/core` + `sortable`, MIT) — it has keyboard + screen-reader announcements built in.
- **Layouts:** (a) *Match headings to paragraphs* (list of headings in a bank, drop slots at paragraph labels), (b) *Match features to options* (matrix), (c) *Map/diagram labelling* (labels dragged to hotspots), (d) GRE-style *select-in-passage* (click sentence).
- **Interaction:** drag chip → slot; chips return to bank when dropped outside; slot shows chip with `x` remove; chip height 40, `rounded-md`, `surface` + `shadow-sm` while dragging (`shadow-md`, scale 1.02).
- **Keyboard alternative (mandatory, default for non-pointer users):** every slot has a **Select** control (a native-looking `Select` “Choose heading… i–x”) so matching can be answered without dragging; dnd-kit KeyboardSensor also supported (Space pick up, arrows move, Space drop, Esc cancel) with live announcements (“Picked up heading iv. Over paragraph C.”). On touch devices default to the **tap-to-assign** pattern (tap chip, tap slot) rather than long-press drag.
- **A11y:** announcements via dnd-kit `accessibility.announcements` customised en/bn; used chips marked “used” (still reusable if the question allows).

### 3.26 Question: Numeric entry with fraction boxes (GRE)

*Start from:* `input` ×1 or ×2.
- **Single box:** `inputmode="decimal"`, accepts `-`, digits, `.`, max 14 chars, no `e`. **Fraction mode:** two stacked boxes (numerator over denominator, 72 px wide each, a 2 px fraction bar between), `inputmode="numeric"`; the answer is rejected if denominator is `0` with inline message. Label above: “Enter your answer as an integer or decimal” / “as a fraction — you do not need to reduce it.”
- **Rendering:** KaTeX for the stem; options to switch on-screen calculator (3.28 toolbar). Keyboard: Tab between numerator/denominator; typing `/` in single-box mode is not allowed (use fraction mode when the question says so).
- **A11y:** group `role=group` “Fraction answer”, inputs “Numerator”, “Denominator”; math has MathML via KaTeX `output: htmlAndMathml`.

### 3.27 Timer

*Start from:* custom (display) + server-authoritative clock (D6).
- **Anatomy:** `0:42:15` or `42:15` (tabular, `headline` 600 in exam header; `title2` in dashboard test cards), clock glyph optional, **hide/show toggle** (“Hide time” — as real tests allow; when hidden show a small ring only; still announced at thresholds). Time source: server `ends_at` minus synced offset (NTP-style sample at start and every 60 s); display drift ≤ 1 s; never `setInterval` accumulation — compute from `performance.now()` + offset on `requestAnimationFrame` / 1 s tick.
- **States:** normal (`fg`) · 10 min left (`warning` text + icon, once polite announcement) · 5 min (`warning`, bold, banner at `z-exam-alert`: “5 minutes remaining”) · 1 min (`danger`, announcement) · 0 (auto-submit sequence “Time is up — saving your answers…” then results screen). Colour changes are paired with the icon and text (not colour only). **No pulsing, flashing or sound.**
- **A11y:** visual clock is `aria-hidden`; a separate visually-hidden `role="timer"` region (not live) holds the time for on-demand reading; **`aria-live="polite"` announcements only at 10, 5 and 1 minutes remaining and at the end** (“5 minutes remaining”), plus `assertive` for “Time is up”. Users who hid the timer still get these announcements (can be turned off in accessibility settings but default on). Respects WCAG 2.2.1 Timing Adjustable: accommodation extensions (e.g. +25 %, +50 %) applied server-side per user/attempt and displayed in the start screen.

### 3.28 Question navigator

*Start from:* custom grid (shadcn `toggle-group`/`button` primitives) inside a `sheet` on mobile.
- **Anatomy:** per-section groups (Part 1 / Part 2 / Part 3 or Section 1 / 2 for GRE) · cells 40×40 (36 on compact) `rounded-sm`, number tabular `subheadline 600`; legend row.
- **Cell states** (always icon/shape + colour): *unanswered* (hairline outline, number) · *answered* (filled `surface-3`, number) · *current* (2 px `accent` ring, `accent-soft` fill) · *flagged* (flag corner glyph 10 px top-end, `warning`) · *flagged + answered* (both) · *unseen vs seen-unanswered* (dot in the corner for seen-unanswered). Locked sections show `lock`.
- **IELTS Reading/Listening:** bottom strip (like the computer-based test) with Part tabs and numbers 1–40 paginated by part; clicking a number scrolls/jumps to the question. **GRE:** navigator is the *Review screen* (full-page grid with status table: question #, “Answered / Incomplete / Marked”, filter chips: All · Unanswered · Marked).
- **Autosave status** lives next to it: “Saved” (check) / “Saving…” / “Offline — answers are kept on this device” (`warning` banner, persistent) — never silent failure (D6).
- **A11y:** `nav` with `aria-label="Question navigator"`; cell `aria-label="Question 14, answered, flagged"`; `aria-current="true"` on current; roving tabindex, arrow keys move over the grid, Enter jumps.

### 3.29 Writing editor with word count

*Start from:* plain `<textarea>`-based editor for **exam** (so it behaves like the real test: no formatting, paste allowed as in IELTS CD); **Tiptap** (StarterKit minimal) only in the Practice/Studio rich contexts (feedback annotations).
- **Anatomy:** task prompt panel (left on ≥ lg, collapsible above on mobile; includes chart/graph image with zoom dialog) · editor (right, `prose` 17/28, min 480 px height, `surface` bg, hairline, `rounded-lg`) · footer bar: word count (`Words: 214` tabular, live, counts whitespace-delimited tokens exactly like the IELTS CD; min-words hint “Write at least 150 words” → turns `success` check at ≥ 150; **never block typing past the limit**) · actions: Cut/Copy/Paste (exam toolbar, as in IELTS CD) · autosave status · task switcher (Task 1 / Task 2) · timer share.
- **Behaviour:** autosave each change debounced 1 s + every 10 s (D6); spell-check off in exam (matches real test) and on in practice (toggle); `Tab` inserts nothing and moves focus (a11y), `Esc` then Tab to leave; Bangla keyboards: IME composition handled (don’t count words mid-composition); large paste warning in practice (“Pasted text counts toward your word total”).
- **A11y:** `<label>` = “Your answer for Task 2”, `aria-describedby` word-count + min-words; word count announced politely on request (button “Read word count”), not on every keystroke.

### 3.30 Audio recorder

*Start from:* custom on `MediaRecorder` + WebAudio `AnalyserNode`; Radix-free; use `Button`, `Progress`.
- **Anatomy (Speaking practice):** examiner prompt card (text + optional TTS audio) · record control (64 px circular `danger-solid` button, `mic` glyph in rest: **accent** tinted; recording: stop square) · live level meter (24 bars, `chart-1`, honours reduced-motion by switching to a single level bar) · elapsed/limit timer (tabular, e.g. `0:47 / 2:00`) · prep-time countdown for Part 2 (60 s, “Start speaking” appears automatically) · playback (scrubber, 1× speed) · actions “Re-record” / “Submit for feedback”.
- **Permission flow:** pre-prompt explaining “We only record while the red button is on. Audio is kept for 30 days unless you save it.” → browser prompt → denied state with browser-specific steps and a “Test microphone” step before the real test (mic check screen with live meter, 5 s sample playback).
- **States:** idle · requesting permission · ready · countdown (3-2-1 text, no beeps) · recording · paused (practice only) · uploading (determinate progress; resumable via presigned multipart) · processing (“Transcribing…” skeleton lines) · failed (“We couldn't upload your recording. It's saved on this device — Retry”) · unsupported (iOS < 14.3 / no MediaRecorder: fallback to file upload).
- **A11y:** record button `aria-pressed`, label toggles “Start recording” / “Stop recording”; status changes announced politely (“Recording started”, “Recording stopped, 47 seconds”); visual meter `aria-hidden`; no auto-start without a user gesture.

### 3.31 Chart wrappers

*Start from:* shadcn `chart` (Recharts v2/v3 wrapper with `ChartContainer`, `ChartTooltip`, `ChartLegend`) — theme via `--chart-*` tokens.
Wrappers: `LineTrend`, `BarCompare`, `StackedBand` (skill bars), `Radar` (4 skills; only with ≥ 3 data points and a data table alternative), `Heatmap` (study calendar, CSS grid, not Recharts), `Sparkline`, `ScoreDistribution` (histogram with “you” marker).

**Rules (merge-blocking):**
1. Colours come only from `chart-1…8` in fixed order; semantic meaning is consistent app-wide (Listening chart-1, Reading chart-2, Writing chart-3, Speaking chart-4; Verbal chart-1, Quant chart-2, AWA chart-3).
2. Never rely on colour alone: direct-label lines at their end points, use different markers (circle/square/triangle) or dash patterns for ≥ 2 series.
3. Axis labels `footnote fg-3`; gridlines horizontal only, `chart-grid`, 1 px; no chart junk (no 3D, no gradients under lines **except** a 6 % flat-tint area is allowed for single-series trends), no legends for single series, no rainbow.
4. Numbers in tooltips/ticks are tabular; band axes use 0.5 steps and fixed domain 0–9 (IELTS) or 130–170 (GRE) so charts don't mislead; show a faint target band (user's goal) as a dashed `chart-3` line labelled “Goal 7.0”.
5. Every chart ships with a text summary (“Reading band rose from 5.5 to 6.5 over six mock tests”) and an `Accessible data table` toggle (“View as table”); chart container `role="img"` with `aria-label` summary and the table in a `<details>`.
6. Animation: draw-in once, 500 ms, disabled on reduced motion and for charts re-rendered by filters (instant).
7. Empty chart: skeleton frame with one-line explanation, never a flat zero line. Minimum data: ≥ 2 points for lines.
8. Height presets 120 (sparkline), 240, 320; width 100 % of container (container queries for tick density). Touch: tooltip on tap, with 44 px tap proximity.

### 3.32 Band score display

- **Variants:** `hero` (results page: `text-score` numeral inside a `rounded-xl` band-tier tile 160×160, label “Estimated band” `subheadline`, range “6.0 – 6.5” `footnote`, disclaimer line `footnote fg-3` — §8.4) · `inline` (chip 28 px: `6.5` on tier colour) · `criteria row` (criterion name · mini bar 0–9 with tier colour · tabular value · delta) · `compare` (you vs goal vs average learner).
- **Rules:** the numeral is always visible (colour is supplementary); half-bands printed with one decimal (`6.5`, `7.0`); GRE shows `152` with section scale `130–170`, AWA `4.0` on 0–6; always the word **“Estimated”** adjacent in AI/mock contexts; human-graded results say “Graded by [first name], IELTS-trained instructor”.
- **A11y:** `aria-label` “Estimated overall band 6.5 out of 9, in the range 6.0 to 6.5”.

### 3.33 Streak widget

*Start from:* `stat tile` + custom week strip.
- **Anatomy:** flame is **not used** (cliché). Use Lucide `calendar-check` glyph in `accent-soft` tile · count (`title1` tabular “12”) + “day streak” · 7-day strip (S M T W T F S in Bangla: শনি রবি সোম মঙ্গল বুধ বৃহ শুক্র; week starts Saturday in `bn`, Sunday/Monday in `en` per locale), each day a 24 px circle: done = filled `accent` with check, today = ring, missed = `surface-3` dot, frozen = `info` tint with Lucide `shield` 12 px · footnote “Study 10 minutes today to keep it going” (target configurable).
- **Rules:** streak is opt-out (settings) and **never** shames (copy §8); no loss-aversion pop-ups; streak freeze (max 2) explained in a tooltip/popover; breaking a streak shows a calm “Start a new streak today” empty state; milestone (7/30/100) is a single 300 ms checkmark scale and a toast, no confetti.
- **A11y:** strip is a list with text per day (“Monday: studied”), not an image.

### 3.34 Calendar / study planner

*Start from:* **react-day-picker** (shadcn `calendar`) for date picking; custom week/agenda grid for the planner.
- **Anatomy:** month mini-calendar (date picker, exam-date marker) · week view (7 columns × time-less “day lanes” — planner is *task-based*, not hour-based) · task cards (type icon, title, estimated minutes, status; draggable between days via dnd-kit with keyboard alt “Move to… ⌄” menu) · day header with daily goal ring · side panel “Today” · exam countdown chip (“41 days to IELTS · Sat 19 Dec” — tabular).
- **Views:** Week (default desktop), Agenda (default mobile; vertical list grouped by day), Month (overview heatmap of minutes studied).
- **Behaviour:** auto-generated plan (server) is editable; moved tasks keep a “moved from Tue” footnote; missed tasks roll to “Catch-up” lane, never auto-pile onto tomorrow without consent; locale-aware first day (Saturday in `bn-BD`), Bangla month/day names via `Intl`.
- **A11y:** day-picker’s grid pattern (arrows, PageUp/Down months), `aria-selected`, today marked textually; drag has keyboard alternative; all times with timezone (`Asia/Dhaka` default, shown).

### 3.35 Pricing card

*Start from:* shadcn `card`; marketing “pricing” blocks as reference only. **Every figure is read from the price book (`17-PRICING-MASTER.md`, `amount_minor` rows); no price, allowance or date is typed into a component.**
- **Tier names (D10):** exactly **Free · Core · Plus · Live · Mentor** (the buyable unit is *family × tier*, e.g. “IELTS Academic — Plus”). The word “Complete” is retired and never appears in UI copy. Passes (1 / 3 / 6 / 12 months) sit in a separate band below the tier cards and are never labelled “Pro”.
- **Anatomy (tier card):** tier name (`headline`) · one-line audience (Free “Try it, trust it” · Core “Self-paced, recorded” · Plus “Self-paced + AI coach” · Live “Cohort with a teacher” · Mentor “Premium 1:1”) · price (`title1` tabular; BD: `৳3,990` with small “one-time · 6 months”; secondary USD `≈ $33` only on the BD currency toggle; international regions A/B/C shown in USD from the billing-country region, D12 C16/C25) · primary CTA · divider-less included list (6–8 lines, Lucide `check` 16 px `accent`, specifics from the matrix: “4 full mock tests”, “10 AI evaluation credits”, “2 human essay reviews”) · footnote (“One-time payment. No auto-renewal in Bangladesh. 7-day no-questions money-back if under 20% used and at most one full mock taken.” per D12 C13b).
- **Mock-count pattern (D10, binding):** a mock count the library cannot yet serve is always written as **“5 mocks now, 10 by 15 Aug 2027”** (date from the price book field `full_mocks_target_date`), never as “10 mocks”. Same pattern for any entitlement that grows. Features that ship later than launch are shown as “coming” with the phase date (for example audio overviews and mind maps in Plus ship in P2, 34 §14), never as included today.
- **Guarantee line:** Plus shows “Target Promise — free 3-month extension if you meet the conditions” and Mentor “Progress Promise — free re-enrolment if you meet the conditions”, each linking to `/guarantee`. No tier shows “guaranteed band”, “money back if you miss your score” or any cash score guarantee.
- **Variants:** tier row = up to 5 cards on ≥ xl (Free and the three most relevant tiers prominent; Live/Mentor collapse under “Cohort and 1:1 options” on < lg); a `recommended` tier gets `accent` 2 px ring + “Most chosen” badge *only if backed by data*, otherwise no recommendation; mobile = stacked cards with the recommended first; comparison table below for ≥ 4 rows (3.14 style, sticky header). Live cards show next batch start date and seats-left only when real.
- **Rules:** the displayed price equals the checkout price; tax/fees explained; **no fake “was ৳9,999” anchor — a struck-through `compare_at` price renders only when the service returns one (charged ≥ 28 of the last 90 days, D12 C14)**; countdown timers forbidden; during a price test (32 §9) the variant is sticky per user, a user never sees two prices, and no strike-through appears.
- **A11y:** price read as “3,990 taka, one-time, 6 months access”; plan cards are `section` with headings; recommended is text, not just ring.

### 3.36 Checkout summary

- **Anatomy (sticky right column ≥ lg; collapsible top summary on mobile):** product thumbnail + name + term · line items (course, add-ons) · coupon field (`Apply`, inline validation, shows saving as negative line in `success`) · subtotal / discount / VAT or tax (when applicable) / **Total** (`title2` tabular, BDT or USD) · small print: access dates (“Access from today until 19 Feb 2027”), refund policy link, “You will be redirected to bKash/Nagad/card gateway to complete payment” · trust row (SSL icon `lock`, “Payments are processed by SSLCommerz. We don't store card details.”).
- **States:** empty cart, coupon invalid/expired, price changed (banner “Price updated to ৳2,199 — review before paying”), currency switch, processing (button loading “Redirecting to payment…”), failed/cancelled return (`/checkout/return?status=failed` with order id, “Try again” and “Choose another method”), success (receipt). Server recomputes prices; client number is display-only.
- **A11y:** totals in a `dl`; live region for coupon result; guard double-submit.

### 3.37 Payment method selector (bKash / Nagad / Rocket / cards)

*Start from:* shadcn `radio-group` as large option tiles.
- **Anatomy:** tile (min 64 px) with **official logo marks supplied by the gateway’s brand kit** (SVG, 28 px tall, monochrome-safe on dark; do not redraw logos), name (`headline`), subtext (“Pay with your bKash account”, “Visa, Mastercard, Amex”), selected = `accent` 2 px ring + check. Order by BD preference: **bKash, Nagad, Rocket, Cards (Visa/Mastercard/Amex), Bank/Internet banking**; International users: Card, Apple Pay/Google Pay (when Paddle/Stripe).
- **Behaviour:** payment pages are provider-hosted (D7): selecting only preselects the method on the SSLCommerz session; CTA reads “Pay ৳2,990 with bKash”. A short, honest “What happens next” 3-step line below.
- **A11y:** radiogroup with logo `alt` as brand name; selection text visible.

### 3.38 Notification centre

*Start from:* `popover` (desktop bell, 400×520) / full `sheet` (mobile) + shadcn `scroll-area`.
- **Anatomy:** header (“Notifications”, “Mark all read” plain, settings gear) · segmented “All / Unread” · grouped lists (Today / Earlier) · item (type icon in `surface-2` tile, title `subheadline 600`, body `footnote fg-2` ≤ 2 lines, relative time, unread dot `accent` 8 px, action link) · footer “Notification settings”. Item types: AI feedback ready, grader comment, payment/receipt, expiry reminder T-7/T-1, class reminder, Q&A reply, system. Empty: “You're all caught up.”
- **Behaviour:** badge count on bell (max 9+); new items arrive via SSE/polling 30 s, no sound; clicking marks read and navigates. Preferences per channel (in-app, email, SMS for exam-day reminders only).
- **A11y:** bell button name “Notifications, 3 unread”; list `role=feed`/`ul`; new item announced politely once per batch.

### 3.39 Form primitives — Checkbox, Radio, Switch, Slider

*Start from:* shadcn `checkbox`, `radio-group`, `switch`, `slider` (Radix).
- Checkbox/radio 20 px (24 hit target min; label click area full row ≥ 44 px on touch), border `control`, checked `accent` fill with white check (stroke 2). Switch 44×26, thumb 22 `surface` + `shadow-xs`, on = `accent`; `aria-checked`, label left, **switches apply immediately; checkboxes need Save.** Slider track 4 px, thumb 20 + 44 hit, value label tabular; keyboard arrows 1 step / PageUp 10.

### 3.40 Alert / Banner

*Start from:* shadcn `alert`.
- Inline, `rounded-lg`, `*-soft` background, 20 px icon (`info`, `circle-check`, `triangle-alert`, `circle-alert`), title (`subheadline 600`) + body (`subheadline`), optional action `plain`. Page-level banners (maintenance, “Your pass expires in 3 days”) span the app shell content width, dismissible per session where non-critical. `role="status"` for info/success, `role="alert"` for errors.

### 3.41 Ask Lumen panel (AI tutor; 34 §2)

*Start from:* shadcn `sheet` (mobile) and a docked right panel (≥ lg) in the lesson and results views. Route `/app/ask` is the full-screen version.
- **Anatomy:** header (title “Ask {tutor name}”, scope chip showing what it is grounded in: “This lesson” / “My course” / “My mistakes”) · message list (user messages end-aligned `surface-2`, tutor messages start-aligned on `canvas` with **source chips** that jump to the cited lesson timestamp or question) · composer (multi-line, send `Button`, Bangla/English input) · usage line (“8 of 30 questions left today”, shown at ≥ 80% of the daily meter, 34 §1.1) · quick actions (“Give me a hint”, “Check my answer”, “Explain simply”).
- **Behaviour:** streaming text with a reduced-motion-safe caret; every answer ends with source chips or “I couldn't find this in your course” (no uncited claims); a **disabled state with explanation** inside the exam shell (“Not available during a test”). At 100% of the meter: friendly wall stating when it resets; Free/Core only get one non-pushy upgrade line, never shown to under-18 learners.
- **A11y:** `role="log"` with `aria-live="polite"` for new messages; composer labelled; source chips are links with visible text.

### 3.42 Flashcard review card (FSRS; 03 F-VOC-03, 34 §3)

- **Anatomy:** card (`surface`, `rounded-xl`, 3D flip optional but replaced by a cross-fade under `prefers-reduced-motion`) · front (word, optional audio button) · back (meaning, example, mnemonic) · four rating buttons **Again · Hard · Good · Easy** with the next interval shown on each (“10 min · 1 d · 3 d · 7 d”, from the FSRS scheduler) · due counter and daily-new counter · progress ring.
- **Behaviour:** keyboard 1-4 for ratings, Space to flip; offline-capable (queued reviews, “last synced” label); sessions end with a calm summary, never a guilt message.

### 3.43 Score estimate widget (34 §4; 03 F-AIL-03)

- **Anatomy:** large `title1` range (“Estimated band 6.0 – 6.5”) with the word **Estimated** adjacent, per-skill mini bars, trend sparkline (3.31), confidence note (“Based on 3 mocks”), driver list for Plus+ (“Writing task response limits you most”) and a what-if target planner (Plus+).
- **Rules:** never a single un-ranged number for a prediction; never “you will score”; the trademark/estimate notice (§8.5) is present on the card and any share image; Free shows the one-time diagnostic estimate with a locked “live estimate” state for Core+.

### 3.44 Audio overview player (34 §5.1; Plus+, P2)

- **Anatomy:** compact player in the lesson rail and a full player on `/app/listen`: play/pause 44 px, ±15 s, speed (0.75-2×), chapter list, language toggle EN | বাংলা, “Pause and ask” (opens 3.41 at the timestamp), download-for-offline (Plus+), transcript toggle (always available).
- **A11y:** transcript is a first-class alternative; media session controls for background play; captions where video-like visuals are shown. Until P2 the entry point renders as a “Coming soon” card, not a broken control.

### 3.45 Study guide and mind-map viewer (34 §5.2-5.3)

- **Anatomy:** study guide = reading layout (`prose`) with collapsible sections, FAQ accordion and “Make flashcards” action; mind map = accessible tree (keyboard-navigable expandable list) with an optional visual canvas on ≥ lg. Every generated asset carries “Generated by AI and reviewed by our editors” and a “Report an issue” link (03 §9.5).
- **A11y:** the tree view is the primary accessible representation; the canvas is an enhancement with `aria-hidden` and an equivalent text outline.

### 3.46 Promise tracker and refund timeline (`/app/promise`, `/orders/[id]`; 34 §8, GA-021)

- **Promise tracker:** a checklist card per promise (Target Promise for Plus, Progress Promise for Mentor) showing each condition with live status (“Full mocks taken 3 / 4”, “Plan completed 62% / 70%”, “Attendance 86% / 80%”, “Official test within 60 days of access end”, “TRF uploaded”), the remedy in one sentence, a link to `/guarantee`, and a **Claim** button enabled only when the server says eligible. Copy never implies cash back.
- **Refund timeline (order page):** vertical stepper with the states *Requested → Policy check → Approved → Sent to {bKash/Nagad/card} → Completed* (or *Not eligible → Asked support*), each with timestamp; the expected duration note (“7-14 working days for gateway refunds”) comes from the refund policy copy; partial-refund and bundle/pass lines are itemised; certificates revoked on refund are named in the summary.

### 3.47 PWA install and offline states (03 §8.4, 34 §9.1)

- **Install prompt:** non-modal banner after the 2nd visit or first completed lesson, dismissible and remembered; iOS shows “Add to Home Screen” instructions with an illustrated step. **Offline indicator:** persistent slim bar “Offline - changes will sync”; lessons/decks marked “Available offline” with a storage manager (cap 100 MB). **Update toast:** “Update available - Refresh”, never mid-lesson or mid-exam. In the exam shell the offline banner follows the exam rules (§4.4).

### 3.48 Cookie consent banner and preferences (GA-019)

- **First layer:** bottom sheet (not a blocking modal) with equal-prominence **Accept all · Reject non-essential · Choose** buttons (same size, same weight, no dark patterns), Bangla and English copy, link to the cookie policy. **Second layer:** categories (Essential - always on; Analytics - PostHog; Marketing - ad pixels, off by default and never offered to under-18 accounts) with switches and a one-line purpose each. Consent stored as a `consent_record`; a persistent “Cookie settings” footer link re-opens the dialog; EU/UK/BD behaviour differs only in defaults (non-essential off everywhere until consent; 26/09 govern the inventory).

---

## 4. Layout system

### 4.1 Grid and max-widths

| Context | Columns | Gutter | Max width | Notes |
|---|---|---|---|---|
| Marketing | 12 (≥ lg), 8 (md), 4 (base) | 24 / 32 | `content` 1120 (text-heavy sections `prose` 680) | Section padding-y 64 (mobile) / 96 (desktop) / 128 (hero) |
| Catalogue / grids | 12 | 24 | `wide` 1280 | Cards 4/3/2/1 per row at xl/lg/sm/base |
| App (dashboard, learn) | 12 (≥ lg), 8 (md), 4 (base) | 24 | `app` 1200 content + optional 320 right rail (≥ xl) | Content centred in remaining space after the sidebar |
| Reading content (lessons, blog, legal) | single | — | `prose` 680 (65ch) | Left aligned; figures may break out to 960 |
| Auth / forms | single | — | `form` 400 (card 440 incl. padding) | Split layout ≥ lg: form left, real-photo panel right (hidden < lg) |
| Studio / admin | 12 fluid | 16 | `studio` 1600 | Dense; `data-density="compact"` |
| Exam shell | fixed regions | 0 | full viewport | See §4.4 |

Vertical rhythm: related items 8, groups 24, sections inside page 48, marketing sections 96. Use `gap-*` on flex/grid, not margins on children. Images: `aspect-ratio` always set; `sizes` attribute always set; AVIF/WebP via `next/image`.

### 4.2 Marketing layout `(marketing)`

```
+----------------------------------------------------------------------------+
| NAV 64px sticky, material-regular, hairline bottom when scrolled           |
| [logo]  Courses  IELTS  GRE  Free tests  Pricing  Institutions    EN|বাংলা  Sign in  [Start free] |
+----------------------------------------------------------------------------+
| HERO  (padding-y 96–128)                                                   |
|  col 1-6: eyebrow, display H1 (left aligned), 1-sentence subhead, 2 CTAs,  |
|           trust line.                                                      |
|  col 7-12 (bleeds to right edge on >=xl): REAL product screenshot,         |
|           rounded-xl, shadow-lg, subtle 1px hairline, no device mockup     |
+----------------------------------------------------------------------------+
| SECTIONS (96 px apart; alternate surface: canvas / surface-2 every 2nd)    |
| ... see §5 Home                                                            |
+----------------------------------------------------------------------------+
| FOOTER surface-2: 4 link columns, locale switch, payment marks, trademark  |
+----------------------------------------------------------------------------+
```

- **Nav:** transparent over the first 8 px of scroll, then `material-regular` + hairline. Items 15 px 500 `fg-2`, active `fg`. Courses opens a **mega panel** (2 columns: IELTS skills / GRE sections, plus “Free tests” promo tile with real screenshot) — panel is opaque `surface` + `shadow-lg`, not glass. Mobile (< lg): logo + menu button → full-height sheet with large (title3) links, locale segmented control and auth buttons at the bottom (safe-area).
- **Language switcher:** Segmented “EN | বাংলা” (no flags) in nav and footer; persists in cookie; `hreflang` + canonical per locale.
- **Announcement bar:** only for real events (exam-season offer, maintenance), 36 px, `surface-3`, dismissible, never on every page by default.
- **Sticky CTA (mobile marketing pages):** bottom bar with price + “Enrol” appears on course landing after hero scrolls out; `material-regular`, safe-area padding.
- **Footer trademark text (verbatim, §8.5)** appears on every marketing page and in test results.

### 4.3 App shell `(learner)` (and the app-shell variants of `(grader)`, `(staff)`, `(org)`)

```
+--------+----------------------------------------------------------------------+
|SIDEBAR | TOP BAR 56px  [≡ on <lg] [breadcrumb / page title]  [⌘K search] [bell] [avatar]|
|264/72  +----------------------------------------------------------------------+
|        |  CONTENT  max 1200, padding 24/32,                    | RIGHT RAIL 320 |
| Home   |  page header (title1 + optional subtitle + actions)   | (>=xl, optional)|
| Learn  |  widgets / lists                                      | schedule, goals |
| Practice|                                                       |                |
| Tests  |                                                       |                |
| Planner|                                                       |                |
| -----  |                                                       |                |
| Settings|                                                      |                |
| [plan] |                                                       |                |
+--------+----------------------------------------------------------------------+
```
(`[bell]` is the Lucide `bell` icon; emoji are never used anywhere in the UI.)

- **Sidebar** (shadcn `sidebar-07` “collapses to icons”): 264 expanded, 72 icon-rail (tooltips on hover/focus), `canvas` background (not a tinted panel), no right border — separation via 1 px `line`; items 40 px, 20 px Lucide icon + `callout` 500 label; active = `accent-soft` bg + `accent-soft-fg` text + icon `accent`; groups with `footnote` 600 `fg-3` headers; bottom block: plan chip (“Pass · 41 days left” → link), help, collapse toggle. State persisted in cookie (no flash). `lg ≥` expanded by default; `md` rail; `< md` hidden (drawer via top-bar button **and** bottom tab bar is the primary nav on phones).
- **Top bar** 56 px: transparent at top; gains `material-regular` + hairline once content scrolls under it. Left: sidebar trigger (< lg), breadcrumb (≥ md, 2 levels max, current in `fg`). Right: search/⌘K button (shows “Search” + `⌘K` chip ≥ md; icon only below), notification bell, avatar menu (profile, language, theme, accessibility, sign out), role switcher if user holds multiple roles (`student` / `instructor` / `org_admin` …) — switching changes sidebar & dashboard, not permissions.
- **Page header:** `title1` (or `title2` in dense pages), subtitle `body fg-2`, actions end-aligned; sticky sub-header (tabs) at `z-sticky` for pages with tabs.
- **Mobile bottom tab bar (learners, < md):** 5 tabs — **Home · Learn · Practice · Tests · Me** (Lucide `house`, `book-open`, `pencil-line`, `clipboard-check`, `circle-user`), 56 px + safe-area, `material-regular`, labels `caption` always visible, active = `accent` icon+label (+ 2 px indicator). Planner, Progress, Orders, Settings live under **Me**. Hidden inside lesson player landscape and any test attempt.
- **Sheets, not modals, on mobile** (§3.5/3.6). Filters = bottom sheet with “Show 42 results” primary button. Long forms = full-screen sheet with Cancel / Save in the header.

### 4.4 Exam shell `(exam)` — `/exam/[attemptId]`

Faithful to the *behaviour and layout logic* of IELTS on computer and GRE computer-based testing; **not** a copy of ETS/IDP/British Council/Cambridge trade dress (no logos, no identical colours/fonts — avoid confusion and IP issues; see §8.5).

```
IELTS-style (Reading / Listening / Writing)             GRE-style (Quant / Verbal)
+------------------------------------------------+      +---------------------------------------------+
| HEADER 56  Candidate no. | Section/Part | 42:15  |      | HEADER 56  Quantitative Reasoning 1  | Question 7 of 12 | 14:32 [Hide] |
|           [Help][Volume]       [Hide time]      |      | [Mark] [Review] [Calculator]  [Exit] |              |
+--------------------------+---------------------+      +---------------------------------------------+
| LEFT: passage / audio    | RIGHT: questions    |      |  stem (KaTeX)           | answer area          |
| (scroll independent,     | (scroll independent)|      |  quantity A / B         | ( ) A  ( ) B ...     |
|  split drag handle,      |                     |      |                         |                      |
|  highlight/notes via     |                     |      +---------------------------------------------+
|  selection menu)         |                     |      | FOOTER  [Back]                   [Next]      |
+--------------------------+---------------------+      +---------------------------------------------+
| FOOTER 72  Navigator: Part1 [1][2]..[13] Part2 ..  [Review]                 [Back][Next] |
+------------------------------------------------+
```

- **Chrome minimal and flat:** `canvas` page, header/footer `surface-2` with 1 px `line` rules, no blur, no shadows, no motion (except timer thresholds and 100 ms dialog fade), type scale shifts +1 step for questions (`prose` 17/28 default; user text-size control 100 / 125 / 150 %). Buttons use `exam` variant (56 px). Max readable width inside panes 680.
- **Layouts per module:** Reading = 2 panes (draggable divider, 50/50 default, min 320), stack vertically < 900 px with tabs “Passage | Questions”. Listening = single pane, audio status bar (no scrubbing; play begins once, as in the real test), 30-s review per part when the test spec allows. Writing = prompt + editor (§5.1.15). Speaking = recorder flow (§5.1.16). GRE = per-question screens, **Review screen** and **Mark** (§5.1.17), **Exit Section** requires confirm, on-screen calculator on Quant.
- **Fullscreen:** offer (not force) the Fullscreen API with a clear toggle; detect tab switches/blur and log (D6/D7), display neutral reminder “Stay on this tab during the test” but never block.
- **No navigation out:** logo is a non-link; `beforeunload` guard; Back button handled (history state) with “Leave test?” dialog; resumable (D6).
- **Pre-test screens** (not in shell chrome rules above): system check, instructions, headphones/mic check, tutorial with sample questions, “Candidate details” confirmation, then “Begin test”.
- **Offline/connection:** persistent banner under the header: “Connection lost. Your answers are saved on this device and will sync when you're back online.” Timer continues from the server deadline; at reconnect resync (D6).

### 4.5 Studio, grader, staff and admin `(studio)`, `(grader)`, `(staff)`, `(admin)`

```
+--------+--------------------------------------------------------------------+
|SIDEBAR | TOP BAR 48  [workspace / org switcher]  [⌘K]  [help] [avatar]       |
|224/56  +--------------------------------------------------------------------+
|        | Page header 56: title (title2) · status badge · [secondary][Primary]|
|        +----------+-------------------------------------+-------------------+
|        | TREE/LIST| MAIN (editor / table)               | INSPECTOR 320–360 |
|        | 280      | fluid                               | properties,       |
|        |          |                                     | validation, AI    |
+--------+----------+-------------------------------------+-------------------+
```
- Compact density: controls 32 px, text `subheadline`, table rows 40 px, sidebar 224. Three-pane layouts collapse: inspector → sheet (< xl), tree → sheet (< lg). Unsaved changes: top-bar “Saved 2 min ago” / “Unsaved changes” (never auto-publishes; drafts autosave).
- **Admin chrome is visibly different:** a 2 px `warning` top rule in `(admin)` when acting as `support` impersonation (read-only, reason banner: “Viewing as Nusrat A. (read-only) · Reason: ticket #4821 · End session”).
- Data-first: tables, filters in URL, bulk actions, keyboard shortcuts (`g` then `u` → users …) listed in `?` dialog.
- **Not designed for phones.** Below `md` show read-only essentials (grader queue, approvals, order lookup) and a notice “Open on a larger screen to edit.”

### 4.6 Mobile rules (learners)

- Primary navigation: bottom tab bar (above). Secondary: top large-title collapsing header (title1 → 17 px inline on scroll).
- Thumb zone: primary action pinned at bottom (sticky, `material-regular`) for: course enrol, checkout pay, “Start test”, “Submit”.
- Sheets for filters, pickers, notifications, question navigator. Dialogs only for ≤ 2-button confirms (rendered as centred small alert).
- Tap targets ≥ 44×44; inputs ≥ 16 px; no hover-dependent features; swipe gestures are shortcuts, never the only path.
- Tables → card lists. Charts → single series per view with a Segmented selector.
- Test attempts on phones: supported for Listening & Reading practice; full mocks show “Best on a laptop or tablet” notice (not a block). Writing and Speaking mocks recommend ≥ 768 px / mic-enabled device.
- Data saver: respects `Save-Data` header and `prefers-reduced-data`; image quality 60, video capped 480p, no autoplay.

---

## 5. Page inventory

Conventions: URLs are shown **without** locale prefix (`apps/web/app/[locale]/…`). next-intl `localePrefix: "as-needed"` — English at root `/…`, Bangla at `/bn/…`. “Shell” = layout from §4. “States” lists the *non-happy* states each page must design (E empty, L loading skeleton, X error, P partial, A access-denied/locked, S signed-out).

### 5.0 Route table

#### `(marketing)` — shell: marketing

| Route | Purpose | Key components | States |
|---|---|---|---|
| `/` | Convert visitors: free diagnostic, show product, credibility | Nav, Hero+screenshot, exam picker, course rail, mock-test showcase, AI feedback demo, method steps, instructors, outcomes (real), pricing teaser, FAQ, footer | L (rail), X (rail fails → hide section) |
| `/ielts`, `/gre` | Exam hubs: format, scoring, courses, free resources | Exam facts table, skill tabs, band calculator, course list, free-diagnostic CTA, FAQ | L, X |
| `/guides/[slug]` | Module/section guides (IELTS Listening, GRE Quant …) — SEO | Overview, question types, sample question, related lessons/practice | L |
| `/duolingo-english-test` and other exam pages (P2) | Same pattern as hubs | — | — |
| `/courses`, `/bundles/[slug]`, `/passes` | Catalogue, bundles, time-boxed passes | Search, filter chips (exam, skill, level, language, price, instructor), sort, Course cards, filter sheet | E (no match), L, X |
| `/courses/[slug]` (+ `/courses/[slug]/preview/[lessonId]`) | Course landing → enrol; free lesson preview | Hero, sticky purchase card, what you’ll learn, curriculum accordion, preview player, instructor, reviews, FAQ, related | L, X, A (staff draft preview), enrolled (CTA changes), expired |
| `/free-diagnostic`, `/tests`, `/tests/[slug]` | Lead magnet: free diagnostic + public mock catalogue (→ `/exam/diagnostic` as guest) | Test cards, “What you’ll get” report preview, start CTA | S |
| `/live`, `/live/[batchSlug]` (P2) | Live batches | Schedule, instructor, enrol card | E |
| `/pricing` | Plans & passes | Currency segmented, Pricing cards, comparison table, org seat CTA, FAQ, refund policy | L, X |
| `/instructors`, `/instructors/[handle]` | Public instructor directory/profile | Bio, photo, courses, verified score | L |
| `/blog`, `/blog/[slug]`, `/blog/category/[slug]`, `/blog/tag/[slug]` | SEO content | Article list, prose layout, related courses | E, L |
| `/tools`, `/tools/*` (`ielts-band-calculator`, `gre-score-converter`, `word-counter`, `ielts-writing-timer` …) | Free tools (SEO + lead gen) | Calculator forms, result card, CTA | X (invalid input) |
| `/about`, `/careers`, `/contact`, `/for-instructors`, `/for-institutions` | Company, support form (Turnstile), instructor application, B2B lead form | Forms with success states | X |
| `/help`, `/help/[article]` | Help centre (27 §8 article inventory; Chatwoot chat launcher opens from here, D12 C29) | Search, topics, article, feedback buttons, "Contact support" | E |
| `/legal/terms`, `/legal/privacy`, `/legal/refund-policy`, `/legal/cookies`, `/legal/trademark-notice`, `/legal/ai-scoring-policy` | Legal | Prose + TOC; cookie preferences dialog | — |
| `/verify/[code]` (P1; no index page at `/verify`, D12 C4/C11) | Public certificate verification via an unguessable code (never the UUID) | Certificate card (name if the learner allows, course, date, issuer, status valid/revoked), `noindex` | not found, revoked |
| `/status` | Public status page (Better Stack, 27 §9) | Component status list, incident history, subscribe | E, X (provider down: static fallback with link) |
| `/changelog` | Public product changelog (23 App. C) | Dated entries, tags (New / Improved / Fixed), RSS | E |
| `/accessibility` | Accessibility statement, known issues, how to report a barrier | Prose + TOC, contact form link | — |
| `/guarantee`, `/accuracy` | Plain-language money-back / Target Promise / Progress Promise terms (17 §2.2a); published AI-scoring accuracy (31, 34) | Prose + table; "last updated" date | — |
| `/admissions`, `/admissions/common-app` (P2) | Admissions & Applications marketing (21) | Service cards, process steps, disclaimer "not affiliated with the Common Application" | — |
| `/search?q=` | Global search | Tabs (Courses · Lessons · Articles), results | E, L |

#### `(auth)` — shell: marketing (minimal) / auth split layout

| Route | Purpose | Key components | States |
|---|---|---|---|
| `/sign-in` (`?next=`) | Sign in (Google, email OTP/magic link, phone OTP, passkey) | Provider buttons, method Segmented (Email · Phone), OTP, Turnstile | X (wrong code, rate-limited), loading, locked |
| `/sign-up` | Create account | same + age band + terms consent | X, minors → guardian consent |
| `/two-factor` | TOTP/passkey step for staff, instructors, org admins | OTP/passkey prompt, recovery code | X |
| `/guardian-consent/[token]`, `/accept-invite/[token]` | Guardian consent; org/staff invite acceptance | Summary card, consent checkboxes, primary action | expired token, already used |
| `/onboarding` (steps: `goal` → `exam` → `level` → `schedule` → `plan`) | Personalise dashboard | Stepper, option tiles, date picker, summary | skip, resume |
| `/auth/error` | OAuth failure | Alert + retry | — |

#### `(checkout)` — shell: marketing (minimal; logo is not a link to a nav)

| Route | Purpose | Key components | States |
|---|---|---|---|
| `/cart` (P2; in P1 every product page uses single-item **Buy now** straight to `/checkout`, D12 C24) | Review items | Line items, coupon, upsell (max 1), totals | E (empty cart) |
| `/checkout` | Pay | Summary 3.36, method selector 3.37, coupon, trust row | L, X, price-changed, A (signed-out → `/sign-in?next=`) |
| `/checkout/return` (`?status=success\|failed\|cancelled`) | Post-gateway result | Success receipt / failure with retry / pending (polling) | pending, failed, cancelled |
| `/orders`, `/orders/[id]` | Orders, invoices, access dates | Table, receipt, refund request | E |

#### `(learner)` — shell: app (`/app/**`; player = focused variant). Roles: `student`; `guardian` gets read-only views

| Route | Purpose | Key components | States |
|---|---|---|---|
| `/app` | Role-aware dashboard (§6) | Widget grid | new / active / exam-soon / inactive / expired |
| `/app/my-courses` | My courses | Course cards (enrolled), filters | E |
| `/app/learn/[courseSlug]` | Enrolled course home | Progress ring, “Continue” card, outline accordion, resources, Q&A tab | L, X, expired (read-only banner) |
| `/app/learn/[courseSlug]/[lessonId]` | Course player (video, reading, quiz lesson types) | Video chrome 3.21, outline sheet/sidebar, transcript, notes, Q&A, prev/next, mark complete | L, X, A (locked → preview/upgrade), offline |
| `/app/practice` | Practice bank home | Skill tabs, filters, set cards, “Weak areas” rail | E, L |
| `/app/practice/session/[sessionId]` | Practice runner (untimed/timed, immediate feedback) | Question components, check/explanation, reading-comfort toggle | resume, submitted |
| `/app/practice/history`, `/app/mistakes` | Past sessions; mistake notebook | Table, filters, retry CTA | E |
| `/app/tests` | Mock test library | Cards per mock (IELTS Academic 1–N, GRE 1–N), status, filters, credits | E, L, A (needs plan) |
| `/app/tests/[testId]` | Mock test start screen | Test facts, sections & timings, requirements, resume/start, accommodations, integrity notice | A, in-progress (Resume) |
| `/app/results/[attemptId]` | Score report | Band display, sections, charts, time analysis, next steps | processing (AI grading pending), P (writing/speaking pending) |
| `/app/results/[attemptId]/review` | Question-by-question review | Filters (wrong / flagged / slow), explanations | — |
| `/app/writing`, `/app/writing/[submissionId]` | Writing submissions list + AI/human feedback view | List, annotated essay, criteria panel | pending, failed → retry |
| `/app/speaking`, `/app/speaking/[submissionId]` | Speaking practice list + feedback | Recorder, transcript with highlights, audio player, criteria | pending |
| `/app/vocabulary`, `/app/vocabulary/review`, `/app/vocabulary/decks/[deckId]` | Vocabulary decks, spaced-repetition review | Flashcard (keyboard-first), deck list | E (nothing due) |
| `/app/plan` | Study planner: **read-only generated list in P1** (D12 C5); calendar, drag-to-reschedule and sync in P2 | List (P1) / Calendar 3.34 (P2), tasks | E (no exam date), L |
| `/app/progress` | Skills mastery & analytics | Mastery per skill, accuracy by question type, time-on-task, goal gap | E (< 3 data points) |
| `/app/achievements` (P2), `/app/certificates`, `/app/certificates/[id]` (P1: PDF + verify link; P3: LinkedIn deep-link and Open Badges, D12 C4) | Streaks/badges, certificates | Certificate cards | E |
| `/app/ask`, `/app/listen` (P2), `/app/notebooks` (P2), `/app/promise`, `/app/progress/estimate` | AI tutor, audio overviews, My notebook, guarantee claims, score-predictor detail (34) | Components 3.41-3.46 | E, L, X, limit-reached |
| `/app/admissions/**` (P2) | Admissions workspace (21 §6) | Tracker, essay workspace (feedback only) | E |
| `/app/live`, `/app/live/[sessionId]` (P2) | Live classes | Schedule, join | E |
| `/app/community`, `/app/community/[threadId]` (P2) | Q&A | Thread list, composer | E |
| `/app/notifications` | Full notification list | List + prefs | E |
| `/app/support`, `/app/support/tickets/[id]` | Help requests | Form, thread | E |
| `/app/wishlist`, `/app/referrals` | Wishlist, referrals (P2) | Lists | E |
| `/app/settings` (+ `/billing`, `/notifications`, `/security`, `/privacy`, `/guardians`) | Profile, language, numerals, accessibility, security (passkeys, 2FA), **privacy centre (§5.1.26)**, billing, guardians | Tabs, forms | X, processing (export/delete) |
| `/app/guardian`, `/app/guardian/[studentId]` | `guardian`: linked students, read-only progress, receipts | Student switcher, summary | E (no links), consent pending |

#### `(exam)` — shell: **full-screen exam shell** (no app chrome; see §4.4)

| Route | Purpose | Key components | States |
|---|---|---|---|
| `/exam/diagnostic` | Guest entry to the free diagnostic (creates guest attempt → `/exam/[attemptId]`) | Short intro, start | S |
| `/exam/[attemptId]/system-check` | Browser, audio, mic, fullscreen check | Checklist with live results | X per check |
| `/exam/[attemptId]` | Single attempt runner: instructions/tutorial → section runner (reading, listening, writing, speaking, GRE sections) → review screen → submit. Section/question state is server-driven (07-TEST-ENGINE), not separate URLs | Exam shell, navigator, timer, autosave status | deadline, offline, recovered, resumed on another device |
| `/exam/[attemptId]/submitted` | Confirmation, “results processing” | Progress, what happens next, link to `/app/results/[attemptId]` | processing |

#### `(studio)` — shell: studio. Roles: `instructor` (own), `content_editor`+ (all)

| Route | Purpose | Key components | States |
|---|---|---|---|
| `/studio` | Role-aware overview (§6) | Widgets | E |
| `/studio/courses`, `/studio/courses/new` | List/create courses | DataTable, wizard | E |
| `/studio/courses/[id]` | **Course builder** (curriculum tree) (§5.1.21) | Tree + inspector | unsaved, validation errors, in review |
| `/studio/courses/[id]/lessons/[lessonId]` | Lesson editor | Tiptap, media picker, captions, resources | autosave, upload progress |
| `/studio/courses/[id]/(pricing\|analytics\|reviews\|qna\|review)` | Course admin tabs + submit-for-review status | Forms, charts | — |
| `/studio/questions`, `/studio/questions/new`, `/studio/questions/import`, `/studio/questions/[id]` | Question bank + authoring (§5.1.22) | Table, editor, preview | validation, versions |
| `/studio/tests`, `/studio/tests/[id]` | Mock-test assembler | Section builder, question picker, timing | validation |
| `/studio/media` | Audio/video library | Upload dropzone (R2 presigned), transcription status | processing |
| `/studio/messages`, `/studio/profile`, `/studio/earnings`, `/studio/payouts` (P3 for earnings/payouts) | Learner messages, public profile, revenue | Lists, forms, charts | E |

#### `(grader)` — shell: studio-density app. Role: `grader`

| Route | Purpose | Key components | States |
|---|---|---|---|
| `/grader` | Queue health overview | Stat tiles, claim-next | E |
| `/grader/queue` | Writing/speaking queue | DataTable (§5.1.23) | E, claimed by other |
| `/grader/review/[submissionId]` | Grading workspace (AI band prefilled, override with rationale) | Response + audio, rubric panel | draft, conflict |
| `/grader/calibration` | Calibration exercises vs. reference scores | Exercise list, agreement chart | E |

#### `(staff)` — shell: studio-density app. Roles: `content_editor`, `support`, `finance`

| Route | Purpose | Key components | States |
|---|---|---|---|
| `/editor`, `/editor/review-queue`, `/editor/review/[versionId]`, `/editor/taxonomy`, `/editor/reports`, `/editor/cms/(blog\|help\|pages\|seo)` | Editorial review (diff view, approve/request changes), taxonomy, CMS | Queue table, diff viewer, Tiptap | E |
| `/support`, `/support/users`, `/support/users/[id]`, `/support/tickets`, `/support/tickets/[id]`, `/support/macros` | Lookup (masked PII), tickets, macros, extensions ≤ 7 days, read-only impersonation with reason | DataTable, detail tabs | A |
| `/finance`, `/finance/orders`, `/finance/orders/[id]`, `/finance/refunds`, `/finance/coupons`, `/finance/payouts`, `/finance/reports` | Orders, refunds (reason, amount dialog), coupons, payouts, reports | Tables, charts | A (finance only) |

#### `(org)` — shell: app (dense). Role: `org_admin` of that org

| Route | Purpose | Key components | States |
|---|---|---|---|
| `/org/[orgSlug]` | Org dashboard (§5.1.25) | KPIs, cohort table, seat ring | E, L |
| `/org/[orgSlug]/(members\|cohorts\|assignments\|seats\|reports\|branding\|settings)` | Manage seats, import members (`/members/import`), cohorts (`/cohorts/[id]`), assign courses/tests (`/assignments/new`), analytics, branding | Data tables, import wizard | E, L |

#### `(admin)` — shell: admin. Roles: `admin`, `super_admin`

| Route | Purpose | Key components | States |
|---|---|---|---|
| `/admin` | Operations overview (§5.1.24) | KPIs, queues, system health | L, X |
| `/admin/users`, `/admin/users/[id]`, `/admin/instructors`, `/admin/roles` | Users, sessions, roles (super_admin grants), instructor approval | DataTable, detail tabs | A |
| `/admin/orgs`, `/admin/orgs/[id]` | Institutions | Table, seats | — |
| `/admin/catalogue`, `/admin/products`, `/admin/pricing` | Catalogue, products, price books | Tables, forms | — |
| `/admin/orders` | Platform-wide orders (read; actions live in `/finance`) | Table | — |
| `/admin/moderation` | Cross-instructor content/reviews moderation | Tables | — |
| `/admin/ai` | AI evaluation monitoring: cost, latency, calibration vs human, prompt versions | Charts, table | — |
| `/admin/audit-log` | Append-only audit log | Filterable table, export | — |
| `/admin/feature-flags`, `/admin/settings`, `/admin/system`, `/admin/danger-zone` | Flags, platform settings, system health, destructive ops (2FA re-auth, typed confirm) | Forms | A |

#### Global

`not-found` (404), `error` (500), `global-error`, `/403` (no permission), `/offline`, `/maintenance`, session-expired modal (on-page, not a redirect), `/unsupported-browser` (test engine requirements).

---

### 5.1 Wireframes

Legend: `[Button]` filled primary · `(Button)` secondary · `<link>` plain · `[ ]` checkbox · `( )` radio · `[img]` real photograph/screenshot · `{...}` dynamic data · `~~~` skeleton · `###` filled progress.
All wireframes are desktop unless stated; mobile notes below each.

#### 5.1.1 Home `/` (desktop 1440)

```
+------------------------------------------------------------------------------------------+
| (logo)  Courses  IELTS  GRE  Free tests  Pricing  Institutions        EN | বাংলা  Sign in  [Start free] |
+------------------------------------------------------------------------------------------+
|                                                                                          |
|  IELTS and GRE preparation              +--------------------------------------------+   |
|  built for Bangladesh                   | [screenshot] Reading mock test             |   |
|  Practise on the real computer-based    |  passage | questions | navigator 1..40     |   |
|  format. Get an estimated band in       |  (seeded: "The decline of the honeybee")   |   |
|  minutes, with feedback on every        +--------------------------------------------+   |
|  writing task.                                                                           |
|  [Take a free diagnostic]  <Browse courses>                                              |
|  Estimated bands — not official scores. Pay with bKash, Nagad or card.                   |
+------------------------------------------------------------------------------------------+
| Two exams, one place            (left-aligned section title, 2 large cards, NOT 3 icons) |
| +-----------------------------------+  +-----------------------------------+            |
| | IELTS Academic & General          |  | GRE General Test                  |            |
| | {n} lessons · {n} mock tests      |  | {n} lessons · {n} mock tests      |            |
| | [img: real student, Dhaka]        |  | [img: real student, laptop]       |            |
| | Explore IELTS ->                  |  | Explore GRE ->                    |            |
| +-----------------------------------+  +-----------------------------------+            |
+------------------------------------------------------------------------------------------+
| Full mock tests, same pressure       [screenshot: exam shell]   |  Left: copy + 3 bullets |
| (split row: media left / copy right; alternates)                |  "Server-timed, resumable, |
|                                                                 |   section-adaptive GRE"   |
+------------------------------------------------------------------------------------------+
| Writing feedback you can act on      Copy left | [screenshot: inline highlights +         |
| (Task 2 essay, criteria bands, 3 fixes)        |  criterion bands, real sample essay]     |
+------------------------------------------------------------------------------------------+
| Popular courses  (rail of 4 Course cards, "See all courses")                              |
+------------------------------------------------------------------------------------------+
| How it works: 1 Diagnostic -> 2 Personal plan -> 3 Practice -> 4 Mock tests (numbered row)|
+------------------------------------------------------------------------------------------+
| Instructors: [photo] name, role, band/score achieved (verified) x4                        |
+------------------------------------------------------------------------------------------+
| Results from learners: only real, consented, dated quotes. If none yet: omit section.     |
+------------------------------------------------------------------------------------------+
| Pricing teaser (3 plans compact)                    | FAQ (accordion, 6 real questions)   |
+------------------------------------------------------------------------------------------+
| FOOTER  + trademark disclaimer                                                            |
+------------------------------------------------------------------------------------------+
```
Mobile: single column, hero screenshot below the CTAs and cropped to the top 60 %, exam cards stack, split rows stack media-first, instructor rail = Embla carousel with peek, sticky bottom CTA “Take a free diagnostic”.

#### 5.1.2 Exam hub `/ielts` (same pattern for `/gre`)

```
+----------------------------------------------------------------------------------+
| NAV                                                                              |
+----------------------------------------------------------------------------------+
| IELTS                                  | At a glance (card, surface-2)            |
| Prepare for IELTS Academic or          |  Format   Computer or paper (check your  |
| General Training                       |           test centre)                   |
| [Take free diagnostic] <See courses>   |  Length   2 h 45 min (L 30 · R 60 · W 60)|
|                                        |  Scale    Bands 0–9, half bands          |
|                                        |  Results  Typically in 3–5 days (CD: 3)  |
+----------------------------------------------------------------------------------+
| Four skills   [Listening | Reading | Writing | Speaking]   <- Tabs (not 4 icon cards)|
|  Listening panel: format table (4 sections, 40 Q, 30 min + 10 transfer) | question  |
|  types list | "Practise this" lessons rail (3 lesson rows) | sample question inline |
+----------------------------------------------------------------------------------+
| How IELTS bands work: band descriptor table (accessible table) + <Band calculator>|
+----------------------------------------------------------------------------------+
| IELTS courses (Course cards x3-4) | Free resources (lesson rows with "Free" badge) |
+----------------------------------------------------------------------------------+
| FAQ  | Disclaimer: footer trademark text (§8.5, D12 C31)                             |
+----------------------------------------------------------------------------------+
```
(Facts such as timings come from `docs/` exam specs; the page reads them from CMS, never hard-coded.)

#### 5.1.3 Course landing `/courses/[slug]`

```
+----------------------------------------------------------------------------------+
| Breadcrumb: Courses / IELTS / Reading                                            |
+------------------------------------------------------------+---------------------+
| [IELTS] [Intermediate]                                     | PURCHASE CARD       |
| IELTS Academic Reading: from 6 to 7.5                      | (sticky, shadow-md) |
| (title1) Short outcome sentence (body fg-2)                | [preview video 16:9]|
| (avatar) Instructor name · rating 4.8 (212) · 2,140 enrolled| ৳2,490             |
| Last updated {date} · Bangla + English subtitles           | ≈ $21               |
+------------------------------------------------------------+ [Enrol now]         |
| Tabs: Overview | Curriculum | Instructor | Reviews | FAQ    | (Add to wishlist)   |
|                                                            | Includes:           |
| What you'll learn (2-col list, checks, 6-8 items)          | 38 lessons · 9 h    |
| Curriculum: accordion modules -> Lesson rows               | 3 mock tests        |
|   (free preview rows have "Preview" plain button)          | 5 AI evaluations    |
| Instructor card (photo, bio, verified score)               | Access 6 months     |
| Reviews: distribution bars + list (verified purchase)      | 7-day refund*       |
| FAQ                                                        | *if <20% used       |
+------------------------------------------------------------+---------------------+
| Related courses                                                                  |
+----------------------------------------------------------------------------------+
Mobile: purchase card collapses to sticky bottom bar { ৳2,490 | [Enrol] }.
```

#### 5.1.4 Catalogue `/courses`

```
+----------------------------------------------------------------------------------+
| Courses                                          [search..................] ⌘K   |
| Chips: [All] [IELTS] [GRE]        Skill ⌄  Level ⌄  Language ⌄  Price ⌄   Sort ⌄  |
+------------------+---------------------------------------------------------------+
| FILTERS (≥lg     | 128 courses                                                   |
|  left rail 256)  | +--------+ +--------+ +--------+ +--------+                    |
| Exam             | | card   | | card   | | card   | | card   |   4-up at xl       |
|  [ ] IELTS       | +--------+ +--------+ +--------+ +--------+                    |
|  [ ] GRE         | ... pagination (load more + URL page param)                    |
| Skill ...        | Empty: "No courses match 'gerund'." <Clear filters>            |
| Level ...        |                                                               |
+------------------+---------------------------------------------------------------+
Mobile: chips row + "Filters (2)" button -> bottom sheet; 1-up cards (horizontal variant).
```

#### 5.1.5 Pricing `/pricing`

```
+----------------------------------------------------------------------------------+
| Pricing   One honest price list. Pay once, no auto-renewal in Bangladesh.         |
|           ( IELTS Academic | IELTS GT | GRE )            ( BDT | USD region )     |
+----------------------------------------------------------------------------------+
| +-------+ +--------+ +===========+ +--------+ +--------+                          |
| | Free  | | Core   | | Plus      | | Live   | | Mentor |                          |
| | ৳0    | | ৳3,990 | | ৳6,490    | | ৳13,990| | ৳19,990|   IELTS Academic, from 17|
| | Try   | | Self-  | | AI coach  | | Cohort | | 1:1    |   (price book rows)      |
| | it    | | paced  | | "Most     | | with a | | named  |                          |
| |       | | recor- | |  chosen"  | | teacher| | mentor |                          |
| |       | | ded    | | (if true) | |        | |        |                          |
| | [Start| | [Buy   | | [Buy Plus]| | [Join  | | [Apply]|                          |
| |  free]| |  Core] | |           | | batch] | |        |                          |
| | 2 AI  | | 4 mocks| | 5 mocks   | | Plus + | | Live + |                          |
| | creds | | 10 AI  | | now, 10 by| | 36 live| | 3 x 1:1|                          |
| | + 1/  | | credits| | 15 Aug    | | classes| | sessions|                         |
| | month | | cert.  | | 2027; 40  | | 4 human| | 6 human|                          |
| |       | | 7-day  | | credits;  | | essays | | essays |                          |
| |       | | refund | | 2 human   | | 2 spkg | | Progress|                         |
| |       | |        | | essays;   | | mocks  | | Promise|                          |
| |       | |        | | Target    | |        | |        |                          |
| |       | |        | | Promise   | |        | |        |                          |
| +-------+ +--------+ +===========+ +--------+ +--------+                          |
| Live Crash (4 weeks) is a variant toggle on the Live card. Free trial: 7-day Plus  |
| trial, no card (phone-verified).                                                  |
+----------------------------------------------------------------------------------+
| Passes: 1 / 3 / 6 / 12 months (all-access practice; no certificate, live or human |
| review) - four compact cards, prices from 17 §5                                    |
+----------------------------------------------------------------------------------+
| Single courses and mock packs: <Browse courses> · Institutions: <Talk to us>       |
+----------------------------------------------------------------------------------+
| Compare tiers (table, sticky header, 12-16 rows: mocks, credits, human reviews,   |
| live sessions, 1:1, access days, certificate, support response, promise)           |
+----------------------------------------------------------------------------------+
| FAQ: refunds and the 7-day money-back, Target/Progress Promise (link /guarantee),  |
| bKash/Nagad and instalments for Live/Mentor, invoices, expiry reminders, sharing   |
+----------------------------------------------------------------------------------+
| Footer trademark text (§8.5)                                                       |
+----------------------------------------------------------------------------------+
```

Implementation notes: The prices above are the IELTS Academic BDT figures from 17 (illustrative in the wireframe); production values always come from the price book, never hard-coded. Region C prices are never below the BD price in USD (D12 C25), so there is no cross-region “cheaper country” UI. BD visitors cannot switch to USD regions.

#### 5.1.6 Checkout `/checkout`

```
+------------------------------------------------+---------------------------------+
| <- Back to course            (logo, no nav)    |                                 |
| Checkout                                        | ORDER SUMMARY (sticky)          |
| 1 Your details   Nusrat Akter · 01712 ••• 678 ✓ | [thumb] IELTS Pass · 3 months   |
|   (prefilled; <Edit>)                           | Access 7 Nov 2026 – 7 Feb 2027  |
| 2 Payment method                                | ----------------------------    |
|   ( ) bKash   Pay with your bKash account       | Subtotal            ৳2,490      |
|   ( ) Nagad                                     | Coupon  EID10      -৳249  [x]   |
|   ( ) Rocket                                    | Total               ৳2,241      |
|   ( ) Card · Visa, Mastercard, Amex             | ----------------------------    |
|   ( ) Internet banking                          | [Pay ৳2,241 with bKash]         |
| 3 Coupon  [__________] (Apply)                  | Secure payment via SSLCommerz.  |
|                                                 | 7-day refund if <20% used.      |
| What happens next: you'll be taken to bKash to  |                                 |
| confirm; you'll return here with your receipt.  |                                 |
+------------------------------------------------+---------------------------------+
Mobile: summary collapses into an expandable row at top ("Order summary ৳2,241 ⌄");
pay button is sticky at the bottom with safe-area padding.
```

#### 5.1.7 Sign in / Sign up `/sign-in`

```
+-----------------------------------+----------------------------------------------+
| (logo)                            |                                              |
|                                   |   [img: real photo, learners studying,       |
|  Welcome back                     |    Dhaka — caption "Photo: ... "]            |
|  Sign in to continue learning.    |                                              |
|                                   |   Quote: only real, consented, attributed    |
|  [G  Continue with Google]        |                                              |
|  -------------- or --------------  |   (hidden < lg)                              |
|  ( Email | Phone )  <- Segmented   |                                              |
|  Phone  [+880 v] [01XXXXXXXXX]     |                                              |
|  [Send code]                       |                                              |
|  <Use a passkey instead>           |                                              |
|                                    |                                              |
|  New here? <Create an account>     |                                              |
|  By continuing you agree to Terms  |                                              |
|  and Privacy Policy.               |                                              |
+-----------------------------------+----------------------------------------------+
Step 2 (same card, transitions horizontally 200ms): "Enter the 6-digit code sent to 01712 ••• 678"
[ _ ][ _ ][ _ ][ _ ][ _ ][ _ ]   Resend in 0:42   <Change number>
Sign-up adds: Name, "I am… (under 18 / 18+)", terms checkbox. Under 18 -> guardian consent step.
```

#### 5.1.8 Onboarding `/onboarding/[step]`

```
+----------------------------------------------------------------------------------+
| (logo)                                   Step 2 of 5  ##########----   <Skip>    |
+----------------------------------------------------------------------------------+
|                                                                                  |
|  Which exam are you preparing for?       (title1, left aligned, max 560)         |
|  We'll set up your dashboard around it.                                          |
|                                                                                  |
|  +----------------------------+  +----------------------------+                  |
|  | IELTS Academic             |  | IELTS General Training     |                  |
|  | University admission       |  | Migration, work            |                  |
|  +----------------------------+  +----------------------------+                  |
|  +----------------------------+  +----------------------------+                  |
|  | GRE General Test           |  | Not sure yet               |                  |
|  +----------------------------+  +----------------------------+                  |
|                                                                                  |
|  (Back)                                                [Continue]                |
+----------------------------------------------------------------------------------+
Steps: 1 Goal (study abroad / migration / scholarship) · 2 Exam · 3 Level (take 10-min diagnostic or
self-report) · 4 Schedule (exam date picker, hours/week, preferred days) · 5 Plan preview (week 1 tasks)
```

#### 5.1.9 Student dashboard `/app` (active learner, desktop)

```
+--------+-------------------------------------------------------------------+-----------+
|SIDEBAR | Good evening, Nusrat                       41 days to IELTS · 19 Dec |  RIGHT    |
|        +--------------------------------------------------------------------+  RAIL    |
|        | [Continue card, span 8]           | [Next best action, span 4]    |           |
|        |  IELTS Reading Masterclass        |  Fix: True/False/Not Given    | Today     |
|        |  Lesson 14 · 12 min left  ###--   |  accuracy 48% -> 12 min drill | 3 tasks   |
|        |  [Resume]                         |  [Start drill]                |  [ ] ...  |
|        +-----------------------------------+-------------------------------+ Streak    |
|        | Stat L  Stat R  Stat W  Stat S   (4 x span 3: est. band per skill)|  12 days  |
|        |  6.5     6.0     5.5     6.0      sparkline each                    | S M T ... |
|        +--------------------------------------------+-----------------------+           |
|        | Score trend (span 8) line chart overall    | Goal gap (span 4)     | Credits   |
|        |  mocks 1-4, goal line 7.0                  |  need +1.0 in Writing | 14 left   |
|        +--------------------------------------------+-----------------------+           |
|        | Upcoming (span 6): Mock 5 Sat 10:00, ...   | Recent feedback (6)   |           |
|        +--------------------------------------------+-----------------------+-----------+
```
Widget reflow rules are in §6.

#### 5.1.10 Course player `/app/learn/[courseSlug]/[lessonId]`

```
+----------------------------------------------------------------------------------+
| <- IELTS Reading Masterclass   Lesson 14 of 38 · True/False/Not Given  ##--- 37%  |
+---------------------------------------------------------+------------------------+
| +-----------------------------------------------------+ | OUTLINE (collapsible)  |
| |                  VIDEO 16:9                         | |  v Module 3 · Question |
| |  [watermark: nusrat@…]                              | |    types (2/6)         |
| |  controls bar (material-thick)                      | |   (check) L12 ...      |
| +-----------------------------------------------------+ |   (play)  L14 ...      |
| Title (title2)               [Mark complete] [Notes]    |   ( )     L15 ...      |
| Tabs: Overview | Transcript | Notes | Q&A | Resources   |  > Module 4 ...        |
|  Transcript: click-to-seek, current line highlighted    |                        |
| <- Previous lesson                      Next lesson ->  |                        |
+---------------------------------------------------------+------------------------+
Mobile: video sticky top (16:9); below it tabs; outline = bottom sheet from a "Lessons" button;
landscape = fullscreen video only.
```

#### 5.1.11 Practice bank `/app/practice`

```
+----------------------------------------------------------------------------------+
| Practice                                      [search questions...]              |
| Skill tabs: Listening | Reading | Writing | Speaking | Quant | Verbal              |
| Filters: Question type ⌄  Difficulty ⌄  Status ⌄ (new/attempted/mastered)  Timed ⌄|
+---------------------------------------------+------------------------------------+
| Sets (list rows 64px)                       | Your weak areas (card)             |
|  True/False/Not Given · Set 3               |  1 Matching headings   52% (11 q)  |
|   10 q · 14 min · 6/10 last · Familiar      |  2 Sentence completion 58%         |
|  Matching headings · Set 1                  |  [Practise weak areas]             |
|   ...                                       | Mastery legend: Not started →      |
|                                             |  Attempted → Familiar → Proficient |
|                                             |  → Mastered (Khan-style levels)    |
+---------------------------------------------+------------------------------------+
```

#### 5.1.12 Mock test start `/app/tests/[testId]`

```
+----------------------------------------------------------------------------------+
| <- Mock tests                                                                    |
| IELTS Academic · Mock Test 5                           Status: Not started       |
+-----------------------------------------------+----------------------------------+
| What to expect                                 | Before you begin (checklist)     |
|  Listening   4 sections · 40 q · 30 min        |  (check) Quiet room              |
|  Reading     3 passages · 40 q · 60 min        |  (check) Headphones              |
|  Writing     2 tasks · 60 min                  |  (check) Stable connection       |
|  Speaking    Recorded · ~14 min (optional)     |  (check) Laptop or tablet        |
| Total time (without breaks): 2 h 45 min        |  [Run system check]              |
| Resume anytime — timers are server-controlled. |  Accommodations: +25% time (on)  |
| Integrity: tab switches are logged.            |                                   |
+-----------------------------------------------+----------------------------------+
|  Uses 1 mock test credit (you have 3).  [Start test]  <Schedule for later>        |
+----------------------------------------------------------------------------------+
```
In-progress variant: primary becomes “Resume · Reading, 38:12 left”.

#### 5.1.13 Exam shell — IELTS Reading (`/exam/[attemptId]`)

```
+----------------------------------------------------------------------------------+
| Candidate 4821907      IELTS Academic Reading · Part 2          Time left 42:15  |
|                                    [Notes][Highlight]  (Hide time)  [Help]       |
+---------------------------------------+------------------------------------------+
| READING PASSAGE 2                     |  Questions 14–26                         |
| ("The Lost Cities of the Maya")       |  Questions 14–18                         |
|                                       |  Do the following statements agree with  |
| A  Paragraph text... prose 17/28      |  the information in the passage?         |
|  (selected text -> small popover:     |  Write TRUE, FALSE or NOT GIVEN         |
|   Highlight / Add note / Clear)       |  14  The lowlands were ... [T][F][NG]    |
| B  ...                                |  15  ...                                 |
|                          ::drag::     |  Questions 19–23 (Complete the summary) |
|                                       |  Write NO MORE THAN TWO WORDS ...        |
|                                       |  19 [________]  20 [________] ...        |
+---------------------------------------+------------------------------------------+
| Part 1  1 2 3 4 5 6 7 8 9 10 11 12 13 | Part 2  14 15 ... 26 | Part 3 27 ... 40  |
| (answered filled, flagged corner mark, current ring)       [Review]  [<] [>]     |
+----------------------------------------------------------------------------------+
Mobile/narrow: Tabs "Passage | Questions" replace the split; navigator opens as sheet.
```

#### 5.1.14 Exam shell — IELTS Listening

```
+----------------------------------------------------------------------------------+
| Candidate 4821907      IELTS Academic Listening · Section 3     Time left 08:41  |
|                                 Volume [-----o--]   (Hide time)   [Help]         |
+----------------------------------------------------------------------------------+
| (audio status strip: "Section 3 is playing" · waveform-less progress bar,        |
|  no seek/pause controls — as in the real test; practice mode adds pause/replay)  |
+----------------------------------------------------------------------------------+
| Questions 21–30                                                                  |
| 21  Which topic did the student choose?   ( ) A  ( ) B  ( ) C                    |
| Complete the form. Write ONE WORD AND/OR A NUMBER                                |
| 24  Venue: [__________]   25  Date: [__________]                                 |
+----------------------------------------------------------------------------------+
| Section 1 1..10 | Section 2 11..20 | Section 3 21..30 | Section 4 31..40  [Review] |
+----------------------------------------------------------------------------------+
Pre-roll screen: "Listen to this sample" volume test (plays a spoken sentence; user confirms).
```

#### 5.1.15 Exam shell — IELTS Writing

```
+----------------------------------------------------------------------------------+
| Candidate 4821907        IELTS Academic Writing · Task 2             Time left 38:20|
+------------------------------------+---------------------------------------------+
| WRITING TASK 2                      |  [Cut] [Copy] [Paste]                       |
| You should spend about 40 minutes.  | +-----------------------------------------+ |
| Write about the following topic:    | |  (textarea, 17/28)                      | |
| "Some people think ... Discuss both | |                                         | |
|  views and give your own opinion."  | |                                         | |
| Write at least 250 words.           | +-----------------------------------------+ |
| (Task 1: chart image + zoom dialog) | Words: 187   (check at 250)   Saved 14:02   |
+------------------------------------+---------------------------------------------+
| Task [1] [2]                                                      [Review] [Submit]|
+----------------------------------------------------------------------------------+
```

#### 5.1.16 Exam shell — IELTS Speaking (recorded practice mock)

```
+----------------------------------------------------------------------------------+
| IELTS Speaking · Part 2 (Long turn)                          Prep time 00:42     |
+----------------------------------------------------------------------------------+
|  Examiner card:                                                                  |
|  "Describe a place you visited that you found peaceful. You should say:          |
|   where it is · when you went · what you did there · why it felt peaceful."      |
|                                                                                  |
|  You have one minute to prepare. You can make notes.   [ notes textarea ]        |
|                                                                                  |
|        ( mic level ||||||||----- )     Recording: Off                            |
|        [ Start speaking ]  (auto-starts when prep time ends)                     |
|        0:00 / 2:00                                                               |
+----------------------------------------------------------------------------------+
| Part 1 (done) · Part 2 (current) · Part 3                       [Finish part]    |
+----------------------------------------------------------------------------------+
```

#### 5.1.17 Exam shell — GRE Quant (calculator + review screen)

```
Question screen
+----------------------------------------------------------------------------------+
| Quantitative Reasoning · Section 1 of 2      Question 7 of 12     Time 14:32 [Hide]|
| [Mark] [Review] [Calculator] [Exit Section]                                      |
+---------------------------------------------+------------------------------------+
| Quantity A: the average of x, y, z          |  ( ) A  Quantity A is greater      |
| Quantity B: 12                              |  ( ) B  Quantity B is greater      |
| (KaTeX)                                     |  ( ) C  The two are equal          |
|                                             |  ( ) D  Cannot be determined       |
+---------------------------------------------+------------------------------------+
| [Back]                                                             [Next]        |
+----------------------------------------------------------------------------------+
Calculator (draggable non-modal panel, 280x360, over content, Esc closes, no blur)
 +-------------------------+
 | 12.5                 [x]|   Keys 0-9 . + − × ÷ √ 1/x ±  %  MR/MC? (basic only, per GRE)
 | [C] [CE] [√] [÷]        |   [Transfer Display] (fills numeric entry)
 | [7] [8] [9] [×] ...     |   Keyboard input supported; focus trap off (non-modal)
 +-------------------------+
Review screen (GRE)
+----------------------------------------------------------------------------------+
| Review · Quantitative Reasoning Section 1          Time 06:10                    |
| Filter: (All) (Unanswered 2) (Marked 3)                                          |
| #   Status        Marked  |  #   Status        Marked                            |
| 1   Answered        -     |  7   Incomplete      ⚑ (flag icon)                   |
| 2   Answered        ⚑     |  8   Answered        -                               |
| ...                                                                              |
| [Return to question]   [Go to question 7]                       [Exit Section]   |
+----------------------------------------------------------------------------------+
```

#### 5.1.18 Results / score report `/app/results/[attemptId]`

```
+----------------------------------------------------------------------------------+
| <- Mock tests     IELTS Academic · Mock Test 5 · taken 7 Nov 2026                 |
+------------------------+---------------------------------------------------------+
| ESTIMATED OVERALL BAND | Listening 7.0  Reading 6.5  Writing 6.0 (AI)  Speaking —|
|   [ 6.5 ]  (score)     |  (4 criterion rows, tier-coloured mini bars, delta vs   |
|  range 6.0 – 6.5       |   previous mock; pending ones show skeleton + "AI grading"|
| Estimated band — not an |  "Speaking: not taken")                                |
| official IELTS score.   |                                                        |
+------------------------+---------------------------------------------------------+
| Where you lost marks (bar chart by question type, sorted)  | Time per section   |
| Matching headings 3/5 · TFNG 4/6 · Sentence completion 4/5 | planned vs actual  |
+-----------------------------------------------------------+--------------------+
| Your next 3 steps (cards with CTA): Drill matching headings (12 min) · Review Task 2   |
| feedback · Retake Reading in 5 days                                                    |
+----------------------------------------------------------------------------------+
| Tabs: Questions | Writing feedback | Speaking | Compare with previous mocks         |
+----------------------------------------------------------------------------------+
```

#### 5.1.19 AI writing feedback view `/app/writing/[submissionId]`

```
+----------------------------------------------------------------------------------+
| <- Results   Writing Task 2 · 268 words · Estimated 6.0 (AI, v{promptVersion})    |
+----------------------------------------------+-----------------------------------+
| YOUR ESSAY (prose, inline highlights)         | CRITERIA (sticky)                |
| ...Some people believe that [advertising      |  Task Response          6.0  ##   |
|  should be banned]{1}. However, I {think}{2}  |  Coherence & Cohesion   6.5  ###  |
|  ...                                          |  Lexical Resource       6.0       |
|                                               |  Grammatical Range      5.5       |
| Highlight key (icon + underline style):       |  Each: 1-sentence why + 1 fix     |
|  wavy = grammar · dotted = vocabulary ·       |-----------------------------------|
|  solid = task/coherence                       | SELECTED ANNOTATION {2}           |
|                                               |  "I think" → use a hedged phrase  |
|                                               |  Why: ... Try: ... [Apply to copy]|
|                                               |-----------------------------------|
|                                               | Estimated band — not an official  |
|                                               | IELTS score. <How we estimate>    |
|                                               | (Request human review · 1 credit) |
+----------------------------------------------+-----------------------------------+
```
Highlights use underline *styles* (wavy/dotted/solid) plus a tinted background from `warning-soft`/`info-soft`/`accent-soft`, never colour alone. Mobile: essay full width; tapping a highlight opens a bottom sheet; criteria are a horizontal Segmented + card.

#### 5.1.20 Study planner `/app/plan`

```
+----------------------------------------------------------------------------------+
| Study planner              41 days to IELTS · Sat 19 Dec    (Week | Month)  [+ Task]|
+--------------------------------------------------------+-------------------------+
| Mon 9      Tue 10     Wed 11     Thu 12 (today) Fri 13  | Today · 3 tasks · 70 min|
| 60 min     45 min     --         70 min         30 min  | [ ] Reading drill  25m  |
| +-------+ +-------+             +-------+ +--+          | [ ] Writing Task 1 30m  |
| |Read   | |Write  |             |Listen | |..|          | [ ] Vocabulary     15m  |
| |drill  | |T1     |             |S3     | +--+          |  ring 0/70 min          |
| +-------+ +-------+             +-------+               |-------------------------|
|  catch-up lane: [Missed: Listening S2 — Reschedule]     | Weekly goal 5h · 3h 20m |
+--------------------------------------------------------+-------------------------+
Mobile: Agenda list grouped by day; drag replaced by "Move to…" menu.
```

#### 5.1.21 Studio — course builder `/studio/courses/[id]`

```
+--------+-------------------------------------------------------------------------+
|SIDEBAR | IELTS Academic Reading · Draft · Saved 2 min ago     (Preview) [Submit for review]|
|        +-------------+-------------------------------------+---------------------+
|        | CURRICULUM  | LESSON: True/False/Not Given        | INSPECTOR           |
|        | v Module 1  |  Title [____________]               | Status: Draft       |
|        |   L1 ..     |  Type (Video|Reading|Quiz|Practice) | Free preview [ ]    |
|        |   L2 ..     |  Video: [uploaded ✓ 12:34] [Replace]| Duration 12:34      |
|        | v Module 2  |  Captions: EN ✓  BN ✗ (required)    | Captions: 1 missing |
|        |   L3 ..     |  Rich text (Tiptap): toolbar        | Publish checklist:  |
|        | [+ Module]  |  Resources [+]                      |  (check) title      |
|        |  drag to    |  Quiz attached: TFNG Set 3 [Change] |  (x) Bangla captions|
|        |  reorder    |                                     |  (check) thumbnail  |
+--------+-------------+-------------------------------------+---------------------+
```

#### 5.1.22 Studio — question authoring `/studio/questions/[id]`

```
+--------+-------------------------------------------------------------------------+
|        | Question #Q-10482 · v3 (draft) · IELTS Reading · TFNG    (History) [Save] |
|        +--------------------------------------+----------------------------------+
|        | EDIT                                 | LIVE PREVIEW (exam rendering)    |
|        |  Type [True/False/Not Given ⌄]       |  14 The lowlands were ...        |
|        |  Passage [Passage 2 ⌄]  <Open>       |  ( )T ( )F ( )NG                 |
|        |  Statement [__________________]      |  [Preview as: Exam | Practice]   |
|        |  Correct [ TRUE ⌄ ]                  |                                  |
|        |  Evidence span [select in passage]   |  VALIDATION                      |
|        |  Explanation (en) [Tiptap]           |  (check) one correct answer      |
|        |  Explanation (bn) [Tiptap]           |  (x) evidence span missing       |
|        |  Tags: skill, difficulty 1-5, topic  |  (check) original content attested|
|        |  Accepted answers (gap-fill) [chips] |  Used in 3 tests (pinned v2)     |
+--------+--------------------------------------+----------------------------------+
Editing a used question creates a new version; past attempts keep the pinned version (D6).
```

#### 5.1.23 Grader queue `/grader/queue`

```
+--------+-------------------------------------------------------------------------+
|        | Grading queue              Filters: Writing ⌄  Speaking ⌄  Due ⌄  Mine ⌄ |
|        +-------------------------------------------------------------------------+
|        | [ ] Submission  Type        Learner(masked) AI band  Due       SLA  Action|
|        | [ ] #W-9921     Writing T2  N.A. ••••        6.0     in 3 h    ok   [Claim]|
|        | [ ] #S-3310     Speaking P2 R.H. ••••        6.5     in 20 h   ok   [Claim]|
|        | [ ] #W-9904     Writing T1  S.K. ••••        5.5     overdue   !    [Open] |
|        +-------------------------------------------------------------------------+
|        | Workspace: left learner response (+audio), right rubric panel with AI band|
|        | prefilled; override per criterion requires rationale (min 20 chars);      |
|        | [Save draft] [Submit grade]  -> audit-logged; learner sees "Graded by …"  |
+--------+-------------------------------------------------------------------------+
```

#### 5.1.24 Admin overview `/admin`

```
+--------+-------------------------------------------------------------------------+
|        | Overview                                  Today ⌄  | System: All healthy |
|        +--------------+--------------+--------------+------------------------------+
|        | Revenue      | New learners | Active attempts | AI jobs queue            |
|        | ৳{x} +4% wow | {n}          | {n} now         | {n} pending · p95 {s}    |
|        +--------------+--------------+--------------+------------------------------+
|        | Revenue 30d (chart, span 8)               | Needs attention (span 4)      |
|        |                                           |  3 refunds awaiting           |
|        |                                           |  7 payment mismatches         |
|        |                                           |  12 submissions overdue       |
|        +-------------------------------------------+-------------------------------+
|        | Recent audit events (table 8 rows)        | Webhooks/IPN failures (table) |
+--------+-------------------------------------------------------------------------+
```

#### 5.1.25 Org admin dashboard `/org/[orgSlug]`

```
+--------+-------------------------------------------------------------------------+
|        | {Org name}  · 120 seats · 96 used · expires 31 Mar 2027    [Invite members]|
|        +---------------+---------------+---------------+---------------------------+
|        | Active this wk| Avg est. band | Tests taken   | At-risk learners (no activity 7d)|
|        | 71 / 96       | 6.1 (+0.2)    | 214           | 9  <View list>            |
|        +---------------+---------------+---------------+---------------------------+
|        | Cohort performance (table: cohort, learners, avg band by skill, trend)    |
|        | Assignments (upcoming deadlines, completion %)    | Seat usage (ring)      |
+--------+-------------------------------------------------------------------------+
```

#### 5.1.26 Account / privacy centre `/app/settings/privacy`

```
+----------------------------------------------------------------------------------+
| Privacy & data                                                                   |
| +-------------------------+  +-------------------------+                         |
| | Download your data      |  | Consents                |                         |
| | JSON + audio files, ready|  | Analytics        [on ]  |                         |
| | within 24 h. [Request]  |  | Marketing email  [off]  |                         |
| | Last export: 3 Oct 2026 |  | AI training use  [off]  |  (default off)          |
| +-------------------------+  +-------------------------+                         |
| Recordings & submissions: keep 30 days / until deleted ⌄  <Delete all recordings>|
| Linked guardians: Mr. A. Rahman (read-only)  <Remove access>                      |
| Sessions & devices (list, <Sign out of all>)                                     |
| ---------------------------------------------------------------------------------|
| Delete account — "This permanently deletes your profile, progress and recordings.|
|  Orders are kept for 7 years as required by law." [Delete account] (destructive,  |
|  re-auth + typed confirmation + 7-day grace period)                              |
+----------------------------------------------------------------------------------+
```

#### 5.1.27 404 / 500

```
404                                                    500
+------------------------------------------+          +------------------------------------------+
| (nav)                                    |          | (minimal nav)                            |
|  404                                     |          |  Something went wrong on our side.       |
|  We can't find that page.                |          |  Your answers and progress are safe.     |
|  It may have moved, or the link is       |          |  [Try again]  <Go to dashboard>          |
|  mistyped.                               |          |  Reference: err_8f3a21 (copy)            |
|  [Go to home]  <Browse courses>          |          |  If this keeps happening, <contact us>.  |
|  [search courses........]                |          +------------------------------------------+
+------------------------------------------+
```
Left-aligned inside a `prose`-width column (not centred hero), single 40 px Lucide icon in a `surface-2` tile, no illustration gimmicks.

---

## 6. Dynamic dashboards per role

### 6.1 Widget system rules

- **Server-composed, client-hydrated.** `getDashboardModel(actor)` in `packages/core/src/dashboard` returns an ordered list `{ id, size, tier, state }[]` for the actor’s active role + personalisation state. The page renders each widget as an independent React Server Component inside its own `<Suspense fallback={<WidgetSkeleton/>}>` — one slow query never blocks the page. Users **cannot rearrange** in P1 (predictable > configurable); P2 adds hide/pin.
- **Tiers (reading order = DOM order = mobile order):**
  1. **Now** — exactly **one** hero widget (Continue learning / Exam countdown / Resume test / Renew). Uses `highlight` card or the larger `Continue` card. Max one filled-accent button on the whole dashboard sits here.
  2. **Progress** — stat tiles, trend, goal gap.
  3. **Plan** — today’s tasks, upcoming tests/classes, deadlines.
  4. **Explore** — recommendations, new courses, community, credits/upsell. Hidden in `exam-soon` state.
- **Sizes on a 12-col grid** (container-query based so the right rail doesn’t break them):

| Size | Desktop ≥ lg (12-col) | Tablet md (8-col) | Mobile (4-col) | Typical widgets |
|---|---|---|---|---|
| XS | 3 | 4 (2-up) | 2 (2-up) | Stat tile, credits, streak count |
| S | 4 | 4 (2-up) | 4 | Next best action, goal gap, exam countdown |
| M | 6 | 4 (2-up) / 8 when alone in row | 4 | Today’s plan, upcoming, recent feedback |
| L | 8 | 8 | 4 | Continue card, trend chart |
| XL | 12 | 8 | 4 | Banner, table widgets |
| Rail | 320 fixed column ≥ xl | stacks **after** tier 3 | stacks **after** tier 3 | Today, streak, calendar mini |

- **Row packing:** CSS grid with `grid-auto-flow: row` (no `dense`, no reorder surprises). Server ensures each row sums to 12 (e.g., L+S+S… never a lone XS). Widgets never change height after load (reserved `min-height` per widget id) → CLS ≈ 0.
- **Mobile reflow:** single column; XS tiles become a 2×2 grid; charts lose axes ticks (keep 3), tables → lists with 3 rows + “See all”; max 6 widgets before a “Show more” `plain` button (rest are tier 4). The bottom tab bar replaces sidebar. Widgets with horizontal content (course rail) use Embla with 16 px peek.
- **Widget anatomy:** header row (title `headline`, optional `plain` “See all →”, optional ⋯ menu) · body · footer (provenance: “Updated 2 min ago”, for derived data show “Based on N attempts”). Radius `rounded-lg`, padding 24 (16 mobile). Every widget defines **E/L/X/P** states in code (`<Widget empty={…} error={…}>`); an errored widget shows a compact inline error with Retry and doesn’t collapse the grid.
- **Never** show fake data to fill space; **never** show a zero that means “no data” (use “—” with explanation).

### 6.2 Student personalisation states (`/app`)

State is computed server-side from: `entitlements`, `last_activity_at`, `exam_date`, `attempt_count`, `onboarding_complete`.

| State | Condition | Hero (Tier 1) | Other widgets (order) | Tone / notes |
|---|---|---|---|---|
| **New** | onboarding done, < 1 lesson/test started | “Take your 10-minute diagnostic” (S+L split with what you’ll learn) | Plan preview for week 1 (M) · Free lesson rail (L) · Course recommendations by chosen exam (L) · Credits (XS) | No empty charts: stat tiles show “Complete the diagnostic to see your estimated band” (Empty state). No streak widget until day 1 done. |
| **Active** | activity in last 7 days, exam > 14 days away or unset | **Continue** card (L): course, lesson, minutes left, Resume | Next best action (S) · 4 skill stats (XS×4) · Score trend (L) + Goal gap (S) · Today’s plan (M) + Recent feedback (M) · Streak (rail) · Explore (rail of courses) | Standard. “Next best action” from weakest skill/question type with ≥ 10 attempts. |
| **Exam-soon** | exam date ≤ 14 days | **Exam countdown** (S) + **Final-fortnight plan** (L) | Mock test slot (M: “Take a full mock this weekend”) · Weak areas (M) · Score trend (L) · Exam-day checklist (S: ID, route, what to bring, results timeline) · Streak | Hide Explore tier. Copy calm and practical (“Two weeks to go. Here's the plan that fits.”). Add reminder opt-in. |
| **Inactive** | no activity ≥ 7 days (not expired) | **Welcome back** (L): a 10-minute “restart” session picked for them + “Adjust my plan” | Plan auto-rescheduled summary (M) · Last result (M) · Progress snapshot (XS×4) | **No guilt**: no “you missed”, no lost-streak alarm; streak widget shows “Start a new streak today”. After 30 days offer a new diagnostic. |
| **Expired** | no active entitlement for any course/pass | **Renew** (L): what they keep (results, notes, certificates) + price + [Renew pass] | Progress snapshot (read-only) · Past results (M) · Certificates (S) · Data export link | Banner at top only if expired < 30 days. Content links go to the locked-lesson screen with a clear reason. |
| **Guest→signed-up diagnostic pending** | has started a guest diagnostic | “Finish your diagnostic to see your results” | — | Resume token merged to account at sign-up. |

### 6.3 Dashboards by role

All roles share the app/studio shell; the **role switcher** in the avatar menu changes which dashboard and nav appear. Tier 1 hero is named per role.

| Role | Route | Hero (Tier 1) | Core widgets | Reflow notes |
|---|---|---|---|---|
| `student` | `/app` | per §6.2 | Skill stats, trend, plan, feedback, streak, credits | §6.1 table |
| `guardian` | `/app/guardian` | **Student summary** (switcher if > 1 child): this week’s minutes, latest est. band, exam date | Progress trend (read-only), attendance of live classes (P2), receipts & renewals (pay button), consent status | No question content, no recordings. Mobile: summary then 3 stacked cards. |
| `instructor` | `/studio` | **Draft/needs-attention**: submissions awaiting review feedback, unanswered Q&A count | Course performance table (enrolments, completion, rating), dropped/bookmarked lecture hot-spots, revenue (P3), reviews to reply | Table widgets are XL; on tablet collapse to cards. |
| `grader` | `/grader` | **Queue health**: assigned now, due < 4 h, overdue | Claim next (primary), calibration score vs. AI/peers, throughput this week | Desktop only; mobile read-only list. |
| `content_editor` | `/editor` | **Review queue** (oldest first) with SLA | Recently published, flagged questions (low discrimination/ high report rate), taxonomy gaps, SEO page status | — |
| `support` | `/support` | **Lookup** (search by phone/email/order id, masked PII) | Recent tickets (if integrated), failed payments needing action, extension requests ≤ 7 days | Impersonation entry is explicit, reason required, read-only banner. |
| `finance` | `/finance` | **Today’s revenue & reconciliation status** | Refund queue, IPN/validation mismatches, payouts, coupon performance, VAT export | Numbers tabular, currency explicit (BDT/USD never summed). |
| `org_admin` | `/org/[orgSlug]` | **Seat & activity**: active this week, at-risk learners | Cohort table, assignments due, avg est. band trend, seat ring, invoices | Mobile read-only summary + “Invite members”. |
| `admin` / `super_admin` | `/admin` | **System & business pulse** (§5.1.24) | Needs-attention queues, revenue, AI job queue, webhook failures, audit stream | Dense; ≥ lg only for full dashboard. |

---

## 7. Motion and interaction

**Principles:** (1) motion explains cause and effect; (2) ≤ 300 ms for UI, ≤ 500 ms for data/hero; (3) ease-out in, ease-in out (§2.8); (4) transform + opacity only (no animating `width/height/top/left/box-shadow` on large areas; exceptions: accordion height via Motion `animate` on small lists); (5) one animated thing at a time per region; (6) never block interaction.

### 7.1 Page and route transitions
- Use the **View Transitions API** (`document.startViewTransition`, via `next/link` + `viewTransition` where supported by Next 16; otherwise no transition). Default: **cross-fade of the content region only, 200 ms `ease-standard`**; shell (nav, sidebar, tab bar) stays static and is excluded via `view-transition-name`.
- No slide-over page transitions on web. On mobile, drill-down (list → detail) may use a 250 ms 16 px horizontal shift + fade; going back reverses.
- Loading UI: streamed skeletons (`loading.tsx`) swap with 150 ms fade; a 2 px `accent` top progress bar (NProgress-style, appears after 300 ms) for slow navigations.

### 7.2 Shared-element transitions — only where meaningful
Allowed (max 3 in the product): (a) **course card thumbnail → course landing hero** (marketing), (b) **score tile → results hero numeral** (dashboard → report; the number morphs, 500 ms `ease-emphasized`), (c) **lesson row → player title** (title text only). Everything else is a plain fade. Never use shared-element for lists, icons or buttons.

### 7.3 Micro-interactions

| Interaction | Spec |
|---|---|
| Button press | `scale(0.98)` in 100 ms `spring.snappy`; release returns. Colour change 150 ms. No ripple. |
| Hover (pointer devices) | Colour/background shift 150 ms; cards `sm → md` shadow 200 ms; **no** translate > 2 px; no scale on hover for buttons. |
| Completion check (lesson/question/task) | Ring → filled `success` circle 150 ms, check path draws 250 ms (`stroke-dashoffset`), row text settles to `fg-2`. One check at a time; batch completes don't stagger more than 3 items. |
| Toggle/switch | Thumb slides `spring.snappy`; track colour 150 ms. |
| Segmented / tab indicator | `layoutId` shared element, `spring.snappy` (~180 ms perceived). |
| Accordion | Height 200 ms `ease-standard`, chevron rotate 150 ms; content fades in after 60 ms. |
| Dialog / popover | Fade + 4 px translate + scale .98→1, 200 ms; sheet `spring.sheet`. |
| Toast | Slide 8 px + fade, 200 ms in / 150 ms out. |
| Progress fill | 500 ms `ease-standard` from previous value. Numeric count-up (score, streak) ≤ 600 ms and only on first reveal per session. |
| List item enter | `fadeUp`, stagger 30–40 ms, max 8 items, first paint only. |
| Form error | Field border & message fade 150 ms; **no shake** animations. Focus moves to first invalid field. |
| Drag & drop | Lift to `shadow-md` + scale 1.02 in 150 ms; drop settles with `spring.smooth`. |
| Skeleton → content | 150 ms cross-fade; dimensions identical. |
| Milestones (course 100 %, streak 7/30/100, band goal reached) | A single calm card with a check mark, 300 ms; **no confetti**, no sounds. Optional sharing via Web Share. |

### 7.4 Reduced motion (`prefers-reduced-motion: reduce`)

| Normal | Reduced |
|---|---|
| Slide/translate/scale/spring | Removed; replaced with 100 ms opacity fade |
| Shared-element morph | Instant swap |
| Progress/ring fill, count-up | Instant final value |
| Skeleton shimmer | Static `surface-2` |
| Auto-playing video previews, GIFs, carousels autoplay | Off (poster/first slide; controls remain) |
| Smooth scroll | `auto` |
| Parallax (none exist) | n/a |
Implementation: global `<MotionConfig reducedMotion="user">`, CSS media query in §2.1 base layer, and `useReducedMotion()` for custom canvas/SVG. A user-level “Reduce motion” toggle in Settings overrides to `data-motion="reduce"` for people whose OS setting is unset.

### 7.5 Exam shell: motion is off
No transitions between questions (instant swap), no hover lift, no sheet springs (navigator sheet appears with 100 ms fade), no skeleton shimmer, no animated progress. **Allowed:** (a) the 5-min/1-min timer banner appears (fade 100 ms), (b) focus rings, (c) calculator drag (user-controlled), (d) audio level meter in Speaking (switches to static bar with reduced motion), (e) autosave status text changes (no animation). The shell must not run any `requestAnimationFrame` loop except timer tick (1 s) and audio meter.

---

## 8. Content design and microcopy

### 8.1 Voice and tone
**Voice:** warm, precise, encouraging, never hype. A knowledgeable older sibling who has taken the test — not a salesperson, not a cartoon.

| Quality | Means | Example (do) | Example (don't) |
|---|---|---|---|
| Warm | Speaks to one person, acknowledges effort | “Nice work — Reading is up half a band since your last mock.” | “Amazing!!! You're crushing it! 🔥” |
| Precise | Numbers, units, dates, exact next step | “Your Writing estimate is 6.0 (range 5.5–6.5). Fix these 3 things to reach 6.5.” | “Your writing needs improvement.” |
| Encouraging | Frames gaps as work to do, not failure | “Matching headings is your lowest area (52%). A 12-minute drill helps most.” | “You failed this section.” |
| Calm | No urgency tricks | “Your pass ends on 7 Feb. You can renew any time before then.” | “Hurry! Only 2 hours left!” |
| Honest | States limits | “This is an AI estimate. A human grader can review it.” | “100% accurate scores.” |

Tone dial by context: marketing (confident, plain, benefit-led) · learning (supportive, concise) · **exam shell (neutral, terse, official-feeling; no encouragement text mid-test)** · errors (plain, accountable, calm) · payments (exact, reassuring, no marketing) · legal (plain-language summary first).

### 8.2 Style rules (English)
- Sentence case everywhere (buttons, headings, tabs). Title Case only for proper nouns/product names.
- Buttons: verb + object (“Start mock test”, “Save changes”, “Pay ৳2,241”). No “Submit”/“OK” alone, no “Click here”.
- Numbers as numerals; ranges with an en dash (“6.0–6.5”); thousands separators (“1,284”); time `42:15`, durations “12 min”, “2 h 45 min”; dates “7 Nov 2026” (never ambiguous 07/11).
- Currency: `৳2,490` (BDT, symbol before, no decimals) and `$21.00` (USD). Prices in BDT shown first for `bn` and BD-IP users, USD for others; never both unless the toggle is shown.
- Contractions OK (“you're”, “can't”) in marketing/learning; avoid in legal/payments.
- No exclamation marks except a single one in rare positive confirmations; no ALL CAPS (except exam instruction keywords that are uppercase in the real exam: TRUE / FALSE / NOT GIVEN, NO MORE THAN TWO WORDS).
- Avoid: “revolutionary”, “supercharge”, “unlock”, “seamless”, “cutting-edge”, “AI-powered” as a headline, “game-changer”, “world-class”, “Oops”, “Whoops”, “Please note”.
- Don't promise a score. “Many learners improve with regular practice” is acceptable only with data; otherwise omit.

### 8.3 Bilingual rules
1. **Do not mix scripts in one line** except for proper nouns and established tokens: IELTS, GRE, TOEFL, bKash, Nagad, Rocket, SSLCommerz, Google, product name, band/score numerals, units like “MB”. Never write Banglish (“Mock test দিন” is *not* allowed in UI copy; use “মক টেস্ট দিন” — transliterated established loanwords are fine in Bangla script).
2. Each locale has its own full string set (next-intl, ICU MessageFormat). No string concatenation; no English fallback strings visible in `bn` (CI fails when a key is missing in `bn`).
3. Bangla register: polite **আপনি** form throughout (guardians, working adults); exam shell uses neutral imperative. Avoid heavy *সাধু* vocabulary; prefer everyday standard *চলিত*. All Bangla copy requires **native-speaker review** (hired editor) before release — drafts in this doc are placeholders.
4. Numerals: Latin by default in both locales (see §2.2.2); optional “বাংলা সংখ্যা” preference converts prose/UI counts; **never** exam content, band scores, prices in checkout, timers.
5. Dates/times: `Intl.DateTimeFormat` with `bn-BD` and `Asia/Dhaka`; Bangla month names in prose; week starts Saturday in `bn-BD`.
6. Expansion: design for +35 % (English→Bangla typically 15–30 % longer in words, taller glyphs). Test with the stress strings in §2.2.2.
7. Language switcher label always shown in its own language (“English” / “বাংলা”).
8. User-generated and exam content is displayed as authored (don't machine-translate questions).
9. SEO: separate URLs per locale, `hreflang`, translated slugs optional (English slugs kept for stability).

### 8.4 Error, empty and system messages

Formula: **what happened → why (if useful) → what to do now.** Never blame, never “Oops”, never show raw error codes in the main line (show `Reference: err_8f3a21` in a footnote with copy).

| Situation | English | বাংলা (draft — native review required) |
|---|---|---|
| Wrong OTP | “That code isn't right. You have 2 attempts left.” | “কোডটি সঠিক নয়। আর 2 বার চেষ্টা করতে পারবেন।” |
| OTP expired | “This code has expired. We can send a new one.” [Send new code] | “কোডটির মেয়াদ শেষ হয়ে গেছে। নতুন কোড পাঠানো যাবে।” |
| Network (general) | “We can't reach the server. Check your connection and try again.” | “সার্ভারের সাথে সংযোগ হচ্ছে না। ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।” |
| Offline in exam | “Connection lost. Your answers are saved on this device and will sync when you're back online.” | “সংযোগ নেই। আপনার উত্তর এই ডিভাইসে সংরক্ষিত আছে এবং সংযোগ ফিরলে সিঙ্ক হবে।” |
| Payment failed | “Your payment didn't go through. You haven't been charged. Try again or choose another method.” | “পেমেন্ট সম্পন্ন হয়নি। আপনার অ্যাকাউন্ট থেকে টাকা কাটা হয়নি। আবার চেষ্টা করুন বা অন্য পদ্ধতি বেছে নিন।” |
| Payment pending | “We're waiting for bKash to confirm your payment. This usually takes under a minute. You can leave this page — we'll email you when it's done.” | “bKash থেকে পেমেন্টের নিশ্চিতকরণের অপেক্ষায় আছি। সাধারণত এক মিনিটের কম সময় লাগে। এই পাতা বন্ধ করলেও সমস্যা নেই, নিশ্চিত হলে ইমেইলে জানাব।” |
| Access expired | “Your pass ended on 5 Nov. Your results and notes are still here. Renew to keep learning.” | “আপনার পাসের মেয়াদ 5 নভেম্বর শেষ হয়েছে। ফলাফল ও নোট এখানেই আছে। পড়া চালিয়ে যেতে নবায়ন করুন।” |
| Permission | “You don't have access to this page. If you think this is a mistake, contact support.” | “এই পাতায় আপনার প্রবেশাধিকার নেই। ভুল মনে হলে সহায়তা দলের সাথে যোগাযোগ করুন।” |
| AI evaluation failed | “We couldn't finish your feedback. Your credit has been returned. Try again.” | “আপনার ফিডব্যাক তৈরি করা যায়নি। ক্রেডিট ফেরত দেওয়া হয়েছে। আবার চেষ্টা করুন।” |
| Empty: no tests | “You haven't taken a mock test yet. A diagnostic takes 10 minutes and sets your starting point.” [Take the diagnostic] | “আপনি এখনও কোনো মক টেস্ট দেননি। ডায়াগনস্টিক টেস্টে 10 মিনিট লাগে এবং এটি আপনার শুরুর অবস্থান জানাবে।” |
| Empty: search | “No results for ‘gerund’. Try a different word or browse topics.” | “‘gerund’-এর জন্য কিছু পাওয়া যায়নি। অন্য শব্দে খুঁজুন বা বিষয় ব্রাউজ করুন।” |
| Save success | “Saved” (toast) | “সংরক্ষিত হয়েছে” |
| Destructive confirm | “Delete this course? Learners who bought it keep access. This can't be undone.” [Delete course] [Cancel] | “এই কোর্স মুছবেন? যাঁরা কিনেছেন তাঁরা অ্যাক্সেস পাবেন। এটি আর ফেরানো যাবে না।” |
| Timer | “5 minutes remaining” | “আর 5 মিনিট বাকি” |

**System pages (GA-023).** Designed pages with Bangla and English copy, the standard shell, a primary action and the Help link: **403** (“You don't have access to this page” + sign-in or request-access action), **404** (search box + popular links), **429** (“Too many attempts” with the retry time from the server, never a raw status), **500/global error** (reference id + “Try again” + status-page link), **maintenance** (reason, expected time, link to `/status`, read-only mode notice) and **offline** (what still works offline, last-synced time). None uses an illustration larger than 160 px; none is a dead end.

### 8.5 Disclaimers and trademark text (verbatim; stored in `packages/config/legal-copy.ts`; legal review before launch)

- **Estimated score (IELTS), every band display, results page, certificate-like exports, share cards:** “Estimated band — not an official IELTS score.”
- **Estimated score (GRE):** “Estimated score — not an official GRE score. Official scores are issued only by ETS.”
- **AI feedback footer:** “Generated by AI and checked against our rubric. It can make mistakes. Ask for a human review if a result surprises you.”
- **Mock-test start screen:** “This mock test follows the published format of the real exam. Timings and question types match current public specifications; the questions are original.”
- **Footer trademark (all marketing pages, results pages; canonical text = D12 C31, verbatim, stored in `legal-copy.ts` under the same keys as `exam.disclaimer_key`):** “IELTS is a registered trademark of the University of Cambridge, the British Council and IDP Education Australia. This site and its products are not approved or endorsed by them. GRE® and TOEFL® are registered trademarks of ETS. This product is not endorsed or approved by ETS.” Show only the notices for exams relevant to the page (an IELTS page shows the IELTS notice; a GRE page the ETS notice; the global footer shows both). PTE / DET / Common App pages: “[Mark] is a trademark of its owner; we are not affiliated with or endorsed by it.” Add the independence line “{Brand} is an independent test-preparation provider. All practice questions are original or used under licence.” *(The ETS sentence is ETS's required notice, verbatim. **Verify** the IELTS wording with counsel at launch; owners’ names may change.)*
- **Refund (checkout, self-paced products):** “7-day money-back, no questions asked, if you have used less than 20% and taken at most one full mock. AI credits already used are not refundable.” (D5, D12 C13b/C28). **Live and Mentor:** “Full refund before class 3 begins.” (17 §11)
- **Price footnote (BD):** “One-time payment. Your access ends on {date}; we'll remind you 7 days and 1 day before.”
- Never use official exam logos or colours; use the exam names in text only (nominative fair use).

---

## 9. Accessibility — WCAG 2.2 AA

Target: **WCAG 2.2 Level AA** for every route, plus selected AAA (7:1 body text contrast achieved by default; 2.4.13 Focus Appearance achieved). Tooling: axe-core in Playwright for every inventory route (zero `serious`/`critical`), Lighthouse a11y ≥ 95, manual keyboard + screen-reader passes (NVDA+Firefox, VoiceOver+Safari, TalkBack+Chrome) on: sign-in, checkout, player, a practice session, the exam shell, results.

### 9.1 Coverage map for new/at-risk WCAG 2.2 criteria

| SC | Requirement | How we meet it |
|---|---|---|
| 1.4.3 / 1.4.6 / 1.4.11 | Contrast text 4.5:1, UI 3:1 | Token pairs verified in CI (§2.1). Tertiary text `fg-3` is the lowest permitted text colour; `fg-4` is disabled/decorative only. Charts ≥ 3:1 marks with labels. |
| 1.4.4 / 1.4.10 | Resize to 200 %, reflow at 320 px | rem-based type; no fixed-height text containers; 320 px QA pass (§12). Exam shell supports 100/125/150 % text and stacks below 900 px. |
| 1.4.12 | Text spacing overrides | No clipped text when line-height 1.5, paragraph spacing 2×, letter-spacing .12 em, word-spacing .16 em are forced (tested via bookmarklet in QA). |
| 2.1.4 | Single-character shortcuts | Exam/player single-key shortcuts only when no text field is focused; **Settings → Accessibility → “Keyboard shortcuts: On/Off”**. |
| 2.2.1 | Timing adjustable | Per-user accommodation multipliers (+25 %, +50 %, +100 %) set by support/org admin; clearly shown on the start screen; practice modes are untimed or extendable. |
| 2.4.7 / 2.4.11 / 2.4.13 | Focus visible, not obscured, appearance | Ring §2.11; `scroll-padding-top` for sticky headers; sticky footers add `scroll-padding-bottom`. |
| 2.5.7 | Dragging alternatives | Matching, planner, curriculum reorder, split-pane divider, calculator all have a non-drag path (select menus, “Move to…”, keyboard resize arrows). |
| 2.5.8 | Target size ≥ 24×24 | Minimum control 32 px; touch ≥ 44 px (`hit-44`); inline links in text exempt but spaced ≥ 8 px in lists. |
| 3.2.6 | Consistent help | Help/Contact link in the same place in every shell footer/top bar; exam shell has `Help` button in header. |
| 3.3.7 | Redundant entry | Checkout and onboarding prefill from profile; sign-up info reused; no retyping OTP phone. |
| 3.3.8 | Accessible authentication | OTP inputs allow paste & autofill (`autocomplete="one-time-code"`); passkeys supported; no CAPTCHA puzzles (Turnstile managed challenge, non-interactive; alternative offered). |
| 4.1.3 | Status messages | Toasts, autosave status, search result counts, timer thresholds via live regions. |

### 9.2 Keyboard maps

**Global:** `Tab`/`Shift+Tab` natural order · `Esc` closes layers · `⌘K`/`Ctrl K` palette (not in exam) · `?` opens shortcut list (where shortcuts exist) · skip links “Skip to main content” + “Skip to question navigator” (exam).

**Exam shell** (single-key shortcuts active only when focus is not in a text input/textarea; **toggleable**):

| Key | Action |
|---|---|
| `N` / `B` | Next / Back question (or part, in IELTS Listening/Writing task switch) |
| `M` | Mark / flag current question (GRE “Mark”, IELTS flag) |
| `R` | Open Review screen / navigator |
| `H` | Hide / show timer |
| `C` | Toggle calculator (GRE Quant only) |
| `A`–`E`, `T` `F` `G` (TFNG: T/F/N as above), `1`–`5` | Select option |
| `Ctrl+Enter` | Next (works inside text fields; Writing) |
| `F6` / `Shift+F6` | Cycle regions: header → passage → questions → navigator |
| `Alt+Shift+↑/↓` | Increase / decrease text size (100/125/150 %) |
| `Ctrl+Shift+H` | Toggle highlight mode in Reading (selection menu is the primary path) |
| `Esc` | Close calculator / popover / dialog |
| `Tab` in Writing | Moves focus (does not insert tab) — documented under the editor |

**Matching (dnd-kit):** `Space` pick up/drop · arrows move · `Esc` cancel · plus the Select alternative.
**Data tables:** `↑/↓` rows, `Space` select, `Enter` open, `Shift+↑/↓` range select.

### 9.3 Screen-reader patterns

- **Timer:** visible digits `aria-hidden`; a separate `role="timer"` (implicit `aria-live="off"`) element holds current time, readable on demand (shortcut `Alt+Shift+T`) — **announcements through one `aria-live="polite"` region at 10, 5, 1 minutes and `assertive` at 0**; do **not** announce each second. After tab-visibility return, announce remaining time once. (`T` is reserved for True in TFNG, hence the modifier combo.)
- **Autosave:** `role="status"` text “Saved” changes; announced at most once per 30 s.
- **Navigator:** `nav` with cell labels “Question 14, answered, flagged”; arrow-key grid; on question change focus moves to the question heading (`tabindex=-1`) and the heading is announced “Question 14 of 40”.
- **Passage/question split:** panes are `region`s with names “Reading passage 2” / “Questions 14 to 26”; scrolling is keyboard accessible (`tabindex=0` on scroll containers).
- **Charts:** `role=img` + text summary + “View as table”.
- **Drag & drop:** custom announcements (en/bn).
- **Live validation:** errors in `aria-live=polite` region next to the field, linked via `aria-describedby`.
- **Language:** `lang` attribute on `<html>` and on inline switches (`<span lang="en">IELTS</span>` inside Bangla text) so screen readers switch voices.

### 9.4 Media
- Every lesson video: **captions (WebVTT) in en and bn required to publish**, plus full transcript; audio-only lessons have transcripts; IELTS Listening audio in mocks has transcripts shown **only after** submission (not before — they'd reveal answers).
- No autoplay with sound; video controls keyboard-operable (§3.21); caption defaults ON for users who enable “Always show captions”.
- Speaking/recording flows have text instructions and visual status; no instruction is audio-only.

### 9.5 Dyslexia-friendly / reading-comfort mode (practice, lessons, results; **not** altering official-format mock tests unless granted as accommodation)

Settings → Accessibility → “Reading comfort”: one toggle plus granular options.
- Typeface: keep Inter/SF (evidence for specialised “dyslexia fonts” is weak; offer **Atkinson Hyperlegible** (OFL) as an optional Latin alternative; Bangla stays Noto Sans Bengali).
- Spacing: line-height 1.9 (Latin) / 2.1 (Bangla), letter-spacing +0.04 em (Latin only), word-spacing +0.12 em, paragraph spacing 1.5 em, max line 60 ch, left aligned, **no justified text, no italics, no all-caps**.
- Colour: soft off-white `#FAF6EC`/dark `#16150F` page (reuse exam “soft” theme), no pure white backgrounds.
- Aids: **reading ruler** (line focus bar, follows pointer/keyboard), tap-to-define (practice vocabulary), “Read aloud” for explanations (Web Speech API; en/bn voices where available), larger text 100/125/150/175 %.
- In exam shell, the same options are available as **accommodations** (text size, theme, spacing) because the real tests permit adjustments; but they don't change timing unless an extension is set.

### 9.6 Other
- **Colour is never the only cue** (icons, text, patterns) — states in navigator, band tiers, charts, form validation.
- **Language & direction:** `lang` set; `dir="ltr"` now, logical CSS properties used so RTL is feasible.
- **Forms:** group related fields with `fieldset/legend`, error summary at top for long forms with links to fields.
- **Motion:** §7.4. **Seizures:** no flashing > 3 Hz anywhere.
- **Zoom/mobile:** no `user-scalable=no`; viewport `width=device-width, initial-scale=1`.
- **Cognitive load:** one primary action per view, plain language (reading grade ≤ 8 for UI copy), progress indicators in multi-step flows, confirmation before destructive actions, ability to review before submitting.
- **Accessibility statement** page and feedback address at `/help/accessibility`.

---

## 10. Imagery and illustration

### 10.1 Photography
- **Real photography of Bangladeshi students, teachers and study settings** — own shoot in Dhaka (+ Chattogram/Sylhet/Rajshahi for regional breadth), or licensed from Bangladeshi photographers. Budget line in the launch plan. Signed model releases; minors only with guardian release; no student's face used in marketing without written consent.
- **Art direction:** natural window light, real rooms (home desk, coaching centre, university library, rooftop study spot, cafe with laptop), tone neutral-cool matching the greys, shallow depth of field sparingly, authentic expressions, mixed gender, mixed dress (including hijab/panjabi/casual), mixed ages (HSC grads, university students, working professionals). Avoid posed “high-five at laptop”, avoid foreign stock people, avoid cliché globe/graduation-cap/lightbulb imagery.
- **Shot list v1 (≥ 30 frames):** learner hero portraits (6), at-desk with laptop + headphones (6), exam-day scene at test centre (4, with permission), instructor portraits (8 consistent background, same lens/lighting for set coherence), group study (3), mobile use on commute (3).
- **Technical:** master 3:2 and 16:9 crops at ≥ 3000 px; export AVIF + WebP via `next/image`; `sizes` always set; art-directed crops with `object-position` per breakpoint; LQIP blur placeholders (`placeholder="blur"`) generated at build; target hero image ≤ 120 KB on mobile; alt text describes content in the page language (decorative → `alt=""`).
- **Instructors:** consistent portrait set (same background tone `surface-2`-like, shoulders-up, 4:5) with verified credentials (e.g., “IELTS 8.5 · 2023” stored with proof); no avatars/illustrations for named staff.

### 10.2 Product screenshots
- Generated, not hand-captured: `tooling/screenshots` runs Playwright against a **seeded demo workspace** (realistic Bangladeshi names, real exam topics, plausible but clearly demo data — never real learner data) at 1440×900 @2x in light mode (dark variant for the dark-section), en and bn versions, with fixed clock and animations disabled. Output to `apps/web/public/marketing/` as AVIF/WebP.
- Presentation: rounded-xl, 1 px hairline, `shadow-lg`, **no device mockups**, no perspective tilt, no floating UI fragments with glow. Crops highlight the meaningful region (e.g., the question navigator + passage) and may overlay one numbered callout style (16 px `accent` dots with `caption` numerals) with matching copy.
- Rebuilt on every release that changes the depicted UI (CI check: screenshot hash drift opens a task).

### 10.3 Illustration
- Used only for empty states, onboarding, error pages and a handful of editorial spots. **Simple line illustrations**: 1.5 px stroke (matching icons), rounded caps/joins, two inks only (`fg` and `accent`), one soft `surface-3` fill shape allowed, max 160×120 in-product, no gradients, no faces (use hands, books, desks, tools), no isometric 3D, no AI-generated art. Commission one illustrator for a single coherent set (≈ 12 pieces) delivered as SVG with `currentColor` strokes so they theme for dark mode. Until commissioned, empty states use a 40 px Lucide icon in a `surface-2` tile (acceptable permanent fallback).

### 10.4 Iconography rules
- **Lucide only** (`lucide-react`), imported individually (tree-shaken). Wrapper `<Icon>` in `packages/ui` fixes `strokeWidth={1.5}` with `absoluteStrokeWidth` so the rendered stroke is 1.5 px at both sizes.
- Sizes: **16** (inline in dense tables, badges), **20** (default UI: buttons, inputs, nav, rows), **24** (marketing nav mega-menu, feature rows, tab bar), **32/40** (empty-state tiles). No other sizes. Icon + text: gap 8 px (4 at 16 px), optical vertical alignment to cap-height centre.
- Colour: `currentColor`; semantic only for status. Outline style only — no filled icons except: filled `star` (rating), filled `play` (video overlay), check inside filled success circle.
- No emoji, no custom one-off SVG icons without adding to `packages/ui/src/icons/` with a stroke-compliant redraw (Lucide-style 24 grid, 1.5 stroke).
- **Semantic map** (one concept = one icon, app-wide):

| Concept | Lucide icon | Concept | Lucide icon |
|---|---|---|---|
| Listening | `headphones` | Reading | `book-open` |
| Writing | `pen-line` | Speaking | `mic` |
| Quant | `calculator` | Verbal | `text-quote` |
| AWA | `file-pen-line` | Mock test | `clipboard-check` |
| Practice | `target` | Video lesson | `circle-play` |
| Reading lesson | `file-text` | Quiz | `list-checks` |
| Planner | `calendar-days` | Progress | `chart-no-axes-column` |
| Streak | `calendar-check` | Credits | `ticket` |
| Notifications | `bell` | Flag/mark | `flag` |
| Locked | `lock` | Settings | `settings` |
| Help | `circle-help` | Language | `languages` |
| Time | `clock` | Download | `download` |

---

## 11. Reuse plan — save time, don’t look default

### 11.1 What to start from (all free / MIT unless noted)

| Need | Resource (licence) | Used for | Restyle notes |
|---|---|---|---|
| Component base | **shadcn/ui** + **Radix Primitives** (MIT) | Everything in §3 | Copy into `packages/ui`; apply §11.3 de-shadcn steps |
| App shell | shadcn blocks **`sidebar-07`** (collapsible to icons), **`dashboard-01`** (cards + chart + table) | §4.3 app shell, §5 dashboard, admin overview | Replace colours/radii via token bridge; swap default chart cards for Stat tile; remove bordered sidebar |
| Auth | shadcn blocks **`login-04`** (image side panel) / `login-02` | `/sign-in`, `/sign-up` | Replace photo panel with real photo; add Segmented method switch + OTP |
| Charts | shadcn **chart** (Recharts) | §3.31 | Colour tokens `chart-*`, custom tooltip, table fallback |
| Tables | **TanStack Table v8** (MIT) + shadcn data-table recipe | §3.14 | Hairline rows, 48/40 px, card-list on mobile |
| Toasts | **Sonner** (MIT) | §3.9 | Custom `toastOptions.classNames` to tokens |
| Mobile sheet | **Vaul** (MIT) | §3.5 | Grabber & radius per spec |
| Command palette | **cmdk** (MIT) | §3.15 | Role-aware groups |
| Date picker / calendar | **react-day-picker v9** (MIT) | §3.34 | Bangla locale from `date-fns/locale/bn`; first day Saturday |
| Carousels | **Embla Carousel** (MIT) | Course rails, instructor rail | Peek, no auto-play, arrow buttons `ghost icon` |
| Rich text | **Tiptap** (MIT core) | Lesson editor, explanations | Minimal toolbar; headless styled to `prose` |
| OTP | **input-otp** (MIT) | §3.3 | Cell size/radius |
| Drag & drop | **dnd-kit** (MIT) | §3.25, planner, curriculum tree | Keyboard sensors + announcements |
| Video | **Vidstack** (MIT) + hls.js | §3.21 | Fully custom control skin |
| Theme | **next-themes** (MIT) | Light/dark/system | `attribute="data-theme"` |
| Math / code | **KaTeX**, **Shiki** (MIT) | GRE math, tech tracks | Theme matches tokens |
| Motion | **Motion** (`motion/react`, MIT) | §7 | Presets in `motion.ts` |
| Icons | **Lucide** (ISC) | §10.4 | Wrapper |
| Forms | react-hook-form + zod + `@hookform/resolvers` | all forms | Field components §3.2 |
| i18n | next-intl | en/bn | ICU, `Intl` formatting |
| Variants | class-variance-authority, clsx, tailwind-merge | component API | — |
| Fonts | Inter, Noto Sans Bengali, Hind Siliguri, JetBrains Mono (all OFL) via `next/font` | §2.2 | Self-hosted |
| Inspiration only (no code copy) | Apple HIG, Khan Academy Wonder Blocks (MIT, for patterns), Radix Themes docs | Interaction conventions | Don’t copy brand assets |

*Check licences at install with `pnpm licenses list`; no GPL/AGPL UI dependencies; no paid UI kits needed (D3).*

### 11.2 shadcn variable bridge (so pasted blocks work unchanged)

```css
/* tokens.css — compatibility aliases; never use the shadcn names in new code */
:root, [data-theme] {
  --background: var(--canvas);        --foreground: var(--fg);
  --card: var(--surface);             --card-foreground: var(--fg);
  --popover: var(--surface);          --popover-foreground: var(--fg);
  --primary: var(--accent);           --primary-foreground: var(--accent-fg);
  --secondary: var(--surface-3);      --secondary-foreground: var(--fg);
  --muted: var(--surface-2);          --muted-foreground: var(--fg-3);
  --accent: var(--accent);            /* NOTE: shadcn "accent" = hover fill; remap in components below */
  --destructive: var(--danger-solid); --border: var(--line);
  --input: var(--control-border);     --ring: var(--focus);
  --radius: 12px;
  --chart-1: var(--chart-1);          /* identical names — already compatible */
  --sidebar: var(--canvas);           --sidebar-foreground: var(--fg-2);
  --sidebar-primary: var(--accent);   --sidebar-primary-foreground: var(--accent-fg);
  --sidebar-accent: var(--accent-soft); --sidebar-accent-foreground: var(--accent-soft-fg);
  --sidebar-border: var(--line);      --sidebar-ring: var(--focus);
}
```
Caveat: shadcn’s `accent` token means “subtle hover background”, ours means “brand blue”. When copying a component, **replace** `bg-accent`/`text-accent-foreground` with `bg-surface-2`/`text-fg` (menu items, ghost hover) — the lint rule `lumen/shadcn-accent` flags remaining `accent-foreground` usages.

### 11.3 De-shadcn checklist (restyle every copied component)

1. Replace `border` + `shadow-sm` combos with `shadow-sm` token (hairline ring) — **remove `border border-input` stacking**.
2. Radii → per §2.5 (`rounded-md` = 12, cards 16). shadcn defaults (6–8 px) look generic.
3. Heights 40/32/48; text `callout` 16; remove `text-sm` everywhere (disabled by the reset).
4. Focus: delete `focus-visible:ring-ring/50 ring-[3px]` pattern; use global two-tone ring.
5. Colours: remove `zinc/slate` fallbacks; destructive to our `danger`; remove opacity-hack colours (`bg-primary/90`) in favour of explicit `accent-hover`.
6. Typography: replace `font-medium text-sm` combos with `text-callout font-semibold` etc.
7. Motion: remove default `animate-in/zoom-in-95` utilities; use our durations/easings; sheets use spring.
8. Cards: remove `CardHeader` 6-unit padding quirks; our padding 16/24; no border + shadow double.
9. Tabs: switch default pill tabs to underline; segmented control is a separate component.
10. Inputs: no ring-offset; boundary 3 : 1; leading icon slot; error text slot reserved.
11. Table: remove outer border, add sticky header, tabular numerals.
12. Dark mode: surface ladder (canvas < surface < surface-2 < surface-3) — verify no `bg-black/white` hard-codes.
13. Run **“squint test”**: take a screenshot of the page next to a default shadcn demo; if you can't tell them apart at 25 % scale, keep restyling (spacing rhythm, type scale and imagery are the main differentiators).

### 11.4 Package layout

```
packages/ui/
  src/
    styles/tokens.css            # §2.1 (single source)
    motion.ts                    # §2.8
    components/<name>/{index.ts,<name>.tsx,<name>.test.tsx,<name>.stories? (no Storybook: use /design route)}
    exam/    (question types, timer, navigator, calculator, editor, recorder)
    learning/(course-card, lesson-row, player-chrome, band-score, streak)
    layouts/ (marketing-shell, app-shell, exam-shell, studio-shell, auth-split)
    icons/   (<Icon/> wrapper + semantic map)
    lib/     (cn, use-reduced-motion, format helpers)
  eslint/    (lumen plugin: spacing-scale, no-raw-colour, no-colour-override, icon-label, shadcn-accent)
apps/web/app/[locale]/design/    # internal-only /design route: tokens, type, components, states, Bangla stress strings
```
Install commands (run in `packages/ui`): `pnpm dlx shadcn@latest add button input textarea select checkbox radio-group switch slider label form dialog alert-dialog sheet drawer tabs toggle-group tooltip popover command sonner progress badge avatar table card skeleton alert accordion calendar chart sidebar input-otp scroll-area dropdown-menu separator breadcrumb navigation-menu carousel` then restyle per §11.3 before first use. *(CLI flags can change — verify against current shadcn docs.)*

---

## 12. Design QA checklist (run by `ui-polisher` before a page is “done”)

**Process:** for each changed route, run the matrix **viewport {320*, 360, 768, 1024, 1440} × theme {light, dark} × locale {en, bn}** (*320 light/en + bn only) with Playwright, saving screenshots to `/tmp/ui-qa/<route>/<vp>-<theme>-<locale>.png` (not committed). Compare against the wireframe in §5, the previous screenshots (if redesign) and the anti-vibe list (§1.1). Fix, re-run, then write a ≤ 15-line report (pass/fail per section below, links to screenshots, list of deviations).

```ts
// tooling/ui-qa.spec.ts (sketch)
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const vps = [[320,640],[360,800],[768,1024],[1024,768],[1440,900]];
for (const route of ROUTES) for (const [w,h] of vps) for (const theme of ["light","dark"]) for (const loc of ["en","bn"]) {
  test(`${route} ${w} ${theme} ${loc}`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    await page.emulateMedia({ colorScheme: theme as "light"|"dark", reducedMotion: "reduce" });
    await page.goto(`${loc === "bn" ? "/bn" : ""}${route}`);
    await page.addStyleTag({ content: "*{animation:none!important;transition:none!important}" });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true); // no h-scroll
    const a11y = await new AxeBuilder({ page }).withTags(["wcag2a","wcag2aa","wcag21aa","wcag22aa"]).analyze();
    expect(a11y.violations.filter(v => ["serious","critical"].includes(v.impact!))).toEqual([]);
    await page.screenshot({ path: `/tmp/ui-qa/${route}/${w}-${theme}-${loc}.png`, fullPage: true });
  });
}
```

| # | Area | Check | Pass criteria | How |
|---|---|---|---|---|
| 1 | **Anti-vibe** | Every item in §1.1 | 100 % yes | Manual + lint |
| 2 | **Spacing audit** | All gaps/padding on the 4/8 grid; consistent section rhythm (24/48/96) | No `[Npx]` spacing; lint `lumen/spacing-scale` clean; DevTools overlay shows alignment to 8 px grid | Lint + visual grid overlay |
| 3 | **Type audit** | Only §2.2.3 tokens; ≤ 4 sizes per component; one H1; heading order; line length ≤ 75 ch for prose; `tabular-nums` on all numbers that change/align | Computed-style script lists distinct `font-size/weight` pairs per page; none outside tokens | Script `tooling/type-audit.ts` |
| 4 | **Colour audit** | No raw colour values; semantic colours only for status; accent used ≤ 3 distinct roles; text contrast ≥ 4.5 / UI ≥ 3 | `lumen/no-raw-colour` clean; axe contrast clean in both themes | Lint + axe |
| 5 | **Radii/shadows** | One radius per component class; nested radii correct; shadows from tokens only | grep for `rounded-[`, `shadow-[` = 0 | Lint |
| 6 | **Dark mode** | Designed ladder; no pure-white blocks; images/screenshots have dark variants or reduced brightness (`brightness .9`); charts legible; focus ring visible | Side-by-side review; no element with `#fff` bg in dark | Screenshots |
| 7 | **Bangla rendering** | No tofu; no clipped matras (check `line-clamp`, buttons, badges, tabs); correct line-height; numerals policy; no mixed-script labels; font loaded (no FOUT jump > 2 px CLS) | Review `bn` screenshots at 360 & 1440 with stress strings (§2.2.2) | Screenshots + `document.fonts.check` |
| 8 | **320 px** | No horizontal scroll; no overlapping text; tap targets ≥ 44 px; forms usable; sticky bars don't cover content; sheet content scrolls | Playwright h-scroll assertion; manual | Screenshots |
| 9 | **Keyboard pass** | Tab order logical; every control reachable and operable; visible focus; no traps; Esc closes layers & restores focus; shortcuts documented; skip links work | Complete the page’s main task with keyboard only (record steps) | Manual |
| 10 | **Screen-reader spot check** | Landmarks, headings, names for icon buttons, live regions (toasts, timer, autosave), form errors | VoiceOver or NVDA pass on main task | Manual |
| 11 | **States** | Empty, loading (skeleton matches), error (+retry), partial, success, offline, locked/expired designed and reachable in `/design` or via MSW fixtures | Screenshot for each state | Fixtures |
| 12 | **Layout shift** | CLS ≤ 0.02; images/video reserve space; skeleton→content same size; fonts have fallback metrics | Lighthouse + Web Vitals in Playwright | Automated |
| 13 | **Performance (UI)** | LCP ≤ 2.5 s on Moto G-class 4G profile; INP ≤ 200 ms; JS for a marketing page ≤ 170 KB gz; hero image ≤ 120 KB mobile; no blur layers on low-power | Lighthouse CI budgets | Automated |
| 13b | **Performance budgets (accepted from 23 §7.9, App. C items C4/C5)** | Total transfer first load, mobile marketing page ≤ **500 KB**; fonts first load ≤ **120 KB (en) / 200 KB (bn)** *(verify with real subset sizes)*; ≤ **2 third-party scripts** on marketing pages (analytics and payments only after consent/intent); INP ≤ 200 ms; CLS ≤ 0.02; Lighthouse CI Performance ≥ 90 mobile on marketing | Lighthouse CI + `@next/bundle-analyzer` + `size-limit`; PR fails when over budget | Automated |
| 14 | **Lighthouse a11y** | Score **≥ 95** on every route in matrix (light + dark, en) | LHCI assertion `categories:accessibility ≥ 0.95` | Automated |
| 15 | **axe** | 0 serious/critical violations; moderate triaged | Playwright axe run (above) | Automated |
| 16 | **Motion** | Durations/easings from tokens; reduced-motion verified (emulate); nothing animates in exam shell besides allowed list; no layout-animating properties | Review + emulate `prefers-reduced-motion` | Manual |
| 17 | **Content** | Real copy; sentence case; no hype words; disclaimers present on all scores; Bangla strings present for every key; error messages follow formula | Copy checklist + `pnpm i18n:check` | Manual + script |
| 18 | **Imagery** | Real photos/screenshots only; alt text present & localised; explicit dimensions; AVIF/WebP; no placeholder images in prod build | Script scans for `placeholder`/`unsplash`/`lorem` | Script |
| 19 | **Icons** | Lucide only, sizes 16/20/24/32/40, stroke 1.5 absolute, semantic map respected, no emoji | Grep + visual | Lint |
| 20 | **Screenshot compare** | Page matches wireframe intent and design tokens at 1440 and 360; for redesigns, diff vs baseline reviewed; unintended diffs (>0.2 % pixels outside changed region) justified | Playwright `toHaveScreenshot` with `maxDiffPixelRatio: 0.002` on stable fixtures | Automated + review |
| 21 | **Exam shell extras** (exam routes only) | Timer tabular and server-synced; announcements at 10/5/1; autosave status visible; offline banner; no motion; text-size 125/150 % does not break layout; themes (soft/contrast) legible | Dedicated Playwright scenarios | Automated + manual |
| 22 | **Behaviour unchanged** | Polish changes touch styling/markup only; unit/e2e tests still green; no data-logic edits | `pnpm verify` | Automated |

**Definition of done for a UI task:** QA table all ✅ (or documented exceptions approved by lead), screenshots attached to PR description (matrix subset: 360/1440 × light/dark × en/bn), `pnpm verify` green, and the route appears in the internal `/design` gallery if it introduced a new component or state.

---

## Appendix A — Lint rules (package `@lumen/eslint-plugin-ui`)

| Rule | Enforces |
|---|---|
| `lumen/spacing-scale` | Only allowed spacing classes (§2.4); no arbitrary `[..px]` spacing |
| `lumen/no-raw-colour` | No hex/rgb/hsl literals or Tailwind palette names in TSX/CSS outside `tokens.css` |
| `lumen/no-colour-override` | No `bg-*/text-*` colour classes on `<Button>`/`<Badge>` etc. via `className` |
| `lumen/type-scale` | Only `text-display…caption`; no `text-sm/lg`, `font-light/thin`, `leading-*` ad-hoc |
| `lumen/icon-label` | Icon-only `<Button>` requires `aria-label`; `<Icon>` size ∈ {16,20,24,32,40} |
| `lumen/z-scale` | No numeric `z-*`; only token utilities |
| `lumen/shadcn-accent` | Flags leftover shadcn `accent-foreground` semantics |
| `lumen/no-emoji` | No emoji characters in JSX/strings except user content components |
| `lumen/i18n-no-literal` | No user-visible string literals in JSX (must use `t()`), except test ids |

## Appendix B — Open items (for lead / human)

1. **Brand identity** (logo, wordmark, final name) — tokens assume a neutral wordmark in `fg`; if the brand colour differs from Lumen blue, change only `--accent*` + scale (contrast re-check via CI script).
2. **Photography budget & shoot** (§10.1) and a **Bangla native copy editor** (§8.3) are launch blockers for marketing pages; app UI can ship with the Lucide-tile fallback and English-first copy.
3. **Legal review** of trademark/disclaimer copy (§8.5) and of the “exam-shell fidelity” approach (§4.4) — no official logos/trade dress.
4. **Gateway brand assets** (bKash, Nagad, Rocket, SSLCommerz) — obtain official SVGs/usage rules.
5. **Vidstack** licence/maintenance check at install; fallback is hls.js with a custom control set.
6. **GRE calculator**: implement our own basic calculator (add, subtract, multiply, divide, square root, sign, decimal, parentheses/memory only if the current public spec lists them); do not replicate ETS visuals.
7. Real Bangla UI testing on low-end Android (Chrome, 2 GB RAM) for blur/material performance (`data-perf="low"` thresholds).
8. ~~When `03-PRODUCT-SPEC.md` / `07-TEST-ENGINE.md` land, reconcile route names in §5~~ done in the 2026-11-07 consolidation (D2 route table, 03 §2.3, 23 App. C accepted). Attempt-state names in §3.27–3.28 / §4.4 still to be reconciled with 07 by its owner.
9. The 5-tier pricing wireframe (§5.1.5) and pricing card (§3.35) are final in structure; usability-test with 5 BD learners before launch (23 §9).

## Appendix C — Change log
- 2026-11-07 — v1.0 initial specification.
- 2026-11-07 — Routes aligned to 00-DECISIONS D2 canonical route groups (`(learner)` `/app/**`, `(exam)` `/exam/[attemptId]`, `(grader)`, `(staff)`, `(org)`, `(checkout)`) and 03-PRODUCT-SPEC fine-grained routes; superseded `(learn)`/`(test)`/`(dashboard)`.
- 2026-11-07 — Consolidation: pricing card/page rebuilt on D10 tiers and 17 (Free/Core/Plus/Live/Mentor, “5 mocks now, 10 by <date>”, no cash score guarantee); `/verify/[code]` replaces `/verify`; routes `/help` `/status` `/changelog` `/accessibility` `/guarantee` `/accuracy` and performance budgets from 23 App. C accepted; trademark footer = D12 C31 verbatim; refund copy per D12 C13b; widgets 3.41-3.48 added for 34 (tutor, flashcards/FSRS, score estimate, audio overviews, study guides/mind maps, promise tracker, PWA) plus cookie banner (GA-019), system pages (GA-023) and refund timeline (GA-021); price-test sticky-variant rule (GA-043).
