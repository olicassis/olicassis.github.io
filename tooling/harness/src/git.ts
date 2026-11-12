import { execFileSync } from 'node:child_process';

export function git(args: readonly string[], cwd: string = process.cwd()): string {
  return execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  }).trim();
}

export function repoRoot(): string {
  return process.env.CLAUDE_PROJECT_DIR || git(['rev-parse', '--show-toplevel']);
}

export function currentBranch(root: string): string | null {
  try {
    return git(['branch', '--show-current'], root) || null;
  } catch {
    return null;
  }
}

/** The base the branch is compared with: origin/main when fetched, else main. */
export function baseRef(root: string): string | null {
  for (const ref of ['origin/main', 'main']) {
    try {
      git(['rev-parse', '--verify', '--quiet', ref], root);
      return ref;
    } catch {
      // try the next one
    }
  }
  return null;
}

/** Paths changed on this branch against the base, including uncommitted and untracked files. */
export function changedPaths(root: string): string[] {
  const ref = baseRef(root);
  const paths = new Set<string>();
  const add = (out: string) =>
    out
      .split('\n')
      .filter(Boolean)
      .forEach((p) => paths.add(p));
  if (ref) add(git(['diff', '--name-only', `${ref}...HEAD`], root));
  add(git(['diff', '--name-only', 'HEAD'], root));
  add(git(['ls-files', '--others', '--exclude-standard'], root));
  return [...paths];
}
