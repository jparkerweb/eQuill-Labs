---
id: bivariate
name: Bivariate
slug: bivariate
tagline: 'An opinionated interface for writing, running, and saving BackstopJS tests'
description:
  short: >-
    An opinionated interface for writing, running, and saving BackstopJS visual
    regression tests.
  long: >-
    An opinionated interface for writing, running, and saving BackstopJS tests,
    aimed at making visual regression testing approachable for projects of any
    size without overwhelming complexity. It enforces a grouping structure and
    lets tests be written as manageable JavaScript object files rather than a
    single BackstopJS JSON config, while exposing all of BackstopJS's commands
    through the interface. All tests, scripts, and configuration live under a
    `bivariate_data` folder, with separate areas for test scripts, Puppeteer
    engine scripts that interact with the Chrome DOM before screenshots, and an
    archive of reference bitmaps. It runs on Node and headless Chrome, and is
    typically installed globally via npm.
banner:
  src: bivariate.png
  alt: Bivariate banner
  source: repo
topics:
  - backstopjs
  - visualtesting
  - javascript
  - regression-testing
  - css
  - layout
  - browser-automation
  - equill-cli
category: cli
theme: utilities
primaryLanguage: JavaScript
languages:
  - name: JavaScript
    percent: 87.24
  - name: CSS
    percent: 6.03
  - name: HTML
    percent: 6.73
stars: 19
links:
  repo: 'https://github.com/jparkerweb/Bivariate'
featured: false
sortOrder: 981
status: active
lastCommit: '2023-05-25T14:33:06Z'
_source:
  repo: 'https://github.com/jparkerweb/Bivariate'
  sha: HEAD
  fetchedAt: '2026-06-04T15:41:42.191Z'
---
An opinionated interface for writing, running, and saving BackstopJS tests, aimed at making visual regression testing approachable for projects of any size without overwhelming complexity. It enforces a grouping structure and lets tests be written as manageable JavaScript object files rather than a single BackstopJS JSON config, while exposing all of BackstopJS's commands through the interface. All tests, scripts, and configuration live under a `bivariate_data` folder, with separate areas for test scripts, Puppeteer engine scripts that interact with the Chrome DOM before screenshots, and an archive of reference bitmaps. It runs on Node and headless Chrome, and is typically installed globally via npm.

## Installation

**Bivariate** runs in [Node](https://nodejs.org).

* Install [NodeJS](https://nodejs.org)

* Install the Latest version of Bivariate via NPM.  
It is *recommended* to install Bivariate *globally*, but it can run locally if required:  
  
  global install (*recommended*):  
  `npm install bivariate -g`

  local install:  
  `npm install bivariate`

* Ensure you have version 59 or greater of [Chrome](https://www.google.com/chrome/browser/) installed.
  Bivariate utilizes headless Chrome which started shipping in Chrome v59

* From your project directory, run Bivariate:  
  if installed globally:  
  `bivariate`

  if only installed locally:  
  `npx bivariate`
  
* Generate `bivariate_data`:  
  If Bivariate doesn't detect any existing Bivarte tests it will ask you would like to generate the starting configuration files.  

  ![Bivariate App](https://raw.githubusercontent.com/jparkerweb/Bivariate/master/documentation/first-run.gif)
