// Conventional Commits with one fixed emoji per type, right after the colon:
//   feat(pages): ✨ add the projects page
// Reference: https://www.conventionalcommits.org/en/v1.0.0/ and https://gitmoji.dev/
export const TYPE_EMOJI = {
  feat: '✨',
  fix: '🐛',
  perf: '⚡️',
  refactor: '♻️',
  test: '✅',
  docs: '📝',
  style: '🎨',
  build: '📦',
  ci: '👷',
  chore: '🔧',
  revert: '⏪',
};
const BREAKING = '💥';

export const SCOPES = [
  'content',
  'ui',
  'design',
  'pages',
  'seo',
  'deps',
  'ci',
  'harness',
  'release',
];

const startsWith = (subject, emoji) =>
  subject.startsWith(emoji) || subject.startsWith(emoji.replace('️', ''));

export default {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        'subject-emoji-matches-type': ({ type, subject, header }) => {
          const expected = TYPE_EMOJI[type];
          if (!expected || !subject) return [true];
          const isBreaking = /^\w+(\([^)]*\))?!:/.test(header ?? '');
          const ok = startsWith(subject, expected) || (isBreaking && startsWith(subject, BREAKING));
          return [
            ok,
            `start the subject with ${expected} for ${type}${isBreaking ? ` (or ${BREAKING} for a breaking change)` : ''}`,
          ];
        },
      },
    },
  ],
  rules: {
    'type-enum': [2, 'always', Object.keys(TYPE_EMOJI)],
    'scope-enum': [2, 'always', SCOPES],
    'subject-case': [0],
    'header-max-length': [2, 'always', 72],
    'subject-emoji-matches-type': [2, 'always'],
  },
};
