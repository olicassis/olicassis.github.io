# olicassis.github.io

Personal portfolio of Elias (olicassis): career, projects, skills, and a public log of courses and books. Built with [Astro](https://astro.build), deployed on GitHub Pages.

## Run locally

Requirements: Node 22 (`.nvmrc`), pnpm (`corepack enable`), Git, and [gitleaks](https://github.com/gitleaks/gitleaks) 8.24.3 for the pre-push hook.

```sh
pnpm install
pnpm dev         # http://localhost:4321
pnpm check       # types and content schemas
pnpm test        # tooling tests
pnpm build       # static site in dist/
```

## Edit content

All content is Markdown with a small header block. Add a file to add an entry; set `draft: true` to hide one.

| Section      | Folder                      | Fields                                                                                             |
| ------------ | --------------------------- | -------------------------------------------------------------------------------------------------- |
| Projects     | `src/content/projects/`     | `title`, `summary`, `tags`, `year`, `featured`, `repo`, `url`                                      |
| Career       | `src/content/career/`       | `kind` (`work` or `study`), `title`, `org`, `start`, `end` (leave out for current), `location`     |
| Progress     | `src/content/progress/`     | `kind` (`course`, `certification` or `book`), `title`, `by`, `value` (0 to 100), `finished`, `url` |
| Publications | `src/content/publications/` | `title`, `authors`, `venue`, `year`, `url`                                                         |

Name, role, tagline and the LinkedIn link live in `src/site.ts`. The About text and skills are in `src/pages/index.astro`.

## Design system

Colours, type, spacing and radii come from the olicassis design system. Its tokens are copied to `design/tokens.json`; after changing them, run `pnpm tokens` to regenerate `src/styles/tokens.css`. Component styles are in `src/styles/components.css`.

## Deploy

When CI passes on `main`, `.github/workflows/deploy.yml` builds the site and publishes it to GitHub Pages. In the repository settings, under **Pages**, set **Source** to **GitHub Actions** once.

## How we work

- Branches and pull requests only; `main` has a ruleset. PRs are squash-merged, so the PR title becomes the commit.
- PR titles and commits follow `type(scope): emoji subject` (see `.gitmessage`), checked by commitlint.
- Versions follow SemVer through release-please, with the changelog in `CHANGELOG.md`.
- Dependencies use exact versions (`pnpm deps:check`); Dependabot proposes updates weekly.
- Claude Code works in this repo with the rules in `CLAUDE.md`, `docs/principles.md` and `.claude/`.
