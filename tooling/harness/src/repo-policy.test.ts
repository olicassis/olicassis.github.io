// Keeps repo config that no other check reads in line with CLAUDE.md and docs/principles.md.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { SCOPES, TYPE_EMOJI } from '../../../commitlint.config.mjs';

const ROOT = join(import.meta.dirname, '../../..');
const read = (path: string) => readFileSync(join(ROOT, path), 'utf8');
const WORKFLOW_DIR = '.github/workflows';
const workflows = readdirSync(join(ROOT, WORKFLOW_DIR)).map((name) => ({
  name,
  text: read(`${WORKFLOW_DIR}/${name}`),
}));

type HookEntry = { matcher?: string; hooks: { command: string }[] };
type Settings = {
  permissions: { allow: string[]; ask: string[]; deny: string[] };
  hooks: Record<string, HookEntry[]>;
};
const settings = JSON.parse(read('.claude/settings.json')) as Settings;

describe('.claude/settings.json', () => {
  it.each(['Read', 'Edit'])('denies %s of real env files', (tool) => {
    for (const name of ['.env', '.env.local', '.env.production', '.env.*.local']) {
      expect(settings.permissions.deny).toContain(`${tool}(./**/${name})`);
    }
  });

  it('asks before a push, a PR, a new dependency or a web request', () => {
    for (const rule of ['Bash(git push:*)', 'Bash(gh pr create:*)', 'Bash(pnpm add:*)']) {
      expect(settings.permissions.ask).toContain(rule);
    }
    expect(settings.permissions.ask).toEqual(expect.arrayContaining(['WebFetch', 'WebSearch']));
  });

  it('points every hook at a script that exists', () => {
    const commands = Object.values(settings.hooks).flatMap((entries) =>
      entries.flatMap((entry) => entry.hooks.map((hook) => hook.command)),
    );
    expect(commands.length).toBeGreaterThan(0);
    for (const command of commands) {
      const script = /\/(tooling\/harness\/bin\/[\w-]+\.ts)/.exec(command)?.[1];
      expect(script, command).toBeDefined();
      expect(existsSync(join(ROOT, script ?? '')), script).toBe(true);
    }
  });

  it.each(['Bash', 'Read', 'Edit|MultiEdit|Write'])('runs a guard before %s', (matcher) => {
    expect(settings.hooks.PreToolUse?.map((entry) => entry.matcher)).toContain(matcher);
  });
});

describe('GitHub workflows', () => {
  it.each(workflows)('$name pins every action to a full commit SHA', ({ text }) => {
    const uses = [...text.matchAll(/^\s*-?\s*uses:\s*(\S+)/gm)].map((m) => m[1] ?? '');
    for (const ref of uses.filter((u) => !u.startsWith('./'))) {
      expect(ref, ref).toMatch(/@[0-9a-f]{40}$/);
    }
  });

  it.each(workflows)('$name sets the token permissions', ({ text }) => {
    expect(text).toMatch(/^permissions:/m);
  });
});

describe('commit format', () => {
  it('lists the same scopes in .gitmessage and commitlint', () => {
    const line = /^# Scopes: (.+)$/m.exec(read('.gitmessage'))?.[1] ?? '';
    expect(line.split(' ')).toEqual(SCOPES);
  });

  it('lists every commit type in the PR template, with its emoji', () => {
    const template = read('.github/pull_request_template.md');
    for (const [type, emoji] of Object.entries(TYPE_EMOJI)) {
      expect(template).toContain(`${emoji} ${type}:`);
    }
  });

  it('gives Dependabot commits a valid type, scope and emoji', () => {
    const prefixes = [
      ...read('.github/dependabot.yml').matchAll(/prefix: '(\w+)\((\w+)\): (\S+)'/g),
    ];
    expect(prefixes.length).toBeGreaterThan(0);
    for (const [, type = '', scope = '', emoji] of prefixes) {
      expect(TYPE_EMOJI).toHaveProperty(type, emoji);
      expect(SCOPES).toContain(scope);
    }
  });
});
