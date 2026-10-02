import { describe, expect, it } from 'vitest';
import {
  mcpPublicToolName,
  validMcpServerName,
} from '../src/server/mcp-naming.js';

describe('MCP naming', () => {
  it('keeps clean stable names unchanged', () => {
    expect(mcpPublicToolName('github', 'create_issue')).toBe(
      'mcp__github__create_issue',
    );
  });

  it('normalizes unsafe names and adds a stable collision hash', () => {
    const a = mcpPublicToolName('github', 'create issue');
    const b = mcpPublicToolName('github', 'create/issue');
    expect(a).toMatch(/^mcp__github__create_issue_[0-9a-f]{12}$/);
    expect(b).toMatch(/^mcp__github__create_issue_[0-9a-f]{12}$/);
    expect(a).not.toBe(b);
  });

  it('enforces the server namespace contract', () => {
    expect(validMcpServerName('notion-prod')).toBe(true);
    expect(validMcpServerName('bad server')).toBe(false);
    expect(() => mcpPublicToolName('bad server', 'search')).toThrow();
  });

  it('never exceeds the model-facing 64-character name budget', () => {
    expect(mcpPublicToolName('github', 'x'.repeat(200)).length).toBeLessThanOrEqual(
      64,
    );
  });
});
