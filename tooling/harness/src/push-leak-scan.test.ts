import { chmodSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { afterEach, describe, expect, it } from 'vitest';
import { gitleaksArgs, planPushScan } from './push-leak-scan.ts';

const LOCAL = 'a'.repeat(40);
const OTHER_LOCAL = 'b'.repeat(40);
const REMOTE = 'c'.repeat(40);
const ZERO = '0'.repeat(40);
const line = (localSha: string, remoteSha: string, ref = 'refs/heads/topic') =>
  `${ref} ${localSha} ${ref} ${remoteSha}`;

describe('planPushScan', () => {
  it('scans the commits that are not yet on the remote when a branch is updated', () => {
    expect(planPushScan(`${line(LOCAL, REMOTE)}\n`, 'origin')).toEqual({
      logOpts: [`${LOCAL} --not --remotes=origin`],
      problems: [],
    });
  });

  it('scans the commits that are not yet on the remote when a branch is new', () => {
    expect(planPushScan(line(LOCAL, ZERO), 'origin').logOpts).toEqual([
      `${LOCAL} --not --remotes=origin`,
    ]);
  });

  it('skips a branch deletion, which sends no commits', () => {
    expect(planPushScan(line(ZERO, REMOTE), 'origin')).toEqual({ logOpts: [], problems: [] });
  });

  it('scans each pushed commit once', () => {
    const stdin = [line(LOCAL, REMOTE), line(LOCAL, ZERO, 'refs/tags/v1'), line(OTHER_LOCAL, ZERO)];
    expect(planPushScan(stdin.join('\n'), 'origin').logOpts).toEqual([
      `${LOCAL} --not --remotes=origin`,
      `${OTHER_LOCAL} --not --remotes=origin`,
    ]);
  });

  it('scans the full history when the remote is a URL with no tracking refs', () => {
    expect(planPushScan(line(LOCAL, ZERO), 'git@github.com:o/r.git').logOpts).toEqual([LOCAL]);
  });

  it('reports a line that is not a push update, so the push does not go unscanned', () => {
    expect(planPushScan('refs/heads/topic not-a-sha', 'origin')).toEqual({
      logOpts: [],
      problems: ['Cannot read the push update on line 1.'],
    });
  });

  it('does nothing for empty input', () => {
    expect(planPushScan('\n', 'origin')).toEqual({ logOpts: [], problems: [] });
  });
});

describe('gitleaksArgs', () => {
  it('redacts every value, fails on a leak and shows what a merge commit changed', () => {
    expect(gitleaksArgs(LOCAL)).toEqual([
      'git',
      `--log-opts=--remerge-diff ${LOCAL}`,
      '--redact',
      '--no-banner',
      '--exit-code=1',
    ]);
  });
});

describe('check-push-leaks', () => {
  const bin = join(import.meta.dirname, '../bin/check-push-leaks.ts');
  const dirs: string[] = [];
  afterEach(() => {
    dirs.splice(0).forEach((dir) => rmSync(dir, { recursive: true, force: true }));
  });

  const pathWithGitleaks = (script: string | null) => {
    const dir = mkdtempSync(join(tmpdir(), 'push-leak-scan-'));
    dirs.push(dir);
    if (script !== null) {
      writeFileSync(join(dir, 'gitleaks'), `#!/bin/sh\n${script}\n`);
      chmodSync(join(dir, 'gitleaks'), 0o755);
    }
    return dir;
  };

  const push = (input: string, path: string) =>
    spawnSync(process.execPath, [bin, 'origin'], {
      input,
      encoding: 'utf8',
      env: { PATH: path },
    });

  it('allows the push when gitleaks finds no leak', () => {
    expect(push(line(LOCAL, REMOTE), pathWithGitleaks('exit 0')).status).toBe(0);
  });

  it('blocks the push when gitleaks finds a leak', () => {
    const result = push(line(LOCAL, REMOTE), pathWithGitleaks('exit 1'));
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Push blocked');
  });

  it('blocks the push when gitleaks is not installed', () => {
    const result = push(line(LOCAL, REMOTE), pathWithGitleaks(null));
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('gitleaks is not installed');
  });

  it('blocks the push when a push update cannot be read', () => {
    const result = push('garbage', pathWithGitleaks('exit 0'));
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Cannot read the push update');
  });

  it('allows a branch deletion when gitleaks is not installed', () => {
    expect(push(line(ZERO, REMOTE), pathWithGitleaks(null)).status).toBe(0);
  });
});
