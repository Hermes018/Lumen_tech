# 18 — Live Classes Design (Batches, Staff, Tech, Ops, Quality)

> Owner: Head of Live Learning. Conforms to `00-DECISIONS.md` (D1, D3, D5, D10). If this file disagrees with 00, 00 wins.
> **Prices are NOT stated here** — canonical prices live in `17-PRICING-MASTER.md` (cited as "17 §x"); this doc cites 17 for every price, allowance, session count, minimum batch size and guarantee. Allowances per tier (17 §2.2): Plus = weekly live group Q&A (Zoom from P1, D12 C20), 0 speaking-club slots included; Live = 36 sessions (IELTS regular), 6 speaking-club slots, 4 human essay reviews, 2 human speaking mocks; Live Crash = 16 sessions, 3 club slots, 2 essays, 1 speaking mock; **Mentor = Live + 3 × 45-min 1:1 sessions** (more via add-on packs `one-to-one-1/3/5`), 6 essays, 3 speaking mocks. Curriculum content lives in `14-` (IELTS) and `15-` (GRE) curriculum docs (cited as "14/15"). Figures marked **(assumption)** are planning placeholders to be replaced by 17 or by pilot data. Dates marked **verify** must be checked against official calendars before publishing.
> Brand "Lumen Academy" is a placeholder (`packages/config/brand.ts`).

---

## 0. Scope, phasing and design principles

| Phase (D1) | Live capability | Consequence for this doc |
|---|---|---|
| P1 MVP | No in-house live classroom. **Live tier ships as manually-run Zoom pilot cohorts** (D1; resolves OQ-8): enrolment + entitlement in-app, scheduling/attendance by ops, links posted in the learner dashboard and WhatsApp, recordings → Bunny. **Plus weekly live group Q&A also runs on Zoom from P1** (D12 C20, same ops team). Mentor 1:1 sessions are booked manually from the mentor calendar | Treat as "pilot batches" (§8.3); cap sales to what ops can staff; timeline per 24 (closed pilot ~1 Mar 2027 with one Zoom cohort, public launch ~3 May 2027) |
| P2 Growth | `live_batch` product (D5), in-app scheduling and attendance, scheduled classes via embedded **YouTube Live (unlisted)** or **Zoom**, recordings to Bunny | Main target of this doc |
| P3 Expansion | **LiveKit** in-house classroom | §5.4 spec; same pedagogy, new tooling |

Design principles (derived from research: 10 Minute School 12 wk/36 classes of 50 min lecture + 30 min Q&A; British Council India max 20 students, 12 live hours + 30 self-paced; PW 9-10:30 PM evening slots; paid-learner completion ~45-55% at best per Reich & Ruipérez-Valiente 2019):

1. **Live time is for doing, not telling.** Concepts that can be watched go to recorded lessons (14/15); live time is guided practice, feedback and speaking output.
2. **Small where it matters.** Lecture-style rooms can be large; anything with speaking or personal feedback is capped (§1).
3. **Every class leaves evidence**: attendance, poll data, homework, which feed intervention rules (§7).
4. **Completion is designed, not hoped for**: cohorts, deadlines, streaks, mentor pings, make-up classes.
5. **Honesty about outcomes.** Band predictions are "estimated" (D6); no false examiner claims (§4.2).

---

## 1. Live product catalogue

### 1.1 Master table (BD / Bangla-first, times in BST = UTC+6)

| # | Product | Audience | Entry requirement (diagnostic, estimated band) | Max class size | Format | Schedule (BST) | Session length | Sessions | Contact hours |
|---|---|---|---|---|---|---|---|---|---|
| L1 | **IELTS Regular Batch** (12 wk) | Students/grads 3+ months from exam | Diagnostic taken; any band 3.5-7.0 (below 4.0 gets Foundation advice, §1.4) | Core class 50 (lecture sessions); skill-lab sessions split into groups of ≤ 25 | Hybrid-interactive | Sun/Tue/Thu **or** Sat/Mon/Wed, 7:30-9:00 PM (default) | 90 min | 36 | 54 h |
| L2 | **IELTS Crash Course** (4 wk) | Test date in 4-8 weeks; has some baseline | Diagnostic ≥ 5.0 overall (else steered to Regular) | 25 | Interactive | Mon-Thu, 8:30-10:00 PM; or 6:30-8:00 AM variant | 90 min | 16 | 24 h |
| L3 | **Weekend Batch** (working adults) | Job-holders, 12 wk | Same as L1 | 40 (lab splits ≤ 20) | Hybrid | Fri 9:00-11:30 AM + Sat 9:00-11:30 AM (2 x 150 min) + Thu 9-10 PM optional office hour | 150 min | 24 + 12 x 60-min optional labs | 60 h core (+12 h optional) |
| L4 | **Evening Batch** (after 8 PM) | Late workers, university students | Same as L1 | 50 | Hybrid | Sat/Mon/Wed 8:30-10:00 PM (ends before 10:15 PM) | 90 min | 36 | 54 h |
| L5 | **Women-only batch** (optional) | Women who prefer/are permitted only female-teacher classes | Same as L1 | 25 | Interactive | Sun/Tue/Thu 4:00-5:30 PM or 10:30 AM-12:00 (daytime option) | 90 min | 36 | 54 h |
| L6 | **Speaking Club** (drop-in) | All paid-tier learners (Live 6 slots, Crash 3, Mentor 6 included per 17 §2.2; Plus pay-per-slot add-on `speaking-club-1/4`) | Diagnostic taken; groups by level band (4-5, 5.5-6, 6.5+) | **6** (hard cap) | Small-group, camera-on preferred | Daily slots: 3 per weekday 7/8/9 PM + 2 weekend morning; rolling | 45 min | Unlimited (booked) | Per learner: Live 6 slots/12 wk (17 §2.2; more via add-on) |
| L7 | **Writing Clinic** | Anyone with a draft | Submitted a platform essay | 15 | Workshop on 2-3 anonymised learner essays | Wed 9:00-10:00 PM; Sat 11 AM | 60 min | Weekly | Open |
| L8 | **GRE Live** (8 wk) | GRE takers (Quant/Verbal) | GRE diagnostic taken; Quant diagnostic ≥ "Foundations passed" (else math bridge module, 15) | 40 lecture / 20 lab | Hybrid | Fri/Sat 7:00-9:30 PM + Tue 9-10:30 PM | Fri/Sat 150 min, Tue 90 min | 24 (8 x 3) | 52 h |
| L9 | **PTE / DET Crash** (**P2**, after PTE/DET courses ship) | Aspirants with 2-4 weeks | Diagnostic taken | 25 | Interactive | Mon-Thu 9:00-10:30 PM | 90 min | 12 (3 wk) | 18 h |
| L10 | **Mentor 1:1** | Mentor-tier learners | Mentor tier purchased | 1 (+ optional 2-person "pair" session) | 1:1 video | Booked from mentor calendar | 30 or 45 min | **Mentor tier = 3 × 45 min included (17 §2.2)**; extra sessions via add-on packs `one-to-one-1/3/5` (17 §4) | 4.5 h (assumption) |

Notes:
- Class-size logic: **lecture-style large (≤ 50)** is used only where the session is mostly instruction with polls (e.g., Reading/Listening strategy). Any session requiring individual speaking or writing feedback uses **interactive ≤ 20-25** (British Council India benchmark: 20) via breakout labs or smaller batches. Speaking Club ≤ 6.
- Weekends: Bangladesh weekend is Fri-Sat; Sunday is a working day. Weekend batch therefore Fri + Sat.
- Prime-time guard: no class starts after 9:30 PM BST for L1/L4; end by 10:30 PM max (safety, power, family norms). PW runs 9-10:30 PM; we avoid going later.

### 1.2 Per-product rules

| Product | Entry check (enforced where) | Recordings | Attendance minimum for completion cert | Make-up |
|---|---|---|---|---|
| L1/L3/L4/L5 | Diagnostic exists in `attempt` table (checkout soft-gate, not hard block) | Course duration + 30 days (see §2.6) | ≥ 75% live or recorded-catch-up with quiz | See §2.7 |
| L2 | Diagnostic ≥ 5.0 else warning + one-click move to L1 | Batch duration + 30 days | ≥ 80% (short course) | Recording + mentor check-in |
| L6 | Booking requires diagnostic + level group | **Not recorded by default** (privacy, small groups); AI transcript + feedback card is stored for the learner only (consent) | n/a | Rebook |
| L7 | Draft submitted | Recorded, learner essays anonymised/consent-based | n/a | Recording |
| L8 | Quant foundation check | Course duration + 30 days | ≥ 75% | See §2.7 |
| L9 | Diagnostic | 30 days | ≥ 80% | Recording |
| L10 | Tier entitlement | Mentor may record for learner only, retained 30 days, learner can delete | n/a | 1 reschedule free (> 12 h notice) |

### 1.3 International versions

Principles: English-only delivery; identical pedagogy; slots designed around learner time zones (D10: Bangla-first assets each have an English international counterpart). Region pricing follows D10 regions A/B/C from 17.

| Version | Slot design (class end in learner local evening) | Equivalent times for the 7:30-9:00 PM BST anchor | Notes |
|---|---|---|---|
| **INT-GMT** (UK/Europe/Africa) | 7:00-8:30 PM GMT/BST-UK (London) | = 1:00-2:30 AM BD, so **not** shared with BD classes | Separate cohort; teacher based in UK/Europe or flexible BD teacher on night shift |
| **INT-Gulf** (UAE/Qatar/KSA/Oman, GMT+3/+4) | 8:00-9:30 PM Gulf (UTC+4 = 10:00-11:30 PM BST) | UAE UTC+4 equals BST minus 2 h, so BD 10:00-11:30 PM | **Can share** a teacher with BD Evening Batch if BD slot 8:30-10:00 PM is shifted to 10:00 PM (too late for BD) - so keep separate |
| **INT-US** (ET/PT) | 8:00-9:30 PM ET | = 7:00-8:30 AM next day BST (winter); 6:00-7:30 AM BST (US summer) | **Natural fit** for a BD teacher on a morning shift: this is the "BD morning = US evening" pairing |
| **INT-SAsia/SEA** (India, Nepal, Malaysia, etc.; region C) | 7:30-9:00 PM IST (= 8:00-9:30 PM BST) | India is BST minus 0:30 | Can share with BD Evening Batch only for English-only sessions, but pricing and language differ; run separate product |
| **INT-AusNZ** | 7:30-9:00 PM AEST/AEDT | ≈ 3:30-5:00 PM BST (AEST, UTC+10) | Fits BD afternoon teachers |

Time zones: store all sessions in UTC; display in learner zone (`Intl.DateTimeFormat`); DST changes verified each March/October/November (**verify**).

International batch rules: English-only (no code-switching), same 36/16-session plans, captions on, Speaking Club slots provided in all five windows, region pricing from 17 (A/B/C), taxes handled by Paddle/Stripe per D3. Minimum viable intake: 8 paid learners per window else merge learners into the nearest window with recordings + 1 live office hour (see §8).

### 1.4 Foundation hand-off
Learners with diagnostic estimated < 4.0 are routed to the Bangla-medium *English Foundation* track (D10 Access programme) before or alongside a batch; sales copy must say so. (They may still buy; show a clear expectation message. Do not block purchase; do not promise a band.)

### 1.5 Women-only batch: demand and culture assessment

| Consideration | Assessment | Decision |
|---|---|---|
| Demand | Plausible among parents/guardians who allow evening classes only with female teachers, and learners who speak more freely in women-only groups. Unverified (no demand data in research). | Run **demand test**: waitlist form + 40 verified sign-ups (assumption) before scheduling; offer in 1 batch in year 1 |
| Culture | Common parental preference in BD; also a harassment-safety feature | Female teacher + female TA/moderator; women-only Speaking Club slots offered **in parallel** even when full batch not run |
| Legality / fairness | Voluntary, opt-in; mixed batches remain default; no claim of superiority | Label "Women's batch (female teachers, women learners)"; do not label men's as inferior |
| Cost | Smaller class (25) and fewer teachers to choose from | Priced per 17 at same list price; break-even higher (§8.1); subsidise only if waitlist ≥ 25 |
| Safety | Moderation applies equally (§5.8) | Same code of conduct; trans/non-binary inclusion rule: self-identified women; escalate to support |

---

## 2. Operating rules (all batches)

### 2.1 Schedule and cadence summary

| Batch | Weeks | Classes/week | Mock cadence (see §2.3) | Speaking Club included | Writing Clinic |
|---|---|---|---|---|---|
| L1/L4/L5 (12 wk) | 12 | 3 | Diagnostic wk 0; sectional checkpoints wk 2, 4, 6, 8; full mocks wk 3 (R+L), wk 6, wk 9, wk 12 (full, with human W+S feedback on two) | 1 slot/week | Open |
| L2 (4 wk) | 4 | 4 | Diagnostic day 0; full mock end of wk 1, wk 2, wk 3; final mock wk 4 day 2 | 2 slots/week | Open |
| L3 weekend | 12 | 2 x 150 min | Same as L1 on weeks 3, 6, 9, 12 (mock taken Sat morning slot) | 1/week | Open |
| L8 GRE (8 wk) | 8 | 3 | Diagnostic, full mock wk 3, wk 6, wk 8 (section-level adaptive per D6) | n/a | AWA clinic wk 4, 7 |

### 2.2 Homework system

| Step | Rule |
|---|---|
| Assignment | Teacher assigns from `homework_item` templates (14/15) in the app; due before next session (default 24 h; Writing tasks 48 h; weekly mock due in 72 h window) |
| Submission | In platform only: Reading/Listening auto-scored; Writing text or photo upload (OCR then edit) to R2 via presigned upload; Speaking recorded in app (audio) -> Deepgram transcript (D3) |
| AI pre-feedback | Within minutes: Claude (Haiku for quick feedback, Sonnet for band estimate per D3); labelled "AI estimate" |
| Teacher feedback | `grader` role (D4) reviews AI pre-feedback, edits, overrides band with rationale. Turnaround: Writing 48 h, Speaking 72 h (assumption) |
| Counts | Per 12-wk batch (assumption; final in 17): 12 Writing T1/T2 with AI feedback; 4 with teacher feedback; 4 Speaking with AI; 2 with teacher feedback. Crash: 4 W, 2 W teacher; 2 S, 1 S teacher |
| Late policy | 24 h grace, then marked "late" - still scored; missing 2 consecutive -> nudge (§7.3) |
| Homework submission target | ≥ 70% of assigned items per learner (KPI §7) |

### 2.3 Mock cadence and checkpoint semantics

| Mock type | Content | Mode | Stakes |
|---|---|---|---|
| Diagnostic | Full-length-lite (R/L + one W task + 3-min speaking AI) | Pre-batch | Used for grouping, not graded in cert |
| Sectional checkpoint | One section, timed, CBT engine (07) | Open window 72 h | Counts for homework % |
| Full mock | L+R+W (+S via AI or human) | **Exam mode**, server deadlines (D6) | Counts toward band-delta KPI |
| Live proctored mock slot | Cohort takes mock at the same time; teacher live in "invigilator" room, camera optional | Optional but recommended once per batch | Builds exam stamina |
Mock scores are labelled **estimated**; the platform never shows "official".

### 2.4 Attendance policy

| Item | Rule |
|---|---|
| Source of truth | Auto-tracked join/leave events (§5.6); present = ≥ 70% of session duration attended OR ≥ 45 min (assumption) |
| Late join | Counted if ≥ 70%; no shame in-class |
| Watched-recording credit | Recording watched ≥ 80% with embedded checkpoint quiz ≥ 60% within 72 h = "excused-catch-up" (counts 50% weight towards attendance, 100% for completion cert) |
| Attendance target | 75% live+catch-up for certificate; below 60% triggers escalation (§7.3) |
| Excused absence | Illness/family: log via app form; mentor approves; counts as catch-up if recording completed |
| No-show to Speaking Club | 2 no-shows in 30 days -> temporary booking pause (3 days) with friendly reminder; ensure peers aren't stranded (group of ≤ 6 auto-backfills from waitlist) |

### 2.5 Roles-in-session visibility
Each class room shows: lead teacher, TA/moderator, learner count. Learners see only first name and optional avatar; surnames/phone never shown (minors-safe default).

### 2.6 Recordings policy (decision)

| Option | Pros | Cons | Decision |
|---|---|---|---|
| 7 days | Strongly drives live attendance | Penalises power cuts, jobs; support burden | Rejected |
| 30 days | Balanced | Learners revise later and lose access | Used for **crash, PTE/DET, clinics** |
| Course duration + 30 days | Matches BD "I can only watch late" behaviour; E2Language offers recordings; research: no BD-specific attendance benchmark | Slightly lower live attendance; storage cost | **Default for Regular/Weekend/Evening/Women/GRE** (live access; recording **expires** with batch + 30 days) |
| Lifetime | Marketing appeal (10MS 12-month validity on batch) | Cost; piracy | Not offered; Core tier is the lifetime-ish asset (6 months, D10) |
- British Council does **not** record for privacy; our minors-and-privacy answer is: learners' faces and voices appear only if they enable cameras/mics; raw Q&A voice is trimmed from recordings by moderator on request; the **recording shows slide + teacher + chat-less** (chat not captured). Recording consent line shown at join; opt-out = learner may keep camera/mic off.
- Storage: Zoom cloud -> webhook -> Inngest job -> copy to Bunny Stream (private, token-authenticated, visible watermark with learner ID per D3) -> delete Zoom copy after 48 h.
- Retention: delete batch recordings 30 days after batch end; "learner-visible clip highlight" exceptions via consent.

### 2.7 Make-up classes

| Situation | Remedy |
|---|---|
| Missed 1 session | Recording + catch-up quiz |
| Missed Speaking-heavy session | Free Speaking Club slot booking (counts) |
| Teacher absence / platform outage | Make-up session within 7 days, same time, mandatory for teacher; if > 2 sessions cancelled in a batch, extend access or refund prorated per 17 terms |
| Missed mock | 72 h window then extra mock slot on Saturday |
| Technical failure on learner side (power cut) | Mark "excused"; auto-credit on request once per batch |

---

## 3. Session anatomy

### 3.1 90-minute template (interactive lab; lecture sessions shift 10 min from Guided practice to Concept)

| Min | Block | What happens | Tool |
|---|---|---|---|
| 0-5 | **Warm-up** | Music-free silence; "question of the day" in chat; 1 poll ("How was your week 1-5?"); attendance auto | Poll + chat |
| 5-10 | **Retrieval** | 3-question quiz on last class (spaced retrieval) | Poll (auto-scored) |
| 10-25 | **Concept** | 15 min max: one skill idea; slides as images (low-bandwidth) | Slides |
| 25-35 | **Worked example** | Teacher thinks aloud on a real item; shows band-descriptor link | Whiteboard/screen |
| 35-50 | **Guided practice** | 2-3 items; learners answer in poll; common error discussed; "chat waterfall" (everyone types, press Enter on 3) | Poll + chat |
| 50-65 | **Timed practice** | Silent timed task (Reading passage / Listening section / Writing plan); breakout pair compare for 4 min (speaking: pairs record each other) | Timer + breakouts |
| 65-75 | **Feedback** | Reveal answers; two anonymised learner samples; descriptor-based comments | Screen share |
| 75-83 | **Q&A** | TA queue sorted by upvotes; teacher answers top 4; others to the forum within 24 h | Q&A queue |
| 83-90 | **Recap + homework** | 3 take-aways; homework preview; next class teaser; exit poll (clear / muddy) | Poll |

Variants: Reading/Listening class 55% practice; Writing class: 25 min teach/plan + 20 min write + 20 min feedback; Speaking class: 15 min models, 40 min breakout practice in pairs/triads (max 3 per room), 20 min debrief.

### 3.2 Engagement techniques

| Technique | How we use it | Rule |
|---|---|---|
| Polls | ≥ 5 per class; results shown aggregated | Anonymous to peers, named to teacher |
| Breakout rooms | 2-4 learners, 4-6 min; TA rotates | Pre-assigned rooms (L1) or random (L5) to avoid cliques |
| Chat waterfall | Everyone types answer, hold Enter until "go" | Prevents copying |
| Kind cold-calling | "I'd love to hear from [first name]. If you'd rather not, type 'pass'." | Max 3 learners per class; never for answers on low-confidence topics twice in a row |
| Camera-optional norm | Camera off allowed; mic on for speaking activities only; "camera on in Speaking Club and mocks by default" | Never compel video; low-bandwidth friendly |
| Hand raise + queue | One at a time | Moderator manages |
| Reactions | Emojis for pace (slow/fast) | Teacher scans each 10 min |
| Silent starts | After concept, 60 s of silence for questions typed in chat | Reduces dominant voices |

### 3.3 Language rules

| Batch | Rule |
|---|---|
| BD batches (L1, L3, L4, L5, L8) | **Code-switching permitted by design**: Weeks 1-4: explanation 70% Bangla / 30% English (key terms always in English); weeks 5-8: 50/50; weeks 9-12: 20/80; **all learner speaking-practice activities and all examples are in English**; teacher models English prompts; slides in English with Bangla glosses for Foundation level; mock debriefs in English with Bangla clarification on request |
| Crash (L2) | 60/40 explanation English-lean; learners already baseline |
| Speaking Club | English-only (Bangla allowed only for 20 s "help" requests) |
| International | English-only; slow, clear delivery; captions on; no regional slang idioms without explanation |
| Chat | English preferred; Bangla allowed and not corrected |

---

## 4. Teaching staff

### 4.1 Roles

| Role (RBAC, D4) | Responsibility | Platform role | Ratio |
|---|---|---|---|
| **Lead teacher** | Delivers sessions, owns batch pedagogy and Q&A | `instructor` | 1 per batch (up to 2 co-leads for 50) |
| **TA / Moderator** | Runs the room: polls, chat, breakouts, hand queue, tech help, incident reports | `grader` (limited) or `instructor` | **1 TA per 50 students** (1 TA minimum even for class ≤ 25, shared across 2 concurrent classes if possible) |
| **Assessor (speaking, "examiner-style")** | Marks speaking mocks using public band descriptors | `grader` | 1 per ~25 learners per mock cycle |
| **Writing marker** | Reviews AI pre-feedback + teacher feedback | `grader` | 1 per 40 learners (assumption) |
| **Mentor** | 1:1 sessions, accountability, intervention pings | `instructor` + mentor flag | ≤ 30 active Mentor-tier learners per mentor (assumption) |
| **Live Ops coordinator** | Schedules, links, comms, incidents | `admin`-lite / `support` | 1 per ~8 concurrent batches |

All instructors/graders require 2FA (D4).

### 4.2 Qualifications and claims

| Requirement | Detail |
|---|---|
| IELTS (own test) | **Academic band 8.0+ overall**, with ≥ 8.0 in the skill taught for lead teachers; evidence = TRF number checked via the IELTS Verification Service where available (**verify** process) |
| Teaching | CELTA/DELTA/TESOL strongly preferred; otherwise 2+ years IELTS teaching and a recorded demo lesson scored on our rubric |
| GRE teachers | Verified GRE scorecard (Quant 165+ for Quant, Verbal 160+ for Verbal; assumption); math/English degree |
| **"Ex-examiner" claims** | Allowed **only** with written evidence (official IELTS examiner ID/letter or British Council/IDP confirmation) stored in the instructor record, re-verified annually. If unverifiable, copy says "trained on public band descriptors" and **never** "IELTS examiner". Assessors are called **"examiner-style assessors"** in all marketing. Never use "official", "authorized" or "approved by IDP/BC/Cambridge" |
| Safeguarding | Police clearance (BD Police Clearance Certificate, **verify**) / ID check; signed code of conduct; mandatory safeguarding training before any minor-containing batch |
| Bio display | Name, verified bands, years teaching, languages; "Verified" badge only for checked claims |

### 4.3 Training and calibration

| Cadence | Activity | Output |
|---|---|---|
| Onboarding (week 0) | 6 h: platform, session anatomy (§3), safeguarding, Bangla/English switching, descriptor basics | Pass quiz ≥ 85% |
| **Monthly band-descriptor standardisation** | 2-hour session: all graders independently mark 6 anchor scripts (3 Writing, 3 Speaking transcripts) against public band descriptors, then discuss; target: mean absolute difference vs master mark ≤ 0.5 band, ≥ 80% of marks within 0.5 | Calibration log, retraining for outliers |
| Weekly | 30-min teacher huddle (what confused learners, common errors) | Action items to 14/15 |
| Quarterly | Peer observation (one session observed with rubric) | Score |
| AI alignment | Grader overrides of AI bands monitored; monthly review of systematic disagreement (feeds `packages/ai` evals, 13) | Prompt/rubric updates |

### 4.4 Teacher scorecard (monthly, per teacher, shared with teacher)

| Metric | Source | Green | Amber | Red |
|---|---|---|---|---|
| Session punctuality & attendance | Join logs | ≥ 98% on time | 95-98% | < 95% |
| Learner NPS (teacher-level) | Post-session/mid/end survey | ≥ 50 | 30-49 | < 30 |
| Learner show-up rate in their batches | Attendance | ≥ 70% | 55-69% | < 55% |
| Homework feedback SLA (48/72 h) | Grader queue | ≥ 95% | 85-94% | < 85% |
| **Learner band gain** (mock1→mock final, estimated) | Mock engine | ≥ +0.5 avg | +0.25-0.49 | < +0.25 |
| Calibration accuracy | Monthly calibration | within 0.5 on ≥ 80% | 70-79% | < 70% |
| Safeguarding incidents | Reports | 0 | Minor resolved | Any substantiated |
Band gain is interpreted carefully (starting-level effects, regression to mean, small n) - do not compare teachers on band gain unless n ≥ 30 learners.

### 4.5 Pay model assumptions (BDT per hour; **assumptions**, finance owns final in 17 §Cost lines)

| Role | Assumed rate (BDT/hr, placeholder) | Basis |
|---|---|---|
| Lead teacher (IELTS 8.0+, certified) | 1,500-3,000 | Per delivered hour, plus 0.5 h prep credit per session |
| Lead teacher (junior) | 800-1,200 | |
| TA / moderator | 400-600 | |
| Assessor, speaking mock (per 12-min test + 8-min feedback) | 300-450 per learner-mock | Per piece-rate |
| Writing marker, per essay | 150-250 per essay | Per piece-rate |
| Mentor session | 700-1,200 per 45 min | |
| Speaking Club host | 600-900 per 45 min | |
These are not sourced from research (no BD examiner/teacher rates were found in the research notes); validate by quotes from 5-10 candidates before locking 17.

---

## 5. Tech and operations

### 5.1 Scheduling and reminders

| Item | Spec |
|---|---|
| Data | `live_batch`, `live_session` (starts_at UTC, duration, teacher_id, join_ref, recording_ref, status), `live_attendance` (session_id, user_id, joined_at, left_at, seconds), `live_enrollment` -> entitlement (D5) |
| Calendar in app | `/app/plan` shows upcoming sessions, timezone-aware; "Add to calendar" per session and "Subscribe" feed |
| .ics | Per-batch `.ics` feed with `UID`, `DTSTART` in UTC, `SEQUENCE` increments on changes, `VALARM` T-15; also single-event download |
| Reminders | Email (Resend) + SMS (BD gateway) + WhatsApp (Business API, template messages, opt-in) at **T-24h** and **T-15m**; in-app notification; skip SMS for international; user can set channel preferences; WhatsApp requires explicit opt-in and approved templates (**verify** current WhatsApp Business policy/pricing) |
| Changes | Rescheduling emits `session.updated` event; notifications within 5 min; `.ics` SEQUENCE bump |
| Join link | Never in the public page; shown only to entitled users in the app (entitlement check), per-session; Zoom registration-required webinars/meetings use unique join links |

### 5.2 P2 delivery: Zoom vs YouTube Live (decision matrix)

| Criterion | **Zoom Meeting** | **Zoom Webinar** | **YouTube Live (unlisted) embedded** |
|---|---|---|---|
| Interactivity (mic/cam, breakouts) | Full, breakouts supported | Limited (panelists only) | None (chat only) |
| Max audience | Plan-dependent | Plan-dependent (large) | Large |
| Cost | Zoom Pro/Business seat per host (**verify** current price/limits) | Add-on licence (**verify**) | Free |
| Latency | Low | Low | Normal/low/ultra-low 5-10+ s |
| Recording | Cloud recording (storage/limits **verify**) -> Bunny | Cloud recording | Auto VOD on YouTube; copy to Bunny not straightforward; keep on YouTube unlisted |
| Access control | Unique registration links, waiting room | Registrant links | **Unlisted is link-based, not access-controlled**; anyone with link can watch; embed on `/app` only |
| Embedding | Not embeddable as full UI (join via app link) | Same | Embeddable; **embeds must send an HTTP Referer** or error 153 occurs - set `Referrer-Policy: strict-origin-when-cross-origin` on pages with the player; ensure uploader keeps embedding enabled; avoid age-restricted flags (do not play on third-party sites); and if child-directed designation applies, features are limited (YouTube Help: embed videos) |
| Privacy | Strong controls | Strong | Weak; do not use for any class with minors visible or learner voice |

**Rules (P2):**

| Use case | Delivery |
|---|---|
| Interactive batches (L1-L5, L8, L9), Writing Clinic, Speaking Club | **Zoom Meeting** (breakouts, polls) |
| Large lecture sessions (> 100 learners), free webinars | **YouTube Live unlisted** embedded (view-only, moderated chat) *or* Zoom Webinar if budget allows. Learner voice is never on YouTube |
| Weekly Plus tier group Q&A (60 min, recorded) | **Zoom from P1** (D12 C20; Zoom Webinar or Meeting with moderated Q&A); may move to YouTube Live unlisted in P2 only if attendance exceeds Zoom limits |
| Mentor 1:1 | Zoom Meeting or Google Meet fallback |
| Classes with minors | Zoom only, with guardian consent, waiting room, no unlisted public streams |
Fallback: if Zoom fails, backup link (Google Meet) posted by TA within 3 min.
Zoom pipeline: Zoom webhook (recording.completed, signed) -> Inngest -> download -> Bunny Stream library (token-auth, watermarked) -> `live_session.recording_ref`; failure alerts to Live Ops. Zoom participant reports populate `live_attendance` (fallback when no first-party join events).

### 5.3 Zoom hygiene

Waiting room on; only host/co-host share; chat saved to host-only (not published); disable private chat between participants; participants' rename locked to "FirstName L."; polls via Zoom; breakout rooms assigned by TA; passcodes embedded; no recording of breakouts.

### 5.4 P3 LiveKit in-house classroom (spec)

| Feature | Requirement | Build note |
|---|---|---|
| Stage | Teacher + up to 3 speakers; audience subscribe-only; promote learner to stage on hand-raise | LiveKit roles/permissions via token grants |
| Chat | Moderated text chat, slow mode, pinned messages, per-room persisted | Postgres + realtime |
| Polls | Teacher creates; anonymous aggregated results; stored for analytics | Data channel messages |
| Hand raise | Queue with order | Data channel |
| Whiteboard | Shared canvas (tldraw/excalidraw) and slide-as-image deck | Image slides compress for low-bandwidth |
| Breakouts | Server-assigned sub-rooms of ≤ 4; TA hops between; return timer | Separate LiveKit rooms |
| Recording egress | Room composite -> HLS/MP4 -> storage -> Bunny | Egress cost; composite transcode priced per minute (LiveKit pricing: video transcode $0.02/min on Ship tier; included 600 min) so budget recording minutes |
| Attendance | Participant joined/left webhooks | §5.6 |
| Moderation | Mute, remove, ban for session, report | Audit log (D7) |
| Accessibility | Captions (optional ASR), keyboard nav, WCAG 2.2 AA (08) | |
| Mobile | Web responsive; Expo app P3 | |
| Capacity | LiveKit Cloud Ship tier: 1,000 concurrent, 150k WebRTC minutes/month included, video bandwidth overage $0.12/GB (the research note flags bandwidth as likely bigger cost than minutes). 100 students x 60 min = 6,000 participant-min per class hour | Model per-hour bandwidth in 17 / 11 |
| Cost comparators | 100ms conferencing $0.004/min per participant; live streaming $0.0012/min per viewer; Zoom Video SDK $0.0035/min per participant | Hybrid (interactive on RTC, audience on HLS) reduces cost |

Build trigger for P3 LiveKit: monthly Zoom spend + operational pain (manual attendance, recording copying) exceeds an estimated threshold (assumption: > 4 concurrent classes daily or > BDT 1.5 lakh/month Zoom ops) - revisit in P2 review.

### 5.5 Low-bandwidth and mobile-first

| Measure | Detail |
|---|---|
| Audio-only mode | Switch video off; teacher video lowest tier; screen share as slide images (pre-rendered PNG/WebP, 150-250 KB each) loaded through CDN |
| Adaptive | Recording on Bunny HLS adaptive bitrates; 360p default on mobile data |
| Mobile-first | Join page designed for phones: one-tap Join, big mic/camera toggles, landscape guidance |
| Data-saver toggle | Disables video; text slides; mock sections still full |
| BD reality | Many learners on mobile data; evening congestion; target ≤ 150 MB per class hour in audio+slides mode (assumption, measure in pilot) |
| Slides + audio replay | Post-class "audio + slides" download option (~25 MB/hr) |

### 5.6 Attendance auto-tracking

| Source | Event | Handling |
|---|---|---|
| Zoom | participant_joined/left webhooks + post-meeting report | Match registrant email to user; unmatched flagged for TA |
| YouTube | No reliable identity | Attendance = in-app "I'm here" ping every 15 min while on the page (heartbeat); low reliability, use only for Q&A webinars |
| LiveKit (P3) | participant_joined/left | Seconds aggregated per session |
| Rule | Present per §2.4; TA can adjust with reason (audited) |

### 5.7 Power-cut resilience
Recordings available within 2 h; "rejoin" button restores place; if learner drops > 20 min the system suggests recording catch-up; quizzes embedded in recordings; mock sections are server-timed and resumable (D6); teacher outage fallback (mobile hotspot; co-teacher takes over; Zoom backup host); TA lists "disconnect handling" in the room playbook.

### 5.8 Moderation and safeguarding (minors)

| Area | Rule |
|---|---|
| Age | Users self-declare age band (D7); under-18 -> guardian-consent flow before live enrolment; guardian email/SMS confirmation stored |
| Staff-minor contact | **No private DMs between teacher and minor**; all contact in class chat or group channels with a second adult present; mentor sessions with a minor require a guardian-visible schedule and recording on by default (retained 30 days, accessible to guardian) |
| Recordings of minors | Retention 30 days; no use in marketing; faces not shown unless consent |
| Code of conduct | Learners and staff sign; no harassment, no sharing of personal contacts, no off-platform meetups; respectful language; teachers dress professionally; no recording by learners |
| Reporting | In-app "Report" in every session (to Live Ops + safeguarding lead), plus email; acknowledged < 24 h; serious cases -> remove user from live instantly, preserve evidence, escalate to Founders; legal reporting per BD law (**verify** with counsel) |
| Vetting | §4.2; TA present in every session containing minors |
| Data | PII minimised in rooms (first name + initial); no phone numbers visible; audit log (D7) |
| Child-directed content | If YouTube embedding is used, review YouTube "made for kids" designation rules - our content is aimed at adults/teens, not children, so do not mark as made for kids; keep minor-containing classes on Zoom (YouTube Help) |

---

## 6. Community around live

### 6.1 Batch group channel: comparison

| Option | Pros | Cons |
|---|---|---|
| WhatsApp group | Ubiquitous in BD; learners already there; push-notifications reliable | Phone numbers exposed to all members (privacy / minors issue); hard moderation; spam; no audit; data on Meta |
| Telegram | Hides numbers (usernames), large groups, bots, topics | Lower adoption among parents/older learners; some trust concerns |
| Discord | Rich channels/roles/voice rooms | Unfamiliar in BD; younger-skewed; setup friction |
| **In-app community** (Q&A, batch feed - D1 P2) | Identity-safe, linked to attendance/homework, moderated, audit, no phone exposure | Notification reach weaker; engagement requires habit |
| Facebook group (10MS pattern) | Familiar | Ads/noise, weak moderation, privacy |

**Recommendation:** primary = **in-app batch space** (announcements, Q&A, homework help) for authority and safety. Secondary = **WhatsApp Community announcement-only channel** (admins post; members cannot see other numbers where product permits - **verify** WhatsApp privacy settings) for T-24h/T-15m reminders; opt-in. Optional learner chat group on **Telegram** for adults only, moderated by a TA with rules; **no group chats including minors**; none with staff DMs. Batches with minors: in-app only.

### 6.2 Peer speaking partners
Weekly matching by level and availability (diagnostic band ±0.5, time-zone overlap, similar target test date); 2 x 20-minute partner calls/week (in-app audio call or recorded external link), AI-transcribed prompts; partner no-shows trigger re-matching; safety: first-name only, in-app calling, report/block button, minors matched only with minors.

### 6.3 Accountability
Streak = attended/caught-up class or completed homework per day; 2 freezes/month (borrowed from the streak pattern researched); weekly "leaderboard" optional and opt-in (private, only within batch, shows effort metrics not scores); "study buddies" send nudges; mentor sees streak break after 3 days.

### 6.4 Graduation and testimonials
Graduation page, certificate (verify route `/verify/[code]`); testimonial requests only after the learner's real exam result; **explicit opt-in consent**, separate for name, photo, score, and use channel; guardian consent for minors; score claims must show the real test date and the batch; no "guaranteed" claims; withdrawal honoured within 7 days.

---

## 7. Quality and outcomes

### 7.1 KPIs

| KPI | Definition | Target Y1 (assumption) | Alert |
|---|---|---|---|
| Show-up rate | Mean attendance across sessions (present or catch-up) | ≥ 65% live, ≥ 80% incl. catch-up | live < 50% |
| Completion | % learners with cert criteria (≥ 75% attendance + ≥ 70% homework + final mock) | 55% (paid MOOC verified-learner range 44-56% per Reich & Ruipérez-Valiente 2019 is the ceiling to compare) | < 40% |
| Homework submission | % assigned items submitted | ≥ 70% | < 55% |
| Mock band delta | Final full mock estimated overall minus first full mock | +0.5 mean for learners with ≥ 75% attendance | < +0.25 |
| NPS | End-of-batch & mid-batch | ≥ 40 | < 20 |
| Feedback SLA | % teacher feedback within SLA | ≥ 95% | < 85% |
| Refund rate | per 17 refund policy | < 5% | > 8% |
| Teacher scorecard | §4.4 | all green | any red |

### 7.2 Feedback loops

| Loop | Mechanism | Owner |
|---|---|---|
| In-class | Exit poll (clear/muddy) each session | TA |
| Mid-batch | Week 6 survey + 10-min call sample (10% of learners) | Mentor |
| End-batch | NPS + free text + teacher rating | Live Ops |
| Content | Common-error log -> content editors update 14/15 | Head of Live + editors |
| Weekly review | KPI dashboard (`/admin` live ops) reviewed Mondays | Head of Live |

### 7.3 Intervention rules

| Trigger | Action | Time |
|---|---|---|
| Missed 1 class | Auto reminder with recording + catch-up quiz | Next morning |
| **Missed 2 classes (consecutive or in 7 days)** | **Mentor ping** (message/WhatsApp opt-in), offer 10-min call, offer schedule switch | Within 24 h |
| Missed 3 or attendance < 60% | Mentor call + TA offers make-up plan; consider batch transfer | Within 48 h |
| No homework 2 weeks | Mentor nudge; reduce workload plan | |
| Mock score down ≥ 0.5 band two mocks | Teacher/mentor review of weak areas, add Clinic | |
| Silent in speaking labs 3 sessions | TA small-group invitation | |
| Safeguarding report | §5.8 escalation | immediate |
| Learner requests refund | Live/Mentor: full refund before class 3 begins (Crash: before class 2; Mentor: or before the first 1:1) per 17 §11; self-paced parts follow the 7-day rule (D12 C13b); retention attempt = schedule change, not pressure | |

### 7.4 Outcome reporting (honest, opt-in)

| Rule | Detail |
|---|---|
| Opt-in score reports | Learners voluntarily upload official TRF/GRE score report; verify TRF where services permit; stored privately |
| Public stats | Published only with n ≥ 30 reports, state response rate ("X of Y learners reported"), time frame, and that results are self-reported/verified; never cherry-pick; include non-improvers |
| Language | "Learners improved estimated mock band by X on average" separate from "official score gains"; never promise a band; cite the denominator |
| **Progress Promise** (Mentor tier only; free re-enrolment, no cash; D12 C13/C13b) | Terms are 17 §2.2a, not set here: attendance ≥ 80% of live sessions, all homework submitted, ≥ 4 full mocks, official test within 60 days of course end, official TRF uploaded, target ≤ diagnostic + 1.5 bands; one re-enrolment into the next Live batch; modelled as `guarantee_claim` (05). Ops must record attendance and homework so a claim can be verified. Plus has a separate Target Promise (extension, no live component). No guarantee on Live/Crash |
| Bias controls | Report by diagnostic band bucket to avoid ceiling effects; regression-to-mean note |

---

## 8. Capacity and economics

### 8.1 Break-even (formula; prices from 17)

For a batch: `Break-even paid learners N* = (Fixed batch cost) / (Net revenue per learner - Variable cost per learner)`.

| Component | Items |
|---|---|
| Net revenue per learner | Live-tier batch price (17) less payment fees (SSLCommerz %, **verify**), less discounts/scholarships/instalment drop-off, less refunds (≈ 3-5% assumption) |
| Fixed batch cost | Lead teacher hours (54 h x rate + prep credit), TA hours, assessor/grader pool, Zoom host licence share, Live Ops share, marketing/CAC |
| Variable cost per learner | AI evaluations (LLM + STT), recording storage/Bunny, SMS/WhatsApp reminders, human feedback pieces (essays/speaking mocks at piece rates §4.5), payment fee |

Cost structure: **17 §2.3 and §7 are canonical** (batch fixed cost BDT 126,000 for the 36-session IELTS regular batch = 36 × BDT 2,500 blended teacher pay incl. prep + BDT 36,000 TA/moderation; Crash 55,000; GRE 8-week 92,000; weekend 114,000; standalone 12-week batch BDT 9,990). The earlier illustrative table below is kept only as the bottom-up check that 17's blended rates were built from:

| Cost line | Regular 36 sessions (BDT, assumption) |
|---|---|
| Lead teacher | 54 h x 2,000 + 18 h prep x 1,000 = 126,000 |
| TA | 54 h x 500 = 27,000 |
| Live Ops/tools share | 15,000 |
| Fixed total (before CAC) | ~168,000 |
| Variable per learner (4 teacher-marked essays x 200 + 2 speaking mocks x 380 + AI/STT/storage 600 + reminders 100 + fees) | ~2,300 + payment fee |
So `N* = fixed cost / (net price - variable per seat - fees)`; with 17's figures break-even is 16 seats (Regular/Evening/Women-only), 15 (Weekend), 10 (Crash), 13 (GRE) (17 §7). **Minimum start sizes follow 17 §7: Regular/Evening/Weekend/GRE 30 paid (cap 50, target 40), Crash 15 (cap 25), Women-only 20 (cap 25), International windows 8 then merge.** Pilot exception (first two intakes only, founder-approved, announced to learners as a pilot): a Regular/Weekend pilot may start at ≥ 18 paid as a deliberate learning subsidy, below the 17 minimum. If below minimum 7 days before start: merge, delay one week, or run as a "small batch" with higher teacher feedback and announced honestly.

Sensitivity to publish internally: N* at -10% price, +20% teacher rate, 15% instalment drop-off. Grader feedback and AI costs are the main variable cost drivers (human review roughly 10-50x AI cost per the research inference).

### 8.2 Capacity planning

| Resource | Capacity | Notes |
|---|---|---|
| Lead teacher | ~12 teaching h/week (4 batches x 3 h) + prep + feedback | Cap to avoid burnout; ≤ 2 batches concurrent per teacher recommended |
| TA | Up to 2 concurrent rooms | |
| Assessors | 8 speaking mocks/hour | |
| Zoom licences | Concurrent classes = peak 8-10 PM; licences needed = peak concurrent classes | |
| Evening slot crunch | 8-10 PM is the profitable window; stagger batches 7:30 / 8:30 PM | |

### 8.3 Year 1 batch calendar (2027; all dates **verify**)

Assumptions: the Live tier opens in P1 as manually-run Zoom pilot cohorts (D1) and scales in-app in P2; the calendar is aligned to 24 (closed pilot ~1 Mar 2027 with one Zoom cohort; public launch ~3 May 2027; P2 ~Sep 2027), so no live batch is sold before the pilot. Seasonality notes: HSC/SSC results and university admission cycles drive BD demand peaks (**verify** each year's official result dates; HSC results have recently come out in autumn, with variation); IELTS test dates in BD are frequent (British Council/IDP calendars, **verify**). Religious calendar approximations: Ramadan 2027 expected about 8 Feb-9 Mar; Eid-ul-Fitr about 9-10 Mar; Eid-ul-Adha about 16-17 May (Bangladesh moon-sighting, **verify** with national announcements). Government Eid holidays in BD typically run several days to over a week (**verify**).

| Window | Batch | Start (target) | End | Notes |
|---|---|---|---|---|
| Jan-Feb 2027 | **No live batch** (product in internal alpha, 24 M1 ~8 Jan); recruit and train teachers/TAs, run teacher trial sessions, test Zoom ops with staff-only rooms | — | — | Pilot dependencies: SSLCommerz live and legal pages (24 critical path) |
| Feb-Mar 2027 (Ramadan ~8 Feb-9 Mar, **verify**) | **No new regular start.** Ramadan schedule: shift Evening class to 9:30-10:45 PM after Taraweeh or 3-day/week lighter plan; Weekend labs shortened to 90 min; Speaking Club late-night slots (10-11 PM) | — | — | Test: run crash only in "late-evening" mode; or pause; decide on pilot demand (**verify**) |
| Mar 2027 (Eid ~9-10 Mar) | Eid break: 7-10 days pause. **Closed-pilot Zoom cohort (24 M2, ~1 Mar):** Pilot Regular (L1, Evening or Weekend), ≥ 18 learners (pilot exception, §8.1), pilot-priced per 17 | ~Sat 20 Mar (**verify**, after Eid) | ~mid-Jun | Learning pilot; heavy feedback; Plus weekly Q&A also piloted on Zoom here (D12 C20) |
| May 2027 (public launch ~3 May, 24 M3) | Regular x1-2 (BD Evening + Weekend) at the 17 §7 minimum; Crash x1 | ~Sat 8 May | ~Aug 1 / ~Jun | First public intake after launch; Eid-ul-Adha ~16-17 May break (**verify**); International windows follow BD stability (20 §8.4) |
| Jun 2027 | GRE Live x1 (Aug-Dec admissions cycle prep) | ~Jun | ~Aug | Needs GRE Live content (15) ready |
| Jun-Jul 2027 | Regular x2 incl. Women-only trial (if waitlist ≥ 40), International Gulf window | Sat 10 Jul | ~Oct 2 | HSC/Uni admission interest (after SSC/HSC results timing **verify**) |
| Aug 2027 | Crash x1; PTE/DET Crash trial (if courses ready, P2) | Aug | | |
| Sep 2027 | Regular x2 (largest intake; Fall/Spring abroad application cycle) | ~Sat 4 Sep | ~Nov 27 | **Peak**; add second teacher |
| Oct-Nov 2027 | Crash x2; GRE Live x1 | Oct | | HSC results window possible (**verify**) |
| Dec 2027 | Winter Crash (university breaks) | Early Dec | | Year-end |
Rule: always schedule start dates after: (a) official calendar check, (b) 14-day sales window, (c) at least 7 days to onboarding; never start inside the Eid holiday week.

### 8.4 Scaling plan

| Stage | Trigger | Move |
|---|---|---|
| S0 pilot | Y1 Q1 | 2-3 batches, founder-led ops, Zoom |
| S1 repeatable | 10 concurrent batches | Live Ops coordinator, teacher bench of 8+, calibration monthly, templates |
| S2 platform | ≥ 20 concurrent or Zoom pain | LiveKit classroom (P3), auto-attendance, auto-recording |
| S3 marketplace | P3 instructor marketplace (D1) | External teachers on revenue share with same QA gate |
| International | ≥ 8 per window consistently | Dedicated international teacher pool |
Quality guard: new teachers shadow 2 sessions + teach 2 supervised before solo.

---

## 9. Session-by-session lesson plans

> Content detail is owned by 14 (IELTS curriculum). Below is the scheduling skeleton: which skill, topic, class activity, homework, mock checkpoint. Class days: 3/week (Sun/Tue/Thu or Sat/Mon/Wed). Skill-lab sessions are split by TA into groups of ≤ 25. Homework IDs refer to 14.

### 9.1 IELTS Regular Batch: 36 sessions

| # | Wk | Skill | Topic | Main class activity | Homework | Checkpoint |
|---|---|---|---|---|---|---|
| 1 | 1 | Orientation / All | IELTS format, band descriptors, how this batch works | Quick diagnostic debrief, goal setting, tech check | Retake weak item types; set target | Diagnostic review |
| 2 | 1 | Listening | Section 1-2 basics: form completion, map labelling | Guided practice with polls | L-set 1 | |
| 3 | 1 | Reading | Skimming/scanning, T/F/NG introduction | Timed passage 1 | R-set 1 | |
| 4 | 2 | Writing T1 | Overview paragraph, line graphs (Academic) / purposes of letters (GT) | Worked example + model | T1 draft (AI + peer) | |
| 5 | 2 | Speaking | Part 1 fluency, answer extension | Pair practice in breakouts | Record 6 Part-1 answers (AI) | |
| 6 | 2 | Listening | Section 3: multiple choice, matching | Timed + review | L-set 2 | **Sectional checkpoint 1 (Listening)** |
| 7 | 3 | Reading | Matching headings, summary completion | Strategy lab | R-set 2 | |
| 8 | 3 | Writing T2 | Task response, essay types and structure | Plan 3 essays in 10 min each | T2 essay 1 (teacher-marked) | |
| 9 | 3 | Vocabulary + Grammar | Academic word families, complex sentences | Sentence combining | Vocab deck + 10 exercises | **Full mock 1 (R+L) window opens** |
| 10 | 4 | Speaking | Part 2 long turn: structure and timing | Mock Part 2 in triads | Record 3 long turns | |
| 11 | 4 | Listening | Section 4: lecture note completion | Dictation + prediction | L-set 3 | |
| 12 | 4 | Reading | T/F/NG deep-dive; Y/N/NG | Timed + error log | R-set 3 | **Sectional checkpoint 2 (Reading)** |
| 13 | 5 | Writing T1 | Bar/pie/table; comparisons | Peer review round | T1 draft 2 (AI) | |
| 14 | 5 | Speaking | Part 3 discussion: opinion, justification | Debate warm-up | Record 4 Part-3 answers | |
| 15 | 5 | Grammar | Tenses, articles, prepositions for writing | Error correction | Grammar set | |
| 16 | 6 | Writing T2 | Cohesion, paragraphing, cohesive devices | Re-write a paragraph | T2 essay 2 | |
| 17 | 6 | Listening | Maps, diagrams, multi-speaker | Guided + timed | L-set 4 | |
| 18 | 6 | Review / Exam practice | Mid-batch review | Q&A clinic, strategy swap | Error log | **Full mock 2 (R+L+W) + mid survey; speaking AI mock** |
| 19 | 7 | Reading | Sentence completion, short answer, scanning for names | Timed lab | R-set 4 | |
| 20 | 7 | Speaking | Topic banks: work/study/home/tech | Rotating partner practice | Record Part 1+2 | |
| 21 | 7 | Writing T1 | Maps, processes (Academic) / complaint letters (GT) | Annotated model | T1 draft 3 (teacher) | |
| 22 | 8 | Listening | Distractors, spelling, plurals | Spelling bee | L-set 5 | |
| 23 | 8 | Reading | Speed + accuracy: 3-passage timed | Silent practice | R-set 5 | **Sectional checkpoint 3 (R full 60 min)** |
| 24 | 8 | Writing T2 | Advanced ideas: discussion & problem-solution essays | Idea mapping | T2 essay 3 | |
| 25 | 9 | Speaking | Fluency/pronunciation: stress, chunking, paraphrase | Shadowing | Record 2 mock parts | **Full mock 3 (full, speaking by examiner-style assessor)** |
| 26 | 9 | Listening | Full test strategy; note-taking | Whole Listening test | L-full | |
| 27 | 9 | Reading | Hard passages: vocabulary-in-context | Guided | R-set 6 | |
| 28 | 10 | Writing T2 | Timing & editing under pressure | 40-min timed essay | T2 essay 4 (teacher) | |
| 29 | 10 | Writing T1 | Timed T1 + band descriptor self-assess | Peer scoring on descriptors | T1 draft 4 | |
| 30 | 10 | Speaking | Band 7+ features: idioms, hedging, discourse markers | Cold-call kindly + coach | Record Part 3 set | |
| 31 | 11 | Weakness lab (personalised groups) | Weakest skill per learner (3 breakout groups) | TA-led groups | Personal plan | |
| 32 | 11 | Reading + Listening | Timed hybrid under exam conditions | Live proctored | R+L full | **Live proctored mock slot** |
| 33 | 11 | Writing | Peer-marked essays with descriptors | Calibration activity | Revised essay | |
| 34 | 12 | Speaking | Full speaking mock day (assessor rotations) | 3-part mock in rooms | Self-reflection log | |
| 35 | 12 | Exam day logistics | Test day rules, IELTS CBT vs paper, ID, time management | Q&A | Packing checklist | |
| 36 | 12 | Graduation | Recap, action plan for exam day, certificate | Celebration; testimonials (opt-in) | n/a | **Final full mock (R+L+W+S) window, close by day 5** |

Mock checkpoint summary: sectional checkpoints at sessions 6, 12, 23; full mocks at 9 (R+L), 18 (R+L+W + speaking AI), 25 (full + assessor speaking), 36 (final). Human feedback on mocks 3 and final writing + speaking (D10 Live tier: "human writing & speaking mock feedback").

### 9.2 IELTS Crash Course: 16 sessions (4 weeks x 4)

| # | Wk | Skill | Topic | Activity | Homework | Checkpoint |
|---|---|---|---|---|---|---|
| 1 | 1 | Orientation + Listening | Diagnostic debrief, plan, Listening S1-2 | Poll-driven walkthrough | L-set | Diagnostic review |
| 2 | 1 | Reading | Core strategies: skim/scan; T/F/NG | Timed | R-set | |
| 3 | 1 | Writing T2 | Structure + task response | Plan & write | T2 essay | |
| 4 | 1 | Speaking | Parts 1-3 overview, fluency | Pairs | Record 5 answers | **Full mock 1 (end of wk 1, async)** |
| 5 | 2 | Listening | S3-4, distractors | Timed | L-set | |
| 6 | 2 | Reading | Headings, matching, summary | Timed | R-set | |
| 7 | 2 | Writing T1 | Overviews, data comparison / letters | Model + draft | T1 draft | |
| 8 | 2 | Speaking | Part 2 mastery | Triads | Record 3 long turns | Full mock 2 (end wk 2) |
| 9 | 3 | Listening | Full test + review | Whole test | Error log | |
| 10 | 3 | Reading | Hard passages, timed 3-passage | Silent | R-full | |
| 11 | 3 | Writing T2 | Timing + editing, band 6.5+ features | Timed | T2 essay (teacher) | |
| 12 | 3 | Speaking | Part 3 + fluency boosters | Debate | Mock record | Full mock 3 (end wk 3; speaking assessor) |
| 13 | 4 | Weak-area lab | Personalised breakouts | TA groups | Fix list | |
| 14 | 4 | Reading + Listening | Live proctored timed R+L | Exam conditions | None | **Final mock R+L (live proctored)** |
| 15 | 4 | Writing + Speaking | Last-mile feedback, common band-limiting errors | Feedback clinic | Revision | |
| 16 | 4 | Test-day plan | Logistics, stress, last-week plan; Q&A | Recap | n/a | Final W+S mock feedback delivered |

### 9.3 GRE Live (8 wk, 24 sessions) skeleton (content from 15)

| Wk | Fri/Sat 150-min sessions | Tue 90-min lab |
|---|---|---|
| 1 | Quant: arithmetic & algebra foundations; Verbal: sentence equivalence strategy | Diagnostic debrief + problem-solving lab |
| 2 | Quant: ratios, percents; Verbal: text completion | Timed Quant set |
| 3 | Quant: geometry; Reading comprehension strategy | **Full mock 1 (section-adaptive, D6)** |
| 4 | Quant: data analysis; Verbal: RC inference; AWA basics | AWA clinic |
| 5 | Quant: quantitative comparison; Verbal: vocabulary in context | Timed Verbal set |
| 6 | Mixed review; Verbal: critical reasoning (if in scope) | **Full mock 2** |
| 7 | Hard Quant; AWA timed essay | AWA clinic + error log |
| 8 | Final strategy; test-day plan | **Full mock 3** + Q&A |

---

## 10. Checklists

### 10.1 Pre-batch (T-14 to T-0)

| # | Item | Owner | Due |
|---|---|---|---|
| 1 | Batch created in admin; capacity, price book (17), tier mapping (D10), schedule in UTC | Live Ops | T-21 |
| 2 | Minimum enrolment check vs §8.1; go/no-go | Head of Live | T-7 |
| 3 | Teacher + TA + assessor assigned; contracts, 2FA, verified bands, safeguarding training done | Live Ops | T-14 |
| 4 | Calendar feed (.ics), Zoom meetings/registrations created, backup link | Live Ops | T-10 |
| 5 | Curriculum plan mapped to 14/15; slides images exported; homework templates scheduled | Teacher | T-7 |
| 6 | Diagnostics completed by enrolled learners; level groups; breakout assignments | TA | T-3 |
| 7 | Guardian consents for minors confirmed | Support | T-5 |
| 8 | Welcome email/SMS/WhatsApp; orientation video; code of conduct accepted | Live Ops | T-3 |
| 9 | Tech rehearsal (audio, share, polls, recording) | Teacher + TA | T-2 |
| 10 | Recording pipeline test (Zoom -> Bunny) | Engineering | T-5 |
| 11 | Instalment payment schedule set (bKash instalments for Live/Mentor) | Finance | T-5 |
| 12 | Community space (in-app, WhatsApp announcement) created | TA | T-3 |
| 13 | Monitoring/alerts on (Sentry, uptime) | Engineering | T-1 |

### 10.2 Per-session

| When | Item |
|---|---|
| T-24h | Reminder sent; homework due list ready |
| T-30m | Teacher + TA in room; audio check; slides loaded; polls staged; backup link ready; recording on |
| T-0 | Waiting room admit; welcome message; attendance auto-track on |
| During | Follow §3.1 anatomy; TA logs questions, incidents, disconnects; exit poll |
| T+15m | Recording uploads started; attendance reconciled |
| T+2h | Recording available; homework published; Q&A forum answers |
| T+24h | Intervention triggers run (§7.3); teacher notes updated |

### 10.3 Post-batch

| # | Item | Owner |
|---|---|---|
| 1 | Final mock windows closed; grader feedback completed within SLA | Graders |
| 2 | Completion certificates issued (`/verify/[code]`) | System |
| 3 | NPS + feedback survey | Live Ops |
| 4 | Opt-in score reporting invite (and testimonial consent) at +2 weeks after learner's test date | Support |
| 5 | Teacher scorecards updated | Head of Live |
| 6 | Calibration review of batch grading | Head of Live |
| 7 | Retrospective; change log into 14/15 | Teachers + editors |
| 8 | Recording retention clock set (batch end + 30 days); deletion job | Engineering |
| 9 | Alumni funnel: Plus tier access, Speaking Club alumni slots, referral offers per 17 | Marketing |
| 10 | Financial reconciliation vs break-even model; update assumptions | Finance |

---

## 11. Open questions and assumptions to resolve

| # | Item | Needed from |
|---|---|---|
| OQ-1 | **Closed:** session counts (36 / 16 / 24 / 12), Mentor 3 × 45-min 1:1 (+ add-on packs) and Progress Promise terms are final in 17 §2.2 / §2.2a | Pricing |
| OQ-2 | BD teacher/assessor pay quotes | Finance |
| OQ-3 | Zoom plan limits, cloud recording and storage prices (not found in research) | Engineering/Finance |
| OQ-4 | Women-only batch demand test result | Marketing |
| OQ-5 | Official 2027 calendars: IELTS test dates, HSC results, Ramadan/Eid | Live Ops |
| OQ-6 | WhatsApp Business policy/cost for reminders in BD | Engineering |
| OQ-7 | Legal reporting duties and police clearance process for BD safeguarding | Legal |
| OQ-8 | **Closed (D1 change log 2026-11-07):** Live tier ships in P1 as manually-run Zoom pilot cohorts; in-app scheduling/attendance in P2 | Founders |
| OQ-9 | Research gaps: no benchmarks found for TA ratios, attendance rates, homework systems, speaking-club formats; all such values here are design assumptions to be validated in pilot | Head of Live |
