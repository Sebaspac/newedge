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
import type { IconName } from "@/content/icons";

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
    eyebrow: "Our process",
    /** Überschrift: statischer Teil + zyklisch animierte Wörter. */
    headingLead: "This is how you build an",
    headingWords: ["AI department.", "operating structure.", "AI roadmap."],
    body: "Three steps, one clear goal. We work iteratively — with full visibility into every step.",
    steps: [
      {
        index: "01",
        title: "Analysis",
        desc: "We create transparency over processes, potential and priorities.",
      },
      {
        index: "02",
        title: "Implementation",
        desc: "We implement Cortex, integrate AI and automate the most important workflows.",
      },
      {
        index: "03",
        title: "Scaling",
        desc: "We develop your company step by step into an AI-driven organization — with measurable efficiency gains.",
      },
    ] as ProcessStep[],
  },

  // ── Panel 2 — Value Pillars ─────────────────────────────────────────────────
  pillarsPanel: {
    eyebrow: "Why NEWEDGE",
    /** Überschrift: statischer Teil + animierte Wörter + Zeile danach. */
    headingLead: "We use AI as a",
    headingWords: ["friend", "engine", "helper", "advantage"],
    headingTail: "for your company.",
    body: "AI only delivers results when it serves your business goals. We combine consulting, development and integration — all from one team.",
    /** Panel image (edgy cropped frame). */
    image: {
      src: "pain-point-kpi-dashboard-hero",
      alt: "Central steering and KPIs: AI running as a system",
    },
    pillars: [
      {
        icon: "Target",
        title: "Strategy & clarity",
        desc: "We analyze your processes, find the real levers and build systems that work — not just impress.",
      },
      {
        icon: "Layers",
        title: "Seamless integration",
        desc: "AI runs directly in your existing systems — ERP, CRM, internal platforms. No disruption, no parallel setup, no friction.",
      },
      {
        icon: "ShieldCheck",
        title: "Data ownership & security",
        desc: "GDPR-compliant architectures where you keep full control. Your data stays your data — internal, secure, auditable.",
      },
    ] as ValuePillar[],
  },
};
