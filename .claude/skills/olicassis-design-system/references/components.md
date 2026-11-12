# olicassis components

Usage notes per component, copied from the olicassis design system. The code is in `src/components/`.

## Button

A square, outlined call to action with a hard manga-panel shadow; pass `href` to render a link.

**Provide:** `children` (short lowercase text, a verb first), `variant` (`primary` | `secondary` | `ghost`), and `href` for navigation or `onClick` for an action.

- Use one `primary` per view, for the main next step (for example "see projects").
- Use `secondary` for outbound links such as LinkedIn; add `↗` when the link leaves the site.
- Use `ghost` for inline "read more" links.
- Don't round the corners or soften the shadow. Hover lifts by 2px, press flattens it.

## Panel

The manga panel: a square container with a 2px ink outline and a hard offset shadow, used for project cards and featured blocks.

**Provide:** `children` (title, text, tags), optional `href` to make the whole panel a link, and optional `label` for a corner tab such as "featured".

- Lay panels out in a grid with `space-6` gaps so their shadows never touch.
- One `label` per grid at most.
- Don't nest panels inside panels.

## Tag

A small mono label for skills, technologies and categories.

**Provide:** `children` (one or two words, lowercase) and optionally `tone` (`leaf` for featured, `straw` for academic).

- Default tone for skills and stacks; group several in a wrapping row with `space-2` gaps.
- Keep tags lowercase, except proper names that need capitals.
- Don't use tags as buttons.

## SectionHeader

The heading block that opens every section: a mono `// eyebrow`, a display title and an optional lede.

**Provide:** `eyebrow` (one lowercase word, the section's id such as `about`, `career`, `projects`, `progress`, `contact`), `title`, and optional `lede`.

- The eyebrow is written as a code comment; the component adds the `// `.
- Keep titles to one line on desktop.

## TimelineEntry

One step on the career timeline, professional or academic, on a single ink line.

**Provide:** `kind` (`work` or `study`), `dates` (for example `2021 — 2024` or `2024 — now`), `title`, `org`, optional `current`, and optional `children` for the description. Render entries inside an `<ol>`, newest first.

- Work entries get a square leaf marker; study entries a round straw marker, so the two read apart by shape as well as colour.
- `current` adds a peach halo to the marker. Use it on one entry per kind at most.
- Keep Portuguese names of universities and companies as they are.

## ProgressItem

One course, certification or book with its progress, shown as a bar and a percentage.

**Provide:** `kind` (`course` | `certification` | `book`), `title`, optional `by` (platform, school or author), and `value` from 0 to 100. Render items inside a `<ul>`.

- Status reads from the value: 0 is "queued", 100 is "done", anything else "in progress". The word is always shown, so the bar is never the only signal.
- Books use straw, courses and certifications use leaf.
- Keep book titles in their original language.
