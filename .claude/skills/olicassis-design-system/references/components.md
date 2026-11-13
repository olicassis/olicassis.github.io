# olicassis components

Usage notes per component. The code is in `src/components/`, the styles in `src/styles/components.css` (`oc-` classes).

## Card

A glass card. With `href` the whole card is one link: it lifts on hover and shows the cursor light.

**Provide:** `children`, optional `href`, `external` (opens in a new tab), and `class` (for example `reveal`).

- Put a `.oc-meta` row, a `.oc-title` and `.oc-text` or `.oc-sub` inside. End a linked card with a `.oc-card-cta` line (`read the paper ↗`).
- One link per card. Do not put buttons or other links inside a linked card.

## Button

A pill link. `primary` is the leaf button; `secondary` (the default) is glass.

**Provide:** `href`, `children` (sentence case, a verb first where it fits), `variant`, `external`.

- One `primary` per view. The component adds `→`, or `↗` when `external`.

## Tag

A mono pill chip for skills, stacks and states. `tone="leaf"` marks a live state (`now`, `reading`).

## SectionHeader

Eyebrow (one word), display title and optional lede. It has the `reveal` motion.

**Provide:** `eyebrow`, `title`, optional `lede`, `level` (1 on a page of its own, else 2).

## TimelineEntry

A glass card on a stem, with a berry marker. The current entry (no `end`) gets a leaf berry and a `now` chip.

**Provide:** `kind` (`work` or `study`), `title`, `org`, `start`, optional `end` and `location`, and the description as `children`. Render inside `<ol class="oc-tl">`, newest first.

## Publication

A linked card for one paper. The owner's name (`site.fullName`) is bold in the author list.

**Provide:** `title`, `authors`, `venue`, `year`, optional `url`. Render inside an `<ol>`.

## LearnCard

A course, certification or book. A row with a small tile on phones, a tile card from 720px.

**Provide:** the progress entry (`kind`, `title`, `by`, `value`, `finished`, `url`, optional `image` and `imageAlt`).

- With `image`, the tile shows the certificate, badge or cover (store it in `src/assets/learning/`). Without it, the tile shows the issuer's initials (the title's for a book).
- Finished items show the `finished` date. Unfinished items show a leaf chip (`reading` for books, `in progress` otherwise) and a thin bar when `value` is above 0.

## BerryMark

The olicassis mark. Decorative (`aria-hidden`). Used in the header, the portrait orbit and the contact band.

## Header, ThemeToggle, Footer

- Header: a floating glass bar. On phones the section links are a strip that scrolls sideways; the scroll-spy keeps the active link in view.
- ThemeToggle cycles `auto`, `light`, `dark` and stores the choice.
- Footer: copyright, `back to top ↑` and the outbound links.
