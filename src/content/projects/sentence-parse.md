---
id: sentence-parse
name: sentence-parse
slug: sentence-parse
tagline: A simple utility to parse text into sentences.
description:
  short: >-
    A utility that parses text into sentences with configurable handling of line
    breaks, HTML, and list items.
  long: >-
    A utility that parses text into sentences, accepting either a string or file
    contents through its async `parseSentences` function. It offers options to
    treat multiple consecutive line breaks as separate sentences, remove
    specified start-of-line sequences, preserve HTML `<br>` and `<p>` tags as
    line breaks, and preserve list items with a configurable prefix. An option
    to exclude segments that contain no letters is also available. The package
    returns an array of parsed sentences and includes runnable examples.
banner:
  src: >-
    https://raw.githubusercontent.com/jparkerweb/sentence-parse/refs/heads/main/docs/sentence-parse.jpg
  alt: sentence-parse banner
  source: repo
topics:
  - parse
  - segment
  - sentence
  - split
  - text
  - equill-library
category: library
theme: utilities
primaryLanguage: JavaScript
languages:
  - name: JavaScript
    percent: 100
stars: 2
links:
  repo: 'https://github.com/jparkerweb/sentence-parse'
  homepage: 'https://www.npmjs.com/package/sentence-parse'
featured: false
sortOrder: 998
status: active
lastCommit: '2025-01-30T18:30:42Z'
_source:
  repo: 'https://github.com/jparkerweb/sentence-parse'
  sha: HEAD
  fetchedAt: '2026-06-06T21:46:37.051Z'
---
A utility that parses text into sentences, accepting either a string or file contents through its async `parseSentences` function. It offers options to treat multiple consecutive line breaks as separate sentences, remove specified start-of-line sequences, preserve HTML `<br>` and `<p>` tags as line breaks, and preserve list items with a configurable prefix. An option to exclude segments that contain no letters is also available. The package returns an array of parsed sentences and includes runnable examples.

## Installation

```bash
npm install sentence-parse
```
