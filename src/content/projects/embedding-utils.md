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
    A TypeScript library covering vector math, similarity search, ANN indexing,
    clustering, async pipelines, evaluation metrics, and multi-provider
    embedding generation behind a single import, with zero production
    dependencies. It targets semantic search, RAG pipelines, recommendation
    engines, duplicate detection, and document clustering without pulling in
    heavy ML frameworks or vector databases. The API includes HNSW approximate
    nearest-neighbor search, hybrid search with reciprocal rank fusion and score
    normalization, HDBSCAN clustering, aggregation, quantization, and
    random-projection dimensionality reduction. It also provides markdown-aware
    chunking, storage, model management, and higher-level APIs, plus documented
    local inference setup and multiple embedding providers.
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
    percent: 1.32
  - name: TypeScript
    percent: 98.68
stars: 0
links:
  repo: 'https://github.com/jparkerweb/embedding-utils'
  homepage: 'https://www.npmjs.com/package/embedding-utils'
featured: true
sortOrder: 1
status: active
lastCommit: '2026-08-14T20:35:30Z'
_source:
  repo: 'https://github.com/jparkerweb/embedding-utils'
  sha: HEAD
  fetchedAt: '2026-09-04T20:01:18.794Z'
---
A TypeScript library covering vector math, similarity search, ANN indexing, clustering, async pipelines, evaluation metrics, and multi-provider embedding generation behind a single import, with zero production dependencies. It targets semantic search, RAG pipelines, recommendation engines, duplicate detection, and document clustering without pulling in heavy ML frameworks or vector databases. The API includes HNSW approximate nearest-neighbor search, hybrid search with reciprocal rank fusion and score normalization, HDBSCAN clustering, aggregation, quantization, and random-projection dimensionality reduction. It also provides markdown-aware chunking, storage, model management, and higher-level APIs, plus documented local inference setup and multiple embedding providers.

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
