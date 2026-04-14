# Phase 2: Content Pipeline

**Status:** Not Started
**Estimated Tasks:** 15
**Milestone:** 1 — Foundation + Content
**Dependencies:** Phase 1 complete

---

## Overview

Build the pure-function Node pipeline that turns GitHub repo data into validated Astro content collection files. This phase stops short of AI blurbs (those live in Phase 3's Skill) — render uses `description` fallbacks. Outcome: running `npm run refresh:render` produces 83 `.md` files in `src/content/projects/` that the Astro site can consume.

## Prerequisites

- Phase 1 complete (Astro scaffold, TypeScript, `public/` populated)
- `gh` CLI authenticated: `gh auth status` reports active session with `repo` scope — if not, run `gh auth login -s repo`
- Network access to `api.github.com`
- Knowledge of the repo owner: `jparkerweb`

## Tasks

### Content Collection Schemas

- [ ] **Task 2.1:** Create `src/content/config.ts` defining two Astro collections via `defineCollection`. `projects` collection uses Zod schema matching the interface in PLAN-DRAFT §4.4: `id`, `name`, `slug`, `tagline` (max 160), `description` ({short, long}), optional `banner` ({src, alt, source: enum['repo','local','generated']}), `topics[]`, `category` (enum['library','tool','app','demo']), optional `theme` (enum['nlp','infra','agents','obsidian','utilities']), optional `primaryLanguage`, `languages[]` ({name, percent}), `stars`, optional `npm` ({package, url}), `links` ({repo, demo?, docs?, homepage?}), `featured` default false, `sortOrder` default 100, `status` enum default 'active', optional `lastCommit` (ISO datetime), `_source` ({repo, sha, fetchedAt}). `pages` collection uses simpler schema: `title`, `description?`, `layout` enum default 'default', `order?`, `draft` default false. Export `collections = { projects, pages }`.

### Pipeline Dependencies

- [ ] **Task 2.2:** Install pipeline deps: `npm install @octokit/graphql unified remark-parse remark-gfm mdast-util-to-string gray-matter`. Install types: `npm install -D @types/node`. Verify all land in `dependencies`/`devDependencies` correctly.

### Shared Utilities

- [ ] **Task 2.3:** Create `scripts/lib/sort-keys.ts` exporting `sortKeysDeep<T>(obj: T): T` that recursively sorts object keys alphabetically (arrays preserved order-wise, objects re-created with sorted keys). Also export `stableStringify(obj, indent = 2)` that calls `JSON.stringify(sortKeysDeep(obj), null, indent)`. Used by all pipeline writers to ensure stable diffs.
- [ ] **Task 2.4:** Create `scripts/lib/hash.ts` exporting `contentHash(...parts: string[]): string` that concatenates parts with `\n--\n` separator and returns a `sha256` hex digest via `node:crypto`. Used for AI cache keys and change-set detection.
- [ ] **Task 2.5:** Create `scripts/lib/graphql-queries.ts` exporting const `USER_REPOS_QUERY` — the GraphQL query from PLAN-DRAFT §6.3 fetching user profile + repositories with pagination (first 100, cursor), selecting `name, description, url, homepageUrl, stargazerCount, forkCount, primaryLanguage {name color}, languages(first:10) {edges {size node {name}} totalSize}, repositoryTopics(first:20) {nodes {topic {name}}}, licenseInfo {spdxId}, pushedAt, updatedAt, createdAt, issues(states:OPEN) {totalCount}, isArchived, isFork, readme: object(expression:"HEAD:README.md") { ... on Blob { text } }`. Export as a single string constant.

### GitHub Fetcher

- [ ] **Task 2.6:** Create `scripts/fetch-github.ts`. Responsibilities in order: (a) shell out `gh auth token` via `execSync`, trim, fail with `ERR_GH_AUTH` and message `"Run: gh auth login -s repo"` if empty; (b) instantiate `graphql.defaults({ headers: { authorization: "token ${token}" } })`; (c) paginate the query with `login: 'jparkerweb'`, following `pageInfo.endCursor` until `hasNextPage === false`; (d) aggregate all `nodes` into one array; (e) filter: `isArchived === false && isFork === false`; (f) strip volatile timestamps from response to keep snapshots stable (use `pushedAt` not fetch time); (g) shape to `{ fetchedAt: new Date().toISOString(), profile: {...}, repos: [...] }`; (h) write `data/github-snapshot.json` via `stableStringify`. Accept flag `--dry-run` that prints count and first 3 repo names without writing. Use process.exit codes: 0 success, 1 `ERR_GH_AUTH`, 2 `ERR_GRAPHQL`.

### README Parser

- [ ] **Task 2.7:** Create `src/lib/readme-parse.ts` exporting `parseReadme(markdown: string): ReadmeExtract` where `ReadmeExtract = { hero?: string; tagline?: string; features: string[]; demos: Array<{label: string; url: string}>; install?: string }`. Use `unified().use(remarkParse).use(remarkGfm).parse(markdown)` to get AST. Walk the AST: first `image` node with alt containing "banner" OR first image in document → `hero`; first `paragraph` after H1 → `tagline` (via `mdast-util-to-string`); first `heading` matching `/features|why|highlights/i` followed by a `list` → extract list items as `features[]`; `link` nodes with text/url matching `/demo|live|playground|try it/i` → `demos[]`; first fenced `code` block whose first line matches `/^(npm|pnpm|yarn|bun|npx)\s+/` → `install`. Return partial object when fields absent. Export types.

### Curation

- [ ] **Task 2.8:** Create `site/featured.json` with initial content that pre-populates the blocklist with obviously-personal repos so they never publish. Content:
  ```json
  {
    "featured": [
      "pixel-banner",
      "semantic-chunking",
      "mcp-sqlite",
      "bedrock-wrapper",
      "fast-topic-analysis",
      "llm-distillery"
    ],
    "pinned": [],
    "hidden": [
      "kdm-cards",
      "card-generator-sob",
      "clover-quilt-designer",
      "wdw-adr-checker",
      "caps-left-right",
      "*-personal",
      "dotfiles*"
    ],
    "hideTopics": ["not-portfolio", "private-project"],
    "order": {}
  }
  ```
  Field semantics:
  - `hidden[]` — repo names to exclude. Supports glob patterns via `*` wildcard (e.g. `"dotfiles*"` matches `dotfiles`, `dotfiles-mac`, `dotfiles-wsl`; `"*-private"` matches any repo ending in `-private`). Exact string otherwise.
  - `hideTopics[]` — any repo tagged with one of these GitHub topics is excluded. Tag a repo once on github.com → stays hidden forever without editing this file.
    Also create `site/featured.schema.json` (JSON Schema Draft-07) documenting all five fields with descriptions and examples; reference it from `AGENTS.md`. JSON files cannot contain comments, so the schema file is the only documentation surface.
- [ ] **Task 2.9:** Create `scripts/curate.ts` exporting `curate(snapshot, overrides): CuratedProject[]`. Also add helper `scripts/lib/match-pattern.ts` exporting `matchesAny(name: string, patterns: string[]): boolean` — for each pattern, if it contains `*`, escape regex metachars except `*`, replace `*` with `.*`, anchor with `^`/`$`, and test; else strict equality. No external dependency needed. Responsibilities of `curate`: (a) start from `snapshot.repos`; (b) **exclude** any repo where `matchesAny(repo.name, overrides.hidden)` is true OR any of `repo.repositoryTopics` appears in `overrides.hideTopics`; (c) set `featured: true` for names in `overrides.featured` OR topics include `equill-featured`; (d) assign `sortOrder` from `overrides.order[name]` if present, else featured ranks first by `overrides.featured` index, else by `stargazerCount` descending; (e) derive `category` from topics/language heuristics: has `npm` keyword → library; is Obsidian plugin → tool; repo name endsWith `-app` or has demo URL → app; else demo; (f) derive `theme` from topic matching: `embeddings|chunking|nlp|semantic` → 'nlp', `bedrock|proxy|wrapper|llm` → 'infra', `mcp|agent|assistant` → 'agents', `obsidian` → 'obsidian', else 'utilities'; (g) return sorted `CuratedProject[]`. Print a one-line "excluded N repos (hidden: X, hideTopics: Y, archived: Z, fork: W)" summary at end so the user can audit what got dropped. Export standalone so tests can drive it.

### Change-Set Detection

- [ ] **Task 2.10:** Create `scripts/lib/change-set.ts` exporting `computeChangeSet(newSnapshot, previousManifest): { added: string[]; modified: string[]; removed: string[]; unchanged: string[] }`. For each repo in new snapshot, compute `contentHash(description, JSON.stringify(topics), readme?.text ?? '', pushedAt)`. Compare against `previousManifest.projects[slug].contentHash`. Classify accordingly. Used by Phase 3 to decide which repos need fresh AI blurbs.

### Content Renderer

- [ ] **Task 2.11:** Create `scripts/render-content.ts`. Responsibilities: (a) read `data/github-snapshot.json` (fail with `ERR_NO_SNAPSHOT` if missing, hint: "Run npm run refresh:fetch first"); (b) read `site/featured.json`; (c) call `curate()`; (d) for each `CuratedProject`, call `parseReadme()` on the README text; (e) build a Zod-validated `Project` object; (f) serialize as Markdown file with YAML frontmatter + empty body (long description stays in frontmatter for now — Phase 3 fills in AI blurb); (g) write to `src/content/projects/<slug>.md` via atomic temp-write-rename; (h) Zod-validate via the schema from Task 2.1 before writing — any failure aborts the entire run with `ERR_SCHEMA_VALIDATE` listing all issues; (i) skip-write if file exists and content is byte-identical (idempotency); (j) print summary line: `Rendered N, skipped M (unchanged), removed R obsolete`; (k) delete any `.md` in `src/content/projects/` not in the current curated set.

### Build Manifest

- [ ] **Task 2.12:** Create `scripts/build-manifest.ts` exporting `writeManifest()`. Reads the current snapshot + curated list; writes `data/build-manifest.json` with shape: `{ buildId: ULID, builtAt: ISO, generator: { name: 'refresh-portfolio', version: '1.0.0' }, skillVersion: null /* set by Phase 3 */, aiModel: null /* set by Phase 3 */, sources: [{ repo, sha, fetchedAt }], projects: [{ slug, contentHash, hasOverride }], inputsHash }`. Sort all arrays/keys for stable diffs.

### Data Directory Scaffold

- [ ] **Task 2.13:** Create `data/` directory with initial contents: empty `data/github-snapshot.json` (replaced on first fetch — but must exist so `.gitkeep`-style invariant holds: commit an empty `{}`), empty object `data/ai-cache.json` with `{}`, empty `data/build-manifest.json` with `{}`, and directory `data/proposals/` with `.gitkeep`. Update `.gitignore` verified in Phase 1: `data/logs/` is ignored, but `data/*.json` and `data/proposals/` are tracked.

### NPM Scripts

- [ ] **Task 2.14:** Add to `package.json` `scripts`: `"refresh:fetch": "tsx scripts/fetch-github.ts"`, `"refresh:render": "tsx scripts/render-content.ts"`, `"refresh:all": "npm run refresh:fetch && npm run refresh:render"`. Install `tsx` as devDep: `npm install -D tsx`. Note: the Skill in Phase 3 orchestrates these but users can run them standalone for debugging.

### Smoke

- [ ] **Task 2.15:** Run end-to-end: `npm run refresh:fetch` (verifies `gh auth` and writes snapshot), then `npm run refresh:render` (writes `.md` files). Verify: (a) `data/github-snapshot.json` contains ~83 repos with non-null README text on most; (b) `src/content/projects/` contains a `.md` file per non-archived non-fork repo, 6+ with `featured: true`; (c) `astro check` passes (schemas validate); (d) run `npm run refresh:all` a SECOND time — verify `git status` reports zero changes (idempotency contract). If any file changed on second run, investigate non-determinism before proceeding.

## Phase Testing

- [ ] **Smoke 2.A:** First-run pipeline produces snapshot + 60+ content files + manifest.
- [ ] **Smoke 2.B:** Second-run pipeline on unchanged GitHub state produces zero-byte git diff.
- [ ] **Smoke 2.C:** `npm run check` validates all generated frontmatter against Zod schemas.
- [ ] **Smoke 2.D:** Manual inspection: pick 3 random `src/content/projects/*.md` files and verify they correspond to real `jparkerweb` repos with accurate stars, topics, language.
- [ ] **Smoke 2.E:** Intentionally break `gh auth` (run `gh auth logout`, then `gh auth login` without `repo` scope) and verify `npm run refresh:fetch` exits with `ERR_GH_AUTH` and the hint message. Restore auth before proceeding.

## Acceptance Criteria

- `data/github-snapshot.json` exists, is sorted-JSON, contains `fetchedAt`, `profile`, and `repos[]`.
- `src/content/projects/` contains one `.md` per non-archived, non-fork public repo from `jparkerweb`.
- `site/featured.json` lists the 6 baseline featured repos.
- Zod schemas reject malformed content; pipeline aborts before writes.
- Idempotency contract holds: re-running pipeline with no GitHub changes produces no git diff.
- `gh auth token` is the sole authentication path; no PAT or `.env` introduced.
- All pipeline scripts are runnable standalone via `tsx`.
- README parser extracts hero / tagline / features / install from a typical `jparkerweb` README.
- Build manifest records input hashes for future change-set detection.

## Notes

- **Volatile field handling:** `stargazerCount` drifts daily. Include it in content but exclude from `contentHash` so star changes alone don't trigger AI rewrites. Re-read PLAN-DRAFT §10.9.
- **ULID** for `buildId` — install `ulid` or generate inline with `crypto.randomUUID()` (ULID preferred for sortability but not strictly required).
- **Atomic writes:** write to `<file>.tmp`, then `fs.renameSync`. Prevents partial-state corruption.
- **Category heuristics** in Task 2.9 are best-effort — users override via `site/featured.json`'s `order` map or by adding topics to repos. Don't tune these forever; good-enough is fine.
- **Curation layers — use the lightest tool that works.** The three exclusion mechanisms have different maintenance costs, in order of preference: (1) **GitHub topic** (`not-portfolio` or `private-project`) — zero-config once tagged; best for one-off exclusions; the repo's owner is the source of truth. (2) **Glob in `hidden`** (e.g., `"kdm-*"`) — best for families of hobby repos that share a prefix. (3) **Exact name in `hidden`** — fallback for one-offs you don't want to tag on GitHub. Featured/rank tuning stays in `featured` + `order` as before.
- **Audit visibility:** the exclusion summary line from Task 2.9 is the user's check that nothing unexpected was dropped. If that count looks wrong, the `featured.json` is wrong — not the fetcher.
- **README parsing failure:** degrade gracefully per PLAN-DRAFT risk table — use GitHub `description` as fallback tagline; banner falls through to `public/projects/<slug>.jpg` then to deterministic fallback art (Phase 5 Task 5.9).
- Leave long-form descriptions as empty strings for now — Phase 3's `write-blurbs.ts` fills them.

## Phase Completion Summary

_(Filled after implementation)_

- **Completion date:**
- **Implementer:**
- **Commits:**
- **What was done:**
- **Files changed:**
- **Issues encountered:**
- **Deviations from plan:**
