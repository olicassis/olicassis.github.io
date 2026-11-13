import { describe, expect, it } from 'vitest';
import { globToRegExp, rulePaths } from './context-budget.ts';

describe('rulePaths', () => {
  it('reads the paths list from rule frontmatter', () => {
    const text = '---\npaths:\n  - "src/content/**"\n  - src/components/**/*.astro\n---\n# Rule';
    expect(rulePaths(text)).toEqual(['src/content/**', 'src/components/**/*.astro']);
  });
});

describe('globToRegExp', () => {
  it.each([
    ['src/content/**', 'src/content/projects/one.md', true],
    ['**/*.test.ts', 'tooling/harness/src/guards.test.ts', true],
    ['**/*.test.ts', 'guards.test.ts', true],
    ['src/components/**/*.astro', 'src/components/Tag.astro', true],
    ['design/**', 'src/design/x.json', false],
  ])('%s matches %s: %s', (glob, path, expected) => {
    expect(globToRegExp(glob).test(path)).toBe(expected);
  });
});
