---
id: mcp-sqlite
name: mcp-sqlite
slug: mcp-sqlite
tagline: >-
  This is a Model Context Protocol (MCP) server that provides comprehensive
  SQLite database interaction capabilities.
description:
  short: >-
    Model Context Protocol (MCP) server that provides SQLite database
    interaction, including CRUD operations and custom SQL queries.
  long: >-
    A Model Context Protocol (MCP) server that provides comprehensive SQLite
    database interaction capabilities. It exposes complete CRUD operations
    (create, read, update, delete) along with database exploration and
    introspection and the ability to execute custom SQL queries. Tools include
    db_info for database details, list_tables, get_table_schema, and record
    operations such as create_record and read_records with optional filtering,
    limit, and offset. The server is configured in an IDE's MCP settings (for
    example Cursor or VSCode) by running it via `npx` with the path to a SQLite
    database file passed as an argument.
banner:
  src: >-
    https://raw.githubusercontent.com/jparkerweb/mcp-sqlite/refs/heads/main/.readme/mcp-sqlite.jpg
  alt: mcp-sqlite banner
  source: repo
topics:
  - cursor
  - database
  - development
  - mcp
  - nodejs
  - sqlite
  - windsurf
  - aitooling
  - equill-service
category: service
theme: agents
primaryLanguage: JavaScript
languages:
  - name: JavaScript
    percent: 100
stars: 108
links:
  repo: 'https://github.com/jparkerweb/mcp-sqlite'
  homepage: 'https://www.npmjs.com/package/mcp-sqlite'
featured: true
sortOrder: 5
status: active
lastCommit: '2026-04-05T04:51:05Z'
_source:
  repo: 'https://github.com/jparkerweb/mcp-sqlite'
  sha: HEAD
  fetchedAt: '2026-06-06T19:22:18.421Z'
---
A Model Context Protocol (MCP) server that provides comprehensive SQLite database interaction capabilities. It exposes complete CRUD operations (create, read, update, delete) along with database exploration and introspection and the ability to execute custom SQL queries. Tools include db_info for database details, list_tables, get_table_schema, and record operations such as create_record and read_records with optional filtering, limit, and offset. The server is configured in an IDE's MCP settings (for example Cursor or VSCode) by running it via `npx` with the path to a SQLite database file passed as an argument.

## Setup

Define the command in your IDE's MCP Server settings:

e.g. `Cursor`:
```json
{
    "mcpServers": {
        "MCP SQLite Server": {
            "command": "npx",
            "args": [
                "-y",
                "mcp-sqlite",
                "<path-to-your-sqlite-database.db>"
            ]
        }
    }
}
```

e.g. `VSCode`:
```json
{
    "servers": {
        "MCP SQLite Server": {
            "type": "stdio",
            "command": "npx",
            "args": [
                "-y",
                "mcp-sqlite",
                "<path-to-your-sqlite-database.db>"
            ]
        }
    }
}
```

![cursor-settings](https://raw.githubusercontent.com/jparkerweb/mcp-sqlite/refs/heads/main/.readme/cursor-mcp-settings.jpg)

Your database path must be provided as an argument.
