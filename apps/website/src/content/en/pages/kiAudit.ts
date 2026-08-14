/**
 * Page: KI-Audit  — Single Type
 * --------------------------------------------------------------
 * Landingpage für das einzige extern kommunizierte Angebot:
 * „KI-Readiness & ROI-Analyse" (Track A der Customer Journey).
 * Direkter Funnel Hero → Fahrplan-Gespräch, kein E-Mail-Gate.
 * Strapi-Mapping: Single Type `ki-audit`.
 * --------------------------------------------------------------
 */
import type { SEOContent, ImageRef } from "@/content/types";

interface ProcessStep {
  step: string;
  title: string;
  desc: string;
}

export const kiAudit = {
  seo: {
    title: "AI Audit for Mid-Sized Companies: Is AI Worth It? | NEWEDGE",
    description:
      "The AI audit for mid-sized companies: the 3 processes with the biggest AI leverage in 5–10 business days, with an effort-benefit estimate. BAFA-eligible.",
    canonical: "/en/ki-audit",
  } satisfies SEOContent,

  /** 1 — Hero. */
  hero: {
    headline: "You've wanted AI for a while. What's missing is the first step.",
    sub:
      "We build the AI department for mid-sized companies. The analysis shows which three processes are worth tackling first — no tool sales, no seminar, a clear roadmap.",
    ctaPrimary: "Book a free roadmap call",
    ctaSecondary: "Check if it fits",
    image: {
      src: "ki-audit-hero",
      alt: "Process-mapping call between NEWEDGE and a mid-sized company",
    } satisfies ImageRef,
  },

  /** 2 — Problem. */
  problem: {
    heading: "These are the three sentences we hear most often.",
    situations: [
      "ChatGPT is running, a few automations too — and still there's no system that helps the whole company.",
      "We know AI matters. We're just missing the right first step.",
      "No one in the company owns AI — every initiative fizzles out in day-to-day work.",
    ],
  },

  /** 3 — Lösung / Mechanismus. */
  solution: {
    heading: "One analysis. Three prioritized processes. One roadmap.",
    intro:
      "In roughly 25 hours, spread across 5 to 10 business days, we find the three processes in your company where AI and automation deliver the most — with an effort-benefit estimate. You set the priorities yourself.",
    bullets: [
      "Three concrete AI applications with a clear priority — not a list of fifty ideas, but the ones that truly pay off.",
      "An effort-benefit estimate per application — the basis for your internal decision.",
      "A report you can pass on internally — no black box, no consultant-speak.",
      "Funding pointer: the audit may qualify for government funding (BAFA) — noticeably lowering your entry cost.",
    ],
  },

  /** 4 — Ablauf. */
  ablauf: {
    heading: "The process in four steps.",
    image: {
      src: "ki-audit-process",
      alt: "Strategic planning and prioritization within a team",
    } satisfies ImageRef,
    steps: [
      {
        step: "01",
        title: "Preparation",
        desc: "A short questionnaire up front, so we can focus the conversation directly on your processes.",
      },
      {
        step: "02",
        title: "Process-mapping call",
        desc: "Around 60–90 minutes with the people who really know your workflows. We listen before we judge.",
      },
      {
        step: "03",
        title: "Assessment & prioritization",
        desc: "We assess every identified process by effort and benefit and prioritize the three with the highest leverage.",
      },
      {
        step: "04",
        title: "Report & roadmap handover",
        desc: "You get the full report plus a call where we walk through the roadmap together.",
      },
    ] as ProcessStep[],
  },

  /** 5 — Warum NEWEDGE. */
  warum: {
    heading: "Why work with us.",
    points: [
      "We'll also tell you when the timing isn't right — directly, even if that means the audit doesn't turn into a project.",
      "We don't sell a tool. The analysis is vendor-independent — the result is your priority, not our product catalog.",
      "We talk to you as equals. No slide battle, no jargon — a conversation between people who have to deliver.",
    ],
  },

  /** 6 — Garantie. */
  garantie: {
    heading: "The guarantee.",
    text:
      "At least three actionable AI applications from your audit. Guaranteed — or you don't pay.",
    sub: "Actionable means: with effort, benefit and a first step — not a list of ideas.",
    image: {
      src: "team-presentation-color",
      alt: "NEWEDGE founders working with the team",
    },
  },

  /** 7 — Für wen / nicht. */
  fit: {
    heading: "Who it's for — and who it's not.",
    passtLabel: "It fits if:",
    passt: [
      "You have 10 to 150 employees and want to know where AI concretely applies for you.",
      "You've already tried ChatGPT or a few first automation tools, but with no system behind it.",
      "You want a basis for a decision, not another opinion.",
    ],
    passtNichtLabel: "It doesn't fit if:",
    passtNicht: [
      "You're looking for a finished tool to buy right away — that's not what we deliver.",
      "You just want a no-strings look around without investing your own time — the process-mapping call needs your people.",
      "You already have a finished AI strategy and only need execution — then talk to us directly about the next step.",
    ],
  },

  /** FAQ — Landing-Page-Fragen (Voice: informell „ihr/euch"). */
  faq: {
    heading: "FAQ",
    items: [
      { q: "What does the audit cost?", a: "The intro call is free and no-obligation. We'll tell you the exact price for the audit openly in that call. And it's backed up: if we don't find three actionable AI applications, you pay nothing." },
      { q: "How long does the whole thing take?", a: "From the intro call to the finished roadmap usually takes one to two weeks — depending on how quickly we get insight into your processes." },
      { q: "Do we already need to be using AI?", a: "No. Whether you've already tried ChatGPT or you're starting from scratch makes no difference." },
      { q: "What exactly do we get in the end?", a: "A prioritized list of actionable AI applications with an effort-benefit assessment and a concrete roadmap — a basis for a decision, not another opinion." },
      { q: "Is this a sales call?", a: "No. We listen and check whether it fits. Whether we work together is a decision both sides make at the end." },
      { q: "What company size does this pay off for?", a: "Most of all for companies with 10 to 150 employees that have enough processes for real leverage but no AI department of their own yet." },
    ],
  },

  /** 8 — CTA / Kontakt. */
  cta: {
    heading: "Book a free roadmap call.",
    sub: "A conversation, not a sales pitch. We listen and check whether it fits — the decision is one both sides make at the end.",
    transparency: "First contact → call → decision on both sides.",
    calendlyUrl: "",
  },
} as const;
