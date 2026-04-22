---
id: llm-distillery
name: llm-distillery
slug: llm-distillery
tagline: >-
  Use LLMs to distill large texts down to a manageable size by utilizing a
  map-reduce approach. This ensures that the text fits within a specified token
  limit,...
description:
  short: >-
    Node.js library that uses LLMs with a map-reduce approach to distill large
    text down to a target token size.
  long: >-
    Intelligently splits text via the `semantic-chunking` library, summarizes
    each chunk with an OpenAI-compatible LLM, then reduces until the output fits
    within a configured token budget. `llmDistillery(text, options)` takes
    parameters such as `targetTokenSize`, `baseUrl`, `apiKey`, `llmModel`, and
    `stopTokens`. Callable against any OpenAI-compatible endpoint (e.g.,
    together.ai).
banner:
  src: >-
    https://raw.githubusercontent.com/jparkerweb/llm-distillery/refs/heads/main/llm-distillery.jpg
  alt: llm-distillery banner
  source: repo
topics:
  - large-language-model
  - llm
  - openai-api
  - semantic-chunking
  - text-compression
  - text-processing
  - text-summarization
  - token-management
  - tokenization
  - ai-text-reduction
  - text-distillation
  - equill-library
category: library
theme: nlp
primaryLanguage: JavaScript
languages:
  - name: JavaScript
    percent: 62.61
  - name: HTML
    percent: 19.33
  - name: CSS
    percent: 18.07
stars: 12
links:
  repo: 'https://github.com/jparkerweb/llm-distillery'
  homepage: 'https://www.npmjs.com/package/llm-distillery'
featured: true
sortOrder: 6
status: active
lastCommit: '2026-04-17T04:23:50Z'
_source:
  repo: 'https://github.com/jparkerweb/llm-distillery'
  sha: HEAD
  fetchedAt: '2026-04-22T05:07:51.713Z'
---
Intelligently splits text via the `semantic-chunking` library, summarizes each chunk with an OpenAI-compatible LLM, then reduces until the output fits within a configured token budget. `llmDistillery(text, options)` takes parameters such as `targetTokenSize`, `baseUrl`, `apiKey`, `llmModel`, and `stopTokens`. Callable against any OpenAI-compatible endpoint (e.g., together.ai).
