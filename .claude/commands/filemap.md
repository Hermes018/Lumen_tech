---
description: Regenerate docs/FILEMAP.md (and check docs/ARCHITECTURE-MAP.md) from file header comments
argument-hint: "[--check]"
---
Args: $ARGUMENTS
1. If `tooling/filemap.ts` does not exist yet, stop: it is backlog task P0-47. Do not improvise a different script.
2. Run `pnpm filemap $ARGUMENTS` (writes docs/FILEMAP.md; with `--check` exits non-zero if stale, writes nothing).
3. Report: count of files listed, files MISSING a purpose header (top 15), and whether `docs/ARCHITECTURE-MAP.md` still names every domain folder in `packages/core/src/` (diff the two lists).
4. Offer (do not do unasked) a `lint-fixer`/`docs-scribe` Haiku batch to add one-line header comments to the missing files. Commit regenerated FILEMAP as `docs(filemap): regenerate`.
