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
    Node.js app that exposes an endpoint to search Pexels and return a randomly
    selected image.
  long: >-
    A Node.js application that provides an endpoint to search Pexels and return
    a randomly selected image, allowing hotlinking by directly returning the
    image data. It fetches images from the Pexels API based on query parameters
    such as size, keyword, and orientation, and when no keyword is supplied it
    picks a random word from a list of 300. It is intended for web applications
    or services that need to dynamically fetch and display Pexels images without
    storing them locally. The server reads a Pexels API key and port from a
    `.env` file and exposes a `/search-image` GET endpoint.
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
  fetchedAt: '2026-06-04T15:41:42.191Z'
---
A Node.js application that provides an endpoint to search Pexels and return a randomly selected image, allowing hotlinking by directly returning the image data. It fetches images from the Pexels API based on query parameters such as size, keyword, and orientation, and when no keyword is supplied it picks a random word from a list of 300. It is intended for web applications or services that need to dynamically fetch and display Pexels images without storing them locally. The server reads a Pexels API key and port from a `.env` file and exposes a `/search-image` GET endpoint.

## Installation

1. Clone the repository
    ```bash
    git clone https://github.com/jparkerweb/pexels-image-search-api.git
    cd pexels-image-search-api
    ```

2. Install the dependencies
    ```bash
    npm install
    ```

3. Create a `.env` file in the root directory and add your Pexels API key and server port
    ```plaintext
    PEXELS_API_KEY=your_pexels_api_key
	PORT=8000
    ```

4. Optionally adjust the `random-words.json` file with random words if a keyword is not submited with each search request
