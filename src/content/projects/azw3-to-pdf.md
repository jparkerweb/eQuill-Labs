---
id: azw3-to-pdf
name: azw3-to-pdf
slug: azw3-to-pdf
tagline: 'Turn Kindle books into PDFs, from a terminal interface or a single command.'
description:
  short: >-
    Go CLI and terminal browser that converts Kindle .azw3, .azw, .mobi and .prc
    books into PDFs.
  long: >-
    azw3-to-pdf reads `.azw3`, `.azw`, `.mobi` and `.prc` files and lays them
    out as PDFs. The MOBI/KF8 parser, the layout engine and the PDF writer are
    all part of the binary, so there is no Calibre, no Python and no Ghostscript
    to install alongside it. Run it with no arguments to get a file browser in
    the terminal and pick a book, or drive it from the shell with `--no-tui` to
    convert a single file, a whole folder recursively, or several books at once
    with `--jobs`. Layout presets cover e-reader, paperback, print and large
    print, and every setting can be tuned by hand. Output keeps chapter breaks,
    headings, illustrations, the cover, hanging indents and justified text taken
    from the book's own stylesheet, and produces real PDFs with selectable text,
    outline bookmarks from the book's headings, page numbers and document
    metadata. A `probe` subcommand inspects a book without converting it.
banner:
  src: >-
    https://raw.githubusercontent.com/jparkerweb/azw3-to-pdf/main/azw3-to-pdf.jpg
  alt: azw3-to-pdf banner
  source: repo
topics: []
category: app
theme: utilities
primaryLanguage: Go
languages:
  - name: Makefile
    percent: 0.36
  - name: Go
    percent: 99.64
stars: 0
links:
  repo: 'https://github.com/jparkerweb/azw3-to-pdf'
  homepage: azw3-to-pdf.equilllabs.com
featured: false
sortOrder: 1000
status: active
lastCommit: '2026-09-04T19:54:38Z'
_source:
  repo: 'https://github.com/jparkerweb/azw3-to-pdf'
  sha: HEAD
  fetchedAt: '2026-10-06T01:55:55.892Z'
---
azw3-to-pdf reads `.azw3`, `.azw`, `.mobi` and `.prc` files and lays them out as PDFs. The MOBI/KF8 parser, the layout engine and the PDF writer are all part of the binary, so there is no Calibre, no Python and no Ghostscript to install alongside it. Run it with no arguments to get a file browser in the terminal and pick a book, or drive it from the shell with `--no-tui` to convert a single file, a whole folder recursively, or several books at once with `--jobs`. Layout presets cover e-reader, paperback, print and large print, and every setting can be tuned by hand. Output keeps chapter breaks, headings, illustrations, the cover, hanging indents and justified text taken from the book's own stylesheet, and produces real PDFs with selectable text, outline bookmarks from the book's headings, page numbers and document metadata. A `probe` subcommand inspects a book without converting it.

## Install

```sh
go install github.com/jparkerweb/azw3-to-pdf/cmd/azw3-to-pdf@latest
```

Or clone and build:

```sh
git clone https://github.com/jparkerweb/azw3-to-pdf.git
cd azw3-to-pdf
make build
```
