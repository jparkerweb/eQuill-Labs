---
id: bedrock-wrapper
name: bedrock-wrapper
slug: bedrock-wrapper
tagline: >-
  Bedrock Wrapper is an npm package that simplifies the integration of existing
  OpenAI-compatible API objects with AWS Bedrock's serverless inference LLMs.
  Fol...
description:
  short: >-
    npm package that adapts OpenAI-compatible API objects to AWS Bedrock
    serverless inference LLMs.
  long: >-
    An npm package that simplifies the integration of existing OpenAI-compatible
    API objects with AWS Bedrock's serverless inference LLMs. It accepts an
    `awsCreds` object and an OpenAI chat-completions-style request object, then
    streams the Bedrock response back chunk by chunk. Messages use OpenAI's
    role/content format, and the request's `model` value maps to a supported
    Bedrock model name. For an even simpler setup, it can be paired with the
    companion Bedrock Proxy Endpoint project to stand up a full
    OpenAI-compatible server endpoint using the standard `baseUrl` and `apiKey`
    params.
banner:
  src: >-
    https://raw.githubusercontent.com/jparkerweb/bedrock-wrapper/refs/heads/main/docs/bedrock-wrapper.jpg
  alt: bedrock-wrapper banner
  source: repo
topics:
  - aws
  - bedrock
  - inference
  - llm
  - openai-api
  - proxy
  - serverless
  - wrapper
  - equill-library
category: library
theme: infra
primaryLanguage: JavaScript
languages:
  - name: JavaScript
    percent: 100
stars: 9
links:
  repo: 'https://github.com/jparkerweb/bedrock-wrapper'
  homepage: 'https://www.npmjs.com/package/bedrock-wrapper'
featured: false
sortOrder: 991
status: active
lastCommit: '2026-05-16T13:18:45Z'
_source:
  repo: 'https://github.com/jparkerweb/bedrock-wrapper'
  sha: HEAD
  fetchedAt: '2026-06-06T19:22:18.421Z'
---
An npm package that simplifies the integration of existing OpenAI-compatible API objects with AWS Bedrock's serverless inference LLMs. It accepts an `awsCreds` object and an OpenAI chat-completions-style request object, then streams the Bedrock response back chunk by chunk. Messages use OpenAI's role/content format, and the request's `model` value maps to a supported Bedrock model name. For an even simpler setup, it can be paired with the companion Bedrock Proxy Endpoint project to stand up a full OpenAI-compatible server endpoint using the standard `baseUrl` and `apiKey` params.

## Install

- install package: `npm install bedrock-wrapper`

---
