---
id: plan2code
name: plan2code
slug: plan2code
tagline: >-
  A spec-driven workflow for AI coding agents. Send the plan — the build
  follows.
description:
  short: >-
    A spec-driven workflow for AI coding agents. Send the plan, the build
    follows.
  long: >-
    Plan2Code is a spec-driven workflow that keeps planning and building
    separate for AI coding agents. You approve a plan, the plan becomes a set of
    phase documents in your repo, and the agent builds to those documents one
    phase at a time, so progress lives in files instead of chat history and the
    next session, the next agent, and the next engineer all start from the same
    specs. The workflow is six commands, each posted separately, two of which
    are optional. Installation requires Node.js 18 or later and network access
    and runs through the skills CLI: the installer builds the workflow as Agent
    Skills, delegates installation to skills add, cleans up after itself, and
    presents a menu covering install, install with dev tools, uninstall, and
    custom options. It supports every agent supported by the skills CLI,
    including Claude Code, Cursor, GitHub Copilot, Windsurf, Codex, Zed, Gemini
    CLI, Cline and Roo. Version 2.2.0 is MIT licensed.
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
lastCommit: '2026-08-27T05:24:02Z'
_source:
  repo: 'https://github.com/jparkerweb/plan2code'
  sha: HEAD
  fetchedAt: '2026-08-27T05:37:42.638Z'
---
Plan2Code is a spec-driven workflow that keeps planning and building separate for AI coding agents. You approve a plan, the plan becomes a set of phase documents in your repo, and the agent builds to those documents one phase at a time, so progress lives in files instead of chat history and the next session, the next agent, and the next engineer all start from the same specs. The workflow is six commands, each posted separately, two of which are optional. Installation requires Node.js 18 or later and network access and runs through the skills CLI: the installer builds the workflow as Agent Skills, delegates installation to skills add, cleans up after itself, and presents a menu covering install, install with dev tools, uninstall, and custom options. It supports every agent supported by the skills CLI, including Claude Code, Cursor, GitHub Copilot, Windsurf, Codex, Zed, Gemini CLI, Cline and Roo. Version 2.2.0 is MIT licensed.

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
