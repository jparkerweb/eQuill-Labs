---
id: obsidian-image-from-field
name: obsidian-image-from-field
slug: obsidian-image-from-field
tagline: >-
  DataviewJS Script to render a Markdown image in Reading View using a local
  field for the source
description:
  short: >-
    A DataviewJS script that renders a Markdown image in Obsidian's Reading View
    using a URL stored in a note field.
  long: >-
    A DataviewJS script that renders a Markdown image in Obsidian's Reading View
    using an image URL stored in a frontmatter or inline field. It addresses the
    case where an image URL is kept in a field for dataview queries but should
    also display on its own note, avoiding the duplication of embedding the
    image separately. The script reads the URL from the supplied field and
    renders the image, and additionally accepts size and alignment values. It
    requires the Dataview plugin with JavaScript Queries enabled and is invoked
    through a `dv.view` call passing size, alignment, and field name.
banner:
  src: >-
    https://github.com/jparkerweb/obsidian-image-from-field/blob/main/obsidian-image-from-field.jpg?raw=true
  alt: obsidian-image-from-field banner
  source: repo
topics:
  - equill-plugin
  - obsidian
  - obsidian-script
category: plugin
theme: obsidian
primaryLanguage: JavaScript
languages:
  - name: CSS
    percent: 36.9
  - name: JavaScript
    percent: 63.1
stars: 2
links:
  repo: 'https://github.com/jparkerweb/obsidian-image-from-field'
featured: false
sortOrder: 998
status: active
lastCommit: '2026-05-12T04:43:49Z'
_source:
  repo: 'https://github.com/jparkerweb/obsidian-image-from-field'
  sha: HEAD
  fetchedAt: '2026-06-06T19:22:18.421Z'
---
A DataviewJS script that renders a Markdown image in Obsidian's Reading View using an image URL stored in a frontmatter or inline field. It addresses the case where an image URL is kept in a field for dataview queries but should also display on its own note, avoiding the duplication of embedding the image separately. The script reads the URL from the supplied field and renders the image, and additionally accepts size and alignment values. It requires the Dataview plugin with JavaScript Queries enabled and is invoked through a `dv.view` call passing size, alignment, and field name.
