/**
 * Page: Cortex — Landingpage (Single Type)
 * --------------------------------------------------------------
 * Eigenständige Landingpage NUR für Cortex, strukturell 1:1 wie
 * die KI-Audit-Landing (`pages/kiAudit.ts` + `pages/KiAudit.tsx`).
 * Inhalt abgeleitet aus `sections/cortex.ts` + `sections/cortexFeatures.ts`
 * (keine neuen Produkt-Claims). Voice: informell „ihr/euch" wie die
 * KI-Audit-Landing.
 * Eigener useCms-Key `cortex-page` (der Key `cortex` ist bereits durch
 * die Home-Section belegt → Kollision vermieden; greift statischer Fallback).
 * --------------------------------------------------------------
 */
import type { SEOContent, ImageRef } from "@/content/types";

interface ProcessStep {
  step: string;
  title: string;
  desc: string;
}

export const cortexPage = {
  seo: {
    title: "Cortex: Secure AI Platform for Midsize Companies | NEWEDGE",
    description:
      "Cortex is the central AI platform for midsize companies: one secure access point for your team, full control over usage and data — GDPR-compliant and in-house.",
    canonical: "/en/cortex",
  } satisfies SEOContent,

  /** 1 — Hero. */
  hero: {
    headline: "You already use AI. Cortex makes it controllable.",
    sub:
      "Cortex is the operating system of your AI department: one entry point for your people, full control over usage, data and automations. GDPR-compliant, in-house, traceable at any time.",
    ctaPrimary: "Get to know Cortex",
    ctaSecondary: "Check if it fits",
    image: {
      src: "pain-point-kpi-dashboard-hero",
      alt: "Cortex — the central control layer for AI in your company",
    } satisfies ImageRef,
  },

  /** 2 — Problem. */
  problem: {
    heading: "This is how AI runs in most companies today.",
    situations: [
      "ChatGPT, Copilot and a dozen point tools — everyone uses something different, no one has the full picture.",
      "Shadow IT: data ends up in tools no one has approved — GDPR risk included.",
      "No one steers AI centrally. Responsibilities are unclear, and automations stay isolated one-offs.",
    ],
  },

  /** 3 — Lösung / Mechanismus. */
  solution: {
    heading: "One entry point. One layer. Full control.",
    intro:
      "Cortex is the shared operating layer for AI in your company: your company knowledge, your permissions, your systems and continuous monitoring in one place. Your employees work with approved, productive AI — you keep control over usage, data, processes and automations.",
    bullets: [
      "Transparency over AI usage — instead of shadow IT, you see who uses AI for what, and you define who is allowed to do what.",
      "Your knowledge and systems connected — documents, processes and existing software work together, GDPR-compliant and in-house.",
      "Central control — one entry point for your people instead of ten point tools on the side; the AI model running in the background can be swapped at any time.",
      "A foundation for automations — tasks are orchestrated, critical steps go through human approval, and operations are monitored and logged.",
    ],
  },

  /** 4 — Ablauf. */
  ablauf: {
    heading: "How Cortex comes into your company.",
    image: {
      src: "pain-point-kpi-dashboard-hero",
      alt: "Rolling out Cortex in a company",
    } satisfies ImageRef,
    steps: [
      {
        step: "01",
        title: "Setup",
        desc: "We set Cortex up for you — GDPR-compliant and with clear rules on who's allowed to do what.",
      },
      {
        step: "02",
        title: "Access",
        desc: "Your employees get one central, approved way into productive AI — no more point tools running on the side.",
      },
      {
        step: "03",
        title: "Transparency",
        desc: "You see in real time who uses AI for what. Shadow IT becomes visible and controllable.",
      },
      {
        step: "04",
        title: "Automation",
        desc: "Step by step, you build out automations that take real work off your plate — all on the same base.",
      },
    ] as ProcessStep[],
  },

  /** 5 — Warum Cortex. */
  warum: {
    heading: "Why Cortex.",
    points: [
      "Cortex isn't another AI — it's the layer above them. You don't have to throw away anything that already works.",
      "Your data stays your data. No black box, no unwanted data outflow — you can trace what happens at any time.",
      "We build the AI department for mid-sized companies. Cortex is the foundation, not the finished product.",
    ],
  },

  /** 6 — Garantie. */
  garantie: {
    heading: "The guarantee.",
    text:
      "Your data stays in-house — GDPR-compliant and traceable at any time.",
    sub: "No black box, no unwanted data outflow. You stay in control.",
    image: {
      src: "team-presentation-color",
      alt: "NEWEDGE founders working with the team",
    },
  },

  /** 7 — Für wen / nicht. */
  fit: {
    heading: "Who Cortex is for — and who it's not.",
    passtLabel: "It fits if:",
    passt: [
      "Several people already use AI at your company — but no one has the full picture.",
      "You want to keep AI in-house: GDPR-compliant, controlled, traceable at any time.",
      "You want a foundation for automations to grow on — not yet another point tool.",
    ],
    passtNichtLabel: "It doesn't fit if:",
    passtNicht: [
      "You're looking for a single tool to try out — Cortex is the control layer above your tools.",
      "No one at your company uses AI and no one is meant to — then the basis is missing.",
      "You deliberately want to push data into arbitrary external tools — that's exactly what Cortex prevents.",
    ],
  },

  /** FAQ — Landing-Page-Fragen (Voice: informell „ihr/euch"). */
  faq: {
    heading: "FAQ",
    items: [
      { q: "Does Cortex replace ChatGPT or Copilot?", a: "No. Cortex is the layer above: it connects your company knowledge, your systems and permissions, orchestrates the work and logs what happens — which AI services run behind it, such as ChatGPT or Copilot, stays exchangeable." },
      { q: "Does our data really stay in-house?", a: "Yes. Cortex runs on GDPR-compliant systems we control — your data stays in-house, secure and traceable at any time." },
      { q: "How quickly is Cortex ready to use?", a: "The basic setup is usually in place within a few days. From there, Cortex grows with your processes and automations." },
      { q: "Do we have to switch off existing tools?", a: "No. Cortex layers over what's already running and brings it under shared control." },
      { q: "What company size does Cortex make sense for?", a: "It pays off most for companies with 10 to 150 employees where AI is already used in scattered ways." },
      { q: "What does Cortex cost?", a: "That depends on scope and number of users. In a free, no-obligation intro call we work out what makes sense for you." },
    ],
  },

  /** 8 — CTA / Kontakt (aktuell über geteilte SpeakWithUsCta-Karte gerendert). */
  cta: {
    heading: "Get to know Cortex.",
    sub: "A conversation, not a sales pitch. We show you Cortex and figure out together whether it fits.",
    transparency: "First contact → demo → decision on both sides.",
    calendlyUrl: "",
  },
} as const;
