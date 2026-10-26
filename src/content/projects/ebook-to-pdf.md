---
id: ebook-to-pdf
name: ebook-to-pdf
slug: ebook-to-pdf
tagline: >-
  Turn ebooks into PDFs, from a terminal interface or a single command: EPUB,
  Kindle, comic archives, FictionBook, plain text and HTML.
description:
  short: >-
    Go CLI and terminal browser that converts EPUB, Kindle, comic archive,
    FictionBook, plain text and HTML ebooks into PDFs.
  long: >-
    ebook-to-pdf reads `.epub`, `.azw3`, `.azw`, `.mobi`, `.prc`, `.cbz`,
    `.fb2`, `.fb2.zip`, `.txt`, `.html`, `.htm` and `.xhtml` files and lays them
    out as PDFs. Every format reader, the layout engine and the PDF writer are
    part of the binary, so there is no Calibre, no Python and no Ghostscript to
    install. Run it with no arguments to browse for a book in the terminal
    interface, or pass `--no-tui` to convert a single book or a whole folder,
    several at a time with `--jobs`. Layout presets cover e-reader, paperback,
    print, A4, compact, large print, phone and manuscript, and any preset can be
    overridden with flags or a `config.yaml` file. Output keeps chapter breaks,
    headings, illustrations, the cover and hanging indents from the book's own
    stylesheet, with selectable text, outline bookmarks, page numbers and
    document metadata. DRM is not removed: a locked EPUB or Kindle book is
    refused. The project was renamed from azw3-to-pdf.
banner:
  src: >-
    https://raw.githubusercontent.com/jparkerweb/ebook-to-pdf/main/ebook-to-pdf.jpg
  alt: ebook-to-pdf banner
  source: repo
topics: []
category: app
theme: utilities
primaryLanguage: Go
languages:
  - name: Makefile
    percent: 0.19
  - name: Go
    percent: 99.81
stars: 0
links:
  repo: 'https://github.com/jparkerweb/ebook-to-pdf'
  homepage: 'https://ebook-to-pdf.equilllabs.com'
featured: false
sortOrder: 1000
status: active
lastCommit: '2026-10-25T23:53:15Z'
_source:
  repo: 'https://github.com/jparkerweb/ebook-to-pdf'
  sha: HEAD
  fetchedAt: '2026-10-26T13:01:16.359Z'
---
ebook-to-pdf reads `.epub`, `.azw3`, `.azw`, `.mobi`, `.prc`, `.cbz`, `.fb2`, `.fb2.zip`, `.txt`, `.html`, `.htm` and `.xhtml` files and lays them out as PDFs. Every format reader, the layout engine and the PDF writer are part of the binary, so there is no Calibre, no Python and no Ghostscript to install. Run it with no arguments to browse for a book in the terminal interface, or pass `--no-tui` to convert a single book or a whole folder, several at a time with `--jobs`. Layout presets cover e-reader, paperback, print, A4, compact, large print, phone and manuscript, and any preset can be overridden with flags or a `config.yaml` file. Output keeps chapter breaks, headings, illustrations, the cover and hanging indents from the book's own stylesheet, with selectable text, outline bookmarks, page numbers and document metadata. DRM is not removed: a locked EPUB or Kindle book is refused. The project was renamed from azw3-to-pdf.

## Install

```sh
go install github.com/jparkerweb/ebook-to-pdf/cmd/ebook-to-pdf@latest
```

Or clone and build:

```sh
git clone https://github.com/jparkerweb/ebook-to-pdf.git
cd ebook-to-pdf
make build
```
