---
id: scribd-cli
name: scribd-cli
slug: scribd-cli
tagline: >-
  An interactive Windows terminal app (TUI) that takes a Scribd document ID — or
  a pasted document URL — headless-renders the embed page, fully loads every
  laz...
description:
  short: >-
    An interactive Windows terminal app that downloads public Scribd documents
    as PDFs from a document ID or pasted URL.
  long: >-
    scribd-cli is an interactive Windows terminal app (TUI) that takes a Scribd
    document ID — or a pasted document URL — headless-renders the embed page,
    fully loads every lazy-loaded page, and saves a visually faithful PDF of the
    document to ./downloads/<id>.pdf. It is built with Node.js and TypeScript,
    using Playwright (Chromium's native print-to-PDF) for rendering and an Ink
    terminal UI for interaction. The flow walks through a help screen, a prompt
    for the ID or URL, save options for file name and directory, live progress,
    and a final result. Only public documents are supported; there is no login,
    batch download, or anti-bot evasion.
banner:
  src: 'https://github.com/jparkerweb/scribd-cli/blob/main/scribd-cli.jpg?raw=true'
  alt: scribd-cli banner
  source: repo
topics: []
category: demo
theme: utilities
primaryLanguage: TypeScript
languages:
  - name: TypeScript
    percent: 98.43
  - name: JavaScript
    percent: 1.57
stars: 0
links:
  repo: 'https://github.com/jparkerweb/scribd-cli'
featured: false
sortOrder: 1000
status: active
lastCommit: '2026-06-06T19:20:55Z'
_source:
  repo: 'https://github.com/jparkerweb/scribd-cli'
  sha: HEAD
  fetchedAt: '2026-06-06T19:22:18.421Z'
---
scribd-cli is an interactive Windows terminal app (TUI) that takes a Scribd document ID — or a pasted document URL — headless-renders the embed page, fully loads every lazy-loaded page, and saves a visually faithful PDF of the document to ./downloads/<id>.pdf. It is built with Node.js and TypeScript, using Playwright (Chromium's native print-to-PDF) for rendering and an Ink terminal UI for interaction. The flow walks through a help screen, a prompt for the ID or URL, save options for file name and directory, live progress, and a final result. Only public documents are supported; there is no login, batch download, or anti-bot evasion.

## Install

```powershell
npm install
```

On first install, a `postinstall` script runs `playwright install chromium`, which downloads a
managed Chromium build (~150 MB). You do **not** need to install a browser yourself. If that step
is ever skipped or fails, run it manually:

```powershell
npx playwright install chromium
```
