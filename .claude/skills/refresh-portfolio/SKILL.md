---
name: refresh-portfolio
description: "Regenerate eQuill Labs content from GitHub with optional guidance. Stops for human review before build and before commit."
---

# refresh-portfolio

## Purpose

Orchestrates the eQuill Labs content pipeline end-to-end: fetch GitHub repo data for `jparkerweb`, apply curation overrides, write AI blurbs for changed repos only, render validated Markdown into the Astro content collection, build the static site, and stop for human review and commit. Every AI write is grounded in a README span, and the skill never commits or pushes on the user's behalf.

## When to use

The user runs `/refresh-portfolio` with an optional guidance prompt (e.g., `/refresh-portfolio emphasize AI agents`). Use this skill whenever the site's project content needs to be synced with the latest state of `jparkerweb`'s public GitHub repositories, or when the user wants to surface different projects without hand-editing individual content files.

## Phases

1. [Fetch GitHub snapshot](./prompts/01-fetch.md)
2. [Curate in-memory list](./prompts/02-curate.md)
3. [Write AI blurbs](./prompts/03-write-blurbs.md)
4. [Render content collection](./prompts/04-render.md)
5. [Propose diffs for hand-authored files](./prompts/05-review-gate.md)
6. [Review gate](./prompts/05-review-gate.md)
7. [Build](./prompts/05-review-gate.md)
8. [Commit gate](./prompts/05-review-gate.md)

See `prompts/` for phase details. Phases 5–8 are orchestrated by `05-review-gate.md`.

## Inputs

- **Optional user guidance** (free-form string): tone direction (e.g., "lean more technical"), emphasis (e.g., "feature AI agent projects"), exclusions (e.g., "hide obsidian plugins for this run"). Guidance can reorder, filter, or adjust tone — it can **never** invent facts about repos.

## Outputs

- `data/github-snapshot.json` (updated)
- `data/ai-cache.json` (appended with new blurbs)
- `data/build-manifest.json` (regenerated)
- `src/content/projects/**.md` (added/modified/removed)
- `data/proposals/*.diff` (optional — only when guidance implies hand-authored file edits)
- `docs/**` (built output, after user approval)

## Invariants

The skill never writes to:

- `src/components/**`
- `src/layouts/**`
- `src/pages/**` (`.astro` files)
- `src/content/pages/**`
- `site/featured.json`

Edits to any of the above are surfaced as `.diff` files under `data/proposals/` for the user to apply manually with `git apply`. The skill also **never** calls `git commit`, `git push`, or `git apply`.

## Review-gate interaction pattern

Before running `npm run build`, the skill must:

1. Print the diff stat summary: `git diff --stat` followed by category counts (e.g., `N content files, M data files, K proposal diffs`).
2. Print the literal text: `Reply 'approved' to build, 'reject' to revert, 'abort' to stop.`
3. Parse only those three literal replies. Any other text → re-prompt with the same instruction. Do **not** accept fuzzy matches like `yes`, `ok`, `lgtm`, or `y`.
4. On `approved`: run `npm run build`, then proceed to the commit-gate.
5. On `reject`: print the `git restore` command set for the changed files and exit 0 without building.
6. On `abort`: exit 1 immediately, no cleanup.

## Commit-gate interaction pattern

After a successful build, the skill must:

1. Run and display `git status --short`.
2. Print a suggested commit message in the form: `content: refresh GitHub snapshot (N added, M modified)` — where N and M come from the change-set counts.
3. Print the literal text: `Review the diff, commit when ready. The skill stops here — commits are manual.`
4. Exit. Do **not** call `git commit`, `git push`, or any git-mutating command.

See `prompts/` for phase details.
