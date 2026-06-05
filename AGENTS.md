# AGENTS.md

This file provides guidance to AI coding agents like Claude Code (claude.ai/code), Cursor AI, Codex, Gemini CLI, GitHub Copilot, Devin, and other AI coding assistants when working with code in this repository.

## Project Overview

**eQuill Labs v2** is the portfolio site for [eQuill Labs](https://www.equilllabs.com) — a catalog of Justin Parker's open-source projects (LLM infrastructure, semantic NLP, MCP tooling, Obsidian ecosystem). It's an **Astro 6 + Tailwind CSS 4** static site fed by a **GitHub-driven content pipeline**: repositories are fetched via the GitHub GraphQL API, curated, summarized by AI into committed Markdown, rendered to `./docs/`, and branch-deployed by GitHub Pages.

## How to Use This File

The sections below are brief summaries. Each links to a detail file in [`.agents-docs/`](./.agents-docs/) with the full content. **Follow the links only for sections relevant to your current task** — don't read everything up front. Start here to orient, then drill into the one or two detail files you need.

## Prerequisites

- **Node 20 LTS or newer** (`node --version` → `v20.x`+). Enforced via `package.json` `engines.node: ">=20.0.0"`.
- **`gh` CLI** authenticated with `repo` scope — only for the content pipeline; the Astro site builds without it. Verify with `gh auth status`.
- **OS** — Windows, macOS, and Linux all work. Shell examples assume POSIX-style paths; Windows users can use Git Bash, WSL, or PowerShell equivalents.

## Design Direction (locked)

The visual identity was locked in Phase 4 as **"The Quill & Slash."** Canonical reference: [`specs/equill-labs-v2/DESIGN-DECISION.md`](./specs/equill-labs-v2/DESIGN-DECISION.md). Token values live in `src/styles/tokens.css` and theme values in `src/styles/themes/{dark,light}.css` — treat those as source of truth and don't introduce one-off color or spacing literals in component CSS.

## Development Commands

Three primary commands cover most work: `npm run dev`, `npm run build`, and the `/equill-labs-update` Skill. Full table plus the no-secrets `gh`-based auth model are in the detail file.

Details: [Development Commands](./.agents-docs/AGENTS-development-commands.md)

## Architecture & Content Pipeline

Astro static site + a `tsx` pipeline (`fetch → curate → write-blurbs → render`). The `equill-labs-update` Skill may write **only** to `data/*` and `src/content/projects/*.md`; everything else is hand-authored and the Skill proposes `.diff`s under `data/proposals/` instead of editing. Includes directory layout and the curation/exclusion model.

Details: [Architecture & Content Pipeline](./.agents-docs/AGENTS-architecture.md)

## Analytics

Self-hosted, cookieless **Umami** instrumented once in `BaseLayout.astro` — every page inherits tracking, dev/preview hosts are ignored. Covers the do-NOT list (don't change `data-website-id`, don't add a second tracker) and troubleshooting.

Details: [Analytics](./.agents-docs/AGENTS-analytics.md)

## Deployment

GitHub Pages branch-deploy from `main /docs` — no Actions workflow. The built `docs/` is a **committed** deploy artifact; rebuild and commit it after content/layout changes, then `git push`.

Details: [Deployment](./.agents-docs/AGENTS-deployment.md)

## Gotchas & Failure Modes

Non-obvious traps: Pagefind indexes after the build, Windows chrome-launcher EPERM, intentional `html-validate` suppressions, axe/Playwright timing, AA-tuned heading order and muted-text contrast, and the GitHub GraphQL `first: 25` page-size cap that prevents nginx 502s on `refresh:fetch`. Read before touching build, tests, the fetch pipeline, or a11y-sensitive markup.

Details: [Gotchas & Failure Modes](./.agents-docs/AGENTS-gotchas.md)

## Specs

Full planning and implementation docs live under [`specs/equill-labs-v2/`](./specs/equill-labs-v2/). Start with [`overview.md`](./specs/equill-labs-v2/overview.md) for the phase index and success criteria.
