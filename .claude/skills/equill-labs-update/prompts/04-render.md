# Phase 4: Render content collection

## Steps

1. **Run the renderer.** Execute: `npm run refresh:render`

2. **Parse the output.** The script prints:
   ```
   Rendered N, skipped M (unchanged), removed R obsolete
   ```
   Capture N, M, R for the summary.

3. **Schema validation.** If the script exits with `ERR_SCHEMA_VALIDATE` (exit code 4), it will dump the list of schema issues on stderr:
   ```
   ERR_SCHEMA_VALIDATE
     <slug>: <field>: <message>
     ...
   ```
   Report the full list to the user verbatim and **halt** the skill. Do not attempt to proceed to the review gate with invalid content.

4. **Run `astro check`.** After a successful render, run: `npx astro check`
   - On success: continue.
   - On failure: dump the `astro check` output and halt. The user must fix the collection before the skill can advance.

5. **Regenerate the build manifest.** Execute: `tsx scripts/build-manifest.ts`
   This refreshes `data/build-manifest.json` with the new content-hashes and source records so the next skill run has an accurate change-set baseline.

## Outputs

- `src/content/projects/<slug>.md` — added, modified, and obsolete files removed
- `data/build-manifest.json` — regenerated

## Reporting

```
Rendered N, unchanged M, removed R.
astro check: PASS
Build manifest updated.
```

## Next phase

Proceed to [05-review-gate](./05-review-gate.md).
