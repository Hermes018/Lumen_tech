# Magoosh IELTS/GRE and Google NotebookLM: feature verification (as of 2026-11-07)

Method: 3 web searches + 8 page fetches (slightly over the 10-call budget; the last two fetches were needed to close the Audio Overview language/interactive questions). Tags: [V] = read on the cited page today; [S] = secondary source; [U] = not verified, treat as assumption.

## A. Magoosh IELTS (own pages) [V]

Sources: https://ielts.magoosh.com/plans and https://ielts.magoosh.com/features (fetched 2026-11-07).

| Item | Finding |
|---|---|
| Plans | Premium 1 month **$109**; Premium 6 months **$129** (or 4 x $32.25). Matches the prior research figures. |
| Promo | A 30% code was advertised on the page (time-boxed); do not use list prices as "regular" without checking history (D12 C14 logic applies to us, not them). |
| Free trial | **7 days, "no commitment"**; includes some lesson videos and practice questions. |
| Money-back | **7-day**, full refund within 7 days of original purchase "no strings attached"; applies also to installment plans. |
| Score guarantee | **"Target Band Score Guarantee" / "Hit Your Target Guarantee"**: page says all money back if the target score is not reached (conditions are in the FAQ/T&Cs; not read). Lumen deliberately differs: extension, not cash (D12 C13b). |
| AI tutor | Listed in the comparison table as included; "can explain any question or concept"; shown as something competitors in their table lack. Implementation details not published. |
| Writing / speaking | **Unlimited AI grading** for both. |
| Practice and exams | 850+ practice questions with explanation videos; up to **10 full-length mocks**. |
| Video | 120+ video lessons. |
| Flashcards | Included (table). IELTS flashcard count not stated on the page [U]. (GRE: "1,000+ flashcards" per 01-COMPETITOR-TEARDOWN, Magoosh GRE page.) A standalone Magoosh flashcards mobile app: [U] not confirmed. |
| Score predictor | Included; "estimates a likely score range from your program performance and data from past students" [V]. This is the "map to real reported scores" approach. |
| Study schedules | Detailed study schedules included. |
| Ask-an-Expert | Unlimited expert questions (human) on the Premium plan. |
| Mobile | Apps for iPad, iPhone, Android; full access also via mobile browser. |
| Other prices | Magoosh GRE Premium $149 (1 mo) / $179 (6 mo) per 01-COMPETITOR-TEARDOWN [S]; not re-verified today. |

## B. Google NotebookLM (renamed "Gemini Notebook" in July 2026 per 9to5google archive page) [V unless noted]

Sources: 9to5google guide https://9to5google.com/guides/notebooklm ; Workspace Updates blog (2026-03-20) https://workspaceupdates.googleblog.com/2026/03/new-ways-to-customize-and-interact-with-your-content-in-NotebookLM.html ; Google help "Generate Audio Overview" https://support.google.com/notebooklm/answer/16212820 ; glasp overview https://glasp.ai/articles/notebooklm-2026 [S].

| Feature | Finding |
|---|---|
| Audio Overviews | Formats: **Deep Dive** (two hosts), **Brief** (one speaker, < 2 min), **Critique** (two hosts give feedback on e.g. an essay), **Debate** (two hosts). Length Shorter/Default/Longer is English-only. Generation takes a couple of minutes. |
| Interactive audio | "Interactive mode" / **Join**: listener asks a question mid-overview and hosts answer from the sources, then resume. **English only**, newly generated overviews only; voice not stored/shared per Google. May glitch. |
| Languages | Audio Overviews support **80+ languages; Bengali is listed** (as "Bengali") [V]. Cinematic Video Overviews are English-only. Video Overviews reached 80 languages [S: ppc.land]. |
| Video Overviews | Launched July 2025; styles; Brief/Explainer; **Cinematic Video Overviews** March 2026 (higher plans only, 18+, English only); Short Video Overviews June 2026. Narrated version on all tiers incl. free (3/day) [S]. |
| Study tools | Flashcards and quizzes (Sept 2025; mobile Nov 2025); March 2026: progress saved, "Got it / Missed it", shuffle, delete cards [V]. Reports (briefing doc / study guide style) redesigned Sept 2025. |
| Mind maps | Present in the Studio menu [S]; behaviour details not verified. |
| FAQ / timeline / study guide | Not individually confirmed on fetched pages [U]; "Reports" format covers briefing/study-guide style outputs [V: 9to5google lists Reports]. |
| Learn / guided learning mode | Not confirmed in NotebookLM on fetched pages [U]. (Do not claim parity.) |
| Chat + citations | Source-grounded chat with citations is core to the product [widely documented; not re-read on a fetched page today, so [U] on exact UI]. Saved chat history (private) rolled out Dec 2025 and March 2026. 1M-token context mentioned Oct 2025. |
| Discover / Deep Research | **Deep Research** (Nov 2025) finds and cites web sources; "Fast Research" mode; source suggestions during chat from June 2026 on higher tiers [S]. |
| Sources | Word, Google Sheets (Nov 2025); EPUB (Mar 2026); camera image source (mobile). Source limits per notebook: Free 50, Plus 100, Pro 300, Ultra 500-600 [S]. |
| Slides / infographics / data tables | Slide decks with prompt-based revisions, PPTX export, 10 infographic styles (Mar 2026); Data Tables (Dec 2025). |
| Plans [S] | Free; Plus $4.99/mo (cut June 2026); Pro $19.99/mo; Ultra from $99.99/mo. |

Implication for Lumen: the learnable, defensible parts are (1) grounded chat with citations, (2) two-voice audio recaps, (3) flashcards/quizzes with progress memory, (4) mind map, (5) report/briefing outputs. Interactive voice Q&A inside an overview is English-only at Google; Lumen can win in Bangla by routing mid-overview questions to Ask Lumen (text) rather than a voice-in-the-loop duplex.

## C. Other facts verified for doc 34

| Fact | Value | Source |
|---|---|---|
| Claude Sonnet 5.5 | $2 in / $10 out per MTok; batch $1 / $5; cache read $0.10 (0.05x), 5-min write $2.50, 1-h write $4 | https://platform.claude.com/docs/en/about-claude/pricing [V] |
| Claude Haiku 5.5 | $0.10 in / $0.50 out per MTok (prompts <= 100K); batch $0.05 / $0.25; cache read $0.01, 5-min write $0.125. Above 100K tokens: $0.50 / $2.50 | same [V] |
| Claude Opus 5.5 | $4 / $20 | same [V] |
| Neon pgvector | Supported on all plans; `CREATE EXTENSION vector`; HNSW and IVFFlat; `vector` <= 2,000 dims, `halfvec` <= 4,000; docs example shows 0.8.0 as latest | https://neon.com/docs/extensions/pgvector [V] |
| TTS prices | ElevenLabs API $0.08 / 1K chars (v3/v4), $0.04 / 1K chars (Flash/Turbo); Polly Neural $16 / 1M chars | 16-CONTENT-SOURCING sec 5.4 (fetched 2026-11-07 there; Polly secondary) |
| Deepgram Nova-3 / Whisper | ~ $0.0077 / min and ~ $0.006 / min (illustrative) | 07 sec 7.8 [U: verify] |
| FSRS, Duolingo HLR | Not re-fetched today. FSRS = open-source DSR-model scheduler (ts-fsrs library); HLR = Settles and Meeder, ACL 2016, Duolingo. Treat license/benchmark claims as [U] until checked at implementation time (NEW-AI-10). |

Not verified / gaps: Magoosh AI-tutor technical design and limits; Magoosh score-guarantee conditions text; NotebookLM mind-map/FAQ/timeline/Learn-mode specifics; BestMyTest and E2Language AI-feature sets (E2Language: expert marking, live classes, 14-day trial per tiers_live_books.md; BestMyTest-vs-Magoosh page exists but was not read).
