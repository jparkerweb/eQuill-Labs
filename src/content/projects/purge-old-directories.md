---
id: purge-old-directories
name: purge-old-directories
slug: purge-old-directories
tagline: >-
  These two PowerShell scripts were designed to help manage and clean up by
  purging old directories.
description:
  short: >-
    Two PowerShell scripts for purging files and cleaning up old directories by
    age.
  long: >-
    Two PowerShell scripts for managing and cleaning up old directories.
    `purge-files-in-folder.ps1` deletes all files in a specified folder using
    the `robocopy /purge` command and removes the folder itself if it is empty
    afterward. `purge-old-folders.ps1` calls that script for directories older
    than a specified number of months, cleaning up a target path in batches.
    Both accept a `-Force` flag to run without confirmation, and
    `purge-old-folders.ps1` can run interactively with a folder-browser dialog
    and prompts when no parameters are supplied.
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
  fetchedAt: '2026-07-04T00:36:27.186Z'
---
Two PowerShell scripts for managing and cleaning up old directories. `purge-files-in-folder.ps1` deletes all files in a specified folder using the `robocopy /purge` command and removes the folder itself if it is empty afterward. `purge-old-folders.ps1` calls that script for directories older than a specified number of months, cleaning up a target path in batches. Both accept a `-Force` flag to run without confirmation, and `purge-old-folders.ps1` can run interactively with a folder-browser dialog and prompts when no parameters are supplied.
