---
name: olicassis-design-system
description: Apply the olicassis cassis design system (blackcurrant and bloom grounds, frosted glass cards, juice and leaf accents, gentle motion) when building or reviewing any page, component, style or site text.
---

# olicassis design system: cassis

The identity of Elias's portfolio and GitHub profile. The manga portrait (`src/assets/me_manga.jpg`) was drawn with the cassis fruit (blackcurrant) in mind: berries in the hair and on the necklace, a leaf tunic, a straw hat. The system takes its colours from the fruit and the portrait, and puts frosted glass over slow, soft light.

Tokens: `design/tokens.json` → `pnpm tokens` → `src/styles/tokens.css`. Component usage: `references/components.md`.

## Content voice

- English, first person, plain and direct: "I build…", "I'm learning…". Use "you" only in calls to action.
- Keep proper names in Portuguese: universities, companies and Portuguese titles.
- Sentence case for titles and buttons (`See projects`). Tags, card links and footer links are lowercase (`typescript`, `read the paper ↗`). Eyebrows are one word; CSS sets them in uppercase.
- Dates use an en dash with spaces, and "now" for ongoing work: `2021 — 2024`, `2024 — now`.
- No emoji. Use `↗` on links that leave the site and `→` on links inside it.

## Colour

| Token                                               | Use                                                                                        |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `bg`, `bg-deep`                                     | The page. Light "bloom" (the dusty film on a ripe berry), dark "night" (blackcurrant skin) |
| `ink`, `ink-muted`                                  | Text, secondary text                                                                       |
| `juice`                                             | Eyebrows, kind labels, card links, inline links                                            |
| `leaf` + `on-leaf`                                  | Primary button, active nav link, the `now` chip. Always with `on-leaf` text                |
| `leaf-text`                                         | Leaf green as text                                                                         |
| `berry`, `juice-soft`, `straw`, `stem`              | Decorative: gradient text, berries, rings, media tiles. Never body text                    |
| `glass`, `glass-strong`, `glass-edge`, `hairline`   | Frosted surfaces, their 1px edge, chip borders and hover fills                             |
| `ambient-a/b/c`, `glow`                             | The three ambient lights and the cursor light                                              |
| `band-*`, `on-band`, `on-band-muted`, `band-accent` | The contact band only (same values in both themes)                                         |
| `focus`                                             | Focus ring                                                                                 |

## Type

- Bricolage Grotesque (`--font-display`): the hero name, section titles, project titles and big numbers. Tight tracking (−0.02 to −0.045em).
- Instrument Sans (`--font-sans`): body, card titles, buttons and nav.
- JetBrains Mono (`--font-mono`): metadata only: eyebrows, dates, kind labels, chips, card links, footer.
- All three load from Google Fonts in `Base.astro`. Sizes are in the type groups of `design/tokens.json`.

## Surfaces and depth

- Cards, the header bar, the status chip and secondary buttons are glass: `glass` fill, 1px `glass-edge`, `blur-glass`, `shadow-card`. Use the `oc-glass` class.
- Cards use `radius-card`; media tiles `radius-s`; the band `radius-band`; buttons, chips and nav links `radius-full`.
- Do not nest glass in glass. Chips inside a card are the only exception.
- Gradients are for decoration only: the hero name, the portrait ring, media tiles, the timeline stem, the contact band and the ambient lights. Never behind body text without a glass layer.

## Motion

- Durations and easing come from `dur-fast`, `dur`, `dur-slow` and `ease`.
- Load: hero items rise in order (`.rise`). Scroll: sections and cards fade up (`.reveal`), only where the browser supports `animation-timeline: view()`; everywhere else they are simply visible.
- Hover: linked cards lift 3px and show the cursor light; buttons lift 2px.
- Ambient lights drift for 28–40 s; the portrait ring turns. Nothing flashes or moves fast.
- `prefers-reduced-motion: reduce` turns every animation and transition off.

## Spacing and layout

- Mobile first: write the phone layout, then add columns with `min-width` queries (720px, 900px, 1000px).
- Page gutter `space-4` on phones, `space-8` from 720px. Sections are `space-14` apart on phones, `space-22` on desktop.
- Card grids use `space-3`–`space-5` gaps. Running text stays under 65 characters wide.

## Focus and accessibility

- Focus ring: 2px solid `focus`, 3px offset, rounded to the control's shape.
- Every text pairing in the tokens meets 4.5:1 in both themes. Check contrast before you pair tokens in a new way.
- Status is always a word as well as a colour (`now`, `reading`, `in progress`).

## Icons and logo

- The mark is `BerryMark`: three berries on a stem, as on the portrait's necklace. Set it before `olicassis` in `display` type.
- No icon set. Use text glyphs (`↗`, `→`, `◐`).

## Do not

- Use a raw colour, size, radius, blur, duration or shadow outside `src/styles/`.
- Use `leaf` as a text colour on light grounds (use `leaf-text`) or for more than one primary button per page.
- Put body text straight on a gradient or on the ambient lights.
- Animate without a `prefers-reduced-motion` guard.
