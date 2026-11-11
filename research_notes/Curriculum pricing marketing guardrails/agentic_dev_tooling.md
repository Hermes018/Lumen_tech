# Agentic dev tooling: Claude Code + Gemini fallback guardrails (as of 2026-11-07)

Research budget note: ~25 fetches/searches. Anthropic facts come from official docs (code.claude.com, platform.claude.com, support.claude.com). Items I could not verify are listed under Gaps; do NOT treat unflagged training-memory claims as verified.

## 1. Claude Code features (context, sessions, memory, subagents, hooks, headless, cost)

### Takeaway
Claude Code now has a rich guardrail surface: hooks (30+ events, only exit 2 blocks), subagents with per-agent model/tools/worktree isolation, CLAUDE.md + .claude/rules + auto memory, checkpoints/rewind, and `claude -p` (use `--bare`) for scripted verification. CLAUDE.md is advisory; enforcement belongs in hooks.

### Cited Findings
- CLAUDE.md is "context, not enforced configuration"; to block an action regardless of what Claude decides, use a PreToolUse hook. Auto memory (Claude-written notes) loads the first 200 lines or 25KB each session. — [Memory docs](https://code.claude.com/docs/en/memory)
- CLAUDE.md hierarchy: managed policy (Linux `/etc/claude-code/CLAUDE.md`, macOS `/Library/Application Support/ClaudeCode/CLAUDE.md`), user `~/.claude/CLAUDE.md`, project `./CLAUDE.md` or `./.claude/CLAUDE.md`, local `./CLAUDE.local.md` (gitignore it). Files in ancestor directories load at launch and are concatenated (root down to cwd); subdirectory CLAUDE.md files load on demand when Claude touches files there. — [Memory docs](https://code.claude.com/docs/en/memory)
- `@path/to/file` imports are supported (relative to the importing file; max depth 4 hops); imports do NOT reduce context cost. Target under 200 lines per CLAUDE.md; move partial-codebase rules to `.claude/rules/` (path-scoped, load only when matching files are used). `/doctor prompt-audit` audits instruction files. Claude can read a repo's AGENTS.md in place of CLAUDE.md. — [Memory docs](https://code.claude.com/docs/en/memory)
- Cost/context: `/usage` shows session tokens/cost (client-side estimate at list price) plus plan-usage attribution by skill/subagent/plugin/MCP server; `/clear` between unrelated tasks (resets session cost); `/compact <instructions>` or a "Compact instructions" section in CLAUDE.md steers summarization; `/context` shows what consumes space; MCP tool definitions are deferred by default; prefer CLIs (gh, gcloud) over MCP; `/effort` lowers thinking cost; plan mode (Shift+Tab) avoids rework; `/insights` writes an HTML usage report. — [Costs docs](https://code.claude.com/docs/en/costs)
- Enterprise average ~$13 per developer per active day, $150-250/month; 90% of users under $30/active day (API-billed). — [Costs docs](https://code.claude.com/docs/en/costs)
- Subagent/team cost: every subagent sends its own requests on top of main conversation; agent teams (experimental, `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1`) use ~7x tokens in plan mode; docs advise Sonnet for teammates, `model: haiku` for simple subagents. Idle sessions: first message after cache TTL expiry reprocesses full context. — [Costs docs](https://code.claude.com/docs/en/costs)
- Checkpoints: every prompt that starts a turn creates a checkpoint; last 100 kept; `/rewind` or double-Esc offers restore code+conversation / conversation only / code only / "Summarize from here/up to here". Limits: Bash-only file changes, subagent edits (mostly), external edits, symlinks/hard-links (pnpm hard links!) are NOT restored; "not a replacement for version control". `/branch` or `claude --continue --fork-session` to branch a session. Snapshots swept after ~30 days (`cleanupPeriodDays`). — [Checkpointing docs](https://code.claude.com/docs/en/checkpointing)
- Sessions: `--continue` continues most recent; `--resume <id>` (or path to .jsonl) continues specific; `/rename` then `/resume`. — [Headless docs](https://code.claude.com/docs/en/headless), [Costs docs](https://code.claude.com/docs/en/costs)
- Subagents: Markdown + YAML frontmatter, only `name` and `description` required. Fields: `tools`/`disallowedTools`, `model` (sonnet/opus/haiku/fable/inherit/full ID), `permissionMode`, `maxTurns`, `skills`, `mcpServers`, `hooks`, `memory` (user/project/local), `effort`, `isolation: worktree`, `background`, `omitClaudeMd`. Locations: `.claude/agents/` (project), `~/.claude/agents/`, plugin `agents/`, `--agents` flag. Context isolation: subagents start fresh (only delegation prompt, own system prompt, CLAUDE.md, git status); only summary returns. Model resolution: per-call param > frontmatter > `CLAUDE_CODE_SUBAGENT_MODEL` env > main model (`..._FORCE=1` to force). Nesting up to 3 deep; up to 20 concurrent by default. Built-ins: Explore, Plan, general-purpose, statusline-setup (Sonnet), claude-code-guide (Haiku). A subagent can carry its own PreToolUse hook (exit 2 blocks). — [Subagents docs](https://code.claude.com/docs/en/sub-agents)
- Hook events (full list per docs): SessionStart, Setup, UserPromptSubmit, UserPromptExpansion, PreToolUse, PermissionRequest, PermissionDenied, PostToolUse, PostToolUseFailure, PostToolBatch, Notification, MessageDisplay, SubagentStart, SubagentStop, TaskCreated, TaskCompleted, Stop, StopFailure, TeammateIdle, InstructionsLoaded, ConfigChange, CwdChanged, DirectoryAdded, FileChanged, WorktreeCreate, WorktreeRemove, PreCompact, PostCompact, PreModelSwitch, PostModelSwitch, Elicitation, ElicitationResult, SessionEnd. — [Hooks reference](https://code.claude.com/docs/en/hooks)
- Hook input (stdin JSON) common fields: session_id, prompt_id, transcript_path, cwd, permission_mode (default/plan/acceptEdits/auto/dontAsk/bypassPermissions), effort, hook_event_name, agent_id/agent_type; tool events add tool_name, tool_input, tool_use_id. — [Hooks reference](https://code.claude.com/docs/en/hooks)
- Exit codes: 0 = success (stdout parsed as JSON if object; plain text added as context for some events); **2 = blocking error** for events that can block (UserPromptSubmit, PreToolUse, PostToolBatch, SubagentStop, Stop (forces continue), TaskCreated/Completed, ConfigChange, PreCompact, WorktreeCreate, PreModelSwitch...); **exit 1 and other codes are non-blocking**. PostToolUse exit 2 cannot undo the tool but feeds stderr to Claude. JSON output: `continue:false`+`stopReason`; top-level `decision:"block"`+`reason` (UserPromptSubmit, PostToolUse, Stop, SubagentStop, PreCompact...); PreToolUse uses `hookSpecificOutput.permissionDecision` allow/deny/ask/defer plus `updatedInput`. — [Hooks reference](https://code.claude.com/docs/en/hooks) (note: doc page was truncated at 100k of 282k chars; per-event input schemas such as PostToolUse `tool_response` not seen)
- Headless: `claude -p "..." --allowedTools "..."`; `--output-format text|json|stream-json`; `--json-schema` gives `structured_output`; JSON includes `total_cost_usd`; `--max-budget-usd` caps spend; exit 0 on success, non-zero on failure; `--bare` (skip hooks/skills/plugins/MCP/CLAUDE.md/auto memory; needs ANTHROPIC_API_KEY, not subscription login) recommended for CI and "will become default for -p". Without `--bare`, `-p` runs project hooks and `.mcp.json` servers even in untrusted folders (security note). `--permission-mode dontAsk` denies anything unapproved; `--permission-prompts none` (v2.1.259+). Piped stdin cap 10MB. — [Headless docs](https://code.claude.com/docs/en/headless)
- Worktrees: subagent `isolation: worktree`; hooks WorktreeCreate/WorktreeRemove; auto memory is shared across worktrees of a repo; gitignored CLAUDE.local.md exists only in the worktree where created. — [Subagents](https://code.claude.com/docs/en/sub-agents), [Memory](https://code.claude.com/docs/en/memory)

### Inferences
- Guardrail design: put non-negotiables (block `rm -rf`, `npm install <unlisted pkg>`, edits to lockfile/.env, force-push, writes to migrations without tests) in PreToolUse hooks (exit 2); put a Stop hook that runs typecheck+tests and exits 2 to force Claude to continue until green; use PostToolUse for auto-format/lint feedback.
- Keep CLAUDE.md <200 lines with path-scoped `.claude/rules/` and on-demand skills to save tokens and maintain adherence.
- Because rewind does not cover subagent/Bash edits or pnpm hard links, commit frequently (or use worktrees) as the real safety net.
- Use `--bare` + `--max-budget-usd` + `--allowedTools` for scripted verification in CI/pre-commit.

### Gaps
- Not verified this session: skills (`.claude/skills`) frontmatter details, slash-command/plugin/output-style specifics, full permission-mode semantics, `/compact` auto-compact threshold, exact current Claude Code version number (docs mention features up to v2.1.305).
- Playwright MCP, Chrome DevTools MCP, Context7: not fetched; no cited facts. Check their GitHub READMEs.

## 2. Claude model lineup, API pricing, plan limits

### Takeaway
Current lineup (platform docs): Fable 5.1, Opus 5.5, Sonnet 5.5, Haiku 5.5, all 1M context / 128K max output. Opus 5.5 ($4/$20) is cheaper than Opus 5/4.x ($5/$25); Sonnet 5.5 is $2/$10; Haiku 5.5 from $0.10/$0.50. Subscriptions use a 5-hour session limit plus weekly limit shared across Claude and Claude Code.

### Cited Findings
- Models: Fable 5.1 `claude-fable-5-1` (slowest, $10/$50, demanding long-horizon agentic work); Opus 5.5 `claude-opus-5-5` (moderate speed, $4/$20, recommended start for long-running agentic coding); Sonnet 5.5 `claude-sonnet-5-5` (fast, $2/$10); Haiku 5.5 `claude-haiku-5-5` (fastest, from $0.10/$0.50). All 1M context, 128K max output, reliable knowledge cutoff Jun 2026. Fable 5.1 and Opus 5.5 have thinking always on; all use adaptive thinking; default effort high for Fable/Sonnet, medium for Opus/Haiku. — [Models overview](https://platform.claude.com/docs/en/about-claude/models/overview)
- Pricing per MTok (input / 5m cache write / 1h cache write / cache read / output; batch = 50%): Opus 5.5 $4 / $5 / $8 / $0.20 / $20 (batch $2/$10); Opus 5 and 4.5-4.8 $5 / $6.25 / $10 / $0.50 / $25; Sonnet 5.5 $2 / $2.50 / $4 / $0.10 / $10 (batch $1/$5); Sonnet 5 $2/$2.50/$4/$0.20/$10; Sonnet 4.6 $3/$3.75/$6/$0.30/$15; Haiku 5.5 (prompts ≤100K) $0.10/$0.125/$0.20/$0.01/$0.50, (>100K) $0.50/$0.625/$1/$0.05/$2.50 (batch $0.05/$0.25 and $0.25/$1.25); Haiku 4.5 $1/$1.25/$2/$0.10/$5. — [Pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- Full 1M context at standard pricing for Claude 4.6+ (except Haiku 5.5 tiered at 100K). Cache writes 1.25x (5m) / 2x (1h); reads 0.1x (0.05x on Opus 5.5 and Sonnet 5.5). Fast mode Opus 5.5 $8/$40 (not with Batch). US data residency 1.1x. Tokenizer from Claude 4.7 on yields ~30% more tokens for same text. Sonnet 4.5 listed deprecated. — [Pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- Subscriptions: Pro and Max both have a five-hour session limit and a weekly limit, shared across Claude and Claude Code (IDE usage counts); Max also has a separate weekly limit for Fable models; `/status` shows remaining allocation; options at limit: upgrade, usage credits, Console API credits, or wait. — [Support: Claude Code with Pro/Max](https://support.claude.com/en/articles/11145838-using-claude-code-with-your-pro-or-max-plan)
- At "session/weekly limit" switching model won't help (shared across models), but "Opus limit"/"Sonnet limit" messages can be bypassed by switching model family; v2.1.234+ can wait and auto-continue after reset (`/rate-limit-options`). — [Costs docs](https://code.claude.com/docs/en/costs)

### Inferences
- Opus lead + Sonnet/Haiku workers is cost-sound: Sonnet 5.5 is half Opus 5.5 per token; Haiku 5.5 is ~1/40th input. Cache reads are the dominant cost in long sessions, so keep context small and sessions warm.
- Claude Code's own subagent default (statusline-setup=Sonnet, guide=Haiku) supports routing exploration to Haiku/Sonnet.

### Gaps
- Dollar prices of Pro/Max tiers and exact quota sizes were not retrieved (plan pricing at claude.com/pricing); weekly limit numbers are not documented in tokens.
- Relative speed is only qualitative (Slowest/Moderate/Fast/Fastest).

## 3. Gemini CLI, Antigravity, Gemini models/pricing

### Takeaway
Gemini CLI offers a free tier with personal Google login, GEMINI.md hierarchical context, /compress, /memory, checkpoint /restore, /rewind, MCP and headless `-p`. Antigravity reads AGENTS.md/GEMINI.md and modular rules. Current API models include Gemini 3.5 Flash and 3.1 Pro Preview.

### Cited Findings
- Gemini CLI: Google Search grounding, file ops, shell, web fetch, MCP (servers in `~/.gemini/settings.json`), checkpointing, sandboxing, headless `gemini -p` with `--output-format json|stream-json`. Free tier with personal Google account: 60 requests/min and 1,000 requests/day (README claim). — [gemini-cli README](https://github.com/google-gemini/gemini-cli)
- Commands: `/compress` replaces chat context with a summary; `/memory list|refresh|show` manages hierarchical GEMINI.md context; `/restore` reverts files to pre-tool state (only if checkpointing enabled in settings); `/chat save|resume|list|delete|share` (alias /resume); `/rewind` (Esc Esc) reverts chat and/or files; `/mcp list|auth|enable|disable|reload`; `/init` generates GEMINI.md. GEMINI.md loads from global, project/ancestor, and subdirectories. — [Gemini CLI commands reference](https://geminicli.com/docs/reference/commands)
- Antigravity rules: finds and merges rules automatically; AGENTS.md/GEMINI.md in workspace or parents up to repo root (not subfolders below workspace), global at `~/.gemini/AGENTS.md`/`GEMINI.md`; modular rules in `.agents/rules/*.md` need frontmatter `trigger` (always_on, model_decision, glob, manual) or are silently discarded; each file truncated beyond 24,000 bytes; shared 20,000-token budget for always-on/global rules. Available in App, CLI, IDE. The page links to subagents, task groups, agent side panel but does not define an "agent manager". — [Antigravity rules docs](https://www.antigravity.google/docs/rules/)
- Gemini API pricing per 1M tokens (paid, input/output): Gemini 3.5 Flash $1.50/$9.00 (free tier yes); 3.1 Flash-Lite $0.25/$1.50; 3.1 Pro Preview $2/$12 (≤200K prompt) and $4/$18 (>200K), no free tier; 3 Flash Preview $0.50/$3; 2.5 Pro $1.25/$10 (≤200K); 2.5 Flash $0.30/$2.50; 2.5 Flash-Lite $0.10/$0.40. Context caching e.g. 3.1 Pro $0.20 (≤200K) plus storage $4.50/M tokens/hour. Gemini 2.0 Flash shut down 2026-06-01. — [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing)

### Inferences
- As fallback, Gemini 3.5 Flash ($1.50/$9) is priced about the same as Sonnet 5.5 ($2/$10), so it is not a cost saver; the free tier is the real advantage for low-stakes work. Keep GEMINI.md as a thin file importing/duplicating AGENTS.md so one source of truth serves both.
- The README free-tier numbers may be stale relative to model-specific limits; verify in-app.

### Gaps
- `context.fileName` setting and Gemini CLI sandbox details not confirmed in fetched text (README summary did not mention it). Antigravity product definition/launch details, agent manager, and its pricing/quotas not retrieved. Current Gemini CLI version unknown. Current free-tier per-model rate limits for the API not retrieved.

## 4. AGENTS.md open standard

### Takeaway
AGENTS.md is broadly adopted and now stewarded by the Agentic AI Foundation (Linux Foundation).

### Cited Findings
- Listed supporting tools include Codex, Jules, Factory, Aider, goose, opencode, Zed, Warp, VS Code, Devin, Junie, Amp, Cursor, RooCode, Gemini CLI, Kilo Code, GitHub Copilot coding agent, Windsurf, Augment Code; "over 60k open-source projects"; stewarded by Agentic AI Foundation under Linux Foundation. — [agents.md](https://agents.md)
- Claude Code can read AGENTS.md in place of/alongside CLAUDE.md (documented). Antigravity reads AGENTS.md/GEMINI.md. — [Memory docs](https://code.claude.com/docs/en/memory), [Antigravity rules](https://www.antigravity.google/docs/rules/)

### Inferences
- Write canonical rules in AGENTS.md; make CLAUDE.md a tiny file with `@AGENTS.md` import plus Claude-specific notes (this uses the documented import mechanism; verify the exact recommended pattern in the "AGENTS.md" section of the memory docs).

### Gaps
- Exact first-class Claude Code behavior when both files exist not read in detail.

## 5. Hallucination-reduction / slopsquatting

### Takeaway
Package hallucination is measurable and repeatable, making slopsquatting a real supply-chain risk; mitigate with allowlists, existence/age checks, lockfile review, and CI scanning.

### Cited Findings
- Study of 16 LLMs, 576,000 Python/JS samples: ~16% (Python) / ~21% (JS) fictitious dependencies on average across models; GPT-4-class <5%, DeepSeek >15%, CodeLlama 7B >25%; 43% of hallucinated packages recur in every re-run; ~13% are one-char typos of real packages; recent-technology prompts add ~10% more nonexistent packages. RAG with curated library DB + self-check cut rates to 2.4% (DeepSeek) / 9.3% (CodeLlama) but authors judged still too high. Mitigations: CI scanning, approved dependency lists, AI-specific review checklists. — [Kaspersky summary](https://www.kaspersky.com/blog/ai-slopsquatting-supply-chain-risk/53327/) (secondary source summarizing the academic study; primary paper not fetched)
- Claude Code guidance: give verification targets (tests, screenshots), test incrementally; language-server "code intelligence" plugins report type errors after edits. — [Costs docs](https://code.claude.com/docs/en/costs)

### Inferences
- Concrete rules: PreToolUse hook on `pnpm add|npm i|npm install` that requires package on a project allowlist or passes `npm view <pkg>` existence + age/downloads check; forbid editing lockfile except via package manager; review lockfile diffs; pin versions; use `--ignore-scripts` for new deps; type-check (`tsc --noEmit`) and tests as Stop-hook gates; require "cite file:line" in claims and docs-in-context (llms.txt/Context7) for library APIs. These are my recommendations, not sourced.

### Gaps
- llms.txt standard status, Context7 details, and npm provenance/Socket tooling not researched.

## 6. Verification tooling

### Takeaway
Only Playwright snapshot behavior was verified; other tools are unresearched here.

### Cited Findings
- Playwright `toHaveScreenshot()`: first run writes baselines; `threshold` default 0.2, `maxDiffPixels`, `stylePath`; `--update-snapshots`; snapshots are named by browser+platform (e.g. `-chromium-darwin.png`) because rendering differs by OS/fonts/hardware; run in the same environment baselines were generated and commit snapshot dirs. — [Playwright docs](https://playwright.dev/docs/test-snapshots)

### Inferences
- Because macOS and Linux baselines differ, generate baselines in one canonical environment (Docker/CI Linux or Codespace), not the Mac.

### Gaps
- Not researched (no citations): axe-core, Lighthouse CI, k6, Storybook test runner, Chromatic/Argos/Lost Pixel free tiers, Vitest browser mode, Biome vs ESLint speed, Turborepo remote caching, pnpm store. Report writer should not assert specifics for these.

## 7. Resource-conscious development (fanless MacBook Air, multi-device)

### Takeaway
Cloud services have usable free tiers; thermal throttling realities were not sourced.

### Cited Findings
- GitHub Codespaces: free personal quota 120 compute hours + 15 GB-month (Free) or 180 hrs + 20 GB-month (Pro); core count multiplies usage; no payment method means blocked at quota. — [GitHub docs](https://docs.github.com/en/billing/managing-billing-for-your-products/managing-billing-for-github-codespaces/about-billing-for-github-codespaces)
- Neon Free: 100 projects, 100 CU-hours/project/month, 1 GB storage/project (20 GB total), scale-to-zero after 5 minutes, up to 10 branches/project, 6-hour history, no instant restore. — [Neon pricing](https://neon.com/pricing)
- OrbStack: free for personal non-commercial use; Pro $8/user/month for business use; no benchmark numbers on the page vs Docker Desktop. — [OrbStack pricing](https://orbstack.dev/pricing)
- Claude Code in `-p`/CI and the status line expose cost; tests/log output can be filtered by hook to reduce context (not machine load). — [Costs docs](https://code.claude.com/docs/en/costs)

### Inferences
- Claude Code runs the model remotely, so thermal load comes from dev servers, test runners and Docker, not the agent; parallel worktrees multiply that load. Limit Playwright workers and parallel agents on the Air. (Recommendation, unsourced.)
- Neon's 10-branch cap and CU-hour budget fit a branch-per-PR workflow only if branches are deleted regularly; the user has a borrowed Ubuntu PC being returned (from user memory), so keep all state in git/cloud.

### Gaps
- No sourced data on MacBook Air M-series throttling, Turbopack, mise/volta/corepack, devcontainers. Not researched.

## 8. Design-research tools

### Takeaway
Not researched in this session; no cited facts.

### Cited Findings
- None.

### Inferences
- Ethical practice (recommendation only): study layout, hierarchy, spacing and interaction patterns; do not copy proprietary code, images, fonts, copy or brand assets; Ghidra (NSA binary reverse-engineering framework) is not relevant to websites (stated in assignment).

### Gaps
- Mobbin, Page Flows, Refero, Godly, Land-book, SaaS Landing Page, Lapa Ninja, Wappalyzer/BuiltWith, CSS Peeper, Apple HIG, Laws of UX: pricing, free tiers, and licensing terms were not checked. Verify each site's terms before relying on it.
