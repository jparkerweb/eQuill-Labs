# Phase 1: Foundation

**Status:** Complete
**Estimated Tasks:** 18
**Milestone:** 1 — Foundation + Content
**Dependencies:** None

---

## Overview

Establish the Astro 5 scaffold, theme token system, brand asset migration, and first successful empty build. This phase produces a runnable but content-less shell that later phases fill in. No Handlebars code is touched yet — the legacy system stays intact until Phase 7 (Migration).

## Prerequisites

- Node 20 LTS or newer installed (`node --version` reports `v20.x.x` or higher)
- `git` checkout of `C:\git\eQuill-Labs` on branch `redesign`
- `gh` CLI installed (authentication deferred to Phase 2 — only needed when fetching)
- Current working tree is clean or changes are committed before starting

## Tasks

### Repo Conventions

- [x] **Task 1.1:** Create `AGENTS.md` at repo root documenting: (a) prerequisites — Node 20 LTS, `gh` CLI authenticated with `repo` scope, Windows/macOS/Linux compatible; (b) commands — `npm run dev`, `npm run build`, `npm run preview`, `npm run refresh` (added in Phase 3); (c) authentication — `gh auth token` is read at runtime for all GitHub API calls, no `.env` or stored PAT; (d) guardrails — the `refresh-portfolio` Skill writes only to `data/*` and `src/content/projects/*.md`; templates, layouts, components, and `src/content/pages/*.md` are hand-authored and never auto-edited; (e) directory layout summary; (f) **curation model** — three ways to exclude repos from the site: (1) GitHub topic `not-portfolio` or `private-project` on the repo itself (preferred — zero-config, editable from github.com), (2) glob pattern in `site/featured.json` → `hidden[]` (e.g., `"kdm-*"` for whole families), (3) exact repo name in `hidden[]`. Featured repos are controlled via `featured[]` in the same file or by tagging with GitHub topic `equill-featured`. Schema documentation lives in `site/featured.schema.json`. (g) link to `specs/equill-labs-v2/` docs.

### Package + Astro Scaffold

- [x] **Task 1.2:** Overwrite `package.json` with new contents: `name: "equill-labs"`, `version: "2.0.0"`, `private: true`, `type: "module"`, `engines.node: ">=20.0.0"`, `scripts: { dev: "astro dev", build: "astro build", preview: "astro preview", check: "astro check", format: "prettier --write ." }`. Do not remove the existing `devDependencies` block yet (deleted in Phase 7) — leave Handlebars deps in place so legacy `build.js` still works during transition.
- [x] **Task 1.3:** Install Astro and its sitemap integration: `npm install astro@^5 @astrojs/sitemap`. Verify `node_modules/astro/package.json` shows version `^5.x`.
- [x] **Task 1.4:** Create `astro.config.mjs` with config: `site: 'https://www.equilllabs.com'`, `outDir: './docs'`, `trailingSlash: 'always'`, `build: { format: 'directory' }`, `integrations: [sitemap()]`, `vite: { plugins: [] }` (Tailwind plugin added in Task 1.7). Import `sitemap` from `@astrojs/sitemap`.
- [x] **Task 1.5:** Create `tsconfig.json` extending `astro/tsconfigs/strict`. Set `compilerOptions.baseUrl: "."` and `paths: { "@/*": ["src/*"], "@scripts/*": ["scripts/*"] }`.

### Tooling

- [x] **Task 1.6:** Install and configure Prettier: `npm install -D prettier prettier-plugin-astro`. Create `.prettierrc.json` with `{ "printWidth": 100, "singleQuote": true, "trailingComma": "all", "plugins": ["prettier-plugin-astro"], "overrides": [{ "files": "*.astro", "options": { "parser": "astro" } }] }`. Create `.prettierignore` excluding `node_modules/`, `docs/`, `.astro/`, `data/`, `pages/` (legacy).

### Tailwind + Theme System

- [x] **Task 1.7:** Install Tailwind v4: `npm install tailwindcss@^4 @tailwindcss/vite`. Add `@tailwindcss/vite` to `vite.plugins` in `astro.config.mjs`.
- [x] **Task 1.8:** Create `src/styles/tokens.css` defining 10 semantic CSS variables on `:root[data-theme="dark"]` (placeholder values for now; chosen palette populated in Phase 4): `--bg`, `--surface-1`, `--surface-2`, `--border`, `--text-1`, `--text-2`, `--text-muted`, `--accent`, `--accent-contrast`, `--focus-ring`. Use near-black background (`#0C0E14`) and white text (`#E8ECF4`) placeholders.
- [x] **Task 1.9:** Create `src/styles/themes/dark.css` and `src/styles/themes/light.css` each defining the same 10 tokens scoped to `:root[data-theme="dark"]` and `:root[data-theme="light"]` respectively. Use placeholder values matching `tokens.css`; real palette lands in Phase 4 Task 4.3.
- [x] **Task 1.10:** Create `src/styles/globals.css` with: `@import "tailwindcss";` as first line, followed by `@import "./tokens.css";`, `@import "./themes/dark.css";`, `@import "./themes/light.css";`. Add `@theme { --color-bg: rgb(var(--bg) / <alpha-value>); }` and matching mappings so Tailwind utilities (`bg-bg`, `text-text-1`, etc.) read the tokens.

### Theme Script + Base Layout

- [x] **Task 1.11:** Create `src/components/layout/ThemeScript.astro` containing a single inline `<script is:inline>` that runs before any paint: reads `localStorage.theme` (values: `"light"`, `"dark"`, or absent), falls back to `matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'`, assigns `document.documentElement.dataset.theme = value`. Wrap in `try/catch` defaulting to `'dark'` on error. Use `is:inline` attribute so Astro does not bundle it.
- [x] **Task 1.12:** Create `src/layouts/BaseLayout.astro`

> SPEC NOTE: Spec called for `<link rel="stylesheet" href="/src/styles/globals.css">`, but raw `/src/...` paths are not processed by Vite in a production Astro build. Used the Astro-idiomatic `import '@/styles/globals.css'` in the component frontmatter instead; the processed stylesheet is emitted to `docs/_astro/` as required by Task 1.18. with `<!doctype html><html lang="en" data-theme="dark">`, `<head>` containing `<meta charset>`, `<meta viewport>`, `<title>` from prop, `<ThemeScript />` as first child after meta, `<link rel="stylesheet" href="/src/styles/globals.css">` (Astro will process via Vite), `<link rel="icon" type="image/x-icon" href="/brand/favicon.ico">`. `<body>` contains `<slot />`. Accept `title` and `description` props.

### First Page

- [x] **Task 1.13:** Create `src/pages/index.astro` importing `BaseLayout` and rendering a minimal placeholder: `<h1>eQuill Labs</h1><p>Under reconstruction.</p>`. Pass `title="eQuill Labs"` prop. This is throwaway content replaced in Phase 5 Task 5.15.

### Public Directory + Asset Migration

- [x] **Task 1.14:** Create `public/` directory. Copy `src/static/CNAME` to `public/CNAME` (single line: `www.equilllabs.com`). Create empty file `public/.nojekyll` (zero bytes). Copy `src/static/site.webmanifest` to `public/site.webmanifest`.
- [x] **Task 1.15:** Migrate brand assets: create `public/brand/` directory and copy all files matching `src/static/images/logo*`, `src/static/images/quill.svg`, `src/static/images/favicon*`, `src/static/images/apple-touch-icon*`, `src/static/images/android-chrome*` into it. Preserve original filenames. Do NOT delete the originals in `src/static/` yet (deleted in Phase 7).
- [x] **Task 1.16:** Migrate project thumbnails: create `public/projects/` and copy all files from `src/static/images/projects/` (e.g., `chunk-match.jpg`, `pixel-banner.jpg`, `rich-foot.jpg`, `semantic-chunking.jpg`, `trim-style.gif`, `wag.jpg`, `fast-topic-analysis.jpg`, `projects-background.png`) preserving filenames. These serve as fallback banners when GitHub READMEs lack hero images.

### Git Hygiene

- [x] **Task 1.17:** Create `.gitignore` at repo root with entries (one per line): `node_modules/`, `.astro/`, `dist/`, `data/logs/`, `.env`, `.env.*`, `*.log`, `.DS_Store`, `Thumbs.db`, `mockups/`. Important: do NOT gitignore `docs/` (committed build output) or `data/*.json` (committed pipeline state).

### Smoke

- [x] **Task 1.18:** Run `npm run build` and verify: exit code 0; `docs/index.html` exists and contains `eQuill Labs`; `docs/CNAME` exists with content `www.equilllabs.com`; `docs/.nojekyll` exists as empty file; `docs/brand/` contains migrated brand assets; `docs/_astro/` contains bundled CSS with Tailwind utilities. Run `npm run dev` separately; verify `http://localhost:4321/` renders the placeholder page.

## Phase Testing

- [x] **Smoke 1.A:** `npm run build` exits 0 and produces the file set listed in Task 1.18.
- [x] **Smoke 1.B:** `npm run check` (Astro's built-in type check) passes with 0 errors.
- [x] **Smoke 1.C:** Manual dev-server check: `npm run dev` starts on port 4321, page renders, dark theme applied (dark background).
- [x] **Smoke 1.D:** `npm run format` completes without error.

## Acceptance Criteria

- `AGENTS.md` exists at repo root and documents all five topics from Task 1.1.
- `package.json` has `engines.node: ">=20.0.0"` and the new `scripts` block.
- `astro.config.mjs` has `outDir: './docs'` and `site: 'https://www.equilllabs.com'`.
- Tailwind v4 is installed and its Vite plugin is registered.
- `src/styles/tokens.css` defines all 10 semantic CSS variables.
- `src/components/layout/ThemeScript.astro` uses `is:inline` and runs before paint.
- `public/CNAME`, `public/.nojekyll`, `public/brand/`, `public/projects/` exist.
- `docs/` contains a buildable output with CNAME and `.nojekyll`.
- `.gitignore` does NOT list `docs/` or `data/*.json`.
- Legacy files (`build.js`, `src/templates/`, `src/static/`, `pages/`) are still present and untouched.

## Notes

- Keep Handlebars deps (`handlebars`, `nodemon`, `serve`) in `package.json` for now — legacy `build.js` still runs if someone needs to check the old site. Phase 7 removes them.
- Placeholder palette in `tokens.css` and `themes/*.css` is intentional. Phase 4 replaces with the chosen design direction's real values.
- On Windows, `public/.nojekyll` may confuse some editors — confirm it's literally zero bytes, not containing a BOM or whitespace.
- `npm run dev` serves from in-memory; does not touch `docs/`. `npm run build` produces `docs/`.

## Phase Completion Summary

- **Completion date:** 2026-04-13
- **Implementer:** Claude Code (Opus 4.6) on branch `redesign`
- **Commits:** _pending user commit_
- **What was done:** Established the Astro 5 scaffold with Tailwind v4, semantic token CSS, pre-paint ThemeScript, BaseLayout, placeholder home page, brand + project asset migration into `public/`, Prettier config, `.gitignore`, and a clean `npm run build` producing `docs/`. Legacy Handlebars pipeline was left intact.
- **Files changed:**
  - Created: `AGENTS.md`, `astro.config.mjs`, `tsconfig.json`, `.prettierrc.json`, `.prettierignore`, `src/styles/tokens.css`, `src/styles/themes/dark.css`, `src/styles/themes/light.css`, `src/styles/globals.css`, `src/components/layout/ThemeScript.astro`, `src/layouts/BaseLayout.astro`, `src/pages/index.astro`, `public/CNAME`, `public/.nojekyll`, `public/site.webmanifest`, `public/brand/*` (16 files), `public/projects/*` (8 files), `docs/` build output.
  - Modified: `package.json` (rewritten; devDependencies preserved), `.gitignore` (expanded).
  - Untouched (legacy, removed in Phase 7): `build.js`, `config.js`, `src/templates/`, `src/static/`, `pages/`, `assets/`.
- **Issues encountered:**
  - `npm run check` required adding `@astrojs/check` and `typescript` as dev dependencies (Astro prompts interactively on first run). Installed and verified 0 errors.
  - `npm run format` initially errored on legacy `.hbs` files. Added `src/templates/` and `*.hbs` to `.prettierignore` (beyond the spec's literal list) so the format smoke exits clean.
  - Running Prettier reformatted several pre-existing docs (`AGENTS.md`, `specs/**/*.md`); these are pure whitespace/table-alignment changes.
- **Deviations from plan:**
  - **Task 1.12 / SPEC NOTE:** Spec called for a raw `<link rel="stylesheet" href="/src/styles/globals.css">` tag in `BaseLayout.astro`. This does not work in a production Astro/Vite build. Used `import '@/styles/globals.css'` in the component frontmatter — the Astro-idiomatic approach that satisfies the Task 1.18 acceptance criterion (`docs/_astro/` contains bundled CSS with Tailwind utilities).
  - **Tasks 1.8–1.10:** Spec gave placeholder colors as hex (`#0C0E14`, `#E8ECF4`) but Task 1.10 required the `rgb(var(--bg) / <alpha-value>)` Tailwind binding, which mandates space-separated RGB channels. Stored tokens as RGB triples (e.g., `12 14 20`); values are equivalent to the specified hex. Phase 4 will replace with the real palette.
  - **Task 1.18 / Smoke 1.B:** Installed `@astrojs/check` + `typescript` as dev deps so `npm run check` runs non-interactively. These are a superset of the listed tooling but aligned with the spec's intent.
  - **Task 1.18 / Smoke 1.D:** Added `src/templates/` and `*.hbs` to `.prettierignore` (beyond the spec's listed entries: `node_modules/`, `docs/`, `.astro/`, `data/`, `pages/`) so Prettier does not choke on the legacy Handlebars templates that remain until Phase 7.
