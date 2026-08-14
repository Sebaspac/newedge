/**
 * Section-Text: Horizontal-Scroll (Prozess + Value Pillars)
 * --------------------------------------------------------------
 * Zwei horizontal gescrollte Panels auf der Startseite:
 *   1) „Unser Prozess" — fünf nummerierte Phasen (Roadmap).
 *   2) „Warum NEWEDGE" — drei Value-Pillars mit Icon.
 * Icons als Name-Strings → über die Icon-Registry austauschbar.
 * Layout-/Animationswerte (Scroll-Offsets, Spaltenraster, Farben)
 * bleiben in der Komponente — das ist kein Inhalt.
 * Strapi-Mapping: Single Type `horizontalScroll` (bzw. Teil von „home").
 * Alle Werte serialisierbar (CMS-tauglich): nur Strings/Arrays/Objects.
 * --------------------------------------------------------------
 */
import type { IconName } from "../icons";

/** Eine nummerierte Phase der Prozess-Roadmap. */
export interface ProcessStep {
  index: string;
  title: string;
  desc: string;
}

/** Ein Value-Pillar mit Icon (Name-String → Icon-Registry). */
export interface ValuePillar {
  icon: IconName;
  title: string;
  desc: string;
}

export const horizontalScroll = {
  // ── Panel 1 — Prozess-Roadmap ───────────────────────────────────────────────
  process: {
    eyebrow: "Unser Prozess",
    /** Überschrift: statischer Teil + zyklisch animierte Wörter. */
    headingLead: "So entsteht eine",
    headingWords: ["KI-Abteilung.", "Betriebsstruktur.", "KI-Roadmap."],
    body: "Drei Schritte, ein klares Ziel. Wir arbeiten iterativ — mit vollem Einblick in jeden Schritt.",
    steps: [
      {
        index: "01",
        title: "Analyse",
        desc: "Wir schaffen Transparenz über Prozesse, Potenziale und Prioritäten.",
      },
      {
        index: "02",
        title: "Umsetzung",
        desc: "Wir implementieren Cortex, integrieren KI und automatisieren die wichtigsten Abläufe.",
      },
      {
        index: "03",
        title: "Skalierung",
        desc: "Wir entwickeln Ihr Unternehmen Schritt für Schritt zur KI-gestützten Organisation — mit messbaren Effizienzgewinnen.",
      },
    ] as ProcessStep[],
  },

  // ── Panel 2 — Value Pillars ─────────────────────────────────────────────────
  pillarsPanel: {
    eyebrow: "Warum NEWEDGE",
    /** Überschrift: statischer Teil + animierte Wörter + Zeile danach. */
    headingLead: "Wir nutzen KI als",
    headingWords: ["Freund", "Motor", "Helfer", "Vorteil"],
    headingTail: "für Ihr Unternehmen.",
    body: "KI bringt erst dann Ergebnisse, wenn sie auf Ihre Geschäftsziele einzahlt. Wir verbinden Beratung, Entwicklung und Integration — aus einer Hand.",
    /** Panel-Bild (edgy geschnittener Rahmen). */
    image: {
      src: "pain-point-kpi-dashboard-hero",
      alt: "Zentrale Steuerung und Kennzahlen: KI als System im Einsatz",
    },
    pillars: [
      {
        icon: "Target",
        title: "Strategie & Klarheit",
        desc: "Wir analysieren Ihre Prozesse, finden die echten Hebel und bauen Systeme, die wirken — nicht bloß beeindrucken.",
      },
      {
        icon: "Layers",
        title: "Nahtlose Integration",
        desc: "KI läuft direkt in Ihren bestehenden Systemen — ERP, CRM, interne Plattformen. Kein Bruch, kein Parallelbetrieb, keine Reibung.",
      },
      {
        icon: "ShieldCheck",
        title: "Datenhoheit & Sicherheit",
        desc: "DSGVO-konforme Architekturen, volle Kontrolle bei Ihnen. Ihre Daten bleiben Ihre Daten — intern, sicher, auditierbar.",
      },
    ] as ValuePillar[],
  },
};
