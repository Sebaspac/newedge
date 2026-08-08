/**
 * Section-Text: Audit-SLA-Status (Komponente `AuditSlaStatus`)
 * --------------------------------------------------------------
 * Status-Karte nach erfolgreicher Audit-Anfrage: lebender 24h-Countdown
 * mit Stationen. Alle Texte sind zustandsabhängig (vor/nach Ablauf der
 * SLA-Frist) — die Logik (Countdown, Fortschritt, „delivered") bleibt in
 * der Komponente; hier liegen nur die sichtbaren/aria-Texte.
 *
 * Serialisierbar (CMS-tauglich): nur Strings — kein JSX, keine Funktionen.
 * Strapi-Mapping: Single Type `audit_sla_status`.
 * --------------------------------------------------------------
 */

/** Ein zustandsabhängiger Text (vor / nach Lieferung). */
export interface SlaState {
  /** Solange die SLA-Frist läuft (`delivered === false`). */
  pending: string;
  /** Sobald die Frist abgelaufen / der Report unterwegs ist (`delivered === true`). */
  delivered: string;
}

/** Beschriftung einer Fortschritts-Station. */
export interface SlaStep {
  label: string;
}

export const auditSlaStatus = {
  /** aria-label der Status-Section. */
  sectionAriaLabel: "Status Ihrer Audit-Anfrage",

  /** Eyebrow (Mono-Label) oben in der Karte. */
  eyebrow: {
    pending: "Audit angenommen",
    delivered: "Audit geliefert oder unterwegs",
  } as SlaState,

  /** Überschrift der Karte. */
  heading: {
    pending: "Ihr Audit läuft.",
    delivered: "Prüfen Sie Ihr Postfach.",
  } as SlaState,

  /** Fortschritts-Stationen (Reihenfolge = Render-Reihenfolge). */
  steps: [
    { label: "Eingang bestätigt" },
    { label: "Analyse läuft" },
    { label: "Report" },
  ] as SlaStep[],
};
