# Analytics

> Part of [AGENTS.md](../AGENTS.md) — project guidance for AI coding agents.

The site is instrumented with **self-hosted [Umami](https://umami.is/)** running on the maintainer's home server. It is cookieless and GDPR-compliant — no consent banner needed.

| Field             | Value                                                                  |
| ----------------- | ---------------------------------------------------------------------- |
| Tracker host      | `https://umami.jparkerweb.com`                                         |
| Tracker script    | `https://umami.jparkerweb.com/script.js`                               |
| Website ID        | `2bf560c7-82c3-442c-8fda-63ceaa2348cf`                                 |
| Allowed domains   | `equilllabs.com`, `www.equilllabs.com`                                 |
| Snippet location  | `src/layouts/BaseLayout.astro` (in `<head>`, after `<ClientRouter />`) |
| Compose stack     | `docker-compose-library/parker-lab/umami/` (separate repo)             |

## How it works

- The snippet uses `data-domains` so events only fire on the production hostnames. **`localhost`, GitHub Codespaces previews, and PR previews are silently ignored** — dev work never pollutes stats.
- Astro's `ClientRouter` performs SPA-style navigation. Umami's tracker auto-listens to `history.pushState` / `popstate`, so SPA route changes are captured as separate pageviews **without extra wiring**.
- The script is loaded with `is:inline defer` so Astro doesn't bundle it and it doesn't block rendering.

## Adding a new page

**You don't need to do anything.** Every page in `src/pages/**` ultimately renders through `BaseLayout.astro` (directly, or via `ProjectLayout.astro` which wraps `BaseLayout`). Tracking is inherited automatically.

If you introduce a new top-level layout that does **not** wrap `BaseLayout`, copy the `<script>` block from `BaseLayout.astro` into the new layout's `<head>`. Use the same `data-website-id` — one Umami "website" covers the whole domain.

## Custom event tracking (optional)

```js
// Simple named event
window.umami?.track('project-card-click');

// With properties
window.umami?.track('project-card-click', { slug: 'semantic-chunking' });
```

The `?.` chain makes it a no-op when Umami is blocked or not loaded — never throw on a missing tracker.

## Do NOT

- **Do not** change `data-website-id` — it's bound to the website record in Umami; changing it loses historical continuity.
- **Do not** remove `data-domains` — without it, every dev/preview pageview is recorded.
- **Do not** swap `src=` to a CDN-hosted Umami Cloud URL unless explicitly migrating off self-hosting.
- **Do not** add Google Analytics, Plausible, Fathom, or any other tracker alongside Umami without an explicit ask — the site is intentionally single-tracker and cookie-free.

## If the tracker breaks

1. **No data?** Check the Umami container is running (`docker ps | grep umami` on the server) and that `https://umami.jparkerweb.com/script.js` returns 200.
2. **CORS errors?** The container must accept requests from `equilllabs.com`. It allows all origins by default; if `CORS_MAX_AGE` or a reverse-proxy header changed, restore the default.
3. **Ad-blocker false positives** — uBlock Origin and similar block `/script.js` from analytics-shaped hostnames. To dodge, set `TRACKER_SCRIPT_NAME=stats.js` in the container env, then update `src=` in `BaseLayout.astro` to match. Document the rename here if done.
