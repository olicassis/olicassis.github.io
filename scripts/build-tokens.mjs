// Generates src/styles/tokens.css from design/tokens.json (the olicassis design system).
// Run with `npm run tokens` after changing a token.
import { readFileSync, writeFileSync } from "node:fs";

const t = JSON.parse(readFileSync(new URL("../design/tokens.json", import.meta.url), "utf8"));
const [first, ...rest] = t.color.themes.map((th) => th.id);
const themed = [...t.color.tokens, ...(t.shadow?.tokens ?? [])];
const val = (tok, theme) => (typeof tok.value === "string" ? tok.value : tok.value[theme] ?? tok.value[first]);
const block = (theme) => themed.map((tok) => `  --${tok.name}: ${val(tok, theme)};`).join("\n");

const statics = [...t.spacing.tokens, ...t.radius.tokens].map((tok) => `  --${tok.name}: ${tok.value};`);
const families = Object.entries(t.type.families).map(([k, v]) => `  --font-${k}: ${v};`);

let css = `/* olicassis — generated from design/tokens.json by scripts/build-tokens.mjs. Do not edit by hand. */\n`;
css += `:root {\n${block(first)}\n${statics.join("\n")}\n${families.join("\n")}\n  color-scheme: light;\n}\n`;
for (const id of rest) {
  css += `@media (prefers-color-scheme: ${id}) {\n  :root:not([data-theme="${first}"]) {\n${block(id).replace(/^/gm, "  ")}\n    color-scheme: ${id};\n  }\n}\n`;
  css += `:root[data-theme="${id}"] {\n${block(id)}\n  color-scheme: ${id};\n}\n`;
}
writeFileSync(new URL("../src/styles/tokens.css", import.meta.url), css);
console.log("tokens.css written");
