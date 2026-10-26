---
id: plan2code
name: plan2code
slug: plan2code
tagline: A spec-driven workflow for AI coding agents.
description:
  short: >-
    A spec-driven workflow for AI coding agents, worked through on a browser
    dashboard where every step is a card.
  long: >-
    Plan2Code is a spec-driven workflow for AI coding agents that you work
    through on a page in your browser. The dashboard lists every step as a card,
    and each step's questions, progress and sign-offs arrive on that same page
    while the agent does the work. Decisions still land in your repo as plain
    files: an approved plan becomes phase documents, and the agent builds to
    them one phase at a time, so the next session, the next agent and the next
    engineer all start from the same specs. The steps run from an optional
    Pathfinder through Plan, Document, Implement and Finalize, with cards such
    as Quick task, Review, Handoff, Codebase X-ray, Diagnose a bug, Changelog
    and Git always available. The page also carries an Ask tab for quick
    questions, a private Notebook the agent never sees, and a session meter that
    suggests a fresh session as one grows long. The `plan2code` command opens
    the dashboard in Claude Code, Devin or Codex, and the workflow installs as
    Agent Skills through the skills CLI for every agent it supports, including
    Cursor, GitHub Copilot, Windsurf and Gemini CLI. Version 2.11.0 is MIT
    licensed.
banner:
  src: 'https://raw.githubusercontent.com/jparkerweb/plan2code/main/docs/banner.jpg'
  alt: plan2code banner
  source: repo
  style: 'object-fit:contain'
topics:
  - ai-developer-tools
  - ai-engineering
  - ai-sdlc
  - ai-sdlc-framework
  - spec-driven-development
category: app
theme: utilities
primaryLanguage: JavaScript
languages:
  - name: JavaScript
    percent: 80.96
  - name: TypeScript
    percent: 9.1
  - name: CSS
    percent: 5.3
  - name: HTML
    percent: 4.64
stars: 1
links:
  repo: 'https://github.com/jparkerweb/plan2code'
  homepage: 'https://plan2code.jparkerweb.com/'
featured: false
sortOrder: 999
status: active
lastCommit: '2026-10-26T12:52:22Z'
_source:
  repo: 'https://github.com/jparkerweb/plan2code'
  sha: HEAD
  fetchedAt: '2026-10-26T13:01:16.359Z'
---
Plan2Code is a spec-driven workflow for AI coding agents that you work through on a page in your browser. The dashboard lists every step as a card, and each step's questions, progress and sign-offs arrive on that same page while the agent does the work. Decisions still land in your repo as plain files: an approved plan becomes phase documents, and the agent builds to them one phase at a time, so the next session, the next agent and the next engineer all start from the same specs. The steps run from an optional Pathfinder through Plan, Document, Implement and Finalize, with cards such as Quick task, Review, Handoff, Codebase X-ray, Diagnose a bug, Changelog and Git always available. The page also carries an Ask tab for quick questions, a private Notebook the agent never sees, and a session meter that suggests a fresh session as one grows long. The `plan2code` command opens the dashboard in Claude Code, Devin or Codex, and the workflow installs as Agent Skills through the skills CLI for every agent it supports, including Cursor, GitHub Copilot, Windsurf and Gemini CLI. Version 2.11.0 is MIT licensed.

## Install and start

### Before you start

- **Node.js 18 or newer.** Check with `node --version`. No Node? Get it from [nodejs.org](https://nodejs.org/) (the LTS download), or run `winget install OpenJS.NodeJS.LTS` on Windows, `brew install node` on macOS, or use `nvm` on Linux. Then open a new terminal.
- **Start from your project.** Open your terminal in the project you want to work on (`cd` into it) before you run anything. Plan2Code works on the folder you start it in.
- **Ways in.** `plan2code` (Claude Code, Devin or Codex), or type `/plan2code` in your agent (`$plan2code` in Codex).
- **No agent yet?** Install Claude Code, Codex or Devin first.

Installation needs network access and runs through the [skills CLI](https://skills.sh). To update, run `plan2code update` (or re-run the install command).

```bash
npx --allow-git=all git+https://github.com/jparkerweb/plan2code.git
```

This fetches the installer to a temp directory, builds the workflow as Agent Skills, delegates
installation to `skills add`, and cleans up after itself. The installed skills work independently
from then on.

**Back at your prompt with no output at all?** The installer always opens the menu below, so nothing
means npm could not reach the repository and hid the reason. Run
`git ls-remote https://github.com/jparkerweb/plan2code.git` to see it: usually the network, a proxy
or the VPN.

The installer opens this menu (cloning and running `node install.js`, below, opens the same one):

```
╔═════════════════════════════════════════════════════════╗
║ INSTALL PLAN2CODE                                       ║
╠═════════════════════════════════════════════════════════╣
║  I.  INSTALL    Install skills + the plan2code command  ║
║  U.  UNINSTALL  Remove everything Plan2Code installed   ║
║  A.  ADVANCED   Project install, dev tools, and more    ║
║  Q.  QUIT       Exit                                    ║
╚═════════════════════════════════════════════════════════╝
```

### Start

1. `cd` into your project, then run `plan2code`. It starts Claude Code, Devin or Codex on the dashboard,
   and the dashboard opens in your browser.
2. In a project without an `AGENTS.md`, pick **Set up this project** first: Plan and Quick task
   need it.
3. Pick a card.

Already inside your agent? Type `/plan2code` instead (`$plan2code` in Codex).

<details>
<summary>About the plan2code command</summary>

Install (`I`) adds `plan2code` as a global command (Advanced `A` → `D` adds just the command). Run it from any project and the Plan2Code
dashboard opens right there, in **Claude Code**, **Devin** or **Codex**. With more than one installed it asks which and
remembers your pick; `plan2code --cli claude`, `--cli devin` or `--cli codex` skips the question, and `--model <name>`
chooses the model. It works in cmd, PowerShell, Git Bash, macOS and Linux shells, and needs the
Claude Code, Devin or Codex CLI on your `PATH`. It starts the agent with permission prompts off
(`--permission-mode bypassPermissions` in Claude Code, `--permission-mode bypass` in Devin, `--dangerously-bypass-approvals-and-sandbox` in Codex); run
`claude /plan2code` yourself if you want prompts. The installer then offers a desktop shortcut (answer `y`),
which opens a folder picker first. Uninstalling (`U`) removes both.
</details>

**Supported tools:** every agent supported by the skills CLI, including Claude Code · Cursor ·
GitHub Copilot · Windsurf · Codex · Continue · Codeium · Zed · Amp · OpenCode · Devin · Crush · Pi ·
Gemini CLI · Cline · Roo · Kilo · Goose · Trae · Qwen Code.

The installer keeps one canonical copy of each skill under `~/.agents/skills/` and links it into
agents that maintain their own directory. To update, run `plan2code update` (or re-run the install command).

Use the installer rather than calling `skills add` against the repository root: recursive discovery
would also find maintainer-only skills under `.claude/skills/`. The installer targets `skills/`
explicitly.

<details>
<summary>Prefer to clone?</summary>

```bash
git clone https://github.com/jparkerweb/plan2code.git
cd plan2code
node install.js

# Only if you plan to modify or contribute to Plan2Code itself
npm install && npx husky
```
</details>

---
