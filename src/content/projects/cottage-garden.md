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
    A growing toolbox of plain-spoken helpers for the home gardener, each one a
    self-contained single-file HTML page.
  long: >-
    The Cottage Garden Companion is a collection of browser tools for feeding
    beds, pairing plants, and tending a cottage border. The Fertilizer Plot
    turns any N-P-K ratio into a generative, hand-drawn plant and then works out
    feed dose, timing and cost, while The Companion Bed covers 139 plants with
    ranked companion and "keep apart" relationships, explains why each pair
    works, and deep-links a recommended feed straight into the Fertilizer Plot.
    Every tool is a self-contained, single-file HTML page dressed as a
    pressed-herbarium specimen sheet, with warm recycled-paper surfaces, deep
    botanical ink, and an old-press serif over a clean grotesque. There is no
    build system, no dependencies, and no backend: each tool is one .html file
    that opens directly from disk, and the only network request is the Google
    Fonts link for Fraunces and Hanken Grotesk. More tools are taking root,
    including a sowing calendar and a watering guide.
banner:
  src: >-
    https://raw.githubusercontent.com/jparkerweb/cottage-garden/refs/heads/main/cottage-garden.jpg
  alt: cottage-garden banner
  source: repo
  style: 'object-position:bottom'
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
lastCommit: '2026-08-27T05:02:50Z'
_source:
  repo: 'https://github.com/jparkerweb/cottage-garden'
  sha: HEAD
  fetchedAt: '2026-10-06T01:55:55.892Z'
---
The Cottage Garden Companion is a collection of browser tools for feeding beds, pairing plants, and tending a cottage border. The Fertilizer Plot turns any N-P-K ratio into a generative, hand-drawn plant and then works out feed dose, timing and cost, while The Companion Bed covers 139 plants with ranked companion and "keep apart" relationships, explains why each pair works, and deep-links a recommended feed straight into the Fertilizer Plot. Every tool is a self-contained, single-file HTML page dressed as a pressed-herbarium specimen sheet, with warm recycled-paper surfaces, deep botanical ink, and an old-press serif over a clean grotesque. There is no build system, no dependencies, and no backend: each tool is one .html file that opens directly from disk, and the only network request is the Google Fonts link for Fraunces and Hanken Grotesk. More tools are taking root, including a sowing calendar and a watering guide.

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
