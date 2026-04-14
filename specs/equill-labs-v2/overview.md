# eQuill Labs v2 — Documentation Overview

**Created:** 2026-04-13
**Source:** [PLAN-DRAFT-20260412.md](./PLAN-DRAFT-20260412.md)
**Conversation Log:** [PLAN-CONVERSATION-20260412.md](./PLAN-CONVERSATION-20260412.md)
**Status:** Not Started

---

## Summary

Complete ground-up redesign of the eQuill Labs website, powered by a Claude Code Skill (`refresh-portfolio`) that reads Justin Parker's (`jparkerweb`) public GitHub repositories and regenerates the site's content layer on demand. The Astro-based static site becomes a first-class showcase of an AI engineer's prolific open-source output. The Skill makes keeping the site current a one-command operation with a mandatory human review gate before commit. Build output deploys to GitHub Pages via branch-deploy from `/docs`, preserving the `equilllabs.com` custom domain.

---

## Tech Stack

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

## Architecture

### Pattern

**Pipeline of pure-function stages orchestrated by a Claude Skill.** The Skill handles phase orchestration, AI decisions, and user dialog. Every content transform is a pure Node module under `scripts/`, runnable standalone for debugging. The Astro site treats pipeline outputs (`data/*.json`, `src/content/projects/*.md`) as its content source with no runtime dependency on the Skill.

### Component Overview

| #   | Component               | Lives at                                    | Responsibility                                                      |
| --- | ----------------------- | ------------------------------------------- | ------------------------------------------------------------------- |
| 1   | refresh-portfolio Skill | `.claude/skills/refresh-portfolio/SKILL.md` | Orchestrate phases, handle user dialog, enforce review gates        |
| 2   | github-fetcher          | `scripts/fetch-github.ts`                   | GraphQL query for all repos; validate; write snapshot               |
| 3   | curator                 | `scripts/curate.ts`                         | Apply `site/featured.json` overrides; rank; compute featured/hidden |
| 4   | readme-parser           | `src/lib/readme-parse.ts`                   | AST-walk README for hero/tagline/features/demos/install             |
| 5   | blurb-writer            | `scripts/write-blurbs.ts` + skill prompt    | AI blurbs for changed repos only, grounded in README                |
| 6   | ai-cache                | `data/ai-cache.json` (committed)            | Content-hash keyed cache                                            |
| 7   | content-renderer        | `scripts/render-content.ts`                 | Write Zod-validated `.md` to collection                             |
| 8   | diff-proposer           | `scripts/propose-diffs.ts`                  | Emit `.diff` artifacts for hand-authored files; never auto-applies  |
| 9   | Astro site              | `src/`                                      | Consume collections; render static HTML                             |
| 10  | og-generator            | `src/pages/og/[slug].png.ts`                | Satori + resvg emit PNG per page at build                           |
| 11  | build-manifest          | `data/build-manifest.json`                  | Record inputs→outputs hashes, skill version, model, commit sha      |

---

## Risks and Mitigations

| Risk                                                  | Likelihood | Impact | Mitigation                                                                                                           |
| ----------------------------------------------------- | ---------- | ------ | -------------------------------------------------------------------------------------------------------------------- |
| AI hallucinates project features during blurb writing | Medium     | High   | Quote-or-omit rule in prompt; post-generation grep of blurb noun-phrases against README; mandatory human review gate |
| Design-direction regret after implementation starts   | Medium     | Medium | 4-way mockup gate in Phase 4 before building components                                                              |
| `gh` CLI auth expired or missing `repo` scope         | Medium     | Low    | Pre-flight `gh auth status` check; actionable error                                                                  |
| Tailwind v4 config changes mid-build (v4 recent)      | Low        | Medium | Pin exact version; v3 fallback with minor CSS rewrite                                                                |
| Committed `/docs` artifacts cause noisy PRs           | Medium     | Low    | Stable Astro output; sorted JSON; content-hash skip-write                                                            |
| Custom domain breaks after Pages source switch        | Low        | High   | `CNAME` stays in `public/`; DNS unchanged; instant revert possible                                                   |
| README parser fails on atypical repos                 | Medium     | Low    | Graceful degradation to `description` field; null-blurb fallback                                                     |
| Satori font loading breaks OG generation              | Low        | Low    | Self-host; load as buffers; unit-test one OG at build                                                                |
| Pagefind misses content / broken search               | Low        | Low    | Verify index + sample queries at Phase 6 smoke                                                                       |
| Lighthouse variance fails CI intermittently           | Medium     | Low    | LHCI configured with 3 runs, median reporting; threshold 95 in CI not 98                                             |
| Skill context explosion on 83 READMEs                 | Medium     | Medium | Only invoke AI for changed repos; never send full READMEs — only extracted fields                                    |
| User guidance conflicts with repo metadata            | Low        | Medium | Source-of-truth hierarchy in skill prompt; AI can reorder/filter/tone, never invent                                  |

---

## Success Criteria

- Site serves at `https://www.equilllabs.com` via GitHub Pages branch-deploy from `main /docs`
- `.github/workflows/static.yml` removed; no Actions runs on push
- Home page renders Hero (Living Index) + Featured Projects + About teaser
- `/projects/` lists all non-archived, non-fork repos from `jparkerweb`; 6+ featured
- Pill-chip filters (Theme, Language, Type) + Pagefind search + URL state sync
- Every project has a detail page at `/projects/<slug>/`
- `/about/` contains bio + faith/family section (relocated from home) + timeline
- Tagline _"Building tools to enrich our digital lives"_ present verbatim
- `eQui\\ Labs` wordmark rendered with `\\` styled per chosen direction
- Quill mark present as corner anchor
- Dark/light/system theme toggle works with no FOUC
- Per-page OG images at `/og/<slug>.png`, visible in Twitter/LinkedIn previews
- JSON-LD validates in Google Rich Results test
- `sitemap-index.xml` + `robots.txt` served
- Lighthouse ≥98 across Perf/A11y/BP/SEO on home, catalog, one detail, about
- WCAG AA; 0 `axe-core` violations
- `prefers-reduced-motion` honored
- `/refresh-portfolio` runs end-to-end: fetch → propose → review → build → commit-stop
- Rerunning Skill with zero GitHub changes yields clean `git status`
- `AGENTS.md` documents `gh auth`, commands, guardrails
- All Handlebars code and legacy `pages/` artifacts removed
- Node 20 LTS verified as minimum runtime

---

## Phase Checklist

**Milestone 1: Foundation + Content**

- [x] [Phase 1: Foundation](./phase-1.md) _(18 tasks — Milestone 1)_
- [x] [Phase 2: Content Pipeline](./phase-2.md) _(15 tasks — Milestone 1)_

**Milestone 2: Skill + Design**

- [x] [Phase 3: Refresh-Portfolio Skill](./phase-3.md) _(13 tasks — Milestone 2)_
- [ ] [Phase 4: Design-Direction Mockup Gate](./phase-4.md) _(9 tasks — Milestone 2)_

**Milestone 3: Site Build Complete**

- [ ] [Phase 5: Core Site Build](./phase-5.md) _(21 tasks — Milestone 3)_
- [ ] [Phase 6: Enhancement](./phase-6.md) _(16 tasks — Milestone 3)_

**Milestone 4: Shipped**

- [ ] [Phase 7: Migration & Deployment](./phase-7.md) _(13 tasks — Milestone 4)_
- [ ] [Phase 8: Polish & Verification](./phase-8.md) _(13 tasks — Milestone 4)_

**Total: 8 phases · 118 tasks**

---

## Parallel Execution Groups

| Group | Phases | Reason                                                                                                                                                                                                                                                                                                                       |
| ----- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A     | 3, 4   | Phase 3 builds the Skill under `.claude/skills/refresh-portfolio/` + `scripts/write-blurbs.ts` + `scripts/propose-diffs.ts`. Phase 4 produces ephemeral `mockups/*.html` then populates `src/styles/tokens.css` + `src/styles/themes/*.css`. Zero file overlap. Phase 3 depends on Phase 2; Phase 4 depends on Phase 1 only. |

Phases 1→2 must run sequentially (Phase 2 depends on Phase 1 foundation). Phases 5→6→7→8 must run sequentially (file dependencies).

---

## Quick Reference

### Key Files (post-implementation)

| File / Directory                            | Purpose                                              |
| ------------------------------------------- | ---------------------------------------------------- |
| `AGENTS.md`                                 | Project conventions, `gh auth` requirement, commands |
| `astro.config.mjs`                          | Astro config, `outDir: './docs'`, integrations       |
| `.claude/skills/refresh-portfolio/SKILL.md` | Skill entry point                                    |
| `scripts/fetch-github.ts`                   | GraphQL fetcher                                      |
| `scripts/curate.ts`                         | Curation applier                                     |
| `scripts/write-blurbs.ts`                   | AI blurb writer                                      |
| `scripts/render-content.ts`                 | Content renderer                                     |
| `site/featured.json`                        | Hand-edited curation overrides                       |
| `data/github-snapshot.json`                 | Committed GitHub state snapshot                      |
| `data/ai-cache.json`                        | Content-hash keyed AI output cache                   |
| `data/build-manifest.json`                  | Build inputs/outputs hash manifest                   |
| `src/content/config.ts`                     | Zod schemas for collections                          |
| `src/content/projects/*.md`                 | AI-generated; Skill-owned                            |
| `src/content/pages/*.md`                    | Hand-authored                                        |
| `src/components/brand/`                     | Wordmark, QuillMark, SlashGlyph                      |
| `src/styles/tokens.css`                     | 10 semantic CSS variables                            |
| `src/styles/themes/{dark,light}.css`        | Theme-specific values                                |
| `public/CNAME`                              | `www.equilllabs.com`                                 |
| `public/.nojekyll`                          | Disable Jekyll                                       |
| `docs/`                                     | Build output (committed, deployed)                   |

### Environment Variables

None required. GitHub authentication uses `gh auth token` at runtime (reads from the user's existing `gh` CLI session — no `.env`, no stored PAT).

### External Dependencies

- **`gh` CLI** — must be installed and authenticated with `repo` scope (public repos read). Verified via `gh auth status` at pipeline start.
- **Node 20 LTS+** — package `engines` enforces minimum.
- **GitHub Pages** — must be configured in repo Settings: _Source: Deploy from branch_ → _Branch: `main`_ → _Folder: `/docs`_.
- **DNS** (`equilllabs.com`) — unchanged; A/AAAA to GitHub IPs + `www` CNAME to `<user>.github.io`.

---

## Completion Summary

_(Filled during finalization after all phases complete)_

- **Completion date:**
- **Implementer:**
- **Final confidence:**
- **Deviations from plan:**
- **Follow-ups:**

---

<!-- METRICS_JSON {"step": "document", "total_tasks": 118, "tasks_per_phase": [18, 15, 13, 9, 21, 16, 13, 13], "phase_count": 8, "parallel_groups_identified": 1, "verification_items_added": 0} -->
