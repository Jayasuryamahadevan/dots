import { describe, expect, it } from 'vitest';
import { parseMcpServers } from '../src/server/mcp.js';

describe('MCP server configuration', () => {
  it('parses multiple remote servers with defaults', () => {
    const servers = parseMcpServers(
      JSON.stringify([
        {
          serverName: 'notion',
          transport: 'streamable-http',
          url: 'https://mcp.notion.com/mcp',
          headers: {},
        },
        {
          serverName: 'calendar',
          transport: 'streamable-http',
          url: 'https://calendarmcp.googleapis.com/mcp/v1',
          headers: {},
        },
      ]),
    );
    expect(servers.map((server) => server.serverName)).toEqual([
      'notion',
      'calendar',
    ]);
    expect(servers[0].toolCallTimeoutMs).toBe(60_000);
    expect(servers[0].reconnect.enabled).toBe(true);
  });

  it('rejects duplicate and unsafe namespaces', () => {
    expect(() =>
      parseMcpServers(
        JSON.stringify([
          {
            serverName: 'notion',
            transport: 'streamable-http',
            url: 'https://mcp.notion.com/mcp',
            headers: {},
          },
          {
            serverName: 'notion',
            transport: 'streamable-http',
            url: 'https://example.com/mcp',
            headers: {},
          },
        ]),
      ),
    ).toThrow(/duplicate/i);

    expect(() =>
      parseMcpServers(
        JSON.stringify([
          {
            serverName: 'bad server',
            transport: 'streamable-http',
            url: 'https://example.com/mcp',
            headers: {},
          },
        ]),
      ),
    ).toThrow(/invalid/i);
  });
});
