---
name: tdd
description: Use before writing any tooling or script code (tooling/harness, scripts/) for a new behaviour, a bug fix or a behaviour change. Write one failing test, watch it fail for the right reason, write the least code to pass, refactor on green.
---

# Test-driven development

Based on the MIT-licensed TDD skill from obra/superpowers (`references/superpowers-tdd.md`, `LICENSE-superpowers`), condensed for this repo.

## Where it applies

Test first is the law for code with logic: `tooling/harness/` and `scripts/`. Pages, components and content are checked by `pnpm check`, `pnpm build` and the `design-reviewer` subagent instead. When a page gets logic (sorting, filtering, date formatting), move the logic into a `.ts` module and test it first.

## The law

No logic without a failing test you watched fail first. Code written before its test is deleted and rewritten test first. Exceptions (throwaway spikes, generated code, config) need the owner's OK.

## The cycle

1. **Red.** Write one test for one behaviour. Name it as a sentence: `it('blocks a push to main')`. Before you write it, name the production change that would make it fail.
2. **Verify red.** Run it: `pnpm exec vitest run <file>`. It must fail because the behaviour is missing, not because of a typo or an import error. A test that passes at once proves nothing: fix the test.
3. **Green.** Write the simplest code that passes. No extra features.
4. **Verify green.** The new test and every other test pass, with clean output.
5. **Refactor.** Only on green, in small steps, with a test run after each. No new behaviour. Commit refactors separately (`refactor:` type).
6. **Commit** with the right type (`test:` for tests alone, `feat:`/`fix:` for the behaviour), then the next red.

## In this repo

- **Hook guards:** red is a command or path that the guard must block or allow, in `guards.test.ts`.
- **Hook scripts:** run them as Claude Code does, with JSON on stdin (`hook-scripts.test.ts`).
- **Repo config:** a rule that config must follow goes in `repo-policy.test.ts`.
- **Bugs:** first a failing test that reproduces the bug, then the fix.

## Checklist before saying done

- [ ] Every new behaviour has a test that was seen failing first.
- [ ] Each failure was for the expected reason.
- [ ] The code is the least that passes; refactoring happened on green.
- [ ] `pnpm test` passes. The Stop hook runs it on changed tooling.

## Read more only when needed

- Tempted to skip a step, or arguing with yourself about it: `references/superpowers-tdd.md`, sections "Common Rationalizations" and "Red Flags".
- Writing or changing tests (honest assertions, mocks, test-only code): `references/writing-good-tests.md`.
