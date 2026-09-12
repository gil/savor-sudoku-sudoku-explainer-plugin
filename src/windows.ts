/** A window on SudokuExplainer's own ER scale, inclusive. */
export interface ErWindow {
  readonly min: number;
  readonly max: number;
}

/**
 * Where to generate inside a level when the whole level is not what the host's
 * rung wants, keyed `"<difficultyId>:<tier>"`.
 *
 * Three entries, all measured rather than reasoned about; the rest of the ladder
 * is better served by generating the whole level, which is what a missing entry
 * means. See docs/investigations/2026-09-12-multi-engine-tiers/findings.md.
 *
 * `fiendish` spans ER 2.6 to 6.0 — nearly half the scale under one name — so
 * its top slice is a different puzzle from its middle. `diabolical`'s top slice
 * is past what the built-in engine can solve at all, which is what rung 6 means.
 *
 * `diabolical:5` exists for ordering rather than for aim. Unclipped, the level's
 * own bound runs to ER 11.0 and its tail put 6% of a 200-puzzle sample above
 * 7.4 and one draw at 9.0 — rung 5 handing out something harder than rung 6,
 * with nothing on screen to say so. The two halves must stay disjoint.
 */
const WINDOWS: Readonly<Record<string, ErWindow>> = {
  "fiendish:4": { min: 5.0, max: 6.0 },
  "diabolical:5": { min: 6.1, max: 7.4 },
  "diabolical:6": { min: 7.5, max: 8.9 },
};

/** The window for a level and rung, or null to generate the whole level. */
export function windowFor(
  difficultyId: string,
  tier: number | undefined,
): ErWindow | null {
  if (tier === undefined) return null;
  return WINDOWS[`${difficultyId}:${tier}`] ?? null;
}
