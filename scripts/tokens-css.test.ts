import { describe, expect, it } from 'vitest';
import { tokensToCss } from './tokens-css.mjs';

const tokens = {
  color: {
    themes: [{ id: 'light' }, { id: 'dark' }],
    tokens: [{ name: 'bg', value: { light: '#fff', dark: '#000' } }],
  },
  shadow: { tokens: [{ name: 'shadow-card', value: { light: 'a', dark: 'b' } }] },
  spacing: { tokens: [{ name: 'space-1', value: '4px' }] },
  radius: { tokens: [{ name: 'radius-card', value: '22px' }] },
  motion: { tokens: [{ name: 'dur-fast', value: '160ms' }] },
  blur: { tokens: [{ name: 'blur-glass', value: '18px' }] },
  type: { families: { sans: 'Inter, sans-serif' } },
};

describe('tokensToCss', () => {
  it('writes the first theme on :root', () => {
    expect(tokensToCss(tokens)).toMatch(/:root \{\n {2}--bg: #fff;/);
  });

  it('writes the second theme under the media query and the data-theme override', () => {
    const css = tokensToCss(tokens);
    expect(css).toContain(':root:not([data-theme="light"]) {\n    --bg: #000;');
    expect(css).toContain(':root[data-theme="dark"] {\n  --bg: #000;');
  });

  it('writes motion and blur tokens once, on :root', () => {
    const css = tokensToCss(tokens);
    expect(css.match(/--dur-fast: 160ms;/g)).toHaveLength(1);
    expect(css.match(/--blur-glass: 18px;/g)).toHaveLength(1);
  });

  it('writes the font families', () => {
    expect(tokensToCss(tokens)).toContain('--font-sans: Inter, sans-serif;');
  });
});
