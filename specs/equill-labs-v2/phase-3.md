# Phase 3: Refresh-Portfolio Skill

**Status:** Not Started
**Estimated Tasks:** 13
**Milestone:** 2 — Skill + Design
**Dependencies:** Phase 2 complete
**Parallel with:** Phase 4 (zero file overlap)

---

## Overview

Package the content pipeline as a Claude Code Skill (`refresh-portfolio`) that orchestrates fetch → curate → write AI blurbs → render → propose diffs → stop for human review → build → stop for human commit. The skill adds the AI-blurb-writing stage on top of the Phase 2 pipeline, with a content-hash cache to keep regeneration idempotent.

## Prerequisites

- Phase 2 complete (`scripts/fetch-github.ts`, `scripts/curate.ts`, `scripts/render-content.ts` working)
- `gh auth status` active with `repo` scope
- Claude Code CLI installed (user-side prerequisite, not a code dep)
- Familiarity with Claude Skills structure (`SKILL.md` with YAML frontmatter + phased prompts)

## Tasks

### Skill Scaffold

- [ ] **Task 3.1:** Create `.claude/skills/refresh-portfolio/SKILL.md` with YAML frontmatter: `name: refresh-portfolio`, `description: "Regenerate eQuill Labs content from GitHub with optional guidance. Stops for human review before build and before commit."`. Body sections: (1) _Purpose_ — 2 sentence summary; (2) _When to use_ — user runs `/refresh-portfolio` with optional prompt; (3) _Phases_ — numbered list of 1-fetch → 2-curate → 3-write-blurbs → 4-render → 5-propose-diffs → 6-review-gate → 7-build → 8-commit-gate, each linking to its prompt file; (4) _Inputs_ — optional user guidance string (tone, emphasis, exclusions); (5) _Outputs_ — modified `data/**`, `src/content/projects/**`, optional `data/proposals/**`, built `docs/**`; (6) _Invariants_ — never writes to `src/components/`, `src/layouts/`, `src/pages/`, `src/content/pages/`, `site/featured.json` (diff proposed instead); never commits. End with "See `prompts/` for phase details."

### Phase Prompts

- [ ] **Task 3.2:** Create `.claude/skills/refresh-portfolio/prompts/01-fetch.md`. Instructs the agent to: run `gh auth status` (if fails, instruct user `gh auth login -s repo` and stop); run `npm run refresh:fetch`; on success, report "Fetched N repos for jparkerweb"; on `ERR_GH_AUTH` report and stop; on `ERR_GRAPHQL` with rate-limit info, parse `X-RateLimit-Reset` and tell user wait time.
- [ ] **Task 3.3:** Create `.claude/skills/refresh-portfolio/prompts/02-curate.md`. Reads `data/github-snapshot.json` + `site/featured.json`. Applies user guidance if provided: guidance can reorder featured, add to hidden, set sortOrder — but cannot invent facts. Guidance keywords: "feature X" → add to `overrides.featured` in-memory; "hide X" → add to hidden; "emphasize AI/MCP/NLP/etc." → boost matching theme's `sortOrder`. Writes nothing; returns the curated list in-memory to next phase. Report diff vs last run.
- [ ] **Task 3.4:** Create `.claude/skills/refresh-portfolio/prompts/03-write-blurbs.md` with hallucination-safety rules up front as a `<rules>` block: (a) _Quote or omit_ — every feature claim must map to a README substring; if you cannot quote it, don't write it; (b) _No superlatives_ — banned words unless quoted: "fast", "powerful", "cutting-edge", "seamless", "robust", "elegant", "best-in-class"; (c) _Null over guess_ — if README absent/empty, use GitHub `description` raw; if that's missing, emit empty string; (d) _Length_ — short description 1 sentence ≤160 chars, long description ≤3 sentences; (e) _Grounding check_ — after generating, list the README spans each sentence maps to; if any sentence has no span, discard and retry once. Then instruct: run `scripts/write-blurbs.ts --change-set-only` — calls AI (via Task tool or the model directly) for `added`/`modified` repos only; uses cached blurb for `unchanged`; writes to `data/ai-cache.json`.
- [ ] **Task 3.5:** Create `.claude/skills/refresh-portfolio/prompts/04-render.md`. Runs `npm run refresh:render`. Reports: N rendered, M unchanged (cache-hit), R removed (obsolete). Runs `astro check`; on schema failure, dumps the issue list and halts.
- [ ] **Task 3.6:** Create `.claude/skills/refresh-portfolio/prompts/05-review-gate.md`. Runs `git diff --stat` and `git diff --numstat`; summarizes "Changes: X files, +Y/-Z lines. Categories: N content files, M data files, K proposal diffs." Shows first 40 lines of each proposal diff (if `data/proposals/*.diff` exist). Asks user to reply literal `approved`, `reject`, or `abort`. On `approved`: run `npm run build`, then go to commit-gate. On `reject`: print `git restore <files>` commands for the changed set, exit 0. On `abort`: exit 1 without cleanup.

### Blurb Writer Script

- [ ] **Task 3.7:** Create `scripts/write-blurbs.ts`. Responsibilities: (a) accept `--change-set-only` flag; (b) read `data/github-snapshot.json`, `data/ai-cache.json`, last `data/build-manifest.json`; (c) compute change-set via `scripts/lib/change-set.ts`; (d) for each `added`/`modified` repo, build the prompt: include README excerpt (first 2000 chars), description, topics, primary language — ask for `{shortDescription, longDescription, quotedSpans: string[]}`; (e) call Claude (via `@anthropic-ai/sdk` if script is standalone, or emit a manifest for the Skill to satisfy — decide based on how the Skill invokes this: if Skill calls Task tool for each blurb, this script just prepares the request manifest; if script calls API directly, include SDK); (f) **Recommended**: script prepares `data/blurb-requests.json` listing repos that need fresh blurbs; the Skill prompt `03-write-blurbs.md` iterates and appends responses to `data/ai-cache.json` via its own writes. This keeps AI calls inside Claude's tool-use context, not behind a separate API key. (g) For `unchanged` repos, copy cached blurb to render-input. (h) Exit code 0 on success, 3 on grounding-check failure.

### Diff Proposer Script

- [ ] **Task 3.8:** Create `scripts/propose-diffs.ts`. Purpose: when user guidance suggests tone/copy changes for hand-authored files (hero copy in `src/pages/index.astro`, About in `src/content/pages/about.md`, `site/featured.json`), the Skill generates a proposed edit and writes it as a `.diff` file — never auto-applies. Responsibilities: (a) accept args `--target <file>` and `--proposal <temp-file-with-new-content>`; (b) compute unified diff via Node's `node:child_process` calling `git diff --no-index <target> <proposal>` OR use `diff` package; (c) write to `data/proposals/<basename>.diff` with metadata header (timestamp, target, reason); (d) log instructions for user: "Review with: `git apply --check data/proposals/<name>.diff`. Apply with: `git apply data/proposals/<name>.diff`. Reject with: `rm data/proposals/<name>.diff`." (e) Never calls `git apply`.

### Schema + Templates

- [ ] **Task 3.9:** Create `.claude/skills/refresh-portfolio/schemas/projects.schema.json` — a JSON Schema version of the Zod `projectSchema` from Phase 2 Task 2.1 (source of truth stays Zod; this is informational for the Skill prompts). Generate via `zod-to-json-schema` or hand-write; keep in sync with `src/content/config.ts`.
- [ ] **Task 3.10:** Create `.claude/skills/refresh-portfolio/templates/proposal.diff.tmpl` — a header template for diff files: `# Proposal: {target}\n# Generated: {timestamp}\n# Reason: {reason}\n# Apply:  git apply data/proposals/{filename}\n# Reject: rm data/proposals/{filename}\n\n{unified_diff}`. Used by `propose-diffs.ts`.

### Orchestration + Gates

- [ ] **Task 3.11:** In `SKILL.md`, define the review-gate as an explicit interaction pattern. Skill must: (a) before `npm run build`, print the diff stat summary and literal text `Reply 'approved' to build, 'reject' to revert, 'abort' to stop.`; (b) parse only those three literal replies; any other text → re-prompt; (c) on `approved`, run build, then proceed to commit-gate.
- [ ] **Task 3.12:** In `SKILL.md`, define the commit-gate similarly: after successful build, print `git status --short`, print a suggested commit message (e.g., `"content: refresh GitHub snapshot (N added, M modified)"`), then print literal text `Review the diff, commit when ready. The skill stops here — commits are manual.` Skill exits after this; does not call `git commit` or `git push`.

### Smoke

- [ ] **Task 3.13:** End-to-end dry run. Temporarily add a synthetic repo to `data/github-snapshot.json` (e.g., `fake-test-repo`) to force a change-set. Run `/refresh-portfolio` (or simulate the phase sequence manually if Claude Code isn't in the loop). Verify: (a) skill reads the synthetic repo as `added`; (b) blurb is generated and cached; (c) render writes `src/content/projects/fake-test-repo.md` with AI-written short/long descriptions; (d) review-gate fires with `git diff` summary; (e) replying `reject` prints `git restore` commands and exits without building; (f) re-run with `approved` runs build, stops at commit-gate without committing. Clean up the synthetic repo from snapshot after.

## Phase Testing

- [ ] **Smoke 3.A:** Skill invoked with no guidance performs all phases and pauses at review-gate.
- [ ] **Smoke 3.B:** Skill invoked with guidance "`emphasize AI agents`" raises `sortOrder` for `agents`-themed repos in the curated list without touching `site/featured.json`.
- [ ] **Smoke 3.C:** Skill with zero GitHub changes since last run pauses at review-gate with "0 files changed" summary.
- [ ] **Smoke 3.D:** Skill with `reject` at review-gate exits 0 without running `npm run build`.
- [ ] **Smoke 3.E:** Skill with `approved` at review-gate builds successfully and stops at commit-gate (no commit made).
- [ ] **Smoke 3.F:** AI blurb grounding-check: a manually crafted README with features ["feature X"] produces a blurb that only mentions feature X. A blurb mentioning feature Y (not in README) is rejected by the grounding check.

## Acceptance Criteria

- `.claude/skills/refresh-portfolio/SKILL.md` exists with YAML frontmatter and phase documentation.
- Five phase prompts exist under `prompts/`.
- `scripts/write-blurbs.ts` and `scripts/propose-diffs.ts` exist and are executable via `tsx`.
- Blurb generation respects quote-or-omit, no-superlatives, null-over-guess rules.
- Review-gate blocks build until explicit user approval.
- Commit-gate blocks commit; skill exits without calling `git commit`.
- AI cache (`data/ai-cache.json`) is content-hash keyed; unchanged repos skip AI calls on rerun.
- Skill never writes to `src/components/`, `src/layouts/`, `src/pages/*.astro`, `src/content/pages/`, or `site/featured.json` directly; edits to those files are proposed as `.diff` artifacts only.

## Notes

- **Claude-side vs script-side AI calls:** Task 3.7 presents two architectures. Preferred: Skill orchestrates AI calls via Claude's built-in tool-use; the script prepares a request manifest and the Skill prompt 03-write-blurbs iterates, calling Claude per repo and appending to `ai-cache.json`. This avoids dual auth paths and keeps the skill self-contained inside Claude Code. Fallback: standalone script with `ANTHROPIC_API_KEY` env var if user wants to run the blurb writer outside Claude Code.
- **Temperature and model pinning:** blurb prompts must specify `temperature: 0` and a pinned model (`claude-opus-4-6-20250101` or equivalent at implementation time) — record in `data/build-manifest.json`. Identical input + pinned model = deterministic output.
- **Grounding validation** in the Skill prompt: after generating blurbs, re-prompt Claude once with "list the README span each sentence is grounded in" and abort if any sentence has no span. Expensive but critical.
- **Review-gate replies are literal:** don't accept fuzzy matches ("yes", "ok", "lgtm" → all rejected). Force `approved`. This is an anti-sloppy-confirmation guard.
- **`site/featured.json` edits** are surfaced as proposal diffs, never direct writes, because this file encodes user intent, not repo state.

## Phase Completion Summary

_(Filled after implementation)_

- **Completion date:**
- **Implementer:**
- **Commits:**
- **What was done:**
- **Files changed:**
- **Issues encountered:**
- **Deviations from plan:**
