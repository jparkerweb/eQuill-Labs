---
id: punctuation-restore
name: punctuation-restore
slug: punctuation-restore
tagline: >-
  A Node.js package that restores punctuation and casing to unpunctuated text
  using the punctuation_fullstop_truecase_english ONNX model:
  https://huggingface.c...
description:
  short: >-
    Node.js package that restores punctuation and casing to unpunctuated text
    using an ONNX model.
  long: >-
    Wraps the `punctuation_fullstop_truecase_english` ONNX model from Hugging
    Face and exposes a `PunctuationRestorer` class with a `restore(texts:
    string[])` method that returns punctuated and cased strings. Models are
    downloaded on first use and cached under `./models`. Supports batch
    processing across multiple inputs.
banner:
  src: >-
    https://raw.githubusercontent.com/jparkerweb/punctuation-restore/main/punctuation-restore.jpg
  alt: punctuation-restore banner
  source: repo
topics:
  - nlp
  - nodejs
  - onnx
  - onnxruntime
  - punctuation
  - punctuation-restoration
  - text-processing
  - equill-library
category: library
theme: nlp
primaryLanguage: JavaScript
languages:
  - name: JavaScript
    percent: 100
stars: 3
links:
  repo: 'https://github.com/jparkerweb/punctuation-restore'
  homepage: 'https://www.npmjs.com/package/punctuation-restore'
featured: false
sortOrder: 997
status: active
lastCommit: '2026-04-17T16:07:15Z'
_source:
  repo: 'https://github.com/jparkerweb/punctuation-restore'
  sha: HEAD
  fetchedAt: '2026-04-22T05:07:51.713Z'
---
Wraps the `punctuation_fullstop_truecase_english` ONNX model from Hugging Face and exposes a `PunctuationRestorer` class with a `restore(texts: string[])` method that returns punctuated and cased strings. Models are downloaded on first use and cached under `./models`. Supports batch processing across multiple inputs.
