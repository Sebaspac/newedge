/**
 * Section-Text: Local AI infrastructure (Home) — EN mirror of sections/cortex.ts
 * --------------------------------------------------------------
 * "Your AI. Your servers. Your data." — hub diagram with feature
 * list (component `CortexSection`).
 *
 * Content focus (plan change 2026-07-28): the module no longer explains
 * Cortex as a product only, but the LOCAL INFRASTRUCTURE as a whole —
 * everything needed to run AI models in-house. What is built on top of
 * it is covered by the following module (`builtOnTop`).
 *
 * Text only — layout coordinates, colours and SVG geometry stay in the
 * component. All fields are serialisable (CMS-ready): strings/arrays
 * only — no JSX, no functions.
 * Strapi mapping: single type `cortex-en` (or part of the home page).
 * --------------------------------------------------------------
 */

import type { CortexSpoke } from "../../sections/cortex";

export const cortex = {
  /** Section `aria-label`. */
  ariaLabel: "Local AI infrastructure — your AI runs in-house",

  eyebrow: "Local infrastructure",
  heading: "Your AI. Your servers. Your data.",
  subtitle:
    "We build the complete infrastructure that runs capable AI models inside your own company — GDPR-compliant, without a single record leaving the building.",

  /** Left mini column: status quo. */
  today: {
    label: "Today you often find",
    items: [
      "Company data in ChatGPT & Copilot",
      "Point tools without control",
      "Tool sprawl (shadow IT)",
      "Unresolved GDPR questions",
    ],
  },

  /** Right mini column: target state (= feature list titles). */
  results: {
    label: "The result",
    items: [
      "Your data never leaves the building",
      "Legally sound instead of grey area",
      "One access point for every employee",
      "The foundation for everything else",
    ],
  },

  /** Explanatory paragraph below the divider. */
  body:
    "From hardware to models to access rights: we provide everything your company needs to use AI productively — while keeping control over data, access and cost.",

  /** Text button (scrolls to the CTA section). */
  cta: "Explore the infrastructure →",

  /** Hub diagram. */
  diagram: {
    /** SVG `aria-label`. */
    ariaLabel:
      "The local infrastructure connects people, data, processes, AI assistants and control",
    /** Labels of the outer nodes (order = layout order). */
    spokes: [
      { label: "PEOPLE" },
      { label: "DATA" },
      { label: "PROCESSES" },
      { label: "AI ASSISTANTS" },
      { label: "CONTROL" },
    ] as CortexSpoke[],
    /** Central node — two lines, reads as one term. */
    centerLabel: "CENTRAL",
    centerSublabel: "INFRASTRUCTURE",
  },
};
