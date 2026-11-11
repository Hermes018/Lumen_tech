# 16 - Content Sourcing, Licensing and Production Playbook

> Owner: Head of Content Production. Audience: content lead, item writers, editors, SMEs, voice talent, video editors, QA, Bangla localisers, and the agents that build the Studio.
> This document owns **how content is sourced, made, reviewed and shipped**. What to teach lives in `14-CURRICULUM-IELTS.md` and `15-CURRICULUM-GRE-AND-OTHER-TESTS.md`. Question-type mechanics, validation and scoring live in `07-TEST-ENGINE.md` (this doc links to it and never redefines it). Prices of products live in `17-PRICING-MASTER.md`. Live-class operations live in `18-LIVE-CLASSES.md`. Where this doc disagrees with `00-DECISIONS.md`, that file wins.
> **Not legal advice.** Every legal statement below is an operating policy for a non-lawyer team; Section 1.10 lists what a Bangladeshi IP lawyer must confirm before launch.

Brand placeholder "Lumen Academy" is used in prose only; code reads it from `packages/config/brand.ts` (see the header of 00-DECISIONS.md).

## 0. How to read this document

### 0.1 Evidence legend

| Tag | Meaning |
|---|---|
| **[V]** | Verified from a source fetched during the research round (`research_notes/Curriculum pricing marketing guardrails/content_sources_production.md` and `tiers_live_books.md`), or stated in a locked doc (00, 05, 07, 10). Source in brackets. |
| **[C]** | Industry convention or common professional practice from general knowledge. Reasonable, not independently verified for this project. Treat as a default you may tune. |
| **[P]** | Planning assumption or estimate (throughput, cost, calendar). Replace with measured numbers after the first production sprint. |
| **[U]** | Unverified. Must be checked before it is relied on. Collected in Section 14 (Unverified-facts register). |

### 0.2 The 12 non-negotiables (one-page summary)

| # | Rule | Enforced by |
|---|---|---|
| 1 | Every passage, item, script, slide, video and PDF is **original, or licensed with a recorded licence**. No exceptions for "just as inspiration". | Originality attestation (07 8.1), `stimulus.license`/`license_ref` CHECK (05), legal QA (Sec 12.5) |
| 2 | We **never** copy, retype, closely paraphrase, "recreate", scan or photocopy items from Cambridge IELTS, ETS (Official Guides, POWERPREP), Pearson, Manhattan, Barron's, Magoosh, Kaplan or any past paper. | Policy, training, similarity scans, takedown process |
| 3 | We **never** use "recalled" or "leaked" real-exam questions (memory-based "actual test" dumps). | Policy; writer contract |
| 4 | Recommend official books as **companion resources** with links to legitimate sellers; never host or share files of them. | Legal QA |
| 5 | AI may **draft**; humans **decide**. No AI-generated item, passage, explanation or caption ships without named human sign-off. | Provenance record + service-level publish guard (Sec 4.6) |
| 6 | Every fact in a passage or explanation traces to a source in the **fact ledger**. | Fact-check step (Sec 4.5) |
| 7 | Every item has a key verified **blind by a second person** (07 8.1 step 3). | `publishQuestionVersion()` |
| 8 | Every item is checked for **bias/sensitivity** for Bangladeshi and international candidates. | Sec 3.8 checklist |
| 9 | Synthetic voices are **labelled synthetic** and licensed for commercial use on the plan we pay for. | Audio QA, Sec 5.4 |
| 10 | Masters are kept; delivery files are derived. Nothing exists only in a laptop folder. | Sec 9.8 storage and backup |
| 11 | Official exam names are used **nominatively only**, with the disclaimer from 07 9.5. | Legal QA |
| 12 | Every learner-visible score is **"Estimated"** (D6); content never claims official equivalence. | Copy review |

---

## 1. Legal rules of the road

### 1.1 Copyright basics for a commercial platform (plain language, operating policy)

| Concept | What it means for us | Practical rule |
|---|---|---|
| Copyright protects **expression**, not facts or ideas **[C]** | We can teach the same facts (e.g. "the Aral Sea shrank"), the same exam *format*, and the same skills. We cannot reuse someone's wording, selection, structure or distinctive examples. | Write from a fact ledger, not from another passage. |
| Compilations and selections can be protected **[C]** | A table of data chosen and arranged by a publisher can carry rights even when each number is a fact. | Redraw charts from the raw dataset; do not trace or screenshot a publisher's chart. |
| Close paraphrase is still copying **[C]** | Changing a few words, reordering sentences or "item-by-item paraphrase" of an official passage is infringement risk and also an integrity risk (07 9.4 forbids "paraphrase-closely or recreate"). | Never keep an official passage open while writing. |
| Fair use / fair dealing is narrow and jurisdiction-specific **[C]** | Do not build business processes on it. | Quote only for criticism/commentary, short, attributed, and only after a legal view (Sec 1.4). |
| First owner of a work is usually the author **[C]**; employer or commissioner owns only if law or contract says so | Freelancers and instructors do **not** automatically transfer rights to us. | Written **copyright assignment (or exclusive perpetual licence)** in every contributor contract before payment (Sec 1.8). |
| Moral rights (attribution, integrity) may survive assignment **[C]** | Contributors can object to distortion. | Contract includes waiver or consent to edit (to the extent Bangladeshi law allows **[U]**). |
| Bangladesh Copyright Act 2023 exists and replaced the 2000 Act **[U]**; term of protection, assignment formalities (writing, duration, territory defaults) and enforcement not verified in the research round | Contracts must state **scope, duration, territory** explicitly, because statutes often default them to short periods. | Lawyer to confirm (Sec 1.10). |
| Territory | We sell in Bangladesh and worldwide. Public-domain status differs by country **[C]**. | Treat a work as public domain only if it is PD in the US **and** in Bangladesh and the UK, or licensed explicitly. |

### 1.2 Official and third-party prep materials: what we may and may not do

| Material | Owner / terms | We MAY | We MUST NOT |
|---|---|---|---|
| **Cambridge IELTS 1-20 books** (Cambridge IELTS 20 Academic, published 17 July 2025, GBP 40.49 regular price in the UK shop, with digital pack **[V: Cambridge Book Shop]**; GT edition also exists, ISBN 9781009814911 vs Academic 9781009814904 **[V]**; verify there is no IELTS 21 before writing "latest edition" **[V/U]**) | Cambridge University Press and Assessment; IELTS content is licensed by the IELTS Partners (British Council, IELTS Australia, Cambridge English) | Recommend by title with a link to a legitimate seller (Rokomari etc.). Teach *strategies* for the question types. Tell learners to do the official tests as their final-stage realism check. Reference "Test 3, Section 2" as a **pointer** only if the learner owns the book (pointer, not reproduction) after legal sign-off. | Copy, retype, scan, screenshot, read aloud, re-record, summarise item-by-item, reuse audio, reuse passages, reuse topic+structure combination, build our mocks "in the style of Test X" by imitating a specific passage. Host or link to any PDF/photocopy. |
| **ETS: Official Guide to the GRE (4th ed., McGraw-Hill, January 2025) [V: ThriftBooks listing]; POWERPREP; Official GRE Verbal/Quant Reasoning books; ScoreItNow** | ETS (trademark + copyright) | Recommend as companion resources; instruct learners to take POWERPREP Plus for calibration of the estimated-score mapping; link to ets.org pages. | Copy items, reproduce POWERPREP screens, scrape, use ETS logos, imply endorsement, use "official" for our material. Use the exact ETS-required footer notice (07 9.5). |
| **Third-party books and courses: Manhattan Prep, Barron's, Kaplan, Princeton Review, Magoosh, Cambridge Vocabulary for IELTS, etc.** | Respective publishers | Recommend with link and a one-line neutral description; disclose any affiliate relationship ("we earn a commission") **[C]**. Compare features factually. | Copy lists, practice items, vocab lists with their ordering/selection (word lists are compilations **[C]**), or videos; quote more than a short attributed phrase. |
| **Photocopies, scanned PDFs, "free download" sites, Telegram/Facebook groups** | Infringing copies | Nothing. | Touch, share, link, store, or let any contributor use them as source. |
| **"Real exam recall" or "actual test" dumps** | Exam content is confidential to the owner **[C]** | Nothing. | Use, buy, or paraphrase. Report to compliance if a contributor offers it. |

**Dhaka's Nilkhet book market and photocopy culture [U: general knowledge; no source retrieved in research].** Cheap photocopied and bound copies of Cambridge/ETS books are widely available in the Nilkhet/New Market area of Dhaka, and learners will ask us for "the PDF". Our rule is absolute: **we never buy, scan, quote from, link to, or discuss obtaining such copies, and no staff member brings them to a content session.** If a learner asks, the support macro says: "We can't share copies of official books. Here is where to buy the original (Rokomari / publisher), and here is our free original practice set." Staff and freelancers who are found to have used pirated material as source are removed and the affected items are retired immediately (Sec 12.5, LQ-12). This protects us from infringement claims, from contaminated item banks, and from the reputational risk of an education brand being linked to piracy.

### 1.3 Companion-resource page policy

| Rule | Detail |
|---|---|
| Format | Title, edition, publisher, **link to the publisher or an authorised retailer**, who it's for, 1-2 sentence neutral note, "not affiliated with" line. |
| Ownership of the copy | We tell learners to use their own purchased copy. We do not add "free download" links. |
| Prices | Do not print prices in static pages (they go stale); link instead. Research could not retrieve BDT prices for any title **[V gap]**. |
| Affiliate links | Allowed only if disclosed on the same page, adjacent to the link **[C]**; recorded in the finance ledger. |
| Review cadence | Quarterly: check edition currency (e.g. whether a Cambridge IELTS 21 or new Official GRE Guide edition exists), broken links, publisher notices. |

### 1.4 IELTS.org terms, band descriptors and scoring guides

| Topic | Policy | Basis |
|---|---|---|
| IELTS.org site content | "Personal and non-commercial use only"; commercial use, republishing on another website or modifying material **requires written permission**; submitting the copyright request form is not itself a licence; IELTS trade marks may not be used, copied, reproduced, modified, distributed or republished **[V: ielts.org/legal/ielts-copyright-and-trade-mark-statement]** | We treat **everything** on ielts.org (sample tests, sample answers, practice videos, descriptors PDF) as off-limits for copying or embedding. |
| Public band descriptors (Writing, Speaking) | **Paraphrase the criteria in our own words** (this is what 07 7.3 already does). **Link** to the official PDF on ielts.org. Do **not** paste tables or long verbatim quotations. Before any verbatim quote in marketing, seek written permission via the IELTS copyright request form, or a lawyer's opinion that a short attributed quotation is safe. | **[V]** terms; the descriptor-specific permission position was **not** confirmed by the British Council/IDP in research (gap) |
| Our own band samples | Original model answers written by our team and scored by our graders; marked "Our estimate, not an official score". | 07 8.3 (`bandSamples`) |
| Official sample answers/scripts on ielts.org or in books | Do not copy; do not annotate screenshots of them. | Same as above |
| GRE AWA scoring guide (ETS) | Treat the same way: paraphrase six-point criteria; link to ets.org; do not copy the published sample essays or issue pool wording (07 8.3 reviewer attests "not a verbatim ETS topic"). Whether ETS allows quoting the guide is **not retrieved**. | **[U]** |
| Trademarks | Use "IELTS" / "GRE" nominatively ("IELTS-style practice", "practice for the GRE test"); never in company, product, domain or handle; never use ETS/Cambridge/IDP/British Council logos; render the exact notices from 07 9.5 in footers, exam start screen, score reports, PDFs and score emails. IELTS notice wording **must be verified** against official brand guidelines before launch (07 9.5, Appendix A item 11). | **[V]** ETS wording from 07; IELTS wording **[U]** |
| ETS trademark review | Submit footer, start screen and score-report layouts to ETS trademark review (about 10 business days per 07 9.5) before launch. | **[V per 07]** |

### 1.5 Licence table for open and third-party sources

| Source | Licence | Can we use it commercially in a paywalled course? | Conditions / traps | Verdict |
|---|---|---|---|---|
| **Project Gutenberg** texts | Public domain in the US for most items; PG's own trademark and licence apply to the "Project Gutenberg" name and header **[C]** | Yes for the text if the underlying work is PD in the US (and, per our rule, also PD in UK/Bangladesh); strip PG branding, or follow PG licence if you keep it **[U: PG terms not checked]** | Old register (19th-century prose) is unlike IELTS/GRE texts; translations and annotations may be separately copyrighted; check the author's death date (life + 70 in many countries **[C]**). | OK for **GRE vocabulary-in-context examples, reading-style practice of dense prose** if provenance logged; not for IELTS-style passages. |
| **LibriVox** audio | Recordings donated to the public domain ("you may use it for whatever purpose you wish") **[V: librivox.org/pages/about-librivox]**; underlying books are public-domain works **[V]**; PD status of texts is US-centric **[V note in research]** | Yes | Volunteer audio quality varies; accents uncontrolled; not exam-like; log reader, URL, and date. | OK for pronunciation/shadowing practice and GRE-style prose listening. |
| **VOA** (Voice of America) text/audio/video | "All text, audio and video material produced **exclusively** by VOA is in the public domain" **[V: voanews.com/p/5338.html]** | Only for items that are VOA-original | Licensed material (AFP, AP, Reuters) is **not** PD and may not be copied or sold **[V]**; VOA and voanews.com are trademarks, no commercial use of the branding **[V]**; credit requested **[V]**; whether VOA Learning English is still operating in late 2026 **not checked [U]**. Keep a per-item provenance log proving VOA-exclusive authorship. | Use sparingly as **inspiration and fact sources**; ship only fully rewritten material. |
| **Other US-government works** (e.g. NASA, NOAA, USGS, CDC) | Generally not copyrighted in the US **[C]** | Yes for US-gov-authored works | Contractor-created content, third-party images embedded inside, foreign-government works, and logos/insignia are excluded; check each page's footer. | OK as fact/image source with item-level check. |
| **OpenStax** textbooks | CC BY 4.0 **[U: not retrieved]** | Yes, with attribution | Individual figures or third-party items inside a book may carry other licences; attribution template in 2.6; indicate modifications. | Good source for **GRE Quant concepts, science passages (inspiration)**; adapt with attribution or rewrite. |
| **Wikipedia** text | CC BY-SA **[V: CC BY-SA 4.0 deed]**; adaptation must be licensed under the same/compatible licence **[V: CC wiki ShareAlike interpretation]** | Legally possible, but a passage adapted from Wikipedia text becomes CC BY-SA and conflicts with an all-rights-reserved paywalled bank **[inference in research]** | Images on Commons carry per-file licences. | **Do not adapt Wikipedia prose.** Use as a *pointer to primary sources* and fact starting point only; write fresh text. |
| **MIT OpenCourseWare** | CC BY-NC-SA 4.0 **[V per brief]** | **No** (non-commercial) | Share-alike + NC | Do not use content; may link learners to it as a free external resource. |
| **Harvard CS50** | CC BY-NC-SA 4.0 **[V per brief]** | **No** | NC | Same: link only. |
| **UK Open Government Licence v3.0** | OGL v3.0 **[U]** | Yes, with attribution statement | Excludes logos, personal data, and third-party rights inside the material; statement: "Contains public sector information licensed under the Open Government Licence v3.0." | OK for UK statistics/government reports as a **fact and data source**. |
| **News wires (AP, Reuters, AFP) and newspaper articles** | Commercial licences; VOA itself licenses wire content from AFP, AP, Reuters **[V]** | Only by **paid licence** | Cost not retrieved **[U]** | Not used at launch. Read for inspiration; never copy. |
| **Wikimedia Commons / Openverse / Unsplash / Pexels images** | Per-file licences (CC0, CC BY, CC BY-SA) or site licences **[C]** | Per file | Do not redistribute images as a stand-alone downloadable; NC/SA/ND items excluded; people with identifiable faces need model releases for sensitive uses **[C]** | Prefer our own illustrations. |
| **Fonts** (Inter, Noto Sans Bengali, Hind Siliguri) | SIL OFL **[C]** (matches 08) | Yes, embed in PDFs | Keep licence file in repo. SF Pro never embedded (08 2.2.1). | OK |
| **Music for videos** | Licensed library (Epidemic/Artlist/Envato class) or CC0 **[U: pricing not researched]** | Only with a commercial licence that covers online courses and paid ads | Do not use YouTube Audio Library tracks unless the licence covers our channel use; no Bollywood/pop tracks. | Keep a music licence PDF per asset. |
| **World Bank Open Data** | CC BY 4.0 **[V per brief]** | Yes, attribution | Some datasets sourced from third parties carry their own terms - check dataset page **[C]** | Primary source for Task 1 charts. |
| **Our World in Data** | CC BY (charts and text) **[V per brief]**; underlying third-party data may carry other terms **[C]** | Yes, attribution | Check the chart's "Data source" licence; do not copy their chart image, redraw. | Primary source. |
| **UN data portals** (UN Data, UNdata, UNESCO UIS, UNICEF, UN Comtrade) | Terms vary by portal **[U]** | Check each portal | Some require attribution and prohibit certain resale | Confirm per dataset. |
| **BBS Bangladesh (Bangladesh Bureau of Statistics)** | Licence not stated in research **[U]** | Facts yes; verbatim tables/charts: seek permission | Government publications may carry copyright claims; cite and redraw; ask BBS for a written permission note for any named publication we feature | Use for local-context Task 1 charts with citation. |
| **Our own AI-assisted drafts** | Copyright status of purely AI-generated output is unsettled and varies by jurisdiction **[V gap + C]** | Yes as a business matter, but ownership is weaker | Keep records of human editing (provenance, Sec 4.6) so human authorship is demonstrable | Default path. |

### 1.6 Default rule

> **Original content, written in-house (human + AI-assisted), with references for facts.** Open sources are inputs to our *fact ledger and inspiration lists*, not copy-paste sources. The only direct reuse at launch is: LibriVox/Gutenberg for pronunciation or prose practice, OGL / World Bank / OWID data for charts (attributed), and our own fonts/graphics.

### 1.7 Attribution requirements (templates are in 2.6)

For any CC BY / OGL / data source, the attribution lives in **three places**: (1) the `stimulus.license_ref` field (05 CHECK requires it when `license <> 'original'`); (2) a visible credit line under the chart/image; (3) the `/legal/credits` page auto-built from `license_ref`.

### 1.8 Contributor and talent contracts (required before any payment)

| Contract | Must contain |
|---|---|
| **Item-writer / SME agreement** | Assignment (or exclusive, perpetual, worldwide licence) of all rights in delivered work; warranty of originality; promise not to use official/recalled/pirated material; permission to edit and adapt; AI-use disclosure clause (writer states if they used AI tools and which); confidentiality of the bank; non-compete for the same prompts for 12 months **[P]**; moral-rights consent where permitted; takedown cooperation; payment on acceptance (post-review). |
| **Instructor agreement** (employee or marketplace, P3 revenue share) | As above plus: on-camera **likeness and voice release**; right to re-edit, translate, subtitle, voice-over and create the international version; right to continue to use after the instructor leaves (or defined sunset); revenue/royalty terms live in 17/02. |
| **Voice-actor agreement** | Buy-out licence for all media and territories in perpetuity (or stated term); the recording is for **our** exam-style audio only; **no AI voice cloning or model training from the recording** unless a separate written consent and fee; rights to edit and re-pitch/time-stretch within reason; credit optional. |
| **TTS vendor terms** | Record plan, date, and the clause that permits commercial use of generated audio (Sec 5.4). Re-check on every plan change. |
| **Learner-contributed content** (sample essays, speaking recordings used as examples) | Explicit opt-in with revocation path; anonymise; never use paid-tier submissions as model answers without written consent (privacy: 09). |
| **Guest/partner content (coaching centres, NGOs)** | Written licence; warranty; indemnity; takedown clause. |

### 1.9 Takedown and incident process

| Step | Owner | SLA |
|---|---|---|
| Complaint or suspicion received (email `legal@`, support, internal) | Support -> Content lead | Acknowledge < 1 business day |
| **Immediate retirement** of the item/asset/lesson (set `retired`; unpublish video; pull PDF from store) and audit-log entry (07 9.4) | Content lead | < 24 h |
| Root cause: trace via provenance record (author, model, prompt version, reviewer) | Content lead + editor | < 5 business days |
| Re-scan sibling items by the same author/prompt batch | Editor | < 10 business days |
| Decision: replace, license, or permanently remove; notify complainant; if score impact, use the re-score tool (07 8.6) | Content lead + legal counsel | < 15 business days |

### 1.10 Items a Bangladeshi IP lawyer must confirm before launch

| # | Question |
|---|---|
| L1 | Bangladesh Copyright Act 2023: assignment formalities, default term/territory, moral rights, and whether a company can be first owner of commissioned works. |
| L2 | Safe nominative-use wording for "IELTS", "GRE", "TOEFL", "PTE", "Duolingo English Test" in marketing, URLs, SEO page titles. |
| L3 | Whether quoting a short phrase of the IELTS band descriptors and the GRE AWA rubric is permissible, or written permission is needed. |
| L4 | Whether buying legitimate copies of official books and **using them privately for reviewer resemblance checks** is acceptable (no digitisation). |
| L5 | Position on AI-generated content ownership and disclosure obligations for Bangladesh, and for EU/UK buyers (EU AI Act transparency for synthetic audio may apply to EU-facing deployments **[U]**). |
| L6 | Takedown/notice mechanism recommended for Bangladesh-hosted and foreign-hosted content. |
| L7 | Consent regime for recording live classes with learners (including minors) and cross-border storage (09). |

---

## 2. Inspiration, raw material and how to process it

### 2.1 Pipeline: from raw material to a fact ledger

```
Inspiration sources  ->  Topic bank (titles only)  ->  Content brief  ->  Fact ledger (human, 2 sources per claim)
                                                                  \->  AI-assisted draft (from brief + ledger only)  ->  Human rewrite
```
**Rule:** the writer (human or model) sees the **brief + fact ledger**, never someone else's passage. Reading a source article to learn the facts is fine; writing with it open is not.

### 2.2 Where to find topic ideas and facts

| Need | Good sources (read, do not copy) | Notes |
|---|---|---|
| IELTS Academic Reading topics | Public science/humanities summaries from national science agencies, museum education pages, university press releases (check licence), Nature/Science news summaries (facts only), IUCN, WHO, UNESCO, FAO | Academic-style topics recur: urban planning, biodiversity, language acquisition, architecture history, psychology of memory, renewable energy, sleep, ancient trade routes, ergonomics **[C]** |
| IELTS GT Reading | Public notices, workplace policies, product manuals, council leaflets, job adverts - **designed by us** | Create realistic but fictional organisations (check names against real companies) |
| Listening Parts 1-4 | University orientation scenarios, travel bookings, library membership, project meetings, lecture outlines | Scenarios and settings only; dialogue written by us |
| Writing Task 2 prompts | Public-policy debates: remote work, urban growth, education funding, technology and children, public transport, climate adaptation | Check for sensitive-topic list (Sec 3.8) |
| Writing Task 1 data | World Bank Open Data (CC BY 4.0 **[V per brief]**), Our World in Data (CC BY **[V per brief]**), UN data portals **[U]**, BBS Bangladesh statistics **[U]**, national statistics offices under OGL | Always from raw tables; always cite |
| Task 1 maps and plans | **Drawn by our designers** from scratch (town centres, campuses, floor plans, before/after changes) | Never trace Google/Cambridge maps |
| Task 1 processes | Original diagrams: water cycle variants, manufacturing of paper/cement/jute, recycling, solar panel production, biogas | Use real processes, our own drawings |
| Speaking cue cards/topics | Everyday experience themes (a person, place, event, object, skill); Part 3 abstractions | Our own, not the current official quarterly-recall topic lists |
| GRE Verbal text | Essays on humanities/social/natural science, written by us at the right register; Gutenberg excerpts for dense-prose practice | RC passage target 100-450 words, difficulty by section **[C - verify in 15]** |
| GRE Quant context | OpenStax maths texts (CC BY **[U]**) and school syllabi for concepts; our own numeric contexts | Items numerically original |
| GRE AWA prompts | Our own claim statements across technology, education, government, arts, history | Not ETS pool wording |
| Vocabulary | Frequency-based wordlists we assemble from corpus data (e.g. the NGSL/AWL are published with their own licences **[U]**) plus our own GRE lists compiled from first principles | Do not copy Magoosh/Manhattan/Barron's lists or orderings |

### 2.3 Topic bank design

Maintain a Google Sheet / Notion DB `Topic Bank` with: `topic_id`, `title`, `exam`, `skill`, `subject_area` (science, social, humanities, tech, environment, business, health, arts), `difficulty_band`, `bangla_context_ok` (Y/N), `sensitivity_flag`, `used_in` (stimulus codes), `date_added`. **Rule: a topic is "used" per exam family at most twice in the bank and never twice in the same mock.** Balance targets per 10-mock set **[P]**: no subject area > 25% of reading passages; at least 2 passages with a local/regional angle that a global candidate can still understand.

### 2.4 Public data for Writing Task 1 charts

| Step | Detail |
|---|---|
| 1. Pick a dataset | Prefer 3-6 categories and 4-8 time points or categories. Avoid datasets with revisions, contested definitions, or politically sensitive attribution. |
| 2. Record provenance | Dataset URL, indicator code, extraction date, licence, any transformation (rounding, aggregation). |
| 3. Rebuild the chart | Our designers use the raw numbers in Figma/Illustrator/Datawrapper-like workflow; Lumen colours (08), colour-blind-safe, patterns in addition to colour. |
| 4. Add alt text and data table | The structured table is the accessible alternative and is what 07 8.3 requires (`dataTable`, `visualFacts >= 3`). |
| 5. Fact-check | Another person recomputes 3 key facts (largest, smallest, trend change). |
| 6. Attribution line | See 2.6. |
| 7. Labelling | Mark as "Practice data adapted from <source>" if modified; if the figures are invented for exam realism, label **"Illustrative data"** in metadata (not necessarily on the learner screen) and never present invented data as a real statistic in a lesson or explanation. |

### 2.5 Maps, plans and process diagrams (designer brief)

| Asset | Brief | Spec |
|---|---|---|
| Map/plan (before/after) | 2 panels, same scale and north arrow, 6-12 labelled features, A-H location letters for `ielts.map_label` | Vector SVG master, 1600 px min width export, alt text, high contrast, no copyrighted base maps |
| Process diagram | 5-9 stages, numbered arrows, label length < 4 words | Vector SVG, text as outlined font? No - keep live text, Inter, for accessibility |
| Chart | Bar/line/pie/table/mixed, readable at 360 px width | Provide data table + alt text; export 2x PNG and SVG |
| Style | Lumen neutral palette + single accent (08), no gradients, no stock icons with licences we cannot trace | Source file saved in `design/` |

### 2.6 Attribution templates

| Case | Template |
|---|---|
| CC BY data/chart | `Source: <Organisation>, "<Dataset title>" (<year>). Licensed under CC BY 4.0. Data redrawn and rounded by Lumen Academy.` |
| OGL | `Contains public sector information licensed under the Open Government Licence v3.0. Source: <Department>, "<Title>" (<year>).` |
| World Bank | `Source: World Bank Open Data, indicator <code> (<name>), accessed <date>. CC BY 4.0. Adapted by Lumen Academy.` |
| OWID | `Source: Our World in Data, "<Chart title>", based on <underlying source>. CC BY. Redrawn by Lumen Academy.` |
| BBS | `Source: Bangladesh Bureau of Statistics, "<Publication>" (<year>). Used with permission / cited as a source of facts. Redrawn by Lumen Academy.` |
| Public domain with courtesy | `Audio: <title>, read by <reader>, LibriVox (public domain).` |
| Our original | `(c) <year> Lumen Academy. Original content. Practice material is not an official test. Estimated scores only.` |
| AI disclosure | `Prepared with AI assistance and reviewed by <role>. See How we make our practice material.` |

---

## 3. Item-writing system

Question-type ids below are the registry ids in 07 section 2 (`ielts.*`, `gre.*`). The validators in 07 8.3 are the hard rules; this section adds **authoring practice** around them.

### 3.1 Item specification per question type (author-facing)

| Type id (07) | Skill | Stem / stimulus spec | Key & distractor spec | Accepted-answer rule |
|---|---|---|---|---|
| `ielts.mcq_single` | R / L | Stem a full question or incomplete statement; 4 options typical (3-6 allowed by 07); similar length and grammar; no "all of the above" | One key, 3 plausible distractors each tied to a **named distractor type** (Sec 3.5) | Key option id |
| `ielts.mcq_multi` | R / L | "Choose TWO/THREE"; options >= choose + 2 | Keys independent (not "A and C together"); each key anchored to evidence | Exact set |
| `ielts.tfng` / `ielts.ynng` | R (TFNG), R (YNNG - opinions/claims) | Statement <= 40 words (07 warns); paraphrase the passage, never copy sentences | TRUE = same meaning; FALSE = contradicts; NOT GIVEN = topic-related but **no evidence** (never "partially supported"). YNNG judges the writer's views/claims | Three-value |
| `ielts.match_information` | R | Statements for locating info in paragraphs A-F | One paragraph per statement unless `reusable`; every paragraph referenced at least once in the set when possible (07 warn) | Letter |
| `ielts.match_headings` | R | List of headings (>= items + 2); headings <= 15 words (07) | Extra headings are **partially true** to a paragraph (topical lure) but miss its main idea; no two headings match one paragraph by keyword overlap > 70% (07) | Heading id |
| `ielts.match_features` / `match_sentence_endings` | R / L | Features (people/theories) or beginnings + endings | Endings grammatically continue only their own beginning; >= items + 2 options | Option id |
| `ielts.sentence_completion`, `summary_completion`, `note_completion`, `table_completion`, `flow_chart_completion`, `form_completion` | R / L | Gapped text with word limit label (Sec 3.6); in Listening the **answer order follows audio order** | Answers are exact words (Reading) or heard words (Listening); every answer satisfies the limit (07) | `accepted` list built per Sec 3.7 |
| `ielts.diagram_label_completion`, `ielts.map_label` | R / L | Diagram/map from 2.5; labels A-H | Pins/letters unambiguous; text alternative provided | Label |
| `ielts.short_answer` | R / L | Wh-questions answerable in order | Limit enforced; answer verbatim in text/audio | `accepted` list |
| `ielts.writing_task` | W | Task 1 Academic: visual + >= 3 `visualFacts`; GT: letter with 3 bullets; Task 2: essay prompt (07 8.3) | >= 3 original band samples recommended (07) | Rubric (07 7.3) |
| `ielts.speaking_part` | S | Part 1 8-12 prompts over 2-3 frames; Part 2 cue card (3-4 bullets); Part 3 4-6 linked questions (07 8.3) | Examiner prompt audio via TTS reviewed for pronunciation | Rubric |
| `gre.rc_single`, `rc_multi`, `rc_select_in_passage` | V | Passage 100-450 words **[C: verify against 15]**; question types: main idea, detail, inference, purpose, author's attitude | Single: 5 options, one best; multi: 3 options, >= 1 correct (07); select-in-passage: sentence ids from the passage | Exact |
| `gre.text_completion` | V | 1-3 blanks; 5 options (1 blank) or 3 per blank (2-3 blanks) per 07 | Distractors share tone/part of speech, differ in meaning logic | Exact per blank |
| `gre.sentence_equivalence` | V | One blank; 6 options; exactly 2 correct | Two answers must give **sentences of the same meaning**; remove near-synonym third option | Exact pair |
| `gre.qc` | Q | Two quantities + optional given info | Key A-D, never shuffled; avoid traps that need mere arithmetic grind | A-D |
| `gre.mc_single` / `gre.mc_multi` | Q | Numeric/algebra/geometry/data | Distractors reflect **common errors** (sign, unit, percent vs fraction) | Exact |
| `gre.numeric_entry` | Q | Stem states rounding/format | Key parses as rational/range (07); accept equivalents (`0.5`, `1/2`) per 07 3.1.5 | Numeric |
| Data Interpretation (`gre.mc_*` + `data_set`) | Q | Table/chart + 2-3 questions | Answerable from the exhibit alone | As MC |
| `gre.awa_issue` | W | Claim statement 15-60 words + instructions (07) | Reviewer attests not an ETS topic | Rubric |

### 3.2 Item-writer brief (template)

```
BRIEF ID:        BR-IEL-R-0042                    Requested by: Content Lead    Due: <date>
EXAM / SKILL:    IELTS Academic / Reading Passage 2
TARGET BAND:     6.5-7.5 (CEFR B2+/C1)            WORD COUNT: 800-900
TOPIC:           <from Topic Bank: "Urban beekeeping and city biodiversity">
STRUCTURE:       6 paragraphs A-F; mix of description, cause/effect, one contrasting viewpoint
ITEM SET:        Q14-26 (13 items): match_headings x5, tfng x4, sentence_completion x4 (<= TWO WORDS)
FACTS:           Fact ledger FL-0042 (attached, 14 claims with 2 sources each). No other facts.
DO NOT:          copy or paraphrase any published passage; invent statistics, studies, quotes or named experts; use sensitive topics list; use brand names
INCLUDE:         <= 3 words/phrases above target level, each defined by context
METADATA:        skill tags, cefr, difficulty 1-5 estimate, est_time_seconds, evidence spans
DELIVER AS:      07 import JSON/CSV (Sec 10) + explanations (Sec 3.9)
AI USE:          Allowed per Sec 4. Record tool, model id, prompt version.
ATTESTATION:     "I wrote or substantially rewrote this; nothing is from official or recalled exam material."
```

### 3.3 Difficulty targeting

| Lever | Easier (band ~4.5-5.5) | Mid (6-6.5) | Harder (7+) |
|---|---|---|---|
| Passage / script | Familiar topic, explicit structure, high-frequency vocab, short sentences | Some abstraction, 2-3 viewpoints | Dense, nominalised, implicit stance, low-frequency items |
| Item-to-text relation | Verbatim or near-verbatim match | Synonym/paraphrase | Inference, multiple paragraphs, scattered evidence |
| Distractor strength | Obvious contradiction | Topical lure | Lure with partial truth in the right paragraph |
| Listening | Slower, one accent, no self-correction | Hesitations, one correction | Fast, overlapping speakers, distractor corrections, accent mix |

Alignment to CEFR: IELTS bands roughly 4.0-5.0 ~ B1, 5.5-6.5 ~ B2, 7.0-8.0 ~ C1, 8.5-9.0 ~ C2 **[C: published alignment; verify]**. Author difficulty (1-5, `question_version.difficulty`) is an **estimate**; real difficulty comes from pilot statistics (Sec 3.10). Target a launch bank where per skill about 20% easy (1-2), 50% mid (3), 30% hard (4-5) **[P]**.

### 3.4 Readability and level check

Run each passage through a CEFR/level estimator (Studio's readability indicator, 07 8.2) plus a human check. Record the estimate in the item's `cefr` tag. A passage more than one CEFR level from the brief target is returned.

### 3.5 Distractor rules

1. Every distractor must be **wrong for a definable reason** (written in the reviewer notes): wrong scope (too broad/narrow), reversal, unsupported extrapolation, true-but-irrelevant, wrong detail, word-match lure.
2. Distractors are **homogeneous** in length, grammar and register with the key. The key must not be consistently longest or most specific.
3. No "all of the above", "none of the above", or cross-references (hard error when shuffling is enabled, 07 8.3).
4. No two options mean the same thing.
5. Avoid negatives in stems; if used, capitalise (NOT).
6. Key position is varied across the form (07 warns if one letter > 50% for QC; follow the same target of roughly even spread for MCQ **[C]**).
7. Do not make distractors depend on cultural knowledge outside the stimulus.
8. For GRE Text Completion/Sentence Equivalence: distractors fit syntactically and tonally but break the logic cue.

### 3.6 Word-limit rules for completion items (authoring side of 07 2.3.1 / 3.1.2)

| Rule | Detail |
|---|---|
| Label | Use the generated label (`wordLimitLabel`). Keep stems consistent with it. |
| Count | Hyphenated compounds count as ONE word; numbers count as ONE number token (07 2.3.1; verify against official handbook per 07 Appendix A.4). "a", "the", "of" count. |
| Design | In Reading the exact text must contain the answer within the limit; in Listening the answer must be **spoken as written** (no spelling ambiguity beyond the allowed variants). |
| Do not | Write an item where the natural answer exceeds the limit, or where the key is a word not present in the stimulus. |
| Validate | Studio rejects accepted answers beyond the limit; warns if answer not verbatim in the transcript/passage (07 8.3). |

### 3.7 Answer key with accepted variants

| Variant family | Rule | Example |
|---|---|---|
| Spelling UK/US | Add both unless the item tests spelling | `colour|color`, `centre|center` |
| Article tolerance | Include with/without article **only if** within the word limit | `library|the library` (the latter only if limit >= 2) |
| Hyphen/space | Treat hyphenated as one word; list both forms only if both are natural | `check-in|check in` (second counts as two words) |
| Numerals vs words | Accept digits and written form if the limit allows | `20|twenty` |
| Plural/singular | Only if the passage supports both; otherwise exact | |
| Case, trailing punctuation, whitespace | Normalised by the engine (07 3.1.2); do not list | |
| Time/currency formats | List canonical variants once (`9.30|9:30|9.30 am`) | |
| Misspellings | **No** blanket tolerance for misspellings in Listening (official IELTS marks incorrect spelling wrong **[C]**); engine rules in 07 3.1.2 govern. | |
| Source of truth | Only the **author** adds accepted variants (07 8.1 step 3). The **reviewer** proposes additions after blind re-key. | |

Spreadsheet column pattern for the CSV import (Sec 10): `b1_accepted` uses `|` separators.

### 3.8 Bias and sensitivity review

Mandatory second review (can be the same editor as the content review if the checklist is completed, but never the author). Audience: Bangladeshi candidates **and** candidates from South Asia, the Gulf, Africa, East/SE Asia, Europe and the Americas.

| Dimension | Check | Typical fix |
|---|---|---|
| Culture / background knowledge | Can the item be answered **from the text alone**? No reliance on knowing a sport, holiday, brand, food, TV show or place that only some candidates know. | Add the needed fact to the text, or change the context |
| Local vs global | Do local contexts (taka, rickshaw, Eid) appear only where they add value and do not give Bangladeshi test-takers an unearned advantage in scored items? Keep scored items **neutral**; use local colour in lessons/practice, not in the 10-mock core. | Move local colour to teaching examples |
| Gender | Balance of male/female names, professions, roles (no "nurse = she, engineer = he" patterns). Use gender-neutral writers/speakers where possible. | Rebalance |
| Religion | No proselytising, ridicule or comparison; avoid food/clothing/ritual details as test content; treat religious topics only factually and only where necessary. | Replace topic |
| Politics and history | Avoid contemporary partisan topics, disputed territories and borders, the 1971 war narrative as test content, India-Pakistan-Bangladesh sensitivities, Israel-Palestine, Kashmir, Rohingya framing, party names **[P]**. | Neutral topic |
| Region | No stereotypes of nations, castes, ethnic groups, regions (Chittagong Hill Tracts, Sylhet etc.). | Remove |
| Class, disability, age | Avoid portraying poverty/disability as deficit; use people-first language. | Reword |
| Health and trauma | Avoid graphic violence, suicide, abuse, disordered eating as content. | Replace |
| Names | Diverse, pronounceable; avoid real public figures. | Replace |
| Accessibility | Images have alt; colour not sole carrier; audio has transcript. | Fix |
| Reviewer note | "Pass / Pass with changes / Reject" + one-line reason, stored with the item. | |

### 3.9 Explanation writing standards

| Element | Standard |
|---|---|
| Structure (<= 120 words objective items; <= 250 for writing model answers) | 1) **Answer** and its location; 2) **Why correct** with the evidence span (07 `review.evidence` / `audioEvidence`); 3) **Why each distractor fails** (one line each, naming the distractor type); 4) **Skill tip** (transferable, one sentence); 5) optional Bangla scaffold (Sec 11). |
| Language | Plain English at B1-B2, short sentences; define any exam jargon once; never blame the learner. |
| Evidence | Quote from our own passage/transcript (allowed - it is our text); highlight the exact span. |
| No claims | Do not assert a global rule that is not true ("IELTS always..."). Hedge: "Typically...". |
| Maths (GRE) | Show the fastest valid method first, then an alternative; check with KaTeX render; units and rounding stated. |
| Tone | Calm, specific, encouraging; consistent with 08 voice. |
| Reviewer | Explanation is read by the blind re-key reviewer (07 8.1). |
| Video explanation | Optional `review.videoId` (07). Script follows Sec 6.4. |

### 3.10 Double-blind key verification (extends 07 8.1)

1. **Author** submits item with key and `accepted` variants.
2. **Reviewer A** (not the author) answers it in preview **without seeing the key**; the system scores it (07 8.1 step 3). Any miss blocks approval; discrepancies go back to the author.
3. For **high-stakes mocks** (the 4 launch mocks per course and every GRE item), add **Reviewer B** (a second independent blind answer) **[P]**; two blind matches required.
4. For **maths items**: reviewer solves independently on paper; for numeric entry, a script computes the answer from the stated formula and compares.
5. For **Listening**: reviewer answers while listening to the **final audio**, not the script.
6. Result recorded in `answer_key.review.verification` (07).

### 3.11 Piloting and item statistics

| Stage | What we do | Sample | Output |
|---|---|---|---|
| **P0 internal** | Staff + SMEs take drafts; time each section | 5-10 people **[P]** | Timing, obvious faults |
| **P1 beta cohort** | Release "Beta mocks" to volunteers (partner coaching centres, community, scholarship cohort) in **exam mode**, clearly labelled beta, scores shown as extra-estimated | >= 100 attempts per form target **[P]**, consistent with the 07 8.6 gating (`attempts >= 100`) | `question_stat` CTT metrics |
| **P2 calibration** | After >= 300 attempts, Rasch calibration (07 3.3.2) | >= 300 | `irt_b`, infit/outfit |

Metrics and thresholds (consistent with 07 8.6; add the usual teaching targets):

| Metric | Definition | Target (good) | Flag (07 8.6) |
|---|---|---|---|
| **p-value** (difficulty) | Proportion correct among scored exam-mode responses | 0.30-0.85 for most items **[C]** | `< 0.15` or `> 0.95` warn |
| **Point-biserial** (discrimination) | Corrected item-rest correlation | >= 0.25 good **[C]** | `< 0.15` weak; `< 0.05` review needed; `< 0` **key suspected** |
| **Distractor analysis** | Selection rate per option and the mean total score of those selecting it | Each distractor chosen by >= 5% of low scorers **[C]**; keyed option chosen most by high scorers | Distractor beats key = key suspected |
| **Time** | Median item time vs `est_time_seconds` | Within 2x | `> 2x` warn |
| **Rasch fit** | Infit/outfit mean-square | 0.7-1.3 | outside = misfit |
| **Exposure** | `item_exposure` rate vs `rMax` | below cap | over = excluded from assembly |

**Retire rules (extends 07 8.6):** retire if (a) confirmed key error; (b) negative discrimination after re-key check and no fix; (c) point-biserial < 0.05 after one revision cycle; (d) copyright/takedown; (e) outdated fact; (f) over-exposed without refresh. Retired versions keep serving past attempts (07). A fixed item = **new version**; its statistics start fresh. Re-evaluate after every 2,000 exposures (07).

**Pilot design caveat:** 07 computes `p_value` from exam-mode attempts only. The beta cohort therefore uses exam mode with a "Beta" banner; no unscored "embedded pilot items" mechanism exists in 07. Request R2 (Section 13): optional `pilot` flag so a few items per form can be administered but excluded from the learner's score.

### 3.12 Versioning

| Change | New what? | Stats | Note |
|---|---|---|---|
| Typo, punctuation, explanation edit | New `question_version` (minor); `change_note` | Carry over (flagged "edited") | Content hash changes (05) |
| Key variant added | New version | Carry over | Triggers re-score option only if scores change (07 8.6) |
| Option reworded, distractor replaced | New version (major) | Reset | Re-pilot |
| Passage/audio changed | New `stimulus` row with `supersedes_id` (05) and new item versions | Reset | Forms must be re-versioned (07 8.4) |
| Question concept replaced | New `question` (new code) | N/A | Old one retired |

Item code format: `IEL-R-000123`, `IEL-L-`, `IEL-W-`, `IEL-S-`, `GRE-V-`, `GRE-Q-`, `GRE-A-` (05 `question.code`). Stimulus codes: `STM-IEL-R-0042`. Mock form codes: `MOCK-IEL-AC-07`.

---

## 4. AI-assisted content pipeline

### 4.1 Principles

AI in `packages/ai` is already used for evaluation (D3). For content, we apply the same adapter pattern: prompt templates are versioned files, outputs are structured JSON validated by zod, and nothing is published automatically (07 8.5 "never auto-publishes").

### 4.2 Allowed and forbidden uses

| Use | Allowed? | Conditions |
|---|---|---|
| Draft reading passages from a **brief + fact ledger** | Yes | Human rewrites (>= 30% of sentences touched **[P]**), fact-checks, attests |
| Draft items, distractors, and explanations for our own passages | Yes | Blind re-key, bias review |
| Generate **variants** of our own items (numbers, names, context) | Yes | Each variant is a new item with new review; maths variants recomputed by script |
| Draft listening scripts | Yes | Human edit for natural speech (Sec 5.2) |
| Translate/adapt **Bangla scaffolds** (instructions, tips, explanations) | Yes | Native-speaker Bangla localiser reviews every string (Sec 11) |
| TTS for drills, examiner prompts (07 8.3), vocab | Yes | Licence + labelling (Sec 5.4) |
| Caption drafts (STT) | Yes | Human-corrected, `source='auto'` flag cleared on approval (10 8.6) |
| Alt-text drafts | Yes | Human check |
| Summarise our own transcripts for show notes | Yes | Human check |
| **Publish without human review** | **No** | Service-level guard |
| **Paste or upload copyrighted/official material into a prompt** (Cambridge, ETS, Pearson, wire articles, paywalled sources) | **No** | Prompt linting blocks long verbatim blocks; policy |
| "Write a passage like Cambridge Test 14 Passage 2" or "recreate this question" | **No** | Prompts contain topic, level and structure only |
| Generate fake "official" materials, official-looking score reports, fake band descriptors, "ETS-approved" badges, fake examiner names | **No** | Never |
| Fabricate studies, statistics, quotations, experts or URLs | **No** | Fact ledger only |
| Use learner submissions to train or fine-tune a model | **No** without separate consent | Privacy (09) |
| Voice clone a real person without written consent | **No** | |

### 4.3 Prompt templates (stored in `packages/ai/prompts/content/*@vN.md`)

Variables are in `{{double braces}}`. Each template ends with a JSON schema instruction (zod-validated).

**T1 - Reading passage draft (`passage-draft@v1`)**
```
ROLE: You are an experienced item writer for an English proficiency test-preparation company.
TASK: Write an original {{wordCount}}-word academic passage for an IELTS-style Reading test.
TOPIC: {{topicTitle}}   TARGET LEVEL: CEFR {{cefr}} (IELTS band {{band}})
STRUCTURE: {{paragraphCount}} paragraphs labelled {{labels}}; {{structureNotes}}
FACTS: Use ONLY the facts in the ledger below. Do not add statistics, names, dates, studies or quotes that are not in the ledger. If a needed fact is missing, write [[NEED FACT: ...]] instead of inventing.
LEDGER: {{factLedgerJson}}
STYLE: neutral, informative, no first person, no brand names, no sensitive topics ({{sensitiveList}}).
CONSTRAINTS: Do not imitate any specific published passage. Include at most {{n}} words above the target level, each inferable from context.
OUTPUT JSON: { "title": "", "paragraphs": [{"label":"A","text":""}], "usedFactIds": [], "needFacts": [] }
```

**T2 - Items from our passage (`items-from-passage@v1`)**
```
Given the passage (ours, below), write {{n}} items of type {{typeId}} per the specification {{typeSpec}}.
For each item return: stem, options/blanks, key, accepted variants (if completion), evidence span (paragraph label + exact quote from the passage), and for each distractor the distractor type from {{distractorTypes}}.
Rules: stems must paraphrase, not copy, passage sentences; for NOT GIVEN statements, confirm no passage sentence supports or denies them; completion answers must satisfy {{wordLimitLabel}}; vary key positions.
OUTPUT JSON schema: {{itemSchema}}
```

**T3 - Listening script (`listening-script@v1`)**
```
Write a {{partType}} script ({{speakers}} speakers: {{speakerProfiles}}) of about {{words}} words for an IELTS-style Listening Part {{n}}.
Scenario: {{scenario}}. Level: {{cefr}}. Include natural spoken features: {{features}} (hesitations, self-correction of one detail, signposting phrases, one distractor where a speaker changes a detail, back-channel responses). Answers to the planned questions {{answerPlan}} must be spoken once clearly, with at least one plausible distractor.
Do not use real company names, public figures or places that could be confused with real ones.
Mark pauses with [pause 0.5s], emphasis with *word*, and each speaker with S1:, S2: ...
OUTPUT JSON: { "script": [{"speaker":"S1","text":"","direction":""}], "answerMap": [{"q":1,"answer":"","lineIndex":0}] }
```

**T4 - Explanation draft (`explanation@v1`)** - input: item JSON + passage; output: answer, evidence quote, distractor notes, skill tip within word limits (Sec 3.9). Bangla scaffold requested separately (T5).

**T5 - Bangla scaffold (`bn-scaffold@v1`)** - input: English instruction/explanation + glossary; output: natural Bangla (not literal), English exam terms preserved from the glossary, Latin digits for scores/numbers (08), no italics. Always reviewed by a human localiser.

**T6 - GRE maths variant (`gre-variant@v1`)** - structured formula-based generation, then a script recomputes the answer; the LLM never "computes" the final key.

**Prompt hygiene**: temperature low (0.2-0.5) for items, higher for scenarios **[P]**; store prompt text hash; no secrets; no learner data. Evaluation harness (in `packages/ai`) checks structured-output validity weekly.

### 4.4 Plagiarism and near-duplicate checks

| Check | How | When | Pass criterion |
|---|---|---|---|
| **Internal near-duplicate** | Word 5-gram shingling with Jaccard/containment, plus Postgres trigram (07 8.5) at import/submit; optional embedding cosine (pgvector would need adding to the stack - not in D3 **[U]**; offline script as interim) | Submit | Containment < 0.20 vs any item in the bank **[P]** |
| **Open-web overlap** | Search 8-10-word distinctive shingles from the passage and items in a search engine API, and/or a commercial plagiarism checker (Copyleaks/Turnitin class; price and licence not researched **[U]**) | Before `in_review` | No match above 0.10 **[P]** except fact phrases/definitions with citation |
| **Official-material resemblance** | **Human**: reviewer who owns legitimate copies of the current Cambridge/ETS books reads the final item and answers "does this resemble a known official item or passage (topic+structure+wording)?" | In review | Pass/fail checklist item (07 9.4) |
| **Do not ingest official books into any system** | Digitising purchased books to build a similarity index is itself copying; do it only if counsel approves (L4) | Policy | Default: **no** |
| **LLM memorisation risk** | Models may regurgitate training text. Mitigation: prompts give topic + ledger only; the open-web check; human rewrite | Always | |
| **Audio** | TTS of our own script only | | |

### 4.5 Fact-check step and hallucination controls

1. A human (the "researcher") creates the **fact ledger**: each claim has `claimId`, claim text, **two independent sources** (URLs/citations), retrieval date. Primary sources preferred (agencies, journals).
2. The draft's `usedFactIds` is compared to the ledger by script; any sentence containing a number, name, date or causal claim not mapped to a `claimId` is flagged.
3. A second person verifies a random 30% sample of claims against the sources, and **100% of claims in the 4 launch mocks per course** **[P]**.
4. For invented but realistic exam context (e.g. a fictional company in GT Reading, a fictional lecture), mark `fictional=true` in provenance; no real people, no fake quotes attributed to real people, no invented statistics presented as real in lessons.
5. Hallucination risks: fabricated citations, wrong dates, plausible-but-false science, invented word etymologies (GRE vocab), incorrect maths. Controls: ledger-only prompts, script recomputation, human SME for science/maths.
6. Re-check facts annually (a "freshness date" in provenance; stale facts such as population figures are updated or the item uses "approximately" with a year).

### 4.6 Provenance record (per item, stimulus, audio, video, PDF)

05 has `created_by`, `reviewed_by`, `change_note`, `content_hash` on `question_version` and `owner_id` on `stimulus`, but no AI-provenance fields. **Request R1 (Section 13): add a `content_provenance` table.** Proposed shape:

```ts
// proposed: packages/db/src/schema/assessment.ts (request to 05; not yet in the DB doc)
export const contentProvenance = pgTable('content_provenance', {
  id: pk(),
  subjectType: text('subject_type').notNull(),      // 'question_version' | 'stimulus' | 'media_asset' | 'lesson' | 'pdf'
  subjectId: uuid('subject_id').notNull(),
  authorId: uuid('author_id').references(() => user.id),            // human author
  aiAssisted: boolean('ai_assisted').notNull().default(false),
  aiTasks: text('ai_tasks').array(),                // ['draft_passage','draft_items','explanation','translation','tts','captions']
  modelId: text('model_id'),                        // e.g. 'claude-…' / 'eleven_…' (exact id string)
  promptTemplate: text('prompt_template'),          // 'passage-draft'
  promptVersion: text('prompt_version'),            // 'v1'
  promptHash: char('prompt_hash', { length: 64 }),
  factLedgerId: text('fact_ledger_id'),
  humanEditShare: numeric('human_edit_share', { precision: 3, scale: 2 }),   // optional estimate
  fictional: boolean('fictional').notNull().default(false),
  sourceNote: text('source_note'),
  similarityReport: jsonb('similarity_report'),     // {internalMax, webMax, checkedAt}
  factCheckedBy: uuid('fact_checked_by').references(() => user.id),
  biasReviewedBy: uuid('bias_reviewed_by').references(() => user.id),
  keyVerifiedBy: uuid('key_verified_by').references(() => user.id),
  reviewedBy: uuid('reviewed_by').references(() => user.id),        // editor sign-off
  signedOffAt: tstz('signed_off_at'),
  licenseNote: text('license_note'),
  createdAt: createdAtCol(),
});
```
`publishQuestionVersion()` (07 8.1) additionally refuses when `ai_assisted = true` and `signed_off_at` or `reviewed_by` is null, or `reviewed_by = author_id`.

### 4.7 Human editor sign-off

| Gate | Who | Records |
|---|---|---|
| G1 Brief approved | Content lead | brief id |
| G2 Fact ledger approved | Editor/SME | ledger id |
| G3 Draft rewritten | Item writer | edit share, attestation |
| G4 Checks passed (similarity, fact, bias, blind re-key) | Editor + QA | reports |
| G5 Publish | `content_editor` (not author) | `reviewed_by`, `signed_off_at` |

### 4.8 AI-assistance disclosure policy

| Where | Disclosure |
|---|---|
| "How we make our practice material" page (footer link) | Plain statement: content is written by our team; AI tools help draft and check; humans review every item; practice material is original and not an official test; voices in some audio are synthetic and labelled. |
| Synthetic audio | A small "Synthetic voice" tag on the audio player/transcript and in the lesson/quiz metadata; full-mock human-voice audio tagged "Recorded by voice actors" |
| AI-written Bangla scaffolds | Reviewed by Bangla localiser; no per-item label needed, covered by policy page **[C]** |
| Evaluations (AI scoring) | Already labelled (07 7.x) |
| PDFs | Colophon line: "Created by Lumen Academy with human editorial review; AI tools assisted drafting." |
| Regulatory | Check EU AI Act transparency expectations for synthetic audio when selling to EU users **[U]**; check Paddle/Stripe/Meta/Google ad policies on AI content **[U]** |


---

## 5. Listening audio production

Scope: exam-style Listening for IELTS (4 parts x 10 items, about 30 minutes of audio plus review time; 07 Appendix A.1 lists the exact timing as still to verify), GRE-adjacent audio, vocabulary pronunciation, Speaking examiner prompts (07 8.3: every Speaking prompt has an `audioAssetId` before publish), and Spoken English lessons.

### 5.1 Listening part design (what the audio must contain)

| Part | Format (07 1.2) | Speakers | Register | Typical answer types |
|---|---|---|---|---|
| 1 | Everyday conversation | 2 | Informal-neutral, bookings/forms | form/note completion, short answer, MCQ |
| 2 | Monologue, social context | 1 | Informal-neutral; guide, announcement | MCQ, map/plan labels, matching |
| 3 | Academic discussion | 2-4 | Semi-formal; tutor + students | MCQ, matching, sentence completion |
| 4 | Academic lecture | 1 | Formal, dense | note/summary completion |

Audio length per part in 07 is about 450 s as `audioSecondsApprox` **[V: 07 blueprint]**. Of that, speech is about 4.5-6 minutes and the rest is instructions, reading pauses and transitions **[P]**.

### 5.2 Script writing: natural spoken features

| Feature | Rule | Example |
|---|---|---|
| Hesitation / fillers | 1-3 per minute in conversations; fewer in lectures; never over a target answer | "Um, let me see..." |
| Self-correction | One per Part 1-3; the **first** mention is the distractor, the correction is the key | "It's Thursday - no, sorry, Friday at nine." |
| Signposting | Monologues/lectures: "There are three points...", "Moving on to...", "To sum up" | |
| Back-channel | "Right", "Mm-hm", "I see" in dialogues | |
| Distractors | Every item has at least one plausible wrong candidate in earshot (a number, name or option mentioned and then rejected) | |
| Answer order | Answers appear in the order of the questions within a section; no more than one answer in two seconds | |
| Spelling items | Names are spelled aloud at natural pace; avoid unusual names without spelling | |
| Numbers, times, dates | Use varied formats (9.30 / half past nine; 12th May / May twelfth) | |
| Speech rate | Part 1: about 140-160 wpm; Parts 3-4: about 150-170 wpm **[C]** (tune after pilot) | |
| Length | Draft words = target speech seconds x wpm / 60; verify by timing the final read | |
| Pauses | 30 s before each section to read questions and 30 s check after (follow 07 timing config) | |
| Clarity | No overlapping speech during answer content; light overlap only in Part 3 non-target moments | |
| Names/places | Fictional or neutral; avoid real institutions as authorities | |
| Linguistic diversity | At least one speaker per mock with a non-native-sounding professional accent is acceptable only when the role makes sense (e.g. international student) | |

Script file standard: Markdown or Google Doc with speaker tags, `[pause]` marks, answer map, and a line-by-line **timing sheet** filled after recording (feeds 07 `audioEvidence` start/end ms).

### 5.3 Speaker casting plan

IELTS Listening is recorded with a range of English accents (British, Australian, New Zealand, North American, Canadian and others) **[C]**; the exact list is not retrieved. Our casting matrix:

| Accent | Share of mock speakers (target) **[P]** | Typical role |
|---|---|---|
| British (RP and regional-light) | 30% | Tutors, receptionists, lecturers |
| Australian | 20% | Guides, students |
| North American (US) | 20% | Students, presenters |
| New Zealand | 10% | Managers, narrators |
| Canadian | 10% | Admissions staff |
| Other educated English accents (Irish, South African, Indian-English professional) | 10% in practice sets only **[P]** | Variety for Spoken English |

Gender and age: aim for roughly 50/50 male/female per mock; young adult (18-30), adult (30-55), senior (55+) across mocks; do not give all authority roles to one gender or accent.

### 5.4 Voice actors versus TTS

| Option | Strengths | Weaknesses | Use at Lumen |
|---|---|---|---|
| **Human voice actors** | Natural hesitations, intonation, real accents, authenticity; clean legal position with a buy-out contract | Cost, scheduling, retakes, multi-timezone | **Full mocks** (the 4 launch mocks per course), flagship practice sets |
| **TTS (ElevenLabs, Amazon Polly, Azure, Google, OpenAI)** | Cheap, instant, easy revision | Flat prosody, odd stress, limited true accent coverage, less natural disfluency, disclosure and licence duties | Drills, vocab/pronunciation examples, Speaking examiner prompts, quick revisions, GRE vocabulary examples |
| **Hybrid** | Human for dialogue content, TTS for rapid fixes and instruction prompts | Voice mismatch | Instruction/announcement voice is a single stable voice per exam family |

**Pricing and licence facts**

| Provider | Price facts | Commercial-licence status |
|---|---|---|
| ElevenLabs | Starter USD 6/month (first month USD 1); Creator USD 22/month (first month USD 11; includes 275,000 TTS characters); Pro USD 99; Scale USD 299; Business USD 990; per-usage TTS: v4 and v3 USD 0.08 per 1K characters; v4 Turbo / Flash USD 0.04 per 1K characters; prices exclude taxes **[V: elevenlabs.io/pricing/api, fetched 2026-11-07]** | The page states **music** commercial use needs Starter or higher **[V]**. Whether commercial use of generated *speech* and each library voice is allowed on each plan, and attribution duties, **must be read in the ElevenLabs terms before purchase [U]**. Do not use cloned or "voice library" voices of real people without checking their licence. |
| Amazon Polly (per 1M characters) | Standard USD 4, Neural USD 16, Long-Form USD 100, Generative USD 30 **[V: secondary source offlinetts.com reviewed 1 Aug 2026; official page aws.amazon.com/polly/pricing not read]** | AWS service terms; verify **[U]** |
| Google Cloud TTS | Ranges roughly USD 4-160 per 1M characters **[low confidence, secondary: costbench]** | Verify **[U]** |
| Azure AI Speech / OpenAI TTS | Prices **not retrieved** | OpenAI usage policies are understood to require disclosing that voices are AI-generated to end users **[U]**; verify both providers' commercial and disclosure terms |

**Cost sketch (planning, not quote)**: The research estimated a 30-minute IELTS section as about 4,500 words / 27,000 characters, about USD 2.2 per take on ElevenLabs at USD 0.08 per 1K characters and about USD 0.43 on Polly Neural **[V inference in research]**. Because 30 minutes includes pauses and instructions, spoken text in a real test is probably nearer 2,800-3,500 words (about USD 1.4-1.7 per take on ElevenLabs) **[P]**. Budget **5-10 regenerations per section** for pronunciation and pacing fixes, so TTS cost per Listening test is a few dollars; the real cost is editor time.

**Voice-actor sourcing and rates [U]**: No Bangladeshi or marketplace (Fiverr, Voices.com) rates were verified. Native British/Australian/NZ/Canadian/US voices are likely to be sourced from international marketplaces or expatriate/teacher networks in Dhaka; planning range in Section 9.6 is **an assumption** to be replaced by quotes.

### 5.5 Multi-speaker production

| Step | Practice |
|---|---|
| Recording | Record each speaker as a **separate track**, same room tone and mic distance; for remote actors, specify mic position and send a reference clip; never mix a bright and a dull mic without matching EQ |
| Directing | Remote direction on a call; actors read the whole script once, then target lines; capture 2 takes of every answer-bearing line |
| Conversation timing | Assemble in a DAW; keep natural gaps (0.2-0.6 s) and light overlaps in non-answer areas |
| TTS dialogue | Generate per speaker per line, then arrange on a timeline; avoid single-voice "read as two people" |
| Ambient | Minimal; at most low background (cafe, office) at least 18 dB below speech **[C]**, none during answers in Part 4 |
| Instruction voice | One consistent "examiner/announcer" voice per exam family (UK RP female/male) |
| Safety | Never include real brand jingles or recognisable music |

### 5.6 Technical specification

| Item | Spec | Basis |
|---|---|---|
| Master recording | WAV or FLAC, **48 kHz / 24-bit**, mono per speaker track | **[C]** |
| Master mix | 48 kHz / 24-bit WAV, mono (speech) | **[C]** |
| Delivery | **44.1 kHz** AAC-LC (`.m4a`) at 96-128 kbps, mono; Opus (`.opus`/WebM) 64-96 kbps as optional secondary; transcript VTT beside it | Brief; 07 8.2 requires >= 44.1 kHz |
| Loudness (spoken word) | **-16 LUFS integrated for stereo; -19 LUFS integrated for mono**; **true peak <= -1 dBTP**; loudness range (LRA) <= 7 LU **[P]** | **Industry convention** (podcast/broadcast practice); not an IELTS spec. 07 8.2 validates the −19 to −16 LUFS ± 1 band. |
| Noise floor | **< -60 dBFS** in pauses (RMS) | Convention |
| Clipping | None (no samples at 0 dBFS); peaks -6 to -3 dBFS before limiting | Convention |
| Silence | No unintended silence > 2 s except planned pauses; planned pauses encoded as timing sheet | |
| Duration | Final file duration must match blueprint (07 8.4 sums per `time_limit_seconds` formula) | **[V]** |
| Channel | Mono delivery for speech (stereo files are downmixed) | Brief |

### 5.7 Editing chain (per track, then mix)

1. Import, sync, **trim** breaths and mouth clicks.
2. **High-pass filter** at 70-90 Hz.
3. **Noise reduction** (light; spectral/AI denoise tools such as RNNoise/Audacity/Reaper plug-ins, Adobe Podcast Enhance or iZotope RX class **[U: pricing/licence not researched]**). Do not over-process; artefacts are worse than noise.
4. **De-ess** (4-8 kHz) and gentle **EQ** (cut mud ~200-300 Hz, add presence ~3 kHz).
5. **Compression** 2:1-3:1, 3-5 dB gain reduction.
6. **Level-match** speakers (RMS within ~2 dB).
7. **Assemble** timeline with pauses and instruction voice.
8. **Master**: limiter at -1.0 dBTP; loudness normalise to target.
9. **Measure** with ffmpeg (two-pass `loudnorm` in measuring mode) and check; sample command:

```bash
# measure
ffmpeg -hide_banner -i in.wav -af loudnorm=I=-19:TP=-1.0:LRA=7:print_format=json -f null -
# deliver (mono, 44.1 kHz, AAC 96 kbps)
ffmpeg -i master.wav -ac 1 -ar 44100 -af loudnorm=I=-19:TP=-1.0:LRA=7 -c:a aac -b:a 96k out.m4a
```
(Syntax per ffmpeg `loudnorm` filter; verify on the installed version **[U]**. A single-pass normalise is less accurate than two-pass with measured values.)

Tools: Audacity (free), Reaper (low-cost licence **[U]**), DaVinci Resolve Fairlight (free), Adobe Audition (paid). Standardise on one project template.

### 5.8 File naming and metadata

| Convention | Pattern | Example |
|---|---|---|
| Master | `LUM_AUD_<exam>_<skill>_<mock|set><nn>_<part>_<lang>_v<nn>_master.wav` | `LUM_AUD_IELAC_L_MOCK07_P3_en_v02_master.wav` |
| Delivery | same stem + `_dlv.m4a` | `..._dlv.m4a` |
| Script | same stem + `_script.md` | |
| Transcript | `.vtt` (timed) and `.txt` | `..._en.vtt` |
| Timing sheet | `.csv` with `question, start_ms, end_ms, answer` | feeds `audioEvidence` |
| Contracts | `contracts/<actor>/<yyyy-mm>/` | |
| Metadata (ID3/MP4 tags + sidecar JSON) | title, exam, part, accent per speaker, speaker gender/age band, synthetic yes/no, TTS provider+voice id+plan, duration, LUFS, true peak, noise floor, created date, version, licence ref | |
| Storage | R2 `lumen-private-uploads/audio-masters/{assetId}/{uuidv7}.wav` (proposed prefix next to the existing `video-masters/` in 10 section 10) and `media_asset` row; delivery file to `media_asset` for the stimulus (05) | |

### 5.9 Accessibility transcripts

Every Listening stimulus has a transcript (07 8.2 requires it; also shown post-test only per 05 `stimulus.transcript`). For practice audio outside exams (lessons, vocab), the transcript is shown with the audio. Speaker labels in the transcript; Bangla gloss optional in Foundation courses. Timestamps in WebVTT allow highlight-while-playing in review mode.

### 5.10 Audio production workflow (tracking states)

`script_drafted -> script_approved (blind answer-order check) -> cast/booked -> recorded -> edited -> mastered -> QA (Sec 12.2) -> uploaded (R2 + media_asset) -> attached to stimulus -> blind re-key on final audio -> published`.

---

## 6. Video lesson production

### 6.1 Lesson formats

| Format | When | Production cost (relative) | Notes |
|---|---|---|---|
| **A. Talking head + slides** | Concept lessons (e.g. "Matching Headings strategy") | Medium | Instructor on camera in corner; slides full |
| **B. Screen-annotation** (slides/PDF/web, pen) | Worked examples on passages, GRE quant | Low | Voice + screen; show face at intro/outro |
| **C. Whiteboard / tablet drawing** | Maths (GRE), grammar diagrams | Low-medium | iPad/Wacom, Khan-style drawing |
| **D. Animated explainer** | Motivation, exam overview, process explanations | High | Use sparingly: 10-15% of minutes |
| **E. Worked example (instructor solves live-ish)** | Writing Task 1/2 build-ups, speaking answers | Medium | Real-time typing + voice |
| **F. Live recording cut-downs** | Best Q&A, evergreen explanations | Low (editing) | Sec 8 |

### 6.2 Length rules (micro-lessons)

| Rule | Value | Basis |
|---|---|---|
| Concept micro-lesson | **4-9 min** | Planning rule informed by Guo, Kim & Rubin (2014) |
| Worked example | 6-12 min, chaptered | **[P]** |
| Drill-walk-through clip | 2-4 min | **[P]** |
| Maximum single video | 12 min unless chaptered and flagged as a "deep dive" | **[P]** |

Evidence: Guo et al. analysed 6,902,358 video-watching sessions over 862 videos in 4 edX courses (all math/science) with 127,839 students; **length was the strongest predictor of engagement**; median engagement was at most 6 minutes regardless of video length; videos under 3 minutes had the highest engagement; for videos over 9 minutes students often stopped before the halfway point; recommendations: segment into chunks under 6 minutes, show the instructor's head at well-timed points, informal setting, Khan-style tablet drawings, edit out filler and long pauses **[V: Guo et al. PDF]**. This is 2012 STEM MOOC data; extending it to paid test-prep in Bangladesh is an **extrapolation** (research note). We therefore use 4-9 min as a design default and verify with our own `video_progress` events (10 8.6) after launch, adjusting if median watch time differs.

Benchmark: Udemy requires at least 720p, 16:9, dynamic visuals (static slide alone is low quality) and at least 30 minutes of video per course **[V: Udemy support]**. 10 Minute School's IELTS course lists about 50 hours across 54 videos (about 55 min each, our arithmetic) **[V: 10MS page]**, so micro-lessons are a differentiator rather than a market norm.

### 6.3 Pedagogical template for a micro-lesson

| Beat | Time (6-7 min lesson) |
|---|---|
| Hook / problem ("Why do I lose marks on Matching Headings?") | 0:00-0:25 |
| Learning outcome (one sentence) | 0:25-0:40 |
| Concept in 3 moves | 0:40-3:00 |
| Worked example on **our** passage | 3:00-5:30 |
| Common mistake + fix | 5:30-6:15 |
| Recap + next action ("Try 5 questions in Practice") | 6:15-6:45 |

### 6.4 Scripting template (one-page)

```
LESSON ID: LUM-LSN-IELAC-R-014   TITLE: Matching Headings: the 3-step method   LENGTH TARGET: 7:00   WPM: 150
LEARNER: Band 5.5-6.5   OUTCOME: By the end you can eliminate extra headings by main-idea mapping.
FORMAT: A (talking head + slides)   LANGUAGE: bn-led with English terms (see Sec 6.13)   INTERNATIONAL VERSION: en voice-over, same slides

#  | TIME | ON-SCREEN (slide / graphic)       | SPOKEN (verbatim)                           | NOTES
1  | 0:00 | Title card                       | "..."                                       | b-roll none
...
VISUAL RULES:  one idea per slide, <= 25 words/slide, text >= 40 px at 1080p, highlight reveal in sync with speech
ITEMS USED:    STM-IEL-R-0042 (our passage), Q-… (our items). Licences: original.
CAPTIONS:      en auto -> human; bn human
CHECKS:        Sec 12.3 video QA
SIGN-OFF:      writer / SME / editor / localiser / QA with dates
```
Word budget: 7:00 at 150 wpm is about 1,000 spoken words including slide-reading time **[P]**.

### 6.5 Slide design rules (link to 08 tokens)

| Rule | Spec |
|---|---|
| Palette | `fg` #1D1D1F on `canvas` #FBFBFD, accent "Lumen blue" #0A5CC5, success/warning/danger tokens for right/wrong marking (08 2.1). Dark theme slides optional for night-study videos using 08 dark tokens. |
| Typography | Inter (Latin) + Noto Sans Bengali (Bangla) per 08 2.2; Bangla size x1.06, line-height x1.2, no italics, no negative tracking; Latin digits for scores/numbers (08 2.2.2) |
| Size for mobile | Body text >= 40 px on 1920x1080 canvas (about 3.7% of height) **[P]**; many BD learners watch at 360p-480p (10 8.9/8.10 assume 360p/480p) so thin text and fine charts fail |
| Density | <= 25 words per slide, <= 3 bullets, one chart per slide |
| Motion | Simple fades/highlights (150-300 ms per 08), no flying text, no emoji icons, no stock "AI glow" (D8) |
| Contrast | >= 4.5:1 for text (08 verified pairs) |
| Template | Google Slides + Figma library with locked masters, shared `Lumen-slides` theme; export tokens from `tokens.css` |
| Branding | Small logo bug bottom-right, safe from player controls; no animated intros > 3 s |
| Exam content on slides | Only our own items; always show the unofficial disclaimer on first and last slide (07 9.5 text for the exam) |

### 6.6 Recording kit at three budgets

BDT figures are **planning ranges [P]** converted at an assumed BDT 120 per USD **[U: confirm current rate and local retail prices at Star Tech, Ryans, Daraz, Pickaboo, Bikroy]**. Brands are examples of the class, not endorsements.

| Item | **Starter (phone-based)** | **Mid** | **Pro** |
|---|---|---|---|
| Camera | Instructor's own recent smartphone, rear camera, 1080p/30, on tripod | Used/new mirrorless or good webcam (e.g. APS-C mirrorless class) | Mirrorless full-frame/APS-C with clean HDMI, 2 lenses |
| Microphone | Wired lavalier (Boya/Maono class) into phone via adapter | USB/XLR dynamic desk mic (Fifine AM8 / Maono PD200X class) or wireless lav (DJI Mic / Rode Wireless class) | Broadcast dynamic (Shure SM7B / Rode Procaster class) + audio interface/preamp |
| Audio interface | None | Basic 1-2 ch interface (Focusrite Solo / Behringer class) if XLR | 2-4 ch interface |
| Lighting | 1 ring light + window light | 2-point LED (key softbox + fill/back) with stands | 3-point LED panels + diffusion |
| Support | Phone tripod + clamp | Sturdy tripod, boom arm, pop filter | Tripod + teleprompter |
| Acoustic treatment | Blankets/quilts (kantha/lep), mattresses, rugs, curtains | Foam/panels on first reflections + blankets | Bass traps + panels + isolated room |
| Monitoring | Wired earbuds | Closed-back headphones | Studio headphones |
| Power | Power bank | UPS for PC/lights + stabiliser **[P]** | UPS + generator-free quiet circuit |
| Planning budget (BDT) | **~BDT 8,000-20,000** extra (lav + stand + light + blankets) | **~BDT 80,000-180,000** | **~BDT 3-6 lakh** |
| Best for | Pilot videos, solo instructor, screen-annotation | Core launch library | Flagship intro courses, brand video |

Decision: launch with **Mid for the 3-4 lead instructors** and **Starter for guest/part-time contributors**; upgrade after the first revenue month **[P]**.

### 6.7 Studio room setup in a Dhaka apartment

| Problem | Mitigation |
|---|---|
| **Traffic, rickshaw/CNG horns, construction** | Choose an interior room away from the road; close windows; heavy curtains + quilts on windows; schedule recording **late night / early morning** when quieter **[P: test noise with a phone dB meter and a 60 s room-tone recording]** |
| **Generators / IPS inverter hum, load-shedding switchovers** | Test room tone with power on and off; run lights and PC on UPS so a power cut does not ruin a take; schedule around known load-shedding windows |
| **Call to prayer (azan)** | Five times a day at times that shift through the year; consult the local prayer timetable (e.g. Islamic Foundation Bangladesh) and **do not record within roughly ±10 minutes of azan** in nearby mosques; mark the timetable on the shared calendar **[P]**; use the 10-minute gap to review rather than re-record |
| **Ceiling fans / AC / fridge** | Fans and AC **off** while recording (record in 10-15 minute blocks); unplug or move noisy appliances; AC compressor cycling creates sudden noise; for hot weather use short blocks with cooling breaks |
| **Echo (bare concrete rooms, tiled floors)** | Rugs on floor, bookshelves, a wardrobe full of clothes behind the mic, mattress/duvet wall, blankets hung from curtain rods. Test with a clap: no flutter echo |
| **Hot/humid, monsoon rain on rooftops** | Avoid rain recording unless the room is interior; keep gear away from humidity (silica gel, dehumidifier) |
| **Neighbours, children, delivery bells** | "Recording" sign on door; message building security; use a recording time window; keep a spare take plan |
| **Phones and notifications** | Airplane mode, Do Not Disturb, laptop notifications off |
| **Lighting consistency** | Block windows with blackout curtains and use only LED lights for consistent colour; avoid mixing daylight and warm bulbs |

### 6.8 Camera settings

| Setting | Spec | Notes |
|---|---|---|
| Resolution | **1080p** (or 4K recorded and downscaled in edit for better quality) | Bunny library caps encoded resolutions per 10 8.2 (1080p only for lectures flagged `hd`) |
| Frame rate | **30 fps** house standard | Bangladesh mains is 50 Hz **[C]**; with non-flicker-free lights, 30 fps / 1/60 shutter can show banding. **Test a 20-second clip under our lights.** If banding appears, switch the whole series to **25 fps / 1/50** and keep all material at 25 fps. |
| Shutter | **1/60** at 30 fps (rule: about 2x frame rate); 1/50 at 25 fps | Brief |
| Exposure | Manual; ISO as low as possible (<= 800 for phones/APS-C) | Use lights, not ISO |
| White balance | Manual Kelvin (e.g. 5000-5600 K for daylight-balanced LED); same value for the whole series | |
| Focus | Eye autofocus off or locked after focusing on the eyes; fixed aperture | |
| Framing | Medium close-up, eyes on upper third; headroom ~ one hand; 16:9 | |
| Codec | H.264/H.265 8-bit, 50-100 Mbps recording where available | |
| Lens/phone | Rear camera, not selfie camera; clean the lens | |

### 6.9 Audio chain for video

| Stage | Practice |
|---|---|
| Mic position | 15-20 cm from mouth, slightly off-axis, pop filter; lav 15-20 cm below chin |
| Level | Peaks -12 to -6 dBFS; 24-bit recording |
| Recorder | Record audio into the camera **and** a backup (phone recording voice memo, or recorder) if possible; clap at the start for sync |
| Processing | Same chain as Sec 5.7 (high-pass, denoise, de-ess, compress) |
| Loudness | **-16 LUFS integrated, stereo (dual-mono), true peak <= -1 dBTP** **[C]** |
| Music | Optional light bed under intro/outro only; music licence on file (Sec 1.5) |

### 6.10 Screen recording and editing

| Task | Free | Paid |
|---|---|---|
| Screen recording | **OBS Studio** (free) | Screen Studio (Mac), Camtasia |
| Editing | **DaVinci Resolve (free)**, CapCut (free/paid tiers - check commercial-use terms **[U]**) | Premiere Pro, Camtasia, Final Cut |
| Text-based editing, filler removal, transcription | Descript (free tier limits and licence for commercial use **[U]**; check price) | Descript paid |
| Captions | Auto from `SttProvider` (Deepgram per D3), human-corrected | |
| Graphics | Figma, Google Slides, Canva (check licence of stock assets **[U]**) | After Effects, Motion |
| Presenter prompt | Teleprompter app / script on second screen | |

Screen capture rules: 1080p, 30 fps, cursor highlight, zoom on the active area, disable notifications, hide bookmarks, use a clean browser profile, never show real learner data.

### 6.11 Export spec (master) and Bunny

| Parameter | Value |
|---|---|
| Container / codec | MP4, **H.264 High profile**, 8-bit, 4:2:0, BT.709 |
| Resolution / frame rate | **1920x1080**, same as source (30 or 25 fps) |
| Bitrate | **~8 Mbps** VBR (target; 12 Mbps max), 2-pass if the editor offers it |
| Audio | **AAC-LC, 48 kHz, 192 kbps**, stereo, -16 LUFS integrated, <= -1 dBTP |
| Keyframe interval | 2 s |
| Fast start | `moov` atom at start (web-optimised) |
| Filename | `LUM_VID_<course>_<lessonKey>_<lang>_v<nn>_master.mp4` |
| Upload | Studio -> TUS direct to Bunny (10 8.2) **and** copy of master to R2 `private-uploads/video-masters/{assetId}/{uuidv7}.mp4` (10 8.x portability) |
| Bunny processing | Bunny transcodes to an HLS ladder (360p/480p/720p default; 1080p when flagged `hd`) per 10 8.2; do **not** pre-encode ladders ourselves |
| Size limit | Max 5 GB per file **[P in 10]** |

An 8 Mbps 1080p video is about 3.6 GB per hour (8 Mbps x 3600 / 8 = 3.6 GB), so a 7-minute lesson is about 420 MB.

### 6.12 Captions, chapters, thumbnails

| Item | Rule |
|---|---|
| Captions | **English** and **Bangla** tracks (`.srt`/`.vtt`; Studio converts SRT -> VTT, validates cues: monotonic, < 7 s each, <= 2 lines per 10 8.6). English: STT draft -> human correction. **Bangla: human-written/corrected** (automatic Bangla recognition quality was not researched **[U]**). |
| Line length | <= 42 characters per line in English **[C]**; Bangla lines kept short enough for two lines at mobile size **[P]** |
| Reading speed | <= 17 characters per second in English **[C]** |
| Speaker labels and sound cues | Only when needed |
| Chapters | 3-6 per lesson with titles in the viewer's language (`lesson.chapters` per 10 8.6) |
| Thumbnails | 1280x720; consistent template (title <= 6 words, instructor face, Lumen accent), readable at 160 px wide; Bangla and English variants; no misleading claims ("guaranteed band 8") |
| Alt for slides | Slide notes include alt text for key images; the lesson page carries a text summary |

### 6.13 Bangla/English bilingual delivery rules

| Question | Decision |
|---|---|
| Which language does the instructor teach in? | **Bangladesh catalogue: Bangla-led with English terms** (Foundation, Core strategy lessons). **International catalogue: English-only version of every lesson** (D10 "every Bangla-first asset has an English international counterpart"). |
| Exam content (passages, questions, audio, model answers, band descriptors paraphrased) | **English only** (never translated); only instructions/explanations are localised |
| Separate tracks vs code-switching | Preferred: **separate video files per language** (bn-led and en) for each lesson, because a single audio track with code-switching limits reuse and captions. Code-switching **within** the bn-led file is allowed under rules below. |
| Code-switching rules | 1) Technical terms stay in English with a Bangla gloss at first use (Task Response, paraphrase, skimming). 2) One main language per sentence; do not switch mid-sentence unless naming a term. 3) Reading aloud exam text and model answers = English only. 4) Numbers/scores in Latin digits (08). 5) A consistent **bilingual glossary** (Google Sheet) is the single source. |
| Cost control | Re-use the same **slides/visuals** across languages; replace voice-over and captions only. If the instructor is talking-head, the English version may be recorded as a separate talking-head in the same shoot day. |
| Quality | Native Bangla localiser reviews Bangla scripts and captions; native-level English reviewer reviews the English version |

### 6.14 Instructor on-camera guidelines

| Topic | Guidance |
|---|---|
| Clothing | Solid mid-tone colours (navy, teal, charcoal, off-white). Avoid white (blows out), black on black, tight stripes/checks (moire), large logos; neutral jewellery; fit for local norms and international audience |
| Eye line | Look at the lens for hook and recap; glance at script via teleprompter close to lens |
| Pace | **~140-160 wpm** English **[C]**; Bangla delivery in a similar syllable pace; pause 0.5 s at section changes |
| Energy | Warm, calm, conversational; "teach one learner" |
| Posture and gestures | Hands visible occasionally; avoid constant pen clicking |
| Breaks | Water, no dairy before long takes; 10-minute break per hour |
| Mistakes | Pause 3 s and restart the sentence (easier to edit); do not talk over errors |
| Accuracy | Never claim "the exam always..." or guarantee scores; stay within the fact ledger |
| Likeness release | Signed (Sec 1.8) |

### 6.15 Video QC and versioning

QC checklist: Section 12.3. Versioning: lesson identity is `lesson.stable_key` (05 3.3); each re-shoot or re-edit is a new `media_asset` attached to a new `course_version` lesson; learner progress survives via the stable key. **Re-shoot triggers**: factual error, outdated exam format (e.g. rule change), copyright issue, audio failure, instructor leaves (sunset plan in contract). Minor fixes use **overlays/patch inserts** (corrected text bar, replaced 5-second segment) instead of full re-shoots when the fix is <= 10% of the video.

---

## 7. Written materials

### 7.1 Lesson articles (Tiptap)

| Rule | Detail |
|---|---|
| Storage | Tiptap JSON (D3) with KaTeX for maths and Shiki for code |
| Structure | Title, outcome sentence, 3-6 sections, worked example, "Try it" link to practice, summary |
| Length | 400-900 words per article; images with alt; callouts for tips/mistakes (08 components) |
| Language | `en` and `bn` bodies stored as separate locale variants; exam text blocks marked `lang="en"` |
| Bangla typography | 08 2.2.2 rules apply to rendering |
| Review | Same gates as items (Sec 4.7); content_editor publishes |

### 7.2 PDFs: workbooks, vocabulary books, model answers

| Product | Pages (typical) | Trim | Binding if printed |
|---|---|---|---|
| Strategy summary / cheat sheet | 2-8 | A4 | n/a (digital) |
| Practice workbook | 64-128 | A4 | Wiro/spiral or perfect-bound |
| Vocabulary book (GRE/IELTS) | 160-320 | B5 | Perfect-bound |
| Model answers (Writing, Speaking) | 120-240 | B5 or A4 | Perfect-bound |
| Mock-test booklet (print-at-home) | 24-48 | A4 | Stapled/digital |

Typesetting toolchain options (pick one at P1; recommendation in bold):

| Option | Bangla support | Notes |
|---|---|---|
| **HTML/CSS -> PDF via headless Chromium (Playwright `page.pdf`)** | Good shaping through the browser engine (HarfBuzz) **[C]** | Reuses 08 design tokens and fonts; print CSS (`@page`, bleed) works; PDF is RGB so a prepress step converts to CMYK for books |
| Typst | Supports complex scripts **[U: verify Bengali conjunct quality]** | Fast templating |
| LaTeX (XeLaTeX/LuaLaTeX + fontspec/polyglossia) | Capable, steeper | |
| Affinity Publisher / InDesign | Strong print workflow; InDesign needs South Asian text engine for Bengali **[U]** | Good for final flagship books |
| React-PDF | Already used for invoices (10 6.4); complex-script handling must be tested **[U]** | Not for long books |

### 7.3 Fonts

Inter (Latin), Noto Sans Bengali (primary Bangla), Hind Siliguri (dense tables), JetBrains Mono (code) per 08 2.2.1; embed subsets in PDFs; confirm SIL OFL licence files. Do not embed SF Pro. For a more "bookish" print feel, **Noto Serif Bengali** (OFL) can be used for long Bangla body text **[U: verify availability and quality]**. Latin digits for scores and question numbers.

### 7.4 Per-user watermarking

| Layer | Spec |
|---|---|
| Visible | Footer on every page: `masked email or phone . orderId[0:8] . date` and a diagonal tiled overlay at 6-8% opacity (same pattern as 07 9.3) |
| Invisible | PDF metadata: order id, user id hash, build id; optional text steganography is P2 and needs accessibility review (07 9.3) |
| Generation | Inngest job at download time stamps the master with `pdf-lib`/`qpdf`-class tooling **[U: choose and test]**; the stamped copy is a short-TTL signed URL (10: private downloads TTL 5 min); the **unstamped master** stays in R2 `private-uploads/pdf-masters/` |
| Limits | A watermark deters sharing; it is not DRM and we do not claim otherwise (07 9.3). Rate-limit downloads. |
| Free samples | Unstamped, with "Sample" label and only original content |

### 7.5 Print-ready specification for books (feeds `17-PRICING-MASTER` book products)

| Parameter | Spec **[C - confirm with the chosen Dhaka printer; none of these were verified with a Bangladeshi press]** |
|---|---|
| Trim sizes | **A4 210x297 mm** (workbooks); **B5 (ISO 176x250 mm)** (books). Local presses may use "demy" sizes; ask the printer **[U]** |
| Bleed | 3 mm on all sides for any art touching the edge |
| Safe margin | >= 10 mm from trim; inner margin (gutter) +5 mm for perfect binding |
| Colour | **CMYK**; convert from sRGB with a known ICC profile (e.g. coated/uncoated profile requested by the printer); text in 100K black; avoid thin rich-black text |
| Images | 300 dpi at final size; line art 600-1200 dpi |
| Fonts | Embedded (PDF/X-1a or PDF/X-4 per printer) |
| Page counts | Multiple of **4** for saddle-stitch (<= ~64 pages); multiple of **8 or 16** preferred for offset signatures; digital print is flexible |
| Binding | Saddle stitch (<= 64 pp), perfect binding (>= 64 pp), Wiro/spiral for workbooks that lie flat |
| Paper | Text: 70-100 gsm (cream or white offset; confirm opacity for double-sided answer writing); cover: 250-300 gsm art card + matt lamination |
| Cover | Spine width computed by printer from page count and paper; barcode zone for ISBN |
| ISBN and legal | ISBN allocation for Bangladesh through the national ISBN agency **[U: which body]**; copyright page with trademark disclaimers (07 9.5); disclaimer "Not affiliated with..." |
| Proofing | Digital proof + printed proof before run; colour bar if offset |
| Run length | Digital short run for first 200-500 copies **[P]**; offset for larger runs |
| Fulfilment | Courier (COD 1% handling charge at Steadfast **[V: tiers_live_books]**) or Rokomari-style retail; costs in 17 |
| Quality gate | PDF QA (Sec 12.4) |

Printing costs per page in Dhaka were **not researched [U]**; request quotes from at least 3 printers for 200/500/1000 copies of a 160-page B5 book and a 96-page A4 workbook, and record them in the cost model.

### 7.6 Digital PDFs for sale

Delivered through entitlements (D5) as downloadable assets; accessible PDF (tagged headings, alt text, reading order) is a goal **[P]**; file size < 25 MB.

---

## 8. Live session capture -> recorded asset pipeline

(Operational details of running live classes are in `18-LIVE-CLASSES.md`; this section covers only capture and conversion into learning assets. Platform choices are D3: P2 YouTube Live (unlisted) or Zoom; P3 LiveKit.)

| Stage | Action | Owner | Notes |
|---|---|---|---|
| 1. Consent | Joiners see a recording notice; the instructor agreement has the recording licence; minors need guardian consent (D7); learners can turn off camera/mic names | Ops | British Council India deliberately does not record classes for privacy **[V: BC FAQ]** - recording is a design choice; make the policy explicit per tier |
| 2. Capture | Cloud recording (Zoom) or YouTube Live archive; backup local OBS recording by the host | Instructor + TA | |
| 3. Ingest | `ingestLiveRecording` copies to R2 `private-uploads/live-recordings/{sessionId}.mp4` -> Bunny fetch -> `media_asset(source='live_recording')` (10 9.6) | System | |
| 4. Raw editing | Trim dead air, remove breaks, cut privacy-sensitive segments (learner names, faces, personal details); mute/blur | Video editor | |
| 5. Accuracy review | Instructor/SME corrects errors via on-screen text patch or cut | SME | |
| 6. Chapters + captions | Chapters by topic; English STT + human check; Bangla captions as needed | Editor/localiser | Same cue rules as 6.12 |
| 7. Packaging | **Replay lesson** (batch tier only) and optional **evergreen cut-downs** (2-8 min "best of Q&A") turned into library micro-lessons; each cut-down re-passes Sec 12.3 | Editor | Cut-downs must contain no reference to "today's class" |
| 8. Retention | R2 intermediate removed after Bunny `ready` + 7 days (10 9.6); original session archive kept per retention policy; learner questions stored per 09 | Ops | 10 section 10.4 lifecycle table lists a 30-day rule for live-recordings (inconsistency to fix in 10, see R6) |
| 9. Releasing | Replay visible only to the batch entitlement; cut-downs follow the tier of the course | Product | |

---

## 9. Content operations

### 9.1 Roles

| Role | Count at launch **[P]** | Responsibilities | Platform role (D4) |
|---|---|---|---|
| **Content Lead** (this document's owner) | 1 | Calendar, budgets, contracts, quality bar, legal QA owner, final say on release | `content_editor` + `admin` for Studio ops |
| **Item writers** (IELTS R/L/W/S, GRE V, GRE Q, AWA) | 4-6 freelancers (2 IELTS, 1 GRE-V, 1 GRE-Q, 1 flex) | Briefs -> drafts -> revisions | `instructor` (own drafts) |
| **SMEs** (GRE maths, science, language assessment) | 2 | Fact checks, difficulty review, blind re-keys | `content_editor` or `instructor` |
| **Editors** | 2 | Review, blind re-key, similarity, bias review, publish | `content_editor` |
| **Fact researcher** | 1 (part-time) | Fact ledgers | n/a (Notion) |
| **Instructors / presenters** | 3-4 | Scripts with SME, on-camera delivery | `instructor` |
| **Voice talent** | per project | Listening recordings | none |
| **Audio engineer / editor** | 1 | Record, edit, master, QA | n/a |
| **Video editor(s)** | 2 | Edit, captions, export | n/a |
| **Motion/graphic designer** | 1 | Slides, charts, maps, thumbnails | n/a |
| **Bangla localiser(s)** | 1-2 | Scaffolds, captions, bilingual glossary | `content_editor` (bn) |
| **Content QA** | 1 | Checklists (Sec 12), pilot analysis | `content_editor` |
| **Legal advisor** (external) | as needed | Sec 1.10 items | n/a |

### 9.2 RACI (R = does it, A = accountable, C = consulted, I = informed)

| Activity | Content Lead | Writer | SME | Editor | Instructor | Audio/Video | Localiser | QA | Legal |
|---|---|---|---|---|---|---|---|---|---|
| Curriculum map (14/15) | A | C | R | C | C | I | I | I | I |
| Topic bank + briefs | A | R | C | C | I | I | I | I | I |
| Fact ledger | A | C | R | C | I | I | I | I | I |
| Draft passage/items | I | R | C | A | I | I | I | I | I |
| Similarity + fact + bias checks | I | I | C | R | I | I | I | A | I |
| Blind re-key | I | I | R | A | I | I | I | C | I |
| Publish item | A | I | I | R | I | I | I | C | I |
| Listening script | A | R | C | C | I | I | I | I | I |
| Audio recording/edit | A | I | I | C | I | R | I | C | I |
| Video script | A | C | R | C | R | I | C | I | I |
| Video record/edit/export | A | I | I | C | R | R | I | C | I |
| Captions en/bn | A | I | I | C | I | R | R | C | I |
| Bangla scaffolds | A | I | I | C | I | I | R | C | I |
| PDF books | A | C | C | R | I | R | C | C | C |
| Contracts and licences | R | I | I | I | I | I | I | I | C |
| Takedown | A | I | I | R | I | I | I | I | C |
| Pilot analysis and retirement | A | I | C | R | I | I | I | R | I |

### 9.3 Throughput estimates (all **[P]**: measure in the first 2-week sprint and replace)

| Task | Estimate per person-day | Assumptions |
|---|---|---|
| IELTS Reading passage (800-900 words) + 13 items, **with** fact ledger ready and AI draft | 0.6-1.0 passages | Experienced writer; ledger prepared by researcher |
| IELTS Listening part (script + 10 items) | 0.7-1.0 parts | Excluding audio production |
| IELTS Writing prompt + 3 band samples | 1.0-1.5 prompts (prompt+samples) | Samples need a second scorer |
| IELTS Speaking set (P1 frames, P2 card, P3 set) | 4-6 sets | |
| GRE Verbal (TC/SE) items | 14-20 items | RC: 1 passage + 4 items per 1.0-1.5 days |
| GRE Quant items | 12-20 items | STEM graduate, scripted check |
| Editor review (incl. blind re-key, similarity check) | 25-40 simple items; 8-12 passage sets | |
| Bias/sensitivity review (checklist) | 60-100 items | Done alongside editing |
| Task 1 visual (chart/map/process) | 1.5-3 visuals | Designer |
| Listening part recorded + edited (TTS) | 3-5 parts | Engineer |
| Listening part recorded + edited (human actors) | 1-2 parts per studio day + 1 edit day each | Remote or studio |
| Video lesson script (6-8 min) | 2 per writer-day (with AI outline) | SME review included separately |
| Recording (studio day with prepared scripts) | 6-10 finished lessons per instructor-day | Mid kit, no re-takes beyond 2 |
| Editing a finished 7 min lesson | 1.5-2.5 lessons per editor-day | Includes captions pass; Descript-type tool speeds filler removal |
| English caption correction | 8-15 lessons/day | |
| Bangla caption writing/correction | 4-8 lessons/day | |
| Bangla scaffolds | 800-1500 words/day | Localiser |

### 9.4 Launch volumes (what must exist for P1 IELTS + GRE)

Link to tiers (D10): Free has diagnostic + 1 sectional mock; Core has **4 full mocks**; Plus has **10 full mocks**. **Founder decision needed (Open Question Q1)**: ship Core with 4 mocks and Plus with "mocks 5-10 released monthly through launch + 12 weeks", or delay Plus until 10 exist. The table below assumes the first (recommended).

**IELTS Academic (launch gate)**

| Asset | Quantity | Derivation |
|---|---|---|
| Full mocks | 4 | D10 Core |
| Listening parts | 30 | 16 for mocks + 2 diagnostic + 12 practice |
| Reading passages | 26 | 12 for mocks + 2 diagnostic + 12 practice |
| Writing tasks (with 3 band samples each for mock tasks) | 26 | 8 mock (4 T1 visuals, 4 T2) + 2 diagnostic + 16 practice |
| Speaking sets | 15 | 4 mock + 1 diagnostic + 10 practice |
| Items (approx) | Listening 300, Reading 345 | 10 per part; 13.3 per passage |
| Task 1 visuals | 20 | charts, maps, processes |

**IELTS General Training (incremental to Academic)**: Listening, Speaking and Task 2 prompts are shared (identical structure, 07 1.2/1.3); GT-specific: **18 Reading sections** (12 for 4 mocks + 6 practice), **14 Task 1 letters**.

**GRE General (launch gate)**: AWA 20 prompts + 12 sample essays; Verbal about 400 items (about 14 RC passages x ~4 items, ~150 TC/SE items and remainder in mock pools); Quant about 500 items; four mocks built from `pool_assembled` with section-level adaptivity needing 3 tiers for second sections (07 4.x) - **simulation required before launch (07 4.6)**. Item numbers are **[P]**; the real numbers come from 15's blueprint and 07 4.5 composition quotas.

**Videos (assuming ~7.5 min average)**

| Track | Lessons | Finished minutes | Language plan |
|---|---|---|---|
| IELTS Academic + GT teaching | ~106 | ~800 | Bangla-led + English version |
| GRE Verbal/Quant/AWA | ~106 | ~850 | **English-first single master with Bangla captions** (recommended: GRE learners are graduates; saves cost; same master serves international) |
| English Foundation (A0-B1, Bangla-medium) if P1 | ~60 | ~400 | Bangla-led only (BD-specific) |
| Orientation/free sample lessons | 10 | ~70 | Both |

Total ~212-272 lessons, 28-35 hours **[P]**.

### 9.5 Production calendar (weeks before P1 launch T0; **[P]**, assumes curriculum maps 14/15 are final by T-24)

| Weeks | Milestones |
|---|---|
| **T-26 to T-24** | Hire/contract: item writers, 2 editors, localiser, designer. Contracts signed (Sec 1.8). Lawyer engaged (Sec 1.10). Style guide and templates (brief, script, slide). Studio room built and tested (Sec 6.7). |
| **T-24 to T-20** | Pilot sprint: produce 2 IELTS reading passages, 1 listening part, 20 GRE items, 3 video lessons end-to-end. Measure throughput; update Sec 9.3. Finalise prompts (Sec 4.3) and provenance table. |
| **T-20 to T-12** | Bulk production wave 1: Reading + Listening scripts for mocks 1-2; GRE Verbal/Quant mock pools; Task 1 visuals; 40 video lessons recorded. Weekly editor review. |
| **T-12 to T-6** | Wave 2: mocks 3-4; practice banks; remaining lessons; audio recording of mock Listening with actors; Bangla scaffolds in parallel. Internal piloting P0. |
| **T-8 to T-4** | **Beta cohort** (Sec 3.11) on mocks 1-2; statistics review; fix items. Legal QA (Sec 12.5) on all marketing and disclaimers; ETS trademark review submission (07 9.5, ~10 business days). |
| **T-4 to T-1** | Freeze: all items published; mocks assembled (07 8.4 `assertPublishable`); video QA; captions complete; PDFs produced; backup verified. |
| **T0** | Launch with 4 mocks per course. |
| **T+1 to T+12** | Mocks 5-10; remaining English-versions of IELTS lessons; item analytics reviews at 100 and 300 attempts; first retirements; Foundation track if deferred. |

### 9.6 Cost estimates in BDT for freelancers (all **[P]**; assumed BDT 120/USD **[U]**; accuracy +/-40%; excludes salaried staff and VAT)

| Item | Unit price range (BDT) | Notes |
|---|---|---|
| IELTS Reading passage + 13 items accepted | 5,000-8,000 | After review acceptance |
| IELTS Listening part script + 10 items | 4,000-6,500 | |
| IELTS Writing prompt + 3 band samples | 2,500-4,000 | |
| IELTS GT letter prompt + samples | 1,500-2,500 | |
| IELTS Speaking set | 1,000-2,000 | |
| GRE Verbal item (TC/SE) | 350-600 | |
| GRE RC passage + 4 items | 2,500-4,000 | |
| GRE Quant item | 300-600 | |
| GRE AWA prompt / sample essay | 700 / 1,500 | |
| Editor review per item | 120-250 | |
| Chart/map/process visual | 1,000-2,500 | |
| Voice actor (human, native accent) | **USD 10-40 per finished minute (BDT 1,200-4,800)** | **[U] No rates verified**; get 3 quotes; buy-out fee |
| Audio edit/master per Listening part | 1,200-2,500 | |
| TTS per Listening part | < BDT 500 + engineer time | ElevenLabs/Polly pricing in Sec 5.4 |
| Video script (SME) per lesson | 1,500-3,000 | |
| Instructor fee per finished lesson (if freelance) | 2,500-6,000 | Employee instructors replace this |
| Video editing per finished lesson | 1,500-3,500 | |
| English captions (correction) | 250-600 | |
| Bangla captions | 600-1,200 | |
| English voice-over version of a bn-led lesson | 3,000-5,000 | Re-record narration + re-time + captions |
| Bangla scaffold localisation | 600-1,200 per 1,000 words | |
| Legal review | 150,000-400,000 one-off | **[U]** quote needed |
| Mid recording kit x2 | 160,000-360,000 one-off | Sec 6.6 |
| Subscriptions (Descript, ElevenLabs Creator, Canva/Adobe, Google Workspace, Notion) | USD 100-250 / month | Sec 9.7 |

**Launch content budget sketch** (using mid-range prices) **[P]**:

| Block | Approx (BDT lakh) |
|---|---|
| IELTS Academic + GT text/items, visuals, review | 8.0 |
| IELTS audio (4 mocks with human actors; rest TTS) | 3.3 |
| GRE items, AWA, review | 6.2 |
| Video: ~212 lessons incl. English versions of IELTS | 25.0 |
| Bangla scaffolds and glossary | 1.5 |
| Legal + kit + subscriptions | 7.9 |
| Contingency 15% | 7.7 |
| **Total** | **~59 lakh (~USD 50k)** |

If Foundation (+60 lessons, ~BDT 6 lakh) ships in P1, add accordingly. Employing instructors and editors full-time changes the shape of the cost; this sketch is for planning freelancers only.

### 9.7 Tools

| Need | Tool | Notes |
|---|---|---|
| Task tracking | **Notion** (or Linear) boards per pipeline with status columns matching Sec 3.x/5.10 | Free tier may suffice; check |
| Item bank (authoritative) | **The platform Studio/Postgres** (07 8); Sheets only for drafts/import | Never treat Sheets as the bank of record |
| Trackers | Google Sheets: Topic Bank, Fact Ledger, Licence Register, Voice Casting, Bilingual Glossary, Cost Log | |
| Docs and scripts | Google Docs / Notion | |
| Asset exchange | **Google Drive** (shared drive) for WIP; Frame.io optional for video review comments **[U: pricing/availability]** | |
| Design | Figma + Google Slides template | |
| Video/audio | OBS, DaVinci Resolve, CapCut, Descript, Audacity/Reaper | Sec 5-6 |
| QA | ffmpeg scripts for loudness/duration; `tooling/` scripts for naming validation | |
| AI | `packages/ai` adapters; prompt repo | Sec 4 |

### 9.8 Folder structure, naming and storage

```
Lumen-Content/                       (Google shared drive - WIP only; the platform + R2 are the system of record)
  00_Admin/        contracts/  licences/  budgets/  policies/
  01_Topic-Bank/  fact-ledgers/
  02_IELTS/ academic/ gt/ {reading,listening,writing,speaking}/ <STM-code>/ (brief, draft, final, review, assets)
  03_GRE/ {verbal,quant,awa}/
  04_Audio/ scripts/ raw/ edit/ masters/ delivery/
  05_Video/ scripts/ slides/ raw/ projects/ masters/ captions/ thumbnails/
  06_Print/ books/ <product>/ source/ prepress/ proofs/
  07_Design/ figma-exports/ charts/ maps/
  08_Localisation/ glossary/ bn-scaffolds/ captions-bn/
  09_QA/ reports/ pilot-data/
  99_Archive/
```
Naming (all lowercase ASCII where a platform needs it; no spaces):

| Asset | Pattern | Example |
|---|---|---|
| Brief | `BR-<EXAM>-<SKILL>-<nnnn>` | `BR-IEL-R-0042` |
| Stimulus | `STM-<EXAM>-<SKILL>-<nnnn>` | `STM-IEL-R-0042` |
| Question | `<EXAM>-<SKILL>-<nnnnnn>` (05 `question.code`) | `IEL-R-000123` |
| Mock form | `MOCK-<EXAM>-<nn>` | `MOCK-IEL-AC-07` |
| Lesson | `LUM-LSN-<EXAM>-<SKILL>-<nnn>` + `stable_key` in platform | `LUM-LSN-IELAC-R-014` |
| Audio | Sec 5.8 | |
| Video | Sec 6.11 | |
| PDF | `LUM_PDF_<product>_<edition>_v<nn>_<print|web>.pdf` | `LUM_PDF_GRE-VOCAB_E1_v03_print.pdf` |
| Versions | `v01` increments in file; platform versions are authoritative | |

**Storage and backup (3-2-1 rule [C])**

| Layer | Where | Backup |
|---|---|---|
| Authoritative item/stimulus/lesson data | Neon Postgres (D3) | Daily backups + PITR; monthly restore drill (D7) |
| Masters (audio WAV, video MP4/project exports, PDF masters, design source) | R2 `lumen-private-uploads/{audio-masters, video-masters, pdf-masters}/` (video-masters already in 10 section 10; audio/pdf prefixes are proposed additions) | **R2 object versioning/lifecycle [U: confirm feature and configure]**; second copy to a different provider/bucket (e.g. Backblaze B2 or Google Drive archive) weekly **[P]**; local external SSD snapshot monthly |
| Delivery video | Bunny Stream library (HLS ladder) | Re-ingest from R2 masters; Bunny is not the master store (10 section 8.x portability) |
| WIP | Google Drive | Drive version history; weekly export of trackers to CSV in R2 |
| Raw footage/audio | Local disks -> R2 within 24 h of recording; delete raw after 90 days **[P]** unless flagged | Cost of storage is small (R2 ~USD 0.015/GB-month **[V: 10]**) |
| Contracts and licences | Drive `00_Admin` + encrypted copy in R2 | Annual audit |

---

## 10. Import formats

All imports go through the Studio `POST /studio/import` flow in 07 8.5: upload -> dry-run validation -> confirm -> creates **drafts only**; max 5 MB / 500 rows; duplicates by `content_hash` and trigram similarity.

### 10.1 JSON (`ImportBundleV1`, matches 07 8.5)

```json
{
  "bundleVersion": 1,
  "exam": "IELTS_ACADEMIC",
  "license": { "kind": "original" },
  "attestation": true,
  "stimuli": [
    {
      "key": "stm-r-0042",
      "kind": "reading_passage",
      "title": "Bees in the city",
      "body": { "type": "doc", "content": [ { "type": "paragraph", "attrs": { "label": "A" }, "content": [ { "type": "text", "text": "..." } ] } ] }
    }
  ],
  "questions": [
    {
      "code": "IEL-R-000123",
      "stimulusKey": "stm-r-0042",
      "skill": "reading",
      "difficulty": 3,
      "estTimeSeconds": 60,
      "tags": ["skill:reading", "topic:urban-ecology", "cefr:B2", "subtype:tfng"],
      "payload": {
        "type": "ielts.tfng",
        "content": { "statement": "Urban hives produce more honey than rural hives." },
        "answerKey": { "answer": "NOT_GIVEN" }
      },
      "explanation": { "type": "doc", "content": [ { "type": "paragraph", "content": [ { "type": "text", "text": "The passage compares biodiversity, not honey yield..." } ] } ] }
    },
    {
      "code": "IEL-R-000124",
      "stimulusKey": "stm-r-0042",
      "skill": "reading",
      "difficulty": 3,
      "tags": ["skill:reading", "topic:urban-ecology", "cefr:B2"],
      "payload": {
        "type": "ielts.sentence_completion",
        "content": {
          "mode": "free_text",
          "wordLimit": { "maxWords": 2, "numberAllowed": false },
          "layout": { "layout": "sentences", "items": [ { "id": "s1", "segments": [
            { "kind": "text", "text": "City hives benefit from a wide variety of " },
            { "kind": "blank", "blankId": "b1" },
            { "kind": "text", "text": " in gardens." } ] } ] }
        },
        "answerKey": { "blanks": [ { "blankId": "b1", "accepted": ["flowering plants", "flowering species"] } ], "anyOrderGroups": [] }
      }
    }
  ]
}
```

**Proposed `ImportBundleV2` additions (request R3)** - each question gets an optional provenance block that maps to `content_provenance` (Sec 4.6):
```json
"provenance": { "authorEmail": "writer@example.com", "aiAssisted": true, "aiTasks": ["draft_items"], "modelId": "<exact model id>",
                "promptTemplate": "items-from-passage", "promptVersion": "v1", "factLedgerId": "FL-0042", "fictional": false,
                "sourceNote": "Facts from ledger FL-0042", "similarity": { "internalMax": 0.07, "webMax": 0.03 } }
```
Until V2 exists, authors paste a one-line `source_note` (CSV/JSON field exists) and the Studio form records AI use.

### 10.2 CSV (simple items, matches 07 8.5)

Columns: `exam, type, stimulus_key, skill, difficulty, est_seconds, tags, stem, option_a, option_b, option_c, option_d, option_e, correct, explanation, license, source_note`. Type-specific: `gre.qc` adds `quantity_a, quantity_b, given_info, correct`; `gre.numeric_entry` adds `answer`, `entry`; `gre.text_completion` uses `[[b1]]` in `stem` plus `b1_options`, `b1_correct`; completion groups use `b1_accepted` with `|`.

```csv
exam,type,stimulus_key,skill,difficulty,est_seconds,tags,stem,option_a,option_b,option_c,option_d,option_e,correct,explanation,license,source_note
GRE,gre.mc_single,,quant,3,90,"skill:quant;topic:ratios;cefr:C1","A mixture has milk and water in the ratio 3:2. If 5 liters of water are added, the ratio becomes 3:3. How many liters of milk were in the mixture?",6,9,10,12,15,B,"Let milk = 3k and water = 2k...",original,"Original; variant of in-house item GRE-Q-000044"
GRE,gre.sentence_equivalence,,verbal,4,60,"skill:verbal;topic:vocab;cefr:C1","Despite the author's ____ tone, the review praised her argument.",austere;lavish;stern;jocular;frank;boisterous,,,,A;C,"...",original,"Original"
```
(Examples are illustrative; check each against 07 type rules before use. Arithmetic of the first example must be re-verified by a script before it is imported.)

### 10.3 Import QA rules

1. Run a **local validator** (`tooling/validate-import`) using the same zod schema as the server before uploading; fail on warnings that 07 treats as errors.
2. CSV is UTF-8 with BOM-free header, `;` inside multi-value cells, `|` for accepted variants; Bangla text only in `explanation_bn` columns or locale variants (Sec 11).
3. Each import file lists its `license.kind` and `attestation` explicitly; imports of mixed provenance are split.
4. File naming: `import_<exam>_<skill>_<yyyymmdd>_<writer>.json`.

### 10.4 QTI 3.0 interoperability (optional, P3)

QTI 3.0 final was published in May 2022; it is **not backward compatible with QTI 2.x**; XSD files are public; a certification validator exists; example packages are downloadable **[V: 1EdTech blog]**. We would **export** (not import) QTI 3.0 packages from our bank only if an LMS/university partner requires interoperability. Proposed mapping (all **[U]** until validated against the spec and a conformance tool):

| Our type | QTI 3.0 interaction (candidate) | Caveat |
|---|---|---|
| `ielts.mcq_single`, `gre.rc_single`, `gre.mc_single`, `gre.qc` | `choiceInteraction` (`maxChoices=1`) | `gre.qc` fixed A-D wording; no shuffle |
| `ielts.mcq_multi`, `gre.mc_multi`, `gre.sentence_equivalence`, `gre.rc_multi` | `choiceInteraction` (`maxChoices=n`) | Our all-or-nothing/partial rules via response processing templates |
| `ielts.tfng`, `ielts.ynng` | `choiceInteraction` (3 options) | |
| `ielts.match_*` | `matchInteraction` or `gapMatchInteraction` | `reusable` maps to match max |
| `ielts.*_completion` (free text) | `textEntryInteraction` + `mapping` for accepted variants | Normalisation (07 3.1.2) must be reproduced in response processing or documented as a difference |
| word-bank completion, `gre.text_completion` | `inlineChoiceInteraction` / `gapMatchInteraction` | |
| `ielts.diagram_label_completion`, `ielts.map_label` | `graphicGapMatchInteraction` / `hotspotInteraction` | Image alt text mandatory |
| `gre.numeric_entry` | `textEntryInteraction` (float base type) | Range/rational acceptance via custom operator |
| `gre.rc_select_in_passage` | `hottextInteraction` | |
| `ielts.writing_task`, `gre.awa_issue` | `extendedTextInteraction` | AI/human scoring is external |
| `ielts.speaking_part` | `uploadInteraction` / external | No standard speaking interaction assumed **[U]** |
| Audio/passages | Shared stimulus (`assessmentStimulus`) | Licence metadata in `qti-metadata` |

Implementation note: the exporter is a pure function over `QuestionVersionPayload` in `packages/core/src/exam-engine/qti` (P3), tested with the 1EdTech validator; importing third-party QTI is out of scope.

---

## 11. International version production

### 11.1 Principle

> **Master in English. Localise the teaching layer into Bangla. Re-voice, don't re-make.** Exam items (passages, questions, audio, keys, rubrics) are English everywhere and are **shared**. What differs is the explanation language, examples, pricing and regional marketing.

### 11.2 Shared versus re-made

| Asset | Shared across BD and international? | Work for the international version |
|---|---|---|
| Passages, questions, keys, accepted variants | **Shared** | None. Ensure neutral contexts (Sec 3.8) |
| Listening audio and transcripts | **Shared** | None |
| Speaking cue cards/prompts, Writing prompts, charts | **Shared** | Charts carry data in neutral units; avoid BDT-only examples in scored items |
| Mock tests (forms) | **Shared** (same `test_form`) | Pricing and entitlement differ (17) |
| Explanations (items) | English master; **Bangla scaffold** added for BD | International shows English only |
| Video lessons (IELTS) | **Re-voiced**: BD = Bangla-led; international = **English-only voice-over** on the same slides/b-roll, or English talking-head | English script is the master, not a literal translation of the Bangla; captions English (and optionally other languages later) |
| Video lessons (GRE) | **English-first single master** with Bangla captions/scaffold for BD | No re-record needed |
| Foundation (A0-B1 Bangla-medium) | BD-only | International counterpart is the Spoken English / general English track (planned) |
| PDFs | BD edition with Bangla scaffolds; international edition English-only | Typeset from the same source with locale switch |
| Marketing pages | Different copy and examples | Pricing pointer: international prices are USD in 3 purchasing-power regions (D10); canonical in `17-PRICING-MASTER.md` |
| Examples and cultural references | **Neutral** in scored content; local colour only in BD lessons | Instructors avoid assuming the learner's location |
| Legal text | Same disclaimers (07 9.5) | Add local VAT/tax display per 10 |
| Instructor | Same or different; international English lessons may use accents familiar to global learners | Pronunciation review |

### 11.3 Localisation workflow (en master -> bn scaffolds)

```
EN master (item/explanation/script/slide)  ->  extract translatable strings (Studio i18n namespace content.*)
   ->  Bangla localiser drafts (human-first; MT/AI as a first pass allowed)  ->  glossary check  ->  second reader (Bangla-fluent editor)
   ->  in-context review in Studio preview (bn locale)  ->  QA (typography per 08: size x1.06, line-height x1.2, no italics, Latin digits)  ->  publish as locale variant
```

| Rule | Detail |
|---|---|
| What is localised | Instructions, explanations, tips, UI strings, lesson text, video voice-over/captions for BD, email/SMS copy |
| What is never localised | Exam passages, items, audio, keys, official terms (IELTS/GRE names), band numbers, score labels' numerals |
| Glossary | Single bilingual glossary of test terms (Task Response, paraphrase, skimming, distractor); owned by localiser; version-controlled |
| Machine assistance | Allowed as first draft (T5 prompt); human sign-off mandatory |
| Quality | Bangla review checks meaning, register (Bangla standard rather than overly Sanskritised or purely colloquial), consistency; sampling 100% of explanation bn strings for launch mocks, 30% afterwards **[P]** |
| Change control | If the English master changes, mark bn variants `stale` and block publish until updated |
| Tools | Studio locale variants (`bn`) and Google Sheets glossary; i18n files in `packages/config`/messages for UI only |

---

## 12. Checklists

Use as tickable lists in Notion and, where possible, as automated Studio gates. "Gate" = who can sign.

### 12.1 Item QA (per item/stimulus set)

| ID | Check | Gate |
|---|---|---|
| IQ-01 | Brief ID and fact ledger referenced; topic from Topic Bank | Writer |
| IQ-02 | Originality attestation ticked; `license='original'` or valid `license_ref` | Writer |
| IQ-03 | Provenance record complete (author, AI tasks, model id, prompt version) | Writer |
| IQ-04 | Item type matches spec (Sec 3.1) and passes 07 8.3 validators with no errors; warnings acknowledged | Studio |
| IQ-05 | Word limit label correct and all accepted answers within limit | Studio + Editor |
| IQ-06 | Accepted variants complete (UK/US, numerals) and not over-generous | Editor |
| IQ-07 | Distractors each tied to a reason; homogeneous; no cross-reference options | Editor |
| IQ-08 | Evidence spans / audio timestamps present (07 8.1 #5) | Editor |
| IQ-09 | **Blind re-key** by non-author passed (07 8.1 #3); second blind key for launch mocks/GRE | Reviewer |
| IQ-10 | Similarity scans: internal, web; official-material resemblance check by human | Editor |
| IQ-11 | Fact-check complete for all claims; fictional flag set if applicable | Researcher |
| IQ-12 | Bias/sensitivity checklist passed (Sec 3.8) | Editor |
| IQ-13 | Readability/CEFR within target; difficulty estimate recorded | Editor |
| IQ-14 | Explanation present, within limits, accurate (Sec 3.9) | Editor |
| IQ-15 | Maths recomputed by script; KaTeX renders | SME |
| IQ-16 | Tags and metadata: skill, topic, cefr, difficulty 1-5, est time | Writer |
| IQ-17 | Reviewer is not the author (service-enforced) | System |
| IQ-18 | Answer distribution across the form acceptable (07 8.4 warnings) | Editor |
| IQ-19 | Bangla scaffold (if required) reviewed and not stale | Localiser |
| IQ-20 | Published; pilot plan scheduled | Content Lead |

### 12.2 Audio QA

| ID | Check | Spec |
|---|---|---|
| AQ-01 | Script approved and answer-order verified | Sec 5.2 |
| AQ-02 | Speakers and accents match casting sheet; synthetic voices labelled | Sec 5.3-5.4 |
| AQ-03 | Master 48 kHz/24-bit; delivery 44.1 kHz AAC 96-128 kbps mono | Sec 5.6 |
| AQ-04 | Integrated loudness -19 LUFS mono (-16 stereo) +/- 1 | Sec 5.6; 07 8.2 check |
| AQ-05 | True peak <= -1 dBTP, no clipping | |
| AQ-06 | Noise floor < -60 dBFS in pauses; no hum, hiss, mouth clicks, plosives | |
| AQ-07 | No unplanned silences > 2 s; planned pauses match timing config | 07 8.4 duration formula |
| AQ-08 | Pronunciation of names and answers verified by a native listener | |
| AQ-09 | Answers audible once, with distractors present | |
| AQ-10 | Timing sheet complete (`audioEvidence` ms) | |
| AQ-11 | Transcript matches audio exactly; VTT timed | |
| AQ-12 | Metadata/tags and file name per Sec 5.8; masters saved in R2 | |
| AQ-13 | Voice/music/licence records on file | Sec 1.8 |
| AQ-14 | Blind re-key done on the **final audio** | Sec 3.10 |

### 12.3 Video QA

| ID | Check | Spec |
|---|---|---|
| VQ-01 | Script signed (writer/SME/localiser) and matches final speech | Sec 6.4 |
| VQ-02 | Length within rule (4-9 min or flagged exception) | Sec 6.2 |
| VQ-03 | Technical: 1080p, same fps as plan, no flicker/banding, in focus, exposure OK, WB consistent | Sec 6.8 |
| VQ-04 | Audio: -16 LUFS +/- 1, <= -1 dBTP, no noise bursts (azan, horns), clear speech | Sec 6.9 |
| VQ-05 | Slides legible at 360p on a phone; fonts and colours per tokens; <= 25 words/slide | Sec 6.5 |
| VQ-06 | Facts and examples correct; band/score claims not guaranteed; official-exam names used nominatively | |
| VQ-07 | No third-party content without licence (images, music, clips) | Sec 1.5 |
| VQ-08 | No learner personal data visible | |
| VQ-09 | English captions human-corrected; Bangla captions human-written; cue rules (<7 s, <=2 lines) pass | Sec 6.12 |
| VQ-10 | Chapters present; thumbnail made (bn/en) | |
| VQ-11 | Export spec met; master saved to R2; Bunny encode `ready`; plays on Android Chrome 3G/4G emulation and iPhone Safari | Sec 6.11; 10 |
| VQ-12 | Watermark overlay does not hide key content | 10 8.7 |
| VQ-13 | Accessibility: no flashing > 3 Hz, captions on by default option, transcript available | |
| VQ-14 | Metadata: lesson key, language, version, instructor, licence | |
| VQ-15 | Content Lead sign-off | |

### 12.4 PDF QA

| ID | Check | Spec |
|---|---|---|
| PQ-01 | Content passed IQ checklist; exam items identical to published bank versions (no drift) | |
| PQ-02 | Fonts embedded; Bangla conjuncts render correctly (stress strings from 08 2.2.2) | Sec 7.3 |
| PQ-03 | Trim size, margins, bleed (print) as specified | Sec 7.5 |
| PQ-04 | CMYK conversion done with printer's ICC; no RGB-only elements in print PDF | |
| PQ-05 | Images 300 dpi; no pixelation; alt text/tagged PDF for digital edition | |
| PQ-06 | Page count multiple of 4 (saddle) or printer's signature requirement | |
| PQ-07 | Trademark disclaimers and copyright page present (07 9.5); ISBN barcode if retail | |
| PQ-08 | Cross-references, page numbers, ToC, index links correct | |
| PQ-09 | Watermark footer renders and is legible; stamped copy generated | Sec 7.4 |
| PQ-10 | File size < 25 MB (digital); print proof approved (physical proof for print) | |
| PQ-11 | Answer keys appear only in answer sections; no leaked keys in free samples | |
| PQ-12 | Master stored in R2 with version | |

### 12.5 Legal QA

| ID | Check |
|---|---|
| LQ-01 | Every asset has `license` and `license_ref` (where not original) and a contributor contract on file |
| LQ-02 | No text/audio/image taken from Cambridge, ETS, Pearson, IDP, British Council, other prep publishers, or wires |
| LQ-03 | No recalled/leaked exam material; no photocopy/PDF-derived material |
| LQ-04 | CC BY / OGL attributions present (Sec 2.6) and in `/legal/credits` |
| LQ-05 | No CC BY-SA adapted into our proprietary bank; no CC BY-NC(-SA) used |
| LQ-06 | VOA-derived items verified VOA-exclusive with provenance log; VOA branding absent |
| LQ-07 | Band-descriptor/rubric text is our paraphrase with link to official PDF; no verbatim paste without written permission |
| LQ-08 | Trademark: names used nominatively; correct disclaimer text (07 9.5) on all required surfaces; no official logos |
| LQ-09 | Voice actors: buy-out signed; no cloning; TTS plan permits commercial use; synthetic label applied |
| LQ-10 | Music, fonts, stock images, icons licensed for commercial use; licence PDF stored |
| LQ-11 | Instructor likeness/voice release signed; learner-contributed content consent on file |
| LQ-12 | Pirated/photocopied material was never used (writer attestation); breach -> immediate retirement + audit |
| LQ-13 | AI-assistance disclosure page up to date; provenance complete |
| LQ-14 | Marketing claims reviewed: "estimated" scores, no guaranteed outcomes beyond approved terms (02/17), no "official" or "authorised" claims |
| LQ-15 | Takedown contact visible; process tested (Sec 1.9) |
| LQ-16 | Lawyer items L1-L7 closed or accepted as risk by founder |

---

## 13. Requests to other documents and open questions

### 13.1 Requests (this doc proposes; the owner doc decides)

| # | To | Request |
|---|---|---|
| R1 | 05-DATABASE | Add `content_provenance` table (Sec 4.6) and optional `stimulus.created_by`; add tag kinds for `topic`, `cefr`, `subtype` (07 8.1 #6 already notes the gap) |
| R2 | 07-TEST-ENGINE | Optional `pilot` flag for unscored field-test items inside a live form (Sec 3.11) and a `status:pilot`/`beta` form label |
| R3 | 07 8.5 | `ImportBundleV2` with `provenance` (Sec 10.1) |
| R4 | 07 8.2 | Studio audio check to also compute **true peak (-1 dBTP)** and **noise floor (< -60 dBFS)**, not only LUFS/clipping/silence |
| R5 | 10-PAYMENTS-VIDEO-INTEGRATIONS | Add `audio-masters/` and `pdf-masters/` prefixes under `lumen-private-uploads`; add per-user PDF stamping job to the downloads section |
| R6 | 10 | Reconcile live-recording retention: 9.6 says delete the R2 intermediate 7 days after Bunny `ready`, the lifecycle table says 30 days |
| R7 | 08-UI-UX-DESIGN-SYSTEM | Export slide-deck tokens (Google Slides theme / Figma library) and a print stylesheet token set (CMYK-safe equivalents) |
| R8 | 14/15 curricula | Confirm lesson counts (Sec 9.4) and RC passage/word ranges (Sec 3.1) |
| R9 | 17-PRICING-MASTER | Use Sec 7.5 print specs for book product costing; cost of goods inputs from Sec 9.6 |
| R10 | 18-LIVE-CLASSES | Adopt Sec 8 consent and recording rules; decide which tiers receive replays |

### 13.2 Open questions for the founder

| # | Question | Recommendation |
|---|---|---|
| Q1 | Must Plus ship with 10 mocks on day one? | **RESOLVED (D10, 2026-11-07): no.** Launch with >= 5 full mocks per exam and reach 10 by about day 120 (2027-08-15 in 17); the pricing page shows "5 now, 10 by <date>"; never sell a count the library cannot serve |
| Q2 | Is GRE video English-first (with Bangla captions) acceptable? | Yes (Sec 9.4) |
| Q3 | Budget for human voice actors on the 4 launch mocks (about BDT 3.3 lakh incl. IELTS audio) versus TTS-only at launch? | Human for mocks; TTS elsewhere |
| Q4 | Employee instructors vs per-lesson freelancers? | Employees for 2 lead instructors if volume exceeds ~100 lessons per instructor |
| Q5 | Will we ever purchase official books for reviewer resemblance checks (counsel decision L4)? | Yes, purchase retail copies; no digitisation |
| Q6 | Foundation track in P1? | Decide with 14; adds ~BDT 6 lakh and 60 lessons |

---

## 14. Unverified-facts register (everything tagged [U] above)

| # | Item | Where | How to verify |
|---|---|---|---|
| U1 | Bangladesh Copyright Act 2023: term, assignment formalities, moral rights, first ownership | 1.1, 1.10 | IP lawyer |
| U2 | Nilkhet/New Market photocopy market (general knowledge only) | 1.2 | Field observation, press |
| U3 | Whether there is a Cambridge IELTS 21 / newer Official GRE guide | 1.2 | cambridge.org, ets.org |
| U4 | Project Gutenberg licence terms and trademark rules; PD status across US/UK/BD | 1.5 | gutenberg.org/policy |
| U5 | OpenStax licence and per-figure exceptions | 1.5 | openstax.org |
| U6 | UK OGL v3.0 text and attribution statement | 1.5 | nationalarchives.gov.uk |
| U7 | UN portals' terms; BBS reuse permission | 1.5, 2.2 | Each portal; BBS letter |
| U8 | VOA Learning English still operating | 1.5 | voanews.com |
| U9 | IELTS band-descriptor quotation permission; IELTS trademark notice wording | 1.4 | IELTS copyright form, brand guidelines |
| U10 | ETS rules on quoting AWA guide; POWERPREP terms | 1.4 | ets.org terms, trademarks@ets.org |
| U11 | ElevenLabs speech commercial-use rights per plan; Polly/Azure/Google/OpenAI TTS prices, licences, disclosure rules | 5.4 | Provider terms pages |
| U12 | Voice-actor rates (international and Bangladeshi) | 5.4, 9.6 | 3 quotes |
| U13 | Retail prices of kit (BDT) and exchange rate | 6.6, 9.6 | Star Tech, Ryans, Daraz |
| U14 | CapCut/Descript commercial-use terms and pricing | 6.10 | Vendor terms |
| U15 | Automatic Bangla captioning quality | 6.12 | Pilot with Deepgram/Whisper/Bunny |
| U16 | Spec tables for IELTS/GRE passage lengths and Listening timing (07 Appendix A) | 3.1, 5.1 | Official handbooks via 14/15 |
| U17 | Bengali typesetting quality in Typst / InDesign (South Asian engine) / React-PDF | 7.2 | Test render of stress strings |
| U18 | Dhaka printing costs, paper stock, trim names (demy), ISBN agency | 7.5 | 3 printer quotes |
| U19 | R2 object versioning/lifecycle support for masters | 9.8 | Cloudflare docs |
| U20 | Frame.io, Reaper, pgvector, plagiarism-API pricing and availability | 4.4, 9.7 | Vendor pages |
| U21 | QTI 3.0 interaction mapping | 10.4 | 1EdTech spec + validator |
| U22 | EU AI Act / platform policies on AI audio disclosure | 4.8 | Counsel |
| U23 | `ffmpeg loudnorm` command on deployed version | 5.7 | Run on sample |
| U24 | Flicker behaviour at 30 fps / 1/60 under 50 Hz mains and chosen lights | 6.8 | 20 s test clip |
| U25 | Azan windows and quiet-hour assumptions for the chosen apartment | 6.7 | Room-tone test |
| U26 | IELTS-CEFR alignment table and RC length ranges | 3.3, 3.1 | Cambridge / ETS publications |

Evidence summary: items marked **[V]** come from the research round (Cambridge Book Shop; ThriftBooks; IELTS.org copyright statement; VOA copyright page; LibriVox; CC wiki; ElevenLabs pricing; offlinetts (secondary) for Polly; Udemy support; Guo et al. 2014; 1EdTech QTI blog; British Council FAQ; 10 Minute School pages; Steadfast T&C) or from locked blueprint documents (00, 05, 07, 10). Everything else is convention, assumption or unverified and labelled.

---

## Change log
- 2026-11-07 - First draft (Head of Content Production). Needs founder answers Q1-Q6 and lawyer items L1-L7 before content wave 1.

---

## Backlog cross-reference (added by the delivery lead, 2026-11-07)

**Final IDs: see 12 Appendix J.** This doc proposed requests R1-R10 and the import/provenance flow; they became these tasks: provenance table and publish gate P1-58; ImportBundleV2, CSV templates and `tooling/validate-import` P1-59; studio audio QA (true peak, noise floor) P1-60; test-form builder with unscored pilot items P1-61; content drafting pipeline P1-62; per-user PDF stamping P1-57; brand kit export P1-99; doc edits R5-R10 P0-54. Resolved question **Q1** (D10): ship Plus with **>= 5 full mocks at launch and 10 by about day 120** (each GRE full mock is about 114 original items); the pricing page shows "5 now, 10 by <date>" from data (task P1-71); human gate BG-14 tracks mock-library readiness. Q2-Q6 remain founder items.
