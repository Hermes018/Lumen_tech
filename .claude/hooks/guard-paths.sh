#!/usr/bin/env sh
# PreToolUse guard for Edit|Write|MultiEdit. Exit 2 = BLOCK (message goes to stderr, shown to the agent).
# stdin: hook JSON with tool_input.file_path (verify against installed Claude Code version).
# Tier A  = never editable by agents (human only).
# Tier B  = security-critical; editable only if a matching glob is listed in .claude/allow-protected.local
#           (written by /next-task from the task card's `touch` list; gitignored; one glob per line).
# NOTE: hooks are guardrails, not a sandbox. Bash can still write files; guard-bash.sh covers the obvious cases.
deny() { printf 'BLOCKED by guard-paths.sh: %s\n' "$1" >&2; exit 2; }

input=$(cat)
if command -v jq >/dev/null 2>&1; then
  f=$(printf '%s' "$input" | jq -r '.tool_input.file_path // .tool_input.path // empty' 2>/dev/null)
else
  f=$(printf '%s' "$input" | sed -n 's/.*"file_path"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -n 1)
fi
[ -z "$f" ] && exit 0

root=${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}
rel=${f#"$root"/}
rel=${rel#./}

case "$rel" in
  *../*|../*) deny "path traversal ('..') is not allowed: $rel" ;;
  /tmp/*|/private/tmp/*|/var/folders/*) exit 0 ;;   # scratch (screenshots etc.)
  /*) deny "write outside the repository: $rel" ;;
esac

# ---- Tier A: human-only ----
case "$rel" in
  .env.example) ;;
  .env|.env.*) deny "$rel is a secrets file. Agents never edit .env*. Use .env.example + packages/config/env.ts." ;;
  docs/00-DECISIONS.md) deny "00-DECISIONS.md is founder-only. Add a row to 'Decisions needing the founder' in docs/PROGRESS.md instead." ;;
  .claude/settings.json|.claude/settings.local.json|.claude/hooks/*|.claude/allow-protected.local|.gemini/settings.json)
    deny "agent guard config ($rel) is human-only. Ask the founder." ;;
  pnpm-lock.yaml) deny "never hand-edit pnpm-lock.yaml; change dependencies through pnpm in a task that allows it." ;;
  .git/*) deny "never edit .git internals." ;;
  packages/db/migrations/*)
    if git -C "$root" cat-file -e "HEAD:$rel" 2>/dev/null; then
      deny "applied/committed migration $rel is immutable. Write a NEW forward migration (expand->migrate->contract)."
    fi ;;
esac

# ---- Tier B: security-critical, needs task-card allowance ----
protected=0
case "$rel" in
  packages/auth/*|packages/db/migrations/*) protected=1 ;;
  packages/core/src/authz/*|packages/core/src/entitlements/*|packages/core/src/payments/*|packages/core/src/orders/*) protected=1 ;;
  packages/core/src/attempts/*|packages/core/src/scoring/*|packages/core/src/adaptive/*|packages/core/src/audit/*|packages/core/src/uploads/*) protected=1 ;;
  apps/web/app/api/*webhooks*|apps/web/app/api/inngest/*|apps/web/next.config.*|apps/web/*csp*|apps/web/*security-headers*) protected=1 ;;
  packages/config/env.ts|.github/workflows/*|turbo.json|pnpm-workspace.yaml|lefthook.yml|.mise.toml|.tool-versions|.nvmrc) protected=1 ;;
esac
[ "$protected" -eq 0 ] && exit 0

allow="$root/.claude/allow-protected.local"
if [ -f "$allow" ]; then
  while IFS= read -r g || [ -n "$g" ]; do
    case "$g" in ''|'#'*) continue ;; esac
    g=$(printf '%s' "$g" | sed 's/\*\*/*/g')
    # shellcheck disable=SC2254
    case "$rel" in $g) exit 0 ;; esac
  done < "$allow"
fi
deny "$rel is security-critical (docs/12 sec 2.1). The current task card's touch list must include it and the lead must have run /next-task so .claude/allow-protected.local lists it. Otherwise STOP and ask the lead/founder."
