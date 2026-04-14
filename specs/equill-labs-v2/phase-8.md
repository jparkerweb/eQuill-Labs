# Phase 8: Polish & Verification

**Status:** Not Started
**Estimated Tasks:** 13
**Milestone:** 4 — Shipped
**Dependencies:** Phase 7 complete (site live)

---

## Overview

Verify the launched site meets all NFRs, wire smoke-test tooling into a reproducible loop, and sign off against the Success Criteria. No new features — this phase is pure validation and fit-and-finish.

## Prerequisites

- Phase 7 complete; live site at `https://www.equilllabs.com/`
- Node 20+, all dependencies installed
- `gh` CLI authenticated (for end-to-end skill test)

## Tasks

### HTML Validation

- [ ] **Task 8.1:** Install html-validate: `npm install -D html-validate`. Create `.htmlvalidate.json` config: `{ "extends": ["html-validate:recommended"], "rules": { "void-style": ["error", { "style": "omit" }], "no-trailing-whitespace": "off" } }`. Add npm script `"validate:html": "html-validate docs/**/*.html"`. Run it.
- [ ] **Task 8.2:** Fix any HTML validation errors reported by Task 8.1. Common issues: unclosed `<meta>` tags (Astro usually handles this), duplicate IDs across a built page, invalid nesting (e.g., `<a>` inside `<a>`), missing required attributes. Rerun until `validate:html` exits 0.

### Accessibility

- [ ] **Task 8.3:** Install Playwright + axe: `npm install -D @playwright/test @axe-core/playwright`. Run `npx playwright install --with-deps chromium` to download the browser. Initialize config via `npx playwright init` or create `playwright.config.ts` manually with `testDir: 'tests'`, `use: { baseURL: 'http://localhost:4321' }`, `webServer: { command: 'npm run preview', port: 4321 }`.
- [ ] **Task 8.4:** Create `tests/a11y.spec.ts` with tests for 4 routes: `/`, `/projects/`, one project detail (`/projects/semantic-chunking/`), `/about/`. Each test: `test('route has no a11y violations', async ({ page }) => { await page.goto(route); const results = await new AxeBuilder({ page }).analyze(); expect(results.violations).toEqual([]); });`. Add npm script `"test:a11y": "playwright test tests/a11y.spec.ts"`.
- [ ] **Task 8.5:** Run `npm run test:a11y` and fix reported violations. Common fixes: missing `alt` on images (add or empty string for decorative), missing `aria-label` on icon-only buttons, color contrast failures (tune theme tokens in `src/styles/themes/*.css`), form inputs without labels, heading hierarchy skips (h1 → h3 without h2). Rerun until zero violations on all 4 routes.

### Performance (Lighthouse CI)

- [ ] **Task 8.6:** Install Lighthouse CI: `npm install -D @lhci/cli`. Create `.lighthouserc.json`: `{ "ci": { "collect": { "staticDistDir": "./docs", "url": ["http://localhost/", "http://localhost/projects/", "http://localhost/projects/semantic-chunking/", "http://localhost/about/"], "numberOfRuns": 3 }, "assert": { "assertions": { "categories:performance": ["error", {"minScore": 0.95}], "categories:accessibility": ["error", {"minScore": 1.0}], "categories:best-practices": ["error", {"minScore": 1.0}], "categories:seo": ["error", {"minScore": 1.0}] } }, "upload": { "target": "temporary-public-storage" } } }`. Add npm script `"test:lighthouse": "lhci autorun"`.
- [ ] **Task 8.7:** Run `npm run test:lighthouse`. On failures: review the report; common regression sources are un-preloaded fonts, uncompressed images, render-blocking CSS, layout shift from images without explicit dimensions. Iterate fixes in `src/components/`, `src/layouts/`, `src/styles/`, and rerun until the assertion gate passes. Accept minScore: 0.95 for performance (variance buffer); accessibility / best-practices / SEO must be 1.0 exactly.

### Responsive

- [ ] **Task 8.8:** Manual responsive sweep. Open the live site in a browser with DevTools device-mode at 320px, 768px, 1280px, 1920px. For each breakpoint check: (a) no horizontal scrollbar at any width; (b) tap targets ≥44px on touch-mode; (c) `LivingIndex` degrades correctly on mobile (no marquee, static list); (d) `ProjectFilters` layout reflows (pill chips wrap, don't overflow); (e) footer columns stack at <768px; (f) images scale with `srcset` (inspect element → check which `src` loaded matches viewport). Fix any regressions, rebuild, redeploy, re-verify.

### Social Preview

- [ ] **Task 8.9:** Verify social-preview rendering. Use these validators: (a) Twitter/X Card Validator (`https://cards-dev.twitter.com/validator`) — paste `https://www.equilllabs.com/` + one project URL; confirm `summary_large_image` card renders the generated OG PNG; (b) LinkedIn Post Inspector (`https://www.linkedin.com/post-inspector/`) — same URLs; (c) Facebook Sharing Debugger (`https://developers.facebook.com/tools/debug/`) — same URLs. If a validator shows a cached old image, click "Scrape again" / "Refresh" to force re-fetch. All three should show the Satori-generated PNG with wordmark + title + tagline.

### Skill End-to-End

- [ ] **Task 8.10:** Run the `refresh-portfolio` skill end-to-end against real GitHub data. Invoke via Claude Code: `/refresh-portfolio` with no guidance. Verify the flow: fetch (prints repo count), curate (prints diff summary), write-blurbs (only for changed repos — on first post-launch run, this may be everything if `data/ai-cache.json` is empty), render (writes content), review-gate (prompts for `approved`/`reject`/`abort`), build (on approved), commit-gate (prints summary, stops). Reply `reject` on review-gate to verify revert commands work. Re-run with `approved` to do a real refresh.
- [ ] **Task 8.11:** Verify the idempotency contract. After Task 8.10 completes with `approved` and a committed run, immediately re-run `/refresh-portfolio` with no guidance. Expected: review-gate reports "0 files changed". If any file changed on second run, investigate non-determinism (likely sources: timestamps leaked into manifest, unsorted JSON, AI blurb regenerated instead of cache-hit). Fix until second-run produces byte-identical state.

### Documentation + Sign-off

- [ ] **Task 8.12:** Update `AGENTS.md` with final operational knowledge: (a) the three primary commands — `npm run dev`, `npm run build`, `/refresh-portfolio`; (b) gotchas discovered during implementation (e.g., "Pagefind indexes docs/ AFTER Astro build — if changing content layout, re-run full build"); (c) common failure modes and fixes ("`gh auth status` fails → `gh auth login -s repo`"); (d) deploy instructions — "push to `main`; GitHub Pages redeploys from `main /docs` automatically within 2 min"; (e) design-direction reference — pointer to `DESIGN-DECISION.md` + `src/styles/tokens.css` as the locked palette. Keep it concise — <200 lines.
- [ ] **Task 8.13:** Sign-off review against PLAN-DRAFT §7 Success Criteria. Tick each criterion explicitly in `specs/equill-labs-v2/overview.md`'s Completion Summary section. For any criterion that FAILED to land: create a follow-up task list in a new file `specs/equill-labs-v2/FOLLOW-UPS.md` with specifics. Criteria to verify:
  - Site serves at `https://www.equilllabs.com` via branch-deploy from `main /docs` ✓
  - `.github/workflows/static.yml` removed ✓
  - Home: Hero (Living Index) + Featured Projects + About teaser
  - `/projects/` lists non-archived non-fork repos; 6+ featured
  - Filters (Theme/Language/Type) + Pagefind + URL state
  - Every project has detail page at `/projects/<slug>/`
  - `/about/` has bio + faith/family + timeline
  - Tagline verbatim
  - `eQui\\ Labs` wordmark with `\\` styled
  - Quill mark in header
  - Dark/light/system theme toggle, no FOUC
  - Per-page OG images at `/og/<slug>.png`
  - JSON-LD validates in Google Rich Results test
  - `sitemap-index.xml` + `robots.txt`
  - Lighthouse ≥98 on 4 routes
  - WCAG AA, 0 axe violations
  - `prefers-reduced-motion` respected
  - Skill end-to-end works
  - Idempotency holds
  - `AGENTS.md` documents `gh auth`, commands, guardrails
  - No Handlebars code remaining
  - Node 20+ verified

## Phase Testing

- [ ] **Smoke 8.A:** `npm run validate:html` exits 0.
- [ ] **Smoke 8.B:** `npm run test:a11y` exits 0 (zero violations across 4 routes).
- [ ] **Smoke 8.C:** `npm run test:lighthouse` exits 0 (all 4 routes meet assertion thresholds).
- [ ] **Smoke 8.D:** Responsive sweep at 320/768/1280/1920 passes on all breakpoints.
- [ ] **Smoke 8.E:** Social-preview validators show generated OG PNG on 3 major platforms.
- [ ] **Smoke 8.F:** Skill end-to-end completes both paths (approved + reject).
- [ ] **Smoke 8.G:** Idempotency: two consecutive skill runs with unchanged state produce byte-identical repo.
- [ ] **Smoke 8.H:** Every Success Criteria item ticked in overview.md's Completion Summary.

## Acceptance Criteria

- `html-validate` passes on built output.
- `axe-core` reports 0 violations on home, projects catalog, project detail, about.
- Lighthouse CI asserts Performance ≥95, Accessibility = 100, Best Practices = 100, SEO = 100 on 4 routes.
- Responsive sweep passes at 320, 768, 1280, 1920.
- Social previews render on Twitter, LinkedIn, Facebook validators.
- `refresh-portfolio` skill runs end-to-end with both gates firing.
- Idempotency contract verified empirically.
- `AGENTS.md` updated with operational knowledge.
- All Success Criteria items ticked or deferred with written follow-up.
- Site officially declared launched.

## Notes

- **Lighthouse variance:** CI accepts 95 minScore for Performance because network + CPU variance legitimately produces ±3 point swings between runs. Locally you should see 98+ on desktop; if CI regularly dips below 95, investigate (not accept).
- **Axe severity levels:** axe returns violations at minor/moderate/serious/critical. Assert zero at ALL levels initially; if a moderate/minor violation is intractable (rare), document the exception in `AGENTS.md` and downgrade the assertion with a clear comment.
- **OG image caching by social networks:** Twitter, LinkedIn, Facebook each cache OG previews for days-to-weeks. After launching, one-time "refresh" via each validator is enough; after that, cached images update gradually.
- **Skill e2e cadence:** re-run `/refresh-portfolio` monthly (or whenever Justin pushes new repos) to keep content current. Phase 8 proves the mechanism works; future runs are routine.
- **Follow-ups file:** if ANY Success Criterion fails Task 8.13 review, don't block launch — write it down in `FOLLOW-UPS.md` with a short plan, open a GitHub issue, continue. Launch unblocks marketing/external signal; follow-ups are cheap after.
- **Final commit:** when Task 8.13 passes, tag the repo: `git tag -a v2.0.0 -m "eQuill Labs v2 launch"` and `git push origin v2.0.0`. Symbolic but useful.

## Phase Completion Summary

_(Filled after implementation)_

- **Completion date:**
- **Implementer:**
- **Commits:**
- **What was done:**
- **Files changed:**
- **Final Lighthouse scores (Perf/A11y/BP/SEO):**
- **Axe violations found + fixed:**
- **Success Criteria status:**
- **Follow-ups filed:**
- **Launch announcement:**
