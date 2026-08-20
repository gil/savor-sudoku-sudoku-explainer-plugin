// `hint.explain()` returns Markdown carrying the Java engine's own color cues
// as `<span color="...">`, which is not something a browser paints: `color` is
// a bare attribute, not a style. Rather than rewrite every span, the plugin
// prefixes one stylesheet that gives those attributes meaning.
//
// It is a constant, sent with every explanation whether or not that one uses
// colors, so there is a single place to maintain the palette and no per-hint
// scanning to decide which rules are needed.
//
// The selectors are attribute-matched on `span[color]`, which is markup no host
// surface emits on its own, so the block stays inert outside its own prose.
// Values are picked to read on the app's dark pane rather than to match the
// Java GUI's board colors literally.
const PALETTE: Readonly<Record<string, string>> = {
  cyan: "#67e8f9",
  green: "#4ade80",
  darkgreen: "#2dd4bf",
  blue: "#93c5fd",
  orange: "#fdba74",
  red: "#fca5a5",
};

const STYLE = `<style>${Object.entries(PALETTE)
  .map(([name, value]) => `span[color="${name}"]{color:${value};font-weight:600}`)
  .join("")}</style>`;

export function withPalette(markdown: string): string {
  return `${STYLE}\n\n${markdown}`;
}
