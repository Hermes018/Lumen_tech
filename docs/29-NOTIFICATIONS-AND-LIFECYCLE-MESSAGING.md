# 29 — Notifications and Lifecycle Messaging

> Status: draft v1, 2026-11-07. Owner: lifecycle/growth lead (with `eng-platform` for dispatcher and jobs). Resolves **GA-009**, **GA-022** (and the notification parts of GA-044, GA-003 and GA-031) from `25-GAP-AUDIT.md`.
> Precedence: `00-DECISIONS.md` wins. Where an older doc disagrees with a decision, this file follows the decision and lists the doc to fix in §0.2.
> Tags: **[U]** unverified, **[V]** verify against current provider/regulator docs before launch, **[A]** assumption, **[LEGAL]** needs counsel, **[NEW-ev]** domain event that does not exist yet in `06` §7.1.

## 0. Scope, conformance and open conflicts

### 0.1 What this document is

The complete catalogue of every message the platform sends to a human (learner, guardian, org admin, staff), the rules that decide whether and when it is sent, and the engineering contract that implements it. The catalogue (§3) is the source of truth; the code mirror is `packages/core/src/notifications/catalogue.ts` (typed, one entry per row, CI-checked against this table, see NEW-NOTIF-02).

It extends, and does not replace:

| Existing artefact | Where | How this doc conforms |
|---|---|---|
| Template ids `verify_email`, `otp_code`, `welcome`, `receipt`, `invoice`, `refund_confirmation`, `payment_failed`, `renewal_reminder_7d`, `renewal_reminder_1d`, `pass_expired`, `evaluation_ready`, `weekly_progress_digest`, `guardian_report`, `live_class_reminder`, `certificate_issued` | `10` §11.1 | Kept verbatim (marked ★ in §3). `live_class_reminder` is split into `_24h` / `_15m` / `_1h` variants only via the `slot` prop, same template id. New ids follow the same `snake_case` style. |
| `EmailProvider.send({template, props, locale, idempotencyKey, stream, attachments, tags})`, streams `transactional | notification | marketing` | `10` §1.6 | Unchanged. `EmailTemplateId` becomes a type generated from the catalogue instead of a hand-written union. |
| `SmsProvider.send` with `templateId` | `10` §1.7, §11.2 | Unchanged; adds a segment budget (§5). |
| Categories `transactional, security, learning, billing, marketing, community`; channels `in_app, email, sms, push` | `05` `notification_category`, `notification_channel` | Kept. We add channel `whatsapp` (§8). The four **opt-out classes** requested for this catalogue are a *mapping* over the six categories (§2.1), so no category migration is needed. |
| Tables `notification`, `notification_preference`, `email_log`, `outbox_event`, `consent_record`, `user_profile.timezone/marketing_opt_in` | `05` | Reused. New tables in §8. |
| Domain events `domain.past_tense` delivered via outbox to Inngest; function ids `domain.kebab-action` | `06` §7 | Reused. New events are marked [NEW-ev] and listed in §3.15. |
| F-NOT-01..08, AC-NOT-01/02, quiet hours 22:00-08:00, 1 nudge/day, 4/week | `03` §3.14 | Implemented as written; refined (never loosened) in §2. |
| OTP 6 digits, **5 min**, 5 attempts; verification link **60 min**; deletion grace **14 days**; Free = 2 credits + 1/month; Buy-now in P1 | `00` D12 (C8, C7, C1/C22, C24), D10 | Used in all copy and timers. |
| Under-18: no marketing; guardian consent flow | `00` D7 | Hard rule R-MINOR in §2.4. |
| Reminders T-7/T-1 for BD prepaid passes, once-only via `entitlement_reminder(entitlement_id, kind)` | `00` D5, `10` §7.6 | Reused. |

### 0.2 Conflicts found while writing (decisions applied; docs to fix)

| # | Conflict | Resolution applied here | Doc to fix |
|---|---|---|---|
| X1 | `10` §11.1 says `verify_email` "expires 15 min" and `otp_code` "10 min". | D12/C8: OTP **5 min**, verification link **60 min**. | `10` §11.1 table |
| X2 | `09` §13.9 step 3 says "7-day cooling-off" for deletion. | D12/C7: **14 days**. Reminders scheduled on day 7 and day 13. | `09` §13.9 |
| X3 | `03` F-NOT-04 puts WhatsApp at P3; `10` §11.3 says P2; `02` L4 uses WhatsApp for support in P1. | WhatsApp **P2** for outbound templates (matches `10` §11.3 and the brief). P1 WhatsApp = support intake only (GA-031), no outbound templates. Web push (PWA) stays P2 per F-NOT-05; **native push is P3** (Expo, D1). | `03` F-NOT-04 |
| X4 | `03` F-NOT-03: SMS other than OTP is **opt-in** (P2); `03` F-PAY-03 promises "you'll get SMS" for money-deducted cases. | Payment-status SMS is a *service message tied to an order the user just placed*: consent is captured by a pre-ticked-off checkbox at checkout ("Text me about this order", default **unticked** in EU/UK, default **ticked** for +880 numbers with the label visible) and stored in `consent_record` (new kinds, §8.4). Everything else stays opt-in. **[LEGAL]** | `03` F-NOT-03 |
| X5 | Renewal notice cadence for international auto-renew: `03` F-PAY-08 says 7 days; `20` §6.2 says T-14 and T-3. | Catalogue implements **T-7** (matches D5 BD cadence and F-PAY-08) as the default and supports an extra **T-14/T-3** schedule per region via config if counsel requires it. Paddle (merchant of record) may send its own notices; we never suppress those. **[LEGAL]** | `20` §6.2 or `03` F-PAY-08 |
| X6 | Live reminders: `10` §11.1 says T-24h and T-1h; `03` F-NOT-03 says SMS "class starting in 1 h" and F-NOT-05 push "15 min"; the brief says T-24h and T-15m. | Three slots: **T-24h** (email + in-app), **T-1h** (SMS/WhatsApp opt-in), **T-15m** (in-app + push). One template id per channel, `slot` prop. | `10` §11.1 |
| X7 | `10` §11.1 lists `weekly_progress_digest` on stream "marketing-like" while `03` treats it as an opt-out learning notice. | Opt-out class **product-updates** (default on, one-click unsubscribe), sent from the `news.` stream for reputation isolation. | none |
| X8 | `05` has no `email_suppression` / `email_outbox` tables although `10` §11.1 relies on them. | Replaced by one `contact_suppression` table (§8.3) that covers email, phone and WhatsApp; `email_log.dedupe_key` already gives idempotency. | `10` §11.1 text |
| X9 | `20` §6.2 says *all* lifecycle sequences are consent-gated; `05` defaults marketing off but `03` F-NOT-02 says learning nudges are opt-out. | Two tiers: educational messages that explain how to use the product are **product-updates** (opt-out) *except* for EU/UK residents, where they are treated as marketing (opt-in) by a region switch; anything with an offer, price or discount is always **marketing** (opt-in). **[LEGAL]** | `20` §9.1 cross-reference |
| X10 | `06` §7.1 `entitlement.expiring` / `notifications.renewal-reminder` and `10` §7.6 cron "daily 09:00 Asia/Dhaka" disagree on *who* schedules reminders (event queue vs cron). | Keep the `entitlement_reminder` unique-table approach (`10` §7.6) and the single event `entitlement.expiring`; the daily cron only emits events. | none |

## 1. Principles

1. **One gate.** Nothing sends an email/SMS/WhatsApp/push directly. Every send goes through `notifications.dispatch` (§10), which applies class, consent, suppression, quiet hours, caps, locale, idempotency and writes a ledger row. A lint rule forbids importing `EmailProvider`/`SmsProvider` outside `packages/core/src/notifications`.
2. **Domain events in, messages out.** Producers emit domain events through the outbox (`06` §7). They never know about channels. The catalogue maps event to messages.
3. **Calm, not coercive** (`03` principle 4, F-ENG): no fake urgency, no countdown-to-discount, no loss-aversion copy, no shaming. Streak and exam reminders are supportive and skippable.
4. **Bangla and English are both first-class.** Every learner-facing message ships in `en` and `bn`; the recipient's `user_profile.locale` decides (fallback `en`). Exam content quoted in a message stays English (`07` §7).
5. **No PII in links or analytics.** Links carry opaque signed tokens; message-level analytics use `template_id`, `locale`, `channel`, never addresses (see `32`).
6. **Minimal content over email.** Never include essay text, audio, scores beyond a headline, or full payment details. Deep-link to the signed-in app instead.
7. **Idempotent and replayable.** Every send has a `dedupe_key` (`<template>:<entityId>[:<slot>]`). Replaying an Inngest event never double-sends (`email_log.dedupe_key`, `notification_dispatch.dedupe_key`).

## 2. Policy engine (applies to every row in §3)

### 2.1 Opt-out classes

| Class (this doc) | Code | `notification_category` values mapped | User can opt out? | Default | Stream (email) | Examples |
|---|---|---|---|---|---|---|
| **Transactional** | `T` | `transactional`, `billing` | **No** (cannot be disabled; channel *choice* only for SMS/WhatsApp, see below) | on | `transactional` | receipt, payment status, refund status, pass expiry, results ready, data export ready, deletion notices, policy/legal notices |
| **Account-security** | `S` | `security` | **No** | on, all channels the user has verified | `transactional` | OTP, verify email, new device, 2FA/passkey/password change |
| **Product-updates** | `P` | `learning`, `community` | **Yes**, per channel, one click | on (email, in-app); SMS/WhatsApp/push off until opt-in | `notification` (digest on `marketing` subdomain, X7) | nudges, digest, onboarding tips, live reminders (see note), Q&A replies |
| **Marketing** | `M` | `marketing` | **Yes**; default **off**, explicit opt-in | off | `marketing` | offers, abandoned checkout, win-back, referral, newsletters |

Notes:
- `T` messages sent over SMS/WhatsApp (not OTP) still need a per-channel consent (X4). If the user has not consented to SMS, the same message goes by email + in-app only. In-app and email for `T`/`S` can never be switched off.
- Live-class reminders are `P` for learners who merely enrolled in a free event, but `T` for learners who **paid** for a Live/Plus/Mentor entitlement (a missed paid class is a service failure). The template catalogue marks this as `P*`.
- Class is a property of the catalogue row, not of the user. The dispatcher refuses to send a row whose declared class does not match its template stream (CI test).

### 2.2 Quiet hours

- Window: **22:00-08:00 in the recipient's timezone** (`user_profile.timezone`, default `Asia/Dhaka`; org admins and staff use their own profile timezone). Users can narrow or move the window in `/app/settings/notifications` (F-NOT-06) but cannot disable it for SMS/WhatsApp/push.
- `S` (security, OTP): **bypass** always, all channels.
- `T` over **email/in-app**: bypass (AC-NOT-01).
- `T` over **SMS/WhatsApp/push**: **defer to 08:00** *unless* the message is a direct response to something the user did in the last 15 minutes (receipt after checkout, payment-pending after return from gateway). This is a refinement of AC-NOT-01 that protects BD users from 3 a.m. SMS; it never delays anything the user is actively waiting for.
- `P` and `M`: **defer** to the next 08:00 (email, in-app badge still appears immediately but no push). Deferred sends are re-evaluated at release time (caps, pause, state may have changed); they are dropped, not sent late, if the trigger is stale (e.g. class already started, test already taken).
- Under-18 (`age_band` in `under_13, 13_15, 16_17`): streak/reminder nudges and all `P` SMS/push **not after 20:00** (F-ENG-07). Under-13 accounts do not exist for self-signup (`09` §13.3, [B]); guardian-created minors get the same rule.

### 2.3 Frequency caps

| Cap code | Applies to | Rule | Exempt |
|---|---|---|---|
| `C0` | `T`, `S`, staff queue alerts | None (still deduped by entity) | n/a |
| `C1` **nudge cap** | `P` learning nudges (streak, plan, vocab due, exam countdown, free-credit reset, onboarding tips) | **Max 1 per day and 4 per rolling 7 days across all channels** (F-NOT-07). Counted in `notification_dispatch` by `cap_class='nudge'`. When two nudges compete, priority: exam countdown T-1 > exam countdown T-7 > live class (non-paid) > streak at risk > plan > vocab due > onboarding tip > free-credit reset. Losers are dropped (not queued) unless marked `deferrable` (onboarding tips slide by a day, max 2 days). | `T`, `S`, digest |
| `C2` **per-entity once** | one-shot messages bound to an entity (`entitlement_reminder`, order, refund, session) | Exactly once per `(template, entity, slot)` via `dedupe_key`. | n/a |
| `C3` **digest** | `weekly_progress_digest`, org cohort report, guardian report | 1 per period; counts as **one** of the 4 weekly nudges for learners (digest wins ties over other nudges that day). | n/a |
| `C4` **marketing cap** | `M` | **Max 2 per rolling 7 days and 6 per 30 days across all marketing templates**, never more than 1 per 24 h; sequences (abandoned checkout, win-back) are cut short rather than stacked. [A] values; tune after launch with complaint rate (§9). | n/a |
| `C5` **SMS non-OTP** | any non-OTP SMS | Max 3 per user per 7 days outside `T` payment/refund/instalment messages; hard daily spend alarm (§5.5). | OTP uses its own limits (`10` §11.2) |
| `C6` **security burst** | `S` non-OTP | Same template to same user max once per 10 min (prevents mail-bomb via repeated sign-ins). | OTP |

Global rule: a user who pressed **"Pause nudges for 7 days"** (F-NOT-06, AC-NOT-02) receives no `P`/`M` at all for 7 days; `T`/`S` are unaffected. Setting is stored as `notification_setting.paused_until`.

### 2.4 Hard rules

- **R-MINOR:** under-18 users and guardians-of-minors-as-contacts never receive `M`. Enforced three times: DB check on `user_profile.marketing_opt_in` (exists), dispatcher check on `age_band`, and a CI test that every `M` template is rejected for a minor fixture.
- **R-SUPPRESS:** contact in `contact_suppression` (hard bounce, complaint, SMS opt-out/STOP, deleted account) -> `suppressed` ledger row, no send. `S` OTP bypasses *marketing/complaint* suppression but **not** hard-bounce suppression (`10` §11.1).
- **R-CONSENT:** `M` and non-`T` SMS/WhatsApp need a latest-wins `consent_record` of status `granted`. Region switch for EU/UK (X9): billing/IP country + self-declared country in `{EU27, UK, EEA, CH}` -> `P` onboarding/educational emails are routed as `M`. Double opt-in (confirmation email) for EU/UK marketing sign-ups outside checkout (`20` §9.1).
- **R-DELETED:** accounts with `deleted_at` or a pending deletion get only the deletion/export templates and `S` OTP; all `P`/`M` stop at the moment deletion is **requested**, not when it executes.
- **R-NOPII-SUBJECT:** subject lines and preheaders may include first name and product names only; never score, essay prompt, order amount, or health/accommodation info.
- **R-BAN-DARK:** no countdown timers that reset, no "only N left", no "your friends are ahead", no purchased streak repair (F-ENG).

### 2.5 Dispatcher decision order

```
event -> catalogue lookup -> resolve recipients -> for each recipient x channel:
  1. account state (deleted / pending deletion / suspended)   -> drop
  2. class + consent + preference matrix + pause              -> skip(reason)
  3. contact validity + suppression (+ phone verified for SMS) -> suppressed(reason)
  4. minor rules, region switch                                -> skip / reroute class
  5. locale resolve, template props validated (zod)           -> fail loudly (Sentry)
  6. quiet hours -> deferred(until) (re-check at release)
  7. caps (C1..C6)                                             -> dropped(cap)
  8. idempotency (dedupe_key)                                  -> already_sent
  9. render + send via provider; write email_log / message row; in_app row always last
every outcome (sent, deferred, skipped, suppressed, dropped, failed) is one notification_dispatch row
```

Why log skips: support must answer "why didn't I get my reminder?" and lifecycle must measure cap pressure.

## 3. Catalogue

### 3.0 Legend

- **Ph**: phase the row ships. P0/P1/P2/P3 per D1. Rows whose domain feature ships later are listed now so templates and events are reserved.
- **Channels**: `IA` in-app (bell, `notification` row), `E` email, `S` SMS, `W` WhatsApp (P2, opt-in), `PU` push (web push P2 via PWA; native push P3). Parentheses = optional/opt-in channel. First listed = primary.
- **Locale**: `en+bn` = both authored and tested; the learner's locale picks; `en` = English only (staff tooling, international-only).
- **Class**: `T` transactional, `S` account-security, `P` product-updates, `M` marketing (§2.1). `P*` = `T` for paid entitlement holders (see §2.1 notes).
- **Q** (quiet hours): `byp` = bypass; `def` = defer to 08:00; `smsdef` = bypass for email/in-app, defer for SMS/WhatsApp/push (§2.2).
- **Cap**: `C0..C6` (§2.3).
- **Owner**: function accountable for copy, KPI and incident response. `lifecycle` = lifecycle/growth lead; `product` = learner product; `sec` = security/auth eng; `fin` = finance role; `support` = support lead; `ops` = live-class/ops coordinator; `acad` = academic lead (content editor lead + grader pool); `org` = B2B account manager; `legal` = counsel via founder; `eng` = platform eng; `privacy` = DPO/privacy owner.
- **Template id**: ★ = already named in `10` §11.1. `sms_*`, `wa_*` are SMS/WhatsApp ids (§5, §7); everything else is an email id with a matching in-app `content` i18n key `notif.<template_id>.title|body` (`05` `notification.content`).
- **Timing**: "immediate" = enqueue within 5 s of event; delays measured from the trigger event; times are recipient-local unless stated.

### 3.1 Authentication and account security

| ID | Event | Trigger (domain event) | Audience | Channels | Template id | Timing | Loc | Class | Q | Cap | Owner | Ph |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| N-AUTH-01 | Email sign-in/sign-up code | `auth.otp_requested` {channel:email} [NEW-ev; emitted by Better Auth `emailOTP.sendVerificationOTP`] | any user | E | `otp_code` ★ | immediate; 6 digits, **5 min** TTL, 5 attempts; link tracking off | en+bn | S | byp | C0 (rate limits per `10` §11.2/`09`) | sec | P0 |
| N-AUTH-02 | Phone sign-in/sign-up code | `auth.otp_requested` {channel:sms} | any user with +880 (or intl where enabled) | S | `sms_otp` | immediate; 5 min, 5 attempts; kill switch `SMS_OTP_ENABLED` | en (GSM-7); bn variant optional [U gateway approval] | S | byp | C0 | sec | P0 |
| N-AUTH-03 | Verify email address (link) | `auth.email_verification_requested` [NEW-ev] | new or changed email | E | `verify_email` ★ | immediate; link valid **60 min**; resend limited 3/h | en+bn | S | byp | C6 | sec | P0 |
| N-AUTH-04 | Magic-link sign-in | `auth.magic_link_requested` [NEW-ev] (if `magicLink` plugin enabled) | any user | E | `magic_link` | immediate; **5 min** TTL (same as OTP; proposal, not in D12) | en+bn | S | byp | C6 | sec | P0 |
| N-AUTH-05 | Welcome after first verified sign-in | `user.signed_up` + verified (consumer `identity.provision-new-user`) | new learner | E, IA | `welcome` ★ | immediate (D0 of the onboarding sequence, N-ONB-01) | en+bn | P | def | C1 | lifecycle | P0 |
| N-AUTH-06 | New device / new location sign-in | `auth.new_device_sign_in` [NEW-ev; Better Auth `session.create.after` when device hash unseen in 90 days] | any user (mandatory for staff, `instructor`, `org_admin`, `counsellor`) | E, IA | `security_new_device` | immediate; contains device label, approx city (Cloudflare `cf-ipcity`), time with offset, signed single-use "Not me - sign out everywhere and reset" link (`09` §3 device list) | en+bn | S | byp | C6 (max 1 per device per 30 days; skipped for the very first session after sign-up) | sec | P1 |
| N-AUTH-07 | 2FA enabled / disabled / backup codes regenerated | `auth.two_factor_changed` {action} [NEW-ev] | user | E, IA | `security_2fa_changed` | immediate | en+bn | S | byp | C6 | sec | P1 |
| N-AUTH-08 | Lost-2FA recovery started (24 h delayed disable) | `auth.two_factor_disable_requested` [NEW-ev] | user | E, IA, (S if phone verified) | `security_2fa_disable_pending` | immediate, then reminder at +12 h and +23 h with cancel link (`09` §3 "notifications to all channels") | en+bn | S | byp | C6 exempt for these three | sec | P1 |
| N-AUTH-09 | Passkey added / removed | `auth.passkey_changed` {action} [NEW-ev] | user | E, IA | `security_passkey_changed` | immediate | en+bn | S | byp | C6 | sec | P1 |
| N-AUTH-10 | Password set / changed / reset (only if a password credential exists) | `auth.password_changed` [NEW-ev] | user | E, IA | `security_password_changed` | immediate; sessions rotated (`09` rotation table) | en+bn | S | byp | C6 | sec | P1 |
| N-AUTH-11 | Email or phone changed | `auth.contact_changed` {kind, old, new} [NEW-ev] | **old** email (and new) | E (old + new), (S to old phone) | `security_contact_changed` | immediate; old-contact sessions revoked; includes "Not me" link valid 24 h (`09` SIM-swap policy 4) | en+bn | S | byp | C6 | sec | P1 |
| N-AUTH-12 | Sessions revoked ("sign out everywhere") confirmation | `auth.sessions_revoked` [NEW-ev] | user | IA, E | `security_sessions_revoked` | immediate | en+bn | S | byp | C6 | sec | P1 |
| N-AUTH-13 | Suspicious activity / lock (OTP brute-force, impossible travel [A]) | `security.suspicious_activity` (from `event=security.*` logs, `11` §5.3) | user | E, IA | `security_suspicious_activity` | immediate; max 1 per 24 h | en+bn | S | byp | C6 | sec | P1 |
| N-AUTH-14 | Role granted / revoked (esp. staff, org_admin) | `role.granted` / `role.revoked` (`06` §7.1, consumer `notifications.notify-user`) | affected user, plus audit | E, IA | `role_changed` | immediate; staff roles include "Set up 2FA within 24 h" CTA (D4) | en | S | byp | C0 | sec | P1 |
| N-AUTH-15 | 2FA enrolment reminder for roles that require it | cron daily over `user_role` without `two_factor`/passkey | staff, instructor, org_admin, counsellor | E, IA | `staff_2fa_required` | day 0, 1, 3, 7 then access restricted (`09`) | en | S | byp | C0 | sec | P1 |
| N-AUTH-16 | Impersonation notice (support read-only session) | `support.impersonation_started` [NEW-ev] | the impersonated user (after the session ends, to avoid tipping off fraud cases; owner confirms policy) | E | `support_access_notice` | at session end, within 1 h; no content, only that support viewed the account with the stated reason category | en+bn | T | byp | C0 | privacy | P1 |

### 3.2 Onboarding sequence D0-D14 (new learners, Free tier)

Sequence engine: Inngest function `notifications.onboarding-sequence` started by `user.onboarded` (or `user.signed_up` if onboarding is skipped), one durable run per user with `step.sleepUntil` to the next recipient-local 10:00 and `cancelOn` for exit events. Table `lifecycle_enrolment` (§8.5) mirrors state for reporting and support. All steps count toward cap `C1` and are `deferrable` (slide 1 day, max 2). Steps with an offer are class `M`.

Branches (evaluated at send time, not at enrolment): `diagnostic_done`, `first_mock_done`, `first_ai_eval_done`, `purchased` (any paid entitlement), `minor`, `eu_uk`. Exit events: `order.paid` (switch to post-purchase sequence N-ONB-12..13), `privacy.deletion_requested`, unsubscribe, pause, `user.inactive_sunset`.

| ID | Day | Message | Condition to send | Channels | Template id | Class | Goal / KPI (see `32`) |
|---|---|---|---|---|---|---|---|
| N-ONB-01 | D0 (immediate) | Welcome and "Start your diagnostic (20 min)" | always | E, IA | `welcome` ★ | P | `diagnostic_started` within 24 h |
| N-ONB-02 | D0 (immediate if `diagnostic_done`) | Your diagnostic results and plan | diagnostic completed pre-signup (guest flow, `03` AC diag) | IA, E | `onboarding_diagnostic_results` | P | `plan_viewed` |
| N-ONB-03 | D1 | How to read your **estimated** band (and why it is an estimate) | not `first_mock_done` | E, IA | `onboarding_read_your_band` | P | `first_mock` activation |
| N-ONB-04 | D2 | Weak-skill drill: 10 questions on your lowest skill | `diagnostic_done` | E, IA | `onboarding_weak_skill_drill` | P | `practice_session_started` |
| N-ONB-05 | D3 | Your first full mock: 3 tips (time, breaks, device) | not `first_mock_done` | E, IA, (PU) | `onboarding_first_mock_tips` | P | activation (35% within 7 days, `02` §14) |
| N-ONB-06 | D5 | Set your exam date (unlocks countdown and plan) | no `exam_date` | IA, E | `onboarding_set_exam_date` | P | `exam_date_set` |
| N-ONB-07 | D6 | What the AI got right and wrong - our accuracy page; try your free AI evaluation | not `first_ai_eval_done` and credits > 0 | E, IA | `onboarding_ai_accuracy` | P | `evaluation_requested` |
| N-ONB-08 | D8 | Social proof: verified outcomes (not guarantees) + Free vs Core vs Pass explained plainly | not `purchased`, not `minor`, consent `M` | E | `onboarding_paths_explained` | **M** | `pricing_viewed` |
| N-ONB-09 | D10 | Pick your path (test-agnostic: IELTS / GRE / PTE / DET / English Foundation) | not `purchased` | E, IA | `onboarding_pick_your_path` | P (M if `eu_uk`) | `course_enrolled` |
| N-ONB-10 | D12 | Study-habit message: "choose a reminder time" (links to F-NOT-06) | no reminder time set | IA, E | `onboarding_set_reminders` | P | reminder opt-in rate |
| N-ONB-11 | D14 | Check-in: "How is it going?" 1-tap survey + help link (no offer) | always unless paused | E, IA | `onboarding_checkin` | P | `nps_submitted`, replies to support |
| N-ONB-12 | post-purchase D0 | "How to start" for what you bought (course, pass, pack) | `order.fulfilled` | E, IA | `post_purchase_how_to_start` | T | first lesson/mock within 48 h |
| N-ONB-13 | post-purchase D3 | Nudge to first lesson/mock if none yet | purchased and no activity | E, IA | `post_purchase_first_step` | P | `lesson_started` |
| N-ONB-14 | on first Free credit use | "You have N credits left; Free gets 1 new credit each month" | `credits.adjusted` to 0 or 1 | IA | `credits_low` | P | n/a |

Minors skip N-ONB-08 entirely (R-MINOR). The D10 "pick your path" mail never mentions a price. Post-diagnostic follow-up from `20` §6.2 (D0 results+plan, D2 weak-skill drill, D5 social proof, D9 offer) is merged into the single timeline above so that no learner receives two parallel sequences.

### 3.3 Learning nudges and digests

| ID | Event | Trigger | Audience | Channels | Template id | Timing | Loc | Class | Q | Cap | Owner | Ph |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| N-LRN-01 | Study reminder / plan "today" | cron hourly, per learner-local reminder time (default 19:00 if enabled; never after 21:00, minors 20:00) when plan has pending task and no activity today | learner with plan | IA, (E), (PU) | `plan_today_reminder` | at the chosen reminder time | en+bn | P | def | C1 | product | P1 (P1 shows NBA list; adaptive P2) |
| N-LRN-02 | Streak at risk | same cron; learner has streak >= 3, no qualifying activity today, no freeze left; skipped if "hide streak" set or rest day (F-ENG-02/03/07) | streak holders | IA, (PU), (E) | `streak_at_risk` | local 18:30; copy: "A short session today keeps your {n}-day streak. No pressure." | en+bn | P | def (cut-off 21:00 / 20:00 minors) | C1 (priority 4) | product | P2 |
| N-LRN-03 | Streak milestone (7/30/100) | `streak.updated` -> `notifications.streak-milestones` | learner | IA, E (opt) | `streak_milestone` | immediate | en+bn | P | def | C1 | product | P2 |
| N-LRN-04 | Streak freeze used | cron after local midnight | learner | IA | `streak_freeze_used` | morning, neutral wording (AC-ENG-01) | en+bn | P | def | C1 | product | P2 |
| N-LRN-05 | Vocabulary due | `vocab.due_count` computed hourly; reminder time opt-in (F-VOC-05) | learner who set a reminder | IA, (PU), (E) | `vocab_due_reminder` | chosen time | en+bn | P | def | C1 | product | P1 |
| N-LRN-06 | Weekly progress digest | cron hourly, sends where recipient-local = chosen day/time (default **Sunday 18:00**; `10` §11.1 says Asia/Dhaka for BD) | active learners (>= 1 activity in 28 days) | E, IA | `weekly_progress_digest` ★ | weekly; skipped if zero activity AND zero plan items (avoid empty mail) | en+bn | P | def | C3 | lifecycle | P1 (goal ring and streak lines appear in P2) |
| N-LRN-07 | Plan reminders: plan created / re-planned | `studyplan.created` / `studyplan.replanned` | learner | IA, E (first only) | `studyplan_ready` | immediate | en+bn | P | def | C1 | product | P1 / P2 |
| N-LRN-08 | Exam countdown T-30 | cron daily, `exam_date - 30d` | learner with exam date | E, IA | `exam_countdown_t30` | local 10:00; pacing plan, mock count reminder | en+bn | P | def | C1 (prio 2) | lifecycle | P1 |
| N-LRN-09 | Exam countdown T-7 | `exam_date - 7d` | same | E, IA, (PU), (W) | `exam_countdown_t7` | local 10:00; checklist (ID, route, device), taper advice | en+bn | P | def | C1 (prio 2) | lifecycle | P1 |
| N-LRN-10 | Exam countdown T-1 | `exam_date - 1d` | same | IA, E, (PU), (S opt-in) | `exam_countdown_t1` | local 17:00; sleep, documents, calm tone; no new drills | en+bn | P | def (never after 21:00) | C1 (prio 1) | lifecycle | P1 |
| N-LRN-11 | Test day +1 "How did it go?" | `exam_date + 1d` | same | E, IA | `exam_post_test_survey` | local 10:00; links to opt-in self-reported result form | en+bn | P | def | C1 | lifecycle | P1 |
| N-LRN-12 | Retake plan T+14 | `exam_date + 14d` and no new exam date | same | E | `exam_retake_plan` | local 10:00 | en+bn | P | def | C1 | lifecycle | P2 |
| N-LRN-13 | Extended countdown (T-60, T-14, T-2) from `20` §6.2 | cron | same | E, IA | `exam_countdown_t60` / `_t14` / `_t2` | optional; disabled by default, enabled per A/B in `32` (the 4/week cap still applies) | en+bn | P | def | C1 | lifecycle | P2 |
| N-LRN-14 | Free AI credit reset | cron 1st of month, local 10:00 (Free: +1 credit/month, no rollover, D12) | Free-tier learners with exam goal | IA, E | `free_credit_reset` | monthly; skipped if already holding 2+ unused credits | en+bn | P | def | C1 (prio 7) | lifecycle | P1 |
| N-LRN-15 | Exam date passed without update | cron | learner | IA | `exam_date_update_prompt` | the day after | en+bn | P | def | C1 | product | P1 |
| N-LRN-16 | Q&A answer / reply on your question | `answer.created` -> `notifications.notify-thread-author` | thread author | IA, (E) | `qa_answer_posted` | immediate; email batched hourly | en+bn | P | def | C1 exempt (user-initiated) | product | P2 |
| N-LRN-17 | Course updated (editor flagged "notify") | `course.published` {notify} -> `learning.notify-enrolled-of-update` | enrolled learners | IA, (E) | `course_updated` | immediate, max 1 per course per 30 days | en+bn | P | def | C1 | acad | P1 |
| N-LRN-18 | Course completed + review prompt | `course.completed` -> `notifications.course-complete`, `community.prompt-review` | learner | IA, E | `course_completed` | immediate; review prompt D+2 (once) | en+bn | P | def | C1 | product | P1 |
| N-LRN-19 | Certificate issued | `certificate.issued` [NEW-ev] (`learning.issue-certificate`) | learner | E, IA | `certificate_issued` ★ | immediate; verify link `/verify/[code]` (128-bit code, C11) | en+bn | P | def | C0 | product | P1 (D12 C4) |
| N-LRN-20 | Achievement unlocked | `achievement.unlocked` [NEW-ev] | learner | IA | `achievement_unlocked` | immediate, in-app only | en+bn | P | n/a | none | product | P2 |
| N-LRN-21 | NPS survey (quarterly) | cron per user, >= 21 days since signup, not asked in 90 days | active learners | IA | `nps_prompt` | in-app card; no email | en+bn | P | n/a | max 1 per 90 days | product | P1 |

### 3.4 Mock tests and evaluations (AI and human)

| ID | Event | Trigger | Audience | Channels | Template id | Timing | Loc | Class | Q | Cap | Owner | Ph |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| N-EVL-01 | Mock/section results ready | `attempt.scored` -> `notifications.results-ready` | learner (and `org_admin` aggregate via N-ORG-05) | IA, E (PU if opted in) | `results_ready` | immediate; skipped in e-mail if user is still active in app (in-app only if last request < 2 min ago) | en+bn | T | byp | C0 | product | P1 |
| N-EVL-02 | AI evaluation ready | `evaluation.completed` {source:ai} -> `notifications.evaluation-ready` | learner | IA, E, (PU) | `evaluation_ready` ★ | immediate (SLA: 60 s p95 writing, 3 min speaking, `03` AC-AIW-01, AC-AIS-03); **no essay text** | en+bn | T | byp | C0 | acad | P1 |
| N-EVL-03 | Human review complete / AI band overridden | `evaluation.completed` {source:human} or `evaluation.overridden` | learner | IA, E | `evaluation_ready` (variant `source=human`) | immediate | en+bn | T | byp | C0 | acad | P1 |
| N-EVL-04 | Evaluation failed, credit returned | `evaluation.failed` -> `evaluation.reverse-credit`, `notifications.evaluation-failed` | learner | IA, E | `evaluation_failed` | immediate after credit reversal confirmed; apologises, offers resubmit link | en+bn | T | byp | C0 | acad | P1 |
| N-EVL-05 | Human review requested / assigned (receipt) | `evaluation.human_requested` | learner | IA | `human_review_requested` | immediate, shows SLA (48 h) | en+bn | T | byp | C0 | acad | P1 |
| N-EVL-06 | Human review overdue (SLA breach) | `evaluation.sla-watch` at `sla_due_at` | learner | IA, E | `human_review_delayed` | at breach; apology, new ETA, option of AI-only result now | en+bn | T | byp | C0 | acad | P1 |
| N-EVL-07 | Credits low (<= 1 left) | `credits.adjusted` -> `notifications.credits-low` | paid learners | IA | `credits_low` | immediate, max 1 per balance-crossing; **not** an upsell email (in-app card may show add-ons) | en+bn | P | def | C1 | lifecycle | P1 |
| N-EVL-08 | Time extension granted (accommodation or support) | `attempt.time_extended` -> `notifications.notify-user` | learner | IA | `attempt_time_extended` | immediate | en+bn | T | byp | C0 | support | P1 |
| N-EVL-09 | Answer key corrected - your result changed | `question.corrected` + `attempt.rescored` [NEW-ev] (GA-044 trust event) | affected learners | IA, E | `result_rescored` | within 24 h of rescore completion; states what changed and the new score | en+bn | T | byp | C0 | acad | P1 |
| N-EVL-10 | Attempt interrupted, re-issue / credit granted (D12 GA-007) | `attempt.voided` / `attempt.credit_granted` [NEW-ev] | learner | IA, E | `attempt_reissued` | immediate | en+bn | T | byp | C0 | support | P1 |
| N-EVL-11 | Abandoned in-progress attempt (practice) | `attempt.abandoned` cron (`11` §5.4) | learner | IA | `attempt_resume` | 2 h after last activity, in-app only; not for exam-mode (cannot resume) | en+bn | P | def | C1 | product | P1 |

### 3.5 Live classes (P1 Zoom pilot, P2 in-app scheduling; see `18`)

P1: ops creates the session in the admin form, which emits `live.session_scheduled` [NEW-ev]; reminders then run normally. P2: events come from the scheduler.

| ID | Event | Trigger | Audience | Channels | Template id | Timing | Loc | Class | Q | Cap | Owner | Ph |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| N-LIV-01 | Session scheduled / enrolled in batch | `live.session_scheduled`, `enrollment.created` {live_batch} | enrolled learners | IA, E (.ics attached, UTC + IANA zone, DST-safe, `20` §6.3) | `live_class_scheduled` | immediate | en+bn | P* | smsdef | C2 | ops | P1 |
| N-LIV-02 | Reminder T-24h | `live.reminder_due` {slot:24h} (Inngest `step.sleepUntil(start-24h)`) | enrolled learners | E, IA | `live_class_reminder` ★ (slot 24h) | start - 24 h; time shown in recipient timezone with UTC offset | en+bn | P* | smsdef | C2 | ops | P1 |
| N-LIV-03 | Reminder T-1h | slot:1h | opted-in learners | S, (W), (E) | `sms_class_starting`, `wa_class_reminder` | start - 60 min; **SMS only if opted in** (F-NOT-03) | en+bn | P* | smsdef | C2 | ops | P2 |
| N-LIV-04 | Reminder T-15m | slot:15m | enrolled learners | IA, (PU) | `live_class_reminder` ★ (slot 15m, in-app/push body only) | start - 15 min with join button (token issued at click time, not in message) | en+bn | P* | smsdef | C2 | ops | P1 (IA) / P2 (web push) |
| N-LIV-05 | Session cancelled / rescheduled / link changed | `live.session_changed` [NEW-ev] | enrolled learners | IA, E, (S), (W) | `live_class_changed` | immediate; supersedes pending reminders (cancel Inngest runs via `cancelOn`) | en+bn | T | byp | C0 | ops | P1 |
| N-LIV-06 | Recording ready | `media.ready` for recording asset linked to session (`live.recording_ready` [NEW-ev]) | enrolled learners incl. absentees | IA, E | `live_recording_ready` | on ready; includes expiry date (batch end + 30 days default, `18` §2.6) and catch-up quiz link (`18` attendance credit rules) | en+bn | P* | def | C2 | ops | P1 |
| N-LIV-07 | Attendance warning (< 80%) | `live.attendance_below_threshold` [NEW-ev] (weekly cron) | learner, mentor | IA, E | `live_attendance_warning` | weekly, max 1 per 14 days; supportive tone; mentor gets list | en+bn | P* | def | C1 | ops | P2 |
| N-LIV-08 | Speaking Club booking confirmed / no-show pause | `speaking_club.booked` / `no_show_pause` [NEW-ev] | learner | IA, E | `speaking_club_update` | immediate | en+bn | P* | smsdef | C2 | ops | P2 |
| N-LIV-09 | Instructor/mentor: session starts in 15 min, roster | `live.reminder_due` {role:host} | host | E, IA | `live_host_reminder` | T-60 min and T-15 min | en | T | byp | C2 | ops | P2 |

### 3.6 Commerce: checkout, payments, passes, instalments, refunds

All commerce messages are `T` unless marked. `receipt` and `invoice` follow `10` §2.6 step 10 (post-fulfilment) and the `invoice.issued` consumer; amounts and VAT lines come from the order snapshot, never recomputed. P1 is single-item **Buy now** (D12/C24); carts are P2 and do not change these templates (they list N items).

| ID | Event | Trigger | Audience | Channels | Template id | Timing | Loc | Class | Q | Cap | Owner | Ph |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| N-COM-01 | Buy-now receipt | `order.paid` -> `notifications.send-receipt`; `invoice.issued` attaches PDF (`commerce.issue-invoice`) | payer (and recipient if different; guardian copy N-GRD-04) | E (PDF), IA, (S), (W) | `receipt` ★ (+ `sms_payment_received`, `wa_receipt`) | immediate after fulfilment (access is unlocked by the time the mail arrives); resend by `support`/self-serve | en+bn | T | smsdef (SMS allowed immediately if within 15 min of checkout) | C0 | fin | P1 |
| N-COM-02 | Invoice issued (separate document mail) | `invoice.issued` | payer | E (PDF) | `invoice` ★ | immediate when Mushak/tax invoice is generated later than the receipt (accountant decision [U], `10` §6.1) | en+bn | T | byp | C0 | fin | P1 |
| N-COM-03 | Access ready ("Start learning") | `order.fulfilled` -> `notifications.access-ready` | recipient | IA | `access_ready` | immediate | en+bn | T | byp | C0 | product | P1 |
| N-COM-04 | Payment pending / verifying | `payment.verifying` [NEW-ev] emitted when the buyer returns from gateway and order is still `pending` after 60 s (matches `10` §2.4 UI) | payer | IA, E, (S) | `payment_pending` (+ `sms_payment_verifying`) | at +60 s: IA only; at +10 min still pending: E + SMS (opted) | en+bn | T | smsdef | C0 | fin | P1 |
| N-COM-05 | Payment failed / cancelled | `payment.failed` -> `notifications.payment-failed` | payer | IA, E | `payment_failed` ★ | immediate; retry link creates a **new payment attempt on the same order if quote still valid** (`10` §2.4) | en+bn | T | byp | C0 | fin | P1 |
| N-COM-06 | **bKash/Nagad debited, no access (reconciliation notice)** | `payment.reconcile_delayed` [NEW-ev] from `reconcilePendingPayments` (`10` §2.7) when gateway/bank evidence of debit exists but `verifyPayment` is not yet `paid`; opens a W-SUP-PAYFAIL item (`03`) | payer | E, IA, S (opted-in), (W) | `payment_debited_no_access` | at +30 min after return if still unresolved: "We can see your payment attempt, we are confirming it, you do not need to pay again, order {number}"; then **resolution notice** within 5 min of resolution: `payment_reconciled` ("Access unlocked") or, if not validated within 24 h, `payment_refund_initiated` (auto-refund path, ETA text [U]); status line always reflects `order.status`, never promises | en+bn | T | smsdef (first message bypass if within 15 min of checkout) | C0 | support | P1 |
| N-COM-07 | Payment resolved after delay | `payment.reconciled` [NEW-ev] (reconcile job or IPN late arrival) | payer | IA, E, (S) | `payment_reconciled` | within 5 min of fulfilment | en+bn | T | smsdef | C0 | fin | P1 |
| N-COM-08 | Payment held for review (`held_review`) | `payment.held_review` [NEW-ev] | payer | IA, E | `payment_under_review` | immediate; "we will contact you within 24 hours" (`10` §2.4) | en+bn | T | byp | C0 | fin | P1 |
| N-COM-09 | Abandoned checkout (3 steps) | `order.created` + no `order.paid` (Inngest `step.waitForEvent('order.paid', timeout)`); stop on `order.cancelled`/`expired`-then-repurchase | payer with `M` consent, not minor | E, IA (banner "Resume checkout" is not consent-gated and always on) | `abandoned_checkout_1h`, `_24h`, `_72h` | +1 h: gentle reminder with resume link (new quote if expired); +24 h: "Questions?" with support/FAQ and refund-rule summary; +72 h: FAQ + refund rule. **No countdown, no discount, no fake urgency** (`20` §6.2). Order expiry is 30 min (`05`), so mails link to `/checkout?resume=<token>` which re-quotes | en+bn | M | def | C4 | lifecycle | P1 |
| N-COM-10 | Pass expiry T-7 | `entitlement.expiring` {daysLeft:7}, cron 09:00 Asia/Dhaka (`10` §7.6) | pass holder (BD prepaid) | E, IA | `renewal_reminder_7d` ★ | once (`entitlement_reminder` unique); skipped if a queued pass exists; neutral copy (what stays accessible: progress and results, content locks; AC-PAY-05) | en+bn | T | smsdef | C2 | fin | P1 |
| N-COM-11 | Pass expiry T-1 | `entitlement.expiring` {daysLeft:1} | same | E, IA, (S), (W) | `renewal_reminder_1d` ★ (+ `sms_pass_expiry_1d`, `wa_renewal_reminder`) | once; SMS only if opted in | en+bn | T | smsdef | C2 | fin | P1 |
| N-COM-12 | Pass expired / access ended | `entitlement.expired` -> `notifications.access-ended` | holder | IA, E | `pass_expired` ★ | within 5 min of expiry (AC-PAY-05) | en+bn | T | byp | C0 | fin | P1 |
| N-COM-13 | Course/tier access expiry T-30 / T-7 / T-1 (Core 6-month access) | `entitlement.expiring` | course holders | E, IA | `renewal_reminder_7d` / `_1d` (same ids, `kind` prop) + `access_expiry_30d` | T-30 informs; renewals optional | en+bn | T | smsdef | C2 | fin | P1 |
| N-COM-14 | International auto-renew notice | provider schedule (`subscription.renewal_upcoming` [NEW-ev], from Paddle/Stripe webhook) | subscriber | E | `subscription_renewal_notice` | T-7 (X5), optional T-14/T-3 by region; shows amount, date, cancel link | en | T | byp | C2 | fin | P2 |
| N-COM-15 | Subscription renewed / dunning | `subscription.renewed`; `invoice.payment_failed` (provider) | subscriber | E, IA | `subscription_renewed`, `payment_failed` ★ (dunning variant: day 0, 3, 7, then cancel) | per provider retry schedule; stop on success | en | T | byp | C0 | fin | P2 |
| N-COM-16 | Instalment due soon | `instalment.due_soon` [NEW-ev] (2-3 part bKash plans for Live/Mentor, D10; table from GA-001 resolution) | payer | E, IA, (S), (W) | `instalment_due` (+ `sms_instalment_due`, `wa_instalment_due`) | T-3 days and day of due date | en+bn | T | smsdef | C2 | fin | P2 |
| N-COM-17 | Instalment missed | `instalment.missed` [NEW-ev] | payer | E, IA, (S) | `instalment_missed` | +1 day (friendly), +3 days (grace ending), +7 days (access hold notice). Wording factual, no threats; hold rules defined in `30`/`26` [LEGAL] | en+bn | T | smsdef | C2 | fin | P2 |
| N-COM-18 | Instalment paid / plan completed | `instalment.paid` [NEW-ev] | payer | IA, E | `instalment_received` | immediate | en+bn | T | byp | C0 | fin | P2 |
| N-COM-19 | Refund requested (acknowledgement) | `refund.requested` | requester | IA, E | `refund_requested` | immediate; shows policy basis (7 days / < 20% consumed / AI credits consumed, D5) and expected review time | en+bn | T | byp | C0 | fin | P1 |
| N-COM-20 | Refund approved / processing | `refund.approved` | requester | IA | `refund_processing` | immediate (in-app status only to avoid mail noise) | en+bn | T | byp | C0 | fin | P1 |
| N-COM-21 | Refund succeeded | `refund.succeeded` -> `notifications.refund-result` | requester | E, IA, (S), (W) | `refund_confirmation` ★ (+ `sms_refund_result`) | immediate; method, amount, ETA by provider (BD wallet timing [U], `10` §11.1) | en+bn | T | smsdef | C0 | fin | P1 |
| N-COM-22 | Refund rejected / failed | `refund.rejected`, `refund.failed` | requester | E, IA | `refund_declined`, `refund_failed` | immediate; decline states the policy clause and appeal path to support | en+bn | T | byp | C0 | fin | P1 |
| N-COM-23 | Coupon/scholarship decision | `scholarship.decided` [NEW-ev] (Access programme, D10) | applicant | E, IA | `scholarship_decision` | within SLA; approved includes code and expiry | en+bn | T | byp | C0 | fin | P1 |
| N-COM-24 | Mentor Progress Promise claim updates | `guarantee_claim.status_changed` [NEW-ev] (D12/C13) | claimant | E, IA | `guarantee_claim_update` | at each state | en+bn | T | byp | C0 | support | P1 |
| N-COM-25 | Support extended access (<= 7 days) | `entitlement.extended` [NEW-ev] | holder | IA, E | `access_extended` | immediate | en+bn | T | byp | C0 | support | P1 |
| N-COM-26 | Referral invite / reward | `referral.rewarded` [NEW-ev] (`20` §6.2, "give one free AI evaluation, get one") | referrer, referee | IA, E | `referral_reward` | on reward | en+bn | M | def | C4 | lifecycle | P2 |

### 3.7 Guardian and family (P2, `03` guardian dashboard)

| ID | Event | Trigger | Audience | Channels | Template id | Timing | Loc | Class | Q | Cap | Owner | Ph |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| N-GRD-01 | Guardian invitation | `guardian.invited` -> `notifications.send-guardian-invite` | guardian email | E | `guardian_invite` | immediate; signed token, 7-day validity [A]; states exactly what the guardian will see | en+bn | T | byp | C6 | product | P2 |
| N-GRD-02 | Guardian consent code (under-18 flow, `consent_method=guardian_otp`) | `guardian.consent_requested` [NEW-ev] | guardian email/phone | E, S | `guardian_otp` / `sms_guardian_otp` | immediate; 6 digits, **5 min**, 5 attempts | en+bn | S | byp | C0 | sec | P1 (minor flow F-ONB) |
| N-GRD-03 | Link granted / declined / revoked | `guardian.link_granted` / `link_revoked` -> `notifications.notify-student` | student and guardian | IA, E | `guardian_link_update` | immediate | en+bn | T | byp | C0 | product | P2 |
| N-GRD-04 | Guardian copy of receipt (guardian pays or is cc'd) | `order.paid` where `payer != user` | guardian (payer) | E | `receipt` ★ | immediate; guardian can pay for linked student (D4) | en+bn | T | byp | C0 | fin | P2 |
| N-GRD-05 | Monthly guardian report | cron monthly 1st 10:00 recipient-local; on-request button | guardian with `status='granted'` link and student consent | E, IA | `guardian_report` ★ | monthly; progress, study time, mocks, estimated band trend ("estimated"), attendance; never essays or chat; no offers | en+bn | P | def | C3 | product | P2 |
| N-GRD-06 | Student asked to confirm a link | `guardian.link_requested` | student | IA, E | `guardian_link_confirm` | immediate | en+bn | T | byp | C0 | product | P2 |

### 3.8 Organisations (B2B, P2)

| ID | Event | Trigger | Audience | Channels | Template id | Timing | Loc | Class | Q | Cap | Owner | Ph |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| N-ORG-01 | Org created / admin welcome | `org.created` | `org_admin` | E, IA | `org_welcome` | immediate; includes 2FA requirement (D4) and CSV template link | en+bn | T | byp | C0 | org | P2 |
| N-ORG-02 | Seat invite | `org.member_invited` -> `notifications.send-org-invite` | invitee email | E | `org_member_invite` | immediate; signed token valid 14 days [A]; reminder at +7 d once | en+bn | T | byp | C2 | org | P2 |
| N-ORG-03 | Seat assigned / released | `org.seat_allocated` / `org.seat_released` | member | IA, E | `org_seat_assigned`, `org_seat_released` | immediate | en+bn | T | byp | C0 | org | P2 |
| N-ORG-04 | Assignment created / due reminders | `org.assignment_created` -> `organizations.fanout-assignment`, `notifications.schedule-due-reminders` | cohort members | IA, E | `org_assignment_new`, `org_assignment_due` | immediate; due reminders T-3 d and T-1 d (local 10:00); suppressed if complete | en+bn | P* | smsdef | C2 | org | P2 |
| N-ORG-05 | Cohort report (weekly/monthly) | cron + `org.update-cohort-stats` | `org_admin` | E, IA | `org_cohort_report` | weekly Sunday local 09:00 [A], per org setting; CSV link valid 24 h via signed URL | en+bn | P | def | C3 | org | P2 |
| N-ORG-06 | Bulk import finished / failed | `org.members_import_requested` -> `organizations.import-members` | `org_admin` | IA, E | `org_import_result` | on completion; row-level error report link | en | T | byp | C0 | org | P2 |
| N-ORG-07 | Member removed / data return | `org.member_removed` | member, `org_admin` | IA, E | `org_member_removed` | immediate; explains what access remains | en+bn | T | byp | C0 | org | P2 |
| N-ORG-08 | Seat pack low / expiring | `entitlement.expiring` {org seat pack}; seats >= 90% used | `org_admin` | E, IA | `org_seats_low`, `org_pack_expiring` | T-30/T-7; once | en+bn | T | def | C2 | org | P2 |

### 3.9 Staff and creator queues (instructor, grader, editor, counsellor, finance, support)

Staff alerts (F-NOT-08) are operational and use the same dispatcher but bypass `P` pause and marketing rules. Staff can choose digest vs immediate per queue in settings. They never receive `M`.

| ID | Event | Trigger | Audience | Channels | Template id | Timing | Loc | Class | Q | Cap | Owner | Ph |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| N-STF-01 | Instructor application approved | `instructor.approved` -> `notifications.send-instructor-welcome` | instructor | E, IA | `instructor_welcome` | immediate; 2FA + contract + upload guide | en | T | byp | C0 | acad | P1 |
| N-STF-02 | Course submitted for review | `course.submitted` -> `notifications.notify-editors` | `content_editor` | IA, E (digest option) | `editor_review_requested` | immediate / hourly digest; editor SLA 3 business days (GA-028) | en | T | def (staff local) | C0 | acad | P1 |
| N-STF-03 | Review decision (approved / changes requested) | `course.review_decided` -> `notifications.notify-instructor` | instructor | IA, E | `instructor_review_decision` | immediate | en | T | byp | C0 | acad | P1 |
| N-STF-04 | Question submitted/published | `question.submitted` / `question.published` | editors / author | IA | `question_review_update` | immediate | en | T | def | C0 | acad | P1 |
| N-STF-05 | Item error report received | `report.created` {kind:item} (F-ERR-01..03, `/editor/reports`) | editors | IA, E digest | `item_report_received` | daily digest | en | T | def | C3 | acad | P1 |
| N-STF-06 | Writing/Speaking submission assigned | `grader.assigned` -> `notifications.notify-grader` | grader | IA, E | `grader_assignment` | immediate (also batched digest 08:00 when > 5 pending) | en | T | def (grader local) | C0 | acad | P1 |
| N-STF-07 | Grader SLA warning / breach | `evaluation.sla-watch` at 75% and 100% of `sla_due_at` | grader, then `admin` | IA, E | `grader_sla_warning`, `grader_sla_breach` | at 36 h and 48 h of a 48 h SLA (`07` §7.10) | en | T | byp | C0 | acad | P1 |
| N-STF-08 | Counsellor: session reminder; essay feedback request | `counsellor.session_reminder_due`, `essay_feedback.requested` [NEW-ev] (`21`) | counsellor, student | IA, E | `counsellor_session_reminder`, `counsellor_feedback_request` | T-24h, T-1h; request immediate | en+bn | P* | smsdef | C2 | acad | P3 |
| N-STF-09 | Finance queue: refunds pending > 48 h; payment webhook failing; settlement lag | `refund.requested` age cron; `payment/event.received` failure count (`11` §5.7) | `finance`, `admin` | IA, E; critical -> pager via Better Stack/Sentry (not this system) | `finance_refund_pending`, `ops_payment_alert` | on threshold; 4-hour repeat max | en | T | byp | C0 | fin | P1 |
| N-STF-10 | Support queue: SLA breach (first response 4 h) | helpdesk webhook / `support.sla_breach` [NEW-ev] | `support` lead | IA, E | `support_sla_breach` | on breach | en | T | byp | C0 | support | P1 |
| N-STF-11 | Moderation: report created | `report.created` -> `notifications.notify-moderators` | moderators | IA, E digest | `moderation_report` | immediate high-severity (minors/self-harm keywords), else digest | en | T | byp for high | C0 | support | P2 |
| N-STF-12 | Content freshness (annual refresh stale > 12 months) | cron (F-CAT-09) | editors | IA | `course_stale_task` | monthly digest | en | T | def | C3 | acad | P1 |

### 3.10 Support tickets

P1 uses a bought/open-source helpdesk (GA-003 recommendation). In P1 the helpdesk sends its own ticket mail from `support@<domain>` with our DKIM (the helpdesk domain must be authenticated, §9.2) and we mirror status into the in-app inbox through a signed webhook. P2, if native tickets are built, these templates move into the catalogue.

| ID | Event | Trigger | Audience | Channels | Template id | Timing | Loc | Class | Q | Cap | Owner | Ph |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| N-SUP-01 | Ticket received (with ticket id, expected first reply 4 h, `02` §10.3) | helpdesk `ticket.created` webhook | requester | E (helpdesk), IA mirror | `ticket_received` | immediate | en+bn (macros) | T | byp | C0 | support | P1 |
| N-SUP-02 | Agent reply | `ticket.replied` | requester | E (helpdesk), IA mirror | `ticket_reply` | immediate; reply-by-email threads back | en+bn | T | byp | C0 | support | P1 |
| N-SUP-03 | Ticket resolved + CSAT (1-tap) | `ticket.resolved` | requester | E, IA | `ticket_resolved_csat` | 2 h after resolution; auto-close at +7 days | en+bn | T | def | C0 | support | P1 |
| N-SUP-04 | Money-deducted-no-access ticket auto-created | `payment.reconcile_delayed` | support | IA, helpdesk | n/a | creates ticket with order prefetch (AC-DASH-SUP-01) | en | T | byp | C0 | support | P1 |

### 3.11 Privacy: export, deletion, policy

| ID | Event | Trigger | Audience | Channels | Template id | Timing | Loc | Class | Q | Cap | Owner | Ph |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| N-PRV-01 | Export requested (acknowledgement) | `privacy.export_requested` | requester | E, IA | `data_export_requested` | immediate; confirms request is from this account (fresh auth required) | en+bn | T | byp | C0 | privacy | P1 |
| N-PRV-02 | **Data export ready** | `privacy.export.completed` [NEW-ev] (job `privacy.export`) | requester | E, IA, (S for password per `09` §13.9 step 2) | `data_export_ready` | when ZIP is built; presigned GET **24 h** (`09` §13.9); password sent via a second channel or requires login | en+bn | T | byp | C0 | privacy | P1 |
| N-PRV-03 | **Deletion scheduled** | `privacy.deletion_requested` -> `privacy.schedule-erasure` | requester | E, IA, (S) | `deletion_scheduled` | immediate; states exact `executeAfter` (**14 days**, D12/C7), what is deleted vs retained (financial records, audit), and "sign in to cancel" | en+bn | T | byp | C0 | privacy | P1 |
| N-PRV-04 | Deletion reminders | `privacy.schedule-erasure` | requester | E | `deletion_reminder` | day 7 and day 13; cancellable | en+bn | T | byp | C2 | privacy | P1 |
| N-PRV-05 | **Deletion cancelled** | `privacy.deletion_cancelled` [NEW-ev] (user signs in and cancels) | requester | E, IA | `deletion_cancelled` | immediate; marketing prefs stay off until user re-enables | en+bn | T | byp | C0 | privacy | P1 |
| N-PRV-06 | **Deletion completed** | `privacy.erased` [NEW-ev] (job `privacy.erase`) | former user | E | `deletion_completed` | last step of the job: the address is held only in the encrypted job payload, sent, then discarded; afterwards only an email **hash** remains in `contact_suppression` (`09` §13.9) | en+bn | T | byp | C0 | privacy | P1 |
| N-PRV-07 | Consent changed (marketing, AI processing, recording retention) confirmation | `consent.recorded` [NEW-ev] | user | IA | `consent_recorded` | immediate; in-app only | en+bn | T | byp | C0 | privacy | P1 |
| N-PRV-08 | Policy update (terms, privacy, refund, AI scoring) | `policy.published` [NEW-ev] | all active users (only if material change) | E, IA banner | `policy_update_notice` | >= 14 days before effective date (30 days recommended) [LEGAL]; one reminder at -3 d for material changes | en+bn | T | def | C0 | legal | P1 |
| N-PRV-09 | Data breach notice (high risk) | `incident.breach_notified` [NEW-ev], founder-triggered per `09` §13.10 | affected users; guardians of minors | E, IA, (S) | `data_breach_notice` | per 72-hour/without undue delay rules; plain Bangla/English: what happened, data, risks, actions | en+bn | T | byp | C0 | privacy | P1 |
| N-PRV-10 | Accommodation request received/decided | `accommodation.requested`/`decided` [NEW-ev] (P1 via support, P2 self-serve) | learner | IA, E | `accommodation_update` | immediate | en+bn | T | byp | C0 | support | P1 |
| N-PRV-11 | Account suspended / sharing enforcement ladder | `account.enforcement_applied` [NEW-ev] (GA-026) | user | E, IA | `account_enforcement_notice` | immediate with appeal link | en+bn | T | byp | C0 | support | P2 |

### 3.12 Win-back, lifecycle edges and marketing

| ID | Event | Trigger | Audience | Channels | Template id | Timing | Loc | Class | Q | Cap | Owner | Ph |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| N-WIN-01 | Inactive 30 days (free or lapsed) | cron daily: no `attempt/lesson/practice` for 30 d, not minor, consent `M` | learners | E | `winback_30d` | one useful content item (a short lesson or a drill) - no discount | en+bn | M | def | C4 | lifecycle | P1 |
| N-WIN-02 | Inactive 60 days | same | same | E | `winback_60d` | one more helpful item + "we will pause emails" notice; **then sunset** | en+bn | M | def | C4 | lifecycle | P1 |
| N-WIN-03 | Sunset: stop marketing to non-engagers | `user.inactive_sunset` after 90 days without open/click on any `M`/`P` mail | learner | none (suppress marketing and digest; keep `T`/`S`) | n/a | set `notification_setting.sunset_at`; reversible by sign-in | n/a | M | n/a | n/a | lifecycle | P1 |
| N-WIN-04 | Pass lapsed 14 days (renew with progress summary) | `entitlement.expired` + 14 d, no repurchase, consent `M` | ex-paying learners | E | `winback_lapsed_pass` | once; shows progress kept; any offer must be a **standing public price** (no fake "was" price, D12/C14) | en+bn | M | def | C4 | lifecycle | P1 |
| N-WIN-05 | Newsletter / product announcement | manual campaign via admin | opted-in | E | `newsletter` | manual; <= 2 per month | en+bn | M | def | C4 | lifecycle | P2 |
| N-WIN-06 | "Which test do I need?" quiz result emailed (opt-in lead) | `quiz.result_emailed` [NEW-ev] | opted-in guest | E | `quiz_result` | immediate; double opt-in in EU/UK | en+bn | M | def | C4 | lifecycle | P1 |
| N-WIN-07 | Post-test outcomes survey (T+7) | `exam_date + 7d`; opt-in self-reported result, used to calibrate predictor and for testimonials with permission (`20` §6.2) | learner | E, IA | `outcome_survey` | once | en+bn | P | def | C1 | lifecycle | P2 |
| N-WIN-08 | Referral nudge after high score / completed course | `evaluation.completed` or `course.completed` with high score | learner, consent `M`, not minor | IA, E | `referral_invite` | once per 60 days | en+bn | M | def | C4 | lifecycle | P2 |

### 3.13 Channel-specific roll-up (what each channel is allowed to carry)

| Channel | P0/P1 | P2 | P3 | Allowed classes | Not allowed |
|---|---|---|---|---|---|
| In-app (`notification`, bell, banners) | all rows with IA | + group Q&A, achievements | + marketplace | all | none (but follows pause and caps for `P`/`M`) |
| Email (Resend, SES fallback) | all rows with E | + guardian, org, subscription | + marketplace | T, S, P, M (by stream) | essay text, audio, full payment details |
| SMS (BD gateway) | OTP (S), payment-pending/receipt/refund for consented orders (T) | + class T-1h, pass T-1, instalments (T, opt-in) | n/a | S, T (service) | **No marketing SMS** in P1-P2 (BTRC promotional rules [U]; GA-031) |
| WhatsApp Business | support intake only | outbound templates (opt-in): receipt, class reminder, renewal, instalment | + OTP via auth template optional | T, P* | marketing templates until counsel and Meta category rules reviewed; under-18 |
| Web push (PWA) | none | results ready, class T-15m, daily goal (opt-in, F-NOT-05) | + native push (Expo) | P, T (results) | marketing |

### 3.14 Row count and coverage check

Counted by domain: auth/security 16, onboarding 14, learning 21, evaluation 11, live 9, commerce 26, guardian 6, org 8, staff 12, support 4, privacy 11, win-back/marketing 8. That is **146 catalogue rows** mapping to roughly **100 template ids** (exact count generated by CI) (inventory generated to `docs/generated/notification-templates.md` by NEW-NOTIF-02). The intent is that every `06` §7.1 event with a `notifications.*` consumer maps to a row; this was checked by hand only, so a few staff-side consumers (for example `thread.created` -> `notify-course-staff`) may still need rows. NEW-NOTIF-03 adds the CI check that makes the mapping complete.

### 3.15 New domain events required (add to `06` §7.1 and each domain's `events.ts`)

`auth.otp_requested`, `auth.email_verification_requested`, `auth.magic_link_requested`, `auth.new_device_sign_in`, `auth.two_factor_changed`, `auth.two_factor_disable_requested`, `auth.passkey_changed`, `auth.password_changed`, `auth.contact_changed`, `auth.sessions_revoked`, `security.suspicious_activity`, `support.impersonation_started`, `certificate.issued`, `achievement.unlocked`, `question.corrected`, `attempt.rescored`, `attempt.voided`, `attempt.credit_granted`, `live.session_scheduled`, `live.session_changed`, `live.reminder_due`, `live.recording_ready`, `live.attendance_below_threshold`, `speaking_club.booked`, `payment.verifying`, `payment.reconcile_delayed`, `payment.reconciled`, `payment.held_review`, `subscription.renewal_upcoming`, `instalment.due_soon`, `instalment.missed`, `instalment.paid`, `scholarship.decided`, `guarantee_claim.status_changed`, `entitlement.extended`, `referral.rewarded`, `guardian.consent_requested`, `guardian.link_requested`, `counsellor.session_reminder_due`, `essay_feedback.requested`, `support.sla_breach`, `privacy.export.completed`, `privacy.deletion_cancelled`, `privacy.erased`, `consent.recorded`, `policy.published`, `incident.breach_notified`, `accommodation.requested`, `accommodation.decided`, `account.enforcement_applied`, `user.inactive_sunset`, `quiz.result_emailed`. Payloads follow `06` §7.1 rules: ids and minimal scalars only, `v` field, dedupe key `name:entityId[:slot]`.

## 4. Template authoring rules

### 4.1 Structure and tooling

- Location: `packages/core/src/email/templates/<template_id>.tsx` (as `10` §11.1), one default export, one `props` zod schema (`<template_id>.schema.ts`), one plain-text renderer, one preview fixture (`<template_id>.fixtures.ts` with `en` and `bn` and an extreme-length case).
- Layout components in `packages/ui/email/` (Header, Footer, Button, Preheader, OtpBox, ReceiptTable, Callout); never copy-paste markup between templates.
- Brand: read from `packages/config/brand.ts` (never a literal name, D-header). Colour tokens exported as email-safe hex from the design tokens (`08`); no gradients (D8); one accent colour.
- Strings: next-intl message files `messages/{en,bn}/email.json`, keys `email.<template_id>.subject|preheader|heading|body.<n>|cta`, ICU plurals (Bangla plural rules per `33`). No string concatenation of translated fragments. The same keys feed the in-app `notification.content` (`titleKey`, `bodyKey`) so in-app and email stay in sync.
- Preview route in dev only: `/dev/email/<template_id>?locale=bn&fixture=long` (no prod route). A CLI `pnpm email:preview --all` writes HTML to `/tmp` for review.

### 4.2 Content rules

| Rule | Detail |
|---|---|
| Subject | <= 50 characters en, <= 40 bn (Bangla glyphs are wider; mobile truncation) [A]; no ALL CAPS, no emoji (D8), no `Re:`/`Fwd:` tricks; no PII beyond first name. |
| Preheader | Always set (hidden `div` plus zero-width padding to stop body bleed); <= 90 chars en, <= 60 bn; adds information, never repeats the subject. |
| Length | One primary CTA, one idea. Receipts and legal notices exempt. |
| Primary CTA | A bulletproof button (min 44x44 px touch target) **and** the raw URL as text below it (plain-text clients, corporate filters). |
| Links | HTTPS only on our domain; signed opaque tokens; no link shorteners; no query-string PII; UTM only on `M`/`P` (`utm_medium=email&utm_campaign=<template_id>`); **tracking off for `S` and OTP** (Resend click tracking disabled per message). |
| Dates and times | Always with timezone label or offset ("Sun 8 Dec, 8:00 PM BDT (UTC+6)"); format through `Intl` with the recipient locale and `Asia/Dhaka` or profile zone; calendar attachments `.ics` with IANA zone. |
| Money | From order snapshot in minor units; BDT as "BDT 3,990" (en) / "৳৩,৯৯০" (bn, native digits for body copy per `03` L-05); VAT-inclusive display rules per `10` §6.2. **Never** compute prices in a template. |
| Numbers in codes | OTP and order numbers are **Latin digits** in both locales (copy/paste, autofill, support). |
| Tone | Plain language, second person, reading level ~Grade 7 [A]; Bangla in natural written Cholito (standard colloquial), glossary and Banglish policy from `33`; no machine translation without reviewer sign-off (NEW-NOTIF-20). |
| Trademark | IELTS/GRE etc. named with the standard disclaimer line in the footer when mentioned; "estimated" wherever a band/score appears (D6). |
| Legal footer | Company name, postal address [LEGAL], reason for sending, preference-centre link, one-click unsubscribe (for `P`/`M`), support address; `T`/`S` footer says "You are receiving this because of your account activity." |
| Minors | No imagery or copy that implies marketing; no discount language (R-MINOR). |

### 4.3 Accessibility and rendering

- Table-based layout, 600 px max width, fluid below 480 px; semantic order (heading levels) and `role="presentation"` on layout tables.
- `lang` on `<html>` and on any inline switch of language (`lang="bn"` / `lang="en"`); `dir="ltr"`.
- Body text >= 16 px (Bangla >= 17 px for conjunct legibility), line-height >= 1.5, contrast WCAG 2.2 AA (4.5:1 body, 3:1 large); never colour-only meaning.
- Font stack for Bangla: `'Noto Sans Bengali','Hind Siliguri','Nirmala UI','Vrinda','Kalpurush',Arial,sans-serif` (web fonts are unreliable in email; correct rendering relies on system fonts - **test on Android Gmail, Samsung Mail, iOS Mail, Gmail web, Outlook web/desktop**; conjuncts and reph/ya-phala must render without broken ligatures).
- Images: every image has `alt` (empty only if decorative); no text baked into images; total weight <= 100 KB; images hosted on our CDN (R2 public bucket for brand assets), width/height attributes set; email must be fully usable with images blocked.
- Dark mode: `<meta name="color-scheme" content="light dark">` + `supported-color-schemes`; transparent PNG/SVG-free logos with light and dark variants; no pure-white-only backgrounds in images.
- Plain-text part: **mandatory** (CI fails if missing or if it has no CTA URL); generated by `@react-email/render` `plainText` then reviewed; wraps at 72 characters; Bangla not wrapped mid-word.
- Screen reader sanity: tested with VoiceOver (iOS) and TalkBack (Android) for OTP and receipt templates (focus order, button label contains the action).
- Security: no remote scripts/forms; no tokens in `alt` or title; OTP template contains the code in text (not an image) with `font-variant-numeric: tabular-nums` and spacing, and nothing else tappable except "this wasn't me".

### 4.4 Testing of templates (CI)

1. **Snapshot** every template x `{en, bn}` x fixtures (HTML and plain text).
2. **Schema**: props zod round-trip; missing prop fails the build.
3. **Link checker**: all links are on allow-listed hosts, none contain `@`, phone-like or email-like strings.
4. **Lint**: subject/preheader length by locale, `lang` attributes, `alt` presence, forbidden words list (urgency words "last chance", "hurry", "only today" for P/M - `R-BAN-DARK`).
5. **Accessibility**: axe on rendered HTML (jest-axe) plus a custom contrast check on inline colours.
6. **i18n parity**: every `bn` key exists with the same ICU placeholders as `en`.
7. **Visual**: Playwright screenshot of the preview route at 360 px and 600 px (diff tolerance), run on PRs that touch templates.
8. **Client rendering**: monthly manual pass on real devices for the top 10 templates (checklist in the runbook); optional Litmus/Email on Acid [U cost] - not required for launch.

## 5. SMS rules

### 5.1 Encoding and segment arithmetic

| Encoding | When | Single-segment limit | Per-segment when concatenated | Notes |
|---|---|---|---|---|
| **GSM-7** | Message contains only GSM-7 basic characters | **160** characters | 153 | Extension characters (`^ { } \ [ ] ~ | €`) count as **2**. Latin "Lumen", digits, `BDT`, URLs are fine. |
| **UCS-2 (Unicode)** | Any character outside GSM-7, which includes **every Bangla letter, the Bangla digits and the taka sign** | **70** characters | 67 | One Bangla character makes the **entire** message UCS-2, so mixed Bangla/Latin text is limited to 70 total. |

- Count with the same function in app and tests (`packages/core/src/sms/segments.ts`, covered by the Sms contract suite in `10` §7). The function counts UTF-16 code units; Bangla letters, vowel signs, virama and taka are all BMP (1 unit each), but **emoji or characters outside the BMP count 2** (emoji are banned anyway, D8).
- Normalise: use the plain apostrophe and hyphen; avoid curly quotes (they force UCS-2); strip zero-width joiner/non-joiner unless required for correct Bangla conjuncts (ZWJ/ZWNJ count as characters in UCS-2).
- The gateway segment count and cost are logged (`SendSmsInput` returns `segments`, `10` §1.7) and compared with our computed value; a mismatch raises a Sentry warning (gateway re-encoding, URL expansion, or a trailing signature).

### 5.2 Budget per message

| Class | Target | Hard max | Rationale |
|---|---|---|---|
| OTP (`sms_otp`) | **1 segment, English GSM-7**, <= 80 characters | 1 segment | Template is fixed and gateway-registered (`10` §11.2); Bangla variant optional only if the gateway approves it, <= 70 characters |
| Service SMS, English | <= 160 (1 segment) | 2 segments (<= 306) | Cost control: a 2-segment message costs 2x |
| Service SMS, Bangla | <= 70 (1 segment) preferred | **2 segments (<= 134)** | Longer than 134 is rejected by the template test; shorten or send English + in-app instead |
| Marketing SMS | not sent | not sent | P1-P2 policy (§3.13) |

Cost model: planning only - BDT 0.3-0.6 per segment [A, `10` §11.2], so a 2-segment Bangla service SMS is about BDT 0.6-1.2. Budget alarm in §5.5.

### 5.3 SMS template register (draft wording, lengths measured with example values; CI recomputes worst-case lengths with maximum-length variables)

Short link host `{short}` = `lum.example/a/<5 chars>` (placeholder; own domain, 28 characters). Brand token `Lumen` = `brand.shortName` (<= 8 chars).

| Template id | Locale | Draft text | Example length / encoding / segments |
|---|---|---|---|
| `sms_otp` | en | `Your Lumen code is 123456. Valid for 5 min. Do not share it.` (exact string registered with the gateway, `10` §11.2; same string for **sign-in, sign-up, phone verification, step-up**) | 60, GSM-7, 1 |
| `sms_otp` | bn (optional) | `আপনার Lumen কোড 123456। ৫ মিনিট বৈধ। কাউকে জানাবেন না।` | 54, UCS-2, 1 |
| `sms_guardian_otp` | en | `Your Lumen code to confirm a guardian link is 123456. Valid for 5 min. Do not share it.` | about 88, GSM-7, 1 |
| `sms_payment_received` | en | `Lumen: BDT 3,990 received for order LA-2611-000123. Your access is unlocked. Start: lum.example/a/Xk3p9` | 103, GSM-7, 1 |
| `sms_payment_received` | bn | `Lumen: অর্ডার LA-2611-000123-এ ৳3,990 পেয়েছি। অ্যাক্সেস চালু। lum.example/a/Xk3p9` | 82, UCS-2, 2 |
| `sms_payment_verifying` | en | `Lumen: We are confirming your payment for order LA-2611-000123. Access unlocks automatically. Do not pay again.` | 111, GSM-7, 1 |
| `sms_payment_verifying` | bn | `Lumen: অর্ডার LA-2611-000123-এর পেমেন্ট যাচাই চলছে। অ্যাক্সেস নিজে থেকেই খুলবে। আবার পে করবেন না।` | 97, UCS-2, 2 |
| `sms_pass_expiry_1d` | en | `Lumen: Your pass ends tomorrow 23:59. Renew to keep access: lum.example/a/Xk3p9` | 79, GSM-7, 1 |
| `sms_pass_expiry_1d` | bn | `Lumen: আপনার পাস কাল রাত ১১:৫৯-এ শেষ। নবায়ন: lum.example/a/Xk3p9` | 65, UCS-2, 1 |
| `sms_class_starting` | en | `Lumen: Live class starts in 1 hour (8:00 PM). Join: lum.example/a/Xk3p9` | 71, GSM-7, 1 |
| `sms_class_starting` | bn | `Lumen: লাইভ ক্লাস ১ ঘণ্টা পরে (রাত ৮টা)। যোগ দিন: lum.example/a/Xk3p9` | 69, UCS-2, 1 |
| `sms_instalment_due` | en | `Lumen: Instalment 2 of 3 (BDT 4,000) is due 12 Dec. Pay: lum.example/a/Xk3p9` | 76, GSM-7, 1 |
| `sms_instalment_due` | bn | `Lumen: ৩টির ২য় কিস্তি ৳4,000, শেষ তারিখ ১২ ডিসেম্বর। পে: lum.example/a/Xk3p9` | 77, UCS-2, 2 |
| `sms_refund_result` | en | `Lumen: Refund of BDT 3,990 for LA-2611-000123 was sent to bKash. It may take a few days to show.` | 96, GSM-7, 1 |
| `sms_refund_result` | bn | `Lumen: LA-2611-000123-এর ৳3,990 ফেরত bKash-এ পাঠানো হয়েছে। দেখাতে কয়েক দিন লাগতে পারে।` | 88, UCS-2, 2 |

Content rules for SMS: begin with the brand, never include card/wallet numbers, never include scores or names of exam content, never include a login link that logs in without a second check (the short link opens the page; signed-in state is required for anything sensitive), always one action. Order numbers are Latin; amounts digit style is consistent within the message. **Masking/sender ID** and template pre-approval are gateway-specific (`10` §11.2 [U]): register every id above as a *fixed* template with variable slots where the gateway demands it; treat any wording change as a re-approval event (change control in NEW-NOTIF-18).

### 5.4 Compliance and abuse

- Opt-in recorded in `consent_record` (new kinds `sms_service`, §8.4) with timestamp, source (checkout checkbox, settings toggle), and exact consent text version. Reply `STOP` handling if the gateway supports inbound; otherwise a signed unsubscribe link and the settings toggle [U gateway].
- BTRC/NDNC-style DND lists and promotional-SMS time windows apply to *promotional* SMS only [U confirm with gateway/counsel]; we send none in P1-P2. Service SMS honours our quiet hours anyway (§2.2).
- OTP abuse controls (Turnstile, per-phone 5/h, per-IP 20/h, +880 only, premium-range blocks, daily spend alarm, kill switch) are normative in `10` §11.2 and `09`; this doc adds no weaker rule.
- Gateway failover: `SMS_PROVIDER` primary plus a secondary adapter (`alphasms`/`bulksmsbd`) used automatically after 3 consecutive delivery-report failures for one operator within 10 minutes (NEW-NOTIF-10); OTP falls back to email OTP if SMS is disabled.

### 5.5 SMS cost guardrails

Log `segments` and `costMinor` per send in `notification_dispatch`; alert when daily spend > 2x the 7-day average (reuses the `10` §11.2 alarm) or when non-OTP SMS exceeds 15% of sends. Weekly report to `lifecycle` and `fin`.

## 6. WhatsApp Business (P2; opt-in only)

> Provider rules change often. Everything below marked **[V]** must be verified in Meta's current WhatsApp Business Platform documentation and the chosen BSP's terms before the first template is submitted. Nothing here is a Meta policy quote.

### 6.1 Account and approval notes

- Cloud API via a BSP or directly; requires Meta Business verification, a verified display name and a dedicated number [V]. Needs the same trade-licence documents as the SMS sender (`10` §Appendix account table). Lead time: assume 1-3 weeks [A].
- **Template categories** [V]: *utility* (transactional: receipts, reminders), *authentication* (OTP), *marketing* (promotions). Category is assigned/validated by Meta and affects price; mis-categorising marketing as utility risks re-categorisation or rejection. We submit **utility only** in P2.
- **Business-initiated messages outside the 24-hour customer-service window must use an approved template** [V]; free-form replies are allowed only inside the window after the user messages us.
- **Templates are per language**: submit `bn` and `en` separately (language codes `bn`, `en` or `en_US` [V]); names are lowercase with underscores and unique per language set. Variables use numbered placeholders `{{1}}..`; Meta rejects templates with variables at the start/end or adjacent without text and wants example values at submission [V].
- Review usually takes minutes to 24 h but can be longer [V]. Rejection reasons: unclear purpose, promotional content in a utility template, URL shorteners, missing sample values, policy-violating content. Keep a rejection log with the final wording.
- **Quality rating and limits** [V]: block/report rates reduce quality and can pause a template or lower messaging limits. Our mitigation: strictly opted-in recipients, one tap "Stop", frequency caps §2.3 apply to WhatsApp too.
- **Pricing** [V]: Meta has been moving to per-message pricing by category; obtain the current rate card for Bangladesh before budgeting (`10` §11.3). Service replies within the window may be free or cheaper [V]. Do not hard-code prices in code.
- **Opt-in**: explicit unticked checkbox with the WhatsApp number verified by an OTP (reuse `sms_otp` or WhatsApp authentication template), stored in `consent_record` kind `whatsapp_messages`; STOP/"Stop" keyword (en and bn: `STOP`, `বন্ধ`) handled in the inbound webhook, which writes `contact_suppression` and `notification_preference(channel=whatsapp, enabled=false)` within 60 s.
- **Under-18**: no WhatsApp at all in P2 (matches `10` §11.3 "no marketing to under-18"; stricter here by design).
- Data processing: WhatsApp phone numbers are PII; log only masked numbers; add Meta/BSP to `docs/processors.md` (`09` §13.8) and the privacy policy.

### 6.2 Template register (P2)

All are *utility*; placeholders numbered; buttons use URL buttons with a dynamic suffix (signed short token), never full URLs in the body.

| Template name | Language set | Body (draft) | Variables | Button | Trigger |
|---|---|---|---|---|---|
| `lumen_receipt_v1` (`wa_receipt`) | en, bn | "Payment received: {{1}} for order {{2}}. Your access is unlocked." | amount text, order number | "View receipt" (URL suffix) | `order.paid` |
| `lumen_payment_pending_v1` (`wa_payment_pending`) | en, bn | "We are confirming your payment for order {{1}}. Access unlocks automatically. You do not need to pay again." | order number | "Check status" | N-COM-04/06 |
| `lumen_class_reminder_v1` (`wa_class_reminder`) | en, bn | "Your live class {{1}} starts at {{2}}. Tap to join." | class title, local time with offset | "Join class" | N-LIV-03 |
| `lumen_renewal_reminder_v1` (`wa_renewal_reminder`) | en, bn | "Your pass ends on {{1}}. Renew to keep access to your courses and mocks." | date | "Renew" | N-COM-11 |
| `lumen_instalment_due_v1` (`wa_instalment_due`) | en, bn | "Instalment {{1}} of {{2}} ({{3}}) is due on {{4}}." | index, total, amount, date | "Pay now" | N-COM-16 |

Versioned names (`_v1`) because approved templates are immutable; edits mean a new version and a code-side switch.

## 7. Push notifications (reference)

- **Web push (PWA, P2)**: VAPID keys per environment, `push_subscription` table (§8.2), opt-in only after value is shown (not on first visit), reminders for results, class T-15m, daily goal. iOS web push needs the PWA installed to home screen [V]. Payload carries only `title`, `body`, deep link path; no PII beyond first name.
- **Native push (P3)**: Expo notifications after the mobile app (D1 P3); same dispatcher, same ledger.
- Unregistration on 404/410 from the push service; cap and quiet hours as other channels.

## 8. Data model additions (follow `05` conventions: `pk()`, `timestamps()`, `tstz`, `createdAtCol`, `pgEnum` for closed sets, partial unique indexes for dedupe, FK leading-column indexes, `ON DELETE` rules)

### 8.1 Enum changes (each in its own migration; `ALTER TYPE ... ADD VALUE`)

- `notification_channel` + `'whatsapp'`.
- `consent_kind` + `'sms_service'`, `'whatsapp_messages'`, `'push_notifications'`, `'email_product_updates_eu'` (for the EU/UK region switch evidence). (`05` already has `marketing`, `analytics_cookies`.)
- New `dispatch_status`: `'sent' | 'deferred' | 'skipped' | 'suppressed' | 'dropped' | 'failed'`.
- New `suppression_reason`: `'hard_bounce' | 'complaint' | 'unsubscribe' | 'sms_stop' | 'wa_stop' | 'invalid_number' | 'deleted' | 'manual'`.

### 8.2 Tables (`packages/db/src/schema/notifications.ts`)

| Table | Purpose | Key constraints and indexes | Retention |
|---|---|---|---|
| `notification_dispatch` | Decision ledger: one row per intended send per channel (sent, deferred, skipped, suppressed, dropped, failed). Source for caps, "why didn't I get it", spend. | Partial UQ `(dedupe_key)` where status in (`sent`,`deferred`); idx `(user_id, created_at)`; idx `(user_id, cap_class, created_at)` for cap counts; idx `(status, release_at)` where deferred; FK `email_log_id` set null. | 13 months (aligned with `email_log`) |
| `notification_setting` | Per-user delivery settings that do not fit the category x channel matrix. | UQ `user_id`; CHECK quiet hours within 0-23; `paused_until` partial idx. | Account life |
| `contact_suppression` | Hard suppressions that outlive the user row (hash only). | UQ `(channel, contact_hash)`; idx `(reason, created_at)`. | Permanent for hash entries (legal basis: suppression compliance); no address stored |
| `push_subscription` | Web push endpoints (P2). | UQ `endpoint_hash`; idx `user_id`. | Until revoked or 410 |
| `lifecycle_enrolment` | Durable state of onboarding, win-back and abandoned-checkout runs for reporting and support. | UQ `(user_id, sequence_key)` where state = `active`; idx `(sequence_key, state, next_step_at)`. | 13 months after exit |
| `message_template_version` (optional, P2) | Records which wording version of each approved SMS/WhatsApp template is live. | UQ `(template_id, locale, version)`. | Permanent |

```ts
// additions to packages/db/src/schema/notifications.ts
export const dispatchStatusEnum = pgEnum('dispatch_status', ['sent', 'deferred', 'skipped', 'suppressed', 'dropped', 'failed']);
export const suppressionReasonEnum = pgEnum('suppression_reason',
  ['hard_bounce', 'complaint', 'unsubscribe', 'sms_stop', 'wa_stop', 'invalid_number', 'deleted', 'manual']);

/** Decision ledger. One row per (intended message x channel). Never stores addresses or bodies. */
export const notificationDispatch = pgTable('notification_dispatch', {
  id: pk(),
  userId: uuid('user_id').references(() => user.id, { onDelete: 'set null' }),
  catalogueId: text('catalogue_id').notNull(),                       // 'N-COM-10'
  templateId: text('template_id').notNull(),                         // 'renewal_reminder_7d'
  channel: notificationChannelEnum('channel').notNull(),
  optOutClass: text('opt_out_class').notNull(),                      // 'T' | 'S' | 'P' | 'M'  (CHECK)
  capClass: text('cap_class'),                                       // 'nudge' | 'marketing' | 'sms' | null
  locale: text('locale').notNull(),
  status: dispatchStatusEnum('status').notNull(),
  reason: text('reason'),                                            // 'quiet_hours' | 'paused' | 'cap_c1' | 'no_consent' | 'minor' | 'suppressed:hard_bounce' ...
  releaseAt: tstz('release_at'),                                     // for deferred rows
  dedupeKey: text('dedupe_key').notNull(),                           // `${template}:${entityId}[:${slot}]`
  eventName: text('event_name').notNull(),                           // 'entitlement.expiring'
  eventId: text('event_id'),                                         // outbox/Inngest event id
  emailLogId: uuid('email_log_id').references(() => emailLog.id, { onDelete: 'set null' }),
  providerMessageId: text('provider_message_id'),                    // sms/whatsapp/push id (email lives in email_log)
  segments: smallint('segments'),                                    // SMS
  costMinor: integer('cost_minor'),                                  // SMS/WhatsApp, BDT minor units
  sentAt: tstz('sent_at'),
  createdAt: createdAtCol(),
}, (t) => [
  uniqueIndex('notification_dispatch_dedupe_uq').on(t.dedupeKey, t.channel).where(sql`${t.status} in ('sent','deferred')`),
  index('notification_dispatch_user_idx').on(t.userId, t.createdAt),
  index('notification_dispatch_cap_idx').on(t.userId, t.capClass, t.createdAt).where(sql`${t.status} = 'sent'`),
  index('notification_dispatch_deferred_idx').on(t.releaseAt).where(sql`${t.status} = 'deferred'`),
  index('notification_dispatch_email_log_idx').on(t.emailLogId).where(sql`${t.emailLogId} is not null`),
  check('notification_dispatch_class_chk', sql`${t.optOutClass} in ('T','S','P','M')`),
]);

export const notificationSetting = pgTable('notification_setting', {
  id: pk(),
  userId: uuid('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  quietStartHour: smallint('quiet_start_hour').notNull().default(22),
  quietEndHour: smallint('quiet_end_hour').notNull().default(8),
  pausedUntil: tstz('paused_until'),
  reminderLocalTime: text('reminder_local_time'),                    // 'HH:MM', null = no reminders
  digestDow: smallint('digest_dow').notNull().default(0),            // 0 = Sunday
  digestHour: smallint('digest_hour').notNull().default(18),
  sunsetAt: tstz('sunset_at'),                                       // marketing/digest suppressed after non-engagement
  ...timestamps(),
}, (t) => [
  uniqueIndex('notification_setting_user_uq').on(t.userId),
  index('notification_setting_paused_idx').on(t.pausedUntil).where(sql`${t.pausedUntil} is not null`),
  check('notification_setting_hours_chk', sql`${t.quietStartHour} between 0 and 23 and ${t.quietEndHour} between 0 and 23 and ${t.digestDow} between 0 and 6 and ${t.digestHour} between 0 and 23`),
]);

/** Outlives the user row on purpose: stores only an HMAC of the contact, so we never re-contact a deleted/complained address. */
export const contactSuppression = pgTable('contact_suppression', {
  id: pk(),
  channel: notificationChannelEnum('channel').notNull(),             // email | sms | whatsapp
  contactHash: char('contact_hash', { length: 64 }).notNull(),       // HMAC-SHA256 with PII_HMAC_KEY (as email_log.to_email_hash)
  reason: suppressionReasonEnum('reason').notNull(),
  scope: text('scope').notNull().default('all'),                     // 'all' | 'marketing' (unsubscribe affects P/M only)
  expiresAt: tstz('expires_at'),                                     // soft bounces: 30 days; null = permanent
  createdAt: createdAtCol(),
}, (t) => [
  uniqueIndex('contact_suppression_uq').on(t.channel, t.contactHash, t.scope),
  index('contact_suppression_reason_idx').on(t.reason, t.createdAt),
]);

export const pushSubscription = pgTable('push_subscription', {
  id: pk(),
  userId: uuid('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  endpointHash: char('endpoint_hash', { length: 64 }).notNull(),
  endpointEnc: text('endpoint_enc').notNull(),                       // envelope-encrypted like contact_phone_enc (05 §PII)
  keysEnc: text('keys_enc').notNull(),
  userAgentFamily: text('user_agent_family'),
  lastSuccessAt: tstz('last_success_at'),
  revokedAt: tstz('revoked_at'),
  ...timestamps(),
}, (t) => [
  uniqueIndex('push_subscription_endpoint_uq').on(t.endpointHash),
  index('push_subscription_user_idx').on(t.userId).where(sql`${t.revokedAt} is null`),
]);

export const lifecycleEnrolment = pgTable('lifecycle_enrolment', {
  id: pk(),
  userId: uuid('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  sequenceKey: text('sequence_key').notNull(),                       // 'onboarding' | 'abandoned_checkout' | 'winback' | 'post_purchase'
  state: text('state').notNull().default('active'),                  // 'active' | 'completed' | 'exited'
  stepKey: text('step_key'),
  nextStepAt: tstz('next_step_at'),
  exitReason: text('exit_reason'),                                   // 'purchased' | 'unsubscribed' | 'paused' | 'minor_skip' | 'deleted'
  entityId: uuid('entity_id'),                                       // e.g. order id for abandoned_checkout
  startedAt: tstz('started_at').notNull().defaultNow(),
  endedAt: tstz('ended_at'),
  ...timestamps(),
}, (t) => [
  uniqueIndex('lifecycle_enrolment_active_uq').on(t.userId, t.sequenceKey, t.entityId).where(sql`${t.state} = 'active'`),
  index('lifecycle_enrolment_due_idx').on(t.sequenceKey, t.nextStepAt).where(sql`${t.state} = 'active'`),
]);
```

### 8.3 Changes to existing tables and `05` text

- `email_log`: add nullable `template_locale text`, `stream text` (for deliverability slicing); no other change. Add `status` value `'deferred'` is **not** needed (deferral lives in `notification_dispatch`).
- `notification`: add `href_kind` is unnecessary; keep `content` JSON `{titleKey, bodyKey, params, href}`; add `category` check that `S`/`T` rows cannot be hidden by a client-side "clear all" (they stay visible 30 days).
- `notification_preference`: keep as is; seed rows are **not** inserted for defaults (absence = default, per `05`); the preference service writes a row only when the user changes a default. Rows for `security`/`transactional` are rejected by the service rule.
- `user_profile.marketing_opt_in` remains the **cached** latest-consent flag; `consent_record(kind='marketing')` is the evidence. A DB trigger or service function keeps them aligned (NEW-NOTIF-06).
- `webhook_provider` enum already includes `resend`; add `'whatsapp'` and `'sms'` values (sms route exists in `10` §2.5) via ADD VALUE.
- PII registry (`pii_registry.ts`, `09` §13.9): register all new tables; `contact_suppression` is "hash only, retained on erasure"; `push_subscription` is deleted on erasure; `notification_dispatch.user_id` is set null on erasure (keeps aggregate counts, drops linkage).

### 8.4 Consent evidence

Every opt-in or opt-out writes `consent_record(kind, status, method, text_version, source)` (existing table). `source` values: `signup`, `checkout`, `settings`, `unsubscribe_link`, `wa_stop`, `sms_stop`, `import`. A change from the unsubscribe link must complete in < 1 s and apply to the *next* dispatch decision (no batch lag).

## 9. Deliverability

### 9.1 Streams and domains

| Stream | Sending domain | Classes | Reply-to | Notes |
|---|---|---|---|---|
| `transactional` | `mail.<domain>` | T, S | `support@` | Highest priority. Never share with bulk. No unsubscribe link needed; footer explains why |
| `notification` | `mail.<domain>` | P (non-digest) | `support@` | `List-Unsubscribe` + one-click |
| `marketing` | `news.<domain>` | M and `weekly_progress_digest` | `hello@` | Separate reputation, separate DMARC reporting address tag |
| helpdesk (P1) | `help.<domain>` or `support.<domain>` | ticket mail | monitored | DKIM-signed with the helpdesk vendor selector; included in the SPF of that subdomain only |

### 9.2 Authentication (SPF, DKIM, DMARC) - follow the exact records Resend shows

- Records and rollout (`p=none` for 2-4 weeks, then `quarantine; pct=25 -> 100`, then `reject`) are specified in `10` §11.1; this doc adds: one SPF record per name; DKIM selectors per provider (Resend, helpdesk, SES fallback) kept in the DNS inventory (`docs/runbooks/dns.md`); **every sender that uses our domain must be listed** (helpdesk, newsletter tools, marketing automation) or it will fail DMARC alignment once enforcement starts.
- DMARC alignment strict (`adkim=s; aspf=s`) per `10`; set `sp=` for subdomains explicitly; use per-stream `rua` tags to read reports by stream. Review aggregate reports weekly in the first 8 weeks, monthly after.
- MTA-STS and TLS-RPT optional after launch; BIMI later (needs VMC, cost [U]).
- Consumer mailbox requirements for bulk senders (Gmail/Yahoo, enforced since 2024) [V]: SPF and DKIM, DMARC at least `p=none` with alignment, valid PTR/TLS, spam-complaint rate kept below 0.10% and never reaching 0.30%, **RFC 8058 one-click unsubscribe** (`List-Unsubscribe` + `List-Unsubscribe-Post: List-Unsubscribe=One-Click`) honoured within 2 days for marketing and subscribed mail. We process within 1 minute.

### 9.3 Warm-up (no purchased lists, ever)

| Week | Daily volume cap on `news.` stream [A] | Audience |
|---|---|---|
| 1 | 200-500 | Most engaged: signed-in in the last 7 days, opens/clicks on transactional mail |
| 2 | 1,000 | + signed in last 30 days |
| 3 | 3,000 | + all consented `P` recipients |
| 4+ | double weekly while complaint rate < 0.1% and hard-bounce rate < 2% | all consented |

Transactional stream is warmed organically by OTP/receipt volume; before launch send test OTPs to seed mailboxes (Gmail, Outlook, Yahoo, local ISP mailboxes) and verify inbox placement manually. Pause ramp automatically (NEW-NOTIF-12) when a threshold is breached.

### 9.4 Bounce, complaint and list hygiene

- Webhook: `POST /api/webhooks/resend` (Svix signature, raw body; `10` §11.1) -> `parseWebhook` -> `NormalizedEmailEvent`. Handling: hard bounce or complaint -> `contact_suppression(channel=email, reason, scope='all' for hard bounce, 'marketing' for complaint plus unsubscribe)` and `email_log.status`; soft bounce 3x in 7 days -> suppression 30 days (`expiresAt`); `email.delivery_delayed` is logged only.
- Complaint feedback loops: Resend relays Gmail/Yahoo FBL; Google Postmaster Tools verifies domain for reputation and spam rate; Microsoft SNDS/JMRP [V].
- **Typos at sign-up**: client-side suggestion for common domains (`gmial.com`), server-side MX check before sending the first mail; disposable-domain blocklist for `M` only (not blocking sign-up).
- **Account banner** "Email undeliverable: update your address" when the address is suppressed (`10` §11.1); in-app fallback delivers `T` messages anyway; SMS OTP offered as alternative sign-in.
- **Sunset**: stop `M` and digest to recipients with no open/click for 90 days (N-WIN-03). Apple Mail Privacy Protection inflates opens: use **clicks and in-app activity** as the engagement signal, not opens.
- **List quality KPIs** (weekly, §14): hard-bounce rate < 2%, complaint rate < 0.1%, unsubscribe rate < 0.5% per send, inbox placement checks monthly, DMARC pass >= 98% of volume.
- **SMS deliverability**: measure per operator (Grameenphone, Robi, Banglalink, Teletalk) with 200 test sends before launch and 50 weekly synthetic sends; target delivery >= 97% and p95 latency < 8 s (`10` §11.2); delivery receipts via `sms/[provider]` webhook update `notification_dispatch.status`.

## 10. Preference centre specification

### 10.1 Routes and surfaces

| Surface | Route | Auth | Notes |
|---|---|---|---|
| Settings page | `/app/settings/notifications` (F-NOT-06) | signed-in | full matrix; also embedded in onboarding step D12 and the footer link of every non-`T`/`S` mail |
| One-click unsubscribe (RFC 8058) | `POST /api/unsubscribe` (List-Unsubscribe-Post) | signed token in URL (HMAC; no login) | idempotent; scope encoded in token: `marketing`, `digest`, `nudges`, `all-optional`; returns 200 with no body |
| Human unsubscribe page | `/unsubscribe/[token]` (marketing shell) | token | shows what was turned off, offers "pause 7 days instead", "choose categories", "undo" (Bangla/English); no login required, no dark patterns, no forced survey |
| Pause nudges | button on settings and in every nudge email footer | token or signed-in | sets `notification_setting.paused_until = now + 7 days` (AC-NOT-02) |
| Guardian | `/app/guardian/[studentId]/settings` | guardian | separate prefs: report cadence, receipts; no marketing ever for minors' guardians |
| Org admin | `/org/[slug]/settings/notifications` | `org_admin` | cohort report cadence, assignment reminders on/off for members (default on) |
| Staff | `/app/settings/notifications` role section | staff | queue alerts: immediate vs digest; channels |

### 10.2 The matrix

Rows = categories grouped by opt-out class; columns = channels. Locked cells show a lock icon with a tooltip ("Needed for your account and payments").

| Group (copy en / bn keys `prefs.group.*`) | Email | In-app | SMS | WhatsApp (P2) | Push (P2) |
|---|---|---|---|---|---|
| Security and account (S) | locked on | locked on | locked on (OTP; alerts only if phone verified) | n/a | n/a |
| Payments, receipts, results (T) | locked on | locked on | **opt-in** | **opt-in** | opt-in (results) |
| Learning reminders and tips (P: streak, plan, vocab, exam countdown) | on / off | on / off | opt-in | opt-in | opt-in |
| Progress digest (P) | on / off, day and time | n/a | n/a | n/a | n/a |
| Live classes (P*) | on / off | on / off | opt-in (T-1h) | opt-in | opt-in |
| Community replies (P) | on / off | on / off | n/a | n/a | opt-in |
| Offers and news (M) | **off** by default | on / off | not offered | not offered | not offered |

Controls beside the matrix: quiet hours (start/end, default 22:00-08:00, SMS/WhatsApp/push floor of 22:00-08:00 not removable), reminder time, digest day/time, "Pause nudges for 7 days", "Hide streak" (also stops streak nudges), language of messages (follows account `locale`, overridable independent of UI language).

### 10.3 Behaviours

1. Writes go through `setPreference(actor, {category, channel, enabled})` in `packages/core/notifications`; service rejects `S`/`T` email and in-app disables (AC test), and writes `consent_record` for `M`, SMS, WhatsApp and push.
2. Defaults come from the catalogue (not from rows). Changing a default in code does not touch users who explicitly chose.
3. SMS/WhatsApp enable flow verifies the phone first (OTP); disabling is immediate with no confirmation dialog.
4. Under-18: `M` rows hidden; SMS/WhatsApp rows hidden (WhatsApp) / shown with the 20:00 note (SMS); guardian contact is separate.
5. EU/UK region switch (X9): `P` educational lifecycle shows as "Learning tips (you chose to receive these)" and starts **off**, with a one-time prompt after sign-up; double opt-in email.
6. Language: all labels in `en` and `bn`; keyboard accessible; each toggle has an accessible name `"Email: Learning reminders, on"`; save is instant with an `aria-live` confirmation; no confirm-shaming copy.
7. Audit: every change appends an `audit_log` row (`security`-adjacent actions for `consent`, `pref.update` for the rest) and a `consent_recorded` in-app message (N-PRV-07).
8. Support view: read-only "why not received" panel listing the last 30 `notification_dispatch` rows with reasons (support role; masked contact).

### 10.4 Acceptance criteria

- **AC-PREF-01** Given a learner turns off "Learning reminders" email, When a streak nudge event fires, Then a `notification_dispatch` row with `status=skipped, reason=preference_off` exists, no email is sent, and the in-app badge still shows (if in-app is on).
- **AC-PREF-02** Given the same learner's pass expires in 7 days, Then `renewal_reminder_7d` is sent regardless of any preference, once.
- **AC-PREF-03** Given a user clicks the one-click unsubscribe in a digest, When the POST arrives, Then within 60 s the next `M` and digest decisions for that user are `skipped`, and `T`/`S` are unaffected.
- **AC-PREF-04** Given a 16-year-old user, When any `M` template is dispatched, Then the result is `skipped, reason=minor`, and the preference page shows no marketing row.
- **AC-PREF-05** Given quiet hours 22:00-08:00 and a `P` event at 23:10 local, Then the dispatch row is `deferred` with `release_at` = next 08:00 local and the message is re-checked at release (AC-NOT-01).

## 11. Inngest functions

Function ids follow `domain.kebab-action` (`06` §1 naming). All use the shared wrapper (idempotency on event id, Sentry capture, `job_dead_letter` on final failure).

| Function id | Trigger | Concurrency / throttle | Purpose |
|---|---|---|---|
| `notifications.dispatch` | event `notification/requested` (emitted by consumers below via the outbox helper) | concurrency 50 global, key `userId` limit 1 (ordered per user) | The single gate (§2.5). Everything else produces `notification/requested` with `{catalogueId, userId, entityId, props, dedupeKey}` |
| `notifications.release-deferred` | cron `*/5 * * * *` | 1 | Pick `notification_dispatch` deferred rows with `release_at <= now`, re-evaluate and send or drop |
| `notifications.send-welcome` / `send-receipt` / `access-ready` / `payment-failed` / `refund-result` / `renewal-reminder` / `access-ended` / `results-ready` / `evaluation-ready` / `evaluation-failed` / `credits-low` / `notify-grader` / `notify-user` / `notify-editors` / `notify-instructor` / `notify-moderators` / `send-org-invite` / `send-guardian-invite` / `notify-student` / `streak-milestones` / `course-complete` / `send-instructor-welcome` / `schedule-due-reminders` / `notify-thread-author` / `notify-course-staff` / `notify-finance` | the consumers already named in `06` §7.1 | per function | Thin mappers: build props from ids, call the dispatch helper with the catalogue id. These keep `06` valid |
| `notifications.onboarding-sequence` | `user.onboarded` (fallback `user.signed_up` + 24 h) | one run per user (`idempotency: userId`) | §3.2; `step.sleepUntil` recipient-local 10:00; `cancelOn`: `order.paid`, `privacy.deletion_requested`, `user.inactive_sunset` |
| `notifications.abandoned-checkout` | `order.created` | one per order | `waitForEvent('order.paid', +1h)` -> N-COM-09 steps; cancels on paid/cancelled |
| `notifications.payment-verifying` | `payment.initiated` | one per payment | Timer for N-COM-04, N-COM-06; cancelled by `order.paid` |
| `notifications.nudge-scan` | cron hourly (`0 * * * *`), processes learners whose local reminder hour = now in batches of 500 | concurrency 5 | N-LRN-01/02/05; applies cap class `nudge` |
| `notifications.weekly-digest` | cron hourly; selects users whose `digestDow/digestHour` in their timezone = now | concurrency 5 | N-LRN-06 builds stats then dispatches |
| `notifications.exam-countdown` | cron daily `0 * * * *` (hourly so each timezone hits 10:00/17:00) | concurrency 5 | N-LRN-08..12; uses `exam_date` and timezone |
| `notifications.free-credit-reset` | cron `0 * * * *` on day 1 of month, per timezone | 5 | N-LRN-14 (the credit grant itself belongs to `evaluation.grant-monthly-free-credit`, D12) |
| `notifications.expiry-schedule` | `entitlement.granted` | n/a | Queue T-30/T-7/T-1 in `entitlement_reminder` (once-only), already in `06` |
| `notifications.expiry-cron` | cron `0 3 * * *` UTC (= 09:00 Asia/Dhaka) | 1 | Emits `entitlement.expiring` for rows in window (`10` §7.6) |
| `notifications.live-reminders` | `live.session_scheduled` / `live.session_changed` | one per session; `cancelOn` change | `sleepUntil` T-24h, T-1h, T-15m (N-LIV-02..04) |
| `notifications.live-recording-ready` | `live.recording_ready` | n/a | N-LIV-06 |
| `notifications.guardian-report` | cron monthly | 5 | N-GRD-05 |
| `notifications.org-cohort-report` | cron weekly/monthly per org setting | 5 | N-ORG-05 |
| `notifications.winback-scan` | cron daily 05:00 UTC | 1 | N-WIN-01/02/04 candidate selection; sunset (N-WIN-03) |
| `notifications.instalment-schedule` | `instalment.due_soon` / `instalment.missed` crons | 5 | N-COM-16..18 |
| `notifications.sla-watch` (existing `evaluation.sla-watch`) | `evaluation.human_requested` + sleep | n/a | N-EVL-06, N-STF-07 |
| `notifications.staff-digest` | cron hourly | 5 | Staff queue digests (N-STF-02, 05, 06 backlog) |
| `notifications.process-email-webhook` (`webhooks.process-resend`) | `webhook.received` {provider:resend} | n/a | Bounce/complaint -> suppression, `email_log` status |
| `notifications.process-sms-dlr` (`webhooks.process-sms`) | `webhook.received` {provider:sms} | n/a | Delivery receipts, segment/cost reconciliation, operator metrics |
| `notifications.process-whatsapp-webhook` (P2) | `webhook.received` {provider:whatsapp} | n/a | Delivery, STOP keyword, template status changes |
| `notifications.template-health-report` | cron daily | 1 | Computes delivery/bounce/complaint/cap-drop rates per template, posts to `lifecycle` |
| `notifications.purge-log` | cron daily | 1 | Retention (`notification` 180 d, `email_log`/`notification_dispatch` 13 months) |
| `privacy.schedule-erasure` (existing) | `privacy.deletion_requested` | n/a | Emits N-PRV-03/04 at day 0/7/13; stops on cancel |
| `privacy.erase` (existing) | cron picked | n/a | Last step sends N-PRV-06 using the encrypted transient address |

Failure behaviour: provider 5xx/timeout -> Inngest retry with exponential backoff (max 5) then `job_dead_letter` and Sentry alert; SMS OTP does **not** retry past 30 s (user will re-request; avoids a stale code arriving after expiry); `T` receipts retry up to 24 h.

## 12. Tests

| Layer | What | Tool |
|---|---|---|
| Unit | Policy engine truth table (class x consent x pause x quiet hours x cap x minor x region) with generated cases (property tests) | Vitest + fast-check |
| Unit | `segments.ts` (GSM-7/UCS-2, extension characters, ZWJ, boundary lengths 160/161/70/71/134/135) | Vitest |
| Unit | Catalogue integrity: unique ids, every row has class, quiet-hours mode, cap, owner, locale, template id exists, SMS template exists for each `S` channel row | Vitest |
| Contract | `EmailProvider`, `SmsProvider`, WhatsApp adapter contract suites (idempotency, webhook signature, segment calc) per `10` §7 | Vitest |
| Integration | Dispatch end-to-end against test DB: deferral and release, cap counting across channels, suppression after a simulated bounce webhook, unsubscribe token flow, minor rule | Vitest + Neon branch |
| Integration | Event coverage: every `notifications.*` consumer in `06` §7.1 is present in the catalogue (NEW-NOTIF-03) | Vitest |
| Template | Snapshot en/bn, plain-text presence, a11y, i18n parity, link checker (§4.4) | Vitest + jest-axe |
| E2E | OTP email and SMS via fake provider; receipt after Buy-now; money-deducted-no-access flow with simulated late IPN produces `payment_pending` then `payment_reconciled`; deletion schedule/cancel/complete mails; export-ready link expiry 24 h | Playwright + Mailpit/Resend test addresses |
| Time | Fake clock tests for DST-free Asia/Dhaka and for a learner in a DST zone (Europe/London) around transitions; digest hits "Sunday 18:00 local" once | Vitest with injected clock |
| Load | 20k dispatch events burst (campaign + exam-day) does not starve `S`/`T` (priority queues: separate Inngest concurrency keys for `S/T` vs `P/M`) | k6 or Inngest dev + script |
| Deliverability | Pre-launch: SPF/DKIM/DMARC alignment check, seed-list placement, operator SMS delivery matrix | Manual + mail-tester style tools |
| Compliance | Minor fixture receives zero `M` across the whole catalogue; EU fixture routes P educational as `M`; deleted/pending-deletion fixture receives only privacy mails | Vitest |
| Accessibility/copy | Bangla reviewer sign-off checklist per template (glossary, tone, numerals) | Manual (NEW-NOTIF-20) |

## 13. Metrics for the messaging system (feeds `32`)

Per template and channel: `sent`, `delivered`, `bounced`, `complained`, `unsubscribed`, `clicked` (email), `skipped by reason`, `dropped by cap`, `deferred`, time-to-deliver p95, SMS segments and cost, conversion events attributed to a message via `utm_campaign=<template_id>` plus server-side attribution window of 7 days. Message events to PostHog are server-side only and contain `template_id`, `catalogue_id`, `channel`, `locale`, `class` (never address/phone). See `32` §events `message_sent`, `message_delivered`, `message_clicked`, `message_unsubscribed`, `notification_opened`.

## 14. Backlog tasks (NEW-NOTIF-xx)

> **Final IDs: see 12 Appendix E.** The `NEW-*` IDs in this list are source IDs only; PROGRESS.md and the build loop use the final P0/P1/P2/P3 IDs (or `BG-xx` human gates) given there. Do not rewrite this list.

Format matches `12` §11 (ID, title, owner model per D9, dependencies, acceptance). Existing tasks extended: `P1-40` (transactional emails) is **superseded in scope** by NEW-NOTIF-04/05/07; `P1-41` (expiry reminders) by NEW-NOTIF-08. Dependencies reference existing `P0-17` (email provider), `P1-34` (entitlements) as in `12`.

| ID | Title | Phase | Owner | Depends | Acceptance criteria |
|---|---|---|---|---|---|
| NEW-NOTIF-01 | Fix doc conflicts X1-X10 (edit `10` §11.1 TTLs, `09` §13.9 14 days, `03` F-NOT-03/04, `20` §6.2/§9.1, `00` change-log line) | P0 | haiku | none | Greps for "15 min", "7-day cooling-off" return nothing; change-log entry added in `00` |
| NEW-NOTIF-02 | Typed catalogue `packages/core/src/notifications/catalogue.ts` + generator for this table and `docs/generated/notification-templates.md` | P0 | sonnet | NEW-NOTIF-01 | CI fails if table and code diverge; every row has class, quiet mode, cap, owner |
| NEW-NOTIF-03 | Event-coverage check (`tooling/trace-notifications.ts`) tying `06` §7.1 `notifications.*` consumers to catalogue ids | P0 | sonnet | NEW-NOTIF-02 | Fails when a consumer or catalogue event is unmapped |
| NEW-NOTIF-04 | Dispatcher `notifications.dispatch` with the §2.5 decision order and ledger table migration (`notification_dispatch`, `notification_setting`, enums) | P1 | sonnet | P0-17, NEW-NOTIF-02 | Policy truth-table tests (>= 300 generated cases) pass; AC-NOT-01/02 pass |
| NEW-NOTIF-05 | Auth and security templates (N-AUTH-01..16) en/bn incl. plain text; wire Better Auth hooks and new `auth.*` events | P1 | sonnet | NEW-NOTIF-04 | Snapshot + a11y tests pass; OTP link tracking off; OTP TTL 5 min, link 60 min asserted in test |
| NEW-NOTIF-06 | Preference centre (`/app/settings/notifications`, one-click unsubscribe API, token page, consent sync with `marketing_opt_in`) | P1 | sonnet | NEW-NOTIF-04 | AC-PREF-01..05 pass; Playwright e2e en/bn; axe clean |
| NEW-NOTIF-07 | Commerce templates N-COM-01..08, 19..25 (receipt, payment states, refund states) en/bn; checkout SMS consent checkbox | P1 | sonnet | P1-34, NEW-NOTIF-04 | e2e: Buy-now receipt, failed payment, refund; amounts from snapshot only |
| NEW-NOTIF-08 | Expiry reminders T-30/T-7/T-1 + expired (replaces `P1-41` scope) | P1 | sonnet | P1-34 | Exactly-once per `entitlement_reminder`; skip if queued pass; AC-PAY-05 |
| NEW-NOTIF-09 | Reconciliation notices N-COM-04/06/07 + support ticket hook (`payment.reconcile_delayed`) | P1 | sonnet | NEW-NOTIF-07, `10` §2.7 | Simulated late IPN e2e shows pending -> reconciled messages; support item created with prefetched status |
| NEW-NOTIF-10 | SMS stack: segment calculator, template register, gateway DLR webhook, operator failover, spend alarm | P1 | sonnet | `SmsProvider` | Segment tests pass; failover test; alarm fires at 2x average |
| NEW-NOTIF-11 | Onboarding sequence engine + `lifecycle_enrolment` + N-ONB-01..14 templates | P1 | sonnet (copy: haiku) | NEW-NOTIF-04 | State machine tests, exit on purchase, minor skips M, quiet-hours deferral |
| NEW-NOTIF-12 | Deliverability setup: DNS records for three streams, DMARC rollout plan, Postmaster Tools, warm-up governor, bounce/complaint webhook -> `contact_suppression` | P1 | sonnet + founder (DNS) | P0-17 | DMARC aligned in test mails; suppression test; warm-up caps enforced in code |
| NEW-NOTIF-13 | Evaluation and results templates N-EVL-01..11 incl. rescore broadcast | P1 | sonnet | `evaluation.*` events | AI evaluation ready in-app within SLA; no essay text in any template (test) |
| NEW-NOTIF-14 | Privacy templates N-PRV-01..11 and job hooks (export ready, deletion scheduled/reminders/cancelled/completed, policy update) | P1 | sonnet | `privacy.*` jobs | Day 0/7/13 timeline test with fake clock; completion mail sent exactly once, address not retained afterwards |
| NEW-NOTIF-15 | Learning nudges N-LRN-01, 05..15, 17..19, 21 with cap class `nudge` and reminder-time settings | P1 | sonnet | NEW-NOTIF-04 | Cap tests: never > 1/day, 4/week; never after 21:00 (20:00 minors) |
| NEW-NOTIF-16 | Weekly digest + exam countdown crons (timezone-aware) | P1 | sonnet | NEW-NOTIF-15 | Sunday 18:00 local verified for BD and London fixtures |
| NEW-NOTIF-17 | Abandoned checkout and win-back sequences (M class), sunset logic | P1 | sonnet | NEW-NOTIF-11, consent | No M sent to minors/non-consented; sunset after 90 days no click |
| NEW-NOTIF-18 | Template change control for SMS/WhatsApp (version table, approval log, CI blocks edits to registered strings without a new version) | P1 | sonnet | NEW-NOTIF-10 | PR touching registered SMS text fails unless version bumped |
| NEW-NOTIF-19 | Staff and creator alerts N-STF-01..12, digests, role changed mail, 2FA-required reminders | P1 | sonnet | `06` events | Grader SLA warning at 36 h of 48 h test; staff digest grouping test |
| NEW-NOTIF-20 | Bangla copy pass: glossary-driven translation + reviewer sign-off checklist for all T/S templates, then P | P1 | haiku draft, human reviewer | `33` glossary | Reviewer sign-off file per template; i18n parity CI green |
| NEW-NOTIF-21 | Helpdesk integration: signed webhook mirroring ticket status into in-app inbox; DKIM for helpdesk domain | P1 | sonnet | GA-003 decision | Mirror latency < 30 s; helpdesk mail passes DMARC |
| NEW-NOTIF-22 | Live class reminders T-24h/T-1h/T-15m + changed/cancelled + recording-ready (P1 manual Zoom pilot via admin form) | P1 | sonnet | `18`, admin form | Cancel supersedes pending reminders; time zone and `.ics` correct in DST test |
| NEW-NOTIF-23 | Guardian, org, instalment, subscription templates and jobs | P2 | sonnet | P2 features | Guardian report only with granted link; instalment missed ladder with fake clock |
| NEW-NOTIF-24 | WhatsApp Business adapter, opt-in flow, template submission pack, STOP handling | P2 | sonnet | NEW-NOTIF-10 | Sandbox send; STOP suppresses < 60 s; templates versioned |
| NEW-NOTIF-25 | Web push (PWA) subscription and sender | P2 | sonnet | PWA task | Opt-in gating; 410 cleanup; payload has no PII |
| NEW-NOTIF-26 | Template health dashboard + weekly report (`notifications.template-health-report`) | P2 | sonnet | NEW-NOTIF-04, `32` | Dashboard shows per-template rates; alerts on complaint > 0.1% |
| NEW-NOTIF-27 | Native push for Expo app | P3 | sonnet | P3 mobile | Same dispatcher; ledger rows |
| NEW-NOTIF-28 | Legal review pack for notification consent, EU/UK region switch, SMS/WhatsApp rules, policy-update notice period | P1 gate | founder + counsel | NEW-NOTIF-06 | Written sign-off before first `M` send |

## 15. Open questions

1. Which BD gateway and sender ID; are Bangla Unicode SMS templates accepted for service messages; cost per segment (`10` §11.2 [U]).
2. Are payment-status SMS acceptable under PDPO consent as a service message with a pre-ticked BD default (X4)? **[LEGAL]**
3. Should impersonation (N-AUTH-16) notify the user at all, and how soon; trade-off with fraud investigations. Founder decision.
4. Auto-renew notice timing by region (X5) and whether Paddle's own notices suffice.
5. Whether `weekly_progress_digest` day should default to Sunday (a working day in BD) or Saturday/Friday evening (weekend); needs data from first 30 days.
6. Instalment product shape and default/grace policy (GA-001) before N-COM-16..18 copy is final.
7. Meta's current WhatsApp pricing and Bangladesh-specific category rules **[V]**.
