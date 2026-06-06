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
    A PowerShell script that analyzes disk usage on local and network paths to
    find the largest subdirectories.
  long: >-
    A PowerShell script for analyzing disk space usage on local and network
    paths, quickly identifying which top-level subdirectories consume the most
    storage. It supports SMB network shares, shows real-time progress as
    directories are scanned, and can resume an interrupted scan from where it
    left off. It gracefully continues when access to specific folders is denied,
    then displays the top 100 largest directories ranked by size with
    last-modified dates and sizes in bytes, MB, and GB. It requires PowerShell
    5.0 or higher and read access to the target path.
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
lastCommit: '2026-05-12T04:42:06Z'
_source:
  repo: 'https://github.com/jparkerweb/ps-win-dir-size'
  sha: HEAD
  fetchedAt: '2026-06-06T19:22:18.421Z'
---
A PowerShell script for analyzing disk space usage on local and network paths, quickly identifying which top-level subdirectories consume the most storage. It supports SMB network shares, shows real-time progress as directories are scanned, and can resume an interrupted scan from where it left off. It gracefully continues when access to specific folders is denied, then displays the top 100 largest directories ranked by size with last-modified dates and sizes in bytes, MB, and GB. It requires PowerShell 5.0 or higher and read access to the target path.
