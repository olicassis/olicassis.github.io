#!/usr/bin/env node
// Stop hook: Claude cannot finish while a check of the changed files is red. After 3 blocks in a
// row it lets Claude stop and say what is still failing.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { type Check, checksBeforeStop, isFormatted } from '../src/checks.ts';
import { changedPaths, repoRoot } from '../src/git.ts';
import { parseBlockCount, readHookInput } from '../src/hook-io.ts';

const MAX_CONSECUTIVE_BLOCKS = 3;
const input = await readHookInput();
const root = repoRoot();
const counterFile = join(root, '.claude/state/stop-blocks.json');
const blocksSoFar =
  input.stop_hook_active && existsSync(counterFile)
    ? parseBlockCount(readFileSync(counterFile, 'utf8'))
    : 0;

const changed = changedPaths(root).filter(
  (p) => !p.startsWith('.claude/state/') && existsSync(join(root, p)),
);
if (changed.length === 0) process.exit(0);

const COMMANDS: Record<Check, readonly string[]> = {
  format: ['exec', 'prettier', '--check', ...changed.filter(isFormatted)],
  astro: ['check'],
  build: ['build'],
  test: ['test'],
  harness: ['harness:check'],
};

const reasons: string[] = [];
for (const check of checksBeforeStop(changed)) {
  const result = spawnSync('pnpm', COMMANDS[check], { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) {
    reasons.push(`pnpm ${check} is red:\n${(result.stdout + result.stderr).slice(-4000)}`);
  }
}

mkdirSync(join(root, '.claude/state'), { recursive: true });
if (reasons.length === 0) {
  writeFileSync(counterFile, JSON.stringify({ count: 0 }));
  process.exit(0);
}
if (blocksSoFar >= MAX_CONSECUTIVE_BLOCKS) {
  writeFileSync(counterFile, JSON.stringify({ count: 0 }));
  process.stderr.write(
    `Stopping with checks still failing after ${MAX_CONSECUTIVE_BLOCKS} attempts. Tell the owner exactly what is red:\n${reasons.join('\n\n')}\n`,
  );
  process.exit(0);
}
writeFileSync(counterFile, JSON.stringify({ count: blocksSoFar + 1 }));
process.stderr.write(reasons.join('\n\n') + '\n');
process.exit(2);
