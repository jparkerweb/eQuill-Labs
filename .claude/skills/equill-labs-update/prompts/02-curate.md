# Phase 2: Curate (in-memory)

## Inputs

- `data/github-snapshot.json` (from phase 1)
- `site/featured.json` (source-of-truth for curation overrides — **read-only** in this phase)
- Optional user guidance string (free-form)

## Purpose

Apply user guidance on top of the committed `site/featured.json`. This phase produces an **in-memory** curated list used by subsequent phases. It writes nothing to disk, and it never modifies `site/featured.json` — such edits are surfaced as diff proposals in phase 5 only.

## Guidance parsing rules

If the user provided a guidance string, parse it with the following keyword rules. Apply the resulting overrides **in memory** on top of a fresh copy of `site/featured.json`:

| Keyword pattern                                          | Effect                                                          |
| -------------------------------------------------------- | --------------------------------------------------------------- |
| `feature <repo-name>` / `feature X`                      | Append `<repo-name>` to `overrides.featured` (in-memory copy).  |
| `hide <repo-name>` / `hide X`                            | Append `<repo-name>` to `overrides.hidden` (in-memory copy).    |
| `emphasize <theme>` (e.g., `emphasize agents`)           | For each curated project whose `theme` matches, decrement its `sortOrder` by 100 (boost to top). |
| `de-emphasize <theme>` / `downplay <theme>`              | Increment matching theme's `sortOrder` by 100.                  |
| `reorder: A, B, C`                                       | Replace `overrides.featured` (in-memory) with `[A, B, C]`.      |

**Critical:** guidance can only reorder, filter, or boost. It **cannot** invent facts, rename repos, or change repo metadata. If guidance is ambiguous, the skill should ask a single clarifying question before proceeding.

## Steps

1. Read `data/github-snapshot.json` and `site/featured.json`.
2. If guidance is present, clone `site/featured.json` into memory and apply the parsing rules above.
3. Call the `curate()` function from `scripts/curate.ts` (imported by subsequent phases; here just describe expected output) with the in-memory overrides.
4. Compute the diff between the new curated list and the previous build manifest:
   - Compare `curated[].slug` to `data/build-manifest.json` → `projects[].slug`.
   - Report counts: `+{added} new, ~{reordered} reordered, -{removed} gone`.

## Outputs

- Nothing on disk. The curated list and the effective in-memory overrides pass through to phases 3 and 4 via re-reading the snapshot plus the guidance string.

## Reporting

Print a compact summary:

```
Curated N projects (F featured, P pinned, H hidden by overrides).
Diff vs last run: +X added, ~Y reordered, -Z removed.
```

## Next phase

Proceed to [03-write-blurbs](./03-write-blurbs.md).
