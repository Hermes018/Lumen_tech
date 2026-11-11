# Lumen Academy — Complete Build Blueprint

IELTS + GRE courses and a faithful computer-based mock-test platform, with AI writing and speaking feedback, an AI tutor and smart flashcards. It's Bangladesh-first (Bangla + English, BDT, bKash/Nagad) and every asset has an English international version (USD, three purchasing-power regions).
Later phases add PTE, DET, Spoken English, admissions help (Common App), Work-Abroad languages, ML/AI/database/networking tracks and university courses.
**"Lumen Academy" is a placeholder name.** Pick your brand, then set it once in `packages/config/brand.ts`.

This folder is the whole plan. It's written so **Claude Code (Opus lead, Sonnet/Haiku subagents)** or **Gemini** can build from it task by task, with guardrails, logs and verification at every step.

---

## Documents

**Rule:** `docs/00-DECISIONS.md` is the law. If any document disagrees with it, 00 wins.

### Strategy & market
| # | File | What it is |
|---|---|---|
| 00 | `docs/00-DECISIONS.md` | Locked decisions D1–D12: phases, stack, routes, roles, commerce, test-engine rules, security, design, AI routing, **tier framework**, portfolio hedge, and 30+ binding resolutions |
| 01 | `docs/01-COMPETITOR-TEARDOWN.md` | 27 competitors (Magoosh, 10 Minute School, PTE/Pearson, BC/IDP, Khan, Coursera/Udemy, Duolingo, Indian ed-tech, Common App and more): offers, prices, monetization, channels, lessons |
| 02 | `docs/02-BUSINESS-PLAN.md` | Market sizing, unit economics, GTM, team, 3-year projections, funding, legal, risks, 30/60/90 plan |
| 17 | `docs/17-PRICING-MASTER.md` | **Canonical price book**: every tier, perk, add-on, pass, book, live batch, B2B and admissions service, in BDT plus USD regions A/B/C, with margins, guarantees, refunds, promos and a machine-readable YAML |
| 19 | `docs/19-MARKETING-BANGLADESH.md` | Segments: students, parents, middle-aged migrants and professionals, rural and low-income aspirants, institutions. Bangla + English messaging, channels, partnerships, calendar, budget, compliance |
| 20 | `docs/20-MARKETING-INTERNATIONAL.md` | The English-only counterpart: countries, SEO, YouTube, Reddit/Discord, affiliates, PPP pricing, budget, mirror table to 19 |
| 21 | `docs/21-ADMISSIONS-COMMON-APP.md` | Common App and UCAS application support. Feedback-only essay integrity, tools, counsellor tiers, scholarships, ethics |
| 24 | `docs/24-TIMELINE.md` | **Realistic timeline**: prototype (≈ 27 Nov 2026), alpha (≈ 8 Jan 2027), paid pilot (≈ 1 Mar 2027), public launch (≈ 3 May 2027). Gantt, critical path, capacity assumptions |

### Product, learning & content
| # | File | What it is |
|---|---|---|
| 03 | `docs/03-PRODUCT-SPEC.md` | Personas, sitemap, every feature with acceptance criteria, role capabilities, **dynamic dashboards**, journeys |
| 14 | `docs/14-CURRICULUM-IELTS.md` | Full IELTS syllabus: Listening, Reading, Writing (Academic T1, GT letter, T2) and Speaking Parts 1–3. Objectives per band, every lesson, strategies, tier material maps, study plans, Foundation, Life Skills, Spoken English |
| 15 | `docs/15-CURRICULUM-GRE-AND-OTHER-TESTS.md` | GRE Verbal, Quant and AWA; PTE, DET and TOEFL 2026; tech tracks and Bangladeshi university CSE packs |
| 16 | `docs/16-CONTENT-SOURCING-AND-PRODUCTION.md` | Where content comes from and what's legal. Item writing, the AI-assisted pipeline, listening audio and video recording standards and kit, PDFs and books, content ops |
| 18 | `docs/18-LIVE-CLASSES.md` | Regular, crash, weekend, evening and women-only batches, speaking club, GRE live and 1:1. Session-by-session plans, teachers, tech, safeguarding |
| 34 | `docs/34-AI-LEARNING-FEATURES.md` | Magoosh- and NotebookLM-style features: AI tutor with citations, FSRS flashcards, score predictor, audio overviews (Bangla/English), mind maps, study guides, AI coaches, PWA, free trial, guarantees |

### Engineering
| # | File | What it is |
|---|---|---|
| 04 | `docs/04-ARCHITECTURE.md` | System diagrams, monorepo tree, domains, request lifecycles, rendering and caching, environments, costs |
| 05 | `docs/05-DATABASE.md` | Canonical Drizzle/Postgres schema, ERDs, integrity rules, PII inventory, seeds |
| 06 | `docs/06-API-AND-SERVICES.md` | Service pattern, every service and action, webhooks, exam API, events, **permission matrix** |
| 07 | `docs/07-TEST-ENGINE.md` | IELTS/GRE blueprints, question types, scoring, GRE adaptivity, autosave/timer, exam shell, AI evaluation |
| 08 | `docs/08-UI-UX-DESIGN-SYSTEM.md` | Apple-style tokens, components, every page, dashboards, motion, Bangla typography, anti-vibe-coded checklist |
| 09 | `docs/09-SECURITY-AUTH-COMPLIANCE.md` | Threat model, Google sign-in, OTP, passkeys, 2FA, RBAC, OWASP 2025 / ASVS 5.0 L2, CSP, AI safety, PDPO/GDPR |
| 10 | `docs/10-PAYMENTS-VIDEO-INTEGRATIONS.md` | SSLCommerz, bKash, Paddle/Stripe, entitlements, VAT, Bunny Stream, live, R2, email/SMS, AI providers, **every env var** |
| 11 | `docs/11-DEVOPS-OBSERVABILITY.md` | CI/CD, supply chain, migrations, monitoring, SLOs, backups/DR, performance budgets, load tests, launch checklist |
| 22 | `docs/22-ENGINEERING-GUARDRAILS.md` | **Agent guardrails**: phase/sub-phase map, model and cost routing, context retention and compaction, anti-hallucination, verification ladder (DOM, visual, stress), reviewers, resume after dropped connections, git plan, logs, file maps, fanless-Mac and multi-device rules |
| 23 | `docs/23-DESIGN-RESEARCH-PLAYBOOK.md` | How to learn layout, navigation and motion cues from top sites ethically (DevTools, not Ghidra), teardown protocol, 24 approved animations, professional craft tricks, licensed templates |
| 28 | `docs/28-FOUNDER-SETUP-AND-ENVIRONMENTS.md` | Day-0 setup on the MacBook Air and a second machine, account order, annotated `.env.example`, first run, troubleshooting |
| 33 | `docs/33-I18N-AND-BANGLA-LOCALISATION-WORKFLOW.md` | next-intl, Bangla plurals and digits, fonts, glossary, translation workflow, CI checks |

### Operations
| # | File | What it is |
|---|---|---|
| 25 | `docs/25-GAP-AUDIT.md` | Independent audit: ~60 gaps and 24 contradictions, all resolved via D12 and the final fix pass |
| 26 | `docs/26-LEGAL-AND-POLICY-DRAFTS.md` | Drafts of Terms, Privacy, Refund, AI-scoring disclaimer, integrity, trademark, safeguarding, creator/contractor agreements, admissions terms. **Lawyer review required** |
| 27 | `docs/27-SUPPORT-AND-TRUST-OPERATIONS.md` | Chatwoot helpdesk, SLAs by tier, 30 macros (en/bn), 71 help articles, moderation, fraud, disputes, safeguarding |
| 29 | `docs/29-NOTIFICATIONS-AND-LIFECYCLE-MESSAGING.md` | 146 messages catalogued (event → channel → template → timing → opt-out), SMS/WhatsApp rules, deliverability |
| 30 | `docs/30-FINANCE-TAX-AND-PAYOUTS-OPS.md` | Revenue recognition, reconciliation, VAT/Mushak, withholding, payouts, month-end close, accountant gate |
| 31 | `docs/31-AI-EVALUATION-OPERATIONS.md` | Human rater programme, gold sets and budget, eval harness, drift monitoring, publishing accuracy |
| 32 | `docs/32-ANALYTICS-AND-EXPERIMENTATION.md` | North star, KPI dictionary, event taxonomy, consent, dashboards, honest pricing-test protocol |

### Build kit & tracking
| File | What it is |
|---|---|
| `docs/12-BUILD-PLAN-AGENTS.md` | Model routing, task cards, quality gates, Claude→Gemini handoff, **the full backlog** |
| `docs/13-PROMPTS.md` | Copy-paste prompts for every situation |
| `docs/PROGRESS.md`, `docs/HANDOFF.md` | Live task tracker (with milestones M0–M3) and the Claude↔Gemini baton |
| `docs/approved-deps.txt` | Pre-approved npm packages. The hook blocks anything else until it's vetted (slopsquatting protection) |
| `build-kit/` | Copy to repo root: `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, `.claude/agents/*` (13 subagents with model routing), `.claude/commands/*` (15 incl. `/checkpoint`, `/status`, `/handoff`, `/resume`, `/stress-test`, `/cross-check`), `.claude/hooks/*` (path and bash guards, session-start, pre-compact, stop-log), `.claude/rules/*`, `docs-templates/logs/*`, `.gemini/settings.json` |
| `research_notes/` | The raw research (two rounds) with sources and gaps |

---

## Reading paths

- **You, as founder (≈ 2 hours):** 00 → 24 → 02 → 17 → 19 → 14 (skim) → 22 §1–2 → 28.
- **The lead agent (every session):** `CLAUDE.md` → 00 → `PROGRESS.md` → only the doc sections named in the task card.
- **A content hire:** 14/15 → 16 → 31 (raters) → 33 (Bangla).
- **A marketer:** 19/20 → 17 → 29 → 32.

## Start building tonight

Follow `24-TIMELINE.md` §6 and `28-FOUNDER-SETUP-AND-ENVIRONMENTS.md`:
1. Install the tools on the MacBook Air (Homebrew, mise, pnpm via corepack, gh, Claude Code, Gemini CLI).
2. Create the GitHub repo, copy in `docs/` and the contents of `build-kit/` (including the hidden `.claude/` and `.gemini/` folders), commit and push.
3. Open Claude Code with Opus and paste **Session kickoff** from `13-PROMPTS.md`.
4. Loop: `/next-task` → (agent implements, `pnpm verify`, review, commit, push) → repeat. Run `/checkpoint` before you stop or whenever the connection is shaky.
5. If the Claude limit hits: `/handoff`, then Gemini plus the "Gemini resume" prompt. When Claude is back: `/resume`.

## Start these on Monday (they gate the pilot)

- **Business registration**: trade licence, TIN, BIN and bank account. SSLCommerz live needs them (critical path; see 24 §2).
- **SSLCommerz** (sandbox now, live later), **Google OAuth** verification, **BD SMS sender-ID** masking.
- Accounts: Neon, Vercel Pro, Cloudflare, Resend, Bunny Stream, Upstash, Sentry, PostHog, Chatwoot, plus Anthropic, Deepgram and OpenAI keys with spend limits.
- Hire **2 part-time item writers**, a video editor, a Bangla editor and 4–6 raters. Content, not code, is the bottleneck.

## Still yours to decide or verify

1. **Brand name and domain.** No "IELTS" or "GRE" in the brand, domain, handles or ad keywords (ETS rules).
2. **Tax/VAT** (startup exemption, Mushak, withholding): chartered accountant. **Legal drafts** (26): Bangladesh-qualified lawyer.
3. **Exam facts and vendor prices** marked *verify*: check them against official handbooks and pricing pages before publishing.
4. **Funding**: realistic AI-scoring calibration costs about BDT 1.9M, not 0.18M (31). The plan's funding need was raised to match (02 §11.4).

> Notes: "collegeapp" is **Common App** (confirmed, see 21). "Pearson IELTS": Pearson runs **PTE Academic**; IELTS belongs to the British Council, IDP and Cambridge.
