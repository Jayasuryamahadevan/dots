import { createHash } from 'node:crypto';

const MAX_PUBLIC_NAME_LENGTH = 64;
const INVALID_NAME_CHARS = /[^A-Za-z0-9_-]/g;
const HASH_LENGTH = 12;
const SERVER_NAME_PATTERN = /^[A-Za-z0-9_-]{1,32}$/;

/**
 * MCP public-name contract adapted from DeepSeek Harness (MIT).
 * The remote tool name is never recovered by parsing this value; callers keep
 * the raw MCP name separately for wire calls.
 */
export function mcpPublicToolName(serverName: string, rawName: string): string {
  if (!SERVER_NAME_PATTERN.test(serverName))
    throw new Error(
      'MCP server name must match [A-Za-z0-9_-]{1,32}.',
    );
  if (!rawName)
    throw new Error('MCP tool name cannot be empty.');

  const joined = `mcp__${serverName}__${rawName}`;
  const normalized = joined.replace(INVALID_NAME_CHARS, '_');
  if (
    normalized === joined &&
    normalized.length <= MAX_PUBLIC_NAME_LENGTH
  )
    return normalized;

  const hash = createHash('sha256')
    .update(`${serverName}\0${rawName}`)
    .digest('hex')
    .slice(0, HASH_LENGTH);

  return `${normalized.slice(
    0,
    MAX_PUBLIC_NAME_LENGTH - HASH_LENGTH - 1,
  )}_${hash}`;
}

export function validMcpServerName(serverName: string): boolean {
  return SERVER_NAME_PATTERN.test(serverName);
}
