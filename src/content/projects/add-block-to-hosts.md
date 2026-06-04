---
id: add-block-to-hosts
name: add-block-to-hosts
slug: add-block-to-hosts
tagline: >-
  A PowerShell script to block websites and domains by adding entries to your
  Windows hosts file.
description:
  short: >-
    A PowerShell script that blocks websites and domains by adding entries to
    the Windows hosts file.
  long: >-
    A PowerShell script that blocks websites and domains by adding entries to
    the Windows hosts file, redirecting them to `0.0.0.0`. It automatically
    requests administrator privileges, validates input and detects duplicates,
    optionally creates timestamped backups, and flushes the DNS cache after
    modifying the file. Safety features include atomic writes via temporary
    files, multi-level validation of file integrity, automatic rollback from an
    emergency backup if corruption is detected, and graceful error handling. The
    repository also bundles Fiddler, a web debugging proxy, to help discover
    tracking and advertising domains worth blocking.
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
  fetchedAt: '2026-06-04T15:41:42.191Z'
---
A PowerShell script that blocks websites and domains by adding entries to the Windows hosts file, redirecting them to `0.0.0.0`. It automatically requests administrator privileges, validates input and detects duplicates, optionally creates timestamped backups, and flushes the DNS cache after modifying the file. Safety features include atomic writes via temporary files, multi-level validation of file integrity, automatic rollback from an emergency backup if corruption is detected, and graceful error handling. The repository also bundles Fiddler, a web debugging proxy, to help discover tracking and advertising domains worth blocking.
