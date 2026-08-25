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

/**
 * Hint penalty tier per technique, charged as tier*10 seconds (5 for tier 0).
 *
 * The scale is the built-in engine's, so a technique costs the same whichever
 * engine found it: X-Wing 2, Swordfish 3, Jellyfish 4, XY- and XYZ-Wing 3,
 * WXYZ-Wing 5, BUG 2, all matching their built-in counterparts. SE's own enum
 * order already runs easiest to hardest, so the tiers climb with it; the
 * forcing chains and nets at the end are the expensive ones.
 */
export const TIERS: Readonly<Record<string, number>> = {
  HiddenSingle: 1,
  DirectPointing: 1,
  DirectHiddenPair: 2,
  NakedSingle: 1,
  DirectHiddenTriplet: 3,
  PointingClaiming: 1,
  NakedPair: 1,
  XWing: 2,
  HiddenPair: 2,
  NakedTriplet: 2,
  Swordfish: 3,
  HiddenTriplet: 3,
  TurbotFish: 2,
  XYWing: 3,
  XYZWing: 3,
  WXYZWing: 5,
  UniqueLoop: 3,
  NakedQuad: 3,
  Jellyfish: 4,
  HiddenQuad: 4,
  ThreeStrongLinks: 3,
  VWXYZWing: 5,
  BivalueUniversalGrave: 2,
  FourStrongLinks: 4,
  AlignedPairExclusion: 4,
  FiveStrongLinks: 5,
  SixStrongLinks: 5,
  UVWXYZWing: 5,
  ForcingChainCycle: 5,
  TUVWXYZWing: 6,
  AlignedTripletExclusion: 5,
  NishioForcingChain: 5,
  MultipleForcingChain: 6,
  DynamicForcingChain: 6,
  DynamicForcingChainPlus: 6,
  NestedForcingChain: 6,
};

const ENTRIES = Object.entries(SolvingTechnique) as [string, string][];

export const TECHNIQUES: readonly EngineTechnique[] = ENTRIES.map(
  ([id, name]) => {
    const page = PAGES[id];
    const penalty = TIERS[id];
    return {
      id,
      name,
      ...(page === undefined ? {} : { url: `${BASE}/${page}` }),
      ...(penalty === undefined ? {} : { penalty }),
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
