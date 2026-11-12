---
paths:
  - 'design/**'
  - 'scripts/build-tokens.mjs'
---

# Design tokens

- `design/tokens.json` is a copy of the olicassis design system tokens. It is the source of truth for colour, type, spacing, radius and shadow.
- Never edit `src/styles/tokens.css` by hand; the guard blocks it. Run `pnpm tokens` to write it again.
- A new or changed colour needs a value for each theme and 4.5:1 contrast for every text pairing.
- Keep token names stable. A rename updates every `var(--name)` use in the same PR.
- A change to `scripts/build-tokens.mjs` is tooling: test first (`tdd` skill).
