---
id: semantic-chunking
name: semantic-chunking
slug: semantic-chunking
tagline: >-
  NPM Package for Semantically creating chunks from large texts. Useful for
  workflows involving large language models (LLMs).
description:
  short: >-
    NPM package for semantically creating chunks from large texts for workflows
    involving large language models.
  long: >-
    An NPM package for semantically creating chunks from large texts, useful for
    workflows involving large language models (LLMs). It splits input text into
    sentences, generates a vector for each using a specified ONNX model,
    calculates cosine similarity for each sentence pair, and groups sentences
    into chunks based on a similarity threshold and maximum token size. Options
    include dynamic similarity thresholds, configurable chunk sizes, multiple
    embedding model options, quantized model support, and chunk prefixes for RAG
    workflows. It also includes a Web UI for experimenting with settings and can
    be run via Docker Compose.
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
    percent: 80.05
  - name: HTML
    percent: 9.78
  - name: CSS
    percent: 9.55
  - name: Dockerfile
    percent: 0.62
stars: 141
links:
  repo: 'https://github.com/jparkerweb/semantic-chunking'
  demo: 'https://semantic-chunking.equilllabs.com/'
  homepage: 'https://www.npmjs.com/package/semantic-chunking'
featured: true
sortOrder: 0
status: active
lastCommit: '2026-05-29T05:11:40Z'
_source:
  repo: 'https://github.com/jparkerweb/semantic-chunking'
  sha: HEAD
  fetchedAt: '2026-06-06T21:46:37.051Z'
---
An NPM package for semantically creating chunks from large texts, useful for workflows involving large language models (LLMs). It splits input text into sentences, generates a vector for each using a specified ONNX model, calculates cosine similarity for each sentence pair, and groups sentences into chunks based on a similarity threshold and maximum token size. Options include dynamic similarity thresholds, configurable chunk sizes, multiple embedding model options, quantized model support, and chunk prefixes for RAG workflows. It also includes a Web UI for experimenting with settings and can be run via Docker Compose.

## Installation

```bash
npm install semantic-chunking
```
