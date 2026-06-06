---
id: ollama-structured-output-test
name: ollama-structured-output-test
slug: ollama-structured-output-test
tagline: >-
  A Node.js application that demonstrates how to get structured JSON responses
  from Ollama using Zod schemas.
description:
  short: >-
    A Node.js demo of getting structured JSON responses from Ollama using Zod
    schemas.
  long: >-
    A Node.js application that demonstrates how to get structured JSON responses
    from Ollama using Zod schemas. It queries a locally or remotely running
    Ollama model and returns a structured response built from a defined schema,
    shown with an example that asks about Disney World and returns fields such
    as name, city, attractions, rides, and fun facts. It relies on the ollama
    JavaScript client, zod for schema validation, zod-to-json-schema to convert
    schemas to JSON Schema, and dotenv for environment configuration. The Ollama
    host and model are set via a `.env` file.
banner:
  src: >-
    https://github.com/jparkerweb/ollama-structured-output-test/blob/main/ollama-structured-output-test.jpg?raw=true
  alt: ollama-structured-output-test banner
  source: repo
topics:
  - equill-demo
  - ollama
  - structured-output
category: demo
theme: utilities
primaryLanguage: JavaScript
languages:
  - name: JavaScript
    percent: 100
stars: 1
links:
  repo: 'https://github.com/jparkerweb/ollama-structured-output-test'
featured: false
sortOrder: 999
status: active
lastCommit: '2026-04-17T16:19:00Z'
_source:
  repo: 'https://github.com/jparkerweb/ollama-structured-output-test'
  sha: HEAD
  fetchedAt: '2026-06-06T19:22:18.421Z'
---
A Node.js application that demonstrates how to get structured JSON responses from Ollama using Zod schemas. It queries a locally or remotely running Ollama model and returns a structured response built from a defined schema, shown with an example that asks about Disney World and returns fields such as name, city, attractions, rides, and fun facts. It relies on the ollama JavaScript client, zod for schema validation, zod-to-json-schema to convert schemas to JSON Schema, and dotenv for environment configuration. The Ollama host and model are set via a `.env` file.

## Setup

1. Clone the repository
2. Install dependencies: 

```bash
npm ci
```

3. Update the `.env` file in the root directory with your Ollama host and model:

```env
OLLAMA_HOST=http://localhost:11434  # Or your Ollama host
OLLAMA_MODEL=llama3.2:1b            # Or your preferred model
```
