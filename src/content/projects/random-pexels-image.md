---
id: random-pexels-image
name: random-pexels-image
slug: random-pexels-image
tagline: >-
  Simple Node.js application that provides an endpoint to search Pexels and
  return a randomly selected image. It allows hotlinking images by directly
  returning...
description:
  short: >-
    Node.js app exposing a search endpoint that returns a randomly selected
    image from Pexels.
  long: >-
    The `/search-image` endpoint accepts optional `apikey`, `size`, `keyword`,
    and `orientation` query parameters and returns the raw image data so it can
    be hotlinked directly. When no keyword is provided, one is drawn from a
    configurable `random-words.json` file of 300 entries. Requires a Pexels API
    key in `.env`.
banner:
  src: >-
    https://github.com/jparkerweb/random-pexels-image/blob/master/random-pexels-image.jpg?raw=true
  alt: random-pexels-image banner
  source: repo
topics:
  - equill-app
  - pexels-api
  - random-image
category: app
theme: utilities
primaryLanguage: JavaScript
languages:
  - name: JavaScript
    percent: 68.79
  - name: Batchfile
    percent: 31.21
stars: 2
links:
  repo: 'https://github.com/jparkerweb/random-pexels-image'
featured: false
sortOrder: 998
status: active
lastCommit: '2026-04-17T16:13:09Z'
_source:
  repo: 'https://github.com/jparkerweb/random-pexels-image'
  sha: HEAD
  fetchedAt: '2026-04-21T17:48:55.296Z'
---
The `/search-image` endpoint accepts optional `apikey`, `size`, `keyword`, and `orientation` query parameters and returns the raw image data so it can be hotlinked directly. When no keyword is provided, one is drawn from a configurable `random-words.json` file of 300 entries. Requires a Pexels API key in `.env`.
