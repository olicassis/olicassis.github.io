// Claude Code hooks receive JSON on stdin. Exit code 2 blocks the action and shows stderr to Claude.
import { isAbsolute, relative } from 'node:path';

export type ToolInput = {
  command?: string;
  file_path?: string;
};

export type HookInput = {
  tool_input?: ToolInput;
  stop_hook_active?: boolean;
};

async function readStdin(): Promise<string> {
  let raw = '';
  for await (const chunk of process.stdin) raw += chunk;
  return raw;
}

function parseHookInput(raw: string): HookInput | null {
  try {
    return JSON.parse(raw) as HookInput;
  } catch {
    return null;
  }
}

export async function readHookInput(): Promise<HookInput> {
  return parseHookInput(await readStdin()) ?? {};
}

/** A guard fails closed: input that it cannot read blocks the action. */
export async function readGuardInput(): Promise<ToolInput> {
  const toolInput = parseHookInput(await readStdin())?.tool_input;
  if (!toolInput) block('Blocked by the repo guard: the hook input is not readable.');
  return toolInput;
}

export function isInsideRepo(root: string, filePath: string): boolean {
  const path = relative(root, filePath);
  return !path.startsWith('..') && !isAbsolute(path);
}

/** The Stop hook's counter file. A broken file counts as no blocks, so the hook still runs. */
export function parseBlockCount(text: string): number {
  try {
    const { count } = JSON.parse(text) as { count?: unknown };
    return typeof count === 'number' ? count : 0;
  } catch {
    return 0;
  }
}

export function block(reason: string): never {
  process.stderr.write(`${reason}\n`);
  process.exit(2);
}
