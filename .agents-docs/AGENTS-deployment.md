# Deployment

> Part of [AGENTS.md](../AGENTS.md) — project guidance for AI coding agents.

Deployment is **GitHub Pages branch-deploy from `main /docs`**. There is no GitHub Actions workflow (`.github/workflows/static.yml` was removed in Phase 7). No manual deploy step beyond `git push`.

1. Commit any `docs/` changes produced by `npm run build` (Astro writes to `./docs/` via `outDir`).
2. Push `main`. GitHub Pages rebuilds from `main /docs` within ~2 minutes.
3. `public/CNAME` preserves `www.equilllabs.com`. DNS is unchanged — A/AAAA to GitHub Pages IPs + a `www` CNAME to `<user>.github.io`.

> The build output in `docs/` **is committed** — it's the deploy artifact, not a throwaway. After any content or layout change, run `npm run build` and commit the regenerated `docs/`.
