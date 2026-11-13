#!/usr/bin/env node
// PreToolUse hook (Read): blocks real env files under any name. .env.example stays readable.
import { relative } from 'node:path';
import { repoRoot } from '../src/git.ts';
import { checkReadPath } from '../src/guards.ts';
import { block, readGuardInput } from '../src/hook-io.ts';

const { file_path: filePath } = await readGuardInput();
if (typeof filePath !== 'string') block('Blocked by the repo guard: the input has no file path.');
const reason = checkReadPath(relative(repoRoot(), filePath));
if (reason) block(`Blocked by the repo's guard: ${reason}`);
