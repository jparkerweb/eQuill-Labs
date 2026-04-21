---
id: add-block-to-hosts
name: add-block-to-hosts
slug: add-block-to-hosts
tagline: >-
  A PowerShell script to block websites and domains by adding entries to your
  Windows hosts file.
description:
  short: >-
    PowerShell script that blocks websites by adding `0.0.0.0` entries to the
    Windows hosts file.
  long: >-
    Prompts for an address, then appends an entry in the form `0.0.0.0
    example.com` and flushes the DNS cache. Automatically elevates to
    administrator, detects duplicates, and optionally creates a timestamped
    backup of the hosts file before changes. Uses atomic writes with a temporary
    file and validates file integrity before and after modification.
banner:
  src: >-
    https://raw.githubusercontent.com/jparkerweb/add-block-to-hosts/main/.readme/add-block-to-hosts.jpg
  alt: add-block-to-hosts banner
  source: repo
topics:
  - block
  - hostsfile
  - network
  - powershell
  - equill-utility
category: utility
theme: utilities
primaryLanguage: PowerShell
languages:
  - name: PowerShell
    percent: 100
stars: 0
links:
  repo: 'https://github.com/jparkerweb/add-block-to-hosts'
featured: false
sortOrder: 1000
status: active
lastCommit: '2026-04-17T16:06:31Z'
_source:
  repo: 'https://github.com/jparkerweb/add-block-to-hosts'
  sha: HEAD
  fetchedAt: '2026-04-21T18:32:45.458Z'
---
Prompts for an address, then appends an entry in the form `0.0.0.0 example.com` and flushes the DNS cache. Automatically elevates to administrator, detects duplicates, and optionally creates a timestamped backup of the hosts file before changes. Uses atomic writes with a temporary file and validates file integrity before and after modification.
