---
paths:
  - '**/*.test.ts'
  - 'tooling/**'
  - 'scripts/**'
---

# Tests and tooling

- Follow the `tdd` skill: one failing test first, watched failing for the right reason.
- One behaviour per test; the name says the behaviour as a sentence.
- Tests use Vitest (`pnpm test`). Keep decision logic in pure functions in `src/`; `bin/` scripts only read input and call them.
- Hook scripts run with Node's type stripping: import with `.ts` extensions, no enums, no parameter properties.
- Prefer real code and temporary directories over mocks. Never assert on a mock's behaviour.
