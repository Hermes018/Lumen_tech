#!/bin/sh
# Stop hook: append ONE terse line to the active session log. Non-blocking, deduplicated, never fails.
root=${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}
cd "$root" 2>/dev/null || exit 0
cat >/dev/null 2>&1 || true
git rev-parse --git-dir >/dev/null 2>&1 || exit 0
dir=docs/logs/sessions
mkdir -p "$dir" 2>/dev/null || exit 0
today=$(date -u +%F)
log=""
if [ -f "$dir/.current" ]; then
  p=$(cat "$dir/.current" 2>/dev/null)
  case "$p" in "$dir/$today"-*.md) [ -f "$p" ] && log=$p ;; esac
fi
[ -z "$log" ] && log=$(ls -1 "$dir/$today"-claude-*.md 2>/dev/null | sort | tail -n 1)
if [ -z "$log" ]; then
  log="$dir/$today-claude-1.md"
  printf '# Session %s claude-1 (auto-created by Stop hook)\n\n- Goal: (fill in via /session-end)\n\n## Turn trail (auto, Stop hook)\n' "$today" > "$log" 2>/dev/null || exit 0
fi
grep -q '^## Turn trail' "$log" 2>/dev/null || printf '\n## Turn trail (auto, Stop hook)\n' >> "$log"
state="$(git rev-parse --short HEAD 2>/dev/null) $(git rev-parse --abbrev-ref HEAD 2>/dev/null) dirty=$(git status --porcelain 2>/dev/null | wc -l | tr -d ' ')"
last=$(tail -n 1 "$log" 2>/dev/null | sed 's/^- [0-9:]*Z //')
[ "$last" = "$state" ] && exit 0
printf -- '- %sZ %s\n' "$(date -u +%H:%M)" "$state" >> "$log" 2>/dev/null
exit 0
