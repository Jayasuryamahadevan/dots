# DeepSeek Harness integration notes

This branch selectively adapts MCP design patterns from DeepSeek Harness into Dots. It does not embed the DeepSeek Harness runtime or Cordis.

## Why selective reuse

Dots already has its own agent runtime, tool permissions, UI, and persistent workspace. Pulling the full Cordis runtime would duplicate those responsibilities and introduce a large dependency graph.

The reusable pieces are:

- stable MCP tool names: `mcp__<server>__<tool>`
- collision-safe normalization for provider tool names
- stdio and Streamable HTTP transports through the official MCP SDK
- credential-scrubbed stdio environments
- atomic tool-list refresh
- bounded per-call timeouts
- reconnect with exponential backoff
- literal, size-bounded MCP server instructions

## Integration order

1. Land namespace and configuration primitives.
2. Add an MCP connection manager backed by `@modelcontextprotocol/client`.
3. Adapt discovered MCP JSON Schemas directly into TanStack AI server tools.
4. Add per-Dot MCP server allowlists before exposing MCP tools to agents.
5. Add secrets storage so tokens are not persisted in Dot/workspace records.
6. Add reconnection, metrics, and audit events.
7. Add resource discovery/read support.

## Attribution

The MCP naming and lifecycle design is adapted from the MIT-licensed
`deepseek-ai/deepseek-harness` project, especially
`packages/mcp/mcp-client`.

Copyright (c) 2026 DeepSeek.
DeepSeek Harness is distributed under the MIT License.
