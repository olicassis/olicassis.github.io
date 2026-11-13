// Decides which checks a set of changed paths needs. The post-edit and Stop hooks run them.

export type Check = 'format' | 'astro' | 'build' | 'test' | 'harness';

const SITE = /^(?:src\/|public\/|astro\.config\.mjs$|tsconfig\.json$|package\.json$)/;
const TOOLING = /^(?:tooling\/|scripts\/)/;
const HARNESS = /^(?:CLAUDE\.md$|\.claude\/(?:rules|skills)\/)/;
const FORMATTED = /\.(?:astro|ts|mjs|js|json|md|ya?ml|css)$/;
const ASTRO_CHECKED = /\.(?:astro|ts|mjs|md)$/;

export function isFormatted(path: string): boolean {
  return FORMATTED.test(path) && path !== 'src/styles/tokens.css' && path !== 'pnpm-lock.yaml';
}

/** Checks right after one edit: fast, and only for that file. */
export function checksAfterEdit(path: string): Check[] {
  const checks: Check[] = [];
  if (isFormatted(path)) checks.push('format');
  if (SITE.test(path) && ASTRO_CHECKED.test(path)) checks.push('astro');
  if (TOOLING.test(path) && /\.(?:ts|mjs)$/.test(path)) checks.push('test');
  return checks;
}

/** Checks before Claude stops: everything the changed paths can break. */
export function checksBeforeStop(paths: readonly string[]): Check[] {
  const checks = new Set<Check>();
  for (const path of paths) {
    if (isFormatted(path)) checks.add('format');
    if (SITE.test(path) || path.startsWith('design/')) {
      checks.add('astro');
      checks.add('build');
    }
    if (TOOLING.test(path) || path.startsWith('.claude/') || path.startsWith('.github/')) {
      checks.add('test');
    }
    if (HARNESS.test(path)) checks.add('harness');
  }
  return [...checks];
}
