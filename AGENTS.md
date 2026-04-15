# AGENTS.md

Project conventions for AI agents and human contributors working on **eQuill Labs v2**.

---

## Prerequisites

- **Node 20 LTS or newer** (`node --version` → `v20.x` or higher). Enforced via `package.json` `engines.node: ">=20.0.0"`.
- **`gh` CLI** installed and authenticated with `repo` scope for reading public repositories. Verify with `gh auth status`. Only required when running the content pipeline (Phase 2+); the Astro site itself builds without it.
- **OS** — works on Windows, macOS, and Linux. Shell examples assume POSIX-style paths; Windows users can run them from Git Bash or WSL.

---

## Commands

| Command           | Purpose                                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------------------------- |
| `npm run dev`     | Start Astro dev server on `http://localhost:4321/` (in-memory, does not write `docs/`).                  |
| `npm run build`   | Build the static site to `./docs/` (committed and deployed via GitHub Pages).                            |
| `npm run preview` | Serve the built `./docs/` output locally for verification.                                               |
| `npm run check`   | Run `astro check` (TypeScript + Astro type checking).                                                    |
| `npm run format`  | Run Prettier over the repository.                                                                        |
| `npm run refresh` | Invoke the `refresh-portfolio` Claude Code Skill to refresh site content from GitHub (added in Phase 3). |

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

The `refresh-portfolio` Skill is permitted to write only to:

- `data/*` — pipeline state (GitHub snapshot, AI cache, build manifest)
- `src/content/projects/*.md` — AI-generated project entries

Everything else is **hand-authored** and must **never be auto-edited** by the Skill:

- `src/templates/`, `src/layouts/`, `src/components/`
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
│       └── refresh-portfolio/      # Claude Code Skill (Phase 3)
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

## Specs

Full planning and implementation documentation lives under [`specs/equill-labs-v2/`](./specs/equill-labs-v2/). Start with [`overview.md`](./specs/equill-labs-v2/overview.md) for the phase index and success criteria.
