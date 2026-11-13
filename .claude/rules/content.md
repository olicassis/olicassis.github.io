---
paths:
  - 'src/content/**'
  - 'src/content.config.ts'
  - 'src/site.ts'
---

# Content entries

- One Markdown file per entry. The file name is the slug: lowercase English words joined by hyphens.
- The frontmatter follows the collection schema in `src/content.config.ts`. Run `pnpm check` after a change; it validates every entry.
- Set `draft: true` to hide an entry. Do not delete an entry the owner may want back.
- Dates are text: `"2021"` or `"2021-03"`. Leave out `end` for current work.
- Text voice: first person, plain and direct, sentence case. No emoji. Proper names in Portuguese stay in Portuguese.
- Never invent facts about the owner (jobs, dates, grades, links). Ask, or leave a `TODO` and keep `draft: true`.
- A schema change updates `content.config.ts`, every existing entry and the README table in the same PR.
- To add an entry, use the `add-content-entry` skill.
