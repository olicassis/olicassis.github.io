#!/usr/bin/env node
// PreToolUse hook (Edit|MultiEdit|Write): protects real env files and generated files.
import { relative } from 'node:path';
import { repoRoot } from '../src/git.ts';
import { checkFileEdit } from '../src/guards.ts';
import { block, readGuardInput } from '../src/hook-io.ts';

const { file_path: filePath } = await readGuardInput();
if (typeof filePath !== 'string') block('Blocked by the repo guard: the input has no file path.');
const reason = checkFileEdit(relative(repoRoot(), filePath));
if (reason) block(`Blocked by the repo's guard: ${reason}`);
