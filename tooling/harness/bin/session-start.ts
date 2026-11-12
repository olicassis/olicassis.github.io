#!/usr/bin/env node
// SessionStart hook: in cloud sessions, install dependencies so hooks and tests can run.
import { spawnSync } from 'node:child_process';
import { repoRoot } from '../src/git.ts';

if (process.env.CLAUDE_CODE_REMOTE === 'true') {
  const result = spawnSync('pnpm', ['install', '--frozen-lockfile'], {
    cwd: repoRoot(),
    stdio: 'inherit',
  });
  if (result.status !== 0) console.warn('pnpm install failed; hooks and tests may not run.');
}
