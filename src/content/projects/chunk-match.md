---
id: chunk-match
name: chunk-match
slug: chunk-match
tagline: >-
  A NodeJS library that semantically chunks text and matches it against a user
  query using cosine similarity for precise and relevant text retrieval.
description:
  short: >-
    Node.js library that semantically chunks text and matches it against a query
    using cosine similarity.
  long: >-
    A Node.js library that semantically chunks text and matches it against a
    user query using cosine similarity for relevant text retrieval. It returns
    chunks sorted by relevance with similarity scores, and exposes configurable
    similarity thresholds and chunk sizes. It is built on top of
    semantic-chunking for the underlying text processing and supports various
    ONNX embedding models. The main `matchChunks(documents, query, options)`
    function takes an array of document objects, a query string, and options
    such as maxResults, minSimilarity, and detailed chunkingOptions.
banner:
  src: 'https://github.com/jparkerweb/chunk-match/blob/main/chunk-match.jpg?raw=true'
  alt: chunk-match banner
  source: repo
topics:
  - chunking
  - cosine-similarity
  - embeddings
  - equill-library
category: library
theme: nlp
primaryLanguage: JavaScript
languages:
  - name: JavaScript
    percent: 50.38
  - name: HTML
    percent: 23.28
  - name: CSS
    percent: 26.15
  - name: Batchfile
    percent: 0.19
stars: 4
links:
  repo: 'https://github.com/jparkerweb/chunk-match'
  homepage: 'https://www.npmjs.com/package/chunk-match'
featured: false
sortOrder: 996
status: active
lastCommit: '2026-04-17T15:15:18Z'
_source:
  repo: 'https://github.com/jparkerweb/chunk-match'
  sha: HEAD
  fetchedAt: '2026-06-06T21:46:37.051Z'
---
A Node.js library that semantically chunks text and matches it against a user query using cosine similarity for relevant text retrieval. It returns chunks sorted by relevance with similarity scores, and exposes configurable similarity thresholds and chunk sizes. It is built on top of semantic-chunking for the underlying text processing and supports various ONNX embedding models. The main `matchChunks(documents, query, options)` function takes an array of document objects, a query string, and options such as maxResults, minSimilarity, and detailed chunkingOptions.

## Installation

```bash
npm install chunk-match
```
