# PLAN-DRAFT: eQuill Labs v2 — AI-Driven Portfolio Platform

**Created:** 2026-04-12
**Status:** Complete
**Feature:** equill-labs-v2
**Branch:** redesign
**Confidence:** 98% (Reqs 24/25 · Feasibility 25/25 · Integration 25/25 · Risk 24/25)
**Conversation Log:** [PLAN-CONVERSATION-20260412.md](./PLAN-CONVERSATION-20260412.md)

---

## 1. Executive Summary

Complete ground-up redesign of the eQuill Labs website, powered by a Claude Code Skill (`refresh-portfolio`) that reads Justin Parker's (`jparkerweb`) public GitHub repositories and regenerates the site's content layer on demand. The Astro-based static site becomes a first-class showcase of an AI engineer's prolific open-source output. The Skill makes keeping the site current a one-command operation with a mandatory human review gate before commit. Build output deploys to GitHub Pages via branch-deploy from `/docs`, preserving the `equilllabs.com` custom domain.

---

## 2. Requirements

### 2.1 Functional Requirements

- [ ] **FR-1** Replace hand-rolled Handlebars SSG with **Astro 5** (Content Collections + Zod schemas).
- [ ] **FR-2** Build output → `/docs` (renamed from `/pages`), committed to repo, served by GitHub Pages branch-deploy from `main`.
- [ ] **FR-3** Preserve custom domain `equilllabs.com` via `CNAME` + `.nojekyll` in `docs/`.
- [ ] **FR-4** Source content from `jparkerweb`'s GitHub profile (83 public repos); 6 pinned repos form the featured baseline.
- [ ] **FR-5** Ship a Claude Code Skill `refresh-portfolio` that runs: **fetch → curate → propose copy diffs → render → build → STOP for human review** (never auto-commits).
- [ ] **FR-6** Skill writes only to `data/*` (GitHub snapshot, AI cache, manifest) and `src/content/projects/*.md` (generated). Templates, layouts, components, and hand-authored pages are never auto-edited.
- [ ] **FR-7** Featured curation via GitHub topic `equill-featured` + committed `site/featured.json` override (ordering, hides, pins).
- [ ] **FR-8** Site structure: **Hero** (Living Index + brand moment) · **Featured Projects** · **Full Catalog** (filterable) · **About** (bio + faith/family section relocated from home).
- [ ] **FR-9** Project catalog: pill-chip facets (theme, language, type) + Pagefind search + URL-state sync.
- [ ] **FR-10** Three-state theme system: system / dark / light. Dark is primary. Inline FOUC-prevention script.
- [ ] **FR-11** Preserve brand elements: tagline _"Building tools to enrich our digital lives"_, `eQui\\ Labs` wordmark (the `\\` is intentional brand — web-technology play), quill mark, warmth of voice.
- [ ] **FR-12** Per-page OG images generated via **Satori** at build time (1200×630).
- [ ] **FR-13** SEO: JSON-LD (`Person`, `Organization`, `SoftwareSourceCode`), `sitemap.xml`, `robots.txt`.

### 2.2 Non-Functional Requirements

- [ ] **NFR-1** Lighthouse 98+ across all categories at launch.
- [ ] **NFR-2** Core Web Vitals (75th pct, mobile 4G): LCP <2.0s · INP <150ms · CLS <0.05.
- [ ] **NFR-3** JavaScript budget <50KB gzipped per route (Astro 0-JS default baseline; realistic target 10-25KB).
- [ ] **NFR-4** WCAG AA contrast · full keyboard navigation · `prefers-reduced-motion` respected · 44×44px tap targets · skip-links · semantic landmarks.
- [ ] **NFR-5** Idempotent regeneration: re-running the Skill with zero GitHub changes yields a clean `git diff`.
- [ ] **NFR-6** AI-generated copy grounded in README / GitHub metadata (quote-or-omit rule; no invented features).
- [ ] **NFR-7** GitHub auth via `gh auth token` at runtime — no stored PAT. **Documented in AGENTS.md.**
- [ ] **NFR-8** AI writes proposals; only a human commits (mandatory review gate).
- [ ] **NFR-9** Responsive from 320px to 1920px+, mobile-first.
- [ ] **NFR-10** Self-hosted variable fonts, Latin subset, preload critical weights.

### 2.3 Out of Scope

- Blog / Latest Updates / writing section (planned for future phase).
- Analytics (none shipped).
- Per-push CI builds (local build + commit model; Actions workflow deleted).
- Backwards compatibility with Handlebars codebase (greenfield redesign).
- Ko-fi embed / Discord community section on homepage (can return on About later).

### 2.4 Testing Strategy

| Dimension     | Decision                                                                                                                                                                    |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Types         | **Smoke only**: `astro build` succeeds · HTML validates · Lighthouse ≥95 · `astro check` passes · no broken internal links · `axe-core` 0 violations on home/projects/about |
| Phase testing | Yes — each implementation phase ends with a build + smoke check                                                                                                             |
| Coverage      | N/A (content site, no business logic)                                                                                                                                       |

---

## 3. Tech Stack

| Category           | Technology                                                                                        | Version            | Justification                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------- | ------------------ | ---------------------------------------------------------------------------------------------- |
| SSG                | Astro                                                                                             | ^5                 | Content Collections + Zod; 0-JS default; `outDir` flexibility; LLM-legible `.astro` components |
| Language           | TypeScript                                                                                        | ^5 (Astro-managed) | Schema validation at build; catches Skill-generated data errors                                |
| Styling            | Tailwind                                                                                          | ^4                 | CSS-first config; pairs with `[data-theme]` tokens; zero-JS                                    |
| Content            | Astro Content Collections                                                                         | built-in           | Markdown + Zod-validated frontmatter                                                           |
| GitHub client      | `@octokit/graphql`                                                                                | ^8                 | Single query for 83 repos; reuses `gh auth`                                                    |
| README parsing     | `unified` / `remark-parse` / `remark-gfm`                                                         | latest             | AST walk; extract hero/tagline/features/install                                                |
| OG images          | `satori` + `@resvg/resvg-js`                                                                      | latest             | ~50ms/image, deterministic, JSX template                                                       |
| Search             | `pagefind`                                                                                        | ^1                 | SSG-native; static index; ~50KB lazy                                                           |
| Animation          | `motion` (Motion One) + CSS + View Transitions API                                                | ^12                | 3.8KB vs 60KB Framer; native transitions                                                       |
| Fonts              | `@fontsource-variable/geist` · `@fontsource-variable/geist-mono` · `@fontsource/instrument-serif` | latest             | MIT; variable; self-hosted; renders `\\` beautifully                                           |
| Icons              | `lucide-astro`                                                                                    | latest             | Tree-shakes; Astro-native                                                                      |
| Image optimization | Astro `<Image>` (uses `sharp`)                                                                    | built-in           | AVIF/WebP at build                                                                             |
| Code quality       | `prettier` + `prettier-plugin-astro` + `astro check`                                              | latest             | Minimal lint surface                                                                           |
| Smoke tests        | `html-validate` + `@lhci/cli` + `axe-core` (via Playwright)                                       | latest             | Matches smoke-only scope                                                                       |
| Runtime            | Node                                                                                              | 20 LTS+            | Astro 5 requires 18.20+; 20 LTS is sane floor                                                  |
| Package manager    | npm                                                                                               | bundled            | Zero migration cost                                                                            |
| Skill runtime      | Claude Code Skill + `gh` CLI                                                                      | current            | Native model, no extra infra                                                                   |

---

## 4. Architecture

### 4.1 Pattern — Pipeline of Pure-Function Stages Orchestrated by Skill

Rejected alternatives:

- **Monolithic Skill** — untestable; state lives in context rather than files.
- **Event-sourced** — dramatic over-engineering for a portfolio regenerator.

Chosen pattern: the Skill's job is orchestration + AI decisions + user dialog. Every content transform lives in a pure Node module under `scripts/` and is runnable standalone for debugging. The Astro site treats pipeline outputs (`data/*.json`, `src/content/projects/*.md`) as its content source with no runtime dependency on the Skill.

### 4.2 System Context Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                   Claude Skill: refresh-portfolio                     │
│   orchestrates phases, writes files, stops for human review          │
└───────┬───────────────────────────────────────────────────────────────┘
        │ calls into
        ▼
┌──────────────────────────────────────────────────────────────────────┐
│                       Pipeline (scripts/*.ts)                         │
│  fetch-github → curate → write-blurbs → render-content → propose-diffs│
│       │              │              │              │                  │
│       ▼              ▼              ▼              ▼                  │
│  ─────────────────── filesystem (sorted JSON, MD) ───────────────    │
│  data/github-snapshot.json   data/ai-cache.json                      │
│  data/build-manifest.json    src/content/projects/*.md               │
└───────────────────────────────┬──────────────────────────────────────┘
                                │   [HUMAN REVIEW GATE]
                                ▼
                        ┌───────────────┐
                        │  astro build  │
                        └───────┬───────┘
                                ▼
                          docs/** → commit (manual)
                                ▼
                     GitHub Pages branch-deploy (main /docs)
                                ▼
                          equilllabs.com
```

### 4.3 Components

| #   | Component                   | Lives at                                    | Responsibility                                                      | Inputs                                      | Outputs                                       |
| --- | --------------------------- | ------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------- | --------------------------------------------- |
| 1   | **refresh-portfolio Skill** | `.claude/skills/refresh-portfolio/SKILL.md` | Orchestrate phases, handle user dialog, enforce review gates        | User prompt (optional guidance), repo state | File writes, console progress, review prompts |
| 2   | **github-fetcher**          | `scripts/fetch-github.ts`                   | GraphQL query for all repos; validate; write snapshot               | GitHub token from `gh auth token`           | `data/github-snapshot.json` (sorted, stable)  |
| 3   | **curator**                 | `scripts/curate.ts`                         | Apply `site/featured.json` overrides; rank; compute featured/hidden | Snapshot + overrides                        | In-memory `CuratedProject[]`                  |
| 4   | **readme-parser**           | `src/lib/readme-parse.ts`                   | AST-walk README for hero/tagline/features/demos/install             | README string                               | Structured extract                            |
| 5   | **blurb-writer**            | `scripts/write-blurbs.ts` + skill prompt    | AI blurbs for changed repos only, grounded in README                | CuratedProject + README                     | Cached blurb text                             |
| 6   | **ai-cache**                | `data/ai-cache.json` (committed)            | Content-hash keyed cache                                            | Hashes                                      | Cached blurbs                                 |
| 7   | **content-renderer**        | `scripts/render-content.ts`                 | Write Zod-validated `.md` to collection                             | Curated + blurbs                            | `src/content/projects/<slug>.md`              |
| 8   | **diff-proposer**           | `scripts/propose-diffs.ts`                  | Emit `.diff` artifacts for hand-authored files; never auto-applies  | Current file + AI suggestion                | `data/proposals/*.diff`                       |
| 9   | **Astro site**              | `src/`                                      | Consume collections; render static HTML                             | `src/content/**`, `public/**`               | `docs/**`                                     |
| 10  | **og-generator**            | `src/pages/og/[slug].png.ts`                | Satori + resvg emit PNG per page at build                           | Page metadata                               | `docs/og/<slug>.png`                          |
| 11  | **build-manifest**          | `data/build-manifest.json`                  | Record inputs→outputs hashes, skill version, model, commit sha      | Pipeline outputs                            | Manifest JSON                                 |

### 4.4 Data Model (Zod schemas, `src/content/config.ts`)

```ts
import { defineCollection, z } from 'astro:content';

const projectSchema = z.object({
  id: z.string(), // "jparkerweb/semantic-chunking"
  name: z.string(),
  slug: z.string(),
  tagline: z.string().max(160),
  description: z.object({ short: z.string(), long: z.string() }),
  banner: z
    .object({
      src: z.string(),
      alt: z.string(),
      source: z.enum(['repo', 'local', 'generated']),
    })
    .optional(),
  topics: z.array(z.string()).default([]),
  category: z.enum(['library', 'tool', 'app', 'demo']),
  theme: z.enum(['nlp', 'infra', 'agents', 'obsidian', 'utilities']).optional(),
  primaryLanguage: z.string().optional(),
  languages: z.array(z.object({ name: z.string(), percent: z.number() })).default([]),
  stars: z.number().int().nonnegative(),
  npm: z.object({ package: z.string(), url: z.string().url() }).optional(),
  links: z.object({
    repo: z.string().url(),
    demo: z.string().url().optional(),
    docs: z.string().url().optional(),
    homepage: z.string().url().optional(),
  }),
  featured: z.boolean().default(false),
  sortOrder: z.number().default(100),
  status: z.enum(['active', 'maintenance', 'archived', 'experimental']).default('active'),
  lastCommit: z.string().datetime().optional(),
  _source: z.object({
    repo: z.string(),
    sha: z.string(),
    fetchedAt: z.string().datetime(),
  }),
});

export const collections = {
  projects: defineCollection({ type: 'content', schema: projectSchema }),
  pages: defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      description: z.string().optional(),
      layout: z.enum(['default', 'wide', 'prose']).default('default'),
      order: z.number().optional(),
      draft: z.boolean().default(false),
    }),
  }),
};
```

Separation of concerns:

- **`data/*`** — pipeline-owned, committed, sorted JSON.
- **`src/content/projects/*.md`** — Skill-generated; overwritten every run.
- **`src/content/pages/*.md`** — hand-authored; Skill may propose diffs but never writes.
- **`site/featured.json`** — hand-authored curation overrides.

### 4.5 API / Routing

| Route                | Source                                                 | Notes                                                       |
| -------------------- | ------------------------------------------------------ | ----------------------------------------------------------- |
| `/`                  | `src/pages/index.astro`                                | Hero (Living Index) + Featured Projects + About teaser      |
| `/projects/`         | `src/pages/projects/index.astro`                       | Full catalog, pill-chip filters, Pagefind search, URL state |
| `/projects/[slug]/`  | `src/pages/projects/[slug].astro` + collection         | Static paths from content collection                        |
| `/about/`            | `src/pages/about.astro` + `src/content/pages/about.md` | Bio, skills, faith/family, timeline                         |
| `/og/[slug].png`     | `src/pages/og/[slug].png.ts`                           | Satori at build                                             |
| `/sitemap-index.xml` | `@astrojs/sitemap`                                     | —                                                           |
| `/robots.txt`        | `public/robots.txt`                                    | —                                                           |
| `/404.html`          | `src/pages/404.astro`                                  | —                                                           |

### 4.6 Cross-Cutting Concerns

**Authentication.** `gh auth token` read lazily via `execSync`. Token never written to disk, logged, or included in errors. Pipeline refuses to run if `gh auth status` fails; emits actionable error. Documented in `AGENTS.md`.

**Error handling.** Pipeline scripts default to dry-run; Skill opts in with `--apply`. Each stage exits with a named error (`ERR_GH_AUTH`, `ERR_GRAPHQL`, `ERR_README_PARSE`, `ERR_SCHEMA_VALIDATE`, `ERR_BUILD`, `ERR_OG_FONT`) and a recovery hint. Zod failures fail fast before writes. Skill wraps each phase with retry/skip/abort dialog.

**Logging.** Structured JSONL to `data/logs/<timestamp>.jsonl` (gitignored); prose + emoji to console. No secrets, no full READMEs, no full prompts.

**Security.** Zero runtime JS processing user input. All GitHub data is public. No `.env`, no tokens in repo. `CNAME` pinned in `public/CNAME`. Pipeline networking limited to `api.github.com` by convention + code review.

**Theming.** Tailwind v4 reads 10 semantic CSS vars from `src/styles/tokens.css`; `[data-theme="dark"|"light"]` on `<html>` swaps palettes. `ThemeScript.astro` is inline in `<head>`. Toggle is a single Astro-native component, no framework.

**Performance posture.** Astro islands only where interactivity demands (`ProjectFilters`, `LivingIndex`). Everything else zero-JS. Astro `<Image>` for AVIF/WebP; `loading="lazy"` below fold. One font preloaded.

### 4.7 Directory Layout (post-implementation)

```
C:\git\eQuill-Labs\
├── AGENTS.md                          ← NEW
├── astro.config.mjs                   ← outDir: './docs'
├── tsconfig.json, package.json
├── .gitignore                         ← node_modules/, .astro/, dist/, data/logs/
│
├── .claude/skills/refresh-portfolio/  ← NEW
│   ├── SKILL.md, prompts/, schemas/, templates/
│
├── scripts/                           ← NEW: pipeline
│   ├── fetch-github.ts, curate.ts, write-blurbs.ts,
│   ├── render-content.ts, propose-diffs.ts
│   └── lib/
│
├── site/featured.json                 ← hand-edited curation
│
├── data/                              ← pipeline outputs (committed)
│   ├── github-snapshot.json, ai-cache.json, build-manifest.json
│   └── proposals/*.diff
│
├── src/
│   ├── content/
│   │   ├── config.ts
│   │   ├── projects/*.md              ← GENERATED
│   │   └── pages/*.md                 ← HAND-AUTHORED
│   ├── components/
│   │   ├── brand/    (Wordmark, QuillMark, SlashGlyph)
│   │   ├── hero/     (LivingIndex)
│   │   ├── projects/ (Card, Grid, Filters, FallbackArt)
│   │   ├── layout/   (Header, Footer, ThemeToggle, ThemeScript)
│   │   └── seo/      (Meta, JsonLd)
│   ├── layouts/      (BaseLayout, ProjectLayout)
│   ├── pages/        (index, projects/**, about, og/[slug].png, sitemap, 404)
│   ├── styles/       (globals.css, tokens.css, themes/{dark,light}.css)
│   └── lib/          (readme-parse, meta, fallback-art)
│
├── public/
│   ├── CNAME, .nojekyll, site.webmanifest
│   ├── brand/, projects/
│   └── robots.txt
│
├── docs/                              ← BUILD OUTPUT (committed, deployed)
│   └── (emitted by astro build)
│
└── assets/                            ← source-of-truth brand (unchanged)
```

---

## 5. Implementation Phases

### Phase I-1: Foundation

**Goal:** Astro scaffold, tokens, brand assets migrated, first empty build.
**Dependencies:** None.

- [ ] Task 1.1 — Create `AGENTS.md` (conventions, `gh auth` requirement, commands, guardrails)
- [ ] Task 1.2 — Astro 5 scaffold; `astro.config.mjs` with `outDir: './docs'`, `site: 'https://www.equilllabs.com'`
- [ ] Task 1.3 — Install stack deps (Phase 4 table); configure `tsconfig.json`, `prettier`
- [ ] Task 1.4 — Tailwind v4 + `src/styles/tokens.css` (placeholder palette) + `ThemeScript.astro`
- [ ] Task 1.5 — Create `public/CNAME`, `public/.nojekyll`; migrate brand assets
- [ ] Task 1.6 — `.gitignore` (keep `docs/` + `data/*.json` committed)
- [ ] Task 1.7 — Smoke: `npm run build` produces empty-shell `docs/index.html` + `CNAME` + `.nojekyll`

### Phase I-2: Content Pipeline

**Goal:** GitHub data fetched, schemas validated, content rendered deterministically.
**Dependencies:** I-1.

- [ ] Task 2.1 — `src/content/config.ts` (Zod schemas for `projects`, `pages`)
- [ ] Task 2.2 — `scripts/fetch-github.ts` (GraphQL, `gh auth token`, sorted snapshot)
- [ ] Task 2.3 — `src/lib/readme-parse.ts` (remark AST walker)
- [ ] Task 2.4 — `site/featured.json` + `scripts/curate.ts`
- [ ] Task 2.5 — `scripts/render-content.ts` (Zod-validate, stable ordering, write `.md`)
- [ ] Task 2.6 — `data/build-manifest.json` writer + diff logic
- [ ] Task 2.7 — `data/ai-cache.json` stub + hash helper
- [ ] Task 2.8 — Smoke: run pipeline (no AI yet), 83 `.md` files written, second run = zero diff

### Phase I-3: Refresh-Portfolio Skill

**Goal:** One-command regeneration with review gate.
**Dependencies:** I-2. Parallelizable with I-4.

- [ ] Task 3.1 — `.claude/skills/refresh-portfolio/SKILL.md` + phase orchestration
- [ ] Task 3.2 — Prompts `01-fetch.md` → `05-review-gate.md` with hallucination-safety rules
- [ ] Task 3.3 — `scripts/write-blurbs.ts` (deterministic, cached by content hash)
- [ ] Task 3.4 — `scripts/propose-diffs.ts` for hero/About
- [ ] Task 3.5 — Review-gate UX: `git diff --stat`, wait for `approved`/`reject`
- [ ] Task 3.6 — Commit-gate UX: print suggested commit message, stop (user commits)
- [ ] Task 3.7 — Smoke: dry-run with mock data; idempotency verified

### Phase I-4: Design-Direction Mockup Gate

**Goal:** User picks one of four directions against real pixels.
**Dependencies:** I-1. Parallelizable with I-3.

- [ ] Task 4.1 — `frontend-design` skill builds `mockups/{ink-ember,vellum-signal,parchment-noir,quill-slash}.html` — each with Hero + Featured 6 + project detail card
- [ ] Task 4.2 — User reviews in browser; picks one
- [ ] Task 4.3 — Chosen palette populates `src/styles/tokens.css` + `themes/*.css`
- [ ] Task 4.4 — Install Fontsource packages for chosen direction; preload wired in `BaseLayout`
- [ ] Task 4.5 — Delete `mockups/`

### Phase I-5: Core Site Build

**Goal:** All pages render from content; brand + layout + hero + catalog + about.
**Dependencies:** I-2 + I-4.

- [ ] Task 5.1 — Brand components: `Wordmark`, `QuillMark`, `SlashGlyph`
- [ ] Task 5.2 — Layout: `BaseLayout`, `ProjectLayout`, `SiteHeader`, `SiteFooter`, `ThemeToggle`
- [ ] Task 5.3 — Home (`/`): Hero (`LivingIndex` marquee) + Featured Projects + About teaser
- [ ] Task 5.4 — Catalog (`/projects/`): `ProjectGrid` + `ProjectFilters` island (pill chips + URL sync)
- [ ] Task 5.5 — Detail (`/projects/[slug]/`): dynamic from collection; `ProjectFallbackArt` when banner absent
- [ ] Task 5.6 — About (`/about/`): bio + faith/family + timeline
- [ ] Task 5.7 — `404.astro`
- [ ] Task 5.8 — Smoke: `astro build` + `astro check` pass; tagline, wordmark, quill present

### Phase I-6: Enhancement

**Goal:** OG images, search, animations, SEO.
**Dependencies:** I-5.

- [ ] Task 6.1 — OG generator (Satori + resvg) at `src/pages/og/[slug].png.ts`
- [ ] Task 6.2 — Pagefind post-build hook; `ProjectFilters` consumes
- [ ] Task 6.3 — Motion One scroll-reveals (`data-reveal`) + CSS gradient-border hover + View Transitions section nav; `prefers-reduced-motion` gated
- [ ] Task 6.4 — Signature hero moment per chosen direction
- [ ] Task 6.5 — `<Meta>` + `<JsonLd>` + `@astrojs/sitemap` + `robots.txt`
- [ ] Task 6.6 — Smoke: Lighthouse ≥98 all categories; OG PNG per page

### Phase I-7: Migration & Deployment

**Goal:** Old code removed; new site live at `equilllabs.com`.
**Dependencies:** I-5 (I-6 recommended).

- [ ] Task 7.1 — Delete: `build.js`, `config.js`, `src/templates/**`, `src/static/**`, `pages/**`, `.github/workflows/static.yml`; remove old npm deps (`handlebars`, `nodemon`, `serve`)
- [ ] Task 7.2 — Full build → `docs/**` with `CNAME` + `.nojekyll`
- [ ] Task 7.3 — GitHub repo Settings → Pages → source: **Deploy from branch `main` / `/docs`**
- [ ] Task 7.4 — Commit + push; verify `https://www.equilllabs.com`
- [ ] Task 7.5 — HTTPS + CNAME + redirects verified

### Phase I-8: Polish & Verification

**Goal:** Meet NFRs; launch gates pass.
**Dependencies:** I-7.

- [ ] Task 8.1 — `html-validate` across `docs/**`
- [ ] Task 8.2 — `axe-core` via Playwright: 0 violations on home/projects/about
- [ ] Task 8.3 — Lighthouse CI (`.lighthouserc.json` thresholds)
- [ ] Task 8.4 — Manual responsive sweep: 320 / 768 / 1280 / 1920
- [ ] Task 8.5 — Social-preview check (Twitter + LinkedIn card validators)
- [ ] Task 8.6 — End-to-end Skill dry-run with real GitHub data

---

## 6. Risks and Mitigations

| Risk                                                  | Likelihood | Impact   | Mitigation                                                                                                           |
| ----------------------------------------------------- | ---------- | -------- | -------------------------------------------------------------------------------------------------------------------- |
| AI hallucinates project features during blurb writing | Medium     | **High** | Quote-or-omit rule in prompt; post-generation grep of blurb noun-phrases against README; mandatory human review gate |
| Design-direction regret after implementation starts   | Medium     | Medium   | 4-way mockup gate in I-4 before building components                                                                  |
| `gh` CLI auth expired or missing `repo` scope         | Medium     | Low      | Pre-flight `gh auth status` check; actionable error                                                                  |
| Tailwind v4 config changes mid-build (v4 recent)      | Low        | Medium   | Pin exact version; v3 fallback with minor CSS rewrite                                                                |
| Committed `/docs` artifacts cause noisy PRs           | Medium     | Low      | Stable Astro output; sorted JSON; content-hash skip-write                                                            |
| Custom domain breaks after Pages source switch        | Low        | **High** | `CNAME` stays in `public/`; DNS unchanged; instant revert possible                                                   |
| README parser fails on atypical repos                 | Medium     | Low      | Graceful degradation to `description` field; null-blurb fallback                                                     |
| Satori font loading breaks OG generation              | Low        | Low      | Self-host; load as buffers; unit-test one OG at build                                                                |
| Pagefind misses content / broken search               | Low        | Low      | Verify index + sample queries at I-6 smoke                                                                           |
| Lighthouse variance fails CI intermittently           | Medium     | Low      | LHCI configured with 3 runs, median reporting; threshold 95 in CI not 98                                             |
| Skill context explosion on 83 READMEs                 | Medium     | Medium   | Only invoke AI for changed repos; never send full READMEs — only extracted fields                                    |
| User guidance conflicts with repo metadata            | Low        | Medium   | Source-of-truth hierarchy in skill prompt; AI can reorder/filter/tone, never invent                                  |

---

## 7. Success Criteria

- [ ] Site serves at `https://www.equilllabs.com` via GitHub Pages branch-deploy from `main /docs`
- [ ] `.github/workflows/static.yml` removed; no Actions runs on push
- [ ] Home page renders Hero (Living Index) + Featured Projects + About teaser
- [ ] `/projects/` lists all non-archived, non-fork repos from `jparkerweb`; 6+ featured
- [ ] Pill-chip filters (Theme, Language, Type) + Pagefind search + URL state sync
- [ ] Every project has a detail page at `/projects/<slug>/`
- [ ] `/about/` contains bio + faith/family section (relocated from home) + timeline
- [ ] Tagline _"Building tools to enrich our digital lives"_ present verbatim
- [ ] `eQui\\ Labs` wordmark rendered with `\\` styled per chosen direction
- [ ] Quill mark present as corner anchor
- [ ] Dark/light/system theme toggle works with no FOUC
- [ ] Per-page OG images at `/og/<slug>.png`, visible in Twitter/LinkedIn previews
- [ ] JSON-LD validates in Google Rich Results test
- [ ] `sitemap-index.xml` + `robots.txt` served
- [ ] Lighthouse ≥98 across Perf/A11y/BP/SEO on home, catalog, one detail, about
- [ ] WCAG AA; 0 `axe-core` violations
- [ ] `prefers-reduced-motion` honored
- [ ] `/refresh-portfolio` runs end-to-end: fetch → propose → review → build → commit-stop
- [ ] Rerunning Skill with zero GitHub changes yields clean `git status`
- [ ] `AGENTS.md` documents `gh auth`, commands, guardrails
- [ ] All Handlebars code and legacy `pages/` artifacts removed
- [ ] Node 20 LTS verified as minimum runtime

---

## 8. Open Questions

Deferred to implementation (not blockers for plan approval):

- Final pick among 4 design directions — gated into Phase I-4 via `frontend-design` skill.
- Optional React-island use for a component library (shadcn) — default is pure Astro; revisit only if a specific UI need surfaces during I-5.
- Future: RSS feed, blog, talks/writing section — explicitly out of scope for v2.

---

## 9. Assumptions

- **Windows host** (confirmed via `C:\git\eQuill-Labs`, platform `win32`). All tooling is cross-platform; `gh` CLI required. _Impact if wrong:_ none — same stack on macOS/Linux.
- **`gh` CLI authenticated with `repo` scope.** Verified during research (Justin's profile fetch worked). _Impact if wrong:_ pipeline first-run fails fast with actionable error pointing at `gh auth login`.
- **Geist font family licensing acceptable** (MIT, self-host via Fontsource). _Impact if wrong:_ swap for Manrope/Inter; design direction typography adjusts.
- **Justin can toggle GitHub Pages source** (branch-deploy from `main /docs`) in repo settings. _Impact if wrong:_ fall back to keeping Actions workflow (Option A from Phase 2).
- **No timeline pressure** — quality-first pacing explicitly confirmed. _Impact if wrong:_ phases I-3 and I-4 can parallelize; I-6 enhancements can defer to v2.1.

---

## 10. Research Appendix

Full research from 20 parallel subagents in Phase 1. Decisions in sections 1-9 above are sourced from these findings.

### 10.1 Justin's GitHub Profile (`jparkerweb`)

- **83 public repos**; 6 pinned: `pixel-banner` (190★), `semantic-chunking` (137★), `mcp-sqlite` (96★), `bedrock-wrapper`, `fast-topic-analysis`, `llm-distillery`.
- **5 thematic clusters**: Semantic NLP/Embeddings · LLM Infra/Proxies · AI Dev Tooling/Agents/MCP · Obsidian Ecosystem · Doc/Media Utilities.
- READMEs consistent: emoji-prefixed H1 · 1-line tagline · hero `.readme/*.jpg` · "Maintained by eQuill Labs" block.
- Languages: ~55+ JS, secondary CSS/HTML/TS/PowerShell, Go experiment (`shrinkray`).

### 10.2 Design Directions (4 options for Phase I-4 mockup gate)

**Option 1 — Ink & Ember** (warm editorial, ember-orange accent)

- Dark: bg `#14110F` · surface `#1E1A17` · border `#2E2824` · text `#EDE6DB` · muted `#968B7C` · accent `#E8793A`
- Light: bg `#FAF6EF` · surface `#F2ECE0` · border `#DDD3C2` · text `#1C1815` · muted `#6B5F52` · accent `#C85C1F`
- Type: Fraunces / Inter Tight / Commit Mono

**Option 2 — Vellum Signal** (research lab, phosphor mint)

- Dark: bg `#0F1114` · surface `#181B20` · border `#262A31` · text `#E4E6EA` · muted `#8B9099` · accent `#7DF9C4`
- Light: bg `#F6F5F1` · surface `#ECEAE3` · border `#D4D1C7` · text `#14161A` · muted `#5A6069` · accent `#0FA971`
- Type: Instrument Serif / Geist Sans / Geist Mono

**Option 3 — Parchment Noir** (monochrome editorial, aged brass)

- Dark: bg `#0E0E10` · surface `#17171A` · border `#26262B` · text `#F0EDE6` · muted `#87857E` · accent `#C9A86A`
- Light: bg `#F4F1EA` · surface `#EBE7DD` · border `#CFC8B8` · text `#0E0E10` · muted `#6A6860` · accent `#8C6A2B`
- Type: high-craft serif + sans

**Option 4 — The Quill & Slash** (brand-native; preserves eQuill identity)

- Dark: bg `#0C0E14` · surface `#141822` · border `#232838` · text `#E8ECF4` · muted `#7A8499`
- Light: bg `#F7F5EF` · surface `#EDE9DE` · border `#D6D0C0` · text `#0E121A` · muted `#5A6275`
- Accent: cyan→indigo gradient `#00D4FF → #5B4FE6 → #090979` (tuned), reserved for `\\` glyphs, heading underlines, focus rings, link decorations
- Type: Instrument Serif (display italic) / Geist Sans / Geist Mono
- Signature: `\\` as dividers + list glyphs + hover underlines; quill mark as corner anchor; wordmark reveal animation

### 10.3 Hero Concept — "The Living Index"

Left 40% anchored name/tagline/CTAs; right 60% infinite vertical marquee of real repo cards (name, stars, language dot, last-commit) auto-streaming, pausable on hover. Degrades to static grid on mobile / `prefers-reduced-motion`.

### 10.4 Catalog UX

Featured 6 (larger cards, richer hover) + filtered uniform grid (3→2→1 col). Pill-chip filters (Theme, Language, Type) multi-select + Pagefind search + URL sync. Card anatomy: banner · name · line-clamped description · type/language chip · stars. Empty-banner fallback: deterministic gradient + monogram seeded by slug hash. 150-200ms debounce on search.

### 10.5 Theme System

CSS variables on `:root[data-theme="dark"|"light"]` + Tailwind v4 consumes tokens. 10 semantic tokens: `bg, surface-1, surface-2, border, text-1, text-2, text-muted, accent, accent-contrast, focus-ring`. Three-state preference (system/dark/light); inline FOUC-prevention script as first child of `<head>`.

### 10.6 Animation Budget

CSS-first for 80% (transitions, keyframes, View Transitions API). Motion One (3.8KB) for scroll-reveals + springs. Three signature moments only. Hard cap: ≤10KB initial JS, ≤25KB lazy. `prefers-reduced-motion` throughout.

### 10.7 Performance Budget (NFR backing)

- Lighthouse 98+ (hard PR gate at 95 due to variance)
- LCP <2.0s · INP <150ms · CLS <0.05 (75th pct mobile 4G)
- JS ≤50KB/route; realistic 10-25KB on Astro
- Images: AVIF primary, WebP fallback, JPEG last; `srcset` 400/800/1200/1600w; dominant-color on cards, LQIP on hero
- Fonts: one variable font preload; `font-display: swap`
- CSS <30KB; critical inlined <14KB

### 10.8 Accessibility

WCAG AA contrast 4.5:1. Focus rings `:focus-visible` 2px+ at 3:1. Skip-link first focusable; semantic landmarks; `aria-label` on icon-only buttons. Keyboard nav on cards + filter chips (arrow keys). Tested via `axe-core` (Playwright) + Lighthouse CI on PR.

### 10.9 Idempotency Contract

Snapshot committed (sorted keys). AI cache committed (content-hash keyed, `temperature:0`, model pinned). Change-set: diff new vs committed snapshot → only regenerate affected. Manifest records skill_version, ai_model, input hashes, output hashes, commit SHA. **Contract:** rerun with no GitHub changes → clean `git status`; two-repo update → exactly those two `.md` files + index + snapshot + manifest change.

### 10.10 Migration Disposition

| Current artifact                                     | Action                                     |
| ---------------------------------------------------- | ------------------------------------------ |
| `build.js`, `config.js`, `package.json` (Handlebars) | Delete / rewrite                           |
| `src/templates/**`                                   | Delete                                     |
| `src/static/css/**`, `src/static/js/**`              | Delete                                     |
| `src/static/CNAME`                                   | Move to `public/CNAME`                     |
| `src/static/images/logo*`, `quill.svg`, favicons     | Migrate to `public/brand/`                 |
| `src/static/images/projects/*.{jpg,gif}`             | Migrate to `public/projects/` as fallbacks |
| `assets/**`                                          | Keep — brand source of truth               |
| `pages/**`                                           | Delete (replaced by `docs/`)               |
| `.github/workflows/static.yml`                       | Delete                                     |

---

## Planning Metrics

<!-- METRICS_JSON {"confidence": 98, "clarification_rounds": 0, "functional_requirements_count": 13, "non_functional_requirements_count": 10, "risk_count": 12, "phase_count": 8, "verification_gaps_found": 0, "confidence_breakdown": {"requirements": 24, "feasibility": 25, "integration": 25, "risk": 24}} -->

confidence: 98
clarification_rounds: 0
functional_requirements_count: 13
non_functional_requirements_count: 10
risk_count: 12
phase_count: 8
verification_gaps_found: 0
requirements_score: 24/25
feasibility_score: 25/25
integration_score: 25/25
risk_score: 24/25
