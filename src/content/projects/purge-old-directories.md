---
id: purge-old-directories
name: purge-old-directories
slug: purge-old-directories
tagline: >-
  These two PowerShell scripts were designed to help manage and clean up by
  purging old directories.
description:
  short: >-
    Two PowerShell scripts that purge files in a folder and clean up directories
    older than a specified number of months.
  long: >-
    `purge-files-in-folder.ps1` deletes all files in a specified folder using
    the `robocopy /purge` command, and removes the folder if it ends up empty.
    `purge-old-folders.ps1` calls that script against directories older than a
    given number of months within a target path. Both scripts accept a `-Force`
    flag to run without user confirmation.
banner:
  src: >-
    https://github.com/jparkerweb/purge-old-directories/blob/main/purge-old-directories.jpg?raw=true
  alt: purge-old-directories banner
  source: repo
topics:
  - cleanups-files
  - directory
  - filemanagement
  - powershell
  - purge
  - equill-utility
category: utility
theme: utilities
primaryLanguage: PowerShell
languages:
  - name: PowerShell
    percent: 100
stars: 0
links:
  repo: 'https://github.com/jparkerweb/purge-old-directories'
featured: false
sortOrder: 1000
status: active
lastCommit: '2026-04-21T17:29:18Z'
_source:
  repo: 'https://github.com/jparkerweb/purge-old-directories'
  sha: HEAD
  fetchedAt: '2026-04-22T05:07:51.713Z'
---
`purge-files-in-folder.ps1` deletes all files in a specified folder using the `robocopy /purge` command, and removes the folder if it ends up empty. `purge-old-folders.ps1` calls that script against directories older than a given number of months within a target path. Both scripts accept a `-Force` flag to run without user confirmation.
