#!/usr/bin/env node
// Fails if a package.json has a version range. Runs in CI on every PR.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { git, repoRoot } from '../src/git.ts';
import { findUnpinned } from '../src/pinned-versions.ts';

const root = repoRoot();
const manifests = git(
  ['ls-files', '--cached', '--others', '--exclude-standard', '*package.json'],
  root,
)
  .split('\n')
  .filter((p) => p.endsWith('package.json'));
const problems = manifests.flatMap((path) =>
  findUnpinned(JSON.parse(readFileSync(join(root, path), 'utf8'))).map(
    (u) => `${path}: ${u.field}.${u.name} is "${u.spec}". Use an exact version.`,
  ),
);
if (problems.length > 0) {
  console.error(`${problems.join('\n')}\nInstall with pnpm add --save-exact (the .npmrc default).`);
  process.exit(1);
}
console.log(`All dependencies pinned in ${manifests.length} package.json files.`);
