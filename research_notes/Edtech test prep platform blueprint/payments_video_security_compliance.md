# Payments, Video Delivery, Security Standards and Data-Protection Law for a Bangladesh Online Course / Test-Prep Platform (as of 2026-11-07)

Note on coverage: research was budget-limited. Items marked "unverified" in Gaps come from background knowledge only and were NOT confirmed by a fetched source.

## 1. Payments in Bangladesh (SSLCommerz, bKash, Nagad, Rocket, aamarPay, ShurjoPay, PortWallet, EPS)

### Takeaway
SSLCommerz, EPS, aamarPay, ShurjoPay and PortWallet are aggregators that all need Bangladesh business documents (trade licence, bank account, TIN, NID). Only EPS explicitly claims recurring/subscription support in what I fetched; bKash offers an "agreement" (tokenized) flow that lets repeat payments need only a PIN. Public fee figures are scarce (only PortWallet's were found), so fees must be obtained by quote.

### Cited Findings
- SSLCommerz onboarding for a proprietorship: updated trade licence, company bank account and cheque leaf, signatory NID and photo, TIN certificate, DBID, signed and sealed Merchant Enrollment Form (MEF), and a signed undertaking — [SSLCommerz onboarding](https://sslcommerz.com/onboarding-requirements/)
- SSLCommerz for a limited company: trade licence, incorporation certificate, MOA/AOA, Form XII, BIN/VAT certificate, bank cheque leaf, TIN, DBID, MEF; shareholders in Form XII provide NID copies — [SSLCommerz onboarding](https://sslcommerz.com/onboarding-requirements/)
- SSLCommerz product lines: Payment Gateway, Payment Invoices, Payment Links, EMI, Bangla QR; fees are on a separate pricing page and not stated in the onboarding page — [SSLCommerz onboarding](https://sslcommerz.com/onboarding-requirements/)
- SSLCommerz received a Payment System Operator licence from Bangladesh Bank — [TBS News](https://www.tbsnews.net/economy/payment-gateway-sslcommerz-gets-licence-payment-system-operator-550310); [Daily Star](https://www.thedailystar.net/business/news/sslcommerz-gets-payment-system-operator-licence-3195211) (article bodies not fetched)
- A third-party roundup lists SSLCommerz as 30+ options incl. Visa/Mastercard/Amex, DBBL Nexus, net banking, multi-currency (BDT, EUR, GBP, AUD, USD, CAD); aamarPay: bKash, Rocket, Visa, Mastercard, Amex, UnionPay but "only BDT supported"; ShurjoPay: cards and QR; PortWallet: Visa, Mastercard, bKash, Nexus — [Inai roundup](https://www.inai.io/blog/top-10-payment-gateways-in-bangladesh) (secondary source, undated)
- PortWallet published pricing per same roundup: BDT 2 per transaction (Starter) or BDT 1 (Business); setup BDT 5,000 (Starter) or 0 (Business); no annual fee — [Inai roundup](https://www.inai.io/blog/top-10-payment-gateways-in-bangladesh) (secondary; verify with PortWallet)
- EPS FAQ: supports bKash, Nagad, Rocket, Visa, Mastercard, Amex, internet banking; domestic and international collections; "recurring payment options for subscription-based" businesses; onboarding by agent contact after web form and KYC; fees and settlement not stated on page — [EPS FAQ](https://eps.com.bd/join-us/faq)
- bKash Payment Gateway (tokenized checkout) terms: agreement flow links a customer's bKash account to their ID with the merchant; later payments to that merchant need only PIN (no account number/OTP); merchant may add an extra fee depending on its arrangement with bKash; bKash is only the PSP — [bKash PGW terms](https://www.bkash.com/page/tokenized_checkout)
- bKash developer docs could not be fetched (robots disallowed), so API endpoints/flow (grant token, create agreement, create/execute payment, query, refund) are not verified here — [bKash developer docs](https://developer.bkash.com/docs/)
- bKash publicly runs a payment campaign with 10 Minute School (Oct 2025), showing 10MS accepts bKash — [bKash campaign page](https://www.bkash.com/en/campaign/payment-10minschool-oct25) (search listing only, body not fetched)
- Community plugins exist for bKash with Tutor LMS (FinersPay) and many Laravel/Node/Rust SDKs wrap bKash tokenized checkout — [FinersPay on WordPress.org](https://wordpress.org/plugins/finerspay/); [bkash-rs](https://docs.rs/crate/bkash-rs/0.2.1)

### Inferences
- A trade licence + TIN + business bank account (and for a Ltd co: RJSC docs, BIN) is the common prerequisite; the platform should register as a Ltd company or proprietorship before applying.
- Recurring billing in Bangladesh is likely best modelled as prepaid fixed-period access (e.g. 3/6/12 months) with manual renewal; bKash agreement + EPS recurring are the only candidates for auto-debit and need confirmation with the providers.
- Practical architecture: one aggregator (SSLCommerz or EPS/aamarPay) for cards+wallets, optionally direct bKash PGW to cut fees; always verify server-side via IPN/validation API before granting access.

### Gaps
- SSLCommerz fee schedule, IPN/validation API flow details, and sandbox specifics were not retrieved (pricing page not fetched). Background knowledge (unverified): sandbox at sandbox.sslcommerz.com, validation API via val_id, IPN POST callback.
- Nagad and Rocket direct merchant APIs/fees: no source found.
- ShurjoPay, aamarPay fees/recurring: not found. 10 Minute School's exact gateway(s) not verified beyond bKash campaign.
- bKash merchant fee percentage and onboarding requirements: not found.

## 2. International payments, Bangladesh Bank rules, VAT and tax

### Takeaway
Stripe and PayPal do not offer accounts to Bangladesh residents/entities; Paddle lists Bangladesh as a selling/price-conversion country and Lemon Squeezy lists Bangladesh for bank payouts, making MoR platforms the most direct route (Payoneer is a withdrawal rail). Bangladesh Bank's 30 July 2026 consolidated export circular and the 22 July 2026 freelancer easing allow service export proceeds via licensed PSPs/OPGSPs and permit retention. Imported digital services attract 15% reverse-charge VAT; non-residents with 100,000+ BD customers can create a permanent establishment.

### Cited Findings
- Stripe: Bangladesh-registered businesses cannot open accounts; PayPal has no Bangladesh site; Payoneer publishes withdrawals to bKash (min BDT 1,000) and local banks; Wise refuses USD account details to a BD address; Mercury prohibits BD residents; Lemon Squeezy supports bank payouts to Bangladesh; Paddle does not list Bangladesh as unsupported but may request extra info before releasing payments — [GlobalSolo guide 2026](https://www.globalsolo.global/blog/us-bank-account-bangladeshi-founder-getting-paid-2026.md) (secondary/blog; verify against provider docs)
- Paddle "Supported countries" table lists Bangladesh (BD) with USD auto price conversion and tax-inclusive pricing; page does not address seller/payout eligibility or fees — [Paddle docs](https://developer.paddle.com/concepts/sell/supported-countries-locales)
- Lemon Squeezy supported-countries page lists Bangladesh under bank payouts — [Lemon Squeezy docs](https://docs.lemonsqueezy.com/help/getting-started/supported-countries)
- Bangladesh Bank FEPD Circular (30 July 2026), consolidated export-trade FX rules, valid one year: covers exporters of goods and services including freelancers and e-commerce sellers; goods/services repatriation within four months; accepted channels include internet acquiring for cards, OPGSPs/licensed PSPs, digital wallets and marketplaces for service income; OPGSP receipts up to USD 10,000 per transaction; service inflows without Form-C declaration up to USD 20,000; ERQ account retention up to prescribed limit — [Bangladesh Bank circular](https://www.bb.org.bd/mediaroom/circulars/fepd/jul302026fepd-126e.pdf) (first 100k of 188k characters read)
- Daily Star (22 July 2026): ICT freelancers may retain up to 50% of export earnings in foreign currency accounts, other service exporters up to 30%; electronic evidence (platform statements, emails) accepted in place of conventional export paperwork; expands MFS/PSP access and dual-currency freelancer cards — [Daily Star](https://www.thedailystar.net/business/news/bangladesh-bank-eases-forex-rules-freelancers-4229851)
- VAT on foreign digital services: rules effective 1 July 2019, cover non-resident providers selling to Bangladeshi consumers, B2C and B2B; no fiscal representative needed; online VAT registration with NBR; automated e-learning listed among taxable digital services — [VATCalc](https://www.vatcalc.com/bangladesh/bangladesh-vat-on-foreign-digital-services/) (secondary; rate shown there as 5% reduced / 15% standard, with ambiguity)
- Finance Act 2026 (PwC): imported services remain subject to 15% reverse-charge VAT, deposited by the bank/AD at remittance via e-challan; non-resident entity with 100,000+ digital customers/subscribers in Bangladesh can create a permanent establishment; startups' supplies are VAT-exempt from 1 July 2026 and startup growth period extended to nine years with nil turnover tax; BDT 3m turnover-tax enlistment threshold continues, 4% turnover tax continues; BIN/enlistment mandatory for bank accounts, MFS merchant accounts, trade licence renewal; quarterly VAT returns default — [PwC Bangladesh Finance Act 2026](https://www.pwc.com/bd/en/assets/pdfs/budget/finance-act-2026-key-amendments.pdf)
- Same source: no separate VAT change for education services found in the Finance Act summary; "Private Institute" income-tax definition broadened to private educational/vocational/training institutions — [PwC](https://www.pwc.com/bd/en/assets/pdfs/budget/finance-act-2026-key-amendments.pdf)

### Inferences
- Selling to foreign users: MoR (Paddle/Lemon Squeezy) removes the need for the entity to register for foreign VAT/sales tax, but payout eligibility for a BD entity must be confirmed in onboarding. Proceeds must come in through a bank/AD (repatriation within four months).
- For BD users, domestic gateways bill in BDT; the platform must confirm with an accountant whether course sales fall under exempt education services, 5% ITES, or 15% standard VAT, and whether startup status (exempt from VAT from July 2026) applies.

### Gaps
- PayPal for BD merchants beyond "no Bangladesh site": no first-party source. Stripe Atlas (US LLC) viability for BD owners: only indirect evidence (Stripe reviews US LLC with BD owners case by case, per GlobalSolo); not confirmed.
- Paddle and Lemon Squeezy fee percentages (background knowledge, unverified: Paddle ~5% + $0.50; Lemon Squeezy ~5% + $0.50) — not fetched. Whether Paddle accepts BD-registered sellers: not confirmed by Paddle.
- 2Checkout/Verifone: not researched. Exact VAT rate/exemption for e-learning supplied by a local company: not confirmed.
- Tax on edtech income (corporate tax rate): not found.

## 3. Video hosting, protection and live classes

### Takeaway
Bunny Stream (cheapest, DRM $99/month + $0.003-0.005/licence), Mux ($100/month + $0.003/licence DRM) and Cloudflare Stream ($5 per 1,000 min stored, $1 per 1,000 min delivered) are the verified options. Bunny's Asia delivery is $0.03/GB on the standard network.

### Cited Findings
- Bunny Stream: $1 minimum monthly; standard encoding free; storage $0.01/GB (Frankfurt) plus $0.01 for 2nd region; delivery per GB Europe/NA $0.010, Asia & Oceania $0.030, South America $0.045, Middle East & Africa $0.060; Volume network $0.005/GB (0-500 TB); MediaCage Enterprise DRM $99/month per library plus $0.005/licence (0-20k), $0.004 (20k-100k), $0.003 (100k-500k); multi-key can bill two licences per device — [Bunny pricing](https://bunny.net/docs/stream/pricing)
- Mux: 100,000 delivery minutes/month free; delivery (Plus, first 500k tier) $0.0008/min at 720p, $0.001/min at 1080p; storage $0.0024/min/month at 720p; encoding Plus $0.025/min at 720p; Basic quality input free; DRM add-on $100/month + $0.003/licence; plans: Launch $20/month for $100 usage, Scale $500/month for $1,000 usage — [Mux pricing](https://www.mux.com/docs/pricing/video)
- Cloudflare Stream: storage $5/month per 1,000 minutes (prepaid), delivery $1 per 1,000 minutes delivered; page did not mention DRM/signed URLs — [Cloudflare Stream pricing](https://developers.cloudflare.com/stream/pricing/index.md)

### Inferences
- Rough cost: 1 hour of 720p at ~1.5 Mbps ≈ 0.68 GB; at Bunny Asia $0.03/GB ≈ $0.02/viewer-hour; Mux Plus 720p ≈ $0.048/viewer-hour; Cloudflare ≈ $0.06/viewer-hour. Bunny cheapest for delivery; DRM base fee is comparable across Bunny/Mux (~$100/month).
- Because DRM licence counts scale with plays, set per-learner device limits to bound licence costs.

### Gaps
- Not researched or not retrievable: CDN PoPs near Dhaka (Bunny/Cloudflare/CloudFront), signed URL/token auth docs, dynamic/forensic watermarking support per vendor, AWS IVS/MediaConvert/CloudFront costs, Vimeo, YouTube unlisted risks, Zoom SDK, LiveKit, Jitsi, 100ms pricing, anti-piracy practices of Indian/BD ed-tech. Background knowledge (unverified): Bunny and Cloudflare both support token-signed URLs; Bunny MediaCage Basic is token+referrer protection; Widevine/FairPlay is the Enterprise tier.

## 4. Security standards

### Takeaway
OWASP Top 10:2025 is released (adds Software Supply Chain Failures and Mishandling of Exceptional Conditions); ASVS 5.0 was released in 2025 with a rebalanced level structure; NIST SP 800-63B-4 (Aug 2025) sets 15-char minimum for password-only auth, bans composition rules and forced rotation, and requires blocklist checking.

### Cited Findings
- OWASP Top 10:2025 list: A01 Broken Access Control, A02 Security Misconfiguration, A03 Software Supply Chain Failures, A04 Cryptographic Failures, A05 Injection, A06 Insecure Design, A07 Authentication Failures, A08 Software or Data Integrity Failures, A09 Security Logging and Alerting Failures, A10 Mishandling of Exceptional Conditions — [OWASP Top 10:2025](https://top10.owasp.org/2025/)
- ASVS 5.0 (article dated 2 June 2025): first major release in six years; fully reorganised; Level 1 made easier to reach; Level 3 adds ~90 requirements beyond Level 2; password minimum 8 chars (req 6.2.1) with strong recommendation of 15, aligned to NIST 800-63B v4; new V10.4 OAuth Authorization Server chapter (16 requirements); black-box testing alone insufficient; post-quantum migration plan at L3 (11.1.4); site asvs.dev — [SoftwareMill](https://softwaremill.com/whats-new-in-asvs-5-0/)
- NIST SP 800-63B Rev. 4 (released Aug 2025): 15-char minimum when password is the only authenticator; support at least 64 chars; no arbitrary composition rules; no routine periodic expiry; mandatory screening against common/compromised passwords — [Enzoic](https://www.enzoic.com/blog/nist-sp-800-63b-rev4/) (secondary; confirm at pages.nist.gov)

### Inferences
- Target ASVS L2 for a platform handling student PII and payments; use L1 as the launch minimum.
- A03 (supply chain) justifies lockfiles, pinned versions, `npm ci`, disabling install scripts in CI, and a minimum package-age policy (Shai-Hulud-class worms).

### Gaps
- Not researched (no source): OWASP API Top 10 (2023 edition, background knowledge only), session/cookie practices, CSP, rate limiting, Cloudflare Turnstile, secrets management, Shai-Hulud details, PCI DSS SAQ A scope, audit logging, backups, encryption at rest. ASVS 5.0 exact release date and total requirement count not found.

## 5. Google sign-in

### Takeaway
For an External app requesting only openid/email/profile, any user can sign in even in Testing status (with a warning), but Testing has a 100 test-user cap and 7-day refresh-token expiry; production needs a verified brand (app name, logo, home page, privacy policy, domain ownership) and HTTPS redirect URIs.

### Cited Findings
- Testing status: only allowlisted users (hard cap 100), except apps requesting only `openid`, `email`, `profile`, where any user can access with a testing warning; 7-day refresh token expiry in Testing; Published/Unverified apps with sensitive/restricted scopes capped at 100 users and show warnings; verified apps show name/logo without warnings — [Google OAuth production readiness overview](https://developers.google.com/identity/protocols/oauth2/production-readiness/overview)
- Policy compliance: sensitive/restricted scopes need verification before production use; brand info (name, logo, home page, terms, privacy policy) must be verified, domains proven via Search Console; web clients must use HTTPS redirect URIs and JS origins; use a separate Google Cloud project for production without test URIs; public home page on an owned domain linking to a privacy policy — [Google policy compliance](https://developers.google.com/identity/protocols/oauth2/production-readiness/policy-compliance)

### Inferences
- Publish to production before launch to avoid the Testing warning, and keep to basic scopes (no restricted-scope verification).

### Gaps
- Not covered: Google Identity Services One Tap specifics, PKCE requirement details, exact redirect URI rules (localhost, wildcards), whether basic scopes still need brand verification. Background knowledge (unverified): Authorization Code + PKCE is recommended; Google ID token must be verified server-side (aud, iss, exp).

## 6. Data protection law

### Takeaway
Bangladesh's Personal Data Protection Ordinance 2025 was approved by cabinet in Oct 2025, then amended by the Personal Data Protection (Amendment) Ordinance gazetted 5 February 2026, which eased localisation to critical sectors and replaced prison terms for officers with turnover-based fines up to 5%. Commencement/transition details are inconsistent across sources, so treat the compliance date as unconfirmed.

### Cited Findings
- Cabinet approval 9 Oct 2025 (Daily Star, 21 Oct 2025): applies to entities processing personal data in Bangladesh and foreign entities handling Bangladeshi citizens' data; parental/guardian consent for children and persons unable to consent; profiling, behavioural tracking, and targeted ads aimed at minors prohibited; consent must be informed, explicit, specific, withdrawable; cross-border transfer only to recipients with "equivalent protection" (undefined); breach reporting to the National Data Governance Authority (NDGA); original draft penalties up to 7 years' prison and BDT 20 lakh; some sections to take effect 18 months after gazette — [Daily Star key takeaways](https://www.thedailystar.net/tech-startup/news/bangladeshs-personal-data-protection-ordinance-2025-key-takeaways-4015401) (pre-gazette draft, later amended)
- Amendment gazetted 5 Feb 2026: localisation limited to critical sectors such as banking and healthcare, prison terms for company officers removed, fines up to 5% of annual turnover; law is extraterritorial; NDGA still under the PM's Office; broad exemptions in Section 24 — [TBS News](https://www.tbsnews.net/node/1416106)
- Headline "Bangladesh Enforces Personal Data Protection Ordinance with Local Storage Mandate" (7 Feb 2026); article body not retrieved — [DigiBangla Tech](https://digibanglatech.news/166721). Conflicts with TBS on how broad localisation is; unresolved.
- A US industry group (CCIA) published views on the ordinance in April 2026 and a Feb 2026 report says the government is preparing a combined framework — [CCIA PDF](https://ccianet.org/wp-content/uploads/2026/04/CCIA-Views-on-Bangladeshs-Personal-Data-Protection-Ordinance.pdf); [MEA Tech Watch](https://meatechwatch.com/2026/02/10/govt-prepares-combined-legal-framework-on-data-protection-taiyeb/) (not read in full)
- A digitalpolicyalert entry refers to "Personal Data Protection Amendment Ordinance 2026 (Ordinance No. 23 of 2026)"; and another site titles it "Personal Data Protection Act, 2026", suggesting possible conversion to an Act — [Digital Policy Alert](https://digitalpolicyalert.org/event/38601-president-implemented-personal-data-protection-amendment-ordinance-2026-ordinance-no-23-of-2026); [ConsentStack](https://www.consentstack.io/regulations/bd-pdpo) (not fetched; unconfirmed)

### Inferences
- Design now for: parental consent flow for under-18 (age gate), no behavioural ads to minors, explicit consent logs, breach notification process, DPO, and data-transfer assessment for foreign processors (video CDN, MoR, analytics). Hosting student PII in Bangladesh or a Bangladesh-region replica is a low-cost hedge given conflicting reports.

### Gaps
- Cyber Security Ordinance 2025 content, exact age of "child" under the ordinance, commencement date after the amendment: not confirmed.
- GDPR applicability to EU users (background: Art. 3(2) applies when targeting EU residents), COPPA (under-13 US users), cookie consent: not researched; no sources fetched.
