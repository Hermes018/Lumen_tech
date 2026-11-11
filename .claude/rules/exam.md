---
paths:
  - "packages/core/src/attempts/**"
  - "packages/core/src/scoring/**"
  - "packages/core/src/adaptive/**"
  - "apps/web/app/api/exam/**"
  - "apps/web/app/**/(exam)/**"
  - "packages/ai/**"
---
# Exam / scoring / AI-evaluation rules
- D6 invariants: server owns `ends_at`; client timer is display-only; autosave 10 s + 1 s debounce; late submit > deadline + 30 s rejected; exam-mode offline replay only within grace; practice mode any time; attempts pin question_version_ids.
- Time is injected; every deadline test uses a fake clock (no `Date.now()` in domain code).
- Scoring tables are DATA files with golden tests. Every displayed band/score is labelled "estimated". Official exam names only with the trademark disclaimer.
- GRE adaptivity is section-level; the routing decision is stored server-side and cannot be client-forged.
- AI evaluation: user text delimited as data; zod-validated JSON output; rubric/prompt version stored with each result; golden-set regression gate must pass; cost + rate capped; never give the LLM tools.
- Exam facts (section lengths, score ranges, rules) come ONLY from docs/07 or the research notes with a source; unknown = add to "Decisions needing the founder", never from memory (docs/22 section 4.6).
- Question content provenance: `original` | `licensed`. Never scrape or paraphrase real exam questions.
- Checklist docs/12 section 6.4; critical path -> two-key rule.
