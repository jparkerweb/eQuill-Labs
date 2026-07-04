---
id: cottage-garden
name: cottage-garden
slug: cottage-garden
tagline: >-
  A small, growing toolbox of plain-spoken helpers for the home gardener — feed
  your beds, pair your plants, and tend a cottage border with a little more…
taglineFull: >-
  A small, growing toolbox of plain-spoken helpers for the home gardener — feed
  your beds, pair your plants, and tend a cottage border with a little more
  confidence.
description:
  short: >-
    A small, growing toolbox of self-contained, single-file HTML helpers for the
    home gardener.
  long: >-
    The Cottage Garden Companion is a small, growing toolbox of plain-spoken
    helpers for the home gardener. Every tool is a self-contained, single-file
    HTML page with no build system, no dependencies, and no backend — each is
    one .html file that opens directly from disk. The Fertilizer Plot turns any
    N–P–K ratio into a generative, hand-drawn plant, then works out feed dose,
    timing, and cost. The Companion Bed covers 139 plants with ranked companion
    and "keep apart" relationships and why each pair works, and deep-links a
    recommended feed straight into the Fertilizer Plot. Aside from a single
    Google Fonts link, all logic, data, and SVG artwork is inline.
banner:
  src: >-
    https://raw.githubusercontent.com/jparkerweb/cottage-garden/refs/heads/main/cottage-garden.jpg
  alt: cottage-garden banner
  source: repo
topics: []
category: app
theme: utilities
primaryLanguage: HTML
languages:
  - name: JavaScript
    percent: 27.25
  - name: HTML
    percent: 72.75
stars: 0
links:
  repo: 'https://github.com/jparkerweb/cottage-garden'
  homepage: 'https://jparkerweb.github.io/cottage-garden/'
featured: false
sortOrder: 1000
status: active
lastCommit: '2026-07-01T04:21:27Z'
_source:
  repo: 'https://github.com/jparkerweb/cottage-garden'
  sha: HEAD
  fetchedAt: '2026-07-04T00:36:27.186Z'
---
The Cottage Garden Companion is a small, growing toolbox of plain-spoken helpers for the home gardener. Every tool is a self-contained, single-file HTML page with no build system, no dependencies, and no backend — each is one .html file that opens directly from disk. The Fertilizer Plot turns any N–P–K ratio into a generative, hand-drawn plant, then works out feed dose, timing, and cost. The Companion Bed covers 139 plants with ranked companion and "keep apart" relationships and why each pair works, and deep-links a recommended feed straight into the Fertilizer Plot. Aside from a single Google Fonts link, all logic, data, and SVG artwork is inline.

## Getting started

There is nothing to install. Pick whichever suits you:

- **Open directly** — double-click `src/index.html`, or open `file:///…/src/index.html` in any modern browser. The pages are designed to work fully from `file://`.
- **Serve the folder** (only if a browser blocks something over `file://`) — any static server works:

  ```bash
  npx serve src
  # or
  npx serve docs   # the built/published copy
  ```

  Then visit the page in your browser.

The **only** network request is the Google Fonts `<link>` (Fraunces + Hanken Grotesk); everything else — logic, data, and SVG artwork — is inline. Offline, the pages still work with fallback fonts.

---
