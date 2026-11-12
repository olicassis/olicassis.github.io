#!/usr/bin/env node
import { checkBudgets } from '../src/context-budget.ts';
import { repoRoot } from '../src/git.ts';

const problems = checkBudgets(repoRoot());
if (problems.length > 0) {
  console.error(problems.map((p) => `- ${p}`).join('\n'));
  process.exit(1);
}
console.log('Context budgets OK.');
