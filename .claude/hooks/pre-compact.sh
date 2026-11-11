#!/bin/sh
# PreCompact hook: write a timestamped state snapshot to docs/logs/sessions/ (gitignored: snap-*.md). Never blocks.
root=${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}
cd "$root" 2>/dev/null || exit 0
input=$(cat 2>/dev/null)
if command -v jq >/dev/null 2>&1; then
  tp=$(printf '%s' "$input" | jq -r '.transcript_path // empty' 2>/dev/null)
  trig=$(printf '%s' "$input" | jq -r '.trigger // empty' 2>/dev/null)   # manual|auto (verify)
else
  tp=$(printf '%s' "$input" | sed -n 's/.*"transcript_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -n 1)
  trig=""
fi
dir=docs/logs/sessions
mkdir -p "$dir" 2>/dev/null || exit 0
out="$dir/snap-$(date -u +%Y%m%d-%H%M%S).md"
{
  echo "# State snapshot (PreCompact${trig:+, $trig}) - $(date -u +%FT%TZ)"
  echo
  echo "- Device: $(hostname -s 2>/dev/null)   Branch: $(git rev-parse --abbrev-ref HEAD 2>/dev/null)   HEAD: $(git rev-parse --short HEAD 2>/dev/null)"
  [ -n "$tp" ] && echo "- Transcript: $tp"
  echo
  echo "## Current task card"
  if [ -f docs/PROGRESS.md ]; then awk '/^## Current task/{f=1;next} /^## /{f=0} f' docs/PROGRESS.md | head -n 60; fi
  echo
  echo "## git status -sb"
  git status -sb 2>/dev/null | head -n 40
  echo
  echo "## Last 5 commits"
  git log -5 --oneline 2>/dev/null
  echo
  echo "## Diff stat vs main"
  git diff --stat origin/main...HEAD 2>/dev/null | tail -n 25
  echo
  echo "## After compaction, do this"
  echo "1. Re-read the Current task card above (it is the contract)."
  echo "2. Run: git status -sb && git log -5 --oneline"
  echo "3. Continue the next unfinished 'do' item; re-run pnpm verify before claiming anything."
} > "$out" 2>/dev/null
# retention: local snapshots older than 14 days
find "$dir" -name 'snap-*.md' -mtime +14 -delete 2>/dev/null
exit 0
