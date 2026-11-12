// Progressive disclosure budgets: CLAUDE.md, rules and skills stay short so they load cheaply.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

export const LIMITS = { claudeMd: 100, rule: 60, skill: 150 };

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (name === 'node_modules' || name === '.git') return [];
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

export function rulePaths(text: string): string[] {
  const front = /^---\n([\s\S]*?)\n---/.exec(text)?.[1] ?? '';
  return [...front.matchAll(/^\s*-\s*["']?([^"'\n]+)["']?\s*$/gm)].map((m) => (m[1] ?? '').trim());
}

/** Minimal glob: ** = any depth, * = within a segment. */
export function globToRegExp(glob: string): RegExp {
  const escaped = glob.replace(/[.+^${}()|[\]\\]/g, '\\$&');
  const pattern = escaped
    .replace(/\*\*\/?/g, '§§')
    .replace(/\*/g, '[^/]*')
    .replace(/§§/g, '(?:.*/)?');
  return new RegExp(`^${pattern.replace(/\(\?:\.\*\/\)\?$/, '.*')}$`);
}

const lineCount = (file: string): number => readFileSync(file, 'utf8').split('\n').length;

export function checkBudgets(root: string): string[] {
  const problems: string[] = [];
  const claudeMd = join(root, 'CLAUDE.md');
  if (existsSync(claudeMd) && lineCount(claudeMd) > LIMITS.claudeMd) {
    problems.push(
      `CLAUDE.md has ${lineCount(claudeMd)} lines (limit ${LIMITS.claudeMd}). Move detail into a rule or skill reference.`,
    );
  }

  const repoFiles = walk(root).map((f) => relative(root, f));
  for (const rule of walk(join(root, '.claude/rules')).filter((f) => f.endsWith('.md'))) {
    const rel = relative(root, rule);
    if (lineCount(rule) > LIMITS.rule)
      problems.push(`${rel} has ${lineCount(rule)} lines (limit ${LIMITS.rule}).`);
    const globs = rulePaths(readFileSync(rule, 'utf8'));
    if (globs.length > 0 && !globs.some((g) => repoFiles.some((f) => globToRegExp(g).test(f)))) {
      problems.push(
        `${rel} matches no file (paths: ${globs.join(', ')}). Remove or fix the stale rule.`,
      );
    }
  }

  const ownSkill = (f: string): boolean => f.endsWith('/SKILL.md');
  for (const skill of walk(join(root, '.claude/skills')).filter(ownSkill)) {
    const rel = relative(root, skill);
    if (lineCount(skill) > LIMITS.skill)
      problems.push(
        `${rel} has ${lineCount(skill)} lines (limit ${LIMITS.skill}). Move detail into references/.`,
      );
  }
  return problems;
}
