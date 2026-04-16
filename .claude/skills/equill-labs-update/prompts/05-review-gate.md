# Phase 5–8: Propose diffs → Review gate → Build → Commit gate

This single prompt covers the final four phases of the skill because they are tightly coupled around user approval.

## Phase 5: Propose diffs for hand-authored files

If the user's guidance implies tone or copy changes to any of these hand-authored files:

- `src/pages/index.astro` (hero copy)
- `src/content/pages/about.md`
- `site/featured.json`

…produce a proposed edit and surface it as a `.diff` artifact. **Never edit these files directly.**

### Steps

1. For each suggested edit, write the new proposed content to a temporary file (e.g., `data/.tmp/index-proposal.astro`).
2. Run:
   ```
   tsx scripts/propose-diffs.ts --target <original> --proposal <temp-file> --reason "<short-reason>"
   ```
   This writes `data/proposals/<basename>.diff` with a metadata header.
3. Log to the user:
   ```
   Proposed edit: data/proposals/<basename>.diff
     Review:  git apply --check data/proposals/<basename>.diff
     Apply:   git apply data/proposals/<basename>.diff
     Reject:  rm data/proposals/<basename>.diff
   ```

If guidance implies no copy edits, skip this phase entirely — **no empty proposals**.

## Phase 6: Review gate

### Steps

1. Run `git diff --stat` and `git diff --numstat`.
2. Categorize the changed paths:
   - `src/content/projects/**.md` → **content files**
   - `data/**` → **data files**
   - `data/proposals/*.diff` → **proposal diffs**
3. Print the summary:
   ```
   Changes: X files, +Y/-Z lines.
   Categories: N content files, M data files, K proposal diffs.
   ```
4. If proposal diffs exist, show the first 40 lines of each with a header:
   ```
   === data/proposals/<name>.diff ===
   <first 40 lines>
   ...
   ```
5. Print the literal prompt:
   ```
   Reply 'approved' to build, 'reject' to revert, 'abort' to stop.
   ```
6. **Parse only literal `approved`, `reject`, `abort`.** Any other reply (`yes`, `ok`, `lgtm`, `y`, etc.) triggers a re-prompt with the same instruction — do **not** fuzzy-match.

### Branch actions

- **`approved`:** proceed to Phase 7 (Build).
- **`reject`:** compute the set of changed files and print:
  ```
  To revert, run:
    git restore <file1> <file2> ... <fileN>
    rm data/proposals/*.diff  # (if any)
  ```
  Exit 0 without building.
- **`abort`:** exit 1 immediately. No cleanup, no revert suggestions.

## Phase 7: Build

### Steps

1. Run: `npm run build`
2. On success (exit 0): proceed to Phase 8.
3. On failure: dump the build output tail and halt with exit 2. Tell the user the content changes are still on disk — they can fix and re-run the skill or `git restore` to abandon.

## Phase 8: Commit gate

### Steps

1. Run: `git status --short`
2. Compute change-set counts from the manifest diff (N added, M modified).
3. Print:
   ```
   Suggested commit message:
     content: refresh GitHub snapshot (N added, M modified)

   Review the diff, commit when ready. The skill stops here — commits are manual.
   ```
4. Exit 0.

**The skill must not call `git commit`, `git push`, `git apply`, or any mutating git command.** Commits are the user's responsibility.
