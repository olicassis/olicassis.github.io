// Turns design/tokens.json into the CSS custom properties in src/styles/tokens.css.
const HEADER =
  '/* olicassis — generated from design/tokens.json by scripts/build-tokens.mjs. Do not edit by hand. */\n';

export function tokensToCss(t) {
  const [first, ...rest] = t.color.themes.map((th) => th.id);
  const themed = [...t.color.tokens, ...(t.shadow?.tokens ?? [])];
  const val = (tok, theme) =>
    typeof tok.value === 'string' ? tok.value : (tok.value[theme] ?? tok.value[first]);
  const block = (theme) => themed.map((tok) => `  --${tok.name}: ${val(tok, theme)};`).join('\n');
  const statics = ['spacing', 'radius', 'motion', 'blur']
    .flatMap((group) => t[group]?.tokens ?? [])
    .map((tok) => `  --${tok.name}: ${tok.value};`);
  const families = Object.entries(t.type.families).map(([k, v]) => `  --font-${k}: ${v};`);

  let css = HEADER;
  css += `:root {\n${block(first)}\n${statics.join('\n')}\n${families.join('\n')}\n  color-scheme: ${first};\n}\n`;
  for (const id of rest) {
    css += `@media (prefers-color-scheme: ${id}) {\n  :root:not([data-theme="${first}"]) {\n${block(id).replace(/^/gm, '  ')}\n    color-scheme: ${id};\n  }\n}\n`;
    css += `:root[data-theme="${id}"] {\n${block(id)}\n  color-scheme: ${id};\n}\n`;
  }
  return css;
}
