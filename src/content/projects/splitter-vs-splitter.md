---
id: splitter-vs-splitter
name: splitter-vs-splitter
slug: splitter-vs-splitter
tagline: >-
  A web-based tool to compare different sentence splitting libraries side by
  side. Currently compares:
description:
  short: >-
    A web tool that compares sentence-splitting libraries side by side with
    color-coded output.
  long: >-
    A web-based tool to compare different sentence splitting libraries side by
    side, currently pitting @stdlib/nlp-sentencize against sentence-parse. It
    performs real-time comparison with color-coding so matching sentences line
    up visually across both outputs, and displays a sentence count. The frontend
    is vanilla JavaScript with an Express.js backend and no external UI
    frameworks. Text is processed by clicking a button or pressing Ctrl+Enter.
banner:
  src: >-
    https://github.com/jparkerweb/splitter-vs-splitter/blob/main/splitter-vs-splitter.jpg?raw=true
  alt: splitter-vs-splitter banner
  source: repo
topics:
  - comparer
  - npm
  - sentence-splitting
  - equill-demo
category: demo
theme: utilities
primaryLanguage: JavaScript
languages:
  - name: HTML
    percent: 29.95
  - name: CSS
    percent: 24.82
  - name: JavaScript
    percent: 45.23
stars: 1
links:
  repo: 'https://github.com/jparkerweb/splitter-vs-splitter'
  homepage: 'https://splitter.dyndns.org'
featured: false
sortOrder: 999
status: active
lastCommit: '2026-04-17T16:27:15Z'
_source:
  repo: 'https://github.com/jparkerweb/splitter-vs-splitter'
  sha: HEAD
  fetchedAt: '2026-07-04T00:36:27.186Z'
---
A web-based tool to compare different sentence splitting libraries side by side, currently pitting @stdlib/nlp-sentencize against sentence-parse. It performs real-time comparison with color-coding so matching sentences line up visually across both outputs, and displays a sentence count. The frontend is vanilla JavaScript with an Express.js backend and no external UI frameworks. Text is processed by clicking a button or pressing Ctrl+Enter.

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/splitter-vs-splitter.git
cd splitter-vs-splitter
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following (edit the port as needed):
```bash
cp .env.example .env
```

### Development
Run the development server with auto-reload:
```bash
npm run dev
```

### Production
Run the production server:
```bash
npm start
```
