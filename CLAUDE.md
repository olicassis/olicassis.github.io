# olicassis.github.io

Elias's portfolio (olicassis): career, projects, skills and a public log of courses and books. Astro 7, static output, deployed on GitHub Pages at https://olicassis.github.io.

## Rules that are never broken

@docs/principles.md

## How work happens

1. Start from a GitHub issue or the owner's request. Work on a branch, never on `main`. One PR per change.
2. Tooling and scripts are test first (the `tdd` skill). Pages and content are checked by `pnpm check`, `pnpm build` and a design review.
3. Commits and PR titles follow `.gitmessage`: `type(scope): emoji subject`. commitlint rejects anything else. The PR title becomes the squash commit on `main`.
4. You may not push, open PRs, add dependencies or fetch web pages without asking. Dependencies use exact versions only (`pnpm deps:check`).
5. Before you finish, the Stop hook runs the checks for the changed files. UI changes also need the `design-reviewer` subagent; fix every must-fix finding.
6. Before you push a branch, run the `code-reviewer` subagent once on the branch diff and fix every must-fix finding.

## Commands

| Task            | Command                                                             |
| --------------- | ------------------------------------------------------------------- |
| Dev server      | `pnpm dev` (http://localhost:4321)                                  |
| All checks      | `pnpm check && pnpm test && pnpm build && pnpm format:check`        |
| Tokens          | Edit `design/tokens.json`, then `pnpm tokens` (writes `tokens.css`) |
| Context budgets | `pnpm harness:check`                                                |
| Pinned versions | `pnpm deps:check`                                                   |

## Where things are

| Path                     | What                                                                 |
| ------------------------ | -------------------------------------------------------------------- |
| `src/pages/`             | One file per route: about (`index`), career, projects, progress, 404 |
| `src/content/`           | Markdown entries; schemas in `src/content.config.ts`                 |
| `src/components/`        | Design-system components (`Panel`, `Tag`, `Button`, ...)             |
| `src/layouts/Base.astro` | Page shell: head, fonts, header, footer, theme script                |
| `src/styles/`            | `tokens.css` (generated), `components.css`, `global.css`             |
| `src/site.ts`            | Name, role, tagline, links, navigation                               |
| `design/tokens.json`     | Design tokens from the olicassis design system                       |
| `tooling/harness/`       | Hook scripts and repo checks (tested)                                |

## Astro

Astro 7 is newer than your training data. Before you use an Astro API, check the docs with the `astro-docs` MCP server. The `astro` skill has this repo's conventions.

## Loading more context

Rules in `.claude/rules/` load by themselves when you touch matching files. Skills load when a task matches: `astro`, `olicassis-design-system`, `add-content-entry`, `tdd`, `clean-code`. Open a reference file only when the skill points you to it.

## Writing: ASD-STE100 Simplified Technical English

Replies, docs, comments, commits and PRs are in English and follow ASD-STE100:

- One topic per sentence. Procedural sentences have 20 words or fewer, descriptive sentences 25 or fewer.
- Give instructions in the imperative, one action per step. Use the active voice and simple tenses.
- Use one word for one meaning, and the same term each time. No idioms, filler or hedging.
- Start with the result. Give the command, path or number, not the story.

The site's own text follows the voice in the `olicassis-design-system` skill (first person, plain and direct), not STE.
