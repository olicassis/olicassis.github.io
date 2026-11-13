// Works out which commits a push sends, from the lines git gives the pre-push hook on stdin.
// Each line is: <local ref> <local sha> <remote ref> <remote sha>.

const PUSH_UPDATE = /^\S+ ([0-9a-f]{40,64}) \S+ [0-9a-f]{40,64}$/;
const DELETION = /^0+$/;
const REMOTE_NAME = /^[\w.-]+$/;

export type PushScanPlan = { logOpts: string[]; problems: string[] };

export function planPushScan(stdin: string, remote: string): PushScanPlan {
  const shas = new Set<string>();
  const problems: string[] = [];
  stdin.split('\n').forEach((line, index) => {
    if (line.trim() === '') return;
    const sha = PUSH_UPDATE.exec(line.trim())?.[1];
    if (sha === undefined) problems.push(`Cannot read the push update on line ${index + 1}.`);
    else if (!DELETION.test(sha)) shas.add(sha);
  });
  // A URL remote has no tracking refs to compare with, so the full history gets the scan.
  const notOnRemote = REMOTE_NAME.test(remote) ? ` --not --remotes=${remote}` : '';
  return { logOpts: [...shas].map((sha) => `${sha}${notOnRemote}`), problems };
}

export function gitleaksArgs(logOpts: string): string[] {
  // By default git log shows no diff for a merge commit, so a secret in a conflict resolution
  // goes unseen. --remerge-diff shows only what the merge added to the automatic merge result.
  return [
    'git',
    `--log-opts=--remerge-diff ${logOpts}`,
    '--redact',
    '--no-banner',
    '--exit-code=1',
  ];
}
