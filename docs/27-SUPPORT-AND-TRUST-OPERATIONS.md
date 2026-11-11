# 27 — Support & Trust Operations

> Status: draft v1, 2026-11-07. Conforms to `00-DECISIONS.md` (D4 roles, D5 commerce, D7 security/minors, D10 tiers, D12 resolutions incl. C6 90-day audio, C7 14-day deletion, C13 Progress Promise, C14 reference price, C18 accommodations, GA-007 exam disruption). If this file disagrees with `00`, `00` wins.
> Closes **GA-003** (support desk), **GA-016** (help-centre inventory), **GA-007** (exam-disruption policy and support actions), **GA-024** (grader programme), **GA-025** (fraud/chargebacks), **GA-026** (account sharing/leaks), **GA-027** (moderation), **GA-031** (channels), **GA-054** (score disputes), plus the operational halves of GA-014 (Progress Promise) and GA-047/048 (minors, DSAR).
> Companion: `26-LEGAL-AND-POLICY-DRAFTS.md` (the public policies this doc operates). Policy numbers referenced as "26 §n".
> **Flag legend** (same as 26): **[LEGAL]** counsel decides; **[VERIFY]** fact not confirmed (vendor prices/terms, statutes, numbers); **[DECIDE]** founders decide, default written; **[U]** genuinely unknown. Numbers in tables are *defaults to tune after 4 weeks of real data*.
> **Dependencies (updated by the delivery lead, 2026-11-07):** `17-PRICING-MASTER.md` now exists; per-tier AI credits, human-review counts, daily AI ceilings and SLA mapping are read from 17 §2.2 (referenced here, not restated). D12 C29 (helpdesk = Chatwoot Cloud in P1), C30 (attempt voiding), C6 (audio 90 days), C7 (deletion 14 days) are binding and applied below. Final backlog IDs: see 12 Appendix C.

## 0. Principles

1. **Money and exams first.** Payment-taken-no-access and exam-in-progress problems are P0 for every tier (they are the launch-week failure modes, GA-003/GA-007).
2. **Deflect with truth, not walls.** Every error state in the app links to a help article ID (§8); a human is always one click away.
3. **Least privilege, masked by default** (D4). Support sees masked PII; "reveal" needs a reason and is audited. Support cannot approve refunds, read essays or audio, or change a user's contact method directly.
4. **One source of truth per object.** Conversations live in the helpdesk; *decisions with consequences* (refund, dispute, guarantee claim, moderation, enforcement, DSAR, void attempt) live in our DB with audit (`05` conventions).
5. **Bilingual by default.** Every macro, article and notification exists in `en` and `bn`; Bangla quality is reviewed by a native speaker (GA-034).
6. **Humane enforcement.** Families share devices and internet cafés are common in BD; every automated signal needs a human before suspension, and every sanction has an appeal.
7. **Minors are a separate risk class** (D7): safeguarding and consent rules override convenience.

---

## 1. Support model

### 1.1 Channels

Decision (resolves GA-031 and the 03/02 mismatch): **P1 = all channels feed ONE helpdesk inbox**; no unlogged support anywhere. WhatsApp support intake is **P1** (as `02` §10.3/L4 requires); WhatsApp *notifications/marketing* stay **P2** (D3, `10` §11.3).

| Channel | P1? | How it works | Used for | Notes |
|---|---|---|---|---|
| **In-app Help Centre + "Contact support"** (`/help`, `/app/support`) | Yes — primary | Searchable articles (en/bn); signed-in users open a ticket pre-filled with user/order/attempt context; guests use `/contact` (Turnstile) | Everything; the only channel where we get structured context | Every error state deep-links to an article ID |
| **Email** `support@{{DOMAIN}}` | Yes | Routed to helpdesk inbox; auto-ack with ticket number | International users; attachments (screenshots, TRFs); formal requests (DSAR via `privacy@`, copyright via `copyright@`, safeguarding via `safeguarding@` route to dedicated queues) | SPF/DKIM/DMARC per `10` §11.1 |
| **WhatsApp Business** (Cloud API, via helpdesk) | Yes — intake | Customer-initiated; 24-hour reply window free-form; templates outside the window **[VERIFY pricing/policy, 10 §11.3 U14]** | BD learners' preferred channel: payments, access, quick questions | Business verification + number approval can take weeks — start now (NEW-SUP-02). Do **not** collect OTPs, passwords, card/wallet PINs or full wallet numbers; ask for TrxID and last 4 digits only |
| **Facebook Messenger** (Page inbox via helpdesk) | Yes | Page messages routed to inbox | Pre-sales and general questions | Pre-sales questions get an auto-reply linking to the catalogue and diagnostic |
| **Phone hotline** | Optional → P2 | P1: a monitored mobile number for **Mentor/Live/payment-P0 callbacks only** (callback model, call logged as a ticket note) | Urgent exam-day issues, older guardians | Short-code/toll-free number needs telecom arrangements **[VERIFY]**; revisit when > 15% of contacts ask for calls |
| **Community / Facebook group / Discord** | Not a support channel | Moderators redirect to the Help Centre; never post personal data | Peer help | `03` already says the Facebook group is not an official support channel |
| **Live-class room "Report" / TA** | Yes (live) | TA raises a ticket from the room for tech problems; **safeguarding reports go straight to the DSL** (§13) | Live join issues | |
| **Social comments/DMs (Instagram/TikTok/YouTube)** | No | Auto-reply template pointing to the Help Centre | — | Monitor for complaints and piracy (§11.4) |

### 1.2 Hours and coverage

| Item | Default |
|---|---|
| **Support hours (BD)** | **09:00–23:00 Asia/Dhaka, 7 days** (`02` §10.3). 14 hours covers evening study time; exam-week uplift below |
| **International coverage** | Same hours = **03:00–17:00 UTC**: good for UK/EU/Gulf/South Asia/Australia; for US East it covers ~22:00–12:00 ET and for US West ~19:00–09:00 PT (so US users get answers "overnight" or in their morning). Email-first for international, with a guaranteed "next support hour" first response; no promise of 24/7 |
| **Out of hours** | Auto-ack states hours, links to Help Centre and status page; urgent keywords ("charged", "debited", "exam", "hacked", "unsafe") raise priority so the first agent on shift sees them first. **On-call (founder or ops lead) only for: safeguarding L3 (§13), security incident (`09` §13.10), full payment outage** |
| **Exam-week uplift** | During scheduled live mock windows, cohort start weeks and the 3 days before major test dates: a second agent on shift until 23:00 and a 1-hour P0 response; announce on the status page |
| **Holidays** | Eid and other long breaks: reduced rota published 7 days ahead on the Help Centre and status page; P0 coverage retained |
| **Staffing P1** | 1 support executive (BDT 25k, `02` §10.4) + founder/ops backup + a part-time evening agent; Mentor tier gets a named contact. Add the second executive when median first response > 4 h for two weeks (`02` KPI < 4 h) |

### 1.3 Communication standards
- Reply in the user's language (Bangla/English/mixed); never ask for passwords, OTPs, PINs, full card/wallet numbers or ID documents (except the Path C recovery evidence listed in `03` §6.6 and accommodation evidence in §12.3).
- Tone: calm, specific, owns the problem. Always state the next step and when the user will hear from us.
- Never promise a score, admission or a refund before the rules/finance have decided.
- Minors: address the learner kindly; for purchases, consent or safeguarding, involve the Guardian via the verified link (never via a number the minor types in a chat).

---

## 2. Helpdesk tool decision (buy / open-source vs build)

### 2.1 Requirements (from 03 F-SUP-04/F-SUP-01..03, GA-003, 02 §10.3)
Multi-channel inbox (email, WhatsApp, Messenger, web/in-app widget); ticket numbers; categories; priorities; **SLA timers** with BD business hours; **macros en/bn**; internal notes and assignment; escalation to finance/editor; CSAT; help-centre/knowledge base (bilingual); REST API + webhooks; identity linking to our users; 2FA for agents; low cost for 2–3 seats; low ops burden for a founder-led team; PII handling acceptable under PDPO (cross-border transfers listed in the processors page, 26 §2.3).

### 2.2 Options compared (**prices are public list prices from memory — [VERIFY] every figure before purchase**; USD→BDT ≈ 119 as in `02`)

| Criterion | **A. Build in-app (on our DB)** | **B. Chatwoot** (open source; Cloud or self-host) | **C. Zendesk** (Suite) | **D. Freshdesk** (+ Freshchat/omnichannel) |
|---|---|---|---|---|
| Time to usable | 3–5 weeks of Sonnet work for tickets + inbox UI + email ingest + attachments + SLA; WhatsApp/Messenger channels are *additional* integrations | Days: connect email, WhatsApp Cloud API, Messenger, website widget | Days | Days |
| WhatsApp / Messenger | Must build webhooks + reply UI + template handling | Native channels (WhatsApp Cloud, Facebook, Instagram, email, web widget, API channel) | Native (Suite; WhatsApp via add-on/partner in some plans **[VERIFY]**) | Native in omnichannel plans **[VERIFY]** |
| Macros / canned responses (en/bn) | Build | Canned responses (shortcodes, variables) | Macros (multi-language on higher plans **[VERIFY]**) | Canned responses/scenario automations |
| SLA timers | We control (business hours calendar) | SLA policies exist in paid plans **[VERIFY]**; we also compute SLA in our own mirror (below) | Strong | Strong |
| CSAT | Build | Built-in CSAT | Built-in | Built-in |
| Help centre (bn+en) | Our CMS `/help` already planned (F-CMS-04) | Built-in Help Center portal exists, but we keep `/help` in our CMS for SEO/i18n and link out | Guide (extra cost) | Solutions portal |
| Data location / PDPO | All in our Neon DB — **best**: no extra processor | Self-host: our own server (choose region); Cloud: vendor-hosted, region **[VERIFY]** → add as processor | US/EU vendor; add as processor + SCCs | India/US vendor; add as processor |
| Cost for 3 agents (illustrative, **[VERIFY]**) | $0 licence; ~4 weeks engineering + ongoing maintenance (a founder-hour tax) | **Cloud:** roughly $19/agent/month on a startup plan → ~**$57 (~BDT 6.8k)/mo** (a free tier with ≤ 2 agents has existed; limits **[VERIFY]**). **Self-host:** licence $0 + a small VPS ($10–40/mo) + ~2–4 h/month upkeep | ~$55/agent/mo on Suite Team → ~**$165 (~BDT 19.6k)/mo**; Professional ~$115/agent | ~$15–$49/agent/mo helpdesk; omnichannel/WhatsApp can push to ~$35–$79 → ~$45–$240/mo |
| Ops burden | High (we maintain support software) | Low (Cloud) / Medium (self-host: Rails + Postgres + Redis + upgrades) | Lowest | Low |
| Lock-in / exit | None | Open source; export via API; can move Cloud ↔ self-host | High | High |
| Fit with D4 masked PII | Full control (masking inside our console) | Agents see contact email/phone of the conversation (inherent to WhatsApp) — mitigate by keying contacts by `user_id` identifier and keeping order/payment detail in our console | Same limitation | Same limitation |
| Verdict | Right *eventually* if volume/complexity justify | **Best P1 fit** | Over-priced for P1 | Reasonable alternative if WhatsApp pricing is better **[VERIFY]** |

### 2.3 Recommendation (P1)

**Adopt Chatwoot — Chatwoot Cloud in P1 (D12 C29; self-hosting is an option only if the founder reverses it for data-transfer reasons), and build only a thin integration layer (SLA timers/tags synced via webhook).** Build native ticketing in P2 *only if* the P2 gate below trips.

Rationale:
1. **Fastest to the three channels BD learners actually use** (WhatsApp, Messenger, email) with a web/in-app widget; GA-003's launch-day failure mode ("money-deducted-no-access tickets arrive by WhatsApp with nowhere to be tracked") is solved on day one.
2. **Cost is a rounding error** (~BDT 7k/month for 3 seats vs ~BDT 20k for Zendesk) and scales linearly; no licence for self-host.
3. **Open source = exit path** and a self-host option if PDPO/localisation (R-DATA-1) or cost changes. No lock-in.
4. **We keep control of the things that matter**: SLA clocks, decisions, audit and PII masking are in *our* DB (sketched in §19), so the helpdesk is replaceable.
5. **Why not build now:** P1 already carries a very large backlog (`12` §11); native ticketing means 3–5 engineering weeks plus WhatsApp/Messenger/email plumbing for a feature customers do not see as differentiation.
6. **Why not Zendesk/Freshdesk:** cost and lock-in for a 2–3 seat team; their advantages (deep reporting, marketplace) are not needed yet.

**P2 gate to revisit (Opus review at P2 start):** build native if any of — (a) > 150 tickets/day sustained; (b) Chatwoot Cloud cost or limits exceed ~BDT 25k/month; (c) integration friction (identity, SLA, deletion/DSAR connector) costs > 1 engineer-day/week; (d) PDPO guidance forbids this vendor/region and self-host is not viable. `support_ticket`/`ticket_message` are designed to work in both modes (`SUPPORT_BACKEND=chatwoot|native`).

### 2.4 Integration points (what we build in P1; tasks NEW-SUP-03..07)

| # | Integration | Direction | Detail |
|---|---|---|---|
| I1 | **Identity linking** | App → Chatwoot widget | Signed-in widget uses Chatwoot **identity validation** (`identifier_hash` = HMAC-SHA256(user_id, server secret), computed server-side only); contact `identifier = user_id`; name only; email/phone attached only when the channel requires |
| I2 | **Ticket creation from the app** | App → Chatwoot API | `/api/support/tickets` (authenticated; Turnstile for guests; rate-limited per user and IP) validates category, attaches context custom attributes (`user_id`, `tier`, `order_id`, `attempt_id`, `eval_id`, `locale`), creates the conversation, stores the `support_ticket` mirror row, returns the ticket number |
| I3 | **Auto-created tickets from system events** | App → Chatwoot | Payment `held_review`/`failed after debit` detected by reconcile, exam-voided attempts, AI evaluation failed twice, DSAR created, webhook DLQ for a paid order → a prefilled P0/P1 ticket for the user with the right macro suggested |
| I4 | **Inbound webhooks** | Chatwoot → `/api/webhooks/chatwoot` | Verify signature/secret; idempotent upsert of `support_ticket` (status, assignee, priority, timestamps, labels). **Message bodies are not copied** in P1 (data minimisation); only metadata + `first_responded_at` |
| I5 | **SLA engine** | Our Inngest | On ticket create/update compute `first_response_due_at`/`resolution_due_at` from **tier × priority × BD support-hours calendar** (§4); cron every 5 min flags "due in 30 min" and "breached" → Slack/WhatsApp ops alert, escalation (§6) and auto-priority bump. We do not depend on Chatwoot's SLA feature |
| I6 | **Context side-panel** | Chatwoot dashboard app → our `/support/lookup` | Embed our support lookup (masked) in the conversation sidebar via Chatwoot **Dashboard Apps** (iframe + `postMessage` context). Needs a dedicated CSP `frame-ancestors` allow-list for the Chatwoot origin on that one route only **[VERIFY]**; fallback: signed deep links in macros and a "Open in Support console" custom attribute |
| I7 | **Macros with variables** | Chatwoot canned responses ↔ `macro` table | Source of truth is our `macro` table (reviewed, versioned, en+bn); a sync job pushes the active macros to Chatwoot canned responses; agents may not edit macros inline |
| I8 | **CSAT** | Chatwoot → our DB | CSAT collected by Chatwoot (or our own mail link) and written to `csat_response` (so we can join to tier/category/agent) |
| I9 | **DSAR / deletion connector** | App ↔ Chatwoot API | Export: pull all conversations for contact `identifier = user_id`; deletion: delete/anonymise contact + conversations within the DSAR job (`data_subject_request`); required by `09` §13.9 ("support tickets" are in the export registry) |
| I10 | **Attachments** | Chatwoot storage | Configure Chatwoot to store attachments in private R2/S3 with AV scanning where possible (GA-037); agents never download attachments to personal devices; no ID documents unless the flow requires (accommodation proof, Path C recovery) |
| I11 | **Agents** | Chatwoot | Agent accounts require 2FA; roles: `agent`, `administrator` (founders only); one account per person; offboarding same day |
| I12 | **Moderation/safeguarding handoff** | Chatwoot labels → our queues | Label `safeguarding` triggers an immediate alert to the DSL and creates a `moderation_case` with `safeguarding_flag` |

---

## 3. Ticket taxonomy

### 3.1 Categories (3-letter group + 2-digit code; stored in `support_ticket.category_code`)

| Code | Category | Typical examples | Default priority | Owner queue | Auto-actions |
|---|---|---|---|---|---|
| **PAY-01** | Payment pending | wallet debited, status pending | **P0** | Support → Finance | re-check payment job; M-PAY-01/02 |
| **PAY-02** | Payment debited but no access | bKash/Nagad/card taken, no entitlement | **P0** | Support → Finance | reconcile + M-PAY-02 |
| PAY-03 | Payment failed / cancelled / declined | | P2 | Support | M-PAY-03 |
| PAY-04 | Duplicate payment | | P1 | Finance | M-PAY-04 |
| PAY-05 | Held for review (risk) | `risk_level=1` | P1 | Finance | M-PAY-05 |
| PAY-06 | Invoice, VAT, receipt, billing details | | P3 | Support | M-PAY-06 |
| PAY-07 | International payment / subscription / tax | Paddle | P2 | Finance | M-PAY-07 |
| REF-01 | Refund request | | P2 | Finance | M-REF-01..03 |
| REF-02 | Refund status / delay | | P2 | Finance | M-REF-03 |
| ACC-01 | Sign-in / OTP not received | | **P1** | Support | M-ACC-01/02 |
| ACC-02 | Account recovery (Path C) | lost phone & email | P1 | Support (verified) | M-ACC-03 |
| ACC-03 | 2FA / passkey problems | | P2 | Support | M-ACC-04 |
| ACC-04 | Profile / email / phone change | | P3 | Support | |
| ACC-05 | Account deletion | | P2 | Support → Privacy | M-ACC-05 |
| ACS-01 | Course/test not visible after purchase | | **P1** | Support | M-ACS-01 |
| ACS-02 | Access expired / extension | | P2 | Support | M-ACS-02 |
| ACS-03 | Video/audio won't play, slow | | P2 | Support → Eng | M-ACS-03 |
| ACS-04 | Device/session limit | | P2 | Support | M-ACS-04 |
| EXM-01 | **Exam technical problem / connection lost** | | **P0 if attempt in progress or ≤ 24 h before scheduled mock**, else P1 | Support | M-EXM-01 |
| EXM-02 | Listening audio problem | | P1 | Support → Eng | M-EXM-02 |
| EXM-03 | Accommodation request | | P2 | Support lead | M-EXM-03 |
| EXM-04 | Answer-key / question error report | | P3 | Content editor | M-EXM-04 |
| EXM-05 | "I submitted on time" dispute | | P1 | Support lead | §12.3 |
| AIS-01 | AI score query ("why this band?") | | P3 | Support | |
| AIS-02 | **Score dispute / human re-grade** | | P2 | Grader lead | M-AIS-01 |
| AIS-03 | AI evaluation failed / credit not returned | | P1 | Support | M-AIS-02 |
| AIS-04 | Human review delayed | | P1 | Grader lead | M-AIS-03 |
| CNT-01 | Content error (lesson typo/factual) | | P3 | Content editor | |
| CRT-01 | Certificate issue / name correction | | P3 | Support | M-CRT-01 |
| LIV-01 | Live class join / schedule / recording | | **P1 on class day** | Live Ops | M-LIV-01 |
| LIV-02 | Mentor 1:1 scheduling | | P2 | Live Ops | |
| GUA-01 | Progress Promise question/claim | | P2 | Support lead → Finance | M-GUA-01 |
| ADM-01 | Admissions product question | | P3 | Counsellor lead | |
| TRU-01 | Abuse / harassment report | | P1 (**P0 if minor/threat**) | Moderation | §10 |
| TRU-02 | **Safeguarding concern** | | **P0** | DSL | §13 |
| TRU-03 | Copyright / leak report | | P2 | Trust | §11.4 |
| TRU-04 | Suspected fraud / account compromise | | P1 | Trust/Support | §11 |
| TRU-05 | Enforcement appeal | | P2 | Support lead | §11.2 |
| PRV-01 | Privacy request (DSAR) | | P1 (30-day statutory clock) | Privacy owner | §15 |
| B2B-01 | Institution/seats/cohort | | P2 | Account manager | |
| CRE-01 | Instructor/creator/grader support | | P2 | Ops | |
| SEC-01 | Security report (vulnerability) | | P1 | Security owner | 26 §14 |
| GEN-01 | Pre-sales / general | | P3 | Support | |
| GEN-02 | Feedback / feature request | | P3 | Product | |
| GEN-99 | Other / spam | | P3 | Support | |

### 3.2 Priority definitions

| Priority | Definition | Examples |
|---|---|---|
| **P0 — Critical** | Money taken without service; exam in progress / imminent; safeguarding; security/data exposure; full outage | PAY-01/02, EXM-01 (live), TRU-02, SEC-01 critical |
| **P1 — High** | Blocks use of something paid or has a legal clock | ACC-01, ACS-01, AIS-03/04, LIV-01 (class day), PRV-01 |
| **P2 — Normal** | Needs action, not blocking | refunds, disputes, extension |
| **P3 — Low** | Information, feedback | |

Priority is set by category defaults and then **bumped** automatically: ticket age > 80% of SLA (+1 level), tier Mentor/Live (+1 level, max P1 unless P0), keywords, repeat contact within 24 h (+1).

---

## 4. SLAs by tier

### 4.1 Clock rules
- **Support-hours clock:** SLA time runs only inside support hours (09:00–23:00 BDT daily) — except P0 safeguarding/security which run 24×7 with on-call.
- **Pause** when status = `pending_customer`; **resume** on customer reply. Reminder after 3 days; auto-close (`resolved`) after 7 days without reply; a reply within 14 days reopens.
- **First response** = first non-automated human reply. **Resolution** = status `resolved` with the issue fixed or a final answer given.
- Targets are commitments to the *tier shown in the product*; the pricing page must say "priority support" only for Live and Mentor (D10) and show the numbers below in the Help Centre `HC-SUP-01`.

### 4.2 First-response and resolution targets (support hours)

| Tier (D10) | P0 | P1 | P2 | P3 | Channels with priority | Extras |
|---|---|---|---|---|---|---|
| **Free** | 4 h *(P0 safeguarding/security: 1 h)* | 24 h | 48 h | 72 h | Help Centre, email, in-app | Self-serve first; community pointer |
| **Core** | 2 h | 12 h | 24 h | 48 h | + WhatsApp/Messenger | |
| **Plus** | 1 h | 8 h | 16 h | 36 h | + WhatsApp | Weekly live group Q&A (Zoom) |
| **Live** | 1 h | **4 h** | 8 h | 24 h | WhatsApp priority | **Class-day join desk**: ≤ 15 min during live session hours (TA/Live Ops) |
| **Mentor** | **30 min** | **2 h** | 4 h | 12 h | WhatsApp priority + callback | Named support contact; hotline callback; same-day for access/exam issues |
| **Org (B2B)** | 1 h | 4 h | 8 h | 24 h | Email + account manager | Per contract; seat/cohort issues P1 |
| **Guest / pre-sales** | n/a | 24 h | 24 h | 48 h | | Pre-sales on Messenger: ≤ 4 h in hours (conversion-critical) |

**Blended target (`02` §14 KPI):** median first response **< 4 h** across all tickets; ≥ 90% of tickets within their tier target; reopen rate < 8%.

| Resolution targets (typical) | Target |
|---|---|
| P0 payment-no-access | Resolved or refunded decision ≤ 4 support hours (reconcile runs every 5 min; manual TrxID check within the hour) |
| P0 exam-in-progress | Learner unblocked ≤ 1 h; any void/re-issue/credit decision ≤ 4 h |
| Refund decision (REF-01) | ≤ **3 business days** (26 §4 A2); payout timing 7–14 working days after approval **[VERIFY]** |
| Score dispute (AIS-02) | Acknowledge ≤ 4 h; human re-grade ≤ **48 h** (standard) / 24 h (priority) (`07` SLA) |
| Human review delay (AIS-04) | Grader lead replies ≤ 4 h; review within 8 h of reassignment |
| Account recovery Path C | 48-hour cool-off mandated by `03` §6.6 — SLA clock does not run during cool-off |
| DSAR | Ack ≤ 3 business days; completion ≤ **30 days** (26 §2.1; GDPR 1 month) |
| Progress Promise claim | Decision ≤ 10 business days (26 §4.3 C5) |
| Enforcement appeal | Outcome ≤ 3 business days |
| Safeguarding | Acknowledge ≤ 24 h by policy (18 §5.8); **internal target 1 h in hours / on-call after hours for L3** |

### 4.3 SLA breach handling
1. **T-30 min alert** to the assignee; **breach** alert to the lead; P0 breach → founder.
2. Breach on a **paid human-review** (48 h/24 h) → learner is offered a credit or refund of that review without asking (26 §4 table) and receives an apology macro.
3. Weekly SLA-attainment report by tier; two consecutive weeks < 90% on any tier triggers a staffing review.
4. Org customers: breach credits per contract.

---

## 5. Macros library (top 30 + trust macros)

Governance: macros live in the `macro` table (key, version, en/bn body, variables, internal steps); owner = Support lead; every macro reviewed monthly and after any policy change; Bangla reviewed by a native speaker; variables `{{name}}`, `{{ticket_no}}`, `{{order_id}}`, `{{provider}}`, `{{amount}}`, `{{date}}`, `{{article_url}}`. **Agents never paste a macro without doing the "Check/Do" steps first.** Each reply ends with the ticket number and the support-hours line (auto-appended).

### 5.1 Payments (BD wallets, gateway and international)

**M-PAY-01 — Payment pending** (PAY-01, P0)
*Check/Do:* find order by id/phone; read `payment.status`; run "re-check payment" (F-SUP-02) which calls the gateway validation API; if `VALID` the job grants access; if `risk_hold` use M-PAY-05; do **not** let the user pay again.
EN: Hi {{name}}, thank you for your patience. Your payment for order {{order_id}} still shows as pending with {{provider}}. Wallet confirmations can take a few minutes and we re-check automatically. Please don't pay again. If it is still pending after 30 minutes, reply with your transaction ID (TrxID) and the time you paid and we will check it by hand. Ticket {{ticket_no}}.
BN: হ্যালো {{name}}, ধৈর্য ধরার জন্য ধন্যবাদ। আপনার অর্ডার {{order_id}}-এর পেমেন্ট এখনও {{provider}}-এর কাছে “পেন্ডিং” দেখাচ্ছে। ওয়ালেটের কনফার্মেশনে কয়েক মিনিট লাগতে পারে, আর আমরা নিজেরাই বারবার যাচাই করি। অনুগ্রহ করে আবার পেমেন্ট করবেন না। ৩০ মিনিট পরেও পেন্ডিং থাকলে পেমেন্টের সময় ও ট্রানজ্যাকশন আইডি (TrxID) পাঠান—আমরা হাতে যাচাই করব। টিকিট {{ticket_no}}।

**M-PAY-02 — bKash/Nagad/card debited but no access** (PAY-02, P0)
*Check/Do:* ask for TrxID, payment time, last 4 digits of the wallet number (never the full number, PIN or OTP); search `payment` by `tran_id`/`bank_tran_id`; check `webhook_event` and reconcile result. **Found at gateway as VALID:** finance "mark paid" path / re-run fulfilment → entitlement granted → Branch A. **Not found after 2 h:** ask for the wallet SMS screenshot; open a provider query via finance; if unresolved in 24 h refund the debited amount (26 §4 A4(ii)) → Branch B.
EN (A): Good news, {{name}} — we found your payment {{trx}} and your access to {{product}} is now active (you may need to refresh or sign out and in). Sorry for the delay. Ticket {{ticket_no}}.
EN (B): Hi {{name}}, we could not yet see payment {{trx}} on the {{provider}} side. We have asked them to check it and will update you within 24 hours. If the money was taken and we cannot confirm the order, we will refund it in full. Please don't pay again. Ticket {{ticket_no}}.
BN (A): সুখবর, {{name}}—আপনার পেমেন্ট {{trx}} খুঁজে পেয়েছি এবং {{product}}-এর অ্যাক্সেস এখন চালু হয়েছে (পেজ রিফ্রেশ বা সাইন-আউট করে আবার সাইন-ইন করুন)। দেরির জন্য দুঃখিত। টিকিট {{ticket_no}}।
BN (B): হ্যালো {{name}}, {{provider}}-এর দিকে আমরা এখনও পেমেন্ট {{trx}} দেখতে পাইনি। তাদের কাছে যাচাইয়ের অনুরোধ করেছি এবং ২৪ ঘণ্টার মধ্যে আপডেট জানাব। টাকা কেটে গিয়ে অর্ডার নিশ্চিত না হলে আমরা পুরো টাকা ফেরত দেব। অনুগ্রহ করে আবার পেমেন্ট করবেন না। টিকিট {{ticket_no}}।

**M-PAY-03 — Payment failed / cancelled** (PAY-03)
*Check/Do:* read failure reason (insufficient balance, wrong PIN, timeout, cancelled); confirm no debit; point to retry (cart preserved, F-PAY-10).
EN: Hi {{name}}, your payment for {{product}} didn't go through ({{reason}}) and no money was kept by us. You can try again from your order page — your cart is saved. If your wallet or card was charged anyway, send us the TrxID and we'll fix it right away. {{article_url}}
BN: হ্যালো {{name}}, {{product}}-এর পেমেন্ট সফল হয়নি ({{reason}}) এবং আমরা কোনো টাকা রাখিনি। অর্ডার পেজ থেকে আবার চেষ্টা করুন—আপনার কার্ট সংরক্ষিত আছে। তবুও টাকা কেটে থাকলে TrxID পাঠান, আমরা দ্রুত সমাধান করব। {{article_url}}

**M-PAY-04 — Duplicate payment** (PAY-04)
*Check/Do:* confirm two succeeded payments for the same product; entitlements unaffected; open full refund of the second (always refundable, 26 §4 A4(i)); create REF ticket link.
EN: Hi {{name}}, you were charged twice for {{product}} (orders {{order_id}} and {{order_id2}}). Your access is not affected. We are refunding the second payment of {{amount}} in full to your original method; it usually reaches you in 7–14 working days after approval. We'll confirm when it's sent.
BN: হ্যালো {{name}}, {{product}}-এর জন্য আপনার দুইবার টাকা কেটেছে (অর্ডার {{order_id}} ও {{order_id2}})। আপনার অ্যাক্সেসে কোনো সমস্যা হবে না। দ্বিতীয় পেমেন্ট {{amount}} আমরা পুরোটাই মূল পেমেন্ট মাধ্যমে ফেরত দিচ্ছি; অনুমোদনের পর সাধারণত ৭–১৪ কার্যদিবস লাগে। পাঠানো হলে জানাব।

**M-PAY-05 — Held for verification (risk hold)** (PAY-05)
*Check/Do:* order in `held_review` (`risk_level=1` or unknown); finance asks for proof of ownership (screenshot of the wallet/bank SMS with name masked, last 4 digits) — never full card/wallet numbers; release or refund within 1 business day of evidence.
EN: Hi {{name}}, your payment for {{product}} was flagged by the payment provider for a routine security check, so we've paused access. To release it, please reply with a screenshot of the payment SMS or bank notification (hide all but the last 4 digits). We'll review it within one business day. If we can't verify it, we'll refund you in full.
BN: হ্যালো {{name}}, পেমেন্ট প্রোভাইডার রুটিন নিরাপত্তা যাচাইয়ের জন্য আপনার {{product}}-এর পেমেন্টটি চিহ্নিত করেছে, তাই অ্যাক্সেস সাময়িক বন্ধ আছে। চালু করতে পেমেন্টের এসএমএস বা ব্যাংক নোটিফিকেশনের স্ক্রিনশট পাঠান (শেষ ৪ ডিজিট ছাড়া বাকি সব ঢেকে দিন)। আমরা এক কার্যদিবসের মধ্যে দেখব। যাচাই না হলে পুরো টাকা ফেরত দেব।

**M-PAY-06 — Invoice / VAT / receipt** (PAY-06)
*Check/Do:* resend receipt (F-SUP-02); for a BIN/TIN invoice collect legal name, BIN/TIN, address (finance issues, `10` §7.4); invoices cannot be edited after issue — a credit note + new invoice is used.
EN: Hi {{name}}, we've re-sent your receipt for order {{order_id}} to your email. If you need a VAT invoice in a company name, reply with the legal name, BIN/TIN and address — finance will issue it within 2 business days.
BN: হ্যালো {{name}}, অর্ডার {{order_id}}-এর রসিদ আপনার ইমেইলে আবার পাঠিয়েছি। কোম্পানির নামে ভ্যাট ইনভয়েস লাগলে আইনি নাম, BIN/TIN ও ঠিকানা পাঠান—ফাইন্যান্স ২ কার্যদিবসের মধ্যে ইস্যু করবে।

**M-PAY-07 — International payment / subscription / tax** (PAY-07)
*Check/Do:* Paddle (merchant of record) handles card declines, tax and subscription management; link the Paddle receipt portal; renewals/cancellation per 26 §4.
EN: Hi {{name}}, international payments are processed by our payment partner, Paddle, who also handles tax and receipts. You can manage or cancel your subscription from your account → Billing, and find receipts in the email from Paddle. If your card was declined, please try another card or contact your bank; we'll gladly help with anything else. {{article_url}}
BN: হ্যালো {{name}}, আন্তর্জাতিক পেমেন্ট আমাদের পেমেন্ট পার্টনার Paddle প্রসেস করে, ট্যাক্স ও রসিদও তারাই দেয়। অ্যাকাউন্ট → বিলিং থেকে সাবস্ক্রিপশন পরিচালনা বা বাতিল করতে পারবেন; রসিদ Paddle-এর ইমেইলে পাবেন। কার্ড প্রত্যাখ্যাত হলে অন্য কার্ড চেষ্টা করুন বা ব্যাংকে যোগাযোগ করুন। {{article_url}}

### 5.2 Account, sign-in and privacy

**M-ACC-01 — OTP SMS not received** (ACC-01, P1)
*Check/Do:* confirm number format (+8801XXXXXXXXX); check `sms_log`/gateway delivery status; check rate-limit lockout (5 attempts; code TTL 5 min, D12 C8); BD operators sometimes delay masked-sender SMS; offer email OTP or Google sign-in; if a gateway issue is suspected, raise incident and update the status page.
EN: Hi {{name}}, sorry about the trouble. Codes expire after 5 minutes and you get 5 tries. Please check the number is entered as 01XXXXXXXXX, wait 2 minutes, then tap "Resend" once. You can also sign in with an email code or Google instead. If the SMS still doesn't arrive, tell us your operator (GP/Robi/Banglalink/Teletalk/Airtel) and we'll check with our SMS provider. {{article_url}}
BN: হ্যালো {{name}}, অসুবিধার জন্য দুঃখিত। কোড ৫ মিনিট পর্যন্ত বৈধ এবং ৫ বার চেষ্টা করা যায়। নম্বরটি ০১XXXXXXXXX ফরম্যাটে দিয়েছেন কি না দেখুন, ২ মিনিট অপেক্ষা করে একবারই “আবার পাঠান” চাপুন। চাইলে ইমেইল কোড বা গুগল দিয়ে সাইন-ইন করতে পারেন। তবুও এসএমএস না এলে আপনার অপারেটরের নাম (গ্রামীণফোন/রবি/বাংলালিংক/টেলিটক/এয়ারটেল) জানান, আমরা এসএমএস প্রোভাইডারের সঙ্গে যাচাই করব। {{article_url}}

**M-ACC-02 — Email code/verification link missing or expired** (ACC-01)
*Check/Do:* email log (Resend) delivered/bounced/suppressed; spam; the verification link lasts 60 min, codes 5 min (D12 C8); remove suppression if safe.
EN: Hi {{name}}, our email to {{email_masked}} shows as {{delivery_status}}. Please check Spam/Promotions and add {{sender}} to contacts. Verification links last 60 minutes and codes 5 minutes, so request a fresh one from the sign-in page. If you mistyped your email, use "Use a different email".
BN: হ্যালো {{name}}, {{email_masked}}-এ পাঠানো ইমেইলের অবস্থা: {{delivery_status}}। স্প্যাম/প্রমোশন ফোল্ডার দেখুন এবং {{sender}} কন্টাক্টে যোগ করুন। ভেরিফিকেশন লিংক ৬০ মিনিট ও কোড ৫ মিনিট বৈধ—তাই সাইন-ইন পেজ থেকে নতুন একটি নিন। ইমেইল ভুল টাইপ করে থাকলে “অন্য ইমেইল ব্যবহার করুন” চাপুন।

**M-ACC-03 — Lost phone and email access (recovery Path C)** (ACC-02)
*Check/Do:* never confirm whether an account exists; collect new contact + **two of** (last order ID, last 4 digits of payment wallet, enrolled course names, sign-up date, device name); create the Path C request (48-hour cool-off with notices to all old channels, AC-REC-02); do nothing before the cool-off ends.
EN: Hi {{name}}, we can help. If an account matches, we'll start a secure recovery: please send your new email/phone and any two of — a past order ID, the last 4 digits of the wallet you paid with, the courses you enrolled in, or when you signed up. For your safety there is a 48-hour wait, and we'll notify any old contact methods so the real owner can cancel. We can't speed this up.
BN: হ্যালো {{name}}, আমরা সাহায্য করব। কোনো অ্যাকাউন্ট মিলে গেলে নিরাপদ রিকভারি শুরু হবে: আপনার নতুন ইমেইল/ফোন এবং নিচের যেকোনো দুটি তথ্য পাঠান—আগের একটি অর্ডার আইডি, যে ওয়ালেট দিয়ে পেমেন্ট করেছেন তার শেষ ৪ ডিজিট, যে কোর্সে ভর্তি হয়েছিলেন, অথবা সাইন-আপের সময়। নিরাপত্তার জন্য ৪৮ ঘণ্টা অপেক্ষা করতে হবে এবং পুরোনো যোগাযোগ মাধ্যমে জানানো হবে যাতে আসল মালিক বাতিল করতে পারেন। এটি দ্রুত করা সম্ভব নয়।

**M-ACC-04 — 2FA / passkey lock-out (learner)** (ACC-03)
*Check/Do:* learners: use backup codes → alternate verified channel → Path C; staff accounts (grader+): **no support-assisted recovery** (03 §6.6 item 5; GA-049 two-person `super_admin` reset).
EN: Hi {{name}}, you can use one of your 10 backup codes to get in, or sign in with your other verified email/phone and then add a new passkey from Settings → Security. If you've lost all of these, reply and we'll start identity-checked recovery (it includes a 48-hour safety wait).
BN: হ্যালো {{name}}, আপনার ১০টি ব্যাকআপ কোডের একটি দিয়ে ঢুকতে পারেন, অথবা অন্য যাচাইকৃত ইমেইল/ফোন দিয়ে সাইন-ইন করে সেটিংস → নিরাপত্তা থেকে নতুন পাসকি যোগ করুন। সবকিছু হারিয়ে গেলে রিপ্লাই দিন—আমরা পরিচয় যাচাইসহ রিকভারি শুরু করব (৪৮ ঘণ্টার নিরাপত্তা অপেক্ষা থাকবে)।

**M-ACC-05 — Account deletion request** (ACC-05)
*Check/Do:* user must start deletion in Settings → Privacy (re-auth); explain 14-day grace (cancel by signing in); blocks: active org seat, open refund/dispute, active subscription; financial records retained as required by law; minors: Guardian may request.
EN: Hi {{name}}, we're sorry to see you go. You can delete your account in Settings → Privacy → Delete account. After you confirm, there's a 14-day grace period — sign in any time to cancel. Then your data is permanently deleted or anonymised; some invoices must be kept by law. Deleting doesn't automatically cancel subscriptions or trigger a refund — tell us if you'd like a refund and we'll check eligibility first.
BN: হ্যালো {{name}}, আপনি চলে যাচ্ছেন জেনে খারাপ লাগছে। সেটিংস → প্রাইভেসি → অ্যাকাউন্ট মুছুন থেকে মুছে ফেলতে পারবেন। নিশ্চিত করার পর ১৪ দিন অপেক্ষার সময় থাকে—এ সময়ে সাইন-ইন করলেই বাতিল হয়ে যায়। এরপর তথ্য স্থায়ীভাবে মুছে বা বেনামি করা হয়; আইনের প্রয়োজনে কিছু ইনভয়েস সংরক্ষিত থাকে। অ্যাকাউন্ট মুছলে সাবস্ক্রিপশন নিজে থেকে বাতিল বা রিফান্ড হয় না—রিফান্ড চাইলে জানান, আমরা আগে যোগ্যতা দেখব।

**M-ACC-06 — Data export / DSAR acknowledgement** (PRV-01)
*Check/Do:* verify via registered email/in-app re-auth; log `data_subject_request`; SLA 30 days (§15).
EN: Hi {{name}}, we've received your privacy request ({{request_type}}), reference {{ticket_no}}. To protect your data we need you to confirm it from your account (Settings → Privacy) or via the link we've emailed to your registered address. We'll complete it within 30 days and tell you if we need more time or can't do part of it, and why.
BN: হ্যালো {{name}}, আপনার প্রাইভেসি অনুরোধ ({{request_type}}) পেয়েছি, রেফারেন্স {{ticket_no}}। আপনার তথ্য সুরক্ষিত রাখতে অনুরোধটি অ্যাকাউন্ট (সেটিংস → প্রাইভেসি) থেকে বা আপনার নিবন্ধিত ইমেইলে পাঠানো লিংক থেকে নিশ্চিত করুন। আমরা ৩০ দিনের মধ্যে সম্পন্ন করব; বাড়তি সময় লাগলে বা কোনো অংশ না করতে পারলে কারণসহ জানাব।

### 5.3 Access, content and devices

**M-ACS-01 — Paid but course not showing** (ACS-01, P1)
*Check/Do:* order `paid`? entitlement exists, `starts_at` future? scope/target correct? cache invalidated; user signed in with a different account (Google vs phone)? duplicate accounts → link.
EN: Hi {{name}}, thanks for checking. We can see your purchase of {{product}} on the account {{account_hint}}. Please make sure you're signed in with that same sign-in method, then refresh. {{if_fixed}} I've refreshed your access — it should appear under My Courses now. If you paid with a different account, tell us which and we'll link it.
BN: হ্যালো {{name}}, জানানোর জন্য ধন্যবাদ। {{account_hint}} অ্যাকাউন্টে আপনার {{product}} কেনা দেখতে পাচ্ছি। একই পদ্ধতিতে (গুগল/ফোন/ইমেইল) সাইন-ইন আছেন কি না দেখে পেজ রিফ্রেশ করুন। আমি আপনার অ্যাক্সেস রিফ্রেশ করেছি—এখন “আমার কোর্স”-এ দেখা যাওয়ার কথা। অন্য অ্যাকাউন্টে কিনে থাকলে কোনটি জানান, আমরা যুক্ত করে দেব।

**M-ACS-02 — Access expired / extension request** (ACS-02)
*Check/Do:* support may extend **≤ 7 days** per grant with reason, **cumulative cap 14 days per 90 days** (proposed; F-SUP-02 says "cap" without a number) [DECIDE]; goodwill only for documented platform fault or first-time hardship; otherwise offer renewal/pass pricing.
EN: Hi {{name}}, your access to {{product}} ended on {{date}}. {{if_granted}} As a one-time courtesy, we've extended it by {{days}} days — please use the time well. {{else}} We can't extend it beyond the date shown, but you can renew from your orders page; reminders were sent 7 and 1 day before expiry. Your notes and progress are kept.
BN: হ্যালো {{name}}, {{product}}-এর অ্যাক্সেস {{date}}-এ শেষ হয়েছে। {{if_granted}} একবারের সৌজন্য হিসেবে আমরা {{days}} দিন বাড়িয়ে দিয়েছি। {{else}} নির্ধারিত তারিখের পর বাড়ানো সম্ভব নয়, তবে অর্ডার পেজ থেকে নবায়ন করতে পারেন; মেয়াদ শেষের ৭ দিন ও ১ দিন আগে রিমাইন্ডার পাঠানো হয়েছিল। আপনার নোট ও অগ্রগতি সংরক্ষিত আছে।

**M-ACS-03 — Video won't play / buffering** (ACS-03)
*Check/Do:* ask device, browser, network, error text; suggest Data-saver/360p, another browser, disabling VPN/extensions; check Bunny status; if multiple reports → incident + status page.
EN: Hi {{name}}, sorry the video isn't playing. Please try: (1) turn on Data-saver or choose 360p in the player, (2) use Chrome or Firefox updated to the latest version, (3) switch off VPN or ad-blockers for this site, (4) reload. If it still fails, send us a screenshot of the error, your device, and your network (Wi-Fi/mobile data) and we'll look into it.
BN: হ্যালো {{name}}, ভিডিও না চলায় দুঃখিত। চেষ্টা করুন: (১) ডেটা-সেভার চালু করুন বা প্লেয়ারে ৩৬০p বেছে নিন, (২) ক্রোম/ফায়ারফক্সের সর্বশেষ সংস্করণ ব্যবহার করুন, (৩) এই সাইটের জন্য ভিপিএন/অ্যাড-ব্লকার বন্ধ রাখুন, (৪) পেজ রিলোড করুন। তবুও না হলে এরর-এর স্ক্রিনশট, ডিভাইস ও নেটওয়ার্ক (ওয়াই-ফাই/মোবাইল ডেটা) জানান।

**M-ACS-04 — Device / concurrent session limit notice** (ACS-04; also the soft "nudge" in §11.2)
*Check/Do:* confirm limits (2 concurrent playback sessions); never accuse; ask whether the family shares a device; sign out other sessions on request.
EN: Hi {{name}}, you're signed in on more devices than your plan allows (2 at a time: one computer and one phone). You can sign out other devices in Settings → Devices. Accounts are personal, so please don't share your login — if family members also study with us, they're welcome to open their own free account. Let us know if you think this notice is a mistake.
BN: হ্যালো {{name}}, আপনার প্ল্যানে একসঙ্গে ২টি ডিভাইস (একটি কম্পিউটার ও একটি ফোন) চলে, কিন্তু আপনি এর বেশি ডিভাইসে সাইন-ইন আছেন। সেটিংস → ডিভাইস থেকে অন্য ডিভাইস সাইন-আউট করতে পারেন। অ্যাকাউন্ট ব্যক্তিগত, তাই লগইন শেয়ার করবেন না—পরিবারের কেউ পড়তে চাইলে নিজের ফ্রি অ্যাকাউন্ট খুলতে পারেন। নোটিশটি ভুল মনে হলে আমাদের জানান।

### 5.4 Mock tests and exams

**M-EXM-01 — Exam connection lost** (EXM-01, **P0 if in progress**; D12 GA-007)
*Check/Do:* open attempt timeline: `attempt_event` heartbeat gaps, `late_write_rejected`, section status. **Rule:** exam mode — a section interrupted by connection loss **> 2 min** may be **voided and re-issued once per attempt** via the self-serve "I lost connection" flow (logged, rate-limited). If the user already used it or the gap < 2 min but answers were lost, support grants a **replacement credit** (`credit_mock`) or re-issue (`grant_resit`) — limits: 2 support-granted credits per user per 90 days; 3rd needs lead approval [DECIDE]. Practice mode: system paused on heartbeat loss; resume. If it was our outage (status incident), admin bulk re-issues for all affected attempts. Never change a score by hand.
EN (self-serve available): Hi {{name}}, sorry your connection dropped during {{section}}. Please open your test and tap "I lost connection" — it will restart that section with a fresh timer (this works once per test, and it won't use up another mock). Your answers in other sections are safe.
EN (support grants): Hi {{name}}, we checked the log: your connection was down for {{minutes}} min during {{section}}, and the free restart has already been used. As a one-time exception we've added a replacement mock to your account ({{credit}}) so you aren't charged for this attempt. Load-shedding happens — tip: save your work often and keep a charged phone hotspot ready.
BN (সেলফ-সার্ভ): হ্যালো {{name}}, {{section}}-এর সময় আপনার ইন্টারনেট সংযোগ কেটে যাওয়ায় দুঃখিত। টেস্টটি খুলে “সংযোগ হারিয়ে গিয়েছিল” বোতাম চাপুন—সেকশনটি নতুন টাইমারে আবার শুরু হবে (প্রতি টেস্টে একবার; এতে আরেকটি মক খরচ হবে না)। অন্য সেকশনের উত্তর নিরাপদ আছে।
BN (সাপোর্ট দিলে): হ্যালো {{name}}, লগ দেখে পেয়েছি {{section}}-এর সময় আপনার সংযোগ {{minutes}} মিনিট বন্ধ ছিল এবং বিনামূল্যে রিস্টার্ট আগেই ব্যবহার হয়েছে। বিশেষ ব্যতিক্রম হিসেবে আপনার অ্যাকাউন্টে একটি বিকল্প মক ({{credit}}) যোগ করেছি, যাতে এই চেষ্টার জন্য আপনার ক্ষতি না হয়। লোডশেডিং হতেই পারে—ফোনে চার্জ ও মোবাইল হটস্পট প্রস্তুত রাখুন।

**M-EXM-02 — Listening audio problem** (EXM-02)
*Check/Do:* check `attempt_event audio_stall`; audio-stall credit per 07 §5.7; test headphones/permissions; if systemic, incident.
EN: Hi {{name}}, sorry the audio was a problem. We can see {{audio_event}} in your attempt log and have {{action}}. For the best experience use wired headphones, close other apps playing sound, and make sure the tab is allowed to play audio. If you'd like to retake Listening, reply and we'll check what we can do.
BN: হ্যালো {{name}}, অডিওর সমস্যার জন্য দুঃখিত। আপনার অ্যাটেম্পট লগে {{audio_event}} দেখা যাচ্ছে এবং আমরা {{action}}। ভালো অভিজ্ঞতার জন্য তারযুক্ত হেডফোন ব্যবহার করুন, অন্য অ্যাপের সাউন্ড বন্ধ রাখুন এবং ট্যাবে অডিও চালানোর অনুমতি দিন। Listening আবার দিতে চাইলে জানান, আমরা দেখব কী করা যায়।

**M-EXM-03 — Accommodation (extra time) request** (EXM-03; D12 C18)
*Check/Do:* ask for documentation (medical/school letter or prior official accommodation letter); lead approves 1.25× / 1.5× / 2.0×; store `accommodation_multiplier` + reason + evidence (sensitive; §12.3); minors via Guardian.
EN: Hi {{name}}, thank you for telling us. We can give extra time on timed tests (1.25×, 1.5× or 2×) when there's a documented need. Please send a letter or certificate from a doctor, school or test centre that mentions the support you need (hide anything unrelated). We'll decide within 2 business days and keep your documents private and only for this purpose. In Practice mode you can already pause or turn timers off.
BN: হ্যালো {{name}}, জানানোর জন্য ধন্যবাদ। প্রামাণ্য প্রয়োজন থাকলে আমরা টাইমড টেস্টে বাড়তি সময় (১.২৫×, ১.৫× বা ২×) দিতে পারি। অনুগ্রহ করে ডাক্তার, স্কুল বা পরীক্ষাকেন্দ্রের চিঠি/সনদ পাঠান যেখানে আপনার প্রয়োজনীয় সহায়তার উল্লেখ আছে (অপ্রাসঙ্গিক তথ্য ঢেকে দিন)। আমরা ২ কার্যদিবসের মধ্যে সিদ্ধান্ত জানাব এবং কাগজপত্র গোপন রেখে শুধু এই কাজেই ব্যবহার করব। প্র্যাকটিস মোডে আপনি এখনই পজ করতে বা টাইমার বন্ধ রাখতে পারেন।

**M-EXM-04 — Wrong answer key / question error reported** (EXM-04; F-ERR-01)
*Check/Do:* dedupe by target; route to `/editor/reports`; priority by volume; reporter gets status updates.
EN: Thank you, {{name}} — that's a really useful report. We've sent it to our editors for {{item}}. If it's a mistake, we'll correct the question, and if the answer key changes we'll re-score affected attempts and tell you. You'll get an update here.
BN: ধন্যবাদ, {{name}}—এটি খুব কাজের তথ্য। {{item}} নিয়ে আপনার রিপোর্টটি আমাদের সম্পাদকদের কাছে পাঠিয়েছি। ভুল হলে প্রশ্নটি সংশোধন হবে, আর উত্তরমালা বদলালে প্রভাবিত অ্যাটেম্পট পুনরায় স্কোর করে আপনাকে জানানো হবে। এখানেই আপডেট পাবেন।

### 5.5 AI scoring, disputes and human review

**M-AIS-01 — Score dispute → human re-grade** (AIS-02; §12.1)
*Check/Do:* confirm result age within window, open `dispute(kind=score)`; free first dispute this month? else human-review credit; assign non-original grader; set `sla_due_at` (48 h).
EN: Hi {{name}}, thanks for flagging your {{task}} score ({{band}}). Our scores are AI estimates and a person can look again. We've opened a human re-grade (reference {{ticket_no}}). A trained grader will review your response independently and send the result within 48 hours. {{credit_note}} The grader's band becomes the one shown on your dashboard. Please don't resubmit the same essay meanwhile.
BN: হ্যালো {{name}}, আপনার {{task}} স্কোর ({{band}}) নিয়ে জানানোর জন্য ধন্যবাদ। আমাদের স্কোর AI-এর আনুমানিক হিসাব—একজন মানুষ আবার দেখতে পারেন। আমরা মানব রি-গ্রেড (রেফারেন্স {{ticket_no}}) খুলেছি। প্রশিক্ষিত একজন গ্রেডার স্বাধীনভাবে আপনার লেখা দেখে ৪৮ ঘণ্টার মধ্যে ফল জানাবেন। {{credit_note}} গ্রেডারের ব্যান্ডটিই আপনার ড্যাশবোর্ডে দেখানো হবে। এর মধ্যে একই লেখা আবার জমা দেবেন না।

**M-AIS-02 — AI evaluation failed / credit not returned** (AIS-03)
*Check/Do:* check `evaluation_request.status`, `last_error`; credits auto-compensated on failure (R15); if not, `admin_grant` the credit (≤ 3 per case); re-queue.
EN: Hi {{name}}, sorry — your {{task}} evaluation failed on our side. We've returned your credit ({{credits}}) and re-queued it; you'll get the result in a few minutes. If it fails again, reply and a person will score it.
BN: হ্যালো {{name}}, দুঃখিত—আমাদের দিকের সমস্যায় আপনার {{task}} মূল্যায়ন ব্যর্থ হয়েছে। আপনার ক্রেডিট ({{credits}}) ফেরত দিয়ে আবার সারিতে দিয়েছি; কয়েক মিনিটে ফল পাবেন। আবার ব্যর্থ হলে জানান, একজন মানুষ স্কোর করে দেবেন।

**M-AIS-03 — Human review delayed (SLA breach)** (AIS-04)
*Check/Do:* check `grader_assignment`; reassign; offer credit/refund choice automatically (26 §4).
EN: Hi {{name}}, your human review is later than our {{sla}}-hour promise — I'm sorry. I've moved it to the front of the queue and it will be done by {{eta}}. As an apology you can choose either a free extra human review credit or a refund of this review; just reply with your choice.
BN: হ্যালো {{name}}, আমাদের {{sla}} ঘণ্টার প্রতিশ্রুতির চেয়ে আপনার মানব পর্যালোচনায় দেরি হয়েছে—দুঃখিত। আমি এটি সারির সামনে এনেছি, {{eta}}-এর মধ্যে হয়ে যাবে। ক্ষতিপূরণ হিসেবে একটি বিনামূল্যে অতিরিক্ত মানব রিভিউ ক্রেডিট অথবা এই রিভিউয়ের রিফান্ড—যেকোনো একটি বেছে নিন, রিপ্লাইতে জানান।

### 5.6 Refunds, certificates, live classes, Progress Promise

**M-REF-01 — Refund eligible** (REF-01; 26 §4)
*Check/Do:* system check (≤ 7 days, < 20% consumed); eligible → finance queue; state timing honestly.
EN: Hi {{name}}, your order {{order_id}} qualifies for a refund ({{reason_code}}). I've sent it to our finance team; we decide within 3 business days and pay to your original method — usually 7–14 working days after approval. Access to {{product}} ends when the refund is processed. You can follow its status on your Orders page.
BN: হ্যালো {{name}}, আপনার অর্ডার {{order_id}} রিফান্ডের যোগ্য ({{reason_code}})। অনুরোধটি ফাইন্যান্স টিমকে পাঠিয়েছি; ৩ কার্যদিবসের মধ্যে সিদ্ধান্ত হবে এবং অনুমোদনের পর মূল পেমেন্ট মাধ্যমে সাধারণত ৭–১৪ কার্যদিবসে টাকা ফেরত যাবে। রিফান্ড সম্পন্ন হলে {{product}}-এর অ্যাক্সেস বন্ধ হবে। অর্ডার পেজে অবস্থা দেখতে পাবেন।

**M-REF-02 — Refund not eligible (with exception path)** (REF-01)
*Check/Do:* state exact rule applied (days, % consumed, credits used) — no vague refusals; offer alternatives (transfer to next batch, extension, goodwill credit if our fault); allow "ask for review" → support lead → finance exception; never argue.
EN: Hi {{name}}, I checked your request carefully. Under our policy, refunds are available within 7 days of purchase and when less than 20% is used. Your order was placed {{days}} days ago and {{percent}}% is used, so I can't approve it. {{alternative}} If something went wrong on our side that I haven't understood, please tell me more and I'll ask a senior colleague to review it.
BN: হ্যালো {{name}}, আপনার অনুরোধটি যত্নসহ দেখেছি। আমাদের নীতি অনুযায়ী কেনার ৭ দিনের মধ্যে এবং ২০%-এর কম ব্যবহার হলে রিফান্ড মেলে। আপনার অর্ডার {{days}} দিন আগের এবং {{percent}}% ব্যবহার হয়েছে, তাই অনুমোদন দিতে পারছি না। {{alternative}} আমাদের দিক থেকে কোনো সমস্যা হয়ে থাকলে যা আমি বুঝিনি, বিস্তারিত জানান—একজন সিনিয়র সহকর্মীকে পর্যালোচনা করতে বলব।

**M-REF-03 — Refund processed / ETA** (REF-02)
*Check/Do:* refund `succeeded` or `processing`; manual SSLCommerz refunds may lag; give reference.
EN: Hi {{name}}, your refund of {{amount}} was {{status}} on {{date}} (reference {{refund_ref}}). Bank/wallet timing is outside our control; it usually shows within 7–14 working days. If it hasn't arrived by {{date_plus14}}, reply with a screenshot of your statement and we'll chase the provider.
BN: হ্যালো {{name}}, আপনার {{amount}} রিফান্ড {{date}}-এ {{status}} হয়েছে (রেফারেন্স {{refund_ref}})। ব্যাংক/ওয়ালেটের সময় আমাদের হাতে নেই; সাধারণত ৭–১৪ কার্যদিবসে দেখা যায়। {{date_plus14}}-এর মধ্যে না এলে স্টেটমেন্টের স্ক্রিনশটসহ জানান, আমরা প্রোভাইডারের সঙ্গে ফলো-আপ করব।

**M-CRT-01 — Certificate name correction** (CRT-01)
*Check/Do:* certificate shows profile name at issue; allow one correction per certificate after identity check (match profile/order name); revoke old code (verification page), reissue new `/verify/[code]`; do not alter names for third parties.
EN: Hi {{name}}, we can correct the name on your certificate. Please confirm the exact spelling you want and make sure it matches your profile name (you can edit it in Settings → Profile). We'll then issue a new certificate with a new verification link and deactivate the old one. This is available once per certificate.
BN: হ্যালো {{name}}, আপনার সার্টিফিকেটের নাম আমরা সংশোধন করে দিতে পারি। কোন বানানটি চান নিশ্চিত করুন এবং সেটি যেন আপনার প্রোফাইলের নামের সঙ্গে মেলে (সেটিংস → প্রোফাইল থেকে বদলানো যায়)। এরপর নতুন যাচাই-লিংকসহ নতুন সার্টিফিকেট ইস্যু হবে এবং পুরোনোটি নিষ্ক্রিয় করা হবে। প্রতিটি সার্টিফিকেটে এটি একবার করা যায়।

**M-LIV-01 — Missed live class / recording** (LIV-01)
*Check/Do:* recording available within 2 h (18 §5.7); catch-up credit rule: watched ≥ 80% + checkpoint quiz ≥ 60% within 72 h = excused catch-up (18 §2.4); excused absence form.
EN: Hi {{name}}, no problem — the recording of {{session}} is in your batch library {{recording_status}}. If you watch at least 80% and pass the short checkpoint quiz within 72 hours, it counts as a catch-up for attendance. If you were ill or had a family emergency, log an excused absence in the app and your mentor will approve it.
BN: হ্যালো {{name}}, সমস্যা নেই—{{session}}-এর রেকর্ডিং আপনার ব্যাচ লাইব্রেরিতে আছে {{recording_status}}। ৭২ ঘণ্টার মধ্যে অন্তত ৮০% দেখে ছোট চেকপয়েন্ট কুইজ পাস করলে তা উপস্থিতির ক্যাচ-আপ হিসেবে গণ্য হবে। অসুস্থতা বা পারিবারিক জরুরি কারণে অনুপস্থিত থাকলে অ্যাপে “ছুটির আবেদন” করুন, মেন্টর অনুমোদন দেবেন।

**M-GUA-01 — Progress Promise information / claim** (GUA-01; 26 §4.3)
*Check/Do:* Mentor only; read the computed eligibility snapshot (attendance %, homework %, full mocks, window); never promise outcome; explain steps; claims are decided by Support lead + Finance in ≤ 10 business days.
EN: Hi {{name}}, the Progress Promise is part of the Mentor programme: if you meet all conditions — 80%+ attendance, all homework, at least 4 full mocks, your official test within 60 days of the course end, and your official score report uploaded — and your result is below your recorded target, you can re-enrol free for one more cycle. It isn't a cash refund. Your progress so far: attendance {{att}}%, homework {{hw}}%, full mocks {{mocks}}. To make a claim, go to Orders → Progress Promise after your result. Full terms: {{article_url}}.
BN: হ্যালো {{name}}, প্রোগ্রেস প্রমিজ মেন্টর প্রোগ্রামের অংশ: সব শর্ত পূরণ করলে—৮০%+ উপস্থিতি, সব হোমওয়ার্ক, অন্তত ৪টি ফুল মক, কোর্স শেষের ৬০ দিনের মধ্যে অফিসিয়াল পরীক্ষা এবং অফিসিয়াল স্কোর রিপোর্ট আপলোড—আপনার ফল নির্ধারিত লক্ষ্যের নিচে হলে আরও একটি চক্রে বিনামূল্যে পুনরায় ভর্তি হতে পারবেন। এটি নগদ ফেরত নয়। এখন পর্যন্ত: উপস্থিতি {{att}}%, হোমওয়ার্ক {{hw}}%, ফুল মক {{mocks}}টি। ফল পাওয়ার পর অর্ডার → প্রোগ্রেস প্রমিজ থেকে আবেদন করুন। পূর্ণ শর্ত: {{article_url}}।

### 5.7 Trust macros (not counted in the top 30)

**T-01 — Account-sharing warning (Step 1 warning, §11.2)**
EN: Hi {{name}}, our systems noticed activity on your account from {{pattern}} that doesn't look like one person studying. Accounts are personal under our Terms, and sharing can lead to limits. We've signed out other devices. If this was a mistake (for example you changed phones or travelled), reply and tell us — you can appeal any decision. This is a warning, not a penalty.
BN: হ্যালো {{name}}, আপনার অ্যাকাউন্টে {{pattern}} থেকে এমন কার্যকলাপ দেখা গেছে যা একজনের পড়াশোনার মতো মনে হয়নি। আমাদের শর্ত অনুযায়ী অ্যাকাউন্ট ব্যক্তিগত; শেয়ার করলে সীমাবদ্ধতা আসতে পারে। আমরা অন্য ডিভাইসগুলো সাইন-আউট করেছি। ভুল হয়ে থাকলে (যেমন ফোন বদলেছেন বা ভ্রমণ করেছেন) জানান—যেকোনো সিদ্ধান্তের বিরুদ্ধে আপিল করা যায়। এটি সতর্কবার্তা, শাস্তি নয়।

**T-02 — Safeguarding acknowledgement (to the reporter)**
EN: Thank you for telling us — you did the right thing. Our safeguarding lead has your report and will act on it. If anyone is in immediate danger, please call 999. We may contact you for more detail, and we'll share what we can about the outcome. You will not get in trouble for reporting.
BN: আমাদের জানানোর জন্য ধন্যবাদ—আপনি সঠিক কাজ করেছেন। আমাদের সেফগার্ডিং দায়িত্বপ্রাপ্ত ব্যক্তি আপনার রিপোর্ট পেয়েছেন এবং ব্যবস্থা নেবেন। কেউ তাৎক্ষণিক বিপদে থাকলে ৯৯৯-এ কল করুন। আরও তথ্য জানতে আমরা যোগাযোগ করতে পারি, আর ফলাফল সম্পর্কে যতটুকু পারি জানাব। রিপোর্ট করার জন্য আপনার কোনো সমস্যা হবে না।

**T-03 — Moderation action notice**
EN: Hi {{name}}, we removed your {{content_type}} because it breaks rule {{rule_code}} of our Community Guidelines ({{rule_summary}}). {{action_detail}} If you think we made a mistake, you can appeal within 30 days by replying here.
BN: হ্যালো {{name}}, আপনার {{content_type}} আমাদের কমিউনিটি গাইডলাইনের {{rule_code}} নিয়ম ({{rule_summary}}) ভঙ্গ করায় সরিয়ে দেওয়া হয়েছে। {{action_detail}} আমরা ভুল করেছি মনে হলে ৩০ দিনের মধ্যে এখানে রিপ্লাই দিয়ে আপিল করতে পারেন।

**T-04 — Enforcement appeal received**
EN: Hi {{name}}, we've received your appeal of {{action}}. A colleague who wasn't involved in the first decision will review it and reply within 3 business days. Your access stays {{status}} meanwhile.
BN: হ্যালো {{name}}, {{action}}-এর বিরুদ্ধে আপনার আপিল পেয়েছি। প্রথম সিদ্ধান্তে জড়িত ছিলেন না এমন একজন সহকর্মী ৩ কার্যদিবসের মধ্যে পর্যালোচনা করে জানাবেন। এর মধ্যে আপনার অ্যাক্সেস {{status}} থাকবে।

**T-05 — Law-enforcement / third-party data request (to the requester; never to users)**
EN: Thank you for your request. Please send it in writing to {{LEGAL_EMAIL}} on official letterhead with the legal basis and the specific records sought. Our legal team will review it; we can't disclose information through other channels.
BN: আপনার অনুরোধের জন্য ধন্যবাদ। অনুগ্রহ করে আনুষ্ঠানিক লেটারহেডে আইনি ভিত্তি ও নির্দিষ্ট তথ্যের উল্লেখসহ {{LEGAL_EMAIL}}-এ লিখিতভাবে পাঠান। আমাদের আইনি দল পর্যালোচনা করবে; অন্য কোনো মাধ্যমে তথ্য দেওয়া সম্ভব নয়।

---

## 6. Escalation matrix

| Trigger | L1 — Support executive | L2 — Support lead / specialist | L3 — Function owner | L4 — Founder / exec | Max time at each level |
|---|---|---|---|---|---|
| **Payment taken, no access** (PAY-01/02) | Re-check, TrxID, M-PAY-01/02 | **Finance** (mark-paid / provider query / refund) | Engineering on-call if a bug (webhook DLQ, reconcile) | Founder if > 8 h or ≥ 10 cases/hour | L1 30 min → L2 1 h → L3 2 h |
| **Payment outage / gateway down** | Template + status link | Support lead posts status page | Eng on-call + Finance (provider contact) | Founder (customer comms) | Immediate |
| **Exam in progress problem** (EXM-01) | M-EXM-01, check log | Support lead (void / re-issue / credit) | Eng on-call (timer, autosave bug) + Academic lead | Founder if > 20 affected attempts | L1 15 min → L2 30 min → L3 1 h |
| **Suspected wrong answer key** | Report to editor | `content_editor` (hot-fix, re-score impact preview) | Academic lead (approves re-score job, `admin`) | Founder (public correction) | L2 same day |
| **Score dispute** | Open `dispute` | Grader lead assigns; second grader if gap ≥ 1.5 bands | Academic lead (model/rubric issue → AI eval ops) | — | 48 h |
| **Human review overdue** | Reassign | Grader lead | Academic lead (capacity) | Founder (if > 10% overdue) | 4 h |
| **Refund exception** | Explain; collect facts | Support lead recommends | **Finance** decides | Founder (> BDT 10,000 `[DECIDE]`) | 3 business days |
| **Chargeback / dispute notice** | Forward immediately | Finance builds evidence pack | Founder (signs response) | — | Provider deadline minus 2 days |
| **Safeguarding concern** (TRU-02) | **Do not investigate**; acknowledge (T-02); alert DSL immediately (call/WhatsApp) | **DSL** (acts within 1 h in hours; on-call after) | Deputy DSL + Founder-1 | Counsel; authorities per 26 §9 / §13 | Immediate |
| **Threat of self-harm** | Share helpline resources; alert DSL | DSL | Founder | Emergency services via local number if imminent | Immediate |
| **Harassment of staff / learner** | Collect evidence | Moderator / Trust | Support lead → `admin` for suspension | — | 24 h |
| **Account compromise** | Force sign-out all, revoke sessions, advise reset | Trust/Eng security | `super_admin` | Founder if staff account or ≥ 5 accounts | 1 h |
| **Security vulnerability report** (SEC-01) | Forward to `security@`; no discussion | Security owner (triage in 7 d) | Founder | — | Ack 3 business days |
| **Law-enforcement request** | **Stop**; send T-05; forward to legal | Legal owner + counsel | Founder (decides disclosure) | — | Same day |
| **DSAR** | Log + verify | Privacy owner | Founder/counsel (refusals) | — | Ack 3 days; 30-day clock |
| **Media/regulator contact** | Do not respond | — | Founder | — | Immediate |
| **Leak of paid content found** | Report to Trust | Trust lead (§11.4) | Founder/counsel (legal letters) | — | 24 h |

Rules: escalate **up** when the SLA is at 80% or when the case needs a permission the current level lacks; escalate **sideways** to the owning function with a complete case summary (what was asked, what was checked, order/attempt IDs) — never "please advise". Every escalation is logged in the ticket as an internal note and, if it touches money/access, in the audit log.

---

## 7. CSAT, NPS and operational metrics

| Metric | Definition | Target | Source |
|---|---|---|---|
| **CSAT** | After `resolved`, 24 h later: "How well did we solve your problem?" 1–5 (emoji scale), optional comment, in the ticket's language; also WhatsApp quick-reply buttons. % of 4–5 among responses | **≥ 90%** (alert < 85%); response rate ≥ 20% | `csat_response` |
| **NPS** | In-app quarterly survey to paying learners 0–10 ("How likely are you to recommend {{BRAND}}?"), plus after course completion; **not shown to under-18** without Guardian-safe wording `[DECIDE]`; analytics consent gating does not apply to surveys the user answers voluntarily | ≥ 40 by month 6 `[DECIDE]` | `nps_response` (P2; field on `csat_response` until then) |
| First response time (median / p90) by tier, channel | per §4 | median < 4 h; tier targets | ticket mirror |
| SLA attainment | % tickets answered within tier target | ≥ 90% | SLA engine |
| Time to resolution | median by category | per §4.2 | |
| Reopen rate | resolved tickets reopened within 14 d | < 8% | |
| Contacts per 100 orders / per 100 active learners | demand signal | track; falling | |
| Deflection | help-article views ÷ (views + tickets) from same page/error | ≥ 70% on error-state pages | PostHog (consent) + server counters |
| Top-10 contact reasons | by category | reviewed weekly → fix product/articles | |
| Refund rate; refund-request approval rate | `refund` / orders | `02` KPI; investigate > 8% `[DECIDE]` | |
| Dispute rates | score disputes per 100 AI evaluations; chargebacks per 1,000 orders | monitor; chargeback < 0.5% `[DECIDE]` | |
| QA score | §17 | ≥ 90% | |

Close the loop: every CSAT ≤ 2 gets a lead follow-up within 1 business day; verbatims are tagged and reviewed weekly (§18).

---

## 8. Help-centre article inventory (71 articles, en/bn)

Source: CMS `/help/[article]` (F-CMS-04). Owner writes (Haiku drafts), **Support verifies against the product, native speaker verifies Bangla**, `content_editor` publishes. Each in-app error code maps to an article ID (column "Linked from"). Review cadence: quarterly or on any related change. (Closes GA-016 which asked for ~40; 71 here.)

| ID | English title | বাংলা শিরোনাম | Owner | Linked from / macro |
|---|---|---|---|---|
| **Getting started** | | | | |
| HC-001 | How {{BRAND}} works | {{BRAND}} কীভাবে কাজ করে | Support | onboarding |
| HC-002 | Which test do I need? (IELTS, GRE, PTE, DET, TOEFL) | আমার কোন পরীক্ষা দরকার? | Academic | quiz |
| HC-003 | Take the free diagnostic test | ফ্রি ডায়াগনস্টিক টেস্ট দিন | Support | `/diagnostic` |
| HC-004 | Free vs Core vs Plus vs Live vs Mentor: what's included | ফ্রি, কোর, প্লাস, লাইভ ও মেন্টর: কী কী পাবেন | Support | pricing |
| HC-005 | What the "estimated" band means | “আনুমানিক” ব্যান্ড মানে কী | Academic | results page |
| HC-006 | Using {{BRAND}} on a phone with limited data (Data-saver) | সীমিত ডেটায় মোবাইলে ব্যবহার (ডেটা-সেভার) | Support | video error |
| HC-007 | Set your exam date and study plan | পরীক্ষার তারিখ ও স্টাডি প্ল্যান ঠিক করুন | Support | `/app/plan` |
| HC-008 | Supported browsers and devices | সমর্থিত ব্রাউজার ও ডিভাইস | Eng | system check |
| **Account and sign-in** | | | | |
| HC-010 | Create an account (Google, email or phone) | অ্যাকাউন্ট খুলুন (গুগল, ইমেইল বা ফোন) | Support | sign-up |
| HC-011 | I didn't get my SMS code | এসএমএস কোড পাইনি | Support | M-ACC-01 / `AUTH_OTP_*` |
| HC-012 | I didn't get my email code or link | ইমেইল কোড বা লিংক পাইনি | Support | M-ACC-02 |
| HC-013 | I can't sign in (account recovery) | সাইন-ইন করতে পারছি না (অ্যাকাউন্ট রিকভারি) | Support | `/recover`, M-ACC-03 |
| HC-014 | I lost my phone and email access | ফোন ও ইমেইল দুটোই হারিয়েছি | Support | M-ACC-03 |
| HC-015 | Add a passkey or two-step verification (2FA) | পাসকি বা টু-স্টেপ ভেরিফিকেশন যোগ করুন | Eng | Settings → Security |
| HC-016 | Use your backup codes | ব্যাকআপ কোড ব্যবহার করুন | Support | M-ACC-04 |
| HC-017 | See and sign out your devices | আপনার ডিভাইস দেখুন ও সাইন-আউট করুন | Support | M-ACS-04 |
| HC-018 | Change your email, phone or name | ইমেইল, ফোন বা নাম বদলান | Support | Settings |
| HC-019 | Delete your account (14-day grace) | অ্যাকাউন্ট মুছুন (১৪ দিনের অপেক্ষা) | Privacy | M-ACC-05 |
| **Payments, orders and refunds** | | | | |
| HC-020 | Pay with bKash, Nagad, Rocket or card | বিকাশ, নগদ, রকেট বা কার্ডে পেমেন্ট | Finance | checkout |
| HC-021 | My payment is pending | আমার পেমেন্ট পেন্ডিং | Support | M-PAY-01 / `PAYMENT_PENDING` |
| HC-022 | Money was deducted but I have no access | টাকা কেটেছে কিন্তু অ্যাক্সেস পাইনি | Support | M-PAY-02 / `checkout/return` |
| HC-023 | My payment failed or was cancelled | আমার পেমেন্ট ব্যর্থ বা বাতিল হয়েছে | Support | M-PAY-03 |
| HC-024 | I paid twice | দুইবার পেমেন্ট করে ফেলেছি | Finance | M-PAY-04 |
| HC-025 | Why is my payment "under review"? | আমার পেমেন্ট “যাচাই চলছে” কেন? | Finance | M-PAY-05 |
| HC-026 | Download receipts and VAT invoices | রসিদ ও ভ্যাট ইনভয়েস ডাউনলোড | Finance | M-PAY-06 |
| HC-027 | Pay in USD: cards, taxes and subscriptions | ডলারে পেমেন্ট: কার্ড, ট্যাক্স ও সাবস্ক্রিপশন | Finance | M-PAY-07 |
| HC-028 | Pay in instalments (bKash) | কিস্তিতে পেমেন্ট (বিকাশ) | Finance | checkout |
| HC-029 | Refund policy in plain language | রিফান্ড নীতি সহজ ভাষায় | Finance | M-REF-01..02 |
| HC-030 | How to request a refund and how long it takes | রিফান্ড কীভাবে চাইবেন ও কত সময় লাগে | Finance | M-REF-03 |
| HC-031 | Coupons, scholarships and partner codes | কুপন, বৃত্তি ও পার্টনার কোড | Finance | checkout |
| HC-032 | Add a guardian or let a guardian pay | অভিভাবক যুক্ত করুন বা অভিভাবকের পেমেন্ট | Support | F-GUA |
| **Courses and access** | | | | |
| HC-040 | My course isn't showing after payment | পেমেন্টের পর কোর্স দেখা যাচ্ছে না | Support | M-ACS-01 |
| HC-041 | When does my access end? Renewing and extensions | অ্যাক্সেস কখন শেষ হয়? নবায়ন ও মেয়াদ বাড়ানো | Support | M-ACS-02 |
| HC-042 | Video won't play or keeps buffering | ভিডিও চলছে না বা বারবার থেমে যাচ্ছে | Eng | M-ACS-03 / `VIDEO_*` |
| HC-043 | Why there is a watermark on videos | ভিডিওতে ওয়াটারমার্ক কেন | Support | player |
| HC-044 | Device limits and account sharing | ডিভাইস সীমা ও অ্যাকাউন্ট শেয়ারিং | Trust | M-ACS-04 |
| HC-045 | Download notes and PDFs | নোট ও পিডিএফ ডাউনলোড | Support | lesson |
| HC-046 | Certificates: get, verify and correct your name | সার্টিফিকেট: নিন, যাচাই করুন, নাম সংশোধন | Support | M-CRT-01 |
| **Mock tests and exam mode** | | | | |
| HC-050 | Exam mode vs practice mode | এক্সাম মোড ও প্র্যাকটিস মোড | Academic | test start |
| HC-051 | System check before a mock test | মক টেস্টের আগে সিস্টেম চেক | Eng | `/exam` pre-check |
| HC-052 | My internet dropped during a test (what happens) | টেস্টের সময় ইন্টারনেট চলে গেলে কী হয় | Support | M-EXM-01 / `exam/connection-lost` |
| HC-053 | Use "I lost connection" to restart a section | “সংযোগ হারিয়ে গিয়েছিল” দিয়ে সেকশন আবার শুরু | Support | exam banner |
| HC-054 | Listening audio problems | লিসেনিং অডিও সমস্যা | Eng | M-EXM-02 |
| HC-055 | Timer, autosave and submission rules | টাইমার, অটোসেভ ও জমা দেওয়ার নিয়ম | Academic | exam FAQ |
| HC-056 | Extra time and accommodations | বাড়তি সময় ও বিশেষ সহায়তা | Support | M-EXM-03 |
| HC-057 | Report a wrong answer or unclear question | ভুল উত্তর বা অস্পষ্ট প্রশ্ন জানান | Academic | M-EXM-04 |
| HC-058 | Integrity notes and the honour code | ইন্টেগ্রিটি নোট ও অনার কোড | Trust | exam start |
| HC-059 | How adaptive GRE sections work | জিআরই অ্যাডাপ্টিভ সেকশন কীভাবে কাজ করে | Academic | GRE mock |
| **AI feedback and human review** | | | | |
| HC-060 | How AI scoring works and its limits | AI স্কোরিং কীভাবে কাজ করে ও এর সীমা | Academic | AI results |
| HC-061 | AI credits: how they're used and returned | AI ক্রেডিট কীভাবে খরচ ও ফেরত হয় | Support | credits UI |
| HC-062 | Request a human review | মানব পর্যালোচনা চান | Support | result page |
| HC-063 | Dispute a score | স্কোর নিয়ে আপত্তি জানান | Support | M-AIS-01 |
| HC-064 | Speaking: microphone permission and audio quality | স্পিকিং: মাইক্রোফোন অনুমতি ও অডিও মান | Eng | speaking error |
| HC-065 | How long we keep your recordings (90 days) | আপনার রেকর্ডিং কতদিন রাখি (৯০ দিন) | Privacy | speaking |
| **Live classes and mentoring** | | | | |
| HC-070 | Join a live class (Zoom) | লাইভ ক্লাসে যোগ দিন (জুম) | Live Ops | LIV |
| HC-071 | Recordings, catch-up and attendance rules | রেকর্ডিং, ক্যাচ-আপ ও উপস্থিতির নিয়ম | Live Ops | M-LIV-01 |
| HC-072 | Live class code of conduct | লাইভ ক্লাস আচরণবিধি | Trust | live |
| HC-073 | Speaking Club and women-only slots | স্পিকিং ক্লাব ও শুধু নারীদের স্লট | Live Ops | live |
| HC-074 | Mentor 1:1 sessions: booking and cancellation | মেন্টর ১:১ সেশন: বুকিং ও বাতিল | Live Ops | Mentor |
| HC-075 | The Progress Promise (Mentor) explained | প্রোগ্রেস প্রমিজ (মেন্টর) ব্যাখ্যা | Support | M-GUA-01 |
| **Privacy, safety and community** | | | | |
| HC-080 | Your privacy rights and how to use them | আপনার গোপনীয়তার অধিকার ও ব্যবহার | Privacy | M-ACC-06 |
| HC-081 | Download your data | আপনার তথ্য ডাউনলোড করুন | Privacy | Settings |
| HC-082 | Guidance for parents and guardians | অভিভাবকদের জন্য নির্দেশনা | Support | F-GUA |
| HC-083 | Report something that worries you (safety) | উদ্বেগজনক কিছু জানান (নিরাপত্তা) | Trust | Report button |
| HC-084 | Community guidelines and appeals | কমিউনিটি নিয়ম ও আপিল | Trust | T-03 |
| HC-085 | Report a leak or copyright problem | ফাঁস বা কপিরাইট সমস্যা জানান | Trust | `/legal/copyright` |
| HC-086 | Accessibility and display settings | অ্যাক্সেসিবিলিটি ও ডিসপ্লে সেটিংস | Eng | Settings |
| HC-087 | Contact support: channels, hours and response times | সাপোর্ট যোগাযোগ: মাধ্যম, সময় ও সাড়া | Support | contact |
| HC-088 | Status page: what it shows | স্ট্যাটাস পেজ কী দেখায় | Eng | status |
| **Admissions (P2a)** | | | | |
| HC-090 | What admissions support includes (and what it doesn't) | অ্যাডমিশন সহায়তায় কী আছে (এবং কী নেই) | Counsellor lead | admissions |
| HC-091 | Essay feedback: how it works and our "no ghostwriting" rule | এসে ফিডব্যাক: কীভাবে কাজ করে ও “ঘোস্টরাইটিং নয়” নিয়ম | Counsellor lead | essays |

**Total: 71 articles.** Error-code mapping table lives in `packages/core/src/support/error-articles.ts` (task NEW-SUP-18); CI fails if an app error code has no article.

---

## 9. Status page usage

- **Tool:** Better Stack Uptime status page (D3 optional; `11` §5.5) at `status.{{DOMAIN}}`, hosted on a different provider/DNS dependency from the app. **[VERIFY]** the plan's subscriber features for email/SMS.
- **Components:** Website, Sign-in & OTP, Payments (BD gateways / International), Mock tests (exam engine), AI evaluation, Video, Live classes, Email/SMS delivery.
- **When to post:** (1) any P0 affecting > 5 users or any payment/sign-in/exam component; (2) degraded performance > 15 min; (3) planned maintenance (≥ 48 h notice; never during scheduled live mock windows); (4) after resolution — a plain-language post-mortem summary within 5 working days for P0.
- **Who:** Support lead drafts, Eng on-call confirms facts, founder approves wording for payments/data incidents. Template per incident: *Investigating → Identified → Monitoring → Resolved*, each with time (Asia/Dhaka and UTC), impact, workaround, next update time. **Bilingual** (en/bn) updates; no speculation, no blame.
- **Support use:** banner on the Help Centre; auto-reply on all channels during incidents; macros `T-STATUS-*` (to add) say "known incident, no need to open a ticket, we'll update at {{time}}"; tickets created during an incident are tagged `incident:<id>` and bulk-resolved with an apology and, where entitled, bulk credits (e.g., re-issue all voided exam sections).
- **Exam integrity:** an incident affecting exam mode triggers the **bulk re-issue runbook** (admin): list affected `attempt_session`s from `attempt_event`, void and re-issue the affected sections, notify learners (§12.3).
- **Postmortem hygiene:** link from status incident to internal runbook (`11`), record in the incident register.

---

# PART B — TRUST & SAFETY

## 10. Content moderation (Q&A, reviews, community, tickets)

**Scope.** User-generated content (UGC) in: course Q&A and forum (`question_thread`, `answer`; F-COM, P2), reviews (`review`; ratings P1, text P2), the **official Facebook group/Discord** (P1, D12 C21), live-class chat (moderator in room), support-ticket attachments (essays/photos), admissions workspace text (private; reviewed only under integrity audit, 21). The public rules are the Community Guidelines (26 §8); this section is the operating procedure. **[LEGAL]** intermediary duties and timelines (26 L-24).

### 10.1 Rule codes (what is removed)

| Code | Rule | Default action | Severity |
|---|---|---|---|
| R01 | Harassment, bullying, hate, threats | Remove + warn; threats → S1 | S1–S2 |
| R02 | Sexual or graphic content; any sexual content involving or addressed to minors | Remove; minors → **S0 safeguarding** (§13) | S0 / S2 |
| R03 | Self-harm / suicide content or disclosure | Do **not** remove silently; contact per §13.4; hide from public if graphic | S0 |
| R04 | Doxxing / personal data (phones, addresses, IDs, transaction IDs) | Remove immediately; warn | S1 |
| R05 | Leaked exam content, answer keys, paid content, "mock dumps" | Remove; enforcement ladder (§11.2); leak runbook (§11.4) | S1 |
| R06 | Cheating services, ghostwriting offers, fake certificates/scorecards | Remove; ban on repeat; report if forgery | S1 |
| R07 | Spam, ads, referral links, account trading | Remove; mute 7 days on repeat | S3 |
| R08 | Fake/incentivised/retaliatory reviews; review swaps | Hide; strip rating; ladder (§11.8) | S2 |
| R09 | Impersonation of staff/brands; false "official" claims | Remove; suspend | S2 |
| R10 | Off-topic / low-quality / duplicates | Soft: move/close; no strike | S3 |
| R11 | Medical, legal, visa advice presented as authoritative; guaranteed-score claims | Remove/correct | S3 |
| R12 | Illegal content (incitement, copyright piracy hosting, threats of violence) | Remove; preserve evidence; escalate to legal | S1 |

**Severity classes and SLAs:** **S0** safeguarding/imminent harm — review immediately, ack 1 h in support hours (on-call after); **S1** serious — 24 h; **S2** — 72 h; **S3** — 5 days. Auto-flagged and reported items are triaged by severity first, then age.

### 10.2 Pipeline and queue
1. **Intake:** user "Report" (reason + detail; deduped per reporter/target by `report_dedupe_uq`), auto-flag (profanity/links/PII/phone patterns in **English, Bangla and Banglish**; image NSFW check if images are ever allowed — not in P1), moderator patrol, ticket category TRU-01, group admins' escalations.
2. **Case creation:** reports on the same target aggregate into one `moderation_case` (§19) with a **content snapshot** (so evidence survives deletion), rule code, severity, report count.
3. **Review:** moderator (a `support` user with `moderation:decide`; `content_editor`/`admin` for editorial items; instructors may only *report* in their courses; they never moderate learners) picks from the queue ordered by severity then age. Decision options: dismiss, hide (reversible), remove, warn, mute (1/7/30 days), suspend/ban (needs `admin`), escalate to safeguarding or legal.
4. **Notify:** user gets macro T-03 with rule + appeal route; reporter gets "thanks, action taken/no action" (no details about the other party).
5. **Appeal:** within 30 days; a different moderator/lead decides within 3 business days; outcomes `appeal_upheld`/`appeal_rejected` (restore content if upheld).
6. **Record:** audit log entry for every hide/remove/ban with reason; `enforcement_action` row for warn/limit/suspend/terminate (§19).

### 10.3 Operating rules
- **Language coverage:** at least two moderators fluent in Bangla and Banglish; maintain a living slur/keyword list per language (reviewed monthly; false-positive log); never auto-ban on keywords — auto-hide pending review at most.
- **P1 reality:** Facebook group/Discord are the only community spaces: 2 admins + 3 volunteer moderators with written rules, a moderation rota covering 09:00–23:00, pinned rules post, "no support in comments" (redirect to Help Centre), members under 18 must have Guardian consent for Discord invitations `[DECIDE]`; no direct-message outreach by staff to minors.
- **Minors:** never publish a minor's full name, photo, school or location; staff do not DM minors; any adult requesting private contact with a minor in a space we run is an S0 case.
- **Ticket attachments** (screenshots, essays, TRFs, accommodation letters): access limited to the assigned agent and leads; never reposted; deleted per retention (24 months for tickets, sooner for ID-like documents); no AV-clean attachment opens until scanned (GA-037).
- **Instructor conduct:** instructors answering Q&A must follow the same guidelines; a complaint about an instructor goes to Ops lead (not the instructor's course moderator).
- **Transparency:** monthly internal moderation report (counts by rule, time-to-action, appeals overturned %); publish a short annual transparency note with the law-enforcement counts (§14) `[DECIDE]`.
- **Moderator wellbeing:** content-exposure rotation, no solo S0 handling, access to a trusted contact; reporting lines.

## 11. Abuse and fraud

### 11.1 Account-sharing and abuse detection signals

> **[LEGAL]** L-17 (26): device/session signals need a documented legitimate-interest assessment and privacy-notice coverage. Signals are **inputs to review, not verdicts**. BD context: shared family devices, internet cafés, and mobile-carrier CGNAT (many users share one public IP) produce false positives; weight IP weakly.

| Signal | Source | Default threshold (tune) | Weight |
|---|---|---|---|
| Concurrent playback sessions above limit (2) | `playback_session` (10 §8) | > 2 for ≥ 3 distinct days in 14 | 25 |
| Distinct `device_id`s | session/device records | > 4 new devices in 7 days (excluding re-installs on the same UA family) | 15 |
| Impossible travel / two countries within 24 h (billing country vs logins) | session geo (coarse) | ≥ 2 countries ≥ 1,000 km apart within 6 h, not via VPN-known ASN | 20 |
| Ping-pong sessions (exam `session_superseded` flip-flop between devices) | `attempt_event` | ≥ 3 in an attempt or ≥ 6 in 7 days | 20 |
| Watch-time anomaly | playback logs | > 20 h/day video for 3 consecutive days | 20 |
| Watermark tamper events | `video_watermark_tamper` | ≥ 2 in 7 days | 30 |
| Same payment wallet/card used by many accounts | `payment` | ≥ 4 accounts / 30 days (excluding Guardian-pays-for-sibling) | 15 |
| Many accounts, one device (credit farming) | `device_id` + sign-ups | ≥ 3 new accounts / device / 30 days | 25 |
| Sudden bulk content access (scraping) | request logs / rate-limit hits | ≥ N lesson/asset requests per minute beyond human rates, or enumerating IDs | 40 (and immediate rate-limit) |
| Leak match | watermark session code traced from a leaked copy (§11.4) | any confirmed | 100 |
| Referral/coupon anomalies | `coupon_redemption` | see §11.3 | — |

**Score bands:** Green < 40: nothing. **Yellow 40–69:** product nudge only (M-ACS-04, no accusation). **Orange 70–89:** human review within 2 business days, T-01 warning, sign out other sessions, require OTP re-auth. **Red ≥ 90 or confirmed leak:** human review within 1 business day, suspension of streaming/downloads pending response (never lock exam attempts mid-attempt), ask the user to respond. **Two independent signal families** are required before any sanction beyond a nudge; a human always decides.

### 11.2 Enforcement ladder and appeals (referenced by 26 §6)

| Step | Action | Typical triggers | Duration / expiry | Notice |
|---|---|---|---|---|
| **0 Nudge** | In-product notice, sign out extra sessions | Yellow band | none | M-ACS-04 |
| **1 Warning** | Documented warning in `enforcement_action` | First credible sharing; first R05/R07 content; first minor integrity breach | Expires after **12 months** clean | T-01 / T-03 |
| **2 Limit** | Reduce concurrent sessions to 1, disable downloads, mute in community, hold AI credits at current level, or restrict a feature | Repeat after warning; confirmed sharing | 7–30 days | email + in-app reason |
| **3 Suspend** | Block sign-in (or streaming only) | Repeated/serious breach; coordinated sharing; harassment; leak by the account | 7 / 30 / indefinite pending review; exam attempts in progress may finish | email with reason, appeal route |
| **4 Terminate** | Account closed, entitlements revoked, refunds withheld for serious breach (26 §4 A6) | Publishing paid content at scale, resale, fraud, chargeback abuse, safeguarding harm, credible threats | permanent | email, evidence summary, appeal |

Skip rules: safeguarding harm, threats, fraud and mass leaks may start at step 3–4 (approved by `admin`; two-person review for terminations). **Who may apply:** step 0–2: `support` (with reason); step 3: `support` lead + `admin` confirmation; step 4: `admin` (four-eyes: second admin or `super_admin`). **Appeals:** 30 days via reply/`TRU-05`; decided by someone not involved within 3 business days; if overturned, restore access and **extend the entitlement by the suspended days**; log outcome. Warnings never block refunds for unrelated products. Enforcement history is kept 3 years after expiry (evidence/dispute defence) and exported in DSAR except internal fraud notes (09 §13.9).

### 11.3 Coupon, referral and free-credit abuse
- **Controls:** one coupon redemption per user/phone/device per campaign; referral reward is **held for 14 days** (until the referee's refund window passes) and revoked on refund; self-referral detection (same device, same payment wallet, same IP + near-identical sign-up time); free AI credits (2 at sign-up + 1/month, D12 C1) limited per verified phone **and** device; disposable-email blocklist; Turnstile on sign-up; SMS-pumping protections on OTP (country allow-list, per-number caps — `09`).
- **Signals:** > 3 accounts per device/payment wallet; coupon redeemed then refunded repeatedly; referral clusters with common IP and wallet.
- **Response:** void the reward, merge or close duplicate accounts (keep the oldest paying account), warn (step 1); organised farming → step 3–4; coupon codes leaked to deal sites → expire and re-issue limited codes.

### 11.4 Leak response runbook (paid content on Telegram/Facebook/WhatsApp) and outbound takedown

1. **Detect:** user/instructor reports (`TRU-03`), social monitoring (weekly search of key titles + brand in Telegram/Facebook groups; Google alerts), watermark tamper spikes.
2. **Triage (≤ 24 h):** what was leaked (video lesson, PDF, mock form, answer key, live recording), how many assets, public reach (members), commercial impact.
3. **Trace:** videos carry the visible watermark `masked email/phone · session code` (10 §8.7) → look up the code in `playback_session` → account(s), device, IP hash, time. Exam/review pages carry `masked identifier · attemptId[0:8] · date` (07 §9.3). PDFs carry the footer. Record the chain of reasoning. If the watermark is cropped or tampered, check devices of accounts with tamper events in the window.
4. **Preserve evidence:** screenshots with URL and timestamp, downloaded copy hash, archived page, group/channel IDs; store in the evidence bucket (retention 3 years; `09` §13.7); chain-of-custody note.
5. **Account action:** apply the ladder (leak by the account = step 3 immediately; confirmed commercial reselling = step 4); preserve the user's right to respond.
6. **Takedown (outbound):** (a) platform report using the platform's copyright/IP form **[VERIFY: current Telegram abuse/DMCA address and Meta IP-report form]** with proof of ownership (the Copyright Complaint template in 26 §15 in reverse); (b) request removal from search engines; (c) for repeat/organised operators, a lawyer's cease-and-desist; (d) consider local reporting channels (cyber-crime/BTRC) with counsel **[LEGAL][U]** L-34. Timeline: first platform report within 48 h of confirmation.
7. **Contain:** retire or replace leaked mock forms and rotate exposed items (`item_exposure` caps, 07 §9.3); re-generate form order; rotate watermark codes; shorten token TTLs for the affected asset; add a notice to the community that sharing leads to action (not naming users).
8. **Escalate technically:** ≥ **3 confirmed leaks of premium lessons within 60 days** traced via watermark → evaluate Bunny Enterprise DRM (10 §8 trigger).
9. **Close:** postmortem note, update detection thresholds, count in monthly metrics (leaks confirmed, takedowns requested, taken down within 7 days).

### 11.5 Refund abuse
- **Policy backbone:** 7 days + < 20% consumed (D5) already blocks consume-then-refund; AI credits consumed are never refunded; mocks started count as used.
- **Signals:** ≥ 2 refunds by the same user/phone/device/wallet in 12 months; refund requested after downloading all PDFs or starting many mocks; chargeback after a rejected refund; refund immediately after the free-credit window; exam-day purchase then refund.
- **Rules:** a second refund within 12 months goes to manual review by finance (not auto-approved); a third requires lead + finance approval and may be declined; refund-and-keep patterns (entitlement not revoked due to bug) are alerts for engineering.
- **Never** use automated blocking on refunds — finance decides with evidence; document the reason on the refund row.

### 11.6 Chargebacks and disputes (SSLCommerz / Paddle / bKash / Nagad)
| Case | Handling |
|---|---|
| **BD wallets (bKash/Nagad/Rocket)** | No card-style chargeback (10 §7.5). Disputes come as support tickets or provider-initiated reversals; finance handles with the wallet provider; evidence = payment record + access logs. |
| **Cards via SSLCommerz** | Issuer disputes arrive via SSLCommerz/acquirer; the response window and evidence format are set by them **[VERIFY]**. Treat any notice as P0 for finance. |
| **International via Paddle (merchant of record)** | Paddle manages the dispute with the card network and may ask us for evidence; `adjustment` webhook of type chargeback arrives (10 §7.5) **[VERIFY window and process]**. |
| **Immediate system effect** | Entitlements linked to the payment revoked with `revoke_reason='chargeback'`; user flagged `risk_flag`; `dispute(kind=payment_card)` opened; if won, reinstate (original dates, `source='reinstated'`); if lost, credit note. |
| **Evidence pack (auto-built, `evidence_pack_r2_key`)** | Order/payment records and gateway IDs; billing country/IP-hash/device-hash at purchase; consent records — **Terms and Refund Policy version accepted** (and EU/UK waiver if applicable); delivery proof — entitlement grant time, sign-ins after purchase, % progress, mocks started, AI credits consumed, video playback sessions with watermark codes, certificates issued; communications (tickets, refund denial, our offers); the policy pages as shown (snapshot of `policy_version`); descriptor/receipt sent. |
| **SLA** | Evidence assembled ≤ 2 business days after notice; **never miss the provider's deadline** (calendar the due date; `evidence_due_at`); founder signs submissions. |
| **Prevention** | Clear billing descriptor ("{{BRAND}}"), instant receipts, a one-click refund request, fast refund decisions (3 business days), proactive replies to payment-pending contacts, 3-D Secure where available. |
| **Repeat chargebackers** | Step 4 after two lost disputes, or on confirmed friendly fraud with consumption evidence. |

### 11.7 Payment fraud and abuse controls (checkout)
Velocity limits per IP/user/card on `/checkout` (card-testing), Turnstile, `risk_level=1` → hold (F-PAY-11), amount/currency re-verification (10), block disposable emails and high-risk BIN patterns via provider settings, one-time access links never posted publicly, fraud review queue for finance (`risk_hold`, `held_review`). Rules table and queue UI are tasks NEW-SUP-15 (GA-025).

### 11.8 Fake reviews policy
- **Who can review:** learners with ≥ 20% progress or a completed test pack (F-REV-01), shown with "verified learner". Instructors and staff cannot review their own courses; affiliates/partners must disclose.
- **Prohibited:** fake, paid, swapped, or incentive-conditioned reviews ("review for a coupon" only if the incentive is not conditional on rating and is disclosed); coaching of ratings; review-gating (asking only happy learners); retaliatory 1-star campaigns; copy-pasted reviews.
- **Detection:** bursts (> N reviews/hour/course), same device/IP/wallet clusters, text similarity, reviews from accounts with no progress, rating spikes after campaigns.
- **Response:** hide/strip rating (R08), warn or step 2; instructors who manipulate lose their reply rights; staff who post fake reviews are disciplined.
- **Legal:** consumer-protection rules on fake reviews are tightening (US FTC rule on fake reviews; UK DMCC Act 2024) **[VERIFY][LEGAL]**; the same principles apply in BD consumer law **[U]**.

---

## 12. Assessment-integrity operations

### 12.1 Score-dispute workflow (human re-grade) — closes GA-054 operationally

**Scope:** disputes about **AI-estimated Writing/Speaking/AWA bands** (kinds: `dispute.kind='score'`). Different routes: answer-key/question errors → `EXM-04`/F-ERR (editors, re-score tool); "I submitted on time" → §12.3; accommodation → §12.3.

| Step | Detail | Owner | Clock |
|---|---|---|---|
| 1. Entry | Learner clicks **Dispute this score** on the result (preferred; creates `dispute`), or tells Support (agent creates it from the console). Learner states why (optional) | learner / support | — |
| 2. Eligibility | Result ≤ **30 days** old (Writing) / ≤ **45 days** (Speaking, so audio still exists under the 90-day rule; D12 C6 extends audio retention while a dispute is open); one open dispute per response; no new essay submitted as a "dispute" | system | instant |
| 3. Credits | First dispute each calendar month is **free** (09 §10.4) **[DECIDE]** L-14; further disputes consume one human-review credit, **returned automatically if the human band differs from the AI overall by ≥ 1.0**; credits may not be used on Low-confidence results that already route to human review (those are free) | system | |
| 4. Ack | Auto-ack with reference and SLA; macro M-AIS-01 | system/support | immediate |
| 5. Assignment | Routed to the grader queue as `evaluation_request.mode='human'` with `priority` 5 (or 2 if priority-purchased); **not** the original human reviewer, **not** the learner's own instructor; the grader sees redacted response, AI result, rubric; sees no email/phone; audio time-boxed | grader lead | assign within 8 h |
| 6. Review | Grader scores independently (blind to learner's argument where possible), may keep or change the band; **written rationale required** (stored, audited) | grader | 48 h from request (24 h priority) |
| 7. Second review | Auto if |human − AI overall| ≥ **1.5 bands**, or if the learner appeals once; lead grader decides; large gaps feed AI-eval ops as a model issue (GA-006 loop) and, with the learner's consent, the gold-set candidate pool | grader lead | 24 h |
| 8. Decision | Outcome `upheld` (band changed), `partially_upheld` (criterion changes only), `rejected` (band stands, with reasons); learner sees final band + "Reviewed by a {{BRAND}} examiner-trained grader" + a short reason | system | |
| 9. Effects | Final band replaces the displayed estimate; dashboards, predicted score, study-plan and mock overall are recomputed; streak/XP unchanged; certificates of completion unaffected (they depend on progress, not estimates); `evaluation_result.is_final` flips to the human result | system | |
| 10. Close | CSAT; `dispute` closed; appeal once to the Academic lead (rare), final | support | 3 business days |

**Bounds on repeat disputes:** max **3 disputes per 30 days per user**; an identical, unchanged response cannot be disputed twice; accounts with ≥ 5 disputes/90 days where the human band equals the AI band each time are reviewed for credit-farming (step 0–1). **Escalation of quality signals:** dispute-overturn rate by task type is a weekly KPI; > 25% overturned or a systematic direction (always higher/lower) opens an AI-eval ops investigation (`31` NEW).

### 12.2 Exam disruption (D12 GA-007) — policy and support actions

| Situation | Rule | Action | Limits / audit |
|---|---|---|---|
| **Practice mode**, connection lost | System **pauses** on heartbeat loss; resume shifts deadline by the paused time (07 §5.6) | None needed; explain in HC-052 | — |
| **Exam mode**, short blip (< 2 min), answers autosaved | Continue; the 30 s grace applies (D6) | None | — |
| **Exam mode**, section interrupted > 2 min | **Self-serve "I lost connection":** void that section instance and re-issue once per attempt (new timer); logged in `attempt_event`; rate-limited | Learner does it; Support explains | Once per attempt |
| Already used the free restart / support-confirmed gap | Support grants a **replacement mock credit** (`credit_mock`) or a fresh attempt (`grant_resit`); never edits answers or scores | Support (reason ≥ 15 chars; log) | **2 per user per 90 days** [DECIDE]; 3rd needs lead approval; fraud pattern → review |
| Audio stalled (Listening) | Audio-stall credit per 07 §5.7 automatically; if repeated or not applied → support re-issues Listening section | Support | Same limits |
| Our outage (status-page incident) | All affected attempts voided/re-issued in bulk by `admin`; learners notified; no consumption of mock allowance | Admin bulk job | Audit; post-incident report |
| Load-shedding / power cut at learner's end | Treated like connection loss (first occurrence generous; no proof required) | As above | Pattern > 3 in 30 days → advise Practice mode/stable setup |
| "I submitted on time" dispute (EXM-05) | Server log decides (`attempt_event`/seq; saves ≤ `ends_at` + 30 s are accepted — D6); if server shows accepted saves, explain; if it shows our fault (outage or error), void/re-issue | Support lead | Evidence attached to ticket |

**Permission alignment (D12 C30 resolves this):** `voidSection`/`voidAttempt` are **self-serve once per attempt** under the GA-007 rule (connection loss > 2 min, exam mode); every other void is performed by `support`/`admin` and is always audited (reason ≥ 15 chars, four-eyes beyond the caps in §12). Add `attempt:grant_resit`, `attempt:credit_mock` and a limited `attempt:void` to `support` (limits enforced in the service: reason, count caps, audit); `06` must be edited to match (task P0-53). Implemented by task P1-64 (12 Appendix C: NEW-SUP-08).

### 12.3 Accommodations (D12 C18)
- **P1:** support-granted multiplier **1.25× / 1.5× / 2.0×** on documented request; stored as `accommodation_multiplier` with `reason`, `granted_by`, `evidence_ref`, `expires_at` (default: 12 months, renewable). Applied to all timed sections server-side (07 §5.8). 06's `grantAccommodation` (`extraSeconds ≤ 3600`) is an *additional* per-attempt tool — unify so the multiplier is the policy and `extra_seconds` the mechanism (GA-007 notes mismatched ranges in 03/06/07; resolve: 03/D12 set {1.25, 1.5, 2.0}).
- **Evidence accepted:** doctor/psychologist/educational-psychologist letter; school or university disability-services letter; prior official-test accommodation approval; for temporary injury, a short medical note. We ask only for what is needed; learners can redact unrelated details. **Never** stored in the ticket body — uploaded to a private R2 bucket (`evidence_ref`), viewable by `support` lead and `admin` only; deleted 12 months after expiry or on request. **[LEGAL]** health data classification (26 L-32).
- **Decision:** Support lead approves within 2 business days; borderline cases may be granted a temporary 1.25× pending evidence (max 14 days) `[DECIDE]`. Minors: via Guardian. Orgs: `org_admin` may request for their learners with the org's own documentation.
- **P2:** self-serve request form (F-MOCK-09). Practice mode already allows pause/timer off.
- **Not** an official-test accommodation — the Help Centre explains how to apply to the actual test centre.

### 12.4 Grader programme (closes GA-024) — operations
| Item | Standard |
|---|---|
| **Pool sizing model** | Demand/day = (Plus/Live/Mentor human reviews included ÷ their access period) + paid add-on reviews + disputes (≈ 2–4% of AI evaluations) + auto-routed Low-confidence results (7 §7.8). Capacity/day = graders × min(20 reviews, 4 productive hours at ~12 min/review). Launch with **2 active + 1 reserve**; add one grader per 40 reviews/day sustained or whenever > 10% of reviews are within 6 h of SLA breach (alert thresholds from 07 §7.10). Illustrative: 600 paid learners, 30% on tiers with 2–6 reviews → ~8–15 reviews/day + disputes → 2 graders suffice at launch. |
| **Recruitment pipeline** | Sources: IELTS-trained teachers, former examiners (verify), university English faculty, GRE verbal/AWA instructors; screening CV + sample marking exercise → qualification test (30 scripts vs adjudicated gold) → interview → contract (26 §11) → rubric training (6 h) → probation. |
| **Qualification/probation** | Pass if QWK ≥ **0.80** vs gold on the qualification set; 2-week probation with 100% double marking, then 5% double-marking and 2% monthly audit (07 §7.9 numbers **[VERIFY]**); two failed calibrations → suspension; yearly recalibration. |
| **Workload caps** | ≤ 25 reviews/day and ≤ 4 h continuous; mandatory 15-min break; no more than 6 days/week; quality drops after ~15 reviews/day are monitored; availability calendar; no-show: unassigned > 12 h alert, auto-reassign. |
| **Pay** | Per-review rate card set by finance (07 §7.8 estimates **$1–2 per essay**, speaking higher); paid monthly via manual payout (D12 C19); withholding tax per accountant; SLA-miss deductions only as written in the rate card; QA bonus optional. |
| **Conflicts** | Graders who are also instructors recuse from their own learners/courses; no grading friends/relatives (declare); no outside tutoring of learners they grade. |
| **Confidentiality & access** | Redacted data only; 2FA; time-boxed audio; no copying; no external AI tools on learner data (26 §11); access revoked same day on exit; staff offboarding checklist. |
| **Quality dashboard** | Owner: **Academic lead** (a `content_editor`/`admin`); metrics: QWK vs gold, agreement with second graders, overturn rate in disputes, time per review, SLA breaches, learner CSAT on reviews. |
| **SLA breach comp** | See §4.3 (learner credit/refund choice). |

---

## 13. Safeguarding incident process (minors)

> **[LEGAL]** statutory reporting duties and vetting rules in Bangladesh (26 L-25; e.g., Children Act 2013 `[VERIFY][U]`). Until counsel confirms, follow this process and treat any credible risk of harm to a child as reportable to the authorities. Source rules: `18` §5.8, 26 §9.

### 13.1 Roles
- **Designated Safeguarding Lead (DSL):** named senior person (Founder-2 or Ops lead; trained); **Deputy DSL** (second founder). Contact: `safeguarding@{{DOMAIN}}` + an on-call phone.
- **Live Ops lead / TAs:** first responders in sessions (remove, preserve, report) — they do not investigate.
- **Support:** receive reports via any channel and hand off immediately; never investigate or promise confidentiality.
- **Founders:** decide on suspensions, external reporting with counsel, communications.
- **Counsel:** advises within 24 h on reporting.

### 13.2 Classification
| Level | Description | Examples | Response |
|---|---|---|---|
| **L1 Concern** | Low-level worry, no harm evident | Staff dress/tone comment, minor boundary slip | Log; DSL reviews within 24 h; coaching |
| **L2 Allegation / pattern** | Credible report of inappropriate behaviour | Adult asks a minor for private contact; grooming-style messages; harassment of a minor by peers | DSL acts same day: restrict contact, preserve evidence, suspend staff access pending review, inform Guardian as appropriate |
| **L3 Imminent / serious harm** | Risk of immediate harm; disclosure of abuse; self-harm intent; sexual content involving a minor | Learner says they're being hurt; explicit imagery; threat to harm | **Immediate:** secure the child's safety (emergency services 999), remove the adult from contact, preserve evidence, DSL + Founder + counsel within 1 h, report to authorities per advice |

### 13.3 Process (first 24 hours)
1. **Receive** (in-room Report, `safeguarding@`, TRU-02 ticket, staff observation). Acknowledge with T-02. Support never forwards via casual chat — use the safeguarding form/phone to the DSL.
2. **Immediate action (within 1 h in hours; on-call after for L3):** remove the person at risk from further contact with the alleged person; for staff — suspend access (revoke sessions, remove from classes, preserve device logs); for learner-to-learner — mute/remove from the room; for live — TA ends breakout/room if needed.
3. **Preserve evidence:** screenshots, chat exports, `report`/`moderation_case` snapshot, Zoom recording (restrict access; do not copy), attendance logs, audit log; do not alter or delete; set a legal hold.
4. **Assess** (DSL, same day): classify L1–L3, decide notifications.
5. **Notify:** Guardian(s) of the affected minor — unless doing so increases risk; the reporter (T-02 outcome note, limited); founders; counsel; **authorities** where required/advised (police, child-protection/welfare helplines **[VERIFY: national child helpline and police cyber unit numbers/channels]**); platform (Zoom) if needed; payment/legal not applicable.
6. **Investigate** (DSL + HR/ops, with counsel): interview with two adults present; seek statements; do not confront the alleged person in a way that tampers with evidence or endangers the child; decide outcome: no case / coaching / formal warning / termination / referral.
7. **Support the child and family:** offer a point of contact, signpost counselling resources, ensure no retaliation.
8. **Close and learn:** record outcome in the **safeguarding register** (restricted; separate from tickets); post-incident review within 5 days; update training/process; tabletop each quarter and at launch.
9. **Records and retention:** restricted access (DSL, founders, counsel); retention proposal: 7 years after the child turns 18 for substantiated cases, 2 years otherwise `[LEGAL]` (26 L-25).

### 13.4 Disclosures of self-harm or abuse (any age) in tickets, chats or sessions
Stay calm and kind; do not diagnose or promise secrecy; thank them; share emergency contacts (999 in emergencies; local emotional-support and child-helpline resources **[VERIFY]**); alert the DSL immediately; log factually (quote, time); the DSL decides on Guardian contact and reporting. Never leave the person alone in a live session without a TA/second adult.

### 13.5 Prevention controls (verify in the product)
- Guardian consent before live enrolment for under-18s; classes with minors on Zoom only; waiting room; first name + initial; no private chat; no DMs between staff and minors; TA present; mentor 1:1 sessions recorded by default and visible to the Guardian (30 days).
- Staff vetting: ID, background check, police clearance **[VERIFY]**, signed code of conduct, safeguarding training before any minor-containing batch (18 §4.2); staff 2FA; audit of staff access to minors' records; annual retraining.
- WhatsApp groups with minors: avoid (phone numbers exposed); use in-app batch space (18 §6) or announcement-only channels.

---

## 14. Law-enforcement and third-party data requests

> **[LEGAL]** L-19 (26). Counsel must pre-approve this SOP and name an on-call lawyer.

1. **Single door:** all requests go to `legal@{{DOMAIN}}` (support replies T-05 and forwards; support never discloses). Only the **Legal owner (Founder-1) + counsel** may approve disclosure.
2. **Verify:** requester identity and authority (official email domain + call-back to a published office number; reject personal emails/WhatsApp), jurisdiction (Bangladesh authorities with lawful process; foreign requests require a recognised legal route — e.g., mutual legal assistance — otherwise refuse unless an emergency exception applies) `[LEGAL][U]`.
3. **Scope check:** legal basis cited, narrowly specified accounts/dates/data; reject fishing; data minimisation — disclose the minimum.
4. **Emergency disclosure:** if imminent risk to life/child (police request with credible urgency or our own safeguarding duty), the DSL/Founder may disclose limited data immediately and document within 24 h.
5. **Notify the user** unless prohibited by the order or it would risk harm/evidence; if prohibited, record and notify when the prohibition lifts.
6. **Process:** log in the Request Register (date, requester, basis, scope, decision, data disclosed, who approved); export via a controlled job (audit `data.export` with `reason='legal_request'`); secure transfer; keep a copy 7 years `[LEGAL]`.
7. **Payment providers/regulators:** SSLCommerz, bKash, Paddle and the NDGA may ask for information related to disputes/compliance; same intake and counsel review.
8. **Transparency:** annual count of requests received/complied with, published without personal details `[DECIDE]`.
9. **Do not:** disclose over phone/WhatsApp, to the press, or to private investigators; hand over essay text/audio/minors' data without counsel sign-off; delete data to evade a request (legal hold overrides retention jobs).

---

## 15. Data-subject request (DSAR) handling SOP

Statutory timelines: GDPR/UK GDPR **1 month** (extendable by 2 months for complexity); PDPO period unconfirmed `[LEGAL]` L-21 → internal **acknowledge ≤ 3 business days; complete ≤ 30 days** (09 §13.9). Request kinds: access/export, deletion (erasure), rectification, restriction, objection, consent withdrawal, portability, Guardian-initiated for a minor, complaints.

| Request | Intake | Verification | System action | Notes / limits | Owner |
|---|---|---|---|---|---|
| **Export** | Settings → Privacy (requires recent re-auth ≤ 10 min) or `privacy@` / TRU ticket | In-app = authenticated; email = link to the registered address; ID docs only if real doubt | Create `data_subject_request(kind='export')` → Inngest job compiles JSON+CSV from the PII registry (`pii_registry.ts`), **plus helpdesk conversations via the Chatwoot connector (I9)** | Link valid **7 days** after re-auth (F-ACC-05; conflict with 09's 24 h — 26 X3); excludes other people's data and internal fraud notes; audio via presigned links (24 h); audit `data.export.run` | Privacy owner |
| **Deletion** | Settings → Privacy → Delete (re-auth + typed confirmation) | As above | `kind='delete'`, status `cooling_off`, `execute_after = now + 14 days` (D12 C7); reminders at T+1 and T−1 days; user can cancel by signing in; then `privacy.erase` hourly job | **Blocks:** open refund/dispute (wait), active org seat (release), active subscription (cancel first), instructor with unpaid royalties (finance review). **Retain:** order/payment/refund/invoice/ledger/audit/consent (tombstone user), safeguarding records, evidence under legal hold. **Instruct processors:** PostHog delete person, Sentry purge, Resend suppression keeps hash only, AI providers if applicable, **Chatwoot contacts/conversations delete/anonymise**, WhatsApp/Meta contact removal where possible | Privacy owner + Eng |
| **Guardian-initiated** | Guardian dashboard or `privacy@` | Verify Guardian link and relationship (`guardian_link` granted) | Same as above for the minor | Guardian cannot see withheld items (essays etc.) unless shared — but may request deletion/export under law `[LEGAL]` | Privacy owner |
| **Rectification** | Settings (self-serve) or ticket | Authenticated | Update profile; certificate name correction via M-CRT-01 | Cannot rectify historic scores or invoices — annotate | Support |
| **Objection / restriction** | Ticket | Authenticated | Stop analytics/marketing immediately; for legitimate-interest security processing assess and respond within 30 days | | Privacy owner |
| **Consent withdrawal** | Settings (self-serve) | — | Append `consent_record(granted=false)`; stop processing immediately (marketing/analytics/AI calibration) | Marketing withdrawal is immediate | System |
| **Complaints about our handling** | `privacy@` | — | Respond with reasons + regulator route (NDGA `[VERIFY]`, ICO for UK) | | Founder |

**Refusal/extension grounds:** unfounded/excessive (rare), identity not verified, legal retention, rights of others. Always tell the requester in writing with reasons and complaint route. **Logging:** every request has `data_subject_request` row, ticket (PRV-01), SLA clock, and audit entries; **quarterly synthetic-user test** (export + delete end-to-end including Chatwoot) with timing (09 §13.9 step 6).

---

## 16. Support-agent permissions (D4: masked PII)

Role `support` (additive; staff 2FA mandatory, session 12 h). Permission strings are added to `packages/auth/src/permissions.ts`; the policy layer additionally reads `support_level` (`l1`/`l2`/`lead`, stored on `user_profile`) — **[DECIDE]** instead of creating new roles (D4 forbids ad-hoc roles; extra levels are policy attributes).

| Capability | L1 | L2 | Lead | Notes |
|---|---|---|---|---|
| Search users/orders by masked identifiers (F-SUP-01) | ✔ | ✔ | ✔ | e.g., `01******789`; email `a***n@gmail.com` |
| **Reveal** full email/phone (reason required, audited) | ✔ (rate-limit 20/day) | ✔ | ✔ | alert to lead if > 10/day or non-case reveals; no bulk reveal |
| View orders, payment status, entitlements, AI-credit ledger, attempt timeline (events, not answers) | ✔ | ✔ | ✔ | |
| Resend receipt; trigger payment re-check | ✔ | ✔ | ✔ | |
| Extend access (≤ 7 days per grant; **cumulative cap 14 days/90 days** [DECIDE]) | ✔ | ✔ | ✔ (beyond cap with finance note) | reason required (DB CHECK enforces ≤ 7 d, 05) |
| Read-only impersonation ("view as user") | — | ✔ | ✔ | reason ≥ 15 chars; banner; mutating actions blocked server-side; auto-end **15 min** (F-SUP-03) vs **30 min** in 06 — reconcile to 15 |
| Grant AI credit (`admin_grant`) | ≤ 2/case | ≤ 3/case | ≤ 10/user/90 days | beyond → `admin` |
| Void/re-issue exam section; `credit_mock`; `grant_resit` | — | within §12.2 limits | ✔ | per D12 C30: self-serve once per attempt; otherwise `support`/`admin`, always audited |
| Grant accommodation multiplier (≤ 2.0×) | — | — | ✔ | evidence required; sensitive evidence view |
| Open refund request / recommend | ✔ | ✔ | ✔ | **Approve = `finance` only** (10 §7.5 mentions a pre-approved support threshold — propose none at P1: finance one-click within 3 days) |
| Open score dispute | ✔ | ✔ | ✔ | grader decides |
| Hide content pending review (moderation) | ✔ | ✔ | ✔ | remove/ban = `admin` |
| Apply nudge/warning/limit (enforcement 0–2) | warn | ✔ | ✔ | suspend = lead + `admin`; terminate = `admin` four-eyes |
| Change user email/phone/name directly | ✗ | ✗ | ✗ | must use Path C recovery (48 h cool-off) or user self-serve |
| Reset staff 2FA / recover staff accounts | ✗ | ✗ | ✗ | two-person `super_admin` reset (GA-049; 03 §6.6) |
| View essay text / audio / admissions documents | ✗ | ✗ | ✗ | graders/counsellors only; support sees metadata; break-glass for `admin` (audited) |
| View payment instruments | ✗ (none stored) | | | We never hold card/wallet PINs; show last-4 only |
| Create/edit macros | ✗ | ✗ | ✔ | reviewed monthly |
| Export user data | ✗ | ✗ | ✗ | DSAR job only |
| Delete tickets/messages | ✗ | ✗ | ✗ | retention job only |

**Controls:** every privileged action writes `audit_log` with reason; **four-eyes** for terminations, AI-credit grants beyond caps, extensions beyond caps and any `attempt:void`; weekly sample audit (10 random actions) by lead; quarterly access review; same-day offboarding (revoke sessions, Chatwoot account, 2FA devices); **no screenshots of PII outside approved tools**; no personal-device storage of user data; helpdesk accounts use 2FA; shared mailbox passwords prohibited; BYOD policy `[DECIDE]`; confidentiality and privacy training before access; breach reporting duty ≤ 24 h to security owner.

## 17. Training and QA

| Element | Standard |
|---|---|
| **Onboarding (2 weeks)** | Day 1–2 product tour + roles/permissions + privacy and minors + safeguarding (mandatory, with quiz ≥ 85%); Day 3–5 payments (SSLCommerz/bKash/Paddle flows, refund policy, reconcile), exam engine rules (D6, GA-007), AI scoring policy and limits; Week 2 shadowing live chats + supervised tickets; certification: handle 30 sample tickets scored ≥ 90% before solo on P0/P1. |
| **QA scorecard** (weights) | Accuracy & policy adherence 35%; correct tool use/permissions & PII hygiene 20%; resolution/next step clarity 20%; tone & empathy 15%; language quality (Bangla/English) 10%. Auto-fail items: asking for OTP/PIN, disclosing another user's data, promising refunds/scores, ignoring a safeguarding keyword. |
| **Sampling** | 5 tickets/agent/week (more for new agents), all P0 closures, all safeguarding and enforcement actions (100%), all refunds denied (20%). |
| **Calibration** | Monthly 1-hour calibration on 5 shared tickets; Bangla language QA by a native reviewer quarterly. |
| **Knowledge upkeep** | Macros and articles reviewed monthly/quarterly; "change log" posted in the team channel whenever policy/product changes; new feature → article + macro before release (definition of done). |
| **Drills** | Quarterly: payment-outage drill, exam-outage bulk-reissue drill, safeguarding tabletop, DSAR synthetic test, leak-response drill. |
| **Wellbeing & fairness** | Rotation off abusive tickets, escalation of abusive users (refuse service rights), manageable queue sizes, breaks; coaching over punishment. |

## 18. Weekly ops cadence and dashboards

**Monday (45 min), chaired by Support & Trust lead:** (1) SLA attainment by tier/channel; (2) top-10 contact reasons → product/help fixes; (3) refunds, disputes, chargebacks, fraud queue; (4) moderation counts, appeals overturned, S0/S1 cases; (5) enforcement actions and appeals; (6) leaks confirmed/takedowns; (7) grader quality (QWK, overturn rate, SLA); (8) DSAR queue vs 30-day clock; (9) CSAT verbatims ≤ 2 and ≥ 5; (10) incidents/post-mortems; (11) macro/article changes. **Dashboards:** Support SLA board; Money board (pending/held/refunds/chargebacks); Trust board (moderation, enforcement, leaks); Privacy board (DSAR ages); Grader board. Data from the ticket mirror, `dispute`, `moderation_case`, `enforcement_action`, `refund`, `data_subject_request`. Owners and definitions feed the KPI dictionary (`NEW-32`).

---

## 19. Data model additions (Drizzle sketches, following `05` conventions)

Conventions (05 §1): singular `snake_case` tables; `pk()` UUIDv7; `...timestamps()`; `tstz()`; money `amount_minor` + `currency char(3)`; native `pgEnum` for closed sets, `text` + CHECK for open sets; every FK is the leading column of an index; jsonb only for versioned payloads with `*_schema_version`; hard deletes by retention job, soft delete only where noted. These are **sketches for the Sonnet implementer** and have not been compiled; run `db-fk-indexed` and the PII-registry CI check. Migration files go in their own migration (enum `ADD VALUE` rules, 05 §1). New file: `packages/db/src/schema/support.ts`.

### 19.1 Enums (add to `enums.ts`)

```ts
export const supportTierEnum = pgEnum('support_tier', ['free', 'core', 'plus', 'live', 'mentor', 'org']);
export const ticketChannelEnum = pgEnum('ticket_channel', ['in_app', 'email', 'whatsapp', 'messenger', 'phone', 'web_form', 'system']);
export const ticketStatusEnum = pgEnum('ticket_status', ['new', 'open', 'pending_customer', 'pending_internal', 'on_hold', 'resolved', 'closed', 'spam']);
export const ticketPriorityEnum = pgEnum('ticket_priority', ['p0', 'p1', 'p2', 'p3']);
export const ticketDirectionEnum = pgEnum('ticket_direction', ['inbound', 'outbound', 'internal_note', 'system']);
export const moderationStatusEnum = pgEnum('moderation_status', ['open', 'in_review', 'actioned', 'dismissed', 'appealed', 'appeal_upheld', 'appeal_rejected']);
export const moderationActionEnum = pgEnum('moderation_action', ['none', 'hide', 'remove', 'warn_user', 'mute_user', 'suspend_user', 'ban_user', 'escalate_safeguarding', 'escalate_legal']);
export const disputeKindEnum = pgEnum('dispute_kind', ['score', 'exam_technical', 'payment_card', 'payment_wallet']);
export const disputeStatusEnum = pgEnum('dispute_status', ['opened', 'triage', 'human_review', 'evidence_gathering', 'submitted_to_provider', 'decided', 'closed', 'reopened']);
export const disputeOutcomeEnum = pgEnum('dispute_outcome', ['upheld', 'partially_upheld', 'rejected', 'won', 'lost', 'withdrawn']);
export const guaranteeStatusEnum = pgEnum('guarantee_status', ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'reenrolled', 'expired', 'withdrawn']);
export const enforcementKindEnum = pgEnum('enforcement_kind', ['nudge', 'warning', 'limit', 'suspend', 'terminate', 'reinstate']);
```

### 19.2 Tables

| Table | Purpose | Key constraints | Retention | PII class |
|---|---|---|---|---|
| `support_ticket` | One row per ticket; in `chatwoot` mode a **mirror** (metadata + SLA), in `native` mode authoritative | UQ `ticket_no`; UQ `(external_system, external_id)`; SLA scan index; links to `order`, `evaluation_request`, `test_attempt` | 24 months after `closed_at` | Restricted (contact for guests) |
| `ticket_message` | Messages/notes — **native mode only** (P1 stores none; message bodies stay in the helpdesk) | idx `(ticket_id, created_at)`; UQ `(ticket_id, channel_message_id)` | 24 months with ticket | Personal content |
| `macro` | Reviewed reply templates en/bn | UQ `key` | permanent (versioned) | none |
| `csat_response` | CSAT (+ optional NPS) per resolved ticket | UQ `ticket_id`; CHECK 1–5 / 0–10 | 24 months | Pseudonymous |
| `moderation_case` | Aggregates reports on a UGC target; decisions and appeals | queue partial idx; idx `(target_type, target_id)` | 2 years after resolution (as `report`); safeguarding cases per 26 L-25 | Personal content snapshot |
| `dispute` | Score disputes, exam-technical disputes, card/wallet payment disputes | CHECKs per kind; one open score dispute per evaluation | Score: 3 years; payment: 10 years (financial) | Restricted |
| `guarantee_claim` | Progress Promise claims (Mentor) | partial UQ one live claim per `order_item` | 10 years (financial-adjacent) ; TRF document 24 months after decision | Restricted |
| `enforcement_action` | Ladder actions (warning→terminate) and appeals | partial idx active actions per user | 3 years after expiry | Restricted (internal) |

Also changes to existing tables: `report` gets `case_id uuid null references moderation_case(id) on delete set null` (+ index); `reportTargetEnum` extended (`'live_message'`, `'ticket_attachment'`, `'external_group_post'`); `user_profile` gets `support_level text` (CHECK `l1|l2|lead` or null); permissions strings (below).

```ts
// packages/db/src/schema/support.ts
import { sql } from 'drizzle-orm';
import { bigint, boolean, char, check, date, index, integer, jsonb, numeric, pgTable, smallint, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import {
  supportTierEnum, ticketChannelEnum, ticketStatusEnum, ticketPriorityEnum, ticketDirectionEnum,
  moderationStatusEnum, moderationActionEnum, disputeKindEnum, disputeStatusEnum, disputeOutcomeEnum,
  guaranteeStatusEnum, enforcementKindEnum, appLocaleEnum,
} from './enums';
import { amountMinor, createdAtCol, currencyCol, pk, schemaVersionCol, timestamps, tstz } from './_shared';
import { user } from './identity';
import { order, orderItem, payment, entitlement } from './commerce';
import { evaluationRequest, graderAssignment } from './evaluation';
import { testAttempt } from './exam-engine';
import { exam } from './taxonomy';
import { policyVersion } from './legal';          // from 26 §19.3
import { report } from './community';

/** Ticket metadata + SLA. Chatwoot is the conversation store in P1 (SUPPORT_BACKEND=chatwoot); native mode fills ticket_message. */
export const supportTicket = pgTable('support_ticket', {
  id: pk(),
  ticketNo: bigint('ticket_no', { mode: 'number' }).generatedAlwaysAsIdentity().notNull(), // shown as SUP-000123
  requesterUserId: uuid('requester_user_id').references(() => user.id, { onDelete: 'set null' }),
  requesterContact: text('requester_contact'),                 // guests only: lower-cased email or E.164 phone; PII (masked in UI, purged with ticket)
  channel: ticketChannelEnum('channel').notNull(),
  categoryCode: text('category_code').notNull(),               // 'PAY-02' (27 §3.1)
  priority: ticketPriorityEnum('priority').notNull().default('p2'),
  status: ticketStatusEnum('status').notNull().default('new'),
  tier: supportTierEnum('tier').notNull().default('free'),     // snapshot at open (highest active entitlement tier)
  locale: appLocaleEnum('locale').notNull().default('en'),
  subject: text('subject').notNull(),
  assigneeUserId: uuid('assignee_user_id').references(() => user.id, { onDelete: 'set null' }),
  escalationLevel: smallint('escalation_level').notNull().default(1),
  orderId: uuid('order_id').references(() => order.id, { onDelete: 'set null' }),
  evaluationRequestId: uuid('evaluation_request_id').references(() => evaluationRequest.id, { onDelete: 'set null' }),
  attemptId: uuid('attempt_id').references(() => testAttempt.id, { onDelete: 'set null' }),
  externalSystem: text('external_system'),                     // 'chatwoot'
  externalId: text('external_id'),
  tags: text('tags').array(),                                  // 'incident:2026-11-12-pay', 'safeguarding'
  firstResponseDueAt: tstz('first_response_due_at'),
  resolutionDueAt: tstz('resolution_due_at'),
  firstRespondedAt: tstz('first_responded_at'),
  slaPausedAt: tstz('sla_paused_at'),
  slaPausedSeconds: integer('sla_paused_seconds').notNull().default(0),
  resolvedAt: tstz('resolved_at'),
  closedAt: tstz('closed_at'),
  reopenCount: smallint('reopen_count').notNull().default(0),
  firstResponseBreached: boolean('first_response_breached').notNull().default(false),
  resolutionBreached: boolean('resolution_breached').notNull().default(false),
  ...timestamps(),
}, (t) => [
  uniqueIndex('support_ticket_no_uq').on(t.ticketNo),
  uniqueIndex('support_ticket_external_uq').on(t.externalSystem, t.externalId).where(sql`${t.externalId} is not null`),
  index('support_ticket_requester_idx').on(t.requesterUserId, t.createdAt),
  index('support_ticket_assignee_idx').on(t.assigneeUserId, t.status),
  index('support_ticket_order_idx').on(t.orderId).where(sql`${t.orderId} is not null`),
  index('support_ticket_eval_idx').on(t.evaluationRequestId).where(sql`${t.evaluationRequestId} is not null`),
  index('support_ticket_attempt_idx').on(t.attemptId).where(sql`${t.attemptId} is not null`),
  index('support_ticket_queue_idx').on(t.priority, t.firstResponseDueAt).where(sql`${t.status} in ('new','open','pending_internal')`),
  index('support_ticket_sla_idx').on(t.resolutionDueAt).where(sql`${t.status} in ('new','open','pending_internal') and ${t.resolutionBreached} = false`),
  check('support_ticket_category_chk', sql`${t.categoryCode} ~ '^[A-Z]{3}-[0-9]{2}$'`),
  check('support_ticket_requester_chk', sql`${t.requesterUserId} is not null or ${t.requesterContact} is not null`),
]);

/** Native mode only. attachments = [{ r2Key, name, mime, bytes, scan: 'clean'|'pending'|'infected' }]. */
export const ticketMessage = pgTable('ticket_message', {
  id: pk(),
  ticketId: uuid('ticket_id').notNull().references(() => supportTicket.id, { onDelete: 'cascade' }),
  direction: ticketDirectionEnum('direction').notNull(),
  authorUserId: uuid('author_user_id').references(() => user.id, { onDelete: 'set null' }),   // null for guests/system
  body: text('body').notNull(),                                 // sanitised; personal content
  bodyLocale: appLocaleEnum('body_locale'),
  macroKey: text('macro_key'),                                  // set when sent via macro (reporting)
  macroVersion: smallint('macro_version'),
  channelMessageId: text('channel_message_id'),                 // idempotent inbound email/WhatsApp ids
  attachments: jsonb('attachments').$type<Array<{ r2Key: string; name: string; mime: string; bytes: number; scan: 'clean' | 'pending' | 'infected' }>>(),
  attachmentsSchemaVersion: smallint('attachments_schema_version').notNull().default(1),
  deliveredAt: tstz('delivered_at'),
  redactedAt: tstz('redacted_at'),
  createdAt: createdAtCol(),
}, (t) => [
  index('ticket_message_ticket_idx').on(t.ticketId, t.createdAt),
  index('ticket_message_author_idx').on(t.authorUserId).where(sql`${t.authorUserId} is not null`),
  uniqueIndex('ticket_message_channel_uq').on(t.ticketId, t.channelMessageId).where(sql`${t.channelMessageId} is not null`),
]);

/** Source of truth for macros; synced to the helpdesk's canned responses. Bodies use {{variables}}. */
export const macro = pgTable('macro', {
  id: pk(),
  key: text('key').notNull(),                                   // 'M-PAY-02'
  categoryCode: text('category_code'),
  titleEn: text('title_en').notNull(),
  titleBn: text('title_bn').notNull(),
  bodyEn: text('body_en').notNull(),
  bodyBn: text('body_bn').notNull(),
  variables: text('variables').array(),
  internalSteps: text('internal_steps'),                        // "Check/Do" list shown to the agent, never to the user
  version: smallint('version').notNull().default(1),
  isActive: boolean('is_active').notNull().default(true),
  ownerUserId: uuid('owner_user_id').references(() => user.id, { onDelete: 'set null' }),
  lastReviewedAt: tstz('last_reviewed_at'),
  bnReviewedAt: tstz('bn_reviewed_at'),                         // native-speaker review
  usageCount: integer('usage_count').notNull().default(0),
  ...timestamps(),
}, (t) => [
  uniqueIndex('macro_key_uq').on(t.key),
  index('macro_owner_idx').on(t.ownerUserId),
  check('macro_key_chk', sql`${t.key} ~ '^[MT]-[A-Z]{3,6}-[0-9]{2}$'`),
]);

export const csatResponse = pgTable('csat_response', {
  id: pk(),
  ticketId: uuid('ticket_id').notNull().references(() => supportTicket.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').references(() => user.id, { onDelete: 'set null' }),
  score: smallint('score').notNull(),                            // 1..5
  npsScore: smallint('nps_score'),                               // optional 0..10 (P2 moves to nps_response)
  comment: text('comment'),
  locale: appLocaleEnum('locale').notNull().default('en'),
  agentUserId: uuid('agent_user_id').references(() => user.id, { onDelete: 'set null' }),  // snapshot for QA reporting
  respondedAt: tstz('responded_at').notNull().defaultNow(),
  createdAt: createdAtCol(),
}, (t) => [
  uniqueIndex('csat_response_ticket_uq').on(t.ticketId),
  index('csat_response_user_idx').on(t.userId).where(sql`${t.userId} is not null`),
  index('csat_response_agent_idx').on(t.agentUserId, t.respondedAt),
  check('csat_response_score_chk', sql`${t.score} between 1 and 5`),
  check('csat_response_nps_chk', sql`${t.npsScore} is null or ${t.npsScore} between 0 and 10`),
]);

/** One case per moderated target; many `report` rows can point at it via report.case_id. */
export const moderationCase = pgTable('moderation_case', {
  id: pk(),
  targetType: text('target_type').notNull(),                     // 'thread'|'answer'|'review'|'user'|'live_message'|'ticket_attachment'|'external_group_post'
  targetId: uuid('target_id'),                                   // polymorphic, no FK; null for external posts
  externalRef: text('external_ref'),                             // URL/ID for FB/Discord posts
  authorUserId: uuid('author_user_id').references(() => user.id, { onDelete: 'set null' }),
  ruleCode: text('rule_code').notNull(),                         // 'R01'..'R12' (27 §10.1)
  severity: smallint('severity').notNull().default(3),           // 0 = safeguarding .. 3 = low
  status: moderationStatusEnum('status').notNull().default('open'),
  reportCount: integer('report_count').notNull().default(1),
  firstReportedAt: tstz('first_reported_at').notNull().defaultNow(),
  assignedTo: uuid('assigned_to').references(() => user.id, { onDelete: 'set null' }),
  action: moderationActionEnum('action').notNull().default('none'),
  decidedBy: uuid('decided_by').references(() => user.id, { onDelete: 'set null' }),
  decidedAt: tstz('decided_at'),
  decisionNote: text('decision_note'),
  safeguardingFlag: boolean('safeguarding_flag').notNull().default(false),
  contentSnapshot: jsonb('content_snapshot').$type<{ text?: string; title?: string; capturedAt: string; media?: string[] }>(),
  contentSnapshotSchemaVersion: smallint('content_snapshot_schema_version').notNull().default(1),
  appealNote: text('appeal_note'),
  appealDecidedBy: uuid('appeal_decided_by').references(() => user.id, { onDelete: 'set null' }),
  appealDecidedAt: tstz('appeal_decided_at'),
  enforcementActionId: uuid('enforcement_action_id'),            // set when a sanction was created (no FK: cycle)
  retainUntil: tstz('retain_until'),
  ...timestamps(),
}, (t) => [
  index('moderation_case_queue_idx').on(t.severity, t.firstReportedAt).where(sql`${t.status} in ('open','in_review')`),
  index('moderation_case_target_idx').on(t.targetType, t.targetId),
  index('moderation_case_author_idx').on(t.authorUserId).where(sql`${t.authorUserId} is not null`),
  index('moderation_case_assigned_idx').on(t.assignedTo).where(sql`${t.assignedTo} is not null`),
  index('moderation_case_decided_idx').on(t.decidedBy),
  index('moderation_case_appeal_idx').on(t.appealDecidedBy),
  check('moderation_case_severity_chk', sql`${t.severity} between 0 and 3`),
  check('moderation_case_target_chk', sql`${t.targetId} is not null or ${t.externalRef} is not null`),
]);

/** Score, exam-technical and payment disputes. Kind-specific columns are nullable with CHECKs. */
export const dispute = pgTable('dispute', {
  id: pk(),
  kind: disputeKindEnum('kind').notNull(),
  status: disputeStatusEnum('status').notNull().default('opened'),
  userId: uuid('user_id').notNull().references(() => user.id, { onDelete: 'restrict' }),   // erasure anonymises, never hard-deletes (05 §7.4)
  ticketId: uuid('ticket_id').references(() => supportTicket.id, { onDelete: 'set null' }),
  // score / technical
  evaluationRequestId: uuid('evaluation_request_id').references(() => evaluationRequest.id, { onDelete: 'restrict' }),
  graderAssignmentId: uuid('grader_assignment_id').references(() => graderAssignment.id, { onDelete: 'set null' }),
  attemptId: uuid('attempt_id').references(() => testAttempt.id, { onDelete: 'restrict' }),
  originalBand: numeric('original_band', { precision: 3, scale: 1 }),
  revisedBand: numeric('revised_band', { precision: 3, scale: 1 }),
  creditsReturned: smallint('credits_returned').notNull().default(0),
  // payment
  orderId: uuid('order_id').references(() => order.id, { onDelete: 'restrict' }),
  paymentId: uuid('payment_id').references(() => payment.id, { onDelete: 'restrict' }),
  provider: text('provider'),                                    // 'paddle'|'sslcommerz'|'bkash'|'nagad'
  providerCaseId: text('provider_case_id'),
  amountMinor: amountMinor(),
  currency: currencyCol(),
  evidenceDueAt: tstz('evidence_due_at'),                        // provider deadline (never miss)
  evidencePackR2Key: text('evidence_pack_r2_key'),
  submittedAt: tstz('submitted_at'),
  // common
  reason: text('reason'),
  openedAt: tstz('opened_at').notNull().defaultNow(),
  slaDueAt: tstz('sla_due_at'),
  outcome: disputeOutcomeEnum('outcome'),
  decidedBy: uuid('decided_by').references(() => user.id, { onDelete: 'set null' }),
  decidedAt: tstz('decided_at'),
  decisionNote: text('decision_note'),
  reopenedCount: smallint('reopened_count').notNull().default(0),
  ...timestamps(),
}, (t) => [
  index('dispute_user_idx').on(t.userId, t.createdAt),
  index('dispute_ticket_idx').on(t.ticketId).where(sql`${t.ticketId} is not null`),
  index('dispute_eval_idx').on(t.evaluationRequestId).where(sql`${t.evaluationRequestId} is not null`),
  index('dispute_grader_idx').on(t.graderAssignmentId).where(sql`${t.graderAssignmentId} is not null`),
  index('dispute_attempt_idx').on(t.attemptId).where(sql`${t.attemptId} is not null`),
  index('dispute_order_idx').on(t.orderId).where(sql`${t.orderId} is not null`),
  index('dispute_payment_idx').on(t.paymentId).where(sql`${t.paymentId} is not null`),
  index('dispute_decided_by_idx').on(t.decidedBy),
  index('dispute_queue_idx').on(t.kind, t.slaDueAt).where(sql`${t.status} not in ('decided','closed')`),
  uniqueIndex('dispute_open_score_uq').on(t.evaluationRequestId).where(sql`${t.kind} = 'score' and ${t.status} not in ('decided','closed')`),
  uniqueIndex('dispute_provider_case_uq').on(t.provider, t.providerCaseId).where(sql`${t.providerCaseId} is not null`),
  check('dispute_score_chk', sql`${t.kind} <> 'score' or ${t.evaluationRequestId} is not null`),
  check('dispute_technical_chk', sql`${t.kind} <> 'exam_technical' or ${t.attemptId} is not null`),
  check('dispute_payment_chk', sql`${t.kind} not in ('payment_card','payment_wallet') or (${t.paymentId} is not null and ${t.amountMinor} is not null and ${t.currency} is not null)`),
  check('dispute_amount_pair_chk', sql`(${t.amountMinor} is null) = (${t.currency} is null)`),
]);

/** Progress Promise (Mentor only; D12 C13). The service computes `eligibility` from live_attendance, homework, attempts. */
export const guaranteeClaim = pgTable('guarantee_claim', {
  id: pk(),
  userId: uuid('user_id').notNull().references(() => user.id, { onDelete: 'restrict' }),
  orderItemId: uuid('order_item_id').notNull().references(() => orderItem.id, { onDelete: 'restrict' }),
  entitlementId: uuid('entitlement_id').references(() => entitlement.id, { onDelete: 'set null' }),
  examId: uuid('exam_id').references(() => exam.id, { onDelete: 'restrict' }),
  termsPolicyVersionId: uuid('terms_policy_version_id').references(() => policyVersion.id, { onDelete: 'restrict' }), // Progress Promise Terms accepted at purchase
  targetOverall: numeric('target_overall', { precision: 4, scale: 1 }).notNull(),       // recorded at enrolment
  targetSkillMin: numeric('target_skill_min', { precision: 4, scale: 1 }),
  diagnosticBand: numeric('diagnostic_band', { precision: 4, scale: 1 }),              // for the "realistic target" rule
  programmeEndDate: date('programme_end_date'),
  windowEndsOn: date('window_ends_on'),                                                 // programme end + 60 days (D12 C13)
  officialTestDate: date('official_test_date'),
  officialOverall: numeric('official_overall', { precision: 4, scale: 1 }),
  trfR2Key: text('trf_r2_key'),                                                         // uploaded official score report (private R2)
  trfRefHash: char('trf_ref_hash', { length: 64 }),                                     // HMAC of report/reference number (duplicate detection)
  eligibility: jsonb('eligibility').$type<{ attendancePct: number; homeworkPct: number; fullMocks: number; withinWindow: boolean; trfUploaded: boolean; conductClean: boolean; computedAt: string }>(),
  eligibilitySchemaVersion: smallint('eligibility_schema_version').notNull().default(1),
  status: guaranteeStatusEnum('status').notNull().default('draft'),
  submittedAt: tstz('submitted_at'),
  decidedBy: uuid('decided_by').references(() => user.id, { onDelete: 'set null' }),
  decidedAt: tstz('decided_at'),
  decisionNote: text('decision_note'),
  reenrolEntitlementId: uuid('reenrol_entitlement_id').references(() => entitlement.id, { onDelete: 'set null' }),
  reenrolExpiresAt: tstz('reenrol_expires_at'),
  ...timestamps(),
}, (t) => [
  index('guarantee_claim_user_idx').on(t.userId),
  index('guarantee_claim_entitlement_idx').on(t.entitlementId),
  index('guarantee_claim_exam_idx').on(t.examId),
  index('guarantee_claim_terms_idx').on(t.termsPolicyVersionId),
  index('guarantee_claim_decided_by_idx').on(t.decidedBy),
  index('guarantee_claim_reenrol_idx').on(t.reenrolEntitlementId),
  index('guarantee_claim_queue_idx').on(t.status, t.submittedAt).where(sql`${t.status} in ('submitted','under_review')`),
  uniqueIndex('guarantee_claim_live_uq').on(t.orderItemId).where(sql`${t.status} not in ('withdrawn','rejected','expired')`),
  check('guarantee_claim_target_chk', sql`${t.targetOverall} between 0 and 90`),
  check('guarantee_claim_decision_chk', sql`${t.status} not in ('approved','rejected','reenrolled') or (${t.decidedBy} is not null and ${t.decidedAt} is not null)`),
]);

/** Ladder actions from 27 §11.2 (also used by moderation and abuse). Expiring warnings; appeal tracking. */
export const enforcementAction = pgTable('enforcement_action', {
  id: pk(),
  userId: uuid('user_id').notNull().references(() => user.id, { onDelete: 'restrict' }),
  kind: enforcementKindEnum('kind').notNull(),
  reasonCode: text('reason_code').notNull(),                      // 'sharing'|'leak'|'fraud'|'harassment'|'integrity'|'chargeback_abuse'|'safeguarding'|...
  source: text('source').notNull(),                               // 'abuse_score'|'moderation'|'support'|'finance'|'trust'
  moderationCaseId: uuid('moderation_case_id').references(() => moderationCase.id, { onDelete: 'set null' }),
  disputeId: uuid('dispute_id').references(() => dispute.id, { onDelete: 'set null' }),
  ticketId: uuid('ticket_id').references(() => supportTicket.id, { onDelete: 'set null' }),
  details: text('details'),                                       // internal; excluded from DSAR export (fraud notes)
  scope: text('scope'),                                           // 'streaming'|'downloads'|'community'|'login'|'ai_credits'|'account'
  startsAt: tstz('starts_at').notNull().defaultNow(),
  endsAt: tstz('ends_at'),                                        // null = indefinite (suspend) or until revoked
  warningExpiresAt: tstz('warning_expires_at'),                   // +12 months for warnings
  imposedBy: uuid('imposed_by').references(() => user.id, { onDelete: 'set null' }),
  approvedBy: uuid('approved_by').references(() => user.id, { onDelete: 'set null' }),   // four-eyes for terminate
  userNotifiedAt: tstz('user_notified_at'),
  appealedAt: tstz('appealed_at'),
  appealDecidedBy: uuid('appeal_decided_by').references(() => user.id, { onDelete: 'set null' }),
  appealOutcome: text('appeal_outcome'),                          // 'upheld'|'overturned'|'reduced'
  revokedAt: tstz('revoked_at'),
  ...timestamps(),
}, (t) => [
  index('enforcement_action_user_idx').on(t.userId, t.startsAt),
  index('enforcement_action_active_idx').on(t.userId).where(sql`${t.revokedAt} is null and ${t.kind} in ('limit','suspend','terminate')`),
  index('enforcement_action_case_idx').on(t.moderationCaseId).where(sql`${t.moderationCaseId} is not null`),
  index('enforcement_action_dispute_idx').on(t.disputeId).where(sql`${t.disputeId} is not null`),
  index('enforcement_action_ticket_idx').on(t.ticketId).where(sql`${t.ticketId} is not null`),
  index('enforcement_action_imposed_by_idx').on(t.imposedBy),
  index('enforcement_action_approved_by_idx').on(t.approvedBy),
  index('enforcement_action_appeal_idx').on(t.appealDecidedBy),
  check('enforcement_action_terminate_chk', sql`${t.kind} <> 'terminate' or ${t.approvedBy} is not null`),
]);
```

### 19.3 Notes on the sketches
1. **Mode flag:** `SUPPORT_BACKEND` (`chatwoot` default | `native`); services branch only inside `packages/core/src/support`. In `chatwoot` mode `ticket_message` stays empty and `support_ticket.requester_contact` is only populated for guests created via `/contact`.
2. **`dispute` unification** keeps one SLA/queue for money and score disputes; if CHECK sprawl becomes unwieldy, split into `score_dispute` and `payment_dispute` at implementation (decision for the Sonnet implementer, not product).
3. **`guarantee_claim`** fills the gap in 05 (D12 C13 says "modelled in 05" but the table is absent — 26 X9). The eligibility numbers are computed from `live_attendance` (P1: manual attendance import by Live Ops until in-app attendance ships, D1), homework records, `test_attempt` (full mocks in exam mode) and `enforcement_action` (conduct). Accounting: finance books a deferred-revenue **provision** for expected re-enrolment cost (GA-014, accountant to define).
4. **Retention jobs** (add to 05 §8): `maintenance.purge-tickets` (24 months after `closed_at`), `maintenance.purge-csat` (24 months), `maintenance.purge-moderation` (2 years after decision, honour `retain_until`), `maintenance.expire-warnings` (mark expired), `maintenance.purge-guarantee-docs` (TRF 24 months after decision). Disputes and guarantee claims follow financial retention.
5. **PII registry (09 §13.9):** register all eight tables; `support_ticket.requester_contact`, `ticket_message.body`, `moderation_case.content_snapshot`, `guarantee_claim.trf_*` are PII; `enforcement_action.details` is excluded from export (internal fraud notes).
6. **Permissions (add to `packages/auth/src/permissions.ts`)** — `ticket:read|reply|assign|merge`, `macro:read|manage`, `csat:read`, `moderation:read|decide|appeal_decide`, `dispute:read|open|decide`, `guarantee:read|review|decide`, `enforcement:apply_warning|apply_limit|apply_suspend|apply_terminate|decide_appeal`, `attempt:grant_resit`, `attempt:credit_mock`, `attempt:void` (admin), `accommodation:grant`, `pii:reveal`, `dsr:process`, `leo_request:handle`; scopes per §16; `assertCan(actor, 'enforcement:apply_terminate', user)` requires a second approver.
7. **Audit actions** (text, not enum): `ticket.escalate`, `macro.publish`, `pii.reveal`, `moderation.remove`, `moderation.appeal`, `dispute.decide`, `guarantee.decide`, `enforcement.apply`, `enforcement.appeal`, `attempt.void`, `attempt.resit`, `accommodation.grant`, `leo.disclose`.
8. **Events (outbox):** `support.ticket.created|first_response_due|breached|resolved`, `dispute.opened|decided`, `guarantee.submitted|decided`, `moderation.actioned`, `enforcement.applied`; consumed by notifications, finance, and the weekly dashboard.

---

## 20. Backlog additions (IDs to be assigned by the lead: `NEW-SUP-xx`)

> **Final IDs: see 12 Appendix C.** The `NEW-*` IDs in this list are source IDs only; PROGRESS.md and the build loop use the final P0/P1/P2/P3 IDs (or `BG-xx` human gates) given there. Do not rewrite this list.

Format: title — owner model/human — phase — depends on. P1 launch blockers marked **[B]** (add to `11` §11 "business readiness" and before P1-54).

| ID | Task | Owner | Phase | Depends |
|---|---|---|---|---|
| NEW-SUP-01 **[B]** | Sign off helpdesk choice (Chatwoot Cloud vs self-host); create workspace, domain mail routing, 2FA, agent accounts, labels, inbox per channel | Founder + Support lead | P0/P1 | 27 §2 |
| NEW-SUP-02 **[B]** | Start Meta Business verification, WhatsApp Cloud API number + templates, Messenger page connection (lead time weeks) | Founder | P0 | NEW-SUP-01 |
| NEW-SUP-03 **[B]** | Migration: enums + `support_ticket`, `ticket_message`, `macro`, `csat_response`; `user_profile.support_level` | Sonnet | P1 | 05 |
| NEW-SUP-04 **[B]** | Chatwoot integration: identity HMAC, create-conversation API, webhook ingest (signed, idempotent), tier/priority attributes | Sonnet | P1 | -03 |
| NEW-SUP-05 **[B]** | SLA engine: BD business-hours calendar, due-time calc by tier×priority, pause/resume, alerts (Inngest), breach flags | Sonnet | P1 | -03,-04 |
| NEW-SUP-06 **[B]** | `/app/support` + guest `/contact` ticket form (Turnstile), ticket list/status, error-code → article links | Sonnet | P1 | -04, -18 |
| NEW-SUP-07 **[B]** | Support console additions (`/support/**`): masked lookup context panel for Chatwoot, "trace watermark code", extension cap (14 d/90 d), reveal-rate alerts | Sonnet | P1 | F-SUP-01..03 |
| NEW-SUP-08 **[B]** | Exam-disruption actions: "I lost connection" self-serve flow, support `credit_mock`/`grant_resit`, `attempt:void` request button, bulk re-issue admin job, unify accommodation multiplier (GA-007) | Sonnet + Opus review | P1 | 07, 06 |
| NEW-SUP-09 **[B]** | Score-dispute flow: `dispute` table, result-page button, credit rules, grader routing, second review, effects on dashboards | Sonnet | P1 | -03, 07 §7.10 |
| NEW-SUP-10 **[B for Mentor]** | `guarantee_claim` model, eligibility calculator, claim UI, finance provision report | Sonnet + Opus review | P1 | policy 26 §4.3, L-12 |
| NEW-SUP-11 | Moderation: `moderation_case`, `report.case_id`, `/admin/moderation` queue, auto-flag lists (en/bn/Banglish), FB/Discord moderation runbook | Sonnet + Haiku | P1 (rules + FB/Discord) / P2 (in-app) | 05 §4.12 |
| NEW-SUP-12 | Enforcement ladder: `enforcement_action`, abuse-score job from `playback_session`/devices, user notices, appeals UI | Sonnet | P1 minimal / P2 full | 10 §8 |
| NEW-SUP-13 | Leak-response tooling: watermark code lookup, evidence bucket + hash log, takedown templates | Sonnet + Haiku | P1 | -07 |
| NEW-SUP-14 **[B]** | Chargeback/dispute evidence-pack export; Paddle `adjustment` handling; SSLCommerz dispute workflow | Sonnet | P1 | 10 §7.5 |
| NEW-SUP-15 | Fraud rules + queue: checkout velocity, refund-abuse flags, coupon/referral holds, risk-hold review UI (GA-025) | Sonnet | P1/P2 | F-PAY-11 |
| NEW-SUP-16 **[B]** | DSAR ops: Chatwoot export/delete connector, SOP, 3-day ack/30-day clock dashboard, quarterly synthetic test | Sonnet | P1 | 09 §13.9 |
| NEW-SUP-17 **[B]** | Load the 30+5 macros (en/bn) into `macro`; sync to Chatwoot; native-speaker Bangla review | Haiku + human | P1 | -03 |
| NEW-SUP-18 **[B]** | Write 71 help articles (en/bn), verify, publish in CMS; error-code→article map + CI check | Haiku + Support lead | P1 | F-CMS-04 |
| NEW-SUP-19 | Status page (Better Stack), components, bilingual incident templates, banner integration | Haiku + Eng | P1 | 11 §5.5 |
| NEW-SUP-20 | CSAT (24 h after resolve) + quarterly NPS, storage and dashboard | Sonnet | P1 (CSAT) / P2 (NPS) | -03 |
| NEW-SUP-21 | Support/Trust dashboards + weekly review template | Sonnet + Haiku | P1 | -05 |
| NEW-SUP-22 **[B]** | Grader programme ops: recruitment, qualification test, rate card, caps, quality dashboard (GA-024) | Academic lead + Sonnet | P1 | 07 §7.9–7.10 |
| NEW-SUP-23 **[B for minors/live]** | Safeguarding: appoint DSL + deputy, training pack, reporting form, register, tabletop; counsel input on duties | Founder + DSL | P1 | 26 L-25 |
| NEW-SUP-24 | Law-enforcement request SOP, register, on-call lawyer | Founder + counsel | P1 | 26 L-19 |
| NEW-SUP-25 **[B]** | Support permissions: permission strings, `support_level`, caps and four-eyes in services, `pii:reveal` rate alerts | Sonnet | P1 | D4 |
| NEW-SUP-26 | Training and QA programme: onboarding course, scorecard, calibration | Support lead | P1 | — |
| NEW-SUP-27 | Accommodation workflow: request-via-ticket, evidence bucket, `accommodation_multiplier`, expiry | Sonnet | P1 (support-granted) / P2 (self-serve) | C18 |
| NEW-SUP-28 | Staff 2FA recovery SOP + two-person reset + quarterly access review (GA-049) | Founder + Sonnet | P1 | 09 |
| NEW-SUP-29 **[B]** | Launch drills: payment-pending/no-access simulation, OTP failure, exam outage bulk re-issue, refund end-to-end, DSAR synthetic | All | P1 pre-launch | -03..-16 |
| NEW-SUP-30 | P2 gate review: native ticketing vs Chatwoot decision | Opus | P2 start | 27 §2.3 |

---

## 21. Uncertain points, open questions and cross-document fixes

### 21.1 Flags raised in this document

| # | Flag | Type | Resolve by |
|---|---|---|---|
| S1 | Chatwoot/Zendesk/Freshdesk prices, plan limits, SLA features, WhatsApp pricing, Dashboard Apps/CSP behaviour — all from memory | VERIFY | NEW-SUP-01 before purchase |
| S2 | Helpdesk vendor region and PDPO implications (add to processors page, 26 §2.3); WhatsApp/Meta controller role | LEGAL | counsel (L-08, L-22) |
| S3 | Agents see contact email/phone inside the helpdesk (conflicts in spirit with D4 "masked by default") — mitigation by `user_id`-keyed contacts | DECIDE | Founder |
| S4 | Refund decision time (3 business days), payout timing (7–14 working days), cumulative extension cap (14 d/90 d), support-granted credit limits (2/90 d), AI-credit grant caps | DECIDE / VERIFY | Founder + Finance |
| S5 | `attempt:void` was admin-only in `06`; D12 C30 now lets support/admin void (audited) and learners self-serve once per attempt; impersonation TTL 15 min (03) vs 30 min (06:406) still to reconcile | RESOLVED (void) / DECIDE (TTL) | Opus (fix 06, task P0-53) |
| S6 | Dispute windows (30/45 days), free dispute per month, credit return if gap ≥ 1.0; `03` F-AIW-10 limits P1 human review | DECIDE (26 L-14/X7) | Academic lead |
| S7 | Abuse-score thresholds and weights; legitimate-interest basis for device signals | LEGAL (L-17) / tune | Trust + counsel |
| S8 | Takedown channels and forms for Telegram/Meta/Google; BD authorities for cybercrime | VERIFY / LEGAL | Trust + counsel |
| S9 | Safeguarding duties, helpline numbers, record retention, police clearance | LEGAL / VERIFY (L-25) | DSL + counsel |
| S10 | Law-enforcement SOP: validity of foreign requests, user-notice rules | LEGAL (L-19) | counsel |
| S11 | DSAR timeline under PDPO; NDGA complaint route | LEGAL / U (L-21, L-37) | counsel |
| S12 | SSLCommerz card-dispute process and deadlines; Paddle dispute workflow and window | VERIFY | Finance |
| S13 | Fake-review rules (FTC/UK) and BD equivalent | VERIFY / LEGAL | counsel |
| S14 | Native-speaker QA of all Bangla macros/articles (GA-034) | quality | NEW-SUP-17/18 |
| S15 | `moderation:*` ownership: `support` as moderators vs `content_editor` for editorial items; `/admin/moderation` is P1 in 03 but in-app UGC is P2 | DECIDE | Opus |
| S16 | `17-PRICING-MASTER.md` now exists → per-tier allowances (human reviews, AI credits) and SLA mapping to price pages are read from 17 §2.2 | RESOLVED | lead |
| S17 | Instalment default handling (grace → pause) and refund interaction | LEGAL (L-07) | counsel |

### 21.2 Cross-document edits required (for the lead)

| Doc | Edit |
|---|---|
| `00` | Add D13 (support & legal ops): helpdesk = Chatwoot (P1), WhatsApp support intake in P1, SLA table by tier, `attempt:credit_mock`/`grant_resit` for support, accommodation multiplier set {1.25,1.5,2.0}; add to Change Log |
| `03` | Add routes from 26 §0.3; F-SUP-04 note "helpdesk = Chatwoot (27)"; fix WhatsApp support P3 → P1 intake; F-AIW-10 vs free-dispute rule; `/support/lookup` dashboard-app route |
| `05` | Add 27 §19 tables and `report.case_id`; add 26 §19.3 tables/columns; fix X1 (audio 90 d), X3, X4/X5 retention lines, `consent_kind` additions |
| `06` | Services: `support.*`, `dispute.*`, `guarantee.*`, `moderation.*`, `enforcement.*`; reconcile `voidAttempt` permission and impersonation TTL (S5) |
| `07` | Audio retention 90 d; exam-disruption cross-link; dispute decision table in §7.10; gold-set → accuracy statement gate |
| `09` | §13.9: 14-day cooling-off; SLA numbers (3-day ack/30-day); processor list add helpdesk/WhatsApp/Zoom; minors' voice decision (GA-047) |
| `10` | §7.5 chargeback/dispute workflow → link to 27 §11.6; refund timings `[U]`; support refund threshold decision |
| `11` | §11 business-readiness checklist: legal gate (26), support drills (NEW-SUP-29), status page, WhatsApp verification lead time |
| `12` | Add NEW-26-xx and NEW-SUP-xx to the backlog and the P1-54 launch gate; `P1-54` "support macros" replaced by NEW-SUP-17 |
| `18` | Safeguarding cross-link to 27 §13; Live Ops ↔ support split |
| `02` | Fix 12% → 10% royalty (26 X6); add support hours/rota and grader headcount (GA-024) |

*End of 27.*
