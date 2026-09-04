---
id: plan2code
name: plan2code
slug: plan2code
tagline: >-
  A spec-driven workflow for AI coding agents. Send the plan — the build
  follows.
description:
  short: >-
    A spec-driven workflow for AI coding agents: you approve a plan, and the
    agent builds to it one phase at a time.
  long: >-
    Plan2Code is a spec-driven workflow for AI coding agents. You approve a
    plan, the plan becomes a set of phase documents in your repo, and the agent
    builds to those documents one phase at a time. Because progress lives in
    files instead of chat history, the next session, the next agent and the next
    engineer all start from the same specs. The workflow is six commands, each
    posted separately, two of them optional. It requires Node.js 18 or later and
    installs through the skills CLI, which builds the workflow as Agent Skills
    and delegates installation to `skills add`; the installed skills work
    independently from then on. Supported tools include every agent supported by
    the skills CLI, among them Claude Code, Cursor, GitHub Copilot, Windsurf,
    Codex, Continue, Codeium and Zed.
banner:
  src: 'https://raw.githubusercontent.com/jparkerweb/plan2code/main/docs/banner.png'
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
primaryLanguage: TypeScript
languages:
  - name: JavaScript
    percent: 25.72
  - name: TypeScript
    percent: 74.28
stars: 0
links:
  repo: 'https://github.com/jparkerweb/plan2code'
  homepage: 'https://plan2code.jparkerweb.com/'
featured: false
sortOrder: 1000
status: active
lastCommit: '2026-09-03T14:18:47Z'
_source:
  repo: 'https://github.com/jparkerweb/plan2code'
  sha: HEAD
  fetchedAt: '2026-09-04T20:01:18.794Z'
---
Plan2Code is a spec-driven workflow for AI coding agents. You approve a plan, the plan becomes a set of phase documents in your repo, and the agent builds to those documents one phase at a time. Because progress lives in files instead of chat history, the next session, the next agent and the next engineer all start from the same specs. The workflow is six commands, each posted separately, two of them optional. It requires Node.js 18 or later and installs through the skills CLI, which builds the workflow as Agent Skills and delegates installation to `skills add`; the installed skills work independently from then on. Supported tools include every agent supported by the skills CLI, among them Claude Code, Cursor, GitHub Copilot, Windsurf, Codex, Continue, Codeium and Zed.

## Install

Requires [Node.js](https://nodejs.org/) 18 or later and network access — installation runs through
the [skills CLI](https://skills.sh). Re-run any time to update.

```bash
npx --allow-git=all git+https://github.com/jparkerweb/plan2code.git
```

This fetches the installer to a temp directory, builds the workflow as Agent Skills, delegates
installation to `skills add`, and cleans up after itself. The installed skills work independently
from then on.

Either route lands you on the same menu:

```
╔═════════════════════════════════════════════════════════╗
║ INSTALL PLAN2CODE                                       ║
╠═════════════════════════════════════════════════════════╣
║  I.  INSTALL    Install Plan2Code skills everywhere     ║
║  A.  ALL        Install Plan2Code + dev tools           ║
║  U.  UNINSTALL  Remove Plan2Code skills and dev tools   ║
║  C.  CUSTOM     Advanced options                        ║
║  Q.  QUIT       Exit                                    ║
╚═════════════════════════════════════════════════════════╝
```

**Supported tools:** every agent supported by the skills CLI, including Claude Code · Cursor ·
GitHub Copilot · Windsurf · Codex · Continue · Codeium · Zed · Amp · OpenCode · Devin · Crush · Pi ·
Gemini CLI · Cline · Roo · Kilo · Goose · Trae · Qwen Code.

The installer keeps one canonical copy of each skill under `~/.agents/skills/` and links it into
agents that maintain their own directory. Update later with `npx skills update -g`.

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
