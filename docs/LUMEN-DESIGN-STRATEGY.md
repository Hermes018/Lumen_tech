# Lumen Academy: Design Strategy & Enforcement Architecture

Audience: you, plus every cheaper coding model that touches `apps/web`.
Goal: make the site feel like an institutional, calm, consumer-friendly exam-prep brand, and make it hard for weaker models to drift back to "AI card soup".

Note on sources: the current-site diagnosis comes from Gemini's written description (I have not seen the current-site screenshots). The target patterns were verified against the 4 reference screenshots attached (ETS mega-menu, BC IELTS home, BC Test dates page, BC page bottom/footer).

---

## 0. How to use this document (important for weak models)

Weak models ignore long documents. So this strategy is split into three layers:

| Layer | What | Loaded when |
|---|---|---|
| **A. Constitution** (Section 3, ~1 page) | 12 laws. Copy into `AGENTS.md` / `CLAUDE.md` / `.claude/skills/institutional-ui/SKILL.md` | **Every** task |
| **B. Reference** (Sections 4-9) | Tokens, primitives, page blueprints | Only the section relevant to the task |
| **C. Enforcement** (Section 10) | Lint scripts, tests, CI guards that **fail the build** | Automatically, whether or not the model read anything |

Principle: **do not rely on the model obeying prose. Make the wrong thing impossible to express (primitives) or impossible to merge (lint).**

---

## 1. Diagnosis

### 1.1 Current state (per Gemini's audit, accepted)
- 25-34+ bordered boxes per page, nested up to 3 deep (card > badge > "Concrete Output" box).
- No progressive disclosure: `/courses` shows 1,200+ words at once; homepage contains a 6-row tuition table; `/pricing` shows 13 boxes.
- ALL-CAPS 10-11px "eyebrow" labels on nearly every block.
- 32-48px between sections; white bordered boxes on off-white = claustrophobic.
- Reads as a B2B spec sheet, not a consumer education brand.

### 1.2 Target state (verified from your screenshots)
- Open white canvas. Structure comes from **whitespace, full-bleed color bands, sharp photography, and big type**, not borders.
- One focal point and ~30-40 words per viewport.
- Details hidden behind tabs / accordions / secondary pages / mega-menus.
- Short heroes (~300-360px tall on desktop, not full-viewport), text left, photo right with geometric offset color blocks.

### 1.3 Corrections to Gemini's analysis (do not skip)

1. **"Zero boxes" is too absolute and will mislead models.** The screenshots DO contain boxes, just rare and purposeful: the lavender notice box on BC home; the white "Still have questions?" card inside the purple band; ETS's outlined buttons and hard-shadow mega-menu. Correct rule: **no bordered/shadowed boxes for content grids. A tinted or white box is allowed only for (a) a notice, (b) one CTA card inside a color band, (c) buttons.**
2. **Gemini's numbers don't match the screenshots.** It cites "4m+, 13,500+, 100+, 90+"; the actual BC screenshot says 2m+, 5,675+, 42+, 38+. Lesson: models paraphrase from memory. Never let a model copy stats from a reference. Lumen's stats must be real (see Section 9).
3. **Copying BC's exact identity is risky.** Crimson + royal purple + lilac button + 4-dot motif + L-bar-and-circles photo frame is *British Council's* brand signature. A GRE/IELTS prep site that looks like the official IELTS partner invites a trust/trademark problem and looks derivative. Take the **structure** (band rhythm, borderless columns, 1/3-2/3 split, mega-menu tiers), not the **brand assets**. Section 4 defines a distinct Lumen skin on the same structure.
4. **Gemini ignored mobile and Bengali.** Most of your traffic is likely mobile in Bangladesh, and the site is bilingual. A mega-menu + 3-tier header design is meaningless without a mobile plan. Bengali needs different typography rules (no uppercase/tracking, taller line-height, ~25-35% text expansion). Both are specified below.
5. **Gemini ignored photography supply.** Every hero depends on human photos. You need a sourcing plan or models will hotlink or invent image URLs (Section 9.3).
6. **Gemini's proposed single big design doc is the wrong enforcement mechanism** for weaker models. A doc alone will be ignored under token pressure; hence Section 10.
7. **Word caps loosened slightly.** BC's own "Find a test date" intro is ~55 words. Caps below: column body <= 40 words, section intro <= 60 words.
8. **Mega-menu accessibility omitted.** Needs keyboard, focus, `aria-expanded`, Esc-to-close, hover-intent delay, and a tap pattern on touch. Spec in Section 7.

---

## 2. Design ethos (the "why", so judgment calls stay consistent)

1. **Calm authority.** Institutional, not startup-flashy. Sharp photo corners, confident type, restrained color.
2. **One idea per screen.** If a viewport needs a second headline, it belongs on the next screen.
3. **Whitespace is the divider.** Never draw a line where space will do.
4. **Reveal, don't dump.** Detail is one click away, never on the page by default.
5. **Show real people, real numbers.** No fake stats, no invented testimonials, no stock-illustration filler.
6. **Bilingual-first.** If it breaks in Bengali, it is broken.
7. **Light, not loud.** "Lumen" = light. Warm amber is the single bright accent; everything else is quiet.

---

## 3. THE CONSTITUTION (copy this into AGENTS.md / SKILL.md)

> **Lumen UI Laws.** Violating any of these = task failed, regardless of how it looks.
>
> 1. **Compose, don't invent.** Pages may only assemble primitives from `@/components/ui`. No raw layout `<div className>` in page files. If a primitive is missing, STOP and report; do not improvise.
> 2. **No bordered or shadowed content cards.** Allowed boxes: `CalloutNotice`, the card inside `CtaBand`, buttons. Never nest a box in a box.
> 3. **No eyebrow labels.** No ALL-CAPS micro-text above headings or inside cards. (Primitives have no `eyebrow` prop on purpose.)
> 4. **Tokens only.** No hex/rgb, no arbitrary values (`text-[10px]`, `p-[13px]`), no new colors. Use tokens from `tokens.css`.
> 5. **Whitespace budget.** Sections use `Section` (80px mobile-56 / 112px desktop vertical padding). Max 3 columns on tablet, 4 on desktop. Never reduce spacing to fit content; cut content instead.
> 6. **Word caps.** Column body <= 40 words, hero body <= 35, section intro <= 60, titles <= 10 words. Over cap = cut, not shrink.
> 7. **Progressive disclosure.** Any list > 3 items, any table, any syllabus, any FAQ goes inside `Disclosure` / `Tabs`, closed by default. No `<table>` on marketing pages outside a Disclosure.
> 8. **One primary action per section.** One filled button max; secondary actions are underlined text links.
> 9. **Never invent facts, stats, testimonials, scores, prices, or image URLs.** Content comes from `content/*` files. Missing data = `PlaceholderImage` / `TODO` marker, never a guess.
> 10. **Bilingual always.** All strings via the i18n dictionary (en + bn). No fixed heights on text containers. No uppercase/letter-spacing on Bengali.
> 11. **Protected files.** Do NOT modify `LocaleSwitcher`, `/api/translate`, or the i18n engine. Touching them fails CI.
> 12. **Prove it.** Before reporting done: run `pnpm design:lint` and `pnpm design:shots`, and paste the results. No results = not done.

---

## 4. Design tokens

Semantic names so palette can be swapped in one file without touching components.

### 4.1 Color: recommended Lumen skin ("Option A")

| Token | Hex | Use |
|---|---|---|
| `--bg` | `#FFFFFF` | Default canvas (~75% of page) |
| `--bg-tint` | `#F4EFFB` | Alternating band, mega-menu rail, notice |
| `--bg-warm` | `#F6F1EA` | Hero band (calm, consumer-friendly, distinct from BC) |
| `--brand` | `#2D006B` | Nav, footer, big numbers, H1/H2, CtaBand |
| `--brand-ink` | `#1A1038` | Body headings / darkest text |
| `--text` | `#3B3552` | Body copy (>= 7:1 on white) |
| `--link` | `#4B1FB8` | Inline links (always underlined) |
| `--accent` | `#FFB400` | "Lumen amber": ribbon, geometric photo blocks, step chevrons |
| `--soft-btn` | `#DCCBFF` | Soft CTA fill (text `--brand-ink`) |
| `--focus` | `#005FCC` | Focus ring, 3px offset |

Option B (if you want BC's literal look): swap `--bg-warm` -> crimson `#E4002B` (white text), keep the rest. Because everything is token-driven this is a one-file change. **My recommendation is A**: same structure and familiarity, but no brand-confusion risk.

ETS-track accent (`/gre` only): terracotta `#C84B31` for dashed-arrow links; this is a generic pattern, fine to use.

### 4.2 Typography
- Display / headings: **Work Sans 800** (or similar geometric grotesque). Body: **Noto Sans 400/600**.
- Bengali: **Hind Siliguri** or **Noto Sans Bengali**, loaded with `next/font` (subset), `font-display: swap`.
- Scale (fluid with `clamp`): H1 40-52px / 1.12; H2 28-36px / 1.2; H3 20px / 1.3; body 16-17px / 1.65; small 14px (never below 14px). **Bengali: +0.1 line-height, no tracking, no uppercase.**
- Links: underlined, `underline-offset-4`, 2px decoration. Buttons: 4px radius, 600 weight, sentence case (ETS-style uppercase outline button allowed on `/gre` mega-menu only).

### 4.3 Spacing / layout
- Container `max-w-[1200px]`, gutters 16 (mobile) / 24 (tablet) / 32 (desktop).
- Section padding: `py-14 md:py-20 lg:py-28`.
- Column gap: `gap-8 lg:gap-12`. Heading-to-content: 24-32px. Paragraph measure <= 65ch.
- Radius tokens: photos `0`, buttons `4px`, notice `0-4px`. Nothing larger. Shadow tokens: `none`, plus `--shadow-hard: 6px 6px 0 var(--brand-ink)` for the mega-menu panel only.
- Motion: 150-200ms ease-out, only opacity/transform; respect `prefers-reduced-motion`.

---

## 5. Layout system: the "band rhythm"

Every page is a vertical stack of **full-bleed bands**, each one a `Section` with a `tone`:

`hero(warm) -> subbar(brand) -> white -> tint -> white -> brand(CtaBand) -> footer(brand)`

- Alternate tone only when the content type changes (hero, emphasis, CTA). Default is white.
- Inside a band, content is one of a fixed set of **layouts** (the primitives in Section 6). No page invents a new one.
- Rhythm rule: no two adjacent sections with the same layout.

---

## 6. Primitive catalog (the heart of the anti-shortcut strategy)

Built ONCE by a strong model, in `components/ui/`, shown on a `/dev/ui` gallery route. Cheap models only *compose* them via typed props. Constrained props make bad output unrepresentable (no `eyebrow`, no `className` on content primitives, `title` length-checked in dev).

| Primitive | Purpose | Key props / caps | Forbidden |
|---|---|---|---|
| `Section` | Band wrapper | `tone: white\|tint\|warm\|brand`, `spacing` | borders |
| `Container` | Width + gutters | none | |
| `Heading` | h1-h3 | `level`, text <= 10 words | eyebrow, uppercase |
| `HeroBand` | Page hero | title, body <= 35w, 1 CTA, `photo` slot, `frame: "blocks"\|"petal"` | text over photo, tables |
| `SubBar` | 3 tabs under hero | <= 3 items | |
| `StatRow` | Big numbers | 3-4 stats, value <= 6 chars, caption <= 12w, `verified` flag required | invented numbers |
| `StepRow` | "How it works" | 3-4 steps: numeral square, chevron, title <= 8w, body <= 30w, optional link | boxes |
| `MediaColumns` | Photo columns | 2-4 cols: 4:3 photo, title-as-link, body <= 30w | border, shadow, rounded |
| `SplitFeature` | 50/50 photo + text | side, h2, body <= 45w, 1 CTA | |
| `SideHeadingBlocks` | 1/3 heading + 2/3 icon blocks | <= 3 blocks, body <= 40w | boxes |
| `Disclosure` / `Tabs` | Hidden detail | native `<details>` or Radix; closed by default; keyboard-accessible | auto-open |
| `CalloutNotice` | The one allowed tinted box | icon, <= 3 lines | more than 1 per page |
| `CtaBand` | Brand band + white card | title, <= 25w, 1 button | |
| `TopRibbon` | Dismissible announcement | 1 line, `localStorage` dismiss (try/catch) | |
| `UtilityBar` | Locale + secondary links | contains existing `LocaleSwitcher` untouched | |
| `MainNav` / `MegaMenu` | Header | see Section 7 | |
| `Breadcrumb` | Inner pages | | |
| `Footer` | Brand footer w/ accordions on mobile | | |
| `PlaceholderImage` | Named image slot | `slot`, `aspect` | hotlinking |
| `Button` | filled / soft / outline / link | one filled per section | |

Each primitive ships with: a dev-gallery example (en + bn), a unit test for caps, and a note listing its forbidden classes.

---

## 7. Header & mega-menu spec

### Desktop tiers
1. `TopRibbon`: amber `--accent`, `--brand-ink` text, 1 line + close.
2. `UtilityBar`: white, `h-9`, 12-13px. Left: globe + `LocaleSwitcher` (existing, untouched). Right: For Schools & Universities | Help | Log in.
3. `MainNav`: `--brand`, `h-20`. Logo + 4 triggers + soft CTA ("Take free diagnostic").

### Triggers & panels
- **"GRE & IELTS"** -> *Left-rail tab panel* (ETS pattern): rail `--bg-tint` with 3-4 tabs (GRE General Test, IELTS Academic, IELTS General Training, Which exam do I need?); hovering/focusing a tab swaps the 6 links in the center grid; bottom conversion strip with 2 actions (dashed-arrow link + outline button). Hard shadow `--shadow-hard`.
- **"Prepare & Courses"** -> *3-column editorial panel* (BC pattern): col 1 tint overview (title + <= 3 lines), col 2 underlined link list, col 3 full-bleed photo; bottom brand ribbon of quick links.
- **"Practice tests"** -> simple list panel (4 links).
- **"Pricing"** -> plain link.

### Behavior (non-negotiable)
- Hover-intent open (150ms delay), click toggles, `Esc` closes, focus trap not required but focus must move into panel on open and return on close.
- `aria-expanded`, `aria-controls`, roving tabindex in rail; visible focus ring.
- Panel content comes from `content/nav.ts` (typed, en+bn). Links are never hardcoded in JSX.
- Max 1 panel open; panel never taller than viewport minus header (scroll internally).

### Mobile (< 1024px)
- Collapse to: logo + CTA + hamburger. Drawer with accordion sections (one open at a time). Rail tabs become nested accordions. No photos in mobile menu. `UtilityBar` locale switcher moves into drawer top. Ribbon shrinks to 1 line with truncation.

---

## 8. Page blueprints (sequences of primitives + content budgets)

### `/` Home (max 5 scroll screens, no tables)
1. `HeroBand` (warm): H1 <= 10 words, 1 sentence, 1 filled CTA, photo with `frame=blocks`. `SubBar`: 3 tabs.
2. `StatRow` (white): 3-4 **verified** facts (see 9.2), then thin divider with Lumen motif.
3. `StepRow` "How Lumen works": Diagnostic -> Guided practice -> Realistic mocks (+ optional 4th).
4. `MediaColumns` "Which exam do you need?": GRE General / IELTS Academic / IELTS General Training.
5. `SplitFeature` (photo + 1 CTA): e.g. the diagnostic.
6. `CtaBand`.
- Deleted from home: tuition table, syllabus summary, tag clouds, "Concrete Output" boxes.
- Optional (only if real destination content exists): `MediaColumns` of 4 destinations. Do not ship placeholder score requirements; they must be accurate and sourced.

### `/gre` and `/ielts`
Breadcrumb -> `HeroBand` -> `SideHeadingBlocks` (format, timing, scoring) -> `Tabs` [Format & timing | How scoring works | Try a sample question] -> `MediaColumns` (4 skills/sections) -> `CtaBand`. The sample-question widget stays, but with no header box above it.

### `/courses`
`HeroBand` (short) -> filter `Tabs` (All / GRE / IELTS / Self-paced / Live) -> `MediaColumns`-style course listing (<= 3 per row: photo or color block, title, one line "for whom", price, enroll link) -> each course has `Disclosure` "View syllabus" (closed) -> `CtaBand`.

### `/pricing`
`HeroBand` -> segmented switcher `Tabs` [Full courses | Mock & AI credit passes] (3-4 plans visible at a time; plan = column with title, price, <= 4 bullets, 1 button, no inner boxes) -> `SideHeadingBlocks` (billing, split-pay, refunds) -> `Disclosure` FAQ -> `CtaBand`.

---

## 9. Content rules

### 9.1 Copy
- Write/edit copy **before** coding, in `content/*.ts` (en + bn). Weak models bloat copy; so they should not author it. Pages import copy; primitives enforce caps.
- Voice: plain, second person, no jargon, no "protocol / matrix / architecture" language.

### 9.2 Truthful social proof
- Stats and claims must be real and defensible (number of enrolled learners, mocks taken, question bank size, etc.). A new academy should not borrow "target score 330+" as a stat, and should avoid "official" wording implying affiliation with ETS/British Council/IDP. Use "official-format" or "computer-delivered format" and add a standard non-affiliation line in the footer (GRE is an ETS trademark; IELTS is jointly owned by BC/IDP/Cambridge).
- If you lack 3-4 true stats, use 2, or swap `StatRow` for a short `SplitFeature`. Never pad.
- No testimonials unless real and consented.

### 9.3 Photography (needs a decision from you)
- Sources: commissioned shoot with real Bangladeshi learners/mentors (best), or licensed stock with a consistent look (warm daylight, candid, one subject, eye-level). Photos live in `public/images/<slot>.webp`, named by slot, 4:3 and 16:10 crops pre-made.
- Models may NEVER hotlink, invent URLs, or download photos of real public figures. Until assets exist, use `PlaceholderImage` (flat `--bg-tint` with slot name in dev only).
- Budgets: hero <= 120KB WebP/AVIF, columns <= 60KB, `next/image` with sizes, lazy below fold. Mobile data cost matters.

### 9.4 Bengali
- Test every primitive in bn. Titles may wrap to 3 lines; no fixed heights; no `truncate` on content. `/api/translate` output varies in length. Components must tolerate +35%.

### 9.5 Lumen motif
Replace BC's 4-dot with an original small mark (e.g. a 3-ray "lumen" spark or half-sun) used only: above H2 on the home page and as the stat divider. One SVG in tokens, not redrawn per page.

---

## 10. Anti-shortcut enforcement (how cheaper models stay in line)

### 10.1 Known failure modes -> countermeasures

| Weak-model behavior | Countermeasure |
|---|---|
| Wraps everything in `border rounded p-4` | Lint bans `border*`, `shadow*`, `rounded-(md\|lg\|xl\|2xl\|3xl)` outside `components/ui`; content primitives expose no `className` |
| Adds tiny uppercase eyebrows | No `eyebrow` prop exists; lint bans `uppercase` + `tracking-*` outside allow-list |
| Stuffs all data on page (completeness bias) | Word caps enforced by prop validation + content tests; tables only inside `Disclosure` |
| Invents colors/sizes (`#6b4ce6`, `text-[11px]`) | Lint bans hex/rgb literals and arbitrary Tailwind values outside `tokens.css` |
| Invents stats, testimonials, image URLs | Constitution law 9; `StatRow` requires `verified`; lint bans `http(s)://` image src and `<img>` in pages |
| Skips docs under token pressure | Constitution is <= 1 page and always in context; real rules live in lint, not prose |
| Scope creep into i18n | CI step fails if diff touches protected paths |
| Says "done" without checking | Completion requires pasted `design:lint` + screenshots output |
| Rebuilds a primitive "slightly differently" | Page files may only import `@/components/ui`; duplicate-layout detection via lint on page `className` usage (must be zero) |
| Ignores mobile / Bengali | Screenshot suite runs 390/768/1440 x en/bn; fails on horizontal overflow |
| Hallucinates file paths/APIs | Task spec lists exact files to touch; "touch nothing else" + diff allow-list check |

### 10.2 `pnpm design:lint` (fail-the-build script)
1. Forbidden class patterns (above) in `app/**` and non-ui `components/**`.
2. Color/arbitrary-value literals outside tokens.
3. `<table>` on marketing routes outside `Disclosure`.
4. `className` present in any `app/**/page.tsx` JSX.
5. Content caps (words per field) via schema tests on `content/*`.
6. i18n parity: every en key has a bn key.
7. Protected-path diff guard (`LocaleSwitcher`, `/api/translate`, i18n engine).

### 10.3 `pnpm design:shots` (visual QA)
- Playwright captures each route at 390 / 768 / 1440 px in en and bn.
- Automated checks: no horizontal scroll; **count of elements with a visible border or box-shadow per page <= 6** (the numeric "zero-box" budget); min text size 14px; Lighthouse accessibility >= 95.
- You (or a strong model) review screenshots against the reference images. Humans approve; models don't self-grade.

### 10.4 Build order & who does what

| Phase | Work | Model tier |
|---|---|---|
| P0 | Tokens, `design:lint`, `design:shots`, Constitution file | Strong (Sonnet/Opus) |
| P1 | All primitives + `/dev/ui` gallery + tests | Strong |
| P2 | Header, mega-menus (desktop + mobile + a11y), footer | Strong (highest bug risk) |
| P3 | Content files (copy, caps, en+bn) | You + strong model |
| P4 | Pages one at a time: `/`, `/gre`, `/ielts`, `/courses`, `/pricing` | **Cheap models**, composition only |
| P5 | Cross-page QA, a11y, performance, final review | Strong |

Spend the expensive tokens on P0-P2 and P5: they encode all the judgment. After that, cheap models are just assembling.

### 10.5 Per-task rules for cheap models
- One route per task; give it ONLY: the Constitution, that page's blueprint (Section 8), the one relevant reference screenshot, and the primitive prop types.
- Explicit file allow-list; everything else read-only.
- Gate between tasks: lint green + screenshots reviewed by you.
- If the model reports "primitive missing", that is a P1 ticket for the strong model, not an invitation to improvise.

### 10.6 Definition of done (per page)
- [ ] `design:lint` passes
- [ ] Screenshots at 3 widths x 2 locales reviewed, no overflow
- [ ] <= 6 bordered/shadowed elements
- [ ] Every list > 3 items is in a `Disclosure`/`Tabs`
- [ ] Zero invented facts; all strings in content files; en/bn parity
- [ ] One filled CTA per section
- [ ] LocaleSwitcher and `/api/translate` untouched

---

## 11. Decisions I need from you

1. **Skin:** Option A (Lumen warm/amber, recommended) or Option B (BC-style crimson)?
2. **Photography:** shoot, license stock, or ship with placeholders first?
3. **Real stats:** what true numbers can go in `StatRow` today?
4. **Courses/pricing data:** is it stable enough to move into `content/*` now?
5. **Mobile priority:** confirm mobile (390px) is the primary review target.
6. **Footer legal line:** OK to add the non-affiliation trademark statement?
