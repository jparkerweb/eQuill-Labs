# Architecture & Content Pipeline

> Part of [AGENTS.md](../AGENTS.md) — project guidance for AI coding agents.

eQuill Labs is an Astro 6 + Tailwind 4 static site with a GitHub-driven data pipeline. Repositories are fetched via the GitHub GraphQL API, curated, summarized by AI into committed Markdown, and rendered to `./docs/` for GitHub Pages branch-deploy.

## Directory Layout

```
C:/git/eQuill-Labs/
├── AGENTS.md                       # index for AI agents (this doc's parent)
├── astro.config.mjs                # Astro config (outDir: ./docs)
├── package.json                    # Node deps + scripts
├── tsconfig.json                   # TS config (strict)
├── .claude/
│   └── skills/
│       ├── equill-labs-update/      # content-refresh Skill (multi-phase prompts)
│       └── equill-labs-manage-categories/
├── scripts/                        # Node pipeline modules (run via tsx)
│   ├── fetch-github.ts             # GitHub GraphQL → data/github-snapshot.json
│   ├── curate.ts                   # topic/featured.json filtering + categorization
│   ├── write-blurbs.ts             # AI blurb generation (data/ai-cache.json)
│   ├── render-content.ts           # → src/content/projects/*.md
│   ├── build-manifest.ts           # data/build-manifest.json
│   ├── propose-diffs.ts            # emits .diff artifacts for hand-authored files
│   └── lib/
├── site/
│   ├── featured.json               # hand-edited curation overrides
│   └── featured.schema.json        # canonical schema for featured.json
├── data/                           # committed pipeline state
│   ├── github-snapshot.json
│   ├── ai-cache.json
│   ├── build-manifest.json
│   └── proposals/                  # .diff artifacts proposing hand-authored edits
├── src/
│   ├── components/
│   ├── content/
│   │   ├── pages/                  # hand-authored
│   │   └── projects/               # Skill-owned, AI-generated
│   ├── content.config.ts           # Astro content collection Zod schemas
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   ├── static/
│   └── styles/
│       ├── tokens.css
│       ├── globals.css
│       └── themes/{dark,light}.css
├── public/                         # static assets served verbatim (CNAME, brand/, etc.)
├── docs/                           # build output (committed, deployed by GitHub Pages)
└── specs/equill-labs-v2/           # planning & implementation specs
```

## Guardrails — what the Skill may write

The `equill-labs-update` Skill is permitted to write **only** to:

- `data/*` — pipeline state (GitHub snapshot, AI cache, build manifest)
- `src/content/projects/*.md` — AI-generated project entries

Everything else is **hand-authored** and must **never be auto-edited** by the Skill:

- `src/components/`, `src/layouts/`, `src/styles/` *(includes the Umami analytics snippet in `BaseLayout.astro` — see [Analytics](./AGENTS-analytics.md))*
- `src/content/pages/*.md`
- `astro.config.mjs`, `package.json`, `tsconfig.json`
- `AGENTS.md`, `README.md`
- `public/`

When the Skill detects a hand-authored file would need to change, it emits a `.diff` artifact under `data/proposals/` and **stops** — it never applies the change itself.

## Curation Model

**Three ways to exclude** a repository from the site:

1. **GitHub topic on the repo** (preferred — zero-config, editable from github.com): tag with `not-portfolio` or `private-project`.
2. **Glob pattern** in `site/featured.json` → `hidden[]` — useful for whole families, e.g. `"kdm-*"`.
3. **Exact repo name** in `site/featured.json` → `hidden[]`.

**Two ways to feature** a repository:

1. **GitHub topic** `equill-featured` on the repo.
2. **Exact repo name** in `site/featured.json` → `featured[]`.

`site/featured.json` is validated against `site/featured.schema.json` — that schema is the canonical field documentation.
