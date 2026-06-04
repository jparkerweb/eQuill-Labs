---
id: indigestion
name: indigestion
slug: indigestion
tagline: "\U0001F525 CLI interface for creating and sending test emails to be used in terst automation"
description:
  short: A CLI for creating and sending test emails in test automation environments.
  long: >-
    A CLI that provides a quick method for creating and sending test emails
    across test automation environments. It stores each email message as a JSON
    file in an `emails` directory, parsing common fields such as from, to, cc,
    bcc, subject, text, html, and attachments to build and send messages. A UI
    walks through creating new email files, selecting emails for deletion, and
    sending all emails, while a `--email` flag sends without the UI. SMTP server
    and authentication settings are kept in a personal `userconfig.json` file
    (git-ignored), and messages are sent using nodemailer.
banner:
  src: 'https://github.com/jparkerweb/indigestion/raw/master/docs/indigestion.png'
  alt: indigestion banner
  source: repo
topics:
  - email-sender
  - test-automation
  - equill-cli
category: cli
theme: utilities
primaryLanguage: JavaScript
languages:
  - name: JavaScript
    percent: 99.59
  - name: Batchfile
    percent: 0.16
  - name: Shell
    percent: 0.25
stars: 1
links:
  repo: 'https://github.com/jparkerweb/indigestion'
featured: false
sortOrder: 999
status: active
lastCommit: '2026-04-17T15:25:57Z'
_source:
  repo: 'https://github.com/jparkerweb/indigestion'
  sha: HEAD
  fetchedAt: '2026-06-04T15:41:42.191Z'
---
A CLI that provides a quick method for creating and sending test emails across test automation environments. It stores each email message as a JSON file in an `emails` directory, parsing common fields such as from, to, cc, bcc, subject, text, html, and attachments to build and send messages. A UI walks through creating new email files, selecting emails for deletion, and sending all emails, while a `--email` flag sends without the UI. SMTP server and authentication settings are kept in a personal `userconfig.json` file (git-ignored), and messages are sent using nodemailer.

## Installation

**Indigestion** runs in [Node](https://nodejs.org).

* Install [NodeJS](https://nodejs.org)

* Install Indigestion node_module dependencies:
  `npm install`

---
