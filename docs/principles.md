# olicassis.github.io principles

Every change follows these rules. Changing one is a PR of its own, with the owner's approval.

## I. The design system is the UI

Pages use only the olicassis design tokens (`design/tokens.json`, generated into `src/styles/tokens.css`) and the components in `src/components/`. No raw colours, font sizes, radii, shadows or durations outside `src/styles/`. A missing value becomes a token first.

## II. Content is data

Entries are Markdown files in `src/content/<collection>/`, checked by the schemas in `src/content.config.ts`. Pages read collections; they do not hold entry text. Site details live in `src/site.ts`.

## III. Static and private

The site is static HTML on GitHub Pages. No backend, no cookies, no analytics or tracking, no third-party scripts. Client JavaScript only where the page cannot work without it, such as the theme toggle.

## IV. Accessible in both themes

Every page works in light and dark, at phone width (360 px) and on desktop. Text contrast is 4.5:1 or more (WCAG 2.2 AA). Every control works with a keyboard and has a visible focus ring. Images have alt text. Motion stops under `prefers-reduced-motion`.

## V. English, one voice

Code, file names, docs and commits are in English. Site text is English, first person, plain and direct. Proper names in Portuguese stay in Portuguese.

## VI. Fixed stack

Astro 7, TypeScript (strict), plain CSS with custom properties, pnpm, Vitest for tooling, GitHub Actions and GitHub Pages. A new dependency, framework or service needs the owner's approval and an exact version (`pnpm deps:check`).
