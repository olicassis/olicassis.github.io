# olicassis.github.io

Personal portfolio of Elias (olicassis): career, projects, skills, and a public log of courses and books. Built with [Astro](https://astro.build), deployed on GitHub Pages.

## Run locally

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
```

## Edit content

All content is Markdown with a small header block. Add a file to add an entry; set `draft: true` to hide one.

| Section | Folder | Fields |
| --- | --- | --- |
| Projects | `src/content/projects/` | `title`, `summary`, `tags`, `year`, `featured`, `repo`, `url` |
| Career | `src/content/career/` | `kind` (`work` or `study`), `title`, `org`, `start`, `end` (leave out for current), `location` |
| Progress | `src/content/progress/` | `kind` (`course`, `certification` or `book`), `title`, `by`, `value` (0 to 100), `finished`, `url` |

Name, role, tagline and the LinkedIn link live in `src/site.ts`. The About text and skills are in `src/pages/index.astro`.

## Design system

Colours, type, spacing and radii come from the olicassis design system. Its tokens are copied to `design/tokens.json`; after changing them, run `npm run tokens` to regenerate `src/styles/tokens.css`. Component styles are in `src/styles/components.css`.

## Deploy

Every push to `main` builds and publishes the site with GitHub Actions (`.github/workflows/deploy.yml`). In the repository settings, under **Pages**, set **Source** to **GitHub Actions** once.
