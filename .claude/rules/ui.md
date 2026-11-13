---
paths:
  - 'src/components/**'
  - 'src/layouts/**'
  - 'src/pages/**'
  - 'src/styles/**'
---

# Pages, components and styles

- Use the `olicassis-design-system` skill. Use only `var(--token)` values from `src/styles/tokens.css`.
- Reuse a component from `src/components/` before you write new markup. A new component gets one `.astro` file and `oc-` classes in `src/styles/components.css`.
- Check both themes: light, dark and the `data-theme` override from the theme toggle.
- Check 360 px and desktop widths. No horizontal scroll.
- Every control works with a keyboard, has an accessible name and shows the `focus` ring.
- Use `astro:assets` (`<Image>`) for images, with alt text, `width` and `sizes`.
- No client JavaScript by default. An inline script or a `client:*` island needs a comment that says why.
- Before you finish: run the `design-reviewer` subagent on the changed pages and fix every must-fix finding.
