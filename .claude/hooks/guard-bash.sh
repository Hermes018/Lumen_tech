#!/bin/sh
# PreToolUse guard for Bash. Exit 2 = BLOCK. (verify tool_input.command field against installed version)
# Blocks: curl|sh, force-push, direct push to main, --no-verify, shell writes to guard files / .env,
#         dependency adds not listed in docs/approved-deps.txt (slopsquatting gate).
deny() { printf 'BLOCKED by guard-bash.sh: %s\n' "$1" >&2; exit 2; }

input=$(cat)
if command -v jq >/dev/null 2>&1; then
  cmd=$(printf '%s' "$input" | jq -r '.tool_input.command // empty' 2>/dev/null)
else
  cmd=$(printf '%s' "$input" | sed -n 's/.*"command"[[:space:]]*:[[:space:]]*"\(.*\)"[[:space:]]*[,}].*/\1/p' | head -n 1)
fi
[ -z "$cmd" ] && exit 0
root=${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}

printf '%s' "$cmd" | grep -Eq '(curl|wget)[^|;&]*\|[[:space:]]*(sudo[[:space:]]+)?(ba|z|da)?sh([[:space:]]|$)' \
  && deny "piping a download into a shell is forbidden. Download, read, then run with founder approval."
printf '%s' "$cmd" | grep -Eq 'git[[:space:]]+push[^;&|]*([[:space:]]--force|[[:space:]]-f([[:space:]]|$)|--force-with-lease)' \
  && deny "force push is forbidden. Use git revert."
printf '%s' "$cmd" | grep -Eq 'git[[:space:]]+push([[:space:]]+[^;&|]*)?[[:space:]](origin[[:space:]]+)?(HEAD:)?(refs/heads/)?main([[:space:]]|$)' \
  && deny "no direct push to main. Push the task branch and open a PR."
printf '%s' "$cmd" | grep -Eq 'git[[:space:]]+(commit|push)[^;&|]*--no-verify' \
  && deny "--no-verify skips git hooks. Fix the failure instead."
printf '%s' "$cmd" | grep -Eq '(>|>>|tee[[:space:]]+(-a[[:space:]]+)?|sed[[:space:]]+-i[^;&|]*)[[:space:]]*\.?/?(\.claude/(settings|hooks|allow-protected)|\.gemini/settings|\.env([^.a-z]|\.local|\.production|\.development|$))' \
  && deny "shell writes to guard config or .env* are forbidden."

# Dependency-add gate
first=$(printf '%s' "$cmd" | sed 's/[;&|].*//')
if printf '%s' "$first" | grep -Eq '(^|[[:space:]])(pnpm|npm|yarn|bun)([[:space:]]+[^[:space:]]+)*[[:space:]]+(add|install|i)([[:space:]]|$)'; then
  after=$(printf '%s' "$first" | sed -E 's/.*[[:space:]](add|install|i)([[:space:]]+|$)//')
  list="$root/docs/approved-deps.txt"
  for tok in $after; do
    case "$tok" in -*) continue ;; esac
    case "$tok" in
      @*) name=$(printf '%s' "$tok" | sed -E 's/^(@[^@]+)(@.*)?$/\1/') ;;
      *)  name=${tok%%@*} ;;
    esac
    [ -z "$name" ] && continue
    if [ ! -f "$list" ] || ! grep -Fxq "$name" "$list"; then
      deny "dependency '$name' is not in docs/approved-deps.txt. Run: npm view $name (exists? maintainers, repo, created, weekly downloads), record evidence in the task card, get lead approval, then add the name to docs/approved-deps.txt in a task that allows it."
    fi
  done
fi
exit 0
