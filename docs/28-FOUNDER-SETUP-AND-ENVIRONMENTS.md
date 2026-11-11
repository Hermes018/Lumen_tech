# 28 — Founder Setup and Environments (Day 0 to first deploy)

> Audience: the founder (Ayman Rahman), a capable solo developer who wants zero guesswork. Primary machine: Laptop with Intel Core i5-1135G7 (4C/8T), 8 GB DDR4 RAM, NVIDIA GeForce MX330 (2 GB VRAM), dual-SSD storage. Dual-Boot OS: Windows 11 (Git Bash / WSL2 / PowerShell) and Fedora 44 KDE Plasma (native bash, systemd, zram/swap).
> Resolves GA-005 (25-GAP-AUDIT) and is the proposed doc 28 from that audit. Conforms to `00-DECISIONS.md` (D2 locale `as-needed`, D3 stack, D12 GA-005: Neon dev branch is the default local DB, `DB_DRIVER=neon|pg`, `.env.example` is readable by agents, real `.env*` files are not).
> `<domain>` = your real domain (not chosen yet; use any placeholder until you buy it). `Lumen Academy` is a placeholder brand and appears only in `packages/config/brand.ts`.

**Conventions in this doc**

- `verify` marks any install command, URL, UI label, price, limit or version I could not confirm against live vendor pages while writing. Open the vendor's current docs first; if a command differs, trust the vendor and log the difference in `docs/PROGRESS.md` under "Decisions needing the founder".
- Lines starting with `$` are terminal commands to copy (without the `$`). Lines starting with `>` are expected output (approximate).
- "Agent" = Claude Code / Gemini CLI. Agents never see real secrets (section 7).
- Phase tags: **P0** foundation, **P1** MVP launch, **P2** growth (D1).

**Table of contents**

1. Order of operations (one-page map)
2. Operating System prerequisites (Windows 11 & Fedora 44)
3. Dual-boot parity & OS switching (OS-Baton)
4. GitHub repository and branch protection
5. Install Claude Code and Gemini CLI
6. Copy the build kit and bootstrap the repo
7. Secrets handling
8. Accounts, in the right order
9. `.env.example` (full annotated template)
10. First run
11. Smoke scripts: verify each integration
12. Preview deployments (Neon branch per PR)
13. Staging and production promotion
14. Domain and email DNS checklist
15. Troubleshooting: top 25 errors
16. 8 GB RAM Survival Rules (Windows 11 / Fedora 44 Dual-Boot)
17. "Fresh machine in 30 minutes" checklist
18. Backlog tasks (NEW-ENV-xx) and doc drift found while writing

---

## 1. Order of operations (one-page map)

Do the steps in this order. Items marked LONG have lead times measured in days or weeks, so start them first and let them run in the background (10 §15.2).

| Step | What | Where in this doc | Time |
|---|---|---|---|
| 0 | Password manager + 2FA app on your phone | 7.1 | 20 min |
| 1 | Mac prerequisites | 2 | 30-45 min |
| 2 | GitHub account hardening + repo + branch protection | 4 | 20 min |
| 3 | Start LONG items: business registration, SSLCommerz live merchant, Paddle application, SMS sender ID, accountant | 8.2 | 1 hour to submit |
| 4 | Buy domain, create Cloudflare zone | 8.3 | 30 min + propagation |
| 5 | Neon project + branches | 8.4 | 15 min |
| 6 | Vercel Pro project | 8.5 | 15 min |
| 7 | Claude Code + Gemini CLI | 5 | 10 min |
| 8 | Copy build kit, first commit | 6 | 15 min |
| 9 | Remaining accounts (Google, Resend, Upstash, Inngest, Sentry, PostHog, R2, Turnstile, Bunny, AI keys) | 8.6 - 8.16 | 2-3 hours |
| 10 | Fill `.env.local`, first run, smoke scripts | 9, 10, 11 | 30 min |
| 11 | Preview + staging + prod wiring | 12, 13, 14 | 1-2 hours |

Phase gate: for P0 you only need steps 0-9 for GitHub, Cloudflare, Neon, Vercel, Google, Resend, Upstash, Inngest, Sentry, PostHog, R2, Turnstile. Bunny, AI keys and SSLCommerz **sandbox** are needed from P1 tasks; open them now anyway because they take minutes, but do not pay for anything you do not use yet.

---

## 2. macOS prerequisites

Target: macOS on Apple silicon (M5), Terminal.app or iTerm, default shell `zsh`. Total disk: budget 15 GB free (Xcode CLT ~1.5 GB, Node/pnpm store ~3 GB, repo + `node_modules` ~2 GB, OrbStack images optional ~5 GB).

### 2.1 Xcode Command Line Tools (compiler, git)

```bash
$ xcode-select --install
```
A dialog opens; click Install and wait. Verify:
```bash
$ xcode-select -p
> /Library/Developer/CommandLineTools
```
(You do **not** need the full Xcode app.)

### 2.2 Homebrew

Run the one-line installer shown on https://brew.sh (verify the current command; do not paste installers from anywhere else):
```bash
$ /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
At the end the installer prints two lines under "Next steps". Run them, they add brew to your PATH:
```bash
$ echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
$ eval "$(/opt/homebrew/bin/brew shellenv)"
$ brew --version
> Homebrew 4.x.x          # verify
```

### 2.3 git, GitHub CLI, jq, and helpers

```bash
$ brew install git gh jq gnupg
$ git --version
> git version 2.4x.x
$ git config --global user.name  "Your Name"
$ git config --global user.email "aymanrahman30@gmail.com"      # or your GitHub noreply address
$ git config --global init.defaultBranch main
$ git config --global pull.rebase true
$ git config --global fetch.prune true
$ git config --global core.autocrlf input
$ gh auth login            # choose: GitHub.com -> SSH -> generate new key -> login with browser
$ gh auth status
> Logged in to github.com account <you>
```
Use the GitHub noreply email (Settings -> Emails -> "Keep my email addresses private") if you do not want your real address in public commits.

Optional but recommended: sign commits with the SSH key you just made:
```bash
$ git config --global gpg.format ssh
$ git config --global user.signingkey ~/.ssh/id_ed25519.pub     # path printed by gh auth login; verify
$ git config --global commit.gpgsign true
```
Then add the same key at GitHub -> Settings -> SSH and GPG keys -> New SSH key -> Key type **Signing key**.

### 2.4 mise (Node, pnpm) — one tool for versions

Why mise: one file (`mise.toml`) pins Node for every machine, and `.nvmrc` stays the single value CI reads (11 §3). `Bash(mise:*)` is already allow-listed in the build kit's `.claude/settings.json`.

```bash
$ brew install mise
$ echo 'eval "$(mise activate zsh)"' >> ~/.zshrc
$ exec zsh
$ mise --version
> 2026.x.x                 # verify
```

Node version policy: **Node LTS, pinned by major in `.nvmrc`** (value to be fixed in P0-01; GA-005 notes it is currently unspecified in 04/11). As of writing, Node 24 is the Active LTS line; if a newer line has become Active LTS by the time you read this, ask the lead agent to confirm and pin one major in both `.nvmrc` and `mise.toml` (verify at https://nodejs.org/en/about/previous-releases).

```bash
$ mise use -g node@24          # global default on this machine; verify the current LTS first
$ node -v
> v24.x.x
```
Inside the repo (after step 6) the repo's `mise.toml` takes precedence:
```toml
# mise.toml (repo root)
[tools]
node = "24"            # must equal .nvmrc; verify current LTS

[env]
TURBO_TELEMETRY_DISABLED = "1"
NEXT_TELEMETRY_DISABLED = "1"
```

### 2.5 pnpm via Corepack

Root `package.json` carries `"packageManager": "pnpm@10.x.y"` (11 §2). Corepack reads it and installs exactly that pnpm.
```bash
$ corepack enable
$ corepack prepare pnpm@latest-10 --activate     # only before the repo exists; inside the repo, plain `pnpm -v` suffices (verify)
$ pnpm -v
> 10.x.y
```
If `corepack: command not found` (newer Node distributions may not bundle it; verify): `npm install -g corepack` then `corepack enable`. Fallback that always works: `mise use -g pnpm@10`.

### 2.6 Editor and CLI extras

```bash
$ brew install --cask visual-studio-code        # or your editor
$ brew install neonctl                          # Neon CLI (verify formula name; alt: npm i -g neonctl)
$ npm install -g vercel                         # Vercel CLI (or: brew install vercel-cli; verify)
$ brew install cloudflared                      # webhook tunnels for SSLCommerz IPN
$ brew install gitleaks lefthook                # same tools CI uses; pre-commit hooks
$ brew install k6                               # load tests, later
```
VS Code extensions to install now: ESLint, Prettier, Tailwind CSS IntelliSense, **i18n Ally** (doc 33), Playwright Test, Error Lens. Command line: `code --install-extension lokalise.i18n-ally` (verify id).

### 2.7 Optional: OrbStack (only for offline work or Postgres-pure tests)

Default local DB is a **Neon dev branch** (D12 GA-005): no Docker, cooler laptop. Install OrbStack only if you want to work offline or test against plain Postgres:
```bash
$ brew install --cask orbstack          # verify; check licence terms for commercial use at orbstack.dev
$ docker --version
$ docker compose version
```
Then use `DB_DRIVER=pg` (section 10.5). OrbStack is far lighter than Docker Desktop on Apple silicon, but still do not leave it running when idle.

### 2.8 macOS settings worth changing once

- System Settings -> Battery -> Low Power Mode: "Only on Battery" or "Never" (see section 16 for when to use it).
- System Settings -> Privacy & Security -> Full Disk Access: give Terminal nothing extra; agents run without it.
- FileVault on. Firewall on. Lock screen after 5 minutes.
- Spotlight: exclude `~/code` (System Settings -> Siri & Spotlight -> Spotlight Privacy) so indexing does not heat the machine while `node_modules` churns.

---

## 3. Second machine parity (Windows WSL2 / Linux)

Goal: any second machine reaches "green `pnpm verify`" in 30 minutes (checklist in section 17) using only git + the password manager.

### 3.1 Rules that make multi-device painless

1. **Git is the only sync channel.** Commit WIP to your task branch and push before switching machines (`[handoff]` commit style in 12 §4). Never copy `node_modules`, `.env*` or `.next` between machines.
2. **Same toolchain from the repo, not from memory:** `mise.toml` + `.nvmrc` + `packageManager` in `package.json`. If those three agree, both machines get the same Node and pnpm.
3. **One Neon dev branch per machine**, not shared: `dev-<you>-mac` and `dev-<you>-pc`. Two machines applying different unmerged migrations to one DB will corrupt your migration history. Both branches are cheap copy-on-write children of `staging`.
4. **Secrets come from the password manager and `vercel env pull`**, never from git, chat or cloud-synced folders (Dropbox/iCloud/OneDrive: keep the repo out of them).
5. **Agent sessions do not sync.** `~/.claude` and `~/.gemini` are per machine. Continuity lives in `docs/PROGRESS.md` and `docs/HANDOFF.md`; run `/handoff` before leaving a machine and `/resume` on the other.
6. Line endings: the repo must contain `.gitattributes` with `* text=auto eol=lf` (task NEW-ENV-02) so Windows never rewrites scripts.

### 3.2 Windows 11 with WSL2 (recommended over native Windows)

In an **Administrator PowerShell**:
```powershell
wsl --install -d Ubuntu-24.04      # verify distro name with: wsl --list --online
```
Reboot, create the Linux user, then everything below runs **inside Ubuntu**, and the repo lives in the Linux filesystem (`~/code`), **not** `/mnt/c/...` (the Windows mount is 5-20x slower for `node_modules`).

```bash
$ sudo apt update && sudo apt install -y build-essential git curl unzip jq ca-certificates gnupg
$ curl https://mise.run | sh                       # verify at https://mise.jdx.dev/getting-started.html
$ echo 'eval "$(~/.local/bin/mise activate bash)"' >> ~/.bashrc && exec bash
$ mise use -g node@24 && corepack enable
$ type -p gh || (sudo apt install -y gh)           # or follow https://github.com/cli/cli/blob/trunk/docs/install_linux.md
$ gh auth login
```
Docker (only if you want `DB_DRIVER=pg`): install Docker Desktop for Windows with the WSL2 backend, or `docker.io` inside Ubuntu (verify). Browsers for Playwright: `pnpm exec playwright install --with-deps chromium` (the `--with-deps` flag apt-installs system libraries).
Dev server reachability: `http://localhost:3000` in the Windows browser reaches WSL2 automatically (WSL2 localhost forwarding; verify if it does not).
Windows-only gotchas: antivirus real-time scanning of `\\wsl$` slows installs (exclude it); keep `.wslconfig` memory cap (`[wsl2] memory=6GB`) so Windows is not starved.

### 3.3 Native Linux (Ubuntu/Debian)

Same as 3.2 minus WSL. Docker: `sudo apt install docker.io docker-compose-v2 && sudo usermod -aG docker $USER` (log out/in). Use `cloudflared` from Cloudflare's apt repo (verify).

### 3.4 What differs by OS (cheat sheet)

| Concern | macOS | WSL2/Linux |
|---|---|---|
| Open URL from terminal | `open <url>` | `wslview <url>` (package `wslu`) or copy/paste |
| Clipboard | `pbcopy` | `clip.exe` (WSL) / `xclip` (Linux) |
| Package manager | `brew` | `apt` |
| Docker | OrbStack | Docker Desktop (WSL backend) / `docker.io` |
| Port in use | `lsof -i :3000` | `ss -ltnp | grep 3000` |
| Thermal limits | fanless: see section 16 | usually fine |

---

## 4. GitHub repository and branch protection

### 4.1 Harden the account first
GitHub -> Settings -> Password and authentication: enable 2FA with a passkey or an authenticator app, **save recovery codes in the password manager**. Settings -> Sessions: review. Never use SMS as the only factor.

### 4.2 Create the repo (private)

Run from your code folder (not inside any other repo):
```bash
$ mkdir -p ~/code && cd ~/code
$ gh repo create lumen-academy --private --description "Lumen Academy monorepo" --clone
$ cd lumen-academy
```
(`lumen-academy` is a placeholder; the repo name is not brand-critical.) Create the long-lived branches after the first commit (section 6.4): `main` is production source, `staging` is not a git branch; staging deploys from `main` (04 §8.3). Neon's `staging` is a *database* branch, not a git branch.

### 4.3 Repository settings (copy-paste via CLI)

```bash
$ gh repo edit --delete-branch-on-merge --enable-squash-merge --enable-rebase-merge=false --enable-merge-commit=false
$ gh repo edit --enable-issues=true --enable-wiki=false --enable-projects=false
```
In the web UI, Settings -> Code security: enable **Dependabot alerts**, **secret scanning**, **push protection** (all free on private repos only with GitHub Advanced Security on some plans; verify what your plan includes; the CI Gitleaks job covers the gap).

### 4.4 Branch protection for `main` (ruleset)

11 §1.2 asks for "1 approving review (the founder)". **A solo developer cannot approve their own PR on GitHub**, so that line deadlocks. Use this solo-safe setting (decision recorded as NEW-ENV-01; revert to 1 review when a second human exists):

GitHub -> Settings -> Rules -> Rulesets -> New branch ruleset (verify UI labels):

| Setting | Value |
|---|---|
| Name | `protect-main` |
| Enforcement | Active |
| Target branches | Default branch (`main`) |
| Restrict deletions | on |
| Block force pushes | on |
| Require linear history | on |
| Require a pull request before merging | on, **required approvals = 0** while solo |
| Require status checks | on; add `verify`, `e2e-preview`, `security / gitleaks`, `security / osv`, `codeql`, `commitlint` **after their first run** (GitHub only lists checks that have run once) |
| Require branches up to date | on |
| Require signed commits | optional (on if you set up 2.3) |
| Bypass list | empty (even you; use a PR) |

Also add `.github/CODEOWNERS` from 11 §1.5. Until the workflows exist (P0-03/04), leave the status-check rule off, then turn it on; otherwise nothing can merge.

Equivalent CLI check once configured:
```bash
$ gh api repos/:owner/:repo/rulesets --jq '.[].name'
> protect-main
```

### 4.5 GitHub Actions secrets and variables (set when you reach section 12)

Settings -> Secrets and variables -> Actions. **Variables** (not secret): `NEON_PROJECT_ID`, `PROD_HOST`. **Secrets**: `NEON_API_KEY`, `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `VERCEL_AUTOMATION_BYPASS_SECRET`, `PROD_DATABASE_URL_UNPOOLED` (in the `production` **Environment**, with you as required reviewer), `SENTRY_AUTH_TOKEN`. Set them with the CLI so the value never lands in shell history by prompt:
```bash
$ gh secret set NEON_API_KEY            # paste when prompted; not echoed
$ gh variable set NEON_PROJECT_ID --body "<project-id>"
```

---

## 5. Install Claude Code and Gemini CLI

**All commands here: verify against current docs** (Anthropic: https://docs.claude.com/en/docs/claude-code ; Google: https://github.com/google-gemini/gemini-cli). Installation methods change.

### 5.1 Claude Code
Pick one method; the Homebrew cask is the least surprising on a Mac:
```bash
$ brew install --cask claude-code           # verify cask name
# or the official installer / npm route from the docs page:
# $ npm install -g @anthropic-ai/claude-code
$ claude --version
$ claude                                    # first run: sign in with your Claude account in the browser
```
Inside a session: `/status` shows the account and model; `/model` switches models (Opus lead / Sonnet implementer / Haiku utility per D9); `/permissions` shows the allow/deny lists from the build kit.

### 5.2 Gemini CLI (continuation agent)
```bash
$ brew install gemini-cli                    # verify; alt: npm install -g @google/gemini-cli
$ gemini --version
$ gemini                                     # first run: choose "Login with Google"
```
Gemini reads `GEMINI.md` and `AGENTS.md` (`.gemini/settings.json` in the kit) and has no `.claude/` subagents or slash commands; use the prompts in `docs/13-PROMPTS.md` (12 §4).

### 5.3 Rules for both
- Run agents **only from the repo root**, on a task branch, never on `main`.
- Never paste real secrets into any AI chat (section 7.3). If you do, rotate that secret immediately.
- Keep one agent session active at a time on the fanless Mac (section 16).

---

## 6. Copy the build kit and bootstrap the repo

### 6.1 Get the kit into the repo
Assuming the blueprint folder is at `~/blueprint` (adjust):
```bash
$ cd ~/code/lumen-academy
$ cp -R ~/blueprint/build-kit/. .                  # copies CLAUDE.md, AGENTS.md, GEMINI.md, .claude/, .gemini/, docs-templates/
$ mkdir -p docs && cp ~/blueprint/docs/*.md docs/   # specs; PROGRESS.md and HANDOFF.md come along
$ ls -a
> .claude  .gemini  AGENTS.md  CLAUDE.md  GEMINI.md  docs  docs-templates
$ chmod +x .claude/hooks/*.sh 2>/dev/null; ls .claude/hooks
```
Note the trailing `/.` in `cp -R build-kit/. .`: it copies dotfolders like `.claude`. A plain `cp -R build-kit/*` **misses** them (error #3 in section 15).

### 6.2 Sanity-check the permissions file
The kit's `.claude/settings.json` already:
- denies reading `./.env`, `./.env.local`, `./.env.*.local`, `./.env.production`, `./.env.development` (and `**/` variants) and editing them;
- does **not** deny `.env.example`, so agents can read and update it (GA-005 fix; D12);
- denies `vercel env pull` and `vercel --prod` for agents, so **you** run those yourself;
- denies force-push, `git reset --hard`, `sudo`, `rm -rf`, editing `docs/00-DECISIONS.md` and `pnpm-lock.yaml`.

Quick test after installing Claude Code (section 5):
```bash
$ cp /dev/null .env.local            # empty file, harmless
$ claude -p "Read .env.example if it exists and .env.local, tell me which reads were blocked"   # expect: .env.local blocked; .env.example absent or readable
```
(Expect `.env.local` blocked. `-p` is the non-interactive print mode; verify flags with `claude --help`.)

### 6.3 First instruction to the agent (P0-01..P0-12 start)
Do not hand-write the monorepo. Start Claude Code on a branch and run the kit's loop:
```bash
$ git switch -c chore/bootstrap
$ claude
> /next-task            # picks P0-01 from docs/PROGRESS.md and writes its task card
```
P0-01..P0-04 are strictly serial (12 §11). P0-07 creates `packages/config/env.ts` and `.env.example`; section 9 below is the content spec for that file, so the agent should be told: "`.env.example` must match doc 28 section 9."

### 6.4 First commit and push
```bash
$ git add -A && git status                          # eyeball: no .env* other than .env.example
$ gitleaks protect --staged --redact                # expect: no leaks found
$ git commit -m "chore(repo): import build kit and specs (P0-00)"
$ git push -u origin chore/bootstrap
$ gh pr create --fill && gh pr merge --squash       # first merge: ruleset not yet requiring checks (4.4)
```

---

## 7. Secrets handling

### 7.1 Password manager (do this before any account)
Use one team-capable password manager (1Password / Bitwarden; verify plan). Create vaults:
- `Lumen / Accounts` (logins + recovery codes)
- `Lumen / Dev secrets` (sandbox keys, safe-ish)
- `Lumen / Prod secrets` (live keys, only you)
- `Lumen / Break-glass` (2FA recovery codes, registrar, Cloudflare)
Put 2FA (TOTP or passkeys) on **every** account in section 8; store the recovery codes in `Break-glass`, not on the same device as the TOTP app. Max two humans with prod access (10 §15.2).

### 7.2 The three secret stores (and nothing else)
| Store | Holds | Who reads it |
|---|---|---|
| Password manager | Master copy of every key, with date created and where used | You |
| Vercel project env (Encrypted, scoped Development / Preview / Production) | Runtime copies | The deployed app; you via `vercel env pull` |
| GitHub Actions secrets / Environments | CI-only secrets (4.5) | CI workflows |
Local `.env.local` / `.env.development.local` are **derived** files, git-ignored, never the master.

### 7.3 Rules
1. **Never paste a secret into an AI chat, a GitHub issue, a PR, Slack, a screenshot or a doc.** If an agent asks for a key, it is a bug: tell it to read `.env.example` and use `packages/config/env.ts`.
2. Never `cat .env*` in a terminal while screen-sharing. Never commit `.env*` except `.env.example` (Gitleaks allow-lists only that path, 11 §3.3).
3. Separate values per environment: **Development** and **Preview** use sandbox keys, **Production** uses live keys (10 §15.2). Production keys never touch your laptop.
4. Every key gets an expiry/rotation date in the password manager note. Rotate immediately on: staff change, suspected leak, laptop loss. Procedure in 09.
5. Spend limits on every metered API key (8.14).
6. `NEXT_PUBLIC_*` values are public by definition; everything else is server-only (`server-only` import, 04 §8.3).

### 7.4 `vercel env pull` (founder only; agents are denied)
```bash
$ vercel login
$ vercel link                                   # pick team, project `lumen-web`; creates .vercel/ (git-ignored)
$ vercel env pull .env.development.local --environment=development
> Created .env.development.local file
```
Why `.env.development.local`: Next.js loads files in this order, later wins: `.env` < `.env.development` < `.env.local` < `.env.development.local` (verify at nextjs.org/docs/app/guides/environment-variables). Shared sandbox keys come from Vercel; **per-developer values** (your Neon dev-branch URL) go in `.env.local` and must **not** exist in Vercel's Development scope, otherwise the pull would overwrite them. Both file names are git-ignored and agent-denied.

Add to `.gitignore` if missing: `.env`, `.env.local`, `.env.*.local`, `.env.production`, `.vercel`, `*.pem`, `*.key`.

### 7.5 Pre-commit protection
```bash
$ lefthook install                               # hook config ships in repo (11 §3.3: gitleaks protect --staged, prettier, eslint)
$ gitleaks detect --redact                       # scan full history once
```

---

## 8. Accounts, in the right order

Each subsection: what to create, exact settings, **outputs → env var names** (from 10 §15.3), and the phase it matters. Save every output in the password manager the moment it is shown (many keys display once).

### 8.1 Master table

| # | Account | Phase | Cost to start | Env produced |
|---|---|---|---|---|
| 1 | Password manager | now | per plan | — |
| 2 | GitHub | now | free | repo, Actions secrets |
| 3 | Domain registrar + Cloudflare | P0 | domain ~USD 10-20/yr; CF free | `TURNSTILE_*`, `R2_*` |
| 4 | Neon | P0 | free tier to start; Launch/Scale before launch (verify) | `DATABASE_URL`, `DATABASE_URL_UNPOOLED` |
| 5 | Vercel **Pro** | P0 | ~USD 20/seat/mo (verify) | project env |
| 6 | Google Cloud (OAuth) | P0 | free | `GOOGLE_CLIENT_ID/SECRET` |
| 7 | Resend | P0 | free tier (verify limits) | `RESEND_*` |
| 8 | Upstash Redis | P0 | free tier (verify) | `RATE_LIMIT_REDIS_*` |
| 9 | Inngest | P0 | free tier (verify) | `INNGEST_*` |
| 10 | Sentry | P0 | free dev plan (verify) | `SENTRY_*` |
| 11 | PostHog | P0 | free tier (verify) | `POSTHOG_*` |
| 12 | Cloudflare R2 + Turnstile | P0 | R2 free tier then pay-as-you-go (verify) | `R2_*`, `TURNSTILE_*` |
| 13 | Bunny Stream | P1 | pay-as-you-go (small prepaid) | `BUNNY_*` |
| 14 | SSLCommerz sandbox (then live) | P1 | sandbox free; live setup fee BDT 25,500 [10 §15.2, verify] | `SSLCZ_*` |
| 15 | Anthropic, Deepgram, OpenAI, Google AI (Gemini) | P1 | prepaid credit with caps | `ANTHROPIC_*`, `DEEPGRAM_*`, `OPENAI_*`, `GEMINI_*` |
| 16 | SMS gateway (sender ID) | P0 start, P1 use | per message | `SMS_*` |
| 17 | Paddle (seller application) | apply P0, use P1 | free to apply | `PADDLE_*` |

### 8.2 LONG items to submit on day 1 (they run in the background)
1. **Business registration, TIN, BIN, business bank account** (10 §15.2 #1). Ask the chartered accountant the 15.4 questions before first sale.
2. **SSLCommerz**: open the **sandbox** account today (instant); submit the live merchant application with documents per 10 §3.7 (weeks).
3. **Paddle** seller application (1-4 weeks; Stripe-Atlas fallback in D3).
4. **SMS gateway** account and **masking sender ID** + template approval (days to weeks).
Track them in this table in `docs/PROGRESS.md` ("Founder blockers"):

| Item | Submitted on | Expected | Status | Follow-up date |
|---|---|---|---|---|
| Business registration | | | | |
| SSLCommerz live | | | | |
| Paddle | | | | |
| SMS sender ID | | | | |
| Accountant engaged | | | | |

### 8.3 Domain + Cloudflare (DNS, WAF, Turnstile, R2)
1. Buy the domain at a registrar with 2FA and registrar lock; enable auto-renew and WHOIS privacy.
2. Cloudflare -> Add a site -> Free plan (upgrade later if needed). At the registrar, set the two nameservers Cloudflare gives you. Wait for "Active" (minutes to hours).
3. DNS -> enable **DNSSEC** (copy the DS record to the registrar).
4. SSL/TLS -> mode **Full (strict)** once Vercel is serving the domain (before that, use DNS-only records).
5. **Do not** create DNS records for Vercel until section 13.3.
Outputs: none yet; Turnstile and R2 come next (8.12).

### 8.4 Neon (database; Singapore)
1. Sign up at neon.com, enable 2FA. Create **Project**: name `lumen`, **Region: AWS Asia Pacific (Singapore) `ap-southeast-1`** (D3), Postgres **17** (verify; D3 says 17+). Default branch is `main` (this will be production data; leave it empty until launch).
2. Create the branch tree (UI: Branches -> New branch, or CLI):
```bash
$ neon auth                                                   # browser login (verify subcommand name)
$ neon projects list                                          # note the project id
$ neon branches create --project-id <ID> --name staging --parent main
$ neon branches create --project-id <ID> --name dev-you-mac --parent staging
$ neon branches create --project-id <ID> --name dev-you-pc  --parent staging      # only when you add the second machine
```
Naming: `main` (production), `staging` (long-lived, 04 §9), `dev-<name>-<machine>` (per developer, per machine), `preview/pr-<n>` (created and deleted by CI, 11 §3.2), `pre-migrate/<sha>` (CI, 11 §4).
3. Connection strings (Dashboard -> branch -> Connect):
   - **Pooled** (host contains `-pooler`) → `DATABASE_URL`.
   - **Direct/unpooled** → `DATABASE_URL_UNPOOLED` (used by `drizzle-kit` migrations).
   - CLI: `neon connection-string dev-you-mac --project-id <ID> --pooled` and without `--pooled` (verify flags).
   Both URLs end with `?sslmode=require`. Put the **dev-branch** pair in your `.env.local`. Put `staging`'s pair in Vercel (Preview scope is overridden per PR by CI; Staging project uses `staging`), and `main`'s pair in Vercel Production only.
4. Settings: `main` branch -> Autoscaling min 0.5 CU before launch (04 §12); enable point-in-time restore window (verify plan limits). Dev/staging branches: scale-to-zero **on** (saves money; adds ~0.5-2 s cold start on the first query, see error #12).
5. Create a **Neon API key** (Account -> API keys) for CI → `NEON_API_KEY` (GitHub secret, 4.5).
Phase: P0.

### 8.5 Vercel Pro
1. Sign in with GitHub. Create a **Team** (Pro; Hobby is non-commercial and must not host this, D3). Enable 2FA.
2. Import the GitHub repo → Project name `lumen-web` (this is the **production** project; 04 §8.3). Framework: Next.js. Root directory: `apps/web`. Build command and install command: leave default; Vercel detects pnpm from `packageManager`; **enable "Include source files outside of the Root Directory"** (needed for monorepo packages; verify label).
3. Settings -> Functions -> Region: **Singapore (`sin1`)** (or Mumbai `bom1`; D3).
4. Settings -> Environment Variables: add per scope (section 9 lists names). Mark secrets **Sensitive** (not readable after save). Scope rules:
   - Production: live values only (can stay mostly empty until launch).
   - Preview: sandbox values (shared) + `APP_ENV=preview`; `DATABASE_URL*` set per PR by CI (11 §3.2).
   - Development: shared sandbox values for `vercel env pull`; **no** `DATABASE_URL*`.
5. Create the second project `lumen-staging` from the same repo (Production Branch `main`, domain `staging.<domain>`, sandbox providers, DB `staging` branch). 04 §8.3 makes staging the soak environment and `lumen-web` the promoted production (section 13).
6. Settings -> Git: set "Production Branch" of `lumen-web` to `main` but **disable auto-promote** (Settings -> Environments or deployment protection; verify exact UI) — we promote manually after staging smoke tests.
7. Settings -> Deployment Protection: enable **Vercel Authentication** for previews, plus a **Protection Bypass for Automation** secret → `VERCEL_AUTOMATION_BYPASS_SECRET` (for Playwright, 11 §3.2).
8. Create a token (Account -> Tokens) → `VERCEL_TOKEN`; copy `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` from `.vercel/project.json` after `vercel link`.
Phase: P0.

### 8.6 Google OAuth (Google Cloud)
Better Auth's callback path is `/api/auth/callback/google` (11 §11.2). Locale prefixes do not apply because `/api/*` sits outside `[locale]` (D2).

Create **two** Google Cloud projects (so a dev mistake cannot break prod; 11 §11.2):
- **`lumen-dev`** (OAuth consent screen: **External**, Publishing status **Testing**; add your Google accounts as Test users; refresh tokens expire after 7 days in Testing [verify], acceptable for dev). OAuth client type **Web application**, name `lumen-dev-web`:
  - Authorised JavaScript origins: `http://localhost:3000`, `https://staging.<domain>`, `https://preview.<domain>`
  - Authorised redirect URIs (exact, no wildcards):
    - `http://localhost:3000/api/auth/callback/google`
    - `https://staging.<domain>/api/auth/callback/google`
    - `https://preview.<domain>/api/auth/callback/google`
  - Per-PR preview URLs (`lumen-web-git-<branch>-<team>.vercel.app`) change every PR and Google rejects wildcards. **Policy:** Google sign-in is not tested on random PR previews; email-OTP is. When you must test Google on a PR, point the stable alias at it: `vercel alias set <preview-deployment-url> preview.<domain>` (needs a `preview` DNS record to Vercel; verify the alias command).
- **`lumen-prod`**: consent screen **In production**, app name, logo, home page, privacy policy, terms; authorised domain `<domain>` verified in Search Console; scopes only `openid email profile` (11 §11.2). Client `lumen-prod-web`: origin `https://<domain>`; redirect `https://<domain>/api/auth/callback/google` (+ `https://www.<domain>/...` only if www serves the app). **No localhost URIs in prod.**

Outputs: dev client → Vercel Development/Preview/staging scopes and `.env.development.local`; prod client → Vercel Production only. Variables: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`. Phase: P0 (dev client), launch gate (prod client; allow lead time for brand verification).

### 8.7 Resend (email) + DNS
1. Create account, enable 2FA. Domains -> Add domain `mail.<domain>`, region closest (verify; choose Singapore/Asia if offered).
2. Resend displays DNS records (SPF TXT, DKIM CNAME/TXT, a return-path MX, sometimes a TXT). **Copy them exactly as displayed** into Cloudflare DNS with the **proxy off (grey cloud / "DNS only")**. Click Verify; propagation can take minutes to hours.
3. API Keys -> create **Sending access** key restricted to `mail.<domain>` → `RESEND_API_KEY`. Create separate keys for Development (can send only to your own address) and Production.
4. Webhooks -> endpoint `https://staging.<domain>/api/webhooks/resend` (and prod later), events: bounced, complained, delivered; copy the signing secret → `RESEND_WEBHOOK_SECRET`. For local tests the webhook URL needs a tunnel (10.6).
5. Set `EMAIL_FROM_TRANSACTIONAL="Lumen <no-reply@mail.<domain>>"`, `EMAIL_FROM_MARKETING`, `EMAIL_REPLY_TO`.
Local development uses the `console`/Mailpit path instead of real sending (10.5). Phase: P0. DNS detail: section 14.

### 8.8 Upstash Redis (rate limits)
1. Create database `lumen-ratelimit`, **Regional**, region **Singapore** (`ap-southeast-1`), TLS on, eviction off (verify).
2. REST API tab → `RATE_LIMIT_REDIS_URL` (the `https://...upstash.io` REST URL) and `RATE_LIMIT_REDIS_TOKEN` (read/write token; not the read-only one).
3. One database per environment is cleanest (`-dev`, `-staging`, `-prod`) so tests never collide with production counters; on the free tier a shared dev/staging DB is acceptable.
Note: Upstash is a D3 choice whose 10 §15.3 text still says "pending a 00 change-log entry" while 00 already lists it; treat as decided. Fail-closed behaviour on auth/OTP/payment endpoints means a missing Redis URL **blocks sign-in locally**; local dev should set `RATE_LIMIT_BACKEND=postgres` or run with Redis keys (NEW-ENV-05). Phase: P0.

### 8.9 Inngest
1. Create account and an app. Inngest Cloud gives **two environments** (Production and a Branch/Dev environment per branch; verify) with an **Event key** and **Signing key** each → `INNGEST_EVENT_KEY`, `INNGEST_SIGNING_KEY`.
2. **Local development uses the Inngest Dev Server, not cloud keys** (section 10.4); leave the two vars as placeholder strings locally (`INNGEST_DEV=1` tells the SDK to talk to the dev server; verify variable name in current SDK docs).
3. After the first deploy: Inngest dashboard → Apps → Sync new app → URL `https://staging.<domain>/api/inngest` (production later). If Vercel Deployment Protection is on, install the Inngest Vercel integration or add the bypass (verify) otherwise sync returns 401 (error #17).
Phase: P0.

### 8.10 Sentry
1. Create org + project (Next.js), region: EU or US as policy allows (PII scrubbing, D3). Enable 2FA.
2. `SENTRY_DSN` and `NEXT_PUBLIC_SENTRY_DSN` (same DSN), `SENTRY_AUTH_TOKEN` (Settings → Developer settings → Organisation token, scopes: project:releases, org:read; used **only in CI/Vercel build** for source maps).
3. Leave DSN **empty locally** (saves CPU and avoids noise); `env.ts` marks it optional when `APP_ENV=local`.
4. Add `SENTRY_ORG`, `SENTRY_PROJECT` as Vercel build env vars (names per `@sentry/nextjs` docs; verify). Phase: P0.

### 8.11 PostHog
1. Create project (EU or US cloud, cookie-consent gated per D3). `POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_KEY` (project API key; public), `POSTHOG_HOST` (`https://eu.i.posthog.com` or `https://us.i.posthog.com`).
2. Use separate projects for non-production (`lumen-dev`) so test events do not pollute funnels. Locally leave empty. Phase: P0 wiring, P1 use.

### 8.12 Cloudflare R2 + Turnstile
**R2** (Cloudflare → R2 Object Storage; add a payment method to enable; free tier covers early use, verify):
1. Create buckets (names are per-environment; 10 §10.2 defines roles): `lumen-private-dev`, `lumen-speaking-dev`, `lumen-public-dev` (+ `-staging`, `-prod` later). All private except public (served via `assets.<domain>` custom domain later).
2. R2 → Manage API tokens → Create API token → **Object Read & Write**, scoped to the specific buckets, TTL optional. Copy Access Key ID, Secret, and the Account ID → `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ACCOUNT_ID`; bucket names → `R2_BUCKET_PRIVATE`, `R2_BUCKET_SPEAKING`, `R2_BUCKET_PUBLIC`. Create a second, narrower token for the speaking bucket → `R2_SPEAKING_ACCESS_KEY_ID/SECRET` (recommended in 10).
3. CORS (per bucket, for browser presigned PUT): allowed origins `http://localhost:3000`, `https://staging.<domain>` (dev buckets); only prod origins on prod buckets; methods `PUT, GET, HEAD`; headers `content-type, content-length`; expose `ETag`. (Exact JSON shape: verify in R2 docs; the smoke script 11.5 tests an upload.)
4. `R2_PUBLIC_BASE_URL`: dev may use the bucket's `r2.dev` URL (disable before launch); prod uses `https://assets.<domain>`.

**Turnstile** (Cloudflare → Turnstile → Add widget): one widget per environment. Hostnames: dev widget `localhost`, `staging.<domain>`; prod widget `<domain>`. Mode Managed. → `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`.
Cloudflare provides **always-pass test keys** for local dev (site key `1x00000000000000000000AA`, secret `1x0000000000000000000000000000000AA`; verify at developers.cloudflare.com/turnstile/troubleshooting/testing). Use them in `.env.example` defaults so sign-up works offline.
Phase: P0.

### 8.13 Bunny Stream
1. Sign up, 2FA, add a small prepaid balance (pay-as-you-go).
2. Stream → Add Video Library: `lumen-dev` (use for local + preview + staging) and later `lumen-prod`. **Never share the prod library with previews** (10 §8.2). Region/replication: choose Asia replication nodes (verify names).
3. In the library: enable **Token Authentication**, set **Allowed referrers** (`localhost`, `staging.<domain>`; `*.vercel.app` for the dev library only), disable original/MP4 download, MediaCage Basic if available, set resolutions 240p-720p (10 §8.2).
4. Outputs: Library ID → `BUNNY_STREAM_LIBRARY_ID`; library API key → `BUNNY_STREAM_API_KEY`; Token Authentication Key → `BUNNY_TOKEN_KEY` (**different** from the API key); pull zone hostname `vz-xxxx.b-cdn.net` → `BUNNY_CDN_HOSTNAME`; generate a random string for `BUNNY_WEBHOOK_URL_SECRET` (`openssl rand -hex 24`) and set the library webhook to `https://staging.<domain>/api/webhooks/bunny/<that secret>`.
Phase: P1 (open now, configure at P1-video tasks).

### 8.14 AI keys with spend limits (Anthropic, Deepgram, OpenAI, Google AI)
Create **separate keys for dev and prod** at each provider, and a **monthly spend cap** on each. Dev caps suggested: Anthropic USD 20, Deepgram USD 10, OpenAI USD 10, Gemini USD 10 (adjust). Steps differ per console (verify):
- **Anthropic Console** (console.anthropic.com): Settings → Limits → set monthly spend limit; API keys → create `lumen-dev` key → `ANTHROPIC_API_KEY`. Set `ANTHROPIC_MODEL_FAST` / `ANTHROPIC_MODEL_SCORING` to the exact model ids shown in the Console model list at build time (10 §15.3: "confirm ids at build time"; do not guess).
- **Deepgram** (console.deepgram.com): create project key with `usage:write` only → `DEEPGRAM_API_KEY`; `DEEPGRAM_STT_MODEL=nova-3`; set a usage alert/limit under Billing.
- **OpenAI** (platform.openai.com): Settings → Limits → monthly budget; project key → `OPENAI_API_KEY`; `OPENAI_STT_MODEL=whisper-1` (word timestamps).
- **Google AI Studio / Gemini API**: create key → `GEMINI_API_KEY`; set quota/billing alert in Google Cloud. `GEMINI_MODEL_FAST/SCORING` per current model list.
- In-app guardrail: `AI_DAILY_BUDGET_USD` (dev = 2, CI = 2 per 10 §15.1, prod per business plan) degrades or blocks calls once exceeded.
For local work with no keys: `LLM_PROVIDER_PRIMARY=fake`, `STT_PROVIDER_PRIMARY=fake` (canned results; 04 §9 `ai.mock`). Never use a prod key locally.
Phase: P1.

### 8.15 SSLCommerz sandbox
1. Register at the SSLCommerz sandbox page (developer.sslcommerz.com → Sandbox registration; verify URL). You receive **Store ID** and **Store Password** by email, plus a sandbox merchant panel login.
2. `SSLCZ_STORE_ID`, `SSLCZ_STORE_PASSWORD`, `SSLCZ_IS_LIVE=false` (must be `true` iff `VERCEL_ENV=production`, enforced in `env.ts`).
3. In the sandbox panel, register IPN URL = `https://<tunnel-or-staging>/api/webhooks/sslcommerz/ipn` (exact path per 10 §3; verify). **The IPN path must not sit behind Turnstile, WAF challenge, or Vercel Deployment Protection** (10 §15.1, 11 §11.1). On staging, add a Vercel Deployment Protection exception or bypass for `/api/webhooks/*` (verify) or the IPN gets a 401 (error #20).
4. Test cards/wallets: take from SSLCommerz docs (10 §15.1 marks as unconfirmed).
5. Local: use `PAYMENT_PROVIDER_BD=fake` (mock gateway in `tooling/mock-gateway`) for daily work, and the cloudflared tunnel (10.6) only when testing real sandbox IPN.
Phase: P1 (sandbox), P1 gate (live).

### 8.16 SMS gateway
Open the account now (lead time). Dev: `SMS_PROVIDER=console` prints OTPs in the terminal; no gateway needed. When the sender ID is approved, set `SMS_OTP_ENABLED=true`, provider-specific vars (10 §15.3), `SMS_SENDER_ID`. Never send real SMS from preview environments.

### 8.17 Optional/later
bKash merchant (P2), Zoom Video SDK / LiveKit / YouTube (P2), Azure Speech (P2), Payoneer, Meilisearch (P3), Better Stack uptime/status page and Axiom log drain (D3 optional, 11).

---

## 9. `.env.example` (full annotated template)

This is the content spec for the file created by P0-07 (`pnpm env:example` regenerates it from the zod schema in `packages/config/env.ts`; CI fails when they drift, 10 §15.3, 04 §8.3). **Names follow 10 §15.3** (see section 18 for the naming drift with 04 §8.3 that the P0-07 task must settle). Values below are safe defaults or empty. Phase tags: `[P0]` needed to boot the web app locally, `[P1]` needed for MVP features, `[P2]` later, `[opt]` optional. `R:` = required in production.

```dotenv
# =====================================================================
# .env.example  —  copy to .env.local (personal) and pull shared keys with
#   vercel env pull .env.development.local --environment=development
# NEVER put real secrets in this file. It is committed and agent-readable.
# Load order (later wins): .env < .env.development < .env.local < .env.development.local
# =====================================================================

# ---------- 1. Core / platform ----------
NODE_ENV=development                      # [P0] R: production. development|test|production
APP_ENV=local                             # [P0] R. local|preview|staging|production (04 §8.3). Seeds refuse to run when production
VERCEL_ENV=                               # [P0] set by Vercel; leave empty locally
APP_URL=http://localhost:3000             # [P0] R. Canonical origin; builds return/IPN/webhook URLs (<=255 chars incl. path)
NEXT_PUBLIC_APP_URL=http://localhost:3000 # [P0] R. Same origin for client code
BETTER_AUTH_URL=http://localhost:3000     # [P0] R. Base URL for auth callbacks
BETTER_AUTH_SECRET=                       # [P0] R. >=32 random bytes: openssl rand -base64 48. Different per environment
ENCRYPTION_KEY_B64=                       # [P0] R. 32 random bytes base64: openssl rand -base64 32. Field-level encryption
ENCRYPTION_KEY_ID=1                       # [P0] R. Key id for rotation
STORAGE_KEY_HMAC_SECRET=                  # [P0] R. openssl rand -hex 32. HMAC for userHash in R2 keys
LOG_IP_SALT_SECRET=                       # [P0] R. >=32 chars (04 §8.3). openssl rand -hex 32
ADMIN_ALERT_EMAIL=you@example.com         # [P0] R
FINANCE_ALERT_EMAIL=you@example.com       # [P1] R

# ---------- 2. Database (Neon) ----------
DB_DRIVER=neon                            # [P0] neon|pg (D12 GA-005). neon = @neondatabase/serverless WebSocket pool (needs Neon). pg = node-postgres (plain local Postgres)
DATABASE_URL=                             # [P0] R. Pooled string (host has -pooler). Dev: your dev-<you>-<machine> branch
DATABASE_URL_UNPOOLED=                    # [P0] R. Direct string for drizzle-kit migrations
# Local Docker alternative (DB_DRIVER=pg):
# DATABASE_URL=postgres://postgres:postgres@localhost:5432/lumen_dev
# DATABASE_URL_UNPOOLED=postgres://postgres:postgres@localhost:5432/lumen_dev

# ---------- 3. Auth providers ----------
GOOGLE_CLIENT_ID=                         # [P0] R. Dev project client locally; prod client in Production scope only
GOOGLE_CLIENT_SECRET=                     # [P0] R.
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA          # [P0] R. Cloudflare always-pass TEST key (verify). Real key per env
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA          # [P0] R. TEST secret locally ONLY
# P0 phone OTP and passkeys need no extra vars (RP ID derives from APP_URL host)

# ---------- 4. Provider selection (enums validated in env.ts) ----------
PAYMENT_PROVIDER_BD=fake                  # [P1] R. fake|sslcommerz|bkash. production must not be fake
PAYMENT_PROVIDER_INTL=fake                # [P1] R. fake|paddle|stripe|lemonsqueezy
VIDEO_PROVIDER=fake                       # [P1] R. fake|bunny
STORAGE_PROVIDER=r2                       # [P0] R. r2|minio (04 §9 optional MinIO profile)|fake
EMAIL_PROVIDER=console                    # [P0] R. console|mailpit|resend|ses. console prints; mailpit -> localhost:1025
SMS_PROVIDER=console                      # [P0] R. console|sslwireless|alphasms|bulksmsbd
LLM_PROVIDER_PRIMARY=fake                 # [P1] R. fake|anthropic|gemini
LLM_PROVIDER_FALLBACK=fake                # [P1] R.
STT_PROVIDER_PRIMARY=fake                 # [P1] R. fake|deepgram|openai
STT_PROVIDER_FALLBACK=fake                # [P1] R.
LIVE_PROVIDER=none                        # [P2] R. none|zoom|youtube|livekit
RATE_LIMIT_BACKEND=postgres               # [P0] proposed (NEW-ENV-05): postgres|redis. production must be redis

# ---------- 5. Rate limiting (Upstash Redis, Singapore) ----------
RATE_LIMIT_REDIS_URL=                     # [P0 if backend=redis] R. https://<id>.upstash.io (REST)
RATE_LIMIT_REDIS_TOKEN=                   # [P0 if backend=redis] R.

# ---------- 6. Background jobs (Inngest) ----------
INNGEST_DEV=1                             # [P0] local only: use Inngest Dev Server at http://localhost:8288 (verify var name in SDK docs)
INNGEST_EVENT_KEY=local-dev-placeholder   # [P0] R. Real key in Preview/Staging/Prod
INNGEST_SIGNING_KEY=                      # [P0] R. Verifies requests to /api/inngest. Empty ok when INNGEST_DEV=1

# ---------- 7. Observability (leave empty locally) ----------
SENTRY_DSN=                               # [P0] R.
NEXT_PUBLIC_SENTRY_DSN=                   # [P0] R.
SENTRY_AUTH_TOKEN=                        # [opt] CI/Vercel build only (source maps)
POSTHOG_KEY=                              # [P0] R.
NEXT_PUBLIC_POSTHOG_KEY=                  # [P0] R.
POSTHOG_HOST=https://eu.i.posthog.com     # R. or https://us.i.posthog.com
POSTHOG_PERSONAL_API_KEY=                 # [opt]

# ---------- 8. Email (Resend) / SMS ----------
RESEND_API_KEY=                           # [P0] R. Send-only key restricted to mail.<domain>
RESEND_WEBHOOK_SECRET=                    # [P0] R. Svix signing secret
EMAIL_FROM_TRANSACTIONAL="Lumen <no-reply@mail.example.com>"   # [P0] R
EMAIL_FROM_MARKETING="Lumen <hello@news.example.com>"          # [P1] R
EMAIL_REPLY_TO=support@example.com        # [P0] R
AWS_SES_REGION=                           # [opt] SES fallback only
AWS_SES_ACCESS_KEY_ID=                    # [opt]
AWS_SES_SECRET_ACCESS_KEY=                # [opt]
SMS_OTP_ENABLED=false                     # [P1] R. Kill switch; true only in prod after sender ID approval
SMS_SENDER_ID=                            # [P1] approved masking sender id
SSLWIRELESS_API_TOKEN=                    # [opt] names depend on gateway API (verify)
SSLWIRELESS_SID=                          # [opt]
SSLWIRELESS_BASE_URL=                     # [opt]
ALPHASMS_API_KEY=                         # [opt]
BULKSMSBD_API_KEY=                        # [opt]
WHATSAPP_ACCESS_TOKEN=                    # [P2]
WHATSAPP_PHONE_NUMBER_ID=                 # [P2]
WHATSAPP_VERIFY_TOKEN=                    # [P2]

# ---------- 9. Storage (Cloudflare R2) ----------
R2_ACCOUNT_ID=                            # [P0] R.
R2_ACCESS_KEY_ID=                         # [P0] R.
R2_SECRET_ACCESS_KEY=                     # [P0] R.
R2_BUCKET_PRIVATE=lumen-private-dev       # [P0] R.
R2_BUCKET_SPEAKING=lumen-speaking-dev     # [P1] R.
R2_BUCKET_PUBLIC=lumen-public-dev         # [P0] R.
R2_PUBLIC_BASE_URL=                       # [P0] R. dev: bucket r2.dev URL; prod: https://assets.<domain>
R2_SPEAKING_ACCESS_KEY_ID=                # [opt, recommended] least-privilege token for speaking bucket
R2_SPEAKING_SECRET_ACCESS_KEY=            # [opt, recommended]
SPEAKING_AUDIO_RETENTION_DAYS=90          # [P1] D12 C6 says 90 (10 §15.3 text says 30: see section 18)

# ---------- 10. Video (Bunny Stream) ----------
BUNNY_STREAM_LIBRARY_ID=                  # [P1] R. dev library for local/preview/staging
BUNNY_STREAM_API_KEY=                     # [P1] R.
BUNNY_TOKEN_KEY=                          # [P1] R. Token Authentication Key (not the API key)
BUNNY_CDN_HOSTNAME=                       # [P1] R. vz-xxxx.b-cdn.net
BUNNY_WEBHOOK_URL_SECRET=                 # [P1] R. openssl rand -hex 24
BUNNY_ACCOUNT_API_KEY=                    # [opt]
BUNNY_CDN_TOKEN_KEY=                      # [P2 opt] signed HLS own-player

# ---------- 11. Payments ----------
SSLCZ_STORE_ID=                           # [P1] R. sandbox values in all non-prod
SSLCZ_STORE_PASSWORD=                     # [P1] R. scrub from logs
SSLCZ_IS_LIVE=false                       # [P1] R. true iff VERCEL_ENV=production
SSLCZ_REFUND_RELAY_URL=                   # [opt] fixed-IP refund relay
SSLCZ_REFUND_RELAY_TOKEN=                 # [opt]
BKASH_APP_KEY=                            # [P2]
BKASH_APP_SECRET=                         # [P2]
BKASH_USERNAME=                           # [P2]
BKASH_PASSWORD=                           # [P2]
BKASH_IS_LIVE=false                       # [P2]
BKASH_BASE_URL=                           # [P2 opt]
PADDLE_API_KEY=                           # [P1 if Paddle]
PADDLE_ENV=sandbox                        # [P1] sandbox|production
PADDLE_WEBHOOK_SECRET=                    # [P1 if Paddle] pdl_ntfset_...
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=          # [P1 if overlay checkout]
PADDLE_PRICE_MAP_JSON=                    # [opt]
STRIPE_SECRET_KEY=                        # [opt] only if Stripe via foreign entity
STRIPE_WEBHOOK_SECRET=                    # [opt]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=       # [opt]
LEMONSQUEEZY_API_KEY=                     # [opt]
LEMONSQUEEZY_STORE_ID=                    # [opt]
LEMONSQUEEZY_WEBHOOK_SECRET=              # [opt]
TAX_BD_VAT_MODE=inclusive_15              # [P1] inclusive_15|exempt (default from app_setting)
REFUND_APPROVAL_THRESHOLD_BDT=5000        # [P1]
INVOICE_SELLER_LEGAL_NAME=Placeholder Ltd # [P1] placeholders until the entity exists
INVOICE_SELLER_BIN=
INVOICE_SELLER_TIN=
INVOICE_SELLER_ADDRESS=

# ---------- 12. AI ----------
ANTHROPIC_API_KEY=                        # [P1] R. dev key with monthly cap
ANTHROPIC_MODEL_FAST=                     # [P1] R. Haiku-class id; confirm in Console at build time
ANTHROPIC_MODEL_SCORING=                  # [P1] R. Sonnet-class id; confirm at build time
GEMINI_API_KEY=                           # [P1] R. fallback LLM
GEMINI_MODEL_FAST=                        # [P1] R.
GEMINI_MODEL_SCORING=                     # [P1] R.
OPENAI_API_KEY=                           # [P1] R. STT fallback
OPENAI_STT_MODEL=whisper-1                # [P1] R.
DEEPGRAM_API_KEY=                         # [P1] R. STT default
DEEPGRAM_STT_MODEL=nova-3                 # [P1] R.
AZURE_SPEECH_KEY=                         # [P2 opt]
AZURE_SPEECH_REGION=                      # [P2 opt]
AI_DAILY_BUDGET_USD=2                     # [P1] R. dev 2; CI 2; prod set by business plan

# ---------- 13. Live classes (P2/P3) ----------
YOUTUBE_API_KEY=                          # [P2 opt]
ZOOM_VIDEO_SDK_KEY=                       # [P2]
ZOOM_VIDEO_SDK_SECRET=                    # [P2]
ZOOM_WEBHOOK_SECRET_TOKEN=                # [P2]
LIVEKIT_URL=                              # [P3]
LIVEKIT_API_KEY=                          # [P3]
LIVEKIT_API_SECRET=                       # [P3]
LIVEKIT_WEBHOOK_KEY=                      # [P3 opt]
HUNDREDMS_ACCESS_KEY=                     # [opt]
HUNDREDMS_SECRET=                         # [opt]

# ---------- 14. Misc ----------
LINKEDIN_ORGANIZATION_ID=                 # [P1 opt]
OB3_SIGNING_KEY_JWK=                      # [P3 opt]

# ---------- 15. Local-only developer conveniences (ignored in preview/staging/prod) ----------
MAIL_SMTP_HOST=localhost                  # Mailpit (OrbStack/Docker) SMTP, used when EMAIL_PROVIDER=mailpit
MAIL_SMTP_PORT=1025
SEED_DEV_USERS=true                       # dev-users.ts: one user per role, password dev-only-<role> (04 §9). Refused if APP_ENV=production
```

### 9.1 Required-per-phase summary

| Phase | Must be real (not fake/empty) to proceed | Can stay fake/empty |
|---|---|---|
| **P0** (auth, marketing site, CMS) | `DATABASE_URL*` (Neon dev branch), `BETTER_AUTH_*`, `ENCRYPTION_KEY_*`, `STORAGE_KEY_HMAC_SECRET`, `LOG_IP_SALT_SECRET`, Google dev client, Turnstile (test keys OK locally), R2 dev buckets (for uploads), Resend (for real mail from staging), Inngest dev server | Everything in 4's `fake` rows, SMS (`console`), Sentry/PostHog (empty), Bunny, AI, SSLCommerz, Paddle |
| **P1** (MVP launch) | + Bunny dev library, Anthropic + Deepgram + OpenAI + Gemini dev keys with caps, SSLCommerz sandbox, Paddle sandbox, SMS gateway (staging+prod), Sentry/PostHog DSNs on staging/prod | bKash, live providers |
| **P2** | + bKash, Zoom/YouTube, WhatsApp, Azure Speech | LiveKit |
| **P3** | + LiveKit, OB3 key | — |

### 9.2 Generate local secrets in one go
```bash
$ for v in BETTER_AUTH_SECRET:48 ENCRYPTION_KEY_B64:32 STORAGE_KEY_HMAC_SECRET:32 LOG_IP_SALT_SECRET:32 BUNNY_WEBHOOK_URL_SECRET:24; do n=${v%%:*}; b=${v##*:}; echo "$n=$(openssl rand -base64 $b | tr -d '\n=+/' | cut -c1-44)"; done
```
(Prints five lines for pasting into **your** `.env.local`. For `ENCRYPTION_KEY_B64` the schema wants exactly 32 raw bytes base64-encoded; use `openssl rand -base64 32` unmodified for that one. Run these in your own terminal, never via an AI tool.)

---

## 10. First run

### 10.1 Prerequisites check
```bash
$ cd ~/code/lumen-academy
$ git switch main && git pull
$ node -v && pnpm -v && git --version
> v24.x   10.x   2.4x
```

### 10.2 Create your env files
```bash
$ cp .env.example .env.local                  # then edit with your editor, not an AI tool
$ vercel link                                 # once
$ vercel env pull .env.development.local --environment=development
```
Fill in `.env.local` at minimum: `DATABASE_URL`, `DATABASE_URL_UNPOOLED` (your dev branch), generated secrets (9.2), `GOOGLE_*` (dev client), R2 values. Everything else can stay as the `fake`/`console` defaults.

### 10.3 Install, migrate, seed, run
```bash
$ pnpm install                    # first time ~1-3 min; Turborepo + pnpm store
> Done in 1m 42s
$ pnpm db:migrate                 # applies Drizzle migrations to your Neon dev branch (uses DATABASE_URL_UNPOOLED)
> migrations applied successfully
$ pnpm db:seed                    # rbac + taxonomy + demo content + dev users (APP_ENV=local only)
> seeded: roles 12, tracks 3, price books 2, demo courses 2, users 12
$ pnpm dev
>  ▲ Next.js 16.x (Turbopack)
>  - Local:  http://localhost:3000
>  ✓ Ready in 2.1s
```
Open http://localhost:3000 (English, no prefix) and http://localhost:3000/bn (Bangla; D2 `as-needed`). Sign in with a seeded user: email `student@example.test` style addresses and password `dev-only-<role>` (exact emails are defined in `packages/db/seed/dev-users.ts`; email sign-in with a password exists only for `APP_ENV=local`, 04 §9). The agent that implements the seed must print the table of dev logins after `pnpm db:seed` (NEW-ENV-04).

"Known good first run" (all must be true):
- [ ] `pnpm verify` is green (typecheck + lint + unit + build).
- [ ] `http://localhost:3000` renders the marketing home; `/bn` renders Bangla glyphs correctly in Noto Sans Bengali.
- [ ] `http://localhost:3000/sign-in` loads; Turnstile test widget auto-passes.
- [ ] Sign-in as the seeded `student` lands on `/app`.
- [ ] `http://localhost:3000/api/health/ready` returns 200 (11 §3.4 smoke target).
- [ ] Inngest Dev Server shows the app's functions (10.4).
- [ ] `pnpm smoke:db` and `pnpm smoke:all` pass for the integrations you configured (section 11).

### 10.4 Inngest Dev Server (second terminal)
```bash
$ pnpm dlx inngest-cli@latest dev -u http://localhost:3000/api/inngest      # verify flags in Inngest docs
> Inngest Dev Server online at http://localhost:8288
```
Open http://localhost:8288 → Apps: your app should show "Synced" with its functions. Trigger an event from the UI "Send event" to test a function. With `INNGEST_DEV=1` the app talks to this server; no cloud keys are needed. Stop it when not testing background jobs (CPU).

### 10.5 `DB_DRIVER` choices (D12 GA-005)

| Mode | When | How |
|---|---|---|
| `DB_DRIVER=neon` (default) | Normal work, laptop stays cool | `.env.local` has your Neon dev-branch URLs. Requires internet. Cold start after idle: first query may take 1-2 s |
| `DB_DRIVER=pg` | Offline, or testing against plain Postgres, or CI parity checks | `docker compose up -d postgres mailpit` (OrbStack), set `DB_DRIVER=pg`, `DATABASE_URL=postgres://postgres:postgres@localhost:5432/lumen_dev`, then `pnpm db:migrate && pnpm db:seed` |
The database client factory in `packages/db` chooses the driver from `DB_DRIVER` (NEON: `@neondatabase/serverless` Pool over WebSocket; PG: `drizzle-orm/node-postgres`) and `env.ts` **fails boot** if `DB_DRIVER=neon` and the URL host is `localhost` or if `DB_DRIVER=pg` and the host is a `*.neon.tech` host (prevents the GA-005 mismatch). Production forces `neon`.

Mailpit (local mail UI) at http://localhost:8025 when `EMAIL_PROVIDER=mailpit`. Default `console` just prints the OTP/email in the `pnpm dev` terminal.

### 10.6 Webhook tunnel (only when testing real IPN/webhooks locally)
```bash
$ cloudflared tunnel --url http://localhost:3000
> Your quick Tunnel has been created! Visit it at: https://random-words.trycloudflare.com
```
Set `APP_URL=https://random-words.trycloudflare.com` **temporarily** in `.env.local`, restart `pnpm dev`, register `https://random-words.trycloudflare.com/api/webhooks/sslcommerz/ipn` in the sandbox panel. The URL changes on every run (quick tunnels; named tunnels need a Cloudflare account, verify). Revert `APP_URL` afterwards (error #19).

### 10.7 Daily loop
```bash
$ git switch main && git pull && git switch -c task/P0-xx-short-name     # or use /next-task
$ pnpm dev                                                                # terminal 1
$ claude                                                                  # terminal 2, one agent at a time
# ... agent works; at the end:
$ pnpm verify
$ git push -u origin HEAD && gh pr create --fill
```

---

## 11. Smoke scripts: verify each integration

Spec for task NEW-ENV-03: `tooling/scripts/smoke/<name>.ts`, run with `pnpm smoke:<name>`; `pnpm smoke:all` runs every configured one and prints a summary table. Rules: read env **only** through `packages/config/env.ts`; print provider names and PASS/FAIL, **never secret values**; each script cleans up after itself; skip (not fail) with `SKIP (fake provider)` when the selected provider is `fake`; refuse to run against `APP_ENV=production` unless `--i-know-this-is-prod`; real-API scripts are cheap (AI scripts cap at one tiny call).

### 11.1 Table

| Script | What it does | PASS means | Costs |
|---|---|---|---|
| `smoke:env` | Parses env with zod; diff vs `.env.example` names | env valid; no unknown/missing names | 0 |
| `smoke:db` | Connects with the configured `DB_DRIVER`, `select 1`, `select now()`, checks migration table count, row counts of `role` | latency printed; roles = 12 | 0 |
| `smoke:redis` | `SET smoke:<ts> 1 EX 10`, `GET`, `DEL`; one `@upstash/ratelimit` check | round trip < 300 ms | 0 |
| `smoke:auth` | Fetches `/api/auth/ok` or `/api/auth/get-session` (200, no session), checks Google `redirectURI` equals the registered pattern (prints it) | callback URI shown matches 8.6 | 0 |
| `smoke:email` | Sends one email via the active provider to `ADMIN_ALERT_EMAIL` (console: prints) | provider returns message id | 0 |
| `smoke:r2` | Presigned PUT of 16-byte object, GET it, wrong-length PUT rejected, DELETE | all 4 steps OK | 0 |
| `smoke:bunny` | Creates a video (title `smoke-<ts>`), signs a TUS payload, deletes the video | create + delete 2xx | 0 |
| `smoke:sslcommerz` | Creates a sandbox session for BDT 10, asserts `GatewayPageURL`, prints it (open it manually and pay with a sandbox method) | URL returned | 0 (sandbox) |
| `smoke:ai` | One Haiku-class call, `max_tokens` 16, parse with zod; same via Gemini | JSON valid; cost < USD 0.01 printed | < 0.01 |
| `smoke:stt` | Transcribes a 2-second bundled WAV via Deepgram and `whisper-1`; asserts word timestamps | words[] with `start/end` | < 0.01 |
| `smoke:inngest` | Sends event `smoke/ping`; polls Dev Server (or cloud) for run completion | function ran | 0 |
| `smoke:sentry` | Captures a test message tagged `smoke`; prints event id (check dashboard) | id printed | 0 |
| `smoke:posthog` | Server-side `capture` with distinct id `smoke` | HTTP 200 | 0 |
| `smoke:turnstile` | Verifies the always-pass test token against the siteverify endpoint (local) | `success: true` | 0 |

### 11.2 Reference implementation of two scripts (for the implementing agent)

```ts
// tooling/scripts/smoke/db.ts   (pattern shared by all smoke scripts)
import { serverEnv } from '@lumen/config/env';
import { db, sql } from '@lumen/db';

const t0 = performance.now();
const { rows } = await db.execute(sql`select now() as now, current_database() as db`);
const ms = Math.round(performance.now() - t0);
console.log(`PASS db driver=${serverEnv.DB_DRIVER} db=${rows[0]?.db} latency=${ms}ms`);
process.exit(0);
```
```ts
// tooling/scripts/smoke/redis.ts
import { Redis } from '@upstash/redis';
import { serverEnv } from '@lumen/config/env';

const r = new Redis({ url: serverEnv.RATE_LIMIT_REDIS_URL!, token: serverEnv.RATE_LIMIT_REDIS_TOKEN! });
const key = `smoke:${Date.now()}`;
await r.set(key, '1', { ex: 10 });
const v = await r.get(key);
await r.del(key);
console.log(v === 1 || v === '1' ? 'PASS redis' : `FAIL redis got=${String(v)}`);
```
(Import names such as `@lumen/config` follow the workspace naming chosen in P0-01; adjust.)

### 11.3 Manual checks that scripts cannot do
- Sign in with Google on `localhost` once (consent screen shows your test-user account).
- Receive a real email from staging at a Gmail address; check headers show `spf=pass dkim=pass dmarc=pass`.
- Pay a sandbox transaction end to end through the tunnel (10.6) and watch the IPN arrive.
- Upload and play a 10-second video in the studio; confirm the watermark.

---

## 12. Preview deployments (Neon branch per PR)

Flow (already specified in 11 §3.2 and §4; this is the setup list):

1. One-time: GitHub variables/secrets from 4.5; Vercel project linked; Neon `staging` branch exists (8.4).
2. Open a PR. `e2e-preview.yml` runs: creates Neon branch `preview/pr-<N>` from `staging` (copy-on-write, seconds), applies migrations, seeds the `preview` profile, deploys a **Vercel preview** with that branch's `DATABASE_URL*` injected, runs Playwright/axe/Lighthouse against it.
3. Preview env scope holds **sandbox** keys only and `APP_ENV=preview`. Real emails are allowed only to allow-listed addresses; SMS is `console`; payments sandbox.
4. Close/merge PR: the `cleanup` job deletes `preview/pr-<N>`.

Checks after the first PR:
```bash
$ neon branches list --project-id <ID>        # expect preview/pr-1 while the PR is open
$ gh pr checks                                 # shows verify, e2e-preview, security, codeql, commitlint
```
Limits and gotchas:
- Neon free tier has a branch count limit (verify); the `cleanup` job matters.
- Preview URLs are protected by Vercel Authentication; the bypass secret is passed to Playwright.
- Google sign-in on random previews does not work (8.6); use email OTP or the `preview.<domain>` alias.
- The preview must never point at `main` (production) DB: CI uses `staging` as the parent and Vercel's Preview scope has no prod URLs.

---

## 13. Staging and production promotion

### 13.1 Environments (04 §9)

| Env | Vercel | Domain | DB branch | Providers |
|---|---|---|---|---|
| local | `pnpm dev` | `localhost:3000` | `dev-<you>-<machine>` (Neon) or local PG | fake / sandbox |
| preview | per-PR deployment | `*.vercel.app` (+ `preview.<domain>` alias) | `preview/pr-<N>` | sandbox |
| staging | project `lumen-staging`, tracks `main` | `staging.<domain>` | `staging` | sandbox; Resend only to allow-listed domains |
| production | project `lumen-web`, **promoted** from `main` after staging smoke | `<domain>` | `main` (PITR on) | live |

### 13.2 Promotion routine (after the first feature merges)
1. Merge PR to `main` → `lumen-staging` deploys automatically; migrations applied to Neon `staging` by the `main` workflow (11 §4.1 step 5).
2. Run staging smoke: `pnpm smoke:all` with `APP_ENV=staging` env pulled for staging (`vercel env pull .env.staging.local --environment=preview --git-branch=main` is not equivalent; instead run smoke from CI against staging; NEW-ENV-06), plus `curl -f https://staging.<domain>/api/health/ready`.
3. Run `db-migrate-prod.yml` manually (GitHub → Actions → Run workflow, you approve the `production` Environment). It creates the `pre-migrate/<sha>` Neon backup branch, lints, migrates, smoke-tests.
4. Promote the exact deployment: Vercel dashboard → `lumen-web` → Deployments → pick the build of the same commit → **Promote to Production** (or `vercel promote <url>`; verify). Agents are denied `vercel --prod`; you press the button.
5. Verify: `curl -f https://<domain>/api/health/ready`, check Sentry release, Inngest production sync, PostHog event.
6. Rollback: Vercel → Deployments → previous production deployment → **Instant Rollback** (11 §7 R1). DB: forward-only; see 11 §4.1 step 7.

### 13.3 First deploy, step by step (staging first)
1. Vercel `lumen-staging` env (Preview+Production scope of that project): all non-secret and secret vars from section 9 with sandbox values; `APP_ENV=staging`, `APP_URL=https://staging.<domain>`, `BETTER_AUTH_URL` same, `DATABASE_URL*` = Neon `staging` branch.
2. Cloudflare DNS: `staging` CNAME → `cname.vercel-dns.com` (value shown by Vercel; verify), **DNS only** at first. In Vercel add domain `staging.<domain>` to `lumen-staging`.
3. Push to `main`. Watch Vercel build logs (build uses `pnpm turbo build`).
4. Run `pnpm db:migrate` against staging from CI or from your Mac with `DATABASE_URL_UNPOOLED` of staging in the **shell only**: `DATABASE_URL_UNPOOLED='...' pnpm db:migrate` (run by you, not an agent).
5. Visit `https://staging.<domain>`, `/bn`, `/sign-in`, `/api/health/ready`.
6. Inngest dashboard → Sync `https://staging.<domain>/api/inngest`.
7. Put Cloudflare Access in front of `staging.<domain>` (11 §11.1: restricted), allowing your email, except `/api/webhooks/*` and `/api/inngest` bypass.
8. Production later, at launch checklist (11 §11): apex → Vercel **proxied** with SSL Full (strict); WAF rules; webhook paths excluded from challenges.

---

## 14. Domain and email DNS checklist

Tick when done; all records in Cloudflare DNS (TTL 300, 60 for failover records; 11 §11.1).

| # | Record | Type / Name | Value | Proxy | Notes |
|---|---|---|---|---|---|
| 1 | Apex to Vercel | `A @` / `CNAME @` (CNAME flattening) | per Vercel domain screen (verify; commonly `76.76.21.21` or `cname.vercel-dns.com`) | DNS only until launch week, then proxied (Full strict) | Do **not** add before the first production deploy |
| 2 | `www` | `CNAME www` | `cname.vercel-dns.com` (verify) | same | 301 `www` → apex (or reverse), single choice |
| 3 | `staging` | `CNAME staging` | `cname.vercel-dns.com` | proxied OK with Access | Cloudflare Access email allow-list |
| 4 | `preview` (optional alias) | `CNAME preview` | `cname.vercel-dns.com` | DNS only | For Google OAuth testing on previews |
| 5 | `assets` | R2 custom domain | created by R2 "Connect domain" | proxied (R2 requires) | `R2_PUBLIC_BASE_URL` |
| 6 | Resend records on `mail.` | SPF TXT, DKIM, return-path MX, as Resend shows | **copy from Resend** | **DNS only** | Verify in Resend: all green |
| 7 | `news.` (marketing sender, P1) | same as 6 | copy from Resend | DNS only | Separate reputation (11 §11) |
| 8 | DMARC | `TXT _dmarc` | `v=DMARC1; p=quarantine; rua=mailto:dmarc@<domain>; adkim=s; aspf=s` | n/a | 11 asks quarantine, then `reject` after 30 clean days; start `p=none` for the first week if you see legitimate failures |
| 9 | Root SPF if you also send from the apex (support mailbox) | `TXT @` | one `v=spf1 ... ~all` only; **never two SPF records** | n/a | Merge includes into one record |
| 10 | Corporate mailbox (Google Workspace / Zoho) | MX + SPF + DKIM | from provider | DNS only | Support/reply-to mailbox |
| 11 | `status` | `CNAME status` | status page provider (different provider/DNS dependency, 11 §5) | per provider | Later |
| 12 | CAA | `CAA @ 0 issue "letsencrypt.org"` (+ `pki.goog` etc. if Cloudflare/Vercel need) | — | n/a | Optional; verify issuers before adding or certificates fail |
| 13 | DNSSEC | enabled in Cloudflare, DS at registrar | | n/a | |
| 14 | security.txt | served at `/.well-known/security.txt` | | | 11 §11.1 |
| 15 | Search Console | domain property via DNS TXT | | n/a | Needed for Google OAuth consent verification |

Verification commands:
```bash
$ dig +short TXT mail.<domain>
$ dig +short TXT _dmarc.<domain>
$ dig +short CNAME staging.<domain>
$ curl -sI https://staging.<domain> | head -5
```
Email tests: send to a Gmail address, open "Show original": SPF, DKIM, DMARC all `PASS`. Also check mail-tester.com score (10 §15.1).

---

## 15. Troubleshooting: top 25 errors

| # | Symptom (what you see) | Cause | Fix |
|---|---|---|---|
| 1 | `xcode-select: error: command line tools are already installed` or git prompts for CLT forever | CLT half-installed | `sudo rm -rf /Library/Developer/CommandLineTools` (you, not an agent) then `xcode-select --install` |
| 2 | `zsh: command not found: brew` / `mise` / `pnpm` | PATH not set in `~/.zprofile`/`~/.zshrc` | Re-run the `eval` lines in 2.2 / 2.4, then `exec zsh`; new Terminal tab |
| 3 | Agent cannot find `.claude/` rules after copying kit | `cp -R build-kit/*` skipped dotfolders | `cp -R build-kit/. .` (6.1); `ls -a` to confirm |
| 4 | `corepack: command not found` or pnpm version mismatch (`ERR_PNPM_BAD_PM_VERSION`) | Corepack missing / wrong pnpm | `npm i -g corepack && corepack enable`; or `mise use -g pnpm@10`; run `pnpm -v` inside the repo so `packageManager` applies |
| 5 | `ERR_PNPM_UNSUPPORTED_ENGINE` / `The engine "node" is incompatible` | Wrong Node on this machine | `mise install` in repo root; `node -v` must equal `.nvmrc` major |
| 6 | `ERR_PNPM_NO_MATURE_MATCHING_VERSION` on install | `minimumReleaseAge` ≥ 3 days blocks a brand-new package version (11 §2) | Wait, pin the previous version, or add an explicit `minimumReleaseAgeExclude` in a task that allows it (never disable globally) |
| 7 | Ignored build scripts warning (`sharp`, `esbuild`, `@sentry/cli`) / sharp errors at runtime | pnpm blocks dependency `postinstall` unless allow-listed | `pnpm approve-builds` for the minimal list, or add to `onlyBuiltDependencies` via a CODEOWNERS-reviewed PR (11 §2) |
| 8 | `Error: Invalid environment variables` + list of names at `pnpm dev` | zod schema in `env.ts` rejects missing/empty values | Compare `.env.local` to `.env.example`; set the listed names; for unused integrations use `fake`/`console` providers; run `pnpm smoke:env` |
| 9 | `.env.local` changes not picked up | Next caches env at start; or the pulled file overrides it | Restart `pnpm dev`; remember order `.env.development.local` wins over `.env.local` (7.4) |
| 10 | Agent says "permission denied reading .env" when it needs a variable name | Correct behaviour for real files | Tell it to read `.env.example` and `packages/config/env.ts`; never paste values |
| 11 | `password authentication failed for user` (Neon) | Stale password after a role reset or wrong branch URL | Neon → branch → Connect → copy fresh string; ensure it is the `dev-...` branch |
| 12 | First request takes 2 to 5 s or `connection terminated`/timeout, then works | Neon compute scaled to zero and is waking | Retry once; for demos set min compute or hit `pnpm smoke:db` first; keep prod min 0.5 CU (04 §12) |
| 13 | `WebSocket connection failed` / `ECONNREFUSED 127.0.0.1:443` / `getaddrinfo ENOTFOUND` with `@neondatabase/serverless` | `DB_DRIVER=neon` pointed at a local Postgres URL (GA-005), or offline | Use a Neon URL, or set `DB_DRIVER=pg` for local Postgres (10.5); `env.ts` should reject the mismatch (NEW-ENV-07) |
| 14 | `drizzle-kit migrate` hangs or `prepared statement ... already exists` | Migrating through the **pooled** URL | Use `DATABASE_URL_UNPOOLED` (direct) for migrations |
| 15 | `relation "..." does not exist` after switching branch/machine | Dev branch not migrated, or other machine ran newer migrations | `pnpm db:migrate`; if the branch is a mess, delete it in Neon and recreate from `staging`, then migrate + seed. Never share one dev branch across machines (3.1) |
| 16 | `redirect_uri_mismatch` (Google 400) | Callback URL not registered exactly | Add `http://localhost:3000/api/auth/callback/google` (scheme, port, path exact, no trailing slash) to the **dev** client; wait ~5 min; check you are not using the prod client |
| 17 | Inngest dashboard sync fails with 401/403/404 | Vercel Deployment Protection blocks `/api/inngest`, wrong URL, or wrong signing key | Add protection bypass or the Inngest–Vercel integration (verify); URL must be `https://<host>/api/inngest`; confirm `INNGEST_SIGNING_KEY` belongs to that environment |
| 18 | Functions never run locally | Dev Server not running or app not discovered | Start 10.4; check `INNGEST_DEV=1`; Apps tab → re-sync; confirm `/api/inngest` returns JSON |
| 19 | SSLCommerz payment succeeds but order stays "verifying" | IPN never reached you: tunnel URL changed, `APP_URL` not updated, or panel IPN URL stale | Restart tunnel, update `APP_URL` + sandbox panel URL (10.6); check `webhook_event` table; reconciliation job will catch up (10) |
| 20 | IPN returns 401/403/challenge page on staging | Vercel Deployment Protection / Cloudflare Access / Turnstile on `/api/webhooks/*` | Exempt webhook paths from every challenge layer (10 §15.1, 11 §11.1) and re-test with `curl -i -X POST` |
| 21 | Email not arriving | `EMAIL_PROVIDER=console` (printed in terminal), Resend domain unverified, or recipient not allow-listed on staging | Check provider env; Resend → Domains all green; check spam; Resend logs |
| 22 | OTP SMS "sent" but nothing arrives | `SMS_PROVIDER=console` (prints to the dev terminal) or sender ID not approved | Read the `pnpm dev` terminal; in staging/prod verify gateway DLR and masking approval; use a fallback gateway |
| 23 | R2 upload fails in browser (CORS error / `SignatureDoesNotMatch`) | Bucket CORS missing origin; clock skew; wrong content-length/type | Add origin + `PUT` + headers to CORS (8.12); run `smoke:r2`; check system time is automatic |
| 24 | Sign-up blocked by Turnstile locally, or `localhost` not allowed | Real widget keys on `localhost` without hostname | Use the always-pass test keys (8.12) locally |
| 25 | Mac gets hot, fans-less throttling, `pnpm dev` crawls, `JavaScript heap out of memory` | Too many processes (Docker, 2 agents, Chrome tabs, Spotlight indexing) | Section 16; `export NODE_OPTIONS=--max-old-space-size=4096`; stop Docker/Inngest when idle |

Extra quick fixes: port 3000 busy → `lsof -i :3000` then `kill <pid>`; stale build → `rm -rf apps/web/.next` (run by you; agents are denied `rm -rf`); lockfile conflict after a merge → `git checkout --theirs pnpm-lock.yaml && pnpm install` (agents may not edit the lockfile by hand).

---

## 16. 8 GB RAM Survival Rules (Windows 11 / Fedora 44 Dual-Boot)

The Founder operates on a laptop with an Intel Core i5-1135G7 (4C/8T), 8 GB DDR4 RAM, and NVIDIA GeForce MX330 (2 GB VRAM) dual-booting Windows 11 and Fedora 44 KDE Plasma. Strict memory and execution caps are mandatory to avoid OOM crashes.

**8 GB RAM Survival Rules (STRICT NON-NEGOTIABLES)**
1. **Node Memory Cap:** Every Node/Next.js/Vitest process MUST run with `NODE_OPTIONS="--max-old-space-size=2048"` (2 GB max).
2. **Concurrency Cap:**
   - Turborepo: `turbo run ... --concurrency=2` (never default to all cores).
   - Vitest: `vitest run --pool=forks --maxWorkers=2 --no-file-parallelism`.
   - TypeScript: `tsc --noEmit --incremental`.
   - Next.js build/dev: disable experimental parallel webpack/turbopack workers that exceed 2 threads; never run `next build` while `next dev` is running.
3. **Zero Local Containers:** NEVER run Docker Desktop, Podman, local Postgres, or local Redis on this machine. Database is strictly cloud Neon Serverless Postgres, rate-limit is Upstash Redis (or DB fallback).
4. **No Local Playwright/Browser Swarms:** Full Playwright E2E and Lighthouse suites run in GitHub Actions CI (`pnpm verify:ci`). Local `pnpm verify` runs L0 (format, lint, typecheck) + L1 (unit/service tests with maxWorkers=2).

**Dual-Boot Switching Protocol (OS-Baton):**
- Shared NTFS/exFAT drives corrupt `node_modules` symlinks and `.next` binary caches between Windows and Fedora.
- When switching OS: run `git commit` -> `git push` (when authorized) -> boot other OS -> `git pull --rebase` -> `pnpm install --prefer-offline`.
- Cross-platform hooks: `.claude/hooks/*.sh` use POSIX `#!/usr/bin/env sh` (no macOS-specific `stat -f` or `sed -i ''` flags) so they execute identically in Fedora bash and Windows Git Bash / WSL2.

---

## 17. "Fresh machine in 30 minutes" checklist (second device)

Prereqs on hand: password manager access, phone with 2FA, GitHub login.

| Min | Step | Command / action | Done |
|---|---|---|---|
| 0-5 | Base OS tools | Mac: `xcode-select --install`, Homebrew (2.2). WSL2/Linux: `wsl --install -d Ubuntu-24.04` or `apt install build-essential git curl` | [ ] |
| 5-8 | git + gh | `brew install git gh` / `apt install git gh`; `gh auth login` | [ ] |
| 8-12 | mise + Node + pnpm | `brew install mise` / `curl https://mise.run \| sh`; activate in shell; `corepack enable` | [ ] |
| 12-14 | Clone | `mkdir -p ~/code && cd ~/code && gh repo clone <you>/lumen-academy && cd lumen-academy` | [ ] |
| 14-16 | Toolchain from repo | `mise install && node -v && pnpm -v` (must match `.nvmrc` / `packageManager`) | [ ] |
| 16-18 | CLIs | `npm i -g vercel` (+ `brew install neonctl` / `npm i -g neonctl`); Claude Code and Gemini CLI per 5 (verify) | [ ] |
| 18-21 | Own Neon dev branch | `neon branches create --project-id <ID> --name dev-<you>-pc --parent staging`; copy pooled + direct URLs | [ ] |
| 21-24 | Env files | `cp .env.example .env.local`; paste DB URLs + your generated secrets from the password manager entry "Dev env bundle"; `vercel login && vercel link && vercel env pull .env.development.local --environment=development` | [ ] |
| 24-27 | Install + DB | `pnpm install && pnpm db:migrate && pnpm db:seed` | [ ] |
| 27-29 | Run | `pnpm dev`; open `localhost:3000` and `/bn` | [ ] |
| 29-30 | Prove it | `pnpm verify` (or `pnpm turbo run typecheck lint --filter=web` if time-boxed), `pnpm smoke:all`; `/resume` in the agent to pick up `docs/HANDOFF.md` | [ ] |

Machine-specific leftovers: `git config --global user.name/email`, SSH/signing key added to GitHub, Playwright browsers (`pnpm exec playwright install chromium`), VS Code extensions (i18n Ally).
Retire a machine: sign out of `gh`, `vercel`, `claude`, `gemini`; delete the machine's Neon dev branch; revoke its SSH key at GitHub; rotate any key that was ever on it if it is lost (7.3).

---

## 18. Backlog tasks and doc drift found while writing

### 18.1 New tasks (add to `docs/12-BUILD-PLAN-AGENTS.md` §11 and `PROGRESS.md`)

> **Final IDs: see 12 Appendix A.** The `NEW-*` IDs in this list are source IDs only; PROGRESS.md and the build loop use the final P0/P1/P2/P3 IDs (or `BG-xx` human gates) given there. Do not rewrite this list.

| ID | Task | Owner | Depends | Acceptance |
|---|---|---|---|---|
| NEW-ENV-01 | Record decision: solo-safe branch protection (0 required approvals while only one human, required checks, no bypass); update 11 §1.2 | haiku (docs) + founder approval | P0-03 | 11 §1.2 amended; ruleset JSON committed under `.github/` |
| NEW-ENV-02 | Pin `.nvmrc`, `mise.toml`, `packageManager`, `.gitattributes` (`* text=auto eol=lf`), `.gitignore` env patterns | sonnet | P0-01 | `mise install` on a clean machine yields identical `node -v`/`pnpm -v`; CI reads `.nvmrc` |
| NEW-ENV-03 | Smoke scripts `tooling/scripts/smoke/*` + `pnpm smoke:*` + `smoke:all` (section 11) | sonnet | P0-07 | Each prints PASS/FAIL/SKIP, never secrets; refuses prod without flag |
| NEW-ENV-04 | `db:seed` prints dev login table (role, email, password hint) and refuses `APP_ENV=production` | sonnet | P0-11 (seed) | Output verified in test |
| NEW-ENV-05 | `RATE_LIMIT_BACKEND=postgres\|redis` switch; fail-closed only when backend reachable; production forces redis | sonnet (security-critical: opus review) | P0-07, rate-limit task | Local sign-in works with no Redis; prod boot fails if backend ≠ redis |
| NEW-ENV-06 | Staging smoke job in CI (`smoke-staging.yml`) running `smoke:all` with staging env after deploy | sonnet | NEW-ENV-03, 11 §3 | Job posts table to PR/commit; gates `db-migrate-prod.yml` |
| NEW-ENV-07 | `env.ts` cross-field validation: `DB_DRIVER` vs host; `SSLCZ_IS_LIVE` iff `VERCEL_ENV=production`; no `fake` providers in production; no Turnstile test keys in production | opus review | P0-07 | Unit tests per rule |
| NEW-ENV-08 | Confirm packages are consumed from source in dev (no per-package watch builds); document `pnpm --filter web dev` | sonnet | P0-02 | `pnpm dev` starts one process tree |
| NEW-ENV-09 | `docker-compose.yml` with `postgres:17`, `mailpit`, optional `minio` profile; README snippet; `DB_DRIVER=pg` CI job | sonnet | NEW-ENV-07 | `docker compose up -d` + `DB_DRIVER=pg pnpm db:migrate && pnpm test` green |
| NEW-ENV-10 | `env:example` generator + drift test (already implied by P0-07; add the annotated comments and phase tags from section 9) | sonnet | P0-07 | CI fails on drift; comments preserved |
| NEW-ENV-11 | Founder-blockers table in `PROGRESS.md` (8.2) and lead-time reminders | haiku | — | Table present |
| NEW-ENV-12 | `docs/ops/launch-evidence.md` skeleton (11 §11) and runbook stub for "rotate a leaked secret" | haiku | — | Files exist |

### 18.2 Drift between existing docs that P0-07 must settle (this doc follows 10 §15.3 unless noted)

| Item | 04 §8.3 | 10 §15.3 / elsewhere | Used here |
|---|---|---|---|
| SSLCommerz vars | `SSLCOMMERZ_STORE_ID`, `SSLCOMMERZ_STORE_PASSWD`, `SSLCOMMERZ_MODE` | `SSLCZ_STORE_ID`, `SSLCZ_STORE_PASSWORD`, `SSLCZ_IS_LIVE` | 10 |
| Bunny token | `BUNNY_TOKEN_AUTH_KEY`, `BUNNY_WEBHOOK_SECRET` | `BUNNY_TOKEN_KEY`, `BUNNY_WEBHOOK_URL_SECRET` | 10 |
| Field encryption | `FIELD_ENCRYPTION_KEY` | `ENCRYPTION_KEY_B64` + `ENCRYPTION_KEY_ID` | 10 |
| Rate-limit store vars | not listed | `RATE_LIMIT_REDIS_URL/TOKEN` | 10 |
| Speaking audio retention | — | 10 default `30`; **D12 C6 = 90 days** | 90 (D12 wins) |
| Local DB | 04 §9 "local = Docker postgres:17" | D12 GA-005: Neon dev branch default | D12 |
| Solo branch protection | — | 11 §1.2 "1 approving review (the founder)" | 0 approvals + checks (NEW-ENV-01) |
| 10 §15.3 Upstash note | says "pending a 00 change-log entry" | 00 change log already has it | decided |
Also: `04` §8.3 `SMS_API_KEY` vs gateway-specific keys in 10; 04 `APP_ENV` is not in 10's list (added here as required).

Founder decisions to confirm: Node major pin; registrar/domain; EU vs US region for Sentry and PostHog; whether staging uses Cloudflare Access or Vercel Authentication; password-manager vendor.
