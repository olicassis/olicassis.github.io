import { describe, expect, it } from 'vitest';
import { findUnpinned } from './pinned-versions.ts';

describe('findUnpinned', () => {
  it('accepts exact versions and workspace links', () => {
    const manifest = {
      dependencies: { zod: '4.6.7', '@local/lib': 'workspace:*' },
      devDependencies: { vitest: '5.0.5', 'some-beta': '1.0.0-beta.2' },
    };
    expect(findUnpinned(manifest)).toEqual([]);
  });

  it.each([
    '^4.6.7',
    '~58.0.21',
    '>=1.0.0',
    '*',
    'latest',
    '1.x',
    '1.2',
    '1.2.3 - 1.4.0',
    '1.2.3 || 2.0.0',
  ])('flags %s', (spec) => {
    expect(findUnpinned({ dependencies: { pkg: spec } })).toEqual([
      { field: 'dependencies', name: 'pkg', spec },
    ]);
  });

  it('checks every dependency field', () => {
    const manifest = {
      devDependencies: { a: '^1.0.0' },
      optionalDependencies: { b: '~1.0.0' },
      peerDependencies: { c: '^19.0.0' },
    };
    expect(findUnpinned(manifest).map((u) => u.field)).toEqual([
      'devDependencies',
      'optionalDependencies',
    ]);
  });
});
