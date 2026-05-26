# Gotchas & Failure Modes

> Part of [AGENTS.md](../AGENTS.md) — project guidance for AI coding agents.

Non-obvious traps and the fixes for them. Read before touching the build, tests, or accessibility-sensitive markup.

## Gotchas

- **Pagefind indexes `docs/` AFTER the Astro build.** If you change content layout or the search shell, run a full `npm run build` (not bare `astro build`) so the index regenerates and mirrors the current DOM.
- **Chrome-launcher EPERM on Windows.** Lighthouse's bundled `chrome-launcher` can throw `EPERM, Permission denied` while cleaning up its temp user-data dir after Chrome exits. `node_modules/lighthouse/node_modules/chrome-launcher/dist/chrome-launcher.js` has a local try/catch in `destroyTmp()` to swallow the cleanup error (audit results are complete by then). `npm install` may remove the patch; reapply or persist via `patch-package` if it recurs.
- **Scoped Astro styles + inline styles.** `html-validate`'s `recommended` preset flags `style="..."` attributes that Astro injects for scoped CSS vars and view-transition hints — disabled in `.htmlvalidate.json` (alongside `no-redundant-role`, `aria-label-misuse`, `doctype-style`, `form-dup-name`, `wcag/h32`) because they flag intentional patterns, not validity defects. See that file's comments and the Phase 8 notes for rationale.
- **Playwright + axe timing.** Running axe immediately after `page.goto(..., { waitUntil: 'load' })` can race the heading DOM on hydrated routes. `tests/a11y.spec.ts` uses `waitUntil: 'networkidle'` + an explicit `h1` visibility wait.
- **Heading order matters on the catalog.** `ProjectCard` uses `<h2>` (not `<h3>`) so `/projects/` has a clean `h1 → h2` hierarchy. Don't demote it back to `h3` without reintroducing a wrapping `h2`.
- **Dark theme `--text-muted` is tuned for AA.** `#8D97AB` gives ~5:1 on `--surface-2`. Further darkening regresses the Lighthouse accessibility assertion below 1.0.

## Common failure modes

- `gh auth status` fails → `gh auth login -s repo`.
- `npm run build` logs `no <html> element` warnings for stray `/projects/*.html` redirects → expected; Astro emits minimal redirect stubs (lowercase doctype) pointing at the trailing-slash canonical URL.
- `test:lighthouse` errors with `EPERM ... lighthouse.<hash>` → chrome-launcher cleanup. Apply the patch above.
- `test:a11y` reports `page-has-heading-one` or `heading-order` → a page is missing an `h1` or jumps heading levels. Don't suppress; fix the markup.
- Pagefind shows 0 results → verify `docs/pagefind/` exists and that `.astro` search-shell selectors weren't renamed.
