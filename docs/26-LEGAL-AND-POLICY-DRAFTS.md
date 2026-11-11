# 26 — Legal & Policy Drafts

> **DRAFT — requires review by a Bangladesh-qualified lawyer before publication.**
> Nothing in this file is legal advice. These are *templates for counsel to mark up*, written by an operations/legal-ops drafter so that counsel starts from text instead of a blank page (closes GA-002, GA-014 text part, GA-019 cookie inventory, GA-026 legal-basis note, GA-047/048 text part).
> Status: draft v1, 2026-11-07. Conforms to `00-DECISIONS.md` (D4 roles, D5 commerce, D6 "estimated" labels, D7 minors/security, D10 tiers, D12 binding resolutions). If this file disagrees with `00`, `00` wins.
> Companion: `27-SUPPORT-AND-TRUST-OPERATIONS.md` (how the policies are *operated*: moderation, disputes, DSAR, safeguarding, enforcement ladder).

> **Binding facts (delivery lead, 2026-11-07), applied throughout:** helpdesk = Chatwoot Cloud (D12 C29); attempt voiding = self-serve once per attempt under the GA-007 rule, otherwise `support`/`admin`, always audited (C30); trademark notices = D12 C31 verbatim (§7.1); account deletion grace = **14 days** (C7); speaking audio = **90 days** unless consent or an open dispute (C6); refund consumption measure = D12 C28; `17-PRICING-MASTER.md` now exists (placeholders `{{17:…}}` are filled from it).

## 0. How to read this document

### 0.1 Flag legend (used inline everywhere)

| Tag | Meaning | Who resolves |
|---|---|---|
| **[LEGAL]** | A legal judgement call counsel must make or confirm (enforceability, wording, whether a duty exists). | Counsel |
| **[VERIFY]** | A fact (statute name, number, deadline, vendor term, official wording) I could not confirm from the repo or from memory with confidence. Do not publish until checked. | Counsel / owner named in §20 |
| **[DECIDE]** | A business/product decision for the founders that the text depends on. Default is written in the text. | Founders |
| **[U]** | Genuinely uncertain whether the law says this at all (including pending/recent Bangladeshi law: PDPO 2025 and its Feb 2026 amendment, Cyber Security Ordinance 2025). Text is a conservative placeholder. | Counsel |

Counsel decision register (consolidated, numbered `L-xx`) is in §19. Every `[LEGAL]`/`[DECIDE]` below carries or maps to an `L-xx` ID where it matters.

### 0.2 Template variables (resolved from `packages/config/brand.ts` + `packages/config/legal.ts`, never hard-coded)

| Variable | Meaning | Status |
|---|---|---|
| `{{BRAND}}` | "Lumen Academy" (placeholder, D header) | placeholder |
| `{{LEGAL_ENTITY}}` | Registered company name, e.g. "… Limited" | **[DECIDE]** — entity not yet incorporated per repo; also determines Paddle onboarding (D3) |
| `{{ENTITY_ADDRESS}}`, `{{REG_NO}}`, `{{TIN}}`, `{{BIN}}` | Registered office, RJSC no., TIN, VAT BIN | **[DECIDE]** |
| `{{DOMAIN}}` | Public domain | placeholder |
| `{{SUPPORT_EMAIL}}` `{{PRIVACY_EMAIL}}` `{{SECURITY_EMAIL}}` `{{LEGAL_EMAIL}}` `{{SAFEGUARDING_EMAIL}}` `{{COPYRIGHT_EMAIL}}` `{{ACCESSIBILITY_EMAIL}}` | Role mailboxes (`support@`, `privacy@`, `security@`, `legal@`, `safeguarding@`, `copyright@`, `accessibility@`) | create before launch |
| `{{GRIEVANCE_OFFICER}}` | Named complaints contact | **[VERIFY]** whether BD e-commerce rules require a named grievance contact (`[U]`) |
| `{{PRIVACY_OWNER}}` | Named internal owner for privacy (09 §13.1 "named privacy contact") | founder until hired; **[LEGAL]** whether a formal DPO is required |
| `{{EU_UK_REP}}` | GDPR Art. 27 / UK representative | only if EU/UK volume material (09 §13.2) **[LEGAL]** |
| `{{EFFECTIVE_DATE}}`, `{{VERSION}}` | Set by the `policy_version` row (§19.3) | automatic |
| `{{PAYMENT_MOR}}` | "Paddle.com Market Limited" (Paddle as merchant of record) — or Stripe path if Paddle onboarding fails (D3) | **[VERIFY]** entity name and buyer terms |

### 0.3 Document inventory and public routes

All pages live in `(marketing)` (D2). 03's sitemap lists six legal routes; this doc adds the rest. **Route additions needed in 03/12** (see §19.5).

| # | Document | Route (en; `/bn/…` for Bangla) | Phase to publish | Bangla summary included here |
|---|---|---|---|---|
| 1 | Terms of Service | `/legal/terms` | P1 launch | Yes |
| 2 | Privacy Policy (+ processors list) | `/legal/privacy`, `/legal/processors` | P1 launch | Yes |
| 3 | Cookie Policy (+ inventory) | `/legal/cookies` | P1 launch | Yes (short) |
| 4 | Refund & Cancellation Policy (+ Progress Promise Terms) | `/legal/refund-policy`, `/legal/progress-promise` | P1 launch (Progress Promise: Mentor from P1, D12 C13) | Yes |
| 5 | AI Scoring Disclaimer & Methodology | `/legal/ai-scoring-policy` | P1 launch | Yes |
| 6 | Academic Integrity & Acceptable Use | `/legal/acceptable-use` | P1 launch | Yes (short) |
| 7 | Content & Trademark Notice | `/legal/trademark-notice` | P1 launch (+ footer on every page, 07 §9.5) | Notice text only |
| 8 | Community Guidelines | `/legal/community-guidelines` | P1 launch (official FB group/Discord, D12 C21) | Yes (short) |
| 9 | Live Class Code of Conduct & Safeguarding | `/legal/live-conduct` | P1 launch (Live pilot + Plus Q&A run on Zoom) | Yes |
| 10 | Instructor / Creator Agreement | signed off-platform P1; `/legal/creator-terms` P3 | P1 (contractors), P3 (marketplace) | No (contract) |
| 11 | Grader / Item-writer Contractor Agreement | off-platform | P1 | No |
| 12 | Admissions Services Terms | `/legal/admissions-terms` | P2a (21) — draft now | Yes (short) |
| 13 | Accessibility Statement | `/accessibility` | P1 launch | Yes (short) |
| 14 | Security / Responsible Disclosure | `/security`, `/.well-known/security.txt` | P1 launch (09 §14.2) | No |
| 15 | DMCA / Takedown & Copyright Complaint Procedure | `/legal/copyright` | P1 launch | No |
| 16 | Data Processing Addendum outline (B2B) | `/legal/dpa` (download) | P2 (org accounts) | No |

### 0.4 Five points that must not be skipped (highest liability)

1. **Minors cannot (probably) be bound by a contract on their own** under the Contract Act 1872 / Majority Act 1875 (age of majority 18) — which is why the purchase, Mentor and live flows require a guardian. **[LEGAL][VERIFY]** L-04.
2. **"Progress Promise"** (Mentor only) is advertising + a contractual promise. Text in §4.9; wording of "target", "guarantee" vs "promise", verification of official score reports, and accounting treatment need counsel + accountant. **[LEGAL]** L-12.
3. **"Estimated" AI scores** + any accuracy claim: do **not** publish accuracy numbers until the gold-set gate (GA-006, 07 §7.9) passes. **[LEGAL]** L-13.
4. **Cross-border transfer** of essays/audio (incl. minors' voice) to US AI vendors under PDPO "equivalent protection" (undefined) — transfer mechanism and DPIA must exist before launch. **[U]** L-08.
5. **Third-party trademarks** (ETS wording is fixed; IELTS wording unverified and **03 and 07 currently disagree**, see §7). **[VERIFY]** L-16.

### 0.5 Conflicts found in the repo that affect legal text (fix before publishing; full list in §19.6)

| # | Conflict | Text in this doc follows |
|---|---|---|
| X1 | Audio retention: D12 C6 = 90 days; `05` §4.10 table still says "180 days after completion", `07` §7.11 says 180 | **90 days** (D12 wins) |
| X2 | Deletion cooling-off: D12 C7 = 14 days; `09` §13.9 says 7 days | **14 days** |
| X3 | Export link validity: `03` F-ACC-05 = 7 days; `09` §13.9 = 24 h presigned; `05` = 7-day signed URL | **7 days**, re-auth required (to be confirmed) |
| X4 | Order/invoice retention: `05` §7 = 10 years; `09` §13.7 = 6–7 years | "up to 10 years" pending accountant (L-09) |
| X5 | Audit log: `05` = 7 yr; `09` = 24 months | "up to 7 years" for audit/financial records (L-09) |
| X6 | Creator royalty: D12 C19 = optional 10% for lead instructor; `02` §8.4/A14 = 12% | **10%** (D12 wins) |
| X7 | Human review: `09` §10.4 "free once/month for disputes"; `03` F-AIW-10 "P1 only for Low-confidence results and certain passes" | Policy text allows one free dispute review/month **[DECIDE]** L-14 |
| X8 | `17-PRICING-MASTER.md` did not exist when this draft was written (D10 refers to it as canonical) | **Resolved: `17-PRICING-MASTER.md` now exists.** Replace every `{{17:…}}` placeholder with the value from 17 §2.2 (credits, mocks, reviews, access days) via the legal MDX build (task P1-118); refund text stays keyed to D5/D12 C13b/C28 |
| X9 | `guarantee_claim` is "modelled in 05" per D12 C13 but is absent from `05` | Sketch provided in `27` §19 |
| X10 | `consent_kind` enum (05) lacks kinds needed here (honour code, live conduct, guardian use, creator terms) and there is no `policy_version` table | §19.3 proposes additions |

---

## 1. Terms of Service

> **DRAFT — requires review by a Bangladesh-qualified lawyer before publication.** Document id `terms`; version `{{VERSION}}`; effective `{{EFFECTIVE_DATE}}`. English is the authoritative text unless counsel decides a Bangla version must be (L-02).

### 1.1 Draft text

**1. Who we are and what these Terms cover**
1.1 {{BRAND}} is operated by {{LEGAL_ENTITY}} ("**we**", "**us**"), registered at {{ENTITY_ADDRESS}} (Reg. no. {{REG_NO}}, BIN {{BIN}}). These Terms govern your use of {{DOMAIN}}, our web app, courses, mock tests, AI evaluations, live classes, books and related services (the "**Service**").
1.2 By creating an account, buying, or using the Service you accept these Terms, the Privacy Policy, Refund & Cancellation Policy, AI Scoring Policy, Academic Integrity & Acceptable Use Policy and, where relevant, the Live Class Code of Conduct and Admissions Services Terms (together the "**Policies**"). If you do not accept them, do not use the Service.
1.3 **Who sells to you.** If you pay in BDT, we are the seller. If you pay in USD or another foreign currency, our payment partner {{PAYMENT_MOR}} acts as merchant of record and is the seller of the transaction; its buyer terms apply to the payment, and these Terms govern the Service you receive. **[VERIFY][LEGAL]** (L-05: Paddle onboarding for a BD seller is unconfirmed, D3; wording changes if Stripe via a foreign entity is used).

**2. Who may use the Service**
2.1 You must be at least **13**. We do not offer accounts to children under 13; if we learn an account belongs to someone under 13 we will delete it. **[LEGAL]** (09 §13.3 COPPA note: US-directed marketing)
2.2 If you are **under 18**, you may use the Service only with the consent of a parent or legal guardian ("**Guardian**"). Until a Guardian's consent is verified (by one-time code to the Guardian's email or phone), your account is limited to free lessons and free practice; paid purchases and features that record your voice are unavailable. A Guardian is responsible for purchases made for a minor and for the minor's compliance with the Policies. **[LEGAL]** (L-04: minors' contracts; whether a Guardian-purchaser model is sufficient, and the Guardian-consent verification standard under PDPO).
2.3 You must give accurate information, keep your login credentials safe, and tell us promptly of any unauthorised use. Staff-type accounts (instructor, grader, counsellor, org admin) must use two-factor authentication.
2.4 **One account, one person.** Accounts, entitlements and content are personal. You may sign in on at most the number of devices/sessions shown in your account settings. Sharing, lending, reselling or publishing login details or access is prohibited (see Acceptable Use).

**3. The Service**
3.1 *Courses, mocks, AI and live classes.* Features and content change over time. We show how many full mock tests exist now and when more are scheduled (for example "5 now, 10 by <date>"); we will not sell a count we cannot yet serve (D10).
3.2 *Not an exam body.* We are independent. We are **not** affiliated with, endorsed or approved by ETS, the University of Cambridge, the British Council, IDP, Pearson, Duolingo or Common App. See the Content & Trademark Notice.
3.3 *Estimated scores.* All band/scaled scores and predictions we show are **estimates** from practice material and are not official results (see AI Scoring Policy). We do not guarantee any exam score, admission, scholarship or visa outcome. The only score-related commitment we make is the separate **Progress Promise** that applies to the **Mentor** tier alone (Refund & Cancellation Policy, Part C).
3.4 *Availability.* We aim for high availability but do not promise uninterrupted service. Exam attempts are timed by our server; if your connection fails during an exam-mode mock, the rules in the Exam Disruption section of the Help Centre apply: a section interrupted for more than 2 minutes may be voided and re-issued once per attempt through the "I lost connection" flow, otherwise Support may grant a replacement credit (D12 GA-007).

**4. Prices, payment, taxes**
4.1 Prices are shown in BDT or USD (region prices may differ, D10/C16). Displayed prices include applicable VAT/sales tax unless stated otherwise. **[VERIFY]** whether BD consumer-facing prices must be VAT-inclusive (accountant, GA-011).
4.2 **Reference ("was") prices** are shown only if that price was actually charged for at least 28 consecutive days in the last 90 days (D12 C14). Discounts and coupons are limited to the stated terms and may not be combined unless stated.
4.3 **Payment methods.** BD payments are processed through SSLCommerz (bKash, Nagad, Rocket, cards) and similar providers; we never see your card or wallet PIN. A payment is complete only when the provider confirms it to us; access is granted automatically then. If your wallet was debited but you have no access, contact Support with the transaction ID — we will resolve or refund it (see Refund Policy).
4.4 **BD passes are prepaid and do not auto-renew.** We send reminders before expiry. **International subscriptions auto-renew** until cancelled; renewal price, period and how to cancel are shown before you pay and in each reminder. **[LEGAL]** (L-06: auto-renewal disclosure and cancellation rules in the EU/UK/US states; consumer-law developments post-2025 are not confirmed here.)
4.5 **Instalments** (bKash instalments for Live/Mentor, D10). If an instalment fails, we will notify you and allow a grace period of **7 days** `[DECIDE]`, after which access to live sessions and unreleased materials may be paused until payment; unpaid instalments remain due unless a refund applies. **[LEGAL]** (L-07: enforceability of the remaining-balance obligation; whether this is "credit" under BD law.)
4.6 Fraud controls: we may hold or cancel an order flagged high-risk by the payment provider and ask for verification before granting access.

**5. Your licence to the content**
5.1 Subject to these Terms and payment, we grant you a personal, non-exclusive, non-transferable, revocable licence to access the content you have bought, for your own non-commercial exam preparation, for the access period shown (for example Core: 6 months, D10).
5.2 You may not copy, record, download (except features we provide), scrape, redistribute, sell, publish (including on Telegram, Facebook, WhatsApp or file-sharing sites), translate for distribution, or use content to build a competing product or train a machine-learning model. Videos and exam pages carry a **visible watermark** identifying your account; you agree not to remove or obscure it.
5.3 We own or license all content. Rights not expressly granted are reserved.

**6. Your content and data**
6.1 You own what you write or say (essays, recordings, Q&A posts, reviews). You grant us a worldwide, royalty-free licence to host, process and display it to provide the Service to you (including sending it to AI and speech-to-text providers listed in the Privacy Policy), to show your public posts where you chose to post them, and to keep it as described in the retention schedule. **[LEGAL]** (L-10: scope of licence for community posts after account deletion.)
6.2 We use your submissions to improve our AI or to build calibration sets **only with your separate, optional consent** (Privacy Policy). You can withdraw it.
6.3 You must have the right to submit what you submit and must not submit others' personal data or copyrighted exam material.

**7. AI features and human review.** AI evaluations are automated, advisory and "estimated". You can request human review as described in the AI Scoring Policy. AI output can be wrong; do not rely on it for decisions with legal or financial consequences (for example visa applications).

**8. Live classes and mentors.** Live sessions follow the Live Class Code of Conduct and Safeguarding Policy. Recordings are made for learning use only and are retained per the Privacy Policy; you may not record or share sessions.

**9. Admissions services.** Admissions tools and counsellor sessions are feedback-and-organisation services only. We do not write your essays, guarantee admission, or act as an immigration or legal adviser (Admissions Services Terms).

**10. Refunds and cancellation.** Our Refund & Cancellation Policy forms part of these Terms. In short: refund requests are accepted within 7 days of purchase if you have consumed less than 20% of the product; consumed AI credits are not refundable (D5). Statutory consumer rights that cannot be excluded are not affected. **[LEGAL]** (L-03: EU/UK 14-day withdrawal right for digital content/services and how consent-to-start/waiver is captured at checkout; BD Consumer Rights Protection Act 2009 and Digital Commerce Guidelines 2021 — exact obligations unverified.)

**11. Acceptable use and enforcement.** You agree to the Academic Integrity & Acceptable Use Policy. If you breach it we may, depending on severity and history: warn you; limit features or sessions; suspend; or terminate your account and revoke entitlements without refund where the breach is serious (for example publishing paid content, sharing accounts at scale, fraud, harassment). You may appeal any suspension or termination by emailing {{SUPPORT_EMAIL}} within 30 days; a person not involved in the original decision will review it. **[LEGAL]** (L-11: proportionality of no-refund termination for consumers.)

**12. Intellectual property and feedback.** Our trademarks, software and content are ours or our licensors'. Third-party exam names belong to their owners. If you give us feedback or suggestions we may use them without obligation to you.

**13. Third-party services.** The Service uses third parties (payment providers, video, email/SMS, Zoom for live classes, AI providers). We are not responsible for their independent acts, but remain responsible for our own processors under the Privacy Policy.

**14. Suspension and termination by you.** You may stop using the Service at any time and delete your account in Settings → Privacy; deletion takes effect after a **14-day grace period** during which you can cancel by signing in (D12 C7). Deleting your account does not by itself entitle you to a refund. Some records (for example financial records) must be kept by law.

**15. Disclaimers.** The Service is provided "as is" and "as available" to the extent permitted by law. We do not promise that the Service will be error-free, that practice material matches any official test, or that you will achieve a target score. **Nothing in these Terms excludes or limits liability that cannot be excluded by law, including for death or personal injury caused by negligence or for fraud.** **[LEGAL]** (L-15: enforceability of "as is" disclaimers against consumers in BD and mandatory consumer law in the user's country.)

**16. Limitation of liability.** To the extent permitted by law, our total liability to you for any claim arising from the Service is limited to the amount you paid us in the 12 months before the claim (or BDT 5,000 / USD 50 if greater) `[DECIDE]`, and we are not liable for indirect or consequential loss, lost opportunity (including lost admission or job offers), or loss caused by your device, network or load-shedding. **[LEGAL]** (L-15.)

**17. Indemnity.** You are responsible for claims by third parties arising from content you submit in breach of these Terms. (Consumer-friendly narrow form; broad indemnities are not used.) **[LEGAL]**

**18. Changes.** We may update these Terms. For material changes we will give at least **30 days'** notice by email and in-app and will ask you to accept the new version before you continue (recorded per §19.3); non-material changes (typos, clarifications) take effect when posted. If you do not accept a material change you may stop using the Service and, for prepaid unused periods affected adversely, request a pro-rata refund. **[LEGAL]** (L-02: unilateral variation of consumer contracts.)

**19. Notices and contact.** We contact you at the email/phone on your account. You can contact us at {{SUPPORT_EMAIL}}, through the in-app help centre, or at {{ENTITY_ADDRESS}}. Complaints: {{GRIEVANCE_OFFICER}}; we acknowledge within 2 business days and aim to resolve within 14 days `[DECIDE]`.

**20. Governing law and disputes.** **[LEGAL] — three options for counsel (L-01):**
- **Option A (recommended default):** Bangladeshi law governs; courts of Dhaka have jurisdiction; before suing, parties try good-faith negotiation for 30 days. Mandatory consumer protections of your country of residence are unaffected.
- **Option B:** As A, but disputes between the company and *institutional/B2B* customers go to arbitration seated in Dhaka under the Arbitration Act 2001 `[VERIFY]` — consumers excluded.
- **Option C:** Mandatory arbitration for all users — **not recommended** for minors and EU/UK consumers (likely unenforceable or unfair; class-action waivers are a US concept `[U]`).

**21. General.** If a clause is unenforceable the rest continues. These Terms and the Policies are the whole agreement between you and us about the Service. You may not transfer your rights; we may transfer ours on a business sale (with notice). Events outside our reasonable control (for example national internet shutdown, payment network outage) excuse delay; **your own** connectivity or power failures are not such events but are addressed by the exam-disruption rule in 3.4. A person who is not a party has no right to enforce these Terms except Guardians as stated.

### 1.2 Bangla summary (সংক্ষিপ্ত সারাংশ)

> *Draft Bangla summary for the key consumer terms. Not a substitute for the full Terms; requires review by a Bangla-literate legal translator. If the English and Bangla differ, English prevails unless counsel decides otherwise (L-02).*

**ব্যবহারের শর্তাবলির মূল কথা (সংক্ষেপে)**
- **বয়স:** সেবা ব্যবহারের ন্যূনতম বয়স ১৩ বছর। ১৮ বছরের কম বয়সীদের জন্য অভিভাবকের সম্মতি প্রয়োজন। অভিভাবক সম্মতি যাচাই না করা পর্যন্ত শুধু ফ্রি লেসন ও ফ্রি প্র্যাকটিস ব্যবহার করা যাবে; পেইড কেনাকাটা এবং ভয়েস রেকর্ডিংযুক্ত ফিচার বন্ধ থাকবে।
- **এক অ্যাকাউন্ট, এক ব্যক্তি:** আপনার অ্যাকাউন্ট ও কোর্স শুধু আপনার নিজের ব্যবহারের জন্য। অন্যকে লগইন দেওয়া, কোর্স বিক্রি করা, বা ভিডিও/মক টেস্ট টেলিগ্রাম, ফেসবুক, হোয়াটসঅ্যাপে ছড়িয়ে দেওয়া নিষিদ্ধ। ভিডিওতে আপনার অ্যাকাউন্ট-সংশ্লিষ্ট ওয়াটারমার্ক দেখা যাবে।
- **আনুমানিক স্কোর:** আমাদের দেওয়া ব্যান্ড বা স্কোর কেবল **আনুমানিক (Estimated)**—এটি অফিসিয়াল পরীক্ষার ফল নয়। কোনো নির্দিষ্ট স্কোর, ভর্তি, বৃত্তি বা ভিসার নিশ্চয়তা আমরা দিই না। শুধু **মেন্টর** প্যাকেজে আলাদা শর্তসাপেক্ষে “প্রোগ্রেস প্রমিজ” আছে, যেখানে লক্ষ্য পূরণ না হলে বিনামূল্যে পুনরায় ভর্তির সুযোগ মেলে, নগদ ফেরত নয়।
- **মূল্য ও পেমেন্ট:** মূল্য প্রযোজ্য ভ্যাটসহ দেখানো হয় (যাচাই সাপেক্ষে)। “আগের দাম” তখনই দেখানো হয় যখন গত ৯০ দিনে অন্তত টানা ২৮ দিন সেই দাম সত্যিই নেওয়া হয়েছে। বিকাশ/নগদে টাকা কেটে গেলে কিন্তু অ্যাক্সেস না পেলে ট্রানজ্যাকশন আইডিসহ সাপোর্টে জানান—আমরা সমাধান করব বা টাকা ফেরত দেব।
- **রিফান্ড:** সাধারণ নিয়মে কেনার ৭ দিনের মধ্যে এবং পণ্যের ২০%-এর কম ব্যবহার হলে ফেরতের আবেদন করা যায়; ব্যবহৃত AI ক্রেডিট ফেরতযোগ্য নয়। বিস্তারিত রিফান্ড নীতিতে দেখুন।
- **নিয়ম ভাঙলে:** সতর্কতা, ফিচার সীমিত করা, সাময়িক স্থগিত বা অ্যাকাউন্ট বন্ধ হতে পারে। সিদ্ধান্তের বিরুদ্ধে ৩০ দিনের মধ্যে আপিল করা যাবে।
- **অ্যাকাউন্ট মুছে ফেলা:** মুছে ফেলার অনুরোধের পর ১৪ দিন অপেক্ষার সময় থাকে; এই সময়ে সাইন-ইন করলে অনুরোধ বাতিল হয়। আইনের প্রয়োজনে কিছু আর্থিক তথ্য সংরক্ষিত থাকে।
- **শর্ত পরিবর্তন:** গুরুত্বপূর্ণ পরিবর্তনের অন্তত ৩০ দিন আগে ইমেইল ও অ্যাপে জানানো হবে এবং নতুন শর্তে আপনার সম্মতি নেওয়া হবে।
- **প্রযোজ্য আইন:** বাংলাদেশের আইন (চূড়ান্ত বিষয় আইনজীবীর পর্যালোচনা সাপেক্ষে)। অভিযোগ জানাতে: {{SUPPORT_EMAIL}}।

---

## 2. Privacy Policy

> **DRAFT — requires review by a Bangladesh-qualified lawyer before publication.** Document id `privacy`; implements the checklist in `09` §13.5 and the defaults in §13.1–13.9. **PDPO status caveat [U]:** per 09 §13.1 the Personal Data Protection Ordinance 2025 (cabinet approval 9 Oct 2025; amendment gazetted 5 Feb 2026) has an unconfirmed commencement date, an unconfirmed definition of "child", an undefined "equivalent protection" transfer test and an unconfirmed breach-notice deadline; reports of a "local storage mandate" conflict with the "critical sectors only" reading. The text below is written to the strictest plausible reading and **must be re-checked against the gazetted text**. Google OAuth brand verification needs this page public on the authorised domain (09 §13.5).

### 2.1 Draft text

**1. Who is responsible for your data**
{{LEGAL_ENTITY}} ("**we**") is the data controller for personal data processed through {{BRAND}}. Contact: {{PRIVACY_EMAIL}}; privacy owner: {{PRIVACY_OWNER}}; address {{ENTITY_ADDRESS}}. {{EU_UK_REP}} (if applicable). For international card payments, {{PAYMENT_MOR}} is an independent controller of your payment data (09 §13.8). **[LEGAL]** (L-08: controller/processor roles with Paddle; whether registration with the National Data Governance Authority (NDGA) is required `[U]`.)

**2. What we collect**

| Category | Examples | Source |
|---|---|---|
| Account | name, email, phone, password-less sign-in data, Google profile (name, email, avatar) if you use Google, language, country, time zone, age band, target exam/score, exam date | You / Google |
| Learning | progress, notes, bookmarks, vocabulary, mistake notebook, mock-test answers and timings, attempt integrity notes (focus loss, connection gaps) | You / device |
| Submissions | essays and written answers, speaking **audio recordings**, transcripts and word timings, AI and human feedback | You |
| Orders & payments | order, product, amount, currency, status, payment method type, provider transaction ID, billing name/email/phone/address and tax ID if you give one. **We never receive your card number, wallet PIN or OTP.** | You / payment provider |
| Support | tickets, messages, attachments, call/chat notes, satisfaction ratings | You |
| Live classes | attendance, chat messages, polls; recordings that may include your voice/video if you enable your mic/camera | You / Zoom |
| Admissions (if used) | applicant profile, college list, activities, documents you upload, recommender contact details you enter, essay drafts | You |
| Device & security | IP address (truncated after 30 days), device and browser type, session records, login events, rate-limit and fraud signals, audit logs of staff access to your data | Automatic |
| Cookies/analytics | only as described in the Cookie Policy | Automatic (consent for non-essential) |
| Guardian data | guardian name, email/phone, consent records | You / Guardian |

We do **not** collect national ID or health data, and we do not use ID-document age checks by default (data minimisation, 09 §13.1). Please do not put them in essays or support messages.

**3. Why we use it and our legal basis**

| Purpose | Data | Basis (GDPR/UK GDPR) | PDPO / BD approach |
|---|---|---|---|
| Provide your account, courses, tests, access control | account, learning, orders | Contract | Consent (terms/privacy acknowledgement) + contract necessity `[LEGAL]` |
| AI evaluation of writing/speaking you request | submissions, transcripts | Contract (you request it) | Specific, separate consent: "AI processing" notice acceptance (`consent_kind=ai_processing`) |
| Human review by graders | redacted submissions | Contract | Same consent |
| Payments, invoices, refunds, tax records | order/payment data | Contract; legal obligation | Legal obligation; retained per schedule |
| Security, fraud, abuse and account-sharing prevention, audit logs | device/security data | Legitimate interests (security, fraud) | `[LEGAL]` L-17: lawful ground for device signals, concurrent-session limits and watermark tracing under PDPO |
| Customer support | support, account | Contract; legitimate interests | Consent/necessity `[LEGAL]` |
| Product analytics (PostHog) | pseudonymous events | **Consent only** | Consent (opt-in); **off for under-18** |
| Marketing email/SMS | contact details | Consent (and soft opt-in not relied on) | Explicit consent, unticked, withdrawable; **never to under-18** |
| Improving AI quality / calibration set | submissions | **Separate optional consent** | Separate optional consent; withdrawable |
| Legal claims, regulators, law-enforcement requests | as needed | Legal obligation / legitimate interests | `[LEGAL]` |
| Safeguarding of minors in live classes | session records, reports | Legal obligation / vital interests / legitimate interests | `[LEGAL]` |

**4. AI processing — what is sent where**
When you request an AI evaluation, we send the text of your answer (after automatic removal of emails, phone numbers and ID-like numbers) or your audio, to our AI providers (large language model for scoring/feedback; speech-to-text for audio). They process it on our instructions under written terms. We configure them not to train their models on your content and to retain it for the shortest period offered **[VERIFY: per-provider zero-retention/opt-out settings must be confirmed and set before launch, 09 §10.3/13.8]**. Providers and countries are listed at `/legal/processors`. AI scores are advisory and "estimated"; they have no legal effect on you and you can ask for human review (AI Scoring Policy) — so no decision with legal or similarly significant effect is made solely by automated means. **[LEGAL]** (L-13: GDPR Art. 22 position and DPIA for AI scoring including minors, GA-048.)

**5. Children and guardians**
- We treat **everyone under 18 as a child** for consent, profiling and marketing purposes (D7; PDPO definition of child `[U]`).
- Under-13: not permitted. 13–17: need Guardian consent verified by a one-time code to the Guardian's verified email/phone; consent text is versioned; we re-verify annually. Until verified, access is limited to free lessons/practice: no paid purchase and no features that record or send **voice** to AI providers. `[DECIDE]` (L-18, GA-047): for **under-16** we propose to disable AI speaking evaluation entirely at launch; for 16–17 allow with verified Guardian consent. Counsel to confirm that sending minors' voice recordings to US speech-to-text vendors is lawful and whether voice here is "biometric/sensitive" (we use it for transcription, not to identify a person) `[LEGAL][U]`.
- No behavioural advertising or profiling of children; no ad pixels in P1; product analytics are **off** for under-18; no marketing messages to under-18.
- Guardians can see only what the child chose to share (progress, receipts) — not essays, audio or notes. A Guardian may request access to, or deletion of, a child's data; we verify the Guardian link first.
- Live classes with minors: see the Live Class Code of Conduct and Safeguarding Policy (recordings of minors kept 30 days, not used in marketing).

**6. Who we share data with (processors and recipients)** — list in §2.3 below; published and kept current at `/legal/processors`. We do not sell personal data. We disclose data to authorities only on valid legal process after legal review (or in an emergency to protect life), and keep a register of requests. **[LEGAL]** (L-19)

**7. International transfers**
Our core database is in **Singapore** (Neon `ap-southeast-1`); other processors are in the EU, UK and US (see list). Some are outside Bangladesh and outside your country. We apply: written data-processing terms; Standard Contractual Clauses / UK IDTA or Addendum / EU–US Data Privacy Framework where the vendor offers them; data minimisation (IDs rather than content wherever possible); and, for Bangladesh, a transfer assessment under the PDPO "equivalent protection" test. **[U][LEGAL]** (L-08: the test is undefined; whether Singapore/US/EU recipients qualify; whether education/e-commerce is a "critical sector" for localisation — per 09 §13.1 the reading is "probably not" but unconfirmed. Risk R-DATA-1: plan for the ability to relocate primary PII to a BD-region host.)

**8. How long we keep data** (aligned to D12 C6/C7 and 09 §13.7; accountant/counsel to confirm `[LEGAL]` L-09)

| Data | Retention |
|---|---|
| Account profile | While your account exists; after you request deletion there is a **14-day grace period** (cancel by signing in), then permanent deletion or anonymisation |
| Sessions / logins | Until expiry or revocation + 30 days; IP truncated after 30 days |
| One-time codes | Deleted on use or expiry (≤ 24 h); codes expire after 5 minutes (email verification links after 60 minutes) |
| Test attempts and scores | Life of your account; anonymised aggregates kept for test-quality analysis |
| Essays (text) | Life of your account, or 24 months after you were last active, whichever first; you can delete any time |
| **Speaking audio** | **90 days** by default (so you can dispute a score), then deleted; kept longer **only** if you give explicit consent (calibration set) or a dispute is open; you can delete earlier. Transcripts follow essays |
| AI provider copies | As short as the provider allows (zero-retention where offered) |
| Orders, invoices, payments, refunds | Up to **10 years** (tax/accounting law `[LEGAL][VERIFY]`; conflict 6–7 vs 10 yrs open, X4), kept in restricted form after account deletion |
| Security and audit logs | 24 months to 7 years depending on type (X5, L-09); actor identity hashed after deletion |
| Support tickets | 24 months |
| Live-class recordings | Course duration + 30 days; recordings containing minors 30 days |
| Consent records | 5 years after last entry; marketing proof 5 years after withdrawal; Guardian consent until the child turns 18 + 3 years |
| Analytics events | 12–13 months |
| Backups | 30 daily / 12 monthly; deleted users are re-purged on any restore |
| Anti-piracy evidence | 3 years |
| Inactive accounts (3+ years, no login, no entitlements) | We notify you, then delete or anonymise |
| Admissions documents | `[DECIDE]` L-20: proposal — delete 12 months after your last activity or on request; sensitive financial documents 90 days after upload unless you extend |

**9. Your rights and how to use them**
You can **access/export**, **correct**, **delete**, **restrict**, **object**, **withdraw consent** (as easily as you gave it), and receive a **portable copy**. Use Settings → Privacy (export, delete, consents, guardians, sessions, AI history, marketing) or write to {{PRIVACY_EMAIL}}. We verify it is you (re-sign-in, or a link to your registered email; no ID documents unless there is real doubt). We **acknowledge within 3 business days and complete within 30 days** `[LEGAL]` L-21: BD statutory period unconfirmed; GDPR/UK GDPR is one month, extendable by two further months for complex requests. Guardians may exercise rights for their child. Some data cannot be deleted while a legal obligation applies (for example invoices) or while a refund/dispute is open. If we refuse, we will tell you why and how to complain.

**10. Security.** Encryption in transit and at rest; role-based access with least privilege; staff access to your data is logged and, for support staff, masked by default; two-factor authentication for staff; regular testing; breach procedure. If a breach is likely to harm you we will tell you without undue delay, and we will notify the authority (NDGA in Bangladesh; EU/UK supervisory authorities where applicable) — our internal target is **72 hours** from awareness `[U]` for the BD deadline.

**11. Cookies.** See the Cookie Policy. Analytics are off until you opt in.

**12. Complaints.** Write to {{PRIVACY_EMAIL}} first. You may complain to the National Data Governance Authority `[VERIFY: authority name, powers and procedure]`, or, if you are in the EU/UK, to your local supervisory authority (for the UK, the ICO).

**13. Changes.** We version this policy and keep earlier versions available. Material changes are notified in advance and, where consent is the basis, re-requested.

**14. Effective date and version.** `{{EFFECTIVE_DATE}}` / `{{VERSION}}`.

### 2.2 Regional addenda (to be appended by counsel if serving at scale)

- **EU/UK/EEA:** lawful-basis table above is the Art. 13/14 information; Art. 27 representative; DPO threshold assessment; right to object to legitimate-interest processing; DPF/SCC references. **[LEGAL]** L-08, only once EU/UK volume is material (09 §13.2).
- **US residents:** state privacy-law notices (California etc.) apply only above thresholds; we do not sell/share personal data for cross-context advertising. **[LEGAL][U]**
- **Gulf/other:** none drafted; counsel to advise if Gulf marketing becomes material (D10 Region A).

### 2.3 Processor / sub-processor list (publish at `/legal/processors`; source of truth `docs/processors.md`, maintained from `09` §13.8)

| Processor | Purpose | Data | Location (verify before publish) | Safeguard |
|---|---|---|---|---|
| Vercel | Hosting/functions, logs | request data, logs | `sin1`/`bom1` regions, US control plane | DPA + SCCs `[VERIFY]` |
| Neon | PostgreSQL database | all app data | Singapore | DPA; encryption at rest; PITR |
| Cloudflare | DNS/WAF/CDN, Turnstile bot check, R2 file storage | IP, requests, stored files | global; R2 jurisdiction `[VERIFY]` | DPA |
| Bunny.net | Video delivery | playback IP, video IDs, token | EU company, global PoPs | DPA |
| Resend (fallback Amazon SES) | Transactional email | email, name, message | US `[VERIFY]` | DPA |
| SMS gateway (SSL Wireless / Alpha SMS / BulkSMSBD — whichever is contracted) | OTP SMS | phone number, code | Bangladesh | contract with confidentiality |
| PostHog (EU cloud) | Product analytics (opt-in only; off under 18) | pseudonymous events | EU | DPA; consent |
| Sentry | Error monitoring | scrubbed technical data | `[VERIFY]` region | DPA; PII scrubbing |
| Anthropic | AI scoring/feedback | redacted essays/transcripts | US | commercial terms/DPA; retention settings `[VERIFY]` |
| Deepgram / OpenAI (fallback) | Speech-to-text | audio, transcript, word timings | US | DPA; zero-retention options `[VERIFY]` |
| Google (OAuth/One Tap) | Sign-in | profile name/email/avatar | global | Google API Services policy |
| SSLCommerz | BD payments | name, email, phone, amount, tran ID | Bangladesh | licensed payment service `[VERIFY]` |
| Paddle (or Stripe) | International payments (merchant of record) | billing data | UK/US `[VERIFY]` | independent controller for payment data `[LEGAL]` |
| Inngest | Background jobs | job payloads (IDs, minimal) | US | DPA |
| Upstash | Rate limiting | hashed keys/IPs | Singapore | DPA |
| Zoom | Live classes (incl. minors) | name, attendance, audio/video if enabled | US/global `[VERIFY]` | DPA; waiting room; recording controls (18 §5.8) |
| Helpdesk (**Chatwoot Cloud**, D12 C29; self-hosted only if the founder reverses the choice — see 27 §2) | Support conversations | name, contact, messages, attachments | `[VERIFY]` | DPA or self-hosted (then not a third party) |
| WhatsApp Business / Meta Messenger | Support intake channels | phone number, messages | Meta global | Meta business terms `[LEGAL]` L-22: Meta acts for its own purposes |
| Better Stack (status page) / Axiom (logs) — if adopted (D3 optional) | Uptime/status, log drain | minimal technical data | `[VERIFY]` | DPA |
| GitHub / CI | Source & CI | code only (no production data) | US | secrets policy |

Rule: each new processor needs a signed DPA, a transfer note, a minimisation review and an entry here **before first production use** (09 §13.8).

### 2.4 Bangla summary (সংক্ষিপ্ত সারাংশ)

> *Draft; requires legal-translator review. English prevails unless counsel decides otherwise.*

**গোপনীয়তা নীতির মূল কথা**
- **কী তথ্য নিই:** আপনার নাম, ইমেইল/ফোন, শেখার অগ্রগতি, মক টেস্টের উত্তর, লেখা (এসে) ও কথা বলার অডিও, অর্ডার ও পেমেন্টের তথ্য (আমরা কার্ড নম্বর বা বিকাশ/নগদ পিন কখনো পাই না), সাপোর্টের বার্তা এবং নিরাপত্তার জন্য ডিভাইস/আইপি তথ্য।
- **কেন নিই:** কোর্স ও মক টেস্ট দিতে, AI মূল্যায়ন করতে, পেমেন্ট ও আইনি রেকর্ডের জন্য, নিরাপত্তা ও জালিয়াতি ঠেকাতে। অ্যানালিটিক্স ও মার্কেটিং শুধু আপনার সম্মতি থাকলে—এবং ১৮ বছরের কম বয়সীদের জন্য কখনোই নয়।
- **AI-তে কী যায়:** আপনার লেখা (ইমেইল/ফোন নম্বর সরিয়ে) বা অডিও আমাদের AI ও স্পিচ-টু-টেক্সট সেবাদাতার কাছে যায়, যাদের অনেকে বাংলাদেশের বাইরে (যেমন যুক্তরাষ্ট্রে)। সেবাদাতাদের তালিকা `/legal/processors`-এ প্রকাশিত। AI স্কোর শুধু পরামর্শমূলক ও “আনুমানিক”; চাইলে মানব পর্যালোচনা পাবেন।
- **কতদিন রাখি:** কথা বলার অডিও সাধারণভাবে **৯০ দিন** (আপনার স্পষ্ট সম্মতি বা চলমান বিরোধ ছাড়া), অ্যাকাউন্ট মুছে ফেলার অনুরোধের পর **১৪ দিন** অপেক্ষার সময়, তারপর স্থায়ী মুছে ফেলা। কর/হিসাবের নথি আইন অনুযায়ী বেশি সময় (সর্বোচ্চ ১০ বছর, যাচাই সাপেক্ষে) সীমিতভাবে সংরক্ষিত হয়।
- **শিশু ও অভিভাবক:** ১৮ বছরের নিচে সবাইকে আমরা শিশু হিসেবে গণ্য করি। ১৩–১৭ বছর বয়সীদের জন্য অভিভাবকের যাচাইকৃত সম্মতি লাগে। ১৩ বছরের নিচে অ্যাকাউন্ট নয়। অভিভাবক শুধু সেটুকুই দেখেন যা শিক্ষার্থী শেয়ার করেছে (অগ্রগতি, রসিদ)—এসে বা অডিও নয়।
- **আপনার অধিকার:** তথ্য দেখা/ডাউনলোড, সংশোধন, মুছে ফেলা, সম্মতি প্রত্যাহার ইত্যাদি—সেটিংস → প্রাইভেসি থেকে বা {{PRIVACY_EMAIL}}-এ লিখে। আমরা ৩ কার্যদিবসের মধ্যে প্রাপ্তিস্বীকার করি এবং সাধারণত ৩০ দিনের মধ্যে সম্পন্ন করি।
- **অভিযোগ:** প্রথমে {{PRIVACY_EMAIL}}; এরপর প্রযোজ্য কর্তৃপক্ষ (বাংলাদেশে জাতীয় ডেটা গভর্ন্যান্স কর্তৃপক্ষ—যাচাই সাপেক্ষে)।

---

## 3. Cookie Policy

> **DRAFT — requires review by a Bangladesh-qualified lawyer before publication.** Document id `cookies`. Implements `09` §13.4 and closes the cookie-inventory part of GA-019. **Names below are the *intended* names; the implementation PR must regenerate this table from the real build (CI check proposed in §19.5).**

### 3.1 Draft text

**What these are.** Cookies and similar storage (localStorage, IndexedDB) on your device. We use **strictly necessary** items always, and **analytics** items only if you opt in. We do not use advertising or cross-site tracking cookies in P1.

**Your choices.** On first visit you see a banner with equal-prominence **Accept** and **Reject** buttons and granular toggles (nothing is pre-ticked). You can change your choice any time via "Cookie settings" in the footer. Your choice is remembered for 12 months. **Under-18 accounts never have analytics enabled.** Rejecting analytics does not affect your use of the Service.

**Regional behaviour:** one global banner design; for users whose billing country/IP is in the EU/UK the banner is shown with the same defaults. For BD users we apply the same opt-in default (strictest reading of PDPO consent). **[LEGAL]** (L-23: whether a banner is legally required for BD-only strictly-necessary storage; GDPR/ePrivacy exemptions for strictly necessary.)

### 3.2 Inventory

| Name (intended) | Type | Category | Purpose | Duration | Party |
|---|---|---|---|---|---|
| `__Secure-lumen.session` (Better Auth session; exact name set by config) | cookie, HttpOnly, Secure, SameSite=Lax | Strictly necessary | Keep you signed in | 30 days idle / 90 days absolute (students); 12 h (staff) | First |
| `__Host-lumen.csrf` / OAuth state | cookie | Strictly necessary | Request-forgery protection, sign-in flow state | Session / minutes | First |
| `lumen-device` (deviceId) | cookie | Strictly necessary | New-device login notice, session security, rate limiting | up to 12 months `[DECIDE]` | First |
| `lumen-consent` | cookie | Strictly necessary | Stores your cookie choice (versioned) | 12 months | First |
| `NEXT_LOCALE` | cookie | Strictly necessary / functional preference | Remembers language (English/Bangla) | 12 months | First |
| Theme / font-size / reduce-motion / data-saver | localStorage | Functional preference you requested | Display preferences | until cleared | First |
| `lumen-exam` (IndexedDB) | IndexedDB | Strictly necessary | Exam answer queue so answers survive a connection drop (D6) | until synced + short TTL | First |
| Cloudflare Turnstile | script/challenge storage | Strictly necessary (security) | Bot check on sign-up, OTP, checkout, contact | session | Cloudflare `[VERIFY]` cookies/storage used |
| `__cf_bm` or similar | cookie | Strictly necessary (security) | Bot management, if enabled on plan | 30 min | Cloudflare `[VERIFY]` |
| Paddle checkout (overlay/inline) | cookies / storage | Strictly necessary for payment | Complete international payment, fraud prevention | per Paddle | Paddle `[VERIFY]` |
| SSLCommerz hosted page | cookies | Strictly necessary for payment | Complete BD payment (on provider's domain) | per provider | SSLCommerz |
| Zoom embeds/join links | cookies | On Zoom's domain | Live class | per Zoom | Zoom |
| `ph_<project>_posthog` | cookie / localStorage | **Analytics (opt-in)** | Product analytics, funnels, feature flags for logged-in users; `persistence: memory` before consent; session replay off | up to 12 months | PostHog (EU) |
| Sentry | none stored by default (`sendDefaultPii:false`, replay off) | Necessary (security/monitoring, legitimate interest) | Error diagnostics | — | Sentry |
| Anonymous experiment bucket (cookieless hash) | none (server-side hash) | Necessary (service operation) | Stable feature-flag bucketing for logged-out users (GA-033) | — | First |

### 3.3 Short Bangla notice (কুকি নীতি—সংক্ষেপে)

আমরা সব সময় শুধু প্রয়োজনীয় কুকি (লগইন, নিরাপত্তা, ভাষা, পরীক্ষার উত্তর সংরক্ষণ) ব্যবহার করি। **অ্যানালিটিক্স কুকি** আপনি “গ্রহণ করুন” চাপলেই কেবল চালু হয়; ১৮ বছরের কম বয়সীদের জন্য তা কখনোই চালু হয় না। আপনি যেকোনো সময় ফুটারের “কুকি সেটিংস” থেকে পছন্দ বদলাতে পারেন। কোনো বিজ্ঞাপন বা ক্রস-সাইট ট্র্যাকিং কুকি আমরা ব্যবহার করি না।

---

## 4. Refund & Cancellation Policy (incl. Progress Promise Terms)

> **DRAFT — requires review by a Bangladesh-qualified lawyer before publication.** Document id `refund`. Binding inputs: **D5** ("7 days if < 20% consumed, no refunds on consumed AI credits"), **D12** C13 (Progress Promise), C14 (reference price), GA-007 (exam disruption credit), `10` §7.5 (entitlement effects), `03` F-PAY-09 (UI pre-check; refund to original method, "7–14 working days" note), `05` rule R14. **`17-PRICING-MASTER.md` does not exist yet (X8)**; allowance numbers are placeholders `{{17:…}}`. Refunds are the top dispute generator in BD ed-tech (GA-021), so this text is deliberately explicit.

### 4.1 Part A — General rules (draft text)

**A1. The core rule.** You may request a refund within **7 days of purchase** if you have consumed **less than 20%** of the product. "Consumed" is measured as shown in the table in A3. AI credits already used are never refunded (D5).
**A2. How to request.** Orders → select order → "Request refund" (reason required). The system checks eligibility automatically; eligible requests go to our Finance team for confirmation; if the system says "not eligible" you can still choose "Ask Support" and a person will review exceptional cases (for example our technical fault). We **decide within 3 business days** `[DECIDE]` and pay to the **original payment method**. Typical time to reach your account after approval: **7–14 working days** for bKash/Nagad/Rocket/cards in Bangladesh `[VERIFY: provider timings are unconfirmed in 10 §7.5/F-PAY-09; SSLCommerz refunds are partly manual]`; international card refunds follow {{PAYMENT_MOR}}'s timings `[VERIFY]`. You can follow the refund status on the Orders page.
**A3. What counts by product type** (service function `refundEligibility()` implements R14; changes require counsel sign-off):

| Product (`05` product kind) | Refundable when | "Consumed" measured as | Refund amount | Effect |
|---|---|---|---|---|
| **Course / Core / Plus** (`course`, `bundle` children) | ≤ 7 days from payment **and** < 20% | `course_progress.progress_pct` (lessons completed) | Full price paid (less any AI credits or human reviews already used, valued at their pack unit price) `[DECIDE]` | Course access ends; **certificate revoked** if issued; Q&A/notes retained per policy |
| **Bundle** | Per included item (each child measured separately); partial refund prorated | as child | Sum of eligible children; goodwill partial ≤ 10% keeps access (10 §7.5) | Only chosen children revoked |
| **Test pack** (`test_pack`, N mocks) | ≤ 7 days **and** < 20% of mocks *started in exam mode* | `entitlement_use` / `uses_total` | Full price | Remaining mocks revoked. A mock **voided and re-issued for a connection failure (D12 GA-007/C30: self-serve once per attempt, otherwise support/admin only, always audited) does not count as used** |
| **AI credits pack** (`ai_credits`) | ≤ 7 days **and** < 20% consumed | credits consumed / credits in pack | **Unused portion only**: price × remaining ÷ total (10 §7.5). Used credits and free/bonus credits (2 on sign-up, 1/month, D12 C1) have **no cash value** and are never refunded | Remaining credits revoked |
| **Pass** (`pass` 1/3/6/12 months) | ≤ 7 days **and** < 20% of the period's usage allowance consumed | `[DECIDE] L-26`: share of (mocks started + AI credits used + human reviews used) vs. period allowance `{{17:allowance}}`; lesson progress not used | Full price less value of AI credits consumed | Pass ends. **BD passes never auto-renew** (D5) |
| **International subscription renewal** (auto-renew, Paddle) | Cancel any time (stops the *next* renewal). A renewal charge is refundable within 7 days of the charge if the pass has not been used since renewal `[DECIDE]` | usage since renewal | Full renewal amount | End of period access ends unless refunded |
| **Live batch** (`live_batch`, P1 manual Zoom pilot / P2) | (a) **Before the batch starts:** up to 24 h before the first class: full refund; (b) **After start:** ≤ 7 days from payment **and** < 20% of scheduled classes have been held; (c) **We cancel or reschedule by more than 14 days:** full refund or free transfer to the next batch | sessions held ÷ sessions scheduled (e.g., first 4 of 24) | Full price (a, c) / full price less 0 for (b) `[DECIDE]` | Seat released; recordings access ends; one **free transfer to the next batch** per purchase is offered instead of a refund where available |
| **Live batch / Mentor with instalments** | As above; **remaining instalments are cancelled** upon an approved refund; amounts already paid are refunded under the same rule | as above | amounts actually paid | If you stop paying an instalment and no refund applies, A8 applies |
| **Mentor tier (1:1)** | As Live batch **plus** 1:1 sessions: a 1:1 session already held counts as consumed (each session = its price share) `[DECIDE]`; cancel/reschedule ≥ 24 h before a session without loss | sessions held + class share | Full price less the value of 1:1 sessions held | Seat/mentor released. The **Progress Promise is not a refund right** (Part C) |
| **Human review pack / single speaking mock / extra human reviews** (add-ons, D10) | Unused, ≤ 7 days | reviews used | Unused portion only | If we miss the promised review time by more than 24 h, you may choose a **credit or a refund** of that review (07 SLA: standard 48 h, priority 24 h) |
| **Plus tier "2 human essay reviews"** | Part of the Plus price; unused reviews **lapse** with the access period and are not separately refundable | — | — | — |
| **Printed book bundles** (physical, D10 add-on) | **Damaged, defective or wrong item:** report within 7 days of delivery with photo → replacement or refund; **change of mind:** `[DECIDE]` L-27 (proposal: unopened, return within 7 days at buyer's cost) | — | Item price (+ delivery if our error) | **[LEGAL][VERIFY]** physical-goods return duties under BD consumer/e-commerce rules and logistics partner terms |
| **Watermarked PDFs / downloadable materials** | Treated as part of the product they belong to; standalone downloads are non-refundable **after download** (digital content already delivered) — except where law gives a right | download event | — | **[LEGAL]** L-03 |
| **Admissions services** (21; P2a) | Session packs: cancel/reschedule ≥ 24 h before a session for a full credit; held sessions not refundable. Essay/SOP/CV reviews: refundable only before the reviewer starts; delivered reviews not refundable. Plan pass: as Pass | sessions/reviews used | unused portion | Never refundable for "admission not obtained" |
| **Org seat packs (B2B)** | Per contract | seats activated | per contract | `{{B2B refund clause}}` (GA-030) |
| **Scholarship / partner-code purchases** | Same rules on the amount actually paid; scholarship value is not cash | — | amount paid | — |

**A4. Always refunded (no 7-day/20% test):** (i) **duplicate payment** (second payment refunded in full, access unaffected); (ii) **payment taken but access not granted** and we cannot grant it within 3 business days; (iii) **a purchase for a minor made without valid Guardian consent** `[LEGAL]` L-04; (iv) product withdrawn or materially not as described by us; (v) a **held-for-review** order we reject; (vi) where law gives you a right that cannot be excluded.
**A5. Technical problems in a mock.** A section interrupted by connection loss for more than 2 minutes in exam mode may be voided and re-issued **once per attempt** via "I lost connection"; otherwise Support may grant a replacement mock credit. We do not refund a pack because of one disrupted attempt, but we do not charge a mock for it (D12 GA-007).
**A6. Not refundable:** consumed AI credits; free or bonus credits; services fully delivered (a held class, a delivered review); content obtained through a breach of the Acceptable Use Policy; purchases after account termination for fraud or serious breach; any amount paid for a product **while an enforcement action is open for sharing/leaking that product** `[LEGAL]` L-11.
**A7. Reference prices and promotions.** Refund is of the amount you actually paid, not any "reference" price (reference prices are shown only if genuinely charged, D12 C14). Coupon value is not cash.
**A8. Failed instalments.** See Terms 4.5 (7-day grace; then access paused; unpaid balance remains due unless refunded). **[LEGAL]** L-07.
**A9. Statutory rights.** *EU/UK:* where you have a statutory right to cancel a distance contract within 14 days, this policy does not remove it; for digital content/services we will ask at checkout for your **express consent to start immediately and acknowledgement that you lose the right to cancel once performance has begun** (or, for services, a proportionate payment) — wording and capture belong to {{PAYMENT_MOR}}'s checkout and our pre-checkout page. **[LEGAL][VERIFY]** L-03. *Bangladesh:* Consumer Rights Protection Act 2009 and Digital Commerce Management/Operation Guidelines 2021 may require published return/refund terms and delivery of what was ordered — **[VERIFY][U]**.
**A10. Chargebacks and disputes.** Please contact us first; refund requests are resolved faster than bank disputes. Filing a chargeback instead of using this process while an eligible refund is pending may lead to account review; if a dispute is lost, access linked to that payment is revoked; if later won, it is reinstated (10 §7.5). BD wallet payments do not have chargebacks; disputes go through Support.
**A11. Refund effect on account.** Access ends as in A3; AI credit ledger entries are reversed for unused credits; invoices receive a **credit note** (10 §7.4). Tax is refunded together with the price; how already-remitted VAT is recovered is for the accountant `[VERIFY]`.
**A12. Currency.** Refunds are in the currency paid; we are not responsible for exchange-rate differences or bank/wallet fees charged to you by third parties. **[LEGAL]**

### 4.2 Part B — Cancellation of access and subscriptions (draft text)
- Cancelling a **BD prepaid pass** has no effect on current paid access (no auto-renew exists).
- Cancelling an **international subscription** stops future renewals; access continues to period end.
- Cancelling a **live batch seat** follows A3. Cancelling a **1:1 session**: ≥ 24 h before = free reschedule; late cancellation or no-show = session counted as held `[DECIDE]`.
- Account deletion does not cancel a subscription automatically: you must cancel first (the deletion flow blocks while an active subscription/unpaid dispute exists, 05 §7.4).

### 4.3 Part C — Progress Promise Terms (Mentor tier only; D12 C13)

> **Highest-liability text in the product (GA-014).** Counsel + accountant must approve before the Mentor tier is sold. Not offered on Free, Core, Plus or Live. Modelled as `guarantee_claim` (sketch in `27` §19). **[LEGAL]** L-12: advertising-law treatment of a "promise", whether it is an insurance-like product, consumer-law "unfair contract term" risk, and revenue/provision accounting (deferred revenue, GA-014).

**C1. What it is.** If you complete the Mentor programme and meet **all** conditions below and your official test result is below the target recorded at enrolment, we will **re-enrol you free of charge** in the next available Mentor (or closest equivalent) programme for **one additional cycle**. **It is not a refund, a cash guarantee, or a promise that you will reach any score.**
**C2. Conditions (all required)** (D12):
1. **Attendance ≥ 80%** of scheduled live sessions (excused catch-up credit counts as defined in the Live Class rules);
2. **All homework** submitted by the stated deadlines;
3. **At least 4 full mock tests** completed in exam mode;
4. **Official test taken within 60 days after the end of your programme** (the "**Promise Window**");
5. **Official score report uploaded** (test report form / ETS score report) showing your name, test date and scores, through the claim form within **30 days** after you receive it `[DECIDE]` L-12;
6. Your **target** was recorded at enrolment (target overall and any per-skill minimum) after a diagnostic and is within the range we confirm is realistic for the programme `[DECIDE]`: e.g., targets more than {{N}} bands above the diagnostic band are outside the Promise;
7. You complied with the Terms and Acceptable Use Policy (no account sharing, no cheating, no leak publishing); and your payment is in full.
**C3. Verification.** We may ask to verify your official result with the issuing body where a verification service exists; you consent to that. We rely on the document and your declaration; false or altered documents void the Promise, may lead to termination without refund, and may be reported. **[LEGAL][VERIFY]** L-12: whether we can lawfully verify; document retention (`trf_r2_key`) and privacy basis.
**C4. Limits.** One claim per paid Mentor enrolment; non-transferable; no cash value; re-enrolment must be taken within 6 months `[DECIDE]`; the re-enrolment does not carry a second Promise; if the target is **met in any skill-weighted way defined at enrolment**, no claim; only the **first** official test within the Promise Window counts.
**C5. Process and decision time.** Claim via Account → Orders → Progress Promise. We decide within 10 business days `[DECIDE]`; you may appeal once to a different reviewer; decisions and reasons are recorded.
**C6. Liability.** Our liability under the Promise is limited to the re-enrolment described. **[LEGAL]**
**C7. Marketing rule.** The Promise may be described only with its key conditions next to the claim ("terms apply"), never as "guaranteed score". Copy-lint blocks "guaranteed band/score/admission" (21 §5.1). **[LEGAL]** L-12.

### 4.4 Bangla summary (সংক্ষিপ্ত সারাংশ)

> *Draft; legal-translator review required.*

**রিফান্ড ও বাতিল নীতি — মূল কথা**
- **সাধারণ নিয়ম:** কেনার **৭ দিনের মধ্যে** এবং পণ্যের **২০%-এর কম** ব্যবহার করলে রিফান্ডের আবেদন করা যাবে। ব্যবহৃত AI ক্রেডিট ফেরত হয় না; ফ্রি/বোনাস ক্রেডিটের কোনো নগদ মূল্য নেই।
- **কীভাবে আবেদন:** অর্ডার পেজ → “রিফান্ডের আবেদন”। আমরা ৩ কার্যদিবসের মধ্যে সিদ্ধান্ত জানাই। অনুমোদনের পর টাকা মূল পেমেন্ট মাধ্যমে ফেরত যায়—সাধারণত ৭–১৪ কার্যদিবস লাগে (যাচাই সাপেক্ষে)।
- **সবসময় ফেরত:** একই পেমেন্ট দুইবার হলে; টাকা কাটা গেছে কিন্তু অ্যাক্সেস পাননি এবং আমরা ঠিক করতে পারিনি; অভিভাবকের সম্মতি ছাড়া নাবালকের কেনাকাটা; আমাদের ভুলে পণ্য যেমন বলা হয়েছিল তেমন না হলে।
- **লাইভ ব্যাচ:** ব্যাচ শুরুর ২৪ ঘণ্টা আগে পর্যন্ত পূর্ণ ফেরত; শুরুর পর ৭ দিনের মধ্যে ও ২০%-এর কম ক্লাস হয়ে থাকলে ফেরত; আমরা ব্যাচ বাতিল করলে পূর্ণ ফেরত বা বিনামূল্যে পরের ব্যাচে স্থানান্তর। কিস্তি চলমান থাকলে অনুমোদিত রিফান্ডে বাকি কিস্তি বাতিল হয়।
- **মক টেস্টে নেট সমস্যা:** এক্সাম মোডে ২ মিনিটের বেশি সংযোগ বিচ্ছিন্ন থাকলে সেকশনটি বাতিল করে প্রতি অ্যাটেম্পটে একবার নতুন করে দেওয়া হতে পারে; অন্যথায় সাপোর্ট একটি বিকল্প ক্রেডিট দিতে পারে।
- **প্রোগ্রেস প্রমিজ (শুধু মেন্টর):** নগদ ফেরত নয়। ≥৮০% উপস্থিতি, সব হোমওয়ার্ক, অন্তত ৪টি ফুল মক, প্রোগ্রাম শেষের ৬০ দিনের মধ্যে অফিসিয়াল পরীক্ষা, এবং অফিসিয়াল স্কোর রিপোর্ট আপলোড করলে—লক্ষ্য পূরণ না হলে এক চক্রের জন্য বিনামূল্যে পুনরায় ভর্তি। শর্ত প্রযোজ্য; স্কোরের নিশ্চয়তা নয়।
- **ছাপানো বই:** ক্ষতিগ্রস্ত/ভুল বই পেলে ৭ দিনের মধ্যে ছবিসহ জানান—বদল বা রিফান্ড।

---

## 5. AI Scoring Disclaimer & Methodology Statement

> **DRAFT — requires review by a Bangladesh-qualified lawyer before publication.** Document id `ai-scoring`. Route `/legal/ai-scoring-policy`. Operational detail: `07` §7.7–7.11, `09` §10. **Publication gate:** the accuracy section stays unpublished (placeholder) until the gold-set programme (GA-006) and statistical review pass; false or aspirational accuracy statements are a consumer-protection risk. **[LEGAL]** L-13.

### 5.1 Draft text

**1. What our scores are.** {{BRAND}} shows **estimated** scores for practice (for example "Estimated 6.5, likely 6.0–7.0"). They are **not official results** and are not produced, endorsed or approved by ETS, Cambridge, the British Council, IDP, Pearson or any exam owner. Every score screen, PDF and email carries: "*Estimated score from a practice test. Not an official result.*" (D6; 07 §9.5)
**2. How an estimate is made.**
- *Reading, Listening, GRE Verbal/Quant:* **automatic scoring** against answer keys and a conversion table that we publish with its version (raw → estimated band/scaled score). Conversion tables are our own approximation for practice, not official tables; official scales vary between test versions. **[LEGAL][VERIFY]** L-16 (do not reproduce official conversion tables)
- *Writing, GRE Analytical Writing, Speaking:* an **AI model** assesses your response against criteria based on **publicly available descriptors** of the relevant test, produces criterion scores, an overall estimate, a range and a confidence level (High/Medium/Low). For Speaking, speech is first transcribed by a speech-to-text system; pronunciation and fluency features are **approximations** from the transcript and timing and may be affected by accent, audio quality, microphone and background noise.
- Several independent passes may be used; if they disagree materially, or the response is off-topic, too short, unusual, or triggers a safety check, the result is marked **Low confidence** and routed for **human review**.
- Prompt-injection and "gaming" attempts (for example instructions hidden in an essay) are detected and may lead to a flagged or capped result.
**3. Limits you should know.** Estimates can be wrong, can be higher or lower than an official examiner, and may differ by **one band or more**. Short, off-topic, memorised or heavily AI-generated responses are scored less reliably. Bangla-influenced English, regional accents and handwriting-like formats are not special-cased. Do not use our estimates for visa, immigration, employment or admission decisions; book the official test for that.
**4. Human review.** You can **request human review** of an AI result from the result page. A trained grader sees your response (redacted of contact details), the AI result and the rubric, and may **override the band** with a written reason; you will see "Reviewed by a {{BRAND}} examiner-trained grader" and the final band. Review times: standard **within 48 hours**, priority **24 hours** (where purchased). You can use human review credits you hold; **one dispute review per calendar month is free** if you believe a score is unfair `[DECIDE]` L-14, X7. Extra disputes cost a human-review credit, which is **returned if the human band differs from the AI band by 1.0 or more** `[DECIDE]`. The human decision is final for the score displayed; you can still complain via Support. Score-dispute steps are in the Help Centre.
**5. Effect of a re-score.** If a human review or a content/answer-key correction changes a score, your dashboard, estimates, study plan and history update; certificates of course completion do not depend on estimated scores. If a correction affects many learners we will tell those affected.
**6. Model changes.** AI models and prompts change. Each result is tagged with a scoring-version label; a later version may give a different estimate for the same text. We re-evaluate on request only through human review. We monitor quality continuously.
**7. Accuracy statement (placeholder — do not publish until gate passes).** "*In our latest calibration (date {{D}}, {{N}} human-scored responses per task, rated independently by two certified raters with adjudication; at least 40% from Bangladeshi learners), AI estimates agreed with the human consensus within ±0.5 band for {{X}}% of {{task}} responses (quadratic weighted kappa {{Q}}). We update these figures {{quarterly}} at /legal/ai-scoring-policy#accuracy.*" Source: `07` §7.9 targets (≥ 200, target 400 responses per task; QWK ≥ 0.80 among raters). **[DECIDE][LEGAL]** L-13.
**8. Your data in scoring.** See the Privacy Policy: redacted text/audio goes to named AI and speech providers under no-training/short-retention settings; speaking audio is deleted after 90 days unless you consent otherwise or a dispute is open. We use your submissions to improve scoring **only if you opt in**.
**9. Automated decisions.** Scores are advisory and have no legal or similarly significant effect on you; you can always obtain human review (GDPR Art. 22-type safeguard). **[LEGAL]**
**10. Minors.** Speaking evaluation is not available to users under the age set in the Privacy Policy and requires verified Guardian consent for others.
**11. Contact.** {{SUPPORT_EMAIL}} or the Report/Dispute button.

### 5.2 Bangla summary (সংক্ষিপ্ত সারাংশ)

**AI স্কোর সম্পর্কে জানুন**
- আমাদের স্কোর ও ব্যান্ড **আনুমানিক**, অফিসিয়াল ফল নয়; ETS, Cambridge, British Council, IDP বা অন্য কোনো পরীক্ষা-কর্তৃপক্ষ এগুলো অনুমোদন করেনি।
- Reading/Listening স্বয়ংক্রিয়ভাবে উত্তরমালার সঙ্গে মিলিয়ে হিসাব হয়। Writing/Speaking-এ AI সর্বজনীনভাবে প্রকাশিত মানদণ্ড অনুসারে স্কোরের একটি **পরিসর ও আত্মবিশ্বাসের মাত্রা** দেয়। কখনও কখনও ফলাফল ১ ব্যান্ড বা তারও বেশি ভিন্ন হতে পারে।
- স্কোর ঠিক মনে না হলে **মানব পর্যালোচনা** চাইতে পারেন: প্রশিক্ষিত গ্রেডার সংখ্যা বদলাতে পারেন (কারণসহ)। স্ট্যান্ডার্ড ৪৮ ঘণ্টা, প্রায়োরিটি ২৪ ঘণ্টা। প্রতি মাসে একবার বিরোধ-পর্যালোচনা বিনামূল্যে (সিদ্ধান্ত সাপেক্ষে)।
- ভিসা, চাকরি বা ভর্তির সিদ্ধান্তে এই আনুমানিক স্কোরের ওপর নির্ভর করবেন না।
- আপনার লেখা/অডিও কীভাবে AI সেবাদাতার কাছে যায় এবং কতদিন থাকে তা গোপনীয়তা নীতিতে আছে; কথা বলার অডিও ৯০ দিন পর মুছে যায় (আপনার সম্মতি বা চলমান বিরোধ ছাড়া)।

---

## 6. Academic Integrity & Acceptable Use Policy

> **DRAFT — requires review by a Bangladesh-qualified lawyer before publication.** Document id `acceptable-use`. Consent (honour code) is recorded before each exam-mode attempt on `attempt_session` (GA-051) and at sign-up (`terms`). The enforcement **ladder and appeals** are operated per `27` §11. **[LEGAL]** L-17: device/session fingerprinting and watermark tracing need a PDPO/GDPR legitimate-interest assessment (GA-026).

### 6.1 Draft text

**Why this exists.** Mock tests and courses are only useful, and our content is only affordable, if everyone plays fair. Our mocks are practice tools, **not proctored exams**; integrity here is an honour code.

**A. Academic integrity (learners)**
1. Do your own work. Do not get another person or an AI tool to take a mock or write a Writing/Speaking answer that you submit as your own for scoring. (Using AI to *learn* — for example asking for explanations — is fine; submitting AI-written essays for score estimation defeats the purpose and is treated as misuse.)
2. **No answer or question sharing:** do not post, sell, screenshot, transcribe or distribute questions, passages, audio, answer keys, explanations, rubrics, or our mock tests anywhere (Telegram, Facebook, WhatsApp, Discord, forums, file hosts).
3. **No unauthorised help in an exam-mode attempt** (other people, other devices, notes, translation tools) — the same standard you will face in the official test.
4. Integrity notes (focus loss, connection gaps) are shown to you and to staff as information; they do not by themselves lead to a penalty. Unusual patterns that suggest leaked answer keys (for example very fast completion with high accuracy) may be reviewed by an editor.
5. **Admissions work (21):** your essays, statements and CV content must be your own; reviewers and AI give **feedback only**. You confirm authorship per essay. Asking us to write or "polish into finished text" is not permitted and our tools will refuse.
**B. Accounts**
6. **No account sharing.** One person per account. We allow a limited number of active sessions/devices (currently 2 concurrent video sessions: 1 desktop + 1 mobile; subject to change). No reselling, renting, gifting of logins; Guardian access is through the Guardian link, not shared passwords.
7. Do not create multiple accounts to obtain free credits, free trials, coupons or referral rewards; no self-referral.
8. Keep credentials safe; do not use another person's account.
**C. Platform and content**
9. **No scraping or bulk download**, bots, automated harvesting, reverse engineering, or circumventing watermarks, token links, rate limits, device limits or access controls. Do not strip or hide the visible watermark.
10. **No screen-recording or re-streaming** of videos and live classes, and no recording of live classes by learners.
11. **AI misuse:** no prompt-injection, attempts to alter scores by hidden instructions, or generating large volumes of requests to test or exploit the system.
12. **Security:** no probing or attacking the Service outside our Responsible Disclosure Policy.
13. **Payments:** no use of stolen payment methods, card testing, false refund claims, deliberate chargeback abuse, or coupon abuse.
14. **Reviews and community:** no fake reviews, incentivised-positive-only reviews, review swaps, or posting on behalf of instructors/staff without disclosure.
15. **Conduct:** no harassment, hate, threats, sexual content, doxxing, impersonation, or content that endangers children; no unlawful content; no spam.
**D. Enforcement.** Depending on severity, intent and history we may: remove content; send a warning; limit sessions/features/AI credits; temporarily suspend; revoke entitlements; terminate the account; withhold refunds for serious breaches; and report unlawful conduct. Typical steps are **warning → limit → suspension → termination**, but serious breaches (publishing paid content at scale, fraud, safeguarding harms) can skip steps. You will be told the reason and how to appeal; appeal within 30 days to {{SUPPORT_EMAIL}} and a person not involved will review.
**E. Exam-shell conduct.** In `/exam/…`: stay in the exam window; do not run two attempts at once; do not use browser extensions to read or copy exam text; report technical problems through "I lost connection"/"Technical problem" rather than re-starting repeatedly; do not attempt to manipulate timers or the network (server time is authoritative).
**F. Reporting.** Report suspected leaks, account sharing or unsafe behaviour using the Report button or {{SUPPORT_EMAIL}}.

### 6.2 Bangla summary (সংক্ষেপে)
নিজের কাজ নিজে করুন। প্রশ্ন, উত্তর, মক টেস্ট বা ভিডিও টেলিগ্রাম/ফেসবুক/হোয়াটসঅ্যাপে শেয়ার বা বিক্রি করা যাবে না। অ্যাকাউন্ট শেয়ার, একাধিক অ্যাকাউন্টে ফ্রি ক্রেডিট নেওয়া, স্ক্র্যাপিং, স্ক্রিন রেকর্ডিং, ওয়াটারমার্ক সরানো—সবই নিষিদ্ধ। এসে/স্পিকিং-এ অন্যকে বা AI-কে দিয়ে লিখিয়ে নিজের নামে জমা দেবেন না। নিয়ম ভাঙলে সতর্কতা → সীমাবদ্ধতা → স্থগিত → অ্যাকাউন্ট বন্ধ; আপনি ৩০ দিনের মধ্যে আপিল করতে পারবেন।

---

## 7. Content & Trademark Notice

> **DRAFT — requires review by a Bangladesh-qualified lawyer before publication.** Document id `trademark-notice`. Source of truth for exact notice strings: **D12 C31 in `00-DECISIONS.md`**, stored as `exam.disclaimer_key` (i18n `en`+`bn`) per `07` §9.5; the strings below are copied verbatim and must not be reworded. The footer notice must appear on **every page**, on the exam start screen, results/score-report page, PDF exports and score emails; ETS invites review of footer, start-screen and score-report layouts before launch (trademarks@ets.org, ~10 business days) — submit them (L-16).

### 7.1 Required notices (exact English text)

| Exam | Notice | Status |
|---|---|---|
| GRE / TOEFL | `GRE® and TOEFL® are registered trademarks of ETS. This product is not endorsed or approved by ETS.` (D12 C31, verbatim; use the ® at first and most prominent use; show the TOEFL half only on TOEFL pages once TOEFL ships) | Canonical per D12 C31; ETS layout review still pending (BG-09) |
| IELTS | `IELTS is a registered trademark of the University of Cambridge, the British Council and IDP Education Australia. This site and its products are not approved or endorsed by them.` (D12 C31, verbatim; counsel to verify wording) | Canonical per D12 C31 (resolves conflict X11); **[VERIFY]** with counsel and the owners' brand guidance (BG-09) |
| Score labels | `Estimated score from a practice test. Not an official result.` | internal, D6 |
| PTE / DET / Common App | `[Mark] is a trademark of its owner; we are not affiliated with or endorsed by it.` (D12 C31, verbatim, with the mark substituted) | Canonical per D12 C31; add owner-specific wording only if counsel requires |
| Common App (admissions, 21) | Uses the PTE/DET/Common App notice above (D12 C31); the longer "not an integration of the Common Application" sentence may be added in admissions UI only | **[VERIFY]** current Common App brand/AI-use wording (21 gaps) |

### 7.2 Draft text (page `/legal/trademark-notice`)
1. **Independent.** {{BRAND}} is an independent education company. We are not affiliated with, sponsored, endorsed or approved by ETS, the University of Cambridge, the British Council, IDP Education, Pearson, Duolingo, the Common Application or any other exam owner.
2. **Names used for identification only.** Names such as GRE®, TOEFL®, IELTS™ and others belong to their owners and are used only to describe the tests our practice material prepares you for ("practice for the GRE® test"). We never use official logos, and the names are not part of our product, company or domain names. **[LEGAL]** nominative-use limits under BD trademark law and the owners' guidelines.
3. **Original content.** All questions, passages, audio, videos, explanations and tests are **written by us or our contributors, or licensed to us**. We do not copy, closely paraphrase, scrape or "recreate" items from official materials (for example Cambridge IELTS books or ETS official guides). Each item carries an originality attestation. If you believe an item copies protected material, tell us at {{COPYRIGHT_EMAIL}}; we retire it immediately while we investigate (see Copyright procedure, §15).
4. **Official-style formats.** Instruction wording that follows test conventions (for example "NO MORE THAN TWO WORDS") is functional and used for realism only.
5. **Estimates.** Scores are estimates, not official results (see AI Scoring Policy).
6. **Our marks and content.** © {{YEAR}} {{LEGAL_ENTITY}}. All rights reserved. {{BRAND}} and its logo are our marks `[VERIFY: registration status]`.
7. **Third-party licensed content** is identified where it appears with its licence.
8. **Corrections.** We publish corrections to answer keys (public corrections log, P2).
Bangla translation of notices is legal-reviewed; English is authoritative (07 §9.5).

---

## 8. Community Guidelines

> **DRAFT — requires review by a Bangladesh-qualified lawyer before publication.** Document id `community`. P1 community = the **official moderated Facebook group/Discord** (D12 C21; `03:1361` says Facebook group is not an official support channel); in-app Q&A/forum is P2 (F-COM-*). Operating rules (queues, SLAs, severity classes): `27` §10. **[LEGAL]** L-24: intermediary-liability/notice-and-takedown duties for user-generated content in BD and under the EU DSA if we serve EU users `[U]`.

### 8.1 Draft text
1. **Be respectful.** No harassment, bullying, hate speech, threats or sexual content. No attacks on people's religion, gender, region, disability, family or appearance. Debate ideas, not people.
2. **Keep it on topic and helpful.** Exam preparation, study help, study partners. No spam, ads, referral links, or "buy my course" posts; no selling or trading accounts, notes or paid content.
3. **Protect privacy.** Do not post phone numbers, addresses, ID, other people's photos or private messages. Do not ask minors for personal contact details or to move to private chats.
4. **Protect integrity.** No leaked questions, answer keys, or screenshots of tests; no cheating services; no "guaranteed band" or "exam hack" scams. Share strategy, not stolen content.
5. **Be honest in reviews.** Review only what you used. No fake, paid-for, swapped or retaliatory reviews. Instructors and staff must disclose affiliation.
6. **Safety first.** If someone is in danger, contact local emergency services (Bangladesh: 999 `[VERIFY]`). Posts about self-harm will be escalated to a trained person; we will share support resources. Content endangering children is removed and reported.
7. **Language.** Bangla, English or mixed are all welcome; slurs in any script are not.
8. **Moderation.** Moderators may remove content, mute, suspend or ban members. You will usually get a reason; you may appeal to {{SUPPORT_EMAIL}} within 30 days. Moderators do not give legal, visa or medical advice.
9. **Reporting.** Use "Report" on any post, or email {{SUPPORT_EMAIL}}. We aim to review urgent reports (safety, minors) within 24 hours and others within 72 hours.
10. **Official help is not given in groups.** For account, payment or score issues use the in-app Help Centre or Support; never post transaction IDs or personal data publicly.

**Bangla summary (সংক্ষেপে):** সম্মান বজায় রাখুন; হয়রানি, ঘৃণা, হুমকি ও অশ্লীলতা নয়। স্প্যাম ও বিজ্ঞাপন নয়; ফাঁস হওয়া প্রশ্ন-উত্তর শেয়ার করবেন না। নিজের বা অন্যের ব্যক্তিগত তথ্য (ফোন নম্বর, ঠিকানা) প্রকাশ করবেন না। ভুয়া রিভিউ নিষিদ্ধ। বিপদে থাকলে জরুরি সেবায় যোগাযোগ করুন। মডারেটরের সিদ্ধান্তে আপত্তি থাকলে ৩০ দিনের মধ্যে আপিল করুন।

---

## 9. Live Class Code of Conduct & Safeguarding Policy

> **DRAFT — requires review by a Bangladesh-qualified lawyer before publication.** Document id `live-conduct`. Source rules: `18` §2.5–2.6, §4.2, §5.8 (minors), §5 Zoom controls. Operating procedure for incidents: `27` §13. **[LEGAL]** L-25: statutory reporting duties for child-safety concerns in Bangladesh (Children Act 2013 and others `[VERIFY][U]`), police-clearance requirement and what staff vetting is lawful; liability of company for staff conduct.

### 9.1 Draft text
**Scope.** Applies to all live classes, 1:1 mentor sessions, Speaking Club slots, doubt sessions, class chat and any group channel connected to a batch, for learners, Guardians, instructors, TAs/moderators and mentors.

**1. Everyone**
1. Treat everyone with respect; no harassment, discrimination, or sexual/violent/abusive language or imagery.
2. Use your **first name + initial** only ("Ayesha K."); do not share phone numbers, social handles, addresses or other contact details in class, chat or breakouts.
3. **No recording** of sessions by learners and no sharing of links, recordings or screenshots.
4. Cameras and microphones are optional for learners (unless a Speaking Club task needs a mic). Staff must not require a minor to turn on their camera.
5. Class chat is public to the class; **private chat between participants is disabled**.
6. Use the in-room **Report** button or email {{SAFEGUARDING_EMAIL}} for anything that worries you.

**2. Staff (instructors, TAs/moderators, mentors, counsellors)**
7. **Vetting:** identity and background check including a Bangladesh police clearance certificate `[VERIFY: availability and legal basis]`, signed code of conduct, and **mandatory safeguarding training before any batch that includes minors** (18 §4.2).
8. **No private DMs and no off-platform contact** with minors (no WhatsApp, Facebook, phone, social media friend requests, meetups, gifts, or private lessons). All contact is in class chat or group channels where a second adult is present.
9. **Two-adult rule:** a TA/moderator is present in every session containing minors; 1:1 mentor sessions with a minor have a **Guardian-visible schedule**, are **recorded by default** and the recording is accessible to the Guardian (retained 30 days).
10. Professional conduct and dress; no comments on learners' bodies, appearance, family, religion or relationships; no inappropriate physical-world arrangements.
11. Report any concern, including about a colleague, **immediately** to the Designated Safeguarding Lead (DSL). Retaliation against a reporter is a disciplinary offence.
12. Staff must not use personal accounts for class; Zoom settings: waiting room on; only host/co-host share; participant rename locked to "FirstName L."; private chat disabled; chat saved to host-only (18 §5.5).

**3. Minors (under 18)**
13. A minor may join a live class only after **Guardian consent** is verified (email/SMS confirmation stored). Classes with minors run on **Zoom only** (no unlisted public streams).
14. Recordings that include minors: kept **30 days**, never used in marketing, faces/voices only if the minor enabled camera/mic; raw Q&A voice can be trimmed on request.
15. Guardians may request to see the class schedule and, for 1:1 sessions, the recording.
16. **Women-only Speaking Club slots** are offered in parallel where demand exists, with a female teacher and TA; the inclusion rule for the slot is "self-identified women" with escalation to Support for edge cases (18 §2.4).

**4. Reporting and response**
17. In-room Report and {{SAFEGUARDING_EMAIL}} go to the **Live Ops lead and the DSL**. We **acknowledge within 24 hours** (urgent safety concerns: as soon as seen, target 1 hour in support hours); a person at risk is removed from contact at once; evidence is preserved; serious cases are escalated to the founders and, where legally required or appropriate, to authorities. `[LEGAL]` L-25.
18. We will tell the reporter what we can; we may need to keep some details confidential.

**5. Consequences.** Learners: warning → removal from session → suspension from live → termination (no refund for serious conduct). Staff: immediate removal from sessions pending investigation; termination for substantiated breach; referral to authorities where appropriate.

**6. Data.** Attendance, chat and recordings are processed as described in the Privacy Policy; safeguarding records are kept `[DECIDE][LEGAL]` L-25 (proposal: 7 years after the minor turns 18 for substantiated cases; 2 years otherwise).

### 9.2 Bangla summary (সংক্ষেপে)
লাইভ ক্লাসে সবার প্রতি সম্মান রাখুন; শুধু প্রথম নাম ও আদ্যক্ষর ব্যবহার করুন, ফোন নম্বর বা সোশ্যাল আইডি শেয়ার করবেন না; ক্লাস রেকর্ড বা স্ক্রিনশট শেয়ার নিষিদ্ধ। ১৮ বছরের কম বয়সীদের জন্য অভিভাবকের সম্মতি লাগবে; শিক্ষক/মেন্টর কোনো অপ্রাপ্তবয়স্কের সঙ্গে ব্যক্তিগত বার্তা বা ক্লাসের বাইরে যোগাযোগ করতে পারবেন না; ১:১ সেশন অভিভাবক-দৃশ্যমান ও রেকর্ডসহ হবে। উদ্বেগের কথা ক্লাসের “রিপোর্ট” বোতামে বা {{SAFEGUARDING_EMAIL}}-এ জানান—আমরা ২৪ ঘণ্টার মধ্যে সাড়া দিই।

---

## 10. Instructor / Creator Agreement

> **DRAFT — requires review by a Bangladesh-qualified lawyer before publication/signature.** Template for P1 content contractors and lead instructors (D12 C19/GA-008): **P1 content = work-for-hire contractors paid per asset + optional lead-instructor royalty (default 10% of net on their course)**; payouts **manual monthly** by `finance` (bank/bKash; withholding tax per accountant) in P1–P2; automated marketplace payouts and revenue-share (`revenue_share_bps`) are P3 (05:1047). The signed agreement is stored off-platform in P1 (PDF in private R2, `creator_agreement` row proposed in §19.3) and accepted in-platform from P3 (`/legal/creator-terms`). **Key legal caveats:** "work-for-hire" is a US-law concept; under Bangladeshi copyright law, ownership of commissioned works needs a **written assignment**, and employer-ownership rules depend on employment status **[LEGAL][VERIFY]** L-28 (Copyright Act 2023 `[VERIFY]` — the statute number/year is not confirmed here); moral rights waiver may be limited; non-competes are generally void under Contract Act 1872 s.27 except narrow cases `[LEGAL][VERIFY]` L-29; withholding tax (AIT/TDS) rates and who is the "payer" for individual contractors `[LEGAL]` L-30; worker classification (contractor vs employee) `[LEGAL]`.

### 10.1 Draft clauses

**Parties & engagement.** {{LEGAL_ENTITY}} ("Company") and **{{CREATOR}}** ("Creator"). Engagement type (tick): ☐ per-asset contractor (Schedule 1) ☐ lead instructor with royalty (Schedule 2) ☐ hourly grader (see §11) ☐ salaried (separate employment contract).
1. **Services & deliverables.** Creator produces the assets in the Statement of Work (videos, lessons, questions, passages, audio, explanations, scripts, slides, vocabulary lists) to the Company's style guide, rubric and **quality bar** (editor first-response ≤ 3 business days; full review ≤ 7 business days for ≤ 5 h courses, 03 §9.3). Company may reject/request changes; two revision rounds included `[DECIDE]`.
2. **Original work warranty.** Creator warrants every deliverable is **original** to Creator or properly licensed in writing, does not copy or closely paraphrase **ETS, Cambridge, IDP, British Council, Pearson or any official/third-party material** (07 §9.4), is not scraped, contains no third-party personal data, and does not infringe any right. Each item carries an **originality attestation** (checkbox + source note). Using AI to *assist* drafting is allowed only if (a) generated from the Creator's own topic briefs, never from pasted official text, (b) the Creator substantially rewrites and takes responsibility, and (c) disclosed in the source note.
3. **Ownership — assignment.** On creation (and, for future works, as they are created), Creator **assigns to the Company all right, title and interest worldwide in the deliverables** and all related IP (copyright, database rights, rights in recordings), including the right to adapt, translate, dub, edit, re-voice, bundle, resell and sublicense, for the full term of protection. To the extent assignment is not possible, Creator grants an **exclusive, perpetual, irrevocable, worldwide, sublicensable licence**. Creator waives moral rights to the extent permitted and consents to the Company editing deliverables (credit: Company will credit Creator by name where the product page lists instructors, unless Creator opts out). **[LEGAL]** L-28.
4. **Creator's retained rights.** Creator keeps general skills, know-how and the right to describe the work in a portfolio (link to public pages) and to reuse **non-confidential teaching techniques**, but not the deliverables or substantially similar content `[LEGAL]`.
5. **Name & likeness licence.** Creator licenses name, voice, image and bio for the Company's marketing of the deliverables, during the term and for materials already published afterwards for archival use `[DECIDE]` (post-term takedown on request within 30 days except archival/legal copies).
6. **Confidentiality.** Creator keeps confidential: unpublished content, answer keys, item statistics, gold-set data, learner data, pricing, roadmaps, analytics, and these terms. Survives 5 years (answer keys and personal data: indefinitely). Exceptions: law/court order with notice.
7. **Learner data protection.** If Creator can see learner questions or submissions (instructor Q&A, studio analytics), Creator uses them only to teach and improve the course, does not copy/export them, and follows the Company's data rules (Privacy Policy; D4: instructors see only their own course analytics). Creator uses **two-factor authentication** (D4/09) and does not share the account.
8. **Safeguarding.** If Creator will teach live or interact with minors, Creator must pass vetting and training and sign the Live Class Code of Conduct (§9).
9. **Quality & performance.** Rubric/accuracy standards; corrections within 5 business days for factual errors (F-ERR-02 flow); Company may retire or edit content for accuracy, legal or quality reasons. Learner ratings below a threshold for two consecutive quarters trigger a plan `[DECIDE]`.
10. **Independent contractor.** Creator is not an employee; controls own methods and hours; pays own taxes and expenses unless agreed; no authority to bind the Company. **[LEGAL]** L-30.
11. **Fees (Schedule 1: per-asset).** Rate card per asset type set by finance, payable monthly in arrears (manual payout, by the 15th `[DECIDE]`) by bKash/bank to the account the Creator registers; Company withholds tax and VAT as law requires `[LEGAL][VERIFY]`; accepted assets only; payment for rejected assets only for agreed kill-fees.
12. **Royalty (Schedule 2: optional, lead instructor).** Creator receives **10% of Net Revenue** attributable to the Creator's named course (D12 C19; `02` says 12% — D12 wins, X6), monthly statement and payment on the same manual cycle. **Net Revenue** = amounts actually received from customers for the course after VAT/sales tax, payment-gateway fees, refunds, credit notes, chargebacks and discounts/coupons/affiliate commissions `[DECIDE]`; bundle/pass revenue allocated by the Company's disclosed allocation method `[DECIDE]`; royalty on revenue later refunded/charged-back is clawed back from future statements. Creator may request the statement workings; audit right once a year at Creator's cost, by an independent accountant, on 30 days' notice. Royalty term: while the course is on sale + 12 months tail `[DECIDE]`. **[LEGAL]** accounting definition with the accountant (GA-011).
13. **Exclusivity & non-compete.** No exclusivity unless stated. During the term Creator will not publish the *same* deliverables elsewhere. No broad post-term non-compete (likely unenforceable) — instead confidentiality + non-solicit of Company staff for 12 months `[LEGAL]` L-29.
14. **Indemnity & liability.** Creator indemnifies the Company against third-party claims arising from breach of the originality warranty; Company's liability to Creator capped at fees paid in the prior 12 months. **[LEGAL]**
15. **Takedown cooperation.** Creator will promptly help respond to copyright complaints; the Company may remove content immediately (07 §9.4; §15 here).
16. **Term & termination.** Term per SOW. Either party may terminate on 30 days' notice; the Company may terminate immediately for material breach, safeguarding concern, plagiarism/infringement, or confidentiality breach. On termination: Creator delivers work in progress; Company keeps all assigned rights; accepted work remains paid; royalty tail as above; access revoked same day.
17. **Disputes & governing law.** Bangladeshi law; Dhaka courts (or arbitration, Option B in Terms §20) `[LEGAL]`.
18. **KYC & payment onboarding (operational schedule).** Creator provides ID, TIN (if applicable), payout account; foreign creators provide tax forms as advised `[LEGAL]` L-30. Records kept 10 years.

## 11. Grader / Item-writer Contractor Agreement — key clauses outline

> **DRAFT outline — requires review by a Bangladesh-qualified lawyer.** Closes GA-024 contract part. Operational model (recruitment, QWK-based probation, pay) is in `27` §12.

| # | Clause | Key content |
|---|---|---|
| 1 | Role & scope | Grader (human review of AI results, disputes) and/or item-writer (original items). Not employees. Role `grader` (D4): **2FA mandatory**. Graders who are also instructors: **recuse** from reviewing their own learners/courses (conflict declaration). |
| 2 | Qualification & probation | Rubric training; qualification test; calibration against the gold set; **QWK ≥ 0.80 (target)** vs adjudicated references during probation (07 §7.9); two failed calibrations → suspension; 2% monthly audit sampling and 5% double-marking `[VERIFY 07 §7.9 numbers]` |
| 3 | Service levels | Assignment due 8 h after assignment; request SLA 48 h standard / 24 h priority (07); availability calendar; no-show escalation; workload caps and daily fatigue limit `[DECIDE]`; replacement of in-flight work on exit |
| 4 | Confidentiality | Learner submissions, AI outputs, answer keys, rubrics, gold-set content, queue data. No downloading, copying, screenshots or sharing; sessions logged; time-boxed audio access |
| 5 | **No third-party AI/tools on learner data** | Graders must not paste learner text/audio into any external AI, translation or storage tool; breach = termination + indemnity |
| 6 | Data protection | Sees only redacted data, never email/phone (09 §10.4); follows Privacy Policy; reports suspected breaches within 24 h; return/delete everything at exit |
| 7 | Independence & impartiality | No contact with learners outside the platform; no accepting gifts; no coaching of learners they grade; override requires written rationale (stored, audited) |
| 8 | Quality & integrity | Follow rubric; no ghostwriting; for admissions reviewers: **never write or rewrite** student text, sign the integrity code (21 §3.3/5.1), 5% audit sampling |
| 9 | IP (item-writers) | Assignment of items (as §10.3); originality attestation; no official/third-party material; similarity scan; takedown cooperation |
| 10 | Fees | Per-review / per-item / hourly rate card set by finance; payout monthly by manual batch; SLA-breach and quality deductions only as stated in the rate card; withholding tax `[LEGAL]` L-30 |
| 11 | Safeguarding | If reviewing minors' work or speaking audio: training, code of conduct, report concerns to DSL |
| 12 | Term & termination | 30 days' notice; immediate for confidentiality/integrity breach; access revocation checklist (sessions, 2FA, queue reassignment) same day |
| 13 | Liability, law, disputes | As §10 (14, 17) |

## 12. Admissions Services Terms (P2a, `21`)

> **DRAFT — requires review by a Bangladesh-qualified lawyer before publication.** Document id `admissions-terms`. Source: `21` §3.3, §5.1–5.3, role `counsellor` (D4). **[LEGAL]** L-31: whether offering application/educational-consulting services requires a licence or registration in Bangladesh (for example if any study-abroad "consultancy" rules exist) `[U]`; consumer-law treatment of "success" claims; Common App brand use.

### 12.1 Draft text
1. **What the service is.** Planning tools (college list, deadlines, documents, activities, recommender tracker), AI and human **feedback** on your drafts, and counselling sessions. It is **feedback-only**. We do not write, rewrite, "polish into finished text", ghostwrite or fabricate essays, SOPs, personal statements, recommendation letters, CVs, transcripts, bank statements, certificates or any document.
2. **Your authorship.** You confirm for each essay: "I wrote this. AI/humans gave feedback only." The confirmation, your draft history and reviews are stored (21 §3.3, `consent_kind=admissions_authorship`). We may refuse or stop a service if we believe the work is not yours.
3. **No guarantees.** We do not guarantee admission, scholarship, funding or visa outcomes and do not predict them. Application decisions belong to universities and visa decisions to governments. We are **not** a legal, immigration or financial adviser.
4. **Not an agent / no commissions.** We are independent of universities and do not take commissions at launch. If this changes we will disclose it on every recommendation page and will never rank by commission (21 §5.2).
5. **Accuracy of data.** College data (deadlines, fees, requirements) carries a "verified on" date; always confirm on the university's own site. We are not liable for changes.
6. **Not Common App.** We are not affiliated with, and are not an integration of, the Common Application; we never ask for your Common App password or log in to your account (21 §1).
7. **Minors and guardians.** If you are under 18, a Guardian must give verified consent **before** any counsellor session, human essay review or storage of family/financial documents; no marketing to under-18 (21 §5.3). Guardians see deadlines and receipts, and essays only if you share them.
8. **Sensitive documents.** Financial documents and passport scans are optional, encrypted, visible to your assigned counsellor only with your consent, and deleted per the retention rules (Privacy Policy). Do not upload documents belonging to others.
9. **Counsellor conduct & recordings.** Counsellors are vetted, sign an integrity code, use two-factor authentication and follow the Live Class Code of Conduct. Session notes are yours to see. Sessions with minors follow §9.
10. **Cancellation/refund.** See Refund Policy A3 (admissions row).
11. **Third-party sites.** We link to universities' official sites and policies (AI-use policies vary by college — check each).
12. **Termination.** We may end services for integrity breaches (for example asking us to write your essay) with no refund of delivered services.

### 12.2 Bangla summary (সংক্ষেপে)
অ্যাডমিশন সার্ভিসে আমরা শুধু **ফিডব্যাক ও গাইডলাইন** দিই—আপনার এসে/এসওপি আমরা লিখে দিই না, ঘষামাজা করে “তৈরি” করেও দিই না। ভর্তি, বৃত্তি বা ভিসার কোনো নিশ্চয়তা নেই। প্রতিটি এসের জন্য আপনি নিশ্চিত করবেন যে লেখাটি আপনার নিজের। ১৮ বছরের নিচে হলে কাউন্সেলিং বা মানব রিভিউর আগে অভিভাবকের যাচাইকৃত সম্মতি লাগবে। আমরা Common App-এর অংশ নই এবং আপনার Common App পাসওয়ার্ড কখনো চাই না।

---

## 13. Accessibility Statement

> **DRAFT — requires review by a Bangladesh-qualified lawyer before publication.** Route `/accessibility`. Targets per D8 (WCAG 2.2 AA), `03` A-12 accommodations, D12 C18. **[LEGAL]** L-32: whether the EU Accessibility Act (applicable to some e-commerce/education services since 28 June 2025) reaches us, and the micro-enterprise exemption `[U]`; US ADA exposure for US-facing sales `[U]`.

### 13.1 Draft text
1. **Commitment.** We want everyone preparing for English and graduate tests to use {{BRAND}}. We aim to meet **WCAG 2.2 Level AA** and test with automated tools (axe-core in CI, Lighthouse) and manual keyboard, screen-reader and zoom checks.
2. **Features.** Light/dark themes; adjustable text size (S–XL); reduced motion; captions on videos; data-saver mode; keyboard operation; Bangla and English interface; dyslexia-friendly font option (planned); high-contrast theme (planned, 03 A-12).
3. **Exam accommodations.** If you have a documented need (for example a disability or medical condition), **Support can grant extra time on timed tests of 1.25×, 1.5× or 2.0×** on a documented request (D12 C18); a self-serve request form follows in a later release. Organisation admins can request it for their learners. We keep the documents only as long as needed and treat them as sensitive health information `[LEGAL]` L-32. Practice mode lets you pause or turn timers off.
4. **Known limitations.** Some practice tasks (for example official-style Listening) rely on audio and cannot be fully equivalent for deaf or hard-of-hearing users; we provide transcripts after you finish a Listening test. Third-party tools (Zoom, payment pages) have their own accessibility. Some older videos lack Bangla captions. Screen-reader support for complex exam widgets is under continuous testing. We publish a list of known issues `{{link}}`.
5. **Tell us.** Report barriers at {{ACCESSIBILITY_EMAIL}} or through Support. We reply within **5 business days** and aim to fix or offer an alternative within 30 days.
6. **Status.** Last assessed `{{date}}` (self-assessed, not independently audited). `[DECIDE]` commission an external audit before P2.

**Bangla summary:** আমরা WCAG ২.২ AA মান অনুসরণ করার চেষ্টা করি। লেখার আকার, ডার্ক মোড, ক্যাপশন ও কিবোর্ড ব্যবহার সমর্থিত। নথিভুক্ত প্রয়োজনে সাপোর্ট আপনাকে পরীক্ষায় ১.২৫×, ১.৫× বা ২× অতিরিক্ত সময় দিতে পারে। কোনো বাধা পেলে {{ACCESSIBILITY_EMAIL}}-এ জানান—৫ কার্যদিবসের মধ্যে উত্তর দেব।

## 14. Security / Responsible Disclosure Policy and `security.txt`

> **DRAFT — requires review by a Bangladesh-qualified lawyer before publication.** Implements `09` §14.2. **[LEGAL]** L-33: **safe-harbour wording** under the Cyber Security Ordinance 2025 / ICT Act (unauthorised-access offences) — a private company cannot waive criminal liability, so the text promises only that we will not initiate legal action for good-faith testing within scope `[U]`.

### 14.1 `/security` page (draft text)
- **Report** to {{SECURITY_EMAIL}} (PGP key optional). Include affected URL/feature, steps, impact, and proof of concept; do not include real learner data.
- **Scope:** `{{DOMAIN}}` and subdomains we operate (web app, API, `/exam`, studio, support console). **Out of scope:** social engineering of staff or learners, physical attacks, volumetric DoS, spam/OTP-flooding tests, findings in third-party services (report to them), content piracy by authorised users, missing best-practice headers without demonstrated impact, automated scanner output without a working exploit.
- **Rules:** test only with your own accounts; do not access, modify, download or retain other people's data (stop and report if you see it); no DoS; no persistence; give us a reasonable time (90 days) before public disclosure; report **exposed answer keys, auth bypass, IDOR, payment tampering and learner-data exposure** with highest priority.
- **Our commitments:** acknowledge within **3 business days**; triage within **7 days**; fix target by severity **7 / 30 / 90 days** (critical/high/medium-low); keep you updated; credit you in a hall of fame if you wish. **No cash rewards at launch** (VDP); a private invite-only bounty may follow after 3–6 months (09 §14.2).
- **Safe harbour (good faith):** if you follow this policy, we will consider your research authorised and will not pursue legal action against you for it. **[LEGAL]** L-33.

### 14.2 `/.well-known/security.txt` (RFC 9116)
```
Contact: mailto:security@{{DOMAIN}}
Expires: {{DATE_PLUS_<=365_DAYS}}T00:00:00.000Z
Preferred-Languages: en, bn
Policy: https://{{DOMAIN}}/security
Canonical: https://{{DOMAIN}}/.well-known/security.txt
# Encryption: https://{{DOMAIN}}/.well-known/pgp-key.txt   (optional)
```
Add a calendar reminder to renew `Expires` at least 30 days early (owner: `super_admin`; also add to `PROGRESS.md` ops checklist).

## 15. DMCA / Takedown & Copyright Complaint Procedure

> **DRAFT — requires review by a Bangladesh-qualified lawyer before publication.** Route `/legal/copyright`. Implements `09` §9.6 / `07` §9.4 takedown rule. **[LEGAL]** L-34: (a) Bangladesh copyright statute and any notice-and-takedown mechanism `[VERIFY]` — the **US DMCA safe harbour (17 U.S.C. §512) only helps if we qualify as a service provider and register a designated agent with the US Copyright Office; we are a BD company serving some US users — decide whether to register** `[U]`; (b) EU Digital Services Act notice-and-action (Art. 16) for hosted user content if EU users `[U]`; (c) whether to also handle complaints under a neutral "Copyright Complaint" name rather than "DMCA" (recommended).

### 15.1 Draft text
**A. Who can complain.** Anyone who believes content on {{BRAND}} (course material, question, user post, review) infringes their copyright or trademark.
**B. How to complain.** Email {{COPYRIGHT_EMAIL}} (or the form at `/legal/copyright`) with: (1) your name, address, email, phone; (2) identification of the work claimed to be infringed; (3) the exact URL(s) or item ID(s) on {{BRAND}}; (4) a statement that you have a good-faith belief the use is not authorised by the owner, its agent or the law; (5) a statement, under penalty of perjury (where applicable), that the notice is accurate and that you are the owner or authorised to act; (6) your physical or electronic signature. Incomplete notices may be returned.
**C. What we do.** Acknowledge within **2 business days**; **remove or disable access to the content promptly (target 48 hours)** — for exam items, the item is **retired immediately** and an audit entry created (07 §9.4); notify the uploader (if user content) with a copy of the notice (contact details may be redacted); keep an evidence record 3 years.
**D. Counter-notice.** The uploader may reply with: identification of the removed content and its former location; statement under penalty of perjury that removal was a mistake or misidentification; consent to jurisdiction (Dhaka courts, or the court of their residence for US users `[LEGAL]`); name, address, signature. We forward it to the complainant; unless the complainant notifies us within **10 business days** that they filed court proceedings, we may restore the content `[LEGAL][VERIFY: timing under the applicable regime]`.
**E. Repeat infringers.** Accounts with **three** substantiated complaints in 12 months are terminated `[DECIDE]`.
**F. Misrepresentation.** Knowingly false notices or counter-notices may expose the sender to liability.
**G. Reporting leaks of *our* content** (found on Telegram, Facebook etc.): email {{COPYRIGHT_EMAIL}} with the link; our outbound takedown procedure is in `27` §11.4.
**H. Trademark complaints** follow the same route.

## 16. Data Processing Addendum (B2B institutions) — outline

> **DRAFT outline — requires review by a Bangladesh-qualified lawyer.** P2 (org accounts, `(org)` route group). Closes the DPA part of 09 §13.5 and GA-030 offboarding. Roles analysis is the crux: **[LEGAL]** L-35.

| # | Section | Draft position |
|---|---|---|
| 1 | Parties & roles | Institution (coaching centre/university/school/company = "Customer"). For learner data provisioned by the Customer (seat assignments, cohort analytics, rosters): Customer is **controller**, Company is **processor**. For the learner's own account, payments, security, AI submissions and independent contractual relationship: Company is an **independent controller**. Learner chooses what the Customer sees (consent-based view, D4/21). **[LEGAL]** L-35 (PDPO terminology and any processor registration `[U]`) |
| 2 | Subject, duration, nature, purpose | Seat provisioning, assignment of courses/tests, cohort reporting; term = subscription + offboarding |
| 3 | Data & subjects | Learners, org staff; categories as Privacy Policy; **no minors' data unless the Customer warrants it holds Guardian consent** (schools) |
| 4 | Instructions | Processing only on documented instructions; unlawful instruction notice |
| 5 | Confidentiality | Staff bound by confidentiality; staff access logged and role-limited (D4) |
| 6 | Security (Annex II) | Summary of 09: encryption, RBAC, 2FA for org admins, audit log, backups/restore drills, breach process |
| 7 | Sub-processors | General authorisation with the public list; **30 days' notice** of changes; right to object; flow-down terms |
| 8 | International transfers | SCCs/UK Addendum where EU/UK Customers; BD law transfer test `[U]` |
| 9 | Data-subject requests | Company assists within 10 business days; learners may be redirected to Customer for roster data |
| 10 | Breach | Notify Customer **without undue delay and within 48 hours** of confirmation `[DECIDE]` |
| 11 | DPIA/prior consultation assistance | On request |
| 12 | Audit | Annual questionnaire; independent report summaries; on-site audits only for cause |
| 13 | Return/deletion at end | Export (CSV/JSON) within 30 days; deletion/anonymisation within 60 days; legal-retention exceptions listed; org seat release (05 §7.4) |
| 14 | Liability | Subject to main agreement cap |
| 15 | Order of precedence | DPA prevails on data protection |
| Annexes | I description of processing; II security measures; III sub-processors; IV Customer contacts |

---

## 17. Lawyer-review gate — overview

**Rule:** no legal page, checkout consent, creator contract or policy-dependent feature goes live until the row for it in §18 is signed off. The gate is a **launch blocker** in the business-readiness checklist (GA-061; add to `11` §11) and sits **before P1-54** (launch) in `12`. Where counsel cannot finish in time, the fallback is **a smaller launch scope** (see §17.2), not publishing unreviewed text.

### 17.1 Who does what

| Role | Person | Responsibility |
|---|---|---|
| **Gate owner** | Founder-1 (`super_admin`) | Engages counsel, owns this checklist, signs the record, decides all `[DECIDE]` items |
| **Counsel A — Bangladesh general/commercial/consumer lawyer** | external | Terms, Refund, Progress Promise, Admissions, Accessibility, Community, DMCA, Creator/Grader contracts, governing law, consumer-law points |
| **Counsel B — data protection (PDPO + GDPR/UK GDPR)** | external (may be same firm) | Privacy, Cookie, AI Scoring (Art. 22/DPIA), processors/transfers, DSAR SLAs, DPA |
| **Counsel C — IP/trademark** | external | Trademark Notice (ETS/IELTS), copyright/DMCA, assignment clauses |
| **Accountant (chartered)** | external | VAT-inclusive pricing, credit notes, retention periods for tax, withholding on creator/grader payments, Progress Promise provision (GA-011/GA-014) |
| **Safeguarding lead (DSL)** | internal (named; founder until hired) | Live Conduct/Safeguarding, minors flows; liaison with counsel on reporting duties |
| **Drafter / maintainer** | Haiku (copy) → Opus (review) in the repo | Keeps MDX in sync, regenerates inventories, never edits approved text without a version bump |
| **Support & Trust lead** | internal | Confirms every policy is operable by Support (doc 27) |

### 17.2 Fallback if counsel is not ready (descope, in order)
1. Sell **Free/Core/Plus only** and hold **Mentor + Progress Promise** and instalments until L-07/L-12 are cleared.
2. Hold **Live tier for minors**; run adult cohorts first (safeguarding text then still needed but lower risk).
3. Disable **AI speaking for under-18** (already the proposed default, L-18).
4. Disable the **admissions** product line (P2a anyway).
5. International sales wait for Paddle onboarding + L-03/L-05/L-06.
Never fall back on: Terms, Privacy, Refund, Cookie, AI Scoring, Trademark Notice — these are P1-launch blockers.

## 18. Gate checklist (per document)

Legend: **Blocks** = what cannot ship until signed. **Sign-off id** = `LEG-<kind>-<version>` stored in `docs/legal/signoffs/` (see §19.3). Status boxes are updated by the gate owner.

| # | Document | Accountable | Counsel | Blocks | Key decisions (L-xx) | Sign-off |
|---|---|---|---|---|---|---|
| 1 | Terms of Service | Founder-1 | A | P1 launch | L-01, 02, 03, 04, 05, 06, 07, 10, 11, 15 | ☐ |
| 2 | Privacy Policy + processors | Founder-1 / `{{PRIVACY_OWNER}}` | B | P1 launch; Google OAuth verification | L-08, 09, 13, 17, 18, 19, 20, 21, 37 | ☐ |
| 3 | Cookie Policy + inventory | Eng lead | B | P1 launch (PostHog gating) | L-23 | ☐ |
| 4 | Refund & Cancellation | Finance/Founder-1 | A + accountant | P1 launch | L-03, 14, 26, 27 | ☐ |
| 4C | Progress Promise Terms | Founder-1 | A + accountant | **Mentor tier sale** | L-12 | ☐ |
| 5 | AI Scoring Policy | Academic lead | B (+A for claims) | P1 launch; **accuracy section** blocked on GA-006 gold-set gate | L-13, 14 | ☐ |
| 6 | Acceptable Use / Integrity | Support & Trust lead | A + B (device signals) | P1 launch | L-11, 17 | ☐ |
| 7 | Content & Trademark Notice | Academic lead | C | P1 launch; **ETS layout review submitted** | L-16 | ☐ |
| 8 | Community Guidelines | Support & Trust lead | A | P1 (FB group/Discord) | L-24 | ☐ |
| 9 | Live Conduct & Safeguarding | DSL | A (child-safety) | Any live class; **minors** | L-25 | ☐ |
| 10 | Instructor / Creator Agreement | Founder-1 / Academic lead | A + C + accountant | First paid contractor | L-28, 29, 30 | ☐ |
| 11 | Grader / Item-writer Agreement | Academic lead | A + accountant | First grader engaged | L-29, 30 | ☐ |
| 12 | Admissions Services Terms | Founder-1 | A | P2a | L-31 | ☐ |
| 13 | Accessibility Statement | Eng lead | A | P1 launch | L-32 | ☐ |
| 14 | Security / security.txt | Eng lead | A (safe harbour) | P1 launch | L-33 | ☐ |
| 15 | Copyright / Takedown | Support & Trust lead | C | P1 launch | L-34 | ☐ |
| 16 | DPA (B2B) | Founder-1 | B | First org account (P2) | L-35 | ☐ |
| 17 | Bangla versions of 1–6, 9 | Academic lead | native legal translator | Publishing the Bangla pages | L-02 | ☐ |
| 18 | DPIA (AI scoring + minors' voice) + transfer assessments | `{{PRIVACY_OWNER}}` | B | P1 launch (AI features) | L-08, 13, 18 | ☐ |
| 19 | Checkout consent copy (BD + EU/UK waiver; instalments; auto-renew) | Product | A + B | P1 launch (BD), intl launch | L-03, 06, 07 | ☐ |
| 20 | Guardian-consent flow wording + OTP verification standard | Product / DSL | B | Any under-18 paid/AI feature | L-04, 18 | ☐ |
| 21 | Staff/contractor onboarding pack (confidentiality, safeguarding) | Ops | A | First staff | — | ☐ |

**Gate pass condition:** all rows marked **P1 launch** or blocking a shipped scope are signed; every `[VERIFY]` in those documents is closed or explicitly accepted in writing; the site footer notices match §7.1; version rows exist and acceptance logging is live (§19.3); processors page matches the vendors actually configured.

## 19. Counsel decision register, verification list, versioning

### 19.1 Counsel decision register (`L-xx`)

| ID | Question for counsel | Default in this draft | Docs |
|---|---|---|---|
| L-01 | Governing law / forum; arbitration for B2B only; consumer carve-outs | BD law, Dhaka courts; no mandatory arbitration for consumers | 1, 10 |
| L-02 | Is a Bangla version legally required for BD consumers? Which language prevails? Unilateral variation clause validity | English authoritative; Bangla summaries; 30-day notice + re-accept | 1 |
| L-03 | EU/UK 14-day withdrawal for digital content; how consent-to-start/waiver is captured via Paddle; BD Consumer Rights Protection Act 2009 / Digital Commerce Guidelines 2021 duties (refund disclosure, grievance contact, delivery) | 7-day/20% policy plus statutory rights untouched | 1, 4 |
| L-04 | Enforceability against minors (Contract Act 1872, Majority Act 1875); whether Guardian-purchaser model suffices; refund of minor purchases without consent | Guardian consent + guardian pays; refund if no consent | 1, 2, 4 |
| L-05 | Paddle (MoR) vs Stripe via foreign entity; who is seller; buyer-terms references | Paddle as seller for foreign-currency sales | 1, 2 |
| L-06 | Auto-renew disclosure and cancellation (EU/UK/US states); current status of US "click-to-cancel" federal rule `[U]` and UK subscription regime `[U]` | Clear pre-checkout disclosure; cancel any time online | 1, 4 |
| L-07 | Instalments: enforceability of balance, whether regulated credit, consequences of default | 7-day grace then pause; balance due unless refunded | 1, 4 |
| L-08 | Controller/processor map; PDPO "equivalent protection" for Singapore/US/EU recipients; localisation ("critical sector"?) ; SCC/IDTA/DPF use; EU/UK representative | Documented transfer assessment; minimise PII; BD-hosting hedge | 2, 16 |
| L-09 | Retention: tax records 6–7 vs 10 yrs; audit log 24 months vs 7 years; safeguarding and consent records | See §2.1 table; conflicts X4/X5 | 2 |
| L-10 | Licence for user posts after deletion; public Q&A kept with tombstone author | Retained, author shown as "Deleted user" unless user deletes posts (05) | 1 |
| L-11 | No-refund termination for serious breach; withholding refund while enforcement open | As drafted | 1, 4, 6 |
| L-12 | Progress Promise: legality as promise vs insurance; verification of official reports; wording; liability; accounting provision; marketing claims rules | Mentor only; re-enrolment not cash; conditions per D12 | 4C |
| L-13 | AI scoring: accuracy claims; Art. 22; DPIA content; what is "automated decision" under PDPO `[U]` | Advisory; human review; accuracy unpublished until gate | 5, 2 |
| L-14 | Free dispute review per month (09 §10.4) vs F-AIW-10 (limited P1) | One free/month; credit returned if band differs ≥ 1.0 | 5 |
| L-15 | "As is" disclaimers and liability cap enforceability for consumers; non-excludable liabilities | Cap = 12 months' fees (or BDT 5,000) | 1 |
| L-16 | Third-party trademark wording (ETS fixed; IELTS owners' guideline; TOEFL/PTE/DET/Common App); nominative use; submit layouts to ETS | §7.1 text; reconcile 03/07 | 7 |
| L-17 | Lawful basis and transparency for device/session fingerprinting, concurrent-session limits, watermark tracing | Legitimate interest + disclosure | 2, 6 |
| L-18 | Minors' voice recordings → US STT vendors; "biometric/sensitive" characterisation; under-16 block | Block AI speaking under 16; verified Guardian consent 16–17 | 2, 5 |
| L-19 | Law-enforcement requests: legal process required; notice to users; emergency exception | Court order/formal request only; legal review | 2 (+27 §14) |
| L-20 | Retention of admissions documents (passport/financial) | 12 months inactivity; financial docs 90 days | 2, 12 |
| L-21 | DSAR period under PDPO; fees; refusal grounds | 3-day ack / 30-day completion | 2 |
| L-22 | Meta/WhatsApp as support channel: controller roles, message content, minors | Use for intake only; no sensitive data | 2 |
| L-23 | Cookie banner obligations in BD; strictly-necessary exemptions | Opt-in banner everywhere | 3 |
| L-24 | UGC intermediary liability; notice-and-takedown timelines (BD; EU DSA) | 24h urgent / 72h other | 8, 15 |
| L-25 | Safeguarding reporting duties; police clearance legality; retention of safeguarding records; reporting channels (Children Act 2013? `[VERIFY]`) | As §9 | 9 |
| L-26 | Definition of "consumed" for passes | Allowance-based (mocks + credits + reviews) | 4 |
| L-27 | Physical books: return rights and shipping | Defect/wrong item only (+ unopened 7 days `[DECIDE]`) | 4 |
| L-28 | Copyright assignment in BD for commissioned works; moral rights; "work-for-hire" label | Assignment + exclusive licence fallback | 10, 11 |
| L-29 | Enforceability of non-compete/non-solicit (Contract Act s.27) | Confidentiality + 12-month staff non-solicit | 10, 11 |
| L-30 | Withholding tax (AIT/TDS), VAT on creator/grader fees, foreign creators, worker classification | Per accountant | 10, 11 |
| L-31 | Licensing/registration for educational/admissions consultancy; claims | None assumed (`[U]`) | 12 |
| L-32 | Accessibility regimes (EAA, ADA, BD); health-data classification of accommodation proof | Best-effort WCAG 2.2 AA | 13 |
| L-33 | Safe-harbour wording for security researchers under BD cyber law | Good-faith promise only | 14 |
| L-34 | DMCA agent registration; BD copyright notice-and-takedown; DSA Art. 16 | Neutral "copyright complaint" procedure | 15 |
| L-35 | B2B roles (controller/processor), minors in schools, breach timing | Split roles; 48 h to notify Customer | 16 |
| L-36 | Entity incorporation, shareholders, foreign-exchange rules for export proceeds | — | all |
| L-37 | NDGA controller registration and DPO requirement; breach-notice deadline | Internal 72 h target | 2 |

### 19.2 `[VERIFY]` list (facts not confirmed from the repo)
ETS wording at launch; IELTS wording; Paddle seller eligibility, entity name, buyer terms and refund timings; each AI vendor's no-training/retention setting; Deepgram/OpenAI zero-retention; Neon/Cloudflare R2/Sentry/PostHog regions; SSLCommerz refund timings and licensing; BD statutes by exact name/year (Consumer Rights Protection Act 2009, Digital Commerce Guidelines 2021, Copyright Act 2023, Cyber Security Ordinance 2025, Contract Act 1872 s.27, Majority Act 1875, Children Act 2013, PDPO 2025 & 5 Feb 2026 amendment, NDGA mandate); BD police clearance process; VAT-inclusive display; emergency numbers (999 etc.); Cloudflare/Turnstile storage; US/UK subscription-rule status.

### 19.3 Versioning and acceptance logging

**What exists in `05`:** `consent_record` (immutable ledger: `kind` ∈ terms/privacy/marketing/ai_processing/recording_retention/analytics_cookies, `document_version` **text**, `granted`, `given_by_user_id`, `ip_hash`), `guardian_link`, `data_subject_request`. **What is missing:** a table of policy versions (so text can be tied to a hash and effective date), the locale shown, context (sign-up/checkout/re-accept), links from order/exam attempt/live enrolment to the version accepted, guest cookie-consent proof, and creator-agreement records. Proposed additions (Drizzle sketches follow `05` §1 conventions: snake_case singular, `pk()`, `timestamps()`, `tstz`, FK-indexed):

```ts
// packages/db/src/schema/legal.ts   (new file; add to barrel)
import { sql } from 'drizzle-orm';
import { boolean, char, check, index, jsonb, pgTable, smallint, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { policyKindEnum, policyStatusEnum, appLocaleEnum, creatorAgreementKindEnum } from './enums';
import { createdAtCol, pk, schemaVersionCol, timestamps, tstz } from './_shared';
import { user } from './identity';
import { order } from './commerce';

/** One row per (kind, locale, version). Text lives in the repo (MDX); the DB holds identity, hash, dates and approval. */
export const policyVersion = pgTable('policy_version', {
  id: pk(),
  kind: policyKindEnum('kind').notNull(),
  locale: appLocaleEnum('locale').notNull(),
  version: text('version').notNull(),                         // 'terms-2026-11-01'; equals consent_record.document_version
  status: policyStatusEnum('status').notNull().default('draft'), // draft | counsel_review | approved | published | retired
  isMaterial: boolean('is_material').notNull().default(false),
  requiresReacceptance: boolean('requires_reacceptance').notNull().default(false),
  noticeStartsAt: tstz('notice_starts_at'),                   // >= 30 days before effective_at when material
  effectiveAt: tstz('effective_at'),
  retiredAt: tstz('retired_at'),
  contentHash: char('content_hash', { length: 64 }).notNull(), // sha256 of rendered MDX body
  sourcePath: text('source_path').notNull(),                  // packages/content/legal/terms/2026-11-01.en.mdx
  changeSummaryEn: text('change_summary_en'),
  changeSummaryBn: text('change_summary_bn'),
  signoffId: text('signoff_id'),                              // 'LEG-terms-2026-11-01' -> docs/legal/signoffs/
  approvedBy: uuid('approved_by').references(() => user.id, { onDelete: 'set null' }),
  approvedAt: tstz('approved_at'),
  ...timestamps(),
}, (t) => [
  uniqueIndex('policy_version_uq').on(t.kind, t.locale, t.version),
  uniqueIndex('policy_version_current_uq').on(t.kind, t.locale).where(sql`${t.status} = 'published' and ${t.retiredAt} is null`),
  index('policy_version_approved_by_idx').on(t.approvedBy),
  check('policy_version_published_signoff_chk', sql`${t.status} <> 'published' or (${t.signoffId} is not null and ${t.approvedAt} is not null)`),
]);

/** Guests and logged-in visitors: proof of cookie choice (consent_record requires a user). Retain 24 months. */
export const cookieConsentEvent = pgTable('cookie_consent_event', {
  id: pk(),
  visitorHash: char('visitor_hash', { length: 64 }).notNull(),   // HMAC of the lumen-consent cookie id; no raw IP
  userId: uuid('user_id').references(() => user.id, { onDelete: 'set null' }),
  policyVersionId: uuid('policy_version_id').notNull().references(() => policyVersion.id, { onDelete: 'restrict' }),
  bannerVersion: text('banner_version').notNull(),
  analytics: boolean('analytics').notNull(),
  region: char('region', { length: 2 }),
  createdAt: createdAtCol(),
}, (t) => [
  index('cookie_consent_event_visitor_idx').on(t.visitorHash, t.createdAt),
  index('cookie_consent_event_user_idx').on(t.userId).where(sql`${t.userId} is not null`),
  index('cookie_consent_event_policy_idx').on(t.policyVersionId),
]);

/** Signed creator/grader/counsellor agreements (P1: signed off-platform, PDF in private R2). */
export const creatorAgreement = pgTable('creator_agreement', {
  id: pk(),
  userId: uuid('user_id').notNull().references(() => user.id, { onDelete: 'restrict' }),
  kind: creatorAgreementKindEnum('kind').notNull(),             // per_asset | lead_instructor_royalty | grader | item_writer | counsellor
  templateVersion: text('template_version').notNull(),
  signedAt: tstz('signed_at').notNull(),
  endedAt: tstz('ended_at'),
  royaltyBps: smallint('royalty_bps'),                           // 1000 = 10% (D12 C19)
  documentR2Key: text('document_r2_key').notNull(),
  taxProfile: jsonb('tax_profile').$type<{ tin?: string; withholding?: string; country: string }>(), // sensitive; finance-only
  taxProfileSchemaVersion: smallint('tax_profile_schema_version').notNull().default(1),
  ...timestamps(),
}, (t) => [
  index('creator_agreement_user_idx').on(t.userId, t.kind),
  check('creator_agreement_royalty_chk', sql`${t.royaltyBps} is null or ${t.royaltyBps} between 0 and 10000`),
]);
```
**Changes to existing tables (migration list):**
1. `consent_kind` enum: add `honour_code`, `live_conduct`, `guardian_minor_use`, `guardian_admissions_share`, `admissions_authorship` (already proposed by 21), `ai_calibration_use` (optional consent for longer audio / calibration, distinct from existing `recording_retention`? — **decide whether to reuse `recording_retention`**), `digital_content_waiver` (EU/UK), `refund_policy_ack`, `community_rules`.
2. `consent_record`: add `policy_version_id uuid null references policy_version(id) on delete restrict` (idx), `locale app_locale`, `context text` (`signup|checkout|reaccept|exam_start|banner|guardian_flow`), `order_id uuid null references "order"(id)` (waiver per order). Keep `document_version` text for backwards compatibility until backfilled.
3. `order`: add `terms_policy_version_id` (version accepted at purchase) and `refund_policy_version_id`.
4. `attempt_session`: add `honour_code_policy_version_id` (GA-051).
5. `guardian_link`: add `consent_policy_version_id`.
6. `live_enrollment` (P2; P1 ops sheet): `conduct_policy_version_id`.
7. `user_profile`: add `current_terms_version` denormalised for the re-accept gate (optional; derived from latest `consent_record`).
8. `pii_registry.ts` (09 §13.9): register `cookie_consent_event`, `creator_agreement`, new `consent_record` columns.

**Acceptance flows:**
| Moment | What is recorded |
|---|---|
| Sign-up | `terms` + `privacy` (required, one tick box each linking to current `policy_version`), `marketing` (optional, unticked), `ai_processing` shown before first AI use |
| Under-18 | Guardian flow: `guardian_minor_use` by the Guardian (`given_by_user_id`), OTP-verified; `guardian_link.consent_method='guardian_otp'` |
| Checkout (BD) | Order stores terms/refund versions; instalment summary text acknowledged |
| Checkout (EU/UK) | `digital_content_waiver` for that `order_id` |
| Exam start (exam mode) | `honour_code` on `attempt_session` |
| Live enrolment | `live_conduct` |
| Admissions essay | `admissions_authorship` per draft |
| Material change | Banner 30 days before; `requires_reacceptance` → blocking modal on next sign-in (does **not** block export, delete account, support, or refunds); acceptance row with `context='reaccept'` |
| Non-material change | Version bumped, change log updated, no re-accept |
| Cookie choice | `cookie_consent_event` (+ `consent_record` `analytics_cookies` for logged-in) |

**Withdrawal and history:** consent withdrawal appends a row (`granted=false`); never update. Past versions remain viewable at `/legal/<kind>/v/<version>`; the changes log at `/legal/<kind>/history`. Retention: `consent_record` 5 years after last entry; `policy_version` permanent.

### 19.4 Publication mechanics
1. Text lives in `packages/content/legal/<kind>/<version>.<locale>.mdx` (frontmatter: `kind`, `version`, `effectiveAt`, `isMaterial`, `signoffId`). Variables resolve from `packages/config/legal.ts`.
2. CI job `legal:verify`: (a) hash of each MDX equals `policy_version.content_hash` seed; (b) any changed MDX **must** bump version and reference a sign-off file that exists in `docs/legal/signoffs/`; (c) footer trademark strings equal `exam.disclaimer_key` seed; (d) cookie inventory table regenerated from `cookies-manifest.ts` (names found in build) matches §3.2; (e) every `{{variable}}` resolves and no `[VERIFY]`/`[LEGAL]`/`DRAFT` marker remains in published MDX.
3. Deploy step upserts `policy_version` as `published` only if (b) passes.
4. A pre-launch **read-through** by the Support & Trust lead confirms every policy statement is operable (doc 27) — e.g. the 3-business-day refund decision, 24h safeguarding ack, 30-day DSAR.

### 19.5 Backlog additions and cross-links (IDs to be assigned by the lead)

> **Final IDs: see 12 Appendix D.** The `NEW-*` IDs in this list are source IDs only; PROGRESS.md and the build loop use the final P0/P1/P2/P3 IDs (or `BG-xx` human gates) given there. Do not rewrite this list.

| ID | Task | Owner model / human | Phase | Depends |
|---|---|---|---|---|
| NEW-26-01 | Engage counsel A/B/C + accountant; send this doc as brief; schedule review | Founder-1 | P0 | — |
| NEW-26-02 | `packages/config/legal.ts` (entity, addresses, mailboxes, grievance officer) + create role mailboxes | Haiku + Founder | P0 | entity decision |
| NEW-26-03 | Migration: `policy_version`, `cookie_consent_event`, `creator_agreement`, enum/column additions (§19.3); update 05 | Sonnet | P1 | P0 DB |
| NEW-26-04 | Acceptance-logging service + sign-up/checkout/exam-start/live hooks + re-accept gate | Sonnet | P1 | NEW-26-03 |
| NEW-26-05 | Legal MDX pipeline, `/legal/*` routes (+ `/legal/processors`, history, versions), `legal:verify` CI | Sonnet | P1 | NEW-26-03 |
| NEW-26-06 | Cookie banner + inventory generator + consent events (merge with P1-42; closes GA-019) | Sonnet | P1 | NEW-26-03 |
| NEW-26-07 | Bangla drafts + native legal-translator review | Haiku draft + human | P1 | counsel text |
| NEW-26-08 | `docs/processors.md` + public processors page + new-vendor checklist | Haiku | P1 | 09 §13.8 |
| NEW-26-09 | DPIA (AI scoring, minors' voice, tab-switch logs) + transfer assessments | Opus draft + counsel B | P1 | NEW-26-01 |
| NEW-26-10 | Submit footer/start/score layouts to ETS (trademarks@ets.org, ~10 business days) and check IELTS owners' guidance | Founder-1 | P1 | layouts |
| NEW-26-11 | Checkout consent UI: refund pre-check copy, instalment summary, intl waiver | Sonnet | P1 | L-03, 06, 07 |
| NEW-26-12 | Copy-lint for blocked phrases ("guaranteed band/score/admission", fake "was" price) | Sonnet | P1 | D12 C14 |
| NEW-26-13 | `/security`, `security.txt`, renewal reminder | Haiku | P1 | 09 §14.2 |
| NEW-26-14 | `/accessibility` + external audit decision | Haiku + human | P1/P2 | 08 |
| NEW-26-15 | Finalise creator/grader agreement templates + e-sign/PDF storage + payout-onboarding checklist | Founder-1 + counsel | P1 | NEW-26-01 |
| NEW-26-16 | Copyright complaint form + DMCA-agent registration decision | Haiku + Founder | P1 | L-34 |
| NEW-26-17 | Add "Legal gate" and "Business readiness" rows to `11` §11 and `12` before P1-54 | Opus | P0 | GA-061 |
| NEW-26-18 | Fix cross-doc conflicts X1–X11 (§19.6) in 00/03/05/07/09/02 | Opus | P0 | — |
| NEW-26-19 | New routes in 03 sitemap (§0.3) + `(marketing)` footer links | Sonnet | P1 | — |

### 19.6 Cross-document conflicts to correct (source of the X-numbers)

| X | Conflict | Where | Fix |
|---|---|---|---|
| X1 | Audio 180 d vs 90 d | `05` §4.10 table (05:2371), `07` §7.11 vs `00` D12 C6 / `09` §13.7 | Edit 05/07 to 90 d; change `purge-audio` default and `audio_delete_after` |
| X2 | Deletion cooling-off 7 d vs 14 d | `09` §13.9 step 3 vs D12 C7, `05` §7.4, `03` F-ACC-06 | Edit 09 to 14 d |
| X3 | Export link validity 7 d vs 24 h | `03` F-ACC-05 / `05` DSR (7-day URL) vs `09` §13.9 (24 h) | Pick 7 days with re-auth, or 24 h; update the other |
| X4 | Financial record retention 10 yr vs 6–7 yr | `05` §7.2 vs `09` §13.7 | Accountant decision (L-09) |
| X5 | Audit log 7 yr vs 24 mo | `05` §7.2 vs `09` §13.7 | L-09 |
| X6 | Royalty 12% vs optional 10% | `02` §8.4/A14 vs D12 C19 | Edit 02 |
| X7 | Free human review: 09 §10.4 vs 03 F-AIW-10 | | L-14 |
| X8 | `17-PRICING-MASTER.md` missing | D10 references it | **Done: 17 exists** (allowances, regions, instalments, refund examples); fill `{{17:…}}` placeholders from it |
| X9 | `guarantee_claim` not in 05 | D12 C13 | Add via `27` §19 |
| X10 | `consent_kind` and no `policy_version` | 05 | §19.3 |
| X11 | IELTS notice wording differs (03 §9.4 vs 07 §9.5) | | L-16; one string in `exam.disclaimer_key` |
| X12 | PostHog analytics "off for under-18" vs 02/20 marketing assumptions | 09 §13.4 | Remind marketing: no pixels/retargeting for under-18 |
| X13 | `03` says WhatsApp support P3 (03:1359) vs `02` §10.3/L4 P1 | | Decided in 27 §1 (P1 intake via helpdesk) |

## 20. Owners and sign-off record

**Sign-off record template** (`docs/legal/signoffs/LEG-<kind>-<version>.md`, committed with the MDX):
```
Document: <kind> <version> <locale(s)>
Content hash (sha256): …
Reviewed by: <name, firm, bar/registration no.>   Date: …
Scope of review: ☐ BD law ☐ GDPR/UK GDPR ☐ IP ☐ tax   Jurisdictions NOT reviewed: …
Open [VERIFY]/[LEGAL] items closed: <list of L-ids>   Accepted risks: <list + who accepted>
Approved for publication effective: …    Materiality: ☐ material ☐ non-material
Gate owner approval (Founder-1): …   Support & Trust read-through: …
```
**Review cadence after launch:** every policy reviewed at least annually and on any trigger: new product/tier, new processor, new market (EU/UK volume), PDPO commencement/regulations, payment-provider change, incident, regulator guidance. Owner: Gate owner; calendar reminder.

*End of 26.*
