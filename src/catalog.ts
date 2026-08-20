import type { EngineDifficulty } from "savor-sudoku-plugin-api";

export const CATALOG: readonly EngineDifficulty[] = [
  { id: "easy", label: "Easy", order: 0 },
  { id: "medium", label: "Medium", order: 1 },
  { id: "hard", label: "Hard", order: 2 },
  { id: "fiendish", label: "Fiendish", order: 3 },
  { id: "diabolical", label: "Diabolical", order: 4 },
];
