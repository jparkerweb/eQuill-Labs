# PLAN-CONVERSATION: eQuill Labs v2

**Created:** 2026-04-12
**Feature:** equill-labs-v2
**Planning model:** Claude Opus 4.6 (1M context)
**PLAN-DRAFT:** [PLAN-DRAFT-20260412.md](./PLAN-DRAFT-20260412.md)

---

## Session Summary

Single-session planning of a complete ground-up redesign of the eQuill Labs website. User requested 20+ parallel research streams to inform both technical architecture and UX design. 20 subagents were dispatched concurrently in Phase 1 covering SSG comparison, GitHub API strategy, AI-skill architecture, design inspiration, color/type/animation systems, perf/SEO/a11y, content modeling, and current-state audits (repo + live site + GitHub profile).

The user paced through all 7 phases in one conversation, overriding the Large-scope checkpoint at Phase 3 to continue rather than restart in a fresh context.

---

## Key Decisions

### Phase 1 — Requirements (sign-off)

| #   | Decision               | User input                                                                                                                                                               |
| --- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | SSG framework          | Astro ✓                                                                                                                                                                  |
| 2   | Output directory       | Option A (rename to `/docs`) — later revised to branch-deploy from `/docs` in Phase 2                                                                                    |
| 3   | Design direction       | "Show me mockups" → deferred to post-plan gate via `frontend-design` skill; user REQUIRED a 4th direction built around eQuill brand (`\\` as web-tech motif, quill mark) |
| 4a  | Tagline                | Keep verbatim: _"Building tools to enrich our digital lives"_                                                                                                            |
| 4b  | Faith/family section   | Move to About page                                                                                                                                                       |
| 4c  | `eQui\\ Labs` wordmark | Keep — brand-critical; `\\` is intentional web-tech play                                                                                                                 |
| 5   | AI skill scope         | Option (c): refresh data + propose copy changes as diffs for human review                                                                                                |
| 6   | Review/commit gate     | Stop before commit; human reviews `git diff` manually                                                                                                                    |
| 7   | GitHub auth            | `gh auth token` acceptable — document in AGENTS.md                                                                                                                       |
| 8   | Testing                | Smoke only                                                                                                                                                               |
| 9   | Blog/updates           | Out of scope for v2 (future addition)                                                                                                                                    |
| 10  | Analytics              | None                                                                                                                                                                     |
| 11  | Timeline               | Quality-first, no pacing pressure                                                                                                                                        |

### Phase 2 — System Context (with correction)

A mid-phase correction: the prior research assumption that GitHub Pages required rename-to-`/docs` via branch-deploy was based on incomplete context — the repo actually uses an Actions workflow (`.github/workflows/static.yml`) which could upload any directory. User re-confirmed:

**Option B selected:** branch-deploy from `main /docs`, delete the Actions workflow, commit built `docs/` for immediate publish. Rationale: agent loop stays tight (no CI roundtrip), `/docs` is the GitHub convention, one fewer moving part.

### Phase 3 — Scope Assessment

Classified **LARGE** on all 4 thresholds (7 phases, 23 reqs, 8 components, 5 integrations). User opted to continue in-conversation rather than restart.

### Phase 4 — Tech Stack (approved)

| Category       | Chosen                                                               |
| -------------- | -------------------------------------------------------------------- |
| SSG            | Astro 5.x                                                            |
| Styling        | Tailwind v4 + CSS variables                                          |
| Content        | Astro Content Collections + Zod + Markdown                           |
| GitHub         | `@octokit/graphql` via `gh auth token`                               |
| README parsing | `unified` + `remark-parse` + `remark-gfm`                            |
| OG images      | `satori` + `@resvg/resvg-js`                                         |
| Search         | `pagefind`                                                           |
| Animation      | `motion` (Motion One) + CSS + View Transitions API                   |
| Fonts          | Geist Sans + Geist Mono + Instrument Serif (Fontsource, self-hosted) |
| Icons          | `lucide-astro`                                                       |
| Quality        | `astro check` + `prettier` + `html-validate` + `@lhci/cli`           |
| Runtime        | Node 20 LTS+, npm                                                    |

### Phase 5 — Architecture (approved)

- **Pattern B**: Pipeline of pure-function stages orchestrated by the Skill. Rejected alternatives: Monolithic Skill (untestable), Event-sourced (overkill).
- **11 components** defined with responsibility, I/O, and dependencies.
- **Routing**: `/`, `/projects/`, `/projects/[slug]/`, `/about/`, `/og/[slug].png`, `/sitemap-index.xml`, `/404`.
- **Pipeline phases**: fetch → curate → diff → write-blurbs (changed repos only) → render-content → propose-diffs → **[review gate]** → build → **[commit gate]**.
- **Design-direction mockup gate** built into Phase I-4 before full implementation.

### Phase 6 — Technical Spec (approved)

- **8 implementation phases** with dependencies (I-3 + I-4 parallelizable after I-2)
- **12 risks** enumerated with likelihood/impact/mitigation
- **6 error codes** defined for pipeline (`ERR_GH_AUTH`, `ERR_GRAPHQL`, `ERR_README_PARSE`, `ERR_SCHEMA_VALIDATE`, `ERR_BUILD`, `ERR_OG_FONT`)
- **22-item success criteria** checklist

### Phase 7 — Finalize

Final confidence **98%**. PLAN-DRAFT produced; user directed toward `/smarsh2code-2--document` for next step.

---

## Research Streams (20 parallel subagents)

| #   | Stream                       | Key finding                                                                                        |
| --- | ---------------------------- | -------------------------------------------------------------------------------------------------- |
| 1   | Current repo audit           | Handlebars SSG, 13 project pages, 1069 lines hand-authored CSS, Actions-based deploy               |
| 2   | SSG comparison               | Astro 29/30, Eleventy 26/30 runner-up                                                              |
| 3   | GitHub API strategy          | GraphQL + `gh auth token` + committed snapshot                                                     |
| 4   | AI skill architecture        | Single skill, phased pipeline, content-hash AI cache, quote-or-omit rule                           |
| 5   | AI-engineer portfolio trends | Simon Willison × Karpathy voice; evidence before narrative                                         |
| 6   | Project showcase UI          | Featured 6 + filtered grid; pill chips; fallback gradient art                                      |
| 7   | Typography systems           | 3 options; Geist + Instrument Serif + Geist Mono selected                                          |
| 8   | Color palettes               | 4 directions specified with full hex tokens                                                        |
| 9   | Animation strategy           | CSS-first + Motion One (3.8KB) + View Transitions                                                  |
| 10  | GitHub Pages deploy          | Branch-deploy `/docs` viable; Actions optional                                                     |
| 11  | Content model                | `curated/ + generated/ + merged/` layout + Zod                                                     |
| 12  | `jparkerweb` profile         | 83 repos, 6 pinned, 5 thematic clusters, excellent README consistency                              |
| 13  | Live site audit              | Tagline + wordmark + quill + dark palette = preserve; fonts + animations + copy structure = retire |
| 14  | SEO + OG                     | Satori at build; JSON-LD Person/Organization/SoftwareSourceCode                                    |
| 15  | Theming                      | CSS vars + `[data-theme]` + inline FOUC script + 10 tokens                                         |
| 16  | Hero concepts                | "Living Index" won for AI-engineer with high output volume                                         |
| 17  | Accessibility                | WCAG AA; axe + Lighthouse CI; 6 breakpoints; 44px targets                                          |
| 18  | Search/filter                | Pagefind + pill chips + URL sync + 150-200ms debounce                                              |
| 19  | Idempotency                  | Snapshot diff → change-set → cache-keyed AI → manifest                                             |
| 20  | Performance budget           | Lighthouse 98+, LCP <2s, JS <50KB/route (realistic 10-25KB on Astro)                               |

---

## Final Outcome

- **Confidence:** 98% (Requirements 24/25 · Feasibility 25/25 · Integration 25/25 · Risk 24/25)
- **Clarification rounds:** 0 (all ambiguities resolved via targeted questions + research appendix)
- **Assumptions held:** 5 (Windows host, `gh` auth with repo scope, Geist licensing acceptance, branch-deploy toggle access, no timeline pressure)
- **Open questions deferred to implementation:** Design-direction pick (gated), optional component library, RSS feed

Ready for `/smarsh2code-2--document`.
