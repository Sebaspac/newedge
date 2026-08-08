/**
 * Page: Websites & Web-Plattformen  — Landing (Webentwicklung & Design)
 * --------------------------------------------------------------
 * Standalone-Landing (Struktur wie `pages/kiAudit.ts`): Hero, Showreel
 * (Video + Logo-Grid), Projektablauf (3 Schritte), Projekteinblicke
 * (Case-Karten) und Erstgespräch-CTA. Layout am Referenz-Design
 * orientiert, Optik in NEWEDGE-CI. Voice: informell „ihr/euch" (wie
 * die KI-Audit-Landing).
 * Bilder = vorhandene NEWEDGE-Assets (Platzhalter für echte Projekte,
 * im CMS austauschbar). Serialisierbar (nur Strings/Arrays) — CMS-tauglich.
 * Strapi-Mapping: Single Type `web-design`.
 * --------------------------------------------------------------
 */
import type { SEOContent } from "@/content/types";
import type { ImageKey } from "@/content/assets";

export const webDesign = {
  seo: {
    title: "Web Development for Mid-Sized Companies | NEWEDGE Munich",
    description:
      "NEWEDGE builds custom websites for mid-sized companies that bring you qualified enquiries — strategy, design and development from a single source.",
    canonical: "/en/websites",
  } satisfies SEOContent,

  /** HERO — hell, zentriert (Referenz-Layout), Violett-Akzent. */
  hero: {
    headlinePrefix: "Websites that ",
    headlineAccent: "sell",
    headlineSuffix: " — before you even speak.",
    sub: "Your website is your first salesperson. We build sites that create trust and bring in qualified enquiries — not just look good.",
    trustChips: ["Visitors become customers", "More qualified enquiries", "One point of contact"],
    ctaPrimary: "Request an intro call",
    note: "100% free & no obligation.",
  },

  /** SHOWREEL — dunkle Karte mit Video-Facade + Logo-Grid + Founder-Avatar. */
  showreel: {
    logosHeading: "Growing brands trust NEWEDGE",
    videoCaption: "NEWEDGE — Projects on video",
    founder: { name: "Sebastian", role: "Co-Founder NEWEDGE", image: "team-sebastian" as ImageKey },
  },

  /** PROJEKTABLAUF — 3 Schritte. */
  prozess: {
    eyebrow: "Three steps to a website that sells.",
    heading: "The project process",
    steps: [
      {
        title: "Strategy & branding",
        desc: "We define what you stand for and who for — and build a visual system that makes your quality clear at first glance.",
        image: "painpoint-a-vorher-nachher" as ImageKey,
      },
      {
        title: "Web design",
        desc: "A fast, custom design that convinces visitors and deliberately leads to enquiries — not just one that pleases.",
        image: "albanova-website" as ImageKey,
      },
      {
        title: "Development",
        desc: "Cleanly built and grows with you: fast, flexible and easy to maintain — in the end it's all yours, with no agency lock-in.",
        image: "painpoint-a-feature2" as ImageKey,
      },
    ],
    ctaPrimary: "Request an intro call",
    note: "100% free & no obligation.",
  },

  /** PROJEKTEINBLICKE — Case-Karten (Logo + Text + Projekt-Visual). */
  cases: {
    eyebrow: "Projects",
    heading: "Project highlights",
    items: [
      {
        logo: "logo-albanova-consulting" as ImageKey,
        name: "AlbaNova Consulting",
        desc: "From vision to market presence: a new website and a consistent brand presence — clearly positioned, high-end, built for enquiries.",
        imageDesktop: "albanova-website" as ImageKey,
        imagePhone: "pain-point-kundensupport-hero" as ImageKey,
      },
      {
        logo: "logo-elite-aesthetic" as ImageKey,
        name: "Elite Aesthetic",
        desc: "A digital presence that reflects the premium positioning — design and online booking interlock and feel instantly professional.",
        imageDesktop: "pain-point-professional-services-hero" as ImageKey,
        imagePhone: "pain-point-health-care-hero" as ImageKey,
      },
      {
        logo: "logo-becoming-you" as ImageKey,
        name: "Becoming You",
        desc: "A platform that grows with you: a custom interface, a clean foundation and a system the team can maintain on its own.",
        imageDesktop: "painpoint-a-section3" as ImageKey,
        imagePhone: "pain-point-kpi-dashboard-hero" as ImageKey,
      },
    ],
  },

  /** ERSTGESPRÄCH — dunkle Abschluss-Sektion (Avatar → Heading → Sub → CTA → Logo-Cloud). */
  finalCta: {
    eyebrow: "Let's get started",
    heading: "Book an intro call",
    sub: "In a short intro call, we look together at whether and where a project makes sense — based on your situation and goals.",
    ctaPrimary: "Request an intro call",
    note: "100% free & no obligation.",
  },
} as const;
