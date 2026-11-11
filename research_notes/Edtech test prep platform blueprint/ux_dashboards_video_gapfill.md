# UX dashboards, content types, video/live delivery, credentials, gamification: gap-fill (as of 2026-11-07)

Scope: fills gaps left by global_learning_platforms.md and payments_video_security_compliance.md (video/live). ~35 tool calls used; several questions remain thin (see Gaps). Only facts from fetched pages are listed as cited; search-result-only titles are flagged.

## 1. Dashboards and personalisation (Khan, Duolingo, Udemy, Magoosh; Coursera/Brilliant not covered)

### Takeaway
Khan Academy has the most precisely documented model: five skill levels, 100 points per skill, and course mastery % = share of skills at Proficient or Mastered. Duolingo's mechanics are published piecemeal (streak + 2 freezes, 10 weekly league tiers, Energy replacing Hearts). Udemy's instructor dashboard is organised as Courses / Performance / Insights / Communications / Reports. Magoosh's score predictor is a regression of practice performance onto self-reported real scores.

### Cited Findings
- Khan skill levels: Not Started, Attempted, Familiar, Proficient, Mastered. — [Khan support: mastery levels](https://support.khanacademy.org/hc/en-us/articles/5548760867853--How-do-Khan-Academy-s-Mastery-levels-work)
- Khan points: each skill is worth 100 Mastery Points (Familiar 50, Proficient 80, Mastered 100). Attempted = first attempt below 70% (or drop below 70%, or missing all of a skill's questions on a quiz/test/challenge). Familiar = 70-85% on an exercise, or all questions right on a quiz/test/challenge. Proficient = from Familiar, every question right on an exercise/quiz/test/challenge. Mastered = from Proficient, every question right on a Unit Test or Course Challenge. A perfect first attempt can jump straight to Proficient. A Mastered skill drops to Familiar if a student scores below 70% on an exercise. — [Khan support: self-paced Mastery](https://support.khanacademy.org/hc/en-us/articles/360007253831-What-is-self-paced-Mastery)
- Khan course/unit display: course pages show percent of course mastered and fraction of total mastery points; the Course Challenge at the bottom samples skills across the whole course; unit pages show total points available (example: 1,900 for 19 skills) and each skill's level. Teachers get per-student practice data and can assign content; student-paced practice lets each student work on what fits them. — [Khan support](https://support.khanacademy.org/hc/en-us/articles/360007253831-What-is-self-paced-Mastery)
- Khan mastery percentage (current help article): share of skills in a course/unit at Proficient or Mastered (e.g. 5 of 20 = 25%); Not started/Attempted/Familiar do not count; levels can drop so the percentage can fall; "Khan Academy Reimagined" shows "X of Y skills to Proficient" counting both Proficient and Mastered. — [Khan support: mastery percentage](https://support.khanacademy.org/hc/en-us/articles/48411237993357-How-is-my-mastery-percentage-calculated)
- Duolingo streak: counts consecutive days with a completed lesson; as of Jan 2022 over 6M learners had streaks of 7+ days. Streak Freeze pauses the streak for one day, up to two can be equipped; allowing two raised relative daily active learners by +0.38% without more days off. Milestone/streak-extension animations raised new-learner 7-day-later activity by 1.7%. Learners reaching a 7-day streak are 3.6x more likely to complete their course (correlational). — [Duolingo blog: how the streak builds habit](https://blog.duolingo.com/how-duolingo-streak-builds-habit)
- Duolingo leagues: 10 leagues (up from 5), top is Diamond; new weekly league every Sunday (learner's timezone); move up/down by study effort; grouped with learners of similar study habits and similar time zone (any course); Diamond Tournament for top 10 Diamond learners (quarterfinal, semifinal, final), not weekly. Promotion thresholds and group size not stated. — [Duolingo blog: leagues](https://blog.duolingo.com/duolingo-leagues-leaderboards/)
- Duolingo Energy replaces Hearts: hearts cost 1 per mistake for free learners; Energy costs a small amount per lesson, reviewing mistakes at the end is free, earned back by several correct answers in a row, perfect lessons, adding a friend, reward chests; starts full, fully recharges in about a day, or watch a rewarded ad / buy refill with gems. Rationale given: beginners were 2x more likely to run out of hearts mid-lesson; Duolingo says more learners complete lessons, especially newer/less engaged. — [Duolingo blog: Energy](https://blog.duolingo.com/duolingo-energy/)
- Udemy instructor dashboard structure: Courses (enrollments, ratings, monthly earnings per course); Performance with Overview (revenue, enrollments, ratings, split Udemy Business vs Marketplace), Students (learner location map, languages, topic interests), Reviews (respond, filter unanswered, Review Insights), Engagement (minutes taught, mobile vs desktop, bookmarked and dropped lectures, coding exercise and practice test insights, landing-page traffic and conversion); Insights (Business Content Opportunities, needs 4.2+ average rating; Marketplace Insights demand); Communications (messages to learners, AI Assistant Insights, Q&A dashboard with Q&A Insights); Revenue Report, coupon performance, Payout Report, test-video and bulk-coupon tools. — [Udemy Teach: using your dashboard](https://teach.udemy.com/publishing/using-your-dashboard/)
- Magoosh score predictor (GRE dashboard): compares students' practice performance with actual GRE scores collected via post-exam surveys, uses the correlation to predict; inputs are number and difficulty of practice questions answered; "most accurate when you answer a lot of questions"; don't reset stats. — [Magoosh help](https://magoosh.zendesk.com/hc/en-us/articles/203445619-How-does-the-GRE-Score-Predictor-feature-on-the-Dashboard-work-Is-it-accurate)
- Duolingo personalisation basis (from first-pass notes): HLR half-life model for what to review — see [Duolingo blog](https://blog.duolingo.com/how-we-learn-how-you-learn).

### Inferences
- A test-prep dashboard can copy Khan's model directly: per-skill level with fixed points, course % = skills at Proficient+, and a "Mastered only via unit test/course challenge" gate to make the top level meaningful.
- Magoosh's predictor needs a labelled dataset (post-exam score surveys). A new platform has none at launch; start with a transparent heuristic (accuracy weighted by difficulty, with a confidence band) and collect self-reported results to calibrate. This is a judgment.
- Udemy's instructor "dropped lectures" and "bookmarked lectures" are cheap engagement signals worth logging from day one.

### Gaps
- Coursera learner home (deadlines, weekly goals), Brilliant, Manhattan Prep dashboards, Magoosh study-schedule and accuracy-by-topic widgets (only seen as search-result titles), Duolingo XP/quests/friend quests detail (search surfaced blog.duolingo.com/friends-quests but not fetched), Khan teacher/parent dashboard layouts, Udemy "My learning" layout, Udemy quality checklist beyond first-pass notes: not retrieved.
- Next-best-lesson / adaptive recommendation mechanics for Khan, Coursera, Udemy: no source found.

## 2. Course structure, content types, video player expectations

### Takeaway
Udemy's player is the best-documented reference for player features: timestamped notes (1,000 chars), speed, quality, captions with style options, searchable-looking transcript panel with sentence highlight, Q&A, announcements, resources, completion checkbox, keyboard shortcuts, AI assistant. Khan's content sequence ends in Unit Tests and a Course Challenge.

### Cited Findings
- Udemy player features: timestamped Notes (up to 1,000 chars, filter by lecture/timestamp, edit/delete; shortcut B); playback speed; video quality via settings; closed captions with language choice, font size and background opacity; transcript panel on right that highlights current sentence and auto-scrolls; Q&A (browse, ask, follow threads, message instructor, not on mobile app); announcement email toggle; resources (folder icon beside a lecture for files/links); mark lecture complete via checkbox (assignments cannot be unmarked); keyboard shortcuts (Space play/pause, M mute); autoplay setting; Udemy AI Assistant in the new experience; lecture downloads for computers only in the default experience when enabled. — [Udemy support: course player section](https://support.udemy.com/hc/en-us/sections/206457187-Course-player)
- Khan content ladder: exercises, quizzes, Unit Tests, Course Challenge (samples across the course) — [Khan support](https://support.khanacademy.org/hc/en-us/articles/360007253831-What-is-self-paced-Mastery)
- Udemy minimum course thresholds, Coursera Labs and course/Specialization structure: see first-pass notes (global_learning_platforms.md).

### Inferences
- Minimum viable player for exam learners: speed (0.5x-2x), captions + searchable transcript, resume position, timestamped notes, completion tracking, quality selector, keyboard shortcuts. Chapters and offline download are expected from apps but were not verified here.

### Gaps
- Udemy lecture types list (video/article/quiz/coding exercise/assignment/practice test) and Coursera module/peer-review/graded-quiz structure: not fetched. Transcript text search, chapters, resume-position and offline-download specifics for Udemy/Coursera/Khan apps: not verified.

## 3. Mock-test UX in prep platforms

### Takeaway
Only ETS POWERPREP was checked, and its page is thin. Most of the requested features (navigator, mark-for-review, review screen, per-question time, post-test explanation video) are unverified.

### Cited Findings
- POWERPREP: PLUS (paid, $44.95 per test) "simulates the real GRE exam", gives instant scoring, detailed score reports, and explanations for all question types; free POWERPREP 1 is untimed and POWERPREP 2 is timed; free tests give a summary report and correct answers for Verbal/Quant; PLUS users can navigate freely between questions and change answers within sections. The page does not mention mark-for-review. — [ETS POWERPREP](https://www.ets.org/gre/test-takers/general-test/prepare/powerprep.html)

### Inferences
- The tiering (free untimed + free timed + paid with explanations/reports) is a copyable funnel for mock tests.

### Gaps
- Magoosh/Manhattan Prep/IELTS-on-computer mock UX (timer display, navigator grid, flag, review screen, per-question time analytics): not retrieved. Search only returned ETS strategy pages and a PrepScholar post, not read.

## 4. Certificates and credentials

### Takeaway
LinkedIn's Add-to-Profile is a plain URL with documented query parameters. Open Badges 3.0 is built on W3C Verifiable Credentials 2.0 (a W3C Recommendation since 15 May 2025). Coursera/Udemy verification URL formats were not retrieved.

### Cited Findings
- LinkedIn Add to Profile certification URL: base `https://www.linkedin.com/profile/add` with `startTask=CERTIFICATION_NAME`; optional params `name`, `organizationId` (if the org has a LinkedIn page) or `organizationName` (if not; never both), `issueYear`, `issueMonth`, `expirationYear`, `expirationMonth`, `certUrl` (URL-encoded credential URL), `certId`. — [LinkedIn Add to Profile](https://addtoprofile.linkedin.com/)
- Open Badges 3.0 (1EdTech): an OpenBadgeCredential is digitally signed by the issuer as a Verifiable Credential compatible with W3C VC Data Model 2.0; supports CLR (ClrCredential) bundles; EndorsementCredential for third-party endorsement; Badge Connect API for transfer (OAuth 2.0); presented as JSON/JSON-LD; optional visual token (PNG/SVG); 2.0 and 2.1 still documented. — [1EdTech Open Badges](https://www.1edtech.org/standards/open-badges)
- W3C VC Data Model 2.0 is a W3C Recommendation dated 15 May 2025. Roles: issuer, holder, verifier. Must be secured by at least one mechanism: Data Integrity (embedded proof; cryptosuites such as ecdsa-rdfc-2019, ecdsa-sd-2023, bbs-2023) or JOSE/COSE (e.g. JWT, SD-JWT). `credentialStatus` exists (example `BitstringStatusListEntry`). — [W3C VC Data Model 2.0](https://www.w3.org/TR/vc-data-model-2.0/)

### Inferences
- Minimum viable certificate: unique ID + public verify page (`/verify/{certId}`) showing name, course, date, status (valid/revoked), plus an Add-to-LinkedIn link using certUrl/certId. OB 3.0 JSON export can be added later; revocation maps to credentialStatus.

### Gaps
- Coursera/Udemy verification URL structure: not retrieved (first-pass notes listed Coursera blog URLs only). Whether LinkedIn's `profile/add` format is still current in late 2026: the page fetched is the only source.

## 5. Video and live delivery

### Takeaway
Bunny, Mux and Cloudflare all support server-signed playback, with different strength: Bunny SHA256 token+expires (embed) with DRM using the same params; Mux RS256 JWT with referrer/user-agent restrictions and DRM audience; Cloudflare RS256 signed tokens with IP/country rules (max 24h expiry). Bunny MediaCage Enterprise (Widevine/FairPlay, $99/month) is the only tier with screen-grab protection and native-app support, and screen capture cannot be fully blocked on Widevine L3. Live: LiveKit, 100ms and Zoom Video SDK all have published per-minute prices.

### Cited Findings
- Bunny embed token auth: when enabled each embed request needs `token` and `expires` (UNIX seconds). Token = hex SHA256 of token security key + video ID + expiration, concatenated in that order. Key is on library Security page and differs from the API key. DRM license URLs use the same token/expires. Generate server-side. Page says nothing on referrer restriction or IP binding. — [Bunny docs: token authentication](https://bunny.net/docs/stream/token-authentication.md)
- Bunny MediaCage: Basic = browser support, dynamic clear-key encryption, download protection, unique content key per play session; no native platform support, no screen-grab protection, no custom player support. Enterprise = Widevine (Chrome, Edge, Firefox, Android) and FairPlay (Safari, iOS), hardware-backed key exchange, native platform support, custom player support, screen-grab protection (not on Widevine L3); L3 devices limited to 480p; $99/month + per-license fee. Page does not cover watermarking or offline playback. — [Bunny docs: DRM](https://bunny.net/docs/stream/drm.md)
- Bunny network size: page states "119+ PoPs" but regional table sums to 105 (Africa 7, Asia 24, Europe 34, North America 20, Oceania 6, South America 14); Dhaka, Mumbai and Singapore are not named on that page. — [Bunny docs: regions](https://bunny.net/docs/cdn/regions.md) (inconsistency noted)
- Mux signed playback: RS256 JWT; claims `sub` (playback ID), `aud` (v video/captions, t thumbnail, g GIF, s storyboard, d DRM license), `exp`, `kid`, optional `playback_restriction_id`; signing keys are separate from API keys; expiry must exceed asset/live duration or playback stops mid-stream; referrer allowlist up to 100 domains with wildcards (native apps and some Apple devices send no referrer, so `allow_no_referrer` is a risk trade-off); user-agent validation; Chromecast needs www.gstatic.com and AirPlay needs mediaservices.cdn-apple.com allowed. — [Mux docs: secure video playback](https://www.mux.com/docs/guides/secure-video-playback)
- Cloudflare Stream: set `requireSignedURLs: true`; tokens via `/token` endpoint (about under 1,000/day, 1h default expiry, no Live WebRTC), Workers binding, or locally signed with a signing key (recommended at scale, up to 1,000 keys; revoking a key invalidates its tokens); RS256; `exp` max 24 h; `nbf`; `downloadable`; up to 5 `accessRules` (ip.src, ip.geoip.country, any; allow/block); `allowedOrigins` hotlink protection (wildcard subdomain rules). — [Cloudflare Stream docs](https://developers.cloudflare.com/stream/viewing-videos/securing-your-stream/)
- LiveKit Cloud plans: Build $0, Ship from $50/mo, Scale from $500/mo, Enterprise custom. WebRTC minutes included 5,000 / 150,000 / 1.5M; overage $0.0005/min (Ship), $0.0004/min (Scale). Concurrent participants 100 / 1,000 / 5,000. Downstream bandwidth included 50 GB / 250 GB / 3 TB; overage $0.12/GB (Ship), $0.10/GB (Scale). Track egress $0.001/min (Ship, Scale); 600 / 8,000 minutes included; transcode (e.g. composite recording/RTMP) $0.02/min video (Ship), $0.015/min (Scale), included 600 / 8,000; concurrent exports 2 / 100 / 500; cloud storage export "coming soon" on Ship/Scale (S3 via Assume Role on Enterprise). Scale adds role-based access, region pinning, HIPAA. — [LiveKit pricing](https://livekit.com/pricing) and [LiveKit pricing.md](https://livekit.com/pricing.md)
- 100ms pricing: free monthly 10,000 conferencing min, 10,000 live streaming min, 300 recording min; pay-as-you-go conferencing $0.004/min per participant, live streaming $0.0012/min per viewer, recording $0.0135/min, RTMP out $0.04/min, encoding $0.04/min; audio-only 75% off; page's calculator shows an unexplained inconsistency on the free conferencing line. — [100ms pricing](https://www.100ms.live/pricing)
- Zoom Video SDK pay-as-you-go: 10,000 free minutes/month, then $0.0035/min per participant-minute (5 users x 10 min = 50 min, rounded up per participant); cloud recording/storage pricing not on the page (a Zoom dev-forum thread on upgrading a free account for cloud recording exists but was not read). — [Zoom Video SDK rates](https://explore.zoom.us/docs/en-us/video-sdk-rates.html)
- YouTube embedding: uploader can disable embedding in Studio; age-restricted videos generally do not play on third-party sites (redirect to YouTube); embeds must send an HTTP Referer or show error 153; child-directed sites must self-designate (disables some features/personalised ads); privacy-enhanced mode (youtube-nocookie.com) is websites only, apps should use a WebView. Private/unlisted/live embed rules are not covered by the page. — [YouTube Help: embed videos](https://support.google.com/youtube/answer/171780?hl=en)
- Anti-piracy practice in Indian ed-tech (vendor claims): Learnyst describes DRM on by default (content cannot play outside its player; blocks unapproved screens/mirroring and screen recorders such as Bandicam and OBS), a permanent dynamic watermark showing student username, email or phone number at various screen positions to trace leaks, one desktop + one mobile device per student with automatic logout on other devices, admin-controlled device-reset, and generally recommends IP/multi-device login monitoring. — [Learnyst blog](https://blog.learnyst.com/protect-your-upsc-study-material-from-piracy-secure-lms-features-you-need) (vendor marketing; effectiveness unverified)
- Other piracy-vendor pages surfaced by search but not read: VdoCipher, PallyCon India pain points, Gumlet, Kinescope.

### Inferences
- Cost sketch (using first-pass Bunny Asia $0.03/GB and 0.68 GB/hour 720p): ~$0.02 per viewer-hour; DRM adds $99/month fixed. For a launch, Bunny token auth (cheap, anti-hotlink) plus per-user dynamic watermark overlay in the player (phone number drifting position) deters casual sharing; Enterprise DRM is justified once piracy is observed or for premium courses.
- Because Widevine L3 cannot prevent screen capture, "screen-record blocking" on Android/iOS apps relies on OS flags (e.g. FLAG_SECURE) and FairPlay/L1, not the web; web deterrence is watermark + device limits + account-sharing detection.
- LiveKit Ship ($50/mo) covers a classroom: 1,000 concurrent participants and 150k WebRTC minutes; a 100-student, 1-hour class = 6,000 participant-minutes. Video-bandwidth overage ($0.12/GB) is the likely larger cost for video-heavy classes than the minutes, so model bandwidth per hour. Judgment, not sourced.
- For large one-to-many classes, 100ms live streaming at $0.0012/min/viewer is cheaper than conferencing at $0.004/min; a hybrid (interactive tutors, HLS viewers) lowers cost.

### Gaps
- Bunny PoPs in Dhaka/Mumbai/Singapore: not confirmed (docs page lists only continent counts; search surfaced netify pages for Bunny in Bangladesh/India/Singapore, not read).
- Bunny dynamic watermark / forensic watermark support: no source found. Mux DRM guide, Cloudflare Stream DRM/offline: not read. Mux and Cloudflare PoPs near Dhaka: not researched.
- Jitsi self-host requirements and recording (Jibri) costs: not researched. LiveKit egress docs (room composite, HLS output) read only via pricing page. Zoom Video SDK recording price: not found.
- Quantified Indian/BD piracy losses and BD-specific practices (10 Minute School, Shikho): not retrieved; the VdoCipher press release (Aug 2026) and other pages were surfaced but not read.

## 6. Gamification evidence

### Takeaway
The strongest independent evidence found is a randomized field experiment on streaks (Peru, ~60,000 students) showing modest gains in engagement and a possible small learning gain, with the authors stressing caution; Duolingo's own claims are correlational or small A/B lifts. No independent leaderboard evidence was retrieved.

### Cited Findings
- Aulagnon, Cristia, Cueto, Malamud, "Streaks to Success?" (IPR WP-26-05, draft): nationwide RCT in Peru, ~60,000 4th-6th grade students on the Conecta Ideas math app; arms Streak, Personalized Reminder, Generic Reminder, Control; six weeks. Streak raised the probability of connecting at least once by +2.8 pp (personalised reminder +3.8 pp, generic +1.4 pp; control 5.3%), and weeks connected among connectors by +9.4 pp (reminder +6.9, generic +2.5; control 31.7%). Streak students scored about 0.13-0.17 SD higher on the endline test, but only ~2.3% took the endline test and arm differences were not significant, so caution. Authors found no evidence that breaking a streak discouraged later connection; they conclude streaks work best to deepen attachment among already-engaged users while personalised reminders may better start behaviour. Retention beyond six weeks not measured; leaderboards not studied. — [Northwestern IPR WP-26-05](https://www.ipr.northwestern.edu/documents/working-papers/2026/wp-26-05.pdf) (working paper, not peer reviewed)
- Duolingo company claims: 7-day streak learners 3.6x more likely to complete course; second Streak Freeze +0.38% DAU; milestone animation +1.7% day-7 activity; leagues "worked for a lot of learners" in a 2018 test (no figures); Energy vs Hearts claimed to improve lesson completion (no figures); HLR A/B lifts in first-pass notes. — [streak blog](https://blog.duolingo.com/how-duolingo-streak-builds-habit); [leagues blog](https://blog.duolingo.com/duolingo-leagues-leaderboards/); [Energy blog](https://blog.duolingo.com/duolingo-energy/)
- A TU Wien thesis (Olszewski, 2025) on social gamification elements and engagement and a Stanford GSB item surfaced in search; not read. — [TU Wien repository](https://repositum.tuwien.at/handle/20.500.12708/216475)

### Inferences
- Streaks look worth building for habit-forming daily practice (vocabulary, question of the day), but gains are modest and concentrated in already-engaged users; pair with personalised reminders for onboarding. The "3.6x completion" figure is correlation and should not be quoted as causal.
- For exam prep with fixed exam dates, goal-based streaks (weekly study-day target, with a freeze) are a safer variant than a punishing daily streak; judgment.

### Gaps
- Leaderboard effect evidence (positive or negative, e.g. demotivation of low-ranked users), retention curves beyond 6 weeks, studies on streak anxiety: not found/read. Duolingo's own streak-loss and leaderboard A/B numbers beyond the blog items: not retrieved.
