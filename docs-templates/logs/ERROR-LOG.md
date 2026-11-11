# Error Log (APPEND-ONLY - never edit or delete earlier entries; add a new entry that supersedes)

> Purpose: stop repeating mistakes. Agents read only the last ~40 lines (to get the next ID) or `grep -n "<keyword>"`.
> Add via `/log-error`. Fields must come from real output; write "unknown" rather than guess.

## Entry template
```
### ERR-NNNN - <short title>
- Date (UTC): YYYY-MM-DD   Task: P?-xx   Tool/model: claude-sonnet | gemini | human   Device: <host>
- Symptom: what was observed (user-visible or CI-visible)
- Error text (<=15 lines, no secrets/PII):
- Root cause (layer: validation | authz | query | race | UI state | tooling | dependency | env | process):
- Fix: files + commit SHA (or "pending")
- Prevention: test / lint rule / hook / doc rule / backlog ID added
```

---
<!-- entries below, oldest first -->
