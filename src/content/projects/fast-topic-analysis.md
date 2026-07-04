---
id: fast-topic-analysis
name: fast-topic-analysis
slug: fast-topic-analysis
tagline: >-
  A tool for analyzing text against predefined topics using average weight
  embeddings and cosine similarity.
description:
  short: >-
    A tool for analyzing text against predefined topics using average weight
    embeddings and cosine similarity.
  long: >-
    A tool for analyzing text against predefined topics using average weight
    embeddings and cosine similarity. It creates several weighted average
    embeddings for each topic instead of a single representation, capturing
    different semantic variations, and groups similar phrases within topics into
    coherent clusters using agglomerative or HDBSCAN algorithms. Cluster quality
    is measured via per-cluster cohesion and a global silhouette score, and
    preset configurations are offered for high precision, balanced, and
    performance use cases. The project centers on a generator that creates topic
    embeddings from training data and an interactive demo that analyzes text
    against them, powered by the embedding-utils library.
banner:
  src: >-
    https://raw.githubusercontent.com/jparkerweb/fast-topic-analysis/main/.readme/buckets.jpg
  alt: fast-topic-analysis banner
  source: repo
topics:
  - embeddings
  - huggingface
  - nlp
  - onnx
  - semantic-analysis
  - text-analysis
  - text-classfication
  - topic-detection
  - transformers
  - equill-app
category: app
theme: nlp
primaryLanguage: JavaScript
languages:
  - name: JavaScript
    percent: 100
stars: 9
links:
  repo: 'https://github.com/jparkerweb/fast-topic-analysis'
  homepage: 'https://www.equilllabs.com/projects/fast-topic-analysis'
featured: true
sortOrder: 7
status: active
lastCommit: '2026-05-27T18:13:06Z'
_source:
  repo: 'https://github.com/jparkerweb/fast-topic-analysis'
  sha: HEAD
  fetchedAt: '2026-07-04T00:36:27.186Z'
---
A tool for analyzing text against predefined topics using average weight embeddings and cosine similarity. It creates several weighted average embeddings for each topic instead of a single representation, capturing different semantic variations, and groups similar phrases within topics into coherent clusters using agglomerative or HDBSCAN algorithms. Cluster quality is measured via per-cluster cohesion and a global silhouette score, and preset configurations are offered for high precision, balanced, and performance use cases. The project centers on a generator that creates topic embeddings from training data and an interactive demo that analyzes text against them, powered by the embedding-utils library.

## Setup

Install dependencies:

```bash
npm install
```
