#!/usr/bin/env node
// PreToolUse hook (Bash): blocks force pushes, pushes to main, merges, rm -rf and npm installs.
import { currentBranch, repoRoot } from '../src/git.ts';
import { checkBashCommand } from '../src/guards.ts';
import { block, readGuardInput } from '../src/hook-io.ts';

const { command } = await readGuardInput();
if (typeof command !== 'string') block('Blocked by the repo guard: the input has no command.');
const reason = checkBashCommand(command, currentBranch(repoRoot()));
if (reason) block(`Blocked by the repo's guard: ${reason}`);
