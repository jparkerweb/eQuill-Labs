---
id: embedding-utils
name: embedding-utils
slug: embedding-utils
tagline: >-
  Vector math, similarity search, ANN indexing, clustering, async pipelines,
  evaluation metrics, and multi-provider embedding generation -- zero
  dependencies,…
taglineFull: >-
  Vector math, similarity search, ANN indexing, clustering, async pipelines,
  evaluation metrics, and multi-provider embedding generation -- zero
  dependencies, full TypeScript, one import.
description:
  short: >-
    Zero-dependency TypeScript library for vector math, similarity search, ANN
    indexing, clustering, and embedding generation.
  long: >-
    A zero-dependency, full-TypeScript library that bundles vector math,
    similarity search, ANN indexing, clustering, async pipelines, evaluation
    metrics, and multi-provider embedding generation behind a single import. It
    is built to support semantic search, RAG pipelines, recommendation engines,
    duplicate detection, and document clustering without pulling in heavy ML
    frameworks or vector databases. Capabilities include HNSW approximate
    nearest-neighbor search, hybrid search via reciprocal rank fusion (RRF),
    HDBSCAN clustering, quantization, dimensionality reduction through random
    projection, and markdown-aware chunking. It has zero production
    dependencies.
banner:
  src: >-
    https://raw.githubusercontent.com/jparkerweb/embedding-utils/refs/heads/main/embedding-utils.jpg
  alt: embedding-utils banner
  source: repo
topics:
  - cosine-similarity
  - embeddings
  - equill-library
  - npm
  - embedding-library
  - embedding-utils
category: library
theme: nlp
primaryLanguage: TypeScript
languages:
  - name: JavaScript
    percent: 0.81
  - name: TypeScript
    percent: 99.19
stars: 0
links:
  repo: 'https://github.com/jparkerweb/embedding-utils'
  homepage: 'https://www.npmjs.com/package/embedding-utils'
featured: true
sortOrder: 1
status: active
lastCommit: '2026-05-29T03:26:18Z'
_source:
  repo: 'https://github.com/jparkerweb/embedding-utils'
  sha: HEAD
  fetchedAt: '2026-06-06T19:22:18.421Z'
---
A zero-dependency, full-TypeScript library that bundles vector math, similarity search, ANN indexing, clustering, async pipelines, evaluation metrics, and multi-provider embedding generation behind a single import. It is built to support semantic search, RAG pipelines, recommendation engines, duplicate detection, and document clustering without pulling in heavy ML frameworks or vector databases. Capabilities include HNSW approximate nearest-neighbor search, hybrid search via reciprocal rank fusion (RRF), HDBSCAN clustering, quantization, dimensionality reduction through random projection, and markdown-aware chunking. It has zero production dependencies.

## Installation

Requires **Node.js 18+**. Supports both ESM and CommonJS.

```bash
npm install embedding-utils
```

For local ONNX inference (no API key needed), also install the optional peer dependency:

```bash
npm install @huggingface/transformers
```

---
