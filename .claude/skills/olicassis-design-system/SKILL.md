---
name: olicassis-design-system
description: Apply the olicassis design system (manga panels, ink outlines, hard shadows, leaf and straw accents, mono metadata) when building or reviewing any page, component, style or site text.
---

# olicassis design system

The visual identity of Elias's portfolio and GitHub profile. It mixes a manga page (heavy ink outlines, square panels, hard shadows, screentone dots) with a developer's tools (monospace labels, `// comment` eyebrows). Every colour comes from the manga self-portrait (`src/assets/me_manga.jpg`).

Tokens: `design/tokens.json` → `pnpm tokens` → `src/styles/tokens.css`. Component usage: `references/components.md`.

## Content voice

- English, first person, plain and direct: "I build…", "I'm learning…". Use "you" only in calls to action.
- Keep proper names in Portuguese: universities, companies and Portuguese book titles.
- Sentence case for titles. Buttons, tags and eyebrows are lowercase (`see projects`, `typescript`, `// career`).
- Dates use an en dash with spaces, and "now" for ongoing work: `2021 — 2024`, `2024 — now`.
- No emoji. Use `↗` on links that leave the site.

## Colour

| Token                                         | Use                                                                                                       |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `surface`                                     | The page                                                                                                  |
| `surface-raised`                              | Under panels                                                                                              |
| `husk`                                        | Section bands and progress tracks                                                                         |
| `ink`, `ink-muted`                            | Text, secondary text                                                                                      |
| `link`                                        | Links                                                                                                     |
| `leaf`                                        | The loudest colour: primary button, progress fills, one highlight per view. Always with `on-accent` text. |
| `straw`, `straw-deep`                         | Academic entries and books; `straw-deep` when text carries the meaning                                    |
| `olive`                                       | Decorative only: large blocks, the portrait disc. Text on it is `surface`.                                |
| `peach`                                       | Tiny warm accents, such as the current-role halo                                                          |
| `border`, `hairline`, `panel-shadow`, `focus` | Outlines, rules, shadows, focus ring                                                                      |

## Type

- `display-xl`, `display-l`, `display-m` (Dela Gothic One): the hero name and section titles only, never running text.
- `body` (IBM Plex Sans) for copy; `body-s` for dense component text.
- IBM Plex Mono for all metadata: `eyebrow`, `label`, `code`.
- All three families load from Google Fonts in `Base.astro`.

## Shape, depth and pattern

- Panels and buttons are square (`radius-0`) with a 2px `border` outline and `shadow-panel` (hard offset, no blur).
- Hover lifts by 2px to `shadow-pop`; press flattens it. 120ms. Off under `prefers-reduced-motion`.
- `radius-s` only for tags and tracks; `radius-full` only for status dots and the portrait.
- Never blurred shadows or gradients.
- Screentone (ink dots at a `space-4` pitch): one patterned area per page, behind the hero or a section band.

## Spacing and layout

- Page gutter `space-4` on phones, `space-8` on desktop.
- Sections are `space-16` apart (`space-12` on phones).
- Panel grids use `space-6` gaps so shadows stay clear.
- Running text stays under 65 characters wide.

## Focus and accessibility

- Focus ring: 2px solid `focus` outline, 4px offset.
- Every text pairing in the tokens meets 4.5:1 in both themes. Do not pair tokens in a new way without checking contrast.
- Status is always a word as well as a colour or shape.

## Icons and logo

- No icon set. Use Plex Mono glyphs (`↗`, `→`, `//`, `#`). If icons become necessary, use one outline set at a 2px stroke, with the owner's approval.
- No logo. Set `olicassis` in `display-m` or larger, in `ink`, lowercase. The manga portrait is the avatar.

## Do not

- Round panel or button corners, or soften a shadow.
- Use `leaf` for more than one highlight per view.
- Nest panels, or put more than one `label` in a panel grid.
- Use a raw colour, size or radius instead of a token.
