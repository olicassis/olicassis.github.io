// Generates src/styles/tokens.css from design/tokens.json (the olicassis design system).
// Run with `pnpm tokens` after changing a token.
import { readFileSync, writeFileSync } from 'node:fs';
import { tokensToCss } from './tokens-css.mjs';

const tokens = JSON.parse(readFileSync(new URL('../design/tokens.json', import.meta.url), 'utf8'));
writeFileSync(new URL('../src/styles/tokens.css', import.meta.url), tokensToCss(tokens));
console.log('tokens.css written');
