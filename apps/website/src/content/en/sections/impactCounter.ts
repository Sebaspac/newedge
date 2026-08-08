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
  ariaLabel: "NEWEDGE by the numbers",
  eyebrow: "NEWEDGE by the numbers",

  metrics: [
    { prefix: "5–", value: 150, label: "Employees — companies like yours" },
    { value: 30, suffix: " %", label: "Time back in day-to-day work" },
    { value: 4, suffix: "×", label: "your investment pays off" },
    { value: 50, suffix: "+", label: "Companies supported" },
  ] as Metric[],
};
