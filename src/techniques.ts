import { SolvingTechnique } from "sudoku-explainer";
import type { EngineTechnique } from "savor-sudoku-plugin-api";

// The same archived Sudopedia snapshot the built-in engine links to.
const BASE =
  "https://web.archive.org/web/20260406085520/https://www.sudopedia.org/wiki";

/**
 * SolvingTechnique key -> Sudopedia page. Four entries are deliberate
 * approximations because no exact page exists: TurbotFish bundles Scraper,
 * Kite, and Turbot under one SE technique with no Turbot_Fish page; the three
 * larger wings have no per-size page, so they point at their generalization;
 * and the two Direct* hidden subsets share the page of their non-direct form.
 * test/techniques.test.ts asserts all four, so they read as decisions.
 */
export const PAGES: Readonly<Record<string, string>> = {
  HiddenSingle: "Hidden_Single",
  NakedSingle: "Naked_Single",
  DirectPointing: "Locked_Candidates",
  PointingClaiming: "Locked_Candidates",
  DirectHiddenPair: "Hidden_Pair",
  DirectHiddenTriplet: "Hidden_Triple",
  NakedPair: "Naked_Pair",
  NakedTriplet: "Naked_Triple",
  NakedQuad: "Naked_Quad",
  HiddenPair: "Hidden_Pair",
  HiddenTriplet: "Hidden_Triple",
  HiddenQuad: "Hidden_Quad",
  XWing: "X-Wing",
  Swordfish: "Swordfish",
  Jellyfish: "Jellyfish",
  TurbotFish: "Skyscraper",
  ThreeStrongLinks: "Fish",
  FourStrongLinks: "Fish",
  FiveStrongLinks: "Fish",
  SixStrongLinks: "Fish",
  XYWing: "XY-Wing",
  XYZWing: "XYZ-Wing",
  WXYZWing: "WXYZ-Wing",
  VWXYZWing: "Almost_Locked_Set",
  UVWXYZWing: "Almost_Locked_Set",
  TUVWXYZWing: "Almost_Locked_Set",
  UniqueLoop: "Unique_Rectangle",
  BivalueUniversalGrave: "Bivalue_Universal_Grave",
  AlignedPairExclusion: "Aligned_Pair_Exclusion",
  AlignedTripletExclusion: "Aligned_Triple_Exclusion",
  ForcingChainCycle: "Forcing_Chain",
  MultipleForcingChain: "Forcing_Chain",
  NishioForcingChain: "Nishio",
  DynamicForcingChain: "Forcing_Net",
  DynamicForcingChainPlus: "Forcing_Net",
  NestedForcingChain: "Forcing_Net",
};

const ENTRIES = Object.entries(SolvingTechnique) as [string, string][];

export const TECHNIQUES: readonly EngineTechnique[] = ENTRIES.map(
  ([id, name]) => {
    const page = PAGES[id];
    return {
      id,
      name,
      ...(page === undefined ? {} : { url: `${BASE}/${page}` }),
    };
  },
);

/**
 * `Hint.technique` carries the enum *value*, not the key. String enums compile
 * to a key->value object with no reverse mapping, so the reverse map is built
 * here rather than read off the enum.
 */
export const ID_BY_NAME: ReadonlyMap<string, string> = new Map(
  ENTRIES.map(([id, name]) => [name, id]),
);
