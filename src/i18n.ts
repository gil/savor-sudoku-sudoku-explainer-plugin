// What this plugin says in a language other than English.
//
// Only the menu text: the difficulty names the host lists, and the technique
// names its manifest declares. The sentences a hint carries come out of
// SudokuExplainer itself and stay English, which the app's manual says.
//
// Deliberately self-contained. This package is mirrored to its own public repo
// under LGPL, so it must not reach into the app's own catalog.

export type Locale = "en" | "pt-BR";

const LOCALES: readonly string[] = ["en", "pt-BR"];

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && LOCALES.includes(value);
}

/**
 * Overrides by locale, keyed by the id in the manifest. A missing entry keeps
 * the English name, which is what every locale but the ones here gets.
 *
 * Coined pattern names stay as they are: X-Wing, Swordfish, Jellyfish and the
 * wings are what Portuguese-speaking solvers call them too. Only the
 * descriptive names are translated.
 */
const TECHNIQUE_NAMES: Readonly<Record<Locale, Readonly<Record<string, string>>>> =
  {
    en: {},
    "pt-BR": {
      HiddenSingle: "Único Oculto",
      DirectPointing: "Apontamento Direto",
      DirectHiddenPair: "Par Oculto Direto",
      NakedSingle: "Único Nu",
      DirectHiddenTriplet: "Trinca Oculta Direta",
      PointingClaiming: "Apontamento e Reivindicação",
      NakedPair: "Par Nu",
      HiddenPair: "Par Oculto",
      NakedTriplet: "Trinca Nua",
      HiddenTriplet: "Trinca Oculta",
      TurbotFish: "Scraper, Kite, Turbot",
      UniqueLoop: "Retângulo Único / Laço",
      NakedQuad: "Quadra Nua",
      HiddenQuad: "Quadra Oculta",
      ThreeStrongLinks: "Peixes de 3 Elos Fortes",
      FourStrongLinks: "Peixes de 4 Elos Fortes",
      FiveStrongLinks: "Peixes de 5 Elos Fortes",
      SixStrongLinks: "Peixes de 6 Elos Fortes",
      BivalueUniversalGrave: "Bivalue Universal Grave",
      AlignedPairExclusion: "Exclusão de Par Alinhado",
      AlignedTripletExclusion: "Exclusão de Trinca Alinhada",
      ForcingChainCycle: "Cadeias e Ciclos Forçados",
      NishioForcingChain: "Cadeias Forçadas de Nishio",
      MultipleForcingChain: "Cadeias Forçadas Múltiplas",
      DynamicForcingChain: "Cadeias Forçadas Dinâmicas",
      DynamicForcingChainPlus: "Cadeias Forçadas Dinâmicas (+)",
      NestedForcingChain: "Cadeias Forçadas Aninhadas",
    },
  };

/** The five difficulty ids the catalog declares, by locale. */
const DIFFICULTY_LABELS: Readonly<
  Record<Locale, Readonly<Record<string, string>>>
> = {
  en: {},
  "pt-BR": {
    easy: "Fácil",
    medium: "Médio",
    hard: "Difícil",
    fiendish: "Infernal",
    diabolical: "Diabólico",
  },
};

export function techniqueName(locale: Locale, id: string, fallback: string): string {
  return TECHNIQUE_NAMES[locale][id] ?? fallback;
}

export function difficultyLabel(locale: Locale, id: string, fallback: string): string {
  return DIFFICULTY_LABELS[locale][id] ?? fallback;
}
