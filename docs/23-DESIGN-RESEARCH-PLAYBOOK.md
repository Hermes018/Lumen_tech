# 23 — Design Research & Front-End Craft Playbook ("Lumen Craft")

> Status: v1.0 · 2026-11-07 · Owner: design lead · Conforms to `00-DECISIONS.md` (D3 stack, D8 design language). If this file conflicts with 00, 00 wins; if it conflicts with `08-UI-UX-DESIGN-SYSTEM.md` on a **token value or component spec**, 08 wins (this doc proposes changes to 08 via the pipeline in §3.7, it never silently overrides).
> Audience: the founder, the design lead (Opus), capture agents (Sonnet with browser tools), `ui-polisher`, implementers.
> Relationship to 08: **08 = what we build** (tokens, components, pages, QA table). **23 = how we find out what good looks like, and the craft habits that stop the result looking vibe-coded.** Do not copy tokens or component specs here; link to them (`08 §2.8`, `08 §1.1`, `08 §12`).
> Brand name is a placeholder; read it from `packages/config/brand.ts`.
> **Evidence rule:** statements about how a named site currently looks or behaves are written from background knowledge and marked **[observe & confirm]**. Sites redesign constantly; nothing marked so may enter a spec until a teardown card (§3.5) with screenshots confirms it. Prices/free tiers of tools are marked **[verify]** (the Q8 research pass in `research_notes/.../agentic_dev_tooling.md` §8 found no checked data on these tools; nothing here is cited).

## Contents

1. Ethics and legality of learning from other sites
2. Toolkit
3. Teardown method (60–90 min protocol), card template, synthesis
4. Reference set: what to study, adopt, avoid
5. Navigation and IA decisions derived from the research
6. Motion design spec (complements 08 §2.8 / §7)
7. Professional-tricks checklist
8. Templates and component sources (licence notes) + restyle rule
9. Design QA and review; prompting AI agents for UI
10. Starter research backlog (first 12 teardowns)
- Appendix A — Teardown card template (copy verbatim)
- Appendix B — Measurement snippets (DevTools console)
- Appendix C — Open items

---

## 1. Ethics and legality of learning from other sites

### 1.1 The rule in one sentence
**We learn *principles, measurements and flows*; we never take *expression*.** Hierarchy, spacing ratios, type-scale proportions, interaction timing, information architecture and conversion logic are ideas and facts; code, copy, illustrations, photos, icons, logos, custom fonts, video and the overall distinctive look ("trade dress") are protected expression.

### 1.2 Allowed vs forbidden

| Allowed (study) | Forbidden (copy) |
|---|---|
| Screenshot a page **for internal reference** (kept in `docs/design-research/assets/`, never shipped, never in marketing) | Re-using any screenshot, illustration, photo, icon, video or Lottie from another site in our product, store listing, ads or docs |
| Measure and record: font sizes, line-heights, spacing, radii, shadows, colour contrast, grid and max-widths, breakpoints | Pasting another site's HTML/CSS/JS, minified bundles, SVGs or Tailwind class strings wholesale (even "just to start") |
| Read computed styles and the Animations panel to learn **duration/easing/what animates**, then re-implement from our own tokens | Copying their keyframes/Lottie/shader files; re-using their `view-transition-name` structure or custom-element names as-is |
| Record flows (steps, fields, copy *structure* e.g. "3 steps, reassurance under CTA") and write **our own** words | Copying headlines, microcopy, FAQ, testimonials, course descriptions, instructor bios, exam questions, pricing-page prose |
| Note which stack a site uses (Wappalyzer/BuiltWith) to understand constraints | Scraping, bulk-downloading content, bypassing paywalls/logins, automating signup/checkout on live sites, or creating fake accounts to probe flows beyond what a normal user sees |
| Study "inspiration libraries" (Mobbin, Refero, Godly...) for layout patterns | Reproducing a library screenshot 1:1 ("pixel clone") of one product — even if each element is individually generic |
| Take ideas from open-source design systems **under their licence** (MIT/Apache: keep notices; MPL/GPL/CC-BY-NC: do not use without legal OK) | Using fonts, icon sets or images whose licence we have not recorded in `docs/design-research/LICENCES.md` |

### 1.3 Working rules (binding on humans and agents)
1. **Two-site minimum:** a pattern enters our system only if it appears (in some form) on ≥ 2 unrelated references, or is explained by a published guideline (HIG, NN/g, Baymard, WCAG). One site's signature move is *its brand*, not a pattern.
2. **Transform, don't trace:** every adopted pattern is re-expressed with Lumen tokens (`08 §2`), our copy (`08 §8`), our imagery (`08 §10`). If a reviewer can lay the two screens over each other and they match, reject.
3. **No competitor trade dress for exam surfaces:** exam shell follows IELTS/GRE *behaviour*, not ETS/IDP/British Council/Cambridge look (already in `08 §4.4`, `08 §8.5`). Teardowns of official exam UIs are limited to publicly available practice/demo material and the **official tutorial pages**; never use leaked or pirated material.
4. **Licence ledger:** every font, icon pack, illustration, template and component source used goes into `docs/design-research/LICENCES.md` (name, version, licence, URL, date checked, commercial OK?). Run `pnpm licenses list` in CI (08 §11.1).
5. **Terms of Service:** read the ToS of any site before automated capture (rate-limit to human speed; manual capture preferred; no logged-in areas of competitors).
6. **Attribution for inspiration:** teardown cards cite the URL and capture date; the pattern library records "adopt/adapt/avoid" with our reasoning. If challenged, this is the paper trail showing independent derivation.
7. **When in doubt, ask the founder/legal:** anything near logos, mascots, character art, music/sound, or a distinctive layout-as-brand (e.g. Duolingo's owl world, Apple's product-hero choreography) is a "do not echo" zone.

### 1.4 The "reverse-engineering tools" clarification (for the founder)
You mentioned reverse-engineering tools. **Ghidra** is the NSA's open-source *binary / compiled-software* reverse-engineering suite (disassembly/decompilation of executables and firmware). It is **irrelevant to websites** and inappropriate here: a website's front-end is already delivered to your browser as readable HTML/CSS/JS, so there is nothing to "decompile", and attempting to extract server code or protected assets would be both pointless and potentially unlawful. What you actually want is **"inspection and measurement"**, done with:

| Need | Right tool |
|---|---|
| See layout, spacing, type, colours, animations of a page you are allowed to view | Browser DevTools (Chrome/Safari/Firefox), §2.1 |
| Understand which framework/CDN/analytics a site uses | Wappalyzer / BuiltWith / DevTools Network tab, §2.2 |
| Find well-designed screens and flows to learn from | Mobbin, Refero, Page Flows, Godly, Land-book, §2.3 |
| Learn the rules behind good design | Apple HIG, Material 3, Laws of UX, NN/g, Baymard, §2.4 |

Agent rule (add to `AGENTS.md`): *"Never run decompilers, deobfuscators, bundle un-minifiers or scrapers against third-party sites. Use DevTools-visible, rendered output only. Do not paste third-party source into the repo."*

---

## 2. Toolkit

Pricing/free tiers change; every price cell is **[verify]** before anyone subscribes. Default stance: **free tools first**; pay only if the backlog (§10) proves a library saves ≥ 3 hours/week.

### 2.1 Browser tooling (free)

| Tool | What we use it for | Notes |
|---|---|---|
| **Chrome DevTools → Elements / Computed / Styles** | Real font-size, line-height, letter-spacing, padding/gap, radii, box-shadow, `max-width`, grid/flex tracks. Toggle **Grid/Flex overlay badges** to read layout structure | Take values from **Computed**, not from authored CSS (authored may be `clamp()`/`rem`) |
| **CSS Overview** (⋮ → More tools) | Palette, font inventory, unused declarations, contrast issues, media queries list | Snapshot per page; export screenshot into the card |
| **Animations panel** | Slow motion (10 %/25 %), read `duration`, `delay`, `easing`, and which properties animate; scrub keyframes | Also captures CSS transitions; for JS springs (Motion/GSAP) it shows the sampled curve — log as "spring-like ≈ 300–400 ms" |
| **Performance panel** (+ CPU 4×/6× slowdown) | Long tasks, layout/paint cost of an interaction; record a route transition | Use throttling "Mid-tier mobile" equivalent for Android realism |
| **Performance Insights / Lighthouse** | LCP/INP/CLS, render-blocking, image sizing; run **Mobile**, Slow 4G preset | Lab data only; for field data use CrUX (below) |
| **Coverage** (Ctrl+Shift+P → "Show Coverage") | % unused CSS/JS on load — informs our JS budget (08 §12 #13) | |
| **Rendering tab** | *Paint flashing*, *Layout Shift Regions*, *Layer borders*, *Core Web Vitals overlay*, **emulate `prefers-reduced-motion`, `prefers-color-scheme`, `forced-colors`, `prefers-contrast`** | Layout-shift regions are the fastest CLS audit |
| **Device emulation** | 375, 768, 1280, 1440 captures (§3.2); DPR 2/3; touch | Also test 320 and 360 for Bangladesh Android reality |
| **Network throttling** | Use **Slow 4G** (and a custom ≈ 1.6 Mbps/150 ms profile) to feel Dhaka mobile conditions; disable cache; watch what blocks first paint | Custom profile: DevTools → Network → Throttling → Add |
| **Safari Web Inspector** | WebKit rendering differences (iOS), font rendering, `-webkit-` quirks, safe-area insets, Responsive Design Mode | Needs a Mac; our founder's MacBook Air M5 qualifies |
| **Firefox DevTools** | Best **Font panel** (shows used font + variable axes) and Grid inspector | |
| **React DevTools** (Components / Profiler) | For React/Next sites: component boundaries, which parts are client vs server, re-render hotspots | Only works on non-obfuscated React builds; production builds show limited names |
| **`document.fonts` / Font panel** | Which font files really load (weights, subsets, `unicode-range`) | Important for Bangla subsetting study |
| **Screenshot tools** | Chrome "Capture full size screenshot" (Ctrl+Shift+P); Playwright `page.screenshot({fullPage:true})` for our **own** app | For competitors prefer manual capture (ToS) |
| **CrUX / PageSpeed Insights / CrUX Vis** | Field LCP/INP/CLS at p75 for public origins | Free; shows *real* user performance of competitors |

### 2.2 Stack detection and extensions

| Tool | Use | Cost | Notes |
|---|---|---|---|
| **Wappalyzer** (extension) | Stack detection (framework, CDN, analytics, payment) | Free tier limited **[verify]** | Informational only; may be wrong |
| **BuiltWith** | Tech history, spend signals | Free lookups; paid detail **[verify]** | |
| **WhatFont** / **Fonts Ninja** | Identify typefaces (then check licence — we do **not** copy proprietary fonts) | Free **[verify]** | Cross-check with Computed `font-family` |
| **CSS Peeper / ColorZilla / Eye Dropper** | Quick palette + type + spacing overlays | Free **[verify]** | Convert to contrast pairs, not to hex we reuse |
| **Pixel Perfect / Visbug / Spacing overlay** (e.g. "Pesticide", "Visbug") | Visual margin/padding inspection, grid overlays | Free **[verify]** | Visbug is great for measuring rhythm |
| **axe DevTools / WAVE / Accessibility Insights** | Quick a11y snapshot of reference sites | Free tiers **[verify]** | Learn what *not* to ship |
| **Stylebot / Page Ruler** | Measuring distances on-screen | Free **[verify]** | |
| **Window Resizer / viewport tools** | Fast viewport switching | Free | DevTools is enough |

### 2.3 Design-reference libraries

| Library | Best for | Access model **[verify]** | Caveat |
|---|---|---|---|
| **Mobbin** | Mobile + web app flows & screens (onboarding, paywalls, settings, empty states) | Free tier limited; paid for full library | Screens are other companies' IP — reference only |
| **Page Flows** | Recorded user flows (signup, checkout, upgrade) with step-by-step stills/video | Some free flows; paid for all | Great for checkout/onboarding benchmark |
| **Refero** | Searchable web-design references (pages + components), filter by pattern | Free tier limited **[verify]** | |
| **Godly** | Curated high-end sites (motion, typography) | Free browsing | Showcases are *flashy outliers*; extract typography/rhythm, not effects |
| **Land-book** | Landing-page layouts by category | Free browsing; premium **[verify]** | Landing pages only |
| **Lapa Ninja** | Landing pages + UI component collections (with categories) | Free **[verify]** | Quality uneven; many generic SaaS pages |
| **SaaS Landing Page** (saaslandingpage.com) | SaaS marketing structure (hero, pricing, social proof) | Free **[verify]** | Lots of the "template" look we must avoid; use to learn *section order*, not styling |
| **Awwwards / Siteinspire / Httpster** (optional) | Visual craft outliers | Free | Use sparingly |
| **Dribbble / Behance** | Illustration and brand styles | Free | Not UX evidence — pretty ≠ usable |

### 2.4 Principles and research sources (the "why")

| Source | Use | Notes |
|---|---|---|
| **Apple Human Interface Guidelines** (developer.apple.com/design) | Layout, typography, motion, accessibility, controls — our Apple-calm north star | Free. Apply *principles*; do not copy SF Pro files (08 §2.2.1) |
| **Material Design 3** (m3.material.io) | **Contrast reference**: state layers, tonal surfaces, motion easing sets, adaptive layouts — useful for Android-heavy audience | Free. We deliberately do **not** adopt its look |
| **Laws of UX** (lawsofux.com) | Vocabulary for critiques: Hick's, Fitts's, Jakob's, Miller's, Doherty threshold, Peak-End, Von Restorff, Zeigarnik, Goal-gradient | Free |
| **Nielsen Norman Group** articles | Evidence-based guidelines: forms, navigation, mega menus, search, dashboards, empty states, mobile | Free articles; reports paid **[verify]** |
| **Baymard Institute** | Checkout, form field, mobile commerce research | Articles partly free; full premium paywalled **[verify]** — use public articles |
| **WCAG 2.2 / ARIA APG** | Accessibility patterns (combobox, dialog, tabs) | Free |
| **web.dev / Chrome DevRel** | CWV, View Transitions, `content-visibility`, INP | Free |
| **Refactoring UI**-style craft books/courses | Visual hierarchy heuristics | Paid **[verify]**; optional |
| **Khan Academy Wonder Blocks** (public, MIT) | Pattern reference for education UI (already in 08 §11.1 as inspiration-only) | Licence check; don't copy brand assets |
| **Bangla typography references** (Google Fonts Bangla specimens, Unicode charts, Bangla press style) | Line-height, conjunct rendering, numerals | Free |

### 2.5 Agent browser capture (our own use)
Sonnet capture agents use Playwright/Chrome DevTools MCP in a throwaway profile (no logins), viewports from §3.2, to produce screenshots and `getComputedStyle` JSON (Appendix B). Playwright snapshot baselines are OS/font specific (research note §6), so **capture in one canonical environment** (Linux container/Codespace) for repeatability; human spot-check on macOS/Safari for fonts.

---

## 3. Teardown method — a repeatable 60–90-minute protocol per site

### 3.1 Principles
- **One site, one question.** Each teardown has a *decision it feeds* (e.g. "How should our course-landing sticky enrol bar behave?"), listed at the top of the card. No decision → no teardown.
- **Observe → measure → interpret → decide.** Observations and measurements are facts; interpretation is labelled as such; decisions are `adopt/adapt/avoid`.
- **Time-boxed:** 90 minutes hard stop (60 for a single-flow teardown).
- **Two profiles:** (A) Dhaka-realistic mobile (360×800, Slow 4G, CPU 4×), (B) desktop 1440 on good connection.

### 3.2 Pre-flight (5 min)
1. Create `docs/design-research/<site>.md` from Appendix A and `docs/design-research/assets/<site>/` for images.
2. Write the decision the teardown feeds (1 sentence) and 3 questions.
3. Fresh Chrome profile, no extensions except measurement ones; set locale (EN, and BN where available); clear cache.
4. Check ToS note (§1.3 #5).

### 3.3 The protocol

| Min | Step | Output |
|---|---|---|
| 0–5 | Pre-flight | Card skeleton |
| 5–15 | **Capture matrix.** Full-page screenshots at **375, 768, 1280, 1440 px**, **light and dark** if supported (emulate `prefers-color-scheme` in Rendering tab; if site has a toggle use that). Name `assets/<site>/<page>-<vp>-<theme>.png`. Also capture hover/focus/active of primary CTA and a nav item | 8 screenshots/page (4 vp × 2 themes), ≤ 3 key pages |
| 15–25 | **Navigation map.** Click through the global nav, footer, mobile menu, search, account menu. Draw a tree: top-level items → children → depth. Note sticky behaviour, mega-menu trigger (hover/click), breadcrumb use, language switcher location, number of items (Miller's 5–9) | Mermaid/ASCII tree + notes |
| 25–45 | **Measure** (Appendix B snippets): type scale (distinct `font-size / line-height / weight / letter-spacing` combos and where used), spacing rhythm (section padding, card padding, gaps), grid (columns, gutters), **max widths** (content, prose), radii, shadows, border usage, colours (as roles + contrast ratios), icon size/stroke, button heights, input heights, tap targets | Tables in card §4 |
| 45–55 | **Motion log.** Animations panel at 25 % speed: record hover, press, menu open, accordion, route transition, scroll reveals, loading states. For each: trigger, element, property, duration, easing/spring-like, delay/stagger, reduced-motion behaviour (emulate) | Motion log table |
| 55–70 | **Content & conversion analysis.** Content hierarchy (what is H1, what's above the fold at 375 and 1440, scan path), CTA strategy (primary/secondary, wording, count, repetition, sticky), trust signals (logos, ratings, counts, guarantees, payment marks, instructor credentials — note *which are verifiable*), pricing presentation (anchoring, billing toggle, what's included lists, currency/local payment cues), onboarding steps (count, fields, skippable?, progress cue), empty states (teach?), error states (copy formula, recovery), loading states | Card sections 5–9 |
| 70–80 | **Performance.** Lighthouse mobile (Slow 4G): LCP/INP(TBT proxy)/CLS + transfer size + JS size; CrUX p75 for origin; first-load requests; fonts loaded; image formats; `Coverage` % unused. Note LCP element | Perf table |
| 80–90 | **Interpret & decide.** 5–10 *patterns* with evidence → `adopt / adapt / avoid` + the Lumen mapping (which 08 token/component/page) + risk. Add 3 "what they do badly" | Card §10–11; open PR to pattern library |

### 3.4 What to measure — details

| Dimension | How | Record as |
|---|---|---|
| **Type scale** | Console snippet B1 gathers distinct font tuples by frequency; tag them display/title/body/caption | table: role, px/rem, line-height ratio, weight, tracking, font family |
| **Line length** | Measure prose container in `ch` | e.g. `66ch` |
| **Spacing rhythm** | Inspect section padding (top/bottom), card padding, gaps; compute base unit (GCD) | "base 8; section 96/64; card 24; list gap 12" |
| **Grid & widths** | Grid overlay; container `max-width` at 1440; side gutters at 375/768 | columns, gutter, max-width |
| **Radii / shadows / borders** | Computed; list distinct values and where | Does it use shadow or hairline? |
| **Colour roles** | Pick background, surface, text-1/2/3, accent, success/danger. Compute contrast (DevTools picker) | pairs + ratios; **never copy hex into our tokens** |
| **Hit areas** | Computed height/width of buttons, nav links, form fields at 375 | ≥ 44 px? |
| **Motion** | §3.3 min 45–55 | duration/easing |
| **Z-layers** | Sticky nav height, banner, chat widget overlap | note collisions |
| **CWV** | Lighthouse + CrUX | LCP/INP/CLS |
| **Content weight** | Hero image KB, video autoplay, fonts KB | KB per asset |

### 3.5 Teardown card — see Appendix A (template). File: `docs/design-research/<site>[-<flow>].md`.

### 3.6 Synthesis into a pattern library
After every 3 teardowns, the synthesis agent (Opus) updates `docs/design-research/PATTERNS.md`:

| Field | Meaning |
|---|---|
| ID / name | `PAT-014 sticky-local-nav` |
| Problem | What decision/situation |
| Evidence | Sites + links to cards (≥ 2) or guideline |
| Verdict | **Adopt** (use as is, restyled to tokens) · **Adapt** (change X for our context, e.g. Bangla length, low bandwidth) · **Avoid** (and why: dark pattern, a11y, perf, brand fit) |
| Lumen mapping | Component / page / token in 08 (`§3.19 Course card`, `§4.3`, `§7.3`) |
| Accessibility / perf notes | |
| Status | proposed → accepted by lead → implemented (PR link) |

### 3.7 From pattern to spec (pipeline)
`teardown card → PATTERNS.md (proposed) → design crit (§9.1) accepts → PR to 08 (token/component/page change) with the pattern ID in the change log (08 Appendix C) → implementers build from 08, never from the teardown`. Implementers are **not** given competitor screenshots as the target; they are given 08 + our tokens (§9.4), so we do not drift toward imitation.

---

## 4. Reference set — what to study, adopt, avoid

All "current design" statements are background knowledge: **[observe & confirm via screenshots]**. "Study" = what to look at; "Adopt/Adapt" = candidate patterns (subject to §1.3 and §3.6); "Avoid" = pitfalls for us.

| # | Site | Study (navigation, layout, decision cues) | Adopt / adapt | Avoid / pitfalls |
|---|---|---|---|---|
| 1 | **apple.com** (product pages, Education/Support) | Product storytelling: one idea per viewport, headline → short supporting line → visual → link ("Learn more" / "Buy"). **Sticky local nav** (product name left, section links, Buy CTA right) that appears after the hero. Very large display type with tight tracking, generous whitespace, restrained motion (scroll-synced images are their signature — study, don't echo). Section rhythm: alternating light/dark or tinted bands, consistent 80–120 px vertical gaps. Support/Education pages: calm search-first IA, topic grids, clear "contact" ladders **[observe & confirm]** | Adopt: local sticky sub-nav on `/ielts`, `/gre`, `/courses/[slug]` (anchor links: Overview · Syllabus · Instructor · Reviews · FAQ + sticky price/Enrol); one-idea sections; big type with `balance` wrapping; light/tinted band rhythm. Adapt: bring Apple's restraint to a *content-rich* learning site (more real data per screen) | Don't copy scroll-jacking or heavy scroll-linked product animation (perf on mid Android, a11y, exam-prep users want information density). Don't copy product photography style/hero choreography (trade dress). Don't make marketing so sparse that syllabi, prices and instructors are hidden |
| 2 | **khanacademy.org** | Course → unit → lesson → skill hierarchy; mastery levels UI (Not started / Attempted / Familiar / Proficient / Mastered, per the Khan help centre cited in the UX gap-fill note §1), course mastery %, unit test/course challenge. Teacher/parent dashboards: class roster, assignments, progress heatmaps. Friendly illustrated tone, low-friction free access **[observe & confirm]** | Adopt: explicit mastery ladder with fixed points and a "Mastered only via unit test" gate; course % = skills at Proficient+ (gap-fill note inference); unit-page lists with per-skill level chips; parent view with weekly summary. Adapt: replace illustration style with our photography/diagram rules (08 §10); add exam-target language ("Reading 6.5 → 7.5") | Don't import their mascot/characters/style. Avoid overly long unit pages without sticky progress. Avoid child-targeted tone for adult IELTS/GRE learners |
| 3 | **10minuteschool.com** (Bangla-first) | Bangla-first catalogue, course-landing pages (instructor card, "what you'll learn", curriculum accordion, sticky enrol with price + discount), **checkout with bKash/Nagad/cards**, local trust cues (student counts, instructor credentials, free-class previews, "money-back" language), mobile-heavy layout, heavy use of promo banners **[observe & confirm]** | Adopt: Bangla-native copy placement and font sizing; local payment marks near price and in checkout; free class preview and sample material on course page; clear refund statement; instalment explanation. Adapt: keep trust cues but *verifiable* (08 P6); calmer density than banner-heavy layouts | Avoid countdown/urgency banners that reset, inflated social-proof counts, cluttered promo ribbons, many competing CTAs on mobile. Bangla UI at tiny sizes (see 08 §2.2.2). Don't mimic their brand colours/illustrations |
| 4 | **coursera.org**, **udemy.com** | Catalogue filters (level, language, duration, rating, price/subject), result cards, sorting; **course landing anatomy** (hero + sticky card with price, "this course includes", learning outcomes, curriculum, instructor, reviews, related); **player** (Udemy: transcript, notes, Q&A, speed, shortcuts per gap-fill note §2); Coursera: weekly goals/deadlines **[observe & confirm]** | Adopt: filter bar + chips + result count + clear-all; "This course includes" list; curriculum accordion with durations and preview badges; player right panel (Contents/Transcript/Notes) with keyboard shortcuts; sort + filter state in URL. Adapt: bottom-sheet filters on mobile (08 §4.3); fewer, more curated courses than marketplaces | Avoid marketplace clutter (dozens of cards with identical styling), fake "was ₹/$$$" strikethrough pricing, upsell modals, coupon timers. Avoid hiding price details until late. Avoid autoplay trailers on mobile |
| 5 | **duolingo.com** | Onboarding (goal, level, daily commitment, **first lesson before signup** pattern), streak/goal UI, XP, league, celebratory-but-clean feedback; sound/haptics; "playful but clean" typography and colour discipline; one primary action per screen **[observe & confirm]** | Adopt: try-before-signup diagnostic (our Free tier: diagnostic test), one-question-per-screen onboarding with progress bar and back, daily goal picker, streak widget with freeze rule explained (cited stats in gap-fill note §1). Adapt: calmer — no mascot, no confetti, no guilt notifications (08 P5/P6) | Avoid dark-pattern guilt ("don't make us sad"), streak anxiety for adults with jobs, gamified clutter in the exam shell, loud sounds, pay-to-continue interruptions mid-session |
| 6 | **magoosh.com**, **e2language.com** (+ other test-prep: Manhattan Prep, Kaplan, Princeton Review as optional) | Test-prep **dashboards**: score predictor, accuracy by topic, study schedule, question-bank filters, explanation video; **pricing tables** (tiers, duration, score guarantee); free trial/diagnostic funnels. E2 (YouTube-led IELTS/TOEFL/GRE) — free content funnel, course-bundle pages **[observe & confirm]** | Adopt: dashboard with "estimated band + confidence", weakest-topic list, "next best action" card; pricing table with tier names matching D10 and a "compare plans" expand; free resources hub. Adapt: Magoosh-style predictor needs calibration data (gap-fill note inference) — ship a transparent heuristic with range | Avoid unverifiable "guaranteed score" language; avoid pricing tables with 15 rows of tiny ticks; avoid long-scroll sales pages with repetitive CTAs; avoid predictor with false precision |
| 7 | **British Council IELTS prep / IDP IELTS / Cambridge / ETS** (official-feel) | Official practice tests and tutorials: **exam interface logic** — header with candidate/timer, split panes, question navigator, highlight/notes, review screen, headphone check; the "formal, neutral" tone **[observe & confirm]** | Adopt (behaviour only): split pane + independent scroll, navigator by part, review screen, timer hide/show, section transitions, pre-test system check. Adapt: our flat exam chrome (08 §4.4) | **Do not** replicate logos, colours, wordmarks or exact layout (trade dress/confusion — 08 §4.4, §8.5). Don't claim "official". Keep disclaimers |
| 8 | **linear.app**, **stripe.com**, **vercel.com** | Precision craft: type hierarchy, tight tracking, hairline borders, subtle shadows, **dark mode** done as its own system, consistent iconography, performance, **docs** (Stripe docs: 3-pane, copyable code, language switcher; Vercel docs/Geist) **[observe & confirm]** | Adopt: hairline + low-alpha shadow elevation, keyboard-first (⌘K, shortcuts), fast navigation feel, changelog/status transparency, docs-style help centre layout, product screenshots with real UI instead of art. Adapt: replace dev-tool dark-first tone with exam-prep warmth | Avoid dev-tool aesthetics that are cold for students (neon glows, grid backgrounds, gradient text, mesh gradients — these are *the* vibe-coded clichés). Don't copy Stripe's gradient hero or Linear's glow |
| 9 | **notion.so** | Empty states that teach, onboarding checklists, templates gallery, sidebar IA, settings structure, ⌘K; friendly neutral illustrations **[observe & confirm]** | Adopt: empty states with one-line why + one action + optional sample data; onboarding checklist in dashboard rail; template-like "study plan starters". Adapt: real data in empty states (sample mock) | Avoid illustration-heavy empty states that waste space; avoid endless nested sidebars |
| 10 | **headspace.com / calm.com** | Calm tone: soft palette, rounded forms, breathing room, slow gentle motion, copy that reduces anxiety; sleep/focus sessions; progress without pressure **[observe & confirm]** | Adopt (tone, not style): anxiety-reducing microcopy around mock tests and results ("Estimated band, not official"), gentle completion states, quiet streak messaging. Adapt: study-break/"breathing before the test" optional tile | Avoid pastel blobs and organic-shape clichés; avoid wellness vagueness; avoid long onboarding quizzes before value |
| 11 | **Optional extras**: Brilliant (interactive learning), Quizlet (decks), Anki (spaced repetition), Grammarly/Hemingway (writing feedback UI), Typeform (one-question forms), Airbnb (filters/sheets), Wise (money clarity), Notion Calendar, Arc/Raycast (command palettes) | Targeted flows: vocab decks, writing feedback highlights, forms, filter sheets, payment clarity | Case by case | Don't dilute; each requires a stated decision |

### 4.1 Cross-reference decision cues table (what each pattern informs in our docs)

| Our surface | Primary references | Feeds |
|---|---|---|
| Home/marketing | Apple, Linear, Stripe, 10MS (local trust) | 08 §5.1.1 |
| Exam hub `/ielts` | Apple product page + Magoosh | 08 §5.1.2 |
| Catalogue + filters | Coursera, Udemy, Baymard filters | 08 §5.1.4 |
| Course landing | Udemy, 10MS, Apple sticky local nav | 08 §5.1.3 |
| Pricing | Magoosh, Linear, Stripe | 08 §5.1.5, §3.35 |
| Checkout | 10MS, Baymard, Stripe checkout | 08 §5.1.6 |
| Onboarding | Duolingo, Notion, Typeform | 08 §5.1.8 |
| Dashboard | Khan, Magoosh, Linear | 08 §5.1.9 |
| Course player | Udemy, Khan, Coursera | 08 §5.1.10 |
| Exam shell | Official exam tutorials (behaviour only) | 08 §4.4 |
| Results | Magoosh, Khan, Apple Health-style summaries | 08 §5.1.18 |
| Studio/admin | Linear, Stripe, Vercel | 08 §4.5 |
| Help centre | Stripe docs, Apple Support | new page (see §5.6) |

---

## 5. Navigation and IA decisions derived from the research

These are **proposals that refine 08 §4**. Each lists the evidence pattern; accepted items must be merged into 08 via §3.7. Where 08 already fixes something, this table just records the research rationale.

### 5.1 Route-group navigation matrix

| Route group | Primary nav | Secondary nav | Search | Breadcrumbs | Mobile | Locale switch | Footer |
|---|---|---|---|---|---|---|---|
| `(marketing)` | Top nav (64 px sticky, 6–7 items max): **Courses ▾ · IELTS · GRE · Free tests · Pricing · Institutions** + Sign in + **Start free** (one filled CTA) | **Local sticky sub-nav** on exam hubs and course pages (Apple pattern): section anchors + price/Enrol; appears after hero | Search icon opens ⌘K palette (public content only); `/` shortcut | Only on depth ≥ 3 (`Courses › IELTS › Reading Masterclass`); JSON-LD `BreadcrumbList` | Menu button → full-height sheet; sticky bottom enrol bar on course pages | Segmented "EN \| বাংলা" in top nav (right, before Sign in) and in footer | Full footer (5.5) |
| `(auth)` | None (logo only, not a nav) | — | — | — | Single column | Small text switch top-right | Minimal legal links |
| `(checkout)` | Logo (non-link or link with confirm), steps indicator (1 Plan · 2 Details · 3 Pay) | — | — | Steps replace breadcrumb | Sticky order summary bar; Pay CTA pinned | Allowed top-right | Payment marks, refund policy, support, legal (Baymard: keep reassurance, remove distractions) |
| `(learner)` | Sidebar (264/72): **Home · Learn · Practice · Tests · Planner · Progress** (+ Settings in footer block) | Tabs inside pages; right rail | ⌘K in top bar (personal content + actions) | Top bar, ≤ 2 levels, only on drill-down pages (lesson, results) | Bottom tabs: **Home · Learn · Practice · Tests · Me** | In avatar menu (+ Settings) | None (app); legal in Settings |
| `(exam)` | None (chrome-less) | Navigator in footer | Disabled | None | Same shell, stacked panes | Locked per attempt (instructions language fixed) | None |
| `(studio)` `(grader)` `(staff)` `(org)` `(admin)` | Compact sidebar 224/56 by role | Tree/list + inspector | ⌘K role-aware with actions (Linear pattern) | Workspace/entity breadcrumb (e.g. `Courses › IELTS Reading › Lesson 3`) | Read-only essentials | In avatar menu | None |

### 5.2 Search (⌘K)
- One palette component (`08 §3.15`) with **scoped providers per group**: public (courses, free tests, blog, help), learner (+ my lessons, notes, bookmarks, planner actions), staff (+ users, orders, tickets, questions).
- Evidence: Linear/Notion/Stripe docs (palette + `/` focus), Apple support (search-first help). Search results show **type icon + title + path**, recent items when empty; Bangla and Banglish aliases (08 §3.15).
- Mobile: search icon → full-screen sheet with recent + suggestions; keep keyboard open on focus; **autocomplete off for query field but search suggestions on**.
- Visible hint: "Search `⌘K`" chip in top bar (discoverability: NN/g notes that hidden shortcuts need visible affordances).

### 5.3 Breadcrumbs
- Marketing: JSON-LD always; **visible** only on ≥ 3 levels or when arriving from search (Baymard/NN/g: breadcrumbs help deep-link visitors). Collapsed middle items (`…`) on mobile.
- App: top-bar breadcrumb ≤ 2 levels (08 §4.3); a page title (not breadcrumb) is the primary orientation cue; back button on mobile drill-down.
- Studio: full path with entity type chips; copy-link affordance.

### 5.4 Mobile bottom tabs (learners)
Keep the five tabs in 08 §4.3 (**Home · Learn · Practice · Tests · Me**). Research-derived rules: (1) never more than 5 (Material/HIG); (2) labels always visible; (3) active state = colour + weight, not colour alone; (4) the tab bar hides in the lesson player landscape mode and the exam shell; (5) the tab keeps its own back stack; reselecting the tab scrolls to top (iOS convention); (6) badge only for real unread/overdue items (no pulsing).

### 5.5 Footer architecture (marketing)
Four link columns + legal strip (Apple/Stripe pattern) — wording is ours:

| Column | Links |
|---|---|
| **Learn** | IELTS Academic · IELTS General Training · GRE · Free tests · Vocabulary · Study plans |
| **Product** | Pricing · How mock tests work · Score reports · AI feedback · For institutions |
| **Support** | Help centre · Contact · Refund policy · Payment help (bKash/Nagad/cards) · System status |
| **Company** | About · Instructors · Blog · Careers · Accessibility statement |
| **Strip** | © year · Privacy · Terms · Cookie settings · Language (EN \| বাংলা) · payment marks · **trademark disclaimer (verbatim 08 §8.5)** |

Rules: no more than 5 links per column visible on mobile (accordion groups); every link an actual page; no "coming soon" links; footer contrast ≥ 4.5:1.

### 5.6 Additions proposed to the route table (for lead acceptance)
- `/help` (searchable help centre, article pages with feedback — Apple Support/Stripe docs pattern).
- `/status` (public status page link; Linear/Vercel trust pattern).
- `/changelog` (optional; builds credibility).
- `/accessibility` statement.
- `/design` internal gallery already in 08 DoD.

### 5.7 Bilingual switcher placement
- Marketing: top-nav right, **before** Sign in, as a segmented control "EN | বাংলা"; also footer. Never flags (08 §1.1). Keep the active locale highlighted; switching preserves current route (`hreflang` alternate, cookie persisted, no auto-redirect by IP — Google guidance and respect user choice).
- App: Settings + avatar menu; first-run chooses language on step 1 of onboarding (large two-option cards, not a dropdown).
- Exam: language fixed per test; show it in the pre-test confirm screen.
- Mixed-language content: UI language and content language are independent settings (e.g. Bangla UI with English IELTS passages) — the switcher changes UI only; show a small "Content: English" chip on lesson/test pages.

### 5.8 Other IA decisions
| Decision | Rationale / evidence | Applies to |
|---|---|---|
| Max 7 top-nav items; mega panel only for Courses | Miller + NN/g mega-menu guidance | Marketing nav |
| "Free tests" is a top-level item, not buried | Diagnostic-first funnel (Duolingo try-before-signup; Magoosh trial) | Nav, hero |
| Pricing reachable in ≤ 1 click everywhere | Trust, Baymard/NN/g | Nav, course page |
| Course page has 5 anchored sections with sticky local nav | Apple local nav + Udemy anatomy | `/courses/[slug]` |
| Dashboard = "continue + next best action + goals" first | Khan/Magoosh dashboards | `/app` |
| Filters in URL, shareable, with result count | Coursera/Udemy | Catalogue, practice bank |
| Settings split: Profile · Learning · Notifications · Privacy · Billing | Notion/Stripe settings | `/app/settings` |
| One consistent "Resume" affordance (card on Home, ⌘K item, tab badge) | Goal-gradient, Zeigarnik | Learner |

---

## 6. Motion design spec (complements 08 §2.8 and §7)

08 already defines the tokens (`duration-*`, `ease-*`, `spring.*`), the micro-interaction table (§7.3), the reduced-motion table (§7.4) and the exam-shell rule (§7.5). **This section adds**: the research-derived principles, a full approved-animation catalogue with *implementation recipes*, and engineering rules. Values must use 08 tokens; where this catalogue gives numbers, they are expressed in those tokens.

### 6.1 Principles
1. **Purposeful** — each animation answers one of: *what changed? where did it go? what can I do?* If it answers none, delete it.
2. **Quick** — UI ≤ 300 ms, data/hero ≤ 500 ms; perceptible response to input ≤ 100 ms (Doherty threshold, Laws of UX).
3. **Interruptible** — new input cancels/redirects the running animation (springs retarget; CSS transitions on state, not keyframes); never block clicks while animating.
4. **Asymmetric** — exits ≈ 25 % faster than enters (08 §2.8).
5. **One at a time per region**; no looping decoration; no motion that competes with reading.
6. **Predictable physics** — springs with damping ratio ≥ 1 (no bounce) as in 08.
7. **Degrades gracefully** — every animation has a reduced-motion version (opacity-only or instant) and a no-support fallback.

### 6.2 Approved catalogue

| # | Animation | Trigger | Spec (tokens from 08) | Implementation | Reduced motion |
|---|---|---|---|---|---|
| M1 | **Button press** | pointerdown | `scale(.98)`, `spring.snappy`; colour 150 ms (`fast`) | Motion `whileTap` or CSS `:active{transform:scale(.98)}` + `transition: transform var(--dur-fast)` | Remove scale, keep colour change |
| M2 | **Hover lift (cards)** | hover (pointer: fine only) | shadow `sm→md` 200 ms (`base`) + translateY ≤ 2 px | CSS under `@media (hover:hover)`; animate `box-shadow` only on small cards (promote with pseudo-element opacity swap for large) | Shadow change only |
| M3 | **Card expand / accordion** | click | height `base` 200 ms `standard`; chevron 150 ms; content fade after 60 ms | CSS `grid-template-rows: 0fr→1fr` (animatable in modern browsers) or Motion `animate` height on small lists | Instant, fade 100 ms |
| M4 | **Route/page transition** | navigation | Cross-fade content region 200 ms `standard`; shell static | View Transitions API (see 6.3) with fallback to no animation | Instant |
| M5 | **Shared element: course card → course page hero** | click card | Thumbnail morph 300–500 ms `emphasized` (08 §7.2 max 3 in product) | `view-transition-name: course-thumb-${id}` on the card image and hero image; unique per item (set only on the clicked card to avoid duplicate-name errors) | Instant swap |
| M6 | **List stagger** | first paint of a list | `fadeUp` 200 ms; stagger **30–40 ms**, max 8 items, first paint only (08 §2.8) | Motion variants `staggerChildren: 0.035` or CSS `animation-delay: calc(var(--i) * 35ms)` | None (opacity 100 ms at most) |
| M7 | **Skeleton shimmer (subtle)** | loading > 300 ms | Neutral base `surface-2`, highlight +3 % lightness, 1.6 s linear, only on content skeletons; **not** in exam shell | CSS gradient background-position animation on a single element; `will-change: background-position` avoided; paused when offscreen | Static `surface-2` |
| M8 | **Number ticker (scores, streak)** | first reveal per session | 400–600 ms `standard`; tabular numerals; stop at final value; announce final value only to SR (`aria-live` off during count) | Motion `useSpring`/`animate(0, value)` writing `textContent` via `useMotionValueEvent`; render final value in `<span class="sr-only">` | Final value instantly |
| M9 | **Progress ring / bar fill** | value change | 500 ms (`slower`) `standard` from previous value; ring via SVG `stroke-dashoffset` | `pathLength=1` + `strokeDasharray=1` + animate `strokeDashoffset`; bars via `transform: scaleX()` with `transform-origin:left` (not width) | Instant |
| M10 | **Completion check** | lesson/question complete | Ring → success fill 150 ms; check path draws 250 ms (08 §7.3) | SVG path `pathLength` animation | Instant check |
| M11 | **Celebration** | milestones | **Confetti is banned** (08 §7.3 "no confetti"). If a future A/B approves: ≤ 1.2 s, ≤ 40 particles, once per milestone, off for reduced-motion, never in exam or results screens. Default = calm card with check mark 300 ms | — | Static card |
| M12 | **Toast** | event | In: 8 px + fade 200 ms; out 150 ms; auto-dismiss 5 s (errors persist); swipe-to-dismiss on touch | Sonner with tokenised classNames | Fade 100 ms |
| M13 | **Sheet / drawer** | open | `spring.sheet` (no overshoot) ≈ 300 ms; scrim fade 200 ms; drag-to-dismiss with velocity | Vaul (bottom), Radix Dialog (side) | Fade 100 ms |
| M14 | **Dialog / popover / menu** | open | Fade + 4 px translate + scale .98→1, 200 ms; origin-aware (transform-origin from trigger) | Radix + CSS (`data-state`) | Fade 100 ms |
| M15 | **Tab / segmented indicator** | change | `layoutId` shared, `spring.snappy` | Motion `layoutId` | Instant |
| M16 | **Scroll-linked reveal (limited)** | element enters viewport | Allowed only for: marketing section headings and one product screenshot per section; fade + 12 px up, 300 ms, **once**; never hides content before JS (SSR visible by default) | `IntersectionObserver` or CSS `animation-timeline: view()` with `@supports`; default state visible | Disabled (visible) |
| M17 | **Sticky header materialisation** | scroll > 8 px | Material + hairline fade 150 ms | CSS class toggle via `IntersectionObserver` sentinel (not scroll listener) | Instant |
| M18 | **Parallax** | — | **Banned.** | — | — |
| M19 | **Auto-playing loops / floating blobs / animated gradients / typewriter text** | — | **Banned.** | — | — |
| M20 | **Form error** | validation | Border/message fade 150 ms; no shake (08) | CSS | Instant |
| M21 | **Drag & drop** | pickup/drop | Lift `shadow-md` + 1.02 scale 150 ms; drop `spring.smooth` | dnd-kit overlay | No scale; shadow only |
| M22 | **Top progress bar (slow nav)** | nav > 300 ms | 2 px accent bar, ease-out to 80 %, completes on load | `useLinkStatus`/router events, CSS transform | Static bar |
| M23 | **Skeleton → content swap** | data arrives | 150 ms cross-fade; identical dimensions | CSS opacity | Instant |
| M24 | **Exam shell** | — | **Near-zero motion** (08 §7.5): instant question swap; timer threshold banner fade 100 ms only | No Motion providers mounted in `(exam)` layout; separate lightweight CSS | — |

### 6.3 View Transitions in Next.js with fallbacks
- Native API: `document.startViewTransition()`; CSS `::view-transition-old/new(root)`. In Next.js 16/React, there are framework/React-level hooks for view transitions (React's `<ViewTransition>` component and Next config flag) — **verify against the Next 16 docs at implementation time**, as the integration was experimental/changing **[verify]**.
- Rules:
  1. **Progressive enhancement:** feature-detect `document.startViewTransition`; otherwise navigate without animation. No polyfill that adds JS weight.
  2. Exclude shell from the fade: give nav/sidebar/tab bar `view-transition-name: shell-nav` etc. with `animation: none` so only `<main>` cross-fades.
  3. Default `::view-transition-group(root){animation-duration:200ms}`; custom easing via `animation-timing-function: var(--ease-standard)`.
  4. Shared element names must be **unique at transition time**; set `view-transition-name` dynamically only on the clicked card (inline style on click), clear after.
  5. Do not use during route changes inside `(exam)`; do not use on slow devices flag (`navigator.deviceMemory < 4` or `Save-Data`) **[observe & verify support]**.
  6. Reduced motion: `@media (prefers-reduced-motion: reduce){ ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*){animation:none!important} }`.
  7. Test in Chrome, Safari (supports same-document transitions in recent versions **[verify]**), Firefox (may lack support → fallback path must be tested).
  8. Never gate navigation on animation completion; skip transition when user navigates again.

### 6.4 Performance rules
| Rule | Detail |
|---|---|
| **Animate only `transform` and `opacity`** | Everything else triggers layout/paint. Exceptions in 08 §7 principles (small accordion height). Progress bars via `scaleX`, ring via `stroke-dashoffset`. |
| `will-change` sparingly | Only on elements about to animate (add on pointerenter/mount, remove after); never blanket `will-change: transform` on lists (memory on low-end Android) |
| Avoid layout thrash | No read-after-write of layout props in loops (`offsetHeight` after style set); batch with rAF; use `ResizeObserver`/`IntersectionObserver` instead of scroll listeners |
| 60 fps on a mid Android | Test on Chrome remote debugging with a real Redmi/Samsung A-series class device or 4× CPU throttle; budget ≤ 10 ms JS per frame |
| Cap simultaneous animations | ≤ 6 animated elements concurrently; stagger max 8 items |
| No blur animation | `backdrop-filter` is static; never animate blur radius (08 P4) |
| Lazy-load motion lib on marketing | Use `LazyMotion` + `domAnimation` features (smaller bundle) outside app; keep Motion out of exam bundle |
| GPU memory | Avoid large `backdrop-filter` regions on mobile (fallback to opaque surface when `prefers-reduced-transparency` or low-end detection) |
| CLS safe | Animations never change layout size of siblings |
| Measure | Chrome Performance panel "Frames" and "Layers" check on every PR touching motion (ui-polisher) |

### 6.5 Testing motion
- Playwright: `emulateMedia({reducedMotion:'reduce'})` snapshot; assert no `animation-name` ≠ none in `(exam)` DOM (computed-style script).
- Record 5-second screen capture of each approved animation on 4× CPU throttle; reviewer checks dropped frames.
- Add a `/design/motion` gallery page showing M1–M23 with live controls (duration/ease readouts) so the crit can evaluate them together.

---

## 7. "Professional tricks" checklist

The craft layer separating polished sites from vibe-coded ones. Complements `08 §1.1` (anti-vibe checklist) and `08 §12` (QA). Items marked **(08)** are already specified there; this list gives the *how* and the audit hook. Tick per page in the PR template.

### 7.1 Typography details
- [ ] **Optical alignment:** icons optically centred to text x-height; large type left edge optically aligned (display text often needs `margin-left: -0.04em` for glyph side bearing); circular/triangular glyphs (play icons) nudged 1–2 px; button label baseline centred with icon. **(08 P2)**
- [ ] `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs (avoid orphans); fallback is graceful. **(08)**
- [ ] **Tabular numerals** (`font-variant-numeric: tabular-nums`) for scores, prices, timers, tables; `lining-nums` in data UI; proportional in prose. **(08)**
- [ ] **Hanging punctuation** for quotes in testimonials (`hanging-punctuation: first` supported in Safari; elsewhere emulate with negative text-indent equal to opening quote width).
- [ ] Real **typographic characters**: curly quotes, en/em dashes, ×, ≥, proper minus (−), non-breaking space between number and unit (`7.5 band`), thin space before `%` optional; ellipsis `…` (not `...`). Bangla danda `।` for sentence end, not `|`.
- [ ] **Measure:** 45–75 characters for prose (`max-width: 65ch`); line-height ≥ 1.5 for body Latin, ≈ 1.7 Bangla. **(08 §2.2.2)**
- [ ] No more than 2 families (Inter/SF + Noto Bengali); weights 400/500/600/700 only. **(08)**
- [ ] Negative letter-spacing only on display sizes (Latin); **zero tracking for Bangla**. **(08)**
- [ ] Use `font-optical-sizing: auto`; `font-feature-settings` only when needed (`"ss01"`, `"cv11"` for Inter alternate forms if chosen — test in Bangla mixed text).
- [ ] Links in prose: underline with `text-underline-offset: 0.15em; text-decoration-thickness: 1px`; skip-ink on.

### 7.2 Font loading strategy (Next.js)
- [ ] `next/font` (self-hosted at build; no runtime Google request) with `display: swap` and **`adjustFontFallback`** to generate a `size-adjust`/`ascent-override` fallback and avoid CLS. **(08 §2.2.1)**
- [ ] **Subset Bangla:** `subsets: ['bengali']`, weights 400/500/600 only (+700 only if display needs); preload Bangla **only on `bn` locale layout**; split by `unicode-range` so Latin-only pages never download Bangla. Measure: Bangla font transfer ≤ 90 KB for first view **[verify actual sizes]**.
- [ ] Variable font for Inter (one file) with `opsz`; avoid loading 6 static weights.
- [ ] `font-display: optional` for non-critical fonts (mono) to prevent late swaps.
- [ ] Fallback stack metric-tested: render Bangla with system fallback (Noto on Android, Nirmala UI on Windows, Kohinoor Bangla on Apple) and compare vertical metrics so swap shift < 2 px.
- [ ] Avoid FOIT; never block render on fonts; verify with Rendering → Layout Shift Regions.

### 7.3 Images, media, imagery
- [ ] `next/image` with explicit `width/height` or `fill` + aspect-ratio container, correct `sizes`; AVIF → WebP fallback; quality 70–75 (60 under Save-Data). **(08 §4.1)**
- [ ] **Blur placeholders:** `placeholder="blur"` with static `blurDataURL` (tiny, ≤ 1 KB, generated at build) for hero/course thumbnails; for remote CMS images generate with `plaiceholder`/sharp in the ingestion pipeline.
- [ ] **Art direction:** `<picture>` / separate crops for mobile vs desktop hero (don't just shrink a wide image); focal-point metadata per image.
- [ ] LCP image: `priority`, `fetchpriority="high"`, no lazy-loading; hero ≤ 120 KB mobile. **(08 §12 #13)**
- [ ] **Real content & photography:** real instructors, real classrooms, real product screenshots with seeded Bangladeshi names; consistent colour grading and aspect ratios; licensed or commissioned photography (record licences). **(08 §10)**
- [ ] **Dark-mode images:** dark variants of screenshots; `filter: brightness(.9)` for photos; transparent PNG/SVG logos with dark variants; avoid white-box screenshots in dark mode.
- [ ] **Video:** poster image, `preload="none"` on mobile, no autoplay with sound, captions (VTT) always; hero video only on desktop ≥ 1024 and Save-Data off.
- [ ] **Icons:** one set (Lucide), one stroke (1.5), sizes 16/20/24/32/40; no mixed filled/outline in a row. **(08)**
- [ ] **Avatars:** initials fallback with deterministic soft colour; never broken-image icon.

### 7.4 Interaction states and feedback
- [ ] **Every interactive element has** default, hover (pointer only), focus-visible, active/pressed, disabled, loading, and (where relevant) selected/error states — designed, tokenised, screenshotted in `/design`. **(08)**
- [ ] **Focus rings:** 2 px accent ring with 2 px offset, visible in both themes; `:focus-visible` only; never `outline:none` without replacement; consistent radius-following ring. **(08 §2.11)**
- [ ] **Hit areas:** ≥ 44×44 (touch), ≥ 24×24 CSS px minimum per WCAG 2.2 AA (2.5.8); extend small icons with padding or pseudo-element `inset:-8px` while keeping visual size. **(08 §9)**
- [ ] **Disabled** = reduced contrast + `aria-disabled` with explanation tooltip when the reason isn't obvious (don't just grey out).
- [ ] **Skeletons match layout** (same heights, avatar radius, line widths 60–100 %), show only after 300 ms to avoid flash. **(08)**
- [ ] **Optimistic UI** for bookmark/flag/mark-complete; rollback with toast on failure. **(08)**
- [ ] **Prefetching:** `next/link` prefetch on viewport for primary nav and visible cards (default); on hover/focus for dense lists (`router.prefetch` on `pointerenter` with 65 ms intent delay); **avoid prefetching on Save-Data/slow connections** (`navigator.connection`).
- [ ] **Instant-navigation feel:** `loading.tsx` skeleton shells, static shells with Partial Prerendering/`use cache` where applicable **[verify Next 16 APIs]**, stale-while-revalidate for dashboard widgets, keep previous data on filter change (`useTransition`/`keepPreviousData`), scroll restoration.
- [ ] **Error boundaries with recovery:** route-level `error.tsx` with Retry (resets boundary), "Go to dashboard", and request ID; widget-level boundaries so one failing widget doesn't blank the page. **(08 §8.4)**
- [ ] **404/500:** helpful paths (search box, popular pages, contact), consistent branding, correct HTTP status, no cute jokes in exam-related errors. **(08 §5.1.27)**
- [ ] **Offline/slow:** connection banner, queued actions, cached last dashboard (PWA service worker for static assets only; never cache exam content beyond D6 rules).

### 7.5 Content and microcopy
- [ ] **Empty states that teach:** what this is, why it's empty, one primary action, optional sample data. **(08 §3.16)**
- [ ] **Microcopy formula** for errors: what happened + why (if known) + what to do next; no blame, no "Oops". **(08 §8.4)**
- [ ] Button labels are verbs + object ("Start mock test", not "Submit"/"Click here"); confirm dialogs name the action ("Delete 3 drafts").
- [ ] Real numbers, real dates, localised (`Intl.DateTimeFormat`, BDT with `৳`/BDT convention per 08 §8.3); relative time with absolute on hover.
- [ ] Sentence case; consistent terminology glossary (`docs/design-research/GLOSSARY.md`: "mock test" vs "practice test" decision).
- [ ] Reassurance microcopy near anxiety points (payment, submit test): refund link, "answers autosaved", "you can resume".

### 7.6 Forms
- [ ] **Inline validation** on blur (not while typing for the first time); success tick only when helpful; errors in a reserved region (no layout jump). **(08)**
- [ ] Correct `type`, `inputmode`, `autocomplete`:
  | Field | Attributes |
  |---|---|
  | Email | `type="email" inputmode="email" autocomplete="email" autocapitalize="none" spellcheck="false"` |
  | Phone (BD) | `type="tel" inputmode="tel" autocomplete="tel-national"` + `+880` prefix select; accept `01XXXXXXXXX`, normalise to E.164 |
  | OTP | `inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]*" maxlength=6`; paste splits across cells; WebOTP API optional; auto-submit on 6th digit |
  | Name | `autocomplete="name"` (single field; don't force first/last) |
  | Password | `autocomplete="new-password"` / `current-password`; show/hide toggle; allow paste |
  | Card | `autocomplete="cc-number"`, etc. — but we use hosted payment pages (D-security), so none |
  | Numeric answer (exam) | `inputmode="decimal"` |
- [ ] Labels always visible (no placeholder-as-label); help text below; required marked via text "(optional)" for optional fields instead of asterisks.
- [ ] Keyboard: Enter submits, Esc cancels dialogs, focus moves to first error on submit with `aria-describedby` + live region.
- [ ] Mobile keyboards don't cover the CTA: `scroll-padding`, `visualViewport` handling; sticky bottom actions use `env(safe-area-inset-bottom)`.
- [ ] Save progress on long forms; warn on unsaved changes only when data truly lost.
- [ ] Protect against double-submit: disable after click with width-stable loading; idempotency keys server-side.

### 7.7 Mobile and device polish
- [ ] **Sticky CTAs on mobile** for enrol/pay/start-test; appear after hero scrolls away; don't cover cookie/consent or keyboard. **(08)**
- [ ] **Safe-area insets:** `padding-bottom: max(16px, env(safe-area-inset-bottom))`; `viewport-fit=cover`; use `dvh`/`svh` not `vh` for full-height sheets.
- [ ] `touch-action: manipulation` on buttons (kill 300 ms/double-tap zoom), `overscroll-behavior: contain` in sheets, `-webkit-tap-highlight-color: transparent` with our own pressed state.
- [ ] Input font-size ≥ 16 px (prevents iOS zoom). **(08)**
- [ ] **Theme colour:** `<meta name="theme-color">` per scheme; `color-scheme: light dark` on `:root` so native controls and scrollbars match.
- [ ] Dark mode designed, not inverted; `prefers-color-scheme` default + manual override stored. **(08)**
- [ ] **Print styles for receipts/certificates/score reports:** `@media print` — hide nav/footers, black on white, `break-inside: avoid` for table rows, show URL of links, A4 margins, remove shadows, embed fonts; "Download PDF" provided too.

### 7.8 SEO, sharing, installability
- [ ] **OG images per page** via `next/og` (`ImageResponse`) with branded template (course title, instructor, rating) — dynamic route `opengraph-image.tsx`; Bangla title requires embedding a Bangla font in the OG renderer (satori needs a `ttf/otf` buffer; Noto Sans Bengali) **[verify]**.
- [ ] **Favicon/app icon set:** `favicon.ico`, `icon.svg` (with dark-mode media), `apple-touch-icon.png` 180, maskable PWA icons 192/512; `manifest.webmanifest` (name, short_name, `theme_color`, `background_color`, `display: standalone`, shortcuts to "Start practice", "Resume"). **(08 §10)**
- [ ] **PWA:** installable manifest + minimal service worker for offline shell/static assets and "You're offline" page; no offline exam unless D6 permits.
- [ ] **Meta/SEO:** unique `<title>` (≤ 60 chars) + `description` (≤ 155), canonical, `hreflang` en/bn/x-default, robots rules (no index for `/app`, `/exam`, `/checkout`), sitemap per locale, `lang` attribute on `<html>` and on inline switches.
- [ ] **Structured data (JSON-LD, validate with Rich Results Test):**
  | Page | Schema |
  |---|---|
  | Course landing | `Course` (+ `CourseInstance` where applicable), `Offer`/`Product` with price BDT/USD, `AggregateRating` **only if reviews are real and visible** |
  | FAQ blocks | `FAQPage` (note: Google restricts FAQ rich results to select sites; still valid markup **[verify]**) |
  | All deep pages | `BreadcrumbList` |
  | Organisation/home | `Organization`, `WebSite` with `SearchAction` |
  | Blog | `Article` |
  | Pricing plans | `Product` + `Offer` |
  | Instructor | `Person` |
- [ ] No fake ratings/reviews markup (policy + 08 P6).

### 7.9 Performance budgets
| Metric | Budget | Source |
|---|---|---|
| LCP (4G Moto G-class) | ≤ 2.5 s | 08 §12 #13 |
| INP | ≤ 200 ms | 08 |
| CLS | ≤ 0.02 | 08 |
| JS marketing page (gz) | ≤ 170 KB | 08 |
| Hero image mobile | ≤ 120 KB | 08 |
| Total transfer first load (mobile marketing) | ≤ 500 KB | proposed |
| Fonts first load | ≤ 120 KB (en), ≤ 200 KB (bn) | proposed **[verify]** |
| Third-party scripts | ≤ 2 on marketing (analytics + payments only after consent/intent) | proposed |
| Lighthouse CI | Perf ≥ 90 mobile on marketing, A11y ≥ 95 | 08 |
Enforce with Lighthouse CI + `@next/bundle-analyzer` + `size-limit`; fail PRs over budget.

### 7.10 Accessibility details
- [ ] Skip link; landmarks; one `h1`; heading order. **(08 §9)**
- [ ] Colour never the only signal (icon + text for success/error, band colours with labels).
- [ ] Contrast: text ≥ 4.5:1, large text/UI ≥ 3:1 both themes; test the *real* rendered colours including disabled text and placeholders.
- [ ] `prefers-reduced-motion`, `prefers-contrast`, `forced-colors` (Windows High Contrast) styles tested.
- [ ] Focus not obscured by sticky bars (WCAG 2.2 2.4.11): `scroll-padding-top` = header height.
- [ ] Target size (2.5.8), dragging alternatives (2.5.7), consistent help (3.2.6), redundant entry (3.3.7), accessible authentication (3.3.8: allow paste/password managers, no cognitive puzzles). **(08 §9.1)**
- [ ] Live regions for toasts, timer thresholds, autosave.
- [ ] Alt text localised; decorative images `alt=""`; captions for video; transcripts.

### 7.11 i18n / Bangla details (beyond 08 §2.2.2)
- [ ] Bangla line-height ≈ 1.7 body / 1.3–1.35 headings; zero tracking; no italics; no uppercase. **(08)**
- [ ] Numerals policy: Latin digits default (scores/prices/timers); optional Bangla digits for prose counts via `Intl.NumberFormat('bn-BD',{numberingSystem:'beng'})`. **(08)**
- [ ] Don't concatenate translated strings; use ICU plurals/select (`next-intl`); allow +35 % length.
- [ ] Line breaking: Bangla uses spaces; avoid `word-break: break-all`; use `overflow-wrap: anywhere` only in tight cells; `hyphens: none`.
- [ ] Dates: `Intl.DateTimeFormat('bn-BD')` with Gregorian; week starts Saturday in planner; time zone `Asia/Dhaka` default and clear.
- [ ] Currency: BDT first for BD users, with `৳` or "BDT" per 08 §8.3; international users see USD region price.
- [ ] Test strings with stress conjuncts (08 §2.2.2) in every component in `/design`.
- [ ] Search: Bangla normalization (unicode NFC, ZWJ/ZWNJ handling) and Banglish aliases.

### 7.12 "Detail pass" rituals (end of every feature)
1. **Squint test** — blur screenshot (CSS `blur(4px)` or squint): is the hierarchy obvious (one thing loudest)?
2. **Grid overlay pass** — 8 px overlay on 1440 and 375; fix off-grid by ≥ 2 px.
3. **Baseline & alignment pass** — draw guides: left edges, first baselines, icon/text centring.
4. **State sweep** — hover/focus/active/disabled/loading/empty/error for each component.
5. **Zoom pass** — 200 % browser zoom + 150 % text size; Bangla long strings; 320 px.
6. **Slow pass** — Slow 4G + CPU 4×: what appears first? any jank or shift?
7. **Keyboard pass** — complete the main task with keyboard only.
8. **Dark pass** — all screenshots in dark; check imagery and shadows.
9. **Copy pass** — read aloud; remove hype; check Bangla.
10. **Delete pass** — remove one decorative thing per screen (the "subtract" rule).
11. **Side-by-side pass** — compare to the wireframe in 08 §5 and to the best reference pattern from `PATTERNS.md` (not for copying; for quality bar).
12. **Fresh-eyes pass** — next day, 3-minute look by someone who didn't build it.

---

## 8. Templates and component sources (licence notes — verify each)

**Licence discipline:** verify the licence file in the repo/site at install date; record in `LICENCES.md`; prefer copy-in-own-code (shadcn model) over runtime dependency for UI kits; commercial use must be allowed; no GPL/AGPL UI dependencies (08 §11.1).

| Source | What it gives | Licence (verify) | Use in Lumen | Caution |
|---|---|---|---|---|
| **shadcn/ui** + **blocks** | Copy-in components (Radix + Tailwind), dashboard/auth/sidebar blocks | MIT | Base of `packages/ui`; blocks `sidebar-07`, `dashboard-01`, `login-04` (08 §11.1) | Defaults are recognisably "shadcn" — restyle (§8.2) |
| **Radix Primitives / Radix Themes** | Accessible unstyled primitives | MIT | Primitives only (not Radix Themes styling) | Radix Themes look = recognisable; skip |
| **Origin UI** (now part of coss/community — **verify current status**) | Many shadcn-compatible components | MIT | Pick specific components (selects, file upload, tags input, stepper) | Project may have been rebranded/archived — check repo; copy only what we need |
| **Magic UI** | Animated components for marketing | Free components MIT; **Pro paid** **[verify]** | Rarely: marquee for partner logos, number ticker (we implement our own per M8), animated list | Many effects (beams, shimmer borders) are exactly the "AI landing" look — ban list in 8.3 |
| **Aceternity UI** | Flashy animated components | Free + paid **[verify]** | Almost never; maybe a single subtle effect after crit approval | High vibe-coded risk (spotlights, 3D cards, meteors) |
| **Tailwind Plus (Catalyst, UI Blocks, templates)** | Polished marketing/app UI blocks; Catalyst React kit | Paid licence per project/developer; not redistributable as a competing template **[verify]** | **Optional**: study structure/spacing; if purchased, adapt under licence and restyle fully | Cost; widely used → recognisable if not restyled; licence forbids reselling source |
| **Tremor** | Dashboard components (charts/KPI) | Apache-2.0 (Tremor Raw / now part of Vercel) **[verify]** | Possibly KPI/spark patterns; prefer shadcn chart (Recharts) + our `StatTile` for consistency (08 §3.31) | Don't mix two chart systems |
| **Vercel templates** (`vercel.com/templates`), **Next.js Commerce** | App patterns: auth, i18n, commerce architecture, caching | Per-repo (mostly MIT) **[verify]** | Architecture patterns (cart/checkout state, server actions, caching) — not visuals | Our checkout is hosted-provider-based; don't import Shopify-specific code |
| **React Email** (+ templates) | Transactional email components (receipts, OTP, reminders) | MIT | Email templates in Lumen tokens; test in Gmail/Outlook/Apple Mail | Bangla fonts don't load in many email clients — rely on system fallback and test rendering |
| **Embla, cmdk, Vaul, Sonner, input-otp, dnd-kit, TanStack Table** | Functional components | MIT | As 08 §11.1 | |
| **Lucide** | Icons | ISC | Only icon set | |
| **Open Peeps/unDraw/illustration packs** | Illustrations | Various (some require attribution) | Not used (08 §10.3 — own diagrams/photos) | Avoid generic illustration look |
| **Google Fonts (Inter, Noto Sans Bengali, Hind Siliguri, JetBrains Mono)** | Fonts | OFL | `next/font` | |
| **Phosphor/Heroicons/Radix Icons** | Alternative icons | MIT | Not mixed with Lucide | |

### 8.1 Where templates help, where they hurt
| Helps | Hurts |
|---|---|
| Accessible primitives (dialog, combobox, tabs) | Marketing hero + feature-grid templates (instantly recognisable) |
| Table/data grid logic, form patterns | Pre-styled "AI product" landing pages |
| Email layout robustness | Animated background components (beams, grids, spotlights) |
| Architectural references (Next Commerce) | Dashboard templates with lorem charts and fake metrics |

### 8.2 Restyle rule — "nothing looks stock" (binding)
1. **Install source → map to tokens before first render:** shadcn variable bridge (08 §11.2); remove default palette; no `slate-*` etc. (compile-blocked).
2. **De-shadcn checklist** (08 §11.3): change radius, border→hairline+shadow, focus ring, padding scale, type tokens, icon stroke, hover, dark surfaces.
3. **Recompose, don't recolour:** change at least *structure or interaction* (e.g. replace a 3-card icon grid with a real-content rail) — a recolour alone is not a restyle.
4. **Strip every demo content**: no lorem, no fake avatars, no stock charts.
5. **Reduce motion/effects to catalogue** (§6.2): delete any animation not in M1–M24.
6. **One-diff review:** PR that introduces a template block must include a before (stock) and after (Lumen) screenshot at 1440 and 375, light/dark; reviewer asks "would a user recognise the library?" — if yes, rework.
7. **Provenance comment** at top of each adapted file: `// Adapted from shadcn/ui blocks/dashboard-01 (MIT) — restyled to Lumen tokens`.

### 8.3 What NOT to use (ban list)
| Ban | Why |
|---|---|
| Flashy AI-landing templates (spotlight cards, meteors, beam borders, glowing orbs, animated grids) | Instant vibe-coded signal; perf cost; contradicts D8 |
| Gradient meshes / aurora backgrounds / gradient text everywhere | 08 §1.1: no gradients on sections/cards/buttons/text |
| Glassmorphism stacks (glass cards on glass panels, coloured blur) | 08 P4: glass only on 4 sanctioned surfaces |
| 3D tilt cards, cursor-follow glows, magnetic buttons | Distracting, a11y/perf risk |
| Stock "isometric illustration" packs, AI-generated faces/avatars | Trust (P6) |
| Emoji-as-icons, sparkles for AI | 08 §1.1 |
| Scroll-jacking / parallax / horizontal scroll hijack | Banned (M18) |
| Cookie-cutter "Trusted by" fake logo strips | Fake social proof (P6) |
| Dark-pattern widgets (fake countdowns, "X people viewing") | Trust, legal (consumer protection) |

---

## 9. Design QA and review

### 9.1 Weekly design crit (45 minutes; humans + design lead)
| Time | Segment | Rules |
|---|---|---|
| 0–5 | Context: goal of each screen, user, decision made, constraints | Presenter states "what feedback I need" |
| 5–25 | Review 3–4 screens/flows (live in staging, light + dark, EN + BN, 375 + 1440) | Reviewers speak in observations tied to principles ("hierarchy: two things compete" / Laws of UX), not taste ("I don't like blue") |
| 25–35 | Pattern check: compare to `PATTERNS.md` entry; accept/reject new patterns (§3.7) | Decision recorded |
| 35–40 | Run the **vibe-coded smell** checklist (9.3) out loud on one screen | |
| 40–45 | Actions: owner, due date, PR link; update `docs/design-research/CRIT-LOG.md` | |
Rules: one facilitator, one scribe, screenshots in `docs/design-research/crit/<date>/`, max 4 screens, silent first look (2 min), no redesign in the room, founder gets final say on brand/tone decisions, accessibility issues are non-negotiable.

### 9.2 Before/after screenshot diffs
- For each UI PR, the CI job (Playwright) stores screenshots of changed routes in matrix {375, 768, 1440} × {light, dark} × {en, bn} and posts a side-by-side (before = `main`, after = branch) in the PR comment. Baselines generated in one Linux container (research note §6).
- `toHaveScreenshot` with `maxDiffPixelRatio: 0.002` for stable fixtures (08 §12 #20); masks for dynamic regions (dates, avatars).
- Reviewer attests in the PR: "unintended diffs: none / explained".
- Optional visual-diff services (Chromatic, Argos, Lost Pixel) — free tiers **[verify]**; the Q8 research did not check them.

### 9.3 "Vibe-coded smell" checklist (the `ui-polisher` agent runs this *first*, then 08 §12)

Score each: pass / smell / fail. Any "fail" blocks; ≥ 3 "smell" requires a fix plan.

| # | Smell | Look for | Fix |
|---|---|---|---|
| 1 | **Everything is a card** | Every section wrapped in bordered rounded box with icon + title + 2 lines | Use hierarchy via type/space; real-content rails |
| 2 | **Centred-everything** | Body copy, lists, forms centred | Left-align; centre only hero/empty states |
| 3 | **Gradient/glow** | Any gradient bg, gradient text, glow shadows, blobs | Remove; flat surfaces |
| 4 | **Three-up icon grids** | "Feature 1/2/3" with icon circles | Replace with screenshot+copy, comparison, process |
| 5 | **Inconsistent rhythm** | Section gaps vary (e.g. 64/80/100/72) | Snap to 24/48/96 |
| 6 | **Default shadcn look** | Radius 0.5rem, zinc borders, default `Card` | De-shadcn (08 §11.3) |
| 7 | **Type soup** | > 4 sizes in a component; random weights; centered display text with loose tracking | Tokens only |
| 8 | **Emoji/sparkle icons** | ✨🚀 anywhere | Lucide only |
| 9 | **Placeholder content** | lorem, "John Doe", stock faces, "Acme" | Real seeded data |
| 10 | **Missing states** | No empty/loading/error; spinner-only pages | Design all states |
| 11 | **Layout shift** | Content jumps on load, font swap, image pop-in | Reserve space; `size-adjust` |
| 12 | **Hover-only affordances** | Actions only on hover; no touch equivalent | Visible on touch |
| 13 | **Bad focus** | No visible focus or custom rings that vanish | Standard ring |
| 14 | **Tiny touch targets** | < 44 px controls, tight icon buttons | Padding/hit-area |
| 15 | **Low-contrast grey text** | `fg-3` on `surface-2` < 4.5 | Darken |
| 16 | **Over-animated** | Entrance animations on everything; bounce | Catalogue only |
| 17 | **Hype copy** | "Revolutionary", "supercharge", "unlock", "!" | 08 §8 voice |
| 18 | **Fake proof** | Invented counts, logos, testimonials | Remove or source |
| 19 | **Bangla afterthought** | Clipped matras, mixed scripts, wrong line-height | Bangla pass |
| 20 | **Dark mode = inverted** | Pure black bg, white cards, blinding images | Designed ladder |
| 21 | **Inconsistent icons** | Mixed stroke widths/sizes | Wrapper |
| 22 | **Unaligned optical details** | Icon/text misaligned by 1–2 px; ragged baselines | Optical pass |
| 23 | **Full-page spinners / janky nav** | Blank → content pop | Skeleton shells, streaming |
| 24 | **Template residue** | Library demo copy, stock chart data, unused sections | Strip |
| 25 | **Too many CTAs** | Two+ filled buttons per section | One primary |
| 26 | **Copied-feel** | Layout matches a known site 1:1 | Reframe (§1) |

### 9.4 How AI agents should be prompted for UI work
Principles: agents design better from **constraints and references** than from adjectives ("make it modern/clean/Apple-like").

**Prompt contract (every UI task):**
1. **Context:** route, user role, device priority, what decision the screen supports.
2. **Source of truth:** link to `08 §` for tokens/components, the wireframe (`08 §5.1.x`), copy file keys (i18n), seeded data.
3. **Reference screenshots (our own or approved pattern entries):** attach 1–3 images labelled *"quality bar and structure, not to copy"*, plus the relevant `PATTERNS.md` entries. Do **not** attach competitor screenshots for pixel imitation.
4. **Exact spacing/measurements:** give actual numbers (section padding 96, card padding 24, grid 12 col, max-width 1120, type tokens, radii) rather than words.
5. **Constraints:** components allowed (`packages/ui`), banned list (§8.3), motion from catalogue only, states required, a11y and perf budgets.
6. **Process:** *Variant → Select → Polish:*
   - Step A: **produce 2 variants** (different structure, not different colour) as separate routes/stories under `/design/proposals/<task>-a|b`; screenshots at 375/1440.
   - Step B: **reviewer (human or Opus) picks** with rationale, may combine.
   - Step C: **polish pass** by `ui-polisher`: smell checklist (9.3) → 08 §12 QA → detail-pass rituals (7.12).
7. **Acceptance:** screenshot matrix attached, `pnpm verify` green, lint rules clean, ≤ 15-line QA report.
8. **Forbidden shortcuts:** inventing new tokens/colours/components; adding dependencies not on allowlist; inline styles; copying third-party code.

**Template prompt (paste into task):**
```
TASK: Build <page/component> at <route>.
SOURCE OF TRUTH: docs/08-UI-UX-DESIGN-SYSTEM.md §<n> (tokens), §<n> (component), wireframe §5.1.<n>. Copy keys: <ns>. Seed data: <fixture>.
QUALITY BAR (do not copy): attached <our screenshot/PAT-xxx>.
MEASUREMENTS: container 1120; section padding 96/64; grid 12/24; card padding 24; radius lg; type: title1 / body / caption.
MUST: all states (empty/loading/error/partial), light+dark, en+bn, 320–1440, a11y WCAG 2.2 AA, motion from docs/23 §6.2 only.
MUST NOT: gradients, glow, emoji, centred body, new colours, new deps, lorem.
PROCESS: deliver variants A and B at /design/proposals/<task>-{a,b} with screenshots (375/1440, light/dark). Stop for selection. Then polish.
```

---

## 10. Starter research backlog — first 12 teardowns

Assignment: **Sonnet (with browser tools)** = capture + measurement + first-draft card (steps 3.2–3.4, perf). **Opus** = synthesis, interpretation, `adopt/adapt/avoid`, pattern library, crit prep. Each card ≤ 90 min capture + 30 min synthesis. Output path pattern `docs/design-research/<file>.md` (+ `assets/<site>/`). "Feeds" = the 08 section that may change.

| # | Site | Flow / pages | Key question (decision it feeds) | Output file | Capture & measure | Synthesis | Feeds |
|---|---|---|---|---|---|---|---|
| 1 | apple.com | One product page + Education/Support landing | Sticky local nav, section rhythm, type scale, restrained motion — what to adapt for exam hubs? | `apple-product-page.md` | Sonnet | Opus | 08 §4.2, §5.1.2, §7 |
| 2 | khanacademy.org | Course → unit → skill pages; mastery UI; (public) teacher/parent info pages | Mastery ladder and unit page design | `khan-course-mastery.md` | Sonnet | Opus | 08 §3.11, §5.1.9–10 |
| 3 | 10minuteschool.com | Catalogue → course landing → checkout (stop before payment) in Bangla | Bangla-first trust cues, bKash placement, sticky enrol | `10ms-course-landing-checkout.md` | Sonnet | Opus | 08 §5.1.3–6, §3.36–37 |
| 4 | udemy.com | Course landing anatomy + player (public preview) | Landing sections order, sticky price card, player panels | `udemy-landing-player.md` | Sonnet | Opus | 08 §3.21, §5.1.3, §5.1.10 |
| 5 | coursera.org | Catalogue search/filters + learner home (public views) | Filter UX, results cards, mobile filter sheet | `coursera-catalogue-filters.md` | Sonnet | Opus | 08 §5.1.4 |
| 6 | duolingo.com | Onboarding (pre-signup) + streak/goal + celebration | Onboarding steps, goal picker, calm adaptation of gamification | `duolingo-onboarding-streak.md` | Sonnet | Opus | 08 §5.1.8, §3.33 |
| 7 | magoosh.com (GRE/IELTS) | Dashboard marketing views, score predictor info, pricing table, free trial | Dashboard widgets, pricing table, predictor presentation | `magoosh-dashboard-pricing.md` | Sonnet | Opus | 08 §5.1.5, §5.1.9, §3.32 |
| 8 | e2language.com | IELTS/GRE course pages, free resources hub | Content funnel + course bundle presentation | `e2language-courses.md` | Sonnet | Opus | 08 §5.1.2 |
| 9 | britishcouncil / IDP official IELTS practice | Official tutorials / practice test UI (public demo only) | Exam shell behaviour: panes, navigator, review, system check | `ielts-official-exam-ui.md` | Sonnet | Opus | 08 §4.4, §5.1.13–17 |
| 10 | linear.app + stripe.com + vercel.com | Marketing home + pricing + docs + dark mode | Precision details: type, hairlines, dark ladder, docs layout, ⌘K | `precision-trio.md` | Sonnet | Opus | 08 §2, §3.15, §4.5 |
| 11 | notion.so | Onboarding, empty states, templates gallery, settings | Empty-state teaching, onboarding checklist | `notion-empty-onboarding.md` | Sonnet | Opus | 08 §3.16, §5.1.8 |
| 12 | headspace.com / calm.com | Marketing + onboarding + "result/complete" moments (public) | Calm tone, anxiety-reducing copy, completion states | `headspace-calm-tone.md` | Sonnet | Opus | 08 §8.1, §7.3 |

Scheduling (suggested): 2 teardowns/week alongside the build; cards #1, #3, #4, #9 first (they feed the highest-risk surfaces: marketing hero, Bangla trust/checkout, course landing, exam shell). After #12: Opus writes `docs/design-research/SYNTHESIS-01.md` (top 20 patterns with verdicts) and opens a PR proposing changes to 08.

**Backlog extras (later):** Baymard checkout article pass (public) → `baymard-checkout.md`; NN/g forms/navigation pass → `nng-forms-nav.md`; Quizlet/Anki decks → `flashcards.md`; Grammarly writing-feedback UI → `writing-feedback-ui.md`; Wise/Stripe payment clarity → `payment-clarity.md`; bKash/Nagad payment UI guidelines (public brand rules) → `bkash-nagad-ui.md`.

**Definition of done for a teardown:** card complete (all Appendix A sections), screenshots stored with naming convention, measurements in tables, ≥ 5 patterns with verdicts, 3 "badly done" notes, licence/ToS note, reviewed by Opus.

---

## Appendix A — Teardown card template (copy verbatim to `docs/design-research/<site>[-<flow>].md`)

```markdown
# Teardown — <Site> · <flow/page>
- **Date captured:** YYYY-MM-DD · **URLs:** …
- **Captured by:** <agent/human> · **Reviewed by:** …
- **Decision this feeds:** <one sentence> · **08 section(s):** …
- **ToS / legal note:** <read? automated capture? login areas excluded> · **Assets stored:** assets/<site>/ (internal reference only; not for reuse)
- **Stack (Wappalyzer/BuiltWith, unverified):** …

## 1. Capture matrix
| Page | 375 L | 375 D | 768 L | 768 D | 1280 L | 1280 D | 1440 L | 1440 D |
|---|---|---|---|---|---|---|---|---|
| … | link | link | … | | | | | |
Hover/focus/active screenshots: …

## 2. Navigation map
(tree) · sticky? · mega menu trigger · search · account menu · language switch · breadcrumbs · footer columns · mobile menu behaviour · depth/clicks to key tasks

## 3. Layout & measurements
| Item | Value | Where/notes |
|---|---|---|
| Base spacing unit | | |
| Section padding (d/m) | | |
| Grid columns / gutter | | |
| Container max-width / prose width (ch) | | |
| Type scale (role: size/line-height/weight/tracking) | | |
| Font families (and licence status) | | |
| Radii | | |
| Shadows / borders | | |
| Colour roles & contrast ratios (no hex copying) | | |
| Button / input heights; tap targets | | |
| Icon size / stroke | | |

## 4. Motion log
| Interaction | Element | Property | Duration | Easing / spring-like | Delay/stagger | Reduced-motion behaviour | Verdict |
|---|---|---|---|---|---|---|---|

## 5. Content hierarchy
Above the fold @375 / @1440 · H1 · scan path · section order · density · real vs placeholder content

## 6. CTA strategy
Primary/secondary · wording · repetition · sticky behaviour · friction points

## 7. Trust signals (and whether verifiable)
Ratings · counts · logos · guarantees · payment marks · instructor credentials · policies

## 8. Pricing presentation
Anchoring · plan structure · billing toggle · "what's included" · local currency/payment cues · refund/guarantee

## 9. Onboarding · empty · error · loading states
Steps count, fields, skippable, progress cue · empty-state teaching · error copy · skeleton/spinner

## 10. Performance (mobile, Slow 4G, CPU 4×) 
| Metric | Lab (Lighthouse) | Field (CrUX p75) |
|---|---|---|
| LCP / INP(TBT) / CLS | | |
| Transfer / JS / fonts / hero image KB | | |
| LCP element · unused JS % | | |

## 11. Accessibility notes
Contrast issues · focus · keyboard · SR names · reduced motion

## 12. Patterns → verdicts
| Pattern | Evidence (this site + other) | Verdict (adopt/adapt/avoid) | Lumen mapping (08 §) | Risk/notes |
|---|---|---|---|---|

## 13. Done badly (3+)

## 14. Open questions / follow-ups
```

## Appendix B — Measurement snippets (run in DevTools console on pages you may lawfully view)

```js
// B1 — distinct type styles, ranked by usage
(() => {
  const m = new Map();
  document.querySelectorAll('body *').forEach(el => {
    if (!el.childNodes.length || ![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) return;
    const c = getComputedStyle(el);
    const k = [c.fontFamily.split(',')[0], c.fontSize, c.lineHeight, c.fontWeight, c.letterSpacing].join(' | ');
    m.set(k, (m.get(k) || 0) + 1);
  });
  console.table([...m].sort((a, b) => b[1] - a[1]).map(([k, n]) => ({ style: k, count: n })));
})();

// B2 — spacing: padding/gap/margin values frequency
(() => {
  const m = new Map();
  document.querySelectorAll('section, main > *, article, li, button, a, [class*=card]').forEach(el => {
    const c = getComputedStyle(el);
    ['paddingTop','paddingBottom','paddingLeft','paddingRight','rowGap','columnGap'].forEach(p => {
      const v = c[p]; if (v && v !== '0px' && v !== 'normal') m.set(v, (m.get(v) || 0) + 1);
    });
  });
  console.table([...m].sort((a, b) => parseFloat(a[0]) - parseFloat(b[0])).map(([v, n]) => ({ value: v, count: n })));
})();

// B3 — radii and shadows
(() => {
  const r = new Map(), s = new Map();
  document.querySelectorAll('*').forEach(el => {
    const c = getComputedStyle(el);
    if (c.borderTopLeftRadius !== '0px') r.set(c.borderTopLeftRadius, (r.get(c.borderTopLeftRadius) || 0) + 1);
    if (c.boxShadow !== 'none') s.set(c.boxShadow, (s.get(c.boxShadow) || 0) + 1);
  });
  console.table([...r].map(([v, n]) => ({ radius: v, count: n })));
  console.table([...s].map(([v, n]) => ({ shadow: v, count: n })));
})();

// B4 — widths of containers (max-width) and line length in ch
(() => {
  const out = [];
  document.querySelectorAll('main *, section *').forEach(el => {
    const c = getComputedStyle(el);
    if (c.maxWidth !== 'none' && parseFloat(c.maxWidth) > 300) out.push({ tag: el.tagName, cls: el.className?.toString().slice(0, 40), maxWidth: c.maxWidth });
  });
  console.table(out.slice(0, 40));
})();

// B5 — tap target audit (<44px) at mobile viewport
(() => {
  const small = [...document.querySelectorAll('a, button, input, select, [role=button]')]
    .map(el => ({ el, r: el.getBoundingClientRect() }))
    .filter(({ r }) => r.width && (r.width < 44 || r.height < 44))
    .map(({ el, r }) => ({ tag: el.tagName, text: (el.innerText || el.ariaLabel || '').slice(0, 24), w: Math.round(r.width), h: Math.round(r.height) }));
  console.table(small.slice(0, 50)); console.log(small.length + ' targets < 44px');
})();

// B6 — layout shift + LCP observer (paste early, then reload via Performance panel for accuracy)
new PerformanceObserver(l => l.getEntries().forEach(e => console.log('LCP', e.element, Math.round(e.startTime)))).observe({ type: 'largest-contentful-paint', buffered: true });
new PerformanceObserver(l => l.getEntries().forEach(e => !e.hadRecentInput && console.log('CLS +', e.value.toFixed(4), e.sources?.map(s => s.node)))).observe({ type: 'layout-shift', buffered: true });
```
Run these only for measurement. Output goes into the card as *numbers*, never as copied source.

## Appendix C — Open items (for lead / founder)

> **Status 2026-11-07 (delivery lead): Appendix C accepted.** C4 is resolved: `00-DECISIONS.md` D2 now lists `/help`, `/status`, `/changelog` and `/accessibility` in the `(marketing)` route group (change-log line "D2 adds /help /status /changelog /accessibility (from 23)"). C8 is applied in `build-kit/CLAUDE.md` and `AGENTS.md` (Never section). Remaining rows stay open owner items; none blocks a P0/P1 task. Backlog tasks from this doc: P1-99 (slide and print tokens), see 12 Appendix J.

| # | Item | Owner |
|---|---|---|
| C1 | Confirm which paid libraries (Mobbin, Page Flows, Refero, Tailwind Plus) are worth buying after the first 4 teardowns **[verify pricing]** | Founder |
| C2 | Verify Next.js 16 View Transitions integration (`viewTransition` flag / `<ViewTransition>`) and Safari/Firefox support at implementation time | Sonnet implementer |
| C3 | Verify Origin UI / Tremor / Magic UI / Aceternity licence status and project health on install date | Haiku (licence ledger) |
| C4 | Proposed new routes `/help`, `/status`, `/changelog`, `/accessibility` (§5.6) need acceptance in 03/08 | **ACCEPTED** (D2 updated; 03/08 follow D2) |
| C5 | Proposed extra budgets (total transfer ≤ 500 KB, font budgets) need lead approval before entering 08 §12 | Lead |
| C6 | Lighthouse CI / visual-diff service choice (self-hosted vs Chromatic/Argos) | Lead |
| C7 | OG image Bangla font embedding approach (satori) | Sonnet implementer |
| C8 | Add the "no decompilers / no scraping / no pasted third-party source" rule (§1.4) to `AGENTS.md` | **DONE** (build-kit CLAUDE.md + AGENTS.md Never section) |
| C9 | Create `docs/design-research/` with `LICENCES.md`, `PATTERNS.md`, `CRIT-LOG.md`, `GLOSSARY.md` stubs | Haiku |
