# Development Commands

> Part of [AGENTS.md](../AGENTS.md) — project guidance for AI coding agents.

Three primary commands cover most work — `npm run dev`, `npm run build`, and the `/equill-labs-update` Skill.

## Commands

| Command                   | Purpose                                                                                                  |
| ------------------------- | -------------------------------------------------------------------------------------------------------- |
| `npm run dev`             | Start Astro dev server on `http://localhost:4321/` (in-memory, does not write `docs/`).                  |
| `npm run build`           | Build the static site to `./docs/` **and** generate the Pagefind index under `./docs/pagefind/`.        |
| `npm run preview`         | Serve the built `./docs/` output locally (Astro preview; used by test tooling).                          |
| `npm run check`           | Run `astro check` (TypeScript + Astro type checking).                                                    |
| `npm run format`          | Run Prettier over the repository.                                                                        |
| `npm run refresh:fetch`   | Run `scripts/fetch-github.ts` only (writes `data/github-snapshot.json`).                                 |
| `npm run refresh:render`  | Run `scripts/render-content.ts` only (regenerates `src/content/projects/*.md`).                          |
| `npm run refresh:all`     | `refresh:fetch` + `refresh:render` without the Skill (pipeline debugging — no review/commit gates).      |
| `/equill-labs-update`     | Claude Code Skill — full content refresh with mandatory review + commit gates.                           |
| `npm run validate:html`   | Run `html-validate` over `./docs/**/*.html`. Exits non-zero on real validity defects.                    |
| `npm run test:a11y`       | Run Playwright + axe-core a11y suite against `home / projects / one detail / about` (0 violations gate). |
| `npm run test:lighthouse` | Run Lighthouse CI (`lhci autorun`, 3 runs × 4 URLs). Thresholds: Perf ≥0.95, A11y/BP/SEO = 1.0.          |
| `npm run clean`           | `rimraf` build/cache artifacts + `node_modules`/lockfile, then reinstall.                                |

> **Build note:** `npm run build` is `astro build && pagefind --site docs`. Always run the full script (not bare `astro build`) when content or the search shell changes, so the Pagefind index regenerates against the current DOM.

## Authentication

The content pipeline reads `gh auth token` at runtime for **every** GitHub API call. There is **no `.env` file**, **no stored PAT**, and **no secrets in the repo**. If `gh` is not authenticated, the pipeline fails fast with an actionable error.

```bash
gh auth login -s repo   # one-time, repo scope
gh auth status          # verify
```

The Astro site itself builds without `gh` — authentication is only required for the content pipeline (`refresh:*` and `/equill-labs-update`).
