# eQuill Labs

Portfolio site for [eQuill Labs](https://www.equilllabs.com) — a catalog of open-source projects by Justin Parker spanning LLM infrastructure, semantic NLP, MCP tooling, and the Obsidian ecosystem.

Built with **Astro 6**, **Tailwind CSS 4**, and a GitHub-driven data pipeline that keeps project content in sync with live repositories.

Discord: https://discord.gg/sp8AQQhMJ7

---

## Tech Stack

| Layer | Tools |
|-------|-------|
| Framework | Astro 6, TypeScript |
| Styling | Tailwind CSS 4, CSS custom properties, Geist + Instrument Serif fonts |
| Content | Astro Content Collections, Markdown, gray-matter, remark |
| Data | GitHub GraphQL API via `@octokit/graphql`, `gh` CLI |
| OG Images | Satori (HTML to SVG) + resvg (SVG to PNG) |
| Search | Pagefind (static search index) |
| Icons | Lucide |
| Testing | Playwright + axe-core (a11y), Lighthouse CI, html-validate |
| Hosting | GitHub Pages |

## Project Structure

```
src/
├── components/
│   ├── brand/          # Logo, wordmark, slash glyph
│   ├── hero/           # Homepage hero (LivingIndex)
│   ├── layout/         # Header, footer, theme toggle
│   ├── projects/       # ProjectCard, ProjectGrid, filters, fallback art
│   └── seo/            # Meta tags, JSON-LD structured data
├── content/
│   ├── projects/       # Markdown files for each project (auto-generated)
│   └── pages/          # Static page content (about)
├── layouts/            # BaseLayout, ProjectLayout
├── lib/                # Utilities (OG rendering, README parsing, animations)
├── pages/              # File-based routing
│   ├── index.astro
│   ├── about.astro
│   ├── 404.astro
│   ├── projects/       # Listing + dynamic [slug] detail pages
│   └── og/             # Dynamic OG image endpoints
└── styles/             # Global CSS, design tokens, dark/light themes

scripts/                # Data pipeline (fetch, curate, render, blurbs)
data/                   # GitHub snapshot, build manifest, AI cache
site/                   # Curation config (featured.json)
docs/                   # Production build output (GitHub Pages)
public/                 # Static assets (brand, favicons, project images)
tests/                  # E2E accessibility tests
```

## Getting Started

**Requirements:** Node.js >= 20

```bash
# Install dependencies
npm ci

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Data Pipeline

Project content is pulled from GitHub and rendered into Astro content collections. The pipeline requires the `gh` CLI authenticated with repo scope (`gh auth login -s repo`).

```bash
# Fetch repos from GitHub → data/github-snapshot.json
npm run refresh:fetch

# Render snapshot into content markdown → src/content/projects/*.md
npm run refresh:render

# Run both steps
npm run refresh:all
```

**Flow:**
1. `refresh:fetch` queries the GitHub GraphQL API for all public repos
2. `refresh:render` reads the snapshot + `site/featured.json` curation config, then generates markdown files with full frontmatter (stars, languages, topics, links, etc.)
3. `astro build` compiles the site to `docs/`
4. Pagefind indexes the output for client-side search

### README Conventions

When rendering project content, the pipeline scrapes each repo's README for extra metadata via `src/lib/readme-parse.ts`. Authoring your repo README with these conventions lets the generator pick things up automatically:

| Signal | How to mark it in the README | Where it shows up |
|--------|------------------------------|-------------------|
| Hero banner | First `<img>` or `![alt](…)` whose alt contains `banner` (falls back to first image) | Card banner + project page hero |
| Tagline | First paragraph after the H1 | Card tagline + project page subtitle |
| Features | Bulleted list under a heading matching `features` / `why` / `highlights` | (reserved for future use) |
| **Demo link** | **Any `<a>` tag with `data-tag="demo"`**, e.g. `<a href="https://semantic-chunking.equilllabs.com/" data-tag="demo">semantic-chunking.equilllabs.com</a>` | "Demo" link on the project page sidebar, rendered above the Repository link |
| Install snippet | First fenced code block whose first line starts with `npm` / `pnpm` / `yarn` / `bun` / `npx` | (reserved for future use) |

The `data-tag="demo"` attribute is the canonical, explicit marker for a live demo URL — it takes priority over the older heuristic that matched link text/URLs containing `demo`, `live`, `playground`, or `try it`. Prefer the attribute in new READMEs so the intent is unambiguous.

### Project Categories (GitHub Topics → Type)

Every project on the site is tagged with a **category** (shown as the "Type" filter on the projects page and as `data-type` on each card). The category is **auto-derived** from the repo's GitHub topics and homepage URL during `npm run refresh:render`, by `deriveCategory()` in [`scripts/curate.ts`](scripts/curate.ts).

**The 7 categories:**

| Category | What it means | Examples |
|----------|---------------|----------|
| `library` | Reusable package / importable code (npm, etc.) | `semantic-chunking`, `chunk-match`, `down-craft` |
| `plugin` | Extension to a host app (Obsidian, browser, etc.) | `pixel-banner`, `rich-foot` |
| `cli` | Command-line tool or shell script | `ps-win-dir-size`, `add-block-to-hosts` |
| `service` | Deployable server, API, proxy, MCP server, container | `mcp-sqlite`, `bedrock-proxy-endpoint` |
| `utility` | General-purpose helper tool that doesn't fit the shapes above | *(tag with `util`, `utility`, or `tool`)* |
| `app` | Standalone application with a live site/demo | `shrinkray`, `web-augmented-generation` |
| `demo` | Example / experiment / learning project (the default) | `htmldiff-example`, `ollama-structured-output-test` |

#### How to control a project's category

The derivation checks rules in priority order — the **first rule that matches wins**. Use these by adding the corresponding **GitHub topics** to your repo (Settings → About → Topics) or by setting its **homepage URL**.

1. **Explicit override (always wins)** — add one of these topics to force a category:
   - `equill-library` · `equill-plugin` · `equill-cli` · `equill-service` · `equill-utility` · `equill-app` · `equill-demo`

2. **Service** — any of: `mcp`, `mcp-server`, `api`, `proxy`, `endpoint`, `serverless`, or homepage on `hub.docker.com`

3. **Plugin** — any of: `obsidian-plugin`, `obsidian`, `plugin`, `browser-extension`

4. **Library** — any of: `npm`, `npm-package`, `library`, or homepage on `npmjs.com/package/…`

5. **CLI** — any of: `cli`, `powershell`, `bash-script`, `shell-script`

6. **Utility** — any of: `util`, `utility`, `tool`

7. **App** — repo name ends in `-app`, OR a non-npm / non-dockerhub homepage URL is set

8. **Demo** — the fallback when nothing else matches

#### Tips

- **Adding `equill-<category>` is the safest way to lock in a category** regardless of other topics. Use it when the automatic rules pick the wrong bucket.
- Topic order doesn't matter — matching is set-based.
- Topics are case-insensitive on our side, but GitHub stores them lowercase.
- After changing topics on GitHub, run `npm run refresh:all` to re-pull the snapshot and regenerate the markdown.
- **Want a new category?** Edit the `deriveCategory()` function in `scripts/curate.ts`, then update the three enum locations: `scripts/render-content.ts`, `src/content.config.ts`, and the `TYPES` array in `src/components/projects/ProjectFilters.astro`.

### Curation

`site/featured.json` controls which projects are featured, hidden, or reordered:

```json
{
  "featured": ["pixel-banner", "semantic-chunking", "mcp-sqlite"],
  "hidden": ["dotfiles*", "*-personal"],
  "hideTopics": ["not-portfolio", "private-project"],
  "order": { "semantic-chunking": 1 }
}
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Astro dev server with hot reload |
| `npm run build` | Production build + Pagefind indexing |
| `npm run preview` | Serve production build locally |
| `npm run check` | Type-check Astro files |
| `npm run format` | Format code with Prettier |
| `npm run refresh:fetch` | Fetch GitHub data |
| `npm run refresh:render` | Generate content from snapshot |
| `npm run refresh:all` | Fetch + render |
| `npm run validate:html` | Validate build output HTML |
| `npm run test:a11y` | Accessibility tests (Playwright + axe-core) |
| `npm run test:lighthouse` | Lighthouse CI performance audit |

## Pages

- **Home** (`/`) — Featured projects grid, hero section, about teaser
- **Projects** (`/projects/`) — Full catalog with search and filtering
- **Project Detail** (`/projects/[slug]/`) — Banner, metadata, README content, sidebar links
- **About** (`/about/`) — Bio, focus areas, timeline
- **OG Images** (`/og/[slug].png`) — Dynamically rendered social preview images

## Analytics

The site uses self-hosted **[Umami](https://umami.is/)** (cookieless, GDPR-friendly) at `https://umami.jparkerweb.com`. The tracker snippet lives in `src/layouts/BaseLayout.astro` and only fires on the production domains, so dev and preview traffic isn't counted. Every page inherits tracking automatically through `BaseLayout`. See [`AGENTS.md → Analytics`](./AGENTS.md#analytics) for the website ID, custom-event API, and operational notes.

## Theming

Dark theme is the default. Light theme is available via toggle. Design tokens live in `src/styles/tokens.css` with theme overrides in `src/styles/themes/`.

## Deployment

The site deploys to GitHub Pages from the `docs/` directory. The custom domain `www.equilllabs.com` is configured via `public/CNAME`.

```bash
npm run build    # outputs to docs/
git add docs/
git commit -m "build: update site"
git push
```
