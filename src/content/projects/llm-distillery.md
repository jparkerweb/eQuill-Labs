---
id: llm-distillery
name: llm-distillery
slug: llm-distillery
tagline: >-
  Use LLMs to distill large texts down to a manageable size by utilizing a
  map-reduce approach. This ensures that the text fits within a specified token…
taglineFull: >-
  Use LLMs to distill large texts down to a manageable size by utilizing a
  map-reduce approach. This ensures that the text fits within a specified token
  limit, which is crucial when interfacing with Large Language Models (LLMs) in
  downstreams tasks.
description:
  short: >-
    npm package that uses LLMs in a map-reduce approach to distill large texts
    down to a target token size.
  long: >-
    An npm package that uses LLMs to distill large texts down to a manageable
    size with a map-reduce approach, ensuring text fits within a specified token
    limit before downstream LLM tasks. It reduces text size based on token count
    without losing the essence of the content, using the semantic-chunking
    library to split text into chunks that are then summarized. Parameters such
    as target token size, API base URL, chunking thresholds, model, stop tokens,
    and maximum distillation loops are configurable. It works with any OpenAI
    API compatible endpoint (such as together.ai) and defaults to a Llama 3
    model.
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
lastCommit: '2026-05-12T04:36:00Z'
_source:
  repo: 'https://github.com/jparkerweb/llm-distillery'
  sha: HEAD
  fetchedAt: '2026-06-06T21:46:37.051Z'
---
An npm package that uses LLMs to distill large texts down to a manageable size with a map-reduce approach, ensuring text fits within a specified token limit before downstream LLM tasks. It reduces text size based on token count without losing the essence of the content, using the semantic-chunking library to split text into chunks that are then summarized. Parameters such as target token size, API base URL, chunking thresholds, model, stop tokens, and maximum distillation loops are configurable. It works with any OpenAI API compatible endpoint (such as together.ai) and defaults to a Llama 3 model.

## Getting Started

### Prerequisites

- Node.js installed on your system.
- An API key for running inference of OpenAI API compatible LLM models (together.ai, etc.).

### Installation

Add this lib to your code page via npm install

```bash
npm install llm-distillery
```

---
