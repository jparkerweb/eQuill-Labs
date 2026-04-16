# Phase 3: Write AI blurbs

<rules>

**Hallucination-safety rules (non-negotiable). Apply to every blurb you write.**

**(a) Quote-or-omit.** Every feature claim or technical detail in a blurb MUST correspond to a verbatim substring in the README (case-insensitive match on noun phrases is acceptable, but the underlying claim must be defensible by pointing to a README span). If you cannot point to a quote, do not write the claim.

**(b) No superlatives.** The following words are banned unless appearing as a direct quote from the README: `fast`, `powerful`, `cutting-edge`, `seamless`, `robust`, `elegant`, `best-in-class`, `state-of-the-art`, `revolutionary`, `game-changing`, `blazing`, `lightning`. If the user's own README contains such a word, you may echo it inside quote marks.

**(c) Null over guess.** If the README is absent or empty, use the raw GitHub `description` field verbatim as `shortDescription` and leave `longDescription` empty. If `description` is also null/empty, emit empty strings for both. Do **not** invent content.

**(d) Length limits.**
  - `shortDescription`: ONE sentence, ≤160 characters.
  - `longDescription`: ≤3 sentences.

**(e) Grounding check.** After generating a blurb, produce `quotedSpans`: for each sentence in short+long, list the README substring(s) that support it. If any sentence has no supporting span, **discard the blurb and retry once** with a stricter prompt. If the second attempt also fails grounding, emit empty strings for that field (null over guess).

**(f) Tone.** Plain, declarative, engineer-voice. No marketing copy, no rhetorical questions, no emojis.

</rules>

## Inputs

- `data/github-snapshot.json`
- `data/ai-cache.json` (content-hash keyed cache from prior runs)
- `data/build-manifest.json` (for change-set computation)
- In-memory curated list from phase 2

## Steps

1. **Prepare the request manifest.** Run:
   ```
   tsx scripts/write-blurbs.ts --change-set-only
   ```
   This computes the change-set from `build-manifest.json` and writes `data/blurb-requests.json` listing only `added` and `modified` repos. For `unchanged` repos, the script confirms the cache entry is present and reusable.

2. **For each entry in `data/blurb-requests.json`:**

   For repo `{slug}`, the manifest provides:
   - `contentHash` (the cache key)
   - `readmeExcerpt` (first 2000 chars of the README)
   - `description` (GitHub `description` field)
   - `topics` (list of repo topics)
   - `primaryLanguage` (or null)

   Generate a blurb by calling Claude with a prompt shaped like:

   > You are writing a short catalog blurb for a software project. Follow the rules in `<rules>` exactly.
   >
   > **README excerpt:**
   > ```
   > {readmeExcerpt}
   > ```
   >
   > **GitHub description:** {description}
   > **Topics:** {topics}
   > **Primary language:** {primaryLanguage}
   >
   > Return JSON only, in this exact shape:
   > ```json
   > { "shortDescription": "...", "longDescription": "...", "quotedSpans": ["...", "..."] }
   > ```
   >
   > Set `temperature: 0`. Use the pinned model `claude-opus-4-6-20250101`.

3. **Validate each response against the rules.** If `quotedSpans` is empty or any sentence lacks a supporting span, retry once with the prompt: `Your previous blurb failed the grounding check. Rewrite so every claim maps to a README span. If you cannot, return empty strings.` If the second attempt also fails, store empty strings.

4. **Append to cache.** For each successful blurb, write to `data/ai-cache.json`:
   ```json
   {
     "<contentHash>": {
       "slug": "<slug>",
       "shortDescription": "...",
       "longDescription": "...",
       "quotedSpans": ["...", "..."],
       "model": "claude-opus-4-6-20250101",
       "generatedAt": "<ISO-8601>"
     }
   }
   ```
   Use atomic write (temp file + rename) and keep the file sorted by key with `stableStringify`.

5. **For `unchanged` repos:** the cached blurb is already keyed by `contentHash` and will be reused at render time. No action needed here.

6. **Exit codes (emitted by `scripts/write-blurbs.ts` on its own):**
   - `0` — success (or no repos to process)
   - `3` — grounding check failed on second retry (blurbs were emptied, not failed); the skill continues.

## Outputs

- `data/ai-cache.json` (updated)
- `data/blurb-requests.json` (ephemeral; may be removed by the script when done)

## Reporting

```
Generated K new blurbs, reused M cached blurbs, skipped U unchanged.
G grounding-check retries, F final empties.
```

## Next phase

Proceed to [04-render](./04-render.md).
