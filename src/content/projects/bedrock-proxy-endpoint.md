---
id: bedrock-proxy-endpoint
name: bedrock-proxy-endpoint
slug: bedrock-proxy-endpoint
tagline: >-
  Spin up your own custom OpenAI API server endpoint for easy AWS Bedrock LLM
  text inference (using standard baseUrl, and apiKey params)
description:
  short: >-
    Spin up your own OpenAI-compatible API endpoint that proxies calls to AWS
    Bedrock for LLM text inference.
  long: >-
    A service that lets you spin up your own custom OpenAI API compatible server
    endpoint that proxies calls to AWS Bedrock for LLM text inference, using the
    standard `baseUrl` and `apiKey` params. It is aimed at keeping applications
    platform-agnostic and avoiding the need to format inference calls for the
    Bedrock SDK or reconcile per-model configuration differences. It is useful
    for getting existing OpenAI API compatible applications working with AWS
    Bedrock. The endpoint can be run from source with Node.js, or via Docker
    using a pre-built image from GitHub Container Registry (GHCR) or a local
    build, with configuration supplied through environment variables and an
    optional docker-compose setup.
banner:
  src: >-
    https://raw.githubusercontent.com/jparkerweb/bedrock-proxy-endpoint/refs/heads/main/.readme/bedrock-proxy-endpoint.jpg
  alt: bedrock-proxy-endpoint banner
  source: repo
topics:
  - api
  - aws-bedrock
  - endpoint
  - inference
  - llm
  - inference-api
  - mistral
  - openai-api
  - proxy
  - serverless
  - wrapper
  - equill-service
category: service
theme: infra
primaryLanguage: JavaScript
languages:
  - name: HTML
    percent: 12.38
  - name: JavaScript
    percent: 83.62
  - name: Dockerfile
    percent: 4
stars: 16
links:
  repo: 'https://github.com/jparkerweb/bedrock-proxy-endpoint'
featured: false
sortOrder: 984
status: active
lastCommit: '2026-04-16T15:27:27Z'
_source:
  repo: 'https://github.com/jparkerweb/bedrock-proxy-endpoint'
  sha: HEAD
  fetchedAt: '2026-06-06T19:22:18.421Z'
---
A service that lets you spin up your own custom OpenAI API compatible server endpoint that proxies calls to AWS Bedrock for LLM text inference, using the standard `baseUrl` and `apiKey` params. It is aimed at keeping applications platform-agnostic and avoiding the need to format inference calls for the Bedrock SDK or reconcile per-model configuration differences. It is useful for getting existing OpenAI API compatible applications working with AWS Bedrock. The endpoint can be run from source with Node.js, or via Docker using a pre-built image from GitHub Container Registry (GHCR) or a local build, with configuration supplied through environment variables and an optional docker-compose setup.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/jparkerweb/bedrock-proxy-endpoint.git
    ```

2. Navigate to the project directory:

    ```bash
    cd bedrock-proxy-endpoint
    ```

3. Install the dependencies:

    ```bash
    npm ci
    ```
