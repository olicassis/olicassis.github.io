---
name: astro
description: Use when creating or changing Astro pages, layouts, components, content collections, images, routing or astro.config.mjs in this repo. Astro 7 conventions and when to check the docs.
---

# Astro in this repo

The site runs Astro 7 (see `package.json`) with static output. Astro 7 is newer than your training data, so APIs you remember can be gone or renamed.

## Check the docs first

- Before you use an Astro API, an integration or a config option, look it up with the `astro-docs` MCP server (`.mcp.json`).
- If the MCP server is not available, ask the owner before you fetch https://docs.astro.build.
- Never add an integration (`astro add`) or an adapter without the owner's approval. It is a new dependency.

## Conventions

| Topic             | Rule                                                                                                                                                                             |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Output            | Static only (`output: 'static'`, the default). No server routes, no adapter.                                                                                                     |
| Routes            | One file per page in `src/pages/`. URLs end with `/`. Use `Base.astro` for every page.                                                                                           |
| Content           | Collections in `src/content.config.ts` with the `glob` loader and a `zod` schema (`astro/zod`). Read them with `getCollection`, and filter out `draft: true`.                    |
| Components        | `.astro` files with a typed `interface Props`. No UI framework (React, Vue, Svelte).                                                                                             |
| Client JavaScript | None by default. An inline `<script is:inline>` (theme) or a `client:*` island needs a comment that says why.                                                                    |
| Images            | Import from `src/assets/` and render with `<Image>` from `astro:assets`, with `alt`, `width`, `widths` and `sizes`. `public/` is only for files that need a fixed URL (favicon). |
| Styles            | Global CSS in `src/styles/`; scoped `<style>` in a component only for layout of that component. Values from `var(--token)`.                                                      |
| Links             | Internal links are root-relative (`/projects/`). External links show `↗`; `Button` with `external` opens them in a new tab with `rel="noopener"`.                                |
| SEO               | Each page passes a `title` and a `description` to `Base.astro`.                                                                                                                  |

## Before you finish

1. `pnpm check`: types and content schemas, 0 errors and 0 warnings.
2. `pnpm build`: the static build passes.
3. `pnpm dev` and look at the changed pages in both themes at 360 px and desktop widths.
4. Run the `design-reviewer` subagent on UI changes.
