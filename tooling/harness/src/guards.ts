// Pure decision functions behind the Claude Code hooks. Each returns null (allow) or a reason (block).
import { basename } from 'node:path';

// `git`, then any global options (-C dir, -c key=value, --no-pager, --git-dir .git), then `push`.
const GIT_PUSH = String.raw`\bgit(?:\s+-[cC]\s+\S+|\s+--[\w-]+(?:[=\s]\S+)?)*\s+push\b`;
const PUSH_TO_MAIN = 'Never push to main. Push your branch and open a PR.';

/** Files that a script writes. Edit the source, then run the script. */
export const GENERATED_FILES: Readonly<Record<string, string>> = {
  'src/styles/tokens.css': 'Edit design/tokens.json, then run `pnpm tokens`.',
};

const BLOCKED_COMMANDS: ReadonlyArray<readonly [RegExp, string]> = [
  [
    new RegExp(
      String.raw`${GIT_PUSH}[^|;&]*\s(?:--force(?!-with-lease)|--mirror|--all|-[a-zA-Z]*f[a-zA-Z]*|\+\S+)(?=[\s;&|]|$)`,
    ),
    'Force, mirror and all-branch pushes are not allowed.',
  ],
  [
    new RegExp(String.raw`${GIT_PUSH}[^|;&]*\s\+?(?:\S*:)?(?:refs\/heads\/)?main(?=[\s;&|]|$)`),
    PUSH_TO_MAIN,
  ],
  [/\bgh\s+pr\s+merge\b/, "Merging is the project owner's call; ask the owner."],
  [
    /\bnpm\s+(?:i|install|ci|add)\b/,
    'This repo uses pnpm. Use `pnpm install` or ask to add a dependency.',
  ],
];

function isRecursiveForceRm(command: string): boolean {
  return [...command.matchAll(/\brm\s+([^|;&]*)/g)].some((match) => {
    const flags = (match[1] ?? '').split(/\s+/).filter((word) => word.startsWith('-'));
    const has = (short: RegExp, long: string) =>
      flags.some((flag) => flag === long || (!flag.startsWith('--') && short.test(flag)));
    return has(/r/i, '--recursive') && has(/f/, '--force');
  });
}

/** A push with no branch name (or HEAD) goes to the current branch. */
function pushesCurrentBranch(command: string): boolean {
  return [...command.matchAll(new RegExp(String.raw`${GIT_PUSH}([^|;&]*)`, 'g'))].some((match) => {
    const words = (match[1] ?? '').split(/\s+/).filter((word) => word && !word.startsWith('-'));
    const [, branch] = words;
    return branch === undefined || branch === 'HEAD';
  });
}

export function checkBashCommand(command: string, currentBranch?: string | null): string | null {
  // The shell removes quotes, so "main" and main are the same branch.
  const unquoted = command.replace(/["']/g, '');
  for (const [pattern, reason] of BLOCKED_COMMANDS) {
    if (pattern.test(unquoted)) return reason;
  }
  if (currentBranch === 'main' && pushesCurrentBranch(unquoted)) return PUSH_TO_MAIN;
  if (isRecursiveForceRm(unquoted)) return 'rm -rf is blocked; delete specific files instead.';
  return null;
}

/** Any .env file except .env.example holds real values. New names are blocked too. */
function isRealEnvFile(path: string): boolean {
  const name = basename(path);
  return /^\.env(?:\..+)?$/.test(name) && name !== '.env.example';
}

export function checkReadPath(path: string): string | null {
  return isRealEnvFile(path)
    ? `${path} is a real env file with real values. Read .env.example for the names.`
    : null;
}

/** `path` is relative to the repo root. */
export function checkFileEdit(path: string): string | null {
  if (isRealEnvFile(path)) {
    return `${path} is a real env file with real values. The owner edits it by hand.`;
  }
  const generated = GENERATED_FILES[path];
  if (generated) return `${path} is generated. ${generated}`;
  return null;
}
