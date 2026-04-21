---
id: ps-win-dir-size
name: ps-win-dir-size
slug: ps-win-dir-size
tagline: >-
  A PowerShell script for analyzing disk space usage on local and network paths.
  Quickly identify which top-level subdirectories consume the most storage
  space.
description:
  short: >-
    PowerShell script for analyzing disk usage on local and network paths,
    ranking the top 100 largest directories.
  long: >-
    Scans local or SMB network paths, showing real-time progress and a top-100
    summary ranked by size with last-modified dates and sizes reported in bytes,
    MB, and GB. If a scan is interrupted, it can be resumed on the next run from
    where it left off. Access-denied folders are skipped gracefully and error
    statistics are reported on completion.
banner:
  src: 'https://github.com/jparkerweb/ps-win-dir-size/raw/main/ps-win-dir-size.jpg'
  alt: ps-win-dir-size banner
  source: repo
topics:
  - directory-analyzer
  - disk-usage
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
  repo: 'https://github.com/jparkerweb/ps-win-dir-size'
featured: false
sortOrder: 1000
status: active
lastCommit: '2026-04-21T16:42:06Z'
_source:
  repo: 'https://github.com/jparkerweb/ps-win-dir-size'
  sha: HEAD
  fetchedAt: '2026-04-21T18:32:45.458Z'
---
Scans local or SMB network paths, showing real-time progress and a top-100 summary ranked by size with last-modified dates and sizes reported in bytes, MB, and GB. If a scan is interrupted, it can be resumed on the next run from where it left off. Access-denied folders are skipped gracefully and error statistics are reported on completion.
