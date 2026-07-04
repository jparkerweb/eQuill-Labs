---
id: ai-assist-skills
name: ai-assist-skills
slug: ai-assist-skills
tagline: >-
  A collection of AI agent skills that automate recurring engineering workflows
  that can be installed across multiple AI coding assistants.
description:
  short: >-
    A collection of AI agent skills that automate recurring engineering
    workflows across multiple AI coding assistants.
  long: >-
    AI-Assist Skills is a collection of AI agent skills that automate recurring
    engineering workflows and can be installed across multiple AI coding
    assistants. Skills are installed globally via skills.sh and auto-detected by
    40+ AI agents, including Claude Code, Cursor, Windsurf, and GitHub Copilot.
    A single sync command removes any stale or renamed skills, then installs the
    latest version of every skill from the repo. For local development, the
    skills add command accepts a local path as the source, so a skill can be
    installed directly from the working tree and tested before committing or
    pushing.
banner:
  src: >-
    https://github.com/jparkerweb/ai-assist-skills/blob/main/ai-assist-skills.jpg?raw=true
  alt: ai-assist-skills banner
  source: repo
topics:
  - ai
  - ai-prompts
  - equill-plugin
  - ai-workflow
  - ai-skills
category: plugin
theme: utilities
primaryLanguage: JavaScript
languages:
  - name: JavaScript
    percent: 100
stars: 83
links:
  repo: 'https://github.com/jparkerweb/ai-assist-skills'
featured: true
sortOrder: 3
status: active
lastCommit: '2026-06-29T04:22:50Z'
_source:
  repo: 'https://github.com/jparkerweb/ai-assist-skills'
  sha: HEAD
  fetchedAt: '2026-07-04T00:36:27.186Z'
---
AI-Assist Skills is a collection of AI agent skills that automate recurring engineering workflows and can be installed across multiple AI coding assistants. Skills are installed globally via skills.sh and auto-detected by 40+ AI agents, including Claude Code, Cursor, Windsurf, and GitHub Copilot. A single sync command removes any stale or renamed skills, then installs the latest version of every skill from the repo. For local development, the skills add command accepts a local path as the source, so a skill can be installed directly from the working tree and tested before committing or pushing.

## Installation

### Sync all skills (recommended)

This single command removes any stale or renamed skills, then installs the latest version of every skill from this repo. Run it any time to stay current:

```bash
npx github:jparkerweb/ai-assist-skills
```

Skills are installed globally via [skills.sh](https://skills.sh) and auto-detected by 40+ AI agents (Claude Code, Cursor, Windsurf, GitHub Copilot, etc.).

<img src="https://github.com/jparkerweb/ai-assist-skills/blob/main/ai-assist-install.jpg?raw=true" style="max-width: 593px;">
