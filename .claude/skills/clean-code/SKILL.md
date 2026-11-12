---
name: clean-code
description: Use when writing, refactoring or reviewing code in this repo (Astro components, TypeScript, tooling) for naming, function size, error handling, duplication or code smells (G1–G36).
---

# Clean code, olicassis edition

The principles are summarised in `references/principles.md` (from nghorbani/clean-code-skill, CC BY 4.0; see `ATTRIBUTION.md`). This file says how they apply here. **Where they conflict, this file wins.**

## Apply as written

- **Names:** intention-revealing English names; one word per concept (`entry`, not also `item`/`post` for the same thing); no encodings or `I` prefixes.
- **Functions:** small, one thing, one level of abstraction. No flag arguments: split the function.
- **Comments:** explain why, never what. No commented-out code; git remembers.
- **Duplication:** remove it after the second real copy, not before.
- **Boy Scout rule:** leave the files you touched cleaner, inside the same task's scope only.
- **Four rules of simple design**, in order: passes the checks, no duplication, expresses intent, fewest elements.

## Overrides for this repo

1. **Components are the unit.** Markup that repeats becomes an `.astro` component with typed `Props`. A component does one job; a page composes components and reads collections.
2. **Logic leaves the template.** Sorting, filtering and formatting with more than one step go into a `.ts` module with tests, not into the frontmatter of a page.
3. **Styles through tokens.** Class names use the `oc-` prefix and live in `src/styles/components.css` or the component's `<style>`. Values come from `var(--token)`.
4. **TypeScript:** `strict`; no `any`; no non-null `!` without a comment that says why it is safe. Exhaustive `switch` over unions.
5. **Errors:** throw only for bugs. A missing optional field is handled where it is read, not with a `try`.

## When reviewing

Report findings as `file:line`, the smell code when one fits (for example `G5 duplication`), and a concrete fix. Separate must-fix from suggestions.

## Read more only when needed

- A specific principle: `references/principles.md`.
- A smell code or the full rule list: `references/cheatsheet.md`.
- A term: `references/glossary.md`. A technique: `references/patterns.md`.
