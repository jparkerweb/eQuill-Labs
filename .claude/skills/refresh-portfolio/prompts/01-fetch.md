# Phase 1: Fetch GitHub snapshot

## Steps

1. **Verify `gh` auth.** Run `gh auth status`. If it exits non-zero or the output says "not logged in":

   - Print to the user:
     ```
     ERR_GH_AUTH
     The `gh` CLI is not authenticated with `repo` scope.
     Run: gh auth login -s repo
     Then re-invoke /refresh-portfolio.
     ```
   - **Stop the skill.** Do not proceed to fetch.

2. **Run the fetcher.** Execute: `npm run refresh:fetch`

3. **Interpret the outcome.**

   - **On success** (exit 0): the script prints `Wrote data/github-snapshot.json with N repos`. Report to the user:
     ```
     Fetched N repos for jparkerweb.
     ```

   - **On `ERR_GH_AUTH`** (exit 1): the script already printed the error. Repeat the instruction to the user and **stop**:
     ```
     ERR_GH_AUTH
     Run: gh auth login -s repo
     ```

   - **On `ERR_GRAPHQL`** (exit 2): the script printed the underlying error. If the error message contains `rate limit` or `X-RateLimit-Reset`:
     - Parse the `X-RateLimit-Reset` epoch timestamp from the error body if present.
     - Convert to a human wait time: `wait = resetTimestamp - now()`.
     - Report:
       ```
       GitHub API rate-limit hit. Wait approximately {N} minutes ({resetTime}) before retrying.
       ```
     - **Stop.**
     - If no reset header is available, report the raw error and stop.

## Outputs

- `data/github-snapshot.json` — written atomically. `fetchedAt` is preserved when the canonical payload is identical to the previous run (zero-change detection).

## Next phase

Proceed to [02-curate](./02-curate.md) only on success.
