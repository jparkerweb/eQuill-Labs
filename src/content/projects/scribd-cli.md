---
id: scribd-cli
name: scribd-cli
slug: scribd-cli
tagline: >-
  An interactive Windows terminal app (TUI) that takes a Scribd document ID — or
  a pasted document URL — headless-renders the embed page, fully loads every…
taglineFull: >-
  An interactive Windows terminal app (TUI) that takes a Scribd document ID — or
  a pasted document URL — headless-renders the embed page, fully loads every
  lazy-loaded page, and saves a visually faithful PDF of the document to
  ./downloads/<id>.pdf.
description:
  short: >-
    An interactive Windows terminal app that downloads public Scribd documents
    as visually faithful PDFs from a document ID or pasted URL.
  long: >-
    scribd-cli is an interactive Windows terminal app (TUI) that takes a Scribd
    document ID — or a pasted document URL — headless-renders the embed page,
    fully loads every lazy-loaded page, and saves a visually faithful PDF of the
    document to ./downloads/<id>.pdf. It uses Node.js and TypeScript with
    Playwright (Chromium’s native print-to-PDF) for rendering and an Ink
    terminal UI. It requires Node.js ≥ 20 and auto-downloads a managed Chromium
    on first run via Playwright’s postinstall, so you never install a browser
    yourself. Only public documents are supported; there is no login, batch
    download, or anti-bot evasion.
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
    percent: 97.53
  - name: JavaScript
    percent: 2.47
stars: 0
links:
  repo: 'https://github.com/jparkerweb/scribd-cli'
featured: false
sortOrder: 1000
status: active
lastCommit: '2026-06-06T21:21:21Z'
_source:
  repo: 'https://github.com/jparkerweb/scribd-cli'
  sha: HEAD
  fetchedAt: '2026-07-04T00:36:27.186Z'
---
scribd-cli is an interactive Windows terminal app (TUI) that takes a Scribd document ID — or a pasted document URL — headless-renders the embed page, fully loads every lazy-loaded page, and saves a visually faithful PDF of the document to ./downloads/<id>.pdf. It uses Node.js and TypeScript with Playwright (Chromium’s native print-to-PDF) for rendering and an Ink terminal UI. It requires Node.js ≥ 20 and auto-downloads a managed Chromium on first run via Playwright’s postinstall, so you never install a browser yourself. Only public documents are supported; there is no login, batch download, or anti-bot evasion.

## Install

Requires **Node.js ≥ 20**. Every option below auto-downloads a managed Chromium (~150 MB) on first
run via Playwright's `postinstall` — you never install a browser yourself. If that step is ever
skipped, run `npx playwright install chromium` once.

### Run it once — no install, no clone

```powershell
npx github:jparkerweb/scribd-cli
```

Fetches the repo and launches the app; nothing is added to your `PATH`.

### Install a global `scribd-cli` command — no clone (recommended)

```powershell
npx github:jparkerweb/scribd-cli install-global
scribd-cli
```

The `install-global` subcommand installs a global copy from the package npx just fetched
(`npm install -g <dir>` under the hood) — reliable, with no compiler needed since `dist/` ships
prebuilt. npm puts the launcher in its global bin dir (`npm config get prefix`; on Windows that's
`…\AppData\Roaming\npm`, already on `PATH`). Remove it later with `npm rm -g scribd-cli`.

> **Avoid** `npm install -g github:jparkerweb/scribd-cli` — on some Windows/npm setups it reports
> success but silently drops files during extraction (an npm tar bug), leaving a broken command.
> Use the `install-global` form above. _(Once published to npm, all of this shortens to
> `npx scribd-cli` / `npm install -g scribd-cli`.)_

### From a clone — development / from source

```powershell
git clone git@github.com:jparkerweb/scribd-cli.git   # or https://github.com/jparkerweb/scribd-cli.git
cd scribd-cli
npm install
```

From a clone you can run it with `npm run dev`, install a global copy with `npm install -g .`, or
create a live-updating global command with `npm link` (rebuild via `npm run build` to refresh it).
