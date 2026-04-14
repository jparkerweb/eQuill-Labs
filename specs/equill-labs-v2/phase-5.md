# Phase 5: Core Site Build

**Status:** Not Started
**Estimated Tasks:** 21
**Milestone:** 3 — Site Build Complete
**Dependencies:** Phase 2 complete (content pipeline) AND Phase 4 complete (design direction locked)

---

## Overview

Build every user-facing component, layout, and route. After this phase, the site fully renders from `src/content/projects/*.md` with the chosen design direction, but without OG images, search, animations, or SEO polish — those land in Phase 6.

## Prerequisites

- Phase 2 complete: `src/content/projects/*.md` populated with 60+ real project files
- Phase 4 complete: `src/styles/tokens.css` and themes contain the chosen direction's palette; fonts installed
- `DESIGN-DECISION.md` documents which direction was chosen (affects Wordmark + hero signature moment)
- `public/brand/` contains `logo-no-text2.png`, `quill.svg`, favicons
- `public/projects/*.jpg` available for banner fallbacks

## Tasks

### Brand Components

- [ ] **Task 5.1:** Create `src/components/brand/Wordmark.astro`. Props: `size?: 'sm' | 'md' | 'lg'` default `'md'`, `as?: 'h1' | 'div' | 'span'` default `'div'`. Renders `eQui` + `<SlashGlyph />` + `Labs` as inline elements so the `\\` is a styled child not a character. Use `<span>` children with class `font-mono` (or whatever direction's mono face is) specifically for the slash glyph so it renders in mono while surrounding text uses the body/display face. Apply gradient text (cyan→indigo `linear-gradient(90deg, #00D4FF 0%, #5B4FE6 50%, #090979 100%)`) to `\\` only via `background-clip: text; -webkit-text-fill-color: transparent;`. Other directions use their accent color. Size mapping: sm 18px, md 32px, lg 72px.
- [ ] **Task 5.2:** Create `src/components/brand/QuillMark.astro`. Renders `public/brand/quill.svg` inline (fetch at build via Astro's asset import) wrapped in an `<a href="/">` when `linked` prop is true (default). Props: `size?: number` default 32, `linked?: boolean` default true, `label?: string` default `'eQuill Labs home'`. Apply `aria-label={label}` for a11y.
- [ ] **Task 5.3:** Create `src/components/brand/SlashGlyph.astro`. Renders two backslash characters styled per the chosen direction. Props: `animate?: boolean` default false (for hero reveal — animation lands in Phase 6 Task 6.8); `role?: string` for semantic reuse (e.g., `role="separator"` when used as divider). Default: `<span class="slash-glyph" aria-hidden="true">\\</span>`. CSS in `<style>` block uses var(--accent) or gradient per direction. Exports a single reusable primitive — used everywhere `\\` appears as decoration (dividers, list glyphs, hover underlines).

### Layout Components

- [ ] **Task 5.4:** Create `src/components/layout/SiteHeader.astro`. Renders `<header>` with: left side `<QuillMark linked />` + `<Wordmark size="sm" />`; right side a `<nav aria-label="Primary">` with links `Home`, `Projects`, `About` and a `<ThemeToggle />`. Use `position: sticky; top: 0;` with `backdrop-filter: blur(8px); background: rgb(var(--bg) / 0.8);`. Highlight current route via `Astro.url.pathname` comparison. 44×44px tap targets on all links. Skip-link `<a href="#main" class="skip-link">Skip to content</a>` as first focusable element.
- [ ] **Task 5.5:** Create `src/components/layout/SiteFooter.astro`. Renders `<footer>` with: `<Wordmark size="sm" as="div" />`; tagline text _"Building tools to enrich our digital lives"_ verbatim; three columns of links — _Site_ (Home, Projects, About), _Code_ (GitHub profile, RSS if added later), _Connect_ (Discord if kept, contact email). Copyright line "© {new Date().getFullYear()} Justin Parker · eQuill Labs". All icon-only links must have `aria-label`. Use `lucide-astro` for icons (GitHub, Discord, Mail).
- [ ] **Task 5.6:** Create `src/components/layout/ThemeToggle.astro`. Three-state cycle: system → dark → light → system. Renders a single `<button>` with current state's icon from `lucide-astro` (Monitor/Moon/Sun). Inline `<script>` (not `is:inline` — bundle it since it has logic) that: reads `localStorage.theme` + current `data-theme`, rotates to next state on click, writes localStorage (removes key when cycling back to system), updates `document.documentElement.dataset.theme`. Include `aria-pressed` reflecting state. Update `aria-label` dynamically: "Theme: system — click to switch to dark" etc.
- [ ] **Task 5.7:** Update `src/layouts/BaseLayout.astro` from the Phase 1 stub to the full implementation: render `<SiteHeader />` before `<main id="main"><slot /></main>` and `<SiteFooter />` after. Include all SEO-friendly meta tags (title, description, canonical URL, og/twitter basics — full SEO polish lands in Phase 6). Props now include `title`, `description`, `canonicalURL?`, `image?` (for OG; defaults to `/og/default.png` generated in Phase 6).
- [ ] **Task 5.8:** Create `src/layouts/ProjectLayout.astro` extending BaseLayout. Used by `/projects/[slug]` pages. Adds breadcrumb `Home / Projects / {name}` and structured-data slot. Imports the content collection entry as prop; renders banner + title + tagline at top, long description body, then a metadata sidebar with stars / language / topics / links.

### Fallback Art

- [ ] **Task 5.9:** Create `src/lib/fallback-art.ts` exporting `fallbackArtFor(slug: string): { gradient: string; monogram: string; hue: number }`. Deterministic: hash the slug via `contentHash` (from Phase 2 Task 2.4), take first 2 hex chars → hue (0-360), first letter of slug uppercased → monogram, gradient `linear-gradient(135deg, hsl(${hue} 65% 25%), hsl(${(hue+40)%360} 65% 15%))`. Same slug → same output forever. Used when a project has no banner.
- [ ] **Task 5.10:** Create `src/components/projects/ProjectFallbackArt.astro`. Takes `slug: string` prop, calls `fallbackArtFor`, renders a `<div>` with the gradient background and the monogram in a large display font centered. Aspect 16:9 by default. Used by `ProjectCard` when `banner` absent.

### Project Components

- [ ] **Task 5.11:** Create `src/components/projects/ProjectCard.astro`. Takes a project content entry as prop. Renders: banner image via Astro `<Image>` if `banner.src` exists else `<ProjectFallbackArt slug={slug} />`; name; tagline (line-clamp-2); footer row with language chip + stars count + primary topic tag (first one only, `+{N}` if more). Variant prop `variant?: 'default' | 'featured'` — featured cards are 1.5× larger and show 2-line description. Entire card is a `<a href="/projects/{slug}/">` wrapping the content. Hover state: 2px translateY, accent-colored border. Keyboard-focusable; focus ring uses `--focus-ring`.
- [ ] **Task 5.12:** Create `src/components/projects/ProjectGrid.astro`. Takes `projects: CollectionEntry<'projects'>[]` prop. Renders `<ul role="list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">` with one `<li><ProjectCard /></li>` per project. Accepts optional `variant` prop passed to each card. Used by home-page Featured section (variant='featured', limited to featured+true) and catalog page (variant='default', all).
- [ ] **Task 5.13:** Create `src/components/projects/ProjectFilters.astro` — an Astro island (client-directive `client:load`). Renders: (a) search input bound to `?q=` URL param, debounced 200ms; (b) three pill-chip groups — Theme (nlp/infra/agents/obsidian/utilities), Language (JavaScript/TypeScript/Python/etc.—derived from projects prop), Type (library/tool/app/demo) — each multi-select, bound to `?theme=`, `?lang=`, `?type=` URL params; (c) "Clear all" button when any filter active. State sync via `history.replaceState` (not pushState — don't pollute history). Filters are computed at build-time from projects metadata; the island only handles DOM filtering + URL sync, no re-fetching. Emits `filter-change` custom event; `ProjectGrid` (or a wrapping element) listens and toggles `hidden` attribute on cards that don't match.

### Hero

- [ ] **Task 5.14:** Create `src/components/hero/LivingIndex.astro` — an island (`client:visible`). Takes `projects` prop (all non-hidden, sorted by `pushedAt` desc, max 30). Renders: left 40% a static block with `<Wordmark size="lg" />` + tagline + two CTAs; right 60% a `<div class="marquee">` containing a vertical scroll of repo mini-cards (name, stars, language dot, `{relativeDate(pushedAt)}`). CSS `@keyframes scroll` slowly translates Y (120s loop); pause on hover via JS. On `prefers-reduced-motion`, replace marquee with a static top-6 list (no animation at all). Mobile (<768px): collapse to stacked layout, no marquee, just a 3-row static list. Reduce to 8 cards on mobile.

### Pages

- [ ] **Task 5.15:** Rewrite `src/pages/index.astro` (replacing Phase 1 placeholder). Sections in order: `<LivingIndex projects={allLivingProjects} />` (Hero), `<section><h2>Featured</h2><ProjectGrid projects={featured} variant="featured" /></section>`, short About teaser card linking to `/about/`, a small "full catalog" CTA to `/projects/`. Pull projects from content collection via `getCollection('projects')`; derive `featured = entries.filter(e => e.data.featured).sort((a,b) => a.data.sortOrder - b.data.sortOrder)`. Use `<BaseLayout title="eQuill Labs — AI tools by Justin Parker" description="Building tools to enrich our digital lives. Open-source AI engineering by Justin Parker.">`.
- [ ] **Task 5.16:** Create `src/pages/projects/index.astro` (full catalog). Sections: page title + count ("{N} projects, {M} featured"), `<ProjectFilters projects={all} />` island, `<div id="project-grid"><ProjectGrid projects={all} /></div>`. Filters operate on `#project-grid` children. Use `<BaseLayout title="Projects — eQuill Labs" description="All open-source projects by Justin Parker.">`.
- [ ] **Task 5.17:** Create `src/pages/projects/[slug].astro` — dynamic route. `getStaticPaths`: `const projects = await getCollection('projects'); return projects.map(p => ({ params: { slug: p.slug }, props: { entry: p } }))`. Render `<ProjectLayout entry={entry}>` passing the content entry. Body: render the long description, then a "Links" block (repo, demo, docs, npm, homepage) as icon+text pills, then "Topics" as a chip list. If `npm` present, show install command in a code block (`npm install {package}`). Related projects strip at bottom: 3 projects sharing the same `theme`.

### About

- [ ] **Task 5.18:** Create `src/content/pages/about.md` — hand-authored. Frontmatter: `title: "About — eQuill Labs"`, `description: "Justin Parker — AI engineer, open-source maintainer, and person behind eQuill Labs."`, `layout: "prose"`. Body sections: _Who_ (bio, 2-3 paragraphs pulled from current live site + refreshed for tone), _Work_ (one paragraph on focus areas: LLM infrastructure, semantic NLP, MCP tooling, Obsidian ecosystem), _Family & Faith_ (relocated section from current homepage — mention Stephanie, Ella, Lily, Christian faith — with a careful tone that fits a portfolio; keep warm, brief), _Timeline_ (simple list: 2019—..., 2022—..., 2024—semantic-chunking, 2025—mcp-sqlite — hand-authored). End with a short "Find me" links block.
- [ ] **Task 5.19:** Create `src/pages/about.astro`. `const entry = await getEntry('pages', 'about'); const { Content } = await entry.render();`. Render with `<BaseLayout title={entry.data.title} description={entry.data.description}>` wrapping a `<article class="prose"><Content /></article>`. Use a slight max-width constraint (65ch) for readability.

### 404

- [ ] **Task 5.20:** Create `src/pages/404.astro`. Simple: `<BaseLayout>` with a centered block containing a large `<SlashGlyph />` (gradient if Quill & Slash direction), heading "Page not found", short text "The page you requested doesn't exist. Try the [projects catalog](/projects/) or [home](/).", and navigation back. Keep the header/footer via BaseLayout so the 404 feels like part of the site.

### Smoke

- [ ] **Task 5.21:** Run `npm run build` and verify all routes produce HTML: `docs/index.html`, `docs/projects/index.html`, `docs/projects/<slug>/index.html` (one per content entry), `docs/about/index.html`, `docs/404.html`. Run `npm run check` — passes. Run `npm run dev` and manually navigate: home loads with hero + featured grid; project catalog loads and filters operate; clicking a project card lands on detail page; About renders markdown content; theme toggle cycles three states; tagline is present on home and footer; wordmark renders with `\\` styled per direction; quill mark visible in header. Browser console clean of errors.

## Phase Testing

- [ ] **Smoke 5.A:** `npm run build` produces HTML for every route including one per project.
- [ ] **Smoke 5.B:** `npm run check` reports 0 errors (all Zod content validates, no TS errors).
- [ ] **Smoke 5.C:** Dev server renders home, catalog, one project detail, about, 404 without console errors.
- [ ] **Smoke 5.D:** Theme toggle cycles system → dark → light → system and persists across reloads.
- [ ] **Smoke 5.E:** Tagline _"Building tools to enrich our digital lives"_ present on home and footer, exact text.
- [ ] **Smoke 5.F:** `eQui\\ Labs` wordmark renders with `\\` styled (gradient or accent depending on direction).
- [ ] **Smoke 5.G:** Filter chips toggle visibility of project cards; URL updates with `?theme=`, `?lang=`, `?type=`, `?q=` params; reload preserves state.
- [ ] **Smoke 5.H:** Hero on mobile (<768px) displays stacked static layout, not the marquee.
- [ ] **Smoke 5.I:** `prefers-reduced-motion: reduce` (set via DevTools rendering panel) disables the marquee animation.

## Acceptance Criteria

- Every user-facing page renders from the content collection.
- `eQui\\ Labs` wordmark appears in site header and hero, with `\\` styled per chosen direction.
- Quill mark appears in header as a corner anchor linking home.
- Tagline present verbatim.
- Dark/light/system theme toggle works with no FOUC, persists across reloads.
- Project catalog filters + search work with URL state sync.
- Each project has a detail page at `/projects/<slug>/` with banner (or fallback art), long description, links, topics, install command if npm package.
- About page contains bio + faith/family section (relocated from homepage) + timeline.
- 404 page exists and is navigable.
- No Handlebars or legacy CSS touched (deletions still in Phase 7).

## Notes

- **`\\` as character vs component:** always use `<SlashGlyph />` — never a literal `\\` in markup — so styling/animation can be applied uniformly. The Wordmark composes three children: `eQui`, `<SlashGlyph />`, `Labs`.
- **Content collection `slug`:** Astro derives slugs from filename by default (`semantic-chunking.md` → `semantic-chunking`). Keep `.md` filenames = slug = `repo.name` for consistency with GitHub.
- **Filter data shape:** the filter chips need the _set_ of tags/languages/types present across all projects — compute once at build time, pass as prop to `ProjectFilters`. Don't compute in the island at runtime.
- **Hydration boundaries:** only two islands need JS — `ProjectFilters` (`client:load`) and `LivingIndex` (`client:visible`). Everything else is zero-JS Astro.
- **Image sizes:** Astro `<Image>` requires explicit `width` and `height` or `sizes` attr for responsive. Project banners: 1280×720 source, `sizes="(min-width: 1024px) 400px, 100vw"`.
- **About page tone:** the faith/family section was prominent on the old homepage; relocating it to About respects the brand (it's Justin's site, not just a tech brand) without dominating the professional pitch. Keep it brief (~100 words), warm, third-person or first-person consistent with the rest.
- **Performance note:** this phase does NOT wire OG images, Pagefind, SEO JSON-LD, or animations — Phase 6. The site will Lighthouse ~85-92 at this point; the last 6-8 points come in Phase 6.

## Phase Completion Summary

_(Filled after implementation)_

- **Completion date:**
- **Implementer:**
- **Commits:**
- **What was done:**
- **Files changed:**
- **Issues encountered:**
- **Deviations from plan:**
