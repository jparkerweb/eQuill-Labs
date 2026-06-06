---
id: down-craft
name: down-craft
slug: down-craft
tagline: >-
  Node.js package to simplify the process of converting documents (PDF, DOCX,
  PPTX, and XLSX) into Markdown format. It uses tesseract.js, mammoth, pdf.js,
  and...
description:
  short: >-
    Node.js package that converts PDF, DOCX, PPTX, and XLSX documents into
    Markdown, with optional vLLM-based OCR for PDFs.
  long: >-
    A Node.js package that converts documents -- PDF, DOCX, PPTX, and XLSX --
    into Markdown. It uses tesseract.js, mammoth, pdf.js, and turndown for
    conversion, and for PDFs it offers a choice of standard text extraction,
    Tesseract OCR, or vLLM-based OCR via the OpenAI API for higher-fidelity
    results. The main `downCraft(fileBuffer, fileType?, options?)` function
    accepts a document buffer and optional file type (auto-detected when
    omitted) and returns the Markdown string. The vLLM converter extracts
    embedded images, renders PDF pages to high-quality images, runs vLLM OCR,
    and cleans up temporary files, with LLM parameters configurable directly or
    via environment variables.
banner:
  src: 'https://raw.githubusercontent.com/jparkerweb/down-craft/main/down-craft.jpg'
  alt: down-craft banner
  source: repo
topics:
  - converter
  - docx
  - markdown
  - nodejs
  - npm
  - ocr
  - pdf
  - pptx
  - vllm
  - xlsx
  - ai
  - equill-library
category: library
theme: infra
primaryLanguage: JavaScript
languages:
  - name: JavaScript
    percent: 92.65
  - name: HTML
    percent: 1.96
  - name: CSS
    percent: 5.39
stars: 11
links:
  repo: 'https://github.com/jparkerweb/down-craft'
  homepage: 'https://www.npmjs.com/package/down-craft'
featured: false
sortOrder: 989
status: active
lastCommit: '2025-01-03T14:48:21Z'
_source:
  repo: 'https://github.com/jparkerweb/down-craft'
  sha: HEAD
  fetchedAt: '2026-06-06T19:22:18.421Z'
---
A Node.js package that converts documents -- PDF, DOCX, PPTX, and XLSX -- into Markdown. It uses tesseract.js, mammoth, pdf.js, and turndown for conversion, and for PDFs it offers a choice of standard text extraction, Tesseract OCR, or vLLM-based OCR via the OpenAI API for higher-fidelity results. The main `downCraft(fileBuffer, fileType?, options?)` function accepts a document buffer and optional file type (auto-detected when omitted) and returns the Markdown string. The vLLM converter extracts embedded images, renders PDF pages to high-quality images, runs vLLM OCR, and cleans up temporary files, with LLM parameters configurable directly or via environment variables.

## Installation

```bash
npm install down-craft
```
