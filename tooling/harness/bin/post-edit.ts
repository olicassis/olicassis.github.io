#!/usr/bin/env node
// PostToolUse hook (Edit|Write): format the file, then run `astro check` for site files and the
// related tests for tooling files. Problems go back to Claude (exit 2) so it fixes them right away.
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { relative } from 'node:path';
import { checksAfterEdit } from '../src/checks.ts';
import { repoRoot } from '../src/git.ts';
import { block, isInsideRepo, readHookInput } from '../src/hook-io.ts';

const input = await readHookInput();
const filePath = input.tool_input?.file_path;
if (!filePath || !existsSync(filePath)) process.exit(0);

const root = repoRoot();
if (!isInsideRepo(root, filePath)) process.exit(0);
const rel = relative(root, filePath);
const run = (args: readonly string[]) =>
  spawnSync('pnpm', ['exec', ...args], { cwd: root, encoding: 'utf8' });
const problems: string[] = [];

for (const check of checksAfterEdit(rel)) {
  if (check === 'format') {
    run(['prettier', '--write', '--log-level', 'warn', rel]);
  } else if (check === 'astro') {
    const result = run(['astro', 'check', '--minimumSeverity', 'warning']);
    if (result.status !== 0) problems.push(`astro check:\n${result.stdout.slice(-4000)}`);
  } else if (check === 'test') {
    const result = run(['vitest', 'related', '--run', '--passWithNoTests', filePath]);
    if (result.status !== 0) problems.push(`Related tests:\n${result.stdout.slice(-4000)}`);
  }
}

if (problems.length > 0) block(problems.join('\n\n'));
