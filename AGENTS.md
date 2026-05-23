# AGENTS.md

Project conventions for AI agents and human contributors working on **eQuill Labs v2**.

---

## Prerequisites

- **Node 20 LTS or newer** (`node --version` → `v20.x` or higher). Enforced via `package.json` `engines.node: ">=20.0.0"`.
- **`gh` CLI** installed and authenticated with `repo` scope for reading public repositories. Verify with `gh auth status`. Only required when running the content pipeline (Phase 2+); the Astro site itself builds without it.
- **OS** — works on Windows, macOS, and Linux. Shell examples assume POSIX-style paths; Windows users can run them from Git Bash or WSL.

---

## Commands

Three primary commands — `npm run dev`, `npm run build`, `/equill-labs-update`.

| Command                 | Purpose                                                                                                  |
| ----------------------- | -------------------------------------------------------------------------------------------------------- |
| `npm run dev`           | Start Astro dev server on `http://localhost:4321/` (in-memory, does not write `docs/`).                  |
| `npm run build`         | Build the static site to `./docs/` and generate the Pagefind index under `./docs/pagefind/`.             |
| `npm run preview`       | Serve the built `./docs/` output locally (Astro preview; used by test tooling).                          |
| `npm run check`         | Run `astro check` (TypeScript + Astro type checking).                                                    |
| `npm run format`        | Run Prettier over the repository.                                                                        |
| `npm run refresh:all`   | Run `fetch-github` + `render-content` without the Skill (pipeline debugging).                            |
| `/equill-labs-update`    | Claude Code Skill — full content refresh with mandatory review + commit gates.                           |
| `npm run validate:html` | Run `html-validate` over `./docs/**/*.html`. Exits non-zero on real validity defects.                    |
| `npm run test:a11y`     | Run Playwright + axe-core a11y suite against `home / projects / one detail / about` (0 violations gate). |
| `npm run test:lighthouse` | Run Lighthouse CI (3 runs × 4 URLs). Thresholds: Perf ≥0.95, A11y/BP/SEO = 1.0.                        |

---

## Authentication

The content pipeline reads `gh auth token` at runtime for every GitHub API call. There is **no `.env` file**, **no stored PAT**, and **no secrets in the repo**. If `gh` is not authenticated, the pipeline fails fast with an actionable error.

To authenticate:

```bash
gh auth login       # one-time
gh auth status      # verify
```

---

## Guardrails

The `equill-labs-update` Skill is permitted to write only to:

- `data/*` — pipeline state (GitHub snapshot, AI cache, build manifest)
- `src/content/projects/*.md` — AI-generated project entries

Everything else is **hand-authored** and must **never be auto-edited** by the Skill:

- `src/templates/`, `src/layouts/`, `src/components/` *(includes the Umami analytics snippet in `BaseLayout.astro` — see [Analytics](#analytics))*
- `src/content/pages/*.md`
- `src/styles/`
- `astro.config.mjs`, `package.json`, `tsconfig.json`
- `AGENTS.md`, `README.md`
- `public/`

When the Skill detects that a hand-authored file would need to change, it emits a `.diff` artifact under `data/proposed-diffs/` and stops — it never applies the change itself.

---

## Directory Layout

```
C:/git/eQuill-Labs/
├── AGENTS.md                       # this file
├── astro.config.mjs                # Astro config (outDir: ./docs)
├── package.json                    # Node deps + scripts
├── tsconfig.json                   # TS config (strict)
├── .claude/
│   └── skills/
│       └── equill-labs-update/      # Claude Code Skill (Phase 3)
├── scripts/                        # Node pipeline modules (Phase 2+)
│   ├── fetch-github.ts
│   ├── curate.ts
│   ├── write-blurbs.ts
│   ├── render-content.ts
│   └── propose-diffs.ts
├── site/
│   └── featured.json               # hand-edited curation overrides
├── data/                           # committed pipeline state
│   ├── github-snapshot.json
│   ├── ai-cache.json
│   └── build-manifest.json
├── src/
│   ├── components/
│   ├── content/
│   │   ├── config.ts               # Zod schemas
│   │   ├── pages/                  # hand-authored
│   │   └── projects/               # Skill-owned
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   └── styles/
│       ├── tokens.css
│       ├── globals.css
│       └── themes/
├── public/                         # static assets served verbatim
│   ├── CNAME
│   ├── .nojekyll
│   ├── brand/
│   ├── projects/
│   └── site.webmanifest
├── docs/                           # build output (committed, deployed)
└── specs/                          # planning & implementation specs
    └── equill-labs-v2/
```

---

## Curation Model

There are **three ways to exclude** a repository from the site:

1. **GitHub topic on the repo itself** (preferred — zero-config, editable from github.com)
   - Tag the repo with `not-portfolio` or `private-project`.
2. **Glob pattern** in `site/featured.json` → `hidden[]` — useful for whole families, e.g. `"kdm-*"`.
3. **Exact repo name** in `site/featured.json` → `hidden[]`.

There are **two ways to feature** a repository:

1. **GitHub topic** `equill-featured` on the repo.
2. **Exact repo name** in `site/featured.json` → `featured[]`.

`site/featured.json` is validated against `site/featured.schema.json`. See that schema file for the canonical field documentation.

---

## Design Direction (locked)

The visual identity was locked in Phase 4 as **"The Quill & Slash"**. The canonical reference is [`specs/equill-labs-v2/DESIGN-DECISION.md`](./specs/equill-labs-v2/DESIGN-DECISION.md); token values live in `src/styles/tokens.css` and theme-specific values in `src/styles/themes/{dark,light}.css`. Treat those files as source of truth — don't introduce one-off color or spacing literals in component CSS.

---

## Analytics

The site is instrumented with **self-hosted [Umami](https://umami.is/)** running on the maintainer's home server.

| Field | Value |
|---|---|
| Tracker host | `https://umami.jparkerweb.com` |
| Tracker script | `https://umami.jparkerweb.com/script.js` |
| Website ID | `2bf560c7-82c3-442c-8fda-63ceaa2348cf` |
| Allowed domains | `equilllabs.com`, `www.equilllabs.com` |
| Snippet location | `src/layouts/BaseLayout.astro` (in `<head>`, after `<ClientRouter />`) |
| Compose stack | `docker-compose-library/parker-lab/umami/` (separate repo) |

### How it works

- Umami is **cookieless** and GDPR-compliant by default — no consent banner needed.
- The snippet uses `data-domains` so events only fire on the production hostnames. **`localhost`, GitHub Codespaces previews, and PR previews are silently ignored** — dev work never pollutes stats.
- Astro's `ClientRouter` performs SPA-style navigation. Umami's tracker auto-listens to `history.pushState` / `popstate`, so SPA route changes are captured as separate pageviews **without any extra wiring**.
- The script is loaded with `is:inline defer` so Astro doesn't try to bundle it, and it doesn't block page rendering.

### Adding a new page

**You don't need to do anything.** Every page in `src/pages/**` ultimately renders through `BaseLayout.astro` (directly, or via `ProjectLayout.astro` which wraps `BaseLayout`). Tracking is inherited automatically.

If you ever introduce a new top-level layout that does **not** wrap `BaseLayout`, copy the `<script>` block from `BaseLayout.astro` (lines ~49–54) into the new layout's `<head>`. Use the same `data-website-id` — one Umami "website" covers the whole domain.

### Custom event tracking (optional)

To track a specific interaction (e.g., a project card click), call `umami.track()` from any client-side script:

```js
// Simple named event
window.umami?.track('project-card-click');

// With properties
window.umami?.track('project-card-click', { slug: 'semantic-chunking' });
```

The `?.` chain makes it a no-op when Umami is blocked or not loaded — never throw on missing tracker.

### Do NOT

- **Do not** change `data-website-id` — it's bound to the website record in Umami; changing it loses historical continuity.
- **Do not** remove `data-domains` — without it, every dev/preview pageview is recorded.
- **Do not** swap the `src=` to a CDN-hosted Umami Cloud URL unless you're explicitly migrating off self-hosting.
- **Do not** add Google Analytics, Plausible, Fathom, or any other tracker alongside Umami without an explicit ask — the site is intentionally single-tracker and cookie-free.

### If the tracker breaks

1. **No data showing up?** Check the Umami container is running (`docker ps | grep umami` on the server) and that `https://umami.jparkerweb.com/script.js` returns 200 in a browser.
2. **CORS errors in console?** The Umami container needs to accept requests from `equilllabs.com`. By default it allows all origins; if `CORS_MAX_AGE` or a reverse-proxy header was changed, restore the default.
3. **Ad-blocker false positives** — uBlock Origin and similar block `/script.js` paths from analytics-shaped hostnames. To dodge this, set `TRACKER_SCRIPT_NAME=stats.js` in the Umami container env, then update `src=` in `BaseLayout.astro` to match. Document the rename here if done.

---

## Deploy

Deployment is GitHub Pages branch-deploy from `main /docs`:

1. Commit any `docs/` changes produced by `npm run build` (Astro writes to `./docs/` via `outDir`).
2. Push `main`. GitHub Pages rebuilds the site from `main /docs` within ~2 minutes.
3. `public/CNAME` preserves `www.equilllabs.com`. DNS is unchanged — an A/AAAA to GitHub Pages IPs + `www` CNAME to `<user>.github.io`.
4. There is no GitHub Actions workflow involved (`.github/workflows/static.yml` was removed in Phase 7).

No manual deploy step beyond `git push`.

---

## Gotchas

- **Pagefind indexes `docs/` AFTER the Astro build.** If you change content layout or the search shell, run a full `npm run build` (not just `astro build`) so the index regenerates and mirrors the current DOM.
- **Chrome-launcher EPERM on Windows.** Lighthouse's bundled `chrome-launcher` can throw `EPERM, Permission denied` while cleaning up its temp user-data dir after Chrome exits. `node_modules/lighthouse/node_modules/chrome-launcher/dist/chrome-launcher.js` has a local try/catch in `destroyTmp()` to swallow the cleanup error (audit results are complete by that point). `npm install` may remove the patch; reapply or persist via `patch-package` if it recurs.
- **Scoped Astro styles + inline styles.** `html-validate`'s `recommended` preset flags `style="..."` attributes that Astro injects for scoped CSS vars and view-transition hints — disabled in `.htmlvalidate.json` (alongside `no-redundant-role`, `aria-label-misuse`, `doctype-style`, `form-dup-name`, `wcag/h32`) because they flag intentional patterns, not validity defects. See the file's comments and the Phase 8 notes for rationale.
- **Playwright + axe timing.** Running axe immediately after `page.goto(..., { waitUntil: 'load' })` can race the heading DOM on hydrated routes. `tests/a11y.spec.ts` uses `waitUntil: 'networkidle'` + explicit `h1` visibility wait.
- **Heading order matters on the catalog.** ProjectCard uses `<h2>` (not `<h3>`) so that `/projects/` has a clean `h1 → h2` hierarchy. Don't demote it back to `h3` without reintroducing a wrapping `h2`.
- **Dark theme `--text-muted` is tuned for AA.** `#8D97AB` gives ~5:1 on `--surface-2`. Further darkening regresses the Lighthouse accessibility assertion to below 1.0.

## Common failure modes

- `gh auth status` fails → `gh auth login -s repo`.
- `npm run build` logs `no <html> element` warnings for stray `/projects/*.html` redirects → expected; Astro emits minimal redirect stubs (lowercase doctype) pointing at the trailing-slash canonical URL.
- `test:lighthouse` errors with `EPERM ... lighthouse.<hash>` → chrome-launcher cleanup. Apply the patch above.
- `test:a11y` reports `page-has-heading-one` or `heading-order` → a page is missing an `h1` or jumps heading levels. Don't suppress; fix the markup.
- Pagefind shows 0 results → verify `docs/pagefind/` exists and that `.astro` search shell selectors weren't renamed.

---

## Specs

Full planning and implementation documentation lives under [`specs/equill-labs-v2/`](./specs/equill-labs-v2/). Start with [`overview.md`](./specs/equill-labs-v2/overview.md) for the phase index and success criteria.
