#!/usr/bin/env node
// The pre-push hook. Scans the commits a push sends with gitleaks and blocks the push on a leak,
// on a scan error or when gitleaks is not installed. Gitleaks output is redacted, so no value prints.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { gitleaksArgs, planPushScan } from '../src/push-leak-scan.ts';

const { logOpts, problems } = planPushScan(readFileSync(0, 'utf8'), process.argv[2] ?? '');

if (problems.length > 0) {
  console.error(`Push blocked. ${problems.join(' ')}`);
  process.exit(1);
}

for (const opts of logOpts) {
  const scan = spawnSync('gitleaks', gitleaksArgs(opts), { stdio: 'inherit' });
  if (scan.error !== undefined) {
    console.error(
      'Push blocked: gitleaks is not installed. Install gitleaks 8.24.3 (see README.md).',
    );
    process.exit(1);
  }
  if (scan.status !== 0) {
    console.error('Push blocked: gitleaks found a leak or could not finish the scan.');
    process.exit(1);
  }
}
