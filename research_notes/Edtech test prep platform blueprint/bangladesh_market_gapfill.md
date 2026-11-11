# Bangladesh Market and Payment-Integration Gap-Fill (as of 2026-11-07)

Scope note: ~21 tool calls. Many items remain unresolved (bKash developer docs blocked, Google Play blocked, 10MS prices not in page text, no Nagad/ShurjoPay primary fee data). Unresolved items are listed under Gaps rather than guessed. The two first-pass notes were read; their already-covered content (onboarding docs, Finance Act, Mentors' fees, 10MS brochure, Bohubrihi subscriptions) is not repeated.

## 1. SSLCommerz: fees, integration flow, sandbox, settlement

### Takeaway
SSLCommerz's own pricing page states a flat standard rate of 2.5% for its standard channels (bKash/Nagad/Rocket/Visa/Mastercard), 3.5% for AMEX, and a BDT 25,500 one-time setup fee. The integration flow and endpoints are confirmed from the official docs. Settlement time is not on the pricing page, and a third-party directory says 5-7 business days.

### Cited Findings
- Fees: no separate bKash/Nagad/Rocket rates are listed; the standard fee applies to "all standard payment channels" (names bKash, Nagad, Rocket) = 2.5% per successful transaction; Visa/Mastercard also 2.5%; AMEX 3.5%; setup BDT 25,500 one-time, non-refundable (covers basic API integration and dashboard); annual fee not mentioned; local-card rate not stated separately — [SSLCommerz pricing](https://sslcommerz.com/pricing/)
- A third-party directory lists SSLCommerz at "2% to 2.5%" per transaction, settlement 5-7 business days, recurring tagged as supported (unverified, auto-compiled; owner-unclaimed listings may be stale) — [paymentproviders.io Bangladesh](https://paymentproviders.io/country/bd)
- Session initiation: POST to sandbox `https://sandbox.sslcommerz.com/gwprocess/v4/api.php` or live `https://securepay.sslcommerz.com/gwprocess/v4/api.php`; response contains `GatewayPageURL` for customer redirect; required fields include `total_amount` (10.00-500000.00 BDT), `currency`, `tran_id`, `success_url`, `fail_url`, `cancel_url` (each up to 255 chars) — [SSLCommerz developer docs](https://developer.sslcommerz.com/doc/v4/)
- Order Validation API: GET `.../validator/api/validationserverAPI.php` (sandbox host sandbox.sslcommerz.com; live host securepay.sslcommerz.com) with `val_id`, `store_id`, `store_passwd`, `format`; statuses VALID, VALIDATED, INVALID_TRANSACTION — [SSLCommerz developer docs](https://developer.sslcommerz.com/doc/v4/)
- IPN: SSLCommerz POSTs to a listener configured in the merchant panel; `ipn_url` parameter is optional but recommended for lost sessions; IPN statuses VALID, FAILED, CANCELLED, EXPIRED, UNATTEMPTED; validate before updating the database — [SSLCommerz developer docs](https://developer.sslcommerz.com/doc/v4/)
- Verification: compare `amount`, `currency`, `currency_type`, `currency_amount` with your records; confirm `tran_id` exists and status is valid before fulfilment; docs advise relying on validation API + IPN, not the browser redirects — [SSLCommerz developer docs](https://developer.sslcommerz.com/doc/v4/)
- `risk_level`: 1 = high risk, 0 = low risk; for high-risk transactions hold the service and collect verification documents — [SSLCommerz developer docs](https://developer.sslcommerz.com/doc/v4/)
- Transaction Query API: GET `.../validator/api/merchantTransIDvalidationAPI.php` by `sessionkey` or `tran_id` (statuses VALID, VALIDATED, PENDING, FAILED). Refund API: same endpoint with `bank_tran_id`, `refund_trans_id`, `refund_amount`, `refund_remarks`; query via `refund_ref_id`; your public IP must be registered with the live system — [SSLCommerz developer docs](https://developer.sslcommerz.com/doc/v4/)
- A sponsored article says gateways typically settle in "1 to 5 days" (no rates given; low reliability) — [nokiamob](https://nokiamob.net/2026/04/13/bkash-vs-card-payments-what-works-better-for-bangladeshi-businesses/)

### Inferences
- Budget 2.5% of gross plus VAT/other charges (not verified) for SSLCommerz; direct wallet integration may be cheaper (see section 2) but costs integration work.
- Idempotent fulfilment: grant course access only after validation API returns VALID/VALIDATED, `risk_level` = 0, and amount/currency/tran_id match; treat IPN and success-redirect as duplicate triggers.

### Gaps
- GitHub SDK review not done. Settlement time from SSLCommerz itself, and whether the quoted rate is per-method or has volume tiers, were not found.
- Whether SSLCommerz offers true recurring/tokenized card billing: only a third-party tag, not confirmed.

## 2. bKash, Nagad, aamarPay, ShurjoPay: fees and recurring billing

### Takeaway
Directory listings (not primary) put bKash at about 1.85% and Nagad at about 1.30% for merchants and aamarPay at 1.85%-2.75% with 2-3 day settlement. Primary bKash fee, API flow and refund docs could not be retrieved, so treat these numbers as indicative only.

### Cited Findings
- bKash merchant fee 1.85%, settlement "instant"; Nagad 1.30%, "instant"; aamarPay 1.85%-2.75% per plan/method, settlement 2-3 business days. Compiled from public sources by automated research, so verify with providers — [paymentproviders.io Bangladesh](https://paymentproviders.io/country/bd); [aamarPay listing](https://paymentproviders.io/providers/aamarpay.md)
- Recurring: the directory tags only SSLCommerz as recurring-capable; bKash, Nagad, aamarPay not tagged. First-pass note already found bKash "agreement" (tokenized) flow lets repeat payments need only PIN, and EPS claims recurring — [paymentproviders.io Bangladesh](https://paymentproviders.io/country/bd); [bKash PGW terms](https://www.bkash.com/page/tokenized_checkout)

### Inferences
- The fee spread (Nagad about 1.3% < bKash about 1.85% < aggregator 2.5%) suggests a hybrid: aggregator for cards, direct wallet integration for high-volume bKash/Nagad. This rests on unverified numbers.

### Gaps
- bKash Tokenized Checkout create/execute/query/refund endpoints and agreement flow: developer.bkash.com not fetched (robots block, per first pass); not re-verified.
- ShurjoPay fees and recurring support: not found. Nagad PGW primary docs/fees: not found. A Dhaka Tribune item on a 1% Bangla QR fee surfaced in search but was not read.

## 3. Competitor checkout, 10 Minute School status, prices, apps, tech stack

### Takeaway
Almost nothing was verified here. The 10MS IELTS Course page carries no price or payment-method text, only a "Payment process" video reference. Play Store and job-post data were not retrievable.

### Cited Findings
- 10MS IELTS Course page: no BDT price and no bKash/Nagad/card mention in page text; only a "Payment process" section pointing to a video — [10MS IELTS Course](https://10minuteschool.com/en/product/ielts-course)
- bKash ran a 10MS payment campaign in Oct 2025 (from first pass; body not read) — [bKash campaign](https://www.bkash.com/en/campaign/payment-10minschool-oct25)
- 10MS app ID on Google Play appears to be `com.a10minuteschool.tenminuteschool` (keyword-tracker listing; rating/installs not shown there) — [AppGoblin](https://appgoblin.info/apps/com.a10minuteschool.tenminuteschool/keywords/discovery)
- 10MS has an English Centre page and an English Foundation Programme product page listed (search results only) — [10MS English Centre](https://10minuteschool.com/english-centre)

### Inferences
- Checkout methods for Shikho, Bohubrihi, Interactive Cares, Ostad are unknown; assume bKash/Nagad/cards via an aggregator, which is untested.

### Gaps
- Checkout methods for all five platforms: not found.
- Whether 10MS resumed live/offline classes after Aug 2024: search returned irrelevant results; the English Centre page exists but its current status was not read. Unresolved.
- 10MS IELTS BDT prices (online), Google Play rating/downloads, tech-stack job posts: not found. Job search returned only unrelated listings.

## 4. Other BD players' IELTS/GRE prices

### Takeaway
No new price data was found beyond the first pass (Mentors', 10MS brochure, Bohubrihi).

### Cited Findings
- Search surfaced pages for IDP IELTS fees in Bangladesh and a Mentors' test-fee update, but they were not fetched — [IDP Bangladesh fee page](https://ielts.idp.com/bangladesh/about/ielts-exam-fee); [Mentors' fee update](https://mentors.com.bd/news/ielts-test-fee-update)

### Gaps
- British Council Bangladesh, Saifurs, Interactive Cares, Udvash-Unmesh, Ghoori Learning prices: not found. IELTS/GRE test fees in BDT: not extracted.

## 5. "collegeapp" identification

### Takeaway
No definitive match. Search results show only small or generic products, none known to be a "successful test-taker platform" in the 10MS/Magoosh class. The founder most likely meant a college-application/admissions category (Common App-style) or garbled a name.

### Cited Findings
- Entities literally named CollegeApp exist as tiny listings: a Crunchbase organization "collegeapp" (page would not load, so nothing is verified about it), a Gust company "collegeappz", and a GitHub Pages project "The College App" — [Crunchbase](https://crunchbase.com/organization/collegeapp); [Gust](https://gust.com/companies/collegeappz); [The College App](https://71north.github.io/thecollegeapp). Titles only; content unread.
- Other lookalikes in results: CollegeLeaps, College AI, Appli, Admitted (iOS apps) — [App Store: CollegeLeaps](https://apps.apple.com/us/app/collegeleaps/id1532271631). Titles only.
- Study-abroad models (Yocket, Leverage Edu) are in the first-pass note.

### Inferences
- Treat "collegeapp" as unidentified; a safe working interpretation is "college-application/study-abroad platform". Ask the founder.

### Gaps
- Monetization of any literal CollegeApp: not verified.

## 6. Digital marketing and connectivity benchmarks

### Takeaway
Late-2025 DataReportal figures: 82.8M internet users (47.0% penetration), Facebook ad reach 64.0M, TikTok 56.2M (18+), YouTube 49.8M. One practitioner blog gives BDT CPMs of 40-250 and education CPL of 40-150. Android/iOS share and BTRC data were not found.

### Cited Findings
- Population 176M, 57.8% rural, median age 26.0; internet users 82.8M (Oct 2025), 47.0% penetration; 186M cellular connections (105% of population) — [DataReportal Digital 2026: Bangladesh](https://datareportal.com/reports/digital-2026-bangladesh) (data as of Oct 2025, published 8 Nov 2025)
- Median mobile download 36.84 Mbps, fixed 60.26 Mbps (Ookla, 12 months to Aug 2025) — [DataReportal](https://datareportal.com/reports/digital-2026-bangladesh)
- Ad reach: Facebook 64.0M (63.1% male), YouTube 49.8M (+11.7% YoY), TikTok 56.2M adults 18+ (+27% YoY), Messenger 35.0M, Instagram 9.15M, LinkedIn 12.0M. These are ad-audience figures, not MAUs — [DataReportal](https://datareportal.com/reports/digital-2026-bangladesh)
- Meta CPM (BDT): broad cold 40-90, interest cold 60-150, lookalike 90-180, retargeting 120-250. CPL for education/coaching BDT 40-150 (after 4-6 weeks optimisation). Practitioner blog, Jan 2026 (table labelled "mid-2026", an inconsistency) — [Imam Hasan Tahim](https://portfolio-vcard-updated.pages.dev/blog/meta-ads-budget-bangladesh)
- H1 2026: internet subscriber growth outpaced mobile connection growth; no figures given — [MEA Tech Watch](https://meatechwatch.com/?p=56361)

### Inferences
- Median mobile speeds look healthy, but 57.8% rural and 53% offline mean adaptive bitrate with a low rung (e.g., 240p/360p) and download-for-offline are still needed (design inference, not a sourced constraint).
- Education CPL of BDT 40-150 is a lead (not a paying customer) cost; CAC depends on lead-to-paid conversion (not sourced).
- TikTok and YouTube are growing faster than Facebook.

### Gaps
- Android vs iOS share, mobile data prices/caps, BTRC subscriber totals, student-specific Facebook/YouTube usage, and a verified CAC: not found. The CPM/CPL source is a single practitioner blog.

## 7. Outbound mobility and test-taker volumes

### Takeaway
Per a Daily Star supplement, about 60,000-70,000 Bangladeshis go abroad to study annually (rough, undated figures by destination). Recent destination shocks: US F-1 refusals and Australian refusals are very high; the UK/Canada have no usable Bangladesh figures. No IELTS/GRE volume figure was found.

### Cited Findings
- Approximate annual numbers by destination: Australia about 10,000; US 9,000-10,000; UK about 4,500; Canada about 4,000; Malaysia about 4,000; "nearly 20,000" to Europe and Asia combined (Germany among leaders, no separate figure); total 60,000-70,000. Undated estimates in a supplement — [Daily Star Passport Education](https://tds-images.thedailystar.net/supplements/passport-education/news/student-migration-wave-3986146)
- US: 73% of Bangladeshi F-1 applicants refused in 2025; new Bangladeshi students down 69% in Sept 2025 vs Sept 2024 — [ICEF Monitor, June 2026](https://monitor.icef.com/2026/06/what-is-happening-to-student-mobility-flows-between-the-global-south-and-global-north/)
- Australia: about 5% rejection in 2024/25 overall, but in Feb 2026 51% of offshore Bangladeshi applicants refused; new Bangladeshi students up about 33% between 2024 and 2025 — [ICEF Monitor](https://monitor.icef.com/2026/06/what-is-happening-to-student-mobility-flows-between-the-global-south-and-global-north/) (the 5% figure's scope is unclear in my read)
- Visa refusals rising across Western and Southeast Asian destinations; several UK universities halted Bangladeshi admissions (headlines) — [Ittefaq](https://en.ittefaq.com.bd/12632/global-gates-closing-on-bangladeshis); [Bonik Barta](https://en.bonikbarta.com/bangladesh/KbGjaleJTAcvvB6K)
- IELTS: "thousands of Bangladeshis" take it each year; centres in Dhaka, Chattogram, Sylhet; 0% EMI through 32+ banks (IDP/Daily Star supplement; no count) — [Daily Star IELTS article](https://online-d11.thedailystar.net/supplements/passport-education/news/ielts-opening-doors-study-work-and-migration-3985911)

### Inferences
- The addressable audience is shifting toward Europe/Asia/Australia destinations as the US contracts, which may favour IELTS/PTE and German/Malaysian pathways over GRE; unquantified.

### Gaps
- UK Home Office/HESA, IIE Open Doors, UNESCO UIS numbers, Germany/Canada Bangladesh figures, and any IELTS/GRE test-taker count for Bangladesh: not found. The 60-70k range is undated and unexplained, so use as order-of-magnitude only.
