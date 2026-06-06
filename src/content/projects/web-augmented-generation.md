---
id: web-augmented-generation
name: web-augmented-generation
slug: web-augmented-generation
tagline: >-
  This Node.js application performs web-augmented generation using various LLM
  providers and web search results from SearXNG.
description:
  short: >-
    Node.js CLI app that performs web-augmented generation using SearXNG search
    and any OpenAI-compatible LLM.
  long: >-
    A Node.js application that performs web-augmented generation using web
    search results from SearXNG and various LLM providers via OpenAI-compatible
    API calls. It rephrases user queries for better web searching, searches with
    SearXNG, then fetches and summarizes content from the results before
    generating a response. It supports streaming responses, content similarity
    checking and repetition detection, detailed logging, and an interactive CLI.
    Multiple LLM providers are supported, including Ollama, together.ai, and
    llama.cpp, and it can apply semantic chunking to scraped page content for
    higher-quality answers.
banner:
  src: >-
    https://raw.githubusercontent.com/jparkerweb/web-augmented-generation/refs/heads/main/web-augmented-generation.jpg
  alt: web-augmented-generation banner
  source: repo
topics:
  - genai
  - llm
  - search
  - searxng
  - web-augmentation
  - equill-cli
category: cli
theme: infra
primaryLanguage: JavaScript
languages:
  - name: JavaScript
    percent: 94.36
  - name: Shell
    percent: 3.69
  - name: Batchfile
    percent: 0.69
  - name: PowerShell
    percent: 1.25
stars: 8
links:
  repo: 'https://github.com/jparkerweb/web-augmented-generation'
  homepage: 'https://www.equilllabs.com/projects/web-augmented-generation'
featured: false
sortOrder: 992
status: active
lastCommit: '2026-04-17T04:47:04Z'
_source:
  repo: 'https://github.com/jparkerweb/web-augmented-generation'
  sha: HEAD
  fetchedAt: '2026-06-06T19:22:18.421Z'
---
A Node.js application that performs web-augmented generation using web search results from SearXNG and various LLM providers via OpenAI-compatible API calls. It rephrases user queries for better web searching, searches with SearXNG, then fetches and summarizes content from the results before generating a response. It supports streaming responses, content similarity checking and repetition detection, detailed logging, and an interactive CLI. Multiple LLM providers are supported, including Ollama, together.ai, and llama.cpp, and it can apply semantic chunking to scraped page content for higher-quality answers.

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/jparkerweb/web-augmented-generation.git
   cd web-augmented-generation
   ```

2. Install dependencies:
   ```
   npm ci
   ```

3. Copy the `.env.example` file to `.env`:
   ```
   cp .env.example .env
   ```

4. Edit the `.env` file and update the values as needed:

```env
######################
## General Settings ##
######################
NUM_URLS=10                                                           # Number of URLs to fetch
SEARXNG_URL=https://searx.be/                                         # URL of the SearXNG server
SEARXNG_URL_EXTRA_PARAMETER="key=optional_auth_key_here&language=en"  # Extra parameter for SearXNG URL
SEARXNG_FORMAT=html                                                   # Format for SearXNG results (html or json)
FETCH_TIMEOUT_MS=5000                                                 # Timeout for fetching URLs
DISABLE_SSL_VALIDATION=true                                           # Whether to disable SSL validation

##################
## LLM Settings ##
##################
LLM_STREAM_RESPONSE=true                             # Whether to stream the LLM response

# Ollama Local Configuration
LLM_BASE_URL=http://localhost:11434/v1               # Base URL for the LLM API (OpenAI format)
LLM_API_KEY=ollama!!!                                # API key for the LLM (use 'ollama' for Ollama)
LLM_MODEL=llama3.2:1b                                # Model to use with the LLM API

####################################
## Scraped Page Content Settings ##
####################################

# Semantic Chunking Settings
CHUNK_CONTENT=true                                   # Enable semantic chunking for better quality answers
CHUNK_CONTENT_USE_HYBRID_FALLBACK=true               # Enable hybrid mode to fallback to summarization if no chunks found
## The following parameters are only used by the `chunk-match` library (if CHUNK_CONTENT is set to true)
CHUNK_CONTENT_MAX_RESULTS=10
CHUNK_CONTENT_MIN_SIMILARITY=0.375
CHUNK_CONTENT_MAX_TOKEN_SIZE=500
CHUNK_CONTENT_SIMILARITY_THRESHOLD=0.4
CHUNK_CONTENT_DYNAMIC_THRESHOLD_LOWER_BOUND=0.3
CHUNK_CONTENT_DYNAMIC_THRESHOLD_UPPER_BOUND=0.5
CHUNK_CONTENT_NUM_SIMILARITY_SENTENCES_LOOKAHEAD=3
CHUNK_CONTENT_COMBINE_CHUNKS=true
CHUNK_CONTENT_COMBINE_CHUNKS_SIMILARITY_THRESHOLD=0.5
CHUNK_CONTENT_ONNX_EMBEDDING_MODEL="Xenova/all-MiniLM-L6-v2"
CHUNK_CONTENT_DTYPE="q8"

# Raw Content Settings (used when CHUNK_CONTENT=false)
WEB_PAGE_CONTENT_MAX_LENGTH=1000                     # Maximum length of raw page content to send to LLM
```

Alternative LLM Provider Configurations:

```env
# together.ai Configuration
LLM_BASE_URL=https://api.together.xyz/v1
LLM_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
LLM_MODEL=meta-llama/Llama-3.2-3B-Instruct-Turbo

# llama.cpp Configuration
LLM_BASE_URL=http://localhost:8080/v1
LLM_API_KEY=not-needed
LLM_MODEL=not-needed

# OpenRouter Configuration
LLM_BASE_URL=https://openrouter.ai/api/v1
LLM_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
LLM_MODEL=google/gemini-pro-1.5-exp

# Google AI Studio Configuration
LLM_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
LLM_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
LLM_MODEL=gemini-exp-1121
```

The configuration includes:
- General settings for web search and content fetching
- LLM provider settings with support for multiple providers
- Content processing settings with semantic chunking options
- Raw content handling parameters
