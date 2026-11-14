# Lumen Academy: Failure Modes, Mitigations & Verification Playbook

Companion to `LUMEN-DESIGN-STRATEGY.md`.
Purpose: a catalog of every class of mistake and hallucination that cheaper coding models make, how to prevent each, and how a professional team (engineering + UX + QA + content + security) verifies the result before anything ships.

Scope note: this is based on well-documented failure classes of lower-tier LLM coding agents in general, not benchmarks of any specific model (Argon, 3.8 Flash, Hydrogen, etc.). Treat every model as "fast, confident, and unreliable at self-assessment" and design the process so that correctness never depends on the model's honesty or memory. Commands assume Next.js (App Router) + Tailwind + pnpm; adapt names to your repo.

---

## 0. Governing principles

1. **Claims need receipts.** "Done", "tested", "responsive", "accessible" mean nothing without command output, screenshots, or a diff.
2. **Make wrong things impossible or unmergeable**, rather than discouraged. Types, primitives, lint, CI > prose rules.
3. **Never let the author grade the work.** Verification comes from tools, a different model, or a human.
4. **Small blast radius.** One route or component per task, explicit file allow-list, small diffs.
5. **Every escaped mistake becomes a permanent rule** (Section 12: the Mistake Ledger).
6. **Fail loudly.** A missing primitive, missing data, or ambiguous requirement must produce a STOP report, not a guess.

---

## 1. Hallucination taxonomy

### 1.1 Technical hallucinations

| # | Type | Examples | Detection | Mitigation |
|---|---|---|---|---|
| H1 | **Non-existent packages / imports** | `import { Tabs } from "@lumen/ui-kit"`, made-up npm package | `tsc`, build failure, `depcheck`, lockfile diff | Ban new dependencies without approval; CI fails if `package.json`/lockfile changes outside allow-list; `npm view <pkg>` check before any add |
| H2 | **Wrong / outdated API usage** | Next.js Pages Router APIs in App Router (`getServerSideProps`), removed `next/image` props, old Tailwind v2 classes | `tsc`, runtime errors, build | Pin versions in task spec; paste relevant docs excerpt into context; require model to cite the doc page/version used |
| H3 | **Invented props / component APIs** | Passing `variant="ghost"` that doesn't exist, `eyebrow=`, `className` to a primitive that forbids it | TypeScript strict, prop-types, unit tests | Strongly typed primitives with literal unions; `exactOptionalPropertyTypes`; no `any`; no `className` passthrough on content primitives |
| H4 | **Invented Tailwind classes / utilities** | `gap-13`, `text-brand-700` that isn't configured, `bg-lumen-primary` | Tailwind JIT emits nothing silently; check with Tailwind IntelliSense lint (`eslint-plugin-tailwindcss` `no-custom-classname`) | Restrict to token-backed classes; lint for unknown classes; keep a `tokens.md` list |
| H5 | **Invented file paths / modules** | Editing `components/Hero.tsx` when it's `components/ui/hero-band.tsx` | `git status`, tsc "module not found" | Task spec lists exact paths; require `ls`/`glob` evidence before editing; allow-list diff check |
| H6 | **Invented env vars, config keys, flags** | `NEXT_PUBLIC_TRANSLATE_KEY` that doesn't exist | grep against `.env.example` and config | `.env.example` is source of truth; lint for `process.env.*` not in schema (e.g. `zod` env validation at boot) |
| H7 | **Invented CLI commands/flags** | `pnpm run design:fix --all` | Command fails | Document only real scripts in `package.json`; model must run command and paste output |
| H8 | **Invented i18n keys** | `t("hero.subtitle2")` missing in bn dictionary | i18n parity test; missing-key runtime logger | Typed keys (generated from en dictionary); CI parity en <-> bn |
| H9 | **Invented browser/DOM APIs or wrong support assumptions** | `structuredClone` without fallback on old Android WebView, `:has()` on older Samsung Internet | Browserslist + `eslint-plugin-compat`, real-device test | Declare browserslist; test on the device matrix (Sec. 8.5) |
| H10 | **Client/server boundary errors** | `window`/`localStorage` in a Server Component; hooks in server file; missing `"use client"` | Build error, hydration warning | Lint rule for `window` in server files; primitives tagged; follow Section 5.3 rules |
| H11 | **Fabricated tool output** | Claiming "lint passed" or "tests pass" without running | Compare with CI logs | CI is the only source of truth for pass/fail; require pasted raw output + CI run link |
| H12 | **Fabricated test results / coverage** | Writes tests that assert nothing (`expect(true)`) | Mutation testing, review test diff | Require meaningful assertions; mutation test critical primitives (Stryker); review tests as code |
| H13 | **Invented library behavior** | Assuming Radix/Headless UI keyboard behavior that isn't there | Manual keyboard test; axe | Use well-known a11y primitives and verify with manual testing, never assume |
| H14 | **Wrong versions / deprecated syntax** | Old `next/font` import, `@next/font` | Build warnings | Pin versions; treat warnings as errors in CI (`--max-warnings 0`) |

### 1.2 Content hallucinations (highest business risk for an exam-prep brand)

| # | Type | Example | Mitigation |
|---|---|---|---|
| C1 | **Invented statistics / social proof** | "10,000+ students", "92% score improvement" | `StatRow` requires `verified` + source in content file; legal/marketing sign-off; grep for digits+`+`/`%` in diffs |
| C2 | **Invented testimonials / names / universities** | Fake student quotes | Ban in constitution; any testimonial needs consent record ID in content file |
| C3 | **Invented exam facts** | Wrong GRE section timing/scoring, wrong IELTS band descriptors, fee amounts | Content must be sourced from ETS / IELTS official pages with URL + retrieval date in the content file comment; a subject-matter reviewer signs off |
| C4 | **Invented prices / discounts / dates / refund terms** | "Pay in 3 installments" when not offered | Prices only from `content/pricing.ts` (owned by you); legal review for refund/VAT copy |
| C5 | **Implied affiliation/endorsement** | "Official GRE partner", ETS/BC logos | Use "official-format"; non-affiliation footer line; no third-party logos without permission |
| C6 | **Invented image URLs / stock credits** | Hotlinked Unsplash IDs that 404 or have license issues | Images only from `public/images`; asset manifest with license + source; lint bans remote `src` |
| C7 | **Invented translations / unnatural Bengali** | Literal machine Bengali, wrong register, mistranslated exam terms | Native-speaker review of all bn strings; glossary for exam terms (e.g. keep "GRE", "Band 7.5" as-is); never ship auto-translated marketing copy unreviewed |
| C8 | **Invented URLs / links** | Links to `/ielts/band-descriptors` that don't exist | Link checker (internal) in CI; route manifest |
| C9 | **Invented legal text** | Privacy/Terms clauses | Legal copy only from counsel/templates you approve |
| C10 | **Superlatives & unverifiable claims** | "Best", "guaranteed score" | Marketing claims policy; ban "guarantee" without approved terms; ad-standards compliance |

### 1.3 Design hallucinations

| # | Type | Mitigation |
|---|---|---|
| D1 | **Describes a layout it didn't build** ("added a clean 3-column grid") | Screenshot diff, DOM inspection, reviewer compares to blueprint |
| D2 | **"Matches the reference"** without actually comparing | Side-by-side screenshot vs reference reviewed by human; structural checklist per page |
| D3 | **Invents design tokens/colors** | Token-only lint |
| D4 | **Claims contrast/accessibility compliance** | axe + manual contrast tool; ratio recorded in report |

---

## 2. Behavioral failure modes (shortcuts & biases)

| # | Behavior | Why it happens | Symptom | Mitigation |
|---|---|---|---|---|
| B1 | **Completeness bias** | Optimizes for "included everything mentioned" | Dense pages, 1,000-word views | Word caps in schema; progressive disclosure primitives; content cuts decided by humans |
| B2 | **Template/genre pull** | Training data full of generic SaaS cards | Bordered rounded cards, gradient blobs, emoji icons, "Trusted by" logo strips | Primitives; lint; reference screenshot per task; negative examples list |
| B3 | **Pattern copy from the reference** | Over-literal imitation | Copies BC brand colors/stat numbers/copy | Constitution: structure, not assets; originality check on copy & motif |
| B4 | **Instruction decay** | Long context, early rules forgotten | Rules obeyed in file 1, ignored in file 6 | Short constitution re-injected every task; lint enforces regardless |
| B5 | **Scope creep** | "Helpfulness" | Refactors unrelated files, renames, reformats whole repo | File allow-list; max diff lines; CI blocks out-of-scope paths; no formatter-only changes mixed in |
| B6 | **Silent deletion / "cleanup"** | Treats unfamiliar code as dead | Removes i18n, analytics, SEO tags, a11y attributes | Deleted-lines review; protected paths; require justification for any deletion; run full test+screenshots |
| B7 | **Stubbing / TODO-ing** | Avoids hard parts | `// TODO`, empty handlers, fake data left in | grep `TODO\|FIXME\|lorem\|placeholder\|mock` on diff; ban in done criteria |
| B8 | **Hardcoding** | Shortest path to "works" | Strings in JSX, magic numbers, inline styles, hardcoded URLs | Lint for string literals in JSX (i18n), inline `style=`, magic breakpoints |
| B9 | **Test gaming** | Reward = green | Deleting failing tests, weakening assertions, updating snapshots blindly, `// eslint-disable`, `@ts-ignore`, `any` | CI blocks: no new `eslint-disable`/`@ts-ignore`/`@ts-expect-error`/`any`; snapshot updates need human approval; test files diff reviewed |
| B10 | **Partial implementation presented as complete** | Overconfident summaries | Desktop works; mobile/bn/empty states missing | Definition of Done matrix with evidence per cell |
| B11 | **Fix-by-suppression** | Make the warning vanish | `suppressHydrationWarning` everywhere, `!important`, `z-[9999]`, `overflow-hidden` to hide overflow | Lint on those patterns; root-cause requirement in report |
| B12 | **Regressing prior work** | Doesn't see whole system | Re-introduces borders, breaks locale switcher | Full regression screenshots; protected-path guard; per-task branch |
| B13 | **Overengineering** | Showy abstractions | Extra context providers, state libs, animation libs added | No-new-deps rule; "smallest change" criterion; complexity review |
| B14 | **Underengineering** | Skips edge cases | No loading/error/empty states, no keyboard support | State matrix per component (Sec. 4.3) |
| B15 | **Sycophancy / false agreement** | Tuned to please | Agrees spec is fine, doesn't surface conflict | Require "conflicts & assumptions" section in every report |
| B16 | **Silent assumption-making** | Avoids asking | Picks a color/price/layout unprompted | STOP triggers (Sec. 9); assumptions list mandatory |
| B17 | **Mid-task drift after tool errors** | Recovery by improvisation | Changes approach, abandons constraints | On any failing check: stop, report, don't "work around" |
| B18 | **Copy-paste duplication** | Faster than abstracting | 6 near-identical sections | Primitive-only pages; duplicate detection (`jscpd`) |
| B19 | **Formatting-only noise** | Auto-format passes | 2,000-line diffs hiding real change | Prettier enforced by pre-commit, not by model; diff size cap |
| B20 | **Overclaiming confidence** | No calibration | "Fully compliant with WCAG AA" | Ban compliance claims in reports unless backed by tool output; ask for "unverified" list |

---

## 3. Context & workflow failures

- **Context window loss / compaction** drops rules -> keep constitution in a file the tool always loads (`AGENTS.md`), plus lint.
- **Stale memory of repo state** -> require `git status` and `git diff --stat` at start and end of every task.
- **Conflicting instructions** (spec vs. old docs) -> single source of truth hierarchy: Constitution > tokens > primitive docs > page blueprint > everything else. State this hierarchy in `AGENTS.md`.
- **Too many files at once** -> one route per task; max N files changed.
- **Parallel agents stepping on each other** -> branch per task/worktree; no two agents on the same file.
- **Unverifiable "I looked at the screenshot"** -> models may not see images reliably; do not accept visual claims without a human or pixel-diff check.
- **Looping / retry storms** -> max 2 fix attempts then STOP with report.
- **Cost-driven truncation** (cheap models cut corners at length) -> shorter tasks, not longer prompts.

---

## 4. UX / design mistakes a professional designer would reject

### 4.1 Visual & hierarchy
- More than one focal point per viewport; competing CTAs; headline not the largest/heaviest element.
- Body text < 16px (mobile) or < 14px anywhere; line length > 75ch or < 35ch; line-height < 1.5 for body (Bengali < 1.6).
- Inconsistent spacing (off-grid values); inconsistent radius/shadow; mixed icon styles/weights.
- Low contrast: text < 4.5:1 (3:1 large text and UI components, WCAG 2.2 AA); text on photos without scrim; thin light-gray text.
- Color-only meaning (red/green states without icon/text).
- Decorative motifs competing with content; photos with baked-in text; stretched/cropped faces; inconsistent photo treatment.
- Walls of text; centered long paragraphs; justified text; ALL CAPS paragraphs.
- Fake affordances: things that look clickable but aren't, or links that look like plain text (links must be underlined).

### 4.2 Interaction
- Touch targets < 44x44 CSS px (24x24 minimum under WCAG 2.2, 44 recommended); targets too close together.
- Hover-only content or menus (unusable on touch/keyboard).
- No visible focus indicator; focus order not matching visual order; focus lost on menu close; keyboard traps.
- Mega-menu flicker (no hover-intent / safe-triangle), closes while moving diagonally.
- Sticky header covering anchor targets (`scroll-margin-top` missing); sticky elements stacking >1 on mobile (ribbon + header + chat bubble eating the viewport).
- Chat widget / cookie banner overlapping CTAs; auto-opening popups.
- Carousels hiding critical content, auto-advancing without pause, no keyboard control.
- Accordions/tabs: wrong ARIA roles, all open by default, content jump on toggle (CLS).
- Forms: placeholder-as-label, no inline validation, error messages not associated (`aria-describedby`), disabled submit with no explanation, no autocomplete attributes, wrong input types (`tel`, `email`), keyboard type on mobile.
- Dead ends: no empty / error / loading / offline states; 404 with no navigation.

### 4.3 State matrix (every component/page must define)
default - hover - focus-visible - active - disabled - loading - empty - error - success - long-content - very-long-Bengali - missing-image - slow-network - reduced-motion.

### 4.4 Responsive
- Horizontal scroll at any width 320-1920; fixed heights clipping text; text overflow in bn; images not constrained; tap-target crowding; tables overflowing; header wrapping.
- Test widths: 320, 360, 390, 414, 768, 1024, 1280, 1440, 1920; orientation changes; browser zoom 200% and text-only zoom (WCAG 1.4.4/1.4.10 reflow at 320px).
- Respect `prefers-reduced-motion`, `prefers-contrast`, `prefers-color-scheme` (if dark mode is out of scope, ensure it doesn't break: set `color-scheme: light`).

### 4.5 Information architecture & content design
- Nav labels jargon-y ("Curriculum & Tuition Matrix"); more than 7 +/- 2 top-level items; no clear primary path (diagnostic -> signup).
- Pricing unclear (hidden fees, VAT surprises, unclear currency); no comparison clarity; unclear refund terms.
- No trust signals that are real (instructor credentials, sample content, transparent methodology) vs. fake ones.
- Reading level too high; sentences > 25 words; inconsistent terminology (diagnostic/assessment/test).
- Primary CTA label vague ("Submit", "Learn more").

### 4.6 Performance as UX (mobile, Bangladesh network realities)
- LCP > 2.5s on throttled Slow 4G; INP > 200ms; CLS > 0.1; page weight > ~1.5MB on first load; unoptimized hero photos; render-blocking fonts; large JS bundles; third-party scripts (chat, analytics) blocking main thread; no `font-display: swap`; Bengali font files too large (subset + preload only primary weight).
- Layout shift from images without dimensions, late-loading fonts, banners injected after load (TopRibbon must reserve space).

### 4.7 Accessibility (WCAG 2.2 AA minimum)
- Missing `alt` (decorative = `alt=""`, informative = meaningful); heading level skips; multiple/no `h1`; landmarks missing (`header`, `nav`, `main`, `footer`); skip link missing; link text "click here"; `lang` attribute not switching with locale (`lang="bn"`); `div` buttons; ARIA misuse (ARIA overrides worse than none); autoplaying media; captions/transcripts for any video; target size; dragging alternatives; consistent help/nav placement; accessible authentication (no cognitive-test-only login).

---

## 5. Engineering mistakes a senior team would reject

### 5.1 Correctness & maintainability
- `any`, `as unknown as`, non-null assertions to silence TS; disabled lint rules; dead code; duplicated logic; god components; prop drilling workarounds; magic numbers; inconsistent naming; unused deps; commented-out code; console logs.
- Unkeyed or index-keyed lists; effects with missing deps; derived state stored in state; race conditions in async fetches without cancellation.

### 5.2 Next.js / React specifics
- Hydration mismatches (date/locale/random in render, `localStorage` reads during SSR, `Math.random`, `window.innerWidth` branching).
- `"use client"` at the top of everything (kills server rendering, bloats bundle); data fetching in client when server fits.
- Missing `generateMetadata`, canonical, hreflang for en/bn, OG images; `robots`/`sitemap` absent; locale routing breaking SEO (duplicate content, no `hreflang`).
- `next/image` misuse (missing `sizes`, `priority` on everything, remote domains unconfigured); `next/font` loaded per component; CSS-in-JS flashes.
- Environment variable leaks (`NEXT_PUBLIC_` on secrets).
- Caching mistakes (stale prices cached forever; dynamic pages unintentionally static).

### 5.3 Boundary rules for primitives
Server by default; `"use client"` only for `MegaMenu`, `Tabs`, `Disclosure` (if not native `<details>`), `TopRibbon` dismissal; no `window`/`document` outside effects; no storage access without try/catch.

### 5.4 Security & abuse
- `dangerouslySetInnerHTML` with unsanitized content (translations!); open redirects; unvalidated `redirect`/`next` params; missing CSP/security headers (`next.config` headers: CSP, `X-Content-Type-Options`, `Referrer-Policy`, `frame-ancestors`); secrets in repo/history (gitleaks); vulnerable deps (`pnpm audit`); CSRF on state-changing routes.
- `/api/translate` specifically: unauthenticated cost-abuse endpoint -> rate limiting, input length caps, allow-listed source strings or caching, no user-controlled prompt injection into translation backend, abuse monitoring, budget alerts.
- Third-party scripts without SRI/consent; analytics firing before consent where required.
- Student data: PII minimization, privacy policy accuracy, cookie consent as required, payment pages handled only by a PCI-compliant provider (never custom card inputs).

### 5.5 Git/process hygiene
- Giant commits, mixed concerns, force-push, committing `.env`, `node_modules`, build output, lockfile churn, rebase/merge disasters, editing generated files, no PR description, no rollback plan.

---

## 6. Prevention architecture (summary map)

| Layer | Mechanism | Stops |
|---|---|---|
| Spec | Task contract (Sec. 10), file allow-list, explicit non-goals | B5, B16, H5 |
| Types | TS strict, literal-union props, generated i18n keys, env schema | H3, H6, H8 |
| Primitives | Closed vocabulary of components; content caps | B1, B2, D3 |
| Lint | Custom rules (design:lint), eslint-plugin-tailwindcss, jsx-a11y, no-disable | B9, B11, H4 |
| Tests | Unit (caps/props), component (RTL), e2e (Playwright), a11y (axe), visual | B10, B12 |
| CI | Required checks, protected paths, diff-size caps, dependency guard | B5, B6, H1 |
| Review | Human + second-model review with evidence | B15, B20 |
| Monitoring | Real-user metrics, error tracking | everything that slipped |

---

## 7. Automated verification methods (what to run)

### 7.1 Static
- `tsc --noEmit` (strict) | `eslint --max-warnings 0` (+ `jsx-a11y`, `tailwindcss`, `react-hooks`, `@next/next`) | `stylelint` (if CSS files) | `prettier --check`
- `knip` / `depcheck` (unused files/deps) | `jscpd` (duplication) | `madge --circular`
- Custom `design:lint` (Strategy doc 10.2) + extra checks below.
- Handy greps on the diff (fail CI on match unless allow-listed):
  - `git diff -U0 | grep -E '^\+.*(TODO|FIXME|lorem|placeholder|mock|dummy)'`
  - `grep -RInE 'eslint-disable|@ts-ignore|@ts-nocheck|@ts-expect-error|as any|: any' app components`
  - `grep -RInE '#[0-9a-fA-F]{3,8}\b|rgb\(|hsl\(' app components --include=*.tsx` (outside tokens)
  - `grep -RInE 'text-\[[0-9]+px\]|p[xytblr]?-\[|m[xytblr]?-\[|w-\[|h-\[' app components`
  - `grep -RInE 'border|shadow|rounded-(md|lg|xl|2xl|3xl)' app --include=page.tsx`
  - `grep -RInE 'uppercase|tracking-' app components --include=*.tsx` (review against allow-list)
  - `grep -RInE 'https?://.*\.(png|jpe?g|webp|svg)' app components`
  - `grep -RIn 'dangerouslySetInnerHTML\|!important\|z-\[' app components`
  - `grep -RInE '"(\w+\.){1,}\w+"' app` for suspicious i18n keys vs dictionary.

### 7.2 Unit & component tests
- Content cap tests (words per field), i18n parity, prop validation, `Heading` level logic, `StatRow` rejects unverified.
- React Testing Library: roles/names (`getByRole`), keyboard interaction for `Tabs`, `Disclosure`, `MegaMenu` (Tab, Shift+Tab, Arrow keys, Esc), focus return.
- Mutation testing (Stryker) on primitives to catch fake tests.

### 7.3 End-to-end (Playwright)
- Critical paths: locale switch en<->bn keeps route; diagnostic start; pricing tab switch; mega-menu open/close with keyboard; mobile drawer; cookie/consent; 404 page; form submissions; broken-link crawl.
- Network/CPU throttling profiles; offline behavior; slow image load.

### 7.4 Visual regression
- Playwright `toHaveScreenshot` at 390/768/1440 x en/bn, deterministic (fixed fonts, disable animations, mock dates, masked dynamic regions). Thresholds small; **baseline updates require human approval**.
- Computed-style audits via `page.evaluate`: count elements with border/box-shadow (<= 6 per page), min font size >= 14px, no element wider than viewport, no fixed-height text containers, all images have dimensions and alt.
- Optional: Percy / Chromatic for review UI.

### 7.5 Accessibility
- `@axe-core/playwright` per route/state (0 serious/critical); Lighthouse a11y >= 95; `pa11y-ci`.
- Manual: keyboard-only pass; screen reader pass (NVDA+Firefox/Chrome on Windows, VoiceOver on iOS/Safari, TalkBack on Android) for header, menu, tabs, forms; 200%/400% zoom; Windows High Contrast; reduced motion; color-blind simulation; contrast with a tool (not by eye).

### 7.6 Performance
- Lighthouse CI budgets: LCP <= 2.5s, INP <= 200ms, CLS <= 0.1, TBT low, JS <= agreed KB; run on **mobile + Slow 4G + 4x CPU slowdown**.
- WebPageTest from a nearby region on a mid-range Android profile; bundle analyzer (`@next/bundle-analyzer`); image weight audit; font loading audit; third-party script audit.
- RUM after launch (Web Vitals to analytics) because lab != field.

### 7.7 Cross-browser/device matrix
Chrome (desktop/Android), Safari iOS (latest and N-2), Firefox, Edge, Samsung Internet; low-end Android (2-3GB RAM) real device or BrowserStack; small phones (320-360px); large desktops/ultrawide; tablets.

### 7.8 i18n / l10n
- Pseudo-localization (+35% length, accents) to find clipping; real Bengali long strings; bn numerals vs Latin numerals policy; date/number/currency formatting (BDT, `Intl`); line-break behavior; font fallback (no tofu); `lang`/`hreflang`; locale persistence; untranslated-key fallback visible in dev; no layout dependent on English text length; **native Bengali speaker review**.

### 7.9 Content & SEO
- Spellcheck/grammar; reading-level check; terminology consistency; claims audit table (claim -> source -> approver); link checker; image alt review; metadata, canonical, `hreflang`, sitemap, robots, structured data (`Organization`, `Course`, `FAQPage` only if content truly matches), social previews, `noindex` on staging.

### 7.10 Security
- `pnpm audit`, Dependabot/Renovate, `gitleaks`/`trufflehog`, CSP report-only then enforce, header scan (securityheaders.com), dependency license check, rate-limit tests on `/api/translate`, basic OWASP checklist pass.

### 7.11 Deployment safety
- Preview deploy per PR; staging `noindex`; feature flags for risky changes (mega-menu); canary/gradual rollout; one-click rollback; error tracking (Sentry); uptime & synthetic checks.

---

## 8. Human & design-review methods

| Method | When | What it catches |
|---|---|---|
| **Design QA vs reference/blueprint** (side-by-side, pixel-peeping) | Each page | Spacing, hierarchy, "AI card soup" regressions |
| **Heuristic evaluation (Nielsen's 10)** | Before launch | Visibility of status, consistency, error prevention, recognition vs recall |
| **Cognitive walkthrough** of key tasks ("find the IELTS test info", "start diagnostic", "buy a course") | Each major flow | Dead ends, unclear labels |
| **5-second test / first-click test** | Home, pricing | Message clarity, CTA discoverability |
| **Usability testing, 5 users** (include Bengali-first and mobile-only users; think-aloud) | Pre-launch + post | Real confusion; catches ~80% of major issues |
| **Content review** (SME for exam accuracy, native editor for Bengali, legal for claims) | Before publish | C1-C10 |
| **Accessibility expert/manual audit** | Pre-launch | What automation misses (~60-70% of WCAG issues need manual) |
| **Code review by a human** (focus on diffs, tests, deletions) | Every PR | B6, B9, B11 |
| **Design critique ("what would I remove?")** | Each page | Excess; apply "remove 20%" pass |
| **A/B or staged experiments** | Post-launch | Real conversion impact vs taste |
| **Session replay / heatmaps / analytics funnels** | Post-launch | Rage clicks, dead zones, mobile drop-offs |

---

## 9. Self-audit options for the model (use, but never trust alone)

Models are poor at grading themselves; self-audits reduce error but cannot replace Sec. 7-8. Use them as a cheap first filter and **always require evidence**.

1. **Receipts rule**: report must include raw output of `tsc`, `eslint`, `design:lint`, tests, `git diff --stat`, and screenshot file paths. No receipts = rejected.
2. **Requirement traceability table**: each requirement -> file/line implementing it -> evidence (test/screenshot).
3. **"What I did NOT do / could not verify"** section (mandatory). Empty = suspicious.
4. **Assumptions & conflicts list** (mandatory). Any guess about content, data, or design = listed.
5. **Diff self-review**: model reads its own `git diff` and lists anything touching files outside the allow-list, deleted lines, new deps, new `any`/disable comments, new literals.
6. **Adversarial pass**: "Find 5 ways this violates the Constitution" run as a separate step; must cite file:line or state "none found" with grep evidence.
7. **Cross-model review**: a different (ideally stronger) model reviews the diff against the Constitution and blueprint, blind to the author's summary. Disagreements go to a human.
8. **Checklist self-score with evidence** per Section 11 (binary, not "mostly").
9. **STOP triggers** (model must halt and ask, not proceed):
   - A needed primitive/prop/token/content field doesn't exist.
   - Spec conflicts with Constitution or reference.
   - Needs a new dependency, env var, or route.
   - Touches protected paths or deletes > N lines.
   - A check fails twice.
   - Any fact (price, stat, date, exam rule) not in a content file.
   - Any requirement ambiguous in a way that changes UI structure.
10. **Confidence flags**: model labels each claim `verified-by-tool`, `verified-by-reading-code`, or `assumed`. Only the first counts.
11. **Rubber-duck replay**: model describes the rendered page top-to-bottom from the DOM (not from memory of the code); human compares to blueprint.
12. **Rollback readiness**: model states how to revert (branch name / commit), confirming no migrations or irreversible changes.

---

## 10. Task contract (fields every cheap-model task must have)

(Not a prompt; the structure of a ticket.)
- **Objective** (one sentence, one route/component).
- **Inputs**: Constitution, blueprint section, one reference screenshot, primitive type definitions, content file paths.
- **Allowed files** (exact paths) / **Read-only files** / **Forbidden paths**.
- **Non-goals** (explicit: no refactors, no new deps, no copy changes).
- **Acceptance criteria** (testable) + Definition of Done matrix (Sec. 11).
- **Required evidence** list.
- **STOP triggers** (Sec. 9.9).
- **Limits**: max files, max diff lines, max fix attempts (2).
- **Rollback note.**

---

## 11. Checklists

### 11.1 Per-PR (every task)
- [ ] Diff touches only allowed files; no formatting-only noise
- [ ] No new dependencies, env vars, routes without approval
- [ ] `tsc`, `eslint --max-warnings 0`, `design:lint`, unit/e2e tests all green in CI (link)
- [ ] No new `any`, `@ts-ignore`, `eslint-disable`, `!important`, arbitrary values, hex literals
- [ ] No TODO/FIXME/lorem/mock/placeholder text in shipped paths
- [ ] Tests meaningful (assertions verify behavior); no deleted/weakened tests; snapshots updated only with approval
- [ ] i18n parity; no hardcoded strings; Bengali reviewed or flagged
- [ ] Screenshots 390/768/1440 x en/bn attached; no overflow; bordered-element count within budget
- [ ] Keyboard pass + axe clean for changed UI
- [ ] Protected paths untouched
- [ ] All claims/stats/prices from content files with sources
- [ ] Report includes assumptions, unverified items, rollback

### 11.2 Component/primitive done
- [ ] All states in 4.3 implemented/handled
- [ ] Keyboard and screen-reader behavior verified manually
- [ ] Works at 200% zoom and 320px width
- [ ] Works with very long Bengali strings and with missing image
- [ ] Documented in `/dev/ui` with en+bn examples
- [ ] Caps and forbidden props enforced by types/tests

### 11.3 Pre-launch (whole site)
- [ ] Lighthouse mobile: Perf >= 85 target, A11y >= 95, SEO >= 95, Best Practices >= 95; Core Web Vitals within budget on Slow 4G
- [ ] Manual a11y audit passed; keyboard-only complete journey (home -> diagnostic -> enroll)
- [ ] Cross-browser/device matrix passed incl. low-end Android and iOS Safari
- [ ] Content audit signed: exam facts (SME), Bengali (native editor), legal/claims, pricing (owner)
- [ ] No fake stats/testimonials; trademark/non-affiliation lines present
- [ ] Security: headers, CSP, audit clean, secrets scan clean, `/api/translate` rate-limited with budget alerts
- [ ] Privacy policy/cookie consent accurate to actual tracking
- [ ] SEO: sitemap, robots, canonical, hreflang, metadata per locale; staging `noindex` removed only at launch
- [ ] Error tracking + analytics + RUM live; alerts configured
- [ ] 404/500/offline/empty states designed
- [ ] Redirect map for any changed URLs
- [ ] Rollback plan tested; backups exist
- [ ] Usability test with >= 5 target users (incl. Bengali-first, mobile) with no unresolved severity-1/2 issues

---

## 12. The Mistake Ledger (make the system learn)

Maintain `docs/MISTAKE-LEDGER.md`, one row per escaped or caught mistake:

| Date | Task | Model | Mistake (class from this doc) | Caught by | Root cause | Permanent fix (new lint/test/type/primitive/spec rule) | Fix merged? |
|---|---|---|---|---|---|---|---|

Rules:
- Every mistake that reaches review without being caught by automation = **a missing automated check**; add it.
- Review the ledger weekly; promote repeated classes into the Constitution (keep it <= 1 page: remove or merge rules to make room).
- Track metrics: % tasks passing lint first try, # review rounds per task, escaped defects per release, bordered-element count trend, Lighthouse trend. If a model's first-pass rate stays low, narrow its tasks or route that work to a stronger model.

---

## 13. Severity triage

| Sev | Definition | Examples | Response |
|---|---|---|---|
| S1 | Legal/trust/security/data or broken core journey | Fake stats, wrong exam facts, leaked secret, checkout broken, locale switch broken | Block release / hotfix |
| S2 | Major UX/a11y/perf failure | Keyboard trap, mega-menu unusable on mobile, LCP > 4s, bn text clipped | Fix before release |
| S3 | Visible polish/consistency | Spacing off-grid, wrong radius | Fix this sprint |
| S4 | Nit | Naming, minor copy | Backlog |

---

## 14. Quick reference: what to refuse in review

Reject the PR if you see: a new bordered card; a tiny uppercase label; a hex color; `text-[Npx]`; a `<table>` outside a Disclosure; a stat without a source; an image URL; an `eslint-disable`; a deleted test; an unexplained dependency; a diff touching `LocaleSwitcher` or `/api/translate`; a "done" report with no command output; or a screenshot set missing Bengali or mobile.
