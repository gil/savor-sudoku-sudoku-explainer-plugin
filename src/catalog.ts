import type { EngineDifficulty } from "savor-sudoku-plugin-api";

// `tiers` is which rungs of the host's shared ladder each level serves, read
// only under mixed generation. The numbers are measured rather than taken from
// this list's own order, and they are lopsided because upstream is:
// LEVEL_BOUNDS gives easy/medium/hard the ER windows 1.0-1.2, 1.3-1.6 and
// 1.7-2.5, three of five names inside a tenth of the scale, while fiendish
// alone spans 2.6-6.0. Over 200 generated puzzles per level, rated by three
// engines, easy and medium both land on the bottom rung and diabolical jumps
// straight to the fifth.
// docs/investigations/2026-09-12-multi-engine-tiers/findings.md has the numbers.
//
// The two wide levels serve two rungs each by generating in a different part of
// themselves; windows.ts holds where. Everything else is one rung, generated
// whole, exactly as a direct request for it always was.
export const CATALOG: readonly EngineDifficulty[] = [
  { id: "easy", label: "Easy", order: 0, tiers: [1] },
  { id: "medium", label: "Medium", order: 1, tiers: [1] },
  { id: "hard", label: "Hard", order: 2, tiers: [2] },
  { id: "fiendish", label: "Fiendish", order: 3, tiers: [3, 4] },
  { id: "diabolical", label: "Diabolical", order: 4, tiers: [5, 6] },
];
