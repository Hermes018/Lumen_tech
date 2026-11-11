# Global learning platforms: product, roles, dashboards, monetization, engineering (as of Nov 2026)

Research scope note: this pass used ~20 tool calls. Strong coverage: Udemy revenue share/quality rules, Coursera 10-K facts and the Coursera-Udemy merger, Duolingo Q3 2026 metrics and spaced-repetition research, Khan Academy rewrite stack, Khanmigo pricing by role. Thin or missing: edX, Brilliant, Skillshare, LinkedIn Learning, detailed role/permission matrices, dashboards, video delivery (HLS/DRM), WCAG, Open Badges. See Gaps in each section.

## 1. User roles and permissions; instructor marketplace structure

### Takeaway
Only partial role coverage was verified. Khan Academy's paid AI tier is explicitly segmented by role (teacher, learner, parent, district). Udemy's marketplace has two revenue paths (37% organic vs 97% instructor-sourced), a Quality Review Team gate, and minimum content thresholds. Coursera is a curated partner model (375+ creators) with creator pay shifting to engagement-based in 2025 and a platform fee in 2026.

### Cited Findings
- Udemy instructors get 37% of Net Amount on organic sales (no instructor coupon/referral link; includes Udemy ad clicks and marketplace browsing) and 97% when the student buys via the instructor's coupon or referral link. — [Udemy Support: Instructor revenue share](https://support.udemy.com/hc/en-us/articles/229605008)
- Udemy "Net Amount" = student payment minus taxes and fees; Apple/Google take 30% on iOS/Android sales. Co-instructor splits are allocated by the lead instructor on top of these percentages. — [Udemy Support](https://support.udemy.com/hc/en-us/articles/229605008)
- Udemy Business and subscription plans pay instructors via a separate formula (rates not on the page). Connect 1-1 sessions pay instructors 80% / Udemy 20%. Creating and hosting courses is free with no limit on the number of courses. The Revenue Report lists student name, purchase date and price. — [Udemy Support](https://support.udemy.com/hc/en-us/articles/229605008)
- Udemy minimum quality requirements: at least 30 minutes of video; at least 5 separate lectures; HD (720p or 1080p); wider-than-16:9 video is re-modified to 16:9 and poor results may be rejected; audio must play on both channels, synced and non-distracting; free courses published on/after 17 Mar 2020 must have under 2 hours of video. — [Udemy Support: course quality checklist](https://support.udemy.com/hc/en-us/articles/229604988)
- Udemy landing page requirements: course image meeting image standards, keyworded title and subtitle, description over 200 words, completed "intended learners" section, complete instructor bio and photo. — [Udemy Support](https://support.udemy.com/hc/en-us/articles/229604988)
- Udemy review: after submission the Quality Review Team gives feedback; courses must follow Trust & Safety Policy Guidelines to be published. — [Udemy Support](https://support.udemy.com/hc/en-us/articles/229604988)
- Coursera content sourcing: 375+ content creators (200+ universities, 175+ industry leaders). Creator compensation moved to learner-engagement-based in 2025 (previously enrollment-based); a platform fee on creators begins in 2026. — [Coursera FY2025 10-K](https://s27.q4cdn.com/928340662/files/doc_financials/2025/ar/COURSERA_10K_2026.pdf)
- Coursera enterprise offerings split by buyer role: Coursera for Business, for Campus, for Government (also Coursera for Teams via channel). Degrees are Consumer revenue, based on a percentage of tuition paid by enrolled students. — [Coursera FY2025 10-K](https://s27.q4cdn.com/928340662/files/doc_financials/2025/ar/COURSERA_10K_2026.pdf)
- Khanmigo is sold by role: Teachers free; Learners $4/month or $44/year; Parents/families same price and can add children, view children's interaction history and receive moderation alerts; Districts by quote with rostering, SSO (Clever SecureSync, ClassLink), district/school data and a customer success manager. — [Khanmigo pricing](https://khanmigo.ai/pricing)
- Market structure changed in 2026: Coursera and Udemy signed a merger Dec 17, 2025 (0.800 Coursera shares per Udemy share; Udemy survives as a wholly owned subsidiary; $40.5M termination fee in specified cases). A June 3, 2026 article reports Udemy has officially joined Coursera, citing a combined ecosystem of 95,000 content creators. — [Coursera 10-K](https://s27.q4cdn.com/928340662/files/doc_financials/2025/ar/COURSERA_10K_2026.pdf); [Built In](https://builtin.com/articles/udemy-coursera-combination-20260603)

### Inferences
- A buildable role model: learner, instructor/creator, co-instructor (revenue-split recipient), reviewer (quality gate before publish), org admin (rostering/SSO/data), parent (child linking, activity view, alerts), plus internal support and super admin. Only the parent, teacher, district and quality-reviewer roles are directly evidenced here; the rest are inferred from standard marketplace design.
- Two-tier revenue share (high when instructor brings the buyer, low when platform does) is a concrete, copyable incentive design; net-of-app-store-fee accounting should be built in from the start.
- Udemy's published minimums (30 min, 5 lectures, 720p) are a usable template for an instructor approval checklist.
- Post-merger Udemy rules (37/97) may change; verify before citing as current policy in the final report. I did not find post-merger instructor terms.

### Gaps
- Udemy payout schedule, minimums, methods (PayPal/Payoneer), tax handling, refund clawbacks: the revenue-share page does not cover them; not verified.
- Udemy Q&A moderation, TA role, review/rating moderation, support permissions: not found.
- Coursera course roles (instructor, course staff, TA, mentor), edX, Skillshare, LinkedIn Learning, Brilliant, Duolingo roles (Duolingo for Schools teacher accounts): not researched.
- Khan Academy teacher/class/coach permission model beyond the pricing page: not verified.
- Skillshare/LinkedIn Learning creator payment models: not researched.

## 2. Dashboards (learner, instructor, admin) and personalization

### Takeaway
Not directly researched; only incidental evidence on personalization from Duolingo and Khanmigo's parent/teacher visibility features.

### Cited Findings
- Duolingo's student model tracks per-word statistics (times seen, times recalled), described as a database with billions of entries updated about 3,000 times per second; strength meters and "practice weak skills" use model predictions to decide what to review and when. — [Duolingo blog: How we learn how you learn](https://blog.duolingo.com/how-we-learn-how-you-learn)
- Khanmigo teacher features: on-demand summaries of student work and access to chat history; district plan adds district and school data; parent plan shows children's interaction history and moderation alerts. — [Khanmigo pricing](https://khanmigo.ai/pricing)
- Udemy instructors have a Revenue Report with per-sale lines (student name, purchase date, price paid). — [Udemy Support](https://support.udemy.com/hc/en-us/articles/229605008)

### Inferences
- A parent/teacher dashboard should expose activity history plus safety/moderation alerts if an AI tutor is offered to minors.
- Learner "continue learning", streak, goals and recommendation widgets are common across these products but I did not verify layouts from sources; treat as design assumptions.

### Gaps
- Learner dashboard layouts (Coursera, Udemy "My learning", Khan "Courses" and mastery views), instructor analytics (Udemy Performance/Insights, Q&A, reviews), admin/org dashboards (Udemy Business, Coursera for Business): not researched.
- "Dynamic dashboard" personalization mechanics: not found.

## 3. Learning design

### Takeaway
Duolingo's retention engine is built on a spaced-repetition model (half-life regression, shown to lift retention in A/B tests) and is now expanding AI speaking features. Khan Academy mastery and Brilliant/Coursera/Udemy course structure were not verified from primary sources.

### Cited Findings
- Duolingo launched in 2012 with a Leitner-style strength meter, later replaced by half-life regression (HLR), which predicts a word's memory half-life from weighted features of learning history on an exponential forgetting curve. Weights are learned by minimizing loss over all students' practice sessions. — [Duolingo blog](https://blog.duolingo.com/how-we-learn-how-you-learn)
- HLR evaluation used 12M+ practice sessions; error was nearly half that of Leitner; A/B tests showed daily retention +9.5% (practice sessions), +1.7% (lessons) and +12% (overall activity). — [Duolingo blog](https://blog.duolingo.com/how-we-learn-how-you-learn)
- Duolingo Q3 2026 product items: Video Call (AI conversation practice) becomes unlimited for Super subscribers, with full availability planned by end of 2026; share of exercises answerable by speaking has doubled since start of 2026; "Avatar Collections" (collect puzzle pieces to unlock outfits) debuted. — [Duolingo Q3 2026 shareholder letter](https://www.sec.gov/Archives/edgar/data/0001562088/000162828026069474/q3fy26duolingo9-30x26share.htm)
- Coursera learning products: courses, Guided Projects, Specializations, Professional Certificates, degrees; Coursera Labs tools include Python, Jupyter Notebooks, VS Code, R-Studio. 2025: 54.4M course enrollments (+10%), 6.0M Professional Certificate enrollments (+22%). — [Coursera FY2025 10-K](https://s27.q4cdn.com/928340662/files/doc_financials/2025/ar/COURSERA_10K_2026.pdf)
- Khanmigo capabilities: personalized tutoring on Khan content, guided writing and debate practice, career coaching, real-time coding feedback, college admissions coaching; teacher tools for lesson planning, rubrics, exit tickets. — [Khanmigo pricing](https://khanmigo.ai/pricing)

### Inferences
- Embedding labs (Jupyter/VS Code) directly in courses is an evidenced differentiator for ML/AI/database content; a new platform hosting ML/database courses should plan for browser-based notebooks/SQL sandboxes.
- A spaced-repetition scheduler (even simple Leitner, then a half-life model) is a proven, citable retention lever for test-prep question banks.

### Gaps
- Khan Academy mastery levels (Attempted/Familiar/Proficient/Mastered), unit tests, course mastery: not retrieved.
- Duolingo streaks, XP, leagues mechanics and any streak statistics; Birdbrain: not verified (the blog fetched does not mention Birdbrain).
- Brilliant interactive problems; Udemy lecture/quiz/assignment/notes/captions structure and supported file formats (only video spec above); Coursera specialization/degree structure details: not verified.

## 4. Monetization and public financials

### Takeaway
Subscriptions dominate: Duolingo has 13.1M paid subscribers and ~$1.22B FY2026 revenue guidance; Coursera has 197M registered learners, Consumer + Enterprise segments, and Coursera Plus at $399/year list. Khan Academy monetizes AI by role with teachers free.

### Cited Findings
- Duolingo Q3 2026: DAUs 64.9M (+29%), MAUs 153.1M (+13%), paid subscribers 13.1M (+14%), revenue $309.0M (+14%), total bookings $316.1M (+12%), subscription bookings $278.4M (+16%), adjusted EBITDA $78.7M (25.5% margin), gross margin 72.9%. — [Duolingo Q3 2026 letter](https://www.sec.gov/Archives/edgar/data/0001562088/000162828026069474/q3fy26duolingo9-30x26share.htm)
- Duolingo FY2026 guidance: bookings $1,296M (+12%), revenue $1,221M (+18%), adj. EBITDA $323M. Q4 guidance: bookings $382M, revenue $322M. AI rollout expected to lower Q4 gross margin to 72.0%. — [Duolingo Q3 2026 letter](https://www.sec.gov/Archives/edgar/data/0001562088/000162828026069474/q3fy26duolingo9-30x26share.htm)
- Duolingo tiers: the Max tier is being sunset (new Max sales stop in Nov 2026; individual Max subscribers move to a Super family plan at the same price; legacy Max family plans addressed in 2027). Super gets unlimited Video Call. — [Duolingo Q3 2026 letter](https://www.sec.gov/Archives/edgar/data/0001562088/000162828026069474/q3fy26duolingo9-30x26share.htm)
- Coursera FY2025 10-K: about 197M registered learners at 31 Dec 2025 across 230+ countries/territories; ~49% of revenue from outside the U.S.; 1,700+ paid enterprise customers; 22 issued patents; R&D concentrated in U.S., Canada, India. The excerpt retrieved did not include total revenue. — [Coursera FY2025 10-K](https://s27.q4cdn.com/928340662/files/doc_financials/2025/ar/COURSERA_10K_2026.pdf)
- Coursera Plus: subscription (monthly or annual) covering 13,500+ courses, Guided Projects, Specializations and Professional Certificates per the 10-K; the Nov 2026 offer page says "10,000+" and excludes degrees and MasterTrack. — [10-K](https://s27.q4cdn.com/928340662/files/doc_financials/2025/ar/COURSERA_10K_2026.pdf); [Coursera Plus page](https://www.coursera.org/courseraplus/special/cplus-annual-november-2026-global) (course-count figures differ between the two sources)
- Coursera Plus price: $399/year regular, $239.40 for first year in a Nov 2026 promotion (ends Nov 30, 2026; not available in Australia, GB, India); auto-renews at $399; 14-day money-back guarantee; monthly option with 7-day trial; individual courses/programs $49-$79/month. — [Coursera Plus page](https://www.coursera.org/courseraplus/special/cplus-annual-november-2026-global)
- Coursera Plus certificate rule: unlimited certificates; certificates earned in the 14-day refund window are revoked if refunded. — [Coursera Plus page](https://www.coursera.org/courseraplus/special/cplus-annual-november-2026-global)
- Khanmigo: Learners/parents $4/month or $44/year; teachers free; districts by quote. — [Khanmigo pricing](https://khanmigo.ai/pricing)

### Inferences
- Pattern: free teacher/creator tier to drive adoption + paid learner subscription + institution contracts (rostering/SSO/data) is the common three-lane model.
- Revoking certificates on refund is a concrete policy to copy to prevent subscription abuse.
- Duolingo's AI features carry a measurable gross-margin cost (about 0.9 point drop guided), relevant to pricing any AI tutor.

### Gaps
- Coursera total FY2025 revenue and segment split, Coursera Plus subscriber count: not retrieved (10-K excerpt truncated; press-release fetch returned empty).
- Udemy Personal Plan price and current per-course pricing, Udemy Business pricing, Udemy last standalone annual revenue: not retrieved.
- Duolingo Super/Max prices; Brilliant, Skillshare, LinkedIn Learning, edX pricing; Khan Academy donation/revenue figures; Coursera for Business pricing: not retrieved.

## 5. Engineering and accessibility

### Takeaway
Khan Academy's rewrite is the best-documented pattern: Python 2 monolith to ~26 Go services behind an Apollo Federation GraphQL gateway. Duolingo has published a Scala rewrite of its engine (not fetched). Video delivery, search, recommendations and WCAG practices were not covered.

### Cited Findings
- Khan Academy "Goliath": project began with an ADR in March 2019 to move from a Python 2 monolith to Go services; first simple service handled production traffic behind graphql-gateway in late 2019; main porting in 2020; result was over half a million lines of Go and about 26 services. — [Khan Academy: Technical choices behind a successful rewrite project](https://blog.khanacademy.org/technical-choices-behind-a-successful-rewrite-project/)
- Stack choices: services expose data only through GraphQL, a graphql-gateway using Apollo Federation combines services, gqlgen as the Go GraphQL library, and genqlient (built by Khan) as type-safe client for service-to-service calls; Google Cloud Datastore models converted to Go via a custom tool; golangci-lint for linting; original system ran on Google App Engine (Python 2). — [Khan Academy blog](https://blog.khanacademy.org/technical-choices-behind-a-successful-rewrite-project/)
- Related Khan posts surfaced in search: "Incremental Rewrites with GraphQL" (https://blog.khanacademy.org/incremental-rewrites-with-graphql) and "Go + Services = One Goliath Project" (https://blog.khanacademy.org/go-services-one-goliath-project); not fetched.
- Coursera: production runs in an unnamed cloud environment with scalable storage and elastic compute; R&D in U.S., Canada, India. — [Coursera FY2025 10-K](https://s27.q4cdn.com/928340662/files/doc_financials/2025/ar/COURSERA_10K_2026.pdf)
- Duolingo's learner model stores per-word stats in a database with billions of entries updated ~3,000 times/second. — [Duolingo blog](https://blog.duolingo.com/how-we-learn-how-you-learn)
- Duolingo engine rewrite in Scala: post titled "Rewriting Duolingo's engine in Scala" exists at https://blog.duolingo.com/rewriting-duolingos-engine-in-scala (title seen in search only; content not verified, and this may be dated).

### Inferences
- For a new platform: incremental strangler-style migration behind a GraphQL gateway is documented to work, but a new build can start with a modular monolith and add a gateway later; this is a judgment, not a sourced claim.

### Gaps
- Video delivery (HLS/CDN/DRM), search, recommendations, notifications, mobile app stacks, Udemy and current Coursera/Duolingo stacks, Khan's Kotlin and frontend: not verified.
- WCAG/accessibility practices of any platform: not researched.

## 6. Certificates and verification

### Takeaway
Only Coursera's certificate policy was verified, and only from its Plus page.

### Cited Findings
- Coursera issues a certificate per course, Project, Specialization or Professional Certificate; certificates can be added to LinkedIn and resumes or shared with employers; certificates earned within a refunded 14-day window are revoked. — [Coursera Plus page](https://www.coursera.org/courseraplus/special/cplus-annual-november-2026-global)
- Search surfaced Coursera blog posts on adding accomplishments to LinkedIn and on verified certificates and academic integrity (https://blog.coursera.org/add-coursera-accomplishments-to-your-linkedin, https://blog.coursera.org/verified-certificates-ensure-academic-integrity); not fetched.

### Inferences
- Revocable certificates imply a server-side verification record behind a public URL; this is an inference, not confirmed.

### Gaps
- Shareable verification URL structure, LinkedIn "Add to profile" parameters, Open Badges/verifiable credentials (Credly, 1EdTech OB 3.0) usage by any platform, Udemy/LinkedIn Learning/edX certificate verification: not researched.
