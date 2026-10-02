# MCP setup

Dots can connect to multiple MCP servers and grant them independently to each Dot.

## Configuration

Set `MCP_SERVERS_JSON` to a JSON array. Supported transports are `stdio` and `streamable-http`.

Example:

```json
[
  {
    "serverName": "notion",
    "transport": "streamable-http",
    "url": "https://mcp.notion.com/mcp",
    "headers": {}
  },
  {
    "serverName": "calendar",
    "transport": "streamable-http",
    "url": "https://calendarmcp.googleapis.com/mcp/v1",
    "headers": {}
  }
]
```

Configured servers are not automatically exposed to agents. A Dot must explicitly list a server in its `mcpServerNames` grant.

## Official remote services

Notion:
- `https://mcp.notion.com/mcp`

Google Workspace:
- Gmail: `https://gmailmcp.googleapis.com/mcp/v1`
- Drive: `https://drivemcp.googleapis.com/mcp/v1`
- Docs: `https://docsmcp.googleapis.com/mcp/v1`
- Sheets: `https://sheetsmcp.googleapis.com/mcp/v1`
- Slides: `https://slidesmcp.googleapis.com/mcp/v1`
- Calendar: `https://calendarmcp.googleapis.com/mcp/v1`
- Chat: `https://chatmcp.googleapis.com/mcp/v1`
- People: `https://people.googleapis.com/mcp/v1`

## Authentication

The official Notion and Google Workspace remote servers use OAuth. The current branch can connect to HTTP servers with explicit headers and to local stdio servers, but it does not yet implement the interactive OAuth callback/token-refresh lifecycle.

Do not commit access tokens, refresh tokens, client secrets, or service credentials into this repository.

For local Notion testing, an operator can use a stdio OAuth bridge such as `mcp-remote`. Production deployments should use encrypted server-side OAuth token storage and refresh handling; that is the next production block.

## Security model

- MCP server names are stable namespaces.
- Model-facing tool names are `mcp__<serverName>__<tool>`.
- Stdio child processes receive a scrubbed parent environment; credential-shaped ambient variables are removed unless explicitly provided.
- Calls have bounded timeouts and inherit agent cancellation.
- Tool discovery has pagination and duplicate-name safety limits.
- Every Dot receives only its explicitly granted MCP servers.
- Changing a Dot's MCP grants aborts an in-flight turn so stale permissions cannot continue.
- MCP server instructions are treated as untrusted integration metadata, never as higher-priority instructions.
