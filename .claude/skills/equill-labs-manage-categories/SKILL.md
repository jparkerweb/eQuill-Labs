---
name: equill-labs-manage-categories
description: "List, add, edit, or remove project categories (library, plugin, cli, service, app, demo) in the eQuill Labs site. Use whenever the user wants to review current categories, introduce a new one, rename an existing one, delete one, or change how the auto-derivation rules in `scripts/curate.ts` map GitHub topics to a category. Trigger on phrases like 'add a new category', 'rename the cli category', 'what categories do we have', 'remove the demo category', 'change how X is categorized', 'project type', or any mention of modifying the Type filter on the projects page."
---

# equill-labs-manage-categories

## Purpose

Walk the user through the full workflow of managing project **categories** (the "Type" shown on each project card and the Type filter chip group). Categories are kept in sync across four source files and the generated Markdown content collection; this skill exists because a change in one spot without the others silently breaks the build or the UI.

## When to use

Any user request about project **categories / types / Type filter**, including:

- "What categories do we currently have?" → list them (Step 1 only)
- "Add a new category called `framework`" → full add flow
- "Rename `cli` to `script`" → full edit flow
- "Remove the `demo` category" → full remove flow
- "Change how Obsidian plugins get classified" → edit derivation rules only

## Canonical source files

Any change touches some subset of these. Always hold them in a consistent state.

| File | Role |
|---|---|
| `scripts/curate.ts` | Category type union, `CATEGORY_OVERRIDE_TOPICS`, and `deriveCategory()` — the **single source of derivation rules**. |
| `scripts/render-content.ts` | Zod enum for category (validates the output of the render step). |
| `src/content.config.ts` | Zod enum for category (validates Astro content collection frontmatter). |
| `src/components/projects/ProjectFilters.astro` | `TYPES` const driving the Type filter chips. |
| `README.md` | The "Project Categories (GitHub Topics → Type)" section users read to know what topics to tag their repos with. |
| `src/content/projects/*.md` | Generated frontmatter — never hand-edit; regenerate via the pipeline. |

## Workflow

Follow these steps. Show the user what you're about to change before editing, and ask for confirmation at the decision points called out below.

### Step 1 — List current categories (always do this first)

Read `scripts/curate.ts` and extract:

1. The `category:` union on the `CuratedProject` type.
2. The `CATEGORY_OVERRIDE_TOPICS` array (these are the `equill-<name>` force-override topics).
3. Each `if` branch of `deriveCategory()` — for each branch, capture the triggering topics/homepage heuristics and the category it returns.

Also tally how many projects currently land in each category by grepping `^category:` across `src/content/projects/*.md`.

Present as a compact table:

```
Current categories (priority order in deriveCategory):

1. service  → mcp, mcp-server, api, proxy, endpoint, serverless, hub.docker.com homepage
2. plugin   → obsidian-plugin, obsidian, plugin, browser-extension
3. library  → npm, npm-package, library, npmjs.com/package/ homepage
4. cli      → cli, powershell, bash-script, shell-script
5. app      → name ends in `-app`, or any non-npm/non-docker homepage
6. demo     → fallback

Override topic: equill-<category> always wins.

Distribution: library(11), service(3), app(6), cli(2), plugin(1), demo(22)
```

Then ask what they want to do: **add / edit / remove / change rules only**. If they only asked "what categories do we have," stop here.

### Step 2 — Confirm the change

Before editing anything, restate the change as a concrete plan that the user can accept or redirect. Include:

- The new/edited/removed category name
- The topics / heuristics that should trigger it (for add/edit)
- Where it sits in the priority chain (ordering matters — the first match wins)
- Which existing projects will move into or out of it after regeneration
- Whether the override topic alias (`equill-<name>`) is being added/removed

For `remove`, explicitly ask: *where should projects currently in `<category>` fall through to?* The answer shapes how the branch is deleted (drop through to next rule vs. remap to a specific other category).

### Step 3 — Apply the edits

For **add / rename / remove**, edit all of these in one pass so the repo is never in a broken intermediate state:

1. **`scripts/curate.ts`**
   - Update the `category:` type union on `CuratedProject`.
   - Update `CATEGORY_OVERRIDE_TOPICS` to include/exclude the `equill-<name>` entry.
   - Insert / rename / delete the matching branch in `deriveCategory()`. Keep the priority comment (`// N. <purpose>`) in sync and renumber subsequent comments if a branch was inserted/removed.
2. **`scripts/render-content.ts`** — update `z.enum([...])` for `category`.
3. **`src/content.config.ts`** — update `z.enum([...])` for `category`.
4. **`src/components/projects/ProjectFilters.astro`** — update the `TYPES` tuple.
5. **`README.md`** — update the "Project Categories (GitHub Topics → Type)" section:
   - The category table (first table, with examples)
   - The numbered priority rules list
   - Any example topic in the `equill-<name>` override bullet

For a **rules-only change** (e.g., "also treat `deno` as a library"), touch only `scripts/curate.ts` and the README rules list. Skip the Zod enums and `TYPES` tuple because the category set itself didn't change.

### Step 4 — Regenerate content

Run:

```bash
npm run refresh:render
```

This re-derives every project's `category` from the new rules and rewrites any `src/content/projects/*.md` whose frontmatter changed. If a category was removed but is still referenced by rendered files, the Zod schema will reject them — regeneration will either fix them (if `deriveCategory()` now returns a different valid category) or fail loudly (a sign Step 3 was incomplete). Read the `Rendered N, skipped M` summary and share it with the user.

### Step 5 — Verify

1. Run `npm run check` and report the result (0 errors expected).
2. Re-grep `^category:` across `src/content/projects/` and show the new distribution so the user can eyeball it.
3. List any repos whose category **changed** vs. before Step 4 (diff the pre/post grep results).

### Step 6 — Hand off

Do **not** commit. Summarize what changed, the new distribution, and suggest next steps:

- If the user has repos that should adopt the new category, remind them to add the corresponding GitHub topic (or the `equill-<name>` override) and rerun `npm run refresh:all` to pick it up.
- If a category was removed, mention any repos that migrated so the user can decide whether to add `equill-<other>` overrides for ones that should have landed somewhere specific.

## Guardrails

- **Never hand-edit `category:` in a generated `src/content/projects/*.md` file.** It'll be overwritten on the next render. The correct lever is either a GitHub topic on the repo or the derivation rules in `curate.ts`.
- **Priority order is semantic, not alphabetical.** More specific rules go first (e.g., `service` before `library` so an npm package that's also an MCP server gets classified as `service`). When inserting a new category, ask the user where in the chain it should live.
- **Keep the `equill-<name>` override alias convention.** Users rely on it as an escape hatch when the heuristics pick the wrong bucket; dropping it silently would break that contract.
- **Don't invent categories on the user's behalf.** If the request is ambiguous ("we need more categories for the AI stuff"), ask what the axis is — the existing set partitions by *deployment shape* (library vs plugin vs service vs app), not by *topic area* (that's what `theme` is for in the same schema).

## Related

- Existing category docs (user-facing): `README.md` → "Project Categories (GitHub Topics → Type)"
- Related but separate concept: `theme` (nlp, infra, agents, obsidian, utilities) is derived in `deriveTheme()` in the same file. If the user asks about themes rather than categories, the same five-file discipline does **not** apply — themes are only enumerated in `curate.ts`, `render-content.ts`, `src/content.config.ts`, and `ProjectFilters.astro` (no README doc section yet). Flag the asymmetry and ask whether they want the skill extended to cover themes.
