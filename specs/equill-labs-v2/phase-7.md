# Phase 7: Migration & Deployment

**Status:** Not Started
**Estimated Tasks:** 13
**Milestone:** 4 — Shipped
**Dependencies:** Phase 5 complete (Phase 6 strongly recommended)

---

## Overview

Remove the Handlebars legacy, switch GitHub Pages to branch-deploy from `/docs`, and ship the new site to the custom domain. This phase is where the cutover happens — do it deliberately, with a commit per logical step so any rollback is clean.

## Prerequisites

- Phase 5 complete, ideally Phase 6 complete (fully polished site)
- `docs/` builds cleanly with `CNAME` + `.nojekyll`
- Admin access to the GitHub repo settings (Pages source configuration requires it)
- Current site at `www.equilllabs.com` is the Handlebars-built version — confirm before cutover

## Tasks

### Legacy Deletion

- [ ] **Task 7.1:** Delete `build.js` and `config.js` from repo root. Verify no other files import them (`grep -r "require.*build.js\|require.*config.js" .` should return no results outside `node_modules`).
- [ ] **Task 7.2:** Delete `src/templates/` recursively. Verify no Astro components reference `.hbs` files (`grep -r "\.hbs" src/`).
- [ ] **Task 7.3:** Delete `src/static/` recursively. At this point Phase 1 already migrated the contents to `public/`; this step removes the originals. Verify `public/CNAME`, `public/brand/`, `public/projects/`, `public/site.webmanifest` all still exist.
- [ ] **Task 7.4:** Delete `pages/` directory recursively (the old Handlebars build output). This was replaced by `docs/` in Phase 1. Double-check that `pages/CNAME` was already mirrored to `public/CNAME` before deleting.
- [ ] **Task 7.5:** Delete `.github/workflows/static.yml` — the Actions-based deploy is retired in favor of branch-deploy. Remove the `.github/workflows/` directory if it's now empty.
- [ ] **Task 7.6:** Remove legacy npm deps from `package.json` `devDependencies`: `handlebars`, `nodemon`, `serve`. Remove any remaining `"watch"` or `"serve"` scripts that referenced them. Run `rm -rf node_modules package-lock.json && npm install` to clean-rebuild the dep tree.

### Build Verification

- [ ] **Task 7.7:** Run a full clean build: `rm -rf docs/ .astro/ && npm run build`. Verify: (a) exit code 0; (b) `docs/CNAME` contains `www.equilllabs.com` (no trailing whitespace, no BOM); (c) `docs/.nojekyll` exists as 0 bytes; (d) `docs/index.html` renders correctly when opened directly (file://); (e) `docs/pagefind/` present (from Phase 6); (f) `docs/og/` contains PNG files; (g) `docs/sitemap-index.xml` present. Commit the delta.

### Commit + Push

- [ ] **Task 7.8:** Stage and commit all changes with descriptive messages. Suggested sequence: (1) `legacy: remove Handlebars build system` covering Tasks 7.1-7.4; (2) `ci: remove Actions deploy workflow` for Task 7.5; (3) `deps: remove legacy npm packages` for Task 7.6; (4) `build: regenerate docs/ with new site` for Task 7.7. Push to `redesign` branch: `git push origin redesign`. DO NOT merge to `main` yet — the Pages source is still Actions-based, and a merge would trigger the old workflow (which has been deleted — but GitHub Pages may have cached settings).

### Switch GitHub Pages Source

- [ ] **Task 7.9:** In the GitHub repo web UI → Settings → Pages: (a) under "Build and deployment", change "Source" from **GitHub Actions** to **Deploy from a branch**; (b) set Branch to `main`, Folder to `/docs`; (c) click Save. Wait for the "Your site is being deployed" banner. This will initially deploy from `main` — which still has the OLD Handlebars-built site (since we haven't merged). Expect the live site to briefly show the old content until the merge lands.
- [ ] **Task 7.10:** Merge `redesign` → `main`: `git checkout main && git merge --no-ff redesign -m "redesign: launch v2 site built with Astro"`. Push: `git push origin main`. GitHub Pages will detect the new `/docs` content and redeploy automatically (typically 1-3 minutes).

### Post-Deploy Verification

- [ ] **Task 7.11:** Verify live site: (a) `https://www.equilllabs.com/` loads the new Astro-built site (hard-refresh to bypass cache: Ctrl+Shift+R); (b) HTTPS is active, certificate valid (GitHub auto-manages); (c) all primary routes work: `/projects/`, `/projects/semantic-chunking/`, `/about/`; (d) DNS check: `nslookup www.equilllabs.com` resolves to GitHub IPs; (e) apex `equilllabs.com` redirects to `www.equilllabs.com` (GitHub Pages handles this if DNS is configured with A records to GitHub IPs); (f) `/sitemap-index.xml`, `/robots.txt`, `/og/default.png` all return 200.
- [ ] **Task 7.12:** Handle URL continuity. The old Handlebars site had `/projects/semantic-chunking.html` style URLs; the new Astro site uses `/projects/semantic-chunking/` (trailing-slash directory). Check whether Astro config `trailingSlash: 'always'` + `build: { format: 'directory' }` emits both `/projects/semantic-chunking/index.html` and a redirect stub — if not, manually create `public/projects/<slug>.html` redirect stubs with `<meta http-equiv="refresh" content="0; url=/projects/<slug>/">` for each prior project URL. List prior URLs: inspect `.git` history of `pages/projects/` or current live site sitemap before cutover. Only add redirects for slugs that genuinely existed in the old site (list from old `pages/projects/*.html` — pixel-banner, rich-foot, semantic-chunking, chunk-match, bedrock-wrapper, fast-topic-analysis, bedrock-proxy-endpoint, web-augmented-generation, trim-style).

### Smoke

- [ ] **Task 7.13:** End-to-end launch smoke test. (a) External uptime check: `curl -I https://www.equilllabs.com/` returns HTTP/2 200, `server: GitHub.com`; (b) mobile render check on actual phone (not DevTools emulation) — iOS Safari + Android Chrome; (c) share a project URL on Slack/Twitter — OG preview renders the generated PNG; (d) theme toggle persists across page nav; (e) `/refresh-portfolio` skill still runs end-to-end (Phase 3 flow unchanged); (f) `git log --oneline -5` shows clean history with descriptive messages; (g) GitHub Actions tab shows no runs (workflow deleted, branch-deploy doesn't use Actions).

## Phase Testing

- [ ] **Smoke 7.A:** Legacy files (`build.js`, `config.js`, `src/templates/`, `src/static/`, `pages/`, `.github/workflows/`) removed from repo.
- [ ] **Smoke 7.B:** `npm run build` from clean state produces valid `docs/`.
- [ ] **Smoke 7.C:** `npm ls` shows no `handlebars`, `nodemon`, `serve` in the tree.
- [ ] **Smoke 7.D:** `https://www.equilllabs.com/` serves the new site with valid HTTPS.
- [ ] **Smoke 7.E:** Prior project URLs (e.g., `/projects/semantic-chunking.html`) redirect or resolve to new locations (302 or 200 via redirect stub).
- [ ] **Smoke 7.F:** GitHub Pages settings UI reports "Source: Deploy from a branch · Branch: main · Folder: /docs · Status: Live".

## Acceptance Criteria

- All legacy Handlebars code, assets, and workflows deleted from repo.
- `package.json` contains only Astro-era dependencies.
- `docs/` builds cleanly with CNAME + `.nojekyll` at root.
- GitHub Pages source switched to branch-deploy from `main /docs`.
- `redesign` branch merged to `main`.
- Live site at `https://www.equilllabs.com/` serves the new Astro-built site.
- HTTPS active with valid certificate.
- Prior project URLs redirect to new locations.
- No Actions workflows run on push to main.

## Notes

- **Rollback plan:** if cutover goes sideways, revert is fast. Either (a) revert the Pages source back to "GitHub Actions" in Settings (the `static.yml` is deleted so this will fail — recover by cherry-picking the file back from git history and re-pushing), or (b) `git revert` the merge commit on `main`, push, and the old `pages/` content takes over (but `pages/` was also deleted — see option c), (c) `git push origin main~1:main --force-with-lease` to roll main back one commit BEFORE executing Task 7.10 merge. **Safest rollback:** keep a backup branch: `git branch backup-handlebars <commit-before-7.1>` before starting this phase.
- **DNS:** user did not report DNS changes needed — current `www.equilllabs.com` → GitHub CNAME should continue working. Don't touch DNS unless verification reveals a problem.
- **Cache caveats:** GitHub Pages CDN caches aggressively. After Task 7.10, the site may take up to 10 minutes to fully propagate. Force refresh with `?v=1` query param if testing during that window.
- **Trailing-slash consistency:** `trailingSlash: 'always'` + `build.format: 'directory'` means Astro produces `docs/projects/<slug>/index.html`. Astro automatically emits 301-style redirects for the non-slash form only if `redirects` config is added. For the old `.html` URLs, manual redirect stubs in `public/projects/<slug>.html` are required.
- **Don't merge to main with the old Actions workflow still present.** If the sequence is reversed (merge first, then switch source), the deleted workflow file won't trigger anything (GitHub Actions only runs on-push workflows, and we deleted ours), so it's actually safe. But to avoid confusion, do Pages source switch _first_ at Task 7.9 then merge at Task 7.10 as ordered.
- **Task 7.12 is fiddly:** if the old site's project URL format matches the new one exactly (check `pages/projects/semantic-chunking.html` — if the path is `/projects/semantic-chunking.html`, that's a different URL than `/projects/semantic-chunking/`). Decide: either accept broken external links to the `.html` form (low traffic portfolios can survive this) or invest in redirect stubs. Recommend stubs for the 9 known repos that existed in the old site.

## Phase Completion Summary

_(Filled after implementation)_

- **Completion date:**
- **Implementer:**
- **Commits:**
- **What was done:**
- **Files changed:**
- **Issues encountered:**
- **Deviations from plan:**
- **Rollback invoked:**
