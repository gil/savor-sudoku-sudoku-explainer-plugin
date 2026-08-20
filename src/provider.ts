import {
  checkValidity as explainerCheckValidity,
  generate as explainerGenerate,
  getHint as explainerGetHint,
  rate as explainerRate,
  type DifficultyLevel,
  type Hint,
  type RegionRef,
} from "sudoku-explainer";
import type {
  EngineManifest,
  EngineProvider,
  GenerateResult,
  HintCandidateHighlight,
  HintCellHighlight,
  HintHouseHighlight,
  HintPlacement,
  HintResult,
  RateResult,
} from "savor-sudoku-plugin-api";
import { CATALOG } from "./catalog.js";
import { withPalette } from "./explanation.js";
import { ID_BY_NAME, TECHNIQUES } from "./techniques.js";
import { PLUGIN_VERSION } from "./version.js";

export const ENGINE_ID = "sudoku-explainer";

const MANIFEST: EngineManifest = {
  id: ENGINE_ID,
  name: "SudokuExplainer",
  version: PLUGIN_VERSION,
  license: "LGPL-2.1-or-later",
  capabilities: ["generate", "rate", "hint"],
  difficulties: CATALOG,
  techniques: TECHNIQUES,
};

function toGivens(cells: ArrayLike<number>): string {
  if (cells.length !== 81) {
    throw new Error(`expected 81 cells, got ${cells.length}`);
  }
  let out = "";
  for (let i = 0; i < 81; i++) {
    const v = cells[i]!;
    out += v >= 1 && v <= 9 ? String(v) : ".";
  }
  return out;
}

// RegionRef.index is 0..8 within its type; the host numbers houses 0..8 rows,
// 9..17 columns, 18..26 blocks.
function toHouse(region: RegionRef): number {
  if (region.type === "row") return region.index;
  if (region.type === "column") return 9 + region.index;
  return 18 + region.index;
}

function toHighlights(hint: Hint): HintResult["highlights"] {
  const h = hint.highlights;

  const cells: HintCellHighlight[] = [
    ...(h.greenCells ?? []).map((c) => ({
      cell: c.index,
      color: "green" as const,
    })),
    ...(h.redCells ?? []).map((c) => ({ cell: c.index, color: "red" as const })),
  ];

  const candidates: HintCandidateHighlight[] = [
    ...(h.greenCandidates ?? []).map((c) => ({
      cell: c.index,
      digit: c.value,
      color: "green" as const,
    })),
    ...(h.redCandidates ?? []).map((c) => ({
      cell: c.index,
      digit: c.value,
      color: "red" as const,
    })),
    // The palette has no orange; yellow is the nearest and is what the built-in
    // engine uses for "look here".
    ...(h.orangeCandidates ?? []).map((c) => ({
      cell: c.index,
      digit: c.value,
      color: "yellow" as const,
    })),
  ];

  const houses: HintHouseHighlight[] = (h.regions ?? []).map((r) => ({
    house: toHouse(r),
    color: "yellow" as const,
  }));

  // highlights.links (arrows between candidates) has no wire representation and
  // the built-in engine does not draw them either.
  return {
    ...(cells.length === 0 ? {} : { cells }),
    ...(candidates.length === 0 ? {} : { candidates }),
    ...(houses.length === 0 ? {} : { houses }),
  };
}

function toEliminations(hint: Hint): HintPlacement[] {
  const out: HintPlacement[] = [];
  for (const removal of hint.removals) {
    for (const value of removal.values) {
      out.push({ cell: removal.cell.index, digit: value });
    }
  }
  return out;
}

export const explainerProvider: EngineProvider = {
  manifest: () => MANIFEST,

  generate: ({ difficultyId, seed }): GenerateResult => {
    if (!CATALOG.some((d) => d.id === difficultyId)) {
      throw new Error(`unknown difficulty "${difficultyId}"`);
    }
    // shouldCancel / onProgress stay inside the worker. The solution the engine
    // also returns is discarded: the host derives it with its own solver.
    const result = explainerGenerate({
      difficulty: difficultyId as DifficultyLevel,
      seed,
    });
    if (!result) {
      throw new Error(
        `sudoku-explainer failed to generate a "${difficultyId}" puzzle`,
      );
    }
    return { givens: toGivens(result.puzzle) };
  },

  rate: ({ givens }): RateResult => {
    // rate() does not throw on a grid with no or many solutions: it returns
    // er 0 with erTechnique "No solution". checkValidity is the honest gate,
    // and the er 0 check catches anything it misses. Both are declines, not
    // failures. InvalidGridError / BeyondSolverError are declines too.
    try {
      if (explainerCheckValidity(givens) !== null) {
        return { ok: false, label: "" };
      }
      const rating = explainerRate(givens);
      if (rating.er === 0) return { ok: false, label: "" };
      return {
        ok: true,
        label: `ER: ${rating.er.toFixed(1)}`,
        detail: `EP ${rating.ep.toFixed(1)} / ED ${rating.ed.toFixed(1)}`,
      };
    } catch {
      return { ok: false, label: "" };
    }
  },

  // The masks are copied because the engine's CandidateInput is a mutable
  // number[] and the request's array belongs to the host.
  hint: ({ grid, candidates }): HintResult | null => {
    const step = explainerGetHint(
      grid,
      candidates === undefined ? undefined : { candidates: [...candidates] },
    );
    if (!step) return null;
    const techniqueId = ID_BY_NAME.get(step.technique as unknown as string);
    if (!techniqueId) return null;
    const placements: HintPlacement[] =
      step.cell !== undefined && step.value !== undefined
        ? [{ cell: step.cell.index, digit: step.value }]
        : [];
    return {
      techniqueId,
      text: step.toString(),
      explanation: withPalette(step.explain()),
      placements,
      eliminations: toEliminations(step),
      highlights: toHighlights(step),
    };
  },
};
