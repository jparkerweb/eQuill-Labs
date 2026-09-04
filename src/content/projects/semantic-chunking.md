---
id: semantic-chunking
name: semantic-chunking
slug: semantic-chunking
tagline: >-
  NPM Package for Semantically creating chunks from large texts. Useful for
  workflows involving large language models (LLMs).
description:
  short: >-
    NPM package that semantically splits large texts into chunks based on
    sentence similarity, for LLM and RAG workflows.
  long: >-
    An NPM package for semantically creating chunks from large texts, aimed at
    workflows involving large language models. It splits the input into
    sentences, generates a vector for each using a specified ONNX model,
    calculates cosine similarity for each sentence pair, and groups sentences
    into chunks according to a similarity threshold and a maximum token size.
    Adjacent chunks that are similar can optionally be rebalanced and combined
    into larger ones up to that maximum, and the final chunks are returned as an
    array of objects. Configuration covers dynamic similarity thresholds, chunk
    sizes, multiple embedding model options, quantized model support, and chunk
    prefixes for RAG workflows. A web UI for experimenting with settings is
    included and can be run through Docker Compose, alongside a hosted online
    demo.
banner:
  src: >-
    https://github.com/jparkerweb/semantic-chunking/blob/main/semantic-chunking.jpg?raw=true
  alt: semantic-chunking banner
  source: repo
topics:
  - chunking
  - embeddings
  - llm
  - semantic-chunking
  - text-chunking
  - text-splitter
  - text-splitting
  - vector
  - equill-library
category: library
theme: nlp
primaryLanguage: JavaScript
languages:
  - name: JavaScript
    percent: 82.31
  - name: HTML
    percent: 8.82
  - name: CSS
    percent: 8.32
  - name: Dockerfile
    percent: 0.54
stars: 142
links:
  repo: 'https://github.com/jparkerweb/semantic-chunking'
  demo: 'https://semantic-chunking.equilllabs.com/'
  homepage: 'https://www.npmjs.com/package/semantic-chunking'
featured: true
sortOrder: 0
status: active
lastCommit: '2026-08-14T21:04:53Z'
_source:
  repo: 'https://github.com/jparkerweb/semantic-chunking'
  sha: HEAD
  fetchedAt: '2026-09-04T20:01:18.794Z'
---
An NPM package for semantically creating chunks from large texts, aimed at workflows involving large language models. It splits the input into sentences, generates a vector for each using a specified ONNX model, calculates cosine similarity for each sentence pair, and groups sentences into chunks according to a similarity threshold and a maximum token size. Adjacent chunks that are similar can optionally be rebalanced and combined into larger ones up to that maximum, and the final chunks are returned as an array of objects. Configuration covers dynamic similarity thresholds, chunk sizes, multiple embedding model options, quantized model support, and chunk prefixes for RAG workflows. A web UI for experimenting with settings is included and can be run through Docker Compose, alongside a hosted online demo.

## Installation

```bash
npm install semantic-chunking
```
