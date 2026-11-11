# 24 — Realistic Timeline: Prototype → Pilot → Launch

> Owner: lead (Opus). Written 2026-11-07 (Sat). Weeks start Monday; **Week 1 = 9 Nov 2026**.
> This plan assumes the build method in `12-BUILD-PLAN-AGENTS.md` and `22-ENGINEERING-GUARDRAILS.md`. Every date is a target, not a promise. Re-plan every Friday in `docs/logs/progress/`.

---

## 1. The honest headline

| Milestone | What it is | Earliest (everything goes right) | Realistic | Gate to pass |
|---|---|---|---|---|
| **M0 — Clickable prototype (GRE Priority)** | Real site on a preview URL: design system, Google + email-OTP sign-in, catalogue, course landing page, learner dashboard shell, **one GRE Quant + Verbal mini-sectional in the real GRE exam shell** (on-screen 4-function calculator with transfer-display, TC/SE/QC/Numeric Entry items, strikethrough option eliminator, server timer, 10s autosave), one Magoosh-style custom practice session with step-by-step explanations + FSRS Vocab deck preview, and one GRE AWA Issue AI evaluation | **Fri 20 Nov 2026** (≈ 2 weeks) | **Fri 27 Nov 2026** (3 weeks) | Demo works on mobile/desktop; `pnpm verify` green; no fake data in screenshots |
| **M1 — Internal alpha (GRE Core + Magoosh Engine)** | P0 complete + GRE CBT Mock & Practice Engine with section-level adaptivity (Verbal 12Q/18m -> 15Q/23m, Quant 12Q/21m -> 15Q/26m), Magoosh custom practice (topic/difficulty/mode), pacing tracker & score predictor (130-170), GRE Vocab Pro (FSRS flashcards), GRE AWA AI evaluation (labelled *beta*), studio for item authoring, SSLCommerz **sandbox** checkout → entitlement, admin basics | **Fri 18 Dec 2026** (6 weeks) | **Fri 8 Jan 2027** (≈ 9 weeks incl. holiday slip) | 10 internal testers finish full adaptive GRE mock without support; autosave/timer tests pass; security checklist P0 done |
| **M2 — Closed pilot (beta)** | 50–200 invited learners. IELTS Academic **Core + Plus** (≈ 40% of lessons live, all practice sets for L/R, 3 full mocks), Writing/Speaking AI coach, **SSLCommerz live** (bKash/Nagad/cards), Free tier + 7-day Plus trial, 1 Zoom pilot cohort (Live tier), support desk, legal pages reviewed | **Mon 1 Feb 2027** (12 weeks) | **Mon 1 Mar 2027** (16 weeks) | Payment → access works 100/100 in production; AI agreement ≥ 70% within 0.5 band on beta gold set; NPS ≥ 30; no P1 security findings open |
| **M3 — Public launch (P1)** | IELTS Academic + GT (Core/Plus/Live/Mentor), GRE Core/Plus, ≥ 5 full mocks per exam (10 by ~day 120), English Foundation, "Which test do I need?" quiz, certificates, help centre, marketing launch | **Thu 1 Apr 2027** | **Mon 3 May 2027** (≈ 6 months) | Launch checklist in `11` §launch all green; accountant + lawyer sign-off; load test 2,000 concurrent takers passed |
| **M4 — P2 Growth** | Live batches in-app, PTE + DET, Spoken English, Life Skills, admissions tools, B2B seats, community | Aug 2027 | **Sep 2027** (timed for September-intake marketing) | P2 exit criteria in `22` §1 |
| **M5 — P3 Expansion** | Marketplace, tech tracks, university packs, Expo app, LiveKit, Work-Abroad languages | Q1 2028 | **Q2 2028** | P3 exit criteria |

**Why not "done tonight":** the *code* for a prototype can move very fast with agents. The things that cannot be compressed are:
1. **Original content.** About 371 IELTS Academic lessons plus original items, listening audio and mocks. Each GRE mock needs ≈ 114 original items.
2. **Approvals from other organisations:**
   - Trade licence, TIN and BIN.
   - SSLCommerz live onboarding.
   - Google OAuth brand verification.
   - SMS sender-ID masking.
   - Lawyer and accountant review.
3. **AI-scoring calibration.** This needs human-rated essays and recordings (see `31`).
4. **Real learners in a pilot.**

Tonight you can finish setup and start P0 (see §6).

---

## 2. Gantt (realistic plan)

```mermaid
gantt
  title Lumen Academy — realistic plan (Week 1 = 9 Nov 2026)
  dateFormat  YYYY-MM-DD
  axisFormat  %d %b
  section Engineering
  P0.1 Repo, tooling, CI, guardrails        :e1, 2026-11-08, 6d
  P0.2 DB, auth (Google/OTP/passkey), RBAC  :e2, after e1, 8d
  P0.3 Design system + shells + marketing   :e3, 2026-11-12, 12d
  M0 prototype (Reading sectional + AI eval):milestone, m0, 2026-11-27, 0d
  P1.1 Exam engine L/R/W/S + autosave       :e4, 2026-11-23, 21d
  P1.2 Studio authoring + question bank     :e5, 2026-11-30, 14d
  P1.3 AI writing/speaking pipeline         :e6, 2026-12-07, 14d
  P1.4 Commerce: SSLCommerz + entitlements  :e7, 2026-12-14, 12d
  M1 internal alpha                         :milestone, m1, 2027-01-08, 0d
  P1.5 Dashboards, plan, flashcards, tutor  :e8, 2027-01-04, 21d
  P1.6 Support desk, notifications, legal   :e9, 2027-01-18, 14d
  P1.7 Hardening, load test, a11y, perf     :e10, 2027-02-01, 21d
  M2 closed pilot                           :milestone, m2, 2027-03-01, 0d
  P1.8 GRE engine adaptivity + GRE content wiring :e11, 2027-03-01, 21d
  P1.9 Pilot fixes + launch polish          :e12, 2027-03-22, 35d
  M3 public launch                          :milestone, m3, 2027-05-03, 0d
  section Content
  Item specs, style guides, templates       :c1, 2026-11-09, 10d
  IELTS L/R items + listening audio (mock 1):c2, 2026-11-16, 28d
  Video lessons batch 1 (≈ 60 lessons)      :c3, 2026-11-30, 42d
  Mocks 2–3 + writing/speaking prompts      :c4, 2026-12-21, 42d
  Gold set: 200 essays + 100 speaking (beta):c5, 2026-12-01, 56d
  GRE items (5 mocks ≈ 570 items)           :c6, 2027-01-04, 84d
  IELTS GT + remaining lessons              :c7, 2027-02-01, 84d
  section Business & legal
  Trade licence, TIN, BIN, bank account     :b1, 2026-11-09, 28d
  SSLCommerz sandbox → live onboarding      :b2, after b1, 21d
  Google OAuth verification                 :b3, 2026-12-14, 21d
  SMS masking registration                  :b4, 2026-11-23, 21d
  Lawyer review of 26 drafts                :b5, 2027-01-18, 21d
  Accountant: VAT/Mushak, payouts setup     :b6, 2027-01-11, 21d
  section Marketing
  Brand, domain, socials, waitlist page     :k1, 2026-11-16, 14d
  YouTube/FB free-content engine (2–3/wk)   :k2, 2026-12-01, 150d
  Pilot recruitment (200 invites)           :k3, 2027-02-01, 28d
  Launch campaign                           :k4, 2027-04-12, 28d
```

**Throughput check:** P0 + P1 = 271 agent tasks. At 4–8 tasks per working day that is about 34–68 working days of agent time. That fits inside the ~25 weeks to launch only because tasks are small and verify-gated, and because the human gates (BG-01…16: lawyer, accountant, gateway onboarding, raters and so on) run in parallel. If throughput drops below about 3 tasks/day for two weeks, cut P1 scope using the MoSCoW column in 03 rather than moving the pilot.

**Critical path:** the business registration feeds SSLCommerz live, and both block taking real payments in the pilot (M2). Content for mocks 1–3 and the beta gold set are on the same critical path. Engineering is **not** the bottleneck if the guardrails are followed. **Start the business registration on Monday 9 Nov.**

---

## 3. Phase → sub-phase → sub-sub-phase (with backlog mapping)

The full hierarchy with entry and exit criteria lives in `22-ENGINEERING-GUARDRAILS.md` §1. The task IDs are in `12` and `PROGRESS.md`. Summary:

| Phase | Sub-phases | Backlog IDs | Weeks (realistic) |
|---|---|---|---|
| P0 Foundation | P0.1 repo/tooling/guardrails · P0.2 data/auth/RBAC · P0.3 design system/shells · P0.4 marketing + catalogue + CMS | P0-01 … P0-71 (71 tasks) | W1–W5 |
| P1 MVP | P1.1 exam engine · P1.2 authoring/bank · P1.3 AI evaluation · P1.4 commerce · P1.5 learner features · P1.6 ops (support/notifications/legal) · P1.7 hardening · P1.8 GRE · P1.9–P1.12 parallel streams (support/legal, notifications/analytics, finance, AI features — see 12) → launch | P1-01 … P1-200 (200 tasks) + human gates BG-01…BG-16 | W3–W25 |
| P2 Growth | live in-app, PTE/DET, Spoken English, Life Skills, admissions, B2B, community, instalments | P2-* (62 tasks) | May–Sep 2027 |
| P3 Expansion | marketplace, tech tracks, app, LiveKit, Work-Abroad | P3-* (25 tasks) | 2028 |

---

## 4. Capacity assumptions (change these and re-plan)

| Assumption | Value | If it is worse |
|---|---|---|
| Founder focused hours | 6 h/day, 6 days/week | At 3 h/day, multiply engineering durations by ~1.8 |
| Claude plan | A Max-class subscription with 5-hour and weekly limits. Opus for planning and review, Sonnet for implementation, Haiku for chores (see `22` §2) | Lower tiers: lean on the Gemini handoff and batch Haiku work. Expect about 1.3× longer. |
| Agent throughput | ≈ 4–8 backlog tasks/day once P0.1 is done (small task cards, verify-gated) | Big or vague tasks halve throughput. Keep cards small. |
| Content team | Founder plus **2 part-time item writers**, 1 video editor and 1 Bangla editor from W2 (see `16` §9) | Founder alone means M2 slips to about May and M3 to about Aug 2027 |
| Human raters (gold set) | 4–6 raters from W4 (see `31`) | Without them, AI scores stay "beta" and accuracy can't be published |
| Calendar effects (verify dates) | Year-end slowdown (late Dec). Ramadan expected ≈ Feb 2027 and Eid-ul-Fitr ≈ Mar 2027 (verify). SSC exams 7 Jan–6 Feb 2027. | Pilot recruitment is planned for after the SSC exams, and the Eid week is a buffer |

---

## 5. Week-by-week: the first 4 weeks

| Week | Engineering (agents) | Content | Business / marketing | Exit check (Friday) |
|---|---|---|---|---|
| **W0 (tonight, Sat 7 Nov)** | Setup per `28` (Homebrew, mise, pnpm, gh, Claude Code, Gemini CLI). Create the repo and copy the build-kit. Run P0-45/46/51 (hooks, logs, version pinning) | Pick the brand name and domain. Draft the content style guide | List the trade licence documents | Repo pushed; `/status` works; session log written |
| **W1 (9–15 Nov)** | P0-01…P0-10: monorepo, Next 16, Tailwind v4 + tokens, CI, env validation, Neon branches, Drizzle base schema | Item specs for IELTS Reading and Listening (from `07` and `16`); recruit 2 item writers | Apply for trade licence / TIN; open accounts (Neon, Vercel Pro, Cloudflare, Resend, Bunny, Sentry, PostHog) | `pnpm verify` green in CI; preview URL live |
| **W2 (16–22 Nov)** | Better Auth (Google, email OTP, phone OTP stub, passkeys, 2FA for staff), RBAC + `assertCan` tests, app shells, marketing home | Write the 40 Reading items + 3 passages for mock 1; draft the Listening scripts | Waitlist page and socials; SMS gateway application | Sign-in works on preview with Google; RBAC deny tests pass |
| **W3 (23–29 Nov)** | Catalogue, course landing page, GRE exam shell (Quant/Verbal mini-sectional with on-screen calculator, TC/SE/QC/Numeric Entry items, strikethrough, server deadline, 10s autosave); Magoosh practice mode with step-by-step explanations; GRE Vocab Pro FSRS preview; GRE AWA Issue AI eval | Draft 50 original GRE Quant + Verbal items + explanations; seed FSRS vocab deck (Common words) | First 6 YouTube/FB videos | **M0 prototype demo** (realistic date: Fri 27 Nov) |
| **W4 (30 Nov–6 Dec)** | GRE section-level adaptivity engine (Verbal 12Q->15Q, Quant 12Q->15Q), score predictor (130-170), studio authoring v1, IELTS Reading sectional | GRE mock 1 items complete in studio; IELTS item writing kicks off | Pilot landing page with application form | Full adaptive GRE mock playable end-to-end internally |

From W5, re-plan weekly using `PROGRESS.md` (`/status` gives the burn-down).

---

## 6. What you can do *tonight* (≈ 3–4 hours)

1. Follow `28-FOUNDER-SETUP-AND-ENVIRONMENTS.md` §1–4 on the MacBook Air: install the tools, create the GitHub repo, copy `docs/` and `build-kit/`, and commit.
2. Open Claude Code (Opus) and paste the **Session kickoff** prompt from `13-PROMPTS.md`.
3. Let the lead run **P0-45 (hooks install) → P0-46 (logs scaffolding) → P0-51 (mise/corepack pinning) → P0-01 (monorepo scaffold)**. Each one: `/next-task`, verify, commit, push.
4. Run `/checkpoint` before you stop. Tomorrow, `/session-start` picks up exactly where you left off.
5. Decide: **brand name + domain**, and whether you'll hire 2 item writers now. These two decisions move M2 more than anything an agent can do.

---

## 7. Token / usage budget (planning estimate — calibrate with `/usage`)

Prices are per million tokens (MTok), from the research notes (`agentic_dev_tooling.md`): Opus 5.5 $4 in / $20 out, Sonnet 5.5 $2 / $10, Haiku 5.5 from $0.10 / $0.50. On a subscription, the limiting factor is the 5-hour window and the weekly limit, not dollars.

| Phase | Tasks | Mix (Opus / Sonnet / Haiku by task count) | Rough API-equivalent cost | Notes |
|---|---|---|---|---|
| P0 | 71 | 15% / 70% / 15% | $80–200 | Planning-heavy at the start; cache the docs prefix |
| P1 | 200 | 10% / 82% / 8% | $500–1,200 | Exam engine, payments and AI pipeline need Opus review (two-key rule) |
| Content generation (drafts only, human-edited) | — | Sonnet drafts, Haiku variants, Batch API | $50–150 | Use the batch API (50% off) for bulk drafts |
| Production AI (learners) | — | see `34` §10 and `17` | per user | Not a build cost |

---

## 8. Timeline risks and buffers

| Risk | Effect | Mitigation |
|---|---|---|
| Business registration and SSLCommerz live take longer than 7 weeks | M2 can't take real money | Run the pilot with a manual bKash merchant number plus manual entitlement grants (admin tool, audited) as a stop-gap. Keep the sandbox flow tested. |
| Content writers not hired | M2 slips 6–10 weeks | Launch the pilot with fewer lessons but full practice and mocks: practice-first is fine for a beta. Turn recorded Zoom cohort sessions into lessons (see `16` §8). |
| Gold set too small | AI scores can't be called "validated" | Label scores "beta". Offer human review on Plus, and publish accuracy only once targets are met (`31`). |
| Claude limits during heavy weeks | Velocity drops | Use the Gemini handoff (`/handoff`). Pre-write task cards on Opus at the start of the window, then implement on Sonnet. |
| Fanless Mac thermal throttling | Slow builds and e2e runs | Follow `22` §10: limit workers, run full e2e in CI, use Neon instead of Docker |
| Visa-policy shock cuts IELTS demand | Fewer pilot sign-ups | D11 hedge: test-agnostic messaging, English Foundation, DET/PTE next |

**Buffer policy:** every milestone date above already includes about 25% buffer in the "realistic" column. When a buffer is consumed, write it in the Friday progress log and move the next milestone. Don't compress testing to protect a date.
