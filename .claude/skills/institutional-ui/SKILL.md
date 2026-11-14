---
name: institutional-ui
description: Institutional UI Constitution (12 Lumen UI Laws) and Source-of-Truth Hierarchy for Lumen Academy marketing and UI overhaul work.
---

# Institutional UI Skill

## Source-of-Truth Hierarchy
`AGENTS.md > tokens.css > primitives.tsx > content/marketing.ts > page blueprints`

## The 12 Unbreakable Lumen UI Laws
1. **Compose, don't invent.** Marketing pages (`apps/web/app/[locale]/(marketing)/**/page.tsx`) may only assemble primitives from `@/src/components/ui/primitives`. Zero raw layout `<div className="...">` inside marketing `page.tsx` files.
2. **No bordered or shadowed content cards.** Content grids (`StatRow`, `StepRow`, `MediaColumns`, `SideHeadingBlocks`, `SplitFeature`) have **zero borders, zero box-shadows, and zero rounded card wrappers**. The only allowed boxes on a marketing page are: `CalloutNotice` (<= 1 per page), the single white card inside `CtaBand`, and buttons. Never nest a box inside a box.
3. **No eyebrow labels.** Zero `ALL-CAPS` micro-text labels above headings or inside cards. Section `H2` headings use the geometric `<LumenSparkMotif />` SVG mark instead.
4. **Tokens only.** Zero hex/rgb literals and zero arbitrary Tailwind bracket values (`text-[10px]`, `p-[13px]`) outside `apps/web/app/tokens.css`.
5. **Whitespace budget.** Sections use `<Section>` (`py-14 md:py-20 lg:py-28`, `max-w-[1200px]`, `gap-8 lg:gap-12`). Never shrink spacing to fit more text; cut text instead.
6. **Strict word caps.** Titles <= 10 words; Hero body <= 35 words; Section intro <= 60 words; Column/Step/Block body <= 40 words; Pricing bullets <= 4 items per plan (<= 10 words each).
7. **Progressive disclosure.** Any list > 3 items, any syllabus module list, any comparison table, and any FAQ list must be placed inside `<Disclosure>` (closed by default) or `<Tabs>`. Zero raw `<table>` tags on marketing pages outside a `<Disclosure>` or `<Tabs>` panel.
8. **One primary action per section.** Maximum one filled button per section; secondary actions are underlined text links.
9. **Truthful, verified data only.** Never invent testimonials, student names, or unverified stats. Use only the locked content in `apps/web/src/content/marketing.ts` and named media slots in `apps/web/src/content/media.ts`.
10. **Bilingual-first (`en` + `bn`).** Every string exists in both English and Bengali. No fixed heights (`h-...`) or `truncate` on text containers. Bengali (`:lang(bn)`) gets `line-height: 1.75`, `letter-spacing: 0`, and `text-transform: none`.
11. **Protected i18n paths.** Never touch `LocaleSwitcher.tsx`, `LocaleLink.tsx`, `TranslatedText.tsx`, or `api/translate/route.ts`.
12. **Receipts required.** Every batch requires raw CLI output of `pnpm design:lint`, tests, and `tsc`.
