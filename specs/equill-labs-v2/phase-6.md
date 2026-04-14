# Phase 6: Enhancement

**Status:** Not Started
**Estimated Tasks:** 16
**Milestone:** 3 — Site Build Complete
**Dependencies:** Phase 5 complete

---

## Overview

Layer on the polish that elevates the site from "working" to "launchable": per-page OG images via Satori, Pagefind search integration, animation layer, full SEO metadata + JSON-LD + sitemap, and the signature hero moment per chosen direction. After this phase, Lighthouse should hit 98+ across all four categories.

## Prerequisites

- Phase 5 complete — all pages render
- Chosen design direction locked (from Phase 4) — determines signature hero animation
- Fonts installed and self-hosted

## Tasks

### OG Image Generator

- [ ] **Task 6.1:** Install Satori + resvg: `npm install satori @resvg/resvg-js`. Install font file helpers: `npm install @fontsource-variable/geist` (already installed in Phase 4 if Quill & Slash was picked — skip if present).
- [ ] **Task 6.2:** Create `src/pages/og/[slug].png.ts` — a dynamic endpoint. `getStaticPaths`: return paths for every project and every top-level page (home, projects, about, 404). `GET` handler: load the page's title/tagline/direction-accent-color; load the Geist font file as a Buffer via `fs.readFileSync` from `node_modules/@fontsource-variable/geist/files/...woff2`; construct a JSX-like React-element tree for Satori (1200×630, dark bg matching direction, wordmark in top-left, title as large H1 center-left, tagline as smaller text beneath, subtle `\\` decoration or direction-specific ornament); call `satori(tree, { width: 1200, height: 630, fonts: [{name, data, weight, style}] })` → SVG string; pass to `new Resvg(svg).render().asPng()` → Buffer; return `new Response(buffer, { headers: { 'Content-Type': 'image/png' } })`. Total render budget: <100ms per image.
- [ ] **Task 6.3:** Create `src/pages/og/default.png.ts` — site-wide OG used when a page doesn't specify its own. Same rendering pipeline as Task 6.2 but hardcoded title "eQuill Labs" and tagline "Building tools to enrich our digital lives".

### Search

- [ ] **Task 6.4:** Install Pagefind: `npm install -D pagefind`. Add post-build script: in `package.json` scripts, change `"build": "astro build"` to `"build": "astro build && pagefind --site docs --output-subdir pagefind"`. This indexes `docs/` after Astro finishes and writes to `docs/pagefind/`. Verify Pagefind generates indexes by running `npm run build` and checking `docs/pagefind/pagefind.js` and `docs/pagefind/index/*.pf_meta` exist.
- [ ] **Task 6.5:** Wire Pagefind into `src/components/projects/ProjectFilters.astro`. On island mount, dynamically import Pagefind: `const pagefind = await import('/pagefind/pagefind.js')`. On search input change (debounced 200ms): `const results = await pagefind.search(query)`. For each result, check its URL matches a project slug — collect slugs, emit `search-change` custom event with matched slug set. `ProjectGrid` (or a wrapping script) applies visibility based on set intersection of search results AND active filter chips. Handle zero results: show empty state with "Clear all filters" button + suggested popular tags.

### Animation

- [ ] **Task 6.6:** Install Motion One: `npm install motion`.
- [ ] **Task 6.7:** Create `src/lib/reveal.ts` exporting `initReveal()`. Behavior: query `[data-reveal]` elements; create one `IntersectionObserver` with `threshold: 0.15`; for each element entering, call `animate(el, { opacity: [0, 1], y: [16, 0] }, { duration: 0.5, easing: 'ease-out' })` from Motion One; unobserve after first reveal. Guard with `if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;` — skip all animation. Called from `BaseLayout.astro` inline script: `<script>import('/src/lib/reveal.ts').then(m => m.initReveal())</script>`.
- [ ] **Task 6.8:** Add signature hero moment per chosen direction. For **Quill & Slash**: the `\\` in the hero's `<Wordmark size="lg">` draws in as a stroke. Implementation: the `<SlashGlyph>` wraps two `<path>` SVG elements (instead of text) with `stroke-dasharray` equal to path length and an animated `stroke-dashoffset` from full → 0 over 800ms on page load. Guard with `prefers-reduced-motion`. For other directions, implement the corresponding signature from Phase 4 mockups (e.g., Vellum Signal's oscilloscope pulse on accent mint). Document in `DESIGN-DECISION.md`.
- [ ] **Task 6.9:** Add CSS gradient-border hover to `ProjectCard.astro`. Use a pseudo-element with `conic-gradient` and `mask` to animate a 2px border trace on hover. Pure CSS, no JS. Respect reduced-motion: use a static accent-colored border instead. Reference: the pattern from Linear changelog cards.
- [ ] **Task 6.10:** Wire View Transitions API. In `BaseLayout.astro` add `<meta name="view-transition" content="same-origin">` or import Astro's `<ViewTransitions />` component in head. Adds cross-fade on in-site navigation (Home ↔ Projects ↔ About). No opt-in needed per-link; Astro handles it. Test: clicking a project card smoothly transitions to detail page without a full white flash.

### SEO

- [ ] **Task 6.11:** Create `src/components/seo/Meta.astro`. Props: `title`, `description`, `canonicalURL: URL`, `image?: URL` default `new URL('/og/default.png', site)`, `type?: 'website' | 'article'` default `'website'`. Renders: `<title>{title}</title>`, `<meta name="description" content={description} />`, `<link rel="canonical" href={canonicalURL} />`, `<meta property="og:title" content={title} />`, all `og:*` + `twitter:card=summary_large_image` tags. Use this component in `BaseLayout.astro` in place of the placeholder meta from Phase 5.
- [ ] **Task 6.12:** Create `src/components/seo/JsonLd.astro`. Props: `type: 'Person' | 'Organization' | 'SoftwareSourceCode' | 'BreadcrumbList'`, `data: Record<string, unknown>`. Renders `<script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@type': type, ...data })}</script>`. On `/` emit Organization + Person. On `/about/` emit Person with fuller data. On `/projects/<slug>/` emit SoftwareSourceCode with `codeRepository`, `programmingLanguage`, `author: { @type: 'Person', name: 'Justin Parker' }`. On nested pages emit BreadcrumbList.
- [ ] **Task 6.13:** Configure `@astrojs/sitemap` (already installed in Phase 1). In `astro.config.mjs` sitemap integration options: `changefreq: 'weekly'`, `priority: 0.7`, custom `serialize` function that sets `priority: 1.0` for `/` and `0.9` for `/projects/`. Verify build outputs `docs/sitemap-index.xml` and `docs/sitemap-0.xml`.
- [ ] **Task 6.14:** Create `public/robots.txt`: `User-agent: *\nAllow: /\n\nSitemap: https://www.equilllabs.com/sitemap-index.xml\n`. No crawl-delay, no restricted paths.

### Reduced Motion

- [ ] **Task 6.15:** Audit all animations for `prefers-reduced-motion` compliance. Locations: `LivingIndex` marquee (Task 5.14 — already gated), `reveal.ts` (Task 6.7 — gated), hero signature moment (Task 6.8 — gate required), card hover gradient border (Task 6.9 — gate required), View Transitions (automatically respects UA pref per spec but verify). For each: when `prefers-reduced-motion: reduce`, the animation must be skipped entirely (not merely shortened). Add a top-level CSS rule `@media (prefers-reduced-motion: reduce) { * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; } }` in `src/styles/globals.css` as a belt-and-suspenders backstop.

### Smoke

- [ ] **Task 6.16:** Run `npm run build`. Verify: (a) `docs/og/<slug>.png` exists for every project + top-level page; open one in a viewer and confirm it renders wordmark + title + tagline legibly; (b) `docs/pagefind/` contains index files; (c) `docs/sitemap-index.xml` + `docs/sitemap-0.xml` present; (d) `docs/robots.txt` present with correct content; (e) search input on `/projects/` filters cards live; (f) clicking a card triggers a smooth cross-fade transition (DevTools → Rendering → "Show transitions" if needed); (g) Lighthouse audit on home, `/projects/`, one project detail, `/about/` scores ≥98 across Perf/A11y/BP/SEO — each category individually; (h) OG preview in Twitter card validator renders the generated PNG; (i) reduced-motion emulation in DevTools disables all animations.

## Phase Testing

- [ ] **Smoke 6.A:** Every page's `<head>` has complete OG + Twitter meta tags.
- [ ] **Smoke 6.B:** Per-page `/og/<slug>.png` images exist, 1200×630, <200KB.
- [ ] **Smoke 6.C:** Pagefind index generated; search query "chunking" returns `semantic-chunking` and `chunk-match`.
- [ ] **Smoke 6.D:** JSON-LD validates in Google's Rich Results test for Organization, Person, SoftwareSourceCode.
- [ ] **Smoke 6.E:** `sitemap-index.xml` + `robots.txt` accessible at their URLs in build output.
- [ ] **Smoke 6.F:** Lighthouse on 4 representative pages reports ≥98 in all four categories.
- [ ] **Smoke 6.G:** `prefers-reduced-motion: reduce` disables all animation (marquee, reveal, hero signature, card hover).
- [ ] **Smoke 6.H:** View Transitions work on same-origin nav; no janky full-page flash.

## Acceptance Criteria

- Per-page OG images generated via Satori at build for every project + top-level page.
- Pagefind index generated; search integrated in filter island with debounced live filter.
- Animation layer complete: scroll-reveals, signature hero moment, card hover effect, View Transitions — all `prefers-reduced-motion`-respecting.
- SEO metadata (Meta + JsonLd components) wired in BaseLayout.
- `sitemap-index.xml` + `robots.txt` served.
- Lighthouse 98+ on 4 representative pages across all 4 categories.
- No `console.error` on any page load.

## Notes

- **Satori font loading:** Satori requires raw font bytes (ArrayBuffer/Buffer). Use Astro's built-in `fs.readFileSync` in the endpoint; Astro's Vite can also do `?arraybuffer` import. The Fontsource packages include WOFF2 — Satori prefers TTF or WOFF. Test early; if WOFF2 fails, download a TTF equivalent of Geist and check it into `src/assets/fonts/`.
- **Pagefind index location:** default output is `_pagefind` inside site dir; the `--output-subdir pagefind` flag writes to `docs/pagefind/` so the island can import via `/pagefind/pagefind.js` with a clean path.
- **View Transitions scope:** only animates navigations between pages with `<ViewTransitions />` in layout — since all routes share `BaseLayout`, it's site-wide.
- **Performance traps:** the marquee (`LivingIndex`) runs indefinitely; ensure it's paused (`animation-play-state: paused`) when the element is off-screen via IntersectionObserver. Otherwise it burns CPU and hurts mobile battery.
- **JSON-LD gotchas:** Person requires `sameAs: [<github>, <linkedin>, ...]`; SoftwareSourceCode requires `codeRepository` and `programmingLanguage`. Pull both from project frontmatter.
- **Lighthouse variance:** target 98+ on desktop runs. Mobile runs are harder — aim 95+ there; if below, focus on JS reduction and image optimization first.
- **OG image a11y:** generated PNGs should be <200KB. Satori output tends to be clean. If larger, reduce font weight variants included or simplify the layout.

## Phase Completion Summary

_(Filled after implementation)_

- **Completion date:**
- **Implementer:**
- **Commits:**
- **What was done:**
- **Files changed:**
- **Issues encountered:**
- **Deviations from plan:**
