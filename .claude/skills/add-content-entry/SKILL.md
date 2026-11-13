---
name: add-content-entry
description: Use when adding or changing a career, project or progress (course, certification, book) entry on the portfolio site.
---

# Add a content entry

1. Pick the collection:

   | Entry                         | Folder                  | Required fields                                                           |
   | ----------------------------- | ----------------------- | ------------------------------------------------------------------------- |
   | Job or study                  | `src/content/career/`   | `kind` (`work` or `study`), `title`, `org`, `start`                       |
   | Project                       | `src/content/projects/` | `title`, `summary`, `year`                                                |
   | Course, certification or book | `src/content/progress/` | `kind` (`course`, `certification` or `book`), `title`, `value` (0 to 100) |

2. Read the schema for that collection in `src/content.config.ts`. It is the source of truth for optional fields.
3. Name the file with the slug: lowercase English words joined by hyphens, for example `cart-and-plate.md`.
4. Write the frontmatter. Dates are text (`"2024"` or `"2024-03"`). Leave out `end` for current work. Use `featured: true` for at most three projects.
5. Write the body: first person, plain and direct, two to four short paragraphs. Keep proper names in Portuguese.
6. Use only facts the owner gave you. For a missing fact, write `TODO: <question>` and set `draft: true`.
7. Remove the placeholder entry it replaces (`project-one.md`, `work-current.md` and so on) in the same PR.
8. Run `pnpm check` and `pnpm build`. Open the page with `pnpm dev` and check the entry.
9. Commit as `feat(content): ✨ add <entry>` or `fix(content): 🐛 correct <entry>`.
