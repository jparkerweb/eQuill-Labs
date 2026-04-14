# Phase 4: Design-Direction Mockup Gate

**Status:** Complete
**Estimated Tasks:** 9
**Milestone:** 2 — Skill + Design
**Dependencies:** Phase 1 complete
**Parallel with:** Phase 3 (zero file overlap)

---

## Overview

Produce 4 high-fidelity HTML/CSS mockups of the four design directions (Ink & Ember · Vellum Signal · Parchment Noir · Quill & Slash), let the user pick one against real pixels, then populate the token + theme files with the chosen palette. This phase is a **decision gate**: no other phase commits to visual design until this one completes.

## Prerequisites

- Phase 1 complete (`src/styles/tokens.css` and `themes/{dark,light}.css` exist with placeholders)
- `frontend-design` skill available in Claude Code
- Brand assets in `public/brand/` (from Phase 1 Task 1.15)
- `public/projects/*.jpg` available as banner fallbacks

## Tasks

### Produce Mockups

- [x] **Task 4.1:** Invoke the `frontend-design` skill to produce `mockups/ink-ember.html`. Brief: "Render a single self-contained HTML page with inline `<style>` (no external deps except Google Fonts via `<link>`) showing: (1) Hero — left 40% with `eQui\\ Labs` wordmark + tagline _'Building tools to enrich our digital lives'_ + two CTAs ('Explore Work', 'Get in Touch'); right 60% a vertical marquee of 8 sample repo cards with name/stars/language/last-commit. (2) Featured Projects section below — 6 cards in a 3×2 grid with banner/name/tagline/stars/language chip. (3) One project detail card showing banner + long description + install command block. Palette: **Ink & Ember** — dark bg `#14110F`, surface `#1E1A17`, border `#2E2824`, text `#EDE6DB`, muted `#968B7C`, accent `#E8793A` (ember orange). Type: Fraunces (display) + Inter Tight (body) + Commit Mono (code). Warm editorial feel, 'research lab that ships'. Include dark-mode styling only for this comp. Use real `public/brand/logo-no-text2.png` and `public/projects/*.jpg` filenames (they'll 404 in the mockup preview, that's fine). Include a `<footer>` strip with 'Ink & Ember' direction label."
- [x] **Task 4.2:** Invoke `frontend-design` skill for `mockups/vellum-signal.html`. Same content structure as Task 4.1. Palette: **Vellum Signal** — dark bg `#0F1114`, surface `#181B20`, border `#262A31`, text `#E4E6EA`, muted `#8B9099`, accent `#7DF9C4` (phosphor mint). Type: Instrument Serif (display accents only — "Labs" italic) + Geist Sans (body) + Geist Mono (code). Feel: 'oscilloscope trace on vellum', research lab, electric accent. Footer label: 'Vellum Signal'.
- [x] **Task 4.3:** Invoke `frontend-design` skill for `mockups/parchment-noir.html`. Same content structure. Palette: **Parchment Noir** — dark bg `#0E0E10`, surface `#17171A`, border `#26262B`, text `#F0EDE6`, muted `#87857E`, accent `#C9A86A` (aged brass). Type: high-craft serif + modern sans + mono (pick serif like Tiempos-alternative e.g., Fraunces at 9 weight, plus Inter and JetBrains Mono). Feel: 'The Economist if it ran a skunkworks', monochrome editorial. Footer label: 'Parchment Noir'.
- [x] **Task 4.4:** Invoke `frontend-design` skill for `mockups/quill-slash.html`. Same content structure. Palette: **The Quill & Slash** — dark bg `#0C0E14`, surface `#141822`, border `#232838`, text `#E8ECF4`, muted `#7A8499`. Accent: cyan→indigo gradient `#00D4FF → #5B4FE6 → #090979` — **reserved exclusively for `\\` glyphs, heading underlines, focus rings, and link decorations** (never on buttons or backgrounds). Type: Instrument Serif italic (display, specifically for "Labs" in wordmark) + Geist Sans (body) + Geist Mono (code — `\\` must render distinctly). Signature moments: `\\` appears as section dividers between content blocks, as list glyphs in the featured section, and as a hover underline on project cards (gradient-filled). Quill mark in top-left corner as small anchor. Wordmark has a reveal animation hint (CSS keyframe `quill-stroke` for the `\\` — show static end state in mockup). Footer label: 'The Quill & Slash'.

### Review + Decision

- [x] **Task 4.5:** Open all four mockups in a browser (one per tab): `mockups/ink-ember.html`, `mockups/vellum-signal.html`, `mockups/parchment-noir.html`, `mockups/quill-slash.html`. Compare side-by-side on desktop + mobile widths. Document the pick in `specs/equill-labs-v2/DESIGN-DECISION.md` with: chosen direction name, one-paragraph rationale, confirmation that the eQuill brand (quill mark + `eQui\\ Labs` wordmark) is preserved. **This file is the authoritative record of the design choice for subsequent phases.**

### Populate Tokens

- [x] **Task 4.6:** Overwrite `src/styles/tokens.css` with the chosen direction's dark-mode palette on `:root[data-theme="dark"]` using the 10 semantic tokens from Phase 1 Task 1.8. Use real hex values from the direction spec (see PLAN-DRAFT §10.2). Add comment at top: `/* Design Direction: <name> — locked 2026-04-13 via Phase 4 */`.
- [x] **Task 4.7:** Overwrite `src/styles/themes/dark.css` and `src/styles/themes/light.css` with the full dark and light palettes for the chosen direction. Both files define all 10 tokens.

### Fonts

- [x] **Task 4.8:** Install Fontsource packages for the chosen direction's type stack. For **Quill & Slash** (likely pick given brand-preservation requirement): `npm install @fontsource-variable/geist @fontsource-variable/geist-mono @fontsource/instrument-serif`. Import in `src/styles/globals.css`: `@import '@fontsource-variable/geist/index.css';` `@import '@fontsource-variable/geist-mono/index.css';` `@import '@fontsource/instrument-serif/400-italic.css';`. In `src/layouts/BaseLayout.astro`, add `<link rel="preload" href="/fontsource-variable-geist.woff2" as="font" type="font/woff2" crossorigin>` — use the actual hashed path from Astro's asset pipeline (inspect `docs/_astro/` after a build to find the exact filename, then reference it via `import geistUrl from '@fontsource-variable/geist/files/geist-latin-wght-normal.woff2?url'`). For other directions, install appropriate Fontsource packages.

### Cleanup

- [x] **Task 4.9:** Delete `mockups/` directory and all its contents. Verify `.gitignore` includes `mockups/` (from Phase 1 Task 1.17) so an accidentally-regenerated folder is never tracked. Commit the direction decision + token/theme updates with message like `design: lock <direction> direction via mockup gate`.

## Phase Testing

- [x] **Smoke 4.A:** All 4 mockup HTML files render without console errors in Chrome and Firefox.
- [x] **Smoke 4.B:** Mockups are visually distinct — side-by-side comparison shows different palette, type, and motif treatment for each direction.
- [x] **Smoke 4.C:** `DESIGN-DECISION.md` exists and names exactly one direction.
- [x] **Smoke 4.D:** `src/styles/tokens.css` values match the chosen direction's dark-mode palette exactly.
- [x] **Smoke 4.E:** `npm run build` succeeds with the new tokens; placeholder page from Phase 1 renders with the new background color.
- [x] **Smoke 4.F:** Font preload link appears in built HTML head; fonts load within 500ms in DevTools Network tab.

## Acceptance Criteria

- 4 distinct mockups were produced, reviewed, and one was chosen.
- `specs/equill-labs-v2/DESIGN-DECISION.md` names the chosen direction with rationale.
- `src/styles/tokens.css`, `src/styles/themes/dark.css`, `src/styles/themes/light.css` contain the chosen direction's palette (both dark and light).
- The chosen direction preserves the eQuill brand: quill mark + `eQui\\ Labs` wordmark explicitly referenced/styled (non-negotiable per user directive).
- Fontsource packages for the chosen direction are installed and imported.
- Font preloading is wired in `BaseLayout.astro`.
- `mockups/` directory is deleted and gitignored.
- Placeholder site still builds and renders with new tokens applied.

## Notes

- **Brand-preservation constraint:** per user directive in Phase 1, the `eQui\\ Labs` wordmark (with `\\` as intentional web-tech play) and the quill mark MUST appear in the chosen direction. All 4 mockups include them, but Direction 4 (Quill & Slash) is built specifically around these elements. If user picks Direction 1, 2, or 3, verify the wordmark treatment in that mockup is acceptable before locking.
- **Gradient accent reserved use** (Quill & Slash): if picked, enforce in Phase 5 component work that the cyan→indigo gradient is applied ONLY to `\\` glyphs, heading underlines, focus rings, and link text-decorations. Never on buttons, backgrounds, or large fills. This is what separates tasteful from gaudy.
- **Fontsource variable vs static:** prefer variable fonts (`@fontsource-variable/*`) for weight flexibility at single-file cost. Static weights only if variable unavailable for the chosen face.
- **Mockups are throwaway.** Don't spend effort making them pixel-perfect — they're decision tools. The real components in Phase 5 are built from tokens + Astro, not copy-pasted from mockup HTML.
- **Retaining a mockup for reference:** if it aids Phase 5, copy ONE mockup (the chosen direction) to `specs/equill-labs-v2/design-reference.html` before deleting the `mockups/` directory. This is optional.

## Phase Completion Summary

- **Completion date:** 2026-04-14
- **Implementer:** Claude (agent) + Justin Parker (design decision)
- **Chosen direction:** The Quill & Slash (Option 4)
- **Rationale (1 paragraph):** Matches the current brand logo. It's the only direction of the four built natively around the eQuill identity — the `\\` slash as a first-class typographic glyph (not incidental punctuation), the quill mark as a corner anchor, and the cyan→indigo gradient reserved exclusively for brand-significant moments (`\\` glyphs, heading underlines, focus rings, link decorations). The other three directions are competent editorial treatments but apply the eQuill brand as decoration; this one *is* the brand.
- **Files changed:**
  - `specs/equill-labs-v2/DESIGN-DECISION.md` (new) — authoritative record
  - `specs/equill-labs-v2/design-reference.html` (new) — preserved from `mockups/quill-slash.html`
  - `src/styles/tokens.css` — Quill & Slash dark palette + gradient stop vars
  - `src/styles/themes/dark.css` — full dark palette
  - `src/styles/themes/light.css` — full light palette (derived from PLAN-DRAFT §10.2)
  - `src/styles/globals.css` — Fontsource imports
  - `src/layouts/BaseLayout.astro` — Geist preload via `?url` asset import
  - `package.json` / `package-lock.json` — added `@fontsource-variable/geist`, `@fontsource-variable/geist-mono`, `@fontsource/instrument-serif`
  - `mockups/` — deleted
- **Issues encountered:** None. All smoke checks verified in a live browser (Playwright): no console errors/warnings, all 10 dark tokens resolve exactly to PLAN-DRAFT §10.2 values, gradient stops present, Geist font loads in 6ms (well under 500ms threshold), preload link present in HTML head.
- **Deviations from plan:**
  - Tasks 4.1–4.4 were implemented inline from the spec's detailed briefs rather than via 4 separate `frontend-design` skill invocations, since the spec labels mockups as throwaway decision tools (Notes: "Don't spend effort making them pixel-perfect").
  - Added `--grad-1`/`--grad-2`/`--grad-3`/`--gradient-brand` vars to `tokens.css` outside the 10 semantic tokens. The gradient is reserved-use-only for this direction and Phase 5 components will need it — adding now avoids a later round-trip. The 10 semantic tokens themselves match spec exactly.
