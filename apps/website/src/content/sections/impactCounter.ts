/**
 * Section-Text: Impact Counter Band („NEWEDGE in Zahlen")
 * --------------------------------------------------------------
 * KPI-/Counter-Band mit hochzählenden Kennzahlen (Komponente
 * `ImpactCounterBand`). `value` ist das Count-up-Ziel (Inhalt);
 * `prefix`/`suffix` bleiben statisch. Animations-Timing liegt
 * bewusst in der Komponente (kein Inhalt).
 * Strapi-Mapping: Single Type `impact-counter` (Repeatable `metrics`).
 * --------------------------------------------------------------
 */

/** Eine KPI-Kachel: statischer Prefix/Suffix + hochzählender Zielwert. */
export interface Metric {
  /** Statisches Präfix vor der Zahl (z. B. "5–"). */
  prefix?: string;
  /** Count-up-Zielwert (Inhalt). */
  value: number;
  /** Statisches Suffix nach der Zahl (z. B. " %", "×", "+"). */
  suffix?: string;
  /** Beschriftung unter der Zahl. */
  label: string;
}

export const impactCounter = {
  /** Section-Label + sichtbarer Eyebrow (identischer Text). */
  ariaLabel: "NEWEDGE in Zahlen",
  eyebrow: "NEWEDGE in Zahlen",

  metrics: [
    { prefix: "5–", value: 150, label: "Mitarbeitende — Unternehmen wie Ihres" },
    { value: 30, suffix: " %", label: "Zeit zurück im Tagesgeschäft" },
    { value: 4, suffix: "×", label: "zahlt sich Ihre Investition aus" },
    { value: 50, suffix: "+", label: "Unternehmen begleitet" },
  ] as Metric[],
};
