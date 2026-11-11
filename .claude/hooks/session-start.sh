#!/usr/bin/env sh
# SessionStart hook: stdout is injected as context (verify against installed version). Never blocks; always exit 0.
root=${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}
cd "$root" 2>/dev/null || exit 0
cat >/dev/null 2>&1 || true

echo "== Lumen session context =="
echo "Device: $(hostname -s 2>/dev/null || echo unknown) ($(uname -s))   UTC: $(date -u +%FT%TZ)"

if git rev-parse --git-dir >/dev/null 2>&1; then
  # fetch with a hard network timeout (works without GNU timeout; safe on flaky links)
  GIT_TERMINAL_PROMPT=0 GIT_HTTP_LOW_SPEED_LIMIT=1000 GIT_HTTP_LOW_SPEED_TIME=8 git fetch --quiet origin 2>/dev/null \
    || echo "WARN: git fetch failed/offline - remote state unknown; do not assume you are up to date."
  branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
  echo "Branch: $branch @ $(git rev-parse --short HEAD 2>/dev/null)"
  git status -sb 2>/dev/null | head -n 15
  if git rev-parse --abbrev-ref '@{u}' >/dev/null 2>&1; then
    set -- $(git rev-list --left-right --count 'HEAD...@{u}' 2>/dev/null)
    ahead=${1:-0}; behind=${2:-0}
    [ "$behind" -gt 0 ] && echo "WARN: branch is BEHIND its remote by $behind commit(s). Run: git pull --rebase  (before any edit)."
    [ "$ahead" -gt 0 ] && echo "NOTE: $ahead unpushed commit(s). Push after the next green verify."
  else
    echo "NOTE: no upstream for '$branch' yet (first push: git push -u origin $branch)."
  fi
  if [ "$branch" != "main" ] && git rev-parse --verify origin/main >/dev/null 2>&1; then
    n=$(git rev-list --count 'HEAD..origin/main' 2>/dev/null || echo 0)
    [ "$n" -gt 0 ] && echo "NOTE: origin/main has $n commit(s) not in this branch (rebase before opening PR)."
  fi
  [ -n "$(git status --porcelain 2>/dev/null)" ] && echo "WARN: working tree is dirty - find out why before starting new work (maybe an interrupted session)."
else
  echo "WARN: not a git repository."
fi

echo "-- Current task (docs/PROGRESS.md) --"
if [ -f docs/PROGRESS.md ]; then
  awk '/^## Current task/{f=1;next} /^## /{f=0} f' docs/PROGRESS.md \
    | grep -E '^(id|title|status|branch|owner_model|subagent|notes):' | head -n 8
else
  echo "docs/PROGRESS.md missing"
fi

echo "-- Last session log --"
last=$(ls -1 docs/logs/sessions/[0-9]*.md 2>/dev/null | sort | tail -n 1)
if [ -n "$last" ]; then
  echo "$last"
  sed -n '/^## Next step/,/^## /p' "$last" | sed '1d;/^## /d' | grep -v '^$' | head -n 4
else
  echo "(none yet)"
fi

if [ -f docs/HANDOFF.md ]; then
  b=$(grep -E '^- Branch:' docs/HANDOFF.md | head -n 1)
  [ -n "$b" ] && echo "-- HANDOFF baton -- $b"
fi
echo "Rules: one device per branch; verify before claiming done; commit WIP at least every 30 min; /checkpoint before risky steps."
exit 0
