// Dependencies use exact versions so installs never pick up a new release on their own.
// Peer dependencies keep ranges: they state compatibility, they install nothing.

const FIELDS = ['dependencies', 'devDependencies', 'optionalDependencies'] as const;
const EXACT = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

type Manifest = Partial<
  Record<(typeof FIELDS)[number] | 'peerDependencies', Record<string, string>>
>;
export type Unpinned = { field: (typeof FIELDS)[number]; name: string; spec: string };

export function findUnpinned(manifest: Manifest): Unpinned[] {
  return FIELDS.flatMap((field) =>
    Object.entries(manifest[field] ?? {})
      .filter(([, spec]) => !spec.startsWith('workspace:') && !EXACT.test(spec))
      .map(([name, spec]) => ({ field, name, spec })),
  );
}
