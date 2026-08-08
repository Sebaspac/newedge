/**
 * Section-Text: What runs on the infrastructure (home) — EN mirror
 * --------------------------------------------------------------
 * Follow-up module to the local infrastructure (`sections/cortex.ts`):
 * once the foundation is in place, the actual applications are built on
 * top — company GPT, AI agents, automated processes, central dashboards,
 * internal projects and, on request, a white-label AI offering.
 *
 * Product ladder: phases 4–6 (automation → embedded AI → digital
 * workforce). Deliberately AFTER the infrastructure module.
 *
 * Text only (CMS-ready: strings/arrays). Icons are resolved in the
 * component via the `icon` key.
 * Not yet a Strapi field (static fallback applies).
 * --------------------------------------------------------------
 */

import type { BuiltOnTopItem } from "../../sections/builtOnTop";

export const builtOnTop = {
  /** Section `aria-label`. */
  ariaLabel: "Applications running on your local AI infrastructure",

  eyebrow: "Built on top",
  heading: "With the foundation in place, it gets concrete.",
  subtitle:
    "Your infrastructure carries the applications that make the difference day to day — from your own chat solution to a digital workforce.",

  items: [
    {
      icon: "chat",
      title: "Your own company GPT",
      desc: "A chat that knows your company: your documents, your processes, your language. For every employee — without company knowledge leaving the building.",
    },
    {
      icon: "agent",
      title: "AI agents that do the work",
      desc: "Digital workers take over recurring tasks entirely. Not an assistant that helps out — but the task, done.",
    },
    {
      icon: "process",
      title: "Processes that run themselves",
      desc: "Quotes, invoices, document checks: what ties up hands today runs through automatically — and only speaks up when something deviates.",
    },
    {
      icon: "dashboard",
      title: "Your numbers in one place",
      desc: "Central dashboards bring together what is scattered across ERP, CRM and Excel today. Current to the day instead of a weekly review.",
    },
    {
      icon: "project",
      title: "Internal projects, built together",
      desc: "Whatever your business specifically needs, we build on top of it — from prototype to live operation.",
    },
    {
      icon: "whitelabel",
      title: "Your own AI offering",
      desc: "As a white label on request: you offer AI services to your customers under your own name — we stay in the engine room.",
    },
  ] as BuiltOnTopItem[],

  /** Text button (scrolls to the CTA section). */
  cta: "Discuss the options →",
};
