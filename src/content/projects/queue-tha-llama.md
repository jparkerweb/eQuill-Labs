---
id: queue-tha-llama
name: queue-tha-llama
slug: queue-tha-llama
tagline: >-
  This is a web-based chat application that integrates Large Language Model
  (LLM) capabilities with Bull Queue, Redis, and Chroma. It handles concurrent
  chat s...
description:
  short: >-
    Web-based chat app integrating LLM capabilities with Bull Queue, Redis, and
    Chroma for concurrent chat sessions.
  long: >-
    Handles concurrent chat sessions with queue management backed by Bull Queue
    and Redis, and uses a RAG model for chat memory via a Chroma vector store.
    Client-server communication uses heartbeat signals, and inactive clients and
    job cleanups are managed automatically. Deployment assumes Redis and Chroma
    Docker containers and downloadable embedding models.
banner:
  src: 'https://github.com/jparkerweb/queue-tha-llama/blob/main/docs/chat.jpg'
  alt: queue-tha-llama banner
  source: repo
topics:
  - ai
  - ai-chat
  - demo
  - equill-demo
category: demo
theme: utilities
primaryLanguage: JavaScript
languages:
  - name: JavaScript
    percent: 72.73
  - name: HTML
    percent: 8.29
  - name: CSS
    percent: 9.97
  - name: PowerShell
    percent: 9.01
stars: 1
links:
  repo: 'https://github.com/jparkerweb/queue-tha-llama'
featured: false
sortOrder: 999
status: active
lastCommit: '2026-04-21T17:13:21Z'
_source:
  repo: 'https://github.com/jparkerweb/queue-tha-llama'
  sha: HEAD
  fetchedAt: '2026-04-21T17:48:55.296Z'
---
Handles concurrent chat sessions with queue management backed by Bull Queue and Redis, and uses a RAG model for chat memory via a Chroma vector store. Client-server communication uses heartbeat signals, and inactive clients and job cleanups are managed automatically. Deployment assumes Redis and Chroma Docker containers and downloadable embedding models.
