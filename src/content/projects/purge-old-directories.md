---
id: purge-old-directories
name: purge-old-directories
slug: purge-old-directories
tagline: >-
  These two PowerShell scripts were designed to help manage and clean up by
  purging old directories.
description:
  short: >-
    Two PowerShell scripts designed to help manage and clean up by purging old
    directories.
  long: >-
    purge-files-in-folder.ps1 deletes all files in a specified folder using the
    robocopy /purge command, and deletes the folder if empty afterward.
    purge-old-folders.ps1 calls purge-files-in-folder.ps1 for directories older
    than a specified number of months, helping clean up old directories within a
    target path in batches.
topics:
  - cleanups-files
  - directory
  - filemanagement
  - powershell
  - purge
category: demo
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
lastCommit: '2024-07-10T14:54:01Z'
_source:
  repo: 'https://github.com/jparkerweb/purge-old-directories'
  sha: HEAD
  fetchedAt: '2026-04-17T04:24:14.581Z'
---
purge-files-in-folder.ps1 deletes all files in a specified folder using the robocopy /purge command, and deletes the folder if empty afterward. purge-old-folders.ps1 calls purge-files-in-folder.ps1 for directories older than a specified number of months, helping clean up old directories within a target path in batches.
