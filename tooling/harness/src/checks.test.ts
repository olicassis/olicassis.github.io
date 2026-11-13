import { describe, expect, it } from 'vitest';
import { checksAfterEdit, checksBeforeStop, isFormatted } from './checks.ts';

describe('isFormatted', () => {
  it.each([
    ['src/pages/index.astro', true],
    ['README.md', true],
    ['src/styles/tokens.css', false],
    ['pnpm-lock.yaml', false],
    ['src/assets/me_manga.jpg', false],
  ])('%s: %s', (path, expected) => {
    expect(isFormatted(path)).toBe(expected);
  });
});

describe('checksAfterEdit', () => {
  it('formats and checks an Astro page', () => {
    expect(checksAfterEdit('src/pages/index.astro')).toEqual(['format', 'astro']);
  });

  it('formats and checks a content entry', () => {
    expect(checksAfterEdit('src/content/projects/one.md')).toEqual(['format', 'astro']);
  });

  it('formats and tests a tooling file', () => {
    expect(checksAfterEdit('tooling/harness/src/guards.ts')).toEqual(['format', 'test']);
  });

  it('only formats a doc', () => {
    expect(checksAfterEdit('docs/principles.md')).toEqual(['format']);
  });

  it('does nothing for an image', () => {
    expect(checksAfterEdit('src/assets/me_manga.jpg')).toEqual([]);
  });
});

describe('checksBeforeStop', () => {
  it('needs nothing when nothing changed', () => {
    expect(checksBeforeStop([])).toEqual([]);
  });

  it('checks and builds the site after a token change', () => {
    expect(checksBeforeStop(['design/tokens.json'])).toEqual(['format', 'astro', 'build']);
  });

  it('tests the tooling and the context budgets after a skill change', () => {
    expect(checksBeforeStop(['.claude/skills/astro/SKILL.md'])).toEqual([
      'format',
      'test',
      'harness',
    ]);
  });

  it('runs each check once for many files', () => {
    const paths = ['src/pages/index.astro', 'src/pages/projects.astro'];
    expect(checksBeforeStop(paths)).toEqual(['format', 'astro', 'build']);
  });
});
