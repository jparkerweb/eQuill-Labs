---
id: punctuation-restore
name: punctuation-restore
slug: punctuation-restore
tagline: >-
  A Node.js package that restores punctuation and casing to unpunctuated text
  using the punctuation_fullstop_truecase_english ONNX model:…
taglineFull: >-
  A Node.js package that restores punctuation and casing to unpunctuated text
  using the punctuation_fullstop_truecase_english ONNX model:
  https://huggingface.co/1-800-BAD-CODE/punctuation_fullstop_truecase_english
description:
  short: >-
    Node.js package that restores punctuation and casing to unpunctuated text
    using an ONNX model.
  long: >-
    A Node.js package that restores punctuation and casing to unpunctuated text
    using the `punctuation_fullstop_truecase_english` ONNX model from Hugging
    Face. It restores punctuation marks such as periods, commas, and question
    marks, handles casing, and supports batch processing of multiple texts
    through the ONNX runtime. Required models are downloaded automatically from
    Hugging Face on first use and saved locally to the `./models` directory for
    reuse. The main `PunctuationRestorer` class exposes an async
    `restore(texts)` method that returns punctuated, cased sentences and handles
    model initialization and cleanup automatically.
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
stars: 4
links:
  repo: 'https://github.com/jparkerweb/punctuation-restore'
  homepage: 'https://www.npmjs.com/package/punctuation-restore'
featured: false
sortOrder: 996
status: active
lastCommit: '2026-05-12T04:44:04Z'
_source:
  repo: 'https://github.com/jparkerweb/punctuation-restore'
  sha: HEAD
  fetchedAt: '2026-06-06T21:46:37.051Z'
---
A Node.js package that restores punctuation and casing to unpunctuated text using the `punctuation_fullstop_truecase_english` ONNX model from Hugging Face. It restores punctuation marks such as periods, commas, and question marks, handles casing, and supports batch processing of multiple texts through the ONNX runtime. Required models are downloaded automatically from Hugging Face on first use and saved locally to the `./models` directory for reuse. The main `PunctuationRestorer` class exposes an async `restore(texts)` method that returns punctuated, cased sentences and handles model initialization and cleanup automatically.

## Installation

```bash
npm install punctuation-restore
```
