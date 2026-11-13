// Runs the hook scripts as Claude Code runs them: JSON on stdin, and exit code 2 blocks the action.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { parseBlockCount } from './hook-io.ts';

// Each test starts Node and git, which is slow on a busy machine.
vi.setConfig({ testTimeout: 30_000 });

const ROOT = join(import.meta.dirname, '../../..');
const BLOCKED = 2;

function runHook(script: string, stdin: string) {
  return spawnSync('node', [join(ROOT, 'tooling/harness/bin', script)], {
    cwd: ROOT,
    input: stdin,
    encoding: 'utf8',
  });
}

const toolInput = (input: object) => JSON.stringify({ tool_input: input });

describe.each(['guard-bash.ts', 'guard-edit.ts', 'guard-read.ts'])('%s', (script) => {
  it.each([
    ['invalid JSON', 'not json'],
    ['empty input', ''],
    ['no tool input', '{}'],
  ])('blocks on %s', (_kind, stdin) => {
    expect(runHook(script, stdin).status).toBe(BLOCKED);
  });
});

describe('guard-bash.ts', () => {
  it('allows a safe command', () => {
    expect(runHook('guard-bash.ts', toolInput({ command: 'pnpm test' })).status).toBe(0);
  });

  it('blocks a force push', () => {
    const input = toolInput({ command: 'git push --force origin feat/x' });
    expect(runHook('guard-bash.ts', input).status).toBe(BLOCKED);
  });
});

describe('guard-read.ts', () => {
  it('blocks a real env file', () => {
    const input = toolInput({ file_path: join(ROOT, '.env') });
    expect(runHook('guard-read.ts', input).status).toBe(BLOCKED);
  });

  it('allows .env.example', () => {
    const input = toolInput({ file_path: join(ROOT, '.env.example') });
    expect(runHook('guard-read.ts', input).status).toBe(0);
  });
});

describe('guard-edit.ts', () => {
  it('allows a safe edit', () => {
    const input = toolInput({ file_path: join(ROOT, 'README.md'), new_string: 'text' });
    expect(runHook('guard-edit.ts', input).status).toBe(0);
  });

  it('blocks the generated token stylesheet', () => {
    const input = toolInput({ file_path: join(ROOT, 'src/styles/tokens.css'), content: '' });
    expect(runHook('guard-edit.ts', input).status).toBe(BLOCKED);
  });
});

describe('parseBlockCount', () => {
  it.each([
    ['a valid file', '{"count":2}', 2],
    ['broken JSON', 'not json', 0],
    ['a count that is not a number', '{"count":"x"}', 0],
  ])('reads %s', (_name, text, count) => {
    expect(parseBlockCount(text)).toBe(count);
  });
});

describe('post-edit.ts', () => {
  it('skips a file outside the repo', () => {
    const dir = mkdtempSync(join(tmpdir(), 'post-edit-'));
    const file = join(dir, 'outside.ts');
    writeFileSync(file, 'export const unused = 1;\n');
    try {
      const result = runHook('post-edit.ts', toolInput({ file_path: file }));
      expect(result.stderr).toBe('');
      expect(result.status).toBe(0);
    } finally {
      rmSync(dir, { recursive: true });
    }
  });
});
